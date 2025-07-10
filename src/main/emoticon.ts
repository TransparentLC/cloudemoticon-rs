import fnv1a from '@sindresorhus/fnv1a';
import { emit } from '@tauri-apps/api/event';
import { join } from '@tauri-apps/api/path';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import wretch from 'wretch';
import { emoticonCacheDir } from './path';
import store from './store';

const dp = new DOMParser();

export const getCacheKey = (source: string) =>
    Number(fnv1a(source, { size: 64 }))
        .toString(36)
        .substring(0, 12);

export const parseXMLEmoticonRepository = (xml: string): EmoticonRepository => {
    const doc = dp.parseFromString(xml, 'application/xml');
    return {
        categories: Array.from(doc.querySelectorAll('emoji > category')).map(
            e => ({
                // biome-ignore lint: name应该是一定存在的
                name: e.getAttribute('name')!,
                entries: Array.from(e.querySelectorAll('entry')).map(t => ({
                    // biome-ignore lint: emoticon应该是一定存在的
                    emoticon: t.querySelector('string')!.textContent!,
                    description: t.querySelector('note')?.textContent || '',
                })),
            }),
        ),
        information: Array.from(
            doc.querySelectorAll('emoji > infoos > info'),
        ).map(e => e.textContent || ''),
    };
};

export const fetchCachedEmoticon = async (
    source: string,
): Promise<Emoticon | null> => {
    if (!URL.canParse(source)) throw new Error('Invalid source');
    const isLocal = !source.match(/^https?:\/\//);
    const cacheKey = getCacheKey(source);
    try {
        const metadata: EmoticonMetadata = JSON.parse(
            await readTextFile(
                await join(emoticonCacheDir, `${cacheKey}.meta.json`),
            ),
        );
        const repository: EmoticonRepository = JSON.parse(
            await readTextFile(
                await join(emoticonCacheDir, `${cacheKey}.json`),
            ),
        );
        return { source, isLocal, metadata, repository };
    } catch {
        return null;
    }
};

export const fetchEmoticon = async (source: string): Promise<Emoticon> => {
    if (!URL.canParse(source)) throw new Error('Invalid source');
    const isLocal = !source.match(/^https?:\/\//);
    const metadata: EmoticonMetadata = isLocal
        ? JSON.parse(await readTextFile(source))
        : await wretch(source).get().json();
    let repoSource: string;
    switch (metadata.location.type) {
        case 'remoteJson':
            repoSource = metadata.location.remoteUrl;
            break;
        case 'localJson':
            repoSource = source.replace(/\.meta\.json$/i, '.json');
            break;
        case 'localXml':
            repoSource = source.replace(/\.meta\.json$/i, '.xml');
            break;
    }
    const repositoryText = !repoSource.match(/^https?:\/\//)
        ? await readTextFile(repoSource)
        : await wretch(repoSource).get().text();
    const repository: EmoticonRepository = (
        metadata.location.type === 'localXml'
            ? parseXMLEmoticonRepository
            : JSON.parse
    )(repositoryText);
    return { source, isLocal, metadata, repository };
};

export const cacheEmoticon = async (emoticon: Emoticon) => {
    const cacheKey = getCacheKey(emoticon.source);
    await writeTextFile(
        await join(emoticonCacheDir, `${cacheKey}.meta.json`),
        JSON.stringify(emoticon.metadata),
    );
    await writeTextFile(
        await join(emoticonCacheDir, `${cacheKey}.json`),
        JSON.stringify(emoticon.repository),
    );
};

export const updateSources = (useCache: boolean) =>
    Promise.all(
        store.sources.map(async source => {
            const cacheKey = getCacheKey(source);
            if (useCache) {
                const emoticonCached = await fetchCachedEmoticon(source);
                if (emoticonCached !== null) {
                    store.emoticon.set(cacheKey, emoticonCached);
                    await emit('update-emoticon', {
                        key: cacheKey,
                        value: emoticonCached,
                    });
                }
            }
            const emoticon = await fetchEmoticon(source);
            store.emoticon.set(cacheKey, emoticon);
            await emit('update-emoticon', { key: cacheKey, value: emoticon });
            await cacheEmoticon(emoticon);
        }),
    );

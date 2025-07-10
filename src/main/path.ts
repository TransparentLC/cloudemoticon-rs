import { appCacheDir, appConfigDir, join } from '@tauri-apps/api/path';

export const configDir = await appConfigDir();
export const cacheDir = await appCacheDir();
export const configFile = await join(configDir, 'config.json');
export const sourcesFile = await join(configDir, 'sources.json');
export const emoticonCacheDir = await join(cacheDir, 'emoticon');

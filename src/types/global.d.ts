// biome-ignore-all lint/correctness/noUnusedVariables: no explanation

interface Window {
    chiya: {
        message: import('naive-ui').MessageProviderInst;
        dialog: import('naive-ui').DialogProviderInst & {
            alert: (options: import('naive-ui').DialogOptions) => Promise<void>;
            confirm: (
                options: import('naive-ui').DialogOptions,
            ) => Promise<boolean | null>;
            prompt: (
                options: import('naive-ui').DialogOptions & {
                    defaultValue?: string;
                    placeholder?: string;
                },
            ) => Promise<string | null>;
        };
        notification: import('naive-ui').NotificationProviderInst;
    };
}

// https://github.com/cloud-emoticon/store-repos/blob/master/linter/src/api/RepositoryMetadata.ts
type EmoticonMetadata = {
    $schema?: 'https://github.com/cloud-emoticon/store-repos/raw/master/schema/RepositoryMetadata.json';
    name: string;
    location:
        | {
              type: 'localJson' | 'localXml';
          }
        | {
              type: 'remoteJson';
              remoteUrl: string;
          };
    description: string;
    author: {
        name: string;
        url?: string;
        avatarUrl?: string;
    };
};
// https://github.com/cloud-emoticon/store-repos/blob/master/linter/src/api/JsonRepository.ts
type EmoticonRepository = {
    $schema?: 'https://github.com/cloud-emoticon/store-repos/raw/master/schema/JsonRepository.json';
    information: string[];
    categories: {
        name: string;
        entries: {
            description: string;
            emoticon: string;
        }[];
    }[];
};
type Emoticon = {
    source: string;
    isLocal: boolean;
    metadata: EmoticonMetadata;
    repository: EmoticonRepository;
};

type CloudEmoticonConfig = {
    theme: 'auto' | 'light' | 'dark';
    mode: 'auto-input' | 'copy-paste';
    shortcut: string;
    updateInterval: number;
    storeRepository: string;
};

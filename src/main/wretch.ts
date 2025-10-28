import { fetch } from '@tauri-apps/plugin-http';
import wretch from 'wretch';

export default wretch().fetchPolyfill(fetch);

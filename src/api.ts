import { analyzeMessage, analyzeUrl, type Assessment } from './engine';
/** Local prototype adapter. Replace these implementations with authenticated FastAPI requests when a backend exists. No network requests are currently made. */
export async function assess(type: 'Message' | 'URL', input: string): Promise<Assessment> {
 await new Promise(resolve => setTimeout(resolve, 650));
 return type === 'Message' ? analyzeMessage(input) : analyzeUrl(input);
}
/** Future backend health endpoint placeholder; intentionally does not claim connectivity. */
export async function backendStatus() { return { connected: false, mode: 'local-prototype' as const }; }

/**
 * https://github.com/TypeStrong/ts-loader#loading-other-resources-and-code-splitting
 */
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

// https://github.com/api-ai/api-ai-javascript/blob/v2/declarations.d.ts
interface Navigator {
    Resampler: any
}
interface AudioContext {
    createResampleProcessor: Function
}
interface Window {
    speechSynthesis: any
}

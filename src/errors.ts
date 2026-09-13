export class ProviderConfigurationError extends Error { readonly recoverable = false }
export class ModelProviderError extends Error { constructor(message: string, readonly recoverable: boolean, readonly provider: string) { super(message) } }
export class SandboxExecutionError extends Error { constructor(message: string, readonly recoverable: boolean, readonly code: string) { super(message) } }
export function errorMessage(error: unknown): string { return error instanceof Error ? error.message : 'Unknown execution error' }

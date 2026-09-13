export async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([operation, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error('OPERATION_TIMEOUT')), timeoutMs) })])
  } finally { if (timer) clearTimeout(timer) }
}

export async function withBoundedRetry<T>(operation: (attempt: number) => Promise<T>, maxRetries: number): Promise<{ value: T; retries: number }> {
  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try { return { value: await operation(attempt), retries: attempt } } catch (error) { lastError = error }
  }
  throw lastError
}

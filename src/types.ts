export type TaskStatus = 'pending' | 'planning' | 'awaiting_approval' | 'running' | 'validating' | 'completed' | 'failed' | 'cancelled'
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface Bindings {
  DB: D1Database
  APP_SIGNING_SECRET: string
  OPENAI_API_KEY?: string
  OPENAI_BASE_URL?: string
  OPENAI_MODEL?: string
  ANTHROPIC_API_KEY?: string
  ANTHROPIC_BASE_URL?: string
  ANTHROPIC_MODEL?: string
  E2B_API_KEY?: string
  E2B_SANDBOX?: string
  MAX_TASK_BUDGET_USD?: string
}

export interface TenantContext { tenantId: string; userId: string }
export interface PlanStep { id: string; type: 'generate_code' | 'execute_code' | 'validate_result'; tool?: 'code_exec'; requiresApproval: boolean }
export interface TaskPlan { version: 1; goal: string; capability: 'coding_script'; riskLevel: 'low'; steps: PlanStep[] }

export interface GeneratedCode {
  language: 'python' | 'javascript'
  filename: string
  code: string
  command: string
  explanation: string
}

export interface UsageMetadata { provider: string; model: string; inputTokens?: number; outputTokens?: number; estimatedCostUsd?: number }
export interface ModelResult<T> { value: T; usage: UsageMetadata; rawId?: string }
export interface ExecutionResult {
  sessionId: string
  provider: string
  command: string
  stdout: string
  stderr: string
  exitCode: number
  durationMs: number
  timedOut: boolean
}

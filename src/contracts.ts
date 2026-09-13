import { z } from 'zod'

export const taskInputSchema = z.object({ goal: z.string().trim().min(10).max(4000), deliberateFailure: z.boolean().optional().default(false) }).strict()
export const generatedCodeSchema = z.object({
  language: z.enum(['python', 'javascript']),
  filename: z.string().regex(/^[a-zA-Z0-9._-]{1,80}$/),
  code: z.string().min(10).max(50_000),
  command: z.string().min(3).max(300),
  explanation: z.string().min(3).max(2000),
}).strict().superRefine((value, ctx) => {
  const expected = value.language === 'python' ? /^python3?\s+[a-zA-Z0-9._-]+$/ : /^node\s+[a-zA-Z0-9._-]+$/
  if (!expected.test(value.command)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['command'], message: 'Only direct python/node execution is allowed' })
  if (!value.command.endsWith(value.filename)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['command'], message: 'Command must execute generated filename' })
})

export const codeExecInputSchema = z.object({ filename: z.string(), code: z.string(), command: z.string(), timeoutSeconds: z.number().int().min(1).max(120) }).strict()
export const codeExecOutputSchema = z.object({ sessionId: z.string(), provider: z.string(), command: z.string(), stdout: z.string(), stderr: z.string(), exitCode: z.number().int(), durationMs: z.number().nonnegative(), timedOut: z.boolean() }).strict()

export const codeExecContract = {
  name: 'code_exec', description: 'Execute validated code in an isolated E2B sandbox', riskLevel: 'low', requiredScopes: ['sandbox.execute'],
  inputSchema: codeExecInputSchema, outputSchema: codeExecOutputSchema, supportsDryRun: true, idempotencyRequired: true, timeoutSeconds: 120,
} as const

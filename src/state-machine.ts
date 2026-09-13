import type { TaskStatus } from './types'

export const transitions: Record<TaskStatus, readonly TaskStatus[]> = {
  pending: ['planning', 'cancelled'],
  planning: ['awaiting_approval', 'running', 'failed', 'cancelled'],
  awaiting_approval: ['running', 'cancelled'],
  running: ['validating', 'failed', 'cancelled'],
  validating: ['completed', 'failed', 'cancelled'],
  completed: [],
  failed: [],
  cancelled: [],
}

export class InvalidStateTransition extends Error {
  constructor(from: TaskStatus, to: TaskStatus) { super(`Invalid task transition: ${from} -> ${to}`) }
}

export function assertTransition(from: TaskStatus, to: TaskStatus): void {
  if (!transitions[from].includes(to)) throw new InvalidStateTransition(from, to)
}

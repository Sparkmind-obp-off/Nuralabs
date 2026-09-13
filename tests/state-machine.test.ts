import { describe, expect, it } from 'vitest'
import { assertTransition, InvalidStateTransition } from '../src/state-machine'

describe('task state machine', () => {
  it('accepts the verified completion path', () => { assertTransition('pending','planning'); assertTransition('planning','running'); assertTransition('running','validating'); assertTransition('validating','completed') })
  it('rejects completion directly from model planning', () => { expect(() => assertTransition('planning','completed')).toThrow(InvalidStateTransition) })
  it('keeps terminal states terminal', () => { expect(() => assertTransition('failed','running')).toThrow('Invalid task transition') })
})

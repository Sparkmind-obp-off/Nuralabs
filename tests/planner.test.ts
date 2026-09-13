import { describe, expect, it } from 'vitest'
import { createPlan, UnsupportedCapabilityError } from '../src/planner'

describe('minimal planner', () => {
  it('creates a portable workflow graph', () => { const plan = createPlan('Buat script Python yang mencetak bilangan prima'); expect(plan.version).toBe(1); expect(plan.steps.map(step => step.type)).toEqual(['generate_code','execute_code','validate_result']) })
  it('flags external side effects outside MVP', () => { expect(() => createPlan('Tolong transfer uang ke rekening ini')).toThrow(UnsupportedCapabilityError) })
})

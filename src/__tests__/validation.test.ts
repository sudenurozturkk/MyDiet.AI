import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { parseJsonSafe } from '@/lib/validation'

describe('parseJsonSafe', () => {
  it('returns ok with valid data', () => {
    const schema = z.object({ a: z.string() })
    const res = parseJsonSafe({ a: 'x' }, schema)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data.a).toBe('x')
  })

  it('returns error with invalid data', () => {
    const schema = z.object({ a: z.string() })
    const res = parseJsonSafe({ a: 1 }, schema)
    expect(res.ok).toBe(false)
  })
})



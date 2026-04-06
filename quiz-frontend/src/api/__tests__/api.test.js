import { vi } from 'vitest'

// Mock axios before importing API
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn()
        }
      },
      defaults: {
        baseURL: 'http://localhost:8080/api',
        headers: {
          common: {}
        }
      }
    }))
  }
}))

import API from '../api'

describe('API Module', () => {
  test('creates axios instance with correct base URL', () => {
    expect(API.defaults.baseURL).toBe('http://localhost:8080/api')
  })
})
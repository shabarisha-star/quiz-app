import '@testing-library/jest-dom'
import { expect, vi } from 'vitest'
import * as React from 'react'

// Make React available globally for JSX
global.React = React

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: 'http://localhost:8080/api',
}), { virtual: true })
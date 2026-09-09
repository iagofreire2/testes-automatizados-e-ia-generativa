// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  if (typeof args[0] === 'string' && typeof args[1] === 'string') {
    return originalFn({
      method: args[0],
      url: args[1],
      failOnStatusCode: false
    })
  }
  return originalFn(...args)
})
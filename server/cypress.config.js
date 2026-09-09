const { defineConfig } = require("cypress");

module.exports = defineConfig({
  expose: {
    API_URL: 'http://localhost:3001'
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})

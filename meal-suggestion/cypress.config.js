const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://meal-suggestion.s3.eu-central-1.amazonaws.com',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
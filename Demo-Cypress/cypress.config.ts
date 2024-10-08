import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://reqres.in/",
    pageLoadTimeout: 120000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

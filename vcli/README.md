# PPR Vue CLI
This sub-project contains the version of Vue CLI used to create the Vue client. Can also be used to update this client and to run a Vue CLI web UI

The sub-project was created as follows
```shell script
npm install
# follow and fill in prompts
npm install  @vue/cli —save
```

Then to run the local copy of Vue CLI run, for example
```shell script
node  node_modules/@vue/cli/bin/vue.js create my-client
```
to create a Vue Hello World project in a new folder called ```my-client```


```shell script
node  node_modules/@vue/cli/bin/vue.js create ppr-client
```
Follow the prompts. There is an option to select a manual set of options. For the initial POC we selected all options available. Including:
   - Babel
   - TypeScript
   - Progressive Web App (PWA) Support
   - Router
   - Vuex
   - CSS Pre-processors
   - Linter / Formatter
   - Unit Testing
   - E2E Testing

The initial version selected the following:
``` 
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, TS, PWA, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use class-style component syntax? Yes
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Less
? Pick a linter / formatter config: Basic
? Pick additional lint features: 
? Pick a unit testing solution: Jest
? Pick a E2E testing solution: Nightwatch
? Pick browsers to run end-to-end test on (Press <space> to select, <a> to toggle all, <i> to invert selection)Chrome, Firefox
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N) y
```

## Last step
After running the create the new client project folder was moved to the root
```shell script
mv ppr-client ..
``` 

This clears the way to run the create again, after say, updating the Vue CLI installed here. Then a dev can compare the new with the old and adjust as needed.



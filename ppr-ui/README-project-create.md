# PPR Vue CLI & Create

This project was created using the Vue CLI and the create command.  

To run Vue CLI UI from the vcli subfolder 
```shell script
cd vcli
node  node_modules/@vue/cli/bin/vue.js ui
```

If there comes a time when we wish to update this Vue client then we recommend the following process.

## Setup Vue CLI - local
Create a subdirectory '''vcli'''
```shell script
mkdir vcli
```
Prepare the directory as a node project
```shell script
cd vcli
npm install
```
Install the latest Vue CLI
```shell script
npm install  @vue/cli —save
```

## Create a Vue project
Then run the local copy of the Vue CLI to create the project.
```shell script
node  node_modules/@vue/cli/bin/vue.js create sample-client
```

To reproduce the original project configuration follow the prompts and select the following using the 
option to select a manual set of options.
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

## Final steps
After running the create the original client project folder was moved to the root
```shell script
mv ppr-ui ..
``` 

In the future, you can compare the package.json file in the newly recreated project to the existing project and manually copy
over packages of interest.


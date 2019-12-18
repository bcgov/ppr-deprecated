# ppr-ui

## Project creation

See README-project-create.md

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Debugging

### VS Code with Chrome

1. In VS Code install the [Debugger for Chrome](https://github.com/Microsoft/vscode-chrome-debug) plugin
1. Launch the application: `npm run serve`
1. In VS Code:
    - Go to the _Debug and Run_ tab (`Ctrl+Shift+D` on Windows and Linux, `Command+Shift+D` on Mac)
    - In the Launch selector, choose `Add Configuration...`
    - Choose `Chrome: Launch`, this will create a `launch.json` with contents similar to what's shown below
    - With the Launch selector, run `Launch Chrome against localhost`

Once you run the launch configuration, VS Code will open a new Chrome window and connect to the app for debugging. You
can then add breakpoints and use the debugging features directly in VS Code.

Example `launch.json`:
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

### In Browser Developer Tools

Most browsers have tools for debugging web application.  This example is for Chrome, but other browsers have similar
tools available. For more comprehensive information on debugging in Chrome, see
[Get Started with Debugging JavaScript in Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/javascript)

First, open up the DevTools:
1. Launch the application: `npm run serve`
1. Open Chrome and navigate to the application: `http://localhost:8080`
1. Right click on the page and select `Inspect`

It is possible to find the source and manually enter breakpoints in the sources tab, but this can be difficult. So, to
force a breakpoint, you can use the `debugger` keyword in the application.
1. In your IDE, navigate to the line of code where you would like the debugger to stop
1. Enter in a single new line of code and save: `debugger`

The page should hot-reload in the browser, and when the new `debugger` statement is encountered, the Chrome DevTools
will break and you will be able to inspect the code and debug information.

**Important:** `debugger` statements _must_ be removed before the code is committed. Use this technique with care as
eslint and VS Code will not remind you to remove these statements.

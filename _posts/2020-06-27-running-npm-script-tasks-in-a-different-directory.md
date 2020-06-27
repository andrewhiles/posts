---
layout: post
title: Running NPM script tasks in different directories
date: 2020-06-27
categories: [NPM]
excerpt: 
---
Recently I'd been working on a TypeScript project that had nested modules throughout the codebase. It had a top-level package.json file and three nested sub-modules all with their own package files. In order to build and test the project before checking-in code changes, I needed to access the NPM script tasks of each sub-module to build them and run the unit tests. 

Originally, I began writing a bash script that could be executed from a script task in the top-level package.json that would navigate into each sub-module directory, build the code and run the tests. This felt acceptable but after taking a closer look in the [NPM CLI docs](https://docs.npmjs.com/cli-documentation/cli), I came across the awesome [--prefix](https://docs.npmjs.com/cli/prefix.html) script option.

Instead of running my bash script, I was able to use --prefix to execute the build and test NPM script tasks of each sub-module all from within the parent package.json file.

```
npm run build --prefix ./yourSubModuleDirectory
```

What this does is search for a package.json file in the yourSubModuleDirectory folder and runs the build script task defined in that package file. Pretty awesome, right? Maybe this will come in handy for you some day, too.
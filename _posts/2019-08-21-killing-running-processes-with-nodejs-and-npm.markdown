---
layout: post
title: Killing Running Processes with NodeJS & NPM
date: 2019-08-21
categories: [Snippets]
---

Recently I was trying to use bash/terminal to kill a running process on my local machine. I'd been running a Python service that was hanging and wouldn't stop so I knew it was going to take something a little more to free-up the port it was hogging. Like with most terminal commands, my memory drew a blank and I had to do a quick Google search to find the exact command I was looking for. There's a few ways of doing this but here's the usual way of killing a running process.

# Using Bash/Terminal

Get the process attached to the port you need to free-up (e.g. port 4000)
```
lsof -i :4000
```

Kill the process using the process ID retrieved from the above command
```
kill -9 <process ID>
```
The above will kill a process immediately and should make the desired port available.

# Using NodeJS

After doing a bit more searching, I came across a new way of killing processes that I've since started using. There is one prerequisite - it requires [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) to be installed. If you have NodeJS and NPM installed, you can run the following command and it will kill any running process on the port specified.

```
npx kill-port 3000
```

Installing NodeJS and NPM purely for killing running processes seems a bit excessive, but if you already have them installed, this feels like a great alternative compared to the original commands I've listed above using bash/terminal. It's much more concise and reduces the need to lookup process IDs before you can kill a running process.

-Andrew
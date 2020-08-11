# Growatt API for Inverter

> this is an Node for the API on the Growatt&copy; Shine Webserver.
> (Shine provided by Growatt&copy;. I'm not affiliated.)


This implementation is based on the refectured eebinterface from Growatt&copy Shine.

# Install
```
npm install growatt
```
---
# Debug
This API supported debugging. you have to set the environment variable DEBUG
```
set DEBUG=growatt:*
set DEBUG=growatt:api
set DEBUG=growatt:verbose
```
---
### Promise
This NODE-Implementation works with promise.


## Simple Impemation

```
"use strict"
const growatt = require('growatt')

const user="xxx"
const passwort="xx"

async function test() {
  let login = await growatt.login(user,passwort).catch(e => {console.log(e)})
  console.log('login:',login)
  let getAllPlantData = await growatt.getAllPlantData().catch(e => {console.log(e)})
  console.log('getAllPlatData:',JSON.stringify(getAllPlantData,null,' '));
  let logout = await growatt.logout().catch(e => {console.log(e)})
  console.log('logout:',logout)
}

test()

```



License (MIT)
-------------
Copyright (c) 2020 Chris Traeger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

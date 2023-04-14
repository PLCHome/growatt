![Logo](docs/glogo.png)

[![NPM version](http://img.shields.io/npm/v/growatt.svg)](https://www.npmjs.com/package/growatt)
[![Downloads week](https://img.shields.io/npm/dw/growatt)](https://www.npmjs.com/package/growatt)
[![Downloads month](https://img.shields.io/npm/dm/growatt)](https://www.npmjs.com/package/growatt)
[![Downloads year](https://img.shields.io/npm/dy/growatt)](https://www.npmjs.com/package/growatt)

[![NPM](https://nodei.co/npm/growatt.png?downloads=true)](https://nodei.co/npm/growatt/)

# ![Logo](docs/growatt.png)rowatt API for Inverter

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

[Understanding javascript promises](https://nodejs.dev/learn/understanding-javascript-promises)

[Modern Asynchronous JavaScript with Async and Await](https://nodejs.dev/learn/modern-asynchronous-javascript-with-async-and-await)

## Simple Impemation

```
"use strict"
const api = require('growatt')

const user="xxx"
const passwort="xx"
const options={}

async function test() {
  const growatt = new api({})
  let login = await growatt.login(user,passwort).catch(e => {console.log(e)})
  console.log('login:',login)
  let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {console.log(e)})
  console.log('getAllPlatData:',JSON.stringify(getAllPlantData,null,' '));
  let logout = await growatt.logout().catch(e => {console.log(e)})
  console.log('logout:',logout)
}

test()

```

## Constructor

Please note that you have to create an instance since version 0.2.0.

| Parameter | Type   | Default   | Description             |
| --------- | ------ | --------- | ----------------------- |
| config    | Object | See below | Controls the processing |

The constructor has a config object as parameter. This is optional.

### Config

| config           | Type     | Default                      | Description                                       |
| ---------------- | -------- | ---------------------------- | ------------------------------------------------- |
| server           | String   | 'https://server.growatt.com' | The Growatt server                                |
| timeout          | Integer  | 5000                         | Session timeout in ms.                            |
| headers          | Object   | {}                           | custom header like {'X-Custom-Header': 'foobar'}. |
| lifeSignCallback | function | undefined                    | Called before each Axios call.                    |

```
const api = require('growatt')
const growatt = new api()
```

## Login

There are several options for logging in:

### Login with user and password

| Parameter | Type   | Default | Description  |
| --------- | ------ | ------- | ------------ |
| user      | String | -       | The username |
| passord   | String | -       | The password |

```
  let login = await growatt.login(user,passwort).catch(e => {console.log(e)})
```

With resolve, the response from the website is returned.
Usually the object: `{ result: 1, msg: 'OK' }`

With reject an exception is thrown which contains the error object with result less then 1.

### Login with key

| Parameter | Type   | Default | Description |
| --------- | ------ | ------- | ----------- |
| key       | String | -       | The key     |

You can get the key by having an email sent to you on the Grwatt website for a third party to display the data. The key is the combination of numbers and letters in the link. It has 96 characters.

```
  let login = await Growatt.sharePlantLogin(key).catch(e => {console.log(e)})
```

With resolve, the response from the website is returned.
Usually the object: `{ result: 1, msg: 'OK' }`

With reject an exception is thrown which contains the error object with result less then 1.

### Login to Demo

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
|           |      |

This plugin is intended for testing. On the Growatt page you can view the data from many systems. The problem is that the ID of the system is different here every time you login.

I needed it so that I could see how the messages to the different inverters are structured.

```
  let login = await Growatt.demoLogin().catch(e => {console.log(e)})
```

## Get all plant data

| Parameter | Type   | Default   | Description             |
| --------- | ------ | --------- | ----------------------- |
| option    | Object | See below | Controls the processing |

This function knows the individual types of the inverter and calls up the data.

This function can be controlled via an option so that you don't always have to call up all the data that is possible:

### Option

| Option               | Type       | Default   | Description                                                                                                                                                                                |
| -------------------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| plantData            | Boolean    | true      | True calls the description dataset of the plant.                                                                                                                                           |
| deviceData           | Boolean    | true      | True calls the description dataset of the plantdevice.                                                                                                                                     |
| weather              | Boolean    | true      | True calls the weather dataset of the plant.                                                                                                                                               |
| plantId              | Integer    | undefined | The ID of a plant. So that the output can be restricted. Attention, the ID is constantly changing on demologin.                                                                            |
| totalData            | Boolean    | true      | Retrieves the data integrals. The sums since start time.                                                                                                                                   |
| statusData           | Boolean    | true      | This is not available for all systems. Here, the current operating status, fuel injection, battery charge and generation is called up. However, the data is also contained in historyLast. |
| deviceTyp            | Boolean    | false     | Add the device typ to the Output.                                                                                                                                                          |
| historyLast          | Boolean    | true      | The last data record from the system history table is called up here.                                                                                                                      |
| historyAll           | Boolean    | false     | All data records from the system history table is called up here.                                                                                                                          |
| historyLastStartDate | new Date() | tomorrow  | The start time for retrieving the history.                                                                                                                                                 |
| historyLastEndDate   | new Date() | yesterday | The end time for retrieving the history.                                                                                                                                                   |
| historyStart         | Integer    | 0         | The server does not send all data for the time range. With the starting index you get the next rows.                                                                                       |

### The call

After waiting to log in with await. Can the data be retrieved using this method.
In response, an object comes out that contains the data of the length.

```
  options = {plantData:false,deviceData:true,deviceTyp:true,weather:false,chartLastArray:true}
  let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {console.log(e)})
  console.log('getAllPlatData:',JSON.stringify(getAllPlantData,null,' '));
```

## Logout

After retrieving the data, you should log out of the page again.
It is the same call for all three login variants.

```
  let logout = await growatt.logout().catch(e => {console.log(e)})
```

## isConnected

It is also possible to have the connection open and to check whether the API is still connected.

```
  if (growatt.isConnected()) {
  }
```

## getDataLoggers

Returns a list of data loggers with information

```
  let loggers = await growatt.getDataLoggers().catch(e => {console.log(e)})
```

## getDataLoggerRegister

| Parameter | Type    | Default | Description       |
| --------- | ------- | ------- | ----------------- |
| dataLogSn | String  | -       | The serial number |
| addr      | Integer | -       | The register      |

Returns the value of a datalogger register

```
  //api.LOGGERREGISTER.INTERVAL
  //api.LOGGERREGISTER.SERVERIP
  //api.LOGGERREGISTER.SERVERPORT
  let register = await growatt.getDataLoggerRegister(loggers[0].sn, api.LOGGERREGISTER.INTERVAL).catch(e => {console.log(e)})
```

The answer is an object

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| msg       | String | The value   |
| success   | String | Ok or bad   |

## setDataLoggerRegister

_Warning an incorrect register with the wrong value can destroy or damage the logger. Writing to the Datenlohgger is at your own risk._

| Parameter | Type    | Default | Description       |
| --------- | ------- | ------- | ----------------- |
| dataLogSn | String  | -       | The serial number |
| addr      | Integer | -       | The register      |
| value     | String  | -       | The value to set  |

Sets the value of a datalogger register

```
  //api.LOGGERREGISTER.INTERVAL
  //api.LOGGERREGISTER.SERVERIP
  //api.LOGGERREGISTER.SERVERPORT
  let res = await growatt.setDataLoggerRegister(loggers[0].sn, api.LOGGERREGISTER.INTERVAL, 1).catch(e => {console.log(e)})
```

The answer is an object

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| msg       | String | An information |
| success   | String | Ok or bad      |

## setDataLoggerParam

_Warning an incorrect register with the wrong value can destroy or damage the logger. Writing to the Datenlohgger is at your own risk._

| Parameter | Type    | Default | Description         |
| --------- | ------- | ------- | ------------------- |
| dataLogSn | String  | -       | The serial number   |
| paramType | Integer | -       | The function number |
| value     | String  | -       | The value to set    |

Sets the value of the datalogger

```
  //api.LOGGERFUNCTION.INTSERVERIP
  //api.LOGGERFUNCTION.SERVERNAME
  //api.LOGGERFUNCTION.SERVERPORT
  let res = await growatt.setDataLoggerRegister(loggers[0].sn, api.LOGGERFUNCTION.SERVERPORT, 5279).catch(e => {console.log(e)})
```

The answer is an object

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| msg       | String | An information |
| success   | String | Ok or bad      |

## setDataLoggerRestart

| Parameter | Type   | Default | Description       |
| --------- | ------ | ------- | ----------------- |
| dataLogSn | String | -       | The serial number |

Sets the value of the datalogger

```
  //api.LOGGERFUNCTION.INTSERVERIP
  //api.LOGGERFUNCTION.SERVERNAME
  //api.LOGGERFUNCTION.SERVERPORT
  let res = await growatt.setDataLoggerRestart(loggers[0].sn).catch(e => {console.log(e)})
```

The answer is an object

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| msg       | String | An information |
| success   | String | Ok or bad      |

## checkDataLoggerFirmware

| Parameter | Type    | Default | Description                 |
| --------- | ------- | ------- | --------------------------- |
| type      | Integer | -       | The logger typ number       |
| version   | String  | -       | The logger firmware version |

It is checked whether an update is available

```
  let res = await growatt.checkDataLoggerFirmware(loggers[0].deviceTypeIndicate,loggers[0].firmwareVersion).catch(e => {console.log(e)})
```

The answer is an object

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| msg       | String | An information |
| success   | String | Ok or bad      |

---

## Speedup data interval new method

- Open the ShinePhone app
- Click on attachment below
- Top right +, then list data loggers
- Click on existing data logger
- Configure data logger
- Wireless hotspot mode
- Put the stick in AP mode
- Connect to Wifi hotspot, PW 123456789 ? <- check again
- Continue
- Advanced
- Time setting
- Interval to 1
- Enter password growattYYYYMMDD (e.g.growatt20220209)
- Unlock
- Click and apply changes
- Exit hotspot mode

---

**There is no change to the charts on growatt side. There you can only see a change in the data from the datalogger.**

---

## License (MIT)

Copyright (c) 2020 Chris Traeger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

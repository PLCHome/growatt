// Copyright (c) 2020 Träger

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

'use strict'

const debugApi = require('debug')('growatt:api')
const debugVerbose = require('debug')('growatt:verbose')
const Axios = require('axios')
const Url = require('url')
const FormData = require('form-data')

const server = 'https://server.growatt.com'
var connected = false
var cookie = ""

function getUrl(path) {
  return server + path
}


exports.isConnected = () => {
  return connected
}


exports.login = (user,password) => {
  return new Promise((resolve,reject) => {
    debugApi('login:','user:',user,'password:',password)
    const params = new Url.URLSearchParams({'account': user, 'password': password})
    connected = false
    Axios.post( getUrl('/login'), 
                params.toString())
         .then((res) => {
           debugVerbose('login result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             cookie = res.headers['set-cookie'].toString()
             connected = true
             debugApi('login resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('login reject:',res.data)
             reject(res.data)
           } else {
             debugApi('login reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           debugApi('login err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.demoLogin = () => {
  return new Promise((resolve,reject) => {
    debugApi('demoLogin:')
    connected = false
    Axios.get( getUrl('/login/toViewExamlePlant'))
         .then((res) => {
           debugVerbose('demoLogin result:',res)
           cookie = res.headers['set-cookie'].toString()
           connected = true
           debugApi('demoLogin resolve')
           resolve({ result: 1, msg: 'OK' });
         })
         .catch((e) => {
           debugApi('demoLogin err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}


exports.logout = () => {
  return new Promise((resolve,reject) => {
    debugApi('logout:')
    Axios.get( getUrl('/logout'))
         .then((res) => {
           debugVerbose('logout result:',res)
           cookie = ""
           connected = false
           debugApi('logout resolve')
           resolve({ result: 1, msg: 'OK' });
         })
         .catch((e) => {
           debugApi('logout err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}


exports.getPlatList = () => {
  return new Promise((resolve,reject) => {
    debugApi('getPlatList:')
    Axios.post( getUrl('/index/getPlantListTitle'),
                null,
                {headers: {'cookie': cookie}})
          .then((res) => {
            debugVerbose('getPlatList result:',res)
            if (Array.isArray(res.data)) {
               debugApi('getPlatList resolve:',res.data)
               resolve(res.data);
            } else {
              connected = false
              debugApi('getPlatList reject')
              reject('The server sent an unexpected response, a fatal error has occurred')
            }
          })
          .catch((e) => {
            connected = false
            debugApi('getPlatList err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
  })
}

exports.getDevicesByPlantList = (plantId, currPage) => {
  return new Promise((resolve,reject) => {
    const params = new Url.URLSearchParams({'plantId': plantId, 'currPage': currPage})
    debugApi('getDevicesByPlantList:','plantId:',plantId,'currPage:',currPage)
    Axios.post( getUrl('/panel/getDevicesByPlantList'),
                params.toString(),
                {headers: {'cookie': cookie}})
          .then((res) => {
            debugVerbose('getDevicesByPlantList result:',res)
            if (res.data && res.data.result && res.data.result == 1) {
              debugApi('getDevicesByPlantList resolve:',res.data)
              resolve(res.data);
            } else if (res.data && res.data.result) {
              debugApi('getDevicesByPlantList reject:',res.data)
              reject(res.data)
            } else {
              debugApi('getDevicesByPlantList reject')
              reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
            }
          })
          .catch((e) => {
            connected = false
            debugApi('getDevicesByPlantList err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
  })
}

exports.getPlantData = (plantId) => {
  return new Promise((resolve,reject) => {
    const params = new Url.URLSearchParams({'plantId': plantId})
    debugApi('getPlantData:','plantId:',plantId)
    Axios.post( getUrl('/panel/getPlantData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getPlantData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getPlantData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getPlantData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getPlantData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getPlantData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getWeatherByPlantId = (plantId) => {
  return new Promise((resolve,reject) => {
    debugApi('getWeatherByPlantId:','plantId:',plantId)
    const params = new Url.URLSearchParams({'plantId': plantId})
    Axios.post( getUrl('/index/getWeatherByPlantId'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getWeatherByPlantId result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getWeatherByPlantId resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getWeatherByPlantId reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getWeatherByPlantId reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getWeatherByPlantId err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getDevicesByPlant = (plantId) => {
  return new Promise((resolve,reject) => {
    debugApi('getDevicesByPlant:','plantId:',plantId)
    const params = new Url.URLSearchParams({'plantId': plantId})
    Axios.post( getUrl('/panel/getDevicesByPlant'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getDevicesByPlant result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getDevicesByPlant resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getDevicesByPlant reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getDevicesByPlant reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getDevicesByPlant err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getMAXTotalData = (plantId,maxSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getMAXTotalData:','plantId:',plantId,'maxSn:',maxSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'maxSn': maxSn})
    Axios.post( getUrl('/panel/max/getMAXTotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getMAXTotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getMAXTotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getMAXTotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getMAXTotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getMAXTotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getMIXTotalData = (plantId,mixSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getMIXTotalData:','plantId:',plantId,'mixSn',mixSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'mixSn': mixSn})
    Axios.post( getUrl('/panel/mix/getMIXTotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getMIXTotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getMIXTotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getMIXTotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getMIXTotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getMIXTotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getMIXStatusData = (plantId,mixSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getMIXStatusData:','plantId:',plantId,'mixSn',mixSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'mixSn': mixSn})
    Axios.post( getUrl('/panel/mix/getMIXStatusData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getMIXStatusData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getMIXStatusData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getMIXStatusData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getMIXStatusData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getMIXStatusData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getInvTotalData = (plantId,invSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getInvTotalData:','plantId:',plantId,'invSn',invSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'invSn': invSn})
    Axios.post( getUrl('/panel/inv/getInvTotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getInvTotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getInvTotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getInvTotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getInvTotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getInvTotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getTLXTotalData = (plantId,tlxSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getTLXTotalData:','plantId:',plantId,'tlxSn:',tlxSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'tlxSn': tlxSn})
    Axios.post( getUrl('/panel/tlx/getTLXTotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getTLXTotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getTLXTotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getTLXTotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getTLXTotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getTLXTotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getStorageTotalData = (plantId,storageSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getStorageTotalData:','plantId:',plantId,'storageSn:',storageSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'storageSn': storageSn})
    Axios.post( getUrl('/panel/storage/getStorageTotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getStorageTotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getStorageTotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getStorageTotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getStorageTotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getStorageTotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getStorageStatusData = (plantId,storageSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getStorageStatusData:','plantId:',plantId,'storageSn:',storageSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'storageSn': storageSn})
    Axios.post( getUrl('/panel/storage/getStorageStatusData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getStorageStatusData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getStorageStatusData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getStorageStatusData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getStorageStatusData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getStorageStatusData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getSPATotalData = (plantId,spaSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getSPATotalData:','plantId:',plantId,'spaSn:',spaSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'spaSn': spaSn})
    Axios.post( getUrl('/panel/spa/getSPATotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getSPATotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getSPATotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getSPATotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getSPATotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getSPATotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getSPAStatusData = (plantId,spaSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getSPAStatusData:','plantId:',plantId,'spaSn:',spaSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'spaSn': spaSn})
    Axios.post( getUrl('/panel/spa/getSPAStatusData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getSPAStatusData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getSPAStatusData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getSPAStatusData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getSPAStatusData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getSPAStatusData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getHPSTotalData = (plantId,hpsSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getHPSTotalData:','plantId:',plantId,'hpsSn:',hpsSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'hpsSn': hpsSn})
    Axios.post( getUrl('/panel/hps/getHPSTotalData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getHPSTotalData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getHPSTotalData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getHPSTotalData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getHPSTotalData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getHPSTotalData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getHPSStatusData = (plantId,hpsSn) => {
  return new Promise((resolve,reject) => {
    debugApi('getHPSStatusData:','plantId:',plantId,'hpsSn:',hpsSn)
    const params = new Url.URLSearchParams({'plantId': plantId,'hpsSn': hpsSn})
    Axios.post( getUrl('/panel/hps/getHPSStatusData'),
                params.toString(),
                {headers: {'cookie': cookie}})
         .then((res) => {
           debugVerbose('getHPSStatusData result:',res)
           if (res.data && res.data.result && res.data.result == 1) {
             debugApi('getHPSStatusData resolve:',res.data)
             resolve(res.data);
           } else if (res.data && res.data.result) {
             debugApi('getHPSStatusData reject:',res.data)
             reject(res.data)
           } else {
             debugApi('getHPSStatusData reject')
             reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
           }
         })
         .catch((e) => {
           connected = false
           debugApi('getHPSStatusData err:',JSON.stringify(e,null,'  '))
           reject(e)
         })
  })
}

exports.getAllPlantData = () => {
  return new Promise(async (resolve,reject) => {
    debugApi('getAllPlantData:')
    let result={}
    let plants = await this.getPlatList().catch(e => {debugApi('getAllPlantData getPlatList err:',e)})
    for (var i = 0;i < plants.length;i++) {
      var plant = plants[i]
      result[plant.id] = plant
      result[plant.id].plantData = {}
      let plantData = await this.getPlantData(plant.id).catch(e => {debugApi('getAllPlantData getPlantData err:',e)})
      if (plantData.obj) {
        result[plant.id].plantData = plantData.obj
      }
      result[plant.id].weather = {}
      let weather = await this.getWeatherByPlantId(plant.id).catch(e => {debugApi('getAllPlantData getWeatherByPlantId err:',e)})
      if (weather.obj) {
        result[plant.id].weather = weather.obj
      }
      result[plant.id].devices = await this.getAllPlantDeviceData(plant.id).catch(e => {debugApi('getAllPlantData getAllPlantDeviceData err:',e)})
      let devices = await this.getDevicesByPlantList(plant.id,1).catch(e => {debugApi('getAllPlantData getDevicesByPlantList err:',e)})
      if (devices && devices.obj && devices.obj.datas) {
        if (devices.obj.pages && devices.obj.pages > 1) {
          for (let p = 1; p<devices.obj.pages ; p++) {
            let devicesPlus = await this.getDevicesByPlantList(plant.id,p).catch(e => {debugApi('getAllPlantData getDevicesByPlantList err:',e)})
            devices.obj.datas = devices.obj.datas.concat(devicesPlus.obj.datas)
          }
        }
        for (let i=0; i<devices.obj.datas.length; i++) {
          let devData = devices.obj.datas[i]
          if (!result[plant.id].devices[devData.sn]) {
            result[plant.id].devices[devData.sn] = {}
          }
          result[plant.id].devices[devData.sn].deviceData = devData
        }
      }
    }
    debugVerbose('getAllPlantData resolve:',JSON.stringify(result,null,'  '))
    resolve(result)
  })
}

exports.getAllPlantDeviceData = (plantId) => {
  return new Promise(async (resolve,reject) => {
    debugApi('getAllPlantData:','plantId:',plantId)
    let result={}
    let device = await this.getDevicesByPlant(plantId).catch(e => {debugApi('getAllPlantDeviceData getDevicesByPlant err:',e)})
    if (device.obj) {
      result={}
      if (device.obj.mix) {
        for (var a = 0;a < device.obj.mix.length;a++) {
          let mix = device.obj.mix[a]
          result[mix[0]]={}
          //result[mix[0]].device=mix
          let totalData = await this.getMIXTotalData(plantId,mix[0]).catch(e => {debugApi('getAllPlantDeviceData getMIXTotalData err:',e)})
          if (totalData.obj) {
            result[mix[0]].totalData=totalData.obj
          }
          let statusData = await this.getMIXStatusData(plantId,mix[0]).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
          if (statusData.obj) {
            result[mix[0]].statusData=statusData.obj
          }
        }
      } else
      if (device.obj.inv) {
        for (var a = 0;a < device.obj.inv.length;a++) {
          let inv = device.obj.inv[a]
          result[inv[0]]={}
          //result[inv[0]].device=inv
          let totalData = await this.getInvTotalData(plantId,inv[0]).catch(e => {debugApi('getAllPlantDeviceData getInvTotalData err:',e)})
          if (totalData.obj) {
            result[inv[0]].totalData=totalData.obj
          }
        }
      } else
      if (device.obj.max) {
        for (var a = 0;a < device.obj.max.length;a++) {
          let max = device.obj.max[a]
          result[max[0]]={}
          //result[max[0]].device=max
          let totalData = await this.getMAXTotalData(plantId,max[0]).catch(e => {debugApi('getAllPlantDeviceData getMAXTotalData err:',e)})
          if (totalData.obj) {
            result[max[0]].totalData=totalData.obj
          }
        }
      } else
      if (device.obj.spa) {
        for (var a = 0;a < device.obj.spa.length;a++) {
          let spa = device.obj.spa[a]
          result[spa[0]]={}
          //result[spa[0]].device=spa
          let totalData = await this.getSPATotalData(plantId,spa[0]).catch(e => {debugApi('getAllPlantDeviceData getSPATotalData err:',e)})
          if (totalData.obj) {
            result[spa[0]].totalData=totalData.obj
          }
          let statusData = await this.getSPAStatusData(plantId,spa[0]).catch(e => {debugApi('getAllPlantDeviceData getSPAStatusData err:',e)})
          if (statusData.obj) {
            result[spa[0]].statusData=statusData.obj
          }
        }
      } else
      if (device.obj.hps) {
        for (var a = 0;a < device.obj.hps.length;a++) {
          let hps = device.obj.hps[a]
          result[hps[0]]={}
          //result[hps[0]].device=hps
          let totalData = await this.getHPSTotalData(plantId,hps[0]).catch(e => {debugApi('getAllPlantDeviceData getHPSTotalData err:',e)})
          if (totalData.obj) {
            result[hps[0]].totalData=totalData.obj
          }
          let statusData = await this.getHPSStatusData(plantId,hps[0]).catch(e => {debugApi('getAllPlantDeviceData getHPSStatusData err:',e)})
          if (statusData.obj) {
            result[hps[0]].statusData=statusData.obj
          }
        }
      } else
      if (device.obj.tlx) {
        for (var a = 0;a < device.obj.tlx.length;a++) {
          let tlx = device.obj.tlx[a]
          result[tlx[0]]={}
          //result[tlx[0]].device=tlx
          let totalData = await this.getTLXTotalData(plantId,tlx[0]).catch(e => {debugApi('getAllPlantDeviceData getTLXTotalData err:',e)})
          if (totalData.obj) {
            result[tlx[0]].totalData=totalData.obj
          }
        }
      } else
      if (device.obj.storage) {
        for (var a = 0;a < device.obj.storage.length;a++) {
          let storage = device.obj.storage[a]
          result[storage[0]]={}
          //result[storage[0]].device=storage
          let totalData = await this.getStorageTotalData(plantId,storage[0]).catch(e => {debugApi('getAllPlantDeviceData getStorageTotalData err:',e)})
          if (totalData.obj) {
            result[storage[0]].totalData=totalData.obj
          }
          let statusData = await this.getStorageStatusData(plantId,storage[0]).catch(e => {debugApi('getAllPlantDeviceData getStorageStatusData err:',e)})
          if (statusData.obj) {
            result[storage[0]].statusData=statusData.obj
          }
        }
      }
    }
    debugVerbose('getAllPlantDeviceData resolve:',JSON.stringify(result,null,'  '))
    resolve(result)
  })
}

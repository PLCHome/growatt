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

module.exports = class growatt {
  constructor() {
    this.connected = false
    this.cookie = ""
    this.axios = Axios.create({
      baseURL: server,
      timeout: 1000,
      headers: {}
    });
  }

  getUrl(path) {
    return server + path
  }


  isConnected = () => {
    return this.connected
  }


  login = (user,password) => {
    return new Promise((resolve,reject) => {
      debugApi('login:','user:',user,'password:','*no*')
      const params = new Url.URLSearchParams({'account': user, 'password': password})
      this.connected = false
      this.axios.post( this.getUrl('/login'), 
                  params.toString())
          .then((res) => {
            debugVerbose('login result:',res)
            if (res.data && res.data.result && res.data.result == 1) {
              this.cookie = res.headers['set-cookie'].toString()
              this.connected = true
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

  demoLogin = () => {
    return new Promise((resolve,reject) => {
      debugApi('demoLogin:')
      this.connected = false
      this.axios.get( this.getUrl('/login/toViewExamlePlant'))
          .then((res) => {
            debugVerbose('Session:',this.axios)
            debugVerbose('demoLogin result:',res)
            
            this.cookie = res.headers['set-cookie'].toString()
            if (this.cookie.includes('JSESSIONID')) {
              this.connected = true
              debugApi('demoLogin resolve')
              resolve({ result: 1, msg: 'OK' });
            } else {
              debugApi('demoLogin reject no JSESSIONID')
              reject({ result: -9999, msg: 'The server sent an unexpected response' })
            }
          })
          .catch((e) => {
            debugApi('demoLogin err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  sharePlantLogin = (key) => {
    return new Promise((resolve,reject) => {
      debugApi('sharePlantLogin:','key:',key)
      this.connected = false
      this.axios.get( this.getUrl('/login/toSharePlant/'+key),
                {validateStatus: function (status) {
                    return (status >= 200 && status < 300) || status == 302;
                  },
                  maxRedirects: 0} )
          .then((res) => {
            debugVerbose('sharePlantLogin result:',res)
            this.cookie = res.headers['set-cookie'].toString()
            if (this.cookie.includes('JSESSIONID')) {
              this.connected = true
              debugApi('sharePlantLogin resolve')
              resolve({ result: 1, msg: 'OK' });
            } else {
              debugApi('sharePlantLogin reject no JSESSIONID')
              reject({ result: -9999, msg: 'The server sent an unexpected response' })
            }
          })
          .catch((e) => {
            debugApi('sharePlantLogin err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }


  logout = () => {
    return new Promise((resolve,reject) => {
      debugApi('logout:')
      this.axios.get( this.getUrl('/logout'),
                {headers: {'cookie': this.cookie}})
          .then((res) => {
            debugVerbose('logout result:',res)
            this.cookie = ""
            this.connected = false
            debugApi('logout resolve')
            resolve({ result: 1, msg: 'OK' });
          })
          .catch((e) => {
            debugApi('logout err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }


  getPlatList = () => {
    return new Promise((resolve,reject) => {
      debugApi('getPlatList:')
      this.axios.post( this.getUrl('/index/getPlantListTitle'),
                  null,
                  {headers: {'cookie': this.cookie}})
            .then((res) => {
              debugVerbose('getPlatList result:',res)
              if (Array.isArray(res.data)) {
                debugApi('getPlatList resolve:',res.data)
                resolve(res.data);
              } else {
                this.connected = false
                debugApi('getPlatList reject')
                reject('The server sent an unexpected response, a fatal error has occurred')
              }
            })
            .catch((e) => {
              this.connected = false
              debugApi('getPlatList err:',JSON.stringify(e,null,'  '))
              reject(e)
            })
    })
  }

  getDevicesByPlantList = (plantId, currPage) => {
    return new Promise((resolve,reject) => {
      const params = new Url.URLSearchParams({'plantId': plantId, 'currPage': currPage})
      debugApi('getDevicesByPlantList:','plantId:',plantId,'currPage:',currPage)
      this.axios.post( this.getUrl('/panel/getDevicesByPlantList'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
              this.connected = false
              debugApi('getDevicesByPlantList err:',JSON.stringify(e,null,'  '))
              reject(e)
            })
    })
  }

  getPlantData = (plantId) => {
    return new Promise((resolve,reject) => {
      const params = new Url.URLSearchParams({'plantId': plantId})
      debugApi('getPlantData:','plantId:',plantId)
      this.axios.post( this.getUrl('/panel/getPlantData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getPlantData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getWeatherByPlantId = (plantId) => {
    return new Promise((resolve,reject) => {
      debugApi('getWeatherByPlantId:','plantId:',plantId)
      const params = new Url.URLSearchParams({'plantId': plantId})
      this.axios.post( this.getUrl('/index/getWeatherByPlantId'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getWeatherByPlantId err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getDevicesByPlant = (plantId) => {
    return new Promise((resolve,reject) => {
      debugApi('getDevicesByPlant:','plantId:',plantId)
      const params = new Url.URLSearchParams({'plantId': plantId})
      this.axios.post( this.getUrl('/panel/getDevicesByPlant'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getDevicesByPlant err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getMAXTotalData = (plantId,maxSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getMAXTotalData:','plantId:',plantId,'maxSn:',maxSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'maxSn': maxSn})
      this.axios.post( this.getUrl('/panel/max/getMAXTotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getMAXTotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getMAXChartLast = (plantId,date,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getMAXChartLast:','plantId:',plantId,'date:',date,'options:',options)
      const params = new Url.URLSearchParams({'date': date.toISOString().substring(0,10) ,'plantId': plantId})
      this.axios.post( this.getUrl('/panel/max/getMAXDayChart'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getMAXChartLast result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getMAXChartLast resolve:',res.data)
                if (res.data.obj){
                  let keys = Object.keys(res.data.obj)
                  keys.forEach(key => {
                    if (Array.isArray(res.data.obj[key])){
                      let count = 0
                      res.data.obj[key+'_val']=0
                      res.data.obj[key+'_idx']=0
                      res.data.obj[key].forEach(val => {
                        count++
                        if (val!= null) {
                          res.data.obj[key+'_val']=val
                          res.data.obj[key+'_idx']=count
                        }
                      })
                      if (options && options.chartLastArrayAsJson) {
                        res.data.obj[key] = JSON.stringify(res.data.obj[key])
                      }
                      if (options && !options.chartLastArray) {
                        delete(res.data.obj[key])
                      }
                    }
                  })
                }
                resolve(res.data);
              } else if (res.data && res.data.result) {
                debugApi('getMAXChartLast reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getMAXChartLast reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getMAXChartLast err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  correctTime(struct) {
      function makeTime(time) {
          if (   typeof time.year !== 'undefined'
              && typeof time.month !== 'undefined'
              && typeof time.dayOfMonth !== 'undefined'
              && typeof time.hourOfDay !== 'undefined'
              && typeof time.minute !== 'undefined'
              && typeof time.second !== 'undefined'){
              return (new Date(time.year, time.month, time.dayOfMonth, time.hourOfDay, time.minute, time.second)).toISOString()
          } else {
              return (new Date()).toISOString()
          }
      }
      if (typeof struct.time !== 'undefined') {
          struct.time = makeTime(struct.time)
      } else if (typeof struct.calendar !== 'undefined') {
          struct.calendar = makeTime(struct.calendar)
      }
  }

  getMAXHistory = (maxSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getMAXHistory:','maxSn:',maxSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'maxSn': maxSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      this.axios.post( this.getUrl('/device/getMAXHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getMAXHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getMAXHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getMAXHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getMAXHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getMAXHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getMAXHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getMAXHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getMIXTotalData = (plantId,mixSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getMIXTotalData:','plantId:',plantId,'mixSn',mixSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'mixSn': mixSn})
      this.axios.post( this.getUrl('/panel/mix/getMIXTotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getMIXTotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getMIXStatusData = (plantId,mixSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getMIXStatusData:','plantId:',plantId,'mixSn',mixSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'mixSn': mixSn})
      this.axios.post( this.getUrl('/panel/mix/getMIXStatusData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getMIXStatusData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getMIXHistory = (mixSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getMIXHistory:','mixSn:',mixSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'mixSn': mixSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      this.axios.post( this.getUrl('/device/getMIXHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getMIXHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getMIXHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getMIXHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getMIXHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getMIXHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getMIXHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getMIXHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getInvTotalData = (plantId,invSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getInvTotalData:','plantId:',plantId,'invSn',invSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'invSn': invSn})
      this.axios.post( this.getUrl('/panel/inv/getInvTotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
          .then((res) => {
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
            this.connected = false
            debugApi('getInvTotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getInvChartLast = (plantId,date,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getInvChartLast:','plantId:',plantId,'date:',date,'options:',options)
      const params = new Url.URLSearchParams({'date': date.toISOString().substring(0,10) ,'plantId': plantId})
      this.axios.post( this.getUrl('/panel/inv/getInvDayChart'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getInvChartLast result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getInvChartLast resolve:',res.data)
                if (res.data.obj){
                  let keys = Object.keys(res.data.obj)
                  keys.forEach(key => {
                    if (Array.isArray(res.data.obj[key])){
                      let count = 0
                      res.data.obj[key+'_val']=0
                      res.data.obj[key+'_idx']=0
                      res.data.obj[key].forEach(val => {
                        count++
                        if (val!= null) {
                          res.data.obj[key+'_val']=val
                          res.data.obj[key+'_idx']=count
                        }
                      })
                      if (options && options.chartLastArrayAsJson) {
                        res.data.obj[key] = JSON.stringify(res.data.obj[key])
                      }
                      if (options && !options.chartLastArray) {
                        delete(res.data.obj[key])
                      }
                    }
                  })
                }
                resolve(res.data);
              } else if (res.data && res.data.result) {
                debugApi('getInvChartLast reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getInvChartLast reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getInvChartLast err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getInverterHistory = (invSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getInverterHistory:','invSn:',invSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'invSn': invSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      debugApi('getInverterHistory: params:',params.toString())
      this.axios.post( this.getUrl('/device/getInverterHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getInverterHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getInverterHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getInverterHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getInverterHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getInverterHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getInverterHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getInverterHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getTLXTotalData = (plantId,tlxSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getTLXTotalData:','plantId:',plantId,'tlxSn:',tlxSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'tlxSn': tlxSn})
      this.axios.post( this.getUrl('/panel/tlx/getTLXTotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getTLXTotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getTLXChartLast = (plantId,tlxSn,date,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getTLXChartLast:','plantId:',plantId,'tlxSn:',tlxSn,'date:',date,'options:',options)
      const params = new Url.URLSearchParams({'date': date.toISOString().substring(0,10) ,'plantId': plantId, 'tlxSn': tlxSn})
      this.axios.post( this.getUrl('/panel/tlx/getTLXEnergyDayChart'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getTLXChartLast result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getTLXChartLast resolve:',res.data)
                if (res.data.obj && res.data.obj.charts){
                  let keys = Object.keys(res.data.obj.charts)
                  keys.forEach(key => {
                    if (Array.isArray(res.data.obj.charts[key])){
                      let count = 0
                      res.data.obj.charts[key+'_val']=0
                      res.data.obj.charts[key+'_idx']=0
                      res.data.obj.charts[key].forEach(val => {
                        count++
                        if (val!= null) {
                          res.data.obj.charts[key+'_val']=val
                          res.data.obj.charts[key+'_idx']=count
                        }
                      })
                      if (options && options.chartLastArrayAsJson) {
                        res.data.obj.charts[key] = JSON.stringify(res.data.obj.charts[key])
                      }
                      if (options && !options.chartLastArray) {
                        delete(res.data.obj.charts[key])
                      }
                    }
                  })
                }
                resolve(res.data);
              } else if (res.data && res.data.result) {
                debugApi('getTLXChartLast reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getTLXChartLast reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getTLXChartLast err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getTLXHistory = (tlxSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getTLXHistory:','tlxSn:',tlxSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'tlxSn': tlxSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      this.axios.post( this.getUrl('/device/getTLXHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getTLXHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getTLXHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getTLXHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getTLXHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getTLXHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getTLXHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getTLXHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getStorageTotalData = (plantId,storageSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getStorageTotalData:','plantId:',plantId,'storageSn:',storageSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'storageSn': storageSn})
      this.axios.post( this.getUrl('/panel/storage/getStorageTotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getStorageTotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getStorageStatusData = (plantId,storageSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getStorageStatusData:','plantId:',plantId,'storageSn:',storageSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'storageSn': storageSn})
      this.axios.post( this.getUrl('/panel/storage/getStorageStatusData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getStorageStatusData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getStorageHistory = (storageSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getStorageHistory:','storageSn:',storageSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'storageSn': storageSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      this.axios.post( this.getUrl('/device/getStorageHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getStorageHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getStorageHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getStorageHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getStorageHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getStorageHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getStorageHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getStorageHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getSPATotalData = (plantId,spaSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getSPATotalData:','plantId:',plantId,'spaSn:',spaSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'spaSn': spaSn})
      this.axios.post( this.getUrl('/panel/spa/getSPATotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getSPATotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getSPAStatusData = (plantId,spaSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getSPAStatusData:','plantId:',plantId,'spaSn:',spaSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'spaSn': spaSn})
      this.axios.post( this.getUrl('/panel/spa/getSPAStatusData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getSPAStatusData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getSPAHistory = (spaSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getSPAHistory:','spaSn:',spaSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'spaSn': spaSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      this.axios.post( this.getUrl('/device/getSPAHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getSPAHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getSPAHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getSPAHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getSPAHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getSPAHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getSPAHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getSPAHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getHPSTotalData = (plantId,hpsSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getHPSTotalData:','plantId:',plantId,'hpsSn:',hpsSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'hpsSn': hpsSn})
      this.axios.post( this.getUrl('/panel/hps/getHPSTotalData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getHPSTotalData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getHPSStatusData = (plantId,hpsSn) => {
    return new Promise((resolve,reject) => {
      debugApi('getHPSStatusData:','plantId:',plantId,'hpsSn:',hpsSn)
      const params = new Url.URLSearchParams({'plantId': plantId,'hpsSn': hpsSn})
      this.axios.post( this.getUrl('/panel/hps/getHPSStatusData'),
                  params.toString(),
                  {headers: {'cookie': this.cookie}})
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
            this.connected = false
            debugApi('getHPSStatusData err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getHPSHistory = (hpsSn,startDate,endDate,start,options) => {
    return new Promise((resolve,reject) => {
      debugApi('getHPSHistory:','hpsSn:',hpsSn,'startDate:',startDate,'endDate:',endDate,'start:',start,'options:',options)
      const params = new Url.URLSearchParams({'hpsSn': hpsSn,
                                              'startDate': startDate.toISOString().substring(0,10),
                                              'endDate': endDate.toISOString().substring(0,10),
                                              'start': start})
      this.axios.post( this.getUrl('/device/getHPSHistory'),
                  params.toString(),
                  {headers: {'cookie': this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
            .then((res) => {
              debugVerbose('getHPSHistory result:',res)
              if (res.data && res.data.result && res.data.result == 1) {
                debugApi('getHPSHistory resolve:',res.data)
                if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]){
                  correctTime(res.data.obj.datas[0])
                  debugApi('getHPSHistory resolve:',res.data.obj.datas[0])
                  resolve(res.data.obj.datas[0]);
                } else {
                  debugApi('getHPSHistory cant find the data')
                  resolve({});
                }
              } else if (res.data && res.data.result) {
                debugApi('getHPSHistory reject:',res.data)
                reject(res.data)
              } else {
                debugApi('getHPSHistory reject')
                reject({ result: -9999, msg: 'The server sent an unexpected response, a fatal error has occurred' })
              }
            })
          .catch((e) => {
            this.connected = false
            debugApi('getHPSHistory err:',JSON.stringify(e,null,'  '))
            reject(e)
          })
    })
  }

  getAllPlantData = (options) => {
    return new Promise(async (resolve,reject) => {
      debugApi('getAllPlantData','options:',options)
      let result={}
      if (typeof options !== 'object') {
        options = {}
      }
      if (typeof options.plantData === 'undefined') {
        options.plantData = true
      }
      if (typeof options.deviceData === 'undefined') {
        options.deviceData = true
      }
      if (typeof options.weather === 'undefined') {
        options.weather = true
      }
      debugApi('getAllPlantData','options:',options)
      let plants = await this.getPlatList().catch(e => {debugApi('getAllPlantData getPlatList err:',e)})
      if (plants) {
        for (var i = 0;i < plants.length;i++) {
          var plant = plants[i]
          if (typeof options.plantId === 'undefined' || (plant.id == options.plantId)) {
            result[plant.id] = plant
            if (options.plantData) {
              result[plant.id].plantData = {}
              let plantData = await this.getPlantData(plant.id).catch(e => {debugApi('getAllPlantData getPlantData err:',e)})
              if (plantData && plantData.obj) {
                result[plant.id].plantData = plantData.obj
              }
            }
            if (options.weather) {
              result[plant.id].weather = {}
              let weather = await this.getWeatherByPlantId(plant.id).catch(e => {debugApi('getAllPlantData getWeatherByPlantId err:',e)})
              if (weather && weather.obj) {
                result[plant.id].weather = weather.obj
              }
            }
            result[plant.id].devices = await this.getAllPlantDeviceData(plant.id,options).catch(e => {debugApi('getAllPlantData getAllPlantDeviceData err:',e)})
            if (options.deviceData) {
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
          }
        }
      }
      debugVerbose('getAllPlantData resolve:',JSON.stringify(result,null,'  '))
      resolve(result)
    })
  }

  getAllPlantDeviceData = (plantId,options) => {
    return new Promise(async (resolve,reject) => {
      debugApi('getAllPlantData:','plantId:',plantId,'options:',options)
      let result={}
      if (typeof options !== 'object') {
        options = {}
      }
      if (typeof options.totalData === 'undefined') {
        options.totalData = true
      }
      if (typeof options.statusData === 'undefined') {
        options.statusData = true
      }
      if (typeof options.deviceTyp === 'undefined') {
        options.deviceTyp = false
      }
      if (typeof options.historyLast === 'undefined') {
        options.historyLast = true
      }
      if (typeof options.historyLastStartDate === 'undefined') {
        options.historyLastStartDate = new Date(new Date().setDate(new Date().getDate()-1));
      }
      if (typeof options.historyLastEndDate === 'undefined') {
        options.historyLastEndDate = new Date(new Date().setDate(new Date().getDate()+1));
      }
      if (typeof options.chartLast === 'undefined') {
        options.chartLast = false
      }
      if (typeof options.chartLastDate === 'undefined') {
        options.chartLastDate = new Date()
      }
      if (typeof options.chartLastArrayAsJson === 'undefined') {
        options.chartLastArrayAsJson = true
      }
      if (typeof options.chartLastArray === 'undefined') {
        options.chartLastArray = false
      }
      debugApi('getAllPlantData','options:',options)
      let device = await this.getDevicesByPlant(plantId).catch(e => {debugApi('getAllPlantDeviceData getDevicesByPlant err:',e)})
      if (device && device.obj) {
        result={}
        if (device.obj.mix) {
          for (var a = 0;a < device.obj.mix.length;a++) {
            let mix = device.obj.mix[a]
            result[mix[0]]={}
            if (options.deviceTyp) {
              result[mix[0]].mix=mix
            }
            if (options.totalData) {
              let totalData = await this.getMIXTotalData(plantId,mix[0]).catch(e => {debugApi('getAllPlantDeviceData getMIXTotalData err:',e)})
              if (totalData && totalData.obj) {
                result[mix[0]].totalData=totalData.obj
              }
            }
            if (options.statusData) {
              let statusData = await this.getMIXStatusData(plantId,mix[0]).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (statusData && statusData.obj) {
                result[mix[0]].statusData=statusData.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getMIXHistory(mix[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast) {
                result[mix[0]].historyLast=historyLast
              }
            }
          }
        } else
        if (device.obj.inv) {
          for (var a = 0;a < device.obj.inv.length;a++) {
            let inv = device.obj.inv[a]
            result[inv[0]]={}
            if (options.deviceTyp) {
              result[inv[0]].inv=inv
            }
            if (options.totalData) {
              let totalData = await this.getInvTotalData(plantId,inv[0]).catch(e => {debugApi('getAllPlantDeviceData getInvTotalData err:',e)})
              if (totalData && totalData.obj) {
                result[inv[0]].totalData=totalData.obj
              }
            }
            if (options.chartLast) {
              let chart = await this.getInvChartLast(plantId,options.chartLastDate,options).catch(e => {debugApi('getAllPlantDeviceData getInvTotalData err:',e)})
              if (chart && chart.obj) {
                result[inv[0]].chart=chart.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getInverterHistory(inv[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast && historyLast) {
                result[inv[0]].historyLast=historyLast
              }
            }
          }
        } else
        if (device.obj.max) {
          for (var a = 0;a < device.obj.max.length;a++) {
            let max = device.obj.max[a]
            result[max[0]]={}
            if (options.deviceTyp) {
              result[max[0]].max=max
            }
            if (options.totalData) {
              let totalData = await this.getMAXTotalData(plantId,max[0]).catch(e => {debugApi('getAllPlantDeviceData getMAXTotalData err:',e)})
              if (totalData && totalData.obj) {
                result[max[0]].totalData=totalData.obj
              }
            }
            if (options.chartLast) {
              let chart = await this.getMAXChartLast(plantId,options.chartLastDate,options).catch(e => {debugApi('getAllPlantDeviceData getInvTotalData err:',e)})
              if (chart && chart.obj) {
                result[max[0]].chart=chart.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getMAXHistory(max[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast) {
                result[max[0]].historyLast=historyLast
              }
            }
          }
        } else
        if (device.obj.spa) {
          for (var a = 0;a < device.obj.spa.length;a++) {
            let spa = device.obj.spa[a]
            result[spa[0]]={}
            if (options.deviceTyp) {
              result[spa[0]].spa=spa
            }
            if (options.totalData) {
              let totalData = await this.getSPATotalData(plantId,spa[0]).catch(e => {debugApi('getAllPlantDeviceData getSPATotalData err:',e)})
              if (totalData && totalData.obj) {
                result[spa[0]].totalData=totalData.obj
              }
            }
            if (options.statusData) {
              let statusData = await this.getSPAStatusData(plantId,spa[0]).catch(e => {debugApi('getAllPlantDeviceData getSPAStatusData err:',e)})
              if (statusData && statusData.obj) {
                result[spa[0]].statusData=statusData.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getSPAHistory(spa[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast) {
                result[spa[0]].historyLast=historyLast
              }
            }
          }
        } else
        if (device.obj.hps) {
          for (var a = 0;a < device.obj.hps.length;a++) {
            let hps = device.obj.hps[a]
            result[hps[0]]={}
            if (options.deviceTyp) {
              result[hps[0]].hps=hps
            }
            if (options.totalData) {
              let totalData = await this.getHPSTotalData(plantId,hps[0]).catch(e => {debugApi('getAllPlantDeviceData getHPSTotalData err:',e)})
              if (totalData && totalData.obj) {
                result[hps[0]].totalData=totalData.obj
              }
            }
            if (options.statusData) {
              let statusData = await this.getHPSStatusData(plantId,hps[0]).catch(e => {debugApi('getAllPlantDeviceData getHPSStatusData err:',e)})
              if (statusData && statusData.obj) {
                result[hps[0]].statusData=statusData.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getHPSHistory(hps[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast) {
                result[hps[0]].historyLast=historyLast
              }
            }
          }
        } else
        if (device.obj.tlx) {
          for (var a = 0;a < device.obj.tlx.length;a++) {
            let tlx = device.obj.tlx[a]
            result[tlx[0]]={}
            if (options.deviceTyp) {
              result[tlx[0]].tlx=tlx
            }
            if (options.totalData) {
              let totalData = await this.getTLXTotalData(plantId,tlx[0]).catch(e => {debugApi('getAllPlantDeviceData getTLXTotalData err:',e)})
              if (totalData && totalData.obj) {
                result[tlx[0]].totalData=totalData.obj
              }
            }
            if (options.chartLast) {
              let chart = await this.getTLXChartLast(plantId,tlx[0],options.chartLastDate,options).catch(e => {debugApi('getAllPlantDeviceData getInvTotalData err:',e)})
              if (chart && chart.obj) {
                result[tlx[0]].chart=chart.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getTLXHistory(tlx[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast) {
                result[tlx[0]].historyLast=historyLast
              }
            }
          }
        } else
        if (device.obj.storage) {
          for (var a = 0;a < device.obj.storage.length;a++) {
            let storage = device.obj.storage[a]
            result[storage[0]]={}
            if (options.deviceTyp) {
              result[storage[0]].storage=storage
            }
            if (options.totalData) {
              let totalData = await this.getStorageTotalData(plantId,storage[0]).catch(e => {debugApi('getAllPlantDeviceData getStorageTotalData err:',e)})
              if (totalData && totalData.obj) {
                result[storage[0]].totalData=totalData.obj
              }
            }
            if (options.statusData) {
              let statusData = await this.getStorageStatusData(plantId,storage[0]).catch(e => {debugApi('getAllPlantDeviceData getStorageStatusData err:',e)})
              if (statusData && statusData.obj) {
                result[storage[0]].statusData=statusData.obj
              }
            }
            if (options.historyLast) {
              let historyLast = await this.getStorageHistory(storage[0],options.historyLastStartDate,options.historyLastEndDate,0).catch(e => {debugApi('getAllPlantDeviceData getMIXStatusData err:',e)})
              if (historyLast) {
                result[storage[0]].historyLast=historyLast
              }
            }
          }
        }
      }
      debugVerbose('getAllPlantDeviceData resolve:',JSON.stringify(result,null,'  '))
      resolve(result)
    })
  }
}
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

const debugApi = require('debug')('growatt:api');
const debugVerbose = require('debug')('growatt:verbose');
const Axios = require('axios');
const Url = require('url');
const https = require('https');

const server = 'https://server.growatt.com';
const timeout = 50000;
const headers = {};

const MAX = 'max';
const MIX = 'mix';
const INV = 'inv';
const TLX = 'tlx';
const STORAGE = 'storage';
const SPA = 'spa';
const HPS = 'hps';

const GROWATTTYP = {
  [MAX]: {
    snParam: 'maxSn',
    getTotalData: '/panel/max/getMAXTotalData',
    getHistory: '/device/getMAXHistory',
  },
  [MIX]: {
    snParam: 'mixSn',
    getTotalData: '/panel/mix/getMIXTotalData',
    getHistory: '/device/getMIXHistory',
    getStatusData: '/panel/mix/getMIXStatusData',
  },
  [INV]: {
    snParam: 'invSn',
    getTotalData: '/panel/inv/getInvTotalData',
    getHistory: '/device/getInverterHistory',
  },
  [TLX]: {
    snParam: 'tlxSn',
    getTotalData: '/panel/tlx/getTLXTotalData',
    getHistory: '/device/getTLXHistory',
  },
  [STORAGE]: {
    snParam: 'storageSn',
    getTotalData: '/panel/storage/getStorageTotalData',
    getHistory: '/device/getStorageHistory',
    getStatusData: '/panel/storage/getStorageStatusData',
  },
  [SPA]: {
    snParam: 'spaSn',
    getTotalData: '/panel/spa/getSPATotalData',
    getHistory: '/device/getSPAHistory',
    getStatusData: '/panel/spa/getSPAStatusData',
  },
  [HPS]: {
    snParam: 'hpsSn',
    getTotalData: '/panel/hps/getHPSTotalData',
    getHistory: '/device/getHPSHistory',
    getStatusData: '/panel/hps/getHPSStatusData',
  },
};

const LOGGERREGISTER = {
  INTERVAL: 4,
  SERVERIP: 17,
  SERVERPORT: 18,
};
const LOGGERFUNCTION = {
  REGISTER: 0,
  SERVERIP: 1,
  SERVERNAME: 2,
  SERVERPORT: 3,
};

const getJSONCircularReplacer = () => {
  const seen = new WeakMap();
  return (key, val) => {
    const value = val;
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return `loop on ${seen.get(value)}`;
      }
      seen.set(value, key);
    }
    return value;
  };
};

module.exports = class growatt {
  constructor(conf) {
    this.config = conf;
    if (typeof this.config !== 'object') this.config = {};
    if (typeof this.config.timeout === 'undefined') this.config.timeout = timeout;
    if (typeof this.config.headers === 'undefined') this.config.headers = headers;
    if (typeof this.config.server === 'undefined' || this.config.server === '') this.config.server = server;
    this.connected = false;
    this.cookie = '';
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    this.axios = Axios.create({
      baseURL: this.config.server,
      timeout: this.config.timeout,
      headers: this.config.headers,
      httpsAgent,
    });
    if (typeof this.config.lifeSignCallback !== 'undefined') this.lifeSignCallback = this.config.lifeSignCallback;
  }

  getUrl(path) {
    return this.config.server + path;
  }

  isConnected() {
    return this.connected;
  }

  extractSession() {
    let session = '';
    if (this.cookie) {
      const lines = this.cookie.split(';');
      lines.forEach(val => {
        if (val.startsWith('JSESSIONID')) {
          [, session] = val.split('=');
        }
      });
    }
    return session;
  }

  makeCallHeader(login) {
    const head = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
      // 'X-Requested-With': 'XMLHttpRequest',
      Connection: 'keep-alive',
    };
    if (login) {
      //
    } else {
      head.cookie = this.cookie;
      head.Referer = `${this.config.server}/index;jsessionid=${this.extractSession()}`;
      // head.Accept = 'application/json, text/javascript, */*; q=0.01'
      // head['Content-Length'] = 64
      // head['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return head;
  }

  login(user, password) {
    return new Promise((resolve, reject) => {
      debugApi('login:', 'user:', user, 'password:', '*no*');
      const params = new Url.URLSearchParams({ account: user, password, validateCode: '' });
      this.connected = false;
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/login'), params.toString(), { headers: this.makeCallHeader(true) })
        .then(res => {
          debugVerbose('login result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            this.cookie = res.headers['set-cookie'].toString();
            this.connected = true;
            debugApi('login resolve:', res.data);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('login reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('login reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          debugApi('login err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  demoLogin() {
    return new Promise((resolve, reject) => {
      debugApi('demoLogin:');
      this.connected = false;
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .get(this.getUrl('/login/toViewExamlePlant'), { headers: this.makeCallHeader(true) })
        .then(res => {
          debugVerbose('Session:', this.axios);
          debugVerbose('demoLogin result:', res);

          this.cookie = res.headers['set-cookie'].toString();
          if (this.cookie.includes('JSESSIONID')) {
            this.connected = true;
            debugApi('demoLogin resolve');
            resolve({ result: 1, msg: 'OK' });
          } else {
            debugApi('demoLogin reject no JSESSIONID');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          debugApi('demoLogin err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  sharePlantLogin(key) {
    return new Promise((resolve, reject) => {
      debugApi('sharePlantLogin:', 'key:', key);
      this.connected = false;
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .get(this.getUrl(`/login/toSharePlant/${key}`), {
          validateStatus(status) {
            return (status >= 200 && status < 300) || status === 302;
          },
          maxRedirects: 0,
          headers: this.makeCallHeader(true),
        })
        .then(res => {
          debugVerbose('sharePlantLogin result:', res);
          this.cookie = res.headers['set-cookie'].toString();
          if (this.cookie.includes('JSESSIONID')) {
            this.connected = true;
            debugApi('sharePlantLogin resolve');
            resolve({ result: 1, msg: 'OK' });
          } else {
            debugApi('sharePlantLogin reject no JSESSIONID');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          debugApi('sharePlantLogin err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      debugApi('logout:');
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .get(this.getUrl('/logout'), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('logout result:', res);
          this.cookie = '';
          this.connected = false;
          debugApi('logout resolve');
          resolve({ result: 1, msg: 'OK' });
        })
        .catch(e => {
          debugApi('logout err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getPlatList() {
    return new Promise((resolve, reject) => {
      debugApi('getPlatList:');
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/index/getPlantListTitle'), null, { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getPlatList result:', res);
          if (Array.isArray(res.data)) {
            debugApi('getPlatList resolve:', res.data);
            resolve(res.data);
          } else {
            this.connected = false;
            debugApi('getPlatList reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getPlatList err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getDevicesByPlantList(plantId, currPage) {
    return new Promise((resolve, reject) => {
      const params = new Url.URLSearchParams({ plantId, currPage });
      debugApi('getDevicesByPlantList:', 'plantId:', plantId, 'currPage:', currPage);
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/panel/getDevicesByPlantList'), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getDevicesByPlantList result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getDevicesByPlantList resolve:', res.data);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('getDevicesByPlantList reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getDevicesByPlantList reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getDevicesByPlantList err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getPlantData(plantId) {
    return new Promise((resolve, reject) => {
      const params = new Url.URLSearchParams({ plantId });
      debugApi('getPlantData:', 'plantId:', plantId);
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/panel/getPlantData'), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getPlantData result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getPlantData resolve:', res);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('getPlantData reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getPlantData reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getPlantData err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getWeatherByPlantId(plantId) {
    return new Promise((resolve, reject) => {
      debugApi('getWeatherByPlantId:', 'plantId:', plantId);
      const params = new Url.URLSearchParams({ plantId });
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/index/getWeatherByPlantId'), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getWeatherByPlantId result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getWeatherByPlantId resolve:', res.data);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('getWeatherByPlantId reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getWeatherByPlantId reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getWeatherByPlantId err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getDevicesByPlant(plantId) {
    return new Promise((resolve, reject) => {
      debugApi('getDevicesByPlant:', 'plantId:', plantId);
      const params = new Url.URLSearchParams({ plantId });
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/panel/getDevicesByPlant'), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getDevicesByPlant result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getDevicesByPlant resolve:', res.data);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('getDevicesByPlant reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getDevicesByPlant reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getDevicesByPlant err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getTotalData(typ, plantId, sn) {
    return new Promise((resolve, reject) => {
      debugApi('getTotalData:', 'typ', typ, 'plantId:', plantId, 'sn:', sn);
      const params = new Url.URLSearchParams({ plantId, [GROWATTTYP[typ].snParam]: sn });
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl(GROWATTTYP[typ].getTotalData), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getTotalData result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getTotalData resolve:', res.data);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('getTotalData reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getTotalData reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getTotalData err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getHistory(typ, sn, startDate, endDate, start, allDatasets) {
    return new Promise((resolve, reject) => {
      debugApi('getHistory:', 'typ', typ, 'sn:', sn, 'startDate:', startDate, 'endDate:', endDate, 'start:', start, 'allDatasets:', allDatasets);
      const params = new Url.URLSearchParams({
        [GROWATTTYP[typ].snParam]: sn,
        startDate: startDate.toISOString().substring(0, 10),
        endDate: endDate.toISOString().substring(0, 10),
        start,
      });
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl(GROWATTTYP[typ].getHistory), params.toString(), {
          headers: this.makeCallHeader(),
          // headers: { cookie: this.cookie, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        })
        .then(res => {
          debugVerbose('getHistory result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getHistory resolve:', res.data);
            if (res.data.obj && res.data.obj.datas && res.data.obj.datas[0]) {
              if (allDatasets) {
                res.data.obj.datas.forEach(data => this.correctTime(data));
                debugApi('getHistory resolve:', res.data.obj.datas);
                resolve(res.data.obj.datas);
              } else {
                this.correctTime(res.data.obj.datas[0]);
                debugApi('getHistory resolve:', res.data.obj.datas[0]);
                resolve(res.data.obj.datas[0]);
              }
            } else {
              debugApi('getHistory cant find the data');
              resolve({});
            }
          } else if (res.data && res.data.result) {
            debugApi('getHistory reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getHistory reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getHistory err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getStatusData(typ, plantId, sn) {
    return new Promise((resolve, reject) => {
      debugApi('getStatusData:', 'typ', typ, 'plantId:', plantId, 'sn', sn);
      const params = new Url.URLSearchParams({ plantId, [GROWATTTYP[typ].snParam]: sn });
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl(GROWATTTYP[typ].getStatusData), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getStatusData result:', res);
          if (res.data && res.data.result && res.data.result === 1) {
            debugApi('getStatusData resolve:', res.data);
            resolve(res.data);
          } else if (res.data && res.data.result) {
            debugApi('getStatusData reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('getStatusData reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getStatusData err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getDataLoggerRegister(dataLogSn, addr) {
    const param = { action: 'readDatalogParam', dataLogSn, paramType: 'set_any_reg', addr };
    return this.comDataLogger(param);
  }

  setDataLoggerRegister(dataLogSn, addr, value) {
    const param = { action: 'setDatalogParam', dataLogSn, paramType: LOGGERFUNCTION.REGISTER, param_1: addr, param_2: value };
    return this.comDataLogger(param);
  }

  setDataLoggerParam(dataLogSn, paramType, value) {
    const param = { action: 'setDatalogParam', dataLogSn, paramType, param_1: value, param_2: '' };
    return this.comDataLogger(param);
  }

  setDataLoggerRestart(dataLogSn) {
    const param = { action: 'restartDatalog', dataLogSn };
    return this.comDataLogger(param);
  }

  checkDataLoggerFirmware(type, version) {
    const param = { action: 'checkFirmwareVersion', deviceTypeIndicate: type, firmwareVersion: version };
    return this.comDataLogger(param);
  }

  comDataLogger(param) {
    return new Promise((resolve, reject) => {
      debugApi('comDataLogger:', param);
      const params = new Url.URLSearchParams(param);
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/ftp.do'), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('comDataLogger result:', res);
          if (res.data && typeof res.data.success !== 'undefined') {
            debugApi('comDataLogger resolve:', JSON.stringify(res.data, getJSONCircularReplacer()));
            resolve(res.data);
          } else if (res.data) {
            debugApi('comDataLogger reject:', res.data);
            reject(new Error(JSON.stringify(res.data, getJSONCircularReplacer())));
          } else {
            debugApi('comDataLogger reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('comDataLogger err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  getDataLoggers() {
    async function doIt(resolve, reject) {
      let loggers = [];
      const plants = await this.getPlatList().catch(e => {
        debugApi('getDataLoggers getPlatList err:', e);
        reject(e);
      });
      if (plants) {
        // eslint-disable-next-line no-restricted-syntax
        for (const plant of plants) {
          let res = {};
          let curPage = 0;
          do {
            curPage += 1;
            // eslint-disable-next-line no-await-in-loop
            res = await this.getDataLogger(plant.id, curPage).catch(e => {
              debugApi('getDataLoggers getDataLogger err:', e);
              reject(e);
            });
            if (res.datas) {
              loggers = loggers.concat(res.datas);
            }
            curPage += 1;
            if (res.currPage) {
              curPage = res.currPage;
            }
          } while (!!res.currPage && !!res.pages && res.currPage < res.pages);
        }
      }
      resolve(loggers);
    }
    return new Promise(doIt.bind(this));
  }

  getDataLogger(plantId, currPage = 1) {
    return new Promise((resolve, reject) => {
      debugApi('getDataLogger:', plantId, currPage);
      const params = new Url.URLSearchParams({ datalogSn: '', plantId, currPage });
      if (this.lifeSignCallback) this.lifeSignCallback();
      this.axios
        .post(this.getUrl('/device/getDatalogList'), params.toString(), { headers: this.makeCallHeader() })
        .then(res => {
          debugVerbose('getDataLogger result:', res);
          if (res.data && typeof res.data === 'object') {
            debugApi('getDataLogger resolve:', res.data);
            resolve(res.data);
          } else {
            debugApi('getDataLogger reject');
            if (res.request.path.match('errorMess')) {
              reject(new Error(`The server sent an unexpected response: ${res.request.path}`));
            } else {
              reject(new Error('The server sent an unexpected response, a fatal error has occurred'));
            }
          }
        })
        .catch(e => {
          this.connected = false;
          debugApi('getDataLogger err:', JSON.stringify(e, getJSONCircularReplacer(), '  '));
          reject(e);
        });
    });
  }

  /* eslint-disable-next-line class-methods-use-this */
  correctTime(struct) {
    function makeTime(time) {
      if (
        typeof time.year !== 'undefined' &&
        typeof time.month !== 'undefined' &&
        typeof time.dayOfMonth !== 'undefined' &&
        typeof time.hourOfDay !== 'undefined' &&
        typeof time.minute !== 'undefined' &&
        typeof time.second !== 'undefined'
      ) {
        return new Date(time.year, time.month, time.dayOfMonth, time.hourOfDay, time.minute, time.second).toISOString();
      }
      return new Date().toISOString();
    }
    if (typeof struct.time !== 'undefined') {
      struct.time = makeTime(struct.time);
    } else if (typeof struct.calendar !== 'undefined') {
      struct.calendar = makeTime(struct.calendar);
    }
  }

  getAllPlantData(opt) {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      let options = opt;
      debugApi('getAllPlantData', 'options:', options);
      const result = {};
      if (typeof options !== 'object') {
        options = {};
      }
      if (typeof options.plantData === 'undefined') {
        options.plantData = true;
      }
      if (typeof options.deviceData === 'undefined') {
        options.deviceData = true;
      }
      if (typeof options.weather === 'undefined') {
        options.weather = true;
      }
      debugApi('getAllPlantData', 'options:', options);
      const plants = await this.getPlatList().catch(e => {
        debugApi('getAllPlantData getPlatList err:', e);
        reject(e);
      });
      if (plants) {
        for (let i = 0; i < plants.length; i += 1) {
          const plant = plants[i];
          if (typeof options.plantId === 'undefined' || plant.id.toString() === options.plantId.toString()) {
            result[plant.id] = plant;
            if (options.plantData) {
              result[plant.id].plantData = {};
              /* eslint-disable-next-line no-await-in-loop */
              const plantData = await this.getPlantData(plant.id).catch(e => {
                debugApi('getAllPlantData getPlantData err:', e);
                reject(e);
              });
              if (plantData && plantData.obj) {
                result[plant.id].plantData = plantData.obj;
              }
            }
            if (options.weather) {
              result[plant.id].weather = {};
              /* eslint-disable-next-line no-await-in-loop */
              const weather = await this.getWeatherByPlantId(plant.id).catch(e => {
                debugApi('getAllPlantData getWeatherByPlantId err:', e);
                reject(e);
              });
              if (weather && weather.obj) {
                result[plant.id].weather = weather.obj;
              }
            }
            /* eslint-disable-next-line no-await-in-loop */
            result[plant.id].devices = await this.getAllPlantDeviceData(plant.id, options).catch(e => {
              debugApi('getAllPlantData getAllPlantDeviceData err:', e);
              reject(e);
            });
            if (options.deviceData) {
              /* eslint-disable-next-line no-await-in-loop */
              const devices = await this.getDevicesByPlantList(plant.id, 1).catch(e => {
                debugApi('getAllPlantData getDevicesByPlantList err:', e);
                reject(e);
              });
              if (devices && devices.obj && devices.obj.datas) {
                if (devices.obj.pages && devices.obj.pages > 1) {
                  for (let p = 1; p < devices.obj.pages; p += 1) {
                    /* eslint-disable-next-line no-await-in-loop */
                    const devicesPlus = await this.getDevicesByPlantList(plant.id, p).catch(e => {
                      debugApi('getAllPlantData getDevicesByPlantList err:', e);
                      reject(e);
                    });
                    devices.obj.datas = devices.obj.datas.concat(devicesPlus.obj.datas);
                  }
                }
                for (let n = 0; n < devices.obj.datas.length; n += 1) {
                  const devData = devices.obj.datas[n];
                  if (!result[plant.id].devices) {
                    result[plant.id].devices = {};
                  }
                  if (!result[plant.id].devices[devData.sn]) {
                    result[plant.id].devices[devData.sn] = {};
                  }
                  result[plant.id].devices[devData.sn].deviceData = devData;
                }
              }
            }
          }
        }
      }
      debugVerbose('getAllPlantData resolve:', JSON.stringify(result, getJSONCircularReplacer(), '  '));
      resolve(result);
    });
  }

  getAllPlantDeviceData(plantId, opt) {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      let options = opt;
      debugApi('getAllPlantDeviceData:', 'plantId:', plantId, 'options:', options);
      let result = {};
      if (typeof options !== 'object') {
        options = {};
      }
      if (typeof options.totalData === 'undefined') {
        options.totalData = true;
      }
      if (typeof options.statusData === 'undefined') {
        options.statusData = true;
      }
      if (typeof options.deviceTyp === 'undefined') {
        options.deviceTyp = false;
      }
      if (typeof options.historyLast === 'undefined') {
        options.historyLast = true;
      }
      if (typeof options.historyAll === 'undefined') {
        options.historyAll = false;
      }
      if (typeof options.historyLastStartDate === 'undefined') {
        options.historyLastStartDate = new Date(new Date().setDate(new Date().getDate() - 1));
      }
      if (typeof options.historyLastEndDate === 'undefined') {
        options.historyLastEndDate = new Date(new Date().setDate(new Date().getDate() + 1));
      }
      if (typeof options.historyStart === 'undefined') {
        options.historyStart = 0;
      }
      debugApi('getAllPlantDeviceData', 'options:', options);
      const device = await this.getDevicesByPlant(plantId).catch(e => {
        debugApi('getAllPlantDeviceData getDevicesByPlant err:', e);
        reject(e);
      });
      if (device && device.obj) {
        result = {};
        let growattTyp = '';
        if (device.obj.max) {
          growattTyp = MAX;
        } else if (device.obj.mix) {
          growattTyp = MIX;
        } else if (device.obj.inv) {
          growattTyp = INV;
        } else if (device.obj.tlx) {
          growattTyp = TLX;
        } else if (device.obj.storage) {
          growattTyp = STORAGE;
        } else if (device.obj.spa) {
          growattTyp = SPA;
        } else if (device.obj.hps) {
          growattTyp = HPS;
        }
        if (growattTyp !== '' && GROWATTTYP[growattTyp]) {
          for (let a = 0; a < device.obj[growattTyp].length; a += 1) {
            const serialNr = device.obj[growattTyp][a][0];
            result[serialNr] = {};
            if (options.deviceTyp) {
              result[serialNr][growattTyp] = device.obj[growattTyp][a];
            }
            if (options.totalData) {
              /* eslint-disable-next-line no-await-in-loop */
              const totalData = await this.getTotalData(growattTyp, plantId, serialNr).catch(e => {
                debugApi(`getAllPlantDeviceData getTotalData ${growattTyp} err:`, e);
                reject(e);
              });
              if (totalData && totalData.obj) {
                result[serialNr].totalData = totalData.obj;
              }
            }
            if (options.statusData && GROWATTTYP[growattTyp].getStatusData) {
              /* eslint-disable-next-line no-await-in-loop */
              const statusData = await this.getStatusData(growattTyp, plantId, serialNr).catch(e => {
                debugApi(`getAllPlantDeviceData getStatusData ${growattTyp} err:`, e);
                reject(e);
              });
              if (statusData && statusData.obj) {
                result[serialNr].statusData = statusData.obj;
              }
            }
            if (options.historyLast || options.historyAll) {
              /* eslint-disable-next-line no-await-in-loop */
              const historyLast = await this.getHistory(
                growattTyp,
                serialNr,
                options.historyLastStartDate,
                options.historyLastEndDate,
                options.historyStart,
                options.historyAll
              ).catch(e => {
                debugApi(`getAllPlantDeviceData getHistory ${growattTyp} err:`, e);
                reject(e);
              });
              if (historyLast) {
                if (options.historyAll) {
                  result[serialNr].historyAll = historyLast;
                } else {
                  result[serialNr].historyLast = historyLast;
                }
              }
            }
          }
        }
      }
      debugVerbose('getAllPlantDeviceData resolve:', JSON.stringify(result, getJSONCircularReplacer(), '  '));
      resolve(result);
    });
  }
};

module.exports.LOGGERREGISTER = LOGGERREGISTER;
module.exports.LOGGERFUNCTION = LOGGERFUNCTION;

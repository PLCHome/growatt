// Copyright (c) 2023 Träger

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

module.exports = class {
  static INUM_0_100(val) {
    debugApi('INUM_0_100:', val);
    return [val, Number.isInteger(val) && val >= 0 && val <= 100];
  }

  static INUM_0_24(val) {
    debugApi('INUM_0_24:', val);
    return [val, Number.isInteger(val) && val >= 0 && val <= 24];
  }

  static INUM_0_60(val) {
    debugApi('INUM_0_60:', val);
    return [val, Number.isInteger(val) && val >= 0 && val <= 60];
  }

  static INUM_0_1(val) {
    debugApi('INUM_0_1:', val);
    return [val, Number.isInteger(val) && val >= 0 && val <= 1];
  }

  static INUM_0_2(val) {
    debugApi('INUM_0_2:', val);
    return [val, Number.isInteger(val) && val >= 0 && val <= 2];
  }

  static BOOL(val) {
    debugApi('BOOL:', val);
    return [val === true ? 1 : 0, val === false || val === true];
  }

  static STIME_H_MIN(val) {
    debugApi('STIME_H_MIN:', val);
    return [val, /^(2[0-3]|[01][0-9]):([0-5][0-9])$/.test(val)];
  }

  static DATETIME(val) {
    debugApi('DATETIME:', val);
    try {
      const d = new Date(val);
      const year = `000${d.getFullYear()}`.slice(-4);
      const month = `0${d.getMonth() + 1}`.slice(-2);
      const day = `0${d.getDate()}`.slice(-2);
      const hour = `0${d.getHours()}`.slice(-2);
      const minute = `0${d.getMinutes()}`.slice(-2);
      const secunde = `0${d.getSeconds()}`.slice(-2);
      const res = `${year}-${month}-${day} ${hour}:${minute}:${secunde}`;
      return [res, /^[0-9][0-9][0-9][0-9]-(1[0-2]|0[1-9])-(3[0-1]|[0-2][0-9]) (2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$/.test(res)];
      /* eslint-disable-next-line no-unused-vars */
    } catch (Error) {
      return [0, false];
    }
  }
};

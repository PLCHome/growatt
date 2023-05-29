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

const debugQueue = require('debug')('growatt:queue');

module.exports = class queue {
  constructor() {
    debugQueue(`queue constructor: `);
    this.q = [];
    this.inUse = false;
  }

  addTask(funcA, funcB) {
    debugQueue(`addTask: `);
    return new Promise(resolve => {
      this.q.push(() => {
        resolve([this.changeR(funcA), this.changeR(funcB)]);
      });
      this.relaseNext();
    });
  }

  taskFinished() {
    debugQueue(`taskFinished: this.inUser ${this.inUse}`);
    this.inUse = false;
    this.relaseNext();
  }

  relaseNext() {
    debugQueue(`relaseNext: this.inUser ${this.inUse}`);
    if (!this.inUse) {
      const resolve = this.q.shift();
      if (typeof resolve !== 'undefined') {
        this.inUse = true;
        debugQueue(`relaseNext nextFound: this.inUser ${this.inUse}`);
        resolve();
      }
    }
  }

  changeR(func) {
    debugQueue(`changeR: `);
    return v => {
      this.taskFinished();
      func(v);
    };
  }
};

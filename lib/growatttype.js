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

const PARSERET = require('./parseret');

const MAX = 'max';
const MIX = 'mix';
const INV = 'inv';
const TLX = 'tlx';
const TLXH = 'tlxh';
const STORAGE = 'storage';
const SPA = 'spa';
const HPS = 'hps';
const NOAH = 'noah';
const SINGLEBACKFLOW = 'singleBackflow';
const MULTIPLEBACKFLOW = 'multipleBackflow';

module.exports = {
  [MAX]: {
    snParam: 'maxSn',
    getTotalData: '/panel/max/getMAXTotalData',
    getHistory: '/device/getMAXHistory',
    readParam: 'readMaxParam',
    writeParam: 'maxSet',
    comInverter: {
      time: {
        name: 'Time',
        type: 'pf_sys_year',
        paramId: 'pf_sys_time_mutli',
        parseRet: PARSERET.parseRetDate,
        param: { param1: { name: 'Time', type: 'DATETIME' } },
      },
      pvActivePRate: {
        name: 'PV active power rate',
        type: 'pv_active_p_rate',
        paramId: 'pv_active_p_rate',
        parseRet: PARSERET.parseRetNum,
        param: { param1: { name: 'Active power rate', type: 'INUM_0_100', unit: '%' }, param2: { name: 'Store', type: 'BOOL', def: false } },
      },
    },
  },
  [MIX]: {
    snParam: 'mixSn',
    getTotalData: '/panel/mix/getMIXTotalData',
    getHistory: '/device/getMIXHistory',
    getStatusData: '/panel/mix/getMIXStatusData',
    readParam: 'readMixParam',
    writeParam: 'mixSet',
    comInverter: {
      time: {
        name: 'Time',
        type: 'pf_sys_year',
        paramId: 'pf_sys_time_mutli',
        parseRet: PARSERET.parseRetDate,
        param: { param1: { name: 'Time', type: 'DATETIME' } },
      },
      gridFirst: {
        name: 'Grid first',
        type: 'mix_ac_discharge_time_period',
        paramId: 'MIX_AC_DISCHARGE_TIME_MULTI',
        parseRet: PARSERET.parseGritFirst,
        param: {
          param1: { name: 'Discharge power rate', type: 'INUM_0_100', unit: '%' },
          param2: { name: 'Discharge stopped soc', type: 'INUM_0_100', unit: '%' },
          param3: { name: 'Time slot 1 start HH', type: 'INUM_0_24' },
          param4: { name: 'Time slot 1 start MI', type: 'INUM_0_60' },
          param5: { name: 'Time slot 1 end HH', type: 'INUM_0_24' },
          param6: { name: 'Time slot 1 end MI', type: 'INUM_0_60' },
          param7: { name: 'Time slot 1 on', type: 'BOOL' },
          param8: { name: 'Time slot 2 start HH', type: 'INUM_0_24' },
          param9: { name: 'Time slot 2 start MI', type: 'INUM_0_60' },
          param10: { name: 'Time slot 2 end HH', type: 'INUM_0_24' },
          param11: { name: 'Time slot 2 end MI', type: 'INUM_0_60' },
          param12: { name: 'Time slot 2 on', type: 'BOOL' },
          param13: { name: 'Time slot 3 start HH', type: 'INUM_0_24' },
          param14: { name: 'Time slot 3 start MI', type: 'INUM_0_60' },
          param15: { name: 'Time slot 3 end HH', type: 'INUM_0_24' },
          param16: { name: 'Time slot 3 end MI', type: 'INUM_0_60' },
          param17: { name: 'Time Slot 3 on', type: 'BOOL' },
        },
      },
      batteryFirst: {
        name: 'Battery first',
        type: 'mix_ac_charge_time_period',
        paramId: 'mix_ac_charge_time_multi',
        parseRet: PARSERET.parseBatteryFirst,
        param: {
          param1: { name: 'Charge power rate', type: 'INUM_0_100', unit: '%' },
          param2: { name: 'Charge stopped soc', type: 'INUM_0_100', unit: '%' },
          param3: { name: 'AC Charge on', type: 'BOOL' },
          param4: { name: 'Time slot 1 start HH', type: 'INUM_0_24' },
          param5: { name: 'Time slot 1 start MI', type: 'INUM_0_60' },
          param6: { name: 'Time slot 1 end HH', type: 'INUM_0_24' },
          param7: { name: 'Time slot 1 end MI', type: 'INUM_0_60' },
          param8: { name: 'Time slot 1 on', type: 'BOOL' },
          param9: { name: 'Time slot 2 start HH', type: 'INUM_0_24' },
          param10: { name: 'Time slot 2 start MI', type: 'INUM_0_60' },
          param11: { name: 'Time slot 2 end HH', type: 'INUM_0_24' },
          param12: { name: 'Time slot 2 end MI', type: 'INUM_0_60' },
          param13: { name: 'Time slot 2 on', type: 'BOOL' },
          param14: { name: 'Time slot 3 start HH', type: 'INUM_0_24' },
          param15: { name: 'Time slot 3 start MI', type: 'INUM_0_60' },
          param16: { name: 'Time slot 3 end HH', type: 'INUM_0_24' },
          param17: { name: 'Time slot 3 end MI', type: 'INUM_0_60' },
          param18: { name: 'Time Slot 3 on', type: 'BOOL' },
        },
      },
      loadFirst: {
        name: 'Load first',
        type: 'mix_load_flast_value_multi',
        paramId: 'mix_load_flast_value_multi',
        parseRet: PARSERET.parseRetNum,
        param: { param1: { name: 'Discharge Stopped Soc', type: 'INUM_0_100' } },
      },
      epsOn: {
        name: 'EPS on',
        type: 'mix_off_grid_enable',
        paramId: 'mix_off_grid_enable',
        parseRet: PARSERET.parseRetBool,
        param: { param1: { name: 'EPS On', type: 'BOOL' } },
      },
      failsafe: {
        name: 'Failsafe',
        type: 'setFailsafe',
        paramId: 'mix_failsafe',
        parseRet: PARSERET.parseRetBool,
        param: { param1: { name: 'Failsafe on', type: 'BOOL' } },
      },
      pvActivePRate: {
        name: 'PV active power rate',
        type: 'pv_active_p_rate',
        paramId: 'pv_active_p_rate',
        parseRet: PARSERET.parseRetNum,
        param: { param1: { name: 'Active power rate', type: 'INUM_0_100', unit: '%' } },
      },
      pvOnOff: {
        name: 'Inverter On/Off',
        type: 'pv_on_off',
        paramId: 'pv_on_off',
        parseRet: PARSERET.parseRetBoot,
        param: { param1: { name: 'Inverter On/Off', type: 'INUM_0_1', values: { 1: 'Boot', 0: 'Shut down' } } },
      },
      backflowSetting: {
        name: 'Backflow setting',
        type: 'backflow_setting',
        paramId: 'backflow_setting',
        parseRet: PARSERET.parseRetBool,
        param: { param1: { name: 'Exportlimit on', type: 'BOOL' }, param2: { name: 'Exportlimit', type: 'INUM_0_100', unit: '%' } },
        subRead: ['backflowSettingPower'],
      },
      backflowSettingPower: {
        name: 'Backflow setting',
        paramId: 'backflow_power',
        parseRet: PARSERET.parseRetNum2div10,
        isSubread: 'backflowSetting',
      },
    },
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
    getStatusData: '/panel/tlx/getTLXStatusData_bdc',
    readParam: 'readMinParam',
    writeParam: 'tlxSet',
    comInverter: {
      time: {
        name: 'Time',
        type: 'pf_sys_year',
        paramId: 'pf_sys_time_mutli',
        parseRet: PARSERET.parseRetDate,
        param: { param1: { name: 'Time', type: 'DATETIME' } },
      },
      pvActivePRate: {
        name: 'PV active power rate',
        type: 'pv_active_p_rate',
        paramId: 'pv_active_p_rate',
        parseRet: PARSERET.parseRetNum,
        param: { param1: { name: 'Active power rate', type: 'INUM_0_100', unit: '%' }, param2: { name: 'Store', type: 'BOOL', def: false } },
      },
      pvOnOff: {
        name: 'Inverter On/Off',
        type: 'tlx_on_off',
        paramId: 'tlx_on_off',
        parseRet: PARSERET.parseRetBoot,
        param: { param1: { name: 'Inverter On/Off', type: 'INUM_0_1', values: { 1: 'Boot', 0: 'Shut down' } } },
      },
    },
  },
  [TLXH]: {
    snParam: 'tlxSn',
    getTotalData: '/panel/tlx/getTLXTotalData',
    getHistory: '/device/getTLXHistory',
    getStatusData: '/panel/tlx/getTLXStatusData_bdc',
    readParam: 'readMinParam',
    writeParam: 'tlxSet',
    comInverter: {
      time: {
        name: 'Time',
        type: 'pf_sys_year',
        paramId: 'pf_sys_time_mutli',
        parseRet: PARSERET.parseRetDate,
        param: { param1: { name: 'Time', type: 'DATETIME' } },
      },
      pvActivePRate: {
        name: 'PV active power rate',
        type: 'pv_active_p_rate',
        paramId: 'pv_active_p_rate',
        parseRet: PARSERET.parseRetNum,
        param: { param1: { name: 'Active power rate', type: 'INUM_0_100', unit: '%' }, param2: { name: 'Store', type: 'BOOL', def: false } },
      },
      timeSlot1: {
        name: 'Time Slot 1',
        type: 'time_segment1',
        paramId: 'time_segment1',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot2: {
        name: 'Time Slot 2',
        type: 'time_segment2',
        paramId: 'time_segment2',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot3: {
        name: 'Time Slot 3',
        type: 'time_segment3',
        paramId: 'time_segment3',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot4: {
        name: 'Time Slot 4',
        type: 'time_segment4',
        paramId: 'time_segment4',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot5: {
        name: 'Time Slot 5',
        type: 'time_segment5',
        paramId: 'time_segment5',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot6: {
        name: 'Time Slot 6',
        type: 'time_segment6',
        paramId: 'time_segment6',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot7: {
        name: 'Time Slot 7',
        type: 'time_segment7',
        paramId: 'time_segment7',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot8: {
        name: 'Time Slot 8',
        type: 'time_segment8',
        paramId: 'time_segment8',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      timeSlot9: {
        name: 'Time Slot 9',
        type: 'time_segment9',
        paramId: 'time_segment9',
        parseRet: PARSERET.parseTLXHTimeSlot,
        param: {
          param1: { name: 'Mode', type: 'INUM_0_2', values: { 2: 'Grid First', 1: 'Battery First', 0: 'Load First' } },
          param2: { name: 'Start HH', type: 'INUM_0_24' },
          param3: { name: 'Start MI', type: 'INUM_0_60' },
          param4: { name: 'End HH', type: 'INUM_0_24' },
          param5: { name: 'End MI', type: 'INUM_0_60' },
          param6: { name: 'Enabled', type: 'BOOL' },
        },
      },
      pvOnOff: {
        name: 'Inverter On/Off',
        type: 'tlx_on_off',
        paramId: 'tlx_on_off',
        parseRet: PARSERET.parseRetBoot,
        param: { param1: { name: 'Inverter On/Off', type: 'INUM_0_1', values: { 1: 'Boot', 0: 'Shut down' } } },
      },
      acCharge: {
        name: 'AC charge',
        type: 'ac_charge',
        paramId: 'ac_charge',
        parseRet: PARSERET.parseRetBool,
        param: { param1: { name: 'AC charge On', type: 'BOOL' } },
      },
    },
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
  [SINGLEBACKFLOW]: {
    snParam: 'datalogSn',
    addrParam: 'addr',
    invIdParam: 'invId',
    getTotalData: '/panel/singleBackflow/getSingleBackflowTotalData',
    getStatusData: '/panel/singleBackflow/getSingleBackflowStatusData',
  },
  [MULTIPLEBACKFLOW]: {
    snParam: 'ammerSn',
    atIndex: 2,
    getTotalData: '/panel/multipleBackflow/getMultipleBackflowTotalData',
    getStatusData: '/panel/multipleBackflow/getMultipleBackflowStatusData',
  },
  [NOAH]: {
    snParam: 'deviceSn',
    getTotalData: '/device/getPlantTotalData',
    getHistory: '/device/getNoahHistory',
  },
};

### 0.7.7: Maintenance Release

**Enhancements**

- Added ac charge for TLXH. Thanx to olli0815!

### 0.7.6: Maintenance Release

**Enhancements**

- Added time slots for TLXH. Thanx to olli0815!
- Added Inverter On Off for TLX und TLXH. Thanx to olli0815!
- Added feature to enable debug

### 0.7.5: Maintenance Release

**Enhancements**

- Added NOAH.

**Fixes**

- Solved the problem that no inverter list but result 2 was returned in NOAH.

### 0.7.4: Maintenance Release

**Fixes**

- no connection can be established password must now be transferred as MD5 hash.
- cookie issue
- eslint adjustments
- update all modules

### 0.7.3: Maintenance Release

**Enhancements**

- With multiple backflow total data and status data were swapped.

### 0.7.2: Maintenance Release

**Enhancements**

- Reading and writing of inverter configuration settings
  - max
    - Time
    - PV active power rate
- a question to query logs #19

### 0.7.1: Maintenance Release

**Enhancements**

- Additionally query the status information via the Plant List.

### 0.7.0: Maintenance Release

**Enhancements**

- Inverter typ singleBackflow and multipleBackflow added.

### 0.6.0: Maintenance Release

**Enhancements**

- Add switch indexCandI to the config Objekt.
  - Set to true if your Growatt page Plant is a C&I Plant page with indexbC or plantDo in the Path from the Growatt webinterface.

### 0.5.6: Maintenance Release

**Fixes**

- No retrieval of the other parameters value possible after parameter error

### 0.5.5: Maintenance Release

**Fixes**

- Grid first and Battery first setting on MIX may not work

### 0.5.4: Maintenance Release

**Fixes**

- time setting on TLX may not work #14

### 0.5.3: Maintenance Release

**Fixes & Enhancements**

- Removed acceleration through parallel reading of all data

### 0.5.2: Maintenance Release

**Fixes**

- settings on TLX may not work

### 0.5.1: Maintenance Release

**Fixes**

- Fixed reading time type

**Enhancements**

- Acceleration through parallel reading of all data
- New check for inverter on/off parameter
- Added unit and possible values ​​to parameter object
- Add reading and writing of inverter configuration settings
  - mix
    - Inverter On/Off

### 0.5.0: Maintenance Release

**Fixes**

- replaced german typ against type

**Enhancements**

- Split into multiple JS files
- Added new property "growattType" inside Serial Number object. So that the settings for the type can be queried.
- new internal function comInverter
- added to readme.md
  - new function getInverterCommunication
  - new function getInverterSetting
  - new function setInverterSetting
- Reading and writing of inverter configuration settings
  - mix
    - Time
    - Grid first
    - Battery first
    - LoadFirst
    - Failsafe
    - PV active power rate
    - Backflow setting
      - Backflow setting power
    - EPSOn
  - tlx/tlxh
    - Time
    - PV active power rate

### 0.4.1: Maintenance Release

**Fixes**

- calendar structure was not always changed to timestamp

### 0.4.0: Maintenance Release

**Enhancements**

- Status data now also from TLX/TLXH

**Fixes**

- TLX Hybrid is now working
- If there are different inverters, these are now shown

### 0.3.0: Maintenance Release

**Enhancements**

- other Server over options
- Data logger settings can be called up and changed.

### 0.2.14: Maintenance Release

**Fixes**

- LINT

### 0.2.13: Maintenance Release

**Fixes**

- HEADER changed

### 0.2.12: Maintenance Release

**Fixes**

- JSON loopkiller

### 0.2.11: Maintenance Release

**Fixes**

- https rejectUnauthorized false

### 0.2.10: Maintenance Release

**Fixes**

- historyAll may not work

### 0.2.9: Maintenance Release

**Fixes**

- Typ inv was missing in desission for total data and history data

### 0.2.8: Maintenance Release

**Enhancements**

- added new speedup method to readme
- remove duplicate code for better maintenance

### 0.2.7: Maintenance Release

**Enhancements**

- added option historyAll
- removed chart

### 0.2.5: Maintenance Release

**Enhancements**

- make the source a little prettier
- added Test and Release
- solve a loop problem: used i in inner and outer loop
- solve a sentry problem: undefined object

### 0.2.4: Maintenance Release

**Enhancements**

- lifeSignCallback added

### 0.2.3: Maintenance Release

**Enhancements**

- Improved error handling
- Error output: if the key has expired, requests are forwarded with an error code, which is now in the reject message
- Update the includes
- Added "validateCode" to login object

### 0.2.2: Maintenance Release

**Enhancements**

- timeout increased and config object built into constructor

### 0.2.1: Maintenance Release

**Fixes**

- spelling mistakes

### 0.2.0: Maintenance Release

**Enhancements**

- API changed from function collection to class and Axios session.

### 0.1.1: Maintenance Release

**Enhancements**

- The readme improved

### 0.1.0: Maintenance Release

**Fixes**

- Create a date from the time or calendar structure for last history data for all devices sometimes not working

### 0.0.9: Maintenance Release

**Enhancements**

- Create a date from the time or calendar structure for last history data for all devices

### 0.0.8: Maintenance Release

**Fixes**

- fixes chart data no longer default

### 0.0.7: Maintenance Release

**Fixes**

- fixes a date issue on inverter history data

### 0.0.6: Maintenance Release

**Enhancements**

- npm package version update axios to 0.21.1
- get the last history data for all devices

**Fixes**

- fixes a date issue on chart data

### 0.0.5: Maintenance Release

**Enhancements**

- npm package version update

### 0.0.4: Maintenance Release

**Fixes**

- improvement for objects not returned from Growatt website
- Some console.log removed

### 0.0.3: Maintenance Release

**Enhancements**

- sharePlantLogin: Login with the plant share key.
- getAllPlantData and getAllPlantDeviceData: options added "deviceTyp default false"
- Inv/MIX/TLX get..ChartLast added for the last chart value for the missing Status data function
  new options:chartLast default true, options.chartLastDate defalut the date
  chartLastArrayAsJson default true, chartLastArray default false

### 0.0.2: Initial Release

**Enhancements**

- getAllPlantData and getAllPlantDeviceData: options added for selective api calls.

### 0.0.0: Initial Release

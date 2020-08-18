"use strict"
const Growatt = require('./lib/growatt.js')
const fs = require('fs');

async function test() {
  let login = await Growatt.demoLogin().catch(e => {console.log(e)})
  let allPlantData = await Growatt.getAllPlantData().catch(e => {console.log(e)})
  console.log('Fatched all Data')
  fs.writeFileSync('test.json', JSON.stringify(allPlantData,null,' '));
  let logout = await Growatt.logout().catch(e => {console.log(e)})
  console.log('logout:',logout)
}

test()

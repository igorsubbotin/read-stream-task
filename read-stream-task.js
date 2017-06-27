'use strict';

const fs = require('fs');
const readStream = require('./read-stream');

async function read(path) {
  let stream = fs.createReadStream(path, {highWaterMark: 60, encoding: 'utf-8'});
  let data;
  let reader = readStream(stream);
  while(data = await reader()) {
    console.log(data.length);
  }
};

read('data/small.txt').catch(console.error);
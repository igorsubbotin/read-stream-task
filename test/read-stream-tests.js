const chai = require('chai');
const should = chai.should();
const fs = require('fs');
const readStream = require('../read-stream');

describe('Read stream tests', () => {
    it('reads small file correctly', async () => {
      // arrange
      let path = 'data/small.txt';
      let stream = fs.createReadStream(path, {highWaterMark: 60, encoding: 'utf-8'});
      let data;
      let reader = readStream(stream);

      // act
      let i = 0;
      let size = 0;
      let content;
      while(data = await reader()) {
        content = data;
        i++;
      }    

      // assert
      i.should.be.equal(1);
      fileContent = fs.readFileSync(path).toString();
      content.should.be.equal(fileContent);
    });

    it('reads large file correctly', async () => {
      // arrange
      let path = 'data/large.txt';
      let stream = fs.createReadStream(path, {highWaterMark: 60, encoding: 'utf-8'});
      let data;
      let reader = readStream(stream);

      // act
      let i = 0;
      let size = 0;
      let content = '';
      while(data = await reader()) {
        content += data;
        i++;
      }    

      // assert
      i.should.be.equal(17); // should be calculated depends on file size actually
      fileContent = fs.readFileSync(path).toString();
      content.should.be.equal(fileContent);
      stream.listenerCount('data').should.be.equal(0);
      stream.listenerCount('end').should.be.equal(1);
      stream.listenerCount('error').should.be.equal(0);
    });

    it('handles error correctly', (done) => {
      // arrange
      const fileName = 'no-file.ext';

      // act
      read('no-file.ext').catch((err) => { 
            // assert
            err.code.should.be.equal('ENOENT');
            done();
        });
    });
});

async function read(path) {
  let stream = fs.createReadStream(path, {highWaterMark: 60, encoding: 'utf-8'});
  let data;
  let reader = readStream(stream);
  while(data = await reader()) { }
};
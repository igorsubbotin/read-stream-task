const events = require('events');

module.exports = (stream) => {
  return () => {
    return new Promise((resolve, reject) => {
        const removeListeners = () => {
            stream.removeListener('data', onData);
            stream.removeListener('end', onEnd);
            stream.removeListener('error', onError);
        }
        const onData = (chunk) => {
            removeListeners();
            resolve(chunk);
        }
        stream.on('data', onData);
        const onEnd = () => {
            removeListeners();
            resolve(false);
        }
        stream.on('end', onEnd);
        const onError = (err) => {
            removeListeners();
            reject(err);
        }
        stream.on('error', onError);
      });
  };
}
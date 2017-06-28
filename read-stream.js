const EventEmitter = require('events');
const stateChangedEventName = 'stateChanged';

class StreamWrapper extends EventEmitter {
    constructor(stream) {
        super();
        this.stream = stream;
        this.error = null;
        this.ended = false;
        this.data = null;

        stream.on('data', (chunk) => {
            this.data = chunk;
            this.stream.pause();
            this.emit(stateChangedEventName);
        });
        stream.on('end', () => {
            this.ended = true;
            this.emit(stateChangedEventName);
        });
        stream.on('error', (err) => {
            this.error = err;
            this.emit(stateChangedEventName);
        });
    }

    readData() {
        if (!this.data) {
            return null;
        }
        const chunk = this.data;
        this.data = null;
        this.stream.resume();
        return chunk;
    }

    createPromise() {
        const wrapper = this;
        return new Promise((resolve, reject) => {
            const resolvePromise = () => {
                const chunk = wrapper.readData();
                if (chunk) {
                    resolve(chunk);
                    return true;
                }
                if (wrapper.error) {
                    reject(wrapper.error);
                    return true;
                } 
                if (wrapper.ended) {
                    resolve(null);
                    return true;
                }
                return false;
            }

            if (resolvePromise()) {
                return;
            }

            wrapper.once(stateChangedEventName, () => {
                resolvePromise();
            });
        });
    }
}

module.exports = (stream) => {
    const wrapper = new StreamWrapper(stream);
    return () => { return wrapper.createPromise() };
}
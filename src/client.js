import IO  from 'socket.io-client';
import url from 'url';

class Client {
    constructor(urlString) {
        urlString = urlString || 'https://api.tfl.lu/v1';
        this.host = url.resolve(urlString, '/');

        var { pathname } = url.parse(urlString);
        this.path = pathname.replace(/\/$/, '') + '/stream';

        this.subscriptions = {};
        this.io = IO(this.host, {
            path: this.path
        });
        this.io.on('data', update => {
            if (!update.path || !this.subscriptions[update.path]) {
                return;
            }
            this.subscriptions[update.path].forEach(callback => callback(update.data || {}));
        });
    }

    subscribe(path, callback) {
        if (!this.subscriptions[path]) {
            this.subscriptions[path] = [];
            this.io.emit('subscribe', path);
        }
        this.subscriptions[path].push(callback);
    }
}

export default Client;

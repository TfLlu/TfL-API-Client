import IO  from 'socket.io-client';
import url from 'url';

class Client {
    constructor(host) {
        this.host = host || 'https://api.tfl.lu/latest';
        var { pathname } = url.parse(this.host);
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

if (window) {
    window.TfLAPIClient = Client;
}

export default Client;

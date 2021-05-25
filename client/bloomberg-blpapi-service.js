/*
* This file is automatically generated. Do not modify it directly.
*/ 

const clientId = fin.desktop.getUuid();
let clientPromise;

function getClient() {
    return clientPromise || (clientPromise = (async function () {
        const cbs = {};
        const identity = {
            uuid: fin.desktop.Application.getCurrent().uuid,
            name: fin.desktop.Frame.getCurrent().name
        };

        let cc = await fin.InterApplicationBus.Channel.connect('bloomberg-blpapi-service/v1');

        cc.register('__dispatchEvent', evt => {
            let cb = cbs[evt.type];
            if (cb) {
                cb.forEach(function (c) { c(evt); });
            }
            return true;
        });

        cc.register('__getclientId', () => clientId);

        cc.register('__logMessage', (message) => {
            switch (message.type) {
                case 'warn':
                    console.warn(message.text, (message.args ?? []).length > 0 ? message.args : '');
                case 'info':
                default:
                    console.log(message.text, (message.args ?? []).length > 0 ? message.args : '');
            }
        });

        return {
            addEventListener: function (type, listener) { (cbs[type] || (cbs[type] = [])).push(listener); },
            removeEventListener: function (type, listener) { let i = cbs[type] ? cbs[type].indexOf(listener) : -1; if (i > -1) cbs[type].splice(i, 1); },
            'startSession': async function() { return cc.dispatch('startSession', { identity, clientId, args: [] }); },
            'stopSession': async function() { return cc.dispatch('stopSession', { identity, clientId, args: [] }); },
            'serviceRequest': async function(serviceName, operationName, requestObject) { return cc.dispatch('serviceRequest', { identity, clientId, args: [serviceName, operationName, requestObject] }); },
            'subscribe': async function(subscriptions) { return cc.dispatch('subscribe', { identity, clientId, args: [subscriptions] }); },
            'cancel': async function(id) { return cc.dispatch('cancel', { identity, clientId, args: [id] }); }
        };
    })());
}

export default { getClient };
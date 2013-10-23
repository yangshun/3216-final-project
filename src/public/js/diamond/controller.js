var Controller = function(controller) {
    this.callbacks = {};
    this.controller = controller;
}

Controller.prototype.registerEvent = function(target, eventName, callback) {
    var key = this.key(target, eventName);

    if (key in this.callbacks) {
        this.callbacks[key].push(callback);
    }

    else {
        this.callbacks[key] = [callback];
    }
}

Controller.prototype.triggerEvent = function(target, eventName, payload) {
    var key = this.key(target, eventName);
    var callbacks = this.callbacks[key];

    for (var i=0;i<callbacks.length;i++) {
        callbacks[i](payload);
    }
}

Controller.prototype.key = function(target, eventName) {
    return target + "_" + eventName;
}


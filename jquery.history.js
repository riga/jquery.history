/*!
 * jQuery History Plugin v0.3
 * https://github.com/riga/jquery.history
 *
 * Copyright 2013, Marcel Rieger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://www.opensource.org/licenses/mit-license
 * http://www.opensource.org/licenses/GPL-3.0
 */

var _history = {
    instance: null,
    callbacks: jQuery.Callbacks()
};

jQuery.History = function(callback, append) {

    if(callback && (callback.fire || jQuery.isFunction(callback))) {
        if(append || append === undefined) {
            _history.callbacks.add(callback.fire || callback);
        } else {
            _history.callbacks = callback.fire ? callback : jQuery.Callbacks().add(callback);
        }
    }

    if(_history.instance) {
        return _history.instance;
    }

    var self,

    _enabled = true,

    push = function(url, _state, fire) {
        if(!jQuery.isPlainObject(url)) {
            url = jQuery.extend(true, {
                url: url
            }, _state);
        }
        _state = url;
        window.history.pushState(_state, '', encodeURI(_state.url));
        if(fire) {
            _callbacks().fire(_state);
        }
        return self;
    },

    modify = function(_state, extend, fire) {
        if(extend || extend === undefined) {
            _state = jQuery.extend(true, state(), _state);
        }
        window.history.replaceState(_state);
        if(fire) {
            _callbacks().fire(_state);
        }
        return self;
    },

    forward = function() {
        window.history.forward();
        return self;
    },

    back = function() {
        window.history.back();
        return self;
    },

    go = function(position) {
        window.history.go(position);
        return self;
    },

    state = function() {
        return window.history.state;
    },

    size = function() {
        return window.history.length;
    },

    enable = function() {
        _enabled = true;
        return self;
    },

    disable = function() {
        _enabled = false;
        return self;
    },

    enabled = function() {
        return _enabled;
    },

    fired = function() {
        return _callbacks().fired();
    },

    promise = function() {
        var dfd = jQuery.Deferred();
        _callbacks().add(dfd.resolve);
        return dfd.promise();
    },

    _callbacks = function() {
        return _history.callbacks;
    },

    _handle = function(event) {
        if(!enabled() || !event || !event.originalEvent) {
            return;
        }
        _callbacks().fire(event.originalEvent.state);
    };

    // workaround
    $(window).load(function() {
        window.setTimeout(function() {
            $(window).on('popstate', _handle);
        }, 0);
    });

    self = {
        push: push,
        modify: modify,
        forward: forward,
        back: back,
        go: go,
        state: state,
        size: size,
        enable: enable,
        disable: disable,
        enabled: enabled,
        fired: fired,
        promise: promise
    };

    return _history.instance = self;
};
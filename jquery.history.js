/*!
 * jQuery History Plugin v0.2
 * https://github.com/riga/jquery.history
 *
 * Copyright 2012, Marcel Rieger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://www.opensource.org/licenses/mit-license
 * http://www.opensource.org/licenses/GPL-3.0
 */

var _history = {
	instance: null,
	callbacks: jQuery.Callbacks()
};

jQuery.History = function( callback, append ) {
	
	if ( callback && (callback.fire || jQuery.isFunction( callback )) ) {
		if ( append || append === undefined ) {
			_history.callbacks.add( callback.fire || callback );
		} else {
			_history.callbacks = callback.fire ? callback : jQuery.Callbacks().add( callback );
		}
	}
	
	if ( _history.instance ) {
		return _history.instance;
	}
	
	var self,
	
	push = function( url, _state ) {
		if ( !jQuery.isPlainObject( url ) ) {
			url = jQuery.extend( true, { url: url }, _state );
		}
		_state = url;
		window.history.pushState( _state, '', encodeURI( _state.url ) );
		_callbacks().fire( _state );
		return self;
	},
	
	modify = function( _state, extend ) {
		if ( extend || extend === undefined ) {
			_state = jQuery.extend( true, state(), _state );
		}
		window.history.replaceState( _state );
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
	
	go = function( position ) {
		window.history.go( position );
		return self;
	},
	
	state = function() {
		return window.history.state;
	},
	
	size = function() {
		return window.history.length;
	},
	
	_callbacks = function() {
		return _history.callbacks;
	},
	
	_handle = function( event ) {
		if ( !event || !event.originalEvent || !event.originalEvent.state ) {
			return;
		}
		_callbacks().fire( event.originalEvent.state );
	};
	
	$(window).on( "popstate", _handle );
	
	self = {
		push: push,
		modify: modify,
		forward: forward,
		back: back,
		go: go,
		state: state,
		size: size
	};
	
	return _history.instance = self;
};
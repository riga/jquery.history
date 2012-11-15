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

jQuery.History = function( /*Function|jQuery.Callbacks*/ callback, /*Boolean*/ append ) {
	
	if ( callback && (callback.fire || jQuery.isFunction( callback )) ) {
		append = append === undefined ? true : append;
		if ( append ) {
			_history.callbacks.add( callback.fire || callback );
		} else {
			_history.callbacks = callback.fire ? callback : jQuery.Callbacks().add( callback );
		}
	}
	
	if ( _history.instance ) {
		return _history.instance;
	}
	
	var self,
	
	push = function( /*String*/ url, /*Object*/ _state ) {
		if ( !jQuery.isPlainObject( url ) ) {
			url = jQuery.extend( true, { url: url }, _state );
		}
		_state = url;
		window.history.pushState( _state, '', encodeURI( _state.url ) );
		callbacks().fire( _state );
		return self;
	},
	
	modify = function( /*Object*/ _state, /*Boolean*/ extend ) {
		if ( extend === undefined || extend ) {
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
	
	go = function( /*Integer*/ position ) {
		window.history.go( position );
		return self;
	},
	
	state = function() {
		return window.history.state;
	},
	
	size = function() {
		return window.history.length;
	},
	
	callbacks = function() {
		return _history.callbacks;
	};
	
	self = {
		push: push,
		modify: modify,
		forward: forward,
		back: back,
		go: go,
		state: state,
		size: size,
		callbacks: callbacks
	};
	
	var handle = function( event ) {
		if ( !event || !event.originalEvent || !event.originalEvent.state ) {
			return;
		}
		callbacks().fire( event.originalEvent.state );
	};
	
	$(window).on( "popstate", handle );
	
	return _history.instance = self;
};
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
	
	if ( callback ) {
		append = append === undefined ? true : append;
		callback = callback || function(){};
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
	
	push = function( /*String*/ url, /*Object*/ _data ) {
		if ( !jQuery.isPlainObject( url ) ) {
			url = jQuery.extend( true, { url: url }, _data );
		}
		_data = url;
		window.history.pushState( _data, '', encodeURI( _data.url ) );
		callbacks().fire( _data );
		return self;
	},
	
	modify = function( /*Object*/ _data, /*Boolean*/ extend ) {
		if ( extend === undefined || extend ) {
			_data = jQuery.extend( true, data(), _data );
		}
		window.history.replaceState( _data );
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
	
	data = function() {
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
		data: data,
		size: size,
		callbacks: callbacks
	};
	
	var handle = function( event ) {
		if ( !event || !event.originalEvent || !event.originalEvent.state ) {
			return;
		}
		callbacks().fire( event.originalEvent.state );
	};
	
	$(window).bind( "popstate", handle );
	
	return _history.instance = self;
};
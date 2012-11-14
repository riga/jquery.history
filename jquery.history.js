/*!
 * jQuery History Plugin v0.1
 * https://github.com/riga/jquery.history
 *
 * Copyright 2012, Marcel Rieger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://www.opensource.org/licenses/mit-license
 * http://www.opensource.org/licenses/GPL-3.0
 */

var _history = {
	instance: null,
	data: {}
};

jQuery.History = function() {
	
	if ( _history.instance ) {
		return _history.instance;
	}
	
	var self,
	
	push = function( /*String*/ url, /*jQuery.Callbacks*/ callbacks, /*Object*/ _data ) {
		if ( !jQuery.isPlainObject( url ) ) {
			var defaultData = {
				url: url || '',
				callbacks: (callbacks && callbacks.fire) ? callbacks : jQuery.Callbacks().add( callbacks )
			};
			_data = jQuery.extend( true, defaultData, _data );
		}
		var key = size();
		window.history.pushState( key, '', encodeURI( _data.url ) );
		_history.data[ key ] = _data;
		_data.callbacks.fire( _data );
		return self;
	},
	
	modify = function( /*Object*/ _data ) {
		jQuery.extend( true, data(), _data );
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
		var key = window.history.state;
		return _history.data[ key ];
	},
	
	size = function() {
		return window.history.length;
	};
	
	self = {
		push: push,
		modify: modify,
		forward: forward,
		back: back,
		go: go,
		data: data,
		size: size
	};
	
	var handle = function( event ) {
		if ( !event || !event.originalEvent || !event.originalEvent.state ) {
			return;
		}
		var key = event.originalEvent.state;
		var _data = _history.data[ key ];
		if ( _data && _data.callbacks && _data.callbacks.fire ) {
			_data.callbacks.fire( _data );
		}
	};
	
	$(window).bind( "popstate", handle );
	
	return _history.instance = self;
};
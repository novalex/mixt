/*!
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery throttle / debounce: Sometimes, less is more!
//
// *Version: 1.1, Last updated: 3/7/2010*
// 
// Project Home - http://benalman.com/projects/jquery-throttle-debounce-plugin/
// GitHub       - http://github.com/cowboy/jquery-throttle-debounce/
// Source       - http://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.js
// (Minified)   - http://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.min.js (0.7kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// Throttle - http://benalman.com/code/projects/jquery-throttle-debounce/examples/throttle/
// Debounce - http://benalman.com/code/projects/jquery-throttle-debounce/examples/debounce/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - none, 1.3.2, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome 4-5, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-throttle-debounce/unit/
// 
// About: Release History
// 
// 1.1 - (3/7/2010) Fixed a bug in <jQuery.throttle> where trailing callbacks
//       executed later than they should. Reworked a fair amount of internal
//       logic as well.
// 1.0 - (3/6/2010) Initial release as a stand-alone project. Migrated over
//       from jquery-misc repo v0.4 to jquery-throttle repo v1.0, added the
//       no_trailing throttle parameter and debounce functionality.
// 
// Topic: Note for non-jQuery users
// 
// jQuery isn't actually required for this plugin, because nothing internal
// uses any jQuery methods or properties. jQuery is just used as a namespace
// under which these methods can exist.
// 
// Since jQuery isn't actually required for this plugin, if jQuery doesn't exist
// when this plugin is loaded, the method described below will be created in
// the `Cowboy` namespace. Usage will be exactly the same, but instead of
// $.method() or jQuery.method(), you'll need to use Cowboy.method().

(function(window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Since jQuery really isn't required for this plugin, use `jQuery` as the
  // namespace only if it already exists, otherwise use the `Cowboy` namespace,
  // creating it if necessary.
  var $ = window.jQuery || window.Cowboy || ( window.Cowboy = {} ),
    
    // Internal method reference.
    jq_throttle;
  
  // Method: jQuery.throttle
  // 
  // Throttle execution of a function. Especially useful for rate limiting
  // execution of handlers on events like resize and scroll. If you want to
  // rate-limit execution of a function to a single time, see the
  // <jQuery.debounce> method.
  // 
  // In this visualization, | is a throttled-function call and X is the actual
  // callback execution:
  // 
  // > Throttled with `no_trailing` specified as false or unspecified:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // > X    X    X    X    X    X        X    X    X    X    X    X
  // > 
  // > Throttled with `no_trailing` specified as true:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // > X    X    X    X    X             X    X    X    X    X
  // 
  // Usage:
  // 
  // > var throttled = jQuery.throttle( delay, [ no_trailing, ] callback );
  // > 
  // > jQuery('selector').bind( 'someevent', throttled );
  // > jQuery('selector').unbind( 'someevent', throttled );
  // 
  // This also works in jQuery 1.4+:
  // 
  // > jQuery('selector').bind( 'someevent', jQuery.throttle( delay, [ no_trailing, ] callback ) );
  // > jQuery('selector').unbind( 'someevent', callback );
  // 
  // Arguments:
  // 
  //  delay - (Number) A zero-or-greater delay in milliseconds. For event
  //    callbacks, values around 100 or 250 (or even higher) are most useful.
  //  no_trailing - (Boolean) Optional, defaults to false. If no_trailing is
  //    true, callback will only execute every `delay` milliseconds while the
  //    throttled-function is being called. If no_trailing is false or
  //    unspecified, callback will be executed one final time after the last
  //    throttled-function call. (After the throttled-function has not been
  //    called for `delay` milliseconds, the internal counter is reset)
  //  callback - (Function) A function to be executed after delay milliseconds.
  //    The `this` context and all arguments are passed through, as-is, to
  //    `callback` when the throttled-function is executed.
  // 
  // Returns:
  // 
  //  (Function) A new, throttled, function.
  
  $.throttle = jq_throttle = function( delay, no_trailing, callback, debounce_mode ) {
    // After wrapper has stopped being called, this timeout ensures that
    // `callback` is executed at the proper times in `throttle` and `end`
    // debounce modes.
    var timeout_id,
      
      // Keep track of the last time `callback` was executed.
      last_exec = 0;
    
    // `no_trailing` defaults to falsy.
    if ( typeof no_trailing !== 'boolean' ) {
      debounce_mode = callback;
      callback = no_trailing;
      no_trailing = undefined;
    }
    
    // The `wrapper` function encapsulates all of the throttling / debouncing
    // functionality and when executed will limit the rate at which `callback`
    // is executed.
    function wrapper() {
      var that = this,
        elapsed = +new Date() - last_exec,
        args = arguments;
      
      // Execute `callback` and update the `last_exec` timestamp.
      function exec() {
        last_exec = +new Date();
        callback.apply( that, args );
      };
      
      // If `debounce_mode` is true (at_begin) this is used to clear the flag
      // to allow future `callback` executions.
      function clear() {
        timeout_id = undefined;
      };
      
      if ( debounce_mode && !timeout_id ) {
        // Since `wrapper` is being called for the first time and
        // `debounce_mode` is true (at_begin), execute `callback`.
        exec();
      }
      
      // Clear any existing timeout.
      timeout_id && clearTimeout( timeout_id );
      
      if ( debounce_mode === undefined && elapsed > delay ) {
        // In throttle mode, if `delay` time has been exceeded, execute
        // `callback`.
        exec();
        
      } else if ( no_trailing !== true ) {
        // In trailing throttle mode, since `delay` time has not been
        // exceeded, schedule `callback` to execute `delay` ms after most
        // recent execution.
        // 
        // If `debounce_mode` is true (at_begin), schedule `clear` to execute
        // after `delay` ms.
        // 
        // If `debounce_mode` is false (at end), schedule `callback` to
        // execute after `delay` ms.
        timeout_id = setTimeout( debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay );
      }
    };
    
    // Set the guid of `wrapper` function to the same of original callback, so
    // it can be removed in jQuery 1.4+ .unbind or .die by using the original
    // callback as a reference.
    if ( $.guid ) {
      wrapper.guid = callback.guid = callback.guid || $.guid++;
    }
    
    // Return the wrapper function.
    return wrapper;
  };
  
  // Method: jQuery.debounce
  // 
  // Debounce execution of a function. Debouncing, unlike throttling,
  // guarantees that a function is only executed a single time, either at the
  // very beginning of a series of calls, or at the very end. If you want to
  // simply rate-limit execution of a function, see the <jQuery.throttle>
  // method.
  // 
  // In this visualization, | is a debounced-function call and X is the actual
  // callback execution:
  // 
  // > Debounced with `at_begin` specified as false or unspecified:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // >                          X                                 X
  // > 
  // > Debounced with `at_begin` specified as true:
  // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
  // > X                                 X
  // 
  // Usage:
  // 
  // > var debounced = jQuery.debounce( delay, [ at_begin, ] callback );
  // > 
  // > jQuery('selector').bind( 'someevent', debounced );
  // > jQuery('selector').unbind( 'someevent', debounced );
  // 
  // This also works in jQuery 1.4+:
  // 
  // > jQuery('selector').bind( 'someevent', jQuery.debounce( delay, [ at_begin, ] callback ) );
  // > jQuery('selector').unbind( 'someevent', callback );
  // 
  // Arguments:
  // 
  //  delay - (Number) A zero-or-greater delay in milliseconds. For event
  //    callbacks, values around 100 or 250 (or even higher) are most useful.
  //  at_begin - (Boolean) Optional, defaults to false. If at_begin is false or
  //    unspecified, callback will only be executed `delay` milliseconds after
  //    the last debounced-function call. If at_begin is true, callback will be
  //    executed only at the first debounced-function call. (After the
  //    throttled-function has not been called for `delay` milliseconds, the
  //    internal counter is reset)
  //  callback - (Function) A function to be executed after delay milliseconds.
  //    The `this` context and all arguments are passed through, as-is, to
  //    `callback` when the debounced-function is executed.
  // 
  // Returns:
  // 
  //  (Function) A new, debounced, function.
  
  $.debounce = function( delay, at_begin, callback ) {
    return callback === undefined
      ? jq_throttle( delay, at_begin, false )
      : jq_throttle( delay, callback, at_begin !== false );
  };
  
})(this);

/**
 * Featherlight - ultra slim jQuery lightbox
 * Version 1.3.4 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2015, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";

	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('Too much lightness, Featherlight needs jQuery.'); }
		return;
	}

	/* Featherlight is exported as $.featherlight.
	   It is a function used to open a featherlight lightbox.

	   [tech]
	   Featherlight uses prototype inheritance.
	   Each opened lightbox will have a corresponding object.
	   That object may have some attributes that override the
	   prototype's.
	   Extensions created with Featherlight.extend will have their
	   own prototype that inherits from Featherlight's prototype,
	   thus attributes can be overriden either at the object level,
	   or at the extension level.
	   To create callbacks that chain themselves instead of overriding,
	   use chainCallbacks.
	   For those familiar with CoffeeScript, this correspond to
	   Featherlight being a class and the Gallery being a class
	   extending Featherlight.
	   The chainCallbacks is used since we don't have access to
	   CoffeeScript's `super`.
	*/

	function Featherlight($content, config) {
		if(this instanceof Featherlight) {  /* called with new */
			this.id = Featherlight.id++;
			this.setup($content, config);
			this.chainCallbacks(Featherlight._callbackChain);
		} else {
			var fl = new Featherlight($content, config);
			fl.open();
			return fl;
		}
	}

	var opened = [],
		pruneOpened = function(remove) {
			opened = $.grep(opened, function(fl) {
				return fl !== remove && fl.$instance.closest('body').length > 0;
			} );
			return opened;
		};

	// structure({iframeMinHeight: 44, foo: 0}, 'iframe')
	//   #=> {min-height: 44}
	var structure = function(obj, prefix) {
		var result = {},
			regex = new RegExp('^' + prefix + '([A-Z])(.*)');
		for (var key in obj) {
			var match = key.match(regex);
			if (match) {
				var dasherized = (match[1] + match[2].replace(/([A-Z])/g, '-$1')).toLowerCase();
				result[dasherized] = obj[key];
			}
		}
		return result;
	};

	/* document wide key handler */
	var eventMap = { keyup: 'onKeyUp', resize: 'onResize' };

	var globalEventHandler = function(event) {
		$.each(Featherlight.opened().reverse(), function() {
			if (!event.isDefaultPrevented()) {
				if (false === this[eventMap[event.type]](event)) {
					event.preventDefault(); event.stopPropagation(); return false;
			  }
			}
		});
	};

	var toggleGlobalEvents = function(set) {
			if(set !== Featherlight._globalHandlerInstalled) {
				Featherlight._globalHandlerInstalled = set;
				var events = $.map(eventMap, function(_, name) { return name+'.'+Featherlight.prototype.namespace; } ).join(' ');
				$(window)[set ? 'on' : 'off'](events, globalEventHandler);
			}
		};

	Featherlight.prototype = {
		constructor: Featherlight,
		/*** defaults ***/
		/* extend featherlight with defaults and methods */
		namespace:    'featherlight',         /* Name of the events and css class prefix */
		targetAttr:   'data-featherlight',    /* Attribute of the triggered element that contains the selector to the lightbox content */
		variant:      null,                   /* Class that will be added to change look of the lightbox */
		resetCss:     false,                  /* Reset all css */
		background:   null,                   /* Custom DOM for the background, wrapper and the closebutton */
		openTrigger:  'click',                /* Event that triggers the lightbox */
		closeTrigger: 'click',                /* Event that triggers the closing of the lightbox */
		filter:       null,                   /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
		root:         'body',                 /* Where to append featherlights */
		openSpeed:    250,                    /* Duration of opening animation */
		closeSpeed:   250,                    /* Duration of closing animation */
		closeOnClick: 'background',           /* Close lightbox on click ('background', 'anywhere' or false) */
		closeOnEsc:   true,                   /* Close lightbox when pressing esc */
		closeIcon:    '&#10005;',             /* Close icon */
		loading:      '',                     /* Content to show while initial content is loading */
		persist:      false,									/* If set, the content persist and will be shown again when opened again. 'shared' is a special value when binding multiple elements for them to share the same content */
		otherClose:   null,                   /* Selector for alternate close buttons (e.g. "a.close") */
		beforeOpen:   $.noop,                 /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		beforeContent: $.noop,                /* Called when content is loaded. Gets event as parameter, this contains all data */
		beforeClose:  $.noop,                 /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		afterOpen:    $.noop,                 /* Called after open. Gets event as parameter, this contains all data */
		afterContent: $.noop,                 /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
		afterClose:   $.noop,                 /* Called after close. Gets event as parameter, this contains all data */
		onKeyUp:      $.noop,                 /* Called on key down for the frontmost featherlight */
		onResize:     $.noop,                 /* Called after new content and when a window is resized */
		type:         null,                   /* Specify type of lightbox. If unset, it will check for the targetAttrs value. */
		contentFilters: ['jquery', 'image', 'html', 'ajax', 'iframe', 'text'], /* List of content filters to use to determine the content */

		/*** methods ***/
		/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
		setup: function(target, config){
			/* all arguments are optional */
			if (typeof target === 'object' && target instanceof $ === false && !config) {
				config = target;
				target = undefined;
			}

			var self = $.extend(this, config, {target: target}),
				css = !self.resetCss ? self.namespace : self.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
				$background = $(self.background || [
					'<div class="'+css+'-loading '+css+'">',
						'<div class="'+css+'-content">',
							'<span class="'+css+'-close-icon '+ self.namespace + '-close">',
								self.closeIcon,
							'</span>',
							'<div class="'+self.namespace+'-inner">' + self.loading + '</div>',
						'</div>',
					'</div>'].join('')),
				closeButtonSelector = '.'+self.namespace+'-close' + (self.otherClose ? ',' + self.otherClose : '');

			self.$instance = $background.clone().addClass(self.variant); /* clone DOM for the background, wrapper and the close button */

			/* close when click on background/anywhere/null or closebox */
			self.$instance.on(self.closeTrigger+'.'+self.namespace, function(event) {
				var $target = $(event.target);
				if( ('background' === self.closeOnClick  && $target.is('.'+self.namespace))
					|| 'anywhere' === self.closeOnClick
					|| $target.closest(closeButtonSelector).length ){
					event.preventDefault();
					self.close();
				}
			});

			return this;
		},

		/* this method prepares the content and converts it into a jQuery object or a promise */
		getContent: function(){
			if(this.persist !== false && this.$content) {
				return this.$content;
			}
			var self = this,
				filters = this.constructor.contentFilters,
				readTargetAttr = function(name){ return self.$currentTarget && self.$currentTarget.attr(name); },
				targetValue = readTargetAttr(self.targetAttr),
				data = self.target || targetValue || '';

			/* Find which filter applies */
			var filter = filters[self.type]; /* check explicit type like {type: 'image'} */

			/* check explicit type like data-featherlight="image" */
			if(!filter && data in filters) {
				filter = filters[data];
				data = self.target && targetValue;
			}
			data = data || readTargetAttr('href') || '';

			/* check explicity type & content like {image: 'photo.jpg'} */
			if(!filter) {
				for(var filterName in filters) {
					if(self[filterName]) {
						filter = filters[filterName];
						data = self[filterName];
					}
				}
			}

			/* otherwise it's implicit, run checks */
			if(!filter) {
				var target = data;
				data = null;
				$.each(self.contentFilters, function() {
					filter = filters[this];
					if(filter.test)  {
						data = filter.test(target);
					}
					if(!data && filter.regex && target.match && target.match(filter.regex)) {
						data = target;
					}
					return !data;
				});
				if(!data) {
					if('console' in window){ window.console.error('Featherlight: no content filter found ' + (target ? ' for "' + target + '"' : ' (no target specified)')); }
					return false;
				}
			}
			/* Process it */
			return filter.process.call(self, data);
		},

		/* sets the content of $instance to $content */
		setContent: function($content){
			var self = this;
			/* we need a special class for the iframe */
			if($content.is('iframe') || $('iframe', $content).length > 0){
				self.$instance.addClass(self.namespace+'-iframe');
			}

			self.$instance.removeClass(self.namespace+'-loading');

			/* replace content by appending to existing one before it is removed
			   this insures that featherlight-inner remain at the same relative
				 position to any other items added to featherlight-content */
			self.$instance.find('.'+self.namespace+'-inner')
				.not($content)                /* excluded new content, important if persisted */
				.slice(1).remove().end()			/* In the unexpected event where there are many inner elements, remove all but the first one */
				.replaceWith($.contains(self.$instance[0], $content[0]) ? '' : $content);

			self.$content = $content.addClass(self.namespace+'-inner');

			return self;
		},

		/* opens the lightbox. "this" contains $instance with the lightbox, and with the config.
			Returns a promise that is resolved after is successfully opened. */
		open: function(event){
			var self = this;
			self.$instance.hide().appendTo(self.root);
			if((!event || !event.isDefaultPrevented())
				&& self.beforeOpen(event) !== false) {

				if(event){
					event.preventDefault();
				}
				var $content = self.getContent();

				if($content) {
					opened.push(self);

					toggleGlobalEvents(true);

					self.$instance.fadeIn(self.openSpeed);
					self.beforeContent(event);

					/* Set content and show */
					return $.when($content)
						.always(function($content){
							self.setContent($content);
							self.afterContent(event);
						})
						.then(self.$instance.promise())
						/* Call afterOpen after fadeIn is done */
						.done(function(){ self.afterOpen(event); });
				}
			}
			self.$instance.detach();
			return $.Deferred().reject().promise();
		},

		/* closes the lightbox. "this" contains $instance with the lightbox, and with the config
			returns a promise, resolved after the lightbox is successfully closed. */
		close: function(event){
			var self = this,
				deferred = $.Deferred();

			if(self.beforeClose(event) === false) {
				deferred.reject();
			} else {

				if (0 === pruneOpened(self).length) {
					toggleGlobalEvents(false);
				}

				self.$instance.fadeOut(self.closeSpeed,function(){
					self.$instance.detach();
					self.afterClose(event);
					deferred.resolve();
				});
			}
			return deferred.promise();
		},

		/* Utility function to chain callbacks
		   [Warning: guru-level]
		   Used be extensions that want to let users specify callbacks but
		   also need themselves to use the callbacks.
		   The argument 'chain' has callback names as keys and function(super, event)
		   as values. That function is meant to call `super` at some point.
		*/
		chainCallbacks: function(chain) {
			for (var name in chain) {
				this[name] = $.proxy(chain[name], this, $.proxy(this[name], this));
			}
		}
	};

	$.extend(Featherlight, {
		id: 0,                                    /* Used to id single featherlight instances */
		autoBind:       '[data-featherlight]',    /* Will automatically bind elements matching this selector. Clear or set before onReady */
		defaults:       Featherlight.prototype,   /* You can access and override all defaults using $.featherlight.defaults, which is just a synonym for $.featherlight.prototype */
		/* Contains the logic to determine content */
		contentFilters: {
			jquery: {
				regex: /^[#.]\w/,         /* Anything that starts with a class name or identifiers */
				test: function(elem)    { return elem instanceof $ && elem; },
				process: function(elem) { return this.persist !== false ? $(elem) : $(elem).clone(true); }
			},
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,
				process: function(url)  {
					var self = this,
						deferred = $.Deferred(),
						img = new Image(),
						$img = $('<img src="'+url+'" alt="" class="'+self.namespace+'-image" />');
					img.onload  = function() {
						/* Store naturalWidth & height for IE8 */
						$img.naturalWidth = img.width; $img.naturalHeight = img.height;
						deferred.resolve( $img );
					};
					img.onerror = function() { deferred.reject($img); };
					img.src = url;
					return deferred.promise();
				}
			},
			html: {
				regex: /^\s*<[\w!][^<]*>/, /* Anything that starts with some kind of valid tag */
				process: function(html) { return $(html); }
			},
			ajax: {
				regex: /./,            /* At this point, any content is assumed to be an URL */
				process: function(url)  {
					var self = this,
						deferred = $.Deferred();
					/* we are using load so one can specify a target with: url.html #targetelement */
					var $container = $('<div></div>').load(url, function(response, status){
						if ( status !== "error" ) {
							deferred.resolve($container.contents());
						}
						deferred.fail();
					});
					return deferred.promise();
				}
			},
			iframe: {
				process: function(url) {
					var deferred = new $.Deferred();
					var $content = $('<iframe/>')
						.hide()
						.attr('src', url)
						.css(structure(this, 'iframe'))
						.on('load', function() { deferred.resolve($content.show()); })
						// We can't move an <iframe> and avoid reloading it,
						// so let's put it in place ourselves right now:
						.appendTo(this.$instance.find('.' + this.namespace + '-content'));
					return deferred.promise();
				}
			},
			text: {
				process: function(text) { return $('<div>', {text: text}); }
			}
		},

		functionAttributes: ['beforeOpen', 'afterOpen', 'beforeContent', 'afterContent', 'beforeClose', 'afterClose'],

		/*** class methods ***/
		/* read element's attributes starting with data-featherlight- */
		readElementConfig: function(element, namespace) {
			var Klass = this,
				regexp = new RegExp('^data-' + namespace + '-(.*)'),
				config = {};
			if (element && element.attributes) {
				$.each(element.attributes, function(){
					var match = this.name.match(regexp);
					if (match) {
						var val = this.value,
							name = $.camelCase(match[1]);
						if ($.inArray(name, Klass.functionAttributes) >= 0) {  /* jshint -W054 */
							val = new Function(val);                           /* jshint +W054 */
						} else {
							try { val = $.parseJSON(val); }
							catch(e) {}
						}
						config[name] = val;
					}
				});
			}
			return config;
		},

		/* Used to create a Featherlight extension
		   [Warning: guru-level]
		   Creates the extension's prototype that in turn
		   inherits Featherlight's prototype.
		   Could be used to extend an extension too...
		   This is pretty high level wizardy, it comes pretty much straight
		   from CoffeeScript and won't teach you anything about Featherlight
		   as it's not really specific to this library.
		   My suggestion: move along and keep your sanity.
		*/
		extend: function(child, defaults) {
			/* Setup class hierarchy, adapted from CoffeeScript */
			var Ctor = function(){ this.constructor = child; };
			Ctor.prototype = this.prototype;
			child.prototype = new Ctor();
			child.__super__ = this.prototype;
			/* Copy class methods & attributes */
			$.extend(child, this, defaults);
			child.defaults = child.prototype;
			return child;
		},

		attach: function($source, $content, config) {
			var Klass = this;
			if (typeof $content === 'object' && $content instanceof $ === false && !config) {
				config = $content;
				$content = undefined;
			}
			/* make a copy */
			config = $.extend({}, config);

			/* Only for openTrigger and namespace... */
			var namespace = config.namespace || Klass.defaults.namespace,
				tempConfig = $.extend({}, Klass.defaults, Klass.readElementConfig($source[0], namespace), config),
				sharedPersist;

			$source.on(tempConfig.openTrigger+'.'+tempConfig.namespace, tempConfig.filter, function(event) {
				/* ... since we might as well compute the config on the actual target */
				var elemConfig = $.extend(
					{$source: $source, $currentTarget: $(this)},
					Klass.readElementConfig($source[0], tempConfig.namespace),
					Klass.readElementConfig(this, tempConfig.namespace),
					config);
				var fl = sharedPersist || $(this).data('featherlight-persisted') || new Klass($content, elemConfig);
				if(fl.persist === 'shared') {
					sharedPersist = fl;
				} else if(fl.persist !== false) {
					$(this).data('featherlight-persisted', fl);
				}
				elemConfig.$currentTarget.blur(); // Otherwise 'enter' key might trigger the dialog again
				fl.open(event);
			});
			return $source;
		},

		current: function() {
			var all = this.opened();
			return all[all.length - 1] || null;
		},

		opened: function() {
			var klass = this;
			pruneOpened();
			return $.grep(opened, function(fl) { return fl instanceof klass; } );
		},

		close: function() {
			var cur = this.current();
			if(cur) { return cur.close(); }
		},

		/* Does the auto binding on startup.
		   Meant only to be used by Featherlight and its extensions
		*/
		_onReady: function() {
			var Klass = this;
			if(Klass.autoBind){
				/* Bind existing elements */
				$(Klass.autoBind).each(function(){
					Klass.attach($(this));
				});
				/* If a click propagates to the document level, then we have an item that was added later on */
				$(document).on('click', Klass.autoBind, function(evt) {
					if (evt.isDefaultPrevented()) {
						return;
					}
					evt.preventDefault();
					/* Bind featherlight */
					Klass.attach($(evt.currentTarget));
					/* Click again; this time our binding will catch it */
					$(evt.target).click();
				});
			}
		},

		/* Featherlight uses the onKeyUp callback to intercept the escape key.
		   Private to Featherlight.
		*/
		_callbackChain: {
			onKeyUp: function(_super, event){
				if(27 === event.keyCode) {
					if (this.closeOnEsc) {
						this.$instance.find('.'+this.namespace+'-close:first').click();
					}
					return false;
				} else {
					return _super(event);
				}
			},

			onResize: function(_super, event){
				if (this.$content.naturalWidth) {
					var w = this.$content.naturalWidth, h = this.$content.naturalHeight;
					/* Reset apparent image size first so container grows */
					this.$content.css('width', '').css('height', '');
					/* Calculate the worst ratio so that dimensions fit */
					var ratio = Math.max(
						w  / parseInt(this.$content.parent().css('width'),10),
						h / parseInt(this.$content.parent().css('height'),10));
					/* Resize content */
					if (ratio > 1) {
						this.$content.css('width', '' + w / ratio + 'px').css('height', '' + h / ratio + 'px');
					}
				}
				return _super(event);
			},

			afterContent: function(_super, event){
				var r = _super(event);
				this.onResize(event);
				return r;
			}
		}
	});

	$.featherlight = Featherlight;

	/* bind jQuery elements to trigger featherlight */
	$.fn.featherlight = function($content, config) {
		return Featherlight.attach(this, $content, config);
	};

	/* bind featherlight on ready if config autoBind is set */
	$(document).ready(function(){ Featherlight._onReady(); });
}(jQuery));

/*!
 * hoverIntent v1.8.1 // 2014.08.11 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
 
/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 6,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = true;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = false;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = $.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type === "mouseenter"
            if (e.type === "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);

/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});
/*!
 * jQuery Placeholder Plugin v2.1.3
 * https://github.com/mathiasbynens/jquery-placeholder
 *
 * Copyright 2011, 2015 Mathias Bynens
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) === '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;
    var settings = {};

    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function() {
            return this;
        };

        placeholder.input = true;
        placeholder.textarea = true;

    } else {

        placeholder = $.fn.placeholder = function(options) {

            var defaults = {customClass: 'placeholder'};
            settings = $.extend({}, defaults, options);

            return this.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.'+settings.customClass)
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {

                var $element = $(element);
                var $passwordInput = $element.data('placeholder-password');

                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            'set': function(element, value) {

                var $element = $(element);
                var $replacement;
                var $passwordInput;

                if (value !== '') {

                    $replacement = $element.data('placeholder-textinput');
                    $passwordInput = $element.data('placeholder-password');

                    if ($replacement) {
                        clearPlaceholder.call($replacement[0], true, value) || (element.value = value);
                        $replacement[0].value = value;

                    } else if ($passwordInput) {
                        clearPlaceholder.call(element, true, value) || ($passwordInput[0].value = value);
                        element.value = value;
                    }
                }

                if (!$element.data('placeholder-enabled')) {
                    element.value = value;
                    return $element;
                }

                if (value === '') {
                    
                    element.value = value;
                    
                    // Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }

                } else {
                    
                    if ($element.hasClass(settings.customClass)) {
                        clearPlaceholder.call(element);
                    }

                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }

        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.'+settings.customClass, this).each(function() {
                    clearPlaceholder.call(this, true, '');
                });

                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.'+settings.customClass).each(function() {
                this.value = '';
            });
        });
    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;

        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });

        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        
        var input = this;
        var $input = $(input);
        
        if (input.value === $input.attr('placeholder') && $input.hasClass(settings.customClass)) {
            
            input.value = '';
            $input.removeClass(settings.customClass);

            if ($input.data('placeholder-password')) {

                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    $input[0].value = value;

                    return value;
                }

                $input.focus();

            } else {
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder(event) {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = input.id;

        // If the placeholder is activated, triggering blur event (`$input.trigger('blur')`) should do nothing.
        if (event && event.type === 'blur') {
            
            if ($input.hasClass(settings.customClass)) {
                return;
            }

            if (input.type === 'password') {
                $replacement = $input.prevAll('input[type="text"]:first');
                if ($replacement.length > 0 && $replacement.is(':visible')) {
                    return;
                }
            }
        }

        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {
                    
                    try {
                        $replacement = $input.clone().prop({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }

                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-enabled': true,
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);

                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }

                input.value = '';
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', $input.data('placeholder-id')).show();

            } else {
                
                var $passwordInput = $input.data('placeholder-password');

                if ($passwordInput) {
                    $passwordInput[0].value = '';
                    $input.attr('id', $input.data('placeholder-id')).show().nextAll('input[type="password"]:last').hide().removeAttr('id');
                }
            }

            $input.addClass(settings.customClass);
            $input[0].value = $input.attr('placeholder');

        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        try {
            return document.activeElement;
        } catch (exception) {}
    }
}));

/**
* jquery.matchHeight.js master
* http://brm.io/jquery-match-height/
* License: MIT
*/

;(function($) {
    /*
    *  internal
    */

    var _previousResizeWidth = -1,
        _updateTimeout = -1;

    /*
    *  _parse
    *  value parse utility function
    */

    var _parse = function(value) {
        // parse value and convert NaN to 0
        return parseFloat(value) || 0;
    };

    /*
    *  _rows
    *  utility function returns array of jQuery selections representing each row
    *  (as displayed after float wrapping applied by browser)
    */

    var _rows = function(elements) {
        var tolerance = 1,
            $elements = $(elements),
            lastTop = null,
            rows = [];

        // group elements by their top position
        $elements.each(function(){
            var $that = $(this),
                top = $that.offset().top - _parse($that.css('margin-top')),
                lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

            if (lastRow === null) {
                // first item on the row, so just push it
                rows.push($that);
            } else {
                // if the row top is the same, add to the row group
                if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
                    rows[rows.length - 1] = lastRow.add($that);
                } else {
                    // otherwise start a new row group
                    rows.push($that);
                }
            }

            // keep track of the last row top
            lastTop = top;
        });

        return rows;
    };

    /*
    *  _parseOptions
    *  handle plugin options
    */

    var _parseOptions = function(options) {
        var opts = {
            byRow: true,
            property: 'height',
            target: null,
            remove: false
        };

        if (typeof options === 'object') {
            return $.extend(opts, options);
        }

        if (typeof options === 'boolean') {
            opts.byRow = options;
        } else if (options === 'remove') {
            opts.remove = true;
        }

        return opts;
    };

    /*
    *  matchHeight
    *  plugin definition
    */

    var matchHeight = $.fn.matchHeight = function(options) {
        var opts = _parseOptions(options);

        // handle remove
        if (opts.remove) {
            var that = this;

            // remove fixed height from all selected elements
            this.css(opts.property, '');

            // remove selected elements from all groups
            $.each(matchHeight._groups, function(key, group) {
                group.elements = group.elements.not(that);
            });

            // TODO: cleanup empty groups

            return this;
        }

        if (this.length <= 1 && !opts.target) {
            return this;
        }

        // keep track of this group so we can re-apply later on load and resize events
        matchHeight._groups.push({
            elements: this,
            options: opts
        });

        // match each element's height to the tallest element in the selection
        matchHeight._apply(this, opts);

        return this;
    };

    /*
    *  plugin global options
    */

    matchHeight._groups = [];
    matchHeight._throttle = 80;
    matchHeight._maintainScroll = false;
    matchHeight._beforeUpdate = null;
    matchHeight._afterUpdate = null;

    /*
    *  matchHeight._apply
    *  apply matchHeight to given elements
    */

    matchHeight._apply = function(elements, options) {
        var opts = _parseOptions(options),
            $elements = $(elements),
            rows = [$elements];

        // take note of scroll position
        var scrollTop = $(window).scrollTop(),
            htmlHeight = $('html').outerHeight(true);

        // get hidden parents
        var $hiddenParents = $elements.parents().filter(':hidden');

        // cache the original inline style
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.data('style-cache', $that.attr('style'));
        });

        // temporarily must force hidden parents visible
        $hiddenParents.css('display', 'block');

        // get rows if using byRow, otherwise assume one row
        if (opts.byRow && !opts.target) {

            // must first force an arbitrary equal height so floating elements break evenly
            $elements.each(function() {
                var $that = $(this),
                    display = $that.css('display');

                // temporarily force a usable display value
                if (display !== 'inline-block' && display !== 'inline-flex') {
                    display = 'block';
                }

                // cache the original inline style
                $that.data('style-cache', $that.attr('style'));

                $that.css({
                    'display': display,
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0',
                    'border-top-width': '0',
                    'border-bottom-width': '0',
                    'height': '100px'
                });
            });

            // get the array of rows (based on element top position)
            rows = _rows($elements);

            // revert original inline styles
            $elements.each(function() {
                var $that = $(this);
                $that.attr('style', $that.data('style-cache') || '');
            });
        }

        $.each(rows, function(key, row) {
            var $row = $(row),
                targetHeight = 0;

            if (!opts.target) {
                // skip apply to rows with only one item
                if (opts.byRow && $row.length <= 1) {
                    $row.css(opts.property, '');
                    return;
                }

                // iterate the row and find the max height
                $row.each(function(){
                    var $that = $(this),
                        display = $that.css('display');

                    // temporarily force a usable display value
                    if (display !== 'inline-block' && display !== 'inline-flex') {
                        display = 'block';
                    }

                    // ensure we get the correct actual height (and not a previously set height value)
                    var css = { 'display': display };
                    css[opts.property] = '';
                    $that.css(css);

                    // find the max height (including padding, but not margin)
                    if ($that.outerHeight(false) > targetHeight) {
                        targetHeight = $that.outerHeight(false);
                    }

                    // revert display block
                    $that.css('display', '');
                });
            } else {
                // if target set, use the height of the target element
                targetHeight = opts.target.outerHeight(false);
            }

            // iterate the row and apply the height to all elements
            $row.each(function(){
                var $that = $(this),
                    verticalPadding = 0;

                // don't apply to a target
                if (opts.target && $that.is(opts.target)) {
                    return;
                }

                // handle padding and border correctly (required when not using border-box)
                if ($that.css('box-sizing') !== 'border-box') {
                    verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
                    verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
                }

                // set the height (accounting for padding and border)
                $that.css(opts.property, (targetHeight - verticalPadding) + 'px');
            });
        });

        // revert hidden parents
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.attr('style', $that.data('style-cache') || null);
        });

        // restore scroll position if enabled
        if (matchHeight._maintainScroll) {
            $(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));
        }

        return this;
    };

    /*
    *  matchHeight._applyDataApi
    *  applies matchHeight to all elements with a data-match-height attribute
    */

    matchHeight._applyDataApi = function() {
        var groups = {};

        // generate groups by their groupId set by elements using data-match-height
        $('[data-match-height], [data-mh]').each(function() {
            var $this = $(this),
                groupId = $this.attr('data-mh') || $this.attr('data-match-height');

            if (groupId in groups) {
                groups[groupId] = groups[groupId].add($this);
            } else {
                groups[groupId] = $this;
            }
        });

        // apply matchHeight to each group
        $.each(groups, function() {
            this.matchHeight(true);
        });
    };

    /*
    *  matchHeight._update
    *  updates matchHeight on all current groups with their correct options
    */

    var _update = function(event) {
        if (matchHeight._beforeUpdate) {
            matchHeight._beforeUpdate(event, matchHeight._groups);
        }

        $.each(matchHeight._groups, function() {
            matchHeight._apply(this.elements, this.options);
        });

        if (matchHeight._afterUpdate) {
            matchHeight._afterUpdate(event, matchHeight._groups);
        }
    };

    matchHeight._update = function(throttle, event) {
        // prevent update if fired from a resize event
        // where the viewport width hasn't actually changed
        // fixes an event looping bug in IE8
        if (event && event.type === 'resize') {
            var windowWidth = $(window).width();
            if (windowWidth === _previousResizeWidth) {
                return;
            }
            _previousResizeWidth = windowWidth;
        }

        // throttle updates
        if (!throttle) {
            _update(event);
        } else if (_updateTimeout === -1) {
            _updateTimeout = setTimeout(function() {
                _update(event);
                _updateTimeout = -1;
            }, matchHeight._throttle);
        }
    };

    /*
    *  bind events
    */

    // apply on DOM ready event
    $(matchHeight._applyDataApi);

    // update heights on load and resize events
    $(window).bind('load', function(event) {
        matchHeight._update(false, event);
    });

    // throttled update heights on resize events
    $(window).bind('resize orientationchange', function(event) {
        matchHeight._update(true, event);
    });

})(jQuery);


/* ------------------------------------------------ /
JS PLUGINS
/ ------------------------------------------------ */

'use strict';

/* jshint unused: false */


// Get Current Breakpoint (Global)
var breakpoint = {
	name: '',
	refresh: function() {
		this.name = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
	}
};
jQuery(window).resize( function() { breakpoint.refresh(); }).resize();


// Resize Iframes Proportionally
function iframeAspect(selector) {
	selector = selector || jQuery('iframe');

	selector.each( function() {
		/* jshint validthis: true */
		var iframe = jQuery(this),
			width  = iframe.width();
		if ( typeof(iframe.data('ratio')) == 'undefined' ) {
			var attrW = this.width,
				attrH = this.height;
			iframe.data('ratio', attrH / attrW ).removeAttr('width').removeAttr('height');
		}
		iframe.height( width * iframe.data('ratio') ).css('max-height', '');
	});
}


// Lighten / Darken Color
// Credit "Pimp Trizkit" - http://stackoverflow.com/users/693927/pimp-trizkit
function shadeColor(color, percent) {   
	var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
	return '#'+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


// Blend Colors
// Credit "Pimp Trizkit" - http://stackoverflow.com/users/693927/pimp-trizkit
function blendColors(c0, c1, p) {
	var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
	return '#'+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}


// Convert color to RGBa
function colorToRgba(color, opacity) {
	if ( color.substring(0,4) == 'rgba' ) {
		var alpha = color.match(/([^\,]*)\)$/);
		return color.replace(alpha[1], opacity);
	} else if ( color.substring(0,3) == 'rgb' ) {
		return color.replace('rgb(', 'rgba(').replace(')', ', '+opacity+')');
	} else {
		var hex = color.replace('#',''),
			r = parseInt(hex.substring(0,2), 16),
			g = parseInt(hex.substring(2,4), 16),
			b = parseInt(hex.substring(4,6), 16),
			result = 'rgba('+r+','+g+','+b+','+opacity+')';
		return result;
	}
}


// Color Light Or Dark
// Credit "Larry Fox" - https://gist.github.com/larryfox/1636338
function colorLoD(color) {
	var r,b,g,hsp,a = color;
	if (a.match(/^rgb/)) {
		a = a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
		r = a[1];
		b = a[2];
		g = a[3];
	} else {
		a = +('0x' + a.slice(1).replace(a.length < 5 && /./g, '$&$&'));
		r = a >> 16;
		b = a >> 8 & 255;
		g = a & 255;
	}
	hsp = Math.sqrt( 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b) );
	return ( hsp > 127.5 ) ? 'light' : 'dark';
} 


// Image Light Or Dark Image
// Credit "Joseph Portelli" - http://stackoverflow.com/users/149636/joseph-portelli
function imageLoD(imageSrc, callback) {
	var img = document.createElement('img');
	img.src = imageSrc;
	img.style.display = 'none';
	document.body.appendChild(img);

	var colorSum = 0;

	img.onload = function() {
		// create canvas
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(this,0,0);

		var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
		var data = imageData.data;
		var r,g,b,avg;

		for(var x = 0, len = data.length; x < len; x+=4) {
			r = data[x];
			g = data[x+1];
			b = data[x+2];

			avg = Math.floor((r+g+b)/3);
			colorSum += avg;
		}

		var brightness = Math.floor(colorSum / (this.width*this.height));
		callback(brightness);
	};
}


// Resize Image To Fill Container Size
function imageCover(cont, type, corrH) {
	type = type || 'bg';

	cont.addClass('image-cover');

	var img, imgUrl, imgWidth = 0, imgHeight = 0;

	if ( type == 'img' ) {
		img = cont.find('.bg-img');
		imgWidth  = img.width();
		imgHeight = img.height();
	} else {
		imgUrl = cont.css('background-image').match(/^url\("?(.+?)"?\)$/);
		if ( imgUrl[1] ) {
		    img = new Image();
		    img.src = imgUrl[1];
		    imgWidth  = img.width;
		    imgHeight = img.height;
		}
	}

	if ( imgWidth !== 0 && imgHeight !== 0 ) {
		var contWidth  = cont.outerWidth(),
			contHeight = cont.outerHeight(),
			heightDiff = contWidth / imgWidth * imgHeight,
			newWidth   = 'auto',
			newHeight  = contHeight + corrH + 'px';

			if ( heightDiff > contHeight ) {
				newWidth  = '100%';
				newHeight = 'auto';
			}

		if ( type == 'img' ) {
			img.css({ width: newWidth, height: newHeight });
		} else {
			cont.css('background-size', newWidth + ' ' + newHeight);
		}
	}
}


// Determine If An Element Is Scrolled Into View
function elemVisible(elem, cont) {
	var contTop = cont.scrollTop(),
		contBtm = contTop + cont.height(),
		elemTop = elem.offset().top,
		elemBtm = elemTop + elem.height();

	return ((elemBtm <= contBtm) && (elemTop >= contTop));
}


// Smooth Scrolling For Webkit Browsers
// Based on https://github.com/iahnn/Firefox-like-smooth-scroll-for-chrome
var Mixt_SmoothScroll = {
	root:    document.documentElement,
	active:  document.body,
	pending: false,
	frame:   false,
	cache:   {},
	queue:   {},
	dir:     { x: 0, y: 0 },
	framerate: 60,
	anim_time: 200,
	step_size: 50,

	init: function() {
		var platform  = navigator.platform.toLowerCase();
		if ( ! jQuery.browser.webkit || ( platform.indexOf('win') != 0 && platform.indexOf('linux') != 0 ) ) return;

		var body = document.body,
			doc = document.documentElement,
			innerHeight = window.innerHeight,
			scrollHeight = body.scrollHeight;

		Mixt_SmoothScroll.addListeners();

		Mixt_SmoothScroll.root = ( document.compatMode.indexOf('CSS') >= 0 ) ? doc : body;
		Mixt_SmoothScroll.active = body;
		if ( window.top != window.self ) {
			Mixt_SmoothScroll.frame = true;
		} else if ( scrollHeight > innerHeight && ( body.offsetHeight <= innerHeight || doc.offsetHeight <= innerHeight ) ) {
			Mixt_SmoothScroll.root.style.height = 'auto';
			if ( Mixt_SmoothScroll.root.offsetHeight <= innerHeight ) {
				var i = document.createElement('div');
				i.style.clear = 'both';
				body.appendChild(i);
			}
		}
		window.setInterval( function () { Mixt_SmoothScroll.cache = {}; }, 10000 );
	},

	addListeners: function() {
		window.addEventListener('mousedown', Mixt_SmoothScroll.mousedown);
		window.addEventListener('mousewheel', Mixt_SmoothScroll.mousewheel);
	},

	mousedown: function(e) { Mixt_SmoothScroll.active = e.target; },

	scrollArray: function(e, t, n, r) {
		r = r || 1000;
		Mixt_SmoothScroll.directionCheck(t, n);
		Mixt_SmoothScroll.queue.push({
			x: t, y: n,
			lastX: t < 0 ? 0.99 : -0.99,
			lastY: n < 0 ? 0.99 : -0.99,
			start: +(new Date())
		});

		if ( Mixt_SmoothScroll.pending ) return;

		var i = function () {
			var s = +(new Date()),
				o = 0,
				u = 0;
			for ( var a = 0; a < Mixt_SmoothScroll.queue.length; a++ ) {
				var f = Mixt_SmoothScroll.queue[a],
					l = s - f.start,
					c = l >= Mixt_SmoothScroll.anim_time,
					h = c ? 1 : l / Mixt_SmoothScroll.anim_time,
					p = f.x * h - f.lastX >> 0,
					d = f.y * h - f.lastY >> 0;
				o += p;
				u += d;
				f.lastX += p;
				f.lastY += d;
				if ( c ) {
					Mixt_SmoothScroll.queue.splice(a, 1);
					a--;
				}
			}
			if ( t ) {
				var v = e.scrollLeft;
				e.scrollLeft += o;
				if ( o && e.scrollLeft === v ) { t = 0; }
			}
			if ( n) {
				var m = e.scrollTop;
				e.scrollTop += u;
				if ( u && e.scrollTop === m ) { n = 0; }
			}
			if ( ! t && ! n ) Mixt_SmoothScroll.queue = [];

			if ( Mixt_SmoothScroll.queue.length ) {
				setTimeout(i, r / Mixt_SmoothScroll.framerate + 1);
			} else {
				Mixt_SmoothScroll.pending = false;
			}
		};
		setTimeout(i, 0);
		Mixt_SmoothScroll.pending = true;
	},

	directionCheck: function(e, t) {
	    e = e > 0 ? 1 : -1;
	    t = t > 0 ? 1 : -1;
	    if ( Mixt_SmoothScroll.dir.x !== e || Mixt_SmoothScroll.dir.y !== t ) {
	        Mixt_SmoothScroll.dir.x = e;
	        Mixt_SmoothScroll.dir.y = t;
	        Mixt_SmoothScroll.queue = [];
	    }
	},

	mousewheel: function(e) {
		var t = e.target,
			obj = Mixt_SmoothScroll,
			n = obj.overflowingAncestor(t);
		if ( ! n || e.defaultPrevented || obj.isNodeName(obj.active, 'embed') || obj.isNodeName(t, 'embed') && /\.pdf/i.test(t.src) ) { return true; }
		var r = e.wheelDeltaX || 0,
			i = e.wheelDeltaY || 0;
		if ( ! r && ! i ) i = e.wheelDelta || 0;
		if ( Math.abs(r) > 1.2 ) r *= obj.step_size / 120;
		if ( Math.abs(i) > 1.2 ) i *= obj.step_size / 120;
		obj.scrollArray(n, -r, -i);
		e.preventDefault();
	},

	overflowingAncestor: function(e) {
		var t = [];
		var n = Mixt_SmoothScroll.root.scrollHeight;
		do {
			var r = Mixt_SmoothScroll.cache[Mixt_SmoothScroll.uniqueID(e)];
			if ( r ) { return Mixt_SmoothScroll.setCache(t, r); }
			t.push(e);
			if ( n === e.scrollHeight ) {
				if ( ! Mixt_SmoothScroll.frame || Mixt_SmoothScroll.root.clientHeight + 10 < n ) {
					return Mixt_SmoothScroll.setCache(t, document.body);
				}
			} else if ( e.clientHeight + 10 < e.scrollHeight ) {
				var overflow = getComputedStyle(e, '').getPropertyValue('overflow');
				if ( overflow === 'scroll' || overflow === 'auto' ) { return Mixt_SmoothScroll.setCache(t, e); }
			}
		} while ( ( e = e.parentNode ) !== null );
	},

	uniqueID: function() {
		var e = 0;
		return function (t) {
			return t.Mixt_SmoothScroll.uniqueID || ( t.Mixt_SmoothScroll.uniqueID = e++ );
		};
	},

	isNodeName: function(e, t) {
		return e.nodeName.toLowerCase() === t.toLowerCase();
	},

	setCache: function(e, t) {
		for ( var n = e.length; n--; ) Mixt_SmoothScroll.cache[Mixt_SmoothScroll.uniqueID(e[n])] = t;
		return t;
	}
};


( function($) {
	
	// Resize text based on container width
	$.fn.bigText = function(options) {
		var settings = $.extend({
			'ratio':   1,
			'minSize': 12,
			'maxSize': 512
		}, options);

		return this.each( function() {
			var $this = $(this),
				data  = $this.data(),
				ratio = data.hasOwnProperty('ratio') ? data.ratio : settings.ratio,
				min   = data.hasOwnProperty('minSize') ? data.minSize : settings.minSize,
				max   = data.hasOwnProperty('maxSize') ? data.maxSize : settings.maxSize,
				fit = function () {
					var chars = $this.text().length * 0.5737,
						size = Math.max(Math.min($this.width() * (ratio / chars), parseFloat(max)), parseFloat(min));
					$this.css('font-size', size);
					if ( size <= min ) {
						$this.addClass('wrap-text');
					} else {
						$this.removeClass('wrap-text');
					}
					$this.addClass('init');
				};

			fit();

			$(window).on('resize orientationchange', fit);
		});
	};


	// Fix WPML Dropdown
	$('.menu-item-language').addClass('dropdown drop-menu').find('.sub-menu').addClass('dropdown-menu');

	// Fix PolyLang Menu Items And Make Them Dropdown
	$('.menu-item.lang-item').removeClass('disabled');

	var item = $('.lang-item.current-lang');
	if (item.length === 0) {
		item = $('.lang-item').first();
	}
	var langs = item.siblings('.lang-item');
	item.addClass('dropdown drop-menu');
	langs.wrapAll('<ul class="sub-menu dropdown-menu"></ul>').parent().appendTo(item);
})(jQuery);
/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-flexbox-objectfit-shiv !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,a,i,s;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],t=C[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,a=0;a<e.length;a++)i=e[a],s=i.split("."),1===s.length?Modernizr[s[0]]=o:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=o),y.push((o?"":"no-")+s.join("-"))}}function a(e){var t=x.className,n=Modernizr._config.classPrefix||"";if(b&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),b?x.className.baseVal=t:x.className=t)}function i(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function s(e,t){return!!~(""+e).indexOf(t)}function l(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):b?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function f(e,t){return function(){return e.apply(t,arguments)}}function u(e,t,n){var o;for(var a in e)if(e[a]in t)return n===!1?e[a]:(o=t[e[a]],r(o,"function")?f(o,n||t):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(){var e=t.body;return e||(e=l(b?"svg":"body"),e.fake=!0),e}function p(e,n,r,o){var a,i,s,f,u="modernizr",c=l("div"),p=d();if(parseInt(r,10))for(;r--;)s=l("div"),s.id=o?o[r]:u+(r+1),c.appendChild(s);return a=l("style"),a.type="text/css",a.id="s"+u,(p.fake?p:c).appendChild(a),p.appendChild(c),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),c.id=u,p.fake&&(p.style.background="",p.style.overflow="hidden",f=x.style.overflow,x.style.overflow="hidden",x.appendChild(p)),i=n(c,e),p.fake?(p.parentNode.removeChild(p),x.style.overflow=f,x.offsetHeight):c.parentNode.removeChild(c),!!i}function m(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var a=[];o--;)a.push("("+c(t[o])+":"+r+")");return a=a.join(" or "),p("@supports ("+a+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function h(e,t,o,a){function f(){c&&(delete F.style,delete F.modElem)}if(a=r(a,"undefined")?!1:a,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var c,d,p,h,v,g=["modernizr","tspan"];!F.style;)c=!0,F.modElem=l(g.shift()),F.style=F.modElem.style;for(p=e.length,d=0;p>d;d++)if(h=e[d],v=F.style[h],s(h,"-")&&(h=i(h)),F.style[h]!==n){if(a||r(o,"undefined"))return f(),"pfx"==t?h:!0;try{F.style[h]=o}catch(y){}if(F.style[h]!=v)return f(),"pfx"==t?h:!0}return f(),!1}function v(e,t,n,o,a){var i=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+w.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?h(s,t,o,a):(s=(e+" "+N.join(i+" ")+i).split(" "),u(s,t,n))}function g(e,t,r){return v(e,n,n,t,r)}var y=[],C=[],E={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){C.push({name:e,fn:t,options:n})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=E,Modernizr=new Modernizr;var x=t.documentElement,b="svg"===x.nodeName.toLowerCase();b||!function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=C.elements;return"string"==typeof e?e.split(" "):e}function o(e,t){var n=C.elements;"string"!=typeof n&&(n=n.join(" ")),"string"!=typeof e&&(e=e.join(" ")),C.elements=n+" "+e,f(t)}function a(e){var t=y[e[v]];return t||(t={},g++,e[v]=g,y[g]=t),t}function i(e,n,r){if(n||(n=t),c)return n.createElement(e);r||(r=a(n));var o;return o=r.cache[e]?r.cache[e].cloneNode():h.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!o.canHaveChildren||m.test(e)||o.tagUrn?o:r.frag.appendChild(o)}function s(e,n){if(e||(e=t),c)return e.createDocumentFragment();n=n||a(e);for(var o=n.frag.cloneNode(),i=0,s=r(),l=s.length;l>i;i++)o.createElement(s[i]);return o}function l(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return C.shivMethods?i(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-:]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(C,t.frag)}function f(e){e||(e=t);var r=a(e);return!C.shivCSS||u||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),c||l(e,r),e}var u,c,d="3.7.3",p=e.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,v="_html5shiv",g=0,y={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",u="hidden"in e,c=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){u=!0,c=!0}}();var C={elements:p.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:d,shivCSS:p.shivCSS!==!1,supportsUnknownElements:c,shivMethods:p.shivMethods!==!1,type:"default",shivDocument:f,createElement:i,createDocumentFragment:s,addElements:o};e.html5=C,f(t),"object"==typeof module&&module.exports&&(module.exports=C)}("undefined"!=typeof e?e:this,t);var S="Moz O ms Webkit",w=E._config.usePrefixes?S.split(" "):[];E._cssomPrefixes=w;var _=function(t){var r,o=prefixes.length,a=e.CSSRule;if("undefined"==typeof a)return n;if(!t)return!1;if(t=t.replace(/^@/,""),r=t.replace(/-/g,"_").toUpperCase()+"_RULE",r in a)return"@"+t;for(var i=0;o>i;i++){var s=prefixes[i],l=s.toUpperCase()+"_"+r;if(l in a)return"@-"+s.toLowerCase()+"-"+t}return!1};E.atRule=_;var N=E._config.usePrefixes?S.toLowerCase().split(" "):[];E._domPrefixes=N;var j={elem:l("modernizr")};Modernizr._q.push(function(){delete j.elem});var F={style:j.elem.style};Modernizr._q.unshift(function(){delete F.style}),E.testAllProps=v,E.testAllProps=g,Modernizr.addTest("flexbox",g("flexBasis","1px",!0));var T=E.prefixed=function(e,t,n){return 0===e.indexOf("@")?_(e):(-1!=e.indexOf("-")&&(e=i(e)),t?v(e,t,n):v(e,"pfx"))};Modernizr.addTest("objectfit",!!T("objectFit"),{aliases:["object-fit"]}),o(),a(y),delete E.addTest,delete E.addAsyncTest;for(var k=0;k<Modernizr._q.length;k++)Modernizr._q[k]();e.Modernizr=Modernizr}(window,document);

/* ------------------------------------------------ /
ELEMENT FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	var viewport = $(window);


	// Stat / Counter Element
	function mixtStats() {
		var statElems = $('.mixt-stat');

		if ( statElems.length === 0 ) { return; }

		// Set stat text to starting (from) value
		statElems.find('.stat-value').each( function() { $(this).text($(this).data('from')); });

		// Animate value
		function statValue(el) {
			var from   = el.data('from'),
				to     = el.data('to'),
				speed  = el.data('speed'),
				linear = el.data('linear');
			$({value: from}).animate({value: to}, {
				duration: speed,
				easing: ( linear == true ) ? 'linear' : 'swing',
				step: function() { el.text(Math.round(this.value)); },
				always: function() { el.text(to); }
			});
		}

		// Render Circle
		function statCircle(stat) {
			if ( typeof $.fn.circleProgress === 'function' ) {
				stat.children('.stat-circle').circleProgress({ size: 500, lineCap: 'round' }).children('.circle-inner').each( function() {
					$(this).css('margin-top', $(this).height() / -2);
				});
			}
		}

		viewport.load( function() {
			statElems.each( function() {
				var stat = $(this);
				if ( typeof $.fn.waypoint === 'function' ) {
					stat.waypoint( function() {
						statValue(stat.find('.stat-value'));
						statCircle(stat);
						if ( typeof this.destroy === 'function' ) this.destroy();
					}, {
						offset: 'bottom-in-view',
						triggerOnce: true
					});
				} else {
					statValue(stat.find('.stat-value'));
					statCircle(stat);
				}
			});
		});
	}
	mixtStats();


	// Flip Card Equalize Height
	if ( typeof $.fn.matchHeight === 'function' ) {
		var flipcardSides = $('.flip-card .front, .flip-card .back');
		flipcardSides.imagesLoaded( function() {
			flipcardSides.addClass('fix-height').matchHeight();
		});
	}
	// Flip Card Touch Screen "Hover"
	$('.mixt-flipcard').on('touchstart touchend', function() {
		$(this).toggleClass('hover');
	});

})(jQuery);

/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global mixt_opt */

	var viewport  = $(window),
		mainNav   = $('#main-nav'),
		mediaWrap = $('.head-media');

	// Head Media Functions
	function headerFn() {
		var mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = mainNav.outerHeight(),
			wrapHeight   = mediaWrap.height(),
			wrapOffset   = mediaWrap.offset().top,
			viewHeight   = viewport.height() - wrapOffset;

		// Make header fullscreen
		if ( mixt_opt.header.fullscreen ) {
			var fullHeight = viewHeight;

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) fullHeight -= topNavHeight;

			mediaWrap.add(mediaCont).css('height', fullHeight);

		// Set header height to viewport percentage
		} else if ( mixt_opt.header.height.height != '' && mixt_opt.header.height.units == '%' ) {
			var percentHeight = parseInt(mixt_opt.header.height.height, 10) / 100 * viewHeight;

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) percentHeight -= topNavHeight;

			mediaWrap.add(mediaCont).css('height', percentHeight);
		}

		// Add data attributes for parallax scrolling
		if ( mixt_opt.header.parallax != 'none' ) {
			var paraEl = mediaWrap.find('.media-container, .ls-container'),
				paraHeight = mediaWrap.height() + wrapOffset,
				offTop = '-'+wrapOffset+'px',
				btmVal = ( mixt_opt.header.parallax == 'slow' ) ? '25%' : '80%';
			if ( paraEl.length ) {
				mediaCont.css({'top': offTop, 'height': paraHeight });
				paraEl.attr('data-top', 'transform: translate3d(0, 0%, 0)');
				paraEl.attr('data-top-bottom', 'transform: translate3d(0, ' + btmVal + ', 0)');

				viewport.trigger('refresh-skrollr', paraEl);
			}
		}

		if ( mixt_opt.header['content-fade'] ) {
			var content = mediaWrap.children('.container');
			if ( content.length ) {
				content.attr('data-'+wrapOffset+'-top', 'opacity: 1; transform: translate3d(0, 0%, 0);');
				content.attr('data--200-top-bottom', 'opacity: 0; transform: translate3d(0, 80%, 0);');
			}
			// Prevent content fade if header is taller than viewport
			if ( wrapHeight > viewHeight ) {
				mediaWrap.addClass('no-fade');
			} else {
				mediaWrap.removeClass('no-fade');
				viewport.trigger('refresh-skrollr', content);
			}
		}
	}

	// Header Scroll To Content
	function headerScroll() {
		var page   = $('html, body'),
			offset = $('#content-wrap').offset().top + 1;
		if ( mixt_opt.nav.mode == 'fixed' ) { offset -= mainNav.outerHeight(); }
		$('.header-scroll').on('click', function() {
			page.animate({ scrollTop: offset }, 800);
		});
	}

	if ( mixt_opt.header.enabled && mediaWrap.length ) {
		headerFn();

		if ( mixt_opt.header.scroll ) { headerScroll(); }
		
		$(window).resize( $.debounce( 500, headerFn ));
	}

})(jQuery);

/* ------------------------------------------------ /
HELPER FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	// Skip Link Focus Fix
	
	var is_webkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
		is_opera  = navigator.userAgent.toLowerCase().indexOf('opera')  > -1,
		is_ie     = navigator.userAgent.toLowerCase().indexOf('msie')   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
		var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
		window[ eventMethod ]( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea|div)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}


	// Apply Bootstrap Classes
	
	var wooCommWrap = $('.woocommerce');
	
	var widgetNavMenus = '.widget_meta, .widget_recent_entries, .widget_archive, .widget_categories, .widget_nav_menu, .widget_pages, .widget_rss';

	// WooCommerce Widgets & Elements
	if ( wooCommWrap.length ) {
		widgetNavMenus += ', .widget_product_categories, .widget_products, .widget_top_rated_products, .widget_recent_reviews, .widget_recently_viewed_products, .widget_layered_nav';

		wooCommWrap.find('.shop_table').addClass('table table-bordered');

		$(document.body).on('updated_checkout', function() {
			$('.shop_table').addClass('table table-bordered table-striped');
		});
	}

	$(widgetNavMenus).children('ul').addClass('nav');
	$('.widget_nav_menu ul.menu').addClass('nav');

	$('#wp-calendar').addClass('table table-striped table-bordered');


	// Handle Post Count Tags

	$('.widget_archive li, .widget_categories li').each( function() {
		var $this     = $(this),
			children  = $this.children(),
			anchor    = children.filter('a'),
			contents  = $this.contents(),
			countText = contents.not(children).text();

		if ( countText !== '' ) {
			anchor.append('<span class="post-count">' + countText + '</span>');
			contents.filter( function() {
				return this.nodeType === 3; 
			}).remove();
		}
	});

	$('.widget.woocommerce li').each( function() {
		var $this = $(this),
			count = $this.children('.count'),
			link  = $this.children('a');
		count.appendTo(link);
	});


	// Gallery Arrow Navigation

	$(document).keydown( function(e) {
		var url = false;
		if ( e.which === 37 ) {  // Left arrow key code
			url = $('.previous-image a').attr('href');
		} else if ( e.which === 39 ) {  // Right arrow key code
			url = $('.entry-attachment a').attr('href');
		}
		if ( url && ( ! $('textarea, input').is(':focus') ) ) {
			window.location = url;
		}
	});


	// Detect Mobile

	window.mobileCheck = function() {
		var check = false;
		( function(a) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
				check = true;
			}
		})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}


	// Detect IE Version

	function detectIE() {
		var ua = window.navigator.userAgent;

		// IE 10 or older
		var msie = ua.indexOf('MSIE ');
		if ( msie > 0 ) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); }

		// IE 11
		var trident = ua.indexOf('Trident/');
		if ( trident > 0 ) {
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		// Edge (IE 12+)
		var edge = ua.indexOf('Edge/');
		if ( edge > 0 ) { return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10); }

		// Other browsers
		return false;
	}
	var IE_ver = detectIE();
	if ( IE_ver ) { $('html').addClass('ie ie'+IE_ver); }

})(jQuery);

/* ------------------------------------------------ /
NAVBAR FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global mixt_opt, colorLoD, colorToRgba */

	var viewport     = $(window),
		bodyEl       = $('body'),
		mainWrap     = $('#main-wrap'),
		mainNavWrap  = $('#main-nav-wrap'),
		mainNavBar   = $('#main-nav'),
		mainNavCont  = mainNavBar.children('.container'),
		mainNavHead  = $('.navbar-header', mainNavBar),
		mainNavInner = $('.navbar-inner', mainNavBar),
		secNavBar    = $('#second-nav'),
		secNavCont   = secNavBar.children('.container'),
		navbars      = $('.navbar'),
		mediaWrap    = $('.head-media');

	if ( mainNavBar.length === 0 ) return;

	var Navbar = {

		navBg: '',
		navBgTop: '',

		// Initialize Navbar
		init: function(navbar) {
			var dataCont = navbar.find('.navbar-data'),
				bgColor  = ( navbar.is(mainNavBar) ) ? dataCont.css('background-color') : navbar.css('background-color'),
				colorLum = dataCont.length ? window.getComputedStyle(dataCont[0], ':before').getPropertyValue('content').replace(/"/g, '') : '';

			if ( colorLum != 'dark' && colorLum != 'light' ) colorLum = colorLoD(bgColor);

			if ( navbar.is(mainNavBar) ) {

				this.navBg = ( colorLum == 'dark' ) ? 'bg-dark' : 'bg-light';
				navbar.addClass(this.navBg);

				mainNavBar.attr('data-bg', colorLum);

				var navSheet = $('<style data-id="mixt-nav-css">');

				if ( mixt_opt.nav.layout != 'vertical' ) {
					navSheet.append('#main-nav.navbar-mixt:not(.position-top) { background-color: '+colorToRgba(bgColor, mixt_opt.nav.opacity)+'; }');
				}

				if ( mixt_opt.nav.transparent && mixt_opt.header.enabled ) {
					navSheet.append('.nav-transparent #main-nav.navbar-mixt.position-top { background-color: '+colorToRgba(bgColor, mixt_opt.nav['top-opacity'])+'; }');
					
					if ( mixt_opt.nav['top-opacity'] <= 0.4 ) {
						if ( mediaWrap.hasClass('bg-dark') ) { this.navBgTop = 'bg-dark'; }
						else if ( mediaWrap.hasClass('bg-light') ) { this.navBgTop = 'bg-light'; }
						else { this.navBgTop = this.navBg; }
					}

					Navbar.sticky.toggle();
				} else {
					this.navBgTop = this.navBg;
				}

				if ( mixt_opt.nav.mode == 'static' ) {
					mainNavBar.removeClass(this.navBg).addClass(this.navBgTop);
				} else if ( navSheet.html() != '' ) {
					navSheet.appendTo($('head'));
				}
			} else {
				if ( colorLum == 'dark' ) {
					navbar.addClass('bg-dark');
				} else {
					navbar.addClass('bg-light');
				}
			}
		},

		// Sticky (fixed) Navbar Functions
		sticky: {
			isMobile: false,
			offset: 0,
			scrollCorrection: 0,

			// Trigger or update sticky state
			trigger: function(isMobile) {
				Navbar.sticky.offset = 0;
				Navbar.sticky.isMobile = isMobile;
				Navbar.sticky.scrollCorrection = parseInt(mainWrap.offset().top, 10);

				if ( isMobile === false && ( mixt_opt.nav.layout == 'vertical' || ( document.documentElement.scrollHeight - viewport.height() ) > 160 ) ) {
					mainNavBar.data('fixed', true);
					viewport.on('scroll', $.throttle(50, Navbar.sticky.toggle));
				} else {
					mainNavBar.data('fixed', false);
					viewport.off('scroll', Navbar.sticky.toggle);
				}

				if ( mixt_opt.nav.layout == 'horizontal' && mixt_opt.nav.transparent && mixt_opt.nav.position == 'below' ) {
					Navbar.sticky.offset = mainNavBar.outerHeight();
				}

				Navbar.sticky.toggle();
			},

			// Toggle sticky state
			toggle: function() {
				var navPos    = mainNavWrap.offset().top - Navbar.sticky.offset,
					scrollVal = viewport.scrollTop(),
					bgTopCls  = Navbar.navBgTop;

				scrollVal = ( Navbar.sticky.isMobile === true ) ? 0 : scrollVal + Navbar.sticky.scrollCorrection;

				if ( mainNavBar.hasClass('slide-bg-dark') ) { bgTopCls = 'bg-dark'; }
				else if ( mainNavBar.hasClass('slide-bg-light') && ( Navbar.navBg != 'bg-dark' || mixt_opt.nav['top-opacity'] <= 0.4 ) ) { bgTopCls = 'bg-light'; }

				if ( scrollVal > navPos && ( mixt_opt.nav.layout != 'vertical' || ! Navbar.sticky.isMobile ) ) {  
					bodyEl.addClass('fixed-nav');
					mainNavBar.removeClass('position-top ' + bgTopCls).addClass(Navbar.navBg);
				} else {
					bodyEl.removeClass('fixed-nav');
					mainNavBar.removeClass(Navbar.navBg).addClass('position-top ' + bgTopCls);
				}
			},
		},

		// Menu Functions
		menu: {

			// Prevent navbar submenu overflow out of viewport
			overflow: function(navbar) {
				var navbarOff = 0,
					mainSub = navbar.find('.drop-menu .dropdown-menu, .mega-menu-column > .sub-menu, .mega-menu-column > a');

				if ( navbar.length > 0 ) {
					navbarOff = navbar.outerWidth() + parseInt(navbar.offset().left, 10);
				}

				// Reset mobile adjustments
				mainNavBar.css({ 'position': '', 'top': '' }).removeClass('stopped');

				// Perform menu overflow checks
				mainSub.each( function() {
					var sub      = $(this),
						topSub   = sub,
						subPar   = sub.parent(),
						subPos   = parseInt(sub.offset().left, 10),
						subW     = sub.outerWidth() + 1,
						nestOff  = subPos + subW,
						nestSubs = sub.children('.drop-submenu'),
						overflowingSubs = nestSubs,
						correction;

					if ( subPar.is('.mega-menu-column') ) {
						topSub = subPar.parents('.dropdown-menu');
						overflowingSubs = topSub.find('.mega-menu-column:nth-child(4n) .drop-submenu, .mega-menu-column:nth-child(n-4):last-child .drop-submenu');
					}

					// Top Level Submenus
					if ( nestOff > navbarOff ) {
						var mgNow = parseInt(topSub.css('margin-left'), 10);
						correction = (nestOff - navbarOff - 2) * -1;

						if ( topSub.css('border-right-width') == '1px' ) { correction -= 1; }

						if ( navbar.hasClass('bordered') || navbar.parents('.navbar').hasClass('bordered') ) { correction -= 1; }

						if ( correction < mgNow ) {
							topSub.css('margin-left', correction + 'px');
						}
						Navbar.menu.setDropLeft(overflowingSubs);
					}

					// Nested Submenus
					nestSubs.each( function() {
						var subNow    = $(this),
							nestSubsW = [];
						subNow.find('.sub-menu:not(:has(.drop-submenu))').map( function(i) {
							var $this    = $(this),
								parents  = $this.parents('.sub-menu'),
								parentsW = 0;

							parents.each( function() {
								var $this = $(this);
								if ( ! $this.hasClass('dropdown-menu') && ! $this.hasClass('mega-menu-column')) {
									parentsW += $(this).outerWidth();
								}
							});

							nestSubsW[i] = $this.outerWidth() + parentsW;
						});

						var maxNestW = $.isEmptyObject(nestSubsW) ? 0 : Math.max.apply(null, nestSubsW);

						if ( (nestOff + maxNestW) >= mainWrap.width() ) {
							Navbar.menu.setDropLeft(subNow);
						} else {
							Navbar.menu.resetArrow(subNow);
						}

					});

				});
			},

			// Set menu drop left
			setDropLeft: function(target) {
				target.find('.sub-menu').addClass('drop-left');
				if ( target.hasClass('arrow-left') || target.hasClass('arrow-right') ) {
					target.addClass('arrow-left').removeClass('arrow-right');
					target.find('.drop-submenu').addClass('arrow-left').removeClass('arrow-right');
				}
			},

			// Reset menu drop
			resetArrow: function(target) {
				target.find('.sub-menu').removeClass('drop-left');
				if ( target.hasClass('arrow-left') || target.hasClass('arrow-right') ) {
					target.addClass('arrow-right').removeClass('arrow-left');
					target.find('.drop-submenu').addClass('arrow-right').removeClass('arrow-left');
				}
			},

			// Mega menu enable / disable
			megaMenuToggle: function(toggle, navbar) {
				var megaMenus;

				if ( toggle == 'enable' ) {
					megaMenus = navbar.find('.drop-menu[data-mega-menu="true"]');
					megaMenus.each( function() {
						var megaMenu = $(this);

						megaMenu.addClass('mega-menu').removeClass('drop-menu').removeAttr('data-mega-menu');
						$('> .sub-menu > .drop-submenu', megaMenu).removeClass('drop-submenu').addClass('mega-menu-column');
					});
					megaMenus.children('ul').css('margin-left', '');
				} else if ( toggle == 'disable' ) {
					megaMenus = navbar.find('.mega-menu');
					megaMenus.each( function() {
						var megaMenu = $(this);

						megaMenu.removeClass('mega-menu').addClass('drop-menu').attr('data-mega-menu', 'true');
						megaMenu.find('.mega-menu-column').removeClass('mega-menu-column').addClass('drop-submenu');
					});
					megaMenus.children('ul').css('margin-left', '');
				}
			},

			// Create mega menu rows if there are more than 4 columns
			megaMenuRows: function() {
				mainWrap.find('.mega-menu').each( function() {
					var mainMenu = $(this).children('.sub-menu'),
						columns  = mainMenu.children('.mega-menu-column');

					if ( columns.length > 4 ) mainMenu.addClass('multi-row');
				});
			},
		},

		// Mobile Functions
		mobile: {

			device: null,

			// Trigger mobile functions
			trigger: function(device) {
				Navbar.mobile.device = device;

				$('.dropdown-toggle > .drop-arrow', mainNavBar).data('no-hash-scroll', true);

				// Show/hide submenus on handle click
				$('.dropdown-toggle', mainNavBar).on('click touchstart', function(event) {
					if ( $(event.target).is('.drop-arrow') ) {
						if ( event.handled !== true ) {
							var handle = $(this),
								menu   = handle.closest('.menu-item');

							if ( menu.hasClass('expand') ) {
								menu.removeClass('expand');
								$('.menu-item', menu).removeClass('expand');
							} else {
								menu.addClass('expand').siblings('li').removeClass('expand').find('.expand').removeClass('expand');
							}

							Navbar.mobile.scrollNav();

							event.handled = true;
						} else {
							return false;
						}
						event.preventDefault();
					}
					event.stopPropagation();
				});

				mainNavInner.on('shown.bs.collapse hidden.bs.collapse', function() {
					$('.menu-item', mainNavBar).removeClass('expand');
					Navbar.mobile.scrollNav();
				});

				Navbar.mobile.scrollNav();
			},

			scrollPos: 0,

			// Enable nav scrolling if navbar height > viewport
			scrollNav: function() {
				if ( mixt_opt.nav.mode == 'fixed' && Navbar.mobile.device == 'tablet' ) {
					var viewportH     = viewport.height(),
						navbarHeaderH = mainNavHead.height() + 1,
						navbarInnerH  = mainNavInner.hasClass('in') ? mainNavInner.height() : 0,
						navbarH       = navbarHeaderH + navbarInnerH,
						navbarTop     = mainNavBar.offset().top,
						navwrapTop    = mainNavWrap.offset().top;

					Navbar.mobile.scrollPos = viewport.scrollTop();

					if ( mixt_opt.page['show-admin-bar'] ) {
						var adminBarH = $('#wpadminbar').height();
						viewportH  -= adminBarH;
						navwrapTop -= adminBarH;
						navbarTop  -= adminBarH;
					}

					if ( navbarH > viewportH ) {
						viewport.on('scroll', Navbar.mobile.stopScroll);
						if ( mainNavBar.not('stopped') ) {
							mainNavBar.addClass('stopped').css({ 'position': 'absolute', 'top': (navbarTop - navwrapTop) });
						}
					} else {
						viewport.off('scroll', Navbar.mobile.stopScroll);
						mainNavBar.css({ 'position': '', 'top': '' }).removeClass('stopped');
					}
				}
			},

			// Prevent scrolling above navbar
			stopScroll: function() {
				var viewScroll = viewport.scrollTop(),
					stopScroll = mainNavBar.hasClass('stopped');
				if ( Navbar.mobile.scrollPos > mainNavHead.offset().top ) { stopScroll = false; }
				if ( Navbar.mobile.scrollPos > viewScroll && stopScroll ) { viewport.scrollTop(Navbar.mobile.scrollPos); }
			}
		}
	};

	navbars.each( function() {
		Navbar.init($(this));
	});
	
	Navbar.menu.megaMenuRows();

	mainNavBar.on('refresh', function() {
		$('style[data-id="mixt-nav-css"]').remove();
		mainNavBar.removeClass('bg-light bg-dark');
		Navbar.init(mainNavBar);

	});

	secNavBar.on('refresh', function() {
		secNavBar.removeClass('bg-light bg-dark');
		Navbar.init(secNavBar);
	});


	// Check which media queries are active
	var mqCheck = function() {
		return window.getComputedStyle(document.querySelector('.navbar-data'), ':after').getPropertyValue('content').replace(/"/g, '');
	};


	// Enable menu hover on touch screens
	var menuParents = navbars.find('.menu-item-has-children:not(.mega-menu-column), li.dropdown');
	function menuTouchHover(event) {
		var item = $(event.delegateTarget),
			ancestors = item.parents('.hover');
		if ( item.hasClass('hover') ) {
			return true;
		} else {
			item.addClass('hover');
			menuParents.not(item).not(ancestors).removeClass('hover');
			event.preventDefault();
			return false;
		}
	}
	function menuTouchRemoveHover(event) {
		if ( ! $(event.delegateTarget).is(menuParents) && ! $(event.target).is('input') ) { menuParents.removeClass('hover'); }
	}


	// Ensure vertical navbar items fit in viewport
	function verticalNavFitView() {
		if ( viewport.height() < mainNavCont.innerHeight() ) {
			mainNavWrap.removeClass('vertical-fixed').addClass('vertical-static');
		} else {
			mainNavWrap.removeClass('vertical-static').addClass('vertical-fixed');
		}
	}


	// Handle navbar items overlap
	function navbarOverlap() {
		var mqNav = mqCheck(),
			mainNavLogoCls = 'logo-' + mainNavWrap.attr('data-logo-align');

		// Primary Navbar
		if ( mainNavLogoCls != 'logo-center' && mixt_opt.nav.layout == 'horizontal' ) {
			mainNavWrap.add(mediaWrap).removeClass('logo-center').addClass(mainNavLogoCls);
			if ( mqNav == 'desktop' ) {
				var mainNavContWidth = mainNavCont.width(),
					mainNavItemsWidth = mainNavHead.outerWidth(true) + $('#main-menu').outerWidth(true);
				if ( mainNavItemsWidth > mainNavContWidth ) {
					mainNavWrap.add(mediaWrap).removeClass(mainNavLogoCls).addClass('logo-center');
				}
			}
		}

		// Secondary Navbar
		if ( secNavBar.length ) {
			secNavBar.removeClass('items-overlap');
			var secNavContWidth = secNavCont.width(),
				secNavItemsWidth = $('.left-content', secNavBar).outerWidth(true) + $('.right-content', secNavBar).outerWidth(true);
			if ( secNavItemsWidth > secNavContWidth ) {
				secNavBar.addClass('items-overlap');
			}
		}
	}


	// One-Page Navigation
	function onePageNav() {
		var offset = 0,
			spyData = bodyEl.data('bs.scrollspy');

		if ( mixt_opt.nav.mode == 'fixed' && mainNavBar.data('fixed') ) { offset += mainNavBar.outerHeight(); }
		if ( mixt_opt.page['show-admin-bar'] && $('#wpadminbar').css('position') == 'fixed' ) { offset += $('#wpadminbar').height(); }

		$('.one-page-row').each( function() {
			var row = $(this);

			if ( row.is(':first-child') ) {
				var pageContent = $('.page-content.one-page');
				pageContent.css('margin-top', '');
				row.css('padding-top', pageContent.css('margin-top'));
				pageContent.css('margin-top', 0);
			} else {
				var prevRow = row.prev();
				if ( ! prevRow.hasClass('row') ) prevRow = prevRow.prev('.row');

				prevRow.css('margin-bottom', '');
				row.css('padding-top', prevRow.css('margin-bottom'));
				prevRow.css('margin-bottom', 0);
			}
		});

		if ( spyData ) {
			spyData.options.offset = offset;
			bodyEl.scrollspy('refresh');
		} else {
			bodyEl.scrollspy({
				target: '#main-nav',
				offset: offset
			});

			mainNavBar.on('activate.bs.scrollspy', function () {
				setTimeout( function() {
					mainNavInner.collapse('hide');
				}, 100 );
			});
		}
	}


	// Functions Run On Load & Window Resize
	function navbarFn() {
		var mqNav = mqCheck();

		// Run function to prevent submenus going outside viewport
		navbars.not(mainNavBar).each( function() {
			Navbar.menu.overflow($('.navbar-inner', this));
		});

		// Run functions based on currently active media query
		if ( mqNav == 'desktop' ) {
			Navbar.menu.overflow(mainNavInner);
			mainWrap.addClass('nav-full').removeClass('nav-mini');

			navbars.each( function() {
				Navbar.menu.megaMenuToggle('enable', $(this));
			});

			menuParents.on('touchstart', menuTouchHover);
			bodyEl.on('touchstart', menuTouchRemoveHover);
		} else if ( mqNav == 'mobile' || mqNav == 'tablet' ) {
			Navbar.mobile.trigger(mqNav);
			mainWrap.addClass('nav-mini').removeClass('nav-full');

			navbars.each( function() {
				Navbar.menu.megaMenuToggle('disable', $(this));
			});

			menuParents.off('touchstart', menuTouchHover);
			bodyEl.off('touchstart', menuTouchRemoveHover);
		}

		// Make primary navbar sticky if option enabled
		if ( mixt_opt.nav.mode == 'fixed' ) {
			if ( mqNav == 'mobile' ) {
				Navbar.sticky.trigger(true);
			} else {
				Navbar.sticky.trigger(false);
			}
		} else if ( mixt_opt.nav.layout == 'vertical' && mixt_opt.nav['vertical-mode'] == 'fixed' ) {
			if ( mqNav == 'tablet' ) {
				mainNavBar.addClass('sticky');
				Navbar.sticky.trigger(false);
			} else {
				mainNavBar.removeClass('sticky');
				Navbar.sticky.trigger(true);
			}
		} else {
			mainNavBar.addClass('position-top');
		}

		// Vertical navbar handling
		if ( mixt_opt.nav.layout == 'vertical' && mixt_opt.nav['vertical-mode'] == 'fixed' && mqNav == 'desktop' ) {
			// Make navbar static if items don't fit in viewport
			verticalNavFitView();
		}

		navbarOverlap();

		if ( mixt_opt.page['page-type'] == 'onepage' ) {
			onePageNav();
		}
	}
	viewport.resize( $.debounce( 500, navbarFn )).resize();

})(jQuery);

/* ------------------------------------------------ /
POST FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global mixt_opt, iframeAspect, Modernizr */

	var viewport = $(window),
		content  = $('#content');

	// Resize Embedded Videos Proportionally
	iframeAspect( $('.post iframe') );

	// Post Layout
	function postsPage() {

		content.imagesLoaded( function() {

			// Animate Posts
			var animPosts     = $('.posts-container .article.animated'),
				animPostDelay = ( viewport.scrollTop() > 600 ) ? 10 : 200;
			animPosts.each( function(index) {
				var elem = $(this);
				setTimeout( function() {
					elem.removeClass('init');
				}, index++ * animPostDelay);
			});
			setTimeout( function() {
				animPosts.removeClass('animated');
			}, (animPosts.length + 1) * animPostDelay);

			// Featured Gallery Slider
			if ( typeof $.fn.lightSlider === 'function' ) {
				var gallerySlider = $('.gallery-slider').not('.lightSlider');
				gallerySlider.lightSlider({
					item: 1,
					auto: true,
					loop: true,
					pager: false,
					pause: 5000,
					keyPress: true,
					slideMargin: 0,
				});
			}

			if ( typeof $.fn.lightGallery === 'function' ) {
				$('.lightbox-gallery').lightGallery();
			}

			// Equalize featured media height for related posts and grid blog
			if ( typeof $.fn.matchHeight === 'function' ) {
				$.fn.matchHeight._maintainScroll = true;
				
				$('.blog-grid .posts-container .post-feat').addClass('fix-height').matchHeight();

				if ( ! Modernizr.flexbox ) {
					$('.blog-grid .posts-container article').addClass('fix-height').matchHeight();

					var matchHeightEl = $('.post-related .post-feat'),
						matchHeightTarget = matchHeightEl.find('.wp-post-image');
					if ( matchHeightTarget.length === 0 ) matchHeightTarget = null;
					matchHeightEl.addClass('fix-height').matchHeight({
						target: matchHeightTarget,
					});
				}
			}
			
		});
	}


	// Load Posts & Comments via Ajax
	function mixtAjaxLoad(type) {
		type = type || 'posts';
		var pagCont = $('.paging-navigation'),
			ajaxBtn = $('.ajax-more', pagCont);

		if ( ! pagCont.length || ! ajaxBtn.length ) return;
		
		var pageNow = pagCont.data('page-now'),
			pageMax = pagCont.data('page-max'),
			nextUrl = ajaxBtn.attr('href'),
			pageNum,
			pageType,
			container,
			element,
			loadSel;

		if ( type == 'posts' ) {
			pageType  = mixt_opt.layout['pagination-type'];
			container = $('.posts-container');
			element   = '.article';
			loadSel   = ' .posts-container .article';
		} else if ( type == 'shop' ) {
			pageType  = mixt_opt.layout['pagination-type'];
			container = $('ul.products');
			element   = '.product';
			loadSel   = ' ul.products > li';
		} else if ( type == 'comments' ) {
			pageType  = mixt_opt.layout['comment-pagination-type'];
			container = $('.comment-list');
			element   = '.comment';
			loadSel   = ' .comment-list > li';
		}

		if ( type == 'comments' && mixt_opt.layout['comment-default-page'] == 'newest' ) {
			pageNum = pageNow - 1;
			nextUrl = nextUrl.replace(/\/comment-page-[0-9]?/, '/comment-page-' + pageNum);
		} else {
			pageNum = pageNow + 1;
		}

		if ( ( pageNow >= pageMax ) && mixt_opt.layout['comment-default-page'] != 'newest' || pageNum <= 0 ) {
			ajaxBtn.button('complete');
		}
		
		ajaxBtn.on('click cont:bottom', function(e) {
			e.preventDefault();

			// Prevent loading twice on scroll
			viewport.off('scroll', ajaxScrollHandle);
		
			// Are there more pages to load?
			if ( pageNum > 0 && pageNum <= pageMax ) {
			
				ajaxBtn.button('loading');

				// Load posts
				/* jshint unused: false */
				$('<div>').load(nextUrl + loadSel, function(response, status, xhr) {
					var newPosts = $(this);

					ajaxBtn.blur();

					newPosts.children(element).addClass('ajax-new');
					if ( ( type == 'posts' || type == 'shop' ) && mixt_opt.layout.type != 'masonry' && mixt_opt.layout['show-page-nr'] ) {
						newPosts.prepend('<div class="ajax-page page-'+ pageNum +'"><a href="'+ nextUrl +'">Page '+ pageNum +'</a></div>');
					}
					container.append(newPosts.html());

					newPosts = container.children('.ajax-new');

					// Update page number and nextUrl
					if ( type == 'comments' ) {
						if ( mixt_opt.layout['comment-default-page'] == 'newest' ) {
							pageNum--;
						} else {
							pageNum++;
						}
						nextUrl = nextUrl.replace(/\/comment-page-[0-9]?/, '/comment-page-' + pageNum);
					} else {
						pageNum++;
						nextUrl = nextUrl.replace(/\/page\/[0-9]?/, '/page/' + pageNum);
					}
					
					// Update the button state
					if ( pageNum <= pageMax && pageNum > 0 ) { ajaxBtn.button('reset'); }
					else { ajaxBtn.button('complete'); }

					// Update layout once posts have loaded
					setTimeout( function() {
						newPosts.removeClass('ajax-new init');
						if ( type == 'posts' ) {
							iframeAspect();
							postsPage();
							if ( mixt_opt.layout.type == 'masonry' ) {
								var $container = $('.blog-masonry .posts-container');
								$container.imagesLoaded( function() {
									$container.isotope('appended', newPosts);
								});
							}
							viewport.trigger('refresh');
						}
					}, 100);

					if ( pageType == 'ajax-scroll' ) { viewport.on('scroll', ajaxScrollHandle); }

					// Handle Errors
					if ( status == 'error' ) {
						ajaxBtn.button('error');
						// Debugging info
						// alert('AJAX Error: ' + xhr.status + ' ' + xhr.statusText );
					}
				});
			} else {
				ajaxBtn.button('complete');
			}
			
			return false;
		});

		// Trigger AJAX load when reaching bottom of page
		var ajaxScrollHandle = $.debounce( 500, function() {
				/* global elemVisible */
				if ( elemVisible(ajaxBtn, viewport) === true ) {
					ajaxBtn.trigger('cont:bottom');
				}
			});
		if ( pageType == 'ajax-scroll' ) {
			viewport.on('scroll', ajaxScrollHandle);
		}
	}
	// Execute Function Where Applicable
	if ( mixt_opt.page['posts-page'] && mixt_opt.layout['pagination-type'] == 'ajax-click' || mixt_opt.layout['pagination-type'] == 'ajax-scroll' ) {
		if ( mixt_opt.page['page-type'] == 'shop' ) {
			mixtAjaxLoad('shop');
		} else {
			mixtAjaxLoad('posts');
		}
	}
	if ( mixt_opt.page['page-type'] == 'single' && mixt_opt.layout['comment-pagination-type'] == 'ajax-click' || mixt_opt.layout['comment-pagination-type'] == 'ajax-scroll' ) {
		mixtAjaxLoad('comments');
	}


	// Keep post content above a minimum height to maintain readability
	function postContentMinWidth() {
		var minW = 320,
			postMinW = minW * 2,
			post = $('.single-content.has-columns'),
			cont = $('.entry-body', post);
		if ( cont.hasClass('col-sm-4') ) {
			postMinW = minW * 3;
		} else if ( cont.hasClass('col-sm-8') ) {
			postMinW = minW * 1.5;
		}
		if ( post.width() < postMinW ) {
			post.addClass('override-cols');
		} else {
			post.removeClass('override-cols');
		}
	}


	// Functions To Run On Window Resize
	function resizeFn() {
		iframeAspect();

		postContentMinWidth();
	}
	viewport.resize( $.debounce( 500, resizeFn ));


	// Functions To Run On Load
	viewport.load( function() {

		postsPage();

		postContentMinWidth();

		// Isotope Masonry Init
		if ( mixt_opt.layout.type == 'masonry' && typeof $.fn.isotope === 'function' ) {
			var blogCont = $('.blog-masonry .posts-container');

			blogCont.isotope({
				itemSelector: '.article',
				layout: 'masonry',
				gutter: 0
			});

			blogCont.imagesLoaded( function() { blogCont.isotope('layout'); });
			viewport.resize( $.debounce( 500, function() { blogCont.isotope('layout'); } ));
		}


		// Trigger Lightbox On Featured Image Click
		$('.lightbox-trigger').on('click', function() {
			$(this).siblings('.gallery').find('li').first().click();
		});


		// Related Posts Slider
		if ( typeof $.fn.lightSlider === 'function' ) {
			var relPostsSlider = $('.post-related .slider-cont'),
				type = relPostsSlider.data('type'),
				cols = relPostsSlider.data('cols'),
				tabletCols = relPostsSlider.data('tablet-cols'),
				mobileCols = relPostsSlider.data('mobile-cols');
			relPostsSlider.imagesLoaded( function() {
				relPostsSlider.lightSlider({
					item: cols,
					controls: (type == 'media'),
					pager: (type == 'text'),
					keyPress: true,
					slideMargin: 20,
					responsive: [{
						breakpoint: 1200,
						settings: { item: tabletCols }
					}, {
						breakpoint: 580,
						settings: { item: mobileCols }
					}],
					onSliderLoad: function() {
						relPostsSlider.removeClass('init');
						if ( typeof $.fn.matchHeight === 'function' ) {
							$('.post-feat', relPostsSlider).matchHeight();
							relPostsSlider.css('height', '');
						}
					}
				});
			});
		}
	});

})(jQuery);

/* ------------------------------------------------ /
UI FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global mixt_opt */

	var viewport = $(window),
		htmlEl   = $('html'),
		bodyEl   = $('body');


	// Spinner Input
	$('.mixt-spinner').on('click', '.btn', function() {
		var $el     = $(this),
			spinner = $el.parents('.mixt-spinner'),
			input   = spinner.children('.spinner-val'),
			step    = input.attr('step') || 1,
			minVal  = input.attr('min') || 0,
			maxVal  = input.attr('max') || null,
			val     = input.val(),
			newVal;
		if ( isNaN(val) ) val = minVal;
		
		if ( $el.hasClass('minus') ) {
			// Decrease
			newVal = parseFloat(val) - parseFloat(step);
			if ( newVal < minVal ) newVal = minVal;
			input.val(newVal);
		} else {
			// Increase
			newVal = parseFloat(val) + parseFloat(step);
			if ( maxVal !== null && newVal > maxVal ) newVal = maxVal;
			input.val(newVal);
		}
	});


	// Content Filtering
	$('.content-filter-links').children().click( function() {
		var link = $(this),
			filter = link.data('filter'),
			content = $('.' + link.parents('.content-filter-links').data('content')),
			filterClass = 'filter-hidden';
		link.addClass('active').siblings().removeClass('active');
		if ( filter == 'all' ) { content.find('.'+filterClass).removeClass(filterClass).slideDown(600); }
		else { content.find('.' + filter).removeClass(filterClass).slideDown(600).siblings(':not(.'+filter+')').addClass(filterClass).slideUp(600); }
	});


	// Sort portfolio items
	$('.portfolio-sorter a').click( function(event) {
		event.preventDefault();
		var elem = $(this),
			targetTag = elem.data('sort'),
			targetContainer = $('.posts-container');

		elem.parent().addClass('active').siblings().removeClass('active');

		// Remove animated class to prevent transition glitches
		targetContainer.find('.article.animated').removeClass('animated');

		if ( mixt_opt.layout.type == 'masonry' && typeof $.fn.isotope === 'function' ) {
			if (targetTag == 'all') {
				targetContainer.isotope({ filter: '*' });
			} else {
				targetContainer.isotope({ filter: '.' + targetTag });
			}
		} else {
			var projects = targetContainer.children('.portfolio');
			if ( targetTag == 'all' ) {
				projects.fadeIn(300).addClass('filtered');
			} else {
				projects.fadeOut(0).removeClass('filtered').filter('.' + targetTag).fadeIn(300).addClass('filtered');
			}
		}
	});


	// Offset scrolling to link anchor (hash)
	$('a[href^="#"]').on('click', function(e) {
		var link = $(this),
			hash = link.attr('href');

		if ( link.data('no-hash-scroll') || $(e.target).data('no-hash-scroll') || hash == '#' ) return true;

		if ( hash.length ) {
			e.preventDefault();
			var target = $(hash);
			if ( target.length) {
				var hashOffset = $(hash).offset().top + 1;
				if ( mixt_opt.nav.mode == 'fixed' && $('#main-nav').data('fixed') ) { hashOffset -= $('#main-nav').outerHeight(); }
				if ( mixt_opt.page['show-admin-bar'] && $('#wpadminbar').css('position') == 'fixed' ) { hashOffset -= $('#wpadminbar').height(); }
				htmlEl.add(bodyEl).animate({ scrollTop: hashOffset }, 600 );
			}
			history.replaceState({}, '', hash);
			return false;
		}
	});
	// Ignore specific anchors
	$('.tabs a, .vc_tta a, .ui-accordion a').data('no-hash-scroll', true);


	// Social Icons
	$('.social-links').not('.hover-none').each( function() {
		var cont = $(this);

		cont.children().each( function() {
			var icon = $(this),
				link = icon.children('a'),
				dataColor = link.attr('data-color');

			if ( cont.hasClass('hover-bg') || cont.parents('.no-hover-bg').length ) {
				link.hover( function() {
					link.css({ backgroundColor: dataColor, zIndex: 1 });
				}, function() { link.css({ backgroundColor: '', zIndex: '' }); });
			} else {
				link.hover( function() {
					link.css({ color: dataColor, zIndex: 1 });
				}, function() { link.css({ color: '', zIndex: '' }); });
			}
		});
	});
	

	// Element Animations
	function mixtAnimations() {
		var animElems = $('.mixt-animate');

		if ( animElems.length === 0 ) { return; }

		viewport.load( function() {
			animElems.each( function() {
				var $this = $(this),
					delay = $this.data('anim-delay') ? Math.abs(parseInt($this.data('anim-delay'))) : 0;
				if ( $this.hasClass('anim-on-view') && typeof $.fn.waypoint === 'function' ) {
					$this.waypoint( function() {	
						setTimeout( function() {
							$this.removeClass('anim-pre').addClass('anim-start');
						}, delay);
						if ( typeof this.destroy === 'function' ) this.destroy();
					}, {
						offset: '85%',
						triggerOnce: true
					});
				} else {
					setTimeout( function() {
						$this.removeClass('anim-pre').addClass('anim-start');
					}, delay);
				}
			});
		});
	}
	mixtAnimations();


	// On Hover Animations
	function animateHoverIn(elem) {
		elem.addClass('hovered');
		var inner   = elem.children('.on-hover'),
			animIn  = inner.data('anim-in') || 'fadeIn',
			animOut = inner.data('anim-out') || 'fadeOut';
		inner.removeClass(animOut).addClass('animated ' + animIn);
	}

	function animateHoverOut(elem) {
		elem.removeClass('hovered');
		var inner   = elem.children('.on-hover'),
			animIn  = inner.data('anim-in') || 'fadeIn',
			animOut = inner.data('anim-out') || 'fadeOut';
		inner.removeClass(animIn).addClass(animOut);
	}


	// Post Grid Responsive Columns
	function postGridColumns() {
		$('.vc_grid-container.responsive-cols').each( function() {
			var elem = $(this),
				classes = elem[0].className.match(/resp-(\w{2}-\d{1,2})/g);
			if ( classes !== null ) {
				var children = elem.find('.vc_grid-item');
				$(classes).each( function(index, val) {
					children.addClass(val.replace('resp-', 'col-'));
				});
			}
		});
	}


	// Functions run on page load and "refresh" event
	function runOnRefresh() {
		// Tooltips Init
		$('[data-toggle="tooltip"], .related-title-tip').tooltip({
			placement: 'auto',
			container: 'body'
		});

		// On Hover Animations Init
		var animHoverEl = $('.anim-on-hover');
		// On hoverIntent
		animHoverEl.hoverIntent( function() {
			animateHoverIn($(this));
		}, function() {
			animateHoverOut($(this));
		}, 50);
		// Handle Mobile Tap
		animHoverEl.on('touchend', function(e) {
			var $this = $(this);
			if ( ! $this.hasClass('hovered') ) {
				e.preventDefault();
				e.stopPropagation();
				animateHoverIn($this);
				animHoverEl.not($this).each( function() {
					animateHoverOut($(this));
				});
				return false;
			}
		});
		// Clear animation
		animHoverEl.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
			var elem = $(this);
			if ( ! elem.hasClass('hovered') ) {
				elem.children('.on-hover').removeClass('animated');
			}
		});
	}
	viewport.on('refresh', function() {
		runOnRefresh();
	}).trigger('refresh');

	$(document).ajaxStop( function() {
		runOnRefresh();

		postGridColumns();
	});


	// Back To Top Button
	var backToTop = $('#back-to-top');

	function backToTopDisplay() {
		var scrollTop = viewport.scrollTop();
		if ( scrollTop > 600 ) {
			backToTop.fadeIn(300);
		} else {
			backToTop.fadeOut(300);
		}
	}

	if ( backToTop.length ) {
		viewport.on('scroll', $.throttle( 1000, backToTopDisplay )).scroll();

		backToTop.click( function(e) {
			e.preventDefault();
			htmlEl.add(bodyEl).animate({ scrollTop: 0 }, 600);
		});
	}

	
	// Info Bar
	var infoBarWrap = $('#info-bar-wrap'),
		infoBar = infoBarWrap.children('.info-bar');

	function infoBarSticky() {
		var barHeight = infoBar.outerHeight();
		infoBarWrap.css('min-height', barHeight);
		if ( backToTop.length ) { backToTop.css('margin-bottom', barHeight); }
	}

	if ( infoBar.length ) {
		infoBar.find('.info-close').click( function() {
			infoBarWrap.fadeOut(300);
			if ( backToTop.length ) { backToTop.css('margin-bottom', ''); }
		});
		if ( infoBar.hasClass('sticky') ) { infoBarSticky(); }
	}

})(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiZmVhdGhlcmxpZ2h0LmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJqcXVlcnkucGxhY2Vob2xkZXIuanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pZQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlIC0gdjEuMSAtIDMvNy8yMDEwXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS1wbHVnaW4vXG4gKiBcbiAqIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hblxuICogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4gKi9cblxuLy8gU2NyaXB0OiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZTogU29tZXRpbWVzLCBsZXNzIGlzIG1vcmUhXG4vL1xuLy8gKlZlcnNpb246IDEuMSwgTGFzdCB1cGRhdGVkOiAzLzcvMjAxMCpcbi8vIFxuLy8gUHJvamVjdCBIb21lIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuLy8gR2l0SHViICAgICAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9cbi8vIFNvdXJjZSAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UuanNcbi8vIChNaW5pZmllZCkgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UubWluLmpzICgwLjdrYilcbi8vIFxuLy8gQWJvdXQ6IExpY2Vuc2Vcbi8vIFxuLy8gQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuLFxuLy8gRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4vLyBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4vLyBcbi8vIEFib3V0OiBFeGFtcGxlc1xuLy8gXG4vLyBUaGVzZSB3b3JraW5nIGV4YW1wbGVzLCBjb21wbGV0ZSB3aXRoIGZ1bGx5IGNvbW1lbnRlZCBjb2RlLCBpbGx1c3RyYXRlIGEgZmV3XG4vLyB3YXlzIGluIHdoaWNoIHRoaXMgcGx1Z2luIGNhbiBiZSB1c2VkLlxuLy8gXG4vLyBUaHJvdHRsZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvZXhhbXBsZXMvdGhyb3R0bGUvXG4vLyBEZWJvdW5jZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvZXhhbXBsZXMvZGVib3VuY2UvXG4vLyBcbi8vIEFib3V0OiBTdXBwb3J0IGFuZCBUZXN0aW5nXG4vLyBcbi8vIEluZm9ybWF0aW9uIGFib3V0IHdoYXQgdmVyc2lvbiBvciB2ZXJzaW9ucyBvZiBqUXVlcnkgdGhpcyBwbHVnaW4gaGFzIGJlZW5cbi8vIHRlc3RlZCB3aXRoLCB3aGF0IGJyb3dzZXJzIGl0IGhhcyBiZWVuIHRlc3RlZCBpbiwgYW5kIHdoZXJlIHRoZSB1bml0IHRlc3RzXG4vLyByZXNpZGUgKHNvIHlvdSBjYW4gdGVzdCBpdCB5b3Vyc2VsZikuXG4vLyBcbi8vIGpRdWVyeSBWZXJzaW9ucyAtIG5vbmUsIDEuMy4yLCAxLjQuMlxuLy8gQnJvd3NlcnMgVGVzdGVkIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi04LCBGaXJlZm94IDItMy42LCBTYWZhcmkgMy00LCBDaHJvbWUgNC01LCBPcGVyYSA5LjYtMTAuMS5cbi8vIFVuaXQgVGVzdHMgICAgICAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvdW5pdC9cbi8vIFxuLy8gQWJvdXQ6IFJlbGVhc2UgSGlzdG9yeVxuLy8gXG4vLyAxLjEgLSAoMy83LzIwMTApIEZpeGVkIGEgYnVnIGluIDxqUXVlcnkudGhyb3R0bGU+IHdoZXJlIHRyYWlsaW5nIGNhbGxiYWNrc1xuLy8gICAgICAgZXhlY3V0ZWQgbGF0ZXIgdGhhbiB0aGV5IHNob3VsZC4gUmV3b3JrZWQgYSBmYWlyIGFtb3VudCBvZiBpbnRlcm5hbFxuLy8gICAgICAgbG9naWMgYXMgd2VsbC5cbi8vIDEuMCAtICgzLzYvMjAxMCkgSW5pdGlhbCByZWxlYXNlIGFzIGEgc3RhbmQtYWxvbmUgcHJvamVjdC4gTWlncmF0ZWQgb3ZlclxuLy8gICAgICAgZnJvbSBqcXVlcnktbWlzYyByZXBvIHYwLjQgdG8ganF1ZXJ5LXRocm90dGxlIHJlcG8gdjEuMCwgYWRkZWQgdGhlXG4vLyAgICAgICBub190cmFpbGluZyB0aHJvdHRsZSBwYXJhbWV0ZXIgYW5kIGRlYm91bmNlIGZ1bmN0aW9uYWxpdHkuXG4vLyBcbi8vIFRvcGljOiBOb3RlIGZvciBub24talF1ZXJ5IHVzZXJzXG4vLyBcbi8vIGpRdWVyeSBpc24ndCBhY3R1YWxseSByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIGJlY2F1c2Ugbm90aGluZyBpbnRlcm5hbFxuLy8gdXNlcyBhbnkgalF1ZXJ5IG1ldGhvZHMgb3IgcHJvcGVydGllcy4galF1ZXJ5IGlzIGp1c3QgdXNlZCBhcyBhIG5hbWVzcGFjZVxuLy8gdW5kZXIgd2hpY2ggdGhlc2UgbWV0aG9kcyBjYW4gZXhpc3QuXG4vLyBcbi8vIFNpbmNlIGpRdWVyeSBpc24ndCBhY3R1YWxseSByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIGlmIGpRdWVyeSBkb2Vzbid0IGV4aXN0XG4vLyB3aGVuIHRoaXMgcGx1Z2luIGlzIGxvYWRlZCwgdGhlIG1ldGhvZCBkZXNjcmliZWQgYmVsb3cgd2lsbCBiZSBjcmVhdGVkIGluXG4vLyB0aGUgYENvd2JveWAgbmFtZXNwYWNlLiBVc2FnZSB3aWxsIGJlIGV4YWN0bHkgdGhlIHNhbWUsIGJ1dCBpbnN0ZWFkIG9mXG4vLyAkLm1ldGhvZCgpIG9yIGpRdWVyeS5tZXRob2QoKSwgeW91J2xsIG5lZWQgdG8gdXNlIENvd2JveS5tZXRob2QoKS5cblxuKGZ1bmN0aW9uKHdpbmRvdyx1bmRlZmluZWQpe1xuICAnJDpub211bmdlJzsgLy8gVXNlZCBieSBZVUkgY29tcHJlc3Nvci5cbiAgXG4gIC8vIFNpbmNlIGpRdWVyeSByZWFsbHkgaXNuJ3QgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCB1c2UgYGpRdWVyeWAgYXMgdGhlXG4gIC8vIG5hbWVzcGFjZSBvbmx5IGlmIGl0IGFscmVhZHkgZXhpc3RzLCBvdGhlcndpc2UgdXNlIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UsXG4gIC8vIGNyZWF0aW5nIGl0IGlmIG5lY2Vzc2FyeS5cbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5Db3dib3kgfHwgKCB3aW5kb3cuQ293Ym95ID0ge30gKSxcbiAgICBcbiAgICAvLyBJbnRlcm5hbCBtZXRob2QgcmVmZXJlbmNlLlxuICAgIGpxX3Rocm90dGxlO1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkudGhyb3R0bGVcbiAgLy8gXG4gIC8vIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICAvLyBleGVjdXRpb24gb2YgaGFuZGxlcnMgb24gZXZlbnRzIGxpa2UgcmVzaXplIGFuZCBzY3JvbGwuIElmIHlvdSB3YW50IHRvXG4gIC8vIHJhdGUtbGltaXQgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24gdG8gYSBzaW5nbGUgdGltZSwgc2VlIHRoZVxuICAvLyA8alF1ZXJ5LmRlYm91bmNlPiBtZXRob2QuXG4gIC8vIFxuICAvLyBJbiB0aGlzIHZpc3VhbGl6YXRpb24sIHwgaXMgYSB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbCBhbmQgWCBpcyB0aGUgYWN0dWFsXG4gIC8vIGNhbGxiYWNrIGV4ZWN1dGlvbjpcbiAgLy8gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQ6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gPiBcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyB0cnVlOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgICAgICAgICAgIFggICAgWCAgICBYICAgIFggICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciB0aHJvdHRsZWQgPSBqUXVlcnkudGhyb3R0bGUoIGRlbGF5LCBbIG5vX3RyYWlsaW5nLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCB0aHJvdHRsZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIG5vX3RyYWlsaW5nIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9fdHJhaWxpbmcgaXNcbiAgLy8gICAgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBvbmx5IGV4ZWN1dGUgZXZlcnkgYGRlbGF5YCBtaWxsaXNlY29uZHMgd2hpbGUgdGhlXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQuIElmIG5vX3RyYWlsaW5nIGlzIGZhbHNlIG9yXG4gIC8vICAgIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkIG9uZSBmaW5hbCB0aW1lIGFmdGVyIHRoZSBsYXN0XG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW5cbiAgLy8gICAgY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gIC8vICBjYWxsYmFjayAtIChGdW5jdGlvbikgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIHRocm90dGxlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAgLy8gXG4gIC8vIFJldHVybnM6XG4gIC8vIFxuICAvLyAgKEZ1bmN0aW9uKSBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAgXG4gICQudGhyb3R0bGUgPSBqcV90aHJvdHRsZSA9IGZ1bmN0aW9uKCBkZWxheSwgbm9fdHJhaWxpbmcsIGNhbGxiYWNrLCBkZWJvdW5jZV9tb2RlICkge1xuICAgIC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG4gICAgLy8gYGNhbGxiYWNrYCBpcyBleGVjdXRlZCBhdCB0aGUgcHJvcGVyIHRpbWVzIGluIGB0aHJvdHRsZWAgYW5kIGBlbmRgXG4gICAgLy8gZGVib3VuY2UgbW9kZXMuXG4gICAgdmFyIHRpbWVvdXRfaWQsXG4gICAgICBcbiAgICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGxhc3QgdGltZSBgY2FsbGJhY2tgIHdhcyBleGVjdXRlZC5cbiAgICAgIGxhc3RfZXhlYyA9IDA7XG4gICAgXG4gICAgLy8gYG5vX3RyYWlsaW5nYCBkZWZhdWx0cyB0byBmYWxzeS5cbiAgICBpZiAoIHR5cGVvZiBub190cmFpbGluZyAhPT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZGVib3VuY2VfbW9kZSA9IGNhbGxiYWNrO1xuICAgICAgY2FsbGJhY2sgPSBub190cmFpbGluZztcbiAgICAgIG5vX3RyYWlsaW5nID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG4gICAgLy8gZnVuY3Rpb25hbGl0eSBhbmQgd2hlbiBleGVjdXRlZCB3aWxsIGxpbWl0IHRoZSByYXRlIGF0IHdoaWNoIGBjYWxsYmFja2BcbiAgICAvLyBpcyBleGVjdXRlZC5cbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBlbGFwc2VkID0gK25ldyBEYXRlKCkgLSBsYXN0X2V4ZWMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBcbiAgICAgIC8vIEV4ZWN1dGUgYGNhbGxiYWNrYCBhbmQgdXBkYXRlIHRoZSBgbGFzdF9leGVjYCB0aW1lc3RhbXAuXG4gICAgICBmdW5jdGlvbiBleGVjKCkge1xuICAgICAgICBsYXN0X2V4ZWMgPSArbmV3IERhdGUoKTtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoIHRoYXQsIGFyZ3MgKTtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG4gICAgICAvLyB0byBhbGxvdyBmdXR1cmUgYGNhbGxiYWNrYCBleGVjdXRpb25zLlxuICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHRpbWVvdXRfaWQgPSB1bmRlZmluZWQ7XG4gICAgICB9O1xuICAgICAgXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgJiYgIXRpbWVvdXRfaWQgKSB7XG4gICAgICAgIC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuICAgICAgICAvLyBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG4gICAgICAgIGV4ZWMoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG4gICAgICB0aW1lb3V0X2lkICYmIGNsZWFyVGltZW91dCggdGltZW91dF9pZCApO1xuICAgICAgXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCAmJiBlbGFwc2VkID4gZGVsYXkgKSB7XG4gICAgICAgIC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuICAgICAgICAvLyBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIGlmICggbm9fdHJhaWxpbmcgIT09IHRydWUgKSB7XG4gICAgICAgIC8vIEluIHRyYWlsaW5nIHRocm90dGxlIG1vZGUsIHNpbmNlIGBkZWxheWAgdGltZSBoYXMgbm90IGJlZW5cbiAgICAgICAgLy8gZXhjZWVkZWQsIHNjaGVkdWxlIGBjYWxsYmFja2AgdG8gZXhlY3V0ZSBgZGVsYXlgIG1zIGFmdGVyIG1vc3RcbiAgICAgICAgLy8gcmVjZW50IGV4ZWN1dGlvbi5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuICAgICAgICAvLyBhZnRlciBgZGVsYXlgIG1zLlxuICAgICAgICAvLyBcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIGZhbHNlIChhdCBlbmQpLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvXG4gICAgICAgIC8vIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgdGltZW91dF9pZCA9IHNldFRpbWVvdXQoIGRlYm91bmNlX21vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCA/IGRlbGF5IC0gZWxhcHNlZCA6IGRlbGF5ICk7XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBTZXQgdGhlIGd1aWQgb2YgYHdyYXBwZXJgIGZ1bmN0aW9uIHRvIHRoZSBzYW1lIG9mIG9yaWdpbmFsIGNhbGxiYWNrLCBzb1xuICAgIC8vIGl0IGNhbiBiZSByZW1vdmVkIGluIGpRdWVyeSAxLjQrIC51bmJpbmQgb3IgLmRpZSBieSB1c2luZyB0aGUgb3JpZ2luYWxcbiAgICAvLyBjYWxsYmFjayBhcyBhIHJlZmVyZW5jZS5cbiAgICBpZiAoICQuZ3VpZCApIHtcbiAgICAgIHdyYXBwZXIuZ3VpZCA9IGNhbGxiYWNrLmd1aWQgPSBjYWxsYmFjay5ndWlkIHx8ICQuZ3VpZCsrO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gdGhlIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH07XG4gIFxuICAvLyBNZXRob2Q6IGpRdWVyeS5kZWJvdW5jZVxuICAvLyBcbiAgLy8gRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICAvLyBndWFyYW50ZWVzIHRoYXQgYSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGEgc2luZ2xlIHRpbWUsIGVpdGhlciBhdCB0aGVcbiAgLy8gdmVyeSBiZWdpbm5pbmcgb2YgYSBzZXJpZXMgb2YgY2FsbHMsIG9yIGF0IHRoZSB2ZXJ5IGVuZC4gSWYgeW91IHdhbnQgdG9cbiAgLy8gc2ltcGx5IHJhdGUtbGltaXQgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24sIHNlZSB0aGUgPGpRdWVyeS50aHJvdHRsZT5cbiAgLy8gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYXG4gIC8vID4gXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYXG4gIC8vIFxuICAvLyBVc2FnZTpcbiAgLy8gXG4gIC8vID4gdmFyIGRlYm91bmNlZCA9IGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKTtcbiAgLy8gPiBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGRlYm91bmNlZCApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcbiAgLy8gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICkgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcbiAgLy8gXG4gIC8vIEFyZ3VtZW50czpcbiAgLy8gXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XG4gIC8vICAgIGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICAvLyAgYXRfYmVnaW4gLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdF9iZWdpbiBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGBkZWxheWAgbWlsbGlzZWNvbmRzIGFmdGVyXG4gIC8vICAgIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdF9iZWdpbiBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIGJlXG4gIC8vICAgIGV4ZWN1dGVkIG9ubHkgYXQgdGhlIGZpcnN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlXG4gIC8vICAgIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gIC8vICBjYWxsYmFjayAtIChGdW5jdGlvbikgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIGRlYm91bmNlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAgLy8gXG4gIC8vIFJldHVybnM6XG4gIC8vIFxuICAvLyAgKEZ1bmN0aW9uKSBBIG5ldywgZGVib3VuY2VkLCBmdW5jdGlvbi5cbiAgXG4gICQuZGVib3VuY2UgPSBmdW5jdGlvbiggZGVsYXksIGF0X2JlZ2luLCBjYWxsYmFjayApIHtcbiAgICByZXR1cm4gY2FsbGJhY2sgPT09IHVuZGVmaW5lZFxuICAgICAgPyBqcV90aHJvdHRsZSggZGVsYXksIGF0X2JlZ2luLCBmYWxzZSApXG4gICAgICA6IGpxX3Rocm90dGxlKCBkZWxheSwgY2FsbGJhY2ssIGF0X2JlZ2luICE9PSBmYWxzZSApO1xuICB9O1xuICBcbn0pKHRoaXMpO1xuIiwiLyoqXG4gKiBGZWF0aGVybGlnaHQgLSB1bHRyYSBzbGltIGpRdWVyeSBsaWdodGJveFxuICogVmVyc2lvbiAxLjMuNCAtIGh0dHA6Ly9ub2VsYm9zcy5naXRodWIuaW8vZmVhdGhlcmxpZ2h0L1xuICpcbiAqIENvcHlyaWdodCAyMDE1LCBOb8OrbCBSYW91bCBCb3NzYXJ0IChodHRwOi8vd3d3Lm5vZWxib3NzLmNvbSlcbiAqIE1JVCBMaWNlbnNlZC5cbioqL1xuKGZ1bmN0aW9uKCQpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiAkKSB7XG5cdFx0aWYoJ2NvbnNvbGUnIGluIHdpbmRvdyl7IHdpbmRvdy5jb25zb2xlLmluZm8oJ1RvbyBtdWNoIGxpZ2h0bmVzcywgRmVhdGhlcmxpZ2h0IG5lZWRzIGpRdWVyeS4nKTsgfVxuXHRcdHJldHVybjtcblx0fVxuXG5cdC8qIEZlYXRoZXJsaWdodCBpcyBleHBvcnRlZCBhcyAkLmZlYXRoZXJsaWdodC5cblx0ICAgSXQgaXMgYSBmdW5jdGlvbiB1c2VkIHRvIG9wZW4gYSBmZWF0aGVybGlnaHQgbGlnaHRib3guXG5cblx0ICAgW3RlY2hdXG5cdCAgIEZlYXRoZXJsaWdodCB1c2VzIHByb3RvdHlwZSBpbmhlcml0YW5jZS5cblx0ICAgRWFjaCBvcGVuZWQgbGlnaHRib3ggd2lsbCBoYXZlIGEgY29ycmVzcG9uZGluZyBvYmplY3QuXG5cdCAgIFRoYXQgb2JqZWN0IG1heSBoYXZlIHNvbWUgYXR0cmlidXRlcyB0aGF0IG92ZXJyaWRlIHRoZVxuXHQgICBwcm90b3R5cGUncy5cblx0ICAgRXh0ZW5zaW9ucyBjcmVhdGVkIHdpdGggRmVhdGhlcmxpZ2h0LmV4dGVuZCB3aWxsIGhhdmUgdGhlaXJcblx0ICAgb3duIHByb3RvdHlwZSB0aGF0IGluaGVyaXRzIGZyb20gRmVhdGhlcmxpZ2h0J3MgcHJvdG90eXBlLFxuXHQgICB0aHVzIGF0dHJpYnV0ZXMgY2FuIGJlIG92ZXJyaWRlbiBlaXRoZXIgYXQgdGhlIG9iamVjdCBsZXZlbCxcblx0ICAgb3IgYXQgdGhlIGV4dGVuc2lvbiBsZXZlbC5cblx0ICAgVG8gY3JlYXRlIGNhbGxiYWNrcyB0aGF0IGNoYWluIHRoZW1zZWx2ZXMgaW5zdGVhZCBvZiBvdmVycmlkaW5nLFxuXHQgICB1c2UgY2hhaW5DYWxsYmFja3MuXG5cdCAgIEZvciB0aG9zZSBmYW1pbGlhciB3aXRoIENvZmZlZVNjcmlwdCwgdGhpcyBjb3JyZXNwb25kIHRvXG5cdCAgIEZlYXRoZXJsaWdodCBiZWluZyBhIGNsYXNzIGFuZCB0aGUgR2FsbGVyeSBiZWluZyBhIGNsYXNzXG5cdCAgIGV4dGVuZGluZyBGZWF0aGVybGlnaHQuXG5cdCAgIFRoZSBjaGFpbkNhbGxiYWNrcyBpcyB1c2VkIHNpbmNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvXG5cdCAgIENvZmZlZVNjcmlwdCdzIGBzdXBlcmAuXG5cdCovXG5cblx0ZnVuY3Rpb24gRmVhdGhlcmxpZ2h0KCRjb250ZW50LCBjb25maWcpIHtcblx0XHRpZih0aGlzIGluc3RhbmNlb2YgRmVhdGhlcmxpZ2h0KSB7ICAvKiBjYWxsZWQgd2l0aCBuZXcgKi9cblx0XHRcdHRoaXMuaWQgPSBGZWF0aGVybGlnaHQuaWQrKztcblx0XHRcdHRoaXMuc2V0dXAoJGNvbnRlbnQsIGNvbmZpZyk7XG5cdFx0XHR0aGlzLmNoYWluQ2FsbGJhY2tzKEZlYXRoZXJsaWdodC5fY2FsbGJhY2tDaGFpbik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBmbCA9IG5ldyBGZWF0aGVybGlnaHQoJGNvbnRlbnQsIGNvbmZpZyk7XG5cdFx0XHRmbC5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gZmw7XG5cdFx0fVxuXHR9XG5cblx0dmFyIG9wZW5lZCA9IFtdLFxuXHRcdHBydW5lT3BlbmVkID0gZnVuY3Rpb24ocmVtb3ZlKSB7XG5cdFx0XHRvcGVuZWQgPSAkLmdyZXAob3BlbmVkLCBmdW5jdGlvbihmbCkge1xuXHRcdFx0XHRyZXR1cm4gZmwgIT09IHJlbW92ZSAmJiBmbC4kaW5zdGFuY2UuY2xvc2VzdCgnYm9keScpLmxlbmd0aCA+IDA7XG5cdFx0XHR9ICk7XG5cdFx0XHRyZXR1cm4gb3BlbmVkO1xuXHRcdH07XG5cblx0Ly8gc3RydWN0dXJlKHtpZnJhbWVNaW5IZWlnaHQ6IDQ0LCBmb286IDB9LCAnaWZyYW1lJylcblx0Ly8gICAjPT4ge21pbi1oZWlnaHQ6IDQ0fVxuXHR2YXIgc3RydWN0dXJlID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcblx0XHR2YXIgcmVzdWx0ID0ge30sXG5cdFx0XHRyZWdleCA9IG5ldyBSZWdFeHAoJ14nICsgcHJlZml4ICsgJyhbQS1aXSkoLiopJyk7XG5cdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xuXHRcdFx0dmFyIG1hdGNoID0ga2V5Lm1hdGNoKHJlZ2V4KTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHR2YXIgZGFzaGVyaXplZCA9IChtYXRjaFsxXSArIG1hdGNoWzJdLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRyZXN1bHRbZGFzaGVyaXplZF0gPSBvYmpba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHQvKiBkb2N1bWVudCB3aWRlIGtleSBoYW5kbGVyICovXG5cdHZhciBldmVudE1hcCA9IHsga2V5dXA6ICdvbktleVVwJywgcmVzaXplOiAnb25SZXNpemUnIH07XG5cblx0dmFyIGdsb2JhbEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0JC5lYWNoKEZlYXRoZXJsaWdodC5vcGVuZWQoKS5yZXZlcnNlKCksIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuXHRcdFx0XHRpZiAoZmFsc2UgPT09IHRoaXNbZXZlbnRNYXBbZXZlbnQudHlwZV1dKGV2ZW50KSkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyByZXR1cm4gZmFsc2U7XG5cdFx0XHQgIH1cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHR2YXIgdG9nZ2xlR2xvYmFsRXZlbnRzID0gZnVuY3Rpb24oc2V0KSB7XG5cdFx0XHRpZihzZXQgIT09IEZlYXRoZXJsaWdodC5fZ2xvYmFsSGFuZGxlckluc3RhbGxlZCkge1xuXHRcdFx0XHRGZWF0aGVybGlnaHQuX2dsb2JhbEhhbmRsZXJJbnN0YWxsZWQgPSBzZXQ7XG5cdFx0XHRcdHZhciBldmVudHMgPSAkLm1hcChldmVudE1hcCwgZnVuY3Rpb24oXywgbmFtZSkgeyByZXR1cm4gbmFtZSsnLicrRmVhdGhlcmxpZ2h0LnByb3RvdHlwZS5uYW1lc3BhY2U7IH0gKS5qb2luKCcgJyk7XG5cdFx0XHRcdCQod2luZG93KVtzZXQgPyAnb24nIDogJ29mZiddKGV2ZW50cywgZ2xvYmFsRXZlbnRIYW5kbGVyKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdEZlYXRoZXJsaWdodC5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IEZlYXRoZXJsaWdodCxcblx0XHQvKioqIGRlZmF1bHRzICoqKi9cblx0XHQvKiBleHRlbmQgZmVhdGhlcmxpZ2h0IHdpdGggZGVmYXVsdHMgYW5kIG1ldGhvZHMgKi9cblx0XHRuYW1lc3BhY2U6ICAgICdmZWF0aGVybGlnaHQnLCAgICAgICAgIC8qIE5hbWUgb2YgdGhlIGV2ZW50cyBhbmQgY3NzIGNsYXNzIHByZWZpeCAqL1xuXHRcdHRhcmdldEF0dHI6ICAgJ2RhdGEtZmVhdGhlcmxpZ2h0JywgICAgLyogQXR0cmlidXRlIG9mIHRoZSB0cmlnZ2VyZWQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBzZWxlY3RvciB0byB0aGUgbGlnaHRib3ggY29udGVudCAqL1xuXHRcdHZhcmlhbnQ6ICAgICAgbnVsbCwgICAgICAgICAgICAgICAgICAgLyogQ2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIGNoYW5nZSBsb29rIG9mIHRoZSBsaWdodGJveCAqL1xuXHRcdHJlc2V0Q3NzOiAgICAgZmFsc2UsICAgICAgICAgICAgICAgICAgLyogUmVzZXQgYWxsIGNzcyAqL1xuXHRcdGJhY2tncm91bmQ6ICAgbnVsbCwgICAgICAgICAgICAgICAgICAgLyogQ3VzdG9tIERPTSBmb3IgdGhlIGJhY2tncm91bmQsIHdyYXBwZXIgYW5kIHRoZSBjbG9zZWJ1dHRvbiAqL1xuXHRcdG9wZW5UcmlnZ2VyOiAgJ2NsaWNrJywgICAgICAgICAgICAgICAgLyogRXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgbGlnaHRib3ggKi9cblx0XHRjbG9zZVRyaWdnZXI6ICdjbGljaycsICAgICAgICAgICAgICAgIC8qIEV2ZW50IHRoYXQgdHJpZ2dlcnMgdGhlIGNsb3Npbmcgb2YgdGhlIGxpZ2h0Ym94ICovXG5cdFx0ZmlsdGVyOiAgICAgICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBTZWxlY3RvciB0byBmaWx0ZXIgZXZlbnRzLiBUaGluayAkKC4uLikub24oJ2NsaWNrJywgZmlsdGVyLCBldmVudEhhbmRsZXIpICovXG5cdFx0cm9vdDogICAgICAgICAnYm9keScsICAgICAgICAgICAgICAgICAvKiBXaGVyZSB0byBhcHBlbmQgZmVhdGhlcmxpZ2h0cyAqL1xuXHRcdG9wZW5TcGVlZDogICAgMjUwLCAgICAgICAgICAgICAgICAgICAgLyogRHVyYXRpb24gb2Ygb3BlbmluZyBhbmltYXRpb24gKi9cblx0XHRjbG9zZVNwZWVkOiAgIDI1MCwgICAgICAgICAgICAgICAgICAgIC8qIER1cmF0aW9uIG9mIGNsb3NpbmcgYW5pbWF0aW9uICovXG5cdFx0Y2xvc2VPbkNsaWNrOiAnYmFja2dyb3VuZCcsICAgICAgICAgICAvKiBDbG9zZSBsaWdodGJveCBvbiBjbGljayAoJ2JhY2tncm91bmQnLCAnYW55d2hlcmUnIG9yIGZhbHNlKSAqL1xuXHRcdGNsb3NlT25Fc2M6ICAgdHJ1ZSwgICAgICAgICAgICAgICAgICAgLyogQ2xvc2UgbGlnaHRib3ggd2hlbiBwcmVzc2luZyBlc2MgKi9cblx0XHRjbG9zZUljb246ICAgICcmIzEwMDA1OycsICAgICAgICAgICAgIC8qIENsb3NlIGljb24gKi9cblx0XHRsb2FkaW5nOiAgICAgICcnLCAgICAgICAgICAgICAgICAgICAgIC8qIENvbnRlbnQgdG8gc2hvdyB3aGlsZSBpbml0aWFsIGNvbnRlbnQgaXMgbG9hZGluZyAqL1xuXHRcdHBlcnNpc3Q6ICAgICAgZmFsc2UsXHRcdFx0XHRcdFx0XHRcdFx0LyogSWYgc2V0LCB0aGUgY29udGVudCBwZXJzaXN0IGFuZCB3aWxsIGJlIHNob3duIGFnYWluIHdoZW4gb3BlbmVkIGFnYWluLiAnc2hhcmVkJyBpcyBhIHNwZWNpYWwgdmFsdWUgd2hlbiBiaW5kaW5nIG11bHRpcGxlIGVsZW1lbnRzIGZvciB0aGVtIHRvIHNoYXJlIHRoZSBzYW1lIGNvbnRlbnQgKi9cblx0XHRvdGhlckNsb3NlOiAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIFNlbGVjdG9yIGZvciBhbHRlcm5hdGUgY2xvc2UgYnV0dG9ucyAoZS5nLiBcImEuY2xvc2VcIikgKi9cblx0XHRiZWZvcmVPcGVuOiAgICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBiZWZvcmUgb3Blbi4gY2FuIHJldHVybiBmYWxzZSB0byBwcmV2ZW50IG9wZW5pbmcgb2YgbGlnaHRib3guIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXG5cdFx0YmVmb3JlQ29udGVudDogJC5ub29wLCAgICAgICAgICAgICAgICAvKiBDYWxsZWQgd2hlbiBjb250ZW50IGlzIGxvYWRlZC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cblx0XHRiZWZvcmVDbG9zZTogICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBiZWZvcmUgY2xvc2UuIGNhbiByZXR1cm4gZmFsc2UgdG8gcHJldmVudCBvcGVuaW5nIG9mIGxpZ2h0Ym94LiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xuXHRcdGFmdGVyT3BlbjogICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIG9wZW4uIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXG5cdFx0YWZ0ZXJDb250ZW50OiAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYWZ0ZXIgY29udGVudCBpcyByZWFkeSBhbmQgaGFzIGJlZW4gc2V0LiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xuXHRcdGFmdGVyQ2xvc2U6ICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIGNsb3NlLiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xuXHRcdG9uS2V5VXA6ICAgICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIG9uIGtleSBkb3duIGZvciB0aGUgZnJvbnRtb3N0IGZlYXRoZXJsaWdodCAqL1xuXHRcdG9uUmVzaXplOiAgICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIG5ldyBjb250ZW50IGFuZCB3aGVuIGEgd2luZG93IGlzIHJlc2l6ZWQgKi9cblx0XHR0eXBlOiAgICAgICAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIFNwZWNpZnkgdHlwZSBvZiBsaWdodGJveC4gSWYgdW5zZXQsIGl0IHdpbGwgY2hlY2sgZm9yIHRoZSB0YXJnZXRBdHRycyB2YWx1ZS4gKi9cblx0XHRjb250ZW50RmlsdGVyczogWydqcXVlcnknLCAnaW1hZ2UnLCAnaHRtbCcsICdhamF4JywgJ2lmcmFtZScsICd0ZXh0J10sIC8qIExpc3Qgb2YgY29udGVudCBmaWx0ZXJzIHRvIHVzZSB0byBkZXRlcm1pbmUgdGhlIGNvbnRlbnQgKi9cblxuXHRcdC8qKiogbWV0aG9kcyAqKiovXG5cdFx0Lyogc2V0dXAgaXRlcmF0ZXMgb3ZlciBhIHNpbmdsZSBpbnN0YW5jZSBvZiBmZWF0aGVybGlnaHQgYW5kIHByZXBhcmVzIHRoZSBiYWNrZ3JvdW5kIGFuZCBiaW5kcyB0aGUgZXZlbnRzICovXG5cdFx0c2V0dXA6IGZ1bmN0aW9uKHRhcmdldCwgY29uZmlnKXtcblx0XHRcdC8qIGFsbCBhcmd1bWVudHMgYXJlIG9wdGlvbmFsICovXG5cdFx0XHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0IGluc3RhbmNlb2YgJCA9PT0gZmFsc2UgJiYgIWNvbmZpZykge1xuXHRcdFx0XHRjb25maWcgPSB0YXJnZXQ7XG5cdFx0XHRcdHRhcmdldCA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHNlbGYgPSAkLmV4dGVuZCh0aGlzLCBjb25maWcsIHt0YXJnZXQ6IHRhcmdldH0pLFxuXHRcdFx0XHRjc3MgPSAhc2VsZi5yZXNldENzcyA/IHNlbGYubmFtZXNwYWNlIDogc2VsZi5uYW1lc3BhY2UrJy1yZXNldCcsIC8qIGJ5IGFkZGluZyAtcmVzZXQgdG8gdGhlIGNsYXNzbmFtZSwgd2UgcmVzZXQgYWxsIHRoZSBkZWZhdWx0IGNzcyAqL1xuXHRcdFx0XHQkYmFja2dyb3VuZCA9ICQoc2VsZi5iYWNrZ3JvdW5kIHx8IFtcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicrY3NzKyctbG9hZGluZyAnK2NzcysnXCI+Jyxcblx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiJytjc3MrJy1jb250ZW50XCI+Jyxcblx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiJytjc3MrJy1jbG9zZS1pY29uICcrIHNlbGYubmFtZXNwYWNlICsgJy1jbG9zZVwiPicsXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jbG9zZUljb24sXG5cdFx0XHRcdFx0XHRcdCc8L3NwYW4+Jyxcblx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCInK3NlbGYubmFtZXNwYWNlKyctaW5uZXJcIj4nICsgc2VsZi5sb2FkaW5nICsgJzwvZGl2PicsXG5cdFx0XHRcdFx0XHQnPC9kaXY+Jyxcblx0XHRcdFx0XHQnPC9kaXY+J10uam9pbignJykpLFxuXHRcdFx0XHRjbG9zZUJ1dHRvblNlbGVjdG9yID0gJy4nK3NlbGYubmFtZXNwYWNlKyctY2xvc2UnICsgKHNlbGYub3RoZXJDbG9zZSA/ICcsJyArIHNlbGYub3RoZXJDbG9zZSA6ICcnKTtcblxuXHRcdFx0c2VsZi4kaW5zdGFuY2UgPSAkYmFja2dyb3VuZC5jbG9uZSgpLmFkZENsYXNzKHNlbGYudmFyaWFudCk7IC8qIGNsb25lIERPTSBmb3IgdGhlIGJhY2tncm91bmQsIHdyYXBwZXIgYW5kIHRoZSBjbG9zZSBidXR0b24gKi9cblxuXHRcdFx0LyogY2xvc2Ugd2hlbiBjbGljayBvbiBiYWNrZ3JvdW5kL2FueXdoZXJlL251bGwgb3IgY2xvc2Vib3ggKi9cblx0XHRcdHNlbGYuJGluc3RhbmNlLm9uKHNlbGYuY2xvc2VUcmlnZ2VyKycuJytzZWxmLm5hbWVzcGFjZSwgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0dmFyICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cdFx0XHRcdGlmKCAoJ2JhY2tncm91bmQnID09PSBzZWxmLmNsb3NlT25DbGljayAgJiYgJHRhcmdldC5pcygnLicrc2VsZi5uYW1lc3BhY2UpKVxuXHRcdFx0XHRcdHx8ICdhbnl3aGVyZScgPT09IHNlbGYuY2xvc2VPbkNsaWNrXG5cdFx0XHRcdFx0fHwgJHRhcmdldC5jbG9zZXN0KGNsb3NlQnV0dG9uU2VsZWN0b3IpLmxlbmd0aCApe1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdC8qIHRoaXMgbWV0aG9kIHByZXBhcmVzIHRoZSBjb250ZW50IGFuZCBjb252ZXJ0cyBpdCBpbnRvIGEgalF1ZXJ5IG9iamVjdCBvciBhIHByb21pc2UgKi9cblx0XHRnZXRDb250ZW50OiBmdW5jdGlvbigpe1xuXHRcdFx0aWYodGhpcy5wZXJzaXN0ICE9PSBmYWxzZSAmJiB0aGlzLiRjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiRjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRmaWx0ZXJzID0gdGhpcy5jb25zdHJ1Y3Rvci5jb250ZW50RmlsdGVycyxcblx0XHRcdFx0cmVhZFRhcmdldEF0dHIgPSBmdW5jdGlvbihuYW1lKXsgcmV0dXJuIHNlbGYuJGN1cnJlbnRUYXJnZXQgJiYgc2VsZi4kY3VycmVudFRhcmdldC5hdHRyKG5hbWUpOyB9LFxuXHRcdFx0XHR0YXJnZXRWYWx1ZSA9IHJlYWRUYXJnZXRBdHRyKHNlbGYudGFyZ2V0QXR0ciksXG5cdFx0XHRcdGRhdGEgPSBzZWxmLnRhcmdldCB8fCB0YXJnZXRWYWx1ZSB8fCAnJztcblxuXHRcdFx0LyogRmluZCB3aGljaCBmaWx0ZXIgYXBwbGllcyAqL1xuXHRcdFx0dmFyIGZpbHRlciA9IGZpbHRlcnNbc2VsZi50eXBlXTsgLyogY2hlY2sgZXhwbGljaXQgdHlwZSBsaWtlIHt0eXBlOiAnaW1hZ2UnfSAqL1xuXG5cdFx0XHQvKiBjaGVjayBleHBsaWNpdCB0eXBlIGxpa2UgZGF0YS1mZWF0aGVybGlnaHQ9XCJpbWFnZVwiICovXG5cdFx0XHRpZighZmlsdGVyICYmIGRhdGEgaW4gZmlsdGVycykge1xuXHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW2RhdGFdO1xuXHRcdFx0XHRkYXRhID0gc2VsZi50YXJnZXQgJiYgdGFyZ2V0VmFsdWU7XG5cdFx0XHR9XG5cdFx0XHRkYXRhID0gZGF0YSB8fCByZWFkVGFyZ2V0QXR0cignaHJlZicpIHx8ICcnO1xuXG5cdFx0XHQvKiBjaGVjayBleHBsaWNpdHkgdHlwZSAmIGNvbnRlbnQgbGlrZSB7aW1hZ2U6ICdwaG90by5qcGcnfSAqL1xuXHRcdFx0aWYoIWZpbHRlcikge1xuXHRcdFx0XHRmb3IodmFyIGZpbHRlck5hbWUgaW4gZmlsdGVycykge1xuXHRcdFx0XHRcdGlmKHNlbGZbZmlsdGVyTmFtZV0pIHtcblx0XHRcdFx0XHRcdGZpbHRlciA9IGZpbHRlcnNbZmlsdGVyTmFtZV07XG5cdFx0XHRcdFx0XHRkYXRhID0gc2VsZltmaWx0ZXJOYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Lyogb3RoZXJ3aXNlIGl0J3MgaW1wbGljaXQsIHJ1biBjaGVja3MgKi9cblx0XHRcdGlmKCFmaWx0ZXIpIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IGRhdGE7XG5cdFx0XHRcdGRhdGEgPSBudWxsO1xuXHRcdFx0XHQkLmVhY2goc2VsZi5jb250ZW50RmlsdGVycywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyc1t0aGlzXTtcblx0XHRcdFx0XHRpZihmaWx0ZXIudGVzdCkgIHtcblx0XHRcdFx0XHRcdGRhdGEgPSBmaWx0ZXIudGVzdCh0YXJnZXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZighZGF0YSAmJiBmaWx0ZXIucmVnZXggJiYgdGFyZ2V0Lm1hdGNoICYmIHRhcmdldC5tYXRjaChmaWx0ZXIucmVnZXgpKSB7XG5cdFx0XHRcdFx0XHRkYXRhID0gdGFyZ2V0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gIWRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZighZGF0YSkge1xuXHRcdFx0XHRcdGlmKCdjb25zb2xlJyBpbiB3aW5kb3cpeyB3aW5kb3cuY29uc29sZS5lcnJvcignRmVhdGhlcmxpZ2h0OiBubyBjb250ZW50IGZpbHRlciBmb3VuZCAnICsgKHRhcmdldCA/ICcgZm9yIFwiJyArIHRhcmdldCArICdcIicgOiAnIChubyB0YXJnZXQgc3BlY2lmaWVkKScpKTsgfVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0LyogUHJvY2VzcyBpdCAqL1xuXHRcdFx0cmV0dXJuIGZpbHRlci5wcm9jZXNzLmNhbGwoc2VsZiwgZGF0YSk7XG5cdFx0fSxcblxuXHRcdC8qIHNldHMgdGhlIGNvbnRlbnQgb2YgJGluc3RhbmNlIHRvICRjb250ZW50ICovXG5cdFx0c2V0Q29udGVudDogZnVuY3Rpb24oJGNvbnRlbnQpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0Lyogd2UgbmVlZCBhIHNwZWNpYWwgY2xhc3MgZm9yIHRoZSBpZnJhbWUgKi9cblx0XHRcdGlmKCRjb250ZW50LmlzKCdpZnJhbWUnKSB8fCAkKCdpZnJhbWUnLCAkY29udGVudCkubGVuZ3RoID4gMCl7XG5cdFx0XHRcdHNlbGYuJGluc3RhbmNlLmFkZENsYXNzKHNlbGYubmFtZXNwYWNlKyctaWZyYW1lJyk7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYuJGluc3RhbmNlLnJlbW92ZUNsYXNzKHNlbGYubmFtZXNwYWNlKyctbG9hZGluZycpO1xuXG5cdFx0XHQvKiByZXBsYWNlIGNvbnRlbnQgYnkgYXBwZW5kaW5nIHRvIGV4aXN0aW5nIG9uZSBiZWZvcmUgaXQgaXMgcmVtb3ZlZFxuXHRcdFx0ICAgdGhpcyBpbnN1cmVzIHRoYXQgZmVhdGhlcmxpZ2h0LWlubmVyIHJlbWFpbiBhdCB0aGUgc2FtZSByZWxhdGl2ZVxuXHRcdFx0XHQgcG9zaXRpb24gdG8gYW55IG90aGVyIGl0ZW1zIGFkZGVkIHRvIGZlYXRoZXJsaWdodC1jb250ZW50ICovXG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5maW5kKCcuJytzZWxmLm5hbWVzcGFjZSsnLWlubmVyJylcblx0XHRcdFx0Lm5vdCgkY29udGVudCkgICAgICAgICAgICAgICAgLyogZXhjbHVkZWQgbmV3IGNvbnRlbnQsIGltcG9ydGFudCBpZiBwZXJzaXN0ZWQgKi9cblx0XHRcdFx0LnNsaWNlKDEpLnJlbW92ZSgpLmVuZCgpXHRcdFx0LyogSW4gdGhlIHVuZXhwZWN0ZWQgZXZlbnQgd2hlcmUgdGhlcmUgYXJlIG1hbnkgaW5uZXIgZWxlbWVudHMsIHJlbW92ZSBhbGwgYnV0IHRoZSBmaXJzdCBvbmUgKi9cblx0XHRcdFx0LnJlcGxhY2VXaXRoKCQuY29udGFpbnMoc2VsZi4kaW5zdGFuY2VbMF0sICRjb250ZW50WzBdKSA/ICcnIDogJGNvbnRlbnQpO1xuXG5cdFx0XHRzZWxmLiRjb250ZW50ID0gJGNvbnRlbnQuYWRkQ2xhc3Moc2VsZi5uYW1lc3BhY2UrJy1pbm5lcicpO1xuXG5cdFx0XHRyZXR1cm4gc2VsZjtcblx0XHR9LFxuXG5cdFx0Lyogb3BlbnMgdGhlIGxpZ2h0Ym94LiBcInRoaXNcIiBjb250YWlucyAkaW5zdGFuY2Ugd2l0aCB0aGUgbGlnaHRib3gsIGFuZCB3aXRoIHRoZSBjb25maWcuXG5cdFx0XHRSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIGFmdGVyIGlzIHN1Y2Nlc3NmdWxseSBvcGVuZWQuICovXG5cdFx0b3BlbjogZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0c2VsZi4kaW5zdGFuY2UuaGlkZSgpLmFwcGVuZFRvKHNlbGYucm9vdCk7XG5cdFx0XHRpZigoIWV2ZW50IHx8ICFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSlcblx0XHRcdFx0JiYgc2VsZi5iZWZvcmVPcGVuKGV2ZW50KSAhPT0gZmFsc2UpIHtcblxuXHRcdFx0XHRpZihldmVudCl7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgJGNvbnRlbnQgPSBzZWxmLmdldENvbnRlbnQoKTtcblxuXHRcdFx0XHRpZigkY29udGVudCkge1xuXHRcdFx0XHRcdG9wZW5lZC5wdXNoKHNlbGYpO1xuXG5cdFx0XHRcdFx0dG9nZ2xlR2xvYmFsRXZlbnRzKHRydWUpO1xuXG5cdFx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuZmFkZUluKHNlbGYub3BlblNwZWVkKTtcblx0XHRcdFx0XHRzZWxmLmJlZm9yZUNvbnRlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdFx0LyogU2V0IGNvbnRlbnQgYW5kIHNob3cgKi9cblx0XHRcdFx0XHRyZXR1cm4gJC53aGVuKCRjb250ZW50KVxuXHRcdFx0XHRcdFx0LmFsd2F5cyhmdW5jdGlvbigkY29udGVudCl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc2V0Q29udGVudCgkY29udGVudCk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuYWZ0ZXJDb250ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGhlbihzZWxmLiRpbnN0YW5jZS5wcm9taXNlKCkpXG5cdFx0XHRcdFx0XHQvKiBDYWxsIGFmdGVyT3BlbiBhZnRlciBmYWRlSW4gaXMgZG9uZSAqL1xuXHRcdFx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oKXsgc2VsZi5hZnRlck9wZW4oZXZlbnQpOyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0c2VsZi4kaW5zdGFuY2UuZGV0YWNoKCk7XG5cdFx0XHRyZXR1cm4gJC5EZWZlcnJlZCgpLnJlamVjdCgpLnByb21pc2UoKTtcblx0XHR9LFxuXG5cdFx0LyogY2xvc2VzIHRoZSBsaWdodGJveC4gXCJ0aGlzXCIgY29udGFpbnMgJGluc3RhbmNlIHdpdGggdGhlIGxpZ2h0Ym94LCBhbmQgd2l0aCB0aGUgY29uZmlnXG5cdFx0XHRyZXR1cm5zIGEgcHJvbWlzZSwgcmVzb2x2ZWQgYWZ0ZXIgdGhlIGxpZ2h0Ym94IGlzIHN1Y2Nlc3NmdWxseSBjbG9zZWQuICovXG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0ZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cblx0XHRcdGlmKHNlbGYuYmVmb3JlQ2xvc2UoZXZlbnQpID09PSBmYWxzZSkge1xuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKDAgPT09IHBydW5lT3BlbmVkKHNlbGYpLmxlbmd0aCkge1xuXHRcdFx0XHRcdHRvZ2dsZUdsb2JhbEV2ZW50cyhmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZWxmLiRpbnN0YW5jZS5mYWRlT3V0KHNlbGYuY2xvc2VTcGVlZCxmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHNlbGYuJGluc3RhbmNlLmRldGFjaCgpO1xuXHRcdFx0XHRcdHNlbGYuYWZ0ZXJDbG9zZShldmVudCk7XG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdFx0fSxcblxuXHRcdC8qIFV0aWxpdHkgZnVuY3Rpb24gdG8gY2hhaW4gY2FsbGJhY2tzXG5cdFx0ICAgW1dhcm5pbmc6IGd1cnUtbGV2ZWxdXG5cdFx0ICAgVXNlZCBiZSBleHRlbnNpb25zIHRoYXQgd2FudCB0byBsZXQgdXNlcnMgc3BlY2lmeSBjYWxsYmFja3MgYnV0XG5cdFx0ICAgYWxzbyBuZWVkIHRoZW1zZWx2ZXMgdG8gdXNlIHRoZSBjYWxsYmFja3MuXG5cdFx0ICAgVGhlIGFyZ3VtZW50ICdjaGFpbicgaGFzIGNhbGxiYWNrIG5hbWVzIGFzIGtleXMgYW5kIGZ1bmN0aW9uKHN1cGVyLCBldmVudClcblx0XHQgICBhcyB2YWx1ZXMuIFRoYXQgZnVuY3Rpb24gaXMgbWVhbnQgdG8gY2FsbCBgc3VwZXJgIGF0IHNvbWUgcG9pbnQuXG5cdFx0Ki9cblx0XHRjaGFpbkNhbGxiYWNrczogZnVuY3Rpb24oY2hhaW4pIHtcblx0XHRcdGZvciAodmFyIG5hbWUgaW4gY2hhaW4pIHtcblx0XHRcdFx0dGhpc1tuYW1lXSA9ICQucHJveHkoY2hhaW5bbmFtZV0sIHRoaXMsICQucHJveHkodGhpc1tuYW1lXSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZChGZWF0aGVybGlnaHQsIHtcblx0XHRpZDogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBVc2VkIHRvIGlkIHNpbmdsZSBmZWF0aGVybGlnaHQgaW5zdGFuY2VzICovXG5cdFx0YXV0b0JpbmQ6ICAgICAgICdbZGF0YS1mZWF0aGVybGlnaHRdJywgICAgLyogV2lsbCBhdXRvbWF0aWNhbGx5IGJpbmQgZWxlbWVudHMgbWF0Y2hpbmcgdGhpcyBzZWxlY3Rvci4gQ2xlYXIgb3Igc2V0IGJlZm9yZSBvblJlYWR5ICovXG5cdFx0ZGVmYXVsdHM6ICAgICAgIEZlYXRoZXJsaWdodC5wcm90b3R5cGUsICAgLyogWW91IGNhbiBhY2Nlc3MgYW5kIG92ZXJyaWRlIGFsbCBkZWZhdWx0cyB1c2luZyAkLmZlYXRoZXJsaWdodC5kZWZhdWx0cywgd2hpY2ggaXMganVzdCBhIHN5bm9ueW0gZm9yICQuZmVhdGhlcmxpZ2h0LnByb3RvdHlwZSAqL1xuXHRcdC8qIENvbnRhaW5zIHRoZSBsb2dpYyB0byBkZXRlcm1pbmUgY29udGVudCAqL1xuXHRcdGNvbnRlbnRGaWx0ZXJzOiB7XG5cdFx0XHRqcXVlcnk6IHtcblx0XHRcdFx0cmVnZXg6IC9eWyMuXVxcdy8sICAgICAgICAgLyogQW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCBhIGNsYXNzIG5hbWUgb3IgaWRlbnRpZmllcnMgKi9cblx0XHRcdFx0dGVzdDogZnVuY3Rpb24oZWxlbSkgICAgeyByZXR1cm4gZWxlbSBpbnN0YW5jZW9mICQgJiYgZWxlbTsgfSxcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24oZWxlbSkgeyByZXR1cm4gdGhpcy5wZXJzaXN0ICE9PSBmYWxzZSA/ICQoZWxlbSkgOiAkKGVsZW0pLmNsb25lKHRydWUpOyB9XG5cdFx0XHR9LFxuXHRcdFx0aW1hZ2U6IHtcblx0XHRcdFx0cmVnZXg6IC9cXC4ocG5nfGpwZ3xqcGVnfGdpZnx0aWZmfGJtcHxzdmcpKFxcP1xcUyopPyQvaSxcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odXJsKSAge1xuXHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0XHRcdGRlZmVycmVkID0gJC5EZWZlcnJlZCgpLFxuXHRcdFx0XHRcdFx0aW1nID0gbmV3IEltYWdlKCksXG5cdFx0XHRcdFx0XHQkaW1nID0gJCgnPGltZyBzcmM9XCInK3VybCsnXCIgYWx0PVwiXCIgY2xhc3M9XCInK3NlbGYubmFtZXNwYWNlKyctaW1hZ2VcIiAvPicpO1xuXHRcdFx0XHRcdGltZy5vbmxvYWQgID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBTdG9yZSBuYXR1cmFsV2lkdGggJiBoZWlnaHQgZm9yIElFOCAqL1xuXHRcdFx0XHRcdFx0JGltZy5uYXR1cmFsV2lkdGggPSBpbWcud2lkdGg7ICRpbWcubmF0dXJhbEhlaWdodCA9IGltZy5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKCAkaW1nICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpbWcub25lcnJvciA9IGZ1bmN0aW9uKCkgeyBkZWZlcnJlZC5yZWplY3QoJGltZyk7IH07XG5cdFx0XHRcdFx0aW1nLnNyYyA9IHVybDtcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aHRtbDoge1xuXHRcdFx0XHRyZWdleDogL15cXHMqPFtcXHchXVtePF0qPi8sIC8qIEFueXRoaW5nIHRoYXQgc3RhcnRzIHdpdGggc29tZSBraW5kIG9mIHZhbGlkIHRhZyAqL1xuXHRcdFx0XHRwcm9jZXNzOiBmdW5jdGlvbihodG1sKSB7IHJldHVybiAkKGh0bWwpOyB9XG5cdFx0XHR9LFxuXHRcdFx0YWpheDoge1xuXHRcdFx0XHRyZWdleDogLy4vLCAgICAgICAgICAgIC8qIEF0IHRoaXMgcG9pbnQsIGFueSBjb250ZW50IGlzIGFzc3VtZWQgdG8gYmUgYW4gVVJMICovXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkgIHtcblx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdFx0XHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblx0XHRcdFx0XHQvKiB3ZSBhcmUgdXNpbmcgbG9hZCBzbyBvbmUgY2FuIHNwZWNpZnkgYSB0YXJnZXQgd2l0aDogdXJsLmh0bWwgI3RhcmdldGVsZW1lbnQgKi9cblx0XHRcdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJzxkaXY+PC9kaXY+JykubG9hZCh1cmwsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpe1xuXHRcdFx0XHRcdFx0aWYgKCBzdGF0dXMgIT09IFwiZXJyb3JcIiApIHtcblx0XHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgkY29udGFpbmVyLmNvbnRlbnRzKCkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQuZmFpbCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRpZnJhbWU6IHtcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odXJsKSB7XG5cdFx0XHRcdFx0dmFyIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcblx0XHRcdFx0XHR2YXIgJGNvbnRlbnQgPSAkKCc8aWZyYW1lLz4nKVxuXHRcdFx0XHRcdFx0LmhpZGUoKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NyYycsIHVybClcblx0XHRcdFx0XHRcdC5jc3Moc3RydWN0dXJlKHRoaXMsICdpZnJhbWUnKSlcblx0XHRcdFx0XHRcdC5vbignbG9hZCcsIGZ1bmN0aW9uKCkgeyBkZWZlcnJlZC5yZXNvbHZlKCRjb250ZW50LnNob3coKSk7IH0pXG5cdFx0XHRcdFx0XHQvLyBXZSBjYW4ndCBtb3ZlIGFuIDxpZnJhbWU+IGFuZCBhdm9pZCByZWxvYWRpbmcgaXQsXG5cdFx0XHRcdFx0XHQvLyBzbyBsZXQncyBwdXQgaXQgaW4gcGxhY2Ugb3Vyc2VsdmVzIHJpZ2h0IG5vdzpcblx0XHRcdFx0XHRcdC5hcHBlbmRUbyh0aGlzLiRpbnN0YW5jZS5maW5kKCcuJyArIHRoaXMubmFtZXNwYWNlICsgJy1jb250ZW50JykpO1xuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR0ZXh0OiB7XG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHRleHQpIHsgcmV0dXJuICQoJzxkaXY+Jywge3RleHQ6IHRleHR9KTsgfVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRmdW5jdGlvbkF0dHJpYnV0ZXM6IFsnYmVmb3JlT3BlbicsICdhZnRlck9wZW4nLCAnYmVmb3JlQ29udGVudCcsICdhZnRlckNvbnRlbnQnLCAnYmVmb3JlQ2xvc2UnLCAnYWZ0ZXJDbG9zZSddLFxuXG5cdFx0LyoqKiBjbGFzcyBtZXRob2RzICoqKi9cblx0XHQvKiByZWFkIGVsZW1lbnQncyBhdHRyaWJ1dGVzIHN0YXJ0aW5nIHdpdGggZGF0YS1mZWF0aGVybGlnaHQtICovXG5cdFx0cmVhZEVsZW1lbnRDb25maWc6IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWVzcGFjZSkge1xuXHRcdFx0dmFyIEtsYXNzID0gdGhpcyxcblx0XHRcdFx0cmVnZXhwID0gbmV3IFJlZ0V4cCgnXmRhdGEtJyArIG5hbWVzcGFjZSArICctKC4qKScpLFxuXHRcdFx0XHRjb25maWcgPSB7fTtcblx0XHRcdGlmIChlbGVtZW50ICYmIGVsZW1lbnQuYXR0cmlidXRlcykge1xuXHRcdFx0XHQkLmVhY2goZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBtYXRjaCA9IHRoaXMubmFtZS5tYXRjaChyZWdleHApO1xuXHRcdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdFx0dmFyIHZhbCA9IHRoaXMudmFsdWUsXG5cdFx0XHRcdFx0XHRcdG5hbWUgPSAkLmNhbWVsQ2FzZShtYXRjaFsxXSk7XG5cdFx0XHRcdFx0XHRpZiAoJC5pbkFycmF5KG5hbWUsIEtsYXNzLmZ1bmN0aW9uQXR0cmlidXRlcykgPj0gMCkgeyAgLyoganNoaW50IC1XMDU0ICovXG5cdFx0XHRcdFx0XHRcdHZhbCA9IG5ldyBGdW5jdGlvbih2YWwpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHsgdmFsID0gJC5wYXJzZUpTT04odmFsKTsgfVxuXHRcdFx0XHRcdFx0XHRjYXRjaChlKSB7fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uZmlnW25hbWVdID0gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY29uZmlnO1xuXHRcdH0sXG5cblx0XHQvKiBVc2VkIHRvIGNyZWF0ZSBhIEZlYXRoZXJsaWdodCBleHRlbnNpb25cblx0XHQgICBbV2FybmluZzogZ3VydS1sZXZlbF1cblx0XHQgICBDcmVhdGVzIHRoZSBleHRlbnNpb24ncyBwcm90b3R5cGUgdGhhdCBpbiB0dXJuXG5cdFx0ICAgaW5oZXJpdHMgRmVhdGhlcmxpZ2h0J3MgcHJvdG90eXBlLlxuXHRcdCAgIENvdWxkIGJlIHVzZWQgdG8gZXh0ZW5kIGFuIGV4dGVuc2lvbiB0b28uLi5cblx0XHQgICBUaGlzIGlzIHByZXR0eSBoaWdoIGxldmVsIHdpemFyZHksIGl0IGNvbWVzIHByZXR0eSBtdWNoIHN0cmFpZ2h0XG5cdFx0ICAgZnJvbSBDb2ZmZWVTY3JpcHQgYW5kIHdvbid0IHRlYWNoIHlvdSBhbnl0aGluZyBhYm91dCBGZWF0aGVybGlnaHRcblx0XHQgICBhcyBpdCdzIG5vdCByZWFsbHkgc3BlY2lmaWMgdG8gdGhpcyBsaWJyYXJ5LlxuXHRcdCAgIE15IHN1Z2dlc3Rpb246IG1vdmUgYWxvbmcgYW5kIGtlZXAgeW91ciBzYW5pdHkuXG5cdFx0Ki9cblx0XHRleHRlbmQ6IGZ1bmN0aW9uKGNoaWxkLCBkZWZhdWx0cykge1xuXHRcdFx0LyogU2V0dXAgY2xhc3MgaGllcmFyY2h5LCBhZGFwdGVkIGZyb20gQ29mZmVlU2NyaXB0ICovXG5cdFx0XHR2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfTtcblx0XHRcdEN0b3IucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG5cdFx0XHRjaGlsZC5wcm90b3R5cGUgPSBuZXcgQ3RvcigpO1xuXHRcdFx0Y2hpbGQuX19zdXBlcl9fID0gdGhpcy5wcm90b3R5cGU7XG5cdFx0XHQvKiBDb3B5IGNsYXNzIG1ldGhvZHMgJiBhdHRyaWJ1dGVzICovXG5cdFx0XHQkLmV4dGVuZChjaGlsZCwgdGhpcywgZGVmYXVsdHMpO1xuXHRcdFx0Y2hpbGQuZGVmYXVsdHMgPSBjaGlsZC5wcm90b3R5cGU7XG5cdFx0XHRyZXR1cm4gY2hpbGQ7XG5cdFx0fSxcblxuXHRcdGF0dGFjaDogZnVuY3Rpb24oJHNvdXJjZSwgJGNvbnRlbnQsIGNvbmZpZykge1xuXHRcdFx0dmFyIEtsYXNzID0gdGhpcztcblx0XHRcdGlmICh0eXBlb2YgJGNvbnRlbnQgPT09ICdvYmplY3QnICYmICRjb250ZW50IGluc3RhbmNlb2YgJCA9PT0gZmFsc2UgJiYgIWNvbmZpZykge1xuXHRcdFx0XHRjb25maWcgPSAkY29udGVudDtcblx0XHRcdFx0JGNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0XHQvKiBtYWtlIGEgY29weSAqL1xuXHRcdFx0Y29uZmlnID0gJC5leHRlbmQoe30sIGNvbmZpZyk7XG5cblx0XHRcdC8qIE9ubHkgZm9yIG9wZW5UcmlnZ2VyIGFuZCBuYW1lc3BhY2UuLi4gKi9cblx0XHRcdHZhciBuYW1lc3BhY2UgPSBjb25maWcubmFtZXNwYWNlIHx8IEtsYXNzLmRlZmF1bHRzLm5hbWVzcGFjZSxcblx0XHRcdFx0dGVtcENvbmZpZyA9ICQuZXh0ZW5kKHt9LCBLbGFzcy5kZWZhdWx0cywgS2xhc3MucmVhZEVsZW1lbnRDb25maWcoJHNvdXJjZVswXSwgbmFtZXNwYWNlKSwgY29uZmlnKSxcblx0XHRcdFx0c2hhcmVkUGVyc2lzdDtcblxuXHRcdFx0JHNvdXJjZS5vbih0ZW1wQ29uZmlnLm9wZW5UcmlnZ2VyKycuJyt0ZW1wQ29uZmlnLm5hbWVzcGFjZSwgdGVtcENvbmZpZy5maWx0ZXIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdC8qIC4uLiBzaW5jZSB3ZSBtaWdodCBhcyB3ZWxsIGNvbXB1dGUgdGhlIGNvbmZpZyBvbiB0aGUgYWN0dWFsIHRhcmdldCAqL1xuXHRcdFx0XHR2YXIgZWxlbUNvbmZpZyA9ICQuZXh0ZW5kKFxuXHRcdFx0XHRcdHskc291cmNlOiAkc291cmNlLCAkY3VycmVudFRhcmdldDogJCh0aGlzKX0sXG5cdFx0XHRcdFx0S2xhc3MucmVhZEVsZW1lbnRDb25maWcoJHNvdXJjZVswXSwgdGVtcENvbmZpZy5uYW1lc3BhY2UpLFxuXHRcdFx0XHRcdEtsYXNzLnJlYWRFbGVtZW50Q29uZmlnKHRoaXMsIHRlbXBDb25maWcubmFtZXNwYWNlKSxcblx0XHRcdFx0XHRjb25maWcpO1xuXHRcdFx0XHR2YXIgZmwgPSBzaGFyZWRQZXJzaXN0IHx8ICQodGhpcykuZGF0YSgnZmVhdGhlcmxpZ2h0LXBlcnNpc3RlZCcpIHx8IG5ldyBLbGFzcygkY29udGVudCwgZWxlbUNvbmZpZyk7XG5cdFx0XHRcdGlmKGZsLnBlcnNpc3QgPT09ICdzaGFyZWQnKSB7XG5cdFx0XHRcdFx0c2hhcmVkUGVyc2lzdCA9IGZsO1xuXHRcdFx0XHR9IGVsc2UgaWYoZmwucGVyc2lzdCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoJ2ZlYXRoZXJsaWdodC1wZXJzaXN0ZWQnLCBmbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbUNvbmZpZy4kY3VycmVudFRhcmdldC5ibHVyKCk7IC8vIE90aGVyd2lzZSAnZW50ZXInIGtleSBtaWdodCB0cmlnZ2VyIHRoZSBkaWFsb2cgYWdhaW5cblx0XHRcdFx0Zmwub3BlbihldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiAkc291cmNlO1xuXHRcdH0sXG5cblx0XHRjdXJyZW50OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhbGwgPSB0aGlzLm9wZW5lZCgpO1xuXHRcdFx0cmV0dXJuIGFsbFthbGwubGVuZ3RoIC0gMV0gfHwgbnVsbDtcblx0XHR9LFxuXG5cdFx0b3BlbmVkOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBrbGFzcyA9IHRoaXM7XG5cdFx0XHRwcnVuZU9wZW5lZCgpO1xuXHRcdFx0cmV0dXJuICQuZ3JlcChvcGVuZWQsIGZ1bmN0aW9uKGZsKSB7IHJldHVybiBmbCBpbnN0YW5jZW9mIGtsYXNzOyB9ICk7XG5cdFx0fSxcblxuXHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjdXIgPSB0aGlzLmN1cnJlbnQoKTtcblx0XHRcdGlmKGN1cikgeyByZXR1cm4gY3VyLmNsb3NlKCk7IH1cblx0XHR9LFxuXG5cdFx0LyogRG9lcyB0aGUgYXV0byBiaW5kaW5nIG9uIHN0YXJ0dXAuXG5cdFx0ICAgTWVhbnQgb25seSB0byBiZSB1c2VkIGJ5IEZlYXRoZXJsaWdodCBhbmQgaXRzIGV4dGVuc2lvbnNcblx0XHQqL1xuXHRcdF9vblJlYWR5OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBLbGFzcyA9IHRoaXM7XG5cdFx0XHRpZihLbGFzcy5hdXRvQmluZCl7XG5cdFx0XHRcdC8qIEJpbmQgZXhpc3RpbmcgZWxlbWVudHMgKi9cblx0XHRcdFx0JChLbGFzcy5hdXRvQmluZCkuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdEtsYXNzLmF0dGFjaCgkKHRoaXMpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8qIElmIGEgY2xpY2sgcHJvcGFnYXRlcyB0byB0aGUgZG9jdW1lbnQgbGV2ZWwsIHRoZW4gd2UgaGF2ZSBhbiBpdGVtIHRoYXQgd2FzIGFkZGVkIGxhdGVyIG9uICovXG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIEtsYXNzLmF1dG9CaW5kLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0XHRpZiAoZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdC8qIEJpbmQgZmVhdGhlcmxpZ2h0ICovXG5cdFx0XHRcdFx0S2xhc3MuYXR0YWNoKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdFx0XHQvKiBDbGljayBhZ2FpbjsgdGhpcyB0aW1lIG91ciBiaW5kaW5nIHdpbGwgY2F0Y2ggaXQgKi9cblx0XHRcdFx0XHQkKGV2dC50YXJnZXQpLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKiBGZWF0aGVybGlnaHQgdXNlcyB0aGUgb25LZXlVcCBjYWxsYmFjayB0byBpbnRlcmNlcHQgdGhlIGVzY2FwZSBrZXkuXG5cdFx0ICAgUHJpdmF0ZSB0byBGZWF0aGVybGlnaHQuXG5cdFx0Ki9cblx0XHRfY2FsbGJhY2tDaGFpbjoge1xuXHRcdFx0b25LZXlVcDogZnVuY3Rpb24oX3N1cGVyLCBldmVudCl7XG5cdFx0XHRcdGlmKDI3ID09PSBldmVudC5rZXlDb2RlKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuY2xvc2VPbkVzYykge1xuXHRcdFx0XHRcdFx0dGhpcy4kaW5zdGFuY2UuZmluZCgnLicrdGhpcy5uYW1lc3BhY2UrJy1jbG9zZTpmaXJzdCcpLmNsaWNrKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gX3N1cGVyKGV2ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0b25SZXNpemU6IGZ1bmN0aW9uKF9zdXBlciwgZXZlbnQpe1xuXHRcdFx0XHRpZiAodGhpcy4kY29udGVudC5uYXR1cmFsV2lkdGgpIHtcblx0XHRcdFx0XHR2YXIgdyA9IHRoaXMuJGNvbnRlbnQubmF0dXJhbFdpZHRoLCBoID0gdGhpcy4kY29udGVudC5uYXR1cmFsSGVpZ2h0O1xuXHRcdFx0XHRcdC8qIFJlc2V0IGFwcGFyZW50IGltYWdlIHNpemUgZmlyc3Qgc28gY29udGFpbmVyIGdyb3dzICovXG5cdFx0XHRcdFx0dGhpcy4kY29udGVudC5jc3MoJ3dpZHRoJywgJycpLmNzcygnaGVpZ2h0JywgJycpO1xuXHRcdFx0XHRcdC8qIENhbGN1bGF0ZSB0aGUgd29yc3QgcmF0aW8gc28gdGhhdCBkaW1lbnNpb25zIGZpdCAqL1xuXHRcdFx0XHRcdHZhciByYXRpbyA9IE1hdGgubWF4KFxuXHRcdFx0XHRcdFx0dyAgLyBwYXJzZUludCh0aGlzLiRjb250ZW50LnBhcmVudCgpLmNzcygnd2lkdGgnKSwxMCksXG5cdFx0XHRcdFx0XHRoIC8gcGFyc2VJbnQodGhpcy4kY29udGVudC5wYXJlbnQoKS5jc3MoJ2hlaWdodCcpLDEwKSk7XG5cdFx0XHRcdFx0LyogUmVzaXplIGNvbnRlbnQgKi9cblx0XHRcdFx0XHRpZiAocmF0aW8gPiAxKSB7XG5cdFx0XHRcdFx0XHR0aGlzLiRjb250ZW50LmNzcygnd2lkdGgnLCAnJyArIHcgLyByYXRpbyArICdweCcpLmNzcygnaGVpZ2h0JywgJycgKyBoIC8gcmF0aW8gKyAncHgnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIF9zdXBlcihldmVudCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhZnRlckNvbnRlbnQ6IGZ1bmN0aW9uKF9zdXBlciwgZXZlbnQpe1xuXHRcdFx0XHR2YXIgciA9IF9zdXBlcihldmVudCk7XG5cdFx0XHRcdHRoaXMub25SZXNpemUoZXZlbnQpO1xuXHRcdFx0XHRyZXR1cm4gcjtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdCQuZmVhdGhlcmxpZ2h0ID0gRmVhdGhlcmxpZ2h0O1xuXG5cdC8qIGJpbmQgalF1ZXJ5IGVsZW1lbnRzIHRvIHRyaWdnZXIgZmVhdGhlcmxpZ2h0ICovXG5cdCQuZm4uZmVhdGhlcmxpZ2h0ID0gZnVuY3Rpb24oJGNvbnRlbnQsIGNvbmZpZykge1xuXHRcdHJldHVybiBGZWF0aGVybGlnaHQuYXR0YWNoKHRoaXMsICRjb250ZW50LCBjb25maWcpO1xuXHR9O1xuXG5cdC8qIGJpbmQgZmVhdGhlcmxpZ2h0IG9uIHJlYWR5IGlmIGNvbmZpZyBhdXRvQmluZCBpcyBzZXQgKi9cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXsgRmVhdGhlcmxpZ2h0Ll9vblJlYWR5KCk7IH0pO1xufShqUXVlcnkpKTtcbiIsIi8qIVxuICogaG92ZXJJbnRlbnQgdjEuOC4xIC8vIDIwMTQuMDguMTEgLy8galF1ZXJ5IHYxLjkuMStcbiAqIGh0dHA6Ly9jaGVybmUubmV0L2JyaWFuL3Jlc291cmNlcy9qcXVlcnkuaG92ZXJJbnRlbnQuaHRtbFxuICpcbiAqIFlvdSBtYXkgdXNlIGhvdmVySW50ZW50IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuIEJhc2ljYWxseSB0aGF0XG4gKiBtZWFucyB5b3UgYXJlIGZyZWUgdG8gdXNlIGhvdmVySW50ZW50IGFzIGxvbmcgYXMgdGhpcyBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuXG4gKiBDb3B5cmlnaHQgMjAwNywgMjAxNCBCcmlhbiBDaGVybmVcbiAqL1xuIFxuLyogaG92ZXJJbnRlbnQgaXMgc2ltaWxhciB0byBqUXVlcnkncyBidWlsdC1pbiBcImhvdmVyXCIgbWV0aG9kIGV4Y2VwdCB0aGF0XG4gKiBpbnN0ZWFkIG9mIGZpcmluZyB0aGUgaGFuZGxlckluIGZ1bmN0aW9uIGltbWVkaWF0ZWx5LCBob3ZlckludGVudCBjaGVja3NcbiAqIHRvIHNlZSBpZiB0aGUgdXNlcidzIG1vdXNlIGhhcyBzbG93ZWQgZG93biAoYmVuZWF0aCB0aGUgc2Vuc2l0aXZpdHlcbiAqIHRocmVzaG9sZCkgYmVmb3JlIGZpcmluZyB0aGUgZXZlbnQuIFRoZSBoYW5kbGVyT3V0IGZ1bmN0aW9uIGlzIG9ubHlcbiAqIGNhbGxlZCBhZnRlciBhIG1hdGNoaW5nIGhhbmRsZXJJbi5cbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4ganVzdCBsaWtlIC5ob3ZlcigpXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCApXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIHdpdGggZXZlbnQgZGVsZWdhdGlvbiFcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0LCBzZWxlY3RvciApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCwgc2VsZWN0b3IgKVxuICpcbiAqIC8vIHVzaW5nIGEgYmFzaWMgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIC5ob3ZlckludGVudCggY29uZmlnIClcbiAqXG4gKiBAcGFyYW0gIGhhbmRsZXJJbiAgIGZ1bmN0aW9uIE9SIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0gIGhhbmRsZXJPdXQgIGZ1bmN0aW9uIE9SIHNlbGVjdG9yIGZvciBkZWxlZ2F0aW9uIE9SIHVuZGVmaW5lZFxuICogQHBhcmFtICBzZWxlY3RvciAgICBzZWxlY3RvciBPUiB1bmRlZmluZWRcbiAqIEBhdXRob3IgQnJpYW4gQ2hlcm5lIDxicmlhbihhdCljaGVybmUoZG90KW5ldD5cbiAqL1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAkLmZuLmhvdmVySW50ZW50ID0gZnVuY3Rpb24oaGFuZGxlckluLGhhbmRsZXJPdXQsc2VsZWN0b3IpIHtcblxuICAgICAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gdmFsdWVzXG4gICAgICAgIHZhciBjZmcgPSB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgc2Vuc2l0aXZpdHk6IDYsXG4gICAgICAgICAgICB0aW1lb3V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgaGFuZGxlckluID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCBoYW5kbGVySW4gKTtcbiAgICAgICAgfSBlbHNlIGlmICgkLmlzRnVuY3Rpb24oaGFuZGxlck91dCkpIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlck91dCwgc2VsZWN0b3I6IHNlbGVjdG9yIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlckluLCBzZWxlY3RvcjogaGFuZGxlck91dCB9ICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnN0YW50aWF0ZSB2YXJpYWJsZXNcbiAgICAgICAgLy8gY1gsIGNZID0gY3VycmVudCBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCB1cGRhdGVkIGJ5IG1vdXNlbW92ZSBldmVudFxuICAgICAgICAvLyBwWCwgcFkgPSBwcmV2aW91cyBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCBzZXQgYnkgbW91c2VvdmVyIGFuZCBwb2xsaW5nIGludGVydmFsXG4gICAgICAgIHZhciBjWCwgY1ksIHBYLCBwWTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGdldHRpbmcgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIHRyYWNrID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGNYID0gZXYucGFnZVg7XG4gICAgICAgICAgICBjWSA9IGV2LnBhZ2VZO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgY29tcGFyaW5nIGN1cnJlbnQgYW5kIHByZXZpb3VzIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciBjb21wYXJlID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICAvLyBjb21wYXJlIG1vdXNlIHBvc2l0aW9ucyB0byBzZWUgaWYgdGhleSd2ZSBjcm9zc2VkIHRoZSB0aHJlc2hvbGRcbiAgICAgICAgICAgIGlmICggTWF0aC5zcXJ0KCAocFgtY1gpKihwWC1jWCkgKyAocFktY1kpKihwWS1jWSkgKSA8IGNmZy5zZW5zaXRpdml0eSApIHtcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGhvdmVySW50ZW50IHN0YXRlIHRvIHRydWUgKHNvIG1vdXNlT3V0IGNhbiBiZSBjYWxsZWQpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNmZy5vdmVyLmFwcGx5KG9iLFtldl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgcHJldmlvdXMgY29vcmRpbmF0ZXMgZm9yIG5leHQgdGltZVxuICAgICAgICAgICAgICAgIHBYID0gY1g7IHBZID0gY1k7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHNlbGYtY2FsbGluZyB0aW1lb3V0LCBndWFyYW50ZWVzIGludGVydmFscyBhcmUgc3BhY2VkIG91dCBwcm9wZXJseSAoYXZvaWRzIEphdmFTY3JpcHQgdGltZXIgYnVncylcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LCBvYik7fSAsIGNmZy5pbnRlcnZhbCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZGVsYXlpbmcgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uXG4gICAgICAgIHZhciBkZWxheSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGNmZy5vdXQuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBtb3VzZSAnaG92ZXJpbmcnXG4gICAgICAgIHZhciBoYW5kbGVIb3ZlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIC8vIGNvcHkgb2JqZWN0cyB0byBiZSBwYXNzZWQgaW50byB0IChyZXF1aXJlZCBmb3IgZXZlbnQgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbiBJRSlcbiAgICAgICAgICAgIHZhciBldiA9ICQuZXh0ZW5kKHt9LGUpO1xuICAgICAgICAgICAgdmFyIG9iID0gdGhpcztcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGhvdmVySW50ZW50IHRpbWVyIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3QpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTsgfVxuXG4gICAgICAgICAgICAvLyBpZiBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIikge1xuICAgICAgICAgICAgICAgIC8vIHNldCBcInByZXZpb3VzXCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBpbml0aWFsIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgICAgcFggPSBldi5wYWdlWDsgcFkgPSBldi5wYWdlWTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgXCJjdXJyZW50XCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBtb3VzZW1vdmVcbiAgICAgICAgICAgICAgICAkKG9iKS5vbihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBwb2xsaW5nIGludGVydmFsIChzZWxmLWNhbGxpbmcgdGltZW91dCkgdG8gY29tcGFyZSBtb3VzZSBjb29yZGluYXRlcyBvdmVyIHRpbWVcbiAgICAgICAgICAgICAgICBpZiAoIW9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldixvYik7fSAsIGNmZy5pbnRlcnZhbCApO31cblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZS50eXBlID09IFwibW91c2VsZWF2ZVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVuYmluZCBleHBlbnNpdmUgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIGlmIGhvdmVySW50ZW50IHN0YXRlIGlzIHRydWUsIHRoZW4gY2FsbCB0aGUgbW91c2VPdXQgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheVxuICAgICAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2RlbGF5KGV2LG9iKTt9ICwgY2ZnLnRpbWVvdXQgKTt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBtb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlXG4gICAgICAgIHJldHVybiB0aGlzLm9uKHsnbW91c2VlbnRlci5ob3ZlckludGVudCc6aGFuZGxlSG92ZXIsJ21vdXNlbGVhdmUuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyfSwgY2ZnLnNlbGVjdG9yKTtcbiAgICB9O1xufSkoalF1ZXJ5KTtcbiIsIi8qIVxuICogaW1hZ2VzTG9hZGVkIFBBQ0tBR0VEIHYzLjEuOFxuICogSmF2YVNjcmlwdCBpcyBhbGwgbGlrZSBcIllvdSBpbWFnZXMgYXJlIGRvbmUgeWV0IG9yIHdoYXQ/XCJcbiAqIE1JVCBMaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31mdW5jdGlvbiB0KGUsdCl7Zm9yKHZhciBuPWUubGVuZ3RoO24tLTspaWYoZVtuXS5saXN0ZW5lcj09PXQpcmV0dXJuIG47cmV0dXJuLTF9ZnVuY3Rpb24gbihlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tlXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXZhciBpPWUucHJvdG90eXBlLHI9dGhpcyxvPXIuRXZlbnRFbWl0dGVyO2kuZ2V0TGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG4saT10aGlzLl9nZXRFdmVudHMoKTtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dD17fTtmb3IobiBpbiBpKWkuaGFzT3duUHJvcGVydHkobikmJmUudGVzdChuKSYmKHRbbl09aVtuXSl9ZWxzZSB0PWlbZV18fChpW2VdPVtdKTtyZXR1cm4gdH0saS5mbGF0dGVuTGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG49W107Zm9yKHQ9MDtlLmxlbmd0aD50O3QrPTEpbi5wdXNoKGVbdF0ubGlzdGVuZXIpO3JldHVybiBufSxpLmdldExpc3RlbmVyc0FzT2JqZWN0PWZ1bmN0aW9uKGUpe3ZhciB0LG49dGhpcy5nZXRMaXN0ZW5lcnMoZSk7cmV0dXJuIG4gaW5zdGFuY2VvZiBBcnJheSYmKHQ9e30sdFtlXT1uKSx0fHxufSxpLmFkZExpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscj10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpLG89XCJvYmplY3RcIj09dHlwZW9mIG47Zm9yKGkgaW4gcilyLmhhc093blByb3BlcnR5KGkpJiYtMT09PXQocltpXSxuKSYmcltpXS5wdXNoKG8/bjp7bGlzdGVuZXI6bixvbmNlOiExfSk7cmV0dXJuIHRoaXN9LGkub249bihcImFkZExpc3RlbmVyXCIpLGkuYWRkT25jZUxpc3RlbmVyPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZSx7bGlzdGVuZXI6dCxvbmNlOiEwfSl9LGkub25jZT1uKFwiYWRkT25jZUxpc3RlbmVyXCIpLGkuZGVmaW5lRXZlbnQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZ2V0TGlzdGVuZXJzKGUpLHRoaXN9LGkuZGVmaW5lRXZlbnRzPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0wO2UubGVuZ3RoPnQ7dCs9MSl0aGlzLmRlZmluZUV2ZW50KGVbdF0pO3JldHVybiB0aGlzfSxpLnJlbW92ZUxpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscixvPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gbylvLmhhc093blByb3BlcnR5KHIpJiYoaT10KG9bcl0sbiksLTEhPT1pJiZvW3JdLnNwbGljZShpLDEpKTtyZXR1cm4gdGhpc30saS5vZmY9bihcInJlbW92ZUxpc3RlbmVyXCIpLGkuYWRkTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMSxlLHQpfSxpLnJlbW92ZUxpc3RlbmVycz1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITAsZSx0KX0saS5tYW5pcHVsYXRlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxyLG89ZT90aGlzLnJlbW92ZUxpc3RlbmVyOnRoaXMuYWRkTGlzdGVuZXIscz1lP3RoaXMucmVtb3ZlTGlzdGVuZXJzOnRoaXMuYWRkTGlzdGVuZXJzO2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0fHx0IGluc3RhbmNlb2YgUmVnRXhwKWZvcihpPW4ubGVuZ3RoO2ktLTspby5jYWxsKHRoaXMsdCxuW2ldKTtlbHNlIGZvcihpIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShpKSYmKHI9dFtpXSkmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiByP28uY2FsbCh0aGlzLGkscik6cy5jYWxsKHRoaXMsaSxyKSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIHQsbj10eXBlb2YgZSxpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwic3RyaW5nXCI9PT1uKWRlbGV0ZSBpW2VdO2Vsc2UgaWYoXCJvYmplY3RcIj09PW4pZm9yKHQgaW4gaSlpLmhhc093blByb3BlcnR5KHQpJiZlLnRlc3QodCkmJmRlbGV0ZSBpW3RdO2Vsc2UgZGVsZXRlIHRoaXMuX2V2ZW50cztyZXR1cm4gdGhpc30saS5yZW1vdmVBbGxMaXN0ZW5lcnM9bihcInJlbW92ZUV2ZW50XCIpLGkuZW1pdEV2ZW50PWZ1bmN0aW9uKGUsdCl7dmFyIG4saSxyLG8scz10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpO2ZvcihyIGluIHMpaWYocy5oYXNPd25Qcm9wZXJ0eShyKSlmb3IoaT1zW3JdLmxlbmd0aDtpLS07KW49c1tyXVtpXSxuLm9uY2U9PT0hMCYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpLG89bi5saXN0ZW5lci5hcHBseSh0aGlzLHR8fFtdKSxvPT09dGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkmJnRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuLmxpc3RlbmVyKTtyZXR1cm4gdGhpc30saS50cmlnZ2VyPW4oXCJlbWl0RXZlbnRcIiksaS5lbWl0PWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTtyZXR1cm4gdGhpcy5lbWl0RXZlbnQoZSx0KX0saS5zZXRPbmNlUmV0dXJuVmFsdWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZT1lLHRoaXN9LGkuX2dldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5KFwiX29uY2VSZXR1cm5WYWx1ZVwiKT90aGlzLl9vbmNlUmV0dXJuVmFsdWU6ITB9LGkuX2dldEV2ZW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ldmVudHN8fCh0aGlzLl9ldmVudHM9e30pfSxlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5FdmVudEVtaXR0ZXI9byxlfSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KTpcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lOnRoaXMuRXZlbnRFbWl0dGVyPWV9KS5jYWxsKHRoaXMpLGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7dmFyIG49ZS5ldmVudDtyZXR1cm4gbi50YXJnZXQ9bi50YXJnZXR8fG4uc3JjRWxlbWVudHx8dCxufXZhciBuPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxpPWZ1bmN0aW9uKCl7fTtuLmFkZEV2ZW50TGlzdGVuZXI/aT1mdW5jdGlvbihlLHQsbil7ZS5hZGRFdmVudExpc3RlbmVyKHQsbiwhMSl9Om4uYXR0YWNoRXZlbnQmJihpPWZ1bmN0aW9uKGUsbixpKXtlW24raV09aS5oYW5kbGVFdmVudD9mdW5jdGlvbigpe3ZhciBuPXQoZSk7aS5oYW5kbGVFdmVudC5jYWxsKGksbil9OmZ1bmN0aW9uKCl7dmFyIG49dChlKTtpLmNhbGwoZSxuKX0sZS5hdHRhY2hFdmVudChcIm9uXCIrbixlW24raV0pfSk7dmFyIHI9ZnVuY3Rpb24oKXt9O24ucmVtb3ZlRXZlbnRMaXN0ZW5lcj9yPWZ1bmN0aW9uKGUsdCxuKXtlLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5kZXRhY2hFdmVudCYmKHI9ZnVuY3Rpb24oZSx0LG4pe2UuZGV0YWNoRXZlbnQoXCJvblwiK3QsZVt0K25dKTt0cnl7ZGVsZXRlIGVbdCtuXX1jYXRjaChpKXtlW3Qrbl09dm9pZCAwfX0pO3ZhciBvPXtiaW5kOmksdW5iaW5kOnJ9O1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudGllL2V2ZW50aWVcIixvKTplLmV2ZW50aWU9b30odGhpcyksZnVuY3Rpb24oZSx0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXJcIixcImV2ZW50aWUvZXZlbnRpZVwiXSxmdW5jdGlvbihuLGkpe3JldHVybiB0KGUsbixpKX0pOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPXQoZSxyZXF1aXJlKFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIikscmVxdWlyZShcImV2ZW50aWVcIikpOmUuaW1hZ2VzTG9hZGVkPXQoZSxlLkV2ZW50RW1pdHRlcixlLmV2ZW50aWUpfSh3aW5kb3csZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGkoZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9ZnVuY3Rpb24gcihlKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1kLmNhbGwoZSl9ZnVuY3Rpb24gbyhlKXt2YXIgdD1bXTtpZihyKGUpKXQ9ZTtlbHNlIGlmKFwibnVtYmVyXCI9PXR5cGVvZiBlLmxlbmd0aClmb3IodmFyIG49MCxpPWUubGVuZ3RoO2k+bjtuKyspdC5wdXNoKGVbbl0pO2Vsc2UgdC5wdXNoKGUpO3JldHVybiB0fWZ1bmN0aW9uIHMoZSx0LG4pe2lmKCEodGhpcyBpbnN0YW5jZW9mIHMpKXJldHVybiBuZXcgcyhlLHQpO1wic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpKSx0aGlzLmVsZW1lbnRzPW8oZSksdGhpcy5vcHRpb25zPWkoe30sdGhpcy5vcHRpb25zKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0P249dDppKHRoaXMub3B0aW9ucyx0KSxuJiZ0aGlzLm9uKFwiYWx3YXlzXCIsbiksdGhpcy5nZXRJbWFnZXMoKSxhJiYodGhpcy5qcURlZmVycmVkPW5ldyBhLkRlZmVycmVkKTt2YXIgcj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyLmNoZWNrKCl9KX1mdW5jdGlvbiBmKGUpe3RoaXMuaW1nPWV9ZnVuY3Rpb24gYyhlKXt0aGlzLnNyYz1lLHZbZV09dGhpc312YXIgYT1lLmpRdWVyeSx1PWUuY29uc29sZSxoPXUhPT12b2lkIDAsZD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO3MucHJvdG90eXBlPW5ldyB0LHMucHJvdG90eXBlLm9wdGlvbnM9e30scy5wcm90b3R5cGUuZ2V0SW1hZ2VzPWZ1bmN0aW9uKCl7dGhpcy5pbWFnZXM9W107Zm9yKHZhciBlPTAsdD10aGlzLmVsZW1lbnRzLmxlbmd0aDt0PmU7ZSsrKXt2YXIgbj10aGlzLmVsZW1lbnRzW2VdO1wiSU1HXCI9PT1uLm5vZGVOYW1lJiZ0aGlzLmFkZEltYWdlKG4pO3ZhciBpPW4ubm9kZVR5cGU7aWYoaSYmKDE9PT1pfHw5PT09aXx8MTE9PT1pKSlmb3IodmFyIHI9bi5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpLG89MCxzPXIubGVuZ3RoO3M+bztvKyspe3ZhciBmPXJbb107dGhpcy5hZGRJbWFnZShmKX19fSxzLnByb3RvdHlwZS5hZGRJbWFnZT1mdW5jdGlvbihlKXt2YXIgdD1uZXcgZihlKTt0aGlzLmltYWdlcy5wdXNoKHQpfSxzLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSxyKXtyZXR1cm4gdC5vcHRpb25zLmRlYnVnJiZoJiZ1LmxvZyhcImNvbmZpcm1cIixlLHIpLHQucHJvZ3Jlc3MoZSksbisrLG49PT1pJiZ0LmNvbXBsZXRlKCksITB9dmFyIHQ9dGhpcyxuPTAsaT10aGlzLmltYWdlcy5sZW5ndGg7aWYodGhpcy5oYXNBbnlCcm9rZW49ITEsIWkpcmV0dXJuIHRoaXMuY29tcGxldGUoKSx2b2lkIDA7Zm9yKHZhciByPTA7aT5yO3IrKyl7dmFyIG89dGhpcy5pbWFnZXNbcl07by5vbihcImNvbmZpcm1cIixlKSxvLmNoZWNrKCl9fSxzLnByb3RvdHlwZS5wcm9ncmVzcz1mdW5jdGlvbihlKXt0aGlzLmhhc0FueUJyb2tlbj10aGlzLmhhc0FueUJyb2tlbnx8IWUuaXNMb2FkZWQ7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5lbWl0KFwicHJvZ3Jlc3NcIix0LGUpLHQuanFEZWZlcnJlZCYmdC5qcURlZmVycmVkLm5vdGlmeSYmdC5qcURlZmVycmVkLm5vdGlmeSh0LGUpfSl9LHMucHJvdG90eXBlLmNvbXBsZXRlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5oYXNBbnlCcm9rZW4/XCJmYWlsXCI6XCJkb25lXCI7dGhpcy5pc0NvbXBsZXRlPSEwO3ZhciB0PXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe2lmKHQuZW1pdChlLHQpLHQuZW1pdChcImFsd2F5c1wiLHQpLHQuanFEZWZlcnJlZCl7dmFyIG49dC5oYXNBbnlCcm9rZW4/XCJyZWplY3RcIjpcInJlc29sdmVcIjt0LmpxRGVmZXJyZWRbbl0odCl9fSl9LGEmJihhLmZuLmltYWdlc0xvYWRlZD1mdW5jdGlvbihlLHQpe3ZhciBuPW5ldyBzKHRoaXMsZSx0KTtyZXR1cm4gbi5qcURlZmVycmVkLnByb21pc2UoYSh0aGlzKSl9KSxmLnByb3RvdHlwZT1uZXcgdCxmLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe3ZhciBlPXZbdGhpcy5pbWcuc3JjXXx8bmV3IGModGhpcy5pbWcuc3JjKTtpZihlLmlzQ29uZmlybWVkKXJldHVybiB0aGlzLmNvbmZpcm0oZS5pc0xvYWRlZCxcImNhY2hlZCB3YXMgY29uZmlybWVkXCIpLHZvaWQgMDtpZih0aGlzLmltZy5jb21wbGV0ZSYmdm9pZCAwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoKXJldHVybiB0aGlzLmNvbmZpcm0oMCE9PXRoaXMuaW1nLm5hdHVyYWxXaWR0aCxcIm5hdHVyYWxXaWR0aFwiKSx2b2lkIDA7dmFyIHQ9dGhpcztlLm9uKFwiY29uZmlybVwiLGZ1bmN0aW9uKGUsbil7cmV0dXJuIHQuY29uZmlybShlLmlzTG9hZGVkLG4pLCEwfSksZS5jaGVjaygpfSxmLnByb3RvdHlwZS5jb25maXJtPWZ1bmN0aW9uKGUsdCl7dGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfTt2YXIgdj17fTtyZXR1cm4gYy5wcm90b3R5cGU9bmV3IHQsYy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtpZighdGhpcy5pc0NoZWNrZWQpe3ZhciBlPW5ldyBJbWFnZTtuLmJpbmQoZSxcImxvYWRcIix0aGlzKSxuLmJpbmQoZSxcImVycm9yXCIsdGhpcyksZS5zcmM9dGhpcy5zcmMsdGhpcy5pc0NoZWNrZWQ9ITB9fSxjLnByb3RvdHlwZS5oYW5kbGVFdmVudD1mdW5jdGlvbihlKXt2YXIgdD1cIm9uXCIrZS50eXBlO3RoaXNbdF0mJnRoaXNbdF0oZSl9LGMucHJvdG90eXBlLm9ubG9hZD1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITAsXCJvbmxvYWRcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUub25lcnJvcj1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITEsXCJvbmVycm9yXCIpLHRoaXMudW5iaW5kUHJveHlFdmVudHMoZSl9LGMucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzQ29uZmlybWVkPSEwLHRoaXMuaXNMb2FkZWQ9ZSx0aGlzLmVtaXQoXCJjb25maXJtXCIsdGhpcyx0KX0sYy5wcm90b3R5cGUudW5iaW5kUHJveHlFdmVudHM9ZnVuY3Rpb24oZSl7bi51bmJpbmQoZS50YXJnZXQsXCJsb2FkXCIsdGhpcyksbi51bmJpbmQoZS50YXJnZXQsXCJlcnJvclwiLHRoaXMpfSxzfSk7IiwiLyohXG4gKiBqUXVlcnkgUGxhY2Vob2xkZXIgUGx1Z2luIHYyLjEuM1xuICogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvanF1ZXJ5LXBsYWNlaG9sZGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIDIwMTUgTWF0aGlhcyBCeW5lbnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EXG4gICAgICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgfVxufShmdW5jdGlvbigkKSB7XG5cbiAgICAvLyBPcGVyYSBNaW5pIHY3IGRvZXNuJ3Qgc3VwcG9ydCBwbGFjZWhvbGRlciBhbHRob3VnaCBpdHMgRE9NIHNlZW1zIHRvIGluZGljYXRlIHNvXG4gICAgdmFyIGlzT3BlcmFNaW5pID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdy5vcGVyYW1pbmkpID09PSAnW29iamVjdCBPcGVyYU1pbmldJztcbiAgICB2YXIgaXNJbnB1dFN1cHBvcnRlZCA9ICdwbGFjZWhvbGRlcicgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSAmJiAhaXNPcGVyYU1pbmk7XG4gICAgdmFyIGlzVGV4dGFyZWFTdXBwb3J0ZWQgPSAncGxhY2Vob2xkZXInIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJykgJiYgIWlzT3BlcmFNaW5pO1xuICAgIHZhciB2YWxIb29rcyA9ICQudmFsSG9va3M7XG4gICAgdmFyIHByb3BIb29rcyA9ICQucHJvcEhvb2tzO1xuICAgIHZhciBob29rcztcbiAgICB2YXIgcGxhY2Vob2xkZXI7XG4gICAgdmFyIHNldHRpbmdzID0ge307XG5cbiAgICBpZiAoaXNJbnB1dFN1cHBvcnRlZCAmJiBpc1RleHRhcmVhU3VwcG9ydGVkKSB7XG5cbiAgICAgICAgcGxhY2Vob2xkZXIgPSAkLmZuLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICBwbGFjZWhvbGRlci5pbnB1dCA9IHRydWU7XG4gICAgICAgIHBsYWNlaG9sZGVyLnRleHRhcmVhID0gdHJ1ZTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcGxhY2Vob2xkZXIgPSAkLmZuLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICAgICAgICB2YXIgZGVmYXVsdHMgPSB7Y3VzdG9tQ2xhc3M6ICdwbGFjZWhvbGRlcid9O1xuICAgICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGlzSW5wdXRTdXBwb3J0ZWQgPyAndGV4dGFyZWEnIDogJzppbnB1dCcpICsgJ1twbGFjZWhvbGRlcl0nKVxuICAgICAgICAgICAgICAgIC5ub3QoJy4nK3NldHRpbmdzLmN1c3RvbUNsYXNzKVxuICAgICAgICAgICAgICAgIC5iaW5kKHtcbiAgICAgICAgICAgICAgICAgICAgJ2ZvY3VzLnBsYWNlaG9sZGVyJzogY2xlYXJQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgJ2JsdXIucGxhY2Vob2xkZXInOiBzZXRQbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdibHVyLnBsYWNlaG9sZGVyJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcGxhY2Vob2xkZXIuaW5wdXQgPSBpc0lucHV0U3VwcG9ydGVkO1xuICAgICAgICBwbGFjZWhvbGRlci50ZXh0YXJlYSA9IGlzVGV4dGFyZWFTdXBwb3J0ZWQ7XG5cbiAgICAgICAgaG9va3MgPSB7XG4gICAgICAgICAgICAnZ2V0JzogZnVuY3Rpb24oZWxlbWVudCkge1xuXG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB2YXIgJHBhc3N3b3JkSW5wdXQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRwYXNzd29yZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcpICYmICRlbGVtZW50Lmhhc0NsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKSA/ICcnIDogZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc2V0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdmFyICRyZXBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICB2YXIgJHBhc3N3b3JkSW5wdXQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItdGV4dGlucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICRwYXNzd29yZElucHV0ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJHJlcGxhY2VtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclBsYWNlaG9sZGVyLmNhbGwoJHJlcGxhY2VtZW50WzBdLCB0cnVlLCB2YWx1ZSkgfHwgKGVsZW1lbnQudmFsdWUgPSB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnRbMF0udmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRwYXNzd29yZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCwgdHJ1ZSwgdmFsdWUpIHx8ICgkcGFzc3dvcmRJbnB1dFswXS52YWx1ZSA9IHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldHRpbmcgdGhlIHBsYWNlaG9sZGVyIGNhdXNlcyBwcm9ibGVtcyBpZiB0aGUgZWxlbWVudCBjb250aW51ZXMgdG8gaGF2ZSBmb2N1cy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuJ3QgdXNlIGB0cmlnZ2VySGFuZGxlcmAgaGVyZSBiZWNhdXNlIG9mIGR1bW15IHRleHQvcGFzc3dvcmQgaW5wdXRzIDooXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBgc2V0YCBjYW4gbm90IHJldHVybiBgdW5kZWZpbmVkYDsgc2VlIGh0dHA6Ly9qc2FwaS5pbmZvL2pxdWVyeS8xLjcuMS92YWwjTDIzNjNcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFpc0lucHV0U3VwcG9ydGVkKSB7XG4gICAgICAgICAgICB2YWxIb29rcy5pbnB1dCA9IGhvb2tzO1xuICAgICAgICAgICAgcHJvcEhvb2tzLnZhbHVlID0gaG9va3M7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVGV4dGFyZWFTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHZhbEhvb2tzLnRleHRhcmVhID0gaG9va3M7XG4gICAgICAgICAgICBwcm9wSG9va3MudmFsdWUgPSBob29rcztcbiAgICAgICAgfVxuXG4gICAgICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBMb29rIGZvciBmb3Jtc1xuICAgICAgICAgICAgJChkb2N1bWVudCkuZGVsZWdhdGUoJ2Zvcm0nLCAnc3VibWl0LnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBzbyB0aGV5IGRvbid0IGdldCBzdWJtaXR0ZWRcbiAgICAgICAgICAgICAgICB2YXIgJGlucHV0cyA9ICQoJy4nK3NldHRpbmdzLmN1c3RvbUNsYXNzLCB0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclBsYWNlaG9sZGVyLmNhbGwodGhpcywgdHJ1ZSwgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0cy5lYWNoKHNldFBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgcGxhY2Vob2xkZXIgdmFsdWVzIHVwb24gcGFnZSByZWxvYWRcbiAgICAgICAgJCh3aW5kb3cpLmJpbmQoJ2JlZm9yZXVubG9hZC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLicrc2V0dGluZ3MuY3VzdG9tQ2xhc3MpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFyZ3MoZWxlbSkge1xuICAgICAgICAvLyBSZXR1cm4gYW4gb2JqZWN0IG9mIGVsZW1lbnQgYXR0cmlidXRlc1xuICAgICAgICB2YXIgbmV3QXR0cnMgPSB7fTtcbiAgICAgICAgdmFyIHJpbmxpbmVqUXVlcnkgPSAvXmpRdWVyeVxcZCskLztcblxuICAgICAgICAkLmVhY2goZWxlbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihpLCBhdHRyKSB7XG4gICAgICAgICAgICBpZiAoYXR0ci5zcGVjaWZpZWQgJiYgIXJpbmxpbmVqUXVlcnkudGVzdChhdHRyLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cnNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXdBdHRycztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhclBsYWNlaG9sZGVyKGV2ZW50LCB2YWx1ZSkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoaW5wdXQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlucHV0LnZhbHVlID09PSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSAmJiAkaW5wdXQuaGFzQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAkaW5wdXQucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpO1xuXG4gICAgICAgICAgICBpZiAoJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJykpIHtcblxuICAgICAgICAgICAgICAgICRpbnB1dCA9ICRpbnB1dC5oaWRlKCkubmV4dEFsbCgnaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdOmZpcnN0Jykuc2hvdygpLmF0dHIoJ2lkJywgJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuZGF0YSgncGxhY2Vob2xkZXItaWQnKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSWYgYGNsZWFyUGxhY2Vob2xkZXJgIHdhcyBjYWxsZWQgZnJvbSBgJC52YWxIb29rcy5pbnB1dC5zZXRgXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dFswXS52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkaW5wdXQuZm9jdXMoKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9PSBzYWZlQWN0aXZlRWxlbWVudCgpICYmIGlucHV0LnNlbGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0UGxhY2Vob2xkZXIoZXZlbnQpIHtcbiAgICAgICAgdmFyICRyZXBsYWNlbWVudDtcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoaW5wdXQpO1xuICAgICAgICB2YXIgaWQgPSBpbnB1dC5pZDtcblxuICAgICAgICAvLyBJZiB0aGUgcGxhY2Vob2xkZXIgaXMgYWN0aXZhdGVkLCB0cmlnZ2VyaW5nIGJsdXIgZXZlbnQgKGAkaW5wdXQudHJpZ2dlcignYmx1cicpYCkgc2hvdWxkIGRvIG5vdGhpbmcuXG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAnYmx1cicpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCRpbnB1dC5oYXNDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50ID0gJGlucHV0LnByZXZBbGwoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdOmZpcnN0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKCRyZXBsYWNlbWVudC5sZW5ndGggPiAwICYmICRyZXBsYWNlbWVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlucHV0LnZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoISRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKSkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudCA9ICRpbnB1dC5jbG9uZSgpLnByb3AoeyAndHlwZSc6ICd0ZXh0JyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnQgPSAkKCc8aW5wdXQ+JykuYXR0cigkLmV4dGVuZChhcmdzKHRoaXMpLCB7ICd0eXBlJzogJ3RleHQnIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ25hbWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZWhvbGRlci1lbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItcGFzc3dvcmQnOiAkaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BsYWNlaG9sZGVyLWlkJzogaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmluZCgnZm9jdXMucGxhY2Vob2xkZXInLCBjbGVhclBsYWNlaG9sZGVyKTtcblxuICAgICAgICAgICAgICAgICAgICAkaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItdGV4dGlucHV0JzogJHJlcGxhY2VtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZWhvbGRlci1pZCc6IGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmJlZm9yZSgkcmVwbGFjZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgJGlucHV0ID0gJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuaGlkZSgpLnByZXZBbGwoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdOmZpcnN0JykuYXR0cignaWQnLCAkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItaWQnKSkuc2hvdygpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dCA9ICRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRwYXNzd29yZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC5hdHRyKCdpZCcsICRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1pZCcpKS5zaG93KCkubmV4dEFsbCgnaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdOmxhc3QnKS5oaWRlKCkucmVtb3ZlQXR0cignaWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRpbnB1dC5hZGRDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcyk7XG4gICAgICAgICAgICAkaW5wdXRbMF0udmFsdWUgPSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGlucHV0LnJlbW92ZUNsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhZmVBY3RpdmVFbGVtZW50KCkge1xuICAgICAgICAvLyBBdm9pZCBJRTkgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIG9mIGRlYXRoXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7fVxuICAgIH1cbn0pKTtcbiIsIi8qKlxuKiBqcXVlcnkubWF0Y2hIZWlnaHQuanMgbWFzdGVyXG4qIGh0dHA6Ly9icm0uaW8vanF1ZXJ5LW1hdGNoLWhlaWdodC9cbiogTGljZW5zZTogTUlUXG4qL1xuXG47KGZ1bmN0aW9uKCQpIHtcbiAgICAvKlxuICAgICogIGludGVybmFsXG4gICAgKi9cblxuICAgIHZhciBfcHJldmlvdXNSZXNpemVXaWR0aCA9IC0xLFxuICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xuXG4gICAgLypcbiAgICAqICBfcGFyc2VcbiAgICAqICB2YWx1ZSBwYXJzZSB1dGlsaXR5IGZ1bmN0aW9uXG4gICAgKi9cblxuICAgIHZhciBfcGFyc2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAvLyBwYXJzZSB2YWx1ZSBhbmQgY29udmVydCBOYU4gdG8gMFxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgfHwgMDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBfcm93c1xuICAgICogIHV0aWxpdHkgZnVuY3Rpb24gcmV0dXJucyBhcnJheSBvZiBqUXVlcnkgc2VsZWN0aW9ucyByZXByZXNlbnRpbmcgZWFjaCByb3dcbiAgICAqICAoYXMgZGlzcGxheWVkIGFmdGVyIGZsb2F0IHdyYXBwaW5nIGFwcGxpZWQgYnkgYnJvd3NlcilcbiAgICAqL1xuXG4gICAgdmFyIF9yb3dzID0gZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIHRvbGVyYW5jZSA9IDEsXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcbiAgICAgICAgICAgIGxhc3RUb3AgPSBudWxsLFxuICAgICAgICAgICAgcm93cyA9IFtdO1xuXG4gICAgICAgIC8vIGdyb3VwIGVsZW1lbnRzIGJ5IHRoZWlyIHRvcCBwb3NpdGlvblxuICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0b3AgPSAkdGhhdC5vZmZzZXQoKS50b3AgLSBfcGFyc2UoJHRoYXQuY3NzKCdtYXJnaW4tdG9wJykpLFxuICAgICAgICAgICAgICAgIGxhc3RSb3cgPSByb3dzLmxlbmd0aCA+IDAgPyByb3dzW3Jvd3MubGVuZ3RoIC0gMV0gOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAobGFzdFJvdyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGZpcnN0IGl0ZW0gb24gdGhlIHJvdywgc28ganVzdCBwdXNoIGl0XG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvdyB0b3AgaXMgdGhlIHNhbWUsIGFkZCB0byB0aGUgcm93IGdyb3VwXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5hYnMobGFzdFRvcCAtIHRvcCkpIDw9IHRvbGVyYW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByb3dzW3Jvd3MubGVuZ3RoIC0gMV0gPSBsYXN0Um93LmFkZCgkdGhhdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0YXJ0IGEgbmV3IHJvdyBncm91cFxuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goJHRoYXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgbGFzdCByb3cgdG9wXG4gICAgICAgICAgICBsYXN0VG9wID0gdG9wO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBfcGFyc2VPcHRpb25zXG4gICAgKiAgaGFuZGxlIHBsdWdpbiBvcHRpb25zXG4gICAgKi9cblxuICAgIHZhciBfcGFyc2VPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIGJ5Um93OiB0cnVlLFxuICAgICAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgICAgICAgcmVtb3ZlOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZChvcHRzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBvcHRzLmJ5Um93ID0gb3B0aW9ucztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSAncmVtb3ZlJykge1xuICAgICAgICAgICAgb3B0cy5yZW1vdmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdHM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgbWF0Y2hIZWlnaHRcbiAgICAqICBwbHVnaW4gZGVmaW5pdGlvblxuICAgICovXG5cbiAgICB2YXIgbWF0Y2hIZWlnaHQgPSAkLmZuLm1hdGNoSGVpZ2h0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0cyA9IF9wYXJzZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHJlbW92ZVxuICAgICAgICBpZiAob3B0cy5yZW1vdmUpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZpeGVkIGhlaWdodCBmcm9tIGFsbCBzZWxlY3RlZCBlbGVtZW50c1xuICAgICAgICAgICAgdGhpcy5jc3Mob3B0cy5wcm9wZXJ0eSwgJycpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgc2VsZWN0ZWQgZWxlbWVudHMgZnJvbSBhbGwgZ3JvdXBzXG4gICAgICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oa2V5LCBncm91cCkge1xuICAgICAgICAgICAgICAgIGdyb3VwLmVsZW1lbnRzID0gZ3JvdXAuZWxlbWVudHMubm90KHRoYXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IGNsZWFudXAgZW1wdHkgZ3JvdXBzXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IDEgJiYgIW9wdHMudGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhpcyBncm91cCBzbyB3ZSBjYW4gcmUtYXBwbHkgbGF0ZXIgb24gbG9hZCBhbmQgcmVzaXplIGV2ZW50c1xuICAgICAgICBtYXRjaEhlaWdodC5fZ3JvdXBzLnB1c2goe1xuICAgICAgICAgICAgZWxlbWVudHM6IHRoaXMsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG1hdGNoIGVhY2ggZWxlbWVudCdzIGhlaWdodCB0byB0aGUgdGFsbGVzdCBlbGVtZW50IGluIHRoZSBzZWxlY3Rpb25cbiAgICAgICAgbWF0Y2hIZWlnaHQuX2FwcGx5KHRoaXMsIG9wdHMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIHBsdWdpbiBnbG9iYWwgb3B0aW9uc1xuICAgICovXG5cbiAgICBtYXRjaEhlaWdodC5fZ3JvdXBzID0gW107XG4gICAgbWF0Y2hIZWlnaHQuX3Rocm90dGxlID0gODA7XG4gICAgbWF0Y2hIZWlnaHQuX21haW50YWluU2Nyb2xsID0gZmFsc2U7XG4gICAgbWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZSA9IG51bGw7XG4gICAgbWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlID0gbnVsbDtcblxuICAgIC8qXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5XG4gICAgKiAgYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZ2l2ZW4gZWxlbWVudHNcbiAgICAqL1xuXG4gICAgbWF0Y2hIZWlnaHQuX2FwcGx5ID0gZnVuY3Rpb24oZWxlbWVudHMsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpLFxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXG4gICAgICAgICAgICByb3dzID0gWyRlbGVtZW50c107XG5cbiAgICAgICAgLy8gdGFrZSBub3RlIG9mIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgaHRtbEhlaWdodCA9ICQoJ2h0bWwnKS5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgICAgICAvLyBnZXQgaGlkZGVuIHBhcmVudHNcbiAgICAgICAgdmFyICRoaWRkZW5QYXJlbnRzID0gJGVsZW1lbnRzLnBhcmVudHMoKS5maWx0ZXIoJzpoaWRkZW4nKTtcblxuICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnLCAkdGhhdC5hdHRyKCdzdHlsZScpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdGVtcG9yYXJpbHkgbXVzdCBmb3JjZSBoaWRkZW4gcGFyZW50cyB2aXNpYmxlXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICAgIC8vIGdldCByb3dzIGlmIHVzaW5nIGJ5Um93LCBvdGhlcndpc2UgYXNzdW1lIG9uZSByb3dcbiAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgIW9wdHMudGFyZ2V0KSB7XG5cbiAgICAgICAgICAgIC8vIG11c3QgZmlyc3QgZm9yY2UgYW4gYXJiaXRyYXJ5IGVxdWFsIGhlaWdodCBzbyBmbG9hdGluZyBlbGVtZW50cyBicmVhayBldmVubHlcbiAgICAgICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAkdGhhdC5jc3MoJ2Rpc3BsYXknKTtcblxuICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGZvcmNlIGEgdXNhYmxlIGRpc3BsYXkgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAoZGlzcGxheSAhPT0gJ2lubGluZS1ibG9jaycgJiYgZGlzcGxheSAhPT0gJ2lubGluZS1mbGV4Jykge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXG4gICAgICAgICAgICAgICAgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnLCAkdGhhdC5hdHRyKCdzdHlsZScpKTtcblxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogZGlzcGxheSxcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctdG9wJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy1ib3R0b20nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdtYXJnaW4tdG9wJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLWJvdHRvbSc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci10b3Atd2lkdGgnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdib3JkZXItYm90dG9tLXdpZHRoJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMHB4J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGdldCB0aGUgYXJyYXkgb2Ygcm93cyAoYmFzZWQgb24gZWxlbWVudCB0b3AgcG9zaXRpb24pXG4gICAgICAgICAgICByb3dzID0gX3Jvd3MoJGVsZW1lbnRzKTtcblxuICAgICAgICAgICAgLy8gcmV2ZXJ0IG9yaWdpbmFsIGlubGluZSBzdHlsZXNcbiAgICAgICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8ICcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5lYWNoKHJvd3MsIGZ1bmN0aW9uKGtleSwgcm93KSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQocm93KSxcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAwO1xuXG4gICAgICAgICAgICBpZiAoIW9wdHMudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCBhcHBseSB0byByb3dzIHdpdGggb25seSBvbmUgaXRlbVxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICRyb3cubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvdy5jc3Mob3B0cy5wcm9wZXJ0eSwgJycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBmaW5kIHRoZSBtYXggaGVpZ2h0XG4gICAgICAgICAgICAgICAgJHJvdy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJpbHkgZm9yY2UgYSB1c2FibGUgZGlzcGxheSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheSAhPT0gJ2lubGluZS1ibG9jaycgJiYgZGlzcGxheSAhPT0gJ2lubGluZS1mbGV4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgd2UgZ2V0IHRoZSBjb3JyZWN0IGFjdHVhbCBoZWlnaHQgKGFuZCBub3QgYSBwcmV2aW91c2x5IHNldCBoZWlnaHQgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHZhciBjc3MgPSB7ICdkaXNwbGF5JzogZGlzcGxheSB9O1xuICAgICAgICAgICAgICAgICAgICBjc3Nbb3B0cy5wcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKGNzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZmluZCB0aGUgbWF4IGhlaWdodCAoaW5jbHVkaW5nIHBhZGRpbmcsIGJ1dCBub3QgbWFyZ2luKVxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpID4gdGFyZ2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAkdGhhdC5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnQgZGlzcGxheSBibG9ja1xuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRhcmdldCBzZXQsIHVzZSB0aGUgaGVpZ2h0IG9mIHRoZSB0YXJnZXQgZWxlbWVudFxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IG9wdHMudGFyZ2V0Lm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBhcHBseSB0aGUgaGVpZ2h0IHRvIGFsbCBlbGVtZW50c1xuICAgICAgICAgICAgJHJvdy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFwcGx5IHRvIGEgdGFyZ2V0XG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudGFyZ2V0ICYmICR0aGF0LmlzKG9wdHMudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIHBhZGRpbmcgYW5kIGJvcmRlciBjb3JyZWN0bHkgKHJlcXVpcmVkIHdoZW4gbm90IHVzaW5nIGJvcmRlci1ib3gpXG4gICAgICAgICAgICAgICAgaWYgKCR0aGF0LmNzcygnYm94LXNpemluZycpICE9PSAnYm9yZGVyLWJveCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci10b3Atd2lkdGgnKSkgKyBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItYm90dG9tLXdpZHRoJykpO1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgKz0gX3BhcnNlKCR0aGF0LmNzcygncGFkZGluZy10b3AnKSkgKyBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLWJvdHRvbScpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIGhlaWdodCAoYWNjb3VudGluZyBmb3IgcGFkZGluZyBhbmQgYm9yZGVyKVxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyhvcHRzLnByb3BlcnR5LCAodGFyZ2V0SGVpZ2h0IC0gdmVydGljYWxQYWRkaW5nKSArICdweCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJldmVydCBoaWRkZW4gcGFyZW50c1xuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCBudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmVzdG9yZSBzY3JvbGwgcG9zaXRpb24gaWYgZW5hYmxlZFxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX21haW50YWluU2Nyb2xsKSB7XG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKChzY3JvbGxUb3AgLyBodG1sSGVpZ2h0KSAqICQoJ2h0bWwnKS5vdXRlckhlaWdodCh0cnVlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpXG4gICAgKiAgYXBwbGllcyBtYXRjaEhlaWdodCB0byBhbGwgZWxlbWVudHMgd2l0aCBhIGRhdGEtbWF0Y2gtaGVpZ2h0IGF0dHJpYnV0ZVxuICAgICovXG5cbiAgICBtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBncm91cHMgPSB7fTtcblxuICAgICAgICAvLyBnZW5lcmF0ZSBncm91cHMgYnkgdGhlaXIgZ3JvdXBJZCBzZXQgYnkgZWxlbWVudHMgdXNpbmcgZGF0YS1tYXRjaC1oZWlnaHRcbiAgICAgICAgJCgnW2RhdGEtbWF0Y2gtaGVpZ2h0XSwgW2RhdGEtbWhdJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZ3JvdXBJZCA9ICR0aGlzLmF0dHIoJ2RhdGEtbWgnKSB8fCAkdGhpcy5hdHRyKCdkYXRhLW1hdGNoLWhlaWdodCcpO1xuXG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCBpbiBncm91cHMpIHtcbiAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBJZF0gPSBncm91cHNbZ3JvdXBJZF0uYWRkKCR0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gJHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFwcGx5IG1hdGNoSGVpZ2h0IHRvIGVhY2ggZ3JvdXBcbiAgICAgICAgJC5lYWNoKGdyb3VwcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm1hdGNoSGVpZ2h0KHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBtYXRjaEhlaWdodC5fdXBkYXRlXG4gICAgKiAgdXBkYXRlcyBtYXRjaEhlaWdodCBvbiBhbGwgY3VycmVudCBncm91cHMgd2l0aCB0aGVpciBjb3JyZWN0IG9wdGlvbnNcbiAgICAqL1xuXG4gICAgdmFyIF91cGRhdGUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZSkge1xuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XG4gICAgICAgIH1cblxuICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcy5lbGVtZW50cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSkge1xuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlKGV2ZW50LCBtYXRjaEhlaWdodC5fZ3JvdXBzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtYXRjaEhlaWdodC5fdXBkYXRlID0gZnVuY3Rpb24odGhyb3R0bGUsIGV2ZW50KSB7XG4gICAgICAgIC8vIHByZXZlbnQgdXBkYXRlIGlmIGZpcmVkIGZyb20gYSByZXNpemUgZXZlbnRcbiAgICAgICAgLy8gd2hlcmUgdGhlIHZpZXdwb3J0IHdpZHRoIGhhc24ndCBhY3R1YWxseSBjaGFuZ2VkXG4gICAgICAgIC8vIGZpeGVzIGFuIGV2ZW50IGxvb3BpbmcgYnVnIGluIElFOFxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ3Jlc2l6ZScpIHtcbiAgICAgICAgICAgIHZhciB3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoID09PSBfcHJldmlvdXNSZXNpemVXaWR0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gd2luZG93V2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aHJvdHRsZSB1cGRhdGVzXG4gICAgICAgIGlmICghdGhyb3R0bGUpIHtcbiAgICAgICAgICAgIF91cGRhdGUoZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKF91cGRhdGVUaW1lb3V0ID09PSAtMSkge1xuICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF91cGRhdGUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XG4gICAgICAgICAgICB9LCBtYXRjaEhlaWdodC5fdGhyb3R0bGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgYmluZCBldmVudHNcbiAgICAqL1xuXG4gICAgLy8gYXBwbHkgb24gRE9NIHJlYWR5IGV2ZW50XG4gICAgJChtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpKTtcblxuICAgIC8vIHVwZGF0ZSBoZWlnaHRzIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcbiAgICAkKHdpbmRvdykuYmluZCgnbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUoZmFsc2UsIGV2ZW50KTtcbiAgICB9KTtcblxuICAgIC8vIHRocm90dGxlZCB1cGRhdGUgaGVpZ2h0cyBvbiByZXNpemUgZXZlbnRzXG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUodHJ1ZSwgZXZlbnQpO1xuICAgIH0pO1xuXG59KShqUXVlcnkpO1xuIiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSlMgUExVR0lOU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xuXG5cbi8vIEdldCBDdXJyZW50IEJyZWFrcG9pbnQgKEdsb2JhbClcbnZhciBicmVha3BvaW50ID0ge1xuXHRuYW1lOiAnJyxcblx0cmVmcmVzaDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5uYW1lID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cXFwiL2csICcnKTtcblx0fVxufTtcbmpRdWVyeSh3aW5kb3cpLnJlc2l6ZSggZnVuY3Rpb24oKSB7IGJyZWFrcG9pbnQucmVmcmVzaCgpOyB9KS5yZXNpemUoKTtcblxuXG4vLyBSZXNpemUgSWZyYW1lcyBQcm9wb3J0aW9uYWxseVxuZnVuY3Rpb24gaWZyYW1lQXNwZWN0KHNlbGVjdG9yKSB7XG5cdHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgalF1ZXJ5KCdpZnJhbWUnKTtcblxuXHRzZWxlY3Rvci5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHQvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG5cdFx0dmFyIGlmcmFtZSA9IGpRdWVyeSh0aGlzKSxcblx0XHRcdHdpZHRoICA9IGlmcmFtZS53aWR0aCgpO1xuXHRcdGlmICggdHlwZW9mKGlmcmFtZS5kYXRhKCdyYXRpbycpKSA9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHZhciBhdHRyVyA9IHRoaXMud2lkdGgsXG5cdFx0XHRcdGF0dHJIID0gdGhpcy5oZWlnaHQ7XG5cdFx0XHRpZnJhbWUuZGF0YSgncmF0aW8nLCBhdHRySCAvIGF0dHJXICkucmVtb3ZlQXR0cignd2lkdGgnKS5yZW1vdmVBdHRyKCdoZWlnaHQnKTtcblx0XHR9XG5cdFx0aWZyYW1lLmhlaWdodCggd2lkdGggKiBpZnJhbWUuZGF0YSgncmF0aW8nKSApLmNzcygnbWF4LWhlaWdodCcsICcnKTtcblx0fSk7XG59XG5cblxuLy8gTGlnaHRlbiAvIERhcmtlbiBDb2xvclxuLy8gQ3JlZGl0IFwiUGltcCBUcml6a2l0XCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNjkzOTI3L3BpbXAtdHJpemtpdFxuZnVuY3Rpb24gc2hhZGVDb2xvcihjb2xvciwgcGVyY2VudCkgeyAgIFxuXHR2YXIgZj1wYXJzZUludChjb2xvci5zbGljZSgxKSwxNiksdD1wZXJjZW50PDA/MDoyNTUscD1wZXJjZW50PDA/cGVyY2VudCotMTpwZXJjZW50LFI9Zj4+MTYsRz1mPj44JjB4MDBGRixCPWYmMHgwMDAwRkY7XG5cdHJldHVybiAnIycrKDB4MTAwMDAwMCsoTWF0aC5yb3VuZCgodC1SKSpwKStSKSoweDEwMDAwKyhNYXRoLnJvdW5kKCh0LUcpKnApK0cpKjB4MTAwKyhNYXRoLnJvdW5kKCh0LUIpKnApK0IpKS50b1N0cmluZygxNikuc2xpY2UoMSk7XG59XG5cblxuLy8gQmxlbmQgQ29sb3JzXG4vLyBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcblx0dmFyIGY9cGFyc2VJbnQoYzAuc2xpY2UoMSksMTYpLHQ9cGFyc2VJbnQoYzEuc2xpY2UoMSksMTYpLFIxPWY+PjE2LEcxPWY+PjgmMHgwMEZGLEIxPWYmMHgwMDAwRkYsUjI9dD4+MTYsRzI9dD4+OCYweDAwRkYsQjI9dCYweDAwMDBGRjtcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKChSMi1SMSkqcCkrUjEpKjB4MTAwMDArKE1hdGgucm91bmQoKEcyLUcxKSpwKStHMSkqMHgxMDArKE1hdGgucm91bmQoKEIyLUIxKSpwKStCMSkpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbn1cblxuXG4vLyBDb252ZXJ0IGNvbG9yIHRvIFJHQmFcbmZ1bmN0aW9uIGNvbG9yVG9SZ2JhKGNvbG9yLCBvcGFjaXR5KSB7XG5cdGlmICggY29sb3Iuc3Vic3RyaW5nKDAsNCkgPT0gJ3JnYmEnICkge1xuXHRcdHZhciBhbHBoYSA9IGNvbG9yLm1hdGNoKC8oW15cXCxdKilcXCkkLyk7XG5cdFx0cmV0dXJuIGNvbG9yLnJlcGxhY2UoYWxwaGFbMV0sIG9wYWNpdHkpO1xuXHR9IGVsc2UgaWYgKCBjb2xvci5zdWJzdHJpbmcoMCwzKSA9PSAncmdiJyApIHtcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCAnLCAnK29wYWNpdHkrJyknKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgaGV4ID0gY29sb3IucmVwbGFjZSgnIycsJycpLFxuXHRcdFx0ciA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwyKSwgMTYpLFxuXHRcdFx0ZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpLFxuXHRcdFx0YiA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNCw2KSwgMTYpLFxuXHRcdFx0cmVzdWx0ID0gJ3JnYmEoJytyKycsJytnKycsJytiKycsJytvcGFjaXR5KycpJztcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cblxuLy8gQ29sb3IgTGlnaHQgT3IgRGFya1xuLy8gQ3JlZGl0IFwiTGFycnkgRm94XCIgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9sYXJyeWZveC8xNjM2MzM4XG5mdW5jdGlvbiBjb2xvckxvRChjb2xvcikge1xuXHR2YXIgcixiLGcsaHNwLGEgPSBjb2xvcjtcblx0aWYgKGEubWF0Y2goL15yZ2IvKSkge1xuXHRcdGEgPSBhLm1hdGNoKC9ecmdiYT9cXCgoXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspKD86LFxccyooXFxkKyg/OlxcLlxcZCspPykpP1xcKSQvKTtcblx0XHRyID0gYVsxXTtcblx0XHRiID0gYVsyXTtcblx0XHRnID0gYVszXTtcblx0fSBlbHNlIHtcblx0XHRhID0gKygnMHgnICsgYS5zbGljZSgxKS5yZXBsYWNlKGEubGVuZ3RoIDwgNSAmJiAvLi9nLCAnJCYkJicpKTtcblx0XHRyID0gYSA+PiAxNjtcblx0XHRiID0gYSA+PiA4ICYgMjU1O1xuXHRcdGcgPSBhICYgMjU1O1xuXHR9XG5cdGhzcCA9IE1hdGguc3FydCggMC4yOTkgKiAociAqIHIpICsgMC41ODcgKiAoZyAqIGcpICsgMC4xMTQgKiAoYiAqIGIpICk7XG5cdHJldHVybiAoIGhzcCA+IDEyNy41ICkgPyAnbGlnaHQnIDogJ2RhcmsnO1xufSBcblxuXG4vLyBJbWFnZSBMaWdodCBPciBEYXJrIEltYWdlXG4vLyBDcmVkaXQgXCJKb3NlcGggUG9ydGVsbGlcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy8xNDk2MzYvam9zZXBoLXBvcnRlbGxpXG5mdW5jdGlvbiBpbWFnZUxvRChpbWFnZVNyYywgY2FsbGJhY2spIHtcblx0dmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXHRpbWcuc3JjID0gaW1hZ2VTcmM7XG5cdGltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltZyk7XG5cblx0dmFyIGNvbG9yU3VtID0gMDtcblxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gY3JlYXRlIGNhbnZhc1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMsMCwwKTtcblxuXHRcdHZhciBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XG5cdFx0dmFyIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcblx0XHR2YXIgcixnLGIsYXZnO1xuXG5cdFx0Zm9yKHZhciB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHgrPTQpIHtcblx0XHRcdHIgPSBkYXRhW3hdO1xuXHRcdFx0ZyA9IGRhdGFbeCsxXTtcblx0XHRcdGIgPSBkYXRhW3grMl07XG5cblx0XHRcdGF2ZyA9IE1hdGguZmxvb3IoKHIrZytiKS8zKTtcblx0XHRcdGNvbG9yU3VtICs9IGF2Zztcblx0XHR9XG5cblx0XHR2YXIgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAodGhpcy53aWR0aCp0aGlzLmhlaWdodCkpO1xuXHRcdGNhbGxiYWNrKGJyaWdodG5lc3MpO1xuXHR9O1xufVxuXG5cbi8vIFJlc2l6ZSBJbWFnZSBUbyBGaWxsIENvbnRhaW5lciBTaXplXG5mdW5jdGlvbiBpbWFnZUNvdmVyKGNvbnQsIHR5cGUsIGNvcnJIKSB7XG5cdHR5cGUgPSB0eXBlIHx8ICdiZyc7XG5cblx0Y29udC5hZGRDbGFzcygnaW1hZ2UtY292ZXInKTtcblxuXHR2YXIgaW1nLCBpbWdVcmwsIGltZ1dpZHRoID0gMCwgaW1nSGVpZ2h0ID0gMDtcblxuXHRpZiAoIHR5cGUgPT0gJ2ltZycgKSB7XG5cdFx0aW1nID0gY29udC5maW5kKCcuYmctaW1nJyk7XG5cdFx0aW1nV2lkdGggID0gaW1nLndpZHRoKCk7XG5cdFx0aW1nSGVpZ2h0ID0gaW1nLmhlaWdodCgpO1xuXHR9IGVsc2Uge1xuXHRcdGltZ1VybCA9IGNvbnQuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJykubWF0Y2goL151cmxcXChcIj8oLis/KVwiP1xcKSQvKTtcblx0XHRpZiAoIGltZ1VybFsxXSApIHtcblx0XHQgICAgaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0ICAgIGltZy5zcmMgPSBpbWdVcmxbMV07XG5cdFx0ICAgIGltZ1dpZHRoICA9IGltZy53aWR0aDtcblx0XHQgICAgaW1nSGVpZ2h0ID0gaW1nLmhlaWdodDtcblx0XHR9XG5cdH1cblxuXHRpZiAoIGltZ1dpZHRoICE9PSAwICYmIGltZ0hlaWdodCAhPT0gMCApIHtcblx0XHR2YXIgY29udFdpZHRoICA9IGNvbnQub3V0ZXJXaWR0aCgpLFxuXHRcdFx0Y29udEhlaWdodCA9IGNvbnQub3V0ZXJIZWlnaHQoKSxcblx0XHRcdGhlaWdodERpZmYgPSBjb250V2lkdGggLyBpbWdXaWR0aCAqIGltZ0hlaWdodCxcblx0XHRcdG5ld1dpZHRoICAgPSAnYXV0bycsXG5cdFx0XHRuZXdIZWlnaHQgID0gY29udEhlaWdodCArIGNvcnJIICsgJ3B4JztcblxuXHRcdFx0aWYgKCBoZWlnaHREaWZmID4gY29udEhlaWdodCApIHtcblx0XHRcdFx0bmV3V2lkdGggID0gJzEwMCUnO1xuXHRcdFx0XHRuZXdIZWlnaHQgPSAnYXV0byc7XG5cdFx0XHR9XG5cblx0XHRpZiAoIHR5cGUgPT0gJ2ltZycgKSB7XG5cdFx0XHRpbWcuY3NzKHsgd2lkdGg6IG5ld1dpZHRoLCBoZWlnaHQ6IG5ld0hlaWdodCB9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udC5jc3MoJ2JhY2tncm91bmQtc2l6ZScsIG5ld1dpZHRoICsgJyAnICsgbmV3SGVpZ2h0KTtcblx0XHR9XG5cdH1cbn1cblxuXG4vLyBEZXRlcm1pbmUgSWYgQW4gRWxlbWVudCBJcyBTY3JvbGxlZCBJbnRvIFZpZXdcbmZ1bmN0aW9uIGVsZW1WaXNpYmxlKGVsZW0sIGNvbnQpIHtcblx0dmFyIGNvbnRUb3AgPSBjb250LnNjcm9sbFRvcCgpLFxuXHRcdGNvbnRCdG0gPSBjb250VG9wICsgY29udC5oZWlnaHQoKSxcblx0XHRlbGVtVG9wID0gZWxlbS5vZmZzZXQoKS50b3AsXG5cdFx0ZWxlbUJ0bSA9IGVsZW1Ub3AgKyBlbGVtLmhlaWdodCgpO1xuXG5cdHJldHVybiAoKGVsZW1CdG0gPD0gY29udEJ0bSkgJiYgKGVsZW1Ub3AgPj0gY29udFRvcCkpO1xufVxuXG5cbi8vIFNtb290aCBTY3JvbGxpbmcgRm9yIFdlYmtpdCBCcm93c2Vyc1xuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2lhaG5uL0ZpcmVmb3gtbGlrZS1zbW9vdGgtc2Nyb2xsLWZvci1jaHJvbWVcbnZhciBNaXh0X1Ntb290aFNjcm9sbCA9IHtcblx0cm9vdDogICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXHRhY3RpdmU6ICBkb2N1bWVudC5ib2R5LFxuXHRwZW5kaW5nOiBmYWxzZSxcblx0ZnJhbWU6ICAgZmFsc2UsXG5cdGNhY2hlOiAgIHt9LFxuXHRxdWV1ZTogICB7fSxcblx0ZGlyOiAgICAgeyB4OiAwLCB5OiAwIH0sXG5cdGZyYW1lcmF0ZTogNjAsXG5cdGFuaW1fdGltZTogMjAwLFxuXHRzdGVwX3NpemU6IDUwLFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwbGF0Zm9ybSAgPSBuYXZpZ2F0b3IucGxhdGZvcm0udG9Mb3dlckNhc2UoKTtcblx0XHRpZiAoICEgalF1ZXJ5LmJyb3dzZXIud2Via2l0IHx8ICggcGxhdGZvcm0uaW5kZXhPZignd2luJykgIT0gMCAmJiBwbGF0Zm9ybS5pbmRleE9mKCdsaW51eCcpICE9IDAgKSApIHJldHVybjtcblxuXHRcdHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSxcblx0XHRcdGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRcdGlubmVySGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuXHRcdFx0c2Nyb2xsSGVpZ2h0ID0gYm9keS5zY3JvbGxIZWlnaHQ7XG5cblx0XHRNaXh0X1Ntb290aFNjcm9sbC5hZGRMaXN0ZW5lcnMoKTtcblxuXHRcdE1peHRfU21vb3RoU2Nyb2xsLnJvb3QgPSAoIGRvY3VtZW50LmNvbXBhdE1vZGUuaW5kZXhPZignQ1NTJykgPj0gMCApID8gZG9jIDogYm9keTtcblx0XHRNaXh0X1Ntb290aFNjcm9sbC5hY3RpdmUgPSBib2R5O1xuXHRcdGlmICggd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZiApIHtcblx0XHRcdE1peHRfU21vb3RoU2Nyb2xsLmZyYW1lID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCBzY3JvbGxIZWlnaHQgPiBpbm5lckhlaWdodCAmJiAoIGJvZHkub2Zmc2V0SGVpZ2h0IDw9IGlubmVySGVpZ2h0IHx8IGRvYy5vZmZzZXRIZWlnaHQgPD0gaW5uZXJIZWlnaHQgKSApIHtcblx0XHRcdE1peHRfU21vb3RoU2Nyb2xsLnJvb3Quc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0aWYgKCBNaXh0X1Ntb290aFNjcm9sbC5yb290Lm9mZnNldEhlaWdodCA8PSBpbm5lckhlaWdodCApIHtcblx0XHRcdFx0dmFyIGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0aS5zdHlsZS5jbGVhciA9ICdib3RoJztcblx0XHRcdFx0Ym9keS5hcHBlbmRDaGlsZChpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2luZG93LnNldEludGVydmFsKCBmdW5jdGlvbiAoKSB7IE1peHRfU21vb3RoU2Nyb2xsLmNhY2hlID0ge307IH0sIDEwMDAwICk7XG5cdH0sXG5cblx0YWRkTGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgTWl4dF9TbW9vdGhTY3JvbGwubW91c2Vkb3duKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIE1peHRfU21vb3RoU2Nyb2xsLm1vdXNld2hlZWwpO1xuXHR9LFxuXG5cdG1vdXNlZG93bjogZnVuY3Rpb24oZSkgeyBNaXh0X1Ntb290aFNjcm9sbC5hY3RpdmUgPSBlLnRhcmdldDsgfSxcblxuXHRzY3JvbGxBcnJheTogZnVuY3Rpb24oZSwgdCwgbiwgcikge1xuXHRcdHIgPSByIHx8IDEwMDA7XG5cdFx0TWl4dF9TbW9vdGhTY3JvbGwuZGlyZWN0aW9uQ2hlY2sodCwgbik7XG5cdFx0TWl4dF9TbW9vdGhTY3JvbGwucXVldWUucHVzaCh7XG5cdFx0XHR4OiB0LCB5OiBuLFxuXHRcdFx0bGFzdFg6IHQgPCAwID8gMC45OSA6IC0wLjk5LFxuXHRcdFx0bGFzdFk6IG4gPCAwID8gMC45OSA6IC0wLjk5LFxuXHRcdFx0c3RhcnQ6ICsobmV3IERhdGUoKSlcblx0XHR9KTtcblxuXHRcdGlmICggTWl4dF9TbW9vdGhTY3JvbGwucGVuZGluZyApIHJldHVybjtcblxuXHRcdHZhciBpID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHMgPSArKG5ldyBEYXRlKCkpLFxuXHRcdFx0XHRvID0gMCxcblx0XHRcdFx0dSA9IDA7XG5cdFx0XHRmb3IgKCB2YXIgYSA9IDA7IGEgPCBNaXh0X1Ntb290aFNjcm9sbC5xdWV1ZS5sZW5ndGg7IGErKyApIHtcblx0XHRcdFx0dmFyIGYgPSBNaXh0X1Ntb290aFNjcm9sbC5xdWV1ZVthXSxcblx0XHRcdFx0XHRsID0gcyAtIGYuc3RhcnQsXG5cdFx0XHRcdFx0YyA9IGwgPj0gTWl4dF9TbW9vdGhTY3JvbGwuYW5pbV90aW1lLFxuXHRcdFx0XHRcdGggPSBjID8gMSA6IGwgLyBNaXh0X1Ntb290aFNjcm9sbC5hbmltX3RpbWUsXG5cdFx0XHRcdFx0cCA9IGYueCAqIGggLSBmLmxhc3RYID4+IDAsXG5cdFx0XHRcdFx0ZCA9IGYueSAqIGggLSBmLmxhc3RZID4+IDA7XG5cdFx0XHRcdG8gKz0gcDtcblx0XHRcdFx0dSArPSBkO1xuXHRcdFx0XHRmLmxhc3RYICs9IHA7XG5cdFx0XHRcdGYubGFzdFkgKz0gZDtcblx0XHRcdFx0aWYgKCBjICkge1xuXHRcdFx0XHRcdE1peHRfU21vb3RoU2Nyb2xsLnF1ZXVlLnNwbGljZShhLCAxKTtcblx0XHRcdFx0XHRhLS07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICggdCApIHtcblx0XHRcdFx0dmFyIHYgPSBlLnNjcm9sbExlZnQ7XG5cdFx0XHRcdGUuc2Nyb2xsTGVmdCArPSBvO1xuXHRcdFx0XHRpZiAoIG8gJiYgZS5zY3JvbGxMZWZ0ID09PSB2ICkgeyB0ID0gMDsgfVxuXHRcdFx0fVxuXHRcdFx0aWYgKCBuKSB7XG5cdFx0XHRcdHZhciBtID0gZS5zY3JvbGxUb3A7XG5cdFx0XHRcdGUuc2Nyb2xsVG9wICs9IHU7XG5cdFx0XHRcdGlmICggdSAmJiBlLnNjcm9sbFRvcCA9PT0gbSApIHsgbiA9IDA7IH1cblx0XHRcdH1cblx0XHRcdGlmICggISB0ICYmICEgbiApIE1peHRfU21vb3RoU2Nyb2xsLnF1ZXVlID0gW107XG5cblx0XHRcdGlmICggTWl4dF9TbW9vdGhTY3JvbGwucXVldWUubGVuZ3RoICkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGksIHIgLyBNaXh0X1Ntb290aFNjcm9sbC5mcmFtZXJhdGUgKyAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdE1peHRfU21vb3RoU2Nyb2xsLnBlbmRpbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHNldFRpbWVvdXQoaSwgMCk7XG5cdFx0TWl4dF9TbW9vdGhTY3JvbGwucGVuZGluZyA9IHRydWU7XG5cdH0sXG5cblx0ZGlyZWN0aW9uQ2hlY2s6IGZ1bmN0aW9uKGUsIHQpIHtcblx0ICAgIGUgPSBlID4gMCA/IDEgOiAtMTtcblx0ICAgIHQgPSB0ID4gMCA/IDEgOiAtMTtcblx0ICAgIGlmICggTWl4dF9TbW9vdGhTY3JvbGwuZGlyLnggIT09IGUgfHwgTWl4dF9TbW9vdGhTY3JvbGwuZGlyLnkgIT09IHQgKSB7XG5cdCAgICAgICAgTWl4dF9TbW9vdGhTY3JvbGwuZGlyLnggPSBlO1xuXHQgICAgICAgIE1peHRfU21vb3RoU2Nyb2xsLmRpci55ID0gdDtcblx0ICAgICAgICBNaXh0X1Ntb290aFNjcm9sbC5xdWV1ZSA9IFtdO1xuXHQgICAgfVxuXHR9LFxuXG5cdG1vdXNld2hlZWw6IGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdCA9IGUudGFyZ2V0LFxuXHRcdFx0b2JqID0gTWl4dF9TbW9vdGhTY3JvbGwsXG5cdFx0XHRuID0gb2JqLm92ZXJmbG93aW5nQW5jZXN0b3IodCk7XG5cdFx0aWYgKCAhIG4gfHwgZS5kZWZhdWx0UHJldmVudGVkIHx8IG9iai5pc05vZGVOYW1lKG9iai5hY3RpdmUsICdlbWJlZCcpIHx8IG9iai5pc05vZGVOYW1lKHQsICdlbWJlZCcpICYmIC9cXC5wZGYvaS50ZXN0KHQuc3JjKSApIHsgcmV0dXJuIHRydWU7IH1cblx0XHR2YXIgciA9IGUud2hlZWxEZWx0YVggfHwgMCxcblx0XHRcdGkgPSBlLndoZWVsRGVsdGFZIHx8IDA7XG5cdFx0aWYgKCAhIHIgJiYgISBpICkgaSA9IGUud2hlZWxEZWx0YSB8fCAwO1xuXHRcdGlmICggTWF0aC5hYnMocikgPiAxLjIgKSByICo9IG9iai5zdGVwX3NpemUgLyAxMjA7XG5cdFx0aWYgKCBNYXRoLmFicyhpKSA+IDEuMiApIGkgKj0gb2JqLnN0ZXBfc2l6ZSAvIDEyMDtcblx0XHRvYmouc2Nyb2xsQXJyYXkobiwgLXIsIC1pKTtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdH0sXG5cblx0b3ZlcmZsb3dpbmdBbmNlc3RvcjogZnVuY3Rpb24oZSkge1xuXHRcdHZhciB0ID0gW107XG5cdFx0dmFyIG4gPSBNaXh0X1Ntb290aFNjcm9sbC5yb290LnNjcm9sbEhlaWdodDtcblx0XHRkbyB7XG5cdFx0XHR2YXIgciA9IE1peHRfU21vb3RoU2Nyb2xsLmNhY2hlW01peHRfU21vb3RoU2Nyb2xsLnVuaXF1ZUlEKGUpXTtcblx0XHRcdGlmICggciApIHsgcmV0dXJuIE1peHRfU21vb3RoU2Nyb2xsLnNldENhY2hlKHQsIHIpOyB9XG5cdFx0XHR0LnB1c2goZSk7XG5cdFx0XHRpZiAoIG4gPT09IGUuc2Nyb2xsSGVpZ2h0ICkge1xuXHRcdFx0XHRpZiAoICEgTWl4dF9TbW9vdGhTY3JvbGwuZnJhbWUgfHwgTWl4dF9TbW9vdGhTY3JvbGwucm9vdC5jbGllbnRIZWlnaHQgKyAxMCA8IG4gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1peHRfU21vb3RoU2Nyb2xsLnNldENhY2hlKHQsIGRvY3VtZW50LmJvZHkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCBlLmNsaWVudEhlaWdodCArIDEwIDwgZS5zY3JvbGxIZWlnaHQgKSB7XG5cdFx0XHRcdHZhciBvdmVyZmxvdyA9IGdldENvbXB1dGVkU3R5bGUoZSwgJycpLmdldFByb3BlcnR5VmFsdWUoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdGlmICggb3ZlcmZsb3cgPT09ICdzY3JvbGwnIHx8IG92ZXJmbG93ID09PSAnYXV0bycgKSB7IHJldHVybiBNaXh0X1Ntb290aFNjcm9sbC5zZXRDYWNoZSh0LCBlKTsgfVxuXHRcdFx0fVxuXHRcdH0gd2hpbGUgKCAoIGUgPSBlLnBhcmVudE5vZGUgKSAhPT0gbnVsbCApO1xuXHR9LFxuXG5cdHVuaXF1ZUlEOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZSA9IDA7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRyZXR1cm4gdC5NaXh0X1Ntb290aFNjcm9sbC51bmlxdWVJRCB8fCAoIHQuTWl4dF9TbW9vdGhTY3JvbGwudW5pcXVlSUQgPSBlKysgKTtcblx0XHR9O1xuXHR9LFxuXG5cdGlzTm9kZU5hbWU6IGZ1bmN0aW9uKGUsIHQpIHtcblx0XHRyZXR1cm4gZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0LnRvTG93ZXJDYXNlKCk7XG5cdH0sXG5cblx0c2V0Q2FjaGU6IGZ1bmN0aW9uKGUsIHQpIHtcblx0XHRmb3IgKCB2YXIgbiA9IGUubGVuZ3RoOyBuLS07ICkgTWl4dF9TbW9vdGhTY3JvbGwuY2FjaGVbTWl4dF9TbW9vdGhTY3JvbGwudW5pcXVlSUQoZVtuXSldID0gdDtcblx0XHRyZXR1cm4gdDtcblx0fVxufTtcblxuXG4oIGZ1bmN0aW9uKCQpIHtcblx0XG5cdC8vIFJlc2l6ZSB0ZXh0IGJhc2VkIG9uIGNvbnRhaW5lciB3aWR0aFxuXHQkLmZuLmJpZ1RleHQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQoe1xuXHRcdFx0J3JhdGlvJzogICAxLFxuXHRcdFx0J21pblNpemUnOiAxMixcblx0XHRcdCdtYXhTaXplJzogNTEyXG5cdFx0fSwgb3B0aW9ucyk7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRcdGRhdGEgID0gJHRoaXMuZGF0YSgpLFxuXHRcdFx0XHRyYXRpbyA9IGRhdGEuaGFzT3duUHJvcGVydHkoJ3JhdGlvJykgPyBkYXRhLnJhdGlvIDogc2V0dGluZ3MucmF0aW8sXG5cdFx0XHRcdG1pbiAgID0gZGF0YS5oYXNPd25Qcm9wZXJ0eSgnbWluU2l6ZScpID8gZGF0YS5taW5TaXplIDogc2V0dGluZ3MubWluU2l6ZSxcblx0XHRcdFx0bWF4ICAgPSBkYXRhLmhhc093blByb3BlcnR5KCdtYXhTaXplJykgPyBkYXRhLm1heFNpemUgOiBzZXR0aW5ncy5tYXhTaXplLFxuXHRcdFx0XHRmaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIGNoYXJzID0gJHRoaXMudGV4dCgpLmxlbmd0aCAqIDAuNTczNyxcblx0XHRcdFx0XHRcdHNpemUgPSBNYXRoLm1heChNYXRoLm1pbigkdGhpcy53aWR0aCgpICogKHJhdGlvIC8gY2hhcnMpLCBwYXJzZUZsb2F0KG1heCkpLCBwYXJzZUZsb2F0KG1pbikpO1xuXHRcdFx0XHRcdCR0aGlzLmNzcygnZm9udC1zaXplJywgc2l6ZSk7XG5cdFx0XHRcdFx0aWYgKCBzaXplIDw9IG1pbiApIHtcblx0XHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKCd3cmFwLXRleHQnKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ3dyYXAtdGV4dCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnaW5pdCcpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRmaXQoKTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBmaXQpO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0Ly8gRml4IFdQTUwgRHJvcGRvd25cblx0JCgnLm1lbnUtaXRlbS1sYW5ndWFnZScpLmFkZENsYXNzKCdkcm9wZG93biBkcm9wLW1lbnUnKS5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcGRvd24tbWVudScpO1xuXG5cdC8vIEZpeCBQb2x5TGFuZyBNZW51IEl0ZW1zIEFuZCBNYWtlIFRoZW0gRHJvcGRvd25cblx0JCgnLm1lbnUtaXRlbS5sYW5nLWl0ZW0nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXHR2YXIgaXRlbSA9ICQoJy5sYW5nLWl0ZW0uY3VycmVudC1sYW5nJyk7XG5cdGlmIChpdGVtLmxlbmd0aCA9PT0gMCkge1xuXHRcdGl0ZW0gPSAkKCcubGFuZy1pdGVtJykuZmlyc3QoKTtcblx0fVxuXHR2YXIgbGFuZ3MgPSBpdGVtLnNpYmxpbmdzKCcubGFuZy1pdGVtJyk7XG5cdGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpO1xuXHRsYW5ncy53cmFwQWxsKCc8dWwgY2xhc3M9XCJzdWItbWVudSBkcm9wZG93bi1tZW51XCI+PC91bD4nKS5wYXJlbnQoKS5hcHBlbmRUbyhpdGVtKTtcbn0pKGpRdWVyeSk7IiwiLyohIG1vZGVybml6ciAzLjIuMCAoQ3VzdG9tIEJ1aWxkKSB8IE1JVCAqXG4gKiBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZC8/LWZsZXhib3gtb2JqZWN0Zml0LXNoaXYgISovXG4hZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIHIoZSx0KXtyZXR1cm4gdHlwZW9mIGU9PT10fWZ1bmN0aW9uIG8oKXt2YXIgZSx0LG4sbyxhLGkscztmb3IodmFyIGwgaW4gQylpZihDLmhhc093blByb3BlcnR5KGwpKXtpZihlPVtdLHQ9Q1tsXSx0Lm5hbWUmJihlLnB1c2godC5uYW1lLnRvTG93ZXJDYXNlKCkpLHQub3B0aW9ucyYmdC5vcHRpb25zLmFsaWFzZXMmJnQub3B0aW9ucy5hbGlhc2VzLmxlbmd0aCkpZm9yKG49MDtuPHQub3B0aW9ucy5hbGlhc2VzLmxlbmd0aDtuKyspZS5wdXNoKHQub3B0aW9ucy5hbGlhc2VzW25dLnRvTG93ZXJDYXNlKCkpO2ZvcihvPXIodC5mbixcImZ1bmN0aW9uXCIpP3QuZm4oKTp0LmZuLGE9MDthPGUubGVuZ3RoO2ErKylpPWVbYV0scz1pLnNwbGl0KFwiLlwiKSwxPT09cy5sZW5ndGg/TW9kZXJuaXpyW3NbMF1dPW86KCFNb2Rlcm5penJbc1swXV18fE1vZGVybml6cltzWzBdXWluc3RhbmNlb2YgQm9vbGVhbnx8KE1vZGVybml6cltzWzBdXT1uZXcgQm9vbGVhbihNb2Rlcm5penJbc1swXV0pKSxNb2Rlcm5penJbc1swXV1bc1sxXV09bykseS5wdXNoKChvP1wiXCI6XCJuby1cIikrcy5qb2luKFwiLVwiKSl9fWZ1bmN0aW9uIGEoZSl7dmFyIHQ9eC5jbGFzc05hbWUsbj1Nb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeHx8XCJcIjtpZihiJiYodD10LmJhc2VWYWwpLE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUpTQ2xhc3Mpe3ZhciByPW5ldyBSZWdFeHAoXCIoXnxcXFxccylcIituK1wibm8tanMoXFxcXHN8JClcIik7dD10LnJlcGxhY2UocixcIiQxXCIrbitcImpzJDJcIil9TW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3NlcyYmKHQrPVwiIFwiK24rZS5qb2luKFwiIFwiK24pLGI/eC5jbGFzc05hbWUuYmFzZVZhbD10OnguY2xhc3NOYW1lPXQpfWZ1bmN0aW9uIGkoZSl7cmV0dXJuIGUucmVwbGFjZSgvKFthLXpdKS0oW2Etel0pL2csZnVuY3Rpb24oZSx0LG4pe3JldHVybiB0K24udG9VcHBlckNhc2UoKX0pLnJlcGxhY2UoL14tLyxcIlwiKX1mdW5jdGlvbiBzKGUsdCl7cmV0dXJuISF+KFwiXCIrZSkuaW5kZXhPZih0KX1mdW5jdGlvbiBsKCl7cmV0dXJuXCJmdW5jdGlvblwiIT10eXBlb2YgdC5jcmVhdGVFbGVtZW50P3QuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pOmI/dC5jcmVhdGVFbGVtZW50TlMuY2FsbCh0LFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixhcmd1bWVudHNbMF0pOnQuY3JlYXRlRWxlbWVudC5hcHBseSh0LGFyZ3VtZW50cyl9ZnVuY3Rpb24gZihlLHQpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBlLmFwcGx5KHQsYXJndW1lbnRzKX19ZnVuY3Rpb24gdShlLHQsbil7dmFyIG87Zm9yKHZhciBhIGluIGUpaWYoZVthXWluIHQpcmV0dXJuIG49PT0hMT9lW2FdOihvPXRbZVthXV0scihvLFwiZnVuY3Rpb25cIik/ZihvLG58fHQpOm8pO3JldHVybiExfWZ1bmN0aW9uIGMoZSl7cmV0dXJuIGUucmVwbGFjZSgvKFtBLVpdKS9nLGZ1bmN0aW9uKGUsdCl7cmV0dXJuXCItXCIrdC50b0xvd2VyQ2FzZSgpfSkucmVwbGFjZSgvXm1zLS8sXCItbXMtXCIpfWZ1bmN0aW9uIGQoKXt2YXIgZT10LmJvZHk7cmV0dXJuIGV8fChlPWwoYj9cInN2Z1wiOlwiYm9keVwiKSxlLmZha2U9ITApLGV9ZnVuY3Rpb24gcChlLG4scixvKXt2YXIgYSxpLHMsZix1PVwibW9kZXJuaXpyXCIsYz1sKFwiZGl2XCIpLHA9ZCgpO2lmKHBhcnNlSW50KHIsMTApKWZvcig7ci0tOylzPWwoXCJkaXZcIikscy5pZD1vP29bcl06dSsocisxKSxjLmFwcGVuZENoaWxkKHMpO3JldHVybiBhPWwoXCJzdHlsZVwiKSxhLnR5cGU9XCJ0ZXh0L2Nzc1wiLGEuaWQ9XCJzXCIrdSwocC5mYWtlP3A6YykuYXBwZW5kQ2hpbGQoYSkscC5hcHBlbmRDaGlsZChjKSxhLnN0eWxlU2hlZXQ/YS5zdHlsZVNoZWV0LmNzc1RleHQ9ZTphLmFwcGVuZENoaWxkKHQuY3JlYXRlVGV4dE5vZGUoZSkpLGMuaWQ9dSxwLmZha2UmJihwLnN0eWxlLmJhY2tncm91bmQ9XCJcIixwLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIsZj14LnN0eWxlLm92ZXJmbG93LHguc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIix4LmFwcGVuZENoaWxkKHApKSxpPW4oYyxlKSxwLmZha2U/KHAucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwKSx4LnN0eWxlLm92ZXJmbG93PWYseC5vZmZzZXRIZWlnaHQpOmMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjKSwhIWl9ZnVuY3Rpb24gbSh0LHIpe3ZhciBvPXQubGVuZ3RoO2lmKFwiQ1NTXCJpbiBlJiZcInN1cHBvcnRzXCJpbiBlLkNTUyl7Zm9yKDtvLS07KWlmKGUuQ1NTLnN1cHBvcnRzKGModFtvXSkscikpcmV0dXJuITA7cmV0dXJuITF9aWYoXCJDU1NTdXBwb3J0c1J1bGVcImluIGUpe2Zvcih2YXIgYT1bXTtvLS07KWEucHVzaChcIihcIitjKHRbb10pK1wiOlwiK3IrXCIpXCIpO3JldHVybiBhPWEuam9pbihcIiBvciBcIikscChcIkBzdXBwb3J0cyAoXCIrYStcIikgeyAjbW9kZXJuaXpyIHsgcG9zaXRpb246IGFic29sdXRlOyB9IH1cIixmdW5jdGlvbihlKXtyZXR1cm5cImFic29sdXRlXCI9PWdldENvbXB1dGVkU3R5bGUoZSxudWxsKS5wb3NpdGlvbn0pfXJldHVybiBufWZ1bmN0aW9uIGgoZSx0LG8sYSl7ZnVuY3Rpb24gZigpe2MmJihkZWxldGUgRi5zdHlsZSxkZWxldGUgRi5tb2RFbGVtKX1pZihhPXIoYSxcInVuZGVmaW5lZFwiKT8hMTphLCFyKG8sXCJ1bmRlZmluZWRcIikpe3ZhciB1PW0oZSxvKTtpZighcih1LFwidW5kZWZpbmVkXCIpKXJldHVybiB1fWZvcih2YXIgYyxkLHAsaCx2LGc9W1wibW9kZXJuaXpyXCIsXCJ0c3BhblwiXTshRi5zdHlsZTspYz0hMCxGLm1vZEVsZW09bChnLnNoaWZ0KCkpLEYuc3R5bGU9Ri5tb2RFbGVtLnN0eWxlO2ZvcihwPWUubGVuZ3RoLGQ9MDtwPmQ7ZCsrKWlmKGg9ZVtkXSx2PUYuc3R5bGVbaF0scyhoLFwiLVwiKSYmKGg9aShoKSksRi5zdHlsZVtoXSE9PW4pe2lmKGF8fHIobyxcInVuZGVmaW5lZFwiKSlyZXR1cm4gZigpLFwicGZ4XCI9PXQ/aDohMDt0cnl7Ri5zdHlsZVtoXT1vfWNhdGNoKHkpe31pZihGLnN0eWxlW2hdIT12KXJldHVybiBmKCksXCJwZnhcIj09dD9oOiEwfXJldHVybiBmKCksITF9ZnVuY3Rpb24gdihlLHQsbixvLGEpe3ZhciBpPWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrZS5zbGljZSgxKSxzPShlK1wiIFwiK3cuam9pbihpK1wiIFwiKStpKS5zcGxpdChcIiBcIik7cmV0dXJuIHIodCxcInN0cmluZ1wiKXx8cih0LFwidW5kZWZpbmVkXCIpP2gocyx0LG8sYSk6KHM9KGUrXCIgXCIrTi5qb2luKGkrXCIgXCIpK2kpLnNwbGl0KFwiIFwiKSx1KHMsdCxuKSl9ZnVuY3Rpb24gZyhlLHQscil7cmV0dXJuIHYoZSxuLG4sdCxyKX12YXIgeT1bXSxDPVtdLEU9e192ZXJzaW9uOlwiMy4yLjBcIixfY29uZmlnOntjbGFzc1ByZWZpeDpcIlwiLGVuYWJsZUNsYXNzZXM6ITAsZW5hYmxlSlNDbGFzczohMCx1c2VQcmVmaXhlczohMH0sX3E6W10sb246ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0KG5bZV0pfSwwKX0sYWRkVGVzdDpmdW5jdGlvbihlLHQsbil7Qy5wdXNoKHtuYW1lOmUsZm46dCxvcHRpb25zOm59KX0sYWRkQXN5bmNUZXN0OmZ1bmN0aW9uKGUpe0MucHVzaCh7bmFtZTpudWxsLGZuOmV9KX19LE1vZGVybml6cj1mdW5jdGlvbigpe307TW9kZXJuaXpyLnByb3RvdHlwZT1FLE1vZGVybml6cj1uZXcgTW9kZXJuaXpyO3ZhciB4PXQuZG9jdW1lbnRFbGVtZW50LGI9XCJzdmdcIj09PXgubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtifHwhZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCl7dmFyIG49ZS5jcmVhdGVFbGVtZW50KFwicFwiKSxyPWUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdfHxlLmRvY3VtZW50RWxlbWVudDtyZXR1cm4gbi5pbm5lckhUTUw9XCJ4PHN0eWxlPlwiK3QrXCI8L3N0eWxlPlwiLHIuaW5zZXJ0QmVmb3JlKG4ubGFzdENoaWxkLHIuZmlyc3RDaGlsZCl9ZnVuY3Rpb24gcigpe3ZhciBlPUMuZWxlbWVudHM7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGU/ZS5zcGxpdChcIiBcIik6ZX1mdW5jdGlvbiBvKGUsdCl7dmFyIG49Qy5lbGVtZW50cztcInN0cmluZ1wiIT10eXBlb2YgbiYmKG49bi5qb2luKFwiIFwiKSksXCJzdHJpbmdcIiE9dHlwZW9mIGUmJihlPWUuam9pbihcIiBcIikpLEMuZWxlbWVudHM9bitcIiBcIitlLGYodCl9ZnVuY3Rpb24gYShlKXt2YXIgdD15W2Vbdl1dO3JldHVybiB0fHwodD17fSxnKyssZVt2XT1nLHlbZ109dCksdH1mdW5jdGlvbiBpKGUsbixyKXtpZihufHwobj10KSxjKXJldHVybiBuLmNyZWF0ZUVsZW1lbnQoZSk7cnx8KHI9YShuKSk7dmFyIG87cmV0dXJuIG89ci5jYWNoZVtlXT9yLmNhY2hlW2VdLmNsb25lTm9kZSgpOmgudGVzdChlKT8oci5jYWNoZVtlXT1yLmNyZWF0ZUVsZW0oZSkpLmNsb25lTm9kZSgpOnIuY3JlYXRlRWxlbShlKSwhby5jYW5IYXZlQ2hpbGRyZW58fG0udGVzdChlKXx8by50YWdVcm4/bzpyLmZyYWcuYXBwZW5kQ2hpbGQobyl9ZnVuY3Rpb24gcyhlLG4pe2lmKGV8fChlPXQpLGMpcmV0dXJuIGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO249bnx8YShlKTtmb3IodmFyIG89bi5mcmFnLmNsb25lTm9kZSgpLGk9MCxzPXIoKSxsPXMubGVuZ3RoO2w+aTtpKyspby5jcmVhdGVFbGVtZW50KHNbaV0pO3JldHVybiBvfWZ1bmN0aW9uIGwoZSx0KXt0LmNhY2hlfHwodC5jYWNoZT17fSx0LmNyZWF0ZUVsZW09ZS5jcmVhdGVFbGVtZW50LHQuY3JlYXRlRnJhZz1lLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQsdC5mcmFnPXQuY3JlYXRlRnJhZygpKSxlLmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24obil7cmV0dXJuIEMuc2hpdk1ldGhvZHM/aShuLGUsdCk6dC5jcmVhdGVFbGVtKG4pfSxlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ9RnVuY3Rpb24oXCJoLGZcIixcInJldHVybiBmdW5jdGlvbigpe3ZhciBuPWYuY2xvbmVOb2RlKCksYz1uLmNyZWF0ZUVsZW1lbnQ7aC5zaGl2TWV0aG9kcyYmKFwiK3IoKS5qb2luKCkucmVwbGFjZSgvW1xcd1xcLTpdKy9nLGZ1bmN0aW9uKGUpe3JldHVybiB0LmNyZWF0ZUVsZW0oZSksdC5mcmFnLmNyZWF0ZUVsZW1lbnQoZSksJ2MoXCInK2UrJ1wiKSd9KStcIik7cmV0dXJuIG59XCIpKEMsdC5mcmFnKX1mdW5jdGlvbiBmKGUpe2V8fChlPXQpO3ZhciByPWEoZSk7cmV0dXJuIUMuc2hpdkNTU3x8dXx8ci5oYXNDU1N8fChyLmhhc0NTUz0hIW4oZSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGN8fGwoZSxyKSxlfXZhciB1LGMsZD1cIjMuNy4zXCIscD1lLmh0bWw1fHx7fSxtPS9ePHxeKD86YnV0dG9ufG1hcHxzZWxlY3R8dGV4dGFyZWF8b2JqZWN0fGlmcmFtZXxvcHRpb258b3B0Z3JvdXApJC9pLGg9L14oPzphfGJ8Y29kZXxkaXZ8ZmllbGRzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aXxsYWJlbHxsaXxvbHxwfHF8c3BhbnxzdHJvbmd8c3R5bGV8dGFibGV8dGJvZHl8dGR8dGh8dHJ8dWwpJC9pLHY9XCJfaHRtbDVzaGl2XCIsZz0wLHk9e307IWZ1bmN0aW9uKCl7dHJ5e3ZhciBlPXQuY3JlYXRlRWxlbWVudChcImFcIik7ZS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLHU9XCJoaWRkZW5cImluIGUsYz0xPT1lLmNoaWxkTm9kZXMubGVuZ3RofHxmdW5jdGlvbigpe3QuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGU9dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY2xvbmVOb2RlfHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50fHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jcmVhdGVFbGVtZW50fSgpfWNhdGNoKG4pe3U9ITAsYz0hMH19KCk7dmFyIEM9e2VsZW1lbnRzOnAuZWxlbWVudHN8fFwiYWJiciBhcnRpY2xlIGFzaWRlIGF1ZGlvIGJkaSBjYW52YXMgZGF0YSBkYXRhbGlzdCBkZXRhaWxzIGRpYWxvZyBmaWdjYXB0aW9uIGZpZ3VyZSBmb290ZXIgaGVhZGVyIGhncm91cCBtYWluIG1hcmsgbWV0ZXIgbmF2IG91dHB1dCBwaWN0dXJlIHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvXCIsdmVyc2lvbjpkLHNoaXZDU1M6cC5zaGl2Q1NTIT09ITEsc3VwcG9ydHNVbmtub3duRWxlbWVudHM6YyxzaGl2TWV0aG9kczpwLnNoaXZNZXRob2RzIT09ITEsdHlwZTpcImRlZmF1bHRcIixzaGl2RG9jdW1lbnQ6ZixjcmVhdGVFbGVtZW50OmksY3JlYXRlRG9jdW1lbnRGcmFnbWVudDpzLGFkZEVsZW1lbnRzOm99O2UuaHRtbDU9QyxmKHQpLFwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9Qyl9KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBlP2U6dGhpcyx0KTt2YXIgUz1cIk1veiBPIG1zIFdlYmtpdFwiLHc9RS5fY29uZmlnLnVzZVByZWZpeGVzP1Muc3BsaXQoXCIgXCIpOltdO0UuX2Nzc29tUHJlZml4ZXM9dzt2YXIgXz1mdW5jdGlvbih0KXt2YXIgcixvPXByZWZpeGVzLmxlbmd0aCxhPWUuQ1NTUnVsZTtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgYSlyZXR1cm4gbjtpZighdClyZXR1cm4hMTtpZih0PXQucmVwbGFjZSgvXkAvLFwiXCIpLHI9dC5yZXBsYWNlKC8tL2csXCJfXCIpLnRvVXBwZXJDYXNlKCkrXCJfUlVMRVwiLHIgaW4gYSlyZXR1cm5cIkBcIit0O2Zvcih2YXIgaT0wO28+aTtpKyspe3ZhciBzPXByZWZpeGVzW2ldLGw9cy50b1VwcGVyQ2FzZSgpK1wiX1wiK3I7aWYobCBpbiBhKXJldHVyblwiQC1cIitzLnRvTG93ZXJDYXNlKCkrXCItXCIrdH1yZXR1cm4hMX07RS5hdFJ1bGU9Xzt2YXIgTj1FLl9jb25maWcudXNlUHJlZml4ZXM/Uy50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKTpbXTtFLl9kb21QcmVmaXhlcz1OO3ZhciBqPXtlbGVtOmwoXCJtb2Rlcm5penJcIil9O01vZGVybml6ci5fcS5wdXNoKGZ1bmN0aW9uKCl7ZGVsZXRlIGouZWxlbX0pO3ZhciBGPXtzdHlsZTpqLmVsZW0uc3R5bGV9O01vZGVybml6ci5fcS51bnNoaWZ0KGZ1bmN0aW9uKCl7ZGVsZXRlIEYuc3R5bGV9KSxFLnRlc3RBbGxQcm9wcz12LEUudGVzdEFsbFByb3BzPWcsTW9kZXJuaXpyLmFkZFRlc3QoXCJmbGV4Ym94XCIsZyhcImZsZXhCYXNpc1wiLFwiMXB4XCIsITApKTt2YXIgVD1FLnByZWZpeGVkPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gMD09PWUuaW5kZXhPZihcIkBcIik/XyhlKTooLTEhPWUuaW5kZXhPZihcIi1cIikmJihlPWkoZSkpLHQ/dihlLHQsbik6dihlLFwicGZ4XCIpKX07TW9kZXJuaXpyLmFkZFRlc3QoXCJvYmplY3RmaXRcIiwhIVQoXCJvYmplY3RGaXRcIikse2FsaWFzZXM6W1wib2JqZWN0LWZpdFwiXX0pLG8oKSxhKHkpLGRlbGV0ZSBFLmFkZFRlc3QsZGVsZXRlIEUuYWRkQXN5bmNUZXN0O2Zvcih2YXIgaz0wO2s8TW9kZXJuaXpyLl9xLmxlbmd0aDtrKyspTW9kZXJuaXpyLl9xW2tdKCk7ZS5Nb2Rlcm5penI9TW9kZXJuaXpyfSh3aW5kb3csZG9jdW1lbnQpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkVMRU1FTlQgRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpO1xuXG5cblx0Ly8gU3RhdCAvIENvdW50ZXIgRWxlbWVudFxuXHRmdW5jdGlvbiBtaXh0U3RhdHMoKSB7XG5cdFx0dmFyIHN0YXRFbGVtcyA9ICQoJy5taXh0LXN0YXQnKTtcblxuXHRcdGlmICggc3RhdEVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XG5cblx0XHQvLyBTZXQgc3RhdCB0ZXh0IHRvIHN0YXJ0aW5nIChmcm9tKSB2YWx1ZVxuXHRcdHN0YXRFbGVtcy5maW5kKCcuc3RhdC12YWx1ZScpLmVhY2goIGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKCdmcm9tJykpOyB9KTtcblxuXHRcdC8vIEFuaW1hdGUgdmFsdWVcblx0XHRmdW5jdGlvbiBzdGF0VmFsdWUoZWwpIHtcblx0XHRcdHZhciBmcm9tICAgPSBlbC5kYXRhKCdmcm9tJyksXG5cdFx0XHRcdHRvICAgICA9IGVsLmRhdGEoJ3RvJyksXG5cdFx0XHRcdHNwZWVkICA9IGVsLmRhdGEoJ3NwZWVkJyksXG5cdFx0XHRcdGxpbmVhciA9IGVsLmRhdGEoJ2xpbmVhcicpO1xuXHRcdFx0JCh7dmFsdWU6IGZyb219KS5hbmltYXRlKHt2YWx1ZTogdG99LCB7XG5cdFx0XHRcdGR1cmF0aW9uOiBzcGVlZCxcblx0XHRcdFx0ZWFzaW5nOiAoIGxpbmVhciA9PSB0cnVlICkgPyAnbGluZWFyJyA6ICdzd2luZycsXG5cdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KE1hdGgucm91bmQodGhpcy52YWx1ZSkpOyB9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KHRvKTsgfVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxuXHRcdGZ1bmN0aW9uIHN0YXRDaXJjbGUoc3RhdCkge1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5jaXJjbGVQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmNzcygnbWFyZ2luLXRvcCcsICQodGhpcykuaGVpZ2h0KCkgLyAtMik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0c3RhdEVsZW1zLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc3RhdCA9ICQodGhpcyk7XG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0c3RhdC53YXlwb2ludCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXG5cdFx0XHRcdFx0XHR0cmlnZ2VyT25jZTogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRWYWx1ZShzdGF0LmZpbmQoJy5zdGF0LXZhbHVlJykpO1xuXHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdG1peHRTdGF0cygpO1xuXG5cblx0Ly8gRmxpcCBDYXJkIEVxdWFsaXplIEhlaWdodFxuXHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcblx0XHRmbGlwY2FyZFNpZGVzLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRmbGlwY2FyZFNpZGVzLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblx0XHR9KTtcblx0fVxuXHQvLyBGbGlwIENhcmQgVG91Y2ggU2NyZWVuIFwiSG92ZXJcIlxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXInKTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVBREVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xuXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXG5cdFx0bWFpbk5hdiAgID0gJCgnI21haW4tbmF2JyksXG5cdFx0bWVkaWFXcmFwID0gJCgnLmhlYWQtbWVkaWEnKTtcblxuXHQvLyBIZWFkIE1lZGlhIEZ1bmN0aW9uc1xuXHRmdW5jdGlvbiBoZWFkZXJGbigpIHtcblx0XHR2YXIgbWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCksXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXG5cdFx0XHR3cmFwT2Zmc2V0ICAgPSBtZWRpYVdyYXAub2Zmc2V0KCkudG9wLFxuXHRcdFx0dmlld0hlaWdodCAgID0gdmlld3BvcnQuaGVpZ2h0KCkgLSB3cmFwT2Zmc2V0O1xuXG5cdFx0Ly8gTWFrZSBoZWFkZXIgZnVsbHNjcmVlblxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLmZ1bGxzY3JlZW4gKSB7XG5cdFx0XHR2YXIgZnVsbEhlaWdodCA9IHZpZXdIZWlnaHQ7XG5cblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgJiYgISBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgKSBmdWxsSGVpZ2h0IC09IHRvcE5hdkhlaWdodDtcblxuXHRcdFx0bWVkaWFXcmFwLmFkZChtZWRpYUNvbnQpLmNzcygnaGVpZ2h0JywgZnVsbEhlaWdodCk7XG5cblx0XHQvLyBTZXQgaGVhZGVyIGhlaWdodCB0byB2aWV3cG9ydCBwZXJjZW50YWdlXG5cdFx0fSBlbHNlIGlmICggbWl4dF9vcHQuaGVhZGVyLmhlaWdodC5oZWlnaHQgIT0gJycgJiYgbWl4dF9vcHQuaGVhZGVyLmhlaWdodC51bml0cyA9PSAnJScgKSB7XG5cdFx0XHR2YXIgcGVyY2VudEhlaWdodCA9IHBhcnNlSW50KG1peHRfb3B0LmhlYWRlci5oZWlnaHQuaGVpZ2h0LCAxMCkgLyAxMDAgKiB2aWV3SGVpZ2h0O1xuXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICYmICEgbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICkgcGVyY2VudEhlaWdodCAtPSB0b3BOYXZIZWlnaHQ7XG5cblx0XHRcdG1lZGlhV3JhcC5hZGQobWVkaWFDb250KS5jc3MoJ2hlaWdodCcsIHBlcmNlbnRIZWlnaHQpO1xuXHRcdH1cblxuXHRcdC8vIEFkZCBkYXRhIGF0dHJpYnV0ZXMgZm9yIHBhcmFsbGF4IHNjcm9sbGluZ1xuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnBhcmFsbGF4ICE9ICdub25lJyApIHtcblx0XHRcdHZhciBwYXJhRWwgPSBtZWRpYVdyYXAuZmluZCgnLm1lZGlhLWNvbnRhaW5lciwgLmxzLWNvbnRhaW5lcicpLFxuXHRcdFx0XHRwYXJhSGVpZ2h0ID0gbWVkaWFXcmFwLmhlaWdodCgpICsgd3JhcE9mZnNldCxcblx0XHRcdFx0b2ZmVG9wID0gJy0nK3dyYXBPZmZzZXQrJ3B4Jyxcblx0XHRcdFx0YnRtVmFsID0gKCBtaXh0X29wdC5oZWFkZXIucGFyYWxsYXggPT0gJ3Nsb3cnICkgPyAnMjUlJyA6ICc4MCUnO1xuXHRcdFx0aWYgKCBwYXJhRWwubGVuZ3RoICkge1xuXHRcdFx0XHRtZWRpYUNvbnQuY3NzKHsndG9wJzogb2ZmVG9wLCAnaGVpZ2h0JzogcGFyYUhlaWdodCB9KTtcblx0XHRcdFx0cGFyYUVsLmF0dHIoJ2RhdGEtdG9wJywgJ3RyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCUsIDApJyk7XG5cdFx0XHRcdHBhcmFFbC5hdHRyKCdkYXRhLXRvcC1ib3R0b20nLCAndHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAnICsgYnRtVmFsICsgJywgMCknKTtcblxuXHRcdFx0XHR2aWV3cG9ydC50cmlnZ2VyKCdyZWZyZXNoLXNrcm9sbHInLCBwYXJhRWwpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyWydjb250ZW50LWZhZGUnXSApIHtcblx0XHRcdHZhciBjb250ZW50ID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoIGNvbnRlbnQubGVuZ3RoICkge1xuXHRcdFx0XHRjb250ZW50LmF0dHIoJ2RhdGEtJyt3cmFwT2Zmc2V0KyctdG9wJywgJ29wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCUsIDApOycpO1xuXHRcdFx0XHRjb250ZW50LmF0dHIoJ2RhdGEtLTIwMC10b3AtYm90dG9tJywgJ29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgODAlLCAwKTsnKTtcblx0XHRcdH1cblx0XHRcdC8vIFByZXZlbnQgY29udGVudCBmYWRlIGlmIGhlYWRlciBpcyB0YWxsZXIgdGhhbiB2aWV3cG9ydFxuXHRcdFx0aWYgKCB3cmFwSGVpZ2h0ID4gdmlld0hlaWdodCApIHtcblx0XHRcdFx0bWVkaWFXcmFwLmFkZENsYXNzKCduby1mYWRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZWRpYVdyYXAucmVtb3ZlQ2xhc3MoJ25vLWZhZGUnKTtcblx0XHRcdFx0dmlld3BvcnQudHJpZ2dlcigncmVmcmVzaC1za3JvbGxyJywgY29udGVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gSGVhZGVyIFNjcm9sbCBUbyBDb250ZW50XG5cdGZ1bmN0aW9uIGhlYWRlclNjcm9sbCgpIHtcblx0XHR2YXIgcGFnZSAgID0gJCgnaHRtbCwgYm9keScpLFxuXHRcdFx0b2Zmc2V0ID0gJCgnI2NvbnRlbnQtd3JhcCcpLm9mZnNldCgpLnRvcCArIDE7XG5cdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICkgeyBvZmZzZXQgLT0gbWFpbk5hdi5vdXRlckhlaWdodCgpOyB9XG5cdFx0JCgnLmhlYWRlci1zY3JvbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHBhZ2UuYW5pbWF0ZSh7IHNjcm9sbFRvcDogb2Zmc2V0IH0sIDgwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIG1peHRfb3B0LmhlYWRlci5lbmFibGVkICYmIG1lZGlhV3JhcC5sZW5ndGggKSB7XG5cdFx0aGVhZGVyRm4oKTtcblxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnNjcm9sbCApIHsgaGVhZGVyU2Nyb2xsKCk7IH1cblx0XHRcblx0XHQkKHdpbmRvdykucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGhlYWRlckZuICkpO1xuXHR9XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVMUEVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIFNraXAgTGluayBGb2N1cyBGaXhcblx0XG5cdHZhciBpc193ZWJraXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignd2Via2l0JykgPiAtMSxcblx0XHRpc19vcGVyYSAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignb3BlcmEnKSAgPiAtMSxcblx0XHRpc19pZSAgICAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignbXNpZScpICAgPiAtMTtcblxuXHRpZiAoICggaXNfd2Via2l0IHx8IGlzX29wZXJhIHx8IGlzX2llICkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKSApIHtcblx0XHR2YXIgZXZlbnRNZXRob2QgPSAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnO1xuXHRcdHdpbmRvd1sgZXZlbnRNZXRob2QgXSggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICkgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWF8ZGl2KSQvaS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblx0fVxuXG5cblx0Ly8gQXBwbHkgQm9vdHN0cmFwIENsYXNzZXNcblx0XG5cdHZhciB3b29Db21tV3JhcCA9ICQoJy53b29jb21tZXJjZScpO1xuXHRcblx0dmFyIHdpZGdldE5hdk1lbnVzID0gJy53aWRnZXRfbWV0YSwgLndpZGdldF9yZWNlbnRfZW50cmllcywgLndpZGdldF9hcmNoaXZlLCAud2lkZ2V0X2NhdGVnb3JpZXMsIC53aWRnZXRfbmF2X21lbnUsIC53aWRnZXRfcGFnZXMsIC53aWRnZXRfcnNzJztcblxuXHQvLyBXb29Db21tZXJjZSBXaWRnZXRzICYgRWxlbWVudHNcblx0aWYgKCB3b29Db21tV3JhcC5sZW5ndGggKSB7XG5cdFx0d2lkZ2V0TmF2TWVudXMgKz0gJywgLndpZGdldF9wcm9kdWN0X2NhdGVnb3JpZXMsIC53aWRnZXRfcHJvZHVjdHMsIC53aWRnZXRfdG9wX3JhdGVkX3Byb2R1Y3RzLCAud2lkZ2V0X3JlY2VudF9yZXZpZXdzLCAud2lkZ2V0X3JlY2VudGx5X3ZpZXdlZF9wcm9kdWN0cywgLndpZGdldF9sYXllcmVkX25hdic7XG5cblx0XHR3b29Db21tV3JhcC5maW5kKCcuc2hvcF90YWJsZScpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1ib3JkZXJlZCcpO1xuXG5cdFx0JChkb2N1bWVudC5ib2R5KS5vbigndXBkYXRlZF9jaGVja291dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLnNob3BfdGFibGUnKS5hZGRDbGFzcygndGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtc3RyaXBlZCcpO1xuXHRcdH0pO1xuXHR9XG5cblx0JCh3aWRnZXROYXZNZW51cykuY2hpbGRyZW4oJ3VsJykuYWRkQ2xhc3MoJ25hdicpO1xuXHQkKCcud2lkZ2V0X25hdl9tZW51IHVsLm1lbnUnKS5hZGRDbGFzcygnbmF2Jyk7XG5cblx0JCgnI3dwLWNhbGVuZGFyJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQnKTtcblxuXG5cdC8vIEhhbmRsZSBQb3N0IENvdW50IFRhZ3NcblxuXHQkKCcud2lkZ2V0X2FyY2hpdmUgbGksIC53aWRnZXRfY2F0ZWdvcmllcyBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyAgICAgPSAkKHRoaXMpLFxuXHRcdFx0Y2hpbGRyZW4gID0gJHRoaXMuY2hpbGRyZW4oKSxcblx0XHRcdGFuY2hvciAgICA9IGNoaWxkcmVuLmZpbHRlcignYScpLFxuXHRcdFx0Y29udGVudHMgID0gJHRoaXMuY29udGVudHMoKSxcblx0XHRcdGNvdW50VGV4dCA9IGNvbnRlbnRzLm5vdChjaGlsZHJlbikudGV4dCgpO1xuXG5cdFx0aWYgKCBjb3VudFRleHQgIT09ICcnICkge1xuXHRcdFx0YW5jaG9yLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJwb3N0LWNvdW50XCI+JyArIGNvdW50VGV4dCArICc8L3NwYW4+Jyk7XG5cdFx0XHRjb250ZW50cy5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlVHlwZSA9PT0gMzsgXG5cdFx0XHR9KS5yZW1vdmUoKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy53aWRnZXQud29vY29tbWVyY2UgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0Y291bnQgPSAkdGhpcy5jaGlsZHJlbignLmNvdW50JyksXG5cdFx0XHRsaW5rICA9ICR0aGlzLmNoaWxkcmVuKCdhJyk7XG5cdFx0Y291bnQuYXBwZW5kVG8obGluayk7XG5cdH0pO1xuXG5cblx0Ly8gR2FsbGVyeSBBcnJvdyBOYXZpZ2F0aW9uXG5cblx0JChkb2N1bWVudCkua2V5ZG93biggZnVuY3Rpb24oZSkge1xuXHRcdHZhciB1cmwgPSBmYWxzZTtcblx0XHRpZiAoIGUud2hpY2ggPT09IDM3ICkgeyAgLy8gTGVmdCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLnByZXZpb3VzLWltYWdlIGEnKS5hdHRyKCdocmVmJyk7XG5cdFx0fSBlbHNlIGlmICggZS53aGljaCA9PT0gMzkgKSB7ICAvLyBSaWdodCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLmVudHJ5LWF0dGFjaG1lbnQgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9XG5cdFx0aWYgKCB1cmwgJiYgKCAhICQoJ3RleHRhcmVhLCBpbnB1dCcpLmlzKCc6Zm9jdXMnKSApICkge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsO1xuXHRcdH1cblx0fSk7XG5cblxuXHQvLyBEZXRlY3QgTW9iaWxlXG5cblx0d2luZG93Lm1vYmlsZUNoZWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNoZWNrID0gZmFsc2U7XG5cdFx0KCBmdW5jdGlvbihhKSB7XG5cdFx0XHRpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCw0KSkpIHtcblx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7XG5cdFx0cmV0dXJuIGNoZWNrO1xuXHR9XG5cblxuXHQvLyBEZXRlY3QgSUUgVmVyc2lvblxuXG5cdGZ1bmN0aW9uIGRldGVjdElFKCkge1xuXHRcdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuXG5cdFx0Ly8gSUUgMTAgb3Igb2xkZXJcblx0XHR2YXIgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJyk7XG5cdFx0aWYgKCBtc2llID4gMCApIHsgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApOyB9XG5cblx0XHQvLyBJRSAxMVxuXHRcdHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTtcblx0XHRpZiAoIHRyaWRlbnQgPiAwICkge1xuXHRcdFx0dmFyIHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZignLicsIHJ2KSksIDEwKTtcblx0XHR9XG5cblx0XHQvLyBFZGdlIChJRSAxMispXG5cdFx0dmFyIGVkZ2UgPSB1YS5pbmRleE9mKCdFZGdlLycpO1xuXHRcdGlmICggZWRnZSA+IDAgKSB7IHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoJy4nLCBlZGdlKSksIDEwKTsgfVxuXG5cdFx0Ly8gT3RoZXIgYnJvd3NlcnNcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dmFyIElFX3ZlciA9IGRldGVjdElFKCk7XG5cdGlmICggSUVfdmVyICkgeyAkKCdodG1sJykuYWRkQ2xhc3MoJ2llIGllJytJRV92ZXIpOyB9XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuTkFWQkFSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgY29sb3JMb0QsIGNvbG9yVG9SZ2JhICovXG5cblx0dmFyIHZpZXdwb3J0ICAgICA9ICQod2luZG93KSxcblx0XHRib2R5RWwgICAgICAgPSAkKCdib2R5JyksXG5cdFx0bWFpbldyYXAgICAgID0gJCgnI21haW4td3JhcCcpLFxuXHRcdG1haW5OYXZXcmFwICA9ICQoJyNtYWluLW5hdi13cmFwJyksXG5cdFx0bWFpbk5hdkJhciAgID0gJCgnI21haW4tbmF2JyksXG5cdFx0bWFpbk5hdkNvbnQgID0gbWFpbk5hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxuXHRcdG1haW5OYXZIZWFkICA9ICQoJy5uYXZiYXItaGVhZGVyJywgbWFpbk5hdkJhciksXG5cdFx0bWFpbk5hdklubmVyID0gJCgnLm5hdmJhci1pbm5lcicsIG1haW5OYXZCYXIpLFxuXHRcdHNlY05hdkJhciAgICA9ICQoJyNzZWNvbmQtbmF2JyksXG5cdFx0c2VjTmF2Q29udCAgID0gc2VjTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXG5cdFx0bmF2YmFycyAgICAgID0gJCgnLm5hdmJhcicpLFxuXHRcdG1lZGlhV3JhcCAgICA9ICQoJy5oZWFkLW1lZGlhJyk7XG5cblx0aWYgKCBtYWluTmF2QmFyLmxlbmd0aCA9PT0gMCApIHJldHVybjtcblxuXHR2YXIgTmF2YmFyID0ge1xuXG5cdFx0bmF2Qmc6ICcnLFxuXHRcdG5hdkJnVG9wOiAnJyxcblxuXHRcdC8vIEluaXRpYWxpemUgTmF2YmFyXG5cdFx0aW5pdDogZnVuY3Rpb24obmF2YmFyKSB7XG5cdFx0XHR2YXIgZGF0YUNvbnQgPSBuYXZiYXIuZmluZCgnLm5hdmJhci1kYXRhJyksXG5cdFx0XHRcdGJnQ29sb3IgID0gKCBuYXZiYXIuaXMobWFpbk5hdkJhcikgKSA/IGRhdGFDb250LmNzcygnYmFja2dyb3VuZC1jb2xvcicpIDogbmF2YmFyLmNzcygnYmFja2dyb3VuZC1jb2xvcicpLFxuXHRcdFx0XHRjb2xvckx1bSA9IGRhdGFDb250Lmxlbmd0aCA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGFDb250WzBdLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cIi9nLCAnJykgOiAnJztcblxuXHRcdFx0aWYgKCBjb2xvckx1bSAhPSAnZGFyaycgJiYgY29sb3JMdW0gIT0gJ2xpZ2h0JyApIGNvbG9yTHVtID0gY29sb3JMb0QoYmdDb2xvcik7XG5cblx0XHRcdGlmICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkge1xuXG5cdFx0XHRcdHRoaXMubmF2QmcgPSAoIGNvbG9yTHVtID09ICdkYXJrJyApID8gJ2JnLWRhcmsnIDogJ2JnLWxpZ2h0Jztcblx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKHRoaXMubmF2QmcpO1xuXG5cdFx0XHRcdG1haW5OYXZCYXIuYXR0cignZGF0YS1iZycsIGNvbG9yTHVtKTtcblxuXHRcdFx0XHR2YXIgbmF2U2hlZXQgPSAkKCc8c3R5bGUgZGF0YS1pZD1cIm1peHQtbmF2LWNzc1wiPicpO1xuXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCAhPSAndmVydGljYWwnICkge1xuXHRcdFx0XHRcdG5hdlNoZWV0LmFwcGVuZCgnI21haW4tbmF2Lm5hdmJhci1taXh0Om5vdCgucG9zaXRpb24tdG9wKSB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JUb1JnYmEoYmdDb2xvciwgbWl4dF9vcHQubmF2Lm9wYWNpdHkpKyc7IH0nKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0LmhlYWRlci5lbmFibGVkICkge1xuXHRcdFx0XHRcdG5hdlNoZWV0LmFwcGVuZCgnLm5hdi10cmFuc3BhcmVudCAjbWFpbi1uYXYubmF2YmFyLW1peHQucG9zaXRpb24tdG9wIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10pKyc7IH0nKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lZGlhV3JhcC5oYXNDbGFzcygnYmctZGFyaycpICkgeyB0aGlzLm5hdkJnVG9wID0gJ2JnLWRhcmsnOyB9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggbWVkaWFXcmFwLmhhc0NsYXNzKCdiZy1saWdodCcpICkgeyB0aGlzLm5hdkJnVG9wID0gJ2JnLWxpZ2h0JzsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHRoaXMubmF2QmdUb3AgPSB0aGlzLm5hdkJnOyB9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0TmF2YmFyLnN0aWNreS50b2dnbGUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLm5hdkJnVG9wID0gdGhpcy5uYXZCZztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ3N0YXRpYycgKSB7XG5cdFx0XHRcdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcyh0aGlzLm5hdkJnKS5hZGRDbGFzcyh0aGlzLm5hdkJnVG9wKTtcblx0XHRcdFx0fSBlbHNlIGlmICggbmF2U2hlZXQuaHRtbCgpICE9ICcnICkge1xuXHRcdFx0XHRcdG5hdlNoZWV0LmFwcGVuZFRvKCQoJ2hlYWQnKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggY29sb3JMdW0gPT0gJ2RhcmsnICkge1xuXHRcdFx0XHRcdG5hdmJhci5hZGRDbGFzcygnYmctZGFyaycpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5hdmJhci5hZGRDbGFzcygnYmctbGlnaHQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBTdGlja3kgKGZpeGVkKSBOYXZiYXIgRnVuY3Rpb25zXG5cdFx0c3RpY2t5OiB7XG5cdFx0XHRpc01vYmlsZTogZmFsc2UsXG5cdFx0XHRvZmZzZXQ6IDAsXG5cdFx0XHRzY3JvbGxDb3JyZWN0aW9uOiAwLFxuXG5cdFx0XHQvLyBUcmlnZ2VyIG9yIHVwZGF0ZSBzdGlja3kgc3RhdGVcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGlzTW9iaWxlKSB7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kub2Zmc2V0ID0gMDtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS5pc01vYmlsZSA9IGlzTW9iaWxlO1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnNjcm9sbENvcnJlY3Rpb24gPSBwYXJzZUludChtYWluV3JhcC5vZmZzZXQoKS50b3AsIDEwKTtcblxuXHRcdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSAmJiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyB8fCAoIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSB2aWV3cG9ydC5oZWlnaHQoKSApID4gMTYwICkgKSB7XG5cdFx0XHRcdFx0bWFpbk5hdkJhci5kYXRhKCdmaXhlZCcsIHRydWUpO1xuXHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCAkLnRocm90dGxlKDUwLCBOYXZiYXIuc3RpY2t5LnRvZ2dsZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1haW5OYXZCYXIuZGF0YSgnZml4ZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIuc3RpY2t5LnRvZ2dsZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ2hvcml6b250YWwnICYmIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IG1haW5OYXZCYXIub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdE5hdmJhci5zdGlja3kudG9nZ2xlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBUb2dnbGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wIC0gTmF2YmFyLnN0aWNreS5vZmZzZXQsXG5cdFx0XHRcdFx0c2Nyb2xsVmFsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gTmF2YmFyLm5hdkJnVG9wO1xuXG5cdFx0XHRcdHNjcm9sbFZhbCA9ICggTmF2YmFyLnN0aWNreS5pc01vYmlsZSA9PT0gdHJ1ZSApID8gMCA6IHNjcm9sbFZhbCArIE5hdmJhci5zdGlja3kuc2Nyb2xsQ29ycmVjdGlvbjtcblxuXHRcdFx0XHRpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0ZWxzZSBpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWxpZ2h0JykgJiYgKCBOYXZiYXIubmF2QmcgIT0gJ2JnLWRhcmsnIHx8IG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSApIHsgYmdUb3BDbHMgPSAnYmctbGlnaHQnOyB9XG5cblx0XHRcdFx0aWYgKCBzY3JvbGxWYWwgPiBuYXZQb3MgJiYgKCBtaXh0X29wdC5uYXYubGF5b3V0ICE9ICd2ZXJ0aWNhbCcgfHwgISBOYXZiYXIuc3RpY2t5LmlzTW9iaWxlICkgKSB7ICBcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKE5hdmJhci5uYXZCZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKE5hdmJhci5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBNZW51IEZ1bmN0aW9uc1xuXHRcdG1lbnU6IHtcblxuXHRcdFx0Ly8gUHJldmVudCBuYXZiYXIgc3VibWVudSBvdmVyZmxvdyBvdXQgb2Ygdmlld3BvcnRcblx0XHRcdG92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXG5cdFx0XHRcdFx0bWFpblN1YiA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51IC5kcm9wZG93bi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IC5zdWItbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiBhJyk7XG5cblx0XHRcdFx0aWYgKCBuYXZiYXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRuYXZiYXJPZmYgPSBuYXZiYXIub3V0ZXJXaWR0aCgpICsgcGFyc2VJbnQobmF2YmFyLm9mZnNldCgpLmxlZnQsIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc2V0IG1vYmlsZSBhZGp1c3RtZW50c1xuXHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcblxuXHRcdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXG5cdFx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHN1YiAgICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdHRvcFN1YiAgID0gc3ViLFxuXHRcdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXG5cdFx0XHRcdFx0XHRzdWJQb3MgICA9IHBhcnNlSW50KHN1Yi5vZmZzZXQoKS5sZWZ0LCAxMCksXG5cdFx0XHRcdFx0XHRzdWJXICAgICA9IHN1Yi5vdXRlcldpZHRoKCkgKyAxLFxuXHRcdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxuXHRcdFx0XHRcdFx0bmVzdFN1YnMgPSBzdWIuY2hpbGRyZW4oJy5kcm9wLXN1Ym1lbnUnKSxcblx0XHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IG5lc3RTdWJzLFxuXHRcdFx0XHRcdFx0Y29ycmVjdGlvbjtcblxuXHRcdFx0XHRcdGlmICggc3ViUGFyLmlzKCcubWVnYS1tZW51LWNvbHVtbicpICkge1xuXHRcdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XG5cdFx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUb3AgTGV2ZWwgU3VibWVudXNcblx0XHRcdFx0XHRpZiAoIG5lc3RPZmYgPiBuYXZiYXJPZmYgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0XHRcdFx0XHRjb3JyZWN0aW9uID0gKG5lc3RPZmYgLSBuYXZiYXJPZmYgLSAyKSAqIC0xO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cblxuXHRcdFx0XHRcdFx0aWYgKCBuYXZiYXIuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgfHwgbmF2YmFyLnBhcmVudHMoJy5uYXZiYXInKS5oYXNDbGFzcygnYm9yZGVyZWQnKSApIHsgY29ycmVjdGlvbiAtPSAxOyB9XG5cblx0XHRcdFx0XHRcdGlmICggY29ycmVjdGlvbiA8IG1nTm93ICkge1xuXHRcdFx0XHRcdFx0XHR0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcsIGNvcnJlY3Rpb24gKyAncHgnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdE5hdmJhci5tZW51LnNldERyb3BMZWZ0KG92ZXJmbG93aW5nU3Vicyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXG5cdFx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXID0gW107XG5cdFx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHMgID0gJHRoaXMucGFyZW50cygnLnN1Yi1tZW51JyksXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xuXG5cdFx0XHRcdFx0XHRcdHBhcmVudHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXICs9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXW2ldID0gJHRoaXMub3V0ZXJXaWR0aCgpICsgcGFyZW50c1c7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAobmVzdE9mZiArIG1heE5lc3RXKSA+PSBtYWluV3JhcC53aWR0aCgpICkge1xuXHRcdFx0XHRcdFx0XHROYXZiYXIubWVudS5zZXREcm9wTGVmdChzdWJOb3cpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0TmF2YmFyLm1lbnUucmVzZXRBcnJvdyhzdWJOb3cpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBTZXQgbWVudSBkcm9wIGxlZnRcblx0XHRcdHNldERyb3BMZWZ0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wLWxlZnQnKTtcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCdhcnJvdy1sZWZ0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBSZXNldCBtZW51IGRyb3Bcblx0XHRcdHJlc2V0QXJyb3c6IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIE1lZ2EgbWVudSBlbmFibGUgLyBkaXNhYmxlXG5cdFx0XHRtZWdhTWVudVRvZ2dsZTogZnVuY3Rpb24odG9nZ2xlLCBuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG1lZ2FNZW51cztcblxuXHRcdFx0XHRpZiAoIHRvZ2dsZSA9PSAnZW5hYmxlJyApIHtcblx0XHRcdFx0XHRtZWdhTWVudXMgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudVtkYXRhLW1lZ2EtbWVudT1cInRydWVcIl0nKTtcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5hZGRDbGFzcygnbWVnYS1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbWVudScpLnJlbW92ZUF0dHIoJ2RhdGEtbWVnYS1tZW51Jyk7XG5cdFx0XHRcdFx0XHQkKCc+IC5zdWItbWVudSA+IC5kcm9wLXN1Ym1lbnUnLCBtZWdhTWVudSkucmVtb3ZlQ2xhc3MoJ2Ryb3Atc3VibWVudScpLmFkZENsYXNzKCdtZWdhLW1lbnUtY29sdW1uJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIHRvZ2dsZSA9PSAnZGlzYWJsZScgKSB7XG5cdFx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5tZWdhLW1lbnUnKTtcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5yZW1vdmVDbGFzcygnbWVnYS1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbWVudScpLmF0dHIoJ2RhdGEtbWVnYS1tZW51JywgJ3RydWUnKTtcblx0XHRcdFx0XHRcdG1lZ2FNZW51LmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uJykucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKS5hZGRDbGFzcygnZHJvcC1zdWJtZW51Jyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIENyZWF0ZSBtZWdhIG1lbnUgcm93cyBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDQgY29sdW1uc1xuXHRcdFx0bWVnYU1lbnVSb3dzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bWFpbldyYXAuZmluZCgnLm1lZ2EtbWVudScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBtYWluTWVudSA9ICQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLFxuXHRcdFx0XHRcdFx0Y29sdW1ucyAgPSBtYWluTWVudS5jaGlsZHJlbignLm1lZ2EtbWVudS1jb2x1bW4nKTtcblxuXHRcdFx0XHRcdGlmICggY29sdW1ucy5sZW5ndGggPiA0ICkgbWFpbk1lbnUuYWRkQ2xhc3MoJ211bHRpLXJvdycpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0fSxcblxuXHRcdC8vIE1vYmlsZSBGdW5jdGlvbnNcblx0XHRtb2JpbGU6IHtcblxuXHRcdFx0ZGV2aWNlOiBudWxsLFxuXG5cdFx0XHQvLyBUcmlnZ2VyIG1vYmlsZSBmdW5jdGlvbnNcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdFx0XHROYXZiYXIubW9iaWxlLmRldmljZSA9IGRldmljZTtcblxuXHRcdFx0XHQkKCcuZHJvcGRvd24tdG9nZ2xlID4gLmRyb3AtYXJyb3cnLCBtYWluTmF2QmFyKS5kYXRhKCduby1oYXNoLXNjcm9sbCcsIHRydWUpO1xuXG5cdFx0XHRcdC8vIFNob3cvaGlkZSBzdWJtZW51cyBvbiBoYW5kbGUgY2xpY2tcblx0XHRcdFx0JCgnLmRyb3Bkb3duLXRvZ2dsZScsIG1haW5OYXZCYXIpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoICQoZXZlbnQudGFyZ2V0KS5pcygnLmRyb3AtYXJyb3cnKSApIHtcblx0XHRcdFx0XHRcdGlmICggZXZlbnQuaGFuZGxlZCAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXG5cdFx0XHRcdFx0XHRcdFx0bWVudSAgID0gaGFuZGxlLmNsb3Nlc3QoJy5tZW51LWl0ZW0nKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIG1lbnUuaGFzQ2xhc3MoJ2V4cGFuZCcpICkge1xuXHRcdFx0XHRcdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtZW51KS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWVudS5hZGRDbGFzcygnZXhwYW5kJykuc2libGluZ3MoJ2xpJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpLmZpbmQoJy5leHBhbmQnKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXG5cdFx0XHRcdFx0XHRcdGV2ZW50LmhhbmRsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1haW5OYXZCYXIpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcblx0XHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2Nyb2xsUG9zOiAwLFxuXG5cdFx0XHQvLyBFbmFibGUgbmF2IHNjcm9sbGluZyBpZiBuYXZiYXIgaGVpZ2h0ID4gdmlld3BvcnRcblx0XHRcdHNjcm9sbE5hdjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBOYXZiYXIubW9iaWxlLmRldmljZSA9PSAndGFibGV0JyApIHtcblx0XHRcdFx0XHR2YXIgdmlld3BvcnRIICAgICA9IHZpZXdwb3J0LmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0bmF2YmFySGVhZGVySCA9IG1haW5OYXZIZWFkLmhlaWdodCgpICsgMSxcblx0XHRcdFx0XHRcdG5hdmJhcklubmVySCAgPSBtYWluTmF2SW5uZXIuaGFzQ2xhc3MoJ2luJykgPyBtYWluTmF2SW5uZXIuaGVpZ2h0KCkgOiAwLFxuXHRcdFx0XHRcdFx0bmF2YmFySCAgICAgICA9IG5hdmJhckhlYWRlckggKyBuYXZiYXJJbm5lckgsXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgICAgID0gbWFpbk5hdkJhci5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wO1xuXG5cdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wIC09IGFkbWluQmFySDtcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbmF2YmFySCA+IHZpZXdwb3J0SCApIHtcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLm5vdCgnc3RvcHBlZCcpICkge1xuXHRcdFx0XHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBQcmV2ZW50IHNjcm9sbGluZyBhYm92ZSBuYXZiYXJcblx0XHRcdHN0b3BTY3JvbGw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgdmlld1Njcm9sbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdHN0b3BTY3JvbGwgPSBtYWluTmF2QmFyLmhhc0NsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdGlmICggTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPiBtYWluTmF2SGVhZC5vZmZzZXQoKS50b3AgKSB7IHN0b3BTY3JvbGwgPSBmYWxzZTsgfVxuXHRcdFx0XHRpZiAoIE5hdmJhci5tb2JpbGUuc2Nyb2xsUG9zID4gdmlld1Njcm9sbCAmJiBzdG9wU2Nyb2xsICkgeyB2aWV3cG9ydC5zY3JvbGxUb3AoTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MpOyB9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0TmF2YmFyLmluaXQoJCh0aGlzKSk7XG5cdH0pO1xuXHRcblx0TmF2YmFyLm1lbnUubWVnYU1lbnVSb3dzKCk7XG5cblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdCQoJ3N0eWxlW2RhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIl0nKS5yZW1vdmUoKTtcblx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJyk7XG5cdFx0TmF2YmFyLmluaXQobWFpbk5hdkJhcik7XG5cblx0fSk7XG5cblx0c2VjTmF2QmFyLm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XG5cdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJyk7XG5cdFx0TmF2YmFyLmluaXQoc2VjTmF2QmFyKTtcblx0fSk7XG5cblxuXHQvLyBDaGVjayB3aGljaCBtZWRpYSBxdWVyaWVzIGFyZSBhY3RpdmVcblx0dmFyIG1xQ2hlY2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhci1kYXRhJyksICc6YWZ0ZXInKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpO1xuXHR9O1xuXG5cblx0Ly8gRW5hYmxlIG1lbnUgaG92ZXIgb24gdG91Y2ggc2NyZWVuc1xuXHR2YXIgbWVudVBhcmVudHMgPSBuYXZiYXJzLmZpbmQoJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuOm5vdCgubWVnYS1tZW51LWNvbHVtbiksIGxpLmRyb3Bkb3duJyk7XG5cdGZ1bmN0aW9uIG1lbnVUb3VjaEhvdmVyKGV2ZW50KSB7XG5cdFx0dmFyIGl0ZW0gPSAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KSxcblx0XHRcdGFuY2VzdG9ycyA9IGl0ZW0ucGFyZW50cygnLmhvdmVyJyk7XG5cdFx0aWYgKCBpdGVtLmhhc0NsYXNzKCdob3ZlcicpICkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoJ2hvdmVyJyk7XG5cdFx0XHRtZW51UGFyZW50cy5ub3QoaXRlbSkubm90KGFuY2VzdG9ycykucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBtZW51VG91Y2hSZW1vdmVIb3ZlcihldmVudCkge1xuXHRcdGlmICggISAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KS5pcyhtZW51UGFyZW50cykgJiYgISAkKGV2ZW50LnRhcmdldCkuaXMoJ2lucHV0JykgKSB7IG1lbnVQYXJlbnRzLnJlbW92ZUNsYXNzKCdob3ZlcicpOyB9XG5cdH1cblxuXG5cdC8vIEVuc3VyZSB2ZXJ0aWNhbCBuYXZiYXIgaXRlbXMgZml0IGluIHZpZXdwb3J0XG5cdGZ1bmN0aW9uIHZlcnRpY2FsTmF2Rml0VmlldygpIHtcblx0XHRpZiAoIHZpZXdwb3J0LmhlaWdodCgpIDwgbWFpbk5hdkNvbnQuaW5uZXJIZWlnaHQoKSApIHtcblx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCd2ZXJ0aWNhbC1maXhlZCcpLmFkZENsYXNzKCd2ZXJ0aWNhbC1zdGF0aWMnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MoJ3ZlcnRpY2FsLXN0YXRpYycpLmFkZENsYXNzKCd2ZXJ0aWNhbC1maXhlZCcpO1xuXHRcdH1cblx0fVxuXG5cblx0Ly8gSGFuZGxlIG5hdmJhciBpdGVtcyBvdmVybGFwXG5cdGZ1bmN0aW9uIG5hdmJhck92ZXJsYXAoKSB7XG5cdFx0dmFyIG1xTmF2ID0gbXFDaGVjaygpLFxuXHRcdFx0bWFpbk5hdkxvZ29DbHMgPSAnbG9nby0nICsgbWFpbk5hdldyYXAuYXR0cignZGF0YS1sb2dvLWFsaWduJyk7XG5cblx0XHQvLyBQcmltYXJ5IE5hdmJhclxuXHRcdGlmICggbWFpbk5hdkxvZ29DbHMgIT0gJ2xvZ28tY2VudGVyJyAmJiBtaXh0X29wdC5uYXYubGF5b3V0ID09ICdob3Jpem9udGFsJyApIHtcblx0XHRcdG1haW5OYXZXcmFwLmFkZChtZWRpYVdyYXApLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKG1haW5OYXZMb2dvQ2xzKTtcblx0XHRcdGlmICggbXFOYXYgPT0gJ2Rlc2t0b3AnICkge1xuXHRcdFx0XHR2YXIgbWFpbk5hdkNvbnRXaWR0aCA9IG1haW5OYXZDb250LndpZHRoKCksXG5cdFx0XHRcdFx0bWFpbk5hdkl0ZW1zV2lkdGggPSBtYWluTmF2SGVhZC5vdXRlcldpZHRoKHRydWUpICsgJCgnI21haW4tbWVudScpLm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0XHRcdGlmICggbWFpbk5hdkl0ZW1zV2lkdGggPiBtYWluTmF2Q29udFdpZHRoICkge1xuXHRcdFx0XHRcdG1haW5OYXZXcmFwLmFkZChtZWRpYVdyYXApLnJlbW92ZUNsYXNzKG1haW5OYXZMb2dvQ2xzKS5hZGRDbGFzcygnbG9nby1jZW50ZXInKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNlY29uZGFyeSBOYXZiYXJcblx0XHRpZiAoIHNlY05hdkJhci5sZW5ndGggKSB7XG5cdFx0XHRzZWNOYXZCYXIucmVtb3ZlQ2xhc3MoJ2l0ZW1zLW92ZXJsYXAnKTtcblx0XHRcdHZhciBzZWNOYXZDb250V2lkdGggPSBzZWNOYXZDb250LndpZHRoKCksXG5cdFx0XHRcdHNlY05hdkl0ZW1zV2lkdGggPSAkKCcubGVmdC1jb250ZW50Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0LWNvbnRlbnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XG5cdFx0XHRcdHNlY05hdkJhci5hZGRDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cblx0Ly8gT25lLVBhZ2UgTmF2aWdhdGlvblxuXHRmdW5jdGlvbiBvbmVQYWdlTmF2KCkge1xuXHRcdHZhciBvZmZzZXQgPSAwLFxuXHRcdFx0c3B5RGF0YSA9IGJvZHlFbC5kYXRhKCdicy5zY3JvbGxzcHknKTtcblxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBtYWluTmF2QmFyLmRhdGEoJ2ZpeGVkJykgKSB7IG9mZnNldCArPSBtYWluTmF2QmFyLm91dGVySGVpZ2h0KCk7IH1cblx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gJiYgJCgnI3dwYWRtaW5iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJyApIHsgb2Zmc2V0ICs9ICQoJyN3cGFkbWluYmFyJykuaGVpZ2h0KCk7IH1cblxuXHRcdCQoJy5vbmUtcGFnZS1yb3cnKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByb3cgPSAkKHRoaXMpO1xuXG5cdFx0XHRpZiAoIHJvdy5pcygnOmZpcnN0LWNoaWxkJykgKSB7XG5cdFx0XHRcdHZhciBwYWdlQ29udGVudCA9ICQoJy5wYWdlLWNvbnRlbnQub25lLXBhZ2UnKTtcblx0XHRcdFx0cGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJywgJycpO1xuXHRcdFx0XHRyb3cuY3NzKCdwYWRkaW5nLXRvcCcsIHBhZ2VDb250ZW50LmNzcygnbWFyZ2luLXRvcCcpKTtcblx0XHRcdFx0cGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJywgMCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcHJldlJvdyA9IHJvdy5wcmV2KCk7XG5cdFx0XHRcdGlmICggISBwcmV2Um93Lmhhc0NsYXNzKCdyb3cnKSApIHByZXZSb3cgPSBwcmV2Um93LnByZXYoJy5yb3cnKTtcblxuXHRcdFx0XHRwcmV2Um93LmNzcygnbWFyZ2luLWJvdHRvbScsICcnKTtcblx0XHRcdFx0cm93LmNzcygncGFkZGluZy10b3AnLCBwcmV2Um93LmNzcygnbWFyZ2luLWJvdHRvbScpKTtcblx0XHRcdFx0cHJldlJvdy5jc3MoJ21hcmdpbi1ib3R0b20nLCAwKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICggc3B5RGF0YSApIHtcblx0XHRcdHNweURhdGEub3B0aW9ucy5vZmZzZXQgPSBvZmZzZXQ7XG5cdFx0XHRib2R5RWwuc2Nyb2xsc3B5KCdyZWZyZXNoJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJvZHlFbC5zY3JvbGxzcHkoe1xuXHRcdFx0XHR0YXJnZXQ6ICcjbWFpbi1uYXYnLFxuXHRcdFx0XHRvZmZzZXQ6IG9mZnNldFxuXHRcdFx0fSk7XG5cblx0XHRcdG1haW5OYXZCYXIub24oJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bWFpbk5hdklubmVyLmNvbGxhcHNlKCdoaWRlJyk7XG5cdFx0XHRcdH0sIDEwMCApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBGdW5jdGlvbnMgUnVuIE9uIExvYWQgJiBXaW5kb3cgUmVzaXplXG5cdGZ1bmN0aW9uIG5hdmJhckZuKCkge1xuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soKTtcblxuXHRcdC8vIFJ1biBmdW5jdGlvbiB0byBwcmV2ZW50IHN1Ym1lbnVzIGdvaW5nIG91dHNpZGUgdmlld3BvcnRcblx0XHRuYXZiYXJzLm5vdChtYWluTmF2QmFyKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdE5hdmJhci5tZW51Lm92ZXJmbG93KCQoJy5uYXZiYXItaW5uZXInLCB0aGlzKSk7XG5cdFx0fSk7XG5cblx0XHQvLyBSdW4gZnVuY3Rpb25zIGJhc2VkIG9uIGN1cnJlbnRseSBhY3RpdmUgbWVkaWEgcXVlcnlcblx0XHRpZiAoIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdE5hdmJhci5tZW51Lm92ZXJmbG93KG1haW5OYXZJbm5lcik7XG5cdFx0XHRtYWluV3JhcC5hZGRDbGFzcygnbmF2LWZ1bGwnKS5yZW1vdmVDbGFzcygnbmF2LW1pbmknKTtcblxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0TmF2YmFyLm1lbnUubWVnYU1lbnVUb2dnbGUoJ2VuYWJsZScsICQodGhpcykpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1lbnVQYXJlbnRzLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoSG92ZXIpO1xuXHRcdFx0Ym9keUVsLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoUmVtb3ZlSG92ZXIpO1xuXHRcdH0gZWxzZSBpZiAoIG1xTmF2ID09ICdtb2JpbGUnIHx8IG1xTmF2ID09ICd0YWJsZXQnICkge1xuXHRcdFx0TmF2YmFyLm1vYmlsZS50cmlnZ2VyKG1xTmF2KTtcblx0XHRcdG1haW5XcmFwLmFkZENsYXNzKCduYXYtbWluaScpLnJlbW92ZUNsYXNzKCduYXYtZnVsbCcpO1xuXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHROYXZiYXIubWVudS5tZWdhTWVudVRvZ2dsZSgnZGlzYWJsZScsICQodGhpcykpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1lbnVQYXJlbnRzLm9mZigndG91Y2hzdGFydCcsIG1lbnVUb3VjaEhvdmVyKTtcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7XG5cdFx0XHRpZiAoIG1xTmF2ID09ICdtb2JpbGUnICkge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIodHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICkge1xuXHRcdFx0aWYgKCBtcU5hdiA9PSAndGFibGV0JyApIHtcblx0XHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygnc3RpY2t5Jyk7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kudHJpZ2dlcihmYWxzZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS50cmlnZ2VyKHRydWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdwb3NpdGlvbi10b3AnKTtcblx0XHR9XG5cblx0XHQvLyBWZXJ0aWNhbCBuYXZiYXIgaGFuZGxpbmdcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICYmIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdC8vIE1ha2UgbmF2YmFyIHN0YXRpYyBpZiBpdGVtcyBkb24ndCBmaXQgaW4gdmlld3BvcnRcblx0XHRcdHZlcnRpY2FsTmF2Rml0VmlldygpO1xuXHRcdH1cblxuXHRcdG5hdmJhck92ZXJsYXAoKTtcblxuXHRcdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ29uZXBhZ2UnICkge1xuXHRcdFx0b25lUGFnZU5hdigpO1xuXHRcdH1cblx0fVxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgbmF2YmFyRm4gKSkucmVzaXplKCk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuUE9TVCBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGlmcmFtZUFzcGVjdCwgTW9kZXJuaXpyICovXG5cblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxuXHRcdGNvbnRlbnQgID0gJCgnI2NvbnRlbnQnKTtcblxuXHQvLyBSZXNpemUgRW1iZWRkZWQgVmlkZW9zIFByb3BvcnRpb25hbGx5XG5cdGlmcmFtZUFzcGVjdCggJCgnLnBvc3QgaWZyYW1lJykgKTtcblxuXHQvLyBQb3N0IExheW91dFxuXHRmdW5jdGlvbiBwb3N0c1BhZ2UoKSB7XG5cblx0XHRjb250ZW50LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIEFuaW1hdGUgUG9zdHNcblx0XHRcdHZhciBhbmltUG9zdHMgICAgID0gJCgnLnBvc3RzLWNvbnRhaW5lciAuYXJ0aWNsZS5hbmltYXRlZCcpLFxuXHRcdFx0XHRhbmltUG9zdERlbGF5ID0gKCB2aWV3cG9ydC5zY3JvbGxUb3AoKSA+IDYwMCApID8gMTAgOiAyMDA7XG5cdFx0XHRhbmltUG9zdHMuZWFjaCggZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0dmFyIGVsZW0gPSAkKHRoaXMpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCdpbml0Jyk7XG5cdFx0XHRcdH0sIGluZGV4KysgKiBhbmltUG9zdERlbGF5KTtcblx0XHRcdH0pO1xuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFuaW1Qb3N0cy5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcblx0XHRcdH0sIChhbmltUG9zdHMubGVuZ3RoICsgMSkgKiBhbmltUG9zdERlbGF5KTtcblxuXHRcdFx0Ly8gRmVhdHVyZWQgR2FsbGVyeSBTbGlkZXJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdHZhciBnYWxsZXJ5U2xpZGVyID0gJCgnLmdhbGxlcnktc2xpZGVyJykubm90KCcubGlnaHRTbGlkZXInKTtcblx0XHRcdFx0Z2FsbGVyeVNsaWRlci5saWdodFNsaWRlcih7XG5cdFx0XHRcdFx0aXRlbTogMSxcblx0XHRcdFx0XHRhdXRvOiB0cnVlLFxuXHRcdFx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHRcdFx0cGFnZXI6IGZhbHNlLFxuXHRcdFx0XHRcdHBhdXNlOiA1MDAwLFxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAwLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodEdhbGxlcnkgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdCQoJy5saWdodGJveC1nYWxsZXJ5JykubGlnaHRHYWxsZXJ5KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVxdWFsaXplIGZlYXR1cmVkIG1lZGlhIGhlaWdodCBmb3IgcmVsYXRlZCBwb3N0cyBhbmQgZ3JpZCBibG9nXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHQkLmZuLm1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuYmxvZy1ncmlkIC5wb3N0cy1jb250YWluZXIgLnBvc3QtZmVhdCcpLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblxuXHRcdFx0XHRpZiAoICEgTW9kZXJuaXpyLmZsZXhib3ggKSB7XG5cdFx0XHRcdFx0JCgnLmJsb2ctZ3JpZCAucG9zdHMtY29udGFpbmVyIGFydGljbGUnKS5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XG5cblx0XHRcdFx0XHR2YXIgbWF0Y2hIZWlnaHRFbCA9ICQoJy5wb3N0LXJlbGF0ZWQgLnBvc3QtZmVhdCcpLFxuXHRcdFx0XHRcdFx0bWF0Y2hIZWlnaHRUYXJnZXQgPSBtYXRjaEhlaWdodEVsLmZpbmQoJy53cC1wb3N0LWltYWdlJyk7XG5cdFx0XHRcdFx0aWYgKCBtYXRjaEhlaWdodFRhcmdldC5sZW5ndGggPT09IDAgKSBtYXRjaEhlaWdodFRhcmdldCA9IG51bGw7XG5cdFx0XHRcdFx0bWF0Y2hIZWlnaHRFbC5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KHtcblx0XHRcdFx0XHRcdHRhcmdldDogbWF0Y2hIZWlnaHRUYXJnZXQsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdH0pO1xuXHR9XG5cblxuXHQvLyBMb2FkIFBvc3RzICYgQ29tbWVudHMgdmlhIEFqYXhcblx0ZnVuY3Rpb24gbWl4dEFqYXhMb2FkKHR5cGUpIHtcblx0XHR0eXBlID0gdHlwZSB8fCAncG9zdHMnO1xuXHRcdHZhciBwYWdDb250ID0gJCgnLnBhZ2luZy1uYXZpZ2F0aW9uJyksXG5cdFx0XHRhamF4QnRuID0gJCgnLmFqYXgtbW9yZScsIHBhZ0NvbnQpO1xuXG5cdFx0aWYgKCAhIHBhZ0NvbnQubGVuZ3RoIHx8ICEgYWpheEJ0bi5sZW5ndGggKSByZXR1cm47XG5cdFx0XG5cdFx0dmFyIHBhZ2VOb3cgPSBwYWdDb250LmRhdGEoJ3BhZ2Utbm93JyksXG5cdFx0XHRwYWdlTWF4ID0gcGFnQ29udC5kYXRhKCdwYWdlLW1heCcpLFxuXHRcdFx0bmV4dFVybCA9IGFqYXhCdG4uYXR0cignaHJlZicpLFxuXHRcdFx0cGFnZU51bSxcblx0XHRcdHBhZ2VUeXBlLFxuXHRcdFx0Y29udGFpbmVyLFxuXHRcdFx0ZWxlbWVudCxcblx0XHRcdGxvYWRTZWw7XG5cblx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XG5cdFx0XHRjb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XG5cdFx0XHRlbGVtZW50ICAgPSAnLmFydGljbGUnO1xuXHRcdFx0bG9hZFNlbCAgID0gJyAucG9zdHMtY29udGFpbmVyIC5hcnRpY2xlJztcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdzaG9wJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XG5cdFx0XHRjb250YWluZXIgPSAkKCd1bC5wcm9kdWN0cycpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5wcm9kdWN0Jztcblx0XHRcdGxvYWRTZWwgICA9ICcgdWwucHJvZHVjdHMgPiBsaSc7XG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgnLmNvbW1lbnQtbGlzdCcpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5jb21tZW50Jztcblx0XHRcdGxvYWRTZWwgICA9ICcgLmNvbW1lbnQtbGlzdCA+IGxpJztcblx0XHR9XG5cblx0XHRpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyAtIDE7XG5cdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyArIDE7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHBhZ2VOb3cgPj0gcGFnZU1heCApICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSAhPSAnbmV3ZXN0JyB8fCBwYWdlTnVtIDw9IDAgKSB7XG5cdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcblx0XHR9XG5cdFx0XG5cdFx0YWpheEJ0bi5vbignY2xpY2sgY29udDpib3R0b20nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIFByZXZlbnQgbG9hZGluZyB0d2ljZSBvbiBzY3JvbGxcblx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XG5cdFx0XG5cdFx0XHQvLyBBcmUgdGhlcmUgbW9yZSBwYWdlcyB0byBsb2FkP1xuXHRcdFx0aWYgKCBwYWdlTnVtID4gMCAmJiBwYWdlTnVtIDw9IHBhZ2VNYXggKSB7XG5cdFx0XHRcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2xvYWRpbmcnKTtcblxuXHRcdFx0XHQvLyBMb2FkIHBvc3RzXG5cdFx0XHRcdC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG5cdFx0XHRcdCQoJzxkaXY+JykubG9hZChuZXh0VXJsICsgbG9hZFNlbCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XG5cdFx0XHRcdFx0dmFyIG5ld1Bvc3RzID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdGFqYXhCdG4uYmx1cigpO1xuXG5cdFx0XHRcdFx0bmV3UG9zdHMuY2hpbGRyZW4oZWxlbWVudCkuYWRkQ2xhc3MoJ2FqYXgtbmV3Jyk7XG5cdFx0XHRcdFx0aWYgKCAoIHR5cGUgPT0gJ3Bvc3RzJyB8fCB0eXBlID09ICdzaG9wJyApICYmIG1peHRfb3B0LmxheW91dC50eXBlICE9ICdtYXNvbnJ5JyAmJiBtaXh0X29wdC5sYXlvdXRbJ3Nob3ctcGFnZS1uciddICkge1xuXHRcdFx0XHRcdFx0bmV3UG9zdHMucHJlcGVuZCgnPGRpdiBjbGFzcz1cImFqYXgtcGFnZSBwYWdlLScrIHBhZ2VOdW0gKydcIj48YSBocmVmPVwiJysgbmV4dFVybCArJ1wiPlBhZ2UgJysgcGFnZU51bSArJzwvYT48L2Rpdj4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChuZXdQb3N0cy5odG1sKCkpO1xuXG5cdFx0XHRcdFx0bmV3UG9zdHMgPSBjb250YWluZXIuY2hpbGRyZW4oJy5hamF4LW5ldycpO1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHBhZ2UgbnVtYmVyIGFuZCBuZXh0VXJsXG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcblx0XHRcdFx0XHRcdFx0cGFnZU51bS0tO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cGFnZU51bSsrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZU51bSsrO1xuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvcGFnZVxcL1swLTldPy8sICcvcGFnZS8nICsgcGFnZU51bSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYnV0dG9uIHN0YXRlXG5cdFx0XHRcdFx0aWYgKCBwYWdlTnVtIDw9IHBhZ2VNYXggJiYgcGFnZU51bSA+IDAgKSB7IGFqYXhCdG4uYnV0dG9uKCdyZXNldCcpOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpOyB9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgbGF5b3V0IG9uY2UgcG9zdHMgaGF2ZSBsb2FkZWRcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnJlbW92ZUNsYXNzKCdhamF4LW5ldyBpbml0Jyk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcblx0XHRcdFx0XHRcdFx0aWZyYW1lQXNwZWN0KCk7XG5cdFx0XHRcdFx0XHRcdHBvc3RzUGFnZSgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRcdFx0XHRcdCRjb250YWluZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCRjb250YWluZXIuaXNvdG9wZSgnYXBwZW5kZWQnLCBuZXdQb3N0cyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dmlld3BvcnQudHJpZ2dlcigncmVmcmVzaCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIDEwMCk7XG5cblx0XHRcdFx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgKSB7IHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTsgfVxuXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIEVycm9yc1xuXHRcdFx0XHRcdGlmICggc3RhdHVzID09ICdlcnJvcicgKSB7XG5cdFx0XHRcdFx0XHRhamF4QnRuLmJ1dHRvbignZXJyb3InKTtcblx0XHRcdFx0XHRcdC8vIERlYnVnZ2luZyBpbmZvXG5cdFx0XHRcdFx0XHQvLyBhbGVydCgnQUpBWCBFcnJvcjogJyArIHhoci5zdGF0dXMgKyAnICcgKyB4aHIuc3RhdHVzVGV4dCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXG5cdFx0Ly8gVHJpZ2dlciBBSkFYIGxvYWQgd2hlbiByZWFjaGluZyBib3R0b20gb2YgcGFnZVxuXHRcdHZhciBhamF4U2Nyb2xsSGFuZGxlID0gJC5kZWJvdW5jZSggNTAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0LyogZ2xvYmFsIGVsZW1WaXNpYmxlICovXG5cdFx0XHRcdGlmICggZWxlbVZpc2libGUoYWpheEJ0biwgdmlld3BvcnQpID09PSB0cnVlICkge1xuXHRcdFx0XHRcdGFqYXhCdG4udHJpZ2dlcignY29udDpib3R0b20nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkge1xuXHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xuXHRcdH1cblx0fVxuXHQvLyBFeGVjdXRlIEZ1bmN0aW9uIFdoZXJlIEFwcGxpY2FibGVcblx0aWYgKCBtaXh0X29wdC5wYWdlWydwb3N0cy1wYWdlJ10gJiYgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1zY3JvbGwnICkge1xuXHRcdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ3Nob3AnICkge1xuXHRcdFx0bWl4dEFqYXhMb2FkKCdzaG9wJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1peHRBamF4TG9hZCgncG9zdHMnKTtcblx0XHR9XG5cdH1cblx0aWYgKCBtaXh0X29wdC5wYWdlWydwYWdlLXR5cGUnXSA9PSAnc2luZ2xlJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtY2xpY2snIHx8IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1zY3JvbGwnICkge1xuXHRcdG1peHRBamF4TG9hZCgnY29tbWVudHMnKTtcblx0fVxuXG5cblx0Ly8gS2VlcCBwb3N0IGNvbnRlbnQgYWJvdmUgYSBtaW5pbXVtIGhlaWdodCB0byBtYWludGFpbiByZWFkYWJpbGl0eVxuXHRmdW5jdGlvbiBwb3N0Q29udGVudE1pbldpZHRoKCkge1xuXHRcdHZhciBtaW5XID0gMzIwLFxuXHRcdFx0cG9zdE1pblcgPSBtaW5XICogMixcblx0XHRcdHBvc3QgPSAkKCcuc2luZ2xlLWNvbnRlbnQuaGFzLWNvbHVtbnMnKSxcblx0XHRcdGNvbnQgPSAkKCcuZW50cnktYm9keScsIHBvc3QpO1xuXHRcdGlmICggY29udC5oYXNDbGFzcygnY29sLXNtLTQnKSApIHtcblx0XHRcdHBvc3RNaW5XID0gbWluVyAqIDM7XG5cdFx0fSBlbHNlIGlmICggY29udC5oYXNDbGFzcygnY29sLXNtLTgnKSApIHtcblx0XHRcdHBvc3RNaW5XID0gbWluVyAqIDEuNTtcblx0XHR9XG5cdFx0aWYgKCBwb3N0LndpZHRoKCkgPCBwb3N0TWluVyApIHtcblx0XHRcdHBvc3QuYWRkQ2xhc3MoJ292ZXJyaWRlLWNvbHMnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cG9zdC5yZW1vdmVDbGFzcygnb3ZlcnJpZGUtY29scycpO1xuXHRcdH1cblx0fVxuXG5cblx0Ly8gRnVuY3Rpb25zIFRvIFJ1biBPbiBXaW5kb3cgUmVzaXplXG5cdGZ1bmN0aW9uIHJlc2l6ZUZuKCkge1xuXHRcdGlmcmFtZUFzcGVjdCgpO1xuXG5cdFx0cG9zdENvbnRlbnRNaW5XaWR0aCgpO1xuXHR9XG5cdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCByZXNpemVGbiApKTtcblxuXG5cdC8vIEZ1bmN0aW9ucyBUbyBSdW4gT24gTG9hZFxuXHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcblxuXHRcdHBvc3RzUGFnZSgpO1xuXG5cdFx0cG9zdENvbnRlbnRNaW5XaWR0aCgpO1xuXG5cdFx0Ly8gSXNvdG9wZSBNYXNvbnJ5IEluaXRcblx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyAmJiB0eXBlb2YgJC5mbi5pc290b3BlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0dmFyIGJsb2dDb250ID0gJCgnLmJsb2ctbWFzb25yeSAucG9zdHMtY29udGFpbmVyJyk7XG5cblx0XHRcdGJsb2dDb250Lmlzb3RvcGUoe1xuXHRcdFx0XHRpdGVtU2VsZWN0b3I6ICcuYXJ0aWNsZScsXG5cdFx0XHRcdGxheW91dDogJ21hc29ucnknLFxuXHRcdFx0XHRndXR0ZXI6IDBcblx0XHRcdH0pO1xuXG5cdFx0XHRibG9nQ29udC5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSk7XG5cdFx0XHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7IGJsb2dDb250Lmlzb3RvcGUoJ2xheW91dCcpOyB9ICkpO1xuXHRcdH1cblxuXG5cdFx0Ly8gVHJpZ2dlciBMaWdodGJveCBPbiBGZWF0dXJlZCBJbWFnZSBDbGlja1xuXHRcdCQoJy5saWdodGJveC10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLnNpYmxpbmdzKCcuZ2FsbGVyeScpLmZpbmQoJ2xpJykuZmlyc3QoKS5jbGljaygpO1xuXHRcdH0pO1xuXG5cblx0XHQvLyBSZWxhdGVkIFBvc3RzIFNsaWRlclxuXHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHR2YXIgcmVsUG9zdHNTbGlkZXIgPSAkKCcucG9zdC1yZWxhdGVkIC5zbGlkZXItY29udCcpLFxuXHRcdFx0XHR0eXBlID0gcmVsUG9zdHNTbGlkZXIuZGF0YSgndHlwZScpLFxuXHRcdFx0XHRjb2xzID0gcmVsUG9zdHNTbGlkZXIuZGF0YSgnY29scycpLFxuXHRcdFx0XHR0YWJsZXRDb2xzID0gcmVsUG9zdHNTbGlkZXIuZGF0YSgndGFibGV0LWNvbHMnKSxcblx0XHRcdFx0bW9iaWxlQ29scyA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ21vYmlsZS1jb2xzJyk7XG5cdFx0XHRyZWxQb3N0c1NsaWRlci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWxQb3N0c1NsaWRlci5saWdodFNsaWRlcih7XG5cdFx0XHRcdFx0aXRlbTogY29scyxcblx0XHRcdFx0XHRjb250cm9sczogKHR5cGUgPT0gJ21lZGlhJyksXG5cdFx0XHRcdFx0cGFnZXI6ICh0eXBlID09ICd0ZXh0JyksXG5cdFx0XHRcdFx0a2V5UHJlc3M6IHRydWUsXG5cdFx0XHRcdFx0c2xpZGVNYXJnaW46IDIwLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFt7XG5cdFx0XHRcdFx0XHRicmVha3BvaW50OiAxMjAwLFxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogdGFibGV0Q29scyB9XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogNTgwLFxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogbW9iaWxlQ29scyB9XG5cdFx0XHRcdFx0fV0sXG5cdFx0XHRcdFx0b25TbGlkZXJMb2FkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJlbFBvc3RzU2xpZGVyLnJlbW92ZUNsYXNzKCdpbml0Jyk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0XHQkKCcucG9zdC1mZWF0JywgcmVsUG9zdHNTbGlkZXIpLm1hdGNoSGVpZ2h0KCk7XG5cdFx0XHRcdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmNzcygnaGVpZ2h0JywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cblVJIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xuXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KSxcblx0XHRodG1sRWwgICA9ICQoJ2h0bWwnKSxcblx0XHRib2R5RWwgICA9ICQoJ2JvZHknKTtcblxuXG5cdC8vIFNwaW5uZXIgSW5wdXRcblx0JCgnLm1peHQtc3Bpbm5lcicpLm9uKCdjbGljaycsICcuYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRlbCAgICAgPSAkKHRoaXMpLFxuXHRcdFx0c3Bpbm5lciA9ICRlbC5wYXJlbnRzKCcubWl4dC1zcGlubmVyJyksXG5cdFx0XHRpbnB1dCAgID0gc3Bpbm5lci5jaGlsZHJlbignLnNwaW5uZXItdmFsJyksXG5cdFx0XHRzdGVwICAgID0gaW5wdXQuYXR0cignc3RlcCcpIHx8IDEsXG5cdFx0XHRtaW5WYWwgID0gaW5wdXQuYXR0cignbWluJykgfHwgMCxcblx0XHRcdG1heFZhbCAgPSBpbnB1dC5hdHRyKCdtYXgnKSB8fCBudWxsLFxuXHRcdFx0dmFsICAgICA9IGlucHV0LnZhbCgpLFxuXHRcdFx0bmV3VmFsO1xuXHRcdGlmICggaXNOYU4odmFsKSApIHZhbCA9IG1pblZhbDtcblx0XHRcblx0XHRpZiAoICRlbC5oYXNDbGFzcygnbWludXMnKSApIHtcblx0XHRcdC8vIERlY3JlYXNlXG5cdFx0XHRuZXdWYWwgPSBwYXJzZUZsb2F0KHZhbCkgLSBwYXJzZUZsb2F0KHN0ZXApO1xuXHRcdFx0aWYgKCBuZXdWYWwgPCBtaW5WYWwgKSBuZXdWYWwgPSBtaW5WYWw7XG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSW5jcmVhc2Vcblx0XHRcdG5ld1ZhbCA9IHBhcnNlRmxvYXQodmFsKSArIHBhcnNlRmxvYXQoc3RlcCk7XG5cdFx0XHRpZiAoIG1heFZhbCAhPT0gbnVsbCAmJiBuZXdWYWwgPiBtYXhWYWwgKSBuZXdWYWwgPSBtYXhWYWw7XG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcblx0XHR9XG5cdH0pO1xuXG5cblx0Ly8gQ29udGVudCBGaWx0ZXJpbmdcblx0JCgnLmNvbnRlbnQtZmlsdGVyLWxpbmtzJykuY2hpbGRyZW4oKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGxpbmsgPSAkKHRoaXMpLFxuXHRcdFx0ZmlsdGVyID0gbGluay5kYXRhKCdmaWx0ZXInKSxcblx0XHRcdGNvbnRlbnQgPSAkKCcuJyArIGxpbmsucGFyZW50cygnLmNvbnRlbnQtZmlsdGVyLWxpbmtzJykuZGF0YSgnY29udGVudCcpKSxcblx0XHRcdGZpbHRlckNsYXNzID0gJ2ZpbHRlci1oaWRkZW4nO1xuXHRcdGxpbmsuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGlmICggZmlsdGVyID09ICdhbGwnICkgeyBjb250ZW50LmZpbmQoJy4nK2ZpbHRlckNsYXNzKS5yZW1vdmVDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVEb3duKDYwMCk7IH1cblx0XHRlbHNlIHsgY29udGVudC5maW5kKCcuJyArIGZpbHRlcikucmVtb3ZlQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlRG93big2MDApLnNpYmxpbmdzKCc6bm90KC4nK2ZpbHRlcisnKScpLmFkZENsYXNzKGZpbHRlckNsYXNzKS5zbGlkZVVwKDYwMCk7IH1cblx0fSk7XG5cblxuXHQvLyBTb3J0IHBvcnRmb2xpbyBpdGVtc1xuXHQkKCcucG9ydGZvbGlvLXNvcnRlciBhJykuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSA9ICQodGhpcyksXG5cdFx0XHR0YXJnZXRUYWcgPSBlbGVtLmRhdGEoJ3NvcnQnKSxcblx0XHRcdHRhcmdldENvbnRhaW5lciA9ICQoJy5wb3N0cy1jb250YWluZXInKTtcblxuXHRcdGVsZW0ucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0Ly8gUmVtb3ZlIGFuaW1hdGVkIGNsYXNzIHRvIHByZXZlbnQgdHJhbnNpdGlvbiBnbGl0Y2hlc1xuXHRcdHRhcmdldENvbnRhaW5lci5maW5kKCcuYXJ0aWNsZS5hbmltYXRlZCcpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xuXG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdGlmICh0YXJnZXRUYWcgPT0gJ2FsbCcpIHtcblx0XHRcdFx0dGFyZ2V0Q29udGFpbmVyLmlzb3RvcGUoeyBmaWx0ZXI6ICcqJyB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnLicgKyB0YXJnZXRUYWcgfSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwcm9qZWN0cyA9IHRhcmdldENvbnRhaW5lci5jaGlsZHJlbignLnBvcnRmb2xpbycpO1xuXHRcdFx0aWYgKCB0YXJnZXRUYWcgPT0gJ2FsbCcgKSB7XG5cdFx0XHRcdHByb2plY3RzLmZhZGVJbigzMDApLmFkZENsYXNzKCdmaWx0ZXJlZCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJvamVjdHMuZmFkZU91dCgwKS5yZW1vdmVDbGFzcygnZmlsdGVyZWQnKS5maWx0ZXIoJy4nICsgdGFyZ2V0VGFnKS5mYWRlSW4oMzAwKS5hZGRDbGFzcygnZmlsdGVyZWQnKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cblx0Ly8gT2Zmc2V0IHNjcm9sbGluZyB0byBsaW5rIGFuY2hvciAoaGFzaClcblx0JCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIGxpbmsgPSAkKHRoaXMpLFxuXHRcdFx0aGFzaCA9IGxpbmsuYXR0cignaHJlZicpO1xuXG5cdFx0aWYgKCBsaW5rLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJykgfHwgJChlLnRhcmdldCkuZGF0YSgnbm8taGFzaC1zY3JvbGwnKSB8fCBoYXNoID09ICcjJyApIHJldHVybiB0cnVlO1xuXG5cdFx0aWYgKCBoYXNoLmxlbmd0aCApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciB0YXJnZXQgPSAkKGhhc2gpO1xuXHRcdFx0aWYgKCB0YXJnZXQubGVuZ3RoKSB7XG5cdFx0XHRcdHZhciBoYXNoT2Zmc2V0ID0gJChoYXNoKS5vZmZzZXQoKS50b3AgKyAxO1xuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgJCgnI21haW4tbmF2JykuZGF0YSgnZml4ZWQnKSApIHsgaGFzaE9mZnNldCAtPSAkKCcjbWFpbi1uYXYnKS5vdXRlckhlaWdodCgpOyB9XG5cdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSAmJiAkKCcjd3BhZG1pbmJhcicpLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnICkgeyBoYXNoT2Zmc2V0IC09ICQoJyN3cGFkbWluYmFyJykuaGVpZ2h0KCk7IH1cblx0XHRcdFx0aHRtbEVsLmFkZChib2R5RWwpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IGhhc2hPZmZzZXQgfSwgNjAwICk7XG5cdFx0XHR9XG5cdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIGhhc2gpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdC8vIElnbm9yZSBzcGVjaWZpYyBhbmNob3JzXG5cdCQoJy50YWJzIGEsIC52Y190dGEgYSwgLnVpLWFjY29yZGlvbiBhJykuZGF0YSgnbm8taGFzaC1zY3JvbGwnLCB0cnVlKTtcblxuXG5cdC8vIFNvY2lhbCBJY29uc1xuXHQkKCcuc29jaWFsLWxpbmtzJykubm90KCcuaG92ZXItbm9uZScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ID0gJCh0aGlzKTtcblxuXHRcdGNvbnQuY2hpbGRyZW4oKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpY29uID0gJCh0aGlzKSxcblx0XHRcdFx0bGluayA9IGljb24uY2hpbGRyZW4oJ2EnKSxcblx0XHRcdFx0ZGF0YUNvbG9yID0gbGluay5hdHRyKCdkYXRhLWNvbG9yJyk7XG5cblx0XHRcdGlmICggY29udC5oYXNDbGFzcygnaG92ZXItYmcnKSB8fCBjb250LnBhcmVudHMoJy5uby1ob3Zlci1iZycpLmxlbmd0aCApIHtcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bGluay5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6IGRhdGFDb2xvciwgekluZGV4OiAxIH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcnLCB6SW5kZXg6ICcnIH0pOyB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxpbmsuaG92ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGxpbmsuY3NzKHsgY29sb3I6IGRhdGFDb2xvciwgekluZGV4OiAxIH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBjb2xvcjogJycsIHpJbmRleDogJycgfSk7IH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0XG5cblx0Ly8gRWxlbWVudCBBbmltYXRpb25zXG5cdGZ1bmN0aW9uIG1peHRBbmltYXRpb25zKCkge1xuXHRcdHZhciBhbmltRWxlbXMgPSAkKCcubWl4dC1hbmltYXRlJyk7XG5cblx0XHRpZiAoIGFuaW1FbGVtcy5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxuXG5cdFx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRhbmltRWxlbXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRcdFx0ZGVsYXkgPSAkdGhpcy5kYXRhKCdhbmltLWRlbGF5JykgPyBNYXRoLmFicyhwYXJzZUludCgkdGhpcy5kYXRhKCdhbmltLWRlbGF5JykpKSA6IDA7XG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoJ2FuaW0tb24tdmlldycpICYmIHR5cGVvZiAkLmZuLndheXBvaW50ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdCR0aGlzLndheXBvaW50KCBmdW5jdGlvbigpIHtcdFxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdhbmltLXByZScpLmFkZENsYXNzKCdhbmltLXN0YXJ0Jyk7XG5cdFx0XHRcdFx0XHR9LCBkZWxheSk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICc4NSUnLFxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdhbmltLXByZScpLmFkZENsYXNzKCdhbmltLXN0YXJ0Jyk7XG5cdFx0XHRcdFx0fSwgZGVsYXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXHRtaXh0QW5pbWF0aW9ucygpO1xuXG5cblx0Ly8gT24gSG92ZXIgQW5pbWF0aW9uc1xuXHRmdW5jdGlvbiBhbmltYXRlSG92ZXJJbihlbGVtKSB7XG5cdFx0ZWxlbS5hZGRDbGFzcygnaG92ZXJlZCcpO1xuXHRcdHZhciBpbm5lciAgID0gZWxlbS5jaGlsZHJlbignLm9uLWhvdmVyJyksXG5cdFx0XHRhbmltSW4gID0gaW5uZXIuZGF0YSgnYW5pbS1pbicpIHx8ICdmYWRlSW4nLFxuXHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xuXHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1PdXQpLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbUluKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1hdGVIb3Zlck91dChlbGVtKSB7XG5cdFx0ZWxlbS5yZW1vdmVDbGFzcygnaG92ZXJlZCcpO1xuXHRcdHZhciBpbm5lciAgID0gZWxlbS5jaGlsZHJlbignLm9uLWhvdmVyJyksXG5cdFx0XHRhbmltSW4gID0gaW5uZXIuZGF0YSgnYW5pbS1pbicpIHx8ICdmYWRlSW4nLFxuXHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xuXHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1JbikuYWRkQ2xhc3MoYW5pbU91dCk7XG5cdH1cblxuXG5cdC8vIFBvc3QgR3JpZCBSZXNwb25zaXZlIENvbHVtbnNcblx0ZnVuY3Rpb24gcG9zdEdyaWRDb2x1bW5zKCkge1xuXHRcdCQoJy52Y19ncmlkLWNvbnRhaW5lci5yZXNwb25zaXZlLWNvbHMnKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtID0gJCh0aGlzKSxcblx0XHRcdFx0Y2xhc3NlcyA9IGVsZW1bMF0uY2xhc3NOYW1lLm1hdGNoKC9yZXNwLShcXHd7Mn0tXFxkezEsMn0pL2cpO1xuXHRcdFx0aWYgKCBjbGFzc2VzICE9PSBudWxsICkge1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4gPSBlbGVtLmZpbmQoJy52Y19ncmlkLWl0ZW0nKTtcblx0XHRcdFx0JChjbGFzc2VzKS5lYWNoKCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XG5cdFx0XHRcdFx0Y2hpbGRyZW4uYWRkQ2xhc3ModmFsLnJlcGxhY2UoJ3Jlc3AtJywgJ2NvbC0nKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblxuXHQvLyBGdW5jdGlvbnMgcnVuIG9uIHBhZ2UgbG9hZCBhbmQgXCJyZWZyZXNoXCIgZXZlbnRcblx0ZnVuY3Rpb24gcnVuT25SZWZyZXNoKCkge1xuXHRcdC8vIFRvb2x0aXBzIEluaXRcblx0XHQkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdLCAucmVsYXRlZC10aXRsZS10aXAnKS50b29sdGlwKHtcblx0XHRcdHBsYWNlbWVudDogJ2F1dG8nLFxuXHRcdFx0Y29udGFpbmVyOiAnYm9keSdcblx0XHR9KTtcblxuXHRcdC8vIE9uIEhvdmVyIEFuaW1hdGlvbnMgSW5pdFxuXHRcdHZhciBhbmltSG92ZXJFbCA9ICQoJy5hbmltLW9uLWhvdmVyJyk7XG5cdFx0Ly8gT24gaG92ZXJJbnRlbnRcblx0XHRhbmltSG92ZXJFbC5ob3ZlckludGVudCggZnVuY3Rpb24oKSB7XG5cdFx0XHRhbmltYXRlSG92ZXJJbigkKHRoaXMpKTtcblx0XHR9LCBmdW5jdGlvbigpIHtcblx0XHRcdGFuaW1hdGVIb3Zlck91dCgkKHRoaXMpKTtcblx0XHR9LCA1MCk7XG5cdFx0Ly8gSGFuZGxlIE1vYmlsZSBUYXBcblx0XHRhbmltSG92ZXJFbC5vbigndG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0aWYgKCAhICR0aGlzLmhhc0NsYXNzKCdob3ZlcmVkJykgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0YW5pbWF0ZUhvdmVySW4oJHRoaXMpO1xuXHRcdFx0XHRhbmltSG92ZXJFbC5ub3QoJHRoaXMpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGFuaW1hdGVIb3Zlck91dCgkKHRoaXMpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQvLyBDbGVhciBhbmltYXRpb25cblx0XHRhbmltSG92ZXJFbC5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIE1TQW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbSA9ICQodGhpcyk7XG5cdFx0XHRpZiAoICEgZWxlbS5oYXNDbGFzcygnaG92ZXJlZCcpICkge1xuXHRcdFx0XHRlbGVtLmNoaWxkcmVuKCcub24taG92ZXInKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHR2aWV3cG9ydC5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJ1bk9uUmVmcmVzaCgpO1xuXHR9KS50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cblx0JChkb2N1bWVudCkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHRcdHJ1bk9uUmVmcmVzaCgpO1xuXG5cdFx0cG9zdEdyaWRDb2x1bW5zKCk7XG5cdH0pO1xuXG5cblx0Ly8gQmFjayBUbyBUb3AgQnV0dG9uXG5cdHZhciBiYWNrVG9Ub3AgPSAkKCcjYmFjay10by10b3AnKTtcblxuXHRmdW5jdGlvbiBiYWNrVG9Ub3BEaXNwbGF5KCkge1xuXHRcdHZhciBzY3JvbGxUb3AgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblx0XHRpZiAoIHNjcm9sbFRvcCA+IDYwMCApIHtcblx0XHRcdGJhY2tUb1RvcC5mYWRlSW4oMzAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YmFja1RvVG9wLmZhZGVPdXQoMzAwKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIGJhY2tUb1RvcC5sZW5ndGggKSB7XG5cdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsICQudGhyb3R0bGUoIDEwMDAsIGJhY2tUb1RvcERpc3BsYXkgKSkuc2Nyb2xsKCk7XG5cblx0XHRiYWNrVG9Ub3AuY2xpY2soIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDYwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRcblx0Ly8gSW5mbyBCYXJcblx0dmFyIGluZm9CYXJXcmFwID0gJCgnI2luZm8tYmFyLXdyYXAnKSxcblx0XHRpbmZvQmFyID0gaW5mb0JhcldyYXAuY2hpbGRyZW4oJy5pbmZvLWJhcicpO1xuXG5cdGZ1bmN0aW9uIGluZm9CYXJTdGlja3koKSB7XG5cdFx0dmFyIGJhckhlaWdodCA9IGluZm9CYXIub3V0ZXJIZWlnaHQoKTtcblx0XHRpbmZvQmFyV3JhcC5jc3MoJ21pbi1oZWlnaHQnLCBiYXJIZWlnaHQpO1xuXHRcdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHsgYmFja1RvVG9wLmNzcygnbWFyZ2luLWJvdHRvbScsIGJhckhlaWdodCk7IH1cblx0fVxuXG5cdGlmICggaW5mb0Jhci5sZW5ndGggKSB7XG5cdFx0aW5mb0Jhci5maW5kKCcuaW5mby1jbG9zZScpLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdGluZm9CYXJXcmFwLmZhZGVPdXQoMzAwKTtcblx0XHRcdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHsgYmFja1RvVG9wLmNzcygnbWFyZ2luLWJvdHRvbScsICcnKTsgfVxuXHRcdH0pO1xuXHRcdGlmICggaW5mb0Jhci5oYXNDbGFzcygnc3RpY2t5JykgKSB7IGluZm9CYXJTdGlja3koKTsgfVxuXHR9XG5cbn0pKGpRdWVyeSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

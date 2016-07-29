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

/*!
 * JavaScript Cookie v2.1.2
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api(key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
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

		$(document).ready( function() {
			if ( ! window.mobileCheck() ) {
				$(window).resize( $.debounce( 500, headerFn ) );
			} else {
				$(window).on('orientationchange', headerFn );
			}
		});
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
							viewport.trigger('post-load').trigger('refresh');
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
		input.trigger('change');
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
		infoBar.find('.info-close').click( function(event) {
			event.preventDefault();
			infoBarWrap.slideUp(300, function() {
				if ( mixt_opt.layout['info-bar-cookie'] && typeof Cookies === 'function' ) {
					var cookie_persist = parseInt(mixt_opt.layout['info-bar-cookie-persist']);
					if ( cookie_persist < 1 || cookie_persist > 999 ) {
						cookie_persist = 999;
					}
					Cookies.set('mixt_info_bar_close', true, { expires: cookie_persist, path: '/' });
				}
			});
			if ( backToTop.length ) { backToTop.css('margin-bottom', ''); }
		});
		if ( infoBar.hasClass('sticky') ) { infoBarSticky(); }
	}

})(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiZmVhdGhlcmxpZ2h0LmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJqcXVlcnkucGxhY2Vob2xkZXIuanMiLCJqcy5jb29raWUuanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDellBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNWhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlIC0gdjEuMSAtIDMvNy8yMDEwXHJcbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cclxuICogXHJcbiAqIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hblxyXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cclxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xyXG4gKi9cclxuXHJcbi8vIFNjcmlwdDogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2U6IFNvbWV0aW1lcywgbGVzcyBpcyBtb3JlIVxyXG4vL1xyXG4vLyAqVmVyc2lvbjogMS4xLCBMYXN0IHVwZGF0ZWQ6IDMvNy8yMDEwKlxyXG4vLyBcclxuLy8gUHJvamVjdCBIb21lIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xyXG4vLyBHaXRIdWIgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL1xyXG4vLyBTb3VyY2UgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLmpzXHJcbi8vIChNaW5pZmllZCkgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UubWluLmpzICgwLjdrYilcclxuLy8gXHJcbi8vIEFib3V0OiBMaWNlbnNlXHJcbi8vIFxyXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW4sXHJcbi8vIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxyXG4vLyBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXHJcbi8vIFxyXG4vLyBBYm91dDogRXhhbXBsZXNcclxuLy8gXHJcbi8vIFRoZXNlIHdvcmtpbmcgZXhhbXBsZXMsIGNvbXBsZXRlIHdpdGggZnVsbHkgY29tbWVudGVkIGNvZGUsIGlsbHVzdHJhdGUgYSBmZXdcclxuLy8gd2F5cyBpbiB3aGljaCB0aGlzIHBsdWdpbiBjYW4gYmUgdXNlZC5cclxuLy8gXHJcbi8vIFRocm90dGxlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy90aHJvdHRsZS9cclxuLy8gRGVib3VuY2UgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL2RlYm91bmNlL1xyXG4vLyBcclxuLy8gQWJvdXQ6IFN1cHBvcnQgYW5kIFRlc3RpbmdcclxuLy8gXHJcbi8vIEluZm9ybWF0aW9uIGFib3V0IHdoYXQgdmVyc2lvbiBvciB2ZXJzaW9ucyBvZiBqUXVlcnkgdGhpcyBwbHVnaW4gaGFzIGJlZW5cclxuLy8gdGVzdGVkIHdpdGgsIHdoYXQgYnJvd3NlcnMgaXQgaGFzIGJlZW4gdGVzdGVkIGluLCBhbmQgd2hlcmUgdGhlIHVuaXQgdGVzdHNcclxuLy8gcmVzaWRlIChzbyB5b3UgY2FuIHRlc3QgaXQgeW91cnNlbGYpLlxyXG4vLyBcclxuLy8galF1ZXJ5IFZlcnNpb25zIC0gbm9uZSwgMS4zLjIsIDEuNC4yXHJcbi8vIEJyb3dzZXJzIFRlc3RlZCAtIEludGVybmV0IEV4cGxvcmVyIDYtOCwgRmlyZWZveCAyLTMuNiwgU2FmYXJpIDMtNCwgQ2hyb21lIDQtNSwgT3BlcmEgOS42LTEwLjEuXHJcbi8vIFVuaXQgVGVzdHMgICAgICAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvdW5pdC9cclxuLy8gXHJcbi8vIEFib3V0OiBSZWxlYXNlIEhpc3RvcnlcclxuLy8gXHJcbi8vIDEuMSAtICgzLzcvMjAxMCkgRml4ZWQgYSBidWcgaW4gPGpRdWVyeS50aHJvdHRsZT4gd2hlcmUgdHJhaWxpbmcgY2FsbGJhY2tzXHJcbi8vICAgICAgIGV4ZWN1dGVkIGxhdGVyIHRoYW4gdGhleSBzaG91bGQuIFJld29ya2VkIGEgZmFpciBhbW91bnQgb2YgaW50ZXJuYWxcclxuLy8gICAgICAgbG9naWMgYXMgd2VsbC5cclxuLy8gMS4wIC0gKDMvNi8yMDEwKSBJbml0aWFsIHJlbGVhc2UgYXMgYSBzdGFuZC1hbG9uZSBwcm9qZWN0LiBNaWdyYXRlZCBvdmVyXHJcbi8vICAgICAgIGZyb20ganF1ZXJ5LW1pc2MgcmVwbyB2MC40IHRvIGpxdWVyeS10aHJvdHRsZSByZXBvIHYxLjAsIGFkZGVkIHRoZVxyXG4vLyAgICAgICBub190cmFpbGluZyB0aHJvdHRsZSBwYXJhbWV0ZXIgYW5kIGRlYm91bmNlIGZ1bmN0aW9uYWxpdHkuXHJcbi8vIFxyXG4vLyBUb3BpYzogTm90ZSBmb3Igbm9uLWpRdWVyeSB1c2Vyc1xyXG4vLyBcclxuLy8galF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgYmVjYXVzZSBub3RoaW5nIGludGVybmFsXHJcbi8vIHVzZXMgYW55IGpRdWVyeSBtZXRob2RzIG9yIHByb3BlcnRpZXMuIGpRdWVyeSBpcyBqdXN0IHVzZWQgYXMgYSBuYW1lc3BhY2VcclxuLy8gdW5kZXIgd2hpY2ggdGhlc2UgbWV0aG9kcyBjYW4gZXhpc3QuXHJcbi8vIFxyXG4vLyBTaW5jZSBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBpZiBqUXVlcnkgZG9lc24ndCBleGlzdFxyXG4vLyB3aGVuIHRoaXMgcGx1Z2luIGlzIGxvYWRlZCwgdGhlIG1ldGhvZCBkZXNjcmliZWQgYmVsb3cgd2lsbCBiZSBjcmVhdGVkIGluXHJcbi8vIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UuIFVzYWdlIHdpbGwgYmUgZXhhY3RseSB0aGUgc2FtZSwgYnV0IGluc3RlYWQgb2ZcclxuLy8gJC5tZXRob2QoKSBvciBqUXVlcnkubWV0aG9kKCksIHlvdSdsbCBuZWVkIHRvIHVzZSBDb3dib3kubWV0aG9kKCkuXHJcblxyXG4oZnVuY3Rpb24od2luZG93LHVuZGVmaW5lZCl7XHJcbiAgJyQ6bm9tdW5nZSc7IC8vIFVzZWQgYnkgWVVJIGNvbXByZXNzb3IuXHJcbiAgXHJcbiAgLy8gU2luY2UgalF1ZXJ5IHJlYWxseSBpc24ndCByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIHVzZSBgalF1ZXJ5YCBhcyB0aGVcclxuICAvLyBuYW1lc3BhY2Ugb25seSBpZiBpdCBhbHJlYWR5IGV4aXN0cywgb3RoZXJ3aXNlIHVzZSB0aGUgYENvd2JveWAgbmFtZXNwYWNlLFxyXG4gIC8vIGNyZWF0aW5nIGl0IGlmIG5lY2Vzc2FyeS5cclxuICB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LkNvd2JveSB8fCAoIHdpbmRvdy5Db3dib3kgPSB7fSApLFxyXG4gICAgXHJcbiAgICAvLyBJbnRlcm5hbCBtZXRob2QgcmVmZXJlbmNlLlxyXG4gICAganFfdGhyb3R0bGU7XHJcbiAgXHJcbiAgLy8gTWV0aG9kOiBqUXVlcnkudGhyb3R0bGVcclxuICAvLyBcclxuICAvLyBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcclxuICAvLyBleGVjdXRpb24gb2YgaGFuZGxlcnMgb24gZXZlbnRzIGxpa2UgcmVzaXplIGFuZCBzY3JvbGwuIElmIHlvdSB3YW50IHRvXHJcbiAgLy8gcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiB0byBhIHNpbmdsZSB0aW1lLCBzZWUgdGhlXHJcbiAgLy8gPGpRdWVyeS5kZWJvdW5jZT4gbWV0aG9kLlxyXG4gIC8vIFxyXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcclxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XHJcbiAgLy8gXHJcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcclxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XHJcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYICAgIFhcclxuICAvLyA+IFxyXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcclxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XHJcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYXHJcbiAgLy8gXHJcbiAgLy8gVXNhZ2U6XHJcbiAgLy8gXHJcbiAgLy8gPiB2YXIgdGhyb3R0bGVkID0galF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApO1xyXG4gIC8vID4gXHJcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xyXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xyXG4gIC8vIFxyXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcclxuICAvLyBcclxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApICk7XHJcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcclxuICAvLyBcclxuICAvLyBBcmd1bWVudHM6XHJcbiAgLy8gXHJcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcclxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cclxuICAvLyAgbm9fdHJhaWxpbmcgLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBub190cmFpbGluZyBpc1xyXG4gIC8vICAgIHRydWUsIGNhbGxiYWNrIHdpbGwgb25seSBleGVjdXRlIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIHdoaWxlIHRoZVxyXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQuIElmIG5vX3RyYWlsaW5nIGlzIGZhbHNlIG9yXHJcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25lIGZpbmFsIHRpbWUgYWZ0ZXIgdGhlIGxhc3RcclxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuXHJcbiAgLy8gICAgY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXHJcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cclxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cclxuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIHRocm90dGxlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cclxuICAvLyBcclxuICAvLyBSZXR1cm5zOlxyXG4gIC8vIFxyXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCB0aHJvdHRsZWQsIGZ1bmN0aW9uLlxyXG4gIFxyXG4gICQudGhyb3R0bGUgPSBqcV90aHJvdHRsZSA9IGZ1bmN0aW9uKCBkZWxheSwgbm9fdHJhaWxpbmcsIGNhbGxiYWNrLCBkZWJvdW5jZV9tb2RlICkge1xyXG4gICAgLy8gQWZ0ZXIgd3JhcHBlciBoYXMgc3RvcHBlZCBiZWluZyBjYWxsZWQsIHRoaXMgdGltZW91dCBlbnN1cmVzIHRoYXRcclxuICAgIC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxyXG4gICAgLy8gZGVib3VuY2UgbW9kZXMuXHJcbiAgICB2YXIgdGltZW91dF9pZCxcclxuICAgICAgXHJcbiAgICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGxhc3QgdGltZSBgY2FsbGJhY2tgIHdhcyBleGVjdXRlZC5cclxuICAgICAgbGFzdF9leGVjID0gMDtcclxuICAgIFxyXG4gICAgLy8gYG5vX3RyYWlsaW5nYCBkZWZhdWx0cyB0byBmYWxzeS5cclxuICAgIGlmICggdHlwZW9mIG5vX3RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XHJcbiAgICAgIGRlYm91bmNlX21vZGUgPSBjYWxsYmFjaztcclxuICAgICAgY2FsbGJhY2sgPSBub190cmFpbGluZztcclxuICAgICAgbm9fdHJhaWxpbmcgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFRoZSBgd3JhcHBlcmAgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgdGhyb3R0bGluZyAvIGRlYm91bmNpbmdcclxuICAgIC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXHJcbiAgICAvLyBpcyBleGVjdXRlZC5cclxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICBlbGFwc2VkID0gK25ldyBEYXRlKCkgLSBsYXN0X2V4ZWMsXHJcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgXHJcbiAgICAgIC8vIEV4ZWN1dGUgYGNhbGxiYWNrYCBhbmQgdXBkYXRlIHRoZSBgbGFzdF9leGVjYCB0aW1lc3RhbXAuXHJcbiAgICAgIGZ1bmN0aW9uIGV4ZWMoKSB7XHJcbiAgICAgICAgbGFzdF9leGVjID0gK25ldyBEYXRlKCk7XHJcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoIHRoYXQsIGFyZ3MgKTtcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXHJcbiAgICAgIC8vIHRvIGFsbG93IGZ1dHVyZSBgY2FsbGJhY2tgIGV4ZWN1dGlvbnMuXHJcbiAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgICAgIHRpbWVvdXRfaWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgJiYgIXRpbWVvdXRfaWQgKSB7XHJcbiAgICAgICAgLy8gU2luY2UgYHdyYXBwZXJgIGlzIGJlaW5nIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kXHJcbiAgICAgICAgLy8gYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgZXhlY3V0ZSBgY2FsbGJhY2tgLlxyXG4gICAgICAgIGV4ZWMoKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXHJcbiAgICAgIHRpbWVvdXRfaWQgJiYgY2xlYXJUaW1lb3V0KCB0aW1lb3V0X2lkICk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCAmJiBlbGFwc2VkID4gZGVsYXkgKSB7XHJcbiAgICAgICAgLy8gSW4gdGhyb3R0bGUgbW9kZSwgaWYgYGRlbGF5YCB0aW1lIGhhcyBiZWVuIGV4Y2VlZGVkLCBleGVjdXRlXHJcbiAgICAgICAgLy8gYGNhbGxiYWNrYC5cclxuICAgICAgICBleGVjKCk7XHJcbiAgICAgICAgXHJcbiAgICAgIH0gZWxzZSBpZiAoIG5vX3RyYWlsaW5nICE9PSB0cnVlICkge1xyXG4gICAgICAgIC8vIEluIHRyYWlsaW5nIHRocm90dGxlIG1vZGUsIHNpbmNlIGBkZWxheWAgdGltZSBoYXMgbm90IGJlZW5cclxuICAgICAgICAvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxyXG4gICAgICAgIC8vIHJlY2VudCBleGVjdXRpb24uXHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlXHJcbiAgICAgICAgLy8gYWZ0ZXIgYGRlbGF5YCBtcy5cclxuICAgICAgICAvLyBcclxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgZmFsc2UgKGF0IGVuZCksIHNjaGVkdWxlIGBjYWxsYmFja2AgdG9cclxuICAgICAgICAvLyBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXHJcbiAgICAgICAgdGltZW91dF9pZCA9IHNldFRpbWVvdXQoIGRlYm91bmNlX21vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCA/IGRlbGF5IC0gZWxhcHNlZCA6IGRlbGF5ICk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIFNldCB0aGUgZ3VpZCBvZiBgd3JhcHBlcmAgZnVuY3Rpb24gdG8gdGhlIHNhbWUgb2Ygb3JpZ2luYWwgY2FsbGJhY2ssIHNvXHJcbiAgICAvLyBpdCBjYW4gYmUgcmVtb3ZlZCBpbiBqUXVlcnkgMS40KyAudW5iaW5kIG9yIC5kaWUgYnkgdXNpbmcgdGhlIG9yaWdpbmFsXHJcbiAgICAvLyBjYWxsYmFjayBhcyBhIHJlZmVyZW5jZS5cclxuICAgIGlmICggJC5ndWlkICkge1xyXG4gICAgICB3cmFwcGVyLmd1aWQgPSBjYWxsYmFjay5ndWlkID0gY2FsbGJhY2suZ3VpZCB8fCAkLmd1aWQrKztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxyXG4gICAgcmV0dXJuIHdyYXBwZXI7XHJcbiAgfTtcclxuICBcclxuICAvLyBNZXRob2Q6IGpRdWVyeS5kZWJvdW5jZVxyXG4gIC8vIFxyXG4gIC8vIERlYm91bmNlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBEZWJvdW5jaW5nLCB1bmxpa2UgdGhyb3R0bGluZyxcclxuICAvLyBndWFyYW50ZWVzIHRoYXQgYSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGEgc2luZ2xlIHRpbWUsIGVpdGhlciBhdCB0aGVcclxuICAvLyB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLiBJZiB5b3Ugd2FudCB0b1xyXG4gIC8vIHNpbXBseSByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLCBzZWUgdGhlIDxqUXVlcnkudGhyb3R0bGU+XHJcbiAgLy8gbWV0aG9kLlxyXG4gIC8vIFxyXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcclxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XHJcbiAgLy8gXHJcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcclxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XHJcbiAgLy8gPiAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcclxuICAvLyA+IFxyXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcclxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XHJcbiAgLy8gPiBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxyXG4gIC8vIFxyXG4gIC8vIFVzYWdlOlxyXG4gIC8vIFxyXG4gIC8vID4gdmFyIGRlYm91bmNlZCA9IGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKTtcclxuICAvLyA+IFxyXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcclxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcclxuICAvLyBcclxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XHJcbiAgLy8gXHJcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKSApO1xyXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XHJcbiAgLy8gXHJcbiAgLy8gQXJndW1lbnRzOlxyXG4gIC8vIFxyXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XHJcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXHJcbiAgLy8gIGF0X2JlZ2luIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYXRfYmVnaW4gaXMgZmFsc2Ugb3JcclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGBkZWxheWAgbWlsbGlzZWNvbmRzIGFmdGVyXHJcbiAgLy8gICAgdGhlIGxhc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIElmIGF0X2JlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmVcclxuICAvLyAgICBleGVjdXRlZCBvbmx5IGF0IHRoZSBmaXJzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZVxyXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlXHJcbiAgLy8gICAgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcclxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxyXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xyXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgZGVib3VuY2VkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxyXG4gIC8vIFxyXG4gIC8vIFJldHVybnM6XHJcbiAgLy8gXHJcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIGRlYm91bmNlZCwgZnVuY3Rpb24uXHJcbiAgXHJcbiAgJC5kZWJvdW5jZSA9IGZ1bmN0aW9uKCBkZWxheSwgYXRfYmVnaW4sIGNhbGxiYWNrICkge1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrID09PSB1bmRlZmluZWRcclxuICAgICAgPyBqcV90aHJvdHRsZSggZGVsYXksIGF0X2JlZ2luLCBmYWxzZSApXHJcbiAgICAgIDoganFfdGhyb3R0bGUoIGRlbGF5LCBjYWxsYmFjaywgYXRfYmVnaW4gIT09IGZhbHNlICk7XHJcbiAgfTtcclxuICBcclxufSkodGhpcyk7XHJcbiIsIi8qKlxyXG4gKiBGZWF0aGVybGlnaHQgLSB1bHRyYSBzbGltIGpRdWVyeSBsaWdodGJveFxyXG4gKiBWZXJzaW9uIDEuMy40IC0gaHR0cDovL25vZWxib3NzLmdpdGh1Yi5pby9mZWF0aGVybGlnaHQvXHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE1LCBOb8OrbCBSYW91bCBCb3NzYXJ0IChodHRwOi8vd3d3Lm5vZWxib3NzLmNvbSlcclxuICogTUlUIExpY2Vuc2VkLlxyXG4qKi9cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0aWYoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiAkKSB7XHJcblx0XHRpZignY29uc29sZScgaW4gd2luZG93KXsgd2luZG93LmNvbnNvbGUuaW5mbygnVG9vIG11Y2ggbGlnaHRuZXNzLCBGZWF0aGVybGlnaHQgbmVlZHMgalF1ZXJ5LicpOyB9XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvKiBGZWF0aGVybGlnaHQgaXMgZXhwb3J0ZWQgYXMgJC5mZWF0aGVybGlnaHQuXHJcblx0ICAgSXQgaXMgYSBmdW5jdGlvbiB1c2VkIHRvIG9wZW4gYSBmZWF0aGVybGlnaHQgbGlnaHRib3guXHJcblxyXG5cdCAgIFt0ZWNoXVxyXG5cdCAgIEZlYXRoZXJsaWdodCB1c2VzIHByb3RvdHlwZSBpbmhlcml0YW5jZS5cclxuXHQgICBFYWNoIG9wZW5lZCBsaWdodGJveCB3aWxsIGhhdmUgYSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuXHQgICBUaGF0IG9iamVjdCBtYXkgaGF2ZSBzb21lIGF0dHJpYnV0ZXMgdGhhdCBvdmVycmlkZSB0aGVcclxuXHQgICBwcm90b3R5cGUncy5cclxuXHQgICBFeHRlbnNpb25zIGNyZWF0ZWQgd2l0aCBGZWF0aGVybGlnaHQuZXh0ZW5kIHdpbGwgaGF2ZSB0aGVpclxyXG5cdCAgIG93biBwcm90b3R5cGUgdGhhdCBpbmhlcml0cyBmcm9tIEZlYXRoZXJsaWdodCdzIHByb3RvdHlwZSxcclxuXHQgICB0aHVzIGF0dHJpYnV0ZXMgY2FuIGJlIG92ZXJyaWRlbiBlaXRoZXIgYXQgdGhlIG9iamVjdCBsZXZlbCxcclxuXHQgICBvciBhdCB0aGUgZXh0ZW5zaW9uIGxldmVsLlxyXG5cdCAgIFRvIGNyZWF0ZSBjYWxsYmFja3MgdGhhdCBjaGFpbiB0aGVtc2VsdmVzIGluc3RlYWQgb2Ygb3ZlcnJpZGluZyxcclxuXHQgICB1c2UgY2hhaW5DYWxsYmFja3MuXHJcblx0ICAgRm9yIHRob3NlIGZhbWlsaWFyIHdpdGggQ29mZmVlU2NyaXB0LCB0aGlzIGNvcnJlc3BvbmQgdG9cclxuXHQgICBGZWF0aGVybGlnaHQgYmVpbmcgYSBjbGFzcyBhbmQgdGhlIEdhbGxlcnkgYmVpbmcgYSBjbGFzc1xyXG5cdCAgIGV4dGVuZGluZyBGZWF0aGVybGlnaHQuXHJcblx0ICAgVGhlIGNoYWluQ2FsbGJhY2tzIGlzIHVzZWQgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG9cclxuXHQgICBDb2ZmZWVTY3JpcHQncyBgc3VwZXJgLlxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIEZlYXRoZXJsaWdodCgkY29udGVudCwgY29uZmlnKSB7XHJcblx0XHRpZih0aGlzIGluc3RhbmNlb2YgRmVhdGhlcmxpZ2h0KSB7ICAvKiBjYWxsZWQgd2l0aCBuZXcgKi9cclxuXHRcdFx0dGhpcy5pZCA9IEZlYXRoZXJsaWdodC5pZCsrO1xyXG5cdFx0XHR0aGlzLnNldHVwKCRjb250ZW50LCBjb25maWcpO1xyXG5cdFx0XHR0aGlzLmNoYWluQ2FsbGJhY2tzKEZlYXRoZXJsaWdodC5fY2FsbGJhY2tDaGFpbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZmwgPSBuZXcgRmVhdGhlcmxpZ2h0KCRjb250ZW50LCBjb25maWcpO1xyXG5cdFx0XHRmbC5vcGVuKCk7XHJcblx0XHRcdHJldHVybiBmbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBvcGVuZWQgPSBbXSxcclxuXHRcdHBydW5lT3BlbmVkID0gZnVuY3Rpb24ocmVtb3ZlKSB7XHJcblx0XHRcdG9wZW5lZCA9ICQuZ3JlcChvcGVuZWQsIGZ1bmN0aW9uKGZsKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZsICE9PSByZW1vdmUgJiYgZmwuJGluc3RhbmNlLmNsb3Nlc3QoJ2JvZHknKS5sZW5ndGggPiAwO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdHJldHVybiBvcGVuZWQ7XHJcblx0XHR9O1xyXG5cclxuXHQvLyBzdHJ1Y3R1cmUoe2lmcmFtZU1pbkhlaWdodDogNDQsIGZvbzogMH0sICdpZnJhbWUnKVxyXG5cdC8vICAgIz0+IHttaW4taGVpZ2h0OiA0NH1cclxuXHR2YXIgc3RydWN0dXJlID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcclxuXHRcdHZhciByZXN1bHQgPSB7fSxcclxuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHByZWZpeCArICcoW0EtWl0pKC4qKScpO1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xyXG5cdFx0XHR2YXIgbWF0Y2ggPSBrZXkubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHR2YXIgZGFzaGVyaXplZCA9IChtYXRjaFsxXSArIG1hdGNoWzJdLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdHJlc3VsdFtkYXNoZXJpemVkXSA9IG9ialtrZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH07XHJcblxyXG5cdC8qIGRvY3VtZW50IHdpZGUga2V5IGhhbmRsZXIgKi9cclxuXHR2YXIgZXZlbnRNYXAgPSB7IGtleXVwOiAnb25LZXlVcCcsIHJlc2l6ZTogJ29uUmVzaXplJyB9O1xyXG5cclxuXHR2YXIgZ2xvYmFsRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdCQuZWFjaChGZWF0aGVybGlnaHQub3BlbmVkKCkucmV2ZXJzZSgpLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG5cdFx0XHRcdGlmIChmYWxzZSA9PT0gdGhpc1tldmVudE1hcFtldmVudC50eXBlXV0oZXZlbnQpKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0dmFyIHRvZ2dsZUdsb2JhbEV2ZW50cyA9IGZ1bmN0aW9uKHNldCkge1xyXG5cdFx0XHRpZihzZXQgIT09IEZlYXRoZXJsaWdodC5fZ2xvYmFsSGFuZGxlckluc3RhbGxlZCkge1xyXG5cdFx0XHRcdEZlYXRoZXJsaWdodC5fZ2xvYmFsSGFuZGxlckluc3RhbGxlZCA9IHNldDtcclxuXHRcdFx0XHR2YXIgZXZlbnRzID0gJC5tYXAoZXZlbnRNYXAsIGZ1bmN0aW9uKF8sIG5hbWUpIHsgcmV0dXJuIG5hbWUrJy4nK0ZlYXRoZXJsaWdodC5wcm90b3R5cGUubmFtZXNwYWNlOyB9ICkuam9pbignICcpO1xyXG5cdFx0XHRcdCQod2luZG93KVtzZXQgPyAnb24nIDogJ29mZiddKGV2ZW50cywgZ2xvYmFsRXZlbnRIYW5kbGVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0RmVhdGhlcmxpZ2h0LnByb3RvdHlwZSA9IHtcclxuXHRcdGNvbnN0cnVjdG9yOiBGZWF0aGVybGlnaHQsXHJcblx0XHQvKioqIGRlZmF1bHRzICoqKi9cclxuXHRcdC8qIGV4dGVuZCBmZWF0aGVybGlnaHQgd2l0aCBkZWZhdWx0cyBhbmQgbWV0aG9kcyAqL1xyXG5cdFx0bmFtZXNwYWNlOiAgICAnZmVhdGhlcmxpZ2h0JywgICAgICAgICAvKiBOYW1lIG9mIHRoZSBldmVudHMgYW5kIGNzcyBjbGFzcyBwcmVmaXggKi9cclxuXHRcdHRhcmdldEF0dHI6ICAgJ2RhdGEtZmVhdGhlcmxpZ2h0JywgICAgLyogQXR0cmlidXRlIG9mIHRoZSB0cmlnZ2VyZWQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBzZWxlY3RvciB0byB0aGUgbGlnaHRib3ggY29udGVudCAqL1xyXG5cdFx0dmFyaWFudDogICAgICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBDbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gY2hhbmdlIGxvb2sgb2YgdGhlIGxpZ2h0Ym94ICovXHJcblx0XHRyZXNldENzczogICAgIGZhbHNlLCAgICAgICAgICAgICAgICAgIC8qIFJlc2V0IGFsbCBjc3MgKi9cclxuXHRcdGJhY2tncm91bmQ6ICAgbnVsbCwgICAgICAgICAgICAgICAgICAgLyogQ3VzdG9tIERPTSBmb3IgdGhlIGJhY2tncm91bmQsIHdyYXBwZXIgYW5kIHRoZSBjbG9zZWJ1dHRvbiAqL1xyXG5cdFx0b3BlblRyaWdnZXI6ICAnY2xpY2snLCAgICAgICAgICAgICAgICAvKiBFdmVudCB0aGF0IHRyaWdnZXJzIHRoZSBsaWdodGJveCAqL1xyXG5cdFx0Y2xvc2VUcmlnZ2VyOiAnY2xpY2snLCAgICAgICAgICAgICAgICAvKiBFdmVudCB0aGF0IHRyaWdnZXJzIHRoZSBjbG9zaW5nIG9mIHRoZSBsaWdodGJveCAqL1xyXG5cdFx0ZmlsdGVyOiAgICAgICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBTZWxlY3RvciB0byBmaWx0ZXIgZXZlbnRzLiBUaGluayAkKC4uLikub24oJ2NsaWNrJywgZmlsdGVyLCBldmVudEhhbmRsZXIpICovXHJcblx0XHRyb290OiAgICAgICAgICdib2R5JywgICAgICAgICAgICAgICAgIC8qIFdoZXJlIHRvIGFwcGVuZCBmZWF0aGVybGlnaHRzICovXHJcblx0XHRvcGVuU3BlZWQ6ICAgIDI1MCwgICAgICAgICAgICAgICAgICAgIC8qIER1cmF0aW9uIG9mIG9wZW5pbmcgYW5pbWF0aW9uICovXHJcblx0XHRjbG9zZVNwZWVkOiAgIDI1MCwgICAgICAgICAgICAgICAgICAgIC8qIER1cmF0aW9uIG9mIGNsb3NpbmcgYW5pbWF0aW9uICovXHJcblx0XHRjbG9zZU9uQ2xpY2s6ICdiYWNrZ3JvdW5kJywgICAgICAgICAgIC8qIENsb3NlIGxpZ2h0Ym94IG9uIGNsaWNrICgnYmFja2dyb3VuZCcsICdhbnl3aGVyZScgb3IgZmFsc2UpICovXHJcblx0XHRjbG9zZU9uRXNjOiAgIHRydWUsICAgICAgICAgICAgICAgICAgIC8qIENsb3NlIGxpZ2h0Ym94IHdoZW4gcHJlc3NpbmcgZXNjICovXHJcblx0XHRjbG9zZUljb246ICAgICcmIzEwMDA1OycsICAgICAgICAgICAgIC8qIENsb3NlIGljb24gKi9cclxuXHRcdGxvYWRpbmc6ICAgICAgJycsICAgICAgICAgICAgICAgICAgICAgLyogQ29udGVudCB0byBzaG93IHdoaWxlIGluaXRpYWwgY29udGVudCBpcyBsb2FkaW5nICovXHJcblx0XHRwZXJzaXN0OiAgICAgIGZhbHNlLFx0XHRcdFx0XHRcdFx0XHRcdC8qIElmIHNldCwgdGhlIGNvbnRlbnQgcGVyc2lzdCBhbmQgd2lsbCBiZSBzaG93biBhZ2FpbiB3aGVuIG9wZW5lZCBhZ2Fpbi4gJ3NoYXJlZCcgaXMgYSBzcGVjaWFsIHZhbHVlIHdoZW4gYmluZGluZyBtdWx0aXBsZSBlbGVtZW50cyBmb3IgdGhlbSB0byBzaGFyZSB0aGUgc2FtZSBjb250ZW50ICovXHJcblx0XHRvdGhlckNsb3NlOiAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIFNlbGVjdG9yIGZvciBhbHRlcm5hdGUgY2xvc2UgYnV0dG9ucyAoZS5nLiBcImEuY2xvc2VcIikgKi9cclxuXHRcdGJlZm9yZU9wZW46ICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGJlZm9yZSBvcGVuLiBjYW4gcmV0dXJuIGZhbHNlIHRvIHByZXZlbnQgb3BlbmluZyBvZiBsaWdodGJveC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cclxuXHRcdGJlZm9yZUNvbnRlbnQ6ICQubm9vcCwgICAgICAgICAgICAgICAgLyogQ2FsbGVkIHdoZW4gY29udGVudCBpcyBsb2FkZWQuIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXHJcblx0XHRiZWZvcmVDbG9zZTogICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBiZWZvcmUgY2xvc2UuIGNhbiByZXR1cm4gZmFsc2UgdG8gcHJldmVudCBvcGVuaW5nIG9mIGxpZ2h0Ym94LiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xyXG5cdFx0YWZ0ZXJPcGVuOiAgICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYWZ0ZXIgb3Blbi4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cclxuXHRcdGFmdGVyQ29udGVudDogJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIGNvbnRlbnQgaXMgcmVhZHkgYW5kIGhhcyBiZWVuIHNldC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cclxuXHRcdGFmdGVyQ2xvc2U6ICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIGNsb3NlLiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xyXG5cdFx0b25LZXlVcDogICAgICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgb24ga2V5IGRvd24gZm9yIHRoZSBmcm9udG1vc3QgZmVhdGhlcmxpZ2h0ICovXHJcblx0XHRvblJlc2l6ZTogICAgICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBuZXcgY29udGVudCBhbmQgd2hlbiBhIHdpbmRvdyBpcyByZXNpemVkICovXHJcblx0XHR0eXBlOiAgICAgICAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIFNwZWNpZnkgdHlwZSBvZiBsaWdodGJveC4gSWYgdW5zZXQsIGl0IHdpbGwgY2hlY2sgZm9yIHRoZSB0YXJnZXRBdHRycyB2YWx1ZS4gKi9cclxuXHRcdGNvbnRlbnRGaWx0ZXJzOiBbJ2pxdWVyeScsICdpbWFnZScsICdodG1sJywgJ2FqYXgnLCAnaWZyYW1lJywgJ3RleHQnXSwgLyogTGlzdCBvZiBjb250ZW50IGZpbHRlcnMgdG8gdXNlIHRvIGRldGVybWluZSB0aGUgY29udGVudCAqL1xyXG5cclxuXHRcdC8qKiogbWV0aG9kcyAqKiovXHJcblx0XHQvKiBzZXR1cCBpdGVyYXRlcyBvdmVyIGEgc2luZ2xlIGluc3RhbmNlIG9mIGZlYXRoZXJsaWdodCBhbmQgcHJlcGFyZXMgdGhlIGJhY2tncm91bmQgYW5kIGJpbmRzIHRoZSBldmVudHMgKi9cclxuXHRcdHNldHVwOiBmdW5jdGlvbih0YXJnZXQsIGNvbmZpZyl7XHJcblx0XHRcdC8qIGFsbCBhcmd1bWVudHMgYXJlIG9wdGlvbmFsICovXHJcblx0XHRcdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgaW5zdGFuY2VvZiAkID09PSBmYWxzZSAmJiAhY29uZmlnKSB7XHJcblx0XHRcdFx0Y29uZmlnID0gdGFyZ2V0O1xyXG5cdFx0XHRcdHRhcmdldCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSAkLmV4dGVuZCh0aGlzLCBjb25maWcsIHt0YXJnZXQ6IHRhcmdldH0pLFxyXG5cdFx0XHRcdGNzcyA9ICFzZWxmLnJlc2V0Q3NzID8gc2VsZi5uYW1lc3BhY2UgOiBzZWxmLm5hbWVzcGFjZSsnLXJlc2V0JywgLyogYnkgYWRkaW5nIC1yZXNldCB0byB0aGUgY2xhc3NuYW1lLCB3ZSByZXNldCBhbGwgdGhlIGRlZmF1bHQgY3NzICovXHJcblx0XHRcdFx0JGJhY2tncm91bmQgPSAkKHNlbGYuYmFja2dyb3VuZCB8fCBbXHJcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicrY3NzKyctbG9hZGluZyAnK2NzcysnXCI+JyxcclxuXHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCInK2NzcysnLWNvbnRlbnRcIj4nLFxyXG5cdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicrY3NzKyctY2xvc2UtaWNvbiAnKyBzZWxmLm5hbWVzcGFjZSArICctY2xvc2VcIj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jbG9zZUljb24sXHJcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nLFxyXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiJytzZWxmLm5hbWVzcGFjZSsnLWlubmVyXCI+JyArIHNlbGYubG9hZGluZyArICc8L2Rpdj4nLFxyXG5cdFx0XHRcdFx0XHQnPC9kaXY+JyxcclxuXHRcdFx0XHRcdCc8L2Rpdj4nXS5qb2luKCcnKSksXHJcblx0XHRcdFx0Y2xvc2VCdXR0b25TZWxlY3RvciA9ICcuJytzZWxmLm5hbWVzcGFjZSsnLWNsb3NlJyArIChzZWxmLm90aGVyQ2xvc2UgPyAnLCcgKyBzZWxmLm90aGVyQ2xvc2UgOiAnJyk7XHJcblxyXG5cdFx0XHRzZWxmLiRpbnN0YW5jZSA9ICRiYWNrZ3JvdW5kLmNsb25lKCkuYWRkQ2xhc3Moc2VsZi52YXJpYW50KTsgLyogY2xvbmUgRE9NIGZvciB0aGUgYmFja2dyb3VuZCwgd3JhcHBlciBhbmQgdGhlIGNsb3NlIGJ1dHRvbiAqL1xyXG5cclxuXHRcdFx0LyogY2xvc2Ugd2hlbiBjbGljayBvbiBiYWNrZ3JvdW5kL2FueXdoZXJlL251bGwgb3IgY2xvc2Vib3ggKi9cclxuXHRcdFx0c2VsZi4kaW5zdGFuY2Uub24oc2VsZi5jbG9zZVRyaWdnZXIrJy4nK3NlbGYubmFtZXNwYWNlLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdHZhciAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xyXG5cdFx0XHRcdGlmKCAoJ2JhY2tncm91bmQnID09PSBzZWxmLmNsb3NlT25DbGljayAgJiYgJHRhcmdldC5pcygnLicrc2VsZi5uYW1lc3BhY2UpKVxyXG5cdFx0XHRcdFx0fHwgJ2FueXdoZXJlJyA9PT0gc2VsZi5jbG9zZU9uQ2xpY2tcclxuXHRcdFx0XHRcdHx8ICR0YXJnZXQuY2xvc2VzdChjbG9zZUJ1dHRvblNlbGVjdG9yKS5sZW5ndGggKXtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvKiB0aGlzIG1ldGhvZCBwcmVwYXJlcyB0aGUgY29udGVudCBhbmQgY29udmVydHMgaXQgaW50byBhIGpRdWVyeSBvYmplY3Qgb3IgYSBwcm9taXNlICovXHJcblx0XHRnZXRDb250ZW50OiBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZih0aGlzLnBlcnNpc3QgIT09IGZhbHNlICYmIHRoaXMuJGNvbnRlbnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy4kY29udGVudDtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0ZmlsdGVycyA9IHRoaXMuY29uc3RydWN0b3IuY29udGVudEZpbHRlcnMsXHJcblx0XHRcdFx0cmVhZFRhcmdldEF0dHIgPSBmdW5jdGlvbihuYW1lKXsgcmV0dXJuIHNlbGYuJGN1cnJlbnRUYXJnZXQgJiYgc2VsZi4kY3VycmVudFRhcmdldC5hdHRyKG5hbWUpOyB9LFxyXG5cdFx0XHRcdHRhcmdldFZhbHVlID0gcmVhZFRhcmdldEF0dHIoc2VsZi50YXJnZXRBdHRyKSxcclxuXHRcdFx0XHRkYXRhID0gc2VsZi50YXJnZXQgfHwgdGFyZ2V0VmFsdWUgfHwgJyc7XHJcblxyXG5cdFx0XHQvKiBGaW5kIHdoaWNoIGZpbHRlciBhcHBsaWVzICovXHJcblx0XHRcdHZhciBmaWx0ZXIgPSBmaWx0ZXJzW3NlbGYudHlwZV07IC8qIGNoZWNrIGV4cGxpY2l0IHR5cGUgbGlrZSB7dHlwZTogJ2ltYWdlJ30gKi9cclxuXHJcblx0XHRcdC8qIGNoZWNrIGV4cGxpY2l0IHR5cGUgbGlrZSBkYXRhLWZlYXRoZXJsaWdodD1cImltYWdlXCIgKi9cclxuXHRcdFx0aWYoIWZpbHRlciAmJiBkYXRhIGluIGZpbHRlcnMpIHtcclxuXHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW2RhdGFdO1xyXG5cdFx0XHRcdGRhdGEgPSBzZWxmLnRhcmdldCAmJiB0YXJnZXRWYWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhID0gZGF0YSB8fCByZWFkVGFyZ2V0QXR0cignaHJlZicpIHx8ICcnO1xyXG5cclxuXHRcdFx0LyogY2hlY2sgZXhwbGljaXR5IHR5cGUgJiBjb250ZW50IGxpa2Uge2ltYWdlOiAncGhvdG8uanBnJ30gKi9cclxuXHRcdFx0aWYoIWZpbHRlcikge1xyXG5cdFx0XHRcdGZvcih2YXIgZmlsdGVyTmFtZSBpbiBmaWx0ZXJzKSB7XHJcblx0XHRcdFx0XHRpZihzZWxmW2ZpbHRlck5hbWVdKSB7XHJcblx0XHRcdFx0XHRcdGZpbHRlciA9IGZpbHRlcnNbZmlsdGVyTmFtZV07XHJcblx0XHRcdFx0XHRcdGRhdGEgPSBzZWxmW2ZpbHRlck5hbWVdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Lyogb3RoZXJ3aXNlIGl0J3MgaW1wbGljaXQsIHJ1biBjaGVja3MgKi9cclxuXHRcdFx0aWYoIWZpbHRlcikge1xyXG5cdFx0XHRcdHZhciB0YXJnZXQgPSBkYXRhO1xyXG5cdFx0XHRcdGRhdGEgPSBudWxsO1xyXG5cdFx0XHRcdCQuZWFjaChzZWxmLmNvbnRlbnRGaWx0ZXJzLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGZpbHRlciA9IGZpbHRlcnNbdGhpc107XHJcblx0XHRcdFx0XHRpZihmaWx0ZXIudGVzdCkgIHtcclxuXHRcdFx0XHRcdFx0ZGF0YSA9IGZpbHRlci50ZXN0KHRhcmdldCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZighZGF0YSAmJiBmaWx0ZXIucmVnZXggJiYgdGFyZ2V0Lm1hdGNoICYmIHRhcmdldC5tYXRjaChmaWx0ZXIucmVnZXgpKSB7XHJcblx0XHRcdFx0XHRcdGRhdGEgPSB0YXJnZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gIWRhdGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aWYoIWRhdGEpIHtcclxuXHRcdFx0XHRcdGlmKCdjb25zb2xlJyBpbiB3aW5kb3cpeyB3aW5kb3cuY29uc29sZS5lcnJvcignRmVhdGhlcmxpZ2h0OiBubyBjb250ZW50IGZpbHRlciBmb3VuZCAnICsgKHRhcmdldCA/ICcgZm9yIFwiJyArIHRhcmdldCArICdcIicgOiAnIChubyB0YXJnZXQgc3BlY2lmaWVkKScpKTsgfVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvKiBQcm9jZXNzIGl0ICovXHJcblx0XHRcdHJldHVybiBmaWx0ZXIucHJvY2Vzcy5jYWxsKHNlbGYsIGRhdGEpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvKiBzZXRzIHRoZSBjb250ZW50IG9mICRpbnN0YW5jZSB0byAkY29udGVudCAqL1xyXG5cdFx0c2V0Q29udGVudDogZnVuY3Rpb24oJGNvbnRlbnQpe1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdC8qIHdlIG5lZWQgYSBzcGVjaWFsIGNsYXNzIGZvciB0aGUgaWZyYW1lICovXHJcblx0XHRcdGlmKCRjb250ZW50LmlzKCdpZnJhbWUnKSB8fCAkKCdpZnJhbWUnLCAkY29udGVudCkubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuYWRkQ2xhc3Moc2VsZi5uYW1lc3BhY2UrJy1pZnJhbWUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZi4kaW5zdGFuY2UucmVtb3ZlQ2xhc3Moc2VsZi5uYW1lc3BhY2UrJy1sb2FkaW5nJyk7XHJcblxyXG5cdFx0XHQvKiByZXBsYWNlIGNvbnRlbnQgYnkgYXBwZW5kaW5nIHRvIGV4aXN0aW5nIG9uZSBiZWZvcmUgaXQgaXMgcmVtb3ZlZFxyXG5cdFx0XHQgICB0aGlzIGluc3VyZXMgdGhhdCBmZWF0aGVybGlnaHQtaW5uZXIgcmVtYWluIGF0IHRoZSBzYW1lIHJlbGF0aXZlXHJcblx0XHRcdFx0IHBvc2l0aW9uIHRvIGFueSBvdGhlciBpdGVtcyBhZGRlZCB0byBmZWF0aGVybGlnaHQtY29udGVudCAqL1xyXG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5maW5kKCcuJytzZWxmLm5hbWVzcGFjZSsnLWlubmVyJylcclxuXHRcdFx0XHQubm90KCRjb250ZW50KSAgICAgICAgICAgICAgICAvKiBleGNsdWRlZCBuZXcgY29udGVudCwgaW1wb3J0YW50IGlmIHBlcnNpc3RlZCAqL1xyXG5cdFx0XHRcdC5zbGljZSgxKS5yZW1vdmUoKS5lbmQoKVx0XHRcdC8qIEluIHRoZSB1bmV4cGVjdGVkIGV2ZW50IHdoZXJlIHRoZXJlIGFyZSBtYW55IGlubmVyIGVsZW1lbnRzLCByZW1vdmUgYWxsIGJ1dCB0aGUgZmlyc3Qgb25lICovXHJcblx0XHRcdFx0LnJlcGxhY2VXaXRoKCQuY29udGFpbnMoc2VsZi4kaW5zdGFuY2VbMF0sICRjb250ZW50WzBdKSA/ICcnIDogJGNvbnRlbnQpO1xyXG5cclxuXHRcdFx0c2VsZi4kY29udGVudCA9ICRjb250ZW50LmFkZENsYXNzKHNlbGYubmFtZXNwYWNlKyctaW5uZXInKTtcclxuXHJcblx0XHRcdHJldHVybiBzZWxmO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvKiBvcGVucyB0aGUgbGlnaHRib3guIFwidGhpc1wiIGNvbnRhaW5zICRpbnN0YW5jZSB3aXRoIHRoZSBsaWdodGJveCwgYW5kIHdpdGggdGhlIGNvbmZpZy5cclxuXHRcdFx0UmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBhZnRlciBpcyBzdWNjZXNzZnVsbHkgb3BlbmVkLiAqL1xyXG5cdFx0b3BlbjogZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHNlbGYuJGluc3RhbmNlLmhpZGUoKS5hcHBlbmRUbyhzZWxmLnJvb3QpO1xyXG5cdFx0XHRpZigoIWV2ZW50IHx8ICFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSlcclxuXHRcdFx0XHQmJiBzZWxmLmJlZm9yZU9wZW4oZXZlbnQpICE9PSBmYWxzZSkge1xyXG5cclxuXHRcdFx0XHRpZihldmVudCl7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgJGNvbnRlbnQgPSBzZWxmLmdldENvbnRlbnQoKTtcclxuXHJcblx0XHRcdFx0aWYoJGNvbnRlbnQpIHtcclxuXHRcdFx0XHRcdG9wZW5lZC5wdXNoKHNlbGYpO1xyXG5cclxuXHRcdFx0XHRcdHRvZ2dsZUdsb2JhbEV2ZW50cyh0cnVlKTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLiRpbnN0YW5jZS5mYWRlSW4oc2VsZi5vcGVuU3BlZWQpO1xyXG5cdFx0XHRcdFx0c2VsZi5iZWZvcmVDb250ZW50KGV2ZW50KTtcclxuXHJcblx0XHRcdFx0XHQvKiBTZXQgY29udGVudCBhbmQgc2hvdyAqL1xyXG5cdFx0XHRcdFx0cmV0dXJuICQud2hlbigkY29udGVudClcclxuXHRcdFx0XHRcdFx0LmFsd2F5cyhmdW5jdGlvbigkY29udGVudCl7XHJcblx0XHRcdFx0XHRcdFx0c2VsZi5zZXRDb250ZW50KCRjb250ZW50KTtcclxuXHRcdFx0XHRcdFx0XHRzZWxmLmFmdGVyQ29udGVudChldmVudCk7XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdC50aGVuKHNlbGYuJGluc3RhbmNlLnByb21pc2UoKSlcclxuXHRcdFx0XHRcdFx0LyogQ2FsbCBhZnRlck9wZW4gYWZ0ZXIgZmFkZUluIGlzIGRvbmUgKi9cclxuXHRcdFx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oKXsgc2VsZi5hZnRlck9wZW4oZXZlbnQpOyB9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0c2VsZi4kaW5zdGFuY2UuZGV0YWNoKCk7XHJcblx0XHRcdHJldHVybiAkLkRlZmVycmVkKCkucmVqZWN0KCkucHJvbWlzZSgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvKiBjbG9zZXMgdGhlIGxpZ2h0Ym94LiBcInRoaXNcIiBjb250YWlucyAkaW5zdGFuY2Ugd2l0aCB0aGUgbGlnaHRib3gsIGFuZCB3aXRoIHRoZSBjb25maWdcclxuXHRcdFx0cmV0dXJucyBhIHByb21pc2UsIHJlc29sdmVkIGFmdGVyIHRoZSBsaWdodGJveCBpcyBzdWNjZXNzZnVsbHkgY2xvc2VkLiAqL1xyXG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xyXG5cclxuXHRcdFx0aWYoc2VsZi5iZWZvcmVDbG9zZShldmVudCkgPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGlmICgwID09PSBwcnVuZU9wZW5lZChzZWxmKS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdHRvZ2dsZUdsb2JhbEV2ZW50cyhmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRzZWxmLiRpbnN0YW5jZS5mYWRlT3V0KHNlbGYuY2xvc2VTcGVlZCxmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuZGV0YWNoKCk7XHJcblx0XHRcdFx0XHRzZWxmLmFmdGVyQ2xvc2UoZXZlbnQpO1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qIFV0aWxpdHkgZnVuY3Rpb24gdG8gY2hhaW4gY2FsbGJhY2tzXHJcblx0XHQgICBbV2FybmluZzogZ3VydS1sZXZlbF1cclxuXHRcdCAgIFVzZWQgYmUgZXh0ZW5zaW9ucyB0aGF0IHdhbnQgdG8gbGV0IHVzZXJzIHNwZWNpZnkgY2FsbGJhY2tzIGJ1dFxyXG5cdFx0ICAgYWxzbyBuZWVkIHRoZW1zZWx2ZXMgdG8gdXNlIHRoZSBjYWxsYmFja3MuXHJcblx0XHQgICBUaGUgYXJndW1lbnQgJ2NoYWluJyBoYXMgY2FsbGJhY2sgbmFtZXMgYXMga2V5cyBhbmQgZnVuY3Rpb24oc3VwZXIsIGV2ZW50KVxyXG5cdFx0ICAgYXMgdmFsdWVzLiBUaGF0IGZ1bmN0aW9uIGlzIG1lYW50IHRvIGNhbGwgYHN1cGVyYCBhdCBzb21lIHBvaW50LlxyXG5cdFx0Ki9cclxuXHRcdGNoYWluQ2FsbGJhY2tzOiBmdW5jdGlvbihjaGFpbikge1xyXG5cdFx0XHRmb3IgKHZhciBuYW1lIGluIGNoYWluKSB7XHJcblx0XHRcdFx0dGhpc1tuYW1lXSA9ICQucHJveHkoY2hhaW5bbmFtZV0sIHRoaXMsICQucHJveHkodGhpc1tuYW1lXSwgdGhpcykpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0JC5leHRlbmQoRmVhdGhlcmxpZ2h0LCB7XHJcblx0XHRpZDogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBVc2VkIHRvIGlkIHNpbmdsZSBmZWF0aGVybGlnaHQgaW5zdGFuY2VzICovXHJcblx0XHRhdXRvQmluZDogICAgICAgJ1tkYXRhLWZlYXRoZXJsaWdodF0nLCAgICAvKiBXaWxsIGF1dG9tYXRpY2FsbHkgYmluZCBlbGVtZW50cyBtYXRjaGluZyB0aGlzIHNlbGVjdG9yLiBDbGVhciBvciBzZXQgYmVmb3JlIG9uUmVhZHkgKi9cclxuXHRcdGRlZmF1bHRzOiAgICAgICBGZWF0aGVybGlnaHQucHJvdG90eXBlLCAgIC8qIFlvdSBjYW4gYWNjZXNzIGFuZCBvdmVycmlkZSBhbGwgZGVmYXVsdHMgdXNpbmcgJC5mZWF0aGVybGlnaHQuZGVmYXVsdHMsIHdoaWNoIGlzIGp1c3QgYSBzeW5vbnltIGZvciAkLmZlYXRoZXJsaWdodC5wcm90b3R5cGUgKi9cclxuXHRcdC8qIENvbnRhaW5zIHRoZSBsb2dpYyB0byBkZXRlcm1pbmUgY29udGVudCAqL1xyXG5cdFx0Y29udGVudEZpbHRlcnM6IHtcclxuXHRcdFx0anF1ZXJ5OiB7XHJcblx0XHRcdFx0cmVnZXg6IC9eWyMuXVxcdy8sICAgICAgICAgLyogQW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCBhIGNsYXNzIG5hbWUgb3IgaWRlbnRpZmllcnMgKi9cclxuXHRcdFx0XHR0ZXN0OiBmdW5jdGlvbihlbGVtKSAgICB7IHJldHVybiBlbGVtIGluc3RhbmNlb2YgJCAmJiBlbGVtOyB9LFxyXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKGVsZW0pIHsgcmV0dXJuIHRoaXMucGVyc2lzdCAhPT0gZmFsc2UgPyAkKGVsZW0pIDogJChlbGVtKS5jbG9uZSh0cnVlKTsgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHJlZ2V4OiAvXFwuKHBuZ3xqcGd8anBlZ3xnaWZ8dGlmZnxibXB8c3ZnKShcXD9cXFMqKT8kL2ksXHJcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odXJsKSAge1xyXG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdFx0XHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKSxcclxuXHRcdFx0XHRcdFx0aW1nID0gbmV3IEltYWdlKCksXHJcblx0XHRcdFx0XHRcdCRpbWcgPSAkKCc8aW1nIHNyYz1cIicrdXJsKydcIiBhbHQ9XCJcIiBjbGFzcz1cIicrc2VsZi5uYW1lc3BhY2UrJy1pbWFnZVwiIC8+Jyk7XHJcblx0XHRcdFx0XHRpbWcub25sb2FkICA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQvKiBTdG9yZSBuYXR1cmFsV2lkdGggJiBoZWlnaHQgZm9yIElFOCAqL1xyXG5cdFx0XHRcdFx0XHQkaW1nLm5hdHVyYWxXaWR0aCA9IGltZy53aWR0aDsgJGltZy5uYXR1cmFsSGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSggJGltZyApO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7IGRlZmVycmVkLnJlamVjdCgkaW1nKTsgfTtcclxuXHRcdFx0XHRcdGltZy5zcmMgPSB1cmw7XHJcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0aHRtbDoge1xyXG5cdFx0XHRcdHJlZ2V4OiAvXlxccyo8W1xcdyFdW148XSo+LywgLyogQW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCBzb21lIGtpbmQgb2YgdmFsaWQgdGFnICovXHJcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24oaHRtbCkgeyByZXR1cm4gJChodG1sKTsgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cmVnZXg6IC8uLywgICAgICAgICAgICAvKiBBdCB0aGlzIHBvaW50LCBhbnkgY29udGVudCBpcyBhc3N1bWVkIHRvIGJlIGFuIFVSTCAqL1xyXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkgIHtcclxuXHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XHJcblx0XHRcdFx0XHQvKiB3ZSBhcmUgdXNpbmcgbG9hZCBzbyBvbmUgY2FuIHNwZWNpZnkgYSB0YXJnZXQgd2l0aDogdXJsLmh0bWwgI3RhcmdldGVsZW1lbnQgKi9cclxuXHRcdFx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnPGRpdj48L2Rpdj4nKS5sb2FkKHVybCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cyl7XHJcblx0XHRcdFx0XHRcdGlmICggc3RhdHVzICE9PSBcImVycm9yXCIgKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgkY29udGFpbmVyLmNvbnRlbnRzKCkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRlZmVycmVkLmZhaWwoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGlmcmFtZToge1xyXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkge1xyXG5cdFx0XHRcdFx0dmFyIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcclxuXHRcdFx0XHRcdHZhciAkY29udGVudCA9ICQoJzxpZnJhbWUvPicpXHJcblx0XHRcdFx0XHRcdC5oaWRlKClcclxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NyYycsIHVybClcclxuXHRcdFx0XHRcdFx0LmNzcyhzdHJ1Y3R1cmUodGhpcywgJ2lmcmFtZScpKVxyXG5cdFx0XHRcdFx0XHQub24oJ2xvYWQnLCBmdW5jdGlvbigpIHsgZGVmZXJyZWQucmVzb2x2ZSgkY29udGVudC5zaG93KCkpOyB9KVxyXG5cdFx0XHRcdFx0XHQvLyBXZSBjYW4ndCBtb3ZlIGFuIDxpZnJhbWU+IGFuZCBhdm9pZCByZWxvYWRpbmcgaXQsXHJcblx0XHRcdFx0XHRcdC8vIHNvIGxldCdzIHB1dCBpdCBpbiBwbGFjZSBvdXJzZWx2ZXMgcmlnaHQgbm93OlxyXG5cdFx0XHRcdFx0XHQuYXBwZW5kVG8odGhpcy4kaW5zdGFuY2UuZmluZCgnLicgKyB0aGlzLm5hbWVzcGFjZSArICctY29udGVudCcpKTtcclxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZXh0OiB7XHJcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odGV4dCkgeyByZXR1cm4gJCgnPGRpdj4nLCB7dGV4dDogdGV4dH0pOyB9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0ZnVuY3Rpb25BdHRyaWJ1dGVzOiBbJ2JlZm9yZU9wZW4nLCAnYWZ0ZXJPcGVuJywgJ2JlZm9yZUNvbnRlbnQnLCAnYWZ0ZXJDb250ZW50JywgJ2JlZm9yZUNsb3NlJywgJ2FmdGVyQ2xvc2UnXSxcclxuXHJcblx0XHQvKioqIGNsYXNzIG1ldGhvZHMgKioqL1xyXG5cdFx0LyogcmVhZCBlbGVtZW50J3MgYXR0cmlidXRlcyBzdGFydGluZyB3aXRoIGRhdGEtZmVhdGhlcmxpZ2h0LSAqL1xyXG5cdFx0cmVhZEVsZW1lbnRDb25maWc6IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWVzcGFjZSkge1xyXG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzLFxyXG5cdFx0XHRcdHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ15kYXRhLScgKyBuYW1lc3BhY2UgKyAnLSguKiknKSxcclxuXHRcdFx0XHRjb25maWcgPSB7fTtcclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5hdHRyaWJ1dGVzKSB7XHJcblx0XHRcdFx0JC5lYWNoKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhciBtYXRjaCA9IHRoaXMubmFtZS5tYXRjaChyZWdleHApO1xyXG5cdFx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRcdHZhciB2YWwgPSB0aGlzLnZhbHVlLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWUgPSAkLmNhbWVsQ2FzZShtYXRjaFsxXSk7XHJcblx0XHRcdFx0XHRcdGlmICgkLmluQXJyYXkobmFtZSwgS2xhc3MuZnVuY3Rpb25BdHRyaWJ1dGVzKSA+PSAwKSB7ICAvKiBqc2hpbnQgLVcwNTQgKi9cclxuXHRcdFx0XHRcdFx0XHR2YWwgPSBuZXcgRnVuY3Rpb24odmFsKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBqc2hpbnQgK1cwNTQgKi9cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0cnkgeyB2YWwgPSAkLnBhcnNlSlNPTih2YWwpOyB9XHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2goZSkge31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjb25maWdbbmFtZV0gPSB2YWw7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNvbmZpZztcclxuXHRcdH0sXHJcblxyXG5cdFx0LyogVXNlZCB0byBjcmVhdGUgYSBGZWF0aGVybGlnaHQgZXh0ZW5zaW9uXHJcblx0XHQgICBbV2FybmluZzogZ3VydS1sZXZlbF1cclxuXHRcdCAgIENyZWF0ZXMgdGhlIGV4dGVuc2lvbidzIHByb3RvdHlwZSB0aGF0IGluIHR1cm5cclxuXHRcdCAgIGluaGVyaXRzIEZlYXRoZXJsaWdodCdzIHByb3RvdHlwZS5cclxuXHRcdCAgIENvdWxkIGJlIHVzZWQgdG8gZXh0ZW5kIGFuIGV4dGVuc2lvbiB0b28uLi5cclxuXHRcdCAgIFRoaXMgaXMgcHJldHR5IGhpZ2ggbGV2ZWwgd2l6YXJkeSwgaXQgY29tZXMgcHJldHR5IG11Y2ggc3RyYWlnaHRcclxuXHRcdCAgIGZyb20gQ29mZmVlU2NyaXB0IGFuZCB3b24ndCB0ZWFjaCB5b3UgYW55dGhpbmcgYWJvdXQgRmVhdGhlcmxpZ2h0XHJcblx0XHQgICBhcyBpdCdzIG5vdCByZWFsbHkgc3BlY2lmaWMgdG8gdGhpcyBsaWJyYXJ5LlxyXG5cdFx0ICAgTXkgc3VnZ2VzdGlvbjogbW92ZSBhbG9uZyBhbmQga2VlcCB5b3VyIHNhbml0eS5cclxuXHRcdCovXHJcblx0XHRleHRlbmQ6IGZ1bmN0aW9uKGNoaWxkLCBkZWZhdWx0cykge1xyXG5cdFx0XHQvKiBTZXR1cCBjbGFzcyBoaWVyYXJjaHksIGFkYXB0ZWQgZnJvbSBDb2ZmZWVTY3JpcHQgKi9cclxuXHRcdFx0dmFyIEN0b3IgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XHJcblx0XHRcdEN0b3IucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XHJcblx0XHRcdGNoaWxkLnByb3RvdHlwZSA9IG5ldyBDdG9yKCk7XHJcblx0XHRcdGNoaWxkLl9fc3VwZXJfXyA9IHRoaXMucHJvdG90eXBlO1xyXG5cdFx0XHQvKiBDb3B5IGNsYXNzIG1ldGhvZHMgJiBhdHRyaWJ1dGVzICovXHJcblx0XHRcdCQuZXh0ZW5kKGNoaWxkLCB0aGlzLCBkZWZhdWx0cyk7XHJcblx0XHRcdGNoaWxkLmRlZmF1bHRzID0gY2hpbGQucHJvdG90eXBlO1xyXG5cdFx0XHRyZXR1cm4gY2hpbGQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGF0dGFjaDogZnVuY3Rpb24oJHNvdXJjZSwgJGNvbnRlbnQsIGNvbmZpZykge1xyXG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzO1xyXG5cdFx0XHRpZiAodHlwZW9mICRjb250ZW50ID09PSAnb2JqZWN0JyAmJiAkY29udGVudCBpbnN0YW5jZW9mICQgPT09IGZhbHNlICYmICFjb25maWcpIHtcclxuXHRcdFx0XHRjb25maWcgPSAkY29udGVudDtcclxuXHRcdFx0XHQkY29udGVudCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvKiBtYWtlIGEgY29weSAqL1xyXG5cdFx0XHRjb25maWcgPSAkLmV4dGVuZCh7fSwgY29uZmlnKTtcclxuXHJcblx0XHRcdC8qIE9ubHkgZm9yIG9wZW5UcmlnZ2VyIGFuZCBuYW1lc3BhY2UuLi4gKi9cclxuXHRcdFx0dmFyIG5hbWVzcGFjZSA9IGNvbmZpZy5uYW1lc3BhY2UgfHwgS2xhc3MuZGVmYXVsdHMubmFtZXNwYWNlLFxyXG5cdFx0XHRcdHRlbXBDb25maWcgPSAkLmV4dGVuZCh7fSwgS2xhc3MuZGVmYXVsdHMsIEtsYXNzLnJlYWRFbGVtZW50Q29uZmlnKCRzb3VyY2VbMF0sIG5hbWVzcGFjZSksIGNvbmZpZyksXHJcblx0XHRcdFx0c2hhcmVkUGVyc2lzdDtcclxuXHJcblx0XHRcdCRzb3VyY2Uub24odGVtcENvbmZpZy5vcGVuVHJpZ2dlcisnLicrdGVtcENvbmZpZy5uYW1lc3BhY2UsIHRlbXBDb25maWcuZmlsdGVyLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdC8qIC4uLiBzaW5jZSB3ZSBtaWdodCBhcyB3ZWxsIGNvbXB1dGUgdGhlIGNvbmZpZyBvbiB0aGUgYWN0dWFsIHRhcmdldCAqL1xyXG5cdFx0XHRcdHZhciBlbGVtQ29uZmlnID0gJC5leHRlbmQoXHJcblx0XHRcdFx0XHR7JHNvdXJjZTogJHNvdXJjZSwgJGN1cnJlbnRUYXJnZXQ6ICQodGhpcyl9LFxyXG5cdFx0XHRcdFx0S2xhc3MucmVhZEVsZW1lbnRDb25maWcoJHNvdXJjZVswXSwgdGVtcENvbmZpZy5uYW1lc3BhY2UpLFxyXG5cdFx0XHRcdFx0S2xhc3MucmVhZEVsZW1lbnRDb25maWcodGhpcywgdGVtcENvbmZpZy5uYW1lc3BhY2UpLFxyXG5cdFx0XHRcdFx0Y29uZmlnKTtcclxuXHRcdFx0XHR2YXIgZmwgPSBzaGFyZWRQZXJzaXN0IHx8ICQodGhpcykuZGF0YSgnZmVhdGhlcmxpZ2h0LXBlcnNpc3RlZCcpIHx8IG5ldyBLbGFzcygkY29udGVudCwgZWxlbUNvbmZpZyk7XHJcblx0XHRcdFx0aWYoZmwucGVyc2lzdCA9PT0gJ3NoYXJlZCcpIHtcclxuXHRcdFx0XHRcdHNoYXJlZFBlcnNpc3QgPSBmbDtcclxuXHRcdFx0XHR9IGVsc2UgaWYoZmwucGVyc2lzdCAhPT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnZmVhdGhlcmxpZ2h0LXBlcnNpc3RlZCcsIGZsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxlbUNvbmZpZy4kY3VycmVudFRhcmdldC5ibHVyKCk7IC8vIE90aGVyd2lzZSAnZW50ZXInIGtleSBtaWdodCB0cmlnZ2VyIHRoZSBkaWFsb2cgYWdhaW5cclxuXHRcdFx0XHRmbC5vcGVuKGV2ZW50KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiAkc291cmNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRjdXJyZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGFsbCA9IHRoaXMub3BlbmVkKCk7XHJcblx0XHRcdHJldHVybiBhbGxbYWxsLmxlbmd0aCAtIDFdIHx8IG51bGw7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wZW5lZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBrbGFzcyA9IHRoaXM7XHJcblx0XHRcdHBydW5lT3BlbmVkKCk7XHJcblx0XHRcdHJldHVybiAkLmdyZXAob3BlbmVkLCBmdW5jdGlvbihmbCkgeyByZXR1cm4gZmwgaW5zdGFuY2VvZiBrbGFzczsgfSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRjbG9zZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBjdXIgPSB0aGlzLmN1cnJlbnQoKTtcclxuXHRcdFx0aWYoY3VyKSB7IHJldHVybiBjdXIuY2xvc2UoKTsgfVxyXG5cdFx0fSxcclxuXHJcblx0XHQvKiBEb2VzIHRoZSBhdXRvIGJpbmRpbmcgb24gc3RhcnR1cC5cclxuXHRcdCAgIE1lYW50IG9ubHkgdG8gYmUgdXNlZCBieSBGZWF0aGVybGlnaHQgYW5kIGl0cyBleHRlbnNpb25zXHJcblx0XHQqL1xyXG5cdFx0X29uUmVhZHk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzO1xyXG5cdFx0XHRpZihLbGFzcy5hdXRvQmluZCl7XHJcblx0XHRcdFx0LyogQmluZCBleGlzdGluZyBlbGVtZW50cyAqL1xyXG5cdFx0XHRcdCQoS2xhc3MuYXV0b0JpbmQpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdEtsYXNzLmF0dGFjaCgkKHRoaXMpKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQvKiBJZiBhIGNsaWNrIHByb3BhZ2F0ZXMgdG8gdGhlIGRvY3VtZW50IGxldmVsLCB0aGVuIHdlIGhhdmUgYW4gaXRlbSB0aGF0IHdhcyBhZGRlZCBsYXRlciBvbiAqL1xyXG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIEtsYXNzLmF1dG9CaW5kLCBmdW5jdGlvbihldnQpIHtcclxuXHRcdFx0XHRcdGlmIChldnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHQvKiBCaW5kIGZlYXRoZXJsaWdodCAqL1xyXG5cdFx0XHRcdFx0S2xhc3MuYXR0YWNoKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcclxuXHRcdFx0XHRcdC8qIENsaWNrIGFnYWluOyB0aGlzIHRpbWUgb3VyIGJpbmRpbmcgd2lsbCBjYXRjaCBpdCAqL1xyXG5cdFx0XHRcdFx0JChldnQudGFyZ2V0KS5jbGljaygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qIEZlYXRoZXJsaWdodCB1c2VzIHRoZSBvbktleVVwIGNhbGxiYWNrIHRvIGludGVyY2VwdCB0aGUgZXNjYXBlIGtleS5cclxuXHRcdCAgIFByaXZhdGUgdG8gRmVhdGhlcmxpZ2h0LlxyXG5cdFx0Ki9cclxuXHRcdF9jYWxsYmFja0NoYWluOiB7XHJcblx0XHRcdG9uS2V5VXA6IGZ1bmN0aW9uKF9zdXBlciwgZXZlbnQpe1xyXG5cdFx0XHRcdGlmKDI3ID09PSBldmVudC5rZXlDb2RlKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5jbG9zZU9uRXNjKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuJGluc3RhbmNlLmZpbmQoJy4nK3RoaXMubmFtZXNwYWNlKyctY2xvc2U6Zmlyc3QnKS5jbGljaygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gX3N1cGVyKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRvblJlc2l6ZTogZnVuY3Rpb24oX3N1cGVyLCBldmVudCl7XHJcblx0XHRcdFx0aWYgKHRoaXMuJGNvbnRlbnQubmF0dXJhbFdpZHRoKSB7XHJcblx0XHRcdFx0XHR2YXIgdyA9IHRoaXMuJGNvbnRlbnQubmF0dXJhbFdpZHRoLCBoID0gdGhpcy4kY29udGVudC5uYXR1cmFsSGVpZ2h0O1xyXG5cdFx0XHRcdFx0LyogUmVzZXQgYXBwYXJlbnQgaW1hZ2Ugc2l6ZSBmaXJzdCBzbyBjb250YWluZXIgZ3Jvd3MgKi9cclxuXHRcdFx0XHRcdHRoaXMuJGNvbnRlbnQuY3NzKCd3aWR0aCcsICcnKS5jc3MoJ2hlaWdodCcsICcnKTtcclxuXHRcdFx0XHRcdC8qIENhbGN1bGF0ZSB0aGUgd29yc3QgcmF0aW8gc28gdGhhdCBkaW1lbnNpb25zIGZpdCAqL1xyXG5cdFx0XHRcdFx0dmFyIHJhdGlvID0gTWF0aC5tYXgoXHJcblx0XHRcdFx0XHRcdHcgIC8gcGFyc2VJbnQodGhpcy4kY29udGVudC5wYXJlbnQoKS5jc3MoJ3dpZHRoJyksMTApLFxyXG5cdFx0XHRcdFx0XHRoIC8gcGFyc2VJbnQodGhpcy4kY29udGVudC5wYXJlbnQoKS5jc3MoJ2hlaWdodCcpLDEwKSk7XHJcblx0XHRcdFx0XHQvKiBSZXNpemUgY29udGVudCAqL1xyXG5cdFx0XHRcdFx0aWYgKHJhdGlvID4gMSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLiRjb250ZW50LmNzcygnd2lkdGgnLCAnJyArIHcgLyByYXRpbyArICdweCcpLmNzcygnaGVpZ2h0JywgJycgKyBoIC8gcmF0aW8gKyAncHgnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIF9zdXBlcihldmVudCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRhZnRlckNvbnRlbnQ6IGZ1bmN0aW9uKF9zdXBlciwgZXZlbnQpe1xyXG5cdFx0XHRcdHZhciByID0gX3N1cGVyKGV2ZW50KTtcclxuXHRcdFx0XHR0aGlzLm9uUmVzaXplKGV2ZW50KTtcclxuXHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkLmZlYXRoZXJsaWdodCA9IEZlYXRoZXJsaWdodDtcclxuXHJcblx0LyogYmluZCBqUXVlcnkgZWxlbWVudHMgdG8gdHJpZ2dlciBmZWF0aGVybGlnaHQgKi9cclxuXHQkLmZuLmZlYXRoZXJsaWdodCA9IGZ1bmN0aW9uKCRjb250ZW50LCBjb25maWcpIHtcclxuXHRcdHJldHVybiBGZWF0aGVybGlnaHQuYXR0YWNoKHRoaXMsICRjb250ZW50LCBjb25maWcpO1xyXG5cdH07XHJcblxyXG5cdC8qIGJpbmQgZmVhdGhlcmxpZ2h0IG9uIHJlYWR5IGlmIGNvbmZpZyBhdXRvQmluZCBpcyBzZXQgKi9cclxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpeyBGZWF0aGVybGlnaHQuX29uUmVhZHkoKTsgfSk7XHJcbn0oalF1ZXJ5KSk7XHJcbiIsIi8qIVxyXG4gKiBob3ZlckludGVudCB2MS44LjEgLy8gMjAxNC4wOC4xMSAvLyBqUXVlcnkgdjEuOS4xK1xyXG4gKiBodHRwOi8vY2hlcm5lLm5ldC9icmlhbi9yZXNvdXJjZXMvanF1ZXJ5LmhvdmVySW50ZW50Lmh0bWxcclxuICpcclxuICogWW91IG1heSB1c2UgaG92ZXJJbnRlbnQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS4gQmFzaWNhbGx5IHRoYXRcclxuICogbWVhbnMgeW91IGFyZSBmcmVlIHRvIHVzZSBob3ZlckludGVudCBhcyBsb25nIGFzIHRoaXMgaGVhZGVyIGlzIGxlZnQgaW50YWN0LlxyXG4gKiBDb3B5cmlnaHQgMjAwNywgMjAxNCBCcmlhbiBDaGVybmVcclxuICovXHJcbiBcclxuLyogaG92ZXJJbnRlbnQgaXMgc2ltaWxhciB0byBqUXVlcnkncyBidWlsdC1pbiBcImhvdmVyXCIgbWV0aG9kIGV4Y2VwdCB0aGF0XHJcbiAqIGluc3RlYWQgb2YgZmlyaW5nIHRoZSBoYW5kbGVySW4gZnVuY3Rpb24gaW1tZWRpYXRlbHksIGhvdmVySW50ZW50IGNoZWNrc1xyXG4gKiB0byBzZWUgaWYgdGhlIHVzZXIncyBtb3VzZSBoYXMgc2xvd2VkIGRvd24gKGJlbmVhdGggdGhlIHNlbnNpdGl2aXR5XHJcbiAqIHRocmVzaG9sZCkgYmVmb3JlIGZpcmluZyB0aGUgZXZlbnQuIFRoZSBoYW5kbGVyT3V0IGZ1bmN0aW9uIGlzIG9ubHlcclxuICogY2FsbGVkIGFmdGVyIGEgbWF0Y2hpbmcgaGFuZGxlckluLlxyXG4gKlxyXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4ganVzdCBsaWtlIC5ob3ZlcigpXHJcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0IClcclxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQgKVxyXG4gKlxyXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4gd2l0aCBldmVudCBkZWxlZ2F0aW9uIVxyXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCwgc2VsZWN0b3IgKVxyXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCwgc2VsZWN0b3IgKVxyXG4gKlxyXG4gKiAvLyB1c2luZyBhIGJhc2ljIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAqIC5ob3ZlckludGVudCggY29uZmlnIClcclxuICpcclxuICogQHBhcmFtICBoYW5kbGVySW4gICBmdW5jdGlvbiBPUiBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gKiBAcGFyYW0gIGhhbmRsZXJPdXQgIGZ1bmN0aW9uIE9SIHNlbGVjdG9yIGZvciBkZWxlZ2F0aW9uIE9SIHVuZGVmaW5lZFxyXG4gKiBAcGFyYW0gIHNlbGVjdG9yICAgIHNlbGVjdG9yIE9SIHVuZGVmaW5lZFxyXG4gKiBAYXV0aG9yIEJyaWFuIENoZXJuZSA8YnJpYW4oYXQpY2hlcm5lKGRvdCluZXQ+XHJcbiAqL1xyXG4oZnVuY3Rpb24oJCkge1xyXG4gICAgJC5mbi5ob3ZlckludGVudCA9IGZ1bmN0aW9uKGhhbmRsZXJJbixoYW5kbGVyT3V0LHNlbGVjdG9yKSB7XHJcblxyXG4gICAgICAgIC8vIGRlZmF1bHQgY29uZmlndXJhdGlvbiB2YWx1ZXNcclxuICAgICAgICB2YXIgY2ZnID0ge1xyXG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwLFxyXG4gICAgICAgICAgICBzZW5zaXRpdml0eTogNixcclxuICAgICAgICAgICAgdGltZW91dDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICggdHlwZW9mIGhhbmRsZXJJbiA9PT0gXCJvYmplY3RcIiApIHtcclxuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCBoYW5kbGVySW4gKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQuaXNGdW5jdGlvbihoYW5kbGVyT3V0KSkge1xyXG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJPdXQsIHNlbGVjdG9yOiBzZWxlY3RvciB9ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVySW4sIHNlbGVjdG9yOiBoYW5kbGVyT3V0IH0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIHZhcmlhYmxlc1xyXG4gICAgICAgIC8vIGNYLCBjWSA9IGN1cnJlbnQgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgdXBkYXRlZCBieSBtb3VzZW1vdmUgZXZlbnRcclxuICAgICAgICAvLyBwWCwgcFkgPSBwcmV2aW91cyBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCBzZXQgYnkgbW91c2VvdmVyIGFuZCBwb2xsaW5nIGludGVydmFsXHJcbiAgICAgICAgdmFyIGNYLCBjWSwgcFgsIHBZO1xyXG5cclxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGdldHRpbmcgbW91c2UgcG9zaXRpb25cclxuICAgICAgICB2YXIgdHJhY2sgPSBmdW5jdGlvbihldikge1xyXG4gICAgICAgICAgICBjWCA9IGV2LnBhZ2VYO1xyXG4gICAgICAgICAgICBjWSA9IGV2LnBhZ2VZO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgY29tcGFyaW5nIGN1cnJlbnQgYW5kIHByZXZpb3VzIG1vdXNlIHBvc2l0aW9uXHJcbiAgICAgICAgdmFyIGNvbXBhcmUgPSBmdW5jdGlvbihldixvYikge1xyXG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xyXG4gICAgICAgICAgICAvLyBjb21wYXJlIG1vdXNlIHBvc2l0aW9ucyB0byBzZWUgaWYgdGhleSd2ZSBjcm9zc2VkIHRoZSB0aHJlc2hvbGRcclxuICAgICAgICAgICAgaWYgKCBNYXRoLnNxcnQoIChwWC1jWCkqKHBYLWNYKSArIChwWS1jWSkqKHBZLWNZKSApIDwgY2ZnLnNlbnNpdGl2aXR5ICkge1xyXG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGhvdmVySW50ZW50IHN0YXRlIHRvIHRydWUgKHNvIG1vdXNlT3V0IGNhbiBiZSBjYWxsZWQpXHJcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjZmcub3Zlci5hcHBseShvYixbZXZdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBwcmV2aW91cyBjb29yZGluYXRlcyBmb3IgbmV4dCB0aW1lXHJcbiAgICAgICAgICAgICAgICBwWCA9IGNYOyBwWSA9IGNZO1xyXG4gICAgICAgICAgICAgICAgLy8gdXNlIHNlbGYtY2FsbGluZyB0aW1lb3V0LCBndWFyYW50ZWVzIGludGVydmFscyBhcmUgc3BhY2VkIG91dCBwcm9wZXJseSAoYXZvaWRzIEphdmFTY3JpcHQgdGltZXIgYnVncylcclxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsIG9iKTt9ICwgY2ZnLmludGVydmFsICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGRlbGF5aW5nIHRoZSBtb3VzZU91dCBmdW5jdGlvblxyXG4gICAgICAgIHZhciBkZWxheSA9IGZ1bmN0aW9uKGV2LG9iKSB7XHJcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XHJcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIGNmZy5vdXQuYXBwbHkob2IsW2V2XSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBtb3VzZSAnaG92ZXJpbmcnXHJcbiAgICAgICAgdmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAvLyBjb3B5IG9iamVjdHMgdG8gYmUgcGFzc2VkIGludG8gdCAocmVxdWlyZWQgZm9yIGV2ZW50IG9iamVjdCB0byBiZSBwYXNzZWQgaW4gSUUpXHJcbiAgICAgICAgICAgIHZhciBldiA9ICQuZXh0ZW5kKHt9LGUpO1xyXG4gICAgICAgICAgICB2YXIgb2IgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gY2FuY2VsIGhvdmVySW50ZW50IHRpbWVyIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfdCkgeyBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBpZiBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiXHJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2VlbnRlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgXCJwcmV2aW91c1wiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gaW5pdGlhbCBlbnRyeSBwb2ludFxyXG4gICAgICAgICAgICAgICAgcFggPSBldi5wYWdlWDsgcFkgPSBldi5wYWdlWTtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBcImN1cnJlbnRcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIG1vdXNlbW92ZVxyXG4gICAgICAgICAgICAgICAgJChvYikub24oXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XHJcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBwb2xsaW5nIGludGVydmFsIChzZWxmLWNhbGxpbmcgdGltZW91dCkgdG8gY29tcGFyZSBtb3VzZSBjb29yZGluYXRlcyBvdmVyIHRpbWVcclxuICAgICAgICAgICAgICAgIGlmICghb2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LG9iKTt9ICwgY2ZnLmludGVydmFsICk7fVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZS50eXBlID09IFwibW91c2VsZWF2ZVwiXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmJpbmQgZXhwZW5zaXZlIG1vdXNlbW92ZSBldmVudFxyXG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgaG92ZXJJbnRlbnQgc3RhdGUgaXMgdHJ1ZSwgdGhlbiBjYWxsIHRoZSBtb3VzZU91dCBmdW5jdGlvbiBhZnRlciB0aGUgc3BlY2lmaWVkIGRlbGF5XHJcbiAgICAgICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtkZWxheShldixvYik7fSAsIGNmZy50aW1lb3V0ICk7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gbGlzdGVuIGZvciBtb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24oeydtb3VzZWVudGVyLmhvdmVySW50ZW50JzpoYW5kbGVIb3ZlciwnbW91c2VsZWF2ZS5ob3ZlckludGVudCc6aGFuZGxlSG92ZXJ9LCBjZmcuc2VsZWN0b3IpO1xyXG4gICAgfTtcclxufSkoalF1ZXJ5KTtcclxuIiwiLyohXHJcbiAqIGltYWdlc0xvYWRlZCBQQUNLQUdFRCB2My4xLjhcclxuICogSmF2YVNjcmlwdCBpcyBhbGwgbGlrZSBcIllvdSBpbWFnZXMgYXJlIGRvbmUgeWV0IG9yIHdoYXQ/XCJcclxuICogTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fWZ1bmN0aW9uIHQoZSx0KXtmb3IodmFyIG49ZS5sZW5ndGg7bi0tOylpZihlW25dLmxpc3RlbmVyPT09dClyZXR1cm4gbjtyZXR1cm4tMX1mdW5jdGlvbiBuKGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0aGlzW2VdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19dmFyIGk9ZS5wcm90b3R5cGUscj10aGlzLG89ci5FdmVudEVtaXR0ZXI7aS5nZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt0PXt9O2ZvcihuIGluIGkpaS5oYXNPd25Qcm9wZXJ0eShuKSYmZS50ZXN0KG4pJiYodFtuXT1pW25dKX1lbHNlIHQ9aVtlXXx8KGlbZV09W10pO3JldHVybiB0fSxpLmZsYXR0ZW5MaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbj1bXTtmb3IodD0wO2UubGVuZ3RoPnQ7dCs9MSluLnB1c2goZVt0XS5saXN0ZW5lcik7cmV0dXJuIG59LGkuZ2V0TGlzdGVuZXJzQXNPYmplY3Q9ZnVuY3Rpb24oZSl7dmFyIHQsbj10aGlzLmdldExpc3RlbmVycyhlKTtyZXR1cm4gbiBpbnN0YW5jZW9mIEFycmF5JiYodD17fSx0W2VdPW4pLHR8fG59LGkuYWRkTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSksbz1cIm9iamVjdFwiPT10eXBlb2Ygbjtmb3IoaSBpbiByKXIuaGFzT3duUHJvcGVydHkoaSkmJi0xPT09dChyW2ldLG4pJiZyW2ldLnB1c2gobz9uOntsaXN0ZW5lcjpuLG9uY2U6ITF9KTtyZXR1cm4gdGhpc30saS5vbj1uKFwiYWRkTGlzdGVuZXJcIiksaS5hZGRPbmNlTGlzdGVuZXI9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihlLHtsaXN0ZW5lcjp0LG9uY2U6ITB9KX0saS5vbmNlPW4oXCJhZGRPbmNlTGlzdGVuZXJcIiksaS5kZWZpbmVFdmVudD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5nZXRMaXN0ZW5lcnMoZSksdGhpc30saS5kZWZpbmVFdmVudHM9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PTA7ZS5sZW5ndGg+dDt0Kz0xKXRoaXMuZGVmaW5lRXZlbnQoZVt0XSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyLG89dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKTtmb3IociBpbiBvKW8uaGFzT3duUHJvcGVydHkocikmJihpPXQob1tyXSxuKSwtMSE9PWkmJm9bcl0uc3BsaWNlKGksMSkpO3JldHVybiB0aGlzfSxpLm9mZj1uKFwicmVtb3ZlTGlzdGVuZXJcIiksaS5hZGRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKCExLGUsdCl9LGkucmVtb3ZlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMCxlLHQpfSxpLm1hbmlwdWxhdGVMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0LG4pe3ZhciBpLHIsbz1lP3RoaXMucmVtb3ZlTGlzdGVuZXI6dGhpcy5hZGRMaXN0ZW5lcixzPWU/dGhpcy5yZW1vdmVMaXN0ZW5lcnM6dGhpcy5hZGRMaXN0ZW5lcnM7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHR8fHQgaW5zdGFuY2VvZiBSZWdFeHApZm9yKGk9bi5sZW5ndGg7aS0tOylvLmNhbGwodGhpcyx0LG5baV0pO2Vsc2UgZm9yKGkgaW4gdCl0Lmhhc093blByb3BlcnR5KGkpJiYocj10W2ldKSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHI/by5jYWxsKHRoaXMsaSxyKTpzLmNhbGwodGhpcyxpLHIpKTtyZXR1cm4gdGhpc30saS5yZW1vdmVFdmVudD1mdW5jdGlvbihlKXt2YXIgdCxuPXR5cGVvZiBlLGk9dGhpcy5fZ2V0RXZlbnRzKCk7aWYoXCJzdHJpbmdcIj09PW4pZGVsZXRlIGlbZV07ZWxzZSBpZihcIm9iamVjdFwiPT09bilmb3IodCBpbiBpKWkuaGFzT3duUHJvcGVydHkodCkmJmUudGVzdCh0KSYmZGVsZXRlIGlbdF07ZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzO3JldHVybiB0aGlzfSxpLnJlbW92ZUFsbExpc3RlbmVycz1uKFwicmVtb3ZlRXZlbnRcIiksaS5lbWl0RXZlbnQ9ZnVuY3Rpb24oZSx0KXt2YXIgbixpLHIsbyxzPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gcylpZihzLmhhc093blByb3BlcnR5KHIpKWZvcihpPXNbcl0ubGVuZ3RoO2ktLTspbj1zW3JdW2ldLG4ub25jZT09PSEwJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKGUsbi5saXN0ZW5lciksbz1uLmxpc3RlbmVyLmFwcGx5KHRoaXMsdHx8W10pLG89PT10aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpO3JldHVybiB0aGlzfSxpLnRyaWdnZXI9bihcImVtaXRFdmVudFwiKSxpLmVtaXQ9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiB0aGlzLmVtaXRFdmVudChlLHQpfSxpLnNldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlPWUsdGhpc30saS5fZ2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoXCJfb25jZVJldHVyblZhbHVlXCIpP3RoaXMuX29uY2VSZXR1cm5WYWx1ZTohMH0saS5fZ2V0RXZlbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz17fSl9LGUubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLkV2ZW50RW1pdHRlcj1vLGV9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gZX0pOlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWU6dGhpcy5FdmVudEVtaXR0ZXI9ZX0pLmNhbGwodGhpcyksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2YXIgbj1lLmV2ZW50O3JldHVybiBuLnRhcmdldD1uLnRhcmdldHx8bi5zcmNFbGVtZW50fHx0LG59dmFyIG49ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LGk9ZnVuY3Rpb24oKXt9O24uYWRkRXZlbnRMaXN0ZW5lcj9pPWZ1bmN0aW9uKGUsdCxuKXtlLmFkZEV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5hdHRhY2hFdmVudCYmKGk9ZnVuY3Rpb24oZSxuLGkpe2VbbitpXT1pLmhhbmRsZUV2ZW50P2Z1bmN0aW9uKCl7dmFyIG49dChlKTtpLmhhbmRsZUV2ZW50LmNhbGwoaSxuKX06ZnVuY3Rpb24oKXt2YXIgbj10KGUpO2kuY2FsbChlLG4pfSxlLmF0dGFjaEV2ZW50KFwib25cIituLGVbbitpXSl9KTt2YXIgcj1mdW5jdGlvbigpe307bi5yZW1vdmVFdmVudExpc3RlbmVyP3I9ZnVuY3Rpb24oZSx0LG4pe2UucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpuLmRldGFjaEV2ZW50JiYocj1mdW5jdGlvbihlLHQsbil7ZS5kZXRhY2hFdmVudChcIm9uXCIrdCxlW3Qrbl0pO3RyeXtkZWxldGUgZVt0K25dfWNhdGNoKGkpe2VbdCtuXT12b2lkIDB9fSk7dmFyIG89e2JpbmQ6aSx1bmJpbmQ6cn07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImV2ZW50aWUvZXZlbnRpZVwiLG8pOmUuZXZlbnRpZT1vfSh0aGlzKSxmdW5jdGlvbihlLHQpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFwiZXZlbnRpZS9ldmVudGllXCJdLGZ1bmN0aW9uKG4saSl7cmV0dXJuIHQoZSxuLGkpfSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9dChlLHJlcXVpcmUoXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiKSxyZXF1aXJlKFwiZXZlbnRpZVwiKSk6ZS5pbWFnZXNMb2FkZWQ9dChlLGUuRXZlbnRFbWl0dGVyLGUuZXZlbnRpZSl9KHdpbmRvdyxmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gaShlLHQpe2Zvcih2YXIgbiBpbiB0KWVbbl09dFtuXTtyZXR1cm4gZX1mdW5jdGlvbiByKGUpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PWQuY2FsbChlKX1mdW5jdGlvbiBvKGUpe3ZhciB0PVtdO2lmKHIoZSkpdD1lO2Vsc2UgaWYoXCJudW1iZXJcIj09dHlwZW9mIGUubGVuZ3RoKWZvcih2YXIgbj0wLGk9ZS5sZW5ndGg7aT5uO24rKyl0LnB1c2goZVtuXSk7ZWxzZSB0LnB1c2goZSk7cmV0dXJuIHR9ZnVuY3Rpb24gcyhlLHQsbil7aWYoISh0aGlzIGluc3RhbmNlb2YgcykpcmV0dXJuIG5ldyBzKGUsdCk7XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZSkpLHRoaXMuZWxlbWVudHM9byhlKSx0aGlzLm9wdGlvbnM9aSh7fSx0aGlzLm9wdGlvbnMpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/bj10OmkodGhpcy5vcHRpb25zLHQpLG4mJnRoaXMub24oXCJhbHdheXNcIixuKSx0aGlzLmdldEltYWdlcygpLGEmJih0aGlzLmpxRGVmZXJyZWQ9bmV3IGEuRGVmZXJyZWQpO3ZhciByPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3IuY2hlY2soKX0pfWZ1bmN0aW9uIGYoZSl7dGhpcy5pbWc9ZX1mdW5jdGlvbiBjKGUpe3RoaXMuc3JjPWUsdltlXT10aGlzfXZhciBhPWUualF1ZXJ5LHU9ZS5jb25zb2xlLGg9dSE9PXZvaWQgMCxkPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7cy5wcm90b3R5cGU9bmV3IHQscy5wcm90b3R5cGUub3B0aW9ucz17fSxzLnByb3RvdHlwZS5nZXRJbWFnZXM9ZnVuY3Rpb24oKXt0aGlzLmltYWdlcz1bXTtmb3IodmFyIGU9MCx0PXRoaXMuZWxlbWVudHMubGVuZ3RoO3Q+ZTtlKyspe3ZhciBuPXRoaXMuZWxlbWVudHNbZV07XCJJTUdcIj09PW4ubm9kZU5hbWUmJnRoaXMuYWRkSW1hZ2Uobik7dmFyIGk9bi5ub2RlVHlwZTtpZihpJiYoMT09PWl8fDk9PT1pfHwxMT09PWkpKWZvcih2YXIgcj1uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIiksbz0wLHM9ci5sZW5ndGg7cz5vO28rKyl7dmFyIGY9cltvXTt0aGlzLmFkZEltYWdlKGYpfX19LHMucHJvdG90eXBlLmFkZEltYWdlPWZ1bmN0aW9uKGUpe3ZhciB0PW5ldyBmKGUpO3RoaXMuaW1hZ2VzLnB1c2godCl9LHMucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHIpe3JldHVybiB0Lm9wdGlvbnMuZGVidWcmJmgmJnUubG9nKFwiY29uZmlybVwiLGUsciksdC5wcm9ncmVzcyhlKSxuKyssbj09PWkmJnQuY29tcGxldGUoKSwhMH12YXIgdD10aGlzLG49MCxpPXRoaXMuaW1hZ2VzLmxlbmd0aDtpZih0aGlzLmhhc0FueUJyb2tlbj0hMSwhaSlyZXR1cm4gdGhpcy5jb21wbGV0ZSgpLHZvaWQgMDtmb3IodmFyIHI9MDtpPnI7cisrKXt2YXIgbz10aGlzLmltYWdlc1tyXTtvLm9uKFwiY29uZmlybVwiLGUpLG8uY2hlY2soKX19LHMucHJvdG90eXBlLnByb2dyZXNzPWZ1bmN0aW9uKGUpe3RoaXMuaGFzQW55QnJva2VuPXRoaXMuaGFzQW55QnJva2VufHwhZS5pc0xvYWRlZDt2YXIgdD10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmVtaXQoXCJwcm9ncmVzc1wiLHQsZSksdC5qcURlZmVycmVkJiZ0LmpxRGVmZXJyZWQubm90aWZ5JiZ0LmpxRGVmZXJyZWQubm90aWZ5KHQsZSl9KX0scy5wcm90b3R5cGUuY29tcGxldGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmhhc0FueUJyb2tlbj9cImZhaWxcIjpcImRvbmVcIjt0aGlzLmlzQ29tcGxldGU9ITA7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aWYodC5lbWl0KGUsdCksdC5lbWl0KFwiYWx3YXlzXCIsdCksdC5qcURlZmVycmVkKXt2YXIgbj10Lmhhc0FueUJyb2tlbj9cInJlamVjdFwiOlwicmVzb2x2ZVwiO3QuanFEZWZlcnJlZFtuXSh0KX19KX0sYSYmKGEuZm4uaW1hZ2VzTG9hZGVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49bmV3IHModGhpcyxlLHQpO3JldHVybiBuLmpxRGVmZXJyZWQucHJvbWlzZShhKHRoaXMpKX0pLGYucHJvdG90eXBlPW5ldyB0LGYucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7dmFyIGU9dlt0aGlzLmltZy5zcmNdfHxuZXcgYyh0aGlzLmltZy5zcmMpO2lmKGUuaXNDb25maXJtZWQpcmV0dXJuIHRoaXMuY29uZmlybShlLmlzTG9hZGVkLFwiY2FjaGVkIHdhcyBjb25maXJtZWRcIiksdm9pZCAwO2lmKHRoaXMuaW1nLmNvbXBsZXRlJiZ2b2lkIDAhPT10aGlzLmltZy5uYXR1cmFsV2lkdGgpcmV0dXJuIHRoaXMuY29uZmlybSgwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoLFwibmF0dXJhbFdpZHRoXCIpLHZvaWQgMDt2YXIgdD10aGlzO2Uub24oXCJjb25maXJtXCIsZnVuY3Rpb24oZSxuKXtyZXR1cm4gdC5jb25maXJtKGUuaXNMb2FkZWQsbiksITB9KSxlLmNoZWNrKCl9LGYucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzTG9hZGVkPWUsdGhpcy5lbWl0KFwiY29uZmlybVwiLHRoaXMsdCl9O3ZhciB2PXt9O3JldHVybiBjLnByb3RvdHlwZT1uZXcgdCxjLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2lmKCF0aGlzLmlzQ2hlY2tlZCl7dmFyIGU9bmV3IEltYWdlO24uYmluZChlLFwibG9hZFwiLHRoaXMpLG4uYmluZChlLFwiZXJyb3JcIix0aGlzKSxlLnNyYz10aGlzLnNyYyx0aGlzLmlzQ2hlY2tlZD0hMH19LGMucHJvdG90eXBlLmhhbmRsZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciB0PVwib25cIitlLnR5cGU7dGhpc1t0XSYmdGhpc1t0XShlKX0sYy5wcm90b3R5cGUub25sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMCxcIm9ubG9hZFwiKSx0aGlzLnVuYmluZFByb3h5RXZlbnRzKGUpfSxjLnByb3RvdHlwZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMSxcIm9uZXJyb3JcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUuY29uZmlybT1mdW5jdGlvbihlLHQpe3RoaXMuaXNDb25maXJtZWQ9ITAsdGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfSxjLnByb3RvdHlwZS51bmJpbmRQcm94eUV2ZW50cz1mdW5jdGlvbihlKXtuLnVuYmluZChlLnRhcmdldCxcImxvYWRcIix0aGlzKSxuLnVuYmluZChlLnRhcmdldCxcImVycm9yXCIsdGhpcyl9LHN9KTsiLCIvKiFcclxuICogalF1ZXJ5IFBsYWNlaG9sZGVyIFBsdWdpbiB2Mi4xLjNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvanF1ZXJ5LXBsYWNlaG9sZGVyXHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDExLCAyMDE1IE1hdGhpYXMgQnluZW5zXHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gKi9cclxuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICAvLyBBTURcclxuICAgICAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAgICAgZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xyXG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5KTtcclxuICAgIH1cclxufShmdW5jdGlvbigkKSB7XHJcblxyXG4gICAgLy8gT3BlcmEgTWluaSB2NyBkb2Vzbid0IHN1cHBvcnQgcGxhY2Vob2xkZXIgYWx0aG91Z2ggaXRzIERPTSBzZWVtcyB0byBpbmRpY2F0ZSBzb1xyXG4gICAgdmFyIGlzT3BlcmFNaW5pID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdy5vcGVyYW1pbmkpID09PSAnW29iamVjdCBPcGVyYU1pbmldJztcclxuICAgIHZhciBpc0lucHV0U3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpICYmICFpc09wZXJhTWluaTtcclxuICAgIHZhciBpc1RleHRhcmVhU3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpICYmICFpc09wZXJhTWluaTtcclxuICAgIHZhciB2YWxIb29rcyA9ICQudmFsSG9va3M7XHJcbiAgICB2YXIgcHJvcEhvb2tzID0gJC5wcm9wSG9va3M7XHJcbiAgICB2YXIgaG9va3M7XHJcbiAgICB2YXIgcGxhY2Vob2xkZXI7XHJcbiAgICB2YXIgc2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgICBpZiAoaXNJbnB1dFN1cHBvcnRlZCAmJiBpc1RleHRhcmVhU3VwcG9ydGVkKSB7XHJcblxyXG4gICAgICAgIHBsYWNlaG9sZGVyID0gJC5mbi5wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwbGFjZWhvbGRlci5pbnB1dCA9IHRydWU7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dGFyZWEgPSB0cnVlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHBsYWNlaG9sZGVyID0gJC5mbi5wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkZWZhdWx0cyA9IHtjdXN0b21DbGFzczogJ3BsYWNlaG9sZGVyJ307XHJcbiAgICAgICAgICAgIHNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlcigoaXNJbnB1dFN1cHBvcnRlZCA/ICd0ZXh0YXJlYScgOiAnOmlucHV0JykgKyAnW3BsYWNlaG9sZGVyXScpXHJcbiAgICAgICAgICAgICAgICAubm90KCcuJytzZXR0aW5ncy5jdXN0b21DbGFzcylcclxuICAgICAgICAgICAgICAgIC5iaW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAnZm9jdXMucGxhY2Vob2xkZXInOiBjbGVhclBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICdibHVyLnBsYWNlaG9sZGVyJzogc2V0UGxhY2Vob2xkZXJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcsIHRydWUpXHJcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignYmx1ci5wbGFjZWhvbGRlcicpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHBsYWNlaG9sZGVyLmlucHV0ID0gaXNJbnB1dFN1cHBvcnRlZDtcclxuICAgICAgICBwbGFjZWhvbGRlci50ZXh0YXJlYSA9IGlzVGV4dGFyZWFTdXBwb3J0ZWQ7XHJcblxyXG4gICAgICAgIGhvb2tzID0ge1xyXG4gICAgICAgICAgICAnZ2V0JzogZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHBhc3N3b3JkSW5wdXQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkcGFzc3dvcmRJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcpICYmICRlbGVtZW50Lmhhc0NsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKSA/ICcnIDogZWxlbWVudC52YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3NldCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHZhciAkcmVwbGFjZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHBhc3N3b3JkSW5wdXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkcmVwbGFjZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJQbGFjZWhvbGRlci5jYWxsKCRyZXBsYWNlbWVudFswXSwgdHJ1ZSwgdmFsdWUpIHx8IChlbGVtZW50LnZhbHVlID0gdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnRbMF0udmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkcGFzc3dvcmRJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCwgdHJ1ZSwgdmFsdWUpIHx8ICgkcGFzc3dvcmRJbnB1dFswXS52YWx1ZSA9IHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXR0aW5nIHRoZSBwbGFjZWhvbGRlciBjYXVzZXMgcHJvYmxlbXMgaWYgdGhlIGVsZW1lbnQgY29udGludWVzIHRvIGhhdmUgZm9jdXMuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgIT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW4ndCB1c2UgYHRyaWdnZXJIYW5kbGVyYCBoZXJlIGJlY2F1c2Ugb2YgZHVtbXkgdGV4dC9wYXNzd29yZCBpbnB1dHMgOihcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGxhY2Vob2xkZXIuY2FsbChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQuaGFzQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyUGxhY2Vob2xkZXIuY2FsbChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGBzZXRgIGNhbiBub3QgcmV0dXJuIGB1bmRlZmluZWRgOyBzZWUgaHR0cDovL2pzYXBpLmluZm8vanF1ZXJ5LzEuNy4xL3ZhbCNMMjM2M1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFpc0lucHV0U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIHZhbEhvb2tzLmlucHV0ID0gaG9va3M7XHJcbiAgICAgICAgICAgIHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc1RleHRhcmVhU3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIHZhbEhvb2tzLnRleHRhcmVhID0gaG9va3M7XHJcbiAgICAgICAgICAgIHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gTG9vayBmb3IgZm9ybXNcclxuICAgICAgICAgICAgJChkb2N1bWVudCkuZGVsZWdhdGUoJ2Zvcm0nLCAnc3VibWl0LnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgc28gdGhleSBkb24ndCBnZXQgc3VibWl0dGVkXHJcbiAgICAgICAgICAgICAgICB2YXIgJGlucHV0cyA9ICQoJy4nK3NldHRpbmdzLmN1c3RvbUNsYXNzLCB0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyUGxhY2Vob2xkZXIuY2FsbCh0aGlzLCB0cnVlLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dHMuZWFjaChzZXRQbGFjZWhvbGRlcik7XHJcbiAgICAgICAgICAgICAgICB9LCAxMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBDbGVhciBwbGFjZWhvbGRlciB2YWx1ZXMgdXBvbiBwYWdlIHJlbG9hZFxyXG4gICAgICAgICQod2luZG93KS5iaW5kKCdiZWZvcmV1bmxvYWQucGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnLicrc2V0dGluZ3MuY3VzdG9tQ2xhc3MpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFyZ3MoZWxlbSkge1xyXG4gICAgICAgIC8vIFJldHVybiBhbiBvYmplY3Qgb2YgZWxlbWVudCBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdmFyIG5ld0F0dHJzID0ge307XHJcbiAgICAgICAgdmFyIHJpbmxpbmVqUXVlcnkgPSAvXmpRdWVyeVxcZCskLztcclxuXHJcbiAgICAgICAgJC5lYWNoKGVsZW0uYXR0cmlidXRlcywgZnVuY3Rpb24oaSwgYXR0cikge1xyXG4gICAgICAgICAgICBpZiAoYXR0ci5zcGVjaWZpZWQgJiYgIXJpbmxpbmVqUXVlcnkudGVzdChhdHRyLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBdHRyc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3QXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJQbGFjZWhvbGRlcihldmVudCwgdmFsdWUpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKGlucHV0KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoaW5wdXQudmFsdWUgPT09ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpICYmICRpbnB1dC5oYXNDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcykpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICRpbnB1dC5yZW1vdmVDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkaW5wdXQgPSAkaW5wdXQuaGlkZSgpLm5leHRBbGwoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXTpmaXJzdCcpLnNob3coKS5hdHRyKCdpZCcsICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBgY2xlYXJQbGFjZWhvbGRlcmAgd2FzIGNhbGxlZCBmcm9tIGAkLnZhbEhvb2tzLmlucHV0LnNldGBcclxuICAgICAgICAgICAgICAgIGlmIChldmVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dFswXS52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJGlucHV0LmZvY3VzKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQgPT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSAmJiBpbnB1dC5zZWxlY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRQbGFjZWhvbGRlcihldmVudCkge1xyXG4gICAgICAgIHZhciAkcmVwbGFjZW1lbnQ7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcclxuICAgICAgICB2YXIgJGlucHV0ID0gJChpbnB1dCk7XHJcbiAgICAgICAgdmFyIGlkID0gaW5wdXQuaWQ7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBwbGFjZWhvbGRlciBpcyBhY3RpdmF0ZWQsIHRyaWdnZXJpbmcgYmx1ciBldmVudCAoYCRpbnB1dC50cmlnZ2VyKCdibHVyJylgKSBzaG91bGQgZG8gbm90aGluZy5cclxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ2JsdXInKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJGlucHV0Lmhhc0NsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50ID0gJGlucHV0LnByZXZBbGwoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdOmZpcnN0Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHJlcGxhY2VtZW50Lmxlbmd0aCA+IDAgJiYgJHJlcGxhY2VtZW50LmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5wdXQudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudCA9ICRpbnB1dC5jbG9uZSgpLnByb3AoeyAndHlwZSc6ICd0ZXh0JyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50ID0gJCgnPGlucHV0PicpLmF0dHIoJC5leHRlbmQoYXJncyh0aGlzKSwgeyAndHlwZSc6ICd0ZXh0JyB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ25hbWUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItZW5hYmxlZCc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItcGFzc3dvcmQnOiAkaW5wdXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItaWQnOiBpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmluZCgnZm9jdXMucGxhY2Vob2xkZXInLCBjbGVhclBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZWhvbGRlci10ZXh0aW5wdXQnOiAkcmVwbGFjZW1lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItaWQnOiBpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmVmb3JlKCRyZXBsYWNlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICRpbnB1dCA9ICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmhpZGUoKS5wcmV2QWxsKCdpbnB1dFt0eXBlPVwidGV4dFwiXTpmaXJzdCcpLmF0dHIoJ2lkJywgJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dCA9ICRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkcGFzc3dvcmRJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LmF0dHIoJ2lkJywgJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpLnNob3coKS5uZXh0QWxsKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl06bGFzdCcpLmhpZGUoKS5yZW1vdmVBdHRyKCdpZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpO1xyXG4gICAgICAgICAgICAkaW5wdXRbMF0udmFsdWUgPSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGlucHV0LnJlbW92ZUNsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgLy8gQXZvaWQgSUU5IGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBvZiBkZWF0aFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cclxuICAgIH1cclxufSkpO1xyXG4iLCIvKiFcclxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMS4yXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gKi9cclxuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xyXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuXHRcdGRlZmluZShmYWN0b3J5KTtcclxuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XHJcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XHJcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xyXG5cdFx0XHRyZXR1cm4gYXBpO1xyXG5cdFx0fTtcclxuXHR9XHJcbn0oZnVuY3Rpb24gKCkge1xyXG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XHJcblx0XHR2YXIgaSA9IDA7XHJcblx0XHR2YXIgcmVzdWx0ID0ge307XHJcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xyXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xyXG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XHJcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0dmFyIHJlc3VsdDtcclxuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFdyaXRlXHJcblxyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcclxuXHRcdFx0XHRcdHBhdGg6ICcvJ1xyXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0dmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdFx0ZXhwaXJlcy5zZXRNaWxsaXNlY29uZHMoZXhwaXJlcy5nZXRNaWxsaXNlY29uZHMoKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHJcblx0XHRcdFx0aWYgKCFjb252ZXJ0ZXIud3JpdGUpIHtcclxuXHRcdFx0XHRcdHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSk7XHJcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XHJcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XHJcblxyXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0gW1xyXG5cdFx0XHRcdFx0a2V5LCAnPScsIHZhbHVlLFxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID8gJzsgZXhwaXJlcz0nICsgYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJywgLy8gdXNlIGV4cGlyZXMgYXR0cmlidXRlLCBtYXgtYWdlIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUVcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMucGF0aCA/ICc7IHBhdGg9JyArIGF0dHJpYnV0ZXMucGF0aCA6ICcnLFxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5kb21haW4gPyAnOyBkb21haW49JyArIGF0dHJpYnV0ZXMuZG9tYWluIDogJycsXHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLnNlY3VyZSA/ICc7IHNlY3VyZScgOiAnJ1xyXG5cdFx0XHRcdF0uam9pbignJykpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBSZWFkXHJcblxyXG5cdFx0XHRpZiAoIWtleSkge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XHJcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxyXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxyXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcclxuXHRcdFx0dmFyIGkgPSAwO1xyXG5cclxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xyXG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XHJcblxyXG5cdFx0XHRcdGlmIChjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XHJcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBuYW1lID0gcGFydHNbMF0ucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cdFx0XHRcdFx0Y29va2llID0gY29udmVydGVyLnJlYWQgP1xyXG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcclxuXHRcdFx0XHRcdFx0Y29va2llLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XHJcblx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xyXG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gY29va2llO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIWtleSkge1xyXG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHJcblx0XHRhcGkuc2V0ID0gYXBpO1xyXG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0cmV0dXJuIGFwaShrZXkpO1xyXG5cdFx0fTtcclxuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmFwcGx5KHtcclxuXHRcdFx0XHRqc29uOiB0cnVlXHJcblx0XHRcdH0sIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XHJcblx0XHR9O1xyXG5cdFx0YXBpLmRlZmF1bHRzID0ge307XHJcblxyXG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XHJcblx0XHRcdFx0ZXhwaXJlczogLTFcclxuXHRcdFx0fSkpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XHJcblxyXG5cdFx0cmV0dXJuIGFwaTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcclxufSkpO1xyXG4iLCIvKipcclxuKiBqcXVlcnkubWF0Y2hIZWlnaHQuanMgbWFzdGVyXHJcbiogaHR0cDovL2JybS5pby9qcXVlcnktbWF0Y2gtaGVpZ2h0L1xyXG4qIExpY2Vuc2U6IE1JVFxyXG4qL1xyXG5cclxuOyhmdW5jdGlvbigkKSB7XHJcbiAgICAvKlxyXG4gICAgKiAgaW50ZXJuYWxcclxuICAgICovXHJcblxyXG4gICAgdmFyIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gLTEsXHJcbiAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3BhcnNlXHJcbiAgICAqICB2YWx1ZSBwYXJzZSB1dGlsaXR5IGZ1bmN0aW9uXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcGFyc2UgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIC8vIHBhcnNlIHZhbHVlIGFuZCBjb252ZXJ0IE5hTiB0byAwXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBfcm93c1xyXG4gICAgKiAgdXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIGFycmF5IG9mIGpRdWVyeSBzZWxlY3Rpb25zIHJlcHJlc2VudGluZyBlYWNoIHJvd1xyXG4gICAgKiAgKGFzIGRpc3BsYXllZCBhZnRlciBmbG9hdCB3cmFwcGluZyBhcHBsaWVkIGJ5IGJyb3dzZXIpXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcm93cyA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcbiAgICAgICAgdmFyIHRvbGVyYW5jZSA9IDEsXHJcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxyXG4gICAgICAgICAgICBsYXN0VG9wID0gbnVsbCxcclxuICAgICAgICAgICAgcm93cyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBncm91cCBlbGVtZW50cyBieSB0aGVpciB0b3AgcG9zaXRpb25cclxuICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdG9wID0gJHRoYXQub2Zmc2V0KCkudG9wIC0gX3BhcnNlKCR0aGF0LmNzcygnbWFyZ2luLXRvcCcpKSxcclxuICAgICAgICAgICAgICAgIGxhc3RSb3cgPSByb3dzLmxlbmd0aCA+IDAgPyByb3dzW3Jvd3MubGVuZ3RoIC0gMV0gOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxhc3RSb3cgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IGl0ZW0gb24gdGhlIHJvdywgc28ganVzdCBwdXNoIGl0XHJcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goJHRoYXQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvdyB0b3AgaXMgdGhlIHNhbWUsIGFkZCB0byB0aGUgcm93IGdyb3VwXHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLmFicyhsYXN0VG9wIC0gdG9wKSkgPD0gdG9sZXJhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93c1tyb3dzLmxlbmd0aCAtIDFdID0gbGFzdFJvdy5hZGQoJHRoYXQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2Ugc3RhcnQgYSBuZXcgcm93IGdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgbGFzdCByb3cgdG9wXHJcbiAgICAgICAgICAgIGxhc3RUb3AgPSB0b3A7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByb3dzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3BhcnNlT3B0aW9uc1xyXG4gICAgKiAgaGFuZGxlIHBsdWdpbiBvcHRpb25zXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcGFyc2VPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBvcHRzID0ge1xyXG4gICAgICAgICAgICBieVJvdzogdHJ1ZSxcclxuICAgICAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IG51bGwsXHJcbiAgICAgICAgICAgIHJlbW92ZTogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZChvcHRzLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIG9wdHMuYnlSb3cgPSBvcHRpb25zO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gJ3JlbW92ZScpIHtcclxuICAgICAgICAgICAgb3B0cy5yZW1vdmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9wdHM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodFxyXG4gICAgKiAgcGx1Z2luIGRlZmluaXRpb25cclxuICAgICovXHJcblxyXG4gICAgdmFyIG1hdGNoSGVpZ2h0ID0gJC5mbi5tYXRjaEhlaWdodCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0cyA9IF9wYXJzZU9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSByZW1vdmVcclxuICAgICAgICBpZiAob3B0cy5yZW1vdmUpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZpeGVkIGhlaWdodCBmcm9tIGFsbCBzZWxlY3RlZCBlbGVtZW50c1xyXG4gICAgICAgICAgICB0aGlzLmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgc2VsZWN0ZWQgZWxlbWVudHMgZnJvbSBhbGwgZ3JvdXBzXHJcbiAgICAgICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbihrZXksIGdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5lbGVtZW50cyA9IGdyb3VwLmVsZW1lbnRzLm5vdCh0aGF0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbnVwIGVtcHR5IGdyb3Vwc1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gMSAmJiAhb3B0cy50YXJnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoaXMgZ3JvdXAgc28gd2UgY2FuIHJlLWFwcGx5IGxhdGVyIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcclxuICAgICAgICBtYXRjaEhlaWdodC5fZ3JvdXBzLnB1c2goe1xyXG4gICAgICAgICAgICBlbGVtZW50czogdGhpcyxcclxuICAgICAgICAgICAgb3B0aW9uczogb3B0c1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBtYXRjaCBlYWNoIGVsZW1lbnQncyBoZWlnaHQgdG8gdGhlIHRhbGxlc3QgZWxlbWVudCBpbiB0aGUgc2VsZWN0aW9uXHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2FwcGx5KHRoaXMsIG9wdHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIHBsdWdpbiBnbG9iYWwgb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICBtYXRjaEhlaWdodC5fZ3JvdXBzID0gW107XHJcbiAgICBtYXRjaEhlaWdodC5fdGhyb3R0bGUgPSA4MDtcclxuICAgIG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IGZhbHNlO1xyXG4gICAgbWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZSA9IG51bGw7XHJcbiAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlcclxuICAgICogIGFwcGx5IG1hdGNoSGVpZ2h0IHRvIGdpdmVuIGVsZW1lbnRzXHJcbiAgICAqL1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpLFxyXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcclxuICAgICAgICAgICAgcm93cyA9IFskZWxlbWVudHNdO1xyXG5cclxuICAgICAgICAvLyB0YWtlIG5vdGUgb2Ygc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuICAgICAgICAgICAgaHRtbEhlaWdodCA9ICQoJ2h0bWwnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGhpZGRlbiBwYXJlbnRzXHJcbiAgICAgICAgdmFyICRoaWRkZW5QYXJlbnRzID0gJGVsZW1lbnRzLnBhcmVudHMoKS5maWx0ZXIoJzpoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHRlbXBvcmFyaWx5IG11c3QgZm9yY2UgaGlkZGVuIHBhcmVudHMgdmlzaWJsZVxyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAgICAgICAvLyBnZXQgcm93cyBpZiB1c2luZyBieVJvdywgb3RoZXJ3aXNlIGFzc3VtZSBvbmUgcm93XHJcbiAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgIW9wdHMudGFyZ2V0KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBtdXN0IGZpcnN0IGZvcmNlIGFuIGFyYml0cmFyeSBlcXVhbCBoZWlnaHQgc28gZmxvYXRpbmcgZWxlbWVudHMgYnJlYWsgZXZlbmx5XHJcbiAgICAgICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJpbHkgZm9yY2UgYSB1c2FibGUgZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiBkaXNwbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci10b3Atd2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1ib3R0b20td2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDBweCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYXJyYXkgb2Ygcm93cyAoYmFzZWQgb24gZWxlbWVudCB0b3AgcG9zaXRpb24pXHJcbiAgICAgICAgICAgIHJvd3MgPSBfcm93cygkZWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmV2ZXJ0IG9yaWdpbmFsIGlubGluZSBzdHlsZXNcclxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8ICcnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmVhY2gocm93cywgZnVuY3Rpb24oa2V5LCByb3cpIHtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHJvdyksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHRzLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBhcHBseSB0byByb3dzIHdpdGggb25seSBvbmUgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgJHJvdy5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb3cuY3NzKG9wdHMucHJvcGVydHksICcnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBmaW5kIHRoZSBtYXggaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGZvcmNlIGEgdXNhYmxlIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheSAhPT0gJ2lubGluZS1ibG9jaycgJiYgZGlzcGxheSAhPT0gJ2lubGluZS1mbGV4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB3ZSBnZXQgdGhlIGNvcnJlY3QgYWN0dWFsIGhlaWdodCAoYW5kIG5vdCBhIHByZXZpb3VzbHkgc2V0IGhlaWdodCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3NzID0geyAnZGlzcGxheSc6IGRpc3BsYXkgfTtcclxuICAgICAgICAgICAgICAgICAgICBjc3Nbb3B0cy5wcm9wZXJ0eV0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoY3NzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluZCB0aGUgbWF4IGhlaWdodCAoaW5jbHVkaW5nIHBhZGRpbmcsIGJ1dCBub3QgbWFyZ2luKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhhdC5vdXRlckhlaWdodChmYWxzZSkgPiB0YXJnZXRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJ0IGRpc3BsYXkgYmxvY2tcclxuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoJ2Rpc3BsYXknLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRhcmdldCBzZXQsIHVzZSB0aGUgaGVpZ2h0IG9mIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gb3B0cy50YXJnZXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGFwcGx5IHRoZSBoZWlnaHQgdG8gYWxsIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFwcGx5IHRvIGEgdGFyZ2V0XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy50YXJnZXQgJiYgJHRoYXQuaXMob3B0cy50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBwYWRkaW5nIGFuZCBib3JkZXIgY29ycmVjdGx5IChyZXF1aXJlZCB3aGVuIG5vdCB1c2luZyBib3JkZXItYm94KVxyXG4gICAgICAgICAgICAgICAgaWYgKCR0aGF0LmNzcygnYm94LXNpemluZycpICE9PSAnYm9yZGVyLWJveCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgKz0gX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLXRvcC13aWR0aCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctdG9wJykpICsgX3BhcnNlKCR0aGF0LmNzcygncGFkZGluZy1ib3R0b20nKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBoZWlnaHQgKGFjY291bnRpbmcgZm9yIHBhZGRpbmcgYW5kIGJvcmRlcilcclxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyhvcHRzLnByb3BlcnR5LCAodGFyZ2V0SGVpZ2h0IC0gdmVydGljYWxQYWRkaW5nKSArICdweCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmV2ZXJ0IGhpZGRlbiBwYXJlbnRzXHJcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8IG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZXN0b3JlIHNjcm9sbCBwb3NpdGlvbiBpZiBlbmFibGVkXHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKChzY3JvbGxUb3AgLyBodG1sSGVpZ2h0KSAqICQoJ2h0bWwnKS5vdXRlckhlaWdodCh0cnVlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGlcclxuICAgICogIGFwcGxpZXMgbWF0Y2hIZWlnaHQgdG8gYWxsIGVsZW1lbnRzIHdpdGggYSBkYXRhLW1hdGNoLWhlaWdodCBhdHRyaWJ1dGVcclxuICAgICovXHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBncm91cHMgPSB7fTtcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgZ3JvdXBzIGJ5IHRoZWlyIGdyb3VwSWQgc2V0IGJ5IGVsZW1lbnRzIHVzaW5nIGRhdGEtbWF0Y2gtaGVpZ2h0XHJcbiAgICAgICAgJCgnW2RhdGEtbWF0Y2gtaGVpZ2h0XSwgW2RhdGEtbWhdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIGdyb3VwSWQgPSAkdGhpcy5hdHRyKCdkYXRhLW1oJykgfHwgJHRoaXMuYXR0cignZGF0YS1tYXRjaC1oZWlnaHQnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChncm91cElkIGluIGdyb3Vwcykge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gZ3JvdXBzW2dyb3VwSWRdLmFkZCgkdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBJZF0gPSAkdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBhcHBseSBtYXRjaEhlaWdodCB0byBlYWNoIGdyb3VwXHJcbiAgICAgICAgJC5lYWNoKGdyb3VwcywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0Y2hIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fdXBkYXRlXHJcbiAgICAqICB1cGRhdGVzIG1hdGNoSGVpZ2h0IG9uIGFsbCBjdXJyZW50IGdyb3VwcyB3aXRoIHRoZWlyIGNvcnJlY3Qgb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3VwZGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUpIHtcclxuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLmVsZW1lbnRzLCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtYXRjaEhlaWdodC5fdXBkYXRlID0gZnVuY3Rpb24odGhyb3R0bGUsIGV2ZW50KSB7XHJcbiAgICAgICAgLy8gcHJldmVudCB1cGRhdGUgaWYgZmlyZWQgZnJvbSBhIHJlc2l6ZSBldmVudFxyXG4gICAgICAgIC8vIHdoZXJlIHRoZSB2aWV3cG9ydCB3aWR0aCBoYXNuJ3QgYWN0dWFsbHkgY2hhbmdlZFxyXG4gICAgICAgIC8vIGZpeGVzIGFuIGV2ZW50IGxvb3BpbmcgYnVnIGluIElFOFxyXG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAncmVzaXplJykge1xyXG4gICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoID09PSBfcHJldmlvdXNSZXNpemVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gd2luZG93V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aHJvdHRsZSB1cGRhdGVzXHJcbiAgICAgICAgaWYgKCF0aHJvdHRsZSkge1xyXG4gICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKF91cGRhdGVUaW1lb3V0ID09PSAtMSkge1xyXG4gICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XHJcbiAgICAgICAgICAgIH0sIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgYmluZCBldmVudHNcclxuICAgICovXHJcblxyXG4gICAgLy8gYXBwbHkgb24gRE9NIHJlYWR5IGV2ZW50XHJcbiAgICAkKG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkpO1xyXG5cclxuICAgIC8vIHVwZGF0ZSBoZWlnaHRzIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcclxuICAgICQod2luZG93KS5iaW5kKCdsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKGZhbHNlLCBldmVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB0aHJvdHRsZWQgdXBkYXRlIGhlaWdodHMgb24gcmVzaXplIGV2ZW50c1xyXG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSh0cnVlLCBldmVudCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKGpRdWVyeSk7XHJcbiIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5KUyBQTFVHSU5TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xyXG5cclxuXHJcbi8vIEdldCBDdXJyZW50IEJyZWFrcG9pbnQgKEdsb2JhbClcclxudmFyIGJyZWFrcG9pbnQgPSB7XHJcblx0bmFtZTogJycsXHJcblx0cmVmcmVzaDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLm5hbWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICc6YmVmb3JlJykuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoL1xcXCIvZywgJycpO1xyXG5cdH1cclxufTtcclxualF1ZXJ5KHdpbmRvdykucmVzaXplKCBmdW5jdGlvbigpIHsgYnJlYWtwb2ludC5yZWZyZXNoKCk7IH0pLnJlc2l6ZSgpO1xyXG5cclxuXHJcbi8vIFJlc2l6ZSBJZnJhbWVzIFByb3BvcnRpb25hbGx5XHJcbmZ1bmN0aW9uIGlmcmFtZUFzcGVjdChzZWxlY3Rvcikge1xyXG5cdHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgalF1ZXJ5KCdpZnJhbWUnKTtcclxuXHJcblx0c2VsZWN0b3IuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHQvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXHJcblx0XHR2YXIgaWZyYW1lID0galF1ZXJ5KHRoaXMpLFxyXG5cdFx0XHR3aWR0aCAgPSBpZnJhbWUud2lkdGgoKTtcclxuXHRcdGlmICggdHlwZW9mKGlmcmFtZS5kYXRhKCdyYXRpbycpKSA9PSAndW5kZWZpbmVkJyApIHtcclxuXHRcdFx0dmFyIGF0dHJXID0gdGhpcy53aWR0aCxcclxuXHRcdFx0XHRhdHRySCA9IHRoaXMuaGVpZ2h0O1xyXG5cdFx0XHRpZnJhbWUuZGF0YSgncmF0aW8nLCBhdHRySCAvIGF0dHJXICkucmVtb3ZlQXR0cignd2lkdGgnKS5yZW1vdmVBdHRyKCdoZWlnaHQnKTtcclxuXHRcdH1cclxuXHRcdGlmcmFtZS5oZWlnaHQoIHdpZHRoICogaWZyYW1lLmRhdGEoJ3JhdGlvJykgKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG4vLyBMaWdodGVuIC8gRGFya2VuIENvbG9yXHJcbi8vIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcclxuZnVuY3Rpb24gc2hhZGVDb2xvcihjb2xvciwgcGVyY2VudCkgeyAgIFxyXG5cdHZhciBmPXBhcnNlSW50KGNvbG9yLnNsaWNlKDEpLDE2KSx0PXBlcmNlbnQ8MD8wOjI1NSxwPXBlcmNlbnQ8MD9wZXJjZW50Ki0xOnBlcmNlbnQsUj1mPj4xNixHPWY+PjgmMHgwMEZGLEI9ZiYweDAwMDBGRjtcclxuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKHQtUikqcCkrUikqMHgxMDAwMCsoTWF0aC5yb3VuZCgodC1HKSpwKStHKSoweDEwMCsoTWF0aC5yb3VuZCgodC1CKSpwKStCKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5cclxuLy8gQmxlbmQgQ29sb3JzXHJcbi8vIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcclxuZnVuY3Rpb24gYmxlbmRDb2xvcnMoYzAsIGMxLCBwKSB7XHJcblx0dmFyIGY9cGFyc2VJbnQoYzAuc2xpY2UoMSksMTYpLHQ9cGFyc2VJbnQoYzEuc2xpY2UoMSksMTYpLFIxPWY+PjE2LEcxPWY+PjgmMHgwMEZGLEIxPWYmMHgwMDAwRkYsUjI9dD4+MTYsRzI9dD4+OCYweDAwRkYsQjI9dCYweDAwMDBGRjtcclxuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKFIyLVIxKSpwKStSMSkqMHgxMDAwMCsoTWF0aC5yb3VuZCgoRzItRzEpKnApK0cxKSoweDEwMCsoTWF0aC5yb3VuZCgoQjItQjEpKnApK0IxKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5cclxuLy8gQ29udmVydCBjb2xvciB0byBSR0JhXHJcbmZ1bmN0aW9uIGNvbG9yVG9SZ2JhKGNvbG9yLCBvcGFjaXR5KSB7XHJcblx0aWYgKCBjb2xvci5zdWJzdHJpbmcoMCw0KSA9PSAncmdiYScgKSB7XHJcblx0XHR2YXIgYWxwaGEgPSBjb2xvci5tYXRjaCgvKFteXFwsXSopXFwpJC8pO1xyXG5cdFx0cmV0dXJuIGNvbG9yLnJlcGxhY2UoYWxwaGFbMV0sIG9wYWNpdHkpO1xyXG5cdH0gZWxzZSBpZiAoIGNvbG9yLnN1YnN0cmluZygwLDMpID09ICdyZ2InICkge1xyXG5cdFx0cmV0dXJuIGNvbG9yLnJlcGxhY2UoJ3JnYignLCAncmdiYSgnKS5yZXBsYWNlKCcpJywgJywgJytvcGFjaXR5KycpJyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBoZXggPSBjb2xvci5yZXBsYWNlKCcjJywnJyksXHJcblx0XHRcdHIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsMiksIDE2KSxcclxuXHRcdFx0ZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpLFxyXG5cdFx0XHRiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNiksXHJcblx0XHRcdHJlc3VsdCA9ICdyZ2JhKCcrcisnLCcrZysnLCcrYisnLCcrb3BhY2l0eSsnKSc7XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxufVxyXG5cclxuXHJcbi8vIENvbG9yIExpZ2h0IE9yIERhcmtcclxuLy8gQ3JlZGl0IFwiTGFycnkgRm94XCIgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9sYXJyeWZveC8xNjM2MzM4XHJcbmZ1bmN0aW9uIGNvbG9yTG9EKGNvbG9yKSB7XHJcblx0dmFyIHIsYixnLGhzcCxhID0gY29sb3I7XHJcblx0aWYgKGEubWF0Y2goL15yZ2IvKSkge1xyXG5cdFx0YSA9IGEubWF0Y2goL15yZ2JhP1xcKChcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKykoPzosXFxzKihcXGQrKD86XFwuXFxkKyk/KSk/XFwpJC8pO1xyXG5cdFx0ciA9IGFbMV07XHJcblx0XHRiID0gYVsyXTtcclxuXHRcdGcgPSBhWzNdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gKygnMHgnICsgYS5zbGljZSgxKS5yZXBsYWNlKGEubGVuZ3RoIDwgNSAmJiAvLi9nLCAnJCYkJicpKTtcclxuXHRcdHIgPSBhID4+IDE2O1xyXG5cdFx0YiA9IGEgPj4gOCAmIDI1NTtcclxuXHRcdGcgPSBhICYgMjU1O1xyXG5cdH1cclxuXHRoc3AgPSBNYXRoLnNxcnQoIDAuMjk5ICogKHIgKiByKSArIDAuNTg3ICogKGcgKiBnKSArIDAuMTE0ICogKGIgKiBiKSApO1xyXG5cdHJldHVybiAoIGhzcCA+IDEyNy41ICkgPyAnbGlnaHQnIDogJ2RhcmsnO1xyXG59IFxyXG5cclxuXHJcbi8vIEltYWdlIExpZ2h0IE9yIERhcmsgSW1hZ2VcclxuLy8gQ3JlZGl0IFwiSm9zZXBoIFBvcnRlbGxpXCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTQ5NjM2L2pvc2VwaC1wb3J0ZWxsaVxyXG5mdW5jdGlvbiBpbWFnZUxvRChpbWFnZVNyYywgY2FsbGJhY2spIHtcclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblx0aW1nLnNyYyA9IGltYWdlU3JjO1xyXG5cdGltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcclxuXHJcblx0dmFyIGNvbG9yU3VtID0gMDtcclxuXHJcblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRlIGNhbnZhc1xyXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMsMCwwKTtcclxuXHJcblx0XHR2YXIgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0dmFyIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcclxuXHRcdHZhciByLGcsYixhdmc7XHJcblxyXG5cdFx0Zm9yKHZhciB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHgrPTQpIHtcclxuXHRcdFx0ciA9IGRhdGFbeF07XHJcblx0XHRcdGcgPSBkYXRhW3grMV07XHJcblx0XHRcdGIgPSBkYXRhW3grMl07XHJcblxyXG5cdFx0XHRhdmcgPSBNYXRoLmZsb29yKChyK2crYikvMyk7XHJcblx0XHRcdGNvbG9yU3VtICs9IGF2ZztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAodGhpcy53aWR0aCp0aGlzLmhlaWdodCkpO1xyXG5cdFx0Y2FsbGJhY2soYnJpZ2h0bmVzcyk7XHJcblx0fTtcclxufVxyXG5cclxuXHJcbi8vIFJlc2l6ZSBJbWFnZSBUbyBGaWxsIENvbnRhaW5lciBTaXplXHJcbmZ1bmN0aW9uIGltYWdlQ292ZXIoY29udCwgdHlwZSwgY29yckgpIHtcclxuXHR0eXBlID0gdHlwZSB8fCAnYmcnO1xyXG5cclxuXHRjb250LmFkZENsYXNzKCdpbWFnZS1jb3ZlcicpO1xyXG5cclxuXHR2YXIgaW1nLCBpbWdVcmwsIGltZ1dpZHRoID0gMCwgaW1nSGVpZ2h0ID0gMDtcclxuXHJcblx0aWYgKCB0eXBlID09ICdpbWcnICkge1xyXG5cdFx0aW1nID0gY29udC5maW5kKCcuYmctaW1nJyk7XHJcblx0XHRpbWdXaWR0aCAgPSBpbWcud2lkdGgoKTtcclxuXHRcdGltZ0hlaWdodCA9IGltZy5oZWlnaHQoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0aW1nVXJsID0gY29udC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5tYXRjaCgvXnVybFxcKFwiPyguKz8pXCI/XFwpJC8pO1xyXG5cdFx0aWYgKCBpbWdVcmxbMV0gKSB7XHJcblx0XHQgICAgaW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHQgICAgaW1nLnNyYyA9IGltZ1VybFsxXTtcclxuXHRcdCAgICBpbWdXaWR0aCAgPSBpbWcud2lkdGg7XHJcblx0XHQgICAgaW1nSGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICggaW1nV2lkdGggIT09IDAgJiYgaW1nSGVpZ2h0ICE9PSAwICkge1xyXG5cdFx0dmFyIGNvbnRXaWR0aCAgPSBjb250Lm91dGVyV2lkdGgoKSxcclxuXHRcdFx0Y29udEhlaWdodCA9IGNvbnQub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0aGVpZ2h0RGlmZiA9IGNvbnRXaWR0aCAvIGltZ1dpZHRoICogaW1nSGVpZ2h0LFxyXG5cdFx0XHRuZXdXaWR0aCAgID0gJ2F1dG8nLFxyXG5cdFx0XHRuZXdIZWlnaHQgID0gY29udEhlaWdodCArIGNvcnJIICsgJ3B4JztcclxuXHJcblx0XHRcdGlmICggaGVpZ2h0RGlmZiA+IGNvbnRIZWlnaHQgKSB7XHJcblx0XHRcdFx0bmV3V2lkdGggID0gJzEwMCUnO1xyXG5cdFx0XHRcdG5ld0hlaWdodCA9ICdhdXRvJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZSA9PSAnaW1nJyApIHtcclxuXHRcdFx0aW1nLmNzcyh7IHdpZHRoOiBuZXdXaWR0aCwgaGVpZ2h0OiBuZXdIZWlnaHQgfSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250LmNzcygnYmFja2dyb3VuZC1zaXplJywgbmV3V2lkdGggKyAnICcgKyBuZXdIZWlnaHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbi8vIERldGVybWluZSBJZiBBbiBFbGVtZW50IElzIFNjcm9sbGVkIEludG8gVmlld1xyXG5mdW5jdGlvbiBlbGVtVmlzaWJsZShlbGVtLCBjb250KSB7XHJcblx0dmFyIGNvbnRUb3AgPSBjb250LnNjcm9sbFRvcCgpLFxyXG5cdFx0Y29udEJ0bSA9IGNvbnRUb3AgKyBjb250LmhlaWdodCgpLFxyXG5cdFx0ZWxlbVRvcCA9IGVsZW0ub2Zmc2V0KCkudG9wLFxyXG5cdFx0ZWxlbUJ0bSA9IGVsZW1Ub3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuXHRyZXR1cm4gKChlbGVtQnRtIDw9IGNvbnRCdG0pICYmIChlbGVtVG9wID49IGNvbnRUb3ApKTtcclxufVxyXG5cclxuXHJcbi8vIFNtb290aCBTY3JvbGxpbmcgRm9yIFdlYmtpdCBCcm93c2Vyc1xyXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vaWFobm4vRmlyZWZveC1saWtlLXNtb290aC1zY3JvbGwtZm9yLWNocm9tZVxyXG52YXIgTWl4dF9TbW9vdGhTY3JvbGwgPSB7XHJcblx0cm9vdDogICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG5cdGFjdGl2ZTogIGRvY3VtZW50LmJvZHksXHJcblx0cGVuZGluZzogZmFsc2UsXHJcblx0ZnJhbWU6ICAgZmFsc2UsXHJcblx0Y2FjaGU6ICAge30sXHJcblx0cXVldWU6ICAge30sXHJcblx0ZGlyOiAgICAgeyB4OiAwLCB5OiAwIH0sXHJcblx0ZnJhbWVyYXRlOiA2MCxcclxuXHRhbmltX3RpbWU6IDIwMCxcclxuXHRzdGVwX3NpemU6IDUwLFxyXG5cclxuXHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwbGF0Zm9ybSAgPSBuYXZpZ2F0b3IucGxhdGZvcm0udG9Mb3dlckNhc2UoKTtcclxuXHRcdGlmICggISBqUXVlcnkuYnJvd3Nlci53ZWJraXQgfHwgKCBwbGF0Zm9ybS5pbmRleE9mKCd3aW4nKSAhPSAwICYmIHBsYXRmb3JtLmluZGV4T2YoJ2xpbnV4JykgIT0gMCApICkgcmV0dXJuO1xyXG5cclxuXHRcdHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSxcclxuXHRcdFx0ZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG5cdFx0XHRpbm5lckhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcclxuXHRcdFx0c2Nyb2xsSGVpZ2h0ID0gYm9keS5zY3JvbGxIZWlnaHQ7XHJcblxyXG5cdFx0TWl4dF9TbW9vdGhTY3JvbGwuYWRkTGlzdGVuZXJzKCk7XHJcblxyXG5cdFx0TWl4dF9TbW9vdGhTY3JvbGwucm9vdCA9ICggZG9jdW1lbnQuY29tcGF0TW9kZS5pbmRleE9mKCdDU1MnKSA+PSAwICkgPyBkb2MgOiBib2R5O1xyXG5cdFx0TWl4dF9TbW9vdGhTY3JvbGwuYWN0aXZlID0gYm9keTtcclxuXHRcdGlmICggd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZiApIHtcclxuXHRcdFx0TWl4dF9TbW9vdGhTY3JvbGwuZnJhbWUgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmICggc2Nyb2xsSGVpZ2h0ID4gaW5uZXJIZWlnaHQgJiYgKCBib2R5Lm9mZnNldEhlaWdodCA8PSBpbm5lckhlaWdodCB8fCBkb2Mub2Zmc2V0SGVpZ2h0IDw9IGlubmVySGVpZ2h0ICkgKSB7XHJcblx0XHRcdE1peHRfU21vb3RoU2Nyb2xsLnJvb3Quc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG5cdFx0XHRpZiAoIE1peHRfU21vb3RoU2Nyb2xsLnJvb3Qub2Zmc2V0SGVpZ2h0IDw9IGlubmVySGVpZ2h0ICkge1xyXG5cdFx0XHRcdHZhciBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0aS5zdHlsZS5jbGVhciA9ICdib3RoJztcclxuXHRcdFx0XHRib2R5LmFwcGVuZENoaWxkKGkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR3aW5kb3cuc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uICgpIHsgTWl4dF9TbW9vdGhTY3JvbGwuY2FjaGUgPSB7fTsgfSwgMTAwMDAgKTtcclxuXHR9LFxyXG5cclxuXHRhZGRMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIE1peHRfU21vb3RoU2Nyb2xsLm1vdXNlZG93bik7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIE1peHRfU21vb3RoU2Nyb2xsLm1vdXNld2hlZWwpO1xyXG5cdH0sXHJcblxyXG5cdG1vdXNlZG93bjogZnVuY3Rpb24oZSkgeyBNaXh0X1Ntb290aFNjcm9sbC5hY3RpdmUgPSBlLnRhcmdldDsgfSxcclxuXHJcblx0c2Nyb2xsQXJyYXk6IGZ1bmN0aW9uKGUsIHQsIG4sIHIpIHtcclxuXHRcdHIgPSByIHx8IDEwMDA7XHJcblx0XHRNaXh0X1Ntb290aFNjcm9sbC5kaXJlY3Rpb25DaGVjayh0LCBuKTtcclxuXHRcdE1peHRfU21vb3RoU2Nyb2xsLnF1ZXVlLnB1c2goe1xyXG5cdFx0XHR4OiB0LCB5OiBuLFxyXG5cdFx0XHRsYXN0WDogdCA8IDAgPyAwLjk5IDogLTAuOTksXHJcblx0XHRcdGxhc3RZOiBuIDwgMCA/IDAuOTkgOiAtMC45OSxcclxuXHRcdFx0c3RhcnQ6ICsobmV3IERhdGUoKSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICggTWl4dF9TbW9vdGhTY3JvbGwucGVuZGluZyApIHJldHVybjtcclxuXHJcblx0XHR2YXIgaSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIHMgPSArKG5ldyBEYXRlKCkpLFxyXG5cdFx0XHRcdG8gPSAwLFxyXG5cdFx0XHRcdHUgPSAwO1xyXG5cdFx0XHRmb3IgKCB2YXIgYSA9IDA7IGEgPCBNaXh0X1Ntb290aFNjcm9sbC5xdWV1ZS5sZW5ndGg7IGErKyApIHtcclxuXHRcdFx0XHR2YXIgZiA9IE1peHRfU21vb3RoU2Nyb2xsLnF1ZXVlW2FdLFxyXG5cdFx0XHRcdFx0bCA9IHMgLSBmLnN0YXJ0LFxyXG5cdFx0XHRcdFx0YyA9IGwgPj0gTWl4dF9TbW9vdGhTY3JvbGwuYW5pbV90aW1lLFxyXG5cdFx0XHRcdFx0aCA9IGMgPyAxIDogbCAvIE1peHRfU21vb3RoU2Nyb2xsLmFuaW1fdGltZSxcclxuXHRcdFx0XHRcdHAgPSBmLnggKiBoIC0gZi5sYXN0WCA+PiAwLFxyXG5cdFx0XHRcdFx0ZCA9IGYueSAqIGggLSBmLmxhc3RZID4+IDA7XHJcblx0XHRcdFx0byArPSBwO1xyXG5cdFx0XHRcdHUgKz0gZDtcclxuXHRcdFx0XHRmLmxhc3RYICs9IHA7XHJcblx0XHRcdFx0Zi5sYXN0WSArPSBkO1xyXG5cdFx0XHRcdGlmICggYyApIHtcclxuXHRcdFx0XHRcdE1peHRfU21vb3RoU2Nyb2xsLnF1ZXVlLnNwbGljZShhLCAxKTtcclxuXHRcdFx0XHRcdGEtLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCB0ICkge1xyXG5cdFx0XHRcdHZhciB2ID0gZS5zY3JvbGxMZWZ0O1xyXG5cdFx0XHRcdGUuc2Nyb2xsTGVmdCArPSBvO1xyXG5cdFx0XHRcdGlmICggbyAmJiBlLnNjcm9sbExlZnQgPT09IHYgKSB7IHQgPSAwOyB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBuKSB7XHJcblx0XHRcdFx0dmFyIG0gPSBlLnNjcm9sbFRvcDtcclxuXHRcdFx0XHRlLnNjcm9sbFRvcCArPSB1O1xyXG5cdFx0XHRcdGlmICggdSAmJiBlLnNjcm9sbFRvcCA9PT0gbSApIHsgbiA9IDA7IH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoICEgdCAmJiAhIG4gKSBNaXh0X1Ntb290aFNjcm9sbC5xdWV1ZSA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKCBNaXh0X1Ntb290aFNjcm9sbC5xdWV1ZS5sZW5ndGggKSB7XHJcblx0XHRcdFx0c2V0VGltZW91dChpLCByIC8gTWl4dF9TbW9vdGhTY3JvbGwuZnJhbWVyYXRlICsgMSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0TWl4dF9TbW9vdGhTY3JvbGwucGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0c2V0VGltZW91dChpLCAwKTtcclxuXHRcdE1peHRfU21vb3RoU2Nyb2xsLnBlbmRpbmcgPSB0cnVlO1xyXG5cdH0sXHJcblxyXG5cdGRpcmVjdGlvbkNoZWNrOiBmdW5jdGlvbihlLCB0KSB7XHJcblx0ICAgIGUgPSBlID4gMCA/IDEgOiAtMTtcclxuXHQgICAgdCA9IHQgPiAwID8gMSA6IC0xO1xyXG5cdCAgICBpZiAoIE1peHRfU21vb3RoU2Nyb2xsLmRpci54ICE9PSBlIHx8IE1peHRfU21vb3RoU2Nyb2xsLmRpci55ICE9PSB0ICkge1xyXG5cdCAgICAgICAgTWl4dF9TbW9vdGhTY3JvbGwuZGlyLnggPSBlO1xyXG5cdCAgICAgICAgTWl4dF9TbW9vdGhTY3JvbGwuZGlyLnkgPSB0O1xyXG5cdCAgICAgICAgTWl4dF9TbW9vdGhTY3JvbGwucXVldWUgPSBbXTtcclxuXHQgICAgfVxyXG5cdH0sXHJcblxyXG5cdG1vdXNld2hlZWw6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciB0ID0gZS50YXJnZXQsXHJcblx0XHRcdG9iaiA9IE1peHRfU21vb3RoU2Nyb2xsLFxyXG5cdFx0XHRuID0gb2JqLm92ZXJmbG93aW5nQW5jZXN0b3IodCk7XHJcblx0XHRpZiAoICEgbiB8fCBlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgb2JqLmlzTm9kZU5hbWUob2JqLmFjdGl2ZSwgJ2VtYmVkJykgfHwgb2JqLmlzTm9kZU5hbWUodCwgJ2VtYmVkJykgJiYgL1xcLnBkZi9pLnRlc3QodC5zcmMpICkgeyByZXR1cm4gdHJ1ZTsgfVxyXG5cdFx0dmFyIHIgPSBlLndoZWVsRGVsdGFYIHx8IDAsXHJcblx0XHRcdGkgPSBlLndoZWVsRGVsdGFZIHx8IDA7XHJcblx0XHRpZiAoICEgciAmJiAhIGkgKSBpID0gZS53aGVlbERlbHRhIHx8IDA7XHJcblx0XHRpZiAoIE1hdGguYWJzKHIpID4gMS4yICkgciAqPSBvYmouc3RlcF9zaXplIC8gMTIwO1xyXG5cdFx0aWYgKCBNYXRoLmFicyhpKSA+IDEuMiApIGkgKj0gb2JqLnN0ZXBfc2l6ZSAvIDEyMDtcclxuXHRcdG9iai5zY3JvbGxBcnJheShuLCAtciwgLWkpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0sXHJcblxyXG5cdG92ZXJmbG93aW5nQW5jZXN0b3I6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciB0ID0gW107XHJcblx0XHR2YXIgbiA9IE1peHRfU21vb3RoU2Nyb2xsLnJvb3Quc2Nyb2xsSGVpZ2h0O1xyXG5cdFx0ZG8ge1xyXG5cdFx0XHR2YXIgciA9IE1peHRfU21vb3RoU2Nyb2xsLmNhY2hlW01peHRfU21vb3RoU2Nyb2xsLnVuaXF1ZUlEKGUpXTtcclxuXHRcdFx0aWYgKCByICkgeyByZXR1cm4gTWl4dF9TbW9vdGhTY3JvbGwuc2V0Q2FjaGUodCwgcik7IH1cclxuXHRcdFx0dC5wdXNoKGUpO1xyXG5cdFx0XHRpZiAoIG4gPT09IGUuc2Nyb2xsSGVpZ2h0ICkge1xyXG5cdFx0XHRcdGlmICggISBNaXh0X1Ntb290aFNjcm9sbC5mcmFtZSB8fCBNaXh0X1Ntb290aFNjcm9sbC5yb290LmNsaWVudEhlaWdodCArIDEwIDwgbiApIHtcclxuXHRcdFx0XHRcdHJldHVybiBNaXh0X1Ntb290aFNjcm9sbC5zZXRDYWNoZSh0LCBkb2N1bWVudC5ib2R5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoIGUuY2xpZW50SGVpZ2h0ICsgMTAgPCBlLnNjcm9sbEhlaWdodCApIHtcclxuXHRcdFx0XHR2YXIgb3ZlcmZsb3cgPSBnZXRDb21wdXRlZFN0eWxlKGUsICcnKS5nZXRQcm9wZXJ0eVZhbHVlKCdvdmVyZmxvdycpO1xyXG5cdFx0XHRcdGlmICggb3ZlcmZsb3cgPT09ICdzY3JvbGwnIHx8IG92ZXJmbG93ID09PSAnYXV0bycgKSB7IHJldHVybiBNaXh0X1Ntb290aFNjcm9sbC5zZXRDYWNoZSh0LCBlKTsgfVxyXG5cdFx0XHR9XHJcblx0XHR9IHdoaWxlICggKCBlID0gZS5wYXJlbnROb2RlICkgIT09IG51bGwgKTtcclxuXHR9LFxyXG5cclxuXHR1bmlxdWVJRDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZSA9IDA7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcclxuXHRcdFx0cmV0dXJuIHQuTWl4dF9TbW9vdGhTY3JvbGwudW5pcXVlSUQgfHwgKCB0Lk1peHRfU21vb3RoU2Nyb2xsLnVuaXF1ZUlEID0gZSsrICk7XHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdGlzTm9kZU5hbWU6IGZ1bmN0aW9uKGUsIHQpIHtcclxuXHRcdHJldHVybiBlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHQudG9Mb3dlckNhc2UoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRDYWNoZTogZnVuY3Rpb24oZSwgdCkge1xyXG5cdFx0Zm9yICggdmFyIG4gPSBlLmxlbmd0aDsgbi0tOyApIE1peHRfU21vb3RoU2Nyb2xsLmNhY2hlW01peHRfU21vb3RoU2Nyb2xsLnVuaXF1ZUlEKGVbbl0pXSA9IHQ7XHJcblx0XHRyZXR1cm4gdDtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuKCBmdW5jdGlvbigkKSB7XHJcblx0XHJcblx0Ly8gUmVzaXplIHRleHQgYmFzZWQgb24gY29udGFpbmVyIHdpZHRoXHJcblx0JC5mbi5iaWdUZXh0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0dmFyIHNldHRpbmdzID0gJC5leHRlbmQoe1xyXG5cdFx0XHQncmF0aW8nOiAgIDEsXHJcblx0XHRcdCdtaW5TaXplJzogMTIsXHJcblx0XHRcdCdtYXhTaXplJzogNTEyXHJcblx0XHR9LCBvcHRpb25zKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRkYXRhICA9ICR0aGlzLmRhdGEoKSxcclxuXHRcdFx0XHRyYXRpbyA9IGRhdGEuaGFzT3duUHJvcGVydHkoJ3JhdGlvJykgPyBkYXRhLnJhdGlvIDogc2V0dGluZ3MucmF0aW8sXHJcblx0XHRcdFx0bWluICAgPSBkYXRhLmhhc093blByb3BlcnR5KCdtaW5TaXplJykgPyBkYXRhLm1pblNpemUgOiBzZXR0aW5ncy5taW5TaXplLFxyXG5cdFx0XHRcdG1heCAgID0gZGF0YS5oYXNPd25Qcm9wZXJ0eSgnbWF4U2l6ZScpID8gZGF0YS5tYXhTaXplIDogc2V0dGluZ3MubWF4U2l6ZSxcclxuXHRcdFx0XHRmaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR2YXIgY2hhcnMgPSAkdGhpcy50ZXh0KCkubGVuZ3RoICogMC41NzM3LFxyXG5cdFx0XHRcdFx0XHRzaXplID0gTWF0aC5tYXgoTWF0aC5taW4oJHRoaXMud2lkdGgoKSAqIChyYXRpbyAvIGNoYXJzKSwgcGFyc2VGbG9hdChtYXgpKSwgcGFyc2VGbG9hdChtaW4pKTtcclxuXHRcdFx0XHRcdCR0aGlzLmNzcygnZm9udC1zaXplJywgc2l6ZSk7XHJcblx0XHRcdFx0XHRpZiAoIHNpemUgPD0gbWluICkge1xyXG5cdFx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnd3JhcC10ZXh0Jyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQkdGhpcy5yZW1vdmVDbGFzcygnd3JhcC10ZXh0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnaW5pdCcpO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRmaXQoKTtcclxuXHJcblx0XHRcdCQod2luZG93KS5vbigncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgZml0KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBGaXggV1BNTCBEcm9wZG93blxyXG5cdCQoJy5tZW51LWl0ZW0tbGFuZ3VhZ2UnKS5hZGRDbGFzcygnZHJvcGRvd24gZHJvcC1tZW51JykuZmluZCgnLnN1Yi1tZW51JykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcclxuXHJcblx0Ly8gRml4IFBvbHlMYW5nIE1lbnUgSXRlbXMgQW5kIE1ha2UgVGhlbSBEcm9wZG93blxyXG5cdCQoJy5tZW51LWl0ZW0ubGFuZy1pdGVtJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG5cdHZhciBpdGVtID0gJCgnLmxhbmctaXRlbS5jdXJyZW50LWxhbmcnKTtcclxuXHRpZiAoaXRlbS5sZW5ndGggPT09IDApIHtcclxuXHRcdGl0ZW0gPSAkKCcubGFuZy1pdGVtJykuZmlyc3QoKTtcclxuXHR9XHJcblx0dmFyIGxhbmdzID0gaXRlbS5zaWJsaW5ncygnLmxhbmctaXRlbScpO1xyXG5cdGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpO1xyXG5cdGxhbmdzLndyYXBBbGwoJzx1bCBjbGFzcz1cInN1Yi1tZW51IGRyb3Bkb3duLW1lbnVcIj48L3VsPicpLnBhcmVudCgpLmFwcGVuZFRvKGl0ZW0pO1xyXG59KShqUXVlcnkpOyIsIi8qISBtb2Rlcm5penIgMy4yLjAgKEN1c3RvbSBCdWlsZCkgfCBNSVQgKlxyXG4gKiBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZC8/LWZsZXhib3gtb2JqZWN0Zml0LXNoaXYgISovXHJcbiFmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gcihlLHQpe3JldHVybiB0eXBlb2YgZT09PXR9ZnVuY3Rpb24gbygpe3ZhciBlLHQsbixvLGEsaSxzO2Zvcih2YXIgbCBpbiBDKWlmKEMuaGFzT3duUHJvcGVydHkobCkpe2lmKGU9W10sdD1DW2xdLHQubmFtZSYmKGUucHVzaCh0Lm5hbWUudG9Mb3dlckNhc2UoKSksdC5vcHRpb25zJiZ0Lm9wdGlvbnMuYWxpYXNlcyYmdC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSlmb3Iobj0wO248dC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoO24rKyllLnB1c2godC5vcHRpb25zLmFsaWFzZXNbbl0udG9Mb3dlckNhc2UoKSk7Zm9yKG89cih0LmZuLFwiZnVuY3Rpb25cIik/dC5mbigpOnQuZm4sYT0wO2E8ZS5sZW5ndGg7YSsrKWk9ZVthXSxzPWkuc3BsaXQoXCIuXCIpLDE9PT1zLmxlbmd0aD9Nb2Rlcm5penJbc1swXV09bzooIU1vZGVybml6cltzWzBdXXx8TW9kZXJuaXpyW3NbMF1daW5zdGFuY2VvZiBCb29sZWFufHwoTW9kZXJuaXpyW3NbMF1dPW5ldyBCb29sZWFuKE1vZGVybml6cltzWzBdXSkpLE1vZGVybml6cltzWzBdXVtzWzFdXT1vKSx5LnB1c2goKG8/XCJcIjpcIm5vLVwiKStzLmpvaW4oXCItXCIpKX19ZnVuY3Rpb24gYShlKXt2YXIgdD14LmNsYXNzTmFtZSxuPU1vZGVybml6ci5fY29uZmlnLmNsYXNzUHJlZml4fHxcIlwiO2lmKGImJih0PXQuYmFzZVZhbCksTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlSlNDbGFzcyl7dmFyIHI9bmV3IFJlZ0V4cChcIihefFxcXFxzKVwiK24rXCJuby1qcyhcXFxcc3wkKVwiKTt0PXQucmVwbGFjZShyLFwiJDFcIituK1wianMkMlwiKX1Nb2Rlcm5penIuX2NvbmZpZy5lbmFibGVDbGFzc2VzJiYodCs9XCIgXCIrbitlLmpvaW4oXCIgXCIrbiksYj94LmNsYXNzTmFtZS5iYXNlVmFsPXQ6eC5jbGFzc05hbWU9dCl9ZnVuY3Rpb24gaShlKXtyZXR1cm4gZS5yZXBsYWNlKC8oW2Etel0pLShbYS16XSkvZyxmdW5jdGlvbihlLHQsbil7cmV0dXJuIHQrbi50b1VwcGVyQ2FzZSgpfSkucmVwbGFjZSgvXi0vLFwiXCIpfWZ1bmN0aW9uIHMoZSx0KXtyZXR1cm4hIX4oXCJcIitlKS5pbmRleE9mKHQpfWZ1bmN0aW9uIGwoKXtyZXR1cm5cImZ1bmN0aW9uXCIhPXR5cGVvZiB0LmNyZWF0ZUVsZW1lbnQ/dC5jcmVhdGVFbGVtZW50KGFyZ3VtZW50c1swXSk6Yj90LmNyZWF0ZUVsZW1lbnROUy5jYWxsKHQsXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGFyZ3VtZW50c1swXSk6dC5jcmVhdGVFbGVtZW50LmFwcGx5KHQsYXJndW1lbnRzKX1mdW5jdGlvbiBmKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUuYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiB1KGUsdCxuKXt2YXIgbztmb3IodmFyIGEgaW4gZSlpZihlW2FdaW4gdClyZXR1cm4gbj09PSExP2VbYV06KG89dFtlW2FdXSxyKG8sXCJmdW5jdGlvblwiKT9mKG8sbnx8dCk6byk7cmV0dXJuITF9ZnVuY3Rpb24gYyhlKXtyZXR1cm4gZS5yZXBsYWNlKC8oW0EtWl0pL2csZnVuY3Rpb24oZSx0KXtyZXR1cm5cIi1cIit0LnRvTG93ZXJDYXNlKCl9KS5yZXBsYWNlKC9ebXMtLyxcIi1tcy1cIil9ZnVuY3Rpb24gZCgpe3ZhciBlPXQuYm9keTtyZXR1cm4gZXx8KGU9bChiP1wic3ZnXCI6XCJib2R5XCIpLGUuZmFrZT0hMCksZX1mdW5jdGlvbiBwKGUsbixyLG8pe3ZhciBhLGkscyxmLHU9XCJtb2Rlcm5penJcIixjPWwoXCJkaXZcIikscD1kKCk7aWYocGFyc2VJbnQociwxMCkpZm9yKDtyLS07KXM9bChcImRpdlwiKSxzLmlkPW8/b1tyXTp1KyhyKzEpLGMuYXBwZW5kQ2hpbGQocyk7cmV0dXJuIGE9bChcInN0eWxlXCIpLGEudHlwZT1cInRleHQvY3NzXCIsYS5pZD1cInNcIit1LChwLmZha2U/cDpjKS5hcHBlbmRDaGlsZChhKSxwLmFwcGVuZENoaWxkKGMpLGEuc3R5bGVTaGVldD9hLnN0eWxlU2hlZXQuY3NzVGV4dD1lOmEuYXBwZW5kQ2hpbGQodC5jcmVhdGVUZXh0Tm9kZShlKSksYy5pZD11LHAuZmFrZSYmKHAuc3R5bGUuYmFja2dyb3VuZD1cIlwiLHAuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixmPXguc3R5bGUub3ZlcmZsb3cseC5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLHguYXBwZW5kQ2hpbGQocCkpLGk9bihjLGUpLHAuZmFrZT8ocC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHApLHguc3R5bGUub3ZlcmZsb3c9Zix4Lm9mZnNldEhlaWdodCk6Yy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGMpLCEhaX1mdW5jdGlvbiBtKHQscil7dmFyIG89dC5sZW5ndGg7aWYoXCJDU1NcImluIGUmJlwic3VwcG9ydHNcImluIGUuQ1NTKXtmb3IoO28tLTspaWYoZS5DU1Muc3VwcG9ydHMoYyh0W29dKSxyKSlyZXR1cm4hMDtyZXR1cm4hMX1pZihcIkNTU1N1cHBvcnRzUnVsZVwiaW4gZSl7Zm9yKHZhciBhPVtdO28tLTspYS5wdXNoKFwiKFwiK2ModFtvXSkrXCI6XCIrcitcIilcIik7cmV0dXJuIGE9YS5qb2luKFwiIG9yIFwiKSxwKFwiQHN1cHBvcnRzIChcIithK1wiKSB7ICNtb2Rlcm5penIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfVwiLGZ1bmN0aW9uKGUpe3JldHVyblwiYWJzb2x1dGVcIj09Z2V0Q29tcHV0ZWRTdHlsZShlLG51bGwpLnBvc2l0aW9ufSl9cmV0dXJuIG59ZnVuY3Rpb24gaChlLHQsbyxhKXtmdW5jdGlvbiBmKCl7YyYmKGRlbGV0ZSBGLnN0eWxlLGRlbGV0ZSBGLm1vZEVsZW0pfWlmKGE9cihhLFwidW5kZWZpbmVkXCIpPyExOmEsIXIobyxcInVuZGVmaW5lZFwiKSl7dmFyIHU9bShlLG8pO2lmKCFyKHUsXCJ1bmRlZmluZWRcIikpcmV0dXJuIHV9Zm9yKHZhciBjLGQscCxoLHYsZz1bXCJtb2Rlcm5penJcIixcInRzcGFuXCJdOyFGLnN0eWxlOyljPSEwLEYubW9kRWxlbT1sKGcuc2hpZnQoKSksRi5zdHlsZT1GLm1vZEVsZW0uc3R5bGU7Zm9yKHA9ZS5sZW5ndGgsZD0wO3A+ZDtkKyspaWYoaD1lW2RdLHY9Ri5zdHlsZVtoXSxzKGgsXCItXCIpJiYoaD1pKGgpKSxGLnN0eWxlW2hdIT09bil7aWYoYXx8cihvLFwidW5kZWZpbmVkXCIpKXJldHVybiBmKCksXCJwZnhcIj09dD9oOiEwO3RyeXtGLnN0eWxlW2hdPW99Y2F0Y2goeSl7fWlmKEYuc3R5bGVbaF0hPXYpcmV0dXJuIGYoKSxcInBmeFwiPT10P2g6ITB9cmV0dXJuIGYoKSwhMX1mdW5jdGlvbiB2KGUsdCxuLG8sYSl7dmFyIGk9ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStlLnNsaWNlKDEpLHM9KGUrXCIgXCIrdy5qb2luKGkrXCIgXCIpK2kpLnNwbGl0KFwiIFwiKTtyZXR1cm4gcih0LFwic3RyaW5nXCIpfHxyKHQsXCJ1bmRlZmluZWRcIik/aChzLHQsbyxhKToocz0oZStcIiBcIitOLmpvaW4oaStcIiBcIikraSkuc3BsaXQoXCIgXCIpLHUocyx0LG4pKX1mdW5jdGlvbiBnKGUsdCxyKXtyZXR1cm4gdihlLG4sbix0LHIpfXZhciB5PVtdLEM9W10sRT17X3ZlcnNpb246XCIzLjIuMFwiLF9jb25maWc6e2NsYXNzUHJlZml4OlwiXCIsZW5hYmxlQ2xhc3NlczohMCxlbmFibGVKU0NsYXNzOiEwLHVzZVByZWZpeGVzOiEwfSxfcTpbXSxvbjpmdW5jdGlvbihlLHQpe3ZhciBuPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3QobltlXSl9LDApfSxhZGRUZXN0OmZ1bmN0aW9uKGUsdCxuKXtDLnB1c2goe25hbWU6ZSxmbjp0LG9wdGlvbnM6bn0pfSxhZGRBc3luY1Rlc3Q6ZnVuY3Rpb24oZSl7Qy5wdXNoKHtuYW1lOm51bGwsZm46ZX0pfX0sTW9kZXJuaXpyPWZ1bmN0aW9uKCl7fTtNb2Rlcm5penIucHJvdG90eXBlPUUsTW9kZXJuaXpyPW5ldyBNb2Rlcm5penI7dmFyIHg9dC5kb2N1bWVudEVsZW1lbnQsYj1cInN2Z1wiPT09eC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2J8fCFmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLHI9ZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGUuZG9jdW1lbnRFbGVtZW50O3JldHVybiBuLmlubmVySFRNTD1cIng8c3R5bGU+XCIrdCtcIjwvc3R5bGU+XCIsci5pbnNlcnRCZWZvcmUobi5sYXN0Q2hpbGQsci5maXJzdENoaWxkKX1mdW5jdGlvbiByKCl7dmFyIGU9Qy5lbGVtZW50cztyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZT9lLnNwbGl0KFwiIFwiKTplfWZ1bmN0aW9uIG8oZSx0KXt2YXIgbj1DLmVsZW1lbnRzO1wic3RyaW5nXCIhPXR5cGVvZiBuJiYobj1uLmpvaW4oXCIgXCIpKSxcInN0cmluZ1wiIT10eXBlb2YgZSYmKGU9ZS5qb2luKFwiIFwiKSksQy5lbGVtZW50cz1uK1wiIFwiK2UsZih0KX1mdW5jdGlvbiBhKGUpe3ZhciB0PXlbZVt2XV07cmV0dXJuIHR8fCh0PXt9LGcrKyxlW3ZdPWcseVtnXT10KSx0fWZ1bmN0aW9uIGkoZSxuLHIpe2lmKG58fChuPXQpLGMpcmV0dXJuIG4uY3JlYXRlRWxlbWVudChlKTtyfHwocj1hKG4pKTt2YXIgbztyZXR1cm4gbz1yLmNhY2hlW2VdP3IuY2FjaGVbZV0uY2xvbmVOb2RlKCk6aC50ZXN0KGUpPyhyLmNhY2hlW2VdPXIuY3JlYXRlRWxlbShlKSkuY2xvbmVOb2RlKCk6ci5jcmVhdGVFbGVtKGUpLCFvLmNhbkhhdmVDaGlsZHJlbnx8bS50ZXN0KGUpfHxvLnRhZ1Vybj9vOnIuZnJhZy5hcHBlbmRDaGlsZChvKX1mdW5jdGlvbiBzKGUsbil7aWYoZXx8KGU9dCksYylyZXR1cm4gZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7bj1ufHxhKGUpO2Zvcih2YXIgbz1uLmZyYWcuY2xvbmVOb2RlKCksaT0wLHM9cigpLGw9cy5sZW5ndGg7bD5pO2krKylvLmNyZWF0ZUVsZW1lbnQoc1tpXSk7cmV0dXJuIG99ZnVuY3Rpb24gbChlLHQpe3QuY2FjaGV8fCh0LmNhY2hlPXt9LHQuY3JlYXRlRWxlbT1lLmNyZWF0ZUVsZW1lbnQsdC5jcmVhdGVGcmFnPWUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCx0LmZyYWc9dC5jcmVhdGVGcmFnKCkpLGUuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihuKXtyZXR1cm4gQy5zaGl2TWV0aG9kcz9pKG4sZSx0KTp0LmNyZWF0ZUVsZW0obil9LGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrcigpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtOl0rL2csZnVuY3Rpb24oZSl7cmV0dXJuIHQuY3JlYXRlRWxlbShlKSx0LmZyYWcuY3JlYXRlRWxlbWVudChlKSwnYyhcIicrZSsnXCIpJ30pK1wiKTtyZXR1cm4gbn1cIikoQyx0LmZyYWcpfWZ1bmN0aW9uIGYoZSl7ZXx8KGU9dCk7dmFyIHI9YShlKTtyZXR1cm4hQy5zaGl2Q1NTfHx1fHxyLmhhc0NTU3x8KHIuaGFzQ1NTPSEhbihlLFwiYXJ0aWNsZSxhc2lkZSxkaWFsb2csZmlnY2FwdGlvbixmaWd1cmUsZm9vdGVyLGhlYWRlcixoZ3JvdXAsbWFpbixuYXYsc2VjdGlvbntkaXNwbGF5OmJsb2NrfW1hcmt7YmFja2dyb3VuZDojRkYwO2NvbG9yOiMwMDB9dGVtcGxhdGV7ZGlzcGxheTpub25lfVwiKSksY3x8bChlLHIpLGV9dmFyIHUsYyxkPVwiMy43LjNcIixwPWUuaHRtbDV8fHt9LG09L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksaD0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksdj1cIl9odG1sNXNoaXZcIixnPTAseT17fTshZnVuY3Rpb24oKXt0cnl7dmFyIGU9dC5jcmVhdGVFbGVtZW50KFwiYVwiKTtlLmlubmVySFRNTD1cIjx4eXo+PC94eXo+XCIsdT1cImhpZGRlblwiaW4gZSxjPTE9PWUuY2hpbGROb2Rlcy5sZW5ndGh8fGZ1bmN0aW9uKCl7dC5jcmVhdGVFbGVtZW50KFwiYVwiKTt2YXIgZT10LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jbG9uZU5vZGV8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnR8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNyZWF0ZUVsZW1lbnR9KCl9Y2F0Y2gobil7dT0hMCxjPSEwfX0oKTt2YXIgQz17ZWxlbWVudHM6cC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHBpY3R1cmUgcHJvZ3Jlc3Mgc2VjdGlvbiBzdW1tYXJ5IHRlbXBsYXRlIHRpbWUgdmlkZW9cIix2ZXJzaW9uOmQsc2hpdkNTUzpwLnNoaXZDU1MhPT0hMSxzdXBwb3J0c1Vua25vd25FbGVtZW50czpjLHNoaXZNZXRob2RzOnAuc2hpdk1ldGhvZHMhPT0hMSx0eXBlOlwiZGVmYXVsdFwiLHNoaXZEb2N1bWVudDpmLGNyZWF0ZUVsZW1lbnQ6aSxjcmVhdGVEb2N1bWVudEZyYWdtZW50OnMsYWRkRWxlbWVudHM6b307ZS5odG1sNT1DLGYodCksXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz1DKX0oXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGU/ZTp0aGlzLHQpO3ZhciBTPVwiTW96IE8gbXMgV2Via2l0XCIsdz1FLl9jb25maWcudXNlUHJlZml4ZXM/Uy5zcGxpdChcIiBcIik6W107RS5fY3Nzb21QcmVmaXhlcz13O3ZhciBfPWZ1bmN0aW9uKHQpe3ZhciByLG89cHJlZml4ZXMubGVuZ3RoLGE9ZS5DU1NSdWxlO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBhKXJldHVybiBuO2lmKCF0KXJldHVybiExO2lmKHQ9dC5yZXBsYWNlKC9eQC8sXCJcIikscj10LnJlcGxhY2UoLy0vZyxcIl9cIikudG9VcHBlckNhc2UoKStcIl9SVUxFXCIsciBpbiBhKXJldHVyblwiQFwiK3Q7Zm9yKHZhciBpPTA7bz5pO2krKyl7dmFyIHM9cHJlZml4ZXNbaV0sbD1zLnRvVXBwZXJDYXNlKCkrXCJfXCIrcjtpZihsIGluIGEpcmV0dXJuXCJALVwiK3MudG9Mb3dlckNhc2UoKStcIi1cIit0fXJldHVybiExfTtFLmF0UnVsZT1fO3ZhciBOPUUuX2NvbmZpZy51c2VQcmVmaXhlcz9TLnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpOltdO0UuX2RvbVByZWZpeGVzPU47dmFyIGo9e2VsZW06bChcIm1vZGVybml6clwiKX07TW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKXtkZWxldGUgai5lbGVtfSk7dmFyIEY9e3N0eWxlOmouZWxlbS5zdHlsZX07TW9kZXJuaXpyLl9xLnVuc2hpZnQoZnVuY3Rpb24oKXtkZWxldGUgRi5zdHlsZX0pLEUudGVzdEFsbFByb3BzPXYsRS50ZXN0QWxsUHJvcHM9ZyxNb2Rlcm5penIuYWRkVGVzdChcImZsZXhib3hcIixnKFwiZmxleEJhc2lzXCIsXCIxcHhcIiwhMCkpO3ZhciBUPUUucHJlZml4ZWQ9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiAwPT09ZS5pbmRleE9mKFwiQFwiKT9fKGUpOigtMSE9ZS5pbmRleE9mKFwiLVwiKSYmKGU9aShlKSksdD92KGUsdCxuKTp2KGUsXCJwZnhcIikpfTtNb2Rlcm5penIuYWRkVGVzdChcIm9iamVjdGZpdFwiLCEhVChcIm9iamVjdEZpdFwiKSx7YWxpYXNlczpbXCJvYmplY3QtZml0XCJdfSksbygpLGEoeSksZGVsZXRlIEUuYWRkVGVzdCxkZWxldGUgRS5hZGRBc3luY1Rlc3Q7Zm9yKHZhciBrPTA7azxNb2Rlcm5penIuX3EubGVuZ3RoO2srKylNb2Rlcm5penIuX3Fba10oKTtlLk1vZGVybml6cj1Nb2Rlcm5penJ9KHdpbmRvdyxkb2N1bWVudCk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbkVMRU1FTlQgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4oIGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyk7XHJcblxyXG5cclxuXHQvLyBTdGF0IC8gQ291bnRlciBFbGVtZW50XHJcblx0ZnVuY3Rpb24gbWl4dFN0YXRzKCkge1xyXG5cdFx0dmFyIHN0YXRFbGVtcyA9ICQoJy5taXh0LXN0YXQnKTtcclxuXHJcblx0XHRpZiAoIHN0YXRFbGVtcy5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdC8vIFNldCBzdGF0IHRleHQgdG8gc3RhcnRpbmcgKGZyb20pIHZhbHVlXHJcblx0XHRzdGF0RWxlbXMuZmluZCgnLnN0YXQtdmFsdWUnKS5lYWNoKCBmdW5jdGlvbigpIHsgJCh0aGlzKS50ZXh0KCQodGhpcykuZGF0YSgnZnJvbScpKTsgfSk7XHJcblxyXG5cdFx0Ly8gQW5pbWF0ZSB2YWx1ZVxyXG5cdFx0ZnVuY3Rpb24gc3RhdFZhbHVlKGVsKSB7XHJcblx0XHRcdHZhciBmcm9tICAgPSBlbC5kYXRhKCdmcm9tJyksXHJcblx0XHRcdFx0dG8gICAgID0gZWwuZGF0YSgndG8nKSxcclxuXHRcdFx0XHRzcGVlZCAgPSBlbC5kYXRhKCdzcGVlZCcpLFxyXG5cdFx0XHRcdGxpbmVhciA9IGVsLmRhdGEoJ2xpbmVhcicpO1xyXG5cdFx0XHQkKHt2YWx1ZTogZnJvbX0pLmFuaW1hdGUoe3ZhbHVlOiB0b30sIHtcclxuXHRcdFx0XHRkdXJhdGlvbjogc3BlZWQsXHJcblx0XHRcdFx0ZWFzaW5nOiAoIGxpbmVhciA9PSB0cnVlICkgPyAnbGluZWFyJyA6ICdzd2luZycsXHJcblx0XHRcdFx0c3RlcDogZnVuY3Rpb24oKSB7IGVsLnRleHQoTWF0aC5yb3VuZCh0aGlzLnZhbHVlKSk7IH0sXHJcblx0XHRcdFx0YWx3YXlzOiBmdW5jdGlvbigpIHsgZWwudGV4dCh0byk7IH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxyXG5cdFx0ZnVuY3Rpb24gc3RhdENpcmNsZShzdGF0KSB7XHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4uY2lyY2xlUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuY3NzKCdtYXJnaW4tdG9wJywgJCh0aGlzKS5oZWlnaHQoKSAvIC0yKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzdGF0RWxlbXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHN0YXQgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRzdGF0LndheXBvaW50KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XHJcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHRoaXMuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJyApIHRoaXMuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJPbmNlOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XHJcblx0XHRcdFx0XHRzdGF0Q2lyY2xlKHN0YXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0bWl4dFN0YXRzKCk7XHJcblxyXG5cclxuXHQvLyBGbGlwIENhcmQgRXF1YWxpemUgSGVpZ2h0XHJcblx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcclxuXHRcdGZsaXBjYXJkU2lkZXMuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0ZmxpcGNhcmRTaWRlcy5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gRmxpcCBDYXJkIFRvdWNoIFNjcmVlbiBcIkhvdmVyXCJcclxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XHJcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcicpO1xyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuSEVBREVSIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuKCBmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0ICovXHJcblxyXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXHJcblx0XHRtYWluTmF2ICAgPSAkKCcjbWFpbi1uYXYnKSxcclxuXHRcdG1lZGlhV3JhcCA9ICQoJy5oZWFkLW1lZGlhJyk7XHJcblxyXG5cdC8vIEhlYWQgTWVkaWEgRnVuY3Rpb25zXHJcblx0ZnVuY3Rpb24gaGVhZGVyRm4oKSB7XHJcblx0XHR2YXIgbWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXHJcblx0XHRcdHRvcE5hdkhlaWdodCA9IG1haW5OYXYub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0d3JhcEhlaWdodCAgID0gbWVkaWFXcmFwLmhlaWdodCgpLFxyXG5cdFx0XHR3cmFwT2Zmc2V0ICAgPSBtZWRpYVdyYXAub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHR2aWV3SGVpZ2h0ICAgPSB2aWV3cG9ydC5oZWlnaHQoKSAtIHdyYXBPZmZzZXQ7XHJcblxyXG5cdFx0Ly8gTWFrZSBoZWFkZXIgZnVsbHNjcmVlblxyXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcclxuXHRcdFx0dmFyIGZ1bGxIZWlnaHQgPSB2aWV3SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIGZ1bGxIZWlnaHQgLT0gdG9wTmF2SGVpZ2h0O1xyXG5cclxuXHRcdFx0bWVkaWFXcmFwLmFkZChtZWRpYUNvbnQpLmNzcygnaGVpZ2h0JywgZnVsbEhlaWdodCk7XHJcblxyXG5cdFx0Ly8gU2V0IGhlYWRlciBoZWlnaHQgdG8gdmlld3BvcnQgcGVyY2VudGFnZVxyXG5cdFx0fSBlbHNlIGlmICggbWl4dF9vcHQuaGVhZGVyLmhlaWdodC5oZWlnaHQgIT0gJycgJiYgbWl4dF9vcHQuaGVhZGVyLmhlaWdodC51bml0cyA9PSAnJScgKSB7XHJcblx0XHRcdHZhciBwZXJjZW50SGVpZ2h0ID0gcGFyc2VJbnQobWl4dF9vcHQuaGVhZGVyLmhlaWdodC5oZWlnaHQsIDEwKSAvIDEwMCAqIHZpZXdIZWlnaHQ7XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICYmICEgbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICkgcGVyY2VudEhlaWdodCAtPSB0b3BOYXZIZWlnaHQ7XHJcblxyXG5cdFx0XHRtZWRpYVdyYXAuYWRkKG1lZGlhQ29udCkuY3NzKCdoZWlnaHQnLCBwZXJjZW50SGVpZ2h0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBZGQgZGF0YSBhdHRyaWJ1dGVzIGZvciBwYXJhbGxheCBzY3JvbGxpbmdcclxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnBhcmFsbGF4ICE9ICdub25lJyApIHtcclxuXHRcdFx0dmFyIHBhcmFFbCA9IG1lZGlhV3JhcC5maW5kKCcubWVkaWEtY29udGFpbmVyLCAubHMtY29udGFpbmVyJyksXHJcblx0XHRcdFx0cGFyYUhlaWdodCA9IG1lZGlhV3JhcC5oZWlnaHQoKSArIHdyYXBPZmZzZXQsXHJcblx0XHRcdFx0b2ZmVG9wID0gJy0nK3dyYXBPZmZzZXQrJ3B4JyxcclxuXHRcdFx0XHRidG1WYWwgPSAoIG1peHRfb3B0LmhlYWRlci5wYXJhbGxheCA9PSAnc2xvdycgKSA/ICcyNSUnIDogJzgwJSc7XHJcblx0XHRcdGlmICggcGFyYUVsLmxlbmd0aCApIHtcclxuXHRcdFx0XHRtZWRpYUNvbnQuY3NzKHsndG9wJzogb2ZmVG9wLCAnaGVpZ2h0JzogcGFyYUhlaWdodCB9KTtcclxuXHRcdFx0XHRwYXJhRWwuYXR0cignZGF0YS10b3AnLCAndHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwJSwgMCknKTtcclxuXHRcdFx0XHRwYXJhRWwuYXR0cignZGF0YS10b3AtYm90dG9tJywgJ3RyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgJyArIGJ0bVZhbCArICcsIDApJyk7XHJcblxyXG5cdFx0XHRcdHZpZXdwb3J0LnRyaWdnZXIoJ3JlZnJlc2gtc2tyb2xscicsIHBhcmFFbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIG1peHRfb3B0LmhlYWRlclsnY29udGVudC1mYWRlJ10gKSB7XHJcblx0XHRcdHZhciBjb250ZW50ID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcuY29udGFpbmVyJyk7XHJcblx0XHRcdGlmICggY29udGVudC5sZW5ndGggKSB7XHJcblx0XHRcdFx0Y29udGVudC5hdHRyKCdkYXRhLScrd3JhcE9mZnNldCsnLXRvcCcsICdvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAlLCAwKTsnKTtcclxuXHRcdFx0XHRjb250ZW50LmF0dHIoJ2RhdGEtLTIwMC10b3AtYm90dG9tJywgJ29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgODAlLCAwKTsnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBQcmV2ZW50IGNvbnRlbnQgZmFkZSBpZiBoZWFkZXIgaXMgdGFsbGVyIHRoYW4gdmlld3BvcnRcclxuXHRcdFx0aWYgKCB3cmFwSGVpZ2h0ID4gdmlld0hlaWdodCApIHtcclxuXHRcdFx0XHRtZWRpYVdyYXAuYWRkQ2xhc3MoJ25vLWZhZGUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZWRpYVdyYXAucmVtb3ZlQ2xhc3MoJ25vLWZhZGUnKTtcclxuXHRcdFx0XHR2aWV3cG9ydC50cmlnZ2VyKCdyZWZyZXNoLXNrcm9sbHInLCBjb250ZW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gSGVhZGVyIFNjcm9sbCBUbyBDb250ZW50XHJcblx0ZnVuY3Rpb24gaGVhZGVyU2Nyb2xsKCkge1xyXG5cdFx0dmFyIHBhZ2UgICA9ICQoJ2h0bWwsIGJvZHknKSxcclxuXHRcdFx0b2Zmc2V0ID0gJCgnI2NvbnRlbnQtd3JhcCcpLm9mZnNldCgpLnRvcCArIDE7XHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7IG9mZnNldCAtPSBtYWluTmF2Lm91dGVySGVpZ2h0KCk7IH1cclxuXHRcdCQoJy5oZWFkZXItc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHBhZ2UuYW5pbWF0ZSh7IHNjcm9sbFRvcDogb2Zmc2V0IH0sIDgwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmICggbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgJiYgbWVkaWFXcmFwLmxlbmd0aCApIHtcclxuXHRcdGhlYWRlckZuKCk7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuc2Nyb2xsICkgeyBoZWFkZXJTY3JvbGwoKTsgfVxyXG5cclxuXHRcdCQoZG9jdW1lbnQpLnJlYWR5KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCAhIHdpbmRvdy5tb2JpbGVDaGVjaygpICkge1xyXG5cdFx0XHRcdCQod2luZG93KS5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgaGVhZGVyRm4gKSApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQod2luZG93KS5vbignb3JpZW50YXRpb25jaGFuZ2UnLCBoZWFkZXJGbiApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5IRUxQRVIgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4oIGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvLyBTa2lwIExpbmsgRm9jdXMgRml4XHJcblx0XHJcblx0dmFyIGlzX3dlYmtpdCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd3ZWJraXQnKSA+IC0xLFxyXG5cdFx0aXNfb3BlcmEgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ29wZXJhJykgID4gLTEsXHJcblx0XHRpc19pZSAgICAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignbXNpZScpICAgPiAtMTtcclxuXHJcblx0aWYgKCAoIGlzX3dlYmtpdCB8fCBpc19vcGVyYSB8fCBpc19pZSApICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICkgKSB7XHJcblx0XHR2YXIgZXZlbnRNZXRob2QgPSAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnO1xyXG5cdFx0d2luZG93WyBldmVudE1ldGhvZCBdKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsb2NhdGlvbi5oYXNoLnN1YnN0cmluZyggMSApICk7XHJcblxyXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XHJcblx0XHRcdFx0aWYgKCAhIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhfGRpdikkL2kudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIGZhbHNlICk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gQXBwbHkgQm9vdHN0cmFwIENsYXNzZXNcclxuXHRcclxuXHR2YXIgd29vQ29tbVdyYXAgPSAkKCcud29vY29tbWVyY2UnKTtcclxuXHRcclxuXHR2YXIgd2lkZ2V0TmF2TWVudXMgPSAnLndpZGdldF9tZXRhLCAud2lkZ2V0X3JlY2VudF9lbnRyaWVzLCAud2lkZ2V0X2FyY2hpdmUsIC53aWRnZXRfY2F0ZWdvcmllcywgLndpZGdldF9uYXZfbWVudSwgLndpZGdldF9wYWdlcywgLndpZGdldF9yc3MnO1xyXG5cclxuXHQvLyBXb29Db21tZXJjZSBXaWRnZXRzICYgRWxlbWVudHNcclxuXHRpZiAoIHdvb0NvbW1XcmFwLmxlbmd0aCApIHtcclxuXHRcdHdpZGdldE5hdk1lbnVzICs9ICcsIC53aWRnZXRfcHJvZHVjdF9jYXRlZ29yaWVzLCAud2lkZ2V0X3Byb2R1Y3RzLCAud2lkZ2V0X3RvcF9yYXRlZF9wcm9kdWN0cywgLndpZGdldF9yZWNlbnRfcmV2aWV3cywgLndpZGdldF9yZWNlbnRseV92aWV3ZWRfcHJvZHVjdHMsIC53aWRnZXRfbGF5ZXJlZF9uYXYnO1xyXG5cclxuXHRcdHdvb0NvbW1XcmFwLmZpbmQoJy5zaG9wX3RhYmxlJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLWJvcmRlcmVkJyk7XHJcblxyXG5cdFx0JChkb2N1bWVudC5ib2R5KS5vbigndXBkYXRlZF9jaGVja291dCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuc2hvcF90YWJsZScpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1zdHJpcGVkJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdCQod2lkZ2V0TmF2TWVudXMpLmNoaWxkcmVuKCd1bCcpLmFkZENsYXNzKCduYXYnKTtcclxuXHQkKCcud2lkZ2V0X25hdl9tZW51IHVsLm1lbnUnKS5hZGRDbGFzcygnbmF2Jyk7XHJcblxyXG5cdCQoJyN3cC1jYWxlbmRhcicpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkJyk7XHJcblxyXG5cclxuXHQvLyBIYW5kbGUgUG9zdCBDb3VudCBUYWdzXHJcblxyXG5cdCQoJy53aWRnZXRfYXJjaGl2ZSBsaSwgLndpZGdldF9jYXRlZ29yaWVzIGxpJykuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcclxuXHRcdFx0Y2hpbGRyZW4gID0gJHRoaXMuY2hpbGRyZW4oKSxcclxuXHRcdFx0YW5jaG9yICAgID0gY2hpbGRyZW4uZmlsdGVyKCdhJyksXHJcblx0XHRcdGNvbnRlbnRzICA9ICR0aGlzLmNvbnRlbnRzKCksXHJcblx0XHRcdGNvdW50VGV4dCA9IGNvbnRlbnRzLm5vdChjaGlsZHJlbikudGV4dCgpO1xyXG5cclxuXHRcdGlmICggY291bnRUZXh0ICE9PSAnJyApIHtcclxuXHRcdFx0YW5jaG9yLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJwb3N0LWNvdW50XCI+JyArIGNvdW50VGV4dCArICc8L3NwYW4+Jyk7XHJcblx0XHRcdGNvbnRlbnRzLmZpbHRlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDM7IFxyXG5cdFx0XHR9KS5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JCgnLndpZGdldC53b29jb21tZXJjZSBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0Y291bnQgPSAkdGhpcy5jaGlsZHJlbignLmNvdW50JyksXHJcblx0XHRcdGxpbmsgID0gJHRoaXMuY2hpbGRyZW4oJ2EnKTtcclxuXHRcdGNvdW50LmFwcGVuZFRvKGxpbmspO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gR2FsbGVyeSBBcnJvdyBOYXZpZ2F0aW9uXHJcblxyXG5cdCQoZG9jdW1lbnQpLmtleWRvd24oIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciB1cmwgPSBmYWxzZTtcclxuXHRcdGlmICggZS53aGljaCA9PT0gMzcgKSB7ICAvLyBMZWZ0IGFycm93IGtleSBjb2RlXHJcblx0XHRcdHVybCA9ICQoJy5wcmV2aW91cy1pbWFnZSBhJykuYXR0cignaHJlZicpO1xyXG5cdFx0fSBlbHNlIGlmICggZS53aGljaCA9PT0gMzkgKSB7ICAvLyBSaWdodCBhcnJvdyBrZXkgY29kZVxyXG5cdFx0XHR1cmwgPSAkKCcuZW50cnktYXR0YWNobWVudCBhJykuYXR0cignaHJlZicpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCB1cmwgJiYgKCAhICQoJ3RleHRhcmVhLCBpbnB1dCcpLmlzKCc6Zm9jdXMnKSApICkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmw7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBEZXRlY3QgTW9iaWxlXHJcblxyXG5cdHdpbmRvdy5tb2JpbGVDaGVjayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNoZWNrID0gZmFsc2U7XHJcblx0XHQoIGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0aWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpfHwvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsNCkpKSB7XHJcblx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmEpO1xyXG5cdFx0cmV0dXJuIGNoZWNrO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIERldGVjdCBJRSBWZXJzaW9uXHJcblxyXG5cdGZ1bmN0aW9uIGRldGVjdElFKCkge1xyXG5cdFx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG5cdFx0Ly8gSUUgMTAgb3Igb2xkZXJcclxuXHRcdHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKTtcclxuXHRcdGlmICggbXNpZSA+IDAgKSB7IHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKTsgfVxyXG5cclxuXHRcdC8vIElFIDExXHJcblx0XHR2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XHJcblx0XHRpZiAoIHRyaWRlbnQgPiAwICkge1xyXG5cdFx0XHR2YXIgcnYgPSB1YS5pbmRleE9mKCdydjonKTtcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhydiArIDMsIHVhLmluZGV4T2YoJy4nLCBydikpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRWRnZSAoSUUgMTIrKVxyXG5cdFx0dmFyIGVkZ2UgPSB1YS5pbmRleE9mKCdFZGdlLycpO1xyXG5cdFx0aWYgKCBlZGdlID4gMCApIHsgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZignLicsIGVkZ2UpKSwgMTApOyB9XHJcblxyXG5cdFx0Ly8gT3RoZXIgYnJvd3NlcnNcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0dmFyIElFX3ZlciA9IGRldGVjdElFKCk7XHJcblx0aWYgKCBJRV92ZXIgKSB7ICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUgaWUnK0lFX3Zlcik7IH1cclxuXHJcbn0pKGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbk5BVkJBUiBGVU5DVElPTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiggZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgY29sb3JMb0QsIGNvbG9yVG9SZ2JhICovXHJcblxyXG5cdHZhciB2aWV3cG9ydCAgICAgPSAkKHdpbmRvdyksXHJcblx0XHRib2R5RWwgICAgICAgPSAkKCdib2R5JyksXHJcblx0XHRtYWluV3JhcCAgICAgPSAkKCcjbWFpbi13cmFwJyksXHJcblx0XHRtYWluTmF2V3JhcCAgPSAkKCcjbWFpbi1uYXYtd3JhcCcpLFxyXG5cdFx0bWFpbk5hdkJhciAgID0gJCgnI21haW4tbmF2JyksXHJcblx0XHRtYWluTmF2Q29udCAgPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXHJcblx0XHRtYWluTmF2SGVhZCAgPSAkKCcubmF2YmFyLWhlYWRlcicsIG1haW5OYXZCYXIpLFxyXG5cdFx0bWFpbk5hdklubmVyID0gJCgnLm5hdmJhci1pbm5lcicsIG1haW5OYXZCYXIpLFxyXG5cdFx0c2VjTmF2QmFyICAgID0gJCgnI3NlY29uZC1uYXYnKSxcclxuXHRcdHNlY05hdkNvbnQgICA9IHNlY05hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxyXG5cdFx0bmF2YmFycyAgICAgID0gJCgnLm5hdmJhcicpLFxyXG5cdFx0bWVkaWFXcmFwICAgID0gJCgnLmhlYWQtbWVkaWEnKTtcclxuXHJcblx0aWYgKCBtYWluTmF2QmFyLmxlbmd0aCA9PT0gMCApIHJldHVybjtcclxuXHJcblx0dmFyIE5hdmJhciA9IHtcclxuXHJcblx0XHRuYXZCZzogJycsXHJcblx0XHRuYXZCZ1RvcDogJycsXHJcblxyXG5cdFx0Ly8gSW5pdGlhbGl6ZSBOYXZiYXJcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKG5hdmJhcikge1xyXG5cdFx0XHR2YXIgZGF0YUNvbnQgPSBuYXZiYXIuZmluZCgnLm5hdmJhci1kYXRhJyksXHJcblx0XHRcdFx0YmdDb2xvciAgPSAoIG5hdmJhci5pcyhtYWluTmF2QmFyKSApID8gZGF0YUNvbnQuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJykgOiBuYXZiYXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyksXHJcblx0XHRcdFx0Y29sb3JMdW0gPSBkYXRhQ29udC5sZW5ndGggPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkYXRhQ29udFswXSwgJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpIDogJyc7XHJcblxyXG5cdFx0XHRpZiAoIGNvbG9yTHVtICE9ICdkYXJrJyAmJiBjb2xvckx1bSAhPSAnbGlnaHQnICkgY29sb3JMdW0gPSBjb2xvckxvRChiZ0NvbG9yKTtcclxuXHJcblx0XHRcdGlmICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkge1xyXG5cclxuXHRcdFx0XHR0aGlzLm5hdkJnID0gKCBjb2xvckx1bSA9PSAnZGFyaycgKSA/ICdiZy1kYXJrJyA6ICdiZy1saWdodCc7XHJcblx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKHRoaXMubmF2QmcpO1xyXG5cclxuXHRcdFx0XHRtYWluTmF2QmFyLmF0dHIoJ2RhdGEtYmcnLCBjb2xvckx1bSk7XHJcblxyXG5cdFx0XHRcdHZhciBuYXZTaGVldCA9ICQoJzxzdHlsZSBkYXRhLWlkPVwibWl4dC1uYXYtY3NzXCI+Jyk7XHJcblxyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCAhPSAndmVydGljYWwnICkge1xyXG5cdFx0XHRcdFx0bmF2U2hlZXQuYXBwZW5kKCcjbWFpbi1uYXYubmF2YmFyLW1peHQ6bm90KC5wb3NpdGlvbi10b3ApIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXYub3BhY2l0eSkrJzsgfScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XHJcblx0XHRcdFx0XHRuYXZTaGVldC5hcHBlbmQoJy5uYXYtdHJhbnNwYXJlbnQgI21haW4tbmF2Lm5hdmJhci1taXh0LnBvc2l0aW9uLXRvcCB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JUb1JnYmEoYmdDb2xvciwgbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddKSsnOyB9Jyk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddIDw9IDAuNCApIHtcclxuXHRcdFx0XHRcdFx0aWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWRhcmsnKSApIHsgdGhpcy5uYXZCZ1RvcCA9ICdiZy1kYXJrJzsgfVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmICggbWVkaWFXcmFwLmhhc0NsYXNzKCdiZy1saWdodCcpICkgeyB0aGlzLm5hdkJnVG9wID0gJ2JnLWxpZ2h0JzsgfVxyXG5cdFx0XHRcdFx0XHRlbHNlIHsgdGhpcy5uYXZCZ1RvcCA9IHRoaXMubmF2Qmc7IH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5LnRvZ2dsZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLm5hdkJnVG9wID0gdGhpcy5uYXZCZztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ3N0YXRpYycgKSB7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKHRoaXMubmF2QmcpLmFkZENsYXNzKHRoaXMubmF2QmdUb3ApO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG5hdlNoZWV0Lmh0bWwoKSAhPSAnJyApIHtcclxuXHRcdFx0XHRcdG5hdlNoZWV0LmFwcGVuZFRvKCQoJ2hlYWQnKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICggY29sb3JMdW0gPT0gJ2RhcmsnICkge1xyXG5cdFx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKCdiZy1kYXJrJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG5hdmJhci5hZGRDbGFzcygnYmctbGlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uc1xyXG5cdFx0c3RpY2t5OiB7XHJcblx0XHRcdGlzTW9iaWxlOiBmYWxzZSxcclxuXHRcdFx0b2Zmc2V0OiAwLFxyXG5cdFx0XHRzY3JvbGxDb3JyZWN0aW9uOiAwLFxyXG5cclxuXHRcdFx0Ly8gVHJpZ2dlciBvciB1cGRhdGUgc3RpY2t5IHN0YXRlXHJcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGlzTW9iaWxlKSB7XHJcblx0XHRcdFx0TmF2YmFyLnN0aWNreS5vZmZzZXQgPSAwO1xyXG5cdFx0XHRcdE5hdmJhci5zdGlja3kuaXNNb2JpbGUgPSBpc01vYmlsZTtcclxuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnNjcm9sbENvcnJlY3Rpb24gPSBwYXJzZUludChtYWluV3JhcC5vZmZzZXQoKS50b3AsIDEwKTtcclxuXHJcblx0XHRcdFx0aWYgKCBpc01vYmlsZSA9PT0gZmFsc2UgJiYgKCBtaXh0X29wdC5uYXYubGF5b3V0ID09ICd2ZXJ0aWNhbCcgfHwgKCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0IC0gdmlld3BvcnQuaGVpZ2h0KCkgKSA+IDE2MCApICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5kYXRhKCdmaXhlZCcsIHRydWUpO1xyXG5cdFx0XHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsICQudGhyb3R0bGUoNTAsIE5hdmJhci5zdGlja3kudG9nZ2xlKSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIuZGF0YSgnZml4ZWQnLCBmYWxzZSk7XHJcblx0XHRcdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIE5hdmJhci5zdGlja3kudG9nZ2xlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAnaG9yaXpvbnRhbCcgJiYgbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xyXG5cdFx0XHRcdFx0TmF2YmFyLnN0aWNreS5vZmZzZXQgPSBtYWluTmF2QmFyLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRvZ2dsZSgpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8gVG9nZ2xlIHN0aWNreSBzdGF0ZVxyXG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBuYXZQb3MgICAgPSBtYWluTmF2V3JhcC5vZmZzZXQoKS50b3AgLSBOYXZiYXIuc3RpY2t5Lm9mZnNldCxcclxuXHRcdFx0XHRcdHNjcm9sbFZhbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gTmF2YmFyLm5hdkJnVG9wO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxWYWwgPSAoIE5hdmJhci5zdGlja3kuaXNNb2JpbGUgPT09IHRydWUgKSA/IDAgOiBzY3JvbGxWYWwgKyBOYXZiYXIuc3RpY2t5LnNjcm9sbENvcnJlY3Rpb247XHJcblxyXG5cdFx0XHRcdGlmICggbWFpbk5hdkJhci5oYXNDbGFzcygnc2xpZGUtYmctZGFyaycpICkgeyBiZ1RvcENscyA9ICdiZy1kYXJrJzsgfVxyXG5cdFx0XHRcdGVsc2UgaWYgKCBtYWluTmF2QmFyLmhhc0NsYXNzKCdzbGlkZS1iZy1saWdodCcpICYmICggTmF2YmFyLm5hdkJnICE9ICdiZy1kYXJrJyB8fCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPD0gMC40ICkgKSB7IGJnVG9wQ2xzID0gJ2JnLWxpZ2h0JzsgfVxyXG5cclxuXHRcdFx0XHRpZiAoIHNjcm9sbFZhbCA+IG5hdlBvcyAmJiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgIT0gJ3ZlcnRpY2FsJyB8fCAhIE5hdmJhci5zdGlja3kuaXNNb2JpbGUgKSApIHsgIFxyXG5cdFx0XHRcdFx0Ym9keUVsLmFkZENsYXNzKCdmaXhlZC1uYXYnKTtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKE5hdmJhci5uYXZCZyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGJvZHlFbC5yZW1vdmVDbGFzcygnZml4ZWQtbmF2Jyk7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKE5hdmJhci5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTWVudSBGdW5jdGlvbnNcclxuXHRcdG1lbnU6IHtcclxuXHJcblx0XHRcdC8vIFByZXZlbnQgbmF2YmFyIHN1Ym1lbnUgb3ZlcmZsb3cgb3V0IG9mIHZpZXdwb3J0XHJcblx0XHRcdG92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcclxuXHRcdFx0XHR2YXIgbmF2YmFyT2ZmID0gMCxcclxuXHRcdFx0XHRcdG1haW5TdWIgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudSAuZHJvcGRvd24tbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiAuc3ViLW1lbnUsIC5tZWdhLW1lbnUtY29sdW1uID4gYScpO1xyXG5cclxuXHRcdFx0XHRpZiAoIG5hdmJhci5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdFx0bmF2YmFyT2ZmID0gbmF2YmFyLm91dGVyV2lkdGgoKSArIHBhcnNlSW50KG5hdmJhci5vZmZzZXQoKS5sZWZ0LCAxMCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBSZXNldCBtb2JpbGUgYWRqdXN0bWVudHNcclxuXHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcclxuXHJcblx0XHRcdFx0Ly8gUGVyZm9ybSBtZW51IG92ZXJmbG93IGNoZWNrc1xyXG5cdFx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgc3ViICAgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0XHR0b3BTdWIgICA9IHN1YixcclxuXHRcdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXHJcblx0XHRcdFx0XHRcdHN1YlBvcyAgID0gcGFyc2VJbnQoc3ViLm9mZnNldCgpLmxlZnQsIDEwKSxcclxuXHRcdFx0XHRcdFx0c3ViVyAgICAgPSBzdWIub3V0ZXJXaWR0aCgpICsgMSxcclxuXHRcdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxyXG5cdFx0XHRcdFx0XHRuZXN0U3VicyA9IHN1Yi5jaGlsZHJlbignLmRyb3Atc3VibWVudScpLFxyXG5cdFx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSBuZXN0U3VicyxcclxuXHRcdFx0XHRcdFx0Y29ycmVjdGlvbjtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHN1YlBhci5pcygnLm1lZ2EtbWVudS1jb2x1bW4nKSApIHtcclxuXHRcdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XHJcblx0XHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IHRvcFN1Yi5maW5kKCcubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQoNG4pIC5kcm9wLXN1Ym1lbnUsIC5tZWdhLW1lbnUtY29sdW1uOm50aC1jaGlsZChuLTQpOmxhc3QtY2hpbGQgLmRyb3Atc3VibWVudScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIFRvcCBMZXZlbCBTdWJtZW51c1xyXG5cdFx0XHRcdFx0aWYgKCBuZXN0T2ZmID4gbmF2YmFyT2ZmICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XHJcblx0XHRcdFx0XHRcdGNvcnJlY3Rpb24gPSAobmVzdE9mZiAtIG5hdmJhck9mZiAtIDIpICogLTE7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cclxuXHJcblx0XHRcdFx0XHRcdGlmICggbmF2YmFyLmhhc0NsYXNzKCdib3JkZXJlZCcpIHx8IG5hdmJhci5wYXJlbnRzKCcubmF2YmFyJykuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgKSB7IGNvcnJlY3Rpb24gLT0gMTsgfVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCBjb3JyZWN0aW9uIDwgbWdOb3cgKSB7XHJcblx0XHRcdFx0XHRcdFx0dG9wU3ViLmNzcygnbWFyZ2luLWxlZnQnLCBjb3JyZWN0aW9uICsgJ3B4Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0TmF2YmFyLm1lbnUuc2V0RHJvcExlZnQob3ZlcmZsb3dpbmdTdWJzKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBOZXN0ZWQgU3VibWVudXNcclxuXHRcdFx0XHRcdG5lc3RTdWJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0XHRuZXN0U3Vic1cgPSBbXTtcclxuXHRcdFx0XHRcdFx0c3ViTm93LmZpbmQoJy5zdWItbWVudTpub3QoOmhhcyguZHJvcC1zdWJtZW51KSknKS5tYXAoIGZ1bmN0aW9uKGkpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50cyAgPSAkdGhpcy5wYXJlbnRzKCcuc3ViLW1lbnUnKSxcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXID0gMDtcclxuXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgKz0gJCh0aGlzKS5vdXRlcldpZHRoKCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdG5lc3RTdWJzV1tpXSA9ICR0aGlzLm91dGVyV2lkdGgoKSArIHBhcmVudHNXO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBtYXhOZXN0VyA9ICQuaXNFbXB0eU9iamVjdChuZXN0U3Vic1cpID8gMCA6IE1hdGgubWF4LmFwcGx5KG51bGwsIG5lc3RTdWJzVyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIChuZXN0T2ZmICsgbWF4TmVzdFcpID49IG1haW5XcmFwLndpZHRoKCkgKSB7XHJcblx0XHRcdFx0XHRcdFx0TmF2YmFyLm1lbnUuc2V0RHJvcExlZnQoc3ViTm93KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHROYXZiYXIubWVudS5yZXNldEFycm93KHN1Yk5vdyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBTZXQgbWVudSBkcm9wIGxlZnRcclxuXHRcdFx0c2V0RHJvcExlZnQ6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG5cdFx0XHRcdHRhcmdldC5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcC1sZWZ0Jyk7XHJcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XHJcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcclxuXHRcdFx0XHRcdHRhcmdldC5maW5kKCcuZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBSZXNldCBtZW51IGRyb3BcclxuXHRcdFx0cmVzZXRBcnJvdzogZnVuY3Rpb24odGFyZ2V0KSB7XHJcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQnKTtcclxuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcclxuXHRcdFx0XHRcdHRhcmdldC5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdC8vIE1lZ2EgbWVudSBlbmFibGUgLyBkaXNhYmxlXHJcblx0XHRcdG1lZ2FNZW51VG9nZ2xlOiBmdW5jdGlvbih0b2dnbGUsIG5hdmJhcikge1xyXG5cdFx0XHRcdHZhciBtZWdhTWVudXM7XHJcblxyXG5cdFx0XHRcdGlmICggdG9nZ2xlID09ICdlbmFibGUnICkge1xyXG5cdFx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5kcm9wLW1lbnVbZGF0YS1tZWdhLW1lbnU9XCJ0cnVlXCJdJyk7XHJcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHZhciBtZWdhTWVudSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5hZGRDbGFzcygnbWVnYS1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbWVudScpLnJlbW92ZUF0dHIoJ2RhdGEtbWVnYS1tZW51Jyk7XHJcblx0XHRcdFx0XHRcdCQoJz4gLnN1Yi1tZW51ID4gLmRyb3Atc3VibWVudScsIG1lZ2FNZW51KS5yZW1vdmVDbGFzcygnZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICggdG9nZ2xlID09ICdkaXNhYmxlJyApIHtcclxuXHRcdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcubWVnYS1tZW51Jyk7XHJcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHZhciBtZWdhTWVudSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5yZW1vdmVDbGFzcygnbWVnYS1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbWVudScpLmF0dHIoJ2RhdGEtbWVnYS1tZW51JywgJ3RydWUnKTtcclxuXHRcdFx0XHRcdFx0bWVnYU1lbnUuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW4nKS5yZW1vdmVDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpLmFkZENsYXNzKCdkcm9wLXN1Ym1lbnUnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8gQ3JlYXRlIG1lZ2EgbWVudSByb3dzIGlmIHRoZXJlIGFyZSBtb3JlIHRoYW4gNCBjb2x1bW5zXHJcblx0XHRcdG1lZ2FNZW51Um93czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bWFpbldyYXAuZmluZCgnLm1lZ2EtbWVudScpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG1haW5NZW51ID0gJCh0aGlzKS5jaGlsZHJlbignLnN1Yi1tZW51JyksXHJcblx0XHRcdFx0XHRcdGNvbHVtbnMgID0gbWFpbk1lbnUuY2hpbGRyZW4oJy5tZWdhLW1lbnUtY29sdW1uJyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBjb2x1bW5zLmxlbmd0aCA+IDQgKSBtYWluTWVudS5hZGRDbGFzcygnbXVsdGktcm93Jyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIE1vYmlsZSBGdW5jdGlvbnNcclxuXHRcdG1vYmlsZToge1xyXG5cclxuXHRcdFx0ZGV2aWNlOiBudWxsLFxyXG5cclxuXHRcdFx0Ly8gVHJpZ2dlciBtb2JpbGUgZnVuY3Rpb25zXHJcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGRldmljZSkge1xyXG5cdFx0XHRcdE5hdmJhci5tb2JpbGUuZGV2aWNlID0gZGV2aWNlO1xyXG5cclxuXHRcdFx0XHQkKCcuZHJvcGRvd24tdG9nZ2xlID4gLmRyb3AtYXJyb3cnLCBtYWluTmF2QmFyKS5kYXRhKCduby1oYXNoLXNjcm9sbCcsIHRydWUpO1xyXG5cclxuXHRcdFx0XHQvLyBTaG93L2hpZGUgc3VibWVudXMgb24gaGFuZGxlIGNsaWNrXHJcblx0XHRcdFx0JCgnLmRyb3Bkb3duLXRvZ2dsZScsIG1haW5OYXZCYXIpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmICggJChldmVudC50YXJnZXQpLmlzKCcuZHJvcC1hcnJvdycpICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIGV2ZW50LmhhbmRsZWQgIT09IHRydWUgKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdFx0XHRtZW51ICAgPSBoYW5kbGUuY2xvc2VzdCgnLm1lbnUtaXRlbScpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIG1lbnUuaGFzQ2xhc3MoJ2V4cGFuZCcpICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0bWVudS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcblx0XHRcdFx0XHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWVudSkucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRtZW51LmFkZENsYXNzKCdleHBhbmQnKS5zaWJsaW5ncygnbGknKS5yZW1vdmVDbGFzcygnZXhwYW5kJykuZmluZCgnLmV4cGFuZCcpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdE5hdmJhci5tb2JpbGUuc2Nyb2xsTmF2KCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGV2ZW50LmhhbmRsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWFpbk5hdkJhcikucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxOYXYoKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxOYXYoKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHNjcm9sbFBvczogMCxcclxuXHJcblx0XHRcdC8vIEVuYWJsZSBuYXYgc2Nyb2xsaW5nIGlmIG5hdmJhciBoZWlnaHQgPiB2aWV3cG9ydFxyXG5cdFx0XHRzY3JvbGxOYXY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBOYXZiYXIubW9iaWxlLmRldmljZSA9PSAndGFibGV0JyApIHtcclxuXHRcdFx0XHRcdHZhciB2aWV3cG9ydEggICAgID0gdmlld3BvcnQuaGVpZ2h0KCksXHJcblx0XHRcdFx0XHRcdG5hdmJhckhlYWRlckggPSBtYWluTmF2SGVhZC5oZWlnaHQoKSArIDEsXHJcblx0XHRcdFx0XHRcdG5hdmJhcklubmVySCAgPSBtYWluTmF2SW5uZXIuaGFzQ2xhc3MoJ2luJykgPyBtYWluTmF2SW5uZXIuaGVpZ2h0KCkgOiAwLFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJIICAgICAgID0gbmF2YmFySGVhZGVySCArIG5hdmJhcklubmVySCxcclxuXHRcdFx0XHRcdFx0bmF2YmFyVG9wICAgICA9IG1haW5OYXZCYXIub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wO1xyXG5cclxuXHRcdFx0XHRcdE5hdmJhci5tb2JpbGUuc2Nyb2xsUG9zID0gdmlld3BvcnQuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5wYWdlWydzaG93LWFkbWluLWJhciddICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgYWRtaW5CYXJIID0gJCgnI3dwYWRtaW5iYXInKS5oZWlnaHQoKTtcclxuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XHJcblx0XHRcdFx0XHRcdG5hdndyYXBUb3AgLT0gYWRtaW5CYXJIO1xyXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgIC09IGFkbWluQmFySDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG5hdmJhckggPiB2aWV3cG9ydEggKSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIG1haW5OYXZCYXIubm90KCdzdG9wcGVkJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygnc3RvcHBlZCcpLmNzcyh7ICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsICd0b3AnOiAobmF2YmFyVG9wIC0gbmF2d3JhcFRvcCkgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgTmF2YmFyLm1vYmlsZS5zdG9wU2Nyb2xsKTtcclxuXHRcdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8gUHJldmVudCBzY3JvbGxpbmcgYWJvdmUgbmF2YmFyXHJcblx0XHRcdHN0b3BTY3JvbGw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB2aWV3U2Nyb2xsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRzdG9wU2Nyb2xsID0gbWFpbk5hdkJhci5oYXNDbGFzcygnc3RvcHBlZCcpO1xyXG5cdFx0XHRcdGlmICggTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPiBtYWluTmF2SGVhZC5vZmZzZXQoKS50b3AgKSB7IHN0b3BTY3JvbGwgPSBmYWxzZTsgfVxyXG5cdFx0XHRcdGlmICggTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPiB2aWV3U2Nyb2xsICYmIHN0b3BTY3JvbGwgKSB7IHZpZXdwb3J0LnNjcm9sbFRvcChOYXZiYXIubW9iaWxlLnNjcm9sbFBvcyk7IH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHROYXZiYXIuaW5pdCgkKHRoaXMpKTtcclxuXHR9KTtcclxuXHRcclxuXHROYXZiYXIubWVudS5tZWdhTWVudVJvd3MoKTtcclxuXHJcblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnc3R5bGVbZGF0YS1pZD1cIm1peHQtbmF2LWNzc1wiXScpLnJlbW92ZSgpO1xyXG5cdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcygnYmctbGlnaHQgYmctZGFyaycpO1xyXG5cdFx0TmF2YmFyLmluaXQobWFpbk5hdkJhcik7XHJcblxyXG5cdH0pO1xyXG5cclxuXHRzZWNOYXZCYXIub24oJ3JlZnJlc2gnLCBmdW5jdGlvbigpIHtcclxuXHRcdHNlY05hdkJhci5yZW1vdmVDbGFzcygnYmctbGlnaHQgYmctZGFyaycpO1xyXG5cdFx0TmF2YmFyLmluaXQoc2VjTmF2QmFyKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIENoZWNrIHdoaWNoIG1lZGlhIHF1ZXJpZXMgYXJlIGFjdGl2ZVxyXG5cdHZhciBtcUNoZWNrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhci1kYXRhJyksICc6YWZ0ZXInKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBFbmFibGUgbWVudSBob3ZlciBvbiB0b3VjaCBzY3JlZW5zXHJcblx0dmFyIG1lbnVQYXJlbnRzID0gbmF2YmFycy5maW5kKCcubWVudS1pdGVtLWhhcy1jaGlsZHJlbjpub3QoLm1lZ2EtbWVudS1jb2x1bW4pLCBsaS5kcm9wZG93bicpO1xyXG5cdGZ1bmN0aW9uIG1lbnVUb3VjaEhvdmVyKGV2ZW50KSB7XHJcblx0XHR2YXIgaXRlbSA9ICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLFxyXG5cdFx0XHRhbmNlc3RvcnMgPSBpdGVtLnBhcmVudHMoJy5ob3ZlcicpO1xyXG5cdFx0aWYgKCBpdGVtLmhhc0NsYXNzKCdob3ZlcicpICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoJ2hvdmVyJyk7XHJcblx0XHRcdG1lbnVQYXJlbnRzLm5vdChpdGVtKS5ub3QoYW5jZXN0b3JzKS5yZW1vdmVDbGFzcygnaG92ZXInKTtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBtZW51VG91Y2hSZW1vdmVIb3ZlcihldmVudCkge1xyXG5cdFx0aWYgKCAhICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLmlzKG1lbnVQYXJlbnRzKSAmJiAhICQoZXZlbnQudGFyZ2V0KS5pcygnaW5wdXQnKSApIHsgbWVudVBhcmVudHMucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7IH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBFbnN1cmUgdmVydGljYWwgbmF2YmFyIGl0ZW1zIGZpdCBpbiB2aWV3cG9ydFxyXG5cdGZ1bmN0aW9uIHZlcnRpY2FsTmF2Rml0VmlldygpIHtcclxuXHRcdGlmICggdmlld3BvcnQuaGVpZ2h0KCkgPCBtYWluTmF2Q29udC5pbm5lckhlaWdodCgpICkge1xyXG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtZml4ZWQnKS5hZGRDbGFzcygndmVydGljYWwtc3RhdGljJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtc3RhdGljJykuYWRkQ2xhc3MoJ3ZlcnRpY2FsLWZpeGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gSGFuZGxlIG5hdmJhciBpdGVtcyBvdmVybGFwXHJcblx0ZnVuY3Rpb24gbmF2YmFyT3ZlcmxhcCgpIHtcclxuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soKSxcclxuXHRcdFx0bWFpbk5hdkxvZ29DbHMgPSAnbG9nby0nICsgbWFpbk5hdldyYXAuYXR0cignZGF0YS1sb2dvLWFsaWduJyk7XHJcblxyXG5cdFx0Ly8gUHJpbWFyeSBOYXZiYXJcclxuXHRcdGlmICggbWFpbk5hdkxvZ29DbHMgIT0gJ2xvZ28tY2VudGVyJyAmJiBtaXh0X29wdC5uYXYubGF5b3V0ID09ICdob3Jpem9udGFsJyApIHtcclxuXHRcdFx0bWFpbk5hdldyYXAuYWRkKG1lZGlhV3JhcCkucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyJykuYWRkQ2xhc3MobWFpbk5hdkxvZ29DbHMpO1xyXG5cdFx0XHRpZiAoIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcclxuXHRcdFx0XHR2YXIgbWFpbk5hdkNvbnRXaWR0aCA9IG1haW5OYXZDb250LndpZHRoKCksXHJcblx0XHRcdFx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IG1haW5OYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcclxuXHRcdFx0XHRpZiAoIG1haW5OYXZJdGVtc1dpZHRoID4gbWFpbk5hdkNvbnRXaWR0aCApIHtcclxuXHRcdFx0XHRcdG1haW5OYXZXcmFwLmFkZChtZWRpYVdyYXApLnJlbW92ZUNsYXNzKG1haW5OYXZMb2dvQ2xzKS5hZGRDbGFzcygnbG9nby1jZW50ZXInKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZWNvbmRhcnkgTmF2YmFyXHJcblx0XHRpZiAoIHNlY05hdkJhci5sZW5ndGggKSB7XHJcblx0XHRcdHNlY05hdkJhci5yZW1vdmVDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xyXG5cdFx0XHR2YXIgc2VjTmF2Q29udFdpZHRoID0gc2VjTmF2Q29udC53aWR0aCgpLFxyXG5cdFx0XHRcdHNlY05hdkl0ZW1zV2lkdGggPSAkKCcubGVmdC1jb250ZW50Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0LWNvbnRlbnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSk7XHJcblx0XHRcdGlmICggc2VjTmF2SXRlbXNXaWR0aCA+IHNlY05hdkNvbnRXaWR0aCApIHtcclxuXHRcdFx0XHRzZWNOYXZCYXIuYWRkQ2xhc3MoJ2l0ZW1zLW92ZXJsYXAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIE9uZS1QYWdlIE5hdmlnYXRpb25cclxuXHRmdW5jdGlvbiBvbmVQYWdlTmF2KCkge1xyXG5cdFx0dmFyIG9mZnNldCA9IDAsXHJcblx0XHRcdHNweURhdGEgPSBib2R5RWwuZGF0YSgnYnMuc2Nyb2xsc3B5Jyk7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmIG1haW5OYXZCYXIuZGF0YSgnZml4ZWQnKSApIHsgb2Zmc2V0ICs9IG1haW5OYXZCYXIub3V0ZXJIZWlnaHQoKTsgfVxyXG5cdFx0aWYgKCBtaXh0X29wdC5wYWdlWydzaG93LWFkbWluLWJhciddICYmICQoJyN3cGFkbWluYmFyJykuY3NzKCdwb3NpdGlvbicpID09ICdmaXhlZCcgKSB7IG9mZnNldCArPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpOyB9XHJcblxyXG5cdFx0JCgnLm9uZS1wYWdlLXJvdycpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcm93ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICggcm93LmlzKCc6Zmlyc3QtY2hpbGQnKSApIHtcclxuXHRcdFx0XHR2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Lm9uZS1wYWdlJyk7XHJcblx0XHRcdFx0cGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJywgJycpO1xyXG5cdFx0XHRcdHJvdy5jc3MoJ3BhZGRpbmctdG9wJywgcGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJykpO1xyXG5cdFx0XHRcdHBhZ2VDb250ZW50LmNzcygnbWFyZ2luLXRvcCcsIDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciBwcmV2Um93ID0gcm93LnByZXYoKTtcclxuXHRcdFx0XHRpZiAoICEgcHJldlJvdy5oYXNDbGFzcygncm93JykgKSBwcmV2Um93ID0gcHJldlJvdy5wcmV2KCcucm93Jyk7XHJcblxyXG5cdFx0XHRcdHByZXZSb3cuY3NzKCdtYXJnaW4tYm90dG9tJywgJycpO1xyXG5cdFx0XHRcdHJvdy5jc3MoJ3BhZGRpbmctdG9wJywgcHJldlJvdy5jc3MoJ21hcmdpbi1ib3R0b20nKSk7XHJcblx0XHRcdFx0cHJldlJvdy5jc3MoJ21hcmdpbi1ib3R0b20nLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKCBzcHlEYXRhICkge1xyXG5cdFx0XHRzcHlEYXRhLm9wdGlvbnMub2Zmc2V0ID0gb2Zmc2V0O1xyXG5cdFx0XHRib2R5RWwuc2Nyb2xsc3B5KCdyZWZyZXNoJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRib2R5RWwuc2Nyb2xsc3B5KHtcclxuXHRcdFx0XHR0YXJnZXQ6ICcjbWFpbi1uYXYnLFxyXG5cdFx0XHRcdG9mZnNldDogb2Zmc2V0XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWFpbk5hdkJhci5vbignYWN0aXZhdGUuYnMuc2Nyb2xsc3B5JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdklubmVyLmNvbGxhcHNlKCdoaWRlJyk7XHJcblx0XHRcdFx0fSwgMTAwICk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIEZ1bmN0aW9ucyBSdW4gT24gTG9hZCAmIFdpbmRvdyBSZXNpemVcclxuXHRmdW5jdGlvbiBuYXZiYXJGbigpIHtcclxuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soKTtcclxuXHJcblx0XHQvLyBSdW4gZnVuY3Rpb24gdG8gcHJldmVudCBzdWJtZW51cyBnb2luZyBvdXRzaWRlIHZpZXdwb3J0XHJcblx0XHRuYXZiYXJzLm5vdChtYWluTmF2QmFyKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0TmF2YmFyLm1lbnUub3ZlcmZsb3coJCgnLm5hdmJhci1pbm5lcicsIHRoaXMpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJ1biBmdW5jdGlvbnMgYmFzZWQgb24gY3VycmVudGx5IGFjdGl2ZSBtZWRpYSBxdWVyeVxyXG5cdFx0aWYgKCBtcU5hdiA9PSAnZGVza3RvcCcgKSB7XHJcblx0XHRcdE5hdmJhci5tZW51Lm92ZXJmbG93KG1haW5OYXZJbm5lcik7XHJcblx0XHRcdG1haW5XcmFwLmFkZENsYXNzKCduYXYtZnVsbCcpLnJlbW92ZUNsYXNzKCduYXYtbWluaScpO1xyXG5cclxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHROYXZiYXIubWVudS5tZWdhTWVudVRvZ2dsZSgnZW5hYmxlJywgJCh0aGlzKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWVudVBhcmVudHMub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vbigndG91Y2hzdGFydCcsIG1lbnVUb3VjaFJlbW92ZUhvdmVyKTtcclxuXHRcdH0gZWxzZSBpZiAoIG1xTmF2ID09ICdtb2JpbGUnIHx8IG1xTmF2ID09ICd0YWJsZXQnICkge1xyXG5cdFx0XHROYXZiYXIubW9iaWxlLnRyaWdnZXIobXFOYXYpO1xyXG5cdFx0XHRtYWluV3JhcC5hZGRDbGFzcygnbmF2LW1pbmknKS5yZW1vdmVDbGFzcygnbmF2LWZ1bGwnKTtcclxuXHJcblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0TmF2YmFyLm1lbnUubWVnYU1lbnVUb2dnbGUoJ2Rpc2FibGUnLCAkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtZW51UGFyZW50cy5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcclxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHtcclxuXHRcdFx0aWYgKCBtcU5hdiA9PSAnbW9iaWxlJyApIHtcclxuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIodHJ1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0TmF2YmFyLnN0aWNreS50cmlnZ2VyKGZhbHNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAndmVydGljYWwnICYmIG1peHRfb3B0Lm5hdlsndmVydGljYWwtbW9kZSddID09ICdmaXhlZCcgKSB7XHJcblx0XHRcdGlmICggbXFOYXYgPT0gJ3RhYmxldCcgKSB7XHJcblx0XHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygnc3RpY2t5Jyk7XHJcblx0XHRcdFx0TmF2YmFyLnN0aWNreS50cmlnZ2VyKGZhbHNlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcclxuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1haW5OYXZCYXIuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFZlcnRpY2FsIG5hdmJhciBoYW5kbGluZ1xyXG5cdFx0aWYgKCBtaXh0X29wdC5uYXYubGF5b3V0ID09ICd2ZXJ0aWNhbCcgJiYgbWl4dF9vcHQubmF2Wyd2ZXJ0aWNhbC1tb2RlJ10gPT0gJ2ZpeGVkJyAmJiBtcU5hdiA9PSAnZGVza3RvcCcgKSB7XHJcblx0XHRcdC8vIE1ha2UgbmF2YmFyIHN0YXRpYyBpZiBpdGVtcyBkb24ndCBmaXQgaW4gdmlld3BvcnRcclxuXHRcdFx0dmVydGljYWxOYXZGaXRWaWV3KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmF2YmFyT3ZlcmxhcCgpO1xyXG5cclxuXHRcdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ29uZXBhZ2UnICkge1xyXG5cdFx0XHRvbmVQYWdlTmF2KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBuYXZiYXJGbiApKS5yZXNpemUoKTtcclxuXHJcbn0pKGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcblBPU1QgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4oIGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGlmcmFtZUFzcGVjdCwgTW9kZXJuaXpyICovXHJcblxyXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KSxcclxuXHRcdGNvbnRlbnQgID0gJCgnI2NvbnRlbnQnKTtcclxuXHJcblx0Ly8gUmVzaXplIEVtYmVkZGVkIFZpZGVvcyBQcm9wb3J0aW9uYWxseVxyXG5cdGlmcmFtZUFzcGVjdCggJCgnLnBvc3QgaWZyYW1lJykgKTtcclxuXHJcblx0Ly8gUG9zdCBMYXlvdXRcclxuXHRmdW5jdGlvbiBwb3N0c1BhZ2UoKSB7XHJcblxyXG5cdFx0Y29udGVudC5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8gQW5pbWF0ZSBQb3N0c1xyXG5cdFx0XHR2YXIgYW5pbVBvc3RzICAgICA9ICQoJy5wb3N0cy1jb250YWluZXIgLmFydGljbGUuYW5pbWF0ZWQnKSxcclxuXHRcdFx0XHRhbmltUG9zdERlbGF5ID0gKCB2aWV3cG9ydC5zY3JvbGxUb3AoKSA+IDYwMCApID8gMTAgOiAyMDA7XHJcblx0XHRcdGFuaW1Qb3N0cy5lYWNoKCBmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0XHRcdHZhciBlbGVtID0gJCh0aGlzKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ2luaXQnKTtcclxuXHRcdFx0XHR9LCBpbmRleCsrICogYW5pbVBvc3REZWxheSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRhbmltUG9zdHMucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcblx0XHRcdH0sIChhbmltUG9zdHMubGVuZ3RoICsgMSkgKiBhbmltUG9zdERlbGF5KTtcclxuXHJcblx0XHRcdC8vIEZlYXR1cmVkIEdhbGxlcnkgU2xpZGVyXHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0dmFyIGdhbGxlcnlTbGlkZXIgPSAkKCcuZ2FsbGVyeS1zbGlkZXInKS5ub3QoJy5saWdodFNsaWRlcicpO1xyXG5cdFx0XHRcdGdhbGxlcnlTbGlkZXIubGlnaHRTbGlkZXIoe1xyXG5cdFx0XHRcdFx0aXRlbTogMSxcclxuXHRcdFx0XHRcdGF1dG86IHRydWUsXHJcblx0XHRcdFx0XHRsb29wOiB0cnVlLFxyXG5cdFx0XHRcdFx0cGFnZXI6IGZhbHNlLFxyXG5cdFx0XHRcdFx0cGF1c2U6IDUwMDAsXHJcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcclxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAwLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0R2FsbGVyeSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHQkKCcubGlnaHRib3gtZ2FsbGVyeScpLmxpZ2h0R2FsbGVyeSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBFcXVhbGl6ZSBmZWF0dXJlZCBtZWRpYSBoZWlnaHQgZm9yIHJlbGF0ZWQgcG9zdHMgYW5kIGdyaWQgYmxvZ1xyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdCQuZm4ubWF0Y2hIZWlnaHQuX21haW50YWluU2Nyb2xsID0gdHJ1ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQkKCcuYmxvZy1ncmlkIC5wb3N0cy1jb250YWluZXIgLnBvc3QtZmVhdCcpLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcclxuXHJcblx0XHRcdFx0aWYgKCAhIE1vZGVybml6ci5mbGV4Ym94ICkge1xyXG5cdFx0XHRcdFx0JCgnLmJsb2ctZ3JpZCAucG9zdHMtY29udGFpbmVyIGFydGljbGUnKS5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1hdGNoSGVpZ2h0RWwgPSAkKCcucG9zdC1yZWxhdGVkIC5wb3N0LWZlYXQnKSxcclxuXHRcdFx0XHRcdFx0bWF0Y2hIZWlnaHRUYXJnZXQgPSBtYXRjaEhlaWdodEVsLmZpbmQoJy53cC1wb3N0LWltYWdlJyk7XHJcblx0XHRcdFx0XHRpZiAoIG1hdGNoSGVpZ2h0VGFyZ2V0Lmxlbmd0aCA9PT0gMCApIG1hdGNoSGVpZ2h0VGFyZ2V0ID0gbnVsbDtcclxuXHRcdFx0XHRcdG1hdGNoSGVpZ2h0RWwuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCh7XHJcblx0XHRcdFx0XHRcdHRhcmdldDogbWF0Y2hIZWlnaHRUYXJnZXQsXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBMb2FkIFBvc3RzICYgQ29tbWVudHMgdmlhIEFqYXhcclxuXHRmdW5jdGlvbiBtaXh0QWpheExvYWQodHlwZSkge1xyXG5cdFx0dHlwZSA9IHR5cGUgfHwgJ3Bvc3RzJztcclxuXHRcdHZhciBwYWdDb250ID0gJCgnLnBhZ2luZy1uYXZpZ2F0aW9uJyksXHJcblx0XHRcdGFqYXhCdG4gPSAkKCcuYWpheC1tb3JlJywgcGFnQ29udCk7XHJcblxyXG5cdFx0aWYgKCAhIHBhZ0NvbnQubGVuZ3RoIHx8ICEgYWpheEJ0bi5sZW5ndGggKSByZXR1cm47XHJcblx0XHRcclxuXHRcdHZhciBwYWdlTm93ID0gcGFnQ29udC5kYXRhKCdwYWdlLW5vdycpLFxyXG5cdFx0XHRwYWdlTWF4ID0gcGFnQ29udC5kYXRhKCdwYWdlLW1heCcpLFxyXG5cdFx0XHRuZXh0VXJsID0gYWpheEJ0bi5hdHRyKCdocmVmJyksXHJcblx0XHRcdHBhZ2VOdW0sXHJcblx0XHRcdHBhZ2VUeXBlLFxyXG5cdFx0XHRjb250YWluZXIsXHJcblx0XHRcdGVsZW1lbnQsXHJcblx0XHRcdGxvYWRTZWw7XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XHJcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XHJcblx0XHRcdGNvbnRhaW5lciA9ICQoJy5wb3N0cy1jb250YWluZXInKTtcclxuXHRcdFx0ZWxlbWVudCAgID0gJy5hcnRpY2xlJztcclxuXHRcdFx0bG9hZFNlbCAgID0gJyAucG9zdHMtY29udGFpbmVyIC5hcnRpY2xlJztcclxuXHRcdH0gZWxzZSBpZiAoIHR5cGUgPT0gJ3Nob3AnICkge1xyXG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xyXG5cdFx0XHRjb250YWluZXIgPSAkKCd1bC5wcm9kdWN0cycpO1xyXG5cdFx0XHRlbGVtZW50ICAgPSAnLnByb2R1Y3QnO1xyXG5cdFx0XHRsb2FkU2VsICAgPSAnIHVsLnByb2R1Y3RzID4gbGknO1xyXG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xyXG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ107XHJcblx0XHRcdGNvbnRhaW5lciA9ICQoJy5jb21tZW50LWxpc3QnKTtcclxuXHRcdFx0ZWxlbWVudCAgID0gJy5jb21tZW50JztcclxuXHRcdFx0bG9hZFNlbCAgID0gJyAuY29tbWVudC1saXN0ID4gbGknO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZSA9PSAnY29tbWVudHMnICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcclxuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgLSAxO1xyXG5cdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgKyAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggKCBwYWdlTm93ID49IHBhZ2VNYXggKSAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gIT0gJ25ld2VzdCcgfHwgcGFnZU51bSA8PSAwICkge1xyXG5cdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YWpheEJ0bi5vbignY2xpY2sgY29udDpib3R0b20nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdC8vIFByZXZlbnQgbG9hZGluZyB0d2ljZSBvbiBzY3JvbGxcclxuXHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcclxuXHRcdFxyXG5cdFx0XHQvLyBBcmUgdGhlcmUgbW9yZSBwYWdlcyB0byBsb2FkP1xyXG5cdFx0XHRpZiAoIHBhZ2VOdW0gPiAwICYmIHBhZ2VOdW0gPD0gcGFnZU1heCApIHtcclxuXHRcdFx0XHJcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2xvYWRpbmcnKTtcclxuXHJcblx0XHRcdFx0Ly8gTG9hZCBwb3N0c1xyXG5cdFx0XHRcdC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXHJcblx0XHRcdFx0JCgnPGRpdj4nKS5sb2FkKG5leHRVcmwgKyBsb2FkU2VsLCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCB4aHIpIHtcclxuXHRcdFx0XHRcdHZhciBuZXdQb3N0cyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0YWpheEJ0bi5ibHVyKCk7XHJcblxyXG5cdFx0XHRcdFx0bmV3UG9zdHMuY2hpbGRyZW4oZWxlbWVudCkuYWRkQ2xhc3MoJ2FqYXgtbmV3Jyk7XHJcblx0XHRcdFx0XHRpZiAoICggdHlwZSA9PSAncG9zdHMnIHx8IHR5cGUgPT0gJ3Nob3AnICkgJiYgbWl4dF9vcHQubGF5b3V0LnR5cGUgIT0gJ21hc29ucnknICYmIG1peHRfb3B0LmxheW91dFsnc2hvdy1wYWdlLW5yJ10gKSB7XHJcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJhamF4LXBhZ2UgcGFnZS0nKyBwYWdlTnVtICsnXCI+PGEgaHJlZj1cIicrIG5leHRVcmwgKydcIj5QYWdlICcrIHBhZ2VOdW0gKyc8L2E+PC9kaXY+Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb250YWluZXIuYXBwZW5kKG5ld1Bvc3RzLmh0bWwoKSk7XHJcblxyXG5cdFx0XHRcdFx0bmV3UG9zdHMgPSBjb250YWluZXIuY2hpbGRyZW4oJy5hamF4LW5ldycpO1xyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSBwYWdlIG51bWJlciBhbmQgbmV4dFVybFxyXG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgKSB7XHJcblx0XHRcdFx0XHRcdGlmICggbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddID09ICduZXdlc3QnICkge1xyXG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0tLTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRwYWdlTnVtKys7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcclxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvcGFnZVxcL1swLTldPy8sICcvcGFnZS8nICsgcGFnZU51bSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYnV0dG9uIHN0YXRlXHJcblx0XHRcdFx0XHRpZiAoIHBhZ2VOdW0gPD0gcGFnZU1heCAmJiBwYWdlTnVtID4gMCApIHsgYWpheEJ0bi5idXR0b24oJ3Jlc2V0Jyk7IH1cclxuXHRcdFx0XHRcdGVsc2UgeyBhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTsgfVxyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSBsYXlvdXQgb25jZSBwb3N0cyBoYXZlIGxvYWRlZFxyXG5cdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnJlbW92ZUNsYXNzKCdhamF4LW5ldyBpbml0Jyk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xyXG5cdFx0XHRcdFx0XHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cdFx0XHRcdFx0XHRcdHBvc3RzUGFnZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRjb250YWluZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pc290b3BlKCdhcHBlbmRlZCcsIG5ld1Bvc3RzKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR2aWV3cG9ydC50cmlnZ2VyKCdwb3N0LWxvYWQnKS50cmlnZ2VyKCdyZWZyZXNoJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7IH1cclxuXHJcblx0XHRcdFx0XHQvLyBIYW5kbGUgRXJyb3JzXHJcblx0XHRcdFx0XHRpZiAoIHN0YXR1cyA9PSAnZXJyb3InICkge1xyXG5cdFx0XHRcdFx0XHRhamF4QnRuLmJ1dHRvbignZXJyb3InKTtcclxuXHRcdFx0XHRcdFx0Ly8gRGVidWdnaW5nIGluZm9cclxuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoJ0FKQVggRXJyb3I6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gVHJpZ2dlciBBSkFYIGxvYWQgd2hlbiByZWFjaGluZyBib3R0b20gb2YgcGFnZVxyXG5cdFx0dmFyIGFqYXhTY3JvbGxIYW5kbGUgPSAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8qIGdsb2JhbCBlbGVtVmlzaWJsZSAqL1xyXG5cdFx0XHRcdGlmICggZWxlbVZpc2libGUoYWpheEJ0biwgdmlld3BvcnQpID09PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0YWpheEJ0bi50cmlnZ2VyKCdjb250OmJvdHRvbScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gRXhlY3V0ZSBGdW5jdGlvbiBXaGVyZSBBcHBsaWNhYmxlXHJcblx0aWYgKCBtaXh0X29wdC5wYWdlWydwb3N0cy1wYWdlJ10gJiYgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1zY3JvbGwnICkge1xyXG5cdFx0aWYgKCBtaXh0X29wdC5wYWdlWydwYWdlLXR5cGUnXSA9PSAnc2hvcCcgKSB7XHJcblx0XHRcdG1peHRBamF4TG9hZCgnc2hvcCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bWl4dEFqYXhMb2FkKCdwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaW5nbGUnICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRtaXh0QWpheExvYWQoJ2NvbW1lbnRzJyk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gS2VlcCBwb3N0IGNvbnRlbnQgYWJvdmUgYSBtaW5pbXVtIGhlaWdodCB0byBtYWludGFpbiByZWFkYWJpbGl0eVxyXG5cdGZ1bmN0aW9uIHBvc3RDb250ZW50TWluV2lkdGgoKSB7XHJcblx0XHR2YXIgbWluVyA9IDMyMCxcclxuXHRcdFx0cG9zdE1pblcgPSBtaW5XICogMixcclxuXHRcdFx0cG9zdCA9ICQoJy5zaW5nbGUtY29udGVudC5oYXMtY29sdW1ucycpLFxyXG5cdFx0XHRjb250ID0gJCgnLmVudHJ5LWJvZHknLCBwb3N0KTtcclxuXHRcdGlmICggY29udC5oYXNDbGFzcygnY29sLXNtLTQnKSApIHtcclxuXHRcdFx0cG9zdE1pblcgPSBtaW5XICogMztcclxuXHRcdH0gZWxzZSBpZiAoIGNvbnQuaGFzQ2xhc3MoJ2NvbC1zbS04JykgKSB7XHJcblx0XHRcdHBvc3RNaW5XID0gbWluVyAqIDEuNTtcclxuXHRcdH1cclxuXHRcdGlmICggcG9zdC53aWR0aCgpIDwgcG9zdE1pblcgKSB7XHJcblx0XHRcdHBvc3QuYWRkQ2xhc3MoJ292ZXJyaWRlLWNvbHMnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBvc3QucmVtb3ZlQ2xhc3MoJ292ZXJyaWRlLWNvbHMnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIFdpbmRvdyBSZXNpemVcclxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcclxuXHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cclxuXHRcdHBvc3RDb250ZW50TWluV2lkdGgoKTtcclxuXHR9XHJcblx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIHJlc2l6ZUZuICkpO1xyXG5cclxuXHJcblx0Ly8gRnVuY3Rpb25zIFRvIFJ1biBPbiBMb2FkXHJcblx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cG9zdHNQYWdlKCk7XHJcblxyXG5cdFx0cG9zdENvbnRlbnRNaW5XaWR0aCgpO1xyXG5cclxuXHRcdC8vIElzb3RvcGUgTWFzb25yeSBJbml0XHJcblx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyAmJiB0eXBlb2YgJC5mbi5pc290b3BlID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgYmxvZ0NvbnQgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcclxuXHJcblx0XHRcdGJsb2dDb250Lmlzb3RvcGUoe1xyXG5cdFx0XHRcdGl0ZW1TZWxlY3RvcjogJy5hcnRpY2xlJyxcclxuXHRcdFx0XHRsYXlvdXQ6ICdtYXNvbnJ5JyxcclxuXHRcdFx0XHRndXR0ZXI6IDBcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRibG9nQ29udC5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSk7XHJcblx0XHRcdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0gKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIFRyaWdnZXIgTGlnaHRib3ggT24gRmVhdHVyZWQgSW1hZ2UgQ2xpY2tcclxuXHRcdCQoJy5saWdodGJveC10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykuc2libGluZ3MoJy5nYWxsZXJ5JykuZmluZCgnbGknKS5maXJzdCgpLmNsaWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Ly8gUmVsYXRlZCBQb3N0cyBTbGlkZXJcclxuXHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdHZhciByZWxQb3N0c1NsaWRlciA9ICQoJy5wb3N0LXJlbGF0ZWQgLnNsaWRlci1jb250JyksXHJcblx0XHRcdFx0dHlwZSA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ3R5cGUnKSxcclxuXHRcdFx0XHRjb2xzID0gcmVsUG9zdHNTbGlkZXIuZGF0YSgnY29scycpLFxyXG5cdFx0XHRcdHRhYmxldENvbHMgPSByZWxQb3N0c1NsaWRlci5kYXRhKCd0YWJsZXQtY29scycpLFxyXG5cdFx0XHRcdG1vYmlsZUNvbHMgPSByZWxQb3N0c1NsaWRlci5kYXRhKCdtb2JpbGUtY29scycpO1xyXG5cdFx0XHRyZWxQb3N0c1NsaWRlci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmxpZ2h0U2xpZGVyKHtcclxuXHRcdFx0XHRcdGl0ZW06IGNvbHMsXHJcblx0XHRcdFx0XHRjb250cm9sczogKHR5cGUgPT0gJ21lZGlhJyksXHJcblx0XHRcdFx0XHRwYWdlcjogKHR5cGUgPT0gJ3RleHQnKSxcclxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2xpZGVNYXJnaW46IDIwLFxyXG5cdFx0XHRcdFx0cmVzcG9uc2l2ZTogW3tcclxuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogMTIwMCxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogdGFibGV0Q29scyB9XHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDU4MCxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogbW9iaWxlQ29scyB9XHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHJlbFBvc3RzU2xpZGVyLnJlbW92ZUNsYXNzKCdpbml0Jyk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mICQuZm4ubWF0Y2hIZWlnaHQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRcdFx0JCgnLnBvc3QtZmVhdCcsIHJlbFBvc3RzU2xpZGVyKS5tYXRjaEhlaWdodCgpO1xyXG5cdFx0XHRcdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmNzcygnaGVpZ2h0JywgJycpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuVUkgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4oIGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxyXG5cdFx0aHRtbEVsICAgPSAkKCdodG1sJyksXHJcblx0XHRib2R5RWwgICA9ICQoJ2JvZHknKTtcclxuXHJcblxyXG5cdC8vIFNwaW5uZXIgSW5wdXRcclxuXHQkKCcubWl4dC1zcGlubmVyJykub24oJ2NsaWNrJywgJy5idG4nLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciAkZWwgICAgID0gJCh0aGlzKSxcclxuXHRcdFx0c3Bpbm5lciA9ICRlbC5wYXJlbnRzKCcubWl4dC1zcGlubmVyJyksXHJcblx0XHRcdGlucHV0ICAgPSBzcGlubmVyLmNoaWxkcmVuKCcuc3Bpbm5lci12YWwnKSxcclxuXHRcdFx0c3RlcCAgICA9IGlucHV0LmF0dHIoJ3N0ZXAnKSB8fCAxLFxyXG5cdFx0XHRtaW5WYWwgID0gaW5wdXQuYXR0cignbWluJykgfHwgMCxcclxuXHRcdFx0bWF4VmFsICA9IGlucHV0LmF0dHIoJ21heCcpIHx8IG51bGwsXHJcblx0XHRcdHZhbCAgICAgPSBpbnB1dC52YWwoKSxcclxuXHRcdFx0bmV3VmFsO1xyXG5cdFx0aWYgKCBpc05hTih2YWwpICkgdmFsID0gbWluVmFsO1xyXG5cdFx0XHJcblx0XHRpZiAoICRlbC5oYXNDbGFzcygnbWludXMnKSApIHtcclxuXHRcdFx0Ly8gRGVjcmVhc2VcclxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpIC0gcGFyc2VGbG9hdChzdGVwKTtcclxuXHRcdFx0aWYgKCBuZXdWYWwgPCBtaW5WYWwgKSBuZXdWYWwgPSBtaW5WYWw7XHJcblx0XHRcdGlucHV0LnZhbChuZXdWYWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gSW5jcmVhc2VcclxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpICsgcGFyc2VGbG9hdChzdGVwKTtcclxuXHRcdFx0aWYgKCBtYXhWYWwgIT09IG51bGwgJiYgbmV3VmFsID4gbWF4VmFsICkgbmV3VmFsID0gbWF4VmFsO1xyXG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcclxuXHRcdH1cclxuXHRcdGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gQ29udGVudCBGaWx0ZXJpbmdcclxuXHQkKCcuY29udGVudC1maWx0ZXItbGlua3MnKS5jaGlsZHJlbigpLmNsaWNrKCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcclxuXHRcdFx0ZmlsdGVyID0gbGluay5kYXRhKCdmaWx0ZXInKSxcclxuXHRcdFx0Y29udGVudCA9ICQoJy4nICsgbGluay5wYXJlbnRzKCcuY29udGVudC1maWx0ZXItbGlua3MnKS5kYXRhKCdjb250ZW50JykpLFxyXG5cdFx0XHRmaWx0ZXJDbGFzcyA9ICdmaWx0ZXItaGlkZGVuJztcclxuXHRcdGxpbmsuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0aWYgKCBmaWx0ZXIgPT0gJ2FsbCcgKSB7IGNvbnRlbnQuZmluZCgnLicrZmlsdGVyQ2xhc3MpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKTsgfVxyXG5cdFx0ZWxzZSB7IGNvbnRlbnQuZmluZCgnLicgKyBmaWx0ZXIpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKS5zaWJsaW5ncygnOm5vdCguJytmaWx0ZXIrJyknKS5hZGRDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVVcCg2MDApOyB9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBTb3J0IHBvcnRmb2xpbyBpdGVtc1xyXG5cdCQoJy5wb3J0Zm9saW8tc29ydGVyIGEnKS5jbGljayggZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZWxlbSA9ICQodGhpcyksXHJcblx0XHRcdHRhcmdldFRhZyA9IGVsZW0uZGF0YSgnc29ydCcpLFxyXG5cdFx0XHR0YXJnZXRDb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XHJcblxyXG5cdFx0ZWxlbS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIGFuaW1hdGVkIGNsYXNzIHRvIHByZXZlbnQgdHJhbnNpdGlvbiBnbGl0Y2hlc1xyXG5cdFx0dGFyZ2V0Q29udGFpbmVyLmZpbmQoJy5hcnRpY2xlLmFuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0aWYgKHRhcmdldFRhZyA9PSAnYWxsJykge1xyXG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnKicgfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGFyZ2V0Q29udGFpbmVyLmlzb3RvcGUoeyBmaWx0ZXI6ICcuJyArIHRhcmdldFRhZyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHByb2plY3RzID0gdGFyZ2V0Q29udGFpbmVyLmNoaWxkcmVuKCcucG9ydGZvbGlvJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0VGFnID09ICdhbGwnICkge1xyXG5cdFx0XHRcdHByb2plY3RzLmZhZGVJbigzMDApLmFkZENsYXNzKCdmaWx0ZXJlZCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByb2plY3RzLmZhZGVPdXQoMCkucmVtb3ZlQ2xhc3MoJ2ZpbHRlcmVkJykuZmlsdGVyKCcuJyArIHRhcmdldFRhZykuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2ZpbHRlcmVkJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIE9mZnNldCBzY3JvbGxpbmcgdG8gbGluayBhbmNob3IgKGhhc2gpXHJcblx0JCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgbGluayA9ICQodGhpcyksXHJcblx0XHRcdGhhc2ggPSBsaW5rLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRpZiAoIGxpbmsuZGF0YSgnbm8taGFzaC1zY3JvbGwnKSB8fCAkKGUudGFyZ2V0KS5kYXRhKCduby1oYXNoLXNjcm9sbCcpIHx8IGhhc2ggPT0gJyMnICkgcmV0dXJuIHRydWU7XHJcblxyXG5cdFx0aWYgKCBoYXNoLmxlbmd0aCApIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJChoYXNoKTtcclxuXHRcdFx0aWYgKCB0YXJnZXQubGVuZ3RoKSB7XHJcblx0XHRcdFx0dmFyIGhhc2hPZmZzZXQgPSAkKGhhc2gpLm9mZnNldCgpLnRvcCArIDE7XHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmICQoJyNtYWluLW5hdicpLmRhdGEoJ2ZpeGVkJykgKSB7IGhhc2hPZmZzZXQgLT0gJCgnI21haW4tbmF2Jykub3V0ZXJIZWlnaHQoKTsgfVxyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSAmJiAkKCcjd3BhZG1pbmJhcicpLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnICkgeyBoYXNoT2Zmc2V0IC09ICQoJyN3cGFkbWluYmFyJykuaGVpZ2h0KCk7IH1cclxuXHRcdFx0XHRodG1sRWwuYWRkKGJvZHlFbCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogaGFzaE9mZnNldCB9LCA2MDAgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIGhhc2gpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Ly8gSWdub3JlIHNwZWNpZmljIGFuY2hvcnNcclxuXHQkKCcudGFicyBhLCAudmNfdHRhIGEsIC51aS1hY2NvcmRpb24gYScpLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJywgdHJ1ZSk7XHJcblxyXG5cclxuXHQvLyBTb2NpYWwgSWNvbnNcclxuXHQkKCcuc29jaWFsLWxpbmtzJykubm90KCcuaG92ZXItbm9uZScpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNvbnQgPSAkKHRoaXMpO1xyXG5cclxuXHRcdGNvbnQuY2hpbGRyZW4oKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGljb24gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGxpbmsgPSBpY29uLmNoaWxkcmVuKCdhJyksXHJcblx0XHRcdFx0ZGF0YUNvbG9yID0gbGluay5hdHRyKCdkYXRhLWNvbG9yJyk7XHJcblxyXG5cdFx0XHRpZiAoIGNvbnQuaGFzQ2xhc3MoJ2hvdmVyLWJnJykgfHwgY29udC5wYXJlbnRzKCcubm8taG92ZXItYmcnKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRsaW5rLmNzcyh7IGJhY2tncm91bmRDb2xvcjogZGF0YUNvbG9yLCB6SW5kZXg6IDEgfSk7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiAnJywgekluZGV4OiAnJyB9KTsgfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRsaW5rLmNzcyh7IGNvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcclxuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBjb2xvcjogJycsIHpJbmRleDogJycgfSk7IH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHRcclxuXHJcblx0Ly8gRWxlbWVudCBBbmltYXRpb25zXHJcblx0ZnVuY3Rpb24gbWl4dEFuaW1hdGlvbnMoKSB7XHJcblx0XHR2YXIgYW5pbUVsZW1zID0gJCgnLm1peHQtYW5pbWF0ZScpO1xyXG5cclxuXHRcdGlmICggYW5pbUVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGFuaW1FbGVtcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0ZGVsYXkgPSAkdGhpcy5kYXRhKCdhbmltLWRlbGF5JykgPyBNYXRoLmFicyhwYXJzZUludCgkdGhpcy5kYXRhKCdhbmltLWRlbGF5JykpKSA6IDA7XHJcblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcygnYW5pbS1vbi12aWV3JykgJiYgdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHQkdGhpcy53YXlwb2ludCggZnVuY3Rpb24oKSB7XHRcclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ2FuaW0tcHJlJykuYWRkQ2xhc3MoJ2FuaW0tc3RhcnQnKTtcclxuXHRcdFx0XHRcdFx0fSwgZGVsYXkpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0b2Zmc2V0OiAnODUlJyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ2FuaW0tcHJlJykuYWRkQ2xhc3MoJ2FuaW0tc3RhcnQnKTtcclxuXHRcdFx0XHRcdH0sIGRlbGF5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdG1peHRBbmltYXRpb25zKCk7XHJcblxyXG5cclxuXHQvLyBPbiBIb3ZlciBBbmltYXRpb25zXHJcblx0ZnVuY3Rpb24gYW5pbWF0ZUhvdmVySW4oZWxlbSkge1xyXG5cdFx0ZWxlbS5hZGRDbGFzcygnaG92ZXJlZCcpO1xyXG5cdFx0dmFyIGlubmVyICAgPSBlbGVtLmNoaWxkcmVuKCcub24taG92ZXInKSxcclxuXHRcdFx0YW5pbUluICA9IGlubmVyLmRhdGEoJ2FuaW0taW4nKSB8fCAnZmFkZUluJyxcclxuXHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xyXG5cdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbU91dCkuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltSW4pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYW5pbWF0ZUhvdmVyT3V0KGVsZW0pIHtcclxuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ2hvdmVyZWQnKTtcclxuXHRcdHZhciBpbm5lciAgID0gZWxlbS5jaGlsZHJlbignLm9uLWhvdmVyJyksXHJcblx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXHJcblx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0JztcclxuXHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1JbikuYWRkQ2xhc3MoYW5pbU91dCk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gUG9zdCBHcmlkIFJlc3BvbnNpdmUgQ29sdW1uc1xyXG5cdGZ1bmN0aW9uIHBvc3RHcmlkQ29sdW1ucygpIHtcclxuXHRcdCQoJy52Y19ncmlkLWNvbnRhaW5lci5yZXNwb25zaXZlLWNvbHMnKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGNsYXNzZXMgPSBlbGVtWzBdLmNsYXNzTmFtZS5tYXRjaCgvcmVzcC0oXFx3ezJ9LVxcZHsxLDJ9KS9nKTtcclxuXHRcdFx0aWYgKCBjbGFzc2VzICE9PSBudWxsICkge1xyXG5cdFx0XHRcdHZhciBjaGlsZHJlbiA9IGVsZW0uZmluZCgnLnZjX2dyaWQtaXRlbScpO1xyXG5cdFx0XHRcdCQoY2xhc3NlcykuZWFjaCggZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRcdFx0Y2hpbGRyZW4uYWRkQ2xhc3ModmFsLnJlcGxhY2UoJ3Jlc3AtJywgJ2NvbC0nKSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIEZ1bmN0aW9ucyBydW4gb24gcGFnZSBsb2FkIGFuZCBcInJlZnJlc2hcIiBldmVudFxyXG5cdGZ1bmN0aW9uIHJ1bk9uUmVmcmVzaCgpIHtcclxuXHRcdC8vIFRvb2x0aXBzIEluaXRcclxuXHRcdCQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0sIC5yZWxhdGVkLXRpdGxlLXRpcCcpLnRvb2x0aXAoe1xyXG5cdFx0XHRwbGFjZW1lbnQ6ICdhdXRvJyxcclxuXHRcdFx0Y29udGFpbmVyOiAnYm9keSdcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIE9uIEhvdmVyIEFuaW1hdGlvbnMgSW5pdFxyXG5cdFx0dmFyIGFuaW1Ib3ZlckVsID0gJCgnLmFuaW0tb24taG92ZXInKTtcclxuXHRcdC8vIE9uIGhvdmVySW50ZW50XHJcblx0XHRhbmltSG92ZXJFbC5ob3ZlckludGVudCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGFuaW1hdGVIb3ZlckluKCQodGhpcykpO1xyXG5cdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGFuaW1hdGVIb3Zlck91dCgkKHRoaXMpKTtcclxuXHRcdH0sIDUwKTtcclxuXHRcdC8vIEhhbmRsZSBNb2JpbGUgVGFwXHJcblx0XHRhbmltSG92ZXJFbC5vbigndG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdGlmICggISAkdGhpcy5oYXNDbGFzcygnaG92ZXJlZCcpICkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdGFuaW1hdGVIb3ZlckluKCR0aGlzKTtcclxuXHRcdFx0XHRhbmltSG92ZXJFbC5ub3QoJHRoaXMpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0YW5pbWF0ZUhvdmVyT3V0KCQodGhpcykpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHQvLyBDbGVhciBhbmltYXRpb25cclxuXHRcdGFuaW1Ib3ZlckVsLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgTVNBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGVsZW0gPSAkKHRoaXMpO1xyXG5cdFx0XHRpZiAoICEgZWxlbS5oYXNDbGFzcygnaG92ZXJlZCcpICkge1xyXG5cdFx0XHRcdGVsZW0uY2hpbGRyZW4oJy5vbi1ob3ZlcicpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmlld3BvcnQub24oJ3JlZnJlc2gnLCBmdW5jdGlvbigpIHtcclxuXHRcdHJ1bk9uUmVmcmVzaCgpO1xyXG5cdH0pLnRyaWdnZXIoJ3JlZnJlc2gnKTtcclxuXHJcblx0JChkb2N1bWVudCkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xyXG5cdFx0cnVuT25SZWZyZXNoKCk7XHJcblxyXG5cdFx0cG9zdEdyaWRDb2x1bW5zKCk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBCYWNrIFRvIFRvcCBCdXR0b25cclxuXHR2YXIgYmFja1RvVG9wID0gJCgnI2JhY2stdG8tdG9wJyk7XHJcblxyXG5cdGZ1bmN0aW9uIGJhY2tUb1RvcERpc3BsYXkoKSB7XHJcblx0XHR2YXIgc2Nyb2xsVG9wID0gdmlld3BvcnQuc2Nyb2xsVG9wKCk7XHJcblx0XHRpZiAoIHNjcm9sbFRvcCA+IDYwMCApIHtcclxuXHRcdFx0YmFja1RvVG9wLmZhZGVJbigzMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YmFja1RvVG9wLmZhZGVPdXQoMzAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHtcclxuXHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCAkLnRocm90dGxlKCAxMDAwLCBiYWNrVG9Ub3BEaXNwbGF5ICkpLnNjcm9sbCgpO1xyXG5cclxuXHRcdGJhY2tUb1RvcC5jbGljayggZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDYwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdFxyXG5cdC8vIEluZm8gQmFyXHJcblx0dmFyIGluZm9CYXJXcmFwID0gJCgnI2luZm8tYmFyLXdyYXAnKSxcclxuXHRcdGluZm9CYXIgPSBpbmZvQmFyV3JhcC5jaGlsZHJlbignLmluZm8tYmFyJyk7XHJcblxyXG5cdGZ1bmN0aW9uIGluZm9CYXJTdGlja3koKSB7XHJcblx0XHR2YXIgYmFySGVpZ2h0ID0gaW5mb0Jhci5vdXRlckhlaWdodCgpO1xyXG5cdFx0aW5mb0JhcldyYXAuY3NzKCdtaW4taGVpZ2h0JywgYmFySGVpZ2h0KTtcclxuXHRcdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHsgYmFja1RvVG9wLmNzcygnbWFyZ2luLWJvdHRvbScsIGJhckhlaWdodCk7IH1cclxuXHR9XHJcblxyXG5cdGlmICggaW5mb0Jhci5sZW5ndGggKSB7XHJcblx0XHRpbmZvQmFyLmZpbmQoJy5pbmZvLWNsb3NlJykuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGluZm9CYXJXcmFwLnNsaWRlVXAoMzAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dFsnaW5mby1iYXItY29va2llJ10gJiYgdHlwZW9mIENvb2tpZXMgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHR2YXIgY29va2llX3BlcnNpc3QgPSBwYXJzZUludChtaXh0X29wdC5sYXlvdXRbJ2luZm8tYmFyLWNvb2tpZS1wZXJzaXN0J10pO1xyXG5cdFx0XHRcdFx0aWYgKCBjb29raWVfcGVyc2lzdCA8IDEgfHwgY29va2llX3BlcnNpc3QgPiA5OTkgKSB7XHJcblx0XHRcdFx0XHRcdGNvb2tpZV9wZXJzaXN0ID0gOTk5O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Q29va2llcy5zZXQoJ21peHRfaW5mb19iYXJfY2xvc2UnLCB0cnVlLCB7IGV4cGlyZXM6IGNvb2tpZV9wZXJzaXN0LCBwYXRoOiAnLycgfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKCBiYWNrVG9Ub3AubGVuZ3RoICkgeyBiYWNrVG9Ub3AuY3NzKCdtYXJnaW4tYm90dG9tJywgJycpOyB9XHJcblx0XHR9KTtcclxuXHRcdGlmICggaW5mb0Jhci5oYXNDbGFzcygnc3RpY2t5JykgKSB7IGluZm9CYXJTdGlja3koKTsgfVxyXG5cdH1cclxuXHJcbn0pKGpRdWVyeSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

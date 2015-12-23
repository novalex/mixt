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
var breakpoint = {};
breakpoint.refresh = function() {
	this.name = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
};
jQuery(window).resize( function() {
	breakpoint.refresh();
}).resize();


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


// Lighten / Darken Color - Credit "Pimp Trizkit" - http://stackoverflow.com/users/693927/pimp-trizkit
function shadeColor(color, percent) {   
	var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
	return '#'+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


// Blend Colors - Credit "Pimp Trizkit" - http://stackoverflow.com/users/693927/pimp-trizkit
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


// Color Light Or Dark - Credit "Larry Fox" - https://gist.github.com/larryfox/1636338
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


// Image Light Or Dark Image - Credit "Joseph Portelli" - http://stackoverflow.com/users/149636/joseph-portelli
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


	// Element Animations
	function mixtAnimations() {
		var animElems = $('.mixt-animate');

		if ( animElems.length === 0 ) { return; }

		viewport.load( function() {
			if ( typeof $.fn.waypoint === 'function' ) {
				window.setTimeout( function() {
					animElems.waypoint( function() {
						$(this).removeClass('anim-pre').addClass('anim-start');
						if ( typeof this.destroy === 'function' ) this.destroy();
					}, {
						offset: '85%',
						triggerOnce: true
					});
				}, 1000 );
			}
		});
	}
	mixtAnimations();


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
			viewHeight   = viewport.height() - mediaWrap.offset().top;

		// Make header fullscreen
		if ( mixt_opt.header.fullscreen ) {
			var fullHeight = viewHeight;

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) fullHeight -= topNavHeight;

			mediaWrap.css('height', fullHeight);
			mediaCont.css('height', fullHeight);

		// Set header height to viewport percentage
		} else if ( mixt_opt.header.height.height != '' && mixt_opt.header.height.units == '%' ) {
			var height = parseInt(mixt_opt.header.height.height, 10) / 100 * viewHeight;

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) height -= topNavHeight;

			mediaWrap.css('height', height);
			mediaCont.css('height', height);
		}

		// Prevent content fade if header is taller than viewport
		if ( mixt_opt.header['content-fade'] ) {
			if ( wrapHeight > viewHeight ) {
				mediaWrap.addClass('no-fade');
			} else {
				mediaWrap.removeClass('no-fade');
			}
		}
	}

	// Header Scroll To Content
	function headerScroll() {
		var page   = $('html, body'),
			offset = $('#content-wrap').offset().top;
		if ( mixt_opt.nav.mode == 'fixed' ) { offset -= mainNav.children('.container').height(); }
		$('.header-scroll').on('click', function() {
			page.animate({ scrollTop: offset }, 800);
		});
	}

	if ( mixt_opt.header.enabled ) {
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
	
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
		is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
		is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

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
		if ( url && ( !$('textarea, input').is(':focus') ) ) {
			window.location = url;
		}
	});

	// Detect IE Version

	var classes = [],
		match = /msie (\d+)/i.exec( navigator.userAgent );
	if ( match ) {
		var version = +match[1],
			min = 6,
			max = 11;
		classes.push( 'ie' );
		classes.push( 'ie' + version );
		document.documentElement.className += ' ' + classes.join(' ');
	}

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
				Navbar.sticky.scrollCorrection = 0;

				if ( isMobile === false && ( mixt_opt.nav.layout == 'vertical' || ( document.documentElement.scrollHeight - viewport.height() ) > 160 ) ) {
					mainNavBar.data('fixed', true);
					viewport.on('scroll', $.throttle(50, Navbar.sticky.toggle));
				} else {
					mainNavBar.data('fixed', false);
					viewport.off('scroll', Navbar.sticky.toggle);
				}

				if ( mixt_opt.page['show-admin-bar'] ) {
					Navbar.sticky.scrollCorrection += parseFloat(mainWrap.css('padding-top'), 10);
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
			var animPostDelay = ( viewport.scrollTop() > 600 ) ? 0 : 200;
			$('.posts-container .article.animated').each( function(index) {
				var elem = $(this);
				setTimeout( function() {
					elem.removeClass('init');
				}, index++ * animPostDelay);
			});

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


	// Functions To Run On Window Resize
	function resizeFn() {
		iframeAspect();
	}
	viewport.resize( $.debounce( 500, resizeFn ));


	// Functions To Run On Load
	viewport.load( function() {

		postsPage();

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

	$(document).ajaxComplete( function() {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiZmVhdGhlcmxpZ2h0LmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJqcXVlcnkucGxhY2Vob2xkZXIuanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuT0E7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDelJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZSAtIHYxLjEgLSAzLzcvMjAxMFxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW5cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuICovXG5cbi8vIFNjcmlwdDogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2U6IFNvbWV0aW1lcywgbGVzcyBpcyBtb3JlIVxuLy9cbi8vICpWZXJzaW9uOiAxLjEsIExhc3QgdXBkYXRlZDogMy83LzIwMTAqXG4vLyBcbi8vIFByb2plY3QgSG9tZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbi8vIEdpdEh1YiAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvXG4vLyBTb3VyY2UgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLmpzXG4vLyAoTWluaWZpZWQpICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLm1pbi5qcyAoMC43a2IpXG4vLyBcbi8vIEFib3V0OiBMaWNlbnNlXG4vLyBcbi8vIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hbixcbi8vIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuLy8gaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuLy8gXG4vLyBBYm91dDogRXhhbXBsZXNcbi8vIFxuLy8gVGhlc2Ugd29ya2luZyBleGFtcGxlcywgY29tcGxldGUgd2l0aCBmdWxseSBjb21tZW50ZWQgY29kZSwgaWxsdXN0cmF0ZSBhIGZld1xuLy8gd2F5cyBpbiB3aGljaCB0aGlzIHBsdWdpbiBjYW4gYmUgdXNlZC5cbi8vIFxuLy8gVGhyb3R0bGUgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL3Rocm90dGxlL1xuLy8gRGVib3VuY2UgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL2RlYm91bmNlL1xuLy8gXG4vLyBBYm91dDogU3VwcG9ydCBhbmQgVGVzdGluZ1xuLy8gXG4vLyBJbmZvcm1hdGlvbiBhYm91dCB3aGF0IHZlcnNpb24gb3IgdmVyc2lvbnMgb2YgalF1ZXJ5IHRoaXMgcGx1Z2luIGhhcyBiZWVuXG4vLyB0ZXN0ZWQgd2l0aCwgd2hhdCBicm93c2VycyBpdCBoYXMgYmVlbiB0ZXN0ZWQgaW4sIGFuZCB3aGVyZSB0aGUgdW5pdCB0ZXN0c1xuLy8gcmVzaWRlIChzbyB5b3UgY2FuIHRlc3QgaXQgeW91cnNlbGYpLlxuLy8gXG4vLyBqUXVlcnkgVmVyc2lvbnMgLSBub25lLCAxLjMuMiwgMS40LjJcbi8vIEJyb3dzZXJzIFRlc3RlZCAtIEludGVybmV0IEV4cGxvcmVyIDYtOCwgRmlyZWZveCAyLTMuNiwgU2FmYXJpIDMtNCwgQ2hyb21lIDQtNSwgT3BlcmEgOS42LTEwLjEuXG4vLyBVbml0IFRlc3RzICAgICAgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3VuaXQvXG4vLyBcbi8vIEFib3V0OiBSZWxlYXNlIEhpc3Rvcnlcbi8vIFxuLy8gMS4xIC0gKDMvNy8yMDEwKSBGaXhlZCBhIGJ1ZyBpbiA8alF1ZXJ5LnRocm90dGxlPiB3aGVyZSB0cmFpbGluZyBjYWxsYmFja3Ncbi8vICAgICAgIGV4ZWN1dGVkIGxhdGVyIHRoYW4gdGhleSBzaG91bGQuIFJld29ya2VkIGEgZmFpciBhbW91bnQgb2YgaW50ZXJuYWxcbi8vICAgICAgIGxvZ2ljIGFzIHdlbGwuXG4vLyAxLjAgLSAoMy82LzIwMTApIEluaXRpYWwgcmVsZWFzZSBhcyBhIHN0YW5kLWFsb25lIHByb2plY3QuIE1pZ3JhdGVkIG92ZXJcbi8vICAgICAgIGZyb20ganF1ZXJ5LW1pc2MgcmVwbyB2MC40IHRvIGpxdWVyeS10aHJvdHRsZSByZXBvIHYxLjAsIGFkZGVkIHRoZVxuLy8gICAgICAgbm9fdHJhaWxpbmcgdGhyb3R0bGUgcGFyYW1ldGVyIGFuZCBkZWJvdW5jZSBmdW5jdGlvbmFsaXR5LlxuLy8gXG4vLyBUb3BpYzogTm90ZSBmb3Igbm9uLWpRdWVyeSB1c2Vyc1xuLy8gXG4vLyBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBiZWNhdXNlIG5vdGhpbmcgaW50ZXJuYWxcbi8vIHVzZXMgYW55IGpRdWVyeSBtZXRob2RzIG9yIHByb3BlcnRpZXMuIGpRdWVyeSBpcyBqdXN0IHVzZWQgYXMgYSBuYW1lc3BhY2Vcbi8vIHVuZGVyIHdoaWNoIHRoZXNlIG1ldGhvZHMgY2FuIGV4aXN0LlxuLy8gXG4vLyBTaW5jZSBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBpZiBqUXVlcnkgZG9lc24ndCBleGlzdFxuLy8gd2hlbiB0aGlzIHBsdWdpbiBpcyBsb2FkZWQsIHRoZSBtZXRob2QgZGVzY3JpYmVkIGJlbG93IHdpbGwgYmUgY3JlYXRlZCBpblxuLy8gdGhlIGBDb3dib3lgIG5hbWVzcGFjZS4gVXNhZ2Ugd2lsbCBiZSBleGFjdGx5IHRoZSBzYW1lLCBidXQgaW5zdGVhZCBvZlxuLy8gJC5tZXRob2QoKSBvciBqUXVlcnkubWV0aG9kKCksIHlvdSdsbCBuZWVkIHRvIHVzZSBDb3dib3kubWV0aG9kKCkuXG5cbihmdW5jdGlvbih3aW5kb3csdW5kZWZpbmVkKXtcbiAgJyQ6bm9tdW5nZSc7IC8vIFVzZWQgYnkgWVVJIGNvbXByZXNzb3IuXG4gIFxuICAvLyBTaW5jZSBqUXVlcnkgcmVhbGx5IGlzbid0IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgdXNlIGBqUXVlcnlgIGFzIHRoZVxuICAvLyBuYW1lc3BhY2Ugb25seSBpZiBpdCBhbHJlYWR5IGV4aXN0cywgb3RoZXJ3aXNlIHVzZSB0aGUgYENvd2JveWAgbmFtZXNwYWNlLFxuICAvLyBjcmVhdGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gIHZhciAkID0gd2luZG93LmpRdWVyeSB8fCB3aW5kb3cuQ293Ym95IHx8ICggd2luZG93LkNvd2JveSA9IHt9ICksXG4gICAgXG4gICAgLy8gSW50ZXJuYWwgbWV0aG9kIHJlZmVyZW5jZS5cbiAgICBqcV90aHJvdHRsZTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LnRocm90dGxlXG4gIC8vIFxuICAvLyBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcbiAgLy8gZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLiBJZiB5b3Ugd2FudCB0b1xuICAvLyByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uIHRvIGEgc2luZ2xlIHRpbWUsIHNlZSB0aGVcbiAgLy8gPGpRdWVyeS5kZWJvdW5jZT4gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vID4gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgdGhyb3R0bGVkID0galF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBub190cmFpbGluZyAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vX3RyYWlsaW5nIGlzXG4gIC8vICAgIHRydWUsIGNhbGxiYWNrIHdpbGwgb25seSBleGVjdXRlIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIHdoaWxlIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkLiBJZiBub190cmFpbGluZyBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZSBhZnRlciB0aGUgbGFzdFxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuXG4gIC8vICAgIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIHRocm90dGxlZCwgZnVuY3Rpb24uXG4gIFxuICAkLnRocm90dGxlID0ganFfdGhyb3R0bGUgPSBmdW5jdGlvbiggZGVsYXksIG5vX3RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VfbW9kZSApIHtcbiAgICAvLyBBZnRlciB3cmFwcGVyIGhhcyBzdG9wcGVkIGJlaW5nIGNhbGxlZCwgdGhpcyB0aW1lb3V0IGVuc3VyZXMgdGhhdFxuICAgIC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuICAgIC8vIGRlYm91bmNlIG1vZGVzLlxuICAgIHZhciB0aW1lb3V0X2lkLFxuICAgICAgXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG4gICAgICBsYXN0X2V4ZWMgPSAwO1xuICAgIFxuICAgIC8vIGBub190cmFpbGluZ2AgZGVmYXVsdHMgdG8gZmFsc3kuXG4gICAgaWYgKCB0eXBlb2Ygbm9fdHJhaWxpbmcgIT09ICdib29sZWFuJyApIHtcbiAgICAgIGRlYm91bmNlX21vZGUgPSBjYWxsYmFjaztcbiAgICAgIGNhbGxiYWNrID0gbm9fdHJhaWxpbmc7XG4gICAgICBub190cmFpbGluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLy8gVGhlIGB3cmFwcGVyYCBmdW5jdGlvbiBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSB0aHJvdHRsaW5nIC8gZGVib3VuY2luZ1xuICAgIC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG4gICAgLy8gaXMgZXhlY3V0ZWQuXG4gICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgZWxhcHNlZCA9ICtuZXcgRGF0ZSgpIC0gbGFzdF9leGVjLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgXG4gICAgICAvLyBFeGVjdXRlIGBjYWxsYmFja2AgYW5kIHVwZGF0ZSB0aGUgYGxhc3RfZXhlY2AgdGltZXN0YW1wLlxuICAgICAgZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgbGFzdF9leGVjID0gK25ldyBEYXRlKCk7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KCB0aGF0LCBhcmdzICk7XG4gICAgICB9O1xuICAgICAgXG4gICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pIHRoaXMgaXMgdXNlZCB0byBjbGVhciB0aGUgZmxhZ1xuICAgICAgLy8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cbiAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aW1lb3V0X2lkID0gdW5kZWZpbmVkO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlICYmICF0aW1lb3V0X2lkICkge1xuICAgICAgICAvLyBTaW5jZSBgd3JhcHBlcmAgaXMgYmVpbmcgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZSBhbmRcbiAgICAgICAgLy8gYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgZXhlY3V0ZSBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIENsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0LlxuICAgICAgdGltZW91dF9pZCAmJiBjbGVhclRpbWVvdXQoIHRpbWVvdXRfaWQgKTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgJiYgZWxhcHNlZCA+IGRlbGF5ICkge1xuICAgICAgICAvLyBJbiB0aHJvdHRsZSBtb2RlLCBpZiBgZGVsYXlgIHRpbWUgaGFzIGJlZW4gZXhjZWVkZWQsIGV4ZWN1dGVcbiAgICAgICAgLy8gYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgICBcbiAgICAgIH0gZWxzZSBpZiAoIG5vX3RyYWlsaW5nICE9PSB0cnVlICkge1xuICAgICAgICAvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG4gICAgICAgIC8vIGV4Y2VlZGVkLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYGRlbGF5YCBtcyBhZnRlciBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBleGVjdXRpb24uXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGVcbiAgICAgICAgLy8gYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuICAgICAgICAvLyBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIHRpbWVvdXRfaWQgPSBzZXRUaW1lb3V0KCBkZWJvdW5jZV9tb2RlID8gY2xlYXIgOiBleGVjLCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgPyBkZWxheSAtIGVsYXBzZWQgOiBkZWxheSApO1xuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgLy8gU2V0IHRoZSBndWlkIG9mIGB3cmFwcGVyYCBmdW5jdGlvbiB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbCBjYWxsYmFjaywgc29cbiAgICAvLyBpdCBjYW4gYmUgcmVtb3ZlZCBpbiBqUXVlcnkgMS40KyAudW5iaW5kIG9yIC5kaWUgYnkgdXNpbmcgdGhlIG9yaWdpbmFsXG4gICAgLy8gY2FsbGJhY2sgYXMgYSByZWZlcmVuY2UuXG4gICAgaWYgKCAkLmd1aWQgKSB7XG4gICAgICB3cmFwcGVyLmd1aWQgPSBjYWxsYmFjay5ndWlkID0gY2FsbGJhY2suZ3VpZCB8fCAkLmd1aWQrKztcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9O1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkuZGVib3VuY2VcbiAgLy8gXG4gIC8vIERlYm91bmNlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBEZWJvdW5jaW5nLCB1bmxpa2UgdGhyb3R0bGluZyxcbiAgLy8gZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gIC8vIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2VyaWVzIG9mIGNhbGxzLCBvciBhdCB0aGUgdmVyeSBlbmQuIElmIHlvdSB3YW50IHRvXG4gIC8vIHNpbXBseSByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLCBzZWUgdGhlIDxqUXVlcnkudGhyb3R0bGU+XG4gIC8vIG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+ICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyA+IFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciBkZWJvdW5jZWQgPSBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIGF0X2JlZ2luIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYXRfYmVnaW4gaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgb25seSBiZSBleGVjdXRlZCBgZGVsYXlgIG1pbGxpc2Vjb25kcyBhZnRlclxuICAvLyAgICB0aGUgbGFzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gSWYgYXRfYmVnaW4gaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBiZVxuICAvLyAgICBleGVjdXRlZCBvbmx5IGF0IHRoZSBmaXJzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZVxuICAvLyAgICBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIGRlYm91bmNlZCwgZnVuY3Rpb24uXG4gIFxuICAkLmRlYm91bmNlID0gZnVuY3Rpb24oIGRlbGF5LCBhdF9iZWdpbiwgY2FsbGJhY2sgKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrID09PSB1bmRlZmluZWRcbiAgICAgID8ganFfdGhyb3R0bGUoIGRlbGF5LCBhdF9iZWdpbiwgZmFsc2UgKVxuICAgICAgOiBqcV90aHJvdHRsZSggZGVsYXksIGNhbGxiYWNrLCBhdF9iZWdpbiAhPT0gZmFsc2UgKTtcbiAgfTtcbiAgXG59KSh0aGlzKTtcbiIsIi8qKlxuICogRmVhdGhlcmxpZ2h0IC0gdWx0cmEgc2xpbSBqUXVlcnkgbGlnaHRib3hcbiAqIFZlcnNpb24gMS4zLjQgLSBodHRwOi8vbm9lbGJvc3MuZ2l0aHViLmlvL2ZlYXRoZXJsaWdodC9cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNSwgTm/Dq2wgUmFvdWwgQm9zc2FydCAoaHR0cDovL3d3dy5ub2VsYm9zcy5jb20pXG4gKiBNSVQgTGljZW5zZWQuXG4qKi9cbihmdW5jdGlvbigkKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmKCd1bmRlZmluZWQnID09PSB0eXBlb2YgJCkge1xuXHRcdGlmKCdjb25zb2xlJyBpbiB3aW5kb3cpeyB3aW5kb3cuY29uc29sZS5pbmZvKCdUb28gbXVjaCBsaWdodG5lc3MsIEZlYXRoZXJsaWdodCBuZWVkcyBqUXVlcnkuJyk7IH1cblx0XHRyZXR1cm47XG5cdH1cblxuXHQvKiBGZWF0aGVybGlnaHQgaXMgZXhwb3J0ZWQgYXMgJC5mZWF0aGVybGlnaHQuXG5cdCAgIEl0IGlzIGEgZnVuY3Rpb24gdXNlZCB0byBvcGVuIGEgZmVhdGhlcmxpZ2h0IGxpZ2h0Ym94LlxuXG5cdCAgIFt0ZWNoXVxuXHQgICBGZWF0aGVybGlnaHQgdXNlcyBwcm90b3R5cGUgaW5oZXJpdGFuY2UuXG5cdCAgIEVhY2ggb3BlbmVkIGxpZ2h0Ym94IHdpbGwgaGF2ZSBhIGNvcnJlc3BvbmRpbmcgb2JqZWN0LlxuXHQgICBUaGF0IG9iamVjdCBtYXkgaGF2ZSBzb21lIGF0dHJpYnV0ZXMgdGhhdCBvdmVycmlkZSB0aGVcblx0ICAgcHJvdG90eXBlJ3MuXG5cdCAgIEV4dGVuc2lvbnMgY3JlYXRlZCB3aXRoIEZlYXRoZXJsaWdodC5leHRlbmQgd2lsbCBoYXZlIHRoZWlyXG5cdCAgIG93biBwcm90b3R5cGUgdGhhdCBpbmhlcml0cyBmcm9tIEZlYXRoZXJsaWdodCdzIHByb3RvdHlwZSxcblx0ICAgdGh1cyBhdHRyaWJ1dGVzIGNhbiBiZSBvdmVycmlkZW4gZWl0aGVyIGF0IHRoZSBvYmplY3QgbGV2ZWwsXG5cdCAgIG9yIGF0IHRoZSBleHRlbnNpb24gbGV2ZWwuXG5cdCAgIFRvIGNyZWF0ZSBjYWxsYmFja3MgdGhhdCBjaGFpbiB0aGVtc2VsdmVzIGluc3RlYWQgb2Ygb3ZlcnJpZGluZyxcblx0ICAgdXNlIGNoYWluQ2FsbGJhY2tzLlxuXHQgICBGb3IgdGhvc2UgZmFtaWxpYXIgd2l0aCBDb2ZmZWVTY3JpcHQsIHRoaXMgY29ycmVzcG9uZCB0b1xuXHQgICBGZWF0aGVybGlnaHQgYmVpbmcgYSBjbGFzcyBhbmQgdGhlIEdhbGxlcnkgYmVpbmcgYSBjbGFzc1xuXHQgICBleHRlbmRpbmcgRmVhdGhlcmxpZ2h0LlxuXHQgICBUaGUgY2hhaW5DYWxsYmFja3MgaXMgdXNlZCBzaW5jZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0b1xuXHQgICBDb2ZmZWVTY3JpcHQncyBgc3VwZXJgLlxuXHQqL1xuXG5cdGZ1bmN0aW9uIEZlYXRoZXJsaWdodCgkY29udGVudCwgY29uZmlnKSB7XG5cdFx0aWYodGhpcyBpbnN0YW5jZW9mIEZlYXRoZXJsaWdodCkgeyAgLyogY2FsbGVkIHdpdGggbmV3ICovXG5cdFx0XHR0aGlzLmlkID0gRmVhdGhlcmxpZ2h0LmlkKys7XG5cdFx0XHR0aGlzLnNldHVwKCRjb250ZW50LCBjb25maWcpO1xuXHRcdFx0dGhpcy5jaGFpbkNhbGxiYWNrcyhGZWF0aGVybGlnaHQuX2NhbGxiYWNrQ2hhaW4pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgZmwgPSBuZXcgRmVhdGhlcmxpZ2h0KCRjb250ZW50LCBjb25maWcpO1xuXHRcdFx0Zmwub3BlbigpO1xuXHRcdFx0cmV0dXJuIGZsO1xuXHRcdH1cblx0fVxuXG5cdHZhciBvcGVuZWQgPSBbXSxcblx0XHRwcnVuZU9wZW5lZCA9IGZ1bmN0aW9uKHJlbW92ZSkge1xuXHRcdFx0b3BlbmVkID0gJC5ncmVwKG9wZW5lZCwgZnVuY3Rpb24oZmwpIHtcblx0XHRcdFx0cmV0dXJuIGZsICE9PSByZW1vdmUgJiYgZmwuJGluc3RhbmNlLmNsb3Nlc3QoJ2JvZHknKS5sZW5ndGggPiAwO1xuXHRcdFx0fSApO1xuXHRcdFx0cmV0dXJuIG9wZW5lZDtcblx0XHR9O1xuXG5cdC8vIHN0cnVjdHVyZSh7aWZyYW1lTWluSGVpZ2h0OiA0NCwgZm9vOiAwfSwgJ2lmcmFtZScpXG5cdC8vICAgIz0+IHttaW4taGVpZ2h0OiA0NH1cblx0dmFyIHN0cnVjdHVyZSA9IGZ1bmN0aW9uKG9iaiwgcHJlZml4KSB7XG5cdFx0dmFyIHJlc3VsdCA9IHt9LFxuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHByZWZpeCArICcoW0EtWl0pKC4qKScpO1xuXHRcdGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0XHRcdHZhciBtYXRjaCA9IGtleS5tYXRjaChyZWdleCk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0dmFyIGRhc2hlcml6ZWQgPSAobWF0Y2hbMV0gKyBtYXRjaFsyXS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0cmVzdWx0W2Rhc2hlcml6ZWRdID0gb2JqW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0LyogZG9jdW1lbnQgd2lkZSBrZXkgaGFuZGxlciAqL1xuXHR2YXIgZXZlbnRNYXAgPSB7IGtleXVwOiAnb25LZXlVcCcsIHJlc2l6ZTogJ29uUmVzaXplJyB9O1xuXG5cdHZhciBnbG9iYWxFdmVudEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdCQuZWFjaChGZWF0aGVybGlnaHQub3BlbmVkKCkucmV2ZXJzZSgpLCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICghZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcblx0XHRcdFx0aWYgKGZhbHNlID09PSB0aGlzW2V2ZW50TWFwW2V2ZW50LnR5cGVdXShldmVudCkpIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgcmV0dXJuIGZhbHNlO1xuXHRcdFx0ICB9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIHRvZ2dsZUdsb2JhbEV2ZW50cyA9IGZ1bmN0aW9uKHNldCkge1xuXHRcdFx0aWYoc2V0ICE9PSBGZWF0aGVybGlnaHQuX2dsb2JhbEhhbmRsZXJJbnN0YWxsZWQpIHtcblx0XHRcdFx0RmVhdGhlcmxpZ2h0Ll9nbG9iYWxIYW5kbGVySW5zdGFsbGVkID0gc2V0O1xuXHRcdFx0XHR2YXIgZXZlbnRzID0gJC5tYXAoZXZlbnRNYXAsIGZ1bmN0aW9uKF8sIG5hbWUpIHsgcmV0dXJuIG5hbWUrJy4nK0ZlYXRoZXJsaWdodC5wcm90b3R5cGUubmFtZXNwYWNlOyB9ICkuam9pbignICcpO1xuXHRcdFx0XHQkKHdpbmRvdylbc2V0ID8gJ29uJyA6ICdvZmYnXShldmVudHMsIGdsb2JhbEV2ZW50SGFuZGxlcik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRGZWF0aGVybGlnaHQucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBGZWF0aGVybGlnaHQsXG5cdFx0LyoqKiBkZWZhdWx0cyAqKiovXG5cdFx0LyogZXh0ZW5kIGZlYXRoZXJsaWdodCB3aXRoIGRlZmF1bHRzIGFuZCBtZXRob2RzICovXG5cdFx0bmFtZXNwYWNlOiAgICAnZmVhdGhlcmxpZ2h0JywgICAgICAgICAvKiBOYW1lIG9mIHRoZSBldmVudHMgYW5kIGNzcyBjbGFzcyBwcmVmaXggKi9cblx0XHR0YXJnZXRBdHRyOiAgICdkYXRhLWZlYXRoZXJsaWdodCcsICAgIC8qIEF0dHJpYnV0ZSBvZiB0aGUgdHJpZ2dlcmVkIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgc2VsZWN0b3IgdG8gdGhlIGxpZ2h0Ym94IGNvbnRlbnQgKi9cblx0XHR2YXJpYW50OiAgICAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIENsYXNzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byBjaGFuZ2UgbG9vayBvZiB0aGUgbGlnaHRib3ggKi9cblx0XHRyZXNldENzczogICAgIGZhbHNlLCAgICAgICAgICAgICAgICAgIC8qIFJlc2V0IGFsbCBjc3MgKi9cblx0XHRiYWNrZ3JvdW5kOiAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIEN1c3RvbSBET00gZm9yIHRoZSBiYWNrZ3JvdW5kLCB3cmFwcGVyIGFuZCB0aGUgY2xvc2VidXR0b24gKi9cblx0XHRvcGVuVHJpZ2dlcjogICdjbGljaycsICAgICAgICAgICAgICAgIC8qIEV2ZW50IHRoYXQgdHJpZ2dlcnMgdGhlIGxpZ2h0Ym94ICovXG5cdFx0Y2xvc2VUcmlnZ2VyOiAnY2xpY2snLCAgICAgICAgICAgICAgICAvKiBFdmVudCB0aGF0IHRyaWdnZXJzIHRoZSBjbG9zaW5nIG9mIHRoZSBsaWdodGJveCAqL1xuXHRcdGZpbHRlcjogICAgICAgbnVsbCwgICAgICAgICAgICAgICAgICAgLyogU2VsZWN0b3IgdG8gZmlsdGVyIGV2ZW50cy4gVGhpbmsgJCguLi4pLm9uKCdjbGljaycsIGZpbHRlciwgZXZlbnRIYW5kbGVyKSAqL1xuXHRcdHJvb3Q6ICAgICAgICAgJ2JvZHknLCAgICAgICAgICAgICAgICAgLyogV2hlcmUgdG8gYXBwZW5kIGZlYXRoZXJsaWdodHMgKi9cblx0XHRvcGVuU3BlZWQ6ICAgIDI1MCwgICAgICAgICAgICAgICAgICAgIC8qIER1cmF0aW9uIG9mIG9wZW5pbmcgYW5pbWF0aW9uICovXG5cdFx0Y2xvc2VTcGVlZDogICAyNTAsICAgICAgICAgICAgICAgICAgICAvKiBEdXJhdGlvbiBvZiBjbG9zaW5nIGFuaW1hdGlvbiAqL1xuXHRcdGNsb3NlT25DbGljazogJ2JhY2tncm91bmQnLCAgICAgICAgICAgLyogQ2xvc2UgbGlnaHRib3ggb24gY2xpY2sgKCdiYWNrZ3JvdW5kJywgJ2FueXdoZXJlJyBvciBmYWxzZSkgKi9cblx0XHRjbG9zZU9uRXNjOiAgIHRydWUsICAgICAgICAgICAgICAgICAgIC8qIENsb3NlIGxpZ2h0Ym94IHdoZW4gcHJlc3NpbmcgZXNjICovXG5cdFx0Y2xvc2VJY29uOiAgICAnJiMxMDAwNTsnLCAgICAgICAgICAgICAvKiBDbG9zZSBpY29uICovXG5cdFx0bG9hZGluZzogICAgICAnJywgICAgICAgICAgICAgICAgICAgICAvKiBDb250ZW50IHRvIHNob3cgd2hpbGUgaW5pdGlhbCBjb250ZW50IGlzIGxvYWRpbmcgKi9cblx0XHRwZXJzaXN0OiAgICAgIGZhbHNlLFx0XHRcdFx0XHRcdFx0XHRcdC8qIElmIHNldCwgdGhlIGNvbnRlbnQgcGVyc2lzdCBhbmQgd2lsbCBiZSBzaG93biBhZ2FpbiB3aGVuIG9wZW5lZCBhZ2Fpbi4gJ3NoYXJlZCcgaXMgYSBzcGVjaWFsIHZhbHVlIHdoZW4gYmluZGluZyBtdWx0aXBsZSBlbGVtZW50cyBmb3IgdGhlbSB0byBzaGFyZSB0aGUgc2FtZSBjb250ZW50ICovXG5cdFx0b3RoZXJDbG9zZTogICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBTZWxlY3RvciBmb3IgYWx0ZXJuYXRlIGNsb3NlIGJ1dHRvbnMgKGUuZy4gXCJhLmNsb3NlXCIpICovXG5cdFx0YmVmb3JlT3BlbjogICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYmVmb3JlIG9wZW4uIGNhbiByZXR1cm4gZmFsc2UgdG8gcHJldmVudCBvcGVuaW5nIG9mIGxpZ2h0Ym94LiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xuXHRcdGJlZm9yZUNvbnRlbnQ6ICQubm9vcCwgICAgICAgICAgICAgICAgLyogQ2FsbGVkIHdoZW4gY29udGVudCBpcyBsb2FkZWQuIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXG5cdFx0YmVmb3JlQ2xvc2U6ICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYmVmb3JlIGNsb3NlLiBjYW4gcmV0dXJuIGZhbHNlIHRvIHByZXZlbnQgb3BlbmluZyBvZiBsaWdodGJveC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cblx0XHRhZnRlck9wZW46ICAgICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBvcGVuLiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xuXHRcdGFmdGVyQ29udGVudDogJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIGNvbnRlbnQgaXMgcmVhZHkgYW5kIGhhcyBiZWVuIHNldC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cblx0XHRhZnRlckNsb3NlOiAgICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBjbG9zZS4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cblx0XHRvbktleVVwOiAgICAgICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBvbiBrZXkgZG93biBmb3IgdGhlIGZyb250bW9zdCBmZWF0aGVybGlnaHQgKi9cblx0XHRvblJlc2l6ZTogICAgICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBuZXcgY29udGVudCBhbmQgd2hlbiBhIHdpbmRvdyBpcyByZXNpemVkICovXG5cdFx0dHlwZTogICAgICAgICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBTcGVjaWZ5IHR5cGUgb2YgbGlnaHRib3guIElmIHVuc2V0LCBpdCB3aWxsIGNoZWNrIGZvciB0aGUgdGFyZ2V0QXR0cnMgdmFsdWUuICovXG5cdFx0Y29udGVudEZpbHRlcnM6IFsnanF1ZXJ5JywgJ2ltYWdlJywgJ2h0bWwnLCAnYWpheCcsICdpZnJhbWUnLCAndGV4dCddLCAvKiBMaXN0IG9mIGNvbnRlbnQgZmlsdGVycyB0byB1c2UgdG8gZGV0ZXJtaW5lIHRoZSBjb250ZW50ICovXG5cblx0XHQvKioqIG1ldGhvZHMgKioqL1xuXHRcdC8qIHNldHVwIGl0ZXJhdGVzIG92ZXIgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgZmVhdGhlcmxpZ2h0IGFuZCBwcmVwYXJlcyB0aGUgYmFja2dyb3VuZCBhbmQgYmluZHMgdGhlIGV2ZW50cyAqL1xuXHRcdHNldHVwOiBmdW5jdGlvbih0YXJnZXQsIGNvbmZpZyl7XG5cdFx0XHQvKiBhbGwgYXJndW1lbnRzIGFyZSBvcHRpb25hbCAqL1xuXHRcdFx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mICQgPT09IGZhbHNlICYmICFjb25maWcpIHtcblx0XHRcdFx0Y29uZmlnID0gdGFyZ2V0O1xuXHRcdFx0XHR0YXJnZXQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzZWxmID0gJC5leHRlbmQodGhpcywgY29uZmlnLCB7dGFyZ2V0OiB0YXJnZXR9KSxcblx0XHRcdFx0Y3NzID0gIXNlbGYucmVzZXRDc3MgPyBzZWxmLm5hbWVzcGFjZSA6IHNlbGYubmFtZXNwYWNlKyctcmVzZXQnLCAvKiBieSBhZGRpbmcgLXJlc2V0IHRvIHRoZSBjbGFzc25hbWUsIHdlIHJlc2V0IGFsbCB0aGUgZGVmYXVsdCBjc3MgKi9cblx0XHRcdFx0JGJhY2tncm91bmQgPSAkKHNlbGYuYmFja2dyb3VuZCB8fCBbXG5cdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCInK2NzcysnLWxvYWRpbmcgJytjc3MrJ1wiPicsXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicrY3NzKyctY29udGVudFwiPicsXG5cdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicrY3NzKyctY2xvc2UtaWNvbiAnKyBzZWxmLm5hbWVzcGFjZSArICctY2xvc2VcIj4nLFxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2xvc2VJY29uLFxuXHRcdFx0XHRcdFx0XHQnPC9zcGFuPicsXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiJytzZWxmLm5hbWVzcGFjZSsnLWlubmVyXCI+JyArIHNlbGYubG9hZGluZyArICc8L2Rpdj4nLFxuXHRcdFx0XHRcdFx0JzwvZGl2PicsXG5cdFx0XHRcdFx0JzwvZGl2PiddLmpvaW4oJycpKSxcblx0XHRcdFx0Y2xvc2VCdXR0b25TZWxlY3RvciA9ICcuJytzZWxmLm5hbWVzcGFjZSsnLWNsb3NlJyArIChzZWxmLm90aGVyQ2xvc2UgPyAnLCcgKyBzZWxmLm90aGVyQ2xvc2UgOiAnJyk7XG5cblx0XHRcdHNlbGYuJGluc3RhbmNlID0gJGJhY2tncm91bmQuY2xvbmUoKS5hZGRDbGFzcyhzZWxmLnZhcmlhbnQpOyAvKiBjbG9uZSBET00gZm9yIHRoZSBiYWNrZ3JvdW5kLCB3cmFwcGVyIGFuZCB0aGUgY2xvc2UgYnV0dG9uICovXG5cblx0XHRcdC8qIGNsb3NlIHdoZW4gY2xpY2sgb24gYmFja2dyb3VuZC9hbnl3aGVyZS9udWxsIG9yIGNsb3NlYm94ICovXG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5vbihzZWxmLmNsb3NlVHJpZ2dlcisnLicrc2VsZi5uYW1lc3BhY2UsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdHZhciAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXHRcdFx0XHRpZiggKCdiYWNrZ3JvdW5kJyA9PT0gc2VsZi5jbG9zZU9uQ2xpY2sgICYmICR0YXJnZXQuaXMoJy4nK3NlbGYubmFtZXNwYWNlKSlcblx0XHRcdFx0XHR8fCAnYW55d2hlcmUnID09PSBzZWxmLmNsb3NlT25DbGlja1xuXHRcdFx0XHRcdHx8ICR0YXJnZXQuY2xvc2VzdChjbG9zZUJ1dHRvblNlbGVjdG9yKS5sZW5ndGggKXtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHNlbGYuY2xvc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblx0XHQvKiB0aGlzIG1ldGhvZCBwcmVwYXJlcyB0aGUgY29udGVudCBhbmQgY29udmVydHMgaXQgaW50byBhIGpRdWVyeSBvYmplY3Qgb3IgYSBwcm9taXNlICovXG5cdFx0Z2V0Q29udGVudDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKHRoaXMucGVyc2lzdCAhPT0gZmFsc2UgJiYgdGhpcy4kY29udGVudCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4kY29udGVudDtcblx0XHRcdH1cblx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0ZmlsdGVycyA9IHRoaXMuY29uc3RydWN0b3IuY29udGVudEZpbHRlcnMsXG5cdFx0XHRcdHJlYWRUYXJnZXRBdHRyID0gZnVuY3Rpb24obmFtZSl7IHJldHVybiBzZWxmLiRjdXJyZW50VGFyZ2V0ICYmIHNlbGYuJGN1cnJlbnRUYXJnZXQuYXR0cihuYW1lKTsgfSxcblx0XHRcdFx0dGFyZ2V0VmFsdWUgPSByZWFkVGFyZ2V0QXR0cihzZWxmLnRhcmdldEF0dHIpLFxuXHRcdFx0XHRkYXRhID0gc2VsZi50YXJnZXQgfHwgdGFyZ2V0VmFsdWUgfHwgJyc7XG5cblx0XHRcdC8qIEZpbmQgd2hpY2ggZmlsdGVyIGFwcGxpZXMgKi9cblx0XHRcdHZhciBmaWx0ZXIgPSBmaWx0ZXJzW3NlbGYudHlwZV07IC8qIGNoZWNrIGV4cGxpY2l0IHR5cGUgbGlrZSB7dHlwZTogJ2ltYWdlJ30gKi9cblxuXHRcdFx0LyogY2hlY2sgZXhwbGljaXQgdHlwZSBsaWtlIGRhdGEtZmVhdGhlcmxpZ2h0PVwiaW1hZ2VcIiAqL1xuXHRcdFx0aWYoIWZpbHRlciAmJiBkYXRhIGluIGZpbHRlcnMpIHtcblx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyc1tkYXRhXTtcblx0XHRcdFx0ZGF0YSA9IHNlbGYudGFyZ2V0ICYmIHRhcmdldFZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0ZGF0YSA9IGRhdGEgfHwgcmVhZFRhcmdldEF0dHIoJ2hyZWYnKSB8fCAnJztcblxuXHRcdFx0LyogY2hlY2sgZXhwbGljaXR5IHR5cGUgJiBjb250ZW50IGxpa2Uge2ltYWdlOiAncGhvdG8uanBnJ30gKi9cblx0XHRcdGlmKCFmaWx0ZXIpIHtcblx0XHRcdFx0Zm9yKHZhciBmaWx0ZXJOYW1lIGluIGZpbHRlcnMpIHtcblx0XHRcdFx0XHRpZihzZWxmW2ZpbHRlck5hbWVdKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW2ZpbHRlck5hbWVdO1xuXHRcdFx0XHRcdFx0ZGF0YSA9IHNlbGZbZmlsdGVyTmFtZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8qIG90aGVyd2lzZSBpdCdzIGltcGxpY2l0LCBydW4gY2hlY2tzICovXG5cdFx0XHRpZighZmlsdGVyKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBkYXRhO1xuXHRcdFx0XHRkYXRhID0gbnVsbDtcblx0XHRcdFx0JC5lYWNoKHNlbGYuY29udGVudEZpbHRlcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGZpbHRlciA9IGZpbHRlcnNbdGhpc107XG5cdFx0XHRcdFx0aWYoZmlsdGVyLnRlc3QpICB7XG5cdFx0XHRcdFx0XHRkYXRhID0gZmlsdGVyLnRlc3QodGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoIWRhdGEgJiYgZmlsdGVyLnJlZ2V4ICYmIHRhcmdldC5tYXRjaCAmJiB0YXJnZXQubWF0Y2goZmlsdGVyLnJlZ2V4KSkge1xuXHRcdFx0XHRcdFx0ZGF0YSA9IHRhcmdldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuICFkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYoIWRhdGEpIHtcblx0XHRcdFx0XHRpZignY29uc29sZScgaW4gd2luZG93KXsgd2luZG93LmNvbnNvbGUuZXJyb3IoJ0ZlYXRoZXJsaWdodDogbm8gY29udGVudCBmaWx0ZXIgZm91bmQgJyArICh0YXJnZXQgPyAnIGZvciBcIicgKyB0YXJnZXQgKyAnXCInIDogJyAobm8gdGFyZ2V0IHNwZWNpZmllZCknKSk7IH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8qIFByb2Nlc3MgaXQgKi9cblx0XHRcdHJldHVybiBmaWx0ZXIucHJvY2Vzcy5jYWxsKHNlbGYsIGRhdGEpO1xuXHRcdH0sXG5cblx0XHQvKiBzZXRzIHRoZSBjb250ZW50IG9mICRpbnN0YW5jZSB0byAkY29udGVudCAqL1xuXHRcdHNldENvbnRlbnQ6IGZ1bmN0aW9uKCRjb250ZW50KXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdC8qIHdlIG5lZWQgYSBzcGVjaWFsIGNsYXNzIGZvciB0aGUgaWZyYW1lICovXG5cdFx0XHRpZigkY29udGVudC5pcygnaWZyYW1lJykgfHwgJCgnaWZyYW1lJywgJGNvbnRlbnQpLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRzZWxmLiRpbnN0YW5jZS5hZGRDbGFzcyhzZWxmLm5hbWVzcGFjZSsnLWlmcmFtZScpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5yZW1vdmVDbGFzcyhzZWxmLm5hbWVzcGFjZSsnLWxvYWRpbmcnKTtcblxuXHRcdFx0LyogcmVwbGFjZSBjb250ZW50IGJ5IGFwcGVuZGluZyB0byBleGlzdGluZyBvbmUgYmVmb3JlIGl0IGlzIHJlbW92ZWRcblx0XHRcdCAgIHRoaXMgaW5zdXJlcyB0aGF0IGZlYXRoZXJsaWdodC1pbm5lciByZW1haW4gYXQgdGhlIHNhbWUgcmVsYXRpdmVcblx0XHRcdFx0IHBvc2l0aW9uIHRvIGFueSBvdGhlciBpdGVtcyBhZGRlZCB0byBmZWF0aGVybGlnaHQtY29udGVudCAqL1xuXHRcdFx0c2VsZi4kaW5zdGFuY2UuZmluZCgnLicrc2VsZi5uYW1lc3BhY2UrJy1pbm5lcicpXG5cdFx0XHRcdC5ub3QoJGNvbnRlbnQpICAgICAgICAgICAgICAgIC8qIGV4Y2x1ZGVkIG5ldyBjb250ZW50LCBpbXBvcnRhbnQgaWYgcGVyc2lzdGVkICovXG5cdFx0XHRcdC5zbGljZSgxKS5yZW1vdmUoKS5lbmQoKVx0XHRcdC8qIEluIHRoZSB1bmV4cGVjdGVkIGV2ZW50IHdoZXJlIHRoZXJlIGFyZSBtYW55IGlubmVyIGVsZW1lbnRzLCByZW1vdmUgYWxsIGJ1dCB0aGUgZmlyc3Qgb25lICovXG5cdFx0XHRcdC5yZXBsYWNlV2l0aCgkLmNvbnRhaW5zKHNlbGYuJGluc3RhbmNlWzBdLCAkY29udGVudFswXSkgPyAnJyA6ICRjb250ZW50KTtcblxuXHRcdFx0c2VsZi4kY29udGVudCA9ICRjb250ZW50LmFkZENsYXNzKHNlbGYubmFtZXNwYWNlKyctaW5uZXInKTtcblxuXHRcdFx0cmV0dXJuIHNlbGY7XG5cdFx0fSxcblxuXHRcdC8qIG9wZW5zIHRoZSBsaWdodGJveC4gXCJ0aGlzXCIgY29udGFpbnMgJGluc3RhbmNlIHdpdGggdGhlIGxpZ2h0Ym94LCBhbmQgd2l0aCB0aGUgY29uZmlnLlxuXHRcdFx0UmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBhZnRlciBpcyBzdWNjZXNzZnVsbHkgb3BlbmVkLiAqL1xuXHRcdG9wZW46IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHNlbGYuJGluc3RhbmNlLmhpZGUoKS5hcHBlbmRUbyhzZWxmLnJvb3QpO1xuXHRcdFx0aWYoKCFldmVudCB8fCAhZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpXG5cdFx0XHRcdCYmIHNlbGYuYmVmb3JlT3BlbihldmVudCkgIT09IGZhbHNlKSB7XG5cblx0XHRcdFx0aWYoZXZlbnQpe1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyICRjb250ZW50ID0gc2VsZi5nZXRDb250ZW50KCk7XG5cblx0XHRcdFx0aWYoJGNvbnRlbnQpIHtcblx0XHRcdFx0XHRvcGVuZWQucHVzaChzZWxmKTtcblxuXHRcdFx0XHRcdHRvZ2dsZUdsb2JhbEV2ZW50cyh0cnVlKTtcblxuXHRcdFx0XHRcdHNlbGYuJGluc3RhbmNlLmZhZGVJbihzZWxmLm9wZW5TcGVlZCk7XG5cdFx0XHRcdFx0c2VsZi5iZWZvcmVDb250ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRcdC8qIFNldCBjb250ZW50IGFuZCBzaG93ICovXG5cdFx0XHRcdFx0cmV0dXJuICQud2hlbigkY29udGVudClcblx0XHRcdFx0XHRcdC5hbHdheXMoZnVuY3Rpb24oJGNvbnRlbnQpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLnNldENvbnRlbnQoJGNvbnRlbnQpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmFmdGVyQ29udGVudChldmVudCk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRoZW4oc2VsZi4kaW5zdGFuY2UucHJvbWlzZSgpKVxuXHRcdFx0XHRcdFx0LyogQ2FsbCBhZnRlck9wZW4gYWZ0ZXIgZmFkZUluIGlzIGRvbmUgKi9cblx0XHRcdFx0XHRcdC5kb25lKGZ1bmN0aW9uKCl7IHNlbGYuYWZ0ZXJPcGVuKGV2ZW50KTsgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNlbGYuJGluc3RhbmNlLmRldGFjaCgpO1xuXHRcdFx0cmV0dXJuICQuRGVmZXJyZWQoKS5yZWplY3QoKS5wcm9taXNlKCk7XG5cdFx0fSxcblxuXHRcdC8qIGNsb3NlcyB0aGUgbGlnaHRib3guIFwidGhpc1wiIGNvbnRhaW5zICRpbnN0YW5jZSB3aXRoIHRoZSBsaWdodGJveCwgYW5kIHdpdGggdGhlIGNvbmZpZ1xuXHRcdFx0cmV0dXJucyBhIHByb21pc2UsIHJlc29sdmVkIGFmdGVyIHRoZSBsaWdodGJveCBpcyBzdWNjZXNzZnVsbHkgY2xvc2VkLiAqL1xuXHRcdGNsb3NlOiBmdW5jdGlvbihldmVudCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0XHRpZihzZWxmLmJlZm9yZUNsb3NlKGV2ZW50KSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICgwID09PSBwcnVuZU9wZW5lZChzZWxmKS5sZW5ndGgpIHtcblx0XHRcdFx0XHR0b2dnbGVHbG9iYWxFdmVudHMoZmFsc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuZmFkZU91dChzZWxmLmNsb3NlU3BlZWQsZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRzZWxmLiRpbnN0YW5jZS5kZXRhY2goKTtcblx0XHRcdFx0XHRzZWxmLmFmdGVyQ2xvc2UoZXZlbnQpO1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHRcdH0sXG5cblx0XHQvKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGNoYWluIGNhbGxiYWNrc1xuXHRcdCAgIFtXYXJuaW5nOiBndXJ1LWxldmVsXVxuXHRcdCAgIFVzZWQgYmUgZXh0ZW5zaW9ucyB0aGF0IHdhbnQgdG8gbGV0IHVzZXJzIHNwZWNpZnkgY2FsbGJhY2tzIGJ1dFxuXHRcdCAgIGFsc28gbmVlZCB0aGVtc2VsdmVzIHRvIHVzZSB0aGUgY2FsbGJhY2tzLlxuXHRcdCAgIFRoZSBhcmd1bWVudCAnY2hhaW4nIGhhcyBjYWxsYmFjayBuYW1lcyBhcyBrZXlzIGFuZCBmdW5jdGlvbihzdXBlciwgZXZlbnQpXG5cdFx0ICAgYXMgdmFsdWVzLiBUaGF0IGZ1bmN0aW9uIGlzIG1lYW50IHRvIGNhbGwgYHN1cGVyYCBhdCBzb21lIHBvaW50LlxuXHRcdCovXG5cdFx0Y2hhaW5DYWxsYmFja3M6IGZ1bmN0aW9uKGNoYWluKSB7XG5cdFx0XHRmb3IgKHZhciBuYW1lIGluIGNoYWluKSB7XG5cdFx0XHRcdHRoaXNbbmFtZV0gPSAkLnByb3h5KGNoYWluW25hbWVdLCB0aGlzLCAkLnByb3h5KHRoaXNbbmFtZV0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoRmVhdGhlcmxpZ2h0LCB7XG5cdFx0aWQ6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVXNlZCB0byBpZCBzaW5nbGUgZmVhdGhlcmxpZ2h0IGluc3RhbmNlcyAqL1xuXHRcdGF1dG9CaW5kOiAgICAgICAnW2RhdGEtZmVhdGhlcmxpZ2h0XScsICAgIC8qIFdpbGwgYXV0b21hdGljYWxseSBiaW5kIGVsZW1lbnRzIG1hdGNoaW5nIHRoaXMgc2VsZWN0b3IuIENsZWFyIG9yIHNldCBiZWZvcmUgb25SZWFkeSAqL1xuXHRcdGRlZmF1bHRzOiAgICAgICBGZWF0aGVybGlnaHQucHJvdG90eXBlLCAgIC8qIFlvdSBjYW4gYWNjZXNzIGFuZCBvdmVycmlkZSBhbGwgZGVmYXVsdHMgdXNpbmcgJC5mZWF0aGVybGlnaHQuZGVmYXVsdHMsIHdoaWNoIGlzIGp1c3QgYSBzeW5vbnltIGZvciAkLmZlYXRoZXJsaWdodC5wcm90b3R5cGUgKi9cblx0XHQvKiBDb250YWlucyB0aGUgbG9naWMgdG8gZGV0ZXJtaW5lIGNvbnRlbnQgKi9cblx0XHRjb250ZW50RmlsdGVyczoge1xuXHRcdFx0anF1ZXJ5OiB7XG5cdFx0XHRcdHJlZ2V4OiAvXlsjLl1cXHcvLCAgICAgICAgIC8qIEFueXRoaW5nIHRoYXQgc3RhcnRzIHdpdGggYSBjbGFzcyBuYW1lIG9yIGlkZW50aWZpZXJzICovXG5cdFx0XHRcdHRlc3Q6IGZ1bmN0aW9uKGVsZW0pICAgIHsgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiAkICYmIGVsZW07IH0sXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKGVsZW0pIHsgcmV0dXJuIHRoaXMucGVyc2lzdCAhPT0gZmFsc2UgPyAkKGVsZW0pIDogJChlbGVtKS5jbG9uZSh0cnVlKTsgfVxuXHRcdFx0fSxcblx0XHRcdGltYWdlOiB7XG5cdFx0XHRcdHJlZ2V4OiAvXFwuKHBuZ3xqcGd8anBlZ3xnaWZ8dGlmZnxibXB8c3ZnKShcXD9cXFMqKT8kL2ksXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkgIHtcblx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdFx0XHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKSxcblx0XHRcdFx0XHRcdGltZyA9IG5ldyBJbWFnZSgpLFxuXHRcdFx0XHRcdFx0JGltZyA9ICQoJzxpbWcgc3JjPVwiJyt1cmwrJ1wiIGFsdD1cIlwiIGNsYXNzPVwiJytzZWxmLm5hbWVzcGFjZSsnLWltYWdlXCIgLz4nKTtcblx0XHRcdFx0XHRpbWcub25sb2FkICA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogU3RvcmUgbmF0dXJhbFdpZHRoICYgaGVpZ2h0IGZvciBJRTggKi9cblx0XHRcdFx0XHRcdCRpbWcubmF0dXJhbFdpZHRoID0gaW1nLndpZHRoOyAkaW1nLm5hdHVyYWxIZWlnaHQgPSBpbWcuaGVpZ2h0O1xuXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSggJGltZyApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0aW1nLm9uZXJyb3IgPSBmdW5jdGlvbigpIHsgZGVmZXJyZWQucmVqZWN0KCRpbWcpOyB9O1xuXHRcdFx0XHRcdGltZy5zcmMgPSB1cmw7XG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGh0bWw6IHtcblx0XHRcdFx0cmVnZXg6IC9eXFxzKjxbXFx3IV1bXjxdKj4vLCAvKiBBbnl0aGluZyB0aGF0IHN0YXJ0cyB3aXRoIHNvbWUga2luZCBvZiB2YWxpZCB0YWcgKi9cblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24oaHRtbCkgeyByZXR1cm4gJChodG1sKTsgfVxuXHRcdFx0fSxcblx0XHRcdGFqYXg6IHtcblx0XHRcdFx0cmVnZXg6IC8uLywgICAgICAgICAgICAvKiBBdCB0aGlzIHBvaW50LCBhbnkgY29udGVudCBpcyBhc3N1bWVkIHRvIGJlIGFuIFVSTCAqL1xuXHRcdFx0XHRwcm9jZXNzOiBmdW5jdGlvbih1cmwpICB7XG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cdFx0XHRcdFx0Lyogd2UgYXJlIHVzaW5nIGxvYWQgc28gb25lIGNhbiBzcGVjaWZ5IGEgdGFyZ2V0IHdpdGg6IHVybC5odG1sICN0YXJnZXRlbGVtZW50ICovXG5cdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmxvYWQodXJsLCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKXtcblx0XHRcdFx0XHRcdGlmICggc3RhdHVzICE9PSBcImVycm9yXCIgKSB7XG5cdFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoJGNvbnRhaW5lci5jb250ZW50cygpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRlZmVycmVkLmZhaWwoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aWZyYW1lOiB7XG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0XHRcdHZhciBkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cdFx0XHRcdFx0dmFyICRjb250ZW50ID0gJCgnPGlmcmFtZS8+Jylcblx0XHRcdFx0XHRcdC5oaWRlKClcblx0XHRcdFx0XHRcdC5hdHRyKCdzcmMnLCB1cmwpXG5cdFx0XHRcdFx0XHQuY3NzKHN0cnVjdHVyZSh0aGlzLCAnaWZyYW1lJykpXG5cdFx0XHRcdFx0XHQub24oJ2xvYWQnLCBmdW5jdGlvbigpIHsgZGVmZXJyZWQucmVzb2x2ZSgkY29udGVudC5zaG93KCkpOyB9KVxuXHRcdFx0XHRcdFx0Ly8gV2UgY2FuJ3QgbW92ZSBhbiA8aWZyYW1lPiBhbmQgYXZvaWQgcmVsb2FkaW5nIGl0LFxuXHRcdFx0XHRcdFx0Ly8gc28gbGV0J3MgcHV0IGl0IGluIHBsYWNlIG91cnNlbHZlcyByaWdodCBub3c6XG5cdFx0XHRcdFx0XHQuYXBwZW5kVG8odGhpcy4kaW5zdGFuY2UuZmluZCgnLicgKyB0aGlzLm5hbWVzcGFjZSArICctY29udGVudCcpKTtcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dGV4dDoge1xuXHRcdFx0XHRwcm9jZXNzOiBmdW5jdGlvbih0ZXh0KSB7IHJldHVybiAkKCc8ZGl2PicsIHt0ZXh0OiB0ZXh0fSk7IH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZnVuY3Rpb25BdHRyaWJ1dGVzOiBbJ2JlZm9yZU9wZW4nLCAnYWZ0ZXJPcGVuJywgJ2JlZm9yZUNvbnRlbnQnLCAnYWZ0ZXJDb250ZW50JywgJ2JlZm9yZUNsb3NlJywgJ2FmdGVyQ2xvc2UnXSxcblxuXHRcdC8qKiogY2xhc3MgbWV0aG9kcyAqKiovXG5cdFx0LyogcmVhZCBlbGVtZW50J3MgYXR0cmlidXRlcyBzdGFydGluZyB3aXRoIGRhdGEtZmVhdGhlcmxpZ2h0LSAqL1xuXHRcdHJlYWRFbGVtZW50Q29uZmlnOiBmdW5jdGlvbihlbGVtZW50LCBuYW1lc3BhY2UpIHtcblx0XHRcdHZhciBLbGFzcyA9IHRoaXMsXG5cdFx0XHRcdHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ15kYXRhLScgKyBuYW1lc3BhY2UgKyAnLSguKiknKSxcblx0XHRcdFx0Y29uZmlnID0ge307XG5cdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0JC5lYWNoKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSB0aGlzLm5hbWUubWF0Y2gocmVnZXhwKTtcblx0XHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRcdHZhciB2YWwgPSB0aGlzLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRuYW1lID0gJC5jYW1lbENhc2UobWF0Y2hbMV0pO1xuXHRcdFx0XHRcdFx0aWYgKCQuaW5BcnJheShuYW1lLCBLbGFzcy5mdW5jdGlvbkF0dHJpYnV0ZXMpID49IDApIHsgIC8qIGpzaGludCAtVzA1NCAqL1xuXHRcdFx0XHRcdFx0XHR2YWwgPSBuZXcgRnVuY3Rpb24odmFsKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBqc2hpbnQgK1cwNTQgKi9cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7IHZhbCA9ICQucGFyc2VKU09OKHZhbCk7IH1cblx0XHRcdFx0XHRcdFx0Y2F0Y2goZSkge31cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbmZpZ1tuYW1lXSA9IHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNvbmZpZztcblx0XHR9LFxuXG5cdFx0LyogVXNlZCB0byBjcmVhdGUgYSBGZWF0aGVybGlnaHQgZXh0ZW5zaW9uXG5cdFx0ICAgW1dhcm5pbmc6IGd1cnUtbGV2ZWxdXG5cdFx0ICAgQ3JlYXRlcyB0aGUgZXh0ZW5zaW9uJ3MgcHJvdG90eXBlIHRoYXQgaW4gdHVyblxuXHRcdCAgIGluaGVyaXRzIEZlYXRoZXJsaWdodCdzIHByb3RvdHlwZS5cblx0XHQgICBDb3VsZCBiZSB1c2VkIHRvIGV4dGVuZCBhbiBleHRlbnNpb24gdG9vLi4uXG5cdFx0ICAgVGhpcyBpcyBwcmV0dHkgaGlnaCBsZXZlbCB3aXphcmR5LCBpdCBjb21lcyBwcmV0dHkgbXVjaCBzdHJhaWdodFxuXHRcdCAgIGZyb20gQ29mZmVlU2NyaXB0IGFuZCB3b24ndCB0ZWFjaCB5b3UgYW55dGhpbmcgYWJvdXQgRmVhdGhlcmxpZ2h0XG5cdFx0ICAgYXMgaXQncyBub3QgcmVhbGx5IHNwZWNpZmljIHRvIHRoaXMgbGlicmFyeS5cblx0XHQgICBNeSBzdWdnZXN0aW9uOiBtb3ZlIGFsb25nIGFuZCBrZWVwIHlvdXIgc2FuaXR5LlxuXHRcdCovXG5cdFx0ZXh0ZW5kOiBmdW5jdGlvbihjaGlsZCwgZGVmYXVsdHMpIHtcblx0XHRcdC8qIFNldHVwIGNsYXNzIGhpZXJhcmNoeSwgYWRhcHRlZCBmcm9tIENvZmZlZVNjcmlwdCAqL1xuXHRcdFx0dmFyIEN0b3IgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XG5cdFx0XHRDdG9yLnByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xuXHRcdFx0Y2hpbGQucHJvdG90eXBlID0gbmV3IEN0b3IoKTtcblx0XHRcdGNoaWxkLl9fc3VwZXJfXyA9IHRoaXMucHJvdG90eXBlO1xuXHRcdFx0LyogQ29weSBjbGFzcyBtZXRob2RzICYgYXR0cmlidXRlcyAqL1xuXHRcdFx0JC5leHRlbmQoY2hpbGQsIHRoaXMsIGRlZmF1bHRzKTtcblx0XHRcdGNoaWxkLmRlZmF1bHRzID0gY2hpbGQucHJvdG90eXBlO1xuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH0sXG5cblx0XHRhdHRhY2g6IGZ1bmN0aW9uKCRzb3VyY2UsICRjb250ZW50LCBjb25maWcpIHtcblx0XHRcdHZhciBLbGFzcyA9IHRoaXM7XG5cdFx0XHRpZiAodHlwZW9mICRjb250ZW50ID09PSAnb2JqZWN0JyAmJiAkY29udGVudCBpbnN0YW5jZW9mICQgPT09IGZhbHNlICYmICFjb25maWcpIHtcblx0XHRcdFx0Y29uZmlnID0gJGNvbnRlbnQ7XG5cdFx0XHRcdCRjb250ZW50ID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0LyogbWFrZSBhIGNvcHkgKi9cblx0XHRcdGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBjb25maWcpO1xuXG5cdFx0XHQvKiBPbmx5IGZvciBvcGVuVHJpZ2dlciBhbmQgbmFtZXNwYWNlLi4uICovXG5cdFx0XHR2YXIgbmFtZXNwYWNlID0gY29uZmlnLm5hbWVzcGFjZSB8fCBLbGFzcy5kZWZhdWx0cy5uYW1lc3BhY2UsXG5cdFx0XHRcdHRlbXBDb25maWcgPSAkLmV4dGVuZCh7fSwgS2xhc3MuZGVmYXVsdHMsIEtsYXNzLnJlYWRFbGVtZW50Q29uZmlnKCRzb3VyY2VbMF0sIG5hbWVzcGFjZSksIGNvbmZpZyksXG5cdFx0XHRcdHNoYXJlZFBlcnNpc3Q7XG5cblx0XHRcdCRzb3VyY2Uub24odGVtcENvbmZpZy5vcGVuVHJpZ2dlcisnLicrdGVtcENvbmZpZy5uYW1lc3BhY2UsIHRlbXBDb25maWcuZmlsdGVyLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHQvKiAuLi4gc2luY2Ugd2UgbWlnaHQgYXMgd2VsbCBjb21wdXRlIHRoZSBjb25maWcgb24gdGhlIGFjdHVhbCB0YXJnZXQgKi9cblx0XHRcdFx0dmFyIGVsZW1Db25maWcgPSAkLmV4dGVuZChcblx0XHRcdFx0XHR7JHNvdXJjZTogJHNvdXJjZSwgJGN1cnJlbnRUYXJnZXQ6ICQodGhpcyl9LFxuXHRcdFx0XHRcdEtsYXNzLnJlYWRFbGVtZW50Q29uZmlnKCRzb3VyY2VbMF0sIHRlbXBDb25maWcubmFtZXNwYWNlKSxcblx0XHRcdFx0XHRLbGFzcy5yZWFkRWxlbWVudENvbmZpZyh0aGlzLCB0ZW1wQ29uZmlnLm5hbWVzcGFjZSksXG5cdFx0XHRcdFx0Y29uZmlnKTtcblx0XHRcdFx0dmFyIGZsID0gc2hhcmVkUGVyc2lzdCB8fCAkKHRoaXMpLmRhdGEoJ2ZlYXRoZXJsaWdodC1wZXJzaXN0ZWQnKSB8fCBuZXcgS2xhc3MoJGNvbnRlbnQsIGVsZW1Db25maWcpO1xuXHRcdFx0XHRpZihmbC5wZXJzaXN0ID09PSAnc2hhcmVkJykge1xuXHRcdFx0XHRcdHNoYXJlZFBlcnNpc3QgPSBmbDtcblx0XHRcdFx0fSBlbHNlIGlmKGZsLnBlcnNpc3QgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdmZWF0aGVybGlnaHQtcGVyc2lzdGVkJywgZmwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1Db25maWcuJGN1cnJlbnRUYXJnZXQuYmx1cigpOyAvLyBPdGhlcndpc2UgJ2VudGVyJyBrZXkgbWlnaHQgdHJpZ2dlciB0aGUgZGlhbG9nIGFnYWluXG5cdFx0XHRcdGZsLm9wZW4oZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gJHNvdXJjZTtcblx0XHR9LFxuXG5cdFx0Y3VycmVudDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYWxsID0gdGhpcy5vcGVuZWQoKTtcblx0XHRcdHJldHVybiBhbGxbYWxsLmxlbmd0aCAtIDFdIHx8IG51bGw7XG5cdFx0fSxcblxuXHRcdG9wZW5lZDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIga2xhc3MgPSB0aGlzO1xuXHRcdFx0cHJ1bmVPcGVuZWQoKTtcblx0XHRcdHJldHVybiAkLmdyZXAob3BlbmVkLCBmdW5jdGlvbihmbCkgeyByZXR1cm4gZmwgaW5zdGFuY2VvZiBrbGFzczsgfSApO1xuXHRcdH0sXG5cblx0XHRjbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY3VyID0gdGhpcy5jdXJyZW50KCk7XG5cdFx0XHRpZihjdXIpIHsgcmV0dXJuIGN1ci5jbG9zZSgpOyB9XG5cdFx0fSxcblxuXHRcdC8qIERvZXMgdGhlIGF1dG8gYmluZGluZyBvbiBzdGFydHVwLlxuXHRcdCAgIE1lYW50IG9ubHkgdG8gYmUgdXNlZCBieSBGZWF0aGVybGlnaHQgYW5kIGl0cyBleHRlbnNpb25zXG5cdFx0Ki9cblx0XHRfb25SZWFkeTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzO1xuXHRcdFx0aWYoS2xhc3MuYXV0b0JpbmQpe1xuXHRcdFx0XHQvKiBCaW5kIGV4aXN0aW5nIGVsZW1lbnRzICovXG5cdFx0XHRcdCQoS2xhc3MuYXV0b0JpbmQpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRLbGFzcy5hdHRhY2goJCh0aGlzKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvKiBJZiBhIGNsaWNrIHByb3BhZ2F0ZXMgdG8gdGhlIGRvY3VtZW50IGxldmVsLCB0aGVuIHdlIGhhdmUgYW4gaXRlbSB0aGF0IHdhcyBhZGRlZCBsYXRlciBvbiAqL1xuXHRcdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCBLbGFzcy5hdXRvQmluZCwgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdFx0aWYgKGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQvKiBCaW5kIGZlYXRoZXJsaWdodCAqL1xuXHRcdFx0XHRcdEtsYXNzLmF0dGFjaCgkKGV2dC5jdXJyZW50VGFyZ2V0KSk7XG5cdFx0XHRcdFx0LyogQ2xpY2sgYWdhaW47IHRoaXMgdGltZSBvdXIgYmluZGluZyB3aWxsIGNhdGNoIGl0ICovXG5cdFx0XHRcdFx0JChldnQudGFyZ2V0KS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyogRmVhdGhlcmxpZ2h0IHVzZXMgdGhlIG9uS2V5VXAgY2FsbGJhY2sgdG8gaW50ZXJjZXB0IHRoZSBlc2NhcGUga2V5LlxuXHRcdCAgIFByaXZhdGUgdG8gRmVhdGhlcmxpZ2h0LlxuXHRcdCovXG5cdFx0X2NhbGxiYWNrQ2hhaW46IHtcblx0XHRcdG9uS2V5VXA6IGZ1bmN0aW9uKF9zdXBlciwgZXZlbnQpe1xuXHRcdFx0XHRpZigyNyA9PT0gZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLmNsb3NlT25Fc2MpIHtcblx0XHRcdFx0XHRcdHRoaXMuJGluc3RhbmNlLmZpbmQoJy4nK3RoaXMubmFtZXNwYWNlKyctY2xvc2U6Zmlyc3QnKS5jbGljaygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9zdXBlcihldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdG9uUmVzaXplOiBmdW5jdGlvbihfc3VwZXIsIGV2ZW50KXtcblx0XHRcdFx0aWYgKHRoaXMuJGNvbnRlbnQubmF0dXJhbFdpZHRoKSB7XG5cdFx0XHRcdFx0dmFyIHcgPSB0aGlzLiRjb250ZW50Lm5hdHVyYWxXaWR0aCwgaCA9IHRoaXMuJGNvbnRlbnQubmF0dXJhbEhlaWdodDtcblx0XHRcdFx0XHQvKiBSZXNldCBhcHBhcmVudCBpbWFnZSBzaXplIGZpcnN0IHNvIGNvbnRhaW5lciBncm93cyAqL1xuXHRcdFx0XHRcdHRoaXMuJGNvbnRlbnQuY3NzKCd3aWR0aCcsICcnKS5jc3MoJ2hlaWdodCcsICcnKTtcblx0XHRcdFx0XHQvKiBDYWxjdWxhdGUgdGhlIHdvcnN0IHJhdGlvIHNvIHRoYXQgZGltZW5zaW9ucyBmaXQgKi9cblx0XHRcdFx0XHR2YXIgcmF0aW8gPSBNYXRoLm1heChcblx0XHRcdFx0XHRcdHcgIC8gcGFyc2VJbnQodGhpcy4kY29udGVudC5wYXJlbnQoKS5jc3MoJ3dpZHRoJyksMTApLFxuXHRcdFx0XHRcdFx0aCAvIHBhcnNlSW50KHRoaXMuJGNvbnRlbnQucGFyZW50KCkuY3NzKCdoZWlnaHQnKSwxMCkpO1xuXHRcdFx0XHRcdC8qIFJlc2l6ZSBjb250ZW50ICovXG5cdFx0XHRcdFx0aWYgKHJhdGlvID4gMSkge1xuXHRcdFx0XHRcdFx0dGhpcy4kY29udGVudC5jc3MoJ3dpZHRoJywgJycgKyB3IC8gcmF0aW8gKyAncHgnKS5jc3MoJ2hlaWdodCcsICcnICsgaCAvIHJhdGlvICsgJ3B4Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBfc3VwZXIoZXZlbnQpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWZ0ZXJDb250ZW50OiBmdW5jdGlvbihfc3VwZXIsIGV2ZW50KXtcblx0XHRcdFx0dmFyIHIgPSBfc3VwZXIoZXZlbnQpO1xuXHRcdFx0XHR0aGlzLm9uUmVzaXplKGV2ZW50KTtcblx0XHRcdFx0cmV0dXJuIHI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkLmZlYXRoZXJsaWdodCA9IEZlYXRoZXJsaWdodDtcblxuXHQvKiBiaW5kIGpRdWVyeSBlbGVtZW50cyB0byB0cmlnZ2VyIGZlYXRoZXJsaWdodCAqL1xuXHQkLmZuLmZlYXRoZXJsaWdodCA9IGZ1bmN0aW9uKCRjb250ZW50LCBjb25maWcpIHtcblx0XHRyZXR1cm4gRmVhdGhlcmxpZ2h0LmF0dGFjaCh0aGlzLCAkY29udGVudCwgY29uZmlnKTtcblx0fTtcblxuXHQvKiBiaW5kIGZlYXRoZXJsaWdodCBvbiByZWFkeSBpZiBjb25maWcgYXV0b0JpbmQgaXMgc2V0ICovXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7IEZlYXRoZXJsaWdodC5fb25SZWFkeSgpOyB9KTtcbn0oalF1ZXJ5KSk7XG4iLCIvKiFcbiAqIGhvdmVySW50ZW50IHYxLjguMSAvLyAyMDE0LjA4LjExIC8vIGpRdWVyeSB2MS45LjErXG4gKiBodHRwOi8vY2hlcm5lLm5ldC9icmlhbi9yZXNvdXJjZXMvanF1ZXJ5LmhvdmVySW50ZW50Lmh0bWxcbiAqXG4gKiBZb3UgbWF5IHVzZSBob3ZlckludGVudCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBsaWNlbnNlLiBCYXNpY2FsbHkgdGhhdFxuICogbWVhbnMgeW91IGFyZSBmcmVlIHRvIHVzZSBob3ZlckludGVudCBhcyBsb25nIGFzIHRoaXMgaGVhZGVyIGlzIGxlZnQgaW50YWN0LlxuICogQ29weXJpZ2h0IDIwMDcsIDIwMTQgQnJpYW4gQ2hlcm5lXG4gKi9cbiBcbi8qIGhvdmVySW50ZW50IGlzIHNpbWlsYXIgdG8galF1ZXJ5J3MgYnVpbHQtaW4gXCJob3ZlclwiIG1ldGhvZCBleGNlcHQgdGhhdFxuICogaW5zdGVhZCBvZiBmaXJpbmcgdGhlIGhhbmRsZXJJbiBmdW5jdGlvbiBpbW1lZGlhdGVseSwgaG92ZXJJbnRlbnQgY2hlY2tzXG4gKiB0byBzZWUgaWYgdGhlIHVzZXIncyBtb3VzZSBoYXMgc2xvd2VkIGRvd24gKGJlbmVhdGggdGhlIHNlbnNpdGl2aXR5XG4gKiB0aHJlc2hvbGQpIGJlZm9yZSBmaXJpbmcgdGhlIGV2ZW50LiBUaGUgaGFuZGxlck91dCBmdW5jdGlvbiBpcyBvbmx5XG4gKiBjYWxsZWQgYWZ0ZXIgYSBtYXRjaGluZyBoYW5kbGVySW4uXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIGp1c3QgbGlrZSAuaG92ZXIoKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW4sIGhhbmRsZXJPdXQgKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQgKVxuICpcbiAqIC8vIGJhc2ljIHVzYWdlIC4uLiB3aXRoIGV2ZW50IGRlbGVnYXRpb24hXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCwgc2VsZWN0b3IgKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQsIHNlbGVjdG9yIClcbiAqXG4gKiAvLyB1c2luZyBhIGJhc2ljIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiAuaG92ZXJJbnRlbnQoIGNvbmZpZyApXG4gKlxuICogQHBhcmFtICBoYW5kbGVySW4gICBmdW5jdGlvbiBPUiBjb25maWd1cmF0aW9uIG9iamVjdFxuICogQHBhcmFtICBoYW5kbGVyT3V0ICBmdW5jdGlvbiBPUiBzZWxlY3RvciBmb3IgZGVsZWdhdGlvbiBPUiB1bmRlZmluZWRcbiAqIEBwYXJhbSAgc2VsZWN0b3IgICAgc2VsZWN0b3IgT1IgdW5kZWZpbmVkXG4gKiBAYXV0aG9yIEJyaWFuIENoZXJuZSA8YnJpYW4oYXQpY2hlcm5lKGRvdCluZXQ+XG4gKi9cbihmdW5jdGlvbigkKSB7XG4gICAgJC5mbi5ob3ZlckludGVudCA9IGZ1bmN0aW9uKGhhbmRsZXJJbixoYW5kbGVyT3V0LHNlbGVjdG9yKSB7XG5cbiAgICAgICAgLy8gZGVmYXVsdCBjb25maWd1cmF0aW9uIHZhbHVlc1xuICAgICAgICB2YXIgY2ZnID0ge1xuICAgICAgICAgICAgaW50ZXJ2YWw6IDEwMCxcbiAgICAgICAgICAgIHNlbnNpdGl2aXR5OiA2LFxuICAgICAgICAgICAgdGltZW91dDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICggdHlwZW9mIGhhbmRsZXJJbiA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgaGFuZGxlckluICk7XG4gICAgICAgIH0gZWxzZSBpZiAoJC5pc0Z1bmN0aW9uKGhhbmRsZXJPdXQpKSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJPdXQsIHNlbGVjdG9yOiBzZWxlY3RvciB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJJbiwgc2VsZWN0b3I6IGhhbmRsZXJPdXQgfSApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5zdGFudGlhdGUgdmFyaWFibGVzXG4gICAgICAgIC8vIGNYLCBjWSA9IGN1cnJlbnQgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgdXBkYXRlZCBieSBtb3VzZW1vdmUgZXZlbnRcbiAgICAgICAgLy8gcFgsIHBZID0gcHJldmlvdXMgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgc2V0IGJ5IG1vdXNlb3ZlciBhbmQgcG9sbGluZyBpbnRlcnZhbFxuICAgICAgICB2YXIgY1gsIGNZLCBwWCwgcFk7XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBnZXR0aW5nIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciB0cmFjayA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBjWCA9IGV2LnBhZ2VYO1xuICAgICAgICAgICAgY1kgPSBldi5wYWdlWTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGNvbXBhcmluZyBjdXJyZW50IGFuZCBwcmV2aW91cyBtb3VzZSBwb3NpdGlvblxuICAgICAgICB2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgLy8gY29tcGFyZSBtb3VzZSBwb3NpdGlvbnMgdG8gc2VlIGlmIHRoZXkndmUgY3Jvc3NlZCB0aGUgdGhyZXNob2xkXG4gICAgICAgICAgICBpZiAoIE1hdGguc3FydCggKHBYLWNYKSoocFgtY1gpICsgKHBZLWNZKSoocFktY1kpICkgPCBjZmcuc2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIHNldCBob3ZlckludGVudCBzdGF0ZSB0byB0cnVlIChzbyBtb3VzZU91dCBjYW4gYmUgY2FsbGVkKVxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjZmcub3Zlci5hcHBseShvYixbZXZdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHByZXZpb3VzIGNvb3JkaW5hdGVzIGZvciBuZXh0IHRpbWVcbiAgICAgICAgICAgICAgICBwWCA9IGNYOyBwWSA9IGNZO1xuICAgICAgICAgICAgICAgIC8vIHVzZSBzZWxmLWNhbGxpbmcgdGltZW91dCwgZ3VhcmFudGVlcyBpbnRlcnZhbHMgYXJlIHNwYWNlZCBvdXQgcHJvcGVybHkgKGF2b2lkcyBKYXZhU2NyaXB0IHRpbWVyIGJ1Z3MpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldiwgb2IpO30gLCBjZmcuaW50ZXJ2YWwgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGRlbGF5aW5nIHRoZSBtb3VzZU91dCBmdW5jdGlvblxuICAgICAgICB2YXIgZGVsYXkgPSBmdW5jdGlvbihldixvYikge1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBjZmcub3V0LmFwcGx5KG9iLFtldl0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgbW91c2UgJ2hvdmVyaW5nJ1xuICAgICAgICB2YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAvLyBjb3B5IG9iamVjdHMgdG8gYmUgcGFzc2VkIGludG8gdCAocmVxdWlyZWQgZm9yIGV2ZW50IG9iamVjdCB0byBiZSBwYXNzZWQgaW4gSUUpXG4gICAgICAgICAgICB2YXIgZXYgPSAkLmV4dGVuZCh7fSxlKTtcbiAgICAgICAgICAgIHZhciBvYiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIGNhbmNlbCBob3ZlckludGVudCB0aW1lciBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF90KSB7IG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7IH1cblxuICAgICAgICAgICAgLy8gaWYgZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIlxuICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJtb3VzZWVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgXCJwcmV2aW91c1wiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gaW5pdGlhbCBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgIHBYID0gZXYucGFnZVg7IHBZID0gZXYucGFnZVk7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIFwiY3VycmVudFwiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gbW91c2Vtb3ZlXG4gICAgICAgICAgICAgICAgJChvYikub24oXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgcG9sbGluZyBpbnRlcnZhbCAoc2VsZi1jYWxsaW5nIHRpbWVvdXQpIHRvIGNvbXBhcmUgbW91c2UgY29vcmRpbmF0ZXMgb3ZlciB0aW1lXG4gICAgICAgICAgICAgICAgaWYgKCFvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsb2IpO30gLCBjZmcuaW50ZXJ2YWwgKTt9XG5cbiAgICAgICAgICAgICAgICAvLyBlbHNlIGUudHlwZSA9PSBcIm1vdXNlbGVhdmVcIlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1bmJpbmQgZXhwZW5zaXZlIG1vdXNlbW92ZSBldmVudFxuICAgICAgICAgICAgICAgICQob2IpLm9mZihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBob3ZlckludGVudCBzdGF0ZSBpcyB0cnVlLCB0aGVuIGNhbGwgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uIGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXlcbiAgICAgICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtkZWxheShldixvYik7fSAsIGNmZy50aW1lb3V0ICk7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxuICAgICAgICByZXR1cm4gdGhpcy5vbih7J21vdXNlZW50ZXIuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyLCdtb3VzZWxlYXZlLmhvdmVySW50ZW50JzpoYW5kbGVIb3Zlcn0sIGNmZy5zZWxlY3Rvcik7XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iLCIvKiFcbiAqIGltYWdlc0xvYWRlZCBQQUNLQUdFRCB2My4xLjhcbiAqIEphdmFTY3JpcHQgaXMgYWxsIGxpa2UgXCJZb3UgaW1hZ2VzIGFyZSBkb25lIHlldCBvciB3aGF0P1wiXG4gKiBNSVQgTGljZW5zZVxuICovXG5cbihmdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9ZnVuY3Rpb24gdChlLHQpe2Zvcih2YXIgbj1lLmxlbmd0aDtuLS07KWlmKGVbbl0ubGlzdGVuZXI9PT10KXJldHVybiBuO3JldHVybi0xfWZ1bmN0aW9uIG4oZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbZV0uYXBwbHkodGhpcyxhcmd1bWVudHMpfX12YXIgaT1lLnByb3RvdHlwZSxyPXRoaXMsbz1yLkV2ZW50RW1pdHRlcjtpLmdldExpc3RlbmVycz1mdW5jdGlvbihlKXt2YXIgdCxuLGk9dGhpcy5fZ2V0RXZlbnRzKCk7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3Q9e307Zm9yKG4gaW4gaSlpLmhhc093blByb3BlcnR5KG4pJiZlLnRlc3QobikmJih0W25dPWlbbl0pfWVsc2UgdD1pW2VdfHwoaVtlXT1bXSk7cmV0dXJuIHR9LGkuZmxhdHRlbkxpc3RlbmVycz1mdW5jdGlvbihlKXt2YXIgdCxuPVtdO2Zvcih0PTA7ZS5sZW5ndGg+dDt0Kz0xKW4ucHVzaChlW3RdLmxpc3RlbmVyKTtyZXR1cm4gbn0saS5nZXRMaXN0ZW5lcnNBc09iamVjdD1mdW5jdGlvbihlKXt2YXIgdCxuPXRoaXMuZ2V0TGlzdGVuZXJzKGUpO3JldHVybiBuIGluc3RhbmNlb2YgQXJyYXkmJih0PXt9LHRbZV09biksdHx8bn0saS5hZGRMaXN0ZW5lcj1mdW5jdGlvbihlLG4pe3ZhciBpLHI9dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKSxvPVwib2JqZWN0XCI9PXR5cGVvZiBuO2ZvcihpIGluIHIpci5oYXNPd25Qcm9wZXJ0eShpKSYmLTE9PT10KHJbaV0sbikmJnJbaV0ucHVzaChvP246e2xpc3RlbmVyOm4sb25jZTohMX0pO3JldHVybiB0aGlzfSxpLm9uPW4oXCJhZGRMaXN0ZW5lclwiKSxpLmFkZE9uY2VMaXN0ZW5lcj1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmFkZExpc3RlbmVyKGUse2xpc3RlbmVyOnQsb25jZTohMH0pfSxpLm9uY2U9bihcImFkZE9uY2VMaXN0ZW5lclwiKSxpLmRlZmluZUV2ZW50PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmdldExpc3RlbmVycyhlKSx0aGlzfSxpLmRlZmluZUV2ZW50cz1mdW5jdGlvbihlKXtmb3IodmFyIHQ9MDtlLmxlbmd0aD50O3QrPTEpdGhpcy5kZWZpbmVFdmVudChlW3RdKTtyZXR1cm4gdGhpc30saS5yZW1vdmVMaXN0ZW5lcj1mdW5jdGlvbihlLG4pe3ZhciBpLHIsbz10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpO2ZvcihyIGluIG8pby5oYXNPd25Qcm9wZXJ0eShyKSYmKGk9dChvW3JdLG4pLC0xIT09aSYmb1tyXS5zcGxpY2UoaSwxKSk7cmV0dXJuIHRoaXN9LGkub2ZmPW4oXCJyZW1vdmVMaXN0ZW5lclwiKSxpLmFkZExpc3RlbmVycz1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITEsZSx0KX0saS5yZW1vdmVMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKCEwLGUsdCl9LGkubWFuaXB1bGF0ZUxpc3RlbmVycz1mdW5jdGlvbihlLHQsbil7dmFyIGkscixvPWU/dGhpcy5yZW1vdmVMaXN0ZW5lcjp0aGlzLmFkZExpc3RlbmVyLHM9ZT90aGlzLnJlbW92ZUxpc3RlbmVyczp0aGlzLmFkZExpc3RlbmVycztpZihcIm9iamVjdFwiIT10eXBlb2YgdHx8dCBpbnN0YW5jZW9mIFJlZ0V4cClmb3IoaT1uLmxlbmd0aDtpLS07KW8uY2FsbCh0aGlzLHQsbltpXSk7ZWxzZSBmb3IoaSBpbiB0KXQuaGFzT3duUHJvcGVydHkoaSkmJihyPXRbaV0pJiYoXCJmdW5jdGlvblwiPT10eXBlb2Ygcj9vLmNhbGwodGhpcyxpLHIpOnMuY2FsbCh0aGlzLGkscikpO3JldHVybiB0aGlzfSxpLnJlbW92ZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciB0LG49dHlwZW9mIGUsaT10aGlzLl9nZXRFdmVudHMoKTtpZihcInN0cmluZ1wiPT09bilkZWxldGUgaVtlXTtlbHNlIGlmKFwib2JqZWN0XCI9PT1uKWZvcih0IGluIGkpaS5oYXNPd25Qcm9wZXJ0eSh0KSYmZS50ZXN0KHQpJiZkZWxldGUgaVt0XTtlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHM7cmV0dXJuIHRoaXN9LGkucmVtb3ZlQWxsTGlzdGVuZXJzPW4oXCJyZW1vdmVFdmVudFwiKSxpLmVtaXRFdmVudD1mdW5jdGlvbihlLHQpe3ZhciBuLGkscixvLHM9dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKTtmb3IociBpbiBzKWlmKHMuaGFzT3duUHJvcGVydHkocikpZm9yKGk9c1tyXS5sZW5ndGg7aS0tOyluPXNbcl1baV0sbi5vbmNlPT09ITAmJnRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuLmxpc3RlbmVyKSxvPW4ubGlzdGVuZXIuYXBwbHkodGhpcyx0fHxbXSksbz09PXRoaXMuX2dldE9uY2VSZXR1cm5WYWx1ZSgpJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKGUsbi5saXN0ZW5lcik7cmV0dXJuIHRoaXN9LGkudHJpZ2dlcj1uKFwiZW1pdEV2ZW50XCIpLGkuZW1pdD1mdW5jdGlvbihlKXt2YXIgdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSk7cmV0dXJuIHRoaXMuZW1pdEV2ZW50KGUsdCl9LGkuc2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLl9vbmNlUmV0dXJuVmFsdWU9ZSx0aGlzfSxpLl9nZXRPbmNlUmV0dXJuVmFsdWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oYXNPd25Qcm9wZXJ0eShcIl9vbmNlUmV0dXJuVmFsdWVcIik/dGhpcy5fb25jZVJldHVyblZhbHVlOiEwfSxpLl9nZXRFdmVudHM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZXZlbnRzfHwodGhpcy5fZXZlbnRzPXt9KX0sZS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHIuRXZlbnRFbWl0dGVyPW8sZX0sXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImV2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXJcIixbXSxmdW5jdGlvbigpe3JldHVybiBlfSk6XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9ZTp0aGlzLkV2ZW50RW1pdHRlcj1lfSkuY2FsbCh0aGlzKSxmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe3ZhciBuPWUuZXZlbnQ7cmV0dXJuIG4udGFyZ2V0PW4udGFyZ2V0fHxuLnNyY0VsZW1lbnR8fHQsbn12YXIgbj1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsaT1mdW5jdGlvbigpe307bi5hZGRFdmVudExpc3RlbmVyP2k9ZnVuY3Rpb24oZSx0LG4pe2UuYWRkRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpuLmF0dGFjaEV2ZW50JiYoaT1mdW5jdGlvbihlLG4saSl7ZVtuK2ldPWkuaGFuZGxlRXZlbnQ/ZnVuY3Rpb24oKXt2YXIgbj10KGUpO2kuaGFuZGxlRXZlbnQuY2FsbChpLG4pfTpmdW5jdGlvbigpe3ZhciBuPXQoZSk7aS5jYWxsKGUsbil9LGUuYXR0YWNoRXZlbnQoXCJvblwiK24sZVtuK2ldKX0pO3ZhciByPWZ1bmN0aW9uKCl7fTtuLnJlbW92ZUV2ZW50TGlzdGVuZXI/cj1mdW5jdGlvbihlLHQsbil7ZS5yZW1vdmVFdmVudExpc3RlbmVyKHQsbiwhMSl9Om4uZGV0YWNoRXZlbnQmJihyPWZ1bmN0aW9uKGUsdCxuKXtlLmRldGFjaEV2ZW50KFwib25cIit0LGVbdCtuXSk7dHJ5e2RlbGV0ZSBlW3Qrbl19Y2F0Y2goaSl7ZVt0K25dPXZvaWQgMH19KTt2YXIgbz17YmluZDppLHVuYmluZDpyfTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRpZS9ldmVudGllXCIsbyk6ZS5ldmVudGllPW99KHRoaXMpLGZ1bmN0aW9uKGUsdCl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsXCJldmVudGllL2V2ZW50aWVcIl0sZnVuY3Rpb24obixpKXtyZXR1cm4gdChlLG4saSl9KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz10KGUscmVxdWlyZShcIndvbGZ5ODctZXZlbnRlbWl0dGVyXCIpLHJlcXVpcmUoXCJldmVudGllXCIpKTplLmltYWdlc0xvYWRlZD10KGUsZS5FdmVudEVtaXR0ZXIsZS5ldmVudGllKX0od2luZG93LGZ1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiBpKGUsdCl7Zm9yKHZhciBuIGluIHQpZVtuXT10W25dO3JldHVybiBlfWZ1bmN0aW9uIHIoZSl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09ZC5jYWxsKGUpfWZ1bmN0aW9uIG8oZSl7dmFyIHQ9W107aWYocihlKSl0PWU7ZWxzZSBpZihcIm51bWJlclwiPT10eXBlb2YgZS5sZW5ndGgpZm9yKHZhciBuPTAsaT1lLmxlbmd0aDtpPm47bisrKXQucHVzaChlW25dKTtlbHNlIHQucHVzaChlKTtyZXR1cm4gdH1mdW5jdGlvbiBzKGUsdCxuKXtpZighKHRoaXMgaW5zdGFuY2VvZiBzKSlyZXR1cm4gbmV3IHMoZSx0KTtcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlKSksdGhpcy5lbGVtZW50cz1vKGUpLHRoaXMub3B0aW9ucz1pKHt9LHRoaXMub3B0aW9ucyksXCJmdW5jdGlvblwiPT10eXBlb2YgdD9uPXQ6aSh0aGlzLm9wdGlvbnMsdCksbiYmdGhpcy5vbihcImFsd2F5c1wiLG4pLHRoaXMuZ2V0SW1hZ2VzKCksYSYmKHRoaXMuanFEZWZlcnJlZD1uZXcgYS5EZWZlcnJlZCk7dmFyIHI9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ci5jaGVjaygpfSl9ZnVuY3Rpb24gZihlKXt0aGlzLmltZz1lfWZ1bmN0aW9uIGMoZSl7dGhpcy5zcmM9ZSx2W2VdPXRoaXN9dmFyIGE9ZS5qUXVlcnksdT1lLmNvbnNvbGUsaD11IT09dm9pZCAwLGQ9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztzLnByb3RvdHlwZT1uZXcgdCxzLnByb3RvdHlwZS5vcHRpb25zPXt9LHMucHJvdG90eXBlLmdldEltYWdlcz1mdW5jdGlvbigpe3RoaXMuaW1hZ2VzPVtdO2Zvcih2YXIgZT0wLHQ9dGhpcy5lbGVtZW50cy5sZW5ndGg7dD5lO2UrKyl7dmFyIG49dGhpcy5lbGVtZW50c1tlXTtcIklNR1wiPT09bi5ub2RlTmFtZSYmdGhpcy5hZGRJbWFnZShuKTt2YXIgaT1uLm5vZGVUeXBlO2lmKGkmJigxPT09aXx8OT09PWl8fDExPT09aSkpZm9yKHZhciByPW4ucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSxvPTAscz1yLmxlbmd0aDtzPm87bysrKXt2YXIgZj1yW29dO3RoaXMuYWRkSW1hZ2UoZil9fX0scy5wcm90b3R5cGUuYWRkSW1hZ2U9ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IGYoZSk7dGhpcy5pbWFnZXMucHVzaCh0KX0scy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUscil7cmV0dXJuIHQub3B0aW9ucy5kZWJ1ZyYmaCYmdS5sb2coXCJjb25maXJtXCIsZSxyKSx0LnByb2dyZXNzKGUpLG4rKyxuPT09aSYmdC5jb21wbGV0ZSgpLCEwfXZhciB0PXRoaXMsbj0wLGk9dGhpcy5pbWFnZXMubGVuZ3RoO2lmKHRoaXMuaGFzQW55QnJva2VuPSExLCFpKXJldHVybiB0aGlzLmNvbXBsZXRlKCksdm9pZCAwO2Zvcih2YXIgcj0wO2k+cjtyKyspe3ZhciBvPXRoaXMuaW1hZ2VzW3JdO28ub24oXCJjb25maXJtXCIsZSksby5jaGVjaygpfX0scy5wcm90b3R5cGUucHJvZ3Jlc3M9ZnVuY3Rpb24oZSl7dGhpcy5oYXNBbnlCcm9rZW49dGhpcy5oYXNBbnlCcm9rZW58fCFlLmlzTG9hZGVkO3ZhciB0PXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3QuZW1pdChcInByb2dyZXNzXCIsdCxlKSx0LmpxRGVmZXJyZWQmJnQuanFEZWZlcnJlZC5ub3RpZnkmJnQuanFEZWZlcnJlZC5ub3RpZnkodCxlKX0pfSxzLnByb3RvdHlwZS5jb21wbGV0ZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuaGFzQW55QnJva2VuP1wiZmFpbFwiOlwiZG9uZVwiO3RoaXMuaXNDb21wbGV0ZT0hMDt2YXIgdD10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtpZih0LmVtaXQoZSx0KSx0LmVtaXQoXCJhbHdheXNcIix0KSx0LmpxRGVmZXJyZWQpe3ZhciBuPXQuaGFzQW55QnJva2VuP1wicmVqZWN0XCI6XCJyZXNvbHZlXCI7dC5qcURlZmVycmVkW25dKHQpfX0pfSxhJiYoYS5mbi5pbWFnZXNMb2FkZWQ9ZnVuY3Rpb24oZSx0KXt2YXIgbj1uZXcgcyh0aGlzLGUsdCk7cmV0dXJuIG4uanFEZWZlcnJlZC5wcm9taXNlKGEodGhpcykpfSksZi5wcm90b3R5cGU9bmV3IHQsZi5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXt2YXIgZT12W3RoaXMuaW1nLnNyY118fG5ldyBjKHRoaXMuaW1nLnNyYyk7aWYoZS5pc0NvbmZpcm1lZClyZXR1cm4gdGhpcy5jb25maXJtKGUuaXNMb2FkZWQsXCJjYWNoZWQgd2FzIGNvbmZpcm1lZFwiKSx2b2lkIDA7aWYodGhpcy5pbWcuY29tcGxldGUmJnZvaWQgMCE9PXRoaXMuaW1nLm5hdHVyYWxXaWR0aClyZXR1cm4gdGhpcy5jb25maXJtKDAhPT10aGlzLmltZy5uYXR1cmFsV2lkdGgsXCJuYXR1cmFsV2lkdGhcIiksdm9pZCAwO3ZhciB0PXRoaXM7ZS5vbihcImNvbmZpcm1cIixmdW5jdGlvbihlLG4pe3JldHVybiB0LmNvbmZpcm0oZS5pc0xvYWRlZCxuKSwhMH0pLGUuY2hlY2soKX0sZi5wcm90b3R5cGUuY29uZmlybT1mdW5jdGlvbihlLHQpe3RoaXMuaXNMb2FkZWQ9ZSx0aGlzLmVtaXQoXCJjb25maXJtXCIsdGhpcyx0KX07dmFyIHY9e307cmV0dXJuIGMucHJvdG90eXBlPW5ldyB0LGMucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNDaGVja2VkKXt2YXIgZT1uZXcgSW1hZ2U7bi5iaW5kKGUsXCJsb2FkXCIsdGhpcyksbi5iaW5kKGUsXCJlcnJvclwiLHRoaXMpLGUuc3JjPXRoaXMuc3JjLHRoaXMuaXNDaGVja2VkPSEwfX0sYy5wcm90b3R5cGUuaGFuZGxlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIHQ9XCJvblwiK2UudHlwZTt0aGlzW3RdJiZ0aGlzW3RdKGUpfSxjLnByb3RvdHlwZS5vbmxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5jb25maXJtKCEwLFwib25sb2FkXCIpLHRoaXMudW5iaW5kUHJveHlFdmVudHMoZSl9LGMucHJvdG90eXBlLm9uZXJyb3I9ZnVuY3Rpb24oZSl7dGhpcy5jb25maXJtKCExLFwib25lcnJvclwiKSx0aGlzLnVuYmluZFByb3h5RXZlbnRzKGUpfSxjLnByb3RvdHlwZS5jb25maXJtPWZ1bmN0aW9uKGUsdCl7dGhpcy5pc0NvbmZpcm1lZD0hMCx0aGlzLmlzTG9hZGVkPWUsdGhpcy5lbWl0KFwiY29uZmlybVwiLHRoaXMsdCl9LGMucHJvdG90eXBlLnVuYmluZFByb3h5RXZlbnRzPWZ1bmN0aW9uKGUpe24udW5iaW5kKGUudGFyZ2V0LFwibG9hZFwiLHRoaXMpLG4udW5iaW5kKGUudGFyZ2V0LFwiZXJyb3JcIix0aGlzKX0sc30pOyIsIi8qIVxuICogalF1ZXJ5IFBsYWNlaG9sZGVyIFBsdWdpbiB2Mi4xLjNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL2pxdWVyeS1wbGFjZWhvbGRlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCAyMDE1IE1hdGhpYXMgQnluZW5zXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeShqUXVlcnkpO1xuICAgIH1cbn0oZnVuY3Rpb24oJCkge1xuXG4gICAgLy8gT3BlcmEgTWluaSB2NyBkb2Vzbid0IHN1cHBvcnQgcGxhY2Vob2xkZXIgYWx0aG91Z2ggaXRzIERPTSBzZWVtcyB0byBpbmRpY2F0ZSBzb1xuICAgIHZhciBpc09wZXJhTWluaSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh3aW5kb3cub3BlcmFtaW5pKSA9PT0gJ1tvYmplY3QgT3BlcmFNaW5pXSc7XG4gICAgdmFyIGlzSW5wdXRTdXBwb3J0ZWQgPSAncGxhY2Vob2xkZXInIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgJiYgIWlzT3BlcmFNaW5pO1xuICAgIHZhciBpc1RleHRhcmVhU3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpICYmICFpc09wZXJhTWluaTtcbiAgICB2YXIgdmFsSG9va3MgPSAkLnZhbEhvb2tzO1xuICAgIHZhciBwcm9wSG9va3MgPSAkLnByb3BIb29rcztcbiAgICB2YXIgaG9va3M7XG4gICAgdmFyIHBsYWNlaG9sZGVyO1xuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKGlzSW5wdXRTdXBwb3J0ZWQgJiYgaXNUZXh0YXJlYVN1cHBvcnRlZCkge1xuXG4gICAgICAgIHBsYWNlaG9sZGVyID0gJC5mbi5wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgcGxhY2Vob2xkZXIuaW5wdXQgPSB0cnVlO1xuICAgICAgICBwbGFjZWhvbGRlci50ZXh0YXJlYSA9IHRydWU7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHBsYWNlaG9sZGVyID0gJC5mbi5wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgdmFyIGRlZmF1bHRzID0ge2N1c3RvbUNsYXNzOiAncGxhY2Vob2xkZXInfTtcbiAgICAgICAgICAgIHNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKChpc0lucHV0U3VwcG9ydGVkID8gJ3RleHRhcmVhJyA6ICc6aW5wdXQnKSArICdbcGxhY2Vob2xkZXJdJylcbiAgICAgICAgICAgICAgICAubm90KCcuJytzZXR0aW5ncy5jdXN0b21DbGFzcylcbiAgICAgICAgICAgICAgICAuYmluZCh7XG4gICAgICAgICAgICAgICAgICAgICdmb2N1cy5wbGFjZWhvbGRlcic6IGNsZWFyUGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICdibHVyLnBsYWNlaG9sZGVyJzogc2V0UGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignYmx1ci5wbGFjZWhvbGRlcicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBsYWNlaG9sZGVyLmlucHV0ID0gaXNJbnB1dFN1cHBvcnRlZDtcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dGFyZWEgPSBpc1RleHRhcmVhU3VwcG9ydGVkO1xuXG4gICAgICAgIGhvb2tzID0ge1xuICAgICAgICAgICAgJ2dldCc6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblxuICAgICAgICAgICAgICAgIGlmICgkcGFzc3dvcmRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhc3N3b3JkSW5wdXRbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSAmJiAkZWxlbWVudC5oYXNDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcykgPyAnJyA6IGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3NldCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHZhciAkcmVwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgICAgdmFyICRwYXNzd29yZElucHV0O1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xuXG4gICAgICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXRleHRpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCRyZXBsYWNlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJQbGFjZWhvbGRlci5jYWxsKCRyZXBsYWNlbWVudFswXSwgdHJ1ZSwgdmFsdWUpIHx8IChlbGVtZW50LnZhbHVlID0gdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50WzBdLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkcGFzc3dvcmRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQsIHRydWUsIHZhbHVlKSB8fCAoJHBhc3N3b3JkSW5wdXRbMF0udmFsdWUgPSB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoISRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBTZXR0aW5nIHRoZSBwbGFjZWhvbGRlciBjYXVzZXMgcHJvYmxlbXMgaWYgdGhlIGVsZW1lbnQgY29udGludWVzIHRvIGhhdmUgZm9jdXMuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ICE9IHNhZmVBY3RpdmVFbGVtZW50KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGNhbid0IHVzZSBgdHJpZ2dlckhhbmRsZXJgIGhlcmUgYmVjYXVzZSBvZiBkdW1teSB0ZXh0L3Bhc3N3b3JkIGlucHV0cyA6KFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGxhY2Vob2xkZXIuY2FsbChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5oYXNDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyUGxhY2Vob2xkZXIuY2FsbChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYHNldGAgY2FuIG5vdCByZXR1cm4gYHVuZGVmaW5lZGA7IHNlZSBodHRwOi8vanNhcGkuaW5mby9qcXVlcnkvMS43LjEvdmFsI0wyMzYzXG4gICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghaXNJbnB1dFN1cHBvcnRlZCkge1xuICAgICAgICAgICAgdmFsSG9va3MuaW5wdXQgPSBob29rcztcbiAgICAgICAgICAgIHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1RleHRhcmVhU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICB2YWxIb29rcy50ZXh0YXJlYSA9IGhvb2tzO1xuICAgICAgICAgICAgcHJvcEhvb2tzLnZhbHVlID0gaG9va3M7XG4gICAgICAgIH1cblxuICAgICAgICAkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gTG9vayBmb3IgZm9ybXNcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmRlbGVnYXRlKCdmb3JtJywgJ3N1Ym1pdC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgc28gdGhleSBkb24ndCBnZXQgc3VibWl0dGVkXG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dHMgPSAkKCcuJytzZXR0aW5ncy5jdXN0b21DbGFzcywgdGhpcykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJQbGFjZWhvbGRlci5jYWxsKHRoaXMsIHRydWUsICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dHMuZWFjaChzZXRQbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENsZWFyIHBsYWNlaG9sZGVyIHZhbHVlcyB1cG9uIHBhZ2UgcmVsb2FkXG4gICAgICAgICQod2luZG93KS5iaW5kKCdiZWZvcmV1bmxvYWQucGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy4nK3NldHRpbmdzLmN1c3RvbUNsYXNzKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcmdzKGVsZW0pIHtcbiAgICAgICAgLy8gUmV0dXJuIGFuIG9iamVjdCBvZiBlbGVtZW50IGF0dHJpYnV0ZXNcbiAgICAgICAgdmFyIG5ld0F0dHJzID0ge307XG4gICAgICAgIHZhciByaW5saW5lalF1ZXJ5ID0gL15qUXVlcnlcXGQrJC87XG5cbiAgICAgICAgJC5lYWNoKGVsZW0uYXR0cmlidXRlcywgZnVuY3Rpb24oaSwgYXR0cikge1xuICAgICAgICAgICAgaWYgKGF0dHIuc3BlY2lmaWVkICYmICFyaW5saW5lalF1ZXJ5LnRlc3QoYXR0ci5uYW1lKSkge1xuICAgICAgICAgICAgICAgIG5ld0F0dHJzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3QXR0cnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJQbGFjZWhvbGRlcihldmVudCwgdmFsdWUpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgIHZhciAkaW5wdXQgPSAkKGlucHV0KTtcbiAgICAgICAgXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZSA9PT0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykgJiYgJGlucHV0Lmhhc0NsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgJGlucHV0LnJlbW92ZUNsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKTtcblxuICAgICAgICAgICAgaWYgKCRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpKSB7XG5cbiAgICAgICAgICAgICAgICAkaW5wdXQgPSAkaW5wdXQuaGlkZSgpLm5leHRBbGwoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXTpmaXJzdCcpLnNob3coKS5hdHRyKCdpZCcsICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIElmIGBjbGVhclBsYWNlaG9sZGVyYCB3YXMgY2FsbGVkIGZyb20gYCQudmFsSG9va3MuaW5wdXQuc2V0YFxuICAgICAgICAgICAgICAgIGlmIChldmVudCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXRbMF0udmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGlucHV0LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSAmJiBpbnB1dC5zZWxlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFBsYWNlaG9sZGVyKGV2ZW50KSB7XG4gICAgICAgIHZhciAkcmVwbGFjZW1lbnQ7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgIHZhciAkaW5wdXQgPSAkKGlucHV0KTtcbiAgICAgICAgdmFyIGlkID0gaW5wdXQuaWQ7XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYWNlaG9sZGVyIGlzIGFjdGl2YXRlZCwgdHJpZ2dlcmluZyBibHVyIGV2ZW50IChgJGlucHV0LnRyaWdnZXIoJ2JsdXInKWApIHNob3VsZCBkbyBub3RoaW5nLlxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ2JsdXInKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgkaW5wdXQuaGFzQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudCA9ICRpbnB1dC5wcmV2QWxsKCdpbnB1dFt0eXBlPVwidGV4dFwiXTpmaXJzdCcpO1xuICAgICAgICAgICAgICAgIGlmICgkcmVwbGFjZW1lbnQubGVuZ3RoID4gMCAmJiAkcmVwbGFjZW1lbnQuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItdGV4dGlucHV0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnQgPSAkaW5wdXQuY2xvbmUoKS5wcm9wKHsgJ3R5cGUnOiAndGV4dCcgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50ID0gJCgnPGlucHV0PicpLmF0dHIoJC5leHRlbmQoYXJncyh0aGlzKSwgeyAndHlwZSc6ICd0ZXh0JyB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCduYW1lJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItZW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJzogJGlucHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZWhvbGRlci1pZCc6IGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmJpbmQoJ2ZvY3VzLnBsYWNlaG9sZGVyJywgY2xlYXJQbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgJGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BsYWNlaG9sZGVyLXRleHRpbnB1dCc6ICRyZXBsYWNlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItaWQnOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iZWZvcmUoJHJlcGxhY2VtZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICRpbnB1dCA9ICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmhpZGUoKS5wcmV2QWxsKCdpbnB1dFt0eXBlPVwidGV4dFwiXTpmaXJzdCcpLmF0dHIoJ2lkJywgJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpLnNob3coKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgJHBhc3N3b3JkSW5wdXQgPSAkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblxuICAgICAgICAgICAgICAgIGlmICgkcGFzc3dvcmRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXQuYXR0cignaWQnLCAkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItaWQnKSkuc2hvdygpLm5leHRBbGwoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXTpsYXN0JykuaGlkZSgpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpO1xuICAgICAgICAgICAgJGlucHV0WzBdLnZhbHVlID0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRpbnB1dC5yZW1vdmVDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYWZlQWN0aXZlRWxlbWVudCgpIHtcbiAgICAgICAgLy8gQXZvaWQgSUU5IGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBvZiBkZWF0aFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cbiAgICB9XG59KSk7XG4iLCIvKipcbioganF1ZXJ5Lm1hdGNoSGVpZ2h0LmpzIG1hc3RlclxuKiBodHRwOi8vYnJtLmlvL2pxdWVyeS1tYXRjaC1oZWlnaHQvXG4qIExpY2Vuc2U6IE1JVFxuKi9cblxuOyhmdW5jdGlvbigkKSB7XG4gICAgLypcbiAgICAqICBpbnRlcm5hbFxuICAgICovXG5cbiAgICB2YXIgX3ByZXZpb3VzUmVzaXplV2lkdGggPSAtMSxcbiAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcblxuICAgIC8qXG4gICAgKiAgX3BhcnNlXG4gICAgKiAgdmFsdWUgcGFyc2UgdXRpbGl0eSBmdW5jdGlvblxuICAgICovXG5cbiAgICB2YXIgX3BhcnNlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gcGFyc2UgdmFsdWUgYW5kIGNvbnZlcnQgTmFOIHRvIDBcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgX3Jvd3NcbiAgICAqICB1dGlsaXR5IGZ1bmN0aW9uIHJldHVybnMgYXJyYXkgb2YgalF1ZXJ5IHNlbGVjdGlvbnMgcmVwcmVzZW50aW5nIGVhY2ggcm93XG4gICAgKiAgKGFzIGRpc3BsYXllZCBhZnRlciBmbG9hdCB3cmFwcGluZyBhcHBsaWVkIGJ5IGJyb3dzZXIpXG4gICAgKi9cblxuICAgIHZhciBfcm93cyA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciB0b2xlcmFuY2UgPSAxLFxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXG4gICAgICAgICAgICBsYXN0VG9wID0gbnVsbCxcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcblxuICAgICAgICAvLyBncm91cCBlbGVtZW50cyBieSB0aGVpciB0b3AgcG9zaXRpb25cbiAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgdG9wID0gJHRoYXQub2Zmc2V0KCkudG9wIC0gX3BhcnNlKCR0aGF0LmNzcygnbWFyZ2luLXRvcCcpKSxcbiAgICAgICAgICAgICAgICBsYXN0Um93ID0gcm93cy5sZW5ndGggPiAwID8gcm93c1tyb3dzLmxlbmd0aCAtIDFdIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKGxhc3RSb3cgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBpdGVtIG9uIHRoZSByb3csIHNvIGp1c3QgcHVzaCBpdFxuICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb3cgdG9wIGlzIHRoZSBzYW1lLCBhZGQgdG8gdGhlIHJvdyBncm91cFxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmZsb29yKE1hdGguYWJzKGxhc3RUb3AgLSB0b3ApKSA8PSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93c1tyb3dzLmxlbmd0aCAtIDFdID0gbGFzdFJvdy5hZGQoJHRoYXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBzdGFydCBhIG5ldyByb3cgZ3JvdXBcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGxhc3Qgcm93IHRvcFxuICAgICAgICAgICAgbGFzdFRvcCA9IHRvcDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgX3BhcnNlT3B0aW9uc1xuICAgICogIGhhbmRsZSBwbHVnaW4gb3B0aW9uc1xuICAgICovXG5cbiAgICB2YXIgX3BhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBieVJvdzogdHJ1ZSxcbiAgICAgICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcbiAgICAgICAgICAgIHRhcmdldDogbnVsbCxcbiAgICAgICAgICAgIHJlbW92ZTogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQob3B0cywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgb3B0cy5ieVJvdyA9IG9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgICAgIG9wdHMucmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0XG4gICAgKiAgcGx1Z2luIGRlZmluaXRpb25cbiAgICAqL1xuXG4gICAgdmFyIG1hdGNoSGVpZ2h0ID0gJC5mbi5tYXRjaEhlaWdodCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIGhhbmRsZSByZW1vdmVcbiAgICAgICAgaWYgKG9wdHMucmVtb3ZlKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBmaXhlZCBoZWlnaHQgZnJvbSBhbGwgc2VsZWN0ZWQgZWxlbWVudHNcbiAgICAgICAgICAgIHRoaXMuY3NzKG9wdHMucHJvcGVydHksICcnKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGVkIGVsZW1lbnRzIGZyb20gYWxsIGdyb3Vwc1xuICAgICAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKGtleSwgZ3JvdXApIHtcbiAgICAgICAgICAgICAgICBncm91cC5lbGVtZW50cyA9IGdyb3VwLmVsZW1lbnRzLm5vdCh0aGF0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbnVwIGVtcHR5IGdyb3Vwc1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8PSAxICYmICFvcHRzLnRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoaXMgZ3JvdXAgc28gd2UgY2FuIHJlLWFwcGx5IGxhdGVyIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2dyb3Vwcy5wdXNoKHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiB0aGlzLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0c1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBtYXRjaCBlYWNoIGVsZW1lbnQncyBoZWlnaHQgdG8gdGhlIHRhbGxlc3QgZWxlbWVudCBpbiB0aGUgc2VsZWN0aW9uXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLCBvcHRzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBwbHVnaW4gZ2xvYmFsIG9wdGlvbnNcbiAgICAqL1xuXG4gICAgbWF0Y2hIZWlnaHQuX2dyb3VwcyA9IFtdO1xuICAgIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSA9IDgwO1xuICAgIG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IGZhbHNlO1xuICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUgPSBudWxsO1xuICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSA9IG51bGw7XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseVxuICAgICogIGFwcGx5IG1hdGNoSGVpZ2h0IHRvIGdpdmVuIGVsZW1lbnRzXG4gICAgKi9cblxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKSxcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxuICAgICAgICAgICAgcm93cyA9IFskZWxlbWVudHNdO1xuXG4gICAgICAgIC8vIHRha2Ugbm90ZSBvZiBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIGh0bWxIZWlnaHQgPSAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cbiAgICAgICAgLy8gZ2V0IGhpZGRlbiBwYXJlbnRzXG4gICAgICAgIHZhciAkaGlkZGVuUGFyZW50cyA9ICRlbGVtZW50cy5wYXJlbnRzKCkuZmlsdGVyKCc6aGlkZGVuJyk7XG5cbiAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRlbXBvcmFyaWx5IG11c3QgZm9yY2UgaGlkZGVuIHBhcmVudHMgdmlzaWJsZVxuICAgICAgICAkaGlkZGVuUGFyZW50cy5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgICAvLyBnZXQgcm93cyBpZiB1c2luZyBieVJvdywgb3RoZXJ3aXNlIGFzc3VtZSBvbmUgcm93XG4gICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICFvcHRzLnRhcmdldCkge1xuXG4gICAgICAgICAgICAvLyBtdXN0IGZpcnN0IGZvcmNlIGFuIGFyYml0cmFyeSBlcXVhbCBoZWlnaHQgc28gZmxvYXRpbmcgZWxlbWVudHMgYnJlYWsgZXZlbmx5XG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcmlseSBmb3JjZSBhIHVzYWJsZSBkaXNwbGF5IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxuICAgICAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XG5cbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6IGRpc3BsYXksXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdib3JkZXItdG9wLXdpZHRoJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLWJvdHRvbS13aWR0aCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDBweCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFycmF5IG9mIHJvd3MgKGJhc2VkIG9uIGVsZW1lbnQgdG9wIHBvc2l0aW9uKVxuICAgICAgICAgICAgcm93cyA9IF9yb3dzKCRlbGVtZW50cyk7XG5cbiAgICAgICAgICAgIC8vIHJldmVydCBvcmlnaW5hbCBpbmxpbmUgc3R5bGVzXG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCAnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQuZWFjaChyb3dzLCBmdW5jdGlvbihrZXksIHJvdykge1xuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHJvdyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gMDtcblxuICAgICAgICAgICAgaWYgKCFvcHRzLnRhcmdldCkge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgYXBwbHkgdG8gcm93cyB3aXRoIG9ubHkgb25lIGl0ZW1cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5ieVJvdyAmJiAkcm93Lmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb3cuY3NzKG9wdHMucHJvcGVydHksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhlIHJvdyBhbmQgZmluZCB0aGUgbWF4IGhlaWdodFxuICAgICAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGZvcmNlIGEgdXNhYmxlIGRpc3BsYXkgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZW5zdXJlIHdlIGdldCB0aGUgY29ycmVjdCBhY3R1YWwgaGVpZ2h0IChhbmQgbm90IGEgcHJldmlvdXNseSBzZXQgaGVpZ2h0IHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB2YXIgY3NzID0geyAnZGlzcGxheSc6IGRpc3BsYXkgfTtcbiAgICAgICAgICAgICAgICAgICAgY3NzW29wdHMucHJvcGVydHldID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICR0aGF0LmNzcyhjc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIG1heCBoZWlnaHQgKGluY2x1ZGluZyBwYWRkaW5nLCBidXQgbm90IG1hcmdpbilcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKSA+IHRhcmdldEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJ0IGRpc3BsYXkgYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKCdkaXNwbGF5JywgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgc2V0LCB1c2UgdGhlIGhlaWdodCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSBvcHRzLnRhcmdldC5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhlIHJvdyBhbmQgYXBwbHkgdGhlIGhlaWdodCB0byBhbGwgZWxlbWVudHNcbiAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhcHBseSB0byBhIHRhcmdldFxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnRhcmdldCAmJiAkdGhhdC5pcyhvcHRzLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBwYWRkaW5nIGFuZCBib3JkZXIgY29ycmVjdGx5IChyZXF1aXJlZCB3aGVuIG5vdCB1c2luZyBib3JkZXItYm94KVxuICAgICAgICAgICAgICAgIGlmICgkdGhhdC5jc3MoJ2JveC1zaXppbmcnKSAhPT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItdG9wLXdpZHRoJykpICsgX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpKTtcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctdG9wJykpICsgX3BhcnNlKCR0aGF0LmNzcygncGFkZGluZy1ib3R0b20nKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBoZWlnaHQgKGFjY291bnRpbmcgZm9yIHBhZGRpbmcgYW5kIGJvcmRlcilcbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Mob3B0cy5wcm9wZXJ0eSwgKHRhcmdldEhlaWdodCAtIHZlcnRpY2FsUGFkZGluZykgKyAncHgnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXZlcnQgaGlkZGVuIHBhcmVudHNcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGhhdC5hdHRyKCdzdHlsZScsICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJykgfHwgbnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIGlmIGVuYWJsZWRcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCkge1xuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgoc2Nyb2xsVG9wIC8gaHRtbEhlaWdodCkgKiAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaVxuICAgICogIGFwcGxpZXMgbWF0Y2hIZWlnaHQgdG8gYWxsIGVsZW1lbnRzIHdpdGggYSBkYXRhLW1hdGNoLWhlaWdodCBhdHRyaWJ1dGVcbiAgICAqL1xuXG4gICAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ3JvdXBzID0ge307XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgZ3JvdXBzIGJ5IHRoZWlyIGdyb3VwSWQgc2V0IGJ5IGVsZW1lbnRzIHVzaW5nIGRhdGEtbWF0Y2gtaGVpZ2h0XG4gICAgICAgICQoJ1tkYXRhLW1hdGNoLWhlaWdodF0sIFtkYXRhLW1oXScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGdyb3VwSWQgPSAkdGhpcy5hdHRyKCdkYXRhLW1oJykgfHwgJHRoaXMuYXR0cignZGF0YS1tYXRjaC1oZWlnaHQnKTtcblxuICAgICAgICAgICAgaWYgKGdyb3VwSWQgaW4gZ3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gZ3JvdXBzW2dyb3VwSWRdLmFkZCgkdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9ICR0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhcHBseSBtYXRjaEhlaWdodCB0byBlYWNoIGdyb3VwXG4gICAgICAgICQuZWFjaChncm91cHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5tYXRjaEhlaWdodCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgbWF0Y2hIZWlnaHQuX3VwZGF0ZVxuICAgICogIHVwZGF0ZXMgbWF0Y2hIZWlnaHQgb24gYWxsIGN1cnJlbnQgZ3JvdXBzIHdpdGggdGhlaXIgY29ycmVjdCBvcHRpb25zXG4gICAgKi9cblxuICAgIHZhciBfdXBkYXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUpIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2FwcGx5KHRoaXMuZWxlbWVudHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSA9IGZ1bmN0aW9uKHRocm90dGxlLCBldmVudCkge1xuICAgICAgICAvLyBwcmV2ZW50IHVwZGF0ZSBpZiBmaXJlZCBmcm9tIGEgcmVzaXplIGV2ZW50XG4gICAgICAgIC8vIHdoZXJlIHRoZSB2aWV3cG9ydCB3aWR0aCBoYXNuJ3QgYWN0dWFsbHkgY2hhbmdlZFxuICAgICAgICAvLyBmaXhlcyBhbiBldmVudCBsb29waW5nIGJ1ZyBpbiBJRThcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT09ICdyZXNpemUnKSB7XG4gICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICAgICAgICAgIGlmICh3aW5kb3dXaWR0aCA9PT0gX3ByZXZpb3VzUmVzaXplV2lkdGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfcHJldmlvdXNSZXNpemVXaWR0aCA9IHdpbmRvd1dpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhyb3R0bGUgdXBkYXRlc1xuICAgICAgICBpZiAoIXRocm90dGxlKSB7XG4gICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmIChfdXBkYXRlVGltZW91dCA9PT0gLTEpIHtcbiAgICAgICAgICAgIF91cGRhdGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xuICAgICAgICAgICAgfSwgbWF0Y2hIZWlnaHQuX3Rocm90dGxlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICogIGJpbmQgZXZlbnRzXG4gICAgKi9cblxuICAgIC8vIGFwcGx5IG9uIERPTSByZWFkeSBldmVudFxuICAgICQobWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSk7XG5cbiAgICAvLyB1cGRhdGUgaGVpZ2h0cyBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXG4gICAgJCh3aW5kb3cpLmJpbmQoJ2xvYWQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKGZhbHNlLCBldmVudCk7XG4gICAgfSk7XG5cbiAgICAvLyB0aHJvdHRsZWQgdXBkYXRlIGhlaWdodHMgb24gcmVzaXplIGV2ZW50c1xuICAgICQod2luZG93KS5iaW5kKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKHRydWUsIGV2ZW50KTtcbiAgICB9KTtcblxufSkoalF1ZXJ5KTtcbiIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkpTIFBMVUdJTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cblxuXG4vLyBHZXQgQ3VycmVudCBCcmVha3BvaW50IChHbG9iYWwpXG52YXIgYnJlYWtwb2ludCA9IHt9O1xuYnJlYWtwb2ludC5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMubmFtZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXFxcIi9nLCAnJyk7XG59O1xualF1ZXJ5KHdpbmRvdykucmVzaXplKCBmdW5jdGlvbigpIHtcblx0YnJlYWtwb2ludC5yZWZyZXNoKCk7XG59KS5yZXNpemUoKTtcblxuXG4vLyBSZXNpemUgSWZyYW1lcyBQcm9wb3J0aW9uYWxseVxuZnVuY3Rpb24gaWZyYW1lQXNwZWN0KHNlbGVjdG9yKSB7XG5cdHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgalF1ZXJ5KCdpZnJhbWUnKTtcblxuXHRzZWxlY3Rvci5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHQvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG5cdFx0dmFyIGlmcmFtZSA9IGpRdWVyeSh0aGlzKSxcblx0XHRcdHdpZHRoICA9IGlmcmFtZS53aWR0aCgpO1xuXHRcdGlmICggdHlwZW9mKGlmcmFtZS5kYXRhKCdyYXRpbycpKSA9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHZhciBhdHRyVyA9IHRoaXMud2lkdGgsXG5cdFx0XHRcdGF0dHJIID0gdGhpcy5oZWlnaHQ7XG5cdFx0XHRpZnJhbWUuZGF0YSgncmF0aW8nLCBhdHRySCAvIGF0dHJXICkucmVtb3ZlQXR0cignd2lkdGgnKS5yZW1vdmVBdHRyKCdoZWlnaHQnKTtcblx0XHR9XG5cdFx0aWZyYW1lLmhlaWdodCggd2lkdGggKiBpZnJhbWUuZGF0YSgncmF0aW8nKSApLmNzcygnbWF4LWhlaWdodCcsICcnKTtcblx0fSk7XG59XG5cblxuLy8gTGlnaHRlbiAvIERhcmtlbiBDb2xvciAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcbmZ1bmN0aW9uIHNoYWRlQ29sb3IoY29sb3IsIHBlcmNlbnQpIHsgICBcblx0dmFyIGY9cGFyc2VJbnQoY29sb3Iuc2xpY2UoMSksMTYpLHQ9cGVyY2VudDwwPzA6MjU1LHA9cGVyY2VudDwwP3BlcmNlbnQqLTE6cGVyY2VudCxSPWY+PjE2LEc9Zj4+OCYweDAwRkYsQj1mJjB4MDAwMEZGO1xuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKHQtUikqcCkrUikqMHgxMDAwMCsoTWF0aC5yb3VuZCgodC1HKSpwKStHKSoweDEwMCsoTWF0aC5yb3VuZCgodC1CKSpwKStCKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xufVxuXG5cbi8vIEJsZW5kIENvbG9ycyAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcbmZ1bmN0aW9uIGJsZW5kQ29sb3JzKGMwLCBjMSwgcCkge1xuXHR2YXIgZj1wYXJzZUludChjMC5zbGljZSgxKSwxNiksdD1wYXJzZUludChjMS5zbGljZSgxKSwxNiksUjE9Zj4+MTYsRzE9Zj4+OCYweDAwRkYsQjE9ZiYweDAwMDBGRixSMj10Pj4xNixHMj10Pj44JjB4MDBGRixCMj10JjB4MDAwMEZGO1xuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKFIyLVIxKSpwKStSMSkqMHgxMDAwMCsoTWF0aC5yb3VuZCgoRzItRzEpKnApK0cxKSoweDEwMCsoTWF0aC5yb3VuZCgoQjItQjEpKnApK0IxKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xufVxuXG5cbi8vIENvbnZlcnQgY29sb3IgdG8gUkdCYVxuZnVuY3Rpb24gY29sb3JUb1JnYmEoY29sb3IsIG9wYWNpdHkpIHtcblx0aWYgKCBjb2xvci5zdWJzdHJpbmcoMCw0KSA9PSAncmdiYScgKSB7XG5cdFx0dmFyIGFscGhhID0gY29sb3IubWF0Y2goLyhbXlxcLF0qKVxcKSQvKTtcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZShhbHBoYVsxXSwgb3BhY2l0eSk7XG5cdH0gZWxzZSBpZiAoIGNvbG9yLnN1YnN0cmluZygwLDMpID09ICdyZ2InICkge1xuXHRcdHJldHVybiBjb2xvci5yZXBsYWNlKCdyZ2IoJywgJ3JnYmEoJykucmVwbGFjZSgnKScsICcsICcrb3BhY2l0eSsnKScpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBoZXggPSBjb2xvci5yZXBsYWNlKCcjJywnJyksXG5cdFx0XHRyID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygwLDIpLCAxNiksXG5cdFx0XHRnID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygyLDQpLCAxNiksXG5cdFx0XHRiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNiksXG5cdFx0XHRyZXN1bHQgPSAncmdiYSgnK3IrJywnK2crJywnK2IrJywnK29wYWNpdHkrJyknO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn1cblxuXG4vLyBDb2xvciBMaWdodCBPciBEYXJrIC0gQ3JlZGl0IFwiTGFycnkgRm94XCIgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9sYXJyeWZveC8xNjM2MzM4XG5mdW5jdGlvbiBjb2xvckxvRChjb2xvcikge1xuXHR2YXIgcixiLGcsaHNwLGEgPSBjb2xvcjtcblx0aWYgKGEubWF0Y2goL15yZ2IvKSkge1xuXHRcdGEgPSBhLm1hdGNoKC9ecmdiYT9cXCgoXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspKD86LFxccyooXFxkKyg/OlxcLlxcZCspPykpP1xcKSQvKTtcblx0XHRyID0gYVsxXTtcblx0XHRiID0gYVsyXTtcblx0XHRnID0gYVszXTtcblx0fSBlbHNlIHtcblx0XHRhID0gKygnMHgnICsgYS5zbGljZSgxKS5yZXBsYWNlKGEubGVuZ3RoIDwgNSAmJiAvLi9nLCAnJCYkJicpKTtcblx0XHRyID0gYSA+PiAxNjtcblx0XHRiID0gYSA+PiA4ICYgMjU1O1xuXHRcdGcgPSBhICYgMjU1O1xuXHR9XG5cdGhzcCA9IE1hdGguc3FydCggMC4yOTkgKiAociAqIHIpICsgMC41ODcgKiAoZyAqIGcpICsgMC4xMTQgKiAoYiAqIGIpICk7XG5cdHJldHVybiAoIGhzcCA+IDEyNy41ICkgPyAnbGlnaHQnIDogJ2RhcmsnO1xufSBcblxuXG4vLyBJbWFnZSBMaWdodCBPciBEYXJrIEltYWdlIC0gQ3JlZGl0IFwiSm9zZXBoIFBvcnRlbGxpXCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTQ5NjM2L2pvc2VwaC1wb3J0ZWxsaVxuZnVuY3Rpb24gaW1hZ2VMb0QoaW1hZ2VTcmMsIGNhbGxiYWNrKSB7XG5cdHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblx0aW1nLnNyYyA9IGltYWdlU3JjO1xuXHRpbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWcpO1xuXG5cdHZhciBjb2xvclN1bSA9IDA7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIGNyZWF0ZSBjYW52YXNcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcblx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y3R4LmRyYXdJbWFnZSh0aGlzLDAsMCk7XG5cblx0XHR2YXIgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0dmFyIHIsZyxiLGF2ZztcblxuXHRcdGZvcih2YXIgeCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyB4IDwgbGVuOyB4Kz00KSB7XG5cdFx0XHRyID0gZGF0YVt4XTtcblx0XHRcdGcgPSBkYXRhW3grMV07XG5cdFx0XHRiID0gZGF0YVt4KzJdO1xuXG5cdFx0XHRhdmcgPSBNYXRoLmZsb29yKChyK2crYikvMyk7XG5cdFx0XHRjb2xvclN1bSArPSBhdmc7XG5cdFx0fVxuXG5cdFx0dmFyIGJyaWdodG5lc3MgPSBNYXRoLmZsb29yKGNvbG9yU3VtIC8gKHRoaXMud2lkdGgqdGhpcy5oZWlnaHQpKTtcblx0XHRjYWxsYmFjayhicmlnaHRuZXNzKTtcblx0fTtcbn1cblxuXG4vLyBSZXNpemUgSW1hZ2UgVG8gRmlsbCBDb250YWluZXIgU2l6ZVxuZnVuY3Rpb24gaW1hZ2VDb3Zlcihjb250LCB0eXBlLCBjb3JySCkge1xuXHR0eXBlID0gdHlwZSB8fCAnYmcnO1xuXG5cdGNvbnQuYWRkQ2xhc3MoJ2ltYWdlLWNvdmVyJyk7XG5cblx0dmFyIGltZywgaW1nVXJsLCBpbWdXaWR0aCA9IDAsIGltZ0hlaWdodCA9IDA7XG5cblx0aWYgKCB0eXBlID09ICdpbWcnICkge1xuXHRcdGltZyA9IGNvbnQuZmluZCgnLmJnLWltZycpO1xuXHRcdGltZ1dpZHRoICA9IGltZy53aWR0aCgpO1xuXHRcdGltZ0hlaWdodCA9IGltZy5oZWlnaHQoKTtcblx0fSBlbHNlIHtcblx0XHRpbWdVcmwgPSBjb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLm1hdGNoKC9edXJsXFwoXCI/KC4rPylcIj9cXCkkLyk7XG5cdFx0aWYgKCBpbWdVcmxbMV0gKSB7XG5cdFx0ICAgIGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdCAgICBpbWcuc3JjID0gaW1nVXJsWzFdO1xuXHRcdCAgICBpbWdXaWR0aCAgPSBpbWcud2lkdGg7XG5cdFx0ICAgIGltZ0hlaWdodCA9IGltZy5oZWlnaHQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCBpbWdXaWR0aCAhPT0gMCAmJiBpbWdIZWlnaHQgIT09IDAgKSB7XG5cdFx0dmFyIGNvbnRXaWR0aCAgPSBjb250Lm91dGVyV2lkdGgoKSxcblx0XHRcdGNvbnRIZWlnaHQgPSBjb250Lm91dGVySGVpZ2h0KCksXG5cdFx0XHRoZWlnaHREaWZmID0gY29udFdpZHRoIC8gaW1nV2lkdGggKiBpbWdIZWlnaHQsXG5cdFx0XHRuZXdXaWR0aCAgID0gJ2F1dG8nLFxuXHRcdFx0bmV3SGVpZ2h0ICA9IGNvbnRIZWlnaHQgKyBjb3JySCArICdweCc7XG5cblx0XHRcdGlmICggaGVpZ2h0RGlmZiA+IGNvbnRIZWlnaHQgKSB7XG5cdFx0XHRcdG5ld1dpZHRoICA9ICcxMDAlJztcblx0XHRcdFx0bmV3SGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0fVxuXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICkge1xuXHRcdFx0aW1nLmNzcyh7IHdpZHRoOiBuZXdXaWR0aCwgaGVpZ2h0OiBuZXdIZWlnaHQgfSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnQuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBuZXdXaWR0aCArICcgJyArIG5ld0hlaWdodCk7XG5cdFx0fVxuXHR9XG59XG5cblxuLy8gRGV0ZXJtaW5lIElmIEFuIEVsZW1lbnQgSXMgU2Nyb2xsZWQgSW50byBWaWV3XG5mdW5jdGlvbiBlbGVtVmlzaWJsZShlbGVtLCBjb250KSB7XG5cdHZhciBjb250VG9wID0gY29udC5zY3JvbGxUb3AoKSxcblx0XHRjb250QnRtID0gY29udFRvcCArIGNvbnQuaGVpZ2h0KCksXG5cdFx0ZWxlbVRvcCA9IGVsZW0ub2Zmc2V0KCkudG9wLFxuXHRcdGVsZW1CdG0gPSBlbGVtVG9wICsgZWxlbS5oZWlnaHQoKTtcblxuXHRyZXR1cm4gKChlbGVtQnRtIDw9IGNvbnRCdG0pICYmIChlbGVtVG9wID49IGNvbnRUb3ApKTtcbn1cblxuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQvLyBSZXNpemUgdGV4dCBiYXNlZCBvbiBjb250YWluZXIgd2lkdGhcblx0JC5mbi5iaWdUZXh0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHtcblx0XHRcdCdyYXRpbyc6ICAgMSxcblx0XHRcdCdtaW5TaXplJzogMTIsXG5cdFx0XHQnbWF4U2l6ZSc6IDUxMlxuXHRcdH0sIG9wdGlvbnMpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0XHRkYXRhICA9ICR0aGlzLmRhdGEoKSxcblx0XHRcdFx0cmF0aW8gPSBkYXRhLmhhc093blByb3BlcnR5KCdyYXRpbycpID8gZGF0YS5yYXRpbyA6IHNldHRpbmdzLnJhdGlvLFxuXHRcdFx0XHRtaW4gICA9IGRhdGEuaGFzT3duUHJvcGVydHkoJ21pblNpemUnKSA/IGRhdGEubWluU2l6ZSA6IHNldHRpbmdzLm1pblNpemUsXG5cdFx0XHRcdG1heCAgID0gZGF0YS5oYXNPd25Qcm9wZXJ0eSgnbWF4U2l6ZScpID8gZGF0YS5tYXhTaXplIDogc2V0dGluZ3MubWF4U2l6ZSxcblx0XHRcdFx0Zml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBjaGFycyA9ICR0aGlzLnRleHQoKS5sZW5ndGggKiAwLjU3MzcsXG5cdFx0XHRcdFx0XHRzaXplID0gTWF0aC5tYXgoTWF0aC5taW4oJHRoaXMud2lkdGgoKSAqIChyYXRpbyAvIGNoYXJzKSwgcGFyc2VGbG9hdChtYXgpKSwgcGFyc2VGbG9hdChtaW4pKTtcblx0XHRcdFx0XHQkdGhpcy5jc3MoJ2ZvbnQtc2l6ZScsIHNpemUpO1xuXHRcdFx0XHRcdGlmICggc2l6ZSA8PSBtaW4gKSB7XG5cdFx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnd3JhcC10ZXh0Jyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCd3cmFwLXRleHQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdGZpdCgpO1xuXG5cdFx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIGZpdCk7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvLyBGaXggV1BNTCBEcm9wZG93blxuXHQkKCcubWVudS1pdGVtLWxhbmd1YWdlJykuYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpLmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XG5cblx0Ly8gRml4IFBvbHlMYW5nIE1lbnUgSXRlbXMgQW5kIE1ha2UgVGhlbSBEcm9wZG93blxuXHQkKCcubWVudS1pdGVtLmxhbmctaXRlbScpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdHZhciBpdGVtID0gJCgnLmxhbmctaXRlbS5jdXJyZW50LWxhbmcnKTtcblx0aWYgKGl0ZW0ubGVuZ3RoID09PSAwKSB7XG5cdFx0aXRlbSA9ICQoJy5sYW5nLWl0ZW0nKS5maXJzdCgpO1xuXHR9XG5cdHZhciBsYW5ncyA9IGl0ZW0uc2libGluZ3MoJy5sYW5nLWl0ZW0nKTtcblx0aXRlbS5hZGRDbGFzcygnZHJvcGRvd24gZHJvcC1tZW51Jyk7XG5cdGxhbmdzLndyYXBBbGwoJzx1bCBjbGFzcz1cInN1Yi1tZW51IGRyb3Bkb3duLW1lbnVcIj48L3VsPicpLnBhcmVudCgpLmFwcGVuZFRvKGl0ZW0pO1xufSkoalF1ZXJ5KTsiLCIvKiEgbW9kZXJuaXpyIDMuMi4wIChDdXN0b20gQnVpbGQpIHwgTUlUICpcbiAqIGh0dHA6Ly9tb2Rlcm5penIuY29tL2Rvd25sb2FkLz8tZmxleGJveC1vYmplY3RmaXQtc2hpdiAhKi9cbiFmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gcihlLHQpe3JldHVybiB0eXBlb2YgZT09PXR9ZnVuY3Rpb24gbygpe3ZhciBlLHQsbixvLGEsaSxzO2Zvcih2YXIgbCBpbiBDKWlmKEMuaGFzT3duUHJvcGVydHkobCkpe2lmKGU9W10sdD1DW2xdLHQubmFtZSYmKGUucHVzaCh0Lm5hbWUudG9Mb3dlckNhc2UoKSksdC5vcHRpb25zJiZ0Lm9wdGlvbnMuYWxpYXNlcyYmdC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSlmb3Iobj0wO248dC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoO24rKyllLnB1c2godC5vcHRpb25zLmFsaWFzZXNbbl0udG9Mb3dlckNhc2UoKSk7Zm9yKG89cih0LmZuLFwiZnVuY3Rpb25cIik/dC5mbigpOnQuZm4sYT0wO2E8ZS5sZW5ndGg7YSsrKWk9ZVthXSxzPWkuc3BsaXQoXCIuXCIpLDE9PT1zLmxlbmd0aD9Nb2Rlcm5penJbc1swXV09bzooIU1vZGVybml6cltzWzBdXXx8TW9kZXJuaXpyW3NbMF1daW5zdGFuY2VvZiBCb29sZWFufHwoTW9kZXJuaXpyW3NbMF1dPW5ldyBCb29sZWFuKE1vZGVybml6cltzWzBdXSkpLE1vZGVybml6cltzWzBdXVtzWzFdXT1vKSx5LnB1c2goKG8/XCJcIjpcIm5vLVwiKStzLmpvaW4oXCItXCIpKX19ZnVuY3Rpb24gYShlKXt2YXIgdD14LmNsYXNzTmFtZSxuPU1vZGVybml6ci5fY29uZmlnLmNsYXNzUHJlZml4fHxcIlwiO2lmKGImJih0PXQuYmFzZVZhbCksTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlSlNDbGFzcyl7dmFyIHI9bmV3IFJlZ0V4cChcIihefFxcXFxzKVwiK24rXCJuby1qcyhcXFxcc3wkKVwiKTt0PXQucmVwbGFjZShyLFwiJDFcIituK1wianMkMlwiKX1Nb2Rlcm5penIuX2NvbmZpZy5lbmFibGVDbGFzc2VzJiYodCs9XCIgXCIrbitlLmpvaW4oXCIgXCIrbiksYj94LmNsYXNzTmFtZS5iYXNlVmFsPXQ6eC5jbGFzc05hbWU9dCl9ZnVuY3Rpb24gaShlKXtyZXR1cm4gZS5yZXBsYWNlKC8oW2Etel0pLShbYS16XSkvZyxmdW5jdGlvbihlLHQsbil7cmV0dXJuIHQrbi50b1VwcGVyQ2FzZSgpfSkucmVwbGFjZSgvXi0vLFwiXCIpfWZ1bmN0aW9uIHMoZSx0KXtyZXR1cm4hIX4oXCJcIitlKS5pbmRleE9mKHQpfWZ1bmN0aW9uIGwoKXtyZXR1cm5cImZ1bmN0aW9uXCIhPXR5cGVvZiB0LmNyZWF0ZUVsZW1lbnQ/dC5jcmVhdGVFbGVtZW50KGFyZ3VtZW50c1swXSk6Yj90LmNyZWF0ZUVsZW1lbnROUy5jYWxsKHQsXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGFyZ3VtZW50c1swXSk6dC5jcmVhdGVFbGVtZW50LmFwcGx5KHQsYXJndW1lbnRzKX1mdW5jdGlvbiBmKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUuYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiB1KGUsdCxuKXt2YXIgbztmb3IodmFyIGEgaW4gZSlpZihlW2FdaW4gdClyZXR1cm4gbj09PSExP2VbYV06KG89dFtlW2FdXSxyKG8sXCJmdW5jdGlvblwiKT9mKG8sbnx8dCk6byk7cmV0dXJuITF9ZnVuY3Rpb24gYyhlKXtyZXR1cm4gZS5yZXBsYWNlKC8oW0EtWl0pL2csZnVuY3Rpb24oZSx0KXtyZXR1cm5cIi1cIit0LnRvTG93ZXJDYXNlKCl9KS5yZXBsYWNlKC9ebXMtLyxcIi1tcy1cIil9ZnVuY3Rpb24gZCgpe3ZhciBlPXQuYm9keTtyZXR1cm4gZXx8KGU9bChiP1wic3ZnXCI6XCJib2R5XCIpLGUuZmFrZT0hMCksZX1mdW5jdGlvbiBwKGUsbixyLG8pe3ZhciBhLGkscyxmLHU9XCJtb2Rlcm5penJcIixjPWwoXCJkaXZcIikscD1kKCk7aWYocGFyc2VJbnQociwxMCkpZm9yKDtyLS07KXM9bChcImRpdlwiKSxzLmlkPW8/b1tyXTp1KyhyKzEpLGMuYXBwZW5kQ2hpbGQocyk7cmV0dXJuIGE9bChcInN0eWxlXCIpLGEudHlwZT1cInRleHQvY3NzXCIsYS5pZD1cInNcIit1LChwLmZha2U/cDpjKS5hcHBlbmRDaGlsZChhKSxwLmFwcGVuZENoaWxkKGMpLGEuc3R5bGVTaGVldD9hLnN0eWxlU2hlZXQuY3NzVGV4dD1lOmEuYXBwZW5kQ2hpbGQodC5jcmVhdGVUZXh0Tm9kZShlKSksYy5pZD11LHAuZmFrZSYmKHAuc3R5bGUuYmFja2dyb3VuZD1cIlwiLHAuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixmPXguc3R5bGUub3ZlcmZsb3cseC5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLHguYXBwZW5kQ2hpbGQocCkpLGk9bihjLGUpLHAuZmFrZT8ocC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHApLHguc3R5bGUub3ZlcmZsb3c9Zix4Lm9mZnNldEhlaWdodCk6Yy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGMpLCEhaX1mdW5jdGlvbiBtKHQscil7dmFyIG89dC5sZW5ndGg7aWYoXCJDU1NcImluIGUmJlwic3VwcG9ydHNcImluIGUuQ1NTKXtmb3IoO28tLTspaWYoZS5DU1Muc3VwcG9ydHMoYyh0W29dKSxyKSlyZXR1cm4hMDtyZXR1cm4hMX1pZihcIkNTU1N1cHBvcnRzUnVsZVwiaW4gZSl7Zm9yKHZhciBhPVtdO28tLTspYS5wdXNoKFwiKFwiK2ModFtvXSkrXCI6XCIrcitcIilcIik7cmV0dXJuIGE9YS5qb2luKFwiIG9yIFwiKSxwKFwiQHN1cHBvcnRzIChcIithK1wiKSB7ICNtb2Rlcm5penIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfVwiLGZ1bmN0aW9uKGUpe3JldHVyblwiYWJzb2x1dGVcIj09Z2V0Q29tcHV0ZWRTdHlsZShlLG51bGwpLnBvc2l0aW9ufSl9cmV0dXJuIG59ZnVuY3Rpb24gaChlLHQsbyxhKXtmdW5jdGlvbiBmKCl7YyYmKGRlbGV0ZSBGLnN0eWxlLGRlbGV0ZSBGLm1vZEVsZW0pfWlmKGE9cihhLFwidW5kZWZpbmVkXCIpPyExOmEsIXIobyxcInVuZGVmaW5lZFwiKSl7dmFyIHU9bShlLG8pO2lmKCFyKHUsXCJ1bmRlZmluZWRcIikpcmV0dXJuIHV9Zm9yKHZhciBjLGQscCxoLHYsZz1bXCJtb2Rlcm5penJcIixcInRzcGFuXCJdOyFGLnN0eWxlOyljPSEwLEYubW9kRWxlbT1sKGcuc2hpZnQoKSksRi5zdHlsZT1GLm1vZEVsZW0uc3R5bGU7Zm9yKHA9ZS5sZW5ndGgsZD0wO3A+ZDtkKyspaWYoaD1lW2RdLHY9Ri5zdHlsZVtoXSxzKGgsXCItXCIpJiYoaD1pKGgpKSxGLnN0eWxlW2hdIT09bil7aWYoYXx8cihvLFwidW5kZWZpbmVkXCIpKXJldHVybiBmKCksXCJwZnhcIj09dD9oOiEwO3RyeXtGLnN0eWxlW2hdPW99Y2F0Y2goeSl7fWlmKEYuc3R5bGVbaF0hPXYpcmV0dXJuIGYoKSxcInBmeFwiPT10P2g6ITB9cmV0dXJuIGYoKSwhMX1mdW5jdGlvbiB2KGUsdCxuLG8sYSl7dmFyIGk9ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStlLnNsaWNlKDEpLHM9KGUrXCIgXCIrdy5qb2luKGkrXCIgXCIpK2kpLnNwbGl0KFwiIFwiKTtyZXR1cm4gcih0LFwic3RyaW5nXCIpfHxyKHQsXCJ1bmRlZmluZWRcIik/aChzLHQsbyxhKToocz0oZStcIiBcIitOLmpvaW4oaStcIiBcIikraSkuc3BsaXQoXCIgXCIpLHUocyx0LG4pKX1mdW5jdGlvbiBnKGUsdCxyKXtyZXR1cm4gdihlLG4sbix0LHIpfXZhciB5PVtdLEM9W10sRT17X3ZlcnNpb246XCIzLjIuMFwiLF9jb25maWc6e2NsYXNzUHJlZml4OlwiXCIsZW5hYmxlQ2xhc3NlczohMCxlbmFibGVKU0NsYXNzOiEwLHVzZVByZWZpeGVzOiEwfSxfcTpbXSxvbjpmdW5jdGlvbihlLHQpe3ZhciBuPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3QobltlXSl9LDApfSxhZGRUZXN0OmZ1bmN0aW9uKGUsdCxuKXtDLnB1c2goe25hbWU6ZSxmbjp0LG9wdGlvbnM6bn0pfSxhZGRBc3luY1Rlc3Q6ZnVuY3Rpb24oZSl7Qy5wdXNoKHtuYW1lOm51bGwsZm46ZX0pfX0sTW9kZXJuaXpyPWZ1bmN0aW9uKCl7fTtNb2Rlcm5penIucHJvdG90eXBlPUUsTW9kZXJuaXpyPW5ldyBNb2Rlcm5penI7dmFyIHg9dC5kb2N1bWVudEVsZW1lbnQsYj1cInN2Z1wiPT09eC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2J8fCFmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLHI9ZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGUuZG9jdW1lbnRFbGVtZW50O3JldHVybiBuLmlubmVySFRNTD1cIng8c3R5bGU+XCIrdCtcIjwvc3R5bGU+XCIsci5pbnNlcnRCZWZvcmUobi5sYXN0Q2hpbGQsci5maXJzdENoaWxkKX1mdW5jdGlvbiByKCl7dmFyIGU9Qy5lbGVtZW50cztyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZT9lLnNwbGl0KFwiIFwiKTplfWZ1bmN0aW9uIG8oZSx0KXt2YXIgbj1DLmVsZW1lbnRzO1wic3RyaW5nXCIhPXR5cGVvZiBuJiYobj1uLmpvaW4oXCIgXCIpKSxcInN0cmluZ1wiIT10eXBlb2YgZSYmKGU9ZS5qb2luKFwiIFwiKSksQy5lbGVtZW50cz1uK1wiIFwiK2UsZih0KX1mdW5jdGlvbiBhKGUpe3ZhciB0PXlbZVt2XV07cmV0dXJuIHR8fCh0PXt9LGcrKyxlW3ZdPWcseVtnXT10KSx0fWZ1bmN0aW9uIGkoZSxuLHIpe2lmKG58fChuPXQpLGMpcmV0dXJuIG4uY3JlYXRlRWxlbWVudChlKTtyfHwocj1hKG4pKTt2YXIgbztyZXR1cm4gbz1yLmNhY2hlW2VdP3IuY2FjaGVbZV0uY2xvbmVOb2RlKCk6aC50ZXN0KGUpPyhyLmNhY2hlW2VdPXIuY3JlYXRlRWxlbShlKSkuY2xvbmVOb2RlKCk6ci5jcmVhdGVFbGVtKGUpLCFvLmNhbkhhdmVDaGlsZHJlbnx8bS50ZXN0KGUpfHxvLnRhZ1Vybj9vOnIuZnJhZy5hcHBlbmRDaGlsZChvKX1mdW5jdGlvbiBzKGUsbil7aWYoZXx8KGU9dCksYylyZXR1cm4gZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7bj1ufHxhKGUpO2Zvcih2YXIgbz1uLmZyYWcuY2xvbmVOb2RlKCksaT0wLHM9cigpLGw9cy5sZW5ndGg7bD5pO2krKylvLmNyZWF0ZUVsZW1lbnQoc1tpXSk7cmV0dXJuIG99ZnVuY3Rpb24gbChlLHQpe3QuY2FjaGV8fCh0LmNhY2hlPXt9LHQuY3JlYXRlRWxlbT1lLmNyZWF0ZUVsZW1lbnQsdC5jcmVhdGVGcmFnPWUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCx0LmZyYWc9dC5jcmVhdGVGcmFnKCkpLGUuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihuKXtyZXR1cm4gQy5zaGl2TWV0aG9kcz9pKG4sZSx0KTp0LmNyZWF0ZUVsZW0obil9LGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrcigpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtOl0rL2csZnVuY3Rpb24oZSl7cmV0dXJuIHQuY3JlYXRlRWxlbShlKSx0LmZyYWcuY3JlYXRlRWxlbWVudChlKSwnYyhcIicrZSsnXCIpJ30pK1wiKTtyZXR1cm4gbn1cIikoQyx0LmZyYWcpfWZ1bmN0aW9uIGYoZSl7ZXx8KGU9dCk7dmFyIHI9YShlKTtyZXR1cm4hQy5zaGl2Q1NTfHx1fHxyLmhhc0NTU3x8KHIuaGFzQ1NTPSEhbihlLFwiYXJ0aWNsZSxhc2lkZSxkaWFsb2csZmlnY2FwdGlvbixmaWd1cmUsZm9vdGVyLGhlYWRlcixoZ3JvdXAsbWFpbixuYXYsc2VjdGlvbntkaXNwbGF5OmJsb2NrfW1hcmt7YmFja2dyb3VuZDojRkYwO2NvbG9yOiMwMDB9dGVtcGxhdGV7ZGlzcGxheTpub25lfVwiKSksY3x8bChlLHIpLGV9dmFyIHUsYyxkPVwiMy43LjNcIixwPWUuaHRtbDV8fHt9LG09L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksaD0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksdj1cIl9odG1sNXNoaXZcIixnPTAseT17fTshZnVuY3Rpb24oKXt0cnl7dmFyIGU9dC5jcmVhdGVFbGVtZW50KFwiYVwiKTtlLmlubmVySFRNTD1cIjx4eXo+PC94eXo+XCIsdT1cImhpZGRlblwiaW4gZSxjPTE9PWUuY2hpbGROb2Rlcy5sZW5ndGh8fGZ1bmN0aW9uKCl7dC5jcmVhdGVFbGVtZW50KFwiYVwiKTt2YXIgZT10LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jbG9uZU5vZGV8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnR8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNyZWF0ZUVsZW1lbnR9KCl9Y2F0Y2gobil7dT0hMCxjPSEwfX0oKTt2YXIgQz17ZWxlbWVudHM6cC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHBpY3R1cmUgcHJvZ3Jlc3Mgc2VjdGlvbiBzdW1tYXJ5IHRlbXBsYXRlIHRpbWUgdmlkZW9cIix2ZXJzaW9uOmQsc2hpdkNTUzpwLnNoaXZDU1MhPT0hMSxzdXBwb3J0c1Vua25vd25FbGVtZW50czpjLHNoaXZNZXRob2RzOnAuc2hpdk1ldGhvZHMhPT0hMSx0eXBlOlwiZGVmYXVsdFwiLHNoaXZEb2N1bWVudDpmLGNyZWF0ZUVsZW1lbnQ6aSxjcmVhdGVEb2N1bWVudEZyYWdtZW50OnMsYWRkRWxlbWVudHM6b307ZS5odG1sNT1DLGYodCksXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz1DKX0oXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGU/ZTp0aGlzLHQpO3ZhciBTPVwiTW96IE8gbXMgV2Via2l0XCIsdz1FLl9jb25maWcudXNlUHJlZml4ZXM/Uy5zcGxpdChcIiBcIik6W107RS5fY3Nzb21QcmVmaXhlcz13O3ZhciBfPWZ1bmN0aW9uKHQpe3ZhciByLG89cHJlZml4ZXMubGVuZ3RoLGE9ZS5DU1NSdWxlO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBhKXJldHVybiBuO2lmKCF0KXJldHVybiExO2lmKHQ9dC5yZXBsYWNlKC9eQC8sXCJcIikscj10LnJlcGxhY2UoLy0vZyxcIl9cIikudG9VcHBlckNhc2UoKStcIl9SVUxFXCIsciBpbiBhKXJldHVyblwiQFwiK3Q7Zm9yKHZhciBpPTA7bz5pO2krKyl7dmFyIHM9cHJlZml4ZXNbaV0sbD1zLnRvVXBwZXJDYXNlKCkrXCJfXCIrcjtpZihsIGluIGEpcmV0dXJuXCJALVwiK3MudG9Mb3dlckNhc2UoKStcIi1cIit0fXJldHVybiExfTtFLmF0UnVsZT1fO3ZhciBOPUUuX2NvbmZpZy51c2VQcmVmaXhlcz9TLnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpOltdO0UuX2RvbVByZWZpeGVzPU47dmFyIGo9e2VsZW06bChcIm1vZGVybml6clwiKX07TW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKXtkZWxldGUgai5lbGVtfSk7dmFyIEY9e3N0eWxlOmouZWxlbS5zdHlsZX07TW9kZXJuaXpyLl9xLnVuc2hpZnQoZnVuY3Rpb24oKXtkZWxldGUgRi5zdHlsZX0pLEUudGVzdEFsbFByb3BzPXYsRS50ZXN0QWxsUHJvcHM9ZyxNb2Rlcm5penIuYWRkVGVzdChcImZsZXhib3hcIixnKFwiZmxleEJhc2lzXCIsXCIxcHhcIiwhMCkpO3ZhciBUPUUucHJlZml4ZWQ9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiAwPT09ZS5pbmRleE9mKFwiQFwiKT9fKGUpOigtMSE9ZS5pbmRleE9mKFwiLVwiKSYmKGU9aShlKSksdD92KGUsdCxuKTp2KGUsXCJwZnhcIikpfTtNb2Rlcm5penIuYWRkVGVzdChcIm9iamVjdGZpdFwiLCEhVChcIm9iamVjdEZpdFwiKSx7YWxpYXNlczpbXCJvYmplY3QtZml0XCJdfSksbygpLGEoeSksZGVsZXRlIEUuYWRkVGVzdCxkZWxldGUgRS5hZGRBc3luY1Rlc3Q7Zm9yKHZhciBrPTA7azxNb2Rlcm5penIuX3EubGVuZ3RoO2srKylNb2Rlcm5penIuX3Fba10oKTtlLk1vZGVybml6cj1Nb2Rlcm5penJ9KHdpbmRvdyxkb2N1bWVudCk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuRUxFTUVOVCBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyk7XG5cblxuXHQvLyBFbGVtZW50IEFuaW1hdGlvbnNcblx0ZnVuY3Rpb24gbWl4dEFuaW1hdGlvbnMoKSB7XG5cdFx0dmFyIGFuaW1FbGVtcyA9ICQoJy5taXh0LWFuaW1hdGUnKTtcblxuXHRcdGlmICggYW5pbUVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XG5cblx0XHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRhbmltRWxlbXMud2F5cG9pbnQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbS1wcmUnKS5hZGRDbGFzcygnYW5pbS1zdGFydCcpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5kZXN0cm95ID09PSAnZnVuY3Rpb24nICkgdGhpcy5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0b2Zmc2V0OiAnODUlJyxcblx0XHRcdFx0XHRcdHRyaWdnZXJPbmNlOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIDEwMDAgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRtaXh0QW5pbWF0aW9ucygpO1xuXG5cblx0Ly8gU3RhdCAvIENvdW50ZXIgRWxlbWVudFxuXHRmdW5jdGlvbiBtaXh0U3RhdHMoKSB7XG5cdFx0dmFyIHN0YXRFbGVtcyA9ICQoJy5taXh0LXN0YXQnKTtcblxuXHRcdGlmICggc3RhdEVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XG5cblx0XHQvLyBTZXQgc3RhdCB0ZXh0IHRvIHN0YXJ0aW5nIChmcm9tKSB2YWx1ZVxuXHRcdHN0YXRFbGVtcy5maW5kKCcuc3RhdC12YWx1ZScpLmVhY2goIGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKCdmcm9tJykpOyB9KTtcblxuXHRcdC8vIEFuaW1hdGUgdmFsdWVcblx0XHRmdW5jdGlvbiBzdGF0VmFsdWUoZWwpIHtcblx0XHRcdHZhciBmcm9tICAgPSBlbC5kYXRhKCdmcm9tJyksXG5cdFx0XHRcdHRvICAgICA9IGVsLmRhdGEoJ3RvJyksXG5cdFx0XHRcdHNwZWVkICA9IGVsLmRhdGEoJ3NwZWVkJyksXG5cdFx0XHRcdGxpbmVhciA9IGVsLmRhdGEoJ2xpbmVhcicpO1xuXHRcdFx0JCh7dmFsdWU6IGZyb219KS5hbmltYXRlKHt2YWx1ZTogdG99LCB7XG5cdFx0XHRcdGR1cmF0aW9uOiBzcGVlZCxcblx0XHRcdFx0ZWFzaW5nOiAoIGxpbmVhciA9PSB0cnVlICkgPyAnbGluZWFyJyA6ICdzd2luZycsXG5cdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KE1hdGgucm91bmQodGhpcy52YWx1ZSkpOyB9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KHRvKTsgfVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxuXHRcdGZ1bmN0aW9uIHN0YXRDaXJjbGUoc3RhdCkge1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5jaXJjbGVQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmNzcygnbWFyZ2luLXRvcCcsICQodGhpcykuaGVpZ2h0KCkgLyAtMik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0c3RhdEVsZW1zLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc3RhdCA9ICQodGhpcyk7XG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0c3RhdC53YXlwb2ludCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXG5cdFx0XHRcdFx0XHR0cmlnZ2VyT25jZTogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRWYWx1ZShzdGF0LmZpbmQoJy5zdGF0LXZhbHVlJykpO1xuXHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdG1peHRTdGF0cygpO1xuXG5cblx0Ly8gRmxpcCBDYXJkIEVxdWFsaXplIEhlaWdodFxuXHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcblx0XHRmbGlwY2FyZFNpZGVzLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRmbGlwY2FyZFNpZGVzLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblx0XHR9KTtcblx0fVxuXHQvLyBGbGlwIENhcmQgVG91Y2ggU2NyZWVuIFwiSG92ZXJcIlxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXInKTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVBREVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xuXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXG5cdFx0bWFpbk5hdiAgID0gJCgnI21haW4tbmF2JyksXG5cdFx0bWVkaWFXcmFwID0gJCgnLmhlYWQtbWVkaWEnKTtcblxuXHQvLyBIZWFkIE1lZGlhIEZ1bmN0aW9uc1xuXHRmdW5jdGlvbiBoZWFkZXJGbigpIHtcblx0XHR2YXIgbWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCksXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXG5cdFx0XHR2aWV3SGVpZ2h0ICAgPSB2aWV3cG9ydC5oZWlnaHQoKSAtIG1lZGlhV3JhcC5vZmZzZXQoKS50b3A7XG5cblx0XHQvLyBNYWtlIGhlYWRlciBmdWxsc2NyZWVuXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcblx0XHRcdHZhciBmdWxsSGVpZ2h0ID0gdmlld0hlaWdodDtcblxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIGZ1bGxIZWlnaHQgLT0gdG9wTmF2SGVpZ2h0O1xuXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCBmdWxsSGVpZ2h0KTtcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGZ1bGxIZWlnaHQpO1xuXG5cdFx0Ly8gU2V0IGhlYWRlciBoZWlnaHQgdG8gdmlld3BvcnQgcGVyY2VudGFnZVxuXHRcdH0gZWxzZSBpZiAoIG1peHRfb3B0LmhlYWRlci5oZWlnaHQuaGVpZ2h0ICE9ICcnICYmIG1peHRfb3B0LmhlYWRlci5oZWlnaHQudW5pdHMgPT0gJyUnICkge1xuXHRcdFx0dmFyIGhlaWdodCA9IHBhcnNlSW50KG1peHRfb3B0LmhlYWRlci5oZWlnaHQuaGVpZ2h0LCAxMCkgLyAxMDAgKiB2aWV3SGVpZ2h0O1xuXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICYmICEgbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICkgaGVpZ2h0IC09IHRvcE5hdkhlaWdodDtcblxuXHRcdFx0bWVkaWFXcmFwLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG5cdFx0fVxuXG5cdFx0Ly8gUHJldmVudCBjb250ZW50IGZhZGUgaWYgaGVhZGVyIGlzIHRhbGxlciB0aGFuIHZpZXdwb3J0XG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXJbJ2NvbnRlbnQtZmFkZSddICkge1xuXHRcdFx0aWYgKCB3cmFwSGVpZ2h0ID4gdmlld0hlaWdodCApIHtcblx0XHRcdFx0bWVkaWFXcmFwLmFkZENsYXNzKCduby1mYWRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZWRpYVdyYXAucmVtb3ZlQ2xhc3MoJ25vLWZhZGUnKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBIZWFkZXIgU2Nyb2xsIFRvIENvbnRlbnRcblx0ZnVuY3Rpb24gaGVhZGVyU2Nyb2xsKCkge1xuXHRcdHZhciBwYWdlICAgPSAkKCdodG1sLCBib2R5JyksXG5cdFx0XHRvZmZzZXQgPSAkKCcjY29udGVudC13cmFwJykub2Zmc2V0KCkudG9wO1xuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHsgb2Zmc2V0IC09IG1haW5OYXYuY2hpbGRyZW4oJy5jb250YWluZXInKS5oZWlnaHQoKTsgfVxuXHRcdCQoJy5oZWFkZXItc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRwYWdlLmFuaW1hdGUoeyBzY3JvbGxUb3A6IG9mZnNldCB9LCA4MDApO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCApIHtcblx0XHRoZWFkZXJGbigpO1xuXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuc2Nyb2xsICkgeyBoZWFkZXJTY3JvbGwoKTsgfVxuXHRcdFxuXHRcdCQod2luZG93KS5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgaGVhZGVyRm4gKSk7XG5cdH1cblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5IRUxQRVIgRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gU2tpcCBMaW5rIEZvY3VzIEZpeFxuXHRcblx0dmFyIGlzX3dlYmtpdCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApID4gLTEsXG5cdFx0aXNfb3BlcmEgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSAgPiAtMSxcblx0XHRpc19pZSAgICAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICkgICA+IC0xO1xuXG5cdGlmICggKCBpc193ZWJraXQgfHwgaXNfb3BlcmEgfHwgaXNfaWUgKSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCApICkge1xuXHRcdHZhciBldmVudE1ldGhvZCA9ICggd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdhdHRhY2hFdmVudCc7XG5cdFx0d2luZG93WyBldmVudE1ldGhvZCBdKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYXxkaXYpJC9pLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gQXBwbHkgQm9vdHN0cmFwIENsYXNzZXNcblx0XG5cdHZhciB3b29Db21tV3JhcCA9ICQoJy53b29jb21tZXJjZScpO1xuXHRcblx0dmFyIHdpZGdldE5hdk1lbnVzID0gJy53aWRnZXRfbWV0YSwgLndpZGdldF9yZWNlbnRfZW50cmllcywgLndpZGdldF9hcmNoaXZlLCAud2lkZ2V0X2NhdGVnb3JpZXMsIC53aWRnZXRfbmF2X21lbnUsIC53aWRnZXRfcGFnZXMsIC53aWRnZXRfcnNzJztcblxuXHQvLyBXb29Db21tZXJjZSBXaWRnZXRzICYgRWxlbWVudHNcblx0aWYgKCB3b29Db21tV3JhcC5sZW5ndGggKSB7XG5cdFx0d2lkZ2V0TmF2TWVudXMgKz0gJywgLndpZGdldF9wcm9kdWN0X2NhdGVnb3JpZXMsIC53aWRnZXRfcHJvZHVjdHMsIC53aWRnZXRfdG9wX3JhdGVkX3Byb2R1Y3RzLCAud2lkZ2V0X3JlY2VudF9yZXZpZXdzLCAud2lkZ2V0X3JlY2VudGx5X3ZpZXdlZF9wcm9kdWN0cywgLndpZGdldF9sYXllcmVkX25hdic7XG5cblx0XHR3b29Db21tV3JhcC5maW5kKCcuc2hvcF90YWJsZScpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1ib3JkZXJlZCcpO1xuXG5cdFx0JChkb2N1bWVudC5ib2R5KS5vbigndXBkYXRlZF9jaGVja291dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLnNob3BfdGFibGUnKS5hZGRDbGFzcygndGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtc3RyaXBlZCcpO1xuXHRcdH0pO1xuXHR9XG5cblx0JCh3aWRnZXROYXZNZW51cykuY2hpbGRyZW4oJ3VsJykuYWRkQ2xhc3MoJ25hdicpO1xuXHQkKCcud2lkZ2V0X25hdl9tZW51IHVsLm1lbnUnKS5hZGRDbGFzcygnbmF2Jyk7XG5cblx0JCgnI3dwLWNhbGVuZGFyJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQnKTtcblxuXHQvLyBIYW5kbGUgUG9zdCBDb3VudCBUYWdzXG5cblx0JCgnLndpZGdldF9hcmNoaXZlIGxpLCAud2lkZ2V0X2NhdGVnb3JpZXMgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcblx0XHRcdGNoaWxkcmVuICA9ICR0aGlzLmNoaWxkcmVuKCksXG5cdFx0XHRhbmNob3IgICAgPSBjaGlsZHJlbi5maWx0ZXIoJ2EnKSxcblx0XHRcdGNvbnRlbnRzICA9ICR0aGlzLmNvbnRlbnRzKCksXG5cdFx0XHRjb3VudFRleHQgPSBjb250ZW50cy5ub3QoY2hpbGRyZW4pLnRleHQoKTtcblxuXHRcdGlmICggY291bnRUZXh0ICE9PSAnJyApIHtcblx0XHRcdGFuY2hvci5hcHBlbmQoJzxzcGFuIGNsYXNzPVwicG9zdC1jb3VudFwiPicgKyBjb3VudFRleHQgKyAnPC9zcGFuPicpO1xuXHRcdFx0Y29udGVudHMuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDM7IFxuXHRcdFx0fSkucmVtb3ZlKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcud2lkZ2V0Lndvb2NvbW1lcmNlIGxpJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdGNvdW50ID0gJHRoaXMuY2hpbGRyZW4oJy5jb3VudCcpLFxuXHRcdFx0bGluayAgPSAkdGhpcy5jaGlsZHJlbignYScpO1xuXHRcdGNvdW50LmFwcGVuZFRvKGxpbmspO1xuXHR9KTtcblxuXHQvLyBHYWxsZXJ5IEFycm93IE5hdmlnYXRpb25cblxuXHQkKGRvY3VtZW50KS5rZXlkb3duKCBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHVybCA9IGZhbHNlO1xuXHRcdGlmICggZS53aGljaCA9PT0gMzcgKSB7ICAvLyBMZWZ0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcucHJldmlvdXMtaW1hZ2UgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9IGVsc2UgaWYgKCBlLndoaWNoID09PSAzOSApIHsgIC8vIFJpZ2h0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcuZW50cnktYXR0YWNobWVudCBhJykuYXR0cignaHJlZicpO1xuXHRcdH1cblx0XHRpZiAoIHVybCAmJiAoICEkKCd0ZXh0YXJlYSwgaW5wdXQnKS5pcygnOmZvY3VzJykgKSApIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIERldGVjdCBJRSBWZXJzaW9uXG5cblx0dmFyIGNsYXNzZXMgPSBbXSxcblx0XHRtYXRjaCA9IC9tc2llIChcXGQrKS9pLmV4ZWMoIG5hdmlnYXRvci51c2VyQWdlbnQgKTtcblx0aWYgKCBtYXRjaCApIHtcblx0XHR2YXIgdmVyc2lvbiA9ICttYXRjaFsxXSxcblx0XHRcdG1pbiA9IDYsXG5cdFx0XHRtYXggPSAxMTtcblx0XHRjbGFzc2VzLnB1c2goICdpZScgKTtcblx0XHRjbGFzc2VzLnB1c2goICdpZScgKyB2ZXJzaW9uICk7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbk5BVkJBUiBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGNvbG9yTG9ELCBjb2xvclRvUmdiYSAqL1xuXG5cdHZhciB2aWV3cG9ydCAgICAgPSAkKHdpbmRvdyksXG5cdFx0Ym9keUVsICAgICAgID0gJCgnYm9keScpLFxuXHRcdG1haW5XcmFwICAgICA9ICQoJyNtYWluLXdyYXAnKSxcblx0XHRtYWluTmF2V3JhcCAgPSAkKCcjbWFpbi1uYXYtd3JhcCcpLFxuXHRcdG1haW5OYXZCYXIgICA9ICQoJyNtYWluLW5hdicpLFxuXHRcdG1haW5OYXZDb250ICA9IG1haW5OYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcblx0XHRtYWluTmF2SGVhZCAgPSAkKCcubmF2YmFyLWhlYWRlcicsIG1haW5OYXZCYXIpLFxuXHRcdG1haW5OYXZJbm5lciA9ICQoJy5uYXZiYXItaW5uZXInLCBtYWluTmF2QmFyKSxcblx0XHRzZWNOYXZCYXIgICAgPSAkKCcjc2Vjb25kLW5hdicpLFxuXHRcdHNlY05hdkNvbnQgICA9IHNlY05hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxuXHRcdG5hdmJhcnMgICAgICA9ICQoJy5uYXZiYXInKSxcblx0XHRtZWRpYVdyYXAgICAgPSAkKCcuaGVhZC1tZWRpYScpO1xuXG5cdGlmICggbWFpbk5hdkJhci5sZW5ndGggPT09IDAgKSByZXR1cm47XG5cblx0dmFyIE5hdmJhciA9IHtcblxuXHRcdG5hdkJnOiAnJyxcblx0XHRuYXZCZ1RvcDogJycsXG5cblx0XHQvLyBJbml0aWFsaXplIE5hdmJhclxuXHRcdGluaXQ6IGZ1bmN0aW9uKG5hdmJhcikge1xuXHRcdFx0dmFyIGRhdGFDb250ID0gbmF2YmFyLmZpbmQoJy5uYXZiYXItZGF0YScpLFxuXHRcdFx0XHRiZ0NvbG9yICA9ICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkgPyBkYXRhQ29udC5jc3MoJ2JhY2tncm91bmQtY29sb3InKSA6IG5hdmJhci5jc3MoJ2JhY2tncm91bmQtY29sb3InKSxcblx0XHRcdFx0Y29sb3JMdW0gPSBkYXRhQ29udC5sZW5ndGggPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkYXRhQ29udFswXSwgJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpIDogJyc7XG5cblx0XHRcdGlmICggY29sb3JMdW0gIT0gJ2RhcmsnICYmIGNvbG9yTHVtICE9ICdsaWdodCcgKSBjb2xvckx1bSA9IGNvbG9yTG9EKGJnQ29sb3IpO1xuXG5cdFx0XHRpZiAoIG5hdmJhci5pcyhtYWluTmF2QmFyKSApIHtcblxuXHRcdFx0XHR0aGlzLm5hdkJnID0gKCBjb2xvckx1bSA9PSAnZGFyaycgKSA/ICdiZy1kYXJrJyA6ICdiZy1saWdodCc7XG5cdFx0XHRcdG5hdmJhci5hZGRDbGFzcyh0aGlzLm5hdkJnKTtcblxuXHRcdFx0XHRtYWluTmF2QmFyLmF0dHIoJ2RhdGEtYmcnLCBjb2xvckx1bSk7XG5cblx0XHRcdFx0dmFyIG5hdlNoZWV0ID0gJCgnPHN0eWxlIGRhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIj4nKTtcblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgIT0gJ3ZlcnRpY2FsJyApIHtcblx0XHRcdFx0XHRuYXZTaGVldC5hcHBlbmQoJyNtYWluLW5hdi5uYXZiYXItbWl4dDpub3QoLnBvc2l0aW9uLXRvcCkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yVG9SZ2JhKGJnQ29sb3IsIG1peHRfb3B0Lm5hdi5vcGFjaXR5KSsnOyB9Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCApIHtcblx0XHRcdFx0XHRuYXZTaGVldC5hcHBlbmQoJy5uYXYtdHJhbnNwYXJlbnQgI21haW4tbmF2Lm5hdmJhci1taXh0LnBvc2l0aW9uLXRvcCB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JUb1JnYmEoYmdDb2xvciwgbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddKSsnOyB9Jyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPD0gMC40ICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWRhcmsnKSApIHsgdGhpcy5uYXZCZ1RvcCA9ICdiZy1kYXJrJzsgfVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIG1lZGlhV3JhcC5oYXNDbGFzcygnYmctbGlnaHQnKSApIHsgdGhpcy5uYXZCZ1RvcCA9ICdiZy1saWdodCc7IH1cblx0XHRcdFx0XHRcdGVsc2UgeyB0aGlzLm5hdkJnVG9wID0gdGhpcy5uYXZCZzsgfVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdE5hdmJhci5zdGlja3kudG9nZ2xlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5uYXZCZ1RvcCA9IHRoaXMubmF2Qmc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdzdGF0aWMnICkge1xuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3ModGhpcy5uYXZCZykuYWRkQ2xhc3ModGhpcy5uYXZCZ1RvcCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIG5hdlNoZWV0Lmh0bWwoKSAhPSAnJyApIHtcblx0XHRcdFx0XHRuYXZTaGVldC5hcHBlbmRUbygkKCdoZWFkJykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIGNvbG9yTHVtID09ICdkYXJrJyApIHtcblx0XHRcdFx0XHRuYXZiYXIuYWRkQ2xhc3MoJ2JnLWRhcmsnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuYXZiYXIuYWRkQ2xhc3MoJ2JnLWxpZ2h0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uc1xuXHRcdHN0aWNreToge1xuXHRcdFx0aXNNb2JpbGU6IGZhbHNlLFxuXHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0c2Nyb2xsQ29ycmVjdGlvbjogMCxcblxuXHRcdFx0Ly8gVHJpZ2dlciBvciB1cGRhdGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbihpc01vYmlsZSkge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IDA7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kuaXNNb2JpbGUgPSBpc01vYmlsZTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS5zY3JvbGxDb3JyZWN0aW9uID0gMDtcblxuXHRcdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSAmJiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyB8fCAoIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSB2aWV3cG9ydC5oZWlnaHQoKSApID4gMTYwICkgKSB7XG5cdFx0XHRcdFx0bWFpbk5hdkJhci5kYXRhKCdmaXhlZCcsIHRydWUpO1xuXHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCAkLnRocm90dGxlKDUwLCBOYXZiYXIuc3RpY2t5LnRvZ2dsZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1haW5OYXZCYXIuZGF0YSgnZml4ZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIuc3RpY2t5LnRvZ2dsZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XG5cdFx0XHRcdFx0TmF2YmFyLnN0aWNreS5zY3JvbGxDb3JyZWN0aW9uICs9IHBhcnNlRmxvYXQobWFpbldyYXAuY3NzKCdwYWRkaW5nLXRvcCcpLCAxMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ2hvcml6b250YWwnICYmIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IG1haW5OYXZCYXIub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdE5hdmJhci5zdGlja3kudG9nZ2xlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBUb2dnbGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wIC0gTmF2YmFyLnN0aWNreS5vZmZzZXQsXG5cdFx0XHRcdFx0c2Nyb2xsVmFsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gTmF2YmFyLm5hdkJnVG9wO1xuXG5cdFx0XHRcdHNjcm9sbFZhbCA9ICggTmF2YmFyLnN0aWNreS5pc01vYmlsZSA9PT0gdHJ1ZSApID8gMCA6IHNjcm9sbFZhbCArIE5hdmJhci5zdGlja3kuc2Nyb2xsQ29ycmVjdGlvbjtcblxuXHRcdFx0XHRpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0ZWxzZSBpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWxpZ2h0JykgJiYgKCBOYXZiYXIubmF2QmcgIT0gJ2JnLWRhcmsnIHx8IG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSApIHsgYmdUb3BDbHMgPSAnYmctbGlnaHQnOyB9XG5cblx0XHRcdFx0aWYgKCBzY3JvbGxWYWwgPiBuYXZQb3MgJiYgKCBtaXh0X29wdC5uYXYubGF5b3V0ICE9ICd2ZXJ0aWNhbCcgfHwgISBOYXZiYXIuc3RpY2t5LmlzTW9iaWxlICkgKSB7ICBcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKE5hdmJhci5uYXZCZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKE5hdmJhci5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBNZW51IEZ1bmN0aW9uc1xuXHRcdG1lbnU6IHtcblxuXHRcdFx0Ly8gUHJldmVudCBuYXZiYXIgc3VibWVudSBvdmVyZmxvdyBvdXQgb2Ygdmlld3BvcnRcblx0XHRcdG92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXG5cdFx0XHRcdFx0bWFpblN1YiA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51IC5kcm9wZG93bi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IC5zdWItbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiBhJyk7XG5cblx0XHRcdFx0aWYgKCBuYXZiYXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRuYXZiYXJPZmYgPSBuYXZiYXIub3V0ZXJXaWR0aCgpICsgcGFyc2VJbnQobmF2YmFyLm9mZnNldCgpLmxlZnQsIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc2V0IG1vYmlsZSBhZGp1c3RtZW50c1xuXHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcblxuXHRcdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXG5cdFx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHN1YiAgICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdHRvcFN1YiAgID0gc3ViLFxuXHRcdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXG5cdFx0XHRcdFx0XHRzdWJQb3MgICA9IHBhcnNlSW50KHN1Yi5vZmZzZXQoKS5sZWZ0LCAxMCksXG5cdFx0XHRcdFx0XHRzdWJXICAgICA9IHN1Yi5vdXRlcldpZHRoKCkgKyAxLFxuXHRcdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxuXHRcdFx0XHRcdFx0bmVzdFN1YnMgPSBzdWIuY2hpbGRyZW4oJy5kcm9wLXN1Ym1lbnUnKSxcblx0XHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IG5lc3RTdWJzLFxuXHRcdFx0XHRcdFx0Y29ycmVjdGlvbjtcblxuXHRcdFx0XHRcdGlmICggc3ViUGFyLmlzKCcubWVnYS1tZW51LWNvbHVtbicpICkge1xuXHRcdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XG5cdFx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUb3AgTGV2ZWwgU3VibWVudXNcblx0XHRcdFx0XHRpZiAoIG5lc3RPZmYgPiBuYXZiYXJPZmYgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0XHRcdFx0XHRjb3JyZWN0aW9uID0gKG5lc3RPZmYgLSBuYXZiYXJPZmYgLSAyKSAqIC0xO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cblxuXHRcdFx0XHRcdFx0aWYgKCBuYXZiYXIuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgfHwgbmF2YmFyLnBhcmVudHMoJy5uYXZiYXInKS5oYXNDbGFzcygnYm9yZGVyZWQnKSApIHsgY29ycmVjdGlvbiAtPSAxOyB9XG5cblx0XHRcdFx0XHRcdGlmICggY29ycmVjdGlvbiA8IG1nTm93ICkge1xuXHRcdFx0XHRcdFx0XHR0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcsIGNvcnJlY3Rpb24gKyAncHgnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdE5hdmJhci5tZW51LnNldERyb3BMZWZ0KG92ZXJmbG93aW5nU3Vicyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXG5cdFx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXID0gW107XG5cdFx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHMgID0gJHRoaXMucGFyZW50cygnLnN1Yi1tZW51JyksXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xuXG5cdFx0XHRcdFx0XHRcdHBhcmVudHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXICs9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXW2ldID0gJHRoaXMub3V0ZXJXaWR0aCgpICsgcGFyZW50c1c7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAobmVzdE9mZiArIG1heE5lc3RXKSA+PSBtYWluV3JhcC53aWR0aCgpICkge1xuXHRcdFx0XHRcdFx0XHROYXZiYXIubWVudS5zZXREcm9wTGVmdChzdWJOb3cpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0TmF2YmFyLm1lbnUucmVzZXRBcnJvdyhzdWJOb3cpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBTZXQgbWVudSBkcm9wIGxlZnRcblx0XHRcdHNldERyb3BMZWZ0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wLWxlZnQnKTtcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCdhcnJvdy1sZWZ0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBSZXNldCBtZW51IGRyb3Bcblx0XHRcdHJlc2V0QXJyb3c6IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIE1lZ2EgbWVudSBlbmFibGUgLyBkaXNhYmxlXG5cdFx0XHRtZWdhTWVudVRvZ2dsZTogZnVuY3Rpb24odG9nZ2xlLCBuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG1lZ2FNZW51cztcblxuXHRcdFx0XHRpZiAoIHRvZ2dsZSA9PSAnZW5hYmxlJyApIHtcblx0XHRcdFx0XHRtZWdhTWVudXMgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudVtkYXRhLW1lZ2EtbWVudT1cInRydWVcIl0nKTtcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5hZGRDbGFzcygnbWVnYS1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbWVudScpLnJlbW92ZUF0dHIoJ2RhdGEtbWVnYS1tZW51Jyk7XG5cdFx0XHRcdFx0XHQkKCc+IC5zdWItbWVudSA+IC5kcm9wLXN1Ym1lbnUnLCBtZWdhTWVudSkucmVtb3ZlQ2xhc3MoJ2Ryb3Atc3VibWVudScpLmFkZENsYXNzKCdtZWdhLW1lbnUtY29sdW1uJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIHRvZ2dsZSA9PSAnZGlzYWJsZScgKSB7XG5cdFx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5tZWdhLW1lbnUnKTtcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5yZW1vdmVDbGFzcygnbWVnYS1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbWVudScpLmF0dHIoJ2RhdGEtbWVnYS1tZW51JywgJ3RydWUnKTtcblx0XHRcdFx0XHRcdG1lZ2FNZW51LmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uJykucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKS5hZGRDbGFzcygnZHJvcC1zdWJtZW51Jyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIENyZWF0ZSBtZWdhIG1lbnUgcm93cyBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDQgY29sdW1uc1xuXHRcdFx0bWVnYU1lbnVSb3dzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bWFpbldyYXAuZmluZCgnLm1lZ2EtbWVudScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBtYWluTWVudSA9ICQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLFxuXHRcdFx0XHRcdFx0Y29sdW1ucyAgPSBtYWluTWVudS5jaGlsZHJlbignLm1lZ2EtbWVudS1jb2x1bW4nKTtcblxuXHRcdFx0XHRcdGlmICggY29sdW1ucy5sZW5ndGggPiA0ICkgbWFpbk1lbnUuYWRkQ2xhc3MoJ211bHRpLXJvdycpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0fSxcblxuXHRcdC8vIE1vYmlsZSBGdW5jdGlvbnNcblx0XHRtb2JpbGU6IHtcblxuXHRcdFx0ZGV2aWNlOiBudWxsLFxuXG5cdFx0XHQvLyBUcmlnZ2VyIG1vYmlsZSBmdW5jdGlvbnNcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdFx0XHROYXZiYXIubW9iaWxlLmRldmljZSA9IGRldmljZTtcblxuXHRcdFx0XHQkKCcuZHJvcGRvd24tdG9nZ2xlID4gLmRyb3AtYXJyb3cnLCBtYWluTmF2QmFyKS5kYXRhKCduby1oYXNoLXNjcm9sbCcsIHRydWUpO1xuXG5cdFx0XHRcdC8vIFNob3cvaGlkZSBzdWJtZW51cyBvbiBoYW5kbGUgY2xpY2tcblx0XHRcdFx0JCgnLmRyb3Bkb3duLXRvZ2dsZScsIG1haW5OYXZCYXIpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoICQoZXZlbnQudGFyZ2V0KS5pcygnLmRyb3AtYXJyb3cnKSApIHtcblx0XHRcdFx0XHRcdGlmICggZXZlbnQuaGFuZGxlZCAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXG5cdFx0XHRcdFx0XHRcdFx0bWVudSAgID0gaGFuZGxlLmNsb3Nlc3QoJy5tZW51LWl0ZW0nKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIG1lbnUuaGFzQ2xhc3MoJ2V4cGFuZCcpICkge1xuXHRcdFx0XHRcdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtZW51KS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWVudS5hZGRDbGFzcygnZXhwYW5kJykuc2libGluZ3MoJ2xpJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpLmZpbmQoJy5leHBhbmQnKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXG5cdFx0XHRcdFx0XHRcdGV2ZW50LmhhbmRsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1haW5OYXZCYXIpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcblx0XHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2Nyb2xsUG9zOiAwLFxuXG5cdFx0XHQvLyBFbmFibGUgbmF2IHNjcm9sbGluZyBpZiBuYXZiYXIgaGVpZ2h0ID4gdmlld3BvcnRcblx0XHRcdHNjcm9sbE5hdjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBOYXZiYXIubW9iaWxlLmRldmljZSA9PSAndGFibGV0JyApIHtcblx0XHRcdFx0XHR2YXIgdmlld3BvcnRIICAgICA9IHZpZXdwb3J0LmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0bmF2YmFySGVhZGVySCA9IG1haW5OYXZIZWFkLmhlaWdodCgpICsgMSxcblx0XHRcdFx0XHRcdG5hdmJhcklubmVySCAgPSBtYWluTmF2SW5uZXIuaGFzQ2xhc3MoJ2luJykgPyBtYWluTmF2SW5uZXIuaGVpZ2h0KCkgOiAwLFxuXHRcdFx0XHRcdFx0bmF2YmFySCAgICAgICA9IG5hdmJhckhlYWRlckggKyBuYXZiYXJJbm5lckgsXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgICAgID0gbWFpbk5hdkJhci5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wO1xuXG5cdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wIC09IGFkbWluQmFySDtcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbmF2YmFySCA+IHZpZXdwb3J0SCApIHtcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLm5vdCgnc3RvcHBlZCcpICkge1xuXHRcdFx0XHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBQcmV2ZW50IHNjcm9sbGluZyBhYm92ZSBuYXZiYXJcblx0XHRcdHN0b3BTY3JvbGw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgdmlld1Njcm9sbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdHN0b3BTY3JvbGwgPSBtYWluTmF2QmFyLmhhc0NsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdGlmICggTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPiBtYWluTmF2SGVhZC5vZmZzZXQoKS50b3AgKSB7IHN0b3BTY3JvbGwgPSBmYWxzZTsgfVxuXHRcdFx0XHRpZiAoIE5hdmJhci5tb2JpbGUuc2Nyb2xsUG9zID4gdmlld1Njcm9sbCAmJiBzdG9wU2Nyb2xsICkgeyB2aWV3cG9ydC5zY3JvbGxUb3AoTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MpOyB9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0TmF2YmFyLmluaXQoJCh0aGlzKSk7XG5cdH0pO1xuXHRcblx0TmF2YmFyLm1lbnUubWVnYU1lbnVSb3dzKCk7XG5cblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdCQoJ3N0eWxlW2RhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIl0nKS5yZW1vdmUoKTtcblx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJyk7XG5cdFx0TmF2YmFyLmluaXQobWFpbk5hdkJhcik7XG5cblx0fSk7XG5cblx0c2VjTmF2QmFyLm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XG5cdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJyk7XG5cdFx0TmF2YmFyLmluaXQoc2VjTmF2QmFyKTtcblx0fSk7XG5cblxuXHQvLyBDaGVjayB3aGljaCBtZWRpYSBxdWVyaWVzIGFyZSBhY3RpdmVcblx0dmFyIG1xQ2hlY2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhci1kYXRhJyksICc6YWZ0ZXInKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpO1xuXHR9O1xuXG5cblx0Ly8gRW5hYmxlIG1lbnUgaG92ZXIgb24gdG91Y2ggc2NyZWVuc1xuXHR2YXIgbWVudVBhcmVudHMgPSBuYXZiYXJzLmZpbmQoJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuOm5vdCgubWVnYS1tZW51LWNvbHVtbiksIGxpLmRyb3Bkb3duJyk7XG5cdGZ1bmN0aW9uIG1lbnVUb3VjaEhvdmVyKGV2ZW50KSB7XG5cdFx0dmFyIGl0ZW0gPSAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KSxcblx0XHRcdGFuY2VzdG9ycyA9IGl0ZW0ucGFyZW50cygnLmhvdmVyJyk7XG5cdFx0aWYgKCBpdGVtLmhhc0NsYXNzKCdob3ZlcicpICkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoJ2hvdmVyJyk7XG5cdFx0XHRtZW51UGFyZW50cy5ub3QoaXRlbSkubm90KGFuY2VzdG9ycykucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBtZW51VG91Y2hSZW1vdmVIb3ZlcihldmVudCkge1xuXHRcdGlmICggISAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KS5pcyhtZW51UGFyZW50cykgJiYgISAkKGV2ZW50LnRhcmdldCkuaXMoJ2lucHV0JykgKSB7IG1lbnVQYXJlbnRzLnJlbW92ZUNsYXNzKCdob3ZlcicpOyB9XG5cdH1cblxuXG5cdC8vIEVuc3VyZSB2ZXJ0aWNhbCBuYXZiYXIgaXRlbXMgZml0IGluIHZpZXdwb3J0XG5cdGZ1bmN0aW9uIHZlcnRpY2FsTmF2Rml0VmlldygpIHtcblx0XHRpZiAoIHZpZXdwb3J0LmhlaWdodCgpIDwgbWFpbk5hdkNvbnQuaW5uZXJIZWlnaHQoKSApIHtcblx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCd2ZXJ0aWNhbC1maXhlZCcpLmFkZENsYXNzKCd2ZXJ0aWNhbC1zdGF0aWMnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MoJ3ZlcnRpY2FsLXN0YXRpYycpLmFkZENsYXNzKCd2ZXJ0aWNhbC1maXhlZCcpO1xuXHRcdH1cblx0fVxuXG5cblx0Ly8gSGFuZGxlIG5hdmJhciBpdGVtcyBvdmVybGFwXG5cdGZ1bmN0aW9uIG5hdmJhck92ZXJsYXAoKSB7XG5cdFx0dmFyIG1xTmF2ID0gbXFDaGVjaygpLFxuXHRcdFx0bWFpbk5hdkxvZ29DbHMgPSAnbG9nby0nICsgbWFpbk5hdldyYXAuYXR0cignZGF0YS1sb2dvLWFsaWduJyk7XG5cblx0XHQvLyBQcmltYXJ5IE5hdmJhclxuXHRcdGlmICggbWFpbk5hdkxvZ29DbHMgIT0gJ2xvZ28tY2VudGVyJyAmJiBtaXh0X29wdC5uYXYubGF5b3V0ID09ICdob3Jpem9udGFsJyApIHtcblx0XHRcdG1haW5OYXZXcmFwLmFkZChtZWRpYVdyYXApLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKG1haW5OYXZMb2dvQ2xzKTtcblx0XHRcdGlmICggbXFOYXYgPT0gJ2Rlc2t0b3AnICkge1xuXHRcdFx0XHR2YXIgbWFpbk5hdkNvbnRXaWR0aCA9IG1haW5OYXZDb250LndpZHRoKCksXG5cdFx0XHRcdFx0bWFpbk5hdkl0ZW1zV2lkdGggPSBtYWluTmF2SGVhZC5vdXRlcldpZHRoKHRydWUpICsgJCgnI21haW4tbWVudScpLm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0XHRcdGlmICggbWFpbk5hdkl0ZW1zV2lkdGggPiBtYWluTmF2Q29udFdpZHRoICkge1xuXHRcdFx0XHRcdG1haW5OYXZXcmFwLmFkZChtZWRpYVdyYXApLnJlbW92ZUNsYXNzKG1haW5OYXZMb2dvQ2xzKS5hZGRDbGFzcygnbG9nby1jZW50ZXInKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNlY29uZGFyeSBOYXZiYXJcblx0XHRpZiAoIHNlY05hdkJhci5sZW5ndGggKSB7XG5cdFx0XHRzZWNOYXZCYXIucmVtb3ZlQ2xhc3MoJ2l0ZW1zLW92ZXJsYXAnKTtcblx0XHRcdHZhciBzZWNOYXZDb250V2lkdGggPSBzZWNOYXZDb250LndpZHRoKCksXG5cdFx0XHRcdHNlY05hdkl0ZW1zV2lkdGggPSAkKCcubGVmdC1jb250ZW50Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0LWNvbnRlbnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XG5cdFx0XHRcdHNlY05hdkJhci5hZGRDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cblx0Ly8gT25lLVBhZ2UgTmF2aWdhdGlvblxuXHRmdW5jdGlvbiBvbmVQYWdlTmF2KCkge1xuXHRcdHZhciBvZmZzZXQgPSAwLFxuXHRcdFx0c3B5RGF0YSA9IGJvZHlFbC5kYXRhKCdicy5zY3JvbGxzcHknKTtcblxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBtYWluTmF2QmFyLmRhdGEoJ2ZpeGVkJykgKSB7IG9mZnNldCArPSBtYWluTmF2QmFyLm91dGVySGVpZ2h0KCk7IH1cblx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gJiYgJCgnI3dwYWRtaW5iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJyApIHsgb2Zmc2V0ICs9ICQoJyN3cGFkbWluYmFyJykuaGVpZ2h0KCk7IH1cblxuXHRcdCQoJy5vbmUtcGFnZS1yb3cnKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByb3cgPSAkKHRoaXMpO1xuXG5cdFx0XHRpZiAoIHJvdy5pcygnOmZpcnN0LWNoaWxkJykgKSB7XG5cdFx0XHRcdHZhciBwYWdlQ29udGVudCA9ICQoJy5wYWdlLWNvbnRlbnQub25lLXBhZ2UnKTtcblx0XHRcdFx0cGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJywgJycpO1xuXHRcdFx0XHRyb3cuY3NzKCdwYWRkaW5nLXRvcCcsIHBhZ2VDb250ZW50LmNzcygnbWFyZ2luLXRvcCcpKTtcblx0XHRcdFx0cGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJywgMCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcHJldlJvdyA9IHJvdy5wcmV2KCk7XG5cdFx0XHRcdGlmICggISBwcmV2Um93Lmhhc0NsYXNzKCdyb3cnKSApIHByZXZSb3cgPSBwcmV2Um93LnByZXYoJy5yb3cnKTtcblxuXHRcdFx0XHRwcmV2Um93LmNzcygnbWFyZ2luLWJvdHRvbScsICcnKTtcblx0XHRcdFx0cm93LmNzcygncGFkZGluZy10b3AnLCBwcmV2Um93LmNzcygnbWFyZ2luLWJvdHRvbScpKTtcblx0XHRcdFx0cHJldlJvdy5jc3MoJ21hcmdpbi1ib3R0b20nLCAwKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICggc3B5RGF0YSApIHtcblx0XHRcdHNweURhdGEub3B0aW9ucy5vZmZzZXQgPSBvZmZzZXQ7XG5cdFx0XHRib2R5RWwuc2Nyb2xsc3B5KCdyZWZyZXNoJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJvZHlFbC5zY3JvbGxzcHkoe1xuXHRcdFx0XHR0YXJnZXQ6ICcjbWFpbi1uYXYnLFxuXHRcdFx0XHRvZmZzZXQ6IG9mZnNldFxuXHRcdFx0fSk7XG5cblx0XHRcdG1haW5OYXZCYXIub24oJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bWFpbk5hdklubmVyLmNvbGxhcHNlKCdoaWRlJyk7XG5cdFx0XHRcdH0sIDEwMCApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBGdW5jdGlvbnMgUnVuIE9uIExvYWQgJiBXaW5kb3cgUmVzaXplXG5cdGZ1bmN0aW9uIG5hdmJhckZuKCkge1xuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soKTtcblxuXHRcdC8vIFJ1biBmdW5jdGlvbiB0byBwcmV2ZW50IHN1Ym1lbnVzIGdvaW5nIG91dHNpZGUgdmlld3BvcnRcblx0XHRuYXZiYXJzLm5vdChtYWluTmF2QmFyKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdE5hdmJhci5tZW51Lm92ZXJmbG93KCQoJy5uYXZiYXItaW5uZXInLCB0aGlzKSk7XG5cdFx0fSk7XG5cblx0XHQvLyBSdW4gZnVuY3Rpb25zIGJhc2VkIG9uIGN1cnJlbnRseSBhY3RpdmUgbWVkaWEgcXVlcnlcblx0XHRpZiAoIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdE5hdmJhci5tZW51Lm92ZXJmbG93KG1haW5OYXZJbm5lcik7XG5cdFx0XHRtYWluV3JhcC5hZGRDbGFzcygnbmF2LWZ1bGwnKS5yZW1vdmVDbGFzcygnbmF2LW1pbmknKTtcblxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0TmF2YmFyLm1lbnUubWVnYU1lbnVUb2dnbGUoJ2VuYWJsZScsICQodGhpcykpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1lbnVQYXJlbnRzLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoSG92ZXIpO1xuXHRcdFx0Ym9keUVsLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoUmVtb3ZlSG92ZXIpO1xuXHRcdH0gZWxzZSBpZiAoIG1xTmF2ID09ICdtb2JpbGUnIHx8IG1xTmF2ID09ICd0YWJsZXQnICkge1xuXHRcdFx0TmF2YmFyLm1vYmlsZS50cmlnZ2VyKG1xTmF2KTtcblx0XHRcdG1haW5XcmFwLmFkZENsYXNzKCduYXYtbWluaScpLnJlbW92ZUNsYXNzKCduYXYtZnVsbCcpO1xuXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHROYXZiYXIubWVudS5tZWdhTWVudVRvZ2dsZSgnZGlzYWJsZScsICQodGhpcykpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1lbnVQYXJlbnRzLm9mZigndG91Y2hzdGFydCcsIG1lbnVUb3VjaEhvdmVyKTtcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7XG5cdFx0XHRpZiAoIG1xTmF2ID09ICdtb2JpbGUnICkge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIodHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICkge1xuXHRcdFx0aWYgKCBtcU5hdiA9PSAndGFibGV0JyApIHtcblx0XHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygnc3RpY2t5Jyk7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kudHJpZ2dlcihmYWxzZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS50cmlnZ2VyKHRydWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdwb3NpdGlvbi10b3AnKTtcblx0XHR9XG5cblx0XHQvLyBWZXJ0aWNhbCBuYXZiYXIgaGFuZGxpbmdcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICYmIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdC8vIE1ha2UgbmF2YmFyIHN0YXRpYyBpZiBpdGVtcyBkb24ndCBmaXQgaW4gdmlld3BvcnRcblx0XHRcdHZlcnRpY2FsTmF2Rml0VmlldygpO1xuXHRcdH1cblxuXHRcdG5hdmJhck92ZXJsYXAoKTtcblxuXHRcdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ29uZXBhZ2UnICkge1xuXHRcdFx0b25lUGFnZU5hdigpO1xuXHRcdH1cblx0fVxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgbmF2YmFyRm4gKSkucmVzaXplKCk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuUE9TVCBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGlmcmFtZUFzcGVjdCwgTW9kZXJuaXpyICovXG5cblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxuXHRcdGNvbnRlbnQgID0gJCgnI2NvbnRlbnQnKTtcblxuXHQvLyBSZXNpemUgRW1iZWRkZWQgVmlkZW9zIFByb3BvcnRpb25hbGx5XG5cdGlmcmFtZUFzcGVjdCggJCgnLnBvc3QgaWZyYW1lJykgKTtcblxuXHQvLyBQb3N0IExheW91dFxuXHRmdW5jdGlvbiBwb3N0c1BhZ2UoKSB7XG5cblx0XHRjb250ZW50LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIEFuaW1hdGUgUG9zdHNcblx0XHRcdHZhciBhbmltUG9zdERlbGF5ID0gKCB2aWV3cG9ydC5zY3JvbGxUb3AoKSA+IDYwMCApID8gMCA6IDIwMDtcblx0XHRcdCQoJy5wb3N0cy1jb250YWluZXIgLmFydGljbGUuYW5pbWF0ZWQnKS5lYWNoKCBmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0XHR2YXIgZWxlbSA9ICQodGhpcyk7XG5cdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ2luaXQnKTtcblx0XHRcdFx0fSwgaW5kZXgrKyAqIGFuaW1Qb3N0RGVsYXkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEZlYXR1cmVkIEdhbGxlcnkgU2xpZGVyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHR2YXIgZ2FsbGVyeVNsaWRlciA9ICQoJy5nYWxsZXJ5LXNsaWRlcicpLm5vdCgnLmxpZ2h0U2xpZGVyJyk7XG5cdFx0XHRcdGdhbGxlcnlTbGlkZXIubGlnaHRTbGlkZXIoe1xuXHRcdFx0XHRcdGl0ZW06IDEsXG5cdFx0XHRcdFx0YXV0bzogdHJ1ZSxcblx0XHRcdFx0XHRsb29wOiB0cnVlLFxuXHRcdFx0XHRcdHBhZ2VyOiBmYWxzZSxcblx0XHRcdFx0XHRwYXVzZTogNTAwMCxcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRHYWxsZXJ5ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHQkKCcubGlnaHRib3gtZ2FsbGVyeScpLmxpZ2h0R2FsbGVyeSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBFcXVhbGl6ZSBmZWF0dXJlZCBtZWRpYSBoZWlnaHQgZm9yIHJlbGF0ZWQgcG9zdHMgYW5kIGdyaWQgYmxvZ1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0JC5mbi5tYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdFx0JCgnLmJsb2ctZ3JpZCAucG9zdHMtY29udGFpbmVyIC5wb3N0LWZlYXQnKS5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XG5cblx0XHRcdFx0aWYgKCAhIE1vZGVybml6ci5mbGV4Ym94ICkge1xuXHRcdFx0XHRcdCQoJy5ibG9nLWdyaWQgLnBvc3RzLWNvbnRhaW5lciBhcnRpY2xlJykuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xuXG5cdFx0XHRcdFx0dmFyIG1hdGNoSGVpZ2h0RWwgPSAkKCcucG9zdC1yZWxhdGVkIC5wb3N0LWZlYXQnKSxcblx0XHRcdFx0XHRcdG1hdGNoSGVpZ2h0VGFyZ2V0ID0gbWF0Y2hIZWlnaHRFbC5maW5kKCcud3AtcG9zdC1pbWFnZScpO1xuXHRcdFx0XHRcdGlmICggbWF0Y2hIZWlnaHRUYXJnZXQubGVuZ3RoID09PSAwICkgbWF0Y2hIZWlnaHRUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHRcdG1hdGNoSGVpZ2h0RWwuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCh7XG5cdFx0XHRcdFx0XHR0YXJnZXQ6IG1hdGNoSGVpZ2h0VGFyZ2V0LFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXG5cblx0Ly8gTG9hZCBQb3N0cyAmIENvbW1lbnRzIHZpYSBBamF4XG5cdGZ1bmN0aW9uIG1peHRBamF4TG9hZCh0eXBlKSB7XG5cdFx0dHlwZSA9IHR5cGUgfHwgJ3Bvc3RzJztcblx0XHR2YXIgcGFnQ29udCA9ICQoJy5wYWdpbmctbmF2aWdhdGlvbicpLFxuXHRcdFx0YWpheEJ0biA9ICQoJy5hamF4LW1vcmUnLCBwYWdDb250KTtcblxuXHRcdGlmICggISBwYWdDb250Lmxlbmd0aCB8fCAhIGFqYXhCdG4ubGVuZ3RoICkgcmV0dXJuO1xuXHRcdFxuXHRcdHZhciBwYWdlTm93ID0gcGFnQ29udC5kYXRhKCdwYWdlLW5vdycpLFxuXHRcdFx0cGFnZU1heCA9IHBhZ0NvbnQuZGF0YSgncGFnZS1tYXgnKSxcblx0XHRcdG5leHRVcmwgPSBhamF4QnRuLmF0dHIoJ2hyZWYnKSxcblx0XHRcdHBhZ2VOdW0sXG5cdFx0XHRwYWdlVHlwZSxcblx0XHRcdGNvbnRhaW5lcixcblx0XHRcdGVsZW1lbnQsXG5cdFx0XHRsb2FkU2VsO1xuXG5cdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgnLnBvc3RzLWNvbnRhaW5lcicpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5hcnRpY2xlJztcblx0XHRcdGxvYWRTZWwgICA9ICcgLnBvc3RzLWNvbnRhaW5lciAuYXJ0aWNsZSc7XG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnc2hvcCcgKSB7XG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgndWwucHJvZHVjdHMnKTtcblx0XHRcdGVsZW1lbnQgICA9ICcucHJvZHVjdCc7XG5cdFx0XHRsb2FkU2VsICAgPSAnIHVsLnByb2R1Y3RzID4gbGknO1xuXHRcdH0gZWxzZSBpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXTtcblx0XHRcdGNvbnRhaW5lciA9ICQoJy5jb21tZW50LWxpc3QnKTtcblx0XHRcdGVsZW1lbnQgICA9ICcuY29tbWVudCc7XG5cdFx0XHRsb2FkU2VsICAgPSAnIC5jb21tZW50LWxpc3QgPiBsaSc7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddID09ICduZXdlc3QnICkge1xuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgLSAxO1xuXHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgKyAxO1xuXHRcdH1cblxuXHRcdGlmICggKCBwYWdlTm93ID49IHBhZ2VNYXggKSAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gIT0gJ25ld2VzdCcgfHwgcGFnZU51bSA8PSAwICkge1xuXHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XG5cdFx0fVxuXHRcdFxuXHRcdGFqYXhCdG4ub24oJ2NsaWNrIGNvbnQ6Ym90dG9tJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBQcmV2ZW50IGxvYWRpbmcgdHdpY2Ugb24gc2Nyb2xsXG5cdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xuXHRcdFxuXHRcdFx0Ly8gQXJlIHRoZXJlIG1vcmUgcGFnZXMgdG8gbG9hZD9cblx0XHRcdGlmICggcGFnZU51bSA+IDAgJiYgcGFnZU51bSA8PSBwYWdlTWF4ICkge1xuXHRcdFx0XG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdsb2FkaW5nJyk7XG5cblx0XHRcdFx0Ly8gTG9hZCBwb3N0c1xuXHRcdFx0XHQvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xuXHRcdFx0XHQkKCc8ZGl2PicpLmxvYWQobmV4dFVybCArIGxvYWRTZWwsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhocikge1xuXHRcdFx0XHRcdHZhciBuZXdQb3N0cyA9ICQodGhpcyk7XG5cblx0XHRcdFx0XHRhamF4QnRuLmJsdXIoKTtcblxuXHRcdFx0XHRcdG5ld1Bvc3RzLmNoaWxkcmVuKGVsZW1lbnQpLmFkZENsYXNzKCdhamF4LW5ldycpO1xuXHRcdFx0XHRcdGlmICggKCB0eXBlID09ICdwb3N0cycgfHwgdHlwZSA9PSAnc2hvcCcgKSAmJiBtaXh0X29wdC5sYXlvdXQudHlwZSAhPSAnbWFzb25yeScgJiYgbWl4dF9vcHQubGF5b3V0WydzaG93LXBhZ2UtbnInXSApIHtcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJhamF4LXBhZ2UgcGFnZS0nKyBwYWdlTnVtICsnXCI+PGEgaHJlZj1cIicrIG5leHRVcmwgKydcIj5QYWdlICcrIHBhZ2VOdW0gKyc8L2E+PC9kaXY+Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmQobmV3UG9zdHMuaHRtbCgpKTtcblxuXHRcdFx0XHRcdG5ld1Bvc3RzID0gY29udGFpbmVyLmNoaWxkcmVuKCcuYWpheC1uZXcnKTtcblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSBwYWdlIG51bWJlciBhbmQgbmV4dFVybFxuXHRcdFx0XHRcdGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0tLTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL2NvbW1lbnQtcGFnZS1bMC05XT8vLCAnL2NvbW1lbnQtcGFnZS0nICsgcGFnZU51bSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL3BhZ2VcXC9bMC05XT8vLCAnL3BhZ2UvJyArIHBhZ2VOdW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGJ1dHRvbiBzdGF0ZVxuXHRcdFx0XHRcdGlmICggcGFnZU51bSA8PSBwYWdlTWF4ICYmIHBhZ2VOdW0gPiAwICkgeyBhamF4QnRuLmJ1dHRvbigncmVzZXQnKTsgfVxuXHRcdFx0XHRcdGVsc2UgeyBhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTsgfVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIGxheW91dCBvbmNlIHBvc3RzIGhhdmUgbG9hZGVkXG5cdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRuZXdQb3N0cy5yZW1vdmVDbGFzcygnYWpheC1uZXcgaW5pdCcpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XG5cdFx0XHRcdFx0XHRcdGlmcmFtZUFzcGVjdCgpO1xuXHRcdFx0XHRcdFx0XHRwb3N0c1BhZ2UoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcblx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmlzb3RvcGUoJ2FwcGVuZGVkJywgbmV3UG9zdHMpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZpZXdwb3J0LnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAxMDApO1xuXG5cdFx0XHRcdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7IH1cblxuXHRcdFx0XHRcdC8vIEhhbmRsZSBFcnJvcnNcblx0XHRcdFx0XHRpZiAoIHN0YXR1cyA9PSAnZXJyb3InICkge1xuXHRcdFx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2Vycm9yJyk7XG5cdFx0XHRcdFx0XHQvLyBEZWJ1Z2dpbmcgaW5mb1xuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoJ0FKQVggRXJyb3I6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblxuXHRcdC8vIFRyaWdnZXIgQUpBWCBsb2FkIHdoZW4gcmVhY2hpbmcgYm90dG9tIG9mIHBhZ2Vcblx0XHR2YXIgYWpheFNjcm9sbEhhbmRsZSA9ICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8qIGdsb2JhbCBlbGVtVmlzaWJsZSAqL1xuXHRcdFx0XHRpZiAoIGVsZW1WaXNpYmxlKGFqYXhCdG4sIHZpZXdwb3J0KSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRhamF4QnRuLnRyaWdnZXIoJ2NvbnQ6Ym90dG9tJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcblx0XHR9XG5cdH1cblx0Ly8gRXhlY3V0ZSBGdW5jdGlvbiBXaGVyZSBBcHBsaWNhYmxlXG5cdGlmICggbWl4dF9vcHQucGFnZVsncG9zdHMtcGFnZSddICYmIG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtY2xpY2snIHx8IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaG9wJyApIHtcblx0XHRcdG1peHRBamF4TG9hZCgnc2hvcCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtaXh0QWpheExvYWQoJ3Bvc3RzJyk7XG5cdFx0fVxuXHR9XG5cdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ3NpbmdsZScgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRtaXh0QWpheExvYWQoJ2NvbW1lbnRzJyk7XG5cdH1cblxuXG5cdC8vIEZ1bmN0aW9ucyBUbyBSdW4gT24gV2luZG93IFJlc2l6ZVxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcblx0XHRpZnJhbWVBc3BlY3QoKTtcblx0fVxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgcmVzaXplRm4gKSk7XG5cblxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIExvYWRcblx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XG5cblx0XHRwb3N0c1BhZ2UoKTtcblxuXHRcdC8vIElzb3RvcGUgTWFzb25yeSBJbml0XG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdHZhciBibG9nQ29udCA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xuXG5cdFx0XHRibG9nQ29udC5pc290b3BlKHtcblx0XHRcdFx0aXRlbVNlbGVjdG9yOiAnLmFydGljbGUnLFxuXHRcdFx0XHRsYXlvdXQ6ICdtYXNvbnJ5Jyxcblx0XHRcdFx0Z3V0dGVyOiAwXG5cdFx0XHR9KTtcblxuXHRcdFx0YmxvZ0NvbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0pO1xuXHRcdFx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSApKTtcblx0XHR9XG5cblxuXHRcdC8vIFRyaWdnZXIgTGlnaHRib3ggT24gRmVhdHVyZWQgSW1hZ2UgQ2xpY2tcblx0XHQkKCcubGlnaHRib3gtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnLmdhbGxlcnknKS5maW5kKCdsaScpLmZpcnN0KCkuY2xpY2soKTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gUmVsYXRlZCBQb3N0cyBTbGlkZXJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0dmFyIHJlbFBvc3RzU2xpZGVyID0gJCgnLnBvc3QtcmVsYXRlZCAuc2xpZGVyLWNvbnQnKSxcblx0XHRcdFx0dHlwZSA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ3R5cGUnKSxcblx0XHRcdFx0Y29scyA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ2NvbHMnKSxcblx0XHRcdFx0dGFibGV0Q29scyA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ3RhYmxldC1jb2xzJyksXG5cdFx0XHRcdG1vYmlsZUNvbHMgPSByZWxQb3N0c1NsaWRlci5kYXRhKCdtb2JpbGUtY29scycpO1xuXHRcdFx0cmVsUG9zdHNTbGlkZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVsUG9zdHNTbGlkZXIubGlnaHRTbGlkZXIoe1xuXHRcdFx0XHRcdGl0ZW06IGNvbHMsXG5cdFx0XHRcdFx0Y29udHJvbHM6ICh0eXBlID09ICdtZWRpYScpLFxuXHRcdFx0XHRcdHBhZ2VyOiAodHlwZSA9PSAndGV4dCcpLFxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAyMCxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbe1xuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogMTIwMCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IHRhYmxldENvbHMgfVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDU4MCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IG1vYmlsZUNvbHMgfVxuXHRcdFx0XHRcdH1dLFxuXHRcdFx0XHRcdG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZWxQb3N0c1NsaWRlci5yZW1vdmVDbGFzcygnaW5pdCcpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdFx0JCgnLnBvc3QtZmVhdCcsIHJlbFBvc3RzU2xpZGVyKS5tYXRjaEhlaWdodCgpO1xuXHRcdFx0XHRcdFx0XHRyZWxQb3N0c1NsaWRlci5jc3MoJ2hlaWdodCcsICcnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5VSSBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXG5cdFx0aHRtbEVsICAgPSAkKCdodG1sJyksXG5cdFx0Ym9keUVsICAgPSAkKCdib2R5Jyk7XG5cblxuXHQvLyBTcGlubmVyIElucHV0XG5cdCQoJy5taXh0LXNwaW5uZXInKS5vbignY2xpY2snLCAnLmJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkZWwgICAgID0gJCh0aGlzKSxcblx0XHRcdHNwaW5uZXIgPSAkZWwucGFyZW50cygnLm1peHQtc3Bpbm5lcicpLFxuXHRcdFx0aW5wdXQgICA9IHNwaW5uZXIuY2hpbGRyZW4oJy5zcGlubmVyLXZhbCcpLFxuXHRcdFx0c3RlcCAgICA9IGlucHV0LmF0dHIoJ3N0ZXAnKSB8fCAxLFxuXHRcdFx0bWluVmFsICA9IGlucHV0LmF0dHIoJ21pbicpIHx8IDAsXG5cdFx0XHRtYXhWYWwgID0gaW5wdXQuYXR0cignbWF4JykgfHwgbnVsbCxcblx0XHRcdHZhbCAgICAgPSBpbnB1dC52YWwoKSxcblx0XHRcdG5ld1ZhbDtcblx0XHRpZiAoIGlzTmFOKHZhbCkgKSB2YWwgPSBtaW5WYWw7XG5cdFx0XG5cdFx0aWYgKCAkZWwuaGFzQ2xhc3MoJ21pbnVzJykgKSB7XG5cdFx0XHQvLyBEZWNyZWFzZVxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpIC0gcGFyc2VGbG9hdChzdGVwKTtcblx0XHRcdGlmICggbmV3VmFsIDwgbWluVmFsICkgbmV3VmFsID0gbWluVmFsO1xuXHRcdFx0aW5wdXQudmFsKG5ld1ZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEluY3JlYXNlXG5cdFx0XHRuZXdWYWwgPSBwYXJzZUZsb2F0KHZhbCkgKyBwYXJzZUZsb2F0KHN0ZXApO1xuXHRcdFx0aWYgKCBtYXhWYWwgIT09IG51bGwgJiYgbmV3VmFsID4gbWF4VmFsICkgbmV3VmFsID0gbWF4VmFsO1xuXHRcdFx0aW5wdXQudmFsKG5ld1ZhbCk7XG5cdFx0fVxuXHR9KTtcblxuXG5cdC8vIENvbnRlbnQgRmlsdGVyaW5nXG5cdCQoJy5jb250ZW50LWZpbHRlci1saW5rcycpLmNoaWxkcmVuKCkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcblx0XHRcdGZpbHRlciA9IGxpbmsuZGF0YSgnZmlsdGVyJyksXG5cdFx0XHRjb250ZW50ID0gJCgnLicgKyBsaW5rLnBhcmVudHMoJy5jb250ZW50LWZpbHRlci1saW5rcycpLmRhdGEoJ2NvbnRlbnQnKSksXG5cdFx0XHRmaWx0ZXJDbGFzcyA9ICdmaWx0ZXItaGlkZGVuJztcblx0XHRsaW5rLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRpZiAoIGZpbHRlciA9PSAnYWxsJyApIHsgY29udGVudC5maW5kKCcuJytmaWx0ZXJDbGFzcykucmVtb3ZlQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlRG93big2MDApOyB9XG5cdFx0ZWxzZSB7IGNvbnRlbnQuZmluZCgnLicgKyBmaWx0ZXIpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKS5zaWJsaW5ncygnOm5vdCguJytmaWx0ZXIrJyknKS5hZGRDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVVcCg2MDApOyB9XG5cdH0pO1xuXG5cblx0Ly8gU29ydCBwb3J0Zm9saW8gaXRlbXNcblx0JCgnLnBvcnRmb2xpby1zb3J0ZXIgYScpLmNsaWNrKCBmdW5jdGlvbihldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGVsZW0gPSAkKHRoaXMpLFxuXHRcdFx0dGFyZ2V0VGFnID0gZWxlbS5kYXRhKCdzb3J0JyksXG5cdFx0XHR0YXJnZXRDb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XG5cblx0XHRlbGVtLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuXHRcdC8vIFJlbW92ZSBhbmltYXRlZCBjbGFzcyB0byBwcmV2ZW50IHRyYW5zaXRpb24gZ2xpdGNoZXNcblx0XHR0YXJnZXRDb250YWluZXIuZmluZCgnLmFydGljbGUuYW5pbWF0ZWQnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcblxuXHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICYmIHR5cGVvZiAkLmZuLmlzb3RvcGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRpZiAodGFyZ2V0VGFnID09ICdhbGwnKSB7XG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnKicgfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0YXJnZXRDb250YWluZXIuaXNvdG9wZSh7IGZpbHRlcjogJy4nICsgdGFyZ2V0VGFnIH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcHJvamVjdHMgPSB0YXJnZXRDb250YWluZXIuY2hpbGRyZW4oJy5wb3J0Zm9saW8nKTtcblx0XHRcdGlmICggdGFyZ2V0VGFnID09ICdhbGwnICkge1xuXHRcdFx0XHRwcm9qZWN0cy5mYWRlSW4oMzAwKS5hZGRDbGFzcygnZmlsdGVyZWQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByb2plY3RzLmZhZGVPdXQoMCkucmVtb3ZlQ2xhc3MoJ2ZpbHRlcmVkJykuZmlsdGVyKCcuJyArIHRhcmdldFRhZykuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2ZpbHRlcmVkJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXG5cdC8vIE9mZnNldCBzY3JvbGxpbmcgdG8gbGluayBhbmNob3IgKGhhc2gpXG5cdCQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcblx0XHRcdGhhc2ggPSBsaW5rLmF0dHIoJ2hyZWYnKTtcblxuXHRcdGlmICggbGluay5kYXRhKCduby1oYXNoLXNjcm9sbCcpIHx8ICQoZS50YXJnZXQpLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJykgfHwgaGFzaCA9PSAnIycgKSByZXR1cm4gdHJ1ZTtcblxuXHRcdGlmICggaGFzaC5sZW5ndGggKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gJChoYXNoKTtcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgaGFzaE9mZnNldCA9ICQoaGFzaCkub2Zmc2V0KCkudG9wICsgMTtcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmICQoJyNtYWluLW5hdicpLmRhdGEoJ2ZpeGVkJykgKSB7IGhhc2hPZmZzZXQgLT0gJCgnI21haW4tbmF2Jykub3V0ZXJIZWlnaHQoKTsgfVxuXHRcdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gJiYgJCgnI3dwYWRtaW5iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJyApIHsgaGFzaE9mZnNldCAtPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpOyB9XG5cdFx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBoYXNoT2Zmc2V0IH0sIDYwMCApO1xuXHRcdFx0fVxuXHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sICcnLCBoYXNoKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHQvLyBJZ25vcmUgc3BlY2lmaWMgYW5jaG9yc1xuXHQkKCcudGFicyBhLCAudmNfdHRhIGEsIC51aS1hY2NvcmRpb24gYScpLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJywgdHJ1ZSk7XG5cblxuXHQvLyBTb2NpYWwgSWNvbnNcblx0JCgnLnNvY2lhbC1saW5rcycpLm5vdCgnLmhvdmVyLW5vbmUnKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udCA9ICQodGhpcyk7XG5cblx0XHRjb250LmNoaWxkcmVuKCkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaWNvbiA9ICQodGhpcyksXG5cdFx0XHRcdGxpbmsgPSBpY29uLmNoaWxkcmVuKCdhJyksXG5cdFx0XHRcdGRhdGFDb2xvciA9IGxpbmsuYXR0cignZGF0YS1jb2xvcicpO1xuXG5cdFx0XHRpZiAoIGNvbnQuaGFzQ2xhc3MoJ2hvdmVyLWJnJykgfHwgY29udC5wYXJlbnRzKCcubm8taG92ZXItYmcnKS5sZW5ndGggKSB7XG5cdFx0XHRcdGxpbmsuaG92ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiAnJywgekluZGV4OiAnJyB9KTsgfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsaW5rLmhvdmVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRsaW5rLmNzcyh7IGNvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgY29sb3I6ICcnLCB6SW5kZXg6ICcnIH0pOyB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblxuXHQvLyBPbiBIb3ZlciBBbmltYXRpb25zXG5cdGZ1bmN0aW9uIGFuaW1hdGVIb3ZlckluKGVsZW0pIHtcblx0XHRlbGVtLmFkZENsYXNzKCdob3ZlcmVkJyk7XG5cdFx0dmFyIGlubmVyICAgPSBlbGVtLmNoaWxkcmVuKCcub24taG92ZXInKSxcblx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXG5cdFx0XHRhbmltT3V0ID0gaW5uZXIuZGF0YSgnYW5pbS1vdXQnKSB8fCAnZmFkZU91dCc7XG5cdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbU91dCkuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltSW4pO1xuXHR9XG5cblx0ZnVuY3Rpb24gYW5pbWF0ZUhvdmVyT3V0KGVsZW0pIHtcblx0XHRlbGVtLnJlbW92ZUNsYXNzKCdob3ZlcmVkJyk7XG5cdFx0dmFyIGlubmVyICAgPSBlbGVtLmNoaWxkcmVuKCcub24taG92ZXInKSxcblx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXG5cdFx0XHRhbmltT3V0ID0gaW5uZXIuZGF0YSgnYW5pbS1vdXQnKSB8fCAnZmFkZU91dCc7XG5cdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbUluKS5hZGRDbGFzcyhhbmltT3V0KTtcblx0fVxuXG5cblx0Ly8gUG9zdCBHcmlkIFJlc3BvbnNpdmUgQ29sdW1uc1xuXHRmdW5jdGlvbiBwb3N0R3JpZENvbHVtbnMoKSB7XG5cdFx0JCgnLnZjX2dyaWQtY29udGFpbmVyLnJlc3BvbnNpdmUtY29scycpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW0gPSAkKHRoaXMpLFxuXHRcdFx0XHRjbGFzc2VzID0gZWxlbVswXS5jbGFzc05hbWUubWF0Y2goL3Jlc3AtKFxcd3syfS1cXGR7MSwyfSkvZyk7XG5cdFx0XHRpZiAoIGNsYXNzZXMgIT09IG51bGwgKSB7XG5cdFx0XHRcdHZhciBjaGlsZHJlbiA9IGVsZW0uZmluZCgnLnZjX2dyaWQtaXRlbScpO1xuXHRcdFx0XHQkKGNsYXNzZXMpLmVhY2goIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcblx0XHRcdFx0XHRjaGlsZHJlbi5hZGRDbGFzcyh2YWwucmVwbGFjZSgncmVzcC0nLCAnY29sLScpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8vIEZ1bmN0aW9ucyBydW4gb24gcGFnZSBsb2FkIGFuZCBcInJlZnJlc2hcIiBldmVudFxuXHRmdW5jdGlvbiBydW5PblJlZnJlc2goKSB7XG5cdFx0Ly8gVG9vbHRpcHMgSW5pdFxuXHRcdCQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0sIC5yZWxhdGVkLXRpdGxlLXRpcCcpLnRvb2x0aXAoe1xuXHRcdFx0cGxhY2VtZW50OiAnYXV0bycsXG5cdFx0XHRjb250YWluZXI6ICdib2R5J1xuXHRcdH0pO1xuXG5cdFx0Ly8gT24gSG92ZXIgQW5pbWF0aW9ucyBJbml0XG5cdFx0dmFyIGFuaW1Ib3ZlckVsID0gJCgnLmFuaW0tb24taG92ZXInKTtcblx0XHQvLyBPbiBob3ZlckludGVudFxuXHRcdGFuaW1Ib3ZlckVsLmhvdmVySW50ZW50KCBmdW5jdGlvbigpIHtcblx0XHRcdGFuaW1hdGVIb3ZlckluKCQodGhpcykpO1xuXHRcdH0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0YW5pbWF0ZUhvdmVyT3V0KCQodGhpcykpO1xuXHRcdH0sIDUwKTtcblx0XHQvLyBIYW5kbGUgTW9iaWxlIFRhcFxuXHRcdGFuaW1Ib3ZlckVsLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2hvdmVyZWQnKSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRhbmltYXRlSG92ZXJJbigkdGhpcyk7XG5cdFx0XHRcdGFuaW1Ib3ZlckVsLm5vdCgkdGhpcykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YW5pbWF0ZUhvdmVyT3V0KCQodGhpcykpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdC8vIENsZWFyIGFuaW1hdGlvblxuXHRcdGFuaW1Ib3ZlckVsLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgTVNBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtID0gJCh0aGlzKTtcblx0XHRcdGlmICggISBlbGVtLmhhc0NsYXNzKCdob3ZlcmVkJykgKSB7XG5cdFx0XHRcdGVsZW0uY2hpbGRyZW4oJy5vbi1ob3ZlcicpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHZpZXdwb3J0Lm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XG5cdFx0cnVuT25SZWZyZXNoKCk7XG5cdH0pLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblxuXHQkKGRvY3VtZW50KS5hamF4Q29tcGxldGUoIGZ1bmN0aW9uKCkge1xuXHRcdHJ1bk9uUmVmcmVzaCgpO1xuXG5cdFx0cG9zdEdyaWRDb2x1bW5zKCk7XG5cdH0pO1xuXG5cblx0Ly8gQmFjayBUbyBUb3AgQnV0dG9uXG5cdHZhciBiYWNrVG9Ub3AgPSAkKCcjYmFjay10by10b3AnKTtcblxuXHRmdW5jdGlvbiBiYWNrVG9Ub3BEaXNwbGF5KCkge1xuXHRcdHZhciBzY3JvbGxUb3AgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblx0XHRpZiAoIHNjcm9sbFRvcCA+IDYwMCApIHtcblx0XHRcdGJhY2tUb1RvcC5mYWRlSW4oMzAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YmFja1RvVG9wLmZhZGVPdXQoMzAwKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIGJhY2tUb1RvcC5sZW5ndGggKSB7XG5cdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsICQudGhyb3R0bGUoIDEwMDAsIGJhY2tUb1RvcERpc3BsYXkgKSkuc2Nyb2xsKCk7XG5cblx0XHRiYWNrVG9Ub3AuY2xpY2soIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDYwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRcblx0Ly8gSW5mbyBCYXJcblx0dmFyIGluZm9CYXJXcmFwID0gJCgnI2luZm8tYmFyLXdyYXAnKSxcblx0XHRpbmZvQmFyID0gaW5mb0JhcldyYXAuY2hpbGRyZW4oJy5pbmZvLWJhcicpO1xuXG5cdGZ1bmN0aW9uIGluZm9CYXJTdGlja3koKSB7XG5cdFx0dmFyIGJhckhlaWdodCA9IGluZm9CYXIub3V0ZXJIZWlnaHQoKTtcblx0XHRpbmZvQmFyV3JhcC5jc3MoJ21pbi1oZWlnaHQnLCBiYXJIZWlnaHQpO1xuXHRcdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHsgYmFja1RvVG9wLmNzcygnbWFyZ2luLWJvdHRvbScsIGJhckhlaWdodCk7IH1cblx0fVxuXG5cdGlmICggaW5mb0Jhci5sZW5ndGggKSB7XG5cdFx0aW5mb0Jhci5maW5kKCcuaW5mby1jbG9zZScpLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdGluZm9CYXJXcmFwLmZhZGVPdXQoMzAwKTtcblx0XHRcdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHsgYmFja1RvVG9wLmNzcygnbWFyZ2luLWJvdHRvbScsICcnKTsgfVxuXHRcdH0pO1xuXHRcdGlmICggaW5mb0Jhci5oYXNDbGFzcygnc3RpY2t5JykgKSB7IGluZm9CYXJTdGlja3koKTsgfVxuXHR9XG5cbn0pKGpRdWVyeSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

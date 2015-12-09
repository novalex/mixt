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
			var from  = el.data('from'),
				to    = el.data('to'),
				speed = el.data('speed');
			$({value: from}).animate({value: to}, {
				duration: speed,
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
		} else if ( mixt_opt.header.height.height != '' && mixt_opt.header.height.units == '%' ) {
			var height = mixt_opt.header.height.height / 100 * viewHeight;

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
			var bgColor  = navbar.css('background-color'),
				dataCont = navbar.find('.navbar-data'),
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
			navbar.removeClass('init');
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
		mainNavBar.removeClass('bg-light bg-dark').addClass('init');
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
						newPosts.removeClass('ajax-new');
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
					link.css({ backgroundColor: dataColor, borderColor: dataColor, zIndex: 1 });
				}, function() { link.css({ backgroundColor: '', borderColor: '', zIndex: '' }); });
			} else {
				link.hover( function() {
					link.css({ color: dataColor, zIndex: 1 });
				}, function() { link.css({ color: '', zIndex: '' }); });
			}
		});
	});


	// Functions run on page load and "refresh" event
	function runOnRefresh() {
		// Tooltips Init
		$('[data-toggle="tooltip"], .related-title-tip').tooltip({
			placement: 'auto',
			container: 'body'
		});


		// On Hover Animations Init
		var animHoverEl = $('.anim-on-hover');
		animHoverEl.hoverIntent( function() {
			$(this).addClass('hovered');
			var inner   = $(this).children('.on-hover'),
				animIn  = inner.data('anim-in') || 'fadeIn',
				animOut = inner.data('anim-out') || 'fadeOut';
			inner.removeClass(animOut).addClass('animated ' + animIn);
		}, function() {
			$(this).removeClass('hovered');
			var inner   = $(this).children('.on-hover'),
				animIn  = inner.data('anim-in') || 'fadeIn',
				animOut = inner.data('anim-out') || 'fadeOut';
			inner.removeClass(animIn).addClass(animOut);
		}, 300);
		animHoverEl.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
			if ( ! $(this).hasClass('hovered') ) {
				$(this).children('.on-hover').removeClass('animated');
			}
		});
	}
	viewport.on('refresh', function() {
		runOnRefresh();
	}).trigger('refresh');


	// Back To Top Button
	var backToTop = $('#back-to-top');

	function backToTopDisplay() {
		var scrollTop = viewport.scrollTop();
		if ( scrollTop > 200 ) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiZmVhdGhlcmxpZ2h0LmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJqcXVlcnkucGxhY2Vob2xkZXIuanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ppQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2UgLSB2MS4xIC0gMy83LzIwMTBcbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbiAqIFxuICogQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbiAqL1xuXG4vLyBTY3JpcHQ6IGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlOiBTb21ldGltZXMsIGxlc3MgaXMgbW9yZSFcbi8vXG4vLyAqVmVyc2lvbjogMS4xLCBMYXN0IHVwZGF0ZWQ6IDMvNy8yMDEwKlxuLy8gXG4vLyBQcm9qZWN0IEhvbWUgLSBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS1wbHVnaW4vXG4vLyBHaXRIdWIgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL1xuLy8gU291cmNlICAgICAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9yYXcvbWFzdGVyL2pxdWVyeS5iYS10aHJvdHRsZS1kZWJvdW5jZS5qc1xuLy8gKE1pbmlmaWVkKSAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9yYXcvbWFzdGVyL2pxdWVyeS5iYS10aHJvdHRsZS1kZWJvdW5jZS5taW4uanMgKDAuN2tiKVxuLy8gXG4vLyBBYm91dDogTGljZW5zZVxuLy8gXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW4sXG4vLyBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbi8vIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbi8vIFxuLy8gQWJvdXQ6IEV4YW1wbGVzXG4vLyBcbi8vIFRoZXNlIHdvcmtpbmcgZXhhbXBsZXMsIGNvbXBsZXRlIHdpdGggZnVsbHkgY29tbWVudGVkIGNvZGUsIGlsbHVzdHJhdGUgYSBmZXdcbi8vIHdheXMgaW4gd2hpY2ggdGhpcyBwbHVnaW4gY2FuIGJlIHVzZWQuXG4vLyBcbi8vIFRocm90dGxlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy90aHJvdHRsZS9cbi8vIERlYm91bmNlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy9kZWJvdW5jZS9cbi8vIFxuLy8gQWJvdXQ6IFN1cHBvcnQgYW5kIFRlc3Rpbmdcbi8vIFxuLy8gSW5mb3JtYXRpb24gYWJvdXQgd2hhdCB2ZXJzaW9uIG9yIHZlcnNpb25zIG9mIGpRdWVyeSB0aGlzIHBsdWdpbiBoYXMgYmVlblxuLy8gdGVzdGVkIHdpdGgsIHdoYXQgYnJvd3NlcnMgaXQgaGFzIGJlZW4gdGVzdGVkIGluLCBhbmQgd2hlcmUgdGhlIHVuaXQgdGVzdHNcbi8vIHJlc2lkZSAoc28geW91IGNhbiB0ZXN0IGl0IHlvdXJzZWxmKS5cbi8vIFxuLy8galF1ZXJ5IFZlcnNpb25zIC0gbm9uZSwgMS4zLjIsIDEuNC4yXG4vLyBCcm93c2VycyBUZXN0ZWQgLSBJbnRlcm5ldCBFeHBsb3JlciA2LTgsIEZpcmVmb3ggMi0zLjYsIFNhZmFyaSAzLTQsIENocm9tZSA0LTUsIE9wZXJhIDkuNi0xMC4xLlxuLy8gVW5pdCBUZXN0cyAgICAgIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS91bml0L1xuLy8gXG4vLyBBYm91dDogUmVsZWFzZSBIaXN0b3J5XG4vLyBcbi8vIDEuMSAtICgzLzcvMjAxMCkgRml4ZWQgYSBidWcgaW4gPGpRdWVyeS50aHJvdHRsZT4gd2hlcmUgdHJhaWxpbmcgY2FsbGJhY2tzXG4vLyAgICAgICBleGVjdXRlZCBsYXRlciB0aGFuIHRoZXkgc2hvdWxkLiBSZXdvcmtlZCBhIGZhaXIgYW1vdW50IG9mIGludGVybmFsXG4vLyAgICAgICBsb2dpYyBhcyB3ZWxsLlxuLy8gMS4wIC0gKDMvNi8yMDEwKSBJbml0aWFsIHJlbGVhc2UgYXMgYSBzdGFuZC1hbG9uZSBwcm9qZWN0LiBNaWdyYXRlZCBvdmVyXG4vLyAgICAgICBmcm9tIGpxdWVyeS1taXNjIHJlcG8gdjAuNCB0byBqcXVlcnktdGhyb3R0bGUgcmVwbyB2MS4wLCBhZGRlZCB0aGVcbi8vICAgICAgIG5vX3RyYWlsaW5nIHRocm90dGxlIHBhcmFtZXRlciBhbmQgZGVib3VuY2UgZnVuY3Rpb25hbGl0eS5cbi8vIFxuLy8gVG9waWM6IE5vdGUgZm9yIG5vbi1qUXVlcnkgdXNlcnNcbi8vIFxuLy8galF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgYmVjYXVzZSBub3RoaW5nIGludGVybmFsXG4vLyB1c2VzIGFueSBqUXVlcnkgbWV0aG9kcyBvciBwcm9wZXJ0aWVzLiBqUXVlcnkgaXMganVzdCB1c2VkIGFzIGEgbmFtZXNwYWNlXG4vLyB1bmRlciB3aGljaCB0aGVzZSBtZXRob2RzIGNhbiBleGlzdC5cbi8vIFxuLy8gU2luY2UgalF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgaWYgalF1ZXJ5IGRvZXNuJ3QgZXhpc3Rcbi8vIHdoZW4gdGhpcyBwbHVnaW4gaXMgbG9hZGVkLCB0aGUgbWV0aG9kIGRlc2NyaWJlZCBiZWxvdyB3aWxsIGJlIGNyZWF0ZWQgaW5cbi8vIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UuIFVzYWdlIHdpbGwgYmUgZXhhY3RseSB0aGUgc2FtZSwgYnV0IGluc3RlYWQgb2Zcbi8vICQubWV0aG9kKCkgb3IgalF1ZXJ5Lm1ldGhvZCgpLCB5b3UnbGwgbmVlZCB0byB1c2UgQ293Ym95Lm1ldGhvZCgpLlxuXG4oZnVuY3Rpb24od2luZG93LHVuZGVmaW5lZCl7XG4gICckOm5vbXVuZ2UnOyAvLyBVc2VkIGJ5IFlVSSBjb21wcmVzc29yLlxuICBcbiAgLy8gU2luY2UgalF1ZXJ5IHJlYWxseSBpc24ndCByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIHVzZSBgalF1ZXJ5YCBhcyB0aGVcbiAgLy8gbmFtZXNwYWNlIG9ubHkgaWYgaXQgYWxyZWFkeSBleGlzdHMsIG90aGVyd2lzZSB1c2UgdGhlIGBDb3dib3lgIG5hbWVzcGFjZSxcbiAgLy8gY3JlYXRpbmcgaXQgaWYgbmVjZXNzYXJ5LlxuICB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LkNvd2JveSB8fCAoIHdpbmRvdy5Db3dib3kgPSB7fSApLFxuICAgIFxuICAgIC8vIEludGVybmFsIG1ldGhvZCByZWZlcmVuY2UuXG4gICAganFfdGhyb3R0bGU7XG4gIFxuICAvLyBNZXRob2Q6IGpRdWVyeS50aHJvdHRsZVxuICAvLyBcbiAgLy8gVGhyb3R0bGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIEVzcGVjaWFsbHkgdXNlZnVsIGZvciByYXRlIGxpbWl0aW5nXG4gIC8vIGV4ZWN1dGlvbiBvZiBoYW5kbGVycyBvbiBldmVudHMgbGlrZSByZXNpemUgYW5kIHNjcm9sbC4gSWYgeW91IHdhbnQgdG9cbiAgLy8gcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiB0byBhIHNpbmdsZSB0aW1lLCBzZWUgdGhlXG4gIC8vIDxqUXVlcnkuZGVib3VuY2U+IG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICBYICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgWFxuICAvLyA+IFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vIFxuICAvLyBVc2FnZTpcbiAgLy8gXG4gIC8vID4gdmFyIHRocm90dGxlZCA9IGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKTtcbiAgLy8gPiBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCB0aHJvdHRsZWQgKTtcbiAgLy8gXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcbiAgLy8gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBqUXVlcnkudGhyb3R0bGUoIGRlbGF5LCBbIG5vX3RyYWlsaW5nLCBdIGNhbGxiYWNrICkgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcbiAgLy8gXG4gIC8vIEFyZ3VtZW50czpcbiAgLy8gXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XG4gIC8vICAgIGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICAvLyAgbm9fdHJhaWxpbmcgLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBub190cmFpbGluZyBpc1xuICAvLyAgICB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9fdHJhaWxpbmcgaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25lIGZpbmFsIHRpbWUgYWZ0ZXIgdGhlIGxhc3RcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlblxuICAvLyAgICBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGUgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cbiAgLy8gICAgVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsIHRvXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICAvLyBcbiAgLy8gUmV0dXJuczpcbiAgLy8gXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCB0aHJvdHRsZWQsIGZ1bmN0aW9uLlxuICBcbiAgJC50aHJvdHRsZSA9IGpxX3Rocm90dGxlID0gZnVuY3Rpb24oIGRlbGF5LCBub190cmFpbGluZywgY2FsbGJhY2ssIGRlYm91bmNlX21vZGUgKSB7XG4gICAgLy8gQWZ0ZXIgd3JhcHBlciBoYXMgc3RvcHBlZCBiZWluZyBjYWxsZWQsIHRoaXMgdGltZW91dCBlbnN1cmVzIHRoYXRcbiAgICAvLyBgY2FsbGJhY2tgIGlzIGV4ZWN1dGVkIGF0IHRoZSBwcm9wZXIgdGltZXMgaW4gYHRocm90dGxlYCBhbmQgYGVuZGBcbiAgICAvLyBkZWJvdW5jZSBtb2Rlcy5cbiAgICB2YXIgdGltZW91dF9pZCxcbiAgICAgIFxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgbGFzdCB0aW1lIGBjYWxsYmFja2Agd2FzIGV4ZWN1dGVkLlxuICAgICAgbGFzdF9leGVjID0gMDtcbiAgICBcbiAgICAvLyBgbm9fdHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuICAgIGlmICggdHlwZW9mIG5vX3RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG4gICAgICBkZWJvdW5jZV9tb2RlID0gY2FsbGJhY2s7XG4gICAgICBjYWxsYmFjayA9IG5vX3RyYWlsaW5nO1xuICAgICAgbm9fdHJhaWxpbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIFRoZSBgd3JhcHBlcmAgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgdGhyb3R0bGluZyAvIGRlYm91bmNpbmdcbiAgICAvLyBmdW5jdGlvbmFsaXR5IGFuZCB3aGVuIGV4ZWN1dGVkIHdpbGwgbGltaXQgdGhlIHJhdGUgYXQgd2hpY2ggYGNhbGxiYWNrYFxuICAgIC8vIGlzIGV4ZWN1dGVkLlxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIGVsYXBzZWQgPSArbmV3IERhdGUoKSAtIGxhc3RfZXhlYyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIFxuICAgICAgLy8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0X2V4ZWNgIHRpbWVzdGFtcC5cbiAgICAgIGZ1bmN0aW9uIGV4ZWMoKSB7XG4gICAgICAgIGxhc3RfZXhlYyA9ICtuZXcgRGF0ZSgpO1xuICAgICAgICBjYWxsYmFjay5hcHBseSggdGhhdCwgYXJncyApO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSB0aGlzIGlzIHVzZWQgdG8gY2xlYXIgdGhlIGZsYWdcbiAgICAgIC8vIHRvIGFsbG93IGZ1dHVyZSBgY2FsbGJhY2tgIGV4ZWN1dGlvbnMuXG4gICAgICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdGltZW91dF9pZCA9IHVuZGVmaW5lZDtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGlmICggZGVib3VuY2VfbW9kZSAmJiAhdGltZW91dF9pZCApIHtcbiAgICAgICAgLy8gU2luY2UgYHdyYXBwZXJgIGlzIGJlaW5nIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kXG4gICAgICAgIC8vIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbiksIGV4ZWN1dGUgYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dC5cbiAgICAgIHRpbWVvdXRfaWQgJiYgY2xlYXJUaW1lb3V0KCB0aW1lb3V0X2lkICk7XG4gICAgICBcbiAgICAgIGlmICggZGVib3VuY2VfbW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcbiAgICAgICAgLy8gSW4gdGhyb3R0bGUgbW9kZSwgaWYgYGRlbGF5YCB0aW1lIGhhcyBiZWVuIGV4Y2VlZGVkLCBleGVjdXRlXG4gICAgICAgIC8vIGBjYWxsYmFja2AuXG4gICAgICAgIGV4ZWMoKTtcbiAgICAgICAgXG4gICAgICB9IGVsc2UgaWYgKCBub190cmFpbGluZyAhPT0gdHJ1ZSApIHtcbiAgICAgICAgLy8gSW4gdHJhaWxpbmcgdGhyb3R0bGUgbW9kZSwgc2luY2UgYGRlbGF5YCB0aW1lIGhhcyBub3QgYmVlblxuICAgICAgICAvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuICAgICAgICAvLyByZWNlbnQgZXhlY3V0aW9uLlxuICAgICAgICAvLyBcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlXG4gICAgICAgIC8vIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgZmFsc2UgKGF0IGVuZCksIHNjaGVkdWxlIGBjYWxsYmFja2AgdG9cbiAgICAgICAgLy8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuICAgICAgICB0aW1lb3V0X2lkID0gc2V0VGltZW91dCggZGVib3VuY2VfbW9kZSA/IGNsZWFyIDogZXhlYywgZGVib3VuY2VfbW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIFNldCB0aGUgZ3VpZCBvZiBgd3JhcHBlcmAgZnVuY3Rpb24gdG8gdGhlIHNhbWUgb2Ygb3JpZ2luYWwgY2FsbGJhY2ssIHNvXG4gICAgLy8gaXQgY2FuIGJlIHJlbW92ZWQgaW4galF1ZXJ5IDEuNCsgLnVuYmluZCBvciAuZGllIGJ5IHVzaW5nIHRoZSBvcmlnaW5hbFxuICAgIC8vIGNhbGxiYWNrIGFzIGEgcmVmZXJlbmNlLlxuICAgIGlmICggJC5ndWlkICkge1xuICAgICAgd3JhcHBlci5ndWlkID0gY2FsbGJhY2suZ3VpZCA9IGNhbGxiYWNrLmd1aWQgfHwgJC5ndWlkKys7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiB0aGUgd3JhcHBlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LmRlYm91bmNlXG4gIC8vIFxuICAvLyBEZWJvdW5jZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRGVib3VuY2luZywgdW5saWtlIHRocm90dGxpbmcsXG4gIC8vIGd1YXJhbnRlZXMgdGhhdCBhIGZ1bmN0aW9uIGlzIG9ubHkgZXhlY3V0ZWQgYSBzaW5nbGUgdGltZSwgZWl0aGVyIGF0IHRoZVxuICAvLyB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLiBJZiB5b3Ugd2FudCB0b1xuICAvLyBzaW1wbHkgcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiwgc2VlIHRoZSA8alF1ZXJ5LnRocm90dGxlPlxuICAvLyBtZXRob2QuXG4gIC8vIFxuICAvLyBJbiB0aGlzIHZpc3VhbGl6YXRpb24sIHwgaXMgYSBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbCBhbmQgWCBpcyB0aGUgYWN0dWFsXG4gIC8vIGNhbGxiYWNrIGV4ZWN1dGlvbjpcbiAgLy8gXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQ6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcbiAgLy8gPiBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyB0cnVlOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgZGVib3VuY2VkID0galF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGRlYm91bmNlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBhdF9iZWdpbiAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIGF0X2JlZ2luIGlzIGZhbHNlIG9yXG4gIC8vICAgIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHMgYWZ0ZXJcbiAgLy8gICAgdGhlIGxhc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIElmIGF0X2JlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmVcbiAgLy8gICAgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGVcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGVcbiAgLy8gICAgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cbiAgLy8gICAgVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsIHRvXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgZGVib3VuY2VkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICAvLyBcbiAgLy8gUmV0dXJuczpcbiAgLy8gXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCBkZWJvdW5jZWQsIGZ1bmN0aW9uLlxuICBcbiAgJC5kZWJvdW5jZSA9IGZ1bmN0aW9uKCBkZWxheSwgYXRfYmVnaW4sIGNhbGxiYWNrICkge1xuICAgIHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGpxX3Rocm90dGxlKCBkZWxheSwgYXRfYmVnaW4sIGZhbHNlIClcbiAgICAgIDoganFfdGhyb3R0bGUoIGRlbGF5LCBjYWxsYmFjaywgYXRfYmVnaW4gIT09IGZhbHNlICk7XG4gIH07XG4gIFxufSkodGhpcyk7XG4iLCIvKipcbiAqIEZlYXRoZXJsaWdodCAtIHVsdHJhIHNsaW0galF1ZXJ5IGxpZ2h0Ym94XG4gKiBWZXJzaW9uIDEuMy40IC0gaHR0cDovL25vZWxib3NzLmdpdGh1Yi5pby9mZWF0aGVybGlnaHQvXG4gKlxuICogQ29weXJpZ2h0IDIwMTUsIE5vw6tsIFJhb3VsIEJvc3NhcnQgKGh0dHA6Ly93d3cubm9lbGJvc3MuY29tKVxuICogTUlUIExpY2Vuc2VkLlxuKiovXG4oZnVuY3Rpb24oJCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZigndW5kZWZpbmVkJyA9PT0gdHlwZW9mICQpIHtcblx0XHRpZignY29uc29sZScgaW4gd2luZG93KXsgd2luZG93LmNvbnNvbGUuaW5mbygnVG9vIG11Y2ggbGlnaHRuZXNzLCBGZWF0aGVybGlnaHQgbmVlZHMgalF1ZXJ5LicpOyB9XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0LyogRmVhdGhlcmxpZ2h0IGlzIGV4cG9ydGVkIGFzICQuZmVhdGhlcmxpZ2h0LlxuXHQgICBJdCBpcyBhIGZ1bmN0aW9uIHVzZWQgdG8gb3BlbiBhIGZlYXRoZXJsaWdodCBsaWdodGJveC5cblxuXHQgICBbdGVjaF1cblx0ICAgRmVhdGhlcmxpZ2h0IHVzZXMgcHJvdG90eXBlIGluaGVyaXRhbmNlLlxuXHQgICBFYWNoIG9wZW5lZCBsaWdodGJveCB3aWxsIGhhdmUgYSBjb3JyZXNwb25kaW5nIG9iamVjdC5cblx0ICAgVGhhdCBvYmplY3QgbWF5IGhhdmUgc29tZSBhdHRyaWJ1dGVzIHRoYXQgb3ZlcnJpZGUgdGhlXG5cdCAgIHByb3RvdHlwZSdzLlxuXHQgICBFeHRlbnNpb25zIGNyZWF0ZWQgd2l0aCBGZWF0aGVybGlnaHQuZXh0ZW5kIHdpbGwgaGF2ZSB0aGVpclxuXHQgICBvd24gcHJvdG90eXBlIHRoYXQgaW5oZXJpdHMgZnJvbSBGZWF0aGVybGlnaHQncyBwcm90b3R5cGUsXG5cdCAgIHRodXMgYXR0cmlidXRlcyBjYW4gYmUgb3ZlcnJpZGVuIGVpdGhlciBhdCB0aGUgb2JqZWN0IGxldmVsLFxuXHQgICBvciBhdCB0aGUgZXh0ZW5zaW9uIGxldmVsLlxuXHQgICBUbyBjcmVhdGUgY2FsbGJhY2tzIHRoYXQgY2hhaW4gdGhlbXNlbHZlcyBpbnN0ZWFkIG9mIG92ZXJyaWRpbmcsXG5cdCAgIHVzZSBjaGFpbkNhbGxiYWNrcy5cblx0ICAgRm9yIHRob3NlIGZhbWlsaWFyIHdpdGggQ29mZmVlU2NyaXB0LCB0aGlzIGNvcnJlc3BvbmQgdG9cblx0ICAgRmVhdGhlcmxpZ2h0IGJlaW5nIGEgY2xhc3MgYW5kIHRoZSBHYWxsZXJ5IGJlaW5nIGEgY2xhc3Ncblx0ICAgZXh0ZW5kaW5nIEZlYXRoZXJsaWdodC5cblx0ICAgVGhlIGNoYWluQ2FsbGJhY2tzIGlzIHVzZWQgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG9cblx0ICAgQ29mZmVlU2NyaXB0J3MgYHN1cGVyYC5cblx0Ki9cblxuXHRmdW5jdGlvbiBGZWF0aGVybGlnaHQoJGNvbnRlbnQsIGNvbmZpZykge1xuXHRcdGlmKHRoaXMgaW5zdGFuY2VvZiBGZWF0aGVybGlnaHQpIHsgIC8qIGNhbGxlZCB3aXRoIG5ldyAqL1xuXHRcdFx0dGhpcy5pZCA9IEZlYXRoZXJsaWdodC5pZCsrO1xuXHRcdFx0dGhpcy5zZXR1cCgkY29udGVudCwgY29uZmlnKTtcblx0XHRcdHRoaXMuY2hhaW5DYWxsYmFja3MoRmVhdGhlcmxpZ2h0Ll9jYWxsYmFja0NoYWluKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGZsID0gbmV3IEZlYXRoZXJsaWdodCgkY29udGVudCwgY29uZmlnKTtcblx0XHRcdGZsLm9wZW4oKTtcblx0XHRcdHJldHVybiBmbDtcblx0XHR9XG5cdH1cblxuXHR2YXIgb3BlbmVkID0gW10sXG5cdFx0cHJ1bmVPcGVuZWQgPSBmdW5jdGlvbihyZW1vdmUpIHtcblx0XHRcdG9wZW5lZCA9ICQuZ3JlcChvcGVuZWQsIGZ1bmN0aW9uKGZsKSB7XG5cdFx0XHRcdHJldHVybiBmbCAhPT0gcmVtb3ZlICYmIGZsLiRpbnN0YW5jZS5jbG9zZXN0KCdib2R5JykubGVuZ3RoID4gMDtcblx0XHRcdH0gKTtcblx0XHRcdHJldHVybiBvcGVuZWQ7XG5cdFx0fTtcblxuXHQvLyBzdHJ1Y3R1cmUoe2lmcmFtZU1pbkhlaWdodDogNDQsIGZvbzogMH0sICdpZnJhbWUnKVxuXHQvLyAgICM9PiB7bWluLWhlaWdodDogNDR9XG5cdHZhciBzdHJ1Y3R1cmUgPSBmdW5jdGlvbihvYmosIHByZWZpeCkge1xuXHRcdHZhciByZXN1bHQgPSB7fSxcblx0XHRcdHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyBwcmVmaXggKyAnKFtBLVpdKSguKiknKTtcblx0XHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdFx0XHR2YXIgbWF0Y2ggPSBrZXkubWF0Y2gocmVnZXgpO1xuXHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdHZhciBkYXNoZXJpemVkID0gKG1hdGNoWzFdICsgbWF0Y2hbMl0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdHJlc3VsdFtkYXNoZXJpemVkXSA9IG9ialtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdC8qIGRvY3VtZW50IHdpZGUga2V5IGhhbmRsZXIgKi9cblx0dmFyIGV2ZW50TWFwID0geyBrZXl1cDogJ29uS2V5VXAnLCByZXNpemU6ICdvblJlc2l6ZScgfTtcblxuXHR2YXIgZ2xvYmFsRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQkLmVhY2goRmVhdGhlcmxpZ2h0Lm9wZW5lZCgpLnJldmVyc2UoKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG5cdFx0XHRcdGlmIChmYWxzZSA9PT0gdGhpc1tldmVudE1hcFtldmVudC50eXBlXV0oZXZlbnQpKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IHJldHVybiBmYWxzZTtcblx0XHRcdCAgfVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciB0b2dnbGVHbG9iYWxFdmVudHMgPSBmdW5jdGlvbihzZXQpIHtcblx0XHRcdGlmKHNldCAhPT0gRmVhdGhlcmxpZ2h0Ll9nbG9iYWxIYW5kbGVySW5zdGFsbGVkKSB7XG5cdFx0XHRcdEZlYXRoZXJsaWdodC5fZ2xvYmFsSGFuZGxlckluc3RhbGxlZCA9IHNldDtcblx0XHRcdFx0dmFyIGV2ZW50cyA9ICQubWFwKGV2ZW50TWFwLCBmdW5jdGlvbihfLCBuYW1lKSB7IHJldHVybiBuYW1lKycuJytGZWF0aGVybGlnaHQucHJvdG90eXBlLm5hbWVzcGFjZTsgfSApLmpvaW4oJyAnKTtcblx0XHRcdFx0JCh3aW5kb3cpW3NldCA/ICdvbicgOiAnb2ZmJ10oZXZlbnRzLCBnbG9iYWxFdmVudEhhbmRsZXIpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0RmVhdGhlcmxpZ2h0LnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogRmVhdGhlcmxpZ2h0LFxuXHRcdC8qKiogZGVmYXVsdHMgKioqL1xuXHRcdC8qIGV4dGVuZCBmZWF0aGVybGlnaHQgd2l0aCBkZWZhdWx0cyBhbmQgbWV0aG9kcyAqL1xuXHRcdG5hbWVzcGFjZTogICAgJ2ZlYXRoZXJsaWdodCcsICAgICAgICAgLyogTmFtZSBvZiB0aGUgZXZlbnRzIGFuZCBjc3MgY2xhc3MgcHJlZml4ICovXG5cdFx0dGFyZ2V0QXR0cjogICAnZGF0YS1mZWF0aGVybGlnaHQnLCAgICAvKiBBdHRyaWJ1dGUgb2YgdGhlIHRyaWdnZXJlZCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIHNlbGVjdG9yIHRvIHRoZSBsaWdodGJveCBjb250ZW50ICovXG5cdFx0dmFyaWFudDogICAgICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBDbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gY2hhbmdlIGxvb2sgb2YgdGhlIGxpZ2h0Ym94ICovXG5cdFx0cmVzZXRDc3M6ICAgICBmYWxzZSwgICAgICAgICAgICAgICAgICAvKiBSZXNldCBhbGwgY3NzICovXG5cdFx0YmFja2dyb3VuZDogICBudWxsLCAgICAgICAgICAgICAgICAgICAvKiBDdXN0b20gRE9NIGZvciB0aGUgYmFja2dyb3VuZCwgd3JhcHBlciBhbmQgdGhlIGNsb3NlYnV0dG9uICovXG5cdFx0b3BlblRyaWdnZXI6ICAnY2xpY2snLCAgICAgICAgICAgICAgICAvKiBFdmVudCB0aGF0IHRyaWdnZXJzIHRoZSBsaWdodGJveCAqL1xuXHRcdGNsb3NlVHJpZ2dlcjogJ2NsaWNrJywgICAgICAgICAgICAgICAgLyogRXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgY2xvc2luZyBvZiB0aGUgbGlnaHRib3ggKi9cblx0XHRmaWx0ZXI6ICAgICAgIG51bGwsICAgICAgICAgICAgICAgICAgIC8qIFNlbGVjdG9yIHRvIGZpbHRlciBldmVudHMuIFRoaW5rICQoLi4uKS5vbignY2xpY2snLCBmaWx0ZXIsIGV2ZW50SGFuZGxlcikgKi9cblx0XHRyb290OiAgICAgICAgICdib2R5JywgICAgICAgICAgICAgICAgIC8qIFdoZXJlIHRvIGFwcGVuZCBmZWF0aGVybGlnaHRzICovXG5cdFx0b3BlblNwZWVkOiAgICAyNTAsICAgICAgICAgICAgICAgICAgICAvKiBEdXJhdGlvbiBvZiBvcGVuaW5nIGFuaW1hdGlvbiAqL1xuXHRcdGNsb3NlU3BlZWQ6ICAgMjUwLCAgICAgICAgICAgICAgICAgICAgLyogRHVyYXRpb24gb2YgY2xvc2luZyBhbmltYXRpb24gKi9cblx0XHRjbG9zZU9uQ2xpY2s6ICdiYWNrZ3JvdW5kJywgICAgICAgICAgIC8qIENsb3NlIGxpZ2h0Ym94IG9uIGNsaWNrICgnYmFja2dyb3VuZCcsICdhbnl3aGVyZScgb3IgZmFsc2UpICovXG5cdFx0Y2xvc2VPbkVzYzogICB0cnVlLCAgICAgICAgICAgICAgICAgICAvKiBDbG9zZSBsaWdodGJveCB3aGVuIHByZXNzaW5nIGVzYyAqL1xuXHRcdGNsb3NlSWNvbjogICAgJyYjMTAwMDU7JywgICAgICAgICAgICAgLyogQ2xvc2UgaWNvbiAqL1xuXHRcdGxvYWRpbmc6ICAgICAgJycsICAgICAgICAgICAgICAgICAgICAgLyogQ29udGVudCB0byBzaG93IHdoaWxlIGluaXRpYWwgY29udGVudCBpcyBsb2FkaW5nICovXG5cdFx0cGVyc2lzdDogICAgICBmYWxzZSxcdFx0XHRcdFx0XHRcdFx0XHQvKiBJZiBzZXQsIHRoZSBjb250ZW50IHBlcnNpc3QgYW5kIHdpbGwgYmUgc2hvd24gYWdhaW4gd2hlbiBvcGVuZWQgYWdhaW4uICdzaGFyZWQnIGlzIGEgc3BlY2lhbCB2YWx1ZSB3aGVuIGJpbmRpbmcgbXVsdGlwbGUgZWxlbWVudHMgZm9yIHRoZW0gdG8gc2hhcmUgdGhlIHNhbWUgY29udGVudCAqL1xuXHRcdG90aGVyQ2xvc2U6ICAgbnVsbCwgICAgICAgICAgICAgICAgICAgLyogU2VsZWN0b3IgZm9yIGFsdGVybmF0ZSBjbG9zZSBidXR0b25zIChlLmcuIFwiYS5jbG9zZVwiKSAqL1xuXHRcdGJlZm9yZU9wZW46ICAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGJlZm9yZSBvcGVuLiBjYW4gcmV0dXJuIGZhbHNlIHRvIHByZXZlbnQgb3BlbmluZyBvZiBsaWdodGJveC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cblx0XHRiZWZvcmVDb250ZW50OiAkLm5vb3AsICAgICAgICAgICAgICAgIC8qIENhbGxlZCB3aGVuIGNvbnRlbnQgaXMgbG9hZGVkLiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xuXHRcdGJlZm9yZUNsb3NlOiAgJC5ub29wLCAgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGJlZm9yZSBjbG9zZS4gY2FuIHJldHVybiBmYWxzZSB0byBwcmV2ZW50IG9wZW5pbmcgb2YgbGlnaHRib3guIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXG5cdFx0YWZ0ZXJPcGVuOiAgICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYWZ0ZXIgb3Blbi4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cblx0XHRhZnRlckNvbnRlbnQ6ICQubm9vcCwgICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBjb250ZW50IGlzIHJlYWR5IGFuZCBoYXMgYmVlbiBzZXQuIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXG5cdFx0YWZ0ZXJDbG9zZTogICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYWZ0ZXIgY2xvc2UuIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXG5cdFx0b25LZXlVcDogICAgICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgb24ga2V5IGRvd24gZm9yIHRoZSBmcm9udG1vc3QgZmVhdGhlcmxpZ2h0ICovXG5cdFx0b25SZXNpemU6ICAgICAkLm5vb3AsICAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYWZ0ZXIgbmV3IGNvbnRlbnQgYW5kIHdoZW4gYSB3aW5kb3cgaXMgcmVzaXplZCAqL1xuXHRcdHR5cGU6ICAgICAgICAgbnVsbCwgICAgICAgICAgICAgICAgICAgLyogU3BlY2lmeSB0eXBlIG9mIGxpZ2h0Ym94LiBJZiB1bnNldCwgaXQgd2lsbCBjaGVjayBmb3IgdGhlIHRhcmdldEF0dHJzIHZhbHVlLiAqL1xuXHRcdGNvbnRlbnRGaWx0ZXJzOiBbJ2pxdWVyeScsICdpbWFnZScsICdodG1sJywgJ2FqYXgnLCAnaWZyYW1lJywgJ3RleHQnXSwgLyogTGlzdCBvZiBjb250ZW50IGZpbHRlcnMgdG8gdXNlIHRvIGRldGVybWluZSB0aGUgY29udGVudCAqL1xuXG5cdFx0LyoqKiBtZXRob2RzICoqKi9cblx0XHQvKiBzZXR1cCBpdGVyYXRlcyBvdmVyIGEgc2luZ2xlIGluc3RhbmNlIG9mIGZlYXRoZXJsaWdodCBhbmQgcHJlcGFyZXMgdGhlIGJhY2tncm91bmQgYW5kIGJpbmRzIHRoZSBldmVudHMgKi9cblx0XHRzZXR1cDogZnVuY3Rpb24odGFyZ2V0LCBjb25maWcpe1xuXHRcdFx0LyogYWxsIGFyZ3VtZW50cyBhcmUgb3B0aW9uYWwgKi9cblx0XHRcdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgaW5zdGFuY2VvZiAkID09PSBmYWxzZSAmJiAhY29uZmlnKSB7XG5cdFx0XHRcdGNvbmZpZyA9IHRhcmdldDtcblx0XHRcdFx0dGFyZ2V0ID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2VsZiA9ICQuZXh0ZW5kKHRoaXMsIGNvbmZpZywge3RhcmdldDogdGFyZ2V0fSksXG5cdFx0XHRcdGNzcyA9ICFzZWxmLnJlc2V0Q3NzID8gc2VsZi5uYW1lc3BhY2UgOiBzZWxmLm5hbWVzcGFjZSsnLXJlc2V0JywgLyogYnkgYWRkaW5nIC1yZXNldCB0byB0aGUgY2xhc3NuYW1lLCB3ZSByZXNldCBhbGwgdGhlIGRlZmF1bHQgY3NzICovXG5cdFx0XHRcdCRiYWNrZ3JvdW5kID0gJChzZWxmLmJhY2tncm91bmQgfHwgW1xuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiJytjc3MrJy1sb2FkaW5nICcrY3NzKydcIj4nLFxuXHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCInK2NzcysnLWNvbnRlbnRcIj4nLFxuXHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCInK2NzcysnLWNsb3NlLWljb24gJysgc2VsZi5uYW1lc3BhY2UgKyAnLWNsb3NlXCI+Jyxcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNsb3NlSWNvbixcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nLFxuXHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicrc2VsZi5uYW1lc3BhY2UrJy1pbm5lclwiPicgKyBzZWxmLmxvYWRpbmcgKyAnPC9kaXY+Jyxcblx0XHRcdFx0XHRcdCc8L2Rpdj4nLFxuXHRcdFx0XHRcdCc8L2Rpdj4nXS5qb2luKCcnKSksXG5cdFx0XHRcdGNsb3NlQnV0dG9uU2VsZWN0b3IgPSAnLicrc2VsZi5uYW1lc3BhY2UrJy1jbG9zZScgKyAoc2VsZi5vdGhlckNsb3NlID8gJywnICsgc2VsZi5vdGhlckNsb3NlIDogJycpO1xuXG5cdFx0XHRzZWxmLiRpbnN0YW5jZSA9ICRiYWNrZ3JvdW5kLmNsb25lKCkuYWRkQ2xhc3Moc2VsZi52YXJpYW50KTsgLyogY2xvbmUgRE9NIGZvciB0aGUgYmFja2dyb3VuZCwgd3JhcHBlciBhbmQgdGhlIGNsb3NlIGJ1dHRvbiAqL1xuXG5cdFx0XHQvKiBjbG9zZSB3aGVuIGNsaWNrIG9uIGJhY2tncm91bmQvYW55d2hlcmUvbnVsbCBvciBjbG9zZWJveCAqL1xuXHRcdFx0c2VsZi4kaW5zdGFuY2Uub24oc2VsZi5jbG9zZVRyaWdnZXIrJy4nK3NlbGYubmFtZXNwYWNlLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHR2YXIgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KTtcblx0XHRcdFx0aWYoICgnYmFja2dyb3VuZCcgPT09IHNlbGYuY2xvc2VPbkNsaWNrICAmJiAkdGFyZ2V0LmlzKCcuJytzZWxmLm5hbWVzcGFjZSkpXG5cdFx0XHRcdFx0fHwgJ2FueXdoZXJlJyA9PT0gc2VsZi5jbG9zZU9uQ2xpY2tcblx0XHRcdFx0XHR8fCAkdGFyZ2V0LmNsb3Nlc3QoY2xvc2VCdXR0b25TZWxlY3RvcikubGVuZ3RoICl7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0LyogdGhpcyBtZXRob2QgcHJlcGFyZXMgdGhlIGNvbnRlbnQgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBqUXVlcnkgb2JqZWN0IG9yIGEgcHJvbWlzZSAqL1xuXHRcdGdldENvbnRlbnQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZih0aGlzLnBlcnNpc3QgIT09IGZhbHNlICYmIHRoaXMuJGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuJGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdGZpbHRlcnMgPSB0aGlzLmNvbnN0cnVjdG9yLmNvbnRlbnRGaWx0ZXJzLFxuXHRcdFx0XHRyZWFkVGFyZ2V0QXR0ciA9IGZ1bmN0aW9uKG5hbWUpeyByZXR1cm4gc2VsZi4kY3VycmVudFRhcmdldCAmJiBzZWxmLiRjdXJyZW50VGFyZ2V0LmF0dHIobmFtZSk7IH0sXG5cdFx0XHRcdHRhcmdldFZhbHVlID0gcmVhZFRhcmdldEF0dHIoc2VsZi50YXJnZXRBdHRyKSxcblx0XHRcdFx0ZGF0YSA9IHNlbGYudGFyZ2V0IHx8IHRhcmdldFZhbHVlIHx8ICcnO1xuXG5cdFx0XHQvKiBGaW5kIHdoaWNoIGZpbHRlciBhcHBsaWVzICovXG5cdFx0XHR2YXIgZmlsdGVyID0gZmlsdGVyc1tzZWxmLnR5cGVdOyAvKiBjaGVjayBleHBsaWNpdCB0eXBlIGxpa2Uge3R5cGU6ICdpbWFnZSd9ICovXG5cblx0XHRcdC8qIGNoZWNrIGV4cGxpY2l0IHR5cGUgbGlrZSBkYXRhLWZlYXRoZXJsaWdodD1cImltYWdlXCIgKi9cblx0XHRcdGlmKCFmaWx0ZXIgJiYgZGF0YSBpbiBmaWx0ZXJzKSB7XG5cdFx0XHRcdGZpbHRlciA9IGZpbHRlcnNbZGF0YV07XG5cdFx0XHRcdGRhdGEgPSBzZWxmLnRhcmdldCAmJiB0YXJnZXRWYWx1ZTtcblx0XHRcdH1cblx0XHRcdGRhdGEgPSBkYXRhIHx8IHJlYWRUYXJnZXRBdHRyKCdocmVmJykgfHwgJyc7XG5cblx0XHRcdC8qIGNoZWNrIGV4cGxpY2l0eSB0eXBlICYgY29udGVudCBsaWtlIHtpbWFnZTogJ3Bob3RvLmpwZyd9ICovXG5cdFx0XHRpZighZmlsdGVyKSB7XG5cdFx0XHRcdGZvcih2YXIgZmlsdGVyTmFtZSBpbiBmaWx0ZXJzKSB7XG5cdFx0XHRcdFx0aWYoc2VsZltmaWx0ZXJOYW1lXSkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyc1tmaWx0ZXJOYW1lXTtcblx0XHRcdFx0XHRcdGRhdGEgPSBzZWxmW2ZpbHRlck5hbWVdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKiBvdGhlcndpc2UgaXQncyBpbXBsaWNpdCwgcnVuIGNoZWNrcyAqL1xuXHRcdFx0aWYoIWZpbHRlcikge1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gZGF0YTtcblx0XHRcdFx0ZGF0YSA9IG51bGw7XG5cdFx0XHRcdCQuZWFjaChzZWxmLmNvbnRlbnRGaWx0ZXJzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW3RoaXNdO1xuXHRcdFx0XHRcdGlmKGZpbHRlci50ZXN0KSAge1xuXHRcdFx0XHRcdFx0ZGF0YSA9IGZpbHRlci50ZXN0KHRhcmdldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCFkYXRhICYmIGZpbHRlci5yZWdleCAmJiB0YXJnZXQubWF0Y2ggJiYgdGFyZ2V0Lm1hdGNoKGZpbHRlci5yZWdleCkpIHtcblx0XHRcdFx0XHRcdGRhdGEgPSB0YXJnZXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiAhZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmKCFkYXRhKSB7XG5cdFx0XHRcdFx0aWYoJ2NvbnNvbGUnIGluIHdpbmRvdyl7IHdpbmRvdy5jb25zb2xlLmVycm9yKCdGZWF0aGVybGlnaHQ6IG5vIGNvbnRlbnQgZmlsdGVyIGZvdW5kICcgKyAodGFyZ2V0ID8gJyBmb3IgXCInICsgdGFyZ2V0ICsgJ1wiJyA6ICcgKG5vIHRhcmdldCBzcGVjaWZpZWQpJykpOyB9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvKiBQcm9jZXNzIGl0ICovXG5cdFx0XHRyZXR1cm4gZmlsdGVyLnByb2Nlc3MuY2FsbChzZWxmLCBkYXRhKTtcblx0XHR9LFxuXG5cdFx0Lyogc2V0cyB0aGUgY29udGVudCBvZiAkaW5zdGFuY2UgdG8gJGNvbnRlbnQgKi9cblx0XHRzZXRDb250ZW50OiBmdW5jdGlvbigkY29udGVudCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHQvKiB3ZSBuZWVkIGEgc3BlY2lhbCBjbGFzcyBmb3IgdGhlIGlmcmFtZSAqL1xuXHRcdFx0aWYoJGNvbnRlbnQuaXMoJ2lmcmFtZScpIHx8ICQoJ2lmcmFtZScsICRjb250ZW50KS5sZW5ndGggPiAwKXtcblx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuYWRkQ2xhc3Moc2VsZi5uYW1lc3BhY2UrJy1pZnJhbWUnKTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZi4kaW5zdGFuY2UucmVtb3ZlQ2xhc3Moc2VsZi5uYW1lc3BhY2UrJy1sb2FkaW5nJyk7XG5cblx0XHRcdC8qIHJlcGxhY2UgY29udGVudCBieSBhcHBlbmRpbmcgdG8gZXhpc3Rpbmcgb25lIGJlZm9yZSBpdCBpcyByZW1vdmVkXG5cdFx0XHQgICB0aGlzIGluc3VyZXMgdGhhdCBmZWF0aGVybGlnaHQtaW5uZXIgcmVtYWluIGF0IHRoZSBzYW1lIHJlbGF0aXZlXG5cdFx0XHRcdCBwb3NpdGlvbiB0byBhbnkgb3RoZXIgaXRlbXMgYWRkZWQgdG8gZmVhdGhlcmxpZ2h0LWNvbnRlbnQgKi9cblx0XHRcdHNlbGYuJGluc3RhbmNlLmZpbmQoJy4nK3NlbGYubmFtZXNwYWNlKyctaW5uZXInKVxuXHRcdFx0XHQubm90KCRjb250ZW50KSAgICAgICAgICAgICAgICAvKiBleGNsdWRlZCBuZXcgY29udGVudCwgaW1wb3J0YW50IGlmIHBlcnNpc3RlZCAqL1xuXHRcdFx0XHQuc2xpY2UoMSkucmVtb3ZlKCkuZW5kKClcdFx0XHQvKiBJbiB0aGUgdW5leHBlY3RlZCBldmVudCB3aGVyZSB0aGVyZSBhcmUgbWFueSBpbm5lciBlbGVtZW50cywgcmVtb3ZlIGFsbCBidXQgdGhlIGZpcnN0IG9uZSAqL1xuXHRcdFx0XHQucmVwbGFjZVdpdGgoJC5jb250YWlucyhzZWxmLiRpbnN0YW5jZVswXSwgJGNvbnRlbnRbMF0pID8gJycgOiAkY29udGVudCk7XG5cblx0XHRcdHNlbGYuJGNvbnRlbnQgPSAkY29udGVudC5hZGRDbGFzcyhzZWxmLm5hbWVzcGFjZSsnLWlubmVyJyk7XG5cblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH0sXG5cblx0XHQvKiBvcGVucyB0aGUgbGlnaHRib3guIFwidGhpc1wiIGNvbnRhaW5zICRpbnN0YW5jZSB3aXRoIHRoZSBsaWdodGJveCwgYW5kIHdpdGggdGhlIGNvbmZpZy5cblx0XHRcdFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgYWZ0ZXIgaXMgc3VjY2Vzc2Z1bGx5IG9wZW5lZC4gKi9cblx0XHRvcGVuOiBmdW5jdGlvbihldmVudCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5oaWRlKCkuYXBwZW5kVG8oc2VsZi5yb290KTtcblx0XHRcdGlmKCghZXZlbnQgfHwgIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKVxuXHRcdFx0XHQmJiBzZWxmLmJlZm9yZU9wZW4oZXZlbnQpICE9PSBmYWxzZSkge1xuXG5cdFx0XHRcdGlmKGV2ZW50KXtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciAkY29udGVudCA9IHNlbGYuZ2V0Q29udGVudCgpO1xuXG5cdFx0XHRcdGlmKCRjb250ZW50KSB7XG5cdFx0XHRcdFx0b3BlbmVkLnB1c2goc2VsZik7XG5cblx0XHRcdFx0XHR0b2dnbGVHbG9iYWxFdmVudHModHJ1ZSk7XG5cblx0XHRcdFx0XHRzZWxmLiRpbnN0YW5jZS5mYWRlSW4oc2VsZi5vcGVuU3BlZWQpO1xuXHRcdFx0XHRcdHNlbGYuYmVmb3JlQ29udGVudChldmVudCk7XG5cblx0XHRcdFx0XHQvKiBTZXQgY29udGVudCBhbmQgc2hvdyAqL1xuXHRcdFx0XHRcdHJldHVybiAkLndoZW4oJGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCRjb250ZW50KXtcblx0XHRcdFx0XHRcdFx0c2VsZi5zZXRDb250ZW50KCRjb250ZW50KTtcblx0XHRcdFx0XHRcdFx0c2VsZi5hZnRlckNvbnRlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50aGVuKHNlbGYuJGluc3RhbmNlLnByb21pc2UoKSlcblx0XHRcdFx0XHRcdC8qIENhbGwgYWZ0ZXJPcGVuIGFmdGVyIGZhZGVJbiBpcyBkb25lICovXG5cdFx0XHRcdFx0XHQuZG9uZShmdW5jdGlvbigpeyBzZWxmLmFmdGVyT3BlbihldmVudCk7IH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5kZXRhY2goKTtcblx0XHRcdHJldHVybiAkLkRlZmVycmVkKCkucmVqZWN0KCkucHJvbWlzZSgpO1xuXHRcdH0sXG5cblx0XHQvKiBjbG9zZXMgdGhlIGxpZ2h0Ym94LiBcInRoaXNcIiBjb250YWlucyAkaW5zdGFuY2Ugd2l0aCB0aGUgbGlnaHRib3gsIGFuZCB3aXRoIHRoZSBjb25maWdcblx0XHRcdHJldHVybnMgYSBwcm9taXNlLCByZXNvbHZlZCBhZnRlciB0aGUgbGlnaHRib3ggaXMgc3VjY2Vzc2Z1bGx5IGNsb3NlZC4gKi9cblx0XHRjbG9zZTogZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuXHRcdFx0aWYoc2VsZi5iZWZvcmVDbG9zZShldmVudCkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdCgpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoMCA9PT0gcHJ1bmVPcGVuZWQoc2VsZikubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dG9nZ2xlR2xvYmFsRXZlbnRzKGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNlbGYuJGluc3RhbmNlLmZhZGVPdXQoc2VsZi5jbG9zZVNwZWVkLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuZGV0YWNoKCk7XG5cdFx0XHRcdFx0c2VsZi5hZnRlckNsb3NlKGV2ZW50KTtcblx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0XHR9LFxuXG5cdFx0LyogVXRpbGl0eSBmdW5jdGlvbiB0byBjaGFpbiBjYWxsYmFja3Ncblx0XHQgICBbV2FybmluZzogZ3VydS1sZXZlbF1cblx0XHQgICBVc2VkIGJlIGV4dGVuc2lvbnMgdGhhdCB3YW50IHRvIGxldCB1c2VycyBzcGVjaWZ5IGNhbGxiYWNrcyBidXRcblx0XHQgICBhbHNvIG5lZWQgdGhlbXNlbHZlcyB0byB1c2UgdGhlIGNhbGxiYWNrcy5cblx0XHQgICBUaGUgYXJndW1lbnQgJ2NoYWluJyBoYXMgY2FsbGJhY2sgbmFtZXMgYXMga2V5cyBhbmQgZnVuY3Rpb24oc3VwZXIsIGV2ZW50KVxuXHRcdCAgIGFzIHZhbHVlcy4gVGhhdCBmdW5jdGlvbiBpcyBtZWFudCB0byBjYWxsIGBzdXBlcmAgYXQgc29tZSBwb2ludC5cblx0XHQqL1xuXHRcdGNoYWluQ2FsbGJhY2tzOiBmdW5jdGlvbihjaGFpbikge1xuXHRcdFx0Zm9yICh2YXIgbmFtZSBpbiBjaGFpbikge1xuXHRcdFx0XHR0aGlzW25hbWVdID0gJC5wcm94eShjaGFpbltuYW1lXSwgdGhpcywgJC5wcm94eSh0aGlzW25hbWVdLCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdCQuZXh0ZW5kKEZlYXRoZXJsaWdodCwge1xuXHRcdGlkOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFVzZWQgdG8gaWQgc2luZ2xlIGZlYXRoZXJsaWdodCBpbnN0YW5jZXMgKi9cblx0XHRhdXRvQmluZDogICAgICAgJ1tkYXRhLWZlYXRoZXJsaWdodF0nLCAgICAvKiBXaWxsIGF1dG9tYXRpY2FsbHkgYmluZCBlbGVtZW50cyBtYXRjaGluZyB0aGlzIHNlbGVjdG9yLiBDbGVhciBvciBzZXQgYmVmb3JlIG9uUmVhZHkgKi9cblx0XHRkZWZhdWx0czogICAgICAgRmVhdGhlcmxpZ2h0LnByb3RvdHlwZSwgICAvKiBZb3UgY2FuIGFjY2VzcyBhbmQgb3ZlcnJpZGUgYWxsIGRlZmF1bHRzIHVzaW5nICQuZmVhdGhlcmxpZ2h0LmRlZmF1bHRzLCB3aGljaCBpcyBqdXN0IGEgc3lub255bSBmb3IgJC5mZWF0aGVybGlnaHQucHJvdG90eXBlICovXG5cdFx0LyogQ29udGFpbnMgdGhlIGxvZ2ljIHRvIGRldGVybWluZSBjb250ZW50ICovXG5cdFx0Y29udGVudEZpbHRlcnM6IHtcblx0XHRcdGpxdWVyeToge1xuXHRcdFx0XHRyZWdleDogL15bIy5dXFx3LywgICAgICAgICAvKiBBbnl0aGluZyB0aGF0IHN0YXJ0cyB3aXRoIGEgY2xhc3MgbmFtZSBvciBpZGVudGlmaWVycyAqL1xuXHRcdFx0XHR0ZXN0OiBmdW5jdGlvbihlbGVtKSAgICB7IHJldHVybiBlbGVtIGluc3RhbmNlb2YgJCAmJiBlbGVtOyB9LFxuXHRcdFx0XHRwcm9jZXNzOiBmdW5jdGlvbihlbGVtKSB7IHJldHVybiB0aGlzLnBlcnNpc3QgIT09IGZhbHNlID8gJChlbGVtKSA6ICQoZWxlbSkuY2xvbmUodHJ1ZSk7IH1cblx0XHRcdH0sXG5cdFx0XHRpbWFnZToge1xuXHRcdFx0XHRyZWdleDogL1xcLihwbmd8anBnfGpwZWd8Z2lmfHRpZmZ8Ym1wfHN2ZykoXFw/XFxTKik/JC9pLFxuXHRcdFx0XHRwcm9jZXNzOiBmdW5jdGlvbih1cmwpICB7XG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQgPSAkLkRlZmVycmVkKCksXG5cdFx0XHRcdFx0XHRpbWcgPSBuZXcgSW1hZ2UoKSxcblx0XHRcdFx0XHRcdCRpbWcgPSAkKCc8aW1nIHNyYz1cIicrdXJsKydcIiBhbHQ9XCJcIiBjbGFzcz1cIicrc2VsZi5uYW1lc3BhY2UrJy1pbWFnZVwiIC8+Jyk7XG5cdFx0XHRcdFx0aW1nLm9ubG9hZCAgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8qIFN0b3JlIG5hdHVyYWxXaWR0aCAmIGhlaWdodCBmb3IgSUU4ICovXG5cdFx0XHRcdFx0XHQkaW1nLm5hdHVyYWxXaWR0aCA9IGltZy53aWR0aDsgJGltZy5uYXR1cmFsSGVpZ2h0ID0gaW1nLmhlaWdodDtcblx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoICRpbWcgKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7IGRlZmVycmVkLnJlamVjdCgkaW1nKTsgfTtcblx0XHRcdFx0XHRpbWcuc3JjID0gdXJsO1xuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRodG1sOiB7XG5cdFx0XHRcdHJlZ2V4OiAvXlxccyo8W1xcdyFdW148XSo+LywgLyogQW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCBzb21lIGtpbmQgb2YgdmFsaWQgdGFnICovXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKGh0bWwpIHsgcmV0dXJuICQoaHRtbCk7IH1cblx0XHRcdH0sXG5cdFx0XHRhamF4OiB7XG5cdFx0XHRcdHJlZ2V4OiAvLi8sICAgICAgICAgICAgLyogQXQgdGhpcyBwb2ludCwgYW55IGNvbnRlbnQgaXMgYXNzdW1lZCB0byBiZSBhbiBVUkwgKi9cblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odXJsKSAge1xuXHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0XHRcdGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXHRcdFx0XHRcdC8qIHdlIGFyZSB1c2luZyBsb2FkIHNvIG9uZSBjYW4gc3BlY2lmeSBhIHRhcmdldCB3aXRoOiB1cmwuaHRtbCAjdGFyZ2V0ZWxlbWVudCAqL1xuXHRcdFx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnPGRpdj48L2Rpdj4nKS5sb2FkKHVybCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cyl7XG5cdFx0XHRcdFx0XHRpZiAoIHN0YXR1cyAhPT0gXCJlcnJvclwiICkge1xuXHRcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKCRjb250YWluZXIuY29udGVudHMoKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRkZWZlcnJlZC5mYWlsKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGlmcmFtZToge1xuXHRcdFx0XHRwcm9jZXNzOiBmdW5jdGlvbih1cmwpIHtcblx0XHRcdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXHRcdFx0XHRcdHZhciAkY29udGVudCA9ICQoJzxpZnJhbWUvPicpXG5cdFx0XHRcdFx0XHQuaGlkZSgpXG5cdFx0XHRcdFx0XHQuYXR0cignc3JjJywgdXJsKVxuXHRcdFx0XHRcdFx0LmNzcyhzdHJ1Y3R1cmUodGhpcywgJ2lmcmFtZScpKVxuXHRcdFx0XHRcdFx0Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7IGRlZmVycmVkLnJlc29sdmUoJGNvbnRlbnQuc2hvdygpKTsgfSlcblx0XHRcdFx0XHRcdC8vIFdlIGNhbid0IG1vdmUgYW4gPGlmcmFtZT4gYW5kIGF2b2lkIHJlbG9hZGluZyBpdCxcblx0XHRcdFx0XHRcdC8vIHNvIGxldCdzIHB1dCBpdCBpbiBwbGFjZSBvdXJzZWx2ZXMgcmlnaHQgbm93OlxuXHRcdFx0XHRcdFx0LmFwcGVuZFRvKHRoaXMuJGluc3RhbmNlLmZpbmQoJy4nICsgdGhpcy5uYW1lc3BhY2UgKyAnLWNvbnRlbnQnKSk7XG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRleHQ6IHtcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odGV4dCkgeyByZXR1cm4gJCgnPGRpdj4nLCB7dGV4dDogdGV4dH0pOyB9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGZ1bmN0aW9uQXR0cmlidXRlczogWydiZWZvcmVPcGVuJywgJ2FmdGVyT3BlbicsICdiZWZvcmVDb250ZW50JywgJ2FmdGVyQ29udGVudCcsICdiZWZvcmVDbG9zZScsICdhZnRlckNsb3NlJ10sXG5cblx0XHQvKioqIGNsYXNzIG1ldGhvZHMgKioqL1xuXHRcdC8qIHJlYWQgZWxlbWVudCdzIGF0dHJpYnV0ZXMgc3RhcnRpbmcgd2l0aCBkYXRhLWZlYXRoZXJsaWdodC0gKi9cblx0XHRyZWFkRWxlbWVudENvbmZpZzogZnVuY3Rpb24oZWxlbWVudCwgbmFtZXNwYWNlKSB7XG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzLFxuXHRcdFx0XHRyZWdleHAgPSBuZXcgUmVnRXhwKCdeZGF0YS0nICsgbmFtZXNwYWNlICsgJy0oLiopJyksXG5cdFx0XHRcdGNvbmZpZyA9IHt9O1xuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5hdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdCQuZWFjaChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gdGhpcy5uYW1lLm1hdGNoKHJlZ2V4cCk7XG5cdFx0XHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdFx0XHR2YXIgdmFsID0gdGhpcy52YWx1ZSxcblx0XHRcdFx0XHRcdFx0bmFtZSA9ICQuY2FtZWxDYXNlKG1hdGNoWzFdKTtcblx0XHRcdFx0XHRcdGlmICgkLmluQXJyYXkobmFtZSwgS2xhc3MuZnVuY3Rpb25BdHRyaWJ1dGVzKSA+PSAwKSB7ICAvKiBqc2hpbnQgLVcwNTQgKi9cblx0XHRcdFx0XHRcdFx0dmFsID0gbmV3IEZ1bmN0aW9uKHZhbCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoganNoaW50ICtXMDU0ICovXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0cnkgeyB2YWwgPSAkLnBhcnNlSlNPTih2YWwpOyB9XG5cdFx0XHRcdFx0XHRcdGNhdGNoKGUpIHt9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25maWdbbmFtZV0gPSB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjb25maWc7XG5cdFx0fSxcblxuXHRcdC8qIFVzZWQgdG8gY3JlYXRlIGEgRmVhdGhlcmxpZ2h0IGV4dGVuc2lvblxuXHRcdCAgIFtXYXJuaW5nOiBndXJ1LWxldmVsXVxuXHRcdCAgIENyZWF0ZXMgdGhlIGV4dGVuc2lvbidzIHByb3RvdHlwZSB0aGF0IGluIHR1cm5cblx0XHQgICBpbmhlcml0cyBGZWF0aGVybGlnaHQncyBwcm90b3R5cGUuXG5cdFx0ICAgQ291bGQgYmUgdXNlZCB0byBleHRlbmQgYW4gZXh0ZW5zaW9uIHRvby4uLlxuXHRcdCAgIFRoaXMgaXMgcHJldHR5IGhpZ2ggbGV2ZWwgd2l6YXJkeSwgaXQgY29tZXMgcHJldHR5IG11Y2ggc3RyYWlnaHRcblx0XHQgICBmcm9tIENvZmZlZVNjcmlwdCBhbmQgd29uJ3QgdGVhY2ggeW91IGFueXRoaW5nIGFib3V0IEZlYXRoZXJsaWdodFxuXHRcdCAgIGFzIGl0J3Mgbm90IHJlYWxseSBzcGVjaWZpYyB0byB0aGlzIGxpYnJhcnkuXG5cdFx0ICAgTXkgc3VnZ2VzdGlvbjogbW92ZSBhbG9uZyBhbmQga2VlcCB5b3VyIHNhbml0eS5cblx0XHQqL1xuXHRcdGV4dGVuZDogZnVuY3Rpb24oY2hpbGQsIGRlZmF1bHRzKSB7XG5cdFx0XHQvKiBTZXR1cCBjbGFzcyBoaWVyYXJjaHksIGFkYXB0ZWQgZnJvbSBDb2ZmZWVTY3JpcHQgKi9cblx0XHRcdHZhciBDdG9yID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9O1xuXHRcdFx0Q3Rvci5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcblx0XHRcdGNoaWxkLnByb3RvdHlwZSA9IG5ldyBDdG9yKCk7XG5cdFx0XHRjaGlsZC5fX3N1cGVyX18gPSB0aGlzLnByb3RvdHlwZTtcblx0XHRcdC8qIENvcHkgY2xhc3MgbWV0aG9kcyAmIGF0dHJpYnV0ZXMgKi9cblx0XHRcdCQuZXh0ZW5kKGNoaWxkLCB0aGlzLCBkZWZhdWx0cyk7XG5cdFx0XHRjaGlsZC5kZWZhdWx0cyA9IGNoaWxkLnByb3RvdHlwZTtcblx0XHRcdHJldHVybiBjaGlsZDtcblx0XHR9LFxuXG5cdFx0YXR0YWNoOiBmdW5jdGlvbigkc291cmNlLCAkY29udGVudCwgY29uZmlnKSB7XG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzO1xuXHRcdFx0aWYgKHR5cGVvZiAkY29udGVudCA9PT0gJ29iamVjdCcgJiYgJGNvbnRlbnQgaW5zdGFuY2VvZiAkID09PSBmYWxzZSAmJiAhY29uZmlnKSB7XG5cdFx0XHRcdGNvbmZpZyA9ICRjb250ZW50O1xuXHRcdFx0XHQkY29udGVudCA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHRcdC8qIG1ha2UgYSBjb3B5ICovXG5cdFx0XHRjb25maWcgPSAkLmV4dGVuZCh7fSwgY29uZmlnKTtcblxuXHRcdFx0LyogT25seSBmb3Igb3BlblRyaWdnZXIgYW5kIG5hbWVzcGFjZS4uLiAqL1xuXHRcdFx0dmFyIG5hbWVzcGFjZSA9IGNvbmZpZy5uYW1lc3BhY2UgfHwgS2xhc3MuZGVmYXVsdHMubmFtZXNwYWNlLFxuXHRcdFx0XHR0ZW1wQ29uZmlnID0gJC5leHRlbmQoe30sIEtsYXNzLmRlZmF1bHRzLCBLbGFzcy5yZWFkRWxlbWVudENvbmZpZygkc291cmNlWzBdLCBuYW1lc3BhY2UpLCBjb25maWcpLFxuXHRcdFx0XHRzaGFyZWRQZXJzaXN0O1xuXG5cdFx0XHQkc291cmNlLm9uKHRlbXBDb25maWcub3BlblRyaWdnZXIrJy4nK3RlbXBDb25maWcubmFtZXNwYWNlLCB0ZW1wQ29uZmlnLmZpbHRlciwgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0LyogLi4uIHNpbmNlIHdlIG1pZ2h0IGFzIHdlbGwgY29tcHV0ZSB0aGUgY29uZmlnIG9uIHRoZSBhY3R1YWwgdGFyZ2V0ICovXG5cdFx0XHRcdHZhciBlbGVtQ29uZmlnID0gJC5leHRlbmQoXG5cdFx0XHRcdFx0eyRzb3VyY2U6ICRzb3VyY2UsICRjdXJyZW50VGFyZ2V0OiAkKHRoaXMpfSxcblx0XHRcdFx0XHRLbGFzcy5yZWFkRWxlbWVudENvbmZpZygkc291cmNlWzBdLCB0ZW1wQ29uZmlnLm5hbWVzcGFjZSksXG5cdFx0XHRcdFx0S2xhc3MucmVhZEVsZW1lbnRDb25maWcodGhpcywgdGVtcENvbmZpZy5uYW1lc3BhY2UpLFxuXHRcdFx0XHRcdGNvbmZpZyk7XG5cdFx0XHRcdHZhciBmbCA9IHNoYXJlZFBlcnNpc3QgfHwgJCh0aGlzKS5kYXRhKCdmZWF0aGVybGlnaHQtcGVyc2lzdGVkJykgfHwgbmV3IEtsYXNzKCRjb250ZW50LCBlbGVtQ29uZmlnKTtcblx0XHRcdFx0aWYoZmwucGVyc2lzdCA9PT0gJ3NoYXJlZCcpIHtcblx0XHRcdFx0XHRzaGFyZWRQZXJzaXN0ID0gZmw7XG5cdFx0XHRcdH0gZWxzZSBpZihmbC5wZXJzaXN0ICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnZmVhdGhlcmxpZ2h0LXBlcnNpc3RlZCcsIGZsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtQ29uZmlnLiRjdXJyZW50VGFyZ2V0LmJsdXIoKTsgLy8gT3RoZXJ3aXNlICdlbnRlcicga2V5IG1pZ2h0IHRyaWdnZXIgdGhlIGRpYWxvZyBhZ2FpblxuXHRcdFx0XHRmbC5vcGVuKGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuICRzb3VyY2U7XG5cdFx0fSxcblxuXHRcdGN1cnJlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFsbCA9IHRoaXMub3BlbmVkKCk7XG5cdFx0XHRyZXR1cm4gYWxsW2FsbC5sZW5ndGggLSAxXSB8fCBudWxsO1xuXHRcdH0sXG5cblx0XHRvcGVuZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGtsYXNzID0gdGhpcztcblx0XHRcdHBydW5lT3BlbmVkKCk7XG5cdFx0XHRyZXR1cm4gJC5ncmVwKG9wZW5lZCwgZnVuY3Rpb24oZmwpIHsgcmV0dXJuIGZsIGluc3RhbmNlb2Yga2xhc3M7IH0gKTtcblx0XHR9LFxuXG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGN1ciA9IHRoaXMuY3VycmVudCgpO1xuXHRcdFx0aWYoY3VyKSB7IHJldHVybiBjdXIuY2xvc2UoKTsgfVxuXHRcdH0sXG5cblx0XHQvKiBEb2VzIHRoZSBhdXRvIGJpbmRpbmcgb24gc3RhcnR1cC5cblx0XHQgICBNZWFudCBvbmx5IHRvIGJlIHVzZWQgYnkgRmVhdGhlcmxpZ2h0IGFuZCBpdHMgZXh0ZW5zaW9uc1xuXHRcdCovXG5cdFx0X29uUmVhZHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIEtsYXNzID0gdGhpcztcblx0XHRcdGlmKEtsYXNzLmF1dG9CaW5kKXtcblx0XHRcdFx0LyogQmluZCBleGlzdGluZyBlbGVtZW50cyAqL1xuXHRcdFx0XHQkKEtsYXNzLmF1dG9CaW5kKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0S2xhc3MuYXR0YWNoKCQodGhpcykpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0LyogSWYgYSBjbGljayBwcm9wYWdhdGVzIHRvIHRoZSBkb2N1bWVudCBsZXZlbCwgdGhlbiB3ZSBoYXZlIGFuIGl0ZW0gdGhhdCB3YXMgYWRkZWQgbGF0ZXIgb24gKi9cblx0XHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgS2xhc3MuYXV0b0JpbmQsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRcdGlmIChldnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0LyogQmluZCBmZWF0aGVybGlnaHQgKi9cblx0XHRcdFx0XHRLbGFzcy5hdHRhY2goJChldnQuY3VycmVudFRhcmdldCkpO1xuXHRcdFx0XHRcdC8qIENsaWNrIGFnYWluOyB0aGlzIHRpbWUgb3VyIGJpbmRpbmcgd2lsbCBjYXRjaCBpdCAqL1xuXHRcdFx0XHRcdCQoZXZ0LnRhcmdldCkuY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qIEZlYXRoZXJsaWdodCB1c2VzIHRoZSBvbktleVVwIGNhbGxiYWNrIHRvIGludGVyY2VwdCB0aGUgZXNjYXBlIGtleS5cblx0XHQgICBQcml2YXRlIHRvIEZlYXRoZXJsaWdodC5cblx0XHQqL1xuXHRcdF9jYWxsYmFja0NoYWluOiB7XG5cdFx0XHRvbktleVVwOiBmdW5jdGlvbihfc3VwZXIsIGV2ZW50KXtcblx0XHRcdFx0aWYoMjcgPT09IGV2ZW50LmtleUNvZGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5jbG9zZU9uRXNjKSB7XG5cdFx0XHRcdFx0XHR0aGlzLiRpbnN0YW5jZS5maW5kKCcuJyt0aGlzLm5hbWVzcGFjZSsnLWNsb3NlOmZpcnN0JykuY2xpY2soKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBfc3VwZXIoZXZlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRvblJlc2l6ZTogZnVuY3Rpb24oX3N1cGVyLCBldmVudCl7XG5cdFx0XHRcdGlmICh0aGlzLiRjb250ZW50Lm5hdHVyYWxXaWR0aCkge1xuXHRcdFx0XHRcdHZhciB3ID0gdGhpcy4kY29udGVudC5uYXR1cmFsV2lkdGgsIGggPSB0aGlzLiRjb250ZW50Lm5hdHVyYWxIZWlnaHQ7XG5cdFx0XHRcdFx0LyogUmVzZXQgYXBwYXJlbnQgaW1hZ2Ugc2l6ZSBmaXJzdCBzbyBjb250YWluZXIgZ3Jvd3MgKi9cblx0XHRcdFx0XHR0aGlzLiRjb250ZW50LmNzcygnd2lkdGgnLCAnJykuY3NzKCdoZWlnaHQnLCAnJyk7XG5cdFx0XHRcdFx0LyogQ2FsY3VsYXRlIHRoZSB3b3JzdCByYXRpbyBzbyB0aGF0IGRpbWVuc2lvbnMgZml0ICovXG5cdFx0XHRcdFx0dmFyIHJhdGlvID0gTWF0aC5tYXgoXG5cdFx0XHRcdFx0XHR3ICAvIHBhcnNlSW50KHRoaXMuJGNvbnRlbnQucGFyZW50KCkuY3NzKCd3aWR0aCcpLDEwKSxcblx0XHRcdFx0XHRcdGggLyBwYXJzZUludCh0aGlzLiRjb250ZW50LnBhcmVudCgpLmNzcygnaGVpZ2h0JyksMTApKTtcblx0XHRcdFx0XHQvKiBSZXNpemUgY29udGVudCAqL1xuXHRcdFx0XHRcdGlmIChyYXRpbyA+IDEpIHtcblx0XHRcdFx0XHRcdHRoaXMuJGNvbnRlbnQuY3NzKCd3aWR0aCcsICcnICsgdyAvIHJhdGlvICsgJ3B4JykuY3NzKCdoZWlnaHQnLCAnJyArIGggLyByYXRpbyArICdweCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gX3N1cGVyKGV2ZW50KTtcblx0XHRcdH0sXG5cblx0XHRcdGFmdGVyQ29udGVudDogZnVuY3Rpb24oX3N1cGVyLCBldmVudCl7XG5cdFx0XHRcdHZhciByID0gX3N1cGVyKGV2ZW50KTtcblx0XHRcdFx0dGhpcy5vblJlc2l6ZShldmVudCk7XG5cdFx0XHRcdHJldHVybiByO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JC5mZWF0aGVybGlnaHQgPSBGZWF0aGVybGlnaHQ7XG5cblx0LyogYmluZCBqUXVlcnkgZWxlbWVudHMgdG8gdHJpZ2dlciBmZWF0aGVybGlnaHQgKi9cblx0JC5mbi5mZWF0aGVybGlnaHQgPSBmdW5jdGlvbigkY29udGVudCwgY29uZmlnKSB7XG5cdFx0cmV0dXJuIEZlYXRoZXJsaWdodC5hdHRhY2godGhpcywgJGNvbnRlbnQsIGNvbmZpZyk7XG5cdH07XG5cblx0LyogYmluZCBmZWF0aGVybGlnaHQgb24gcmVhZHkgaWYgY29uZmlnIGF1dG9CaW5kIGlzIHNldCAqL1xuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpeyBGZWF0aGVybGlnaHQuX29uUmVhZHkoKTsgfSk7XG59KGpRdWVyeSkpO1xuIiwiLyohXG4gKiBob3ZlckludGVudCB2MS44LjEgLy8gMjAxNC4wOC4xMSAvLyBqUXVlcnkgdjEuOS4xK1xuICogaHR0cDovL2NoZXJuZS5uZXQvYnJpYW4vcmVzb3VyY2VzL2pxdWVyeS5ob3ZlckludGVudC5odG1sXG4gKlxuICogWW91IG1heSB1c2UgaG92ZXJJbnRlbnQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS4gQmFzaWNhbGx5IHRoYXRcbiAqIG1lYW5zIHlvdSBhcmUgZnJlZSB0byB1c2UgaG92ZXJJbnRlbnQgYXMgbG9uZyBhcyB0aGlzIGhlYWRlciBpcyBsZWZ0IGludGFjdC5cbiAqIENvcHlyaWdodCAyMDA3LCAyMDE0IEJyaWFuIENoZXJuZVxuICovXG4gXG4vKiBob3ZlckludGVudCBpcyBzaW1pbGFyIHRvIGpRdWVyeSdzIGJ1aWx0LWluIFwiaG92ZXJcIiBtZXRob2QgZXhjZXB0IHRoYXRcbiAqIGluc3RlYWQgb2YgZmlyaW5nIHRoZSBoYW5kbGVySW4gZnVuY3Rpb24gaW1tZWRpYXRlbHksIGhvdmVySW50ZW50IGNoZWNrc1xuICogdG8gc2VlIGlmIHRoZSB1c2VyJ3MgbW91c2UgaGFzIHNsb3dlZCBkb3duIChiZW5lYXRoIHRoZSBzZW5zaXRpdml0eVxuICogdGhyZXNob2xkKSBiZWZvcmUgZmlyaW5nIHRoZSBldmVudC4gVGhlIGhhbmRsZXJPdXQgZnVuY3Rpb24gaXMgb25seVxuICogY2FsbGVkIGFmdGVyIGEgbWF0Y2hpbmcgaGFuZGxlckluLlxuICpcbiAqIC8vIGJhc2ljIHVzYWdlIC4uLiBqdXN0IGxpa2UgLmhvdmVyKClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0IClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluT3V0IClcbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4gd2l0aCBldmVudCBkZWxlZ2F0aW9uIVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW4sIGhhbmRsZXJPdXQsIHNlbGVjdG9yIClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluT3V0LCBzZWxlY3RvciApXG4gKlxuICogLy8gdXNpbmcgYSBiYXNpYyBjb25maWd1cmF0aW9uIG9iamVjdFxuICogLmhvdmVySW50ZW50KCBjb25maWcgKVxuICpcbiAqIEBwYXJhbSAgaGFuZGxlckluICAgZnVuY3Rpb24gT1IgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAgaGFuZGxlck91dCAgZnVuY3Rpb24gT1Igc2VsZWN0b3IgZm9yIGRlbGVnYXRpb24gT1IgdW5kZWZpbmVkXG4gKiBAcGFyYW0gIHNlbGVjdG9yICAgIHNlbGVjdG9yIE9SIHVuZGVmaW5lZFxuICogQGF1dGhvciBCcmlhbiBDaGVybmUgPGJyaWFuKGF0KWNoZXJuZShkb3QpbmV0PlxuICovXG4oZnVuY3Rpb24oJCkge1xuICAgICQuZm4uaG92ZXJJbnRlbnQgPSBmdW5jdGlvbihoYW5kbGVySW4saGFuZGxlck91dCxzZWxlY3Rvcikge1xuXG4gICAgICAgIC8vIGRlZmF1bHQgY29uZmlndXJhdGlvbiB2YWx1ZXNcbiAgICAgICAgdmFyIGNmZyA9IHtcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAsXG4gICAgICAgICAgICBzZW5zaXRpdml0eTogNixcbiAgICAgICAgICAgIHRpbWVvdXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIHR5cGVvZiBoYW5kbGVySW4gPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIGhhbmRsZXJJbiApO1xuICAgICAgICB9IGVsc2UgaWYgKCQuaXNGdW5jdGlvbihoYW5kbGVyT3V0KSkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVyT3V0LCBzZWxlY3Rvcjogc2VsZWN0b3IgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVySW4sIHNlbGVjdG9yOiBoYW5kbGVyT3V0IH0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIHZhcmlhYmxlc1xuICAgICAgICAvLyBjWCwgY1kgPSBjdXJyZW50IFggYW5kIFkgcG9zaXRpb24gb2YgbW91c2UsIHVwZGF0ZWQgYnkgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgIC8vIHBYLCBwWSA9IHByZXZpb3VzIFggYW5kIFkgcG9zaXRpb24gb2YgbW91c2UsIHNldCBieSBtb3VzZW92ZXIgYW5kIHBvbGxpbmcgaW50ZXJ2YWxcbiAgICAgICAgdmFyIGNYLCBjWSwgcFgsIHBZO1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZ2V0dGluZyBtb3VzZSBwb3NpdGlvblxuICAgICAgICB2YXIgdHJhY2sgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgY1ggPSBldi5wYWdlWDtcbiAgICAgICAgICAgIGNZID0gZXYucGFnZVk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBjb21wYXJpbmcgY3VycmVudCBhbmQgcHJldmlvdXMgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIGNvbXBhcmUgPSBmdW5jdGlvbihldixvYikge1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTtcbiAgICAgICAgICAgIC8vIGNvbXBhcmUgbW91c2UgcG9zaXRpb25zIHRvIHNlZSBpZiB0aGV5J3ZlIGNyb3NzZWQgdGhlIHRocmVzaG9sZFxuICAgICAgICAgICAgaWYgKCBNYXRoLnNxcnQoIChwWC1jWCkqKHBYLWNYKSArIChwWS1jWSkqKHBZLWNZKSApIDwgY2ZnLnNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgICAgICAgICQob2IpLm9mZihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgaG92ZXJJbnRlbnQgc3RhdGUgdG8gdHJ1ZSAoc28gbW91c2VPdXQgY2FuIGJlIGNhbGxlZClcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2ZnLm92ZXIuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNldCBwcmV2aW91cyBjb29yZGluYXRlcyBmb3IgbmV4dCB0aW1lXG4gICAgICAgICAgICAgICAgcFggPSBjWDsgcFkgPSBjWTtcbiAgICAgICAgICAgICAgICAvLyB1c2Ugc2VsZi1jYWxsaW5nIHRpbWVvdXQsIGd1YXJhbnRlZXMgaW50ZXJ2YWxzIGFyZSBzcGFjZWQgb3V0IHByb3Blcmx5IChhdm9pZHMgSmF2YVNjcmlwdCB0aW1lciBidWdzKVxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsIG9iKTt9ICwgY2ZnLmludGVydmFsICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBkZWxheWluZyB0aGUgbW91c2VPdXQgZnVuY3Rpb25cbiAgICAgICAgdmFyIGRlbGF5ID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gY2ZnLm91dC5hcHBseShvYixbZXZdKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGhhbmRsaW5nIG1vdXNlICdob3ZlcmluZydcbiAgICAgICAgdmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgLy8gY29weSBvYmplY3RzIHRvIGJlIHBhc3NlZCBpbnRvIHQgKHJlcXVpcmVkIGZvciBldmVudCBvYmplY3QgdG8gYmUgcGFzc2VkIGluIElFKVxuICAgICAgICAgICAgdmFyIGV2ID0gJC5leHRlbmQoe30sZSk7XG4gICAgICAgICAgICB2YXIgb2IgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgaG92ZXJJbnRlbnQgdGltZXIgaWYgaXQgZXhpc3RzXG4gICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfdCkgeyBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpOyB9XG5cbiAgICAgICAgICAgIC8vIGlmIGUudHlwZSA9PT0gXCJtb3VzZWVudGVyXCJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2VlbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IFwicHJldmlvdXNcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIGluaXRpYWwgZW50cnkgcG9pbnRcbiAgICAgICAgICAgICAgICBwWCA9IGV2LnBhZ2VYOyBwWSA9IGV2LnBhZ2VZO1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBcImN1cnJlbnRcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIG1vdXNlbW92ZVxuICAgICAgICAgICAgICAgICQob2IpLm9uKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIHN0YXJ0IHBvbGxpbmcgaW50ZXJ2YWwgKHNlbGYtY2FsbGluZyB0aW1lb3V0KSB0byBjb21wYXJlIG1vdXNlIGNvb3JkaW5hdGVzIG92ZXIgdGltZVxuICAgICAgICAgICAgICAgIGlmICghb2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LG9iKTt9ICwgY2ZnLmludGVydmFsICk7fVxuXG4gICAgICAgICAgICAgICAgLy8gZWxzZSBlLnR5cGUgPT0gXCJtb3VzZWxlYXZlXCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdW5iaW5kIGV4cGVuc2l2ZSBtb3VzZW1vdmUgZXZlbnRcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gaWYgaG92ZXJJbnRlbnQgc3RhdGUgaXMgdHJ1ZSwgdGhlbiBjYWxsIHRoZSBtb3VzZU91dCBmdW5jdGlvbiBhZnRlciB0aGUgc3BlY2lmaWVkIGRlbGF5XG4gICAgICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7ZGVsYXkoZXYsb2IpO30gLCBjZmcudGltZW91dCApO31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBsaXN0ZW4gZm9yIG1vdXNlZW50ZXIgYW5kIG1vdXNlbGVhdmVcbiAgICAgICAgcmV0dXJuIHRoaXMub24oeydtb3VzZWVudGVyLmhvdmVySW50ZW50JzpoYW5kbGVIb3ZlciwnbW91c2VsZWF2ZS5ob3ZlckludGVudCc6aGFuZGxlSG92ZXJ9LCBjZmcuc2VsZWN0b3IpO1xuICAgIH07XG59KShqUXVlcnkpO1xuIiwiLyohXG4gKiBpbWFnZXNMb2FkZWQgUEFDS0FHRUQgdjMuMS44XG4gKiBKYXZhU2NyaXB0IGlzIGFsbCBsaWtlIFwiWW91IGltYWdlcyBhcmUgZG9uZSB5ZXQgb3Igd2hhdD9cIlxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fWZ1bmN0aW9uIHQoZSx0KXtmb3IodmFyIG49ZS5sZW5ndGg7bi0tOylpZihlW25dLmxpc3RlbmVyPT09dClyZXR1cm4gbjtyZXR1cm4tMX1mdW5jdGlvbiBuKGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0aGlzW2VdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19dmFyIGk9ZS5wcm90b3R5cGUscj10aGlzLG89ci5FdmVudEVtaXR0ZXI7aS5nZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt0PXt9O2ZvcihuIGluIGkpaS5oYXNPd25Qcm9wZXJ0eShuKSYmZS50ZXN0KG4pJiYodFtuXT1pW25dKX1lbHNlIHQ9aVtlXXx8KGlbZV09W10pO3JldHVybiB0fSxpLmZsYXR0ZW5MaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbj1bXTtmb3IodD0wO2UubGVuZ3RoPnQ7dCs9MSluLnB1c2goZVt0XS5saXN0ZW5lcik7cmV0dXJuIG59LGkuZ2V0TGlzdGVuZXJzQXNPYmplY3Q9ZnVuY3Rpb24oZSl7dmFyIHQsbj10aGlzLmdldExpc3RlbmVycyhlKTtyZXR1cm4gbiBpbnN0YW5jZW9mIEFycmF5JiYodD17fSx0W2VdPW4pLHR8fG59LGkuYWRkTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSksbz1cIm9iamVjdFwiPT10eXBlb2Ygbjtmb3IoaSBpbiByKXIuaGFzT3duUHJvcGVydHkoaSkmJi0xPT09dChyW2ldLG4pJiZyW2ldLnB1c2gobz9uOntsaXN0ZW5lcjpuLG9uY2U6ITF9KTtyZXR1cm4gdGhpc30saS5vbj1uKFwiYWRkTGlzdGVuZXJcIiksaS5hZGRPbmNlTGlzdGVuZXI9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihlLHtsaXN0ZW5lcjp0LG9uY2U6ITB9KX0saS5vbmNlPW4oXCJhZGRPbmNlTGlzdGVuZXJcIiksaS5kZWZpbmVFdmVudD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5nZXRMaXN0ZW5lcnMoZSksdGhpc30saS5kZWZpbmVFdmVudHM9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PTA7ZS5sZW5ndGg+dDt0Kz0xKXRoaXMuZGVmaW5lRXZlbnQoZVt0XSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyLG89dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKTtmb3IociBpbiBvKW8uaGFzT3duUHJvcGVydHkocikmJihpPXQob1tyXSxuKSwtMSE9PWkmJm9bcl0uc3BsaWNlKGksMSkpO3JldHVybiB0aGlzfSxpLm9mZj1uKFwicmVtb3ZlTGlzdGVuZXJcIiksaS5hZGRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKCExLGUsdCl9LGkucmVtb3ZlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMCxlLHQpfSxpLm1hbmlwdWxhdGVMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0LG4pe3ZhciBpLHIsbz1lP3RoaXMucmVtb3ZlTGlzdGVuZXI6dGhpcy5hZGRMaXN0ZW5lcixzPWU/dGhpcy5yZW1vdmVMaXN0ZW5lcnM6dGhpcy5hZGRMaXN0ZW5lcnM7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHR8fHQgaW5zdGFuY2VvZiBSZWdFeHApZm9yKGk9bi5sZW5ndGg7aS0tOylvLmNhbGwodGhpcyx0LG5baV0pO2Vsc2UgZm9yKGkgaW4gdCl0Lmhhc093blByb3BlcnR5KGkpJiYocj10W2ldKSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHI/by5jYWxsKHRoaXMsaSxyKTpzLmNhbGwodGhpcyxpLHIpKTtyZXR1cm4gdGhpc30saS5yZW1vdmVFdmVudD1mdW5jdGlvbihlKXt2YXIgdCxuPXR5cGVvZiBlLGk9dGhpcy5fZ2V0RXZlbnRzKCk7aWYoXCJzdHJpbmdcIj09PW4pZGVsZXRlIGlbZV07ZWxzZSBpZihcIm9iamVjdFwiPT09bilmb3IodCBpbiBpKWkuaGFzT3duUHJvcGVydHkodCkmJmUudGVzdCh0KSYmZGVsZXRlIGlbdF07ZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzO3JldHVybiB0aGlzfSxpLnJlbW92ZUFsbExpc3RlbmVycz1uKFwicmVtb3ZlRXZlbnRcIiksaS5lbWl0RXZlbnQ9ZnVuY3Rpb24oZSx0KXt2YXIgbixpLHIsbyxzPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gcylpZihzLmhhc093blByb3BlcnR5KHIpKWZvcihpPXNbcl0ubGVuZ3RoO2ktLTspbj1zW3JdW2ldLG4ub25jZT09PSEwJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKGUsbi5saXN0ZW5lciksbz1uLmxpc3RlbmVyLmFwcGx5KHRoaXMsdHx8W10pLG89PT10aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpO3JldHVybiB0aGlzfSxpLnRyaWdnZXI9bihcImVtaXRFdmVudFwiKSxpLmVtaXQ9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiB0aGlzLmVtaXRFdmVudChlLHQpfSxpLnNldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlPWUsdGhpc30saS5fZ2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoXCJfb25jZVJldHVyblZhbHVlXCIpP3RoaXMuX29uY2VSZXR1cm5WYWx1ZTohMH0saS5fZ2V0RXZlbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz17fSl9LGUubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLkV2ZW50RW1pdHRlcj1vLGV9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gZX0pOlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWU6dGhpcy5FdmVudEVtaXR0ZXI9ZX0pLmNhbGwodGhpcyksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2YXIgbj1lLmV2ZW50O3JldHVybiBuLnRhcmdldD1uLnRhcmdldHx8bi5zcmNFbGVtZW50fHx0LG59dmFyIG49ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LGk9ZnVuY3Rpb24oKXt9O24uYWRkRXZlbnRMaXN0ZW5lcj9pPWZ1bmN0aW9uKGUsdCxuKXtlLmFkZEV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5hdHRhY2hFdmVudCYmKGk9ZnVuY3Rpb24oZSxuLGkpe2VbbitpXT1pLmhhbmRsZUV2ZW50P2Z1bmN0aW9uKCl7dmFyIG49dChlKTtpLmhhbmRsZUV2ZW50LmNhbGwoaSxuKX06ZnVuY3Rpb24oKXt2YXIgbj10KGUpO2kuY2FsbChlLG4pfSxlLmF0dGFjaEV2ZW50KFwib25cIituLGVbbitpXSl9KTt2YXIgcj1mdW5jdGlvbigpe307bi5yZW1vdmVFdmVudExpc3RlbmVyP3I9ZnVuY3Rpb24oZSx0LG4pe2UucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpuLmRldGFjaEV2ZW50JiYocj1mdW5jdGlvbihlLHQsbil7ZS5kZXRhY2hFdmVudChcIm9uXCIrdCxlW3Qrbl0pO3RyeXtkZWxldGUgZVt0K25dfWNhdGNoKGkpe2VbdCtuXT12b2lkIDB9fSk7dmFyIG89e2JpbmQ6aSx1bmJpbmQ6cn07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImV2ZW50aWUvZXZlbnRpZVwiLG8pOmUuZXZlbnRpZT1vfSh0aGlzKSxmdW5jdGlvbihlLHQpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFwiZXZlbnRpZS9ldmVudGllXCJdLGZ1bmN0aW9uKG4saSl7cmV0dXJuIHQoZSxuLGkpfSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9dChlLHJlcXVpcmUoXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiKSxyZXF1aXJlKFwiZXZlbnRpZVwiKSk6ZS5pbWFnZXNMb2FkZWQ9dChlLGUuRXZlbnRFbWl0dGVyLGUuZXZlbnRpZSl9KHdpbmRvdyxmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gaShlLHQpe2Zvcih2YXIgbiBpbiB0KWVbbl09dFtuXTtyZXR1cm4gZX1mdW5jdGlvbiByKGUpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PWQuY2FsbChlKX1mdW5jdGlvbiBvKGUpe3ZhciB0PVtdO2lmKHIoZSkpdD1lO2Vsc2UgaWYoXCJudW1iZXJcIj09dHlwZW9mIGUubGVuZ3RoKWZvcih2YXIgbj0wLGk9ZS5sZW5ndGg7aT5uO24rKyl0LnB1c2goZVtuXSk7ZWxzZSB0LnB1c2goZSk7cmV0dXJuIHR9ZnVuY3Rpb24gcyhlLHQsbil7aWYoISh0aGlzIGluc3RhbmNlb2YgcykpcmV0dXJuIG5ldyBzKGUsdCk7XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZSkpLHRoaXMuZWxlbWVudHM9byhlKSx0aGlzLm9wdGlvbnM9aSh7fSx0aGlzLm9wdGlvbnMpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/bj10OmkodGhpcy5vcHRpb25zLHQpLG4mJnRoaXMub24oXCJhbHdheXNcIixuKSx0aGlzLmdldEltYWdlcygpLGEmJih0aGlzLmpxRGVmZXJyZWQ9bmV3IGEuRGVmZXJyZWQpO3ZhciByPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3IuY2hlY2soKX0pfWZ1bmN0aW9uIGYoZSl7dGhpcy5pbWc9ZX1mdW5jdGlvbiBjKGUpe3RoaXMuc3JjPWUsdltlXT10aGlzfXZhciBhPWUualF1ZXJ5LHU9ZS5jb25zb2xlLGg9dSE9PXZvaWQgMCxkPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7cy5wcm90b3R5cGU9bmV3IHQscy5wcm90b3R5cGUub3B0aW9ucz17fSxzLnByb3RvdHlwZS5nZXRJbWFnZXM9ZnVuY3Rpb24oKXt0aGlzLmltYWdlcz1bXTtmb3IodmFyIGU9MCx0PXRoaXMuZWxlbWVudHMubGVuZ3RoO3Q+ZTtlKyspe3ZhciBuPXRoaXMuZWxlbWVudHNbZV07XCJJTUdcIj09PW4ubm9kZU5hbWUmJnRoaXMuYWRkSW1hZ2Uobik7dmFyIGk9bi5ub2RlVHlwZTtpZihpJiYoMT09PWl8fDk9PT1pfHwxMT09PWkpKWZvcih2YXIgcj1uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIiksbz0wLHM9ci5sZW5ndGg7cz5vO28rKyl7dmFyIGY9cltvXTt0aGlzLmFkZEltYWdlKGYpfX19LHMucHJvdG90eXBlLmFkZEltYWdlPWZ1bmN0aW9uKGUpe3ZhciB0PW5ldyBmKGUpO3RoaXMuaW1hZ2VzLnB1c2godCl9LHMucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHIpe3JldHVybiB0Lm9wdGlvbnMuZGVidWcmJmgmJnUubG9nKFwiY29uZmlybVwiLGUsciksdC5wcm9ncmVzcyhlKSxuKyssbj09PWkmJnQuY29tcGxldGUoKSwhMH12YXIgdD10aGlzLG49MCxpPXRoaXMuaW1hZ2VzLmxlbmd0aDtpZih0aGlzLmhhc0FueUJyb2tlbj0hMSwhaSlyZXR1cm4gdGhpcy5jb21wbGV0ZSgpLHZvaWQgMDtmb3IodmFyIHI9MDtpPnI7cisrKXt2YXIgbz10aGlzLmltYWdlc1tyXTtvLm9uKFwiY29uZmlybVwiLGUpLG8uY2hlY2soKX19LHMucHJvdG90eXBlLnByb2dyZXNzPWZ1bmN0aW9uKGUpe3RoaXMuaGFzQW55QnJva2VuPXRoaXMuaGFzQW55QnJva2VufHwhZS5pc0xvYWRlZDt2YXIgdD10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmVtaXQoXCJwcm9ncmVzc1wiLHQsZSksdC5qcURlZmVycmVkJiZ0LmpxRGVmZXJyZWQubm90aWZ5JiZ0LmpxRGVmZXJyZWQubm90aWZ5KHQsZSl9KX0scy5wcm90b3R5cGUuY29tcGxldGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmhhc0FueUJyb2tlbj9cImZhaWxcIjpcImRvbmVcIjt0aGlzLmlzQ29tcGxldGU9ITA7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aWYodC5lbWl0KGUsdCksdC5lbWl0KFwiYWx3YXlzXCIsdCksdC5qcURlZmVycmVkKXt2YXIgbj10Lmhhc0FueUJyb2tlbj9cInJlamVjdFwiOlwicmVzb2x2ZVwiO3QuanFEZWZlcnJlZFtuXSh0KX19KX0sYSYmKGEuZm4uaW1hZ2VzTG9hZGVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49bmV3IHModGhpcyxlLHQpO3JldHVybiBuLmpxRGVmZXJyZWQucHJvbWlzZShhKHRoaXMpKX0pLGYucHJvdG90eXBlPW5ldyB0LGYucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7dmFyIGU9dlt0aGlzLmltZy5zcmNdfHxuZXcgYyh0aGlzLmltZy5zcmMpO2lmKGUuaXNDb25maXJtZWQpcmV0dXJuIHRoaXMuY29uZmlybShlLmlzTG9hZGVkLFwiY2FjaGVkIHdhcyBjb25maXJtZWRcIiksdm9pZCAwO2lmKHRoaXMuaW1nLmNvbXBsZXRlJiZ2b2lkIDAhPT10aGlzLmltZy5uYXR1cmFsV2lkdGgpcmV0dXJuIHRoaXMuY29uZmlybSgwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoLFwibmF0dXJhbFdpZHRoXCIpLHZvaWQgMDt2YXIgdD10aGlzO2Uub24oXCJjb25maXJtXCIsZnVuY3Rpb24oZSxuKXtyZXR1cm4gdC5jb25maXJtKGUuaXNMb2FkZWQsbiksITB9KSxlLmNoZWNrKCl9LGYucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzTG9hZGVkPWUsdGhpcy5lbWl0KFwiY29uZmlybVwiLHRoaXMsdCl9O3ZhciB2PXt9O3JldHVybiBjLnByb3RvdHlwZT1uZXcgdCxjLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2lmKCF0aGlzLmlzQ2hlY2tlZCl7dmFyIGU9bmV3IEltYWdlO24uYmluZChlLFwibG9hZFwiLHRoaXMpLG4uYmluZChlLFwiZXJyb3JcIix0aGlzKSxlLnNyYz10aGlzLnNyYyx0aGlzLmlzQ2hlY2tlZD0hMH19LGMucHJvdG90eXBlLmhhbmRsZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciB0PVwib25cIitlLnR5cGU7dGhpc1t0XSYmdGhpc1t0XShlKX0sYy5wcm90b3R5cGUub25sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMCxcIm9ubG9hZFwiKSx0aGlzLnVuYmluZFByb3h5RXZlbnRzKGUpfSxjLnByb3RvdHlwZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMSxcIm9uZXJyb3JcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUuY29uZmlybT1mdW5jdGlvbihlLHQpe3RoaXMuaXNDb25maXJtZWQ9ITAsdGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfSxjLnByb3RvdHlwZS51bmJpbmRQcm94eUV2ZW50cz1mdW5jdGlvbihlKXtuLnVuYmluZChlLnRhcmdldCxcImxvYWRcIix0aGlzKSxuLnVuYmluZChlLnRhcmdldCxcImVycm9yXCIsdGhpcyl9LHN9KTsiLCIvKiFcbiAqIGpRdWVyeSBQbGFjZWhvbGRlciBQbHVnaW4gdjIuMS4zXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9qcXVlcnktcGxhY2Vob2xkZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgMjAxNSBNYXRoaWFzIEJ5bmVuc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgICB9XG59KGZ1bmN0aW9uKCQpIHtcblxuICAgIC8vIE9wZXJhIE1pbmkgdjcgZG9lc24ndCBzdXBwb3J0IHBsYWNlaG9sZGVyIGFsdGhvdWdoIGl0cyBET00gc2VlbXMgdG8gaW5kaWNhdGUgc29cbiAgICB2YXIgaXNPcGVyYU1pbmkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwod2luZG93Lm9wZXJhbWluaSkgPT09ICdbb2JqZWN0IE9wZXJhTWluaV0nO1xuICAgIHZhciBpc0lucHV0U3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpICYmICFpc09wZXJhTWluaTtcbiAgICB2YXIgaXNUZXh0YXJlYVN1cHBvcnRlZCA9ICdwbGFjZWhvbGRlcicgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKSAmJiAhaXNPcGVyYU1pbmk7XG4gICAgdmFyIHZhbEhvb2tzID0gJC52YWxIb29rcztcbiAgICB2YXIgcHJvcEhvb2tzID0gJC5wcm9wSG9va3M7XG4gICAgdmFyIGhvb2tzO1xuICAgIHZhciBwbGFjZWhvbGRlcjtcbiAgICB2YXIgc2V0dGluZ3MgPSB7fTtcblxuICAgIGlmIChpc0lucHV0U3VwcG9ydGVkICYmIGlzVGV4dGFyZWFTdXBwb3J0ZWQpIHtcblxuICAgICAgICBwbGFjZWhvbGRlciA9ICQuZm4ucGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBsYWNlaG9sZGVyLmlucHV0ID0gdHJ1ZTtcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dGFyZWEgPSB0cnVlO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBwbGFjZWhvbGRlciA9ICQuZm4ucGxhY2Vob2xkZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIHZhciBkZWZhdWx0cyA9IHtjdXN0b21DbGFzczogJ3BsYWNlaG9sZGVyJ307XG4gICAgICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlcigoaXNJbnB1dFN1cHBvcnRlZCA/ICd0ZXh0YXJlYScgOiAnOmlucHV0JykgKyAnW3BsYWNlaG9sZGVyXScpXG4gICAgICAgICAgICAgICAgLm5vdCgnLicrc2V0dGluZ3MuY3VzdG9tQ2xhc3MpXG4gICAgICAgICAgICAgICAgLmJpbmQoe1xuICAgICAgICAgICAgICAgICAgICAnZm9jdXMucGxhY2Vob2xkZXInOiBjbGVhclBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAnYmx1ci5wbGFjZWhvbGRlcic6IHNldFBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcsIHRydWUpXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2JsdXIucGxhY2Vob2xkZXInKTtcbiAgICAgICAgfTtcblxuICAgICAgICBwbGFjZWhvbGRlci5pbnB1dCA9IGlzSW5wdXRTdXBwb3J0ZWQ7XG4gICAgICAgIHBsYWNlaG9sZGVyLnRleHRhcmVhID0gaXNUZXh0YXJlYVN1cHBvcnRlZDtcblxuICAgICAgICBob29rcyA9IHtcbiAgICAgICAgICAgICdnZXQnOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHBhc3N3b3JkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXNzd29yZElucHV0WzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJykgJiYgJGVsZW1lbnQuaGFzQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpID8gJycgOiBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzZXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB2YXIgJHJlcGxhY2VtZW50O1xuICAgICAgICAgICAgICAgIHZhciAkcGFzc3dvcmRJbnB1dDtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcblxuICAgICAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgJHBhc3N3b3JkSW5wdXQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkcmVwbGFjZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyUGxhY2Vob2xkZXIuY2FsbCgkcmVwbGFjZW1lbnRbMF0sIHRydWUsIHZhbHVlKSB8fCAoZWxlbWVudC52YWx1ZSA9IHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudFswXS52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHBhc3N3b3JkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyUGxhY2Vob2xkZXIuY2FsbChlbGVtZW50LCB0cnVlLCB2YWx1ZSkgfHwgKCRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0dGluZyB0aGUgcGxhY2Vob2xkZXIgY2F1c2VzIHByb2JsZW1zIGlmIHRoZSBlbGVtZW50IGNvbnRpbnVlcyB0byBoYXZlIGZvY3VzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCAhPSBzYWZlQWN0aXZlRWxlbWVudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW4ndCB1c2UgYHRyaWdnZXJIYW5kbGVyYCBoZXJlIGJlY2F1c2Ugb2YgZHVtbXkgdGV4dC9wYXNzd29yZCBpbnB1dHMgOihcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQuaGFzQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGBzZXRgIGNhbiBub3QgcmV0dXJuIGB1bmRlZmluZWRgOyBzZWUgaHR0cDovL2pzYXBpLmluZm8vanF1ZXJ5LzEuNy4xL3ZhbCNMMjM2M1xuICAgICAgICAgICAgICAgIHJldHVybiAkZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWlzSW5wdXRTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHZhbEhvb2tzLmlucHV0ID0gaG9va3M7XG4gICAgICAgICAgICBwcm9wSG9va3MudmFsdWUgPSBob29rcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNUZXh0YXJlYVN1cHBvcnRlZCkge1xuICAgICAgICAgICAgdmFsSG9va3MudGV4dGFyZWEgPSBob29rcztcbiAgICAgICAgICAgIHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xuICAgICAgICB9XG5cbiAgICAgICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIExvb2sgZm9yIGZvcm1zXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5kZWxlZ2F0ZSgnZm9ybScsICdzdWJtaXQucGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgcGxhY2Vob2xkZXIgdmFsdWVzIHNvIHRoZXkgZG9uJ3QgZ2V0IHN1Ym1pdHRlZFxuICAgICAgICAgICAgICAgIHZhciAkaW5wdXRzID0gJCgnLicrc2V0dGluZ3MuY3VzdG9tQ2xhc3MsIHRoaXMpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyUGxhY2Vob2xkZXIuY2FsbCh0aGlzLCB0cnVlLCAnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXRzLmVhY2goc2V0UGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDbGVhciBwbGFjZWhvbGRlciB2YWx1ZXMgdXBvbiBwYWdlIHJlbG9hZFxuICAgICAgICAkKHdpbmRvdykuYmluZCgnYmVmb3JldW5sb2FkLnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcuJytzZXR0aW5ncy5jdXN0b21DbGFzcykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXJncyhlbGVtKSB7XG4gICAgICAgIC8vIFJldHVybiBhbiBvYmplY3Qgb2YgZWxlbWVudCBhdHRyaWJ1dGVzXG4gICAgICAgIHZhciBuZXdBdHRycyA9IHt9O1xuICAgICAgICB2YXIgcmlubGluZWpRdWVyeSA9IC9ealF1ZXJ5XFxkKyQvO1xuXG4gICAgICAgICQuZWFjaChlbGVtLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGksIGF0dHIpIHtcbiAgICAgICAgICAgIGlmIChhdHRyLnNwZWNpZmllZCAmJiAhcmlubGluZWpRdWVyeS50ZXN0KGF0dHIubmFtZSkpIHtcbiAgICAgICAgICAgICAgICBuZXdBdHRyc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0F0dHJzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyUGxhY2Vob2xkZXIoZXZlbnQsIHZhbHVlKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICB2YXIgJGlucHV0ID0gJChpbnB1dCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaW5wdXQudmFsdWUgPT09ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpICYmICRpbnB1dC5oYXNDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcykpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICRpbnB1dC5yZW1vdmVDbGFzcyhzZXR0aW5ncy5jdXN0b21DbGFzcyk7XG5cbiAgICAgICAgICAgIGlmICgkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKSkge1xuXG4gICAgICAgICAgICAgICAgJGlucHV0ID0gJGlucHV0LmhpZGUoKS5uZXh0QWxsKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl06Zmlyc3QnKS5zaG93KCkuYXR0cignaWQnLCAkaW5wdXQucmVtb3ZlQXR0cignaWQnKS5kYXRhKCdwbGFjZWhvbGRlci1pZCcpKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiBgY2xlYXJQbGFjZWhvbGRlcmAgd2FzIGNhbGxlZCBmcm9tIGAkLnZhbEhvb2tzLmlucHV0LnNldGBcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRpbnB1dC5mb2N1cygpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgaW5wdXQuc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRQbGFjZWhvbGRlcihldmVudCkge1xuICAgICAgICB2YXIgJHJlcGxhY2VtZW50O1xuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICB2YXIgJGlucHV0ID0gJChpbnB1dCk7XG4gICAgICAgIHZhciBpZCA9IGlucHV0LmlkO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGFjZWhvbGRlciBpcyBhY3RpdmF0ZWQsIHRyaWdnZXJpbmcgYmx1ciBldmVudCAoYCRpbnB1dC50cmlnZ2VyKCdibHVyJylgKSBzaG91bGQgZG8gbm90aGluZy5cbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT09ICdibHVyJykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJGlucHV0Lmhhc0NsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICAkcmVwbGFjZW1lbnQgPSAkaW5wdXQucHJldkFsbCgnaW5wdXRbdHlwZT1cInRleHRcIl06Zmlyc3QnKTtcbiAgICAgICAgICAgICAgICBpZiAoJHJlcGxhY2VtZW50Lmxlbmd0aCA+IDAgJiYgJHJlcGxhY2VtZW50LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5wdXQudmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgICAgIGlmICghJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXRleHRpbnB1dCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50ID0gJGlucHV0LmNsb25lKCkucHJvcCh7ICd0eXBlJzogJ3RleHQnIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXBsYWNlbWVudCA9ICQoJzxpbnB1dD4nKS5hdHRyKCQuZXh0ZW5kKGFyZ3ModGhpcyksIHsgJ3R5cGUnOiAndGV4dCcgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHJlcGxhY2VtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignbmFtZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BsYWNlaG9sZGVyLWVuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZWhvbGRlci1wYXNzd29yZCc6ICRpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2Vob2xkZXItaWQnOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kKCdmb2N1cy5wbGFjZWhvbGRlcicsIGNsZWFyUGxhY2Vob2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZWhvbGRlci10ZXh0aW5wdXQnOiAkcmVwbGFjZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BsYWNlaG9sZGVyLWlkJzogaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmVmb3JlKCRyZXBsYWNlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAkaW5wdXQgPSAkaW5wdXQucmVtb3ZlQXR0cignaWQnKS5oaWRlKCkucHJldkFsbCgnaW5wdXRbdHlwZT1cInRleHRcIl06Zmlyc3QnKS5hdHRyKCdpZCcsICRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1pZCcpKS5zaG93KCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyICRwYXNzd29yZElucHV0ID0gJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHBhc3N3b3JkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBhc3N3b3JkSW5wdXRbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LmF0dHIoJ2lkJywgJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpLnNob3coKS5uZXh0QWxsKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl06bGFzdCcpLmhpZGUoKS5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGlucHV0LmFkZENsYXNzKHNldHRpbmdzLmN1c3RvbUNsYXNzKTtcbiAgICAgICAgICAgICRpbnB1dFswXS52YWx1ZSA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkaW5wdXQucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuY3VzdG9tQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XG4gICAgICAgIC8vIEF2b2lkIElFOSBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgb2YgZGVhdGhcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHt9XG4gICAgfVxufSkpO1xuIiwiLyoqXG4qIGpxdWVyeS5tYXRjaEhlaWdodC5qcyBtYXN0ZXJcbiogaHR0cDovL2JybS5pby9qcXVlcnktbWF0Y2gtaGVpZ2h0L1xuKiBMaWNlbnNlOiBNSVRcbiovXG5cbjsoZnVuY3Rpb24oJCkge1xuICAgIC8qXG4gICAgKiAgaW50ZXJuYWxcbiAgICAqL1xuXG4gICAgdmFyIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gLTEsXG4gICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XG5cbiAgICAvKlxuICAgICogIF9wYXJzZVxuICAgICogIHZhbHVlIHBhcnNlIHV0aWxpdHkgZnVuY3Rpb25cbiAgICAqL1xuXG4gICAgdmFyIF9wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIHBhcnNlIHZhbHVlIGFuZCBjb252ZXJ0IE5hTiB0byAwXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIF9yb3dzXG4gICAgKiAgdXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIGFycmF5IG9mIGpRdWVyeSBzZWxlY3Rpb25zIHJlcHJlc2VudGluZyBlYWNoIHJvd1xuICAgICogIChhcyBkaXNwbGF5ZWQgYWZ0ZXIgZmxvYXQgd3JhcHBpbmcgYXBwbGllZCBieSBicm93c2VyKVxuICAgICovXG5cbiAgICB2YXIgX3Jvd3MgPSBmdW5jdGlvbihlbGVtZW50cykge1xuICAgICAgICB2YXIgdG9sZXJhbmNlID0gMSxcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxuICAgICAgICAgICAgbGFzdFRvcCA9IG51bGwsXG4gICAgICAgICAgICByb3dzID0gW107XG5cbiAgICAgICAgLy8gZ3JvdXAgZWxlbWVudHMgYnkgdGhlaXIgdG9wIHBvc2l0aW9uXG4gICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRvcCA9ICR0aGF0Lm9mZnNldCgpLnRvcCAtIF9wYXJzZSgkdGhhdC5jc3MoJ21hcmdpbi10b3AnKSksXG4gICAgICAgICAgICAgICAgbGFzdFJvdyA9IHJvd3MubGVuZ3RoID4gMCA/IHJvd3Nbcm93cy5sZW5ndGggLSAxXSA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChsYXN0Um93ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gZmlyc3QgaXRlbSBvbiB0aGUgcm93LCBzbyBqdXN0IHB1c2ggaXRcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goJHRoYXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm93IHRvcCBpcyB0aGUgc2FtZSwgYWRkIHRvIHRoZSByb3cgZ3JvdXBcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLmFicyhsYXN0VG9wIC0gdG9wKSkgPD0gdG9sZXJhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXSA9IGxhc3RSb3cuYWRkKCR0aGF0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2Ugc3RhcnQgYSBuZXcgcm93IGdyb3VwXG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHJvdyB0b3BcbiAgICAgICAgICAgIGxhc3RUb3AgPSB0b3A7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByb3dzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIF9wYXJzZU9wdGlvbnNcbiAgICAqICBoYW5kbGUgcGx1Z2luIG9wdGlvbnNcbiAgICAqL1xuXG4gICAgdmFyIF9wYXJzZU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgYnlSb3c6IHRydWUsXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2hlaWdodCcsXG4gICAgICAgICAgICB0YXJnZXQ6IG51bGwsXG4gICAgICAgICAgICByZW1vdmU6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKG9wdHMsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIG9wdHMuYnlSb3cgPSBvcHRpb25zO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09ICdyZW1vdmUnKSB7XG4gICAgICAgICAgICBvcHRzLnJlbW92ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0cztcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBtYXRjaEhlaWdodFxuICAgICogIHBsdWdpbiBkZWZpbml0aW9uXG4gICAgKi9cblxuICAgIHZhciBtYXRjaEhlaWdodCA9ICQuZm4ubWF0Y2hIZWlnaHQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKTtcblxuICAgICAgICAvLyBoYW5kbGUgcmVtb3ZlXG4gICAgICAgIGlmIChvcHRzLnJlbW92ZSkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgZml4ZWQgaGVpZ2h0IGZyb20gYWxsIHNlbGVjdGVkIGVsZW1lbnRzXG4gICAgICAgICAgICB0aGlzLmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBzZWxlY3RlZCBlbGVtZW50cyBmcm9tIGFsbCBncm91cHNcbiAgICAgICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbihrZXksIGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXAuZWxlbWVudHMgPSBncm91cC5lbGVtZW50cy5ub3QodGhhdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW51cCBlbXB0eSBncm91cHNcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gMSAmJiAhb3B0cy50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGlzIGdyb3VwIHNvIHdlIGNhbiByZS1hcHBseSBsYXRlciBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9ncm91cHMucHVzaCh7XG4gICAgICAgICAgICBlbGVtZW50czogdGhpcyxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdHNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbWF0Y2ggZWFjaCBlbGVtZW50J3MgaGVpZ2h0IHRvIHRoZSB0YWxsZXN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvblxuICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcywgb3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgcGx1Z2luIGdsb2JhbCBvcHRpb25zXG4gICAgKi9cblxuICAgIG1hdGNoSGVpZ2h0Ll9ncm91cHMgPSBbXTtcbiAgICBtYXRjaEhlaWdodC5fdGhyb3R0bGUgPSA4MDtcbiAgICBtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSBmYWxzZTtcbiAgICBtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlID0gbnVsbDtcbiAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUgPSBudWxsO1xuXG4gICAgLypcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlcbiAgICAqICBhcHBseSBtYXRjaEhlaWdodCB0byBnaXZlbiBlbGVtZW50c1xuICAgICovXG5cbiAgICBtYXRjaEhlaWdodC5fYXBwbHkgPSBmdW5jdGlvbihlbGVtZW50cywgb3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0cyA9IF9wYXJzZU9wdGlvbnMob3B0aW9ucyksXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcbiAgICAgICAgICAgIHJvd3MgPSBbJGVsZW1lbnRzXTtcblxuICAgICAgICAvLyB0YWtlIG5vdGUgb2Ygc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICBodG1sSGVpZ2h0ID0gJCgnaHRtbCcpLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgICAgIC8vIGdldCBoaWRkZW4gcGFyZW50c1xuICAgICAgICB2YXIgJGhpZGRlblBhcmVudHMgPSAkZWxlbWVudHMucGFyZW50cygpLmZpbHRlcignOmhpZGRlbicpO1xuXG4gICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0ZW1wb3JhcmlseSBtdXN0IGZvcmNlIGhpZGRlbiBwYXJlbnRzIHZpc2libGVcbiAgICAgICAgJGhpZGRlblBhcmVudHMuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICAgLy8gZ2V0IHJvd3MgaWYgdXNpbmcgYnlSb3csIG90aGVyd2lzZSBhc3N1bWUgb25lIHJvd1xuICAgICAgICBpZiAob3B0cy5ieVJvdyAmJiAhb3B0cy50YXJnZXQpIHtcblxuICAgICAgICAgICAgLy8gbXVzdCBmaXJzdCBmb3JjZSBhbiBhcmJpdHJhcnkgZXF1YWwgaGVpZ2h0IHNvIGZsb2F0aW5nIGVsZW1lbnRzIGJyZWFrIGV2ZW5seVxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpO1xuXG4gICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJpbHkgZm9yY2UgYSB1c2FibGUgZGlzcGxheSB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5ICE9PSAnaW5saW5lLWJsb2NrJyAmJiBkaXNwbGF5ICE9PSAnaW5saW5lLWZsZXgnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xuXG4gICAgICAgICAgICAgICAgJHRoYXQuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiBkaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy10b3AnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdtYXJnaW4tYm90dG9tJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLXRvcC13aWR0aCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1ib3R0b20td2lkdGgnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwcHgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBhcnJheSBvZiByb3dzIChiYXNlZCBvbiBlbGVtZW50IHRvcCBwb3NpdGlvbilcbiAgICAgICAgICAgIHJvd3MgPSBfcm93cygkZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAvLyByZXZlcnQgb3JpZ2luYWwgaW5saW5lIHN0eWxlc1xuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAkdGhhdC5hdHRyKCdzdHlsZScsICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJykgfHwgJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkLmVhY2gocm93cywgZnVuY3Rpb24oa2V5LCByb3cpIHtcbiAgICAgICAgICAgIHZhciAkcm93ID0gJChyb3cpLFxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IDA7XG5cbiAgICAgICAgICAgIGlmICghb3B0cy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAvLyBza2lwIGFwcGx5IHRvIHJvd3Mgd2l0aCBvbmx5IG9uZSBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgJHJvdy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkcm93LmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGZpbmQgdGhlIG1heCBoZWlnaHRcbiAgICAgICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAkdGhhdC5jc3MoJ2Rpc3BsYXknKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcmlseSBmb3JjZSBhIHVzYWJsZSBkaXNwbGF5IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5ICE9PSAnaW5saW5lLWJsb2NrJyAmJiBkaXNwbGF5ICE9PSAnaW5saW5lLWZsZXgnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB3ZSBnZXQgdGhlIGNvcnJlY3QgYWN0dWFsIGhlaWdodCAoYW5kIG5vdCBhIHByZXZpb3VzbHkgc2V0IGhlaWdodCB2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNzcyA9IHsgJ2Rpc3BsYXknOiBkaXNwbGF5IH07XG4gICAgICAgICAgICAgICAgICAgIGNzc1tvcHRzLnByb3BlcnR5XSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoY3NzKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBtYXggaGVpZ2h0IChpbmNsdWRpbmcgcGFkZGluZywgYnV0IG5vdCBtYXJnaW4pXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhhdC5vdXRlckhlaWdodChmYWxzZSkgPiB0YXJnZXRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9ICR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVydCBkaXNwbGF5IGJsb2NrXG4gICAgICAgICAgICAgICAgICAgICR0aGF0LmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGFyZ2V0IHNldCwgdXNlIHRoZSBoZWlnaHQgb2YgdGhlIHRhcmdldCBlbGVtZW50XG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gb3B0cy50YXJnZXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGFwcGx5IHRoZSBoZWlnaHQgdG8gYWxsIGVsZW1lbnRzXG4gICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYXBwbHkgdG8gYSB0YXJnZXRcbiAgICAgICAgICAgICAgICBpZiAob3B0cy50YXJnZXQgJiYgJHRoYXQuaXMob3B0cy50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgcGFkZGluZyBhbmQgYm9yZGVyIGNvcnJlY3RseSAocmVxdWlyZWQgd2hlbiBub3QgdXNpbmcgYm9yZGVyLWJveClcbiAgICAgICAgICAgICAgICBpZiAoJHRoYXQuY3NzKCdib3gtc2l6aW5nJykgIT09ICdib3JkZXItYm94Jykge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgKz0gX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLXRvcC13aWR0aCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKSk7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLXRvcCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgaGVpZ2h0IChhY2NvdW50aW5nIGZvciBwYWRkaW5nIGFuZCBib3JkZXIpXG4gICAgICAgICAgICAgICAgJHRoYXQuY3NzKG9wdHMucHJvcGVydHksICh0YXJnZXRIZWlnaHQgLSB2ZXJ0aWNhbFBhZGRpbmcpICsgJ3B4Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV2ZXJ0IGhpZGRlbiBwYXJlbnRzXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8IG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXN0b3JlIHNjcm9sbCBwb3NpdGlvbiBpZiBlbmFibGVkXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwpIHtcbiAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoKHNjcm9sbFRvcCAvIGh0bWxIZWlnaHQpICogJCgnaHRtbCcpLm91dGVySGVpZ2h0KHRydWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGlcbiAgICAqICBhcHBsaWVzIG1hdGNoSGVpZ2h0IHRvIGFsbCBlbGVtZW50cyB3aXRoIGEgZGF0YS1tYXRjaC1oZWlnaHQgYXR0cmlidXRlXG4gICAgKi9cblxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGdyb3VwcyA9IHt9O1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIGdyb3VwcyBieSB0aGVpciBncm91cElkIHNldCBieSBlbGVtZW50cyB1c2luZyBkYXRhLW1hdGNoLWhlaWdodFxuICAgICAgICAkKCdbZGF0YS1tYXRjaC1oZWlnaHRdLCBbZGF0YS1taF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBncm91cElkID0gJHRoaXMuYXR0cignZGF0YS1taCcpIHx8ICR0aGlzLmF0dHIoJ2RhdGEtbWF0Y2gtaGVpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGlmIChncm91cElkIGluIGdyb3Vwcykge1xuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9IGdyb3Vwc1tncm91cElkXS5hZGQoJHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBJZF0gPSAkdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZWFjaCBncm91cFxuICAgICAgICAkLmVhY2goZ3JvdXBzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMubWF0Y2hIZWlnaHQodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0Ll91cGRhdGVcbiAgICAqICB1cGRhdGVzIG1hdGNoSGVpZ2h0IG9uIGFsbCBjdXJyZW50IGdyb3VwcyB3aXRoIHRoZWlyIGNvcnJlY3Qgb3B0aW9uc1xuICAgICovXG5cbiAgICB2YXIgX3VwZGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKSB7XG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKGV2ZW50LCBtYXRjaEhlaWdodC5fZ3JvdXBzKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLmVsZW1lbnRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlKSB7XG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUgPSBmdW5jdGlvbih0aHJvdHRsZSwgZXZlbnQpIHtcbiAgICAgICAgLy8gcHJldmVudCB1cGRhdGUgaWYgZmlyZWQgZnJvbSBhIHJlc2l6ZSBldmVudFxuICAgICAgICAvLyB3aGVyZSB0aGUgdmlld3BvcnQgd2lkdGggaGFzbid0IGFjdHVhbGx5IGNoYW5nZWRcbiAgICAgICAgLy8gZml4ZXMgYW4gZXZlbnQgbG9vcGluZyBidWcgaW4gSUU4XG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAncmVzaXplJykge1xuICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgICAgICBpZiAod2luZG93V2lkdGggPT09IF9wcmV2aW91c1Jlc2l6ZVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3ByZXZpb3VzUmVzaXplV2lkdGggPSB3aW5kb3dXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRocm90dGxlIHVwZGF0ZXNcbiAgICAgICAgaWYgKCF0aHJvdHRsZSkge1xuICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoX3VwZGF0ZVRpbWVvdXQgPT09IC0xKSB7XG4gICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcbiAgICAgICAgICAgIH0sIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBiaW5kIGV2ZW50c1xuICAgICovXG5cbiAgICAvLyBhcHBseSBvbiBET00gcmVhZHkgZXZlbnRcbiAgICAkKG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkpO1xuXG4gICAgLy8gdXBkYXRlIGhlaWdodHMgb24gbG9hZCBhbmQgcmVzaXplIGV2ZW50c1xuICAgICQod2luZG93KS5iaW5kKCdsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZShmYWxzZSwgZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgLy8gdGhyb3R0bGVkIHVwZGF0ZSBoZWlnaHRzIG9uIHJlc2l6ZSBldmVudHNcbiAgICAkKHdpbmRvdykuYmluZCgncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSh0cnVlLCBldmVudCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7XG4iLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5KUyBQTFVHSU5TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG5cblxuLy8gR2V0IEN1cnJlbnQgQnJlYWtwb2ludCAoR2xvYmFsKVxudmFyIGJyZWFrcG9pbnQgPSB7fTtcbmJyZWFrcG9pbnQucmVmcmVzaCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLm5hbWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICc6YmVmb3JlJykuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoL1xcXCIvZywgJycpO1xufTtcbmpRdWVyeSh3aW5kb3cpLnJlc2l6ZSggZnVuY3Rpb24oKSB7XG5cdGJyZWFrcG9pbnQucmVmcmVzaCgpO1xufSkucmVzaXplKCk7XG5cblxuLy8gUmVzaXplIElmcmFtZXMgUHJvcG9ydGlvbmFsbHlcbmZ1bmN0aW9uIGlmcmFtZUFzcGVjdChzZWxlY3Rvcikge1xuXHRzZWxlY3RvciA9IHNlbGVjdG9yIHx8IGpRdWVyeSgnaWZyYW1lJyk7XG5cblx0c2VsZWN0b3IuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0LyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuXHRcdHZhciBpZnJhbWUgPSBqUXVlcnkodGhpcyksXG5cdFx0XHR3aWR0aCAgPSBpZnJhbWUud2lkdGgoKTtcblx0XHRpZiAoIHR5cGVvZihpZnJhbWUuZGF0YSgncmF0aW8nKSkgPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR2YXIgYXR0clcgPSB0aGlzLndpZHRoLFxuXHRcdFx0XHRhdHRySCA9IHRoaXMuaGVpZ2h0O1xuXHRcdFx0aWZyYW1lLmRhdGEoJ3JhdGlvJywgYXR0ckggLyBhdHRyVyApLnJlbW92ZUF0dHIoJ3dpZHRoJykucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XG5cdFx0fVxuXHRcdGlmcmFtZS5oZWlnaHQoIHdpZHRoICogaWZyYW1lLmRhdGEoJ3JhdGlvJykgKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG5cdH0pO1xufVxuXG5cbi8vIExpZ2h0ZW4gLyBEYXJrZW4gQ29sb3IgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XG5mdW5jdGlvbiBzaGFkZUNvbG9yKGNvbG9yLCBwZXJjZW50KSB7ICAgXG5cdHZhciBmPXBhcnNlSW50KGNvbG9yLnNsaWNlKDEpLDE2KSx0PXBlcmNlbnQ8MD8wOjI1NSxwPXBlcmNlbnQ8MD9wZXJjZW50Ki0xOnBlcmNlbnQsUj1mPj4xNixHPWY+PjgmMHgwMEZGLEI9ZiYweDAwMDBGRjtcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKCh0LVIpKnApK1IpKjB4MTAwMDArKE1hdGgucm91bmQoKHQtRykqcCkrRykqMHgxMDArKE1hdGgucm91bmQoKHQtQikqcCkrQikpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbn1cblxuXG4vLyBCbGVuZCBDb2xvcnMgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcblx0dmFyIGY9cGFyc2VJbnQoYzAuc2xpY2UoMSksMTYpLHQ9cGFyc2VJbnQoYzEuc2xpY2UoMSksMTYpLFIxPWY+PjE2LEcxPWY+PjgmMHgwMEZGLEIxPWYmMHgwMDAwRkYsUjI9dD4+MTYsRzI9dD4+OCYweDAwRkYsQjI9dCYweDAwMDBGRjtcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKChSMi1SMSkqcCkrUjEpKjB4MTAwMDArKE1hdGgucm91bmQoKEcyLUcxKSpwKStHMSkqMHgxMDArKE1hdGgucm91bmQoKEIyLUIxKSpwKStCMSkpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbn1cblxuXG4vLyBDb252ZXJ0IGNvbG9yIHRvIFJHQmFcbmZ1bmN0aW9uIGNvbG9yVG9SZ2JhKGNvbG9yLCBvcGFjaXR5KSB7XG5cdGlmICggY29sb3Iuc3Vic3RyaW5nKDAsNCkgPT0gJ3JnYmEnICkge1xuXHRcdHZhciBhbHBoYSA9IGNvbG9yLm1hdGNoKC8oW15cXCxdKilcXCkkLyk7XG5cdFx0cmV0dXJuIGNvbG9yLnJlcGxhY2UoYWxwaGFbMV0sIG9wYWNpdHkpO1xuXHR9IGVsc2UgaWYgKCBjb2xvci5zdWJzdHJpbmcoMCwzKSA9PSAncmdiJyApIHtcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCAnLCAnK29wYWNpdHkrJyknKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgaGV4ID0gY29sb3IucmVwbGFjZSgnIycsJycpLFxuXHRcdFx0ciA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwyKSwgMTYpLFxuXHRcdFx0ZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpLFxuXHRcdFx0YiA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNCw2KSwgMTYpLFxuXHRcdFx0cmVzdWx0ID0gJ3JnYmEoJytyKycsJytnKycsJytiKycsJytvcGFjaXR5KycpJztcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cblxuLy8gQ29sb3IgTGlnaHQgT3IgRGFyayAtIENyZWRpdCBcIkxhcnJ5IEZveFwiIC0gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbGFycnlmb3gvMTYzNjMzOFxuZnVuY3Rpb24gY29sb3JMb0QoY29sb3IpIHtcblx0dmFyIHIsYixnLGhzcCxhID0gY29sb3I7XG5cdGlmIChhLm1hdGNoKC9ecmdiLykpIHtcblx0XHRhID0gYS5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKSg/OixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pKT9cXCkkLyk7XG5cdFx0ciA9IGFbMV07XG5cdFx0YiA9IGFbMl07XG5cdFx0ZyA9IGFbM107XG5cdH0gZWxzZSB7XG5cdFx0YSA9ICsoJzB4JyArIGEuc2xpY2UoMSkucmVwbGFjZShhLmxlbmd0aCA8IDUgJiYgLy4vZywgJyQmJCYnKSk7XG5cdFx0ciA9IGEgPj4gMTY7XG5cdFx0YiA9IGEgPj4gOCAmIDI1NTtcblx0XHRnID0gYSAmIDI1NTtcblx0fVxuXHRoc3AgPSBNYXRoLnNxcnQoIDAuMjk5ICogKHIgKiByKSArIDAuNTg3ICogKGcgKiBnKSArIDAuMTE0ICogKGIgKiBiKSApO1xuXHRyZXR1cm4gKCBoc3AgPiAxMjcuNSApID8gJ2xpZ2h0JyA6ICdkYXJrJztcbn0gXG5cblxuLy8gSW1hZ2UgTGlnaHQgT3IgRGFyayBJbWFnZSAtIENyZWRpdCBcIkpvc2VwaCBQb3J0ZWxsaVwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzE0OTYzNi9qb3NlcGgtcG9ydGVsbGlcbmZ1bmN0aW9uIGltYWdlTG9EKGltYWdlU3JjLCBjYWxsYmFjaykge1xuXHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cdGltZy5zcmMgPSBpbWFnZVNyYztcblx0aW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcblxuXHR2YXIgY29sb3JTdW0gPSAwO1xuXG5cdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHQvLyBjcmVhdGUgY2FudmFzXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcywwLDApO1xuXG5cdFx0dmFyIGltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwwLGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xuXHRcdHZhciByLGcsYixhdmc7XG5cblx0XHRmb3IodmFyIHggPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgeCA8IGxlbjsgeCs9NCkge1xuXHRcdFx0ciA9IGRhdGFbeF07XG5cdFx0XHRnID0gZGF0YVt4KzFdO1xuXHRcdFx0YiA9IGRhdGFbeCsyXTtcblxuXHRcdFx0YXZnID0gTWF0aC5mbG9vcigocitnK2IpLzMpO1xuXHRcdFx0Y29sb3JTdW0gKz0gYXZnO1xuXHRcdH1cblxuXHRcdHZhciBicmlnaHRuZXNzID0gTWF0aC5mbG9vcihjb2xvclN1bSAvICh0aGlzLndpZHRoKnRoaXMuaGVpZ2h0KSk7XG5cdFx0Y2FsbGJhY2soYnJpZ2h0bmVzcyk7XG5cdH07XG59XG5cblxuLy8gUmVzaXplIEltYWdlIFRvIEZpbGwgQ29udGFpbmVyIFNpemVcbmZ1bmN0aW9uIGltYWdlQ292ZXIoY29udCwgdHlwZSwgY29yckgpIHtcblx0dHlwZSA9IHR5cGUgfHwgJ2JnJztcblxuXHRjb250LmFkZENsYXNzKCdpbWFnZS1jb3ZlcicpO1xuXG5cdHZhciBpbWcsIGltZ1VybCwgaW1nV2lkdGggPSAwLCBpbWdIZWlnaHQgPSAwO1xuXG5cdGlmICggdHlwZSA9PSAnaW1nJyApIHtcblx0XHRpbWcgPSBjb250LmZpbmQoJy5iZy1pbWcnKTtcblx0XHRpbWdXaWR0aCAgPSBpbWcud2lkdGgoKTtcblx0XHRpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0KCk7XG5cdH0gZWxzZSB7XG5cdFx0aW1nVXJsID0gY29udC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5tYXRjaCgvXnVybFxcKFwiPyguKz8pXCI/XFwpJC8pO1xuXHRcdGlmICggaW1nVXJsWzFdICkge1xuXHRcdCAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHQgICAgaW1nLnNyYyA9IGltZ1VybFsxXTtcblx0XHQgICAgaW1nV2lkdGggID0gaW1nLndpZHRoO1xuXHRcdCAgICBpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0O1xuXHRcdH1cblx0fVxuXG5cdGlmICggaW1nV2lkdGggIT09IDAgJiYgaW1nSGVpZ2h0ICE9PSAwICkge1xuXHRcdHZhciBjb250V2lkdGggID0gY29udC5vdXRlcldpZHRoKCksXG5cdFx0XHRjb250SGVpZ2h0ID0gY29udC5vdXRlckhlaWdodCgpLFxuXHRcdFx0aGVpZ2h0RGlmZiA9IGNvbnRXaWR0aCAvIGltZ1dpZHRoICogaW1nSGVpZ2h0LFxuXHRcdFx0bmV3V2lkdGggICA9ICdhdXRvJyxcblx0XHRcdG5ld0hlaWdodCAgPSBjb250SGVpZ2h0ICsgY29yckggKyAncHgnO1xuXG5cdFx0XHRpZiAoIGhlaWdodERpZmYgPiBjb250SGVpZ2h0ICkge1xuXHRcdFx0XHRuZXdXaWR0aCAgPSAnMTAwJSc7XG5cdFx0XHRcdG5ld0hlaWdodCA9ICdhdXRvJztcblx0XHRcdH1cblxuXHRcdGlmICggdHlwZSA9PSAnaW1nJyApIHtcblx0XHRcdGltZy5jc3MoeyB3aWR0aDogbmV3V2lkdGgsIGhlaWdodDogbmV3SGVpZ2h0IH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250LmNzcygnYmFja2dyb3VuZC1zaXplJywgbmV3V2lkdGggKyAnICcgKyBuZXdIZWlnaHQpO1xuXHRcdH1cblx0fVxufVxuXG5cbi8vIERldGVybWluZSBJZiBBbiBFbGVtZW50IElzIFNjcm9sbGVkIEludG8gVmlld1xuZnVuY3Rpb24gZWxlbVZpc2libGUoZWxlbSwgY29udCkge1xuXHR2YXIgY29udFRvcCA9IGNvbnQuc2Nyb2xsVG9wKCksXG5cdFx0Y29udEJ0bSA9IGNvbnRUb3AgKyBjb250LmhlaWdodCgpLFxuXHRcdGVsZW1Ub3AgPSBlbGVtLm9mZnNldCgpLnRvcCxcblx0XHRlbGVtQnRtID0gZWxlbVRvcCArIGVsZW0uaGVpZ2h0KCk7XG5cblx0cmV0dXJuICgoZWxlbUJ0bSA8PSBjb250QnRtKSAmJiAoZWxlbVRvcCA+PSBjb250VG9wKSk7XG59XG5cblxuKCBmdW5jdGlvbigkKSB7XG5cdC8vIEZpeCBXUE1MIERyb3Bkb3duXG5cdCQoJy5tZW51LWl0ZW0tbGFuZ3VhZ2UnKS5hZGRDbGFzcygnZHJvcGRvd24gZHJvcC1tZW51JykuZmluZCgnLnN1Yi1tZW51JykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcblxuXHQvLyBGaXggUG9seUxhbmcgTWVudSBJdGVtcyBBbmQgTWFrZSBUaGVtIERyb3Bkb3duXG5cdCQoJy5tZW51LWl0ZW0ubGFuZy1pdGVtJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0dmFyIGl0ZW0gPSAkKCcubGFuZy1pdGVtLmN1cnJlbnQtbGFuZycpO1xuXHRpZiAoaXRlbS5sZW5ndGggPT09IDApIHtcblx0XHRpdGVtID0gJCgnLmxhbmctaXRlbScpLmZpcnN0KCk7XG5cdH1cblx0dmFyIGxhbmdzID0gaXRlbS5zaWJsaW5ncygnLmxhbmctaXRlbScpO1xuXHRpdGVtLmFkZENsYXNzKCdkcm9wZG93biBkcm9wLW1lbnUnKTtcblx0bGFuZ3Mud3JhcEFsbCgnPHVsIGNsYXNzPVwic3ViLW1lbnUgZHJvcGRvd24tbWVudVwiPjwvdWw+JykucGFyZW50KCkuYXBwZW5kVG8oaXRlbSk7XG59KShqUXVlcnkpOyIsIi8qISBtb2Rlcm5penIgMy4yLjAgKEN1c3RvbSBCdWlsZCkgfCBNSVQgKlxuICogaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQvPy1mbGV4Ym94LW9iamVjdGZpdC1zaGl2ICEqL1xuIWZ1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKGUsdCl7cmV0dXJuIHR5cGVvZiBlPT09dH1mdW5jdGlvbiBvKCl7dmFyIGUsdCxuLG8sYSxpLHM7Zm9yKHZhciBsIGluIEMpaWYoQy5oYXNPd25Qcm9wZXJ0eShsKSl7aWYoZT1bXSx0PUNbbF0sdC5uYW1lJiYoZS5wdXNoKHQubmFtZS50b0xvd2VyQ2FzZSgpKSx0Lm9wdGlvbnMmJnQub3B0aW9ucy5hbGlhc2VzJiZ0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGgpKWZvcihuPTA7bjx0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7bisrKWUucHVzaCh0Lm9wdGlvbnMuYWxpYXNlc1tuXS50b0xvd2VyQ2FzZSgpKTtmb3Iobz1yKHQuZm4sXCJmdW5jdGlvblwiKT90LmZuKCk6dC5mbixhPTA7YTxlLmxlbmd0aDthKyspaT1lW2FdLHM9aS5zcGxpdChcIi5cIiksMT09PXMubGVuZ3RoP01vZGVybml6cltzWzBdXT1vOighTW9kZXJuaXpyW3NbMF1dfHxNb2Rlcm5penJbc1swXV1pbnN0YW5jZW9mIEJvb2xlYW58fChNb2Rlcm5penJbc1swXV09bmV3IEJvb2xlYW4oTW9kZXJuaXpyW3NbMF1dKSksTW9kZXJuaXpyW3NbMF1dW3NbMV1dPW8pLHkucHVzaCgobz9cIlwiOlwibm8tXCIpK3Muam9pbihcIi1cIikpfX1mdW5jdGlvbiBhKGUpe3ZhciB0PXguY2xhc3NOYW1lLG49TW9kZXJuaXpyLl9jb25maWcuY2xhc3NQcmVmaXh8fFwiXCI7aWYoYiYmKHQ9dC5iYXNlVmFsKSxNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVKU0NsYXNzKXt2YXIgcj1uZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIrbitcIm5vLWpzKFxcXFxzfCQpXCIpO3Q9dC5yZXBsYWNlKHIsXCIkMVwiK24rXCJqcyQyXCIpfU1vZGVybml6ci5fY29uZmlnLmVuYWJsZUNsYXNzZXMmJih0Kz1cIiBcIituK2Uuam9pbihcIiBcIituKSxiP3guY2xhc3NOYW1lLmJhc2VWYWw9dDp4LmNsYXNzTmFtZT10KX1mdW5jdGlvbiBpKGUpe3JldHVybiBlLnJlcGxhY2UoLyhbYS16XSktKFthLXpdKS9nLGZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gdCtuLnRvVXBwZXJDYXNlKCl9KS5yZXBsYWNlKC9eLS8sXCJcIil9ZnVuY3Rpb24gcyhlLHQpe3JldHVybiEhfihcIlwiK2UpLmluZGV4T2YodCl9ZnVuY3Rpb24gbCgpe3JldHVyblwiZnVuY3Rpb25cIiE9dHlwZW9mIHQuY3JlYXRlRWxlbWVudD90LmNyZWF0ZUVsZW1lbnQoYXJndW1lbnRzWzBdKTpiP3QuY3JlYXRlRWxlbWVudE5TLmNhbGwodCxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsYXJndW1lbnRzWzBdKTp0LmNyZWF0ZUVsZW1lbnQuYXBwbHkodCxhcmd1bWVudHMpfWZ1bmN0aW9uIGYoZSx0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0LGFyZ3VtZW50cyl9fWZ1bmN0aW9uIHUoZSx0LG4pe3ZhciBvO2Zvcih2YXIgYSBpbiBlKWlmKGVbYV1pbiB0KXJldHVybiBuPT09ITE/ZVthXToobz10W2VbYV1dLHIobyxcImZ1bmN0aW9uXCIpP2YobyxufHx0KTpvKTtyZXR1cm4hMX1mdW5jdGlvbiBjKGUpe3JldHVybiBlLnJlcGxhY2UoLyhbQS1aXSkvZyxmdW5jdGlvbihlLHQpe3JldHVyblwiLVwiK3QudG9Mb3dlckNhc2UoKX0pLnJlcGxhY2UoL15tcy0vLFwiLW1zLVwiKX1mdW5jdGlvbiBkKCl7dmFyIGU9dC5ib2R5O3JldHVybiBlfHwoZT1sKGI/XCJzdmdcIjpcImJvZHlcIiksZS5mYWtlPSEwKSxlfWZ1bmN0aW9uIHAoZSxuLHIsbyl7dmFyIGEsaSxzLGYsdT1cIm1vZGVybml6clwiLGM9bChcImRpdlwiKSxwPWQoKTtpZihwYXJzZUludChyLDEwKSlmb3IoO3ItLTspcz1sKFwiZGl2XCIpLHMuaWQ9bz9vW3JdOnUrKHIrMSksYy5hcHBlbmRDaGlsZChzKTtyZXR1cm4gYT1sKFwic3R5bGVcIiksYS50eXBlPVwidGV4dC9jc3NcIixhLmlkPVwic1wiK3UsKHAuZmFrZT9wOmMpLmFwcGVuZENoaWxkKGEpLHAuYXBwZW5kQ2hpbGQoYyksYS5zdHlsZVNoZWV0P2Euc3R5bGVTaGVldC5jc3NUZXh0PWU6YS5hcHBlbmRDaGlsZCh0LmNyZWF0ZVRleHROb2RlKGUpKSxjLmlkPXUscC5mYWtlJiYocC5zdHlsZS5iYWNrZ3JvdW5kPVwiXCIscC5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLGY9eC5zdHlsZS5vdmVyZmxvdyx4LnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIseC5hcHBlbmRDaGlsZChwKSksaT1uKGMsZSkscC5mYWtlPyhwLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocCkseC5zdHlsZS5vdmVyZmxvdz1mLHgub2Zmc2V0SGVpZ2h0KTpjLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYyksISFpfWZ1bmN0aW9uIG0odCxyKXt2YXIgbz10Lmxlbmd0aDtpZihcIkNTU1wiaW4gZSYmXCJzdXBwb3J0c1wiaW4gZS5DU1Mpe2Zvcig7by0tOylpZihlLkNTUy5zdXBwb3J0cyhjKHRbb10pLHIpKXJldHVybiEwO3JldHVybiExfWlmKFwiQ1NTU3VwcG9ydHNSdWxlXCJpbiBlKXtmb3IodmFyIGE9W107by0tOylhLnB1c2goXCIoXCIrYyh0W29dKStcIjpcIityK1wiKVwiKTtyZXR1cm4gYT1hLmpvaW4oXCIgb3IgXCIpLHAoXCJAc3VwcG9ydHMgKFwiK2ErXCIpIHsgI21vZGVybml6ciB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfSB9XCIsZnVuY3Rpb24oZSl7cmV0dXJuXCJhYnNvbHV0ZVwiPT1nZXRDb21wdXRlZFN0eWxlKGUsbnVsbCkucG9zaXRpb259KX1yZXR1cm4gbn1mdW5jdGlvbiBoKGUsdCxvLGEpe2Z1bmN0aW9uIGYoKXtjJiYoZGVsZXRlIEYuc3R5bGUsZGVsZXRlIEYubW9kRWxlbSl9aWYoYT1yKGEsXCJ1bmRlZmluZWRcIik/ITE6YSwhcihvLFwidW5kZWZpbmVkXCIpKXt2YXIgdT1tKGUsbyk7aWYoIXIodSxcInVuZGVmaW5lZFwiKSlyZXR1cm4gdX1mb3IodmFyIGMsZCxwLGgsdixnPVtcIm1vZGVybml6clwiLFwidHNwYW5cIl07IUYuc3R5bGU7KWM9ITAsRi5tb2RFbGVtPWwoZy5zaGlmdCgpKSxGLnN0eWxlPUYubW9kRWxlbS5zdHlsZTtmb3IocD1lLmxlbmd0aCxkPTA7cD5kO2QrKylpZihoPWVbZF0sdj1GLnN0eWxlW2hdLHMoaCxcIi1cIikmJihoPWkoaCkpLEYuc3R5bGVbaF0hPT1uKXtpZihhfHxyKG8sXCJ1bmRlZmluZWRcIikpcmV0dXJuIGYoKSxcInBmeFwiPT10P2g6ITA7dHJ5e0Yuc3R5bGVbaF09b31jYXRjaCh5KXt9aWYoRi5zdHlsZVtoXSE9dilyZXR1cm4gZigpLFwicGZ4XCI9PXQ/aDohMH1yZXR1cm4gZigpLCExfWZ1bmN0aW9uIHYoZSx0LG4sbyxhKXt2YXIgaT1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK2Uuc2xpY2UoMSkscz0oZStcIiBcIit3LmpvaW4oaStcIiBcIikraSkuc3BsaXQoXCIgXCIpO3JldHVybiByKHQsXCJzdHJpbmdcIil8fHIodCxcInVuZGVmaW5lZFwiKT9oKHMsdCxvLGEpOihzPShlK1wiIFwiK04uam9pbihpK1wiIFwiKStpKS5zcGxpdChcIiBcIiksdShzLHQsbikpfWZ1bmN0aW9uIGcoZSx0LHIpe3JldHVybiB2KGUsbixuLHQscil9dmFyIHk9W10sQz1bXSxFPXtfdmVyc2lvbjpcIjMuMi4wXCIsX2NvbmZpZzp7Y2xhc3NQcmVmaXg6XCJcIixlbmFibGVDbGFzc2VzOiEwLGVuYWJsZUpTQ2xhc3M6ITAsdXNlUHJlZml4ZXM6ITB9LF9xOltdLG9uOmZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dChuW2VdKX0sMCl9LGFkZFRlc3Q6ZnVuY3Rpb24oZSx0LG4pe0MucHVzaCh7bmFtZTplLGZuOnQsb3B0aW9uczpufSl9LGFkZEFzeW5jVGVzdDpmdW5jdGlvbihlKXtDLnB1c2goe25hbWU6bnVsbCxmbjplfSl9fSxNb2Rlcm5penI9ZnVuY3Rpb24oKXt9O01vZGVybml6ci5wcm90b3R5cGU9RSxNb2Rlcm5penI9bmV3IE1vZGVybml6cjt2YXIgeD10LmRvY3VtZW50RWxlbWVudCxiPVwic3ZnXCI9PT14Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7Ynx8IWZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbihlLHQpe3ZhciBuPWUuY3JlYXRlRWxlbWVudChcInBcIikscj1lLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXXx8ZS5kb2N1bWVudEVsZW1lbnQ7cmV0dXJuIG4uaW5uZXJIVE1MPVwieDxzdHlsZT5cIit0K1wiPC9zdHlsZT5cIixyLmluc2VydEJlZm9yZShuLmxhc3RDaGlsZCxyLmZpcnN0Q2hpbGQpfWZ1bmN0aW9uIHIoKXt2YXIgZT1DLmVsZW1lbnRzO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlP2Uuc3BsaXQoXCIgXCIpOmV9ZnVuY3Rpb24gbyhlLHQpe3ZhciBuPUMuZWxlbWVudHM7XCJzdHJpbmdcIiE9dHlwZW9mIG4mJihuPW4uam9pbihcIiBcIikpLFwic3RyaW5nXCIhPXR5cGVvZiBlJiYoZT1lLmpvaW4oXCIgXCIpKSxDLmVsZW1lbnRzPW4rXCIgXCIrZSxmKHQpfWZ1bmN0aW9uIGEoZSl7dmFyIHQ9eVtlW3ZdXTtyZXR1cm4gdHx8KHQ9e30sZysrLGVbdl09Zyx5W2ddPXQpLHR9ZnVuY3Rpb24gaShlLG4scil7aWYobnx8KG49dCksYylyZXR1cm4gbi5jcmVhdGVFbGVtZW50KGUpO3J8fChyPWEobikpO3ZhciBvO3JldHVybiBvPXIuY2FjaGVbZV0/ci5jYWNoZVtlXS5jbG9uZU5vZGUoKTpoLnRlc3QoZSk/KHIuY2FjaGVbZV09ci5jcmVhdGVFbGVtKGUpKS5jbG9uZU5vZGUoKTpyLmNyZWF0ZUVsZW0oZSksIW8uY2FuSGF2ZUNoaWxkcmVufHxtLnRlc3QoZSl8fG8udGFnVXJuP286ci5mcmFnLmFwcGVuZENoaWxkKG8pfWZ1bmN0aW9uIHMoZSxuKXtpZihlfHwoZT10KSxjKXJldHVybiBlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtuPW58fGEoZSk7Zm9yKHZhciBvPW4uZnJhZy5jbG9uZU5vZGUoKSxpPTAscz1yKCksbD1zLmxlbmd0aDtsPmk7aSsrKW8uY3JlYXRlRWxlbWVudChzW2ldKTtyZXR1cm4gb31mdW5jdGlvbiBsKGUsdCl7dC5jYWNoZXx8KHQuY2FjaGU9e30sdC5jcmVhdGVFbGVtPWUuY3JlYXRlRWxlbWVudCx0LmNyZWF0ZUZyYWc9ZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50LHQuZnJhZz10LmNyZWF0ZUZyYWcoKSksZS5jcmVhdGVFbGVtZW50PWZ1bmN0aW9uKG4pe3JldHVybiBDLnNoaXZNZXRob2RzP2kobixlLHQpOnQuY3JlYXRlRWxlbShuKX0sZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50PUZ1bmN0aW9uKFwiaCxmXCIsXCJyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1mLmNsb25lTm9kZSgpLGM9bi5jcmVhdGVFbGVtZW50O2guc2hpdk1ldGhvZHMmJihcIityKCkuam9pbigpLnJlcGxhY2UoL1tcXHdcXC06XSsvZyxmdW5jdGlvbihlKXtyZXR1cm4gdC5jcmVhdGVFbGVtKGUpLHQuZnJhZy5jcmVhdGVFbGVtZW50KGUpLCdjKFwiJytlKydcIiknfSkrXCIpO3JldHVybiBufVwiKShDLHQuZnJhZyl9ZnVuY3Rpb24gZihlKXtlfHwoZT10KTt2YXIgcj1hKGUpO3JldHVybiFDLnNoaXZDU1N8fHV8fHIuaGFzQ1NTfHwoci5oYXNDU1M9ISFuKGUsXCJhcnRpY2xlLGFzaWRlLGRpYWxvZyxmaWdjYXB0aW9uLGZpZ3VyZSxmb290ZXIsaGVhZGVyLGhncm91cCxtYWluLG5hdixzZWN0aW9ue2Rpc3BsYXk6YmxvY2t9bWFya3tiYWNrZ3JvdW5kOiNGRjA7Y29sb3I6IzAwMH10ZW1wbGF0ZXtkaXNwbGF5Om5vbmV9XCIpKSxjfHxsKGUsciksZX12YXIgdSxjLGQ9XCIzLjcuM1wiLHA9ZS5odG1sNXx8e30sbT0vXjx8Xig/OmJ1dHRvbnxtYXB8c2VsZWN0fHRleHRhcmVhfG9iamVjdHxpZnJhbWV8b3B0aW9ufG9wdGdyb3VwKSQvaSxoPS9eKD86YXxifGNvZGV8ZGl2fGZpZWxkc2V0fGgxfGgyfGgzfGg0fGg1fGg2fGl8bGFiZWx8bGl8b2x8cHxxfHNwYW58c3Ryb25nfHN0eWxlfHRhYmxlfHRib2R5fHRkfHRofHRyfHVsKSQvaSx2PVwiX2h0bWw1c2hpdlwiLGc9MCx5PXt9OyFmdW5jdGlvbigpe3RyeXt2YXIgZT10LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2UuaW5uZXJIVE1MPVwiPHh5ej48L3h5ej5cIix1PVwiaGlkZGVuXCJpbiBlLGM9MT09ZS5jaGlsZE5vZGVzLmxlbmd0aHx8ZnVuY3Rpb24oKXt0LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO3ZhciBlPXQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNsb25lTm9kZXx8XCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudHx8XCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY3JlYXRlRWxlbWVudH0oKX1jYXRjaChuKXt1PSEwLGM9ITB9fSgpO3ZhciBDPXtlbGVtZW50czpwLmVsZW1lbnRzfHxcImFiYnIgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiZGkgY2FudmFzIGRhdGEgZGF0YWxpc3QgZGV0YWlscyBkaWFsb2cgZmlnY2FwdGlvbiBmaWd1cmUgZm9vdGVyIGhlYWRlciBoZ3JvdXAgbWFpbiBtYXJrIG1ldGVyIG5hdiBvdXRwdXQgcGljdHVyZSBwcm9ncmVzcyBzZWN0aW9uIHN1bW1hcnkgdGVtcGxhdGUgdGltZSB2aWRlb1wiLHZlcnNpb246ZCxzaGl2Q1NTOnAuc2hpdkNTUyE9PSExLHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzOmMsc2hpdk1ldGhvZHM6cC5zaGl2TWV0aG9kcyE9PSExLHR5cGU6XCJkZWZhdWx0XCIsc2hpdkRvY3VtZW50OmYsY3JlYXRlRWxlbWVudDppLGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6cyxhZGRFbGVtZW50czpvfTtlLmh0bWw1PUMsZih0KSxcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPUMpfShcInVuZGVmaW5lZFwiIT10eXBlb2YgZT9lOnRoaXMsdCk7dmFyIFM9XCJNb3ogTyBtcyBXZWJraXRcIix3PUUuX2NvbmZpZy51c2VQcmVmaXhlcz9TLnNwbGl0KFwiIFwiKTpbXTtFLl9jc3NvbVByZWZpeGVzPXc7dmFyIF89ZnVuY3Rpb24odCl7dmFyIHIsbz1wcmVmaXhlcy5sZW5ndGgsYT1lLkNTU1J1bGU7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGEpcmV0dXJuIG47aWYoIXQpcmV0dXJuITE7aWYodD10LnJlcGxhY2UoL15ALyxcIlwiKSxyPXQucmVwbGFjZSgvLS9nLFwiX1wiKS50b1VwcGVyQ2FzZSgpK1wiX1JVTEVcIixyIGluIGEpcmV0dXJuXCJAXCIrdDtmb3IodmFyIGk9MDtvPmk7aSsrKXt2YXIgcz1wcmVmaXhlc1tpXSxsPXMudG9VcHBlckNhc2UoKStcIl9cIityO2lmKGwgaW4gYSlyZXR1cm5cIkAtXCIrcy50b0xvd2VyQ2FzZSgpK1wiLVwiK3R9cmV0dXJuITF9O0UuYXRSdWxlPV87dmFyIE49RS5fY29uZmlnLnVzZVByZWZpeGVzP1MudG9Mb3dlckNhc2UoKS5zcGxpdChcIiBcIik6W107RS5fZG9tUHJlZml4ZXM9Tjt2YXIgaj17ZWxlbTpsKFwibW9kZXJuaXpyXCIpfTtNb2Rlcm5penIuX3EucHVzaChmdW5jdGlvbigpe2RlbGV0ZSBqLmVsZW19KTt2YXIgRj17c3R5bGU6ai5lbGVtLnN0eWxlfTtNb2Rlcm5penIuX3EudW5zaGlmdChmdW5jdGlvbigpe2RlbGV0ZSBGLnN0eWxlfSksRS50ZXN0QWxsUHJvcHM9dixFLnRlc3RBbGxQcm9wcz1nLE1vZGVybml6ci5hZGRUZXN0KFwiZmxleGJveFwiLGcoXCJmbGV4QmFzaXNcIixcIjFweFwiLCEwKSk7dmFyIFQ9RS5wcmVmaXhlZD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIDA9PT1lLmluZGV4T2YoXCJAXCIpP18oZSk6KC0xIT1lLmluZGV4T2YoXCItXCIpJiYoZT1pKGUpKSx0P3YoZSx0LG4pOnYoZSxcInBmeFwiKSl9O01vZGVybml6ci5hZGRUZXN0KFwib2JqZWN0Zml0XCIsISFUKFwib2JqZWN0Rml0XCIpLHthbGlhc2VzOltcIm9iamVjdC1maXRcIl19KSxvKCksYSh5KSxkZWxldGUgRS5hZGRUZXN0LGRlbGV0ZSBFLmFkZEFzeW5jVGVzdDtmb3IodmFyIGs9MDtrPE1vZGVybml6ci5fcS5sZW5ndGg7aysrKU1vZGVybml6ci5fcVtrXSgpO2UuTW9kZXJuaXpyPU1vZGVybml6cn0od2luZG93LGRvY3VtZW50KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5FTEVNRU5UIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KTtcblxuXG5cdC8vIEVsZW1lbnQgQW5pbWF0aW9uc1xuXHRmdW5jdGlvbiBtaXh0QW5pbWF0aW9ucygpIHtcblx0XHR2YXIgYW5pbUVsZW1zID0gJCgnLm1peHQtYW5pbWF0ZScpO1xuXG5cdFx0aWYgKCBhbmltRWxlbXMubGVuZ3RoID09PSAwICkgeyByZXR1cm47IH1cblxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi53YXlwb2ludCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGFuaW1FbGVtcy53YXlwb2ludCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltLXByZScpLmFkZENsYXNzKCdhbmltLXN0YXJ0Jyk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICc4NSUnLFxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgMTAwMCApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdG1peHRBbmltYXRpb25zKCk7XG5cblxuXHQvLyBTdGF0IC8gQ291bnRlciBFbGVtZW50XG5cdGZ1bmN0aW9uIG1peHRTdGF0cygpIHtcblx0XHR2YXIgc3RhdEVsZW1zID0gJCgnLm1peHQtc3RhdCcpO1xuXG5cdFx0aWYgKCBzdGF0RWxlbXMubGVuZ3RoID09PSAwICkgeyByZXR1cm47IH1cblxuXHRcdC8vIFNldCBzdGF0IHRleHQgdG8gc3RhcnRpbmcgKGZyb20pIHZhbHVlXG5cdFx0c3RhdEVsZW1zLmZpbmQoJy5zdGF0LXZhbHVlJykuZWFjaCggZnVuY3Rpb24oKSB7ICQodGhpcykudGV4dCgkKHRoaXMpLmRhdGEoJ2Zyb20nKSk7IH0pO1xuXG5cdFx0Ly8gQW5pbWF0ZSB2YWx1ZVxuXHRcdGZ1bmN0aW9uIHN0YXRWYWx1ZShlbCkge1xuXHRcdFx0dmFyIGZyb20gID0gZWwuZGF0YSgnZnJvbScpLFxuXHRcdFx0XHR0byAgICA9IGVsLmRhdGEoJ3RvJyksXG5cdFx0XHRcdHNwZWVkID0gZWwuZGF0YSgnc3BlZWQnKTtcblx0XHRcdCQoe3ZhbHVlOiBmcm9tfSkuYW5pbWF0ZSh7dmFsdWU6IHRvfSwge1xuXHRcdFx0XHRkdXJhdGlvbjogc3BlZWQsXG5cdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KE1hdGgucm91bmQodGhpcy52YWx1ZSkpOyB9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KHRvKTsgfVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxuXHRcdGZ1bmN0aW9uIHN0YXRDaXJjbGUoc3RhdCkge1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5jaXJjbGVQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmNzcygnbWFyZ2luLXRvcCcsICQodGhpcykuaGVpZ2h0KCkgLyAtMik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0c3RhdEVsZW1zLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc3RhdCA9ICQodGhpcyk7XG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0c3RhdC53YXlwb2ludCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXG5cdFx0XHRcdFx0XHR0cmlnZ2VyT25jZTogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRWYWx1ZShzdGF0LmZpbmQoJy5zdGF0LXZhbHVlJykpO1xuXHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdG1peHRTdGF0cygpO1xuXG5cblx0Ly8gRmxpcCBDYXJkIEVxdWFsaXplIEhlaWdodFxuXHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcblx0XHRmbGlwY2FyZFNpZGVzLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRmbGlwY2FyZFNpZGVzLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblx0XHR9KTtcblx0fVxuXHQvLyBGbGlwIENhcmQgVG91Y2ggU2NyZWVuIFwiSG92ZXJcIlxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXInKTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVBREVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xuXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXG5cdFx0bWFpbk5hdiAgID0gJCgnI21haW4tbmF2JyksXG5cdFx0bWVkaWFXcmFwID0gJCgnLmhlYWQtbWVkaWEnKTtcblxuXHQvLyBIZWFkIE1lZGlhIEZ1bmN0aW9uc1xuXHRmdW5jdGlvbiBoZWFkZXJGbigpIHtcblx0XHR2YXIgbWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCksXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXG5cdFx0XHR2aWV3SGVpZ2h0ICAgPSB2aWV3cG9ydC5oZWlnaHQoKSAtIG1lZGlhV3JhcC5vZmZzZXQoKS50b3A7XG5cblx0XHQvLyBNYWtlIGhlYWRlciBmdWxsc2NyZWVuXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcblx0XHRcdHZhciBmdWxsSGVpZ2h0ID0gdmlld0hlaWdodDtcblxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIGZ1bGxIZWlnaHQgLT0gdG9wTmF2SGVpZ2h0O1xuXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCBmdWxsSGVpZ2h0KTtcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGZ1bGxIZWlnaHQpO1xuXHRcdH0gZWxzZSBpZiAoIG1peHRfb3B0LmhlYWRlci5oZWlnaHQuaGVpZ2h0ICE9ICcnICYmIG1peHRfb3B0LmhlYWRlci5oZWlnaHQudW5pdHMgPT0gJyUnICkge1xuXHRcdFx0dmFyIGhlaWdodCA9IG1peHRfb3B0LmhlYWRlci5oZWlnaHQuaGVpZ2h0IC8gMTAwICogdmlld0hlaWdodDtcblxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIGhlaWdodCAtPSB0b3BOYXZIZWlnaHQ7XG5cblx0XHRcdG1lZGlhV3JhcC5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG5cdFx0XHRtZWRpYUNvbnQuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdH1cblxuXHRcdC8vIFByZXZlbnQgY29udGVudCBmYWRlIGlmIGhlYWRlciBpcyB0YWxsZXIgdGhhbiB2aWV3cG9ydFxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyWydjb250ZW50LWZhZGUnXSApIHtcblx0XHRcdGlmICggd3JhcEhlaWdodCA+IHZpZXdIZWlnaHQgKSB7XG5cdFx0XHRcdG1lZGlhV3JhcC5hZGRDbGFzcygnbm8tZmFkZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVkaWFXcmFwLnJlbW92ZUNsYXNzKCduby1mYWRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gSGVhZGVyIFNjcm9sbCBUbyBDb250ZW50XG5cdGZ1bmN0aW9uIGhlYWRlclNjcm9sbCgpIHtcblx0XHR2YXIgcGFnZSAgID0gJCgnaHRtbCwgYm9keScpLFxuXHRcdFx0b2Zmc2V0ID0gJCgnI2NvbnRlbnQtd3JhcCcpLm9mZnNldCgpLnRvcDtcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7IG9mZnNldCAtPSBtYWluTmF2LmNoaWxkcmVuKCcuY29udGFpbmVyJykuaGVpZ2h0KCk7IH1cblx0XHQkKCcuaGVhZGVyLXNjcm9sbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cGFnZS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSwgODAwKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XG5cdFx0aGVhZGVyRm4oKTtcblxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnNjcm9sbCApIHsgaGVhZGVyU2Nyb2xsKCk7IH1cblx0XHRcblx0XHQkKHdpbmRvdykucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGhlYWRlckZuICkpO1xuXHR9XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVMUEVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIFNraXAgTGluayBGb2N1cyBGaXhcblx0XG5cdHZhciBpc193ZWJraXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ3dlYmtpdCcgKSA+IC0xLFxuXHRcdGlzX29wZXJhICA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICkgID4gLTEsXG5cdFx0aXNfaWUgICAgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApICAgPiAtMTtcblxuXHRpZiAoICggaXNfd2Via2l0IHx8IGlzX29wZXJhIHx8IGlzX2llICkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKSApIHtcblx0XHR2YXIgZXZlbnRNZXRob2QgPSAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnO1xuXHRcdHdpbmRvd1sgZXZlbnRNZXRob2QgXSggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICkgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWF8ZGl2KSQvaS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEFwcGx5IEJvb3RzdHJhcCBDbGFzc2VzXG5cdFxuXHR2YXIgd29vQ29tbVdyYXAgPSAkKCcud29vY29tbWVyY2UnKTtcblx0XG5cdHZhciB3aWRnZXROYXZNZW51cyA9ICcud2lkZ2V0X21ldGEsIC53aWRnZXRfcmVjZW50X2VudHJpZXMsIC53aWRnZXRfYXJjaGl2ZSwgLndpZGdldF9jYXRlZ29yaWVzLCAud2lkZ2V0X25hdl9tZW51LCAud2lkZ2V0X3BhZ2VzLCAud2lkZ2V0X3Jzcyc7XG5cblx0Ly8gV29vQ29tbWVyY2UgV2lkZ2V0cyAmIEVsZW1lbnRzXG5cdGlmICggd29vQ29tbVdyYXAubGVuZ3RoICkge1xuXHRcdHdpZGdldE5hdk1lbnVzICs9ICcsIC53aWRnZXRfcHJvZHVjdF9jYXRlZ29yaWVzLCAud2lkZ2V0X3Byb2R1Y3RzLCAud2lkZ2V0X3RvcF9yYXRlZF9wcm9kdWN0cywgLndpZGdldF9yZWNlbnRfcmV2aWV3cywgLndpZGdldF9yZWNlbnRseV92aWV3ZWRfcHJvZHVjdHMsIC53aWRnZXRfbGF5ZXJlZF9uYXYnO1xuXG5cdFx0d29vQ29tbVdyYXAuZmluZCgnLnNob3BfdGFibGUnKS5hZGRDbGFzcygndGFibGUgdGFibGUtYm9yZGVyZWQnKTtcblxuXHRcdCQoZG9jdW1lbnQuYm9keSkub24oJ3VwZGF0ZWRfY2hlY2tvdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5zaG9wX3RhYmxlJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLXN0cmlwZWQnKTtcblx0XHR9KTtcblx0fVxuXG5cdCQod2lkZ2V0TmF2TWVudXMpLmNoaWxkcmVuKCd1bCcpLmFkZENsYXNzKCduYXYnKTtcblx0JCgnLndpZGdldF9uYXZfbWVudSB1bC5tZW51JykuYWRkQ2xhc3MoJ25hdicpO1xuXG5cdCQoJyN3cC1jYWxlbmRhcicpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkJyk7XG5cblx0Ly8gSGFuZGxlIFBvc3QgQ291bnQgVGFnc1xuXG5cdCQoJy53aWRnZXRfYXJjaGl2ZSBsaSwgLndpZGdldF9jYXRlZ29yaWVzIGxpJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzICAgICA9ICQodGhpcyksXG5cdFx0XHRjaGlsZHJlbiAgPSAkdGhpcy5jaGlsZHJlbigpLFxuXHRcdFx0YW5jaG9yICAgID0gY2hpbGRyZW4uZmlsdGVyKCdhJyksXG5cdFx0XHRjb250ZW50cyAgPSAkdGhpcy5jb250ZW50cygpLFxuXHRcdFx0Y291bnRUZXh0ID0gY29udGVudHMubm90KGNoaWxkcmVuKS50ZXh0KCk7XG5cblx0XHRpZiAoIGNvdW50VGV4dCAhPT0gJycgKSB7XG5cdFx0XHRhbmNob3IuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInBvc3QtY291bnRcIj4nICsgY291bnRUZXh0ICsgJzwvc3Bhbj4nKTtcblx0XHRcdGNvbnRlbnRzLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVUeXBlID09PSAzOyBcblx0XHRcdH0pLnJlbW92ZSgpO1xuXHRcdH1cblx0fSk7XG5cblx0JCgnLndpZGdldC53b29jb21tZXJjZSBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRjb3VudCA9ICR0aGlzLmNoaWxkcmVuKCcuY291bnQnKSxcblx0XHRcdGxpbmsgID0gJHRoaXMuY2hpbGRyZW4oJ2EnKTtcblx0XHRjb3VudC5hcHBlbmRUbyhsaW5rKTtcblx0fSk7XG5cblx0Ly8gR2FsbGVyeSBBcnJvdyBOYXZpZ2F0aW9uXG5cblx0JChkb2N1bWVudCkua2V5ZG93biggZnVuY3Rpb24oZSkge1xuXHRcdHZhciB1cmwgPSBmYWxzZTtcblx0XHRpZiAoIGUud2hpY2ggPT09IDM3ICkgeyAgLy8gTGVmdCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLnByZXZpb3VzLWltYWdlIGEnKS5hdHRyKCdocmVmJyk7XG5cdFx0fSBlbHNlIGlmICggZS53aGljaCA9PT0gMzkgKSB7ICAvLyBSaWdodCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLmVudHJ5LWF0dGFjaG1lbnQgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9XG5cdFx0aWYgKCB1cmwgJiYgKCAhJCgndGV4dGFyZWEsIGlucHV0JykuaXMoJzpmb2N1cycpICkgKSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmw7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBEZXRlY3QgSUUgVmVyc2lvblxuXG5cdHZhciBjbGFzc2VzID0gW10sXG5cdFx0bWF0Y2ggPSAvbXNpZSAoXFxkKykvaS5leGVjKCBuYXZpZ2F0b3IudXNlckFnZW50ICk7XG5cdGlmICggbWF0Y2ggKSB7XG5cdFx0dmFyIHZlcnNpb24gPSArbWF0Y2hbMV0sXG5cdFx0XHRtaW4gPSA2LFxuXHRcdFx0bWF4ID0gMTE7XG5cdFx0Y2xhc3Nlcy5wdXNoKCAnaWUnICk7XG5cdFx0Y2xhc3Nlcy5wdXNoKCAnaWUnICsgdmVyc2lvbiApO1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3Nlcy5qb2luKCcgJyk7XG5cdH1cblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5OQVZCQVIgRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIG1peHRfb3B0LCBjb2xvckxvRCwgY29sb3JUb1JnYmEgKi9cblxuXHR2YXIgdmlld3BvcnQgICAgID0gJCh3aW5kb3cpLFxuXHRcdGJvZHlFbCAgICAgICA9ICQoJ2JvZHknKSxcblx0XHRtYWluV3JhcCAgICAgPSAkKCcjbWFpbi13cmFwJyksXG5cdFx0bWFpbk5hdldyYXAgID0gJCgnI21haW4tbmF2LXdyYXAnKSxcblx0XHRtYWluTmF2QmFyICAgPSAkKCcjbWFpbi1uYXYnKSxcblx0XHRtYWluTmF2Q29udCAgPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXG5cdFx0bWFpbk5hdkhlYWQgID0gJCgnLm5hdmJhci1oZWFkZXInLCBtYWluTmF2QmFyKSxcblx0XHRtYWluTmF2SW5uZXIgPSAkKCcubmF2YmFyLWlubmVyJywgbWFpbk5hdkJhciksXG5cdFx0c2VjTmF2QmFyICAgID0gJCgnI3NlY29uZC1uYXYnKSxcblx0XHRzZWNOYXZDb250ICAgPSBzZWNOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcblx0XHRuYXZiYXJzICAgICAgPSAkKCcubmF2YmFyJyksXG5cdFx0bWVkaWFXcmFwICAgID0gJCgnLmhlYWQtbWVkaWEnKTtcblxuXHRpZiAoIG1haW5OYXZCYXIubGVuZ3RoID09PSAwICkgcmV0dXJuO1xuXG5cdHZhciBOYXZiYXIgPSB7XG5cblx0XHRuYXZCZzogJycsXG5cdFx0bmF2QmdUb3A6ICcnLFxuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBOYXZiYXJcblx0XHRpbml0OiBmdW5jdGlvbihuYXZiYXIpIHtcblx0XHRcdHZhciBiZ0NvbG9yICA9IG5hdmJhci5jc3MoJ2JhY2tncm91bmQtY29sb3InKSxcblx0XHRcdFx0ZGF0YUNvbnQgPSBuYXZiYXIuZmluZCgnLm5hdmJhci1kYXRhJyksXG5cdFx0XHRcdGNvbG9yTHVtID0gZGF0YUNvbnQubGVuZ3RoID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGF0YUNvbnRbMF0sICc6YmVmb3JlJykuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoL1wiL2csICcnKSA6ICcnO1xuXG5cdFx0XHRpZiAoIGNvbG9yTHVtICE9ICdkYXJrJyAmJiBjb2xvckx1bSAhPSAnbGlnaHQnICkgY29sb3JMdW0gPSBjb2xvckxvRChiZ0NvbG9yKTtcblxuXHRcdFx0aWYgKCBuYXZiYXIuaXMobWFpbk5hdkJhcikgKSB7XG5cblx0XHRcdFx0dGhpcy5uYXZCZyA9ICggY29sb3JMdW0gPT0gJ2RhcmsnICkgPyAnYmctZGFyaycgOiAnYmctbGlnaHQnO1xuXHRcdFx0XHRuYXZiYXIuYWRkQ2xhc3ModGhpcy5uYXZCZyk7XG5cblx0XHRcdFx0bWFpbk5hdkJhci5hdHRyKCdkYXRhLWJnJywgY29sb3JMdW0pO1xuXG5cdFx0XHRcdHZhciBuYXZTaGVldCA9ICQoJzxzdHlsZSBkYXRhLWlkPVwibWl4dC1uYXYtY3NzXCI+Jyk7XG5cblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubGF5b3V0ICE9ICd2ZXJ0aWNhbCcgKSB7XG5cdFx0XHRcdFx0bmF2U2hlZXQuYXBwZW5kKCcjbWFpbi1uYXYubmF2YmFyLW1peHQ6bm90KC5wb3NpdGlvbi10b3ApIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXYub3BhY2l0eSkrJzsgfScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0bmF2U2hlZXQuYXBwZW5kKCcubmF2LXRyYW5zcGFyZW50ICNtYWluLW5hdi5uYXZiYXItbWl4dC5wb3NpdGlvbi10b3AgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yVG9SZ2JhKGJnQ29sb3IsIG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSkrJzsgfScpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddIDw9IDAuNCApIHtcblx0XHRcdFx0XHRcdGlmICggbWVkaWFXcmFwLmhhc0NsYXNzKCdiZy1kYXJrJykgKSB7IHRoaXMubmF2QmdUb3AgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWxpZ2h0JykgKSB7IHRoaXMubmF2QmdUb3AgPSAnYmctbGlnaHQnOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgdGhpcy5uYXZCZ1RvcCA9IHRoaXMubmF2Qmc7IH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5LnRvZ2dsZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMubmF2QmdUb3AgPSB0aGlzLm5hdkJnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnc3RhdGljJyApIHtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKHRoaXMubmF2QmcpLmFkZENsYXNzKHRoaXMubmF2QmdUb3ApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBuYXZTaGVldC5odG1sKCkgIT0gJycgKSB7XG5cdFx0XHRcdFx0bmF2U2hlZXQuYXBwZW5kVG8oJCgnaGVhZCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCBjb2xvckx1bSA9PSAnZGFyaycgKSB7XG5cdFx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKCdiZy1kYXJrJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKCdiZy1saWdodCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRuYXZiYXIucmVtb3ZlQ2xhc3MoJ2luaXQnKTtcblx0XHR9LFxuXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uc1xuXHRcdHN0aWNreToge1xuXHRcdFx0aXNNb2JpbGU6IGZhbHNlLFxuXHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0c2Nyb2xsQ29ycmVjdGlvbjogMCxcblxuXHRcdFx0Ly8gVHJpZ2dlciBvciB1cGRhdGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbihpc01vYmlsZSkge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IDA7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kuaXNNb2JpbGUgPSBpc01vYmlsZTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS5zY3JvbGxDb3JyZWN0aW9uID0gMDtcblxuXHRcdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSAmJiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyB8fCAoIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSB2aWV3cG9ydC5oZWlnaHQoKSApID4gMTYwICkgKSB7XG5cdFx0XHRcdFx0bWFpbk5hdkJhci5kYXRhKCdmaXhlZCcsIHRydWUpO1xuXHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCAkLnRocm90dGxlKDUwLCBOYXZiYXIuc3RpY2t5LnRvZ2dsZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1haW5OYXZCYXIuZGF0YSgnZml4ZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIuc3RpY2t5LnRvZ2dsZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XG5cdFx0XHRcdFx0TmF2YmFyLnN0aWNreS5zY3JvbGxDb3JyZWN0aW9uICs9IHBhcnNlRmxvYXQobWFpbldyYXAuY3NzKCdwYWRkaW5nLXRvcCcpLCAxMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ2hvcml6b250YWwnICYmIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IG1haW5OYXZCYXIub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdE5hdmJhci5zdGlja3kudG9nZ2xlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBUb2dnbGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wIC0gTmF2YmFyLnN0aWNreS5vZmZzZXQsXG5cdFx0XHRcdFx0c2Nyb2xsVmFsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gTmF2YmFyLm5hdkJnVG9wO1xuXG5cdFx0XHRcdHNjcm9sbFZhbCA9ICggTmF2YmFyLnN0aWNreS5pc01vYmlsZSA9PT0gdHJ1ZSApID8gMCA6IHNjcm9sbFZhbCArIE5hdmJhci5zdGlja3kuc2Nyb2xsQ29ycmVjdGlvbjtcblxuXHRcdFx0XHRpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0ZWxzZSBpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWxpZ2h0JykgJiYgKCBOYXZiYXIubmF2QmcgIT0gJ2JnLWRhcmsnIHx8IG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSApIHsgYmdUb3BDbHMgPSAnYmctbGlnaHQnOyB9XG5cblx0XHRcdFx0aWYgKCBzY3JvbGxWYWwgPiBuYXZQb3MgJiYgKCBtaXh0X29wdC5uYXYubGF5b3V0ICE9ICd2ZXJ0aWNhbCcgfHwgISBOYXZiYXIuc3RpY2t5LmlzTW9iaWxlICkgKSB7ICBcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKE5hdmJhci5uYXZCZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKE5hdmJhci5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBNZW51IEZ1bmN0aW9uc1xuXHRcdG1lbnU6IHtcblxuXHRcdFx0Ly8gUHJldmVudCBuYXZiYXIgc3VibWVudSBvdmVyZmxvdyBvdXQgb2Ygdmlld3BvcnRcblx0XHRcdG92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXG5cdFx0XHRcdFx0bWFpblN1YiA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51IC5kcm9wZG93bi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IC5zdWItbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiBhJyk7XG5cblx0XHRcdFx0aWYgKCBuYXZiYXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRuYXZiYXJPZmYgPSBuYXZiYXIub3V0ZXJXaWR0aCgpICsgcGFyc2VJbnQobmF2YmFyLm9mZnNldCgpLmxlZnQsIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc2V0IG1vYmlsZSBhZGp1c3RtZW50c1xuXHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcblxuXHRcdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXG5cdFx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHN1YiAgICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdHRvcFN1YiAgID0gc3ViLFxuXHRcdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXG5cdFx0XHRcdFx0XHRzdWJQb3MgICA9IHBhcnNlSW50KHN1Yi5vZmZzZXQoKS5sZWZ0LCAxMCksXG5cdFx0XHRcdFx0XHRzdWJXICAgICA9IHN1Yi5vdXRlcldpZHRoKCkgKyAxLFxuXHRcdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxuXHRcdFx0XHRcdFx0bmVzdFN1YnMgPSBzdWIuY2hpbGRyZW4oJy5kcm9wLXN1Ym1lbnUnKSxcblx0XHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IG5lc3RTdWJzLFxuXHRcdFx0XHRcdFx0Y29ycmVjdGlvbjtcblxuXHRcdFx0XHRcdGlmICggc3ViUGFyLmlzKCcubWVnYS1tZW51LWNvbHVtbicpICkge1xuXHRcdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XG5cdFx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUb3AgTGV2ZWwgU3VibWVudXNcblx0XHRcdFx0XHRpZiAoIG5lc3RPZmYgPiBuYXZiYXJPZmYgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0XHRcdFx0XHRjb3JyZWN0aW9uID0gKG5lc3RPZmYgLSBuYXZiYXJPZmYgLSAyKSAqIC0xO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cblxuXHRcdFx0XHRcdFx0aWYgKCBuYXZiYXIuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgfHwgbmF2YmFyLnBhcmVudHMoJy5uYXZiYXInKS5oYXNDbGFzcygnYm9yZGVyZWQnKSApIHsgY29ycmVjdGlvbiAtPSAxOyB9XG5cblx0XHRcdFx0XHRcdGlmICggY29ycmVjdGlvbiA8IG1nTm93ICkge1xuXHRcdFx0XHRcdFx0XHR0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcsIGNvcnJlY3Rpb24gKyAncHgnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdE5hdmJhci5tZW51LnNldERyb3BMZWZ0KG92ZXJmbG93aW5nU3Vicyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXG5cdFx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXID0gW107XG5cdFx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHMgID0gJHRoaXMucGFyZW50cygnLnN1Yi1tZW51JyksXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xuXG5cdFx0XHRcdFx0XHRcdHBhcmVudHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXICs9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXW2ldID0gJHRoaXMub3V0ZXJXaWR0aCgpICsgcGFyZW50c1c7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAobmVzdE9mZiArIG1heE5lc3RXKSA+PSBtYWluV3JhcC53aWR0aCgpICkge1xuXHRcdFx0XHRcdFx0XHROYXZiYXIubWVudS5zZXREcm9wTGVmdChzdWJOb3cpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0TmF2YmFyLm1lbnUucmVzZXRBcnJvdyhzdWJOb3cpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBTZXQgbWVudSBkcm9wIGxlZnRcblx0XHRcdHNldERyb3BMZWZ0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wLWxlZnQnKTtcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCdhcnJvdy1sZWZ0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBSZXNldCBtZW51IGRyb3Bcblx0XHRcdHJlc2V0QXJyb3c6IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIE1lZ2EgbWVudSBlbmFibGUgLyBkaXNhYmxlXG5cdFx0XHRtZWdhTWVudVRvZ2dsZTogZnVuY3Rpb24odG9nZ2xlLCBuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG1lZ2FNZW51cztcblxuXHRcdFx0XHRpZiAoIHRvZ2dsZSA9PSAnZW5hYmxlJyApIHtcblx0XHRcdFx0XHRtZWdhTWVudXMgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudVtkYXRhLW1lZ2EtbWVudT1cInRydWVcIl0nKTtcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5hZGRDbGFzcygnbWVnYS1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbWVudScpLnJlbW92ZUF0dHIoJ2RhdGEtbWVnYS1tZW51Jyk7XG5cdFx0XHRcdFx0XHQkKCc+IC5zdWItbWVudSA+IC5kcm9wLXN1Ym1lbnUnLCBtZWdhTWVudSkucmVtb3ZlQ2xhc3MoJ2Ryb3Atc3VibWVudScpLmFkZENsYXNzKCdtZWdhLW1lbnUtY29sdW1uJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIHRvZ2dsZSA9PSAnZGlzYWJsZScgKSB7XG5cdFx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5tZWdhLW1lbnUnKTtcblx0XHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRtZWdhTWVudS5yZW1vdmVDbGFzcygnbWVnYS1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbWVudScpLmF0dHIoJ2RhdGEtbWVnYS1tZW51JywgJ3RydWUnKTtcblx0XHRcdFx0XHRcdG1lZ2FNZW51LmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uJykucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKS5hZGRDbGFzcygnZHJvcC1zdWJtZW51Jyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIENyZWF0ZSBtZWdhIG1lbnUgcm93cyBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDQgY29sdW1uc1xuXHRcdFx0bWVnYU1lbnVSb3dzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bWFpbldyYXAuZmluZCgnLm1lZ2EtbWVudScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBtYWluTWVudSA9ICQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLFxuXHRcdFx0XHRcdFx0Y29sdW1ucyAgPSBtYWluTWVudS5jaGlsZHJlbignLm1lZ2EtbWVudS1jb2x1bW4nKTtcblxuXHRcdFx0XHRcdGlmICggY29sdW1ucy5sZW5ndGggPiA0ICkgbWFpbk1lbnUuYWRkQ2xhc3MoJ211bHRpLXJvdycpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0fSxcblxuXHRcdC8vIE1vYmlsZSBGdW5jdGlvbnNcblx0XHRtb2JpbGU6IHtcblxuXHRcdFx0ZGV2aWNlOiBudWxsLFxuXG5cdFx0XHQvLyBUcmlnZ2VyIG1vYmlsZSBmdW5jdGlvbnNcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdFx0XHROYXZiYXIubW9iaWxlLmRldmljZSA9IGRldmljZTtcblxuXHRcdFx0XHQkKCcuZHJvcGRvd24tdG9nZ2xlID4gLmRyb3AtYXJyb3cnLCBtYWluTmF2QmFyKS5kYXRhKCduby1oYXNoLXNjcm9sbCcsIHRydWUpO1xuXG5cdFx0XHRcdC8vIFNob3cvaGlkZSBzdWJtZW51cyBvbiBoYW5kbGUgY2xpY2tcblx0XHRcdFx0JCgnLmRyb3Bkb3duLXRvZ2dsZScsIG1haW5OYXZCYXIpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoICQoZXZlbnQudGFyZ2V0KS5pcygnLmRyb3AtYXJyb3cnKSApIHtcblx0XHRcdFx0XHRcdGlmICggZXZlbnQuaGFuZGxlZCAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXG5cdFx0XHRcdFx0XHRcdFx0bWVudSAgID0gaGFuZGxlLmNsb3Nlc3QoJy5tZW51LWl0ZW0nKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIG1lbnUuaGFzQ2xhc3MoJ2V4cGFuZCcpICkge1xuXHRcdFx0XHRcdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtZW51KS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWVudS5hZGRDbGFzcygnZXhwYW5kJykuc2libGluZ3MoJ2xpJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpLmZpbmQoJy5leHBhbmQnKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXG5cdFx0XHRcdFx0XHRcdGV2ZW50LmhhbmRsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1haW5OYXZCYXIpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcblx0XHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHROYXZiYXIubW9iaWxlLnNjcm9sbE5hdigpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2Nyb2xsUG9zOiAwLFxuXG5cdFx0XHQvLyBFbmFibGUgbmF2IHNjcm9sbGluZyBpZiBuYXZiYXIgaGVpZ2h0ID4gdmlld3BvcnRcblx0XHRcdHNjcm9sbE5hdjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBOYXZiYXIubW9iaWxlLmRldmljZSA9PSAndGFibGV0JyApIHtcblx0XHRcdFx0XHR2YXIgdmlld3BvcnRIICAgICA9IHZpZXdwb3J0LmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0bmF2YmFySGVhZGVySCA9IG1haW5OYXZIZWFkLmhlaWdodCgpICsgMSxcblx0XHRcdFx0XHRcdG5hdmJhcklubmVySCAgPSBtYWluTmF2SW5uZXIuaGFzQ2xhc3MoJ2luJykgPyBtYWluTmF2SW5uZXIuaGVpZ2h0KCkgOiAwLFxuXHRcdFx0XHRcdFx0bmF2YmFySCAgICAgICA9IG5hdmJhckhlYWRlckggKyBuYXZiYXJJbm5lckgsXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgICAgID0gbWFpbk5hdkJhci5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wO1xuXG5cdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wIC09IGFkbWluQmFySDtcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbmF2YmFySCA+IHZpZXdwb3J0SCApIHtcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLm5vdCgnc3RvcHBlZCcpICkge1xuXHRcdFx0XHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBQcmV2ZW50IHNjcm9sbGluZyBhYm92ZSBuYXZiYXJcblx0XHRcdHN0b3BTY3JvbGw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgdmlld1Njcm9sbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdHN0b3BTY3JvbGwgPSBtYWluTmF2QmFyLmhhc0NsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdGlmICggTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPiBtYWluTmF2SGVhZC5vZmZzZXQoKS50b3AgKSB7IHN0b3BTY3JvbGwgPSBmYWxzZTsgfVxuXHRcdFx0XHRpZiAoIE5hdmJhci5tb2JpbGUuc2Nyb2xsUG9zID4gdmlld1Njcm9sbCAmJiBzdG9wU2Nyb2xsICkgeyB2aWV3cG9ydC5zY3JvbGxUb3AoTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MpOyB9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0TmF2YmFyLmluaXQoJCh0aGlzKSk7XG5cdH0pO1xuXHRcblx0TmF2YmFyLm1lbnUubWVnYU1lbnVSb3dzKCk7XG5cblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdCQoJ3N0eWxlW2RhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIl0nKS5yZW1vdmUoKTtcblx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJykuYWRkQ2xhc3MoJ2luaXQnKTtcblx0XHROYXZiYXIuaW5pdChtYWluTmF2QmFyKTtcblxuXHR9KTtcblxuXHRzZWNOYXZCYXIub24oJ3JlZnJlc2gnLCBmdW5jdGlvbigpIHtcblx0XHRzZWNOYXZCYXIucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0IGJnLWRhcmsnKTtcblx0XHROYXZiYXIuaW5pdChzZWNOYXZCYXIpO1xuXHR9KTtcblxuXG5cdC8vIENoZWNrIHdoaWNoIG1lZGlhIHF1ZXJpZXMgYXJlIGFjdGl2ZVxuXHR2YXIgbXFDaGVjayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2YmFyLWRhdGEnKSwgJzphZnRlcicpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cIi9nLCAnJyk7XG5cdH07XG5cblxuXHQvLyBFbmFibGUgbWVudSBob3ZlciBvbiB0b3VjaCBzY3JlZW5zXG5cdHZhciBtZW51UGFyZW50cyA9IG5hdmJhcnMuZmluZCgnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW46bm90KC5tZWdhLW1lbnUtY29sdW1uKSwgbGkuZHJvcGRvd24nKTtcblx0ZnVuY3Rpb24gbWVudVRvdWNoSG92ZXIoZXZlbnQpIHtcblx0XHR2YXIgaXRlbSA9ICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLFxuXHRcdFx0YW5jZXN0b3JzID0gaXRlbS5wYXJlbnRzKCcuaG92ZXInKTtcblx0XHRpZiAoIGl0ZW0uaGFzQ2xhc3MoJ2hvdmVyJykgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXRlbS5hZGRDbGFzcygnaG92ZXInKTtcblx0XHRcdG1lbnVQYXJlbnRzLm5vdChpdGVtKS5ub3QoYW5jZXN0b3JzKS5yZW1vdmVDbGFzcygnaG92ZXInKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIG1lbnVUb3VjaFJlbW92ZUhvdmVyKGV2ZW50KSB7XG5cdFx0aWYgKCAhICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLmlzKG1lbnVQYXJlbnRzKSAmJiAhICQoZXZlbnQudGFyZ2V0KS5pcygnaW5wdXQnKSApIHsgbWVudVBhcmVudHMucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7IH1cblx0fVxuXG5cblx0Ly8gRW5zdXJlIHZlcnRpY2FsIG5hdmJhciBpdGVtcyBmaXQgaW4gdmlld3BvcnRcblx0ZnVuY3Rpb24gdmVydGljYWxOYXZGaXRWaWV3KCkge1xuXHRcdGlmICggdmlld3BvcnQuaGVpZ2h0KCkgPCBtYWluTmF2Q29udC5pbm5lckhlaWdodCgpICkge1xuXHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MoJ3ZlcnRpY2FsLWZpeGVkJykuYWRkQ2xhc3MoJ3ZlcnRpY2FsLXN0YXRpYycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtc3RhdGljJykuYWRkQ2xhc3MoJ3ZlcnRpY2FsLWZpeGVkJyk7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBIYW5kbGUgbmF2YmFyIGl0ZW1zIG92ZXJsYXBcblx0ZnVuY3Rpb24gbmF2YmFyT3ZlcmxhcCgpIHtcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCksXG5cdFx0XHRtYWluTmF2TG9nb0NscyA9ICdsb2dvLScgKyBtYWluTmF2V3JhcC5hdHRyKCdkYXRhLWxvZ28tYWxpZ24nKTtcblxuXHRcdC8vIFByaW1hcnkgTmF2YmFyXG5cdFx0aWYgKCBtYWluTmF2TG9nb0NscyAhPSAnbG9nby1jZW50ZXInICYmIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ2hvcml6b250YWwnICkge1xuXHRcdFx0bWFpbk5hdldyYXAuYWRkKG1lZGlhV3JhcCkucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyJykuYWRkQ2xhc3MobWFpbk5hdkxvZ29DbHMpO1xuXHRcdFx0aWYgKCBtcU5hdiA9PSAnZGVza3RvcCcgKSB7XG5cdFx0XHRcdHZhciBtYWluTmF2Q29udFdpZHRoID0gbWFpbk5hdkNvbnQud2lkdGgoKSxcblx0XHRcdFx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IG1haW5OYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcblx0XHRcdFx0aWYgKCBtYWluTmF2SXRlbXNXaWR0aCA+IG1haW5OYXZDb250V2lkdGggKSB7XG5cdFx0XHRcdFx0bWFpbk5hdldyYXAuYWRkKG1lZGlhV3JhcCkucmVtb3ZlQ2xhc3MobWFpbk5hdkxvZ29DbHMpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2Vjb25kYXJ5IE5hdmJhclxuXHRcdGlmICggc2VjTmF2QmFyLmxlbmd0aCApIHtcblx0XHRcdHNlY05hdkJhci5yZW1vdmVDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xuXHRcdFx0dmFyIHNlY05hdkNvbnRXaWR0aCA9IHNlY05hdkNvbnQud2lkdGgoKSxcblx0XHRcdFx0c2VjTmF2SXRlbXNXaWR0aCA9ICQoJy5sZWZ0LWNvbnRlbnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcucmlnaHQtY29udGVudCcsIHNlY05hdkJhcikub3V0ZXJXaWR0aCh0cnVlKTtcblx0XHRcdGlmICggc2VjTmF2SXRlbXNXaWR0aCA+IHNlY05hdkNvbnRXaWR0aCApIHtcblx0XHRcdFx0c2VjTmF2QmFyLmFkZENsYXNzKCdpdGVtcy1vdmVybGFwJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBPbmUtUGFnZSBOYXZpZ2F0aW9uXG5cdGZ1bmN0aW9uIG9uZVBhZ2VOYXYoKSB7XG5cdFx0dmFyIG9mZnNldCA9IDAsXG5cdFx0XHRzcHlEYXRhID0gYm9keUVsLmRhdGEoJ2JzLnNjcm9sbHNweScpO1xuXG5cdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmIG1haW5OYXZCYXIuZGF0YSgnZml4ZWQnKSApIHsgb2Zmc2V0ICs9IG1haW5OYXZCYXIub3V0ZXJIZWlnaHQoKTsgfVxuXHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSAmJiAkKCcjd3BhZG1pbmJhcicpLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnICkgeyBvZmZzZXQgKz0gJCgnI3dwYWRtaW5iYXInKS5oZWlnaHQoKTsgfVxuXG5cdFx0JCgnLm9uZS1wYWdlLXJvdycpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJvdyA9ICQodGhpcyk7XG5cblx0XHRcdGlmICggcm93LmlzKCc6Zmlyc3QtY2hpbGQnKSApIHtcblx0XHRcdFx0dmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudC5vbmUtcGFnZScpO1xuXHRcdFx0XHRwYWdlQ29udGVudC5jc3MoJ21hcmdpbi10b3AnLCAnJyk7XG5cdFx0XHRcdHJvdy5jc3MoJ3BhZGRpbmctdG9wJywgcGFnZUNvbnRlbnQuY3NzKCdtYXJnaW4tdG9wJykpO1xuXHRcdFx0XHRwYWdlQ29udGVudC5jc3MoJ21hcmdpbi10b3AnLCAwKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBwcmV2Um93ID0gcm93LnByZXYoKTtcblx0XHRcdFx0aWYgKCAhIHByZXZSb3cuaGFzQ2xhc3MoJ3JvdycpICkgcHJldlJvdyA9IHByZXZSb3cucHJldignLnJvdycpO1xuXG5cdFx0XHRcdHByZXZSb3cuY3NzKCdtYXJnaW4tYm90dG9tJywgJycpO1xuXHRcdFx0XHRyb3cuY3NzKCdwYWRkaW5nLXRvcCcsIHByZXZSb3cuY3NzKCdtYXJnaW4tYm90dG9tJykpO1xuXHRcdFx0XHRwcmV2Um93LmNzcygnbWFyZ2luLWJvdHRvbScsIDApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCBzcHlEYXRhICkge1xuXHRcdFx0c3B5RGF0YS5vcHRpb25zLm9mZnNldCA9IG9mZnNldDtcblx0XHRcdGJvZHlFbC5zY3JvbGxzcHkoJ3JlZnJlc2gnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ym9keUVsLnNjcm9sbHNweSh7XG5cdFx0XHRcdHRhcmdldDogJyNtYWluLW5hdicsXG5cdFx0XHRcdG9mZnNldDogb2Zmc2V0XG5cdFx0XHR9KTtcblxuXHRcdFx0bWFpbk5hdkJhci5vbignYWN0aXZhdGUuYnMuc2Nyb2xsc3B5JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRtYWluTmF2SW5uZXIuY29sbGFwc2UoJ2hpZGUnKTtcblx0XHRcdFx0fSwgMTAwICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXG5cdC8vIEZ1bmN0aW9ucyBSdW4gT24gTG9hZCAmIFdpbmRvdyBSZXNpemVcblx0ZnVuY3Rpb24gbmF2YmFyRm4oKSB7XG5cdFx0dmFyIG1xTmF2ID0gbXFDaGVjaygpO1xuXG5cdFx0Ly8gUnVuIGZ1bmN0aW9uIHRvIHByZXZlbnQgc3VibWVudXMgZ29pbmcgb3V0c2lkZSB2aWV3cG9ydFxuXHRcdG5hdmJhcnMubm90KG1haW5OYXZCYXIpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0TmF2YmFyLm1lbnUub3ZlcmZsb3coJCgnLm5hdmJhci1pbm5lcicsIHRoaXMpKTtcblx0XHR9KTtcblxuXHRcdC8vIFJ1biBmdW5jdGlvbnMgYmFzZWQgb24gY3VycmVudGx5IGFjdGl2ZSBtZWRpYSBxdWVyeVxuXHRcdGlmICggbXFOYXYgPT0gJ2Rlc2t0b3AnICkge1xuXHRcdFx0TmF2YmFyLm1lbnUub3ZlcmZsb3cobWFpbk5hdklubmVyKTtcblx0XHRcdG1haW5XcmFwLmFkZENsYXNzKCduYXYtZnVsbCcpLnJlbW92ZUNsYXNzKCduYXYtbWluaScpO1xuXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHROYXZiYXIubWVudS5tZWdhTWVudVRvZ2dsZSgnZW5hYmxlJywgJCh0aGlzKSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bWVudVBhcmVudHMub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XG5cdFx0XHRib2R5RWwub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fSBlbHNlIGlmICggbXFOYXYgPT0gJ21vYmlsZScgfHwgbXFOYXYgPT0gJ3RhYmxldCcgKSB7XG5cdFx0XHROYXZiYXIubW9iaWxlLnRyaWdnZXIobXFOYXYpO1xuXHRcdFx0bWFpbldyYXAuYWRkQ2xhc3MoJ25hdi1taW5pJykucmVtb3ZlQ2xhc3MoJ25hdi1mdWxsJyk7XG5cblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdE5hdmJhci5tZW51Lm1lZ2FNZW51VG9nZ2xlKCdkaXNhYmxlJywgJCh0aGlzKSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bWVudVBhcmVudHMub2ZmKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoSG92ZXIpO1xuXHRcdFx0Ym9keUVsLm9mZigndG91Y2hzdGFydCcsIG1lbnVUb3VjaFJlbW92ZUhvdmVyKTtcblx0XHR9XG5cblx0XHQvLyBNYWtlIHByaW1hcnkgbmF2YmFyIHN0aWNreSBpZiBvcHRpb24gZW5hYmxlZFxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHtcblx0XHRcdGlmICggbXFOYXYgPT0gJ21vYmlsZScgKSB7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kudHJpZ2dlcih0cnVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kudHJpZ2dlcihmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAndmVydGljYWwnICYmIG1peHRfb3B0Lm5hdlsndmVydGljYWwtbW9kZSddID09ICdmaXhlZCcgKSB7XG5cdFx0XHRpZiAoIG1xTmF2ID09ICd0YWJsZXQnICkge1xuXHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdGlja3knKTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS50cmlnZ2VyKGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1haW5OYXZCYXIuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCcpO1xuXHRcdH1cblxuXHRcdC8vIFZlcnRpY2FsIG5hdmJhciBoYW5kbGluZ1xuXHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAndmVydGljYWwnICYmIG1peHRfb3B0Lm5hdlsndmVydGljYWwtbW9kZSddID09ICdmaXhlZCcgJiYgbXFOYXYgPT0gJ2Rlc2t0b3AnICkge1xuXHRcdFx0Ly8gTWFrZSBuYXZiYXIgc3RhdGljIGlmIGl0ZW1zIGRvbid0IGZpdCBpbiB2aWV3cG9ydFxuXHRcdFx0dmVydGljYWxOYXZGaXRWaWV3KCk7XG5cdFx0fVxuXG5cdFx0bmF2YmFyT3ZlcmxhcCgpO1xuXG5cdFx0aWYgKCBtaXh0X29wdC5wYWdlWydwYWdlLXR5cGUnXSA9PSAnb25lcGFnZScgKSB7XG5cdFx0XHRvbmVQYWdlTmF2KCk7XG5cdFx0fVxuXHR9XG5cdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBuYXZiYXJGbiApKS5yZXNpemUoKTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5QT1NUIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgaWZyYW1lQXNwZWN0LCBNb2Rlcm5penIgKi9cblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXG5cdFx0Y29udGVudCAgPSAkKCcjY29udGVudCcpO1xuXG5cdC8vIFJlc2l6ZSBFbWJlZGRlZCBWaWRlb3MgUHJvcG9ydGlvbmFsbHlcblx0aWZyYW1lQXNwZWN0KCAkKCcucG9zdCBpZnJhbWUnKSApO1xuXG5cdC8vIFBvc3QgTGF5b3V0XG5cdGZ1bmN0aW9uIHBvc3RzUGFnZSgpIHtcblxuXHRcdGNvbnRlbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gRmVhdHVyZWQgR2FsbGVyeSBTbGlkZXJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdHZhciBnYWxsZXJ5U2xpZGVyID0gJCgnLmdhbGxlcnktc2xpZGVyJykubm90KCcubGlnaHRTbGlkZXInKTtcblx0XHRcdFx0Z2FsbGVyeVNsaWRlci5saWdodFNsaWRlcih7XG5cdFx0XHRcdFx0aXRlbTogMSxcblx0XHRcdFx0XHRhdXRvOiB0cnVlLFxuXHRcdFx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHRcdFx0cGFnZXI6IGZhbHNlLFxuXHRcdFx0XHRcdHBhdXNlOiA1MDAwLFxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAwLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodEdhbGxlcnkgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdCQoJy5saWdodGJveC1nYWxsZXJ5JykubGlnaHRHYWxsZXJ5KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVxdWFsaXplIGZlYXR1cmVkIG1lZGlhIGhlaWdodCBmb3IgcmVsYXRlZCBwb3N0cyBhbmQgZ3JpZCBibG9nXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHQkLmZuLm1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuYmxvZy1ncmlkIC5wb3N0cy1jb250YWluZXIgLnBvc3QtZmVhdCcpLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblxuXHRcdFx0XHRpZiAoICEgTW9kZXJuaXpyLmZsZXhib3ggKSB7XG5cdFx0XHRcdFx0JCgnLmJsb2ctZ3JpZCAucG9zdHMtY29udGFpbmVyIGFydGljbGUnKS5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XG5cblx0XHRcdFx0XHR2YXIgbWF0Y2hIZWlnaHRFbCA9ICQoJy5wb3N0LXJlbGF0ZWQgLnBvc3QtZmVhdCcpLFxuXHRcdFx0XHRcdFx0bWF0Y2hIZWlnaHRUYXJnZXQgPSBtYXRjaEhlaWdodEVsLmZpbmQoJy53cC1wb3N0LWltYWdlJyk7XG5cdFx0XHRcdFx0aWYgKCBtYXRjaEhlaWdodFRhcmdldC5sZW5ndGggPT09IDAgKSBtYXRjaEhlaWdodFRhcmdldCA9IG51bGw7XG5cdFx0XHRcdFx0bWF0Y2hIZWlnaHRFbC5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KHtcblx0XHRcdFx0XHRcdHRhcmdldDogbWF0Y2hIZWlnaHRUYXJnZXQsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdH0pO1xuXHR9XG5cblxuXHQvLyBMb2FkIFBvc3RzICYgQ29tbWVudHMgdmlhIEFqYXhcblx0ZnVuY3Rpb24gbWl4dEFqYXhMb2FkKHR5cGUpIHtcblx0XHR0eXBlID0gdHlwZSB8fCAncG9zdHMnO1xuXHRcdHZhciBwYWdDb250ID0gJCgnLnBhZ2luZy1uYXZpZ2F0aW9uJyksXG5cdFx0XHRhamF4QnRuID0gJCgnLmFqYXgtbW9yZScsIHBhZ0NvbnQpO1xuXG5cdFx0aWYgKCAhIHBhZ0NvbnQubGVuZ3RoIHx8ICEgYWpheEJ0bi5sZW5ndGggKSByZXR1cm47XG5cdFx0XG5cdFx0dmFyIHBhZ2VOb3cgPSBwYWdDb250LmRhdGEoJ3BhZ2Utbm93JyksXG5cdFx0XHRwYWdlTWF4ID0gcGFnQ29udC5kYXRhKCdwYWdlLW1heCcpLFxuXHRcdFx0bmV4dFVybCA9IGFqYXhCdG4uYXR0cignaHJlZicpLFxuXHRcdFx0cGFnZU51bSxcblx0XHRcdHBhZ2VUeXBlLFxuXHRcdFx0Y29udGFpbmVyLFxuXHRcdFx0ZWxlbWVudCxcblx0XHRcdGxvYWRTZWw7XG5cblx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XG5cdFx0XHRjb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XG5cdFx0XHRlbGVtZW50ICAgPSAnLmFydGljbGUnO1xuXHRcdFx0bG9hZFNlbCAgID0gJyAucG9zdHMtY29udGFpbmVyIC5hcnRpY2xlJztcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdzaG9wJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XG5cdFx0XHRjb250YWluZXIgPSAkKCd1bC5wcm9kdWN0cycpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5wcm9kdWN0Jztcblx0XHRcdGxvYWRTZWwgICA9ICcgdWwucHJvZHVjdHMgPiBsaSc7XG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgnLmNvbW1lbnQtbGlzdCcpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5jb21tZW50Jztcblx0XHRcdGxvYWRTZWwgICA9ICcgLmNvbW1lbnQtbGlzdCA+IGxpJztcblx0XHR9XG5cblx0XHRpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyAtIDE7XG5cdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyArIDE7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHBhZ2VOb3cgPj0gcGFnZU1heCApICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSAhPSAnbmV3ZXN0JyB8fCBwYWdlTnVtIDw9IDAgKSB7XG5cdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcblx0XHR9XG5cdFx0XG5cdFx0YWpheEJ0bi5vbignY2xpY2sgY29udDpib3R0b20nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIFByZXZlbnQgbG9hZGluZyB0d2ljZSBvbiBzY3JvbGxcblx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XG5cdFx0XG5cdFx0XHQvLyBBcmUgdGhlcmUgbW9yZSBwYWdlcyB0byBsb2FkP1xuXHRcdFx0aWYgKCBwYWdlTnVtID4gMCAmJiBwYWdlTnVtIDw9IHBhZ2VNYXggKSB7XG5cdFx0XHRcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2xvYWRpbmcnKTtcblxuXHRcdFx0XHQvLyBMb2FkIHBvc3RzXG5cdFx0XHRcdC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG5cdFx0XHRcdCQoJzxkaXY+JykubG9hZChuZXh0VXJsICsgbG9hZFNlbCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XG5cdFx0XHRcdFx0dmFyIG5ld1Bvc3RzID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdGFqYXhCdG4uYmx1cigpO1xuXG5cdFx0XHRcdFx0bmV3UG9zdHMuY2hpbGRyZW4oZWxlbWVudCkuYWRkQ2xhc3MoJ2FqYXgtbmV3Jyk7XG5cdFx0XHRcdFx0aWYgKCAoIHR5cGUgPT0gJ3Bvc3RzJyB8fCB0eXBlID09ICdzaG9wJyApICYmIG1peHRfb3B0LmxheW91dC50eXBlICE9ICdtYXNvbnJ5JyAmJiBtaXh0X29wdC5sYXlvdXRbJ3Nob3ctcGFnZS1uciddICkge1xuXHRcdFx0XHRcdFx0bmV3UG9zdHMucHJlcGVuZCgnPGRpdiBjbGFzcz1cImFqYXgtcGFnZSBwYWdlLScrIHBhZ2VOdW0gKydcIj48YSBocmVmPVwiJysgbmV4dFVybCArJ1wiPlBhZ2UgJysgcGFnZU51bSArJzwvYT48L2Rpdj4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChuZXdQb3N0cy5odG1sKCkpO1xuXG5cdFx0XHRcdFx0bmV3UG9zdHMgPSBjb250YWluZXIuY2hpbGRyZW4oJy5hamF4LW5ldycpO1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHBhZ2UgbnVtYmVyIGFuZCBuZXh0VXJsXG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcblx0XHRcdFx0XHRcdFx0cGFnZU51bS0tO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cGFnZU51bSsrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZU51bSsrO1xuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvcGFnZVxcL1swLTldPy8sICcvcGFnZS8nICsgcGFnZU51bSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYnV0dG9uIHN0YXRlXG5cdFx0XHRcdFx0aWYgKCBwYWdlTnVtIDw9IHBhZ2VNYXggJiYgcGFnZU51bSA+IDAgKSB7IGFqYXhCdG4uYnV0dG9uKCdyZXNldCcpOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpOyB9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgbGF5b3V0IG9uY2UgcG9zdHMgaGF2ZSBsb2FkZWRcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnJlbW92ZUNsYXNzKCdhamF4LW5ldycpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XG5cdFx0XHRcdFx0XHRcdGlmcmFtZUFzcGVjdCgpO1xuXHRcdFx0XHRcdFx0XHRwb3N0c1BhZ2UoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcblx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmlzb3RvcGUoJ2FwcGVuZGVkJywgbmV3UG9zdHMpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZpZXdwb3J0LnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAxMDApO1xuXG5cdFx0XHRcdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7IH1cblxuXHRcdFx0XHRcdC8vIEhhbmRsZSBFcnJvcnNcblx0XHRcdFx0XHRpZiAoIHN0YXR1cyA9PSAnZXJyb3InICkge1xuXHRcdFx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2Vycm9yJyk7XG5cdFx0XHRcdFx0XHQvLyBEZWJ1Z2dpbmcgaW5mb1xuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoJ0FKQVggRXJyb3I6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblxuXHRcdC8vIFRyaWdnZXIgQUpBWCBsb2FkIHdoZW4gcmVhY2hpbmcgYm90dG9tIG9mIHBhZ2Vcblx0XHR2YXIgYWpheFNjcm9sbEhhbmRsZSA9ICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8qIGdsb2JhbCBlbGVtVmlzaWJsZSAqL1xuXHRcdFx0XHRpZiAoIGVsZW1WaXNpYmxlKGFqYXhCdG4sIHZpZXdwb3J0KSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRhamF4QnRuLnRyaWdnZXIoJ2NvbnQ6Ym90dG9tJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcblx0XHR9XG5cdH1cblx0Ly8gRXhlY3V0ZSBGdW5jdGlvbiBXaGVyZSBBcHBsaWNhYmxlXG5cdGlmICggbWl4dF9vcHQucGFnZVsncG9zdHMtcGFnZSddICYmIG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtY2xpY2snIHx8IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaG9wJyApIHtcblx0XHRcdG1peHRBamF4TG9hZCgnc2hvcCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtaXh0QWpheExvYWQoJ3Bvc3RzJyk7XG5cdFx0fVxuXHR9XG5cdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ3NpbmdsZScgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRtaXh0QWpheExvYWQoJ2NvbW1lbnRzJyk7XG5cdH1cblxuXG5cdC8vIEZ1bmN0aW9ucyBUbyBSdW4gT24gV2luZG93IFJlc2l6ZVxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcblx0XHRpZnJhbWVBc3BlY3QoKTtcblx0fVxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgcmVzaXplRm4gKSk7XG5cblxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIExvYWRcblx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XG5cblx0XHRwb3N0c1BhZ2UoKTtcblxuXHRcdC8vIElzb3RvcGUgTWFzb25yeSBJbml0XG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdHZhciBibG9nQ29udCA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xuXG5cdFx0XHRibG9nQ29udC5pc290b3BlKHtcblx0XHRcdFx0aXRlbVNlbGVjdG9yOiAnLmFydGljbGUnLFxuXHRcdFx0XHRsYXlvdXQ6ICdtYXNvbnJ5Jyxcblx0XHRcdFx0Z3V0dGVyOiAwXG5cdFx0XHR9KTtcblxuXHRcdFx0YmxvZ0NvbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0pO1xuXHRcdFx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSApKTtcblx0XHR9XG5cblxuXHRcdC8vIFRyaWdnZXIgTGlnaHRib3ggT24gRmVhdHVyZWQgSW1hZ2UgQ2xpY2tcblx0XHQkKCcubGlnaHRib3gtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnLmdhbGxlcnknKS5maW5kKCdsaScpLmZpcnN0KCkuY2xpY2soKTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gUmVsYXRlZCBQb3N0cyBTbGlkZXJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0dmFyIHJlbFBvc3RzU2xpZGVyID0gJCgnLnBvc3QtcmVsYXRlZCAuc2xpZGVyLWNvbnQnKSxcblx0XHRcdFx0dHlwZSA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ3R5cGUnKSxcblx0XHRcdFx0Y29scyA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ2NvbHMnKSxcblx0XHRcdFx0dGFibGV0Q29scyA9IHJlbFBvc3RzU2xpZGVyLmRhdGEoJ3RhYmxldC1jb2xzJyksXG5cdFx0XHRcdG1vYmlsZUNvbHMgPSByZWxQb3N0c1NsaWRlci5kYXRhKCdtb2JpbGUtY29scycpO1xuXHRcdFx0cmVsUG9zdHNTbGlkZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVsUG9zdHNTbGlkZXIubGlnaHRTbGlkZXIoe1xuXHRcdFx0XHRcdGl0ZW06IGNvbHMsXG5cdFx0XHRcdFx0Y29udHJvbHM6ICh0eXBlID09ICdtZWRpYScpLFxuXHRcdFx0XHRcdHBhZ2VyOiAodHlwZSA9PSAndGV4dCcpLFxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAyMCxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbe1xuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogMTIwMCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IHRhYmxldENvbHMgfVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDU4MCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IG1vYmlsZUNvbHMgfVxuXHRcdFx0XHRcdH1dLFxuXHRcdFx0XHRcdG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZWxQb3N0c1NsaWRlci5yZW1vdmVDbGFzcygnaW5pdCcpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdFx0JCgnLnBvc3QtZmVhdCcsIHJlbFBvc3RzU2xpZGVyKS5tYXRjaEhlaWdodCgpO1xuXHRcdFx0XHRcdFx0XHRyZWxQb3N0c1NsaWRlci5jc3MoJ2hlaWdodCcsICcnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5VSSBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXG5cdFx0aHRtbEVsICAgPSAkKCdodG1sJyksXG5cdFx0Ym9keUVsICAgPSAkKCdib2R5Jyk7XG5cblxuXHQvLyBTcGlubmVyIElucHV0XG5cdCQoJy5taXh0LXNwaW5uZXInKS5vbignY2xpY2snLCAnLmJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkZWwgICAgID0gJCh0aGlzKSxcblx0XHRcdHNwaW5uZXIgPSAkZWwucGFyZW50cygnLm1peHQtc3Bpbm5lcicpLFxuXHRcdFx0aW5wdXQgICA9IHNwaW5uZXIuY2hpbGRyZW4oJy5zcGlubmVyLXZhbCcpLFxuXHRcdFx0c3RlcCAgICA9IGlucHV0LmF0dHIoJ3N0ZXAnKSB8fCAxLFxuXHRcdFx0bWluVmFsICA9IGlucHV0LmF0dHIoJ21pbicpIHx8IDAsXG5cdFx0XHRtYXhWYWwgID0gaW5wdXQuYXR0cignbWF4JykgfHwgbnVsbCxcblx0XHRcdHZhbCAgICAgPSBpbnB1dC52YWwoKSxcblx0XHRcdG5ld1ZhbDtcblx0XHRpZiAoIGlzTmFOKHZhbCkgKSB2YWwgPSBtaW5WYWw7XG5cdFx0XG5cdFx0aWYgKCAkZWwuaGFzQ2xhc3MoJ21pbnVzJykgKSB7XG5cdFx0XHQvLyBEZWNyZWFzZVxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpIC0gcGFyc2VGbG9hdChzdGVwKTtcblx0XHRcdGlmICggbmV3VmFsIDwgbWluVmFsICkgbmV3VmFsID0gbWluVmFsO1xuXHRcdFx0aW5wdXQudmFsKG5ld1ZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEluY3JlYXNlXG5cdFx0XHRuZXdWYWwgPSBwYXJzZUZsb2F0KHZhbCkgKyBwYXJzZUZsb2F0KHN0ZXApO1xuXHRcdFx0aWYgKCBtYXhWYWwgIT09IG51bGwgJiYgbmV3VmFsID4gbWF4VmFsICkgbmV3VmFsID0gbWF4VmFsO1xuXHRcdFx0aW5wdXQudmFsKG5ld1ZhbCk7XG5cdFx0fVxuXHR9KTtcblxuXG5cdC8vIENvbnRlbnQgRmlsdGVyaW5nXG5cdCQoJy5jb250ZW50LWZpbHRlci1saW5rcycpLmNoaWxkcmVuKCkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcblx0XHRcdGZpbHRlciA9IGxpbmsuZGF0YSgnZmlsdGVyJyksXG5cdFx0XHRjb250ZW50ID0gJCgnLicgKyBsaW5rLnBhcmVudHMoJy5jb250ZW50LWZpbHRlci1saW5rcycpLmRhdGEoJ2NvbnRlbnQnKSksXG5cdFx0XHRmaWx0ZXJDbGFzcyA9ICdmaWx0ZXItaGlkZGVuJztcblx0XHRsaW5rLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRpZiAoIGZpbHRlciA9PSAnYWxsJyApIHsgY29udGVudC5maW5kKCcuJytmaWx0ZXJDbGFzcykucmVtb3ZlQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlRG93big2MDApOyB9XG5cdFx0ZWxzZSB7IGNvbnRlbnQuZmluZCgnLicgKyBmaWx0ZXIpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKS5zaWJsaW5ncygnOm5vdCguJytmaWx0ZXIrJyknKS5hZGRDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVVcCg2MDApOyB9XG5cdH0pO1xuXG5cblx0Ly8gU29ydCBwb3J0Zm9saW8gaXRlbXNcblx0JCgnLnBvcnRmb2xpby1zb3J0ZXIgYScpLmNsaWNrKCBmdW5jdGlvbihldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGVsZW0gPSAkKHRoaXMpLFxuXHRcdFx0dGFyZ2V0VGFnID0gZWxlbS5kYXRhKCdzb3J0JyksXG5cdFx0XHR0YXJnZXRDb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XG5cblx0XHRlbGVtLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuXHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICYmIHR5cGVvZiAkLmZuLmlzb3RvcGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRpZiAodGFyZ2V0VGFnID09ICdhbGwnKSB7XG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnKicgfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0YXJnZXRDb250YWluZXIuaXNvdG9wZSh7IGZpbHRlcjogJy4nICsgdGFyZ2V0VGFnIH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcHJvamVjdHMgPSB0YXJnZXRDb250YWluZXIuY2hpbGRyZW4oJy5wb3J0Zm9saW8nKTtcblx0XHRcdGlmICggdGFyZ2V0VGFnID09ICdhbGwnICkge1xuXHRcdFx0XHRwcm9qZWN0cy5mYWRlSW4oMzAwKS5hZGRDbGFzcygnZmlsdGVyZWQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByb2plY3RzLmZhZGVPdXQoMCkucmVtb3ZlQ2xhc3MoJ2ZpbHRlcmVkJykuZmlsdGVyKCcuJyArIHRhcmdldFRhZykuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2ZpbHRlcmVkJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXG5cdC8vIE9mZnNldCBzY3JvbGxpbmcgdG8gbGluayBhbmNob3IgKGhhc2gpXG5cdCQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcblx0XHRcdGhhc2ggPSBsaW5rLmF0dHIoJ2hyZWYnKTtcblxuXHRcdGlmICggbGluay5kYXRhKCduby1oYXNoLXNjcm9sbCcpIHx8ICQoZS50YXJnZXQpLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJykgfHwgaGFzaCA9PSAnIycgKSByZXR1cm4gdHJ1ZTtcblxuXHRcdGlmICggaGFzaC5sZW5ndGggKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gJChoYXNoKTtcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgaGFzaE9mZnNldCA9ICQoaGFzaCkub2Zmc2V0KCkudG9wICsgMTtcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmICQoJyNtYWluLW5hdicpLmRhdGEoJ2ZpeGVkJykgKSB7IGhhc2hPZmZzZXQgLT0gJCgnI21haW4tbmF2Jykub3V0ZXJIZWlnaHQoKTsgfVxuXHRcdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gJiYgJCgnI3dwYWRtaW5iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJyApIHsgaGFzaE9mZnNldCAtPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpOyB9XG5cdFx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBoYXNoT2Zmc2V0IH0sIDYwMCApO1xuXHRcdFx0fVxuXHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sICcnLCBoYXNoKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHQvLyBJZ25vcmUgc3BlY2lmaWMgYW5jaG9yc1xuXHQkKCcudGFicyBhLCAudmNfdHRhIGEsIC51aS1hY2NvcmRpb24gYScpLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJywgdHJ1ZSk7XG5cblxuXHQvLyBTb2NpYWwgSWNvbnNcblx0JCgnLnNvY2lhbC1saW5rcycpLm5vdCgnLmhvdmVyLW5vbmUnKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udCA9ICQodGhpcyk7XG5cblx0XHRjb250LmNoaWxkcmVuKCkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaWNvbiA9ICQodGhpcyksXG5cdFx0XHRcdGxpbmsgPSBpY29uLmNoaWxkcmVuKCdhJyksXG5cdFx0XHRcdGRhdGFDb2xvciA9IGxpbmsuYXR0cignZGF0YS1jb2xvcicpO1xuXG5cdFx0XHRpZiAoIGNvbnQuaGFzQ2xhc3MoJ2hvdmVyLWJnJykgfHwgY29udC5wYXJlbnRzKCcubm8taG92ZXItYmcnKS5sZW5ndGggKSB7XG5cdFx0XHRcdGxpbmsuaG92ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiBkYXRhQ29sb3IsIGJvcmRlckNvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiAnJywgYm9yZGVyQ29sb3I6ICcnLCB6SW5kZXg6ICcnIH0pOyB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxpbmsuaG92ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGxpbmsuY3NzKHsgY29sb3I6IGRhdGFDb2xvciwgekluZGV4OiAxIH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBjb2xvcjogJycsIHpJbmRleDogJycgfSk7IH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXG5cdC8vIEZ1bmN0aW9ucyBydW4gb24gcGFnZSBsb2FkIGFuZCBcInJlZnJlc2hcIiBldmVudFxuXHRmdW5jdGlvbiBydW5PblJlZnJlc2goKSB7XG5cdFx0Ly8gVG9vbHRpcHMgSW5pdFxuXHRcdCQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0sIC5yZWxhdGVkLXRpdGxlLXRpcCcpLnRvb2x0aXAoe1xuXHRcdFx0cGxhY2VtZW50OiAnYXV0bycsXG5cdFx0XHRjb250YWluZXI6ICdib2R5J1xuXHRcdH0pO1xuXG5cblx0XHQvLyBPbiBIb3ZlciBBbmltYXRpb25zIEluaXRcblx0XHR2YXIgYW5pbUhvdmVyRWwgPSAkKCcuYW5pbS1vbi1ob3ZlcicpO1xuXHRcdGFuaW1Ib3ZlckVsLmhvdmVySW50ZW50KCBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyZWQnKTtcblx0XHRcdHZhciBpbm5lciAgID0gJCh0aGlzKS5jaGlsZHJlbignLm9uLWhvdmVyJyksXG5cdFx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXG5cdFx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0Jztcblx0XHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1PdXQpLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbUluKTtcblx0XHR9LCBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2hvdmVyZWQnKTtcblx0XHRcdHZhciBpbm5lciAgID0gJCh0aGlzKS5jaGlsZHJlbignLm9uLWhvdmVyJyksXG5cdFx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXG5cdFx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0Jztcblx0XHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1JbikuYWRkQ2xhc3MoYW5pbU91dCk7XG5cdFx0fSwgMzAwKTtcblx0XHRhbmltSG92ZXJFbC5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIE1TQW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgJCh0aGlzKS5oYXNDbGFzcygnaG92ZXJlZCcpICkge1xuXHRcdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHR2aWV3cG9ydC5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJ1bk9uUmVmcmVzaCgpO1xuXHR9KS50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cblxuXHQvLyBCYWNrIFRvIFRvcCBCdXR0b25cblx0dmFyIGJhY2tUb1RvcCA9ICQoJyNiYWNrLXRvLXRvcCcpO1xuXG5cdGZ1bmN0aW9uIGJhY2tUb1RvcERpc3BsYXkoKSB7XG5cdFx0dmFyIHNjcm9sbFRvcCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpO1xuXHRcdGlmICggc2Nyb2xsVG9wID4gMjAwICkge1xuXHRcdFx0YmFja1RvVG9wLmZhZGVJbigzMDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRiYWNrVG9Ub3AuZmFkZU91dCgzMDApO1xuXHRcdH1cblx0fVxuXG5cdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHtcblx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgJC50aHJvdHRsZSggMTAwMCwgYmFja1RvVG9wRGlzcGxheSApKS5zY3JvbGwoKTtcblxuXHRcdGJhY2tUb1RvcC5jbGljayggZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aHRtbEVsLmFkZChib2R5RWwpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgNjAwKTtcblx0XHR9KTtcblx0fVxuXG5cdFxuXHQvLyBJbmZvIEJhclxuXHR2YXIgaW5mb0JhcldyYXAgPSAkKCcjaW5mby1iYXItd3JhcCcpLFxuXHRcdGluZm9CYXIgPSBpbmZvQmFyV3JhcC5jaGlsZHJlbignLmluZm8tYmFyJyk7XG5cblx0ZnVuY3Rpb24gaW5mb0JhclN0aWNreSgpIHtcblx0XHR2YXIgYmFySGVpZ2h0ID0gaW5mb0Jhci5vdXRlckhlaWdodCgpO1xuXHRcdGluZm9CYXJXcmFwLmNzcygnbWluLWhlaWdodCcsIGJhckhlaWdodCk7XG5cdFx0aWYgKCBiYWNrVG9Ub3AubGVuZ3RoICkgeyBiYWNrVG9Ub3AuY3NzKCdtYXJnaW4tYm90dG9tJywgYmFySGVpZ2h0KTsgfVxuXHR9XG5cblx0aWYgKCBpbmZvQmFyLmxlbmd0aCApIHtcblx0XHRpbmZvQmFyLmZpbmQoJy5pbmZvLWNsb3NlJykuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdFx0aW5mb0JhcldyYXAuZmFkZU91dCgzMDApO1xuXHRcdFx0aWYgKCBiYWNrVG9Ub3AubGVuZ3RoICkgeyBiYWNrVG9Ub3AuY3NzKCdtYXJnaW4tYm90dG9tJywgJycpOyB9XG5cdFx0fSk7XG5cdFx0aWYgKCBpbmZvQmFyLmhhc0NsYXNzKCdzdGlja3knKSApIHsgaW5mb0JhclN0aWNreSgpOyB9XG5cdH1cblxufSkoalF1ZXJ5KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

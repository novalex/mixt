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
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function() {
    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = this.ElementQueries = function() {

        this.withTracking = false;
        var elements = [];

        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = getComputedStyle(element, 'fontSize');
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param {HTMLElement} element
         * @param {*} value
         * @returns {*}
         */
        function convertToPx(element, value) {
            var units = value.replace(/[0-9]*/, '');
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = {};
            var key, option, width = 0, height = 0, value, actualValue, attrValues, attrValue, attrName;

            /**
             * @param {Object} option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                var idx = [option.mode, option.property, option.value].join(',');
                this.options[idx] = option;
            };

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (key in this.options) {
                    if (!this.options.hasOwnProperty(key)){
                        continue;
                    }
                    option = this.options[key];

                    value = convertToPx(this.element, option.value);

                    actualValue = option.property == 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode == 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode == 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' '+attrValues[attrName]+' ').indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k], attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                element.elementQueriesSensor = new ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();

            if (this.withTracking) {
                elements.push(element);
            }
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        function queueQuery(selector, mode, property, value) {
            var query;
            if (document.querySelectorAll) query = document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            var elements = query(selector);
            for (var i = 0, j = elements.length; i < j; i++) {
                setupElement(elements[i], {
                    mode: mode,
                    property: property,
                    value: value
                });
            }
        }

        var regex = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;

        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match;
            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                if (5 < match.length) {
                    queueQuery(match[1] || match[5], match[2], match[3], match[4]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';
            if (!rules) {
                return;
            }
            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') || -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        }else if(-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    }
                }
            }
        }

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.init = function(withTracking) {
            this.withTracking = withTracking;
            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                try {
                    readRules(document.styleSheets[i].cssText || document.styleSheets[i].cssRules || document.styleSheets[i].rules);
                } catch(e) {
                    if (e.name !== 'SecurityError') {
                        throw e;
                    }
                }
            }
        };

        /**
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.update = function(withTracking) {
            this.withTracking = withTracking;
            this.init();
        };

        this.detach = function() {
            if (!this.withTracking) {
                throw 'withTracking is not enabled. We can not detach elements since we don not store it.' +
                'Use ElementQueries.withTracking = true; before domready.';
            }

            var element;
            while (element = elements.pop()) {
                ElementQueries.detach(element);
            }

            elements = [];
        };
    };

    /**
     *
     * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
     *                               (no garbage collection possible if you don not call .detach() first)
     */
    ElementQueries.update = function(withTracking) {
        ElementQueries.instance.update(withTracking);
    };

    /**
     * Removes all sensor and elementquery information from the element.
     *
     * @param {HTMLElement} element
     */
    ElementQueries.detach = function(element) {
        if (element.elementQueriesSetupInformation) {
            element.elementQueriesSensor.detach();
            delete element.elementQueriesSetupInformation;
            delete element.elementQueriesSensor;
            console.log('detached');
        } else {
            console.log('detached already', element);
        }
    };

    ElementQueries.withTracking = false;

    ElementQueries.init = function() {
        if (!ElementQueries.instance) {
            ElementQueries.instance = new ElementQueries();
        }

        ElementQueries.instance.init(ElementQueries.withTracking);
    };

    var domLoaded = function (callback) {
        /* Internet Explorer */
        /*@cc_on
        @if (@_win32 || @_win64)
            document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
            document.getElementById('ieScriptLoad').onreadystatechange = function() {
                if (this.readyState == 'complete') {
                    callback();
                }
            };
        @end @*/
        /* Mozilla, Chrome, Opera */
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
        /* Safari, iCab, Konqueror */
        if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
            var DOMLoadTimer = setInterval(function () {
                if (/loaded|complete/i.test(document.readyState)) {
                    callback();
                    clearInterval(DOMLoadTimer);
                }
            }, 10);
        }
        /* Other web browsers */
        window.onload = callback;
    };

    if (window.addEventListener) {
        window.addEventListener('load', ElementQueries.init, false);
    } else {
        window.attachEvent('onload', ElementQueries.init);
    }
    domLoaded(ElementQueries.init);

})();

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


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});

/*!
 * Isotope PACKAGED v2.1.1
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

(function(t){function e(){}function i(t){function i(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function n(e,i){t.fn[e]=function(n){if("string"==typeof n){for(var s=o.call(arguments,1),a=0,u=this.length;u>a;a++){var p=this[a],h=t.data(p,e);if(h)if(t.isFunction(h[n])&&"_"!==n.charAt(0)){var f=h[n].apply(h,s);if(void 0!==f)return f}else r("no such method '"+n+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; "+"attempted to call '"+n+"'")}return this}return this.each(function(){var o=t.data(this,e);o?(o.option(n),o._init()):(o=new i(this,n),t.data(this,e,o))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){i(e),n(t,e)},t.bridget}}var o=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):"object"==typeof exports?i(require("jquery")):i(t.jQuery)})(window),function(t){function e(e){var i=t.event;return i.target=i.target||i.srcElement||e,i}var i=document.documentElement,o=function(){};i.addEventListener?o=function(t,e,i){t.addEventListener(e,i,!1)}:i.attachEvent&&(o=function(t,i,o){t[i+o]=o.handleEvent?function(){var i=e(t);o.handleEvent.call(o,i)}:function(){var i=e(t);o.call(t,i)},t.attachEvent("on"+i,t[i+o])});var n=function(){};i.removeEventListener?n=function(t,e,i){t.removeEventListener(e,i,!1)}:i.detachEvent&&(n=function(t,e,i){t.detachEvent("on"+e,t[e+i]);try{delete t[e+i]}catch(o){t[e+i]=void 0}});var r={bind:o,unbind:n};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(this),function(t){function e(t){"function"==typeof t&&(e.isReady?t():s.push(t))}function i(t){var i="readystatechange"===t.type&&"complete"!==r.readyState;e.isReady||i||o()}function o(){e.isReady=!0;for(var t=0,i=s.length;i>t;t++){var o=s[t];o()}}function n(n){return"complete"===r.readyState?o():(n.bind(r,"DOMContentLoaded",i),n.bind(r,"readystatechange",i),n.bind(t,"load",i)),e}var r=t.document,s=[];e.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],n):"object"==typeof exports?module.exports=n(require("eventie")):t.docReady=n(t.eventie)}(window),function(){function t(){}function e(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function i(t){return function(){return this[t].apply(this,arguments)}}var o=t.prototype,n=this,r=n.EventEmitter;o.getListeners=function(t){var e,i,o=this._getEvents();if(t instanceof RegExp){e={};for(i in o)o.hasOwnProperty(i)&&t.test(i)&&(e[i]=o[i])}else e=o[t]||(o[t]=[]);return e},o.flattenListeners=function(t){var e,i=[];for(e=0;t.length>e;e+=1)i.push(t[e].listener);return i},o.getListenersAsObject=function(t){var e,i=this.getListeners(t);return i instanceof Array&&(e={},e[t]=i),e||i},o.addListener=function(t,i){var o,n=this.getListenersAsObject(t),r="object"==typeof i;for(o in n)n.hasOwnProperty(o)&&-1===e(n[o],i)&&n[o].push(r?i:{listener:i,once:!1});return this},o.on=i("addListener"),o.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},o.once=i("addOnceListener"),o.defineEvent=function(t){return this.getListeners(t),this},o.defineEvents=function(t){for(var e=0;t.length>e;e+=1)this.defineEvent(t[e]);return this},o.removeListener=function(t,i){var o,n,r=this.getListenersAsObject(t);for(n in r)r.hasOwnProperty(n)&&(o=e(r[n],i),-1!==o&&r[n].splice(o,1));return this},o.off=i("removeListener"),o.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},o.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},o.manipulateListeners=function(t,e,i){var o,n,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(o=i.length;o--;)r.call(this,e,i[o]);else for(o in e)e.hasOwnProperty(o)&&(n=e[o])&&("function"==typeof n?r.call(this,o,n):s.call(this,o,n));return this},o.removeEvent=function(t){var e,i=typeof t,o=this._getEvents();if("string"===i)delete o[t];else if(t instanceof RegExp)for(e in o)o.hasOwnProperty(e)&&t.test(e)&&delete o[e];else delete this._events;return this},o.removeAllListeners=i("removeEvent"),o.emitEvent=function(t,e){var i,o,n,r,s=this.getListenersAsObject(t);for(n in s)if(s.hasOwnProperty(n))for(o=s[n].length;o--;)i=s[n][o],i.once===!0&&this.removeListener(t,i.listener),r=i.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,i.listener);return this},o.trigger=i("emitEvent"),o.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},o.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},o._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},o._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return n.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:n.EventEmitter=t}.call(this),function(t){function e(t){if(t){if("string"==typeof o[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,n=0,r=i.length;r>n;n++)if(e=i[n]+t,"string"==typeof o[e])return e}}var i="Webkit Moz ms Ms O".split(" "),o=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),i=-1===t.indexOf("%")&&!isNaN(e);return i&&e}function i(){}function o(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=s.length;i>e;e++){var o=s[e];t[o]=0}return t}function n(i){function n(){if(!d){d=!0;var o=t.getComputedStyle;if(p=function(){var t=o?function(t){return o(t,null)}:function(t){return t.currentStyle};return function(e){var i=t(e);return i||r("Style returned "+i+". Are you running this code in a hidden iframe on Firefox? "+"See http://bit.ly/getsizebug1"),i}}(),h=i("boxSizing")){var n=document.createElement("div");n.style.width="200px",n.style.padding="1px 2px 3px 4px",n.style.borderStyle="solid",n.style.borderWidth="1px 2px 3px 4px",n.style[h]="border-box";var s=document.body||document.documentElement;s.appendChild(n);var a=p(n);f=200===e(a.width),s.removeChild(n)}}}function a(t){if(n(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var i=p(t);if("none"===i.display)return o();var r={};r.width=t.offsetWidth,r.height=t.offsetHeight;for(var a=r.isBorderBox=!(!h||!i[h]||"border-box"!==i[h]),d=0,l=s.length;l>d;d++){var c=s[d],y=i[c];y=u(t,y);var m=parseFloat(y);r[c]=isNaN(m)?0:m}var g=r.paddingLeft+r.paddingRight,v=r.paddingTop+r.paddingBottom,_=r.marginLeft+r.marginRight,I=r.marginTop+r.marginBottom,L=r.borderLeftWidth+r.borderRightWidth,z=r.borderTopWidth+r.borderBottomWidth,b=a&&f,x=e(i.width);x!==!1&&(r.width=x+(b?0:g+L));var S=e(i.height);return S!==!1&&(r.height=S+(b?0:v+z)),r.innerWidth=r.width-(g+L),r.innerHeight=r.height-(v+z),r.outerWidth=r.width+_,r.outerHeight=r.height+I,r}}function u(e,i){if(t.getComputedStyle||-1===i.indexOf("%"))return i;var o=e.style,n=o.left,r=e.runtimeStyle,s=r&&r.left;return s&&(r.left=e.currentStyle.left),o.left=i,i=o.pixelLeft,o.left=n,s&&(r.left=s),i}var p,h,f,d=!1;return a}var r="undefined"==typeof console?i:function(t){console.error(t)},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],n):"object"==typeof exports?module.exports=n(require("desandro-get-style-property")):t.getSize=n(t.getStyleProperty)}(window),function(t){function e(t,e){return t[s](e)}function i(t){if(!t.parentNode){var e=document.createDocumentFragment();e.appendChild(t)}}function o(t,e){i(t);for(var o=t.parentNode.querySelectorAll(e),n=0,r=o.length;r>n;n++)if(o[n]===t)return!0;return!1}function n(t,o){return i(t),e(t,o)}var r,s=function(){if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0,o=e.length;o>i;i++){var n=e[i],r=n+"MatchesSelector";if(t[r])return r}}();if(s){var a=document.createElement("div"),u=e(a,"div");r=u?e:n}else r=o;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return r}):"object"==typeof exports?module.exports=r:window.matchesSelector=r}(Element.prototype),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){for(var e in t)return!1;return e=null,!0}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function n(t,n,r){function a(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var u=r("transition"),p=r("transform"),h=u&&p,f=!!r("perspective"),d={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[u],l=["transform","transition","transitionDuration","transitionProperty"],c=function(){for(var t={},e=0,i=l.length;i>e;e++){var o=l[e],n=r(o);n&&n!==o&&(t[o]=n)}return t}();e(a.prototype,t.prototype),a.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},a.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},a.prototype.getSize=function(){this.size=n(this.element)},a.prototype.css=function(t){var e=this.element.style;for(var i in t){var o=c[i]||i;e[o]=t[i]}},a.prototype.getPosition=function(){var t=s(this.element),e=this.layout.options,i=e.isOriginLeft,o=e.isOriginTop,n=parseInt(t[i?"left":"right"],10),r=parseInt(t[o?"top":"bottom"],10);n=isNaN(n)?0:n,r=isNaN(r)?0:r;var a=this.layout.size;n-=i?a.paddingLeft:a.paddingRight,r-=o?a.paddingTop:a.paddingBottom,this.position.x=n,this.position.y=r},a.prototype.layoutPosition=function(){var t=this.layout.size,e=this.layout.options,i={};e.isOriginLeft?(i.left=this.position.x+t.paddingLeft+"px",i.right=""):(i.right=this.position.x+t.paddingRight+"px",i.left=""),e.isOriginTop?(i.top=this.position.y+t.paddingTop+"px",i.bottom=""):(i.bottom=this.position.y+t.paddingBottom+"px",i.top=""),this.css(i),this.emitEvent("layout",[this])};var y=f?function(t,e){return"translate3d("+t+"px, "+e+"px, 0)"}:function(t,e){return"translate("+t+"px, "+e+"px)"};a.prototype._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=parseInt(t,10),r=parseInt(e,10),s=n===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return this.layoutPosition(),void 0;var a=t-i,u=e-o,p={},h=this.layout.options;a=h.isOriginLeft?a:-a,u=h.isOriginTop?u:-u,p.transform=y(a,u),this.transition({to:p,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},a.prototype.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},a.prototype.moveTo=h?a.prototype._transitionTo:a.prototype.goTo,a.prototype.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},a.prototype._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},a.prototype._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return this._nonTransition(t),void 0;var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var m=p&&o(p)+",opacity";a.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:m,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(d,this,!1))},a.prototype.transition=a.prototype[u?"_transition":"_nonTransition"],a.prototype.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},a.prototype.onotransitionend=function(t){this.ontransitionend(t)};var g={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};a.prototype.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,o=g[t.propertyName]||t.propertyName;if(delete e.ingProperties[o],i(e.ingProperties)&&this.disableTransition(),o in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[o]),o in e.onEnd){var n=e.onEnd[o];n.call(this),delete e.onEnd[o]}this.emitEvent("transitionEnd",[this])}},a.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(d,this,!1),this.isTransitioning=!1},a.prototype._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var v={transitionProperty:"",transitionDuration:""};return a.prototype.removeTransitionStyles=function(){this.css(v)},a.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.emitEvent("remove",[this])},a.prototype.remove=function(){if(!u||!parseFloat(this.layout.options.transitionDuration))return this.removeElem(),void 0;var t=this;this.on("transitionEnd",function(){return t.removeElem(),!0}),this.hide()},a.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options;this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0})},a.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options;this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:{opacity:function(){this.isHidden&&this.css({display:"none"})}}})},a.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},a}var r=t.getComputedStyle,s=r?function(t){return r(t,null)}:function(t){return t.currentStyle};"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property"],n):"object"==typeof exports?module.exports=n(require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property")):(t.Outlayer={},t.Outlayer.Item=n(t.EventEmitter,t.getSize,t.getStyleProperty))}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){return"[object Array]"===f.call(t)}function o(t){var e=[];if(i(t))e=t;else if(t&&"number"==typeof t.length)for(var o=0,n=t.length;n>o;o++)e.push(t[o]);else e.push(t);return e}function n(t,e){var i=l(e,t);-1!==i&&e.splice(i,1)}function r(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()}function s(i,s,f,l,c,y){function m(t,i){if("string"==typeof t&&(t=a.querySelector(t)),!t||!d(t))return u&&u.error("Bad "+this.constructor.namespace+" element: "+t),void 0;this.element=t,this.options=e({},this.constructor.defaults),this.option(i);var o=++g;this.element.outlayerGUID=o,v[o]=this,this._create(),this.options.isInitLayout&&this.layout()}var g=0,v={};return m.namespace="outlayer",m.Item=y,m.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e(m.prototype,f.prototype),m.prototype.option=function(t){e(this.options,t)},m.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},m.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},m.prototype._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0,r=e.length;r>n;n++){var s=e[n],a=new i(s,this);o.push(a)}return o},m.prototype._filterFindItemElements=function(t){t=o(t);for(var e=this.options.itemSelector,i=[],n=0,r=t.length;r>n;n++){var s=t[n];if(d(s))if(e){c(s,e)&&i.push(s);for(var a=s.querySelectorAll(e),u=0,p=a.length;p>u;u++)i.push(a[u])}else i.push(s)}return i},m.prototype.getItemElements=function(){for(var t=[],e=0,i=this.items.length;i>e;e++)t.push(this.items[e].element);return t},m.prototype.layout=function(){this._resetLayout(),this._manageStamps();var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},m.prototype._init=m.prototype.layout,m.prototype._resetLayout=function(){this.getSize()},m.prototype.getSize=function(){this.size=l(this.element)},m.prototype._getMeasurement=function(t,e){var i,o=this.options[t];o?("string"==typeof o?i=this.element.querySelector(o):d(o)&&(i=o),this[t]=i?l(i)[e]:o):this[t]=0},m.prototype.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},m.prototype._getItemsForLayout=function(t){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i];n.isIgnored||e.push(n)}return e},m.prototype._layoutItems=function(t,e){function i(){o.emitEvent("layoutComplete",[o,t])}var o=this;if(!t||!t.length)return i(),void 0;this._itemsOn(t,"layout",i);for(var n=[],r=0,s=t.length;s>r;r++){var a=t[r],u=this._getItemLayoutPosition(a);u.item=a,u.isInstant=e||a.isLayoutInstant,n.push(u)}this._processLayoutQueue(n)},m.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},m.prototype._processLayoutQueue=function(t){for(var e=0,i=t.length;i>e;e++){var o=t[e];this._positionItem(o.item,o.x,o.y,o.isInstant)}},m.prototype._positionItem=function(t,e,i,o){o?t.goTo(e,i):t.moveTo(e,i)},m.prototype._postLayout=function(){this.resizeContainer()},m.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},m.prototype._getContainerSize=h,m.prototype._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},m.prototype._itemsOn=function(t,e,i){function o(){return n++,n===r&&i.call(s),!0}for(var n=0,r=t.length,s=this,a=0,u=t.length;u>a;a++){var p=t[a];p.on(e,o)}},m.prototype.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},m.prototype.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},m.prototype.stamp=function(t){if(t=this._find(t)){this.stamps=this.stamps.concat(t);for(var e=0,i=t.length;i>e;e++){var o=t[e];this.ignore(o)}}},m.prototype.unstamp=function(t){if(t=this._find(t))for(var e=0,i=t.length;i>e;e++){var o=t[e];n(o,this.stamps),this.unignore(o)}},m.prototype._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=o(t)):void 0},m.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var t=0,e=this.stamps.length;e>t;t++){var i=this.stamps[t];this._manageStamp(i)}}},m.prototype._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},m.prototype._manageStamp=h,m.prototype._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=l(t),n={left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom};return n},m.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},m.prototype.bindResize=function(){this.isResizeBound||(i.bind(t,"resize",this),this.isResizeBound=!0)},m.prototype.unbindResize=function(){this.isResizeBound&&i.unbind(t,"resize",this),this.isResizeBound=!1},m.prototype.onresize=function(){function t(){e.resize(),delete e.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var e=this;this.resizeTimeout=setTimeout(t,100)},m.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},m.prototype.needsResizeLayout=function(){var t=l(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},m.prototype.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},m.prototype.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},m.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},m.prototype.reveal=function(t){var e=t&&t.length;if(e)for(var i=0;e>i;i++){var o=t[i];o.reveal()}},m.prototype.hide=function(t){var e=t&&t.length;if(e)for(var i=0;e>i;i++){var o=t[i];o.hide()}},m.prototype.getItem=function(t){for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];if(o.element===t)return o}},m.prototype.getItems=function(t){if(t&&t.length){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i],r=this.getItem(n);r&&e.push(r)}return e}},m.prototype.remove=function(t){t=o(t);var e=this.getItems(t);if(e&&e.length){this._itemsOn(e,"remove",function(){this.emitEvent("removeComplete",[this,e])});for(var i=0,r=e.length;r>i;i++){var s=e[i];s.remove(),n(s,this.items)}}},m.prototype.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="";for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];o.destroy()}this.unbindResize();var n=this.element.outlayerGUID;delete v[n],delete this.element.outlayerGUID,p&&p.removeData(this.element,this.constructor.namespace)},m.data=function(t){var e=t&&t.outlayerGUID;return e&&v[e]},m.create=function(t,i){function o(){m.apply(this,arguments)}return Object.create?o.prototype=Object.create(m.prototype):e(o.prototype,m.prototype),o.prototype.constructor=o,o.defaults=e({},m.defaults),e(o.defaults,i),o.prototype.settings={},o.namespace=t,o.data=m.data,o.Item=function(){y.apply(this,arguments)},o.Item.prototype=new y,s(function(){for(var e=r(t),i=a.querySelectorAll(".js-"+e),n="data-"+e+"-options",s=0,h=i.length;h>s;s++){var f,d=i[s],l=d.getAttribute(n);try{f=l&&JSON.parse(l)}catch(c){u&&u.error("Error parsing "+n+" on "+d.nodeName.toLowerCase()+(d.id?"#"+d.id:"")+": "+c);continue}var y=new o(d,f);p&&p.data(d,t,y)}}),p&&p.bridget&&p.bridget(t,o),o},m.Item=y,m}var a=t.document,u=t.console,p=t.jQuery,h=function(){},f=Object.prototype.toString,d="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1===t.nodeType&&"string"==typeof t.nodeName},l=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1};"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","doc-ready/doc-ready","eventEmitter/EventEmitter","get-size/get-size","matches-selector/matches-selector","./item"],s):"object"==typeof exports?module.exports=s(require("eventie"),require("doc-ready"),require("wolfy87-eventemitter"),require("get-size"),require("desandro-matches-selector"),require("./item")):t.Outlayer=s(t.eventie,t.docReady,t.EventEmitter,t.getSize,t.matchesSelector,t.Outlayer.Item)}(window),function(t){function e(t){function e(){t.Item.apply(this,arguments)}e.prototype=new t.Item,e.prototype._create=function(){this.id=this.layout.itemGUID++,t.Item.prototype._create.call(this),this.sortData={}},e.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var i=e.prototype.destroy;return e.prototype.destroy=function(){i.apply(this,arguments),this.css({display:""})},e}"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],e):"object"==typeof exports?module.exports=e(require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window),function(t){function e(t,e){function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}return function(){function t(t){return function(){return e.prototype[t].apply(this.isotope,arguments)}}for(var o=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],n=0,r=o.length;r>n;n++){var s=o[n];i.prototype[s]=t(s)}}(),i.prototype.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!==this.isotope.size.innerHeight},i.prototype._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},i.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},i.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},i.prototype.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},i.prototype.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},i.prototype.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},i.prototype.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function o(){i.apply(this,arguments)}return o.prototype=new i,e&&(o.options=e),o.prototype.namespace=t,i.modes[t]=o,o},i}"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window),function(t){function e(t,e){var o=t.create("masonry");return o.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var t=this.cols;for(this.colYs=[];t--;)this.colYs.push(0);this.maxY=0},o.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}this.columnWidth+=this.gutter,this.cols=Math.floor((this.containerWidth+this.gutter)/this.columnWidth),this.cols=Math.max(this.cols,1)},o.prototype.getContainerWidth=function(){var t=this.options.isFitWidth?this.element.parentNode:this.element,i=e(t);this.containerWidth=i&&i.innerWidth},o.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,o=e&&1>e?"round":"ceil",n=Math[o](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var r=this._getColGroup(n),s=Math.min.apply(Math,r),a=i(r,s),u={x:this.columnWidth*a,y:s},p=s+t.size.outerHeight,h=this.cols+1-r.length,f=0;h>f;f++)this.colYs[a+f]=p;return u},o.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;i>o;o++){var n=this.colYs.slice(o,o+t);e[o]=Math.max.apply(Math,n)}return e},o.prototype._manageStamp=function(t){var i=e(t),o=this._getElementOffset(t),n=this.options.isOriginLeft?o.left:o.right,r=n+i.outerWidth,s=Math.floor(n/this.columnWidth);s=Math.max(0,s);var a=Math.floor(r/this.columnWidth);a-=r%this.columnWidth?0:1,a=Math.min(this.cols-1,a);for(var u=(this.options.isOriginTop?o.top:o.bottom)+i.outerHeight,p=s;a>=p;p++)this.colYs[p]=Math.max(u,this.colYs[p])},o.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this.options.isFitWidth&&(t.width=this._getContainerFitWidth()),t},o.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},o.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!==this.containerWidth},o}var i=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++){var n=t[i];if(n===e)return i}return-1};"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size"],e):"object"==typeof exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t,i){var o=t.create("masonry"),n=o.prototype._getElementOffset,r=o.prototype.layout,s=o.prototype._getMeasurement;e(o.prototype,i.prototype),o.prototype._getElementOffset=n,o.prototype.layout=r,o.prototype._getMeasurement=s;var a=o.prototype.measureColumns;o.prototype.measureColumns=function(){this.items=this.isotope.filteredItems,a.call(this)};var u=o.prototype._manageStamp;return o.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotope.options.isOriginLeft,this.options.isOriginTop=this.isotope.options.isOriginTop,u.apply(this,arguments)},o}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],i):"object"==typeof exports?module.exports=i(require("../layout-mode"),require("masonry-layout")):i(t.Isotope.LayoutMode,t.Masonry)}(window),function(t){function e(t){var e=t.create("fitRows");return e.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},e.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotope.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var o={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,o},e.prototype._getContainerSize=function(){return{height:this.maxY}},e}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window),function(t){function e(t){var e=t.create("vertical",{horizontalAlignment:0});return e.prototype._resetLayout=function(){this.y=0},e.prototype._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},e.prototype._getContainerSize=function(){return{height:this.y}},e}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){return"[object Array]"===h.call(t)}function o(t){var e=[];if(i(t))e=t;else if(t&&"number"==typeof t.length)for(var o=0,n=t.length;n>o;o++)e.push(t[o]);else e.push(t);return e}function n(t,e){var i=f(e,t);-1!==i&&e.splice(i,1)}function r(t,i,r,u,h){function f(t,e){return function(i,o){for(var n=0,r=t.length;r>n;n++){var s=t[n],a=i.sortData[s],u=o.sortData[s];if(a>u||u>a){var p=void 0!==e[s]?e[s]:e,h=p?1:-1;return(a>u?1:-1)*h}}return 0}}var d=t.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});d.Item=u,d.LayoutMode=h,d.prototype._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),t.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var e in h.modes)this._initLayoutMode(e)},d.prototype.reloadItems=function(){this.itemGUID=0,t.prototype.reloadItems.call(this)},d.prototype._itemize=function(){for(var e=t.prototype._itemize.apply(this,arguments),i=0,o=e.length;o>i;i++){var n=e[i];n.id=this.itemGUID++}return this._updateItemsSortData(e),e
},d.prototype._initLayoutMode=function(t){var i=h.modes[t],o=this.options[t]||{};this.options[t]=i.options?e(i.options,o):o,this.modes[t]=new i(this)},d.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?(this.arrange(),void 0):(this._layout(),void 0)},d.prototype._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},d.prototype.arrange=function(t){function e(){o.reveal(i.needReveal),o.hide(i.needHide)}this.option(t),this._getIsInstant();var i=this._filter(this.items);this.filteredItems=i.matches;var o=this;this._isInstant?this._noTransition(e):e(),this._sort(),this._layout()},d.prototype._init=d.prototype.arrange,d.prototype._getIsInstant=function(){var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=t,t},d.prototype._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],o=[],n=[],r=this._getFilterTest(e),s=0,a=t.length;a>s;s++){var u=t[s];if(!u.isIgnored){var p=r(u);p&&i.push(u),p&&u.isHidden?o.push(u):p||u.isHidden||n.push(u)}}return{matches:i,needReveal:o,needHide:n}},d.prototype._getFilterTest=function(t){return s&&this.options.isJQueryFiltering?function(e){return s(e.element).is(t)}:"function"==typeof t?function(e){return t(e.element)}:function(e){return r(e.element,t)}},d.prototype.updateSortData=function(t){var e;t?(t=o(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},d.prototype._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=l(i)}},d.prototype._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&e>i;i++){var o=t[i];o.updateSortData()}};var l=function(){function t(t){if("string"!=typeof t)return t;var i=a(t).split(" "),o=i[0],n=o.match(/^\[(.+)\]$/),r=n&&n[1],s=e(r,o),u=d.sortDataParsers[i[1]];return t=u?function(t){return t&&u(s(t))}:function(t){return t&&s(t)}}function e(t,e){var i;return i=t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&p(i)}}return t}();d.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},d.prototype._sort=function(){var t=this.options.sortBy;if(t){var e=[].concat.apply(t,this.sortHistory),i=f(e,this.options.sortAscending);this.filteredItems.sort(i),t!==this.sortHistory[0]&&this.sortHistory.unshift(t)}},d.prototype._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw Error("No layout mode: "+t);return e.options=this.options[t],e},d.prototype._resetLayout=function(){t.prototype._resetLayout.call(this),this._mode()._resetLayout()},d.prototype._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},d.prototype._manageStamp=function(t){this._mode()._manageStamp(t)},d.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},d.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},d.prototype.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},d.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},d.prototype._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},d.prototype.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;n>i;i++)o=e[i],this.element.appendChild(o.element);var r=this._filter(e).matches;for(i=0;n>i;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;n>i;i++)delete e[i].isLayoutInstant;this.reveal(r)}};var c=d.prototype.remove;return d.prototype.remove=function(t){t=o(t);var e=this.getItems(t);if(c.call(this,t),e&&e.length)for(var i=0,r=e.length;r>i;i++){var s=e[i];n(s,this.filteredItems)}},d.prototype.shuffle=function(){for(var t=0,e=this.items.length;e>t;t++){var i=this.items[t];i.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},d.prototype._noTransition=function(t){var e=this.options.transitionDuration;this.options.transitionDuration=0;var i=t.call(this);return this.options.transitionDuration=e,i},d.prototype.getFilteredItemElements=function(){for(var t=[],e=0,i=this.filteredItems.length;i>e;e++)t.push(this.filteredItems[e].element);return t},d}var s=t.jQuery,a=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},u=document.documentElement,p=u.textContent?function(t){return t.textContent}:function(t){return t.innerText},h=Object.prototype.toString,f=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1};"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],r):"object"==typeof exports?module.exports=r(require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("./item"),require("./layout-mode"),require("./layout-modes/masonry"),require("./layout-modes/fit-rows"),require("./layout-modes/vertical")):t.Isotope=r(t.Outlayer,t.getSize,t.matchesSelector,t.Isotope.Item,t.Isotope.LayoutMode)}(window);
;(function($, window, document, undefined) {

	var pluginName = 'stellar',
		defaults = {
			scrollProperty: 'scroll',
			positionProperty: 'position',
			horizontalScrolling: true,
			verticalScrolling: true,
			horizontalOffset: 0,
			verticalOffset: 0,
			responsive: false,
			parallaxBackgrounds: true,
			parallaxElements: true,
			hideDistantElements: true,
			hideElement: function($elem) { $elem.hide(); },
			showElement: function($elem) { $elem.show(); }
		},

		scrollProperty = {
			scroll: {
				getLeft: function($elem) { return $elem.scrollLeft(); },
				setLeft: function($elem, val) { $elem.scrollLeft(val); },

				getTop: function($elem) { return $elem.scrollTop();	},
				setTop: function($elem, val) { $elem.scrollTop(val); }
			},
			position: {
				getLeft: function($elem) { return parseInt($elem.css('left'), 10) * -1; },
				getTop: function($elem) { return parseInt($elem.css('top'), 10) * -1; }
			},
			margin: {
				getLeft: function($elem) { return parseInt($elem.css('margin-left'), 10) * -1; },
				getTop: function($elem) { return parseInt($elem.css('margin-top'), 10) * -1; }
			},
			transform: {
				getLeft: function($elem) {
					var computedTransform = getComputedStyle($elem[0])[prefixedTransform];
					return (computedTransform !== 'none' ? parseInt(computedTransform.match(/(-?[0-9]+)/g)[4], 10) * -1 : 0);
				},
				getTop: function($elem) {
					var computedTransform = getComputedStyle($elem[0])[prefixedTransform];
					return (computedTransform !== 'none' ? parseInt(computedTransform.match(/(-?[0-9]+)/g)[5], 10) * -1 : 0);
				}
			}
		},

		positionProperty = {
			position: {
				setLeft: function($elem, left) { $elem.css('left', left); },
				setTop: function($elem, top) { $elem.css('top', top); }
			},
			transform: {
				setPosition: function($elem, left, startingLeft, top, startingTop) {
					$elem[0].style[prefixedTransform] = 'translate3d(' + (left - startingLeft) + 'px, ' + (top - startingTop) + 'px, 0)';
				}
			}
		},

		// Returns a function which adds a vendor prefix to any CSS property name
		vendorPrefix = (function() {
			var prefixes = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
				style = $('script')[0].style,
				prefix = '',
				prop;

			for (prop in style) {
				if (prefixes.test(prop)) {
					prefix = prop.match(prefixes)[0];
					break;
				}
			}

			if ('WebkitOpacity' in style) { prefix = 'Webkit'; }
			if ('KhtmlOpacity' in style) { prefix = 'Khtml'; }

			return function(property) {
				return prefix + (prefix.length > 0 ? property.charAt(0).toUpperCase() + property.slice(1) : property);
			};
		}()),

		prefixedTransform = vendorPrefix('transform'),

		supportsBackgroundPositionXY = $('<div />', { style: 'background:#fff' }).css('background-position-x') !== undefined,

		setBackgroundPosition = (supportsBackgroundPositionXY ?
			function($elem, x, y) {
				$elem.css({
					'background-position-x': x,
					'background-position-y': y
				});
			} :
			function($elem, x, y) {
				$elem.css('background-position', x + ' ' + y);
			}
		),

		getBackgroundPosition = (supportsBackgroundPositionXY ?
			function($elem) {
				return [
					$elem.css('background-position-x'),
					$elem.css('background-position-y')
				];
			} :
			function($elem) {
				return $elem.css('background-position').split(' ');
			}
		),

		requestAnimFrame = (
			window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(callback) {
				setTimeout(callback, 1000 / 60);
			}
		);

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {
		init: function() {
			this.options.name = pluginName + '_' + Math.floor(Math.random() * 1e9);

			this._defineElements();
			this._defineGetters();
			this._defineSetters();
			this._handleWindowLoadAndResize();
			this._detectViewport();

			this.refresh({ firstLoad: true });

			if (this.options.scrollProperty === 'scroll') {
				this._handleScrollEvent();
			} else {
				this._startAnimationLoop();
			}
		},
		_defineElements: function() {
			if (this.element === document.body) this.element = window;
			this.$scrollElement = $(this.element);
			this.$element = (this.element === window ? $('body') : this.$scrollElement);
			this.$viewportElement = (this.options.viewportElement !== undefined ? $(this.options.viewportElement) : (this.$scrollElement[0] === window || this.options.scrollProperty === 'scroll' ? this.$scrollElement : this.$scrollElement.parent()) );
		},
		_defineGetters: function() {
			var self = this,
				scrollPropertyAdapter = scrollProperty[self.options.scrollProperty];

			this._getScrollLeft = function() {
				return scrollPropertyAdapter.getLeft(self.$scrollElement);
			};

			this._getScrollTop = function() {
				return scrollPropertyAdapter.getTop(self.$scrollElement);
			};
		},
		_defineSetters: function() {
			var self = this,
				scrollPropertyAdapter = scrollProperty[self.options.scrollProperty],
				positionPropertyAdapter = positionProperty[self.options.positionProperty],
				setScrollLeft = scrollPropertyAdapter.setLeft,
				setScrollTop = scrollPropertyAdapter.setTop;

			this._setScrollLeft = (typeof setScrollLeft === 'function' ? function(val) {
				setScrollLeft(self.$scrollElement, val);
			} : $.noop);

			this._setScrollTop = (typeof setScrollTop === 'function' ? function(val) {
				setScrollTop(self.$scrollElement, val);
			} : $.noop);

			this._setPosition = positionPropertyAdapter.setPosition ||
				function($elem, left, startingLeft, top, startingTop) {
					if (self.options.horizontalScrolling) {
						positionPropertyAdapter.setLeft($elem, left, startingLeft);
					}

					if (self.options.verticalScrolling) {
						positionPropertyAdapter.setTop($elem, top, startingTop);
					}
				};
		},
		_handleWindowLoadAndResize: function() {
			var self = this,
				$window = $(window);

			if (self.options.responsive) {
				$window.bind('load.' + this.name, function() {
					self.refresh();
				});
			}

			$window.bind('resize.' + this.name, function() {
				self._detectViewport();

				if (self.options.responsive) {
					self.refresh();
				}
			});
		},
		refresh: function(options) {
			var self = this,
				oldLeft = self._getScrollLeft(),
				oldTop = self._getScrollTop();

			if (!options || !options.firstLoad) {
				this._reset();
			}

			this._setScrollLeft(0);
			this._setScrollTop(0);

			this._setOffsets();
			this._findParticles();
			this._findBackgrounds();

			// Fix for WebKit background rendering bug
			if (options && options.firstLoad && /WebKit/.test(navigator.userAgent)) {
				$(window).load(function() {
					var oldLeft = self._getScrollLeft(),
						oldTop = self._getScrollTop();

					self._setScrollLeft(oldLeft + 1);
					self._setScrollTop(oldTop + 1);

					self._setScrollLeft(oldLeft);
					self._setScrollTop(oldTop);
				});
			}

			this._setScrollLeft(oldLeft);
			this._setScrollTop(oldTop);
		},
		_detectViewport: function() {
			var viewportOffsets = this.$viewportElement.offset(),
				hasOffsets = viewportOffsets !== null && viewportOffsets !== undefined;

			this.viewportWidth = this.$viewportElement.width();
			this.viewportHeight = this.$viewportElement.height();

			this.viewportOffsetTop = (hasOffsets ? viewportOffsets.top : 0);
			this.viewportOffsetLeft = (hasOffsets ? viewportOffsets.left : 0);
		},
		_findParticles: function() {
			var self = this,
				scrollLeft = this._getScrollLeft(),
				scrollTop = this._getScrollTop();

			if (this.particles !== undefined) {
				for (var i = this.particles.length - 1; i >= 0; i--) {
					this.particles[i].$element.data('stellar-elementIsActive', undefined);
				}
			}

			this.particles = [];

			if (!this.options.parallaxElements) return;

			this.$element.find('[data-stellar-ratio]').each(function(i) {
				var $this = $(this),
					horizontalOffset,
					verticalOffset,
					positionLeft,
					positionTop,
					marginLeft,
					marginTop,
					$offsetParent,
					offsetLeft,
					offsetTop,
					parentOffsetLeft = 0,
					parentOffsetTop = 0,
					tempParentOffsetLeft = 0,
					tempParentOffsetTop = 0;

				// Ensure this element isn't already part of another scrolling element
				if (!$this.data('stellar-elementIsActive')) {
					$this.data('stellar-elementIsActive', this);
				} else if ($this.data('stellar-elementIsActive') !== this) {
					return;
				}

				self.options.showElement($this);

				// Save/restore the original top and left CSS values in case we refresh the particles or destroy the instance
				if (!$this.data('stellar-startingLeft')) {
					$this.data('stellar-startingLeft', $this.css('left'));
					$this.data('stellar-startingTop', $this.css('top'));
				} else {
					$this.css('left', $this.data('stellar-startingLeft'));
					$this.css('top', $this.data('stellar-startingTop'));
				}

				positionLeft = $this.position().left;
				positionTop = $this.position().top;

				// Catch-all for margin top/left properties (these evaluate to 'auto' in IE7 and IE8)
				marginLeft = ($this.css('margin-left') === 'auto') ? 0 : parseInt($this.css('margin-left'), 10);
				marginTop = ($this.css('margin-top') === 'auto') ? 0 : parseInt($this.css('margin-top'), 10);

				offsetLeft = $this.offset().left - marginLeft;
				offsetTop = $this.offset().top - marginTop;

				// Calculate the offset parent
				$this.parents().each(function() {
					var $this = $(this);

					if ($this.data('stellar-offset-parent') === true) {
						parentOffsetLeft = tempParentOffsetLeft;
						parentOffsetTop = tempParentOffsetTop;
						$offsetParent = $this;

						return false;
					} else {
						tempParentOffsetLeft += $this.position().left;
						tempParentOffsetTop += $this.position().top;
					}
				});

				// Detect the offsets
				horizontalOffset = ($this.data('stellar-horizontal-offset') !== undefined ? $this.data('stellar-horizontal-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-horizontal-offset') !== undefined ? $offsetParent.data('stellar-horizontal-offset') : self.horizontalOffset));
				verticalOffset = ($this.data('stellar-vertical-offset') !== undefined ? $this.data('stellar-vertical-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-vertical-offset') !== undefined ? $offsetParent.data('stellar-vertical-offset') : self.verticalOffset));

				// Add our object to the particles collection
				self.particles.push({
					$element: $this,
					$offsetParent: $offsetParent,
					isFixed: $this.css('position') === 'fixed',
					horizontalOffset: horizontalOffset,
					verticalOffset: verticalOffset,
					startingPositionLeft: positionLeft,
					startingPositionTop: positionTop,
					startingOffsetLeft: offsetLeft,
					startingOffsetTop: offsetTop,
					parentOffsetLeft: parentOffsetLeft,
					parentOffsetTop: parentOffsetTop,
					stellarRatio: ($this.data('stellar-ratio') !== undefined ? $this.data('stellar-ratio') : 1),
					width: $this.outerWidth(true),
					height: $this.outerHeight(true),
					isHidden: false
				});
			});
		},
		_findBackgrounds: function() {
			var self = this,
				scrollLeft = this._getScrollLeft(),
				scrollTop = this._getScrollTop(),
				$backgroundElements;

			this.backgrounds = [];

			if (!this.options.parallaxBackgrounds) return;

			$backgroundElements = this.$element.find('[data-stellar-background-ratio]');

			if (this.$element.data('stellar-background-ratio')) {
                $backgroundElements = $backgroundElements.add(this.$element);
			}

			$backgroundElements.each(function() {
				var $this = $(this),
					backgroundPosition = getBackgroundPosition($this),
					horizontalOffset,
					verticalOffset,
					positionLeft,
					positionTop,
					marginLeft,
					marginTop,
					offsetLeft,
					offsetTop,
					$offsetParent,
					parentOffsetLeft = 0,
					parentOffsetTop = 0,
					tempParentOffsetLeft = 0,
					tempParentOffsetTop = 0;

				// Ensure this element isn't already part of another scrolling element
				if (!$this.data('stellar-backgroundIsActive')) {
					$this.data('stellar-backgroundIsActive', this);
				} else if ($this.data('stellar-backgroundIsActive') !== this) {
					return;
				}

				// Save/restore the original top and left CSS values in case we destroy the instance
				if (!$this.data('stellar-backgroundStartingLeft')) {
					$this.data('stellar-backgroundStartingLeft', backgroundPosition[0]);
					$this.data('stellar-backgroundStartingTop', backgroundPosition[1]);
				} else {
					setBackgroundPosition($this, $this.data('stellar-backgroundStartingLeft'), $this.data('stellar-backgroundStartingTop'));
				}

				// Catch-all for margin top/left properties (these evaluate to 'auto' in IE7 and IE8)
				marginLeft = ($this.css('margin-left') === 'auto') ? 0 : parseInt($this.css('margin-left'), 10);
				marginTop = ($this.css('margin-top') === 'auto') ? 0 : parseInt($this.css('margin-top'), 10);

				offsetLeft = $this.offset().left - marginLeft - scrollLeft;
				offsetTop = $this.offset().top - marginTop - scrollTop;
				
				// Calculate the offset parent
				$this.parents().each(function() {
					var $this = $(this);

					if ($this.data('stellar-offset-parent') === true) {
						parentOffsetLeft = tempParentOffsetLeft;
						parentOffsetTop = tempParentOffsetTop;
						$offsetParent = $this;

						return false;
					} else {
						tempParentOffsetLeft += $this.position().left;
						tempParentOffsetTop += $this.position().top;
					}
				});

				// Detect the offsets
				horizontalOffset = ($this.data('stellar-horizontal-offset') !== undefined ? $this.data('stellar-horizontal-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-horizontal-offset') !== undefined ? $offsetParent.data('stellar-horizontal-offset') : self.horizontalOffset));
				verticalOffset = ($this.data('stellar-vertical-offset') !== undefined ? $this.data('stellar-vertical-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-vertical-offset') !== undefined ? $offsetParent.data('stellar-vertical-offset') : self.verticalOffset));

				self.backgrounds.push({
					$element: $this,
					$offsetParent: $offsetParent,
					isFixed: $this.css('background-attachment') === 'fixed',
					horizontalOffset: horizontalOffset,
					verticalOffset: verticalOffset,
					startingValueLeft: backgroundPosition[0],
					startingValueTop: backgroundPosition[1],
					startingBackgroundPositionLeft: (isNaN(parseInt(backgroundPosition[0], 10)) ? 0 : parseInt(backgroundPosition[0], 10)),
					startingBackgroundPositionTop: (isNaN(parseInt(backgroundPosition[1], 10)) ? 0 : parseInt(backgroundPosition[1], 10)),
					startingPositionLeft: $this.position().left,
					startingPositionTop: $this.position().top,
					startingOffsetLeft: offsetLeft,
					startingOffsetTop: offsetTop,
					parentOffsetLeft: parentOffsetLeft,
					parentOffsetTop: parentOffsetTop,
					stellarRatio: ($this.data('stellar-background-ratio') === undefined ? 1 : $this.data('stellar-background-ratio'))
				});
			});
		},
		_reset: function() {
			var particle,
				startingPositionLeft,
				startingPositionTop,
				background,
				i;

			for (i = this.particles.length - 1; i >= 0; i--) {
				particle = this.particles[i];
				startingPositionLeft = particle.$element.data('stellar-startingLeft');
				startingPositionTop = particle.$element.data('stellar-startingTop');

				this._setPosition(particle.$element, startingPositionLeft, startingPositionLeft, startingPositionTop, startingPositionTop);

				this.options.showElement(particle.$element);

				particle.$element.data('stellar-startingLeft', null).data('stellar-elementIsActive', null).data('stellar-backgroundIsActive', null);
			}

			for (i = this.backgrounds.length - 1; i >= 0; i--) {
				background = this.backgrounds[i];

				background.$element.data('stellar-backgroundStartingLeft', null).data('stellar-backgroundStartingTop', null);

				setBackgroundPosition(background.$element, background.startingValueLeft, background.startingValueTop);
			}
		},
		destroy: function() {
			this._reset();

			this.$scrollElement.unbind('resize.' + this.name).unbind('scroll.' + this.name);
			this._animationLoop = $.noop;

			$(window).unbind('load.' + this.name).unbind('resize.' + this.name);
		},
		_setOffsets: function() {
			var self = this,
				$window = $(window);

			$window.unbind('resize.horizontal-' + this.name).unbind('resize.vertical-' + this.name);

			if (typeof this.options.horizontalOffset === 'function') {
				this.horizontalOffset = this.options.horizontalOffset();
				$window.bind('resize.horizontal-' + this.name, function() {
					self.horizontalOffset = self.options.horizontalOffset();
				});
			} else {
				this.horizontalOffset = this.options.horizontalOffset;
			}

			if (typeof this.options.verticalOffset === 'function') {
				this.verticalOffset = this.options.verticalOffset();
				$window.bind('resize.vertical-' + this.name, function() {
					self.verticalOffset = self.options.verticalOffset();
				});
			} else {
				this.verticalOffset = this.options.verticalOffset;
			}
		},
		_repositionElements: function() {
			var scrollLeft = this._getScrollLeft(),
				scrollTop = this._getScrollTop(),
				horizontalOffset,
				verticalOffset,
				particle,
				fixedRatioOffset,
				background,
				bgLeft,
				bgTop,
				isVisibleVertical = true,
				isVisibleHorizontal = true,
				newPositionLeft,
				newPositionTop,
				newOffsetLeft,
				newOffsetTop,
				i;

			// First check that the scroll position or container size has changed
			if (this.currentScrollLeft === scrollLeft && this.currentScrollTop === scrollTop && this.currentWidth === this.viewportWidth && this.currentHeight === this.viewportHeight) {
				return;
			} else {
				this.currentScrollLeft = scrollLeft;
				this.currentScrollTop = scrollTop;
				this.currentWidth = this.viewportWidth;
				this.currentHeight = this.viewportHeight;
			}

			// Reposition elements
			for (i = this.particles.length - 1; i >= 0; i--) {
				particle = this.particles[i];

				fixedRatioOffset = (particle.isFixed ? 1 : 0);

				// Calculate position, then calculate what the particle's new offset will be (for visibility check)
				if (this.options.horizontalScrolling) {
					newPositionLeft = (scrollLeft + particle.horizontalOffset + this.viewportOffsetLeft + particle.startingPositionLeft - particle.startingOffsetLeft + particle.parentOffsetLeft) * -(particle.stellarRatio + fixedRatioOffset - 1) + particle.startingPositionLeft;
					newOffsetLeft = newPositionLeft - particle.startingPositionLeft + particle.startingOffsetLeft;
				} else {
					newPositionLeft = particle.startingPositionLeft;
					newOffsetLeft = particle.startingOffsetLeft;
				}

				if (this.options.verticalScrolling) {
					newPositionTop = (scrollTop + particle.verticalOffset + this.viewportOffsetTop + particle.startingPositionTop - particle.startingOffsetTop + particle.parentOffsetTop) * -(particle.stellarRatio + fixedRatioOffset - 1) + particle.startingPositionTop;
					newOffsetTop = newPositionTop - particle.startingPositionTop + particle.startingOffsetTop;
				} else {
					newPositionTop = particle.startingPositionTop;
					newOffsetTop = particle.startingOffsetTop;
				}

				// Check visibility
				if (this.options.hideDistantElements) {
					isVisibleHorizontal = !this.options.horizontalScrolling || newOffsetLeft + particle.width > (particle.isFixed ? 0 : scrollLeft) && newOffsetLeft < (particle.isFixed ? 0 : scrollLeft) + this.viewportWidth + this.viewportOffsetLeft;
					isVisibleVertical = !this.options.verticalScrolling || newOffsetTop + particle.height > (particle.isFixed ? 0 : scrollTop) && newOffsetTop < (particle.isFixed ? 0 : scrollTop) + this.viewportHeight + this.viewportOffsetTop;
				}

				if (isVisibleHorizontal && isVisibleVertical) {
					if (particle.isHidden) {
						this.options.showElement(particle.$element);
						particle.isHidden = false;
					}

					this._setPosition(particle.$element, newPositionLeft, particle.startingPositionLeft, newPositionTop, particle.startingPositionTop);
				} else {
					if (!particle.isHidden) {
						this.options.hideElement(particle.$element);
						particle.isHidden = true;
					}
				}
			}

			// Reposition backgrounds
			for (i = this.backgrounds.length - 1; i >= 0; i--) {
				background = this.backgrounds[i];

				fixedRatioOffset = (background.isFixed ? 0 : 1);
				bgLeft = (this.options.horizontalScrolling ? (scrollLeft + background.horizontalOffset - this.viewportOffsetLeft - background.startingOffsetLeft + background.parentOffsetLeft - background.startingBackgroundPositionLeft) * (fixedRatioOffset - background.stellarRatio) + 'px' : background.startingValueLeft);
				bgTop = (this.options.verticalScrolling ? (scrollTop + background.verticalOffset - this.viewportOffsetTop - background.startingOffsetTop + background.parentOffsetTop - background.startingBackgroundPositionTop) * (fixedRatioOffset - background.stellarRatio) + 'px' : background.startingValueTop);

				setBackgroundPosition(background.$element, bgLeft, bgTop);
			}
		},
		_handleScrollEvent: function() {
			var self = this,
				ticking = false;

			var update = function() {
				self._repositionElements();
				ticking = false;
			};

			var requestTick = function() {
				if (!ticking) {
					requestAnimFrame(update);
					ticking = true;
				}
			};
			
			this.$scrollElement.bind('scroll.' + this.name, requestTick);
			requestTick();
		},
		_startAnimationLoop: function() {
			var self = this;

			this._animationLoop = function() {
				requestAnimFrame(self._animationLoop);
				self._repositionElements();
			};
			this._animationLoop();
		}
	};

	$.fn[pluginName] = function (options) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			return this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});
		}
	};

	$[pluginName] = function(options) {
		var $window = $(window);
		return $window.stellar.apply($window, Array.prototype.slice.call(arguments, 0));
	};

	// Expose the scroll and position property function hashes so they can be extended
	$[pluginName].scrollProperty = scrollProperty;
	$[pluginName].positionProperty = positionProperty;

	// Expose the plugin class so it can be modified
	window.Stellar = Plugin;
}(jQuery, this, document));
/** ==========================================================

* jquery lightGallery.js v1.1.5 // 3/29/2015
* http://sachinchoolur.github.io/lightGallery/
* Released under the MIT License - http://opensource.org/licenses/mit-license.html  ---- FREE ----

=========================================================/**/
;
(function ($) {
    "use strict";
    $.fn.lightGallery = function (options) {
        var defaults = {
                mode: 'slide',
                useCSS: true,
                cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
                easing: 'linear', //'for jquery animation',//
                speed: 600,
                addClass: '',

                closable: true,
                loop: false,
                auto: false,
                pause: 4000,
                escKey: true,
                controls: true,
                hideControlOnEnd: false,

                preload: 1, //number of preload slides. will exicute only after the current slide is fully loaded. ex:// you clicked on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded.. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
                showAfterLoad: true,
                selector: null,
                index: false,

                lang: {
                    allPhotos: 'All photos'
                },
                counter: false,

                exThumbImage: false,
                thumbnail: true,
                showThumbByDefault: false,
                animateThumb: true,
                currentPagerPosition: 'middle',
                thumbWidth: 100,
                thumbMargin: 5,


                mobileSrc: false,
                mobileSrcMaxWidth: 640,
                swipeThreshold: 50,
                enableTouch: true,
                enableDrag: true,

                vimeoColor: 'CCCCCC',
                youtubePlayerParams: false, // See: https://developers.google.com/youtube/player_parameters
                videoAutoplay: true,
                videoMaxWidth: '855px',

                dynamic: false,
                dynamicEl: [],
                //callbacks

                onOpen: function (plugin) {},
                onSlideBefore: function (plugin) {},
                onSlideAfter: function (plugin) {},
                onSlideNext: function (plugin) {},
                onSlidePrev: function (plugin) {},
                onBeforeClose: function (plugin) {},
                onCloseAfter: function (plugin) {}
            },
            el = $(this),
            plugin = this,
            $children = null,
            index = 0,
            isActive = false,
            lightGalleryOn = false,
            isTouch = document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints,
            $gallery, $galleryCont, $slider, $slide, $prev, $next, prevIndex, $thumb_cont, $thumb, windowWidth, interval, usingThumb = false,
            aTiming = false,
            aSpeed = false;
        var settings = $.extend(true, {}, defaults, options);
        var lightGallery = {
            init: function () {
                el.each(function () {
                    var $this = $(this);
                    if (settings.dynamic) {
                        $children = settings.dynamicEl;
                        index = 0;
                        prevIndex = index;
                        setUp.init(index);
                    } else {
                        if (settings.selector !== null) {
                            $children = $(settings.selector);
                        } else {
                            $children = $this.children();
                        }
                        $children.on('click', function (e) {
                            if (settings.selector !== null) {
                                $children = $(settings.selector);
                            } else {
                                $children = $this.children();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            index = $children.index(this);
                            prevIndex = index;
                            setUp.init(index);
                        });
                    }
                });
            }
        };
        var setUp = {
            init: function () {
                isActive = true;
                this.structure();
                this.getWidth();
                this.closeSlide();
                this.autoStart();
                this.counter();
                this.slideTo();
                this.buildThumbnail();
                this.keyPress();
                if (settings.index) {
                    this.slide(settings.index);
                    this.animateThumb(settings.index);
                } else {
                    this.slide(index);
                    this.animateThumb(index);
                }
                if (settings.enableDrag) {
                    this.touch();
                }
                if (settings.enableTouch) {
                    this.enableTouch();
                }

                setTimeout(function () {
                    $gallery.addClass('opacity');
                }, 50);
            },
            structure: function () {
                $('body').append('<div id="lg-outer" class="' + settings.addClass + '"><div id="lg-gallery"><div id="lg-slider"></div><a id="lg-close" class="close"></a></div></div>').addClass('light-gallery');
                $galleryCont = $('#lg-outer');
                $gallery = $('#lg-gallery');
                if (settings.showAfterLoad === true) {
                    $gallery.addClass('show-after-load');
                }
                $slider = $gallery.find('#lg-slider');
                var slideList = '';
                if (settings.dynamic) {
                    for (var i = 0; i < settings.dynamicEl.length; i++) {
                        slideList += '<div class="lg-slide"></div>';
                    }
                } else {
                    $children.each(function () {
                        slideList += '<div class="lg-slide"></div>';
                    });
                }
                $slider.append(slideList);
                $slide = $gallery.find('.lg-slide');
            },
            closeSlide: function () {
                var $this = this;
                if (settings.closable) {
                    $('#lg-outer')
                        .on('click', function (event) {
                            if ($(event.target).is('.lg-slide')) {
                                plugin.destroy(false);
                            }
                        });
                }
                $('#lg-close').bind('click touchend', function () {
                    plugin.destroy(false);
                });
            },
            getWidth: function () {
                var resizeWindow = function () {
                    windowWidth = $(window).width();
                };
                $(window).bind('resize.lightGallery', resizeWindow());
            },
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $('body').on('touchstart.lightGallery', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                    });
                    $('body').on('touchmove.lightGallery', function (e) {
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        e.preventDefault();
                    });
                    $('body').on('touchend.lightGallery', function (e) {
                        var distance = endCoords.pageX - startCoords.pageX,
                            swipeThreshold = settings.swipeThreshold;
                        if (distance >= swipeThreshold) {
                            $this.prevSlide();
                            clearInterval(interval);
                        } else if (distance <= -swipeThreshold) {
                            $this.nextSlide();
                            clearInterval(interval);
                        }
                    });
                }
            },
            touch: function () {
                var xStart, xEnd;
                var $this = this;
                $('.light-gallery').bind('mousedown', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    xStart = e.pageX;
                });
                $('.light-gallery').bind('mouseup', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    xEnd = e.pageX;
                    if (xEnd - xStart > 20) {
                        $this.prevSlide();
                    } else if (xStart - xEnd > 20) {
                        $this.nextSlide();
                    }
                });
            },
            isVideo: function (src, index) {
                var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i);
                var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
                var iframe = false;
                if (settings.dynamic) {
                    if (settings.dynamicEl[index].iframe == 'true') {
                        iframe = true;
                    }
                } else {
                    if ($children.eq(index).attr('data-iframe') == 'true') {
                        iframe = true;
                    }
                }
                if (youtube || vimeo || iframe) {
                    return true;
                }
            },
            loadVideo: function (src, _id) {
                var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i);
                var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
                var video = '';
                var a = '';
                if (youtube) {
                    if (settings.videoAutoplay === true && lightGalleryOn === false) {
                        a = '?autoplay=1&rel=0&wmode=opaque';
                    } else {
                        a = '?wmode=opaque';
                    }

                    if (settings.youtubePlayerParams) {
                        var youtubeParams = $.param(settings.youtubePlayerParams);
                        a = a + '&' + youtubeParams;
                    }

                    video = '<iframe class="object" width="560" height="315" src="//www.youtube.com/embed/' + youtube[1] + a + '" frameborder="0" allowfullscreen></iframe>';
                } else if (vimeo) {
                    if (settings.videoAutoplay === true && lightGalleryOn === false) {
                        a = 'autoplay=1&amp;';
                    } else {
                        a = '';
                    }
                    video = '<iframe class="object" id="video' + _id + '" width="560" height="315"  src="http://player.vimeo.com/video/' + vimeo[1] + '?' + a + 'byline=0&amp;portrait=0&amp;color=' + settings.vimeoColor + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                } else {
                    video = '<iframe class="object" frameborder="0" src="' + src + '"  allowfullscreen="true"></iframe>';
                }
                return '<div class="video-cont" style="max-width:' + settings.videoMaxWidth + ' !important;"><div class="video">' + video + '</div></div>';
            },
            addHtml: function (index) {
                var dataSubHtml = null;
                if (settings.dynamic) {
                    dataSubHtml = settings.dynamicEl[index]['sub-html'];
                } else {
                    dataSubHtml = $children.eq(index).attr('data-sub-html');
                }
                if (typeof dataSubHtml !== 'undefined' && dataSubHtml !== null) {
                    var fL = dataSubHtml.substring(0, 1);
                    if (fL == '.' || fL == '#') {
                        dataSubHtml = $(dataSubHtml).html();
                    } else {
                        dataSubHtml = dataSubHtml;
                    }
                    $slide.eq(index).append(dataSubHtml);
                }
            },
            preload: function (index) {
                var newIndex = index;
                for (var k = 0; k <= settings.preload; k++) {
                    if (k >= $children.length - index) {
                        break;
                    }
                    this.loadContent(newIndex + k, true);
                }
                for (var h = 0; h <= settings.preload; h++) {
                    if (newIndex - h < 0) {
                        break;
                    }
                    this.loadContent(newIndex - h, true);
                }
            },
            loadObj: function (r, index) {
                var $this = this;
                $slide.eq(index).find('.object').on('load error', function () {
                    $slide.eq(index).addClass('complete');
                });
                if (r === false) {
                    if (!$slide.eq(index).hasClass('complete')) {
                        $slide.eq(index).find('.object').on('load error', function () {
                            $this.preload(index);
                        });
                    } else {
                        $this.preload(index);
                    }
                }
            },
            loadContent: function (index, rec) {
                var $this = this;
                var i, j, l = $children.length - index;
                var src;

                if (settings.preload > $children.length) {
                    settings.preload = $children.length;
                }
                if (settings.mobileSrc === true && windowWidth <= settings.mobileSrcMaxWidth) {
                    if (settings.dynamic) {
                        src = settings.dynamicEl[index].mobileSrc;
                    } else {
                        src = $children.eq(index).attr('data-responsive-src');
                    }
                }

                // Fall back to use non-responsive source if no responsive source was found
                if (!src) {
                    if (settings.dynamic) {
                        src = settings.dynamicEl[index].src;
                    } else {
                        src = $children.eq(index).attr('data-src');
                    }
                }
                var time = 0;
                if (rec === true) {
                    time = settings.speed + 400;
                }

                if (typeof src !== 'undefined' && src !== '') {
                    if (!$this.isVideo(src, index)) {
                        setTimeout(function () {
                            if (!$slide.eq(index).hasClass('loaded')) {
                                $slide.eq(index).prepend('<img class="object" src="' + src + '" />');
                                $this.addHtml(index);
                                $slide.eq(index).addClass('loaded');
                            }
                            $this.loadObj(rec, index);
                        }, time);
                    } else {
                        setTimeout(function () {
                            if (!$slide.eq(index).hasClass('loaded')) {
                                $slide.eq(index).prepend($this.loadVideo(src, index));
                                $this.addHtml(index);
                                $slide.eq(index).addClass('loaded');

                                if (settings.auto && settings.videoAutoplay === true) {
                                    clearInterval(interval);
                                }
                            }
                            $this.loadObj(rec, index);
                        }, time);

                    }
                } else {
                    setTimeout(function () {
                        if (!$slide.eq(index).hasClass('loaded')) {
                            var dataHtml = null;
                            if (settings.dynamic) {
                                dataHtml = settings.dynamicEl[index].html;
                            } else {
                                dataHtml = $children.eq(index).attr('data-html');
                            }
                            if (typeof dataHtml !== 'undefined' && dataHtml !== null) {
                                var fL = dataHtml.substring(0, 1);
                                if (fL == '.' || fL == '#') {
                                    dataHtml = $(dataHtml).html();
                                } else {
                                    dataHtml = dataHtml;
                                }
                            }
                            if (typeof dataHtml !== 'undefined' && dataHtml !== null) {
                                $slide.eq(index).append('<div class="video-cont" style="max-width:' + settings.videoMaxWidth + ' !important;"><div class="video">' + dataHtml + '</div></div>');
                            }
                            $this.addHtml(index);
                            $slide.eq(index).addClass('loaded complete');

                            if (settings.auto && settings.videoAutoplay === true) {
                                clearInterval(interval);
                            }
                        }
                        $this.loadObj(rec, index);
                    }, time);
                }

            },
            counter: function () {
                if (settings.counter === true) {
                    var slideCount = $("#lg-slider > div").length;
                    $gallery.append("<div id='lg-counter'><span id='lg-counter-current'></span> / <span id='lg-counter-all'>" + slideCount + "</span></div>");
                }
            },
            buildThumbnail: function () {
                if (settings.thumbnail === true && $children.length > 1) {
                    var $this = this,
                        $close = '';
                    if (!settings.showThumbByDefault) {
                        $close = '<span class="close ib"><i class="bUi-iCn-rMv-16" aria-hidden="true"></i></span>';
                    }
                    $gallery.append('<div class="thumb-cont"><div class="thumb-info">' + $close + '</div><div class="thumb-inner"></div></div>');
                    $thumb_cont = $gallery.find('.thumb-cont');
                    $prev.after('<a class="cl-thumb"></a>');
                    $prev.parent().addClass('has-thumb');
                    $gallery.find('.cl-thumb').bind('click touchend', function () {
                        $gallery.addClass('open');
                        if ($this.doCss() && settings.mode === 'slide') {
                            $slide.eq(index).prevAll().removeClass('next-slide').addClass('prev-slide');
                            $slide.eq(index).nextAll().removeClass('prev-slide').addClass('next-slide');
                        }
                    });
                    $gallery.find('.thumb-cont .close').bind('click touchend', function () {
                        $gallery.removeClass('open');
                    });
                    var thumbInfo = $gallery.find('.thumb-info');
                    var $thumb_inner = $gallery.find('.thumb-inner');
                    var thumbList = '';
                    var thumbImg;
                    if (settings.dynamic) {
                        for (var i = 0; i < settings.dynamicEl.length; i++) {
                            thumbImg = settings.dynamicEl[i].thumb;
                            thumbList += '<div class="thumb"><img src="' + thumbImg + '" /></div>';
                        }
                    } else {
                        $children.each(function () {
                            if (settings.exThumbImage === false || typeof $(this).attr(settings.exThumbImage) == 'undefined' || $(this).attr(settings.exThumbImage) === null) {
                                thumbImg = $(this).find('img').attr('src');
                            } else {
                                thumbImg = $(this).attr(settings.exThumbImage);
                            }
                            thumbList += '<div class="thumb"><img src="' + thumbImg + '" /></div>';
                        });
                    }
                    $thumb_inner.append(thumbList);
                    $thumb = $thumb_inner.find('.thumb');
                    $thumb.css({
                        'margin-right': settings.thumbMargin + 'px',
                        'width': settings.thumbWidth + 'px'
                    });
                    if (settings.animateThumb === true) {
                        var width = ($children.length * (settings.thumbWidth + settings.thumbMargin));
                        $gallery.find('.thumb-inner').css({
                            'width': width + 'px',
                            'position': 'relative',
                            'transition-duration': settings.speed + 'ms'
                        });
                    }
                    $thumb.bind('click touchend', function () {
                        usingThumb = true;
                        var index = $(this).index();
                        $thumb.removeClass('active');
                        $(this).addClass('active');
                        $this.slide(index);
                        $this.animateThumb(index);
                        clearInterval(interval);
                    });
                    thumbInfo.prepend('<span class="ib count">' + settings.lang.allPhotos + ' (' + $thumb.length + ')</span>');
                    if (settings.showThumbByDefault) {
                        $gallery.addClass('open');
                    }
                }
            },
            animateThumb: function (index) {
                if (settings.animateThumb === true) {
                    var thumb_contW = $gallery.find('.thumb-cont').width();
                    var position;
                    switch (settings.currentPagerPosition) {
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position = (thumb_contW / 2) - (settings.thumbWidth / 2);
                        break;
                    case 'right':
                        position = thumb_contW - settings.thumbWidth;
                    }
                    var left = ((settings.thumbWidth + settings.thumbMargin) * index - 1) - position;
                    var width = ($children.length * (settings.thumbWidth + settings.thumbMargin));
                    if (left > (width - thumb_contW)) {
                        left = width - thumb_contW;
                    }
                    if (left < 0) {
                        left = 0;
                    }
                    if (this.doCss()) {
                        $gallery.find('.thumb-inner').css('transform', 'translate3d(-' + left + 'px, 0px, 0px)');
                    } else {
                        $gallery.find('.thumb-inner').animate({
                            left: -left + "px"
                        }, settings.speed);
                    }
                }
            },
            slideTo: function () {
                var $this = this;
                if (settings.controls === true && $children.length > 1) {
                    $gallery.append('<div id="lg-action"><a id="lg-prev"></a><a id="lg-next"></a></div>');
                    $prev = $gallery.find('#lg-prev');
                    $next = $gallery.find('#lg-next');
                    $prev.bind('click', function () {
                        $this.prevSlide();
                        clearInterval(interval);
                    });
                    $next.bind('click', function () {
                        $this.nextSlide();
                        clearInterval(interval);
                    });
                }
            },
            autoStart: function () {
                var $this = this;
                if (settings.auto === true) {
                    interval = setInterval(function () {
                        if (index + 1 < $children.length) {
                            index = index;
                        } else {
                            index = -1;
                        }
                        index++;
                        $this.slide(index);
                    }, settings.pause);
                }
            },
            keyPress: function () {
                var $this = this;
                $(window).bind('keyup.lightGallery', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.keyCode === 37) {
                        $this.prevSlide();
                        clearInterval(interval);
                    }
                    if (e.keyCode === 38 && settings.thumbnail === true && $children.length > 1) {
                        if (!$gallery.hasClass('open')) {
                            if ($this.doCss() && settings.mode === 'slide') {
                                $slide.eq(index).prevAll().removeClass('next-slide').addClass('prev-slide');
                                $slide.eq(index).nextAll().removeClass('prev-slide').addClass('next-slide');
                            }
                            $gallery.addClass('open');
                        }
                    } else if (e.keyCode === 39) {
                        $this.nextSlide();
                        clearInterval(interval);
                    }
                    if (e.keyCode === 40 && settings.thumbnail === true && $children.length > 1 && !settings.showThumbByDefault) {
                        if ($gallery.hasClass('open')) {
                            $gallery.removeClass('open');
                        }
                    } else if (settings.escKey === true && e.keyCode === 27) {
                        if (!settings.showThumbByDefault && $gallery.hasClass('open')) {
                            $gallery.removeClass('open');
                        } else {
                            plugin.destroy(false);
                        }
                    }
                });
            },
            nextSlide: function () {
                var $this = this;
                index = $slide.index($slide.eq(prevIndex));
                if (index + 1 < $children.length) {
                    index++;
                    $this.slide(index);
                } else {
                    if (settings.loop) {
                        index = 0;
                        $this.slide(index);
                    } else if (settings.thumbnail === true && $children.length > 1 && !settings.showThumbByDefault) {
                        $gallery.addClass('open');
                    } else {
                        $slide.eq(index).find('.object').addClass('right-end');
                        setTimeout(function () {
                            $slide.find('.object').removeClass('right-end');
                        }, 400);
                    }
                }
                $this.animateThumb(index);
                settings.onSlideNext.call(this, plugin);
            },
            prevSlide: function () {
                var $this = this;
                index = $slide.index($slide.eq(prevIndex));
                if (index > 0) {
                    index--;
                    $this.slide(index);
                } else {
                    if (settings.loop) {
                        index = $children.length - 1;
                        $this.slide(index);
                    } else if (settings.thumbnail === true && $children.length > 1 && !settings.showThumbByDefault) {
                        $gallery.addClass('open');
                    } else {
                        $slide.eq(index).find('.object').addClass('left-end');
                        setTimeout(function () {
                            $slide.find('.object').removeClass('left-end');
                        }, 400);
                    }
                }
                $this.animateThumb(index);
                settings.onSlidePrev.call(this, plugin);
            },
            slide: function (index) {
                var $this = this;
                if (lightGalleryOn) {
                    setTimeout(function () {
                        $this.loadContent(index, false);
                    }, settings.speed + 400);
                    if (!$slider.hasClass('on')) {
                        $slider.addClass('on');
                    }
                    if (this.doCss() && settings.speed !== '') {
                        if (!$slider.hasClass('speed')) {
                            $slider.addClass('speed');
                        }
                        if (aSpeed === false) {
                            $slider.css('transition-duration', settings.speed + 'ms');
                            aSpeed = true;
                        }
                    }
                    if (this.doCss() && settings.cssEasing !== '') {
                        if (!$slider.hasClass('timing')) {
                            $slider.addClass('timing');
                        }
                        if (aTiming === false) {
                            $slider.css('transition-timing-function', settings.cssEasing);
                            aTiming = true;
                        }
                    }
                    settings.onSlideBefore.call(this, plugin);
                } else {
                    $this.loadContent(index, false);
                }
                if (settings.mode === 'slide') {
                    var isiPad = navigator.userAgent.match(/iPad/i) !== null;
                    if (this.doCss() && !$slider.hasClass('slide') && !isiPad) {
                        $slider.addClass('slide');
                    } else if (this.doCss() && !$slider.hasClass('use-left') && isiPad) {
                        $slider.addClass('use-left');
                    }
                    /*                  if(this.doCss()){
                        $slider.css({ 'transform' : 'translate3d('+(-index*100)+'%, 0px, 0px)' });
                    }*/
                    if (!this.doCss() && !lightGalleryOn) {
                        $slider.css({
                            left: (-index * 100) + '%'
                        });
                        //$slide.eq(index).css('transition','none');
                    } else if (!this.doCss() && lightGalleryOn) {
                        $slider.animate({
                            left: (-index * 100) + '%'
                        }, settings.speed, settings.easing);
                    }
                } else if (settings.mode === 'fade') {
                    if (this.doCss() && !$slider.hasClass('fade-m')) {
                        $slider.addClass('fade-m');
                    } else if (!this.doCss() && !$slider.hasClass('animate')) {
                        $slider.addClass('animate');
                    }
                    if (!this.doCss() && !lightGalleryOn) {
                        $slide.fadeOut(100);
                        $slide.eq(index).fadeIn(100);
                    } else if (!this.doCss() && lightGalleryOn) {
                        $slide.eq(prevIndex).fadeOut(settings.speed, settings.easing);
                        $slide.eq(index).fadeIn(settings.speed, settings.easing);
                    }
                }
                if (index + 1 >= $children.length && settings.auto && settings.loop === false) {
                    clearInterval(interval);
                }
                $slide.eq(prevIndex).removeClass('current');
                $slide.eq(index).addClass('current');
                if (this.doCss() && settings.mode === 'slide') {
                    if (usingThumb === false) {
                        $('.prev-slide').removeClass('prev-slide');
                        $('.next-slide').removeClass('next-slide');
                        $slide.eq(index - 1).addClass('prev-slide');
                        $slide.eq(index + 1).addClass('next-slide');
                    } else {
                        $slide.eq(index).prevAll().removeClass('next-slide').addClass('prev-slide');
                        $slide.eq(index).nextAll().removeClass('prev-slide').addClass('next-slide');
                    }
                }
                if (settings.thumbnail === true && $children.length > 1) {
                    $thumb.removeClass('active');
                    $thumb.eq(index).addClass('active');
                }
                if (settings.controls && settings.hideControlOnEnd && settings.loop === false && $children.length > 1) {
                    var l = $children.length;
                    l = parseInt(l) - 1;
                    if (index === 0) {
                        $prev.addClass('disabled');
                        $next.removeClass('disabled');
                    } else if (index === l) {
                        $prev.removeClass('disabled');
                        $next.addClass('disabled');
                    } else {
                        $prev.add($next).removeClass('disabled');
                    }
                }
                prevIndex = index;
                lightGalleryOn === false ? settings.onOpen.call(this, plugin) : settings.onSlideAfter.call(this, plugin);
                setTimeout(function () {
                    lightGalleryOn = true;
                });
                usingThumb = false;
                if (settings.counter) {
                    $("#lg-counter-current").text(index + 1);
                }
                $(window).bind('resize.lightGallery', function () {
                    setTimeout(function () {
                        $this.animateThumb(index);
                    }, 200);
                });
            }
        };
        plugin.isActive = function () {
            if (isActive === true) {
                return true;
            } else {
                return false;
            }

        };
        plugin.destroy = function (d) {
            isActive = false;
            d = typeof d !== 'undefined' ? false : true;
            settings.onBeforeClose.call(this, plugin);
            var lightGalleryOnT = lightGalleryOn;
            lightGalleryOn = false;
            aTiming = false;
            aSpeed = false;
            usingThumb = false;
            clearInterval(interval);
            if (d === true) {
                $children.off('click touch touchstart');
            }
            $('.light-gallery').off('mousedown mouseup');
            $('body').off('touchstart.lightGallery touchmove.lightGallery touchend.lightGallery');
            $(window).off('resize.lightGallery keyup.lightGallery');
            if (lightGalleryOnT === true) {
                $gallery.addClass('fade-m');
                setTimeout(function () {
                    $galleryCont.remove();
                    $('body').removeClass('light-gallery');
                }, 500);
            }
            settings.onCloseAfter.call(this, plugin);
        };
        lightGallery.init();
        return this;
    };
}(jQuery));
/** ==========================================================

* jquery lightSlider.js v1.1.1
* http://sachinchoolur.github.io/lightslider/
* Released under the MIT License - http://opensource.org/licenses/mit-license.html  ---- FREE ----

=========================================================/**/
;
(function ($, undefined) {
    "use strict";
    var defaults = {
        item: 3,
        autoWidth: false,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
        easing: 'linear', //'for jquery animation',//
        speed: 400, //ms'
        auto: false,
        loop: false,
        slideEndAnimatoin: true,
        pause: 2000,
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        rtl: false,
        adaptiveHeight: false,
        vertical: false,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        responsive: [],
        onBeforeStart: function ($el) {},
        onSliderLoad: function ($el) {},
        onBeforeSlide: function ($el, scene) {},
        onAfterSlide: function ($el, scene) {},
        onBeforeNextSlide: function ($el, scene) {},
        onBeforePrevSlide: function ($el, scene) {}
    };
    $.fn.lightSlider = function (options) {
        if (this.length === 0) {
            return this;
        }

        if (this.length > 1) {
            this.each(function () {
                $(this).lightSlider(options);
            });
            return this;
        }

        var plugin = {},
            settings = $.extend(true, {}, defaults, options),
            settingsTemp = {},
            $el = this,
            $wrap = $el.parent();
        plugin.$el = this;

        if (settings.mode === 'fade') {
            settings.vertical = false;
        }
        var $children = $el.children(),
            wrapperW = $wrap.width(),
            breakpoint = null,
            resposiveObj = null,
            length = 0,
            w = 0,
            on = false,
            elSize = 0,
            $slide = '',
            scene = 0,
            property = (settings.vertical === true) ? "height" : "width",
            gutter = (settings.vertical === true) ? "margin-bottom" : "margin-right",
            slideValue = 0,
            pagerWidth = 0,
            slideWidth = 0,
            thumbWidth = 0,
            interval = null,
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = new Object();

        refresh.chbreakpoint = function () {
            wrapperW = $wrap.width();
            if (settings.responsive.length) {
                if (settings.autoWidth === false) {
                    var item = settings.item;
                }
                if (wrapperW < settings.responsive[0].breakpoint) {
                    for (var i = 0; i < settings.responsive.length; i++) {
                        if (wrapperW < settings.responsive[i].breakpoint) {
                            breakpoint = settings.responsive[i].breakpoint;
                            resposiveObj = settings.responsive[i];
                        }
                    }
                }
                if (typeof resposiveObj !== "undefined" && resposiveObj != null) {
                    for (i in resposiveObj.settings) {
                        if (typeof settingsTemp[i] == "undefined" || settingsTemp[i] == null) {
                            settingsTemp[i] = settings[i];
                        }
                        settings[i] = resposiveObj.settings[i];
                    }
                }
                if (!$.isEmptyObject(settingsTemp) && wrapperW > settings.responsive[0].breakpoint) {
                    for (i in settingsTemp) {
                        settings[i] = settingsTemp[i];
                    }
                }
                if (settings.autoWidth === false) {
                    if (slideValue > 0 && slideWidth > 0) {
                        if (item !== settings.item) {
                            scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                        }
                    }
                }
            }
        };

        refresh.calSW = function () {
            if (settings.autoWidth === false) {
                slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
            }
        };

        refresh.calWidth = function (cln) {
            var ln = cln === true ? $slide.find('.lslide').length : $children.length;
            if (settings.autoWidth === false) {
                w = ln * (slideWidth + settings.slideMargin);
            } else {
                w = 0;
                for (var i = 0; i < ln; i++) {
                    w += (parseInt($children.eq(i).width()) + settings.slideMargin);
                }
            }
            if (w % 1 !== 0) {
                w = w + 1;
            }
            return w;
        };
        plugin = {
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            keyPress: function () {
                if (settings.keyPress) {
                    $(document).on('keyup.lightslider', function (e) {
                        e.preventDefault();
                        if (e.keyCode === 37) {
                            $el.goToPrevSlide();
                            clearInterval(interval);
                        } else if (e.keyCode === 39) {
                            $el.goToNextSlide();
                            clearInterval(interval);
                        }
                    });
                }
            },
            controls: function () {
                if (settings.controls) {
                    $el.after('<div class="lSAction"><a class="lSPrev">' + settings.prevHtml + '</a><a class="lSNext">' + settings.nextHtml + '</a></div>');
                    if (!settings.autoWidth) {
                        if (length <= settings.item) {
                            $slide.find('.lSAction').hide();
                        }
                    } else {
                        if (refresh.calWidth(false) < elSize) {
                            $slide.find('.lSAction').hide();
                        }
                    }
                    $slide.find('.lSAction a').on('click', function (e) {
                        e.preventDefault();
                        if ($(this).attr('class') === 'lSPrev') {
                            $el.goToPrevSlide();
                        } else {
                            $el.goToNextSlide();
                        }
                        clearInterval(interval);
                        return false;
                    });
                }
            },
            initialStyle: function () {
                var $this = this;
                if (settings.mode === 'fade') {
                    settings.autoWidth = false;
                    settings.slideEndAnimatoin = false;
                }
                if (settings.auto) {
                    settings.slideEndAnimatoin = false;
                };
                if (settings.autoWidth) {
                    settings.slideMove = 1;
                    settings.item = 1;
                }
                if (settings.loop) {
                    settings.slideMove = 1;
                    settings.freeMove = false;
                }
                settings.onBeforeStart.call(this, $el);
                refresh.chbreakpoint();
                $el.addClass('lightSlider').wrap("<div class='lSSlideOuter " + settings.addClass + "'><div class='lSSlideWrapper'></div></div>");
                $slide = $el.parent('.lSSlideWrapper');
                if (settings.rtl === true) {
                    $slide.parent().addClass('lSrtl');
                }
                if (settings.vertical) {
                    $slide.parent().addClass('vertical');
                    elSize = settings.verticalHeight;
                    $slide.css('height', elSize + 'px');
                } else {
                    elSize = $el.outerWidth();
                }
                $children.addClass('lslide');
                if (settings.loop === true && settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.clone = function () {
                        if (refresh.calWidth(true) > elSize) {
                            /**/
                            var tWr = 0,
                                tI = 0;
                            for (var k = 0; k < $children.length; k++) {
                                tWr += (parseInt($el.find('.lslide').eq(k).width()) + settings.slideMargin);
                                tI++;
                                if (tWr >= (elSize + settings.slideMargin)) {
                                    break;
                                }
                            }
                            var tItem = settings.autoWidth === true ? tI : settings.item;

                            /**/
                            if (tItem < $el.find('.clone.left').length) {
                                for (var i = 0; i < $el.find('.clone.left').length - tItem; i++) {
                                    $children.eq(i).remove();
                                }
                            }
                            if (tItem < $el.find('.clone.right').length) {
                                for (var j = $children.length - 1; j > ($children.length - 1 - $el.find('.clone.right').length); j--) {
                                    scene--;
                                    $children.eq(j).remove();
                                }
                            }
                            /**/
                            for (var k = $el.find('.clone.right').length; k < tItem; k++) {
                                $el.find('.lslide').eq(k).clone().removeClass('lslide').addClass('clone right').appendTo($el);
                                scene++;
                            }
                            for (var m = $el.find('.lslide').length - $el.find('.clone.left').length; m > ($el.find('.lslide').length - tItem); m--) {
                                $el.find('.lslide').eq(m - 1).clone().removeClass('lslide').addClass('clone left').prependTo($el);
                            }
                            $children = $el.children();
                        } else {
                            if ($children.hasClass('clone')) {
                                $el.find('.clone').remove();
                                $this.move($el, 0);
                            }
                        }
                    };
                    refresh.clone();
                }
                refresh.sSW = function () {
                    length = $children.length;
                    if (settings.rtl === true && settings.vertical === false) {
                        gutter = "margin-left";
                    }
                    if (settings.autoWidth === false) {
                        $children.css(property, slideWidth + 'px');
                    }
                    $children.css(gutter, settings.slideMargin + 'px');
                    w = refresh.calWidth(false);
                    $el.css(property, w + 'px');
                    if (settings.loop === true && settings.mode === 'slide') {
                        if (on === false) {
                            scene = $el.find('.clone.left').length;
                        }
                    }
                };
                refresh.calL = function () {
                    $children = $el.children();
                    length = $children.length;
                };
                if (this.doCss()) {
                    $slide.addClass('usingCss');
                }
                refresh.calL();
                if (settings.mode === "slide") {
                    refresh.calSW();
                    refresh.sSW();
                    if (settings.loop === true) {
                        slideValue = $this.slideValue();
                        this.move($el, slideValue);
                    }
                    if (settings.vertical === false) {
                        this.setHeight($el, false, true);
                    }

                } else {
                    this.setHeight($el, true, true);
                    $el.addClass('lSFade');
                    if (!this.doCss()) {
                        $children.not(".active").css('display', 'none');
                    }
                }
                if (settings.loop === true && settings.mode === 'slide') {
                    $children.eq(scene).addClass('active');
                } else {
                    $children.first().addClass('active');
                }
            },
            pager: function () {
                var $this = this;
                refresh.createPager = function () {
                    thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
                    var $children = $slide.find('.lslide');
                    var length = $slide.find('.lslide').length;
                    var i = 0,
                        pagers = '',
                        v = 0;
                    for (i = 0; i < length; i++) {
                        if (settings.mode === 'slide') {
                            // calculate scene * slide value
                            if (!settings.autoWidth) {
                                v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                            } else {
                                v += ((parseInt($children.eq(i).width()) + settings.slideMargin) * settings.slideMove);
                            }
                        }
                        var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
                        if (settings.gallery === true) {
                            pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="#"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elSize - settings.slideMargin) {
                                i = i + 1;
                                var minPgr = 2;
                                if (settings.autoWidth) {
                                    pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                                    minPgr = 1;
                                }
                                if (i < minPgr) {
                                    pagers = null;
                                    $slide.parent().addClass('noPager');
                                } else {
                                    $slide.parent().removeClass('noPager');
                                }
                                break;
                            }
                        }
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.lSPager').html(pagers);
                    if (!settings.vertical && settings.gallery) {
                        var $pgr = $slide.parent().find('.lSGallery');
                        setTimeout(function () {
                            $this.setHeight($pgr, false, false);
                        });
                    }
                    if (settings.gallery === true) {
                        if (settings.vertical === true) {
                            // set Gallery thumbnail width
                            $cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
                        }
                        pagerWidth = (i * (settings.thumbMargin + thumbWidth)) + 0.5;
                        $cSouter.find('.lSPager').css({
                            property: pagerWidth + 'px',
                            'transition-duration': settings.speed + 'ms'
                        });
                        if (settings.vertical === true) {
                            $slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
                        }
                        $cSouter.find('.lSPager').css(property, pagerWidth + 'px');
                    }
                    var $pager = $cSouter.find('.lSPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function () {
                        if (settings.loop === true && settings.mode === 'slide') {
                            scene = scene + ($pager.index(this) - $cSouter.find('.lSPager').find('li.active').index());
                        } else {
                            scene = $pager.index(this);
                        }
                        $el.mode(false);
                        if (settings.gallery === true) {
                            $this.slideThumb();
                        }
                        clearInterval(interval);
                        return false;
                    });
                };
                if (settings.pager) {
                    var cl = 'lSpg';
                    if (settings.gallery) {
                        cl = 'lSGallery';
                    }
                    $slide.after('<ul class="lSPager ' + cl + '"></ul>');
                    var gMargin = (settings.vertical) ? "margin-left" : "margin-top";
                    $slide.parent().find('.lSPager').css(gMargin, settings.galleryMargin + 'px');
                    refresh.createPager();
                }
                
                setTimeout(function () {
                    refresh.init();
                }, 0);
            },
            setHeight: function (ob, fade, loop) {
                var obj = null;
                if (loop) {
                    obj = ob.children(".lslide ").first();
                }else{
                    obj = ob.children().first();
                }
                var setCss = function () {
                    var tH = obj.height(),
                        tP = 0,
                        tHT = tH;
                    if (fade) {
                        tH = 0;
                        tP = ((tHT) * 100) / elSize;
                    }
                    ob.css({
                        'height': tH + 'px',
                        'padding-bottom': tP + '%'
                    });
                };
                setCss();
                obj.find('img').load(function () {
                    setTimeout(function(){
                        setCss();
                    },100);
                });
            },
            active: function (ob, t) {
                if (this.doCss() && settings.mode === "fade") {
                    $slide.addClass('on');
                }
                var sc = 0;
                if (scene * settings.slideMove < length) {
                    ob.removeClass('active');
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.fadeOut(settings.speed);
                    }
                    t === true ? sc = scene : sc = scene * settings.slideMove;
                    if (t === true) {
                        var l = ob.length;
                        var nl = l - 1;
                        if (sc + 1 >= l) {
                            sc = nl;
                        }
                    }
                    if (settings.loop === true && settings.mode === 'slide') {
                        t === true ? sc = scene - $el.find('.clone.left').length : sc = scene * settings.slideMove;
                        if (t === true) {
                            var l = ob.length;
                            var nl = l - 1;
                            if (sc + 1 == l) {
                                sc = nl;
                            } else if (sc + 1 > l) {
                                sc = 0;
                            }
                        }
                    }

                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                    ob.eq(sc).addClass('active');
                } else {
                    ob.removeClass('active');
                    ob.eq(ob.length - 1).addClass('active');
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.fadeOut(settings.speed);
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                }
            },
            move: function (ob, v) {
                if (settings.rtl === true) {
                    v = -v;
                }
                if (this.doCss()) {
                    if (settings.vertical === true) {
                        ob.css({
                            'transform': 'translate3d(0px, ' + (-v) + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + (-v) + 'px, 0px)'
                        });
                    } else {
                        ob.css({
                            'transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                            '-webkit-transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                        });
                    }
                } else {
                    if (settings.vertical === true) {
                        ob.css('position', 'relative').animate({
                            top: -v + 'px'
                        }, settings.speed, settings.easing);
                    } else {
                        ob.css('position', 'relative').animate({
                            left: -v + 'px'
                        }, settings.speed, settings.easing);
                    }
                }
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            fade: function () {
                this.active($children, false);
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            slide: function () {
                var $this = this;
                refresh.calSlide = function () {
                    if (w > elSize) {
                        slideValue = $this.slideValue();
                        $this.active($children, false);
                        if ((slideValue) > w - elSize - settings.slideMargin) {
                            slideValue = w - elSize - settings.slideMargin;
                        } else if (slideValue < 0) {
                            slideValue = 0;
                        }
                        $this.move($el, slideValue);
                        if (settings.loop === true && settings.mode === 'slide') {
                            if (scene >= (length - ($el.find('.clone.left').length / settings.slideMove))) {
                                $this.resetSlide($el.find('.clone.left').length);
                            }
                            if (scene === 0) {
                                $this.resetSlide($slide.find('.lslide').length);
                            }
                        }
                    }
                };
                refresh.calSlide();
            },
            resetSlide: function (s) {
                var $this = this;
                $slide.find('.lSAction a').addClass('disabled');
                setTimeout(function () {
                    scene = s;
                    $slide.css('transition-duration', '0ms');
                    slideValue = $this.slideValue();
                    $this.active($children, false);
                    plugin.move($el, slideValue);
                    setTimeout(function () {
                        $slide.css('transition-duration', settings.speed + 'ms');
                        $slide.find('.lSAction a').removeClass('disabled');
                    }, 50);
                }, settings.speed + 100);
            },
            slideValue: function () {
                var _sV = 0;
                if (settings.autoWidth === false) {
                    _sV = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                } else {
                    _sV = 0;
                    for (var i = 0; i < scene; i++) {
                        _sV += (parseInt($children.eq(i).width()) + settings.slideMargin);
                    }
                }
                return _sV;
            },
            slideThumb: function () {
                var position;
                switch (settings.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = (elSize / 2) - (thumbWidth / 2);
                    break;
                case 'right':
                    position = elSize - thumbWidth;
                }
                var sc = scene - $el.find('.clone.left').length;
                var $pager = $slide.parent().find('.lSPager');
                if (settings.mode === 'slide' && settings.loop === true) {
                    if (sc >= $pager.children().length) {
                        sc = 0;
                    } else if (sc < 0) {
                        sc = $pager.children().length;
                    }
                }
                var thumbSlide = sc * ((thumbWidth + settings.thumbMargin)) - (position);
                if ((thumbSlide + elSize) > pagerWidth) {
                    thumbSlide = pagerWidth - elSize - settings.thumbMargin;
                }
                if (thumbSlide < 0) {
                    thumbSlide = 0;
                }
                this.move($pager, thumbSlide);
            },
            auto: function () {
                if (settings.auto) {
                    interval = setInterval(function () {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },

            touchMove: function (endCoords, startCoords) {
                $slide.css('transition-duration', '0ms');
                if (settings.mode === 'slide') {
                    var distance = endCoords - startCoords;
                    var swipeVal = slideValue - distance;
                    if ((swipeVal) >= w - elSize - settings.slideMargin) {
                        if (settings.freeMove === false) {
                            swipeVal = w - elSize - settings.slideMargin;
                        } else {
                            var swipeValT = w - elSize - settings.slideMargin;
                            swipeVal = swipeValT + ((swipeVal - swipeValT) / 5);

                        }
                    } else if (swipeVal < 0) {
                        if (settings.freeMove === false) {
                            swipeVal = 0;
                        } else {
                            swipeVal = swipeVal / 5;
                        }
                    }
                    this.move($el, swipeVal);
                }
            },

            touchEnd: function (distance) {
                $slide.css('transition-duration', settings.speed + 'ms');
                clearInterval(interval);
                if (settings.mode === 'slide') {
                    var mxVal = false;
                    var _next = true;
                    slideValue = slideValue - distance;
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                        if (settings.autoWidth === false) {
                            mxVal = true;
                        }
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    var gC = function (next) {
                        var ad = 0;
                        if (!mxVal) {
                            if (next) {
                                ad = 1;
                            };
                        }
                        if (!settings.autoWidth) {
                            var num = slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove);
                            scene = parseInt(num) + ad;
                            if (slideValue >= (w - elSize - settings.slideMargin)) {
                                if (num % 1 !== 0) {
                                    scene++;
                                }
                            }
                        } else {
                            var tW = 0;
                            for (var i = 0; i < $children.length; i++) {
                                tW += (parseInt($children.eq(i).width()) + settings.slideMargin);
                                scene = i + ad;
                                if (tW >= slideValue) {
                                    break;
                                }
                            }
                        }
                    };
                    if (distance >= settings.swipeThreshold) {
                        gC(false);
                        _next = false;
                    } else if (distance <= -settings.swipeThreshold) {
                        gC(true);
                        _next = false;
                    }
                    $el.mode(_next);
                    this.slideThumb();
                } else {
                    if (distance >= settings.swipeThreshold) {
                        $el.goToPrevSlide();
                    } else if (distance <= -settings.swipeThreshold) {
                        $el.goToNextSlide();
                    }
                }
            },



            enableDrag: function () {
                var $this = this;
                if (!isTouch) {
                    var startCoords = 0,
                        endCoords = 0,
                        isDraging = false;
                    $slide.on('mousedown', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if ($(e.target).attr('class') !== ('lSPrev') && $(e.target).attr('class') !== ('lSNext')) {
                            startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            isDraging = true;
                            e.preventDefault();
                        }
                    });
                    $(window).on('mousemove', function (e) {
                        if (isDraging) {
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            $this.touchMove(endCoords, startCoords);
                        }
                    });
                    $(window).on('mouseup', function (e) {
                        if (isDraging) {
                            isDraging = false;
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            var distance = endCoords - startCoords;
                            if (Math.abs(distance) >= settings.swipeThreshold) {
                                $(window).on('click.ls', function(e) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    $(window).off('click.ls');
                                });
                            }

                            $this.touchEnd(distance);

                        }
                    });
                }
            },




            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                    });
                    $slide.on('touchmove', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (settings.vertical === true) {
                            if ((yMovement * 3) > xMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageY, startCoords.pageY);
                        } else {
                            if ((xMovement * 3) > yMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageX, startCoords.pageX);
                        }

                    });
                    $slide.on('touchend', function () {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if (settings.vertical === true) {
                            var distance = endCoords.pageY - startCoords.pageY;
                        } else {
                            var distance = endCoords.pageX - startCoords.pageX;
                        }
                        $this.touchEnd(distance);
                    });
                }
            },
            build: function () {
                var $this = this;
                $this.initialStyle();
                $this.auto();
                if (this.doCss()) {

                    if (settings.enableTouch === true) {
                        $this.enableTouch();
                    }
                    if (settings.enableDrag === true) {
                        $this.enableDrag();
                    }
                }
                $this.pager();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function () {
            refresh.chbreakpoint();
            if (settings.vertical === true) {
                if (settings.item > 1) {
                    elSize = settings.verticalHeight;
                } else {
                    elSize = $children.outerHeight();
                }
                $slide.css('height', elSize + 'px');
            } else {
                elSize = $slide.outerWidth();
            }
            if (settings.loop === true && settings.mode === 'slide') {
                refresh.clone();
            }
            refresh.calL();
            if (settings.mode === "slide") {
                $el.removeClass('lSSlide');
            }
            if (settings.mode === "slide") {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function () {
                if (settings.mode === "slide") {
                    $el.addClass('lSSlide');
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).height());
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (settings.mode === "slide") {
                plugin.slide();
            }
            if (settings.autoWidth === false) {
                if ($children.length <= settings.item) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            } else {
                if ((refresh.calWidth(false) < elSize) && (w !== 0)) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            }
        };
        $el.goToPrevSlide = function () {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this, $el, scene);
                scene--;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this, $el, scene);
                    if (settings.mode === 'fade') {
                        var l = (length - 1);
                        scene = parseInt(l / settings.slideMove);
                    }
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimatoin === true) {
                    $el.addClass('leftEnd');
                    setTimeout(function () {
                        $el.removeClass('leftEnd');
                    }, 400);
                }
            }
        };
        $el.goToNextSlide = function () {
            var nextI = true;
            if (settings.mode === 'slide') {
                var _slideValue = plugin.slideValue();
                var nextI = _slideValue < w - elSize - settings.slideMargin;
            }
            if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
                settings.onBeforeNextSlide.call(this, $el, scene);
                scene++;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this, $el, scene);
                    scene = 0;
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimatoin === true) {
                    $el.addClass('rightEnd');
                    setTimeout(function () {
                        $el.removeClass('rightEnd');
                    }, 400);
                }
            }
        };
        $el.mode = function (_touch) {
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).height());
            }
            if (on === false) {
                if (settings.mode === "slide") {
                    if (plugin.doCss()) {
                        $el.addClass('lSSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $slide.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $el.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                }
            }
            if (!_touch) {
                settings.onBeforeSlide.call(this, $el, scene);
            }
            if (settings.mode === "slide") {
                plugin.slide();
            } else {
                plugin.fade();
            }
            setTimeout(function () {
                if (!_touch) {
                    settings.onAfterSlide.call(this, $el, scene);
                }
            }, settings.speed);
            on = true;
        };
        $el.play = function () {
            clearInterval(interval);
            $el.goToNextSlide();
            interval = setInterval(function () {
                $el.goToNextSlide();
            }, settings.pause);
        };
        $el.pause = function () {
            clearInterval(interval);
        };
        $el.refresh = function () {
            refresh.init();
        };
        $el.getCurrentSlideCount = function () {
            var sc = scene;
            if (settings.loop) {
                var ln = $slide.find('.lslide').length,
                    cl = $el.find('.clone.left').length;
                if(scene<=cl-1){
                    sc = ln  + (scene-cl);
                }else if(scene >= (ln+cl)){
                    sc = scene - ln - cl;
                }else{
                    sc = scene - cl;
                }
            };
            return sc+1;
        };
        $el.getTotalSlideCount = function(){
            return $slide.find('.lslide').length;
        };
        $el.goToSlide = function (s) {
            if (settings.loop) {
                scene = (s + $el.find('.clone.left').length -1);
            }else{
                scene = s;
            }
            $el.mode(false);
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
        };
        setTimeout(function(){
            settings.onSliderLoad.call(this, $el);
        },10);
        $(window).on('resize orientationchange', function (e) {
            setTimeout(function () {
                e.preventDefault();
                refresh.init();
            }, 200);
        });
        return this;
    };
}(jQuery));
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
                    display = $that.css('display') === 'inline-block' ? 'inline-block' : 'block';

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
                        display = $that.css('display') === 'inline-block' ? 'inline-block' : 'block';

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
                $that.css(opts.property, targetHeight - verticalPadding);
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
MIXT JS PLUGINS
/ ------------------------------------------------ */

'use strict'; /* jshint unused: false */

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
		iframe.height( width * iframe.data('ratio') );
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
	hsp = Math.sqrt(
		0.299 * (r * r) +
		0.587 * (g * g) +
		0.114 * (b * b)
	);
	if (hsp>127.5) {
		return 'light';
	} else {
		return 'dark';
	}
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
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-backgroundsize-rgba-cssanimations-generatedcontent-csstransitions-audio-video-svg-shiv-addtest-teststyles-testprop-testallprops-domprefixes-css_backgroundsizecover-css_vhunit-css_vwunit-load
 */
;window.Modernizr=function(a,b,c){function z(a){i.cssText=a}function A(a,b){return z(prefixes.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.8.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k=":)",l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={svg:"http://www.w3.org/2000/svg"},q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.rgba=function(){return z("background-color:rgba(150,255,150,.5)"),C(i.backgroundColor,"rgba")},q.backgroundsize=function(){return F("backgroundSize")},q.cssanimations=function(){return F("animationName")},q.csstransitions=function(){return F("transition")},q.generatedcontent=function(){var a;return w(["#",g,"{font:0/0 a}#",g,':after{content:"',k,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},q.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},q.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},q.svg=function(){return!!b.createElementNS&&!!b.createElementNS(p.svg,"svg").createSVGRect};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),h=j=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},Modernizr.testStyles("#modernizr{background-size:cover}",function(a){var b=window.getComputedStyle?window.getComputedStyle(a,null):a.currentStyle;Modernizr.addTest("bgsizecover",b.backgroundSize=="cover")}),Modernizr.addTest("cssvhunit",function(){var a;return Modernizr.testStyles("#modernizr { height: 50vh; }",function(b,c){var d=parseInt(window.innerHeight/2,10),e=parseInt((window.getComputedStyle?getComputedStyle(b,null):b.currentStyle).height,10);a=e==d}),a}),Modernizr.addTest("cssvwunit",function(){var a;return Modernizr.testStyles("#modernizr { width: 50vw; }",function(b,c){var d=parseInt(window.innerWidth/2,10),e=parseInt((window.getComputedStyle?getComputedStyle(b,null):b.currentStyle).width,10);a=e==d}),a});
/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function() {

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    this.ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            this.q = [];
            this.add = function(ev) {
                this.q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = this.q.length; i < j; i++) {
                    this.q[i].call();
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (!{fixed: 1, absolute: 1}[getComputedStyle(element, 'position')]) {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];
            var shrinkChild = shrink.childNodes[0];

            var lastWidth, lastHeight;

            var reset = function() {
                expandChild.style.width = expand.offsetWidth + 10 + 'px';
                expandChild.style.height = expand.offsetHeight + 10 + 'px';
                expand.scrollLeft = expand.scrollWidth;
                expand.scrollTop = expand.scrollHeight;
                shrink.scrollLeft = shrink.scrollWidth;
                shrink.scrollTop = shrink.scrollHeight;
                lastWidth = element.offsetWidth;
                lastHeight = element.offsetHeight;
            };

            reset();

            var changed = function() {
                if (element.resizedAttached) {
                    element.resizedAttached.call();
                }
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', function() {
                if (element.offsetWidth > lastWidth || element.offsetHeight > lastHeight) {
                    changed();
                }
                reset();
            });

            addEvent(shrink, 'scroll',function() {
                if (element.offsetWidth < lastWidth || element.offsetHeight < lastHeight) {
                    changed();
                }
                reset();
            });
        }

        if ("[object Array]" === Object.prototype.toString.call(element)
            || ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && element instanceof Elements) //mootools
            ) {
            var i = 0, j = element.length;
            for (; i < j; i++) {
                attachResizeEvent(element[i], callback);
            }
        } else {
            attachResizeEvent(element, callback);
        }

        this.detach = function() {
            ResizeSensor.detach(element);
        };
    };

    this.ResizeSensor.detach = function(element) {
        if (element.resizeSensor) {
            element.removeChild(element.resizeSensor);
            delete element.resizeSensor;
            delete element.resizedAttached;
        }
    };

})();

/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport  = $(window),
		topNavBar = $('#top-nav'),
		mediaWrap = $('.head-media');

	// Head Media Functions
	function headerFn() {
		var container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = topNavBar.outerHeight(),
			wrapHeight   = mediaWrap.height(),
			hmHeight     = 0;

		if ( mixt_opt.header.fullscreen ) {
			mediaWrap.css('height', wrapHeight);
			
			hmHeight = viewport.height() - mediaWrap.offset().top;

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) { hmHeight -= topNavHeight; }

			mediaWrap.css('height', hmHeight);
			mediaCont.css('height', hmHeight);
		}

		if ( mixt_opt.nav.transparent && mediaCont.length == 1 ) {
			var containerPad = topNavHeight;

			if ( mixt_opt.nav.position == 'below' ) {
				container.css('padding-bottom', containerPad);
			} else {
				container.css('padding-top', containerPad);
			}
		}
	}

	// Header Fade Effect
	function headerFade() {
		var content = $('.container', mediaWrap),
			contH   = content.innerHeight(),
			scrollE = $.throttle( 100, scrollHandler );

		function scrollHandler() {
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			if ( scrollTop > contH ) {
				content.css({
					'opacity': 0,
					'-webkit-transform': 'translate(0px,0px)',
				    '-ms-transform': 'translate(0px,0px)',
				    'transform': 'translate(0px,0px)'
				});
			} else {
				var translate = 'translate(0px, ' + ( scrollTop / 3 ) + 'px)';
				content.css({
					'opacity': 1 - scrollTop / (contH / 1.2),
					'-webkit-transform': translate,
				    '-ms-transform': translate,
				    'transform': translate
				});
			}
		}

		$(window).on('scroll', scrollE);
	}
	if ( mixt_opt.header['content-fade'] ) { headerFade(); }


	// Header Scroll To Content
	function headerScroll() {
		var page   = $('html, body'),
			offset = $('#content-wrap').offset().top;
		if ( mixt_opt.nav.mode == 'fixed' ) { offset -= topNavBar.children('.container').height(); }
		$('.header-scroll').on('click', function() {
			page.animate({ scrollTop: offset }, 800);
		});
	}

	if ( mixt_opt.header.enabled ) {
		headerFn();

		if ( mixt_opt.header.scroll ) { headerScroll(); }
		
		$(window).resize( $.debounce( 500, headerFn ));
	}

}(jQuery);

/* ------------------------------------------------ /
MIXT INTEGRATION FUNCTIONS
/ ------------------------------------------------ */

'use strict';

// Skip Link Focus Fix

( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
		is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
		is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
		var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
		window[ eventMethod ]( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();

// Run On Page Load

jQuery( document ).ready( function( $ ) {

	// Add Bootstrap Classes

	$('input.search-field').addClass('form-control');
	$('input.search-submit').addClass('btn btn-default');

	$('.widget_rss ul').addClass('media-list');

	$('.widget_meta ul, .widget_recent_entries ul, .widget_archive ul, .widget_categories ul, .widget_nav_menu ul, .widget_pages ul').addClass('nav');

	$('.widget_recent_comments ul#recentcomments').css('list-style', 'none').css('padding-left', '0');
	$('.widget_recent_comments ul#recentcomments li').css('padding', '5px 15px');

	$('table#wp-calendar').addClass('table table-striped');

	// Handle Post Count

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

	// Gallery Arrow Navigation

	$( document ).keydown( function(e) {
		var url = false;
		if ( e.which === 37 ) {  // Left arrow key code
			url = $('.previous-image a').attr('href');
		}
		else if ( e.which === 39 ) {  // Right arrow key code
			url = $('.entry-attachment a').attr('href');
		}
		if ( url && ( !$('textarea, input').is(':focus') ) ) {
			window.location = url;
		}
	});

});

/* ------------------------------------------------ /
NAVBAR FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt, colorLoD */

	var viewport    = $(window),
		bodyEl      = $('body'),
		mainWrap    = $('#main-wrap'),
		topNavBar   = $('#top-nav'),
		topNavWrap  = $('#top-nav-wrap'),
		topNavHead  = $('.navbar-header', topNavBar),
		topNavInner = $('.navbar-inner', topNavBar),
		secNavBar   = $('#second-nav'),
		navbars     = $('.navbar'),
		mediaWrap   = $('.head-media');

	var navbarObj = {

		navBg: '',
		navBgTop: '',

		// Set Background Color Class

		init: function(navbar) {

			var bgColor  = navbar.css('background-color'),
				colorLum = colorLoD(bgColor);

			if ( colorLum == 'dark' ) { navbar.addClass('bg-dark'); }
			if ( navbar.is(topNavBar) ) {
				navbarObj.navBg = ( colorLum == 'dark' ) ? 'bg-dark' : '';
				if ( mixt_opt.nav.transparent && mixt_opt.header.enabled && mixt_opt.nav['top-opacity'] <= 0.4 ) {
					navbarObj.navBgTop = mediaWrap.hasClass('bg-dark') ? 'bg-dark' : '';
				} else {
					navbarObj.navBgTop = navbarObj.navBg;
				}
				if ( mixt_opt.nav.mode == 'static' ) {
					topNavBar.removeClass(navbarObj.navBg).addClass('position-top ' + navbarObj.navBgTop);
				}
			}
		},

		// Sticky (fixed) Navbar Function

		stickyNav: function(isMobile) {

			var navScrollHandler = $.throttle( 50, stickyNavToggle ),
				scrollCorrection = 0,
				topNavHeight     = 0,
				topNavPos        = 0,
				topNavMg         = 0;

			if ( isMobile === false ) { viewport.on('scroll', navScrollHandler); }
			else { viewport.off('scroll', navScrollHandler); }

			if ( mixt_opt.page['show-admin-bar'] ) {
				scrollCorrection += parseFloat(mainWrap.css('padding-top'), 10);
			}

			if ( mixt_opt.nav.transparent && mixt_opt.nav.position == 'below' ) {
				topNavHeight = topNavBar.css('height', '').outerHeight();
				topNavPos    = parseInt(topNavBar.css('top'), 10);
				topNavMg     = topNavHeight;

				if ( topNavPos === 0 || isNaN(topNavPos) ) {
					topNavBar.css('margin-top', (topNavHeight * -1));
				}
			}

			function stickyNavToggle() {
				var navPos    = topNavWrap.offset().top - topNavMg,
					scrollVal = viewport.scrollTop(),
					bgTopCls  = navbarObj.navBgTop;

				scrollVal = isMobile === true ? 0 : scrollVal += scrollCorrection;

				if ( topNavBar.hasClass('slide-bg-dark') ) { bgTopCls = 'bg-dark'; }
				if ( topNavBar.hasClass('slide-bg-light') ) { bgTopCls = ''; }

				if ( scrollVal > navPos ) {  
					bodyEl.addClass('fixed-nav');
					topNavBar.removeClass('position-top ' + bgTopCls).addClass(navbarObj.navBg);
				} else {
					bodyEl.removeClass('fixed-nav');
					topNavBar.removeClass(navbarObj.navBg).addClass('position-top ' + bgTopCls);
				}
			}

			stickyNavToggle();
		},

		// Prevent Navbar Submenu Overflow Out Of Viewport

		menuOverflow: function(navbar) {

			var navbarOff = 0,
				mainSub = navbar.find('.drop-menu .dropdown-menu, .mega-menu-column > .sub-menu, .mega-menu-column > a');

			if ( navbar.length > 0 ) {
				navbarOff = navbar.outerWidth() + parseInt(navbar.offset().left, 10);
			}

			// Set Menu Drop Left

			function setDropLeft(target) {
				target.find('.sub-menu').addClass('drop-left');
				if ( target.hasClass('arrow-left') || target.hasClass('arrow-right') ) {
					target.addClass('arrow-left').removeClass('arrow-right');
					target.find('.drop-submenu').addClass('arrow-left').removeClass('arrow-right');
				}
			}
			// Reset Menu Drop

			function resetArrow(target) {
				target.find('.sub-menu').removeClass('drop-left');
				if ( target.hasClass('arrow-left') || target.hasClass('arrow-right') ) {
					target.addClass('arrow-right').removeClass('arrow-left');
					target.find('.drop-submenu').addClass('arrow-right').removeClass('arrow-left');
				}
			}

			// Reset Mobile Adjustments

			topNavBar.css({ 'position': '', 'top': '' }).removeClass('stopped');

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
					setDropLeft(overflowingSubs);
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

					if ( (nestOff + maxNestW) >= bodyEl.width() ) {
						setDropLeft(subNow);
					} else {
						resetArrow(subNow);
					}

				});

			});
		},

		// Mega Menu Enable / Disable

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

		// Create Mega Menu Rows If There Are More Than 4 Columns

		megaMenuRows: function() {
			mainWrap.find('.mega-menu').each( function() {
				var mainMenu = $(this).children('.sub-menu'),
					columns  = mainMenu.children('.mega-menu-column');

				if ( columns.length > 4 ) mainMenu.addClass('multi-row');
			});
		},

		// Mobile Functions

		navMobile: function(mqNav) {

			// Enable Nav Scrolling If Navbar Height > Viewport

			function navScroll() {
				if ( mixt_opt.nav.mode == 'fixed' && mqNav == 2 ) {
					var viewportH     = viewport.height(),
						viewportS     = viewport.scrollTop(),
						navbarHeaderH = topNavHead.height() + 1,
						navbarInnerH  = topNavInner.hasClass('in') ? topNavInner.height() : 0,
						navbarH       = navbarHeaderH + navbarInnerH,
						navbarMg      = 0,
						navbarTop     = topNavBar.offset().top,
						navwrapTop    = topNavWrap.offset().top,

						scrollHandler = $.throttle( 50, navStopScroll );

					if ( mixt_opt.page['show-admin-bar'] ) {
						var adminBarH = $('#wpadminbar').height();
						viewportH  -= adminBarH;
						navwrapTop -= adminBarH;
						navbarTop  -= adminBarH;
					}

					if ( mixt_opt.nav.transparent && mixt_opt.nav.position == 'below' ) {
						navbarMg = navbarHeaderH * -1;
					}

					if ( navbarH > viewportH ) {
						viewport.on('scroll', scrollHandler);
						if ( topNavBar.not('stopped') ) {
							topNavBar.addClass('stopped').css({ 'position': 'absolute', 'top': (navbarTop - navwrapTop), 'margin-top': '0' });
						}
					} else {
						viewport.off('scroll', scrollHandler);
						topNavBar.css({ 'position': '', 'top': '', 'margin-top': navbarMg }).removeClass('stopped');
					}
				}

				function navStopScroll() {
					var viewScroll = viewport.scrollTop(),
						stopScroll = topNavBar.hasClass('stopped') ? true : false;
					if ( viewportS > topNavHead.offset().top ) { stopScroll = false; }
					if ( viewportS > viewScroll && stopScroll ) { viewport.scrollTop(viewportS); }
				}
			}

			// Show/hide Submenus On Handle Click

			$('.dropdown-toggle', topNavBar).on('click touchstart', function(event) {
				if ( $(event.target).is('.drop-arrow') ) {
					if( event.handled !== true ) {
						var handle = $(this),
							menu   = handle.closest('.menu-item');

						if ( menu.hasClass('expand') ) {
							menu.removeClass('expand');
							$('.menu-item', menu).removeClass('expand');
						} else {
							menu.addClass('expand').siblings('li').removeClass('expand').find('.expand').removeClass('expand');
						}

						navScroll();

						event.handled = true;
					} else {
						return false;
					}
					event.preventDefault();
				}
				event.stopPropagation();
			});

			topNavInner.on('shown.bs.collapse hidden.bs.collapse', function() {
				$('.menu-item', topNavBar).removeClass('expand');
				navScroll();
			});

			navScroll();
		}
	};

	// RUN NAVBAR FUNCTIONS

	// Check which media queries are active
	var mqCheck = function( elem ) {
		elem = $('#' + elem);
		var display = elem.css('display');

		if ( display == 'block' ) { return 1; }
		else if ( display == 'inline') { return 2; }
		else { return 0; }
	};

	// Handle navbar items overlapping
	var topNavCont    = topNavBar.children('.container'),
		topNavLogoCls = topNavWrap.attr('data-logo-align'),
		topNavItemsWidth = 0,

		secNavCont = secNavBar.children('.container'),
		secNavItemsWidth = 0;

	if ( topNavLogoCls != 'logo-center' ) {
		topNavItemsWidth = topNavHead.outerWidth(true) + $('#main-menu').outerWidth(true);
	}
	if ( secNavBar.length ) {
		secNavItemsWidth = $('.left', secNavBar).outerWidth(true) + $('.right', secNavBar).outerWidth(true);
	}

	// Enable Menu Hover On Touch Screens
	var menuParents = navbars.find('.menu-item-has-children, li.dropdown');
	function menuTouchHover(event) {
		var link = $(event.delegateTarget),
			ancestors = link.parents('.hover');
		if (link.hasClass('hover')) {
			return true;
		} else {
			link.addClass('hover');
			menuParents.not(link).not(ancestors).removeClass('hover');
			event.preventDefault();
			return false;
		}
	}
	function menuTouchRemoveHover(event) {
		if ( ! $(event.delegateTarget).is(menuParents) ) { menuParents.removeClass('hover'); }
	}

	// Functions Run On Load & Window Resize
	function navbarFn() {

		var mqNav = mqCheck('navbar-check'); // Equals "0" for desktop, "1" for mobile and "2" for tablets

		// Run function to prevent submenus going outside viewport
		navbars.not(topNavBar).each( function() {
			navbarObj.menuOverflow($('.navbar-inner', this));
		});

		// Run functions based on currently active media query
		if ( mqNav === 0 ) {
			navbarObj.menuOverflow(topNavInner);
			topNavBar.css('height', '');

			navbars.each( function() {
				navbarObj.megaMenuToggle('enable', $(this));
			});

			menuParents.on('touchstart', menuTouchHover);
			bodyEl.on('touchstart', menuTouchRemoveHover);
		} else if ( mqNav > 0 ) {
			navbarObj.navMobile(mqNav);

			var navHeight = topNavHead.outerHeight() + 1;
			topNavBar.css('height', navHeight);

			navbars.each( function() {
				navbarObj.megaMenuToggle('disable', $(this));
			});

			menuParents.off('touchstart', menuTouchHover);
			bodyEl.off('touchstart', menuTouchRemoveHover);
		}

		// Make primary navbar sticky if option enabled
		if ( mixt_opt.nav.mode == 'fixed' ) {
			if ( mqNav === 1 ) {
				navbarObj.stickyNav(true);
			} else {
				navbarObj.stickyNav(false);
			}
		} else {
			topNavBar.addClass('position-top');
		}

		navbarOverlap();
	}

	// Handle Navbar Items Overlap
	function navbarOverlap() {

		var mqNav = mqCheck('navbar-check');

		// Primary Navbar
		if ( topNavLogoCls != 'logo-center' ) {
			if ( mqNav === 0 ) {
				var topNavContWidth = topNavCont.innerWidth();
				if ( topNavItemsWidth > topNavContWidth ) {
					topNavWrap.removeClass(topNavLogoCls).addClass('logo-center');
				} else {
					topNavWrap.removeClass('logo-center').addClass(topNavLogoCls);
				}
			} else {
				topNavWrap.removeClass('logo-center').addClass(topNavLogoCls);
			}
		}

		// Secondary Navbar
		if ( secNavBar.length ) {
			var secNavContWidth = secNavCont.innerWidth();
			if ( secNavItemsWidth > secNavContWidth ) {
				secNavBar.addClass('items-overlap');
			} else {
				secNavBar.removeClass('items-overlap');
			}
		}
	}
	navbarOverlap();

	navbars.each( function() {
		navbarObj.init($(this));
	});

	navbarFn();

	navbarObj.megaMenuRows();

	$(window).resize( $.debounce( 500, navbarFn ));

}(jQuery);

/* ------------------------------------------------ /
MIXT POST FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt, iframeAspect */

	var viewport = $(window);

	// Post Layout
	function postsPage() {

		// Featured Gallery Slider
		if ( typeof $.fn.lightSlider === 'function' ) {
			var gallerySlider = $('.gallery-slider').not('.lightSlider');
			gallerySlider.imagesLoaded( function() {
				gallerySlider.lightSlider({
					item: 1,
					auto: true,
					loop: true,
					pager: false,
					pause: 5000,
					keyPress: true,
					slideMargin: 0,
				});
			});
		}

		if ( typeof $.fn.lightGallery === 'function' ) {
			var lightGallery = $('.lightbox-gallery');
			lightGallery.imagesLoaded( function() {
				lightGallery.lightGallery();
			});
		}

		// Equalize featured media height for related posts and grid blog
		if ( typeof $.fn.matchHeight === 'function' ) {
			var matchHeightEl = $('.blog-grid .blog-post .post-feat, .post-related .post-feat');
			matchHeightEl.imagesLoaded( function() {
				matchHeightEl.addClass('fix-height').matchHeight();
			});
		}
	}

	postsPage();


	// Isotope Masonry Init
	if ( mixt_opt.layout.type == 'masonry' ) {
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
		var relPostsSlider = $('.post-related .slider-cont');
		relPostsSlider.imagesLoaded( function() {
			relPostsSlider.lightSlider({
				item: 5,
				pager: false,
				keyPress: true,
				slideMargin: 20,
				responsive: [
					{
						breakpoint: 960,
						settings: { item: 3 }
					},
					{
						breakpoint: 500,
						settings: { item: 2 }
					}
				]
			});

			if ( typeof $.fn.matchHeight === 'function' ) {
				$('.post-feat', relPostsSlider).matchHeight();
				relPostsSlider.css('height', '');
			}
		});
	}

	
	// Resize Embedded Videos Proportionally
	iframeAspect( $('.post iframe') );


	// Load Posts & Comments via Ajax
	function mixtAjaxLoad(type) {
		type = type || 'posts';
		var pagCont = $('.paging-navigation'),
			ajaxBtn = $('.ajax-more', pagCont),
			pageNow = pagCont.data('page-now'),
			pageMax = pagCont.data('page-max'),
			pageNum,
			pageType,
			nextUrl,
			container,
			element,
			loadSel;

		if ( type == 'posts' ) {
			pageType  = mixt_opt.layout['pagination-type'];
			nextUrl   = mixt_opt.layout['next-url'];
			container = $('.posts-container');
			element   = '.article';
			loadSel   = ' .posts-container .article';
		} else if ( type == 'comments' ) {
			pageType  = mixt_opt.layout['comment-pagination-type'];
			nextUrl   = mixt_opt.layout['comment-next-url'];
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
					if ( type == 'posts' && mixt_opt.layout.type != 'masonry' && mixt_opt.page['show-page-nr'] ) {
						newPosts.prepend('<div class="ajax-page page-'+ pageNum +'"><a href="'+ nextUrl +'">Page '+ pageNum +'</a></div>');
					}
					container.append(newPosts.html());

					newPosts = container.children('.ajax-new');

					// Update page number and nextUrl
					if ( type == 'posts' ) {
						pageNum++;
						nextUrl = nextUrl.replace(/\/page\/[0-9]?/, '/page/' + pageNum);
					} else {
						if ( mixt_opt.layout['comment-default-page'] == 'newest' ) {
							pageNum--;
						} else {
							pageNum++;
						}
						nextUrl = nextUrl.replace(/\/comment-page-[0-9]?/, '/comment-page-' + pageNum);
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

		// Trigger AJAX load upon reaching bottom of page
		var ajaxScrollHandle = $.debounce( 500, function() {
				/* global elemVisible */
				if ( elemVisible(ajaxBtn, viewport) === true ) {
					ajaxBtn.trigger('cont:bottom');
				}
			});
		if ( pageType == 'ajax-scroll' && ajaxBtn.length ) {
			viewport.on('scroll', ajaxScrollHandle);
		}
	}
	// Execute Function Where Applicable
	if ( mixt_opt.page['posts-page'] && mixt_opt.layout['pagination-type'] == 'ajax-click' || mixt_opt.layout['pagination-type'] == 'ajax-scroll' ) {
		mixtAjaxLoad('posts');
	}
	if ( mixt_opt.page['page-type'] == 'single' && mixt_opt.layout['comment-pagination-type'] == 'ajax-click' || mixt_opt.layout['comment-pagination-type'] == 'ajax-scroll' ) {
		mixtAjaxLoad('comments');
	}

	// Functions To Run On Window Resize
	function resizeFn() {
		iframeAspect();
	}
	viewport.resize( $.debounce( 500, resizeFn ));

}(jQuery);

/* ------------------------------------------------ /
UI FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	// Flip Card Equalize Height
	if ( typeof $.fn.matchHeight === 'function' ) {
		var flipcardSides = $('.flip-card .front, .flip-card .back');
		flipcardSides.imagesLoaded( function() {
			flipcardSides.addClass('fix-height').matchHeight();
		});
	}

}(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiRWxlbWVudFF1ZXJpZXMuanMiLCJob3ZlckludGVudC5qcyIsImltYWdlc2xvYWRlZC5wa2dkLmpzIiwiaXNvdG9wZS5wa2dkLm1pbi5qcyIsImpxdWVyeS5zdGVsbGFyLmpzIiwibGlnaHRHYWxsZXJ5LmpzIiwibGlnaHRTbGlkZXIuanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsIlJlc2l6ZVNlbnNvci5qcyIsImhlYWRlci5qcyIsImludGVncmF0aW9uLmpzIiwibmF2YmFyLmpzIiwicG9zdC5qcyIsInVpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3M0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNueEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2UgLSB2MS4xIC0gMy83LzIwMTBcbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbiAqIFxuICogQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbiAqL1xuXG4vLyBTY3JpcHQ6IGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlOiBTb21ldGltZXMsIGxlc3MgaXMgbW9yZSFcbi8vXG4vLyAqVmVyc2lvbjogMS4xLCBMYXN0IHVwZGF0ZWQ6IDMvNy8yMDEwKlxuLy8gXG4vLyBQcm9qZWN0IEhvbWUgLSBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS1wbHVnaW4vXG4vLyBHaXRIdWIgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL1xuLy8gU291cmNlICAgICAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9yYXcvbWFzdGVyL2pxdWVyeS5iYS10aHJvdHRsZS1kZWJvdW5jZS5qc1xuLy8gKE1pbmlmaWVkKSAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9yYXcvbWFzdGVyL2pxdWVyeS5iYS10aHJvdHRsZS1kZWJvdW5jZS5taW4uanMgKDAuN2tiKVxuLy8gXG4vLyBBYm91dDogTGljZW5zZVxuLy8gXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW4sXG4vLyBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbi8vIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbi8vIFxuLy8gQWJvdXQ6IEV4YW1wbGVzXG4vLyBcbi8vIFRoZXNlIHdvcmtpbmcgZXhhbXBsZXMsIGNvbXBsZXRlIHdpdGggZnVsbHkgY29tbWVudGVkIGNvZGUsIGlsbHVzdHJhdGUgYSBmZXdcbi8vIHdheXMgaW4gd2hpY2ggdGhpcyBwbHVnaW4gY2FuIGJlIHVzZWQuXG4vLyBcbi8vIFRocm90dGxlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy90aHJvdHRsZS9cbi8vIERlYm91bmNlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy9kZWJvdW5jZS9cbi8vIFxuLy8gQWJvdXQ6IFN1cHBvcnQgYW5kIFRlc3Rpbmdcbi8vIFxuLy8gSW5mb3JtYXRpb24gYWJvdXQgd2hhdCB2ZXJzaW9uIG9yIHZlcnNpb25zIG9mIGpRdWVyeSB0aGlzIHBsdWdpbiBoYXMgYmVlblxuLy8gdGVzdGVkIHdpdGgsIHdoYXQgYnJvd3NlcnMgaXQgaGFzIGJlZW4gdGVzdGVkIGluLCBhbmQgd2hlcmUgdGhlIHVuaXQgdGVzdHNcbi8vIHJlc2lkZSAoc28geW91IGNhbiB0ZXN0IGl0IHlvdXJzZWxmKS5cbi8vIFxuLy8galF1ZXJ5IFZlcnNpb25zIC0gbm9uZSwgMS4zLjIsIDEuNC4yXG4vLyBCcm93c2VycyBUZXN0ZWQgLSBJbnRlcm5ldCBFeHBsb3JlciA2LTgsIEZpcmVmb3ggMi0zLjYsIFNhZmFyaSAzLTQsIENocm9tZSA0LTUsIE9wZXJhIDkuNi0xMC4xLlxuLy8gVW5pdCBUZXN0cyAgICAgIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS91bml0L1xuLy8gXG4vLyBBYm91dDogUmVsZWFzZSBIaXN0b3J5XG4vLyBcbi8vIDEuMSAtICgzLzcvMjAxMCkgRml4ZWQgYSBidWcgaW4gPGpRdWVyeS50aHJvdHRsZT4gd2hlcmUgdHJhaWxpbmcgY2FsbGJhY2tzXG4vLyAgICAgICBleGVjdXRlZCBsYXRlciB0aGFuIHRoZXkgc2hvdWxkLiBSZXdvcmtlZCBhIGZhaXIgYW1vdW50IG9mIGludGVybmFsXG4vLyAgICAgICBsb2dpYyBhcyB3ZWxsLlxuLy8gMS4wIC0gKDMvNi8yMDEwKSBJbml0aWFsIHJlbGVhc2UgYXMgYSBzdGFuZC1hbG9uZSBwcm9qZWN0LiBNaWdyYXRlZCBvdmVyXG4vLyAgICAgICBmcm9tIGpxdWVyeS1taXNjIHJlcG8gdjAuNCB0byBqcXVlcnktdGhyb3R0bGUgcmVwbyB2MS4wLCBhZGRlZCB0aGVcbi8vICAgICAgIG5vX3RyYWlsaW5nIHRocm90dGxlIHBhcmFtZXRlciBhbmQgZGVib3VuY2UgZnVuY3Rpb25hbGl0eS5cbi8vIFxuLy8gVG9waWM6IE5vdGUgZm9yIG5vbi1qUXVlcnkgdXNlcnNcbi8vIFxuLy8galF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgYmVjYXVzZSBub3RoaW5nIGludGVybmFsXG4vLyB1c2VzIGFueSBqUXVlcnkgbWV0aG9kcyBvciBwcm9wZXJ0aWVzLiBqUXVlcnkgaXMganVzdCB1c2VkIGFzIGEgbmFtZXNwYWNlXG4vLyB1bmRlciB3aGljaCB0aGVzZSBtZXRob2RzIGNhbiBleGlzdC5cbi8vIFxuLy8gU2luY2UgalF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgaWYgalF1ZXJ5IGRvZXNuJ3QgZXhpc3Rcbi8vIHdoZW4gdGhpcyBwbHVnaW4gaXMgbG9hZGVkLCB0aGUgbWV0aG9kIGRlc2NyaWJlZCBiZWxvdyB3aWxsIGJlIGNyZWF0ZWQgaW5cbi8vIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UuIFVzYWdlIHdpbGwgYmUgZXhhY3RseSB0aGUgc2FtZSwgYnV0IGluc3RlYWQgb2Zcbi8vICQubWV0aG9kKCkgb3IgalF1ZXJ5Lm1ldGhvZCgpLCB5b3UnbGwgbmVlZCB0byB1c2UgQ293Ym95Lm1ldGhvZCgpLlxuXG4oZnVuY3Rpb24od2luZG93LHVuZGVmaW5lZCl7XG4gICckOm5vbXVuZ2UnOyAvLyBVc2VkIGJ5IFlVSSBjb21wcmVzc29yLlxuICBcbiAgLy8gU2luY2UgalF1ZXJ5IHJlYWxseSBpc24ndCByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIHVzZSBgalF1ZXJ5YCBhcyB0aGVcbiAgLy8gbmFtZXNwYWNlIG9ubHkgaWYgaXQgYWxyZWFkeSBleGlzdHMsIG90aGVyd2lzZSB1c2UgdGhlIGBDb3dib3lgIG5hbWVzcGFjZSxcbiAgLy8gY3JlYXRpbmcgaXQgaWYgbmVjZXNzYXJ5LlxuICB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LkNvd2JveSB8fCAoIHdpbmRvdy5Db3dib3kgPSB7fSApLFxuICAgIFxuICAgIC8vIEludGVybmFsIG1ldGhvZCByZWZlcmVuY2UuXG4gICAganFfdGhyb3R0bGU7XG4gIFxuICAvLyBNZXRob2Q6IGpRdWVyeS50aHJvdHRsZVxuICAvLyBcbiAgLy8gVGhyb3R0bGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIEVzcGVjaWFsbHkgdXNlZnVsIGZvciByYXRlIGxpbWl0aW5nXG4gIC8vIGV4ZWN1dGlvbiBvZiBoYW5kbGVycyBvbiBldmVudHMgbGlrZSByZXNpemUgYW5kIHNjcm9sbC4gSWYgeW91IHdhbnQgdG9cbiAgLy8gcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiB0byBhIHNpbmdsZSB0aW1lLCBzZWUgdGhlXG4gIC8vIDxqUXVlcnkuZGVib3VuY2U+IG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICBYICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgWFxuICAvLyA+IFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vIFxuICAvLyBVc2FnZTpcbiAgLy8gXG4gIC8vID4gdmFyIHRocm90dGxlZCA9IGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKTtcbiAgLy8gPiBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCB0aHJvdHRsZWQgKTtcbiAgLy8gXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcbiAgLy8gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBqUXVlcnkudGhyb3R0bGUoIGRlbGF5LCBbIG5vX3RyYWlsaW5nLCBdIGNhbGxiYWNrICkgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcbiAgLy8gXG4gIC8vIEFyZ3VtZW50czpcbiAgLy8gXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XG4gIC8vICAgIGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICAvLyAgbm9fdHJhaWxpbmcgLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBub190cmFpbGluZyBpc1xuICAvLyAgICB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9fdHJhaWxpbmcgaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25lIGZpbmFsIHRpbWUgYWZ0ZXIgdGhlIGxhc3RcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlblxuICAvLyAgICBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGUgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cbiAgLy8gICAgVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsIHRvXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICAvLyBcbiAgLy8gUmV0dXJuczpcbiAgLy8gXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCB0aHJvdHRsZWQsIGZ1bmN0aW9uLlxuICBcbiAgJC50aHJvdHRsZSA9IGpxX3Rocm90dGxlID0gZnVuY3Rpb24oIGRlbGF5LCBub190cmFpbGluZywgY2FsbGJhY2ssIGRlYm91bmNlX21vZGUgKSB7XG4gICAgLy8gQWZ0ZXIgd3JhcHBlciBoYXMgc3RvcHBlZCBiZWluZyBjYWxsZWQsIHRoaXMgdGltZW91dCBlbnN1cmVzIHRoYXRcbiAgICAvLyBgY2FsbGJhY2tgIGlzIGV4ZWN1dGVkIGF0IHRoZSBwcm9wZXIgdGltZXMgaW4gYHRocm90dGxlYCBhbmQgYGVuZGBcbiAgICAvLyBkZWJvdW5jZSBtb2Rlcy5cbiAgICB2YXIgdGltZW91dF9pZCxcbiAgICAgIFxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgbGFzdCB0aW1lIGBjYWxsYmFja2Agd2FzIGV4ZWN1dGVkLlxuICAgICAgbGFzdF9leGVjID0gMDtcbiAgICBcbiAgICAvLyBgbm9fdHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuICAgIGlmICggdHlwZW9mIG5vX3RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG4gICAgICBkZWJvdW5jZV9tb2RlID0gY2FsbGJhY2s7XG4gICAgICBjYWxsYmFjayA9IG5vX3RyYWlsaW5nO1xuICAgICAgbm9fdHJhaWxpbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIFRoZSBgd3JhcHBlcmAgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgdGhyb3R0bGluZyAvIGRlYm91bmNpbmdcbiAgICAvLyBmdW5jdGlvbmFsaXR5IGFuZCB3aGVuIGV4ZWN1dGVkIHdpbGwgbGltaXQgdGhlIHJhdGUgYXQgd2hpY2ggYGNhbGxiYWNrYFxuICAgIC8vIGlzIGV4ZWN1dGVkLlxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIGVsYXBzZWQgPSArbmV3IERhdGUoKSAtIGxhc3RfZXhlYyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIFxuICAgICAgLy8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0X2V4ZWNgIHRpbWVzdGFtcC5cbiAgICAgIGZ1bmN0aW9uIGV4ZWMoKSB7XG4gICAgICAgIGxhc3RfZXhlYyA9ICtuZXcgRGF0ZSgpO1xuICAgICAgICBjYWxsYmFjay5hcHBseSggdGhhdCwgYXJncyApO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSB0aGlzIGlzIHVzZWQgdG8gY2xlYXIgdGhlIGZsYWdcbiAgICAgIC8vIHRvIGFsbG93IGZ1dHVyZSBgY2FsbGJhY2tgIGV4ZWN1dGlvbnMuXG4gICAgICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdGltZW91dF9pZCA9IHVuZGVmaW5lZDtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGlmICggZGVib3VuY2VfbW9kZSAmJiAhdGltZW91dF9pZCApIHtcbiAgICAgICAgLy8gU2luY2UgYHdyYXBwZXJgIGlzIGJlaW5nIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kXG4gICAgICAgIC8vIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbiksIGV4ZWN1dGUgYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dC5cbiAgICAgIHRpbWVvdXRfaWQgJiYgY2xlYXJUaW1lb3V0KCB0aW1lb3V0X2lkICk7XG4gICAgICBcbiAgICAgIGlmICggZGVib3VuY2VfbW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcbiAgICAgICAgLy8gSW4gdGhyb3R0bGUgbW9kZSwgaWYgYGRlbGF5YCB0aW1lIGhhcyBiZWVuIGV4Y2VlZGVkLCBleGVjdXRlXG4gICAgICAgIC8vIGBjYWxsYmFja2AuXG4gICAgICAgIGV4ZWMoKTtcbiAgICAgICAgXG4gICAgICB9IGVsc2UgaWYgKCBub190cmFpbGluZyAhPT0gdHJ1ZSApIHtcbiAgICAgICAgLy8gSW4gdHJhaWxpbmcgdGhyb3R0bGUgbW9kZSwgc2luY2UgYGRlbGF5YCB0aW1lIGhhcyBub3QgYmVlblxuICAgICAgICAvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuICAgICAgICAvLyByZWNlbnQgZXhlY3V0aW9uLlxuICAgICAgICAvLyBcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlXG4gICAgICAgIC8vIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgZmFsc2UgKGF0IGVuZCksIHNjaGVkdWxlIGBjYWxsYmFja2AgdG9cbiAgICAgICAgLy8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuICAgICAgICB0aW1lb3V0X2lkID0gc2V0VGltZW91dCggZGVib3VuY2VfbW9kZSA/IGNsZWFyIDogZXhlYywgZGVib3VuY2VfbW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIFNldCB0aGUgZ3VpZCBvZiBgd3JhcHBlcmAgZnVuY3Rpb24gdG8gdGhlIHNhbWUgb2Ygb3JpZ2luYWwgY2FsbGJhY2ssIHNvXG4gICAgLy8gaXQgY2FuIGJlIHJlbW92ZWQgaW4galF1ZXJ5IDEuNCsgLnVuYmluZCBvciAuZGllIGJ5IHVzaW5nIHRoZSBvcmlnaW5hbFxuICAgIC8vIGNhbGxiYWNrIGFzIGEgcmVmZXJlbmNlLlxuICAgIGlmICggJC5ndWlkICkge1xuICAgICAgd3JhcHBlci5ndWlkID0gY2FsbGJhY2suZ3VpZCA9IGNhbGxiYWNrLmd1aWQgfHwgJC5ndWlkKys7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiB0aGUgd3JhcHBlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LmRlYm91bmNlXG4gIC8vIFxuICAvLyBEZWJvdW5jZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRGVib3VuY2luZywgdW5saWtlIHRocm90dGxpbmcsXG4gIC8vIGd1YXJhbnRlZXMgdGhhdCBhIGZ1bmN0aW9uIGlzIG9ubHkgZXhlY3V0ZWQgYSBzaW5nbGUgdGltZSwgZWl0aGVyIGF0IHRoZVxuICAvLyB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLiBJZiB5b3Ugd2FudCB0b1xuICAvLyBzaW1wbHkgcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiwgc2VlIHRoZSA8alF1ZXJ5LnRocm90dGxlPlxuICAvLyBtZXRob2QuXG4gIC8vIFxuICAvLyBJbiB0aGlzIHZpc3VhbGl6YXRpb24sIHwgaXMgYSBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbCBhbmQgWCBpcyB0aGUgYWN0dWFsXG4gIC8vIGNhbGxiYWNrIGV4ZWN1dGlvbjpcbiAgLy8gXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQ6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcbiAgLy8gPiBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyB0cnVlOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgZGVib3VuY2VkID0galF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGRlYm91bmNlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBhdF9iZWdpbiAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIGF0X2JlZ2luIGlzIGZhbHNlIG9yXG4gIC8vICAgIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHMgYWZ0ZXJcbiAgLy8gICAgdGhlIGxhc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIElmIGF0X2JlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmVcbiAgLy8gICAgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGVcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGVcbiAgLy8gICAgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cbiAgLy8gICAgVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsIHRvXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgZGVib3VuY2VkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICAvLyBcbiAgLy8gUmV0dXJuczpcbiAgLy8gXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCBkZWJvdW5jZWQsIGZ1bmN0aW9uLlxuICBcbiAgJC5kZWJvdW5jZSA9IGZ1bmN0aW9uKCBkZWxheSwgYXRfYmVnaW4sIGNhbGxiYWNrICkge1xuICAgIHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGpxX3Rocm90dGxlKCBkZWxheSwgYXRfYmVnaW4sIGZhbHNlIClcbiAgICAgIDoganFfdGhyb3R0bGUoIGRlbGF5LCBjYWxsYmFjaywgYXRfYmVnaW4gIT09IGZhbHNlICk7XG4gIH07XG4gIFxufSkodGhpcyk7XG4iLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB2YXIgRWxlbWVudFF1ZXJpZXMgPSB0aGlzLkVsZW1lbnRRdWVyaWVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy53aXRoVHJhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRFbVNpemUoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ2ZvbnRTaXplJyk7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChmb250U2l6ZSkgfHwgMTY7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vTXIwZ3JvZy9lbGVtZW50LXF1ZXJ5L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY29udmVydFRvUHgoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1bml0cyA9IHZhbHVlLnJlcGxhY2UoL1swLTldKi8sICcnKTtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZW1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZ2V0RW1TaXplKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyZW1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZ2V0RW1TaXplKCk7XG4gICAgICAgICAgICAgICAgLy8gVmlld3BvcnQgdW5pdHMhXG4gICAgICAgICAgICAgICAgLy8gQWNjb3JkaW5nIHRvIGh0dHA6Ly9xdWlya3Ntb2RlLm9yZy9tb2JpbGUvdGFibGVWaWV3cG9ydC5odG1sXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoL0hlaWdodCBnZXRzIHVzIHRoZSBtb3N0IHJlbGlhYmxlIGluZm9cbiAgICAgICAgICAgICAgICBjYXNlIFwidndcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMTAwO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2aFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2bWluXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInZtYXhcIjpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ3ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hvb3NlciA9IE1hdGhbdW5pdHMgPT09IFwidm1pblwiID8gXCJtaW5cIiA6IFwibWF4XCJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBjaG9vc2VyKHZ3LCB2aCk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGZvciBub3csIG5vdCBzdXBwb3J0aW5nIHBoeXNpY2FsIHVuaXRzIChzaW5jZSB0aGV5IGFyZSBqdXN0IGEgc2V0IG51bWJlciBvZiBweClcbiAgICAgICAgICAgICAgICAvLyBvciBleC9jaCAoZ2V0dGluZyBhY2N1cmF0ZSBtZWFzdXJlbWVudHMgaXMgaGFyZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gU2V0dXBJbmZvcm1hdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICAgICAgICB2YXIga2V5LCBvcHRpb24sIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCwgdmFsdWUsIGFjdHVhbFZhbHVlLCBhdHRyVmFsdWVzLCBhdHRyVmFsdWUsIGF0dHJOYW1lO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24ge21vZGU6ICdtaW58bWF4JywgcHJvcGVydHk6ICd3aWR0aHxoZWlnaHQnLCB2YWx1ZTogJzEyM3B4J31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gW29wdGlvbi5tb2RlLCBvcHRpb24ucHJvcGVydHksIG9wdGlvbi52YWx1ZV0uam9pbignLCcpO1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1tpZHhdID0gb3B0aW9uO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbJ21pbi13aWR0aCcsICdtaW4taGVpZ2h0JywgJ21heC13aWR0aCcsICdtYXgtaGVpZ2h0J107XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXh0cmFjdHMgdGhlIGNvbXB1dGVkIHdpZHRoL2hlaWdodCBhbmQgc2V0cyB0byBtaW4vbWF4LSBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgY3VycmVudCBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgIGF0dHJWYWx1ZXMgPSB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiA9IHRoaXMub3B0aW9uc1trZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29udmVydFRvUHgodGhpcy5lbGVtZW50LCBvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbFZhbHVlID0gb3B0aW9uLnByb3BlcnR5ID09ICd3aWR0aCcgPyB3aWR0aCA6IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBvcHRpb24ubW9kZSArICctJyArIG9wdGlvbi5wcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5tb2RlID09ICdtaW4nICYmIGFjdHVhbFZhbHVlID49IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgKz0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5tb2RlID09ICdtYXgnICYmIGFjdHVhbFZhbHVlIDw9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgKz0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdHRyVmFsdWVzW2F0dHJOYW1lXSkgYXR0clZhbHVlc1thdHRyTmFtZV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZSAmJiAtMSA9PT0gKCcgJythdHRyVmFsdWVzW2F0dHJOYW1lXSsnICcpLmluZGV4T2YoJyAnICsgYXR0clZhbHVlICsgJyAnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlc1thdHRyTmFtZV0gKz0gJyAnICsgYXR0clZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyVmFsdWVzW2F0dHJpYnV0ZXNba11dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZXNba10sIGF0dHJWYWx1ZXNbYXR0cmlidXRlc1trXV0uc3Vic3RyKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlc1trXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgb3B0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmFkZE9wdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24gPSBuZXcgU2V0dXBJbmZvcm1hdGlvbihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbi5hZGRPcHRpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvciA9IG5ldyBSZXNpemVTZW5zb3IoZWxlbWVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmNhbGwoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMud2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZGUgbWlufG1heFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgd2lkdGh8aGVpZ2h0XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcXVldWVRdWVyeShzZWxlY3RvciwgbW9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkgcXVlcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsLmJpbmQoZG9jdW1lbnQpO1xuICAgICAgICAgICAgaWYgKCFxdWVyeSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mICQkKSBxdWVyeSA9ICQkO1xuICAgICAgICAgICAgaWYgKCFxdWVyeSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSkgcXVlcnkgPSBqUXVlcnk7XG5cbiAgICAgICAgICAgIGlmICghcXVlcnkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnTm8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCwgalF1ZXJ5IG9yIE1vb3Rvb2xzXFwncyAkJCBmb3VuZC4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBxdWVyeShzZWxlY3Rvcik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHNldHVwRWxlbWVudChlbGVtZW50c1tpXSwge1xuICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlZ2V4ID0gLyw/KFteLFxcbl0qKVxcW1tcXHNcXHRdKihtaW58bWF4KS0od2lkdGh8aGVpZ2h0KVtcXHNcXHRdKlt+JFxcXl0/PVtcXHNcXHRdKlwiKFteXCJdKilcIltcXHNcXHRdKl0oW15cXG5cXHNcXHtdKikvbWdpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY3NzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBleHRyYWN0UXVlcnkoY3NzKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICAgICBjc3MgPSBjc3MucmVwbGFjZSgvJy9nLCAnXCInKTtcbiAgICAgICAgICAgIHdoaWxlIChudWxsICE9PSAobWF0Y2ggPSByZWdleC5leGVjKGNzcykpKSB7XG4gICAgICAgICAgICAgICAgaWYgKDUgPCBtYXRjaC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWVRdWVyeShtYXRjaFsxXSB8fCBtYXRjaFs1XSwgbWF0Y2hbMl0sIG1hdGNoWzNdLCBtYXRjaFs0XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7Q3NzUnVsZVtdfFN0cmluZ30gcnVsZXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlYWRSdWxlcyhydWxlcykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gJyc7XG4gICAgICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcnVsZXMpIHtcbiAgICAgICAgICAgICAgICBydWxlcyA9IHJ1bGVzLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKC0xICE9PSBydWxlcy5pbmRleE9mKCdtaW4td2lkdGgnKSB8fCAtMSAhPT0gcnVsZXMuaW5kZXhPZignbWF4LXdpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHJ1bGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gcnVsZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgxID09PSBydWxlc1tpXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHJ1bGVzW2ldLnNlbGVjdG9yVGV4dCB8fCBydWxlc1tpXS5jc3NUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtaW4taGVpZ2h0JykgfHwgLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21heC1oZWlnaHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RRdWVyeShzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZigtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWluLXdpZHRoJykgfHwgLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21heC13aWR0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICg0ID09PSBydWxlc1tpXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkUnVsZXMocnVsZXNbaV0uY3NzUnVsZXMgfHwgcnVsZXNbaV0ucnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlYXJjaGVzIGFsbCBjc3MgcnVsZXMgYW5kIHNldHVwcyB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gYWxsIGVsZW1lbnRzIHdpdGggZWxlbWVudCBxdWVyeSBydWxlcy4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdGhpcy53aXRoVHJhY2tpbmcgPSB3aXRoVHJhY2tpbmc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NUZXh0IHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1J1bGVzIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLnJ1bGVzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubmFtZSAhPT0gJ1NlY3VyaXR5RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdGhpcy53aXRoVHJhY2tpbmcgPSB3aXRoVHJhY2tpbmc7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndpdGhUcmFja2luZykge1xuICAgICAgICAgICAgICAgIHRocm93ICd3aXRoVHJhY2tpbmcgaXMgbm90IGVuYWJsZWQuIFdlIGNhbiBub3QgZGV0YWNoIGVsZW1lbnRzIHNpbmNlIHdlIGRvbiBub3Qgc3RvcmUgaXQuJyArXG4gICAgICAgICAgICAgICAgJ1VzZSBFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcgPSB0cnVlOyBiZWZvcmUgZG9tcmVhZHkuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnRzLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgRWxlbWVudFF1ZXJpZXMuZGV0YWNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50cyA9IFtdO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm8gZ2FyYmFnZSBjb2xsZWN0aW9uIHBvc3NpYmxlIGlmIHlvdSBkb24gbm90IGNhbGwgLmRldGFjaCgpIGZpcnN0KVxuICAgICAqL1xuICAgIEVsZW1lbnRRdWVyaWVzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZS51cGRhdGUod2l0aFRyYWNraW5nKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgc2Vuc29yIGFuZCBlbGVtZW50cXVlcnkgaW5mb3JtYXRpb24gZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBFbGVtZW50UXVlcmllcy5kZXRhY2ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbikge1xuICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvci5kZXRhY2goKTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldGFjaGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGV0YWNoZWQgYWxyZWFkeScsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgRWxlbWVudFF1ZXJpZXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIUVsZW1lbnRRdWVyaWVzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZSA9IG5ldyBFbGVtZW50UXVlcmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UuaW5pdChFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcpO1xuICAgIH07XG5cbiAgICB2YXIgZG9tTG9hZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIC8qIEludGVybmV0IEV4cGxvcmVyICovXG4gICAgICAgIC8qQGNjX29uXG4gICAgICAgIEBpZiAoQF93aW4zMiB8fCBAX3dpbjY0KVxuICAgICAgICAgICAgZG9jdW1lbnQud3JpdGUoJzxzY3JpcHQgaWQ9XCJpZVNjcmlwdExvYWRcIiBkZWZlciBzcmM9XCIvLzpcIj48XFwvc2NyaXB0PicpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2llU2NyaXB0TG9hZCcpLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIEBlbmQgQCovXG4gICAgICAgIC8qIE1vemlsbGEsIENocm9tZSwgT3BlcmEgKi9cbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8qIFNhZmFyaSwgaUNhYiwgS29ucXVlcm9yICovXG4gICAgICAgIGlmICgvS0hUTUx8V2ViS2l0fGlDYWIvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICB2YXIgRE9NTG9hZFRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgvbG9hZGVkfGNvbXBsZXRlL2kudGVzdChkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKERPTUxvYWRUaW1lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIC8qIE90aGVyIHdlYiBicm93c2VycyAqL1xuICAgICAgICB3aW5kb3cub25sb2FkID0gY2FsbGJhY2s7XG4gICAgfTtcblxuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIEVsZW1lbnRRdWVyaWVzLmluaXQsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIEVsZW1lbnRRdWVyaWVzLmluaXQpO1xuICAgIH1cbiAgICBkb21Mb2FkZWQoRWxlbWVudFF1ZXJpZXMuaW5pdCk7XG5cbn0pKCk7XG4iLCIvKiFcbiAqIGhvdmVySW50ZW50IHYxLjguMSAvLyAyMDE0LjA4LjExIC8vIGpRdWVyeSB2MS45LjErXG4gKiBodHRwOi8vY2hlcm5lLm5ldC9icmlhbi9yZXNvdXJjZXMvanF1ZXJ5LmhvdmVySW50ZW50Lmh0bWxcbiAqXG4gKiBZb3UgbWF5IHVzZSBob3ZlckludGVudCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBsaWNlbnNlLiBCYXNpY2FsbHkgdGhhdFxuICogbWVhbnMgeW91IGFyZSBmcmVlIHRvIHVzZSBob3ZlckludGVudCBhcyBsb25nIGFzIHRoaXMgaGVhZGVyIGlzIGxlZnQgaW50YWN0LlxuICogQ29weXJpZ2h0IDIwMDcsIDIwMTQgQnJpYW4gQ2hlcm5lXG4gKi9cbiBcbi8qIGhvdmVySW50ZW50IGlzIHNpbWlsYXIgdG8galF1ZXJ5J3MgYnVpbHQtaW4gXCJob3ZlclwiIG1ldGhvZCBleGNlcHQgdGhhdFxuICogaW5zdGVhZCBvZiBmaXJpbmcgdGhlIGhhbmRsZXJJbiBmdW5jdGlvbiBpbW1lZGlhdGVseSwgaG92ZXJJbnRlbnQgY2hlY2tzXG4gKiB0byBzZWUgaWYgdGhlIHVzZXIncyBtb3VzZSBoYXMgc2xvd2VkIGRvd24gKGJlbmVhdGggdGhlIHNlbnNpdGl2aXR5XG4gKiB0aHJlc2hvbGQpIGJlZm9yZSBmaXJpbmcgdGhlIGV2ZW50LiBUaGUgaGFuZGxlck91dCBmdW5jdGlvbiBpcyBvbmx5XG4gKiBjYWxsZWQgYWZ0ZXIgYSBtYXRjaGluZyBoYW5kbGVySW4uXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIGp1c3QgbGlrZSAuaG92ZXIoKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW4sIGhhbmRsZXJPdXQgKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQgKVxuICpcbiAqIC8vIGJhc2ljIHVzYWdlIC4uLiB3aXRoIGV2ZW50IGRlbGVnYXRpb24hXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCwgc2VsZWN0b3IgKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQsIHNlbGVjdG9yIClcbiAqXG4gKiAvLyB1c2luZyBhIGJhc2ljIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiAuaG92ZXJJbnRlbnQoIGNvbmZpZyApXG4gKlxuICogQHBhcmFtICBoYW5kbGVySW4gICBmdW5jdGlvbiBPUiBjb25maWd1cmF0aW9uIG9iamVjdFxuICogQHBhcmFtICBoYW5kbGVyT3V0ICBmdW5jdGlvbiBPUiBzZWxlY3RvciBmb3IgZGVsZWdhdGlvbiBPUiB1bmRlZmluZWRcbiAqIEBwYXJhbSAgc2VsZWN0b3IgICAgc2VsZWN0b3IgT1IgdW5kZWZpbmVkXG4gKiBAYXV0aG9yIEJyaWFuIENoZXJuZSA8YnJpYW4oYXQpY2hlcm5lKGRvdCluZXQ+XG4gKi9cbihmdW5jdGlvbigkKSB7XG4gICAgJC5mbi5ob3ZlckludGVudCA9IGZ1bmN0aW9uKGhhbmRsZXJJbixoYW5kbGVyT3V0LHNlbGVjdG9yKSB7XG5cbiAgICAgICAgLy8gZGVmYXVsdCBjb25maWd1cmF0aW9uIHZhbHVlc1xuICAgICAgICB2YXIgY2ZnID0ge1xuICAgICAgICAgICAgaW50ZXJ2YWw6IDEwMCxcbiAgICAgICAgICAgIHNlbnNpdGl2aXR5OiA2LFxuICAgICAgICAgICAgdGltZW91dDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICggdHlwZW9mIGhhbmRsZXJJbiA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgaGFuZGxlckluICk7XG4gICAgICAgIH0gZWxzZSBpZiAoJC5pc0Z1bmN0aW9uKGhhbmRsZXJPdXQpKSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJPdXQsIHNlbGVjdG9yOiBzZWxlY3RvciB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJJbiwgc2VsZWN0b3I6IGhhbmRsZXJPdXQgfSApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5zdGFudGlhdGUgdmFyaWFibGVzXG4gICAgICAgIC8vIGNYLCBjWSA9IGN1cnJlbnQgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgdXBkYXRlZCBieSBtb3VzZW1vdmUgZXZlbnRcbiAgICAgICAgLy8gcFgsIHBZID0gcHJldmlvdXMgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgc2V0IGJ5IG1vdXNlb3ZlciBhbmQgcG9sbGluZyBpbnRlcnZhbFxuICAgICAgICB2YXIgY1gsIGNZLCBwWCwgcFk7XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBnZXR0aW5nIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciB0cmFjayA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBjWCA9IGV2LnBhZ2VYO1xuICAgICAgICAgICAgY1kgPSBldi5wYWdlWTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGNvbXBhcmluZyBjdXJyZW50IGFuZCBwcmV2aW91cyBtb3VzZSBwb3NpdGlvblxuICAgICAgICB2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgLy8gY29tcGFyZSBtb3VzZSBwb3NpdGlvbnMgdG8gc2VlIGlmIHRoZXkndmUgY3Jvc3NlZCB0aGUgdGhyZXNob2xkXG4gICAgICAgICAgICBpZiAoIE1hdGguc3FydCggKHBYLWNYKSoocFgtY1gpICsgKHBZLWNZKSoocFktY1kpICkgPCBjZmcuc2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIHNldCBob3ZlckludGVudCBzdGF0ZSB0byB0cnVlIChzbyBtb3VzZU91dCBjYW4gYmUgY2FsbGVkKVxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjZmcub3Zlci5hcHBseShvYixbZXZdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHByZXZpb3VzIGNvb3JkaW5hdGVzIGZvciBuZXh0IHRpbWVcbiAgICAgICAgICAgICAgICBwWCA9IGNYOyBwWSA9IGNZO1xuICAgICAgICAgICAgICAgIC8vIHVzZSBzZWxmLWNhbGxpbmcgdGltZW91dCwgZ3VhcmFudGVlcyBpbnRlcnZhbHMgYXJlIHNwYWNlZCBvdXQgcHJvcGVybHkgKGF2b2lkcyBKYXZhU2NyaXB0IHRpbWVyIGJ1Z3MpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldiwgb2IpO30gLCBjZmcuaW50ZXJ2YWwgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGRlbGF5aW5nIHRoZSBtb3VzZU91dCBmdW5jdGlvblxuICAgICAgICB2YXIgZGVsYXkgPSBmdW5jdGlvbihldixvYikge1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBjZmcub3V0LmFwcGx5KG9iLFtldl0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgbW91c2UgJ2hvdmVyaW5nJ1xuICAgICAgICB2YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAvLyBjb3B5IG9iamVjdHMgdG8gYmUgcGFzc2VkIGludG8gdCAocmVxdWlyZWQgZm9yIGV2ZW50IG9iamVjdCB0byBiZSBwYXNzZWQgaW4gSUUpXG4gICAgICAgICAgICB2YXIgZXYgPSAkLmV4dGVuZCh7fSxlKTtcbiAgICAgICAgICAgIHZhciBvYiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIGNhbmNlbCBob3ZlckludGVudCB0aW1lciBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF90KSB7IG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7IH1cblxuICAgICAgICAgICAgLy8gaWYgZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIlxuICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJtb3VzZWVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgXCJwcmV2aW91c1wiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gaW5pdGlhbCBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgIHBYID0gZXYucGFnZVg7IHBZID0gZXYucGFnZVk7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIFwiY3VycmVudFwiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gbW91c2Vtb3ZlXG4gICAgICAgICAgICAgICAgJChvYikub24oXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgcG9sbGluZyBpbnRlcnZhbCAoc2VsZi1jYWxsaW5nIHRpbWVvdXQpIHRvIGNvbXBhcmUgbW91c2UgY29vcmRpbmF0ZXMgb3ZlciB0aW1lXG4gICAgICAgICAgICAgICAgaWYgKCFvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsb2IpO30gLCBjZmcuaW50ZXJ2YWwgKTt9XG5cbiAgICAgICAgICAgICAgICAvLyBlbHNlIGUudHlwZSA9PSBcIm1vdXNlbGVhdmVcIlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1bmJpbmQgZXhwZW5zaXZlIG1vdXNlbW92ZSBldmVudFxuICAgICAgICAgICAgICAgICQob2IpLm9mZihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBob3ZlckludGVudCBzdGF0ZSBpcyB0cnVlLCB0aGVuIGNhbGwgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uIGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXlcbiAgICAgICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtkZWxheShldixvYik7fSAsIGNmZy50aW1lb3V0ICk7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxuICAgICAgICByZXR1cm4gdGhpcy5vbih7J21vdXNlZW50ZXIuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyLCdtb3VzZWxlYXZlLmhvdmVySW50ZW50JzpoYW5kbGVIb3Zlcn0sIGNmZy5zZWxlY3Rvcik7XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iLCIvKiFcbiAqIGltYWdlc0xvYWRlZCBQQUNLQUdFRCB2My4xLjhcbiAqIEphdmFTY3JpcHQgaXMgYWxsIGxpa2UgXCJZb3UgaW1hZ2VzIGFyZSBkb25lIHlldCBvciB3aGF0P1wiXG4gKiBNSVQgTGljZW5zZVxuICovXG5cblxuLyohXG4gKiBFdmVudEVtaXR0ZXIgdjQuMi42IC0gZ2l0LmlvL2VlXG4gKiBPbGl2ZXIgQ2FsZHdlbGxcbiAqIE1JVCBsaWNlbnNlXG4gKiBAcHJlc2VydmVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHRcblxuXHQvKipcblx0ICogQ2xhc3MgZm9yIG1hbmFnaW5nIGV2ZW50cy5cblx0ICogQ2FuIGJlIGV4dGVuZGVkIHRvIHByb3ZpZGUgZXZlbnQgZnVuY3Rpb25hbGl0eSBpbiBvdGhlciBjbGFzc2VzLlxuXHQgKlxuXHQgKiBAY2xhc3MgRXZlbnRFbWl0dGVyIE1hbmFnZXMgZXZlbnQgcmVnaXN0ZXJpbmcgYW5kIGVtaXR0aW5nLlxuXHQgKi9cblx0ZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cblxuXHQvLyBTaG9ydGN1dHMgdG8gaW1wcm92ZSBzcGVlZCBhbmQgc2l6ZVxuXHR2YXIgcHJvdG8gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuXHR2YXIgZXhwb3J0cyA9IHRoaXM7XG5cdHZhciBvcmlnaW5hbEdsb2JhbFZhbHVlID0gZXhwb3J0cy5FdmVudEVtaXR0ZXI7XG5cblx0LyoqXG5cdCAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBldmVudCBpbiBpdCdzIHN0b3JhZ2UgYXJyYXkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gbGlzdGVuZXJzIEFycmF5IG9mIGxpc3RlbmVycyB0byBzZWFyY2ggdGhyb3VnaC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGxvb2sgZm9yLlxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9IEluZGV4IG9mIHRoZSBzcGVjaWZpZWQgbGlzdGVuZXIsIC0xIGlmIG5vdCBmb3VuZFxuXHQgKiBAYXBpIHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnMsIGxpc3RlbmVyKSB7XG5cdFx0dmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuXHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdGlmIChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBbGlhcyBhIG1ldGhvZCB3aGlsZSBrZWVwaW5nIHRoZSBjb250ZXh0IGNvcnJlY3QsIHRvIGFsbG93IGZvciBvdmVyd3JpdGluZyBvZiB0YXJnZXQgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IG1ldGhvZC5cblx0ICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBhbGlhc2VkIG1ldGhvZFxuXHQgKiBAYXBpIHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGFsaWFzKG5hbWUpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gYWxpYXNDbG9zdXJlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbbmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuXHQgKiBXaWxsIGluaXRpYWxpc2UgdGhlIGV2ZW50IG9iamVjdCBhbmQgbGlzdGVuZXIgYXJyYXlzIGlmIHJlcXVpcmVkLlxuXHQgKiBXaWxsIHJldHVybiBhbiBvYmplY3QgaWYgeW91IHVzZSBhIHJlZ2V4IHNlYXJjaC4gVGhlIG9iamVjdCBjb250YWlucyBrZXlzIGZvciBlYWNoIG1hdGNoZWQgZXZlbnQuIFNvIC9iYVtyel0vIG1pZ2h0IHJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyBiYXIgYW5kIGJhei4gQnV0IG9ubHkgaWYgeW91IGhhdmUgZWl0aGVyIGRlZmluZWQgdGhlbSB3aXRoIGRlZmluZUV2ZW50IG9yIGFkZGVkIHNvbWUgbGlzdGVuZXJzIHRvIHRoZW0uXG5cdCAqIEVhY2ggcHJvcGVydHkgaW4gdGhlIG9iamVjdCByZXNwb25zZSBpcyBhbiBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9uW118T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciB0aGUgZXZlbnQuXG5cdCAqL1xuXHRwcm90by5nZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoZXZ0KSB7XG5cdFx0dmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuXHRcdHZhciByZXNwb25zZTtcblx0XHR2YXIga2V5O1xuXG5cdFx0Ly8gUmV0dXJuIGEgY29uY2F0ZW5hdGVkIGFycmF5IG9mIGFsbCBtYXRjaGluZyBldmVudHMgaWZcblx0XHQvLyB0aGUgc2VsZWN0b3IgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG5cdFx0aWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXNwb25zZSA9IHt9O1xuXHRcdFx0Zm9yIChrZXkgaW4gZXZlbnRzKSB7XG5cdFx0XHRcdGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG5cdFx0XHRcdFx0cmVzcG9uc2Vba2V5XSA9IGV2ZW50c1trZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmVzcG9uc2UgPSBldmVudHNbZXZ0XSB8fCAoZXZlbnRzW2V2dF0gPSBbXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIGxpc3Qgb2YgbGlzdGVuZXIgb2JqZWN0cyBhbmQgZmxhdHRlbnMgaXQgaW50byBhIGxpc3Qgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBsaXN0ZW5lcnMgUmF3IGxpc3RlbmVyIG9iamVjdHMuXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9uW119IEp1c3QgdGhlIGxpc3RlbmVyIGZ1bmN0aW9ucy5cblx0ICovXG5cdHByb3RvLmZsYXR0ZW5MaXN0ZW5lcnMgPSBmdW5jdGlvbiBmbGF0dGVuTGlzdGVuZXJzKGxpc3RlbmVycykge1xuXHRcdHZhciBmbGF0TGlzdGVuZXJzID0gW107XG5cdFx0dmFyIGk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRmbGF0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXJzW2ldLmxpc3RlbmVyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmxhdExpc3RlbmVycztcblx0fTtcblxuXHQvKipcblx0ICogRmV0Y2hlcyB0aGUgcmVxdWVzdGVkIGxpc3RlbmVycyB2aWEgZ2V0TGlzdGVuZXJzIGJ1dCB3aWxsIGFsd2F5cyByZXR1cm4gdGhlIHJlc3VsdHMgaW5zaWRlIGFuIG9iamVjdC4gVGhpcyBpcyBtYWlubHkgZm9yIGludGVybmFsIHVzZSBidXQgb3RoZXJzIG1heSBmaW5kIGl0IHVzZWZ1bC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cblx0ICogQHJldHVybiB7T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBpbiBhbiBvYmplY3QuXG5cdCAqL1xuXHRwcm90by5nZXRMaXN0ZW5lcnNBc09iamVjdCA9IGZ1bmN0aW9uIGdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCkge1xuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuXHRcdHZhciByZXNwb25zZTtcblxuXHRcdGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0cmVzcG9uc2UgPSB7fTtcblx0XHRcdHJlc3BvbnNlW2V2dF0gPSBsaXN0ZW5lcnM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3BvbnNlIHx8IGxpc3RlbmVycztcblx0fTtcblxuXHQvKipcblx0ICogQWRkcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG5cdCAqIFRoZSBsaXN0ZW5lciB3aWxsIG5vdCBiZSBhZGRlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZS5cblx0ICogSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBpdCBpcyBjYWxsZWQuXG5cdCAqIElmIHlvdSBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lIHRoZW4gdGhlIGxpc3RlbmVyIHdpbGwgYmUgYWRkZWQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cblx0ICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRwcm90by5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuXHRcdHZhciBsaXN0ZW5lcklzV3JhcHBlZCA9IHR5cGVvZiBsaXN0ZW5lciA9PT0gJ29iamVjdCc7XG5cdFx0dmFyIGtleTtcblxuXHRcdGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuXHRcdFx0aWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpID09PSAtMSkge1xuXHRcdFx0XHRsaXN0ZW5lcnNba2V5XS5wdXNoKGxpc3RlbmVySXNXcmFwcGVkID8gbGlzdGVuZXIgOiB7XG5cdFx0XHRcdFx0bGlzdGVuZXI6IGxpc3RlbmVyLFxuXHRcdFx0XHRcdG9uY2U6IGZhbHNlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBBbGlhcyBvZiBhZGRMaXN0ZW5lclxuXHQgKi9cblx0cHJvdG8ub24gPSBhbGlhcygnYWRkTGlzdGVuZXInKTtcblxuXHQvKipcblx0ICogU2VtaS1hbGlhcyBvZiBhZGRMaXN0ZW5lci4gSXQgd2lsbCBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmVcblx0ICogYXV0b21hdGljYWxseSByZW1vdmVkIGFmdGVyIGl0J3MgZmlyc3QgZXhlY3V0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cblx0ICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRwcm90by5hZGRPbmNlTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRPbmNlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuXHRcdHJldHVybiB0aGlzLmFkZExpc3RlbmVyKGV2dCwge1xuXHRcdFx0bGlzdGVuZXI6IGxpc3RlbmVyLFxuXHRcdFx0b25jZTogdHJ1ZVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBBbGlhcyBvZiBhZGRPbmNlTGlzdGVuZXIuXG5cdCAqL1xuXHRwcm90by5vbmNlID0gYWxpYXMoJ2FkZE9uY2VMaXN0ZW5lcicpO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIGFuIGV2ZW50IG5hbWUuIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdhbnQgdG8gdXNlIGEgcmVnZXggdG8gYWRkIGEgbGlzdGVuZXIgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIElmIHlvdSBkb24ndCBkbyB0aGlzIHRoZW4gaG93IGRvIHlvdSBleHBlY3QgaXQgdG8ga25vdyB3aGF0IGV2ZW50IHRvIGFkZCB0bz8gU2hvdWxkIGl0IGp1c3QgYWRkIHRvIGV2ZXJ5IHBvc3NpYmxlIG1hdGNoIGZvciBhIHJlZ2V4PyBOby4gVGhhdCBpcyBzY2FyeSBhbmQgYmFkLlxuXHQgKiBZb3UgbmVlZCB0byB0ZWxsIGl0IHdoYXQgZXZlbnQgbmFtZXMgc2hvdWxkIGJlIG1hdGNoZWQgYnkgYSByZWdleC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG5cdCAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cHJvdG8uZGVmaW5lRXZlbnQgPSBmdW5jdGlvbiBkZWZpbmVFdmVudChldnQpIHtcblx0XHR0aGlzLmdldExpc3RlbmVycyhldnQpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBVc2VzIGRlZmluZUV2ZW50IHRvIGRlZmluZSBtdWx0aXBsZSBldmVudHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nW119IGV2dHMgQW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgdG8gZGVmaW5lLlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHByb3RvLmRlZmluZUV2ZW50cyA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50cyhldnRzKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBldnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHR0aGlzLmRlZmluZUV2ZW50KGV2dHNbaV0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cblx0ICogV2hlbiBwYXNzZWQgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUsIGl0IHdpbGwgcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gcmVtb3ZlIGZyb20gdGhlIGV2ZW50LlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHByb3RvLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG5cdFx0dmFyIGluZGV4O1xuXHRcdHZhciBrZXk7XG5cblx0XHRmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcblx0XHRcdGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRpbmRleCA9IGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpO1xuXG5cdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHRsaXN0ZW5lcnNba2V5XS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFsaWFzIG9mIHJlbW92ZUxpc3RlbmVyXG5cdCAqL1xuXHRwcm90by5vZmYgPSBhbGlhcygncmVtb3ZlTGlzdGVuZXInKTtcblxuXHQvKipcblx0ICogQWRkcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG5cdCAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cblx0ICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYWRkIHRoZSBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuXHQgKiBZZWFoLCB0aGlzIGZ1bmN0aW9uIGRvZXMgcXVpdGUgYSBiaXQuIFRoYXQncyBwcm9iYWJseSBhIGJhZCB0aGluZy5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkLlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHByb3RvLmFkZExpc3RlbmVycyA9IGZ1bmN0aW9uIGFkZExpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuXHRcdC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG5cdFx0cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyhmYWxzZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cblx0ICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuXHQgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgcmVtb3ZlZC5cblx0ICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gcmVtb3ZlLlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHByb3RvLnJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuXHRcdC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG5cdFx0cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyh0cnVlLCBldnQsIGxpc3RlbmVycyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEVkaXRzIGxpc3RlbmVycyBpbiBidWxrLiBUaGUgYWRkTGlzdGVuZXJzIGFuZCByZW1vdmVMaXN0ZW5lcnMgbWV0aG9kcyBib3RoIHVzZSB0aGlzIHRvIGRvIHRoZWlyIGpvYi4gWW91IHNob3VsZCByZWFsbHkgdXNlIHRob3NlIGluc3RlYWQsIHRoaXMgaXMgYSBsaXR0bGUgbG93ZXIgbGV2ZWwuXG5cdCAqIFRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGRldGVybWluZSBpZiB0aGUgbGlzdGVuZXJzIGFyZSByZW1vdmVkICh0cnVlKSBvciBhZGRlZCAoZmFsc2UpLlxuXHQgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuXHQgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQvcmVtb3ZlZC5cblx0ICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWFuaXB1bGF0ZSB0aGUgbGlzdGVuZXJzIG9mIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cblx0ICpcblx0ICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgVHJ1ZSBpZiB5b3Ugd2FudCB0byByZW1vdmUgbGlzdGVuZXJzLCBmYWxzZSBpZiB5b3Ugd2FudCB0byBhZGQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC9yZW1vdmUuXG5cdCAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cHJvdG8ubWFuaXB1bGF0ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIG1hbmlwdWxhdGVMaXN0ZW5lcnMocmVtb3ZlLCBldnQsIGxpc3RlbmVycykge1xuXHRcdHZhciBpO1xuXHRcdHZhciB2YWx1ZTtcblx0XHR2YXIgc2luZ2xlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lciA6IHRoaXMuYWRkTGlzdGVuZXI7XG5cdFx0dmFyIG11bHRpcGxlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lcnMgOiB0aGlzLmFkZExpc3RlbmVycztcblxuXHRcdC8vIElmIGV2dCBpcyBhbiBvYmplY3QgdGhlbiBwYXNzIGVhY2ggb2YgaXQncyBwcm9wZXJ0aWVzIHRvIHRoaXMgbWV0aG9kXG5cdFx0aWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnICYmICEoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuXHRcdFx0Zm9yIChpIGluIGV2dCkge1xuXHRcdFx0XHRpZiAoZXZ0Lmhhc093blByb3BlcnR5KGkpICYmICh2YWx1ZSA9IGV2dFtpXSkpIHtcblx0XHRcdFx0XHQvLyBQYXNzIHRoZSBzaW5nbGUgbGlzdGVuZXIgc3RyYWlnaHQgdGhyb3VnaCB0byB0aGUgc2luZ3VsYXIgbWV0aG9kXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0c2luZ2xlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vIE90aGVyd2lzZSBwYXNzIGJhY2sgdG8gdGhlIG11bHRpcGxlIGZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRtdWx0aXBsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBTbyBldnQgbXVzdCBiZSBhIHN0cmluZ1xuXHRcdFx0Ly8gQW5kIGxpc3RlbmVycyBtdXN0IGJlIGFuIGFycmF5IG9mIGxpc3RlbmVyc1xuXHRcdFx0Ly8gTG9vcCBvdmVyIGl0IGFuZCBwYXNzIGVhY2ggb25lIHRvIHRoZSBtdWx0aXBsZSBtZXRob2Rcblx0XHRcdGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0XHRzaW5nbGUuY2FsbCh0aGlzLCBldnQsIGxpc3RlbmVyc1tpXSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LlxuXHQgKiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYW4gZXZlbnQgdGhlbiBhbGwgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICogVGhhdCBtZWFucyBldmVyeSBldmVudCB3aWxsIGJlIGVtcHRpZWQuXG5cdCAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVnZXggdG8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBbZXZ0XSBPcHRpb25hbCBuYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IuIFdpbGwgcmVtb3ZlIGZyb20gZXZlcnkgZXZlbnQgaWYgbm90IHBhc3NlZC5cblx0ICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRwcm90by5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2dCkge1xuXHRcdHZhciB0eXBlID0gdHlwZW9mIGV2dDtcblx0XHR2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG5cdFx0dmFyIGtleTtcblxuXHRcdC8vIFJlbW92ZSBkaWZmZXJlbnQgdGhpbmdzIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgZXZ0XG5cdFx0aWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHQvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuXHRcdFx0ZGVsZXRlIGV2ZW50c1tldnRdO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0Ly8gUmVtb3ZlIGFsbCBldmVudHMgbWF0Y2hpbmcgdGhlIHJlZ2V4LlxuXHRcdFx0Zm9yIChrZXkgaW4gZXZlbnRzKSB7XG5cdFx0XHRcdGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGV2ZW50c1trZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgaW4gYWxsIGV2ZW50c1xuXHRcdFx0ZGVsZXRlIHRoaXMuX2V2ZW50cztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcblx0ICogQWxpYXMgb2YgcmVtb3ZlRXZlbnQuXG5cdCAqXG5cdCAqIEFkZGVkIHRvIG1pcnJvciB0aGUgbm9kZSBBUEkuXG5cdCAqL1xuXHRwcm90by5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBhbGlhcygncmVtb3ZlRXZlbnQnKTtcblxuXHQvKipcblx0ICogRW1pdHMgYW4gZXZlbnQgb2YgeW91ciBjaG9pY2UuXG5cdCAqIFdoZW4gZW1pdHRlZCwgZXZlcnkgbGlzdGVuZXIgYXR0YWNoZWQgdG8gdGhhdCBldmVudCB3aWxsIGJlIGV4ZWN1dGVkLlxuXHQgKiBJZiB5b3UgcGFzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgYXJyYXkgdGhlbiB0aG9zZSBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgdG8gZXZlcnkgbGlzdGVuZXIgdXBvbiBleGVjdXRpb24uXG5cdCAqIEJlY2F1c2UgaXQgdXNlcyBgYXBwbHlgLCB5b3VyIGFycmF5IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhcyBpZiB5b3Ugd3JvdGUgdGhlbSBvdXQgc2VwYXJhdGVseS5cblx0ICogU28gdGhleSB3aWxsIG5vdCBhcnJpdmUgd2l0aGluIHRoZSBhcnJheSBvbiB0aGUgb3RoZXIgc2lkZSwgdGhleSB3aWxsIGJlIHNlcGFyYXRlLlxuXHQgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBbYXJnc10gT3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uIGVtaXRFdmVudChldnQsIGFyZ3MpIHtcblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuXHRcdHZhciBsaXN0ZW5lcjtcblx0XHR2YXIgaTtcblx0XHR2YXIga2V5O1xuXHRcdHZhciByZXNwb25zZTtcblxuXHRcdGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuXHRcdFx0aWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdGkgPSBsaXN0ZW5lcnNba2V5XS5sZW5ndGg7XG5cblx0XHRcdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0XHRcdC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCBzaGFsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50XG5cdFx0XHRcdFx0Ly8gVGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGVpdGhlciB3aXRoIGEgYmFzaWMgY2FsbCBvciBhbiBhcHBseSBpZiB0aGVyZSBpcyBhbiBhcmdzIGFycmF5XG5cdFx0XHRcdFx0bGlzdGVuZXIgPSBsaXN0ZW5lcnNba2V5XVtpXTtcblxuXHRcdFx0XHRcdGlmIChsaXN0ZW5lci5vbmNlID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJlc3BvbnNlID0gbGlzdGVuZXIubGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyB8fCBbXSk7XG5cblx0XHRcdFx0XHRpZiAocmVzcG9uc2UgPT09IHRoaXMuX2dldE9uY2VSZXR1cm5WYWx1ZSgpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBBbGlhcyBvZiBlbWl0RXZlbnRcblx0ICovXG5cdHByb3RvLnRyaWdnZXIgPSBhbGlhcygnZW1pdEV2ZW50Jyk7XG5cblx0LyoqXG5cdCAqIFN1YnRseSBkaWZmZXJlbnQgZnJvbSBlbWl0RXZlbnQgaW4gdGhhdCBpdCB3aWxsIHBhc3MgaXRzIGFyZ3VtZW50cyBvbiB0byB0aGUgbGlzdGVuZXJzLCBhcyBvcHBvc2VkIHRvIHRha2luZyBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMgdG8gcGFzcyBvbi5cblx0ICogQXMgd2l0aCBlbWl0RXZlbnQsIHlvdSBjYW4gcGFzcyBhIHJlZ2V4IGluIHBsYWNlIG9mIHRoZSBldmVudCBuYW1lIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG5cdCAqIEBwYXJhbSB7Li4uKn0gT3B0aW9uYWwgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG5cdCAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cHJvdG8uZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZ0KSB7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXHRcdHJldHVybiB0aGlzLmVtaXRFdmVudChldnQsIGFyZ3MpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZiBhXG5cdCAqIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGUgb25lIHNldCBoZXJlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkXG5cdCAqIGFmdGVyIGV4ZWN1dGlvbi4gVGhpcyB2YWx1ZSBkZWZhdWx0cyB0byB0cnVlLlxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gY2hlY2sgZm9yIHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy5cblx0ICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRwcm90by5zZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBzZXRPbmNlUmV0dXJuVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLl9vbmNlUmV0dXJuVmFsdWUgPSB2YWx1ZTtcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcblx0ICogRmV0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWZcblx0ICogdGhlIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGlzIG9uZSB0aGVuIGl0IHNob3VsZCBiZSByZW1vdmVkXG5cdCAqIGF1dG9tYXRpY2FsbHkuIEl0IHdpbGwgcmV0dXJuIHRydWUgYnkgZGVmYXVsdC5cblx0ICpcblx0ICogQHJldHVybiB7KnxCb29sZWFufSBUaGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBmb3Igb3IgdGhlIGRlZmF1bHQsIHRydWUuXG5cdCAqIEBhcGkgcHJpdmF0ZVxuXHQgKi9cblx0cHJvdG8uX2dldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIF9nZXRPbmNlUmV0dXJuVmFsdWUoKSB7XG5cdFx0aWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ19vbmNlUmV0dXJuVmFsdWUnKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEZldGNoZXMgdGhlIGV2ZW50cyBvYmplY3QgYW5kIGNyZWF0ZXMgb25lIGlmIHJlcXVpcmVkLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBldmVudHMgc3RvcmFnZSBvYmplY3QuXG5cdCAqIEBhcGkgcHJpdmF0ZVxuXHQgKi9cblx0cHJvdG8uX2dldEV2ZW50cyA9IGZ1bmN0aW9uIF9nZXRFdmVudHMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXZlcnRzIHRoZSBnbG9iYWwge0BsaW5rIEV2ZW50RW1pdHRlcn0gdG8gaXRzIHByZXZpb3VzIHZhbHVlIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoaXMgdmVyc2lvbi5cblx0ICpcblx0ICogQHJldHVybiB7RnVuY3Rpb259IE5vbiBjb25mbGljdGluZyBFdmVudEVtaXR0ZXIgY2xhc3MuXG5cdCAqL1xuXHRFdmVudEVtaXR0ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG5cdFx0ZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBvcmlnaW5hbEdsb2JhbFZhbHVlO1xuXHRcdHJldHVybiBFdmVudEVtaXR0ZXI7XG5cdH07XG5cblx0Ly8gRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3Rcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZSgnZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlcicsW10sZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEV2ZW50RW1pdHRlcjtcblx0XHR9KTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyl7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhpcy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cdH1cbn0uY2FsbCh0aGlzKSk7XG5cbi8qIVxuICogZXZlbnRpZSB2MS4wLjRcbiAqIGV2ZW50IGJpbmRpbmcgaGVscGVyXG4gKiAgIGV2ZW50aWUuYmluZCggZWxlbSwgJ2NsaWNrJywgbXlGbiApXG4gKiAgIGV2ZW50aWUudW5iaW5kKCBlbGVtLCAnY2xpY2snLCBteUZuIClcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCB1bmRlZjogdHJ1ZSwgdW51c2VkOiB0cnVlICovXG4vKmdsb2JhbCBkZWZpbmU6IGZhbHNlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcblxuXG5cbnZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG52YXIgYmluZCA9IGZ1bmN0aW9uKCkge307XG5cbmZ1bmN0aW9uIGdldElFRXZlbnQoIG9iaiApIHtcbiAgdmFyIGV2ZW50ID0gd2luZG93LmV2ZW50O1xuICAvLyBhZGQgZXZlbnQudGFyZ2V0XG4gIGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50IHx8IG9iajtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5pZiAoIGRvY0VsZW0uYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uYXR0YWNoRXZlbnQgKSB7XG4gIGJpbmQgPSBmdW5jdGlvbiggb2JqLCB0eXBlLCBmbiApIHtcbiAgICBvYmpbIHR5cGUgKyBmbiBdID0gZm4uaGFuZGxlRXZlbnQgP1xuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKCBmbiwgZXZlbnQgKTtcbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5jYWxsKCBvYmosIGV2ZW50ICk7XG4gICAgICB9O1xuICAgIG9iai5hdHRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICB9O1xufVxuXG52YXIgdW5iaW5kID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKCBkb2NFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uZGV0YWNoRXZlbnQgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5kZXRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICAgIHRyeSB7XG4gICAgICBkZWxldGUgb2JqWyB0eXBlICsgZm4gXTtcbiAgICB9IGNhdGNoICggZXJyICkge1xuICAgICAgLy8gY2FuJ3QgZGVsZXRlIHdpbmRvdyBvYmplY3QgcHJvcGVydGllc1xuICAgICAgb2JqWyB0eXBlICsgZm4gXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG59XG5cbnZhciBldmVudGllID0ge1xuICBiaW5kOiBiaW5kLFxuICB1bmJpbmQ6IHVuYmluZFxufTtcblxuLy8gdHJhbnNwb3J0XG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EXG4gIGRlZmluZSggJ2V2ZW50aWUvZXZlbnRpZScsZXZlbnRpZSApO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LmV2ZW50aWUgPSBldmVudGllO1xufVxuXG59KSggdGhpcyApO1xuXG4vKiFcbiAqIGltYWdlc0xvYWRlZCB2My4xLjhcbiAqIEphdmFTY3JpcHQgaXMgYWxsIGxpa2UgXCJZb3UgaW1hZ2VzIGFyZSBkb25lIHlldCBvciB3aGF0P1wiXG4gKiBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHsgXG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuXG4gIC8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlICovXG5cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlcicsXG4gICAgICAnZXZlbnRpZS9ldmVudGllJ1xuICAgIF0sIGZ1bmN0aW9uKCBFdmVudEVtaXR0ZXIsIGV2ZW50aWUgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBFdmVudEVtaXR0ZXIsIGV2ZW50aWUgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnd29sZnk4Ny1ldmVudGVtaXR0ZXInKSxcbiAgICAgIHJlcXVpcmUoJ2V2ZW50aWUnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuaW1hZ2VzTG9hZGVkID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5FdmVudEVtaXR0ZXIsXG4gICAgICB3aW5kb3cuZXZlbnRpZVxuICAgICk7XG4gIH1cblxufSkoIHdpbmRvdyxcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIGZhY3RvcnkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBFdmVudEVtaXR0ZXIsIGV2ZW50aWUgKSB7XG5cblxuXG52YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG52YXIgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlO1xudmFyIGhhc0NvbnNvbGUgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZXh0ZW5kIG9iamVjdHNcbmZ1bmN0aW9uIGV4dGVuZCggYSwgYiApIHtcbiAgZm9yICggdmFyIHByb3AgaW4gYiApIHtcbiAgICBhWyBwcm9wIF0gPSBiWyBwcm9wIF07XG4gIH1cbiAgcmV0dXJuIGE7XG59XG5cbnZhciBvYmpUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5mdW5jdGlvbiBpc0FycmF5KCBvYmogKSB7XG4gIHJldHVybiBvYmpUb1N0cmluZy5jYWxsKCBvYmogKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLy8gdHVybiBlbGVtZW50IG9yIG5vZGVMaXN0IGludG8gYW4gYXJyYXlcbmZ1bmN0aW9uIG1ha2VBcnJheSggb2JqICkge1xuICB2YXIgYXJ5ID0gW107XG4gIGlmICggaXNBcnJheSggb2JqICkgKSB7XG4gICAgLy8gdXNlIG9iamVjdCBpZiBhbHJlYWR5IGFuIGFycmF5XG4gICAgYXJ5ID0gb2JqO1xuICB9IGVsc2UgaWYgKCB0eXBlb2Ygb2JqLmxlbmd0aCA9PT0gJ251bWJlcicgKSB7XG4gICAgLy8gY29udmVydCBub2RlTGlzdCB0byBhcnJheVxuICAgIGZvciAoIHZhciBpPTAsIGxlbiA9IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgIGFyeS5wdXNoKCBvYmpbaV0gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gYXJyYXkgb2Ygc2luZ2xlIGluZGV4XG4gICAgYXJ5LnB1c2goIG9iaiApO1xuICB9XG4gIHJldHVybiBhcnk7XG59XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaW1hZ2VzTG9hZGVkIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXksIEVsZW1lbnQsIE5vZGVMaXN0LCBTdHJpbmd9IGVsZW1cbiAgICogQHBhcmFtIHtPYmplY3Qgb3IgRnVuY3Rpb259IG9wdGlvbnMgLSBpZiBmdW5jdGlvbiwgdXNlIGFzIGNhbGxiYWNrXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQWx3YXlzIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIGZ1bmN0aW9uIEltYWdlc0xvYWRlZCggZWxlbSwgb3B0aW9ucywgb25BbHdheXMgKSB7XG4gICAgLy8gY29lcmNlIEltYWdlc0xvYWRlZCgpIHdpdGhvdXQgbmV3LCB0byBiZSBuZXcgSW1hZ2VzTG9hZGVkKClcbiAgICBpZiAoICEoIHRoaXMgaW5zdGFuY2VvZiBJbWFnZXNMb2FkZWQgKSApIHtcbiAgICAgIHJldHVybiBuZXcgSW1hZ2VzTG9hZGVkKCBlbGVtLCBvcHRpb25zICk7XG4gICAgfVxuICAgIC8vIHVzZSBlbGVtIGFzIHNlbGVjdG9yIHN0cmluZ1xuICAgIGlmICggdHlwZW9mIGVsZW0gPT09ICdzdHJpbmcnICkge1xuICAgICAgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGVsZW0gKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnRzID0gbWFrZUFycmF5KCBlbGVtICk7XG4gICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKCB7fSwgdGhpcy5vcHRpb25zICk7XG5cbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgb25BbHdheXMgPSBvcHRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHRlbmQoIHRoaXMub3B0aW9ucywgb3B0aW9ucyApO1xuICAgIH1cblxuICAgIGlmICggb25BbHdheXMgKSB7XG4gICAgICB0aGlzLm9uKCAnYWx3YXlzJywgb25BbHdheXMgKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEltYWdlcygpO1xuXG4gICAgaWYgKCAkICkge1xuICAgICAgLy8gYWRkIGpRdWVyeSBEZWZlcnJlZCBvYmplY3RcbiAgICAgIHRoaXMuanFEZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgfVxuXG4gICAgLy8gSEFDSyBjaGVjayBhc3luYyB0byBhbGxvdyB0aW1lIHRvIGJpbmQgbGlzdGVuZXJzXG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgIF90aGlzLmNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICBJbWFnZXNMb2FkZWQucHJvdG90eXBlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEltYWdlc0xvYWRlZC5wcm90b3R5cGUub3B0aW9ucyA9IHt9O1xuXG4gIEltYWdlc0xvYWRlZC5wcm90b3R5cGUuZ2V0SW1hZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbWFnZXMgPSBbXTtcblxuICAgIC8vIGZpbHRlciAmIGZpbmQgaXRlbXMgaWYgd2UgaGF2ZSBhbiBpdGVtIHNlbGVjdG9yXG4gICAgZm9yICggdmFyIGk9MCwgbGVuID0gdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy5lbGVtZW50c1tpXTtcbiAgICAgIC8vIGZpbHRlciBzaWJsaW5nc1xuICAgICAgaWYgKCBlbGVtLm5vZGVOYW1lID09PSAnSU1HJyApIHtcbiAgICAgICAgdGhpcy5hZGRJbWFnZSggZWxlbSApO1xuICAgICAgfVxuICAgICAgLy8gZmluZCBjaGlsZHJlblxuICAgICAgLy8gbm8gbm9uLWVsZW1lbnQgbm9kZXMsICMxNDNcbiAgICAgIHZhciBub2RlVHlwZSA9IGVsZW0ubm9kZVR5cGU7XG4gICAgICBpZiAoICFub2RlVHlwZSB8fCAhKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRFbGVtcyA9IGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG4gICAgICAvLyBjb25jYXQgY2hpbGRFbGVtcyB0byBmaWx0ZXJGb3VuZCBhcnJheVxuICAgICAgZm9yICggdmFyIGo9MCwgakxlbiA9IGNoaWxkRWxlbXMubGVuZ3RoOyBqIDwgakxlbjsgaisrICkge1xuICAgICAgICB2YXIgaW1nID0gY2hpbGRFbGVtc1tqXTtcbiAgICAgICAgdGhpcy5hZGRJbWFnZSggaW1nICk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0ltYWdlfSBpbWdcbiAgICovXG4gIEltYWdlc0xvYWRlZC5wcm90b3R5cGUuYWRkSW1hZ2UgPSBmdW5jdGlvbiggaW1nICkge1xuICAgIHZhciBsb2FkaW5nSW1hZ2UgPSBuZXcgTG9hZGluZ0ltYWdlKCBpbWcgKTtcbiAgICB0aGlzLmltYWdlcy5wdXNoKCBsb2FkaW5nSW1hZ2UgKTtcbiAgfTtcblxuICBJbWFnZXNMb2FkZWQucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgY2hlY2tlZENvdW50ID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5pbWFnZXMubGVuZ3RoO1xuICAgIHRoaXMuaGFzQW55QnJva2VuID0gZmFsc2U7XG4gICAgLy8gY29tcGxldGUgaWYgbm8gaW1hZ2VzXG4gICAgaWYgKCAhbGVuZ3RoICkge1xuICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uQ29uZmlybSggaW1hZ2UsIG1lc3NhZ2UgKSB7XG4gICAgICBpZiAoIF90aGlzLm9wdGlvbnMuZGVidWcgJiYgaGFzQ29uc29sZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coICdjb25maXJtJywgaW1hZ2UsIG1lc3NhZ2UgKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMucHJvZ3Jlc3MoIGltYWdlICk7XG4gICAgICBjaGVja2VkQ291bnQrKztcbiAgICAgIGlmICggY2hlY2tlZENvdW50ID09PSBsZW5ndGggKSB7XG4gICAgICAgIF90aGlzLmNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTsgLy8gYmluZCBvbmNlXG4gICAgfVxuXG4gICAgZm9yICggdmFyIGk9MDsgaSA8IGxlbmd0aDsgaSsrICkge1xuICAgICAgdmFyIGxvYWRpbmdJbWFnZSA9IHRoaXMuaW1hZ2VzW2ldO1xuICAgICAgbG9hZGluZ0ltYWdlLm9uKCAnY29uZmlybScsIG9uQ29uZmlybSApO1xuICAgICAgbG9hZGluZ0ltYWdlLmNoZWNrKCk7XG4gICAgfVxuICB9O1xuXG4gIEltYWdlc0xvYWRlZC5wcm90b3R5cGUucHJvZ3Jlc3MgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG4gICAgdGhpcy5oYXNBbnlCcm9rZW4gPSB0aGlzLmhhc0FueUJyb2tlbiB8fCAhaW1hZ2UuaXNMb2FkZWQ7XG4gICAgLy8gSEFDSyAtIENocm9tZSB0cmlnZ2VycyBldmVudCBiZWZvcmUgb2JqZWN0IHByb3BlcnRpZXMgaGF2ZSBjaGFuZ2VkLiAjODNcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgX3RoaXMuZW1pdCggJ3Byb2dyZXNzJywgX3RoaXMsIGltYWdlICk7XG4gICAgICBpZiAoIF90aGlzLmpxRGVmZXJyZWQgJiYgX3RoaXMuanFEZWZlcnJlZC5ub3RpZnkgKSB7XG4gICAgICAgIF90aGlzLmpxRGVmZXJyZWQubm90aWZ5KCBfdGhpcywgaW1hZ2UgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBJbWFnZXNMb2FkZWQucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuaGFzQW55QnJva2VuID8gJ2ZhaWwnIDogJ2RvbmUnO1xuICAgIHRoaXMuaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAvLyBIQUNLIC0gYW5vdGhlciBzZXRUaW1lb3V0IHNvIHRoYXQgY29uZmlybSBoYXBwZW5zIGFmdGVyIHByb2dyZXNzXG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICBfdGhpcy5lbWl0KCBldmVudE5hbWUsIF90aGlzICk7XG4gICAgICBfdGhpcy5lbWl0KCAnYWx3YXlzJywgX3RoaXMgKTtcbiAgICAgIGlmICggX3RoaXMuanFEZWZlcnJlZCApIHtcbiAgICAgICAgdmFyIGpxTWV0aG9kID0gX3RoaXMuaGFzQW55QnJva2VuID8gJ3JlamVjdCcgOiAncmVzb2x2ZSc7XG4gICAgICAgIF90aGlzLmpxRGVmZXJyZWRbIGpxTWV0aG9kIF0oIF90aGlzICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0ganF1ZXJ5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgaWYgKCAkICkge1xuICAgICQuZm4uaW1hZ2VzTG9hZGVkID0gZnVuY3Rpb24oIG9wdGlvbnMsIGNhbGxiYWNrICkge1xuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IEltYWdlc0xvYWRlZCggdGhpcywgb3B0aW9ucywgY2FsbGJhY2sgKTtcbiAgICAgIHJldHVybiBpbnN0YW5jZS5qcURlZmVycmVkLnByb21pc2UoICQodGhpcykgKTtcbiAgICB9O1xuICB9XG5cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICBmdW5jdGlvbiBMb2FkaW5nSW1hZ2UoIGltZyApIHtcbiAgICB0aGlzLmltZyA9IGltZztcbiAgfVxuXG4gIExvYWRpbmdJbWFnZS5wcm90b3R5cGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgTG9hZGluZ0ltYWdlLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGZpcnN0IGNoZWNrIGNhY2hlZCBhbnkgcHJldmlvdXMgaW1hZ2VzIHRoYXQgaGF2ZSBzYW1lIHNyY1xuICAgIHZhciByZXNvdXJjZSA9IGNhY2hlWyB0aGlzLmltZy5zcmMgXSB8fCBuZXcgUmVzb3VyY2UoIHRoaXMuaW1nLnNyYyApO1xuICAgIGlmICggcmVzb3VyY2UuaXNDb25maXJtZWQgKSB7XG4gICAgICB0aGlzLmNvbmZpcm0oIHJlc291cmNlLmlzTG9hZGVkLCAnY2FjaGVkIHdhcyBjb25maXJtZWQnICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgY29tcGxldGUgaXMgdHJ1ZSBhbmQgYnJvd3NlciBzdXBwb3J0cyBuYXR1cmFsIHNpemVzLFxuICAgIC8vIHRyeSB0byBjaGVjayBmb3IgaW1hZ2Ugc3RhdHVzIG1hbnVhbGx5LlxuICAgIGlmICggdGhpcy5pbWcuY29tcGxldGUgJiYgdGhpcy5pbWcubmF0dXJhbFdpZHRoICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAvLyByZXBvcnQgYmFzZWQgb24gbmF0dXJhbFdpZHRoXG4gICAgICB0aGlzLmNvbmZpcm0oIHRoaXMuaW1nLm5hdHVyYWxXaWR0aCAhPT0gMCwgJ25hdHVyYWxXaWR0aCcgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBub25lIG9mIHRoZSBjaGVja3MgYWJvdmUgbWF0Y2hlZCwgc2ltdWxhdGUgbG9hZGluZyBvbiBkZXRhY2hlZCBlbGVtZW50LlxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmVzb3VyY2Uub24oICdjb25maXJtJywgZnVuY3Rpb24oIHJlc3JjLCBtZXNzYWdlICkge1xuICAgICAgX3RoaXMuY29uZmlybSggcmVzcmMuaXNMb2FkZWQsIG1lc3NhZ2UgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmVzb3VyY2UuY2hlY2soKTtcbiAgfTtcblxuICBMb2FkaW5nSW1hZ2UucHJvdG90eXBlLmNvbmZpcm0gPSBmdW5jdGlvbiggaXNMb2FkZWQsIG1lc3NhZ2UgKSB7XG4gICAgdGhpcy5pc0xvYWRlZCA9IGlzTG9hZGVkO1xuICAgIHRoaXMuZW1pdCggJ2NvbmZpcm0nLCB0aGlzLCBtZXNzYWdlICk7XG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUmVzb3VyY2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAvLyBSZXNvdXJjZSBjaGVja3MgZWFjaCBzcmMsIG9ubHkgb25jZVxuICAvLyBzZXBhcmF0ZSBjbGFzcyBmcm9tIExvYWRpbmdJbWFnZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4gU2VlICMxMTVcblxuICB2YXIgY2FjaGUgPSB7fTtcblxuICBmdW5jdGlvbiBSZXNvdXJjZSggc3JjICkge1xuICAgIHRoaXMuc3JjID0gc3JjO1xuICAgIC8vIGFkZCB0byBjYWNoZVxuICAgIGNhY2hlWyBzcmMgXSA9IHRoaXM7XG4gIH1cblxuICBSZXNvdXJjZS5wcm90b3R5cGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgUmVzb3VyY2UucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gb25seSB0cmlnZ2VyIGNoZWNraW5nIG9uY2VcbiAgICBpZiAoIHRoaXMuaXNDaGVja2VkICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBzaW11bGF0ZSBsb2FkaW5nIG9uIGRldGFjaGVkIGVsZW1lbnRcbiAgICB2YXIgcHJveHlJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIGV2ZW50aWUuYmluZCggcHJveHlJbWFnZSwgJ2xvYWQnLCB0aGlzICk7XG4gICAgZXZlbnRpZS5iaW5kKCBwcm94eUltYWdlLCAnZXJyb3InLCB0aGlzICk7XG4gICAgcHJveHlJbWFnZS5zcmMgPSB0aGlzLnNyYztcbiAgICAvLyBzZXQgZmxhZ1xuICAgIHRoaXMuaXNDaGVja2VkID0gdHJ1ZTtcbiAgfTtcblxuICAvLyAtLS0tLSBldmVudHMgLS0tLS0gLy9cblxuICAvLyB0cmlnZ2VyIHNwZWNpZmllZCBoYW5kbGVyIGZvciBldmVudCB0eXBlXG4gIFJlc291cmNlLnByb3RvdHlwZS5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgbWV0aG9kID0gJ29uJyArIGV2ZW50LnR5cGU7XG4gICAgaWYgKCB0aGlzWyBtZXRob2QgXSApIHtcbiAgICAgIHRoaXNbIG1ldGhvZCBdKCBldmVudCApO1xuICAgIH1cbiAgfTtcblxuICBSZXNvdXJjZS5wcm90b3R5cGUub25sb2FkID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHRoaXMuY29uZmlybSggdHJ1ZSwgJ29ubG9hZCcgKTtcbiAgICB0aGlzLnVuYmluZFByb3h5RXZlbnRzKCBldmVudCApO1xuICB9O1xuXG4gIFJlc291cmNlLnByb3RvdHlwZS5vbmVycm9yID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHRoaXMuY29uZmlybSggZmFsc2UsICdvbmVycm9yJyApO1xuICAgIHRoaXMudW5iaW5kUHJveHlFdmVudHMoIGV2ZW50ICk7XG4gIH07XG5cbiAgLy8gLS0tLS0gY29uZmlybSAtLS0tLSAvL1xuXG4gIFJlc291cmNlLnByb3RvdHlwZS5jb25maXJtID0gZnVuY3Rpb24oIGlzTG9hZGVkLCBtZXNzYWdlICkge1xuICAgIHRoaXMuaXNDb25maXJtZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNMb2FkZWQgPSBpc0xvYWRlZDtcbiAgICB0aGlzLmVtaXQoICdjb25maXJtJywgdGhpcywgbWVzc2FnZSApO1xuICB9O1xuXG4gIFJlc291cmNlLnByb3RvdHlwZS51bmJpbmRQcm94eUV2ZW50cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICBldmVudGllLnVuYmluZCggZXZlbnQudGFyZ2V0LCAnbG9hZCcsIHRoaXMgKTtcbiAgICBldmVudGllLnVuYmluZCggZXZlbnQudGFyZ2V0LCAnZXJyb3InLCB0aGlzICk7XG4gIH07XG5cbiAgLy8gLS0tLS0gIC0tLS0tIC8vXG5cbiAgcmV0dXJuIEltYWdlc0xvYWRlZDtcblxufSk7XG4iLCIvKiFcbiAqIElzb3RvcGUgUEFDS0FHRUQgdjIuMS4xXG4gKiBGaWx0ZXIgJiBzb3J0IG1hZ2ljYWwgbGF5b3V0c1xuICogaHR0cDovL2lzb3RvcGUubWV0YWZpenp5LmNvXG4gKi9cblxuKGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoKXt9ZnVuY3Rpb24gaSh0KXtmdW5jdGlvbiBpKGUpe2UucHJvdG90eXBlLm9wdGlvbnx8KGUucHJvdG90eXBlLm9wdGlvbj1mdW5jdGlvbihlKXt0LmlzUGxhaW5PYmplY3QoZSkmJih0aGlzLm9wdGlvbnM9dC5leHRlbmQoITAsdGhpcy5vcHRpb25zLGUpKX0pfWZ1bmN0aW9uIG4oZSxpKXt0LmZuW2VdPWZ1bmN0aW9uKG4pe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuKXtmb3IodmFyIHM9by5jYWxsKGFyZ3VtZW50cywxKSxhPTAsdT10aGlzLmxlbmd0aDt1PmE7YSsrKXt2YXIgcD10aGlzW2FdLGg9dC5kYXRhKHAsZSk7aWYoaClpZih0LmlzRnVuY3Rpb24oaFtuXSkmJlwiX1wiIT09bi5jaGFyQXQoMCkpe3ZhciBmPWhbbl0uYXBwbHkoaCxzKTtpZih2b2lkIDAhPT1mKXJldHVybiBmfWVsc2UgcihcIm5vIHN1Y2ggbWV0aG9kICdcIituK1wiJyBmb3IgXCIrZStcIiBpbnN0YW5jZVwiKTtlbHNlIHIoXCJjYW5ub3QgY2FsbCBtZXRob2RzIG9uIFwiK2UrXCIgcHJpb3IgdG8gaW5pdGlhbGl6YXRpb247IFwiK1wiYXR0ZW1wdGVkIHRvIGNhbGwgJ1wiK24rXCInXCIpfXJldHVybiB0aGlzfXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbz10LmRhdGEodGhpcyxlKTtvPyhvLm9wdGlvbihuKSxvLl9pbml0KCkpOihvPW5ldyBpKHRoaXMsbiksdC5kYXRhKHRoaXMsZSxvKSl9KX19aWYodCl7dmFyIHI9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGNvbnNvbGU/ZTpmdW5jdGlvbih0KXtjb25zb2xlLmVycm9yKHQpfTtyZXR1cm4gdC5icmlkZ2V0PWZ1bmN0aW9uKHQsZSl7aShlKSxuKHQsZSl9LHQuYnJpZGdldH19dmFyIG89QXJyYXkucHJvdG90eXBlLnNsaWNlO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJqcXVlcnktYnJpZGdldC9qcXVlcnkuYnJpZGdldFwiLFtcImpxdWVyeVwiXSxpKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9pKHJlcXVpcmUoXCJqcXVlcnlcIikpOmkodC5qUXVlcnkpfSkod2luZG93KSxmdW5jdGlvbih0KXtmdW5jdGlvbiBlKGUpe3ZhciBpPXQuZXZlbnQ7cmV0dXJuIGkudGFyZ2V0PWkudGFyZ2V0fHxpLnNyY0VsZW1lbnR8fGUsaX12YXIgaT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsbz1mdW5jdGlvbigpe307aS5hZGRFdmVudExpc3RlbmVyP289ZnVuY3Rpb24odCxlLGkpe3QuYWRkRXZlbnRMaXN0ZW5lcihlLGksITEpfTppLmF0dGFjaEV2ZW50JiYobz1mdW5jdGlvbih0LGksbyl7dFtpK29dPW8uaGFuZGxlRXZlbnQ/ZnVuY3Rpb24oKXt2YXIgaT1lKHQpO28uaGFuZGxlRXZlbnQuY2FsbChvLGkpfTpmdW5jdGlvbigpe3ZhciBpPWUodCk7by5jYWxsKHQsaSl9LHQuYXR0YWNoRXZlbnQoXCJvblwiK2ksdFtpK29dKX0pO3ZhciBuPWZ1bmN0aW9uKCl7fTtpLnJlbW92ZUV2ZW50TGlzdGVuZXI/bj1mdW5jdGlvbih0LGUsaSl7dC5yZW1vdmVFdmVudExpc3RlbmVyKGUsaSwhMSl9OmkuZGV0YWNoRXZlbnQmJihuPWZ1bmN0aW9uKHQsZSxpKXt0LmRldGFjaEV2ZW50KFwib25cIitlLHRbZStpXSk7dHJ5e2RlbGV0ZSB0W2UraV19Y2F0Y2gobyl7dFtlK2ldPXZvaWQgMH19KTt2YXIgcj17YmluZDpvLHVuYmluZDpufTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRpZS9ldmVudGllXCIscik6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9cjp0LmV2ZW50aWU9cn0odGhpcyksZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYoZS5pc1JlYWR5P3QoKTpzLnB1c2godCkpfWZ1bmN0aW9uIGkodCl7dmFyIGk9XCJyZWFkeXN0YXRlY2hhbmdlXCI9PT10LnR5cGUmJlwiY29tcGxldGVcIiE9PXIucmVhZHlTdGF0ZTtlLmlzUmVhZHl8fGl8fG8oKX1mdW5jdGlvbiBvKCl7ZS5pc1JlYWR5PSEwO2Zvcih2YXIgdD0wLGk9cy5sZW5ndGg7aT50O3QrKyl7dmFyIG89c1t0XTtvKCl9fWZ1bmN0aW9uIG4obil7cmV0dXJuXCJjb21wbGV0ZVwiPT09ci5yZWFkeVN0YXRlP28oKToobi5iaW5kKHIsXCJET01Db250ZW50TG9hZGVkXCIsaSksbi5iaW5kKHIsXCJyZWFkeXN0YXRlY2hhbmdlXCIsaSksbi5iaW5kKHQsXCJsb2FkXCIsaSkpLGV9dmFyIHI9dC5kb2N1bWVudCxzPVtdO2UuaXNSZWFkeT0hMSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZG9jLXJlYWR5L2RvYy1yZWFkeVwiLFtcImV2ZW50aWUvZXZlbnRpZVwiXSxuKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1uKHJlcXVpcmUoXCJldmVudGllXCIpKTp0LmRvY1JlYWR5PW4odC5ldmVudGllKX0od2luZG93KSxmdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXt9ZnVuY3Rpb24gZSh0LGUpe2Zvcih2YXIgaT10Lmxlbmd0aDtpLS07KWlmKHRbaV0ubGlzdGVuZXI9PT1lKXJldHVybiBpO3JldHVybi0xfWZ1bmN0aW9uIGkodCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbdF0uYXBwbHkodGhpcyxhcmd1bWVudHMpfX12YXIgbz10LnByb3RvdHlwZSxuPXRoaXMscj1uLkV2ZW50RW1pdHRlcjtvLmdldExpc3RlbmVycz1mdW5jdGlvbih0KXt2YXIgZSxpLG89dGhpcy5fZ2V0RXZlbnRzKCk7aWYodCBpbnN0YW5jZW9mIFJlZ0V4cCl7ZT17fTtmb3IoaSBpbiBvKW8uaGFzT3duUHJvcGVydHkoaSkmJnQudGVzdChpKSYmKGVbaV09b1tpXSl9ZWxzZSBlPW9bdF18fChvW3RdPVtdKTtyZXR1cm4gZX0sby5mbGF0dGVuTGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3ZhciBlLGk9W107Zm9yKGU9MDt0Lmxlbmd0aD5lO2UrPTEpaS5wdXNoKHRbZV0ubGlzdGVuZXIpO3JldHVybiBpfSxvLmdldExpc3RlbmVyc0FzT2JqZWN0PWZ1bmN0aW9uKHQpe3ZhciBlLGk9dGhpcy5nZXRMaXN0ZW5lcnModCk7cmV0dXJuIGkgaW5zdGFuY2VvZiBBcnJheSYmKGU9e30sZVt0XT1pKSxlfHxpfSxvLmFkZExpc3RlbmVyPWZ1bmN0aW9uKHQsaSl7dmFyIG8sbj10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KHQpLHI9XCJvYmplY3RcIj09dHlwZW9mIGk7Zm9yKG8gaW4gbiluLmhhc093blByb3BlcnR5KG8pJiYtMT09PWUobltvXSxpKSYmbltvXS5wdXNoKHI/aTp7bGlzdGVuZXI6aSxvbmNlOiExfSk7cmV0dXJuIHRoaXN9LG8ub249aShcImFkZExpc3RlbmVyXCIpLG8uYWRkT25jZUxpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIodCx7bGlzdGVuZXI6ZSxvbmNlOiEwfSl9LG8ub25jZT1pKFwiYWRkT25jZUxpc3RlbmVyXCIpLG8uZGVmaW5lRXZlbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZ2V0TGlzdGVuZXJzKHQpLHRoaXN9LG8uZGVmaW5lRXZlbnRzPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0wO3QubGVuZ3RoPmU7ZSs9MSl0aGlzLmRlZmluZUV2ZW50KHRbZV0pO3JldHVybiB0aGlzfSxvLnJlbW92ZUxpc3RlbmVyPWZ1bmN0aW9uKHQsaSl7dmFyIG8sbixyPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QodCk7Zm9yKG4gaW4gcilyLmhhc093blByb3BlcnR5KG4pJiYobz1lKHJbbl0saSksLTEhPT1vJiZyW25dLnNwbGljZShvLDEpKTtyZXR1cm4gdGhpc30sby5vZmY9aShcInJlbW92ZUxpc3RlbmVyXCIpLG8uYWRkTGlzdGVuZXJzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMSx0LGUpfSxvLnJlbW92ZUxpc3RlbmVycz1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITAsdCxlKX0sby5tYW5pcHVsYXRlTGlzdGVuZXJzPWZ1bmN0aW9uKHQsZSxpKXt2YXIgbyxuLHI9dD90aGlzLnJlbW92ZUxpc3RlbmVyOnRoaXMuYWRkTGlzdGVuZXIscz10P3RoaXMucmVtb3ZlTGlzdGVuZXJzOnRoaXMuYWRkTGlzdGVuZXJzO2lmKFwib2JqZWN0XCIhPXR5cGVvZiBlfHxlIGluc3RhbmNlb2YgUmVnRXhwKWZvcihvPWkubGVuZ3RoO28tLTspci5jYWxsKHRoaXMsZSxpW29dKTtlbHNlIGZvcihvIGluIGUpZS5oYXNPd25Qcm9wZXJ0eShvKSYmKG49ZVtvXSkmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP3IuY2FsbCh0aGlzLG8sbik6cy5jYWxsKHRoaXMsbyxuKSk7cmV0dXJuIHRoaXN9LG8ucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24odCl7dmFyIGUsaT10eXBlb2YgdCxvPXRoaXMuX2dldEV2ZW50cygpO2lmKFwic3RyaW5nXCI9PT1pKWRlbGV0ZSBvW3RdO2Vsc2UgaWYodCBpbnN0YW5jZW9mIFJlZ0V4cClmb3IoZSBpbiBvKW8uaGFzT3duUHJvcGVydHkoZSkmJnQudGVzdChlKSYmZGVsZXRlIG9bZV07ZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzO3JldHVybiB0aGlzfSxvLnJlbW92ZUFsbExpc3RlbmVycz1pKFwicmVtb3ZlRXZlbnRcIiksby5lbWl0RXZlbnQ9ZnVuY3Rpb24odCxlKXt2YXIgaSxvLG4scixzPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QodCk7Zm9yKG4gaW4gcylpZihzLmhhc093blByb3BlcnR5KG4pKWZvcihvPXNbbl0ubGVuZ3RoO28tLTspaT1zW25dW29dLGkub25jZT09PSEwJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKHQsaS5saXN0ZW5lcikscj1pLmxpc3RlbmVyLmFwcGx5KHRoaXMsZXx8W10pLHI9PT10aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSYmdGhpcy5yZW1vdmVMaXN0ZW5lcih0LGkubGlzdGVuZXIpO3JldHVybiB0aGlzfSxvLnRyaWdnZXI9aShcImVtaXRFdmVudFwiKSxvLmVtaXQ9ZnVuY3Rpb24odCl7dmFyIGU9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiB0aGlzLmVtaXRFdmVudCh0LGUpfSxvLnNldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlPXQsdGhpc30sby5fZ2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoXCJfb25jZVJldHVyblZhbHVlXCIpP3RoaXMuX29uY2VSZXR1cm5WYWx1ZTohMH0sby5fZ2V0RXZlbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz17fSl9LHQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBuLkV2ZW50RW1pdHRlcj1yLHR9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gdH0pOlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPXQ6bi5FdmVudEVtaXR0ZXI9dH0uY2FsbCh0aGlzKSxmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQpe2lmKHQpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBvW3RdKXJldHVybiB0O3Q9dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSt0LnNsaWNlKDEpO2Zvcih2YXIgZSxuPTAscj1pLmxlbmd0aDtyPm47bisrKWlmKGU9aVtuXSt0LFwic3RyaW5nXCI9PXR5cGVvZiBvW2VdKXJldHVybiBlfX12YXIgaT1cIldlYmtpdCBNb3ogbXMgTXMgT1wiLnNwbGl0KFwiIFwiKSxvPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZ2V0LXN0eWxlLXByb3BlcnR5L2dldC1zdHlsZS1wcm9wZXJ0eVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lOnQuZ2V0U3R5bGVQcm9wZXJ0eT1lfSh3aW5kb3cpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7dmFyIGU9cGFyc2VGbG9hdCh0KSxpPS0xPT09dC5pbmRleE9mKFwiJVwiKSYmIWlzTmFOKGUpO3JldHVybiBpJiZlfWZ1bmN0aW9uIGkoKXt9ZnVuY3Rpb24gbygpe2Zvcih2YXIgdD17d2lkdGg6MCxoZWlnaHQ6MCxpbm5lcldpZHRoOjAsaW5uZXJIZWlnaHQ6MCxvdXRlcldpZHRoOjAsb3V0ZXJIZWlnaHQ6MH0sZT0wLGk9cy5sZW5ndGg7aT5lO2UrKyl7dmFyIG89c1tlXTt0W29dPTB9cmV0dXJuIHR9ZnVuY3Rpb24gbihpKXtmdW5jdGlvbiBuKCl7aWYoIWQpe2Q9ITA7dmFyIG89dC5nZXRDb21wdXRlZFN0eWxlO2lmKHA9ZnVuY3Rpb24oKXt2YXIgdD1vP2Z1bmN0aW9uKHQpe3JldHVybiBvKHQsbnVsbCl9OmZ1bmN0aW9uKHQpe3JldHVybiB0LmN1cnJlbnRTdHlsZX07cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBpPXQoZSk7cmV0dXJuIGl8fHIoXCJTdHlsZSByZXR1cm5lZCBcIitpK1wiLiBBcmUgeW91IHJ1bm5pbmcgdGhpcyBjb2RlIGluIGEgaGlkZGVuIGlmcmFtZSBvbiBGaXJlZm94PyBcIitcIlNlZSBodHRwOi8vYml0Lmx5L2dldHNpemVidWcxXCIpLGl9fSgpLGg9aShcImJveFNpemluZ1wiKSl7dmFyIG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtuLnN0eWxlLndpZHRoPVwiMjAwcHhcIixuLnN0eWxlLnBhZGRpbmc9XCIxcHggMnB4IDNweCA0cHhcIixuLnN0eWxlLmJvcmRlclN0eWxlPVwic29saWRcIixuLnN0eWxlLmJvcmRlcldpZHRoPVwiMXB4IDJweCAzcHggNHB4XCIsbi5zdHlsZVtoXT1cImJvcmRlci1ib3hcIjt2YXIgcz1kb2N1bWVudC5ib2R5fHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7cy5hcHBlbmRDaGlsZChuKTt2YXIgYT1wKG4pO2Y9MjAwPT09ZShhLndpZHRoKSxzLnJlbW92ZUNoaWxkKG4pfX19ZnVuY3Rpb24gYSh0KXtpZihuKCksXCJzdHJpbmdcIj09dHlwZW9mIHQmJih0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodCkpLHQmJlwib2JqZWN0XCI9PXR5cGVvZiB0JiZ0Lm5vZGVUeXBlKXt2YXIgaT1wKHQpO2lmKFwibm9uZVwiPT09aS5kaXNwbGF5KXJldHVybiBvKCk7dmFyIHI9e307ci53aWR0aD10Lm9mZnNldFdpZHRoLHIuaGVpZ2h0PXQub2Zmc2V0SGVpZ2h0O2Zvcih2YXIgYT1yLmlzQm9yZGVyQm94PSEoIWh8fCFpW2hdfHxcImJvcmRlci1ib3hcIiE9PWlbaF0pLGQ9MCxsPXMubGVuZ3RoO2w+ZDtkKyspe3ZhciBjPXNbZF0seT1pW2NdO3k9dSh0LHkpO3ZhciBtPXBhcnNlRmxvYXQoeSk7cltjXT1pc05hTihtKT8wOm19dmFyIGc9ci5wYWRkaW5nTGVmdCtyLnBhZGRpbmdSaWdodCx2PXIucGFkZGluZ1RvcCtyLnBhZGRpbmdCb3R0b20sXz1yLm1hcmdpbkxlZnQrci5tYXJnaW5SaWdodCxJPXIubWFyZ2luVG9wK3IubWFyZ2luQm90dG9tLEw9ci5ib3JkZXJMZWZ0V2lkdGgrci5ib3JkZXJSaWdodFdpZHRoLHo9ci5ib3JkZXJUb3BXaWR0aCtyLmJvcmRlckJvdHRvbVdpZHRoLGI9YSYmZix4PWUoaS53aWR0aCk7eCE9PSExJiYoci53aWR0aD14KyhiPzA6ZytMKSk7dmFyIFM9ZShpLmhlaWdodCk7cmV0dXJuIFMhPT0hMSYmKHIuaGVpZ2h0PVMrKGI/MDp2K3opKSxyLmlubmVyV2lkdGg9ci53aWR0aC0oZytMKSxyLmlubmVySGVpZ2h0PXIuaGVpZ2h0LSh2K3opLHIub3V0ZXJXaWR0aD1yLndpZHRoK18sci5vdXRlckhlaWdodD1yLmhlaWdodCtJLHJ9fWZ1bmN0aW9uIHUoZSxpKXtpZih0LmdldENvbXB1dGVkU3R5bGV8fC0xPT09aS5pbmRleE9mKFwiJVwiKSlyZXR1cm4gaTt2YXIgbz1lLnN0eWxlLG49by5sZWZ0LHI9ZS5ydW50aW1lU3R5bGUscz1yJiZyLmxlZnQ7cmV0dXJuIHMmJihyLmxlZnQ9ZS5jdXJyZW50U3R5bGUubGVmdCksby5sZWZ0PWksaT1vLnBpeGVsTGVmdCxvLmxlZnQ9bixzJiYoci5sZWZ0PXMpLGl9dmFyIHAsaCxmLGQ9ITE7cmV0dXJuIGF9dmFyIHI9XCJ1bmRlZmluZWRcIj09dHlwZW9mIGNvbnNvbGU/aTpmdW5jdGlvbih0KXtjb25zb2xlLmVycm9yKHQpfSxzPVtcInBhZGRpbmdMZWZ0XCIsXCJwYWRkaW5nUmlnaHRcIixcInBhZGRpbmdUb3BcIixcInBhZGRpbmdCb3R0b21cIixcIm1hcmdpbkxlZnRcIixcIm1hcmdpblJpZ2h0XCIsXCJtYXJnaW5Ub3BcIixcIm1hcmdpbkJvdHRvbVwiLFwiYm9yZGVyTGVmdFdpZHRoXCIsXCJib3JkZXJSaWdodFdpZHRoXCIsXCJib3JkZXJUb3BXaWR0aFwiLFwiYm9yZGVyQm90dG9tV2lkdGhcIl07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImdldC1zaXplL2dldC1zaXplXCIsW1wiZ2V0LXN0eWxlLXByb3BlcnR5L2dldC1zdHlsZS1wcm9wZXJ0eVwiXSxuKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1uKHJlcXVpcmUoXCJkZXNhbmRyby1nZXQtc3R5bGUtcHJvcGVydHlcIikpOnQuZ2V0U2l6ZT1uKHQuZ2V0U3R5bGVQcm9wZXJ0eSl9KHdpbmRvdyksZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LGUpe3JldHVybiB0W3NdKGUpfWZ1bmN0aW9uIGkodCl7aWYoIXQucGFyZW50Tm9kZSl7dmFyIGU9ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO2UuYXBwZW5kQ2hpbGQodCl9fWZ1bmN0aW9uIG8odCxlKXtpKHQpO2Zvcih2YXIgbz10LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChlKSxuPTAscj1vLmxlbmd0aDtyPm47bisrKWlmKG9bbl09PT10KXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIG4odCxvKXtyZXR1cm4gaSh0KSxlKHQsbyl9dmFyIHIscz1mdW5jdGlvbigpe2lmKHQubWF0Y2hlc1NlbGVjdG9yKXJldHVyblwibWF0Y2hlc1NlbGVjdG9yXCI7Zm9yKHZhciBlPVtcIndlYmtpdFwiLFwibW96XCIsXCJtc1wiLFwib1wiXSxpPTAsbz1lLmxlbmd0aDtvPmk7aSsrKXt2YXIgbj1lW2ldLHI9bitcIk1hdGNoZXNTZWxlY3RvclwiO2lmKHRbcl0pcmV0dXJuIHJ9fSgpO2lmKHMpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdT1lKGEsXCJkaXZcIik7cj11P2U6bn1lbHNlIHI9bztcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwibWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gcn0pOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPXI6d2luZG93Lm1hdGNoZXNTZWxlY3Rvcj1yfShFbGVtZW50LnByb3RvdHlwZSksZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LGUpe2Zvcih2YXIgaSBpbiBlKXRbaV09ZVtpXTtyZXR1cm4gdH1mdW5jdGlvbiBpKHQpe2Zvcih2YXIgZSBpbiB0KXJldHVybiExO3JldHVybiBlPW51bGwsITB9ZnVuY3Rpb24gbyh0KXtyZXR1cm4gdC5yZXBsYWNlKC8oW0EtWl0pL2csZnVuY3Rpb24odCl7cmV0dXJuXCItXCIrdC50b0xvd2VyQ2FzZSgpfSl9ZnVuY3Rpb24gbih0LG4scil7ZnVuY3Rpb24gYSh0LGUpe3QmJih0aGlzLmVsZW1lbnQ9dCx0aGlzLmxheW91dD1lLHRoaXMucG9zaXRpb249e3g6MCx5OjB9LHRoaXMuX2NyZWF0ZSgpKX12YXIgdT1yKFwidHJhbnNpdGlvblwiKSxwPXIoXCJ0cmFuc2Zvcm1cIiksaD11JiZwLGY9ISFyKFwicGVyc3BlY3RpdmVcIiksZD17V2Via2l0VHJhbnNpdGlvbjpcIndlYmtpdFRyYW5zaXRpb25FbmRcIixNb3pUcmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLE9UcmFuc2l0aW9uOlwib3RyYW5zaXRpb25lbmRcIix0cmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwifVt1XSxsPVtcInRyYW5zZm9ybVwiLFwidHJhbnNpdGlvblwiLFwidHJhbnNpdGlvbkR1cmF0aW9uXCIsXCJ0cmFuc2l0aW9uUHJvcGVydHlcIl0sYz1mdW5jdGlvbigpe2Zvcih2YXIgdD17fSxlPTAsaT1sLmxlbmd0aDtpPmU7ZSsrKXt2YXIgbz1sW2VdLG49cihvKTtuJiZuIT09byYmKHRbb109bil9cmV0dXJuIHR9KCk7ZShhLnByb3RvdHlwZSx0LnByb3RvdHlwZSksYS5wcm90b3R5cGUuX2NyZWF0ZT1mdW5jdGlvbigpe3RoaXMuX3RyYW5zbj17aW5nUHJvcGVydGllczp7fSxjbGVhbjp7fSxvbkVuZDp7fX0sdGhpcy5jc3Moe3Bvc2l0aW9uOlwiYWJzb2x1dGVcIn0pfSxhLnByb3RvdHlwZS5oYW5kbGVFdmVudD1mdW5jdGlvbih0KXt2YXIgZT1cIm9uXCIrdC50eXBlO3RoaXNbZV0mJnRoaXNbZV0odCl9LGEucHJvdG90eXBlLmdldFNpemU9ZnVuY3Rpb24oKXt0aGlzLnNpemU9bih0aGlzLmVsZW1lbnQpfSxhLnByb3RvdHlwZS5jc3M9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5lbGVtZW50LnN0eWxlO2Zvcih2YXIgaSBpbiB0KXt2YXIgbz1jW2ldfHxpO2Vbb109dFtpXX19LGEucHJvdG90eXBlLmdldFBvc2l0aW9uPWZ1bmN0aW9uKCl7dmFyIHQ9cyh0aGlzLmVsZW1lbnQpLGU9dGhpcy5sYXlvdXQub3B0aW9ucyxpPWUuaXNPcmlnaW5MZWZ0LG89ZS5pc09yaWdpblRvcCxuPXBhcnNlSW50KHRbaT9cImxlZnRcIjpcInJpZ2h0XCJdLDEwKSxyPXBhcnNlSW50KHRbbz9cInRvcFwiOlwiYm90dG9tXCJdLDEwKTtuPWlzTmFOKG4pPzA6bixyPWlzTmFOKHIpPzA6cjt2YXIgYT10aGlzLmxheW91dC5zaXplO24tPWk/YS5wYWRkaW5nTGVmdDphLnBhZGRpbmdSaWdodCxyLT1vP2EucGFkZGluZ1RvcDphLnBhZGRpbmdCb3R0b20sdGhpcy5wb3NpdGlvbi54PW4sdGhpcy5wb3NpdGlvbi55PXJ9LGEucHJvdG90eXBlLmxheW91dFBvc2l0aW9uPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5sYXlvdXQuc2l6ZSxlPXRoaXMubGF5b3V0Lm9wdGlvbnMsaT17fTtlLmlzT3JpZ2luTGVmdD8oaS5sZWZ0PXRoaXMucG9zaXRpb24ueCt0LnBhZGRpbmdMZWZ0K1wicHhcIixpLnJpZ2h0PVwiXCIpOihpLnJpZ2h0PXRoaXMucG9zaXRpb24ueCt0LnBhZGRpbmdSaWdodCtcInB4XCIsaS5sZWZ0PVwiXCIpLGUuaXNPcmlnaW5Ub3A/KGkudG9wPXRoaXMucG9zaXRpb24ueSt0LnBhZGRpbmdUb3ArXCJweFwiLGkuYm90dG9tPVwiXCIpOihpLmJvdHRvbT10aGlzLnBvc2l0aW9uLnkrdC5wYWRkaW5nQm90dG9tK1wicHhcIixpLnRvcD1cIlwiKSx0aGlzLmNzcyhpKSx0aGlzLmVtaXRFdmVudChcImxheW91dFwiLFt0aGlzXSl9O3ZhciB5PWY/ZnVuY3Rpb24odCxlKXtyZXR1cm5cInRyYW5zbGF0ZTNkKFwiK3QrXCJweCwgXCIrZStcInB4LCAwKVwifTpmdW5jdGlvbih0LGUpe3JldHVyblwidHJhbnNsYXRlKFwiK3QrXCJweCwgXCIrZStcInB4KVwifTthLnByb3RvdHlwZS5fdHJhbnNpdGlvblRvPWZ1bmN0aW9uKHQsZSl7dGhpcy5nZXRQb3NpdGlvbigpO3ZhciBpPXRoaXMucG9zaXRpb24ueCxvPXRoaXMucG9zaXRpb24ueSxuPXBhcnNlSW50KHQsMTApLHI9cGFyc2VJbnQoZSwxMCkscz1uPT09dGhpcy5wb3NpdGlvbi54JiZyPT09dGhpcy5wb3NpdGlvbi55O2lmKHRoaXMuc2V0UG9zaXRpb24odCxlKSxzJiYhdGhpcy5pc1RyYW5zaXRpb25pbmcpcmV0dXJuIHRoaXMubGF5b3V0UG9zaXRpb24oKSx2b2lkIDA7dmFyIGE9dC1pLHU9ZS1vLHA9e30saD10aGlzLmxheW91dC5vcHRpb25zO2E9aC5pc09yaWdpbkxlZnQ/YTotYSx1PWguaXNPcmlnaW5Ub3A/dTotdSxwLnRyYW5zZm9ybT15KGEsdSksdGhpcy50cmFuc2l0aW9uKHt0bzpwLG9uVHJhbnNpdGlvbkVuZDp7dHJhbnNmb3JtOnRoaXMubGF5b3V0UG9zaXRpb259LGlzQ2xlYW5pbmc6ITB9KX0sYS5wcm90b3R5cGUuZ29Ubz1mdW5jdGlvbih0LGUpe3RoaXMuc2V0UG9zaXRpb24odCxlKSx0aGlzLmxheW91dFBvc2l0aW9uKCl9LGEucHJvdG90eXBlLm1vdmVUbz1oP2EucHJvdG90eXBlLl90cmFuc2l0aW9uVG86YS5wcm90b3R5cGUuZ29UbyxhLnByb3RvdHlwZS5zZXRQb3NpdGlvbj1mdW5jdGlvbih0LGUpe3RoaXMucG9zaXRpb24ueD1wYXJzZUludCh0LDEwKSx0aGlzLnBvc2l0aW9uLnk9cGFyc2VJbnQoZSwxMCl9LGEucHJvdG90eXBlLl9ub25UcmFuc2l0aW9uPWZ1bmN0aW9uKHQpe3RoaXMuY3NzKHQudG8pLHQuaXNDbGVhbmluZyYmdGhpcy5fcmVtb3ZlU3R5bGVzKHQudG8pO2Zvcih2YXIgZSBpbiB0Lm9uVHJhbnNpdGlvbkVuZCl0Lm9uVHJhbnNpdGlvbkVuZFtlXS5jYWxsKHRoaXMpfSxhLnByb3RvdHlwZS5fdHJhbnNpdGlvbj1mdW5jdGlvbih0KXtpZighcGFyc2VGbG9hdCh0aGlzLmxheW91dC5vcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbikpcmV0dXJuIHRoaXMuX25vblRyYW5zaXRpb24odCksdm9pZCAwO3ZhciBlPXRoaXMuX3RyYW5zbjtmb3IodmFyIGkgaW4gdC5vblRyYW5zaXRpb25FbmQpZS5vbkVuZFtpXT10Lm9uVHJhbnNpdGlvbkVuZFtpXTtmb3IoaSBpbiB0LnRvKWUuaW5nUHJvcGVydGllc1tpXT0hMCx0LmlzQ2xlYW5pbmcmJihlLmNsZWFuW2ldPSEwKTtpZih0LmZyb20pe3RoaXMuY3NzKHQuZnJvbSk7dmFyIG89dGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtvPW51bGx9dGhpcy5lbmFibGVUcmFuc2l0aW9uKHQudG8pLHRoaXMuY3NzKHQudG8pLHRoaXMuaXNUcmFuc2l0aW9uaW5nPSEwfTt2YXIgbT1wJiZvKHApK1wiLG9wYWNpdHlcIjthLnByb3RvdHlwZS5lbmFibGVUcmFuc2l0aW9uPWZ1bmN0aW9uKCl7dGhpcy5pc1RyYW5zaXRpb25pbmd8fCh0aGlzLmNzcyh7dHJhbnNpdGlvblByb3BlcnR5Om0sdHJhbnNpdGlvbkR1cmF0aW9uOnRoaXMubGF5b3V0Lm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9ufSksdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZCx0aGlzLCExKSl9LGEucHJvdG90eXBlLnRyYW5zaXRpb249YS5wcm90b3R5cGVbdT9cIl90cmFuc2l0aW9uXCI6XCJfbm9uVHJhbnNpdGlvblwiXSxhLnByb3RvdHlwZS5vbndlYmtpdFRyYW5zaXRpb25FbmQ9ZnVuY3Rpb24odCl7dGhpcy5vbnRyYW5zaXRpb25lbmQodCl9LGEucHJvdG90eXBlLm9ub3RyYW5zaXRpb25lbmQ9ZnVuY3Rpb24odCl7dGhpcy5vbnRyYW5zaXRpb25lbmQodCl9O3ZhciBnPXtcIi13ZWJraXQtdHJhbnNmb3JtXCI6XCJ0cmFuc2Zvcm1cIixcIi1tb3otdHJhbnNmb3JtXCI6XCJ0cmFuc2Zvcm1cIixcIi1vLXRyYW5zZm9ybVwiOlwidHJhbnNmb3JtXCJ9O2EucHJvdG90eXBlLm9udHJhbnNpdGlvbmVuZD1mdW5jdGlvbih0KXtpZih0LnRhcmdldD09PXRoaXMuZWxlbWVudCl7dmFyIGU9dGhpcy5fdHJhbnNuLG89Z1t0LnByb3BlcnR5TmFtZV18fHQucHJvcGVydHlOYW1lO2lmKGRlbGV0ZSBlLmluZ1Byb3BlcnRpZXNbb10saShlLmluZ1Byb3BlcnRpZXMpJiZ0aGlzLmRpc2FibGVUcmFuc2l0aW9uKCksbyBpbiBlLmNsZWFuJiYodGhpcy5lbGVtZW50LnN0eWxlW3QucHJvcGVydHlOYW1lXT1cIlwiLGRlbGV0ZSBlLmNsZWFuW29dKSxvIGluIGUub25FbmQpe3ZhciBuPWUub25FbmRbb107bi5jYWxsKHRoaXMpLGRlbGV0ZSBlLm9uRW5kW29dfXRoaXMuZW1pdEV2ZW50KFwidHJhbnNpdGlvbkVuZFwiLFt0aGlzXSl9fSxhLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbj1mdW5jdGlvbigpe3RoaXMucmVtb3ZlVHJhbnNpdGlvblN0eWxlcygpLHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGQsdGhpcywhMSksdGhpcy5pc1RyYW5zaXRpb25pbmc9ITF9LGEucHJvdG90eXBlLl9yZW1vdmVTdHlsZXM9ZnVuY3Rpb24odCl7dmFyIGU9e307Zm9yKHZhciBpIGluIHQpZVtpXT1cIlwiO3RoaXMuY3NzKGUpfTt2YXIgdj17dHJhbnNpdGlvblByb3BlcnR5OlwiXCIsdHJhbnNpdGlvbkR1cmF0aW9uOlwiXCJ9O3JldHVybiBhLnByb3RvdHlwZS5yZW1vdmVUcmFuc2l0aW9uU3R5bGVzPWZ1bmN0aW9uKCl7dGhpcy5jc3Modil9LGEucHJvdG90eXBlLnJlbW92ZUVsZW09ZnVuY3Rpb24oKXt0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpLHRoaXMuZW1pdEV2ZW50KFwicmVtb3ZlXCIsW3RoaXNdKX0sYS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKCl7aWYoIXV8fCFwYXJzZUZsb2F0KHRoaXMubGF5b3V0Lm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uKSlyZXR1cm4gdGhpcy5yZW1vdmVFbGVtKCksdm9pZCAwO3ZhciB0PXRoaXM7dGhpcy5vbihcInRyYW5zaXRpb25FbmRcIixmdW5jdGlvbigpe3JldHVybiB0LnJlbW92ZUVsZW0oKSwhMH0pLHRoaXMuaGlkZSgpfSxhLnByb3RvdHlwZS5yZXZlYWw9ZnVuY3Rpb24oKXtkZWxldGUgdGhpcy5pc0hpZGRlbix0aGlzLmNzcyh7ZGlzcGxheTpcIlwifSk7dmFyIHQ9dGhpcy5sYXlvdXQub3B0aW9uczt0aGlzLnRyYW5zaXRpb24oe2Zyb206dC5oaWRkZW5TdHlsZSx0bzp0LnZpc2libGVTdHlsZSxpc0NsZWFuaW5nOiEwfSl9LGEucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXt0aGlzLmlzSGlkZGVuPSEwLHRoaXMuY3NzKHtkaXNwbGF5OlwiXCJ9KTt2YXIgdD10aGlzLmxheW91dC5vcHRpb25zO3RoaXMudHJhbnNpdGlvbih7ZnJvbTp0LnZpc2libGVTdHlsZSx0bzp0LmhpZGRlblN0eWxlLGlzQ2xlYW5pbmc6ITAsb25UcmFuc2l0aW9uRW5kOntvcGFjaXR5OmZ1bmN0aW9uKCl7dGhpcy5pc0hpZGRlbiYmdGhpcy5jc3Moe2Rpc3BsYXk6XCJub25lXCJ9KX19fSl9LGEucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmNzcyh7cG9zaXRpb246XCJcIixsZWZ0OlwiXCIscmlnaHQ6XCJcIix0b3A6XCJcIixib3R0b206XCJcIix0cmFuc2l0aW9uOlwiXCIsdHJhbnNmb3JtOlwiXCJ9KX0sYX12YXIgcj10LmdldENvbXB1dGVkU3R5bGUscz1yP2Z1bmN0aW9uKHQpe3JldHVybiByKHQsbnVsbCl9OmZ1bmN0aW9uKHQpe3JldHVybiB0LmN1cnJlbnRTdHlsZX07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcIm91dGxheWVyL2l0ZW1cIixbXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsXCJnZXQtc2l6ZS9nZXQtc2l6ZVwiLFwiZ2V0LXN0eWxlLXByb3BlcnR5L2dldC1zdHlsZS1wcm9wZXJ0eVwiXSxuKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1uKHJlcXVpcmUoXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiKSxyZXF1aXJlKFwiZ2V0LXNpemVcIikscmVxdWlyZShcImRlc2FuZHJvLWdldC1zdHlsZS1wcm9wZXJ0eVwiKSk6KHQuT3V0bGF5ZXI9e30sdC5PdXRsYXllci5JdGVtPW4odC5FdmVudEVtaXR0ZXIsdC5nZXRTaXplLHQuZ2V0U3R5bGVQcm9wZXJ0eSkpfSh3aW5kb3cpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCxlKXtmb3IodmFyIGkgaW4gZSl0W2ldPWVbaV07cmV0dXJuIHR9ZnVuY3Rpb24gaSh0KXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1mLmNhbGwodCl9ZnVuY3Rpb24gbyh0KXt2YXIgZT1bXTtpZihpKHQpKWU9dDtlbHNlIGlmKHQmJlwibnVtYmVyXCI9PXR5cGVvZiB0Lmxlbmd0aClmb3IodmFyIG89MCxuPXQubGVuZ3RoO24+bztvKyspZS5wdXNoKHRbb10pO2Vsc2UgZS5wdXNoKHQpO3JldHVybiBlfWZ1bmN0aW9uIG4odCxlKXt2YXIgaT1sKGUsdCk7LTEhPT1pJiZlLnNwbGljZShpLDEpfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHQucmVwbGFjZSgvKC4pKFtBLVpdKS9nLGZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gZStcIi1cIitpfSkudG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBzKGkscyxmLGwsYyx5KXtmdW5jdGlvbiBtKHQsaSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJih0PWEucXVlcnlTZWxlY3Rvcih0KSksIXR8fCFkKHQpKXJldHVybiB1JiZ1LmVycm9yKFwiQmFkIFwiK3RoaXMuY29uc3RydWN0b3IubmFtZXNwYWNlK1wiIGVsZW1lbnQ6IFwiK3QpLHZvaWQgMDt0aGlzLmVsZW1lbnQ9dCx0aGlzLm9wdGlvbnM9ZSh7fSx0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRzKSx0aGlzLm9wdGlvbihpKTt2YXIgbz0rK2c7dGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRD1vLHZbb109dGhpcyx0aGlzLl9jcmVhdGUoKSx0aGlzLm9wdGlvbnMuaXNJbml0TGF5b3V0JiZ0aGlzLmxheW91dCgpfXZhciBnPTAsdj17fTtyZXR1cm4gbS5uYW1lc3BhY2U9XCJvdXRsYXllclwiLG0uSXRlbT15LG0uZGVmYXVsdHM9e2NvbnRhaW5lclN0eWxlOntwb3NpdGlvbjpcInJlbGF0aXZlXCJ9LGlzSW5pdExheW91dDohMCxpc09yaWdpbkxlZnQ6ITAsaXNPcmlnaW5Ub3A6ITAsaXNSZXNpemVCb3VuZDohMCxpc1Jlc2l6aW5nQ29udGFpbmVyOiEwLHRyYW5zaXRpb25EdXJhdGlvbjpcIjAuNHNcIixoaWRkZW5TdHlsZTp7b3BhY2l0eTowLHRyYW5zZm9ybTpcInNjYWxlKDAuMDAxKVwifSx2aXNpYmxlU3R5bGU6e29wYWNpdHk6MSx0cmFuc2Zvcm06XCJzY2FsZSgxKVwifX0sZShtLnByb3RvdHlwZSxmLnByb3RvdHlwZSksbS5wcm90b3R5cGUub3B0aW9uPWZ1bmN0aW9uKHQpe2UodGhpcy5vcHRpb25zLHQpfSxtLnByb3RvdHlwZS5fY3JlYXRlPWZ1bmN0aW9uKCl7dGhpcy5yZWxvYWRJdGVtcygpLHRoaXMuc3RhbXBzPVtdLHRoaXMuc3RhbXAodGhpcy5vcHRpb25zLnN0YW1wKSxlKHRoaXMuZWxlbWVudC5zdHlsZSx0aGlzLm9wdGlvbnMuY29udGFpbmVyU3R5bGUpLHRoaXMub3B0aW9ucy5pc1Jlc2l6ZUJvdW5kJiZ0aGlzLmJpbmRSZXNpemUoKX0sbS5wcm90b3R5cGUucmVsb2FkSXRlbXM9ZnVuY3Rpb24oKXt0aGlzLml0ZW1zPXRoaXMuX2l0ZW1pemUodGhpcy5lbGVtZW50LmNoaWxkcmVuKX0sbS5wcm90b3R5cGUuX2l0ZW1pemU9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMuX2ZpbHRlckZpbmRJdGVtRWxlbWVudHModCksaT10aGlzLmNvbnN0cnVjdG9yLkl0ZW0sbz1bXSxuPTAscj1lLmxlbmd0aDtyPm47bisrKXt2YXIgcz1lW25dLGE9bmV3IGkocyx0aGlzKTtvLnB1c2goYSl9cmV0dXJuIG99LG0ucHJvdG90eXBlLl9maWx0ZXJGaW5kSXRlbUVsZW1lbnRzPWZ1bmN0aW9uKHQpe3Q9byh0KTtmb3IodmFyIGU9dGhpcy5vcHRpb25zLml0ZW1TZWxlY3RvcixpPVtdLG49MCxyPXQubGVuZ3RoO3I+bjtuKyspe3ZhciBzPXRbbl07aWYoZChzKSlpZihlKXtjKHMsZSkmJmkucHVzaChzKTtmb3IodmFyIGE9cy5xdWVyeVNlbGVjdG9yQWxsKGUpLHU9MCxwPWEubGVuZ3RoO3A+dTt1KyspaS5wdXNoKGFbdV0pfWVsc2UgaS5wdXNoKHMpfXJldHVybiBpfSxtLnByb3RvdHlwZS5nZXRJdGVtRWxlbWVudHM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9W10sZT0wLGk9dGhpcy5pdGVtcy5sZW5ndGg7aT5lO2UrKyl0LnB1c2godGhpcy5pdGVtc1tlXS5lbGVtZW50KTtyZXR1cm4gdH0sbS5wcm90b3R5cGUubGF5b3V0PWZ1bmN0aW9uKCl7dGhpcy5fcmVzZXRMYXlvdXQoKSx0aGlzLl9tYW5hZ2VTdGFtcHMoKTt2YXIgdD12b2lkIDAhPT10aGlzLm9wdGlvbnMuaXNMYXlvdXRJbnN0YW50P3RoaXMub3B0aW9ucy5pc0xheW91dEluc3RhbnQ6IXRoaXMuX2lzTGF5b3V0SW5pdGVkO3RoaXMubGF5b3V0SXRlbXModGhpcy5pdGVtcyx0KSx0aGlzLl9pc0xheW91dEluaXRlZD0hMH0sbS5wcm90b3R5cGUuX2luaXQ9bS5wcm90b3R5cGUubGF5b3V0LG0ucHJvdG90eXBlLl9yZXNldExheW91dD1mdW5jdGlvbigpe3RoaXMuZ2V0U2l6ZSgpfSxtLnByb3RvdHlwZS5nZXRTaXplPWZ1bmN0aW9uKCl7dGhpcy5zaXplPWwodGhpcy5lbGVtZW50KX0sbS5wcm90b3R5cGUuX2dldE1lYXN1cmVtZW50PWZ1bmN0aW9uKHQsZSl7dmFyIGksbz10aGlzLm9wdGlvbnNbdF07bz8oXCJzdHJpbmdcIj09dHlwZW9mIG8/aT10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihvKTpkKG8pJiYoaT1vKSx0aGlzW3RdPWk/bChpKVtlXTpvKTp0aGlzW3RdPTB9LG0ucHJvdG90eXBlLmxheW91dEl0ZW1zPWZ1bmN0aW9uKHQsZSl7dD10aGlzLl9nZXRJdGVtc0ZvckxheW91dCh0KSx0aGlzLl9sYXlvdXRJdGVtcyh0LGUpLHRoaXMuX3Bvc3RMYXlvdXQoKX0sbS5wcm90b3R5cGUuX2dldEl0ZW1zRm9yTGF5b3V0PWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT1bXSxpPTAsbz10Lmxlbmd0aDtvPmk7aSsrKXt2YXIgbj10W2ldO24uaXNJZ25vcmVkfHxlLnB1c2gobil9cmV0dXJuIGV9LG0ucHJvdG90eXBlLl9sYXlvdXRJdGVtcz1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIGkoKXtvLmVtaXRFdmVudChcImxheW91dENvbXBsZXRlXCIsW28sdF0pfXZhciBvPXRoaXM7aWYoIXR8fCF0Lmxlbmd0aClyZXR1cm4gaSgpLHZvaWQgMDt0aGlzLl9pdGVtc09uKHQsXCJsYXlvdXRcIixpKTtmb3IodmFyIG49W10scj0wLHM9dC5sZW5ndGg7cz5yO3IrKyl7dmFyIGE9dFtyXSx1PXRoaXMuX2dldEl0ZW1MYXlvdXRQb3NpdGlvbihhKTt1Lml0ZW09YSx1LmlzSW5zdGFudD1lfHxhLmlzTGF5b3V0SW5zdGFudCxuLnB1c2godSl9dGhpcy5fcHJvY2Vzc0xheW91dFF1ZXVlKG4pfSxtLnByb3RvdHlwZS5fZ2V0SXRlbUxheW91dFBvc2l0aW9uPWZ1bmN0aW9uKCl7cmV0dXJue3g6MCx5OjB9fSxtLnByb3RvdHlwZS5fcHJvY2Vzc0xheW91dFF1ZXVlPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0wLGk9dC5sZW5ndGg7aT5lO2UrKyl7dmFyIG89dFtlXTt0aGlzLl9wb3NpdGlvbkl0ZW0oby5pdGVtLG8ueCxvLnksby5pc0luc3RhbnQpfX0sbS5wcm90b3R5cGUuX3Bvc2l0aW9uSXRlbT1mdW5jdGlvbih0LGUsaSxvKXtvP3QuZ29UbyhlLGkpOnQubW92ZVRvKGUsaSl9LG0ucHJvdG90eXBlLl9wb3N0TGF5b3V0PWZ1bmN0aW9uKCl7dGhpcy5yZXNpemVDb250YWluZXIoKX0sbS5wcm90b3R5cGUucmVzaXplQ29udGFpbmVyPWZ1bmN0aW9uKCl7aWYodGhpcy5vcHRpb25zLmlzUmVzaXppbmdDb250YWluZXIpe3ZhciB0PXRoaXMuX2dldENvbnRhaW5lclNpemUoKTt0JiYodGhpcy5fc2V0Q29udGFpbmVyTWVhc3VyZSh0LndpZHRoLCEwKSx0aGlzLl9zZXRDb250YWluZXJNZWFzdXJlKHQuaGVpZ2h0LCExKSl9fSxtLnByb3RvdHlwZS5fZ2V0Q29udGFpbmVyU2l6ZT1oLG0ucHJvdG90eXBlLl9zZXRDb250YWluZXJNZWFzdXJlPWZ1bmN0aW9uKHQsZSl7aWYodm9pZCAwIT09dCl7dmFyIGk9dGhpcy5zaXplO2kuaXNCb3JkZXJCb3gmJih0Kz1lP2kucGFkZGluZ0xlZnQraS5wYWRkaW5nUmlnaHQraS5ib3JkZXJMZWZ0V2lkdGgraS5ib3JkZXJSaWdodFdpZHRoOmkucGFkZGluZ0JvdHRvbStpLnBhZGRpbmdUb3AraS5ib3JkZXJUb3BXaWR0aCtpLmJvcmRlckJvdHRvbVdpZHRoKSx0PU1hdGgubWF4KHQsMCksdGhpcy5lbGVtZW50LnN0eWxlW2U/XCJ3aWR0aFwiOlwiaGVpZ2h0XCJdPXQrXCJweFwifX0sbS5wcm90b3R5cGUuX2l0ZW1zT249ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG8oKXtyZXR1cm4gbisrLG49PT1yJiZpLmNhbGwocyksITB9Zm9yKHZhciBuPTAscj10Lmxlbmd0aCxzPXRoaXMsYT0wLHU9dC5sZW5ndGg7dT5hO2ErKyl7dmFyIHA9dFthXTtwLm9uKGUsbyl9fSxtLnByb3RvdHlwZS5pZ25vcmU9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5nZXRJdGVtKHQpO2UmJihlLmlzSWdub3JlZD0hMCl9LG0ucHJvdG90eXBlLnVuaWdub3JlPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuZ2V0SXRlbSh0KTtlJiZkZWxldGUgZS5pc0lnbm9yZWR9LG0ucHJvdG90eXBlLnN0YW1wPWZ1bmN0aW9uKHQpe2lmKHQ9dGhpcy5fZmluZCh0KSl7dGhpcy5zdGFtcHM9dGhpcy5zdGFtcHMuY29uY2F0KHQpO2Zvcih2YXIgZT0wLGk9dC5sZW5ndGg7aT5lO2UrKyl7dmFyIG89dFtlXTt0aGlzLmlnbm9yZShvKX19fSxtLnByb3RvdHlwZS51bnN0YW1wPWZ1bmN0aW9uKHQpe2lmKHQ9dGhpcy5fZmluZCh0KSlmb3IodmFyIGU9MCxpPXQubGVuZ3RoO2k+ZTtlKyspe3ZhciBvPXRbZV07bihvLHRoaXMuc3RhbXBzKSx0aGlzLnVuaWdub3JlKG8pfX0sbS5wcm90b3R5cGUuX2ZpbmQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQ/KFwic3RyaW5nXCI9PXR5cGVvZiB0JiYodD10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0KSksdD1vKHQpKTp2b2lkIDB9LG0ucHJvdG90eXBlLl9tYW5hZ2VTdGFtcHM9ZnVuY3Rpb24oKXtpZih0aGlzLnN0YW1wcyYmdGhpcy5zdGFtcHMubGVuZ3RoKXt0aGlzLl9nZXRCb3VuZGluZ1JlY3QoKTtmb3IodmFyIHQ9MCxlPXRoaXMuc3RhbXBzLmxlbmd0aDtlPnQ7dCsrKXt2YXIgaT10aGlzLnN0YW1wc1t0XTt0aGlzLl9tYW5hZ2VTdGFtcChpKX19fSxtLnByb3RvdHlwZS5fZ2V0Qm91bmRpbmdSZWN0PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLGU9dGhpcy5zaXplO3RoaXMuX2JvdW5kaW5nUmVjdD17bGVmdDp0LmxlZnQrZS5wYWRkaW5nTGVmdCtlLmJvcmRlckxlZnRXaWR0aCx0b3A6dC50b3ArZS5wYWRkaW5nVG9wK2UuYm9yZGVyVG9wV2lkdGgscmlnaHQ6dC5yaWdodC0oZS5wYWRkaW5nUmlnaHQrZS5ib3JkZXJSaWdodFdpZHRoKSxib3R0b206dC5ib3R0b20tKGUucGFkZGluZ0JvdHRvbStlLmJvcmRlckJvdHRvbVdpZHRoKX19LG0ucHJvdG90eXBlLl9tYW5hZ2VTdGFtcD1oLG0ucHJvdG90eXBlLl9nZXRFbGVtZW50T2Zmc2V0PWZ1bmN0aW9uKHQpe3ZhciBlPXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksaT10aGlzLl9ib3VuZGluZ1JlY3Qsbz1sKHQpLG49e2xlZnQ6ZS5sZWZ0LWkubGVmdC1vLm1hcmdpbkxlZnQsdG9wOmUudG9wLWkudG9wLW8ubWFyZ2luVG9wLHJpZ2h0OmkucmlnaHQtZS5yaWdodC1vLm1hcmdpblJpZ2h0LGJvdHRvbTppLmJvdHRvbS1lLmJvdHRvbS1vLm1hcmdpbkJvdHRvbX07cmV0dXJuIG59LG0ucHJvdG90eXBlLmhhbmRsZUV2ZW50PWZ1bmN0aW9uKHQpe3ZhciBlPVwib25cIit0LnR5cGU7dGhpc1tlXSYmdGhpc1tlXSh0KX0sbS5wcm90b3R5cGUuYmluZFJlc2l6ZT1mdW5jdGlvbigpe3RoaXMuaXNSZXNpemVCb3VuZHx8KGkuYmluZCh0LFwicmVzaXplXCIsdGhpcyksdGhpcy5pc1Jlc2l6ZUJvdW5kPSEwKX0sbS5wcm90b3R5cGUudW5iaW5kUmVzaXplPWZ1bmN0aW9uKCl7dGhpcy5pc1Jlc2l6ZUJvdW5kJiZpLnVuYmluZCh0LFwicmVzaXplXCIsdGhpcyksdGhpcy5pc1Jlc2l6ZUJvdW5kPSExfSxtLnByb3RvdHlwZS5vbnJlc2l6ZT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtlLnJlc2l6ZSgpLGRlbGV0ZSBlLnJlc2l6ZVRpbWVvdXR9dGhpcy5yZXNpemVUaW1lb3V0JiZjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lb3V0KTt2YXIgZT10aGlzO3RoaXMucmVzaXplVGltZW91dD1zZXRUaW1lb3V0KHQsMTAwKX0sbS5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKCl7dGhpcy5pc1Jlc2l6ZUJvdW5kJiZ0aGlzLm5lZWRzUmVzaXplTGF5b3V0KCkmJnRoaXMubGF5b3V0KCl9LG0ucHJvdG90eXBlLm5lZWRzUmVzaXplTGF5b3V0PWZ1bmN0aW9uKCl7dmFyIHQ9bCh0aGlzLmVsZW1lbnQpLGU9dGhpcy5zaXplJiZ0O3JldHVybiBlJiZ0LmlubmVyV2lkdGghPT10aGlzLnNpemUuaW5uZXJXaWR0aH0sbS5wcm90b3R5cGUuYWRkSXRlbXM9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5faXRlbWl6ZSh0KTtyZXR1cm4gZS5sZW5ndGgmJih0aGlzLml0ZW1zPXRoaXMuaXRlbXMuY29uY2F0KGUpKSxlfSxtLnByb3RvdHlwZS5hcHBlbmRlZD1mdW5jdGlvbih0KXt2YXIgZT10aGlzLmFkZEl0ZW1zKHQpO2UubGVuZ3RoJiYodGhpcy5sYXlvdXRJdGVtcyhlLCEwKSx0aGlzLnJldmVhbChlKSl9LG0ucHJvdG90eXBlLnByZXBlbmRlZD1mdW5jdGlvbih0KXt2YXIgZT10aGlzLl9pdGVtaXplKHQpO2lmKGUubGVuZ3RoKXt2YXIgaT10aGlzLml0ZW1zLnNsaWNlKDApO3RoaXMuaXRlbXM9ZS5jb25jYXQoaSksdGhpcy5fcmVzZXRMYXlvdXQoKSx0aGlzLl9tYW5hZ2VTdGFtcHMoKSx0aGlzLmxheW91dEl0ZW1zKGUsITApLHRoaXMucmV2ZWFsKGUpLHRoaXMubGF5b3V0SXRlbXMoaSl9fSxtLnByb3RvdHlwZS5yZXZlYWw9ZnVuY3Rpb24odCl7dmFyIGU9dCYmdC5sZW5ndGg7aWYoZSlmb3IodmFyIGk9MDtlPmk7aSsrKXt2YXIgbz10W2ldO28ucmV2ZWFsKCl9fSxtLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKHQpe3ZhciBlPXQmJnQubGVuZ3RoO2lmKGUpZm9yKHZhciBpPTA7ZT5pO2krKyl7dmFyIG89dFtpXTtvLmhpZGUoKX19LG0ucHJvdG90eXBlLmdldEl0ZW09ZnVuY3Rpb24odCl7Zm9yKHZhciBlPTAsaT10aGlzLml0ZW1zLmxlbmd0aDtpPmU7ZSsrKXt2YXIgbz10aGlzLml0ZW1zW2VdO2lmKG8uZWxlbWVudD09PXQpcmV0dXJuIG99fSxtLnByb3RvdHlwZS5nZXRJdGVtcz1mdW5jdGlvbih0KXtpZih0JiZ0Lmxlbmd0aCl7Zm9yKHZhciBlPVtdLGk9MCxvPXQubGVuZ3RoO28+aTtpKyspe3ZhciBuPXRbaV0scj10aGlzLmdldEl0ZW0obik7ciYmZS5wdXNoKHIpfXJldHVybiBlfX0sbS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKHQpe3Q9byh0KTt2YXIgZT10aGlzLmdldEl0ZW1zKHQpO2lmKGUmJmUubGVuZ3RoKXt0aGlzLl9pdGVtc09uKGUsXCJyZW1vdmVcIixmdW5jdGlvbigpe3RoaXMuZW1pdEV2ZW50KFwicmVtb3ZlQ29tcGxldGVcIixbdGhpcyxlXSl9KTtmb3IodmFyIGk9MCxyPWUubGVuZ3RoO3I+aTtpKyspe3ZhciBzPWVbaV07cy5yZW1vdmUoKSxuKHMsdGhpcy5pdGVtcyl9fX0sbS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuZWxlbWVudC5zdHlsZTt0LmhlaWdodD1cIlwiLHQucG9zaXRpb249XCJcIix0LndpZHRoPVwiXCI7Zm9yKHZhciBlPTAsaT10aGlzLml0ZW1zLmxlbmd0aDtpPmU7ZSsrKXt2YXIgbz10aGlzLml0ZW1zW2VdO28uZGVzdHJveSgpfXRoaXMudW5iaW5kUmVzaXplKCk7dmFyIG49dGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRDtkZWxldGUgdltuXSxkZWxldGUgdGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRCxwJiZwLnJlbW92ZURhdGEodGhpcy5lbGVtZW50LHRoaXMuY29uc3RydWN0b3IubmFtZXNwYWNlKX0sbS5kYXRhPWZ1bmN0aW9uKHQpe3ZhciBlPXQmJnQub3V0bGF5ZXJHVUlEO3JldHVybiBlJiZ2W2VdfSxtLmNyZWF0ZT1mdW5jdGlvbih0LGkpe2Z1bmN0aW9uIG8oKXttLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gT2JqZWN0LmNyZWF0ZT9vLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG0ucHJvdG90eXBlKTplKG8ucHJvdG90eXBlLG0ucHJvdG90eXBlKSxvLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1vLG8uZGVmYXVsdHM9ZSh7fSxtLmRlZmF1bHRzKSxlKG8uZGVmYXVsdHMsaSksby5wcm90b3R5cGUuc2V0dGluZ3M9e30sby5uYW1lc3BhY2U9dCxvLmRhdGE9bS5kYXRhLG8uSXRlbT1mdW5jdGlvbigpe3kuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxvLkl0ZW0ucHJvdG90eXBlPW5ldyB5LHMoZnVuY3Rpb24oKXtmb3IodmFyIGU9cih0KSxpPWEucXVlcnlTZWxlY3RvckFsbChcIi5qcy1cIitlKSxuPVwiZGF0YS1cIitlK1wiLW9wdGlvbnNcIixzPTAsaD1pLmxlbmd0aDtoPnM7cysrKXt2YXIgZixkPWlbc10sbD1kLmdldEF0dHJpYnV0ZShuKTt0cnl7Zj1sJiZKU09OLnBhcnNlKGwpfWNhdGNoKGMpe3UmJnUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIFwiK24rXCIgb24gXCIrZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKyhkLmlkP1wiI1wiK2QuaWQ6XCJcIikrXCI6IFwiK2MpO2NvbnRpbnVlfXZhciB5PW5ldyBvKGQsZik7cCYmcC5kYXRhKGQsdCx5KX19KSxwJiZwLmJyaWRnZXQmJnAuYnJpZGdldCh0LG8pLG99LG0uSXRlbT15LG19dmFyIGE9dC5kb2N1bWVudCx1PXQuY29uc29sZSxwPXQualF1ZXJ5LGg9ZnVuY3Rpb24oKXt9LGY9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxkPVwiZnVuY3Rpb25cIj09dHlwZW9mIEhUTUxFbGVtZW50fHxcIm9iamVjdFwiPT10eXBlb2YgSFRNTEVsZW1lbnQ/ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwib2JqZWN0XCI9PXR5cGVvZiB0JiYxPT09dC5ub2RlVHlwZSYmXCJzdHJpbmdcIj09dHlwZW9mIHQubm9kZU5hbWV9LGw9QXJyYXkucHJvdG90eXBlLmluZGV4T2Y/ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC5pbmRleE9mKGUpfTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgaT0wLG89dC5sZW5ndGg7bz5pO2krKylpZih0W2ldPT09ZSlyZXR1cm4gaTtyZXR1cm4tMX07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcIm91dGxheWVyL291dGxheWVyXCIsW1wiZXZlbnRpZS9ldmVudGllXCIsXCJkb2MtcmVhZHkvZG9jLXJlYWR5XCIsXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsXCJnZXQtc2l6ZS9nZXQtc2l6ZVwiLFwibWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yXCIsXCIuL2l0ZW1cIl0scyk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9cyhyZXF1aXJlKFwiZXZlbnRpZVwiKSxyZXF1aXJlKFwiZG9jLXJlYWR5XCIpLHJlcXVpcmUoXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiKSxyZXF1aXJlKFwiZ2V0LXNpemVcIikscmVxdWlyZShcImRlc2FuZHJvLW1hdGNoZXMtc2VsZWN0b3JcIikscmVxdWlyZShcIi4vaXRlbVwiKSk6dC5PdXRsYXllcj1zKHQuZXZlbnRpZSx0LmRvY1JlYWR5LHQuRXZlbnRFbWl0dGVyLHQuZ2V0U2l6ZSx0Lm1hdGNoZXNTZWxlY3Rvcix0Lk91dGxheWVyLkl0ZW0pfSh3aW5kb3cpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7ZnVuY3Rpb24gZSgpe3QuSXRlbS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZS5wcm90b3R5cGU9bmV3IHQuSXRlbSxlLnByb3RvdHlwZS5fY3JlYXRlPWZ1bmN0aW9uKCl7dGhpcy5pZD10aGlzLmxheW91dC5pdGVtR1VJRCsrLHQuSXRlbS5wcm90b3R5cGUuX2NyZWF0ZS5jYWxsKHRoaXMpLHRoaXMuc29ydERhdGE9e319LGUucHJvdG90eXBlLnVwZGF0ZVNvcnREYXRhPWZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNJZ25vcmVkKXt0aGlzLnNvcnREYXRhLmlkPXRoaXMuaWQsdGhpcy5zb3J0RGF0YVtcIm9yaWdpbmFsLW9yZGVyXCJdPXRoaXMuaWQsdGhpcy5zb3J0RGF0YS5yYW5kb209TWF0aC5yYW5kb20oKTt2YXIgdD10aGlzLmxheW91dC5vcHRpb25zLmdldFNvcnREYXRhLGU9dGhpcy5sYXlvdXQuX3NvcnRlcnM7Zm9yKHZhciBpIGluIHQpe3ZhciBvPWVbaV07dGhpcy5zb3J0RGF0YVtpXT1vKHRoaXMuZWxlbWVudCx0aGlzKX19fTt2YXIgaT1lLnByb3RvdHlwZS5kZXN0cm95O3JldHVybiBlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7aS5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5jc3Moe2Rpc3BsYXk6XCJcIn0pfSxlfVwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJpc290b3BlL2pzL2l0ZW1cIixbXCJvdXRsYXllci9vdXRsYXllclwiXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lKHJlcXVpcmUoXCJvdXRsYXllclwiKSk6KHQuSXNvdG9wZT10Lklzb3RvcGV8fHt9LHQuSXNvdG9wZS5JdGVtPWUodC5PdXRsYXllcikpfSh3aW5kb3cpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCxlKXtmdW5jdGlvbiBpKHQpe3RoaXMuaXNvdG9wZT10LHQmJih0aGlzLm9wdGlvbnM9dC5vcHRpb25zW3RoaXMubmFtZXNwYWNlXSx0aGlzLmVsZW1lbnQ9dC5lbGVtZW50LHRoaXMuaXRlbXM9dC5maWx0ZXJlZEl0ZW1zLHRoaXMuc2l6ZT10LnNpemUpfXJldHVybiBmdW5jdGlvbigpe2Z1bmN0aW9uIHQodCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUucHJvdG90eXBlW3RdLmFwcGx5KHRoaXMuaXNvdG9wZSxhcmd1bWVudHMpfX1mb3IodmFyIG89W1wiX3Jlc2V0TGF5b3V0XCIsXCJfZ2V0SXRlbUxheW91dFBvc2l0aW9uXCIsXCJfbWFuYWdlU3RhbXBcIixcIl9nZXRDb250YWluZXJTaXplXCIsXCJfZ2V0RWxlbWVudE9mZnNldFwiLFwibmVlZHNSZXNpemVMYXlvdXRcIl0sbj0wLHI9by5sZW5ndGg7cj5uO24rKyl7dmFyIHM9b1tuXTtpLnByb3RvdHlwZVtzXT10KHMpfX0oKSxpLnByb3RvdHlwZS5uZWVkc1ZlcnRpY2FsUmVzaXplTGF5b3V0PWZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzLmlzb3RvcGUuZWxlbWVudCksaT10aGlzLmlzb3RvcGUuc2l6ZSYmZTtyZXR1cm4gaSYmZS5pbm5lckhlaWdodCE9PXRoaXMuaXNvdG9wZS5zaXplLmlubmVySGVpZ2h0fSxpLnByb3RvdHlwZS5fZ2V0TWVhc3VyZW1lbnQ9ZnVuY3Rpb24oKXt0aGlzLmlzb3RvcGUuX2dldE1lYXN1cmVtZW50LmFwcGx5KHRoaXMsYXJndW1lbnRzKX0saS5wcm90b3R5cGUuZ2V0Q29sdW1uV2lkdGg9ZnVuY3Rpb24oKXt0aGlzLmdldFNlZ21lbnRTaXplKFwiY29sdW1uXCIsXCJXaWR0aFwiKX0saS5wcm90b3R5cGUuZ2V0Um93SGVpZ2h0PWZ1bmN0aW9uKCl7dGhpcy5nZXRTZWdtZW50U2l6ZShcInJvd1wiLFwiSGVpZ2h0XCIpfSxpLnByb3RvdHlwZS5nZXRTZWdtZW50U2l6ZT1mdW5jdGlvbih0LGUpe3ZhciBpPXQrZSxvPVwib3V0ZXJcIitlO2lmKHRoaXMuX2dldE1lYXN1cmVtZW50KGksbyksIXRoaXNbaV0pe3ZhciBuPXRoaXMuZ2V0Rmlyc3RJdGVtU2l6ZSgpO3RoaXNbaV09biYmbltvXXx8dGhpcy5pc290b3BlLnNpemVbXCJpbm5lclwiK2VdfX0saS5wcm90b3R5cGUuZ2V0Rmlyc3RJdGVtU2l6ZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zWzBdO3JldHVybiBlJiZlLmVsZW1lbnQmJnQoZS5lbGVtZW50KX0saS5wcm90b3R5cGUubGF5b3V0PWZ1bmN0aW9uKCl7dGhpcy5pc290b3BlLmxheW91dC5hcHBseSh0aGlzLmlzb3RvcGUsYXJndW1lbnRzKX0saS5wcm90b3R5cGUuZ2V0U2l6ZT1mdW5jdGlvbigpe3RoaXMuaXNvdG9wZS5nZXRTaXplKCksdGhpcy5zaXplPXRoaXMuaXNvdG9wZS5zaXplfSxpLm1vZGVzPXt9LGkuY3JlYXRlPWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe2kuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiBvLnByb3RvdHlwZT1uZXcgaSxlJiYoby5vcHRpb25zPWUpLG8ucHJvdG90eXBlLm5hbWVzcGFjZT10LGkubW9kZXNbdF09byxvfSxpfVwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJpc290b3BlL2pzL2xheW91dC1tb2RlXCIsW1wiZ2V0LXNpemUvZ2V0LXNpemVcIixcIm91dGxheWVyL291dGxheWVyXCJdLGUpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWUocmVxdWlyZShcImdldC1zaXplXCIpLHJlcXVpcmUoXCJvdXRsYXllclwiKSk6KHQuSXNvdG9wZT10Lklzb3RvcGV8fHt9LHQuSXNvdG9wZS5MYXlvdXRNb2RlPWUodC5nZXRTaXplLHQuT3V0bGF5ZXIpKX0od2luZG93KSxmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQsZSl7dmFyIG89dC5jcmVhdGUoXCJtYXNvbnJ5XCIpO3JldHVybiBvLnByb3RvdHlwZS5fcmVzZXRMYXlvdXQ9ZnVuY3Rpb24oKXt0aGlzLmdldFNpemUoKSx0aGlzLl9nZXRNZWFzdXJlbWVudChcImNvbHVtbldpZHRoXCIsXCJvdXRlcldpZHRoXCIpLHRoaXMuX2dldE1lYXN1cmVtZW50KFwiZ3V0dGVyXCIsXCJvdXRlcldpZHRoXCIpLHRoaXMubWVhc3VyZUNvbHVtbnMoKTt2YXIgdD10aGlzLmNvbHM7Zm9yKHRoaXMuY29sWXM9W107dC0tOyl0aGlzLmNvbFlzLnB1c2goMCk7dGhpcy5tYXhZPTB9LG8ucHJvdG90eXBlLm1lYXN1cmVDb2x1bW5zPWZ1bmN0aW9uKCl7aWYodGhpcy5nZXRDb250YWluZXJXaWR0aCgpLCF0aGlzLmNvbHVtbldpZHRoKXt2YXIgdD10aGlzLml0ZW1zWzBdLGk9dCYmdC5lbGVtZW50O3RoaXMuY29sdW1uV2lkdGg9aSYmZShpKS5vdXRlcldpZHRofHx0aGlzLmNvbnRhaW5lcldpZHRofXRoaXMuY29sdW1uV2lkdGgrPXRoaXMuZ3V0dGVyLHRoaXMuY29scz1NYXRoLmZsb29yKCh0aGlzLmNvbnRhaW5lcldpZHRoK3RoaXMuZ3V0dGVyKS90aGlzLmNvbHVtbldpZHRoKSx0aGlzLmNvbHM9TWF0aC5tYXgodGhpcy5jb2xzLDEpfSxvLnByb3RvdHlwZS5nZXRDb250YWluZXJXaWR0aD1mdW5jdGlvbigpe3ZhciB0PXRoaXMub3B0aW9ucy5pc0ZpdFdpZHRoP3RoaXMuZWxlbWVudC5wYXJlbnROb2RlOnRoaXMuZWxlbWVudCxpPWUodCk7dGhpcy5jb250YWluZXJXaWR0aD1pJiZpLmlubmVyV2lkdGh9LG8ucHJvdG90eXBlLl9nZXRJdGVtTGF5b3V0UG9zaXRpb249ZnVuY3Rpb24odCl7dC5nZXRTaXplKCk7dmFyIGU9dC5zaXplLm91dGVyV2lkdGgldGhpcy5jb2x1bW5XaWR0aCxvPWUmJjE+ZT9cInJvdW5kXCI6XCJjZWlsXCIsbj1NYXRoW29dKHQuc2l6ZS5vdXRlcldpZHRoL3RoaXMuY29sdW1uV2lkdGgpO249TWF0aC5taW4obix0aGlzLmNvbHMpO2Zvcih2YXIgcj10aGlzLl9nZXRDb2xHcm91cChuKSxzPU1hdGgubWluLmFwcGx5KE1hdGgsciksYT1pKHIscyksdT17eDp0aGlzLmNvbHVtbldpZHRoKmEseTpzfSxwPXMrdC5zaXplLm91dGVySGVpZ2h0LGg9dGhpcy5jb2xzKzEtci5sZW5ndGgsZj0wO2g+ZjtmKyspdGhpcy5jb2xZc1thK2ZdPXA7cmV0dXJuIHV9LG8ucHJvdG90eXBlLl9nZXRDb2xHcm91cD1mdW5jdGlvbih0KXtpZigyPnQpcmV0dXJuIHRoaXMuY29sWXM7Zm9yKHZhciBlPVtdLGk9dGhpcy5jb2xzKzEtdCxvPTA7aT5vO28rKyl7dmFyIG49dGhpcy5jb2xZcy5zbGljZShvLG8rdCk7ZVtvXT1NYXRoLm1heC5hcHBseShNYXRoLG4pfXJldHVybiBlfSxvLnByb3RvdHlwZS5fbWFuYWdlU3RhbXA9ZnVuY3Rpb24odCl7dmFyIGk9ZSh0KSxvPXRoaXMuX2dldEVsZW1lbnRPZmZzZXQodCksbj10aGlzLm9wdGlvbnMuaXNPcmlnaW5MZWZ0P28ubGVmdDpvLnJpZ2h0LHI9bitpLm91dGVyV2lkdGgscz1NYXRoLmZsb29yKG4vdGhpcy5jb2x1bW5XaWR0aCk7cz1NYXRoLm1heCgwLHMpO3ZhciBhPU1hdGguZmxvb3Ioci90aGlzLmNvbHVtbldpZHRoKTthLT1yJXRoaXMuY29sdW1uV2lkdGg/MDoxLGE9TWF0aC5taW4odGhpcy5jb2xzLTEsYSk7Zm9yKHZhciB1PSh0aGlzLm9wdGlvbnMuaXNPcmlnaW5Ub3A/by50b3A6by5ib3R0b20pK2kub3V0ZXJIZWlnaHQscD1zO2E+PXA7cCsrKXRoaXMuY29sWXNbcF09TWF0aC5tYXgodSx0aGlzLmNvbFlzW3BdKX0sby5wcm90b3R5cGUuX2dldENvbnRhaW5lclNpemU9ZnVuY3Rpb24oKXt0aGlzLm1heFk9TWF0aC5tYXguYXBwbHkoTWF0aCx0aGlzLmNvbFlzKTt2YXIgdD17aGVpZ2h0OnRoaXMubWF4WX07cmV0dXJuIHRoaXMub3B0aW9ucy5pc0ZpdFdpZHRoJiYodC53aWR0aD10aGlzLl9nZXRDb250YWluZXJGaXRXaWR0aCgpKSx0fSxvLnByb3RvdHlwZS5fZ2V0Q29udGFpbmVyRml0V2lkdGg9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9MCxlPXRoaXMuY29sczstLWUmJjA9PT10aGlzLmNvbFlzW2VdOyl0Kys7cmV0dXJuKHRoaXMuY29scy10KSp0aGlzLmNvbHVtbldpZHRoLXRoaXMuZ3V0dGVyfSxvLnByb3RvdHlwZS5uZWVkc1Jlc2l6ZUxheW91dD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuY29udGFpbmVyV2lkdGg7cmV0dXJuIHRoaXMuZ2V0Q29udGFpbmVyV2lkdGgoKSx0IT09dGhpcy5jb250YWluZXJXaWR0aH0sb312YXIgaT1BcnJheS5wcm90b3R5cGUuaW5kZXhPZj9mdW5jdGlvbih0LGUpe3JldHVybiB0LmluZGV4T2YoZSl9OmZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBpPTAsbz10Lmxlbmd0aDtvPmk7aSsrKXt2YXIgbj10W2ldO2lmKG49PT1lKXJldHVybiBpfXJldHVybi0xfTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwibWFzb25yeS9tYXNvbnJ5XCIsW1wib3V0bGF5ZXIvb3V0bGF5ZXJcIixcImdldC1zaXplL2dldC1zaXplXCJdLGUpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWUocmVxdWlyZShcIm91dGxheWVyXCIpLHJlcXVpcmUoXCJnZXQtc2l6ZVwiKSk6dC5NYXNvbnJ5PWUodC5PdXRsYXllcix0LmdldFNpemUpfSh3aW5kb3cpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCxlKXtmb3IodmFyIGkgaW4gZSl0W2ldPWVbaV07cmV0dXJuIHR9ZnVuY3Rpb24gaSh0LGkpe3ZhciBvPXQuY3JlYXRlKFwibWFzb25yeVwiKSxuPW8ucHJvdG90eXBlLl9nZXRFbGVtZW50T2Zmc2V0LHI9by5wcm90b3R5cGUubGF5b3V0LHM9by5wcm90b3R5cGUuX2dldE1lYXN1cmVtZW50O2Uoby5wcm90b3R5cGUsaS5wcm90b3R5cGUpLG8ucHJvdG90eXBlLl9nZXRFbGVtZW50T2Zmc2V0PW4sby5wcm90b3R5cGUubGF5b3V0PXIsby5wcm90b3R5cGUuX2dldE1lYXN1cmVtZW50PXM7dmFyIGE9by5wcm90b3R5cGUubWVhc3VyZUNvbHVtbnM7by5wcm90b3R5cGUubWVhc3VyZUNvbHVtbnM9ZnVuY3Rpb24oKXt0aGlzLml0ZW1zPXRoaXMuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zLGEuY2FsbCh0aGlzKX07dmFyIHU9by5wcm90b3R5cGUuX21hbmFnZVN0YW1wO3JldHVybiBvLnByb3RvdHlwZS5fbWFuYWdlU3RhbXA9ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMuaXNPcmlnaW5MZWZ0PXRoaXMuaXNvdG9wZS5vcHRpb25zLmlzT3JpZ2luTGVmdCx0aGlzLm9wdGlvbnMuaXNPcmlnaW5Ub3A9dGhpcy5pc290b3BlLm9wdGlvbnMuaXNPcmlnaW5Ub3AsdS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LG99XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImlzb3RvcGUvanMvbGF5b3V0LW1vZGVzL21hc29ucnlcIixbXCIuLi9sYXlvdXQtbW9kZVwiLFwibWFzb25yeS9tYXNvbnJ5XCJdLGkpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWkocmVxdWlyZShcIi4uL2xheW91dC1tb2RlXCIpLHJlcXVpcmUoXCJtYXNvbnJ5LWxheW91dFwiKSk6aSh0Lklzb3RvcGUuTGF5b3V0TW9kZSx0Lk1hc29ucnkpfSh3aW5kb3cpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7dmFyIGU9dC5jcmVhdGUoXCJmaXRSb3dzXCIpO3JldHVybiBlLnByb3RvdHlwZS5fcmVzZXRMYXlvdXQ9ZnVuY3Rpb24oKXt0aGlzLng9MCx0aGlzLnk9MCx0aGlzLm1heFk9MCx0aGlzLl9nZXRNZWFzdXJlbWVudChcImd1dHRlclwiLFwib3V0ZXJXaWR0aFwiKX0sZS5wcm90b3R5cGUuX2dldEl0ZW1MYXlvdXRQb3NpdGlvbj1mdW5jdGlvbih0KXt0LmdldFNpemUoKTt2YXIgZT10LnNpemUub3V0ZXJXaWR0aCt0aGlzLmd1dHRlcixpPXRoaXMuaXNvdG9wZS5zaXplLmlubmVyV2lkdGgrdGhpcy5ndXR0ZXI7MCE9PXRoaXMueCYmZSt0aGlzLng+aSYmKHRoaXMueD0wLHRoaXMueT10aGlzLm1heFkpO3ZhciBvPXt4OnRoaXMueCx5OnRoaXMueX07cmV0dXJuIHRoaXMubWF4WT1NYXRoLm1heCh0aGlzLm1heFksdGhpcy55K3Quc2l6ZS5vdXRlckhlaWdodCksdGhpcy54Kz1lLG99LGUucHJvdG90eXBlLl9nZXRDb250YWluZXJTaXplPWZ1bmN0aW9uKCl7cmV0dXJue2hlaWdodDp0aGlzLm1heFl9fSxlfVwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJpc290b3BlL2pzL2xheW91dC1tb2Rlcy9maXQtcm93c1wiLFtcIi4uL2xheW91dC1tb2RlXCJdLGUpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWUocmVxdWlyZShcIi4uL2xheW91dC1tb2RlXCIpKTplKHQuSXNvdG9wZS5MYXlvdXRNb2RlKX0od2luZG93KSxmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQpe3ZhciBlPXQuY3JlYXRlKFwidmVydGljYWxcIix7aG9yaXpvbnRhbEFsaWdubWVudDowfSk7cmV0dXJuIGUucHJvdG90eXBlLl9yZXNldExheW91dD1mdW5jdGlvbigpe3RoaXMueT0wfSxlLnByb3RvdHlwZS5fZ2V0SXRlbUxheW91dFBvc2l0aW9uPWZ1bmN0aW9uKHQpe3QuZ2V0U2l6ZSgpO3ZhciBlPSh0aGlzLmlzb3RvcGUuc2l6ZS5pbm5lcldpZHRoLXQuc2l6ZS5vdXRlcldpZHRoKSp0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbEFsaWdubWVudCxpPXRoaXMueTtyZXR1cm4gdGhpcy55Kz10LnNpemUub3V0ZXJIZWlnaHQse3g6ZSx5Oml9fSxlLnByb3RvdHlwZS5fZ2V0Q29udGFpbmVyU2l6ZT1mdW5jdGlvbigpe3JldHVybntoZWlnaHQ6dGhpcy55fX0sZX1cImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiaXNvdG9wZS9qcy9sYXlvdXQtbW9kZXMvdmVydGljYWxcIixbXCIuLi9sYXlvdXQtbW9kZVwiXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lKHJlcXVpcmUoXCIuLi9sYXlvdXQtbW9kZVwiKSk6ZSh0Lklzb3RvcGUuTGF5b3V0TW9kZSl9KHdpbmRvdyksZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LGUpe2Zvcih2YXIgaSBpbiBlKXRbaV09ZVtpXTtyZXR1cm4gdH1mdW5jdGlvbiBpKHQpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PWguY2FsbCh0KX1mdW5jdGlvbiBvKHQpe3ZhciBlPVtdO2lmKGkodCkpZT10O2Vsc2UgaWYodCYmXCJudW1iZXJcIj09dHlwZW9mIHQubGVuZ3RoKWZvcih2YXIgbz0wLG49dC5sZW5ndGg7bj5vO28rKyllLnB1c2godFtvXSk7ZWxzZSBlLnB1c2godCk7cmV0dXJuIGV9ZnVuY3Rpb24gbih0LGUpe3ZhciBpPWYoZSx0KTstMSE9PWkmJmUuc3BsaWNlKGksMSl9ZnVuY3Rpb24gcih0LGkscix1LGgpe2Z1bmN0aW9uIGYodCxlKXtyZXR1cm4gZnVuY3Rpb24oaSxvKXtmb3IodmFyIG49MCxyPXQubGVuZ3RoO3I+bjtuKyspe3ZhciBzPXRbbl0sYT1pLnNvcnREYXRhW3NdLHU9by5zb3J0RGF0YVtzXTtpZihhPnV8fHU+YSl7dmFyIHA9dm9pZCAwIT09ZVtzXT9lW3NdOmUsaD1wPzE6LTE7cmV0dXJuKGE+dT8xOi0xKSpofX1yZXR1cm4gMH19dmFyIGQ9dC5jcmVhdGUoXCJpc290b3BlXCIse2xheW91dE1vZGU6XCJtYXNvbnJ5XCIsaXNKUXVlcnlGaWx0ZXJpbmc6ITAsc29ydEFzY2VuZGluZzohMH0pO2QuSXRlbT11LGQuTGF5b3V0TW9kZT1oLGQucHJvdG90eXBlLl9jcmVhdGU9ZnVuY3Rpb24oKXt0aGlzLml0ZW1HVUlEPTAsdGhpcy5fc29ydGVycz17fSx0aGlzLl9nZXRTb3J0ZXJzKCksdC5wcm90b3R5cGUuX2NyZWF0ZS5jYWxsKHRoaXMpLHRoaXMubW9kZXM9e30sdGhpcy5maWx0ZXJlZEl0ZW1zPXRoaXMuaXRlbXMsdGhpcy5zb3J0SGlzdG9yeT1bXCJvcmlnaW5hbC1vcmRlclwiXTtmb3IodmFyIGUgaW4gaC5tb2Rlcyl0aGlzLl9pbml0TGF5b3V0TW9kZShlKX0sZC5wcm90b3R5cGUucmVsb2FkSXRlbXM9ZnVuY3Rpb24oKXt0aGlzLml0ZW1HVUlEPTAsdC5wcm90b3R5cGUucmVsb2FkSXRlbXMuY2FsbCh0aGlzKX0sZC5wcm90b3R5cGUuX2l0ZW1pemU9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dC5wcm90b3R5cGUuX2l0ZW1pemUuYXBwbHkodGhpcyxhcmd1bWVudHMpLGk9MCxvPWUubGVuZ3RoO28+aTtpKyspe3ZhciBuPWVbaV07bi5pZD10aGlzLml0ZW1HVUlEKyt9cmV0dXJuIHRoaXMuX3VwZGF0ZUl0ZW1zU29ydERhdGEoZSksZVxufSxkLnByb3RvdHlwZS5faW5pdExheW91dE1vZGU9ZnVuY3Rpb24odCl7dmFyIGk9aC5tb2Rlc1t0XSxvPXRoaXMub3B0aW9uc1t0XXx8e307dGhpcy5vcHRpb25zW3RdPWkub3B0aW9ucz9lKGkub3B0aW9ucyxvKTpvLHRoaXMubW9kZXNbdF09bmV3IGkodGhpcyl9LGQucHJvdG90eXBlLmxheW91dD1mdW5jdGlvbigpe3JldHVybiF0aGlzLl9pc0xheW91dEluaXRlZCYmdGhpcy5vcHRpb25zLmlzSW5pdExheW91dD8odGhpcy5hcnJhbmdlKCksdm9pZCAwKToodGhpcy5fbGF5b3V0KCksdm9pZCAwKX0sZC5wcm90b3R5cGUuX2xheW91dD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2dldElzSW5zdGFudCgpO3RoaXMuX3Jlc2V0TGF5b3V0KCksdGhpcy5fbWFuYWdlU3RhbXBzKCksdGhpcy5sYXlvdXRJdGVtcyh0aGlzLmZpbHRlcmVkSXRlbXMsdCksdGhpcy5faXNMYXlvdXRJbml0ZWQ9ITB9LGQucHJvdG90eXBlLmFycmFuZ2U9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSgpe28ucmV2ZWFsKGkubmVlZFJldmVhbCksby5oaWRlKGkubmVlZEhpZGUpfXRoaXMub3B0aW9uKHQpLHRoaXMuX2dldElzSW5zdGFudCgpO3ZhciBpPXRoaXMuX2ZpbHRlcih0aGlzLml0ZW1zKTt0aGlzLmZpbHRlcmVkSXRlbXM9aS5tYXRjaGVzO3ZhciBvPXRoaXM7dGhpcy5faXNJbnN0YW50P3RoaXMuX25vVHJhbnNpdGlvbihlKTplKCksdGhpcy5fc29ydCgpLHRoaXMuX2xheW91dCgpfSxkLnByb3RvdHlwZS5faW5pdD1kLnByb3RvdHlwZS5hcnJhbmdlLGQucHJvdG90eXBlLl9nZXRJc0luc3RhbnQ9ZnVuY3Rpb24oKXt2YXIgdD12b2lkIDAhPT10aGlzLm9wdGlvbnMuaXNMYXlvdXRJbnN0YW50P3RoaXMub3B0aW9ucy5pc0xheW91dEluc3RhbnQ6IXRoaXMuX2lzTGF5b3V0SW5pdGVkO3JldHVybiB0aGlzLl9pc0luc3RhbnQ9dCx0fSxkLnByb3RvdHlwZS5fZmlsdGVyPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMub3B0aW9ucy5maWx0ZXI7ZT1lfHxcIipcIjtmb3IodmFyIGk9W10sbz1bXSxuPVtdLHI9dGhpcy5fZ2V0RmlsdGVyVGVzdChlKSxzPTAsYT10Lmxlbmd0aDthPnM7cysrKXt2YXIgdT10W3NdO2lmKCF1LmlzSWdub3JlZCl7dmFyIHA9cih1KTtwJiZpLnB1c2godSkscCYmdS5pc0hpZGRlbj9vLnB1c2godSk6cHx8dS5pc0hpZGRlbnx8bi5wdXNoKHUpfX1yZXR1cm57bWF0Y2hlczppLG5lZWRSZXZlYWw6byxuZWVkSGlkZTpufX0sZC5wcm90b3R5cGUuX2dldEZpbHRlclRlc3Q9ZnVuY3Rpb24odCl7cmV0dXJuIHMmJnRoaXMub3B0aW9ucy5pc0pRdWVyeUZpbHRlcmluZz9mdW5jdGlvbihlKXtyZXR1cm4gcyhlLmVsZW1lbnQpLmlzKHQpfTpcImZ1bmN0aW9uXCI9PXR5cGVvZiB0P2Z1bmN0aW9uKGUpe3JldHVybiB0KGUuZWxlbWVudCl9OmZ1bmN0aW9uKGUpe3JldHVybiByKGUuZWxlbWVudCx0KX19LGQucHJvdG90eXBlLnVwZGF0ZVNvcnREYXRhPWZ1bmN0aW9uKHQpe3ZhciBlO3Q/KHQ9byh0KSxlPXRoaXMuZ2V0SXRlbXModCkpOmU9dGhpcy5pdGVtcyx0aGlzLl9nZXRTb3J0ZXJzKCksdGhpcy5fdXBkYXRlSXRlbXNTb3J0RGF0YShlKX0sZC5wcm90b3R5cGUuX2dldFNvcnRlcnM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm9wdGlvbnMuZ2V0U29ydERhdGE7Zm9yKHZhciBlIGluIHQpe3ZhciBpPXRbZV07dGhpcy5fc29ydGVyc1tlXT1sKGkpfX0sZC5wcm90b3R5cGUuX3VwZGF0ZUl0ZW1zU29ydERhdGE9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXQmJnQubGVuZ3RoLGk9MDtlJiZlPmk7aSsrKXt2YXIgbz10W2ldO28udXBkYXRlU29ydERhdGEoKX19O3ZhciBsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXtpZihcInN0cmluZ1wiIT10eXBlb2YgdClyZXR1cm4gdDt2YXIgaT1hKHQpLnNwbGl0KFwiIFwiKSxvPWlbMF0sbj1vLm1hdGNoKC9eXFxbKC4rKVxcXSQvKSxyPW4mJm5bMV0scz1lKHIsbyksdT1kLnNvcnREYXRhUGFyc2Vyc1tpWzFdXTtyZXR1cm4gdD11P2Z1bmN0aW9uKHQpe3JldHVybiB0JiZ1KHModCkpfTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmcyh0KX19ZnVuY3Rpb24gZSh0LGUpe3ZhciBpO3JldHVybiBpPXQ/ZnVuY3Rpb24oZSl7cmV0dXJuIGUuZ2V0QXR0cmlidXRlKHQpfTpmdW5jdGlvbih0KXt2YXIgaT10LnF1ZXJ5U2VsZWN0b3IoZSk7cmV0dXJuIGkmJnAoaSl9fXJldHVybiB0fSgpO2Quc29ydERhdGFQYXJzZXJzPXtwYXJzZUludDpmdW5jdGlvbih0KXtyZXR1cm4gcGFyc2VJbnQodCwxMCl9LHBhcnNlRmxvYXQ6ZnVuY3Rpb24odCl7cmV0dXJuIHBhcnNlRmxvYXQodCl9fSxkLnByb3RvdHlwZS5fc29ydD1mdW5jdGlvbigpe3ZhciB0PXRoaXMub3B0aW9ucy5zb3J0Qnk7aWYodCl7dmFyIGU9W10uY29uY2F0LmFwcGx5KHQsdGhpcy5zb3J0SGlzdG9yeSksaT1mKGUsdGhpcy5vcHRpb25zLnNvcnRBc2NlbmRpbmcpO3RoaXMuZmlsdGVyZWRJdGVtcy5zb3J0KGkpLHQhPT10aGlzLnNvcnRIaXN0b3J5WzBdJiZ0aGlzLnNvcnRIaXN0b3J5LnVuc2hpZnQodCl9fSxkLnByb3RvdHlwZS5fbW9kZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMub3B0aW9ucy5sYXlvdXRNb2RlLGU9dGhpcy5tb2Rlc1t0XTtpZighZSl0aHJvdyBFcnJvcihcIk5vIGxheW91dCBtb2RlOiBcIit0KTtyZXR1cm4gZS5vcHRpb25zPXRoaXMub3B0aW9uc1t0XSxlfSxkLnByb3RvdHlwZS5fcmVzZXRMYXlvdXQ9ZnVuY3Rpb24oKXt0LnByb3RvdHlwZS5fcmVzZXRMYXlvdXQuY2FsbCh0aGlzKSx0aGlzLl9tb2RlKCkuX3Jlc2V0TGF5b3V0KCl9LGQucHJvdG90eXBlLl9nZXRJdGVtTGF5b3V0UG9zaXRpb249ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX21vZGUoKS5fZ2V0SXRlbUxheW91dFBvc2l0aW9uKHQpfSxkLnByb3RvdHlwZS5fbWFuYWdlU3RhbXA9ZnVuY3Rpb24odCl7dGhpcy5fbW9kZSgpLl9tYW5hZ2VTdGFtcCh0KX0sZC5wcm90b3R5cGUuX2dldENvbnRhaW5lclNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW9kZSgpLl9nZXRDb250YWluZXJTaXplKCl9LGQucHJvdG90eXBlLm5lZWRzUmVzaXplTGF5b3V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21vZGUoKS5uZWVkc1Jlc2l6ZUxheW91dCgpfSxkLnByb3RvdHlwZS5hcHBlbmRlZD1mdW5jdGlvbih0KXt2YXIgZT10aGlzLmFkZEl0ZW1zKHQpO2lmKGUubGVuZ3RoKXt2YXIgaT10aGlzLl9maWx0ZXJSZXZlYWxBZGRlZChlKTt0aGlzLmZpbHRlcmVkSXRlbXM9dGhpcy5maWx0ZXJlZEl0ZW1zLmNvbmNhdChpKX19LGQucHJvdG90eXBlLnByZXBlbmRlZD1mdW5jdGlvbih0KXt2YXIgZT10aGlzLl9pdGVtaXplKHQpO2lmKGUubGVuZ3RoKXt0aGlzLl9yZXNldExheW91dCgpLHRoaXMuX21hbmFnZVN0YW1wcygpO3ZhciBpPXRoaXMuX2ZpbHRlclJldmVhbEFkZGVkKGUpO3RoaXMubGF5b3V0SXRlbXModGhpcy5maWx0ZXJlZEl0ZW1zKSx0aGlzLmZpbHRlcmVkSXRlbXM9aS5jb25jYXQodGhpcy5maWx0ZXJlZEl0ZW1zKSx0aGlzLml0ZW1zPWUuY29uY2F0KHRoaXMuaXRlbXMpfX0sZC5wcm90b3R5cGUuX2ZpbHRlclJldmVhbEFkZGVkPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuX2ZpbHRlcih0KTtyZXR1cm4gdGhpcy5oaWRlKGUubmVlZEhpZGUpLHRoaXMucmV2ZWFsKGUubWF0Y2hlcyksdGhpcy5sYXlvdXRJdGVtcyhlLm1hdGNoZXMsITApLGUubWF0Y2hlc30sZC5wcm90b3R5cGUuaW5zZXJ0PWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuYWRkSXRlbXModCk7aWYoZS5sZW5ndGgpe3ZhciBpLG8sbj1lLmxlbmd0aDtmb3IoaT0wO24+aTtpKyspbz1lW2ldLHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvLmVsZW1lbnQpO3ZhciByPXRoaXMuX2ZpbHRlcihlKS5tYXRjaGVzO2ZvcihpPTA7bj5pO2krKyllW2ldLmlzTGF5b3V0SW5zdGFudD0hMDtmb3IodGhpcy5hcnJhbmdlKCksaT0wO24+aTtpKyspZGVsZXRlIGVbaV0uaXNMYXlvdXRJbnN0YW50O3RoaXMucmV2ZWFsKHIpfX07dmFyIGM9ZC5wcm90b3R5cGUucmVtb3ZlO3JldHVybiBkLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24odCl7dD1vKHQpO3ZhciBlPXRoaXMuZ2V0SXRlbXModCk7aWYoYy5jYWxsKHRoaXMsdCksZSYmZS5sZW5ndGgpZm9yKHZhciBpPTAscj1lLmxlbmd0aDtyPmk7aSsrKXt2YXIgcz1lW2ldO24ocyx0aGlzLmZpbHRlcmVkSXRlbXMpfX0sZC5wcm90b3R5cGUuc2h1ZmZsZT1mdW5jdGlvbigpe2Zvcih2YXIgdD0wLGU9dGhpcy5pdGVtcy5sZW5ndGg7ZT50O3QrKyl7dmFyIGk9dGhpcy5pdGVtc1t0XTtpLnNvcnREYXRhLnJhbmRvbT1NYXRoLnJhbmRvbSgpfXRoaXMub3B0aW9ucy5zb3J0Qnk9XCJyYW5kb21cIix0aGlzLl9zb3J0KCksdGhpcy5fbGF5b3V0KCl9LGQucHJvdG90eXBlLl9ub1RyYW5zaXRpb249ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5vcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbjt0aGlzLm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uPTA7dmFyIGk9dC5jYWxsKHRoaXMpO3JldHVybiB0aGlzLm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uPWUsaX0sZC5wcm90b3R5cGUuZ2V0RmlsdGVyZWRJdGVtRWxlbWVudHM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9W10sZT0wLGk9dGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDtpPmU7ZSsrKXQucHVzaCh0aGlzLmZpbHRlcmVkSXRlbXNbZV0uZWxlbWVudCk7cmV0dXJuIHR9LGR9dmFyIHM9dC5qUXVlcnksYT1TdHJpbmcucHJvdG90eXBlLnRyaW0/ZnVuY3Rpb24odCl7cmV0dXJuIHQudHJpbSgpfTpmdW5jdGlvbih0KXtyZXR1cm4gdC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpfSx1PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxwPXUudGV4dENvbnRlbnQ/ZnVuY3Rpb24odCl7cmV0dXJuIHQudGV4dENvbnRlbnR9OmZ1bmN0aW9uKHQpe3JldHVybiB0LmlubmVyVGV4dH0saD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLGY9QXJyYXkucHJvdG90eXBlLmluZGV4T2Y/ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC5pbmRleE9mKGUpfTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgaT0wLG89dC5sZW5ndGg7bz5pO2krKylpZih0W2ldPT09ZSlyZXR1cm4gaTtyZXR1cm4tMX07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJvdXRsYXllci9vdXRsYXllclwiLFwiZ2V0LXNpemUvZ2V0LXNpemVcIixcIm1hdGNoZXMtc2VsZWN0b3IvbWF0Y2hlcy1zZWxlY3RvclwiLFwiaXNvdG9wZS9qcy9pdGVtXCIsXCJpc290b3BlL2pzL2xheW91dC1tb2RlXCIsXCJpc290b3BlL2pzL2xheW91dC1tb2Rlcy9tYXNvbnJ5XCIsXCJpc290b3BlL2pzL2xheW91dC1tb2Rlcy9maXQtcm93c1wiLFwiaXNvdG9wZS9qcy9sYXlvdXQtbW9kZXMvdmVydGljYWxcIl0scik6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9cihyZXF1aXJlKFwib3V0bGF5ZXJcIikscmVxdWlyZShcImdldC1zaXplXCIpLHJlcXVpcmUoXCJkZXNhbmRyby1tYXRjaGVzLXNlbGVjdG9yXCIpLHJlcXVpcmUoXCIuL2l0ZW1cIikscmVxdWlyZShcIi4vbGF5b3V0LW1vZGVcIikscmVxdWlyZShcIi4vbGF5b3V0LW1vZGVzL21hc29ucnlcIikscmVxdWlyZShcIi4vbGF5b3V0LW1vZGVzL2ZpdC1yb3dzXCIpLHJlcXVpcmUoXCIuL2xheW91dC1tb2Rlcy92ZXJ0aWNhbFwiKSk6dC5Jc290b3BlPXIodC5PdXRsYXllcix0LmdldFNpemUsdC5tYXRjaGVzU2VsZWN0b3IsdC5Jc290b3BlLkl0ZW0sdC5Jc290b3BlLkxheW91dE1vZGUpfSh3aW5kb3cpOyIsIjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cblx0dmFyIHBsdWdpbk5hbWUgPSAnc3RlbGxhcicsXG5cdFx0ZGVmYXVsdHMgPSB7XG5cdFx0XHRzY3JvbGxQcm9wZXJ0eTogJ3Njcm9sbCcsXG5cdFx0XHRwb3NpdGlvblByb3BlcnR5OiAncG9zaXRpb24nLFxuXHRcdFx0aG9yaXpvbnRhbFNjcm9sbGluZzogdHJ1ZSxcblx0XHRcdHZlcnRpY2FsU2Nyb2xsaW5nOiB0cnVlLFxuXHRcdFx0aG9yaXpvbnRhbE9mZnNldDogMCxcblx0XHRcdHZlcnRpY2FsT2Zmc2V0OiAwLFxuXHRcdFx0cmVzcG9uc2l2ZTogZmFsc2UsXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRzOiB0cnVlLFxuXHRcdFx0cGFyYWxsYXhFbGVtZW50czogdHJ1ZSxcblx0XHRcdGhpZGVEaXN0YW50RWxlbWVudHM6IHRydWUsXG5cdFx0XHRoaWRlRWxlbWVudDogZnVuY3Rpb24oJGVsZW0pIHsgJGVsZW0uaGlkZSgpOyB9LFxuXHRcdFx0c2hvd0VsZW1lbnQ6IGZ1bmN0aW9uKCRlbGVtKSB7ICRlbGVtLnNob3coKTsgfVxuXHRcdH0sXG5cblx0XHRzY3JvbGxQcm9wZXJ0eSA9IHtcblx0XHRcdHNjcm9sbDoge1xuXHRcdFx0XHRnZXRMZWZ0OiBmdW5jdGlvbigkZWxlbSkgeyByZXR1cm4gJGVsZW0uc2Nyb2xsTGVmdCgpOyB9LFxuXHRcdFx0XHRzZXRMZWZ0OiBmdW5jdGlvbigkZWxlbSwgdmFsKSB7ICRlbGVtLnNjcm9sbExlZnQodmFsKTsgfSxcblxuXHRcdFx0XHRnZXRUb3A6IGZ1bmN0aW9uKCRlbGVtKSB7IHJldHVybiAkZWxlbS5zY3JvbGxUb3AoKTtcdH0sXG5cdFx0XHRcdHNldFRvcDogZnVuY3Rpb24oJGVsZW0sIHZhbCkgeyAkZWxlbS5zY3JvbGxUb3AodmFsKTsgfVxuXHRcdFx0fSxcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdGdldExlZnQ6IGZ1bmN0aW9uKCRlbGVtKSB7IHJldHVybiBwYXJzZUludCgkZWxlbS5jc3MoJ2xlZnQnKSwgMTApICogLTE7IH0sXG5cdFx0XHRcdGdldFRvcDogZnVuY3Rpb24oJGVsZW0pIHsgcmV0dXJuIHBhcnNlSW50KCRlbGVtLmNzcygndG9wJyksIDEwKSAqIC0xOyB9XG5cdFx0XHR9LFxuXHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdGdldExlZnQ6IGZ1bmN0aW9uKCRlbGVtKSB7IHJldHVybiBwYXJzZUludCgkZWxlbS5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKSAqIC0xOyB9LFxuXHRcdFx0XHRnZXRUb3A6IGZ1bmN0aW9uKCRlbGVtKSB7IHJldHVybiBwYXJzZUludCgkZWxlbS5jc3MoJ21hcmdpbi10b3AnKSwgMTApICogLTE7IH1cblx0XHRcdH0sXG5cdFx0XHR0cmFuc2Zvcm06IHtcblx0XHRcdFx0Z2V0TGVmdDogZnVuY3Rpb24oJGVsZW0pIHtcblx0XHRcdFx0XHR2YXIgY29tcHV0ZWRUcmFuc2Zvcm0gPSBnZXRDb21wdXRlZFN0eWxlKCRlbGVtWzBdKVtwcmVmaXhlZFRyYW5zZm9ybV07XG5cdFx0XHRcdFx0cmV0dXJuIChjb21wdXRlZFRyYW5zZm9ybSAhPT0gJ25vbmUnID8gcGFyc2VJbnQoY29tcHV0ZWRUcmFuc2Zvcm0ubWF0Y2goLygtP1swLTldKykvZylbNF0sIDEwKSAqIC0xIDogMCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldFRvcDogZnVuY3Rpb24oJGVsZW0pIHtcblx0XHRcdFx0XHR2YXIgY29tcHV0ZWRUcmFuc2Zvcm0gPSBnZXRDb21wdXRlZFN0eWxlKCRlbGVtWzBdKVtwcmVmaXhlZFRyYW5zZm9ybV07XG5cdFx0XHRcdFx0cmV0dXJuIChjb21wdXRlZFRyYW5zZm9ybSAhPT0gJ25vbmUnID8gcGFyc2VJbnQoY29tcHV0ZWRUcmFuc2Zvcm0ubWF0Y2goLygtP1swLTldKykvZylbNV0sIDEwKSAqIC0xIDogMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0cG9zaXRpb25Qcm9wZXJ0eSA9IHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHNldExlZnQ6IGZ1bmN0aW9uKCRlbGVtLCBsZWZ0KSB7ICRlbGVtLmNzcygnbGVmdCcsIGxlZnQpOyB9LFxuXHRcdFx0XHRzZXRUb3A6IGZ1bmN0aW9uKCRlbGVtLCB0b3ApIHsgJGVsZW0uY3NzKCd0b3AnLCB0b3ApOyB9XG5cdFx0XHR9LFxuXHRcdFx0dHJhbnNmb3JtOiB7XG5cdFx0XHRcdHNldFBvc2l0aW9uOiBmdW5jdGlvbigkZWxlbSwgbGVmdCwgc3RhcnRpbmdMZWZ0LCB0b3AsIHN0YXJ0aW5nVG9wKSB7XG5cdFx0XHRcdFx0JGVsZW1bMF0uc3R5bGVbcHJlZml4ZWRUcmFuc2Zvcm1dID0gJ3RyYW5zbGF0ZTNkKCcgKyAobGVmdCAtIHN0YXJ0aW5nTGVmdCkgKyAncHgsICcgKyAodG9wIC0gc3RhcnRpbmdUb3ApICsgJ3B4LCAwKSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGFkZHMgYSB2ZW5kb3IgcHJlZml4IHRvIGFueSBDU1MgcHJvcGVydHkgbmFtZVxuXHRcdHZlbmRvclByZWZpeCA9IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwcmVmaXhlcyA9IC9eKE1venxXZWJraXR8S2h0bWx8T3xtc3xJY2FiKSg/PVtBLVpdKS8sXG5cdFx0XHRcdHN0eWxlID0gJCgnc2NyaXB0JylbMF0uc3R5bGUsXG5cdFx0XHRcdHByZWZpeCA9ICcnLFxuXHRcdFx0XHRwcm9wO1xuXG5cdFx0XHRmb3IgKHByb3AgaW4gc3R5bGUpIHtcblx0XHRcdFx0aWYgKHByZWZpeGVzLnRlc3QocHJvcCkpIHtcblx0XHRcdFx0XHRwcmVmaXggPSBwcm9wLm1hdGNoKHByZWZpeGVzKVswXTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJ1dlYmtpdE9wYWNpdHknIGluIHN0eWxlKSB7IHByZWZpeCA9ICdXZWJraXQnOyB9XG5cdFx0XHRpZiAoJ0todG1sT3BhY2l0eScgaW4gc3R5bGUpIHsgcHJlZml4ID0gJ0todG1sJzsgfVxuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRcdFx0cmV0dXJuIHByZWZpeCArIChwcmVmaXgubGVuZ3RoID4gMCA/IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSkgOiBwcm9wZXJ0eSk7XG5cdFx0XHR9O1xuXHRcdH0oKSksXG5cblx0XHRwcmVmaXhlZFRyYW5zZm9ybSA9IHZlbmRvclByZWZpeCgndHJhbnNmb3JtJyksXG5cblx0XHRzdXBwb3J0c0JhY2tncm91bmRQb3NpdGlvblhZID0gJCgnPGRpdiAvPicsIHsgc3R5bGU6ICdiYWNrZ3JvdW5kOiNmZmYnIH0pLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgIT09IHVuZGVmaW5lZCxcblxuXHRcdHNldEJhY2tncm91bmRQb3NpdGlvbiA9IChzdXBwb3J0c0JhY2tncm91bmRQb3NpdGlvblhZID9cblx0XHRcdGZ1bmN0aW9uKCRlbGVtLCB4LCB5KSB7XG5cdFx0XHRcdCRlbGVtLmNzcyh7XG5cdFx0XHRcdFx0J2JhY2tncm91bmQtcG9zaXRpb24teCc6IHgsXG5cdFx0XHRcdFx0J2JhY2tncm91bmQtcG9zaXRpb24teSc6IHlcblx0XHRcdFx0fSk7XG5cdFx0XHR9IDpcblx0XHRcdGZ1bmN0aW9uKCRlbGVtLCB4LCB5KSB7XG5cdFx0XHRcdCRlbGVtLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIHggKyAnICcgKyB5KTtcblx0XHRcdH1cblx0XHQpLFxuXG5cdFx0Z2V0QmFja2dyb3VuZFBvc2l0aW9uID0gKHN1cHBvcnRzQmFja2dyb3VuZFBvc2l0aW9uWFkgP1xuXHRcdFx0ZnVuY3Rpb24oJGVsZW0pIHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQkZWxlbS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLFxuXHRcdFx0XHRcdCRlbGVtLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbi15Jylcblx0XHRcdFx0XTtcblx0XHRcdH0gOlxuXHRcdFx0ZnVuY3Rpb24oJGVsZW0pIHtcblx0XHRcdFx0cmV0dXJuICRlbGVtLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpLnNwbGl0KCcgJyk7XG5cdFx0XHR9XG5cdFx0KSxcblxuXHRcdHJlcXVlc3RBbmltRnJhbWUgPSAoXG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG5cdFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG5cdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgIHx8XG5cdFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgIHx8XG5cdFx0XHRmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0ZnVuY3Rpb24gUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpIHtcblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzO1xuXHRcdHRoaXMuX25hbWUgPSBwbHVnaW5OYW1lO1xuXG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHRQbHVnaW4ucHJvdG90eXBlID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5vcHRpb25zLm5hbWUgPSBwbHVnaW5OYW1lICsgJ18nICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU5KTtcblxuXHRcdFx0dGhpcy5fZGVmaW5lRWxlbWVudHMoKTtcblx0XHRcdHRoaXMuX2RlZmluZUdldHRlcnMoKTtcblx0XHRcdHRoaXMuX2RlZmluZVNldHRlcnMoKTtcblx0XHRcdHRoaXMuX2hhbmRsZVdpbmRvd0xvYWRBbmRSZXNpemUoKTtcblx0XHRcdHRoaXMuX2RldGVjdFZpZXdwb3J0KCk7XG5cblx0XHRcdHRoaXMucmVmcmVzaCh7IGZpcnN0TG9hZDogdHJ1ZSB9KTtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zY3JvbGxQcm9wZXJ0eSA9PT0gJ3Njcm9sbCcpIHtcblx0XHRcdFx0dGhpcy5faGFuZGxlU2Nyb2xsRXZlbnQoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0QW5pbWF0aW9uTG9vcCgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0X2RlZmluZUVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLmVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHRoaXMuZWxlbWVudCA9IHdpbmRvdztcblx0XHRcdHRoaXMuJHNjcm9sbEVsZW1lbnQgPSAkKHRoaXMuZWxlbWVudCk7XG5cdFx0XHR0aGlzLiRlbGVtZW50ID0gKHRoaXMuZWxlbWVudCA9PT0gd2luZG93ID8gJCgnYm9keScpIDogdGhpcy4kc2Nyb2xsRWxlbWVudCk7XG5cdFx0XHR0aGlzLiR2aWV3cG9ydEVsZW1lbnQgPSAodGhpcy5vcHRpb25zLnZpZXdwb3J0RWxlbWVudCAhPT0gdW5kZWZpbmVkID8gJCh0aGlzLm9wdGlvbnMudmlld3BvcnRFbGVtZW50KSA6ICh0aGlzLiRzY3JvbGxFbGVtZW50WzBdID09PSB3aW5kb3cgfHwgdGhpcy5vcHRpb25zLnNjcm9sbFByb3BlcnR5ID09PSAnc2Nyb2xsJyA/IHRoaXMuJHNjcm9sbEVsZW1lbnQgOiB0aGlzLiRzY3JvbGxFbGVtZW50LnBhcmVudCgpKSApO1xuXHRcdH0sXG5cdFx0X2RlZmluZUdldHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRzY3JvbGxQcm9wZXJ0eUFkYXB0ZXIgPSBzY3JvbGxQcm9wZXJ0eVtzZWxmLm9wdGlvbnMuc2Nyb2xsUHJvcGVydHldO1xuXG5cdFx0XHR0aGlzLl9nZXRTY3JvbGxMZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBzY3JvbGxQcm9wZXJ0eUFkYXB0ZXIuZ2V0TGVmdChzZWxmLiRzY3JvbGxFbGVtZW50KTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMuX2dldFNjcm9sbFRvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsUHJvcGVydHlBZGFwdGVyLmdldFRvcChzZWxmLiRzY3JvbGxFbGVtZW50KTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHRfZGVmaW5lU2V0dGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdHNjcm9sbFByb3BlcnR5QWRhcHRlciA9IHNjcm9sbFByb3BlcnR5W3NlbGYub3B0aW9ucy5zY3JvbGxQcm9wZXJ0eV0sXG5cdFx0XHRcdHBvc2l0aW9uUHJvcGVydHlBZGFwdGVyID0gcG9zaXRpb25Qcm9wZXJ0eVtzZWxmLm9wdGlvbnMucG9zaXRpb25Qcm9wZXJ0eV0sXG5cdFx0XHRcdHNldFNjcm9sbExlZnQgPSBzY3JvbGxQcm9wZXJ0eUFkYXB0ZXIuc2V0TGVmdCxcblx0XHRcdFx0c2V0U2Nyb2xsVG9wID0gc2Nyb2xsUHJvcGVydHlBZGFwdGVyLnNldFRvcDtcblxuXHRcdFx0dGhpcy5fc2V0U2Nyb2xsTGVmdCA9ICh0eXBlb2Ygc2V0U2Nyb2xsTGVmdCA9PT0gJ2Z1bmN0aW9uJyA/IGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHRzZXRTY3JvbGxMZWZ0KHNlbGYuJHNjcm9sbEVsZW1lbnQsIHZhbCk7XG5cdFx0XHR9IDogJC5ub29wKTtcblxuXHRcdFx0dGhpcy5fc2V0U2Nyb2xsVG9wID0gKHR5cGVvZiBzZXRTY3JvbGxUb3AgPT09ICdmdW5jdGlvbicgPyBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0c2V0U2Nyb2xsVG9wKHNlbGYuJHNjcm9sbEVsZW1lbnQsIHZhbCk7XG5cdFx0XHR9IDogJC5ub29wKTtcblxuXHRcdFx0dGhpcy5fc2V0UG9zaXRpb24gPSBwb3NpdGlvblByb3BlcnR5QWRhcHRlci5zZXRQb3NpdGlvbiB8fFxuXHRcdFx0XHRmdW5jdGlvbigkZWxlbSwgbGVmdCwgc3RhcnRpbmdMZWZ0LCB0b3AsIHN0YXJ0aW5nVG9wKSB7XG5cdFx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5ob3Jpem9udGFsU2Nyb2xsaW5nKSB7XG5cdFx0XHRcdFx0XHRwb3NpdGlvblByb3BlcnR5QWRhcHRlci5zZXRMZWZ0KCRlbGVtLCBsZWZ0LCBzdGFydGluZ0xlZnQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMudmVydGljYWxTY3JvbGxpbmcpIHtcblx0XHRcdFx0XHRcdHBvc2l0aW9uUHJvcGVydHlBZGFwdGVyLnNldFRvcCgkZWxlbSwgdG9wLCBzdGFydGluZ1RvcCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdH0sXG5cdFx0X2hhbmRsZVdpbmRvd0xvYWRBbmRSZXNpemU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHQkd2luZG93ID0gJCh3aW5kb3cpO1xuXG5cdFx0XHRpZiAoc2VsZi5vcHRpb25zLnJlc3BvbnNpdmUpIHtcblx0XHRcdFx0JHdpbmRvdy5iaW5kKCdsb2FkLicgKyB0aGlzLm5hbWUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0JHdpbmRvdy5iaW5kKCdyZXNpemUuJyArIHRoaXMubmFtZSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuX2RldGVjdFZpZXdwb3J0KCk7XG5cblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5yZXNwb25zaXZlKSB7XG5cdFx0XHRcdFx0c2VsZi5yZWZyZXNoKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVmcmVzaDogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRvbGRMZWZ0ID0gc2VsZi5fZ2V0U2Nyb2xsTGVmdCgpLFxuXHRcdFx0XHRvbGRUb3AgPSBzZWxmLl9nZXRTY3JvbGxUb3AoKTtcblxuXHRcdFx0aWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmZpcnN0TG9hZCkge1xuXHRcdFx0XHR0aGlzLl9yZXNldCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9zZXRTY3JvbGxMZWZ0KDApO1xuXHRcdFx0dGhpcy5fc2V0U2Nyb2xsVG9wKDApO1xuXG5cdFx0XHR0aGlzLl9zZXRPZmZzZXRzKCk7XG5cdFx0XHR0aGlzLl9maW5kUGFydGljbGVzKCk7XG5cdFx0XHR0aGlzLl9maW5kQmFja2dyb3VuZHMoKTtcblxuXHRcdFx0Ly8gRml4IGZvciBXZWJLaXQgYmFja2dyb3VuZCByZW5kZXJpbmcgYnVnXG5cdFx0XHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpcnN0TG9hZCAmJiAvV2ViS2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRcdCQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBvbGRMZWZ0ID0gc2VsZi5fZ2V0U2Nyb2xsTGVmdCgpLFxuXHRcdFx0XHRcdFx0b2xkVG9wID0gc2VsZi5fZ2V0U2Nyb2xsVG9wKCk7XG5cblx0XHRcdFx0XHRzZWxmLl9zZXRTY3JvbGxMZWZ0KG9sZExlZnQgKyAxKTtcblx0XHRcdFx0XHRzZWxmLl9zZXRTY3JvbGxUb3Aob2xkVG9wICsgMSk7XG5cblx0XHRcdFx0XHRzZWxmLl9zZXRTY3JvbGxMZWZ0KG9sZExlZnQpO1xuXHRcdFx0XHRcdHNlbGYuX3NldFNjcm9sbFRvcChvbGRUb3ApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fc2V0U2Nyb2xsTGVmdChvbGRMZWZ0KTtcblx0XHRcdHRoaXMuX3NldFNjcm9sbFRvcChvbGRUb3ApO1xuXHRcdH0sXG5cdFx0X2RldGVjdFZpZXdwb3J0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB2aWV3cG9ydE9mZnNldHMgPSB0aGlzLiR2aWV3cG9ydEVsZW1lbnQub2Zmc2V0KCksXG5cdFx0XHRcdGhhc09mZnNldHMgPSB2aWV3cG9ydE9mZnNldHMgIT09IG51bGwgJiYgdmlld3BvcnRPZmZzZXRzICE9PSB1bmRlZmluZWQ7XG5cblx0XHRcdHRoaXMudmlld3BvcnRXaWR0aCA9IHRoaXMuJHZpZXdwb3J0RWxlbWVudC53aWR0aCgpO1xuXHRcdFx0dGhpcy52aWV3cG9ydEhlaWdodCA9IHRoaXMuJHZpZXdwb3J0RWxlbWVudC5oZWlnaHQoKTtcblxuXHRcdFx0dGhpcy52aWV3cG9ydE9mZnNldFRvcCA9IChoYXNPZmZzZXRzID8gdmlld3BvcnRPZmZzZXRzLnRvcCA6IDApO1xuXHRcdFx0dGhpcy52aWV3cG9ydE9mZnNldExlZnQgPSAoaGFzT2Zmc2V0cyA/IHZpZXdwb3J0T2Zmc2V0cy5sZWZ0IDogMCk7XG5cdFx0fSxcblx0XHRfZmluZFBhcnRpY2xlczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdHNjcm9sbExlZnQgPSB0aGlzLl9nZXRTY3JvbGxMZWZ0KCksXG5cdFx0XHRcdHNjcm9sbFRvcCA9IHRoaXMuX2dldFNjcm9sbFRvcCgpO1xuXG5cdFx0XHRpZiAodGhpcy5wYXJ0aWNsZXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gdGhpcy5wYXJ0aWNsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHR0aGlzLnBhcnRpY2xlc1tpXS4kZWxlbWVudC5kYXRhKCdzdGVsbGFyLWVsZW1lbnRJc0FjdGl2ZScsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5wYXJ0aWNsZXMgPSBbXTtcblxuXHRcdFx0aWYgKCF0aGlzLm9wdGlvbnMucGFyYWxsYXhFbGVtZW50cykgcmV0dXJuO1xuXG5cdFx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLXN0ZWxsYXItcmF0aW9dJykuZWFjaChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldCxcblx0XHRcdFx0XHR2ZXJ0aWNhbE9mZnNldCxcblx0XHRcdFx0XHRwb3NpdGlvbkxlZnQsXG5cdFx0XHRcdFx0cG9zaXRpb25Ub3AsXG5cdFx0XHRcdFx0bWFyZ2luTGVmdCxcblx0XHRcdFx0XHRtYXJnaW5Ub3AsXG5cdFx0XHRcdFx0JG9mZnNldFBhcmVudCxcblx0XHRcdFx0XHRvZmZzZXRMZWZ0LFxuXHRcdFx0XHRcdG9mZnNldFRvcCxcblx0XHRcdFx0XHRwYXJlbnRPZmZzZXRMZWZ0ID0gMCxcblx0XHRcdFx0XHRwYXJlbnRPZmZzZXRUb3AgPSAwLFxuXHRcdFx0XHRcdHRlbXBQYXJlbnRPZmZzZXRMZWZ0ID0gMCxcblx0XHRcdFx0XHR0ZW1wUGFyZW50T2Zmc2V0VG9wID0gMDtcblxuXHRcdFx0XHQvLyBFbnN1cmUgdGhpcyBlbGVtZW50IGlzbid0IGFscmVhZHkgcGFydCBvZiBhbm90aGVyIHNjcm9sbGluZyBlbGVtZW50XG5cdFx0XHRcdGlmICghJHRoaXMuZGF0YSgnc3RlbGxhci1lbGVtZW50SXNBY3RpdmUnKSkge1xuXHRcdFx0XHRcdCR0aGlzLmRhdGEoJ3N0ZWxsYXItZWxlbWVudElzQWN0aXZlJywgdGhpcyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJHRoaXMuZGF0YSgnc3RlbGxhci1lbGVtZW50SXNBY3RpdmUnKSAhPT0gdGhpcykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNlbGYub3B0aW9ucy5zaG93RWxlbWVudCgkdGhpcyk7XG5cblx0XHRcdFx0Ly8gU2F2ZS9yZXN0b3JlIHRoZSBvcmlnaW5hbCB0b3AgYW5kIGxlZnQgQ1NTIHZhbHVlcyBpbiBjYXNlIHdlIHJlZnJlc2ggdGhlIHBhcnRpY2xlcyBvciBkZXN0cm95IHRoZSBpbnN0YW5jZVxuXHRcdFx0XHRpZiAoISR0aGlzLmRhdGEoJ3N0ZWxsYXItc3RhcnRpbmdMZWZ0JykpIHtcblx0XHRcdFx0XHQkdGhpcy5kYXRhKCdzdGVsbGFyLXN0YXJ0aW5nTGVmdCcsICR0aGlzLmNzcygnbGVmdCcpKTtcblx0XHRcdFx0XHQkdGhpcy5kYXRhKCdzdGVsbGFyLXN0YXJ0aW5nVG9wJywgJHRoaXMuY3NzKCd0b3AnKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHRoaXMuY3NzKCdsZWZ0JywgJHRoaXMuZGF0YSgnc3RlbGxhci1zdGFydGluZ0xlZnQnKSk7XG5cdFx0XHRcdFx0JHRoaXMuY3NzKCd0b3AnLCAkdGhpcy5kYXRhKCdzdGVsbGFyLXN0YXJ0aW5nVG9wJykpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cG9zaXRpb25MZWZ0ID0gJHRoaXMucG9zaXRpb24oKS5sZWZ0O1xuXHRcdFx0XHRwb3NpdGlvblRvcCA9ICR0aGlzLnBvc2l0aW9uKCkudG9wO1xuXG5cdFx0XHRcdC8vIENhdGNoLWFsbCBmb3IgbWFyZ2luIHRvcC9sZWZ0IHByb3BlcnRpZXMgKHRoZXNlIGV2YWx1YXRlIHRvICdhdXRvJyBpbiBJRTcgYW5kIElFOClcblx0XHRcdFx0bWFyZ2luTGVmdCA9ICgkdGhpcy5jc3MoJ21hcmdpbi1sZWZ0JykgPT09ICdhdXRvJykgPyAwIDogcGFyc2VJbnQoJHRoaXMuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0XHRcdG1hcmdpblRvcCA9ICgkdGhpcy5jc3MoJ21hcmdpbi10b3AnKSA9PT0gJ2F1dG8nKSA/IDAgOiBwYXJzZUludCgkdGhpcy5jc3MoJ21hcmdpbi10b3AnKSwgMTApO1xuXG5cdFx0XHRcdG9mZnNldExlZnQgPSAkdGhpcy5vZmZzZXQoKS5sZWZ0IC0gbWFyZ2luTGVmdDtcblx0XHRcdFx0b2Zmc2V0VG9wID0gJHRoaXMub2Zmc2V0KCkudG9wIC0gbWFyZ2luVG9wO1xuXG5cdFx0XHRcdC8vIENhbGN1bGF0ZSB0aGUgb2Zmc2V0IHBhcmVudFxuXHRcdFx0XHQkdGhpcy5wYXJlbnRzKCkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0aWYgKCR0aGlzLmRhdGEoJ3N0ZWxsYXItb2Zmc2V0LXBhcmVudCcpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRwYXJlbnRPZmZzZXRMZWZ0ID0gdGVtcFBhcmVudE9mZnNldExlZnQ7XG5cdFx0XHRcdFx0XHRwYXJlbnRPZmZzZXRUb3AgPSB0ZW1wUGFyZW50T2Zmc2V0VG9wO1xuXHRcdFx0XHRcdFx0JG9mZnNldFBhcmVudCA9ICR0aGlzO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRlbXBQYXJlbnRPZmZzZXRMZWZ0ICs9ICR0aGlzLnBvc2l0aW9uKCkubGVmdDtcblx0XHRcdFx0XHRcdHRlbXBQYXJlbnRPZmZzZXRUb3AgKz0gJHRoaXMucG9zaXRpb24oKS50b3A7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBEZXRlY3QgdGhlIG9mZnNldHNcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldCA9ICgkdGhpcy5kYXRhKCdzdGVsbGFyLWhvcml6b250YWwtb2Zmc2V0JykgIT09IHVuZGVmaW5lZCA/ICR0aGlzLmRhdGEoJ3N0ZWxsYXItaG9yaXpvbnRhbC1vZmZzZXQnKSA6ICgkb2Zmc2V0UGFyZW50ICE9PSB1bmRlZmluZWQgJiYgJG9mZnNldFBhcmVudC5kYXRhKCdzdGVsbGFyLWhvcml6b250YWwtb2Zmc2V0JykgIT09IHVuZGVmaW5lZCA/ICRvZmZzZXRQYXJlbnQuZGF0YSgnc3RlbGxhci1ob3Jpem9udGFsLW9mZnNldCcpIDogc2VsZi5ob3Jpem9udGFsT2Zmc2V0KSk7XG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0ID0gKCR0aGlzLmRhdGEoJ3N0ZWxsYXItdmVydGljYWwtb2Zmc2V0JykgIT09IHVuZGVmaW5lZCA/ICR0aGlzLmRhdGEoJ3N0ZWxsYXItdmVydGljYWwtb2Zmc2V0JykgOiAoJG9mZnNldFBhcmVudCAhPT0gdW5kZWZpbmVkICYmICRvZmZzZXRQYXJlbnQuZGF0YSgnc3RlbGxhci12ZXJ0aWNhbC1vZmZzZXQnKSAhPT0gdW5kZWZpbmVkID8gJG9mZnNldFBhcmVudC5kYXRhKCdzdGVsbGFyLXZlcnRpY2FsLW9mZnNldCcpIDogc2VsZi52ZXJ0aWNhbE9mZnNldCkpO1xuXG5cdFx0XHRcdC8vIEFkZCBvdXIgb2JqZWN0IHRvIHRoZSBwYXJ0aWNsZXMgY29sbGVjdGlvblxuXHRcdFx0XHRzZWxmLnBhcnRpY2xlcy5wdXNoKHtcblx0XHRcdFx0XHQkZWxlbWVudDogJHRoaXMsXG5cdFx0XHRcdFx0JG9mZnNldFBhcmVudDogJG9mZnNldFBhcmVudCxcblx0XHRcdFx0XHRpc0ZpeGVkOiAkdGhpcy5jc3MoJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCcsXG5cdFx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldDogaG9yaXpvbnRhbE9mZnNldCxcblx0XHRcdFx0XHR2ZXJ0aWNhbE9mZnNldDogdmVydGljYWxPZmZzZXQsXG5cdFx0XHRcdFx0c3RhcnRpbmdQb3NpdGlvbkxlZnQ6IHBvc2l0aW9uTGVmdCxcblx0XHRcdFx0XHRzdGFydGluZ1Bvc2l0aW9uVG9wOiBwb3NpdGlvblRvcCxcblx0XHRcdFx0XHRzdGFydGluZ09mZnNldExlZnQ6IG9mZnNldExlZnQsXG5cdFx0XHRcdFx0c3RhcnRpbmdPZmZzZXRUb3A6IG9mZnNldFRvcCxcblx0XHRcdFx0XHRwYXJlbnRPZmZzZXRMZWZ0OiBwYXJlbnRPZmZzZXRMZWZ0LFxuXHRcdFx0XHRcdHBhcmVudE9mZnNldFRvcDogcGFyZW50T2Zmc2V0VG9wLFxuXHRcdFx0XHRcdHN0ZWxsYXJSYXRpbzogKCR0aGlzLmRhdGEoJ3N0ZWxsYXItcmF0aW8nKSAhPT0gdW5kZWZpbmVkID8gJHRoaXMuZGF0YSgnc3RlbGxhci1yYXRpbycpIDogMSksXG5cdFx0XHRcdFx0d2lkdGg6ICR0aGlzLm91dGVyV2lkdGgodHJ1ZSksXG5cdFx0XHRcdFx0aGVpZ2h0OiAkdGhpcy5vdXRlckhlaWdodCh0cnVlKSxcblx0XHRcdFx0XHRpc0hpZGRlbjogZmFsc2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdF9maW5kQmFja2dyb3VuZHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRzY3JvbGxMZWZ0ID0gdGhpcy5fZ2V0U2Nyb2xsTGVmdCgpLFxuXHRcdFx0XHRzY3JvbGxUb3AgPSB0aGlzLl9nZXRTY3JvbGxUb3AoKSxcblx0XHRcdFx0JGJhY2tncm91bmRFbGVtZW50cztcblxuXHRcdFx0dGhpcy5iYWNrZ3JvdW5kcyA9IFtdO1xuXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5wYXJhbGxheEJhY2tncm91bmRzKSByZXR1cm47XG5cblx0XHRcdCRiYWNrZ3JvdW5kRWxlbWVudHMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLXN0ZWxsYXItYmFja2dyb3VuZC1yYXRpb10nKTtcblxuXHRcdFx0aWYgKHRoaXMuJGVsZW1lbnQuZGF0YSgnc3RlbGxhci1iYWNrZ3JvdW5kLXJhdGlvJykpIHtcbiAgICAgICAgICAgICAgICAkYmFja2dyb3VuZEVsZW1lbnRzID0gJGJhY2tncm91bmRFbGVtZW50cy5hZGQodGhpcy4kZWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdCRiYWNrZ3JvdW5kRWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb24gPSBnZXRCYWNrZ3JvdW5kUG9zaXRpb24oJHRoaXMpLFxuXHRcdFx0XHRcdGhvcml6b250YWxPZmZzZXQsXG5cdFx0XHRcdFx0dmVydGljYWxPZmZzZXQsXG5cdFx0XHRcdFx0cG9zaXRpb25MZWZ0LFxuXHRcdFx0XHRcdHBvc2l0aW9uVG9wLFxuXHRcdFx0XHRcdG1hcmdpbkxlZnQsXG5cdFx0XHRcdFx0bWFyZ2luVG9wLFxuXHRcdFx0XHRcdG9mZnNldExlZnQsXG5cdFx0XHRcdFx0b2Zmc2V0VG9wLFxuXHRcdFx0XHRcdCRvZmZzZXRQYXJlbnQsXG5cdFx0XHRcdFx0cGFyZW50T2Zmc2V0TGVmdCA9IDAsXG5cdFx0XHRcdFx0cGFyZW50T2Zmc2V0VG9wID0gMCxcblx0XHRcdFx0XHR0ZW1wUGFyZW50T2Zmc2V0TGVmdCA9IDAsXG5cdFx0XHRcdFx0dGVtcFBhcmVudE9mZnNldFRvcCA9IDA7XG5cblx0XHRcdFx0Ly8gRW5zdXJlIHRoaXMgZWxlbWVudCBpc24ndCBhbHJlYWR5IHBhcnQgb2YgYW5vdGhlciBzY3JvbGxpbmcgZWxlbWVudFxuXHRcdFx0XHRpZiAoISR0aGlzLmRhdGEoJ3N0ZWxsYXItYmFja2dyb3VuZElzQWN0aXZlJykpIHtcblx0XHRcdFx0XHQkdGhpcy5kYXRhKCdzdGVsbGFyLWJhY2tncm91bmRJc0FjdGl2ZScsIHRoaXMpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCR0aGlzLmRhdGEoJ3N0ZWxsYXItYmFja2dyb3VuZElzQWN0aXZlJykgIT09IHRoaXMpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTYXZlL3Jlc3RvcmUgdGhlIG9yaWdpbmFsIHRvcCBhbmQgbGVmdCBDU1MgdmFsdWVzIGluIGNhc2Ugd2UgZGVzdHJveSB0aGUgaW5zdGFuY2Vcblx0XHRcdFx0aWYgKCEkdGhpcy5kYXRhKCdzdGVsbGFyLWJhY2tncm91bmRTdGFydGluZ0xlZnQnKSkge1xuXHRcdFx0XHRcdCR0aGlzLmRhdGEoJ3N0ZWxsYXItYmFja2dyb3VuZFN0YXJ0aW5nTGVmdCcsIGJhY2tncm91bmRQb3NpdGlvblswXSk7XG5cdFx0XHRcdFx0JHRoaXMuZGF0YSgnc3RlbGxhci1iYWNrZ3JvdW5kU3RhcnRpbmdUb3AnLCBiYWNrZ3JvdW5kUG9zaXRpb25bMV0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNldEJhY2tncm91bmRQb3NpdGlvbigkdGhpcywgJHRoaXMuZGF0YSgnc3RlbGxhci1iYWNrZ3JvdW5kU3RhcnRpbmdMZWZ0JyksICR0aGlzLmRhdGEoJ3N0ZWxsYXItYmFja2dyb3VuZFN0YXJ0aW5nVG9wJykpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ2F0Y2gtYWxsIGZvciBtYXJnaW4gdG9wL2xlZnQgcHJvcGVydGllcyAodGhlc2UgZXZhbHVhdGUgdG8gJ2F1dG8nIGluIElFNyBhbmQgSUU4KVxuXHRcdFx0XHRtYXJnaW5MZWZ0ID0gKCR0aGlzLmNzcygnbWFyZ2luLWxlZnQnKSA9PT0gJ2F1dG8nKSA/IDAgOiBwYXJzZUludCgkdGhpcy5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKTtcblx0XHRcdFx0bWFyZ2luVG9wID0gKCR0aGlzLmNzcygnbWFyZ2luLXRvcCcpID09PSAnYXV0bycpID8gMCA6IHBhcnNlSW50KCR0aGlzLmNzcygnbWFyZ2luLXRvcCcpLCAxMCk7XG5cblx0XHRcdFx0b2Zmc2V0TGVmdCA9ICR0aGlzLm9mZnNldCgpLmxlZnQgLSBtYXJnaW5MZWZ0IC0gc2Nyb2xsTGVmdDtcblx0XHRcdFx0b2Zmc2V0VG9wID0gJHRoaXMub2Zmc2V0KCkudG9wIC0gbWFyZ2luVG9wIC0gc2Nyb2xsVG9wO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gQ2FsY3VsYXRlIHRoZSBvZmZzZXQgcGFyZW50XG5cdFx0XHRcdCR0aGlzLnBhcmVudHMoKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cblx0XHRcdFx0XHRpZiAoJHRoaXMuZGF0YSgnc3RlbGxhci1vZmZzZXQtcGFyZW50JykgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdHBhcmVudE9mZnNldExlZnQgPSB0ZW1wUGFyZW50T2Zmc2V0TGVmdDtcblx0XHRcdFx0XHRcdHBhcmVudE9mZnNldFRvcCA9IHRlbXBQYXJlbnRPZmZzZXRUb3A7XG5cdFx0XHRcdFx0XHQkb2Zmc2V0UGFyZW50ID0gJHRoaXM7XG5cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGVtcFBhcmVudE9mZnNldExlZnQgKz0gJHRoaXMucG9zaXRpb24oKS5sZWZ0O1xuXHRcdFx0XHRcdFx0dGVtcFBhcmVudE9mZnNldFRvcCArPSAkdGhpcy5wb3NpdGlvbigpLnRvcDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIERldGVjdCB0aGUgb2Zmc2V0c1xuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0ID0gKCR0aGlzLmRhdGEoJ3N0ZWxsYXItaG9yaXpvbnRhbC1vZmZzZXQnKSAhPT0gdW5kZWZpbmVkID8gJHRoaXMuZGF0YSgnc3RlbGxhci1ob3Jpem9udGFsLW9mZnNldCcpIDogKCRvZmZzZXRQYXJlbnQgIT09IHVuZGVmaW5lZCAmJiAkb2Zmc2V0UGFyZW50LmRhdGEoJ3N0ZWxsYXItaG9yaXpvbnRhbC1vZmZzZXQnKSAhPT0gdW5kZWZpbmVkID8gJG9mZnNldFBhcmVudC5kYXRhKCdzdGVsbGFyLWhvcml6b250YWwtb2Zmc2V0JykgOiBzZWxmLmhvcml6b250YWxPZmZzZXQpKTtcblx0XHRcdFx0dmVydGljYWxPZmZzZXQgPSAoJHRoaXMuZGF0YSgnc3RlbGxhci12ZXJ0aWNhbC1vZmZzZXQnKSAhPT0gdW5kZWZpbmVkID8gJHRoaXMuZGF0YSgnc3RlbGxhci12ZXJ0aWNhbC1vZmZzZXQnKSA6ICgkb2Zmc2V0UGFyZW50ICE9PSB1bmRlZmluZWQgJiYgJG9mZnNldFBhcmVudC5kYXRhKCdzdGVsbGFyLXZlcnRpY2FsLW9mZnNldCcpICE9PSB1bmRlZmluZWQgPyAkb2Zmc2V0UGFyZW50LmRhdGEoJ3N0ZWxsYXItdmVydGljYWwtb2Zmc2V0JykgOiBzZWxmLnZlcnRpY2FsT2Zmc2V0KSk7XG5cblx0XHRcdFx0c2VsZi5iYWNrZ3JvdW5kcy5wdXNoKHtcblx0XHRcdFx0XHQkZWxlbWVudDogJHRoaXMsXG5cdFx0XHRcdFx0JG9mZnNldFBhcmVudDogJG9mZnNldFBhcmVudCxcblx0XHRcdFx0XHRpc0ZpeGVkOiAkdGhpcy5jc3MoJ2JhY2tncm91bmQtYXR0YWNobWVudCcpID09PSAnZml4ZWQnLFxuXHRcdFx0XHRcdGhvcml6b250YWxPZmZzZXQ6IGhvcml6b250YWxPZmZzZXQsXG5cdFx0XHRcdFx0dmVydGljYWxPZmZzZXQ6IHZlcnRpY2FsT2Zmc2V0LFxuXHRcdFx0XHRcdHN0YXJ0aW5nVmFsdWVMZWZ0OiBiYWNrZ3JvdW5kUG9zaXRpb25bMF0sXG5cdFx0XHRcdFx0c3RhcnRpbmdWYWx1ZVRvcDogYmFja2dyb3VuZFBvc2l0aW9uWzFdLFxuXHRcdFx0XHRcdHN0YXJ0aW5nQmFja2dyb3VuZFBvc2l0aW9uTGVmdDogKGlzTmFOKHBhcnNlSW50KGJhY2tncm91bmRQb3NpdGlvblswXSwgMTApKSA/IDAgOiBwYXJzZUludChiYWNrZ3JvdW5kUG9zaXRpb25bMF0sIDEwKSksXG5cdFx0XHRcdFx0c3RhcnRpbmdCYWNrZ3JvdW5kUG9zaXRpb25Ub3A6IChpc05hTihwYXJzZUludChiYWNrZ3JvdW5kUG9zaXRpb25bMV0sIDEwKSkgPyAwIDogcGFyc2VJbnQoYmFja2dyb3VuZFBvc2l0aW9uWzFdLCAxMCkpLFxuXHRcdFx0XHRcdHN0YXJ0aW5nUG9zaXRpb25MZWZ0OiAkdGhpcy5wb3NpdGlvbigpLmxlZnQsXG5cdFx0XHRcdFx0c3RhcnRpbmdQb3NpdGlvblRvcDogJHRoaXMucG9zaXRpb24oKS50b3AsXG5cdFx0XHRcdFx0c3RhcnRpbmdPZmZzZXRMZWZ0OiBvZmZzZXRMZWZ0LFxuXHRcdFx0XHRcdHN0YXJ0aW5nT2Zmc2V0VG9wOiBvZmZzZXRUb3AsXG5cdFx0XHRcdFx0cGFyZW50T2Zmc2V0TGVmdDogcGFyZW50T2Zmc2V0TGVmdCxcblx0XHRcdFx0XHRwYXJlbnRPZmZzZXRUb3A6IHBhcmVudE9mZnNldFRvcCxcblx0XHRcdFx0XHRzdGVsbGFyUmF0aW86ICgkdGhpcy5kYXRhKCdzdGVsbGFyLWJhY2tncm91bmQtcmF0aW8nKSA9PT0gdW5kZWZpbmVkID8gMSA6ICR0aGlzLmRhdGEoJ3N0ZWxsYXItYmFja2dyb3VuZC1yYXRpbycpKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0X3Jlc2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwYXJ0aWNsZSxcblx0XHRcdFx0c3RhcnRpbmdQb3NpdGlvbkxlZnQsXG5cdFx0XHRcdHN0YXJ0aW5nUG9zaXRpb25Ub3AsXG5cdFx0XHRcdGJhY2tncm91bmQsXG5cdFx0XHRcdGk7XG5cblx0XHRcdGZvciAoaSA9IHRoaXMucGFydGljbGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHBhcnRpY2xlID0gdGhpcy5wYXJ0aWNsZXNbaV07XG5cdFx0XHRcdHN0YXJ0aW5nUG9zaXRpb25MZWZ0ID0gcGFydGljbGUuJGVsZW1lbnQuZGF0YSgnc3RlbGxhci1zdGFydGluZ0xlZnQnKTtcblx0XHRcdFx0c3RhcnRpbmdQb3NpdGlvblRvcCA9IHBhcnRpY2xlLiRlbGVtZW50LmRhdGEoJ3N0ZWxsYXItc3RhcnRpbmdUb3AnKTtcblxuXHRcdFx0XHR0aGlzLl9zZXRQb3NpdGlvbihwYXJ0aWNsZS4kZWxlbWVudCwgc3RhcnRpbmdQb3NpdGlvbkxlZnQsIHN0YXJ0aW5nUG9zaXRpb25MZWZ0LCBzdGFydGluZ1Bvc2l0aW9uVG9wLCBzdGFydGluZ1Bvc2l0aW9uVG9wKTtcblxuXHRcdFx0XHR0aGlzLm9wdGlvbnMuc2hvd0VsZW1lbnQocGFydGljbGUuJGVsZW1lbnQpO1xuXG5cdFx0XHRcdHBhcnRpY2xlLiRlbGVtZW50LmRhdGEoJ3N0ZWxsYXItc3RhcnRpbmdMZWZ0JywgbnVsbCkuZGF0YSgnc3RlbGxhci1lbGVtZW50SXNBY3RpdmUnLCBudWxsKS5kYXRhKCdzdGVsbGFyLWJhY2tncm91bmRJc0FjdGl2ZScsIG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGkgPSB0aGlzLmJhY2tncm91bmRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdGJhY2tncm91bmQgPSB0aGlzLmJhY2tncm91bmRzW2ldO1xuXG5cdFx0XHRcdGJhY2tncm91bmQuJGVsZW1lbnQuZGF0YSgnc3RlbGxhci1iYWNrZ3JvdW5kU3RhcnRpbmdMZWZ0JywgbnVsbCkuZGF0YSgnc3RlbGxhci1iYWNrZ3JvdW5kU3RhcnRpbmdUb3AnLCBudWxsKTtcblxuXHRcdFx0XHRzZXRCYWNrZ3JvdW5kUG9zaXRpb24oYmFja2dyb3VuZC4kZWxlbWVudCwgYmFja2dyb3VuZC5zdGFydGluZ1ZhbHVlTGVmdCwgYmFja2dyb3VuZC5zdGFydGluZ1ZhbHVlVG9wKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5fcmVzZXQoKTtcblxuXHRcdFx0dGhpcy4kc2Nyb2xsRWxlbWVudC51bmJpbmQoJ3Jlc2l6ZS4nICsgdGhpcy5uYW1lKS51bmJpbmQoJ3Njcm9sbC4nICsgdGhpcy5uYW1lKTtcblx0XHRcdHRoaXMuX2FuaW1hdGlvbkxvb3AgPSAkLm5vb3A7XG5cblx0XHRcdCQod2luZG93KS51bmJpbmQoJ2xvYWQuJyArIHRoaXMubmFtZSkudW5iaW5kKCdyZXNpemUuJyArIHRoaXMubmFtZSk7XG5cdFx0fSxcblx0XHRfc2V0T2Zmc2V0czogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdCR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cblx0XHRcdCR3aW5kb3cudW5iaW5kKCdyZXNpemUuaG9yaXpvbnRhbC0nICsgdGhpcy5uYW1lKS51bmJpbmQoJ3Jlc2l6ZS52ZXJ0aWNhbC0nICsgdGhpcy5uYW1lKTtcblxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbE9mZnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aGlzLmhvcml6b250YWxPZmZzZXQgPSB0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbE9mZnNldCgpO1xuXHRcdFx0XHQkd2luZG93LmJpbmQoJ3Jlc2l6ZS5ob3Jpem9udGFsLScgKyB0aGlzLm5hbWUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNlbGYuaG9yaXpvbnRhbE9mZnNldCA9IHNlbGYub3B0aW9ucy5ob3Jpem9udGFsT2Zmc2V0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5ob3Jpem9udGFsT2Zmc2V0ID0gdGhpcy5vcHRpb25zLmhvcml6b250YWxPZmZzZXQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnZlcnRpY2FsT2Zmc2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMudmVydGljYWxPZmZzZXQgPSB0aGlzLm9wdGlvbnMudmVydGljYWxPZmZzZXQoKTtcblx0XHRcdFx0JHdpbmRvdy5iaW5kKCdyZXNpemUudmVydGljYWwtJyArIHRoaXMubmFtZSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c2VsZi52ZXJ0aWNhbE9mZnNldCA9IHNlbGYub3B0aW9ucy52ZXJ0aWNhbE9mZnNldCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMudmVydGljYWxPZmZzZXQgPSB0aGlzLm9wdGlvbnMudmVydGljYWxPZmZzZXQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRfcmVwb3NpdGlvbkVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fZ2V0U2Nyb2xsTGVmdCgpLFxuXHRcdFx0XHRzY3JvbGxUb3AgPSB0aGlzLl9nZXRTY3JvbGxUb3AoKSxcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldCxcblx0XHRcdFx0dmVydGljYWxPZmZzZXQsXG5cdFx0XHRcdHBhcnRpY2xlLFxuXHRcdFx0XHRmaXhlZFJhdGlvT2Zmc2V0LFxuXHRcdFx0XHRiYWNrZ3JvdW5kLFxuXHRcdFx0XHRiZ0xlZnQsXG5cdFx0XHRcdGJnVG9wLFxuXHRcdFx0XHRpc1Zpc2libGVWZXJ0aWNhbCA9IHRydWUsXG5cdFx0XHRcdGlzVmlzaWJsZUhvcml6b250YWwgPSB0cnVlLFxuXHRcdFx0XHRuZXdQb3NpdGlvbkxlZnQsXG5cdFx0XHRcdG5ld1Bvc2l0aW9uVG9wLFxuXHRcdFx0XHRuZXdPZmZzZXRMZWZ0LFxuXHRcdFx0XHRuZXdPZmZzZXRUb3AsXG5cdFx0XHRcdGk7XG5cblx0XHRcdC8vIEZpcnN0IGNoZWNrIHRoYXQgdGhlIHNjcm9sbCBwb3NpdGlvbiBvciBjb250YWluZXIgc2l6ZSBoYXMgY2hhbmdlZFxuXHRcdFx0aWYgKHRoaXMuY3VycmVudFNjcm9sbExlZnQgPT09IHNjcm9sbExlZnQgJiYgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID09PSBzY3JvbGxUb3AgJiYgdGhpcy5jdXJyZW50V2lkdGggPT09IHRoaXMudmlld3BvcnRXaWR0aCAmJiB0aGlzLmN1cnJlbnRIZWlnaHQgPT09IHRoaXMudmlld3BvcnRIZWlnaHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5jdXJyZW50U2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG5cdFx0XHRcdHRoaXMuY3VycmVudFNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcblx0XHRcdFx0dGhpcy5jdXJyZW50V2lkdGggPSB0aGlzLnZpZXdwb3J0V2lkdGg7XG5cdFx0XHRcdHRoaXMuY3VycmVudEhlaWdodCA9IHRoaXMudmlld3BvcnRIZWlnaHQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlcG9zaXRpb24gZWxlbWVudHNcblx0XHRcdGZvciAoaSA9IHRoaXMucGFydGljbGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHBhcnRpY2xlID0gdGhpcy5wYXJ0aWNsZXNbaV07XG5cblx0XHRcdFx0Zml4ZWRSYXRpb09mZnNldCA9IChwYXJ0aWNsZS5pc0ZpeGVkID8gMSA6IDApO1xuXG5cdFx0XHRcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiwgdGhlbiBjYWxjdWxhdGUgd2hhdCB0aGUgcGFydGljbGUncyBuZXcgb2Zmc2V0IHdpbGwgYmUgKGZvciB2aXNpYmlsaXR5IGNoZWNrKVxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLmhvcml6b250YWxTY3JvbGxpbmcpIHtcblx0XHRcdFx0XHRuZXdQb3NpdGlvbkxlZnQgPSAoc2Nyb2xsTGVmdCArIHBhcnRpY2xlLmhvcml6b250YWxPZmZzZXQgKyB0aGlzLnZpZXdwb3J0T2Zmc2V0TGVmdCArIHBhcnRpY2xlLnN0YXJ0aW5nUG9zaXRpb25MZWZ0IC0gcGFydGljbGUuc3RhcnRpbmdPZmZzZXRMZWZ0ICsgcGFydGljbGUucGFyZW50T2Zmc2V0TGVmdCkgKiAtKHBhcnRpY2xlLnN0ZWxsYXJSYXRpbyArIGZpeGVkUmF0aW9PZmZzZXQgLSAxKSArIHBhcnRpY2xlLnN0YXJ0aW5nUG9zaXRpb25MZWZ0O1xuXHRcdFx0XHRcdG5ld09mZnNldExlZnQgPSBuZXdQb3NpdGlvbkxlZnQgLSBwYXJ0aWNsZS5zdGFydGluZ1Bvc2l0aW9uTGVmdCArIHBhcnRpY2xlLnN0YXJ0aW5nT2Zmc2V0TGVmdDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXdQb3NpdGlvbkxlZnQgPSBwYXJ0aWNsZS5zdGFydGluZ1Bvc2l0aW9uTGVmdDtcblx0XHRcdFx0XHRuZXdPZmZzZXRMZWZ0ID0gcGFydGljbGUuc3RhcnRpbmdPZmZzZXRMZWZ0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMub3B0aW9ucy52ZXJ0aWNhbFNjcm9sbGluZykge1xuXHRcdFx0XHRcdG5ld1Bvc2l0aW9uVG9wID0gKHNjcm9sbFRvcCArIHBhcnRpY2xlLnZlcnRpY2FsT2Zmc2V0ICsgdGhpcy52aWV3cG9ydE9mZnNldFRvcCArIHBhcnRpY2xlLnN0YXJ0aW5nUG9zaXRpb25Ub3AgLSBwYXJ0aWNsZS5zdGFydGluZ09mZnNldFRvcCArIHBhcnRpY2xlLnBhcmVudE9mZnNldFRvcCkgKiAtKHBhcnRpY2xlLnN0ZWxsYXJSYXRpbyArIGZpeGVkUmF0aW9PZmZzZXQgLSAxKSArIHBhcnRpY2xlLnN0YXJ0aW5nUG9zaXRpb25Ub3A7XG5cdFx0XHRcdFx0bmV3T2Zmc2V0VG9wID0gbmV3UG9zaXRpb25Ub3AgLSBwYXJ0aWNsZS5zdGFydGluZ1Bvc2l0aW9uVG9wICsgcGFydGljbGUuc3RhcnRpbmdPZmZzZXRUb3A7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3UG9zaXRpb25Ub3AgPSBwYXJ0aWNsZS5zdGFydGluZ1Bvc2l0aW9uVG9wO1xuXHRcdFx0XHRcdG5ld09mZnNldFRvcCA9IHBhcnRpY2xlLnN0YXJ0aW5nT2Zmc2V0VG9wO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ2hlY2sgdmlzaWJpbGl0eVxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLmhpZGVEaXN0YW50RWxlbWVudHMpIHtcblx0XHRcdFx0XHRpc1Zpc2libGVIb3Jpem9udGFsID0gIXRoaXMub3B0aW9ucy5ob3Jpem9udGFsU2Nyb2xsaW5nIHx8IG5ld09mZnNldExlZnQgKyBwYXJ0aWNsZS53aWR0aCA+IChwYXJ0aWNsZS5pc0ZpeGVkID8gMCA6IHNjcm9sbExlZnQpICYmIG5ld09mZnNldExlZnQgPCAocGFydGljbGUuaXNGaXhlZCA/IDAgOiBzY3JvbGxMZWZ0KSArIHRoaXMudmlld3BvcnRXaWR0aCArIHRoaXMudmlld3BvcnRPZmZzZXRMZWZ0O1xuXHRcdFx0XHRcdGlzVmlzaWJsZVZlcnRpY2FsID0gIXRoaXMub3B0aW9ucy52ZXJ0aWNhbFNjcm9sbGluZyB8fCBuZXdPZmZzZXRUb3AgKyBwYXJ0aWNsZS5oZWlnaHQgPiAocGFydGljbGUuaXNGaXhlZCA/IDAgOiBzY3JvbGxUb3ApICYmIG5ld09mZnNldFRvcCA8IChwYXJ0aWNsZS5pc0ZpeGVkID8gMCA6IHNjcm9sbFRvcCkgKyB0aGlzLnZpZXdwb3J0SGVpZ2h0ICsgdGhpcy52aWV3cG9ydE9mZnNldFRvcDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpc1Zpc2libGVIb3Jpem9udGFsICYmIGlzVmlzaWJsZVZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0aWYgKHBhcnRpY2xlLmlzSGlkZGVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2hvd0VsZW1lbnQocGFydGljbGUuJGVsZW1lbnQpO1xuXHRcdFx0XHRcdFx0cGFydGljbGUuaXNIaWRkZW4gPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLl9zZXRQb3NpdGlvbihwYXJ0aWNsZS4kZWxlbWVudCwgbmV3UG9zaXRpb25MZWZ0LCBwYXJ0aWNsZS5zdGFydGluZ1Bvc2l0aW9uTGVmdCwgbmV3UG9zaXRpb25Ub3AsIHBhcnRpY2xlLnN0YXJ0aW5nUG9zaXRpb25Ub3ApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICghcGFydGljbGUuaXNIaWRkZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMub3B0aW9ucy5oaWRlRWxlbWVudChwYXJ0aWNsZS4kZWxlbWVudCk7XG5cdFx0XHRcdFx0XHRwYXJ0aWNsZS5pc0hpZGRlbiA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlcG9zaXRpb24gYmFja2dyb3VuZHNcblx0XHRcdGZvciAoaSA9IHRoaXMuYmFja2dyb3VuZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0YmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZHNbaV07XG5cblx0XHRcdFx0Zml4ZWRSYXRpb09mZnNldCA9IChiYWNrZ3JvdW5kLmlzRml4ZWQgPyAwIDogMSk7XG5cdFx0XHRcdGJnTGVmdCA9ICh0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbFNjcm9sbGluZyA/IChzY3JvbGxMZWZ0ICsgYmFja2dyb3VuZC5ob3Jpem9udGFsT2Zmc2V0IC0gdGhpcy52aWV3cG9ydE9mZnNldExlZnQgLSBiYWNrZ3JvdW5kLnN0YXJ0aW5nT2Zmc2V0TGVmdCArIGJhY2tncm91bmQucGFyZW50T2Zmc2V0TGVmdCAtIGJhY2tncm91bmQuc3RhcnRpbmdCYWNrZ3JvdW5kUG9zaXRpb25MZWZ0KSAqIChmaXhlZFJhdGlvT2Zmc2V0IC0gYmFja2dyb3VuZC5zdGVsbGFyUmF0aW8pICsgJ3B4JyA6IGJhY2tncm91bmQuc3RhcnRpbmdWYWx1ZUxlZnQpO1xuXHRcdFx0XHRiZ1RvcCA9ICh0aGlzLm9wdGlvbnMudmVydGljYWxTY3JvbGxpbmcgPyAoc2Nyb2xsVG9wICsgYmFja2dyb3VuZC52ZXJ0aWNhbE9mZnNldCAtIHRoaXMudmlld3BvcnRPZmZzZXRUb3AgLSBiYWNrZ3JvdW5kLnN0YXJ0aW5nT2Zmc2V0VG9wICsgYmFja2dyb3VuZC5wYXJlbnRPZmZzZXRUb3AgLSBiYWNrZ3JvdW5kLnN0YXJ0aW5nQmFja2dyb3VuZFBvc2l0aW9uVG9wKSAqIChmaXhlZFJhdGlvT2Zmc2V0IC0gYmFja2dyb3VuZC5zdGVsbGFyUmF0aW8pICsgJ3B4JyA6IGJhY2tncm91bmQuc3RhcnRpbmdWYWx1ZVRvcCk7XG5cblx0XHRcdFx0c2V0QmFja2dyb3VuZFBvc2l0aW9uKGJhY2tncm91bmQuJGVsZW1lbnQsIGJnTGVmdCwgYmdUb3ApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0X2hhbmRsZVNjcm9sbEV2ZW50OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0dGlja2luZyA9IGZhbHNlO1xuXG5cdFx0XHR2YXIgdXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuX3JlcG9zaXRpb25FbGVtZW50cygpO1xuXHRcdFx0XHR0aWNraW5nID0gZmFsc2U7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCF0aWNraW5nKSB7XG5cdFx0XHRcdFx0cmVxdWVzdEFuaW1GcmFtZSh1cGRhdGUpO1xuXHRcdFx0XHRcdHRpY2tpbmcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHR0aGlzLiRzY3JvbGxFbGVtZW50LmJpbmQoJ3Njcm9sbC4nICsgdGhpcy5uYW1lLCByZXF1ZXN0VGljayk7XG5cdFx0XHRyZXF1ZXN0VGljaygpO1xuXHRcdH0sXG5cdFx0X3N0YXJ0QW5pbWF0aW9uTG9vcDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuX2FuaW1hdGlvbkxvb3AgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVxdWVzdEFuaW1GcmFtZShzZWxmLl9hbmltYXRpb25Mb29wKTtcblx0XHRcdFx0c2VsZi5fcmVwb3NpdGlvbkVsZW1lbnRzKCk7XG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fYW5pbWF0aW9uTG9vcCgpO1xuXHRcdH1cblx0fTtcblxuXHQkLmZuW3BsdWdpbk5hbWVdID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHRpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICghJC5kYXRhKHRoaXMsICdwbHVnaW5fJyArIHBsdWdpbk5hbWUpKSB7XG5cdFx0XHRcdFx0JC5kYXRhKHRoaXMsICdwbHVnaW5fJyArIHBsdWdpbk5hbWUsIG5ldyBQbHVnaW4odGhpcywgb3B0aW9ucykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyAmJiBvcHRpb25zWzBdICE9PSAnXycgJiYgb3B0aW9ucyAhPT0gJ2luaXQnKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsICdwbHVnaW5fJyArIHBsdWdpbk5hbWUpO1xuXHRcdFx0XHRpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBQbHVnaW4gJiYgdHlwZW9mIGluc3RhbmNlW29wdGlvbnNdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0aW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob3B0aW9ucyA9PT0gJ2Rlc3Ryb3knKSB7XG5cdFx0XHRcdFx0JC5kYXRhKHRoaXMsICdwbHVnaW5fJyArIHBsdWdpbk5hbWUsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0JFtwbHVnaW5OYW1lXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblx0XHRyZXR1cm4gJHdpbmRvdy5zdGVsbGFyLmFwcGx5KCR3aW5kb3csIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuXHR9O1xuXG5cdC8vIEV4cG9zZSB0aGUgc2Nyb2xsIGFuZCBwb3NpdGlvbiBwcm9wZXJ0eSBmdW5jdGlvbiBoYXNoZXMgc28gdGhleSBjYW4gYmUgZXh0ZW5kZWRcblx0JFtwbHVnaW5OYW1lXS5zY3JvbGxQcm9wZXJ0eSA9IHNjcm9sbFByb3BlcnR5O1xuXHQkW3BsdWdpbk5hbWVdLnBvc2l0aW9uUHJvcGVydHkgPSBwb3NpdGlvblByb3BlcnR5O1xuXG5cdC8vIEV4cG9zZSB0aGUgcGx1Z2luIGNsYXNzIHNvIGl0IGNhbiBiZSBtb2RpZmllZFxuXHR3aW5kb3cuU3RlbGxhciA9IFBsdWdpbjtcbn0oalF1ZXJ5LCB0aGlzLCBkb2N1bWVudCkpOyIsIi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbioganF1ZXJ5IGxpZ2h0R2FsbGVyeS5qcyB2MS4xLjUgLy8gMy8yOS8yMDE1XG4qIGh0dHA6Ly9zYWNoaW5jaG9vbHVyLmdpdGh1Yi5pby9saWdodEdhbGxlcnkvXG4qIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAtIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5odG1sICAtLS0tIEZSRUUgLS0tLVxuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vKiovXG47XG4oZnVuY3Rpb24gKCQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAkLmZuLmxpZ2h0R2FsbGVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBtb2RlOiAnc2xpZGUnLFxuICAgICAgICAgICAgICAgIHVzZUNTUzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjc3NFYXNpbmc6ICdlYXNlJywgLy8nY3ViaWMtYmV6aWVyKDAuMjUsIDAsIDAuMjUsIDEpJywvL1xuICAgICAgICAgICAgICAgIGVhc2luZzogJ2xpbmVhcicsIC8vJ2ZvciBqcXVlcnkgYW5pbWF0aW9uJywvL1xuICAgICAgICAgICAgICAgIHNwZWVkOiA2MDAsXG4gICAgICAgICAgICAgICAgYWRkQ2xhc3M6ICcnLFxuXG4gICAgICAgICAgICAgICAgY2xvc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXV0bzogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGF1c2U6IDQwMDAsXG4gICAgICAgICAgICAgICAgZXNjS2V5OiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpZGVDb250cm9sT25FbmQ6IGZhbHNlLFxuXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogMSwgLy9udW1iZXIgb2YgcHJlbG9hZCBzbGlkZXMuIHdpbGwgZXhpY3V0ZSBvbmx5IGFmdGVyIHRoZSBjdXJyZW50IHNsaWRlIGlzIGZ1bGx5IGxvYWRlZC4gZXg6Ly8geW91IGNsaWNrZWQgb24gNHRoIGltYWdlIGFuZCBpZiBwcmVsb2FkID0gMSB0aGVuIDNyZCBzbGlkZSBhbmQgNXRoIHNsaWRlIHdpbGwgYmUgbG9hZGVkIGluIHRoZSBiYWNrZ3JvdW5kIGFmdGVyIHRoZSA0dGggc2xpZGUgaXMgZnVsbHkgbG9hZGVkLi4gaWYgcHJlbG9hZCBpcyAyIHRoZW4gMm5kIDNyZCA1dGggNnRoIHNsaWRlcyB3aWxsIGJlIHByZWxvYWRlZC4uIC4uLiAuLi5cbiAgICAgICAgICAgICAgICBzaG93QWZ0ZXJMb2FkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBudWxsLFxuICAgICAgICAgICAgICAgIGluZGV4OiBmYWxzZSxcblxuICAgICAgICAgICAgICAgIGxhbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsUGhvdG9zOiAnQWxsIHBob3RvcydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvdW50ZXI6IGZhbHNlLFxuXG4gICAgICAgICAgICAgICAgZXhUaHVtYkltYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aHVtYm5haWw6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1RodW1iQnlEZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbmltYXRlVGh1bWI6IHRydWUsXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2VyUG9zaXRpb246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHRodW1iV2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICB0aHVtYk1hcmdpbjogNSxcblxuXG4gICAgICAgICAgICAgICAgbW9iaWxlU3JjOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVTcmNNYXhXaWR0aDogNjQwLFxuICAgICAgICAgICAgICAgIHN3aXBlVGhyZXNob2xkOiA1MCxcbiAgICAgICAgICAgICAgICBlbmFibGVUb3VjaDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbmFibGVEcmFnOiB0cnVlLFxuXG4gICAgICAgICAgICAgICAgdmltZW9Db2xvcjogJ0NDQ0NDQycsXG4gICAgICAgICAgICAgICAgeW91dHViZVBsYXllclBhcmFtczogZmFsc2UsIC8vIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20veW91dHViZS9wbGF5ZXJfcGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgIHZpZGVvQXV0b3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgdmlkZW9NYXhXaWR0aDogJzg1NXB4JyxcblxuICAgICAgICAgICAgICAgIGR5bmFtaWM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGR5bmFtaWNFbDogW10sXG4gICAgICAgICAgICAgICAgLy9jYWxsYmFja3NcblxuICAgICAgICAgICAgICAgIG9uT3BlbjogZnVuY3Rpb24gKHBsdWdpbikge30sXG4gICAgICAgICAgICAgICAgb25TbGlkZUJlZm9yZTogZnVuY3Rpb24gKHBsdWdpbikge30sXG4gICAgICAgICAgICAgICAgb25TbGlkZUFmdGVyOiBmdW5jdGlvbiAocGx1Z2luKSB7fSxcbiAgICAgICAgICAgICAgICBvblNsaWRlTmV4dDogZnVuY3Rpb24gKHBsdWdpbikge30sXG4gICAgICAgICAgICAgICAgb25TbGlkZVByZXY6IGZ1bmN0aW9uIChwbHVnaW4pIHt9LFxuICAgICAgICAgICAgICAgIG9uQmVmb3JlQ2xvc2U6IGZ1bmN0aW9uIChwbHVnaW4pIHt9LFxuICAgICAgICAgICAgICAgIG9uQ2xvc2VBZnRlcjogZnVuY3Rpb24gKHBsdWdpbikge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbCA9ICQodGhpcyksXG4gICAgICAgICAgICBwbHVnaW4gPSB0aGlzLFxuICAgICAgICAgICAgJGNoaWxkcmVuID0gbnVsbCxcbiAgICAgICAgICAgIGluZGV4ID0gMCxcbiAgICAgICAgICAgIGlzQWN0aXZlID0gZmFsc2UsXG4gICAgICAgICAgICBsaWdodEdhbGxlcnlPbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNUb3VjaCA9IGRvY3VtZW50LmNyZWF0ZVRvdWNoICE9PSB1bmRlZmluZWQgfHwgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgKCdvbm1zZ2VzdHVyZWNoYW5nZScgaW4gd2luZG93KSB8fCBuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyxcbiAgICAgICAgICAgICRnYWxsZXJ5LCAkZ2FsbGVyeUNvbnQsICRzbGlkZXIsICRzbGlkZSwgJHByZXYsICRuZXh0LCBwcmV2SW5kZXgsICR0aHVtYl9jb250LCAkdGh1bWIsIHdpbmRvd1dpZHRoLCBpbnRlcnZhbCwgdXNpbmdUaHVtYiA9IGZhbHNlLFxuICAgICAgICAgICAgYVRpbWluZyA9IGZhbHNlLFxuICAgICAgICAgICAgYVNwZWVkID0gZmFsc2U7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIHZhciBsaWdodEdhbGxlcnkgPSB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZWwuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5keW5hbWljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4gPSBzZXR0aW5ncy5keW5hbWljRWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFVwLmluaXQoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnNlbGVjdG9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNoaWxkcmVuID0gJChzZXR0aW5ncy5zZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjaGlsZHJlbiA9ICR0aGlzLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3Muc2VsZWN0b3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNoaWxkcmVuID0gJChzZXR0aW5ncy5zZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNoaWxkcmVuID0gJHRoaXMuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkY2hpbGRyZW4uaW5kZXgodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VXAuaW5pdChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgc2V0VXAgPSB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RydWN0dXJlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRXaWR0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VTbGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1N0YXJ0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudGVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVRvKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZFRodW1ibmFpbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMua2V5UHJlc3MoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZShzZXR0aW5ncy5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZVRodW1iKHNldHRpbmdzLmluZGV4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlVGh1bWIoaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZW5hYmxlRHJhZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdWNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5lbmFibGVUb3VjaCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZVRvdWNoKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LmFkZENsYXNzKCdvcGFjaXR5Jyk7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cnVjdHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoJzxkaXYgaWQ9XCJsZy1vdXRlclwiIGNsYXNzPVwiJyArIHNldHRpbmdzLmFkZENsYXNzICsgJ1wiPjxkaXYgaWQ9XCJsZy1nYWxsZXJ5XCI+PGRpdiBpZD1cImxnLXNsaWRlclwiPjwvZGl2PjxhIGlkPVwibGctY2xvc2VcIiBjbGFzcz1cImNsb3NlXCI+PC9hPjwvZGl2PjwvZGl2PicpLmFkZENsYXNzKCdsaWdodC1nYWxsZXJ5Jyk7XG4gICAgICAgICAgICAgICAgJGdhbGxlcnlDb250ID0gJCgnI2xnLW91dGVyJyk7XG4gICAgICAgICAgICAgICAgJGdhbGxlcnkgPSAkKCcjbGctZ2FsbGVyeScpO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5zaG93QWZ0ZXJMb2FkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LmFkZENsYXNzKCdzaG93LWFmdGVyLWxvYWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHNsaWRlciA9ICRnYWxsZXJ5LmZpbmQoJyNsZy1zbGlkZXInKTtcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVMaXN0ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmR5bmFtaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXR0aW5ncy5keW5hbWljRWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlTGlzdCArPSAnPGRpdiBjbGFzcz1cImxnLXNsaWRlXCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRjaGlsZHJlbi5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlTGlzdCArPSAnPGRpdiBjbGFzcz1cImxnLXNsaWRlXCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzbGlkZXIuYXBwZW5kKHNsaWRlTGlzdCk7XG4gICAgICAgICAgICAgICAgJHNsaWRlID0gJGdhbGxlcnkuZmluZCgnLmxnLXNsaWRlJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2VTbGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNsZy1vdXRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KS5pcygnLmxnLXNsaWRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3koZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKCcjbGctY2xvc2UnKS5iaW5kKCdjbGljayB0b3VjaGVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3koZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFdpZHRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc2l6ZVdpbmRvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICQod2luZG93KS5iaW5kKCdyZXNpemUubGlnaHRHYWxsZXJ5JywgcmVzaXplV2luZG93KCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvQ3NzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1cHBvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gWyd0cmFuc2l0aW9uJywgJ01velRyYW5zaXRpb24nLCAnV2Via2l0VHJhbnNpdGlvbicsICdPVHJhbnNpdGlvbicsICdtc1RyYW5zaXRpb24nLCAnS2h0bWxUcmFuc2l0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyYW5zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uW2ldIGluIHJvb3Quc3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnVzZUNTUyAmJiBzdXBwb3J0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmFibGVUb3VjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0Q29vcmRzID0ge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb29yZHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCd0b3VjaHN0YXJ0LmxpZ2h0R2FsbGVyeScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb29yZHMgPSBlLm9yaWdpbmFsRXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29vcmRzLnBhZ2VYID0gZS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvb3Jkcy5wYWdlWSA9IGUub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCd0b3VjaG1vdmUubGlnaHRHYWxsZXJ5JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcmlnID0gZS5vcmlnaW5hbEV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29vcmRzID0gb3JpZy50YXJnZXRUb3VjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCd0b3VjaGVuZC5saWdodEdhbGxlcnknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gZW5kQ29vcmRzLnBhZ2VYIC0gc3RhcnRDb29yZHMucGFnZVgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpcGVUaHJlc2hvbGQgPSBzZXR0aW5ncy5zd2lwZVRocmVzaG9sZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+PSBzd2lwZVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnByZXZTbGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA8PSAtc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXh0U2xpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvdWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHhTdGFydCwgeEVuZDtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQoJy5saWdodC1nYWxsZXJ5JykuYmluZCgnbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB4U3RhcnQgPSBlLnBhZ2VYO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJy5saWdodC1nYWxsZXJ5JykuYmluZCgnbW91c2V1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgeEVuZCA9IGUucGFnZVg7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4RW5kIC0geFN0YXJ0ID4gMjApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnByZXZTbGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHhTdGFydCAtIHhFbmQgPiAyMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMubmV4dFNsaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc1ZpZGVvOiBmdW5jdGlvbiAoc3JjLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciB5b3V0dWJlID0gc3JjLm1hdGNoKC9cXC9cXC8oPzp3d3dcXC4pP3lvdXR1KD86XFwuYmV8YmVcXC5jb20pXFwvKD86d2F0Y2hcXD92PXxlbWJlZFxcLyk/KFthLXowLTlfXFwtXSspL2kpO1xuICAgICAgICAgICAgICAgIHZhciB2aW1lbyA9IHNyYy5tYXRjaCgvXFwvXFwvKD86d3d3XFwuKT92aW1lby5jb21cXC8oWzAtOWEtelxcLV9dKykvaSk7XG4gICAgICAgICAgICAgICAgdmFyIGlmcmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5keW5hbWljKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5keW5hbWljRWxbaW5kZXhdLmlmcmFtZSA9PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmcmFtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGNoaWxkcmVuLmVxKGluZGV4KS5hdHRyKCdkYXRhLWlmcmFtZScpID09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWZyYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoeW91dHViZSB8fCB2aW1lbyB8fCBpZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRWaWRlbzogZnVuY3Rpb24gKHNyYywgX2lkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHlvdXR1YmUgPSBzcmMubWF0Y2goL1xcL1xcLyg/Ond3d1xcLik/eW91dHUoPzpcXC5iZXxiZVxcLmNvbSlcXC8oPzp3YXRjaFxcP3Y9fGVtYmVkXFwvKT8oW2EtejAtOV9cXC1dKykvaSk7XG4gICAgICAgICAgICAgICAgdmFyIHZpbWVvID0gc3JjLm1hdGNoKC9cXC9cXC8oPzp3d3dcXC4pP3ZpbWVvLmNvbVxcLyhbMC05YS16XFwtX10rKS9pKTtcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSAnJztcbiAgICAgICAgICAgICAgICB2YXIgYSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh5b3V0dWJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy52aWRlb0F1dG9wbGF5ID09PSB0cnVlICYmIGxpZ2h0R2FsbGVyeU9uID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYSA9ICc/YXV0b3BsYXk9MSZyZWw9MCZ3bW9kZT1vcGFxdWUnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYSA9ICc/d21vZGU9b3BhcXVlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy55b3V0dWJlUGxheWVyUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeW91dHViZVBhcmFtcyA9ICQucGFyYW0oc2V0dGluZ3MueW91dHViZVBsYXllclBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gYSArICcmJyArIHlvdXR1YmVQYXJhbXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2aWRlbyA9ICc8aWZyYW1lIGNsYXNzPVwib2JqZWN0XCIgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCIvL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgeW91dHViZVsxXSArIGEgKyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2aW1lbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmlkZW9BdXRvcGxheSA9PT0gdHJ1ZSAmJiBsaWdodEdhbGxlcnlPbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSAnYXV0b3BsYXk9MSZhbXA7JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2aWRlbyA9ICc8aWZyYW1lIGNsYXNzPVwib2JqZWN0XCIgaWQ9XCJ2aWRlbycgKyBfaWQgKyAnXCIgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiAgc3JjPVwiaHR0cDovL3BsYXllci52aW1lby5jb20vdmlkZW8vJyArIHZpbWVvWzFdICsgJz8nICsgYSArICdieWxpbmU9MCZhbXA7cG9ydHJhaXQ9MCZhbXA7Y29sb3I9JyArIHNldHRpbmdzLnZpbWVvQ29sb3IgKyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0QWxsb3dGdWxsU2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd0Z1bGxTY3JlZW4+PC9pZnJhbWU+JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2aWRlbyA9ICc8aWZyYW1lIGNsYXNzPVwib2JqZWN0XCIgZnJhbWVib3JkZXI9XCIwXCIgc3JjPVwiJyArIHNyYyArICdcIiAgYWxsb3dmdWxsc2NyZWVuPVwidHJ1ZVwiPjwvaWZyYW1lPic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRcIiBzdHlsZT1cIm1heC13aWR0aDonICsgc2V0dGluZ3MudmlkZW9NYXhXaWR0aCArICcgIWltcG9ydGFudDtcIj48ZGl2IGNsYXNzPVwidmlkZW9cIj4nICsgdmlkZW8gKyAnPC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRIdG1sOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVN1Ykh0bWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5keW5hbWljKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdWJIdG1sID0gc2V0dGluZ3MuZHluYW1pY0VsW2luZGV4XVsnc3ViLWh0bWwnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3ViSHRtbCA9ICRjaGlsZHJlbi5lcShpbmRleCkuYXR0cignZGF0YS1zdWItaHRtbCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGFTdWJIdG1sICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhU3ViSHRtbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZkwgPSBkYXRhU3ViSHRtbC5zdWJzdHJpbmcoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmTCA9PSAnLicgfHwgZkwgPT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU3ViSHRtbCA9ICQoZGF0YVN1Ykh0bWwpLmh0bWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTdWJIdG1sID0gZGF0YVN1Ykh0bWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5hcHBlbmQoZGF0YVN1Ykh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmVsb2FkOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8PSBzZXR0aW5ncy5wcmVsb2FkOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPj0gJGNoaWxkcmVuLmxlbmd0aCAtIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KG5ld0luZGV4ICsgaywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGggPSAwOyBoIDw9IHNldHRpbmdzLnByZWxvYWQ7IGgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3SW5kZXggLSBoIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChuZXdJbmRleCAtIGgsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkT2JqOiBmdW5jdGlvbiAociwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkuZmluZCgnLm9iamVjdCcpLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLmFkZENsYXNzKCdjb21wbGV0ZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISRzbGlkZS5lcShpbmRleCkuaGFzQ2xhc3MoJ2NvbXBsZXRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkuZmluZCgnLm9iamVjdCcpLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnByZWxvYWQoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5wcmVsb2FkKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkQ29udGVudDogZnVuY3Rpb24gKGluZGV4LCByZWMpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBpLCBqLCBsID0gJGNoaWxkcmVuLmxlbmd0aCAtIGluZGV4O1xuICAgICAgICAgICAgICAgIHZhciBzcmM7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MucHJlbG9hZCA+ICRjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MucHJlbG9hZCA9ICRjaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2JpbGVTcmMgPT09IHRydWUgJiYgd2luZG93V2lkdGggPD0gc2V0dGluZ3MubW9iaWxlU3JjTWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmR5bmFtaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYyA9IHNldHRpbmdzLmR5bmFtaWNFbFtpbmRleF0ubW9iaWxlU3JjO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjID0gJGNoaWxkcmVuLmVxKGluZGV4KS5hdHRyKCdkYXRhLXJlc3BvbnNpdmUtc3JjJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBGYWxsIGJhY2sgdG8gdXNlIG5vbi1yZXNwb25zaXZlIHNvdXJjZSBpZiBubyByZXNwb25zaXZlIHNvdXJjZSB3YXMgZm91bmRcbiAgICAgICAgICAgICAgICBpZiAoIXNyYykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZHluYW1pYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjID0gc2V0dGluZ3MuZHluYW1pY0VsW2luZGV4XS5zcmM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmMgPSAkY2hpbGRyZW4uZXEoaW5kZXgpLmF0dHIoJ2RhdGEtc3JjJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChyZWMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IHNldHRpbmdzLnNwZWVkICsgNDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3JjICE9PSAndW5kZWZpbmVkJyAmJiBzcmMgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghJHRoaXMuaXNWaWRlbyhzcmMsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2xpZGUuZXEoaW5kZXgpLmhhc0NsYXNzKCdsb2FkZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLnByZXBlbmQoJzxpbWcgY2xhc3M9XCJvYmplY3RcIiBzcmM9XCInICsgc3JjICsgJ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFkZEh0bWwoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMubG9hZE9iaihyZWMsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRpbWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2xpZGUuZXEoaW5kZXgpLmhhc0NsYXNzKCdsb2FkZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLnByZXBlbmQoJHRoaXMubG9hZFZpZGVvKHNyYywgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkSHRtbChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hdXRvICYmIHNldHRpbmdzLnZpZGVvQXV0b3BsYXkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmxvYWRPYmoocmVjLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISRzbGlkZS5lcShpbmRleCkuaGFzQ2xhc3MoJ2xvYWRlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFIdG1sID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZHluYW1pYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhSHRtbCA9IHNldHRpbmdzLmR5bmFtaWNFbFtpbmRleF0uaHRtbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhSHRtbCA9ICRjaGlsZHJlbi5lcShpbmRleCkuYXR0cignZGF0YS1odG1sJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YUh0bWwgIT09ICd1bmRlZmluZWQnICYmIGRhdGFIdG1sICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmTCA9IGRhdGFIdG1sLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZMID09ICcuJyB8fCBmTCA9PSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFIdG1sID0gJChkYXRhSHRtbCkuaHRtbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUh0bWwgPSBkYXRhSHRtbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGFIdG1sICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhSHRtbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRcIiBzdHlsZT1cIm1heC13aWR0aDonICsgc2V0dGluZ3MudmlkZW9NYXhXaWR0aCArICcgIWltcG9ydGFudDtcIj48ZGl2IGNsYXNzPVwidmlkZW9cIj4nICsgZGF0YUh0bWwgKyAnPC9kaXY+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFkZEh0bWwoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkuYWRkQ2xhc3MoJ2xvYWRlZCBjb21wbGV0ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF1dG8gJiYgc2V0dGluZ3MudmlkZW9BdXRvcGxheSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5sb2FkT2JqKHJlYywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3VudGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNvdW50ZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlQ291bnQgPSAkKFwiI2xnLXNsaWRlciA+IGRpdlwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LmFwcGVuZChcIjxkaXYgaWQ9J2xnLWNvdW50ZXInPjxzcGFuIGlkPSdsZy1jb3VudGVyLWN1cnJlbnQnPjwvc3Bhbj4gLyA8c3BhbiBpZD0nbGctY291bnRlci1hbGwnPlwiICsgc2xpZGVDb3VudCArIFwiPC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYnVpbGRUaHVtYm5haWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudGh1bWJuYWlsID09PSB0cnVlICYmICRjaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAkY2xvc2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5zaG93VGh1bWJCeURlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjbG9zZSA9ICc8c3BhbiBjbGFzcz1cImNsb3NlIGliXCI+PGkgY2xhc3M9XCJiVWktaUNuLXJNdi0xNlwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT48L3NwYW4+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkZ2FsbGVyeS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJ0aHVtYi1jb250XCI+PGRpdiBjbGFzcz1cInRodW1iLWluZm9cIj4nICsgJGNsb3NlICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ0aHVtYi1pbm5lclwiPjwvZGl2PjwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAkdGh1bWJfY29udCA9ICRnYWxsZXJ5LmZpbmQoJy50aHVtYi1jb250Jyk7XG4gICAgICAgICAgICAgICAgICAgICRwcmV2LmFmdGVyKCc8YSBjbGFzcz1cImNsLXRodW1iXCI+PC9hPicpO1xuICAgICAgICAgICAgICAgICAgICAkcHJldi5wYXJlbnQoKS5hZGRDbGFzcygnaGFzLXRodW1iJyk7XG4gICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LmZpbmQoJy5jbC10aHVtYicpLmJpbmQoJ2NsaWNrIHRvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnkuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5kb0NzcygpICYmIHNldHRpbmdzLm1vZGUgPT09ICdzbGlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLnByZXZBbGwoKS5yZW1vdmVDbGFzcygnbmV4dC1zbGlkZScpLmFkZENsYXNzKCdwcmV2LXNsaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5uZXh0QWxsKCkucmVtb3ZlQ2xhc3MoJ3ByZXYtc2xpZGUnKS5hZGRDbGFzcygnbmV4dC1zbGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnkuZmluZCgnLnRodW1iLWNvbnQgLmNsb3NlJykuYmluZCgnY2xpY2sgdG91Y2hlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZ2FsbGVyeS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRodW1iSW5mbyA9ICRnYWxsZXJ5LmZpbmQoJy50aHVtYi1pbmZvJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGh1bWJfaW5uZXIgPSAkZ2FsbGVyeS5maW5kKCcudGh1bWItaW5uZXInKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRodW1iTGlzdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGh1bWJJbWc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5keW5hbWljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmR5bmFtaWNFbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRodW1iSW1nID0gc2V0dGluZ3MuZHluYW1pY0VsW2ldLnRodW1iO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRodW1iTGlzdCArPSAnPGRpdiBjbGFzcz1cInRodW1iXCI+PGltZyBzcmM9XCInICsgdGh1bWJJbWcgKyAnXCIgLz48L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNoaWxkcmVuLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5leFRodW1iSW1hZ2UgPT09IGZhbHNlIHx8IHR5cGVvZiAkKHRoaXMpLmF0dHIoc2V0dGluZ3MuZXhUaHVtYkltYWdlKSA9PSAndW5kZWZpbmVkJyB8fCAkKHRoaXMpLmF0dHIoc2V0dGluZ3MuZXhUaHVtYkltYWdlKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYkltZyA9ICQodGhpcykuZmluZCgnaW1nJykuYXR0cignc3JjJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJJbWcgPSAkKHRoaXMpLmF0dHIoc2V0dGluZ3MuZXhUaHVtYkltYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJMaXN0ICs9ICc8ZGl2IGNsYXNzPVwidGh1bWJcIj48aW1nIHNyYz1cIicgKyB0aHVtYkltZyArICdcIiAvPjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkdGh1bWJfaW5uZXIuYXBwZW5kKHRodW1iTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICR0aHVtYiA9ICR0aHVtYl9pbm5lci5maW5kKCcudGh1bWInKTtcbiAgICAgICAgICAgICAgICAgICAgJHRodW1iLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLXJpZ2h0Jzogc2V0dGluZ3MudGh1bWJNYXJnaW4gKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogc2V0dGluZ3MudGh1bWJXaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlVGh1bWIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9ICgkY2hpbGRyZW4ubGVuZ3RoICogKHNldHRpbmdzLnRodW1iV2lkdGggKyBzZXR0aW5ncy50aHVtYk1hcmdpbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnkuZmluZCgnLnRodW1iLWlubmVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3aWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbi1kdXJhdGlvbic6IHNldHRpbmdzLnNwZWVkICsgJ21zJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJHRodW1iLmJpbmQoJ2NsaWNrIHRvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNpbmdUaHVtYiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGh1bWIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5zbGlkZShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5hbmltYXRlVGh1bWIoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aHVtYkluZm8ucHJlcGVuZCgnPHNwYW4gY2xhc3M9XCJpYiBjb3VudFwiPicgKyBzZXR0aW5ncy5sYW5nLmFsbFBob3RvcyArICcgKCcgKyAkdGh1bWIubGVuZ3RoICsgJyk8L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5zaG93VGh1bWJCeURlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0ZVRodW1iOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZVRodW1iID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aHVtYl9jb250VyA9ICRnYWxsZXJ5LmZpbmQoJy50aHVtYi1jb250Jykud2lkdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHNldHRpbmdzLmN1cnJlbnRQYWdlclBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICh0aHVtYl9jb250VyAvIDIpIC0gKHNldHRpbmdzLnRodW1iV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRodW1iX2NvbnRXIC0gc2V0dGluZ3MudGh1bWJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdCA9ICgoc2V0dGluZ3MudGh1bWJXaWR0aCArIHNldHRpbmdzLnRodW1iTWFyZ2luKSAqIGluZGV4IC0gMSkgLSBwb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gKCRjaGlsZHJlbi5sZW5ndGggKiAoc2V0dGluZ3MudGh1bWJXaWR0aCArIHNldHRpbmdzLnRodW1iTWFyZ2luKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID4gKHdpZHRoIC0gdGh1bWJfY29udFcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gd2lkdGggLSB0aHVtYl9jb250VztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvQ3NzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LmZpbmQoJy50aHVtYi1pbm5lcicpLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKC0nICsgbGVmdCArICdweCwgMHB4LCAwcHgpJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZ2FsbGVyeS5maW5kKCcudGh1bWItaW5uZXInKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtbGVmdCArIFwicHhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgc2V0dGluZ3Muc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNsaWRlVG86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5jb250cm9scyA9PT0gdHJ1ZSAmJiAkY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAkZ2FsbGVyeS5hcHBlbmQoJzxkaXYgaWQ9XCJsZy1hY3Rpb25cIj48YSBpZD1cImxnLXByZXZcIj48L2E+PGEgaWQ9XCJsZy1uZXh0XCI+PC9hPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAkcHJldiA9ICRnYWxsZXJ5LmZpbmQoJyNsZy1wcmV2Jyk7XG4gICAgICAgICAgICAgICAgICAgICRuZXh0ID0gJGdhbGxlcnkuZmluZCgnI2xnLW5leHQnKTtcbiAgICAgICAgICAgICAgICAgICAgJHByZXYuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5wcmV2U2xpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJG5leHQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXh0U2xpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXV0b1N0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXV0byA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCArIDEgPCAkY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5zbGlkZShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHNldHRpbmdzLnBhdXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAga2V5UHJlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQod2luZG93KS5iaW5kKCdrZXl1cC5saWdodEdhbGxlcnknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5wcmV2U2xpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM4ICYmIHNldHRpbmdzLnRodW1ibmFpbCA9PT0gdHJ1ZSAmJiAkY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkZ2FsbGVyeS5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLmRvQ3NzKCkgJiYgc2V0dGluZ3MubW9kZSA9PT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXgpLnByZXZBbGwoKS5yZW1vdmVDbGFzcygnbmV4dC1zbGlkZScpLmFkZENsYXNzKCdwcmV2LXNsaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkubmV4dEFsbCgpLnJlbW92ZUNsYXNzKCdwcmV2LXNsaWRlJykuYWRkQ2xhc3MoJ25leHQtc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnkuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXh0U2xpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQwICYmIHNldHRpbmdzLnRodW1ibmFpbCA9PT0gdHJ1ZSAmJiAkY2hpbGRyZW4ubGVuZ3RoID4gMSAmJiAhc2V0dGluZ3Muc2hvd1RodW1iQnlEZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGdhbGxlcnkuaGFzQ2xhc3MoJ29wZW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRnYWxsZXJ5LnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuZXNjS2V5ID09PSB0cnVlICYmIGUua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGluZ3Muc2hvd1RodW1iQnlEZWZhdWx0ICYmICRnYWxsZXJ5Lmhhc0NsYXNzKCdvcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZ2FsbGVyeS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uZGVzdHJveShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gJHNsaWRlLmluZGV4KCRzbGlkZS5lcShwcmV2SW5kZXgpKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggKyAxIDwgJGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5zbGlkZShpbmRleCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnNsaWRlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy50aHVtYm5haWwgPT09IHRydWUgJiYgJGNoaWxkcmVuLmxlbmd0aCA+IDEgJiYgIXNldHRpbmdzLnNob3dUaHVtYkJ5RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnkuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkuZmluZCgnLm9iamVjdCcpLmFkZENsYXNzKCdyaWdodC1lbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5maW5kKCcub2JqZWN0JykucmVtb3ZlQ2xhc3MoJ3JpZ2h0LWVuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkdGhpcy5hbmltYXRlVGh1bWIoaW5kZXgpO1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLm9uU2xpZGVOZXh0LmNhbGwodGhpcywgcGx1Z2luKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmV2U2xpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gJHNsaWRlLmluZGV4KCRzbGlkZS5lcShwcmV2SW5kZXgpKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4LS07XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnNsaWRlKGluZGV4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkY2hpbGRyZW4ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnNsaWRlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy50aHVtYm5haWwgPT09IHRydWUgJiYgJGNoaWxkcmVuLmxlbmd0aCA+IDEgJiYgIXNldHRpbmdzLnNob3dUaHVtYkJ5RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnkuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCkuZmluZCgnLm9iamVjdCcpLmFkZENsYXNzKCdsZWZ0LWVuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmZpbmQoJy5vYmplY3QnKS5yZW1vdmVDbGFzcygnbGVmdC1lbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHRoaXMuYW5pbWF0ZVRodW1iKGluZGV4KTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5vblNsaWRlUHJldi5jYWxsKHRoaXMsIHBsdWdpbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKGxpZ2h0R2FsbGVyeU9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMubG9hZENvbnRlbnQoaW5kZXgsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc2V0dGluZ3Muc3BlZWQgKyA0MDApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISRzbGlkZXIuaGFzQ2xhc3MoJ29uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZXIuYWRkQ2xhc3MoJ29uJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9Dc3MoKSAmJiBzZXR0aW5ncy5zcGVlZCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHNsaWRlci5oYXNDbGFzcygnc3BlZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZXIuYWRkQ2xhc3MoJ3NwZWVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYVNwZWVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZXIuY3NzKCd0cmFuc2l0aW9uLWR1cmF0aW9uJywgc2V0dGluZ3Muc3BlZWQgKyAnbXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3BlZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvQ3NzKCkgJiYgc2V0dGluZ3MuY3NzRWFzaW5nICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2xpZGVyLmhhc0NsYXNzKCd0aW1pbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZXIuYWRkQ2xhc3MoJ3RpbWluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFUaW1pbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlci5jc3MoJ3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJywgc2V0dGluZ3MuY3NzRWFzaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhVGltaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5vblNsaWRlQmVmb3JlLmNhbGwodGhpcywgcGx1Z2luKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5sb2FkQ29udGVudChpbmRleCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubW9kZSA9PT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNpUGFkID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZC9pKSAhPT0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9Dc3MoKSAmJiAhJHNsaWRlci5oYXNDbGFzcygnc2xpZGUnKSAmJiAhaXNpUGFkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGVyLmFkZENsYXNzKCdzbGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZG9Dc3MoKSAmJiAhJHNsaWRlci5oYXNDbGFzcygndXNlLWxlZnQnKSAmJiBpc2lQYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZXIuYWRkQ2xhc3MoJ3VzZS1sZWZ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgICBpZih0aGlzLmRvQ3NzKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlci5jc3MoeyAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGUzZCgnKygtaW5kZXgqMTAwKSsnJSwgMHB4LCAwcHgpJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5kb0NzcygpICYmICFsaWdodEdhbGxlcnlPbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICgtaW5kZXggKiAxMDApICsgJyUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNsaWRlLmVxKGluZGV4KS5jc3MoJ3RyYW5zaXRpb24nLCdub25lJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZG9Dc3MoKSAmJiBsaWdodEdhbGxlcnlPbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoLWluZGV4ICogMTAwKSArICclJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgc2V0dGluZ3Muc3BlZWQsIHNldHRpbmdzLmVhc2luZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNldHRpbmdzLm1vZGUgPT09ICdmYWRlJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kb0NzcygpICYmICEkc2xpZGVyLmhhc0NsYXNzKCdmYWRlLW0nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlci5hZGRDbGFzcygnZmFkZS1tJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZG9Dc3MoKSAmJiAhJHNsaWRlci5oYXNDbGFzcygnYW5pbWF0ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGVyLmFkZENsYXNzKCdhbmltYXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvQ3NzKCkgJiYgIWxpZ2h0R2FsbGVyeU9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZmFkZU91dCgxMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5mYWRlSW4oMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5kb0NzcygpICYmIGxpZ2h0R2FsbGVyeU9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEocHJldkluZGV4KS5mYWRlT3V0KHNldHRpbmdzLnNwZWVkLCBzZXR0aW5ncy5lYXNpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5mYWRlSW4oc2V0dGluZ3Muc3BlZWQsIHNldHRpbmdzLmVhc2luZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICsgMSA+PSAkY2hpbGRyZW4ubGVuZ3RoICYmIHNldHRpbmdzLmF1dG8gJiYgc2V0dGluZ3MubG9vcCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzbGlkZS5lcShwcmV2SW5kZXgpLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5hZGRDbGFzcygnY3VycmVudCcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvQ3NzKCkgJiYgc2V0dGluZ3MubW9kZSA9PT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNpbmdUaHVtYiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wcmV2LXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3ByZXYtc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5uZXh0LXNsaWRlJykucmVtb3ZlQ2xhc3MoJ25leHQtc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdwcmV2LXNsaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnbmV4dC1zbGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5wcmV2QWxsKCkucmVtb3ZlQ2xhc3MoJ25leHQtc2xpZGUnKS5hZGRDbGFzcygncHJldi1zbGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmVxKGluZGV4KS5uZXh0QWxsKCkucmVtb3ZlQ2xhc3MoJ3ByZXYtc2xpZGUnKS5hZGRDbGFzcygnbmV4dC1zbGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy50aHVtYm5haWwgPT09IHRydWUgJiYgJGNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRodW1iLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHRodW1iLmVxKGluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5jb250cm9scyAmJiBzZXR0aW5ncy5oaWRlQ29udHJvbE9uRW5kICYmIHNldHRpbmdzLmxvb3AgPT09IGZhbHNlICYmICRjaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsID0gJGNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgbCA9IHBhcnNlSW50KGwpIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJldi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRuZXh0LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJldi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRuZXh0LmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHByZXYuYWRkKCRuZXh0KS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBsaWdodEdhbGxlcnlPbiA9PT0gZmFsc2UgPyBzZXR0aW5ncy5vbk9wZW4uY2FsbCh0aGlzLCBwbHVnaW4pIDogc2V0dGluZ3Mub25TbGlkZUFmdGVyLmNhbGwodGhpcywgcGx1Z2luKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlnaHRHYWxsZXJ5T24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHVzaW5nVGh1bWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuY291bnRlcikge1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2xnLWNvdW50ZXItY3VycmVudFwiKS50ZXh0KGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQod2luZG93KS5iaW5kKCdyZXNpemUubGlnaHRHYWxsZXJ5JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFuaW1hdGVUaHVtYihpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHBsdWdpbi5pc0FjdGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpc0FjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgcGx1Z2luLmRlc3Ryb3kgPSBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGQgPSB0eXBlb2YgZCAhPT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgICAgICBzZXR0aW5ncy5vbkJlZm9yZUNsb3NlLmNhbGwodGhpcywgcGx1Z2luKTtcbiAgICAgICAgICAgIHZhciBsaWdodEdhbGxlcnlPblQgPSBsaWdodEdhbGxlcnlPbjtcbiAgICAgICAgICAgIGxpZ2h0R2FsbGVyeU9uID0gZmFsc2U7XG4gICAgICAgICAgICBhVGltaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBhU3BlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHVzaW5nVGh1bWIgPSBmYWxzZTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgaWYgKGQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAkY2hpbGRyZW4ub2ZmKCdjbGljayB0b3VjaCB0b3VjaHN0YXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCcubGlnaHQtZ2FsbGVyeScpLm9mZignbW91c2Vkb3duIG1vdXNldXAnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5vZmYoJ3RvdWNoc3RhcnQubGlnaHRHYWxsZXJ5IHRvdWNobW92ZS5saWdodEdhbGxlcnkgdG91Y2hlbmQubGlnaHRHYWxsZXJ5Jyk7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUubGlnaHRHYWxsZXJ5IGtleXVwLmxpZ2h0R2FsbGVyeScpO1xuICAgICAgICAgICAgaWYgKGxpZ2h0R2FsbGVyeU9uVCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICRnYWxsZXJ5LmFkZENsYXNzKCdmYWRlLW0nKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGdhbGxlcnlDb250LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xpZ2h0LWdhbGxlcnknKTtcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0dGluZ3Mub25DbG9zZUFmdGVyLmNhbGwodGhpcywgcGx1Z2luKTtcbiAgICAgICAgfTtcbiAgICAgICAgbGlnaHRHYWxsZXJ5LmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn0oalF1ZXJ5KSk7IiwiLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuKiBqcXVlcnkgbGlnaHRTbGlkZXIuanMgdjEuMS4xXG4qIGh0dHA6Ly9zYWNoaW5jaG9vbHVyLmdpdGh1Yi5pby9saWdodHNsaWRlci9cbiogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLmh0bWwgIC0tLS0gRlJFRSAtLS0tXG5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8qKi9cbjtcbihmdW5jdGlvbiAoJCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBpdGVtOiAzLFxuICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgICAgICBzbGlkZU1vdmU6IDEsXG4gICAgICAgIHNsaWRlTWFyZ2luOiAxMCxcbiAgICAgICAgYWRkQ2xhc3M6ICcnLFxuICAgICAgICBtb2RlOiBcInNsaWRlXCIsXG4gICAgICAgIHVzZUNTUzogdHJ1ZSxcbiAgICAgICAgY3NzRWFzaW5nOiAnZWFzZScsIC8vJ2N1YmljLWJlemllcigwLjI1LCAwLCAwLjI1LCAxKScsLy9cbiAgICAgICAgZWFzaW5nOiAnbGluZWFyJywgLy8nZm9yIGpxdWVyeSBhbmltYXRpb24nLC8vXG4gICAgICAgIHNwZWVkOiA0MDAsIC8vbXMnXG4gICAgICAgIGF1dG86IGZhbHNlLFxuICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgc2xpZGVFbmRBbmltYXRvaW46IHRydWUsXG4gICAgICAgIHBhdXNlOiAyMDAwLFxuICAgICAgICBrZXlQcmVzczogZmFsc2UsXG4gICAgICAgIGNvbnRyb2xzOiB0cnVlLFxuICAgICAgICBwcmV2SHRtbDogJycsXG4gICAgICAgIG5leHRIdG1sOiAnJyxcbiAgICAgICAgcnRsOiBmYWxzZSxcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IGZhbHNlLFxuICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgICAgIHZlcnRpY2FsSGVpZ2h0OiA1MDAsXG4gICAgICAgIHZUaHVtYldpZHRoOiAxMDAsXG4gICAgICAgIHRodW1iSXRlbTogMTAsXG4gICAgICAgIHBhZ2VyOiB0cnVlLFxuICAgICAgICBnYWxsZXJ5OiBmYWxzZSxcbiAgICAgICAgZ2FsbGVyeU1hcmdpbjogNSxcbiAgICAgICAgdGh1bWJNYXJnaW46IDUsXG4gICAgICAgIGN1cnJlbnRQYWdlclBvc2l0aW9uOiAnbWlkZGxlJyxcbiAgICAgICAgZW5hYmxlVG91Y2g6IHRydWUsXG4gICAgICAgIGVuYWJsZURyYWc6IHRydWUsXG4gICAgICAgIGZyZWVNb3ZlOiB0cnVlLFxuICAgICAgICBzd2lwZVRocmVzaG9sZDogNDAsXG4gICAgICAgIHJlc3BvbnNpdmU6IFtdLFxuICAgICAgICBvbkJlZm9yZVN0YXJ0OiBmdW5jdGlvbiAoJGVsKSB7fSxcbiAgICAgICAgb25TbGlkZXJMb2FkOiBmdW5jdGlvbiAoJGVsKSB7fSxcbiAgICAgICAgb25CZWZvcmVTbGlkZTogZnVuY3Rpb24gKCRlbCwgc2NlbmUpIHt9LFxuICAgICAgICBvbkFmdGVyU2xpZGU6IGZ1bmN0aW9uICgkZWwsIHNjZW5lKSB7fSxcbiAgICAgICAgb25CZWZvcmVOZXh0U2xpZGU6IGZ1bmN0aW9uICgkZWwsIHNjZW5lKSB7fSxcbiAgICAgICAgb25CZWZvcmVQcmV2U2xpZGU6IGZ1bmN0aW9uICgkZWwsIHNjZW5lKSB7fVxuICAgIH07XG4gICAgJC5mbi5saWdodFNsaWRlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykubGlnaHRTbGlkZXIob3B0aW9ucyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBsdWdpbiA9IHt9LFxuICAgICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgc2V0dGluZ3NUZW1wID0ge30sXG4gICAgICAgICAgICAkZWwgPSB0aGlzLFxuICAgICAgICAgICAgJHdyYXAgPSAkZWwucGFyZW50KCk7XG4gICAgICAgIHBsdWdpbi4kZWwgPSB0aGlzO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSAnZmFkZScpIHtcbiAgICAgICAgICAgIHNldHRpbmdzLnZlcnRpY2FsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyICRjaGlsZHJlbiA9ICRlbC5jaGlsZHJlbigpLFxuICAgICAgICAgICAgd3JhcHBlclcgPSAkd3JhcC53aWR0aCgpLFxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IG51bGwsXG4gICAgICAgICAgICByZXNwb3NpdmVPYmogPSBudWxsLFxuICAgICAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgICAgIHcgPSAwLFxuICAgICAgICAgICAgb24gPSBmYWxzZSxcbiAgICAgICAgICAgIGVsU2l6ZSA9IDAsXG4gICAgICAgICAgICAkc2xpZGUgPSAnJyxcbiAgICAgICAgICAgIHNjZW5lID0gMCxcbiAgICAgICAgICAgIHByb3BlcnR5ID0gKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSA/IFwiaGVpZ2h0XCIgOiBcIndpZHRoXCIsXG4gICAgICAgICAgICBndXR0ZXIgPSAoc2V0dGluZ3MudmVydGljYWwgPT09IHRydWUpID8gXCJtYXJnaW4tYm90dG9tXCIgOiBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgICAgICAgc2xpZGVWYWx1ZSA9IDAsXG4gICAgICAgICAgICBwYWdlcldpZHRoID0gMCxcbiAgICAgICAgICAgIHNsaWRlV2lkdGggPSAwLFxuICAgICAgICAgICAgdGh1bWJXaWR0aCA9IDAsXG4gICAgICAgICAgICBpbnRlcnZhbCA9IG51bGwsXG4gICAgICAgICAgICBpc1RvdWNoID0gKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgIHZhciByZWZyZXNoID0gbmV3IE9iamVjdCgpO1xuXG4gICAgICAgIHJlZnJlc2guY2hicmVha3BvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd3JhcHBlclcgPSAkd3JhcC53aWR0aCgpO1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnJlc3BvbnNpdmUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF1dG9XaWR0aCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZXR0aW5ncy5pdGVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod3JhcHBlclcgPCBzZXR0aW5ncy5yZXNwb25zaXZlWzBdLmJyZWFrcG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXR0aW5ncy5yZXNwb25zaXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlclcgPCBzZXR0aW5ncy5yZXNwb25zaXZlW2ldLmJyZWFrcG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50ID0gc2V0dGluZ3MucmVzcG9uc2l2ZVtpXS5icmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3Bvc2l2ZU9iaiA9IHNldHRpbmdzLnJlc3BvbnNpdmVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXNwb3NpdmVPYmogIT09IFwidW5kZWZpbmVkXCIgJiYgcmVzcG9zaXZlT2JqICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpIGluIHJlc3Bvc2l2ZU9iai5zZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5nc1RlbXBbaV0gPT0gXCJ1bmRlZmluZWRcIiB8fCBzZXR0aW5nc1RlbXBbaV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzVGVtcFtpXSA9IHNldHRpbmdzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3NbaV0gPSByZXNwb3NpdmVPYmouc2V0dGluZ3NbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEkLmlzRW1wdHlPYmplY3Qoc2V0dGluZ3NUZW1wKSAmJiB3cmFwcGVyVyA+IHNldHRpbmdzLnJlc3BvbnNpdmVbMF0uYnJlYWtwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgaW4gc2V0dGluZ3NUZW1wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nc1tpXSA9IHNldHRpbmdzVGVtcFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXV0b1dpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVWYWx1ZSA+IDAgJiYgc2xpZGVXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtICE9PSBzZXR0aW5ncy5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmUgPSBNYXRoLnJvdW5kKHNsaWRlVmFsdWUgLyAoKHNsaWRlV2lkdGggKyBzZXR0aW5ncy5zbGlkZU1hcmdpbikgKiBzZXR0aW5ncy5zbGlkZU1vdmUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZWZyZXNoLmNhbFNXID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF1dG9XaWR0aCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBzbGlkZVdpZHRoID0gKGVsU2l6ZSAtICgoc2V0dGluZ3MuaXRlbSAqIChzZXR0aW5ncy5zbGlkZU1hcmdpbikpIC0gc2V0dGluZ3Muc2xpZGVNYXJnaW4pKSAvIHNldHRpbmdzLml0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVmcmVzaC5jYWxXaWR0aCA9IGZ1bmN0aW9uIChjbG4pIHtcbiAgICAgICAgICAgIHZhciBsbiA9IGNsbiA9PT0gdHJ1ZSA/ICRzbGlkZS5maW5kKCcubHNsaWRlJykubGVuZ3RoIDogJGNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hdXRvV2lkdGggPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdyA9IGxuICogKHNsaWRlV2lkdGggKyBzZXR0aW5ncy5zbGlkZU1hcmdpbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHcgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB3ICs9IChwYXJzZUludCgkY2hpbGRyZW4uZXEoaSkud2lkdGgoKSkgKyBzZXR0aW5ncy5zbGlkZU1hcmdpbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHcgJSAxICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdyA9IHcgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHc7XG4gICAgICAgIH07XG4gICAgICAgIHBsdWdpbiA9IHtcbiAgICAgICAgICAgIGRvQ3NzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1cHBvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gWyd0cmFuc2l0aW9uJywgJ01velRyYW5zaXRpb24nLCAnV2Via2l0VHJhbnNpdGlvbicsICdPVHJhbnNpdGlvbicsICdtc1RyYW5zaXRpb24nLCAnS2h0bWxUcmFuc2l0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyYW5zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uW2ldIGluIHJvb3Quc3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnVzZUNTUyAmJiBzdXBwb3J0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBrZXlQcmVzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5rZXlQcmVzcykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5vbigna2V5dXAubGlnaHRzbGlkZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWwuZ29Ub1ByZXZTbGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmdvVG9OZXh0U2xpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNvbnRyb2xzKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbC5hZnRlcignPGRpdiBjbGFzcz1cImxTQWN0aW9uXCI+PGEgY2xhc3M9XCJsU1ByZXZcIj4nICsgc2V0dGluZ3MucHJldkh0bWwgKyAnPC9hPjxhIGNsYXNzPVwibFNOZXh0XCI+JyArIHNldHRpbmdzLm5leHRIdG1sICsgJzwvYT48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5hdXRvV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGggPD0gc2V0dGluZ3MuaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5maW5kKCcubFNBY3Rpb24nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaC5jYWxXaWR0aChmYWxzZSkgPCBlbFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZmluZCgnLmxTQWN0aW9uJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5maW5kKCcubFNBY3Rpb24gYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdjbGFzcycpID09PSAnbFNQcmV2Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbC5nb1RvUHJldlNsaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbC5nb1RvTmV4dFNsaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXRpYWxTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1vZGUgPT09ICdmYWRlJykge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5hdXRvV2lkdGggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Muc2xpZGVFbmRBbmltYXRvaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF1dG8pIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Muc2xpZGVFbmRBbmltYXRvaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hdXRvV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Muc2xpZGVNb3ZlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuaXRlbSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnNsaWRlTW92ZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmZyZWVNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldHRpbmdzLm9uQmVmb3JlU3RhcnQuY2FsbCh0aGlzLCAkZWwpO1xuICAgICAgICAgICAgICAgIHJlZnJlc2guY2hicmVha3BvaW50KCk7XG4gICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdsaWdodFNsaWRlcicpLndyYXAoXCI8ZGl2IGNsYXNzPSdsU1NsaWRlT3V0ZXIgXCIgKyBzZXR0aW5ncy5hZGRDbGFzcyArIFwiJz48ZGl2IGNsYXNzPSdsU1NsaWRlV3JhcHBlcic+PC9kaXY+PC9kaXY+XCIpO1xuICAgICAgICAgICAgICAgICRzbGlkZSA9ICRlbC5wYXJlbnQoJy5sU1NsaWRlV3JhcHBlcicpO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnBhcmVudCgpLmFkZENsYXNzKCdsU3J0bCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnBhcmVudCgpLmFkZENsYXNzKCd2ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgICAgICAgICBlbFNpemUgPSBzZXR0aW5ncy52ZXJ0aWNhbEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmNzcygnaGVpZ2h0JywgZWxTaXplICsgJ3B4Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxTaXplID0gJGVsLm91dGVyV2lkdGgoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGNoaWxkcmVuLmFkZENsYXNzKCdsc2xpZGUnKTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9vcCA9PT0gdHJ1ZSAmJiBzZXR0aW5ncy5tb2RlID09PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2guY2FsU1coKTtcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaC5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoLmNhbFdpZHRoKHRydWUpID4gZWxTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0V3IgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0SSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCAkY2hpbGRyZW4ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdFdyICs9IChwYXJzZUludCgkZWwuZmluZCgnLmxzbGlkZScpLmVxKGspLndpZHRoKCkpICsgc2V0dGluZ3Muc2xpZGVNYXJnaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0SSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodFdyID49IChlbFNpemUgKyBzZXR0aW5ncy5zbGlkZU1hcmdpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0SXRlbSA9IHNldHRpbmdzLmF1dG9XaWR0aCA9PT0gdHJ1ZSA/IHRJIDogc2V0dGluZ3MuaXRlbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodEl0ZW0gPCAkZWwuZmluZCgnLmNsb25lLmxlZnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkZWwuZmluZCgnLmNsb25lLmxlZnQnKS5sZW5ndGggLSB0SXRlbTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4uZXEoaSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRJdGVtIDwgJGVsLmZpbmQoJy5jbG9uZS5yaWdodCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gJGNoaWxkcmVuLmxlbmd0aCAtIDE7IGogPiAoJGNoaWxkcmVuLmxlbmd0aCAtIDEgLSAkZWwuZmluZCgnLmNsb25lLnJpZ2h0JykubGVuZ3RoKTsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNoaWxkcmVuLmVxKGopLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gJGVsLmZpbmQoJy5jbG9uZS5yaWdodCcpLmxlbmd0aDsgayA8IHRJdGVtOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmZpbmQoJy5sc2xpZGUnKS5lcShrKS5jbG9uZSgpLnJlbW92ZUNsYXNzKCdsc2xpZGUnKS5hZGRDbGFzcygnY2xvbmUgcmlnaHQnKS5hcHBlbmRUbygkZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gJGVsLmZpbmQoJy5sc2xpZGUnKS5sZW5ndGggLSAkZWwuZmluZCgnLmNsb25lLmxlZnQnKS5sZW5ndGg7IG0gPiAoJGVsLmZpbmQoJy5sc2xpZGUnKS5sZW5ndGggLSB0SXRlbSk7IG0tLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWwuZmluZCgnLmxzbGlkZScpLmVxKG0gLSAxKS5jbG9uZSgpLnJlbW92ZUNsYXNzKCdsc2xpZGUnKS5hZGRDbGFzcygnY2xvbmUgbGVmdCcpLnByZXBlbmRUbygkZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4gPSAkZWwuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRjaGlsZHJlbi5oYXNDbGFzcygnY2xvbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWwuZmluZCgnLmNsb25lJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLm1vdmUoJGVsLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2guY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVmcmVzaC5zU1cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICRjaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5ydGwgPT09IHRydWUgJiYgc2V0dGluZ3MudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBndXR0ZXIgPSBcIm1hcmdpbi1sZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF1dG9XaWR0aCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjaGlsZHJlbi5jc3MocHJvcGVydHksIHNsaWRlV2lkdGggKyAncHgnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4uY3NzKGd1dHRlciwgc2V0dGluZ3Muc2xpZGVNYXJnaW4gKyAncHgnKTtcbiAgICAgICAgICAgICAgICAgICAgdyA9IHJlZnJlc2guY2FsV2lkdGgoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAkZWwuY3NzKHByb3BlcnR5LCB3ICsgJ3B4Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wID09PSB0cnVlICYmIHNldHRpbmdzLm1vZGUgPT09ICdzbGlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZSA9ICRlbC5maW5kKCcuY2xvbmUubGVmdCcpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVmcmVzaC5jYWxMID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4gPSAkZWwuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJGNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvQ3NzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmFkZENsYXNzKCd1c2luZ0NzcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWZyZXNoLmNhbEwoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubW9kZSA9PT0gXCJzbGlkZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2guY2FsU1coKTtcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaC5zU1coKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmxvb3AgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlVmFsdWUgPSAkdGhpcy5zbGlkZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmUoJGVsLCBzbGlkZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEhlaWdodCgkZWwsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRIZWlnaHQoJGVsLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdsU0ZhZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvQ3NzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjaGlsZHJlbi5ub3QoXCIuYWN0aXZlXCIpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmxvb3AgPT09IHRydWUgJiYgc2V0dGluZ3MubW9kZSA9PT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4uZXEoc2NlbmUpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkY2hpbGRyZW4uZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICByZWZyZXNoLmNyZWF0ZVBhZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aHVtYldpZHRoID0gKGVsU2l6ZSAtICgoc2V0dGluZ3MudGh1bWJJdGVtICogKHNldHRpbmdzLnRodW1iTWFyZ2luKSkgLSBzZXR0aW5ncy50aHVtYk1hcmdpbikpIC8gc2V0dGluZ3MudGh1bWJJdGVtO1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGNoaWxkcmVuID0gJHNsaWRlLmZpbmQoJy5sc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9ICRzbGlkZS5maW5kKCcubHNsaWRlJykubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlcnMgPSAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHNjZW5lICogc2xpZGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmdzLmF1dG9XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gaSAqICgoc2xpZGVXaWR0aCArIHNldHRpbmdzLnNsaWRlTWFyZ2luKSAqIHNldHRpbmdzLnNsaWRlTW92ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdiArPSAoKHBhcnNlSW50KCRjaGlsZHJlbi5lcShpKS53aWR0aCgpKSArIHNldHRpbmdzLnNsaWRlTWFyZ2luKSAqIHNldHRpbmdzLnNsaWRlTW92ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRodW1iID0gJGNoaWxkcmVuLmVxKGkgKiBzZXR0aW5ncy5zbGlkZU1vdmUpLmF0dHIoJ2RhdGEtdGh1bWInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5nYWxsZXJ5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXJzICs9ICc8bGkgc3R5bGU9XCJ3aWR0aDoxMDAlOycgKyBwcm9wZXJ0eSArICc6JyArIHRodW1iV2lkdGggKyAncHg7JyArIGd1dHRlciArICc6JyArIHNldHRpbmdzLnRodW1iTWFyZ2luICsgJ3B4XCI+PGEgaHJlZj1cIiNcIj48aW1nIHNyYz1cIicgKyB0aHVtYiArICdcIiAvPjwvYT48L2xpPic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VycyArPSAnPGxpPjxhIGhyZWY9XCIjXCI+JyArIChpICsgMSkgKyAnPC9hPjwvbGk+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh2KSA+PSB3IC0gZWxTaXplIC0gc2V0dGluZ3Muc2xpZGVNYXJnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWluUGdyID0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmF1dG9XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXJzICs9ICc8bGk+PGEgaHJlZj1cIiNcIj4nICsgKGkgKyAxKSArICc8L2E+PC9saT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluUGdyID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IG1pblBncikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXJzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5wYXJlbnQoKS5hZGRDbGFzcygnbm9QYWdlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdub1BhZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY1NvdXRlciA9ICRzbGlkZS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgJGNTb3V0ZXIuZmluZCgnLmxTUGFnZXInKS5odG1sKHBhZ2Vycyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGluZ3MudmVydGljYWwgJiYgc2V0dGluZ3MuZ2FsbGVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwZ3IgPSAkc2xpZGUucGFyZW50KCkuZmluZCgnLmxTR2FsbGVyeScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuc2V0SGVpZ2h0KCRwZ3IsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZ2FsbGVyeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IEdhbGxlcnkgdGh1bWJuYWlsIHdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNTb3V0ZXIuZmluZCgnLmxTUGFnZXInKS5jc3MoJ3dpZHRoJywgc2V0dGluZ3MudlRodW1iV2lkdGggKyAncHgnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VyV2lkdGggPSAoaSAqIChzZXR0aW5ncy50aHVtYk1hcmdpbiArIHRodW1iV2lkdGgpKSArIDAuNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjU291dGVyLmZpbmQoJy5sU1BhZ2VyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcGFnZXJXaWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24tZHVyYXRpb24nOiBzZXR0aW5ncy5zcGVlZCArICdtcydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnBhcmVudCgpLmNzcygncGFkZGluZy1yaWdodCcsIChzZXR0aW5ncy52VGh1bWJXaWR0aCArIHNldHRpbmdzLmdhbGxlcnlNYXJnaW4pICsgJ3B4Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkY1NvdXRlci5maW5kKCcubFNQYWdlcicpLmNzcyhwcm9wZXJ0eSwgcGFnZXJXaWR0aCArICdweCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciAkcGFnZXIgPSAkY1NvdXRlci5maW5kKCcubFNQYWdlcicpLmZpbmQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgICRwYWdlci5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wID09PSB0cnVlICYmIHNldHRpbmdzLm1vZGUgPT09ICdzbGlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IHNjZW5lICsgKCRwYWdlci5pbmRleCh0aGlzKSAtICRjU291dGVyLmZpbmQoJy5sU1BhZ2VyJykuZmluZCgnbGkuYWN0aXZlJykuaW5kZXgoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lID0gJHBhZ2VyLmluZGV4KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLm1vZGUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmdhbGxlcnkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5zbGlkZVRodW1iKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MucGFnZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsID0gJ2xTcGcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZ2FsbGVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2wgPSAnbFNHYWxsZXJ5JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuYWZ0ZXIoJzx1bCBjbGFzcz1cImxTUGFnZXIgJyArIGNsICsgJ1wiPjwvdWw+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnTWFyZ2luID0gKHNldHRpbmdzLnZlcnRpY2FsKSA/IFwibWFyZ2luLWxlZnRcIiA6IFwibWFyZ2luLXRvcFwiO1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUucGFyZW50KCkuZmluZCgnLmxTUGFnZXInKS5jc3MoZ01hcmdpbiwgc2V0dGluZ3MuZ2FsbGVyeU1hcmdpbiArICdweCcpO1xuICAgICAgICAgICAgICAgICAgICByZWZyZXNoLmNyZWF0ZVBhZ2VyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZWZyZXNoLmluaXQoKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRIZWlnaHQ6IGZ1bmN0aW9uIChvYiwgZmFkZSwgbG9vcCkge1xuICAgICAgICAgICAgICAgIHZhciBvYmogPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChsb29wKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IG9iLmNoaWxkcmVuKFwiLmxzbGlkZSBcIikuZmlyc3QoKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gb2IuY2hpbGRyZW4oKS5maXJzdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2V0Q3NzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdEggPSBvYmouaGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0UCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0SFQgPSB0SDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZhZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRIID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRQID0gKCh0SFQpICogMTAwKSAvIGVsU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvYi5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IHRIICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6IHRQICsgJyUnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2V0Q3NzKCk7XG4gICAgICAgICAgICAgICAgb2JqLmZpbmQoJ2ltZycpLmxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwxMDApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFjdGl2ZTogZnVuY3Rpb24gKG9iLCB0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9Dc3MoKSAmJiBzZXR0aW5ncy5tb2RlID09PSBcImZhZGVcIikge1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuYWRkQ2xhc3MoJ29uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzYyA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHNjZW5lICogc2V0dGluZ3Muc2xpZGVNb3ZlIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvQ3NzKCkgJiYgc2V0dGluZ3MubW9kZSA9PT0gXCJmYWRlXCIgJiYgdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iLmZhZGVPdXQoc2V0dGluZ3Muc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHQgPT09IHRydWUgPyBzYyA9IHNjZW5lIDogc2MgPSBzY2VuZSAqIHNldHRpbmdzLnNsaWRlTW92ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gb2IubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5sID0gbCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2MgKyAxID49IGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYyA9IG5sO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wID09PSB0cnVlICYmIHNldHRpbmdzLm1vZGUgPT09ICdzbGlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPT09IHRydWUgPyBzYyA9IHNjZW5lIC0gJGVsLmZpbmQoJy5jbG9uZS5sZWZ0JykubGVuZ3RoIDogc2MgPSBzY2VuZSAqIHNldHRpbmdzLnNsaWRlTW92ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBvYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5sID0gbCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjICsgMSA9PSBsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjID0gbmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzYyArIDEgPiBsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG9Dc3MoKSAmJiBzZXR0aW5ncy5tb2RlID09PSBcImZhZGVcIiAmJiB0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2IuZXEoc2MpLmZhZGVJbihzZXR0aW5ncy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb2IuZXEoc2MpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIG9iLmVxKG9iLmxlbmd0aCAtIDEpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvQ3NzKCkgJiYgc2V0dGluZ3MubW9kZSA9PT0gXCJmYWRlXCIgJiYgdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iLmZhZGVPdXQoc2V0dGluZ3Muc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2IuZXEoc2MpLmZhZGVJbihzZXR0aW5ncy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW92ZTogZnVuY3Rpb24gKG9iLCB2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2ID0gLXY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvQ3NzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYi5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMHB4LCAnICsgKC12KSArICdweCwgMHB4KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDBweCwgJyArICgtdikgKyAncHgsIDBweCknXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgKC12KSArICdweCwgMHB4LCAwcHgpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArICgtdikgKyAncHgsIDBweCwgMHB4KScsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy52ZXJ0aWNhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2IuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogLXYgKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBzZXR0aW5ncy5zcGVlZCwgc2V0dGluZ3MuZWFzaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtdiArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHNldHRpbmdzLnNwZWVkLCBzZXR0aW5ncy5lYXNpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciAkdGh1bWIgPSAkc2xpZGUucGFyZW50KCkuZmluZCgnLmxTUGFnZXInKS5maW5kKCdsaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlKCR0aHVtYiwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlKCRjaGlsZHJlbiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHZhciAkdGh1bWIgPSAkc2xpZGUucGFyZW50KCkuZmluZCgnLmxTUGFnZXInKS5maW5kKCdsaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlKCR0aHVtYiwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHJlZnJlc2guY2FsU2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3ID4gZWxTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZVZhbHVlID0gJHRoaXMuc2xpZGVWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWN0aXZlKCRjaGlsZHJlbiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChzbGlkZVZhbHVlKSA+IHcgLSBlbFNpemUgLSBzZXR0aW5ncy5zbGlkZU1hcmdpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlVmFsdWUgPSB3IC0gZWxTaXplIC0gc2V0dGluZ3Muc2xpZGVNYXJnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNsaWRlVmFsdWUgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5tb3ZlKCRlbCwgc2xpZGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9vcCA9PT0gdHJ1ZSAmJiBzZXR0aW5ncy5tb2RlID09PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjZW5lID49IChsZW5ndGggLSAoJGVsLmZpbmQoJy5jbG9uZS5sZWZ0JykubGVuZ3RoIC8gc2V0dGluZ3Muc2xpZGVNb3ZlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVzZXRTbGlkZSgkZWwuZmluZCgnLmNsb25lLmxlZnQnKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NlbmUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVzZXRTbGlkZSgkc2xpZGUuZmluZCgnLmxzbGlkZScpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZWZyZXNoLmNhbFNsaWRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzZXRTbGlkZTogZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICRzbGlkZS5maW5kKCcubFNBY3Rpb24gYScpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IHM7XG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5jc3MoJ3RyYW5zaXRpb24tZHVyYXRpb24nLCAnMG1zJyk7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlVmFsdWUgPSAkdGhpcy5zbGlkZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmFjdGl2ZSgkY2hpbGRyZW4sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLm1vdmUoJGVsLCBzbGlkZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuY3NzKCd0cmFuc2l0aW9uLWR1cmF0aW9uJywgc2V0dGluZ3Muc3BlZWQgKyAnbXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5maW5kKCcubFNBY3Rpb24gYScpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICAgICAgfSwgc2V0dGluZ3Muc3BlZWQgKyAxMDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNsaWRlVmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NWID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXV0b1dpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBfc1YgPSBzY2VuZSAqICgoc2xpZGVXaWR0aCArIHNldHRpbmdzLnNsaWRlTWFyZ2luKSAqIHNldHRpbmdzLnNsaWRlTW92ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3NWID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2VuZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfc1YgKz0gKHBhcnNlSW50KCRjaGlsZHJlbi5lcShpKS53aWR0aCgpKSArIHNldHRpbmdzLnNsaWRlTWFyZ2luKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gX3NWO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNsaWRlVGh1bWI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb247XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzZXR0aW5ncy5jdXJyZW50UGFnZXJQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gKGVsU2l6ZSAvIDIpIC0gKHRodW1iV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGVsU2l6ZSAtIHRodW1iV2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzYyA9IHNjZW5lIC0gJGVsLmZpbmQoJy5jbG9uZS5sZWZ0JykubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciAkcGFnZXIgPSAkc2xpZGUucGFyZW50KCkuZmluZCgnLmxTUGFnZXInKTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubW9kZSA9PT0gJ3NsaWRlJyAmJiBzZXR0aW5ncy5sb29wID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzYyA+PSAkcGFnZXIuY2hpbGRyZW4oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzYyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjID0gJHBhZ2VyLmNoaWxkcmVuKCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0aHVtYlNsaWRlID0gc2MgKiAoKHRodW1iV2lkdGggKyBzZXR0aW5ncy50aHVtYk1hcmdpbikpIC0gKHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoKHRodW1iU2xpZGUgKyBlbFNpemUpID4gcGFnZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aHVtYlNsaWRlID0gcGFnZXJXaWR0aCAtIGVsU2l6ZSAtIHNldHRpbmdzLnRodW1iTWFyZ2luO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGh1bWJTbGlkZSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGh1bWJTbGlkZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubW92ZSgkcGFnZXIsIHRodW1iU2xpZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dG86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXV0bykge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbC5nb1RvTmV4dFNsaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHNldHRpbmdzLnBhdXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b3VjaE1vdmU6IGZ1bmN0aW9uIChlbmRDb29yZHMsIHN0YXJ0Q29vcmRzKSB7XG4gICAgICAgICAgICAgICAgJHNsaWRlLmNzcygndHJhbnNpdGlvbi1kdXJhdGlvbicsICcwbXMnKTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubW9kZSA9PT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBlbmRDb29yZHMgLSBzdGFydENvb3JkcztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN3aXBlVmFsID0gc2xpZGVWYWx1ZSAtIGRpc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHN3aXBlVmFsKSA+PSB3IC0gZWxTaXplIC0gc2V0dGluZ3Muc2xpZGVNYXJnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5mcmVlTW92ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2lwZVZhbCA9IHcgLSBlbFNpemUgLSBzZXR0aW5ncy5zbGlkZU1hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN3aXBlVmFsVCA9IHcgLSBlbFNpemUgLSBzZXR0aW5ncy5zbGlkZU1hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2lwZVZhbCA9IHN3aXBlVmFsVCArICgoc3dpcGVWYWwgLSBzd2lwZVZhbFQpIC8gNSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzd2lwZVZhbCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5mcmVlTW92ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2lwZVZhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXBlVmFsID0gc3dpcGVWYWwgLyA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZSgkZWwsIHN3aXBlVmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b3VjaEVuZDogZnVuY3Rpb24gKGRpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgJHNsaWRlLmNzcygndHJhbnNpdGlvbi1kdXJhdGlvbicsIHNldHRpbmdzLnNwZWVkICsgJ21zJyk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1vZGUgPT09ICdzbGlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG14VmFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlVmFsdWUgPSBzbGlkZVZhbHVlIC0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoc2xpZGVWYWx1ZSkgPiB3IC0gZWxTaXplIC0gc2V0dGluZ3Muc2xpZGVNYXJnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlVmFsdWUgPSB3IC0gZWxTaXplIC0gc2V0dGluZ3Muc2xpZGVNYXJnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXV0b1dpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG14VmFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzbGlkZVZhbHVlIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGdDID0gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW14VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmdzLmF1dG9XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW0gPSBzbGlkZVZhbHVlIC8gKChzbGlkZVdpZHRoICsgc2V0dGluZ3Muc2xpZGVNYXJnaW4pICogc2V0dGluZ3Muc2xpZGVNb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IHBhcnNlSW50KG51bSkgKyBhZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVWYWx1ZSA+PSAodyAtIGVsU2l6ZSAtIHNldHRpbmdzLnNsaWRlTWFyZ2luKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmUrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRXID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0VyArPSAocGFyc2VJbnQoJGNoaWxkcmVuLmVxKGkpLndpZHRoKCkpICsgc2V0dGluZ3Muc2xpZGVNYXJnaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IGkgKyBhZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRXID49IHNsaWRlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPj0gc2V0dGluZ3Muc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdDKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9uZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPD0gLXNldHRpbmdzLnN3aXBlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnQyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9uZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGVsLm1vZGUoX25leHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlVGh1bWIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPj0gc2V0dGluZ3Muc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbC5nb1RvUHJldlNsaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPD0gLXNldHRpbmdzLnN3aXBlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwuZ29Ub05leHRTbGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuXG5cbiAgICAgICAgICAgIGVuYWJsZURyYWc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmICghaXNUb3VjaCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRDb29yZHMgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29vcmRzID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRHJhZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodyA8IGVsU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChlLnRhcmdldCkuYXR0cignY2xhc3MnKSAhPT0gKCdsU1ByZXYnKSAmJiAkKGUudGFyZ2V0KS5hdHRyKCdjbGFzcycpICE9PSAoJ2xTTmV4dCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb29yZHMgPSAoc2V0dGluZ3MudmVydGljYWwgPT09IHRydWUpID8gZS5wYWdlWSA6IGUucGFnZVg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNEcmFnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29vcmRzID0gKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSA/IGUucGFnZVkgOiBlLnBhZ2VYO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnRvdWNoTW92ZShlbmRDb29yZHMsIHN0YXJ0Q29vcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbignbW91c2V1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNEcmFnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFnaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29vcmRzID0gKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSA/IGUucGFnZVkgOiBlLnBhZ2VYO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IGVuZENvb3JkcyAtIHN0YXJ0Q29vcmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPj0gc2V0dGluZ3Muc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdjbGljay5scycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignY2xpY2subHMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudG91Y2hFbmQoZGlzdGFuY2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cblxuXG5cbiAgICAgICAgICAgIGVuYWJsZVRvdWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoaXNUb3VjaCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRDb29yZHMgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvb3JkcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29vcmRzID0gZS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENvb3Jkcy5wYWdlWCA9IGUub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDb29yZHMucGFnZVkgPSBlLm9yaWdpbmFsRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3IDwgZWxTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHcgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcmlnID0gZS5vcmlnaW5hbEV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ29vcmRzID0gb3JpZy50YXJnZXRUb3VjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHhNb3ZlbWVudCA9IE1hdGguYWJzKGVuZENvb3Jkcy5wYWdlWCAtIHN0YXJ0Q29vcmRzLnBhZ2VYKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB5TW92ZW1lbnQgPSBNYXRoLmFicyhlbmRDb29yZHMucGFnZVkgLSBzdGFydENvb3Jkcy5wYWdlWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmVydGljYWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHlNb3ZlbWVudCAqIDMpID4geE1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudG91Y2hNb3ZlKGVuZENvb3Jkcy5wYWdlWSwgc3RhcnRDb29yZHMucGFnZVkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHhNb3ZlbWVudCAqIDMpID4geU1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudG91Y2hNb3ZlKGVuZENvb3Jkcy5wYWdlWCwgc3RhcnRDb29yZHMucGFnZVgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHcgPCBlbFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodyAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gZW5kQ29vcmRzLnBhZ2VZIC0gc3RhcnRDb29yZHMucGFnZVk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IGVuZENvb3Jkcy5wYWdlWCAtIHN0YXJ0Q29vcmRzLnBhZ2VYO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudG91Y2hFbmQoZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICR0aGlzLmluaXRpYWxTdHlsZSgpO1xuICAgICAgICAgICAgICAgICR0aGlzLmF1dG8oKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kb0NzcygpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmVuYWJsZVRvdWNoID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbmFibGVUb3VjaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5lbmFibGVEcmFnID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbmFibGVEcmFnKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHRoaXMucGFnZXIoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5jb250cm9scygpO1xuICAgICAgICAgICAgICAgICR0aGlzLmtleVByZXNzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHBsdWdpbi5idWlsZCgpO1xuICAgICAgICByZWZyZXNoLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZWZyZXNoLmNoYnJlYWtwb2ludCgpO1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZlcnRpY2FsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLml0ZW0gPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsU2l6ZSA9IHNldHRpbmdzLnZlcnRpY2FsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsU2l6ZSA9ICRjaGlsZHJlbi5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2xpZGUuY3NzKCdoZWlnaHQnLCBlbFNpemUgKyAncHgnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxTaXplID0gJHNsaWRlLm91dGVyV2lkdGgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wID09PSB0cnVlICYmIHNldHRpbmdzLm1vZGUgPT09ICdzbGlkZScpIHtcbiAgICAgICAgICAgICAgICByZWZyZXNoLmNsb25lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWZyZXNoLmNhbEwoKTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSBcInNsaWRlXCIpIHtcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2xTU2xpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSBcInNsaWRlXCIpIHtcbiAgICAgICAgICAgICAgICByZWZyZXNoLmNhbFNXKCk7XG4gICAgICAgICAgICAgICAgcmVmcmVzaC5zU1coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSBcInNsaWRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdsU1NsaWRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MucGFnZXIpIHtcbiAgICAgICAgICAgICAgICByZWZyZXNoLmNyZWF0ZVBhZ2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgJiYgc2V0dGluZ3MudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgJGVsLmNzcygnaGVpZ2h0JywgJGNoaWxkcmVuLmVxKHNjZW5lKS5oZWlnaHQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZ2FsbGVyeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5zbGlkZVRodW1iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MubW9kZSA9PT0gXCJzbGlkZVwiKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luLnNsaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXV0b1dpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmICgkY2hpbGRyZW4ubGVuZ3RoIDw9IHNldHRpbmdzLml0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmZpbmQoJy5sU0FjdGlvbicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuZmluZCgnLmxTQWN0aW9uJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKChyZWZyZXNoLmNhbFdpZHRoKGZhbHNlKSA8IGVsU2l6ZSkgJiYgKHcgIT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5maW5kKCcubFNBY3Rpb24nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmZpbmQoJy5sU0FjdGlvbicpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgICRlbC5nb1RvUHJldlNsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHNjZW5lID4gMCkge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLm9uQmVmb3JlUHJldlNsaWRlLmNhbGwodGhpcywgJGVsLCBzY2VuZSk7XG4gICAgICAgICAgICAgICAgc2NlbmUtLTtcbiAgICAgICAgICAgICAgICAkZWwubW9kZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmdhbGxlcnkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNsaWRlVGh1bWIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLm9uQmVmb3JlUHJldlNsaWRlLmNhbGwodGhpcywgJGVsLCBzY2VuZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSAnZmFkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gKGxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmUgPSBwYXJzZUludChsIC8gc2V0dGluZ3Muc2xpZGVNb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkZWwubW9kZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5nYWxsZXJ5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2xpZGVUaHVtYigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5zbGlkZUVuZEFuaW1hdG9pbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2xlZnRFbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2xlZnRFbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgICRlbC5nb1RvTmV4dFNsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5leHRJID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9zbGlkZVZhbHVlID0gcGx1Z2luLnNsaWRlVmFsdWUoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEkgPSBfc2xpZGVWYWx1ZSA8IHcgLSBlbFNpemUgLSBzZXR0aW5ncy5zbGlkZU1hcmdpbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoKHNjZW5lICogc2V0dGluZ3Muc2xpZGVNb3ZlKSA8IGxlbmd0aCAtIHNldHRpbmdzLnNsaWRlTW92ZSkgJiYgbmV4dEkpIHtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5vbkJlZm9yZU5leHRTbGlkZS5jYWxsKHRoaXMsICRlbCwgc2NlbmUpO1xuICAgICAgICAgICAgICAgIHNjZW5lKys7XG4gICAgICAgICAgICAgICAgJGVsLm1vZGUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5nYWxsZXJ5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zbGlkZVRodW1iKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9vcCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5vbkJlZm9yZU5leHRTbGlkZS5jYWxsKHRoaXMsICRlbCwgc2NlbmUpO1xuICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICRlbC5tb2RlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmdhbGxlcnkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zbGlkZVRodW1iKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNldHRpbmdzLnNsaWRlRW5kQW5pbWF0b2luID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbC5hZGRDbGFzcygncmlnaHRFbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ3JpZ2h0RW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkZWwubW9kZSA9IGZ1bmN0aW9uIChfdG91Y2gpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSAmJiBzZXR0aW5ncy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkZWwuY3NzKCdoZWlnaHQnLCAkY2hpbGRyZW4uZXEoc2NlbmUpLmhlaWdodCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubW9kZSA9PT0gXCJzbGlkZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW4uZG9Dc3MoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdsU1NsaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3Muc3BlZWQgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmNzcygndHJhbnNpdGlvbi1kdXJhdGlvbicsIHNldHRpbmdzLnNwZWVkICsgJ21zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuY3NzRWFzaW5nICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5jc3MoJ3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJywgc2V0dGluZ3MuY3NzRWFzaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW4uZG9Dc3MoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnNwZWVkICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbC5jc3MoJ3RyYW5zaXRpb24tZHVyYXRpb24nLCBzZXR0aW5ncy5zcGVlZCArICdtcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNzc0Vhc2luZyAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWwuY3NzKCd0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbicsIHNldHRpbmdzLmNzc0Vhc2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIV90b3VjaCkge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLm9uQmVmb3JlU2xpZGUuY2FsbCh0aGlzLCAkZWwsIHNjZW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tb2RlID09PSBcInNsaWRlXCIpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW4uc2xpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luLmZhZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghX3RvdWNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLm9uQWZ0ZXJTbGlkZS5jYWxsKHRoaXMsICRlbCwgc2NlbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHNldHRpbmdzLnNwZWVkKTtcbiAgICAgICAgICAgIG9uID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgJGVsLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICRlbC5nb1RvTmV4dFNsaWRlKCk7XG4gICAgICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkZWwuZ29Ub05leHRTbGlkZSgpO1xuICAgICAgICAgICAgfSwgc2V0dGluZ3MucGF1c2UpO1xuICAgICAgICB9O1xuICAgICAgICAkZWwucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfTtcbiAgICAgICAgJGVsLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZWZyZXNoLmluaXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgJGVsLmdldEN1cnJlbnRTbGlkZUNvdW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNjID0gc2NlbmU7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9vcCkge1xuICAgICAgICAgICAgICAgIHZhciBsbiA9ICRzbGlkZS5maW5kKCcubHNsaWRlJykubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBjbCA9ICRlbC5maW5kKCcuY2xvbmUubGVmdCcpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZihzY2VuZTw9Y2wtMSl7XG4gICAgICAgICAgICAgICAgICAgIHNjID0gbG4gICsgKHNjZW5lLWNsKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihzY2VuZSA+PSAobG4rY2wpKXtcbiAgICAgICAgICAgICAgICAgICAgc2MgPSBzY2VuZSAtIGxuIC0gY2w7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHNjID0gc2NlbmUgLSBjbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHNjKzE7XG4gICAgICAgIH07XG4gICAgICAgICRlbC5nZXRUb3RhbFNsaWRlQ291bnQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRzbGlkZS5maW5kKCcubHNsaWRlJykubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICAkZWwuZ29Ub1NsaWRlID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb29wKSB7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSAocyArICRlbC5maW5kKCcuY2xvbmUubGVmdCcpLmxlbmd0aCAtMSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkZWwubW9kZShmYWxzZSk7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZ2FsbGVyeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5zbGlkZVRodW1iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNldHRpbmdzLm9uU2xpZGVyTG9hZC5jYWxsKHRoaXMsICRlbCk7XG4gICAgICAgIH0sMTApO1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgcmVmcmVzaC5pbml0KCk7XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn0oalF1ZXJ5KSk7IiwiLyoqXHJcbioganF1ZXJ5Lm1hdGNoSGVpZ2h0LmpzIG1hc3RlclxyXG4qIGh0dHA6Ly9icm0uaW8vanF1ZXJ5LW1hdGNoLWhlaWdodC9cclxuKiBMaWNlbnNlOiBNSVRcclxuKi9cclxuXHJcbjsoZnVuY3Rpb24oJCkge1xyXG4gICAgLypcclxuICAgICogIGludGVybmFsXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcHJldmlvdXNSZXNpemVXaWR0aCA9IC0xLFxyXG4gICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XHJcblxyXG4gICAgLypcclxuICAgICogIF9wYXJzZVxyXG4gICAgKiAgdmFsdWUgcGFyc2UgdXRpbGl0eSBmdW5jdGlvblxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3BhcnNlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAvLyBwYXJzZSB2YWx1ZSBhbmQgY29udmVydCBOYU4gdG8gMFxyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3Jvd3NcclxuICAgICogIHV0aWxpdHkgZnVuY3Rpb24gcmV0dXJucyBhcnJheSBvZiBqUXVlcnkgc2VsZWN0aW9ucyByZXByZXNlbnRpbmcgZWFjaCByb3dcclxuICAgICogIChhcyBkaXNwbGF5ZWQgYWZ0ZXIgZmxvYXQgd3JhcHBpbmcgYXBwbGllZCBieSBicm93c2VyKVxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3Jvd3MgPSBmdW5jdGlvbihlbGVtZW50cykge1xyXG4gICAgICAgIHZhciB0b2xlcmFuY2UgPSAxLFxyXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcclxuICAgICAgICAgICAgbGFzdFRvcCA9IG51bGwsXHJcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gZ3JvdXAgZWxlbWVudHMgYnkgdGhlaXIgdG9wIHBvc2l0aW9uXHJcbiAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRvcCA9ICR0aGF0Lm9mZnNldCgpLnRvcCAtIF9wYXJzZSgkdGhhdC5jc3MoJ21hcmdpbi10b3AnKSksXHJcbiAgICAgICAgICAgICAgICBsYXN0Um93ID0gcm93cy5sZW5ndGggPiAwID8gcm93c1tyb3dzLmxlbmd0aCAtIDFdIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXN0Um93ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBpdGVtIG9uIHRoZSByb3csIHNvIGp1c3QgcHVzaCBpdFxyXG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb3cgdG9wIGlzIHRoZSBzYW1lLCBhZGQgdG8gdGhlIHJvdyBncm91cFxyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5hYnMobGFzdFRvcCAtIHRvcCkpIDw9IHRvbGVyYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXSA9IGxhc3RSb3cuYWRkKCR0aGF0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0YXJ0IGEgbmV3IHJvdyBncm91cFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGxhc3Qgcm93IHRvcFxyXG4gICAgICAgICAgICBsYXN0VG9wID0gdG9wO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm93cztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIF9wYXJzZU9wdGlvbnNcclxuICAgICogIGhhbmRsZSBwbHVnaW4gb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3BhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgYnlSb3c6IHRydWUsXHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcclxuICAgICAgICAgICAgdGFyZ2V0OiBudWxsLFxyXG4gICAgICAgICAgICByZW1vdmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQob3B0cywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBvcHRzLmJ5Um93ID0gb3B0aW9ucztcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgICAgICAgIG9wdHMucmVtb3ZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvcHRzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHRcclxuICAgICogIHBsdWdpbiBkZWZpbml0aW9uXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBtYXRjaEhlaWdodCA9ICQuZm4ubWF0Y2hIZWlnaHQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgcmVtb3ZlXHJcbiAgICAgICAgaWYgKG9wdHMucmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmaXhlZCBoZWlnaHQgZnJvbSBhbGwgc2VsZWN0ZWQgZWxlbWVudHNcclxuICAgICAgICAgICAgdGhpcy5jc3Mob3B0cy5wcm9wZXJ0eSwgJycpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGVkIGVsZW1lbnRzIGZyb20gYWxsIGdyb3Vwc1xyXG4gICAgICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oa2V5LCBncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZWxlbWVudHMgPSBncm91cC5lbGVtZW50cy5ub3QodGhhdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW51cCBlbXB0eSBncm91cHNcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IDEgJiYgIW9wdHMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGlzIGdyb3VwIHNvIHdlIGNhbiByZS1hcHBseSBsYXRlciBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2dyb3Vwcy5wdXNoKHtcclxuICAgICAgICAgICAgZWxlbWVudHM6IHRoaXMsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdHNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbWF0Y2ggZWFjaCBlbGVtZW50J3MgaGVpZ2h0IHRvIHRoZSB0YWxsZXN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvblxyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLCBvcHRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBwbHVnaW4gZ2xvYmFsIG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX2dyb3VwcyA9IFtdO1xyXG4gICAgbWF0Y2hIZWlnaHQuX3Rocm90dGxlID0gODA7XHJcbiAgICBtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSBmYWxzZTtcclxuICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUgPSBudWxsO1xyXG4gICAgbWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5XHJcbiAgICAqICBhcHBseSBtYXRjaEhlaWdodCB0byBnaXZlbiBlbGVtZW50c1xyXG4gICAgKi9cclxuXHJcbiAgICBtYXRjaEhlaWdodC5fYXBwbHkgPSBmdW5jdGlvbihlbGVtZW50cywgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKSxcclxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXHJcbiAgICAgICAgICAgIHJvd3MgPSBbJGVsZW1lbnRzXTtcclxuXHJcbiAgICAgICAgLy8gdGFrZSBub3RlIG9mIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcbiAgICAgICAgICAgIGh0bWxIZWlnaHQgPSAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIGdldCBoaWRkZW4gcGFyZW50c1xyXG4gICAgICAgIHZhciAkaGlkZGVuUGFyZW50cyA9ICRlbGVtZW50cy5wYXJlbnRzKCkuZmlsdGVyKCc6aGlkZGVuJyk7XHJcblxyXG4gICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB0ZW1wb3JhcmlseSBtdXN0IGZvcmNlIGhpZGRlbiBwYXJlbnRzIHZpc2libGVcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHJvd3MgaWYgdXNpbmcgYnlSb3csIG90aGVyd2lzZSBhc3N1bWUgb25lIHJvd1xyXG4gICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICFvcHRzLnRhcmdldCkge1xyXG5cclxuICAgICAgICAgICAgLy8gbXVzdCBmaXJzdCBmb3JjZSBhbiBhcmJpdHJhcnkgZXF1YWwgaGVpZ2h0IHNvIGZsb2F0aW5nIGVsZW1lbnRzIGJyZWFrIGV2ZW5seVxyXG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpID09PSAnaW5saW5lLWJsb2NrJyA/ICdpbmxpbmUtYmxvY2snIDogJ2Jsb2NrJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiBkaXNwbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci10b3Atd2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1ib3R0b20td2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDBweCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYXJyYXkgb2Ygcm93cyAoYmFzZWQgb24gZWxlbWVudCB0b3AgcG9zaXRpb24pXHJcbiAgICAgICAgICAgIHJvd3MgPSBfcm93cygkZWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmV2ZXJ0IG9yaWdpbmFsIGlubGluZSBzdHlsZXNcclxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8ICcnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmVhY2gocm93cywgZnVuY3Rpb24oa2V5LCByb3cpIHtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHJvdyksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHRzLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBhcHBseSB0byByb3dzIHdpdGggb25seSBvbmUgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgJHJvdy5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb3cuY3NzKG9wdHMucHJvcGVydHksICcnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBmaW5kIHRoZSBtYXggaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5JykgPT09ICdpbmxpbmUtYmxvY2snID8gJ2lubGluZS1ibG9jaycgOiAnYmxvY2snO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgd2UgZ2V0IHRoZSBjb3JyZWN0IGFjdHVhbCBoZWlnaHQgKGFuZCBub3QgYSBwcmV2aW91c2x5IHNldCBoZWlnaHQgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNzcyA9IHsgJ2Rpc3BsYXknOiBkaXNwbGF5IH07XHJcbiAgICAgICAgICAgICAgICAgICAgY3NzW29wdHMucHJvcGVydHldID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKGNzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIG1heCBoZWlnaHQgKGluY2x1ZGluZyBwYWRkaW5nLCBidXQgbm90IG1hcmdpbilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpID4gdGFyZ2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9ICR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVydCBkaXNwbGF5IGJsb2NrXHJcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKCdkaXNwbGF5JywgJycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgc2V0LCB1c2UgdGhlIGhlaWdodCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IG9wdHMudGFyZ2V0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBhcHBseSB0aGUgaGVpZ2h0IHRvIGFsbCBlbGVtZW50c1xyXG4gICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhcHBseSB0byBhIHRhcmdldFxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudGFyZ2V0ICYmICR0aGF0LmlzKG9wdHMudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgcGFkZGluZyBhbmQgYm9yZGVyIGNvcnJlY3RseSAocmVxdWlyZWQgd2hlbiBub3QgdXNpbmcgYm9yZGVyLWJveClcclxuICAgICAgICAgICAgICAgIGlmICgkdGhhdC5jc3MoJ2JveC1zaXppbmcnKSAhPT0gJ2JvcmRlci1ib3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci10b3Atd2lkdGgnKSkgKyBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItYm90dG9tLXdpZHRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLXRvcCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgaGVpZ2h0IChhY2NvdW50aW5nIGZvciBwYWRkaW5nIGFuZCBib3JkZXIpXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Mob3B0cy5wcm9wZXJ0eSwgdGFyZ2V0SGVpZ2h0IC0gdmVydGljYWxQYWRkaW5nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHJldmVydCBoaWRkZW4gcGFyZW50c1xyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmVzdG9yZSBzY3JvbGwgcG9zaXRpb24gaWYgZW5hYmxlZFxyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgoc2Nyb2xsVG9wIC8gaHRtbEhlaWdodCkgKiAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpXHJcbiAgICAqICBhcHBsaWVzIG1hdGNoSGVpZ2h0IHRvIGFsbCBlbGVtZW50cyB3aXRoIGEgZGF0YS1tYXRjaC1oZWlnaHQgYXR0cmlidXRlXHJcbiAgICAqL1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZ3JvdXBzID0ge307XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGdyb3VwcyBieSB0aGVpciBncm91cElkIHNldCBieSBlbGVtZW50cyB1c2luZyBkYXRhLW1hdGNoLWhlaWdodFxyXG4gICAgICAgICQoJ1tkYXRhLW1hdGNoLWhlaWdodF0sIFtkYXRhLW1oXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBncm91cElkID0gJHRoaXMuYXR0cignZGF0YS1taCcpIHx8ICR0aGlzLmF0dHIoJ2RhdGEtbWF0Y2gtaGVpZ2h0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCBpbiBncm91cHMpIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9IGdyb3Vwc1tncm91cElkXS5hZGQoJHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gJHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZWFjaCBncm91cFxyXG4gICAgICAgICQuZWFjaChncm91cHMsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1hdGNoSGVpZ2h0KHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX3VwZGF0ZVxyXG4gICAgKiAgdXBkYXRlcyBtYXRjaEhlaWdodCBvbiBhbGwgY3VycmVudCBncm91cHMgd2l0aCB0aGVpciBjb3JyZWN0IG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgdmFyIF91cGRhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcy5lbGVtZW50cywgdGhpcy5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSA9IGZ1bmN0aW9uKHRocm90dGxlLCBldmVudCkge1xyXG4gICAgICAgIC8vIHByZXZlbnQgdXBkYXRlIGlmIGZpcmVkIGZyb20gYSByZXNpemUgZXZlbnRcclxuICAgICAgICAvLyB3aGVyZSB0aGUgdmlld3BvcnQgd2lkdGggaGFzbid0IGFjdHVhbGx5IGNoYW5nZWRcclxuICAgICAgICAvLyBmaXhlcyBhbiBldmVudCBsb29waW5nIGJ1ZyBpbiBJRThcclxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ3Jlc2l6ZScpIHtcclxuICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dXaWR0aCA9PT0gX3ByZXZpb3VzUmVzaXplV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfcHJldmlvdXNSZXNpemVXaWR0aCA9IHdpbmRvd1dpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhyb3R0bGUgdXBkYXRlc1xyXG4gICAgICAgIGlmICghdGhyb3R0bGUpIHtcclxuICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfdXBkYXRlVGltZW91dCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xyXG4gICAgICAgICAgICB9LCBtYXRjaEhlaWdodC5fdGhyb3R0bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIGJpbmQgZXZlbnRzXHJcbiAgICAqL1xyXG5cclxuICAgIC8vIGFwcGx5IG9uIERPTSByZWFkeSBldmVudFxyXG4gICAgJChtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgaGVpZ2h0cyBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAkKHdpbmRvdykuYmluZCgnbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZShmYWxzZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdGhyb3R0bGVkIHVwZGF0ZSBoZWlnaHRzIG9uIHJlc2l6ZSBldmVudHNcclxuICAgICQod2luZG93KS5iaW5kKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUodHJ1ZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcblxyXG59KShqUXVlcnkpO1xyXG4iLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuTUlYVCBKUyBQTFVHSU5TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4ndXNlIHN0cmljdCc7IC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXHJcblxyXG4vLyBSZXNpemUgSWZyYW1lcyBQcm9wb3J0aW9uYWxseVxyXG5mdW5jdGlvbiBpZnJhbWVBc3BlY3Qoc2VsZWN0b3IpIHtcclxuXHRzZWxlY3RvciA9IHNlbGVjdG9yIHx8IGpRdWVyeSgnaWZyYW1lJyk7XHJcblxyXG5cdHNlbGVjdG9yLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0LyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG5cdFx0dmFyIGlmcmFtZSA9IGpRdWVyeSh0aGlzKSxcclxuXHRcdFx0d2lkdGggID0gaWZyYW1lLndpZHRoKCk7XHJcblx0XHRpZiAoIHR5cGVvZihpZnJhbWUuZGF0YSgncmF0aW8nKSkgPT0gJ3VuZGVmaW5lZCcgKSB7XHJcblx0XHRcdHZhciBhdHRyVyA9IHRoaXMud2lkdGgsXHJcblx0XHRcdFx0YXR0ckggPSB0aGlzLmhlaWdodDtcclxuXHRcdFx0aWZyYW1lLmRhdGEoJ3JhdGlvJywgYXR0ckggLyBhdHRyVyApLnJlbW92ZUF0dHIoJ3dpZHRoJykucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XHJcblx0XHR9XHJcblx0XHRpZnJhbWUuaGVpZ2h0KCB3aWR0aCAqIGlmcmFtZS5kYXRhKCdyYXRpbycpICk7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIExpZ2h0ZW4gLyBEYXJrZW4gQ29sb3IgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XHJcbmZ1bmN0aW9uIHNoYWRlQ29sb3IoY29sb3IsIHBlcmNlbnQpIHsgICBcclxuXHR2YXIgZj1wYXJzZUludChjb2xvci5zbGljZSgxKSwxNiksdD1wZXJjZW50PDA/MDoyNTUscD1wZXJjZW50PDA/cGVyY2VudCotMTpwZXJjZW50LFI9Zj4+MTYsRz1mPj44JjB4MDBGRixCPWYmMHgwMDAwRkY7XHJcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKCh0LVIpKnApK1IpKjB4MTAwMDArKE1hdGgucm91bmQoKHQtRykqcCkrRykqMHgxMDArKE1hdGgucm91bmQoKHQtQikqcCkrQikpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxufVxyXG5cclxuLy8gQmxlbmQgQ29sb3JzIC0gQ3JlZGl0IFwiUGltcCBUcml6a2l0XCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNjkzOTI3L3BpbXAtdHJpemtpdFxyXG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcclxuXHR2YXIgZj1wYXJzZUludChjMC5zbGljZSgxKSwxNiksdD1wYXJzZUludChjMS5zbGljZSgxKSwxNiksUjE9Zj4+MTYsRzE9Zj4+OCYweDAwRkYsQjE9ZiYweDAwMDBGRixSMj10Pj4xNixHMj10Pj44JjB4MDBGRixCMj10JjB4MDAwMEZGO1xyXG5cdHJldHVybiAnIycrKDB4MTAwMDAwMCsoTWF0aC5yb3VuZCgoUjItUjEpKnApK1IxKSoweDEwMDAwKyhNYXRoLnJvdW5kKChHMi1HMSkqcCkrRzEpKjB4MTAwKyhNYXRoLnJvdW5kKChCMi1CMSkqcCkrQjEpKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8vIENvbG9yIExpZ2h0IE9yIERhcmsgLSBDcmVkaXQgXCJMYXJyeSBGb3hcIiAtIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2xhcnJ5Zm94LzE2MzYzMzhcclxuZnVuY3Rpb24gY29sb3JMb0QoY29sb3IpIHtcclxuXHR2YXIgcixiLGcsaHNwLGEgPSBjb2xvcjtcclxuXHRpZiAoYS5tYXRjaCgvXnJnYi8pKSB7XHJcblx0XHRhID0gYS5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKSg/OixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pKT9cXCkkLyk7XHJcblx0XHRyID0gYVsxXTtcclxuXHRcdGIgPSBhWzJdO1xyXG5cdFx0ZyA9IGFbM107XHJcblx0fSBlbHNlIHtcclxuXHRcdGEgPSArKCcweCcgKyBhLnNsaWNlKDEpLnJlcGxhY2UoYS5sZW5ndGggPCA1ICYmIC8uL2csICckJiQmJykpO1xyXG5cdFx0ciA9IGEgPj4gMTY7XHJcblx0XHRiID0gYSA+PiA4ICYgMjU1O1xyXG5cdFx0ZyA9IGEgJiAyNTU7XHJcblx0fVxyXG5cdGhzcCA9IE1hdGguc3FydChcclxuXHRcdDAuMjk5ICogKHIgKiByKSArXHJcblx0XHQwLjU4NyAqIChnICogZykgK1xyXG5cdFx0MC4xMTQgKiAoYiAqIGIpXHJcblx0KTtcclxuXHRpZiAoaHNwPjEyNy41KSB7XHJcblx0XHRyZXR1cm4gJ2xpZ2h0JztcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICdkYXJrJztcclxuXHR9XHJcbn0gXHJcblxyXG4vLyBJbWFnZSBMaWdodCBPciBEYXJrIEltYWdlIC0gQ3JlZGl0IFwiSm9zZXBoIFBvcnRlbGxpXCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTQ5NjM2L2pvc2VwaC1wb3J0ZWxsaVxyXG5mdW5jdGlvbiBpbWFnZUxvRChpbWFnZVNyYywgY2FsbGJhY2spIHtcclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblx0aW1nLnNyYyA9IGltYWdlU3JjO1xyXG5cdGltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcclxuXHJcblx0dmFyIGNvbG9yU3VtID0gMDtcclxuXHJcblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRlIGNhbnZhc1xyXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMsMCwwKTtcclxuXHJcblx0XHR2YXIgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0dmFyIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcclxuXHRcdHZhciByLGcsYixhdmc7XHJcblxyXG5cdFx0Zm9yKHZhciB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHgrPTQpIHtcclxuXHRcdFx0ciA9IGRhdGFbeF07XHJcblx0XHRcdGcgPSBkYXRhW3grMV07XHJcblx0XHRcdGIgPSBkYXRhW3grMl07XHJcblxyXG5cdFx0XHRhdmcgPSBNYXRoLmZsb29yKChyK2crYikvMyk7XHJcblx0XHRcdGNvbG9yU3VtICs9IGF2ZztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAodGhpcy53aWR0aCp0aGlzLmhlaWdodCkpO1xyXG5cdFx0Y2FsbGJhY2soYnJpZ2h0bmVzcyk7XHJcblx0fTtcclxufVxyXG5cclxuLy8gUmVzaXplIEltYWdlIFRvIEZpbGwgQ29udGFpbmVyIFNpemVcclxuZnVuY3Rpb24gaW1hZ2VDb3Zlcihjb250LCB0eXBlLCBjb3JySCkge1xyXG5cdHR5cGUgPSB0eXBlIHx8ICdiZyc7XHJcblxyXG5cdGNvbnQuYWRkQ2xhc3MoJ2ltYWdlLWNvdmVyJyk7XHJcblxyXG5cdHZhciBpbWcsIGltZ1VybCwgaW1nV2lkdGggPSAwLCBpbWdIZWlnaHQgPSAwO1xyXG5cclxuXHRpZiAoIHR5cGUgPT0gJ2ltZycgKSB7XHJcblx0XHRpbWcgPSBjb250LmZpbmQoJy5iZy1pbWcnKTtcclxuXHRcdGltZ1dpZHRoICA9IGltZy53aWR0aCgpO1xyXG5cdFx0aW1nSGVpZ2h0ID0gaW1nLmhlaWdodCgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpbWdVcmwgPSBjb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLm1hdGNoKC9edXJsXFwoXCI/KC4rPylcIj9cXCkkLyk7XHJcblx0XHRpZiAoIGltZ1VybFsxXSApIHtcclxuXHRcdCAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdCAgICBpbWcuc3JjID0gaW1nVXJsWzFdO1xyXG5cdFx0ICAgIGltZ1dpZHRoICA9IGltZy53aWR0aDtcclxuXHRcdCAgICBpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCBpbWdXaWR0aCAhPT0gMCAmJiBpbWdIZWlnaHQgIT09IDAgKSB7XHJcblx0XHR2YXIgY29udFdpZHRoICA9IGNvbnQub3V0ZXJXaWR0aCgpLFxyXG5cdFx0XHRjb250SGVpZ2h0ID0gY29udC5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRoZWlnaHREaWZmID0gY29udFdpZHRoIC8gaW1nV2lkdGggKiBpbWdIZWlnaHQsXHJcblx0XHRcdG5ld1dpZHRoICAgPSAnYXV0bycsXHJcblx0XHRcdG5ld0hlaWdodCAgPSBjb250SGVpZ2h0ICsgY29yckggKyAncHgnO1xyXG5cclxuXHRcdFx0aWYgKCBoZWlnaHREaWZmID4gY29udEhlaWdodCApIHtcclxuXHRcdFx0XHRuZXdXaWR0aCAgPSAnMTAwJSc7XHJcblx0XHRcdFx0bmV3SGVpZ2h0ID0gJ2F1dG8nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICkge1xyXG5cdFx0XHRpbWcuY3NzKHsgd2lkdGg6IG5ld1dpZHRoLCBoZWlnaHQ6IG5ld0hlaWdodCB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnQuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBuZXdXaWR0aCArICcgJyArIG5ld0hlaWdodCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBEZXRlcm1pbmUgSWYgQW4gRWxlbWVudCBJcyBTY3JvbGxlZCBJbnRvIFZpZXdcclxuZnVuY3Rpb24gZWxlbVZpc2libGUoZWxlbSwgY29udCkge1xyXG5cdHZhciBjb250VG9wID0gY29udC5zY3JvbGxUb3AoKSxcclxuXHRcdGNvbnRCdG0gPSBjb250VG9wICsgY29udC5oZWlnaHQoKSxcclxuXHRcdGVsZW1Ub3AgPSBlbGVtLm9mZnNldCgpLnRvcCxcclxuXHRcdGVsZW1CdG0gPSBlbGVtVG9wICsgZWxlbS5oZWlnaHQoKTtcclxuXHJcblx0cmV0dXJuICgoZWxlbUJ0bSA8PSBjb250QnRtKSAmJiAoZWxlbVRvcCA+PSBjb250VG9wKSk7XHJcbn0iLCIvKiBNb2Rlcm5penIgMi44LjMgKEN1c3RvbSBCdWlsZCkgfCBNSVQgJiBCU0RcbiAqIEJ1aWxkOiBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZC8jLWJhY2tncm91bmRzaXplLXJnYmEtY3NzYW5pbWF0aW9ucy1nZW5lcmF0ZWRjb250ZW50LWNzc3RyYW5zaXRpb25zLWF1ZGlvLXZpZGVvLXN2Zy1zaGl2LWFkZHRlc3QtdGVzdHN0eWxlcy10ZXN0cHJvcC10ZXN0YWxscHJvcHMtZG9tcHJlZml4ZXMtY3NzX2JhY2tncm91bmRzaXplY292ZXItY3NzX3ZodW5pdC1jc3Nfdnd1bml0LWxvYWRcbiAqL1xuO3dpbmRvdy5Nb2Rlcm5penI9ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIHooYSl7aS5jc3NUZXh0PWF9ZnVuY3Rpb24gQShhLGIpe3JldHVybiB6KHByZWZpeGVzLmpvaW4oYStcIjtcIikrKGJ8fFwiXCIpKX1mdW5jdGlvbiBCKGEsYil7cmV0dXJuIHR5cGVvZiBhPT09Yn1mdW5jdGlvbiBDKGEsYil7cmV0dXJuISF+KFwiXCIrYSkuaW5kZXhPZihiKX1mdW5jdGlvbiBEKGEsYil7Zm9yKHZhciBkIGluIGEpe3ZhciBlPWFbZF07aWYoIUMoZSxcIi1cIikmJmlbZV0hPT1jKXJldHVybiBiPT1cInBmeFwiP2U6ITB9cmV0dXJuITF9ZnVuY3Rpb24gRShhLGIsZCl7Zm9yKHZhciBlIGluIGEpe3ZhciBmPWJbYVtlXV07aWYoZiE9PWMpcmV0dXJuIGQ9PT0hMT9hW2VdOkIoZixcImZ1bmN0aW9uXCIpP2YuYmluZChkfHxiKTpmfXJldHVybiExfWZ1bmN0aW9uIEYoYSxiLGMpe3ZhciBkPWEuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYS5zbGljZSgxKSxlPShhK1wiIFwiK24uam9pbihkK1wiIFwiKStkKS5zcGxpdChcIiBcIik7cmV0dXJuIEIoYixcInN0cmluZ1wiKXx8QihiLFwidW5kZWZpbmVkXCIpP0QoZSxiKTooZT0oYStcIiBcIitvLmpvaW4oZCtcIiBcIikrZCkuc3BsaXQoXCIgXCIpLEUoZSxiLGMpKX12YXIgZD1cIjIuOC4zXCIsZT17fSxmPWIuZG9jdW1lbnRFbGVtZW50LGc9XCJtb2Rlcm5penJcIixoPWIuY3JlYXRlRWxlbWVudChnKSxpPWguc3R5bGUsaixrPVwiOilcIixsPXt9LnRvU3RyaW5nLG09XCJXZWJraXQgTW96IE8gbXNcIixuPW0uc3BsaXQoXCIgXCIpLG89bS50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKSxwPXtzdmc6XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wifSxxPXt9LHI9e30scz17fSx0PVtdLHU9dC5zbGljZSx2LHc9ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGgsaSxqLGssbD1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksbT1iLmJvZHksbj1tfHxiLmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO2lmKHBhcnNlSW50KGQsMTApKXdoaWxlKGQtLSlqPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxqLmlkPWU/ZVtkXTpnKyhkKzEpLGwuYXBwZW5kQ2hpbGQoaik7cmV0dXJuIGg9W1wiJiMxNzM7XCIsJzxzdHlsZSBpZD1cInMnLGcsJ1wiPicsYSxcIjwvc3R5bGU+XCJdLmpvaW4oXCJcIiksbC5pZD1nLChtP2w6bikuaW5uZXJIVE1MKz1oLG4uYXBwZW5kQ2hpbGQobCksbXx8KG4uc3R5bGUuYmFja2dyb3VuZD1cIlwiLG4uc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixrPWYuc3R5bGUub3ZlcmZsb3csZi5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLGYuYXBwZW5kQ2hpbGQobikpLGk9YyhsLGEpLG0/bC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGwpOihuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobiksZi5zdHlsZS5vdmVyZmxvdz1rKSwhIWl9LHg9e30uaGFzT3duUHJvcGVydHkseTshQih4LFwidW5kZWZpbmVkXCIpJiYhQih4LmNhbGwsXCJ1bmRlZmluZWRcIik/eT1mdW5jdGlvbihhLGIpe3JldHVybiB4LmNhbGwoYSxiKX06eT1mdW5jdGlvbihhLGIpe3JldHVybiBiIGluIGEmJkIoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbYl0sXCJ1bmRlZmluZWRcIil9LEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kfHwoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztpZih0eXBlb2YgYyE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGQ9dS5jYWxsKGFyZ3VtZW50cywxKSxlPWZ1bmN0aW9uKCl7aWYodGhpcyBpbnN0YW5jZW9mIGUpe3ZhciBhPWZ1bmN0aW9uKCl7fTthLnByb3RvdHlwZT1jLnByb3RvdHlwZTt2YXIgZj1uZXcgYSxnPWMuYXBwbHkoZixkLmNvbmNhdCh1LmNhbGwoYXJndW1lbnRzKSkpO3JldHVybiBPYmplY3QoZyk9PT1nP2c6Zn1yZXR1cm4gYy5hcHBseShiLGQuY29uY2F0KHUuY2FsbChhcmd1bWVudHMpKSl9O3JldHVybiBlfSkscS5yZ2JhPWZ1bmN0aW9uKCl7cmV0dXJuIHooXCJiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTUwLDI1NSwxNTAsLjUpXCIpLEMoaS5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfSxxLmJhY2tncm91bmRzaXplPWZ1bmN0aW9uKCl7cmV0dXJuIEYoXCJiYWNrZ3JvdW5kU2l6ZVwiKX0scS5jc3NhbmltYXRpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIEYoXCJhbmltYXRpb25OYW1lXCIpfSxxLmNzc3RyYW5zaXRpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIEYoXCJ0cmFuc2l0aW9uXCIpfSxxLmdlbmVyYXRlZGNvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gdyhbXCIjXCIsZyxcIntmb250OjAvMCBhfSNcIixnLCc6YWZ0ZXJ7Y29udGVudDpcIicsaywnXCI7dmlzaWJpbGl0eTpoaWRkZW47Zm9udDozcHgvMSBhfSddLmpvaW4oXCJcIiksZnVuY3Rpb24oYil7YT1iLm9mZnNldEhlaWdodD49M30pLGF9LHEudmlkZW89ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKSxjPSExO3RyeXtpZihjPSEhYS5jYW5QbGF5VHlwZSljPW5ldyBCb29sZWFuKGMpLGMub2dnPWEuY2FuUGxheVR5cGUoJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLmgyNjQ9YS5jYW5QbGF5VHlwZSgndmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRVwiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksYy53ZWJtPWEuY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOCwgdm9yYmlzXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKX1jYXRjaChkKXt9cmV0dXJuIGN9LHEuYXVkaW89ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKSxjPSExO3RyeXtpZihjPSEhYS5jYW5QbGF5VHlwZSljPW5ldyBCb29sZWFuKGMpLGMub2dnPWEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLm1wMz1hLmNhblBsYXlUeXBlKFwiYXVkaW8vbXBlZztcIikucmVwbGFjZSgvXm5vJC8sXCJcIiksYy53YXY9YS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLm00YT0oYS5jYW5QbGF5VHlwZShcImF1ZGlvL3gtbTRhO1wiKXx8YS5jYW5QbGF5VHlwZShcImF1ZGlvL2FhYztcIikpLnJlcGxhY2UoL15ubyQvLFwiXCIpfWNhdGNoKGQpe31yZXR1cm4gY30scS5zdmc9ZnVuY3Rpb24oKXtyZXR1cm4hIWIuY3JlYXRlRWxlbWVudE5TJiYhIWIuY3JlYXRlRWxlbWVudE5TKHAuc3ZnLFwic3ZnXCIpLmNyZWF0ZVNWR1JlY3R9O2Zvcih2YXIgRyBpbiBxKXkocSxHKSYmKHY9Ry50b0xvd2VyQ2FzZSgpLGVbdl09cVtHXSgpLHQucHVzaCgoZVt2XT9cIlwiOlwibm8tXCIpK3YpKTtyZXR1cm4gZS5hZGRUZXN0PWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGE9PVwib2JqZWN0XCIpZm9yKHZhciBkIGluIGEpeShhLGQpJiZlLmFkZFRlc3QoZCxhW2RdKTtlbHNle2E9YS50b0xvd2VyQ2FzZSgpO2lmKGVbYV0hPT1jKXJldHVybiBlO2I9dHlwZW9mIGI9PVwiZnVuY3Rpb25cIj9iKCk6Yix0eXBlb2YgZW5hYmxlQ2xhc3NlcyE9XCJ1bmRlZmluZWRcIiYmZW5hYmxlQ2xhc3NlcyYmKGYuY2xhc3NOYW1lKz1cIiBcIisoYj9cIlwiOlwibm8tXCIpK2EpLGVbYV09Yn1yZXR1cm4gZX0seihcIlwiKSxoPWo9bnVsbCxmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGwoYSxiKXt2YXIgYz1hLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLGQ9YS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGEuZG9jdW1lbnRFbGVtZW50O3JldHVybiBjLmlubmVySFRNTD1cIng8c3R5bGU+XCIrYitcIjwvc3R5bGU+XCIsZC5pbnNlcnRCZWZvcmUoYy5sYXN0Q2hpbGQsZC5maXJzdENoaWxkKX1mdW5jdGlvbiBtKCl7dmFyIGE9cy5lbGVtZW50cztyZXR1cm4gdHlwZW9mIGE9PVwic3RyaW5nXCI/YS5zcGxpdChcIiBcIik6YX1mdW5jdGlvbiBuKGEpe3ZhciBiPWpbYVtoXV07cmV0dXJuIGJ8fChiPXt9LGkrKyxhW2hdPWksaltpXT1iKSxifWZ1bmN0aW9uIG8oYSxjLGQpe2N8fChjPWIpO2lmKGspcmV0dXJuIGMuY3JlYXRlRWxlbWVudChhKTtkfHwoZD1uKGMpKTt2YXIgZztyZXR1cm4gZC5jYWNoZVthXT9nPWQuY2FjaGVbYV0uY2xvbmVOb2RlKCk6Zi50ZXN0KGEpP2c9KGQuY2FjaGVbYV09ZC5jcmVhdGVFbGVtKGEpKS5jbG9uZU5vZGUoKTpnPWQuY3JlYXRlRWxlbShhKSxnLmNhbkhhdmVDaGlsZHJlbiYmIWUudGVzdChhKSYmIWcudGFnVXJuP2QuZnJhZy5hcHBlbmRDaGlsZChnKTpnfWZ1bmN0aW9uIHAoYSxjKXthfHwoYT1iKTtpZihrKXJldHVybiBhLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtjPWN8fG4oYSk7dmFyIGQ9Yy5mcmFnLmNsb25lTm9kZSgpLGU9MCxmPW0oKSxnPWYubGVuZ3RoO2Zvcig7ZTxnO2UrKylkLmNyZWF0ZUVsZW1lbnQoZltlXSk7cmV0dXJuIGR9ZnVuY3Rpb24gcShhLGIpe2IuY2FjaGV8fChiLmNhY2hlPXt9LGIuY3JlYXRlRWxlbT1hLmNyZWF0ZUVsZW1lbnQsYi5jcmVhdGVGcmFnPWEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCxiLmZyYWc9Yi5jcmVhdGVGcmFnKCkpLGEuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihjKXtyZXR1cm4gcy5zaGl2TWV0aG9kcz9vKGMsYSxiKTpiLmNyZWF0ZUVsZW0oYyl9LGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrbSgpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtXSsvZyxmdW5jdGlvbihhKXtyZXR1cm4gYi5jcmVhdGVFbGVtKGEpLGIuZnJhZy5jcmVhdGVFbGVtZW50KGEpLCdjKFwiJythKydcIiknfSkrXCIpO3JldHVybiBufVwiKShzLGIuZnJhZyl9ZnVuY3Rpb24gcihhKXthfHwoYT1iKTt2YXIgYz1uKGEpO3JldHVybiBzLnNoaXZDU1MmJiFnJiYhYy5oYXNDU1MmJihjLmhhc0NTUz0hIWwoYSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGt8fHEoYSxjKSxhfXZhciBjPVwiMy43LjBcIixkPWEuaHRtbDV8fHt9LGU9L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksZj0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksZyxoPVwiX2h0bWw1c2hpdlwiLGk9MCxqPXt9LGs7KGZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImFcIik7YS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLGc9XCJoaWRkZW5cImluIGEsaz1hLmNoaWxkTm9kZXMubGVuZ3RoPT0xfHxmdW5jdGlvbigpe2IuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGE9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuIHR5cGVvZiBhLmNsb25lTm9kZT09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRWxlbWVudD09XCJ1bmRlZmluZWRcIn0oKX1jYXRjaChjKXtnPSEwLGs9ITB9fSkoKTt2YXIgcz17ZWxlbWVudHM6ZC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvXCIsdmVyc2lvbjpjLHNoaXZDU1M6ZC5zaGl2Q1NTIT09ITEsc3VwcG9ydHNVbmtub3duRWxlbWVudHM6ayxzaGl2TWV0aG9kczpkLnNoaXZNZXRob2RzIT09ITEsdHlwZTpcImRlZmF1bHRcIixzaGl2RG9jdW1lbnQ6cixjcmVhdGVFbGVtZW50Om8sY3JlYXRlRG9jdW1lbnRGcmFnbWVudDpwfTthLmh0bWw1PXMscihiKX0odGhpcyxiKSxlLl92ZXJzaW9uPWQsZS5fZG9tUHJlZml4ZXM9byxlLl9jc3NvbVByZWZpeGVzPW4sZS50ZXN0UHJvcD1mdW5jdGlvbihhKXtyZXR1cm4gRChbYV0pfSxlLnRlc3RBbGxQcm9wcz1GLGUudGVzdFN0eWxlcz13LGV9KHRoaXMsdGhpcy5kb2N1bWVudCksZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1vLmNhbGwoYSl9ZnVuY3Rpb24gZShhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX1mdW5jdGlvbiBmKCl7fWZ1bmN0aW9uIGcoYSl7cmV0dXJuIWF8fFwibG9hZGVkXCI9PWF8fFwiY29tcGxldGVcIj09YXx8XCJ1bmluaXRpYWxpemVkXCI9PWF9ZnVuY3Rpb24gaCgpe3ZhciBhPXAuc2hpZnQoKTtxPTEsYT9hLnQ/bShmdW5jdGlvbigpeyhcImNcIj09YS50P0IuaW5qZWN0Q3NzOkIuaW5qZWN0SnMpKGEucywwLGEuYSxhLngsYS5lLDEpfSwwKTooYSgpLGgoKSk6cT0wfWZ1bmN0aW9uIGkoYSxjLGQsZSxmLGksail7ZnVuY3Rpb24gayhiKXtpZighbyYmZyhsLnJlYWR5U3RhdGUpJiYodS5yPW89MSwhcSYmaCgpLGwub25sb2FkPWwub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsYikpe1wiaW1nXCIhPWEmJm0oZnVuY3Rpb24oKXt0LnJlbW92ZUNoaWxkKGwpfSw1MCk7Zm9yKHZhciBkIGluIHlbY10peVtjXS5oYXNPd25Qcm9wZXJ0eShkKSYmeVtjXVtkXS5vbmxvYWQoKX19dmFyIGo9anx8Qi5lcnJvclRpbWVvdXQsbD1iLmNyZWF0ZUVsZW1lbnQoYSksbz0wLHI9MCx1PXt0OmQsczpjLGU6ZixhOmkseDpqfTsxPT09eVtjXSYmKHI9MSx5W2NdPVtdKSxcIm9iamVjdFwiPT1hP2wuZGF0YT1jOihsLnNyYz1jLGwudHlwZT1hKSxsLndpZHRoPWwuaGVpZ2h0PVwiMFwiLGwub25lcnJvcj1sLm9ubG9hZD1sLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2suY2FsbCh0aGlzLHIpfSxwLnNwbGljZShlLDAsdSksXCJpbWdcIiE9YSYmKHJ8fDI9PT15W2NdPyh0Lmluc2VydEJlZm9yZShsLHM/bnVsbDpuKSxtKGssaikpOnlbY10ucHVzaChsKSl9ZnVuY3Rpb24gaihhLGIsYyxkLGYpe3JldHVybiBxPTAsYj1ifHxcImpcIixlKGEpP2koXCJjXCI9PWI/djp1LGEsYix0aGlzLmkrKyxjLGQsZik6KHAuc3BsaWNlKHRoaXMuaSsrLDAsYSksMT09cC5sZW5ndGgmJmgoKSksdGhpc31mdW5jdGlvbiBrKCl7dmFyIGE9QjtyZXR1cm4gYS5sb2FkZXI9e2xvYWQ6aixpOjB9LGF9dmFyIGw9Yi5kb2N1bWVudEVsZW1lbnQsbT1hLnNldFRpbWVvdXQsbj1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdLG89e30udG9TdHJpbmcscD1bXSxxPTAscj1cIk1vekFwcGVhcmFuY2VcImluIGwuc3R5bGUscz1yJiYhIWIuY3JlYXRlUmFuZ2UoKS5jb21wYXJlTm9kZSx0PXM/bDpuLnBhcmVudE5vZGUsbD1hLm9wZXJhJiZcIltvYmplY3QgT3BlcmFdXCI9PW8uY2FsbChhLm9wZXJhKSxsPSEhYi5hdHRhY2hFdmVudCYmIWwsdT1yP1wib2JqZWN0XCI6bD9cInNjcmlwdFwiOlwiaW1nXCIsdj1sP1wic2NyaXB0XCI6dSx3PUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09by5jYWxsKGEpfSx4PVtdLHk9e30sej17dGltZW91dDpmdW5jdGlvbihhLGIpe3JldHVybiBiLmxlbmd0aCYmKGEudGltZW91dD1iWzBdKSxhfX0sQSxCO0I9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhKXt2YXIgYT1hLnNwbGl0KFwiIVwiKSxiPXgubGVuZ3RoLGM9YS5wb3AoKSxkPWEubGVuZ3RoLGM9e3VybDpjLG9yaWdVcmw6YyxwcmVmaXhlczphfSxlLGYsZztmb3IoZj0wO2Y8ZDtmKyspZz1hW2ZdLnNwbGl0KFwiPVwiKSwoZT16W2cuc2hpZnQoKV0pJiYoYz1lKGMsZykpO2ZvcihmPTA7ZjxiO2YrKyljPXhbZl0oYyk7cmV0dXJuIGN9ZnVuY3Rpb24gZyhhLGUsZixnLGgpe3ZhciBpPWIoYSksaj1pLmF1dG9DYWxsYmFjaztpLnVybC5zcGxpdChcIi5cIikucG9wKCkuc3BsaXQoXCI/XCIpLnNoaWZ0KCksaS5ieXBhc3N8fChlJiYoZT1kKGUpP2U6ZVthXXx8ZVtnXXx8ZVthLnNwbGl0KFwiL1wiKS5wb3AoKS5zcGxpdChcIj9cIilbMF1dKSxpLmluc3RlYWQ/aS5pbnN0ZWFkKGEsZSxmLGcsaCk6KHlbaS51cmxdP2kubm9leGVjPSEwOnlbaS51cmxdPTEsZi5sb2FkKGkudXJsLGkuZm9yY2VDU1N8fCFpLmZvcmNlSlMmJlwiY3NzXCI9PWkudXJsLnNwbGl0KFwiLlwiKS5wb3AoKS5zcGxpdChcIj9cIikuc2hpZnQoKT9cImNcIjpjLGkubm9leGVjLGkuYXR0cnMsaS50aW1lb3V0KSwoZChlKXx8ZChqKSkmJmYubG9hZChmdW5jdGlvbigpe2soKSxlJiZlKGkub3JpZ1VybCxoLGcpLGomJmooaS5vcmlnVXJsLGgsZykseVtpLnVybF09Mn0pKSl9ZnVuY3Rpb24gaChhLGIpe2Z1bmN0aW9uIGMoYSxjKXtpZihhKXtpZihlKGEpKWN8fChqPWZ1bmN0aW9uKCl7dmFyIGE9W10uc2xpY2UuY2FsbChhcmd1bWVudHMpO2suYXBwbHkodGhpcyxhKSxsKCl9KSxnKGEsaixiLDAsaCk7ZWxzZSBpZihPYmplY3QoYSk9PT1hKWZvcihuIGluIG09ZnVuY3Rpb24oKXt2YXIgYj0wLGM7Zm9yKGMgaW4gYSlhLmhhc093blByb3BlcnR5KGMpJiZiKys7cmV0dXJuIGJ9KCksYSlhLmhhc093blByb3BlcnR5KG4pJiYoIWMmJiEtLW0mJihkKGopP2o9ZnVuY3Rpb24oKXt2YXIgYT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7ay5hcHBseSh0aGlzLGEpLGwoKX06altuXT1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYj1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7YSYmYS5hcHBseSh0aGlzLGIpLGwoKX19KGtbbl0pKSxnKGFbbl0saixiLG4saCkpfWVsc2UhYyYmbCgpfXZhciBoPSEhYS50ZXN0LGk9YS5sb2FkfHxhLmJvdGgsaj1hLmNhbGxiYWNrfHxmLGs9aixsPWEuY29tcGxldGV8fGYsbSxuO2MoaD9hLnllcDphLm5vcGUsISFpKSxpJiZjKGkpfXZhciBpLGosbD10aGlzLnllcG5vcGUubG9hZGVyO2lmKGUoYSkpZyhhLDAsbCwwKTtlbHNlIGlmKHcoYSkpZm9yKGk9MDtpPGEubGVuZ3RoO2krKylqPWFbaV0sZShqKT9nKGosMCxsLDApOncoaik/QihqKTpPYmplY3Qoaik9PT1qJiZoKGosbCk7ZWxzZSBPYmplY3QoYSk9PT1hJiZoKGEsbCl9LEIuYWRkUHJlZml4PWZ1bmN0aW9uKGEsYil7elthXT1ifSxCLmFkZEZpbHRlcj1mdW5jdGlvbihhKXt4LnB1c2goYSl9LEIuZXJyb3JUaW1lb3V0PTFlNCxudWxsPT1iLnJlYWR5U3RhdGUmJmIuYWRkRXZlbnRMaXN0ZW5lciYmKGIucmVhZHlTdGF0ZT1cImxvYWRpbmdcIixiLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsQT1mdW5jdGlvbigpe2IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixBLDApLGIucmVhZHlTdGF0ZT1cImNvbXBsZXRlXCJ9LDApKSxhLnllcG5vcGU9aygpLGEueWVwbm9wZS5leGVjdXRlU3RhY2s9aCxhLnllcG5vcGUuaW5qZWN0SnM9ZnVuY3Rpb24oYSxjLGQsZSxpLGope3ZhciBrPWIuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxsLG8sZT1lfHxCLmVycm9yVGltZW91dDtrLnNyYz1hO2ZvcihvIGluIGQpay5zZXRBdHRyaWJ1dGUobyxkW29dKTtjPWo/aDpjfHxmLGsub25yZWFkeXN0YXRlY2hhbmdlPWsub25sb2FkPWZ1bmN0aW9uKCl7IWwmJmcoay5yZWFkeVN0YXRlKSYmKGw9MSxjKCksay5vbmxvYWQ9ay5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCl9LG0oZnVuY3Rpb24oKXtsfHwobD0xLGMoMSkpfSxlKSxpP2sub25sb2FkKCk6bi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShrLG4pfSxhLnllcG5vcGUuaW5qZWN0Q3NzPWZ1bmN0aW9uKGEsYyxkLGUsZyxpKXt2YXIgZT1iLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpLGosYz1pP2g6Y3x8ZjtlLmhyZWY9YSxlLnJlbD1cInN0eWxlc2hlZXRcIixlLnR5cGU9XCJ0ZXh0L2Nzc1wiO2ZvcihqIGluIGQpZS5zZXRBdHRyaWJ1dGUoaixkW2pdKTtnfHwobi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLG4pLG0oYywwKSl9fSh0aGlzLGRvY3VtZW50KSxNb2Rlcm5penIubG9hZD1mdW5jdGlvbigpe3llcG5vcGUuYXBwbHkod2luZG93LFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApKX0sTW9kZXJuaXpyLnRlc3RTdHlsZXMoXCIjbW9kZXJuaXpye2JhY2tncm91bmQtc2l6ZTpjb3Zlcn1cIixmdW5jdGlvbihhKXt2YXIgYj13aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZT93aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpOmEuY3VycmVudFN0eWxlO01vZGVybml6ci5hZGRUZXN0KFwiYmdzaXplY292ZXJcIixiLmJhY2tncm91bmRTaXplPT1cImNvdmVyXCIpfSksTW9kZXJuaXpyLmFkZFRlc3QoXCJjc3N2aHVuaXRcIixmdW5jdGlvbigpe3ZhciBhO3JldHVybiBNb2Rlcm5penIudGVzdFN0eWxlcyhcIiNtb2Rlcm5penIgeyBoZWlnaHQ6IDUwdmg7IH1cIixmdW5jdGlvbihiLGMpe3ZhciBkPXBhcnNlSW50KHdpbmRvdy5pbm5lckhlaWdodC8yLDEwKSxlPXBhcnNlSW50KCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZT9nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCk6Yi5jdXJyZW50U3R5bGUpLmhlaWdodCwxMCk7YT1lPT1kfSksYX0pLE1vZGVybml6ci5hZGRUZXN0KFwiY3Nzdnd1bml0XCIsZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gTW9kZXJuaXpyLnRlc3RTdHlsZXMoXCIjbW9kZXJuaXpyIHsgd2lkdGg6IDUwdnc7IH1cIixmdW5jdGlvbihiLGMpe3ZhciBkPXBhcnNlSW50KHdpbmRvdy5pbm5lcldpZHRoLzIsMTApLGU9cGFyc2VJbnQoKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlP2dldENvbXB1dGVkU3R5bGUoYixudWxsKTpiLmN1cnJlbnRTdHlsZSkud2lkdGgsMTApO2E9ZT09ZH0pLGF9KTsiLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHRoaXMuUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHRoaXMucS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgdGhpcy5jYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgaiA9IHRoaXMucS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xW2ldLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgIHJlc2l6ZWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnQsIHJlc2l6ZWQpIHtcbiAgICAgICAgICAgIGlmICghZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCA9IG5ldyBFdmVudFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAncmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBzY3JvbGw7IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyc7XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJ1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInJlc2l6ZS1zZW5zb3Itc2hyaW5rXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnIHdpZHRoOiAyMDAlOyBoZWlnaHQ6IDIwMCVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudC5yZXNpemVTZW5zb3IpO1xuXG4gICAgICAgICAgICBpZiAoIXtmaXhlZDogMSwgYWJzb2x1dGU6IDF9W2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJyldKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmtDaGlsZCA9IHNocmluay5jaGlsZE5vZGVzWzBdO1xuXG4gICAgICAgICAgICB2YXIgbGFzdFdpZHRoLCBsYXN0SGVpZ2h0O1xuXG4gICAgICAgICAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9IGV4cGFuZC5vZmZzZXRXaWR0aCArIDEwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSBleHBhbmQub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxMZWZ0ID0gZXhwYW5kLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxUb3AgPSBleHBhbmQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxMZWZ0ID0gc2hyaW5rLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxUb3AgPSBzaHJpbmsuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxhc3RXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbGFzdEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzZXQoKTtcblxuICAgICAgICAgICAgdmFyIGNoYW5nZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGFkZEV2ZW50KGV4cGFuZCwgJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWRkRXZlbnQoc2hyaW5rLCAnc2Nyb2xsJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA8IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA8IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudClcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50W2ldLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUmVzaXplU2Vuc29yLmRldGFjaChlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdGhpcy5SZXNpemVTZW5zb3IuZGV0YWNoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5yZXNpemVTZW5zb3IpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5yZXNpemVTZW5zb3IpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQucmVzaXplU2Vuc29yO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkO1xuICAgICAgICB9XG4gICAgfTtcblxufSkoKTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuSEVBREVSIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0ICovXHJcblxyXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXHJcblx0XHR0b3BOYXZCYXIgPSAkKCcjdG9wLW5hdicpLFxyXG5cdFx0bWVkaWFXcmFwID0gJCgnLmhlYWQtbWVkaWEnKTtcclxuXHJcblx0Ly8gSGVhZCBNZWRpYSBGdW5jdGlvbnNcclxuXHRmdW5jdGlvbiBoZWFkZXJGbigpIHtcclxuXHRcdHZhciBjb250YWluZXIgICAgPSBtZWRpYVdyYXAuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdFx0bWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXHJcblx0XHRcdHRvcE5hdkhlaWdodCA9IHRvcE5hdkJhci5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXHJcblx0XHRcdGhtSGVpZ2h0ICAgICA9IDA7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcclxuXHRcdFx0bWVkaWFXcmFwLmNzcygnaGVpZ2h0Jywgd3JhcEhlaWdodCk7XHJcblx0XHRcdFxyXG5cdFx0XHRobUhlaWdodCA9IHZpZXdwb3J0LmhlaWdodCgpIC0gbWVkaWFXcmFwLm9mZnNldCgpLnRvcDtcclxuXHJcblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgJiYgISBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgKSB7IGhtSGVpZ2h0IC09IHRvcE5hdkhlaWdodDsgfVxyXG5cclxuXHRcdFx0bWVkaWFXcmFwLmNzcygnaGVpZ2h0JywgaG1IZWlnaHQpO1xyXG5cdFx0XHRtZWRpYUNvbnQuY3NzKCdoZWlnaHQnLCBobUhlaWdodCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWVkaWFDb250Lmxlbmd0aCA9PSAxICkge1xyXG5cdFx0XHR2YXIgY29udGFpbmVyUGFkID0gdG9wTmF2SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHRjb250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScsIGNvbnRhaW5lclBhZCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29udGFpbmVyLmNzcygncGFkZGluZy10b3AnLCBjb250YWluZXJQYWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBIZWFkZXIgRmFkZSBFZmZlY3RcclxuXHRmdW5jdGlvbiBoZWFkZXJGYWRlKCkge1xyXG5cdFx0dmFyIGNvbnRlbnQgPSAkKCcuY29udGFpbmVyJywgbWVkaWFXcmFwKSxcclxuXHRcdFx0Y29udEggICA9IGNvbnRlbnQuaW5uZXJIZWlnaHQoKSxcclxuXHRcdFx0c2Nyb2xsRSA9ICQudGhyb3R0bGUoIDEwMCwgc2Nyb2xsSGFuZGxlciApO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHNjcm9sbEhhbmRsZXIoKSB7XHJcblx0XHRcdHZhciBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuXHRcdFx0aWYgKCBzY3JvbGxUb3AgPiBjb250SCApIHtcclxuXHRcdFx0XHRjb250ZW50LmNzcyh7XHJcblx0XHRcdFx0XHQnb3BhY2l0eSc6IDAsXHJcblx0XHRcdFx0XHQnLXdlYmtpdC10cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwwcHgpJyxcclxuXHRcdFx0XHQgICAgJy1tcy10cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwwcHgpJyxcclxuXHRcdFx0XHQgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoMHB4LDBweCknXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHRyYW5zbGF0ZSA9ICd0cmFuc2xhdGUoMHB4LCAnICsgKCBzY3JvbGxUb3AgLyAzICkgKyAncHgpJztcclxuXHRcdFx0XHRjb250ZW50LmNzcyh7XHJcblx0XHRcdFx0XHQnb3BhY2l0eSc6IDEgLSBzY3JvbGxUb3AgLyAoY29udEggLyAxLjIpLFxyXG5cdFx0XHRcdFx0Jy13ZWJraXQtdHJhbnNmb3JtJzogdHJhbnNsYXRlLFxyXG5cdFx0XHRcdCAgICAnLW1zLXRyYW5zZm9ybSc6IHRyYW5zbGF0ZSxcclxuXHRcdFx0XHQgICAgJ3RyYW5zZm9ybSc6IHRyYW5zbGF0ZVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBzY3JvbGxFKTtcclxuXHR9XHJcblx0aWYgKCBtaXh0X29wdC5oZWFkZXJbJ2NvbnRlbnQtZmFkZSddICkgeyBoZWFkZXJGYWRlKCk7IH1cclxuXHJcblxyXG5cdC8vIEhlYWRlciBTY3JvbGwgVG8gQ29udGVudFxyXG5cdGZ1bmN0aW9uIGhlYWRlclNjcm9sbCgpIHtcclxuXHRcdHZhciBwYWdlICAgPSAkKCdodG1sLCBib2R5JyksXHJcblx0XHRcdG9mZnNldCA9ICQoJyNjb250ZW50LXdyYXAnKS5vZmZzZXQoKS50b3A7XHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7IG9mZnNldCAtPSB0b3BOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKS5oZWlnaHQoKTsgfVxyXG5cdFx0JCgnLmhlYWRlci1zY3JvbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0cGFnZS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSwgODAwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCApIHtcclxuXHRcdGhlYWRlckZuKCk7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuc2Nyb2xsICkgeyBoZWFkZXJTY3JvbGwoKTsgfVxyXG5cdFx0XHJcblx0XHQkKHdpbmRvdykucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGhlYWRlckZuICkpO1xyXG5cdH1cclxuXHJcbn0oalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5NSVhUIElOVEVHUkFUSU9OIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBTa2lwIExpbmsgRm9jdXMgRml4XG5cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc193ZWJraXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ3dlYmtpdCcgKSA+IC0xLFxuXHRcdGlzX29wZXJhICA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICkgID4gLTEsXG5cdFx0aXNfaWUgICAgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApICAgPiAtMTtcblxuXHRpZiAoICggaXNfd2Via2l0IHx8IGlzX29wZXJhIHx8IGlzX2llICkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKSApIHtcblx0XHR2YXIgZXZlbnRNZXRob2QgPSAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnO1xuXHRcdHdpbmRvd1sgZXZlbnRNZXRob2QgXSggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICkgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KSgpO1xuXG4vLyBSdW4gT24gUGFnZSBMb2FkXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Ly8gQWRkIEJvb3RzdHJhcCBDbGFzc2VzXG5cblx0JCgnaW5wdXQuc2VhcmNoLWZpZWxkJykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xuXHQkKCdpbnB1dC5zZWFyY2gtc3VibWl0JykuYWRkQ2xhc3MoJ2J0biBidG4tZGVmYXVsdCcpO1xuXG5cdCQoJy53aWRnZXRfcnNzIHVsJykuYWRkQ2xhc3MoJ21lZGlhLWxpc3QnKTtcblxuXHQkKCcud2lkZ2V0X21ldGEgdWwsIC53aWRnZXRfcmVjZW50X2VudHJpZXMgdWwsIC53aWRnZXRfYXJjaGl2ZSB1bCwgLndpZGdldF9jYXRlZ29yaWVzIHVsLCAud2lkZ2V0X25hdl9tZW51IHVsLCAud2lkZ2V0X3BhZ2VzIHVsJykuYWRkQ2xhc3MoJ25hdicpO1xuXG5cdCQoJy53aWRnZXRfcmVjZW50X2NvbW1lbnRzIHVsI3JlY2VudGNvbW1lbnRzJykuY3NzKCdsaXN0LXN0eWxlJywgJ25vbmUnKS5jc3MoJ3BhZGRpbmctbGVmdCcsICcwJyk7XG5cdCQoJy53aWRnZXRfcmVjZW50X2NvbW1lbnRzIHVsI3JlY2VudGNvbW1lbnRzIGxpJykuY3NzKCdwYWRkaW5nJywgJzVweCAxNXB4Jyk7XG5cblx0JCgndGFibGUjd3AtY2FsZW5kYXInKS5hZGRDbGFzcygndGFibGUgdGFibGUtc3RyaXBlZCcpO1xuXG5cdC8vIEhhbmRsZSBQb3N0IENvdW50XG5cblx0JCgnLndpZGdldF9hcmNoaXZlIGxpLCAud2lkZ2V0X2NhdGVnb3JpZXMgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcblx0XHRcdGNoaWxkcmVuICA9ICR0aGlzLmNoaWxkcmVuKCksXG5cdFx0XHRhbmNob3IgICAgPSBjaGlsZHJlbi5maWx0ZXIoJ2EnKSxcblx0XHRcdGNvbnRlbnRzICA9ICR0aGlzLmNvbnRlbnRzKCksXG5cdFx0XHRjb3VudFRleHQgPSBjb250ZW50cy5ub3QoY2hpbGRyZW4pLnRleHQoKTtcblxuXHRcdGlmICggY291bnRUZXh0ICE9PSAnJyApIHtcblx0XHRcdGFuY2hvci5hcHBlbmQoJzxzcGFuIGNsYXNzPVwicG9zdC1jb3VudFwiPicgKyBjb3VudFRleHQgKyAnPC9zcGFuPicpO1xuXHRcdFx0Y29udGVudHMuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDM7IFxuXHRcdFx0fSkucmVtb3ZlKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBHYWxsZXJ5IEFycm93IE5hdmlnYXRpb25cblxuXHQkKCBkb2N1bWVudCApLmtleWRvd24oIGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdXJsID0gZmFsc2U7XG5cdFx0aWYgKCBlLndoaWNoID09PSAzNyApIHsgIC8vIExlZnQgYXJyb3cga2V5IGNvZGVcblx0XHRcdHVybCA9ICQoJy5wcmV2aW91cy1pbWFnZSBhJykuYXR0cignaHJlZicpO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS53aGljaCA9PT0gMzkgKSB7ICAvLyBSaWdodCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLmVudHJ5LWF0dGFjaG1lbnQgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9XG5cdFx0aWYgKCB1cmwgJiYgKCAhJCgndGV4dGFyZWEsIGlucHV0JykuaXMoJzpmb2N1cycpICkgKSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmw7XG5cdFx0fVxuXHR9KTtcblxufSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbk5BVkJBUiBGVU5DVElPTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgY29sb3JMb0QgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ICAgID0gJCh3aW5kb3cpLFxyXG5cdFx0Ym9keUVsICAgICAgPSAkKCdib2R5JyksXHJcblx0XHRtYWluV3JhcCAgICA9ICQoJyNtYWluLXdyYXAnKSxcclxuXHRcdHRvcE5hdkJhciAgID0gJCgnI3RvcC1uYXYnKSxcclxuXHRcdHRvcE5hdldyYXAgID0gJCgnI3RvcC1uYXYtd3JhcCcpLFxyXG5cdFx0dG9wTmF2SGVhZCAgPSAkKCcubmF2YmFyLWhlYWRlcicsIHRvcE5hdkJhciksXHJcblx0XHR0b3BOYXZJbm5lciA9ICQoJy5uYXZiYXItaW5uZXInLCB0b3BOYXZCYXIpLFxyXG5cdFx0c2VjTmF2QmFyICAgPSAkKCcjc2Vjb25kLW5hdicpLFxyXG5cdFx0bmF2YmFycyAgICAgPSAkKCcubmF2YmFyJyksXHJcblx0XHRtZWRpYVdyYXAgICA9ICQoJy5oZWFkLW1lZGlhJyk7XHJcblxyXG5cdHZhciBuYXZiYXJPYmogPSB7XHJcblxyXG5cdFx0bmF2Qmc6ICcnLFxyXG5cdFx0bmF2QmdUb3A6ICcnLFxyXG5cclxuXHRcdC8vIFNldCBCYWNrZ3JvdW5kIENvbG9yIENsYXNzXHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24obmF2YmFyKSB7XHJcblxyXG5cdFx0XHR2YXIgYmdDb2xvciAgPSBuYXZiYXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyksXHJcblx0XHRcdFx0Y29sb3JMdW0gPSBjb2xvckxvRChiZ0NvbG9yKTtcclxuXHJcblx0XHRcdGlmICggY29sb3JMdW0gPT0gJ2RhcmsnICkgeyBuYXZiYXIuYWRkQ2xhc3MoJ2JnLWRhcmsnKTsgfVxyXG5cdFx0XHRpZiAoIG5hdmJhci5pcyh0b3BOYXZCYXIpICkge1xyXG5cdFx0XHRcdG5hdmJhck9iai5uYXZCZyA9ICggY29sb3JMdW0gPT0gJ2RhcmsnICkgPyAnYmctZGFyaycgOiAnJztcclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCAmJiBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPD0gMC40ICkge1xyXG5cdFx0XHRcdFx0bmF2YmFyT2JqLm5hdkJnVG9wID0gbWVkaWFXcmFwLmhhc0NsYXNzKCdiZy1kYXJrJykgPyAnYmctZGFyaycgOiAnJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bmF2YmFyT2JqLm5hdkJnVG9wID0gbmF2YmFyT2JqLm5hdkJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdzdGF0aWMnICkge1xyXG5cdFx0XHRcdFx0dG9wTmF2QmFyLnJlbW92ZUNsYXNzKG5hdmJhck9iai5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgbmF2YmFyT2JqLm5hdkJnVG9wKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uXHJcblxyXG5cdFx0c3RpY2t5TmF2OiBmdW5jdGlvbihpc01vYmlsZSkge1xyXG5cclxuXHRcdFx0dmFyIG5hdlNjcm9sbEhhbmRsZXIgPSAkLnRocm90dGxlKCA1MCwgc3RpY2t5TmF2VG9nZ2xlICksXHJcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiA9IDAsXHJcblx0XHRcdFx0dG9wTmF2SGVpZ2h0ICAgICA9IDAsXHJcblx0XHRcdFx0dG9wTmF2UG9zICAgICAgICA9IDAsXHJcblx0XHRcdFx0dG9wTmF2TWcgICAgICAgICA9IDA7XHJcblxyXG5cdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSApIHsgdmlld3BvcnQub24oJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XHJcblx0XHRcdGVsc2UgeyB2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XHJcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiArPSBwYXJzZUZsb2F0KG1haW5XcmFwLmNzcygncGFkZGluZy10b3AnKSwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHR0b3BOYXZIZWlnaHQgPSB0b3BOYXZCYXIuY3NzKCdoZWlnaHQnLCAnJykub3V0ZXJIZWlnaHQoKTtcclxuXHRcdFx0XHR0b3BOYXZQb3MgICAgPSBwYXJzZUludCh0b3BOYXZCYXIuY3NzKCd0b3AnKSwgMTApO1xyXG5cdFx0XHRcdHRvcE5hdk1nICAgICA9IHRvcE5hdkhlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKCB0b3BOYXZQb3MgPT09IDAgfHwgaXNOYU4odG9wTmF2UG9zKSApIHtcclxuXHRcdFx0XHRcdHRvcE5hdkJhci5jc3MoJ21hcmdpbi10b3AnLCAodG9wTmF2SGVpZ2h0ICogLTEpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHN0aWNreU5hdlRvZ2dsZSgpIHtcclxuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gdG9wTmF2V3JhcC5vZmZzZXQoKS50b3AgLSB0b3BOYXZNZyxcclxuXHRcdFx0XHRcdHNjcm9sbFZhbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gbmF2YmFyT2JqLm5hdkJnVG9wO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxWYWwgPSBpc01vYmlsZSA9PT0gdHJ1ZSA/IDAgOiBzY3JvbGxWYWwgKz0gc2Nyb2xsQ29ycmVjdGlvbjtcclxuXHJcblx0XHRcdFx0aWYgKCB0b3BOYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cclxuXHRcdFx0XHRpZiAoIHRvcE5hdkJhci5oYXNDbGFzcygnc2xpZGUtYmctbGlnaHQnKSApIHsgYmdUb3BDbHMgPSAnJzsgfVxyXG5cclxuXHRcdFx0XHRpZiAoIHNjcm9sbFZhbCA+IG5hdlBvcyApIHsgIFxyXG5cdFx0XHRcdFx0Ym9keUVsLmFkZENsYXNzKCdmaXhlZC1uYXYnKTtcclxuXHRcdFx0XHRcdHRvcE5hdkJhci5yZW1vdmVDbGFzcygncG9zaXRpb24tdG9wICcgKyBiZ1RvcENscykuYWRkQ2xhc3MobmF2YmFyT2JqLm5hdkJnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcclxuXHRcdFx0XHRcdHRvcE5hdkJhci5yZW1vdmVDbGFzcyhuYXZiYXJPYmoubmF2QmcpLmFkZENsYXNzKCdwb3NpdGlvbi10b3AgJyArIGJnVG9wQ2xzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0aWNreU5hdlRvZ2dsZSgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBQcmV2ZW50IE5hdmJhciBTdWJtZW51IE92ZXJmbG93IE91dCBPZiBWaWV3cG9ydFxyXG5cclxuXHRcdG1lbnVPdmVyZmxvdzogZnVuY3Rpb24obmF2YmFyKSB7XHJcblxyXG5cdFx0XHR2YXIgbmF2YmFyT2ZmID0gMCxcclxuXHRcdFx0XHRtYWluU3ViID0gbmF2YmFyLmZpbmQoJy5kcm9wLW1lbnUgLmRyb3Bkb3duLW1lbnUsIC5tZWdhLW1lbnUtY29sdW1uID4gLnN1Yi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IGEnKTtcclxuXHJcblx0XHRcdGlmICggbmF2YmFyLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdFx0bmF2YmFyT2ZmID0gbmF2YmFyLm91dGVyV2lkdGgoKSArIHBhcnNlSW50KG5hdmJhci5vZmZzZXQoKS5sZWZ0LCAxMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNldCBNZW51IERyb3AgTGVmdFxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc2V0RHJvcExlZnQodGFyZ2V0KSB7XHJcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wLWxlZnQnKTtcclxuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcclxuXHRcdFx0XHRcdHRhcmdldC5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBSZXNldCBNZW51IERyb3BcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHJlc2V0QXJyb3codGFyZ2V0KSB7XHJcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQnKTtcclxuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcclxuXHRcdFx0XHRcdHRhcmdldC5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gUmVzZXQgTW9iaWxlIEFkanVzdG1lbnRzXHJcblxyXG5cdFx0XHR0b3BOYXZCYXIuY3NzKHsgJ3Bvc2l0aW9uJzogJycsICd0b3AnOiAnJyB9KS5yZW1vdmVDbGFzcygnc3RvcHBlZCcpO1xyXG5cclxuXHRcdFx0Ly8gUGVyZm9ybSBtZW51IG92ZXJmbG93IGNoZWNrc1xyXG5cclxuXHRcdFx0bWFpblN1Yi5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc3ViICAgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0dG9wU3ViICAgPSBzdWIsXHJcblx0XHRcdFx0XHRzdWJQYXIgICA9IHN1Yi5wYXJlbnQoKSxcclxuXHRcdFx0XHRcdHN1YlBvcyAgID0gcGFyc2VJbnQoc3ViLm9mZnNldCgpLmxlZnQsIDEwKSxcclxuXHRcdFx0XHRcdHN1YlcgICAgID0gc3ViLm91dGVyV2lkdGgoKSArIDEsXHJcblx0XHRcdFx0XHRuZXN0T2ZmICA9IHN1YlBvcyArIHN1YlcsXHJcblx0XHRcdFx0XHRuZXN0U3VicyA9IHN1Yi5jaGlsZHJlbignLmRyb3Atc3VibWVudScpLFxyXG5cdFx0XHRcdFx0b3ZlcmZsb3dpbmdTdWJzID0gbmVzdFN1YnMsXHJcblx0XHRcdFx0XHRjb3JyZWN0aW9uO1xyXG5cclxuXHRcdFx0XHRpZiAoIHN1YlBhci5pcygnLm1lZ2EtbWVudS1jb2x1bW4nKSApIHtcclxuXHRcdFx0XHRcdHRvcFN1YiA9IHN1YlBhci5wYXJlbnRzKCcuZHJvcGRvd24tbWVudScpO1xyXG5cdFx0XHRcdFx0b3ZlcmZsb3dpbmdTdWJzID0gdG9wU3ViLmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uOm50aC1jaGlsZCg0bikgLmRyb3Atc3VibWVudSwgLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKG4tNCk6bGFzdC1jaGlsZCAuZHJvcC1zdWJtZW51Jyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBUb3AgTGV2ZWwgU3VibWVudXNcclxuXHJcblx0XHRcdFx0aWYgKCBuZXN0T2ZmID4gbmF2YmFyT2ZmICkge1xyXG5cdFx0XHRcdFx0dmFyIG1nTm93ID0gcGFyc2VJbnQodG9wU3ViLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApO1xyXG5cdFx0XHRcdFx0Y29ycmVjdGlvbiA9IChuZXN0T2ZmIC0gbmF2YmFyT2ZmIC0gMikgKiAtMTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG5hdmJhci5oYXNDbGFzcygnYm9yZGVyZWQnKSB8fCBuYXZiYXIucGFyZW50cygnLm5hdmJhcicpLmhhc0NsYXNzKCdib3JkZXJlZCcpICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIGNvcnJlY3Rpb24gPCBtZ05vdyApIHtcclxuXHRcdFx0XHRcdFx0dG9wU3ViLmNzcygnbWFyZ2luLWxlZnQnLCBjb3JyZWN0aW9uICsgJ3B4Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZXREcm9wTGVmdChvdmVyZmxvd2luZ1N1YnMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXHJcblxyXG5cdFx0XHRcdG5lc3RTdWJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIHN1Yk5vdyAgICA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdG5lc3RTdWJzVyA9IFtdO1xyXG5cdFx0XHRcdFx0c3ViTm93LmZpbmQoJy5zdWItbWVudTpub3QoOmhhcyguZHJvcC1zdWJtZW51KSknKS5tYXAoIGZ1bmN0aW9uKGkpIHtcclxuXHRcdFx0XHRcdFx0dmFyICR0aGlzICAgID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRzICA9ICR0aGlzLnBhcmVudHMoJy5zdWItbWVudScpLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudHNXID0gMDtcclxuXHJcblx0XHRcdFx0XHRcdHBhcmVudHMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXICs9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRuZXN0U3Vic1dbaV0gPSAkdGhpcy5vdXRlcldpZHRoKCkgKyBwYXJlbnRzVztcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHZhciBtYXhOZXN0VyA9ICQuaXNFbXB0eU9iamVjdChuZXN0U3Vic1cpID8gMCA6IE1hdGgubWF4LmFwcGx5KG51bGwsIG5lc3RTdWJzVyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCAobmVzdE9mZiArIG1heE5lc3RXKSA+PSBib2R5RWwud2lkdGgoKSApIHtcclxuXHRcdFx0XHRcdFx0c2V0RHJvcExlZnQoc3ViTm93KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc2V0QXJyb3coc3ViTm93KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTWVnYSBNZW51IEVuYWJsZSAvIERpc2FibGVcclxuXHJcblx0XHRtZWdhTWVudVRvZ2dsZTogZnVuY3Rpb24odG9nZ2xlLCBuYXZiYXIpIHtcclxuXHRcdFx0dmFyIG1lZ2FNZW51cztcclxuXHJcblx0XHRcdGlmICggdG9nZ2xlID09ICdlbmFibGUnICkge1xyXG5cdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51W2RhdGEtbWVnYS1tZW51PVwidHJ1ZVwiXScpO1xyXG5cdFx0XHRcdG1lZ2FNZW51cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBtZWdhTWVudSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0bWVnYU1lbnUuYWRkQ2xhc3MoJ21lZ2EtbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLW1lbnUnKS5yZW1vdmVBdHRyKCdkYXRhLW1lZ2EtbWVudScpO1xyXG5cdFx0XHRcdFx0JCgnPiAuc3ViLW1lbnUgPiAuZHJvcC1zdWJtZW51JywgbWVnYU1lbnUpLnJlbW92ZUNsYXNzKCdkcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdG1lZ2FNZW51cy5jaGlsZHJlbigndWwnKS5jc3MoJ21hcmdpbi1sZWZ0JywgJycpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCB0b2dnbGUgPT0gJ2Rpc2FibGUnICkge1xyXG5cdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcubWVnYS1tZW51Jyk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0XHRtZWdhTWVudS5yZW1vdmVDbGFzcygnbWVnYS1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbWVudScpLmF0dHIoJ2RhdGEtbWVnYS1tZW51JywgJ3RydWUnKTtcclxuXHRcdFx0XHRcdG1lZ2FNZW51LmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uJykucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKS5hZGRDbGFzcygnZHJvcC1zdWJtZW51Jyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gQ3JlYXRlIE1lZ2EgTWVudSBSb3dzIElmIFRoZXJlIEFyZSBNb3JlIFRoYW4gNCBDb2x1bW5zXHJcblxyXG5cdFx0bWVnYU1lbnVSb3dzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0bWFpbldyYXAuZmluZCgnLm1lZ2EtbWVudScpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBtYWluTWVudSA9ICQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLFxyXG5cdFx0XHRcdFx0Y29sdW1ucyAgPSBtYWluTWVudS5jaGlsZHJlbignLm1lZ2EtbWVudS1jb2x1bW4nKTtcclxuXHJcblx0XHRcdFx0aWYgKCBjb2x1bW5zLmxlbmd0aCA+IDQgKSBtYWluTWVudS5hZGRDbGFzcygnbXVsdGktcm93Jyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBNb2JpbGUgRnVuY3Rpb25zXHJcblxyXG5cdFx0bmF2TW9iaWxlOiBmdW5jdGlvbihtcU5hdikge1xyXG5cclxuXHRcdFx0Ly8gRW5hYmxlIE5hdiBTY3JvbGxpbmcgSWYgTmF2YmFyIEhlaWdodCA+IFZpZXdwb3J0XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBuYXZTY3JvbGwoKSB7XHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmIG1xTmF2ID09IDIgKSB7XHJcblx0XHRcdFx0XHR2YXIgdmlld3BvcnRIICAgICA9IHZpZXdwb3J0LmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydFMgICAgID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRcdG5hdmJhckhlYWRlckggPSB0b3BOYXZIZWFkLmhlaWdodCgpICsgMSxcclxuXHRcdFx0XHRcdFx0bmF2YmFySW5uZXJIICA9IHRvcE5hdklubmVyLmhhc0NsYXNzKCdpbicpID8gdG9wTmF2SW5uZXIuaGVpZ2h0KCkgOiAwLFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJIICAgICAgID0gbmF2YmFySGVhZGVySCArIG5hdmJhcklubmVySCxcclxuXHRcdFx0XHRcdFx0bmF2YmFyTWcgICAgICA9IDAsXHJcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgICAgPSB0b3BOYXZCYXIub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gdG9wTmF2V3JhcC5vZmZzZXQoKS50b3AsXHJcblxyXG5cdFx0XHRcdFx0XHRzY3JvbGxIYW5kbGVyID0gJC50aHJvdHRsZSggNTAsIG5hdlN0b3BTY3JvbGwgKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XHJcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydEggIC09IGFkbWluQmFySDtcclxuXHRcdFx0XHRcdFx0bmF2d3JhcFRvcCAtPSBhZG1pbkJhckg7XHJcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xyXG5cdFx0XHRcdFx0XHRuYXZiYXJNZyA9IG5hdmJhckhlYWRlckggKiAtMTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG5hdmJhckggPiB2aWV3cG9ydEggKSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyKTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0b3BOYXZCYXIubm90KCdzdG9wcGVkJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0dG9wTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSwgJ21hcmdpbi10b3AnOiAnMCcgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcik7XHJcblx0XHRcdFx0XHRcdHRvcE5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnLCAnbWFyZ2luLXRvcCc6IG5hdmJhck1nIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBuYXZTdG9wU2Nyb2xsKCkge1xyXG5cdFx0XHRcdFx0dmFyIHZpZXdTY3JvbGwgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRcdFx0c3RvcFNjcm9sbCA9IHRvcE5hdkJhci5oYXNDbGFzcygnc3RvcHBlZCcpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0aWYgKCB2aWV3cG9ydFMgPiB0b3BOYXZIZWFkLm9mZnNldCgpLnRvcCApIHsgc3RvcFNjcm9sbCA9IGZhbHNlOyB9XHJcblx0XHRcdFx0XHRpZiAoIHZpZXdwb3J0UyA+IHZpZXdTY3JvbGwgJiYgc3RvcFNjcm9sbCApIHsgdmlld3BvcnQuc2Nyb2xsVG9wKHZpZXdwb3J0Uyk7IH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNob3cvaGlkZSBTdWJtZW51cyBPbiBIYW5kbGUgQ2xpY2tcclxuXHJcblx0XHRcdCQoJy5kcm9wZG93bi10b2dnbGUnLCB0b3BOYXZCYXIpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoICQoZXZlbnQudGFyZ2V0KS5pcygnLmRyb3AtYXJyb3cnKSApIHtcclxuXHRcdFx0XHRcdGlmKCBldmVudC5oYW5kbGVkICE9PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgaGFuZGxlID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0XHRtZW51ICAgPSBoYW5kbGUuY2xvc2VzdCgnLm1lbnUtaXRlbScpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCBtZW51Lmhhc0NsYXNzKCdleHBhbmQnKSApIHtcclxuXHRcdFx0XHRcdFx0XHRtZW51LnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWVudSkucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG1lbnUuYWRkQ2xhc3MoJ2V4cGFuZCcpLnNpYmxpbmdzKCdsaScpLnJlbW92ZUNsYXNzKCdleHBhbmQnKS5maW5kKCcuZXhwYW5kJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRuYXZTY3JvbGwoKTtcclxuXHJcblx0XHRcdFx0XHRcdGV2ZW50LmhhbmRsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dG9wTmF2SW5uZXIub24oJ3Nob3duLmJzLmNvbGxhcHNlIGhpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCB0b3BOYXZCYXIpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRuYXZTY3JvbGwoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRuYXZTY3JvbGwoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBSVU4gTkFWQkFSIEZVTkNUSU9OU1xyXG5cclxuXHQvLyBDaGVjayB3aGljaCBtZWRpYSBxdWVyaWVzIGFyZSBhY3RpdmVcclxuXHR2YXIgbXFDaGVjayA9IGZ1bmN0aW9uKCBlbGVtICkge1xyXG5cdFx0ZWxlbSA9ICQoJyMnICsgZWxlbSk7XHJcblx0XHR2YXIgZGlzcGxheSA9IGVsZW0uY3NzKCdkaXNwbGF5Jyk7XHJcblxyXG5cdFx0aWYgKCBkaXNwbGF5ID09ICdibG9jaycgKSB7IHJldHVybiAxOyB9XHJcblx0XHRlbHNlIGlmICggZGlzcGxheSA9PSAnaW5saW5lJykgeyByZXR1cm4gMjsgfVxyXG5cdFx0ZWxzZSB7IHJldHVybiAwOyB9XHJcblx0fTtcclxuXHJcblx0Ly8gSGFuZGxlIG5hdmJhciBpdGVtcyBvdmVybGFwcGluZ1xyXG5cdHZhciB0b3BOYXZDb250ICAgID0gdG9wTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXHJcblx0XHR0b3BOYXZMb2dvQ2xzID0gdG9wTmF2V3JhcC5hdHRyKCdkYXRhLWxvZ28tYWxpZ24nKSxcclxuXHRcdHRvcE5hdkl0ZW1zV2lkdGggPSAwLFxyXG5cclxuXHRcdHNlY05hdkNvbnQgPSBzZWNOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdHNlY05hdkl0ZW1zV2lkdGggPSAwO1xyXG5cclxuXHRpZiAoIHRvcE5hdkxvZ29DbHMgIT0gJ2xvZ28tY2VudGVyJyApIHtcclxuXHRcdHRvcE5hdkl0ZW1zV2lkdGggPSB0b3BOYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcclxuXHR9XHJcblx0aWYgKCBzZWNOYXZCYXIubGVuZ3RoICkge1xyXG5cdFx0c2VjTmF2SXRlbXNXaWR0aCA9ICQoJy5sZWZ0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpO1xyXG5cdH1cclxuXHJcblx0Ly8gRW5hYmxlIE1lbnUgSG92ZXIgT24gVG91Y2ggU2NyZWVuc1xyXG5cdHZhciBtZW51UGFyZW50cyA9IG5hdmJhcnMuZmluZCgnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIGxpLmRyb3Bkb3duJyk7XHJcblx0ZnVuY3Rpb24gbWVudVRvdWNoSG92ZXIoZXZlbnQpIHtcclxuXHRcdHZhciBsaW5rID0gJChldmVudC5kZWxlZ2F0ZVRhcmdldCksXHJcblx0XHRcdGFuY2VzdG9ycyA9IGxpbmsucGFyZW50cygnLmhvdmVyJyk7XHJcblx0XHRpZiAobGluay5oYXNDbGFzcygnaG92ZXInKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxpbmsuYWRkQ2xhc3MoJ2hvdmVyJyk7XHJcblx0XHRcdG1lbnVQYXJlbnRzLm5vdChsaW5rKS5ub3QoYW5jZXN0b3JzKS5yZW1vdmVDbGFzcygnaG92ZXInKTtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBtZW51VG91Y2hSZW1vdmVIb3ZlcihldmVudCkge1xyXG5cdFx0aWYgKCAhICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLmlzKG1lbnVQYXJlbnRzKSApIHsgbWVudVBhcmVudHMucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7IH1cclxuXHR9XHJcblxyXG5cdC8vIEZ1bmN0aW9ucyBSdW4gT24gTG9hZCAmIFdpbmRvdyBSZXNpemVcclxuXHRmdW5jdGlvbiBuYXZiYXJGbigpIHtcclxuXHJcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCduYXZiYXItY2hlY2snKTsgLy8gRXF1YWxzIFwiMFwiIGZvciBkZXNrdG9wLCBcIjFcIiBmb3IgbW9iaWxlIGFuZCBcIjJcIiBmb3IgdGFibGV0c1xyXG5cclxuXHRcdC8vIFJ1biBmdW5jdGlvbiB0byBwcmV2ZW50IHN1Ym1lbnVzIGdvaW5nIG91dHNpZGUgdmlld3BvcnRcclxuXHRcdG5hdmJhcnMubm90KHRvcE5hdkJhcikuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdG5hdmJhck9iai5tZW51T3ZlcmZsb3coJCgnLm5hdmJhci1pbm5lcicsIHRoaXMpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJ1biBmdW5jdGlvbnMgYmFzZWQgb24gY3VycmVudGx5IGFjdGl2ZSBtZWRpYSBxdWVyeVxyXG5cdFx0aWYgKCBtcU5hdiA9PT0gMCApIHtcclxuXHRcdFx0bmF2YmFyT2JqLm1lbnVPdmVyZmxvdyh0b3BOYXZJbm5lcik7XHJcblx0XHRcdHRvcE5hdkJhci5jc3MoJ2hlaWdodCcsICcnKTtcclxuXHJcblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLm1lZ2FNZW51VG9nZ2xlKCdlbmFibGUnLCAkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtZW51UGFyZW50cy5vbigndG91Y2hzdGFydCcsIG1lbnVUb3VjaEhvdmVyKTtcclxuXHRcdFx0Ym9keUVsLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoUmVtb3ZlSG92ZXIpO1xyXG5cdFx0fSBlbHNlIGlmICggbXFOYXYgPiAwICkge1xyXG5cdFx0XHRuYXZiYXJPYmoubmF2TW9iaWxlKG1xTmF2KTtcclxuXHJcblx0XHRcdHZhciBuYXZIZWlnaHQgPSB0b3BOYXZIZWFkLm91dGVySGVpZ2h0KCkgKyAxO1xyXG5cdFx0XHR0b3BOYXZCYXIuY3NzKCdoZWlnaHQnLCBuYXZIZWlnaHQpO1xyXG5cclxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRuYXZiYXJPYmoubWVnYU1lbnVUb2dnbGUoJ2Rpc2FibGUnLCAkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtZW51UGFyZW50cy5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcclxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHtcclxuXHRcdFx0aWYgKCBtcU5hdiA9PT0gMSApIHtcclxuXHRcdFx0XHRuYXZiYXJPYmouc3RpY2t5TmF2KHRydWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5hdmJhck9iai5zdGlja3lOYXYoZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b3BOYXZCYXIuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5hdmJhck92ZXJsYXAoKTtcclxuXHR9XHJcblxyXG5cdC8vIEhhbmRsZSBOYXZiYXIgSXRlbXMgT3ZlcmxhcFxyXG5cdGZ1bmN0aW9uIG5hdmJhck92ZXJsYXAoKSB7XHJcblxyXG5cdFx0dmFyIG1xTmF2ID0gbXFDaGVjaygnbmF2YmFyLWNoZWNrJyk7XHJcblxyXG5cdFx0Ly8gUHJpbWFyeSBOYXZiYXJcclxuXHRcdGlmICggdG9wTmF2TG9nb0NscyAhPSAnbG9nby1jZW50ZXInICkge1xyXG5cdFx0XHRpZiAoIG1xTmF2ID09PSAwICkge1xyXG5cdFx0XHRcdHZhciB0b3BOYXZDb250V2lkdGggPSB0b3BOYXZDb250LmlubmVyV2lkdGgoKTtcclxuXHRcdFx0XHRpZiAoIHRvcE5hdkl0ZW1zV2lkdGggPiB0b3BOYXZDb250V2lkdGggKSB7XHJcblx0XHRcdFx0XHR0b3BOYXZXcmFwLnJlbW92ZUNsYXNzKHRvcE5hdkxvZ29DbHMpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0b3BOYXZXcmFwLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKHRvcE5hdkxvZ29DbHMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0b3BOYXZXcmFwLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKHRvcE5hdkxvZ29DbHMpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2Vjb25kYXJ5IE5hdmJhclxyXG5cdFx0aWYgKCBzZWNOYXZCYXIubGVuZ3RoICkge1xyXG5cdFx0XHR2YXIgc2VjTmF2Q29udFdpZHRoID0gc2VjTmF2Q29udC5pbm5lcldpZHRoKCk7XHJcblx0XHRcdGlmICggc2VjTmF2SXRlbXNXaWR0aCA+IHNlY05hdkNvbnRXaWR0aCApIHtcclxuXHRcdFx0XHRzZWNOYXZCYXIuYWRkQ2xhc3MoJ2l0ZW1zLW92ZXJsYXAnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWNOYXZCYXIucmVtb3ZlQ2xhc3MoJ2l0ZW1zLW92ZXJsYXAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRuYXZiYXJPdmVybGFwKCk7XHJcblxyXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRuYXZiYXJPYmouaW5pdCgkKHRoaXMpKTtcclxuXHR9KTtcclxuXHJcblx0bmF2YmFyRm4oKTtcclxuXHJcblx0bmF2YmFyT2JqLm1lZ2FNZW51Um93cygpO1xyXG5cclxuXHQkKHdpbmRvdykucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIG5hdmJhckZuICkpO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5NSVhUIFBPU1QgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGlmcmFtZUFzcGVjdCAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyk7XHJcblxyXG5cdC8vIFBvc3QgTGF5b3V0XHJcblx0ZnVuY3Rpb24gcG9zdHNQYWdlKCkge1xyXG5cclxuXHRcdC8vIEZlYXR1cmVkIEdhbGxlcnkgU2xpZGVyXHJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgZ2FsbGVyeVNsaWRlciA9ICQoJy5nYWxsZXJ5LXNsaWRlcicpLm5vdCgnLmxpZ2h0U2xpZGVyJyk7XHJcblx0XHRcdGdhbGxlcnlTbGlkZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRnYWxsZXJ5U2xpZGVyLmxpZ2h0U2xpZGVyKHtcclxuXHRcdFx0XHRcdGl0ZW06IDEsXHJcblx0XHRcdFx0XHRhdXRvOiB0cnVlLFxyXG5cdFx0XHRcdFx0bG9vcDogdHJ1ZSxcclxuXHRcdFx0XHRcdHBhZ2VyOiBmYWxzZSxcclxuXHRcdFx0XHRcdHBhdXNlOiA1MDAwLFxyXG5cdFx0XHRcdFx0a2V5UHJlc3M6IHRydWUsXHJcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMCxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodEdhbGxlcnkgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdHZhciBsaWdodEdhbGxlcnkgPSAkKCcubGlnaHRib3gtZ2FsbGVyeScpO1xyXG5cdFx0XHRsaWdodEdhbGxlcnkuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRsaWdodEdhbGxlcnkubGlnaHRHYWxsZXJ5KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVxdWFsaXplIGZlYXR1cmVkIG1lZGlhIGhlaWdodCBmb3IgcmVsYXRlZCBwb3N0cyBhbmQgZ3JpZCBibG9nXHJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgbWF0Y2hIZWlnaHRFbCA9ICQoJy5ibG9nLWdyaWQgLmJsb2ctcG9zdCAucG9zdC1mZWF0LCAucG9zdC1yZWxhdGVkIC5wb3N0LWZlYXQnKTtcclxuXHRcdFx0bWF0Y2hIZWlnaHRFbC5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdG1hdGNoSGVpZ2h0RWwuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHBvc3RzUGFnZSgpO1xyXG5cclxuXHJcblx0Ly8gSXNvdG9wZSBNYXNvbnJ5IEluaXRcclxuXHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyApIHtcclxuXHRcdHZhciBibG9nQ29udCA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHRcdGJsb2dDb250Lmlzb3RvcGUoe1xyXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcuYXJ0aWNsZScsXHJcblx0XHRcdGxheW91dDogJ21hc29ucnknLFxyXG5cdFx0XHRndXR0ZXI6IDBcclxuXHRcdH0pO1xyXG5cclxuXHRcdGJsb2dDb250LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7IGJsb2dDb250Lmlzb3RvcGUoJ2xheW91dCcpOyB9KTtcclxuXHRcdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0gKSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gVHJpZ2dlciBMaWdodGJveCBPbiBGZWF0dXJlZCBJbWFnZSBDbGlja1xyXG5cdCQoJy5saWdodGJveC10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHQkKHRoaXMpLnNpYmxpbmdzKCcuZ2FsbGVyeScpLmZpbmQoJ2xpJykuZmlyc3QoKS5jbGljaygpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gUmVsYXRlZCBQb3N0cyBTbGlkZXJcclxuXHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0dmFyIHJlbFBvc3RzU2xpZGVyID0gJCgnLnBvc3QtcmVsYXRlZCAuc2xpZGVyLWNvbnQnKTtcclxuXHRcdHJlbFBvc3RzU2xpZGVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbFBvc3RzU2xpZGVyLmxpZ2h0U2xpZGVyKHtcclxuXHRcdFx0XHRpdGVtOiA1LFxyXG5cdFx0XHRcdHBhZ2VyOiBmYWxzZSxcclxuXHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcclxuXHRcdFx0XHRzbGlkZU1hcmdpbjogMjAsXHJcblx0XHRcdFx0cmVzcG9uc2l2ZTogW1xyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRicmVha3BvaW50OiA5NjAsXHJcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IDMgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogNTAwLFxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nczogeyBpdGVtOiAyIH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRdXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHQkKCcucG9zdC1mZWF0JywgcmVsUG9zdHNTbGlkZXIpLm1hdGNoSGVpZ2h0KCk7XHJcblx0XHRcdFx0cmVsUG9zdHNTbGlkZXIuY3NzKCdoZWlnaHQnLCAnJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0XHJcblx0Ly8gUmVzaXplIEVtYmVkZGVkIFZpZGVvcyBQcm9wb3J0aW9uYWxseVxyXG5cdGlmcmFtZUFzcGVjdCggJCgnLnBvc3QgaWZyYW1lJykgKTtcclxuXHJcblxyXG5cdC8vIExvYWQgUG9zdHMgJiBDb21tZW50cyB2aWEgQWpheFxyXG5cdGZ1bmN0aW9uIG1peHRBamF4TG9hZCh0eXBlKSB7XHJcblx0XHR0eXBlID0gdHlwZSB8fCAncG9zdHMnO1xyXG5cdFx0dmFyIHBhZ0NvbnQgPSAkKCcucGFnaW5nLW5hdmlnYXRpb24nKSxcclxuXHRcdFx0YWpheEJ0biA9ICQoJy5hamF4LW1vcmUnLCBwYWdDb250KSxcclxuXHRcdFx0cGFnZU5vdyA9IHBhZ0NvbnQuZGF0YSgncGFnZS1ub3cnKSxcclxuXHRcdFx0cGFnZU1heCA9IHBhZ0NvbnQuZGF0YSgncGFnZS1tYXgnKSxcclxuXHRcdFx0cGFnZU51bSxcclxuXHRcdFx0cGFnZVR5cGUsXHJcblx0XHRcdG5leHRVcmwsXHJcblx0XHRcdGNvbnRhaW5lcixcclxuXHRcdFx0ZWxlbWVudCxcclxuXHRcdFx0bG9hZFNlbDtcclxuXHJcblx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcclxuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXTtcclxuXHRcdFx0bmV4dFVybCAgID0gbWl4dF9vcHQubGF5b3V0WyduZXh0LXVybCddO1xyXG5cdFx0XHRjb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XHJcblx0XHRcdGVsZW1lbnQgICA9ICcuYXJ0aWNsZSc7XHJcblx0XHRcdGxvYWRTZWwgICA9ICcgLnBvc3RzLWNvbnRhaW5lciAuYXJ0aWNsZSc7XHJcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdjb21tZW50cycgKSB7XHJcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXTtcclxuXHRcdFx0bmV4dFVybCAgID0gbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LW5leHQtdXJsJ107XHJcblx0XHRcdGNvbnRhaW5lciA9ICQoJy5jb21tZW50LWxpc3QnKTtcclxuXHRcdFx0ZWxlbWVudCAgID0gJy5jb21tZW50JztcclxuXHRcdFx0bG9hZFNlbCAgID0gJyAuY29tbWVudC1saXN0ID4gbGknO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZSA9PSAnY29tbWVudHMnICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcclxuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgLSAxO1xyXG5cdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgKyAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggKCBwYWdlTm93ID49IHBhZ2VNYXggKSAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gIT0gJ25ld2VzdCcgfHwgcGFnZU51bSA8PSAwICkge1xyXG5cdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YWpheEJ0bi5vbignY2xpY2sgY29udDpib3R0b20nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdC8vIFByZXZlbnQgbG9hZGluZyB0d2ljZSBvbiBzY3JvbGxcclxuXHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcclxuXHRcdFxyXG5cdFx0XHQvLyBBcmUgdGhlcmUgbW9yZSBwYWdlcyB0byBsb2FkP1xyXG5cdFx0XHRpZiAoIHBhZ2VOdW0gPiAwICYmIHBhZ2VOdW0gPD0gcGFnZU1heCApIHtcclxuXHRcdFx0XHJcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2xvYWRpbmcnKTtcclxuXHJcblx0XHRcdFx0Ly8gTG9hZCBwb3N0c1xyXG5cdFx0XHRcdC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXHJcblx0XHRcdFx0JCgnPGRpdj4nKS5sb2FkKG5leHRVcmwgKyBsb2FkU2VsLCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCB4aHIpIHtcclxuXHRcdFx0XHRcdHZhciBuZXdQb3N0cyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0YWpheEJ0bi5ibHVyKCk7XHJcblxyXG5cdFx0XHRcdFx0bmV3UG9zdHMuY2hpbGRyZW4oZWxlbWVudCkuYWRkQ2xhc3MoJ2FqYXgtbmV3Jyk7XHJcblx0XHRcdFx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyAmJiBtaXh0X29wdC5sYXlvdXQudHlwZSAhPSAnbWFzb25yeScgJiYgbWl4dF9vcHQucGFnZVsnc2hvdy1wYWdlLW5yJ10gKSB7XHJcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJhamF4LXBhZ2UgcGFnZS0nKyBwYWdlTnVtICsnXCI+PGEgaHJlZj1cIicrIG5leHRVcmwgKydcIj5QYWdlICcrIHBhZ2VOdW0gKyc8L2E+PC9kaXY+Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb250YWluZXIuYXBwZW5kKG5ld1Bvc3RzLmh0bWwoKSk7XHJcblxyXG5cdFx0XHRcdFx0bmV3UG9zdHMgPSBjb250YWluZXIuY2hpbGRyZW4oJy5hamF4LW5ldycpO1xyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSBwYWdlIG51bWJlciBhbmQgbmV4dFVybFxyXG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XHJcblx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcclxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvcGFnZVxcL1swLTldPy8sICcvcGFnZS8nICsgcGFnZU51bSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcclxuXHRcdFx0XHRcdFx0XHRwYWdlTnVtLS07XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cGFnZU51bSsrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL2NvbW1lbnQtcGFnZS1bMC05XT8vLCAnL2NvbW1lbnQtcGFnZS0nICsgcGFnZU51bSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYnV0dG9uIHN0YXRlXHJcblx0XHRcdFx0XHRpZiAoIHBhZ2VOdW0gPD0gcGFnZU1heCAmJiBwYWdlTnVtID4gMCApIHsgYWpheEJ0bi5idXR0b24oJ3Jlc2V0Jyk7IH1cclxuXHRcdFx0XHRcdGVsc2UgeyBhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTsgfVxyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSBsYXlvdXQgb25jZSBwb3N0cyBoYXZlIGxvYWRlZFxyXG5cdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnJlbW92ZUNsYXNzKCdhamF4LW5ldycpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcclxuXHRcdFx0XHRcdFx0XHRpZnJhbWVBc3BlY3QoKTtcclxuXHRcdFx0XHRcdFx0XHRwb3N0c1BhZ2UoKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnLmJsb2ctbWFzb25yeSAucG9zdHMtY29udGFpbmVyJyk7XHJcblx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRjb250YWluZXIuaXNvdG9wZSgnYXBwZW5kZWQnLCBuZXdQb3N0cyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7IH1cclxuXHJcblx0XHRcdFx0XHQvLyBIYW5kbGUgRXJyb3JzXHJcblx0XHRcdFx0XHRpZiAoIHN0YXR1cyA9PSAnZXJyb3InICkge1xyXG5cdFx0XHRcdFx0XHRhamF4QnRuLmJ1dHRvbignZXJyb3InKTtcclxuXHRcdFx0XHRcdFx0Ly8gRGVidWdnaW5nIGluZm9cclxuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoJ0FKQVggRXJyb3I6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gVHJpZ2dlciBBSkFYIGxvYWQgdXBvbiByZWFjaGluZyBib3R0b20gb2YgcGFnZVxyXG5cdFx0dmFyIGFqYXhTY3JvbGxIYW5kbGUgPSAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8qIGdsb2JhbCBlbGVtVmlzaWJsZSAqL1xyXG5cdFx0XHRcdGlmICggZWxlbVZpc2libGUoYWpheEJ0biwgdmlld3BvcnQpID09PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0YWpheEJ0bi50cmlnZ2VyKCdjb250OmJvdHRvbScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgJiYgYWpheEJ0bi5sZW5ndGggKSB7XHJcblx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gRXhlY3V0ZSBGdW5jdGlvbiBXaGVyZSBBcHBsaWNhYmxlXHJcblx0aWYgKCBtaXh0X29wdC5wYWdlWydwb3N0cy1wYWdlJ10gJiYgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1zY3JvbGwnICkge1xyXG5cdFx0bWl4dEFqYXhMb2FkKCdwb3N0cycpO1xyXG5cdH1cclxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaW5nbGUnICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRtaXh0QWpheExvYWQoJ2NvbW1lbnRzJyk7XHJcblx0fVxyXG5cclxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIFdpbmRvdyBSZXNpemVcclxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcclxuXHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cdH1cclxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgcmVzaXplRm4gKSk7XHJcblxyXG59KGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcblVJIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gRmxpcCBDYXJkIEVxdWFsaXplIEhlaWdodFxyXG5cdGlmICggdHlwZW9mICQuZm4ubWF0Y2hIZWlnaHQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHR2YXIgZmxpcGNhcmRTaWRlcyA9ICQoJy5mbGlwLWNhcmQgLmZyb250LCAuZmxpcC1jYXJkIC5iYWNrJyk7XHJcblx0XHRmbGlwY2FyZFNpZGVzLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGZsaXBjYXJkU2lkZXMuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufShqUXVlcnkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
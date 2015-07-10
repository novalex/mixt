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

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});
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
ELEMENT FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

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
		function statCircle() {
			$('.stat-circle').circleProgress({ size: 500, lineCap: 'round' }).children('.circle-inner').each( function() {
				$(this).css('margin-top', $(this).height() / -2);
			});
		}

		viewport.load( function() {
			statElems.each( function() {
				var stat = $(this);
				if ( typeof $.fn.waypoint === 'function' ) {
					stat.waypoint( function() {
						statValue(stat.find('.stat-value'));
						if ( typeof $.fn.circleProgress === 'function' ) statCircle();
						if ( typeof this.destroy === 'function' ) this.destroy();
					}, {
						offset: 'bottom-in-view',
						triggerOnce: true
					});
				} else {
					statValue(stat.find('.stat-value'));
					if ( typeof $.fn.circleProgress === 'function' ) statCircle();
				}
			});
		});
	}
	mixtStats();

}(jQuery);

/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport  = $(window),
		mainNavBar = $('#main-nav'),
		mediaWrap = $('.head-media');

	// Head Media Functions
	function headerFn() {
		var container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = mainNavBar.outerHeight(),
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

	// Header Scroll To Content
	function headerScroll() {
		var page   = $('html, body'),
			offset = $('#content-wrap').offset().top;
		if ( mixt_opt.nav.mode == 'fixed' ) { offset -= mainNavBar.children('.container').height(); }
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
		mainNavBar   = $('#main-nav'),
		mainNavWrap  = $('#main-nav-wrap'),
		mainNavHead  = $('.navbar-header', mainNavBar),
		mainNavInner = $('.navbar-inner', mainNavBar),
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
			if ( navbar.is(mainNavBar) ) {
				navbarObj.navBg = ( colorLum == 'dark' ) ? 'bg-dark' : '';
				if ( mixt_opt.nav.transparent && mixt_opt.header.enabled && mixt_opt.nav['top-opacity'] <= 0.4 ) {
					navbarObj.navBgTop = mediaWrap.hasClass('bg-dark') ? 'bg-dark' : '';
				} else {
					navbarObj.navBgTop = navbarObj.navBg;
				}
				if ( mixt_opt.nav.mode == 'static' ) {
					mainNavBar.removeClass(navbarObj.navBg).addClass('position-top ' + navbarObj.navBgTop);
				}
			}
		},

		// Sticky (fixed) Navbar Function

		stickyNav: function(isMobile) {

			var navScrollHandler = $.throttle( 50, stickyNavToggle ),
				scrollCorrection = 0,
				mainNavHeight     = 0,
				mainNavPos        = 0,
				mainNavMg         = 0;

			if ( isMobile === false ) { viewport.on('scroll', navScrollHandler); }
			else { viewport.off('scroll', navScrollHandler); }

			if ( mixt_opt.page['show-admin-bar'] ) {
				scrollCorrection += parseFloat(mainWrap.css('padding-top'), 10);
			}

			if ( mixt_opt.nav.transparent && mixt_opt.nav.position == 'below' ) {
				mainNavHeight = mainNavBar.css('height', '').outerHeight();
				mainNavPos    = parseInt(mainNavBar.css('top'), 10);
				mainNavMg     = mainNavHeight;

				if ( mainNavPos === 0 || isNaN(mainNavPos) ) {
					mainNavBar.css('margin-top', (mainNavHeight * -1));
				}
			}

			function stickyNavToggle() {
				var navPos    = mainNavWrap.offset().top - mainNavMg,
					scrollVal = viewport.scrollTop(),
					bgTopCls  = navbarObj.navBgTop;

				scrollVal = isMobile === true ? 0 : scrollVal += scrollCorrection;

				if ( mainNavBar.hasClass('slide-bg-dark') ) { bgTopCls = 'bg-dark'; }
				if ( mainNavBar.hasClass('slide-bg-light') ) { bgTopCls = ''; }

				if ( scrollVal > navPos ) {  
					bodyEl.addClass('fixed-nav');
					mainNavBar.removeClass('position-top ' + bgTopCls).addClass(navbarObj.navBg);
				} else {
					bodyEl.removeClass('fixed-nav');
					mainNavBar.removeClass(navbarObj.navBg).addClass('position-top ' + bgTopCls);
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
						navbarHeaderH = mainNavHead.height() + 1,
						navbarInnerH  = mainNavInner.hasClass('in') ? mainNavInner.height() : 0,
						navbarH       = navbarHeaderH + navbarInnerH,
						navbarMg      = 0,
						navbarTop     = mainNavBar.offset().top,
						navwrapTop    = mainNavWrap.offset().top,

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
						if ( mainNavBar.not('stopped') ) {
							mainNavBar.addClass('stopped').css({ 'position': 'absolute', 'top': (navbarTop - navwrapTop), 'margin-top': '0' });
						}
					} else {
						viewport.off('scroll', scrollHandler);
						mainNavBar.css({ 'position': '', 'top': '', 'margin-top': navbarMg }).removeClass('stopped');
					}
				}

				function navStopScroll() {
					var viewScroll = viewport.scrollTop(),
						stopScroll = mainNavBar.hasClass('stopped') ? true : false;
					if ( viewportS > mainNavHead.offset().top ) { stopScroll = false; }
					if ( viewportS > viewScroll && stopScroll ) { viewport.scrollTop(viewportS); }
				}
			}

			// Show/hide Submenus On Handle Click

			$('.dropdown-toggle', mainNavBar).on('click touchstart', function(event) {
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

			mainNavInner.on('shown.bs.collapse hidden.bs.collapse', function() {
				$('.menu-item', mainNavBar).removeClass('expand');
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
	var mainNavCont    = mainNavBar.children('.container'),
		mainNavLogoCls = mainNavWrap.attr('data-logo-align'),
		mainNavItemsWidth = 0,

		secNavCont = secNavBar.children('.container'),
		secNavItemsWidth = 0;

	if ( mainNavLogoCls != 'logo-center' ) {
		mainNavItemsWidth = mainNavHead.outerWidth(true) + $('#main-menu').outerWidth(true);
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
		navbars.not(mainNavBar).each( function() {
			navbarObj.menuOverflow($('.navbar-inner', this));
		});

		// Run functions based on currently active media query
		if ( mqNav === 0 ) {
			navbarObj.menuOverflow(mainNavInner);
			mainNavBar.css('height', '');

			navbars.each( function() {
				navbarObj.megaMenuToggle('enable', $(this));
			});

			menuParents.on('touchstart', menuTouchHover);
			bodyEl.on('touchstart', menuTouchRemoveHover);
		} else if ( mqNav > 0 ) {
			navbarObj.navMobile(mqNav);

			var navHeight = mainNavHead.outerHeight() + 1;
			mainNavBar.css('height', navHeight);

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
			mainNavBar.addClass('position-top');
		}

		navbarOverlap();
	}

	// Handle Navbar Items Overlap
	function navbarOverlap() {

		var mqNav = mqCheck('navbar-check');

		// Primary Navbar
		if ( mainNavLogoCls != 'logo-center' ) {
			if ( mqNav === 0 ) {
				var mainNavContWidth = mainNavCont.innerWidth();
				if ( mainNavItemsWidth > mainNavContWidth ) {
					mainNavWrap.removeClass(mainNavLogoCls).addClass('logo-center');
				} else {
					mainNavWrap.removeClass('logo-center').addClass(mainNavLogoCls);
				}
			} else {
				mainNavWrap.removeClass('logo-center').addClass(mainNavLogoCls);
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
			var relPostsSlider = $('.post-related .slider-cont');
			relPostsSlider.imagesLoaded( function() {
				relPostsSlider.lightSlider({
					item: 3,
					pager: false,
					keyPress: true,
					slideMargin: 20,
					responsive: [{
						breakpoint: 960,
						settings: { item: 3 }
					}, {
						breakpoint: 500,
						settings: { item: 2 }
					}],
					onSliderLoad: function(el) {
						if ( typeof $.fn.matchHeight === 'function' ) {
							$('.post-feat', relPostsSlider).matchHeight();
							relPostsSlider.css('height', '');
						}
					}
				});
			});
		}
	});

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiRWxlbWVudFF1ZXJpZXMuanMiLCJob3ZlckludGVudC5qcyIsImltYWdlc2xvYWRlZC5wa2dkLm1pbi5qcyIsIm1hdGNoSGVpZ2h0LmpzIiwibWl4dC1wbHVnaW5zLmpzIiwibW9kZXJuaXpyLmpzIiwiUmVzaXplU2Vuc29yLmpzIiwiZWxlbWVudHMuanMiLCJoZWFkZXIuanMiLCJpbnRlZ3JhdGlvbi5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZSAtIHYxLjEgLSAzLzcvMjAxMFxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW5cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuICovXG5cbi8vIFNjcmlwdDogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2U6IFNvbWV0aW1lcywgbGVzcyBpcyBtb3JlIVxuLy9cbi8vICpWZXJzaW9uOiAxLjEsIExhc3QgdXBkYXRlZDogMy83LzIwMTAqXG4vLyBcbi8vIFByb2plY3QgSG9tZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbi8vIEdpdEh1YiAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvXG4vLyBTb3VyY2UgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLmpzXG4vLyAoTWluaWZpZWQpICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLm1pbi5qcyAoMC43a2IpXG4vLyBcbi8vIEFib3V0OiBMaWNlbnNlXG4vLyBcbi8vIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hbixcbi8vIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuLy8gaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuLy8gXG4vLyBBYm91dDogRXhhbXBsZXNcbi8vIFxuLy8gVGhlc2Ugd29ya2luZyBleGFtcGxlcywgY29tcGxldGUgd2l0aCBmdWxseSBjb21tZW50ZWQgY29kZSwgaWxsdXN0cmF0ZSBhIGZld1xuLy8gd2F5cyBpbiB3aGljaCB0aGlzIHBsdWdpbiBjYW4gYmUgdXNlZC5cbi8vIFxuLy8gVGhyb3R0bGUgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL3Rocm90dGxlL1xuLy8gRGVib3VuY2UgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL2RlYm91bmNlL1xuLy8gXG4vLyBBYm91dDogU3VwcG9ydCBhbmQgVGVzdGluZ1xuLy8gXG4vLyBJbmZvcm1hdGlvbiBhYm91dCB3aGF0IHZlcnNpb24gb3IgdmVyc2lvbnMgb2YgalF1ZXJ5IHRoaXMgcGx1Z2luIGhhcyBiZWVuXG4vLyB0ZXN0ZWQgd2l0aCwgd2hhdCBicm93c2VycyBpdCBoYXMgYmVlbiB0ZXN0ZWQgaW4sIGFuZCB3aGVyZSB0aGUgdW5pdCB0ZXN0c1xuLy8gcmVzaWRlIChzbyB5b3UgY2FuIHRlc3QgaXQgeW91cnNlbGYpLlxuLy8gXG4vLyBqUXVlcnkgVmVyc2lvbnMgLSBub25lLCAxLjMuMiwgMS40LjJcbi8vIEJyb3dzZXJzIFRlc3RlZCAtIEludGVybmV0IEV4cGxvcmVyIDYtOCwgRmlyZWZveCAyLTMuNiwgU2FmYXJpIDMtNCwgQ2hyb21lIDQtNSwgT3BlcmEgOS42LTEwLjEuXG4vLyBVbml0IFRlc3RzICAgICAgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3VuaXQvXG4vLyBcbi8vIEFib3V0OiBSZWxlYXNlIEhpc3Rvcnlcbi8vIFxuLy8gMS4xIC0gKDMvNy8yMDEwKSBGaXhlZCBhIGJ1ZyBpbiA8alF1ZXJ5LnRocm90dGxlPiB3aGVyZSB0cmFpbGluZyBjYWxsYmFja3Ncbi8vICAgICAgIGV4ZWN1dGVkIGxhdGVyIHRoYW4gdGhleSBzaG91bGQuIFJld29ya2VkIGEgZmFpciBhbW91bnQgb2YgaW50ZXJuYWxcbi8vICAgICAgIGxvZ2ljIGFzIHdlbGwuXG4vLyAxLjAgLSAoMy82LzIwMTApIEluaXRpYWwgcmVsZWFzZSBhcyBhIHN0YW5kLWFsb25lIHByb2plY3QuIE1pZ3JhdGVkIG92ZXJcbi8vICAgICAgIGZyb20ganF1ZXJ5LW1pc2MgcmVwbyB2MC40IHRvIGpxdWVyeS10aHJvdHRsZSByZXBvIHYxLjAsIGFkZGVkIHRoZVxuLy8gICAgICAgbm9fdHJhaWxpbmcgdGhyb3R0bGUgcGFyYW1ldGVyIGFuZCBkZWJvdW5jZSBmdW5jdGlvbmFsaXR5LlxuLy8gXG4vLyBUb3BpYzogTm90ZSBmb3Igbm9uLWpRdWVyeSB1c2Vyc1xuLy8gXG4vLyBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBiZWNhdXNlIG5vdGhpbmcgaW50ZXJuYWxcbi8vIHVzZXMgYW55IGpRdWVyeSBtZXRob2RzIG9yIHByb3BlcnRpZXMuIGpRdWVyeSBpcyBqdXN0IHVzZWQgYXMgYSBuYW1lc3BhY2Vcbi8vIHVuZGVyIHdoaWNoIHRoZXNlIG1ldGhvZHMgY2FuIGV4aXN0LlxuLy8gXG4vLyBTaW5jZSBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBpZiBqUXVlcnkgZG9lc24ndCBleGlzdFxuLy8gd2hlbiB0aGlzIHBsdWdpbiBpcyBsb2FkZWQsIHRoZSBtZXRob2QgZGVzY3JpYmVkIGJlbG93IHdpbGwgYmUgY3JlYXRlZCBpblxuLy8gdGhlIGBDb3dib3lgIG5hbWVzcGFjZS4gVXNhZ2Ugd2lsbCBiZSBleGFjdGx5IHRoZSBzYW1lLCBidXQgaW5zdGVhZCBvZlxuLy8gJC5tZXRob2QoKSBvciBqUXVlcnkubWV0aG9kKCksIHlvdSdsbCBuZWVkIHRvIHVzZSBDb3dib3kubWV0aG9kKCkuXG5cbihmdW5jdGlvbih3aW5kb3csdW5kZWZpbmVkKXtcbiAgJyQ6bm9tdW5nZSc7IC8vIFVzZWQgYnkgWVVJIGNvbXByZXNzb3IuXG4gIFxuICAvLyBTaW5jZSBqUXVlcnkgcmVhbGx5IGlzbid0IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgdXNlIGBqUXVlcnlgIGFzIHRoZVxuICAvLyBuYW1lc3BhY2Ugb25seSBpZiBpdCBhbHJlYWR5IGV4aXN0cywgb3RoZXJ3aXNlIHVzZSB0aGUgYENvd2JveWAgbmFtZXNwYWNlLFxuICAvLyBjcmVhdGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gIHZhciAkID0gd2luZG93LmpRdWVyeSB8fCB3aW5kb3cuQ293Ym95IHx8ICggd2luZG93LkNvd2JveSA9IHt9ICksXG4gICAgXG4gICAgLy8gSW50ZXJuYWwgbWV0aG9kIHJlZmVyZW5jZS5cbiAgICBqcV90aHJvdHRsZTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LnRocm90dGxlXG4gIC8vIFxuICAvLyBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcbiAgLy8gZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLiBJZiB5b3Ugd2FudCB0b1xuICAvLyByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uIHRvIGEgc2luZ2xlIHRpbWUsIHNlZSB0aGVcbiAgLy8gPGpRdWVyeS5kZWJvdW5jZT4gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vID4gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgdGhyb3R0bGVkID0galF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBub190cmFpbGluZyAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vX3RyYWlsaW5nIGlzXG4gIC8vICAgIHRydWUsIGNhbGxiYWNrIHdpbGwgb25seSBleGVjdXRlIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIHdoaWxlIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkLiBJZiBub190cmFpbGluZyBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZSBhZnRlciB0aGUgbGFzdFxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuXG4gIC8vICAgIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIHRocm90dGxlZCwgZnVuY3Rpb24uXG4gIFxuICAkLnRocm90dGxlID0ganFfdGhyb3R0bGUgPSBmdW5jdGlvbiggZGVsYXksIG5vX3RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VfbW9kZSApIHtcbiAgICAvLyBBZnRlciB3cmFwcGVyIGhhcyBzdG9wcGVkIGJlaW5nIGNhbGxlZCwgdGhpcyB0aW1lb3V0IGVuc3VyZXMgdGhhdFxuICAgIC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuICAgIC8vIGRlYm91bmNlIG1vZGVzLlxuICAgIHZhciB0aW1lb3V0X2lkLFxuICAgICAgXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG4gICAgICBsYXN0X2V4ZWMgPSAwO1xuICAgIFxuICAgIC8vIGBub190cmFpbGluZ2AgZGVmYXVsdHMgdG8gZmFsc3kuXG4gICAgaWYgKCB0eXBlb2Ygbm9fdHJhaWxpbmcgIT09ICdib29sZWFuJyApIHtcbiAgICAgIGRlYm91bmNlX21vZGUgPSBjYWxsYmFjaztcbiAgICAgIGNhbGxiYWNrID0gbm9fdHJhaWxpbmc7XG4gICAgICBub190cmFpbGluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLy8gVGhlIGB3cmFwcGVyYCBmdW5jdGlvbiBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSB0aHJvdHRsaW5nIC8gZGVib3VuY2luZ1xuICAgIC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG4gICAgLy8gaXMgZXhlY3V0ZWQuXG4gICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgZWxhcHNlZCA9ICtuZXcgRGF0ZSgpIC0gbGFzdF9leGVjLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgXG4gICAgICAvLyBFeGVjdXRlIGBjYWxsYmFja2AgYW5kIHVwZGF0ZSB0aGUgYGxhc3RfZXhlY2AgdGltZXN0YW1wLlxuICAgICAgZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgbGFzdF9leGVjID0gK25ldyBEYXRlKCk7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KCB0aGF0LCBhcmdzICk7XG4gICAgICB9O1xuICAgICAgXG4gICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pIHRoaXMgaXMgdXNlZCB0byBjbGVhciB0aGUgZmxhZ1xuICAgICAgLy8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cbiAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aW1lb3V0X2lkID0gdW5kZWZpbmVkO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlICYmICF0aW1lb3V0X2lkICkge1xuICAgICAgICAvLyBTaW5jZSBgd3JhcHBlcmAgaXMgYmVpbmcgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZSBhbmRcbiAgICAgICAgLy8gYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgZXhlY3V0ZSBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIENsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0LlxuICAgICAgdGltZW91dF9pZCAmJiBjbGVhclRpbWVvdXQoIHRpbWVvdXRfaWQgKTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgJiYgZWxhcHNlZCA+IGRlbGF5ICkge1xuICAgICAgICAvLyBJbiB0aHJvdHRsZSBtb2RlLCBpZiBgZGVsYXlgIHRpbWUgaGFzIGJlZW4gZXhjZWVkZWQsIGV4ZWN1dGVcbiAgICAgICAgLy8gYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgICBcbiAgICAgIH0gZWxzZSBpZiAoIG5vX3RyYWlsaW5nICE9PSB0cnVlICkge1xuICAgICAgICAvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG4gICAgICAgIC8vIGV4Y2VlZGVkLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYGRlbGF5YCBtcyBhZnRlciBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBleGVjdXRpb24uXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGVcbiAgICAgICAgLy8gYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuICAgICAgICAvLyBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIHRpbWVvdXRfaWQgPSBzZXRUaW1lb3V0KCBkZWJvdW5jZV9tb2RlID8gY2xlYXIgOiBleGVjLCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgPyBkZWxheSAtIGVsYXBzZWQgOiBkZWxheSApO1xuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgLy8gU2V0IHRoZSBndWlkIG9mIGB3cmFwcGVyYCBmdW5jdGlvbiB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbCBjYWxsYmFjaywgc29cbiAgICAvLyBpdCBjYW4gYmUgcmVtb3ZlZCBpbiBqUXVlcnkgMS40KyAudW5iaW5kIG9yIC5kaWUgYnkgdXNpbmcgdGhlIG9yaWdpbmFsXG4gICAgLy8gY2FsbGJhY2sgYXMgYSByZWZlcmVuY2UuXG4gICAgaWYgKCAkLmd1aWQgKSB7XG4gICAgICB3cmFwcGVyLmd1aWQgPSBjYWxsYmFjay5ndWlkID0gY2FsbGJhY2suZ3VpZCB8fCAkLmd1aWQrKztcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9O1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkuZGVib3VuY2VcbiAgLy8gXG4gIC8vIERlYm91bmNlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBEZWJvdW5jaW5nLCB1bmxpa2UgdGhyb3R0bGluZyxcbiAgLy8gZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gIC8vIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2VyaWVzIG9mIGNhbGxzLCBvciBhdCB0aGUgdmVyeSBlbmQuIElmIHlvdSB3YW50IHRvXG4gIC8vIHNpbXBseSByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLCBzZWUgdGhlIDxqUXVlcnkudGhyb3R0bGU+XG4gIC8vIG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+ICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyA+IFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciBkZWJvdW5jZWQgPSBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIGF0X2JlZ2luIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYXRfYmVnaW4gaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgb25seSBiZSBleGVjdXRlZCBgZGVsYXlgIG1pbGxpc2Vjb25kcyBhZnRlclxuICAvLyAgICB0aGUgbGFzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gSWYgYXRfYmVnaW4gaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBiZVxuICAvLyAgICBleGVjdXRlZCBvbmx5IGF0IHRoZSBmaXJzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZVxuICAvLyAgICBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIGRlYm91bmNlZCwgZnVuY3Rpb24uXG4gIFxuICAkLmRlYm91bmNlID0gZnVuY3Rpb24oIGRlbGF5LCBhdF9iZWdpbiwgY2FsbGJhY2sgKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrID09PSB1bmRlZmluZWRcbiAgICAgID8ganFfdGhyb3R0bGUoIGRlbGF5LCBhdF9iZWdpbiwgZmFsc2UgKVxuICAgICAgOiBqcV90aHJvdHRsZSggZGVsYXksIGNhbGxiYWNrLCBhdF9iZWdpbiAhPT0gZmFsc2UgKTtcbiAgfTtcbiAgXG59KSh0aGlzKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHZhciBFbGVtZW50UXVlcmllcyA9IHRoaXMuRWxlbWVudFF1ZXJpZXMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLndpdGhUcmFja2luZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldEVtU2l6ZShlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAnZm9udFNpemUnKTtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGZvbnRTaXplKSB8fCAxNjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9NcjBncm9nL2VsZW1lbnQtcXVlcnkvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjb252ZXJ0VG9QeChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVuaXRzID0gdmFsdWUucmVwbGFjZSgvWzAtOV0qLywgJycpO1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlbVwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBnZXRFbVNpemUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJlbVwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBnZXRFbVNpemUoKTtcbiAgICAgICAgICAgICAgICAvLyBWaWV3cG9ydCB1bml0cyFcbiAgICAgICAgICAgICAgICAvLyBBY2NvcmRpbmcgdG8gaHR0cDovL3F1aXJrc21vZGUub3JnL21vYmlsZS90YWJsZVZpZXdwb3J0Lmh0bWxcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgvSGVpZ2h0IGdldHMgdXMgdGhlIG1vc3QgcmVsaWFibGUgaW5mb1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2d1wiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAxMDA7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZoXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAxMDA7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZtaW5cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwidm1heFwiOlxuICAgICAgICAgICAgICAgICAgICB2YXIgdncgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaG9vc2VyID0gTWF0aFt1bml0cyA9PT0gXCJ2bWluXCIgPyBcIm1pblwiIDogXCJtYXhcIl07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGNob29zZXIodncsIHZoKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gZm9yIG5vdywgbm90IHN1cHBvcnRpbmcgcGh5c2ljYWwgdW5pdHMgKHNpbmNlIHRoZXkgYXJlIGp1c3QgYSBzZXQgbnVtYmVyIG9mIHB4KVxuICAgICAgICAgICAgICAgIC8vIG9yIGV4L2NoIChnZXR0aW5nIGFjY3VyYXRlIG1lYXN1cmVtZW50cyBpcyBoYXJkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBTZXR1cEluZm9ybWF0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIHZhciBrZXksIG9wdGlvbiwgd2lkdGggPSAwLCBoZWlnaHQgPSAwLCB2YWx1ZSwgYWN0dWFsVmFsdWUsIGF0dHJWYWx1ZXMsIGF0dHJWYWx1ZSwgYXR0ck5hbWU7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiB7bW9kZTogJ21pbnxtYXgnLCBwcm9wZXJ0eTogJ3dpZHRofGhlaWdodCcsIHZhbHVlOiAnMTIzcHgnfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBbb3B0aW9uLm1vZGUsIG9wdGlvbi5wcm9wZXJ0eSwgb3B0aW9uLnZhbHVlXS5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zW2lkeF0gPSBvcHRpb247XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFsnbWluLXdpZHRoJywgJ21pbi1oZWlnaHQnLCAnbWF4LXdpZHRoJywgJ21heC1oZWlnaHQnXTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeHRyYWN0cyB0aGUgY29tcHV0ZWQgd2lkdGgvaGVpZ2h0IGFuZCBzZXRzIHRvIG1pbi9tYXgtIGF0dHJpYnV0ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gZXh0cmFjdCBjdXJyZW50IGRpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgYXR0clZhbHVlcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uID0gdGhpcy5vcHRpb25zW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb252ZXJ0VG9QeCh0aGlzLmVsZW1lbnQsIG9wdGlvbi52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsVmFsdWUgPSBvcHRpb24ucHJvcGVydHkgPT0gJ3dpZHRoJyA/IHdpZHRoIDogaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBhdHRyTmFtZSA9IG9wdGlvbi5tb2RlICsgJy0nICsgb3B0aW9uLnByb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uLm1vZGUgPT0gJ21pbicgJiYgYWN0dWFsVmFsdWUgPj0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSArPSBvcHRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uLm1vZGUgPT0gJ21heCcgJiYgYWN0dWFsVmFsdWUgPD0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSArPSBvcHRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHJWYWx1ZXNbYXR0ck5hbWVdKSBhdHRyVmFsdWVzW2F0dHJOYW1lXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0clZhbHVlICYmIC0xID09PSAoJyAnK2F0dHJWYWx1ZXNbYXR0ck5hbWVdKycgJykuaW5kZXhPZignICcgKyBhdHRyVmFsdWUgKyAnICcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWVzW2F0dHJOYW1lXSArPSAnICcgKyBhdHRyVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZXNbYXR0cmlidXRlc1trXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlc1trXSwgYXR0clZhbHVlc1thdHRyaWJ1dGVzW2tdXS5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVzW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgICBvcHRpb25zXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uYWRkT3B0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbiA9IG5ldyBTZXR1cEluZm9ybWF0aW9uKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmFkZE9wdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcihlbGVtZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uY2FsbCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy53aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBtaW58bWF4XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSB3aWR0aHxoZWlnaHRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBxdWV1ZVF1ZXJ5KHNlbGVjdG9yLCBtb2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKSBxdWVyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwuYmluZChkb2N1bWVudCk7XG4gICAgICAgICAgICBpZiAoIXF1ZXJ5ICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YgJCQpIHF1ZXJ5ID0gJCQ7XG4gICAgICAgICAgICBpZiAoIXF1ZXJ5ICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5KSBxdWVyeSA9IGpRdWVyeTtcblxuICAgICAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdObyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsLCBqUXVlcnkgb3IgTW9vdG9vbHNcXCdzICQkIGZvdW5kLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBFbGVtZW50KGVsZW1lbnRzW2ldLCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVnZXggPSAvLD8oW14sXFxuXSopXFxbW1xcc1xcdF0qKG1pbnxtYXgpLSh3aWR0aHxoZWlnaHQpW1xcc1xcdF0qW34kXFxeXT89W1xcc1xcdF0qXCIoW15cIl0qKVwiW1xcc1xcdF0qXShbXlxcblxcc1xce10qKS9tZ2k7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjc3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RRdWVyeShjc3MpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgICAgIGNzcyA9IGNzcy5yZXBsYWNlKC8nL2csICdcIicpO1xuICAgICAgICAgICAgd2hpbGUgKG51bGwgIT09IChtYXRjaCA9IHJlZ2V4LmV4ZWMoY3NzKSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoNSA8IG1hdGNoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZVF1ZXJ5KG1hdGNoWzFdIHx8IG1hdGNoWzVdLCBtYXRjaFsyXSwgbWF0Y2hbM10sIG1hdGNoWzRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtDc3NSdWxlW118U3RyaW5nfSBydWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVhZFJ1bGVzKHJ1bGVzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSAnJztcbiAgICAgICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBydWxlcykge1xuICAgICAgICAgICAgICAgIHJ1bGVzID0gcnVsZXMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoLTEgIT09IHJ1bGVzLmluZGV4T2YoJ21pbi13aWR0aCcpIHx8IC0xICE9PSBydWxlcy5pbmRleE9mKCdtYXgtd2lkdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkocnVsZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBydWxlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT09IHJ1bGVzW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gcnVsZXNbaV0uc2VsZWN0b3JUZXh0IHx8IHJ1bGVzW2ldLmNzc1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21pbi1oZWlnaHQnKSB8fCAtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWF4LWhlaWdodCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtaW4td2lkdGgnKSB8fCAtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWF4LXdpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKDQgPT09IHJ1bGVzW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhydWxlc1tpXS5jc3NSdWxlcyB8fCBydWxlc1tpXS5ydWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VhcmNoZXMgYWxsIGNzcyBydWxlcyBhbmQgc2V0dXBzIHRoZSBldmVudCBsaXN0ZW5lciB0byBhbGwgZWxlbWVudHMgd2l0aCBlbGVtZW50IHF1ZXJ5IHJ1bGVzLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoVHJhY2tpbmcgYWxsb3dzIGFuZCByZXF1aXJlcyB5b3UgdG8gdXNlIGRldGFjaCwgc2luY2Ugd2Ugc3RvcmUgaW50ZXJuYWxseSBhbGwgdXNlZCBlbGVtZW50c1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm8gZ2FyYmFnZSBjb2xsZWN0aW9uIHBvc3NpYmxlIGlmIHlvdSBkb24gbm90IGNhbGwgLmRldGFjaCgpIGZpcnN0KVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24od2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICB0aGlzLndpdGhUcmFja2luZyA9IHdpdGhUcmFja2luZztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZFJ1bGVzKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1RleHQgfHwgZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0uY3NzUnVsZXMgfHwgZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0ucnVsZXMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5uYW1lICE9PSAnU2VjdXJpdHlFcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24od2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICB0aGlzLndpdGhUcmFja2luZyA9IHdpdGhUcmFja2luZztcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGV0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMud2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ3dpdGhUcmFja2luZyBpcyBub3QgZW5hYmxlZC4gV2UgY2FuIG5vdCBkZXRhY2ggZWxlbWVudHMgc2luY2Ugd2UgZG9uIG5vdCBzdG9yZSBpdC4nICtcbiAgICAgICAgICAgICAgICAnVXNlIEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyA9IHRydWU7IGJlZm9yZSBkb21yZWFkeS4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxlbWVudDtcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudHMucG9wKCkpIHtcbiAgICAgICAgICAgICAgICBFbGVtZW50UXVlcmllcy5kZXRhY2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnRzID0gW107XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoVHJhY2tpbmcgYWxsb3dzIGFuZCByZXF1aXJlcyB5b3UgdG8gdXNlIGRldGFjaCwgc2luY2Ugd2Ugc3RvcmUgaW50ZXJuYWxseSBhbGwgdXNlZCBlbGVtZW50c1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICovXG4gICAgRWxlbWVudFF1ZXJpZXMudXBkYXRlID0gZnVuY3Rpb24od2l0aFRyYWNraW5nKSB7XG4gICAgICAgIEVsZW1lbnRRdWVyaWVzLmluc3RhbmNlLnVwZGF0ZSh3aXRoVHJhY2tpbmcpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBzZW5zb3IgYW5kIGVsZW1lbnRxdWVyeSBpbmZvcm1hdGlvbiBmcm9tIHRoZSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIEVsZW1lbnRRdWVyaWVzLmRldGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uKSB7XG4gICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yLmRldGFjaCgpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZW5zb3I7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGV0YWNoZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXRhY2hlZCBhbHJlYWR5JywgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWxlbWVudFF1ZXJpZXMud2l0aFRyYWNraW5nID0gZmFsc2U7XG5cbiAgICBFbGVtZW50UXVlcmllcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEVsZW1lbnRRdWVyaWVzLmluc3RhbmNlID0gbmV3IEVsZW1lbnRRdWVyaWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZS5pbml0KEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyk7XG4gICAgfTtcblxuICAgIHZhciBkb21Mb2FkZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgLyogSW50ZXJuZXQgRXhwbG9yZXIgKi9cbiAgICAgICAgLypAY2Nfb25cbiAgICAgICAgQGlmIChAX3dpbjMyIHx8IEBfd2luNjQpXG4gICAgICAgICAgICBkb2N1bWVudC53cml0ZSgnPHNjcmlwdCBpZD1cImllU2NyaXB0TG9hZFwiIGRlZmVyIHNyYz1cIi8vOlwiPjxcXC9zY3JpcHQ+Jyk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWVTY3JpcHRMb2FkJykub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgQGVuZCBAKi9cbiAgICAgICAgLyogTW96aWxsYSwgQ2hyb21lLCBPcGVyYSAqL1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgLyogU2FmYXJpLCBpQ2FiLCBLb25xdWVyb3IgKi9cbiAgICAgICAgaWYgKC9LSFRNTHxXZWJLaXR8aUNhYi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgIHZhciBET01Mb2FkVGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKC9sb2FkZWR8Y29tcGxldGUvaS50ZXN0KGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoRE9NTG9hZFRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgLyogT3RoZXIgd2ViIGJyb3dzZXJzICovXG4gICAgICAgIHdpbmRvdy5vbmxvYWQgPSBjYWxsYmFjaztcbiAgICB9O1xuXG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgRWxlbWVudFF1ZXJpZXMuaW5pdCwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hdHRhY2hFdmVudCgnb25sb2FkJywgRWxlbWVudFF1ZXJpZXMuaW5pdCk7XG4gICAgfVxuICAgIGRvbUxvYWRlZChFbGVtZW50UXVlcmllcy5pbml0KTtcblxufSkoKTtcbiIsIi8qIVxuICogaG92ZXJJbnRlbnQgdjEuOC4xIC8vIDIwMTQuMDguMTEgLy8galF1ZXJ5IHYxLjkuMStcbiAqIGh0dHA6Ly9jaGVybmUubmV0L2JyaWFuL3Jlc291cmNlcy9qcXVlcnkuaG92ZXJJbnRlbnQuaHRtbFxuICpcbiAqIFlvdSBtYXkgdXNlIGhvdmVySW50ZW50IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuIEJhc2ljYWxseSB0aGF0XG4gKiBtZWFucyB5b3UgYXJlIGZyZWUgdG8gdXNlIGhvdmVySW50ZW50IGFzIGxvbmcgYXMgdGhpcyBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuXG4gKiBDb3B5cmlnaHQgMjAwNywgMjAxNCBCcmlhbiBDaGVybmVcbiAqL1xuIFxuLyogaG92ZXJJbnRlbnQgaXMgc2ltaWxhciB0byBqUXVlcnkncyBidWlsdC1pbiBcImhvdmVyXCIgbWV0aG9kIGV4Y2VwdCB0aGF0XG4gKiBpbnN0ZWFkIG9mIGZpcmluZyB0aGUgaGFuZGxlckluIGZ1bmN0aW9uIGltbWVkaWF0ZWx5LCBob3ZlckludGVudCBjaGVja3NcbiAqIHRvIHNlZSBpZiB0aGUgdXNlcidzIG1vdXNlIGhhcyBzbG93ZWQgZG93biAoYmVuZWF0aCB0aGUgc2Vuc2l0aXZpdHlcbiAqIHRocmVzaG9sZCkgYmVmb3JlIGZpcmluZyB0aGUgZXZlbnQuIFRoZSBoYW5kbGVyT3V0IGZ1bmN0aW9uIGlzIG9ubHlcbiAqIGNhbGxlZCBhZnRlciBhIG1hdGNoaW5nIGhhbmRsZXJJbi5cbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4ganVzdCBsaWtlIC5ob3ZlcigpXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCApXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIHdpdGggZXZlbnQgZGVsZWdhdGlvbiFcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0LCBzZWxlY3RvciApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCwgc2VsZWN0b3IgKVxuICpcbiAqIC8vIHVzaW5nIGEgYmFzaWMgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIC5ob3ZlckludGVudCggY29uZmlnIClcbiAqXG4gKiBAcGFyYW0gIGhhbmRsZXJJbiAgIGZ1bmN0aW9uIE9SIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0gIGhhbmRsZXJPdXQgIGZ1bmN0aW9uIE9SIHNlbGVjdG9yIGZvciBkZWxlZ2F0aW9uIE9SIHVuZGVmaW5lZFxuICogQHBhcmFtICBzZWxlY3RvciAgICBzZWxlY3RvciBPUiB1bmRlZmluZWRcbiAqIEBhdXRob3IgQnJpYW4gQ2hlcm5lIDxicmlhbihhdCljaGVybmUoZG90KW5ldD5cbiAqL1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAkLmZuLmhvdmVySW50ZW50ID0gZnVuY3Rpb24oaGFuZGxlckluLGhhbmRsZXJPdXQsc2VsZWN0b3IpIHtcblxuICAgICAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gdmFsdWVzXG4gICAgICAgIHZhciBjZmcgPSB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgc2Vuc2l0aXZpdHk6IDYsXG4gICAgICAgICAgICB0aW1lb3V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgaGFuZGxlckluID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCBoYW5kbGVySW4gKTtcbiAgICAgICAgfSBlbHNlIGlmICgkLmlzRnVuY3Rpb24oaGFuZGxlck91dCkpIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlck91dCwgc2VsZWN0b3I6IHNlbGVjdG9yIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlckluLCBzZWxlY3RvcjogaGFuZGxlck91dCB9ICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnN0YW50aWF0ZSB2YXJpYWJsZXNcbiAgICAgICAgLy8gY1gsIGNZID0gY3VycmVudCBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCB1cGRhdGVkIGJ5IG1vdXNlbW92ZSBldmVudFxuICAgICAgICAvLyBwWCwgcFkgPSBwcmV2aW91cyBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCBzZXQgYnkgbW91c2VvdmVyIGFuZCBwb2xsaW5nIGludGVydmFsXG4gICAgICAgIHZhciBjWCwgY1ksIHBYLCBwWTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGdldHRpbmcgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIHRyYWNrID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGNYID0gZXYucGFnZVg7XG4gICAgICAgICAgICBjWSA9IGV2LnBhZ2VZO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgY29tcGFyaW5nIGN1cnJlbnQgYW5kIHByZXZpb3VzIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciBjb21wYXJlID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICAvLyBjb21wYXJlIG1vdXNlIHBvc2l0aW9ucyB0byBzZWUgaWYgdGhleSd2ZSBjcm9zc2VkIHRoZSB0aHJlc2hvbGRcbiAgICAgICAgICAgIGlmICggTWF0aC5zcXJ0KCAocFgtY1gpKihwWC1jWCkgKyAocFktY1kpKihwWS1jWSkgKSA8IGNmZy5zZW5zaXRpdml0eSApIHtcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGhvdmVySW50ZW50IHN0YXRlIHRvIHRydWUgKHNvIG1vdXNlT3V0IGNhbiBiZSBjYWxsZWQpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNmZy5vdmVyLmFwcGx5KG9iLFtldl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgcHJldmlvdXMgY29vcmRpbmF0ZXMgZm9yIG5leHQgdGltZVxuICAgICAgICAgICAgICAgIHBYID0gY1g7IHBZID0gY1k7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHNlbGYtY2FsbGluZyB0aW1lb3V0LCBndWFyYW50ZWVzIGludGVydmFscyBhcmUgc3BhY2VkIG91dCBwcm9wZXJseSAoYXZvaWRzIEphdmFTY3JpcHQgdGltZXIgYnVncylcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LCBvYik7fSAsIGNmZy5pbnRlcnZhbCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZGVsYXlpbmcgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uXG4gICAgICAgIHZhciBkZWxheSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGNmZy5vdXQuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBtb3VzZSAnaG92ZXJpbmcnXG4gICAgICAgIHZhciBoYW5kbGVIb3ZlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIC8vIGNvcHkgb2JqZWN0cyB0byBiZSBwYXNzZWQgaW50byB0IChyZXF1aXJlZCBmb3IgZXZlbnQgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbiBJRSlcbiAgICAgICAgICAgIHZhciBldiA9ICQuZXh0ZW5kKHt9LGUpO1xuICAgICAgICAgICAgdmFyIG9iID0gdGhpcztcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGhvdmVySW50ZW50IHRpbWVyIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3QpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTsgfVxuXG4gICAgICAgICAgICAvLyBpZiBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIikge1xuICAgICAgICAgICAgICAgIC8vIHNldCBcInByZXZpb3VzXCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBpbml0aWFsIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgICAgcFggPSBldi5wYWdlWDsgcFkgPSBldi5wYWdlWTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgXCJjdXJyZW50XCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBtb3VzZW1vdmVcbiAgICAgICAgICAgICAgICAkKG9iKS5vbihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBwb2xsaW5nIGludGVydmFsIChzZWxmLWNhbGxpbmcgdGltZW91dCkgdG8gY29tcGFyZSBtb3VzZSBjb29yZGluYXRlcyBvdmVyIHRpbWVcbiAgICAgICAgICAgICAgICBpZiAoIW9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldixvYik7fSAsIGNmZy5pbnRlcnZhbCApO31cblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZS50eXBlID09IFwibW91c2VsZWF2ZVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVuYmluZCBleHBlbnNpdmUgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIGlmIGhvdmVySW50ZW50IHN0YXRlIGlzIHRydWUsIHRoZW4gY2FsbCB0aGUgbW91c2VPdXQgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheVxuICAgICAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2RlbGF5KGV2LG9iKTt9ICwgY2ZnLnRpbWVvdXQgKTt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBtb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlXG4gICAgICAgIHJldHVybiB0aGlzLm9uKHsnbW91c2VlbnRlci5ob3ZlckludGVudCc6aGFuZGxlSG92ZXIsJ21vdXNlbGVhdmUuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyfSwgY2ZnLnNlbGVjdG9yKTtcbiAgICB9O1xufSkoalF1ZXJ5KTtcbiIsIi8qIVxuICogaW1hZ2VzTG9hZGVkIFBBQ0tBR0VEIHYzLjEuOFxuICogSmF2YVNjcmlwdCBpcyBhbGwgbGlrZSBcIllvdSBpbWFnZXMgYXJlIGRvbmUgeWV0IG9yIHdoYXQ/XCJcbiAqIE1JVCBMaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31mdW5jdGlvbiB0KGUsdCl7Zm9yKHZhciBuPWUubGVuZ3RoO24tLTspaWYoZVtuXS5saXN0ZW5lcj09PXQpcmV0dXJuIG47cmV0dXJuLTF9ZnVuY3Rpb24gbihlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tlXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXZhciBpPWUucHJvdG90eXBlLHI9dGhpcyxvPXIuRXZlbnRFbWl0dGVyO2kuZ2V0TGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG4saT10aGlzLl9nZXRFdmVudHMoKTtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dD17fTtmb3IobiBpbiBpKWkuaGFzT3duUHJvcGVydHkobikmJmUudGVzdChuKSYmKHRbbl09aVtuXSl9ZWxzZSB0PWlbZV18fChpW2VdPVtdKTtyZXR1cm4gdH0saS5mbGF0dGVuTGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG49W107Zm9yKHQ9MDtlLmxlbmd0aD50O3QrPTEpbi5wdXNoKGVbdF0ubGlzdGVuZXIpO3JldHVybiBufSxpLmdldExpc3RlbmVyc0FzT2JqZWN0PWZ1bmN0aW9uKGUpe3ZhciB0LG49dGhpcy5nZXRMaXN0ZW5lcnMoZSk7cmV0dXJuIG4gaW5zdGFuY2VvZiBBcnJheSYmKHQ9e30sdFtlXT1uKSx0fHxufSxpLmFkZExpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscj10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpLG89XCJvYmplY3RcIj09dHlwZW9mIG47Zm9yKGkgaW4gcilyLmhhc093blByb3BlcnR5KGkpJiYtMT09PXQocltpXSxuKSYmcltpXS5wdXNoKG8/bjp7bGlzdGVuZXI6bixvbmNlOiExfSk7cmV0dXJuIHRoaXN9LGkub249bihcImFkZExpc3RlbmVyXCIpLGkuYWRkT25jZUxpc3RlbmVyPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZSx7bGlzdGVuZXI6dCxvbmNlOiEwfSl9LGkub25jZT1uKFwiYWRkT25jZUxpc3RlbmVyXCIpLGkuZGVmaW5lRXZlbnQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZ2V0TGlzdGVuZXJzKGUpLHRoaXN9LGkuZGVmaW5lRXZlbnRzPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0wO2UubGVuZ3RoPnQ7dCs9MSl0aGlzLmRlZmluZUV2ZW50KGVbdF0pO3JldHVybiB0aGlzfSxpLnJlbW92ZUxpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscixvPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gbylvLmhhc093blByb3BlcnR5KHIpJiYoaT10KG9bcl0sbiksLTEhPT1pJiZvW3JdLnNwbGljZShpLDEpKTtyZXR1cm4gdGhpc30saS5vZmY9bihcInJlbW92ZUxpc3RlbmVyXCIpLGkuYWRkTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMSxlLHQpfSxpLnJlbW92ZUxpc3RlbmVycz1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITAsZSx0KX0saS5tYW5pcHVsYXRlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxyLG89ZT90aGlzLnJlbW92ZUxpc3RlbmVyOnRoaXMuYWRkTGlzdGVuZXIscz1lP3RoaXMucmVtb3ZlTGlzdGVuZXJzOnRoaXMuYWRkTGlzdGVuZXJzO2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0fHx0IGluc3RhbmNlb2YgUmVnRXhwKWZvcihpPW4ubGVuZ3RoO2ktLTspby5jYWxsKHRoaXMsdCxuW2ldKTtlbHNlIGZvcihpIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShpKSYmKHI9dFtpXSkmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiByP28uY2FsbCh0aGlzLGkscik6cy5jYWxsKHRoaXMsaSxyKSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIHQsbj10eXBlb2YgZSxpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwic3RyaW5nXCI9PT1uKWRlbGV0ZSBpW2VdO2Vsc2UgaWYoXCJvYmplY3RcIj09PW4pZm9yKHQgaW4gaSlpLmhhc093blByb3BlcnR5KHQpJiZlLnRlc3QodCkmJmRlbGV0ZSBpW3RdO2Vsc2UgZGVsZXRlIHRoaXMuX2V2ZW50cztyZXR1cm4gdGhpc30saS5yZW1vdmVBbGxMaXN0ZW5lcnM9bihcInJlbW92ZUV2ZW50XCIpLGkuZW1pdEV2ZW50PWZ1bmN0aW9uKGUsdCl7dmFyIG4saSxyLG8scz10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpO2ZvcihyIGluIHMpaWYocy5oYXNPd25Qcm9wZXJ0eShyKSlmb3IoaT1zW3JdLmxlbmd0aDtpLS07KW49c1tyXVtpXSxuLm9uY2U9PT0hMCYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpLG89bi5saXN0ZW5lci5hcHBseSh0aGlzLHR8fFtdKSxvPT09dGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkmJnRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuLmxpc3RlbmVyKTtyZXR1cm4gdGhpc30saS50cmlnZ2VyPW4oXCJlbWl0RXZlbnRcIiksaS5lbWl0PWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTtyZXR1cm4gdGhpcy5lbWl0RXZlbnQoZSx0KX0saS5zZXRPbmNlUmV0dXJuVmFsdWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZT1lLHRoaXN9LGkuX2dldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5KFwiX29uY2VSZXR1cm5WYWx1ZVwiKT90aGlzLl9vbmNlUmV0dXJuVmFsdWU6ITB9LGkuX2dldEV2ZW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ldmVudHN8fCh0aGlzLl9ldmVudHM9e30pfSxlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5FdmVudEVtaXR0ZXI9byxlfSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KTpcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lOnRoaXMuRXZlbnRFbWl0dGVyPWV9KS5jYWxsKHRoaXMpLGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7dmFyIG49ZS5ldmVudDtyZXR1cm4gbi50YXJnZXQ9bi50YXJnZXR8fG4uc3JjRWxlbWVudHx8dCxufXZhciBuPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxpPWZ1bmN0aW9uKCl7fTtuLmFkZEV2ZW50TGlzdGVuZXI/aT1mdW5jdGlvbihlLHQsbil7ZS5hZGRFdmVudExpc3RlbmVyKHQsbiwhMSl9Om4uYXR0YWNoRXZlbnQmJihpPWZ1bmN0aW9uKGUsbixpKXtlW24raV09aS5oYW5kbGVFdmVudD9mdW5jdGlvbigpe3ZhciBuPXQoZSk7aS5oYW5kbGVFdmVudC5jYWxsKGksbil9OmZ1bmN0aW9uKCl7dmFyIG49dChlKTtpLmNhbGwoZSxuKX0sZS5hdHRhY2hFdmVudChcIm9uXCIrbixlW24raV0pfSk7dmFyIHI9ZnVuY3Rpb24oKXt9O24ucmVtb3ZlRXZlbnRMaXN0ZW5lcj9yPWZ1bmN0aW9uKGUsdCxuKXtlLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5kZXRhY2hFdmVudCYmKHI9ZnVuY3Rpb24oZSx0LG4pe2UuZGV0YWNoRXZlbnQoXCJvblwiK3QsZVt0K25dKTt0cnl7ZGVsZXRlIGVbdCtuXX1jYXRjaChpKXtlW3Qrbl09dm9pZCAwfX0pO3ZhciBvPXtiaW5kOmksdW5iaW5kOnJ9O1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudGllL2V2ZW50aWVcIixvKTplLmV2ZW50aWU9b30odGhpcyksZnVuY3Rpb24oZSx0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXJcIixcImV2ZW50aWUvZXZlbnRpZVwiXSxmdW5jdGlvbihuLGkpe3JldHVybiB0KGUsbixpKX0pOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPXQoZSxyZXF1aXJlKFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIikscmVxdWlyZShcImV2ZW50aWVcIikpOmUuaW1hZ2VzTG9hZGVkPXQoZSxlLkV2ZW50RW1pdHRlcixlLmV2ZW50aWUpfSh3aW5kb3csZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGkoZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9ZnVuY3Rpb24gcihlKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1kLmNhbGwoZSl9ZnVuY3Rpb24gbyhlKXt2YXIgdD1bXTtpZihyKGUpKXQ9ZTtlbHNlIGlmKFwibnVtYmVyXCI9PXR5cGVvZiBlLmxlbmd0aClmb3IodmFyIG49MCxpPWUubGVuZ3RoO2k+bjtuKyspdC5wdXNoKGVbbl0pO2Vsc2UgdC5wdXNoKGUpO3JldHVybiB0fWZ1bmN0aW9uIHMoZSx0LG4pe2lmKCEodGhpcyBpbnN0YW5jZW9mIHMpKXJldHVybiBuZXcgcyhlLHQpO1wic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpKSx0aGlzLmVsZW1lbnRzPW8oZSksdGhpcy5vcHRpb25zPWkoe30sdGhpcy5vcHRpb25zKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0P249dDppKHRoaXMub3B0aW9ucyx0KSxuJiZ0aGlzLm9uKFwiYWx3YXlzXCIsbiksdGhpcy5nZXRJbWFnZXMoKSxhJiYodGhpcy5qcURlZmVycmVkPW5ldyBhLkRlZmVycmVkKTt2YXIgcj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyLmNoZWNrKCl9KX1mdW5jdGlvbiBmKGUpe3RoaXMuaW1nPWV9ZnVuY3Rpb24gYyhlKXt0aGlzLnNyYz1lLHZbZV09dGhpc312YXIgYT1lLmpRdWVyeSx1PWUuY29uc29sZSxoPXUhPT12b2lkIDAsZD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO3MucHJvdG90eXBlPW5ldyB0LHMucHJvdG90eXBlLm9wdGlvbnM9e30scy5wcm90b3R5cGUuZ2V0SW1hZ2VzPWZ1bmN0aW9uKCl7dGhpcy5pbWFnZXM9W107Zm9yKHZhciBlPTAsdD10aGlzLmVsZW1lbnRzLmxlbmd0aDt0PmU7ZSsrKXt2YXIgbj10aGlzLmVsZW1lbnRzW2VdO1wiSU1HXCI9PT1uLm5vZGVOYW1lJiZ0aGlzLmFkZEltYWdlKG4pO3ZhciBpPW4ubm9kZVR5cGU7aWYoaSYmKDE9PT1pfHw5PT09aXx8MTE9PT1pKSlmb3IodmFyIHI9bi5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpLG89MCxzPXIubGVuZ3RoO3M+bztvKyspe3ZhciBmPXJbb107dGhpcy5hZGRJbWFnZShmKX19fSxzLnByb3RvdHlwZS5hZGRJbWFnZT1mdW5jdGlvbihlKXt2YXIgdD1uZXcgZihlKTt0aGlzLmltYWdlcy5wdXNoKHQpfSxzLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSxyKXtyZXR1cm4gdC5vcHRpb25zLmRlYnVnJiZoJiZ1LmxvZyhcImNvbmZpcm1cIixlLHIpLHQucHJvZ3Jlc3MoZSksbisrLG49PT1pJiZ0LmNvbXBsZXRlKCksITB9dmFyIHQ9dGhpcyxuPTAsaT10aGlzLmltYWdlcy5sZW5ndGg7aWYodGhpcy5oYXNBbnlCcm9rZW49ITEsIWkpcmV0dXJuIHRoaXMuY29tcGxldGUoKSx2b2lkIDA7Zm9yKHZhciByPTA7aT5yO3IrKyl7dmFyIG89dGhpcy5pbWFnZXNbcl07by5vbihcImNvbmZpcm1cIixlKSxvLmNoZWNrKCl9fSxzLnByb3RvdHlwZS5wcm9ncmVzcz1mdW5jdGlvbihlKXt0aGlzLmhhc0FueUJyb2tlbj10aGlzLmhhc0FueUJyb2tlbnx8IWUuaXNMb2FkZWQ7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5lbWl0KFwicHJvZ3Jlc3NcIix0LGUpLHQuanFEZWZlcnJlZCYmdC5qcURlZmVycmVkLm5vdGlmeSYmdC5qcURlZmVycmVkLm5vdGlmeSh0LGUpfSl9LHMucHJvdG90eXBlLmNvbXBsZXRlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5oYXNBbnlCcm9rZW4/XCJmYWlsXCI6XCJkb25lXCI7dGhpcy5pc0NvbXBsZXRlPSEwO3ZhciB0PXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe2lmKHQuZW1pdChlLHQpLHQuZW1pdChcImFsd2F5c1wiLHQpLHQuanFEZWZlcnJlZCl7dmFyIG49dC5oYXNBbnlCcm9rZW4/XCJyZWplY3RcIjpcInJlc29sdmVcIjt0LmpxRGVmZXJyZWRbbl0odCl9fSl9LGEmJihhLmZuLmltYWdlc0xvYWRlZD1mdW5jdGlvbihlLHQpe3ZhciBuPW5ldyBzKHRoaXMsZSx0KTtyZXR1cm4gbi5qcURlZmVycmVkLnByb21pc2UoYSh0aGlzKSl9KSxmLnByb3RvdHlwZT1uZXcgdCxmLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe3ZhciBlPXZbdGhpcy5pbWcuc3JjXXx8bmV3IGModGhpcy5pbWcuc3JjKTtpZihlLmlzQ29uZmlybWVkKXJldHVybiB0aGlzLmNvbmZpcm0oZS5pc0xvYWRlZCxcImNhY2hlZCB3YXMgY29uZmlybWVkXCIpLHZvaWQgMDtpZih0aGlzLmltZy5jb21wbGV0ZSYmdm9pZCAwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoKXJldHVybiB0aGlzLmNvbmZpcm0oMCE9PXRoaXMuaW1nLm5hdHVyYWxXaWR0aCxcIm5hdHVyYWxXaWR0aFwiKSx2b2lkIDA7dmFyIHQ9dGhpcztlLm9uKFwiY29uZmlybVwiLGZ1bmN0aW9uKGUsbil7cmV0dXJuIHQuY29uZmlybShlLmlzTG9hZGVkLG4pLCEwfSksZS5jaGVjaygpfSxmLnByb3RvdHlwZS5jb25maXJtPWZ1bmN0aW9uKGUsdCl7dGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfTt2YXIgdj17fTtyZXR1cm4gYy5wcm90b3R5cGU9bmV3IHQsYy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtpZighdGhpcy5pc0NoZWNrZWQpe3ZhciBlPW5ldyBJbWFnZTtuLmJpbmQoZSxcImxvYWRcIix0aGlzKSxuLmJpbmQoZSxcImVycm9yXCIsdGhpcyksZS5zcmM9dGhpcy5zcmMsdGhpcy5pc0NoZWNrZWQ9ITB9fSxjLnByb3RvdHlwZS5oYW5kbGVFdmVudD1mdW5jdGlvbihlKXt2YXIgdD1cIm9uXCIrZS50eXBlO3RoaXNbdF0mJnRoaXNbdF0oZSl9LGMucHJvdG90eXBlLm9ubG9hZD1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITAsXCJvbmxvYWRcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUub25lcnJvcj1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITEsXCJvbmVycm9yXCIpLHRoaXMudW5iaW5kUHJveHlFdmVudHMoZSl9LGMucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzQ29uZmlybWVkPSEwLHRoaXMuaXNMb2FkZWQ9ZSx0aGlzLmVtaXQoXCJjb25maXJtXCIsdGhpcyx0KX0sYy5wcm90b3R5cGUudW5iaW5kUHJveHlFdmVudHM9ZnVuY3Rpb24oZSl7bi51bmJpbmQoZS50YXJnZXQsXCJsb2FkXCIsdGhpcyksbi51bmJpbmQoZS50YXJnZXQsXCJlcnJvclwiLHRoaXMpfSxzfSk7IiwiLyoqXHJcbioganF1ZXJ5Lm1hdGNoSGVpZ2h0LmpzIG1hc3RlclxyXG4qIGh0dHA6Ly9icm0uaW8vanF1ZXJ5LW1hdGNoLWhlaWdodC9cclxuKiBMaWNlbnNlOiBNSVRcclxuKi9cclxuXHJcbjsoZnVuY3Rpb24oJCkge1xyXG4gICAgLypcclxuICAgICogIGludGVybmFsXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcHJldmlvdXNSZXNpemVXaWR0aCA9IC0xLFxyXG4gICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XHJcblxyXG4gICAgLypcclxuICAgICogIF9wYXJzZVxyXG4gICAgKiAgdmFsdWUgcGFyc2UgdXRpbGl0eSBmdW5jdGlvblxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3BhcnNlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAvLyBwYXJzZSB2YWx1ZSBhbmQgY29udmVydCBOYU4gdG8gMFxyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3Jvd3NcclxuICAgICogIHV0aWxpdHkgZnVuY3Rpb24gcmV0dXJucyBhcnJheSBvZiBqUXVlcnkgc2VsZWN0aW9ucyByZXByZXNlbnRpbmcgZWFjaCByb3dcclxuICAgICogIChhcyBkaXNwbGF5ZWQgYWZ0ZXIgZmxvYXQgd3JhcHBpbmcgYXBwbGllZCBieSBicm93c2VyKVxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3Jvd3MgPSBmdW5jdGlvbihlbGVtZW50cykge1xyXG4gICAgICAgIHZhciB0b2xlcmFuY2UgPSAxLFxyXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcclxuICAgICAgICAgICAgbGFzdFRvcCA9IG51bGwsXHJcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gZ3JvdXAgZWxlbWVudHMgYnkgdGhlaXIgdG9wIHBvc2l0aW9uXHJcbiAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRvcCA9ICR0aGF0Lm9mZnNldCgpLnRvcCAtIF9wYXJzZSgkdGhhdC5jc3MoJ21hcmdpbi10b3AnKSksXHJcbiAgICAgICAgICAgICAgICBsYXN0Um93ID0gcm93cy5sZW5ndGggPiAwID8gcm93c1tyb3dzLmxlbmd0aCAtIDFdIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXN0Um93ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBpdGVtIG9uIHRoZSByb3csIHNvIGp1c3QgcHVzaCBpdFxyXG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb3cgdG9wIGlzIHRoZSBzYW1lLCBhZGQgdG8gdGhlIHJvdyBncm91cFxyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5hYnMobGFzdFRvcCAtIHRvcCkpIDw9IHRvbGVyYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXSA9IGxhc3RSb3cuYWRkKCR0aGF0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0YXJ0IGEgbmV3IHJvdyBncm91cFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGxhc3Qgcm93IHRvcFxyXG4gICAgICAgICAgICBsYXN0VG9wID0gdG9wO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm93cztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIF9wYXJzZU9wdGlvbnNcclxuICAgICogIGhhbmRsZSBwbHVnaW4gb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3BhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgYnlSb3c6IHRydWUsXHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcclxuICAgICAgICAgICAgdGFyZ2V0OiBudWxsLFxyXG4gICAgICAgICAgICByZW1vdmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQob3B0cywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBvcHRzLmJ5Um93ID0gb3B0aW9ucztcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgICAgICAgIG9wdHMucmVtb3ZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvcHRzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHRcclxuICAgICogIHBsdWdpbiBkZWZpbml0aW9uXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBtYXRjaEhlaWdodCA9ICQuZm4ubWF0Y2hIZWlnaHQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgcmVtb3ZlXHJcbiAgICAgICAgaWYgKG9wdHMucmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmaXhlZCBoZWlnaHQgZnJvbSBhbGwgc2VsZWN0ZWQgZWxlbWVudHNcclxuICAgICAgICAgICAgdGhpcy5jc3Mob3B0cy5wcm9wZXJ0eSwgJycpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGVkIGVsZW1lbnRzIGZyb20gYWxsIGdyb3Vwc1xyXG4gICAgICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oa2V5LCBncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZWxlbWVudHMgPSBncm91cC5lbGVtZW50cy5ub3QodGhhdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW51cCBlbXB0eSBncm91cHNcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IDEgJiYgIW9wdHMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGlzIGdyb3VwIHNvIHdlIGNhbiByZS1hcHBseSBsYXRlciBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2dyb3Vwcy5wdXNoKHtcclxuICAgICAgICAgICAgZWxlbWVudHM6IHRoaXMsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdHNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbWF0Y2ggZWFjaCBlbGVtZW50J3MgaGVpZ2h0IHRvIHRoZSB0YWxsZXN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvblxyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLCBvcHRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBwbHVnaW4gZ2xvYmFsIG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX2dyb3VwcyA9IFtdO1xyXG4gICAgbWF0Y2hIZWlnaHQuX3Rocm90dGxlID0gODA7XHJcbiAgICBtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSBmYWxzZTtcclxuICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUgPSBudWxsO1xyXG4gICAgbWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5XHJcbiAgICAqICBhcHBseSBtYXRjaEhlaWdodCB0byBnaXZlbiBlbGVtZW50c1xyXG4gICAgKi9cclxuXHJcbiAgICBtYXRjaEhlaWdodC5fYXBwbHkgPSBmdW5jdGlvbihlbGVtZW50cywgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKSxcclxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXHJcbiAgICAgICAgICAgIHJvd3MgPSBbJGVsZW1lbnRzXTtcclxuXHJcbiAgICAgICAgLy8gdGFrZSBub3RlIG9mIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcbiAgICAgICAgICAgIGh0bWxIZWlnaHQgPSAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIGdldCBoaWRkZW4gcGFyZW50c1xyXG4gICAgICAgIHZhciAkaGlkZGVuUGFyZW50cyA9ICRlbGVtZW50cy5wYXJlbnRzKCkuZmlsdGVyKCc6aGlkZGVuJyk7XHJcblxyXG4gICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB0ZW1wb3JhcmlseSBtdXN0IGZvcmNlIGhpZGRlbiBwYXJlbnRzIHZpc2libGVcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHJvd3MgaWYgdXNpbmcgYnlSb3csIG90aGVyd2lzZSBhc3N1bWUgb25lIHJvd1xyXG4gICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICFvcHRzLnRhcmdldCkge1xyXG5cclxuICAgICAgICAgICAgLy8gbXVzdCBmaXJzdCBmb3JjZSBhbiBhcmJpdHJhcnkgZXF1YWwgaGVpZ2h0IHNvIGZsb2F0aW5nIGVsZW1lbnRzIGJyZWFrIGV2ZW5seVxyXG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpID09PSAnaW5saW5lLWJsb2NrJyA/ICdpbmxpbmUtYmxvY2snIDogJ2Jsb2NrJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiBkaXNwbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci10b3Atd2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1ib3R0b20td2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDBweCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYXJyYXkgb2Ygcm93cyAoYmFzZWQgb24gZWxlbWVudCB0b3AgcG9zaXRpb24pXHJcbiAgICAgICAgICAgIHJvd3MgPSBfcm93cygkZWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmV2ZXJ0IG9yaWdpbmFsIGlubGluZSBzdHlsZXNcclxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8ICcnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmVhY2gocm93cywgZnVuY3Rpb24oa2V5LCByb3cpIHtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHJvdyksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHRzLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBhcHBseSB0byByb3dzIHdpdGggb25seSBvbmUgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgJHJvdy5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb3cuY3NzKG9wdHMucHJvcGVydHksICcnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBmaW5kIHRoZSBtYXggaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5JykgPT09ICdpbmxpbmUtYmxvY2snID8gJ2lubGluZS1ibG9jaycgOiAnYmxvY2snO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgd2UgZ2V0IHRoZSBjb3JyZWN0IGFjdHVhbCBoZWlnaHQgKGFuZCBub3QgYSBwcmV2aW91c2x5IHNldCBoZWlnaHQgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNzcyA9IHsgJ2Rpc3BsYXknOiBkaXNwbGF5IH07XHJcbiAgICAgICAgICAgICAgICAgICAgY3NzW29wdHMucHJvcGVydHldID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKGNzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIG1heCBoZWlnaHQgKGluY2x1ZGluZyBwYWRkaW5nLCBidXQgbm90IG1hcmdpbilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpID4gdGFyZ2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9ICR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVydCBkaXNwbGF5IGJsb2NrXHJcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKCdkaXNwbGF5JywgJycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgc2V0LCB1c2UgdGhlIGhlaWdodCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IG9wdHMudGFyZ2V0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBhcHBseSB0aGUgaGVpZ2h0IHRvIGFsbCBlbGVtZW50c1xyXG4gICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhcHBseSB0byBhIHRhcmdldFxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudGFyZ2V0ICYmICR0aGF0LmlzKG9wdHMudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgcGFkZGluZyBhbmQgYm9yZGVyIGNvcnJlY3RseSAocmVxdWlyZWQgd2hlbiBub3QgdXNpbmcgYm9yZGVyLWJveClcclxuICAgICAgICAgICAgICAgIGlmICgkdGhhdC5jc3MoJ2JveC1zaXppbmcnKSAhPT0gJ2JvcmRlci1ib3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci10b3Atd2lkdGgnKSkgKyBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItYm90dG9tLXdpZHRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLXRvcCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgaGVpZ2h0IChhY2NvdW50aW5nIGZvciBwYWRkaW5nIGFuZCBib3JkZXIpXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Mob3B0cy5wcm9wZXJ0eSwgdGFyZ2V0SGVpZ2h0IC0gdmVydGljYWxQYWRkaW5nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHJldmVydCBoaWRkZW4gcGFyZW50c1xyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmVzdG9yZSBzY3JvbGwgcG9zaXRpb24gaWYgZW5hYmxlZFxyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgoc2Nyb2xsVG9wIC8gaHRtbEhlaWdodCkgKiAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpXHJcbiAgICAqICBhcHBsaWVzIG1hdGNoSGVpZ2h0IHRvIGFsbCBlbGVtZW50cyB3aXRoIGEgZGF0YS1tYXRjaC1oZWlnaHQgYXR0cmlidXRlXHJcbiAgICAqL1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZ3JvdXBzID0ge307XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGdyb3VwcyBieSB0aGVpciBncm91cElkIHNldCBieSBlbGVtZW50cyB1c2luZyBkYXRhLW1hdGNoLWhlaWdodFxyXG4gICAgICAgICQoJ1tkYXRhLW1hdGNoLWhlaWdodF0sIFtkYXRhLW1oXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBncm91cElkID0gJHRoaXMuYXR0cignZGF0YS1taCcpIHx8ICR0aGlzLmF0dHIoJ2RhdGEtbWF0Y2gtaGVpZ2h0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCBpbiBncm91cHMpIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9IGdyb3Vwc1tncm91cElkXS5hZGQoJHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gJHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZWFjaCBncm91cFxyXG4gICAgICAgICQuZWFjaChncm91cHMsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1hdGNoSGVpZ2h0KHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX3VwZGF0ZVxyXG4gICAgKiAgdXBkYXRlcyBtYXRjaEhlaWdodCBvbiBhbGwgY3VycmVudCBncm91cHMgd2l0aCB0aGVpciBjb3JyZWN0IG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgdmFyIF91cGRhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcy5lbGVtZW50cywgdGhpcy5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSA9IGZ1bmN0aW9uKHRocm90dGxlLCBldmVudCkge1xyXG4gICAgICAgIC8vIHByZXZlbnQgdXBkYXRlIGlmIGZpcmVkIGZyb20gYSByZXNpemUgZXZlbnRcclxuICAgICAgICAvLyB3aGVyZSB0aGUgdmlld3BvcnQgd2lkdGggaGFzbid0IGFjdHVhbGx5IGNoYW5nZWRcclxuICAgICAgICAvLyBmaXhlcyBhbiBldmVudCBsb29waW5nIGJ1ZyBpbiBJRThcclxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ3Jlc2l6ZScpIHtcclxuICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dXaWR0aCA9PT0gX3ByZXZpb3VzUmVzaXplV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfcHJldmlvdXNSZXNpemVXaWR0aCA9IHdpbmRvd1dpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhyb3R0bGUgdXBkYXRlc1xyXG4gICAgICAgIGlmICghdGhyb3R0bGUpIHtcclxuICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfdXBkYXRlVGltZW91dCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xyXG4gICAgICAgICAgICB9LCBtYXRjaEhlaWdodC5fdGhyb3R0bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIGJpbmQgZXZlbnRzXHJcbiAgICAqL1xyXG5cclxuICAgIC8vIGFwcGx5IG9uIERPTSByZWFkeSBldmVudFxyXG4gICAgJChtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgaGVpZ2h0cyBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAkKHdpbmRvdykuYmluZCgnbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZShmYWxzZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdGhyb3R0bGVkIHVwZGF0ZSBoZWlnaHRzIG9uIHJlc2l6ZSBldmVudHNcclxuICAgICQod2luZG93KS5iaW5kKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUodHJ1ZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcblxyXG59KShqUXVlcnkpO1xyXG4iLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuTUlYVCBKUyBQTFVHSU5TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4ndXNlIHN0cmljdCc7IC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXHJcblxyXG4vLyBSZXNpemUgSWZyYW1lcyBQcm9wb3J0aW9uYWxseVxyXG5mdW5jdGlvbiBpZnJhbWVBc3BlY3Qoc2VsZWN0b3IpIHtcclxuXHRzZWxlY3RvciA9IHNlbGVjdG9yIHx8IGpRdWVyeSgnaWZyYW1lJyk7XHJcblxyXG5cdHNlbGVjdG9yLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0LyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG5cdFx0dmFyIGlmcmFtZSA9IGpRdWVyeSh0aGlzKSxcclxuXHRcdFx0d2lkdGggID0gaWZyYW1lLndpZHRoKCk7XHJcblx0XHRpZiAoIHR5cGVvZihpZnJhbWUuZGF0YSgncmF0aW8nKSkgPT0gJ3VuZGVmaW5lZCcgKSB7XHJcblx0XHRcdHZhciBhdHRyVyA9IHRoaXMud2lkdGgsXHJcblx0XHRcdFx0YXR0ckggPSB0aGlzLmhlaWdodDtcclxuXHRcdFx0aWZyYW1lLmRhdGEoJ3JhdGlvJywgYXR0ckggLyBhdHRyVyApLnJlbW92ZUF0dHIoJ3dpZHRoJykucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XHJcblx0XHR9XHJcblx0XHRpZnJhbWUuaGVpZ2h0KCB3aWR0aCAqIGlmcmFtZS5kYXRhKCdyYXRpbycpICk7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIExpZ2h0ZW4gLyBEYXJrZW4gQ29sb3IgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XHJcbmZ1bmN0aW9uIHNoYWRlQ29sb3IoY29sb3IsIHBlcmNlbnQpIHsgICBcclxuXHR2YXIgZj1wYXJzZUludChjb2xvci5zbGljZSgxKSwxNiksdD1wZXJjZW50PDA/MDoyNTUscD1wZXJjZW50PDA/cGVyY2VudCotMTpwZXJjZW50LFI9Zj4+MTYsRz1mPj44JjB4MDBGRixCPWYmMHgwMDAwRkY7XHJcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKCh0LVIpKnApK1IpKjB4MTAwMDArKE1hdGgucm91bmQoKHQtRykqcCkrRykqMHgxMDArKE1hdGgucm91bmQoKHQtQikqcCkrQikpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxufVxyXG5cclxuLy8gQmxlbmQgQ29sb3JzIC0gQ3JlZGl0IFwiUGltcCBUcml6a2l0XCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNjkzOTI3L3BpbXAtdHJpemtpdFxyXG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcclxuXHR2YXIgZj1wYXJzZUludChjMC5zbGljZSgxKSwxNiksdD1wYXJzZUludChjMS5zbGljZSgxKSwxNiksUjE9Zj4+MTYsRzE9Zj4+OCYweDAwRkYsQjE9ZiYweDAwMDBGRixSMj10Pj4xNixHMj10Pj44JjB4MDBGRixCMj10JjB4MDAwMEZGO1xyXG5cdHJldHVybiAnIycrKDB4MTAwMDAwMCsoTWF0aC5yb3VuZCgoUjItUjEpKnApK1IxKSoweDEwMDAwKyhNYXRoLnJvdW5kKChHMi1HMSkqcCkrRzEpKjB4MTAwKyhNYXRoLnJvdW5kKChCMi1CMSkqcCkrQjEpKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8vIENvbG9yIExpZ2h0IE9yIERhcmsgLSBDcmVkaXQgXCJMYXJyeSBGb3hcIiAtIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2xhcnJ5Zm94LzE2MzYzMzhcclxuZnVuY3Rpb24gY29sb3JMb0QoY29sb3IpIHtcclxuXHR2YXIgcixiLGcsaHNwLGEgPSBjb2xvcjtcclxuXHRpZiAoYS5tYXRjaCgvXnJnYi8pKSB7XHJcblx0XHRhID0gYS5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKSg/OixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pKT9cXCkkLyk7XHJcblx0XHRyID0gYVsxXTtcclxuXHRcdGIgPSBhWzJdO1xyXG5cdFx0ZyA9IGFbM107XHJcblx0fSBlbHNlIHtcclxuXHRcdGEgPSArKCcweCcgKyBhLnNsaWNlKDEpLnJlcGxhY2UoYS5sZW5ndGggPCA1ICYmIC8uL2csICckJiQmJykpO1xyXG5cdFx0ciA9IGEgPj4gMTY7XHJcblx0XHRiID0gYSA+PiA4ICYgMjU1O1xyXG5cdFx0ZyA9IGEgJiAyNTU7XHJcblx0fVxyXG5cdGhzcCA9IE1hdGguc3FydChcclxuXHRcdDAuMjk5ICogKHIgKiByKSArXHJcblx0XHQwLjU4NyAqIChnICogZykgK1xyXG5cdFx0MC4xMTQgKiAoYiAqIGIpXHJcblx0KTtcclxuXHRpZiAoaHNwPjEyNy41KSB7XHJcblx0XHRyZXR1cm4gJ2xpZ2h0JztcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICdkYXJrJztcclxuXHR9XHJcbn0gXHJcblxyXG4vLyBJbWFnZSBMaWdodCBPciBEYXJrIEltYWdlIC0gQ3JlZGl0IFwiSm9zZXBoIFBvcnRlbGxpXCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTQ5NjM2L2pvc2VwaC1wb3J0ZWxsaVxyXG5mdW5jdGlvbiBpbWFnZUxvRChpbWFnZVNyYywgY2FsbGJhY2spIHtcclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblx0aW1nLnNyYyA9IGltYWdlU3JjO1xyXG5cdGltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcclxuXHJcblx0dmFyIGNvbG9yU3VtID0gMDtcclxuXHJcblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRlIGNhbnZhc1xyXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMsMCwwKTtcclxuXHJcblx0XHR2YXIgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0dmFyIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcclxuXHRcdHZhciByLGcsYixhdmc7XHJcblxyXG5cdFx0Zm9yKHZhciB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHgrPTQpIHtcclxuXHRcdFx0ciA9IGRhdGFbeF07XHJcblx0XHRcdGcgPSBkYXRhW3grMV07XHJcblx0XHRcdGIgPSBkYXRhW3grMl07XHJcblxyXG5cdFx0XHRhdmcgPSBNYXRoLmZsb29yKChyK2crYikvMyk7XHJcblx0XHRcdGNvbG9yU3VtICs9IGF2ZztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAodGhpcy53aWR0aCp0aGlzLmhlaWdodCkpO1xyXG5cdFx0Y2FsbGJhY2soYnJpZ2h0bmVzcyk7XHJcblx0fTtcclxufVxyXG5cclxuLy8gUmVzaXplIEltYWdlIFRvIEZpbGwgQ29udGFpbmVyIFNpemVcclxuZnVuY3Rpb24gaW1hZ2VDb3Zlcihjb250LCB0eXBlLCBjb3JySCkge1xyXG5cdHR5cGUgPSB0eXBlIHx8ICdiZyc7XHJcblxyXG5cdGNvbnQuYWRkQ2xhc3MoJ2ltYWdlLWNvdmVyJyk7XHJcblxyXG5cdHZhciBpbWcsIGltZ1VybCwgaW1nV2lkdGggPSAwLCBpbWdIZWlnaHQgPSAwO1xyXG5cclxuXHRpZiAoIHR5cGUgPT0gJ2ltZycgKSB7XHJcblx0XHRpbWcgPSBjb250LmZpbmQoJy5iZy1pbWcnKTtcclxuXHRcdGltZ1dpZHRoICA9IGltZy53aWR0aCgpO1xyXG5cdFx0aW1nSGVpZ2h0ID0gaW1nLmhlaWdodCgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpbWdVcmwgPSBjb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLm1hdGNoKC9edXJsXFwoXCI/KC4rPylcIj9cXCkkLyk7XHJcblx0XHRpZiAoIGltZ1VybFsxXSApIHtcclxuXHRcdCAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdCAgICBpbWcuc3JjID0gaW1nVXJsWzFdO1xyXG5cdFx0ICAgIGltZ1dpZHRoICA9IGltZy53aWR0aDtcclxuXHRcdCAgICBpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCBpbWdXaWR0aCAhPT0gMCAmJiBpbWdIZWlnaHQgIT09IDAgKSB7XHJcblx0XHR2YXIgY29udFdpZHRoICA9IGNvbnQub3V0ZXJXaWR0aCgpLFxyXG5cdFx0XHRjb250SGVpZ2h0ID0gY29udC5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRoZWlnaHREaWZmID0gY29udFdpZHRoIC8gaW1nV2lkdGggKiBpbWdIZWlnaHQsXHJcblx0XHRcdG5ld1dpZHRoICAgPSAnYXV0bycsXHJcblx0XHRcdG5ld0hlaWdodCAgPSBjb250SGVpZ2h0ICsgY29yckggKyAncHgnO1xyXG5cclxuXHRcdFx0aWYgKCBoZWlnaHREaWZmID4gY29udEhlaWdodCApIHtcclxuXHRcdFx0XHRuZXdXaWR0aCAgPSAnMTAwJSc7XHJcblx0XHRcdFx0bmV3SGVpZ2h0ID0gJ2F1dG8nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICkge1xyXG5cdFx0XHRpbWcuY3NzKHsgd2lkdGg6IG5ld1dpZHRoLCBoZWlnaHQ6IG5ld0hlaWdodCB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnQuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBuZXdXaWR0aCArICcgJyArIG5ld0hlaWdodCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBEZXRlcm1pbmUgSWYgQW4gRWxlbWVudCBJcyBTY3JvbGxlZCBJbnRvIFZpZXdcclxuZnVuY3Rpb24gZWxlbVZpc2libGUoZWxlbSwgY29udCkge1xyXG5cdHZhciBjb250VG9wID0gY29udC5zY3JvbGxUb3AoKSxcclxuXHRcdGNvbnRCdG0gPSBjb250VG9wICsgY29udC5oZWlnaHQoKSxcclxuXHRcdGVsZW1Ub3AgPSBlbGVtLm9mZnNldCgpLnRvcCxcclxuXHRcdGVsZW1CdG0gPSBlbGVtVG9wICsgZWxlbS5oZWlnaHQoKTtcclxuXHJcblx0cmV0dXJuICgoZWxlbUJ0bSA8PSBjb250QnRtKSAmJiAoZWxlbVRvcCA+PSBjb250VG9wKSk7XHJcbn0iLCIvKiBNb2Rlcm5penIgMi44LjMgKEN1c3RvbSBCdWlsZCkgfCBNSVQgJiBCU0RcbiAqIEJ1aWxkOiBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZC8jLWJhY2tncm91bmRzaXplLXJnYmEtY3NzYW5pbWF0aW9ucy1nZW5lcmF0ZWRjb250ZW50LWNzc3RyYW5zaXRpb25zLWF1ZGlvLXZpZGVvLXN2Zy1zaGl2LWFkZHRlc3QtdGVzdHN0eWxlcy10ZXN0cHJvcC10ZXN0YWxscHJvcHMtZG9tcHJlZml4ZXMtY3NzX2JhY2tncm91bmRzaXplY292ZXItY3NzX3ZodW5pdC1jc3Nfdnd1bml0LWxvYWRcbiAqL1xuO3dpbmRvdy5Nb2Rlcm5penI9ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIHooYSl7aS5jc3NUZXh0PWF9ZnVuY3Rpb24gQShhLGIpe3JldHVybiB6KHByZWZpeGVzLmpvaW4oYStcIjtcIikrKGJ8fFwiXCIpKX1mdW5jdGlvbiBCKGEsYil7cmV0dXJuIHR5cGVvZiBhPT09Yn1mdW5jdGlvbiBDKGEsYil7cmV0dXJuISF+KFwiXCIrYSkuaW5kZXhPZihiKX1mdW5jdGlvbiBEKGEsYil7Zm9yKHZhciBkIGluIGEpe3ZhciBlPWFbZF07aWYoIUMoZSxcIi1cIikmJmlbZV0hPT1jKXJldHVybiBiPT1cInBmeFwiP2U6ITB9cmV0dXJuITF9ZnVuY3Rpb24gRShhLGIsZCl7Zm9yKHZhciBlIGluIGEpe3ZhciBmPWJbYVtlXV07aWYoZiE9PWMpcmV0dXJuIGQ9PT0hMT9hW2VdOkIoZixcImZ1bmN0aW9uXCIpP2YuYmluZChkfHxiKTpmfXJldHVybiExfWZ1bmN0aW9uIEYoYSxiLGMpe3ZhciBkPWEuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYS5zbGljZSgxKSxlPShhK1wiIFwiK24uam9pbihkK1wiIFwiKStkKS5zcGxpdChcIiBcIik7cmV0dXJuIEIoYixcInN0cmluZ1wiKXx8QihiLFwidW5kZWZpbmVkXCIpP0QoZSxiKTooZT0oYStcIiBcIitvLmpvaW4oZCtcIiBcIikrZCkuc3BsaXQoXCIgXCIpLEUoZSxiLGMpKX12YXIgZD1cIjIuOC4zXCIsZT17fSxmPWIuZG9jdW1lbnRFbGVtZW50LGc9XCJtb2Rlcm5penJcIixoPWIuY3JlYXRlRWxlbWVudChnKSxpPWguc3R5bGUsaixrPVwiOilcIixsPXt9LnRvU3RyaW5nLG09XCJXZWJraXQgTW96IE8gbXNcIixuPW0uc3BsaXQoXCIgXCIpLG89bS50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKSxwPXtzdmc6XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wifSxxPXt9LHI9e30scz17fSx0PVtdLHU9dC5zbGljZSx2LHc9ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGgsaSxqLGssbD1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksbT1iLmJvZHksbj1tfHxiLmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO2lmKHBhcnNlSW50KGQsMTApKXdoaWxlKGQtLSlqPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxqLmlkPWU/ZVtkXTpnKyhkKzEpLGwuYXBwZW5kQ2hpbGQoaik7cmV0dXJuIGg9W1wiJiMxNzM7XCIsJzxzdHlsZSBpZD1cInMnLGcsJ1wiPicsYSxcIjwvc3R5bGU+XCJdLmpvaW4oXCJcIiksbC5pZD1nLChtP2w6bikuaW5uZXJIVE1MKz1oLG4uYXBwZW5kQ2hpbGQobCksbXx8KG4uc3R5bGUuYmFja2dyb3VuZD1cIlwiLG4uc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixrPWYuc3R5bGUub3ZlcmZsb3csZi5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLGYuYXBwZW5kQ2hpbGQobikpLGk9YyhsLGEpLG0/bC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGwpOihuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobiksZi5zdHlsZS5vdmVyZmxvdz1rKSwhIWl9LHg9e30uaGFzT3duUHJvcGVydHkseTshQih4LFwidW5kZWZpbmVkXCIpJiYhQih4LmNhbGwsXCJ1bmRlZmluZWRcIik/eT1mdW5jdGlvbihhLGIpe3JldHVybiB4LmNhbGwoYSxiKX06eT1mdW5jdGlvbihhLGIpe3JldHVybiBiIGluIGEmJkIoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbYl0sXCJ1bmRlZmluZWRcIil9LEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kfHwoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztpZih0eXBlb2YgYyE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGQ9dS5jYWxsKGFyZ3VtZW50cywxKSxlPWZ1bmN0aW9uKCl7aWYodGhpcyBpbnN0YW5jZW9mIGUpe3ZhciBhPWZ1bmN0aW9uKCl7fTthLnByb3RvdHlwZT1jLnByb3RvdHlwZTt2YXIgZj1uZXcgYSxnPWMuYXBwbHkoZixkLmNvbmNhdCh1LmNhbGwoYXJndW1lbnRzKSkpO3JldHVybiBPYmplY3QoZyk9PT1nP2c6Zn1yZXR1cm4gYy5hcHBseShiLGQuY29uY2F0KHUuY2FsbChhcmd1bWVudHMpKSl9O3JldHVybiBlfSkscS5yZ2JhPWZ1bmN0aW9uKCl7cmV0dXJuIHooXCJiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTUwLDI1NSwxNTAsLjUpXCIpLEMoaS5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfSxxLmJhY2tncm91bmRzaXplPWZ1bmN0aW9uKCl7cmV0dXJuIEYoXCJiYWNrZ3JvdW5kU2l6ZVwiKX0scS5jc3NhbmltYXRpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIEYoXCJhbmltYXRpb25OYW1lXCIpfSxxLmNzc3RyYW5zaXRpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIEYoXCJ0cmFuc2l0aW9uXCIpfSxxLmdlbmVyYXRlZGNvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gdyhbXCIjXCIsZyxcIntmb250OjAvMCBhfSNcIixnLCc6YWZ0ZXJ7Y29udGVudDpcIicsaywnXCI7dmlzaWJpbGl0eTpoaWRkZW47Zm9udDozcHgvMSBhfSddLmpvaW4oXCJcIiksZnVuY3Rpb24oYil7YT1iLm9mZnNldEhlaWdodD49M30pLGF9LHEudmlkZW89ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKSxjPSExO3RyeXtpZihjPSEhYS5jYW5QbGF5VHlwZSljPW5ldyBCb29sZWFuKGMpLGMub2dnPWEuY2FuUGxheVR5cGUoJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLmgyNjQ9YS5jYW5QbGF5VHlwZSgndmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRVwiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksYy53ZWJtPWEuY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOCwgdm9yYmlzXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKX1jYXRjaChkKXt9cmV0dXJuIGN9LHEuYXVkaW89ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKSxjPSExO3RyeXtpZihjPSEhYS5jYW5QbGF5VHlwZSljPW5ldyBCb29sZWFuKGMpLGMub2dnPWEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLm1wMz1hLmNhblBsYXlUeXBlKFwiYXVkaW8vbXBlZztcIikucmVwbGFjZSgvXm5vJC8sXCJcIiksYy53YXY9YS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLm00YT0oYS5jYW5QbGF5VHlwZShcImF1ZGlvL3gtbTRhO1wiKXx8YS5jYW5QbGF5VHlwZShcImF1ZGlvL2FhYztcIikpLnJlcGxhY2UoL15ubyQvLFwiXCIpfWNhdGNoKGQpe31yZXR1cm4gY30scS5zdmc9ZnVuY3Rpb24oKXtyZXR1cm4hIWIuY3JlYXRlRWxlbWVudE5TJiYhIWIuY3JlYXRlRWxlbWVudE5TKHAuc3ZnLFwic3ZnXCIpLmNyZWF0ZVNWR1JlY3R9O2Zvcih2YXIgRyBpbiBxKXkocSxHKSYmKHY9Ry50b0xvd2VyQ2FzZSgpLGVbdl09cVtHXSgpLHQucHVzaCgoZVt2XT9cIlwiOlwibm8tXCIpK3YpKTtyZXR1cm4gZS5hZGRUZXN0PWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGE9PVwib2JqZWN0XCIpZm9yKHZhciBkIGluIGEpeShhLGQpJiZlLmFkZFRlc3QoZCxhW2RdKTtlbHNle2E9YS50b0xvd2VyQ2FzZSgpO2lmKGVbYV0hPT1jKXJldHVybiBlO2I9dHlwZW9mIGI9PVwiZnVuY3Rpb25cIj9iKCk6Yix0eXBlb2YgZW5hYmxlQ2xhc3NlcyE9XCJ1bmRlZmluZWRcIiYmZW5hYmxlQ2xhc3NlcyYmKGYuY2xhc3NOYW1lKz1cIiBcIisoYj9cIlwiOlwibm8tXCIpK2EpLGVbYV09Yn1yZXR1cm4gZX0seihcIlwiKSxoPWo9bnVsbCxmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGwoYSxiKXt2YXIgYz1hLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLGQ9YS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGEuZG9jdW1lbnRFbGVtZW50O3JldHVybiBjLmlubmVySFRNTD1cIng8c3R5bGU+XCIrYitcIjwvc3R5bGU+XCIsZC5pbnNlcnRCZWZvcmUoYy5sYXN0Q2hpbGQsZC5maXJzdENoaWxkKX1mdW5jdGlvbiBtKCl7dmFyIGE9cy5lbGVtZW50cztyZXR1cm4gdHlwZW9mIGE9PVwic3RyaW5nXCI/YS5zcGxpdChcIiBcIik6YX1mdW5jdGlvbiBuKGEpe3ZhciBiPWpbYVtoXV07cmV0dXJuIGJ8fChiPXt9LGkrKyxhW2hdPWksaltpXT1iKSxifWZ1bmN0aW9uIG8oYSxjLGQpe2N8fChjPWIpO2lmKGspcmV0dXJuIGMuY3JlYXRlRWxlbWVudChhKTtkfHwoZD1uKGMpKTt2YXIgZztyZXR1cm4gZC5jYWNoZVthXT9nPWQuY2FjaGVbYV0uY2xvbmVOb2RlKCk6Zi50ZXN0KGEpP2c9KGQuY2FjaGVbYV09ZC5jcmVhdGVFbGVtKGEpKS5jbG9uZU5vZGUoKTpnPWQuY3JlYXRlRWxlbShhKSxnLmNhbkhhdmVDaGlsZHJlbiYmIWUudGVzdChhKSYmIWcudGFnVXJuP2QuZnJhZy5hcHBlbmRDaGlsZChnKTpnfWZ1bmN0aW9uIHAoYSxjKXthfHwoYT1iKTtpZihrKXJldHVybiBhLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtjPWN8fG4oYSk7dmFyIGQ9Yy5mcmFnLmNsb25lTm9kZSgpLGU9MCxmPW0oKSxnPWYubGVuZ3RoO2Zvcig7ZTxnO2UrKylkLmNyZWF0ZUVsZW1lbnQoZltlXSk7cmV0dXJuIGR9ZnVuY3Rpb24gcShhLGIpe2IuY2FjaGV8fChiLmNhY2hlPXt9LGIuY3JlYXRlRWxlbT1hLmNyZWF0ZUVsZW1lbnQsYi5jcmVhdGVGcmFnPWEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCxiLmZyYWc9Yi5jcmVhdGVGcmFnKCkpLGEuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihjKXtyZXR1cm4gcy5zaGl2TWV0aG9kcz9vKGMsYSxiKTpiLmNyZWF0ZUVsZW0oYyl9LGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrbSgpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtXSsvZyxmdW5jdGlvbihhKXtyZXR1cm4gYi5jcmVhdGVFbGVtKGEpLGIuZnJhZy5jcmVhdGVFbGVtZW50KGEpLCdjKFwiJythKydcIiknfSkrXCIpO3JldHVybiBufVwiKShzLGIuZnJhZyl9ZnVuY3Rpb24gcihhKXthfHwoYT1iKTt2YXIgYz1uKGEpO3JldHVybiBzLnNoaXZDU1MmJiFnJiYhYy5oYXNDU1MmJihjLmhhc0NTUz0hIWwoYSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGt8fHEoYSxjKSxhfXZhciBjPVwiMy43LjBcIixkPWEuaHRtbDV8fHt9LGU9L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksZj0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksZyxoPVwiX2h0bWw1c2hpdlwiLGk9MCxqPXt9LGs7KGZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImFcIik7YS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLGc9XCJoaWRkZW5cImluIGEsaz1hLmNoaWxkTm9kZXMubGVuZ3RoPT0xfHxmdW5jdGlvbigpe2IuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGE9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuIHR5cGVvZiBhLmNsb25lTm9kZT09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRWxlbWVudD09XCJ1bmRlZmluZWRcIn0oKX1jYXRjaChjKXtnPSEwLGs9ITB9fSkoKTt2YXIgcz17ZWxlbWVudHM6ZC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvXCIsdmVyc2lvbjpjLHNoaXZDU1M6ZC5zaGl2Q1NTIT09ITEsc3VwcG9ydHNVbmtub3duRWxlbWVudHM6ayxzaGl2TWV0aG9kczpkLnNoaXZNZXRob2RzIT09ITEsdHlwZTpcImRlZmF1bHRcIixzaGl2RG9jdW1lbnQ6cixjcmVhdGVFbGVtZW50Om8sY3JlYXRlRG9jdW1lbnRGcmFnbWVudDpwfTthLmh0bWw1PXMscihiKX0odGhpcyxiKSxlLl92ZXJzaW9uPWQsZS5fZG9tUHJlZml4ZXM9byxlLl9jc3NvbVByZWZpeGVzPW4sZS50ZXN0UHJvcD1mdW5jdGlvbihhKXtyZXR1cm4gRChbYV0pfSxlLnRlc3RBbGxQcm9wcz1GLGUudGVzdFN0eWxlcz13LGV9KHRoaXMsdGhpcy5kb2N1bWVudCksZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1vLmNhbGwoYSl9ZnVuY3Rpb24gZShhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX1mdW5jdGlvbiBmKCl7fWZ1bmN0aW9uIGcoYSl7cmV0dXJuIWF8fFwibG9hZGVkXCI9PWF8fFwiY29tcGxldGVcIj09YXx8XCJ1bmluaXRpYWxpemVkXCI9PWF9ZnVuY3Rpb24gaCgpe3ZhciBhPXAuc2hpZnQoKTtxPTEsYT9hLnQ/bShmdW5jdGlvbigpeyhcImNcIj09YS50P0IuaW5qZWN0Q3NzOkIuaW5qZWN0SnMpKGEucywwLGEuYSxhLngsYS5lLDEpfSwwKTooYSgpLGgoKSk6cT0wfWZ1bmN0aW9uIGkoYSxjLGQsZSxmLGksail7ZnVuY3Rpb24gayhiKXtpZighbyYmZyhsLnJlYWR5U3RhdGUpJiYodS5yPW89MSwhcSYmaCgpLGwub25sb2FkPWwub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsYikpe1wiaW1nXCIhPWEmJm0oZnVuY3Rpb24oKXt0LnJlbW92ZUNoaWxkKGwpfSw1MCk7Zm9yKHZhciBkIGluIHlbY10peVtjXS5oYXNPd25Qcm9wZXJ0eShkKSYmeVtjXVtkXS5vbmxvYWQoKX19dmFyIGo9anx8Qi5lcnJvclRpbWVvdXQsbD1iLmNyZWF0ZUVsZW1lbnQoYSksbz0wLHI9MCx1PXt0OmQsczpjLGU6ZixhOmkseDpqfTsxPT09eVtjXSYmKHI9MSx5W2NdPVtdKSxcIm9iamVjdFwiPT1hP2wuZGF0YT1jOihsLnNyYz1jLGwudHlwZT1hKSxsLndpZHRoPWwuaGVpZ2h0PVwiMFwiLGwub25lcnJvcj1sLm9ubG9hZD1sLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2suY2FsbCh0aGlzLHIpfSxwLnNwbGljZShlLDAsdSksXCJpbWdcIiE9YSYmKHJ8fDI9PT15W2NdPyh0Lmluc2VydEJlZm9yZShsLHM/bnVsbDpuKSxtKGssaikpOnlbY10ucHVzaChsKSl9ZnVuY3Rpb24gaihhLGIsYyxkLGYpe3JldHVybiBxPTAsYj1ifHxcImpcIixlKGEpP2koXCJjXCI9PWI/djp1LGEsYix0aGlzLmkrKyxjLGQsZik6KHAuc3BsaWNlKHRoaXMuaSsrLDAsYSksMT09cC5sZW5ndGgmJmgoKSksdGhpc31mdW5jdGlvbiBrKCl7dmFyIGE9QjtyZXR1cm4gYS5sb2FkZXI9e2xvYWQ6aixpOjB9LGF9dmFyIGw9Yi5kb2N1bWVudEVsZW1lbnQsbT1hLnNldFRpbWVvdXQsbj1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdLG89e30udG9TdHJpbmcscD1bXSxxPTAscj1cIk1vekFwcGVhcmFuY2VcImluIGwuc3R5bGUscz1yJiYhIWIuY3JlYXRlUmFuZ2UoKS5jb21wYXJlTm9kZSx0PXM/bDpuLnBhcmVudE5vZGUsbD1hLm9wZXJhJiZcIltvYmplY3QgT3BlcmFdXCI9PW8uY2FsbChhLm9wZXJhKSxsPSEhYi5hdHRhY2hFdmVudCYmIWwsdT1yP1wib2JqZWN0XCI6bD9cInNjcmlwdFwiOlwiaW1nXCIsdj1sP1wic2NyaXB0XCI6dSx3PUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09by5jYWxsKGEpfSx4PVtdLHk9e30sej17dGltZW91dDpmdW5jdGlvbihhLGIpe3JldHVybiBiLmxlbmd0aCYmKGEudGltZW91dD1iWzBdKSxhfX0sQSxCO0I9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhKXt2YXIgYT1hLnNwbGl0KFwiIVwiKSxiPXgubGVuZ3RoLGM9YS5wb3AoKSxkPWEubGVuZ3RoLGM9e3VybDpjLG9yaWdVcmw6YyxwcmVmaXhlczphfSxlLGYsZztmb3IoZj0wO2Y8ZDtmKyspZz1hW2ZdLnNwbGl0KFwiPVwiKSwoZT16W2cuc2hpZnQoKV0pJiYoYz1lKGMsZykpO2ZvcihmPTA7ZjxiO2YrKyljPXhbZl0oYyk7cmV0dXJuIGN9ZnVuY3Rpb24gZyhhLGUsZixnLGgpe3ZhciBpPWIoYSksaj1pLmF1dG9DYWxsYmFjaztpLnVybC5zcGxpdChcIi5cIikucG9wKCkuc3BsaXQoXCI/XCIpLnNoaWZ0KCksaS5ieXBhc3N8fChlJiYoZT1kKGUpP2U6ZVthXXx8ZVtnXXx8ZVthLnNwbGl0KFwiL1wiKS5wb3AoKS5zcGxpdChcIj9cIilbMF1dKSxpLmluc3RlYWQ/aS5pbnN0ZWFkKGEsZSxmLGcsaCk6KHlbaS51cmxdP2kubm9leGVjPSEwOnlbaS51cmxdPTEsZi5sb2FkKGkudXJsLGkuZm9yY2VDU1N8fCFpLmZvcmNlSlMmJlwiY3NzXCI9PWkudXJsLnNwbGl0KFwiLlwiKS5wb3AoKS5zcGxpdChcIj9cIikuc2hpZnQoKT9cImNcIjpjLGkubm9leGVjLGkuYXR0cnMsaS50aW1lb3V0KSwoZChlKXx8ZChqKSkmJmYubG9hZChmdW5jdGlvbigpe2soKSxlJiZlKGkub3JpZ1VybCxoLGcpLGomJmooaS5vcmlnVXJsLGgsZykseVtpLnVybF09Mn0pKSl9ZnVuY3Rpb24gaChhLGIpe2Z1bmN0aW9uIGMoYSxjKXtpZihhKXtpZihlKGEpKWN8fChqPWZ1bmN0aW9uKCl7dmFyIGE9W10uc2xpY2UuY2FsbChhcmd1bWVudHMpO2suYXBwbHkodGhpcyxhKSxsKCl9KSxnKGEsaixiLDAsaCk7ZWxzZSBpZihPYmplY3QoYSk9PT1hKWZvcihuIGluIG09ZnVuY3Rpb24oKXt2YXIgYj0wLGM7Zm9yKGMgaW4gYSlhLmhhc093blByb3BlcnR5KGMpJiZiKys7cmV0dXJuIGJ9KCksYSlhLmhhc093blByb3BlcnR5KG4pJiYoIWMmJiEtLW0mJihkKGopP2o9ZnVuY3Rpb24oKXt2YXIgYT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7ay5hcHBseSh0aGlzLGEpLGwoKX06altuXT1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYj1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7YSYmYS5hcHBseSh0aGlzLGIpLGwoKX19KGtbbl0pKSxnKGFbbl0saixiLG4saCkpfWVsc2UhYyYmbCgpfXZhciBoPSEhYS50ZXN0LGk9YS5sb2FkfHxhLmJvdGgsaj1hLmNhbGxiYWNrfHxmLGs9aixsPWEuY29tcGxldGV8fGYsbSxuO2MoaD9hLnllcDphLm5vcGUsISFpKSxpJiZjKGkpfXZhciBpLGosbD10aGlzLnllcG5vcGUubG9hZGVyO2lmKGUoYSkpZyhhLDAsbCwwKTtlbHNlIGlmKHcoYSkpZm9yKGk9MDtpPGEubGVuZ3RoO2krKylqPWFbaV0sZShqKT9nKGosMCxsLDApOncoaik/QihqKTpPYmplY3Qoaik9PT1qJiZoKGosbCk7ZWxzZSBPYmplY3QoYSk9PT1hJiZoKGEsbCl9LEIuYWRkUHJlZml4PWZ1bmN0aW9uKGEsYil7elthXT1ifSxCLmFkZEZpbHRlcj1mdW5jdGlvbihhKXt4LnB1c2goYSl9LEIuZXJyb3JUaW1lb3V0PTFlNCxudWxsPT1iLnJlYWR5U3RhdGUmJmIuYWRkRXZlbnRMaXN0ZW5lciYmKGIucmVhZHlTdGF0ZT1cImxvYWRpbmdcIixiLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsQT1mdW5jdGlvbigpe2IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixBLDApLGIucmVhZHlTdGF0ZT1cImNvbXBsZXRlXCJ9LDApKSxhLnllcG5vcGU9aygpLGEueWVwbm9wZS5leGVjdXRlU3RhY2s9aCxhLnllcG5vcGUuaW5qZWN0SnM9ZnVuY3Rpb24oYSxjLGQsZSxpLGope3ZhciBrPWIuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxsLG8sZT1lfHxCLmVycm9yVGltZW91dDtrLnNyYz1hO2ZvcihvIGluIGQpay5zZXRBdHRyaWJ1dGUobyxkW29dKTtjPWo/aDpjfHxmLGsub25yZWFkeXN0YXRlY2hhbmdlPWsub25sb2FkPWZ1bmN0aW9uKCl7IWwmJmcoay5yZWFkeVN0YXRlKSYmKGw9MSxjKCksay5vbmxvYWQ9ay5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCl9LG0oZnVuY3Rpb24oKXtsfHwobD0xLGMoMSkpfSxlKSxpP2sub25sb2FkKCk6bi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShrLG4pfSxhLnllcG5vcGUuaW5qZWN0Q3NzPWZ1bmN0aW9uKGEsYyxkLGUsZyxpKXt2YXIgZT1iLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpLGosYz1pP2g6Y3x8ZjtlLmhyZWY9YSxlLnJlbD1cInN0eWxlc2hlZXRcIixlLnR5cGU9XCJ0ZXh0L2Nzc1wiO2ZvcihqIGluIGQpZS5zZXRBdHRyaWJ1dGUoaixkW2pdKTtnfHwobi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLG4pLG0oYywwKSl9fSh0aGlzLGRvY3VtZW50KSxNb2Rlcm5penIubG9hZD1mdW5jdGlvbigpe3llcG5vcGUuYXBwbHkod2luZG93LFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApKX0sTW9kZXJuaXpyLnRlc3RTdHlsZXMoXCIjbW9kZXJuaXpye2JhY2tncm91bmQtc2l6ZTpjb3Zlcn1cIixmdW5jdGlvbihhKXt2YXIgYj13aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZT93aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpOmEuY3VycmVudFN0eWxlO01vZGVybml6ci5hZGRUZXN0KFwiYmdzaXplY292ZXJcIixiLmJhY2tncm91bmRTaXplPT1cImNvdmVyXCIpfSksTW9kZXJuaXpyLmFkZFRlc3QoXCJjc3N2aHVuaXRcIixmdW5jdGlvbigpe3ZhciBhO3JldHVybiBNb2Rlcm5penIudGVzdFN0eWxlcyhcIiNtb2Rlcm5penIgeyBoZWlnaHQ6IDUwdmg7IH1cIixmdW5jdGlvbihiLGMpe3ZhciBkPXBhcnNlSW50KHdpbmRvdy5pbm5lckhlaWdodC8yLDEwKSxlPXBhcnNlSW50KCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZT9nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCk6Yi5jdXJyZW50U3R5bGUpLmhlaWdodCwxMCk7YT1lPT1kfSksYX0pLE1vZGVybml6ci5hZGRUZXN0KFwiY3Nzdnd1bml0XCIsZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gTW9kZXJuaXpyLnRlc3RTdHlsZXMoXCIjbW9kZXJuaXpyIHsgd2lkdGg6IDUwdnc7IH1cIixmdW5jdGlvbihiLGMpe3ZhciBkPXBhcnNlSW50KHdpbmRvdy5pbm5lcldpZHRoLzIsMTApLGU9cGFyc2VJbnQoKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlP2dldENvbXB1dGVkU3R5bGUoYixudWxsKTpiLmN1cnJlbnRTdHlsZSkud2lkdGgsMTApO2E9ZT09ZH0pLGF9KTsiLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHRoaXMuUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHRoaXMucS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgdGhpcy5jYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgaiA9IHRoaXMucS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xW2ldLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgIHJlc2l6ZWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnQsIHJlc2l6ZWQpIHtcbiAgICAgICAgICAgIGlmICghZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCA9IG5ldyBFdmVudFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAncmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBzY3JvbGw7IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyc7XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJ1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInJlc2l6ZS1zZW5zb3Itc2hyaW5rXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnIHdpZHRoOiAyMDAlOyBoZWlnaHQ6IDIwMCVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudC5yZXNpemVTZW5zb3IpO1xuXG4gICAgICAgICAgICBpZiAoIXtmaXhlZDogMSwgYWJzb2x1dGU6IDF9W2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJyldKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmtDaGlsZCA9IHNocmluay5jaGlsZE5vZGVzWzBdO1xuXG4gICAgICAgICAgICB2YXIgbGFzdFdpZHRoLCBsYXN0SGVpZ2h0O1xuXG4gICAgICAgICAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9IGV4cGFuZC5vZmZzZXRXaWR0aCArIDEwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSBleHBhbmQub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxMZWZ0ID0gZXhwYW5kLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxUb3AgPSBleHBhbmQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxMZWZ0ID0gc2hyaW5rLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxUb3AgPSBzaHJpbmsuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxhc3RXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbGFzdEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzZXQoKTtcblxuICAgICAgICAgICAgdmFyIGNoYW5nZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGFkZEV2ZW50KGV4cGFuZCwgJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWRkRXZlbnQoc2hyaW5rLCAnc2Nyb2xsJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA8IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA8IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudClcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50W2ldLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUmVzaXplU2Vuc29yLmRldGFjaChlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdGhpcy5SZXNpemVTZW5zb3IuZGV0YWNoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5yZXNpemVTZW5zb3IpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5yZXNpemVTZW5zb3IpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQucmVzaXplU2Vuc29yO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkO1xuICAgICAgICB9XG4gICAgfTtcblxufSkoKTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuRUxFTUVOVCBGVU5DVElPTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KTtcclxuXHJcblx0Ly8gU3RhdCAvIENvdW50ZXIgRWxlbWVudFxyXG5cclxuXHRmdW5jdGlvbiBtaXh0U3RhdHMoKSB7XHJcblx0XHR2YXIgc3RhdEVsZW1zID0gJCgnLm1peHQtc3RhdCcpO1xyXG5cclxuXHRcdGlmICggc3RhdEVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0Ly8gU2V0IHN0YXQgdGV4dCB0byBzdGFydGluZyAoZnJvbSkgdmFsdWVcclxuXHRcdHN0YXRFbGVtcy5maW5kKCcuc3RhdC12YWx1ZScpLmVhY2goIGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKCdmcm9tJykpOyB9KTtcclxuXHJcblx0XHQvLyBBbmltYXRlIHZhbHVlXHJcblx0XHRmdW5jdGlvbiBzdGF0VmFsdWUoZWwpIHtcclxuXHRcdFx0dmFyIGZyb20gID0gZWwuZGF0YSgnZnJvbScpLFxyXG5cdFx0XHRcdHRvICAgID0gZWwuZGF0YSgndG8nKSxcclxuXHRcdFx0XHRzcGVlZCA9IGVsLmRhdGEoJ3NwZWVkJyk7XHJcblx0XHRcdCQoe3ZhbHVlOiBmcm9tfSkuYW5pbWF0ZSh7dmFsdWU6IHRvfSwge1xyXG5cdFx0XHRcdGR1cmF0aW9uOiBzcGVlZCxcclxuXHRcdFx0XHRzdGVwOiBmdW5jdGlvbigpIHsgZWwudGV4dChNYXRoLnJvdW5kKHRoaXMudmFsdWUpKTsgfSxcclxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KHRvKTsgfVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZW5kZXIgQ2lyY2xlXHJcblx0XHRmdW5jdGlvbiBzdGF0Q2lyY2xlKCkge1xyXG5cdFx0XHQkKCcuc3RhdC1jaXJjbGUnKS5jaXJjbGVQcm9ncmVzcyh7IHNpemU6IDUwMCwgbGluZUNhcDogJ3JvdW5kJyB9KS5jaGlsZHJlbignLmNpcmNsZS1pbm5lcicpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykuY3NzKCdtYXJnaW4tdG9wJywgJCh0aGlzKS5oZWlnaHQoKSAvIC0yKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHN0YXRFbGVtcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc3RhdCA9ICQodGhpcyk7XHJcblx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi53YXlwb2ludCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdHN0YXQud2F5cG9pbnQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5jaXJjbGVQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyApIHN0YXRDaXJjbGUoKTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5kZXN0cm95ID09PSAnZnVuY3Rpb24nICkgdGhpcy5kZXN0cm95KCk7XHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdG9mZnNldDogJ2JvdHRvbS1pbi12aWV3JyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcclxuXHRcdFx0XHRcdGlmICggdHlwZW9mICQuZm4uY2lyY2xlUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgKSBzdGF0Q2lyY2xlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRtaXh0U3RhdHMoKTtcclxuXHJcbn0oalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuSEVBREVSIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0ICovXHJcblxyXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXHJcblx0XHRtYWluTmF2QmFyID0gJCgnI21haW4tbmF2JyksXHJcblx0XHRtZWRpYVdyYXAgPSAkKCcuaGVhZC1tZWRpYScpO1xyXG5cclxuXHQvLyBIZWFkIE1lZGlhIEZ1bmN0aW9uc1xyXG5cdGZ1bmN0aW9uIGhlYWRlckZuKCkge1xyXG5cdFx0dmFyIGNvbnRhaW5lciAgICA9IG1lZGlhV3JhcC5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxyXG5cdFx0XHRtZWRpYUNvbnQgICAgPSBtZWRpYVdyYXAuY2hpbGRyZW4oJy5tZWRpYS1jb250YWluZXInKSxcclxuXHRcdFx0dG9wTmF2SGVpZ2h0ID0gbWFpbk5hdkJhci5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXHJcblx0XHRcdGhtSGVpZ2h0ICAgICA9IDA7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcclxuXHRcdFx0bWVkaWFXcmFwLmNzcygnaGVpZ2h0Jywgd3JhcEhlaWdodCk7XHJcblx0XHRcdFxyXG5cdFx0XHRobUhlaWdodCA9IHZpZXdwb3J0LmhlaWdodCgpIC0gbWVkaWFXcmFwLm9mZnNldCgpLnRvcDtcclxuXHJcblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgJiYgISBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgKSB7IGhtSGVpZ2h0IC09IHRvcE5hdkhlaWdodDsgfVxyXG5cclxuXHRcdFx0bWVkaWFXcmFwLmNzcygnaGVpZ2h0JywgaG1IZWlnaHQpO1xyXG5cdFx0XHRtZWRpYUNvbnQuY3NzKCdoZWlnaHQnLCBobUhlaWdodCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWVkaWFDb250Lmxlbmd0aCA9PSAxICkge1xyXG5cdFx0XHR2YXIgY29udGFpbmVyUGFkID0gdG9wTmF2SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHRjb250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScsIGNvbnRhaW5lclBhZCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29udGFpbmVyLmNzcygncGFkZGluZy10b3AnLCBjb250YWluZXJQYWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBIZWFkZXIgU2Nyb2xsIFRvIENvbnRlbnRcclxuXHRmdW5jdGlvbiBoZWFkZXJTY3JvbGwoKSB7XHJcblx0XHR2YXIgcGFnZSAgID0gJCgnaHRtbCwgYm9keScpLFxyXG5cdFx0XHRvZmZzZXQgPSAkKCcjY29udGVudC13cmFwJykub2Zmc2V0KCkudG9wO1xyXG5cdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICkgeyBvZmZzZXQgLT0gbWFpbk5hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLmhlaWdodCgpOyB9XHJcblx0XHQkKCcuaGVhZGVyLXNjcm9sbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRwYWdlLmFuaW1hdGUoeyBzY3JvbGxUb3A6IG9mZnNldCB9LCA4MDApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZiAoIG1peHRfb3B0LmhlYWRlci5lbmFibGVkICkge1xyXG5cdFx0aGVhZGVyRm4oKTtcclxuXHJcblx0XHRpZiAoIG1peHRfb3B0LmhlYWRlci5zY3JvbGwgKSB7IGhlYWRlclNjcm9sbCgpOyB9XHJcblx0XHRcclxuXHRcdCQod2luZG93KS5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgaGVhZGVyRm4gKSk7XHJcblx0fVxyXG5cclxufShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbk1JWFQgSU5URUdSQVRJT04gRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIFNraXAgTGluayBGb2N1cyBGaXhcblxuKCBmdW5jdGlvbigpIHtcblx0dmFyIGlzX3dlYmtpdCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApID4gLTEsXG5cdFx0aXNfb3BlcmEgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSAgPiAtMSxcblx0XHRpc19pZSAgICAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICkgICA+IC0xO1xuXG5cdGlmICggKCBpc193ZWJraXQgfHwgaXNfb3BlcmEgfHwgaXNfaWUgKSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCApICkge1xuXHRcdHZhciBldmVudE1ldGhvZCA9ICggd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdhdHRhY2hFdmVudCc7XG5cdFx0d2luZG93WyBldmVudE1ldGhvZCBdKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0pKCk7XG5cbi8vIFJ1biBPbiBQYWdlIExvYWRcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHQvLyBBZGQgQm9vdHN0cmFwIENsYXNzZXNcblxuXHQkKCdpbnB1dC5zZWFyY2gtZmllbGQnKS5hZGRDbGFzcygnZm9ybS1jb250cm9sJyk7XG5cdCQoJ2lucHV0LnNlYXJjaC1zdWJtaXQnKS5hZGRDbGFzcygnYnRuIGJ0bi1kZWZhdWx0Jyk7XG5cblx0JCgnLndpZGdldF9yc3MgdWwnKS5hZGRDbGFzcygnbWVkaWEtbGlzdCcpO1xuXG5cdCQoJy53aWRnZXRfbWV0YSB1bCwgLndpZGdldF9yZWNlbnRfZW50cmllcyB1bCwgLndpZGdldF9hcmNoaXZlIHVsLCAud2lkZ2V0X2NhdGVnb3JpZXMgdWwsIC53aWRnZXRfbmF2X21lbnUgdWwsIC53aWRnZXRfcGFnZXMgdWwnKS5hZGRDbGFzcygnbmF2Jyk7XG5cblx0JCgnLndpZGdldF9yZWNlbnRfY29tbWVudHMgdWwjcmVjZW50Y29tbWVudHMnKS5jc3MoJ2xpc3Qtc3R5bGUnLCAnbm9uZScpLmNzcygncGFkZGluZy1sZWZ0JywgJzAnKTtcblx0JCgnLndpZGdldF9yZWNlbnRfY29tbWVudHMgdWwjcmVjZW50Y29tbWVudHMgbGknKS5jc3MoJ3BhZGRpbmcnLCAnNXB4IDE1cHgnKTtcblxuXHQkKCd0YWJsZSN3cC1jYWxlbmRhcicpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1zdHJpcGVkJyk7XG5cblx0Ly8gSGFuZGxlIFBvc3QgQ291bnRcblxuXHQkKCcud2lkZ2V0X2FyY2hpdmUgbGksIC53aWRnZXRfY2F0ZWdvcmllcyBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyAgICAgPSAkKHRoaXMpLFxuXHRcdFx0Y2hpbGRyZW4gID0gJHRoaXMuY2hpbGRyZW4oKSxcblx0XHRcdGFuY2hvciAgICA9IGNoaWxkcmVuLmZpbHRlcignYScpLFxuXHRcdFx0Y29udGVudHMgID0gJHRoaXMuY29udGVudHMoKSxcblx0XHRcdGNvdW50VGV4dCA9IGNvbnRlbnRzLm5vdChjaGlsZHJlbikudGV4dCgpO1xuXG5cdFx0aWYgKCBjb3VudFRleHQgIT09ICcnICkge1xuXHRcdFx0YW5jaG9yLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJwb3N0LWNvdW50XCI+JyArIGNvdW50VGV4dCArICc8L3NwYW4+Jyk7XG5cdFx0XHRjb250ZW50cy5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlVHlwZSA9PT0gMzsgXG5cdFx0XHR9KS5yZW1vdmUoKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEdhbGxlcnkgQXJyb3cgTmF2aWdhdGlvblxuXG5cdCQoIGRvY3VtZW50ICkua2V5ZG93biggZnVuY3Rpb24oZSkge1xuXHRcdHZhciB1cmwgPSBmYWxzZTtcblx0XHRpZiAoIGUud2hpY2ggPT09IDM3ICkgeyAgLy8gTGVmdCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLnByZXZpb3VzLWltYWdlIGEnKS5hdHRyKCdocmVmJyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLndoaWNoID09PSAzOSApIHsgIC8vIFJpZ2h0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcuZW50cnktYXR0YWNobWVudCBhJykuYXR0cignaHJlZicpO1xuXHRcdH1cblx0XHRpZiAoIHVybCAmJiAoICEkKCd0ZXh0YXJlYSwgaW5wdXQnKS5pcygnOmZvY3VzJykgKSApIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0XHR9XG5cdH0pO1xuXG59KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuTkFWQkFSIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0LCBjb2xvckxvRCAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgICAgPSAkKHdpbmRvdyksXHJcblx0XHRib2R5RWwgICAgICA9ICQoJ2JvZHknKSxcclxuXHRcdG1haW5XcmFwICAgID0gJCgnI21haW4td3JhcCcpLFxyXG5cdFx0bWFpbk5hdkJhciAgID0gJCgnI21haW4tbmF2JyksXHJcblx0XHRtYWluTmF2V3JhcCAgPSAkKCcjbWFpbi1uYXYtd3JhcCcpLFxyXG5cdFx0bWFpbk5hdkhlYWQgID0gJCgnLm5hdmJhci1oZWFkZXInLCBtYWluTmF2QmFyKSxcclxuXHRcdG1haW5OYXZJbm5lciA9ICQoJy5uYXZiYXItaW5uZXInLCBtYWluTmF2QmFyKSxcclxuXHRcdHNlY05hdkJhciAgID0gJCgnI3NlY29uZC1uYXYnKSxcclxuXHRcdG5hdmJhcnMgICAgID0gJCgnLm5hdmJhcicpLFxyXG5cdFx0bWVkaWFXcmFwICAgPSAkKCcuaGVhZC1tZWRpYScpO1xyXG5cclxuXHR2YXIgbmF2YmFyT2JqID0ge1xyXG5cclxuXHRcdG5hdkJnOiAnJyxcclxuXHRcdG5hdkJnVG9wOiAnJyxcclxuXHJcblx0XHQvLyBTZXQgQmFja2dyb3VuZCBDb2xvciBDbGFzc1xyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKG5hdmJhcikge1xyXG5cclxuXHRcdFx0dmFyIGJnQ29sb3IgID0gbmF2YmFyLmNzcygnYmFja2dyb3VuZC1jb2xvcicpLFxyXG5cdFx0XHRcdGNvbG9yTHVtID0gY29sb3JMb0QoYmdDb2xvcik7XHJcblxyXG5cdFx0XHRpZiAoIGNvbG9yTHVtID09ICdkYXJrJyApIHsgbmF2YmFyLmFkZENsYXNzKCdiZy1kYXJrJyk7IH1cclxuXHRcdFx0aWYgKCBuYXZiYXIuaXMobWFpbk5hdkJhcikgKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLm5hdkJnID0gKCBjb2xvckx1bSA9PSAnZGFyaycgKSA/ICdiZy1kYXJrJyA6ICcnO1xyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0LmhlYWRlci5lbmFibGVkICYmIG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSB7XHJcblx0XHRcdFx0XHRuYXZiYXJPYmoubmF2QmdUb3AgPSBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWRhcmsnKSA/ICdiZy1kYXJrJyA6ICcnO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRuYXZiYXJPYmoubmF2QmdUb3AgPSBuYXZiYXJPYmoubmF2Qmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ3N0YXRpYycgKSB7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKG5hdmJhck9iai5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgbmF2YmFyT2JqLm5hdkJnVG9wKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uXHJcblxyXG5cdFx0c3RpY2t5TmF2OiBmdW5jdGlvbihpc01vYmlsZSkge1xyXG5cclxuXHRcdFx0dmFyIG5hdlNjcm9sbEhhbmRsZXIgPSAkLnRocm90dGxlKCA1MCwgc3RpY2t5TmF2VG9nZ2xlICksXHJcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiA9IDAsXHJcblx0XHRcdFx0bWFpbk5hdkhlaWdodCAgICAgPSAwLFxyXG5cdFx0XHRcdG1haW5OYXZQb3MgICAgICAgID0gMCxcclxuXHRcdFx0XHRtYWluTmF2TWcgICAgICAgICA9IDA7XHJcblxyXG5cdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSApIHsgdmlld3BvcnQub24oJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XHJcblx0XHRcdGVsc2UgeyB2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XHJcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiArPSBwYXJzZUZsb2F0KG1haW5XcmFwLmNzcygncGFkZGluZy10b3AnKSwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHRtYWluTmF2SGVpZ2h0ID0gbWFpbk5hdkJhci5jc3MoJ2hlaWdodCcsICcnKS5vdXRlckhlaWdodCgpO1xyXG5cdFx0XHRcdG1haW5OYXZQb3MgICAgPSBwYXJzZUludChtYWluTmF2QmFyLmNzcygndG9wJyksIDEwKTtcclxuXHRcdFx0XHRtYWluTmF2TWcgICAgID0gbWFpbk5hdkhlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKCBtYWluTmF2UG9zID09PSAwIHx8IGlzTmFOKG1haW5OYXZQb3MpICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoJ21hcmdpbi10b3AnLCAobWFpbk5hdkhlaWdodCAqIC0xKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzdGlja3lOYXZUb2dnbGUoKSB7XHJcblx0XHRcdFx0dmFyIG5hdlBvcyAgICA9IG1haW5OYXZXcmFwLm9mZnNldCgpLnRvcCAtIG1haW5OYXZNZyxcclxuXHRcdFx0XHRcdHNjcm9sbFZhbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gbmF2YmFyT2JqLm5hdkJnVG9wO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxWYWwgPSBpc01vYmlsZSA9PT0gdHJ1ZSA/IDAgOiBzY3JvbGxWYWwgKz0gc2Nyb2xsQ29ycmVjdGlvbjtcclxuXHJcblx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLmhhc0NsYXNzKCdzbGlkZS1iZy1kYXJrJykgKSB7IGJnVG9wQ2xzID0gJ2JnLWRhcmsnOyB9XHJcblx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLmhhc0NsYXNzKCdzbGlkZS1iZy1saWdodCcpICkgeyBiZ1RvcENscyA9ICcnOyB9XHJcblxyXG5cdFx0XHRcdGlmICggc2Nyb2xsVmFsID4gbmF2UG9zICkgeyAgXHJcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcygncG9zaXRpb24tdG9wICcgKyBiZ1RvcENscykuYWRkQ2xhc3MobmF2YmFyT2JqLm5hdkJnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MobmF2YmFyT2JqLm5hdkJnKS5hZGRDbGFzcygncG9zaXRpb24tdG9wICcgKyBiZ1RvcENscyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdGlja3lOYXZUb2dnbGUoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUHJldmVudCBOYXZiYXIgU3VibWVudSBPdmVyZmxvdyBPdXQgT2YgVmlld3BvcnRcclxuXHJcblx0XHRtZW51T3ZlcmZsb3c6IGZ1bmN0aW9uKG5hdmJhcikge1xyXG5cclxuXHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXHJcblx0XHRcdFx0bWFpblN1YiA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51IC5kcm9wZG93bi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IC5zdWItbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiBhJyk7XHJcblxyXG5cdFx0XHRpZiAoIG5hdmJhci5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdG5hdmJhck9mZiA9IG5hdmJhci5vdXRlcldpZHRoKCkgKyBwYXJzZUludChuYXZiYXIub2Zmc2V0KCkubGVmdCwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTZXQgTWVudSBEcm9wIExlZnRcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHNldERyb3BMZWZ0KHRhcmdldCkge1xyXG5cdFx0XHRcdHRhcmdldC5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcC1sZWZ0Jyk7XHJcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XHJcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcclxuXHRcdFx0XHRcdHRhcmdldC5maW5kKCcuZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gUmVzZXQgTWVudSBEcm9wXHJcblxyXG5cdFx0XHRmdW5jdGlvbiByZXNldEFycm93KHRhcmdldCkge1xyXG5cdFx0XHRcdHRhcmdldC5maW5kKCcuc3ViLW1lbnUnKS5yZW1vdmVDbGFzcygnZHJvcC1sZWZ0Jyk7XHJcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XHJcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcclxuXHRcdFx0XHRcdHRhcmdldC5maW5kKCcuZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFJlc2V0IE1vYmlsZSBBZGp1c3RtZW50c1xyXG5cclxuXHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XHJcblxyXG5cdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXHJcblxyXG5cdFx0XHRtYWluU3ViLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBzdWIgICAgICA9ICQodGhpcyksXHJcblx0XHRcdFx0XHR0b3BTdWIgICA9IHN1YixcclxuXHRcdFx0XHRcdHN1YlBhciAgID0gc3ViLnBhcmVudCgpLFxyXG5cdFx0XHRcdFx0c3ViUG9zICAgPSBwYXJzZUludChzdWIub2Zmc2V0KCkubGVmdCwgMTApLFxyXG5cdFx0XHRcdFx0c3ViVyAgICAgPSBzdWIub3V0ZXJXaWR0aCgpICsgMSxcclxuXHRcdFx0XHRcdG5lc3RPZmYgID0gc3ViUG9zICsgc3ViVyxcclxuXHRcdFx0XHRcdG5lc3RTdWJzID0gc3ViLmNoaWxkcmVuKCcuZHJvcC1zdWJtZW51JyksXHJcblx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSBuZXN0U3VicyxcclxuXHRcdFx0XHRcdGNvcnJlY3Rpb247XHJcblxyXG5cdFx0XHRcdGlmICggc3ViUGFyLmlzKCcubWVnYS1tZW51LWNvbHVtbicpICkge1xyXG5cdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XHJcblx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFRvcCBMZXZlbCBTdWJtZW51c1xyXG5cclxuXHRcdFx0XHRpZiAoIG5lc3RPZmYgPiBuYXZiYXJPZmYgKSB7XHJcblx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XHJcblx0XHRcdFx0XHRjb3JyZWN0aW9uID0gKG5lc3RPZmYgLSBuYXZiYXJPZmYgLSAyKSAqIC0xO1xyXG5cclxuXHRcdFx0XHRcdGlmICggdG9wU3ViLmNzcygnYm9yZGVyLXJpZ2h0LXdpZHRoJykgPT0gJzFweCcgKSB7IGNvcnJlY3Rpb24gLT0gMTsgfVxyXG5cclxuXHRcdFx0XHRcdGlmICggbmF2YmFyLmhhc0NsYXNzKCdib3JkZXJlZCcpIHx8IG5hdmJhci5wYXJlbnRzKCcubmF2YmFyJykuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgKSB7IGNvcnJlY3Rpb24gLT0gMTsgfVxyXG5cclxuXHRcdFx0XHRcdGlmICggY29ycmVjdGlvbiA8IG1nTm93ICkge1xyXG5cdFx0XHRcdFx0XHR0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcsIGNvcnJlY3Rpb24gKyAncHgnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNldERyb3BMZWZ0KG92ZXJmbG93aW5nU3Vicyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBOZXN0ZWQgU3VibWVudXNcclxuXHJcblx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0bmVzdFN1YnNXID0gW107XHJcblx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudHMgID0gJHRoaXMucGFyZW50cygnLnN1Yi1tZW51JyksXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xyXG5cclxuXHRcdFx0XHRcdFx0cGFyZW50cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggISAkdGhpcy5oYXNDbGFzcygnZHJvcGRvd24tbWVudScpICYmICEgJHRoaXMuaGFzQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgKz0gJCh0aGlzKS5vdXRlcldpZHRoKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdG5lc3RTdWJzV1tpXSA9ICR0aGlzLm91dGVyV2lkdGgoKSArIHBhcmVudHNXO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIChuZXN0T2ZmICsgbWF4TmVzdFcpID49IGJvZHlFbC53aWR0aCgpICkge1xyXG5cdFx0XHRcdFx0XHRzZXREcm9wTGVmdChzdWJOb3cpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzZXRBcnJvdyhzdWJOb3cpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBNZWdhIE1lbnUgRW5hYmxlIC8gRGlzYWJsZVxyXG5cclxuXHRcdG1lZ2FNZW51VG9nZ2xlOiBmdW5jdGlvbih0b2dnbGUsIG5hdmJhcikge1xyXG5cdFx0XHR2YXIgbWVnYU1lbnVzO1xyXG5cclxuXHRcdFx0aWYgKCB0b2dnbGUgPT0gJ2VuYWJsZScgKSB7XHJcblx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5kcm9wLW1lbnVbZGF0YS1tZWdhLW1lbnU9XCJ0cnVlXCJdJyk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0XHRtZWdhTWVudS5hZGRDbGFzcygnbWVnYS1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbWVudScpLnJlbW92ZUF0dHIoJ2RhdGEtbWVnYS1tZW51Jyk7XHJcblx0XHRcdFx0XHQkKCc+IC5zdWItbWVudSA+IC5kcm9wLXN1Ym1lbnUnLCBtZWdhTWVudSkucmVtb3ZlQ2xhc3MoJ2Ryb3Atc3VibWVudScpLmFkZENsYXNzKCdtZWdhLW1lbnUtY29sdW1uJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAoIHRvZ2dsZSA9PSAnZGlzYWJsZScgKSB7XHJcblx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5tZWdhLW1lbnUnKTtcclxuXHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRcdG1lZ2FNZW51LnJlbW92ZUNsYXNzKCdtZWdhLW1lbnUnKS5hZGRDbGFzcygnZHJvcC1tZW51JykuYXR0cignZGF0YS1tZWdhLW1lbnUnLCAndHJ1ZScpO1xyXG5cdFx0XHRcdFx0bWVnYU1lbnUuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW4nKS5yZW1vdmVDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpLmFkZENsYXNzKCdkcm9wLXN1Ym1lbnUnKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRtZWdhTWVudXMuY2hpbGRyZW4oJ3VsJykuY3NzKCdtYXJnaW4tbGVmdCcsICcnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBDcmVhdGUgTWVnYSBNZW51IFJvd3MgSWYgVGhlcmUgQXJlIE1vcmUgVGhhbiA0IENvbHVtbnNcclxuXHJcblx0XHRtZWdhTWVudVJvd3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRtYWluV3JhcC5maW5kKCcubWVnYS1tZW51JykuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIG1haW5NZW51ID0gJCh0aGlzKS5jaGlsZHJlbignLnN1Yi1tZW51JyksXHJcblx0XHRcdFx0XHRjb2x1bW5zICA9IG1haW5NZW51LmNoaWxkcmVuKCcubWVnYS1tZW51LWNvbHVtbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoIGNvbHVtbnMubGVuZ3RoID4gNCApIG1haW5NZW51LmFkZENsYXNzKCdtdWx0aS1yb3cnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIE1vYmlsZSBGdW5jdGlvbnNcclxuXHJcblx0XHRuYXZNb2JpbGU6IGZ1bmN0aW9uKG1xTmF2KSB7XHJcblxyXG5cdFx0XHQvLyBFbmFibGUgTmF2IFNjcm9sbGluZyBJZiBOYXZiYXIgSGVpZ2h0ID4gVmlld3BvcnRcclxuXHJcblx0XHRcdGZ1bmN0aW9uIG5hdlNjcm9sbCgpIHtcclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgbXFOYXYgPT0gMiApIHtcclxuXHRcdFx0XHRcdHZhciB2aWV3cG9ydEggICAgID0gdmlld3BvcnQuaGVpZ2h0KCksXHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0UyAgICAgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRcdFx0bmF2YmFySGVhZGVySCA9IG1haW5OYXZIZWFkLmhlaWdodCgpICsgMSxcclxuXHRcdFx0XHRcdFx0bmF2YmFySW5uZXJIICA9IG1haW5OYXZJbm5lci5oYXNDbGFzcygnaW4nKSA/IG1haW5OYXZJbm5lci5oZWlnaHQoKSA6IDAsXHJcblx0XHRcdFx0XHRcdG5hdmJhckggICAgICAgPSBuYXZiYXJIZWFkZXJIICsgbmF2YmFySW5uZXJILFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJNZyAgICAgID0gMCxcclxuXHRcdFx0XHRcdFx0bmF2YmFyVG9wICAgICA9IG1haW5OYXZCYXIub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wLFxyXG5cclxuXHRcdFx0XHRcdFx0c2Nyb2xsSGFuZGxlciA9ICQudGhyb3R0bGUoIDUwLCBuYXZTdG9wU2Nyb2xsICk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5wYWdlWydzaG93LWFkbWluLWJhciddICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgYWRtaW5CYXJIID0gJCgnI3dwYWRtaW5iYXInKS5oZWlnaHQoKTtcclxuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XHJcblx0XHRcdFx0XHRcdG5hdndyYXBUb3AgLT0gYWRtaW5CYXJIO1xyXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgIC09IGFkbWluQmFySDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHRcdFx0bmF2YmFyTWcgPSBuYXZiYXJIZWFkZXJIICogLTE7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBuYXZiYXJIID4gdmlld3BvcnRIICkge1xyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcik7XHJcblx0XHRcdFx0XHRcdGlmICggbWFpbk5hdkJhci5ub3QoJ3N0b3BwZWQnKSApIHtcclxuXHRcdFx0XHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSwgJ21hcmdpbi10b3AnOiAnMCcgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcik7XHJcblx0XHRcdFx0XHRcdG1haW5OYXZCYXIuY3NzKHsgJ3Bvc2l0aW9uJzogJycsICd0b3AnOiAnJywgJ21hcmdpbi10b3AnOiBuYXZiYXJNZyB9KS5yZW1vdmVDbGFzcygnc3RvcHBlZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gbmF2U3RvcFNjcm9sbCgpIHtcclxuXHRcdFx0XHRcdHZhciB2aWV3U2Nyb2xsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRcdHN0b3BTY3JvbGwgPSBtYWluTmF2QmFyLmhhc0NsYXNzKCdzdG9wcGVkJykgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIHZpZXdwb3J0UyA+IG1haW5OYXZIZWFkLm9mZnNldCgpLnRvcCApIHsgc3RvcFNjcm9sbCA9IGZhbHNlOyB9XHJcblx0XHRcdFx0XHRpZiAoIHZpZXdwb3J0UyA+IHZpZXdTY3JvbGwgJiYgc3RvcFNjcm9sbCApIHsgdmlld3BvcnQuc2Nyb2xsVG9wKHZpZXdwb3J0Uyk7IH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNob3cvaGlkZSBTdWJtZW51cyBPbiBIYW5kbGUgQ2xpY2tcclxuXHJcblx0XHRcdCQoJy5kcm9wZG93bi10b2dnbGUnLCBtYWluTmF2QmFyKS5vbignY2xpY2sgdG91Y2hzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCAkKGV2ZW50LnRhcmdldCkuaXMoJy5kcm9wLWFycm93JykgKSB7XHJcblx0XHRcdFx0XHRpZiggZXZlbnQuaGFuZGxlZCAhPT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdFx0bWVudSAgID0gaGFuZGxlLmNsb3Nlc3QoJy5tZW51LWl0ZW0nKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICggbWVudS5oYXNDbGFzcygnZXhwYW5kJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0bWVudS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcblx0XHRcdFx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1lbnUpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRtZW51LmFkZENsYXNzKCdleHBhbmQnKS5zaWJsaW5ncygnbGknKS5yZW1vdmVDbGFzcygnZXhwYW5kJykuZmluZCgnLmV4cGFuZCcpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0bmF2U2Nyb2xsKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRldmVudC5oYW5kbGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1haW5OYXZCYXIpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRuYXZTY3JvbGwoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRuYXZTY3JvbGwoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBSVU4gTkFWQkFSIEZVTkNUSU9OU1xyXG5cclxuXHQvLyBDaGVjayB3aGljaCBtZWRpYSBxdWVyaWVzIGFyZSBhY3RpdmVcclxuXHR2YXIgbXFDaGVjayA9IGZ1bmN0aW9uKCBlbGVtICkge1xyXG5cdFx0ZWxlbSA9ICQoJyMnICsgZWxlbSk7XHJcblx0XHR2YXIgZGlzcGxheSA9IGVsZW0uY3NzKCdkaXNwbGF5Jyk7XHJcblxyXG5cdFx0aWYgKCBkaXNwbGF5ID09ICdibG9jaycgKSB7IHJldHVybiAxOyB9XHJcblx0XHRlbHNlIGlmICggZGlzcGxheSA9PSAnaW5saW5lJykgeyByZXR1cm4gMjsgfVxyXG5cdFx0ZWxzZSB7IHJldHVybiAwOyB9XHJcblx0fTtcclxuXHJcblx0Ly8gSGFuZGxlIG5hdmJhciBpdGVtcyBvdmVybGFwcGluZ1xyXG5cdHZhciBtYWluTmF2Q29udCAgICA9IG1haW5OYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdG1haW5OYXZMb2dvQ2xzID0gbWFpbk5hdldyYXAuYXR0cignZGF0YS1sb2dvLWFsaWduJyksXHJcblx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IDAsXHJcblxyXG5cdFx0c2VjTmF2Q29udCA9IHNlY05hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxyXG5cdFx0c2VjTmF2SXRlbXNXaWR0aCA9IDA7XHJcblxyXG5cdGlmICggbWFpbk5hdkxvZ29DbHMgIT0gJ2xvZ28tY2VudGVyJyApIHtcclxuXHRcdG1haW5OYXZJdGVtc1dpZHRoID0gbWFpbk5hdkhlYWQub3V0ZXJXaWR0aCh0cnVlKSArICQoJyNtYWluLW1lbnUnKS5vdXRlcldpZHRoKHRydWUpO1xyXG5cdH1cclxuXHRpZiAoIHNlY05hdkJhci5sZW5ndGggKSB7XHJcblx0XHRzZWNOYXZJdGVtc1dpZHRoID0gJCgnLmxlZnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcucmlnaHQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSk7XHJcblx0fVxyXG5cclxuXHQvLyBFbmFibGUgTWVudSBIb3ZlciBPbiBUb3VjaCBTY3JlZW5zXHJcblx0dmFyIG1lbnVQYXJlbnRzID0gbmF2YmFycy5maW5kKCcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiwgbGkuZHJvcGRvd24nKTtcclxuXHRmdW5jdGlvbiBtZW51VG91Y2hIb3ZlcihldmVudCkge1xyXG5cdFx0dmFyIGxpbmsgPSAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KSxcclxuXHRcdFx0YW5jZXN0b3JzID0gbGluay5wYXJlbnRzKCcuaG92ZXInKTtcclxuXHRcdGlmIChsaW5rLmhhc0NsYXNzKCdob3ZlcicpKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGluay5hZGRDbGFzcygnaG92ZXInKTtcclxuXHRcdFx0bWVudVBhcmVudHMubm90KGxpbmspLm5vdChhbmNlc3RvcnMpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIG1lbnVUb3VjaFJlbW92ZUhvdmVyKGV2ZW50KSB7XHJcblx0XHRpZiAoICEgJChldmVudC5kZWxlZ2F0ZVRhcmdldCkuaXMobWVudVBhcmVudHMpICkgeyBtZW51UGFyZW50cy5yZW1vdmVDbGFzcygnaG92ZXInKTsgfVxyXG5cdH1cclxuXHJcblx0Ly8gRnVuY3Rpb25zIFJ1biBPbiBMb2FkICYgV2luZG93IFJlc2l6ZVxyXG5cdGZ1bmN0aW9uIG5hdmJhckZuKCkge1xyXG5cclxuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soJ25hdmJhci1jaGVjaycpOyAvLyBFcXVhbHMgXCIwXCIgZm9yIGRlc2t0b3AsIFwiMVwiIGZvciBtb2JpbGUgYW5kIFwiMlwiIGZvciB0YWJsZXRzXHJcblxyXG5cdFx0Ly8gUnVuIGZ1bmN0aW9uIHRvIHByZXZlbnQgc3VibWVudXMgZ29pbmcgb3V0c2lkZSB2aWV3cG9ydFxyXG5cdFx0bmF2YmFycy5ub3QobWFpbk5hdkJhcikuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdG5hdmJhck9iai5tZW51T3ZlcmZsb3coJCgnLm5hdmJhci1pbm5lcicsIHRoaXMpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJ1biBmdW5jdGlvbnMgYmFzZWQgb24gY3VycmVudGx5IGFjdGl2ZSBtZWRpYSBxdWVyeVxyXG5cdFx0aWYgKCBtcU5hdiA9PT0gMCApIHtcclxuXHRcdFx0bmF2YmFyT2JqLm1lbnVPdmVyZmxvdyhtYWluTmF2SW5uZXIpO1xyXG5cdFx0XHRtYWluTmF2QmFyLmNzcygnaGVpZ2h0JywgJycpO1xyXG5cclxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRuYXZiYXJPYmoubWVnYU1lbnVUb2dnbGUoJ2VuYWJsZScsICQodGhpcykpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG1lbnVQYXJlbnRzLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoSG92ZXIpO1xyXG5cdFx0XHRib2R5RWwub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XHJcblx0XHR9IGVsc2UgaWYgKCBtcU5hdiA+IDAgKSB7XHJcblx0XHRcdG5hdmJhck9iai5uYXZNb2JpbGUobXFOYXYpO1xyXG5cclxuXHRcdFx0dmFyIG5hdkhlaWdodCA9IG1haW5OYXZIZWFkLm91dGVySGVpZ2h0KCkgKyAxO1xyXG5cdFx0XHRtYWluTmF2QmFyLmNzcygnaGVpZ2h0JywgbmF2SGVpZ2h0KTtcclxuXHJcblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLm1lZ2FNZW51VG9nZ2xlKCdkaXNhYmxlJywgJCh0aGlzKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWVudVBhcmVudHMub2ZmKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoSG92ZXIpO1xyXG5cdFx0XHRib2R5RWwub2ZmKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoUmVtb3ZlSG92ZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE1ha2UgcHJpbWFyeSBuYXZiYXIgc3RpY2t5IGlmIG9wdGlvbiBlbmFibGVkXHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7XHJcblx0XHRcdGlmICggbXFOYXYgPT09IDEgKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLnN0aWNreU5hdih0cnVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuYXZiYXJPYmouc3RpY2t5TmF2KGZhbHNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygncG9zaXRpb24tdG9wJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmF2YmFyT3ZlcmxhcCgpO1xyXG5cdH1cclxuXHJcblx0Ly8gSGFuZGxlIE5hdmJhciBJdGVtcyBPdmVybGFwXHJcblx0ZnVuY3Rpb24gbmF2YmFyT3ZlcmxhcCgpIHtcclxuXHJcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCduYXZiYXItY2hlY2snKTtcclxuXHJcblx0XHQvLyBQcmltYXJ5IE5hdmJhclxyXG5cdFx0aWYgKCBtYWluTmF2TG9nb0NscyAhPSAnbG9nby1jZW50ZXInICkge1xyXG5cdFx0XHRpZiAoIG1xTmF2ID09PSAwICkge1xyXG5cdFx0XHRcdHZhciBtYWluTmF2Q29udFdpZHRoID0gbWFpbk5hdkNvbnQuaW5uZXJXaWR0aCgpO1xyXG5cdFx0XHRcdGlmICggbWFpbk5hdkl0ZW1zV2lkdGggPiBtYWluTmF2Q29udFdpZHRoICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MobWFpbk5hdkxvZ29DbHMpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygnbG9nby1jZW50ZXInKS5hZGRDbGFzcyhtYWluTmF2TG9nb0Nscyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKG1haW5OYXZMb2dvQ2xzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNlY29uZGFyeSBOYXZiYXJcclxuXHRcdGlmICggc2VjTmF2QmFyLmxlbmd0aCApIHtcclxuXHRcdFx0dmFyIHNlY05hdkNvbnRXaWR0aCA9IHNlY05hdkNvbnQuaW5uZXJXaWR0aCgpO1xyXG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLmFkZENsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0bmF2YmFyT3ZlcmxhcCgpO1xyXG5cclxuXHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0bmF2YmFyT2JqLmluaXQoJCh0aGlzKSk7XHJcblx0fSk7XHJcblxyXG5cdG5hdmJhckZuKCk7XHJcblxyXG5cdG5hdmJhck9iai5tZWdhTWVudVJvd3MoKTtcclxuXHJcblx0JCh3aW5kb3cpLnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBuYXZiYXJGbiApKTtcclxuXHJcbn0oalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuTUlYVCBQT1NUIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0LCBpZnJhbWVBc3BlY3QgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpO1xyXG5cclxuXHQvLyBQb3N0IExheW91dFxyXG5cdGZ1bmN0aW9uIHBvc3RzUGFnZSgpIHtcclxuXHJcblx0XHQvLyBGZWF0dXJlZCBHYWxsZXJ5IFNsaWRlclxyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodFNsaWRlciA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIGdhbGxlcnlTbGlkZXIgPSAkKCcuZ2FsbGVyeS1zbGlkZXInKS5ub3QoJy5saWdodFNsaWRlcicpO1xyXG5cdFx0XHRnYWxsZXJ5U2xpZGVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Z2FsbGVyeVNsaWRlci5saWdodFNsaWRlcih7XHJcblx0XHRcdFx0XHRpdGVtOiAxLFxyXG5cdFx0XHRcdFx0YXV0bzogdHJ1ZSxcclxuXHRcdFx0XHRcdGxvb3A6IHRydWUsXHJcblx0XHRcdFx0XHRwYWdlcjogZmFsc2UsXHJcblx0XHRcdFx0XHRwYXVzZTogNTAwMCxcclxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2xpZGVNYXJnaW46IDAsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRHYWxsZXJ5ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgbGlnaHRHYWxsZXJ5ID0gJCgnLmxpZ2h0Ym94LWdhbGxlcnknKTtcclxuXHRcdFx0bGlnaHRHYWxsZXJ5LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bGlnaHRHYWxsZXJ5LmxpZ2h0R2FsbGVyeSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcXVhbGl6ZSBmZWF0dXJlZCBtZWRpYSBoZWlnaHQgZm9yIHJlbGF0ZWQgcG9zdHMgYW5kIGdyaWQgYmxvZ1xyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIG1hdGNoSGVpZ2h0RWwgPSAkKCcuYmxvZy1ncmlkIC5ibG9nLXBvc3QgLnBvc3QtZmVhdCwgLnBvc3QtcmVsYXRlZCAucG9zdC1mZWF0Jyk7XHJcblx0XHRcdG1hdGNoSGVpZ2h0RWwuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRtYXRjaEhlaWdodEVsLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRcclxuXHQvLyBSZXNpemUgRW1iZWRkZWQgVmlkZW9zIFByb3BvcnRpb25hbGx5XHJcblx0aWZyYW1lQXNwZWN0KCAkKCcucG9zdCBpZnJhbWUnKSApO1xyXG5cclxuXHJcblx0Ly8gTG9hZCBQb3N0cyAmIENvbW1lbnRzIHZpYSBBamF4XHJcblx0ZnVuY3Rpb24gbWl4dEFqYXhMb2FkKHR5cGUpIHtcclxuXHRcdHR5cGUgPSB0eXBlIHx8ICdwb3N0cyc7XHJcblx0XHR2YXIgcGFnQ29udCA9ICQoJy5wYWdpbmctbmF2aWdhdGlvbicpLFxyXG5cdFx0XHRhamF4QnRuID0gJCgnLmFqYXgtbW9yZScsIHBhZ0NvbnQpLFxyXG5cdFx0XHRwYWdlTm93ID0gcGFnQ29udC5kYXRhKCdwYWdlLW5vdycpLFxyXG5cdFx0XHRwYWdlTWF4ID0gcGFnQ29udC5kYXRhKCdwYWdlLW1heCcpLFxyXG5cdFx0XHRwYWdlTnVtLFxyXG5cdFx0XHRwYWdlVHlwZSxcclxuXHRcdFx0bmV4dFVybCxcclxuXHRcdFx0Y29udGFpbmVyLFxyXG5cdFx0XHRlbGVtZW50LFxyXG5cdFx0XHRsb2FkU2VsO1xyXG5cclxuXHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xyXG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xyXG5cdFx0XHRuZXh0VXJsICAgPSBtaXh0X29wdC5sYXlvdXRbJ25leHQtdXJsJ107XHJcblx0XHRcdGNvbnRhaW5lciA9ICQoJy5wb3N0cy1jb250YWluZXInKTtcclxuXHRcdFx0ZWxlbWVudCAgID0gJy5hcnRpY2xlJztcclxuXHRcdFx0bG9hZFNlbCAgID0gJyAucG9zdHMtY29udGFpbmVyIC5hcnRpY2xlJztcclxuXHRcdH0gZWxzZSBpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyApIHtcclxuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddO1xyXG5cdFx0XHRuZXh0VXJsICAgPSBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtbmV4dC11cmwnXTtcclxuXHRcdFx0Y29udGFpbmVyID0gJCgnLmNvbW1lbnQtbGlzdCcpO1xyXG5cdFx0XHRlbGVtZW50ICAgPSAnLmNvbW1lbnQnO1xyXG5cdFx0XHRsb2FkU2VsICAgPSAnIC5jb21tZW50LWxpc3QgPiBsaSc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddID09ICduZXdlc3QnICkge1xyXG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyAtIDE7XHJcblx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL2NvbW1lbnQtcGFnZS1bMC05XT8vLCAnL2NvbW1lbnQtcGFnZS0nICsgcGFnZU51bSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyArIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAoIHBhZ2VOb3cgPj0gcGFnZU1heCApICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSAhPSAnbmV3ZXN0JyB8fCBwYWdlTnVtIDw9IDAgKSB7XHJcblx0XHRcdGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhamF4QnRuLm9uKCdjbGljayBjb250OmJvdHRvbScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0Ly8gUHJldmVudCBsb2FkaW5nIHR3aWNlIG9uIHNjcm9sbFxyXG5cdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xyXG5cdFx0XHJcblx0XHRcdC8vIEFyZSB0aGVyZSBtb3JlIHBhZ2VzIHRvIGxvYWQ/XHJcblx0XHRcdGlmICggcGFnZU51bSA+IDAgJiYgcGFnZU51bSA8PSBwYWdlTWF4ICkge1xyXG5cdFx0XHRcclxuXHRcdFx0XHRhamF4QnRuLmJ1dHRvbignbG9hZGluZycpO1xyXG5cclxuXHRcdFx0XHQvLyBMb2FkIHBvc3RzXHJcblx0XHRcdFx0LyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cclxuXHRcdFx0XHQkKCc8ZGl2PicpLmxvYWQobmV4dFVybCArIGxvYWRTZWwsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhocikge1xyXG5cdFx0XHRcdFx0dmFyIG5ld1Bvc3RzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0XHRhamF4QnRuLmJsdXIoKTtcclxuXHJcblx0XHRcdFx0XHRuZXdQb3N0cy5jaGlsZHJlbihlbGVtZW50KS5hZGRDbGFzcygnYWpheC1uZXcnKTtcclxuXHRcdFx0XHRcdGlmICggdHlwZSA9PSAncG9zdHMnICYmIG1peHRfb3B0LmxheW91dC50eXBlICE9ICdtYXNvbnJ5JyAmJiBtaXh0X29wdC5wYWdlWydzaG93LXBhZ2UtbnInXSApIHtcclxuXHRcdFx0XHRcdFx0bmV3UG9zdHMucHJlcGVuZCgnPGRpdiBjbGFzcz1cImFqYXgtcGFnZSBwYWdlLScrIHBhZ2VOdW0gKydcIj48YSBocmVmPVwiJysgbmV4dFVybCArJ1wiPlBhZ2UgJysgcGFnZU51bSArJzwvYT48L2Rpdj4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmQobmV3UG9zdHMuaHRtbCgpKTtcclxuXHJcblx0XHRcdFx0XHRuZXdQb3N0cyA9IGNvbnRhaW5lci5jaGlsZHJlbignLmFqYXgtbmV3Jyk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHBhZ2UgbnVtYmVyIGFuZCBuZXh0VXJsXHJcblx0XHRcdFx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcclxuXHRcdFx0XHRcdFx0cGFnZU51bSsrO1xyXG5cdFx0XHRcdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9wYWdlXFwvWzAtOV0/LywgJy9wYWdlLycgKyBwYWdlTnVtKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmICggbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddID09ICduZXdlc3QnICkge1xyXG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0tLTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRwYWdlTnVtKys7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBidXR0b24gc3RhdGVcclxuXHRcdFx0XHRcdGlmICggcGFnZU51bSA8PSBwYWdlTWF4ICYmIHBhZ2VOdW0gPiAwICkgeyBhamF4QnRuLmJ1dHRvbigncmVzZXQnKTsgfVxyXG5cdFx0XHRcdFx0ZWxzZSB7IGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpOyB9XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIGxheW91dCBvbmNlIHBvc3RzIGhhdmUgbG9hZGVkXHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0bmV3UG9zdHMucmVtb3ZlQ2xhc3MoJ2FqYXgtbmV3Jyk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xyXG5cdFx0XHRcdFx0XHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cdFx0XHRcdFx0XHRcdHBvc3RzUGFnZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRjb250YWluZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pc290b3BlKCdhcHBlbmRlZCcsIG5ld1Bvc3RzKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSwgMTAwKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgKSB7IHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTsgfVxyXG5cclxuXHRcdFx0XHRcdC8vIEhhbmRsZSBFcnJvcnNcclxuXHRcdFx0XHRcdGlmICggc3RhdHVzID09ICdlcnJvcicgKSB7XHJcblx0XHRcdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0XHQvLyBEZWJ1Z2dpbmcgaW5mb1xyXG5cdFx0XHRcdFx0XHQvLyBhbGVydCgnQUpBWCBFcnJvcjogJyArIHhoci5zdGF0dXMgKyAnICcgKyB4aHIuc3RhdHVzVGV4dCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBUcmlnZ2VyIEFKQVggbG9hZCB1cG9uIHJlYWNoaW5nIGJvdHRvbSBvZiBwYWdlXHJcblx0XHR2YXIgYWpheFNjcm9sbEhhbmRsZSA9ICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0LyogZ2xvYmFsIGVsZW1WaXNpYmxlICovXHJcblx0XHRcdFx0aWYgKCBlbGVtVmlzaWJsZShhamF4QnRuLCB2aWV3cG9ydCkgPT09IHRydWUgKSB7XHJcblx0XHRcdFx0XHRhamF4QnRuLnRyaWdnZXIoJ2NvbnQ6Ym90dG9tJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyAmJiBhamF4QnRuLmxlbmd0aCApIHtcclxuXHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyBFeGVjdXRlIEZ1bmN0aW9uIFdoZXJlIEFwcGxpY2FibGVcclxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Bvc3RzLXBhZ2UnXSAmJiBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRtaXh0QWpheExvYWQoJ3Bvc3RzJyk7XHJcblx0fVxyXG5cdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ3NpbmdsZScgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcclxuXHRcdG1peHRBamF4TG9hZCgnY29tbWVudHMnKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIFdpbmRvdyBSZXNpemVcclxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcclxuXHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cdH1cclxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgcmVzaXplRm4gKSk7XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIExvYWRcclxuXHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRwb3N0c1BhZ2UoKTtcclxuXHJcblx0XHQvLyBJc290b3BlIE1hc29ucnkgSW5pdFxyXG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIGJsb2dDb250ID0gJCgnLmJsb2ctbWFzb25yeSAucG9zdHMtY29udGFpbmVyJyk7XHJcblxyXG5cdFx0XHRibG9nQ29udC5pc290b3BlKHtcclxuXHRcdFx0XHRpdGVtU2VsZWN0b3I6ICcuYXJ0aWNsZScsXHJcblx0XHRcdFx0bGF5b3V0OiAnbWFzb25yeScsXHJcblx0XHRcdFx0Z3V0dGVyOiAwXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0YmxvZ0NvbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0pO1xyXG5cdFx0XHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7IGJsb2dDb250Lmlzb3RvcGUoJ2xheW91dCcpOyB9ICkpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBUcmlnZ2VyIExpZ2h0Ym94IE9uIEZlYXR1cmVkIEltYWdlIENsaWNrXHJcblx0XHQkKCcubGlnaHRib3gtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLnNpYmxpbmdzKCcuZ2FsbGVyeScpLmZpbmQoJ2xpJykuZmlyc3QoKS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8vIFJlbGF0ZWQgUG9zdHMgU2xpZGVyXHJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgcmVsUG9zdHNTbGlkZXIgPSAkKCcucG9zdC1yZWxhdGVkIC5zbGlkZXItY29udCcpO1xyXG5cdFx0XHRyZWxQb3N0c1NsaWRlci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmxpZ2h0U2xpZGVyKHtcclxuXHRcdFx0XHRcdGl0ZW06IDMsXHJcblx0XHRcdFx0XHRwYWdlcjogZmFsc2UsXHJcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcclxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAyMCxcclxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFt7XHJcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDk2MCxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogMyB9XHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDUwMCxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogMiB9XHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oZWwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHQkKCcucG9zdC1mZWF0JywgcmVsUG9zdHNTbGlkZXIpLm1hdGNoSGVpZ2h0KCk7XHJcblx0XHRcdFx0XHRcdFx0cmVsUG9zdHNTbGlkZXIuY3NzKCdoZWlnaHQnLCAnJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59KGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcblVJIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gRmxpcCBDYXJkIEVxdWFsaXplIEhlaWdodFxyXG5cdGlmICggdHlwZW9mICQuZm4ubWF0Y2hIZWlnaHQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHR2YXIgZmxpcGNhcmRTaWRlcyA9ICQoJy5mbGlwLWNhcmQgLmZyb250LCAuZmxpcC1jYXJkIC5iYWNrJyk7XHJcblx0XHRmbGlwY2FyZFNpZGVzLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGZsaXBjYXJkU2lkZXMuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufShqUXVlcnkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
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

'use strict'; /* jshint unused: false */


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


// Fix WPML Dropdown
jQuery('.menu-item-language').addClass('dropdown drop-menu').find('.sub-menu').addClass('dropdown-menu');

// Fix PolyLang Menu Items And Make Them Dropdown
jQuery('.menu-item.lang-item').removeClass('disabled');

jQuery( function() {
	var item = jQuery('.lang-item.current-lang');
	if (item.length === 0) {
		item = jQuery('.lang-item').first();
	}
	var langs = item.siblings('.lang-item');
	item.addClass('dropdown drop-menu');
	langs.wrapAll('<ul class="sub-menu dropdown-menu"></ul>').parent().appendTo(item);
});
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-flexbox-rgba-history-audio-video-svgclippaths-shiv-cssclasses
 */
;window.Modernizr=function(a,b,c){function y(a){j.cssText=a}function z(a,b){return y(prefixes.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={svg:"http://www.w3.org/2000/svg"},q={},r={},s={},t=[],u=t.slice,v,w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.flexbox=function(){return E("flexWrap")},q.history=function(){return!!a.history&&!!history.pushState},q.rgba=function(){return y("background-color:rgba(150,255,150,.5)"),B(j.backgroundColor,"rgba")},q.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},q.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},q.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(l.call(b.createElementNS(p.svg,"clipPath")))};for(var F in q)x(q,F)&&(v=F.toLowerCase(),e[v]=q[F](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document);
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
HELPER FUNCTIONS
/ ------------------------------------------------ */

'use strict';

( function($) {

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
	
	var widgetNavMenus = '.widget_meta, .widget_recent_entries, .widget_archive, .widget_categories, .widget_nav_menu, .widget_pages';
	// WooCommerce Widgets
	widgetNavMenus += ', .widget_product_categories, .widget_products, .widget_top_rated_products, .widget_recent_reviews, .widget_recently_viewed_products';

	$(widgetNavMenus).children('ul').addClass('nav');
	$('.widget_nav_menu ul.menu').addClass('nav');

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

	$('.widget_layered_nav li').each( function() {
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

})(jQuery);

/* ------------------------------------------------ /
NAVBAR FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt, colorLoD */

	var viewport     = $(window),
		bodyEl       = $('body'),
		mainWrap     = $('#main-wrap'),
		mainNavBar   = $('#main-nav'),
		mainNavWrap  = $('#main-nav-wrap'),
		mainNavHead  = $('.navbar-header', mainNavBar),
		mainNavInner = $('.navbar-inner', mainNavBar),
		secNavBar    = $('#second-nav'),
		navbars      = $('.navbar'),
		mediaWrap    = $('.head-media');

	if ( mainNavBar.length === 0 ) return;

	var navbarObj = {

		navBg: '',
		navBgTop: '',

		// Initialize Navbar

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
	function navbarOverlap() {

		var mqNav = mqCheck('navbar-check');

		// Primary Navbar
		if ( mainNavLogoCls != 'logo-center' ) {
			if ( mqNav === 0 ) {
				var mainNavContWidth = mainNavCont.width();
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

	viewport.resize( $.debounce( 500, navbarFn ));

}(jQuery);

/* ------------------------------------------------ /
POST FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt, iframeAspect */

	var viewport = $(window);

	// Resize Embedded Videos Proportionally
	iframeAspect( $('.post iframe') );

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
			var matchHeightEl = $('.blog-grid .posts-container .post-feat, .post-related .post-feat');
			matchHeightEl.imagesLoaded( function() {
				matchHeightEl.addClass('fix-height').matchHeight({
					target: $('.wp-post-image'),
				});
			});
		}
	}


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
						breakpoint: 540,
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

		if ( link.data('no-hash-scroll') ) return;

		if ( hash.length ) {
			e.preventDefault();
			var target = $(hash);
			if ( target.length) {
				/* global breakpoint */
				var hashOffset = $(hash).offset().top;
				if ( mixt_opt.nav.mode == 'fixed' && breakpoint.name != 'pluto' && breakpoint.name != 'mercury' ) { hashOffset -= $('#main-nav').outerHeight(); }
				htmlEl.add(bodyEl).animate({ scrollTop: hashOffset }, 600);
			}
			window.location.hash = hash;
		}
	});
	// Ignore specific anchors
	$('.tabs a, .vc_tta a').attr('data-no-hash-scroll', true);


	// Social Icons
	$('.social-links').not('.hover-none').each( function() {
		var cont = $(this);

		cont.children().each( function() {
			var icon = $(this),
				link = icon.children('a'),
				dataColor = link.attr('data-color');

			if ( cont.hasClass('hover-bg') ) {
				link.hover( function() {
					if ( cont.parents('.position-top').length === 0 && cont.parents('.no-hover-bg').length === 0 ) {
						link.css({ backgroundColor: dataColor, borderColor: dataColor, zIndex: 1 });
					}
				}, function() { link.css({ backgroundColor: '', borderColor: '', zIndex: '' }); });
			} else {
				link.hover( function() {
					if ( cont.parents('.navbar.position-top').length === 0 ) {
						link.css({ color: dataColor, zIndex: 1 });
					}
				}, function() { link.css({ color: '', zIndex: '' }); });
			}
		});
	});


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


	// Back To Top Button
	function backToTopDisplay() {
		var scrollTop = viewport.scrollTop();
		if ( scrollTop > 200 ) {
			backToTop.fadeIn(300);
		} else {
			backToTop.fadeOut(300);
		}
	}

	var backToTop = $('#back-to-top');

	if ( backToTop.length ) {
		viewport.on('scroll', $.throttle( 1000, backToTopDisplay )).scroll();

		backToTop.click( function() {
			htmlEl.add(bodyEl).animate({ scrollTop: 0 }, 600);
		});
	}

}(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiRWxlbWVudFF1ZXJpZXMuanMiLCJob3ZlckludGVudC5qcyIsImltYWdlc2xvYWRlZC5wa2dkLm1pbi5qcyIsIm1hdGNoSGVpZ2h0LmpzIiwibWl4dC1wbHVnaW5zLmpzIiwibW9kZXJuaXpyLmpzIiwiUmVzaXplU2Vuc29yLmpzIiwiZWxlbWVudHMuanMiLCJoZWFkZXIuanMiLCJoZWxwZXJzLmpzIiwibmF2YmFyLmpzIiwicG9zdC5qcyIsInVpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2UgLSB2MS4xIC0gMy83LzIwMTBcbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbiAqIFxuICogQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbiAqL1xuXG4vLyBTY3JpcHQ6IGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlOiBTb21ldGltZXMsIGxlc3MgaXMgbW9yZSFcbi8vXG4vLyAqVmVyc2lvbjogMS4xLCBMYXN0IHVwZGF0ZWQ6IDMvNy8yMDEwKlxuLy8gXG4vLyBQcm9qZWN0IEhvbWUgLSBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS1wbHVnaW4vXG4vLyBHaXRIdWIgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL1xuLy8gU291cmNlICAgICAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9yYXcvbWFzdGVyL2pxdWVyeS5iYS10aHJvdHRsZS1kZWJvdW5jZS5qc1xuLy8gKE1pbmlmaWVkKSAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9yYXcvbWFzdGVyL2pxdWVyeS5iYS10aHJvdHRsZS1kZWJvdW5jZS5taW4uanMgKDAuN2tiKVxuLy8gXG4vLyBBYm91dDogTGljZW5zZVxuLy8gXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW4sXG4vLyBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbi8vIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbi8vIFxuLy8gQWJvdXQ6IEV4YW1wbGVzXG4vLyBcbi8vIFRoZXNlIHdvcmtpbmcgZXhhbXBsZXMsIGNvbXBsZXRlIHdpdGggZnVsbHkgY29tbWVudGVkIGNvZGUsIGlsbHVzdHJhdGUgYSBmZXdcbi8vIHdheXMgaW4gd2hpY2ggdGhpcyBwbHVnaW4gY2FuIGJlIHVzZWQuXG4vLyBcbi8vIFRocm90dGxlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy90aHJvdHRsZS9cbi8vIERlYm91bmNlIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9leGFtcGxlcy9kZWJvdW5jZS9cbi8vIFxuLy8gQWJvdXQ6IFN1cHBvcnQgYW5kIFRlc3Rpbmdcbi8vIFxuLy8gSW5mb3JtYXRpb24gYWJvdXQgd2hhdCB2ZXJzaW9uIG9yIHZlcnNpb25zIG9mIGpRdWVyeSB0aGlzIHBsdWdpbiBoYXMgYmVlblxuLy8gdGVzdGVkIHdpdGgsIHdoYXQgYnJvd3NlcnMgaXQgaGFzIGJlZW4gdGVzdGVkIGluLCBhbmQgd2hlcmUgdGhlIHVuaXQgdGVzdHNcbi8vIHJlc2lkZSAoc28geW91IGNhbiB0ZXN0IGl0IHlvdXJzZWxmKS5cbi8vIFxuLy8galF1ZXJ5IFZlcnNpb25zIC0gbm9uZSwgMS4zLjIsIDEuNC4yXG4vLyBCcm93c2VycyBUZXN0ZWQgLSBJbnRlcm5ldCBFeHBsb3JlciA2LTgsIEZpcmVmb3ggMi0zLjYsIFNhZmFyaSAzLTQsIENocm9tZSA0LTUsIE9wZXJhIDkuNi0xMC4xLlxuLy8gVW5pdCBUZXN0cyAgICAgIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9jb2RlL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS91bml0L1xuLy8gXG4vLyBBYm91dDogUmVsZWFzZSBIaXN0b3J5XG4vLyBcbi8vIDEuMSAtICgzLzcvMjAxMCkgRml4ZWQgYSBidWcgaW4gPGpRdWVyeS50aHJvdHRsZT4gd2hlcmUgdHJhaWxpbmcgY2FsbGJhY2tzXG4vLyAgICAgICBleGVjdXRlZCBsYXRlciB0aGFuIHRoZXkgc2hvdWxkLiBSZXdvcmtlZCBhIGZhaXIgYW1vdW50IG9mIGludGVybmFsXG4vLyAgICAgICBsb2dpYyBhcyB3ZWxsLlxuLy8gMS4wIC0gKDMvNi8yMDEwKSBJbml0aWFsIHJlbGVhc2UgYXMgYSBzdGFuZC1hbG9uZSBwcm9qZWN0LiBNaWdyYXRlZCBvdmVyXG4vLyAgICAgICBmcm9tIGpxdWVyeS1taXNjIHJlcG8gdjAuNCB0byBqcXVlcnktdGhyb3R0bGUgcmVwbyB2MS4wLCBhZGRlZCB0aGVcbi8vICAgICAgIG5vX3RyYWlsaW5nIHRocm90dGxlIHBhcmFtZXRlciBhbmQgZGVib3VuY2UgZnVuY3Rpb25hbGl0eS5cbi8vIFxuLy8gVG9waWM6IE5vdGUgZm9yIG5vbi1qUXVlcnkgdXNlcnNcbi8vIFxuLy8galF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgYmVjYXVzZSBub3RoaW5nIGludGVybmFsXG4vLyB1c2VzIGFueSBqUXVlcnkgbWV0aG9kcyBvciBwcm9wZXJ0aWVzLiBqUXVlcnkgaXMganVzdCB1c2VkIGFzIGEgbmFtZXNwYWNlXG4vLyB1bmRlciB3aGljaCB0aGVzZSBtZXRob2RzIGNhbiBleGlzdC5cbi8vIFxuLy8gU2luY2UgalF1ZXJ5IGlzbid0IGFjdHVhbGx5IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgaWYgalF1ZXJ5IGRvZXNuJ3QgZXhpc3Rcbi8vIHdoZW4gdGhpcyBwbHVnaW4gaXMgbG9hZGVkLCB0aGUgbWV0aG9kIGRlc2NyaWJlZCBiZWxvdyB3aWxsIGJlIGNyZWF0ZWQgaW5cbi8vIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UuIFVzYWdlIHdpbGwgYmUgZXhhY3RseSB0aGUgc2FtZSwgYnV0IGluc3RlYWQgb2Zcbi8vICQubWV0aG9kKCkgb3IgalF1ZXJ5Lm1ldGhvZCgpLCB5b3UnbGwgbmVlZCB0byB1c2UgQ293Ym95Lm1ldGhvZCgpLlxuXG4oZnVuY3Rpb24od2luZG93LHVuZGVmaW5lZCl7XG4gICckOm5vbXVuZ2UnOyAvLyBVc2VkIGJ5IFlVSSBjb21wcmVzc29yLlxuICBcbiAgLy8gU2luY2UgalF1ZXJ5IHJlYWxseSBpc24ndCByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIHVzZSBgalF1ZXJ5YCBhcyB0aGVcbiAgLy8gbmFtZXNwYWNlIG9ubHkgaWYgaXQgYWxyZWFkeSBleGlzdHMsIG90aGVyd2lzZSB1c2UgdGhlIGBDb3dib3lgIG5hbWVzcGFjZSxcbiAgLy8gY3JlYXRpbmcgaXQgaWYgbmVjZXNzYXJ5LlxuICB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LkNvd2JveSB8fCAoIHdpbmRvdy5Db3dib3kgPSB7fSApLFxuICAgIFxuICAgIC8vIEludGVybmFsIG1ldGhvZCByZWZlcmVuY2UuXG4gICAganFfdGhyb3R0bGU7XG4gIFxuICAvLyBNZXRob2Q6IGpRdWVyeS50aHJvdHRsZVxuICAvLyBcbiAgLy8gVGhyb3R0bGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIEVzcGVjaWFsbHkgdXNlZnVsIGZvciByYXRlIGxpbWl0aW5nXG4gIC8vIGV4ZWN1dGlvbiBvZiBoYW5kbGVycyBvbiBldmVudHMgbGlrZSByZXNpemUgYW5kIHNjcm9sbC4gSWYgeW91IHdhbnQgdG9cbiAgLy8gcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiB0byBhIHNpbmdsZSB0aW1lLCBzZWUgdGhlXG4gIC8vIDxqUXVlcnkuZGVib3VuY2U+IG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICBYICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgWFxuICAvLyA+IFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vIFxuICAvLyBVc2FnZTpcbiAgLy8gXG4gIC8vID4gdmFyIHRocm90dGxlZCA9IGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKTtcbiAgLy8gPiBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCB0aHJvdHRsZWQgKTtcbiAgLy8gXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcbiAgLy8gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBqUXVlcnkudGhyb3R0bGUoIGRlbGF5LCBbIG5vX3RyYWlsaW5nLCBdIGNhbGxiYWNrICkgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcbiAgLy8gXG4gIC8vIEFyZ3VtZW50czpcbiAgLy8gXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XG4gIC8vICAgIGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICAvLyAgbm9fdHJhaWxpbmcgLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBub190cmFpbGluZyBpc1xuICAvLyAgICB0cnVlLCBjYWxsYmFjayB3aWxsIG9ubHkgZXhlY3V0ZSBldmVyeSBgZGVsYXlgIG1pbGxpc2Vjb25kcyB3aGlsZSB0aGVcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9fdHJhaWxpbmcgaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25lIGZpbmFsIHRpbWUgYWZ0ZXIgdGhlIGxhc3RcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlblxuICAvLyAgICBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGUgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cbiAgLy8gICAgVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsIHRvXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICAvLyBcbiAgLy8gUmV0dXJuczpcbiAgLy8gXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCB0aHJvdHRsZWQsIGZ1bmN0aW9uLlxuICBcbiAgJC50aHJvdHRsZSA9IGpxX3Rocm90dGxlID0gZnVuY3Rpb24oIGRlbGF5LCBub190cmFpbGluZywgY2FsbGJhY2ssIGRlYm91bmNlX21vZGUgKSB7XG4gICAgLy8gQWZ0ZXIgd3JhcHBlciBoYXMgc3RvcHBlZCBiZWluZyBjYWxsZWQsIHRoaXMgdGltZW91dCBlbnN1cmVzIHRoYXRcbiAgICAvLyBgY2FsbGJhY2tgIGlzIGV4ZWN1dGVkIGF0IHRoZSBwcm9wZXIgdGltZXMgaW4gYHRocm90dGxlYCBhbmQgYGVuZGBcbiAgICAvLyBkZWJvdW5jZSBtb2Rlcy5cbiAgICB2YXIgdGltZW91dF9pZCxcbiAgICAgIFxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgbGFzdCB0aW1lIGBjYWxsYmFja2Agd2FzIGV4ZWN1dGVkLlxuICAgICAgbGFzdF9leGVjID0gMDtcbiAgICBcbiAgICAvLyBgbm9fdHJhaWxpbmdgIGRlZmF1bHRzIHRvIGZhbHN5LlxuICAgIGlmICggdHlwZW9mIG5vX3RyYWlsaW5nICE9PSAnYm9vbGVhbicgKSB7XG4gICAgICBkZWJvdW5jZV9tb2RlID0gY2FsbGJhY2s7XG4gICAgICBjYWxsYmFjayA9IG5vX3RyYWlsaW5nO1xuICAgICAgbm9fdHJhaWxpbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIFRoZSBgd3JhcHBlcmAgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgdGhyb3R0bGluZyAvIGRlYm91bmNpbmdcbiAgICAvLyBmdW5jdGlvbmFsaXR5IGFuZCB3aGVuIGV4ZWN1dGVkIHdpbGwgbGltaXQgdGhlIHJhdGUgYXQgd2hpY2ggYGNhbGxiYWNrYFxuICAgIC8vIGlzIGV4ZWN1dGVkLlxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIGVsYXBzZWQgPSArbmV3IERhdGUoKSAtIGxhc3RfZXhlYyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIFxuICAgICAgLy8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0X2V4ZWNgIHRpbWVzdGFtcC5cbiAgICAgIGZ1bmN0aW9uIGV4ZWMoKSB7XG4gICAgICAgIGxhc3RfZXhlYyA9ICtuZXcgRGF0ZSgpO1xuICAgICAgICBjYWxsYmFjay5hcHBseSggdGhhdCwgYXJncyApO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSB0aGlzIGlzIHVzZWQgdG8gY2xlYXIgdGhlIGZsYWdcbiAgICAgIC8vIHRvIGFsbG93IGZ1dHVyZSBgY2FsbGJhY2tgIGV4ZWN1dGlvbnMuXG4gICAgICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdGltZW91dF9pZCA9IHVuZGVmaW5lZDtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGlmICggZGVib3VuY2VfbW9kZSAmJiAhdGltZW91dF9pZCApIHtcbiAgICAgICAgLy8gU2luY2UgYHdyYXBwZXJgIGlzIGJlaW5nIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kXG4gICAgICAgIC8vIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbiksIGV4ZWN1dGUgYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dC5cbiAgICAgIHRpbWVvdXRfaWQgJiYgY2xlYXJUaW1lb3V0KCB0aW1lb3V0X2lkICk7XG4gICAgICBcbiAgICAgIGlmICggZGVib3VuY2VfbW9kZSA9PT0gdW5kZWZpbmVkICYmIGVsYXBzZWQgPiBkZWxheSApIHtcbiAgICAgICAgLy8gSW4gdGhyb3R0bGUgbW9kZSwgaWYgYGRlbGF5YCB0aW1lIGhhcyBiZWVuIGV4Y2VlZGVkLCBleGVjdXRlXG4gICAgICAgIC8vIGBjYWxsYmFja2AuXG4gICAgICAgIGV4ZWMoKTtcbiAgICAgICAgXG4gICAgICB9IGVsc2UgaWYgKCBub190cmFpbGluZyAhPT0gdHJ1ZSApIHtcbiAgICAgICAgLy8gSW4gdHJhaWxpbmcgdGhyb3R0bGUgbW9kZSwgc2luY2UgYGRlbGF5YCB0aW1lIGhhcyBub3QgYmVlblxuICAgICAgICAvLyBleGNlZWRlZCwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGBkZWxheWAgbXMgYWZ0ZXIgbW9zdFxuICAgICAgICAvLyByZWNlbnQgZXhlY3V0aW9uLlxuICAgICAgICAvLyBcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlXG4gICAgICAgIC8vIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgZmFsc2UgKGF0IGVuZCksIHNjaGVkdWxlIGBjYWxsYmFja2AgdG9cbiAgICAgICAgLy8gZXhlY3V0ZSBhZnRlciBgZGVsYXlgIG1zLlxuICAgICAgICB0aW1lb3V0X2lkID0gc2V0VGltZW91dCggZGVib3VuY2VfbW9kZSA/IGNsZWFyIDogZXhlYywgZGVib3VuY2VfbW9kZSA9PT0gdW5kZWZpbmVkID8gZGVsYXkgLSBlbGFwc2VkIDogZGVsYXkgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIC8vIFNldCB0aGUgZ3VpZCBvZiBgd3JhcHBlcmAgZnVuY3Rpb24gdG8gdGhlIHNhbWUgb2Ygb3JpZ2luYWwgY2FsbGJhY2ssIHNvXG4gICAgLy8gaXQgY2FuIGJlIHJlbW92ZWQgaW4galF1ZXJ5IDEuNCsgLnVuYmluZCBvciAuZGllIGJ5IHVzaW5nIHRoZSBvcmlnaW5hbFxuICAgIC8vIGNhbGxiYWNrIGFzIGEgcmVmZXJlbmNlLlxuICAgIGlmICggJC5ndWlkICkge1xuICAgICAgd3JhcHBlci5ndWlkID0gY2FsbGJhY2suZ3VpZCA9IGNhbGxiYWNrLmd1aWQgfHwgJC5ndWlkKys7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiB0aGUgd3JhcHBlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LmRlYm91bmNlXG4gIC8vIFxuICAvLyBEZWJvdW5jZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRGVib3VuY2luZywgdW5saWtlIHRocm90dGxpbmcsXG4gIC8vIGd1YXJhbnRlZXMgdGhhdCBhIGZ1bmN0aW9uIGlzIG9ubHkgZXhlY3V0ZWQgYSBzaW5nbGUgdGltZSwgZWl0aGVyIGF0IHRoZVxuICAvLyB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNlcmllcyBvZiBjYWxscywgb3IgYXQgdGhlIHZlcnkgZW5kLiBJZiB5b3Ugd2FudCB0b1xuICAvLyBzaW1wbHkgcmF0ZS1saW1pdCBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiwgc2VlIHRoZSA8alF1ZXJ5LnRocm90dGxlPlxuICAvLyBtZXRob2QuXG4gIC8vIFxuICAvLyBJbiB0aGlzIHZpc3VhbGl6YXRpb24sIHwgaXMgYSBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbCBhbmQgWCBpcyB0aGUgYWN0dWFsXG4gIC8vIGNhbGxiYWNrIGV4ZWN1dGlvbjpcbiAgLy8gXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQ6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcbiAgLy8gPiBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyB0cnVlOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgZGVib3VuY2VkID0galF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGRlYm91bmNlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBhdF9iZWdpbiAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIGF0X2JlZ2luIGlzIGZhbHNlIG9yXG4gIC8vICAgIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHMgYWZ0ZXJcbiAgLy8gICAgdGhlIGxhc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIElmIGF0X2JlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmVcbiAgLy8gICAgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuIChBZnRlciB0aGVcbiAgLy8gICAgdGhyb3R0bGVkLWZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWQgZm9yIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGVcbiAgLy8gICAgaW50ZXJuYWwgY291bnRlciBpcyByZXNldClcbiAgLy8gIGNhbGxiYWNrIC0gKEZ1bmN0aW9uKSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcy5cbiAgLy8gICAgVGhlIGB0aGlzYCBjb250ZXh0IGFuZCBhbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgYXMtaXMsIHRvXG4gIC8vICAgIGBjYWxsYmFja2Agd2hlbiB0aGUgZGVib3VuY2VkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICAvLyBcbiAgLy8gUmV0dXJuczpcbiAgLy8gXG4gIC8vICAoRnVuY3Rpb24pIEEgbmV3LCBkZWJvdW5jZWQsIGZ1bmN0aW9uLlxuICBcbiAgJC5kZWJvdW5jZSA9IGZ1bmN0aW9uKCBkZWxheSwgYXRfYmVnaW4sIGNhbGxiYWNrICkge1xuICAgIHJldHVybiBjYWxsYmFjayA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGpxX3Rocm90dGxlKCBkZWxheSwgYXRfYmVnaW4sIGZhbHNlIClcbiAgICAgIDoganFfdGhyb3R0bGUoIGRlbGF5LCBjYWxsYmFjaywgYXRfYmVnaW4gIT09IGZhbHNlICk7XG4gIH07XG4gIFxufSkodGhpcyk7XG4iLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB2YXIgRWxlbWVudFF1ZXJpZXMgPSB0aGlzLkVsZW1lbnRRdWVyaWVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy53aXRoVHJhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRFbVNpemUoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ2ZvbnRTaXplJyk7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChmb250U2l6ZSkgfHwgMTY7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vTXIwZ3JvZy9lbGVtZW50LXF1ZXJ5L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY29udmVydFRvUHgoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1bml0cyA9IHZhbHVlLnJlcGxhY2UoL1swLTldKi8sICcnKTtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZW1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZ2V0RW1TaXplKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyZW1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZ2V0RW1TaXplKCk7XG4gICAgICAgICAgICAgICAgLy8gVmlld3BvcnQgdW5pdHMhXG4gICAgICAgICAgICAgICAgLy8gQWNjb3JkaW5nIHRvIGh0dHA6Ly9xdWlya3Ntb2RlLm9yZy9tb2JpbGUvdGFibGVWaWV3cG9ydC5odG1sXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoL0hlaWdodCBnZXRzIHVzIHRoZSBtb3N0IHJlbGlhYmxlIGluZm9cbiAgICAgICAgICAgICAgICBjYXNlIFwidndcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMTAwO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2aFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2bWluXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInZtYXhcIjpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ3ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hvb3NlciA9IE1hdGhbdW5pdHMgPT09IFwidm1pblwiID8gXCJtaW5cIiA6IFwibWF4XCJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBjaG9vc2VyKHZ3LCB2aCk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGZvciBub3csIG5vdCBzdXBwb3J0aW5nIHBoeXNpY2FsIHVuaXRzIChzaW5jZSB0aGV5IGFyZSBqdXN0IGEgc2V0IG51bWJlciBvZiBweClcbiAgICAgICAgICAgICAgICAvLyBvciBleC9jaCAoZ2V0dGluZyBhY2N1cmF0ZSBtZWFzdXJlbWVudHMgaXMgaGFyZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gU2V0dXBJbmZvcm1hdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICAgICAgICB2YXIga2V5LCBvcHRpb24sIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCwgdmFsdWUsIGFjdHVhbFZhbHVlLCBhdHRyVmFsdWVzLCBhdHRyVmFsdWUsIGF0dHJOYW1lO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24ge21vZGU6ICdtaW58bWF4JywgcHJvcGVydHk6ICd3aWR0aHxoZWlnaHQnLCB2YWx1ZTogJzEyM3B4J31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gW29wdGlvbi5tb2RlLCBvcHRpb24ucHJvcGVydHksIG9wdGlvbi52YWx1ZV0uam9pbignLCcpO1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1tpZHhdID0gb3B0aW9uO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbJ21pbi13aWR0aCcsICdtaW4taGVpZ2h0JywgJ21heC13aWR0aCcsICdtYXgtaGVpZ2h0J107XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXh0cmFjdHMgdGhlIGNvbXB1dGVkIHdpZHRoL2hlaWdodCBhbmQgc2V0cyB0byBtaW4vbWF4LSBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgY3VycmVudCBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgIGF0dHJWYWx1ZXMgPSB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiA9IHRoaXMub3B0aW9uc1trZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29udmVydFRvUHgodGhpcy5lbGVtZW50LCBvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbFZhbHVlID0gb3B0aW9uLnByb3BlcnR5ID09ICd3aWR0aCcgPyB3aWR0aCA6IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBvcHRpb24ubW9kZSArICctJyArIG9wdGlvbi5wcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5tb2RlID09ICdtaW4nICYmIGFjdHVhbFZhbHVlID49IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgKz0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5tb2RlID09ICdtYXgnICYmIGFjdHVhbFZhbHVlIDw9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgKz0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdHRyVmFsdWVzW2F0dHJOYW1lXSkgYXR0clZhbHVlc1thdHRyTmFtZV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZSAmJiAtMSA9PT0gKCcgJythdHRyVmFsdWVzW2F0dHJOYW1lXSsnICcpLmluZGV4T2YoJyAnICsgYXR0clZhbHVlICsgJyAnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlc1thdHRyTmFtZV0gKz0gJyAnICsgYXR0clZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyVmFsdWVzW2F0dHJpYnV0ZXNba11dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZXNba10sIGF0dHJWYWx1ZXNbYXR0cmlidXRlc1trXV0uc3Vic3RyKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlc1trXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgb3B0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmFkZE9wdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24gPSBuZXcgU2V0dXBJbmZvcm1hdGlvbihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbi5hZGRPcHRpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvciA9IG5ldyBSZXNpemVTZW5zb3IoZWxlbWVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmNhbGwoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMud2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZGUgbWlufG1heFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgd2lkdGh8aGVpZ2h0XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcXVldWVRdWVyeShzZWxlY3RvciwgbW9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkgcXVlcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsLmJpbmQoZG9jdW1lbnQpO1xuICAgICAgICAgICAgaWYgKCFxdWVyeSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mICQkKSBxdWVyeSA9ICQkO1xuICAgICAgICAgICAgaWYgKCFxdWVyeSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSkgcXVlcnkgPSBqUXVlcnk7XG5cbiAgICAgICAgICAgIGlmICghcXVlcnkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnTm8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCwgalF1ZXJ5IG9yIE1vb3Rvb2xzXFwncyAkJCBmb3VuZC4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBxdWVyeShzZWxlY3Rvcik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHNldHVwRWxlbWVudChlbGVtZW50c1tpXSwge1xuICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlZ2V4ID0gLyw/KFteLFxcbl0qKVxcW1tcXHNcXHRdKihtaW58bWF4KS0od2lkdGh8aGVpZ2h0KVtcXHNcXHRdKlt+JFxcXl0/PVtcXHNcXHRdKlwiKFteXCJdKilcIltcXHNcXHRdKl0oW15cXG5cXHNcXHtdKikvbWdpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY3NzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBleHRyYWN0UXVlcnkoY3NzKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICAgICBjc3MgPSBjc3MucmVwbGFjZSgvJy9nLCAnXCInKTtcbiAgICAgICAgICAgIHdoaWxlIChudWxsICE9PSAobWF0Y2ggPSByZWdleC5leGVjKGNzcykpKSB7XG4gICAgICAgICAgICAgICAgaWYgKDUgPCBtYXRjaC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWVRdWVyeShtYXRjaFsxXSB8fCBtYXRjaFs1XSwgbWF0Y2hbMl0sIG1hdGNoWzNdLCBtYXRjaFs0XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7Q3NzUnVsZVtdfFN0cmluZ30gcnVsZXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlYWRSdWxlcyhydWxlcykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gJyc7XG4gICAgICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcnVsZXMpIHtcbiAgICAgICAgICAgICAgICBydWxlcyA9IHJ1bGVzLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKC0xICE9PSBydWxlcy5pbmRleE9mKCdtaW4td2lkdGgnKSB8fCAtMSAhPT0gcnVsZXMuaW5kZXhPZignbWF4LXdpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHJ1bGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gcnVsZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgxID09PSBydWxlc1tpXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHJ1bGVzW2ldLnNlbGVjdG9yVGV4dCB8fCBydWxlc1tpXS5jc3NUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtaW4taGVpZ2h0JykgfHwgLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21heC1oZWlnaHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RRdWVyeShzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZigtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWluLXdpZHRoJykgfHwgLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21heC13aWR0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICg0ID09PSBydWxlc1tpXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkUnVsZXMocnVsZXNbaV0uY3NzUnVsZXMgfHwgcnVsZXNbaV0ucnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlYXJjaGVzIGFsbCBjc3MgcnVsZXMgYW5kIHNldHVwcyB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gYWxsIGVsZW1lbnRzIHdpdGggZWxlbWVudCBxdWVyeSBydWxlcy4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdGhpcy53aXRoVHJhY2tpbmcgPSB3aXRoVHJhY2tpbmc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NUZXh0IHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1J1bGVzIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLnJ1bGVzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubmFtZSAhPT0gJ1NlY3VyaXR5RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdGhpcy53aXRoVHJhY2tpbmcgPSB3aXRoVHJhY2tpbmc7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndpdGhUcmFja2luZykge1xuICAgICAgICAgICAgICAgIHRocm93ICd3aXRoVHJhY2tpbmcgaXMgbm90IGVuYWJsZWQuIFdlIGNhbiBub3QgZGV0YWNoIGVsZW1lbnRzIHNpbmNlIHdlIGRvbiBub3Qgc3RvcmUgaXQuJyArXG4gICAgICAgICAgICAgICAgJ1VzZSBFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcgPSB0cnVlOyBiZWZvcmUgZG9tcmVhZHkuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnRzLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgRWxlbWVudFF1ZXJpZXMuZGV0YWNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50cyA9IFtdO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm8gZ2FyYmFnZSBjb2xsZWN0aW9uIHBvc3NpYmxlIGlmIHlvdSBkb24gbm90IGNhbGwgLmRldGFjaCgpIGZpcnN0KVxuICAgICAqL1xuICAgIEVsZW1lbnRRdWVyaWVzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZS51cGRhdGUod2l0aFRyYWNraW5nKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgc2Vuc29yIGFuZCBlbGVtZW50cXVlcnkgaW5mb3JtYXRpb24gZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBFbGVtZW50UXVlcmllcy5kZXRhY2ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbikge1xuICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvci5kZXRhY2goKTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldGFjaGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGV0YWNoZWQgYWxyZWFkeScsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgRWxlbWVudFF1ZXJpZXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIUVsZW1lbnRRdWVyaWVzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZSA9IG5ldyBFbGVtZW50UXVlcmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UuaW5pdChFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcpO1xuICAgIH07XG5cbiAgICB2YXIgZG9tTG9hZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIC8qIEludGVybmV0IEV4cGxvcmVyICovXG4gICAgICAgIC8qQGNjX29uXG4gICAgICAgIEBpZiAoQF93aW4zMiB8fCBAX3dpbjY0KVxuICAgICAgICAgICAgZG9jdW1lbnQud3JpdGUoJzxzY3JpcHQgaWQ9XCJpZVNjcmlwdExvYWRcIiBkZWZlciBzcmM9XCIvLzpcIj48XFwvc2NyaXB0PicpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2llU2NyaXB0TG9hZCcpLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIEBlbmQgQCovXG4gICAgICAgIC8qIE1vemlsbGEsIENocm9tZSwgT3BlcmEgKi9cbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8qIFNhZmFyaSwgaUNhYiwgS29ucXVlcm9yICovXG4gICAgICAgIGlmICgvS0hUTUx8V2ViS2l0fGlDYWIvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICB2YXIgRE9NTG9hZFRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgvbG9hZGVkfGNvbXBsZXRlL2kudGVzdChkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKERPTUxvYWRUaW1lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIC8qIE90aGVyIHdlYiBicm93c2VycyAqL1xuICAgICAgICB3aW5kb3cub25sb2FkID0gY2FsbGJhY2s7XG4gICAgfTtcblxuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIEVsZW1lbnRRdWVyaWVzLmluaXQsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIEVsZW1lbnRRdWVyaWVzLmluaXQpO1xuICAgIH1cbiAgICBkb21Mb2FkZWQoRWxlbWVudFF1ZXJpZXMuaW5pdCk7XG5cbn0pKCk7XG4iLCIvKiFcbiAqIGhvdmVySW50ZW50IHYxLjguMSAvLyAyMDE0LjA4LjExIC8vIGpRdWVyeSB2MS45LjErXG4gKiBodHRwOi8vY2hlcm5lLm5ldC9icmlhbi9yZXNvdXJjZXMvanF1ZXJ5LmhvdmVySW50ZW50Lmh0bWxcbiAqXG4gKiBZb3UgbWF5IHVzZSBob3ZlckludGVudCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBsaWNlbnNlLiBCYXNpY2FsbHkgdGhhdFxuICogbWVhbnMgeW91IGFyZSBmcmVlIHRvIHVzZSBob3ZlckludGVudCBhcyBsb25nIGFzIHRoaXMgaGVhZGVyIGlzIGxlZnQgaW50YWN0LlxuICogQ29weXJpZ2h0IDIwMDcsIDIwMTQgQnJpYW4gQ2hlcm5lXG4gKi9cbiBcbi8qIGhvdmVySW50ZW50IGlzIHNpbWlsYXIgdG8galF1ZXJ5J3MgYnVpbHQtaW4gXCJob3ZlclwiIG1ldGhvZCBleGNlcHQgdGhhdFxuICogaW5zdGVhZCBvZiBmaXJpbmcgdGhlIGhhbmRsZXJJbiBmdW5jdGlvbiBpbW1lZGlhdGVseSwgaG92ZXJJbnRlbnQgY2hlY2tzXG4gKiB0byBzZWUgaWYgdGhlIHVzZXIncyBtb3VzZSBoYXMgc2xvd2VkIGRvd24gKGJlbmVhdGggdGhlIHNlbnNpdGl2aXR5XG4gKiB0aHJlc2hvbGQpIGJlZm9yZSBmaXJpbmcgdGhlIGV2ZW50LiBUaGUgaGFuZGxlck91dCBmdW5jdGlvbiBpcyBvbmx5XG4gKiBjYWxsZWQgYWZ0ZXIgYSBtYXRjaGluZyBoYW5kbGVySW4uXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIGp1c3QgbGlrZSAuaG92ZXIoKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW4sIGhhbmRsZXJPdXQgKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQgKVxuICpcbiAqIC8vIGJhc2ljIHVzYWdlIC4uLiB3aXRoIGV2ZW50IGRlbGVnYXRpb24hXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCwgc2VsZWN0b3IgKVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW5PdXQsIHNlbGVjdG9yIClcbiAqXG4gKiAvLyB1c2luZyBhIGJhc2ljIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiAuaG92ZXJJbnRlbnQoIGNvbmZpZyApXG4gKlxuICogQHBhcmFtICBoYW5kbGVySW4gICBmdW5jdGlvbiBPUiBjb25maWd1cmF0aW9uIG9iamVjdFxuICogQHBhcmFtICBoYW5kbGVyT3V0ICBmdW5jdGlvbiBPUiBzZWxlY3RvciBmb3IgZGVsZWdhdGlvbiBPUiB1bmRlZmluZWRcbiAqIEBwYXJhbSAgc2VsZWN0b3IgICAgc2VsZWN0b3IgT1IgdW5kZWZpbmVkXG4gKiBAYXV0aG9yIEJyaWFuIENoZXJuZSA8YnJpYW4oYXQpY2hlcm5lKGRvdCluZXQ+XG4gKi9cbihmdW5jdGlvbigkKSB7XG4gICAgJC5mbi5ob3ZlckludGVudCA9IGZ1bmN0aW9uKGhhbmRsZXJJbixoYW5kbGVyT3V0LHNlbGVjdG9yKSB7XG5cbiAgICAgICAgLy8gZGVmYXVsdCBjb25maWd1cmF0aW9uIHZhbHVlc1xuICAgICAgICB2YXIgY2ZnID0ge1xuICAgICAgICAgICAgaW50ZXJ2YWw6IDEwMCxcbiAgICAgICAgICAgIHNlbnNpdGl2aXR5OiA2LFxuICAgICAgICAgICAgdGltZW91dDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICggdHlwZW9mIGhhbmRsZXJJbiA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgaGFuZGxlckluICk7XG4gICAgICAgIH0gZWxzZSBpZiAoJC5pc0Z1bmN0aW9uKGhhbmRsZXJPdXQpKSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJPdXQsIHNlbGVjdG9yOiBzZWxlY3RvciB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIHsgb3ZlcjogaGFuZGxlckluLCBvdXQ6IGhhbmRsZXJJbiwgc2VsZWN0b3I6IGhhbmRsZXJPdXQgfSApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5zdGFudGlhdGUgdmFyaWFibGVzXG4gICAgICAgIC8vIGNYLCBjWSA9IGN1cnJlbnQgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgdXBkYXRlZCBieSBtb3VzZW1vdmUgZXZlbnRcbiAgICAgICAgLy8gcFgsIHBZID0gcHJldmlvdXMgWCBhbmQgWSBwb3NpdGlvbiBvZiBtb3VzZSwgc2V0IGJ5IG1vdXNlb3ZlciBhbmQgcG9sbGluZyBpbnRlcnZhbFxuICAgICAgICB2YXIgY1gsIGNZLCBwWCwgcFk7XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBnZXR0aW5nIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciB0cmFjayA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBjWCA9IGV2LnBhZ2VYO1xuICAgICAgICAgICAgY1kgPSBldi5wYWdlWTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGNvbXBhcmluZyBjdXJyZW50IGFuZCBwcmV2aW91cyBtb3VzZSBwb3NpdGlvblxuICAgICAgICB2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgLy8gY29tcGFyZSBtb3VzZSBwb3NpdGlvbnMgdG8gc2VlIGlmIHRoZXkndmUgY3Jvc3NlZCB0aGUgdGhyZXNob2xkXG4gICAgICAgICAgICBpZiAoIE1hdGguc3FydCggKHBYLWNYKSoocFgtY1gpICsgKHBZLWNZKSoocFktY1kpICkgPCBjZmcuc2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIHNldCBob3ZlckludGVudCBzdGF0ZSB0byB0cnVlIChzbyBtb3VzZU91dCBjYW4gYmUgY2FsbGVkKVxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjZmcub3Zlci5hcHBseShvYixbZXZdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHByZXZpb3VzIGNvb3JkaW5hdGVzIGZvciBuZXh0IHRpbWVcbiAgICAgICAgICAgICAgICBwWCA9IGNYOyBwWSA9IGNZO1xuICAgICAgICAgICAgICAgIC8vIHVzZSBzZWxmLWNhbGxpbmcgdGltZW91dCwgZ3VhcmFudGVlcyBpbnRlcnZhbHMgYXJlIHNwYWNlZCBvdXQgcHJvcGVybHkgKGF2b2lkcyBKYXZhU2NyaXB0IHRpbWVyIGJ1Z3MpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldiwgb2IpO30gLCBjZmcuaW50ZXJ2YWwgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGRlbGF5aW5nIHRoZSBtb3VzZU91dCBmdW5jdGlvblxuICAgICAgICB2YXIgZGVsYXkgPSBmdW5jdGlvbihldixvYikge1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBjZmcub3V0LmFwcGx5KG9iLFtldl0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgbW91c2UgJ2hvdmVyaW5nJ1xuICAgICAgICB2YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAvLyBjb3B5IG9iamVjdHMgdG8gYmUgcGFzc2VkIGludG8gdCAocmVxdWlyZWQgZm9yIGV2ZW50IG9iamVjdCB0byBiZSBwYXNzZWQgaW4gSUUpXG4gICAgICAgICAgICB2YXIgZXYgPSAkLmV4dGVuZCh7fSxlKTtcbiAgICAgICAgICAgIHZhciBvYiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIGNhbmNlbCBob3ZlckludGVudCB0aW1lciBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF90KSB7IG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7IH1cblxuICAgICAgICAgICAgLy8gaWYgZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIlxuICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJtb3VzZWVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgXCJwcmV2aW91c1wiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gaW5pdGlhbCBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgIHBYID0gZXYucGFnZVg7IHBZID0gZXYucGFnZVk7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIFwiY3VycmVudFwiIFggYW5kIFkgcG9zaXRpb24gYmFzZWQgb24gbW91c2Vtb3ZlXG4gICAgICAgICAgICAgICAgJChvYikub24oXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgcG9sbGluZyBpbnRlcnZhbCAoc2VsZi1jYWxsaW5nIHRpbWVvdXQpIHRvIGNvbXBhcmUgbW91c2UgY29vcmRpbmF0ZXMgb3ZlciB0aW1lXG4gICAgICAgICAgICAgICAgaWYgKCFvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsb2IpO30gLCBjZmcuaW50ZXJ2YWwgKTt9XG5cbiAgICAgICAgICAgICAgICAvLyBlbHNlIGUudHlwZSA9PSBcIm1vdXNlbGVhdmVcIlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1bmJpbmQgZXhwZW5zaXZlIG1vdXNlbW92ZSBldmVudFxuICAgICAgICAgICAgICAgICQob2IpLm9mZihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBob3ZlckludGVudCBzdGF0ZSBpcyB0cnVlLCB0aGVuIGNhbGwgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uIGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXlcbiAgICAgICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtkZWxheShldixvYik7fSAsIGNmZy50aW1lb3V0ICk7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxuICAgICAgICByZXR1cm4gdGhpcy5vbih7J21vdXNlZW50ZXIuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyLCdtb3VzZWxlYXZlLmhvdmVySW50ZW50JzpoYW5kbGVIb3Zlcn0sIGNmZy5zZWxlY3Rvcik7XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iLCIvKiFcbiAqIGltYWdlc0xvYWRlZCBQQUNLQUdFRCB2My4xLjhcbiAqIEphdmFTY3JpcHQgaXMgYWxsIGxpa2UgXCJZb3UgaW1hZ2VzIGFyZSBkb25lIHlldCBvciB3aGF0P1wiXG4gKiBNSVQgTGljZW5zZVxuICovXG5cbihmdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9ZnVuY3Rpb24gdChlLHQpe2Zvcih2YXIgbj1lLmxlbmd0aDtuLS07KWlmKGVbbl0ubGlzdGVuZXI9PT10KXJldHVybiBuO3JldHVybi0xfWZ1bmN0aW9uIG4oZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbZV0uYXBwbHkodGhpcyxhcmd1bWVudHMpfX12YXIgaT1lLnByb3RvdHlwZSxyPXRoaXMsbz1yLkV2ZW50RW1pdHRlcjtpLmdldExpc3RlbmVycz1mdW5jdGlvbihlKXt2YXIgdCxuLGk9dGhpcy5fZ2V0RXZlbnRzKCk7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3Q9e307Zm9yKG4gaW4gaSlpLmhhc093blByb3BlcnR5KG4pJiZlLnRlc3QobikmJih0W25dPWlbbl0pfWVsc2UgdD1pW2VdfHwoaVtlXT1bXSk7cmV0dXJuIHR9LGkuZmxhdHRlbkxpc3RlbmVycz1mdW5jdGlvbihlKXt2YXIgdCxuPVtdO2Zvcih0PTA7ZS5sZW5ndGg+dDt0Kz0xKW4ucHVzaChlW3RdLmxpc3RlbmVyKTtyZXR1cm4gbn0saS5nZXRMaXN0ZW5lcnNBc09iamVjdD1mdW5jdGlvbihlKXt2YXIgdCxuPXRoaXMuZ2V0TGlzdGVuZXJzKGUpO3JldHVybiBuIGluc3RhbmNlb2YgQXJyYXkmJih0PXt9LHRbZV09biksdHx8bn0saS5hZGRMaXN0ZW5lcj1mdW5jdGlvbihlLG4pe3ZhciBpLHI9dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKSxvPVwib2JqZWN0XCI9PXR5cGVvZiBuO2ZvcihpIGluIHIpci5oYXNPd25Qcm9wZXJ0eShpKSYmLTE9PT10KHJbaV0sbikmJnJbaV0ucHVzaChvP246e2xpc3RlbmVyOm4sb25jZTohMX0pO3JldHVybiB0aGlzfSxpLm9uPW4oXCJhZGRMaXN0ZW5lclwiKSxpLmFkZE9uY2VMaXN0ZW5lcj1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmFkZExpc3RlbmVyKGUse2xpc3RlbmVyOnQsb25jZTohMH0pfSxpLm9uY2U9bihcImFkZE9uY2VMaXN0ZW5lclwiKSxpLmRlZmluZUV2ZW50PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmdldExpc3RlbmVycyhlKSx0aGlzfSxpLmRlZmluZUV2ZW50cz1mdW5jdGlvbihlKXtmb3IodmFyIHQ9MDtlLmxlbmd0aD50O3QrPTEpdGhpcy5kZWZpbmVFdmVudChlW3RdKTtyZXR1cm4gdGhpc30saS5yZW1vdmVMaXN0ZW5lcj1mdW5jdGlvbihlLG4pe3ZhciBpLHIsbz10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpO2ZvcihyIGluIG8pby5oYXNPd25Qcm9wZXJ0eShyKSYmKGk9dChvW3JdLG4pLC0xIT09aSYmb1tyXS5zcGxpY2UoaSwxKSk7cmV0dXJuIHRoaXN9LGkub2ZmPW4oXCJyZW1vdmVMaXN0ZW5lclwiKSxpLmFkZExpc3RlbmVycz1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITEsZSx0KX0saS5yZW1vdmVMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKCEwLGUsdCl9LGkubWFuaXB1bGF0ZUxpc3RlbmVycz1mdW5jdGlvbihlLHQsbil7dmFyIGkscixvPWU/dGhpcy5yZW1vdmVMaXN0ZW5lcjp0aGlzLmFkZExpc3RlbmVyLHM9ZT90aGlzLnJlbW92ZUxpc3RlbmVyczp0aGlzLmFkZExpc3RlbmVycztpZihcIm9iamVjdFwiIT10eXBlb2YgdHx8dCBpbnN0YW5jZW9mIFJlZ0V4cClmb3IoaT1uLmxlbmd0aDtpLS07KW8uY2FsbCh0aGlzLHQsbltpXSk7ZWxzZSBmb3IoaSBpbiB0KXQuaGFzT3duUHJvcGVydHkoaSkmJihyPXRbaV0pJiYoXCJmdW5jdGlvblwiPT10eXBlb2Ygcj9vLmNhbGwodGhpcyxpLHIpOnMuY2FsbCh0aGlzLGkscikpO3JldHVybiB0aGlzfSxpLnJlbW92ZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciB0LG49dHlwZW9mIGUsaT10aGlzLl9nZXRFdmVudHMoKTtpZihcInN0cmluZ1wiPT09bilkZWxldGUgaVtlXTtlbHNlIGlmKFwib2JqZWN0XCI9PT1uKWZvcih0IGluIGkpaS5oYXNPd25Qcm9wZXJ0eSh0KSYmZS50ZXN0KHQpJiZkZWxldGUgaVt0XTtlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHM7cmV0dXJuIHRoaXN9LGkucmVtb3ZlQWxsTGlzdGVuZXJzPW4oXCJyZW1vdmVFdmVudFwiKSxpLmVtaXRFdmVudD1mdW5jdGlvbihlLHQpe3ZhciBuLGkscixvLHM9dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKTtmb3IociBpbiBzKWlmKHMuaGFzT3duUHJvcGVydHkocikpZm9yKGk9c1tyXS5sZW5ndGg7aS0tOyluPXNbcl1baV0sbi5vbmNlPT09ITAmJnRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuLmxpc3RlbmVyKSxvPW4ubGlzdGVuZXIuYXBwbHkodGhpcyx0fHxbXSksbz09PXRoaXMuX2dldE9uY2VSZXR1cm5WYWx1ZSgpJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKGUsbi5saXN0ZW5lcik7cmV0dXJuIHRoaXN9LGkudHJpZ2dlcj1uKFwiZW1pdEV2ZW50XCIpLGkuZW1pdD1mdW5jdGlvbihlKXt2YXIgdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSk7cmV0dXJuIHRoaXMuZW1pdEV2ZW50KGUsdCl9LGkuc2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLl9vbmNlUmV0dXJuVmFsdWU9ZSx0aGlzfSxpLl9nZXRPbmNlUmV0dXJuVmFsdWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oYXNPd25Qcm9wZXJ0eShcIl9vbmNlUmV0dXJuVmFsdWVcIik/dGhpcy5fb25jZVJldHVyblZhbHVlOiEwfSxpLl9nZXRFdmVudHM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZXZlbnRzfHwodGhpcy5fZXZlbnRzPXt9KX0sZS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHIuRXZlbnRFbWl0dGVyPW8sZX0sXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImV2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXJcIixbXSxmdW5jdGlvbigpe3JldHVybiBlfSk6XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9ZTp0aGlzLkV2ZW50RW1pdHRlcj1lfSkuY2FsbCh0aGlzKSxmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe3ZhciBuPWUuZXZlbnQ7cmV0dXJuIG4udGFyZ2V0PW4udGFyZ2V0fHxuLnNyY0VsZW1lbnR8fHQsbn12YXIgbj1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsaT1mdW5jdGlvbigpe307bi5hZGRFdmVudExpc3RlbmVyP2k9ZnVuY3Rpb24oZSx0LG4pe2UuYWRkRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpuLmF0dGFjaEV2ZW50JiYoaT1mdW5jdGlvbihlLG4saSl7ZVtuK2ldPWkuaGFuZGxlRXZlbnQ/ZnVuY3Rpb24oKXt2YXIgbj10KGUpO2kuaGFuZGxlRXZlbnQuY2FsbChpLG4pfTpmdW5jdGlvbigpe3ZhciBuPXQoZSk7aS5jYWxsKGUsbil9LGUuYXR0YWNoRXZlbnQoXCJvblwiK24sZVtuK2ldKX0pO3ZhciByPWZ1bmN0aW9uKCl7fTtuLnJlbW92ZUV2ZW50TGlzdGVuZXI/cj1mdW5jdGlvbihlLHQsbil7ZS5yZW1vdmVFdmVudExpc3RlbmVyKHQsbiwhMSl9Om4uZGV0YWNoRXZlbnQmJihyPWZ1bmN0aW9uKGUsdCxuKXtlLmRldGFjaEV2ZW50KFwib25cIit0LGVbdCtuXSk7dHJ5e2RlbGV0ZSBlW3Qrbl19Y2F0Y2goaSl7ZVt0K25dPXZvaWQgMH19KTt2YXIgbz17YmluZDppLHVuYmluZDpyfTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRpZS9ldmVudGllXCIsbyk6ZS5ldmVudGllPW99KHRoaXMpLGZ1bmN0aW9uKGUsdCl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsXCJldmVudGllL2V2ZW50aWVcIl0sZnVuY3Rpb24obixpKXtyZXR1cm4gdChlLG4saSl9KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz10KGUscmVxdWlyZShcIndvbGZ5ODctZXZlbnRlbWl0dGVyXCIpLHJlcXVpcmUoXCJldmVudGllXCIpKTplLmltYWdlc0xvYWRlZD10KGUsZS5FdmVudEVtaXR0ZXIsZS5ldmVudGllKX0od2luZG93LGZ1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiBpKGUsdCl7Zm9yKHZhciBuIGluIHQpZVtuXT10W25dO3JldHVybiBlfWZ1bmN0aW9uIHIoZSl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09ZC5jYWxsKGUpfWZ1bmN0aW9uIG8oZSl7dmFyIHQ9W107aWYocihlKSl0PWU7ZWxzZSBpZihcIm51bWJlclwiPT10eXBlb2YgZS5sZW5ndGgpZm9yKHZhciBuPTAsaT1lLmxlbmd0aDtpPm47bisrKXQucHVzaChlW25dKTtlbHNlIHQucHVzaChlKTtyZXR1cm4gdH1mdW5jdGlvbiBzKGUsdCxuKXtpZighKHRoaXMgaW5zdGFuY2VvZiBzKSlyZXR1cm4gbmV3IHMoZSx0KTtcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlKSksdGhpcy5lbGVtZW50cz1vKGUpLHRoaXMub3B0aW9ucz1pKHt9LHRoaXMub3B0aW9ucyksXCJmdW5jdGlvblwiPT10eXBlb2YgdD9uPXQ6aSh0aGlzLm9wdGlvbnMsdCksbiYmdGhpcy5vbihcImFsd2F5c1wiLG4pLHRoaXMuZ2V0SW1hZ2VzKCksYSYmKHRoaXMuanFEZWZlcnJlZD1uZXcgYS5EZWZlcnJlZCk7dmFyIHI9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ci5jaGVjaygpfSl9ZnVuY3Rpb24gZihlKXt0aGlzLmltZz1lfWZ1bmN0aW9uIGMoZSl7dGhpcy5zcmM9ZSx2W2VdPXRoaXN9dmFyIGE9ZS5qUXVlcnksdT1lLmNvbnNvbGUsaD11IT09dm9pZCAwLGQ9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztzLnByb3RvdHlwZT1uZXcgdCxzLnByb3RvdHlwZS5vcHRpb25zPXt9LHMucHJvdG90eXBlLmdldEltYWdlcz1mdW5jdGlvbigpe3RoaXMuaW1hZ2VzPVtdO2Zvcih2YXIgZT0wLHQ9dGhpcy5lbGVtZW50cy5sZW5ndGg7dD5lO2UrKyl7dmFyIG49dGhpcy5lbGVtZW50c1tlXTtcIklNR1wiPT09bi5ub2RlTmFtZSYmdGhpcy5hZGRJbWFnZShuKTt2YXIgaT1uLm5vZGVUeXBlO2lmKGkmJigxPT09aXx8OT09PWl8fDExPT09aSkpZm9yKHZhciByPW4ucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSxvPTAscz1yLmxlbmd0aDtzPm87bysrKXt2YXIgZj1yW29dO3RoaXMuYWRkSW1hZ2UoZil9fX0scy5wcm90b3R5cGUuYWRkSW1hZ2U9ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IGYoZSk7dGhpcy5pbWFnZXMucHVzaCh0KX0scy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUscil7cmV0dXJuIHQub3B0aW9ucy5kZWJ1ZyYmaCYmdS5sb2coXCJjb25maXJtXCIsZSxyKSx0LnByb2dyZXNzKGUpLG4rKyxuPT09aSYmdC5jb21wbGV0ZSgpLCEwfXZhciB0PXRoaXMsbj0wLGk9dGhpcy5pbWFnZXMubGVuZ3RoO2lmKHRoaXMuaGFzQW55QnJva2VuPSExLCFpKXJldHVybiB0aGlzLmNvbXBsZXRlKCksdm9pZCAwO2Zvcih2YXIgcj0wO2k+cjtyKyspe3ZhciBvPXRoaXMuaW1hZ2VzW3JdO28ub24oXCJjb25maXJtXCIsZSksby5jaGVjaygpfX0scy5wcm90b3R5cGUucHJvZ3Jlc3M9ZnVuY3Rpb24oZSl7dGhpcy5oYXNBbnlCcm9rZW49dGhpcy5oYXNBbnlCcm9rZW58fCFlLmlzTG9hZGVkO3ZhciB0PXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3QuZW1pdChcInByb2dyZXNzXCIsdCxlKSx0LmpxRGVmZXJyZWQmJnQuanFEZWZlcnJlZC5ub3RpZnkmJnQuanFEZWZlcnJlZC5ub3RpZnkodCxlKX0pfSxzLnByb3RvdHlwZS5jb21wbGV0ZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuaGFzQW55QnJva2VuP1wiZmFpbFwiOlwiZG9uZVwiO3RoaXMuaXNDb21wbGV0ZT0hMDt2YXIgdD10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtpZih0LmVtaXQoZSx0KSx0LmVtaXQoXCJhbHdheXNcIix0KSx0LmpxRGVmZXJyZWQpe3ZhciBuPXQuaGFzQW55QnJva2VuP1wicmVqZWN0XCI6XCJyZXNvbHZlXCI7dC5qcURlZmVycmVkW25dKHQpfX0pfSxhJiYoYS5mbi5pbWFnZXNMb2FkZWQ9ZnVuY3Rpb24oZSx0KXt2YXIgbj1uZXcgcyh0aGlzLGUsdCk7cmV0dXJuIG4uanFEZWZlcnJlZC5wcm9taXNlKGEodGhpcykpfSksZi5wcm90b3R5cGU9bmV3IHQsZi5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXt2YXIgZT12W3RoaXMuaW1nLnNyY118fG5ldyBjKHRoaXMuaW1nLnNyYyk7aWYoZS5pc0NvbmZpcm1lZClyZXR1cm4gdGhpcy5jb25maXJtKGUuaXNMb2FkZWQsXCJjYWNoZWQgd2FzIGNvbmZpcm1lZFwiKSx2b2lkIDA7aWYodGhpcy5pbWcuY29tcGxldGUmJnZvaWQgMCE9PXRoaXMuaW1nLm5hdHVyYWxXaWR0aClyZXR1cm4gdGhpcy5jb25maXJtKDAhPT10aGlzLmltZy5uYXR1cmFsV2lkdGgsXCJuYXR1cmFsV2lkdGhcIiksdm9pZCAwO3ZhciB0PXRoaXM7ZS5vbihcImNvbmZpcm1cIixmdW5jdGlvbihlLG4pe3JldHVybiB0LmNvbmZpcm0oZS5pc0xvYWRlZCxuKSwhMH0pLGUuY2hlY2soKX0sZi5wcm90b3R5cGUuY29uZmlybT1mdW5jdGlvbihlLHQpe3RoaXMuaXNMb2FkZWQ9ZSx0aGlzLmVtaXQoXCJjb25maXJtXCIsdGhpcyx0KX07dmFyIHY9e307cmV0dXJuIGMucHJvdG90eXBlPW5ldyB0LGMucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNDaGVja2VkKXt2YXIgZT1uZXcgSW1hZ2U7bi5iaW5kKGUsXCJsb2FkXCIsdGhpcyksbi5iaW5kKGUsXCJlcnJvclwiLHRoaXMpLGUuc3JjPXRoaXMuc3JjLHRoaXMuaXNDaGVja2VkPSEwfX0sYy5wcm90b3R5cGUuaGFuZGxlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIHQ9XCJvblwiK2UudHlwZTt0aGlzW3RdJiZ0aGlzW3RdKGUpfSxjLnByb3RvdHlwZS5vbmxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5jb25maXJtKCEwLFwib25sb2FkXCIpLHRoaXMudW5iaW5kUHJveHlFdmVudHMoZSl9LGMucHJvdG90eXBlLm9uZXJyb3I9ZnVuY3Rpb24oZSl7dGhpcy5jb25maXJtKCExLFwib25lcnJvclwiKSx0aGlzLnVuYmluZFByb3h5RXZlbnRzKGUpfSxjLnByb3RvdHlwZS5jb25maXJtPWZ1bmN0aW9uKGUsdCl7dGhpcy5pc0NvbmZpcm1lZD0hMCx0aGlzLmlzTG9hZGVkPWUsdGhpcy5lbWl0KFwiY29uZmlybVwiLHRoaXMsdCl9LGMucHJvdG90eXBlLnVuYmluZFByb3h5RXZlbnRzPWZ1bmN0aW9uKGUpe24udW5iaW5kKGUudGFyZ2V0LFwibG9hZFwiLHRoaXMpLG4udW5iaW5kKGUudGFyZ2V0LFwiZXJyb3JcIix0aGlzKX0sc30pOyIsIi8qKlxyXG4qIGpxdWVyeS5tYXRjaEhlaWdodC5qcyBtYXN0ZXJcclxuKiBodHRwOi8vYnJtLmlvL2pxdWVyeS1tYXRjaC1oZWlnaHQvXHJcbiogTGljZW5zZTogTUlUXHJcbiovXHJcblxyXG47KGZ1bmN0aW9uKCQpIHtcclxuICAgIC8qXHJcbiAgICAqICBpbnRlcm5hbFxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3ByZXZpb3VzUmVzaXplV2lkdGggPSAtMSxcclxuICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBfcGFyc2VcclxuICAgICogIHZhbHVlIHBhcnNlIHV0aWxpdHkgZnVuY3Rpb25cclxuICAgICovXHJcblxyXG4gICAgdmFyIF9wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgLy8gcGFyc2UgdmFsdWUgYW5kIGNvbnZlcnQgTmFOIHRvIDBcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgfHwgMDtcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIF9yb3dzXHJcbiAgICAqICB1dGlsaXR5IGZ1bmN0aW9uIHJldHVybnMgYXJyYXkgb2YgalF1ZXJ5IHNlbGVjdGlvbnMgcmVwcmVzZW50aW5nIGVhY2ggcm93XHJcbiAgICAqICAoYXMgZGlzcGxheWVkIGFmdGVyIGZsb2F0IHdyYXBwaW5nIGFwcGxpZWQgYnkgYnJvd3NlcilcclxuICAgICovXHJcblxyXG4gICAgdmFyIF9yb3dzID0gZnVuY3Rpb24oZWxlbWVudHMpIHtcclxuICAgICAgICB2YXIgdG9sZXJhbmNlID0gMSxcclxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXHJcbiAgICAgICAgICAgIGxhc3RUb3AgPSBudWxsLFxyXG4gICAgICAgICAgICByb3dzID0gW107XHJcblxyXG4gICAgICAgIC8vIGdyb3VwIGVsZW1lbnRzIGJ5IHRoZWlyIHRvcCBwb3NpdGlvblxyXG4gICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICB0b3AgPSAkdGhhdC5vZmZzZXQoKS50b3AgLSBfcGFyc2UoJHRoYXQuY3NzKCdtYXJnaW4tdG9wJykpLFxyXG4gICAgICAgICAgICAgICAgbGFzdFJvdyA9IHJvd3MubGVuZ3RoID4gMCA/IHJvd3Nbcm93cy5sZW5ndGggLSAxXSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAobGFzdFJvdyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmlyc3QgaXRlbSBvbiB0aGUgcm93LCBzbyBqdXN0IHB1c2ggaXRcclxuICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm93IHRvcCBpcyB0aGUgc2FtZSwgYWRkIHRvIHRoZSByb3cgZ3JvdXBcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmZsb29yKE1hdGguYWJzKGxhc3RUb3AgLSB0b3ApKSA8PSB0b2xlcmFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByb3dzW3Jvd3MubGVuZ3RoIC0gMV0gPSBsYXN0Um93LmFkZCgkdGhhdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBzdGFydCBhIG5ldyByb3cgZ3JvdXBcclxuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goJHRoYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHJvdyB0b3BcclxuICAgICAgICAgICAgbGFzdFRvcCA9IHRvcDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBfcGFyc2VPcHRpb25zXHJcbiAgICAqICBoYW5kbGUgcGx1Z2luIG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgdmFyIF9wYXJzZU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIG9wdHMgPSB7XHJcbiAgICAgICAgICAgIGJ5Um93OiB0cnVlLFxyXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2hlaWdodCcsXHJcbiAgICAgICAgICAgIHRhcmdldDogbnVsbCxcclxuICAgICAgICAgICAgcmVtb3ZlOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKG9wdHMsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgb3B0cy5ieVJvdyA9IG9wdGlvbnM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSAncmVtb3ZlJykge1xyXG4gICAgICAgICAgICBvcHRzLnJlbW92ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3B0cztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIG1hdGNoSGVpZ2h0XHJcbiAgICAqICBwbHVnaW4gZGVmaW5pdGlvblxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgbWF0Y2hIZWlnaHQgPSAkLmZuLm1hdGNoSGVpZ2h0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHJlbW92ZVxyXG4gICAgICAgIGlmIChvcHRzLnJlbW92ZSkge1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgZml4ZWQgaGVpZ2h0IGZyb20gYWxsIHNlbGVjdGVkIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIHRoaXMuY3NzKG9wdHMucHJvcGVydHksICcnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBzZWxlY3RlZCBlbGVtZW50cyBmcm9tIGFsbCBncm91cHNcclxuICAgICAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKGtleSwgZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwLmVsZW1lbnRzID0gZ3JvdXAuZWxlbWVudHMubm90KHRoYXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IGNsZWFudXAgZW1wdHkgZ3JvdXBzXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8PSAxICYmICFvcHRzLnRhcmdldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhpcyBncm91cCBzbyB3ZSBjYW4gcmUtYXBwbHkgbGF0ZXIgb24gbG9hZCBhbmQgcmVzaXplIGV2ZW50c1xyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9ncm91cHMucHVzaCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzOiB0aGlzLFxyXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIG1hdGNoIGVhY2ggZWxlbWVudCdzIGhlaWdodCB0byB0aGUgdGFsbGVzdCBlbGVtZW50IGluIHRoZSBzZWxlY3Rpb25cclxuICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcywgb3B0cyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgcGx1Z2luIGdsb2JhbCBvcHRpb25zXHJcbiAgICAqL1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll9ncm91cHMgPSBbXTtcclxuICAgIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSA9IDgwO1xyXG4gICAgbWF0Y2hIZWlnaHQuX21haW50YWluU2Nyb2xsID0gZmFsc2U7XHJcbiAgICBtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlID0gbnVsbDtcclxuICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseVxyXG4gICAgKiAgYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZ2l2ZW4gZWxlbWVudHNcclxuICAgICovXHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX2FwcGx5ID0gZnVuY3Rpb24oZWxlbWVudHMsIG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0cyA9IF9wYXJzZU9wdGlvbnMob3B0aW9ucyksXHJcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxyXG4gICAgICAgICAgICByb3dzID0gWyRlbGVtZW50c107XHJcblxyXG4gICAgICAgIC8vIHRha2Ugbm90ZSBvZiBzY3JvbGwgcG9zaXRpb25cclxuICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxyXG4gICAgICAgICAgICBodG1sSGVpZ2h0ID0gJCgnaHRtbCcpLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICAvLyBnZXQgaGlkZGVuIHBhcmVudHNcclxuICAgICAgICB2YXIgJGhpZGRlblBhcmVudHMgPSAkZWxlbWVudHMucGFyZW50cygpLmZpbHRlcignOmhpZGRlbicpO1xyXG5cclxuICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXHJcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnLCAkdGhhdC5hdHRyKCdzdHlsZScpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gdGVtcG9yYXJpbHkgbXVzdCBmb3JjZSBoaWRkZW4gcGFyZW50cyB2aXNpYmxlXHJcbiAgICAgICAgJGhpZGRlblBhcmVudHMuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcblxyXG4gICAgICAgIC8vIGdldCByb3dzIGlmIHVzaW5nIGJ5Um93LCBvdGhlcndpc2UgYXNzdW1lIG9uZSByb3dcclxuICAgICAgICBpZiAob3B0cy5ieVJvdyAmJiAhb3B0cy50YXJnZXQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIG11c3QgZmlyc3QgZm9yY2UgYW4gYXJiaXRyYXJ5IGVxdWFsIGhlaWdodCBzbyBmbG9hdGluZyBlbGVtZW50cyBicmVhayBldmVubHlcclxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAkdGhhdC5jc3MoJ2Rpc3BsYXknKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcmlseSBmb3JjZSBhIHVzYWJsZSBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzcGxheSAhPT0gJ2lubGluZS1ibG9jaycgJiYgZGlzcGxheSAhPT0gJ2lubGluZS1mbGV4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcclxuICAgICAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHRoYXQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6IGRpc3BsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctdG9wJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLWJvdHRvbSc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLXRvcC13aWR0aCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLWJvdHRvbS13aWR0aCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMHB4J1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBhcnJheSBvZiByb3dzIChiYXNlZCBvbiBlbGVtZW50IHRvcCBwb3NpdGlvbilcclxuICAgICAgICAgICAgcm93cyA9IF9yb3dzKCRlbGVtZW50cyk7XHJcblxyXG4gICAgICAgICAgICAvLyByZXZlcnQgb3JpZ2luYWwgaW5saW5lIHN0eWxlc1xyXG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAkdGhhdC5hdHRyKCdzdHlsZScsICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJykgfHwgJycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZWFjaChyb3dzLCBmdW5jdGlvbihrZXksIHJvdykge1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQocm93KSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW9wdHMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBza2lwIGFwcGx5IHRvIHJvd3Mgd2l0aCBvbmx5IG9uZSBpdGVtXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5ieVJvdyAmJiAkcm93Lmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvdy5jc3Mob3B0cy5wcm9wZXJ0eSwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGZpbmQgdGhlIG1heCBoZWlnaHRcclxuICAgICAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAkdGhhdC5jc3MoJ2Rpc3BsYXknKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJpbHkgZm9yY2UgYSB1c2FibGUgZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5ICE9PSAnaW5saW5lLWJsb2NrJyAmJiBkaXNwbGF5ICE9PSAnaW5saW5lLWZsZXgnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZW5zdXJlIHdlIGdldCB0aGUgY29ycmVjdCBhY3R1YWwgaGVpZ2h0IChhbmQgbm90IGEgcHJldmlvdXNseSBzZXQgaGVpZ2h0IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjc3MgPSB7ICdkaXNwbGF5JzogZGlzcGxheSB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNzc1tvcHRzLnByb3BlcnR5XSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGF0LmNzcyhjc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBtYXggaGVpZ2h0IChpbmNsdWRpbmcgcGFkZGluZywgYnV0IG5vdCBtYXJnaW4pXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKSA+IHRhcmdldEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAkdGhhdC5vdXRlckhlaWdodChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnQgZGlzcGxheSBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGF0LmNzcygnZGlzcGxheScsICcnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGFyZ2V0IHNldCwgdXNlIHRoZSBoZWlnaHQgb2YgdGhlIHRhcmdldCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSBvcHRzLnRhcmdldC5vdXRlckhlaWdodChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhlIHJvdyBhbmQgYXBwbHkgdGhlIGhlaWdodCB0byBhbGwgZWxlbWVudHNcclxuICAgICAgICAgICAgJHJvdy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYXBwbHkgdG8gYSB0YXJnZXRcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnRhcmdldCAmJiAkdGhhdC5pcyhvcHRzLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIHBhZGRpbmcgYW5kIGJvcmRlciBjb3JyZWN0bHkgKHJlcXVpcmVkIHdoZW4gbm90IHVzaW5nIGJvcmRlci1ib3gpXHJcbiAgICAgICAgICAgICAgICBpZiAoJHRoYXQuY3NzKCdib3gtc2l6aW5nJykgIT09ICdib3JkZXItYm94Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItdG9wLXdpZHRoJykpICsgX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpKTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgKz0gX3BhcnNlKCR0aGF0LmNzcygncGFkZGluZy10b3AnKSkgKyBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLWJvdHRvbScpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIGhlaWdodCAoYWNjb3VudGluZyBmb3IgcGFkZGluZyBhbmQgYm9yZGVyKVxyXG4gICAgICAgICAgICAgICAgJHRoYXQuY3NzKG9wdHMucHJvcGVydHksICh0YXJnZXRIZWlnaHQgLSB2ZXJ0aWNhbFBhZGRpbmcpICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZXZlcnQgaGlkZGVuIHBhcmVudHNcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAkdGhhdC5hdHRyKCdzdHlsZScsICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJykgfHwgbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIGlmIGVuYWJsZWRcclxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX21haW50YWluU2Nyb2xsKSB7XHJcbiAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoKHNjcm9sbFRvcCAvIGh0bWxIZWlnaHQpICogJCgnaHRtbCcpLm91dGVySGVpZ2h0KHRydWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaVxyXG4gICAgKiAgYXBwbGllcyBtYXRjaEhlaWdodCB0byBhbGwgZWxlbWVudHMgd2l0aCBhIGRhdGEtbWF0Y2gtaGVpZ2h0IGF0dHJpYnV0ZVxyXG4gICAgKi9cclxuXHJcbiAgICBtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IHt9O1xyXG5cclxuICAgICAgICAvLyBnZW5lcmF0ZSBncm91cHMgYnkgdGhlaXIgZ3JvdXBJZCBzZXQgYnkgZWxlbWVudHMgdXNpbmcgZGF0YS1tYXRjaC1oZWlnaHRcclxuICAgICAgICAkKCdbZGF0YS1tYXRjaC1oZWlnaHRdLCBbZGF0YS1taF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgZ3JvdXBJZCA9ICR0aGlzLmF0dHIoJ2RhdGEtbWgnKSB8fCAkdGhpcy5hdHRyKCdkYXRhLW1hdGNoLWhlaWdodCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdyb3VwSWQgaW4gZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBJZF0gPSBncm91cHNbZ3JvdXBJZF0uYWRkKCR0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9ICR0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGFwcGx5IG1hdGNoSGVpZ2h0IHRvIGVhY2ggZ3JvdXBcclxuICAgICAgICAkLmVhY2goZ3JvdXBzLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXRjaEhlaWdodCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIG1hdGNoSGVpZ2h0Ll91cGRhdGVcclxuICAgICogIHVwZGF0ZXMgbWF0Y2hIZWlnaHQgb24gYWxsIGN1cnJlbnQgZ3JvdXBzIHdpdGggdGhlaXIgY29ycmVjdCBvcHRpb25zXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfdXBkYXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZSkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKGV2ZW50LCBtYXRjaEhlaWdodC5fZ3JvdXBzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2FwcGx5KHRoaXMuZWxlbWVudHMsIHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUpIHtcclxuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlKGV2ZW50LCBtYXRjaEhlaWdodC5fZ3JvdXBzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUgPSBmdW5jdGlvbih0aHJvdHRsZSwgZXZlbnQpIHtcclxuICAgICAgICAvLyBwcmV2ZW50IHVwZGF0ZSBpZiBmaXJlZCBmcm9tIGEgcmVzaXplIGV2ZW50XHJcbiAgICAgICAgLy8gd2hlcmUgdGhlIHZpZXdwb3J0IHdpZHRoIGhhc24ndCBhY3R1YWxseSBjaGFuZ2VkXHJcbiAgICAgICAgLy8gZml4ZXMgYW4gZXZlbnQgbG9vcGluZyBidWcgaW4gSUU4XHJcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT09ICdyZXNpemUnKSB7XHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICBpZiAod2luZG93V2lkdGggPT09IF9wcmV2aW91c1Jlc2l6ZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3ByZXZpb3VzUmVzaXplV2lkdGggPSB3aW5kb3dXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRocm90dGxlIHVwZGF0ZXNcclxuICAgICAgICBpZiAoIXRocm90dGxlKSB7XHJcbiAgICAgICAgICAgIF91cGRhdGUoZXZlbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoX3VwZGF0ZVRpbWVvdXQgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIF91cGRhdGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIF91cGRhdGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcclxuICAgICAgICAgICAgfSwgbWF0Y2hIZWlnaHQuX3Rocm90dGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBiaW5kIGV2ZW50c1xyXG4gICAgKi9cclxuXHJcbiAgICAvLyBhcHBseSBvbiBET00gcmVhZHkgZXZlbnRcclxuICAgICQobWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGhlaWdodHMgb24gbG9hZCBhbmQgcmVzaXplIGV2ZW50c1xyXG4gICAgJCh3aW5kb3cpLmJpbmQoJ2xvYWQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUoZmFsc2UsIGV2ZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRocm90dGxlZCB1cGRhdGUgaGVpZ2h0cyBvbiByZXNpemUgZXZlbnRzXHJcbiAgICAkKHdpbmRvdykuYmluZCgncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKHRydWUsIGV2ZW50KTtcclxuICAgIH0pO1xyXG5cclxufSkoalF1ZXJ5KTtcclxuIiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbkpTIFBMVUdJTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbid1c2Ugc3RyaWN0JzsgLyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cclxuXHJcblxyXG4vLyBHZXQgQ3VycmVudCBCcmVha3BvaW50IChHbG9iYWwpXHJcbnZhciBicmVha3BvaW50ID0ge307XHJcbmJyZWFrcG9pbnQucmVmcmVzaCA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMubmFtZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcbn07XHJcbmpRdWVyeSh3aW5kb3cpLnJlc2l6ZSggZnVuY3Rpb24oKSB7XHJcblx0YnJlYWtwb2ludC5yZWZyZXNoKCk7XHJcbn0pLnJlc2l6ZSgpO1xyXG5cclxuXHJcbi8vIFJlc2l6ZSBJZnJhbWVzIFByb3BvcnRpb25hbGx5XHJcbmZ1bmN0aW9uIGlmcmFtZUFzcGVjdChzZWxlY3Rvcikge1xyXG5cdHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgalF1ZXJ5KCdpZnJhbWUnKTtcclxuXHJcblx0c2VsZWN0b3IuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHQvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXHJcblx0XHR2YXIgaWZyYW1lID0galF1ZXJ5KHRoaXMpLFxyXG5cdFx0XHR3aWR0aCAgPSBpZnJhbWUud2lkdGgoKTtcclxuXHRcdGlmICggdHlwZW9mKGlmcmFtZS5kYXRhKCdyYXRpbycpKSA9PSAndW5kZWZpbmVkJyApIHtcclxuXHRcdFx0dmFyIGF0dHJXID0gdGhpcy53aWR0aCxcclxuXHRcdFx0XHRhdHRySCA9IHRoaXMuaGVpZ2h0O1xyXG5cdFx0XHRpZnJhbWUuZGF0YSgncmF0aW8nLCBhdHRySCAvIGF0dHJXICkucmVtb3ZlQXR0cignd2lkdGgnKS5yZW1vdmVBdHRyKCdoZWlnaHQnKTtcclxuXHRcdH1cclxuXHRcdGlmcmFtZS5oZWlnaHQoIHdpZHRoICogaWZyYW1lLmRhdGEoJ3JhdGlvJykgKTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vIExpZ2h0ZW4gLyBEYXJrZW4gQ29sb3IgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XHJcbmZ1bmN0aW9uIHNoYWRlQ29sb3IoY29sb3IsIHBlcmNlbnQpIHsgICBcclxuXHR2YXIgZj1wYXJzZUludChjb2xvci5zbGljZSgxKSwxNiksdD1wZXJjZW50PDA/MDoyNTUscD1wZXJjZW50PDA/cGVyY2VudCotMTpwZXJjZW50LFI9Zj4+MTYsRz1mPj44JjB4MDBGRixCPWYmMHgwMDAwRkY7XHJcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKCh0LVIpKnApK1IpKjB4MTAwMDArKE1hdGgucm91bmQoKHQtRykqcCkrRykqMHgxMDArKE1hdGgucm91bmQoKHQtQikqcCkrQikpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxufVxyXG5cclxuXHJcbi8vIEJsZW5kIENvbG9ycyAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcclxuZnVuY3Rpb24gYmxlbmRDb2xvcnMoYzAsIGMxLCBwKSB7XHJcblx0dmFyIGY9cGFyc2VJbnQoYzAuc2xpY2UoMSksMTYpLHQ9cGFyc2VJbnQoYzEuc2xpY2UoMSksMTYpLFIxPWY+PjE2LEcxPWY+PjgmMHgwMEZGLEIxPWYmMHgwMDAwRkYsUjI9dD4+MTYsRzI9dD4+OCYweDAwRkYsQjI9dCYweDAwMDBGRjtcclxuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKFIyLVIxKSpwKStSMSkqMHgxMDAwMCsoTWF0aC5yb3VuZCgoRzItRzEpKnApK0cxKSoweDEwMCsoTWF0aC5yb3VuZCgoQjItQjEpKnApK0IxKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5cclxuLy8gQ29sb3IgTGlnaHQgT3IgRGFyayAtIENyZWRpdCBcIkxhcnJ5IEZveFwiIC0gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbGFycnlmb3gvMTYzNjMzOFxyXG5mdW5jdGlvbiBjb2xvckxvRChjb2xvcikge1xyXG5cdHZhciByLGIsZyxoc3AsYSA9IGNvbG9yO1xyXG5cdGlmIChhLm1hdGNoKC9ecmdiLykpIHtcclxuXHRcdGEgPSBhLm1hdGNoKC9ecmdiYT9cXCgoXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspKD86LFxccyooXFxkKyg/OlxcLlxcZCspPykpP1xcKSQvKTtcclxuXHRcdHIgPSBhWzFdO1xyXG5cdFx0YiA9IGFbMl07XHJcblx0XHRnID0gYVszXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0YSA9ICsoJzB4JyArIGEuc2xpY2UoMSkucmVwbGFjZShhLmxlbmd0aCA8IDUgJiYgLy4vZywgJyQmJCYnKSk7XHJcblx0XHRyID0gYSA+PiAxNjtcclxuXHRcdGIgPSBhID4+IDggJiAyNTU7XHJcblx0XHRnID0gYSAmIDI1NTtcclxuXHR9XHJcblx0aHNwID0gTWF0aC5zcXJ0KFxyXG5cdFx0MC4yOTkgKiAociAqIHIpICtcclxuXHRcdDAuNTg3ICogKGcgKiBnKSArXHJcblx0XHQwLjExNCAqIChiICogYilcclxuXHQpO1xyXG5cdGlmIChoc3A+MTI3LjUpIHtcclxuXHRcdHJldHVybiAnbGlnaHQnO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gJ2RhcmsnO1xyXG5cdH1cclxufSBcclxuXHJcblxyXG4vLyBJbWFnZSBMaWdodCBPciBEYXJrIEltYWdlIC0gQ3JlZGl0IFwiSm9zZXBoIFBvcnRlbGxpXCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTQ5NjM2L2pvc2VwaC1wb3J0ZWxsaVxyXG5mdW5jdGlvbiBpbWFnZUxvRChpbWFnZVNyYywgY2FsbGJhY2spIHtcclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblx0aW1nLnNyYyA9IGltYWdlU3JjO1xyXG5cdGltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcclxuXHJcblx0dmFyIGNvbG9yU3VtID0gMDtcclxuXHJcblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY3JlYXRlIGNhbnZhc1xyXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMsMCwwKTtcclxuXHJcblx0XHR2YXIgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0dmFyIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcclxuXHRcdHZhciByLGcsYixhdmc7XHJcblxyXG5cdFx0Zm9yKHZhciB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHgrPTQpIHtcclxuXHRcdFx0ciA9IGRhdGFbeF07XHJcblx0XHRcdGcgPSBkYXRhW3grMV07XHJcblx0XHRcdGIgPSBkYXRhW3grMl07XHJcblxyXG5cdFx0XHRhdmcgPSBNYXRoLmZsb29yKChyK2crYikvMyk7XHJcblx0XHRcdGNvbG9yU3VtICs9IGF2ZztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAodGhpcy53aWR0aCp0aGlzLmhlaWdodCkpO1xyXG5cdFx0Y2FsbGJhY2soYnJpZ2h0bmVzcyk7XHJcblx0fTtcclxufVxyXG5cclxuXHJcbi8vIFJlc2l6ZSBJbWFnZSBUbyBGaWxsIENvbnRhaW5lciBTaXplXHJcbmZ1bmN0aW9uIGltYWdlQ292ZXIoY29udCwgdHlwZSwgY29yckgpIHtcclxuXHR0eXBlID0gdHlwZSB8fCAnYmcnO1xyXG5cclxuXHRjb250LmFkZENsYXNzKCdpbWFnZS1jb3ZlcicpO1xyXG5cclxuXHR2YXIgaW1nLCBpbWdVcmwsIGltZ1dpZHRoID0gMCwgaW1nSGVpZ2h0ID0gMDtcclxuXHJcblx0aWYgKCB0eXBlID09ICdpbWcnICkge1xyXG5cdFx0aW1nID0gY29udC5maW5kKCcuYmctaW1nJyk7XHJcblx0XHRpbWdXaWR0aCAgPSBpbWcud2lkdGgoKTtcclxuXHRcdGltZ0hlaWdodCA9IGltZy5oZWlnaHQoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0aW1nVXJsID0gY29udC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5tYXRjaCgvXnVybFxcKFwiPyguKz8pXCI/XFwpJC8pO1xyXG5cdFx0aWYgKCBpbWdVcmxbMV0gKSB7XHJcblx0XHQgICAgaW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHQgICAgaW1nLnNyYyA9IGltZ1VybFsxXTtcclxuXHRcdCAgICBpbWdXaWR0aCAgPSBpbWcud2lkdGg7XHJcblx0XHQgICAgaW1nSGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICggaW1nV2lkdGggIT09IDAgJiYgaW1nSGVpZ2h0ICE9PSAwICkge1xyXG5cdFx0dmFyIGNvbnRXaWR0aCAgPSBjb250Lm91dGVyV2lkdGgoKSxcclxuXHRcdFx0Y29udEhlaWdodCA9IGNvbnQub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0aGVpZ2h0RGlmZiA9IGNvbnRXaWR0aCAvIGltZ1dpZHRoICogaW1nSGVpZ2h0LFxyXG5cdFx0XHRuZXdXaWR0aCAgID0gJ2F1dG8nLFxyXG5cdFx0XHRuZXdIZWlnaHQgID0gY29udEhlaWdodCArIGNvcnJIICsgJ3B4JztcclxuXHJcblx0XHRcdGlmICggaGVpZ2h0RGlmZiA+IGNvbnRIZWlnaHQgKSB7XHJcblx0XHRcdFx0bmV3V2lkdGggID0gJzEwMCUnO1xyXG5cdFx0XHRcdG5ld0hlaWdodCA9ICdhdXRvJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZSA9PSAnaW1nJyApIHtcclxuXHRcdFx0aW1nLmNzcyh7IHdpZHRoOiBuZXdXaWR0aCwgaGVpZ2h0OiBuZXdIZWlnaHQgfSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250LmNzcygnYmFja2dyb3VuZC1zaXplJywgbmV3V2lkdGggKyAnICcgKyBuZXdIZWlnaHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbi8vIERldGVybWluZSBJZiBBbiBFbGVtZW50IElzIFNjcm9sbGVkIEludG8gVmlld1xyXG5mdW5jdGlvbiBlbGVtVmlzaWJsZShlbGVtLCBjb250KSB7XHJcblx0dmFyIGNvbnRUb3AgPSBjb250LnNjcm9sbFRvcCgpLFxyXG5cdFx0Y29udEJ0bSA9IGNvbnRUb3AgKyBjb250LmhlaWdodCgpLFxyXG5cdFx0ZWxlbVRvcCA9IGVsZW0ub2Zmc2V0KCkudG9wLFxyXG5cdFx0ZWxlbUJ0bSA9IGVsZW1Ub3AgKyBlbGVtLmhlaWdodCgpO1xyXG5cclxuXHRyZXR1cm4gKChlbGVtQnRtIDw9IGNvbnRCdG0pICYmIChlbGVtVG9wID49IGNvbnRUb3ApKTtcclxufVxyXG5cclxuXHJcbi8vIEZpeCBXUE1MIERyb3Bkb3duXHJcbmpRdWVyeSgnLm1lbnUtaXRlbS1sYW5ndWFnZScpLmFkZENsYXNzKCdkcm9wZG93biBkcm9wLW1lbnUnKS5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcGRvd24tbWVudScpO1xyXG5cclxuLy8gRml4IFBvbHlMYW5nIE1lbnUgSXRlbXMgQW5kIE1ha2UgVGhlbSBEcm9wZG93blxyXG5qUXVlcnkoJy5tZW51LWl0ZW0ubGFuZy1pdGVtJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG5qUXVlcnkoIGZ1bmN0aW9uKCkge1xyXG5cdHZhciBpdGVtID0galF1ZXJ5KCcubGFuZy1pdGVtLmN1cnJlbnQtbGFuZycpO1xyXG5cdGlmIChpdGVtLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0aXRlbSA9IGpRdWVyeSgnLmxhbmctaXRlbScpLmZpcnN0KCk7XHJcblx0fVxyXG5cdHZhciBsYW5ncyA9IGl0ZW0uc2libGluZ3MoJy5sYW5nLWl0ZW0nKTtcclxuXHRpdGVtLmFkZENsYXNzKCdkcm9wZG93biBkcm9wLW1lbnUnKTtcclxuXHRsYW5ncy53cmFwQWxsKCc8dWwgY2xhc3M9XCJzdWItbWVudSBkcm9wZG93bi1tZW51XCI+PC91bD4nKS5wYXJlbnQoKS5hcHBlbmRUbyhpdGVtKTtcclxufSk7IiwiLyogTW9kZXJuaXpyIDIuOC4zIChDdXN0b20gQnVpbGQpIHwgTUlUICYgQlNEXG4gKiBCdWlsZDogaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQvIy1mbGV4Ym94LXJnYmEtaGlzdG9yeS1hdWRpby12aWRlby1zdmdjbGlwcGF0aHMtc2hpdi1jc3NjbGFzc2VzXG4gKi9cbjt3aW5kb3cuTW9kZXJuaXpyPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiB5KGEpe2ouY3NzVGV4dD1hfWZ1bmN0aW9uIHooYSxiKXtyZXR1cm4geShwcmVmaXhlcy5qb2luKGErXCI7XCIpKyhifHxcIlwiKSl9ZnVuY3Rpb24gQShhLGIpe3JldHVybiB0eXBlb2YgYT09PWJ9ZnVuY3Rpb24gQihhLGIpe3JldHVybiEhfihcIlwiK2EpLmluZGV4T2YoYil9ZnVuY3Rpb24gQyhhLGIpe2Zvcih2YXIgZCBpbiBhKXt2YXIgZT1hW2RdO2lmKCFCKGUsXCItXCIpJiZqW2VdIT09YylyZXR1cm4gYj09XCJwZnhcIj9lOiEwfXJldHVybiExfWZ1bmN0aW9uIEQoYSxiLGQpe2Zvcih2YXIgZSBpbiBhKXt2YXIgZj1iW2FbZV1dO2lmKGYhPT1jKXJldHVybiBkPT09ITE/YVtlXTpBKGYsXCJmdW5jdGlvblwiKT9mLmJpbmQoZHx8Yik6Zn1yZXR1cm4hMX1mdW5jdGlvbiBFKGEsYixjKXt2YXIgZD1hLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK2Euc2xpY2UoMSksZT0oYStcIiBcIituLmpvaW4oZCtcIiBcIikrZCkuc3BsaXQoXCIgXCIpO3JldHVybiBBKGIsXCJzdHJpbmdcIil8fEEoYixcInVuZGVmaW5lZFwiKT9DKGUsYik6KGU9KGErXCIgXCIrby5qb2luKGQrXCIgXCIpK2QpLnNwbGl0KFwiIFwiKSxEKGUsYixjKSl9dmFyIGQ9XCIyLjguM1wiLGU9e30sZj0hMCxnPWIuZG9jdW1lbnRFbGVtZW50LGg9XCJtb2Rlcm5penJcIixpPWIuY3JlYXRlRWxlbWVudChoKSxqPWkuc3R5bGUsayxsPXt9LnRvU3RyaW5nLG09XCJXZWJraXQgTW96IE8gbXNcIixuPW0uc3BsaXQoXCIgXCIpLG89bS50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKSxwPXtzdmc6XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wifSxxPXt9LHI9e30scz17fSx0PVtdLHU9dC5zbGljZSx2LHc9e30uaGFzT3duUHJvcGVydHkseDshQSh3LFwidW5kZWZpbmVkXCIpJiYhQSh3LmNhbGwsXCJ1bmRlZmluZWRcIik/eD1mdW5jdGlvbihhLGIpe3JldHVybiB3LmNhbGwoYSxiKX06eD1mdW5jdGlvbihhLGIpe3JldHVybiBiIGluIGEmJkEoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbYl0sXCJ1bmRlZmluZWRcIil9LEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kfHwoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztpZih0eXBlb2YgYyE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGQ9dS5jYWxsKGFyZ3VtZW50cywxKSxlPWZ1bmN0aW9uKCl7aWYodGhpcyBpbnN0YW5jZW9mIGUpe3ZhciBhPWZ1bmN0aW9uKCl7fTthLnByb3RvdHlwZT1jLnByb3RvdHlwZTt2YXIgZj1uZXcgYSxnPWMuYXBwbHkoZixkLmNvbmNhdCh1LmNhbGwoYXJndW1lbnRzKSkpO3JldHVybiBPYmplY3QoZyk9PT1nP2c6Zn1yZXR1cm4gYy5hcHBseShiLGQuY29uY2F0KHUuY2FsbChhcmd1bWVudHMpKSl9O3JldHVybiBlfSkscS5mbGV4Ym94PWZ1bmN0aW9uKCl7cmV0dXJuIEUoXCJmbGV4V3JhcFwiKX0scS5oaXN0b3J5PWZ1bmN0aW9uKCl7cmV0dXJuISFhLmhpc3RvcnkmJiEhaGlzdG9yeS5wdXNoU3RhdGV9LHEucmdiYT1mdW5jdGlvbigpe3JldHVybiB5KFwiYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDE1MCwyNTUsMTUwLC41KVwiKSxCKGouYmFja2dyb3VuZENvbG9yLFwicmdiYVwiKX0scS52aWRlbz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpLGM9ITE7dHJ5e2lmKGM9ISFhLmNhblBsYXlUeXBlKWM9bmV3IEJvb2xlYW4oYyksYy5vZ2c9YS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMuaDI2ND1hLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLndlYm09YS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpfWNhdGNoKGQpe31yZXR1cm4gY30scS5hdWRpbz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpLGM9ITE7dHJ5e2lmKGM9ISFhLmNhblBsYXlUeXBlKWM9bmV3IEJvb2xlYW4oYyksYy5vZ2c9YS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMubXAzPWEuY2FuUGxheVR5cGUoXCJhdWRpby9tcGVnO1wiKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLndhdj1hLmNhblBsYXlUeXBlKCdhdWRpby93YXY7IGNvZGVjcz1cIjFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMubTRhPShhLmNhblBsYXlUeXBlKFwiYXVkaW8veC1tNGE7XCIpfHxhLmNhblBsYXlUeXBlKFwiYXVkaW8vYWFjO1wiKSkucmVwbGFjZSgvXm5vJC8sXCJcIil9Y2F0Y2goZCl7fXJldHVybiBjfSxxLnN2Z2NsaXBwYXRocz1mdW5jdGlvbigpe3JldHVybiEhYi5jcmVhdGVFbGVtZW50TlMmJi9TVkdDbGlwUGF0aC8udGVzdChsLmNhbGwoYi5jcmVhdGVFbGVtZW50TlMocC5zdmcsXCJjbGlwUGF0aFwiKSkpfTtmb3IodmFyIEYgaW4gcSl4KHEsRikmJih2PUYudG9Mb3dlckNhc2UoKSxlW3ZdPXFbRl0oKSx0LnB1c2goKGVbdl0/XCJcIjpcIm5vLVwiKSt2KSk7cmV0dXJuIGUuYWRkVGVzdD1mdW5jdGlvbihhLGIpe2lmKHR5cGVvZiBhPT1cIm9iamVjdFwiKWZvcih2YXIgZCBpbiBhKXgoYSxkKSYmZS5hZGRUZXN0KGQsYVtkXSk7ZWxzZXthPWEudG9Mb3dlckNhc2UoKTtpZihlW2FdIT09YylyZXR1cm4gZTtiPXR5cGVvZiBiPT1cImZ1bmN0aW9uXCI/YigpOmIsdHlwZW9mIGYhPVwidW5kZWZpbmVkXCImJmYmJihnLmNsYXNzTmFtZSs9XCIgXCIrKGI/XCJcIjpcIm5vLVwiKSthKSxlW2FdPWJ9cmV0dXJuIGV9LHkoXCJcIiksaT1rPW51bGwsZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBsKGEsYil7dmFyIGM9YS5jcmVhdGVFbGVtZW50KFwicFwiKSxkPWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdfHxhLmRvY3VtZW50RWxlbWVudDtyZXR1cm4gYy5pbm5lckhUTUw9XCJ4PHN0eWxlPlwiK2IrXCI8L3N0eWxlPlwiLGQuaW5zZXJ0QmVmb3JlKGMubGFzdENoaWxkLGQuZmlyc3RDaGlsZCl9ZnVuY3Rpb24gbSgpe3ZhciBhPXMuZWxlbWVudHM7cmV0dXJuIHR5cGVvZiBhPT1cInN0cmluZ1wiP2Euc3BsaXQoXCIgXCIpOmF9ZnVuY3Rpb24gbihhKXt2YXIgYj1qW2FbaF1dO3JldHVybiBifHwoYj17fSxpKyssYVtoXT1pLGpbaV09YiksYn1mdW5jdGlvbiBvKGEsYyxkKXtjfHwoYz1iKTtpZihrKXJldHVybiBjLmNyZWF0ZUVsZW1lbnQoYSk7ZHx8KGQ9bihjKSk7dmFyIGc7cmV0dXJuIGQuY2FjaGVbYV0/Zz1kLmNhY2hlW2FdLmNsb25lTm9kZSgpOmYudGVzdChhKT9nPShkLmNhY2hlW2FdPWQuY3JlYXRlRWxlbShhKSkuY2xvbmVOb2RlKCk6Zz1kLmNyZWF0ZUVsZW0oYSksZy5jYW5IYXZlQ2hpbGRyZW4mJiFlLnRlc3QoYSkmJiFnLnRhZ1Vybj9kLmZyYWcuYXBwZW5kQ2hpbGQoZyk6Z31mdW5jdGlvbiBwKGEsYyl7YXx8KGE9Yik7aWYoaylyZXR1cm4gYS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7Yz1jfHxuKGEpO3ZhciBkPWMuZnJhZy5jbG9uZU5vZGUoKSxlPTAsZj1tKCksZz1mLmxlbmd0aDtmb3IoO2U8ZztlKyspZC5jcmVhdGVFbGVtZW50KGZbZV0pO3JldHVybiBkfWZ1bmN0aW9uIHEoYSxiKXtiLmNhY2hlfHwoYi5jYWNoZT17fSxiLmNyZWF0ZUVsZW09YS5jcmVhdGVFbGVtZW50LGIuY3JlYXRlRnJhZz1hLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQsYi5mcmFnPWIuY3JlYXRlRnJhZygpKSxhLmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24oYyl7cmV0dXJuIHMuc2hpdk1ldGhvZHM/byhjLGEsYik6Yi5jcmVhdGVFbGVtKGMpfSxhLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ9RnVuY3Rpb24oXCJoLGZcIixcInJldHVybiBmdW5jdGlvbigpe3ZhciBuPWYuY2xvbmVOb2RlKCksYz1uLmNyZWF0ZUVsZW1lbnQ7aC5zaGl2TWV0aG9kcyYmKFwiK20oKS5qb2luKCkucmVwbGFjZSgvW1xcd1xcLV0rL2csZnVuY3Rpb24oYSl7cmV0dXJuIGIuY3JlYXRlRWxlbShhKSxiLmZyYWcuY3JlYXRlRWxlbWVudChhKSwnYyhcIicrYSsnXCIpJ30pK1wiKTtyZXR1cm4gbn1cIikocyxiLmZyYWcpfWZ1bmN0aW9uIHIoYSl7YXx8KGE9Yik7dmFyIGM9bihhKTtyZXR1cm4gcy5zaGl2Q1NTJiYhZyYmIWMuaGFzQ1NTJiYoYy5oYXNDU1M9ISFsKGEsXCJhcnRpY2xlLGFzaWRlLGRpYWxvZyxmaWdjYXB0aW9uLGZpZ3VyZSxmb290ZXIsaGVhZGVyLGhncm91cCxtYWluLG5hdixzZWN0aW9ue2Rpc3BsYXk6YmxvY2t9bWFya3tiYWNrZ3JvdW5kOiNGRjA7Y29sb3I6IzAwMH10ZW1wbGF0ZXtkaXNwbGF5Om5vbmV9XCIpKSxrfHxxKGEsYyksYX12YXIgYz1cIjMuNy4wXCIsZD1hLmh0bWw1fHx7fSxlPS9ePHxeKD86YnV0dG9ufG1hcHxzZWxlY3R8dGV4dGFyZWF8b2JqZWN0fGlmcmFtZXxvcHRpb258b3B0Z3JvdXApJC9pLGY9L14oPzphfGJ8Y29kZXxkaXZ8ZmllbGRzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aXxsYWJlbHxsaXxvbHxwfHF8c3BhbnxzdHJvbmd8c3R5bGV8dGFibGV8dGJvZHl8dGR8dGh8dHJ8dWwpJC9pLGcsaD1cIl9odG1sNXNoaXZcIixpPTAsaj17fSxrOyhmdW5jdGlvbigpe3RyeXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2EuaW5uZXJIVE1MPVwiPHh5ej48L3h5ej5cIixnPVwiaGlkZGVuXCJpbiBhLGs9YS5jaGlsZE5vZGVzLmxlbmd0aD09MXx8ZnVuY3Rpb24oKXtiLmNyZWF0ZUVsZW1lbnQoXCJhXCIpO3ZhciBhPWIuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO3JldHVybiB0eXBlb2YgYS5jbG9uZU5vZGU9PVwidW5kZWZpbmVkXCJ8fHR5cGVvZiBhLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ9PVwidW5kZWZpbmVkXCJ8fHR5cGVvZiBhLmNyZWF0ZUVsZW1lbnQ9PVwidW5kZWZpbmVkXCJ9KCl9Y2F0Y2goYyl7Zz0hMCxrPSEwfX0pKCk7dmFyIHM9e2VsZW1lbnRzOmQuZWxlbWVudHN8fFwiYWJiciBhcnRpY2xlIGFzaWRlIGF1ZGlvIGJkaSBjYW52YXMgZGF0YSBkYXRhbGlzdCBkZXRhaWxzIGRpYWxvZyBmaWdjYXB0aW9uIGZpZ3VyZSBmb290ZXIgaGVhZGVyIGhncm91cCBtYWluIG1hcmsgbWV0ZXIgbmF2IG91dHB1dCBwcm9ncmVzcyBzZWN0aW9uIHN1bW1hcnkgdGVtcGxhdGUgdGltZSB2aWRlb1wiLHZlcnNpb246YyxzaGl2Q1NTOmQuc2hpdkNTUyE9PSExLHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzOmssc2hpdk1ldGhvZHM6ZC5zaGl2TWV0aG9kcyE9PSExLHR5cGU6XCJkZWZhdWx0XCIsc2hpdkRvY3VtZW50OnIsY3JlYXRlRWxlbWVudDpvLGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6cH07YS5odG1sNT1zLHIoYil9KHRoaXMsYiksZS5fdmVyc2lvbj1kLGUuX2RvbVByZWZpeGVzPW8sZS5fY3Nzb21QcmVmaXhlcz1uLGUudGVzdFByb3A9ZnVuY3Rpb24oYSl7cmV0dXJuIEMoW2FdKX0sZS50ZXN0QWxsUHJvcHM9RSxnLmNsYXNzTmFtZT1nLmNsYXNzTmFtZS5yZXBsYWNlKC8oXnxcXHMpbm8tanMoXFxzfCQpLyxcIiQxJDJcIikrKGY/XCIganMgXCIrdC5qb2luKFwiIFwiKTpcIlwiKSxlfSh0aGlzLHRoaXMuZG9jdW1lbnQpOyIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uKCkge1xuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIGRpbWVuc2lvbiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXXxFbGVtZW50c3xqUXVlcnl9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgdGhpcy5SZXNpemVTZW5zb3IgPSBmdW5jdGlvbihlbGVtZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBFdmVudFF1ZXVlKCkge1xuICAgICAgICAgICAgdGhpcy5xID0gW107XG4gICAgICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xLnB1c2goZXYpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gdGhpcy5xLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnFbaV0uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICBwcm9wXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd8TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBwcm9wKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jdXJyZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5jdXJyZW50U3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgcmVzaXplZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgcmVzaXplZCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICdyZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7JztcblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3Iuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInJlc2l6ZS1zZW5zb3ItZXhwYW5kXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICcgd2lkdGg6IDIwMCU7IGhlaWdodDogMjAwJVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG5cbiAgICAgICAgICAgIGlmICghe2ZpeGVkOiAxLCBhYnNvbHV0ZTogMX1bZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cGFuZCA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgZXhwYW5kQ2hpbGQgPSBleHBhbmQuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmsgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzFdO1xuICAgICAgICAgICAgdmFyIHNocmlua0NoaWxkID0gc2hyaW5rLmNoaWxkTm9kZXNbMF07XG5cbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGgsIGxhc3RIZWlnaHQ7XG5cbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gZXhwYW5kLm9mZnNldFdpZHRoICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9IGV4cGFuZC5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSBleHBhbmQuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IGV4cGFuZC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSBzaHJpbmsuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IHNocmluay5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNldCgpO1xuXG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24oZWwsIG5hbWUsIGNiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBuYW1lLCBjYik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBjYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYWRkRXZlbnQoZXhwYW5kLCAnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBsYXN0V2lkdGggfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiBsYXN0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IDwgbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcIltvYmplY3QgQXJyYXldXCIgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlbGVtZW50KVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5ICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkpIC8vanF1ZXJ5XG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBFbGVtZW50cyAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudHMpIC8vbW9vdG9vbHNcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFyIGkgPSAwLCBqID0gZWxlbWVudC5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnRbaV0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGV0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXNpemVTZW5zb3IuZGV0YWNoKGVsZW1lbnQpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB0aGlzLlJlc2l6ZVNlbnNvci5kZXRhY2ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnJlc2l6ZVNlbnNvcikge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5yZXNpemVTZW5zb3I7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KSgpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5FTEVNRU5UIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpO1xyXG5cclxuXHJcblx0Ly8gRWxlbWVudCBBbmltYXRpb25zXHJcblx0ZnVuY3Rpb24gbWl4dEFuaW1hdGlvbnMoKSB7XHJcblx0XHR2YXIgYW5pbUVsZW1zID0gJCgnLm1peHQtYW5pbWF0ZScpO1xyXG5cclxuXHRcdGlmICggYW5pbUVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0YW5pbUVsZW1zLndheXBvaW50KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbS1wcmUnKS5hZGRDbGFzcygnYW5pbS1zdGFydCcpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0b2Zmc2V0OiAnODUlJyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sIDEwMDAgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdG1peHRBbmltYXRpb25zKCk7XHJcblxyXG5cclxuXHQvLyBTdGF0IC8gQ291bnRlciBFbGVtZW50XHJcblx0ZnVuY3Rpb24gbWl4dFN0YXRzKCkge1xyXG5cdFx0dmFyIHN0YXRFbGVtcyA9ICQoJy5taXh0LXN0YXQnKTtcclxuXHJcblx0XHRpZiAoIHN0YXRFbGVtcy5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdC8vIFNldCBzdGF0IHRleHQgdG8gc3RhcnRpbmcgKGZyb20pIHZhbHVlXHJcblx0XHRzdGF0RWxlbXMuZmluZCgnLnN0YXQtdmFsdWUnKS5lYWNoKCBmdW5jdGlvbigpIHsgJCh0aGlzKS50ZXh0KCQodGhpcykuZGF0YSgnZnJvbScpKTsgfSk7XHJcblxyXG5cdFx0Ly8gQW5pbWF0ZSB2YWx1ZVxyXG5cdFx0ZnVuY3Rpb24gc3RhdFZhbHVlKGVsKSB7XHJcblx0XHRcdHZhciBmcm9tICA9IGVsLmRhdGEoJ2Zyb20nKSxcclxuXHRcdFx0XHR0byAgICA9IGVsLmRhdGEoJ3RvJyksXHJcblx0XHRcdFx0c3BlZWQgPSBlbC5kYXRhKCdzcGVlZCcpO1xyXG5cdFx0XHQkKHt2YWx1ZTogZnJvbX0pLmFuaW1hdGUoe3ZhbHVlOiB0b30sIHtcclxuXHRcdFx0XHRkdXJhdGlvbjogc3BlZWQsXHJcblx0XHRcdFx0c3RlcDogZnVuY3Rpb24oKSB7IGVsLnRleHQoTWF0aC5yb3VuZCh0aGlzLnZhbHVlKSk7IH0sXHJcblx0XHRcdFx0YWx3YXlzOiBmdW5jdGlvbigpIHsgZWwudGV4dCh0byk7IH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxyXG5cdFx0ZnVuY3Rpb24gc3RhdENpcmNsZShzdGF0KSB7XHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4uY2lyY2xlUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuY3NzKCdtYXJnaW4tdG9wJywgJCh0aGlzKS5oZWlnaHQoKSAvIC0yKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzdGF0RWxlbXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHN0YXQgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRzdGF0LndheXBvaW50KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XHJcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHRoaXMuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJyApIHRoaXMuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJPbmNlOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XHJcblx0XHRcdFx0XHRzdGF0Q2lyY2xlKHN0YXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0bWl4dFN0YXRzKCk7XHJcblxyXG5cclxuXHQvLyBGbGlwIENhcmQgRXF1YWxpemUgSGVpZ2h0XHJcblx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcclxuXHRcdGZsaXBjYXJkU2lkZXMuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0ZmxpcGNhcmRTaWRlcy5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gRmxpcCBDYXJkIFRvdWNoIFNjcmVlbiBcIkhvdmVyXCJcclxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XHJcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcicpO1xyXG5cdH0pO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5IRUFERVIgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ICA9ICQod2luZG93KSxcclxuXHRcdG1haW5OYXZCYXIgPSAkKCcjbWFpbi1uYXYnKSxcclxuXHRcdG1lZGlhV3JhcCA9ICQoJy5oZWFkLW1lZGlhJyk7XHJcblxyXG5cdC8vIEhlYWQgTWVkaWEgRnVuY3Rpb25zXHJcblx0ZnVuY3Rpb24gaGVhZGVyRm4oKSB7XHJcblx0XHR2YXIgY29udGFpbmVyICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXHJcblx0XHRcdG1lZGlhQ29udCAgICA9IG1lZGlhV3JhcC5jaGlsZHJlbignLm1lZGlhLWNvbnRhaW5lcicpLFxyXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2QmFyLm91dGVySGVpZ2h0KCksXHJcblx0XHRcdHdyYXBIZWlnaHQgICA9IG1lZGlhV3JhcC5oZWlnaHQoKSxcclxuXHRcdFx0aG1IZWlnaHQgICAgID0gMDtcclxuXHJcblx0XHRpZiAoIG1peHRfb3B0LmhlYWRlci5mdWxsc2NyZWVuICkge1xyXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCB3cmFwSGVpZ2h0KTtcclxuXHRcdFx0XHJcblx0XHRcdGhtSGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0KCkgLSBtZWRpYVdyYXAub2Zmc2V0KCkudG9wO1xyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIHsgaG1IZWlnaHQgLT0gdG9wTmF2SGVpZ2h0OyB9XHJcblxyXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCBobUhlaWdodCk7XHJcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGhtSGVpZ2h0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtZWRpYUNvbnQubGVuZ3RoID09IDEgKSB7XHJcblx0XHRcdHZhciBjb250YWluZXJQYWQgPSB0b3BOYXZIZWlnaHQ7XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xyXG5cdFx0XHRcdGNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJywgY29udGFpbmVyUGFkKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb250YWluZXIuY3NzKCdwYWRkaW5nLXRvcCcsIGNvbnRhaW5lclBhZCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEhlYWRlciBTY3JvbGwgVG8gQ29udGVudFxyXG5cdGZ1bmN0aW9uIGhlYWRlclNjcm9sbCgpIHtcclxuXHRcdHZhciBwYWdlICAgPSAkKCdodG1sLCBib2R5JyksXHJcblx0XHRcdG9mZnNldCA9ICQoJyNjb250ZW50LXdyYXAnKS5vZmZzZXQoKS50b3A7XHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7IG9mZnNldCAtPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJykuaGVpZ2h0KCk7IH1cclxuXHRcdCQoJy5oZWFkZXItc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHBhZ2UuYW5pbWF0ZSh7IHNjcm9sbFRvcDogb2Zmc2V0IH0sIDgwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmICggbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XHJcblx0XHRoZWFkZXJGbigpO1xyXG5cclxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnNjcm9sbCApIHsgaGVhZGVyU2Nyb2xsKCk7IH1cclxuXHRcdFxyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBoZWFkZXJGbiApKTtcclxuXHR9XHJcblxyXG59KGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVMUEVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQvLyBTa2lwIExpbmsgRm9jdXMgRml4XG5cdFxuXHR2YXIgaXNfd2Via2l0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICkgPiAtMSxcblx0XHRpc19vcGVyYSAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ29wZXJhJyApICA+IC0xLFxuXHRcdGlzX2llICAgICA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnbXNpZScgKSAgID4gLTE7XG5cblx0aWYgKCAoIGlzX3dlYmtpdCB8fCBpc19vcGVyYSB8fCBpc19pZSApICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICkgKSB7XG5cdFx0dmFyIGV2ZW50TWV0aG9kID0gKCB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ2F0dGFjaEV2ZW50Jztcblx0XHR3aW5kb3dbIGV2ZW50TWV0aG9kIF0oICdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsb2NhdGlvbi5oYXNoLnN1YnN0cmluZyggMSApICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhfGRpdikkL2kudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cblxuXHQvLyBBcHBseSBCb290c3RyYXAgQ2xhc3Nlc1xuXHRcblx0dmFyIHdpZGdldE5hdk1lbnVzID0gJy53aWRnZXRfbWV0YSwgLndpZGdldF9yZWNlbnRfZW50cmllcywgLndpZGdldF9hcmNoaXZlLCAud2lkZ2V0X2NhdGVnb3JpZXMsIC53aWRnZXRfbmF2X21lbnUsIC53aWRnZXRfcGFnZXMnO1xuXHQvLyBXb29Db21tZXJjZSBXaWRnZXRzXG5cdHdpZGdldE5hdk1lbnVzICs9ICcsIC53aWRnZXRfcHJvZHVjdF9jYXRlZ29yaWVzLCAud2lkZ2V0X3Byb2R1Y3RzLCAud2lkZ2V0X3RvcF9yYXRlZF9wcm9kdWN0cywgLndpZGdldF9yZWNlbnRfcmV2aWV3cywgLndpZGdldF9yZWNlbnRseV92aWV3ZWRfcHJvZHVjdHMnO1xuXG5cdCQod2lkZ2V0TmF2TWVudXMpLmNoaWxkcmVuKCd1bCcpLmFkZENsYXNzKCduYXYnKTtcblx0JCgnLndpZGdldF9uYXZfbWVudSB1bC5tZW51JykuYWRkQ2xhc3MoJ25hdicpO1xuXG5cdC8vIEhhbmRsZSBQb3N0IENvdW50IFRhZ3NcblxuXHQkKCcud2lkZ2V0X2FyY2hpdmUgbGksIC53aWRnZXRfY2F0ZWdvcmllcyBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyAgICAgPSAkKHRoaXMpLFxuXHRcdFx0Y2hpbGRyZW4gID0gJHRoaXMuY2hpbGRyZW4oKSxcblx0XHRcdGFuY2hvciAgICA9IGNoaWxkcmVuLmZpbHRlcignYScpLFxuXHRcdFx0Y29udGVudHMgID0gJHRoaXMuY29udGVudHMoKSxcblx0XHRcdGNvdW50VGV4dCA9IGNvbnRlbnRzLm5vdChjaGlsZHJlbikudGV4dCgpO1xuXG5cdFx0aWYgKCBjb3VudFRleHQgIT09ICcnICkge1xuXHRcdFx0YW5jaG9yLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJwb3N0LWNvdW50XCI+JyArIGNvdW50VGV4dCArICc8L3NwYW4+Jyk7XG5cdFx0XHRjb250ZW50cy5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlVHlwZSA9PT0gMzsgXG5cdFx0XHR9KS5yZW1vdmUoKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy53aWRnZXRfbGF5ZXJlZF9uYXYgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0Y291bnQgPSAkdGhpcy5jaGlsZHJlbignLmNvdW50JyksXG5cdFx0XHRsaW5rICA9ICR0aGlzLmNoaWxkcmVuKCdhJyk7XG5cdFx0Y291bnQuYXBwZW5kVG8obGluayk7XG5cdH0pO1xuXG5cdC8vIEdhbGxlcnkgQXJyb3cgTmF2aWdhdGlvblxuXG5cdCQoZG9jdW1lbnQpLmtleWRvd24oIGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdXJsID0gZmFsc2U7XG5cdFx0aWYgKCBlLndoaWNoID09PSAzNyApIHsgIC8vIExlZnQgYXJyb3cga2V5IGNvZGVcblx0XHRcdHVybCA9ICQoJy5wcmV2aW91cy1pbWFnZSBhJykuYXR0cignaHJlZicpO1xuXHRcdH0gZWxzZSBpZiAoIGUud2hpY2ggPT09IDM5ICkgeyAgLy8gUmlnaHQgYXJyb3cga2V5IGNvZGVcblx0XHRcdHVybCA9ICQoJy5lbnRyeS1hdHRhY2htZW50IGEnKS5hdHRyKCdocmVmJyk7XG5cdFx0fVxuXHRcdGlmICggdXJsICYmICggISQoJ3RleHRhcmVhLCBpbnB1dCcpLmlzKCc6Zm9jdXMnKSApICkge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsO1xuXHRcdH1cblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbk5BVkJBUiBGVU5DVElPTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgY29sb3JMb0QgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ICAgICA9ICQod2luZG93KSxcclxuXHRcdGJvZHlFbCAgICAgICA9ICQoJ2JvZHknKSxcclxuXHRcdG1haW5XcmFwICAgICA9ICQoJyNtYWluLXdyYXAnKSxcclxuXHRcdG1haW5OYXZCYXIgICA9ICQoJyNtYWluLW5hdicpLFxyXG5cdFx0bWFpbk5hdldyYXAgID0gJCgnI21haW4tbmF2LXdyYXAnKSxcclxuXHRcdG1haW5OYXZIZWFkICA9ICQoJy5uYXZiYXItaGVhZGVyJywgbWFpbk5hdkJhciksXHJcblx0XHRtYWluTmF2SW5uZXIgPSAkKCcubmF2YmFyLWlubmVyJywgbWFpbk5hdkJhciksXHJcblx0XHRzZWNOYXZCYXIgICAgPSAkKCcjc2Vjb25kLW5hdicpLFxyXG5cdFx0bmF2YmFycyAgICAgID0gJCgnLm5hdmJhcicpLFxyXG5cdFx0bWVkaWFXcmFwICAgID0gJCgnLmhlYWQtbWVkaWEnKTtcclxuXHJcblx0aWYgKCBtYWluTmF2QmFyLmxlbmd0aCA9PT0gMCApIHJldHVybjtcclxuXHJcblx0dmFyIG5hdmJhck9iaiA9IHtcclxuXHJcblx0XHRuYXZCZzogJycsXHJcblx0XHRuYXZCZ1RvcDogJycsXHJcblxyXG5cdFx0Ly8gSW5pdGlhbGl6ZSBOYXZiYXJcclxuXHJcblx0XHRpbml0OiBmdW5jdGlvbihuYXZiYXIpIHtcclxuXHJcblx0XHRcdHZhciBiZ0NvbG9yICA9IG5hdmJhci5jc3MoJ2JhY2tncm91bmQtY29sb3InKSxcclxuXHRcdFx0XHRjb2xvckx1bSA9IGNvbG9yTG9EKGJnQ29sb3IpO1xyXG5cclxuXHRcdFx0aWYgKCBjb2xvckx1bSA9PSAnZGFyaycgKSB7IG5hdmJhci5hZGRDbGFzcygnYmctZGFyaycpOyB9XHJcblx0XHRcdGlmICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkge1xyXG5cdFx0XHRcdG5hdmJhck9iai5uYXZCZyA9ICggY29sb3JMdW0gPT0gJ2RhcmsnICkgPyAnYmctZGFyaycgOiAnJztcclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCAmJiBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPD0gMC40ICkge1xyXG5cdFx0XHRcdFx0bmF2YmFyT2JqLm5hdkJnVG9wID0gbWVkaWFXcmFwLmhhc0NsYXNzKCdiZy1kYXJrJykgPyAnYmctZGFyaycgOiAnJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bmF2YmFyT2JqLm5hdkJnVG9wID0gbmF2YmFyT2JqLm5hdkJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdzdGF0aWMnICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcyhuYXZiYXJPYmoubmF2QmcpLmFkZENsYXNzKCdwb3NpdGlvbi10b3AgJyArIG5hdmJhck9iai5uYXZCZ1RvcCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFN0aWNreSAoZml4ZWQpIE5hdmJhciBGdW5jdGlvblxyXG5cclxuXHRcdHN0aWNreU5hdjogZnVuY3Rpb24oaXNNb2JpbGUpIHtcclxuXHJcblx0XHRcdHZhciBuYXZTY3JvbGxIYW5kbGVyID0gJC50aHJvdHRsZSggNTAsIHN0aWNreU5hdlRvZ2dsZSApLFxyXG5cdFx0XHRcdHNjcm9sbENvcnJlY3Rpb24gPSAwLFxyXG5cdFx0XHRcdG1haW5OYXZIZWlnaHQgICAgID0gMCxcclxuXHRcdFx0XHRtYWluTmF2UG9zICAgICAgICA9IDAsXHJcblx0XHRcdFx0bWFpbk5hdk1nICAgICAgICAgPSAwO1xyXG5cclxuXHRcdFx0aWYgKCBpc01vYmlsZSA9PT0gZmFsc2UgKSB7IHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBuYXZTY3JvbGxIYW5kbGVyKTsgfVxyXG5cdFx0XHRlbHNlIHsgdmlld3BvcnQub2ZmKCdzY3JvbGwnLCBuYXZTY3JvbGxIYW5kbGVyKTsgfVxyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5wYWdlWydzaG93LWFkbWluLWJhciddICkge1xyXG5cdFx0XHRcdHNjcm9sbENvcnJlY3Rpb24gKz0gcGFyc2VGbG9hdChtYWluV3JhcC5jc3MoJ3BhZGRpbmctdG9wJyksIDEwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgKSB7XHJcblx0XHRcdFx0bWFpbk5hdkhlaWdodCA9IG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCAnJykub3V0ZXJIZWlnaHQoKTtcclxuXHRcdFx0XHRtYWluTmF2UG9zICAgID0gcGFyc2VJbnQobWFpbk5hdkJhci5jc3MoJ3RvcCcpLCAxMCk7XHJcblx0XHRcdFx0bWFpbk5hdk1nICAgICA9IG1haW5OYXZIZWlnaHQ7XHJcblxyXG5cdFx0XHRcdGlmICggbWFpbk5hdlBvcyA9PT0gMCB8fCBpc05hTihtYWluTmF2UG9zKSApIHtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIuY3NzKCdtYXJnaW4tdG9wJywgKG1haW5OYXZIZWlnaHQgKiAtMSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc3RpY2t5TmF2VG9nZ2xlKCkge1xyXG5cdFx0XHRcdHZhciBuYXZQb3MgICAgPSBtYWluTmF2V3JhcC5vZmZzZXQoKS50b3AgLSBtYWluTmF2TWcsXHJcblx0XHRcdFx0XHRzY3JvbGxWYWwgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRcdGJnVG9wQ2xzICA9IG5hdmJhck9iai5uYXZCZ1RvcDtcclxuXHJcblx0XHRcdFx0c2Nyb2xsVmFsID0gaXNNb2JpbGUgPT09IHRydWUgPyAwIDogc2Nyb2xsVmFsICs9IHNjcm9sbENvcnJlY3Rpb247XHJcblxyXG5cdFx0XHRcdGlmICggbWFpbk5hdkJhci5oYXNDbGFzcygnc2xpZGUtYmctZGFyaycpICkgeyBiZ1RvcENscyA9ICdiZy1kYXJrJzsgfVxyXG5cdFx0XHRcdGlmICggbWFpbk5hdkJhci5oYXNDbGFzcygnc2xpZGUtYmctbGlnaHQnKSApIHsgYmdUb3BDbHMgPSAnJzsgfVxyXG5cclxuXHRcdFx0XHRpZiAoIHNjcm9sbFZhbCA+IG5hdlBvcyApIHsgIFxyXG5cdFx0XHRcdFx0Ym9keUVsLmFkZENsYXNzKCdmaXhlZC1uYXYnKTtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKG5hdmJhck9iai5uYXZCZyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGJvZHlFbC5yZW1vdmVDbGFzcygnZml4ZWQtbmF2Jyk7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKG5hdmJhck9iai5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RpY2t5TmF2VG9nZ2xlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFByZXZlbnQgTmF2YmFyIFN1Ym1lbnUgT3ZlcmZsb3cgT3V0IE9mIFZpZXdwb3J0XHJcblxyXG5cdFx0bWVudU92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcclxuXHJcblx0XHRcdHZhciBuYXZiYXJPZmYgPSAwLFxyXG5cdFx0XHRcdG1haW5TdWIgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudSAuZHJvcGRvd24tbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiAuc3ViLW1lbnUsIC5tZWdhLW1lbnUtY29sdW1uID4gYScpO1xyXG5cclxuXHRcdFx0aWYgKCBuYXZiYXIubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0XHRuYXZiYXJPZmYgPSBuYXZiYXIub3V0ZXJXaWR0aCgpICsgcGFyc2VJbnQobmF2YmFyLm9mZnNldCgpLmxlZnQsIDEwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gU2V0IE1lbnUgRHJvcCBMZWZ0XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzZXREcm9wTGVmdCh0YXJnZXQpIHtcclxuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xyXG5cdFx0XHRcdGlmICggdGFyZ2V0Lmhhc0NsYXNzKCdhcnJvdy1sZWZ0JykgfHwgdGFyZ2V0Lmhhc0NsYXNzKCdhcnJvdy1yaWdodCcpICkge1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCdhcnJvdy1sZWZ0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XHJcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1sZWZ0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFJlc2V0IE1lbnUgRHJvcFxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcmVzZXRBcnJvdyh0YXJnZXQpIHtcclxuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xyXG5cdFx0XHRcdGlmICggdGFyZ2V0Lmhhc0NsYXNzKCdhcnJvdy1sZWZ0JykgfHwgdGFyZ2V0Lmhhc0NsYXNzKCdhcnJvdy1yaWdodCcpICkge1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XHJcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBSZXNldCBNb2JpbGUgQWRqdXN0bWVudHNcclxuXHJcblx0XHRcdG1haW5OYXZCYXIuY3NzKHsgJ3Bvc2l0aW9uJzogJycsICd0b3AnOiAnJyB9KS5yZW1vdmVDbGFzcygnc3RvcHBlZCcpO1xyXG5cclxuXHRcdFx0Ly8gUGVyZm9ybSBtZW51IG92ZXJmbG93IGNoZWNrc1xyXG5cclxuXHRcdFx0bWFpblN1Yi5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc3ViICAgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0dG9wU3ViICAgPSBzdWIsXHJcblx0XHRcdFx0XHRzdWJQYXIgICA9IHN1Yi5wYXJlbnQoKSxcclxuXHRcdFx0XHRcdHN1YlBvcyAgID0gcGFyc2VJbnQoc3ViLm9mZnNldCgpLmxlZnQsIDEwKSxcclxuXHRcdFx0XHRcdHN1YlcgICAgID0gc3ViLm91dGVyV2lkdGgoKSArIDEsXHJcblx0XHRcdFx0XHRuZXN0T2ZmICA9IHN1YlBvcyArIHN1YlcsXHJcblx0XHRcdFx0XHRuZXN0U3VicyA9IHN1Yi5jaGlsZHJlbignLmRyb3Atc3VibWVudScpLFxyXG5cdFx0XHRcdFx0b3ZlcmZsb3dpbmdTdWJzID0gbmVzdFN1YnMsXHJcblx0XHRcdFx0XHRjb3JyZWN0aW9uO1xyXG5cclxuXHRcdFx0XHRpZiAoIHN1YlBhci5pcygnLm1lZ2EtbWVudS1jb2x1bW4nKSApIHtcclxuXHRcdFx0XHRcdHRvcFN1YiA9IHN1YlBhci5wYXJlbnRzKCcuZHJvcGRvd24tbWVudScpO1xyXG5cdFx0XHRcdFx0b3ZlcmZsb3dpbmdTdWJzID0gdG9wU3ViLmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uOm50aC1jaGlsZCg0bikgLmRyb3Atc3VibWVudSwgLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKG4tNCk6bGFzdC1jaGlsZCAuZHJvcC1zdWJtZW51Jyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBUb3AgTGV2ZWwgU3VibWVudXNcclxuXHJcblx0XHRcdFx0aWYgKCBuZXN0T2ZmID4gbmF2YmFyT2ZmICkge1xyXG5cdFx0XHRcdFx0dmFyIG1nTm93ID0gcGFyc2VJbnQodG9wU3ViLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApO1xyXG5cdFx0XHRcdFx0Y29ycmVjdGlvbiA9IChuZXN0T2ZmIC0gbmF2YmFyT2ZmIC0gMikgKiAtMTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG5hdmJhci5oYXNDbGFzcygnYm9yZGVyZWQnKSB8fCBuYXZiYXIucGFyZW50cygnLm5hdmJhcicpLmhhc0NsYXNzKCdib3JkZXJlZCcpICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIGNvcnJlY3Rpb24gPCBtZ05vdyApIHtcclxuXHRcdFx0XHRcdFx0dG9wU3ViLmNzcygnbWFyZ2luLWxlZnQnLCBjb3JyZWN0aW9uICsgJ3B4Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZXREcm9wTGVmdChvdmVyZmxvd2luZ1N1YnMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXHJcblxyXG5cdFx0XHRcdG5lc3RTdWJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIHN1Yk5vdyAgICA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdG5lc3RTdWJzVyA9IFtdO1xyXG5cdFx0XHRcdFx0c3ViTm93LmZpbmQoJy5zdWItbWVudTpub3QoOmhhcyguZHJvcC1zdWJtZW51KSknKS5tYXAoIGZ1bmN0aW9uKGkpIHtcclxuXHRcdFx0XHRcdFx0dmFyICR0aGlzICAgID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRzICA9ICR0aGlzLnBhcmVudHMoJy5zdWItbWVudScpLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudHNXID0gMDtcclxuXHJcblx0XHRcdFx0XHRcdHBhcmVudHMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXICs9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRuZXN0U3Vic1dbaV0gPSAkdGhpcy5vdXRlcldpZHRoKCkgKyBwYXJlbnRzVztcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHZhciBtYXhOZXN0VyA9ICQuaXNFbXB0eU9iamVjdChuZXN0U3Vic1cpID8gMCA6IE1hdGgubWF4LmFwcGx5KG51bGwsIG5lc3RTdWJzVyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCAobmVzdE9mZiArIG1heE5lc3RXKSA+PSBib2R5RWwud2lkdGgoKSApIHtcclxuXHRcdFx0XHRcdFx0c2V0RHJvcExlZnQoc3ViTm93KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc2V0QXJyb3coc3ViTm93KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTWVnYSBNZW51IEVuYWJsZSAvIERpc2FibGVcclxuXHJcblx0XHRtZWdhTWVudVRvZ2dsZTogZnVuY3Rpb24odG9nZ2xlLCBuYXZiYXIpIHtcclxuXHRcdFx0dmFyIG1lZ2FNZW51cztcclxuXHJcblx0XHRcdGlmICggdG9nZ2xlID09ICdlbmFibGUnICkge1xyXG5cdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51W2RhdGEtbWVnYS1tZW51PVwidHJ1ZVwiXScpO1xyXG5cdFx0XHRcdG1lZ2FNZW51cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBtZWdhTWVudSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0bWVnYU1lbnUuYWRkQ2xhc3MoJ21lZ2EtbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLW1lbnUnKS5yZW1vdmVBdHRyKCdkYXRhLW1lZ2EtbWVudScpO1xyXG5cdFx0XHRcdFx0JCgnPiAuc3ViLW1lbnUgPiAuZHJvcC1zdWJtZW51JywgbWVnYU1lbnUpLnJlbW92ZUNsYXNzKCdkcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdG1lZ2FNZW51cy5jaGlsZHJlbigndWwnKS5jc3MoJ21hcmdpbi1sZWZ0JywgJycpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCB0b2dnbGUgPT0gJ2Rpc2FibGUnICkge1xyXG5cdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcubWVnYS1tZW51Jyk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0XHRtZWdhTWVudS5yZW1vdmVDbGFzcygnbWVnYS1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbWVudScpLmF0dHIoJ2RhdGEtbWVnYS1tZW51JywgJ3RydWUnKTtcclxuXHRcdFx0XHRcdG1lZ2FNZW51LmZpbmQoJy5tZWdhLW1lbnUtY29sdW1uJykucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKS5hZGRDbGFzcygnZHJvcC1zdWJtZW51Jyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gQ3JlYXRlIE1lZ2EgTWVudSBSb3dzIElmIFRoZXJlIEFyZSBNb3JlIFRoYW4gNCBDb2x1bW5zXHJcblxyXG5cdFx0bWVnYU1lbnVSb3dzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0bWFpbldyYXAuZmluZCgnLm1lZ2EtbWVudScpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBtYWluTWVudSA9ICQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLFxyXG5cdFx0XHRcdFx0Y29sdW1ucyAgPSBtYWluTWVudS5jaGlsZHJlbignLm1lZ2EtbWVudS1jb2x1bW4nKTtcclxuXHJcblx0XHRcdFx0aWYgKCBjb2x1bW5zLmxlbmd0aCA+IDQgKSBtYWluTWVudS5hZGRDbGFzcygnbXVsdGktcm93Jyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBNb2JpbGUgRnVuY3Rpb25zXHJcblxyXG5cdFx0bmF2TW9iaWxlOiBmdW5jdGlvbihtcU5hdikge1xyXG5cclxuXHRcdFx0Ly8gRW5hYmxlIE5hdiBTY3JvbGxpbmcgSWYgTmF2YmFyIEhlaWdodCA+IFZpZXdwb3J0XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBuYXZTY3JvbGwoKSB7XHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmIG1xTmF2ID09IDIgKSB7XHJcblx0XHRcdFx0XHR2YXIgdmlld3BvcnRIICAgICA9IHZpZXdwb3J0LmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydFMgICAgID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRcdG5hdmJhckhlYWRlckggPSBtYWluTmF2SGVhZC5oZWlnaHQoKSArIDEsXHJcblx0XHRcdFx0XHRcdG5hdmJhcklubmVySCAgPSBtYWluTmF2SW5uZXIuaGFzQ2xhc3MoJ2luJykgPyBtYWluTmF2SW5uZXIuaGVpZ2h0KCkgOiAwLFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJIICAgICAgID0gbmF2YmFySGVhZGVySCArIG5hdmJhcklubmVySCxcclxuXHRcdFx0XHRcdFx0bmF2YmFyTWcgICAgICA9IDAsXHJcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgICAgPSBtYWluTmF2QmFyLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRcdFx0bmF2d3JhcFRvcCAgICA9IG1haW5OYXZXcmFwLm9mZnNldCgpLnRvcCxcclxuXHJcblx0XHRcdFx0XHRcdHNjcm9sbEhhbmRsZXIgPSAkLnRocm90dGxlKCA1MCwgbmF2U3RvcFNjcm9sbCApO1xyXG5cclxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcclxuXHRcdFx0XHRcdFx0dmFyIGFkbWluQmFySCA9ICQoJyN3cGFkbWluYmFyJykuaGVpZ2h0KCk7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0SCAgLT0gYWRtaW5CYXJIO1xyXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wIC09IGFkbWluQmFySDtcclxuXHRcdFx0XHRcdFx0bmF2YmFyVG9wICAtPSBhZG1pbkJhckg7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgKSB7XHJcblx0XHRcdFx0XHRcdG5hdmJhck1nID0gbmF2YmFySGVhZGVySCAqIC0xO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggbmF2YmFySCA+IHZpZXdwb3J0SCApIHtcclxuXHRcdFx0XHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIG1haW5OYXZCYXIubm90KCdzdG9wcGVkJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygnc3RvcHBlZCcpLmNzcyh7ICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsICd0b3AnOiAobmF2YmFyVG9wIC0gbmF2d3JhcFRvcCksICdtYXJnaW4tdG9wJzogJzAnIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xyXG5cdFx0XHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycsICdtYXJnaW4tdG9wJzogbmF2YmFyTWcgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIG5hdlN0b3BTY3JvbGwoKSB7XHJcblx0XHRcdFx0XHR2YXIgdmlld1Njcm9sbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0XHRzdG9wU2Nyb2xsID0gbWFpbk5hdkJhci5oYXNDbGFzcygnc3RvcHBlZCcpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0aWYgKCB2aWV3cG9ydFMgPiBtYWluTmF2SGVhZC5vZmZzZXQoKS50b3AgKSB7IHN0b3BTY3JvbGwgPSBmYWxzZTsgfVxyXG5cdFx0XHRcdFx0aWYgKCB2aWV3cG9ydFMgPiB2aWV3U2Nyb2xsICYmIHN0b3BTY3JvbGwgKSB7IHZpZXdwb3J0LnNjcm9sbFRvcCh2aWV3cG9ydFMpOyB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTaG93L2hpZGUgU3VibWVudXMgT24gSGFuZGxlIENsaWNrXHJcblxyXG5cdFx0XHQkKCcuZHJvcGRvd24tdG9nZ2xlJywgbWFpbk5hdkJhcikub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdGlmICggJChldmVudC50YXJnZXQpLmlzKCcuZHJvcC1hcnJvdycpICkge1xyXG5cdFx0XHRcdFx0aWYoIGV2ZW50LmhhbmRsZWQgIT09IHRydWUgKSB7XHJcblx0XHRcdFx0XHRcdHZhciBoYW5kbGUgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0XHRcdG1lbnUgICA9IGhhbmRsZS5jbG9zZXN0KCcubWVudS1pdGVtJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIG1lbnUuaGFzQ2xhc3MoJ2V4cGFuZCcpICkge1xyXG5cdFx0XHRcdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtZW51KS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bWVudS5hZGRDbGFzcygnZXhwYW5kJykuc2libGluZ3MoJ2xpJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpLmZpbmQoJy5leHBhbmQnKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdG5hdlNjcm9sbCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0ZXZlbnQuaGFuZGxlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtYWluTmF2SW5uZXIub24oJ3Nob3duLmJzLmNvbGxhcHNlIGhpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtYWluTmF2QmFyKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcblx0XHRcdFx0bmF2U2Nyb2xsKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bmF2U2Nyb2xsKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gUlVOIE5BVkJBUiBGVU5DVElPTlNcclxuXHJcblx0Ly8gQ2hlY2sgd2hpY2ggbWVkaWEgcXVlcmllcyBhcmUgYWN0aXZlXHJcblx0dmFyIG1xQ2hlY2sgPSBmdW5jdGlvbiggZWxlbSApIHtcclxuXHRcdGVsZW0gPSAkKCcjJyArIGVsZW0pO1xyXG5cdFx0dmFyIGRpc3BsYXkgPSBlbGVtLmNzcygnZGlzcGxheScpO1xyXG5cclxuXHRcdGlmICggZGlzcGxheSA9PSAnYmxvY2snICkgeyByZXR1cm4gMTsgfVxyXG5cdFx0ZWxzZSBpZiAoIGRpc3BsYXkgPT0gJ2lubGluZScpIHsgcmV0dXJuIDI7IH1cclxuXHRcdGVsc2UgeyByZXR1cm4gMDsgfVxyXG5cdH07XHJcblxyXG5cdC8vIEVuYWJsZSBNZW51IEhvdmVyIE9uIFRvdWNoIFNjcmVlbnNcclxuXHR2YXIgbWVudVBhcmVudHMgPSBuYXZiYXJzLmZpbmQoJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuLCBsaS5kcm9wZG93bicpO1xyXG5cdGZ1bmN0aW9uIG1lbnVUb3VjaEhvdmVyKGV2ZW50KSB7XHJcblx0XHR2YXIgbGluayA9ICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLFxyXG5cdFx0XHRhbmNlc3RvcnMgPSBsaW5rLnBhcmVudHMoJy5ob3ZlcicpO1xyXG5cdFx0aWYgKGxpbmsuaGFzQ2xhc3MoJ2hvdmVyJykpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsaW5rLmFkZENsYXNzKCdob3ZlcicpO1xyXG5cdFx0XHRtZW51UGFyZW50cy5ub3QobGluaykubm90KGFuY2VzdG9ycykucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gbWVudVRvdWNoUmVtb3ZlSG92ZXIoZXZlbnQpIHtcclxuXHRcdGlmICggISAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KS5pcyhtZW51UGFyZW50cykgKSB7IG1lbnVQYXJlbnRzLnJlbW92ZUNsYXNzKCdob3ZlcicpOyB9XHJcblx0fVxyXG5cclxuXHQvLyBGdW5jdGlvbnMgUnVuIE9uIExvYWQgJiBXaW5kb3cgUmVzaXplXHJcblx0ZnVuY3Rpb24gbmF2YmFyRm4oKSB7XHJcblxyXG5cdFx0dmFyIG1xTmF2ID0gbXFDaGVjaygnbmF2YmFyLWNoZWNrJyk7IC8vIEVxdWFscyBcIjBcIiBmb3IgZGVza3RvcCwgXCIxXCIgZm9yIG1vYmlsZSBhbmQgXCIyXCIgZm9yIHRhYmxldHNcclxuXHJcblx0XHQvLyBSdW4gZnVuY3Rpb24gdG8gcHJldmVudCBzdWJtZW51cyBnb2luZyBvdXRzaWRlIHZpZXdwb3J0XHJcblx0XHRuYXZiYXJzLm5vdChtYWluTmF2QmFyKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0bmF2YmFyT2JqLm1lbnVPdmVyZmxvdygkKCcubmF2YmFyLWlubmVyJywgdGhpcykpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gUnVuIGZ1bmN0aW9ucyBiYXNlZCBvbiBjdXJyZW50bHkgYWN0aXZlIG1lZGlhIHF1ZXJ5XHJcblx0XHRpZiAoIG1xTmF2ID09PSAwICkge1xyXG5cdFx0XHRuYXZiYXJPYmoubWVudU92ZXJmbG93KG1haW5OYXZJbm5lcik7XHJcblx0XHRcdG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCAnJyk7XHJcblxyXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdG5hdmJhck9iai5tZWdhTWVudVRvZ2dsZSgnZW5hYmxlJywgJCh0aGlzKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWVudVBhcmVudHMub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vbigndG91Y2hzdGFydCcsIG1lbnVUb3VjaFJlbW92ZUhvdmVyKTtcclxuXHRcdH0gZWxzZSBpZiAoIG1xTmF2ID4gMCApIHtcclxuXHRcdFx0bmF2YmFyT2JqLm5hdk1vYmlsZShtcU5hdik7XHJcblxyXG5cdFx0XHR2YXIgbmF2SGVpZ2h0ID0gbWFpbk5hdkhlYWQub3V0ZXJIZWlnaHQoKSArIDE7XHJcblx0XHRcdG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCBuYXZIZWlnaHQpO1xyXG5cclxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRuYXZiYXJPYmoubWVnYU1lbnVUb2dnbGUoJ2Rpc2FibGUnLCAkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtZW51UGFyZW50cy5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcclxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHtcclxuXHRcdFx0aWYgKCBtcU5hdiA9PT0gMSApIHtcclxuXHRcdFx0XHRuYXZiYXJPYmouc3RpY2t5TmF2KHRydWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5hdmJhck9iai5zdGlja3lOYXYoZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdwb3NpdGlvbi10b3AnKTtcclxuXHRcdH1cclxuXHJcblx0XHRuYXZiYXJPdmVybGFwKCk7XHJcblx0fVxyXG5cclxuXHQvLyBIYW5kbGUgTmF2YmFyIEl0ZW1zIE92ZXJsYXBcclxuXHR2YXIgbWFpbk5hdkNvbnQgICAgPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXHJcblx0XHRtYWluTmF2TG9nb0NscyA9IG1haW5OYXZXcmFwLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicpLFxyXG5cdFx0bWFpbk5hdkl0ZW1zV2lkdGggPSAwLFxyXG5cclxuXHRcdHNlY05hdkNvbnQgPSBzZWNOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdHNlY05hdkl0ZW1zV2lkdGggPSAwO1xyXG5cclxuXHRpZiAoIG1haW5OYXZMb2dvQ2xzICE9ICdsb2dvLWNlbnRlcicgKSB7XHJcblx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IG1haW5OYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcclxuXHR9XHJcblx0aWYgKCBzZWNOYXZCYXIubGVuZ3RoICkge1xyXG5cdFx0c2VjTmF2SXRlbXNXaWR0aCA9ICQoJy5sZWZ0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBuYXZiYXJPdmVybGFwKCkge1xyXG5cclxuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soJ25hdmJhci1jaGVjaycpO1xyXG5cclxuXHRcdC8vIFByaW1hcnkgTmF2YmFyXHJcblx0XHRpZiAoIG1haW5OYXZMb2dvQ2xzICE9ICdsb2dvLWNlbnRlcicgKSB7XHJcblx0XHRcdGlmICggbXFOYXYgPT09IDAgKSB7XHJcblx0XHRcdFx0dmFyIG1haW5OYXZDb250V2lkdGggPSBtYWluTmF2Q29udC53aWR0aCgpO1xyXG5cdFx0XHRcdGlmICggbWFpbk5hdkl0ZW1zV2lkdGggPiBtYWluTmF2Q29udFdpZHRoICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MobWFpbk5hdkxvZ29DbHMpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygnbG9nby1jZW50ZXInKS5hZGRDbGFzcyhtYWluTmF2TG9nb0Nscyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKG1haW5OYXZMb2dvQ2xzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNlY29uZGFyeSBOYXZiYXJcclxuXHRcdGlmICggc2VjTmF2QmFyLmxlbmd0aCApIHtcclxuXHRcdFx0dmFyIHNlY05hdkNvbnRXaWR0aCA9IHNlY05hdkNvbnQuaW5uZXJXaWR0aCgpO1xyXG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLmFkZENsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0bmF2YmFyT3ZlcmxhcCgpO1xyXG5cclxuXHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0bmF2YmFyT2JqLmluaXQoJCh0aGlzKSk7XHJcblx0fSk7XHJcblxyXG5cdG5hdmJhckZuKCk7XHJcblxyXG5cdG5hdmJhck9iai5tZWdhTWVudVJvd3MoKTtcclxuXHJcblx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIG5hdmJhckZuICkpO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5QT1NUIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0LCBpZnJhbWVBc3BlY3QgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpO1xyXG5cclxuXHQvLyBSZXNpemUgRW1iZWRkZWQgVmlkZW9zIFByb3BvcnRpb25hbGx5XHJcblx0aWZyYW1lQXNwZWN0KCAkKCcucG9zdCBpZnJhbWUnKSApO1xyXG5cclxuXHQvLyBQb3N0IExheW91dFxyXG5cdGZ1bmN0aW9uIHBvc3RzUGFnZSgpIHtcclxuXHJcblx0XHQvLyBGZWF0dXJlZCBHYWxsZXJ5IFNsaWRlclxyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodFNsaWRlciA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIGdhbGxlcnlTbGlkZXIgPSAkKCcuZ2FsbGVyeS1zbGlkZXInKS5ub3QoJy5saWdodFNsaWRlcicpO1xyXG5cdFx0XHRnYWxsZXJ5U2xpZGVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Z2FsbGVyeVNsaWRlci5saWdodFNsaWRlcih7XHJcblx0XHRcdFx0XHRpdGVtOiAxLFxyXG5cdFx0XHRcdFx0YXV0bzogdHJ1ZSxcclxuXHRcdFx0XHRcdGxvb3A6IHRydWUsXHJcblx0XHRcdFx0XHRwYWdlcjogZmFsc2UsXHJcblx0XHRcdFx0XHRwYXVzZTogNTAwMCxcclxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2xpZGVNYXJnaW46IDAsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRHYWxsZXJ5ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgbGlnaHRHYWxsZXJ5ID0gJCgnLmxpZ2h0Ym94LWdhbGxlcnknKTtcclxuXHRcdFx0bGlnaHRHYWxsZXJ5LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bGlnaHRHYWxsZXJ5LmxpZ2h0R2FsbGVyeSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcXVhbGl6ZSBmZWF0dXJlZCBtZWRpYSBoZWlnaHQgZm9yIHJlbGF0ZWQgcG9zdHMgYW5kIGdyaWQgYmxvZ1xyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIG1hdGNoSGVpZ2h0RWwgPSAkKCcuYmxvZy1ncmlkIC5wb3N0cy1jb250YWluZXIgLnBvc3QtZmVhdCwgLnBvc3QtcmVsYXRlZCAucG9zdC1mZWF0Jyk7XHJcblx0XHRcdG1hdGNoSGVpZ2h0RWwuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRtYXRjaEhlaWdodEVsLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoe1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiAkKCcud3AtcG9zdC1pbWFnZScpLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBMb2FkIFBvc3RzICYgQ29tbWVudHMgdmlhIEFqYXhcclxuXHRmdW5jdGlvbiBtaXh0QWpheExvYWQodHlwZSkge1xyXG5cdFx0dHlwZSA9IHR5cGUgfHwgJ3Bvc3RzJztcclxuXHRcdHZhciBwYWdDb250ID0gJCgnLnBhZ2luZy1uYXZpZ2F0aW9uJyksXHJcblx0XHRcdGFqYXhCdG4gPSAkKCcuYWpheC1tb3JlJywgcGFnQ29udCksXHJcblx0XHRcdHBhZ2VOb3cgPSBwYWdDb250LmRhdGEoJ3BhZ2Utbm93JyksXHJcblx0XHRcdHBhZ2VNYXggPSBwYWdDb250LmRhdGEoJ3BhZ2UtbWF4JyksXHJcblx0XHRcdHBhZ2VOdW0sXHJcblx0XHRcdHBhZ2VUeXBlLFxyXG5cdFx0XHRuZXh0VXJsLFxyXG5cdFx0XHRjb250YWluZXIsXHJcblx0XHRcdGVsZW1lbnQsXHJcblx0XHRcdGxvYWRTZWw7XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XHJcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XHJcblx0XHRcdG5leHRVcmwgICA9IG1peHRfb3B0LmxheW91dFsnbmV4dC11cmwnXTtcclxuXHRcdFx0Y29udGFpbmVyID0gJCgnLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRlbGVtZW50ICAgPSAnLmFydGljbGUnO1xyXG5cdFx0XHRsb2FkU2VsICAgPSAnIC5wb3N0cy1jb250YWluZXIgLmFydGljbGUnO1xyXG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xyXG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ107XHJcblx0XHRcdG5leHRVcmwgICA9IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1uZXh0LXVybCddO1xyXG5cdFx0XHRjb250YWluZXIgPSAkKCcuY29tbWVudC1saXN0Jyk7XHJcblx0XHRcdGVsZW1lbnQgICA9ICcuY29tbWVudCc7XHJcblx0XHRcdGxvYWRTZWwgICA9ICcgLmNvbW1lbnQtbGlzdCA+IGxpJztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XHJcblx0XHRcdHBhZ2VOdW0gPSBwYWdlTm93IC0gMTtcclxuXHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBhZ2VOdW0gPSBwYWdlTm93ICsgMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICggcGFnZU5vdyA+PSBwYWdlTWF4ICkgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddICE9ICduZXdlc3QnIHx8IHBhZ2VOdW0gPD0gMCApIHtcclxuXHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFqYXhCdG4ub24oJ2NsaWNrIGNvbnQ6Ym90dG9tJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHQvLyBQcmV2ZW50IGxvYWRpbmcgdHdpY2Ugb24gc2Nyb2xsXHJcblx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XHJcblx0XHRcclxuXHRcdFx0Ly8gQXJlIHRoZXJlIG1vcmUgcGFnZXMgdG8gbG9hZD9cclxuXHRcdFx0aWYgKCBwYWdlTnVtID4gMCAmJiBwYWdlTnVtIDw9IHBhZ2VNYXggKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdsb2FkaW5nJyk7XHJcblxyXG5cdFx0XHRcdC8vIExvYWQgcG9zdHNcclxuXHRcdFx0XHQvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xyXG5cdFx0XHRcdCQoJzxkaXY+JykubG9hZChuZXh0VXJsICsgbG9hZFNlbCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XHJcblx0XHRcdFx0XHR2YXIgbmV3UG9zdHMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRcdGFqYXhCdG4uYmx1cigpO1xyXG5cclxuXHRcdFx0XHRcdG5ld1Bvc3RzLmNoaWxkcmVuKGVsZW1lbnQpLmFkZENsYXNzKCdhamF4LW5ldycpO1xyXG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgJiYgbWl4dF9vcHQubGF5b3V0LnR5cGUgIT0gJ21hc29ucnknICYmIG1peHRfb3B0LnBhZ2VbJ3Nob3ctcGFnZS1uciddICkge1xyXG5cdFx0XHRcdFx0XHRuZXdQb3N0cy5wcmVwZW5kKCc8ZGl2IGNsYXNzPVwiYWpheC1wYWdlIHBhZ2UtJysgcGFnZU51bSArJ1wiPjxhIGhyZWY9XCInKyBuZXh0VXJsICsnXCI+UGFnZSAnKyBwYWdlTnVtICsnPC9hPjwvZGl2PicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChuZXdQb3N0cy5odG1sKCkpO1xyXG5cclxuXHRcdFx0XHRcdG5ld1Bvc3RzID0gY29udGFpbmVyLmNoaWxkcmVuKCcuYWpheC1uZXcnKTtcclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgcGFnZSBudW1iZXIgYW5kIG5leHRVcmxcclxuXHRcdFx0XHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xyXG5cdFx0XHRcdFx0XHRwYWdlTnVtKys7XHJcblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL3BhZ2VcXC9bMC05XT8vLCAnL3BhZ2UvJyArIHBhZ2VOdW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XHJcblx0XHRcdFx0XHRcdFx0cGFnZU51bS0tO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGJ1dHRvbiBzdGF0ZVxyXG5cdFx0XHRcdFx0aWYgKCBwYWdlTnVtIDw9IHBhZ2VNYXggJiYgcGFnZU51bSA+IDAgKSB7IGFqYXhCdG4uYnV0dG9uKCdyZXNldCcpOyB9XHJcblx0XHRcdFx0XHRlbHNlIHsgYWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7IH1cclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgbGF5b3V0IG9uY2UgcG9zdHMgaGF2ZSBsb2FkZWRcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRuZXdQb3N0cy5yZW1vdmVDbGFzcygnYWpheC1uZXcnKTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XHJcblx0XHRcdFx0XHRcdFx0aWZyYW1lQXNwZWN0KCk7XHJcblx0XHRcdFx0XHRcdFx0cG9zdHNQYWdlKCk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmlzb3RvcGUoJ2FwcGVuZGVkJywgbmV3UG9zdHMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LCAxMDApO1xyXG5cclxuXHRcdFx0XHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyApIHsgdmlld3BvcnQub24oJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpOyB9XHJcblxyXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIEVycm9yc1xyXG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPT0gJ2Vycm9yJyApIHtcclxuXHRcdFx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHRcdC8vIERlYnVnZ2luZyBpbmZvXHJcblx0XHRcdFx0XHRcdC8vIGFsZXJ0KCdBSkFYIEVycm9yOiAnICsgeGhyLnN0YXR1cyArICcgJyArIHhoci5zdGF0dXNUZXh0ICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFRyaWdnZXIgQUpBWCBsb2FkIHVwb24gcmVhY2hpbmcgYm90dG9tIG9mIHBhZ2VcclxuXHRcdHZhciBhamF4U2Nyb2xsSGFuZGxlID0gJC5kZWJvdW5jZSggNTAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQvKiBnbG9iYWwgZWxlbVZpc2libGUgKi9cclxuXHRcdFx0XHRpZiAoIGVsZW1WaXNpYmxlKGFqYXhCdG4sIHZpZXdwb3J0KSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRcdGFqYXhCdG4udHJpZ2dlcignY29udDpib3R0b20nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICYmIGFqYXhCdG4ubGVuZ3RoICkge1xyXG5cdFx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIEV4ZWN1dGUgRnVuY3Rpb24gV2hlcmUgQXBwbGljYWJsZVxyXG5cdGlmICggbWl4dF9vcHQucGFnZVsncG9zdHMtcGFnZSddICYmIG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtY2xpY2snIHx8IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcclxuXHRcdG1peHRBamF4TG9hZCgncG9zdHMnKTtcclxuXHR9XHJcblx0aWYgKCBtaXh0X29wdC5wYWdlWydwYWdlLXR5cGUnXSA9PSAnc2luZ2xlJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtY2xpY2snIHx8IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1zY3JvbGwnICkge1xyXG5cdFx0bWl4dEFqYXhMb2FkKCdjb21tZW50cycpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIEZ1bmN0aW9ucyBUbyBSdW4gT24gV2luZG93IFJlc2l6ZVxyXG5cdGZ1bmN0aW9uIHJlc2l6ZUZuKCkge1xyXG5cdFx0aWZyYW1lQXNwZWN0KCk7XHJcblx0fVxyXG5cdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCByZXNpemVGbiApKTtcclxuXHJcblxyXG5cdC8vIEZ1bmN0aW9ucyBUbyBSdW4gT24gTG9hZFxyXG5cdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHBvc3RzUGFnZSgpO1xyXG5cclxuXHRcdC8vIElzb3RvcGUgTWFzb25yeSBJbml0XHJcblx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyAmJiB0eXBlb2YgJC5mbi5pc290b3BlID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgYmxvZ0NvbnQgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcclxuXHJcblx0XHRcdGJsb2dDb250Lmlzb3RvcGUoe1xyXG5cdFx0XHRcdGl0ZW1TZWxlY3RvcjogJy5hcnRpY2xlJyxcclxuXHRcdFx0XHRsYXlvdXQ6ICdtYXNvbnJ5JyxcclxuXHRcdFx0XHRndXR0ZXI6IDBcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRibG9nQ29udC5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSk7XHJcblx0XHRcdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0gKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIFRyaWdnZXIgTGlnaHRib3ggT24gRmVhdHVyZWQgSW1hZ2UgQ2xpY2tcclxuXHRcdCQoJy5saWdodGJveC10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykuc2libGluZ3MoJy5nYWxsZXJ5JykuZmluZCgnbGknKS5maXJzdCgpLmNsaWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Ly8gUmVsYXRlZCBQb3N0cyBTbGlkZXJcclxuXHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdHZhciByZWxQb3N0c1NsaWRlciA9ICQoJy5wb3N0LXJlbGF0ZWQgLnNsaWRlci1jb250Jyk7XHJcblx0XHRcdHJlbFBvc3RzU2xpZGVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmVsUG9zdHNTbGlkZXIubGlnaHRTbGlkZXIoe1xyXG5cdFx0XHRcdFx0aXRlbTogMyxcclxuXHRcdFx0XHRcdHBhZ2VyOiBmYWxzZSxcclxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2xpZGVNYXJnaW46IDIwLFxyXG5cdFx0XHRcdFx0cmVzcG9uc2l2ZTogW3tcclxuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogOTYwLFxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nczogeyBpdGVtOiAzIH1cclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0YnJlYWtwb2ludDogNTQwLFxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nczogeyBpdGVtOiAyIH1cclxuXHRcdFx0XHRcdH1dLFxyXG5cdFx0XHRcdFx0b25TbGlkZXJMb2FkOiBmdW5jdGlvbihlbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5wb3N0LWZlYXQnLCByZWxQb3N0c1NsaWRlcikubWF0Y2hIZWlnaHQoKTtcclxuXHRcdFx0XHRcdFx0XHRyZWxQb3N0c1NsaWRlci5jc3MoJ2hlaWdodCcsICcnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0oalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuVUkgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxyXG5cdFx0aHRtbEVsICAgPSAkKCdodG1sJyksXHJcblx0XHRib2R5RWwgICA9ICQoJ2JvZHknKTtcclxuXHJcblxyXG5cdC8vIFNwaW5uZXIgSW5wdXRcclxuXHQkKCcubWl4dC1zcGlubmVyJykub24oJ2NsaWNrJywgJy5idG4nLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciAkZWwgICAgID0gJCh0aGlzKSxcclxuXHRcdFx0c3Bpbm5lciA9ICRlbC5wYXJlbnRzKCcubWl4dC1zcGlubmVyJyksXHJcblx0XHRcdGlucHV0ICAgPSBzcGlubmVyLmNoaWxkcmVuKCcuc3Bpbm5lci12YWwnKSxcclxuXHRcdFx0c3RlcCAgICA9IGlucHV0LmF0dHIoJ3N0ZXAnKSB8fCAxLFxyXG5cdFx0XHRtaW5WYWwgID0gaW5wdXQuYXR0cignbWluJykgfHwgMCxcclxuXHRcdFx0bWF4VmFsICA9IGlucHV0LmF0dHIoJ21heCcpIHx8IG51bGwsXHJcblx0XHRcdHZhbCAgICAgPSBpbnB1dC52YWwoKSxcclxuXHRcdFx0bmV3VmFsO1xyXG5cdFx0aWYgKCBpc05hTih2YWwpICkgdmFsID0gbWluVmFsO1xyXG5cdFx0XHJcblx0XHRpZiAoICRlbC5oYXNDbGFzcygnbWludXMnKSApIHtcclxuXHRcdFx0Ly8gRGVjcmVhc2VcclxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpIC0gcGFyc2VGbG9hdChzdGVwKTtcclxuXHRcdFx0aWYgKCBuZXdWYWwgPCBtaW5WYWwgKSBuZXdWYWwgPSBtaW5WYWw7XHJcblx0XHRcdGlucHV0LnZhbChuZXdWYWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gSW5jcmVhc2VcclxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpICsgcGFyc2VGbG9hdChzdGVwKTtcclxuXHRcdFx0aWYgKCBtYXhWYWwgIT09IG51bGwgJiYgbmV3VmFsID4gbWF4VmFsICkgbmV3VmFsID0gbWF4VmFsO1xyXG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIENvbnRlbnQgRmlsdGVyaW5nXHJcblx0JCgnLmNvbnRlbnQtZmlsdGVyLWxpbmtzJykuY2hpbGRyZW4oKS5jbGljayggZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGluayA9ICQodGhpcyksXHJcblx0XHRcdGZpbHRlciA9IGxpbmsuZGF0YSgnZmlsdGVyJyksXHJcblx0XHRcdGNvbnRlbnQgPSAkKCcuJyArIGxpbmsucGFyZW50cygnLmNvbnRlbnQtZmlsdGVyLWxpbmtzJykuZGF0YSgnY29udGVudCcpKSxcclxuXHRcdFx0ZmlsdGVyQ2xhc3MgPSAnZmlsdGVyLWhpZGRlbic7XHJcblx0XHRsaW5rLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdGlmICggZmlsdGVyID09ICdhbGwnICkgeyBjb250ZW50LmZpbmQoJy4nK2ZpbHRlckNsYXNzKS5yZW1vdmVDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVEb3duKDYwMCk7IH1cclxuXHRcdGVsc2UgeyBjb250ZW50LmZpbmQoJy4nICsgZmlsdGVyKS5yZW1vdmVDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVEb3duKDYwMCkuc2libGluZ3MoJzpub3QoLicrZmlsdGVyKycpJykuYWRkQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlVXAoNjAwKTsgfVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gU29ydCBwb3J0Zm9saW8gaXRlbXNcclxuXHQkKCcucG9ydGZvbGlvLXNvcnRlciBhJykuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHR0YXJnZXRUYWcgPSBlbGVtLmRhdGEoJ3NvcnQnKSxcclxuXHRcdFx0dGFyZ2V0Q29udGFpbmVyID0gJCgnLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHRcdGVsZW0ucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICYmIHR5cGVvZiAkLmZuLmlzb3RvcGUgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdGlmICh0YXJnZXRUYWcgPT0gJ2FsbCcpIHtcclxuXHRcdFx0XHR0YXJnZXRDb250YWluZXIuaXNvdG9wZSh7IGZpbHRlcjogJyonIH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnLicgKyB0YXJnZXRUYWcgfSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwcm9qZWN0cyA9IHRhcmdldENvbnRhaW5lci5jaGlsZHJlbignLnBvcnRmb2xpbycpO1xyXG5cdFx0XHRpZiAoIHRhcmdldFRhZyA9PSAnYWxsJyApIHtcclxuXHRcdFx0XHRwcm9qZWN0cy5mYWRlSW4oMzAwKS5hZGRDbGFzcygnZmlsdGVyZWQnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwcm9qZWN0cy5mYWRlT3V0KDApLnJlbW92ZUNsYXNzKCdmaWx0ZXJlZCcpLmZpbHRlcignLicgKyB0YXJnZXRUYWcpLmZhZGVJbigzMDApLmFkZENsYXNzKCdmaWx0ZXJlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBPZmZzZXQgc2Nyb2xsaW5nIHRvIGxpbmsgYW5jaG9yIChoYXNoKVxyXG5cdCQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGxpbmsgPSAkKHRoaXMpLFxyXG5cdFx0XHRoYXNoID0gbGluay5hdHRyKCdocmVmJyk7XHJcblxyXG5cdFx0aWYgKCBsaW5rLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJykgKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKCBoYXNoLmxlbmd0aCApIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJChoYXNoKTtcclxuXHRcdFx0aWYgKCB0YXJnZXQubGVuZ3RoKSB7XHJcblx0XHRcdFx0LyogZ2xvYmFsIGJyZWFrcG9pbnQgKi9cclxuXHRcdFx0XHR2YXIgaGFzaE9mZnNldCA9ICQoaGFzaCkub2Zmc2V0KCkudG9wO1xyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBicmVha3BvaW50Lm5hbWUgIT0gJ3BsdXRvJyAmJiBicmVha3BvaW50Lm5hbWUgIT0gJ21lcmN1cnknICkgeyBoYXNoT2Zmc2V0IC09ICQoJyNtYWluLW5hdicpLm91dGVySGVpZ2h0KCk7IH1cclxuXHRcdFx0XHRodG1sRWwuYWRkKGJvZHlFbCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogaGFzaE9mZnNldCB9LCA2MDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQvLyBJZ25vcmUgc3BlY2lmaWMgYW5jaG9yc1xyXG5cdCQoJy50YWJzIGEsIC52Y190dGEgYScpLmF0dHIoJ2RhdGEtbm8taGFzaC1zY3JvbGwnLCB0cnVlKTtcclxuXHJcblxyXG5cdC8vIFNvY2lhbCBJY29uc1xyXG5cdCQoJy5zb2NpYWwtbGlua3MnKS5ub3QoJy5ob3Zlci1ub25lJykuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY29udCA9ICQodGhpcyk7XHJcblxyXG5cdFx0Y29udC5jaGlsZHJlbigpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaWNvbiA9ICQodGhpcyksXHJcblx0XHRcdFx0bGluayA9IGljb24uY2hpbGRyZW4oJ2EnKSxcclxuXHRcdFx0XHRkYXRhQ29sb3IgPSBsaW5rLmF0dHIoJ2RhdGEtY29sb3InKTtcclxuXHJcblx0XHRcdGlmICggY29udC5oYXNDbGFzcygnaG92ZXItYmcnKSApIHtcclxuXHRcdFx0XHRsaW5rLmhvdmVyKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmICggY29udC5wYXJlbnRzKCcucG9zaXRpb24tdG9wJykubGVuZ3RoID09PSAwICYmIGNvbnQucGFyZW50cygnLm5vLWhvdmVyLWJnJykubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdFx0XHRsaW5rLmNzcyh7IGJhY2tncm91bmRDb2xvcjogZGF0YUNvbG9yLCBib3JkZXJDb2xvcjogZGF0YUNvbG9yLCB6SW5kZXg6IDEgfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiAnJywgYm9yZGVyQ29sb3I6ICcnLCB6SW5kZXg6ICcnIH0pOyB9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaW5rLmhvdmVyKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmICggY29udC5wYXJlbnRzKCcubmF2YmFyLnBvc2l0aW9uLXRvcCcpLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHRcdFx0bGluay5jc3MoeyBjb2xvcjogZGF0YUNvbG9yLCB6SW5kZXg6IDEgfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgY29sb3I6ICcnLCB6SW5kZXg6ICcnIH0pOyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBUb29sdGlwcyBJbml0XHJcblx0JCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXSwgLnJlbGF0ZWQtdGl0bGUtdGlwJykudG9vbHRpcCh7XHJcblx0XHRwbGFjZW1lbnQ6ICdhdXRvJyxcclxuXHRcdGNvbnRhaW5lcjogJ2JvZHknXHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBPbiBIb3ZlciBBbmltYXRpb25zIEluaXRcclxuXHR2YXIgYW5pbUhvdmVyRWwgPSAkKCcuYW5pbS1vbi1ob3ZlcicpO1xyXG5cdGFuaW1Ib3ZlckVsLmhvdmVySW50ZW50KCBmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyZWQnKTtcclxuXHRcdHZhciBpbm5lciAgID0gJCh0aGlzKS5jaGlsZHJlbignLm9uLWhvdmVyJyksXHJcblx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXHJcblx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0JztcclxuXHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1PdXQpLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbUluKTtcclxuXHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2hvdmVyZWQnKTtcclxuXHRcdHZhciBpbm5lciAgID0gJCh0aGlzKS5jaGlsZHJlbignLm9uLWhvdmVyJyksXHJcblx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXHJcblx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0JztcclxuXHRcdGlubmVyLnJlbW92ZUNsYXNzKGFuaW1JbikuYWRkQ2xhc3MoYW5pbU91dCk7XHJcblx0fSwgMzAwKTtcclxuXHRhbmltSG92ZXJFbC5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIE1TQW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoICEgJCh0aGlzKS5oYXNDbGFzcygnaG92ZXJlZCcpICkge1xyXG5cdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIEJhY2sgVG8gVG9wIEJ1dHRvblxyXG5cdGZ1bmN0aW9uIGJhY2tUb1RvcERpc3BsYXkoKSB7XHJcblx0XHR2YXIgc2Nyb2xsVG9wID0gdmlld3BvcnQuc2Nyb2xsVG9wKCk7XHJcblx0XHRpZiAoIHNjcm9sbFRvcCA+IDIwMCApIHtcclxuXHRcdFx0YmFja1RvVG9wLmZhZGVJbigzMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YmFja1RvVG9wLmZhZGVPdXQoMzAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBiYWNrVG9Ub3AgPSAkKCcjYmFjay10by10b3AnKTtcclxuXHJcblx0aWYgKCBiYWNrVG9Ub3AubGVuZ3RoICkge1xyXG5cdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsICQudGhyb3R0bGUoIDEwMDAsIGJhY2tUb1RvcERpc3BsYXkgKSkuc2Nyb2xsKCk7XHJcblxyXG5cdFx0YmFja1RvVG9wLmNsaWNrKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aHRtbEVsLmFkZChib2R5RWwpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgNjAwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0oalF1ZXJ5KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
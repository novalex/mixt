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


// Convert color to RGBa
function colorToRgba(color, opacity) {
	if ( color.substring(0,4) == 'rgba' ) {
		var alpha = color.match(/([^\,]*)\)$/);
		return color.replace(alpha[1], opacity);
	} else if ( color.substring(0,3) == 'rgb' ) {
		return color.replace('rgb(', 'rgba(').replace(')', ', '+opacity+')');
	} else {
		hex = color.replace('#','');
		var r = parseInt(hex.substring(0,2), 16),
			g = parseInt(hex.substring(2,4), 16),
			b = parseInt(hex.substring(4,6), 16);
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
	
	var widgetNavMenus = '.widget_meta, .widget_recent_entries, .widget_archive, .widget_categories, .widget_nav_menu, .widget_pages, .widget_rss';
	// WooCommerce Widgets
	widgetNavMenus += ', .widget_product_categories, .widget_products, .widget_top_rated_products, .widget_recent_reviews, .widget_recently_viewed_products, .widget_layered_nav';
	$(widgetNavMenus).children('ul').addClass('nav');
	$('.widget_nav_menu ul.menu').addClass('nav');

	$('#wp-calendar').addClass('table table-striped table-bordered');
	$('.woocommerce .shop_table').addClass('table table-bordered');

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

	var navbarObj = {

		navBg: '',
		navBgTop: '',

		// Initialize Navbar

		init: function(navbar) {

			var bgColor  = navbar.css('background-color'),
				colorLum = colorLoD(bgColor);

			if ( colorLum == 'dark' ) { navbar.addClass('bg-dark'); }
			if ( navbar.is(mainNavBar) ) {
				navbarObj.navBg = ( colorLum == 'dark' ) ? 'bg-dark' : 'bg-light';
				mainNavBar.attr('data-bg', colorLum);
				if ( mixt_opt.nav.transparent && mixt_opt.header.enabled ) {
					var headCssSheet = $('style[data-id="mixt-head-css"]');
					// Add opacity rules
					if ( mixt_opt.nav.opacity < 1 ) {
						headCssSheet.append('.fixed-nav .navbar.navbar-mixt { background-color: '+colorToRgba(bgColor, mixt_opt.nav.opacity)+'; }');
					}
					if ( mixt_opt.nav['top-opacity'] < 1 ) {
						headCssSheet.append('.nav-transparent .navbar.navbar-mixt.position-top { background-color: '+colorToRgba(bgColor, mixt_opt.nav['top-opacity'])+'; }');
					}
					if ( mixt_opt.nav['top-opacity'] <= 0.4 ) {
						if ( mediaWrap.hasClass('bg-dark') ) { navbarObj.navBgTop = 'bg-dark'; }
						else if ( mediaWrap.hasClass('bg-light') ) { navbarObj.navBgTop = 'bg-light'; }
						else { navbarObj.navBgTop = navbarObj.navBg; }
					}
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
				else if ( mainNavBar.hasClass('slide-bg-light') && ( navbarObj.navBg != 'bg-dark' || mixt_opt.nav['top-opacity'] <= 0.4 ) ) { bgTopCls = 'bg-light'; }

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
	navbars.each( function() {
		navbarObj.init($(this));
	});
	
	navbarObj.megaMenuRows();

	mainNavBar.on('refresh', function() {
		navbarObj.init(mainNavBar);
	});


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


	// Ensure vertical navbar items fit in viewport
	function verticalNavFitView() {
		if ( viewport.height() < mainNavCont.innerHeight() ) {
			mainNavWrap.removeClass('vertical-fixed').addClass('vertical-static');
		} else {
			mainNavWrap.removeClass('vertical-static').addClass('vertical-fixed');
		}
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

		// Vertical navbar handling
		if ( mixt_opt.nav.layout == 'vertical' && mixt_opt.nav['vertical-mode'] == 'fixed' && mqNav === 0 ) {
			// Make navbar static if items don't fit in viewport
			verticalNavFitView();
		}

		navbarOverlap();
	}
	viewport.resize( $.debounce( 500, navbarFn )).resize();


	// Handle Navbar Items Overlap
	var mainNavLogoCls = mainNavWrap.attr('data-logo-align'),
		mainNavItemsWidth = 0,
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
		if ( mainNavLogoCls != 'logo-center' && mixt_opt.nav.layout == 'horizontal' ) {
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

}(jQuery);

/* ------------------------------------------------ /
POST FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt, iframeAspect */

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
				var matchHeightEl = $('.blog-grid .posts-container .post-feat, .post-related .post-feat');
				matchHeightEl.addClass('fix-height').matchHeight({
					target: $('.wp-post-image'),
				});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsIlJlc2l6ZVNlbnNvci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZSAtIHYxLjEgLSAzLzcvMjAxMFxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW5cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuICovXG5cbi8vIFNjcmlwdDogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2U6IFNvbWV0aW1lcywgbGVzcyBpcyBtb3JlIVxuLy9cbi8vICpWZXJzaW9uOiAxLjEsIExhc3QgdXBkYXRlZDogMy83LzIwMTAqXG4vLyBcbi8vIFByb2plY3QgSG9tZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbi8vIEdpdEh1YiAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvXG4vLyBTb3VyY2UgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLmpzXG4vLyAoTWluaWZpZWQpICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLm1pbi5qcyAoMC43a2IpXG4vLyBcbi8vIEFib3V0OiBMaWNlbnNlXG4vLyBcbi8vIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hbixcbi8vIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuLy8gaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuLy8gXG4vLyBBYm91dDogRXhhbXBsZXNcbi8vIFxuLy8gVGhlc2Ugd29ya2luZyBleGFtcGxlcywgY29tcGxldGUgd2l0aCBmdWxseSBjb21tZW50ZWQgY29kZSwgaWxsdXN0cmF0ZSBhIGZld1xuLy8gd2F5cyBpbiB3aGljaCB0aGlzIHBsdWdpbiBjYW4gYmUgdXNlZC5cbi8vIFxuLy8gVGhyb3R0bGUgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL3Rocm90dGxlL1xuLy8gRGVib3VuY2UgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL2RlYm91bmNlL1xuLy8gXG4vLyBBYm91dDogU3VwcG9ydCBhbmQgVGVzdGluZ1xuLy8gXG4vLyBJbmZvcm1hdGlvbiBhYm91dCB3aGF0IHZlcnNpb24gb3IgdmVyc2lvbnMgb2YgalF1ZXJ5IHRoaXMgcGx1Z2luIGhhcyBiZWVuXG4vLyB0ZXN0ZWQgd2l0aCwgd2hhdCBicm93c2VycyBpdCBoYXMgYmVlbiB0ZXN0ZWQgaW4sIGFuZCB3aGVyZSB0aGUgdW5pdCB0ZXN0c1xuLy8gcmVzaWRlIChzbyB5b3UgY2FuIHRlc3QgaXQgeW91cnNlbGYpLlxuLy8gXG4vLyBqUXVlcnkgVmVyc2lvbnMgLSBub25lLCAxLjMuMiwgMS40LjJcbi8vIEJyb3dzZXJzIFRlc3RlZCAtIEludGVybmV0IEV4cGxvcmVyIDYtOCwgRmlyZWZveCAyLTMuNiwgU2FmYXJpIDMtNCwgQ2hyb21lIDQtNSwgT3BlcmEgOS42LTEwLjEuXG4vLyBVbml0IFRlc3RzICAgICAgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3VuaXQvXG4vLyBcbi8vIEFib3V0OiBSZWxlYXNlIEhpc3Rvcnlcbi8vIFxuLy8gMS4xIC0gKDMvNy8yMDEwKSBGaXhlZCBhIGJ1ZyBpbiA8alF1ZXJ5LnRocm90dGxlPiB3aGVyZSB0cmFpbGluZyBjYWxsYmFja3Ncbi8vICAgICAgIGV4ZWN1dGVkIGxhdGVyIHRoYW4gdGhleSBzaG91bGQuIFJld29ya2VkIGEgZmFpciBhbW91bnQgb2YgaW50ZXJuYWxcbi8vICAgICAgIGxvZ2ljIGFzIHdlbGwuXG4vLyAxLjAgLSAoMy82LzIwMTApIEluaXRpYWwgcmVsZWFzZSBhcyBhIHN0YW5kLWFsb25lIHByb2plY3QuIE1pZ3JhdGVkIG92ZXJcbi8vICAgICAgIGZyb20ganF1ZXJ5LW1pc2MgcmVwbyB2MC40IHRvIGpxdWVyeS10aHJvdHRsZSByZXBvIHYxLjAsIGFkZGVkIHRoZVxuLy8gICAgICAgbm9fdHJhaWxpbmcgdGhyb3R0bGUgcGFyYW1ldGVyIGFuZCBkZWJvdW5jZSBmdW5jdGlvbmFsaXR5LlxuLy8gXG4vLyBUb3BpYzogTm90ZSBmb3Igbm9uLWpRdWVyeSB1c2Vyc1xuLy8gXG4vLyBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBiZWNhdXNlIG5vdGhpbmcgaW50ZXJuYWxcbi8vIHVzZXMgYW55IGpRdWVyeSBtZXRob2RzIG9yIHByb3BlcnRpZXMuIGpRdWVyeSBpcyBqdXN0IHVzZWQgYXMgYSBuYW1lc3BhY2Vcbi8vIHVuZGVyIHdoaWNoIHRoZXNlIG1ldGhvZHMgY2FuIGV4aXN0LlxuLy8gXG4vLyBTaW5jZSBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBpZiBqUXVlcnkgZG9lc24ndCBleGlzdFxuLy8gd2hlbiB0aGlzIHBsdWdpbiBpcyBsb2FkZWQsIHRoZSBtZXRob2QgZGVzY3JpYmVkIGJlbG93IHdpbGwgYmUgY3JlYXRlZCBpblxuLy8gdGhlIGBDb3dib3lgIG5hbWVzcGFjZS4gVXNhZ2Ugd2lsbCBiZSBleGFjdGx5IHRoZSBzYW1lLCBidXQgaW5zdGVhZCBvZlxuLy8gJC5tZXRob2QoKSBvciBqUXVlcnkubWV0aG9kKCksIHlvdSdsbCBuZWVkIHRvIHVzZSBDb3dib3kubWV0aG9kKCkuXG5cbihmdW5jdGlvbih3aW5kb3csdW5kZWZpbmVkKXtcbiAgJyQ6bm9tdW5nZSc7IC8vIFVzZWQgYnkgWVVJIGNvbXByZXNzb3IuXG4gIFxuICAvLyBTaW5jZSBqUXVlcnkgcmVhbGx5IGlzbid0IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgdXNlIGBqUXVlcnlgIGFzIHRoZVxuICAvLyBuYW1lc3BhY2Ugb25seSBpZiBpdCBhbHJlYWR5IGV4aXN0cywgb3RoZXJ3aXNlIHVzZSB0aGUgYENvd2JveWAgbmFtZXNwYWNlLFxuICAvLyBjcmVhdGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gIHZhciAkID0gd2luZG93LmpRdWVyeSB8fCB3aW5kb3cuQ293Ym95IHx8ICggd2luZG93LkNvd2JveSA9IHt9ICksXG4gICAgXG4gICAgLy8gSW50ZXJuYWwgbWV0aG9kIHJlZmVyZW5jZS5cbiAgICBqcV90aHJvdHRsZTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LnRocm90dGxlXG4gIC8vIFxuICAvLyBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcbiAgLy8gZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLiBJZiB5b3Ugd2FudCB0b1xuICAvLyByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uIHRvIGEgc2luZ2xlIHRpbWUsIHNlZSB0aGVcbiAgLy8gPGpRdWVyeS5kZWJvdW5jZT4gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vID4gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgdGhyb3R0bGVkID0galF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBub190cmFpbGluZyAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vX3RyYWlsaW5nIGlzXG4gIC8vICAgIHRydWUsIGNhbGxiYWNrIHdpbGwgb25seSBleGVjdXRlIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIHdoaWxlIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkLiBJZiBub190cmFpbGluZyBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZSBhZnRlciB0aGUgbGFzdFxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuXG4gIC8vICAgIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIHRocm90dGxlZCwgZnVuY3Rpb24uXG4gIFxuICAkLnRocm90dGxlID0ganFfdGhyb3R0bGUgPSBmdW5jdGlvbiggZGVsYXksIG5vX3RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VfbW9kZSApIHtcbiAgICAvLyBBZnRlciB3cmFwcGVyIGhhcyBzdG9wcGVkIGJlaW5nIGNhbGxlZCwgdGhpcyB0aW1lb3V0IGVuc3VyZXMgdGhhdFxuICAgIC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuICAgIC8vIGRlYm91bmNlIG1vZGVzLlxuICAgIHZhciB0aW1lb3V0X2lkLFxuICAgICAgXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG4gICAgICBsYXN0X2V4ZWMgPSAwO1xuICAgIFxuICAgIC8vIGBub190cmFpbGluZ2AgZGVmYXVsdHMgdG8gZmFsc3kuXG4gICAgaWYgKCB0eXBlb2Ygbm9fdHJhaWxpbmcgIT09ICdib29sZWFuJyApIHtcbiAgICAgIGRlYm91bmNlX21vZGUgPSBjYWxsYmFjaztcbiAgICAgIGNhbGxiYWNrID0gbm9fdHJhaWxpbmc7XG4gICAgICBub190cmFpbGluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLy8gVGhlIGB3cmFwcGVyYCBmdW5jdGlvbiBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSB0aHJvdHRsaW5nIC8gZGVib3VuY2luZ1xuICAgIC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG4gICAgLy8gaXMgZXhlY3V0ZWQuXG4gICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgZWxhcHNlZCA9ICtuZXcgRGF0ZSgpIC0gbGFzdF9leGVjLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgXG4gICAgICAvLyBFeGVjdXRlIGBjYWxsYmFja2AgYW5kIHVwZGF0ZSB0aGUgYGxhc3RfZXhlY2AgdGltZXN0YW1wLlxuICAgICAgZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgbGFzdF9leGVjID0gK25ldyBEYXRlKCk7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KCB0aGF0LCBhcmdzICk7XG4gICAgICB9O1xuICAgICAgXG4gICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pIHRoaXMgaXMgdXNlZCB0byBjbGVhciB0aGUgZmxhZ1xuICAgICAgLy8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cbiAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aW1lb3V0X2lkID0gdW5kZWZpbmVkO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlICYmICF0aW1lb3V0X2lkICkge1xuICAgICAgICAvLyBTaW5jZSBgd3JhcHBlcmAgaXMgYmVpbmcgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZSBhbmRcbiAgICAgICAgLy8gYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgZXhlY3V0ZSBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIENsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0LlxuICAgICAgdGltZW91dF9pZCAmJiBjbGVhclRpbWVvdXQoIHRpbWVvdXRfaWQgKTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgJiYgZWxhcHNlZCA+IGRlbGF5ICkge1xuICAgICAgICAvLyBJbiB0aHJvdHRsZSBtb2RlLCBpZiBgZGVsYXlgIHRpbWUgaGFzIGJlZW4gZXhjZWVkZWQsIGV4ZWN1dGVcbiAgICAgICAgLy8gYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgICBcbiAgICAgIH0gZWxzZSBpZiAoIG5vX3RyYWlsaW5nICE9PSB0cnVlICkge1xuICAgICAgICAvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG4gICAgICAgIC8vIGV4Y2VlZGVkLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYGRlbGF5YCBtcyBhZnRlciBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBleGVjdXRpb24uXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGVcbiAgICAgICAgLy8gYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuICAgICAgICAvLyBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIHRpbWVvdXRfaWQgPSBzZXRUaW1lb3V0KCBkZWJvdW5jZV9tb2RlID8gY2xlYXIgOiBleGVjLCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgPyBkZWxheSAtIGVsYXBzZWQgOiBkZWxheSApO1xuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgLy8gU2V0IHRoZSBndWlkIG9mIGB3cmFwcGVyYCBmdW5jdGlvbiB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbCBjYWxsYmFjaywgc29cbiAgICAvLyBpdCBjYW4gYmUgcmVtb3ZlZCBpbiBqUXVlcnkgMS40KyAudW5iaW5kIG9yIC5kaWUgYnkgdXNpbmcgdGhlIG9yaWdpbmFsXG4gICAgLy8gY2FsbGJhY2sgYXMgYSByZWZlcmVuY2UuXG4gICAgaWYgKCAkLmd1aWQgKSB7XG4gICAgICB3cmFwcGVyLmd1aWQgPSBjYWxsYmFjay5ndWlkID0gY2FsbGJhY2suZ3VpZCB8fCAkLmd1aWQrKztcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9O1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkuZGVib3VuY2VcbiAgLy8gXG4gIC8vIERlYm91bmNlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBEZWJvdW5jaW5nLCB1bmxpa2UgdGhyb3R0bGluZyxcbiAgLy8gZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gIC8vIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2VyaWVzIG9mIGNhbGxzLCBvciBhdCB0aGUgdmVyeSBlbmQuIElmIHlvdSB3YW50IHRvXG4gIC8vIHNpbXBseSByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLCBzZWUgdGhlIDxqUXVlcnkudGhyb3R0bGU+XG4gIC8vIG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+ICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyA+IFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciBkZWJvdW5jZWQgPSBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIGF0X2JlZ2luIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYXRfYmVnaW4gaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgb25seSBiZSBleGVjdXRlZCBgZGVsYXlgIG1pbGxpc2Vjb25kcyBhZnRlclxuICAvLyAgICB0aGUgbGFzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gSWYgYXRfYmVnaW4gaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBiZVxuICAvLyAgICBleGVjdXRlZCBvbmx5IGF0IHRoZSBmaXJzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZVxuICAvLyAgICBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIGRlYm91bmNlZCwgZnVuY3Rpb24uXG4gIFxuICAkLmRlYm91bmNlID0gZnVuY3Rpb24oIGRlbGF5LCBhdF9iZWdpbiwgY2FsbGJhY2sgKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrID09PSB1bmRlZmluZWRcbiAgICAgID8ganFfdGhyb3R0bGUoIGRlbGF5LCBhdF9iZWdpbiwgZmFsc2UgKVxuICAgICAgOiBqcV90aHJvdHRsZSggZGVsYXksIGNhbGxiYWNrLCBhdF9iZWdpbiAhPT0gZmFsc2UgKTtcbiAgfTtcbiAgXG59KSh0aGlzKTtcbiIsIi8qIVxuICogaG92ZXJJbnRlbnQgdjEuOC4xIC8vIDIwMTQuMDguMTEgLy8galF1ZXJ5IHYxLjkuMStcbiAqIGh0dHA6Ly9jaGVybmUubmV0L2JyaWFuL3Jlc291cmNlcy9qcXVlcnkuaG92ZXJJbnRlbnQuaHRtbFxuICpcbiAqIFlvdSBtYXkgdXNlIGhvdmVySW50ZW50IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuIEJhc2ljYWxseSB0aGF0XG4gKiBtZWFucyB5b3UgYXJlIGZyZWUgdG8gdXNlIGhvdmVySW50ZW50IGFzIGxvbmcgYXMgdGhpcyBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuXG4gKiBDb3B5cmlnaHQgMjAwNywgMjAxNCBCcmlhbiBDaGVybmVcbiAqL1xuIFxuLyogaG92ZXJJbnRlbnQgaXMgc2ltaWxhciB0byBqUXVlcnkncyBidWlsdC1pbiBcImhvdmVyXCIgbWV0aG9kIGV4Y2VwdCB0aGF0XG4gKiBpbnN0ZWFkIG9mIGZpcmluZyB0aGUgaGFuZGxlckluIGZ1bmN0aW9uIGltbWVkaWF0ZWx5LCBob3ZlckludGVudCBjaGVja3NcbiAqIHRvIHNlZSBpZiB0aGUgdXNlcidzIG1vdXNlIGhhcyBzbG93ZWQgZG93biAoYmVuZWF0aCB0aGUgc2Vuc2l0aXZpdHlcbiAqIHRocmVzaG9sZCkgYmVmb3JlIGZpcmluZyB0aGUgZXZlbnQuIFRoZSBoYW5kbGVyT3V0IGZ1bmN0aW9uIGlzIG9ubHlcbiAqIGNhbGxlZCBhZnRlciBhIG1hdGNoaW5nIGhhbmRsZXJJbi5cbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4ganVzdCBsaWtlIC5ob3ZlcigpXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCApXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIHdpdGggZXZlbnQgZGVsZWdhdGlvbiFcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0LCBzZWxlY3RvciApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCwgc2VsZWN0b3IgKVxuICpcbiAqIC8vIHVzaW5nIGEgYmFzaWMgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIC5ob3ZlckludGVudCggY29uZmlnIClcbiAqXG4gKiBAcGFyYW0gIGhhbmRsZXJJbiAgIGZ1bmN0aW9uIE9SIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0gIGhhbmRsZXJPdXQgIGZ1bmN0aW9uIE9SIHNlbGVjdG9yIGZvciBkZWxlZ2F0aW9uIE9SIHVuZGVmaW5lZFxuICogQHBhcmFtICBzZWxlY3RvciAgICBzZWxlY3RvciBPUiB1bmRlZmluZWRcbiAqIEBhdXRob3IgQnJpYW4gQ2hlcm5lIDxicmlhbihhdCljaGVybmUoZG90KW5ldD5cbiAqL1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAkLmZuLmhvdmVySW50ZW50ID0gZnVuY3Rpb24oaGFuZGxlckluLGhhbmRsZXJPdXQsc2VsZWN0b3IpIHtcblxuICAgICAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gdmFsdWVzXG4gICAgICAgIHZhciBjZmcgPSB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgc2Vuc2l0aXZpdHk6IDYsXG4gICAgICAgICAgICB0aW1lb3V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgaGFuZGxlckluID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCBoYW5kbGVySW4gKTtcbiAgICAgICAgfSBlbHNlIGlmICgkLmlzRnVuY3Rpb24oaGFuZGxlck91dCkpIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlck91dCwgc2VsZWN0b3I6IHNlbGVjdG9yIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlckluLCBzZWxlY3RvcjogaGFuZGxlck91dCB9ICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnN0YW50aWF0ZSB2YXJpYWJsZXNcbiAgICAgICAgLy8gY1gsIGNZID0gY3VycmVudCBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCB1cGRhdGVkIGJ5IG1vdXNlbW92ZSBldmVudFxuICAgICAgICAvLyBwWCwgcFkgPSBwcmV2aW91cyBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCBzZXQgYnkgbW91c2VvdmVyIGFuZCBwb2xsaW5nIGludGVydmFsXG4gICAgICAgIHZhciBjWCwgY1ksIHBYLCBwWTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGdldHRpbmcgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIHRyYWNrID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGNYID0gZXYucGFnZVg7XG4gICAgICAgICAgICBjWSA9IGV2LnBhZ2VZO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgY29tcGFyaW5nIGN1cnJlbnQgYW5kIHByZXZpb3VzIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciBjb21wYXJlID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICAvLyBjb21wYXJlIG1vdXNlIHBvc2l0aW9ucyB0byBzZWUgaWYgdGhleSd2ZSBjcm9zc2VkIHRoZSB0aHJlc2hvbGRcbiAgICAgICAgICAgIGlmICggTWF0aC5zcXJ0KCAocFgtY1gpKihwWC1jWCkgKyAocFktY1kpKihwWS1jWSkgKSA8IGNmZy5zZW5zaXRpdml0eSApIHtcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGhvdmVySW50ZW50IHN0YXRlIHRvIHRydWUgKHNvIG1vdXNlT3V0IGNhbiBiZSBjYWxsZWQpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNmZy5vdmVyLmFwcGx5KG9iLFtldl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgcHJldmlvdXMgY29vcmRpbmF0ZXMgZm9yIG5leHQgdGltZVxuICAgICAgICAgICAgICAgIHBYID0gY1g7IHBZID0gY1k7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHNlbGYtY2FsbGluZyB0aW1lb3V0LCBndWFyYW50ZWVzIGludGVydmFscyBhcmUgc3BhY2VkIG91dCBwcm9wZXJseSAoYXZvaWRzIEphdmFTY3JpcHQgdGltZXIgYnVncylcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LCBvYik7fSAsIGNmZy5pbnRlcnZhbCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZGVsYXlpbmcgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uXG4gICAgICAgIHZhciBkZWxheSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGNmZy5vdXQuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBtb3VzZSAnaG92ZXJpbmcnXG4gICAgICAgIHZhciBoYW5kbGVIb3ZlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIC8vIGNvcHkgb2JqZWN0cyB0byBiZSBwYXNzZWQgaW50byB0IChyZXF1aXJlZCBmb3IgZXZlbnQgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbiBJRSlcbiAgICAgICAgICAgIHZhciBldiA9ICQuZXh0ZW5kKHt9LGUpO1xuICAgICAgICAgICAgdmFyIG9iID0gdGhpcztcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGhvdmVySW50ZW50IHRpbWVyIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3QpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTsgfVxuXG4gICAgICAgICAgICAvLyBpZiBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIikge1xuICAgICAgICAgICAgICAgIC8vIHNldCBcInByZXZpb3VzXCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBpbml0aWFsIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgICAgcFggPSBldi5wYWdlWDsgcFkgPSBldi5wYWdlWTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgXCJjdXJyZW50XCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBtb3VzZW1vdmVcbiAgICAgICAgICAgICAgICAkKG9iKS5vbihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBwb2xsaW5nIGludGVydmFsIChzZWxmLWNhbGxpbmcgdGltZW91dCkgdG8gY29tcGFyZSBtb3VzZSBjb29yZGluYXRlcyBvdmVyIHRpbWVcbiAgICAgICAgICAgICAgICBpZiAoIW9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldixvYik7fSAsIGNmZy5pbnRlcnZhbCApO31cblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZS50eXBlID09IFwibW91c2VsZWF2ZVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVuYmluZCBleHBlbnNpdmUgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIGlmIGhvdmVySW50ZW50IHN0YXRlIGlzIHRydWUsIHRoZW4gY2FsbCB0aGUgbW91c2VPdXQgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheVxuICAgICAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2RlbGF5KGV2LG9iKTt9ICwgY2ZnLnRpbWVvdXQgKTt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBtb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlXG4gICAgICAgIHJldHVybiB0aGlzLm9uKHsnbW91c2VlbnRlci5ob3ZlckludGVudCc6aGFuZGxlSG92ZXIsJ21vdXNlbGVhdmUuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyfSwgY2ZnLnNlbGVjdG9yKTtcbiAgICB9O1xufSkoalF1ZXJ5KTtcbiIsIi8qIVxuICogaW1hZ2VzTG9hZGVkIFBBQ0tBR0VEIHYzLjEuOFxuICogSmF2YVNjcmlwdCBpcyBhbGwgbGlrZSBcIllvdSBpbWFnZXMgYXJlIGRvbmUgeWV0IG9yIHdoYXQ/XCJcbiAqIE1JVCBMaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31mdW5jdGlvbiB0KGUsdCl7Zm9yKHZhciBuPWUubGVuZ3RoO24tLTspaWYoZVtuXS5saXN0ZW5lcj09PXQpcmV0dXJuIG47cmV0dXJuLTF9ZnVuY3Rpb24gbihlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tlXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXZhciBpPWUucHJvdG90eXBlLHI9dGhpcyxvPXIuRXZlbnRFbWl0dGVyO2kuZ2V0TGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG4saT10aGlzLl9nZXRFdmVudHMoKTtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dD17fTtmb3IobiBpbiBpKWkuaGFzT3duUHJvcGVydHkobikmJmUudGVzdChuKSYmKHRbbl09aVtuXSl9ZWxzZSB0PWlbZV18fChpW2VdPVtdKTtyZXR1cm4gdH0saS5mbGF0dGVuTGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG49W107Zm9yKHQ9MDtlLmxlbmd0aD50O3QrPTEpbi5wdXNoKGVbdF0ubGlzdGVuZXIpO3JldHVybiBufSxpLmdldExpc3RlbmVyc0FzT2JqZWN0PWZ1bmN0aW9uKGUpe3ZhciB0LG49dGhpcy5nZXRMaXN0ZW5lcnMoZSk7cmV0dXJuIG4gaW5zdGFuY2VvZiBBcnJheSYmKHQ9e30sdFtlXT1uKSx0fHxufSxpLmFkZExpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscj10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpLG89XCJvYmplY3RcIj09dHlwZW9mIG47Zm9yKGkgaW4gcilyLmhhc093blByb3BlcnR5KGkpJiYtMT09PXQocltpXSxuKSYmcltpXS5wdXNoKG8/bjp7bGlzdGVuZXI6bixvbmNlOiExfSk7cmV0dXJuIHRoaXN9LGkub249bihcImFkZExpc3RlbmVyXCIpLGkuYWRkT25jZUxpc3RlbmVyPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZSx7bGlzdGVuZXI6dCxvbmNlOiEwfSl9LGkub25jZT1uKFwiYWRkT25jZUxpc3RlbmVyXCIpLGkuZGVmaW5lRXZlbnQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZ2V0TGlzdGVuZXJzKGUpLHRoaXN9LGkuZGVmaW5lRXZlbnRzPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0wO2UubGVuZ3RoPnQ7dCs9MSl0aGlzLmRlZmluZUV2ZW50KGVbdF0pO3JldHVybiB0aGlzfSxpLnJlbW92ZUxpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscixvPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gbylvLmhhc093blByb3BlcnR5KHIpJiYoaT10KG9bcl0sbiksLTEhPT1pJiZvW3JdLnNwbGljZShpLDEpKTtyZXR1cm4gdGhpc30saS5vZmY9bihcInJlbW92ZUxpc3RlbmVyXCIpLGkuYWRkTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMSxlLHQpfSxpLnJlbW92ZUxpc3RlbmVycz1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITAsZSx0KX0saS5tYW5pcHVsYXRlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxyLG89ZT90aGlzLnJlbW92ZUxpc3RlbmVyOnRoaXMuYWRkTGlzdGVuZXIscz1lP3RoaXMucmVtb3ZlTGlzdGVuZXJzOnRoaXMuYWRkTGlzdGVuZXJzO2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0fHx0IGluc3RhbmNlb2YgUmVnRXhwKWZvcihpPW4ubGVuZ3RoO2ktLTspby5jYWxsKHRoaXMsdCxuW2ldKTtlbHNlIGZvcihpIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShpKSYmKHI9dFtpXSkmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiByP28uY2FsbCh0aGlzLGkscik6cy5jYWxsKHRoaXMsaSxyKSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIHQsbj10eXBlb2YgZSxpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwic3RyaW5nXCI9PT1uKWRlbGV0ZSBpW2VdO2Vsc2UgaWYoXCJvYmplY3RcIj09PW4pZm9yKHQgaW4gaSlpLmhhc093blByb3BlcnR5KHQpJiZlLnRlc3QodCkmJmRlbGV0ZSBpW3RdO2Vsc2UgZGVsZXRlIHRoaXMuX2V2ZW50cztyZXR1cm4gdGhpc30saS5yZW1vdmVBbGxMaXN0ZW5lcnM9bihcInJlbW92ZUV2ZW50XCIpLGkuZW1pdEV2ZW50PWZ1bmN0aW9uKGUsdCl7dmFyIG4saSxyLG8scz10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpO2ZvcihyIGluIHMpaWYocy5oYXNPd25Qcm9wZXJ0eShyKSlmb3IoaT1zW3JdLmxlbmd0aDtpLS07KW49c1tyXVtpXSxuLm9uY2U9PT0hMCYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpLG89bi5saXN0ZW5lci5hcHBseSh0aGlzLHR8fFtdKSxvPT09dGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkmJnRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuLmxpc3RlbmVyKTtyZXR1cm4gdGhpc30saS50cmlnZ2VyPW4oXCJlbWl0RXZlbnRcIiksaS5lbWl0PWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTtyZXR1cm4gdGhpcy5lbWl0RXZlbnQoZSx0KX0saS5zZXRPbmNlUmV0dXJuVmFsdWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZT1lLHRoaXN9LGkuX2dldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5KFwiX29uY2VSZXR1cm5WYWx1ZVwiKT90aGlzLl9vbmNlUmV0dXJuVmFsdWU6ITB9LGkuX2dldEV2ZW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ldmVudHN8fCh0aGlzLl9ldmVudHM9e30pfSxlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5FdmVudEVtaXR0ZXI9byxlfSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KTpcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lOnRoaXMuRXZlbnRFbWl0dGVyPWV9KS5jYWxsKHRoaXMpLGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7dmFyIG49ZS5ldmVudDtyZXR1cm4gbi50YXJnZXQ9bi50YXJnZXR8fG4uc3JjRWxlbWVudHx8dCxufXZhciBuPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxpPWZ1bmN0aW9uKCl7fTtuLmFkZEV2ZW50TGlzdGVuZXI/aT1mdW5jdGlvbihlLHQsbil7ZS5hZGRFdmVudExpc3RlbmVyKHQsbiwhMSl9Om4uYXR0YWNoRXZlbnQmJihpPWZ1bmN0aW9uKGUsbixpKXtlW24raV09aS5oYW5kbGVFdmVudD9mdW5jdGlvbigpe3ZhciBuPXQoZSk7aS5oYW5kbGVFdmVudC5jYWxsKGksbil9OmZ1bmN0aW9uKCl7dmFyIG49dChlKTtpLmNhbGwoZSxuKX0sZS5hdHRhY2hFdmVudChcIm9uXCIrbixlW24raV0pfSk7dmFyIHI9ZnVuY3Rpb24oKXt9O24ucmVtb3ZlRXZlbnRMaXN0ZW5lcj9yPWZ1bmN0aW9uKGUsdCxuKXtlLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5kZXRhY2hFdmVudCYmKHI9ZnVuY3Rpb24oZSx0LG4pe2UuZGV0YWNoRXZlbnQoXCJvblwiK3QsZVt0K25dKTt0cnl7ZGVsZXRlIGVbdCtuXX1jYXRjaChpKXtlW3Qrbl09dm9pZCAwfX0pO3ZhciBvPXtiaW5kOmksdW5iaW5kOnJ9O1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudGllL2V2ZW50aWVcIixvKTplLmV2ZW50aWU9b30odGhpcyksZnVuY3Rpb24oZSx0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXJcIixcImV2ZW50aWUvZXZlbnRpZVwiXSxmdW5jdGlvbihuLGkpe3JldHVybiB0KGUsbixpKX0pOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPXQoZSxyZXF1aXJlKFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIikscmVxdWlyZShcImV2ZW50aWVcIikpOmUuaW1hZ2VzTG9hZGVkPXQoZSxlLkV2ZW50RW1pdHRlcixlLmV2ZW50aWUpfSh3aW5kb3csZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGkoZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9ZnVuY3Rpb24gcihlKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1kLmNhbGwoZSl9ZnVuY3Rpb24gbyhlKXt2YXIgdD1bXTtpZihyKGUpKXQ9ZTtlbHNlIGlmKFwibnVtYmVyXCI9PXR5cGVvZiBlLmxlbmd0aClmb3IodmFyIG49MCxpPWUubGVuZ3RoO2k+bjtuKyspdC5wdXNoKGVbbl0pO2Vsc2UgdC5wdXNoKGUpO3JldHVybiB0fWZ1bmN0aW9uIHMoZSx0LG4pe2lmKCEodGhpcyBpbnN0YW5jZW9mIHMpKXJldHVybiBuZXcgcyhlLHQpO1wic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpKSx0aGlzLmVsZW1lbnRzPW8oZSksdGhpcy5vcHRpb25zPWkoe30sdGhpcy5vcHRpb25zKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0P249dDppKHRoaXMub3B0aW9ucyx0KSxuJiZ0aGlzLm9uKFwiYWx3YXlzXCIsbiksdGhpcy5nZXRJbWFnZXMoKSxhJiYodGhpcy5qcURlZmVycmVkPW5ldyBhLkRlZmVycmVkKTt2YXIgcj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyLmNoZWNrKCl9KX1mdW5jdGlvbiBmKGUpe3RoaXMuaW1nPWV9ZnVuY3Rpb24gYyhlKXt0aGlzLnNyYz1lLHZbZV09dGhpc312YXIgYT1lLmpRdWVyeSx1PWUuY29uc29sZSxoPXUhPT12b2lkIDAsZD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO3MucHJvdG90eXBlPW5ldyB0LHMucHJvdG90eXBlLm9wdGlvbnM9e30scy5wcm90b3R5cGUuZ2V0SW1hZ2VzPWZ1bmN0aW9uKCl7dGhpcy5pbWFnZXM9W107Zm9yKHZhciBlPTAsdD10aGlzLmVsZW1lbnRzLmxlbmd0aDt0PmU7ZSsrKXt2YXIgbj10aGlzLmVsZW1lbnRzW2VdO1wiSU1HXCI9PT1uLm5vZGVOYW1lJiZ0aGlzLmFkZEltYWdlKG4pO3ZhciBpPW4ubm9kZVR5cGU7aWYoaSYmKDE9PT1pfHw5PT09aXx8MTE9PT1pKSlmb3IodmFyIHI9bi5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpLG89MCxzPXIubGVuZ3RoO3M+bztvKyspe3ZhciBmPXJbb107dGhpcy5hZGRJbWFnZShmKX19fSxzLnByb3RvdHlwZS5hZGRJbWFnZT1mdW5jdGlvbihlKXt2YXIgdD1uZXcgZihlKTt0aGlzLmltYWdlcy5wdXNoKHQpfSxzLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSxyKXtyZXR1cm4gdC5vcHRpb25zLmRlYnVnJiZoJiZ1LmxvZyhcImNvbmZpcm1cIixlLHIpLHQucHJvZ3Jlc3MoZSksbisrLG49PT1pJiZ0LmNvbXBsZXRlKCksITB9dmFyIHQ9dGhpcyxuPTAsaT10aGlzLmltYWdlcy5sZW5ndGg7aWYodGhpcy5oYXNBbnlCcm9rZW49ITEsIWkpcmV0dXJuIHRoaXMuY29tcGxldGUoKSx2b2lkIDA7Zm9yKHZhciByPTA7aT5yO3IrKyl7dmFyIG89dGhpcy5pbWFnZXNbcl07by5vbihcImNvbmZpcm1cIixlKSxvLmNoZWNrKCl9fSxzLnByb3RvdHlwZS5wcm9ncmVzcz1mdW5jdGlvbihlKXt0aGlzLmhhc0FueUJyb2tlbj10aGlzLmhhc0FueUJyb2tlbnx8IWUuaXNMb2FkZWQ7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5lbWl0KFwicHJvZ3Jlc3NcIix0LGUpLHQuanFEZWZlcnJlZCYmdC5qcURlZmVycmVkLm5vdGlmeSYmdC5qcURlZmVycmVkLm5vdGlmeSh0LGUpfSl9LHMucHJvdG90eXBlLmNvbXBsZXRlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5oYXNBbnlCcm9rZW4/XCJmYWlsXCI6XCJkb25lXCI7dGhpcy5pc0NvbXBsZXRlPSEwO3ZhciB0PXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe2lmKHQuZW1pdChlLHQpLHQuZW1pdChcImFsd2F5c1wiLHQpLHQuanFEZWZlcnJlZCl7dmFyIG49dC5oYXNBbnlCcm9rZW4/XCJyZWplY3RcIjpcInJlc29sdmVcIjt0LmpxRGVmZXJyZWRbbl0odCl9fSl9LGEmJihhLmZuLmltYWdlc0xvYWRlZD1mdW5jdGlvbihlLHQpe3ZhciBuPW5ldyBzKHRoaXMsZSx0KTtyZXR1cm4gbi5qcURlZmVycmVkLnByb21pc2UoYSh0aGlzKSl9KSxmLnByb3RvdHlwZT1uZXcgdCxmLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe3ZhciBlPXZbdGhpcy5pbWcuc3JjXXx8bmV3IGModGhpcy5pbWcuc3JjKTtpZihlLmlzQ29uZmlybWVkKXJldHVybiB0aGlzLmNvbmZpcm0oZS5pc0xvYWRlZCxcImNhY2hlZCB3YXMgY29uZmlybWVkXCIpLHZvaWQgMDtpZih0aGlzLmltZy5jb21wbGV0ZSYmdm9pZCAwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoKXJldHVybiB0aGlzLmNvbmZpcm0oMCE9PXRoaXMuaW1nLm5hdHVyYWxXaWR0aCxcIm5hdHVyYWxXaWR0aFwiKSx2b2lkIDA7dmFyIHQ9dGhpcztlLm9uKFwiY29uZmlybVwiLGZ1bmN0aW9uKGUsbil7cmV0dXJuIHQuY29uZmlybShlLmlzTG9hZGVkLG4pLCEwfSksZS5jaGVjaygpfSxmLnByb3RvdHlwZS5jb25maXJtPWZ1bmN0aW9uKGUsdCl7dGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfTt2YXIgdj17fTtyZXR1cm4gYy5wcm90b3R5cGU9bmV3IHQsYy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtpZighdGhpcy5pc0NoZWNrZWQpe3ZhciBlPW5ldyBJbWFnZTtuLmJpbmQoZSxcImxvYWRcIix0aGlzKSxuLmJpbmQoZSxcImVycm9yXCIsdGhpcyksZS5zcmM9dGhpcy5zcmMsdGhpcy5pc0NoZWNrZWQ9ITB9fSxjLnByb3RvdHlwZS5oYW5kbGVFdmVudD1mdW5jdGlvbihlKXt2YXIgdD1cIm9uXCIrZS50eXBlO3RoaXNbdF0mJnRoaXNbdF0oZSl9LGMucHJvdG90eXBlLm9ubG9hZD1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITAsXCJvbmxvYWRcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUub25lcnJvcj1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITEsXCJvbmVycm9yXCIpLHRoaXMudW5iaW5kUHJveHlFdmVudHMoZSl9LGMucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzQ29uZmlybWVkPSEwLHRoaXMuaXNMb2FkZWQ9ZSx0aGlzLmVtaXQoXCJjb25maXJtXCIsdGhpcyx0KX0sYy5wcm90b3R5cGUudW5iaW5kUHJveHlFdmVudHM9ZnVuY3Rpb24oZSl7bi51bmJpbmQoZS50YXJnZXQsXCJsb2FkXCIsdGhpcyksbi51bmJpbmQoZS50YXJnZXQsXCJlcnJvclwiLHRoaXMpfSxzfSk7IiwiLyoqXHJcbioganF1ZXJ5Lm1hdGNoSGVpZ2h0LmpzIG1hc3RlclxyXG4qIGh0dHA6Ly9icm0uaW8vanF1ZXJ5LW1hdGNoLWhlaWdodC9cclxuKiBMaWNlbnNlOiBNSVRcclxuKi9cclxuXHJcbjsoZnVuY3Rpb24oJCkge1xyXG4gICAgLypcclxuICAgICogIGludGVybmFsXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcHJldmlvdXNSZXNpemVXaWR0aCA9IC0xLFxyXG4gICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XHJcblxyXG4gICAgLypcclxuICAgICogIF9wYXJzZVxyXG4gICAgKiAgdmFsdWUgcGFyc2UgdXRpbGl0eSBmdW5jdGlvblxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3BhcnNlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAvLyBwYXJzZSB2YWx1ZSBhbmQgY29udmVydCBOYU4gdG8gMFxyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3Jvd3NcclxuICAgICogIHV0aWxpdHkgZnVuY3Rpb24gcmV0dXJucyBhcnJheSBvZiBqUXVlcnkgc2VsZWN0aW9ucyByZXByZXNlbnRpbmcgZWFjaCByb3dcclxuICAgICogIChhcyBkaXNwbGF5ZWQgYWZ0ZXIgZmxvYXQgd3JhcHBpbmcgYXBwbGllZCBieSBicm93c2VyKVxyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3Jvd3MgPSBmdW5jdGlvbihlbGVtZW50cykge1xyXG4gICAgICAgIHZhciB0b2xlcmFuY2UgPSAxLFxyXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcclxuICAgICAgICAgICAgbGFzdFRvcCA9IG51bGwsXHJcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gZ3JvdXAgZWxlbWVudHMgYnkgdGhlaXIgdG9wIHBvc2l0aW9uXHJcbiAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRvcCA9ICR0aGF0Lm9mZnNldCgpLnRvcCAtIF9wYXJzZSgkdGhhdC5jc3MoJ21hcmdpbi10b3AnKSksXHJcbiAgICAgICAgICAgICAgICBsYXN0Um93ID0gcm93cy5sZW5ndGggPiAwID8gcm93c1tyb3dzLmxlbmd0aCAtIDFdIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXN0Um93ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBpdGVtIG9uIHRoZSByb3csIHNvIGp1c3QgcHVzaCBpdFxyXG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb3cgdG9wIGlzIHRoZSBzYW1lLCBhZGQgdG8gdGhlIHJvdyBncm91cFxyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5hYnMobGFzdFRvcCAtIHRvcCkpIDw9IHRvbGVyYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXSA9IGxhc3RSb3cuYWRkKCR0aGF0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0YXJ0IGEgbmV3IHJvdyBncm91cFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGxhc3Qgcm93IHRvcFxyXG4gICAgICAgICAgICBsYXN0VG9wID0gdG9wO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm93cztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIF9wYXJzZU9wdGlvbnNcclxuICAgICogIGhhbmRsZSBwbHVnaW4gb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3BhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgYnlSb3c6IHRydWUsXHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcclxuICAgICAgICAgICAgdGFyZ2V0OiBudWxsLFxyXG4gICAgICAgICAgICByZW1vdmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQob3B0cywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBvcHRzLmJ5Um93ID0gb3B0aW9ucztcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgICAgICAgIG9wdHMucmVtb3ZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvcHRzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHRcclxuICAgICogIHBsdWdpbiBkZWZpbml0aW9uXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBtYXRjaEhlaWdodCA9ICQuZm4ubWF0Y2hIZWlnaHQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgcmVtb3ZlXHJcbiAgICAgICAgaWYgKG9wdHMucmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmaXhlZCBoZWlnaHQgZnJvbSBhbGwgc2VsZWN0ZWQgZWxlbWVudHNcclxuICAgICAgICAgICAgdGhpcy5jc3Mob3B0cy5wcm9wZXJ0eSwgJycpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGVkIGVsZW1lbnRzIGZyb20gYWxsIGdyb3Vwc1xyXG4gICAgICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oa2V5LCBncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZWxlbWVudHMgPSBncm91cC5lbGVtZW50cy5ub3QodGhhdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW51cCBlbXB0eSBncm91cHNcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoIDw9IDEgJiYgIW9wdHMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGlzIGdyb3VwIHNvIHdlIGNhbiByZS1hcHBseSBsYXRlciBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2dyb3Vwcy5wdXNoKHtcclxuICAgICAgICAgICAgZWxlbWVudHM6IHRoaXMsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdHNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbWF0Y2ggZWFjaCBlbGVtZW50J3MgaGVpZ2h0IHRvIHRoZSB0YWxsZXN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvblxyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLCBvcHRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBwbHVnaW4gZ2xvYmFsIG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX2dyb3VwcyA9IFtdO1xyXG4gICAgbWF0Y2hIZWlnaHQuX3Rocm90dGxlID0gODA7XHJcbiAgICBtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSBmYWxzZTtcclxuICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUgPSBudWxsO1xyXG4gICAgbWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5XHJcbiAgICAqICBhcHBseSBtYXRjaEhlaWdodCB0byBnaXZlbiBlbGVtZW50c1xyXG4gICAgKi9cclxuXHJcbiAgICBtYXRjaEhlaWdodC5fYXBwbHkgPSBmdW5jdGlvbihlbGVtZW50cywgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKSxcclxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXHJcbiAgICAgICAgICAgIHJvd3MgPSBbJGVsZW1lbnRzXTtcclxuXHJcbiAgICAgICAgLy8gdGFrZSBub3RlIG9mIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcbiAgICAgICAgICAgIGh0bWxIZWlnaHQgPSAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIGdldCBoaWRkZW4gcGFyZW50c1xyXG4gICAgICAgIHZhciAkaGlkZGVuUGFyZW50cyA9ICRlbGVtZW50cy5wYXJlbnRzKCkuZmlsdGVyKCc6aGlkZGVuJyk7XHJcblxyXG4gICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB0ZW1wb3JhcmlseSBtdXN0IGZvcmNlIGhpZGRlbiBwYXJlbnRzIHZpc2libGVcclxuICAgICAgICAkaGlkZGVuUGFyZW50cy5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHJvd3MgaWYgdXNpbmcgYnlSb3csIG90aGVyd2lzZSBhc3N1bWUgb25lIHJvd1xyXG4gICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICFvcHRzLnRhcmdldCkge1xyXG5cclxuICAgICAgICAgICAgLy8gbXVzdCBmaXJzdCBmb3JjZSBhbiBhcmJpdHJhcnkgZXF1YWwgaGVpZ2h0IHNvIGZsb2F0aW5nIGVsZW1lbnRzIGJyZWFrIGV2ZW5seVxyXG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGZvcmNlIGEgdXNhYmxlIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5ICE9PSAnaW5saW5lLWJsb2NrJyAmJiBkaXNwbGF5ICE9PSAnaW5saW5lLWZsZXgnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxyXG4gICAgICAgICAgICAgICAgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnLCAkdGhhdC5hdHRyKCdzdHlsZScpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogZGlzcGxheSxcclxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy10b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXJnaW4tdG9wJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXJnaW4tYm90dG9tJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICdib3JkZXItdG9wLXdpZHRoJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICdib3JkZXItYm90dG9tLXdpZHRoJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwcHgnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFycmF5IG9mIHJvd3MgKGJhc2VkIG9uIGVsZW1lbnQgdG9wIHBvc2l0aW9uKVxyXG4gICAgICAgICAgICByb3dzID0gX3Jvd3MoJGVsZW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJldmVydCBvcmlnaW5hbCBpbmxpbmUgc3R5bGVzXHJcbiAgICAgICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCAnJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5lYWNoKHJvd3MsIGZ1bmN0aW9uKGtleSwgcm93KSB7XHJcbiAgICAgICAgICAgIHZhciAkcm93ID0gJChyb3cpLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmICghb3B0cy50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNraXAgYXBwbHkgdG8gcm93cyB3aXRoIG9ubHkgb25lIGl0ZW1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICRyb3cubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcm93LmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhlIHJvdyBhbmQgZmluZCB0aGUgbWF4IGhlaWdodFxyXG4gICAgICAgICAgICAgICAgJHJvdy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcmlseSBmb3JjZSBhIHVzYWJsZSBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgd2UgZ2V0IHRoZSBjb3JyZWN0IGFjdHVhbCBoZWlnaHQgKGFuZCBub3QgYSBwcmV2aW91c2x5IHNldCBoZWlnaHQgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNzcyA9IHsgJ2Rpc3BsYXknOiBkaXNwbGF5IH07XHJcbiAgICAgICAgICAgICAgICAgICAgY3NzW29wdHMucHJvcGVydHldID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKGNzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIG1heCBoZWlnaHQgKGluY2x1ZGluZyBwYWRkaW5nLCBidXQgbm90IG1hcmdpbilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpID4gdGFyZ2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9ICR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVydCBkaXNwbGF5IGJsb2NrXHJcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKCdkaXNwbGF5JywgJycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgc2V0LCB1c2UgdGhlIGhlaWdodCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IG9wdHMudGFyZ2V0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBhcHBseSB0aGUgaGVpZ2h0IHRvIGFsbCBlbGVtZW50c1xyXG4gICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhcHBseSB0byBhIHRhcmdldFxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudGFyZ2V0ICYmICR0aGF0LmlzKG9wdHMudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgcGFkZGluZyBhbmQgYm9yZGVyIGNvcnJlY3RseSAocmVxdWlyZWQgd2hlbiBub3QgdXNpbmcgYm9yZGVyLWJveClcclxuICAgICAgICAgICAgICAgIGlmICgkdGhhdC5jc3MoJ2JveC1zaXppbmcnKSAhPT0gJ2JvcmRlci1ib3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci10b3Atd2lkdGgnKSkgKyBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItYm90dG9tLXdpZHRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLXRvcCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgaGVpZ2h0IChhY2NvdW50aW5nIGZvciBwYWRkaW5nIGFuZCBib3JkZXIpXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Mob3B0cy5wcm9wZXJ0eSwgKHRhcmdldEhlaWdodCAtIHZlcnRpY2FsUGFkZGluZykgKyAncHgnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHJldmVydCBoaWRkZW4gcGFyZW50c1xyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmVzdG9yZSBzY3JvbGwgcG9zaXRpb24gaWYgZW5hYmxlZFxyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgoc2Nyb2xsVG9wIC8gaHRtbEhlaWdodCkgKiAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpXHJcbiAgICAqICBhcHBsaWVzIG1hdGNoSGVpZ2h0IHRvIGFsbCBlbGVtZW50cyB3aXRoIGEgZGF0YS1tYXRjaC1oZWlnaHQgYXR0cmlidXRlXHJcbiAgICAqL1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZ3JvdXBzID0ge307XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGdyb3VwcyBieSB0aGVpciBncm91cElkIHNldCBieSBlbGVtZW50cyB1c2luZyBkYXRhLW1hdGNoLWhlaWdodFxyXG4gICAgICAgICQoJ1tkYXRhLW1hdGNoLWhlaWdodF0sIFtkYXRhLW1oXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBncm91cElkID0gJHRoaXMuYXR0cignZGF0YS1taCcpIHx8ICR0aGlzLmF0dHIoJ2RhdGEtbWF0Y2gtaGVpZ2h0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCBpbiBncm91cHMpIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9IGdyb3Vwc1tncm91cElkXS5hZGQoJHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gJHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZWFjaCBncm91cFxyXG4gICAgICAgICQuZWFjaChncm91cHMsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1hdGNoSGVpZ2h0KHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgbWF0Y2hIZWlnaHQuX3VwZGF0ZVxyXG4gICAgKiAgdXBkYXRlcyBtYXRjaEhlaWdodCBvbiBhbGwgY3VycmVudCBncm91cHMgd2l0aCB0aGVpciBjb3JyZWN0IG9wdGlvbnNcclxuICAgICovXHJcblxyXG4gICAgdmFyIF91cGRhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcy5lbGVtZW50cywgdGhpcy5vcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSkge1xyXG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSA9IGZ1bmN0aW9uKHRocm90dGxlLCBldmVudCkge1xyXG4gICAgICAgIC8vIHByZXZlbnQgdXBkYXRlIGlmIGZpcmVkIGZyb20gYSByZXNpemUgZXZlbnRcclxuICAgICAgICAvLyB3aGVyZSB0aGUgdmlld3BvcnQgd2lkdGggaGFzbid0IGFjdHVhbGx5IGNoYW5nZWRcclxuICAgICAgICAvLyBmaXhlcyBhbiBldmVudCBsb29waW5nIGJ1ZyBpbiBJRThcclxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ3Jlc2l6ZScpIHtcclxuICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3dXaWR0aCA9PT0gX3ByZXZpb3VzUmVzaXplV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfcHJldmlvdXNSZXNpemVXaWR0aCA9IHdpbmRvd1dpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhyb3R0bGUgdXBkYXRlc1xyXG4gICAgICAgIGlmICghdGhyb3R0bGUpIHtcclxuICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfdXBkYXRlVGltZW91dCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xyXG4gICAgICAgICAgICB9LCBtYXRjaEhlaWdodC5fdGhyb3R0bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIGJpbmQgZXZlbnRzXHJcbiAgICAqL1xyXG5cclxuICAgIC8vIGFwcGx5IG9uIERPTSByZWFkeSBldmVudFxyXG4gICAgJChtYXRjaEhlaWdodC5fYXBwbHlEYXRhQXBpKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgaGVpZ2h0cyBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAkKHdpbmRvdykuYmluZCgnbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZShmYWxzZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdGhyb3R0bGVkIHVwZGF0ZSBoZWlnaHRzIG9uIHJlc2l6ZSBldmVudHNcclxuICAgICQod2luZG93KS5iaW5kKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUodHJ1ZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcblxyXG59KShqUXVlcnkpO1xyXG4iLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuSlMgUExVR0lOU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnOyAvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xyXG5cclxuXHJcbi8vIEdldCBDdXJyZW50IEJyZWFrcG9pbnQgKEdsb2JhbClcclxudmFyIGJyZWFrcG9pbnQgPSB7fTtcclxuYnJlYWtwb2ludC5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5uYW1lID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cXFwiL2csICcnKTtcclxufTtcclxualF1ZXJ5KHdpbmRvdykucmVzaXplKCBmdW5jdGlvbigpIHtcclxuXHRicmVha3BvaW50LnJlZnJlc2goKTtcclxufSkucmVzaXplKCk7XHJcblxyXG5cclxuLy8gUmVzaXplIElmcmFtZXMgUHJvcG9ydGlvbmFsbHlcclxuZnVuY3Rpb24gaWZyYW1lQXNwZWN0KHNlbGVjdG9yKSB7XHJcblx0c2VsZWN0b3IgPSBzZWxlY3RvciB8fCBqUXVlcnkoJ2lmcmFtZScpO1xyXG5cclxuXHRzZWxlY3Rvci5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuXHRcdHZhciBpZnJhbWUgPSBqUXVlcnkodGhpcyksXHJcblx0XHRcdHdpZHRoICA9IGlmcmFtZS53aWR0aCgpO1xyXG5cdFx0aWYgKCB0eXBlb2YoaWZyYW1lLmRhdGEoJ3JhdGlvJykpID09ICd1bmRlZmluZWQnICkge1xyXG5cdFx0XHR2YXIgYXR0clcgPSB0aGlzLndpZHRoLFxyXG5cdFx0XHRcdGF0dHJIID0gdGhpcy5oZWlnaHQ7XHJcblx0XHRcdGlmcmFtZS5kYXRhKCdyYXRpbycsIGF0dHJIIC8gYXR0clcgKS5yZW1vdmVBdHRyKCd3aWR0aCcpLnJlbW92ZUF0dHIoJ2hlaWdodCcpO1xyXG5cdFx0fVxyXG5cdFx0aWZyYW1lLmhlaWdodCggd2lkdGggKiBpZnJhbWUuZGF0YSgncmF0aW8nKSApO1xyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuLy8gTGlnaHRlbiAvIERhcmtlbiBDb2xvciAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcclxuZnVuY3Rpb24gc2hhZGVDb2xvcihjb2xvciwgcGVyY2VudCkgeyAgIFxyXG5cdHZhciBmPXBhcnNlSW50KGNvbG9yLnNsaWNlKDEpLDE2KSx0PXBlcmNlbnQ8MD8wOjI1NSxwPXBlcmNlbnQ8MD9wZXJjZW50Ki0xOnBlcmNlbnQsUj1mPj4xNixHPWY+PjgmMHgwMEZGLEI9ZiYweDAwMDBGRjtcclxuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKHQtUikqcCkrUikqMHgxMDAwMCsoTWF0aC5yb3VuZCgodC1HKSpwKStHKSoweDEwMCsoTWF0aC5yb3VuZCgodC1CKSpwKStCKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5cclxuLy8gQmxlbmQgQ29sb3JzIC0gQ3JlZGl0IFwiUGltcCBUcml6a2l0XCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNjkzOTI3L3BpbXAtdHJpemtpdFxyXG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcclxuXHR2YXIgZj1wYXJzZUludChjMC5zbGljZSgxKSwxNiksdD1wYXJzZUludChjMS5zbGljZSgxKSwxNiksUjE9Zj4+MTYsRzE9Zj4+OCYweDAwRkYsQjE9ZiYweDAwMDBGRixSMj10Pj4xNixHMj10Pj44JjB4MDBGRixCMj10JjB4MDAwMEZGO1xyXG5cdHJldHVybiAnIycrKDB4MTAwMDAwMCsoTWF0aC5yb3VuZCgoUjItUjEpKnApK1IxKSoweDEwMDAwKyhNYXRoLnJvdW5kKChHMi1HMSkqcCkrRzEpKjB4MTAwKyhNYXRoLnJvdW5kKChCMi1CMSkqcCkrQjEpKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcblxyXG4vLyBDb252ZXJ0IGNvbG9yIHRvIFJHQmFcclxuZnVuY3Rpb24gY29sb3JUb1JnYmEoY29sb3IsIG9wYWNpdHkpIHtcclxuXHRpZiAoIGNvbG9yLnN1YnN0cmluZygwLDQpID09ICdyZ2JhJyApIHtcclxuXHRcdHZhciBhbHBoYSA9IGNvbG9yLm1hdGNoKC8oW15cXCxdKilcXCkkLyk7XHJcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZShhbHBoYVsxXSwgb3BhY2l0eSk7XHJcblx0fSBlbHNlIGlmICggY29sb3Iuc3Vic3RyaW5nKDAsMykgPT0gJ3JnYicgKSB7XHJcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCAnLCAnK29wYWNpdHkrJyknKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0aGV4ID0gY29sb3IucmVwbGFjZSgnIycsJycpO1xyXG5cdFx0dmFyIHIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsMiksIDE2KSxcclxuXHRcdFx0ZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpLFxyXG5cdFx0XHRiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNik7XHJcblx0XHRyZXN1bHQgPSAncmdiYSgnK3IrJywnK2crJywnK2IrJywnK29wYWNpdHkrJyknO1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vLyBDb2xvciBMaWdodCBPciBEYXJrIC0gQ3JlZGl0IFwiTGFycnkgRm94XCIgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9sYXJyeWZveC8xNjM2MzM4XHJcbmZ1bmN0aW9uIGNvbG9yTG9EKGNvbG9yKSB7XHJcblx0dmFyIHIsYixnLGhzcCxhID0gY29sb3I7XHJcblx0aWYgKGEubWF0Y2goL15yZ2IvKSkge1xyXG5cdFx0YSA9IGEubWF0Y2goL15yZ2JhP1xcKChcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKykoPzosXFxzKihcXGQrKD86XFwuXFxkKyk/KSk/XFwpJC8pO1xyXG5cdFx0ciA9IGFbMV07XHJcblx0XHRiID0gYVsyXTtcclxuXHRcdGcgPSBhWzNdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gKygnMHgnICsgYS5zbGljZSgxKS5yZXBsYWNlKGEubGVuZ3RoIDwgNSAmJiAvLi9nLCAnJCYkJicpKTtcclxuXHRcdHIgPSBhID4+IDE2O1xyXG5cdFx0YiA9IGEgPj4gOCAmIDI1NTtcclxuXHRcdGcgPSBhICYgMjU1O1xyXG5cdH1cclxuXHRoc3AgPSBNYXRoLnNxcnQoIDAuMjk5ICogKHIgKiByKSArIDAuNTg3ICogKGcgKiBnKSArIDAuMTE0ICogKGIgKiBiKSApO1xyXG5cdHJldHVybiAoIGhzcCA+IDEyNy41ICkgPyAnbGlnaHQnIDogJ2RhcmsnO1xyXG59IFxyXG5cclxuXHJcbi8vIEltYWdlIExpZ2h0IE9yIERhcmsgSW1hZ2UgLSBDcmVkaXQgXCJKb3NlcGggUG9ydGVsbGlcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy8xNDk2MzYvam9zZXBoLXBvcnRlbGxpXHJcbmZ1bmN0aW9uIGltYWdlTG9EKGltYWdlU3JjLCBjYWxsYmFjaykge1xyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHRpbWcuc3JjID0gaW1hZ2VTcmM7XHJcblx0aW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWcpO1xyXG5cclxuXHR2YXIgY29sb3JTdW0gPSAwO1xyXG5cclxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGUgY2FudmFzXHJcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblx0XHRjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG5cclxuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcywwLDApO1xyXG5cclxuXHRcdHZhciBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XHJcblx0XHR2YXIgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xyXG5cdFx0dmFyIHIsZyxiLGF2ZztcclxuXHJcblx0XHRmb3IodmFyIHggPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgeCA8IGxlbjsgeCs9NCkge1xyXG5cdFx0XHRyID0gZGF0YVt4XTtcclxuXHRcdFx0ZyA9IGRhdGFbeCsxXTtcclxuXHRcdFx0YiA9IGRhdGFbeCsyXTtcclxuXHJcblx0XHRcdGF2ZyA9IE1hdGguZmxvb3IoKHIrZytiKS8zKTtcclxuXHRcdFx0Y29sb3JTdW0gKz0gYXZnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBicmlnaHRuZXNzID0gTWF0aC5mbG9vcihjb2xvclN1bSAvICh0aGlzLndpZHRoKnRoaXMuaGVpZ2h0KSk7XHJcblx0XHRjYWxsYmFjayhicmlnaHRuZXNzKTtcclxuXHR9O1xyXG59XHJcblxyXG5cclxuLy8gUmVzaXplIEltYWdlIFRvIEZpbGwgQ29udGFpbmVyIFNpemVcclxuZnVuY3Rpb24gaW1hZ2VDb3Zlcihjb250LCB0eXBlLCBjb3JySCkge1xyXG5cdHR5cGUgPSB0eXBlIHx8ICdiZyc7XHJcblxyXG5cdGNvbnQuYWRkQ2xhc3MoJ2ltYWdlLWNvdmVyJyk7XHJcblxyXG5cdHZhciBpbWcsIGltZ1VybCwgaW1nV2lkdGggPSAwLCBpbWdIZWlnaHQgPSAwO1xyXG5cclxuXHRpZiAoIHR5cGUgPT0gJ2ltZycgKSB7XHJcblx0XHRpbWcgPSBjb250LmZpbmQoJy5iZy1pbWcnKTtcclxuXHRcdGltZ1dpZHRoICA9IGltZy53aWR0aCgpO1xyXG5cdFx0aW1nSGVpZ2h0ID0gaW1nLmhlaWdodCgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpbWdVcmwgPSBjb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLm1hdGNoKC9edXJsXFwoXCI/KC4rPylcIj9cXCkkLyk7XHJcblx0XHRpZiAoIGltZ1VybFsxXSApIHtcclxuXHRcdCAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdCAgICBpbWcuc3JjID0gaW1nVXJsWzFdO1xyXG5cdFx0ICAgIGltZ1dpZHRoICA9IGltZy53aWR0aDtcclxuXHRcdCAgICBpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCBpbWdXaWR0aCAhPT0gMCAmJiBpbWdIZWlnaHQgIT09IDAgKSB7XHJcblx0XHR2YXIgY29udFdpZHRoICA9IGNvbnQub3V0ZXJXaWR0aCgpLFxyXG5cdFx0XHRjb250SGVpZ2h0ID0gY29udC5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRoZWlnaHREaWZmID0gY29udFdpZHRoIC8gaW1nV2lkdGggKiBpbWdIZWlnaHQsXHJcblx0XHRcdG5ld1dpZHRoICAgPSAnYXV0bycsXHJcblx0XHRcdG5ld0hlaWdodCAgPSBjb250SGVpZ2h0ICsgY29yckggKyAncHgnO1xyXG5cclxuXHRcdFx0aWYgKCBoZWlnaHREaWZmID4gY29udEhlaWdodCApIHtcclxuXHRcdFx0XHRuZXdXaWR0aCAgPSAnMTAwJSc7XHJcblx0XHRcdFx0bmV3SGVpZ2h0ID0gJ2F1dG8nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICkge1xyXG5cdFx0XHRpbWcuY3NzKHsgd2lkdGg6IG5ld1dpZHRoLCBoZWlnaHQ6IG5ld0hlaWdodCB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnQuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBuZXdXaWR0aCArICcgJyArIG5ld0hlaWdodCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuLy8gRGV0ZXJtaW5lIElmIEFuIEVsZW1lbnQgSXMgU2Nyb2xsZWQgSW50byBWaWV3XHJcbmZ1bmN0aW9uIGVsZW1WaXNpYmxlKGVsZW0sIGNvbnQpIHtcclxuXHR2YXIgY29udFRvcCA9IGNvbnQuc2Nyb2xsVG9wKCksXHJcblx0XHRjb250QnRtID0gY29udFRvcCArIGNvbnQuaGVpZ2h0KCksXHJcblx0XHRlbGVtVG9wID0gZWxlbS5vZmZzZXQoKS50b3AsXHJcblx0XHRlbGVtQnRtID0gZWxlbVRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG5cdHJldHVybiAoKGVsZW1CdG0gPD0gY29udEJ0bSkgJiYgKGVsZW1Ub3AgPj0gY29udFRvcCkpO1xyXG59XHJcblxyXG5cclxuLy8gRml4IFdQTUwgRHJvcGRvd25cclxualF1ZXJ5KCcubWVudS1pdGVtLWxhbmd1YWdlJykuYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpLmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XHJcblxyXG4vLyBGaXggUG9seUxhbmcgTWVudSBJdGVtcyBBbmQgTWFrZSBUaGVtIERyb3Bkb3duXHJcbmpRdWVyeSgnLm1lbnUtaXRlbS5sYW5nLWl0ZW0nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbmpRdWVyeSggZnVuY3Rpb24oKSB7XHJcblx0dmFyIGl0ZW0gPSBqUXVlcnkoJy5sYW5nLWl0ZW0uY3VycmVudC1sYW5nJyk7XHJcblx0aWYgKGl0ZW0ubGVuZ3RoID09PSAwKSB7XHJcblx0XHRpdGVtID0galF1ZXJ5KCcubGFuZy1pdGVtJykuZmlyc3QoKTtcclxuXHR9XHJcblx0dmFyIGxhbmdzID0gaXRlbS5zaWJsaW5ncygnLmxhbmctaXRlbScpO1xyXG5cdGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpO1xyXG5cdGxhbmdzLndyYXBBbGwoJzx1bCBjbGFzcz1cInN1Yi1tZW51IGRyb3Bkb3duLW1lbnVcIj48L3VsPicpLnBhcmVudCgpLmFwcGVuZFRvKGl0ZW0pO1xyXG59KTsiLCIvKiBNb2Rlcm5penIgMi44LjMgKEN1c3RvbSBCdWlsZCkgfCBNSVQgJiBCU0RcbiAqIEJ1aWxkOiBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZC8jLWZsZXhib3gtcmdiYS1oaXN0b3J5LWF1ZGlvLXZpZGVvLXN2Z2NsaXBwYXRocy1zaGl2LWNzc2NsYXNzZXNcbiAqL1xuO3dpbmRvdy5Nb2Rlcm5penI9ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIHkoYSl7ai5jc3NUZXh0PWF9ZnVuY3Rpb24geihhLGIpe3JldHVybiB5KHByZWZpeGVzLmpvaW4oYStcIjtcIikrKGJ8fFwiXCIpKX1mdW5jdGlvbiBBKGEsYil7cmV0dXJuIHR5cGVvZiBhPT09Yn1mdW5jdGlvbiBCKGEsYil7cmV0dXJuISF+KFwiXCIrYSkuaW5kZXhPZihiKX1mdW5jdGlvbiBDKGEsYil7Zm9yKHZhciBkIGluIGEpe3ZhciBlPWFbZF07aWYoIUIoZSxcIi1cIikmJmpbZV0hPT1jKXJldHVybiBiPT1cInBmeFwiP2U6ITB9cmV0dXJuITF9ZnVuY3Rpb24gRChhLGIsZCl7Zm9yKHZhciBlIGluIGEpe3ZhciBmPWJbYVtlXV07aWYoZiE9PWMpcmV0dXJuIGQ9PT0hMT9hW2VdOkEoZixcImZ1bmN0aW9uXCIpP2YuYmluZChkfHxiKTpmfXJldHVybiExfWZ1bmN0aW9uIEUoYSxiLGMpe3ZhciBkPWEuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYS5zbGljZSgxKSxlPShhK1wiIFwiK24uam9pbihkK1wiIFwiKStkKS5zcGxpdChcIiBcIik7cmV0dXJuIEEoYixcInN0cmluZ1wiKXx8QShiLFwidW5kZWZpbmVkXCIpP0MoZSxiKTooZT0oYStcIiBcIitvLmpvaW4oZCtcIiBcIikrZCkuc3BsaXQoXCIgXCIpLEQoZSxiLGMpKX12YXIgZD1cIjIuOC4zXCIsZT17fSxmPSEwLGc9Yi5kb2N1bWVudEVsZW1lbnQsaD1cIm1vZGVybml6clwiLGk9Yi5jcmVhdGVFbGVtZW50KGgpLGo9aS5zdHlsZSxrLGw9e30udG9TdHJpbmcsbT1cIldlYmtpdCBNb3ogTyBtc1wiLG49bS5zcGxpdChcIiBcIiksbz1tLnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpLHA9e3N2ZzpcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJ9LHE9e30scj17fSxzPXt9LHQ9W10sdT10LnNsaWNlLHYsdz17fS5oYXNPd25Qcm9wZXJ0eSx4OyFBKHcsXCJ1bmRlZmluZWRcIikmJiFBKHcuY2FsbCxcInVuZGVmaW5lZFwiKT94PWZ1bmN0aW9uKGEsYil7cmV0dXJuIHcuY2FsbChhLGIpfTp4PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGIgaW4gYSYmQShhLmNvbnN0cnVjdG9yLnByb3RvdHlwZVtiXSxcInVuZGVmaW5lZFwiKX0sRnVuY3Rpb24ucHJvdG90eXBlLmJpbmR8fChGdW5jdGlvbi5wcm90b3R5cGUuYmluZD1mdW5jdGlvbihiKXt2YXIgYz10aGlzO2lmKHR5cGVvZiBjIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IFR5cGVFcnJvcjt2YXIgZD11LmNhbGwoYXJndW1lbnRzLDEpLGU9ZnVuY3Rpb24oKXtpZih0aGlzIGluc3RhbmNlb2YgZSl7dmFyIGE9ZnVuY3Rpb24oKXt9O2EucHJvdG90eXBlPWMucHJvdG90eXBlO3ZhciBmPW5ldyBhLGc9Yy5hcHBseShmLGQuY29uY2F0KHUuY2FsbChhcmd1bWVudHMpKSk7cmV0dXJuIE9iamVjdChnKT09PWc/ZzpmfXJldHVybiBjLmFwcGx5KGIsZC5jb25jYXQodS5jYWxsKGFyZ3VtZW50cykpKX07cmV0dXJuIGV9KSxxLmZsZXhib3g9ZnVuY3Rpb24oKXtyZXR1cm4gRShcImZsZXhXcmFwXCIpfSxxLmhpc3Rvcnk9ZnVuY3Rpb24oKXtyZXR1cm4hIWEuaGlzdG9yeSYmISFoaXN0b3J5LnB1c2hTdGF0ZX0scS5yZ2JhPWZ1bmN0aW9uKCl7cmV0dXJuIHkoXCJiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTUwLDI1NSwxNTAsLjUpXCIpLEIoai5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfSxxLnZpZGVvPWZ1bmN0aW9uKCl7dmFyIGE9Yi5jcmVhdGVFbGVtZW50KFwidmlkZW9cIiksYz0hMTt0cnl7aWYoYz0hIWEuY2FuUGxheVR5cGUpYz1uZXcgQm9vbGVhbihjKSxjLm9nZz1hLmNhblBsYXlUeXBlKCd2aWRlby9vZ2c7IGNvZGVjcz1cInRoZW9yYVwiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksYy5oMjY0PWEuY2FuUGxheVR5cGUoJ3ZpZGVvL21wNDsgY29kZWNzPVwiYXZjMS40MkUwMUVcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMud2VibT1hLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sXCJcIil9Y2F0Y2goZCl7fXJldHVybiBjfSxxLmF1ZGlvPWZ1bmN0aW9uKCl7dmFyIGE9Yi5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiksYz0hMTt0cnl7aWYoYz0hIWEuY2FuUGxheVR5cGUpYz1uZXcgQm9vbGVhbihjKSxjLm9nZz1hLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksYy5tcDM9YS5jYW5QbGF5VHlwZShcImF1ZGlvL21wZWc7XCIpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMud2F2PWEuY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksYy5tNGE9KGEuY2FuUGxheVR5cGUoXCJhdWRpby94LW00YTtcIil8fGEuY2FuUGxheVR5cGUoXCJhdWRpby9hYWM7XCIpKS5yZXBsYWNlKC9ebm8kLyxcIlwiKX1jYXRjaChkKXt9cmV0dXJuIGN9LHEuc3ZnY2xpcHBhdGhzPWZ1bmN0aW9uKCl7cmV0dXJuISFiLmNyZWF0ZUVsZW1lbnROUyYmL1NWR0NsaXBQYXRoLy50ZXN0KGwuY2FsbChiLmNyZWF0ZUVsZW1lbnROUyhwLnN2ZyxcImNsaXBQYXRoXCIpKSl9O2Zvcih2YXIgRiBpbiBxKXgocSxGKSYmKHY9Ri50b0xvd2VyQ2FzZSgpLGVbdl09cVtGXSgpLHQucHVzaCgoZVt2XT9cIlwiOlwibm8tXCIpK3YpKTtyZXR1cm4gZS5hZGRUZXN0PWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGE9PVwib2JqZWN0XCIpZm9yKHZhciBkIGluIGEpeChhLGQpJiZlLmFkZFRlc3QoZCxhW2RdKTtlbHNle2E9YS50b0xvd2VyQ2FzZSgpO2lmKGVbYV0hPT1jKXJldHVybiBlO2I9dHlwZW9mIGI9PVwiZnVuY3Rpb25cIj9iKCk6Yix0eXBlb2YgZiE9XCJ1bmRlZmluZWRcIiYmZiYmKGcuY2xhc3NOYW1lKz1cIiBcIisoYj9cIlwiOlwibm8tXCIpK2EpLGVbYV09Yn1yZXR1cm4gZX0seShcIlwiKSxpPWs9bnVsbCxmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGwoYSxiKXt2YXIgYz1hLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLGQ9YS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGEuZG9jdW1lbnRFbGVtZW50O3JldHVybiBjLmlubmVySFRNTD1cIng8c3R5bGU+XCIrYitcIjwvc3R5bGU+XCIsZC5pbnNlcnRCZWZvcmUoYy5sYXN0Q2hpbGQsZC5maXJzdENoaWxkKX1mdW5jdGlvbiBtKCl7dmFyIGE9cy5lbGVtZW50cztyZXR1cm4gdHlwZW9mIGE9PVwic3RyaW5nXCI/YS5zcGxpdChcIiBcIik6YX1mdW5jdGlvbiBuKGEpe3ZhciBiPWpbYVtoXV07cmV0dXJuIGJ8fChiPXt9LGkrKyxhW2hdPWksaltpXT1iKSxifWZ1bmN0aW9uIG8oYSxjLGQpe2N8fChjPWIpO2lmKGspcmV0dXJuIGMuY3JlYXRlRWxlbWVudChhKTtkfHwoZD1uKGMpKTt2YXIgZztyZXR1cm4gZC5jYWNoZVthXT9nPWQuY2FjaGVbYV0uY2xvbmVOb2RlKCk6Zi50ZXN0KGEpP2c9KGQuY2FjaGVbYV09ZC5jcmVhdGVFbGVtKGEpKS5jbG9uZU5vZGUoKTpnPWQuY3JlYXRlRWxlbShhKSxnLmNhbkhhdmVDaGlsZHJlbiYmIWUudGVzdChhKSYmIWcudGFnVXJuP2QuZnJhZy5hcHBlbmRDaGlsZChnKTpnfWZ1bmN0aW9uIHAoYSxjKXthfHwoYT1iKTtpZihrKXJldHVybiBhLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtjPWN8fG4oYSk7dmFyIGQ9Yy5mcmFnLmNsb25lTm9kZSgpLGU9MCxmPW0oKSxnPWYubGVuZ3RoO2Zvcig7ZTxnO2UrKylkLmNyZWF0ZUVsZW1lbnQoZltlXSk7cmV0dXJuIGR9ZnVuY3Rpb24gcShhLGIpe2IuY2FjaGV8fChiLmNhY2hlPXt9LGIuY3JlYXRlRWxlbT1hLmNyZWF0ZUVsZW1lbnQsYi5jcmVhdGVGcmFnPWEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCxiLmZyYWc9Yi5jcmVhdGVGcmFnKCkpLGEuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihjKXtyZXR1cm4gcy5zaGl2TWV0aG9kcz9vKGMsYSxiKTpiLmNyZWF0ZUVsZW0oYyl9LGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrbSgpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtXSsvZyxmdW5jdGlvbihhKXtyZXR1cm4gYi5jcmVhdGVFbGVtKGEpLGIuZnJhZy5jcmVhdGVFbGVtZW50KGEpLCdjKFwiJythKydcIiknfSkrXCIpO3JldHVybiBufVwiKShzLGIuZnJhZyl9ZnVuY3Rpb24gcihhKXthfHwoYT1iKTt2YXIgYz1uKGEpO3JldHVybiBzLnNoaXZDU1MmJiFnJiYhYy5oYXNDU1MmJihjLmhhc0NTUz0hIWwoYSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGt8fHEoYSxjKSxhfXZhciBjPVwiMy43LjBcIixkPWEuaHRtbDV8fHt9LGU9L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksZj0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksZyxoPVwiX2h0bWw1c2hpdlwiLGk9MCxqPXt9LGs7KGZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImFcIik7YS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLGc9XCJoaWRkZW5cImluIGEsaz1hLmNoaWxkTm9kZXMubGVuZ3RoPT0xfHxmdW5jdGlvbigpe2IuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGE9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuIHR5cGVvZiBhLmNsb25lTm9kZT09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD09XCJ1bmRlZmluZWRcInx8dHlwZW9mIGEuY3JlYXRlRWxlbWVudD09XCJ1bmRlZmluZWRcIn0oKX1jYXRjaChjKXtnPSEwLGs9ITB9fSkoKTt2YXIgcz17ZWxlbWVudHM6ZC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvXCIsdmVyc2lvbjpjLHNoaXZDU1M6ZC5zaGl2Q1NTIT09ITEsc3VwcG9ydHNVbmtub3duRWxlbWVudHM6ayxzaGl2TWV0aG9kczpkLnNoaXZNZXRob2RzIT09ITEsdHlwZTpcImRlZmF1bHRcIixzaGl2RG9jdW1lbnQ6cixjcmVhdGVFbGVtZW50Om8sY3JlYXRlRG9jdW1lbnRGcmFnbWVudDpwfTthLmh0bWw1PXMscihiKX0odGhpcyxiKSxlLl92ZXJzaW9uPWQsZS5fZG9tUHJlZml4ZXM9byxlLl9jc3NvbVByZWZpeGVzPW4sZS50ZXN0UHJvcD1mdW5jdGlvbihhKXtyZXR1cm4gQyhbYV0pfSxlLnRlc3RBbGxQcm9wcz1FLGcuY2xhc3NOYW1lPWcuY2xhc3NOYW1lLnJlcGxhY2UoLyhefFxccyluby1qcyhcXHN8JCkvLFwiJDEkMlwiKSsoZj9cIiBqcyBcIit0LmpvaW4oXCIgXCIpOlwiXCIpLGV9KHRoaXMsdGhpcy5kb2N1bWVudCk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgTWFyYyBKLiBTY2htaWR0LiBTZWUgdGhlIExJQ0VOU0UgZmlsZSBhdCB0aGUgdG9wLWxldmVsXG4gKiBkaXJlY3Rvcnkgb2YgdGhpcyBkaXN0cmlidXRpb24gYW5kIGF0XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWFyY2ovY3NzLWVsZW1lbnQtcXVlcmllcy9ibG9iL21hc3Rlci9MSUNFTlNFLlxuICovXG47XG4oZnVuY3Rpb24oKSB7XG5cbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgZGltZW5zaW9uIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfEVsZW1lbnRzfGpRdWVyeX0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB0aGlzLlJlc2l6ZVNlbnNvciA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50UXVldWUoKSB7XG4gICAgICAgICAgICB0aGlzLnEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnEucHVzaChldik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSB0aGlzLnEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgIHByb3BcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ3xOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIHByb3ApIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmN1cnJlbnRTdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICByZXNpemVkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCByZXNpemVkKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IuY2xhc3NOYW1lID0gJ3Jlc2l6ZS1zZW5zb3InO1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyByaWdodDogMDsgYm90dG9tOiAwOyBvdmVyZmxvdzogc2Nyb2xsOyB6LWluZGV4OiAtMTsgdmlzaWJpbGl0eTogaGlkZGVuOyc7XG4gICAgICAgICAgICB2YXIgc3R5bGVDaGlsZCA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsnO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVzaXplLXNlbnNvci1leHBhbmRcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICdcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZXNpemUtc2Vuc29yLXNocmlua1wiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcblxuICAgICAgICAgICAgaWYgKCF7Zml4ZWQ6IDEsIGFic29sdXRlOiAxfVtnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsICdwb3NpdGlvbicpXSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwYW5kID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRDaGlsZCA9IGV4cGFuZC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIHNocmluayA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMV07XG4gICAgICAgICAgICB2YXIgc2hyaW5rQ2hpbGQgPSBzaHJpbmsuY2hpbGROb2Rlc1swXTtcblxuICAgICAgICAgICAgdmFyIGxhc3RXaWR0aCwgbGFzdEhlaWdodDtcblxuICAgICAgICAgICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwYW5kQ2hpbGQuc3R5bGUud2lkdGggPSBleHBhbmQub2Zmc2V0V2lkdGggKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kQ2hpbGQuc3R5bGUuaGVpZ2h0ID0gZXhwYW5kLm9mZnNldEhlaWdodCArIDEwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBleHBhbmQuc2Nyb2xsTGVmdCA9IGV4cGFuZC5zY3JvbGxXaWR0aDtcbiAgICAgICAgICAgICAgICBleHBhbmQuc2Nyb2xsVG9wID0gZXhwYW5kLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgICAgICBzaHJpbmsuc2Nyb2xsTGVmdCA9IHNocmluay5zY3JvbGxXaWR0aDtcbiAgICAgICAgICAgICAgICBzaHJpbmsuc2Nyb2xsVG9wID0gc2hyaW5rLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgICAgICBsYXN0V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIGxhc3RIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlc2V0KCk7XG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihlbCwgbmFtZSwgY2IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhZGRFdmVudChleHBhbmQsICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFkZEV2ZW50KHNocmluaywgJ3Njcm9sbCcsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPCBsYXN0V2lkdGggfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPCBsYXN0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFwiW29iamVjdCBBcnJheV1cIiA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsZW1lbnQpXG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkgJiYgZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSkgLy9qcXVlcnlcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIEVsZW1lbnRzICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50cykgLy9tb290b29sc1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgaSA9IDAsIGogPSBlbGVtZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudFtpXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXRhY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc2l6ZVNlbnNvci5kZXRhY2goZWxlbWVudCk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHRoaXMuUmVzaXplU2Vuc29yLmRldGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQucmVzaXplU2Vuc29yKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LnJlc2l6ZVNlbnNvcjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZDtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pKCk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbkVMRU1FTlQgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyk7XHJcblxyXG5cclxuXHQvLyBFbGVtZW50IEFuaW1hdGlvbnNcclxuXHRmdW5jdGlvbiBtaXh0QW5pbWF0aW9ucygpIHtcclxuXHRcdHZhciBhbmltRWxlbXMgPSAkKCcubWl4dC1hbmltYXRlJyk7XHJcblxyXG5cdFx0aWYgKCBhbmltRWxlbXMubGVuZ3RoID09PSAwICkgeyByZXR1cm47IH1cclxuXHJcblx0XHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi53YXlwb2ludCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRhbmltRWxlbXMud2F5cG9pbnQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltLXByZScpLmFkZENsYXNzKCdhbmltLXN0YXJ0Jyk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHRoaXMuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJyApIHRoaXMuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICc4NSUnLFxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyT25jZTogdHJ1ZVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSwgMTAwMCApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0bWl4dEFuaW1hdGlvbnMoKTtcclxuXHJcblxyXG5cdC8vIFN0YXQgLyBDb3VudGVyIEVsZW1lbnRcclxuXHRmdW5jdGlvbiBtaXh0U3RhdHMoKSB7XHJcblx0XHR2YXIgc3RhdEVsZW1zID0gJCgnLm1peHQtc3RhdCcpO1xyXG5cclxuXHRcdGlmICggc3RhdEVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0Ly8gU2V0IHN0YXQgdGV4dCB0byBzdGFydGluZyAoZnJvbSkgdmFsdWVcclxuXHRcdHN0YXRFbGVtcy5maW5kKCcuc3RhdC12YWx1ZScpLmVhY2goIGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKCdmcm9tJykpOyB9KTtcclxuXHJcblx0XHQvLyBBbmltYXRlIHZhbHVlXHJcblx0XHRmdW5jdGlvbiBzdGF0VmFsdWUoZWwpIHtcclxuXHRcdFx0dmFyIGZyb20gID0gZWwuZGF0YSgnZnJvbScpLFxyXG5cdFx0XHRcdHRvICAgID0gZWwuZGF0YSgndG8nKSxcclxuXHRcdFx0XHRzcGVlZCA9IGVsLmRhdGEoJ3NwZWVkJyk7XHJcblx0XHRcdCQoe3ZhbHVlOiBmcm9tfSkuYW5pbWF0ZSh7dmFsdWU6IHRvfSwge1xyXG5cdFx0XHRcdGR1cmF0aW9uOiBzcGVlZCxcclxuXHRcdFx0XHRzdGVwOiBmdW5jdGlvbigpIHsgZWwudGV4dChNYXRoLnJvdW5kKHRoaXMudmFsdWUpKTsgfSxcclxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KHRvKTsgfVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZW5kZXIgQ2lyY2xlXHJcblx0XHRmdW5jdGlvbiBzdGF0Q2lyY2xlKHN0YXQpIHtcclxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5jaXJjbGVQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRzdGF0LmNoaWxkcmVuKCcuc3RhdC1jaXJjbGUnKS5jaXJjbGVQcm9ncmVzcyh7IHNpemU6IDUwMCwgbGluZUNhcDogJ3JvdW5kJyB9KS5jaGlsZHJlbignLmNpcmNsZS1pbm5lcicpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5jc3MoJ21hcmdpbi10b3AnLCAkKHRoaXMpLmhlaWdodCgpIC8gLTIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHN0YXRFbGVtcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc3RhdCA9ICQodGhpcyk7XHJcblx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi53YXlwb2ludCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdHN0YXQud2F5cG9pbnQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcclxuXHRcdFx0XHRcdFx0c3RhdENpcmNsZShzdGF0KTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5kZXN0cm95ID09PSAnZnVuY3Rpb24nICkgdGhpcy5kZXN0cm95KCk7XHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdG9mZnNldDogJ2JvdHRvbS1pbi12aWV3JyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcclxuXHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRtaXh0U3RhdHMoKTtcclxuXHJcblxyXG5cdC8vIEZsaXAgQ2FyZCBFcXVhbGl6ZSBIZWlnaHRcclxuXHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0dmFyIGZsaXBjYXJkU2lkZXMgPSAkKCcuZmxpcC1jYXJkIC5mcm9udCwgLmZsaXAtY2FyZCAuYmFjaycpO1xyXG5cdFx0ZmxpcGNhcmRTaWRlcy5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRmbGlwY2FyZFNpZGVzLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvLyBGbGlwIENhcmQgVG91Y2ggU2NyZWVuIFwiSG92ZXJcIlxyXG5cdCQoJy5taXh0LWZsaXBjYXJkJykub24oJ3RvdWNoc3RhcnQgdG91Y2hlbmQnLCBmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ2hvdmVyJyk7XHJcblx0fSk7XHJcblxyXG59KGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbkhFQURFUiBGVU5DVElPTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgID0gJCh3aW5kb3cpLFxyXG5cdFx0bWFpbk5hdkJhciA9ICQoJyNtYWluLW5hdicpLFxyXG5cdFx0bWVkaWFXcmFwID0gJCgnLmhlYWQtbWVkaWEnKTtcclxuXHJcblx0Ly8gSGVhZCBNZWRpYSBGdW5jdGlvbnNcclxuXHRmdW5jdGlvbiBoZWFkZXJGbigpIHtcclxuXHRcdHZhciBjb250YWluZXIgICAgPSBtZWRpYVdyYXAuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdFx0bWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXHJcblx0XHRcdHRvcE5hdkhlaWdodCA9IG1haW5OYXZCYXIub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0d3JhcEhlaWdodCAgID0gbWVkaWFXcmFwLmhlaWdodCgpLFxyXG5cdFx0XHRobUhlaWdodCAgICAgPSAwO1xyXG5cclxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLmZ1bGxzY3JlZW4gKSB7XHJcblx0XHRcdG1lZGlhV3JhcC5jc3MoJ2hlaWdodCcsIHdyYXBIZWlnaHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0aG1IZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQoKSAtIG1lZGlhV3JhcC5vZmZzZXQoKS50b3A7XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICYmICEgbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICkgeyBobUhlaWdodCAtPSB0b3BOYXZIZWlnaHQ7IH1cclxuXHJcblx0XHRcdG1lZGlhV3JhcC5jc3MoJ2hlaWdodCcsIGhtSGVpZ2h0KTtcclxuXHRcdFx0bWVkaWFDb250LmNzcygnaGVpZ2h0JywgaG1IZWlnaHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1lZGlhQ29udC5sZW5ndGggPT0gMSApIHtcclxuXHRcdFx0dmFyIGNvbnRhaW5lclBhZCA9IHRvcE5hdkhlaWdodDtcclxuXHJcblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgKSB7XHJcblx0XHRcdFx0Y29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nLCBjb250YWluZXJQYWQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnRhaW5lci5jc3MoJ3BhZGRpbmctdG9wJywgY29udGFpbmVyUGFkKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gSGVhZGVyIFNjcm9sbCBUbyBDb250ZW50XHJcblx0ZnVuY3Rpb24gaGVhZGVyU2Nyb2xsKCkge1xyXG5cdFx0dmFyIHBhZ2UgICA9ICQoJ2h0bWwsIGJvZHknKSxcclxuXHRcdFx0b2Zmc2V0ID0gJCgnI2NvbnRlbnQtd3JhcCcpLm9mZnNldCgpLnRvcDtcclxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHsgb2Zmc2V0IC09IG1haW5OYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKS5oZWlnaHQoKTsgfVxyXG5cdFx0JCgnLmhlYWRlci1zY3JvbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0cGFnZS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSwgODAwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCApIHtcclxuXHRcdGhlYWRlckZuKCk7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuc2Nyb2xsICkgeyBoZWFkZXJTY3JvbGwoKTsgfVxyXG5cdFx0XHJcblx0XHQkKHdpbmRvdykucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGhlYWRlckZuICkpO1xyXG5cdH1cclxuXHJcbn0oalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5IRUxQRVIgRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdC8vIFNraXAgTGluayBGb2N1cyBGaXhcblx0XG5cdHZhciBpc193ZWJraXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ3dlYmtpdCcgKSA+IC0xLFxuXHRcdGlzX29wZXJhICA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICkgID4gLTEsXG5cdFx0aXNfaWUgICAgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApICAgPiAtMTtcblxuXHRpZiAoICggaXNfd2Via2l0IHx8IGlzX29wZXJhIHx8IGlzX2llICkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKSApIHtcblx0XHR2YXIgZXZlbnRNZXRob2QgPSAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnO1xuXHRcdHdpbmRvd1sgZXZlbnRNZXRob2QgXSggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICkgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWF8ZGl2KSQvaS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEFwcGx5IEJvb3RzdHJhcCBDbGFzc2VzXG5cdFxuXHR2YXIgd2lkZ2V0TmF2TWVudXMgPSAnLndpZGdldF9tZXRhLCAud2lkZ2V0X3JlY2VudF9lbnRyaWVzLCAud2lkZ2V0X2FyY2hpdmUsIC53aWRnZXRfY2F0ZWdvcmllcywgLndpZGdldF9uYXZfbWVudSwgLndpZGdldF9wYWdlcywgLndpZGdldF9yc3MnO1xuXHQvLyBXb29Db21tZXJjZSBXaWRnZXRzXG5cdHdpZGdldE5hdk1lbnVzICs9ICcsIC53aWRnZXRfcHJvZHVjdF9jYXRlZ29yaWVzLCAud2lkZ2V0X3Byb2R1Y3RzLCAud2lkZ2V0X3RvcF9yYXRlZF9wcm9kdWN0cywgLndpZGdldF9yZWNlbnRfcmV2aWV3cywgLndpZGdldF9yZWNlbnRseV92aWV3ZWRfcHJvZHVjdHMsIC53aWRnZXRfbGF5ZXJlZF9uYXYnO1xuXHQkKHdpZGdldE5hdk1lbnVzKS5jaGlsZHJlbigndWwnKS5hZGRDbGFzcygnbmF2Jyk7XG5cdCQoJy53aWRnZXRfbmF2X21lbnUgdWwubWVudScpLmFkZENsYXNzKCduYXYnKTtcblxuXHQkKCcjd3AtY2FsZW5kYXInKS5hZGRDbGFzcygndGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCcpO1xuXHQkKCcud29vY29tbWVyY2UgLnNob3BfdGFibGUnKS5hZGRDbGFzcygndGFibGUgdGFibGUtYm9yZGVyZWQnKTtcblxuXHQvLyBIYW5kbGUgUG9zdCBDb3VudCBUYWdzXG5cblx0JCgnLndpZGdldF9hcmNoaXZlIGxpLCAud2lkZ2V0X2NhdGVnb3JpZXMgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcblx0XHRcdGNoaWxkcmVuICA9ICR0aGlzLmNoaWxkcmVuKCksXG5cdFx0XHRhbmNob3IgICAgPSBjaGlsZHJlbi5maWx0ZXIoJ2EnKSxcblx0XHRcdGNvbnRlbnRzICA9ICR0aGlzLmNvbnRlbnRzKCksXG5cdFx0XHRjb3VudFRleHQgPSBjb250ZW50cy5ub3QoY2hpbGRyZW4pLnRleHQoKTtcblxuXHRcdGlmICggY291bnRUZXh0ICE9PSAnJyApIHtcblx0XHRcdGFuY2hvci5hcHBlbmQoJzxzcGFuIGNsYXNzPVwicG9zdC1jb3VudFwiPicgKyBjb3VudFRleHQgKyAnPC9zcGFuPicpO1xuXHRcdFx0Y29udGVudHMuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDM7IFxuXHRcdFx0fSkucmVtb3ZlKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcud2lkZ2V0X2xheWVyZWRfbmF2IGxpJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdGNvdW50ID0gJHRoaXMuY2hpbGRyZW4oJy5jb3VudCcpLFxuXHRcdFx0bGluayAgPSAkdGhpcy5jaGlsZHJlbignYScpO1xuXHRcdGNvdW50LmFwcGVuZFRvKGxpbmspO1xuXHR9KTtcblxuXHQvLyBHYWxsZXJ5IEFycm93IE5hdmlnYXRpb25cblxuXHQkKGRvY3VtZW50KS5rZXlkb3duKCBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHVybCA9IGZhbHNlO1xuXHRcdGlmICggZS53aGljaCA9PT0gMzcgKSB7ICAvLyBMZWZ0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcucHJldmlvdXMtaW1hZ2UgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9IGVsc2UgaWYgKCBlLndoaWNoID09PSAzOSApIHsgIC8vIFJpZ2h0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcuZW50cnktYXR0YWNobWVudCBhJykuYXR0cignaHJlZicpO1xuXHRcdH1cblx0XHRpZiAoIHVybCAmJiAoICEkKCd0ZXh0YXJlYSwgaW5wdXQnKS5pcygnOmZvY3VzJykgKSApIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0XHR9XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5OQVZCQVIgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGNvbG9yTG9ELCBjb2xvclRvUmdiYSAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgICAgID0gJCh3aW5kb3cpLFxyXG5cdFx0Ym9keUVsICAgICAgID0gJCgnYm9keScpLFxyXG5cdFx0bWFpbldyYXAgICAgID0gJCgnI21haW4td3JhcCcpLFxyXG5cdFx0bWFpbk5hdldyYXAgID0gJCgnI21haW4tbmF2LXdyYXAnKSxcclxuXHRcdG1haW5OYXZCYXIgICA9ICQoJyNtYWluLW5hdicpLFxyXG5cdFx0bWFpbk5hdkNvbnQgID0gbWFpbk5hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxyXG5cdFx0bWFpbk5hdkhlYWQgID0gJCgnLm5hdmJhci1oZWFkZXInLCBtYWluTmF2QmFyKSxcclxuXHRcdG1haW5OYXZJbm5lciA9ICQoJy5uYXZiYXItaW5uZXInLCBtYWluTmF2QmFyKSxcclxuXHRcdHNlY05hdkJhciAgICA9ICQoJyNzZWNvbmQtbmF2JyksXHJcblx0XHRzZWNOYXZDb250ICAgPSBzZWNOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdG5hdmJhcnMgICAgICA9ICQoJy5uYXZiYXInKSxcclxuXHRcdG1lZGlhV3JhcCAgICA9ICQoJy5oZWFkLW1lZGlhJyk7XHJcblxyXG5cdGlmICggbWFpbk5hdkJhci5sZW5ndGggPT09IDAgKSByZXR1cm47XHJcblxyXG5cdHZhciBuYXZiYXJPYmogPSB7XHJcblxyXG5cdFx0bmF2Qmc6ICcnLFxyXG5cdFx0bmF2QmdUb3A6ICcnLFxyXG5cclxuXHRcdC8vIEluaXRpYWxpemUgTmF2YmFyXHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24obmF2YmFyKSB7XHJcblxyXG5cdFx0XHR2YXIgYmdDb2xvciAgPSBuYXZiYXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyksXHJcblx0XHRcdFx0Y29sb3JMdW0gPSBjb2xvckxvRChiZ0NvbG9yKTtcclxuXHJcblx0XHRcdGlmICggY29sb3JMdW0gPT0gJ2RhcmsnICkgeyBuYXZiYXIuYWRkQ2xhc3MoJ2JnLWRhcmsnKTsgfVxyXG5cdFx0XHRpZiAoIG5hdmJhci5pcyhtYWluTmF2QmFyKSApIHtcclxuXHRcdFx0XHRuYXZiYXJPYmoubmF2QmcgPSAoIGNvbG9yTHVtID09ICdkYXJrJyApID8gJ2JnLWRhcmsnIDogJ2JnLWxpZ2h0JztcclxuXHRcdFx0XHRtYWluTmF2QmFyLmF0dHIoJ2RhdGEtYmcnLCBjb2xvckx1bSk7XHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XHJcblx0XHRcdFx0XHR2YXIgaGVhZENzc1NoZWV0ID0gJCgnc3R5bGVbZGF0YS1pZD1cIm1peHQtaGVhZC1jc3NcIl0nKTtcclxuXHRcdFx0XHRcdC8vIEFkZCBvcGFjaXR5IHJ1bGVzXHJcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5vcGFjaXR5IDwgMSApIHtcclxuXHRcdFx0XHRcdFx0aGVhZENzc1NoZWV0LmFwcGVuZCgnLmZpeGVkLW5hdiAubmF2YmFyLm5hdmJhci1taXh0IHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXYub3BhY2l0eSkrJzsgfScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPCAxICkge1xyXG5cdFx0XHRcdFx0XHRoZWFkQ3NzU2hlZXQuYXBwZW5kKCcubmF2LXRyYW5zcGFyZW50IC5uYXZiYXIubmF2YmFyLW1peHQucG9zaXRpb24tdG9wIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10pKyc7IH0nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddIDw9IDAuNCApIHtcclxuXHRcdFx0XHRcdFx0aWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWRhcmsnKSApIHsgbmF2YmFyT2JqLm5hdkJnVG9wID0gJ2JnLWRhcmsnOyB9XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWxpZ2h0JykgKSB7IG5hdmJhck9iai5uYXZCZ1RvcCA9ICdiZy1saWdodCc7IH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7IG5hdmJhck9iai5uYXZCZ1RvcCA9IG5hdmJhck9iai5uYXZCZzsgfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRuYXZiYXJPYmoubmF2QmdUb3AgPSBuYXZiYXJPYmoubmF2Qmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ3N0YXRpYycgKSB7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKG5hdmJhck9iai5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgbmF2YmFyT2JqLm5hdkJnVG9wKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uXHJcblxyXG5cdFx0c3RpY2t5TmF2OiBmdW5jdGlvbihpc01vYmlsZSkge1xyXG5cclxuXHRcdFx0dmFyIG5hdlNjcm9sbEhhbmRsZXIgPSAkLnRocm90dGxlKCA1MCwgc3RpY2t5TmF2VG9nZ2xlICksXHJcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiA9IDAsXHJcblx0XHRcdFx0bWFpbk5hdkhlaWdodCAgICAgPSAwLFxyXG5cdFx0XHRcdG1haW5OYXZQb3MgICAgICAgID0gMCxcclxuXHRcdFx0XHRtYWluTmF2TWcgICAgICAgICA9IDA7XHJcblxyXG5cdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSApIHsgdmlld3BvcnQub24oJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XHJcblx0XHRcdGVsc2UgeyB2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XHJcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiArPSBwYXJzZUZsb2F0KG1haW5XcmFwLmNzcygncGFkZGluZy10b3AnKSwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHRtYWluTmF2SGVpZ2h0ID0gbWFpbk5hdkJhci5jc3MoJ2hlaWdodCcsICcnKS5vdXRlckhlaWdodCgpO1xyXG5cdFx0XHRcdG1haW5OYXZQb3MgICAgPSBwYXJzZUludChtYWluTmF2QmFyLmNzcygndG9wJyksIDEwKTtcclxuXHRcdFx0XHRtYWluTmF2TWcgICAgID0gbWFpbk5hdkhlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKCBtYWluTmF2UG9zID09PSAwIHx8IGlzTmFOKG1haW5OYXZQb3MpICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoJ21hcmdpbi10b3AnLCAobWFpbk5hdkhlaWdodCAqIC0xKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzdGlja3lOYXZUb2dnbGUoKSB7XHJcblx0XHRcdFx0dmFyIG5hdlBvcyAgICA9IG1haW5OYXZXcmFwLm9mZnNldCgpLnRvcCAtIG1haW5OYXZNZyxcclxuXHRcdFx0XHRcdHNjcm9sbFZhbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gbmF2YmFyT2JqLm5hdkJnVG9wO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxWYWwgPSBpc01vYmlsZSA9PT0gdHJ1ZSA/IDAgOiBzY3JvbGxWYWwgKz0gc2Nyb2xsQ29ycmVjdGlvbjtcclxuXHJcblx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLmhhc0NsYXNzKCdzbGlkZS1iZy1kYXJrJykgKSB7IGJnVG9wQ2xzID0gJ2JnLWRhcmsnOyB9XHJcblx0XHRcdFx0ZWxzZSBpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWxpZ2h0JykgJiYgKCBuYXZiYXJPYmoubmF2QmcgIT0gJ2JnLWRhcmsnIHx8IG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSApIHsgYmdUb3BDbHMgPSAnYmctbGlnaHQnOyB9XHJcblxyXG5cdFx0XHRcdGlmICggc2Nyb2xsVmFsID4gbmF2UG9zICkgeyAgXHJcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcygncG9zaXRpb24tdG9wICcgKyBiZ1RvcENscykuYWRkQ2xhc3MobmF2YmFyT2JqLm5hdkJnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MobmF2YmFyT2JqLm5hdkJnKS5hZGRDbGFzcygncG9zaXRpb24tdG9wICcgKyBiZ1RvcENscyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdGlja3lOYXZUb2dnbGUoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUHJldmVudCBOYXZiYXIgU3VibWVudSBPdmVyZmxvdyBPdXQgT2YgVmlld3BvcnRcclxuXHJcblx0XHRtZW51T3ZlcmZsb3c6IGZ1bmN0aW9uKG5hdmJhcikge1xyXG5cclxuXHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXHJcblx0XHRcdFx0bWFpblN1YiA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51IC5kcm9wZG93bi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IC5zdWItbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiBhJyk7XHJcblxyXG5cdFx0XHRpZiAoIG5hdmJhci5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdG5hdmJhck9mZiA9IG5hdmJhci5vdXRlcldpZHRoKCkgKyBwYXJzZUludChuYXZiYXIub2Zmc2V0KCkubGVmdCwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTZXQgTWVudSBEcm9wIExlZnRcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHNldERyb3BMZWZ0KHRhcmdldCkge1xyXG5cdFx0XHRcdHRhcmdldC5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcC1sZWZ0Jyk7XHJcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XHJcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcclxuXHRcdFx0XHRcdHRhcmdldC5maW5kKCcuZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gUmVzZXQgTWVudSBEcm9wXHJcblxyXG5cdFx0XHRmdW5jdGlvbiByZXNldEFycm93KHRhcmdldCkge1xyXG5cdFx0XHRcdHRhcmdldC5maW5kKCcuc3ViLW1lbnUnKS5yZW1vdmVDbGFzcygnZHJvcC1sZWZ0Jyk7XHJcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XHJcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcclxuXHRcdFx0XHRcdHRhcmdldC5maW5kKCcuZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFJlc2V0IE1vYmlsZSBBZGp1c3RtZW50c1xyXG5cclxuXHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XHJcblxyXG5cdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXHJcblxyXG5cdFx0XHRtYWluU3ViLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBzdWIgICAgICA9ICQodGhpcyksXHJcblx0XHRcdFx0XHR0b3BTdWIgICA9IHN1YixcclxuXHRcdFx0XHRcdHN1YlBhciAgID0gc3ViLnBhcmVudCgpLFxyXG5cdFx0XHRcdFx0c3ViUG9zICAgPSBwYXJzZUludChzdWIub2Zmc2V0KCkubGVmdCwgMTApLFxyXG5cdFx0XHRcdFx0c3ViVyAgICAgPSBzdWIub3V0ZXJXaWR0aCgpICsgMSxcclxuXHRcdFx0XHRcdG5lc3RPZmYgID0gc3ViUG9zICsgc3ViVyxcclxuXHRcdFx0XHRcdG5lc3RTdWJzID0gc3ViLmNoaWxkcmVuKCcuZHJvcC1zdWJtZW51JyksXHJcblx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSBuZXN0U3VicyxcclxuXHRcdFx0XHRcdGNvcnJlY3Rpb247XHJcblxyXG5cdFx0XHRcdGlmICggc3ViUGFyLmlzKCcubWVnYS1tZW51LWNvbHVtbicpICkge1xyXG5cdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XHJcblx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFRvcCBMZXZlbCBTdWJtZW51c1xyXG5cclxuXHRcdFx0XHRpZiAoIG5lc3RPZmYgPiBuYXZiYXJPZmYgKSB7XHJcblx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XHJcblx0XHRcdFx0XHRjb3JyZWN0aW9uID0gKG5lc3RPZmYgLSBuYXZiYXJPZmYgLSAyKSAqIC0xO1xyXG5cclxuXHRcdFx0XHRcdGlmICggdG9wU3ViLmNzcygnYm9yZGVyLXJpZ2h0LXdpZHRoJykgPT0gJzFweCcgKSB7IGNvcnJlY3Rpb24gLT0gMTsgfVxyXG5cclxuXHRcdFx0XHRcdGlmICggbmF2YmFyLmhhc0NsYXNzKCdib3JkZXJlZCcpIHx8IG5hdmJhci5wYXJlbnRzKCcubmF2YmFyJykuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgKSB7IGNvcnJlY3Rpb24gLT0gMTsgfVxyXG5cclxuXHRcdFx0XHRcdGlmICggY29ycmVjdGlvbiA8IG1nTm93ICkge1xyXG5cdFx0XHRcdFx0XHR0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcsIGNvcnJlY3Rpb24gKyAncHgnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNldERyb3BMZWZ0KG92ZXJmbG93aW5nU3Vicyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBOZXN0ZWQgU3VibWVudXNcclxuXHJcblx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0bmVzdFN1YnNXID0gW107XHJcblx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudHMgID0gJHRoaXMucGFyZW50cygnLnN1Yi1tZW51JyksXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xyXG5cclxuXHRcdFx0XHRcdFx0cGFyZW50cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggISAkdGhpcy5oYXNDbGFzcygnZHJvcGRvd24tbWVudScpICYmICEgJHRoaXMuaGFzQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgKz0gJCh0aGlzKS5vdXRlcldpZHRoKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdG5lc3RTdWJzV1tpXSA9ICR0aGlzLm91dGVyV2lkdGgoKSArIHBhcmVudHNXO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIChuZXN0T2ZmICsgbWF4TmVzdFcpID49IGJvZHlFbC53aWR0aCgpICkge1xyXG5cdFx0XHRcdFx0XHRzZXREcm9wTGVmdChzdWJOb3cpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzZXRBcnJvdyhzdWJOb3cpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBNZWdhIE1lbnUgRW5hYmxlIC8gRGlzYWJsZVxyXG5cclxuXHRcdG1lZ2FNZW51VG9nZ2xlOiBmdW5jdGlvbih0b2dnbGUsIG5hdmJhcikge1xyXG5cdFx0XHR2YXIgbWVnYU1lbnVzO1xyXG5cclxuXHRcdFx0aWYgKCB0b2dnbGUgPT0gJ2VuYWJsZScgKSB7XHJcblx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5kcm9wLW1lbnVbZGF0YS1tZWdhLW1lbnU9XCJ0cnVlXCJdJyk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0XHRtZWdhTWVudS5hZGRDbGFzcygnbWVnYS1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbWVudScpLnJlbW92ZUF0dHIoJ2RhdGEtbWVnYS1tZW51Jyk7XHJcblx0XHRcdFx0XHQkKCc+IC5zdWItbWVudSA+IC5kcm9wLXN1Ym1lbnUnLCBtZWdhTWVudSkucmVtb3ZlQ2xhc3MoJ2Ryb3Atc3VibWVudScpLmFkZENsYXNzKCdtZWdhLW1lbnUtY29sdW1uJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0bWVnYU1lbnVzLmNoaWxkcmVuKCd1bCcpLmNzcygnbWFyZ2luLWxlZnQnLCAnJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAoIHRvZ2dsZSA9PSAnZGlzYWJsZScgKSB7XHJcblx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5tZWdhLW1lbnUnKTtcclxuXHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRcdG1lZ2FNZW51LnJlbW92ZUNsYXNzKCdtZWdhLW1lbnUnKS5hZGRDbGFzcygnZHJvcC1tZW51JykuYXR0cignZGF0YS1tZWdhLW1lbnUnLCAndHJ1ZScpO1xyXG5cdFx0XHRcdFx0bWVnYU1lbnUuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW4nKS5yZW1vdmVDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpLmFkZENsYXNzKCdkcm9wLXN1Ym1lbnUnKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRtZWdhTWVudXMuY2hpbGRyZW4oJ3VsJykuY3NzKCdtYXJnaW4tbGVmdCcsICcnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBDcmVhdGUgTWVnYSBNZW51IFJvd3MgSWYgVGhlcmUgQXJlIE1vcmUgVGhhbiA0IENvbHVtbnNcclxuXHJcblx0XHRtZWdhTWVudVJvd3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRtYWluV3JhcC5maW5kKCcubWVnYS1tZW51JykuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIG1haW5NZW51ID0gJCh0aGlzKS5jaGlsZHJlbignLnN1Yi1tZW51JyksXHJcblx0XHRcdFx0XHRjb2x1bW5zICA9IG1haW5NZW51LmNoaWxkcmVuKCcubWVnYS1tZW51LWNvbHVtbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoIGNvbHVtbnMubGVuZ3RoID4gNCApIG1haW5NZW51LmFkZENsYXNzKCdtdWx0aS1yb3cnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIE1vYmlsZSBGdW5jdGlvbnNcclxuXHJcblx0XHRuYXZNb2JpbGU6IGZ1bmN0aW9uKG1xTmF2KSB7XHJcblxyXG5cdFx0XHQvLyBFbmFibGUgTmF2IFNjcm9sbGluZyBJZiBOYXZiYXIgSGVpZ2h0ID4gVmlld3BvcnRcclxuXHJcblx0XHRcdGZ1bmN0aW9uIG5hdlNjcm9sbCgpIHtcclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgbXFOYXYgPT0gMiApIHtcclxuXHRcdFx0XHRcdHZhciB2aWV3cG9ydEggICAgID0gdmlld3BvcnQuaGVpZ2h0KCksXHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0UyAgICAgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRcdFx0bmF2YmFySGVhZGVySCA9IG1haW5OYXZIZWFkLmhlaWdodCgpICsgMSxcclxuXHRcdFx0XHRcdFx0bmF2YmFySW5uZXJIICA9IG1haW5OYXZJbm5lci5oYXNDbGFzcygnaW4nKSA/IG1haW5OYXZJbm5lci5oZWlnaHQoKSA6IDAsXHJcblx0XHRcdFx0XHRcdG5hdmJhckggICAgICAgPSBuYXZiYXJIZWFkZXJIICsgbmF2YmFySW5uZXJILFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJNZyAgICAgID0gMCxcclxuXHRcdFx0XHRcdFx0bmF2YmFyVG9wICAgICA9IG1haW5OYXZCYXIub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wLFxyXG5cclxuXHRcdFx0XHRcdFx0c2Nyb2xsSGFuZGxlciA9ICQudGhyb3R0bGUoIDUwLCBuYXZTdG9wU2Nyb2xsICk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5wYWdlWydzaG93LWFkbWluLWJhciddICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgYWRtaW5CYXJIID0gJCgnI3dwYWRtaW5iYXInKS5oZWlnaHQoKTtcclxuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XHJcblx0XHRcdFx0XHRcdG5hdndyYXBUb3AgLT0gYWRtaW5CYXJIO1xyXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgIC09IGFkbWluQmFySDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcclxuXHRcdFx0XHRcdFx0bmF2YmFyTWcgPSBuYXZiYXJIZWFkZXJIICogLTE7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBuYXZiYXJIID4gdmlld3BvcnRIICkge1xyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcik7XHJcblx0XHRcdFx0XHRcdGlmICggbWFpbk5hdkJhci5ub3QoJ3N0b3BwZWQnKSApIHtcclxuXHRcdFx0XHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSwgJ21hcmdpbi10b3AnOiAnMCcgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcik7XHJcblx0XHRcdFx0XHRcdG1haW5OYXZCYXIuY3NzKHsgJ3Bvc2l0aW9uJzogJycsICd0b3AnOiAnJywgJ21hcmdpbi10b3AnOiBuYXZiYXJNZyB9KS5yZW1vdmVDbGFzcygnc3RvcHBlZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gbmF2U3RvcFNjcm9sbCgpIHtcclxuXHRcdFx0XHRcdHZhciB2aWV3U2Nyb2xsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRcdHN0b3BTY3JvbGwgPSBtYWluTmF2QmFyLmhhc0NsYXNzKCdzdG9wcGVkJykgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIHZpZXdwb3J0UyA+IG1haW5OYXZIZWFkLm9mZnNldCgpLnRvcCApIHsgc3RvcFNjcm9sbCA9IGZhbHNlOyB9XHJcblx0XHRcdFx0XHRpZiAoIHZpZXdwb3J0UyA+IHZpZXdTY3JvbGwgJiYgc3RvcFNjcm9sbCApIHsgdmlld3BvcnQuc2Nyb2xsVG9wKHZpZXdwb3J0Uyk7IH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNob3cvaGlkZSBTdWJtZW51cyBPbiBIYW5kbGUgQ2xpY2tcclxuXHJcblx0XHRcdCQoJy5kcm9wZG93bi10b2dnbGUnLCBtYWluTmF2QmFyKS5vbignY2xpY2sgdG91Y2hzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCAkKGV2ZW50LnRhcmdldCkuaXMoJy5kcm9wLWFycm93JykgKSB7XHJcblx0XHRcdFx0XHRpZiggZXZlbnQuaGFuZGxlZCAhPT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdFx0bWVudSAgID0gaGFuZGxlLmNsb3Nlc3QoJy5tZW51LWl0ZW0nKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICggbWVudS5oYXNDbGFzcygnZXhwYW5kJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0bWVudS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcblx0XHRcdFx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1lbnUpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRtZW51LmFkZENsYXNzKCdleHBhbmQnKS5zaWJsaW5ncygnbGknKS5yZW1vdmVDbGFzcygnZXhwYW5kJykuZmluZCgnLmV4cGFuZCcpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0bmF2U2Nyb2xsKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRldmVudC5oYW5kbGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLm1lbnUtaXRlbScsIG1haW5OYXZCYXIpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRuYXZTY3JvbGwoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRuYXZTY3JvbGwoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRuYXZiYXJPYmouaW5pdCgkKHRoaXMpKTtcclxuXHR9KTtcclxuXHRcclxuXHRuYXZiYXJPYmoubWVnYU1lbnVSb3dzKCk7XHJcblxyXG5cdG1haW5OYXZCYXIub24oJ3JlZnJlc2gnLCBmdW5jdGlvbigpIHtcclxuXHRcdG5hdmJhck9iai5pbml0KG1haW5OYXZCYXIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gQ2hlY2sgd2hpY2ggbWVkaWEgcXVlcmllcyBhcmUgYWN0aXZlXHJcblx0dmFyIG1xQ2hlY2sgPSBmdW5jdGlvbiggZWxlbSApIHtcclxuXHRcdGVsZW0gPSAkKCcjJyArIGVsZW0pO1xyXG5cdFx0dmFyIGRpc3BsYXkgPSBlbGVtLmNzcygnZGlzcGxheScpO1xyXG5cclxuXHRcdGlmICggZGlzcGxheSA9PSAnYmxvY2snICkgeyByZXR1cm4gMTsgfVxyXG5cdFx0ZWxzZSBpZiAoIGRpc3BsYXkgPT0gJ2lubGluZScpIHsgcmV0dXJuIDI7IH1cclxuXHRcdGVsc2UgeyByZXR1cm4gMDsgfVxyXG5cdH07XHJcblxyXG5cclxuXHQvLyBFbmFibGUgTWVudSBIb3ZlciBPbiBUb3VjaCBTY3JlZW5zXHJcblx0dmFyIG1lbnVQYXJlbnRzID0gbmF2YmFycy5maW5kKCcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiwgbGkuZHJvcGRvd24nKTtcclxuXHRmdW5jdGlvbiBtZW51VG91Y2hIb3ZlcihldmVudCkge1xyXG5cdFx0dmFyIGxpbmsgPSAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KSxcclxuXHRcdFx0YW5jZXN0b3JzID0gbGluay5wYXJlbnRzKCcuaG92ZXInKTtcclxuXHRcdGlmIChsaW5rLmhhc0NsYXNzKCdob3ZlcicpKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGluay5hZGRDbGFzcygnaG92ZXInKTtcclxuXHRcdFx0bWVudVBhcmVudHMubm90KGxpbmspLm5vdChhbmNlc3RvcnMpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIG1lbnVUb3VjaFJlbW92ZUhvdmVyKGV2ZW50KSB7XHJcblx0XHRpZiAoICEgJChldmVudC5kZWxlZ2F0ZVRhcmdldCkuaXMobWVudVBhcmVudHMpICkgeyBtZW51UGFyZW50cy5yZW1vdmVDbGFzcygnaG92ZXInKTsgfVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIEVuc3VyZSB2ZXJ0aWNhbCBuYXZiYXIgaXRlbXMgZml0IGluIHZpZXdwb3J0XHJcblx0ZnVuY3Rpb24gdmVydGljYWxOYXZGaXRWaWV3KCkge1xyXG5cdFx0aWYgKCB2aWV3cG9ydC5oZWlnaHQoKSA8IG1haW5OYXZDb250LmlubmVySGVpZ2h0KCkgKSB7XHJcblx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCd2ZXJ0aWNhbC1maXhlZCcpLmFkZENsYXNzKCd2ZXJ0aWNhbC1zdGF0aWMnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCd2ZXJ0aWNhbC1zdGF0aWMnKS5hZGRDbGFzcygndmVydGljYWwtZml4ZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgUnVuIE9uIExvYWQgJiBXaW5kb3cgUmVzaXplXHJcblx0ZnVuY3Rpb24gbmF2YmFyRm4oKSB7XHJcblxyXG5cdFx0dmFyIG1xTmF2ID0gbXFDaGVjaygnbmF2YmFyLWNoZWNrJyk7IC8vIEVxdWFscyBcIjBcIiBmb3IgZGVza3RvcCwgXCIxXCIgZm9yIG1vYmlsZSBhbmQgXCIyXCIgZm9yIHRhYmxldHNcclxuXHJcblx0XHQvLyBSdW4gZnVuY3Rpb24gdG8gcHJldmVudCBzdWJtZW51cyBnb2luZyBvdXRzaWRlIHZpZXdwb3J0XHJcblx0XHRuYXZiYXJzLm5vdChtYWluTmF2QmFyKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0bmF2YmFyT2JqLm1lbnVPdmVyZmxvdygkKCcubmF2YmFyLWlubmVyJywgdGhpcykpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gUnVuIGZ1bmN0aW9ucyBiYXNlZCBvbiBjdXJyZW50bHkgYWN0aXZlIG1lZGlhIHF1ZXJ5XHJcblx0XHRpZiAoIG1xTmF2ID09PSAwICkge1xyXG5cdFx0XHRuYXZiYXJPYmoubWVudU92ZXJmbG93KG1haW5OYXZJbm5lcik7XHJcblx0XHRcdG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCAnJyk7XHJcblxyXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdG5hdmJhck9iai5tZWdhTWVudVRvZ2dsZSgnZW5hYmxlJywgJCh0aGlzKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWVudVBhcmVudHMub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vbigndG91Y2hzdGFydCcsIG1lbnVUb3VjaFJlbW92ZUhvdmVyKTtcclxuXHRcdH0gZWxzZSBpZiAoIG1xTmF2ID4gMCApIHtcclxuXHRcdFx0bmF2YmFyT2JqLm5hdk1vYmlsZShtcU5hdik7XHJcblxyXG5cdFx0XHR2YXIgbmF2SGVpZ2h0ID0gbWFpbk5hdkhlYWQub3V0ZXJIZWlnaHQoKSArIDE7XHJcblx0XHRcdG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCBuYXZIZWlnaHQpO1xyXG5cclxuXHRcdFx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRuYXZiYXJPYmoubWVnYU1lbnVUb2dnbGUoJ2Rpc2FibGUnLCAkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtZW51UGFyZW50cy5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XHJcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcclxuXHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyApIHtcclxuXHRcdFx0aWYgKCBtcU5hdiA9PT0gMSApIHtcclxuXHRcdFx0XHRuYXZiYXJPYmouc3RpY2t5TmF2KHRydWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5hdmJhck9iai5zdGlja3lOYXYoZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdwb3NpdGlvbi10b3AnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBWZXJ0aWNhbCBuYXZiYXIgaGFuZGxpbmdcclxuXHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAndmVydGljYWwnICYmIG1peHRfb3B0Lm5hdlsndmVydGljYWwtbW9kZSddID09ICdmaXhlZCcgJiYgbXFOYXYgPT09IDAgKSB7XHJcblx0XHRcdC8vIE1ha2UgbmF2YmFyIHN0YXRpYyBpZiBpdGVtcyBkb24ndCBmaXQgaW4gdmlld3BvcnRcclxuXHRcdFx0dmVydGljYWxOYXZGaXRWaWV3KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmF2YmFyT3ZlcmxhcCgpO1xyXG5cdH1cclxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgbmF2YmFyRm4gKSkucmVzaXplKCk7XHJcblxyXG5cclxuXHQvLyBIYW5kbGUgTmF2YmFyIEl0ZW1zIE92ZXJsYXBcclxuXHR2YXIgbWFpbk5hdkxvZ29DbHMgPSBtYWluTmF2V3JhcC5hdHRyKCdkYXRhLWxvZ28tYWxpZ24nKSxcclxuXHRcdG1haW5OYXZJdGVtc1dpZHRoID0gMCxcclxuXHRcdHNlY05hdkl0ZW1zV2lkdGggPSAwO1xyXG5cclxuXHRpZiAoIG1haW5OYXZMb2dvQ2xzICE9ICdsb2dvLWNlbnRlcicgKSB7XHJcblx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IG1haW5OYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcclxuXHR9XHJcblx0aWYgKCBzZWNOYXZCYXIubGVuZ3RoICkge1xyXG5cdFx0c2VjTmF2SXRlbXNXaWR0aCA9ICQoJy5sZWZ0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBuYXZiYXJPdmVybGFwKCkge1xyXG5cclxuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soJ25hdmJhci1jaGVjaycpO1xyXG5cclxuXHRcdC8vIFByaW1hcnkgTmF2YmFyXHJcblx0XHRpZiAoIG1haW5OYXZMb2dvQ2xzICE9ICdsb2dvLWNlbnRlcicgJiYgbWl4dF9vcHQubmF2LmxheW91dCA9PSAnaG9yaXpvbnRhbCcgKSB7XHJcblx0XHRcdGlmICggbXFOYXYgPT09IDAgKSB7XHJcblx0XHRcdFx0dmFyIG1haW5OYXZDb250V2lkdGggPSBtYWluTmF2Q29udC53aWR0aCgpO1xyXG5cdFx0XHRcdGlmICggbWFpbk5hdkl0ZW1zV2lkdGggPiBtYWluTmF2Q29udFdpZHRoICkge1xyXG5cdFx0XHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MobWFpbk5hdkxvZ29DbHMpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygnbG9nby1jZW50ZXInKS5hZGRDbGFzcyhtYWluTmF2TG9nb0Nscyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlcicpLmFkZENsYXNzKG1haW5OYXZMb2dvQ2xzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNlY29uZGFyeSBOYXZiYXJcclxuXHRcdGlmICggc2VjTmF2QmFyLmxlbmd0aCApIHtcclxuXHRcdFx0dmFyIHNlY05hdkNvbnRXaWR0aCA9IHNlY05hdkNvbnQuaW5uZXJXaWR0aCgpO1xyXG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLmFkZENsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0bmF2YmFyT3ZlcmxhcCgpO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5QT1NUIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0LCBpZnJhbWVBc3BlY3QgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxyXG5cdFx0Y29udGVudCAgPSAkKCcjY29udGVudCcpO1xyXG5cclxuXHQvLyBSZXNpemUgRW1iZWRkZWQgVmlkZW9zIFByb3BvcnRpb25hbGx5XHJcblx0aWZyYW1lQXNwZWN0KCAkKCcucG9zdCBpZnJhbWUnKSApO1xyXG5cclxuXHQvLyBQb3N0IExheW91dFxyXG5cdGZ1bmN0aW9uIHBvc3RzUGFnZSgpIHtcclxuXHJcblx0XHRjb250ZW50LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQvLyBGZWF0dXJlZCBHYWxsZXJ5IFNsaWRlclxyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdHZhciBnYWxsZXJ5U2xpZGVyID0gJCgnLmdhbGxlcnktc2xpZGVyJykubm90KCcubGlnaHRTbGlkZXInKTtcclxuXHRcdFx0XHRnYWxsZXJ5U2xpZGVyLmxpZ2h0U2xpZGVyKHtcclxuXHRcdFx0XHRcdGl0ZW06IDEsXHJcblx0XHRcdFx0XHRhdXRvOiB0cnVlLFxyXG5cdFx0XHRcdFx0bG9vcDogdHJ1ZSxcclxuXHRcdFx0XHRcdHBhZ2VyOiBmYWxzZSxcclxuXHRcdFx0XHRcdHBhdXNlOiA1MDAwLFxyXG5cdFx0XHRcdFx0a2V5UHJlc3M6IHRydWUsXHJcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMCxcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodEdhbGxlcnkgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0JCgnLmxpZ2h0Ym94LWdhbGxlcnknKS5saWdodEdhbGxlcnkoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRXF1YWxpemUgZmVhdHVyZWQgbWVkaWEgaGVpZ2h0IGZvciByZWxhdGVkIHBvc3RzIGFuZCBncmlkIGJsb2dcclxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHR2YXIgbWF0Y2hIZWlnaHRFbCA9ICQoJy5ibG9nLWdyaWQgLnBvc3RzLWNvbnRhaW5lciAucG9zdC1mZWF0LCAucG9zdC1yZWxhdGVkIC5wb3N0LWZlYXQnKTtcclxuXHRcdFx0XHRtYXRjaEhlaWdodEVsLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoe1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiAkKCcud3AtcG9zdC1pbWFnZScpLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gTG9hZCBQb3N0cyAmIENvbW1lbnRzIHZpYSBBamF4XHJcblx0ZnVuY3Rpb24gbWl4dEFqYXhMb2FkKHR5cGUpIHtcclxuXHRcdHR5cGUgPSB0eXBlIHx8ICdwb3N0cyc7XHJcblx0XHR2YXIgcGFnQ29udCA9ICQoJy5wYWdpbmctbmF2aWdhdGlvbicpLFxyXG5cdFx0XHRhamF4QnRuID0gJCgnLmFqYXgtbW9yZScsIHBhZ0NvbnQpO1xyXG5cclxuXHRcdGlmICggISBwYWdDb250Lmxlbmd0aCB8fCAhIGFqYXhCdG4ubGVuZ3RoICkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR2YXIgcGFnZU5vdyA9IHBhZ0NvbnQuZGF0YSgncGFnZS1ub3cnKSxcclxuXHRcdFx0cGFnZU1heCA9IHBhZ0NvbnQuZGF0YSgncGFnZS1tYXgnKSxcclxuXHRcdFx0bmV4dFVybCA9IGFqYXhCdG4uYXR0cignaHJlZicpLFxyXG5cdFx0XHRwYWdlTnVtLFxyXG5cdFx0XHRwYWdlVHlwZSxcclxuXHRcdFx0Y29udGFpbmVyLFxyXG5cdFx0XHRlbGVtZW50LFxyXG5cdFx0XHRsb2FkU2VsO1xyXG5cclxuXHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xyXG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xyXG5cdFx0XHRjb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XHJcblx0XHRcdGVsZW1lbnQgICA9ICcuYXJ0aWNsZSc7XHJcblx0XHRcdGxvYWRTZWwgICA9ICcgLnBvc3RzLWNvbnRhaW5lciAuYXJ0aWNsZSc7XHJcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdzaG9wJyApIHtcclxuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXTtcclxuXHRcdFx0Y29udGFpbmVyID0gJCgndWwucHJvZHVjdHMnKTtcclxuXHRcdFx0ZWxlbWVudCAgID0gJy5wcm9kdWN0JztcclxuXHRcdFx0bG9hZFNlbCAgID0gJyB1bC5wcm9kdWN0cyA+IGxpJztcclxuXHRcdH0gZWxzZSBpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyApIHtcclxuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddO1xyXG5cdFx0XHRjb250YWluZXIgPSAkKCcuY29tbWVudC1saXN0Jyk7XHJcblx0XHRcdGVsZW1lbnQgICA9ICcuY29tbWVudCc7XHJcblx0XHRcdGxvYWRTZWwgICA9ICcgLmNvbW1lbnQtbGlzdCA+IGxpJztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XHJcblx0XHRcdHBhZ2VOdW0gPSBwYWdlTm93IC0gMTtcclxuXHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBhZ2VOdW0gPSBwYWdlTm93ICsgMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICggcGFnZU5vdyA+PSBwYWdlTWF4ICkgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddICE9ICduZXdlc3QnIHx8IHBhZ2VOdW0gPD0gMCApIHtcclxuXHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFqYXhCdG4ub24oJ2NsaWNrIGNvbnQ6Ym90dG9tJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHQvLyBQcmV2ZW50IGxvYWRpbmcgdHdpY2Ugb24gc2Nyb2xsXHJcblx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XHJcblx0XHRcclxuXHRcdFx0Ly8gQXJlIHRoZXJlIG1vcmUgcGFnZXMgdG8gbG9hZD9cclxuXHRcdFx0aWYgKCBwYWdlTnVtID4gMCAmJiBwYWdlTnVtIDw9IHBhZ2VNYXggKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdsb2FkaW5nJyk7XHJcblxyXG5cdFx0XHRcdC8vIExvYWQgcG9zdHNcclxuXHRcdFx0XHQvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xyXG5cdFx0XHRcdCQoJzxkaXY+JykubG9hZChuZXh0VXJsICsgbG9hZFNlbCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XHJcblx0XHRcdFx0XHR2YXIgbmV3UG9zdHMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRcdGFqYXhCdG4uYmx1cigpO1xyXG5cclxuXHRcdFx0XHRcdG5ld1Bvc3RzLmNoaWxkcmVuKGVsZW1lbnQpLmFkZENsYXNzKCdhamF4LW5ldycpO1xyXG5cdFx0XHRcdFx0aWYgKCAoIHR5cGUgPT0gJ3Bvc3RzJyB8fCB0eXBlID09ICdzaG9wJyApICYmIG1peHRfb3B0LmxheW91dC50eXBlICE9ICdtYXNvbnJ5JyAmJiBtaXh0X29wdC5sYXlvdXRbJ3Nob3ctcGFnZS1uciddICkge1xyXG5cdFx0XHRcdFx0XHRuZXdQb3N0cy5wcmVwZW5kKCc8ZGl2IGNsYXNzPVwiYWpheC1wYWdlIHBhZ2UtJysgcGFnZU51bSArJ1wiPjxhIGhyZWY9XCInKyBuZXh0VXJsICsnXCI+UGFnZSAnKyBwYWdlTnVtICsnPC9hPjwvZGl2PicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChuZXdQb3N0cy5odG1sKCkpO1xyXG5cclxuXHRcdFx0XHRcdG5ld1Bvc3RzID0gY29udGFpbmVyLmNoaWxkcmVuKCcuYWpheC1uZXcnKTtcclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgcGFnZSBudW1iZXIgYW5kIG5leHRVcmxcclxuXHRcdFx0XHRcdGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcclxuXHRcdFx0XHRcdFx0XHRwYWdlTnVtLS07XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cGFnZU51bSsrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL2NvbW1lbnQtcGFnZS1bMC05XT8vLCAnL2NvbW1lbnQtcGFnZS0nICsgcGFnZU51bSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRwYWdlTnVtKys7XHJcblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL3BhZ2VcXC9bMC05XT8vLCAnL3BhZ2UvJyArIHBhZ2VOdW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGJ1dHRvbiBzdGF0ZVxyXG5cdFx0XHRcdFx0aWYgKCBwYWdlTnVtIDw9IHBhZ2VNYXggJiYgcGFnZU51bSA+IDAgKSB7IGFqYXhCdG4uYnV0dG9uKCdyZXNldCcpOyB9XHJcblx0XHRcdFx0XHRlbHNlIHsgYWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7IH1cclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgbGF5b3V0IG9uY2UgcG9zdHMgaGF2ZSBsb2FkZWRcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRuZXdQb3N0cy5yZW1vdmVDbGFzcygnYWpheC1uZXcnKTtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XHJcblx0XHRcdFx0XHRcdFx0aWZyYW1lQXNwZWN0KCk7XHJcblx0XHRcdFx0XHRcdFx0cG9zdHNQYWdlKCk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmlzb3RvcGUoJ2FwcGVuZGVkJywgbmV3UG9zdHMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHZpZXdwb3J0LnRyaWdnZXIoJ3JlZnJlc2gnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSwgMTAwKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgKSB7IHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTsgfVxyXG5cclxuXHRcdFx0XHRcdC8vIEhhbmRsZSBFcnJvcnNcclxuXHRcdFx0XHRcdGlmICggc3RhdHVzID09ICdlcnJvcicgKSB7XHJcblx0XHRcdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0XHQvLyBEZWJ1Z2dpbmcgaW5mb1xyXG5cdFx0XHRcdFx0XHQvLyBhbGVydCgnQUpBWCBFcnJvcjogJyArIHhoci5zdGF0dXMgKyAnICcgKyB4aHIuc3RhdHVzVGV4dCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBUcmlnZ2VyIEFKQVggbG9hZCB3aGVuIHJlYWNoaW5nIGJvdHRvbSBvZiBwYWdlXHJcblx0XHR2YXIgYWpheFNjcm9sbEhhbmRsZSA9ICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0LyogZ2xvYmFsIGVsZW1WaXNpYmxlICovXHJcblx0XHRcdFx0aWYgKCBlbGVtVmlzaWJsZShhamF4QnRuLCB2aWV3cG9ydCkgPT09IHRydWUgKSB7XHJcblx0XHRcdFx0XHRhamF4QnRuLnRyaWdnZXIoJ2NvbnQ6Ym90dG9tJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyApIHtcclxuXHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyBFeGVjdXRlIEZ1bmN0aW9uIFdoZXJlIEFwcGxpY2FibGVcclxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Bvc3RzLXBhZ2UnXSAmJiBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaG9wJyApIHtcclxuXHRcdFx0bWl4dEFqYXhMb2FkKCdzaG9wJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtaXh0QWpheExvYWQoJ3Bvc3RzJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ3NpbmdsZScgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcclxuXHRcdG1peHRBamF4TG9hZCgnY29tbWVudHMnKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIFdpbmRvdyBSZXNpemVcclxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcclxuXHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cdH1cclxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgcmVzaXplRm4gKSk7XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIExvYWRcclxuXHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRwb3N0c1BhZ2UoKTtcclxuXHJcblx0XHQvLyBJc290b3BlIE1hc29ucnkgSW5pdFxyXG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIGJsb2dDb250ID0gJCgnLmJsb2ctbWFzb25yeSAucG9zdHMtY29udGFpbmVyJyk7XHJcblxyXG5cdFx0XHRibG9nQ29udC5pc290b3BlKHtcclxuXHRcdFx0XHRpdGVtU2VsZWN0b3I6ICcuYXJ0aWNsZScsXHJcblx0XHRcdFx0bGF5b3V0OiAnbWFzb25yeScsXHJcblx0XHRcdFx0Z3V0dGVyOiAwXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0YmxvZ0NvbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0pO1xyXG5cdFx0XHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7IGJsb2dDb250Lmlzb3RvcGUoJ2xheW91dCcpOyB9ICkpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBUcmlnZ2VyIExpZ2h0Ym94IE9uIEZlYXR1cmVkIEltYWdlIENsaWNrXHJcblx0XHQkKCcubGlnaHRib3gtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLnNpYmxpbmdzKCcuZ2FsbGVyeScpLmZpbmQoJ2xpJykuZmlyc3QoKS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8vIFJlbGF0ZWQgUG9zdHMgU2xpZGVyXHJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHR2YXIgcmVsUG9zdHNTbGlkZXIgPSAkKCcucG9zdC1yZWxhdGVkIC5zbGlkZXItY29udCcpO1xyXG5cdFx0XHRyZWxQb3N0c1NsaWRlci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmxpZ2h0U2xpZGVyKHtcclxuXHRcdFx0XHRcdGl0ZW06IDMsXHJcblx0XHRcdFx0XHRwYWdlcjogZmFsc2UsXHJcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcclxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAyMCxcclxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFt7XHJcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDk2MCxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogMyB9XHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDU0MCxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHsgaXRlbTogMiB9XHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oZWwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHQkKCcucG9zdC1mZWF0JywgcmVsUG9zdHNTbGlkZXIpLm1hdGNoSGVpZ2h0KCk7XHJcblx0XHRcdFx0XHRcdFx0cmVsUG9zdHNTbGlkZXIuY3NzKCdoZWlnaHQnLCAnJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59KGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcblVJIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0ICovXHJcblxyXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KSxcclxuXHRcdGh0bWxFbCAgID0gJCgnaHRtbCcpLFxyXG5cdFx0Ym9keUVsICAgPSAkKCdib2R5Jyk7XHJcblxyXG5cclxuXHQvLyBTcGlubmVyIElucHV0XHJcblx0JCgnLm1peHQtc3Bpbm5lcicpLm9uKCdjbGljaycsICcuYnRuJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgJGVsICAgICA9ICQodGhpcyksXHJcblx0XHRcdHNwaW5uZXIgPSAkZWwucGFyZW50cygnLm1peHQtc3Bpbm5lcicpLFxyXG5cdFx0XHRpbnB1dCAgID0gc3Bpbm5lci5jaGlsZHJlbignLnNwaW5uZXItdmFsJyksXHJcblx0XHRcdHN0ZXAgICAgPSBpbnB1dC5hdHRyKCdzdGVwJykgfHwgMSxcclxuXHRcdFx0bWluVmFsICA9IGlucHV0LmF0dHIoJ21pbicpIHx8IDAsXHJcblx0XHRcdG1heFZhbCAgPSBpbnB1dC5hdHRyKCdtYXgnKSB8fCBudWxsLFxyXG5cdFx0XHR2YWwgICAgID0gaW5wdXQudmFsKCksXHJcblx0XHRcdG5ld1ZhbDtcclxuXHRcdGlmICggaXNOYU4odmFsKSApIHZhbCA9IG1pblZhbDtcclxuXHRcdFxyXG5cdFx0aWYgKCAkZWwuaGFzQ2xhc3MoJ21pbnVzJykgKSB7XHJcblx0XHRcdC8vIERlY3JlYXNlXHJcblx0XHRcdG5ld1ZhbCA9IHBhcnNlRmxvYXQodmFsKSAtIHBhcnNlRmxvYXQoc3RlcCk7XHJcblx0XHRcdGlmICggbmV3VmFsIDwgbWluVmFsICkgbmV3VmFsID0gbWluVmFsO1xyXG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIEluY3JlYXNlXHJcblx0XHRcdG5ld1ZhbCA9IHBhcnNlRmxvYXQodmFsKSArIHBhcnNlRmxvYXQoc3RlcCk7XHJcblx0XHRcdGlmICggbWF4VmFsICE9PSBudWxsICYmIG5ld1ZhbCA+IG1heFZhbCApIG5ld1ZhbCA9IG1heFZhbDtcclxuXHRcdFx0aW5wdXQudmFsKG5ld1ZhbCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBDb250ZW50IEZpbHRlcmluZ1xyXG5cdCQoJy5jb250ZW50LWZpbHRlci1saW5rcycpLmNoaWxkcmVuKCkuY2xpY2soIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxpbmsgPSAkKHRoaXMpLFxyXG5cdFx0XHRmaWx0ZXIgPSBsaW5rLmRhdGEoJ2ZpbHRlcicpLFxyXG5cdFx0XHRjb250ZW50ID0gJCgnLicgKyBsaW5rLnBhcmVudHMoJy5jb250ZW50LWZpbHRlci1saW5rcycpLmRhdGEoJ2NvbnRlbnQnKSksXHJcblx0XHRcdGZpbHRlckNsYXNzID0gJ2ZpbHRlci1oaWRkZW4nO1xyXG5cdFx0bGluay5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRpZiAoIGZpbHRlciA9PSAnYWxsJyApIHsgY29udGVudC5maW5kKCcuJytmaWx0ZXJDbGFzcykucmVtb3ZlQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlRG93big2MDApOyB9XHJcblx0XHRlbHNlIHsgY29udGVudC5maW5kKCcuJyArIGZpbHRlcikucmVtb3ZlQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlRG93big2MDApLnNpYmxpbmdzKCc6bm90KC4nK2ZpbHRlcisnKScpLmFkZENsYXNzKGZpbHRlckNsYXNzKS5zbGlkZVVwKDYwMCk7IH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIFNvcnQgcG9ydGZvbGlvIGl0ZW1zXHJcblx0JCgnLnBvcnRmb2xpby1zb3J0ZXIgYScpLmNsaWNrKCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBlbGVtID0gJCh0aGlzKSxcclxuXHRcdFx0dGFyZ2V0VGFnID0gZWxlbS5kYXRhKCdzb3J0JyksXHJcblx0XHRcdHRhcmdldENvbnRhaW5lciA9ICQoJy5wb3N0cy1jb250YWluZXInKTtcclxuXHJcblx0XHRlbGVtLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyAmJiB0eXBlb2YgJC5mbi5pc290b3BlID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRpZiAodGFyZ2V0VGFnID09ICdhbGwnKSB7XHJcblx0XHRcdFx0dGFyZ2V0Q29udGFpbmVyLmlzb3RvcGUoeyBmaWx0ZXI6ICcqJyB9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0YXJnZXRDb250YWluZXIuaXNvdG9wZSh7IGZpbHRlcjogJy4nICsgdGFyZ2V0VGFnIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcHJvamVjdHMgPSB0YXJnZXRDb250YWluZXIuY2hpbGRyZW4oJy5wb3J0Zm9saW8nKTtcclxuXHRcdFx0aWYgKCB0YXJnZXRUYWcgPT0gJ2FsbCcgKSB7XHJcblx0XHRcdFx0cHJvamVjdHMuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2ZpbHRlcmVkJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cHJvamVjdHMuZmFkZU91dCgwKS5yZW1vdmVDbGFzcygnZmlsdGVyZWQnKS5maWx0ZXIoJy4nICsgdGFyZ2V0VGFnKS5mYWRlSW4oMzAwKS5hZGRDbGFzcygnZmlsdGVyZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gT2Zmc2V0IHNjcm9sbGluZyB0byBsaW5rIGFuY2hvciAoaGFzaClcclxuXHQkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcclxuXHRcdFx0aGFzaCA9IGxpbmsuYXR0cignaHJlZicpO1xyXG5cclxuXHRcdGlmICggbGluay5kYXRhKCduby1oYXNoLXNjcm9sbCcpICkgcmV0dXJuO1xyXG5cclxuXHRcdGlmICggaGFzaC5sZW5ndGggKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIHRhcmdldCA9ICQoaGFzaCk7XHJcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCkge1xyXG5cdFx0XHRcdC8qIGdsb2JhbCBicmVha3BvaW50ICovXHJcblx0XHRcdFx0dmFyIGhhc2hPZmZzZXQgPSAkKGhhc2gpLm9mZnNldCgpLnRvcDtcclxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgYnJlYWtwb2ludC5uYW1lICE9ICdwbHV0bycgJiYgYnJlYWtwb2ludC5uYW1lICE9ICdtZXJjdXJ5JyApIHsgaGFzaE9mZnNldCAtPSAkKCcjbWFpbi1uYXYnKS5vdXRlckhlaWdodCgpOyB9XHJcblx0XHRcdFx0aHRtbEVsLmFkZChib2R5RWwpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IGhhc2hPZmZzZXQgfSwgNjAwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Ly8gSWdub3JlIHNwZWNpZmljIGFuY2hvcnNcclxuXHQkKCcudGFicyBhLCAudmNfdHRhIGEnKS5hdHRyKCdkYXRhLW5vLWhhc2gtc2Nyb2xsJywgdHJ1ZSk7XHJcblxyXG5cclxuXHQvLyBTb2NpYWwgSWNvbnNcclxuXHQkKCcuc29jaWFsLWxpbmtzJykubm90KCcuaG92ZXItbm9uZScpLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNvbnQgPSAkKHRoaXMpO1xyXG5cclxuXHRcdGNvbnQuY2hpbGRyZW4oKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGljb24gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGxpbmsgPSBpY29uLmNoaWxkcmVuKCdhJyksXHJcblx0XHRcdFx0ZGF0YUNvbG9yID0gbGluay5hdHRyKCdkYXRhLWNvbG9yJyk7XHJcblxyXG5cdFx0XHRpZiAoIGNvbnQuaGFzQ2xhc3MoJ2hvdmVyLWJnJykgKSB7XHJcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoIGNvbnQucGFyZW50cygnLnBvc2l0aW9uLXRvcCcpLmxlbmd0aCA9PT0gMCAmJiBjb250LnBhcmVudHMoJy5uby1ob3Zlci1iZycpLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHRcdFx0bGluay5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6IGRhdGFDb2xvciwgYm9yZGVyQ29sb3I6IGRhdGFDb2xvciwgekluZGV4OiAxIH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCkgeyBsaW5rLmNzcyh7IGJhY2tncm91bmRDb2xvcjogJycsIGJvcmRlckNvbG9yOiAnJywgekluZGV4OiAnJyB9KTsgfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoIGNvbnQucGFyZW50cygnLm5hdmJhci5wb3NpdGlvbi10b3AnKS5sZW5ndGggPT09IDAgKSB7XHJcblx0XHRcdFx0XHRcdGxpbmsuY3NzKHsgY29sb3I6IGRhdGFDb2xvciwgekluZGV4OiAxIH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCkgeyBsaW5rLmNzcyh7IGNvbG9yOiAnJywgekluZGV4OiAnJyB9KTsgfSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gRnVuY3Rpb25zIHJ1biBvbiBwYWdlIGxvYWQgYW5kIFwicmVmcmVzaFwiIGV2ZW50XHJcblx0ZnVuY3Rpb24gcnVuT25SZWZyZXNoKCkge1xyXG5cdFx0Ly8gVG9vbHRpcHMgSW5pdFxyXG5cdFx0JCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXSwgLnJlbGF0ZWQtdGl0bGUtdGlwJykudG9vbHRpcCh7XHJcblx0XHRcdHBsYWNlbWVudDogJ2F1dG8nLFxyXG5cdFx0XHRjb250YWluZXI6ICdib2R5J1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8vIE9uIEhvdmVyIEFuaW1hdGlvbnMgSW5pdFxyXG5cdFx0dmFyIGFuaW1Ib3ZlckVsID0gJCgnLmFuaW0tb24taG92ZXInKTtcclxuXHRcdGFuaW1Ib3ZlckVsLmhvdmVySW50ZW50KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaG92ZXJlZCcpO1xyXG5cdFx0XHR2YXIgaW5uZXIgICA9ICQodGhpcykuY2hpbGRyZW4oJy5vbi1ob3ZlcicpLFxyXG5cdFx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXHJcblx0XHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xyXG5cdFx0XHRpbm5lci5yZW1vdmVDbGFzcyhhbmltT3V0KS5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1Jbik7XHJcblx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaG92ZXJlZCcpO1xyXG5cdFx0XHR2YXIgaW5uZXIgICA9ICQodGhpcykuY2hpbGRyZW4oJy5vbi1ob3ZlcicpLFxyXG5cdFx0XHRcdGFuaW1JbiAgPSBpbm5lci5kYXRhKCdhbmltLWluJykgfHwgJ2ZhZGVJbicsXHJcblx0XHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xyXG5cdFx0XHRpbm5lci5yZW1vdmVDbGFzcyhhbmltSW4pLmFkZENsYXNzKGFuaW1PdXQpO1xyXG5cdFx0fSwgMzAwKTtcclxuXHRcdGFuaW1Ib3ZlckVsLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgTVNBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCAhICQodGhpcykuaGFzQ2xhc3MoJ2hvdmVyZWQnKSApIHtcclxuXHRcdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHZpZXdwb3J0Lm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XHJcblx0XHRydW5PblJlZnJlc2goKTtcclxuXHR9KS50cmlnZ2VyKCdyZWZyZXNoJyk7XHJcblxyXG5cclxuXHQvLyBCYWNrIFRvIFRvcCBCdXR0b25cclxuXHRmdW5jdGlvbiBiYWNrVG9Ub3BEaXNwbGF5KCkge1xyXG5cdFx0dmFyIHNjcm9sbFRvcCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpO1xyXG5cdFx0aWYgKCBzY3JvbGxUb3AgPiAyMDAgKSB7XHJcblx0XHRcdGJhY2tUb1RvcC5mYWRlSW4oMzAwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGJhY2tUb1RvcC5mYWRlT3V0KDMwMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgYmFja1RvVG9wID0gJCgnI2JhY2stdG8tdG9wJyk7XHJcblxyXG5cdGlmICggYmFja1RvVG9wLmxlbmd0aCApIHtcclxuXHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCAkLnRocm90dGxlKCAxMDAwLCBiYWNrVG9Ub3BEaXNwbGF5ICkpLnNjcm9sbCgpO1xyXG5cclxuXHRcdGJhY2tUb1RvcC5jbGljayggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDYwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KGpRdWVyeSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
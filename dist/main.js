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
/*! modernizr 3.0.0-alpha.4 (Custom Build) | MIT *
 * http://modernizr.com/download/#-flexbox-shiv !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,a,i,s;for(var l in C){if(e=[],t=C[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,a=0;a<e.length;a++)i=e[a],s=i.split("."),1===s.length?Modernizr[s[0]]=o:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=o),y.push((o?"":"no-")+s.join("-"))}}function a(e){var t=S.className,n=Modernizr._config.classPrefix||"";if(b&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),b?S.className.baseVal=t:S.className=t)}function i(e,t){return!!~(""+e).indexOf(t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):b?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function c(e,t){return function(){return e.apply(t,arguments)}}function u(e,t,n){var o;for(var a in e)if(e[a]in t)return n===!1?e[a]:(o=t[e[a]],r(o,"function")?c(o,n||t):o);return!1}function f(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(){var e=t.body;return e||(e=s(b?"svg":"body"),e.fake=!0),e}function p(e,n,r,o){var a,i,l,c,u="modernizr",f=s("div"),p=d();if(parseInt(r,10))for(;r--;)l=s("div"),l.id=o?o[r]:u+(r+1),f.appendChild(l);return a=s("style"),a.type="text/css",a.id="s"+u,(p.fake?p:f).appendChild(a),p.appendChild(f),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),f.id=u,p.fake&&(p.style.background="",p.style.overflow="hidden",c=S.style.overflow,S.style.overflow="hidden",S.appendChild(p)),i=n(f,e),p.fake?(p.parentNode.removeChild(p),S.style.overflow=c,S.offsetHeight):f.parentNode.removeChild(f),!!i}function m(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(f(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var a=[];o--;)a.push("("+f(t[o])+":"+r+")");return a=a.join(" or "),p("@supports ("+a+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function h(e,t,o,a){function c(){f&&(delete j.style,delete j.modElem)}if(a=r(a,"undefined")?!1:a,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var f,d,p,h,g,v=["modernizr","tspan"];!j.style;)f=!0,j.modElem=s(v.shift()),j.style=j.modElem.style;for(p=e.length,d=0;p>d;d++)if(h=e[d],g=j.style[h],i(h,"-")&&(h=l(h)),j.style[h]!==n){if(a||r(o,"undefined"))return c(),"pfx"==t?h:!0;try{j.style[h]=o}catch(y){}if(j.style[h]!=g)return c(),"pfx"==t?h:!0}return c(),!1}function g(e,t,n,o,a){var i=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+w.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?h(s,t,o,a):(s=(e+" "+_.join(i+" ")+i).split(" "),u(s,t,n))}function v(e,t,r){return g(e,n,n,t,r)}var y=[],C=[],E={_version:"3.0.0-alpha.4",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){C.push({name:e,fn:t,options:n})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=E,Modernizr=new Modernizr;var S=t.documentElement,b="svg"===S.nodeName.toLowerCase();b||!function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=C.elements;return"string"==typeof e?e.split(" "):e}function o(e,t){var n=C.elements;"string"!=typeof n&&(n=n.join(" ")),"string"!=typeof e&&(e=e.join(" ")),C.elements=n+" "+e,c(t)}function a(e){var t=y[e[g]];return t||(t={},v++,e[g]=v,y[v]=t),t}function i(e,n,r){if(n||(n=t),f)return n.createElement(e);r||(r=a(n));var o;return o=r.cache[e]?r.cache[e].cloneNode():h.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!o.canHaveChildren||m.test(e)||o.tagUrn?o:r.frag.appendChild(o)}function s(e,n){if(e||(e=t),f)return e.createDocumentFragment();n=n||a(e);for(var o=n.frag.cloneNode(),i=0,s=r(),l=s.length;l>i;i++)o.createElement(s[i]);return o}function l(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return C.shivMethods?i(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-:]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(C,t.frag)}function c(e){e||(e=t);var r=a(e);return!C.shivCSS||u||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),f||l(e,r),e}var u,f,d="3.7.2",p=e.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g="_html5shiv",v=0,y={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",u="hidden"in e,f=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){u=!0,f=!0}}();var C={elements:p.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:d,shivCSS:p.shivCSS!==!1,supportsUnknownElements:f,shivMethods:p.shivMethods!==!1,type:"default",shivDocument:c,createElement:i,createDocumentFragment:s,addElements:o};e.html5=C,c(t)}(this,t);var x="Moz O ms Webkit",w=E._config.usePrefixes?x.split(" "):[];E._cssomPrefixes=w;var _=E._config.usePrefixes?x.toLowerCase().split(" "):[];E._domPrefixes=_;var N={elem:s("modernizr")};Modernizr._q.push(function(){delete N.elem});var j={style:N.elem.style};Modernizr._q.unshift(function(){delete j.style}),E.testAllProps=g,E.testAllProps=v,Modernizr.addTest("flexbox",v("flexBasis","1px",!0)),o(),a(y),delete E.addTest,delete E.addAsyncTest;for(var k=0;k<Modernizr._q.length;k++)Modernizr._q[k]();e.Modernizr=Modernizr}(window,document);

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
		var container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = mainNav.outerHeight(),
			wrapHeight   = mediaWrap.height(),
			viewHeight   = viewport.height() - mediaWrap.offset().top;

		// Make header fullscreen
		if ( mixt_opt.header.fullscreen ) {
			var fullHeight = viewHeight;

			mediaWrap.css('height', wrapHeight);

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) {
				fullHeight -= topNavHeight;
			}

			mediaWrap.css('height', fullHeight);
			mediaCont.css('height', fullHeight);
		}

		// Add padding behind transparent navbar to prevent overlapping
		if ( mixt_opt.nav.transparent && mediaCont.length == 1 ) {
			var containerPad = topNavHeight;

			if ( mixt_opt.nav.position == 'below' ) {
				container.css('padding-bottom', containerPad);
			} else {
				container.css('padding-top', containerPad);
			}
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
					navSheet.append('.navbar.navbar-mixt:not(.position-top) { background-color: '+colorToRgba(bgColor, mixt_opt.nav.opacity)+'; }');
				}

				if ( mixt_opt.nav.transparent && mixt_opt.header.enabled ) {
					navSheet.append('.nav-transparent .navbar.navbar-mixt.position-top { background-color: '+colorToRgba(bgColor, mixt_opt.nav['top-opacity'])+'; }');
					
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

				if ( isMobile === false ) {
					viewport.on('scroll', $.throttle(50, Navbar.sticky.toggle));
				} else {
					viewport.off('scroll', Navbar.sticky.toggle);
				}

				if ( mixt_opt.page['show-admin-bar'] ) {
					Navbar.sticky.scrollCorrection += parseFloat(mainWrap.css('padding-top'), 10);
				}

				if ( mixt_opt.nav.layout == 'horizontal' && mixt_opt.nav.transparent && mixt_opt.nav.position == 'below' ) {
					var navHeight = mainNavBar.css('height', '').outerHeight(),
						navPos    = parseInt(mainNavBar.css('top'), 10);
					Navbar.sticky.offset = navHeight;

					if ( navPos === 0 || isNaN(navPos) ) {
						mainNavBar.css('margin-top', (navHeight * -1));
					}
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

						if ( (nestOff + maxNestW) >= bodyEl.width() ) {
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

				// Show/hide submenus on handle click
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
						navbarMg      = 0,
						navbarTop     = mainNavBar.offset().top,
						navwrapTop    = mainNavWrap.offset().top;

					Navbar.mobile.scrollPos = viewport.scrollTop();

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
						viewport.on('scroll', Navbar.mobile.stopScroll);
						if ( mainNavBar.not('stopped') ) {
							mainNavBar.addClass('stopped').css({ 'position': 'absolute', 'top': (navbarTop - navwrapTop), 'margin-top': '0' });
						}
					} else {
						viewport.off('scroll', Navbar.mobile.stopScroll);
						mainNavBar.css({ 'position': '', 'top': '', 'margin-top': navbarMg }).removeClass('stopped');
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


	// Handle navbar items overlap
	function navbarOverlap() {
		var mqNav = mqCheck(),
			mainNavLogoCls = 'logo-' + mainNavWrap.attr('data-logo-align');

		// Primary Navbar
		if ( mainNavLogoCls != 'logo-center' && mixt_opt.nav.layout == 'horizontal' ) {
			mainNavWrap.removeClass('logo-center').addClass(mainNavLogoCls);
			if ( mqNav == 'desktop' ) {
				var mainNavContWidth = mainNavCont.width(),
					mainNavItemsWidth = mainNavHead.outerWidth(true) + $('#main-menu').outerWidth(true);
				if ( mainNavItemsWidth > mainNavContWidth ) {
					mainNavWrap.removeClass(mainNavLogoCls).addClass('logo-center');
				}
			}
		}

		// Secondary Navbar
		if ( secNavBar.length ) {
			secNavBar.removeClass('items-overlap');
			var secNavContWidth = secNavCont.innerWidth(),
				secNavItemsWidth = $('.left-content', secNavBar).outerWidth(true) + $('.right-content', secNavBar).outerWidth(true);
			if ( secNavItemsWidth > secNavContWidth ) {
				secNavBar.addClass('items-overlap');
			}
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
			mainNavBar.css('height', '');
			mainWrap.addClass('nav-full').removeClass('nav-mini');

			navbars.each( function() {
				Navbar.menu.megaMenuToggle('enable', $(this));
			});

			menuParents.on('touchstart', menuTouchHover);
			bodyEl.on('touchstart', menuTouchRemoveHover);
		} else if ( mqNav == 'mobile' || mqNav == 'tablet' ) {
			Navbar.mobile.trigger(mqNav);

			var navHeight = mainNavHead.outerHeight() + 1;
			mainNavBar.css('height', navHeight);
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

})(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbE1BO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZSAtIHYxLjEgLSAzLzcvMjAxMFxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW5cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuICovXG5cbi8vIFNjcmlwdDogalF1ZXJ5IHRocm90dGxlIC8gZGVib3VuY2U6IFNvbWV0aW1lcywgbGVzcyBpcyBtb3JlIVxuLy9cbi8vICpWZXJzaW9uOiAxLjEsIExhc3QgdXBkYXRlZDogMy83LzIwMTAqXG4vLyBcbi8vIFByb2plY3QgSG9tZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlLXBsdWdpbi9cbi8vIEdpdEh1YiAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvXG4vLyBTb3VyY2UgICAgICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLmpzXG4vLyAoTWluaWZpZWQpICAgLSBodHRwOi8vZ2l0aHViLmNvbS9jb3dib3kvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3Jhdy9tYXN0ZXIvanF1ZXJ5LmJhLXRocm90dGxlLWRlYm91bmNlLm1pbi5qcyAoMC43a2IpXG4vLyBcbi8vIEFib3V0OiBMaWNlbnNlXG4vLyBcbi8vIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hbixcbi8vIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuLy8gaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuLy8gXG4vLyBBYm91dDogRXhhbXBsZXNcbi8vIFxuLy8gVGhlc2Ugd29ya2luZyBleGFtcGxlcywgY29tcGxldGUgd2l0aCBmdWxseSBjb21tZW50ZWQgY29kZSwgaWxsdXN0cmF0ZSBhIGZld1xuLy8gd2F5cyBpbiB3aGljaCB0aGlzIHBsdWdpbiBjYW4gYmUgdXNlZC5cbi8vIFxuLy8gVGhyb3R0bGUgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL3Rocm90dGxlL1xuLy8gRGVib3VuY2UgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL2V4YW1wbGVzL2RlYm91bmNlL1xuLy8gXG4vLyBBYm91dDogU3VwcG9ydCBhbmQgVGVzdGluZ1xuLy8gXG4vLyBJbmZvcm1hdGlvbiBhYm91dCB3aGF0IHZlcnNpb24gb3IgdmVyc2lvbnMgb2YgalF1ZXJ5IHRoaXMgcGx1Z2luIGhhcyBiZWVuXG4vLyB0ZXN0ZWQgd2l0aCwgd2hhdCBicm93c2VycyBpdCBoYXMgYmVlbiB0ZXN0ZWQgaW4sIGFuZCB3aGVyZSB0aGUgdW5pdCB0ZXN0c1xuLy8gcmVzaWRlIChzbyB5b3UgY2FuIHRlc3QgaXQgeW91cnNlbGYpLlxuLy8gXG4vLyBqUXVlcnkgVmVyc2lvbnMgLSBub25lLCAxLjMuMiwgMS40LjJcbi8vIEJyb3dzZXJzIFRlc3RlZCAtIEludGVybmV0IEV4cGxvcmVyIDYtOCwgRmlyZWZveCAyLTMuNiwgU2FmYXJpIDMtNCwgQ2hyb21lIDQtNSwgT3BlcmEgOS42LTEwLjEuXG4vLyBVbml0IFRlc3RzICAgICAgLSBodHRwOi8vYmVuYWxtYW4uY29tL2NvZGUvcHJvamVjdHMvanF1ZXJ5LXRocm90dGxlLWRlYm91bmNlL3VuaXQvXG4vLyBcbi8vIEFib3V0OiBSZWxlYXNlIEhpc3Rvcnlcbi8vIFxuLy8gMS4xIC0gKDMvNy8yMDEwKSBGaXhlZCBhIGJ1ZyBpbiA8alF1ZXJ5LnRocm90dGxlPiB3aGVyZSB0cmFpbGluZyBjYWxsYmFja3Ncbi8vICAgICAgIGV4ZWN1dGVkIGxhdGVyIHRoYW4gdGhleSBzaG91bGQuIFJld29ya2VkIGEgZmFpciBhbW91bnQgb2YgaW50ZXJuYWxcbi8vICAgICAgIGxvZ2ljIGFzIHdlbGwuXG4vLyAxLjAgLSAoMy82LzIwMTApIEluaXRpYWwgcmVsZWFzZSBhcyBhIHN0YW5kLWFsb25lIHByb2plY3QuIE1pZ3JhdGVkIG92ZXJcbi8vICAgICAgIGZyb20ganF1ZXJ5LW1pc2MgcmVwbyB2MC40IHRvIGpxdWVyeS10aHJvdHRsZSByZXBvIHYxLjAsIGFkZGVkIHRoZVxuLy8gICAgICAgbm9fdHJhaWxpbmcgdGhyb3R0bGUgcGFyYW1ldGVyIGFuZCBkZWJvdW5jZSBmdW5jdGlvbmFsaXR5LlxuLy8gXG4vLyBUb3BpYzogTm90ZSBmb3Igbm9uLWpRdWVyeSB1c2Vyc1xuLy8gXG4vLyBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBiZWNhdXNlIG5vdGhpbmcgaW50ZXJuYWxcbi8vIHVzZXMgYW55IGpRdWVyeSBtZXRob2RzIG9yIHByb3BlcnRpZXMuIGpRdWVyeSBpcyBqdXN0IHVzZWQgYXMgYSBuYW1lc3BhY2Vcbi8vIHVuZGVyIHdoaWNoIHRoZXNlIG1ldGhvZHMgY2FuIGV4aXN0LlxuLy8gXG4vLyBTaW5jZSBqUXVlcnkgaXNuJ3QgYWN0dWFsbHkgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCBpZiBqUXVlcnkgZG9lc24ndCBleGlzdFxuLy8gd2hlbiB0aGlzIHBsdWdpbiBpcyBsb2FkZWQsIHRoZSBtZXRob2QgZGVzY3JpYmVkIGJlbG93IHdpbGwgYmUgY3JlYXRlZCBpblxuLy8gdGhlIGBDb3dib3lgIG5hbWVzcGFjZS4gVXNhZ2Ugd2lsbCBiZSBleGFjdGx5IHRoZSBzYW1lLCBidXQgaW5zdGVhZCBvZlxuLy8gJC5tZXRob2QoKSBvciBqUXVlcnkubWV0aG9kKCksIHlvdSdsbCBuZWVkIHRvIHVzZSBDb3dib3kubWV0aG9kKCkuXG5cbihmdW5jdGlvbih3aW5kb3csdW5kZWZpbmVkKXtcbiAgJyQ6bm9tdW5nZSc7IC8vIFVzZWQgYnkgWVVJIGNvbXByZXNzb3IuXG4gIFxuICAvLyBTaW5jZSBqUXVlcnkgcmVhbGx5IGlzbid0IHJlcXVpcmVkIGZvciB0aGlzIHBsdWdpbiwgdXNlIGBqUXVlcnlgIGFzIHRoZVxuICAvLyBuYW1lc3BhY2Ugb25seSBpZiBpdCBhbHJlYWR5IGV4aXN0cywgb3RoZXJ3aXNlIHVzZSB0aGUgYENvd2JveWAgbmFtZXNwYWNlLFxuICAvLyBjcmVhdGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gIHZhciAkID0gd2luZG93LmpRdWVyeSB8fCB3aW5kb3cuQ293Ym95IHx8ICggd2luZG93LkNvd2JveSA9IHt9ICksXG4gICAgXG4gICAgLy8gSW50ZXJuYWwgbWV0aG9kIHJlZmVyZW5jZS5cbiAgICBqcV90aHJvdHRsZTtcbiAgXG4gIC8vIE1ldGhvZDogalF1ZXJ5LnRocm90dGxlXG4gIC8vIFxuICAvLyBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcbiAgLy8gZXhlY3V0aW9uIG9mIGhhbmRsZXJzIG9uIGV2ZW50cyBsaWtlIHJlc2l6ZSBhbmQgc2Nyb2xsLiBJZiB5b3Ugd2FudCB0b1xuICAvLyByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uIHRvIGEgc2luZ2xlIHRpbWUsIHNlZSB0aGVcbiAgLy8gPGpRdWVyeS5kZWJvdW5jZT4gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IFRocm90dGxlZCB3aXRoIGBub190cmFpbGluZ2Agc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgIFggICAgICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICBYXG4gIC8vID4gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgICAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gXG4gIC8vIFVzYWdlOlxuICAvLyBcbiAgLy8gPiB2YXIgdGhyb3R0bGVkID0galF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApO1xuICAvLyA+IFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIHRocm90dGxlZCApO1xuICAvLyBcbiAgLy8gVGhpcyBhbHNvIHdvcmtzIGluIGpRdWVyeSAxLjQrOlxuICAvLyBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGpRdWVyeS50aHJvdHRsZSggZGVsYXksIFsgbm9fdHJhaWxpbmcsIF0gY2FsbGJhY2sgKSApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBjYWxsYmFjayApO1xuICAvLyBcbiAgLy8gQXJndW1lbnRzOlxuICAvLyBcbiAgLy8gIGRlbGF5IC0gKE51bWJlcikgQSB6ZXJvLW9yLWdyZWF0ZXIgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLiBGb3IgZXZlbnRcbiAgLy8gICAgY2FsbGJhY2tzLCB2YWx1ZXMgYXJvdW5kIDEwMCBvciAyNTAgKG9yIGV2ZW4gaGlnaGVyKSBhcmUgbW9zdCB1c2VmdWwuXG4gIC8vICBub190cmFpbGluZyAtIChCb29sZWFuKSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vX3RyYWlsaW5nIGlzXG4gIC8vICAgIHRydWUsIGNhbGxiYWNrIHdpbGwgb25seSBleGVjdXRlIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIHdoaWxlIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgYmVpbmcgY2FsbGVkLiBJZiBub190cmFpbGluZyBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbmUgZmluYWwgdGltZSBhZnRlciB0aGUgbGFzdFxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuXG4gIC8vICAgIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZSBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSB0aHJvdHRsZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIHRocm90dGxlZCwgZnVuY3Rpb24uXG4gIFxuICAkLnRocm90dGxlID0ganFfdGhyb3R0bGUgPSBmdW5jdGlvbiggZGVsYXksIG5vX3RyYWlsaW5nLCBjYWxsYmFjaywgZGVib3VuY2VfbW9kZSApIHtcbiAgICAvLyBBZnRlciB3cmFwcGVyIGhhcyBzdG9wcGVkIGJlaW5nIGNhbGxlZCwgdGhpcyB0aW1lb3V0IGVuc3VyZXMgdGhhdFxuICAgIC8vIGBjYWxsYmFja2AgaXMgZXhlY3V0ZWQgYXQgdGhlIHByb3BlciB0aW1lcyBpbiBgdGhyb3R0bGVgIGFuZCBgZW5kYFxuICAgIC8vIGRlYm91bmNlIG1vZGVzLlxuICAgIHZhciB0aW1lb3V0X2lkLFxuICAgICAgXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHRpbWUgYGNhbGxiYWNrYCB3YXMgZXhlY3V0ZWQuXG4gICAgICBsYXN0X2V4ZWMgPSAwO1xuICAgIFxuICAgIC8vIGBub190cmFpbGluZ2AgZGVmYXVsdHMgdG8gZmFsc3kuXG4gICAgaWYgKCB0eXBlb2Ygbm9fdHJhaWxpbmcgIT09ICdib29sZWFuJyApIHtcbiAgICAgIGRlYm91bmNlX21vZGUgPSBjYWxsYmFjaztcbiAgICAgIGNhbGxiYWNrID0gbm9fdHJhaWxpbmc7XG4gICAgICBub190cmFpbGluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLy8gVGhlIGB3cmFwcGVyYCBmdW5jdGlvbiBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSB0aHJvdHRsaW5nIC8gZGVib3VuY2luZ1xuICAgIC8vIGZ1bmN0aW9uYWxpdHkgYW5kIHdoZW4gZXhlY3V0ZWQgd2lsbCBsaW1pdCB0aGUgcmF0ZSBhdCB3aGljaCBgY2FsbGJhY2tgXG4gICAgLy8gaXMgZXhlY3V0ZWQuXG4gICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgZWxhcHNlZCA9ICtuZXcgRGF0ZSgpIC0gbGFzdF9leGVjLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgXG4gICAgICAvLyBFeGVjdXRlIGBjYWxsYmFja2AgYW5kIHVwZGF0ZSB0aGUgYGxhc3RfZXhlY2AgdGltZXN0YW1wLlxuICAgICAgZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgbGFzdF9leGVjID0gK25ldyBEYXRlKCk7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KCB0aGF0LCBhcmdzICk7XG4gICAgICB9O1xuICAgICAgXG4gICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pIHRoaXMgaXMgdXNlZCB0byBjbGVhciB0aGUgZmxhZ1xuICAgICAgLy8gdG8gYWxsb3cgZnV0dXJlIGBjYWxsYmFja2AgZXhlY3V0aW9ucy5cbiAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aW1lb3V0X2lkID0gdW5kZWZpbmVkO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlICYmICF0aW1lb3V0X2lkICkge1xuICAgICAgICAvLyBTaW5jZSBgd3JhcHBlcmAgaXMgYmVpbmcgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZSBhbmRcbiAgICAgICAgLy8gYGRlYm91bmNlX21vZGVgIGlzIHRydWUgKGF0X2JlZ2luKSwgZXhlY3V0ZSBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIENsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0LlxuICAgICAgdGltZW91dF9pZCAmJiBjbGVhclRpbWVvdXQoIHRpbWVvdXRfaWQgKTtcbiAgICAgIFxuICAgICAgaWYgKCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgJiYgZWxhcHNlZCA+IGRlbGF5ICkge1xuICAgICAgICAvLyBJbiB0aHJvdHRsZSBtb2RlLCBpZiBgZGVsYXlgIHRpbWUgaGFzIGJlZW4gZXhjZWVkZWQsIGV4ZWN1dGVcbiAgICAgICAgLy8gYGNhbGxiYWNrYC5cbiAgICAgICAgZXhlYygpO1xuICAgICAgICBcbiAgICAgIH0gZWxzZSBpZiAoIG5vX3RyYWlsaW5nICE9PSB0cnVlICkge1xuICAgICAgICAvLyBJbiB0cmFpbGluZyB0aHJvdHRsZSBtb2RlLCBzaW5jZSBgZGVsYXlgIHRpbWUgaGFzIG5vdCBiZWVuXG4gICAgICAgIC8vIGV4Y2VlZGVkLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYGRlbGF5YCBtcyBhZnRlciBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBleGVjdXRpb24uXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBJZiBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGVcbiAgICAgICAgLy8gYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0b1xuICAgICAgICAvLyBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gICAgICAgIHRpbWVvdXRfaWQgPSBzZXRUaW1lb3V0KCBkZWJvdW5jZV9tb2RlID8gY2xlYXIgOiBleGVjLCBkZWJvdW5jZV9tb2RlID09PSB1bmRlZmluZWQgPyBkZWxheSAtIGVsYXBzZWQgOiBkZWxheSApO1xuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgLy8gU2V0IHRoZSBndWlkIG9mIGB3cmFwcGVyYCBmdW5jdGlvbiB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbCBjYWxsYmFjaywgc29cbiAgICAvLyBpdCBjYW4gYmUgcmVtb3ZlZCBpbiBqUXVlcnkgMS40KyAudW5iaW5kIG9yIC5kaWUgYnkgdXNpbmcgdGhlIG9yaWdpbmFsXG4gICAgLy8gY2FsbGJhY2sgYXMgYSByZWZlcmVuY2UuXG4gICAgaWYgKCAkLmd1aWQgKSB7XG4gICAgICB3cmFwcGVyLmd1aWQgPSBjYWxsYmFjay5ndWlkID0gY2FsbGJhY2suZ3VpZCB8fCAkLmd1aWQrKztcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9O1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkuZGVib3VuY2VcbiAgLy8gXG4gIC8vIERlYm91bmNlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBEZWJvdW5jaW5nLCB1bmxpa2UgdGhyb3R0bGluZyxcbiAgLy8gZ3VhcmFudGVlcyB0aGF0IGEgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBhIHNpbmdsZSB0aW1lLCBlaXRoZXIgYXQgdGhlXG4gIC8vIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2VyaWVzIG9mIGNhbGxzLCBvciBhdCB0aGUgdmVyeSBlbmQuIElmIHlvdSB3YW50IHRvXG4gIC8vIHNpbXBseSByYXRlLWxpbWl0IGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLCBzZWUgdGhlIDxqUXVlcnkudGhyb3R0bGU+XG4gIC8vIG1ldGhvZC5cbiAgLy8gXG4gIC8vIEluIHRoaXMgdmlzdWFsaXphdGlvbiwgfCBpcyBhIGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsIGFuZCBYIGlzIHRoZSBhY3R1YWxcbiAgLy8gY2FsbGJhY2sgZXhlY3V0aW9uOlxuICAvLyBcbiAgLy8gPiBEZWJvdW5jZWQgd2l0aCBgYXRfYmVnaW5gIHNwZWNpZmllZCBhcyBmYWxzZSBvciB1bnNwZWNpZmllZDpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+ICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyA+IFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIHRydWU6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciBkZWJvdW5jZWQgPSBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgZGVib3VuY2VkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LmRlYm91bmNlKCBkZWxheSwgWyBhdF9iZWdpbiwgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIGF0X2JlZ2luIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYXRfYmVnaW4gaXMgZmFsc2Ugb3JcbiAgLy8gICAgdW5zcGVjaWZpZWQsIGNhbGxiYWNrIHdpbGwgb25seSBiZSBleGVjdXRlZCBgZGVsYXlgIG1pbGxpc2Vjb25kcyBhZnRlclxuICAvLyAgICB0aGUgbGFzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gSWYgYXRfYmVnaW4gaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBiZVxuICAvLyAgICBleGVjdXRlZCBvbmx5IGF0IHRoZSBmaXJzdCBkZWJvdW5jZWQtZnVuY3Rpb24gY2FsbC4gKEFmdGVyIHRoZVxuICAvLyAgICB0aHJvdHRsZWQtZnVuY3Rpb24gaGFzIG5vdCBiZWVuIGNhbGxlZCBmb3IgYGRlbGF5YCBtaWxsaXNlY29uZHMsIHRoZVxuICAvLyAgICBpbnRlcm5hbCBjb3VudGVyIGlzIHJlc2V0KVxuICAvLyAgY2FsbGJhY2sgLSAoRnVuY3Rpb24pIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZGVsYXkgbWlsbGlzZWNvbmRzLlxuICAvLyAgICBUaGUgYHRoaXNgIGNvbnRleHQgYW5kIGFsbCBhcmd1bWVudHMgYXJlIHBhc3NlZCB0aHJvdWdoLCBhcy1pcywgdG9cbiAgLy8gICAgYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gIC8vIFxuICAvLyBSZXR1cm5zOlxuICAvLyBcbiAgLy8gIChGdW5jdGlvbikgQSBuZXcsIGRlYm91bmNlZCwgZnVuY3Rpb24uXG4gIFxuICAkLmRlYm91bmNlID0gZnVuY3Rpb24oIGRlbGF5LCBhdF9iZWdpbiwgY2FsbGJhY2sgKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrID09PSB1bmRlZmluZWRcbiAgICAgID8ganFfdGhyb3R0bGUoIGRlbGF5LCBhdF9iZWdpbiwgZmFsc2UgKVxuICAgICAgOiBqcV90aHJvdHRsZSggZGVsYXksIGNhbGxiYWNrLCBhdF9iZWdpbiAhPT0gZmFsc2UgKTtcbiAgfTtcbiAgXG59KSh0aGlzKTtcbiIsIi8qIVxuICogaG92ZXJJbnRlbnQgdjEuOC4xIC8vIDIwMTQuMDguMTEgLy8galF1ZXJ5IHYxLjkuMStcbiAqIGh0dHA6Ly9jaGVybmUubmV0L2JyaWFuL3Jlc291cmNlcy9qcXVlcnkuaG92ZXJJbnRlbnQuaHRtbFxuICpcbiAqIFlvdSBtYXkgdXNlIGhvdmVySW50ZW50IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuIEJhc2ljYWxseSB0aGF0XG4gKiBtZWFucyB5b3UgYXJlIGZyZWUgdG8gdXNlIGhvdmVySW50ZW50IGFzIGxvbmcgYXMgdGhpcyBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuXG4gKiBDb3B5cmlnaHQgMjAwNywgMjAxNCBCcmlhbiBDaGVybmVcbiAqL1xuIFxuLyogaG92ZXJJbnRlbnQgaXMgc2ltaWxhciB0byBqUXVlcnkncyBidWlsdC1pbiBcImhvdmVyXCIgbWV0aG9kIGV4Y2VwdCB0aGF0XG4gKiBpbnN0ZWFkIG9mIGZpcmluZyB0aGUgaGFuZGxlckluIGZ1bmN0aW9uIGltbWVkaWF0ZWx5LCBob3ZlckludGVudCBjaGVja3NcbiAqIHRvIHNlZSBpZiB0aGUgdXNlcidzIG1vdXNlIGhhcyBzbG93ZWQgZG93biAoYmVuZWF0aCB0aGUgc2Vuc2l0aXZpdHlcbiAqIHRocmVzaG9sZCkgYmVmb3JlIGZpcmluZyB0aGUgZXZlbnQuIFRoZSBoYW5kbGVyT3V0IGZ1bmN0aW9uIGlzIG9ubHlcbiAqIGNhbGxlZCBhZnRlciBhIG1hdGNoaW5nIGhhbmRsZXJJbi5cbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4ganVzdCBsaWtlIC5ob3ZlcigpXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbiwgaGFuZGxlck91dCApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCApXG4gKlxuICogLy8gYmFzaWMgdXNhZ2UgLi4uIHdpdGggZXZlbnQgZGVsZWdhdGlvbiFcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0LCBzZWxlY3RvciApXG4gKiAuaG92ZXJJbnRlbnQoIGhhbmRsZXJJbk91dCwgc2VsZWN0b3IgKVxuICpcbiAqIC8vIHVzaW5nIGEgYmFzaWMgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIC5ob3ZlckludGVudCggY29uZmlnIClcbiAqXG4gKiBAcGFyYW0gIGhhbmRsZXJJbiAgIGZ1bmN0aW9uIE9SIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0gIGhhbmRsZXJPdXQgIGZ1bmN0aW9uIE9SIHNlbGVjdG9yIGZvciBkZWxlZ2F0aW9uIE9SIHVuZGVmaW5lZFxuICogQHBhcmFtICBzZWxlY3RvciAgICBzZWxlY3RvciBPUiB1bmRlZmluZWRcbiAqIEBhdXRob3IgQnJpYW4gQ2hlcm5lIDxicmlhbihhdCljaGVybmUoZG90KW5ldD5cbiAqL1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAkLmZuLmhvdmVySW50ZW50ID0gZnVuY3Rpb24oaGFuZGxlckluLGhhbmRsZXJPdXQsc2VsZWN0b3IpIHtcblxuICAgICAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gdmFsdWVzXG4gICAgICAgIHZhciBjZmcgPSB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgc2Vuc2l0aXZpdHk6IDYsXG4gICAgICAgICAgICB0aW1lb3V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgaGFuZGxlckluID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCBoYW5kbGVySW4gKTtcbiAgICAgICAgfSBlbHNlIGlmICgkLmlzRnVuY3Rpb24oaGFuZGxlck91dCkpIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlck91dCwgc2VsZWN0b3I6IHNlbGVjdG9yIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNmZyA9ICQuZXh0ZW5kKGNmZywgeyBvdmVyOiBoYW5kbGVySW4sIG91dDogaGFuZGxlckluLCBzZWxlY3RvcjogaGFuZGxlck91dCB9ICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnN0YW50aWF0ZSB2YXJpYWJsZXNcbiAgICAgICAgLy8gY1gsIGNZID0gY3VycmVudCBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCB1cGRhdGVkIGJ5IG1vdXNlbW92ZSBldmVudFxuICAgICAgICAvLyBwWCwgcFkgPSBwcmV2aW91cyBYIGFuZCBZIHBvc2l0aW9uIG9mIG1vdXNlLCBzZXQgYnkgbW91c2VvdmVyIGFuZCBwb2xsaW5nIGludGVydmFsXG4gICAgICAgIHZhciBjWCwgY1ksIHBYLCBwWTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGdldHRpbmcgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIHRyYWNrID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGNYID0gZXYucGFnZVg7XG4gICAgICAgICAgICBjWSA9IGV2LnBhZ2VZO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgY29tcGFyaW5nIGN1cnJlbnQgYW5kIHByZXZpb3VzIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHZhciBjb21wYXJlID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICAvLyBjb21wYXJlIG1vdXNlIHBvc2l0aW9ucyB0byBzZWUgaWYgdGhleSd2ZSBjcm9zc2VkIHRoZSB0aHJlc2hvbGRcbiAgICAgICAgICAgIGlmICggTWF0aC5zcXJ0KCAocFgtY1gpKihwWC1jWCkgKyAocFktY1kpKihwWS1jWSkgKSA8IGNmZy5zZW5zaXRpdml0eSApIHtcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGhvdmVySW50ZW50IHN0YXRlIHRvIHRydWUgKHNvIG1vdXNlT3V0IGNhbiBiZSBjYWxsZWQpXG4gICAgICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNmZy5vdmVyLmFwcGx5KG9iLFtldl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgcHJldmlvdXMgY29vcmRpbmF0ZXMgZm9yIG5leHQgdGltZVxuICAgICAgICAgICAgICAgIHBYID0gY1g7IHBZID0gY1k7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHNlbGYtY2FsbGluZyB0aW1lb3V0LCBndWFyYW50ZWVzIGludGVydmFscyBhcmUgc3BhY2VkIG91dCBwcm9wZXJseSAoYXZvaWRzIEphdmFTY3JpcHQgdGltZXIgYnVncylcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LCBvYik7fSAsIGNmZy5pbnRlcnZhbCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZGVsYXlpbmcgdGhlIG1vdXNlT3V0IGZ1bmN0aW9uXG4gICAgICAgIHZhciBkZWxheSA9IGZ1bmN0aW9uKGV2LG9iKSB7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpO1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGNmZy5vdXQuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBtb3VzZSAnaG92ZXJpbmcnXG4gICAgICAgIHZhciBoYW5kbGVIb3ZlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIC8vIGNvcHkgb2JqZWN0cyB0byBiZSBwYXNzZWQgaW50byB0IChyZXF1aXJlZCBmb3IgZXZlbnQgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbiBJRSlcbiAgICAgICAgICAgIHZhciBldiA9ICQuZXh0ZW5kKHt9LGUpO1xuICAgICAgICAgICAgdmFyIG9iID0gdGhpcztcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGhvdmVySW50ZW50IHRpbWVyIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3QpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTsgfVxuXG4gICAgICAgICAgICAvLyBpZiBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSBcIm1vdXNlZW50ZXJcIikge1xuICAgICAgICAgICAgICAgIC8vIHNldCBcInByZXZpb3VzXCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBpbml0aWFsIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgICAgcFggPSBldi5wYWdlWDsgcFkgPSBldi5wYWdlWTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgXCJjdXJyZW50XCIgWCBhbmQgWSBwb3NpdGlvbiBiYXNlZCBvbiBtb3VzZW1vdmVcbiAgICAgICAgICAgICAgICAkKG9iKS5vbihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBwb2xsaW5nIGludGVydmFsIChzZWxmLWNhbGxpbmcgdGltZW91dCkgdG8gY29tcGFyZSBtb3VzZSBjb29yZGluYXRlcyBvdmVyIHRpbWVcbiAgICAgICAgICAgICAgICBpZiAoIW9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7Y29tcGFyZShldixvYik7fSAsIGNmZy5pbnRlcnZhbCApO31cblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZS50eXBlID09IFwibW91c2VsZWF2ZVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVuYmluZCBleHBlbnNpdmUgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgICAgICAgICAgJChvYikub2ZmKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIGlmIGhvdmVySW50ZW50IHN0YXRlIGlzIHRydWUsIHRoZW4gY2FsbCB0aGUgbW91c2VPdXQgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheVxuICAgICAgICAgICAgICAgIGlmIChvYi5ob3ZlckludGVudF9zKSB7IG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2RlbGF5KGV2LG9iKTt9ICwgY2ZnLnRpbWVvdXQgKTt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBtb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlXG4gICAgICAgIHJldHVybiB0aGlzLm9uKHsnbW91c2VlbnRlci5ob3ZlckludGVudCc6aGFuZGxlSG92ZXIsJ21vdXNlbGVhdmUuaG92ZXJJbnRlbnQnOmhhbmRsZUhvdmVyfSwgY2ZnLnNlbGVjdG9yKTtcbiAgICB9O1xufSkoalF1ZXJ5KTtcbiIsIi8qIVxuICogaW1hZ2VzTG9hZGVkIFBBQ0tBR0VEIHYzLjEuOFxuICogSmF2YVNjcmlwdCBpcyBhbGwgbGlrZSBcIllvdSBpbWFnZXMgYXJlIGRvbmUgeWV0IG9yIHdoYXQ/XCJcbiAqIE1JVCBMaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31mdW5jdGlvbiB0KGUsdCl7Zm9yKHZhciBuPWUubGVuZ3RoO24tLTspaWYoZVtuXS5saXN0ZW5lcj09PXQpcmV0dXJuIG47cmV0dXJuLTF9ZnVuY3Rpb24gbihlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tlXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXZhciBpPWUucHJvdG90eXBlLHI9dGhpcyxvPXIuRXZlbnRFbWl0dGVyO2kuZ2V0TGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG4saT10aGlzLl9nZXRFdmVudHMoKTtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dD17fTtmb3IobiBpbiBpKWkuaGFzT3duUHJvcGVydHkobikmJmUudGVzdChuKSYmKHRbbl09aVtuXSl9ZWxzZSB0PWlbZV18fChpW2VdPVtdKTtyZXR1cm4gdH0saS5mbGF0dGVuTGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG49W107Zm9yKHQ9MDtlLmxlbmd0aD50O3QrPTEpbi5wdXNoKGVbdF0ubGlzdGVuZXIpO3JldHVybiBufSxpLmdldExpc3RlbmVyc0FzT2JqZWN0PWZ1bmN0aW9uKGUpe3ZhciB0LG49dGhpcy5nZXRMaXN0ZW5lcnMoZSk7cmV0dXJuIG4gaW5zdGFuY2VvZiBBcnJheSYmKHQ9e30sdFtlXT1uKSx0fHxufSxpLmFkZExpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscj10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpLG89XCJvYmplY3RcIj09dHlwZW9mIG47Zm9yKGkgaW4gcilyLmhhc093blByb3BlcnR5KGkpJiYtMT09PXQocltpXSxuKSYmcltpXS5wdXNoKG8/bjp7bGlzdGVuZXI6bixvbmNlOiExfSk7cmV0dXJuIHRoaXN9LGkub249bihcImFkZExpc3RlbmVyXCIpLGkuYWRkT25jZUxpc3RlbmVyPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZSx7bGlzdGVuZXI6dCxvbmNlOiEwfSl9LGkub25jZT1uKFwiYWRkT25jZUxpc3RlbmVyXCIpLGkuZGVmaW5lRXZlbnQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZ2V0TGlzdGVuZXJzKGUpLHRoaXN9LGkuZGVmaW5lRXZlbnRzPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0wO2UubGVuZ3RoPnQ7dCs9MSl0aGlzLmRlZmluZUV2ZW50KGVbdF0pO3JldHVybiB0aGlzfSxpLnJlbW92ZUxpc3RlbmVyPWZ1bmN0aW9uKGUsbil7dmFyIGkscixvPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gbylvLmhhc093blByb3BlcnR5KHIpJiYoaT10KG9bcl0sbiksLTEhPT1pJiZvW3JdLnNwbGljZShpLDEpKTtyZXR1cm4gdGhpc30saS5vZmY9bihcInJlbW92ZUxpc3RlbmVyXCIpLGkuYWRkTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMSxlLHQpfSxpLnJlbW92ZUxpc3RlbmVycz1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoITAsZSx0KX0saS5tYW5pcHVsYXRlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxyLG89ZT90aGlzLnJlbW92ZUxpc3RlbmVyOnRoaXMuYWRkTGlzdGVuZXIscz1lP3RoaXMucmVtb3ZlTGlzdGVuZXJzOnRoaXMuYWRkTGlzdGVuZXJzO2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0fHx0IGluc3RhbmNlb2YgUmVnRXhwKWZvcihpPW4ubGVuZ3RoO2ktLTspby5jYWxsKHRoaXMsdCxuW2ldKTtlbHNlIGZvcihpIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShpKSYmKHI9dFtpXSkmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiByP28uY2FsbCh0aGlzLGkscik6cy5jYWxsKHRoaXMsaSxyKSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIHQsbj10eXBlb2YgZSxpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwic3RyaW5nXCI9PT1uKWRlbGV0ZSBpW2VdO2Vsc2UgaWYoXCJvYmplY3RcIj09PW4pZm9yKHQgaW4gaSlpLmhhc093blByb3BlcnR5KHQpJiZlLnRlc3QodCkmJmRlbGV0ZSBpW3RdO2Vsc2UgZGVsZXRlIHRoaXMuX2V2ZW50cztyZXR1cm4gdGhpc30saS5yZW1vdmVBbGxMaXN0ZW5lcnM9bihcInJlbW92ZUV2ZW50XCIpLGkuZW1pdEV2ZW50PWZ1bmN0aW9uKGUsdCl7dmFyIG4saSxyLG8scz10aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGUpO2ZvcihyIGluIHMpaWYocy5oYXNPd25Qcm9wZXJ0eShyKSlmb3IoaT1zW3JdLmxlbmd0aDtpLS07KW49c1tyXVtpXSxuLm9uY2U9PT0hMCYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpLG89bi5saXN0ZW5lci5hcHBseSh0aGlzLHR8fFtdKSxvPT09dGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkmJnRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuLmxpc3RlbmVyKTtyZXR1cm4gdGhpc30saS50cmlnZ2VyPW4oXCJlbWl0RXZlbnRcIiksaS5lbWl0PWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTtyZXR1cm4gdGhpcy5lbWl0RXZlbnQoZSx0KX0saS5zZXRPbmNlUmV0dXJuVmFsdWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZT1lLHRoaXN9LGkuX2dldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5KFwiX29uY2VSZXR1cm5WYWx1ZVwiKT90aGlzLl9vbmNlUmV0dXJuVmFsdWU6ITB9LGkuX2dldEV2ZW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ldmVudHN8fCh0aGlzLl9ldmVudHM9e30pfSxlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5FdmVudEVtaXR0ZXI9byxlfSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KTpcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lOnRoaXMuRXZlbnRFbWl0dGVyPWV9KS5jYWxsKHRoaXMpLGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7dmFyIG49ZS5ldmVudDtyZXR1cm4gbi50YXJnZXQ9bi50YXJnZXR8fG4uc3JjRWxlbWVudHx8dCxufXZhciBuPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxpPWZ1bmN0aW9uKCl7fTtuLmFkZEV2ZW50TGlzdGVuZXI/aT1mdW5jdGlvbihlLHQsbil7ZS5hZGRFdmVudExpc3RlbmVyKHQsbiwhMSl9Om4uYXR0YWNoRXZlbnQmJihpPWZ1bmN0aW9uKGUsbixpKXtlW24raV09aS5oYW5kbGVFdmVudD9mdW5jdGlvbigpe3ZhciBuPXQoZSk7aS5oYW5kbGVFdmVudC5jYWxsKGksbil9OmZ1bmN0aW9uKCl7dmFyIG49dChlKTtpLmNhbGwoZSxuKX0sZS5hdHRhY2hFdmVudChcIm9uXCIrbixlW24raV0pfSk7dmFyIHI9ZnVuY3Rpb24oKXt9O24ucmVtb3ZlRXZlbnRMaXN0ZW5lcj9yPWZ1bmN0aW9uKGUsdCxuKXtlLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5kZXRhY2hFdmVudCYmKHI9ZnVuY3Rpb24oZSx0LG4pe2UuZGV0YWNoRXZlbnQoXCJvblwiK3QsZVt0K25dKTt0cnl7ZGVsZXRlIGVbdCtuXX1jYXRjaChpKXtlW3Qrbl09dm9pZCAwfX0pO3ZhciBvPXtiaW5kOmksdW5iaW5kOnJ9O1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudGllL2V2ZW50aWVcIixvKTplLmV2ZW50aWU9b30odGhpcyksZnVuY3Rpb24oZSx0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXJcIixcImV2ZW50aWUvZXZlbnRpZVwiXSxmdW5jdGlvbihuLGkpe3JldHVybiB0KGUsbixpKX0pOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPXQoZSxyZXF1aXJlKFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIikscmVxdWlyZShcImV2ZW50aWVcIikpOmUuaW1hZ2VzTG9hZGVkPXQoZSxlLkV2ZW50RW1pdHRlcixlLmV2ZW50aWUpfSh3aW5kb3csZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGkoZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9ZnVuY3Rpb24gcihlKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1kLmNhbGwoZSl9ZnVuY3Rpb24gbyhlKXt2YXIgdD1bXTtpZihyKGUpKXQ9ZTtlbHNlIGlmKFwibnVtYmVyXCI9PXR5cGVvZiBlLmxlbmd0aClmb3IodmFyIG49MCxpPWUubGVuZ3RoO2k+bjtuKyspdC5wdXNoKGVbbl0pO2Vsc2UgdC5wdXNoKGUpO3JldHVybiB0fWZ1bmN0aW9uIHMoZSx0LG4pe2lmKCEodGhpcyBpbnN0YW5jZW9mIHMpKXJldHVybiBuZXcgcyhlLHQpO1wic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpKSx0aGlzLmVsZW1lbnRzPW8oZSksdGhpcy5vcHRpb25zPWkoe30sdGhpcy5vcHRpb25zKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0P249dDppKHRoaXMub3B0aW9ucyx0KSxuJiZ0aGlzLm9uKFwiYWx3YXlzXCIsbiksdGhpcy5nZXRJbWFnZXMoKSxhJiYodGhpcy5qcURlZmVycmVkPW5ldyBhLkRlZmVycmVkKTt2YXIgcj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyLmNoZWNrKCl9KX1mdW5jdGlvbiBmKGUpe3RoaXMuaW1nPWV9ZnVuY3Rpb24gYyhlKXt0aGlzLnNyYz1lLHZbZV09dGhpc312YXIgYT1lLmpRdWVyeSx1PWUuY29uc29sZSxoPXUhPT12b2lkIDAsZD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO3MucHJvdG90eXBlPW5ldyB0LHMucHJvdG90eXBlLm9wdGlvbnM9e30scy5wcm90b3R5cGUuZ2V0SW1hZ2VzPWZ1bmN0aW9uKCl7dGhpcy5pbWFnZXM9W107Zm9yKHZhciBlPTAsdD10aGlzLmVsZW1lbnRzLmxlbmd0aDt0PmU7ZSsrKXt2YXIgbj10aGlzLmVsZW1lbnRzW2VdO1wiSU1HXCI9PT1uLm5vZGVOYW1lJiZ0aGlzLmFkZEltYWdlKG4pO3ZhciBpPW4ubm9kZVR5cGU7aWYoaSYmKDE9PT1pfHw5PT09aXx8MTE9PT1pKSlmb3IodmFyIHI9bi5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpLG89MCxzPXIubGVuZ3RoO3M+bztvKyspe3ZhciBmPXJbb107dGhpcy5hZGRJbWFnZShmKX19fSxzLnByb3RvdHlwZS5hZGRJbWFnZT1mdW5jdGlvbihlKXt2YXIgdD1uZXcgZihlKTt0aGlzLmltYWdlcy5wdXNoKHQpfSxzLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSxyKXtyZXR1cm4gdC5vcHRpb25zLmRlYnVnJiZoJiZ1LmxvZyhcImNvbmZpcm1cIixlLHIpLHQucHJvZ3Jlc3MoZSksbisrLG49PT1pJiZ0LmNvbXBsZXRlKCksITB9dmFyIHQ9dGhpcyxuPTAsaT10aGlzLmltYWdlcy5sZW5ndGg7aWYodGhpcy5oYXNBbnlCcm9rZW49ITEsIWkpcmV0dXJuIHRoaXMuY29tcGxldGUoKSx2b2lkIDA7Zm9yKHZhciByPTA7aT5yO3IrKyl7dmFyIG89dGhpcy5pbWFnZXNbcl07by5vbihcImNvbmZpcm1cIixlKSxvLmNoZWNrKCl9fSxzLnByb3RvdHlwZS5wcm9ncmVzcz1mdW5jdGlvbihlKXt0aGlzLmhhc0FueUJyb2tlbj10aGlzLmhhc0FueUJyb2tlbnx8IWUuaXNMb2FkZWQ7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5lbWl0KFwicHJvZ3Jlc3NcIix0LGUpLHQuanFEZWZlcnJlZCYmdC5qcURlZmVycmVkLm5vdGlmeSYmdC5qcURlZmVycmVkLm5vdGlmeSh0LGUpfSl9LHMucHJvdG90eXBlLmNvbXBsZXRlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5oYXNBbnlCcm9rZW4/XCJmYWlsXCI6XCJkb25lXCI7dGhpcy5pc0NvbXBsZXRlPSEwO3ZhciB0PXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe2lmKHQuZW1pdChlLHQpLHQuZW1pdChcImFsd2F5c1wiLHQpLHQuanFEZWZlcnJlZCl7dmFyIG49dC5oYXNBbnlCcm9rZW4/XCJyZWplY3RcIjpcInJlc29sdmVcIjt0LmpxRGVmZXJyZWRbbl0odCl9fSl9LGEmJihhLmZuLmltYWdlc0xvYWRlZD1mdW5jdGlvbihlLHQpe3ZhciBuPW5ldyBzKHRoaXMsZSx0KTtyZXR1cm4gbi5qcURlZmVycmVkLnByb21pc2UoYSh0aGlzKSl9KSxmLnByb3RvdHlwZT1uZXcgdCxmLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe3ZhciBlPXZbdGhpcy5pbWcuc3JjXXx8bmV3IGModGhpcy5pbWcuc3JjKTtpZihlLmlzQ29uZmlybWVkKXJldHVybiB0aGlzLmNvbmZpcm0oZS5pc0xvYWRlZCxcImNhY2hlZCB3YXMgY29uZmlybWVkXCIpLHZvaWQgMDtpZih0aGlzLmltZy5jb21wbGV0ZSYmdm9pZCAwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoKXJldHVybiB0aGlzLmNvbmZpcm0oMCE9PXRoaXMuaW1nLm5hdHVyYWxXaWR0aCxcIm5hdHVyYWxXaWR0aFwiKSx2b2lkIDA7dmFyIHQ9dGhpcztlLm9uKFwiY29uZmlybVwiLGZ1bmN0aW9uKGUsbil7cmV0dXJuIHQuY29uZmlybShlLmlzTG9hZGVkLG4pLCEwfSksZS5jaGVjaygpfSxmLnByb3RvdHlwZS5jb25maXJtPWZ1bmN0aW9uKGUsdCl7dGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfTt2YXIgdj17fTtyZXR1cm4gYy5wcm90b3R5cGU9bmV3IHQsYy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtpZighdGhpcy5pc0NoZWNrZWQpe3ZhciBlPW5ldyBJbWFnZTtuLmJpbmQoZSxcImxvYWRcIix0aGlzKSxuLmJpbmQoZSxcImVycm9yXCIsdGhpcyksZS5zcmM9dGhpcy5zcmMsdGhpcy5pc0NoZWNrZWQ9ITB9fSxjLnByb3RvdHlwZS5oYW5kbGVFdmVudD1mdW5jdGlvbihlKXt2YXIgdD1cIm9uXCIrZS50eXBlO3RoaXNbdF0mJnRoaXNbdF0oZSl9LGMucHJvdG90eXBlLm9ubG9hZD1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITAsXCJvbmxvYWRcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUub25lcnJvcj1mdW5jdGlvbihlKXt0aGlzLmNvbmZpcm0oITEsXCJvbmVycm9yXCIpLHRoaXMudW5iaW5kUHJveHlFdmVudHMoZSl9LGMucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzQ29uZmlybWVkPSEwLHRoaXMuaXNMb2FkZWQ9ZSx0aGlzLmVtaXQoXCJjb25maXJtXCIsdGhpcyx0KX0sYy5wcm90b3R5cGUudW5iaW5kUHJveHlFdmVudHM9ZnVuY3Rpb24oZSl7bi51bmJpbmQoZS50YXJnZXQsXCJsb2FkXCIsdGhpcyksbi51bmJpbmQoZS50YXJnZXQsXCJlcnJvclwiLHRoaXMpfSxzfSk7IiwiLyoqXG4qIGpxdWVyeS5tYXRjaEhlaWdodC5qcyBtYXN0ZXJcbiogaHR0cDovL2JybS5pby9qcXVlcnktbWF0Y2gtaGVpZ2h0L1xuKiBMaWNlbnNlOiBNSVRcbiovXG5cbjsoZnVuY3Rpb24oJCkge1xuICAgIC8qXG4gICAgKiAgaW50ZXJuYWxcbiAgICAqL1xuXG4gICAgdmFyIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gLTEsXG4gICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XG5cbiAgICAvKlxuICAgICogIF9wYXJzZVxuICAgICogIHZhbHVlIHBhcnNlIHV0aWxpdHkgZnVuY3Rpb25cbiAgICAqL1xuXG4gICAgdmFyIF9wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIHBhcnNlIHZhbHVlIGFuZCBjb252ZXJ0IE5hTiB0byAwXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIF9yb3dzXG4gICAgKiAgdXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIGFycmF5IG9mIGpRdWVyeSBzZWxlY3Rpb25zIHJlcHJlc2VudGluZyBlYWNoIHJvd1xuICAgICogIChhcyBkaXNwbGF5ZWQgYWZ0ZXIgZmxvYXQgd3JhcHBpbmcgYXBwbGllZCBieSBicm93c2VyKVxuICAgICovXG5cbiAgICB2YXIgX3Jvd3MgPSBmdW5jdGlvbihlbGVtZW50cykge1xuICAgICAgICB2YXIgdG9sZXJhbmNlID0gMSxcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxuICAgICAgICAgICAgbGFzdFRvcCA9IG51bGwsXG4gICAgICAgICAgICByb3dzID0gW107XG5cbiAgICAgICAgLy8gZ3JvdXAgZWxlbWVudHMgYnkgdGhlaXIgdG9wIHBvc2l0aW9uXG4gICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRvcCA9ICR0aGF0Lm9mZnNldCgpLnRvcCAtIF9wYXJzZSgkdGhhdC5jc3MoJ21hcmdpbi10b3AnKSksXG4gICAgICAgICAgICAgICAgbGFzdFJvdyA9IHJvd3MubGVuZ3RoID4gMCA/IHJvd3Nbcm93cy5sZW5ndGggLSAxXSA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChsYXN0Um93ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gZmlyc3QgaXRlbSBvbiB0aGUgcm93LCBzbyBqdXN0IHB1c2ggaXRcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goJHRoYXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm93IHRvcCBpcyB0aGUgc2FtZSwgYWRkIHRvIHRoZSByb3cgZ3JvdXBcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLmFicyhsYXN0VG9wIC0gdG9wKSkgPD0gdG9sZXJhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXSA9IGxhc3RSb3cuYWRkKCR0aGF0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2Ugc3RhcnQgYSBuZXcgcm93IGdyb3VwXG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBsYXN0IHJvdyB0b3BcbiAgICAgICAgICAgIGxhc3RUb3AgPSB0b3A7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByb3dzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIF9wYXJzZU9wdGlvbnNcbiAgICAqICBoYW5kbGUgcGx1Z2luIG9wdGlvbnNcbiAgICAqL1xuXG4gICAgdmFyIF9wYXJzZU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgYnlSb3c6IHRydWUsXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2hlaWdodCcsXG4gICAgICAgICAgICB0YXJnZXQ6IG51bGwsXG4gICAgICAgICAgICByZW1vdmU6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKG9wdHMsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIG9wdHMuYnlSb3cgPSBvcHRpb25zO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09ICdyZW1vdmUnKSB7XG4gICAgICAgICAgICBvcHRzLnJlbW92ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0cztcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBtYXRjaEhlaWdodFxuICAgICogIHBsdWdpbiBkZWZpbml0aW9uXG4gICAgKi9cblxuICAgIHZhciBtYXRjaEhlaWdodCA9ICQuZm4ubWF0Y2hIZWlnaHQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKTtcblxuICAgICAgICAvLyBoYW5kbGUgcmVtb3ZlXG4gICAgICAgIGlmIChvcHRzLnJlbW92ZSkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgZml4ZWQgaGVpZ2h0IGZyb20gYWxsIHNlbGVjdGVkIGVsZW1lbnRzXG4gICAgICAgICAgICB0aGlzLmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBzZWxlY3RlZCBlbGVtZW50cyBmcm9tIGFsbCBncm91cHNcbiAgICAgICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbihrZXksIGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXAuZWxlbWVudHMgPSBncm91cC5lbGVtZW50cy5ub3QodGhhdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW51cCBlbXB0eSBncm91cHNcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gMSAmJiAhb3B0cy50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGlzIGdyb3VwIHNvIHdlIGNhbiByZS1hcHBseSBsYXRlciBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9ncm91cHMucHVzaCh7XG4gICAgICAgICAgICBlbGVtZW50czogdGhpcyxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdHNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gbWF0Y2ggZWFjaCBlbGVtZW50J3MgaGVpZ2h0IHRvIHRoZSB0YWxsZXN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvblxuICAgICAgICBtYXRjaEhlaWdodC5fYXBwbHkodGhpcywgb3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgcGx1Z2luIGdsb2JhbCBvcHRpb25zXG4gICAgKi9cblxuICAgIG1hdGNoSGVpZ2h0Ll9ncm91cHMgPSBbXTtcbiAgICBtYXRjaEhlaWdodC5fdGhyb3R0bGUgPSA4MDtcbiAgICBtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSBmYWxzZTtcbiAgICBtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlID0gbnVsbDtcbiAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUgPSBudWxsO1xuXG4gICAgLypcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlcbiAgICAqICBhcHBseSBtYXRjaEhlaWdodCB0byBnaXZlbiBlbGVtZW50c1xuICAgICovXG5cbiAgICBtYXRjaEhlaWdodC5fYXBwbHkgPSBmdW5jdGlvbihlbGVtZW50cywgb3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0cyA9IF9wYXJzZU9wdGlvbnMob3B0aW9ucyksXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcbiAgICAgICAgICAgIHJvd3MgPSBbJGVsZW1lbnRzXTtcblxuICAgICAgICAvLyB0YWtlIG5vdGUgb2Ygc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICBodG1sSGVpZ2h0ID0gJCgnaHRtbCcpLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgICAgIC8vIGdldCBoaWRkZW4gcGFyZW50c1xuICAgICAgICB2YXIgJGhpZGRlblBhcmVudHMgPSAkZWxlbWVudHMucGFyZW50cygpLmZpbHRlcignOmhpZGRlbicpO1xuXG4gICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0ZW1wb3JhcmlseSBtdXN0IGZvcmNlIGhpZGRlbiBwYXJlbnRzIHZpc2libGVcbiAgICAgICAgJGhpZGRlblBhcmVudHMuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICAgLy8gZ2V0IHJvd3MgaWYgdXNpbmcgYnlSb3csIG90aGVyd2lzZSBhc3N1bWUgb25lIHJvd1xuICAgICAgICBpZiAob3B0cy5ieVJvdyAmJiAhb3B0cy50YXJnZXQpIHtcblxuICAgICAgICAgICAgLy8gbXVzdCBmaXJzdCBmb3JjZSBhbiBhcmJpdHJhcnkgZXF1YWwgaGVpZ2h0IHNvIGZsb2F0aW5nIGVsZW1lbnRzIGJyZWFrIGV2ZW5seVxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpO1xuXG4gICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJpbHkgZm9yY2UgYSB1c2FibGUgZGlzcGxheSB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5ICE9PSAnaW5saW5lLWJsb2NrJyAmJiBkaXNwbGF5ICE9PSAnaW5saW5lLWZsZXgnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpbmxpbmUgc3R5bGVcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xuXG4gICAgICAgICAgICAgICAgJHRoYXQuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiBkaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy10b3AnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdtYXJnaW4tYm90dG9tJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLXRvcC13aWR0aCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1ib3R0b20td2lkdGgnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwcHgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBhcnJheSBvZiByb3dzIChiYXNlZCBvbiBlbGVtZW50IHRvcCBwb3NpdGlvbilcbiAgICAgICAgICAgIHJvd3MgPSBfcm93cygkZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAvLyByZXZlcnQgb3JpZ2luYWwgaW5saW5lIHN0eWxlc1xuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAkdGhhdC5hdHRyKCdzdHlsZScsICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJykgfHwgJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkLmVhY2gocm93cywgZnVuY3Rpb24oa2V5LCByb3cpIHtcbiAgICAgICAgICAgIHZhciAkcm93ID0gJChyb3cpLFxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9IDA7XG5cbiAgICAgICAgICAgIGlmICghb3B0cy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAvLyBza2lwIGFwcGx5IHRvIHJvd3Mgd2l0aCBvbmx5IG9uZSBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgJHJvdy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkcm93LmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGZpbmQgdGhlIG1heCBoZWlnaHRcbiAgICAgICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAkdGhhdC5jc3MoJ2Rpc3BsYXknKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcmlseSBmb3JjZSBhIHVzYWJsZSBkaXNwbGF5IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5ICE9PSAnaW5saW5lLWJsb2NrJyAmJiBkaXNwbGF5ICE9PSAnaW5saW5lLWZsZXgnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB3ZSBnZXQgdGhlIGNvcnJlY3QgYWN0dWFsIGhlaWdodCAoYW5kIG5vdCBhIHByZXZpb3VzbHkgc2V0IGhlaWdodCB2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNzcyA9IHsgJ2Rpc3BsYXknOiBkaXNwbGF5IH07XG4gICAgICAgICAgICAgICAgICAgIGNzc1tvcHRzLnByb3BlcnR5XSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoY3NzKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBtYXggaGVpZ2h0IChpbmNsdWRpbmcgcGFkZGluZywgYnV0IG5vdCBtYXJnaW4pXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhhdC5vdXRlckhlaWdodChmYWxzZSkgPiB0YXJnZXRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodCA9ICR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVydCBkaXNwbGF5IGJsb2NrXG4gICAgICAgICAgICAgICAgICAgICR0aGF0LmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGFyZ2V0IHNldCwgdXNlIHRoZSBoZWlnaHQgb2YgdGhlIHRhcmdldCBlbGVtZW50XG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gb3B0cy50YXJnZXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGFwcGx5IHRoZSBoZWlnaHQgdG8gYWxsIGVsZW1lbnRzXG4gICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYXBwbHkgdG8gYSB0YXJnZXRcbiAgICAgICAgICAgICAgICBpZiAob3B0cy50YXJnZXQgJiYgJHRoYXQuaXMob3B0cy50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgcGFkZGluZyBhbmQgYm9yZGVyIGNvcnJlY3RseSAocmVxdWlyZWQgd2hlbiBub3QgdXNpbmcgYm9yZGVyLWJveClcbiAgICAgICAgICAgICAgICBpZiAoJHRoYXQuY3NzKCdib3gtc2l6aW5nJykgIT09ICdib3JkZXItYm94Jykge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgKz0gX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLXRvcC13aWR0aCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKSk7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdwYWRkaW5nLXRvcCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgaGVpZ2h0IChhY2NvdW50aW5nIGZvciBwYWRkaW5nIGFuZCBib3JkZXIpXG4gICAgICAgICAgICAgICAgJHRoYXQuY3NzKG9wdHMucHJvcGVydHksICh0YXJnZXRIZWlnaHQgLSB2ZXJ0aWNhbFBhZGRpbmcpICsgJ3B4Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV2ZXJ0IGhpZGRlbiBwYXJlbnRzXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8IG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXN0b3JlIHNjcm9sbCBwb3NpdGlvbiBpZiBlbmFibGVkXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwpIHtcbiAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoKHNjcm9sbFRvcCAvIGh0bWxIZWlnaHQpICogJCgnaHRtbCcpLm91dGVySGVpZ2h0KHRydWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGlcbiAgICAqICBhcHBsaWVzIG1hdGNoSGVpZ2h0IHRvIGFsbCBlbGVtZW50cyB3aXRoIGEgZGF0YS1tYXRjaC1oZWlnaHQgYXR0cmlidXRlXG4gICAgKi9cblxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGdyb3VwcyA9IHt9O1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIGdyb3VwcyBieSB0aGVpciBncm91cElkIHNldCBieSBlbGVtZW50cyB1c2luZyBkYXRhLW1hdGNoLWhlaWdodFxuICAgICAgICAkKCdbZGF0YS1tYXRjaC1oZWlnaHRdLCBbZGF0YS1taF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBncm91cElkID0gJHRoaXMuYXR0cignZGF0YS1taCcpIHx8ICR0aGlzLmF0dHIoJ2RhdGEtbWF0Y2gtaGVpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGlmIChncm91cElkIGluIGdyb3Vwcykge1xuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9IGdyb3Vwc1tncm91cElkXS5hZGQoJHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBJZF0gPSAkdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gYXBwbHkgbWF0Y2hIZWlnaHQgdG8gZWFjaCBncm91cFxuICAgICAgICAkLmVhY2goZ3JvdXBzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMubWF0Y2hIZWlnaHQodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0Ll91cGRhdGVcbiAgICAqICB1cGRhdGVzIG1hdGNoSGVpZ2h0IG9uIGFsbCBjdXJyZW50IGdyb3VwcyB3aXRoIHRoZWlyIGNvcnJlY3Qgb3B0aW9uc1xuICAgICovXG5cbiAgICB2YXIgX3VwZGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKSB7XG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYmVmb3JlVXBkYXRlKGV2ZW50LCBtYXRjaEhlaWdodC5fZ3JvdXBzKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLmVsZW1lbnRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlKSB7XG4gICAgICAgICAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1hdGNoSGVpZ2h0Ll91cGRhdGUgPSBmdW5jdGlvbih0aHJvdHRsZSwgZXZlbnQpIHtcbiAgICAgICAgLy8gcHJldmVudCB1cGRhdGUgaWYgZmlyZWQgZnJvbSBhIHJlc2l6ZSBldmVudFxuICAgICAgICAvLyB3aGVyZSB0aGUgdmlld3BvcnQgd2lkdGggaGFzbid0IGFjdHVhbGx5IGNoYW5nZWRcbiAgICAgICAgLy8gZml4ZXMgYW4gZXZlbnQgbG9vcGluZyBidWcgaW4gSUU4XG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAncmVzaXplJykge1xuICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgICAgICBpZiAod2luZG93V2lkdGggPT09IF9wcmV2aW91c1Jlc2l6ZVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3ByZXZpb3VzUmVzaXplV2lkdGggPSB3aW5kb3dXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRocm90dGxlIHVwZGF0ZXNcbiAgICAgICAgaWYgKCF0aHJvdHRsZSkge1xuICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoX3VwZGF0ZVRpbWVvdXQgPT09IC0xKSB7XG4gICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZShldmVudCk7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcbiAgICAgICAgICAgIH0sIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBiaW5kIGV2ZW50c1xuICAgICovXG5cbiAgICAvLyBhcHBseSBvbiBET00gcmVhZHkgZXZlbnRcbiAgICAkKG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkpO1xuXG4gICAgLy8gdXBkYXRlIGhlaWdodHMgb24gbG9hZCBhbmQgcmVzaXplIGV2ZW50c1xuICAgICQod2luZG93KS5iaW5kKCdsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZShmYWxzZSwgZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgLy8gdGhyb3R0bGVkIHVwZGF0ZSBoZWlnaHRzIG9uIHJlc2l6ZSBldmVudHNcbiAgICAkKHdpbmRvdykuYmluZCgncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSh0cnVlLCBldmVudCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7XG4iLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5KUyBQTFVHSU5TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG5cblxuLy8gR2V0IEN1cnJlbnQgQnJlYWtwb2ludCAoR2xvYmFsKVxudmFyIGJyZWFrcG9pbnQgPSB7fTtcbmJyZWFrcG9pbnQucmVmcmVzaCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLm5hbWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICc6YmVmb3JlJykuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoL1xcXCIvZywgJycpO1xufTtcbmpRdWVyeSh3aW5kb3cpLnJlc2l6ZSggZnVuY3Rpb24oKSB7XG5cdGJyZWFrcG9pbnQucmVmcmVzaCgpO1xufSkucmVzaXplKCk7XG5cblxuLy8gUmVzaXplIElmcmFtZXMgUHJvcG9ydGlvbmFsbHlcbmZ1bmN0aW9uIGlmcmFtZUFzcGVjdChzZWxlY3Rvcikge1xuXHRzZWxlY3RvciA9IHNlbGVjdG9yIHx8IGpRdWVyeSgnaWZyYW1lJyk7XG5cblx0c2VsZWN0b3IuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0LyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuXHRcdHZhciBpZnJhbWUgPSBqUXVlcnkodGhpcyksXG5cdFx0XHR3aWR0aCAgPSBpZnJhbWUud2lkdGgoKTtcblx0XHRpZiAoIHR5cGVvZihpZnJhbWUuZGF0YSgncmF0aW8nKSkgPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR2YXIgYXR0clcgPSB0aGlzLndpZHRoLFxuXHRcdFx0XHRhdHRySCA9IHRoaXMuaGVpZ2h0O1xuXHRcdFx0aWZyYW1lLmRhdGEoJ3JhdGlvJywgYXR0ckggLyBhdHRyVyApLnJlbW92ZUF0dHIoJ3dpZHRoJykucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XG5cdFx0fVxuXHRcdGlmcmFtZS5oZWlnaHQoIHdpZHRoICogaWZyYW1lLmRhdGEoJ3JhdGlvJykgKS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG5cdH0pO1xufVxuXG5cbi8vIExpZ2h0ZW4gLyBEYXJrZW4gQ29sb3IgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XG5mdW5jdGlvbiBzaGFkZUNvbG9yKGNvbG9yLCBwZXJjZW50KSB7ICAgXG5cdHZhciBmPXBhcnNlSW50KGNvbG9yLnNsaWNlKDEpLDE2KSx0PXBlcmNlbnQ8MD8wOjI1NSxwPXBlcmNlbnQ8MD9wZXJjZW50Ki0xOnBlcmNlbnQsUj1mPj4xNixHPWY+PjgmMHgwMEZGLEI9ZiYweDAwMDBGRjtcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKCh0LVIpKnApK1IpKjB4MTAwMDArKE1hdGgucm91bmQoKHQtRykqcCkrRykqMHgxMDArKE1hdGgucm91bmQoKHQtQikqcCkrQikpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbn1cblxuXG4vLyBCbGVuZCBDb2xvcnMgLSBDcmVkaXQgXCJQaW1wIFRyaXpraXRcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy82OTM5MjcvcGltcC10cml6a2l0XG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcblx0dmFyIGY9cGFyc2VJbnQoYzAuc2xpY2UoMSksMTYpLHQ9cGFyc2VJbnQoYzEuc2xpY2UoMSksMTYpLFIxPWY+PjE2LEcxPWY+PjgmMHgwMEZGLEIxPWYmMHgwMDAwRkYsUjI9dD4+MTYsRzI9dD4+OCYweDAwRkYsQjI9dCYweDAwMDBGRjtcblx0cmV0dXJuICcjJysoMHgxMDAwMDAwKyhNYXRoLnJvdW5kKChSMi1SMSkqcCkrUjEpKjB4MTAwMDArKE1hdGgucm91bmQoKEcyLUcxKSpwKStHMSkqMHgxMDArKE1hdGgucm91bmQoKEIyLUIxKSpwKStCMSkpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbn1cblxuXG4vLyBDb252ZXJ0IGNvbG9yIHRvIFJHQmFcbmZ1bmN0aW9uIGNvbG9yVG9SZ2JhKGNvbG9yLCBvcGFjaXR5KSB7XG5cdGlmICggY29sb3Iuc3Vic3RyaW5nKDAsNCkgPT0gJ3JnYmEnICkge1xuXHRcdHZhciBhbHBoYSA9IGNvbG9yLm1hdGNoKC8oW15cXCxdKilcXCkkLyk7XG5cdFx0cmV0dXJuIGNvbG9yLnJlcGxhY2UoYWxwaGFbMV0sIG9wYWNpdHkpO1xuXHR9IGVsc2UgaWYgKCBjb2xvci5zdWJzdHJpbmcoMCwzKSA9PSAncmdiJyApIHtcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCAnLCAnK29wYWNpdHkrJyknKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgaGV4ID0gY29sb3IucmVwbGFjZSgnIycsJycpLFxuXHRcdFx0ciA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwyKSwgMTYpLFxuXHRcdFx0ZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpLFxuXHRcdFx0YiA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNCw2KSwgMTYpLFxuXHRcdFx0cmVzdWx0ID0gJ3JnYmEoJytyKycsJytnKycsJytiKycsJytvcGFjaXR5KycpJztcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cblxuLy8gQ29sb3IgTGlnaHQgT3IgRGFyayAtIENyZWRpdCBcIkxhcnJ5IEZveFwiIC0gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbGFycnlmb3gvMTYzNjMzOFxuZnVuY3Rpb24gY29sb3JMb0QoY29sb3IpIHtcblx0dmFyIHIsYixnLGhzcCxhID0gY29sb3I7XG5cdGlmIChhLm1hdGNoKC9ecmdiLykpIHtcblx0XHRhID0gYS5tYXRjaCgvXnJnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKSg/OixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pKT9cXCkkLyk7XG5cdFx0ciA9IGFbMV07XG5cdFx0YiA9IGFbMl07XG5cdFx0ZyA9IGFbM107XG5cdH0gZWxzZSB7XG5cdFx0YSA9ICsoJzB4JyArIGEuc2xpY2UoMSkucmVwbGFjZShhLmxlbmd0aCA8IDUgJiYgLy4vZywgJyQmJCYnKSk7XG5cdFx0ciA9IGEgPj4gMTY7XG5cdFx0YiA9IGEgPj4gOCAmIDI1NTtcblx0XHRnID0gYSAmIDI1NTtcblx0fVxuXHRoc3AgPSBNYXRoLnNxcnQoIDAuMjk5ICogKHIgKiByKSArIDAuNTg3ICogKGcgKiBnKSArIDAuMTE0ICogKGIgKiBiKSApO1xuXHRyZXR1cm4gKCBoc3AgPiAxMjcuNSApID8gJ2xpZ2h0JyA6ICdkYXJrJztcbn0gXG5cblxuLy8gSW1hZ2UgTGlnaHQgT3IgRGFyayBJbWFnZSAtIENyZWRpdCBcIkpvc2VwaCBQb3J0ZWxsaVwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzE0OTYzNi9qb3NlcGgtcG9ydGVsbGlcbmZ1bmN0aW9uIGltYWdlTG9EKGltYWdlU3JjLCBjYWxsYmFjaykge1xuXHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cdGltZy5zcmMgPSBpbWFnZVNyYztcblx0aW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcblxuXHR2YXIgY29sb3JTdW0gPSAwO1xuXG5cdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHQvLyBjcmVhdGUgY2FudmFzXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcywwLDApO1xuXG5cdFx0dmFyIGltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwwLGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xuXHRcdHZhciByLGcsYixhdmc7XG5cblx0XHRmb3IodmFyIHggPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgeCA8IGxlbjsgeCs9NCkge1xuXHRcdFx0ciA9IGRhdGFbeF07XG5cdFx0XHRnID0gZGF0YVt4KzFdO1xuXHRcdFx0YiA9IGRhdGFbeCsyXTtcblxuXHRcdFx0YXZnID0gTWF0aC5mbG9vcigocitnK2IpLzMpO1xuXHRcdFx0Y29sb3JTdW0gKz0gYXZnO1xuXHRcdH1cblxuXHRcdHZhciBicmlnaHRuZXNzID0gTWF0aC5mbG9vcihjb2xvclN1bSAvICh0aGlzLndpZHRoKnRoaXMuaGVpZ2h0KSk7XG5cdFx0Y2FsbGJhY2soYnJpZ2h0bmVzcyk7XG5cdH07XG59XG5cblxuLy8gUmVzaXplIEltYWdlIFRvIEZpbGwgQ29udGFpbmVyIFNpemVcbmZ1bmN0aW9uIGltYWdlQ292ZXIoY29udCwgdHlwZSwgY29yckgpIHtcblx0dHlwZSA9IHR5cGUgfHwgJ2JnJztcblxuXHRjb250LmFkZENsYXNzKCdpbWFnZS1jb3ZlcicpO1xuXG5cdHZhciBpbWcsIGltZ1VybCwgaW1nV2lkdGggPSAwLCBpbWdIZWlnaHQgPSAwO1xuXG5cdGlmICggdHlwZSA9PSAnaW1nJyApIHtcblx0XHRpbWcgPSBjb250LmZpbmQoJy5iZy1pbWcnKTtcblx0XHRpbWdXaWR0aCAgPSBpbWcud2lkdGgoKTtcblx0XHRpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0KCk7XG5cdH0gZWxzZSB7XG5cdFx0aW1nVXJsID0gY29udC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5tYXRjaCgvXnVybFxcKFwiPyguKz8pXCI/XFwpJC8pO1xuXHRcdGlmICggaW1nVXJsWzFdICkge1xuXHRcdCAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHQgICAgaW1nLnNyYyA9IGltZ1VybFsxXTtcblx0XHQgICAgaW1nV2lkdGggID0gaW1nLndpZHRoO1xuXHRcdCAgICBpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0O1xuXHRcdH1cblx0fVxuXG5cdGlmICggaW1nV2lkdGggIT09IDAgJiYgaW1nSGVpZ2h0ICE9PSAwICkge1xuXHRcdHZhciBjb250V2lkdGggID0gY29udC5vdXRlcldpZHRoKCksXG5cdFx0XHRjb250SGVpZ2h0ID0gY29udC5vdXRlckhlaWdodCgpLFxuXHRcdFx0aGVpZ2h0RGlmZiA9IGNvbnRXaWR0aCAvIGltZ1dpZHRoICogaW1nSGVpZ2h0LFxuXHRcdFx0bmV3V2lkdGggICA9ICdhdXRvJyxcblx0XHRcdG5ld0hlaWdodCAgPSBjb250SGVpZ2h0ICsgY29yckggKyAncHgnO1xuXG5cdFx0XHRpZiAoIGhlaWdodERpZmYgPiBjb250SGVpZ2h0ICkge1xuXHRcdFx0XHRuZXdXaWR0aCAgPSAnMTAwJSc7XG5cdFx0XHRcdG5ld0hlaWdodCA9ICdhdXRvJztcblx0XHRcdH1cblxuXHRcdGlmICggdHlwZSA9PSAnaW1nJyApIHtcblx0XHRcdGltZy5jc3MoeyB3aWR0aDogbmV3V2lkdGgsIGhlaWdodDogbmV3SGVpZ2h0IH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250LmNzcygnYmFja2dyb3VuZC1zaXplJywgbmV3V2lkdGggKyAnICcgKyBuZXdIZWlnaHQpO1xuXHRcdH1cblx0fVxufVxuXG5cbi8vIERldGVybWluZSBJZiBBbiBFbGVtZW50IElzIFNjcm9sbGVkIEludG8gVmlld1xuZnVuY3Rpb24gZWxlbVZpc2libGUoZWxlbSwgY29udCkge1xuXHR2YXIgY29udFRvcCA9IGNvbnQuc2Nyb2xsVG9wKCksXG5cdFx0Y29udEJ0bSA9IGNvbnRUb3AgKyBjb250LmhlaWdodCgpLFxuXHRcdGVsZW1Ub3AgPSBlbGVtLm9mZnNldCgpLnRvcCxcblx0XHRlbGVtQnRtID0gZWxlbVRvcCArIGVsZW0uaGVpZ2h0KCk7XG5cblx0cmV0dXJuICgoZWxlbUJ0bSA8PSBjb250QnRtKSAmJiAoZWxlbVRvcCA+PSBjb250VG9wKSk7XG59XG5cblxuKCBmdW5jdGlvbigkKSB7XG5cdC8vIEZpeCBXUE1MIERyb3Bkb3duXG5cdCQoJy5tZW51LWl0ZW0tbGFuZ3VhZ2UnKS5hZGRDbGFzcygnZHJvcGRvd24gZHJvcC1tZW51JykuZmluZCgnLnN1Yi1tZW51JykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcblxuXHQvLyBGaXggUG9seUxhbmcgTWVudSBJdGVtcyBBbmQgTWFrZSBUaGVtIERyb3Bkb3duXG5cdCQoJy5tZW51LWl0ZW0ubGFuZy1pdGVtJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0dmFyIGl0ZW0gPSAkKCcubGFuZy1pdGVtLmN1cnJlbnQtbGFuZycpO1xuXHRpZiAoaXRlbS5sZW5ndGggPT09IDApIHtcblx0XHRpdGVtID0gJCgnLmxhbmctaXRlbScpLmZpcnN0KCk7XG5cdH1cblx0dmFyIGxhbmdzID0gaXRlbS5zaWJsaW5ncygnLmxhbmctaXRlbScpO1xuXHRpdGVtLmFkZENsYXNzKCdkcm9wZG93biBkcm9wLW1lbnUnKTtcblx0bGFuZ3Mud3JhcEFsbCgnPHVsIGNsYXNzPVwic3ViLW1lbnUgZHJvcGRvd24tbWVudVwiPjwvdWw+JykucGFyZW50KCkuYXBwZW5kVG8oaXRlbSk7XG59KShqUXVlcnkpOyIsIi8qISBtb2Rlcm5penIgMy4wLjAtYWxwaGEuNCAoQ3VzdG9tIEJ1aWxkKSB8IE1JVCAqXG4gKiBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZC8jLWZsZXhib3gtc2hpdiAhKi9cbiFmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gcihlLHQpe3JldHVybiB0eXBlb2YgZT09PXR9ZnVuY3Rpb24gbygpe3ZhciBlLHQsbixvLGEsaSxzO2Zvcih2YXIgbCBpbiBDKXtpZihlPVtdLHQ9Q1tsXSx0Lm5hbWUmJihlLnB1c2godC5uYW1lLnRvTG93ZXJDYXNlKCkpLHQub3B0aW9ucyYmdC5vcHRpb25zLmFsaWFzZXMmJnQub3B0aW9ucy5hbGlhc2VzLmxlbmd0aCkpZm9yKG49MDtuPHQub3B0aW9ucy5hbGlhc2VzLmxlbmd0aDtuKyspZS5wdXNoKHQub3B0aW9ucy5hbGlhc2VzW25dLnRvTG93ZXJDYXNlKCkpO2ZvcihvPXIodC5mbixcImZ1bmN0aW9uXCIpP3QuZm4oKTp0LmZuLGE9MDthPGUubGVuZ3RoO2ErKylpPWVbYV0scz1pLnNwbGl0KFwiLlwiKSwxPT09cy5sZW5ndGg/TW9kZXJuaXpyW3NbMF1dPW86KCFNb2Rlcm5penJbc1swXV18fE1vZGVybml6cltzWzBdXWluc3RhbmNlb2YgQm9vbGVhbnx8KE1vZGVybml6cltzWzBdXT1uZXcgQm9vbGVhbihNb2Rlcm5penJbc1swXV0pKSxNb2Rlcm5penJbc1swXV1bc1sxXV09bykseS5wdXNoKChvP1wiXCI6XCJuby1cIikrcy5qb2luKFwiLVwiKSl9fWZ1bmN0aW9uIGEoZSl7dmFyIHQ9Uy5jbGFzc05hbWUsbj1Nb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeHx8XCJcIjtpZihiJiYodD10LmJhc2VWYWwpLE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUpTQ2xhc3Mpe3ZhciByPW5ldyBSZWdFeHAoXCIoXnxcXFxccylcIituK1wibm8tanMoXFxcXHN8JClcIik7dD10LnJlcGxhY2UocixcIiQxXCIrbitcImpzJDJcIil9TW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3NlcyYmKHQrPVwiIFwiK24rZS5qb2luKFwiIFwiK24pLGI/Uy5jbGFzc05hbWUuYmFzZVZhbD10OlMuY2xhc3NOYW1lPXQpfWZ1bmN0aW9uIGkoZSx0KXtyZXR1cm4hIX4oXCJcIitlKS5pbmRleE9mKHQpfWZ1bmN0aW9uIHMoKXtyZXR1cm5cImZ1bmN0aW9uXCIhPXR5cGVvZiB0LmNyZWF0ZUVsZW1lbnQ/dC5jcmVhdGVFbGVtZW50KGFyZ3VtZW50c1swXSk6Yj90LmNyZWF0ZUVsZW1lbnROUy5jYWxsKHQsXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGFyZ3VtZW50c1swXSk6dC5jcmVhdGVFbGVtZW50LmFwcGx5KHQsYXJndW1lbnRzKX1mdW5jdGlvbiBsKGUpe3JldHVybiBlLnJlcGxhY2UoLyhbYS16XSktKFthLXpdKS9nLGZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gdCtuLnRvVXBwZXJDYXNlKCl9KS5yZXBsYWNlKC9eLS8sXCJcIil9ZnVuY3Rpb24gYyhlLHQpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBlLmFwcGx5KHQsYXJndW1lbnRzKX19ZnVuY3Rpb24gdShlLHQsbil7dmFyIG87Zm9yKHZhciBhIGluIGUpaWYoZVthXWluIHQpcmV0dXJuIG49PT0hMT9lW2FdOihvPXRbZVthXV0scihvLFwiZnVuY3Rpb25cIik/YyhvLG58fHQpOm8pO3JldHVybiExfWZ1bmN0aW9uIGYoZSl7cmV0dXJuIGUucmVwbGFjZSgvKFtBLVpdKS9nLGZ1bmN0aW9uKGUsdCl7cmV0dXJuXCItXCIrdC50b0xvd2VyQ2FzZSgpfSkucmVwbGFjZSgvXm1zLS8sXCItbXMtXCIpfWZ1bmN0aW9uIGQoKXt2YXIgZT10LmJvZHk7cmV0dXJuIGV8fChlPXMoYj9cInN2Z1wiOlwiYm9keVwiKSxlLmZha2U9ITApLGV9ZnVuY3Rpb24gcChlLG4scixvKXt2YXIgYSxpLGwsYyx1PVwibW9kZXJuaXpyXCIsZj1zKFwiZGl2XCIpLHA9ZCgpO2lmKHBhcnNlSW50KHIsMTApKWZvcig7ci0tOylsPXMoXCJkaXZcIiksbC5pZD1vP29bcl06dSsocisxKSxmLmFwcGVuZENoaWxkKGwpO3JldHVybiBhPXMoXCJzdHlsZVwiKSxhLnR5cGU9XCJ0ZXh0L2Nzc1wiLGEuaWQ9XCJzXCIrdSwocC5mYWtlP3A6ZikuYXBwZW5kQ2hpbGQoYSkscC5hcHBlbmRDaGlsZChmKSxhLnN0eWxlU2hlZXQ/YS5zdHlsZVNoZWV0LmNzc1RleHQ9ZTphLmFwcGVuZENoaWxkKHQuY3JlYXRlVGV4dE5vZGUoZSkpLGYuaWQ9dSxwLmZha2UmJihwLnN0eWxlLmJhY2tncm91bmQ9XCJcIixwLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIsYz1TLnN0eWxlLm92ZXJmbG93LFMuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixTLmFwcGVuZENoaWxkKHApKSxpPW4oZixlKSxwLmZha2U/KHAucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwKSxTLnN0eWxlLm92ZXJmbG93PWMsUy5vZmZzZXRIZWlnaHQpOmYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmKSwhIWl9ZnVuY3Rpb24gbSh0LHIpe3ZhciBvPXQubGVuZ3RoO2lmKFwiQ1NTXCJpbiBlJiZcInN1cHBvcnRzXCJpbiBlLkNTUyl7Zm9yKDtvLS07KWlmKGUuQ1NTLnN1cHBvcnRzKGYodFtvXSkscikpcmV0dXJuITA7cmV0dXJuITF9aWYoXCJDU1NTdXBwb3J0c1J1bGVcImluIGUpe2Zvcih2YXIgYT1bXTtvLS07KWEucHVzaChcIihcIitmKHRbb10pK1wiOlwiK3IrXCIpXCIpO3JldHVybiBhPWEuam9pbihcIiBvciBcIikscChcIkBzdXBwb3J0cyAoXCIrYStcIikgeyAjbW9kZXJuaXpyIHsgcG9zaXRpb246IGFic29sdXRlOyB9IH1cIixmdW5jdGlvbihlKXtyZXR1cm5cImFic29sdXRlXCI9PWdldENvbXB1dGVkU3R5bGUoZSxudWxsKS5wb3NpdGlvbn0pfXJldHVybiBufWZ1bmN0aW9uIGgoZSx0LG8sYSl7ZnVuY3Rpb24gYygpe2YmJihkZWxldGUgai5zdHlsZSxkZWxldGUgai5tb2RFbGVtKX1pZihhPXIoYSxcInVuZGVmaW5lZFwiKT8hMTphLCFyKG8sXCJ1bmRlZmluZWRcIikpe3ZhciB1PW0oZSxvKTtpZighcih1LFwidW5kZWZpbmVkXCIpKXJldHVybiB1fWZvcih2YXIgZixkLHAsaCxnLHY9W1wibW9kZXJuaXpyXCIsXCJ0c3BhblwiXTshai5zdHlsZTspZj0hMCxqLm1vZEVsZW09cyh2LnNoaWZ0KCkpLGouc3R5bGU9ai5tb2RFbGVtLnN0eWxlO2ZvcihwPWUubGVuZ3RoLGQ9MDtwPmQ7ZCsrKWlmKGg9ZVtkXSxnPWouc3R5bGVbaF0saShoLFwiLVwiKSYmKGg9bChoKSksai5zdHlsZVtoXSE9PW4pe2lmKGF8fHIobyxcInVuZGVmaW5lZFwiKSlyZXR1cm4gYygpLFwicGZ4XCI9PXQ/aDohMDt0cnl7ai5zdHlsZVtoXT1vfWNhdGNoKHkpe31pZihqLnN0eWxlW2hdIT1nKXJldHVybiBjKCksXCJwZnhcIj09dD9oOiEwfXJldHVybiBjKCksITF9ZnVuY3Rpb24gZyhlLHQsbixvLGEpe3ZhciBpPWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrZS5zbGljZSgxKSxzPShlK1wiIFwiK3cuam9pbihpK1wiIFwiKStpKS5zcGxpdChcIiBcIik7cmV0dXJuIHIodCxcInN0cmluZ1wiKXx8cih0LFwidW5kZWZpbmVkXCIpP2gocyx0LG8sYSk6KHM9KGUrXCIgXCIrXy5qb2luKGkrXCIgXCIpK2kpLnNwbGl0KFwiIFwiKSx1KHMsdCxuKSl9ZnVuY3Rpb24gdihlLHQscil7cmV0dXJuIGcoZSxuLG4sdCxyKX12YXIgeT1bXSxDPVtdLEU9e192ZXJzaW9uOlwiMy4wLjAtYWxwaGEuNFwiLF9jb25maWc6e2NsYXNzUHJlZml4OlwiXCIsZW5hYmxlQ2xhc3NlczohMCxlbmFibGVKU0NsYXNzOiEwLHVzZVByZWZpeGVzOiEwfSxfcTpbXSxvbjpmdW5jdGlvbihlLHQpe3ZhciBuPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3QobltlXSl9LDApfSxhZGRUZXN0OmZ1bmN0aW9uKGUsdCxuKXtDLnB1c2goe25hbWU6ZSxmbjp0LG9wdGlvbnM6bn0pfSxhZGRBc3luY1Rlc3Q6ZnVuY3Rpb24oZSl7Qy5wdXNoKHtuYW1lOm51bGwsZm46ZX0pfX0sTW9kZXJuaXpyPWZ1bmN0aW9uKCl7fTtNb2Rlcm5penIucHJvdG90eXBlPUUsTW9kZXJuaXpyPW5ldyBNb2Rlcm5penI7dmFyIFM9dC5kb2N1bWVudEVsZW1lbnQsYj1cInN2Z1wiPT09Uy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2J8fCFmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLHI9ZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGUuZG9jdW1lbnRFbGVtZW50O3JldHVybiBuLmlubmVySFRNTD1cIng8c3R5bGU+XCIrdCtcIjwvc3R5bGU+XCIsci5pbnNlcnRCZWZvcmUobi5sYXN0Q2hpbGQsci5maXJzdENoaWxkKX1mdW5jdGlvbiByKCl7dmFyIGU9Qy5lbGVtZW50cztyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZT9lLnNwbGl0KFwiIFwiKTplfWZ1bmN0aW9uIG8oZSx0KXt2YXIgbj1DLmVsZW1lbnRzO1wic3RyaW5nXCIhPXR5cGVvZiBuJiYobj1uLmpvaW4oXCIgXCIpKSxcInN0cmluZ1wiIT10eXBlb2YgZSYmKGU9ZS5qb2luKFwiIFwiKSksQy5lbGVtZW50cz1uK1wiIFwiK2UsYyh0KX1mdW5jdGlvbiBhKGUpe3ZhciB0PXlbZVtnXV07cmV0dXJuIHR8fCh0PXt9LHYrKyxlW2ddPXYseVt2XT10KSx0fWZ1bmN0aW9uIGkoZSxuLHIpe2lmKG58fChuPXQpLGYpcmV0dXJuIG4uY3JlYXRlRWxlbWVudChlKTtyfHwocj1hKG4pKTt2YXIgbztyZXR1cm4gbz1yLmNhY2hlW2VdP3IuY2FjaGVbZV0uY2xvbmVOb2RlKCk6aC50ZXN0KGUpPyhyLmNhY2hlW2VdPXIuY3JlYXRlRWxlbShlKSkuY2xvbmVOb2RlKCk6ci5jcmVhdGVFbGVtKGUpLCFvLmNhbkhhdmVDaGlsZHJlbnx8bS50ZXN0KGUpfHxvLnRhZ1Vybj9vOnIuZnJhZy5hcHBlbmRDaGlsZChvKX1mdW5jdGlvbiBzKGUsbil7aWYoZXx8KGU9dCksZilyZXR1cm4gZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7bj1ufHxhKGUpO2Zvcih2YXIgbz1uLmZyYWcuY2xvbmVOb2RlKCksaT0wLHM9cigpLGw9cy5sZW5ndGg7bD5pO2krKylvLmNyZWF0ZUVsZW1lbnQoc1tpXSk7cmV0dXJuIG99ZnVuY3Rpb24gbChlLHQpe3QuY2FjaGV8fCh0LmNhY2hlPXt9LHQuY3JlYXRlRWxlbT1lLmNyZWF0ZUVsZW1lbnQsdC5jcmVhdGVGcmFnPWUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCx0LmZyYWc9dC5jcmVhdGVGcmFnKCkpLGUuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihuKXtyZXR1cm4gQy5zaGl2TWV0aG9kcz9pKG4sZSx0KTp0LmNyZWF0ZUVsZW0obil9LGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1GdW5jdGlvbihcImgsZlwiLFwicmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49Zi5jbG9uZU5vZGUoKSxjPW4uY3JlYXRlRWxlbWVudDtoLnNoaXZNZXRob2RzJiYoXCIrcigpLmpvaW4oKS5yZXBsYWNlKC9bXFx3XFwtOl0rL2csZnVuY3Rpb24oZSl7cmV0dXJuIHQuY3JlYXRlRWxlbShlKSx0LmZyYWcuY3JlYXRlRWxlbWVudChlKSwnYyhcIicrZSsnXCIpJ30pK1wiKTtyZXR1cm4gbn1cIikoQyx0LmZyYWcpfWZ1bmN0aW9uIGMoZSl7ZXx8KGU9dCk7dmFyIHI9YShlKTtyZXR1cm4hQy5zaGl2Q1NTfHx1fHxyLmhhc0NTU3x8KHIuaGFzQ1NTPSEhbihlLFwiYXJ0aWNsZSxhc2lkZSxkaWFsb2csZmlnY2FwdGlvbixmaWd1cmUsZm9vdGVyLGhlYWRlcixoZ3JvdXAsbWFpbixuYXYsc2VjdGlvbntkaXNwbGF5OmJsb2NrfW1hcmt7YmFja2dyb3VuZDojRkYwO2NvbG9yOiMwMDB9dGVtcGxhdGV7ZGlzcGxheTpub25lfVwiKSksZnx8bChlLHIpLGV9dmFyIHUsZixkPVwiMy43LjJcIixwPWUuaHRtbDV8fHt9LG09L148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2ksaD0vXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2ksZz1cIl9odG1sNXNoaXZcIix2PTAseT17fTshZnVuY3Rpb24oKXt0cnl7dmFyIGU9dC5jcmVhdGVFbGVtZW50KFwiYVwiKTtlLmlubmVySFRNTD1cIjx4eXo+PC94eXo+XCIsdT1cImhpZGRlblwiaW4gZSxmPTE9PWUuY2hpbGROb2Rlcy5sZW5ndGh8fGZ1bmN0aW9uKCl7dC5jcmVhdGVFbGVtZW50KFwiYVwiKTt2YXIgZT10LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jbG9uZU5vZGV8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnR8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNyZWF0ZUVsZW1lbnR9KCl9Y2F0Y2gobil7dT0hMCxmPSEwfX0oKTt2YXIgQz17ZWxlbWVudHM6cC5lbGVtZW50c3x8XCJhYmJyIGFydGljbGUgYXNpZGUgYXVkaW8gYmRpIGNhbnZhcyBkYXRhIGRhdGFsaXN0IGRldGFpbHMgZGlhbG9nIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBoZWFkZXIgaGdyb3VwIG1haW4gbWFyayBtZXRlciBuYXYgb3V0cHV0IHBpY3R1cmUgcHJvZ3Jlc3Mgc2VjdGlvbiBzdW1tYXJ5IHRlbXBsYXRlIHRpbWUgdmlkZW9cIix2ZXJzaW9uOmQsc2hpdkNTUzpwLnNoaXZDU1MhPT0hMSxzdXBwb3J0c1Vua25vd25FbGVtZW50czpmLHNoaXZNZXRob2RzOnAuc2hpdk1ldGhvZHMhPT0hMSx0eXBlOlwiZGVmYXVsdFwiLHNoaXZEb2N1bWVudDpjLGNyZWF0ZUVsZW1lbnQ6aSxjcmVhdGVEb2N1bWVudEZyYWdtZW50OnMsYWRkRWxlbWVudHM6b307ZS5odG1sNT1DLGModCl9KHRoaXMsdCk7dmFyIHg9XCJNb3ogTyBtcyBXZWJraXRcIix3PUUuX2NvbmZpZy51c2VQcmVmaXhlcz94LnNwbGl0KFwiIFwiKTpbXTtFLl9jc3NvbVByZWZpeGVzPXc7dmFyIF89RS5fY29uZmlnLnVzZVByZWZpeGVzP3gudG9Mb3dlckNhc2UoKS5zcGxpdChcIiBcIik6W107RS5fZG9tUHJlZml4ZXM9Xzt2YXIgTj17ZWxlbTpzKFwibW9kZXJuaXpyXCIpfTtNb2Rlcm5penIuX3EucHVzaChmdW5jdGlvbigpe2RlbGV0ZSBOLmVsZW19KTt2YXIgaj17c3R5bGU6Ti5lbGVtLnN0eWxlfTtNb2Rlcm5penIuX3EudW5zaGlmdChmdW5jdGlvbigpe2RlbGV0ZSBqLnN0eWxlfSksRS50ZXN0QWxsUHJvcHM9ZyxFLnRlc3RBbGxQcm9wcz12LE1vZGVybml6ci5hZGRUZXN0KFwiZmxleGJveFwiLHYoXCJmbGV4QmFzaXNcIixcIjFweFwiLCEwKSksbygpLGEoeSksZGVsZXRlIEUuYWRkVGVzdCxkZWxldGUgRS5hZGRBc3luY1Rlc3Q7Zm9yKHZhciBrPTA7azxNb2Rlcm5penIuX3EubGVuZ3RoO2srKylNb2Rlcm5penIuX3Fba10oKTtlLk1vZGVybml6cj1Nb2Rlcm5penJ9KHdpbmRvdyxkb2N1bWVudCk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuRUxFTUVOVCBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyk7XG5cblxuXHQvLyBFbGVtZW50IEFuaW1hdGlvbnNcblx0ZnVuY3Rpb24gbWl4dEFuaW1hdGlvbnMoKSB7XG5cdFx0dmFyIGFuaW1FbGVtcyA9ICQoJy5taXh0LWFuaW1hdGUnKTtcblxuXHRcdGlmICggYW5pbUVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XG5cblx0XHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRhbmltRWxlbXMud2F5cG9pbnQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbS1wcmUnKS5hZGRDbGFzcygnYW5pbS1zdGFydCcpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5kZXN0cm95ID09PSAnZnVuY3Rpb24nICkgdGhpcy5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0b2Zmc2V0OiAnODUlJyxcblx0XHRcdFx0XHRcdHRyaWdnZXJPbmNlOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIDEwMDAgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRtaXh0QW5pbWF0aW9ucygpO1xuXG5cblx0Ly8gU3RhdCAvIENvdW50ZXIgRWxlbWVudFxuXHRmdW5jdGlvbiBtaXh0U3RhdHMoKSB7XG5cdFx0dmFyIHN0YXRFbGVtcyA9ICQoJy5taXh0LXN0YXQnKTtcblxuXHRcdGlmICggc3RhdEVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XG5cblx0XHQvLyBTZXQgc3RhdCB0ZXh0IHRvIHN0YXJ0aW5nIChmcm9tKSB2YWx1ZVxuXHRcdHN0YXRFbGVtcy5maW5kKCcuc3RhdC12YWx1ZScpLmVhY2goIGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKCdmcm9tJykpOyB9KTtcblxuXHRcdC8vIEFuaW1hdGUgdmFsdWVcblx0XHRmdW5jdGlvbiBzdGF0VmFsdWUoZWwpIHtcblx0XHRcdHZhciBmcm9tICA9IGVsLmRhdGEoJ2Zyb20nKSxcblx0XHRcdFx0dG8gICAgPSBlbC5kYXRhKCd0bycpLFxuXHRcdFx0XHRzcGVlZCA9IGVsLmRhdGEoJ3NwZWVkJyk7XG5cdFx0XHQkKHt2YWx1ZTogZnJvbX0pLmFuaW1hdGUoe3ZhbHVlOiB0b30sIHtcblx0XHRcdFx0ZHVyYXRpb246IHNwZWVkLFxuXHRcdFx0XHRzdGVwOiBmdW5jdGlvbigpIHsgZWwudGV4dChNYXRoLnJvdW5kKHRoaXMudmFsdWUpKTsgfSxcblx0XHRcdFx0YWx3YXlzOiBmdW5jdGlvbigpIHsgZWwudGV4dCh0byk7IH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIFJlbmRlciBDaXJjbGVcblx0XHRmdW5jdGlvbiBzdGF0Q2lyY2xlKHN0YXQpIHtcblx0XHRcdGlmICggdHlwZW9mICQuZm4uY2lyY2xlUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdHN0YXQuY2hpbGRyZW4oJy5zdGF0LWNpcmNsZScpLmNpcmNsZVByb2dyZXNzKHsgc2l6ZTogNTAwLCBsaW5lQ2FwOiAncm91bmQnIH0pLmNoaWxkcmVuKCcuY2lyY2xlLWlubmVyJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5jc3MoJ21hcmdpbi10b3AnLCAkKHRoaXMpLmhlaWdodCgpIC8gLTIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcblx0XHRcdHN0YXRFbGVtcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHN0YXQgPSAkKHRoaXMpO1xuXHRcdFx0XHRpZiAoIHR5cGVvZiAkLmZuLndheXBvaW50ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHN0YXQud2F5cG9pbnQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XG5cdFx0XHRcdFx0XHRzdGF0Q2lyY2xlKHN0YXQpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5kZXN0cm95ID09PSAnZnVuY3Rpb24nICkgdGhpcy5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0b2Zmc2V0OiAnYm90dG9tLWluLXZpZXcnLFxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcblx0XHRcdFx0XHRzdGF0Q2lyY2xlKHN0YXQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXHRtaXh0U3RhdHMoKTtcblxuXG5cdC8vIEZsaXAgQ2FyZCBFcXVhbGl6ZSBIZWlnaHRcblx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHR2YXIgZmxpcGNhcmRTaWRlcyA9ICQoJy5mbGlwLWNhcmQgLmZyb250LCAuZmxpcC1jYXJkIC5iYWNrJyk7XG5cdFx0ZmxpcGNhcmRTaWRlcy5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZmxpcGNhcmRTaWRlcy5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gRmxpcCBDYXJkIFRvdWNoIFNjcmVlbiBcIkhvdmVyXCJcblx0JCgnLm1peHQtZmxpcGNhcmQnKS5vbigndG91Y2hzdGFydCB0b3VjaGVuZCcsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ2hvdmVyJyk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkhFQURFUiBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cblxuXHR2YXIgdmlld3BvcnQgID0gJCh3aW5kb3cpLFxuXHRcdG1haW5OYXYgICA9ICQoJyNtYWluLW5hdicpLFxuXHRcdG1lZGlhV3JhcCA9ICQoJy5oZWFkLW1lZGlhJyk7XG5cblx0Ly8gSGVhZCBNZWRpYSBGdW5jdGlvbnNcblx0ZnVuY3Rpb24gaGVhZGVyRm4oKSB7XG5cdFx0dmFyIGNvbnRhaW5lciAgICA9IG1lZGlhV3JhcC5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxuXHRcdFx0bWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCksXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXG5cdFx0XHR2aWV3SGVpZ2h0ICAgPSB2aWV3cG9ydC5oZWlnaHQoKSAtIG1lZGlhV3JhcC5vZmZzZXQoKS50b3A7XG5cblx0XHQvLyBNYWtlIGhlYWRlciBmdWxsc2NyZWVuXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcblx0XHRcdHZhciBmdWxsSGVpZ2h0ID0gdmlld0hlaWdodDtcblxuXHRcdFx0bWVkaWFXcmFwLmNzcygnaGVpZ2h0Jywgd3JhcEhlaWdodCk7XG5cblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgJiYgISBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgKSB7XG5cdFx0XHRcdGZ1bGxIZWlnaHQgLT0gdG9wTmF2SGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCBmdWxsSGVpZ2h0KTtcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGZ1bGxIZWlnaHQpO1xuXHRcdH1cblxuXHRcdC8vIEFkZCBwYWRkaW5nIGJlaGluZCB0cmFuc3BhcmVudCBuYXZiYXIgdG8gcHJldmVudCBvdmVybGFwcGluZ1xuXHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1lZGlhQ29udC5sZW5ndGggPT0gMSApIHtcblx0XHRcdHZhciBjb250YWluZXJQYWQgPSB0b3BOYXZIZWlnaHQ7XG5cblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnBvc2l0aW9uID09ICdiZWxvdycgKSB7XG5cdFx0XHRcdGNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJywgY29udGFpbmVyUGFkKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnRhaW5lci5jc3MoJ3BhZGRpbmctdG9wJywgY29udGFpbmVyUGFkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBQcmV2ZW50IGNvbnRlbnQgZmFkZSBpZiBoZWFkZXIgaXMgdGFsbGVyIHRoYW4gdmlld3BvcnRcblx0XHRpZiAoIG1peHRfb3B0LmhlYWRlclsnY29udGVudC1mYWRlJ10gKSB7XG5cdFx0XHRpZiAoIHdyYXBIZWlnaHQgPiB2aWV3SGVpZ2h0ICkge1xuXHRcdFx0XHRtZWRpYVdyYXAuYWRkQ2xhc3MoJ25vLWZhZGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lZGlhV3JhcC5yZW1vdmVDbGFzcygnbm8tZmFkZScpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEhlYWRlciBTY3JvbGwgVG8gQ29udGVudFxuXHRmdW5jdGlvbiBoZWFkZXJTY3JvbGwoKSB7XG5cdFx0dmFyIHBhZ2UgICA9ICQoJ2h0bWwsIGJvZHknKSxcblx0XHRcdG9mZnNldCA9ICQoJyNjb250ZW50LXdyYXAnKS5vZmZzZXQoKS50b3A7XG5cdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICkgeyBvZmZzZXQgLT0gbWFpbk5hdi5jaGlsZHJlbignLmNvbnRhaW5lcicpLmhlaWdodCgpOyB9XG5cdFx0JCgnLmhlYWRlci1zY3JvbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHBhZ2UuYW5pbWF0ZSh7IHNjcm9sbFRvcDogb2Zmc2V0IH0sIDgwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIG1peHRfb3B0LmhlYWRlci5lbmFibGVkICkge1xuXHRcdGhlYWRlckZuKCk7XG5cblx0XHRpZiAoIG1peHRfb3B0LmhlYWRlci5zY3JvbGwgKSB7IGhlYWRlclNjcm9sbCgpOyB9XG5cdFx0XG5cdFx0JCh3aW5kb3cpLnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBoZWFkZXJGbiApKTtcblx0fVxuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkhFTFBFUiBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyBTa2lwIExpbmsgRm9jdXMgRml4XG5cdFxuXHR2YXIgaXNfd2Via2l0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICkgPiAtMSxcblx0XHRpc19vcGVyYSAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ29wZXJhJyApICA+IC0xLFxuXHRcdGlzX2llICAgICA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnbXNpZScgKSAgID4gLTE7XG5cblx0aWYgKCAoIGlzX3dlYmtpdCB8fCBpc19vcGVyYSB8fCBpc19pZSApICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICkgKSB7XG5cdFx0dmFyIGV2ZW50TWV0aG9kID0gKCB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ2F0dGFjaEV2ZW50Jztcblx0XHR3aW5kb3dbIGV2ZW50TWV0aG9kIF0oICdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsb2NhdGlvbi5oYXNoLnN1YnN0cmluZyggMSApICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhfGRpdikkL2kudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cblxuXHQvLyBBcHBseSBCb290c3RyYXAgQ2xhc3Nlc1xuXHRcblx0dmFyIHdvb0NvbW1XcmFwID0gJCgnLndvb2NvbW1lcmNlJyk7XG5cdFxuXHR2YXIgd2lkZ2V0TmF2TWVudXMgPSAnLndpZGdldF9tZXRhLCAud2lkZ2V0X3JlY2VudF9lbnRyaWVzLCAud2lkZ2V0X2FyY2hpdmUsIC53aWRnZXRfY2F0ZWdvcmllcywgLndpZGdldF9uYXZfbWVudSwgLndpZGdldF9wYWdlcywgLndpZGdldF9yc3MnO1xuXG5cdC8vIFdvb0NvbW1lcmNlIFdpZGdldHMgJiBFbGVtZW50c1xuXHRpZiAoIHdvb0NvbW1XcmFwLmxlbmd0aCApIHtcblx0XHR3aWRnZXROYXZNZW51cyArPSAnLCAud2lkZ2V0X3Byb2R1Y3RfY2F0ZWdvcmllcywgLndpZGdldF9wcm9kdWN0cywgLndpZGdldF90b3BfcmF0ZWRfcHJvZHVjdHMsIC53aWRnZXRfcmVjZW50X3Jldmlld3MsIC53aWRnZXRfcmVjZW50bHlfdmlld2VkX3Byb2R1Y3RzLCAud2lkZ2V0X2xheWVyZWRfbmF2JztcblxuXHRcdHdvb0NvbW1XcmFwLmZpbmQoJy5zaG9wX3RhYmxlJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLWJvcmRlcmVkJyk7XG5cblx0XHQkKGRvY3VtZW50LmJvZHkpLm9uKCd1cGRhdGVkX2NoZWNrb3V0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuc2hvcF90YWJsZScpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1zdHJpcGVkJyk7XG5cdFx0fSk7XG5cdH1cblxuXHQkKHdpZGdldE5hdk1lbnVzKS5jaGlsZHJlbigndWwnKS5hZGRDbGFzcygnbmF2Jyk7XG5cdCQoJy53aWRnZXRfbmF2X21lbnUgdWwubWVudScpLmFkZENsYXNzKCduYXYnKTtcblxuXHQkKCcjd3AtY2FsZW5kYXInKS5hZGRDbGFzcygndGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCcpO1xuXG5cdC8vIEhhbmRsZSBQb3N0IENvdW50IFRhZ3NcblxuXHQkKCcud2lkZ2V0X2FyY2hpdmUgbGksIC53aWRnZXRfY2F0ZWdvcmllcyBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyAgICAgPSAkKHRoaXMpLFxuXHRcdFx0Y2hpbGRyZW4gID0gJHRoaXMuY2hpbGRyZW4oKSxcblx0XHRcdGFuY2hvciAgICA9IGNoaWxkcmVuLmZpbHRlcignYScpLFxuXHRcdFx0Y29udGVudHMgID0gJHRoaXMuY29udGVudHMoKSxcblx0XHRcdGNvdW50VGV4dCA9IGNvbnRlbnRzLm5vdChjaGlsZHJlbikudGV4dCgpO1xuXG5cdFx0aWYgKCBjb3VudFRleHQgIT09ICcnICkge1xuXHRcdFx0YW5jaG9yLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJwb3N0LWNvdW50XCI+JyArIGNvdW50VGV4dCArICc8L3NwYW4+Jyk7XG5cdFx0XHRjb250ZW50cy5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlVHlwZSA9PT0gMzsgXG5cdFx0XHR9KS5yZW1vdmUoKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy53aWRnZXQud29vY29tbWVyY2UgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0Y291bnQgPSAkdGhpcy5jaGlsZHJlbignLmNvdW50JyksXG5cdFx0XHRsaW5rICA9ICR0aGlzLmNoaWxkcmVuKCdhJyk7XG5cdFx0Y291bnQuYXBwZW5kVG8obGluayk7XG5cdH0pO1xuXG5cdC8vIEdhbGxlcnkgQXJyb3cgTmF2aWdhdGlvblxuXG5cdCQoZG9jdW1lbnQpLmtleWRvd24oIGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdXJsID0gZmFsc2U7XG5cdFx0aWYgKCBlLndoaWNoID09PSAzNyApIHsgIC8vIExlZnQgYXJyb3cga2V5IGNvZGVcblx0XHRcdHVybCA9ICQoJy5wcmV2aW91cy1pbWFnZSBhJykuYXR0cignaHJlZicpO1xuXHRcdH0gZWxzZSBpZiAoIGUud2hpY2ggPT09IDM5ICkgeyAgLy8gUmlnaHQgYXJyb3cga2V5IGNvZGVcblx0XHRcdHVybCA9ICQoJy5lbnRyeS1hdHRhY2htZW50IGEnKS5hdHRyKCdocmVmJyk7XG5cdFx0fVxuXHRcdGlmICggdXJsICYmICggISQoJ3RleHRhcmVhLCBpbnB1dCcpLmlzKCc6Zm9jdXMnKSApICkge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsO1xuXHRcdH1cblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuTkFWQkFSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgY29sb3JMb0QsIGNvbG9yVG9SZ2JhICovXG5cblx0dmFyIHZpZXdwb3J0ICAgICA9ICQod2luZG93KSxcblx0XHRib2R5RWwgICAgICAgPSAkKCdib2R5JyksXG5cdFx0bWFpbldyYXAgICAgID0gJCgnI21haW4td3JhcCcpLFxuXHRcdG1haW5OYXZXcmFwICA9ICQoJyNtYWluLW5hdi13cmFwJyksXG5cdFx0bWFpbk5hdkJhciAgID0gJCgnI21haW4tbmF2JyksXG5cdFx0bWFpbk5hdkNvbnQgID0gbWFpbk5hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxuXHRcdG1haW5OYXZIZWFkICA9ICQoJy5uYXZiYXItaGVhZGVyJywgbWFpbk5hdkJhciksXG5cdFx0bWFpbk5hdklubmVyID0gJCgnLm5hdmJhci1pbm5lcicsIG1haW5OYXZCYXIpLFxuXHRcdHNlY05hdkJhciAgICA9ICQoJyNzZWNvbmQtbmF2JyksXG5cdFx0c2VjTmF2Q29udCAgID0gc2VjTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXG5cdFx0bmF2YmFycyAgICAgID0gJCgnLm5hdmJhcicpLFxuXHRcdG1lZGlhV3JhcCAgICA9ICQoJy5oZWFkLW1lZGlhJyk7XG5cblx0aWYgKCBtYWluTmF2QmFyLmxlbmd0aCA9PT0gMCApIHJldHVybjtcblxuXHR2YXIgTmF2YmFyID0ge1xuXG5cdFx0bmF2Qmc6ICcnLFxuXHRcdG5hdkJnVG9wOiAnJyxcblxuXHRcdC8vIEluaXRpYWxpemUgTmF2YmFyXG5cdFx0aW5pdDogZnVuY3Rpb24obmF2YmFyKSB7XG5cdFx0XHR2YXIgYmdDb2xvciAgPSBuYXZiYXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyksXG5cdFx0XHRcdGRhdGFDb250ID0gbmF2YmFyLmZpbmQoJy5uYXZiYXItZGF0YScpLFxuXHRcdFx0XHRjb2xvckx1bSA9IGRhdGFDb250Lmxlbmd0aCA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGFDb250WzBdLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cIi9nLCAnJykgOiAnJztcblxuXHRcdFx0aWYgKCBjb2xvckx1bSAhPSAnZGFyaycgJiYgY29sb3JMdW0gIT0gJ2xpZ2h0JyApIGNvbG9yTHVtID0gY29sb3JMb0QoYmdDb2xvcik7XG5cblx0XHRcdGlmICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkge1xuXG5cdFx0XHRcdHRoaXMubmF2QmcgPSAoIGNvbG9yTHVtID09ICdkYXJrJyApID8gJ2JnLWRhcmsnIDogJ2JnLWxpZ2h0Jztcblx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKHRoaXMubmF2QmcpO1xuXG5cdFx0XHRcdG1haW5OYXZCYXIuYXR0cignZGF0YS1iZycsIGNvbG9yTHVtKTtcblxuXHRcdFx0XHR2YXIgbmF2U2hlZXQgPSAkKCc8c3R5bGUgZGF0YS1pZD1cIm1peHQtbmF2LWNzc1wiPicpO1xuXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCAhPSAndmVydGljYWwnICkge1xuXHRcdFx0XHRcdG5hdlNoZWV0LmFwcGVuZCgnLm5hdmJhci5uYXZiYXItbWl4dDpub3QoLnBvc2l0aW9uLXRvcCkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yVG9SZ2JhKGJnQ29sb3IsIG1peHRfb3B0Lm5hdi5vcGFjaXR5KSsnOyB9Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCApIHtcblx0XHRcdFx0XHRuYXZTaGVldC5hcHBlbmQoJy5uYXYtdHJhbnNwYXJlbnQgLm5hdmJhci5uYXZiYXItbWl4dC5wb3NpdGlvbi10b3AgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yVG9SZ2JhKGJnQ29sb3IsIG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSkrJzsgfScpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddIDw9IDAuNCApIHtcblx0XHRcdFx0XHRcdGlmICggbWVkaWFXcmFwLmhhc0NsYXNzKCdiZy1kYXJrJykgKSB7IHRoaXMubmF2QmdUb3AgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWxpZ2h0JykgKSB7IHRoaXMubmF2QmdUb3AgPSAnYmctbGlnaHQnOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgdGhpcy5uYXZCZ1RvcCA9IHRoaXMubmF2Qmc7IH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5LnRvZ2dsZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMubmF2QmdUb3AgPSB0aGlzLm5hdkJnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnc3RhdGljJyApIHtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKHRoaXMubmF2QmcpLmFkZENsYXNzKHRoaXMubmF2QmdUb3ApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBuYXZTaGVldC5odG1sKCkgIT0gJycgKSB7XG5cdFx0XHRcdFx0bmF2U2hlZXQuYXBwZW5kVG8oJCgnaGVhZCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCBjb2xvckx1bSA9PSAnZGFyaycgKSB7XG5cdFx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKCdiZy1kYXJrJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmF2YmFyLmFkZENsYXNzKCdiZy1saWdodCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRuYXZiYXIucmVtb3ZlQ2xhc3MoJ2luaXQnKTtcblx0XHR9LFxuXG5cdFx0Ly8gU3RpY2t5IChmaXhlZCkgTmF2YmFyIEZ1bmN0aW9uc1xuXHRcdHN0aWNreToge1xuXHRcdFx0aXNNb2JpbGU6IGZhbHNlLFxuXHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0c2Nyb2xsQ29ycmVjdGlvbjogMCxcblxuXHRcdFx0Ly8gVHJpZ2dlciBvciB1cGRhdGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbihpc01vYmlsZSkge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IDA7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kuaXNNb2JpbGUgPSBpc01vYmlsZTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS5zY3JvbGxDb3JyZWN0aW9uID0gMDtcblxuXHRcdFx0XHRpZiAoIGlzTW9iaWxlID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgJC50aHJvdHRsZSg1MCwgTmF2YmFyLnN0aWNreS50b2dnbGUpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIE5hdmJhci5zdGlja3kudG9nZ2xlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5LnNjcm9sbENvcnJlY3Rpb24gKz0gcGFyc2VGbG9hdChtYWluV3JhcC5jc3MoJ3BhZGRpbmctdG9wJyksIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAnaG9yaXpvbnRhbCcgJiYgbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xuXHRcdFx0XHRcdHZhciBuYXZIZWlnaHQgPSBtYWluTmF2QmFyLmNzcygnaGVpZ2h0JywgJycpLm91dGVySGVpZ2h0KCksXG5cdFx0XHRcdFx0XHRuYXZQb3MgICAgPSBwYXJzZUludChtYWluTmF2QmFyLmNzcygndG9wJyksIDEwKTtcblx0XHRcdFx0XHROYXZiYXIuc3RpY2t5Lm9mZnNldCA9IG5hdkhlaWdodDtcblxuXHRcdFx0XHRcdGlmICggbmF2UG9zID09PSAwIHx8IGlzTmFOKG5hdlBvcykgKSB7XG5cdFx0XHRcdFx0XHRtYWluTmF2QmFyLmNzcygnbWFyZ2luLXRvcCcsIChuYXZIZWlnaHQgKiAtMSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdE5hdmJhci5zdGlja3kudG9nZ2xlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBUb2dnbGUgc3RpY2t5IHN0YXRlXG5cdFx0XHR0b2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wIC0gTmF2YmFyLnN0aWNreS5vZmZzZXQsXG5cdFx0XHRcdFx0c2Nyb2xsVmFsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0YmdUb3BDbHMgID0gTmF2YmFyLm5hdkJnVG9wO1xuXG5cdFx0XHRcdHNjcm9sbFZhbCA9ICggTmF2YmFyLnN0aWNreS5pc01vYmlsZSA9PT0gdHJ1ZSApID8gMCA6IHNjcm9sbFZhbCArIE5hdmJhci5zdGlja3kuc2Nyb2xsQ29ycmVjdGlvbjtcblxuXHRcdFx0XHRpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0ZWxzZSBpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWxpZ2h0JykgJiYgKCBOYXZiYXIubmF2QmcgIT0gJ2JnLWRhcmsnIHx8IG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSApIHsgYmdUb3BDbHMgPSAnYmctbGlnaHQnOyB9XG5cblx0XHRcdFx0aWYgKCBzY3JvbGxWYWwgPiBuYXZQb3MgJiYgKCBtaXh0X29wdC5uYXYubGF5b3V0ICE9ICd2ZXJ0aWNhbCcgfHwgISBOYXZiYXIuc3RpY2t5LmlzTW9iaWxlICkgKSB7ICBcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKE5hdmJhci5uYXZCZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKE5hdmJhci5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBNZW51IEZ1bmN0aW9uc1xuXHRcdG1lbnU6IHtcblxuXHRcdFx0Ly8gUHJldmVudCBuYXZiYXIgc3VibWVudSBvdmVyZmxvdyBvdXQgb2Ygdmlld3BvcnRcblx0XHRcdG92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcblx0XHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXG5cdFx0XHRcdFx0bWFpblN1YiA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51IC5kcm9wZG93bi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IC5zdWItbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiBhJyk7XG5cblx0XHRcdFx0aWYgKCBuYXZiYXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRuYXZiYXJPZmYgPSBuYXZiYXIub3V0ZXJXaWR0aCgpICsgcGFyc2VJbnQobmF2YmFyLm9mZnNldCgpLmxlZnQsIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc2V0IG1vYmlsZSBhZGp1c3RtZW50c1xuXHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcblxuXHRcdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXG5cdFx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHN1YiAgICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdHRvcFN1YiAgID0gc3ViLFxuXHRcdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXG5cdFx0XHRcdFx0XHRzdWJQb3MgICA9IHBhcnNlSW50KHN1Yi5vZmZzZXQoKS5sZWZ0LCAxMCksXG5cdFx0XHRcdFx0XHRzdWJXICAgICA9IHN1Yi5vdXRlcldpZHRoKCkgKyAxLFxuXHRcdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxuXHRcdFx0XHRcdFx0bmVzdFN1YnMgPSBzdWIuY2hpbGRyZW4oJy5kcm9wLXN1Ym1lbnUnKSxcblx0XHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IG5lc3RTdWJzLFxuXHRcdFx0XHRcdFx0Y29ycmVjdGlvbjtcblxuXHRcdFx0XHRcdGlmICggc3ViUGFyLmlzKCcubWVnYS1tZW51LWNvbHVtbicpICkge1xuXHRcdFx0XHRcdFx0dG9wU3ViID0gc3ViUGFyLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XG5cdFx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUb3AgTGV2ZWwgU3VibWVudXNcblx0XHRcdFx0XHRpZiAoIG5lc3RPZmYgPiBuYXZiYXJPZmYgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0XHRcdFx0XHRjb3JyZWN0aW9uID0gKG5lc3RPZmYgLSBuYXZiYXJPZmYgLSAyKSAqIC0xO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHRvcFN1Yi5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpID09ICcxcHgnICkgeyBjb3JyZWN0aW9uIC09IDE7IH1cblxuXHRcdFx0XHRcdFx0aWYgKCBuYXZiYXIuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgfHwgbmF2YmFyLnBhcmVudHMoJy5uYXZiYXInKS5oYXNDbGFzcygnYm9yZGVyZWQnKSApIHsgY29ycmVjdGlvbiAtPSAxOyB9XG5cblx0XHRcdFx0XHRcdGlmICggY29ycmVjdGlvbiA8IG1nTm93ICkge1xuXHRcdFx0XHRcdFx0XHR0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcsIGNvcnJlY3Rpb24gKyAncHgnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdE5hdmJhci5tZW51LnNldERyb3BMZWZ0KG92ZXJmbG93aW5nU3Vicyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXG5cdFx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3ViTm93ICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXID0gW107XG5cdFx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgICAgPSAkKHRoaXMpLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHMgID0gJHRoaXMucGFyZW50cygnLnN1Yi1tZW51JyksXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xuXG5cdFx0XHRcdFx0XHRcdHBhcmVudHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudHNXICs9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0bmVzdFN1YnNXW2ldID0gJHRoaXMub3V0ZXJXaWR0aCgpICsgcGFyZW50c1c7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAobmVzdE9mZiArIG1heE5lc3RXKSA+PSBib2R5RWwud2lkdGgoKSApIHtcblx0XHRcdFx0XHRcdFx0TmF2YmFyLm1lbnUuc2V0RHJvcExlZnQoc3ViTm93KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdE5hdmJhci5tZW51LnJlc2V0QXJyb3coc3ViTm93KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gU2V0IG1lbnUgZHJvcCBsZWZ0XG5cdFx0XHRzZXREcm9wTGVmdDogZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0XHRcdHRhcmdldC5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcC1sZWZ0Jyk7XG5cdFx0XHRcdGlmICggdGFyZ2V0Lmhhc0NsYXNzKCdhcnJvdy1sZWZ0JykgfHwgdGFyZ2V0Lmhhc0NsYXNzKCdhcnJvdy1yaWdodCcpICkge1xuXHRcdFx0XHRcdHRhcmdldC5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xuXHRcdFx0XHRcdHRhcmdldC5maW5kKCcuZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly8gUmVzZXQgbWVudSBkcm9wXG5cdFx0XHRyZXNldEFycm93OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQnKTtcblx0XHRcdFx0aWYgKCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LWxlZnQnKSB8fCB0YXJnZXQuaGFzQ2xhc3MoJ2Fycm93LXJpZ2h0JykgKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBNZWdhIG1lbnUgZW5hYmxlIC8gZGlzYWJsZVxuXHRcdFx0bWVnYU1lbnVUb2dnbGU6IGZ1bmN0aW9uKHRvZ2dsZSwgbmF2YmFyKSB7XG5cdFx0XHRcdHZhciBtZWdhTWVudXM7XG5cblx0XHRcdFx0aWYgKCB0b2dnbGUgPT0gJ2VuYWJsZScgKSB7XG5cdFx0XHRcdFx0bWVnYU1lbnVzID0gbmF2YmFyLmZpbmQoJy5kcm9wLW1lbnVbZGF0YS1tZWdhLW1lbnU9XCJ0cnVlXCJdJyk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdFx0bWVnYU1lbnUuYWRkQ2xhc3MoJ21lZ2EtbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLW1lbnUnKS5yZW1vdmVBdHRyKCdkYXRhLW1lZ2EtbWVudScpO1xuXHRcdFx0XHRcdFx0JCgnPiAuc3ViLW1lbnUgPiAuZHJvcC1zdWJtZW51JywgbWVnYU1lbnUpLnJlbW92ZUNsYXNzKCdkcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG1lZ2FNZW51cy5jaGlsZHJlbigndWwnKS5jc3MoJ21hcmdpbi1sZWZ0JywgJycpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCB0b2dnbGUgPT0gJ2Rpc2FibGUnICkge1xuXHRcdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcubWVnYS1tZW51Jyk7XG5cdFx0XHRcdFx0bWVnYU1lbnVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdFx0bWVnYU1lbnUucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudScpLmFkZENsYXNzKCdkcm9wLW1lbnUnKS5hdHRyKCdkYXRhLW1lZ2EtbWVudScsICd0cnVlJyk7XG5cdFx0XHRcdFx0XHRtZWdhTWVudS5maW5kKCcubWVnYS1tZW51LWNvbHVtbicpLnJlbW92ZUNsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykuYWRkQ2xhc3MoJ2Ryb3Atc3VibWVudScpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG1lZ2FNZW51cy5jaGlsZHJlbigndWwnKS5jc3MoJ21hcmdpbi1sZWZ0JywgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBDcmVhdGUgbWVnYSBtZW51IHJvd3MgaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiA0IGNvbHVtbnNcblx0XHRcdG1lZ2FNZW51Um93czogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG1haW5XcmFwLmZpbmQoJy5tZWdhLW1lbnUnKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgbWFpbk1lbnUgPSAkKHRoaXMpLmNoaWxkcmVuKCcuc3ViLW1lbnUnKSxcblx0XHRcdFx0XHRcdGNvbHVtbnMgID0gbWFpbk1lbnUuY2hpbGRyZW4oJy5tZWdhLW1lbnUtY29sdW1uJyk7XG5cblx0XHRcdFx0XHRpZiAoIGNvbHVtbnMubGVuZ3RoID4gNCApIG1haW5NZW51LmFkZENsYXNzKCdtdWx0aS1yb3cnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBNb2JpbGUgRnVuY3Rpb25zXG5cdFx0bW9iaWxlOiB7XG5cblx0XHRcdGRldmljZTogbnVsbCxcblxuXHRcdFx0Ly8gVHJpZ2dlciBtb2JpbGUgZnVuY3Rpb25zXG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbihkZXZpY2UpIHtcblx0XHRcdFx0TmF2YmFyLm1vYmlsZS5kZXZpY2UgPSBkZXZpY2U7XG5cblx0XHRcdFx0Ly8gU2hvdy9oaWRlIHN1Ym1lbnVzIG9uIGhhbmRsZSBjbGlja1xuXHRcdFx0XHQkKCcuZHJvcGRvd24tdG9nZ2xlJywgbWFpbk5hdkJhcikub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmICggJChldmVudC50YXJnZXQpLmlzKCcuZHJvcC1hcnJvdycpICkge1xuXHRcdFx0XHRcdFx0aWYoIGV2ZW50LmhhbmRsZWQgIT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBoYW5kbGUgPSAkKHRoaXMpLFxuXHRcdFx0XHRcdFx0XHRcdG1lbnUgICA9IGhhbmRsZS5jbG9zZXN0KCcubWVudS1pdGVtJyk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCBtZW51Lmhhc0NsYXNzKCdleHBhbmQnKSApIHtcblx0XHRcdFx0XHRcdFx0XHRtZW51LnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcblx0XHRcdFx0XHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWVudSkucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG1lbnUuYWRkQ2xhc3MoJ2V4cGFuZCcpLnNpYmxpbmdzKCdsaScpLnJlbW92ZUNsYXNzKCdleHBhbmQnKS5maW5kKCcuZXhwYW5kJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxOYXYoKTtcblxuXHRcdFx0XHRcdFx0XHRldmVudC5oYW5kbGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRtYWluTmF2SW5uZXIub24oJ3Nob3duLmJzLmNvbGxhcHNlIGhpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtYWluTmF2QmFyKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxOYXYoKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxOYXYoKTtcblx0XHRcdH0sXG5cblx0XHRcdHNjcm9sbFBvczogMCxcblxuXHRcdFx0Ly8gRW5hYmxlIG5hdiBzY3JvbGxpbmcgaWYgbmF2YmFyIGhlaWdodCA+IHZpZXdwb3J0XG5cdFx0XHRzY3JvbGxOYXY6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgTmF2YmFyLm1vYmlsZS5kZXZpY2UgPT0gJ3RhYmxldCcgKSB7XG5cdFx0XHRcdFx0dmFyIHZpZXdwb3J0SCAgICAgPSB2aWV3cG9ydC5oZWlnaHQoKSxcblx0XHRcdFx0XHRcdG5hdmJhckhlYWRlckggPSBtYWluTmF2SGVhZC5oZWlnaHQoKSArIDEsXG5cdFx0XHRcdFx0XHRuYXZiYXJJbm5lckggID0gbWFpbk5hdklubmVyLmhhc0NsYXNzKCdpbicpID8gbWFpbk5hdklubmVyLmhlaWdodCgpIDogMCxcblx0XHRcdFx0XHRcdG5hdmJhckggICAgICAgPSBuYXZiYXJIZWFkZXJIICsgbmF2YmFySW5uZXJILFxuXHRcdFx0XHRcdFx0bmF2YmFyTWcgICAgICA9IDAsXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgICAgID0gbWFpbk5hdkJhci5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wO1xuXG5cdFx0XHRcdFx0TmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wIC09IGFkbWluQmFySDtcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xuXHRcdFx0XHRcdFx0bmF2YmFyTWcgPSBuYXZiYXJIZWFkZXJIICogLTE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBuYXZiYXJIID4gdmlld3BvcnRIICkge1xuXHRcdFx0XHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsIE5hdmJhci5tb2JpbGUuc3RvcFNjcm9sbCk7XG5cdFx0XHRcdFx0XHRpZiAoIG1haW5OYXZCYXIubm90KCdzdG9wcGVkJykgKSB7XG5cdFx0XHRcdFx0XHRcdG1haW5OYXZCYXIuYWRkQ2xhc3MoJ3N0b3BwZWQnKS5jc3MoeyAncG9zaXRpb24nOiAnYWJzb2x1dGUnLCAndG9wJzogKG5hdmJhclRvcCAtIG5hdndyYXBUb3ApLCAnbWFyZ2luLXRvcCc6ICcwJyB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBOYXZiYXIubW9iaWxlLnN0b3BTY3JvbGwpO1xuXHRcdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnLCAnbWFyZ2luLXRvcCc6IG5hdmJhck1nIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBQcmV2ZW50IHNjcm9sbGluZyBhYm92ZSBuYXZiYXJcblx0XHRcdHN0b3BTY3JvbGw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgdmlld1Njcm9sbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdHN0b3BTY3JvbGwgPSBtYWluTmF2QmFyLmhhc0NsYXNzKCdzdG9wcGVkJyk7XG5cdFx0XHRcdGlmICggTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MgPiBtYWluTmF2SGVhZC5vZmZzZXQoKS50b3AgKSB7IHN0b3BTY3JvbGwgPSBmYWxzZTsgfVxuXHRcdFx0XHRpZiAoIE5hdmJhci5tb2JpbGUuc2Nyb2xsUG9zID4gdmlld1Njcm9sbCAmJiBzdG9wU2Nyb2xsICkgeyB2aWV3cG9ydC5zY3JvbGxUb3AoTmF2YmFyLm1vYmlsZS5zY3JvbGxQb3MpOyB9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0TmF2YmFyLmluaXQoJCh0aGlzKSk7XG5cdH0pO1xuXHRcblx0TmF2YmFyLm1lbnUubWVnYU1lbnVSb3dzKCk7XG5cblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdCQoJ3N0eWxlW2RhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIl0nKS5yZW1vdmUoKTtcblx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJykuYWRkQ2xhc3MoJ2luaXQnKTtcblx0XHROYXZiYXIuaW5pdChtYWluTmF2QmFyKTtcblxuXHR9KTtcblxuXHRzZWNOYXZCYXIub24oJ3JlZnJlc2gnLCBmdW5jdGlvbigpIHtcblx0XHRzZWNOYXZCYXIucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0IGJnLWRhcmsnKTtcblx0XHROYXZiYXIuaW5pdChzZWNOYXZCYXIpO1xuXHR9KTtcblxuXG5cdC8vIENoZWNrIHdoaWNoIG1lZGlhIHF1ZXJpZXMgYXJlIGFjdGl2ZVxuXHR2YXIgbXFDaGVjayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2YmFyLWRhdGEnKSwgJzphZnRlcicpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cIi9nLCAnJyk7XG5cdH07XG5cblxuXHQvLyBFbmFibGUgbWVudSBob3ZlciBvbiB0b3VjaCBzY3JlZW5zXG5cdHZhciBtZW51UGFyZW50cyA9IG5hdmJhcnMuZmluZCgnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIGxpLmRyb3Bkb3duJyk7XG5cdGZ1bmN0aW9uIG1lbnVUb3VjaEhvdmVyKGV2ZW50KSB7XG5cdFx0dmFyIGxpbmsgPSAkKGV2ZW50LmRlbGVnYXRlVGFyZ2V0KSxcblx0XHRcdGFuY2VzdG9ycyA9IGxpbmsucGFyZW50cygnLmhvdmVyJyk7XG5cdFx0aWYgKGxpbmsuaGFzQ2xhc3MoJ2hvdmVyJykpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsaW5rLmFkZENsYXNzKCdob3ZlcicpO1xuXHRcdFx0bWVudVBhcmVudHMubm90KGxpbmspLm5vdChhbmNlc3RvcnMpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gbWVudVRvdWNoUmVtb3ZlSG92ZXIoZXZlbnQpIHtcblx0XHRpZiAoICEgJChldmVudC5kZWxlZ2F0ZVRhcmdldCkuaXMobWVudVBhcmVudHMpICkgeyBtZW51UGFyZW50cy5yZW1vdmVDbGFzcygnaG92ZXInKTsgfVxuXHR9XG5cblxuXHQvLyBFbnN1cmUgdmVydGljYWwgbmF2YmFyIGl0ZW1zIGZpdCBpbiB2aWV3cG9ydFxuXHRmdW5jdGlvbiB2ZXJ0aWNhbE5hdkZpdFZpZXcoKSB7XG5cdFx0aWYgKCB2aWV3cG9ydC5oZWlnaHQoKSA8IG1haW5OYXZDb250LmlubmVySGVpZ2h0KCkgKSB7XG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtZml4ZWQnKS5hZGRDbGFzcygndmVydGljYWwtc3RhdGljJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKCd2ZXJ0aWNhbC1zdGF0aWMnKS5hZGRDbGFzcygndmVydGljYWwtZml4ZWQnKTtcblx0XHR9XG5cdH1cblxuXG5cdC8vIEhhbmRsZSBuYXZiYXIgaXRlbXMgb3ZlcmxhcFxuXHRmdW5jdGlvbiBuYXZiYXJPdmVybGFwKCkge1xuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soKSxcblx0XHRcdG1haW5OYXZMb2dvQ2xzID0gJ2xvZ28tJyArIG1haW5OYXZXcmFwLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicpO1xuXG5cdFx0Ly8gUHJpbWFyeSBOYXZiYXJcblx0XHRpZiAoIG1haW5OYXZMb2dvQ2xzICE9ICdsb2dvLWNlbnRlcicgJiYgbWl4dF9vcHQubmF2LmxheW91dCA9PSAnaG9yaXpvbnRhbCcgKSB7XG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygnbG9nby1jZW50ZXInKS5hZGRDbGFzcyhtYWluTmF2TG9nb0Nscyk7XG5cdFx0XHRpZiAoIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdFx0dmFyIG1haW5OYXZDb250V2lkdGggPSBtYWluTmF2Q29udC53aWR0aCgpLFxuXHRcdFx0XHRcdG1haW5OYXZJdGVtc1dpZHRoID0gbWFpbk5hdkhlYWQub3V0ZXJXaWR0aCh0cnVlKSArICQoJyNtYWluLW1lbnUnKS5vdXRlcldpZHRoKHRydWUpO1xuXHRcdFx0XHRpZiAoIG1haW5OYXZJdGVtc1dpZHRoID4gbWFpbk5hdkNvbnRXaWR0aCApIHtcblx0XHRcdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcyhtYWluTmF2TG9nb0NscykuYWRkQ2xhc3MoJ2xvZ28tY2VudGVyJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZWNvbmRhcnkgTmF2YmFyXG5cdFx0aWYgKCBzZWNOYXZCYXIubGVuZ3RoICkge1xuXHRcdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdpdGVtcy1vdmVybGFwJyk7XG5cdFx0XHR2YXIgc2VjTmF2Q29udFdpZHRoID0gc2VjTmF2Q29udC5pbm5lcldpZHRoKCksXG5cdFx0XHRcdHNlY05hdkl0ZW1zV2lkdGggPSAkKCcubGVmdC1jb250ZW50Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0LWNvbnRlbnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XG5cdFx0XHRcdHNlY05hdkJhci5hZGRDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cblx0Ly8gRnVuY3Rpb25zIFJ1biBPbiBMb2FkICYgV2luZG93IFJlc2l6ZVxuXHRmdW5jdGlvbiBuYXZiYXJGbigpIHtcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCk7XG5cblx0XHQvLyBSdW4gZnVuY3Rpb24gdG8gcHJldmVudCBzdWJtZW51cyBnb2luZyBvdXRzaWRlIHZpZXdwb3J0XG5cdFx0bmF2YmFycy5ub3QobWFpbk5hdkJhcikuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHROYXZiYXIubWVudS5vdmVyZmxvdygkKCcubmF2YmFyLWlubmVyJywgdGhpcykpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gUnVuIGZ1bmN0aW9ucyBiYXNlZCBvbiBjdXJyZW50bHkgYWN0aXZlIG1lZGlhIHF1ZXJ5XG5cdFx0aWYgKCBtcU5hdiA9PSAnZGVza3RvcCcgKSB7XG5cdFx0XHROYXZiYXIubWVudS5vdmVyZmxvdyhtYWluTmF2SW5uZXIpO1xuXHRcdFx0bWFpbk5hdkJhci5jc3MoJ2hlaWdodCcsICcnKTtcblx0XHRcdG1haW5XcmFwLmFkZENsYXNzKCduYXYtZnVsbCcpLnJlbW92ZUNsYXNzKCduYXYtbWluaScpO1xuXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHROYXZiYXIubWVudS5tZWdhTWVudVRvZ2dsZSgnZW5hYmxlJywgJCh0aGlzKSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bWVudVBhcmVudHMub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XG5cdFx0XHRib2R5RWwub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fSBlbHNlIGlmICggbXFOYXYgPT0gJ21vYmlsZScgfHwgbXFOYXYgPT0gJ3RhYmxldCcgKSB7XG5cdFx0XHROYXZiYXIubW9iaWxlLnRyaWdnZXIobXFOYXYpO1xuXG5cdFx0XHR2YXIgbmF2SGVpZ2h0ID0gbWFpbk5hdkhlYWQub3V0ZXJIZWlnaHQoKSArIDE7XG5cdFx0XHRtYWluTmF2QmFyLmNzcygnaGVpZ2h0JywgbmF2SGVpZ2h0KTtcblx0XHRcdG1haW5XcmFwLmFkZENsYXNzKCduYXYtbWluaScpLnJlbW92ZUNsYXNzKCduYXYtZnVsbCcpO1xuXG5cdFx0XHRuYXZiYXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHROYXZiYXIubWVudS5tZWdhTWVudVRvZ2dsZSgnZGlzYWJsZScsICQodGhpcykpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1lbnVQYXJlbnRzLm9mZigndG91Y2hzdGFydCcsIG1lbnVUb3VjaEhvdmVyKTtcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7XG5cdFx0XHRpZiAoIG1xTmF2ID09ICdtb2JpbGUnICkge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIodHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHROYXZiYXIuc3RpY2t5LnRyaWdnZXIoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICkge1xuXHRcdFx0aWYgKCBtcU5hdiA9PSAndGFibGV0JyApIHtcblx0XHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygnc3RpY2t5Jyk7XG5cdFx0XHRcdE5hdmJhci5zdGlja3kudHJpZ2dlcihmYWxzZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcblx0XHRcdFx0TmF2YmFyLnN0aWNreS50cmlnZ2VyKHRydWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdwb3NpdGlvbi10b3AnKTtcblx0XHR9XG5cblx0XHQvLyBWZXJ0aWNhbCBuYXZiYXIgaGFuZGxpbmdcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICYmIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdC8vIE1ha2UgbmF2YmFyIHN0YXRpYyBpZiBpdGVtcyBkb24ndCBmaXQgaW4gdmlld3BvcnRcblx0XHRcdHZlcnRpY2FsTmF2Rml0VmlldygpO1xuXHRcdH1cblxuXHRcdG5hdmJhck92ZXJsYXAoKTtcblx0fVxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgbmF2YmFyRm4gKSkucmVzaXplKCk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuUE9TVCBGVU5DVElPTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGlmcmFtZUFzcGVjdCwgTW9kZXJuaXpyICovXG5cblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxuXHRcdGNvbnRlbnQgID0gJCgnI2NvbnRlbnQnKTtcblxuXHQvLyBSZXNpemUgRW1iZWRkZWQgVmlkZW9zIFByb3BvcnRpb25hbGx5XG5cdGlmcmFtZUFzcGVjdCggJCgnLnBvc3QgaWZyYW1lJykgKTtcblxuXHQvLyBQb3N0IExheW91dFxuXHRmdW5jdGlvbiBwb3N0c1BhZ2UoKSB7XG5cblx0XHRjb250ZW50LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIEZlYXR1cmVkIEdhbGxlcnkgU2xpZGVyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHR2YXIgZ2FsbGVyeVNsaWRlciA9ICQoJy5nYWxsZXJ5LXNsaWRlcicpLm5vdCgnLmxpZ2h0U2xpZGVyJyk7XG5cdFx0XHRcdGdhbGxlcnlTbGlkZXIubGlnaHRTbGlkZXIoe1xuXHRcdFx0XHRcdGl0ZW06IDEsXG5cdFx0XHRcdFx0YXV0bzogdHJ1ZSxcblx0XHRcdFx0XHRsb29wOiB0cnVlLFxuXHRcdFx0XHRcdHBhZ2VyOiBmYWxzZSxcblx0XHRcdFx0XHRwYXVzZTogNTAwMCxcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRHYWxsZXJ5ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHQkKCcubGlnaHRib3gtZ2FsbGVyeScpLmxpZ2h0R2FsbGVyeSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBFcXVhbGl6ZSBmZWF0dXJlZCBtZWRpYSBoZWlnaHQgZm9yIHJlbGF0ZWQgcG9zdHMgYW5kIGdyaWQgYmxvZ1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0JC5mbi5tYXRjaEhlaWdodC5fbWFpbnRhaW5TY3JvbGwgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdFx0JCgnLmJsb2ctZ3JpZCAucG9zdHMtY29udGFpbmVyIC5wb3N0LWZlYXQnKS5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XG5cblx0XHRcdFx0aWYgKCAhIE1vZGVybml6ci5mbGV4Ym94ICkge1xuXHRcdFx0XHRcdCQoJy5ibG9nLWdyaWQgLnBvc3RzLWNvbnRhaW5lciBhcnRpY2xlJykuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xuXG5cdFx0XHRcdFx0dmFyIG1hdGNoSGVpZ2h0RWwgPSAkKCcucG9zdC1yZWxhdGVkIC5wb3N0LWZlYXQnKSxcblx0XHRcdFx0XHRcdG1hdGNoSGVpZ2h0VGFyZ2V0ID0gbWF0Y2hIZWlnaHRFbC5maW5kKCcud3AtcG9zdC1pbWFnZScpO1xuXHRcdFx0XHRcdGlmICggbWF0Y2hIZWlnaHRUYXJnZXQubGVuZ3RoID09PSAwICkgbWF0Y2hIZWlnaHRUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHRcdG1hdGNoSGVpZ2h0RWwuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCh7XG5cdFx0XHRcdFx0XHR0YXJnZXQ6IG1hdGNoSGVpZ2h0VGFyZ2V0LFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXG5cblx0Ly8gTG9hZCBQb3N0cyAmIENvbW1lbnRzIHZpYSBBamF4XG5cdGZ1bmN0aW9uIG1peHRBamF4TG9hZCh0eXBlKSB7XG5cdFx0dHlwZSA9IHR5cGUgfHwgJ3Bvc3RzJztcblx0XHR2YXIgcGFnQ29udCA9ICQoJy5wYWdpbmctbmF2aWdhdGlvbicpLFxuXHRcdFx0YWpheEJ0biA9ICQoJy5hamF4LW1vcmUnLCBwYWdDb250KTtcblxuXHRcdGlmICggISBwYWdDb250Lmxlbmd0aCB8fCAhIGFqYXhCdG4ubGVuZ3RoICkgcmV0dXJuO1xuXHRcdFxuXHRcdHZhciBwYWdlTm93ID0gcGFnQ29udC5kYXRhKCdwYWdlLW5vdycpLFxuXHRcdFx0cGFnZU1heCA9IHBhZ0NvbnQuZGF0YSgncGFnZS1tYXgnKSxcblx0XHRcdG5leHRVcmwgPSBhamF4QnRuLmF0dHIoJ2hyZWYnKSxcblx0XHRcdHBhZ2VOdW0sXG5cdFx0XHRwYWdlVHlwZSxcblx0XHRcdGNvbnRhaW5lcixcblx0XHRcdGVsZW1lbnQsXG5cdFx0XHRsb2FkU2VsO1xuXG5cdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgnLnBvc3RzLWNvbnRhaW5lcicpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5hcnRpY2xlJztcblx0XHRcdGxvYWRTZWwgICA9ICcgLnBvc3RzLWNvbnRhaW5lciAuYXJ0aWNsZSc7XG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnc2hvcCcgKSB7XG5cdFx0XHRwYWdlVHlwZSAgPSBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgndWwucHJvZHVjdHMnKTtcblx0XHRcdGVsZW1lbnQgICA9ICcucHJvZHVjdCc7XG5cdFx0XHRsb2FkU2VsICAgPSAnIHVsLnByb2R1Y3RzID4gbGknO1xuXHRcdH0gZWxzZSBpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXTtcblx0XHRcdGNvbnRhaW5lciA9ICQoJy5jb21tZW50LWxpc3QnKTtcblx0XHRcdGVsZW1lbnQgICA9ICcuY29tbWVudCc7XG5cdFx0XHRsb2FkU2VsICAgPSAnIC5jb21tZW50LWxpc3QgPiBsaSc7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddID09ICduZXdlc3QnICkge1xuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgLSAxO1xuXHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFnZU51bSA9IHBhZ2VOb3cgKyAxO1xuXHRcdH1cblxuXHRcdGlmICggKCBwYWdlTm93ID49IHBhZ2VNYXggKSAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gIT0gJ25ld2VzdCcgfHwgcGFnZU51bSA8PSAwICkge1xuXHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XG5cdFx0fVxuXHRcdFxuXHRcdGFqYXhCdG4ub24oJ2NsaWNrIGNvbnQ6Ym90dG9tJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBQcmV2ZW50IGxvYWRpbmcgdHdpY2Ugb24gc2Nyb2xsXG5cdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xuXHRcdFxuXHRcdFx0Ly8gQXJlIHRoZXJlIG1vcmUgcGFnZXMgdG8gbG9hZD9cblx0XHRcdGlmICggcGFnZU51bSA+IDAgJiYgcGFnZU51bSA8PSBwYWdlTWF4ICkge1xuXHRcdFx0XG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdsb2FkaW5nJyk7XG5cblx0XHRcdFx0Ly8gTG9hZCBwb3N0c1xuXHRcdFx0XHQvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xuXHRcdFx0XHQkKCc8ZGl2PicpLmxvYWQobmV4dFVybCArIGxvYWRTZWwsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhocikge1xuXHRcdFx0XHRcdHZhciBuZXdQb3N0cyA9ICQodGhpcyk7XG5cblx0XHRcdFx0XHRhamF4QnRuLmJsdXIoKTtcblxuXHRcdFx0XHRcdG5ld1Bvc3RzLmNoaWxkcmVuKGVsZW1lbnQpLmFkZENsYXNzKCdhamF4LW5ldycpO1xuXHRcdFx0XHRcdGlmICggKCB0eXBlID09ICdwb3N0cycgfHwgdHlwZSA9PSAnc2hvcCcgKSAmJiBtaXh0X29wdC5sYXlvdXQudHlwZSAhPSAnbWFzb25yeScgJiYgbWl4dF9vcHQubGF5b3V0WydzaG93LXBhZ2UtbnInXSApIHtcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJhamF4LXBhZ2UgcGFnZS0nKyBwYWdlTnVtICsnXCI+PGEgaHJlZj1cIicrIG5leHRVcmwgKydcIj5QYWdlICcrIHBhZ2VOdW0gKyc8L2E+PC9kaXY+Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmQobmV3UG9zdHMuaHRtbCgpKTtcblxuXHRcdFx0XHRcdG5ld1Bvc3RzID0gY29udGFpbmVyLmNoaWxkcmVuKCcuYWpheC1uZXcnKTtcblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSBwYWdlIG51bWJlciBhbmQgbmV4dFVybFxuXHRcdFx0XHRcdGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0tLTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL2NvbW1lbnQtcGFnZS1bMC05XT8vLCAnL2NvbW1lbnQtcGFnZS0nICsgcGFnZU51bSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcblx0XHRcdFx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL3BhZ2VcXC9bMC05XT8vLCAnL3BhZ2UvJyArIHBhZ2VOdW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGJ1dHRvbiBzdGF0ZVxuXHRcdFx0XHRcdGlmICggcGFnZU51bSA8PSBwYWdlTWF4ICYmIHBhZ2VOdW0gPiAwICkgeyBhamF4QnRuLmJ1dHRvbigncmVzZXQnKTsgfVxuXHRcdFx0XHRcdGVsc2UgeyBhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTsgfVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIGxheW91dCBvbmNlIHBvc3RzIGhhdmUgbG9hZGVkXG5cdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRuZXdQb3N0cy5yZW1vdmVDbGFzcygnYWpheC1uZXcnKTtcblx0XHRcdFx0XHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xuXHRcdFx0XHRcdFx0XHRpZnJhbWVBc3BlY3QoKTtcblx0XHRcdFx0XHRcdFx0cG9zdHNQYWdlKCk7XG5cdFx0XHRcdFx0XHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnLmJsb2ctbWFzb25yeSAucG9zdHMtY29udGFpbmVyJyk7XG5cdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pc290b3BlKCdhcHBlbmRlZCcsIG5ld1Bvc3RzKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR2aWV3cG9ydC50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgMTAwKTtcblxuXHRcdFx0XHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyApIHsgdmlld3BvcnQub24oJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpOyB9XG5cblx0XHRcdFx0XHQvLyBIYW5kbGUgRXJyb3JzXG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPT0gJ2Vycm9yJyApIHtcblx0XHRcdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdlcnJvcicpO1xuXHRcdFx0XHRcdFx0Ly8gRGVidWdnaW5nIGluZm9cblx0XHRcdFx0XHRcdC8vIGFsZXJ0KCdBSkFYIEVycm9yOiAnICsgeGhyLnN0YXR1cyArICcgJyArIHhoci5zdGF0dXNUZXh0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cblx0XHQvLyBUcmlnZ2VyIEFKQVggbG9hZCB3aGVuIHJlYWNoaW5nIGJvdHRvbSBvZiBwYWdlXG5cdFx0dmFyIGFqYXhTY3JvbGxIYW5kbGUgPSAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvKiBnbG9iYWwgZWxlbVZpc2libGUgKi9cblx0XHRcdFx0aWYgKCBlbGVtVmlzaWJsZShhamF4QnRuLCB2aWV3cG9ydCkgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0YWpheEJ0bi50cmlnZ2VyKCdjb250OmJvdHRvbScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgKSB7XG5cdFx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XG5cdFx0fVxuXHR9XG5cdC8vIEV4ZWN1dGUgRnVuY3Rpb24gV2hlcmUgQXBwbGljYWJsZVxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Bvc3RzLXBhZ2UnXSAmJiBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ3BhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XG5cdFx0aWYgKCBtaXh0X29wdC5wYWdlWydwYWdlLXR5cGUnXSA9PSAnc2hvcCcgKSB7XG5cdFx0XHRtaXh0QWpheExvYWQoJ3Nob3AnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWl4dEFqYXhMb2FkKCdwb3N0cycpO1xuXHRcdH1cblx0fVxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaW5nbGUnICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XG5cdFx0bWl4dEFqYXhMb2FkKCdjb21tZW50cycpO1xuXHR9XG5cblxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIFdpbmRvdyBSZXNpemVcblx0ZnVuY3Rpb24gcmVzaXplRm4oKSB7XG5cdFx0aWZyYW1lQXNwZWN0KCk7XG5cdH1cblx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIHJlc2l6ZUZuICkpO1xuXG5cblx0Ly8gRnVuY3Rpb25zIFRvIFJ1biBPbiBMb2FkXG5cdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXG5cdFx0cG9zdHNQYWdlKCk7XG5cblx0XHQvLyBJc290b3BlIE1hc29ucnkgSW5pdFxuXHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICYmIHR5cGVvZiAkLmZuLmlzb3RvcGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHR2YXIgYmxvZ0NvbnQgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcblxuXHRcdFx0YmxvZ0NvbnQuaXNvdG9wZSh7XG5cdFx0XHRcdGl0ZW1TZWxlY3RvcjogJy5hcnRpY2xlJyxcblx0XHRcdFx0bGF5b3V0OiAnbWFzb25yeScsXG5cdFx0XHRcdGd1dHRlcjogMFxuXHRcdFx0fSk7XG5cblx0XHRcdGJsb2dDb250LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7IGJsb2dDb250Lmlzb3RvcGUoJ2xheW91dCcpOyB9KTtcblx0XHRcdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0gKSk7XG5cdFx0fVxuXG5cblx0XHQvLyBUcmlnZ2VyIExpZ2h0Ym94IE9uIEZlYXR1cmVkIEltYWdlIENsaWNrXG5cdFx0JCgnLmxpZ2h0Ym94LXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuc2libGluZ3MoJy5nYWxsZXJ5JykuZmluZCgnbGknKS5maXJzdCgpLmNsaWNrKCk7XG5cdFx0fSk7XG5cblxuXHRcdC8vIFJlbGF0ZWQgUG9zdHMgU2xpZGVyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodFNsaWRlciA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdHZhciByZWxQb3N0c1NsaWRlciA9ICQoJy5wb3N0LXJlbGF0ZWQgLnNsaWRlci1jb250JyksXG5cdFx0XHRcdHR5cGUgPSByZWxQb3N0c1NsaWRlci5kYXRhKCd0eXBlJyksXG5cdFx0XHRcdGNvbHMgPSByZWxQb3N0c1NsaWRlci5kYXRhKCdjb2xzJyksXG5cdFx0XHRcdHRhYmxldENvbHMgPSByZWxQb3N0c1NsaWRlci5kYXRhKCd0YWJsZXQtY29scycpLFxuXHRcdFx0XHRtb2JpbGVDb2xzID0gcmVsUG9zdHNTbGlkZXIuZGF0YSgnbW9iaWxlLWNvbHMnKTtcblx0XHRcdHJlbFBvc3RzU2xpZGVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmxpZ2h0U2xpZGVyKHtcblx0XHRcdFx0XHRpdGVtOiBjb2xzLFxuXHRcdFx0XHRcdGNvbnRyb2xzOiAodHlwZSA9PSAnbWVkaWEnKSxcblx0XHRcdFx0XHRwYWdlcjogKHR5cGUgPT0gJ3RleHQnKSxcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMjAsXG5cdFx0XHRcdFx0cmVzcG9uc2l2ZTogW3tcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDEyMDAsXG5cdFx0XHRcdFx0XHRzZXR0aW5nczogeyBpdGVtOiB0YWJsZXRDb2xzIH1cblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRicmVha3BvaW50OiA1ODAsXG5cdFx0XHRcdFx0XHRzZXR0aW5nczogeyBpdGVtOiBtb2JpbGVDb2xzIH1cblx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRvblNsaWRlckxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmVsUG9zdHNTbGlkZXIucmVtb3ZlQ2xhc3MoJ2luaXQnKTtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mICQuZm4ubWF0Y2hIZWlnaHQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHRcdCQoJy5wb3N0LWZlYXQnLCByZWxQb3N0c1NsaWRlcikubWF0Y2hIZWlnaHQoKTtcblx0XHRcdFx0XHRcdFx0cmVsUG9zdHNTbGlkZXIuY3NzKCdoZWlnaHQnLCAnJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuVUkgRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIG1peHRfb3B0ICovXG5cblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpLFxuXHRcdGh0bWxFbCAgID0gJCgnaHRtbCcpLFxuXHRcdGJvZHlFbCAgID0gJCgnYm9keScpO1xuXG5cblx0Ly8gU3Bpbm5lciBJbnB1dFxuXHQkKCcubWl4dC1zcGlubmVyJykub24oJ2NsaWNrJywgJy5idG4nLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJGVsICAgICA9ICQodGhpcyksXG5cdFx0XHRzcGlubmVyID0gJGVsLnBhcmVudHMoJy5taXh0LXNwaW5uZXInKSxcblx0XHRcdGlucHV0ICAgPSBzcGlubmVyLmNoaWxkcmVuKCcuc3Bpbm5lci12YWwnKSxcblx0XHRcdHN0ZXAgICAgPSBpbnB1dC5hdHRyKCdzdGVwJykgfHwgMSxcblx0XHRcdG1pblZhbCAgPSBpbnB1dC5hdHRyKCdtaW4nKSB8fCAwLFxuXHRcdFx0bWF4VmFsICA9IGlucHV0LmF0dHIoJ21heCcpIHx8IG51bGwsXG5cdFx0XHR2YWwgICAgID0gaW5wdXQudmFsKCksXG5cdFx0XHRuZXdWYWw7XG5cdFx0aWYgKCBpc05hTih2YWwpICkgdmFsID0gbWluVmFsO1xuXHRcdFxuXHRcdGlmICggJGVsLmhhc0NsYXNzKCdtaW51cycpICkge1xuXHRcdFx0Ly8gRGVjcmVhc2Vcblx0XHRcdG5ld1ZhbCA9IHBhcnNlRmxvYXQodmFsKSAtIHBhcnNlRmxvYXQoc3RlcCk7XG5cdFx0XHRpZiAoIG5ld1ZhbCA8IG1pblZhbCApIG5ld1ZhbCA9IG1pblZhbDtcblx0XHRcdGlucHV0LnZhbChuZXdWYWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBJbmNyZWFzZVxuXHRcdFx0bmV3VmFsID0gcGFyc2VGbG9hdCh2YWwpICsgcGFyc2VGbG9hdChzdGVwKTtcblx0XHRcdGlmICggbWF4VmFsICE9PSBudWxsICYmIG5ld1ZhbCA+IG1heFZhbCApIG5ld1ZhbCA9IG1heFZhbDtcblx0XHRcdGlucHV0LnZhbChuZXdWYWwpO1xuXHRcdH1cblx0fSk7XG5cblxuXHQvLyBDb250ZW50IEZpbHRlcmluZ1xuXHQkKCcuY29udGVudC1maWx0ZXItbGlua3MnKS5jaGlsZHJlbigpLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbGluayA9ICQodGhpcyksXG5cdFx0XHRmaWx0ZXIgPSBsaW5rLmRhdGEoJ2ZpbHRlcicpLFxuXHRcdFx0Y29udGVudCA9ICQoJy4nICsgbGluay5wYXJlbnRzKCcuY29udGVudC1maWx0ZXItbGlua3MnKS5kYXRhKCdjb250ZW50JykpLFxuXHRcdFx0ZmlsdGVyQ2xhc3MgPSAnZmlsdGVyLWhpZGRlbic7XG5cdFx0bGluay5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0aWYgKCBmaWx0ZXIgPT0gJ2FsbCcgKSB7IGNvbnRlbnQuZmluZCgnLicrZmlsdGVyQ2xhc3MpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKTsgfVxuXHRcdGVsc2UgeyBjb250ZW50LmZpbmQoJy4nICsgZmlsdGVyKS5yZW1vdmVDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVEb3duKDYwMCkuc2libGluZ3MoJzpub3QoLicrZmlsdGVyKycpJykuYWRkQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlVXAoNjAwKTsgfVxuXHR9KTtcblxuXG5cdC8vIFNvcnQgcG9ydGZvbGlvIGl0ZW1zXG5cdCQoJy5wb3J0Zm9saW8tc29ydGVyIGEnKS5jbGljayggZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBlbGVtID0gJCh0aGlzKSxcblx0XHRcdHRhcmdldFRhZyA9IGVsZW0uZGF0YSgnc29ydCcpLFxuXHRcdFx0dGFyZ2V0Q29udGFpbmVyID0gJCgnLnBvc3RzLWNvbnRhaW5lcicpO1xuXG5cdFx0ZWxlbS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRpZiAoIG1peHRfb3B0LmxheW91dC50eXBlID09ICdtYXNvbnJ5JyAmJiB0eXBlb2YgJC5mbi5pc290b3BlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0aWYgKHRhcmdldFRhZyA9PSAnYWxsJykge1xuXHRcdFx0XHR0YXJnZXRDb250YWluZXIuaXNvdG9wZSh7IGZpbHRlcjogJyonIH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGFyZ2V0Q29udGFpbmVyLmlzb3RvcGUoeyBmaWx0ZXI6ICcuJyArIHRhcmdldFRhZyB9KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHByb2plY3RzID0gdGFyZ2V0Q29udGFpbmVyLmNoaWxkcmVuKCcucG9ydGZvbGlvJyk7XG5cdFx0XHRpZiAoIHRhcmdldFRhZyA9PSAnYWxsJyApIHtcblx0XHRcdFx0cHJvamVjdHMuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2ZpbHRlcmVkJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcm9qZWN0cy5mYWRlT3V0KDApLnJlbW92ZUNsYXNzKCdmaWx0ZXJlZCcpLmZpbHRlcignLicgKyB0YXJnZXRUYWcpLmZhZGVJbigzMDApLmFkZENsYXNzKCdmaWx0ZXJlZCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblxuXHQvLyBPZmZzZXQgc2Nyb2xsaW5nIHRvIGxpbmsgYW5jaG9yIChoYXNoKVxuXHQkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgbGluayA9ICQodGhpcyksXG5cdFx0XHRoYXNoID0gbGluay5hdHRyKCdocmVmJyk7XG5cblx0XHRpZiAoIGxpbmsuZGF0YSgnbm8taGFzaC1zY3JvbGwnKSApIHJldHVybjtcblxuXHRcdGlmICggaGFzaC5sZW5ndGggKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gJChoYXNoKTtcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCkge1xuXHRcdFx0XHQvKiBnbG9iYWwgYnJlYWtwb2ludCAqL1xuXHRcdFx0XHR2YXIgaGFzaE9mZnNldCA9ICQoaGFzaCkub2Zmc2V0KCkudG9wO1xuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgYnJlYWtwb2ludC5uYW1lICE9ICdwbHV0bycgJiYgYnJlYWtwb2ludC5uYW1lICE9ICdtZXJjdXJ5JyApIHsgaGFzaE9mZnNldCAtPSAkKCcjbWFpbi1uYXYnKS5vdXRlckhlaWdodCgpOyB9XG5cdFx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBoYXNoT2Zmc2V0IH0sIDYwMCk7XG5cdFx0XHR9XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XG5cdFx0fVxuXHR9KTtcblx0Ly8gSWdub3JlIHNwZWNpZmljIGFuY2hvcnNcblx0JCgnLnRhYnMgYSwgLnZjX3R0YSBhJykuYXR0cignZGF0YS1uby1oYXNoLXNjcm9sbCcsIHRydWUpO1xuXG5cblx0Ly8gU29jaWFsIEljb25zXG5cdCQoJy5zb2NpYWwtbGlua3MnKS5ub3QoJy5ob3Zlci1ub25lJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnQgPSAkKHRoaXMpO1xuXG5cdFx0Y29udC5jaGlsZHJlbigpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGljb24gPSAkKHRoaXMpLFxuXHRcdFx0XHRsaW5rID0gaWNvbi5jaGlsZHJlbignYScpLFxuXHRcdFx0XHRkYXRhQ29sb3IgPSBsaW5rLmF0dHIoJ2RhdGEtY29sb3InKTtcblxuXHRcdFx0aWYgKCBjb250Lmhhc0NsYXNzKCdob3Zlci1iZycpIHx8IGNvbnQucGFyZW50cygnLm5vLWhvdmVyLWJnJykubGVuZ3RoICkge1xuXHRcdFx0XHRsaW5rLmhvdmVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRsaW5rLmNzcyh7IGJhY2tncm91bmRDb2xvcjogZGF0YUNvbG9yLCBib3JkZXJDb2xvcjogZGF0YUNvbG9yLCB6SW5kZXg6IDEgfSk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCkgeyBsaW5rLmNzcyh7IGJhY2tncm91bmRDb2xvcjogJycsIGJvcmRlckNvbG9yOiAnJywgekluZGV4OiAnJyB9KTsgfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsaW5rLmhvdmVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRsaW5rLmNzcyh7IGNvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7IGxpbmsuY3NzKHsgY29sb3I6ICcnLCB6SW5kZXg6ICcnIH0pOyB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblxuXHQvLyBGdW5jdGlvbnMgcnVuIG9uIHBhZ2UgbG9hZCBhbmQgXCJyZWZyZXNoXCIgZXZlbnRcblx0ZnVuY3Rpb24gcnVuT25SZWZyZXNoKCkge1xuXHRcdC8vIFRvb2x0aXBzIEluaXRcblx0XHQkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdLCAucmVsYXRlZC10aXRsZS10aXAnKS50b29sdGlwKHtcblx0XHRcdHBsYWNlbWVudDogJ2F1dG8nLFxuXHRcdFx0Y29udGFpbmVyOiAnYm9keSdcblx0XHR9KTtcblxuXG5cdFx0Ly8gT24gSG92ZXIgQW5pbWF0aW9ucyBJbml0XG5cdFx0dmFyIGFuaW1Ib3ZlckVsID0gJCgnLmFuaW0tb24taG92ZXInKTtcblx0XHRhbmltSG92ZXJFbC5ob3ZlckludGVudCggZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdob3ZlcmVkJyk7XG5cdFx0XHR2YXIgaW5uZXIgICA9ICQodGhpcykuY2hpbGRyZW4oJy5vbi1ob3ZlcicpLFxuXHRcdFx0XHRhbmltSW4gID0gaW5uZXIuZGF0YSgnYW5pbS1pbicpIHx8ICdmYWRlSW4nLFxuXHRcdFx0XHRhbmltT3V0ID0gaW5uZXIuZGF0YSgnYW5pbS1vdXQnKSB8fCAnZmFkZU91dCc7XG5cdFx0XHRpbm5lci5yZW1vdmVDbGFzcyhhbmltT3V0KS5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1Jbik7XG5cdFx0fSwgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdob3ZlcmVkJyk7XG5cdFx0XHR2YXIgaW5uZXIgICA9ICQodGhpcykuY2hpbGRyZW4oJy5vbi1ob3ZlcicpLFxuXHRcdFx0XHRhbmltSW4gID0gaW5uZXIuZGF0YSgnYW5pbS1pbicpIHx8ICdmYWRlSW4nLFxuXHRcdFx0XHRhbmltT3V0ID0gaW5uZXIuZGF0YSgnYW5pbS1vdXQnKSB8fCAnZmFkZU91dCc7XG5cdFx0XHRpbm5lci5yZW1vdmVDbGFzcyhhbmltSW4pLmFkZENsYXNzKGFuaW1PdXQpO1xuXHRcdH0sIDMwMCk7XG5cdFx0YW5pbUhvdmVyRWwub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQgb2FuaW1hdGlvbmVuZCBNU0FuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhICQodGhpcykuaGFzQ2xhc3MoJ2hvdmVyZWQnKSApIHtcblx0XHRcdFx0JCh0aGlzKS5jaGlsZHJlbignLm9uLWhvdmVyJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0dmlld3BvcnQub24oJ3JlZnJlc2gnLCBmdW5jdGlvbigpIHtcblx0XHRydW5PblJlZnJlc2goKTtcblx0fSkudHJpZ2dlcigncmVmcmVzaCcpO1xuXG5cblx0Ly8gQmFjayBUbyBUb3AgQnV0dG9uXG5cdGZ1bmN0aW9uIGJhY2tUb1RvcERpc3BsYXkoKSB7XG5cdFx0dmFyIHNjcm9sbFRvcCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpO1xuXHRcdGlmICggc2Nyb2xsVG9wID4gMjAwICkge1xuXHRcdFx0YmFja1RvVG9wLmZhZGVJbigzMDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRiYWNrVG9Ub3AuZmFkZU91dCgzMDApO1xuXHRcdH1cblx0fVxuXG5cdHZhciBiYWNrVG9Ub3AgPSAkKCcjYmFjay10by10b3AnKTtcblxuXHRpZiAoIGJhY2tUb1RvcC5sZW5ndGggKSB7XG5cdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsICQudGhyb3R0bGUoIDEwMDAsIGJhY2tUb1RvcERpc3BsYXkgKSkuc2Nyb2xsKCk7XG5cblx0XHRiYWNrVG9Ub3AuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdFx0aHRtbEVsLmFkZChib2R5RWwpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgNjAwKTtcblx0XHR9KTtcblx0fVxuXG59KShqUXVlcnkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
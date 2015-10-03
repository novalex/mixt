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
/*! modernizr 3.0.0-alpha.4 (Custom Build) | MIT *
 * http://modernizr.com/download/#-flexbox-shiv !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,a,i,s;for(var l in C){if(e=[],t=C[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,a=0;a<e.length;a++)i=e[a],s=i.split("."),1===s.length?Modernizr[s[0]]=o:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=o),y.push((o?"":"no-")+s.join("-"))}}function a(e){var t=S.className,n=Modernizr._config.classPrefix||"";if(b&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),b?S.className.baseVal=t:S.className=t)}function i(e,t){return!!~(""+e).indexOf(t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):b?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function c(e,t){return function(){return e.apply(t,arguments)}}function u(e,t,n){var o;for(var a in e)if(e[a]in t)return n===!1?e[a]:(o=t[e[a]],r(o,"function")?c(o,n||t):o);return!1}function f(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(){var e=t.body;return e||(e=s(b?"svg":"body"),e.fake=!0),e}function p(e,n,r,o){var a,i,l,c,u="modernizr",f=s("div"),p=d();if(parseInt(r,10))for(;r--;)l=s("div"),l.id=o?o[r]:u+(r+1),f.appendChild(l);return a=s("style"),a.type="text/css",a.id="s"+u,(p.fake?p:f).appendChild(a),p.appendChild(f),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),f.id=u,p.fake&&(p.style.background="",p.style.overflow="hidden",c=S.style.overflow,S.style.overflow="hidden",S.appendChild(p)),i=n(f,e),p.fake?(p.parentNode.removeChild(p),S.style.overflow=c,S.offsetHeight):f.parentNode.removeChild(f),!!i}function m(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(f(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var a=[];o--;)a.push("("+f(t[o])+":"+r+")");return a=a.join(" or "),p("@supports ("+a+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function h(e,t,o,a){function c(){f&&(delete j.style,delete j.modElem)}if(a=r(a,"undefined")?!1:a,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var f,d,p,h,g,v=["modernizr","tspan"];!j.style;)f=!0,j.modElem=s(v.shift()),j.style=j.modElem.style;for(p=e.length,d=0;p>d;d++)if(h=e[d],g=j.style[h],i(h,"-")&&(h=l(h)),j.style[h]!==n){if(a||r(o,"undefined"))return c(),"pfx"==t?h:!0;try{j.style[h]=o}catch(y){}if(j.style[h]!=g)return c(),"pfx"==t?h:!0}return c(),!1}function g(e,t,n,o,a){var i=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+w.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?h(s,t,o,a):(s=(e+" "+_.join(i+" ")+i).split(" "),u(s,t,n))}function v(e,t,r){return g(e,n,n,t,r)}var y=[],C=[],E={_version:"3.0.0-alpha.4",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){C.push({name:e,fn:t,options:n})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=E,Modernizr=new Modernizr;var S=t.documentElement,b="svg"===S.nodeName.toLowerCase();b||!function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=C.elements;return"string"==typeof e?e.split(" "):e}function o(e,t){var n=C.elements;"string"!=typeof n&&(n=n.join(" ")),"string"!=typeof e&&(e=e.join(" ")),C.elements=n+" "+e,c(t)}function a(e){var t=y[e[g]];return t||(t={},v++,e[g]=v,y[v]=t),t}function i(e,n,r){if(n||(n=t),f)return n.createElement(e);r||(r=a(n));var o;return o=r.cache[e]?r.cache[e].cloneNode():h.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!o.canHaveChildren||m.test(e)||o.tagUrn?o:r.frag.appendChild(o)}function s(e,n){if(e||(e=t),f)return e.createDocumentFragment();n=n||a(e);for(var o=n.frag.cloneNode(),i=0,s=r(),l=s.length;l>i;i++)o.createElement(s[i]);return o}function l(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return C.shivMethods?i(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-:]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(C,t.frag)}function c(e){e||(e=t);var r=a(e);return!C.shivCSS||u||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),f||l(e,r),e}var u,f,d="3.7.2",p=e.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g="_html5shiv",v=0,y={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",u="hidden"in e,f=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){u=!0,f=!0}}();var C={elements:p.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:d,shivCSS:p.shivCSS!==!1,supportsUnknownElements:f,shivMethods:p.shivMethods!==!1,type:"default",shivDocument:c,createElement:i,createDocumentFragment:s,addElements:o};e.html5=C,c(t)}(this,t);var x="Moz O ms Webkit",w=E._config.usePrefixes?x.split(" "):[];E._cssomPrefixes=w;var _=E._config.usePrefixes?x.toLowerCase().split(" "):[];E._domPrefixes=_;var N={elem:s("modernizr")};Modernizr._q.push(function(){delete N.elem});var j={style:N.elem.style};Modernizr._q.unshift(function(){delete j.style}),E.testAllProps=g,E.testAllProps=v,Modernizr.addTest("flexbox",v("flexBasis","1px",!0)),o(),a(y),delete E.addTest,delete E.addAsyncTest;for(var k=0;k<Modernizr._q.length;k++)Modernizr._q[k]();e.Modernizr=Modernizr}(window,document);
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

	var viewport = $(window),
		bodyEl   = $('body');

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

	// Plugins

	viewport.load( function() {
		if ( typeof $.fn.lightGallery === 'function' ) {
			var theme = $('#main-wrap-inner')[0].className.match(/(theme-[^\s]*)/)[1];
			bodyEl.on('onAfterOpen.lg onBeforeClose.lg', function() {
				bodyEl.toggleClass(theme);
			});
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
				dataCont = navbar.find('.navbar-data'),
				colorLum = dataCont.length ? window.getComputedStyle(dataCont[0], ':before').getPropertyValue('content').replace(/"/g, '') : '';

			if ( colorLum != 'dark' && colorLum != 'light' ) colorLum = colorLoD(bgColor);

			if ( navbar.is(mainNavBar) ) {

				navbarObj.navBg = ( colorLum == 'dark' ) ? 'bg-dark' : 'bg-light';
				navbar.addClass(navbarObj.navBg);

				mainNavBar.attr('data-bg', colorLum);

				var headCssSheet = $('<style data-id="mixt-nav-css">').appendTo($('head'));

				headCssSheet.append('.navbar.navbar-mixt:not(.position-top):not(.vertical) { background-color: '+colorToRgba(bgColor, mixt_opt.nav.opacity)+'; }');

				if ( mixt_opt.nav.transparent && mixt_opt.header.enabled ) {
					headCssSheet.append('.nav-transparent .navbar.navbar-mixt.position-top { background-color: '+colorToRgba(bgColor, mixt_opt.nav['top-opacity'])+'; }');
					
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
			} else {
				if ( colorLum == 'dark' ) {
					navbar.addClass('bg-dark');
				} else {
					navbar.addClass('bg-light');
				}
			}
			navbar.removeClass('init');
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
		$('style[data-id="mixt-nav-css"]').remove();
		mainNavBar.removeClass('bg-light bg-dark').addClass('init');
		navbarObj.init(mainNavBar);
	});

	secNavBar.on('refresh', function() {
		secNavBar.removeClass('bg-light bg-dark');
		navbarObj.init(secNavBar);
	});


	// Check which media queries are active
	var mqCheck = function() {
		return window.getComputedStyle(document.querySelector('.navbar-data'), ':after').getPropertyValue('content').replace(/"/g, '');
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


	// Handle Navbar Items Overlap
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
				secNavItemsWidth = $('.left', secNavBar).outerWidth(true) + $('.right', secNavBar).outerWidth(true);
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
			navbarObj.menuOverflow($('.navbar-inner', this));
		});

		// Run functions based on currently active media query
		if ( mqNav == 'desktop' ) {
			navbarObj.menuOverflow(mainNavInner);
			mainNavBar.css('height', '');

			navbars.each( function() {
				navbarObj.megaMenuToggle('enable', $(this));
			});

			menuParents.on('touchstart', menuTouchHover);
			bodyEl.on('touchstart', menuTouchRemoveHover);
		} else if ( mqNav == 'mobile' || mqNav == 'tablet' ) {
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

}(jQuery);

/* ------------------------------------------------ /
POST FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

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

			if ( cont.hasClass('hover-bg') || cont.parents('.no-hover-bg').length ) {
				link.hover( function() {
					if ( cont.parents('.position-top').length === 0 ) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsIlJlc2l6ZVNlbnNvci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoTUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlIC0gdjEuMSAtIDMvNy8yMDEwXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS1wbHVnaW4vXG4gKiBcbiAqIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hblxuICogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4gKi9cblxuLy8gU2NyaXB0OiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZTogU29tZXRpbWVzLCBsZXNzIGlzIG1vcmUhXG4vL1xuLy8gKlZlcnNpb246IDEuMSwgTGFzdCB1cGRhdGVkOiAzLzcvMjAxMCpcbi8vIFxuLy8gUHJvamVjdCBIb21lIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuLy8gR2l0SHViICAgICAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9cbi8vIFNvdXJjZSAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UuanNcbi8vIChNaW5pZmllZCkgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UubWluLmpzICgwLjdrYilcbi8vIFxuLy8gQWJvdXQ6IExpY2Vuc2Vcbi8vIFxuLy8gQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuLFxuLy8gRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4vLyBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4vLyBcbi8vIEFib3V0OiBFeGFtcGxlc1xuLy8gXG4vLyBUaGVzZSB3b3JraW5nIGV4YW1wbGVzLCBjb21wbGV0ZSB3aXRoIGZ1bGx5IGNvbW1lbnRlZCBjb2RlLCBpbGx1c3RyYXRlIGEgZmV3XG4vLyB3YXlzIGluIHdoaWNoIHRoaXMgcGx1Z2luIGNhbiBiZSB1c2VkLlxuLy8gXG4vLyBUaHJvdHRsZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvZXhhbXBsZXMvdGhyb3R0bGUvXG4vLyBEZWJvdW5jZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvZXhhbXBsZXMvZGVib3VuY2UvXG4vLyBcbi8vIEFib3V0OiBTdXBwb3J0IGFuZCBUZXN0aW5nXG4vLyBcbi8vIEluZm9ybWF0aW9uIGFib3V0IHdoYXQgdmVyc2lvbiBvciB2ZXJzaW9ucyBvZiBqUXVlcnkgdGhpcyBwbHVnaW4gaGFzIGJlZW5cbi8vIHRlc3RlZCB3aXRoLCB3aGF0IGJyb3dzZXJzIGl0IGhhcyBiZWVuIHRlc3RlZCBpbiwgYW5kIHdoZXJlIHRoZSB1bml0IHRlc3RzXG4vLyByZXNpZGUgKHNvIHlvdSBjYW4gdGVzdCBpdCB5b3Vyc2VsZikuXG4vLyBcbi8vIGpRdWVyeSBWZXJzaW9ucyAtIG5vbmUsIDEuMy4yLCAxLjQuMlxuLy8gQnJvd3NlcnMgVGVzdGVkIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi04LCBGaXJlZm94IDItMy42LCBTYWZhcmkgMy00LCBDaHJvbWUgNC01LCBPcGVyYSA5LjYtMTAuMS5cbi8vIFVuaXQgVGVzdHMgICAgICAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvdW5pdC9cbi8vIFxuLy8gQWJvdXQ6IFJlbGVhc2UgSGlzdG9yeVxuLy8gXG4vLyAxLjEgLSAoMy83LzIwMTApIEZpeGVkIGEgYnVnIGluIDxqUXVlcnkudGhyb3R0bGU+IHdoZXJlIHRyYWlsaW5nIGNhbGxiYWNrc1xuLy8gICAgICAgZXhlY3V0ZWQgbGF0ZXIgdGhhbiB0aGV5IHNob3VsZC4gUmV3b3JrZWQgYSBmYWlyIGFtb3VudCBvZiBpbnRlcm5hbFxuLy8gICAgICAgbG9naWMgYXMgd2VsbC5cbi8vIDEuMCAtICgzLzYvMjAxMCkgSW5pdGlhbCByZWxlYXNlIGFzIGEgc3RhbmQtYWxvbmUgcHJvamVjdC4gTWlncmF0ZWQgb3ZlclxuLy8gICAgICAgZnJvbSBqcXVlcnktbWlzYyByZXBvIHYwLjQgdG8ganF1ZXJ5LXRocm90dGxlIHJlcG8gdjEuMCwgYWRkZWQgdGhlXG4vLyAgICAgICBub190cmFpbGluZyB0aHJvdHRsZSBwYXJhbWV0ZXIgYW5kIGRlYm91bmNlIGZ1bmN0aW9uYWxpdHkuXG4vLyBcbi8vIFRvcGljOiBOb3RlIGZvciBub24talF1ZXJ5IHVzZXJzXG4vLyBcbi8vIGpRdWVyeSBpc24ndCBhY3R1YWxseSByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIGJlY2F1c2Ugbm90aGluZyBpbnRlcm5hbFxuLy8gdXNlcyBhbnkgalF1ZXJ5IG1ldGhvZHMgb3IgcHJvcGVydGllcy4galF1ZXJ5IGlzIGp1c3QgdXNlZCBhcyBhIG5hbWVzcGFjZVxuLy8gdW5kZXIgd2hpY2ggdGhlc2UgbWV0aG9kcyBjYW4gZXhpc3QuXG4vLyBcbi8vIFNpbmNlIGpRdWVyeSBpc24ndCBhY3R1YWxseSByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIGlmIGpRdWVyeSBkb2Vzbid0IGV4aXN0XG4vLyB3aGVuIHRoaXMgcGx1Z2luIGlzIGxvYWRlZCwgdGhlIG1ldGhvZCBkZXNjcmliZWQgYmVsb3cgd2lsbCBiZSBjcmVhdGVkIGluXG4vLyB0aGUgYENvd2JveWAgbmFtZXNwYWNlLiBVc2FnZSB3aWxsIGJlIGV4YWN0bHkgdGhlIHNhbWUsIGJ1dCBpbnN0ZWFkIG9mXG4vLyAkLm1ldGhvZCgpIG9yIGpRdWVyeS5tZXRob2QoKSwgeW91J2xsIG5lZWQgdG8gdXNlIENvd2JveS5tZXRob2QoKS5cblxuKGZ1bmN0aW9uKHdpbmRvdyx1bmRlZmluZWQpe1xuICAnJDpub211bmdlJzsgLy8gVXNlZCBieSBZVUkgY29tcHJlc3Nvci5cbiAgXG4gIC8vIFNpbmNlIGpRdWVyeSByZWFsbHkgaXNuJ3QgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCB1c2UgYGpRdWVyeWAgYXMgdGhlXG4gIC8vIG5hbWVzcGFjZSBvbmx5IGlmIGl0IGFscmVhZHkgZXhpc3RzLCBvdGhlcndpc2UgdXNlIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UsXG4gIC8vIGNyZWF0aW5nIGl0IGlmIG5lY2Vzc2FyeS5cbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5Db3dib3kgfHwgKCB3aW5kb3cuQ293Ym95ID0ge30gKSxcbiAgICBcbiAgICAvLyBJbnRlcm5hbCBtZXRob2QgcmVmZXJlbmNlLlxuICAgIGpxX3Rocm90dGxlO1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkudGhyb3R0bGVcbiAgLy8gXG4gIC8vIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICAvLyBleGVjdXRpb24gb2YgaGFuZGxlcnMgb24gZXZlbnRzIGxpa2UgcmVzaXplIGFuZCBzY3JvbGwuIElmIHlvdSB3YW50IHRvXG4gIC8vIHJhdGUtbGltaXQgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24gdG8gYSBzaW5nbGUgdGltZSwgc2VlIHRoZVxuICAvLyA8alF1ZXJ5LmRlYm91bmNlPiBtZXRob2QuXG4gIC8vIFxuICAvLyBJbiB0aGlzIHZpc3VhbGl6YXRpb24sIHwgaXMgYSB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbCBhbmQgWCBpcyB0aGUgYWN0dWFsXG4gIC8vIGNhbGxiYWNrIGV4ZWN1dGlvbjpcbiAgLy8gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQ6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gPiBcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyB0cnVlOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgICAgICAgICAgIFggICAgWCAgICBYICAgIFggICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciB0aHJvdHRsZWQgPSBqUXVlcnkudGhyb3R0bGUoIGRlbGF5LCBbIG5vX3RyYWlsaW5nLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCB0aHJvdHRsZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIG5vX3RyYWlsaW5nIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9fdHJhaWxpbmcgaXNcbiAgLy8gICAgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBvbmx5IGV4ZWN1dGUgZXZlcnkgYGRlbGF5YCBtaWxsaXNlY29uZHMgd2hpbGUgdGhlXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQuIElmIG5vX3RyYWlsaW5nIGlzIGZhbHNlIG9yXG4gIC8vICAgIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkIG9uZSBmaW5hbCB0aW1lIGFmdGVyIHRoZSBsYXN0XG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW5cbiAgLy8gICAgY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gIC8vICBjYWxsYmFjayAtIChGdW5jdGlvbikgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIHRocm90dGxlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAgLy8gXG4gIC8vIFJldHVybnM6XG4gIC8vIFxuICAvLyAgKEZ1bmN0aW9uKSBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAgXG4gICQudGhyb3R0bGUgPSBqcV90aHJvdHRsZSA9IGZ1bmN0aW9uKCBkZWxheSwgbm9fdHJhaWxpbmcsIGNhbGxiYWNrLCBkZWJvdW5jZV9tb2RlICkge1xuICAgIC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG4gICAgLy8gYGNhbGxiYWNrYCBpcyBleGVjdXRlZCBhdCB0aGUgcHJvcGVyIHRpbWVzIGluIGB0aHJvdHRsZWAgYW5kIGBlbmRgXG4gICAgLy8gZGVib3VuY2UgbW9kZXMuXG4gICAgdmFyIHRpbWVvdXRfaWQsXG4gICAgICBcbiAgICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGxhc3QgdGltZSBgY2FsbGJhY2tgIHdhcyBleGVjdXRlZC5cbiAgICAgIGxhc3RfZXhlYyA9IDA7XG4gICAgXG4gICAgLy8gYG5vX3RyYWlsaW5nYCBkZWZhdWx0cyB0byBmYWxzeS5cbiAgICBpZiAoIHR5cGVvZiBub190cmFpbGluZyAhPT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZGVib3VuY2VfbW9kZSA9IGNhbGxiYWNrO1xuICAgICAgY2FsbGJhY2sgPSBub190cmFpbGluZztcbiAgICAgIG5vX3RyYWlsaW5nID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG4gICAgLy8gZnVuY3Rpb25hbGl0eSBhbmQgd2hlbiBleGVjdXRlZCB3aWxsIGxpbWl0IHRoZSByYXRlIGF0IHdoaWNoIGBjYWxsYmFja2BcbiAgICAvLyBpcyBleGVjdXRlZC5cbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBlbGFwc2VkID0gK25ldyBEYXRlKCkgLSBsYXN0X2V4ZWMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBcbiAgICAgIC8vIEV4ZWN1dGUgYGNhbGxiYWNrYCBhbmQgdXBkYXRlIHRoZSBgbGFzdF9leGVjYCB0aW1lc3RhbXAuXG4gICAgICBmdW5jdGlvbiBleGVjKCkge1xuICAgICAgICBsYXN0X2V4ZWMgPSArbmV3IERhdGUoKTtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoIHRoYXQsIGFyZ3MgKTtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG4gICAgICAvLyB0byBhbGxvdyBmdXR1cmUgYGNhbGxiYWNrYCBleGVjdXRpb25zLlxuICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHRpbWVvdXRfaWQgPSB1bmRlZmluZWQ7XG4gICAgICB9O1xuICAgICAgXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgJiYgIXRpbWVvdXRfaWQgKSB7XG4gICAgICAgIC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuICAgICAgICAvLyBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG4gICAgICAgIGV4ZWMoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG4gICAgICB0aW1lb3V0X2lkICYmIGNsZWFyVGltZW91dCggdGltZW91dF9pZCApO1xuICAgICAgXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCAmJiBlbGFwc2VkID4gZGVsYXkgKSB7XG4gICAgICAgIC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuICAgICAgICAvLyBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIGlmICggbm9fdHJhaWxpbmcgIT09IHRydWUgKSB7XG4gICAgICAgIC8vIEluIHRyYWlsaW5nIHRocm90dGxlIG1vZGUsIHNpbmNlIGBkZWxheWAgdGltZSBoYXMgbm90IGJlZW5cbiAgICAgICAgLy8gZXhjZWVkZWQsIHNjaGVkdWxlIGBjYWxsYmFja2AgdG8gZXhlY3V0ZSBgZGVsYXlgIG1zIGFmdGVyIG1vc3RcbiAgICAgICAgLy8gcmVjZW50IGV4ZWN1dGlvbi5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuICAgICAgICAvLyBhZnRlciBgZGVsYXlgIG1zLlxuICAgICAgICAvLyBcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIGZhbHNlIChhdCBlbmQpLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvXG4gICAgICAgIC8vIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgdGltZW91dF9pZCA9IHNldFRpbWVvdXQoIGRlYm91bmNlX21vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCA/IGRlbGF5IC0gZWxhcHNlZCA6IGRlbGF5ICk7XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBTZXQgdGhlIGd1aWQgb2YgYHdyYXBwZXJgIGZ1bmN0aW9uIHRvIHRoZSBzYW1lIG9mIG9yaWdpbmFsIGNhbGxiYWNrLCBzb1xuICAgIC8vIGl0IGNhbiBiZSByZW1vdmVkIGluIGpRdWVyeSAxLjQrIC51bmJpbmQgb3IgLmRpZSBieSB1c2luZyB0aGUgb3JpZ2luYWxcbiAgICAvLyBjYWxsYmFjayBhcyBhIHJlZmVyZW5jZS5cbiAgICBpZiAoICQuZ3VpZCApIHtcbiAgICAgIHdyYXBwZXIuZ3VpZCA9IGNhbGxiYWNrLmd1aWQgPSBjYWxsYmFjay5ndWlkIHx8ICQuZ3VpZCsrO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gdGhlIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH07XG4gIFxuICAvLyBNZXRob2Q6IGpRdWVyeS5kZWJvdW5jZVxuICAvLyBcbiAgLy8gRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICAvLyBndWFyYW50ZWVzIHRoYXQgYSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGEgc2luZ2xlIHRpbWUsIGVpdGhlciBhdCB0aGVcbiAgLy8gdmVyeSBiZWdpbm5pbmcgb2YgYSBzZXJpZXMgb2YgY2FsbHMsIG9yIGF0IHRoZSB2ZXJ5IGVuZC4gSWYgeW91IHdhbnQgdG9cbiAgLy8gc2ltcGx5IHJhdGUtbGltaXQgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24sIHNlZSB0aGUgPGpRdWVyeS50aHJvdHRsZT5cbiAgLy8gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYXG4gIC8vID4gXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYXG4gIC8vIFxuICAvLyBVc2FnZTpcbiAgLy8gXG4gIC8vID4gdmFyIGRlYm91bmNlZCA9IGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKTtcbiAgLy8gPiBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGRlYm91bmNlZCApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcbiAgLy8gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICkgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcbiAgLy8gXG4gIC8vIEFyZ3VtZW50czpcbiAgLy8gXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XG4gIC8vICAgIGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICAvLyAgYXRfYmVnaW4gLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdF9iZWdpbiBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGBkZWxheWAgbWlsbGlzZWNvbmRzIGFmdGVyXG4gIC8vICAgIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdF9iZWdpbiBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIGJlXG4gIC8vICAgIGV4ZWN1dGVkIG9ubHkgYXQgdGhlIGZpcnN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlXG4gIC8vICAgIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gIC8vICBjYWxsYmFjayAtIChGdW5jdGlvbikgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIGRlYm91bmNlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAgLy8gXG4gIC8vIFJldHVybnM6XG4gIC8vIFxuICAvLyAgKEZ1bmN0aW9uKSBBIG5ldywgZGVib3VuY2VkLCBmdW5jdGlvbi5cbiAgXG4gICQuZGVib3VuY2UgPSBmdW5jdGlvbiggZGVsYXksIGF0X2JlZ2luLCBjYWxsYmFjayApIHtcbiAgICByZXR1cm4gY2FsbGJhY2sgPT09IHVuZGVmaW5lZFxuICAgICAgPyBqcV90aHJvdHRsZSggZGVsYXksIGF0X2JlZ2luLCBmYWxzZSApXG4gICAgICA6IGpxX3Rocm90dGxlKCBkZWxheSwgY2FsbGJhY2ssIGF0X2JlZ2luICE9PSBmYWxzZSApO1xuICB9O1xuICBcbn0pKHRoaXMpO1xuIiwiLyohXG4gKiBob3ZlckludGVudCB2MS44LjEgLy8gMjAxNC4wOC4xMSAvLyBqUXVlcnkgdjEuOS4xK1xuICogaHR0cDovL2NoZXJuZS5uZXQvYnJpYW4vcmVzb3VyY2VzL2pxdWVyeS5ob3ZlckludGVudC5odG1sXG4gKlxuICogWW91IG1heSB1c2UgaG92ZXJJbnRlbnQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS4gQmFzaWNhbGx5IHRoYXRcbiAqIG1lYW5zIHlvdSBhcmUgZnJlZSB0byB1c2UgaG92ZXJJbnRlbnQgYXMgbG9uZyBhcyB0aGlzIGhlYWRlciBpcyBsZWZ0IGludGFjdC5cbiAqIENvcHlyaWdodCAyMDA3LCAyMDE0IEJyaWFuIENoZXJuZVxuICovXG4gXG4vKiBob3ZlckludGVudCBpcyBzaW1pbGFyIHRvIGpRdWVyeSdzIGJ1aWx0LWluIFwiaG92ZXJcIiBtZXRob2QgZXhjZXB0IHRoYXRcbiAqIGluc3RlYWQgb2YgZmlyaW5nIHRoZSBoYW5kbGVySW4gZnVuY3Rpb24gaW1tZWRpYXRlbHksIGhvdmVySW50ZW50IGNoZWNrc1xuICogdG8gc2VlIGlmIHRoZSB1c2VyJ3MgbW91c2UgaGFzIHNsb3dlZCBkb3duIChiZW5lYXRoIHRoZSBzZW5zaXRpdml0eVxuICogdGhyZXNob2xkKSBiZWZvcmUgZmlyaW5nIHRoZSBldmVudC4gVGhlIGhhbmRsZXJPdXQgZnVuY3Rpb24gaXMgb25seVxuICogY2FsbGVkIGFmdGVyIGEgbWF0Y2hpbmcgaGFuZGxlckluLlxuICpcbiAqIC8vIGJhc2ljIHVzYWdlIC4uLiBqdXN0IGxpa2UgLmhvdmVyKClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0IClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluT3V0IClcbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4gd2l0aCBldmVudCBkZWxlZ2F0aW9uIVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW4sIGhhbmRsZXJPdXQsIHNlbGVjdG9yIClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluT3V0LCBzZWxlY3RvciApXG4gKlxuICogLy8gdXNpbmcgYSBiYXNpYyBjb25maWd1cmF0aW9uIG9iamVjdFxuICogLmhvdmVySW50ZW50KCBjb25maWcgKVxuICpcbiAqIEBwYXJhbSAgaGFuZGxlckluICAgZnVuY3Rpb24gT1IgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAgaGFuZGxlck91dCAgZnVuY3Rpb24gT1Igc2VsZWN0b3IgZm9yIGRlbGVnYXRpb24gT1IgdW5kZWZpbmVkXG4gKiBAcGFyYW0gIHNlbGVjdG9yICAgIHNlbGVjdG9yIE9SIHVuZGVmaW5lZFxuICogQGF1dGhvciBCcmlhbiBDaGVybmUgPGJyaWFuKGF0KWNoZXJuZShkb3QpbmV0PlxuICovXG4oZnVuY3Rpb24oJCkge1xuICAgICQuZm4uaG92ZXJJbnRlbnQgPSBmdW5jdGlvbihoYW5kbGVySW4saGFuZGxlck91dCxzZWxlY3Rvcikge1xuXG4gICAgICAgIC8vIGRlZmF1bHQgY29uZmlndXJhdGlvbiB2YWx1ZXNcbiAgICAgICAgdmFyIGNmZyA9IHtcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAsXG4gICAgICAgICAgICBzZW5zaXRpdml0eTogNixcbiAgICAgICAgICAgIHRpbWVvdXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIHR5cGVvZiBoYW5kbGVySW4gPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIGhhbmRsZXJJbiApO1xuICAgICAgICB9IGVsc2UgaWYgKCQuaXNGdW5jdGlvbihoYW5kbGVyT3V0KSkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVyT3V0LCBzZWxlY3Rvcjogc2VsZWN0b3IgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVySW4sIHNlbGVjdG9yOiBoYW5kbGVyT3V0IH0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIHZhcmlhYmxlc1xuICAgICAgICAvLyBjWCwgY1kgPSBjdXJyZW50IFggYW5kIFkgcG9zaXRpb24gb2YgbW91c2UsIHVwZGF0ZWQgYnkgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgIC8vIHBYLCBwWSA9IHByZXZpb3VzIFggYW5kIFkgcG9zaXRpb24gb2YgbW91c2UsIHNldCBieSBtb3VzZW92ZXIgYW5kIHBvbGxpbmcgaW50ZXJ2YWxcbiAgICAgICAgdmFyIGNYLCBjWSwgcFgsIHBZO1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZ2V0dGluZyBtb3VzZSBwb3NpdGlvblxuICAgICAgICB2YXIgdHJhY2sgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgY1ggPSBldi5wYWdlWDtcbiAgICAgICAgICAgIGNZID0gZXYucGFnZVk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBjb21wYXJpbmcgY3VycmVudCBhbmQgcHJldmlvdXMgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIGNvbXBhcmUgPSBmdW5jdGlvbihldixvYikge1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTtcbiAgICAgICAgICAgIC8vIGNvbXBhcmUgbW91c2UgcG9zaXRpb25zIHRvIHNlZSBpZiB0aGV5J3ZlIGNyb3NzZWQgdGhlIHRocmVzaG9sZFxuICAgICAgICAgICAgaWYgKCBNYXRoLnNxcnQoIChwWC1jWCkqKHBYLWNYKSArIChwWS1jWSkqKHBZLWNZKSApIDwgY2ZnLnNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgICAgICAgICQob2IpLm9mZihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgaG92ZXJJbnRlbnQgc3RhdGUgdG8gdHJ1ZSAoc28gbW91c2VPdXQgY2FuIGJlIGNhbGxlZClcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2ZnLm92ZXIuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNldCBwcmV2aW91cyBjb29yZGluYXRlcyBmb3IgbmV4dCB0aW1lXG4gICAgICAgICAgICAgICAgcFggPSBjWDsgcFkgPSBjWTtcbiAgICAgICAgICAgICAgICAvLyB1c2Ugc2VsZi1jYWxsaW5nIHRpbWVvdXQsIGd1YXJhbnRlZXMgaW50ZXJ2YWxzIGFyZSBzcGFjZWQgb3V0IHByb3Blcmx5IChhdm9pZHMgSmF2YVNjcmlwdCB0aW1lciBidWdzKVxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsIG9iKTt9ICwgY2ZnLmludGVydmFsICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBkZWxheWluZyB0aGUgbW91c2VPdXQgZnVuY3Rpb25cbiAgICAgICAgdmFyIGRlbGF5ID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gY2ZnLm91dC5hcHBseShvYixbZXZdKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGhhbmRsaW5nIG1vdXNlICdob3ZlcmluZydcbiAgICAgICAgdmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgLy8gY29weSBvYmplY3RzIHRvIGJlIHBhc3NlZCBpbnRvIHQgKHJlcXVpcmVkIGZvciBldmVudCBvYmplY3QgdG8gYmUgcGFzc2VkIGluIElFKVxuICAgICAgICAgICAgdmFyIGV2ID0gJC5leHRlbmQoe30sZSk7XG4gICAgICAgICAgICB2YXIgb2IgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgaG92ZXJJbnRlbnQgdGltZXIgaWYgaXQgZXhpc3RzXG4gICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfdCkgeyBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpOyB9XG5cbiAgICAgICAgICAgIC8vIGlmIGUudHlwZSA9PT0gXCJtb3VzZWVudGVyXCJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2VlbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IFwicHJldmlvdXNcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIGluaXRpYWwgZW50cnkgcG9pbnRcbiAgICAgICAgICAgICAgICBwWCA9IGV2LnBhZ2VYOyBwWSA9IGV2LnBhZ2VZO1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBcImN1cnJlbnRcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIG1vdXNlbW92ZVxuICAgICAgICAgICAgICAgICQob2IpLm9uKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIHN0YXJ0IHBvbGxpbmcgaW50ZXJ2YWwgKHNlbGYtY2FsbGluZyB0aW1lb3V0KSB0byBjb21wYXJlIG1vdXNlIGNvb3JkaW5hdGVzIG92ZXIgdGltZVxuICAgICAgICAgICAgICAgIGlmICghb2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LG9iKTt9ICwgY2ZnLmludGVydmFsICk7fVxuXG4gICAgICAgICAgICAgICAgLy8gZWxzZSBlLnR5cGUgPT0gXCJtb3VzZWxlYXZlXCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdW5iaW5kIGV4cGVuc2l2ZSBtb3VzZW1vdmUgZXZlbnRcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gaWYgaG92ZXJJbnRlbnQgc3RhdGUgaXMgdHJ1ZSwgdGhlbiBjYWxsIHRoZSBtb3VzZU91dCBmdW5jdGlvbiBhZnRlciB0aGUgc3BlY2lmaWVkIGRlbGF5XG4gICAgICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7ZGVsYXkoZXYsb2IpO30gLCBjZmcudGltZW91dCApO31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBsaXN0ZW4gZm9yIG1vdXNlZW50ZXIgYW5kIG1vdXNlbGVhdmVcbiAgICAgICAgcmV0dXJuIHRoaXMub24oeydtb3VzZWVudGVyLmhvdmVySW50ZW50JzpoYW5kbGVIb3ZlciwnbW91c2VsZWF2ZS5ob3ZlckludGVudCc6aGFuZGxlSG92ZXJ9LCBjZmcuc2VsZWN0b3IpO1xuICAgIH07XG59KShqUXVlcnkpO1xuIiwiLyohXG4gKiBpbWFnZXNMb2FkZWQgUEFDS0FHRUQgdjMuMS44XG4gKiBKYXZhU2NyaXB0IGlzIGFsbCBsaWtlIFwiWW91IGltYWdlcyBhcmUgZG9uZSB5ZXQgb3Igd2hhdD9cIlxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fWZ1bmN0aW9uIHQoZSx0KXtmb3IodmFyIG49ZS5sZW5ndGg7bi0tOylpZihlW25dLmxpc3RlbmVyPT09dClyZXR1cm4gbjtyZXR1cm4tMX1mdW5jdGlvbiBuKGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0aGlzW2VdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19dmFyIGk9ZS5wcm90b3R5cGUscj10aGlzLG89ci5FdmVudEVtaXR0ZXI7aS5nZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt0PXt9O2ZvcihuIGluIGkpaS5oYXNPd25Qcm9wZXJ0eShuKSYmZS50ZXN0KG4pJiYodFtuXT1pW25dKX1lbHNlIHQ9aVtlXXx8KGlbZV09W10pO3JldHVybiB0fSxpLmZsYXR0ZW5MaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbj1bXTtmb3IodD0wO2UubGVuZ3RoPnQ7dCs9MSluLnB1c2goZVt0XS5saXN0ZW5lcik7cmV0dXJuIG59LGkuZ2V0TGlzdGVuZXJzQXNPYmplY3Q9ZnVuY3Rpb24oZSl7dmFyIHQsbj10aGlzLmdldExpc3RlbmVycyhlKTtyZXR1cm4gbiBpbnN0YW5jZW9mIEFycmF5JiYodD17fSx0W2VdPW4pLHR8fG59LGkuYWRkTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSksbz1cIm9iamVjdFwiPT10eXBlb2Ygbjtmb3IoaSBpbiByKXIuaGFzT3duUHJvcGVydHkoaSkmJi0xPT09dChyW2ldLG4pJiZyW2ldLnB1c2gobz9uOntsaXN0ZW5lcjpuLG9uY2U6ITF9KTtyZXR1cm4gdGhpc30saS5vbj1uKFwiYWRkTGlzdGVuZXJcIiksaS5hZGRPbmNlTGlzdGVuZXI9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihlLHtsaXN0ZW5lcjp0LG9uY2U6ITB9KX0saS5vbmNlPW4oXCJhZGRPbmNlTGlzdGVuZXJcIiksaS5kZWZpbmVFdmVudD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5nZXRMaXN0ZW5lcnMoZSksdGhpc30saS5kZWZpbmVFdmVudHM9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PTA7ZS5sZW5ndGg+dDt0Kz0xKXRoaXMuZGVmaW5lRXZlbnQoZVt0XSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyLG89dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKTtmb3IociBpbiBvKW8uaGFzT3duUHJvcGVydHkocikmJihpPXQob1tyXSxuKSwtMSE9PWkmJm9bcl0uc3BsaWNlKGksMSkpO3JldHVybiB0aGlzfSxpLm9mZj1uKFwicmVtb3ZlTGlzdGVuZXJcIiksaS5hZGRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKCExLGUsdCl9LGkucmVtb3ZlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMCxlLHQpfSxpLm1hbmlwdWxhdGVMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0LG4pe3ZhciBpLHIsbz1lP3RoaXMucmVtb3ZlTGlzdGVuZXI6dGhpcy5hZGRMaXN0ZW5lcixzPWU/dGhpcy5yZW1vdmVMaXN0ZW5lcnM6dGhpcy5hZGRMaXN0ZW5lcnM7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHR8fHQgaW5zdGFuY2VvZiBSZWdFeHApZm9yKGk9bi5sZW5ndGg7aS0tOylvLmNhbGwodGhpcyx0LG5baV0pO2Vsc2UgZm9yKGkgaW4gdCl0Lmhhc093blByb3BlcnR5KGkpJiYocj10W2ldKSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHI/by5jYWxsKHRoaXMsaSxyKTpzLmNhbGwodGhpcyxpLHIpKTtyZXR1cm4gdGhpc30saS5yZW1vdmVFdmVudD1mdW5jdGlvbihlKXt2YXIgdCxuPXR5cGVvZiBlLGk9dGhpcy5fZ2V0RXZlbnRzKCk7aWYoXCJzdHJpbmdcIj09PW4pZGVsZXRlIGlbZV07ZWxzZSBpZihcIm9iamVjdFwiPT09bilmb3IodCBpbiBpKWkuaGFzT3duUHJvcGVydHkodCkmJmUudGVzdCh0KSYmZGVsZXRlIGlbdF07ZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzO3JldHVybiB0aGlzfSxpLnJlbW92ZUFsbExpc3RlbmVycz1uKFwicmVtb3ZlRXZlbnRcIiksaS5lbWl0RXZlbnQ9ZnVuY3Rpb24oZSx0KXt2YXIgbixpLHIsbyxzPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gcylpZihzLmhhc093blByb3BlcnR5KHIpKWZvcihpPXNbcl0ubGVuZ3RoO2ktLTspbj1zW3JdW2ldLG4ub25jZT09PSEwJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKGUsbi5saXN0ZW5lciksbz1uLmxpc3RlbmVyLmFwcGx5KHRoaXMsdHx8W10pLG89PT10aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpO3JldHVybiB0aGlzfSxpLnRyaWdnZXI9bihcImVtaXRFdmVudFwiKSxpLmVtaXQ9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiB0aGlzLmVtaXRFdmVudChlLHQpfSxpLnNldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlPWUsdGhpc30saS5fZ2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoXCJfb25jZVJldHVyblZhbHVlXCIpP3RoaXMuX29uY2VSZXR1cm5WYWx1ZTohMH0saS5fZ2V0RXZlbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz17fSl9LGUubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLkV2ZW50RW1pdHRlcj1vLGV9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gZX0pOlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWU6dGhpcy5FdmVudEVtaXR0ZXI9ZX0pLmNhbGwodGhpcyksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2YXIgbj1lLmV2ZW50O3JldHVybiBuLnRhcmdldD1uLnRhcmdldHx8bi5zcmNFbGVtZW50fHx0LG59dmFyIG49ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LGk9ZnVuY3Rpb24oKXt9O24uYWRkRXZlbnRMaXN0ZW5lcj9pPWZ1bmN0aW9uKGUsdCxuKXtlLmFkZEV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5hdHRhY2hFdmVudCYmKGk9ZnVuY3Rpb24oZSxuLGkpe2VbbitpXT1pLmhhbmRsZUV2ZW50P2Z1bmN0aW9uKCl7dmFyIG49dChlKTtpLmhhbmRsZUV2ZW50LmNhbGwoaSxuKX06ZnVuY3Rpb24oKXt2YXIgbj10KGUpO2kuY2FsbChlLG4pfSxlLmF0dGFjaEV2ZW50KFwib25cIituLGVbbitpXSl9KTt2YXIgcj1mdW5jdGlvbigpe307bi5yZW1vdmVFdmVudExpc3RlbmVyP3I9ZnVuY3Rpb24oZSx0LG4pe2UucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpuLmRldGFjaEV2ZW50JiYocj1mdW5jdGlvbihlLHQsbil7ZS5kZXRhY2hFdmVudChcIm9uXCIrdCxlW3Qrbl0pO3RyeXtkZWxldGUgZVt0K25dfWNhdGNoKGkpe2VbdCtuXT12b2lkIDB9fSk7dmFyIG89e2JpbmQ6aSx1bmJpbmQ6cn07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImV2ZW50aWUvZXZlbnRpZVwiLG8pOmUuZXZlbnRpZT1vfSh0aGlzKSxmdW5jdGlvbihlLHQpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFwiZXZlbnRpZS9ldmVudGllXCJdLGZ1bmN0aW9uKG4saSl7cmV0dXJuIHQoZSxuLGkpfSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9dChlLHJlcXVpcmUoXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiKSxyZXF1aXJlKFwiZXZlbnRpZVwiKSk6ZS5pbWFnZXNMb2FkZWQ9dChlLGUuRXZlbnRFbWl0dGVyLGUuZXZlbnRpZSl9KHdpbmRvdyxmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gaShlLHQpe2Zvcih2YXIgbiBpbiB0KWVbbl09dFtuXTtyZXR1cm4gZX1mdW5jdGlvbiByKGUpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PWQuY2FsbChlKX1mdW5jdGlvbiBvKGUpe3ZhciB0PVtdO2lmKHIoZSkpdD1lO2Vsc2UgaWYoXCJudW1iZXJcIj09dHlwZW9mIGUubGVuZ3RoKWZvcih2YXIgbj0wLGk9ZS5sZW5ndGg7aT5uO24rKyl0LnB1c2goZVtuXSk7ZWxzZSB0LnB1c2goZSk7cmV0dXJuIHR9ZnVuY3Rpb24gcyhlLHQsbil7aWYoISh0aGlzIGluc3RhbmNlb2YgcykpcmV0dXJuIG5ldyBzKGUsdCk7XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZSkpLHRoaXMuZWxlbWVudHM9byhlKSx0aGlzLm9wdGlvbnM9aSh7fSx0aGlzLm9wdGlvbnMpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/bj10OmkodGhpcy5vcHRpb25zLHQpLG4mJnRoaXMub24oXCJhbHdheXNcIixuKSx0aGlzLmdldEltYWdlcygpLGEmJih0aGlzLmpxRGVmZXJyZWQ9bmV3IGEuRGVmZXJyZWQpO3ZhciByPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3IuY2hlY2soKX0pfWZ1bmN0aW9uIGYoZSl7dGhpcy5pbWc9ZX1mdW5jdGlvbiBjKGUpe3RoaXMuc3JjPWUsdltlXT10aGlzfXZhciBhPWUualF1ZXJ5LHU9ZS5jb25zb2xlLGg9dSE9PXZvaWQgMCxkPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7cy5wcm90b3R5cGU9bmV3IHQscy5wcm90b3R5cGUub3B0aW9ucz17fSxzLnByb3RvdHlwZS5nZXRJbWFnZXM9ZnVuY3Rpb24oKXt0aGlzLmltYWdlcz1bXTtmb3IodmFyIGU9MCx0PXRoaXMuZWxlbWVudHMubGVuZ3RoO3Q+ZTtlKyspe3ZhciBuPXRoaXMuZWxlbWVudHNbZV07XCJJTUdcIj09PW4ubm9kZU5hbWUmJnRoaXMuYWRkSW1hZ2Uobik7dmFyIGk9bi5ub2RlVHlwZTtpZihpJiYoMT09PWl8fDk9PT1pfHwxMT09PWkpKWZvcih2YXIgcj1uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIiksbz0wLHM9ci5sZW5ndGg7cz5vO28rKyl7dmFyIGY9cltvXTt0aGlzLmFkZEltYWdlKGYpfX19LHMucHJvdG90eXBlLmFkZEltYWdlPWZ1bmN0aW9uKGUpe3ZhciB0PW5ldyBmKGUpO3RoaXMuaW1hZ2VzLnB1c2godCl9LHMucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHIpe3JldHVybiB0Lm9wdGlvbnMuZGVidWcmJmgmJnUubG9nKFwiY29uZmlybVwiLGUsciksdC5wcm9ncmVzcyhlKSxuKyssbj09PWkmJnQuY29tcGxldGUoKSwhMH12YXIgdD10aGlzLG49MCxpPXRoaXMuaW1hZ2VzLmxlbmd0aDtpZih0aGlzLmhhc0FueUJyb2tlbj0hMSwhaSlyZXR1cm4gdGhpcy5jb21wbGV0ZSgpLHZvaWQgMDtmb3IodmFyIHI9MDtpPnI7cisrKXt2YXIgbz10aGlzLmltYWdlc1tyXTtvLm9uKFwiY29uZmlybVwiLGUpLG8uY2hlY2soKX19LHMucHJvdG90eXBlLnByb2dyZXNzPWZ1bmN0aW9uKGUpe3RoaXMuaGFzQW55QnJva2VuPXRoaXMuaGFzQW55QnJva2VufHwhZS5pc0xvYWRlZDt2YXIgdD10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmVtaXQoXCJwcm9ncmVzc1wiLHQsZSksdC5qcURlZmVycmVkJiZ0LmpxRGVmZXJyZWQubm90aWZ5JiZ0LmpxRGVmZXJyZWQubm90aWZ5KHQsZSl9KX0scy5wcm90b3R5cGUuY29tcGxldGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmhhc0FueUJyb2tlbj9cImZhaWxcIjpcImRvbmVcIjt0aGlzLmlzQ29tcGxldGU9ITA7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aWYodC5lbWl0KGUsdCksdC5lbWl0KFwiYWx3YXlzXCIsdCksdC5qcURlZmVycmVkKXt2YXIgbj10Lmhhc0FueUJyb2tlbj9cInJlamVjdFwiOlwicmVzb2x2ZVwiO3QuanFEZWZlcnJlZFtuXSh0KX19KX0sYSYmKGEuZm4uaW1hZ2VzTG9hZGVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49bmV3IHModGhpcyxlLHQpO3JldHVybiBuLmpxRGVmZXJyZWQucHJvbWlzZShhKHRoaXMpKX0pLGYucHJvdG90eXBlPW5ldyB0LGYucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7dmFyIGU9dlt0aGlzLmltZy5zcmNdfHxuZXcgYyh0aGlzLmltZy5zcmMpO2lmKGUuaXNDb25maXJtZWQpcmV0dXJuIHRoaXMuY29uZmlybShlLmlzTG9hZGVkLFwiY2FjaGVkIHdhcyBjb25maXJtZWRcIiksdm9pZCAwO2lmKHRoaXMuaW1nLmNvbXBsZXRlJiZ2b2lkIDAhPT10aGlzLmltZy5uYXR1cmFsV2lkdGgpcmV0dXJuIHRoaXMuY29uZmlybSgwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoLFwibmF0dXJhbFdpZHRoXCIpLHZvaWQgMDt2YXIgdD10aGlzO2Uub24oXCJjb25maXJtXCIsZnVuY3Rpb24oZSxuKXtyZXR1cm4gdC5jb25maXJtKGUuaXNMb2FkZWQsbiksITB9KSxlLmNoZWNrKCl9LGYucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzTG9hZGVkPWUsdGhpcy5lbWl0KFwiY29uZmlybVwiLHRoaXMsdCl9O3ZhciB2PXt9O3JldHVybiBjLnByb3RvdHlwZT1uZXcgdCxjLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2lmKCF0aGlzLmlzQ2hlY2tlZCl7dmFyIGU9bmV3IEltYWdlO24uYmluZChlLFwibG9hZFwiLHRoaXMpLG4uYmluZChlLFwiZXJyb3JcIix0aGlzKSxlLnNyYz10aGlzLnNyYyx0aGlzLmlzQ2hlY2tlZD0hMH19LGMucHJvdG90eXBlLmhhbmRsZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciB0PVwib25cIitlLnR5cGU7dGhpc1t0XSYmdGhpc1t0XShlKX0sYy5wcm90b3R5cGUub25sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMCxcIm9ubG9hZFwiKSx0aGlzLnVuYmluZFByb3h5RXZlbnRzKGUpfSxjLnByb3RvdHlwZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMSxcIm9uZXJyb3JcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUuY29uZmlybT1mdW5jdGlvbihlLHQpe3RoaXMuaXNDb25maXJtZWQ9ITAsdGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfSxjLnByb3RvdHlwZS51bmJpbmRQcm94eUV2ZW50cz1mdW5jdGlvbihlKXtuLnVuYmluZChlLnRhcmdldCxcImxvYWRcIix0aGlzKSxuLnVuYmluZChlLnRhcmdldCxcImVycm9yXCIsdGhpcyl9LHN9KTsiLCIvKipcclxuKiBqcXVlcnkubWF0Y2hIZWlnaHQuanMgbWFzdGVyXHJcbiogaHR0cDovL2JybS5pby9qcXVlcnktbWF0Y2gtaGVpZ2h0L1xyXG4qIExpY2Vuc2U6IE1JVFxyXG4qL1xyXG5cclxuOyhmdW5jdGlvbigkKSB7XHJcbiAgICAvKlxyXG4gICAgKiAgaW50ZXJuYWxcclxuICAgICovXHJcblxyXG4gICAgdmFyIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gLTEsXHJcbiAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3BhcnNlXHJcbiAgICAqICB2YWx1ZSBwYXJzZSB1dGlsaXR5IGZ1bmN0aW9uXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcGFyc2UgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIC8vIHBhcnNlIHZhbHVlIGFuZCBjb252ZXJ0IE5hTiB0byAwXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBfcm93c1xyXG4gICAgKiAgdXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIGFycmF5IG9mIGpRdWVyeSBzZWxlY3Rpb25zIHJlcHJlc2VudGluZyBlYWNoIHJvd1xyXG4gICAgKiAgKGFzIGRpc3BsYXllZCBhZnRlciBmbG9hdCB3cmFwcGluZyBhcHBsaWVkIGJ5IGJyb3dzZXIpXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcm93cyA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcbiAgICAgICAgdmFyIHRvbGVyYW5jZSA9IDEsXHJcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxyXG4gICAgICAgICAgICBsYXN0VG9wID0gbnVsbCxcclxuICAgICAgICAgICAgcm93cyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBncm91cCBlbGVtZW50cyBieSB0aGVpciB0b3AgcG9zaXRpb25cclxuICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdG9wID0gJHRoYXQub2Zmc2V0KCkudG9wIC0gX3BhcnNlKCR0aGF0LmNzcygnbWFyZ2luLXRvcCcpKSxcclxuICAgICAgICAgICAgICAgIGxhc3RSb3cgPSByb3dzLmxlbmd0aCA+IDAgPyByb3dzW3Jvd3MubGVuZ3RoIC0gMV0gOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxhc3RSb3cgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IGl0ZW0gb24gdGhlIHJvdywgc28ganVzdCBwdXNoIGl0XHJcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goJHRoYXQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvdyB0b3AgaXMgdGhlIHNhbWUsIGFkZCB0byB0aGUgcm93IGdyb3VwXHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLmFicyhsYXN0VG9wIC0gdG9wKSkgPD0gdG9sZXJhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93c1tyb3dzLmxlbmd0aCAtIDFdID0gbGFzdFJvdy5hZGQoJHRoYXQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2Ugc3RhcnQgYSBuZXcgcm93IGdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgbGFzdCByb3cgdG9wXHJcbiAgICAgICAgICAgIGxhc3RUb3AgPSB0b3A7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByb3dzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgX3BhcnNlT3B0aW9uc1xyXG4gICAgKiAgaGFuZGxlIHBsdWdpbiBvcHRpb25zXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBfcGFyc2VPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBvcHRzID0ge1xyXG4gICAgICAgICAgICBieVJvdzogdHJ1ZSxcclxuICAgICAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IG51bGwsXHJcbiAgICAgICAgICAgIHJlbW92ZTogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZChvcHRzLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIG9wdHMuYnlSb3cgPSBvcHRpb25zO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gJ3JlbW92ZScpIHtcclxuICAgICAgICAgICAgb3B0cy5yZW1vdmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9wdHM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodFxyXG4gICAgKiAgcGx1Z2luIGRlZmluaXRpb25cclxuICAgICovXHJcblxyXG4gICAgdmFyIG1hdGNoSGVpZ2h0ID0gJC5mbi5tYXRjaEhlaWdodCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0cyA9IF9wYXJzZU9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSByZW1vdmVcclxuICAgICAgICBpZiAob3B0cy5yZW1vdmUpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZpeGVkIGhlaWdodCBmcm9tIGFsbCBzZWxlY3RlZCBlbGVtZW50c1xyXG4gICAgICAgICAgICB0aGlzLmNzcyhvcHRzLnByb3BlcnR5LCAnJyk7XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgc2VsZWN0ZWQgZWxlbWVudHMgZnJvbSBhbGwgZ3JvdXBzXHJcbiAgICAgICAgICAgICQuZWFjaChtYXRjaEhlaWdodC5fZ3JvdXBzLCBmdW5jdGlvbihrZXksIGdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5lbGVtZW50cyA9IGdyb3VwLmVsZW1lbnRzLm5vdCh0aGF0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbnVwIGVtcHR5IGdyb3Vwc1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPD0gMSAmJiAhb3B0cy50YXJnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoaXMgZ3JvdXAgc28gd2UgY2FuIHJlLWFwcGx5IGxhdGVyIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcclxuICAgICAgICBtYXRjaEhlaWdodC5fZ3JvdXBzLnB1c2goe1xyXG4gICAgICAgICAgICBlbGVtZW50czogdGhpcyxcclxuICAgICAgICAgICAgb3B0aW9uczogb3B0c1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBtYXRjaCBlYWNoIGVsZW1lbnQncyBoZWlnaHQgdG8gdGhlIHRhbGxlc3QgZWxlbWVudCBpbiB0aGUgc2VsZWN0aW9uXHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2FwcGx5KHRoaXMsIG9wdHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIHBsdWdpbiBnbG9iYWwgb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICBtYXRjaEhlaWdodC5fZ3JvdXBzID0gW107XHJcbiAgICBtYXRjaEhlaWdodC5fdGhyb3R0bGUgPSA4MDtcclxuICAgIG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IGZhbHNlO1xyXG4gICAgbWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZSA9IG51bGw7XHJcbiAgICBtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fYXBwbHlcclxuICAgICogIGFwcGx5IG1hdGNoSGVpZ2h0IHRvIGdpdmVuIGVsZW1lbnRzXHJcbiAgICAqL1xyXG5cclxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpLFxyXG4gICAgICAgICAgICAkZWxlbWVudHMgPSAkKGVsZW1lbnRzKSxcclxuICAgICAgICAgICAgcm93cyA9IFskZWxlbWVudHNdO1xyXG5cclxuICAgICAgICAvLyB0YWtlIG5vdGUgb2Ygc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuICAgICAgICAgICAgaHRtbEhlaWdodCA9ICQoJ2h0bWwnKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGhpZGRlbiBwYXJlbnRzXHJcbiAgICAgICAgdmFyICRoaWRkZW5QYXJlbnRzID0gJGVsZW1lbnRzLnBhcmVudHMoKS5maWx0ZXIoJzpoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHRlbXBvcmFyaWx5IG11c3QgZm9yY2UgaGlkZGVuIHBhcmVudHMgdmlzaWJsZVxyXG4gICAgICAgICRoaWRkZW5QYXJlbnRzLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAgICAgICAvLyBnZXQgcm93cyBpZiB1c2luZyBieVJvdywgb3RoZXJ3aXNlIGFzc3VtZSBvbmUgcm93XHJcbiAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgIW9wdHMudGFyZ2V0KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBtdXN0IGZpcnN0IGZvcmNlIGFuIGFyYml0cmFyeSBlcXVhbCBoZWlnaHQgc28gZmxvYXRpbmcgZWxlbWVudHMgYnJlYWsgZXZlbmx5XHJcbiAgICAgICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJpbHkgZm9yY2UgYSB1c2FibGUgZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaW5saW5lIHN0eWxlXHJcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScsICR0aGF0LmF0dHIoJ3N0eWxlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiBkaXNwbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAncGFkZGluZy1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci10b3Atd2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1ib3R0b20td2lkdGgnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDBweCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYXJyYXkgb2Ygcm93cyAoYmFzZWQgb24gZWxlbWVudCB0b3AgcG9zaXRpb24pXHJcbiAgICAgICAgICAgIHJvd3MgPSBfcm93cygkZWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmV2ZXJ0IG9yaWdpbmFsIGlubGluZSBzdHlsZXNcclxuICAgICAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8ICcnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmVhY2gocm93cywgZnVuY3Rpb24oa2V5LCByb3cpIHtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHJvdyksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHRzLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBhcHBseSB0byByb3dzIHdpdGggb25seSBvbmUgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYnlSb3cgJiYgJHJvdy5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb3cuY3NzKG9wdHMucHJvcGVydHksICcnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aGUgcm93IGFuZCBmaW5kIHRoZSBtYXggaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAkcm93LmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGZvcmNlIGEgdXNhYmxlIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheSAhPT0gJ2lubGluZS1ibG9jaycgJiYgZGlzcGxheSAhPT0gJ2lubGluZS1mbGV4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB3ZSBnZXQgdGhlIGNvcnJlY3QgYWN0dWFsIGhlaWdodCAoYW5kIG5vdCBhIHByZXZpb3VzbHkgc2V0IGhlaWdodCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3NzID0geyAnZGlzcGxheSc6IGRpc3BsYXkgfTtcclxuICAgICAgICAgICAgICAgICAgICBjc3Nbb3B0cy5wcm9wZXJ0eV0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoY3NzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluZCB0aGUgbWF4IGhlaWdodCAoaW5jbHVkaW5nIHBhZGRpbmcsIGJ1dCBub3QgbWFyZ2luKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhhdC5vdXRlckhlaWdodChmYWxzZSkgPiB0YXJnZXRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJ0IGRpc3BsYXkgYmxvY2tcclxuICAgICAgICAgICAgICAgICAgICAkdGhhdC5jc3MoJ2Rpc3BsYXknLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRhcmdldCBzZXQsIHVzZSB0aGUgaGVpZ2h0IG9mIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gb3B0cy50YXJnZXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpdGVyYXRlIHRoZSByb3cgYW5kIGFwcGx5IHRoZSBoZWlnaHQgdG8gYWxsIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFwcGx5IHRvIGEgdGFyZ2V0XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy50YXJnZXQgJiYgJHRoYXQuaXMob3B0cy50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBwYWRkaW5nIGFuZCBib3JkZXIgY29ycmVjdGx5IChyZXF1aXJlZCB3aGVuIG5vdCB1c2luZyBib3JkZXItYm94KVxyXG4gICAgICAgICAgICAgICAgaWYgKCR0aGF0LmNzcygnYm94LXNpemluZycpICE9PSAnYm9yZGVyLWJveCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFBhZGRpbmcgKz0gX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLXRvcC13aWR0aCcpKSArIF9wYXJzZSgkdGhhdC5jc3MoJ2JvcmRlci1ib3R0b20td2lkdGgnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctdG9wJykpICsgX3BhcnNlKCR0aGF0LmNzcygncGFkZGluZy1ib3R0b20nKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBoZWlnaHQgKGFjY291bnRpbmcgZm9yIHBhZGRpbmcgYW5kIGJvcmRlcilcclxuICAgICAgICAgICAgICAgICR0aGF0LmNzcyhvcHRzLnByb3BlcnR5LCAodGFyZ2V0SGVpZ2h0IC0gdmVydGljYWxQYWRkaW5nKSArICdweCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmV2ZXJ0IGhpZGRlbiBwYXJlbnRzXHJcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgJHRoYXQuYXR0cignc3R5bGUnLCAkdGhhdC5kYXRhKCdzdHlsZS1jYWNoZScpIHx8IG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZXN0b3JlIHNjcm9sbCBwb3NpdGlvbiBpZiBlbmFibGVkXHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKChzY3JvbGxUb3AgLyBodG1sSGVpZ2h0KSAqICQoJ2h0bWwnKS5vdXRlckhlaWdodCh0cnVlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGlcclxuICAgICogIGFwcGxpZXMgbWF0Y2hIZWlnaHQgdG8gYWxsIGVsZW1lbnRzIHdpdGggYSBkYXRhLW1hdGNoLWhlaWdodCBhdHRyaWJ1dGVcclxuICAgICovXHJcblxyXG4gICAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBncm91cHMgPSB7fTtcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgZ3JvdXBzIGJ5IHRoZWlyIGdyb3VwSWQgc2V0IGJ5IGVsZW1lbnRzIHVzaW5nIGRhdGEtbWF0Y2gtaGVpZ2h0XHJcbiAgICAgICAgJCgnW2RhdGEtbWF0Y2gtaGVpZ2h0XSwgW2RhdGEtbWhdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIGdyb3VwSWQgPSAkdGhpcy5hdHRyKCdkYXRhLW1oJykgfHwgJHRoaXMuYXR0cignZGF0YS1tYXRjaC1oZWlnaHQnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChncm91cElkIGluIGdyb3Vwcykge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gZ3JvdXBzW2dyb3VwSWRdLmFkZCgkdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBJZF0gPSAkdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBhcHBseSBtYXRjaEhlaWdodCB0byBlYWNoIGdyb3VwXHJcbiAgICAgICAgJC5lYWNoKGdyb3VwcywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0Y2hIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAqICBtYXRjaEhlaWdodC5fdXBkYXRlXHJcbiAgICAqICB1cGRhdGVzIG1hdGNoSGVpZ2h0IG9uIGFsbCBjdXJyZW50IGdyb3VwcyB3aXRoIHRoZWlyIGNvcnJlY3Qgb3B0aW9uc1xyXG4gICAgKi9cclxuXHJcbiAgICB2YXIgX3VwZGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUpIHtcclxuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2JlZm9yZVVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmVhY2gobWF0Y2hIZWlnaHQuX2dyb3VwcywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLmVsZW1lbnRzLCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAobWF0Y2hIZWlnaHQuX2FmdGVyVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtYXRjaEhlaWdodC5fdXBkYXRlID0gZnVuY3Rpb24odGhyb3R0bGUsIGV2ZW50KSB7XHJcbiAgICAgICAgLy8gcHJldmVudCB1cGRhdGUgaWYgZmlyZWQgZnJvbSBhIHJlc2l6ZSBldmVudFxyXG4gICAgICAgIC8vIHdoZXJlIHRoZSB2aWV3cG9ydCB3aWR0aCBoYXNuJ3QgYWN0dWFsbHkgY2hhbmdlZFxyXG4gICAgICAgIC8vIGZpeGVzIGFuIGV2ZW50IGxvb3BpbmcgYnVnIGluIElFOFxyXG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAncmVzaXplJykge1xyXG4gICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoID09PSBfcHJldmlvdXNSZXNpemVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9wcmV2aW91c1Jlc2l6ZVdpZHRoID0gd2luZG93V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aHJvdHRsZSB1cGRhdGVzXHJcbiAgICAgICAgaWYgKCF0aHJvdHRsZSkge1xyXG4gICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKF91cGRhdGVUaW1lb3V0ID09PSAtMSkge1xyXG4gICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIF91cGRhdGVUaW1lb3V0ID0gLTE7XHJcbiAgICAgICAgICAgIH0sIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiAgYmluZCBldmVudHNcclxuICAgICovXHJcblxyXG4gICAgLy8gYXBwbHkgb24gRE9NIHJlYWR5IGV2ZW50XHJcbiAgICAkKG1hdGNoSGVpZ2h0Ll9hcHBseURhdGFBcGkpO1xyXG5cclxuICAgIC8vIHVwZGF0ZSBoZWlnaHRzIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcclxuICAgICQod2luZG93KS5iaW5kKCdsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKGZhbHNlLCBldmVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB0aHJvdHRsZWQgdXBkYXRlIGhlaWdodHMgb24gcmVzaXplIGV2ZW50c1xyXG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSh0cnVlLCBldmVudCk7XHJcbiAgICB9KTtcclxuXHJcbn0pKGpRdWVyeSk7XHJcbiIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5KUyBQTFVHSU5TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4ndXNlIHN0cmljdCc7IC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXHJcblxyXG5cclxuLy8gR2V0IEN1cnJlbnQgQnJlYWtwb2ludCAoR2xvYmFsKVxyXG52YXIgYnJlYWtwb2ludCA9IHt9O1xyXG5icmVha3BvaW50LnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLm5hbWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICc6YmVmb3JlJykuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoL1xcXCIvZywgJycpO1xyXG59O1xyXG5qUXVlcnkod2luZG93KS5yZXNpemUoIGZ1bmN0aW9uKCkge1xyXG5cdGJyZWFrcG9pbnQucmVmcmVzaCgpO1xyXG59KS5yZXNpemUoKTtcclxuXHJcblxyXG4vLyBSZXNpemUgSWZyYW1lcyBQcm9wb3J0aW9uYWxseVxyXG5mdW5jdGlvbiBpZnJhbWVBc3BlY3Qoc2VsZWN0b3IpIHtcclxuXHRzZWxlY3RvciA9IHNlbGVjdG9yIHx8IGpRdWVyeSgnaWZyYW1lJyk7XHJcblxyXG5cdHNlbGVjdG9yLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0LyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG5cdFx0dmFyIGlmcmFtZSA9IGpRdWVyeSh0aGlzKSxcclxuXHRcdFx0d2lkdGggID0gaWZyYW1lLndpZHRoKCk7XHJcblx0XHRpZiAoIHR5cGVvZihpZnJhbWUuZGF0YSgncmF0aW8nKSkgPT0gJ3VuZGVmaW5lZCcgKSB7XHJcblx0XHRcdHZhciBhdHRyVyA9IHRoaXMud2lkdGgsXHJcblx0XHRcdFx0YXR0ckggPSB0aGlzLmhlaWdodDtcclxuXHRcdFx0aWZyYW1lLmRhdGEoJ3JhdGlvJywgYXR0ckggLyBhdHRyVyApLnJlbW92ZUF0dHIoJ3dpZHRoJykucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XHJcblx0XHR9XHJcblx0XHRpZnJhbWUuaGVpZ2h0KCB3aWR0aCAqIGlmcmFtZS5kYXRhKCdyYXRpbycpICkuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuLy8gTGlnaHRlbiAvIERhcmtlbiBDb2xvciAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcclxuZnVuY3Rpb24gc2hhZGVDb2xvcihjb2xvciwgcGVyY2VudCkgeyAgIFxyXG5cdHZhciBmPXBhcnNlSW50KGNvbG9yLnNsaWNlKDEpLDE2KSx0PXBlcmNlbnQ8MD8wOjI1NSxwPXBlcmNlbnQ8MD9wZXJjZW50Ki0xOnBlcmNlbnQsUj1mPj4xNixHPWY+PjgmMHgwMEZGLEI9ZiYweDAwMDBGRjtcclxuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKHQtUikqcCkrUikqMHgxMDAwMCsoTWF0aC5yb3VuZCgodC1HKSpwKStHKSoweDEwMCsoTWF0aC5yb3VuZCgodC1CKSpwKStCKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5cclxuLy8gQmxlbmQgQ29sb3JzIC0gQ3JlZGl0IFwiUGltcCBUcml6a2l0XCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNjkzOTI3L3BpbXAtdHJpemtpdFxyXG5mdW5jdGlvbiBibGVuZENvbG9ycyhjMCwgYzEsIHApIHtcclxuXHR2YXIgZj1wYXJzZUludChjMC5zbGljZSgxKSwxNiksdD1wYXJzZUludChjMS5zbGljZSgxKSwxNiksUjE9Zj4+MTYsRzE9Zj4+OCYweDAwRkYsQjE9ZiYweDAwMDBGRixSMj10Pj4xNixHMj10Pj44JjB4MDBGRixCMj10JjB4MDAwMEZGO1xyXG5cdHJldHVybiAnIycrKDB4MTAwMDAwMCsoTWF0aC5yb3VuZCgoUjItUjEpKnApK1IxKSoweDEwMDAwKyhNYXRoLnJvdW5kKChHMi1HMSkqcCkrRzEpKjB4MTAwKyhNYXRoLnJvdW5kKChCMi1CMSkqcCkrQjEpKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcblxyXG4vLyBDb252ZXJ0IGNvbG9yIHRvIFJHQmFcclxuZnVuY3Rpb24gY29sb3JUb1JnYmEoY29sb3IsIG9wYWNpdHkpIHtcclxuXHRpZiAoIGNvbG9yLnN1YnN0cmluZygwLDQpID09ICdyZ2JhJyApIHtcclxuXHRcdHZhciBhbHBoYSA9IGNvbG9yLm1hdGNoKC8oW15cXCxdKilcXCkkLyk7XHJcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZShhbHBoYVsxXSwgb3BhY2l0eSk7XHJcblx0fSBlbHNlIGlmICggY29sb3Iuc3Vic3RyaW5nKDAsMykgPT0gJ3JnYicgKSB7XHJcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCAnLCAnK29wYWNpdHkrJyknKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0aGV4ID0gY29sb3IucmVwbGFjZSgnIycsJycpO1xyXG5cdFx0dmFyIHIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsMiksIDE2KSxcclxuXHRcdFx0ZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpLFxyXG5cdFx0XHRiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNik7XHJcblx0XHRyZXN1bHQgPSAncmdiYSgnK3IrJywnK2crJywnK2IrJywnK29wYWNpdHkrJyknO1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vLyBDb2xvciBMaWdodCBPciBEYXJrIC0gQ3JlZGl0IFwiTGFycnkgRm94XCIgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9sYXJyeWZveC8xNjM2MzM4XHJcbmZ1bmN0aW9uIGNvbG9yTG9EKGNvbG9yKSB7XHJcblx0dmFyIHIsYixnLGhzcCxhID0gY29sb3I7XHJcblx0aWYgKGEubWF0Y2goL15yZ2IvKSkge1xyXG5cdFx0YSA9IGEubWF0Y2goL15yZ2JhP1xcKChcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKykoPzosXFxzKihcXGQrKD86XFwuXFxkKyk/KSk/XFwpJC8pO1xyXG5cdFx0ciA9IGFbMV07XHJcblx0XHRiID0gYVsyXTtcclxuXHRcdGcgPSBhWzNdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gKygnMHgnICsgYS5zbGljZSgxKS5yZXBsYWNlKGEubGVuZ3RoIDwgNSAmJiAvLi9nLCAnJCYkJicpKTtcclxuXHRcdHIgPSBhID4+IDE2O1xyXG5cdFx0YiA9IGEgPj4gOCAmIDI1NTtcclxuXHRcdGcgPSBhICYgMjU1O1xyXG5cdH1cclxuXHRoc3AgPSBNYXRoLnNxcnQoIDAuMjk5ICogKHIgKiByKSArIDAuNTg3ICogKGcgKiBnKSArIDAuMTE0ICogKGIgKiBiKSApO1xyXG5cdHJldHVybiAoIGhzcCA+IDEyNy41ICkgPyAnbGlnaHQnIDogJ2RhcmsnO1xyXG59IFxyXG5cclxuXHJcbi8vIEltYWdlIExpZ2h0IE9yIERhcmsgSW1hZ2UgLSBDcmVkaXQgXCJKb3NlcGggUG9ydGVsbGlcIiAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy8xNDk2MzYvam9zZXBoLXBvcnRlbGxpXHJcbmZ1bmN0aW9uIGltYWdlTG9EKGltYWdlU3JjLCBjYWxsYmFjaykge1xyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHRpbWcuc3JjID0gaW1hZ2VTcmM7XHJcblx0aW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWcpO1xyXG5cclxuXHR2YXIgY29sb3JTdW0gPSAwO1xyXG5cclxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjcmVhdGUgY2FudmFzXHJcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblx0XHRjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG5cclxuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcywwLDApO1xyXG5cclxuXHRcdHZhciBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XHJcblx0XHR2YXIgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xyXG5cdFx0dmFyIHIsZyxiLGF2ZztcclxuXHJcblx0XHRmb3IodmFyIHggPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgeCA8IGxlbjsgeCs9NCkge1xyXG5cdFx0XHRyID0gZGF0YVt4XTtcclxuXHRcdFx0ZyA9IGRhdGFbeCsxXTtcclxuXHRcdFx0YiA9IGRhdGFbeCsyXTtcclxuXHJcblx0XHRcdGF2ZyA9IE1hdGguZmxvb3IoKHIrZytiKS8zKTtcclxuXHRcdFx0Y29sb3JTdW0gKz0gYXZnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBicmlnaHRuZXNzID0gTWF0aC5mbG9vcihjb2xvclN1bSAvICh0aGlzLndpZHRoKnRoaXMuaGVpZ2h0KSk7XHJcblx0XHRjYWxsYmFjayhicmlnaHRuZXNzKTtcclxuXHR9O1xyXG59XHJcblxyXG5cclxuLy8gUmVzaXplIEltYWdlIFRvIEZpbGwgQ29udGFpbmVyIFNpemVcclxuZnVuY3Rpb24gaW1hZ2VDb3Zlcihjb250LCB0eXBlLCBjb3JySCkge1xyXG5cdHR5cGUgPSB0eXBlIHx8ICdiZyc7XHJcblxyXG5cdGNvbnQuYWRkQ2xhc3MoJ2ltYWdlLWNvdmVyJyk7XHJcblxyXG5cdHZhciBpbWcsIGltZ1VybCwgaW1nV2lkdGggPSAwLCBpbWdIZWlnaHQgPSAwO1xyXG5cclxuXHRpZiAoIHR5cGUgPT0gJ2ltZycgKSB7XHJcblx0XHRpbWcgPSBjb250LmZpbmQoJy5iZy1pbWcnKTtcclxuXHRcdGltZ1dpZHRoICA9IGltZy53aWR0aCgpO1xyXG5cdFx0aW1nSGVpZ2h0ID0gaW1nLmhlaWdodCgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpbWdVcmwgPSBjb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLm1hdGNoKC9edXJsXFwoXCI/KC4rPylcIj9cXCkkLyk7XHJcblx0XHRpZiAoIGltZ1VybFsxXSApIHtcclxuXHRcdCAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdCAgICBpbWcuc3JjID0gaW1nVXJsWzFdO1xyXG5cdFx0ICAgIGltZ1dpZHRoICA9IGltZy53aWR0aDtcclxuXHRcdCAgICBpbWdIZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCBpbWdXaWR0aCAhPT0gMCAmJiBpbWdIZWlnaHQgIT09IDAgKSB7XHJcblx0XHR2YXIgY29udFdpZHRoICA9IGNvbnQub3V0ZXJXaWR0aCgpLFxyXG5cdFx0XHRjb250SGVpZ2h0ID0gY29udC5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRoZWlnaHREaWZmID0gY29udFdpZHRoIC8gaW1nV2lkdGggKiBpbWdIZWlnaHQsXHJcblx0XHRcdG5ld1dpZHRoICAgPSAnYXV0bycsXHJcblx0XHRcdG5ld0hlaWdodCAgPSBjb250SGVpZ2h0ICsgY29yckggKyAncHgnO1xyXG5cclxuXHRcdFx0aWYgKCBoZWlnaHREaWZmID4gY29udEhlaWdodCApIHtcclxuXHRcdFx0XHRuZXdXaWR0aCAgPSAnMTAwJSc7XHJcblx0XHRcdFx0bmV3SGVpZ2h0ID0gJ2F1dG8nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICkge1xyXG5cdFx0XHRpbWcuY3NzKHsgd2lkdGg6IG5ld1dpZHRoLCBoZWlnaHQ6IG5ld0hlaWdodCB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnQuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBuZXdXaWR0aCArICcgJyArIG5ld0hlaWdodCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuLy8gRGV0ZXJtaW5lIElmIEFuIEVsZW1lbnQgSXMgU2Nyb2xsZWQgSW50byBWaWV3XHJcbmZ1bmN0aW9uIGVsZW1WaXNpYmxlKGVsZW0sIGNvbnQpIHtcclxuXHR2YXIgY29udFRvcCA9IGNvbnQuc2Nyb2xsVG9wKCksXHJcblx0XHRjb250QnRtID0gY29udFRvcCArIGNvbnQuaGVpZ2h0KCksXHJcblx0XHRlbGVtVG9wID0gZWxlbS5vZmZzZXQoKS50b3AsXHJcblx0XHRlbGVtQnRtID0gZWxlbVRvcCArIGVsZW0uaGVpZ2h0KCk7XHJcblxyXG5cdHJldHVybiAoKGVsZW1CdG0gPD0gY29udEJ0bSkgJiYgKGVsZW1Ub3AgPj0gY29udFRvcCkpO1xyXG59XHJcblxyXG5cclxuLy8gRml4IFdQTUwgRHJvcGRvd25cclxualF1ZXJ5KCcubWVudS1pdGVtLWxhbmd1YWdlJykuYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpLmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XHJcblxyXG4vLyBGaXggUG9seUxhbmcgTWVudSBJdGVtcyBBbmQgTWFrZSBUaGVtIERyb3Bkb3duXHJcbmpRdWVyeSgnLm1lbnUtaXRlbS5sYW5nLWl0ZW0nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbmpRdWVyeSggZnVuY3Rpb24oKSB7XHJcblx0dmFyIGl0ZW0gPSBqUXVlcnkoJy5sYW5nLWl0ZW0uY3VycmVudC1sYW5nJyk7XHJcblx0aWYgKGl0ZW0ubGVuZ3RoID09PSAwKSB7XHJcblx0XHRpdGVtID0galF1ZXJ5KCcubGFuZy1pdGVtJykuZmlyc3QoKTtcclxuXHR9XHJcblx0dmFyIGxhbmdzID0gaXRlbS5zaWJsaW5ncygnLmxhbmctaXRlbScpO1xyXG5cdGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpO1xyXG5cdGxhbmdzLndyYXBBbGwoJzx1bCBjbGFzcz1cInN1Yi1tZW51IGRyb3Bkb3duLW1lbnVcIj48L3VsPicpLnBhcmVudCgpLmFwcGVuZFRvKGl0ZW0pO1xyXG59KTsiLCIvKiEgbW9kZXJuaXpyIDMuMC4wLWFscGhhLjQgKEN1c3RvbSBCdWlsZCkgfCBNSVQgKlxuICogaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQvIy1mbGV4Ym94LXNoaXYgISovXG4hZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIHIoZSx0KXtyZXR1cm4gdHlwZW9mIGU9PT10fWZ1bmN0aW9uIG8oKXt2YXIgZSx0LG4sbyxhLGkscztmb3IodmFyIGwgaW4gQyl7aWYoZT1bXSx0PUNbbF0sdC5uYW1lJiYoZS5wdXNoKHQubmFtZS50b0xvd2VyQ2FzZSgpKSx0Lm9wdGlvbnMmJnQub3B0aW9ucy5hbGlhc2VzJiZ0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGgpKWZvcihuPTA7bjx0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7bisrKWUucHVzaCh0Lm9wdGlvbnMuYWxpYXNlc1tuXS50b0xvd2VyQ2FzZSgpKTtmb3Iobz1yKHQuZm4sXCJmdW5jdGlvblwiKT90LmZuKCk6dC5mbixhPTA7YTxlLmxlbmd0aDthKyspaT1lW2FdLHM9aS5zcGxpdChcIi5cIiksMT09PXMubGVuZ3RoP01vZGVybml6cltzWzBdXT1vOighTW9kZXJuaXpyW3NbMF1dfHxNb2Rlcm5penJbc1swXV1pbnN0YW5jZW9mIEJvb2xlYW58fChNb2Rlcm5penJbc1swXV09bmV3IEJvb2xlYW4oTW9kZXJuaXpyW3NbMF1dKSksTW9kZXJuaXpyW3NbMF1dW3NbMV1dPW8pLHkucHVzaCgobz9cIlwiOlwibm8tXCIpK3Muam9pbihcIi1cIikpfX1mdW5jdGlvbiBhKGUpe3ZhciB0PVMuY2xhc3NOYW1lLG49TW9kZXJuaXpyLl9jb25maWcuY2xhc3NQcmVmaXh8fFwiXCI7aWYoYiYmKHQ9dC5iYXNlVmFsKSxNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVKU0NsYXNzKXt2YXIgcj1uZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIrbitcIm5vLWpzKFxcXFxzfCQpXCIpO3Q9dC5yZXBsYWNlKHIsXCIkMVwiK24rXCJqcyQyXCIpfU1vZGVybml6ci5fY29uZmlnLmVuYWJsZUNsYXNzZXMmJih0Kz1cIiBcIituK2Uuam9pbihcIiBcIituKSxiP1MuY2xhc3NOYW1lLmJhc2VWYWw9dDpTLmNsYXNzTmFtZT10KX1mdW5jdGlvbiBpKGUsdCl7cmV0dXJuISF+KFwiXCIrZSkuaW5kZXhPZih0KX1mdW5jdGlvbiBzKCl7cmV0dXJuXCJmdW5jdGlvblwiIT10eXBlb2YgdC5jcmVhdGVFbGVtZW50P3QuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pOmI/dC5jcmVhdGVFbGVtZW50TlMuY2FsbCh0LFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixhcmd1bWVudHNbMF0pOnQuY3JlYXRlRWxlbWVudC5hcHBseSh0LGFyZ3VtZW50cyl9ZnVuY3Rpb24gbChlKXtyZXR1cm4gZS5yZXBsYWNlKC8oW2Etel0pLShbYS16XSkvZyxmdW5jdGlvbihlLHQsbil7cmV0dXJuIHQrbi50b1VwcGVyQ2FzZSgpfSkucmVwbGFjZSgvXi0vLFwiXCIpfWZ1bmN0aW9uIGMoZSx0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0LGFyZ3VtZW50cyl9fWZ1bmN0aW9uIHUoZSx0LG4pe3ZhciBvO2Zvcih2YXIgYSBpbiBlKWlmKGVbYV1pbiB0KXJldHVybiBuPT09ITE/ZVthXToobz10W2VbYV1dLHIobyxcImZ1bmN0aW9uXCIpP2MobyxufHx0KTpvKTtyZXR1cm4hMX1mdW5jdGlvbiBmKGUpe3JldHVybiBlLnJlcGxhY2UoLyhbQS1aXSkvZyxmdW5jdGlvbihlLHQpe3JldHVyblwiLVwiK3QudG9Mb3dlckNhc2UoKX0pLnJlcGxhY2UoL15tcy0vLFwiLW1zLVwiKX1mdW5jdGlvbiBkKCl7dmFyIGU9dC5ib2R5O3JldHVybiBlfHwoZT1zKGI/XCJzdmdcIjpcImJvZHlcIiksZS5mYWtlPSEwKSxlfWZ1bmN0aW9uIHAoZSxuLHIsbyl7dmFyIGEsaSxsLGMsdT1cIm1vZGVybml6clwiLGY9cyhcImRpdlwiKSxwPWQoKTtpZihwYXJzZUludChyLDEwKSlmb3IoO3ItLTspbD1zKFwiZGl2XCIpLGwuaWQ9bz9vW3JdOnUrKHIrMSksZi5hcHBlbmRDaGlsZChsKTtyZXR1cm4gYT1zKFwic3R5bGVcIiksYS50eXBlPVwidGV4dC9jc3NcIixhLmlkPVwic1wiK3UsKHAuZmFrZT9wOmYpLmFwcGVuZENoaWxkKGEpLHAuYXBwZW5kQ2hpbGQoZiksYS5zdHlsZVNoZWV0P2Euc3R5bGVTaGVldC5jc3NUZXh0PWU6YS5hcHBlbmRDaGlsZCh0LmNyZWF0ZVRleHROb2RlKGUpKSxmLmlkPXUscC5mYWtlJiYocC5zdHlsZS5iYWNrZ3JvdW5kPVwiXCIscC5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLGM9Uy5zdHlsZS5vdmVyZmxvdyxTLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIsUy5hcHBlbmRDaGlsZChwKSksaT1uKGYsZSkscC5mYWtlPyhwLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocCksUy5zdHlsZS5vdmVyZmxvdz1jLFMub2Zmc2V0SGVpZ2h0KTpmLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZiksISFpfWZ1bmN0aW9uIG0odCxyKXt2YXIgbz10Lmxlbmd0aDtpZihcIkNTU1wiaW4gZSYmXCJzdXBwb3J0c1wiaW4gZS5DU1Mpe2Zvcig7by0tOylpZihlLkNTUy5zdXBwb3J0cyhmKHRbb10pLHIpKXJldHVybiEwO3JldHVybiExfWlmKFwiQ1NTU3VwcG9ydHNSdWxlXCJpbiBlKXtmb3IodmFyIGE9W107by0tOylhLnB1c2goXCIoXCIrZih0W29dKStcIjpcIityK1wiKVwiKTtyZXR1cm4gYT1hLmpvaW4oXCIgb3IgXCIpLHAoXCJAc3VwcG9ydHMgKFwiK2ErXCIpIHsgI21vZGVybml6ciB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfSB9XCIsZnVuY3Rpb24oZSl7cmV0dXJuXCJhYnNvbHV0ZVwiPT1nZXRDb21wdXRlZFN0eWxlKGUsbnVsbCkucG9zaXRpb259KX1yZXR1cm4gbn1mdW5jdGlvbiBoKGUsdCxvLGEpe2Z1bmN0aW9uIGMoKXtmJiYoZGVsZXRlIGouc3R5bGUsZGVsZXRlIGoubW9kRWxlbSl9aWYoYT1yKGEsXCJ1bmRlZmluZWRcIik/ITE6YSwhcihvLFwidW5kZWZpbmVkXCIpKXt2YXIgdT1tKGUsbyk7aWYoIXIodSxcInVuZGVmaW5lZFwiKSlyZXR1cm4gdX1mb3IodmFyIGYsZCxwLGgsZyx2PVtcIm1vZGVybml6clwiLFwidHNwYW5cIl07IWouc3R5bGU7KWY9ITAsai5tb2RFbGVtPXModi5zaGlmdCgpKSxqLnN0eWxlPWoubW9kRWxlbS5zdHlsZTtmb3IocD1lLmxlbmd0aCxkPTA7cD5kO2QrKylpZihoPWVbZF0sZz1qLnN0eWxlW2hdLGkoaCxcIi1cIikmJihoPWwoaCkpLGouc3R5bGVbaF0hPT1uKXtpZihhfHxyKG8sXCJ1bmRlZmluZWRcIikpcmV0dXJuIGMoKSxcInBmeFwiPT10P2g6ITA7dHJ5e2ouc3R5bGVbaF09b31jYXRjaCh5KXt9aWYoai5zdHlsZVtoXSE9ZylyZXR1cm4gYygpLFwicGZ4XCI9PXQ/aDohMH1yZXR1cm4gYygpLCExfWZ1bmN0aW9uIGcoZSx0LG4sbyxhKXt2YXIgaT1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK2Uuc2xpY2UoMSkscz0oZStcIiBcIit3LmpvaW4oaStcIiBcIikraSkuc3BsaXQoXCIgXCIpO3JldHVybiByKHQsXCJzdHJpbmdcIil8fHIodCxcInVuZGVmaW5lZFwiKT9oKHMsdCxvLGEpOihzPShlK1wiIFwiK18uam9pbihpK1wiIFwiKStpKS5zcGxpdChcIiBcIiksdShzLHQsbikpfWZ1bmN0aW9uIHYoZSx0LHIpe3JldHVybiBnKGUsbixuLHQscil9dmFyIHk9W10sQz1bXSxFPXtfdmVyc2lvbjpcIjMuMC4wLWFscGhhLjRcIixfY29uZmlnOntjbGFzc1ByZWZpeDpcIlwiLGVuYWJsZUNsYXNzZXM6ITAsZW5hYmxlSlNDbGFzczohMCx1c2VQcmVmaXhlczohMH0sX3E6W10sb246ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0KG5bZV0pfSwwKX0sYWRkVGVzdDpmdW5jdGlvbihlLHQsbil7Qy5wdXNoKHtuYW1lOmUsZm46dCxvcHRpb25zOm59KX0sYWRkQXN5bmNUZXN0OmZ1bmN0aW9uKGUpe0MucHVzaCh7bmFtZTpudWxsLGZuOmV9KX19LE1vZGVybml6cj1mdW5jdGlvbigpe307TW9kZXJuaXpyLnByb3RvdHlwZT1FLE1vZGVybml6cj1uZXcgTW9kZXJuaXpyO3ZhciBTPXQuZG9jdW1lbnRFbGVtZW50LGI9XCJzdmdcIj09PVMubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtifHwhZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCl7dmFyIG49ZS5jcmVhdGVFbGVtZW50KFwicFwiKSxyPWUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdfHxlLmRvY3VtZW50RWxlbWVudDtyZXR1cm4gbi5pbm5lckhUTUw9XCJ4PHN0eWxlPlwiK3QrXCI8L3N0eWxlPlwiLHIuaW5zZXJ0QmVmb3JlKG4ubGFzdENoaWxkLHIuZmlyc3RDaGlsZCl9ZnVuY3Rpb24gcigpe3ZhciBlPUMuZWxlbWVudHM7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGU/ZS5zcGxpdChcIiBcIik6ZX1mdW5jdGlvbiBvKGUsdCl7dmFyIG49Qy5lbGVtZW50cztcInN0cmluZ1wiIT10eXBlb2YgbiYmKG49bi5qb2luKFwiIFwiKSksXCJzdHJpbmdcIiE9dHlwZW9mIGUmJihlPWUuam9pbihcIiBcIikpLEMuZWxlbWVudHM9bitcIiBcIitlLGModCl9ZnVuY3Rpb24gYShlKXt2YXIgdD15W2VbZ11dO3JldHVybiB0fHwodD17fSx2KyssZVtnXT12LHlbdl09dCksdH1mdW5jdGlvbiBpKGUsbixyKXtpZihufHwobj10KSxmKXJldHVybiBuLmNyZWF0ZUVsZW1lbnQoZSk7cnx8KHI9YShuKSk7dmFyIG87cmV0dXJuIG89ci5jYWNoZVtlXT9yLmNhY2hlW2VdLmNsb25lTm9kZSgpOmgudGVzdChlKT8oci5jYWNoZVtlXT1yLmNyZWF0ZUVsZW0oZSkpLmNsb25lTm9kZSgpOnIuY3JlYXRlRWxlbShlKSwhby5jYW5IYXZlQ2hpbGRyZW58fG0udGVzdChlKXx8by50YWdVcm4/bzpyLmZyYWcuYXBwZW5kQ2hpbGQobyl9ZnVuY3Rpb24gcyhlLG4pe2lmKGV8fChlPXQpLGYpcmV0dXJuIGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO249bnx8YShlKTtmb3IodmFyIG89bi5mcmFnLmNsb25lTm9kZSgpLGk9MCxzPXIoKSxsPXMubGVuZ3RoO2w+aTtpKyspby5jcmVhdGVFbGVtZW50KHNbaV0pO3JldHVybiBvfWZ1bmN0aW9uIGwoZSx0KXt0LmNhY2hlfHwodC5jYWNoZT17fSx0LmNyZWF0ZUVsZW09ZS5jcmVhdGVFbGVtZW50LHQuY3JlYXRlRnJhZz1lLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQsdC5mcmFnPXQuY3JlYXRlRnJhZygpKSxlLmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24obil7cmV0dXJuIEMuc2hpdk1ldGhvZHM/aShuLGUsdCk6dC5jcmVhdGVFbGVtKG4pfSxlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ9RnVuY3Rpb24oXCJoLGZcIixcInJldHVybiBmdW5jdGlvbigpe3ZhciBuPWYuY2xvbmVOb2RlKCksYz1uLmNyZWF0ZUVsZW1lbnQ7aC5zaGl2TWV0aG9kcyYmKFwiK3IoKS5qb2luKCkucmVwbGFjZSgvW1xcd1xcLTpdKy9nLGZ1bmN0aW9uKGUpe3JldHVybiB0LmNyZWF0ZUVsZW0oZSksdC5mcmFnLmNyZWF0ZUVsZW1lbnQoZSksJ2MoXCInK2UrJ1wiKSd9KStcIik7cmV0dXJuIG59XCIpKEMsdC5mcmFnKX1mdW5jdGlvbiBjKGUpe2V8fChlPXQpO3ZhciByPWEoZSk7cmV0dXJuIUMuc2hpdkNTU3x8dXx8ci5oYXNDU1N8fChyLmhhc0NTUz0hIW4oZSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGZ8fGwoZSxyKSxlfXZhciB1LGYsZD1cIjMuNy4yXCIscD1lLmh0bWw1fHx7fSxtPS9ePHxeKD86YnV0dG9ufG1hcHxzZWxlY3R8dGV4dGFyZWF8b2JqZWN0fGlmcmFtZXxvcHRpb258b3B0Z3JvdXApJC9pLGg9L14oPzphfGJ8Y29kZXxkaXZ8ZmllbGRzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aXxsYWJlbHxsaXxvbHxwfHF8c3BhbnxzdHJvbmd8c3R5bGV8dGFibGV8dGJvZHl8dGR8dGh8dHJ8dWwpJC9pLGc9XCJfaHRtbDVzaGl2XCIsdj0wLHk9e307IWZ1bmN0aW9uKCl7dHJ5e3ZhciBlPXQuY3JlYXRlRWxlbWVudChcImFcIik7ZS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLHU9XCJoaWRkZW5cImluIGUsZj0xPT1lLmNoaWxkTm9kZXMubGVuZ3RofHxmdW5jdGlvbigpe3QuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGU9dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY2xvbmVOb2RlfHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50fHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jcmVhdGVFbGVtZW50fSgpfWNhdGNoKG4pe3U9ITAsZj0hMH19KCk7dmFyIEM9e2VsZW1lbnRzOnAuZWxlbWVudHN8fFwiYWJiciBhcnRpY2xlIGFzaWRlIGF1ZGlvIGJkaSBjYW52YXMgZGF0YSBkYXRhbGlzdCBkZXRhaWxzIGRpYWxvZyBmaWdjYXB0aW9uIGZpZ3VyZSBmb290ZXIgaGVhZGVyIGhncm91cCBtYWluIG1hcmsgbWV0ZXIgbmF2IG91dHB1dCBwaWN0dXJlIHByb2dyZXNzIHNlY3Rpb24gc3VtbWFyeSB0ZW1wbGF0ZSB0aW1lIHZpZGVvXCIsdmVyc2lvbjpkLHNoaXZDU1M6cC5zaGl2Q1NTIT09ITEsc3VwcG9ydHNVbmtub3duRWxlbWVudHM6ZixzaGl2TWV0aG9kczpwLnNoaXZNZXRob2RzIT09ITEsdHlwZTpcImRlZmF1bHRcIixzaGl2RG9jdW1lbnQ6YyxjcmVhdGVFbGVtZW50OmksY3JlYXRlRG9jdW1lbnRGcmFnbWVudDpzLGFkZEVsZW1lbnRzOm99O2UuaHRtbDU9QyxjKHQpfSh0aGlzLHQpO3ZhciB4PVwiTW96IE8gbXMgV2Via2l0XCIsdz1FLl9jb25maWcudXNlUHJlZml4ZXM/eC5zcGxpdChcIiBcIik6W107RS5fY3Nzb21QcmVmaXhlcz13O3ZhciBfPUUuX2NvbmZpZy51c2VQcmVmaXhlcz94LnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpOltdO0UuX2RvbVByZWZpeGVzPV87dmFyIE49e2VsZW06cyhcIm1vZGVybml6clwiKX07TW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKXtkZWxldGUgTi5lbGVtfSk7dmFyIGo9e3N0eWxlOk4uZWxlbS5zdHlsZX07TW9kZXJuaXpyLl9xLnVuc2hpZnQoZnVuY3Rpb24oKXtkZWxldGUgai5zdHlsZX0pLEUudGVzdEFsbFByb3BzPWcsRS50ZXN0QWxsUHJvcHM9dixNb2Rlcm5penIuYWRkVGVzdChcImZsZXhib3hcIix2KFwiZmxleEJhc2lzXCIsXCIxcHhcIiwhMCkpLG8oKSxhKHkpLGRlbGV0ZSBFLmFkZFRlc3QsZGVsZXRlIEUuYWRkQXN5bmNUZXN0O2Zvcih2YXIgaz0wO2s8TW9kZXJuaXpyLl9xLmxlbmd0aDtrKyspTW9kZXJuaXpyLl9xW2tdKCk7ZS5Nb2Rlcm5penI9TW9kZXJuaXpyfSh3aW5kb3csZG9jdW1lbnQpOyIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uKCkge1xuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIGRpbWVuc2lvbiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXXxFbGVtZW50c3xqUXVlcnl9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgdGhpcy5SZXNpemVTZW5zb3IgPSBmdW5jdGlvbihlbGVtZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBFdmVudFF1ZXVlKCkge1xuICAgICAgICAgICAgdGhpcy5xID0gW107XG4gICAgICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xLnB1c2goZXYpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gdGhpcy5xLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnFbaV0uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICBwcm9wXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd8TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBwcm9wKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jdXJyZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5jdXJyZW50U3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgcmVzaXplZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgcmVzaXplZCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICdyZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7JztcblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3Iuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInJlc2l6ZS1zZW5zb3ItZXhwYW5kXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICcgd2lkdGg6IDIwMCU7IGhlaWdodDogMjAwJVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG5cbiAgICAgICAgICAgIGlmICghe2ZpeGVkOiAxLCBhYnNvbHV0ZTogMX1bZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cGFuZCA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgZXhwYW5kQ2hpbGQgPSBleHBhbmQuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmsgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzFdO1xuICAgICAgICAgICAgdmFyIHNocmlua0NoaWxkID0gc2hyaW5rLmNoaWxkTm9kZXNbMF07XG5cbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGgsIGxhc3RIZWlnaHQ7XG5cbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gZXhwYW5kLm9mZnNldFdpZHRoICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9IGV4cGFuZC5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSBleHBhbmQuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IGV4cGFuZC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSBzaHJpbmsuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IHNocmluay5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNldCgpO1xuXG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24oZWwsIG5hbWUsIGNiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBuYW1lLCBjYik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBjYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYWRkRXZlbnQoZXhwYW5kLCAnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBsYXN0V2lkdGggfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiBsYXN0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IDwgbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcIltvYmplY3QgQXJyYXldXCIgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlbGVtZW50KVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5ICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkpIC8vanF1ZXJ5XG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBFbGVtZW50cyAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudHMpIC8vbW9vdG9vbHNcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFyIGkgPSAwLCBqID0gZWxlbWVudC5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnRbaV0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGV0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXNpemVTZW5zb3IuZGV0YWNoKGVsZW1lbnQpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB0aGlzLlJlc2l6ZVNlbnNvci5kZXRhY2ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnJlc2l6ZVNlbnNvcikge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5yZXNpemVTZW5zb3I7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KSgpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5FTEVNRU5UIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIHZpZXdwb3J0ID0gJCh3aW5kb3cpO1xyXG5cclxuXHJcblx0Ly8gRWxlbWVudCBBbmltYXRpb25zXHJcblx0ZnVuY3Rpb24gbWl4dEFuaW1hdGlvbnMoKSB7XHJcblx0XHR2YXIgYW5pbUVsZW1zID0gJCgnLm1peHQtYW5pbWF0ZScpO1xyXG5cclxuXHRcdGlmICggYW5pbUVsZW1zLmxlbmd0aCA9PT0gMCApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0YW5pbUVsZW1zLndheXBvaW50KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbS1wcmUnKS5hZGRDbGFzcygnYW5pbS1zdGFydCcpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0b2Zmc2V0OiAnODUlJyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sIDEwMDAgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdG1peHRBbmltYXRpb25zKCk7XHJcblxyXG5cclxuXHQvLyBTdGF0IC8gQ291bnRlciBFbGVtZW50XHJcblx0ZnVuY3Rpb24gbWl4dFN0YXRzKCkge1xyXG5cdFx0dmFyIHN0YXRFbGVtcyA9ICQoJy5taXh0LXN0YXQnKTtcclxuXHJcblx0XHRpZiAoIHN0YXRFbGVtcy5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdC8vIFNldCBzdGF0IHRleHQgdG8gc3RhcnRpbmcgKGZyb20pIHZhbHVlXHJcblx0XHRzdGF0RWxlbXMuZmluZCgnLnN0YXQtdmFsdWUnKS5lYWNoKCBmdW5jdGlvbigpIHsgJCh0aGlzKS50ZXh0KCQodGhpcykuZGF0YSgnZnJvbScpKTsgfSk7XHJcblxyXG5cdFx0Ly8gQW5pbWF0ZSB2YWx1ZVxyXG5cdFx0ZnVuY3Rpb24gc3RhdFZhbHVlKGVsKSB7XHJcblx0XHRcdHZhciBmcm9tICA9IGVsLmRhdGEoJ2Zyb20nKSxcclxuXHRcdFx0XHR0byAgICA9IGVsLmRhdGEoJ3RvJyksXHJcblx0XHRcdFx0c3BlZWQgPSBlbC5kYXRhKCdzcGVlZCcpO1xyXG5cdFx0XHQkKHt2YWx1ZTogZnJvbX0pLmFuaW1hdGUoe3ZhbHVlOiB0b30sIHtcclxuXHRcdFx0XHRkdXJhdGlvbjogc3BlZWQsXHJcblx0XHRcdFx0c3RlcDogZnVuY3Rpb24oKSB7IGVsLnRleHQoTWF0aC5yb3VuZCh0aGlzLnZhbHVlKSk7IH0sXHJcblx0XHRcdFx0YWx3YXlzOiBmdW5jdGlvbigpIHsgZWwudGV4dCh0byk7IH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxyXG5cdFx0ZnVuY3Rpb24gc3RhdENpcmNsZShzdGF0KSB7XHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4uY2lyY2xlUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuY3NzKCdtYXJnaW4tdG9wJywgJCh0aGlzKS5oZWlnaHQoKSAvIC0yKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzdGF0RWxlbXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHN0YXQgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRzdGF0LndheXBvaW50KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XHJcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHRoaXMuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJyApIHRoaXMuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXJPbmNlOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c3RhdFZhbHVlKHN0YXQuZmluZCgnLnN0YXQtdmFsdWUnKSk7XHJcblx0XHRcdFx0XHRzdGF0Q2lyY2xlKHN0YXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0bWl4dFN0YXRzKCk7XHJcblxyXG5cclxuXHQvLyBGbGlwIENhcmQgRXF1YWxpemUgSGVpZ2h0XHJcblx0aWYgKCB0eXBlb2YgJC5mbi5tYXRjaEhlaWdodCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcclxuXHRcdGZsaXBjYXJkU2lkZXMuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0ZmxpcGNhcmRTaWRlcy5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gRmxpcCBDYXJkIFRvdWNoIFNjcmVlbiBcIkhvdmVyXCJcclxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XHJcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcicpO1xyXG5cdH0pO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5IRUFERVIgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQgKi9cclxuXHJcblx0dmFyIHZpZXdwb3J0ICA9ICQod2luZG93KSxcclxuXHRcdG1haW5OYXZCYXIgPSAkKCcjbWFpbi1uYXYnKSxcclxuXHRcdG1lZGlhV3JhcCA9ICQoJy5oZWFkLW1lZGlhJyk7XHJcblxyXG5cdC8vIEhlYWQgTWVkaWEgRnVuY3Rpb25zXHJcblx0ZnVuY3Rpb24gaGVhZGVyRm4oKSB7XHJcblx0XHR2YXIgY29udGFpbmVyICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXHJcblx0XHRcdG1lZGlhQ29udCAgICA9IG1lZGlhV3JhcC5jaGlsZHJlbignLm1lZGlhLWNvbnRhaW5lcicpLFxyXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2QmFyLm91dGVySGVpZ2h0KCksXHJcblx0XHRcdHdyYXBIZWlnaHQgICA9IG1lZGlhV3JhcC5oZWlnaHQoKSxcclxuXHRcdFx0aG1IZWlnaHQgICAgID0gMDtcclxuXHJcblx0XHRpZiAoIG1peHRfb3B0LmhlYWRlci5mdWxsc2NyZWVuICkge1xyXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCB3cmFwSGVpZ2h0KTtcclxuXHRcdFx0XHJcblx0XHRcdGhtSGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0KCkgLSBtZWRpYVdyYXAub2Zmc2V0KCkudG9wO1xyXG5cclxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIHsgaG1IZWlnaHQgLT0gdG9wTmF2SGVpZ2h0OyB9XHJcblxyXG5cdFx0XHRtZWRpYVdyYXAuY3NzKCdoZWlnaHQnLCBobUhlaWdodCk7XHJcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGhtSGVpZ2h0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtZWRpYUNvbnQubGVuZ3RoID09IDEgKSB7XHJcblx0XHRcdHZhciBjb250YWluZXJQYWQgPSB0b3BOYXZIZWlnaHQ7XHJcblxyXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xyXG5cdFx0XHRcdGNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJywgY29udGFpbmVyUGFkKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb250YWluZXIuY3NzKCdwYWRkaW5nLXRvcCcsIGNvbnRhaW5lclBhZCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEhlYWRlciBTY3JvbGwgVG8gQ29udGVudFxyXG5cdGZ1bmN0aW9uIGhlYWRlclNjcm9sbCgpIHtcclxuXHRcdHZhciBwYWdlICAgPSAkKCdodG1sLCBib2R5JyksXHJcblx0XHRcdG9mZnNldCA9ICQoJyNjb250ZW50LXdyYXAnKS5vZmZzZXQoKS50b3A7XHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7IG9mZnNldCAtPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJykuaGVpZ2h0KCk7IH1cclxuXHRcdCQoJy5oZWFkZXItc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHBhZ2UuYW5pbWF0ZSh7IHNjcm9sbFRvcDogb2Zmc2V0IH0sIDgwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmICggbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XHJcblx0XHRoZWFkZXJGbigpO1xyXG5cclxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnNjcm9sbCApIHsgaGVhZGVyU2Nyb2xsKCk7IH1cclxuXHRcdFxyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBoZWFkZXJGbiApKTtcclxuXHR9XHJcblxyXG59KGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVMUEVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXG5cdFx0Ym9keUVsICAgPSAkKCdib2R5Jyk7XG5cblx0Ly8gU2tpcCBMaW5rIEZvY3VzIEZpeFxuXHRcblx0dmFyIGlzX3dlYmtpdCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApID4gLTEsXG5cdFx0aXNfb3BlcmEgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSAgPiAtMSxcblx0XHRpc19pZSAgICAgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICkgICA+IC0xO1xuXG5cdGlmICggKCBpc193ZWJraXQgfHwgaXNfb3BlcmEgfHwgaXNfaWUgKSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCApICkge1xuXHRcdHZhciBldmVudE1ldGhvZCA9ICggd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdhdHRhY2hFdmVudCc7XG5cdFx0d2luZG93WyBldmVudE1ldGhvZCBdKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYXxkaXYpJC9pLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gQXBwbHkgQm9vdHN0cmFwIENsYXNzZXNcblx0XG5cdHZhciB3b29Db21tV3JhcCA9ICQoJy53b29jb21tZXJjZScpO1xuXHRcblx0dmFyIHdpZGdldE5hdk1lbnVzID0gJy53aWRnZXRfbWV0YSwgLndpZGdldF9yZWNlbnRfZW50cmllcywgLndpZGdldF9hcmNoaXZlLCAud2lkZ2V0X2NhdGVnb3JpZXMsIC53aWRnZXRfbmF2X21lbnUsIC53aWRnZXRfcGFnZXMsIC53aWRnZXRfcnNzJztcblxuXHQvLyBXb29Db21tZXJjZSBXaWRnZXRzICYgRWxlbWVudHNcblx0aWYgKCB3b29Db21tV3JhcC5sZW5ndGggKSB7XG5cdFx0d2lkZ2V0TmF2TWVudXMgKz0gJywgLndpZGdldF9wcm9kdWN0X2NhdGVnb3JpZXMsIC53aWRnZXRfcHJvZHVjdHMsIC53aWRnZXRfdG9wX3JhdGVkX3Byb2R1Y3RzLCAud2lkZ2V0X3JlY2VudF9yZXZpZXdzLCAud2lkZ2V0X3JlY2VudGx5X3ZpZXdlZF9wcm9kdWN0cywgLndpZGdldF9sYXllcmVkX25hdic7XG5cblx0XHR3b29Db21tV3JhcC5maW5kKCcuc2hvcF90YWJsZScpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1ib3JkZXJlZCcpO1xuXG5cdFx0JChkb2N1bWVudC5ib2R5KS5vbigndXBkYXRlZF9jaGVja291dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLnNob3BfdGFibGUnKS5hZGRDbGFzcygndGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtc3RyaXBlZCcpO1xuXHRcdH0pO1xuXHR9XG5cblx0JCh3aWRnZXROYXZNZW51cykuY2hpbGRyZW4oJ3VsJykuYWRkQ2xhc3MoJ25hdicpO1xuXHQkKCcud2lkZ2V0X25hdl9tZW51IHVsLm1lbnUnKS5hZGRDbGFzcygnbmF2Jyk7XG5cblx0JCgnI3dwLWNhbGVuZGFyJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQnKTtcblxuXHQvLyBIYW5kbGUgUG9zdCBDb3VudCBUYWdzXG5cblx0JCgnLndpZGdldF9hcmNoaXZlIGxpLCAud2lkZ2V0X2NhdGVnb3JpZXMgbGknKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcblx0XHRcdGNoaWxkcmVuICA9ICR0aGlzLmNoaWxkcmVuKCksXG5cdFx0XHRhbmNob3IgICAgPSBjaGlsZHJlbi5maWx0ZXIoJ2EnKSxcblx0XHRcdGNvbnRlbnRzICA9ICR0aGlzLmNvbnRlbnRzKCksXG5cdFx0XHRjb3VudFRleHQgPSBjb250ZW50cy5ub3QoY2hpbGRyZW4pLnRleHQoKTtcblxuXHRcdGlmICggY291bnRUZXh0ICE9PSAnJyApIHtcblx0XHRcdGFuY2hvci5hcHBlbmQoJzxzcGFuIGNsYXNzPVwicG9zdC1jb3VudFwiPicgKyBjb3VudFRleHQgKyAnPC9zcGFuPicpO1xuXHRcdFx0Y29udGVudHMuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDM7IFxuXHRcdFx0fSkucmVtb3ZlKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcud2lkZ2V0X2xheWVyZWRfbmF2IGxpJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdGNvdW50ID0gJHRoaXMuY2hpbGRyZW4oJy5jb3VudCcpLFxuXHRcdFx0bGluayAgPSAkdGhpcy5jaGlsZHJlbignYScpO1xuXHRcdGNvdW50LmFwcGVuZFRvKGxpbmspO1xuXHR9KTtcblxuXHQvLyBHYWxsZXJ5IEFycm93IE5hdmlnYXRpb25cblxuXHQkKGRvY3VtZW50KS5rZXlkb3duKCBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHVybCA9IGZhbHNlO1xuXHRcdGlmICggZS53aGljaCA9PT0gMzcgKSB7ICAvLyBMZWZ0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcucHJldmlvdXMtaW1hZ2UgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9IGVsc2UgaWYgKCBlLndoaWNoID09PSAzOSApIHsgIC8vIFJpZ2h0IGFycm93IGtleSBjb2RlXG5cdFx0XHR1cmwgPSAkKCcuZW50cnktYXR0YWNobWVudCBhJykuYXR0cignaHJlZicpO1xuXHRcdH1cblx0XHRpZiAoIHVybCAmJiAoICEkKCd0ZXh0YXJlYSwgaW5wdXQnKS5pcygnOmZvY3VzJykgKSApIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFBsdWdpbnNcblxuXHR2aWV3cG9ydC5sb2FkKCBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0R2FsbGVyeSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdHZhciB0aGVtZSA9ICQoJyNtYWluLXdyYXAtaW5uZXInKVswXS5jbGFzc05hbWUubWF0Y2goLyh0aGVtZS1bXlxcc10qKS8pWzFdO1xuXHRcdFx0Ym9keUVsLm9uKCdvbkFmdGVyT3Blbi5sZyBvbkJlZm9yZUNsb3NlLmxnJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGJvZHlFbC50b2dnbGVDbGFzcyh0aGVtZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5OQVZCQVIgRlVOQ1RJT05TXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgbWl4dF9vcHQsIGNvbG9yTG9ELCBjb2xvclRvUmdiYSAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgICAgID0gJCh3aW5kb3cpLFxyXG5cdFx0Ym9keUVsICAgICAgID0gJCgnYm9keScpLFxyXG5cdFx0bWFpbldyYXAgICAgID0gJCgnI21haW4td3JhcCcpLFxyXG5cdFx0bWFpbk5hdldyYXAgID0gJCgnI21haW4tbmF2LXdyYXAnKSxcclxuXHRcdG1haW5OYXZCYXIgICA9ICQoJyNtYWluLW5hdicpLFxyXG5cdFx0bWFpbk5hdkNvbnQgID0gbWFpbk5hdkJhci5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxyXG5cdFx0bWFpbk5hdkhlYWQgID0gJCgnLm5hdmJhci1oZWFkZXInLCBtYWluTmF2QmFyKSxcclxuXHRcdG1haW5OYXZJbm5lciA9ICQoJy5uYXZiYXItaW5uZXInLCBtYWluTmF2QmFyKSxcclxuXHRcdHNlY05hdkJhciAgICA9ICQoJyNzZWNvbmQtbmF2JyksXHJcblx0XHRzZWNOYXZDb250ICAgPSBzZWNOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcclxuXHRcdG5hdmJhcnMgICAgICA9ICQoJy5uYXZiYXInKSxcclxuXHRcdG1lZGlhV3JhcCAgICA9ICQoJy5oZWFkLW1lZGlhJyk7XHJcblxyXG5cdGlmICggbWFpbk5hdkJhci5sZW5ndGggPT09IDAgKSByZXR1cm47XHJcblxyXG5cdHZhciBuYXZiYXJPYmogPSB7XHJcblxyXG5cdFx0bmF2Qmc6ICcnLFxyXG5cdFx0bmF2QmdUb3A6ICcnLFxyXG5cclxuXHRcdC8vIEluaXRpYWxpemUgTmF2YmFyXHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24obmF2YmFyKSB7XHJcblxyXG5cdFx0XHR2YXIgYmdDb2xvciAgPSBuYXZiYXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyksXHJcblx0XHRcdFx0ZGF0YUNvbnQgPSBuYXZiYXIuZmluZCgnLm5hdmJhci1kYXRhJyksXHJcblx0XHRcdFx0Y29sb3JMdW0gPSBkYXRhQ29udC5sZW5ndGggPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkYXRhQ29udFswXSwgJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpIDogJyc7XHJcblxyXG5cdFx0XHRpZiAoIGNvbG9yTHVtICE9ICdkYXJrJyAmJiBjb2xvckx1bSAhPSAnbGlnaHQnICkgY29sb3JMdW0gPSBjb2xvckxvRChiZ0NvbG9yKTtcclxuXHJcblx0XHRcdGlmICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkge1xyXG5cclxuXHRcdFx0XHRuYXZiYXJPYmoubmF2QmcgPSAoIGNvbG9yTHVtID09ICdkYXJrJyApID8gJ2JnLWRhcmsnIDogJ2JnLWxpZ2h0JztcclxuXHRcdFx0XHRuYXZiYXIuYWRkQ2xhc3MobmF2YmFyT2JqLm5hdkJnKTtcclxuXHJcblx0XHRcdFx0bWFpbk5hdkJhci5hdHRyKCdkYXRhLWJnJywgY29sb3JMdW0pO1xyXG5cclxuXHRcdFx0XHR2YXIgaGVhZENzc1NoZWV0ID0gJCgnPHN0eWxlIGRhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIj4nKS5hcHBlbmRUbygkKCdoZWFkJykpO1xyXG5cclxuXHRcdFx0XHRoZWFkQ3NzU2hlZXQuYXBwZW5kKCcubmF2YmFyLm5hdmJhci1taXh0Om5vdCgucG9zaXRpb24tdG9wKTpub3QoLnZlcnRpY2FsKSB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JUb1JnYmEoYmdDb2xvciwgbWl4dF9vcHQubmF2Lm9wYWNpdHkpKyc7IH0nKTtcclxuXHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgJiYgbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XHJcblx0XHRcdFx0XHRoZWFkQ3NzU2hlZXQuYXBwZW5kKCcubmF2LXRyYW5zcGFyZW50IC5uYXZiYXIubmF2YmFyLW1peHQucG9zaXRpb24tdG9wIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10pKyc7IH0nKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPD0gMC40ICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIG1lZGlhV3JhcC5oYXNDbGFzcygnYmctZGFyaycpICkgeyBuYXZiYXJPYmoubmF2QmdUb3AgPSAnYmctZGFyayc7IH1cclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIG1lZGlhV3JhcC5oYXNDbGFzcygnYmctbGlnaHQnKSApIHsgbmF2YmFyT2JqLm5hdkJnVG9wID0gJ2JnLWxpZ2h0JzsgfVxyXG5cdFx0XHRcdFx0XHRlbHNlIHsgbmF2YmFyT2JqLm5hdkJnVG9wID0gbmF2YmFyT2JqLm5hdkJnOyB9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG5hdmJhck9iai5uYXZCZ1RvcCA9IG5hdmJhck9iai5uYXZCZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnc3RhdGljJyApIHtcclxuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MobmF2YmFyT2JqLm5hdkJnKS5hZGRDbGFzcygncG9zaXRpb24tdG9wICcgKyBuYXZiYXJPYmoubmF2QmdUb3ApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoIGNvbG9yTHVtID09ICdkYXJrJyApIHtcclxuXHRcdFx0XHRcdG5hdmJhci5hZGRDbGFzcygnYmctZGFyaycpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRuYXZiYXIuYWRkQ2xhc3MoJ2JnLWxpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdG5hdmJhci5yZW1vdmVDbGFzcygnaW5pdCcpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBTdGlja3kgKGZpeGVkKSBOYXZiYXIgRnVuY3Rpb25cclxuXHJcblx0XHRzdGlja3lOYXY6IGZ1bmN0aW9uKGlzTW9iaWxlKSB7XHJcblxyXG5cdFx0XHR2YXIgbmF2U2Nyb2xsSGFuZGxlciA9ICQudGhyb3R0bGUoIDUwLCBzdGlja3lOYXZUb2dnbGUgKSxcclxuXHRcdFx0XHRzY3JvbGxDb3JyZWN0aW9uID0gMCxcclxuXHRcdFx0XHRtYWluTmF2SGVpZ2h0ICAgICA9IDAsXHJcblx0XHRcdFx0bWFpbk5hdlBvcyAgICAgICAgPSAwLFxyXG5cdFx0XHRcdG1haW5OYXZNZyAgICAgICAgID0gMDtcclxuXHJcblx0XHRcdGlmICggaXNNb2JpbGUgPT09IGZhbHNlICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgbmF2U2Nyb2xsSGFuZGxlcik7IH1cclxuXHRcdFx0ZWxzZSB7IHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgbmF2U2Nyb2xsSGFuZGxlcik7IH1cclxuXHJcblx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcclxuXHRcdFx0XHRzY3JvbGxDb3JyZWN0aW9uICs9IHBhcnNlRmxvYXQobWFpbldyYXAuY3NzKCdwYWRkaW5nLXRvcCcpLCAxMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xyXG5cdFx0XHRcdG1haW5OYXZIZWlnaHQgPSBtYWluTmF2QmFyLmNzcygnaGVpZ2h0JywgJycpLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0bWFpbk5hdlBvcyAgICA9IHBhcnNlSW50KG1haW5OYXZCYXIuY3NzKCd0b3AnKSwgMTApO1xyXG5cdFx0XHRcdG1haW5OYXZNZyAgICAgPSBtYWluTmF2SGVpZ2h0O1xyXG5cclxuXHRcdFx0XHRpZiAoIG1haW5OYXZQb3MgPT09IDAgfHwgaXNOYU4obWFpbk5hdlBvcykgKSB7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLmNzcygnbWFyZ2luLXRvcCcsIChtYWluTmF2SGVpZ2h0ICogLTEpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHN0aWNreU5hdlRvZ2dsZSgpIHtcclxuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wIC0gbWFpbk5hdk1nLFxyXG5cdFx0XHRcdFx0c2Nyb2xsVmFsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRiZ1RvcENscyAgPSBuYXZiYXJPYmoubmF2QmdUb3A7XHJcblxyXG5cdFx0XHRcdHNjcm9sbFZhbCA9IGlzTW9iaWxlID09PSB0cnVlID8gMCA6IHNjcm9sbFZhbCArPSBzY3JvbGxDb3JyZWN0aW9uO1xyXG5cclxuXHRcdFx0XHRpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cclxuXHRcdFx0XHRlbHNlIGlmICggbWFpbk5hdkJhci5oYXNDbGFzcygnc2xpZGUtYmctbGlnaHQnKSAmJiAoIG5hdmJhck9iai5uYXZCZyAhPSAnYmctZGFyaycgfHwgbWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddIDw9IDAuNCApICkgeyBiZ1RvcENscyA9ICdiZy1saWdodCc7IH1cclxuXHJcblx0XHRcdFx0aWYgKCBzY3JvbGxWYWwgPiBuYXZQb3MgKSB7ICBcclxuXHRcdFx0XHRcdGJvZHlFbC5hZGRDbGFzcygnZml4ZWQtbmF2Jyk7XHJcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdwb3NpdGlvbi10b3AgJyArIGJnVG9wQ2xzKS5hZGRDbGFzcyhuYXZiYXJPYmoubmF2QmcpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRib2R5RWwucmVtb3ZlQ2xhc3MoJ2ZpeGVkLW5hdicpO1xyXG5cdFx0XHRcdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcyhuYXZiYXJPYmoubmF2QmcpLmFkZENsYXNzKCdwb3NpdGlvbi10b3AgJyArIGJnVG9wQ2xzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0aWNreU5hdlRvZ2dsZSgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBQcmV2ZW50IE5hdmJhciBTdWJtZW51IE92ZXJmbG93IE91dCBPZiBWaWV3cG9ydFxyXG5cclxuXHRcdG1lbnVPdmVyZmxvdzogZnVuY3Rpb24obmF2YmFyKSB7XHJcblxyXG5cdFx0XHR2YXIgbmF2YmFyT2ZmID0gMCxcclxuXHRcdFx0XHRtYWluU3ViID0gbmF2YmFyLmZpbmQoJy5kcm9wLW1lbnUgLmRyb3Bkb3duLW1lbnUsIC5tZWdhLW1lbnUtY29sdW1uID4gLnN1Yi1tZW51LCAubWVnYS1tZW51LWNvbHVtbiA+IGEnKTtcclxuXHJcblx0XHRcdGlmICggbmF2YmFyLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdFx0bmF2YmFyT2ZmID0gbmF2YmFyLm91dGVyV2lkdGgoKSArIHBhcnNlSW50KG5hdmJhci5vZmZzZXQoKS5sZWZ0LCAxMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNldCBNZW51IERyb3AgTGVmdFxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc2V0RHJvcExlZnQodGFyZ2V0KSB7XHJcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLmFkZENsYXNzKCdkcm9wLWxlZnQnKTtcclxuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcclxuXHRcdFx0XHRcdHRhcmdldC5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctbGVmdCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBSZXNldCBNZW51IERyb3BcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHJlc2V0QXJyb3codGFyZ2V0KSB7XHJcblx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5zdWItbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQnKTtcclxuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcclxuXHRcdFx0XHRcdHRhcmdldC5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xyXG5cdFx0XHRcdFx0dGFyZ2V0LmZpbmQoJy5kcm9wLXN1Ym1lbnUnKS5hZGRDbGFzcygnYXJyb3ctcmlnaHQnKS5yZW1vdmVDbGFzcygnYXJyb3ctbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gUmVzZXQgTW9iaWxlIEFkanVzdG1lbnRzXHJcblxyXG5cdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcclxuXHJcblx0XHRcdC8vIFBlcmZvcm0gbWVudSBvdmVyZmxvdyBjaGVja3NcclxuXHJcblx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHN1YiAgICAgID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdHRvcFN1YiAgID0gc3ViLFxyXG5cdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXHJcblx0XHRcdFx0XHRzdWJQb3MgICA9IHBhcnNlSW50KHN1Yi5vZmZzZXQoKS5sZWZ0LCAxMCksXHJcblx0XHRcdFx0XHRzdWJXICAgICA9IHN1Yi5vdXRlcldpZHRoKCkgKyAxLFxyXG5cdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxyXG5cdFx0XHRcdFx0bmVzdFN1YnMgPSBzdWIuY2hpbGRyZW4oJy5kcm9wLXN1Ym1lbnUnKSxcclxuXHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IG5lc3RTdWJzLFxyXG5cdFx0XHRcdFx0Y29ycmVjdGlvbjtcclxuXHJcblx0XHRcdFx0aWYgKCBzdWJQYXIuaXMoJy5tZWdhLW1lbnUtY29sdW1uJykgKSB7XHJcblx0XHRcdFx0XHR0b3BTdWIgPSBzdWJQYXIucGFyZW50cygnLmRyb3Bkb3duLW1lbnUnKTtcclxuXHRcdFx0XHRcdG92ZXJmbG93aW5nU3VicyA9IHRvcFN1Yi5maW5kKCcubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQoNG4pIC5kcm9wLXN1Ym1lbnUsIC5tZWdhLW1lbnUtY29sdW1uOm50aC1jaGlsZChuLTQpOmxhc3QtY2hpbGQgLmRyb3Atc3VibWVudScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gVG9wIExldmVsIFN1Ym1lbnVzXHJcblxyXG5cdFx0XHRcdGlmICggbmVzdE9mZiA+IG5hdmJhck9mZiApIHtcclxuXHRcdFx0XHRcdHZhciBtZ05vdyA9IHBhcnNlSW50KHRvcFN1Yi5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKTtcclxuXHRcdFx0XHRcdGNvcnJlY3Rpb24gPSAobmVzdE9mZiAtIG5hdmJhck9mZiAtIDIpICogLTE7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCB0b3BTdWIuY3NzKCdib3JkZXItcmlnaHQtd2lkdGgnKSA9PSAnMXB4JyApIHsgY29ycmVjdGlvbiAtPSAxOyB9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBuYXZiYXIuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgfHwgbmF2YmFyLnBhcmVudHMoJy5uYXZiYXInKS5oYXNDbGFzcygnYm9yZGVyZWQnKSApIHsgY29ycmVjdGlvbiAtPSAxOyB9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBjb3JyZWN0aW9uIDwgbWdOb3cgKSB7XHJcblx0XHRcdFx0XHRcdHRvcFN1Yi5jc3MoJ21hcmdpbi1sZWZ0JywgY29ycmVjdGlvbiArICdweCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c2V0RHJvcExlZnQob3ZlcmZsb3dpbmdTdWJzKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIE5lc3RlZCBTdWJtZW51c1xyXG5cclxuXHRcdFx0XHRuZXN0U3Vicy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBzdWJOb3cgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0XHRuZXN0U3Vic1cgPSBbXTtcclxuXHRcdFx0XHRcdHN1Yk5vdy5maW5kKCcuc3ViLW1lbnU6bm90KDpoYXMoLmRyb3Atc3VibWVudSkpJykubWFwKCBmdW5jdGlvbihpKSB7XHJcblx0XHRcdFx0XHRcdHZhciAkdGhpcyAgICA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50cyAgPSAkdGhpcy5wYXJlbnRzKCcuc3ViLW1lbnUnKSxcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRzVyA9IDA7XHJcblxyXG5cdFx0XHRcdFx0XHRwYXJlbnRzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCAhICR0aGlzLmhhc0NsYXNzKCdkcm9wZG93bi1tZW51JykgJiYgISAkdGhpcy5oYXNDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRzVyArPSAkKHRoaXMpLm91dGVyV2lkdGgoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0bmVzdFN1YnNXW2ldID0gJHRoaXMub3V0ZXJXaWR0aCgpICsgcGFyZW50c1c7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR2YXIgbWF4TmVzdFcgPSAkLmlzRW1wdHlPYmplY3QobmVzdFN1YnNXKSA/IDAgOiBNYXRoLm1heC5hcHBseShudWxsLCBuZXN0U3Vic1cpO1xyXG5cclxuXHRcdFx0XHRcdGlmICggKG5lc3RPZmYgKyBtYXhOZXN0VykgPj0gYm9keUVsLndpZHRoKCkgKSB7XHJcblx0XHRcdFx0XHRcdHNldERyb3BMZWZ0KHN1Yk5vdyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNldEFycm93KHN1Yk5vdyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIE1lZ2EgTWVudSBFbmFibGUgLyBEaXNhYmxlXHJcblxyXG5cdFx0bWVnYU1lbnVUb2dnbGU6IGZ1bmN0aW9uKHRvZ2dsZSwgbmF2YmFyKSB7XHJcblx0XHRcdHZhciBtZWdhTWVudXM7XHJcblxyXG5cdFx0XHRpZiAoIHRvZ2dsZSA9PSAnZW5hYmxlJyApIHtcclxuXHRcdFx0XHRtZWdhTWVudXMgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudVtkYXRhLW1lZ2EtbWVudT1cInRydWVcIl0nKTtcclxuXHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRcdG1lZ2FNZW51LmFkZENsYXNzKCdtZWdhLW1lbnUnKS5yZW1vdmVDbGFzcygnZHJvcC1tZW51JykucmVtb3ZlQXR0cignZGF0YS1tZWdhLW1lbnUnKTtcclxuXHRcdFx0XHRcdCQoJz4gLnN1Yi1tZW51ID4gLmRyb3Atc3VibWVudScsIG1lZ2FNZW51KS5yZW1vdmVDbGFzcygnZHJvcC1zdWJtZW51JykuYWRkQ2xhc3MoJ21lZ2EtbWVudS1jb2x1bW4nKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRtZWdhTWVudXMuY2hpbGRyZW4oJ3VsJykuY3NzKCdtYXJnaW4tbGVmdCcsICcnKTtcclxuXHRcdFx0fSBlbHNlIGlmICggdG9nZ2xlID09ICdkaXNhYmxlJyApIHtcclxuXHRcdFx0XHRtZWdhTWVudXMgPSBuYXZiYXIuZmluZCgnLm1lZ2EtbWVudScpO1xyXG5cdFx0XHRcdG1lZ2FNZW51cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBtZWdhTWVudSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0bWVnYU1lbnUucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudScpLmFkZENsYXNzKCdkcm9wLW1lbnUnKS5hdHRyKCdkYXRhLW1lZ2EtbWVudScsICd0cnVlJyk7XHJcblx0XHRcdFx0XHRtZWdhTWVudS5maW5kKCcubWVnYS1tZW51LWNvbHVtbicpLnJlbW92ZUNsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykuYWRkQ2xhc3MoJ2Ryb3Atc3VibWVudScpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdG1lZ2FNZW51cy5jaGlsZHJlbigndWwnKS5jc3MoJ21hcmdpbi1sZWZ0JywgJycpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIENyZWF0ZSBNZWdhIE1lbnUgUm93cyBJZiBUaGVyZSBBcmUgTW9yZSBUaGFuIDQgQ29sdW1uc1xyXG5cclxuXHRcdG1lZ2FNZW51Um93czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdG1haW5XcmFwLmZpbmQoJy5tZWdhLW1lbnUnKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgbWFpbk1lbnUgPSAkKHRoaXMpLmNoaWxkcmVuKCcuc3ViLW1lbnUnKSxcclxuXHRcdFx0XHRcdGNvbHVtbnMgID0gbWFpbk1lbnUuY2hpbGRyZW4oJy5tZWdhLW1lbnUtY29sdW1uJyk7XHJcblxyXG5cdFx0XHRcdGlmICggY29sdW1ucy5sZW5ndGggPiA0ICkgbWFpbk1lbnUuYWRkQ2xhc3MoJ211bHRpLXJvdycpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTW9iaWxlIEZ1bmN0aW9uc1xyXG5cclxuXHRcdG5hdk1vYmlsZTogZnVuY3Rpb24obXFOYXYpIHtcclxuXHJcblx0XHRcdC8vIEVuYWJsZSBOYXYgU2Nyb2xsaW5nIElmIE5hdmJhciBIZWlnaHQgPiBWaWV3cG9ydFxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gbmF2U2Nyb2xsKCkge1xyXG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ2ZpeGVkJyAmJiBtcU5hdiA9PSAyICkge1xyXG5cdFx0XHRcdFx0dmFyIHZpZXdwb3J0SCAgICAgPSB2aWV3cG9ydC5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdFx0dmlld3BvcnRTICAgICA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJIZWFkZXJIID0gbWFpbk5hdkhlYWQuaGVpZ2h0KCkgKyAxLFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJJbm5lckggID0gbWFpbk5hdklubmVyLmhhc0NsYXNzKCdpbicpID8gbWFpbk5hdklubmVyLmhlaWdodCgpIDogMCxcclxuXHRcdFx0XHRcdFx0bmF2YmFySCAgICAgICA9IG5hdmJhckhlYWRlckggKyBuYXZiYXJJbm5lckgsXHJcblx0XHRcdFx0XHRcdG5hdmJhck1nICAgICAgPSAwLFxyXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgICAgID0gbWFpbk5hdkJhci5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0XHRcdG5hdndyYXBUb3AgICAgPSBtYWluTmF2V3JhcC5vZmZzZXQoKS50b3AsXHJcblxyXG5cdFx0XHRcdFx0XHRzY3JvbGxIYW5kbGVyID0gJC50aHJvdHRsZSggNTAsIG5hdlN0b3BTY3JvbGwgKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3Nob3ctYWRtaW4tYmFyJ10gKSB7XHJcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xyXG5cdFx0XHRcdFx0XHR2aWV3cG9ydEggIC09IGFkbWluQmFySDtcclxuXHRcdFx0XHRcdFx0bmF2d3JhcFRvcCAtPSBhZG1pbkJhckg7XHJcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xyXG5cdFx0XHRcdFx0XHRuYXZiYXJNZyA9IG5hdmJhckhlYWRlckggKiAtMTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIG5hdmJhckggPiB2aWV3cG9ydEggKSB7XHJcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyKTtcclxuXHRcdFx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLm5vdCgnc3RvcHBlZCcpICkge1xyXG5cdFx0XHRcdFx0XHRcdG1haW5OYXZCYXIuYWRkQ2xhc3MoJ3N0b3BwZWQnKS5jc3MoeyAncG9zaXRpb24nOiAnYWJzb2x1dGUnLCAndG9wJzogKG5hdmJhclRvcCAtIG5hdndyYXBUb3ApLCAnbWFyZ2luLXRvcCc6ICcwJyB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dmlld3BvcnQub2ZmKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyKTtcclxuXHRcdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoeyAncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnLCAnbWFyZ2luLXRvcCc6IG5hdmJhck1nIH0pLnJlbW92ZUNsYXNzKCdzdG9wcGVkJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBuYXZTdG9wU2Nyb2xsKCkge1xyXG5cdFx0XHRcdFx0dmFyIHZpZXdTY3JvbGwgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRcdFx0c3RvcFNjcm9sbCA9IG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3N0b3BwZWQnKSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGlmICggdmlld3BvcnRTID4gbWFpbk5hdkhlYWQub2Zmc2V0KCkudG9wICkgeyBzdG9wU2Nyb2xsID0gZmFsc2U7IH1cclxuXHRcdFx0XHRcdGlmICggdmlld3BvcnRTID4gdmlld1Njcm9sbCAmJiBzdG9wU2Nyb2xsICkgeyB2aWV3cG9ydC5zY3JvbGxUb3Aodmlld3BvcnRTKTsgfVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gU2hvdy9oaWRlIFN1Ym1lbnVzIE9uIEhhbmRsZSBDbGlja1xyXG5cclxuXHRcdFx0JCgnLmRyb3Bkb3duLXRvZ2dsZScsIG1haW5OYXZCYXIpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoICQoZXZlbnQudGFyZ2V0KS5pcygnLmRyb3AtYXJyb3cnKSApIHtcclxuXHRcdFx0XHRcdGlmKCBldmVudC5oYW5kbGVkICE9PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgaGFuZGxlID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0XHRtZW51ICAgPSBoYW5kbGUuY2xvc2VzdCgnLm1lbnUtaXRlbScpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCBtZW51Lmhhc0NsYXNzKCdleHBhbmQnKSApIHtcclxuXHRcdFx0XHRcdFx0XHRtZW51LnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWVudSkucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG1lbnUuYWRkQ2xhc3MoJ2V4cGFuZCcpLnNpYmxpbmdzKCdsaScpLnJlbW92ZUNsYXNzKCdleHBhbmQnKS5maW5kKCcuZXhwYW5kJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRuYXZTY3JvbGwoKTtcclxuXHJcblx0XHRcdFx0XHRcdGV2ZW50LmhhbmRsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWFpbk5hdklubmVyLm9uKCdzaG93bi5icy5jb2xsYXBzZSBoaWRkZW4uYnMuY29sbGFwc2UnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWFpbk5hdkJhcikucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG5cdFx0XHRcdG5hdlNjcm9sbCgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG5hdlNjcm9sbCgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdG5hdmJhck9iai5pbml0KCQodGhpcykpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdG5hdmJhck9iai5tZWdhTWVudVJvd3MoKTtcclxuXHJcblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnc3R5bGVbZGF0YS1pZD1cIm1peHQtbmF2LWNzc1wiXScpLnJlbW92ZSgpO1xyXG5cdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcygnYmctbGlnaHQgYmctZGFyaycpLmFkZENsYXNzKCdpbml0Jyk7XHJcblx0XHRuYXZiYXJPYmouaW5pdChtYWluTmF2QmFyKTtcclxuXHR9KTtcclxuXHJcblx0c2VjTmF2QmFyLm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XHJcblx0XHRzZWNOYXZCYXIucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0IGJnLWRhcmsnKTtcclxuXHRcdG5hdmJhck9iai5pbml0KHNlY05hdkJhcik7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBDaGVjayB3aGljaCBtZWRpYSBxdWVyaWVzIGFyZSBhY3RpdmVcclxuXHR2YXIgbXFDaGVjayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZiYXItZGF0YScpLCAnOmFmdGVyJykuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoL1wiL2csICcnKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gRW5hYmxlIE1lbnUgSG92ZXIgT24gVG91Y2ggU2NyZWVuc1xyXG5cdHZhciBtZW51UGFyZW50cyA9IG5hdmJhcnMuZmluZCgnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIGxpLmRyb3Bkb3duJyk7XHJcblx0ZnVuY3Rpb24gbWVudVRvdWNoSG92ZXIoZXZlbnQpIHtcclxuXHRcdHZhciBsaW5rID0gJChldmVudC5kZWxlZ2F0ZVRhcmdldCksXHJcblx0XHRcdGFuY2VzdG9ycyA9IGxpbmsucGFyZW50cygnLmhvdmVyJyk7XHJcblx0XHRpZiAobGluay5oYXNDbGFzcygnaG92ZXInKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxpbmsuYWRkQ2xhc3MoJ2hvdmVyJyk7XHJcblx0XHRcdG1lbnVQYXJlbnRzLm5vdChsaW5rKS5ub3QoYW5jZXN0b3JzKS5yZW1vdmVDbGFzcygnaG92ZXInKTtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBtZW51VG91Y2hSZW1vdmVIb3ZlcihldmVudCkge1xyXG5cdFx0aWYgKCAhICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLmlzKG1lbnVQYXJlbnRzKSApIHsgbWVudVBhcmVudHMucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7IH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBFbnN1cmUgdmVydGljYWwgbmF2YmFyIGl0ZW1zIGZpdCBpbiB2aWV3cG9ydFxyXG5cdGZ1bmN0aW9uIHZlcnRpY2FsTmF2Rml0VmlldygpIHtcclxuXHRcdGlmICggdmlld3BvcnQuaGVpZ2h0KCkgPCBtYWluTmF2Q29udC5pbm5lckhlaWdodCgpICkge1xyXG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtZml4ZWQnKS5hZGRDbGFzcygndmVydGljYWwtc3RhdGljJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtc3RhdGljJykuYWRkQ2xhc3MoJ3ZlcnRpY2FsLWZpeGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gSGFuZGxlIE5hdmJhciBJdGVtcyBPdmVybGFwXHJcblx0ZnVuY3Rpb24gbmF2YmFyT3ZlcmxhcCgpIHtcclxuXHRcdHZhciBtcU5hdiA9IG1xQ2hlY2soKSxcclxuXHRcdFx0bWFpbk5hdkxvZ29DbHMgPSAnbG9nby0nICsgbWFpbk5hdldyYXAuYXR0cignZGF0YS1sb2dvLWFsaWduJyk7XHJcblxyXG5cdFx0Ly8gUHJpbWFyeSBOYXZiYXJcclxuXHRcdGlmICggbWFpbk5hdkxvZ29DbHMgIT0gJ2xvZ28tY2VudGVyJyAmJiBtaXh0X29wdC5uYXYubGF5b3V0ID09ICdob3Jpem9udGFsJyApIHtcclxuXHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyJykuYWRkQ2xhc3MobWFpbk5hdkxvZ29DbHMpO1xyXG5cdFx0XHRpZiAoIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcclxuXHRcdFx0XHR2YXIgbWFpbk5hdkNvbnRXaWR0aCA9IG1haW5OYXZDb250LndpZHRoKCksXHJcblx0XHRcdFx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IG1haW5OYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcclxuXHRcdFx0XHRpZiAoIG1haW5OYXZJdGVtc1dpZHRoID4gbWFpbk5hdkNvbnRXaWR0aCApIHtcclxuXHRcdFx0XHRcdG1haW5OYXZXcmFwLnJlbW92ZUNsYXNzKG1haW5OYXZMb2dvQ2xzKS5hZGRDbGFzcygnbG9nby1jZW50ZXInKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZWNvbmRhcnkgTmF2YmFyXHJcblx0XHRpZiAoIHNlY05hdkJhci5sZW5ndGggKSB7XHJcblx0XHRcdHNlY05hdkJhci5yZW1vdmVDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xyXG5cdFx0XHR2YXIgc2VjTmF2Q29udFdpZHRoID0gc2VjTmF2Q29udC5pbm5lcldpZHRoKCksXHJcblx0XHRcdFx0c2VjTmF2SXRlbXNXaWR0aCA9ICQoJy5sZWZ0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpICsgJCgnLnJpZ2h0Jywgc2VjTmF2QmFyKS5vdXRlcldpZHRoKHRydWUpO1xyXG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XHJcblx0XHRcdFx0c2VjTmF2QmFyLmFkZENsYXNzKCdpdGVtcy1vdmVybGFwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBGdW5jdGlvbnMgUnVuIE9uIExvYWQgJiBXaW5kb3cgUmVzaXplXHJcblx0ZnVuY3Rpb24gbmF2YmFyRm4oKSB7XHJcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCk7XHJcblxyXG5cdFx0Ly8gUnVuIGZ1bmN0aW9uIHRvIHByZXZlbnQgc3VibWVudXMgZ29pbmcgb3V0c2lkZSB2aWV3cG9ydFxyXG5cdFx0bmF2YmFycy5ub3QobWFpbk5hdkJhcikuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdG5hdmJhck9iai5tZW51T3ZlcmZsb3coJCgnLm5hdmJhci1pbm5lcicsIHRoaXMpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJ1biBmdW5jdGlvbnMgYmFzZWQgb24gY3VycmVudGx5IGFjdGl2ZSBtZWRpYSBxdWVyeVxyXG5cdFx0aWYgKCBtcU5hdiA9PSAnZGVza3RvcCcgKSB7XHJcblx0XHRcdG5hdmJhck9iai5tZW51T3ZlcmZsb3cobWFpbk5hdklubmVyKTtcclxuXHRcdFx0bWFpbk5hdkJhci5jc3MoJ2hlaWdodCcsICcnKTtcclxuXHJcblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLm1lZ2FNZW51VG9nZ2xlKCdlbmFibGUnLCAkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtZW51UGFyZW50cy5vbigndG91Y2hzdGFydCcsIG1lbnVUb3VjaEhvdmVyKTtcclxuXHRcdFx0Ym9keUVsLm9uKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoUmVtb3ZlSG92ZXIpO1xyXG5cdFx0fSBlbHNlIGlmICggbXFOYXYgPT0gJ21vYmlsZScgfHwgbXFOYXYgPT0gJ3RhYmxldCcgKSB7XHJcblx0XHRcdG5hdmJhck9iai5uYXZNb2JpbGUobXFOYXYpO1xyXG5cclxuXHRcdFx0dmFyIG5hdkhlaWdodCA9IG1haW5OYXZIZWFkLm91dGVySGVpZ2h0KCkgKyAxO1xyXG5cdFx0XHRtYWluTmF2QmFyLmNzcygnaGVpZ2h0JywgbmF2SGVpZ2h0KTtcclxuXHJcblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLm1lZ2FNZW51VG9nZ2xlKCdkaXNhYmxlJywgJCh0aGlzKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWVudVBhcmVudHMub2ZmKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoSG92ZXIpO1xyXG5cdFx0XHRib2R5RWwub2ZmKCd0b3VjaHN0YXJ0JywgbWVudVRvdWNoUmVtb3ZlSG92ZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE1ha2UgcHJpbWFyeSBuYXZiYXIgc3RpY2t5IGlmIG9wdGlvbiBlbmFibGVkXHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7XHJcblx0XHRcdGlmICggbXFOYXYgPT09IDEgKSB7XHJcblx0XHRcdFx0bmF2YmFyT2JqLnN0aWNreU5hdih0cnVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuYXZiYXJPYmouc3RpY2t5TmF2KGZhbHNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bWFpbk5hdkJhci5hZGRDbGFzcygncG9zaXRpb24tdG9wJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVmVydGljYWwgbmF2YmFyIGhhbmRsaW5nXHJcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ3ZlcnRpY2FsJyAmJiBtaXh0X29wdC5uYXZbJ3ZlcnRpY2FsLW1vZGUnXSA9PSAnZml4ZWQnICYmIG1xTmF2ID09PSAwICkge1xyXG5cdFx0XHQvLyBNYWtlIG5hdmJhciBzdGF0aWMgaWYgaXRlbXMgZG9uJ3QgZml0IGluIHZpZXdwb3J0XHJcblx0XHRcdHZlcnRpY2FsTmF2Rml0VmlldygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5hdmJhck92ZXJsYXAoKTtcclxuXHR9XHJcblx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIG5hdmJhckZuICkpLnJlc2l6ZSgpO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5QT1NUIEZVTkNUSU9OU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIG1peHRfb3B0LCBpZnJhbWVBc3BlY3QsIE1vZGVybml6ciAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXHJcblx0XHRjb250ZW50ICA9ICQoJyNjb250ZW50Jyk7XHJcblxyXG5cdC8vIFJlc2l6ZSBFbWJlZGRlZCBWaWRlb3MgUHJvcG9ydGlvbmFsbHlcclxuXHRpZnJhbWVBc3BlY3QoICQoJy5wb3N0IGlmcmFtZScpICk7XHJcblxyXG5cdC8vIFBvc3QgTGF5b3V0XHJcblx0ZnVuY3Rpb24gcG9zdHNQYWdlKCkge1xyXG5cclxuXHRcdGNvbnRlbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdC8vIEZlYXR1cmVkIEdhbGxlcnkgU2xpZGVyXHJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0dmFyIGdhbGxlcnlTbGlkZXIgPSAkKCcuZ2FsbGVyeS1zbGlkZXInKS5ub3QoJy5saWdodFNsaWRlcicpO1xyXG5cdFx0XHRcdGdhbGxlcnlTbGlkZXIubGlnaHRTbGlkZXIoe1xyXG5cdFx0XHRcdFx0aXRlbTogMSxcclxuXHRcdFx0XHRcdGF1dG86IHRydWUsXHJcblx0XHRcdFx0XHRsb29wOiB0cnVlLFxyXG5cdFx0XHRcdFx0cGFnZXI6IGZhbHNlLFxyXG5cdFx0XHRcdFx0cGF1c2U6IDUwMDAsXHJcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcclxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAwLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0R2FsbGVyeSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHQkKCcubGlnaHRib3gtZ2FsbGVyeScpLmxpZ2h0R2FsbGVyeSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBFcXVhbGl6ZSBmZWF0dXJlZCBtZWRpYSBoZWlnaHQgZm9yIHJlbGF0ZWQgcG9zdHMgYW5kIGdyaWQgYmxvZ1xyXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdCQoJy5ibG9nLWdyaWQgLnBvc3RzLWNvbnRhaW5lciAucG9zdC1mZWF0JykuYWRkQ2xhc3MoJ2ZpeC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xyXG5cclxuXHRcdFx0XHRpZiAoICEgTW9kZXJuaXpyLmZsZXhib3ggKSB7XHJcblx0XHRcdFx0XHQkKCcuYmxvZy1ncmlkIC5wb3N0cy1jb250YWluZXIgYXJ0aWNsZScpLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgbWF0Y2hIZWlnaHRFbCA9ICQoJy5wb3N0LXJlbGF0ZWQgLnBvc3QtZmVhdCcpLFxyXG5cdFx0XHRcdFx0XHRtYXRjaEhlaWdodFRhcmdldCA9IG1hdGNoSGVpZ2h0RWwuZmluZCgnLndwLXBvc3QtaW1hZ2UnKTtcclxuXHRcdFx0XHRcdGlmICggbWF0Y2hIZWlnaHRUYXJnZXQubGVuZ3RoID09PSAwICkgbWF0Y2hIZWlnaHRUYXJnZXQgPSBudWxsO1xyXG5cdFx0XHRcdFx0bWF0Y2hIZWlnaHRFbC5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KHtcclxuXHRcdFx0XHRcdFx0dGFyZ2V0OiBtYXRjaEhlaWdodFRhcmdldCxcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIExvYWQgUG9zdHMgJiBDb21tZW50cyB2aWEgQWpheFxyXG5cdGZ1bmN0aW9uIG1peHRBamF4TG9hZCh0eXBlKSB7XHJcblx0XHR0eXBlID0gdHlwZSB8fCAncG9zdHMnO1xyXG5cdFx0dmFyIHBhZ0NvbnQgPSAkKCcucGFnaW5nLW5hdmlnYXRpb24nKSxcclxuXHRcdFx0YWpheEJ0biA9ICQoJy5hamF4LW1vcmUnLCBwYWdDb250KTtcclxuXHJcblx0XHRpZiAoICEgcGFnQ29udC5sZW5ndGggfHwgISBhamF4QnRuLmxlbmd0aCApIHJldHVybjtcclxuXHRcdFxyXG5cdFx0dmFyIHBhZ2VOb3cgPSBwYWdDb250LmRhdGEoJ3BhZ2Utbm93JyksXHJcblx0XHRcdHBhZ2VNYXggPSBwYWdDb250LmRhdGEoJ3BhZ2UtbWF4JyksXHJcblx0XHRcdG5leHRVcmwgPSBhamF4QnRuLmF0dHIoJ2hyZWYnKSxcclxuXHRcdFx0cGFnZU51bSxcclxuXHRcdFx0cGFnZVR5cGUsXHJcblx0XHRcdGNvbnRhaW5lcixcclxuXHRcdFx0ZWxlbWVudCxcclxuXHRcdFx0bG9hZFNlbDtcclxuXHJcblx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcclxuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXTtcclxuXHRcdFx0Y29udGFpbmVyID0gJCgnLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRlbGVtZW50ICAgPSAnLmFydGljbGUnO1xyXG5cdFx0XHRsb2FkU2VsICAgPSAnIC5wb3N0cy1jb250YWluZXIgLmFydGljbGUnO1xyXG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnc2hvcCcgKSB7XHJcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XHJcblx0XHRcdGNvbnRhaW5lciA9ICQoJ3VsLnByb2R1Y3RzJyk7XHJcblx0XHRcdGVsZW1lbnQgICA9ICcucHJvZHVjdCc7XHJcblx0XHRcdGxvYWRTZWwgICA9ICcgdWwucHJvZHVjdHMgPiBsaSc7XHJcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdjb21tZW50cycgKSB7XHJcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXTtcclxuXHRcdFx0Y29udGFpbmVyID0gJCgnLmNvbW1lbnQtbGlzdCcpO1xyXG5cdFx0XHRlbGVtZW50ICAgPSAnLmNvbW1lbnQnO1xyXG5cdFx0XHRsb2FkU2VsICAgPSAnIC5jb21tZW50LWxpc3QgPiBsaSc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LWRlZmF1bHQtcGFnZSddID09ICduZXdlc3QnICkge1xyXG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyAtIDE7XHJcblx0XHRcdG5leHRVcmwgPSBuZXh0VXJsLnJlcGxhY2UoL1xcL2NvbW1lbnQtcGFnZS1bMC05XT8vLCAnL2NvbW1lbnQtcGFnZS0nICsgcGFnZU51bSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyArIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAoIHBhZ2VOb3cgPj0gcGFnZU1heCApICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSAhPSAnbmV3ZXN0JyB8fCBwYWdlTnVtIDw9IDAgKSB7XHJcblx0XHRcdGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhamF4QnRuLm9uKCdjbGljayBjb250OmJvdHRvbScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0Ly8gUHJldmVudCBsb2FkaW5nIHR3aWNlIG9uIHNjcm9sbFxyXG5cdFx0XHR2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIGFqYXhTY3JvbGxIYW5kbGUpO1xyXG5cdFx0XHJcblx0XHRcdC8vIEFyZSB0aGVyZSBtb3JlIHBhZ2VzIHRvIGxvYWQ/XHJcblx0XHRcdGlmICggcGFnZU51bSA+IDAgJiYgcGFnZU51bSA8PSBwYWdlTWF4ICkge1xyXG5cdFx0XHRcclxuXHRcdFx0XHRhamF4QnRuLmJ1dHRvbignbG9hZGluZycpO1xyXG5cclxuXHRcdFx0XHQvLyBMb2FkIHBvc3RzXHJcblx0XHRcdFx0LyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cclxuXHRcdFx0XHQkKCc8ZGl2PicpLmxvYWQobmV4dFVybCArIGxvYWRTZWwsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhocikge1xyXG5cdFx0XHRcdFx0dmFyIG5ld1Bvc3RzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0XHRhamF4QnRuLmJsdXIoKTtcclxuXHJcblx0XHRcdFx0XHRuZXdQb3N0cy5jaGlsZHJlbihlbGVtZW50KS5hZGRDbGFzcygnYWpheC1uZXcnKTtcclxuXHRcdFx0XHRcdGlmICggKCB0eXBlID09ICdwb3N0cycgfHwgdHlwZSA9PSAnc2hvcCcgKSAmJiBtaXh0X29wdC5sYXlvdXQudHlwZSAhPSAnbWFzb25yeScgJiYgbWl4dF9vcHQubGF5b3V0WydzaG93LXBhZ2UtbnInXSApIHtcclxuXHRcdFx0XHRcdFx0bmV3UG9zdHMucHJlcGVuZCgnPGRpdiBjbGFzcz1cImFqYXgtcGFnZSBwYWdlLScrIHBhZ2VOdW0gKydcIj48YSBocmVmPVwiJysgbmV4dFVybCArJ1wiPlBhZ2UgJysgcGFnZU51bSArJzwvYT48L2Rpdj4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmQobmV3UG9zdHMuaHRtbCgpKTtcclxuXHJcblx0XHRcdFx0XHRuZXdQb3N0cyA9IGNvbnRhaW5lci5jaGlsZHJlbignLmFqYXgtbmV3Jyk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHBhZ2UgbnVtYmVyIGFuZCBuZXh0VXJsXHJcblx0XHRcdFx0XHRpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyApIHtcclxuXHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XHJcblx0XHRcdFx0XHRcdFx0cGFnZU51bS0tO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHBhZ2VOdW0rKztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cGFnZU51bSsrO1xyXG5cdFx0XHRcdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9wYWdlXFwvWzAtOV0/LywgJy9wYWdlLycgKyBwYWdlTnVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBidXR0b24gc3RhdGVcclxuXHRcdFx0XHRcdGlmICggcGFnZU51bSA8PSBwYWdlTWF4ICYmIHBhZ2VOdW0gPiAwICkgeyBhamF4QnRuLmJ1dHRvbigncmVzZXQnKTsgfVxyXG5cdFx0XHRcdFx0ZWxzZSB7IGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpOyB9XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIGxheW91dCBvbmNlIHBvc3RzIGhhdmUgbG9hZGVkXHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0bmV3UG9zdHMucmVtb3ZlQ2xhc3MoJ2FqYXgtbmV3Jyk7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZSA9PSAncG9zdHMnICkge1xyXG5cdFx0XHRcdFx0XHRcdGlmcmFtZUFzcGVjdCgpO1xyXG5cdFx0XHRcdFx0XHRcdHBvc3RzUGFnZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcclxuXHRcdFx0XHRcdFx0XHRcdCRjb250YWluZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRhaW5lci5pc290b3BlKCdhcHBlbmRlZCcsIG5ld1Bvc3RzKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR2aWV3cG9ydC50cmlnZ2VyKCdyZWZyZXNoJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7IH1cclxuXHJcblx0XHRcdFx0XHQvLyBIYW5kbGUgRXJyb3JzXHJcblx0XHRcdFx0XHRpZiAoIHN0YXR1cyA9PSAnZXJyb3InICkge1xyXG5cdFx0XHRcdFx0XHRhamF4QnRuLmJ1dHRvbignZXJyb3InKTtcclxuXHRcdFx0XHRcdFx0Ly8gRGVidWdnaW5nIGluZm9cclxuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoJ0FKQVggRXJyb3I6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gVHJpZ2dlciBBSkFYIGxvYWQgd2hlbiByZWFjaGluZyBib3R0b20gb2YgcGFnZVxyXG5cdFx0dmFyIGFqYXhTY3JvbGxIYW5kbGUgPSAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8qIGdsb2JhbCBlbGVtVmlzaWJsZSAqL1xyXG5cdFx0XHRcdGlmICggZWxlbVZpc2libGUoYWpheEJ0biwgdmlld3BvcnQpID09PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0YWpheEJ0bi50cmlnZ2VyKCdjb250OmJvdHRvbScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRpZiAoIHBhZ2VUeXBlID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gRXhlY3V0ZSBGdW5jdGlvbiBXaGVyZSBBcHBsaWNhYmxlXHJcblx0aWYgKCBtaXh0X29wdC5wYWdlWydwb3N0cy1wYWdlJ10gJiYgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0WydwYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1zY3JvbGwnICkge1xyXG5cdFx0aWYgKCBtaXh0X29wdC5wYWdlWydwYWdlLXR5cGUnXSA9PSAnc2hvcCcgKSB7XHJcblx0XHRcdG1peHRBamF4TG9hZCgnc2hvcCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bWl4dEFqYXhMb2FkKCdwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaW5nbGUnICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1wYWdpbmF0aW9uLXR5cGUnXSA9PSAnYWpheC1jbGljaycgfHwgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LXNjcm9sbCcgKSB7XHJcblx0XHRtaXh0QWpheExvYWQoJ2NvbW1lbnRzJyk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gRnVuY3Rpb25zIFRvIFJ1biBPbiBXaW5kb3cgUmVzaXplXHJcblx0ZnVuY3Rpb24gcmVzaXplRm4oKSB7XHJcblx0XHRpZnJhbWVBc3BlY3QoKTtcclxuXHR9XHJcblx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIHJlc2l6ZUZuICkpO1xyXG5cclxuXHJcblx0Ly8gRnVuY3Rpb25zIFRvIFJ1biBPbiBMb2FkXHJcblx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cG9zdHNQYWdlKCk7XHJcblxyXG5cdFx0Ly8gSXNvdG9wZSBNYXNvbnJ5IEluaXRcclxuXHRcdGlmICggbWl4dF9vcHQubGF5b3V0LnR5cGUgPT0gJ21hc29ucnknICYmIHR5cGVvZiAkLmZuLmlzb3RvcGUgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdHZhciBibG9nQ29udCA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHRcdFx0YmxvZ0NvbnQuaXNvdG9wZSh7XHJcblx0XHRcdFx0aXRlbVNlbGVjdG9yOiAnLmFydGljbGUnLFxyXG5cdFx0XHRcdGxheW91dDogJ21hc29ucnknLFxyXG5cdFx0XHRcdGd1dHRlcjogMFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGJsb2dDb250LmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7IGJsb2dDb250Lmlzb3RvcGUoJ2xheW91dCcpOyB9KTtcclxuXHRcdFx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSApKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gVHJpZ2dlciBMaWdodGJveCBPbiBGZWF0dXJlZCBJbWFnZSBDbGlja1xyXG5cdFx0JCgnLmxpZ2h0Ym94LXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnLmdhbGxlcnknKS5maW5kKCdsaScpLmZpcnN0KCkuY2xpY2soKTtcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHQvLyBSZWxhdGVkIFBvc3RzIFNsaWRlclxyXG5cdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodFNsaWRlciA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0dmFyIHJlbFBvc3RzU2xpZGVyID0gJCgnLnBvc3QtcmVsYXRlZCAuc2xpZGVyLWNvbnQnKTtcclxuXHRcdFx0cmVsUG9zdHNTbGlkZXIuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZWxQb3N0c1NsaWRlci5saWdodFNsaWRlcih7XHJcblx0XHRcdFx0XHRpdGVtOiAzLFxyXG5cdFx0XHRcdFx0cGFnZXI6IGZhbHNlLFxyXG5cdFx0XHRcdFx0a2V5UHJlc3M6IHRydWUsXHJcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMjAsXHJcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbe1xyXG5cdFx0XHRcdFx0XHRicmVha3BvaW50OiA5NjAsXHJcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IDMgfVxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHRicmVha3BvaW50OiA1NDAsXHJcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IDIgfVxyXG5cdFx0XHRcdFx0fV0sXHJcblx0XHRcdFx0XHRvblNsaWRlckxvYWQ6IGZ1bmN0aW9uKGVsKSB7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mICQuZm4ubWF0Y2hIZWlnaHQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRcdFx0JCgnLnBvc3QtZmVhdCcsIHJlbFBvc3RzU2xpZGVyKS5tYXRjaEhlaWdodCgpO1xyXG5cdFx0XHRcdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmNzcygnaGVpZ2h0JywgJycpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5VSSBGVU5DVElPTlNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xyXG5cclxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXHJcblx0XHRodG1sRWwgICA9ICQoJ2h0bWwnKSxcclxuXHRcdGJvZHlFbCAgID0gJCgnYm9keScpO1xyXG5cclxuXHJcblx0Ly8gU3Bpbm5lciBJbnB1dFxyXG5cdCQoJy5taXh0LXNwaW5uZXInKS5vbignY2xpY2snLCAnLmJ0bicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyICRlbCAgICAgPSAkKHRoaXMpLFxyXG5cdFx0XHRzcGlubmVyID0gJGVsLnBhcmVudHMoJy5taXh0LXNwaW5uZXInKSxcclxuXHRcdFx0aW5wdXQgICA9IHNwaW5uZXIuY2hpbGRyZW4oJy5zcGlubmVyLXZhbCcpLFxyXG5cdFx0XHRzdGVwICAgID0gaW5wdXQuYXR0cignc3RlcCcpIHx8IDEsXHJcblx0XHRcdG1pblZhbCAgPSBpbnB1dC5hdHRyKCdtaW4nKSB8fCAwLFxyXG5cdFx0XHRtYXhWYWwgID0gaW5wdXQuYXR0cignbWF4JykgfHwgbnVsbCxcclxuXHRcdFx0dmFsICAgICA9IGlucHV0LnZhbCgpLFxyXG5cdFx0XHRuZXdWYWw7XHJcblx0XHRpZiAoIGlzTmFOKHZhbCkgKSB2YWwgPSBtaW5WYWw7XHJcblx0XHRcclxuXHRcdGlmICggJGVsLmhhc0NsYXNzKCdtaW51cycpICkge1xyXG5cdFx0XHQvLyBEZWNyZWFzZVxyXG5cdFx0XHRuZXdWYWwgPSBwYXJzZUZsb2F0KHZhbCkgLSBwYXJzZUZsb2F0KHN0ZXApO1xyXG5cdFx0XHRpZiAoIG5ld1ZhbCA8IG1pblZhbCApIG5ld1ZhbCA9IG1pblZhbDtcclxuXHRcdFx0aW5wdXQudmFsKG5ld1ZhbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBJbmNyZWFzZVxyXG5cdFx0XHRuZXdWYWwgPSBwYXJzZUZsb2F0KHZhbCkgKyBwYXJzZUZsb2F0KHN0ZXApO1xyXG5cdFx0XHRpZiAoIG1heFZhbCAhPT0gbnVsbCAmJiBuZXdWYWwgPiBtYXhWYWwgKSBuZXdWYWwgPSBtYXhWYWw7XHJcblx0XHRcdGlucHV0LnZhbChuZXdWYWwpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gQ29udGVudCBGaWx0ZXJpbmdcclxuXHQkKCcuY29udGVudC1maWx0ZXItbGlua3MnKS5jaGlsZHJlbigpLmNsaWNrKCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsaW5rID0gJCh0aGlzKSxcclxuXHRcdFx0ZmlsdGVyID0gbGluay5kYXRhKCdmaWx0ZXInKSxcclxuXHRcdFx0Y29udGVudCA9ICQoJy4nICsgbGluay5wYXJlbnRzKCcuY29udGVudC1maWx0ZXItbGlua3MnKS5kYXRhKCdjb250ZW50JykpLFxyXG5cdFx0XHRmaWx0ZXJDbGFzcyA9ICdmaWx0ZXItaGlkZGVuJztcclxuXHRcdGxpbmsuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0aWYgKCBmaWx0ZXIgPT0gJ2FsbCcgKSB7IGNvbnRlbnQuZmluZCgnLicrZmlsdGVyQ2xhc3MpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKTsgfVxyXG5cdFx0ZWxzZSB7IGNvbnRlbnQuZmluZCgnLicgKyBmaWx0ZXIpLnJlbW92ZUNsYXNzKGZpbHRlckNsYXNzKS5zbGlkZURvd24oNjAwKS5zaWJsaW5ncygnOm5vdCguJytmaWx0ZXIrJyknKS5hZGRDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVVcCg2MDApOyB9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyBTb3J0IHBvcnRmb2xpbyBpdGVtc1xyXG5cdCQoJy5wb3J0Zm9saW8tc29ydGVyIGEnKS5jbGljayggZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZWxlbSA9ICQodGhpcyksXHJcblx0XHRcdHRhcmdldFRhZyA9IGVsZW0uZGF0YSgnc29ydCcpLFxyXG5cdFx0XHR0YXJnZXRDb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XHJcblxyXG5cdFx0ZWxlbS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0aWYgKHRhcmdldFRhZyA9PSAnYWxsJykge1xyXG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnKicgfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGFyZ2V0Q29udGFpbmVyLmlzb3RvcGUoeyBmaWx0ZXI6ICcuJyArIHRhcmdldFRhZyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHByb2plY3RzID0gdGFyZ2V0Q29udGFpbmVyLmNoaWxkcmVuKCcucG9ydGZvbGlvJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0VGFnID09ICdhbGwnICkge1xyXG5cdFx0XHRcdHByb2plY3RzLmZhZGVJbigzMDApLmFkZENsYXNzKCdmaWx0ZXJlZCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByb2plY3RzLmZhZGVPdXQoMCkucmVtb3ZlQ2xhc3MoJ2ZpbHRlcmVkJykuZmlsdGVyKCcuJyArIHRhcmdldFRhZykuZmFkZUluKDMwMCkuYWRkQ2xhc3MoJ2ZpbHRlcmVkJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIE9mZnNldCBzY3JvbGxpbmcgdG8gbGluayBhbmNob3IgKGhhc2gpXHJcblx0JCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgbGluayA9ICQodGhpcyksXHJcblx0XHRcdGhhc2ggPSBsaW5rLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRpZiAoIGxpbmsuZGF0YSgnbm8taGFzaC1zY3JvbGwnKSApIHJldHVybjtcclxuXHJcblx0XHRpZiAoIGhhc2gubGVuZ3RoICkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciB0YXJnZXQgPSAkKGhhc2gpO1xyXG5cdFx0XHRpZiAoIHRhcmdldC5sZW5ndGgpIHtcclxuXHRcdFx0XHQvKiBnbG9iYWwgYnJlYWtwb2ludCAqL1xyXG5cdFx0XHRcdHZhciBoYXNoT2Zmc2V0ID0gJChoYXNoKS5vZmZzZXQoKS50b3A7XHJcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmIGJyZWFrcG9pbnQubmFtZSAhPSAncGx1dG8nICYmIGJyZWFrcG9pbnQubmFtZSAhPSAnbWVyY3VyeScgKSB7IGhhc2hPZmZzZXQgLT0gJCgnI21haW4tbmF2Jykub3V0ZXJIZWlnaHQoKTsgfVxyXG5cdFx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBoYXNoT2Zmc2V0IH0sIDYwMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBoYXNoO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdC8vIElnbm9yZSBzcGVjaWZpYyBhbmNob3JzXHJcblx0JCgnLnRhYnMgYSwgLnZjX3R0YSBhJykuYXR0cignZGF0YS1uby1oYXNoLXNjcm9sbCcsIHRydWUpO1xyXG5cclxuXHJcblx0Ly8gU29jaWFsIEljb25zXHJcblx0JCgnLnNvY2lhbC1saW5rcycpLm5vdCgnLmhvdmVyLW5vbmUnKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjb250ID0gJCh0aGlzKTtcclxuXHJcblx0XHRjb250LmNoaWxkcmVuKCkuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBpY29uID0gJCh0aGlzKSxcclxuXHRcdFx0XHRsaW5rID0gaWNvbi5jaGlsZHJlbignYScpLFxyXG5cdFx0XHRcdGRhdGFDb2xvciA9IGxpbmsuYXR0cignZGF0YS1jb2xvcicpO1xyXG5cclxuXHRcdFx0aWYgKCBjb250Lmhhc0NsYXNzKCdob3Zlci1iZycpIHx8IGNvbnQucGFyZW50cygnLm5vLWhvdmVyLWJnJykubGVuZ3RoICkge1xyXG5cdFx0XHRcdGxpbmsuaG92ZXIoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKCBjb250LnBhcmVudHMoJy5wb3NpdGlvbi10b3AnKS5sZW5ndGggPT09IDAgKSB7XHJcblx0XHRcdFx0XHRcdGxpbmsuY3NzKHsgYmFja2dyb3VuZENvbG9yOiBkYXRhQ29sb3IsIGJvcmRlckNvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcnLCBib3JkZXJDb2xvcjogJycsIHpJbmRleDogJycgfSk7IH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxpbmsuaG92ZXIoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKCBjb250LnBhcmVudHMoJy5uYXZiYXIucG9zaXRpb24tdG9wJykubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdFx0XHRsaW5rLmNzcyh7IGNvbG9yOiBkYXRhQ29sb3IsIHpJbmRleDogMSB9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBjb2xvcjogJycsIHpJbmRleDogJycgfSk7IH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vIEZ1bmN0aW9ucyBydW4gb24gcGFnZSBsb2FkIGFuZCBcInJlZnJlc2hcIiBldmVudFxyXG5cdGZ1bmN0aW9uIHJ1bk9uUmVmcmVzaCgpIHtcclxuXHRcdC8vIFRvb2x0aXBzIEluaXRcclxuXHRcdCQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0sIC5yZWxhdGVkLXRpdGxlLXRpcCcpLnRvb2x0aXAoe1xyXG5cdFx0XHRwbGFjZW1lbnQ6ICdhdXRvJyxcclxuXHRcdFx0Y29udGFpbmVyOiAnYm9keSdcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHQvLyBPbiBIb3ZlciBBbmltYXRpb25zIEluaXRcclxuXHRcdHZhciBhbmltSG92ZXJFbCA9ICQoJy5hbmltLW9uLWhvdmVyJyk7XHJcblx0XHRhbmltSG92ZXJFbC5ob3ZlckludGVudCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyZWQnKTtcclxuXHRcdFx0dmFyIGlubmVyICAgPSAkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKSxcclxuXHRcdFx0XHRhbmltSW4gID0gaW5uZXIuZGF0YSgnYW5pbS1pbicpIHx8ICdmYWRlSW4nLFxyXG5cdFx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0JztcclxuXHRcdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbU91dCkuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltSW4pO1xyXG5cdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2hvdmVyZWQnKTtcclxuXHRcdFx0dmFyIGlubmVyICAgPSAkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKSxcclxuXHRcdFx0XHRhbmltSW4gID0gaW5uZXIuZGF0YSgnYW5pbS1pbicpIHx8ICdmYWRlSW4nLFxyXG5cdFx0XHRcdGFuaW1PdXQgPSBpbm5lci5kYXRhKCdhbmltLW91dCcpIHx8ICdmYWRlT3V0JztcclxuXHRcdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbUluKS5hZGRDbGFzcyhhbmltT3V0KTtcclxuXHRcdH0sIDMwMCk7XHJcblx0XHRhbmltSG92ZXJFbC5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIE1TQW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggISAkKHRoaXMpLmhhc0NsYXNzKCdob3ZlcmVkJykgKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5jaGlsZHJlbignLm9uLWhvdmVyJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHR2aWV3cG9ydC5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cnVuT25SZWZyZXNoKCk7XHJcblx0fSkudHJpZ2dlcigncmVmcmVzaCcpO1xyXG5cclxuXHJcblx0Ly8gQmFjayBUbyBUb3AgQnV0dG9uXHJcblx0ZnVuY3Rpb24gYmFja1RvVG9wRGlzcGxheSgpIHtcclxuXHRcdHZhciBzY3JvbGxUb3AgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcclxuXHRcdGlmICggc2Nyb2xsVG9wID4gMjAwICkge1xyXG5cdFx0XHRiYWNrVG9Ub3AuZmFkZUluKDMwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRiYWNrVG9Ub3AuZmFkZU91dCgzMDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGJhY2tUb1RvcCA9ICQoJyNiYWNrLXRvLXRvcCcpO1xyXG5cclxuXHRpZiAoIGJhY2tUb1RvcC5sZW5ndGggKSB7XHJcblx0XHR2aWV3cG9ydC5vbignc2Nyb2xsJywgJC50aHJvdHRsZSggMTAwMCwgYmFja1RvVG9wRGlzcGxheSApKS5zY3JvbGwoKTtcclxuXHJcblx0XHRiYWNrVG9Ub3AuY2xpY2soIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRodG1sRWwuYWRkKGJvZHlFbCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCA2MDApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufShqUXVlcnkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
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
					mainNavBar.removeClass(navbarObj.navBg).addClass(navbarObj.navBgTop);
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
				if ( mixt_opt.nav.mode == 'fixed' && mqNav == 'tablet' ) {
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
			if ( mqNav == 'mobile' ) {
				navbarObj.stickyNav(true);
			} else {
				navbarObj.stickyNav(false);
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
					onSliderLoad: function() {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhLXRocm90dGxlLWRlYm91bmNlLmpzIiwiaG92ZXJJbnRlbnQuanMiLCJpbWFnZXNsb2FkZWQucGtnZC5taW4uanMiLCJtYXRjaEhlaWdodC5qcyIsIm1peHQtcGx1Z2lucy5qcyIsIm1vZGVybml6ci5qcyIsImVsZW1lbnRzLmpzIiwiaGVhZGVyLmpzIiwiaGVscGVycy5qcyIsIm5hdmJhci5qcyIsInBvc3QuanMiLCJ1aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbE1BO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpRdWVyeSB0aHJvdHRsZSAvIGRlYm91bmNlIC0gdjEuMSAtIDMvNy8yMDEwXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS1wbHVnaW4vXG4gKiBcbiAqIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hblxuICogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4gKi9cblxuLy8gU2NyaXB0OiBqUXVlcnkgdGhyb3R0bGUgLyBkZWJvdW5jZTogU29tZXRpbWVzLCBsZXNzIGlzIG1vcmUhXG4vL1xuLy8gKlZlcnNpb246IDEuMSwgTGFzdCB1cGRhdGVkOiAzLzcvMjAxMCpcbi8vIFxuLy8gUHJvamVjdCBIb21lIC0gaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UtcGx1Z2luL1xuLy8gR2l0SHViICAgICAgIC0gaHR0cDovL2dpdGh1Yi5jb20vY293Ym95L2pxdWVyeS10aHJvdHRsZS1kZWJvdW5jZS9cbi8vIFNvdXJjZSAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UuanNcbi8vIChNaW5pZmllZCkgICAtIGh0dHA6Ly9naXRodWIuY29tL2Nvd2JveS9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvcmF3L21hc3Rlci9qcXVlcnkuYmEtdGhyb3R0bGUtZGVib3VuY2UubWluLmpzICgwLjdrYilcbi8vIFxuLy8gQWJvdXQ6IExpY2Vuc2Vcbi8vIFxuLy8gQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuLFxuLy8gRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4vLyBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4vLyBcbi8vIEFib3V0OiBFeGFtcGxlc1xuLy8gXG4vLyBUaGVzZSB3b3JraW5nIGV4YW1wbGVzLCBjb21wbGV0ZSB3aXRoIGZ1bGx5IGNvbW1lbnRlZCBjb2RlLCBpbGx1c3RyYXRlIGEgZmV3XG4vLyB3YXlzIGluIHdoaWNoIHRoaXMgcGx1Z2luIGNhbiBiZSB1c2VkLlxuLy8gXG4vLyBUaHJvdHRsZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvZXhhbXBsZXMvdGhyb3R0bGUvXG4vLyBEZWJvdW5jZSAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvZXhhbXBsZXMvZGVib3VuY2UvXG4vLyBcbi8vIEFib3V0OiBTdXBwb3J0IGFuZCBUZXN0aW5nXG4vLyBcbi8vIEluZm9ybWF0aW9uIGFib3V0IHdoYXQgdmVyc2lvbiBvciB2ZXJzaW9ucyBvZiBqUXVlcnkgdGhpcyBwbHVnaW4gaGFzIGJlZW5cbi8vIHRlc3RlZCB3aXRoLCB3aGF0IGJyb3dzZXJzIGl0IGhhcyBiZWVuIHRlc3RlZCBpbiwgYW5kIHdoZXJlIHRoZSB1bml0IHRlc3RzXG4vLyByZXNpZGUgKHNvIHlvdSBjYW4gdGVzdCBpdCB5b3Vyc2VsZikuXG4vLyBcbi8vIGpRdWVyeSBWZXJzaW9ucyAtIG5vbmUsIDEuMy4yLCAxLjQuMlxuLy8gQnJvd3NlcnMgVGVzdGVkIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi04LCBGaXJlZm94IDItMy42LCBTYWZhcmkgMy00LCBDaHJvbWUgNC01LCBPcGVyYSA5LjYtMTAuMS5cbi8vIFVuaXQgVGVzdHMgICAgICAtIGh0dHA6Ly9iZW5hbG1hbi5jb20vY29kZS9wcm9qZWN0cy9qcXVlcnktdGhyb3R0bGUtZGVib3VuY2UvdW5pdC9cbi8vIFxuLy8gQWJvdXQ6IFJlbGVhc2UgSGlzdG9yeVxuLy8gXG4vLyAxLjEgLSAoMy83LzIwMTApIEZpeGVkIGEgYnVnIGluIDxqUXVlcnkudGhyb3R0bGU+IHdoZXJlIHRyYWlsaW5nIGNhbGxiYWNrc1xuLy8gICAgICAgZXhlY3V0ZWQgbGF0ZXIgdGhhbiB0aGV5IHNob3VsZC4gUmV3b3JrZWQgYSBmYWlyIGFtb3VudCBvZiBpbnRlcm5hbFxuLy8gICAgICAgbG9naWMgYXMgd2VsbC5cbi8vIDEuMCAtICgzLzYvMjAxMCkgSW5pdGlhbCByZWxlYXNlIGFzIGEgc3RhbmQtYWxvbmUgcHJvamVjdC4gTWlncmF0ZWQgb3ZlclxuLy8gICAgICAgZnJvbSBqcXVlcnktbWlzYyByZXBvIHYwLjQgdG8ganF1ZXJ5LXRocm90dGxlIHJlcG8gdjEuMCwgYWRkZWQgdGhlXG4vLyAgICAgICBub190cmFpbGluZyB0aHJvdHRsZSBwYXJhbWV0ZXIgYW5kIGRlYm91bmNlIGZ1bmN0aW9uYWxpdHkuXG4vLyBcbi8vIFRvcGljOiBOb3RlIGZvciBub24talF1ZXJ5IHVzZXJzXG4vLyBcbi8vIGpRdWVyeSBpc24ndCBhY3R1YWxseSByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIGJlY2F1c2Ugbm90aGluZyBpbnRlcm5hbFxuLy8gdXNlcyBhbnkgalF1ZXJ5IG1ldGhvZHMgb3IgcHJvcGVydGllcy4galF1ZXJ5IGlzIGp1c3QgdXNlZCBhcyBhIG5hbWVzcGFjZVxuLy8gdW5kZXIgd2hpY2ggdGhlc2UgbWV0aG9kcyBjYW4gZXhpc3QuXG4vLyBcbi8vIFNpbmNlIGpRdWVyeSBpc24ndCBhY3R1YWxseSByZXF1aXJlZCBmb3IgdGhpcyBwbHVnaW4sIGlmIGpRdWVyeSBkb2Vzbid0IGV4aXN0XG4vLyB3aGVuIHRoaXMgcGx1Z2luIGlzIGxvYWRlZCwgdGhlIG1ldGhvZCBkZXNjcmliZWQgYmVsb3cgd2lsbCBiZSBjcmVhdGVkIGluXG4vLyB0aGUgYENvd2JveWAgbmFtZXNwYWNlLiBVc2FnZSB3aWxsIGJlIGV4YWN0bHkgdGhlIHNhbWUsIGJ1dCBpbnN0ZWFkIG9mXG4vLyAkLm1ldGhvZCgpIG9yIGpRdWVyeS5tZXRob2QoKSwgeW91J2xsIG5lZWQgdG8gdXNlIENvd2JveS5tZXRob2QoKS5cblxuKGZ1bmN0aW9uKHdpbmRvdyx1bmRlZmluZWQpe1xuICAnJDpub211bmdlJzsgLy8gVXNlZCBieSBZVUkgY29tcHJlc3Nvci5cbiAgXG4gIC8vIFNpbmNlIGpRdWVyeSByZWFsbHkgaXNuJ3QgcmVxdWlyZWQgZm9yIHRoaXMgcGx1Z2luLCB1c2UgYGpRdWVyeWAgYXMgdGhlXG4gIC8vIG5hbWVzcGFjZSBvbmx5IGlmIGl0IGFscmVhZHkgZXhpc3RzLCBvdGhlcndpc2UgdXNlIHRoZSBgQ293Ym95YCBuYW1lc3BhY2UsXG4gIC8vIGNyZWF0aW5nIGl0IGlmIG5lY2Vzc2FyeS5cbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5Db3dib3kgfHwgKCB3aW5kb3cuQ293Ym95ID0ge30gKSxcbiAgICBcbiAgICAvLyBJbnRlcm5hbCBtZXRob2QgcmVmZXJlbmNlLlxuICAgIGpxX3Rocm90dGxlO1xuICBcbiAgLy8gTWV0aG9kOiBqUXVlcnkudGhyb3R0bGVcbiAgLy8gXG4gIC8vIFRocm90dGxlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLiBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgcmF0ZSBsaW1pdGluZ1xuICAvLyBleGVjdXRpb24gb2YgaGFuZGxlcnMgb24gZXZlbnRzIGxpa2UgcmVzaXplIGFuZCBzY3JvbGwuIElmIHlvdSB3YW50IHRvXG4gIC8vIHJhdGUtbGltaXQgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24gdG8gYSBzaW5nbGUgdGltZSwgc2VlIHRoZVxuICAvLyA8alF1ZXJ5LmRlYm91bmNlPiBtZXRob2QuXG4gIC8vIFxuICAvLyBJbiB0aGlzIHZpc3VhbGl6YXRpb24sIHwgaXMgYSB0aHJvdHRsZWQtZnVuY3Rpb24gY2FsbCBhbmQgWCBpcyB0aGUgYWN0dWFsXG4gIC8vIGNhbGxiYWNrIGV4ZWN1dGlvbjpcbiAgLy8gXG4gIC8vID4gVGhyb3R0bGVkIHdpdGggYG5vX3RyYWlsaW5nYCBzcGVjaWZpZWQgYXMgZmFsc2Ugb3IgdW5zcGVjaWZpZWQ6XG4gIC8vID4gfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fCAocGF1c2UpIHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxcbiAgLy8gPiBYICAgIFggICAgWCAgICBYICAgIFggICAgWCAgICAgICAgWCAgICBYICAgIFggICAgWCAgICBYICAgIFhcbiAgLy8gPiBcbiAgLy8gPiBUaHJvdHRsZWQgd2l0aCBgbm9fdHJhaWxpbmdgIHNwZWNpZmllZCBhcyB0cnVlOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gWCAgICBYICAgIFggICAgWCAgICBYICAgICAgICAgICAgIFggICAgWCAgICBYICAgIFggICAgWFxuICAvLyBcbiAgLy8gVXNhZ2U6XG4gIC8vIFxuICAvLyA+IHZhciB0aHJvdHRsZWQgPSBqUXVlcnkudGhyb3R0bGUoIGRlbGF5LCBbIG5vX3RyYWlsaW5nLCBdIGNhbGxiYWNrICk7XG4gIC8vID4gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCB0aHJvdHRsZWQgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgdGhyb3R0bGVkICk7XG4gIC8vIFxuICAvLyBUaGlzIGFsc28gd29ya3MgaW4galF1ZXJ5IDEuNCs6XG4gIC8vIFxuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS5iaW5kKCAnc29tZWV2ZW50JywgalF1ZXJ5LnRocm90dGxlKCBkZWxheSwgWyBub190cmFpbGluZywgXSBjYWxsYmFjayApICk7XG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLnVuYmluZCggJ3NvbWVldmVudCcsIGNhbGxiYWNrICk7XG4gIC8vIFxuICAvLyBBcmd1bWVudHM6XG4gIC8vIFxuICAvLyAgZGVsYXkgLSAoTnVtYmVyKSBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudFxuICAvLyAgICBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAgLy8gIG5vX3RyYWlsaW5nIC0gKEJvb2xlYW4pIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9fdHJhaWxpbmcgaXNcbiAgLy8gICAgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBvbmx5IGV4ZWN1dGUgZXZlcnkgYGRlbGF5YCBtaWxsaXNlY29uZHMgd2hpbGUgdGhlXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQuIElmIG5vX3RyYWlsaW5nIGlzIGZhbHNlIG9yXG4gIC8vICAgIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkIG9uZSBmaW5hbCB0aW1lIGFmdGVyIHRoZSBsYXN0XG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW5cbiAgLy8gICAgY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gIC8vICBjYWxsYmFjayAtIChGdW5jdGlvbikgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIHRocm90dGxlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAgLy8gXG4gIC8vIFJldHVybnM6XG4gIC8vIFxuICAvLyAgKEZ1bmN0aW9uKSBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAgXG4gICQudGhyb3R0bGUgPSBqcV90aHJvdHRsZSA9IGZ1bmN0aW9uKCBkZWxheSwgbm9fdHJhaWxpbmcsIGNhbGxiYWNrLCBkZWJvdW5jZV9tb2RlICkge1xuICAgIC8vIEFmdGVyIHdyYXBwZXIgaGFzIHN0b3BwZWQgYmVpbmcgY2FsbGVkLCB0aGlzIHRpbWVvdXQgZW5zdXJlcyB0aGF0XG4gICAgLy8gYGNhbGxiYWNrYCBpcyBleGVjdXRlZCBhdCB0aGUgcHJvcGVyIHRpbWVzIGluIGB0aHJvdHRsZWAgYW5kIGBlbmRgXG4gICAgLy8gZGVib3VuY2UgbW9kZXMuXG4gICAgdmFyIHRpbWVvdXRfaWQsXG4gICAgICBcbiAgICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGxhc3QgdGltZSBgY2FsbGJhY2tgIHdhcyBleGVjdXRlZC5cbiAgICAgIGxhc3RfZXhlYyA9IDA7XG4gICAgXG4gICAgLy8gYG5vX3RyYWlsaW5nYCBkZWZhdWx0cyB0byBmYWxzeS5cbiAgICBpZiAoIHR5cGVvZiBub190cmFpbGluZyAhPT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZGVib3VuY2VfbW9kZSA9IGNhbGxiYWNrO1xuICAgICAgY2FsbGJhY2sgPSBub190cmFpbGluZztcbiAgICAgIG5vX3RyYWlsaW5nID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyBUaGUgYHdyYXBwZXJgIGZ1bmN0aW9uIGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIHRocm90dGxpbmcgLyBkZWJvdW5jaW5nXG4gICAgLy8gZnVuY3Rpb25hbGl0eSBhbmQgd2hlbiBleGVjdXRlZCB3aWxsIGxpbWl0IHRoZSByYXRlIGF0IHdoaWNoIGBjYWxsYmFja2BcbiAgICAvLyBpcyBleGVjdXRlZC5cbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBlbGFwc2VkID0gK25ldyBEYXRlKCkgLSBsYXN0X2V4ZWMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBcbiAgICAgIC8vIEV4ZWN1dGUgYGNhbGxiYWNrYCBhbmQgdXBkYXRlIHRoZSBgbGFzdF9leGVjYCB0aW1lc3RhbXAuXG4gICAgICBmdW5jdGlvbiBleGVjKCkge1xuICAgICAgICBsYXN0X2V4ZWMgPSArbmV3IERhdGUoKTtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoIHRoYXQsIGFyZ3MgKTtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbikgdGhpcyBpcyB1c2VkIHRvIGNsZWFyIHRoZSBmbGFnXG4gICAgICAvLyB0byBhbGxvdyBmdXR1cmUgYGNhbGxiYWNrYCBleGVjdXRpb25zLlxuICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHRpbWVvdXRfaWQgPSB1bmRlZmluZWQ7XG4gICAgICB9O1xuICAgICAgXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgJiYgIXRpbWVvdXRfaWQgKSB7XG4gICAgICAgIC8vIFNpbmNlIGB3cmFwcGVyYCBpcyBiZWluZyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZFxuICAgICAgICAvLyBgZGVib3VuY2VfbW9kZWAgaXMgdHJ1ZSAoYXRfYmVnaW4pLCBleGVjdXRlIGBjYWxsYmFja2AuXG4gICAgICAgIGV4ZWMoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuXG4gICAgICB0aW1lb3V0X2lkICYmIGNsZWFyVGltZW91dCggdGltZW91dF9pZCApO1xuICAgICAgXG4gICAgICBpZiAoIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCAmJiBlbGFwc2VkID4gZGVsYXkgKSB7XG4gICAgICAgIC8vIEluIHRocm90dGxlIG1vZGUsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuICAgICAgICAvLyBgY2FsbGJhY2tgLlxuICAgICAgICBleGVjKCk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIGlmICggbm9fdHJhaWxpbmcgIT09IHRydWUgKSB7XG4gICAgICAgIC8vIEluIHRyYWlsaW5nIHRocm90dGxlIG1vZGUsIHNpbmNlIGBkZWxheWAgdGltZSBoYXMgbm90IGJlZW5cbiAgICAgICAgLy8gZXhjZWVkZWQsIHNjaGVkdWxlIGBjYWxsYmFja2AgdG8gZXhlY3V0ZSBgZGVsYXlgIG1zIGFmdGVyIG1vc3RcbiAgICAgICAgLy8gcmVjZW50IGV4ZWN1dGlvbi5cbiAgICAgICAgLy8gXG4gICAgICAgIC8vIElmIGBkZWJvdW5jZV9tb2RlYCBpcyB0cnVlIChhdF9iZWdpbiksIHNjaGVkdWxlIGBjbGVhcmAgdG8gZXhlY3V0ZVxuICAgICAgICAvLyBhZnRlciBgZGVsYXlgIG1zLlxuICAgICAgICAvLyBcbiAgICAgICAgLy8gSWYgYGRlYm91bmNlX21vZGVgIGlzIGZhbHNlIChhdCBlbmQpLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvXG4gICAgICAgIC8vIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy5cbiAgICAgICAgdGltZW91dF9pZCA9IHNldFRpbWVvdXQoIGRlYm91bmNlX21vZGUgPyBjbGVhciA6IGV4ZWMsIGRlYm91bmNlX21vZGUgPT09IHVuZGVmaW5lZCA/IGRlbGF5IC0gZWxhcHNlZCA6IGRlbGF5ICk7XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBTZXQgdGhlIGd1aWQgb2YgYHdyYXBwZXJgIGZ1bmN0aW9uIHRvIHRoZSBzYW1lIG9mIG9yaWdpbmFsIGNhbGxiYWNrLCBzb1xuICAgIC8vIGl0IGNhbiBiZSByZW1vdmVkIGluIGpRdWVyeSAxLjQrIC51bmJpbmQgb3IgLmRpZSBieSB1c2luZyB0aGUgb3JpZ2luYWxcbiAgICAvLyBjYWxsYmFjayBhcyBhIHJlZmVyZW5jZS5cbiAgICBpZiAoICQuZ3VpZCApIHtcbiAgICAgIHdyYXBwZXIuZ3VpZCA9IGNhbGxiYWNrLmd1aWQgPSBjYWxsYmFjay5ndWlkIHx8ICQuZ3VpZCsrO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gdGhlIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH07XG4gIFxuICAvLyBNZXRob2Q6IGpRdWVyeS5kZWJvdW5jZVxuICAvLyBcbiAgLy8gRGVib3VuY2UgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uIERlYm91bmNpbmcsIHVubGlrZSB0aHJvdHRsaW5nLFxuICAvLyBndWFyYW50ZWVzIHRoYXQgYSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGEgc2luZ2xlIHRpbWUsIGVpdGhlciBhdCB0aGVcbiAgLy8gdmVyeSBiZWdpbm5pbmcgb2YgYSBzZXJpZXMgb2YgY2FsbHMsIG9yIGF0IHRoZSB2ZXJ5IGVuZC4gSWYgeW91IHdhbnQgdG9cbiAgLy8gc2ltcGx5IHJhdGUtbGltaXQgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24sIHNlZSB0aGUgPGpRdWVyeS50aHJvdHRsZT5cbiAgLy8gbWV0aG9kLlxuICAvLyBcbiAgLy8gSW4gdGhpcyB2aXN1YWxpemF0aW9uLCB8IGlzIGEgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwgYW5kIFggaXMgdGhlIGFjdHVhbFxuICAvLyBjYWxsYmFjayBleGVjdXRpb246XG4gIC8vIFxuICAvLyA+IERlYm91bmNlZCB3aXRoIGBhdF9iZWdpbmAgc3BlY2lmaWVkIGFzIGZhbHNlIG9yIHVuc3BlY2lmaWVkOlxuICAvLyA+IHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHwgKHBhdXNlKSB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8XG4gIC8vID4gICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYXG4gIC8vID4gXG4gIC8vID4gRGVib3VuY2VkIHdpdGggYGF0X2JlZ2luYCBzcGVjaWZpZWQgYXMgdHJ1ZTpcbiAgLy8gPiB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8IChwYXVzZSkgfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fFxuICAvLyA+IFggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYXG4gIC8vIFxuICAvLyBVc2FnZTpcbiAgLy8gXG4gIC8vID4gdmFyIGRlYm91bmNlZCA9IGpRdWVyeS5kZWJvdW5jZSggZGVsYXksIFsgYXRfYmVnaW4sIF0gY2FsbGJhY2sgKTtcbiAgLy8gPiBcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykuYmluZCggJ3NvbWVldmVudCcsIGRlYm91bmNlZCApO1xuICAvLyA+IGpRdWVyeSgnc2VsZWN0b3InKS51bmJpbmQoICdzb21lZXZlbnQnLCBkZWJvdW5jZWQgKTtcbiAgLy8gXG4gIC8vIFRoaXMgYWxzbyB3b3JrcyBpbiBqUXVlcnkgMS40KzpcbiAgLy8gXG4gIC8vID4galF1ZXJ5KCdzZWxlY3RvcicpLmJpbmQoICdzb21lZXZlbnQnLCBqUXVlcnkuZGVib3VuY2UoIGRlbGF5LCBbIGF0X2JlZ2luLCBdIGNhbGxiYWNrICkgKTtcbiAgLy8gPiBqUXVlcnkoJ3NlbGVjdG9yJykudW5iaW5kKCAnc29tZWV2ZW50JywgY2FsbGJhY2sgKTtcbiAgLy8gXG4gIC8vIEFyZ3VtZW50czpcbiAgLy8gXG4gIC8vICBkZWxheSAtIChOdW1iZXIpIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50XG4gIC8vICAgIGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcikgYXJlIG1vc3QgdXNlZnVsLlxuICAvLyAgYXRfYmVnaW4gLSAoQm9vbGVhbikgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdF9iZWdpbiBpcyBmYWxzZSBvclxuICAvLyAgICB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGBkZWxheWAgbWlsbGlzZWNvbmRzIGFmdGVyXG4gIC8vICAgIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdF9iZWdpbiBpcyB0cnVlLCBjYWxsYmFjayB3aWxsIGJlXG4gIC8vICAgIGV4ZWN1dGVkIG9ubHkgYXQgdGhlIGZpcnN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlXG4gIC8vICAgIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlXG4gIC8vICAgIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpXG4gIC8vICBjYWxsYmFjayAtIChGdW5jdGlvbikgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuXG4gIC8vICAgIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLCB0b1xuICAvLyAgICBgY2FsbGJhY2tgIHdoZW4gdGhlIGRlYm91bmNlZC1mdW5jdGlvbiBpcyBleGVjdXRlZC5cbiAgLy8gXG4gIC8vIFJldHVybnM6XG4gIC8vIFxuICAvLyAgKEZ1bmN0aW9uKSBBIG5ldywgZGVib3VuY2VkLCBmdW5jdGlvbi5cbiAgXG4gICQuZGVib3VuY2UgPSBmdW5jdGlvbiggZGVsYXksIGF0X2JlZ2luLCBjYWxsYmFjayApIHtcbiAgICByZXR1cm4gY2FsbGJhY2sgPT09IHVuZGVmaW5lZFxuICAgICAgPyBqcV90aHJvdHRsZSggZGVsYXksIGF0X2JlZ2luLCBmYWxzZSApXG4gICAgICA6IGpxX3Rocm90dGxlKCBkZWxheSwgY2FsbGJhY2ssIGF0X2JlZ2luICE9PSBmYWxzZSApO1xuICB9O1xuICBcbn0pKHRoaXMpO1xuIiwiLyohXG4gKiBob3ZlckludGVudCB2MS44LjEgLy8gMjAxNC4wOC4xMSAvLyBqUXVlcnkgdjEuOS4xK1xuICogaHR0cDovL2NoZXJuZS5uZXQvYnJpYW4vcmVzb3VyY2VzL2pxdWVyeS5ob3ZlckludGVudC5odG1sXG4gKlxuICogWW91IG1heSB1c2UgaG92ZXJJbnRlbnQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS4gQmFzaWNhbGx5IHRoYXRcbiAqIG1lYW5zIHlvdSBhcmUgZnJlZSB0byB1c2UgaG92ZXJJbnRlbnQgYXMgbG9uZyBhcyB0aGlzIGhlYWRlciBpcyBsZWZ0IGludGFjdC5cbiAqIENvcHlyaWdodCAyMDA3LCAyMDE0IEJyaWFuIENoZXJuZVxuICovXG4gXG4vKiBob3ZlckludGVudCBpcyBzaW1pbGFyIHRvIGpRdWVyeSdzIGJ1aWx0LWluIFwiaG92ZXJcIiBtZXRob2QgZXhjZXB0IHRoYXRcbiAqIGluc3RlYWQgb2YgZmlyaW5nIHRoZSBoYW5kbGVySW4gZnVuY3Rpb24gaW1tZWRpYXRlbHksIGhvdmVySW50ZW50IGNoZWNrc1xuICogdG8gc2VlIGlmIHRoZSB1c2VyJ3MgbW91c2UgaGFzIHNsb3dlZCBkb3duIChiZW5lYXRoIHRoZSBzZW5zaXRpdml0eVxuICogdGhyZXNob2xkKSBiZWZvcmUgZmlyaW5nIHRoZSBldmVudC4gVGhlIGhhbmRsZXJPdXQgZnVuY3Rpb24gaXMgb25seVxuICogY2FsbGVkIGFmdGVyIGEgbWF0Y2hpbmcgaGFuZGxlckluLlxuICpcbiAqIC8vIGJhc2ljIHVzYWdlIC4uLiBqdXN0IGxpa2UgLmhvdmVyKClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluLCBoYW5kbGVyT3V0IClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluT3V0IClcbiAqXG4gKiAvLyBiYXNpYyB1c2FnZSAuLi4gd2l0aCBldmVudCBkZWxlZ2F0aW9uIVxuICogLmhvdmVySW50ZW50KCBoYW5kbGVySW4sIGhhbmRsZXJPdXQsIHNlbGVjdG9yIClcbiAqIC5ob3ZlckludGVudCggaGFuZGxlckluT3V0LCBzZWxlY3RvciApXG4gKlxuICogLy8gdXNpbmcgYSBiYXNpYyBjb25maWd1cmF0aW9uIG9iamVjdFxuICogLmhvdmVySW50ZW50KCBjb25maWcgKVxuICpcbiAqIEBwYXJhbSAgaGFuZGxlckluICAgZnVuY3Rpb24gT1IgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAgaGFuZGxlck91dCAgZnVuY3Rpb24gT1Igc2VsZWN0b3IgZm9yIGRlbGVnYXRpb24gT1IgdW5kZWZpbmVkXG4gKiBAcGFyYW0gIHNlbGVjdG9yICAgIHNlbGVjdG9yIE9SIHVuZGVmaW5lZFxuICogQGF1dGhvciBCcmlhbiBDaGVybmUgPGJyaWFuKGF0KWNoZXJuZShkb3QpbmV0PlxuICovXG4oZnVuY3Rpb24oJCkge1xuICAgICQuZm4uaG92ZXJJbnRlbnQgPSBmdW5jdGlvbihoYW5kbGVySW4saGFuZGxlck91dCxzZWxlY3Rvcikge1xuXG4gICAgICAgIC8vIGRlZmF1bHQgY29uZmlndXJhdGlvbiB2YWx1ZXNcbiAgICAgICAgdmFyIGNmZyA9IHtcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAsXG4gICAgICAgICAgICBzZW5zaXRpdml0eTogNixcbiAgICAgICAgICAgIHRpbWVvdXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIHR5cGVvZiBoYW5kbGVySW4gPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgICBjZmcgPSAkLmV4dGVuZChjZmcsIGhhbmRsZXJJbiApO1xuICAgICAgICB9IGVsc2UgaWYgKCQuaXNGdW5jdGlvbihoYW5kbGVyT3V0KSkge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVyT3V0LCBzZWxlY3Rvcjogc2VsZWN0b3IgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2ZnID0gJC5leHRlbmQoY2ZnLCB7IG92ZXI6IGhhbmRsZXJJbiwgb3V0OiBoYW5kbGVySW4sIHNlbGVjdG9yOiBoYW5kbGVyT3V0IH0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIHZhcmlhYmxlc1xuICAgICAgICAvLyBjWCwgY1kgPSBjdXJyZW50IFggYW5kIFkgcG9zaXRpb24gb2YgbW91c2UsIHVwZGF0ZWQgYnkgbW91c2Vtb3ZlIGV2ZW50XG4gICAgICAgIC8vIHBYLCBwWSA9IHByZXZpb3VzIFggYW5kIFkgcG9zaXRpb24gb2YgbW91c2UsIHNldCBieSBtb3VzZW92ZXIgYW5kIHBvbGxpbmcgaW50ZXJ2YWxcbiAgICAgICAgdmFyIGNYLCBjWSwgcFgsIHBZO1xuXG4gICAgICAgIC8vIEEgcHJpdmF0ZSBmdW5jdGlvbiBmb3IgZ2V0dGluZyBtb3VzZSBwb3NpdGlvblxuICAgICAgICB2YXIgdHJhY2sgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgY1ggPSBldi5wYWdlWDtcbiAgICAgICAgICAgIGNZID0gZXYucGFnZVk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBjb21wYXJpbmcgY3VycmVudCBhbmQgcHJldmlvdXMgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdmFyIGNvbXBhcmUgPSBmdW5jdGlvbihldixvYikge1xuICAgICAgICAgICAgb2IuaG92ZXJJbnRlbnRfdCA9IGNsZWFyVGltZW91dChvYi5ob3ZlckludGVudF90KTtcbiAgICAgICAgICAgIC8vIGNvbXBhcmUgbW91c2UgcG9zaXRpb25zIHRvIHNlZSBpZiB0aGV5J3ZlIGNyb3NzZWQgdGhlIHRocmVzaG9sZFxuICAgICAgICAgICAgaWYgKCBNYXRoLnNxcnQoIChwWC1jWCkqKHBYLWNYKSArIChwWS1jWSkqKHBZLWNZKSApIDwgY2ZnLnNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgICAgICAgICQob2IpLm9mZihcIm1vdXNlbW92ZS5ob3ZlckludGVudFwiLHRyYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgaG92ZXJJbnRlbnQgc3RhdGUgdG8gdHJ1ZSAoc28gbW91c2VPdXQgY2FuIGJlIGNhbGxlZClcbiAgICAgICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2ZnLm92ZXIuYXBwbHkob2IsW2V2XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNldCBwcmV2aW91cyBjb29yZGluYXRlcyBmb3IgbmV4dCB0aW1lXG4gICAgICAgICAgICAgICAgcFggPSBjWDsgcFkgPSBjWTtcbiAgICAgICAgICAgICAgICAvLyB1c2Ugc2VsZi1jYWxsaW5nIHRpbWVvdXQsIGd1YXJhbnRlZXMgaW50ZXJ2YWxzIGFyZSBzcGFjZWQgb3V0IHByb3Blcmx5IChhdm9pZHMgSmF2YVNjcmlwdCB0aW1lciBidWdzKVxuICAgICAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe2NvbXBhcmUoZXYsIG9iKTt9ICwgY2ZnLmludGVydmFsICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBkZWxheWluZyB0aGUgbW91c2VPdXQgZnVuY3Rpb25cbiAgICAgICAgdmFyIGRlbGF5ID0gZnVuY3Rpb24oZXYsb2IpIHtcbiAgICAgICAgICAgIG9iLmhvdmVySW50ZW50X3QgPSBjbGVhclRpbWVvdXQob2IuaG92ZXJJbnRlbnRfdCk7XG4gICAgICAgICAgICBvYi5ob3ZlckludGVudF9zID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gY2ZnLm91dC5hcHBseShvYixbZXZdKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBIHByaXZhdGUgZnVuY3Rpb24gZm9yIGhhbmRsaW5nIG1vdXNlICdob3ZlcmluZydcbiAgICAgICAgdmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgLy8gY29weSBvYmplY3RzIHRvIGJlIHBhc3NlZCBpbnRvIHQgKHJlcXVpcmVkIGZvciBldmVudCBvYmplY3QgdG8gYmUgcGFzc2VkIGluIElFKVxuICAgICAgICAgICAgdmFyIGV2ID0gJC5leHRlbmQoe30sZSk7XG4gICAgICAgICAgICB2YXIgb2IgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgaG92ZXJJbnRlbnQgdGltZXIgaWYgaXQgZXhpc3RzXG4gICAgICAgICAgICBpZiAob2IuaG92ZXJJbnRlbnRfdCkgeyBvYi5ob3ZlckludGVudF90ID0gY2xlYXJUaW1lb3V0KG9iLmhvdmVySW50ZW50X3QpOyB9XG5cbiAgICAgICAgICAgIC8vIGlmIGUudHlwZSA9PT0gXCJtb3VzZWVudGVyXCJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2VlbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IFwicHJldmlvdXNcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIGluaXRpYWwgZW50cnkgcG9pbnRcbiAgICAgICAgICAgICAgICBwWCA9IGV2LnBhZ2VYOyBwWSA9IGV2LnBhZ2VZO1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBcImN1cnJlbnRcIiBYIGFuZCBZIHBvc2l0aW9uIGJhc2VkIG9uIG1vdXNlbW92ZVxuICAgICAgICAgICAgICAgICQob2IpLm9uKFwibW91c2Vtb3ZlLmhvdmVySW50ZW50XCIsdHJhY2spO1xuICAgICAgICAgICAgICAgIC8vIHN0YXJ0IHBvbGxpbmcgaW50ZXJ2YWwgKHNlbGYtY2FsbGluZyB0aW1lb3V0KSB0byBjb21wYXJlIG1vdXNlIGNvb3JkaW5hdGVzIG92ZXIgdGltZVxuICAgICAgICAgICAgICAgIGlmICghb2IuaG92ZXJJbnRlbnRfcykgeyBvYi5ob3ZlckludGVudF90ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtjb21wYXJlKGV2LG9iKTt9ICwgY2ZnLmludGVydmFsICk7fVxuXG4gICAgICAgICAgICAgICAgLy8gZWxzZSBlLnR5cGUgPT0gXCJtb3VzZWxlYXZlXCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdW5iaW5kIGV4cGVuc2l2ZSBtb3VzZW1vdmUgZXZlbnRcbiAgICAgICAgICAgICAgICAkKG9iKS5vZmYoXCJtb3VzZW1vdmUuaG92ZXJJbnRlbnRcIix0cmFjayk7XG4gICAgICAgICAgICAgICAgLy8gaWYgaG92ZXJJbnRlbnQgc3RhdGUgaXMgdHJ1ZSwgdGhlbiBjYWxsIHRoZSBtb3VzZU91dCBmdW5jdGlvbiBhZnRlciB0aGUgc3BlY2lmaWVkIGRlbGF5XG4gICAgICAgICAgICAgICAgaWYgKG9iLmhvdmVySW50ZW50X3MpIHsgb2IuaG92ZXJJbnRlbnRfdCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7ZGVsYXkoZXYsb2IpO30gLCBjZmcudGltZW91dCApO31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBsaXN0ZW4gZm9yIG1vdXNlZW50ZXIgYW5kIG1vdXNlbGVhdmVcbiAgICAgICAgcmV0dXJuIHRoaXMub24oeydtb3VzZWVudGVyLmhvdmVySW50ZW50JzpoYW5kbGVIb3ZlciwnbW91c2VsZWF2ZS5ob3ZlckludGVudCc6aGFuZGxlSG92ZXJ9LCBjZmcuc2VsZWN0b3IpO1xuICAgIH07XG59KShqUXVlcnkpO1xuIiwiLyohXG4gKiBpbWFnZXNMb2FkZWQgUEFDS0FHRUQgdjMuMS44XG4gKiBKYXZhU2NyaXB0IGlzIGFsbCBsaWtlIFwiWW91IGltYWdlcyBhcmUgZG9uZSB5ZXQgb3Igd2hhdD9cIlxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fWZ1bmN0aW9uIHQoZSx0KXtmb3IodmFyIG49ZS5sZW5ndGg7bi0tOylpZihlW25dLmxpc3RlbmVyPT09dClyZXR1cm4gbjtyZXR1cm4tMX1mdW5jdGlvbiBuKGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0aGlzW2VdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19dmFyIGk9ZS5wcm90b3R5cGUscj10aGlzLG89ci5FdmVudEVtaXR0ZXI7aS5nZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMuX2dldEV2ZW50cygpO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt0PXt9O2ZvcihuIGluIGkpaS5oYXNPd25Qcm9wZXJ0eShuKSYmZS50ZXN0KG4pJiYodFtuXT1pW25dKX1lbHNlIHQ9aVtlXXx8KGlbZV09W10pO3JldHVybiB0fSxpLmZsYXR0ZW5MaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7dmFyIHQsbj1bXTtmb3IodD0wO2UubGVuZ3RoPnQ7dCs9MSluLnB1c2goZVt0XS5saXN0ZW5lcik7cmV0dXJuIG59LGkuZ2V0TGlzdGVuZXJzQXNPYmplY3Q9ZnVuY3Rpb24oZSl7dmFyIHQsbj10aGlzLmdldExpc3RlbmVycyhlKTtyZXR1cm4gbiBpbnN0YW5jZW9mIEFycmF5JiYodD17fSx0W2VdPW4pLHR8fG59LGkuYWRkTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSksbz1cIm9iamVjdFwiPT10eXBlb2Ygbjtmb3IoaSBpbiByKXIuaGFzT3duUHJvcGVydHkoaSkmJi0xPT09dChyW2ldLG4pJiZyW2ldLnB1c2gobz9uOntsaXN0ZW5lcjpuLG9uY2U6ITF9KTtyZXR1cm4gdGhpc30saS5vbj1uKFwiYWRkTGlzdGVuZXJcIiksaS5hZGRPbmNlTGlzdGVuZXI9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihlLHtsaXN0ZW5lcjp0LG9uY2U6ITB9KX0saS5vbmNlPW4oXCJhZGRPbmNlTGlzdGVuZXJcIiksaS5kZWZpbmVFdmVudD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5nZXRMaXN0ZW5lcnMoZSksdGhpc30saS5kZWZpbmVFdmVudHM9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PTA7ZS5sZW5ndGg+dDt0Kz0xKXRoaXMuZGVmaW5lRXZlbnQoZVt0XSk7cmV0dXJuIHRoaXN9LGkucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaSxyLG89dGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChlKTtmb3IociBpbiBvKW8uaGFzT3duUHJvcGVydHkocikmJihpPXQob1tyXSxuKSwtMSE9PWkmJm9bcl0uc3BsaWNlKGksMSkpO3JldHVybiB0aGlzfSxpLm9mZj1uKFwicmVtb3ZlTGlzdGVuZXJcIiksaS5hZGRMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKCExLGUsdCl9LGkucmVtb3ZlTGlzdGVuZXJzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyghMCxlLHQpfSxpLm1hbmlwdWxhdGVMaXN0ZW5lcnM9ZnVuY3Rpb24oZSx0LG4pe3ZhciBpLHIsbz1lP3RoaXMucmVtb3ZlTGlzdGVuZXI6dGhpcy5hZGRMaXN0ZW5lcixzPWU/dGhpcy5yZW1vdmVMaXN0ZW5lcnM6dGhpcy5hZGRMaXN0ZW5lcnM7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHR8fHQgaW5zdGFuY2VvZiBSZWdFeHApZm9yKGk9bi5sZW5ndGg7aS0tOylvLmNhbGwodGhpcyx0LG5baV0pO2Vsc2UgZm9yKGkgaW4gdCl0Lmhhc093blByb3BlcnR5KGkpJiYocj10W2ldKSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHI/by5jYWxsKHRoaXMsaSxyKTpzLmNhbGwodGhpcyxpLHIpKTtyZXR1cm4gdGhpc30saS5yZW1vdmVFdmVudD1mdW5jdGlvbihlKXt2YXIgdCxuPXR5cGVvZiBlLGk9dGhpcy5fZ2V0RXZlbnRzKCk7aWYoXCJzdHJpbmdcIj09PW4pZGVsZXRlIGlbZV07ZWxzZSBpZihcIm9iamVjdFwiPT09bilmb3IodCBpbiBpKWkuaGFzT3duUHJvcGVydHkodCkmJmUudGVzdCh0KSYmZGVsZXRlIGlbdF07ZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzO3JldHVybiB0aGlzfSxpLnJlbW92ZUFsbExpc3RlbmVycz1uKFwicmVtb3ZlRXZlbnRcIiksaS5lbWl0RXZlbnQ9ZnVuY3Rpb24oZSx0KXt2YXIgbixpLHIsbyxzPXRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZSk7Zm9yKHIgaW4gcylpZihzLmhhc093blByb3BlcnR5KHIpKWZvcihpPXNbcl0ubGVuZ3RoO2ktLTspbj1zW3JdW2ldLG4ub25jZT09PSEwJiZ0aGlzLnJlbW92ZUxpc3RlbmVyKGUsbi5saXN0ZW5lciksbz1uLmxpc3RlbmVyLmFwcGx5KHRoaXMsdHx8W10pLG89PT10aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSYmdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG4ubGlzdGVuZXIpO3JldHVybiB0aGlzfSxpLnRyaWdnZXI9bihcImVtaXRFdmVudFwiKSxpLmVtaXQ9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiB0aGlzLmVtaXRFdmVudChlLHQpfSxpLnNldE9uY2VSZXR1cm5WYWx1ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlPWUsdGhpc30saS5fZ2V0T25jZVJldHVyblZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoXCJfb25jZVJldHVyblZhbHVlXCIpP3RoaXMuX29uY2VSZXR1cm5WYWx1ZTohMH0saS5fZ2V0RXZlbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz17fSl9LGUubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLkV2ZW50RW1pdHRlcj1vLGV9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoXCJldmVudEVtaXR0ZXIvRXZlbnRFbWl0dGVyXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gZX0pOlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWU6dGhpcy5FdmVudEVtaXR0ZXI9ZX0pLmNhbGwodGhpcyksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2YXIgbj1lLmV2ZW50O3JldHVybiBuLnRhcmdldD1uLnRhcmdldHx8bi5zcmNFbGVtZW50fHx0LG59dmFyIG49ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LGk9ZnVuY3Rpb24oKXt9O24uYWRkRXZlbnRMaXN0ZW5lcj9pPWZ1bmN0aW9uKGUsdCxuKXtlLmFkZEV2ZW50TGlzdGVuZXIodCxuLCExKX06bi5hdHRhY2hFdmVudCYmKGk9ZnVuY3Rpb24oZSxuLGkpe2VbbitpXT1pLmhhbmRsZUV2ZW50P2Z1bmN0aW9uKCl7dmFyIG49dChlKTtpLmhhbmRsZUV2ZW50LmNhbGwoaSxuKX06ZnVuY3Rpb24oKXt2YXIgbj10KGUpO2kuY2FsbChlLG4pfSxlLmF0dGFjaEV2ZW50KFwib25cIituLGVbbitpXSl9KTt2YXIgcj1mdW5jdGlvbigpe307bi5yZW1vdmVFdmVudExpc3RlbmVyP3I9ZnVuY3Rpb24oZSx0LG4pe2UucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpuLmRldGFjaEV2ZW50JiYocj1mdW5jdGlvbihlLHQsbil7ZS5kZXRhY2hFdmVudChcIm9uXCIrdCxlW3Qrbl0pO3RyeXtkZWxldGUgZVt0K25dfWNhdGNoKGkpe2VbdCtuXT12b2lkIDB9fSk7dmFyIG89e2JpbmQ6aSx1bmJpbmQ6cn07XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcImV2ZW50aWUvZXZlbnRpZVwiLG8pOmUuZXZlbnRpZT1vfSh0aGlzKSxmdW5jdGlvbihlLHQpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXZlbnRFbWl0dGVyL0V2ZW50RW1pdHRlclwiLFwiZXZlbnRpZS9ldmVudGllXCJdLGZ1bmN0aW9uKG4saSl7cmV0dXJuIHQoZSxuLGkpfSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9dChlLHJlcXVpcmUoXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiKSxyZXF1aXJlKFwiZXZlbnRpZVwiKSk6ZS5pbWFnZXNMb2FkZWQ9dChlLGUuRXZlbnRFbWl0dGVyLGUuZXZlbnRpZSl9KHdpbmRvdyxmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gaShlLHQpe2Zvcih2YXIgbiBpbiB0KWVbbl09dFtuXTtyZXR1cm4gZX1mdW5jdGlvbiByKGUpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PWQuY2FsbChlKX1mdW5jdGlvbiBvKGUpe3ZhciB0PVtdO2lmKHIoZSkpdD1lO2Vsc2UgaWYoXCJudW1iZXJcIj09dHlwZW9mIGUubGVuZ3RoKWZvcih2YXIgbj0wLGk9ZS5sZW5ndGg7aT5uO24rKyl0LnB1c2goZVtuXSk7ZWxzZSB0LnB1c2goZSk7cmV0dXJuIHR9ZnVuY3Rpb24gcyhlLHQsbil7aWYoISh0aGlzIGluc3RhbmNlb2YgcykpcmV0dXJuIG5ldyBzKGUsdCk7XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZSkpLHRoaXMuZWxlbWVudHM9byhlKSx0aGlzLm9wdGlvbnM9aSh7fSx0aGlzLm9wdGlvbnMpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/bj10OmkodGhpcy5vcHRpb25zLHQpLG4mJnRoaXMub24oXCJhbHdheXNcIixuKSx0aGlzLmdldEltYWdlcygpLGEmJih0aGlzLmpxRGVmZXJyZWQ9bmV3IGEuRGVmZXJyZWQpO3ZhciByPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3IuY2hlY2soKX0pfWZ1bmN0aW9uIGYoZSl7dGhpcy5pbWc9ZX1mdW5jdGlvbiBjKGUpe3RoaXMuc3JjPWUsdltlXT10aGlzfXZhciBhPWUualF1ZXJ5LHU9ZS5jb25zb2xlLGg9dSE9PXZvaWQgMCxkPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7cy5wcm90b3R5cGU9bmV3IHQscy5wcm90b3R5cGUub3B0aW9ucz17fSxzLnByb3RvdHlwZS5nZXRJbWFnZXM9ZnVuY3Rpb24oKXt0aGlzLmltYWdlcz1bXTtmb3IodmFyIGU9MCx0PXRoaXMuZWxlbWVudHMubGVuZ3RoO3Q+ZTtlKyspe3ZhciBuPXRoaXMuZWxlbWVudHNbZV07XCJJTUdcIj09PW4ubm9kZU5hbWUmJnRoaXMuYWRkSW1hZ2Uobik7dmFyIGk9bi5ub2RlVHlwZTtpZihpJiYoMT09PWl8fDk9PT1pfHwxMT09PWkpKWZvcih2YXIgcj1uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIiksbz0wLHM9ci5sZW5ndGg7cz5vO28rKyl7dmFyIGY9cltvXTt0aGlzLmFkZEltYWdlKGYpfX19LHMucHJvdG90eXBlLmFkZEltYWdlPWZ1bmN0aW9uKGUpe3ZhciB0PW5ldyBmKGUpO3RoaXMuaW1hZ2VzLnB1c2godCl9LHMucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHIpe3JldHVybiB0Lm9wdGlvbnMuZGVidWcmJmgmJnUubG9nKFwiY29uZmlybVwiLGUsciksdC5wcm9ncmVzcyhlKSxuKyssbj09PWkmJnQuY29tcGxldGUoKSwhMH12YXIgdD10aGlzLG49MCxpPXRoaXMuaW1hZ2VzLmxlbmd0aDtpZih0aGlzLmhhc0FueUJyb2tlbj0hMSwhaSlyZXR1cm4gdGhpcy5jb21wbGV0ZSgpLHZvaWQgMDtmb3IodmFyIHI9MDtpPnI7cisrKXt2YXIgbz10aGlzLmltYWdlc1tyXTtvLm9uKFwiY29uZmlybVwiLGUpLG8uY2hlY2soKX19LHMucHJvdG90eXBlLnByb2dyZXNzPWZ1bmN0aW9uKGUpe3RoaXMuaGFzQW55QnJva2VuPXRoaXMuaGFzQW55QnJva2VufHwhZS5pc0xvYWRlZDt2YXIgdD10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmVtaXQoXCJwcm9ncmVzc1wiLHQsZSksdC5qcURlZmVycmVkJiZ0LmpxRGVmZXJyZWQubm90aWZ5JiZ0LmpxRGVmZXJyZWQubm90aWZ5KHQsZSl9KX0scy5wcm90b3R5cGUuY29tcGxldGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmhhc0FueUJyb2tlbj9cImZhaWxcIjpcImRvbmVcIjt0aGlzLmlzQ29tcGxldGU9ITA7dmFyIHQ9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aWYodC5lbWl0KGUsdCksdC5lbWl0KFwiYWx3YXlzXCIsdCksdC5qcURlZmVycmVkKXt2YXIgbj10Lmhhc0FueUJyb2tlbj9cInJlamVjdFwiOlwicmVzb2x2ZVwiO3QuanFEZWZlcnJlZFtuXSh0KX19KX0sYSYmKGEuZm4uaW1hZ2VzTG9hZGVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49bmV3IHModGhpcyxlLHQpO3JldHVybiBuLmpxRGVmZXJyZWQucHJvbWlzZShhKHRoaXMpKX0pLGYucHJvdG90eXBlPW5ldyB0LGYucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7dmFyIGU9dlt0aGlzLmltZy5zcmNdfHxuZXcgYyh0aGlzLmltZy5zcmMpO2lmKGUuaXNDb25maXJtZWQpcmV0dXJuIHRoaXMuY29uZmlybShlLmlzTG9hZGVkLFwiY2FjaGVkIHdhcyBjb25maXJtZWRcIiksdm9pZCAwO2lmKHRoaXMuaW1nLmNvbXBsZXRlJiZ2b2lkIDAhPT10aGlzLmltZy5uYXR1cmFsV2lkdGgpcmV0dXJuIHRoaXMuY29uZmlybSgwIT09dGhpcy5pbWcubmF0dXJhbFdpZHRoLFwibmF0dXJhbFdpZHRoXCIpLHZvaWQgMDt2YXIgdD10aGlzO2Uub24oXCJjb25maXJtXCIsZnVuY3Rpb24oZSxuKXtyZXR1cm4gdC5jb25maXJtKGUuaXNMb2FkZWQsbiksITB9KSxlLmNoZWNrKCl9LGYucHJvdG90eXBlLmNvbmZpcm09ZnVuY3Rpb24oZSx0KXt0aGlzLmlzTG9hZGVkPWUsdGhpcy5lbWl0KFwiY29uZmlybVwiLHRoaXMsdCl9O3ZhciB2PXt9O3JldHVybiBjLnByb3RvdHlwZT1uZXcgdCxjLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe2lmKCF0aGlzLmlzQ2hlY2tlZCl7dmFyIGU9bmV3IEltYWdlO24uYmluZChlLFwibG9hZFwiLHRoaXMpLG4uYmluZChlLFwiZXJyb3JcIix0aGlzKSxlLnNyYz10aGlzLnNyYyx0aGlzLmlzQ2hlY2tlZD0hMH19LGMucHJvdG90eXBlLmhhbmRsZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciB0PVwib25cIitlLnR5cGU7dGhpc1t0XSYmdGhpc1t0XShlKX0sYy5wcm90b3R5cGUub25sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMCxcIm9ubG9hZFwiKSx0aGlzLnVuYmluZFByb3h5RXZlbnRzKGUpfSxjLnByb3RvdHlwZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3RoaXMuY29uZmlybSghMSxcIm9uZXJyb3JcIiksdGhpcy51bmJpbmRQcm94eUV2ZW50cyhlKX0sYy5wcm90b3R5cGUuY29uZmlybT1mdW5jdGlvbihlLHQpe3RoaXMuaXNDb25maXJtZWQ9ITAsdGhpcy5pc0xvYWRlZD1lLHRoaXMuZW1pdChcImNvbmZpcm1cIix0aGlzLHQpfSxjLnByb3RvdHlwZS51bmJpbmRQcm94eUV2ZW50cz1mdW5jdGlvbihlKXtuLnVuYmluZChlLnRhcmdldCxcImxvYWRcIix0aGlzKSxuLnVuYmluZChlLnRhcmdldCxcImVycm9yXCIsdGhpcyl9LHN9KTsiLCIvKipcbioganF1ZXJ5Lm1hdGNoSGVpZ2h0LmpzIG1hc3RlclxuKiBodHRwOi8vYnJtLmlvL2pxdWVyeS1tYXRjaC1oZWlnaHQvXG4qIExpY2Vuc2U6IE1JVFxuKi9cblxuOyhmdW5jdGlvbigkKSB7XG4gICAgLypcbiAgICAqICBpbnRlcm5hbFxuICAgICovXG5cbiAgICB2YXIgX3ByZXZpb3VzUmVzaXplV2lkdGggPSAtMSxcbiAgICAgICAgX3VwZGF0ZVRpbWVvdXQgPSAtMTtcblxuICAgIC8qXG4gICAgKiAgX3BhcnNlXG4gICAgKiAgdmFsdWUgcGFyc2UgdXRpbGl0eSBmdW5jdGlvblxuICAgICovXG5cbiAgICB2YXIgX3BhcnNlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gcGFyc2UgdmFsdWUgYW5kIGNvbnZlcnQgTmFOIHRvIDBcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgX3Jvd3NcbiAgICAqICB1dGlsaXR5IGZ1bmN0aW9uIHJldHVybnMgYXJyYXkgb2YgalF1ZXJ5IHNlbGVjdGlvbnMgcmVwcmVzZW50aW5nIGVhY2ggcm93XG4gICAgKiAgKGFzIGRpc3BsYXllZCBhZnRlciBmbG9hdCB3cmFwcGluZyBhcHBsaWVkIGJ5IGJyb3dzZXIpXG4gICAgKi9cblxuICAgIHZhciBfcm93cyA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciB0b2xlcmFuY2UgPSAxLFxuICAgICAgICAgICAgJGVsZW1lbnRzID0gJChlbGVtZW50cyksXG4gICAgICAgICAgICBsYXN0VG9wID0gbnVsbCxcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcblxuICAgICAgICAvLyBncm91cCBlbGVtZW50cyBieSB0aGVpciB0b3AgcG9zaXRpb25cbiAgICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgdG9wID0gJHRoYXQub2Zmc2V0KCkudG9wIC0gX3BhcnNlKCR0aGF0LmNzcygnbWFyZ2luLXRvcCcpKSxcbiAgICAgICAgICAgICAgICBsYXN0Um93ID0gcm93cy5sZW5ndGggPiAwID8gcm93c1tyb3dzLmxlbmd0aCAtIDFdIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKGxhc3RSb3cgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBpdGVtIG9uIHRoZSByb3csIHNvIGp1c3QgcHVzaCBpdFxuICAgICAgICAgICAgICAgIHJvd3MucHVzaCgkdGhhdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb3cgdG9wIGlzIHRoZSBzYW1lLCBhZGQgdG8gdGhlIHJvdyBncm91cFxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmZsb29yKE1hdGguYWJzKGxhc3RUb3AgLSB0b3ApKSA8PSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93c1tyb3dzLmxlbmd0aCAtIDFdID0gbGFzdFJvdy5hZGQoJHRoYXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBzdGFydCBhIG5ldyByb3cgZ3JvdXBcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKCR0aGF0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGxhc3Qgcm93IHRvcFxuICAgICAgICAgICAgbGFzdFRvcCA9IHRvcDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgX3BhcnNlT3B0aW9uc1xuICAgICogIGhhbmRsZSBwbHVnaW4gb3B0aW9uc1xuICAgICovXG5cbiAgICB2YXIgX3BhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICBieVJvdzogdHJ1ZSxcbiAgICAgICAgICAgIHByb3BlcnR5OiAnaGVpZ2h0JyxcbiAgICAgICAgICAgIHRhcmdldDogbnVsbCxcbiAgICAgICAgICAgIHJlbW92ZTogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQob3B0cywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgb3B0cy5ieVJvdyA9IG9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgICAgIG9wdHMucmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0XG4gICAgKiAgcGx1Z2luIGRlZmluaXRpb25cbiAgICAqL1xuXG4gICAgdmFyIG1hdGNoSGVpZ2h0ID0gJC5mbi5tYXRjaEhlaWdodCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdHMgPSBfcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIGhhbmRsZSByZW1vdmVcbiAgICAgICAgaWYgKG9wdHMucmVtb3ZlKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBmaXhlZCBoZWlnaHQgZnJvbSBhbGwgc2VsZWN0ZWQgZWxlbWVudHNcbiAgICAgICAgICAgIHRoaXMuY3NzKG9wdHMucHJvcGVydHksICcnKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGVkIGVsZW1lbnRzIGZyb20gYWxsIGdyb3Vwc1xuICAgICAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKGtleSwgZ3JvdXApIHtcbiAgICAgICAgICAgICAgICBncm91cC5lbGVtZW50cyA9IGdyb3VwLmVsZW1lbnRzLm5vdCh0aGF0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbnVwIGVtcHR5IGdyb3Vwc1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8PSAxICYmICFvcHRzLnRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoaXMgZ3JvdXAgc28gd2UgY2FuIHJlLWFwcGx5IGxhdGVyIG9uIGxvYWQgYW5kIHJlc2l6ZSBldmVudHNcbiAgICAgICAgbWF0Y2hIZWlnaHQuX2dyb3Vwcy5wdXNoKHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiB0aGlzLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0c1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBtYXRjaCBlYWNoIGVsZW1lbnQncyBoZWlnaHQgdG8gdGhlIHRhbGxlc3QgZWxlbWVudCBpbiB0aGUgc2VsZWN0aW9uXG4gICAgICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSh0aGlzLCBvcHRzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLypcbiAgICAqICBwbHVnaW4gZ2xvYmFsIG9wdGlvbnNcbiAgICAqL1xuXG4gICAgbWF0Y2hIZWlnaHQuX2dyb3VwcyA9IFtdO1xuICAgIG1hdGNoSGVpZ2h0Ll90aHJvdHRsZSA9IDgwO1xuICAgIG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IGZhbHNlO1xuICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUgPSBudWxsO1xuICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZSA9IG51bGw7XG5cbiAgICAvKlxuICAgICogIG1hdGNoSGVpZ2h0Ll9hcHBseVxuICAgICogIGFwcGx5IG1hdGNoSGVpZ2h0IHRvIGdpdmVuIGVsZW1lbnRzXG4gICAgKi9cblxuICAgIG1hdGNoSGVpZ2h0Ll9hcHBseSA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcHRzID0gX3BhcnNlT3B0aW9ucyhvcHRpb25zKSxcbiAgICAgICAgICAgICRlbGVtZW50cyA9ICQoZWxlbWVudHMpLFxuICAgICAgICAgICAgcm93cyA9IFskZWxlbWVudHNdO1xuXG4gICAgICAgIC8vIHRha2Ugbm90ZSBvZiBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIGh0bWxIZWlnaHQgPSAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cbiAgICAgICAgLy8gZ2V0IGhpZGRlbiBwYXJlbnRzXG4gICAgICAgIHZhciAkaGlkZGVuUGFyZW50cyA9ICRlbGVtZW50cy5wYXJlbnRzKCkuZmlsdGVyKCc6aGlkZGVuJyk7XG5cbiAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxuICAgICAgICAkaGlkZGVuUGFyZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRlbXBvcmFyaWx5IG11c3QgZm9yY2UgaGlkZGVuIHBhcmVudHMgdmlzaWJsZVxuICAgICAgICAkaGlkZGVuUGFyZW50cy5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgICAvLyBnZXQgcm93cyBpZiB1c2luZyBieVJvdywgb3RoZXJ3aXNlIGFzc3VtZSBvbmUgcm93XG4gICAgICAgIGlmIChvcHRzLmJ5Um93ICYmICFvcHRzLnRhcmdldCkge1xuXG4gICAgICAgICAgICAvLyBtdXN0IGZpcnN0IGZvcmNlIGFuIGFyYml0cmFyeSBlcXVhbCBoZWlnaHQgc28gZmxvYXRpbmcgZWxlbWVudHMgYnJlYWsgZXZlbmx5XG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJHRoYXQuY3NzKCdkaXNwbGF5Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcmlseSBmb3JjZSBhIHVzYWJsZSBkaXNwbGF5IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGlubGluZSBzdHlsZVxuICAgICAgICAgICAgICAgICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJywgJHRoYXQuYXR0cignc3R5bGUnKSk7XG5cbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6IGRpc3BsYXksXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdib3JkZXItdG9wLXdpZHRoJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLWJvdHRvbS13aWR0aCc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDBweCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFycmF5IG9mIHJvd3MgKGJhc2VkIG9uIGVsZW1lbnQgdG9wIHBvc2l0aW9uKVxuICAgICAgICAgICAgcm93cyA9IF9yb3dzKCRlbGVtZW50cyk7XG5cbiAgICAgICAgICAgIC8vIHJldmVydCBvcmlnaW5hbCBpbmxpbmUgc3R5bGVzXG4gICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICR0aGF0LmF0dHIoJ3N0eWxlJywgJHRoYXQuZGF0YSgnc3R5bGUtY2FjaGUnKSB8fCAnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQuZWFjaChyb3dzLCBmdW5jdGlvbihrZXksIHJvdykge1xuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHJvdyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gMDtcblxuICAgICAgICAgICAgaWYgKCFvcHRzLnRhcmdldCkge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgYXBwbHkgdG8gcm93cyB3aXRoIG9ubHkgb25lIGl0ZW1cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5ieVJvdyAmJiAkcm93Lmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb3cuY3NzKG9wdHMucHJvcGVydHksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhlIHJvdyBhbmQgZmluZCB0aGUgbWF4IGhlaWdodFxuICAgICAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9ICR0aGF0LmNzcygnZGlzcGxheScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGZvcmNlIGEgdXNhYmxlIGRpc3BsYXkgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdpbmxpbmUtYmxvY2snICYmIGRpc3BsYXkgIT09ICdpbmxpbmUtZmxleCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZW5zdXJlIHdlIGdldCB0aGUgY29ycmVjdCBhY3R1YWwgaGVpZ2h0IChhbmQgbm90IGEgcHJldmlvdXNseSBzZXQgaGVpZ2h0IHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB2YXIgY3NzID0geyAnZGlzcGxheSc6IGRpc3BsYXkgfTtcbiAgICAgICAgICAgICAgICAgICAgY3NzW29wdHMucHJvcGVydHldID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICR0aGF0LmNzcyhjc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIG1heCBoZWlnaHQgKGluY2x1ZGluZyBwYWRkaW5nLCBidXQgbm90IG1hcmdpbilcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGF0Lm91dGVySGVpZ2h0KGZhbHNlKSA+IHRhcmdldEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gJHRoYXQub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJ0IGRpc3BsYXkgYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgJHRoYXQuY3NzKCdkaXNwbGF5JywgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgc2V0LCB1c2UgdGhlIGhlaWdodCBvZiB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICB0YXJnZXRIZWlnaHQgPSBvcHRzLnRhcmdldC5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhlIHJvdyBhbmQgYXBwbHkgdGhlIGhlaWdodCB0byBhbGwgZWxlbWVudHNcbiAgICAgICAgICAgICRyb3cuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhcHBseSB0byBhIHRhcmdldFxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnRhcmdldCAmJiAkdGhhdC5pcyhvcHRzLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBwYWRkaW5nIGFuZCBib3JkZXIgY29ycmVjdGx5IChyZXF1aXJlZCB3aGVuIG5vdCB1c2luZyBib3JkZXItYm94KVxuICAgICAgICAgICAgICAgIGlmICgkdGhhdC5jc3MoJ2JveC1zaXppbmcnKSAhPT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsUGFkZGluZyArPSBfcGFyc2UoJHRoYXQuY3NzKCdib3JkZXItdG9wLXdpZHRoJykpICsgX3BhcnNlKCR0aGF0LmNzcygnYm9yZGVyLWJvdHRvbS13aWR0aCcpKTtcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxQYWRkaW5nICs9IF9wYXJzZSgkdGhhdC5jc3MoJ3BhZGRpbmctdG9wJykpICsgX3BhcnNlKCR0aGF0LmNzcygncGFkZGluZy1ib3R0b20nKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBoZWlnaHQgKGFjY291bnRpbmcgZm9yIHBhZGRpbmcgYW5kIGJvcmRlcilcbiAgICAgICAgICAgICAgICAkdGhhdC5jc3Mob3B0cy5wcm9wZXJ0eSwgKHRhcmdldEhlaWdodCAtIHZlcnRpY2FsUGFkZGluZykgKyAncHgnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXZlcnQgaGlkZGVuIHBhcmVudHNcbiAgICAgICAgJGhpZGRlblBhcmVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGhhdC5hdHRyKCdzdHlsZScsICR0aGF0LmRhdGEoJ3N0eWxlLWNhY2hlJykgfHwgbnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIGlmIGVuYWJsZWRcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCkge1xuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgoc2Nyb2xsVG9wIC8gaHRtbEhlaWdodCkgKiAkKCdodG1sJykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaVxuICAgICogIGFwcGxpZXMgbWF0Y2hIZWlnaHQgdG8gYWxsIGVsZW1lbnRzIHdpdGggYSBkYXRhLW1hdGNoLWhlaWdodCBhdHRyaWJ1dGVcbiAgICAqL1xuXG4gICAgbWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ3JvdXBzID0ge307XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgZ3JvdXBzIGJ5IHRoZWlyIGdyb3VwSWQgc2V0IGJ5IGVsZW1lbnRzIHVzaW5nIGRhdGEtbWF0Y2gtaGVpZ2h0XG4gICAgICAgICQoJ1tkYXRhLW1hdGNoLWhlaWdodF0sIFtkYXRhLW1oXScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGdyb3VwSWQgPSAkdGhpcy5hdHRyKCdkYXRhLW1oJykgfHwgJHRoaXMuYXR0cignZGF0YS1tYXRjaC1oZWlnaHQnKTtcblxuICAgICAgICAgICAgaWYgKGdyb3VwSWQgaW4gZ3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBzW2dyb3VwSWRdID0gZ3JvdXBzW2dyb3VwSWRdLmFkZCgkdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdyb3Vwc1tncm91cElkXSA9ICR0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhcHBseSBtYXRjaEhlaWdodCB0byBlYWNoIGdyb3VwXG4gICAgICAgICQuZWFjaChncm91cHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5tYXRjaEhlaWdodCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qXG4gICAgKiAgbWF0Y2hIZWlnaHQuX3VwZGF0ZVxuICAgICogIHVwZGF0ZXMgbWF0Y2hIZWlnaHQgb24gYWxsIGN1cnJlbnQgZ3JvdXBzIHdpdGggdGhlaXIgY29ycmVjdCBvcHRpb25zXG4gICAgKi9cblxuICAgIHZhciBfdXBkYXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUpIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9iZWZvcmVVcGRhdGUoZXZlbnQsIG1hdGNoSGVpZ2h0Ll9ncm91cHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5lYWNoKG1hdGNoSGVpZ2h0Ll9ncm91cHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWF0Y2hIZWlnaHQuX2FwcGx5KHRoaXMuZWxlbWVudHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXRjaEhlaWdodC5fYWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0Ll9hZnRlclVwZGF0ZShldmVudCwgbWF0Y2hIZWlnaHQuX2dyb3Vwcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWF0Y2hIZWlnaHQuX3VwZGF0ZSA9IGZ1bmN0aW9uKHRocm90dGxlLCBldmVudCkge1xuICAgICAgICAvLyBwcmV2ZW50IHVwZGF0ZSBpZiBmaXJlZCBmcm9tIGEgcmVzaXplIGV2ZW50XG4gICAgICAgIC8vIHdoZXJlIHRoZSB2aWV3cG9ydCB3aWR0aCBoYXNuJ3QgYWN0dWFsbHkgY2hhbmdlZFxuICAgICAgICAvLyBmaXhlcyBhbiBldmVudCBsb29waW5nIGJ1ZyBpbiBJRThcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT09ICdyZXNpemUnKSB7XG4gICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICAgICAgICAgIGlmICh3aW5kb3dXaWR0aCA9PT0gX3ByZXZpb3VzUmVzaXplV2lkdGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfcHJldmlvdXNSZXNpemVXaWR0aCA9IHdpbmRvd1dpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhyb3R0bGUgdXBkYXRlc1xuICAgICAgICBpZiAoIXRocm90dGxlKSB7XG4gICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmIChfdXBkYXRlVGltZW91dCA9PT0gLTEpIHtcbiAgICAgICAgICAgIF91cGRhdGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBfdXBkYXRlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBfdXBkYXRlVGltZW91dCA9IC0xO1xuICAgICAgICAgICAgfSwgbWF0Y2hIZWlnaHQuX3Rocm90dGxlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICogIGJpbmQgZXZlbnRzXG4gICAgKi9cblxuICAgIC8vIGFwcGx5IG9uIERPTSByZWFkeSBldmVudFxuICAgICQobWF0Y2hIZWlnaHQuX2FwcGx5RGF0YUFwaSk7XG5cbiAgICAvLyB1cGRhdGUgaGVpZ2h0cyBvbiBsb2FkIGFuZCByZXNpemUgZXZlbnRzXG4gICAgJCh3aW5kb3cpLmJpbmQoJ2xvYWQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKGZhbHNlLCBldmVudCk7XG4gICAgfSk7XG5cbiAgICAvLyB0aHJvdHRsZWQgdXBkYXRlIGhlaWdodHMgb24gcmVzaXplIGV2ZW50c1xuICAgICQod2luZG93KS5iaW5kKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBtYXRjaEhlaWdodC5fdXBkYXRlKHRydWUsIGV2ZW50KTtcbiAgICB9KTtcblxufSkoalF1ZXJ5KTtcbiIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkpTIFBMVUdJTlNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cblxuXG4vLyBHZXQgQ3VycmVudCBCcmVha3BvaW50IChHbG9iYWwpXG52YXIgYnJlYWtwb2ludCA9IHt9O1xuYnJlYWtwb2ludC5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMubmFtZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXFxcIi9nLCAnJyk7XG59O1xualF1ZXJ5KHdpbmRvdykucmVzaXplKCBmdW5jdGlvbigpIHtcblx0YnJlYWtwb2ludC5yZWZyZXNoKCk7XG59KS5yZXNpemUoKTtcblxuXG4vLyBSZXNpemUgSWZyYW1lcyBQcm9wb3J0aW9uYWxseVxuZnVuY3Rpb24gaWZyYW1lQXNwZWN0KHNlbGVjdG9yKSB7XG5cdHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgalF1ZXJ5KCdpZnJhbWUnKTtcblxuXHRzZWxlY3Rvci5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHQvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG5cdFx0dmFyIGlmcmFtZSA9IGpRdWVyeSh0aGlzKSxcblx0XHRcdHdpZHRoICA9IGlmcmFtZS53aWR0aCgpO1xuXHRcdGlmICggdHlwZW9mKGlmcmFtZS5kYXRhKCdyYXRpbycpKSA9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHZhciBhdHRyVyA9IHRoaXMud2lkdGgsXG5cdFx0XHRcdGF0dHJIID0gdGhpcy5oZWlnaHQ7XG5cdFx0XHRpZnJhbWUuZGF0YSgncmF0aW8nLCBhdHRySCAvIGF0dHJXICkucmVtb3ZlQXR0cignd2lkdGgnKS5yZW1vdmVBdHRyKCdoZWlnaHQnKTtcblx0XHR9XG5cdFx0aWZyYW1lLmhlaWdodCggd2lkdGggKiBpZnJhbWUuZGF0YSgncmF0aW8nKSApLmNzcygnbWF4LWhlaWdodCcsICcnKTtcblx0fSk7XG59XG5cblxuLy8gTGlnaHRlbiAvIERhcmtlbiBDb2xvciAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcbmZ1bmN0aW9uIHNoYWRlQ29sb3IoY29sb3IsIHBlcmNlbnQpIHsgICBcblx0dmFyIGY9cGFyc2VJbnQoY29sb3Iuc2xpY2UoMSksMTYpLHQ9cGVyY2VudDwwPzA6MjU1LHA9cGVyY2VudDwwP3BlcmNlbnQqLTE6cGVyY2VudCxSPWY+PjE2LEc9Zj4+OCYweDAwRkYsQj1mJjB4MDAwMEZGO1xuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKHQtUikqcCkrUikqMHgxMDAwMCsoTWF0aC5yb3VuZCgodC1HKSpwKStHKSoweDEwMCsoTWF0aC5yb3VuZCgodC1CKSpwKStCKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xufVxuXG5cbi8vIEJsZW5kIENvbG9ycyAtIENyZWRpdCBcIlBpbXAgVHJpemtpdFwiIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzY5MzkyNy9waW1wLXRyaXpraXRcbmZ1bmN0aW9uIGJsZW5kQ29sb3JzKGMwLCBjMSwgcCkge1xuXHR2YXIgZj1wYXJzZUludChjMC5zbGljZSgxKSwxNiksdD1wYXJzZUludChjMS5zbGljZSgxKSwxNiksUjE9Zj4+MTYsRzE9Zj4+OCYweDAwRkYsQjE9ZiYweDAwMDBGRixSMj10Pj4xNixHMj10Pj44JjB4MDBGRixCMj10JjB4MDAwMEZGO1xuXHRyZXR1cm4gJyMnKygweDEwMDAwMDArKE1hdGgucm91bmQoKFIyLVIxKSpwKStSMSkqMHgxMDAwMCsoTWF0aC5yb3VuZCgoRzItRzEpKnApK0cxKSoweDEwMCsoTWF0aC5yb3VuZCgoQjItQjEpKnApK0IxKSkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xufVxuXG5cbi8vIENvbnZlcnQgY29sb3IgdG8gUkdCYVxuZnVuY3Rpb24gY29sb3JUb1JnYmEoY29sb3IsIG9wYWNpdHkpIHtcblx0aWYgKCBjb2xvci5zdWJzdHJpbmcoMCw0KSA9PSAncmdiYScgKSB7XG5cdFx0dmFyIGFscGhhID0gY29sb3IubWF0Y2goLyhbXlxcLF0qKVxcKSQvKTtcblx0XHRyZXR1cm4gY29sb3IucmVwbGFjZShhbHBoYVsxXSwgb3BhY2l0eSk7XG5cdH0gZWxzZSBpZiAoIGNvbG9yLnN1YnN0cmluZygwLDMpID09ICdyZ2InICkge1xuXHRcdHJldHVybiBjb2xvci5yZXBsYWNlKCdyZ2IoJywgJ3JnYmEoJykucmVwbGFjZSgnKScsICcsICcrb3BhY2l0eSsnKScpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBoZXggPSBjb2xvci5yZXBsYWNlKCcjJywnJyksXG5cdFx0XHRyID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygwLDIpLCAxNiksXG5cdFx0XHRnID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygyLDQpLCAxNiksXG5cdFx0XHRiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNiksXG5cdFx0XHRyZXN1bHQgPSAncmdiYSgnK3IrJywnK2crJywnK2IrJywnK29wYWNpdHkrJyknO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn1cblxuXG4vLyBDb2xvciBMaWdodCBPciBEYXJrIC0gQ3JlZGl0IFwiTGFycnkgRm94XCIgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9sYXJyeWZveC8xNjM2MzM4XG5mdW5jdGlvbiBjb2xvckxvRChjb2xvcikge1xuXHR2YXIgcixiLGcsaHNwLGEgPSBjb2xvcjtcblx0aWYgKGEubWF0Y2goL15yZ2IvKSkge1xuXHRcdGEgPSBhLm1hdGNoKC9ecmdiYT9cXCgoXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspKD86LFxccyooXFxkKyg/OlxcLlxcZCspPykpP1xcKSQvKTtcblx0XHRyID0gYVsxXTtcblx0XHRiID0gYVsyXTtcblx0XHRnID0gYVszXTtcblx0fSBlbHNlIHtcblx0XHRhID0gKygnMHgnICsgYS5zbGljZSgxKS5yZXBsYWNlKGEubGVuZ3RoIDwgNSAmJiAvLi9nLCAnJCYkJicpKTtcblx0XHRyID0gYSA+PiAxNjtcblx0XHRiID0gYSA+PiA4ICYgMjU1O1xuXHRcdGcgPSBhICYgMjU1O1xuXHR9XG5cdGhzcCA9IE1hdGguc3FydCggMC4yOTkgKiAociAqIHIpICsgMC41ODcgKiAoZyAqIGcpICsgMC4xMTQgKiAoYiAqIGIpICk7XG5cdHJldHVybiAoIGhzcCA+IDEyNy41ICkgPyAnbGlnaHQnIDogJ2RhcmsnO1xufSBcblxuXG4vLyBJbWFnZSBMaWdodCBPciBEYXJrIEltYWdlIC0gQ3JlZGl0IFwiSm9zZXBoIFBvcnRlbGxpXCIgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvMTQ5NjM2L2pvc2VwaC1wb3J0ZWxsaVxuZnVuY3Rpb24gaW1hZ2VMb0QoaW1hZ2VTcmMsIGNhbGxiYWNrKSB7XG5cdHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblx0aW1nLnNyYyA9IGltYWdlU3JjO1xuXHRpbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWcpO1xuXG5cdHZhciBjb2xvclN1bSA9IDA7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIGNyZWF0ZSBjYW52YXNcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcblx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y3R4LmRyYXdJbWFnZSh0aGlzLDAsMCk7XG5cblx0XHR2YXIgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0dmFyIHIsZyxiLGF2ZztcblxuXHRcdGZvcih2YXIgeCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyB4IDwgbGVuOyB4Kz00KSB7XG5cdFx0XHRyID0gZGF0YVt4XTtcblx0XHRcdGcgPSBkYXRhW3grMV07XG5cdFx0XHRiID0gZGF0YVt4KzJdO1xuXG5cdFx0XHRhdmcgPSBNYXRoLmZsb29yKChyK2crYikvMyk7XG5cdFx0XHRjb2xvclN1bSArPSBhdmc7XG5cdFx0fVxuXG5cdFx0dmFyIGJyaWdodG5lc3MgPSBNYXRoLmZsb29yKGNvbG9yU3VtIC8gKHRoaXMud2lkdGgqdGhpcy5oZWlnaHQpKTtcblx0XHRjYWxsYmFjayhicmlnaHRuZXNzKTtcblx0fTtcbn1cblxuXG4vLyBSZXNpemUgSW1hZ2UgVG8gRmlsbCBDb250YWluZXIgU2l6ZVxuZnVuY3Rpb24gaW1hZ2VDb3Zlcihjb250LCB0eXBlLCBjb3JySCkge1xuXHR0eXBlID0gdHlwZSB8fCAnYmcnO1xuXG5cdGNvbnQuYWRkQ2xhc3MoJ2ltYWdlLWNvdmVyJyk7XG5cblx0dmFyIGltZywgaW1nVXJsLCBpbWdXaWR0aCA9IDAsIGltZ0hlaWdodCA9IDA7XG5cblx0aWYgKCB0eXBlID09ICdpbWcnICkge1xuXHRcdGltZyA9IGNvbnQuZmluZCgnLmJnLWltZycpO1xuXHRcdGltZ1dpZHRoICA9IGltZy53aWR0aCgpO1xuXHRcdGltZ0hlaWdodCA9IGltZy5oZWlnaHQoKTtcblx0fSBlbHNlIHtcblx0XHRpbWdVcmwgPSBjb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLm1hdGNoKC9edXJsXFwoXCI/KC4rPylcIj9cXCkkLyk7XG5cdFx0aWYgKCBpbWdVcmxbMV0gKSB7XG5cdFx0ICAgIGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdCAgICBpbWcuc3JjID0gaW1nVXJsWzFdO1xuXHRcdCAgICBpbWdXaWR0aCAgPSBpbWcud2lkdGg7XG5cdFx0ICAgIGltZ0hlaWdodCA9IGltZy5oZWlnaHQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCBpbWdXaWR0aCAhPT0gMCAmJiBpbWdIZWlnaHQgIT09IDAgKSB7XG5cdFx0dmFyIGNvbnRXaWR0aCAgPSBjb250Lm91dGVyV2lkdGgoKSxcblx0XHRcdGNvbnRIZWlnaHQgPSBjb250Lm91dGVySGVpZ2h0KCksXG5cdFx0XHRoZWlnaHREaWZmID0gY29udFdpZHRoIC8gaW1nV2lkdGggKiBpbWdIZWlnaHQsXG5cdFx0XHRuZXdXaWR0aCAgID0gJ2F1dG8nLFxuXHRcdFx0bmV3SGVpZ2h0ICA9IGNvbnRIZWlnaHQgKyBjb3JySCArICdweCc7XG5cblx0XHRcdGlmICggaGVpZ2h0RGlmZiA+IGNvbnRIZWlnaHQgKSB7XG5cdFx0XHRcdG5ld1dpZHRoICA9ICcxMDAlJztcblx0XHRcdFx0bmV3SGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0fVxuXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICkge1xuXHRcdFx0aW1nLmNzcyh7IHdpZHRoOiBuZXdXaWR0aCwgaGVpZ2h0OiBuZXdIZWlnaHQgfSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnQuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBuZXdXaWR0aCArICcgJyArIG5ld0hlaWdodCk7XG5cdFx0fVxuXHR9XG59XG5cblxuLy8gRGV0ZXJtaW5lIElmIEFuIEVsZW1lbnQgSXMgU2Nyb2xsZWQgSW50byBWaWV3XG5mdW5jdGlvbiBlbGVtVmlzaWJsZShlbGVtLCBjb250KSB7XG5cdHZhciBjb250VG9wID0gY29udC5zY3JvbGxUb3AoKSxcblx0XHRjb250QnRtID0gY29udFRvcCArIGNvbnQuaGVpZ2h0KCksXG5cdFx0ZWxlbVRvcCA9IGVsZW0ub2Zmc2V0KCkudG9wLFxuXHRcdGVsZW1CdG0gPSBlbGVtVG9wICsgZWxlbS5oZWlnaHQoKTtcblxuXHRyZXR1cm4gKChlbGVtQnRtIDw9IGNvbnRCdG0pICYmIChlbGVtVG9wID49IGNvbnRUb3ApKTtcbn1cblxuXG4oIGZ1bmN0aW9uKCQpIHtcblx0Ly8gRml4IFdQTUwgRHJvcGRvd25cblx0JCgnLm1lbnUtaXRlbS1sYW5ndWFnZScpLmFkZENsYXNzKCdkcm9wZG93biBkcm9wLW1lbnUnKS5maW5kKCcuc3ViLW1lbnUnKS5hZGRDbGFzcygnZHJvcGRvd24tbWVudScpO1xuXG5cdC8vIEZpeCBQb2x5TGFuZyBNZW51IEl0ZW1zIEFuZCBNYWtlIFRoZW0gRHJvcGRvd25cblx0JCgnLm1lbnUtaXRlbS5sYW5nLWl0ZW0nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXHR2YXIgaXRlbSA9ICQoJy5sYW5nLWl0ZW0uY3VycmVudC1sYW5nJyk7XG5cdGlmIChpdGVtLmxlbmd0aCA9PT0gMCkge1xuXHRcdGl0ZW0gPSAkKCcubGFuZy1pdGVtJykuZmlyc3QoKTtcblx0fVxuXHR2YXIgbGFuZ3MgPSBpdGVtLnNpYmxpbmdzKCcubGFuZy1pdGVtJyk7XG5cdGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duIGRyb3AtbWVudScpO1xuXHRsYW5ncy53cmFwQWxsKCc8dWwgY2xhc3M9XCJzdWItbWVudSBkcm9wZG93bi1tZW51XCI+PC91bD4nKS5wYXJlbnQoKS5hcHBlbmRUbyhpdGVtKTtcbn0pKGpRdWVyeSk7IiwiLyohIG1vZGVybml6ciAzLjAuMC1hbHBoYS40IChDdXN0b20gQnVpbGQpIHwgTUlUICpcbiAqIGh0dHA6Ly9tb2Rlcm5penIuY29tL2Rvd25sb2FkLyMtZmxleGJveC1zaGl2ICEqL1xuIWZ1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKGUsdCl7cmV0dXJuIHR5cGVvZiBlPT09dH1mdW5jdGlvbiBvKCl7dmFyIGUsdCxuLG8sYSxpLHM7Zm9yKHZhciBsIGluIEMpe2lmKGU9W10sdD1DW2xdLHQubmFtZSYmKGUucHVzaCh0Lm5hbWUudG9Mb3dlckNhc2UoKSksdC5vcHRpb25zJiZ0Lm9wdGlvbnMuYWxpYXNlcyYmdC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSlmb3Iobj0wO248dC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoO24rKyllLnB1c2godC5vcHRpb25zLmFsaWFzZXNbbl0udG9Mb3dlckNhc2UoKSk7Zm9yKG89cih0LmZuLFwiZnVuY3Rpb25cIik/dC5mbigpOnQuZm4sYT0wO2E8ZS5sZW5ndGg7YSsrKWk9ZVthXSxzPWkuc3BsaXQoXCIuXCIpLDE9PT1zLmxlbmd0aD9Nb2Rlcm5penJbc1swXV09bzooIU1vZGVybml6cltzWzBdXXx8TW9kZXJuaXpyW3NbMF1daW5zdGFuY2VvZiBCb29sZWFufHwoTW9kZXJuaXpyW3NbMF1dPW5ldyBCb29sZWFuKE1vZGVybml6cltzWzBdXSkpLE1vZGVybml6cltzWzBdXVtzWzFdXT1vKSx5LnB1c2goKG8/XCJcIjpcIm5vLVwiKStzLmpvaW4oXCItXCIpKX19ZnVuY3Rpb24gYShlKXt2YXIgdD1TLmNsYXNzTmFtZSxuPU1vZGVybml6ci5fY29uZmlnLmNsYXNzUHJlZml4fHxcIlwiO2lmKGImJih0PXQuYmFzZVZhbCksTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlSlNDbGFzcyl7dmFyIHI9bmV3IFJlZ0V4cChcIihefFxcXFxzKVwiK24rXCJuby1qcyhcXFxcc3wkKVwiKTt0PXQucmVwbGFjZShyLFwiJDFcIituK1wianMkMlwiKX1Nb2Rlcm5penIuX2NvbmZpZy5lbmFibGVDbGFzc2VzJiYodCs9XCIgXCIrbitlLmpvaW4oXCIgXCIrbiksYj9TLmNsYXNzTmFtZS5iYXNlVmFsPXQ6Uy5jbGFzc05hbWU9dCl9ZnVuY3Rpb24gaShlLHQpe3JldHVybiEhfihcIlwiK2UpLmluZGV4T2YodCl9ZnVuY3Rpb24gcygpe3JldHVyblwiZnVuY3Rpb25cIiE9dHlwZW9mIHQuY3JlYXRlRWxlbWVudD90LmNyZWF0ZUVsZW1lbnQoYXJndW1lbnRzWzBdKTpiP3QuY3JlYXRlRWxlbWVudE5TLmNhbGwodCxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsYXJndW1lbnRzWzBdKTp0LmNyZWF0ZUVsZW1lbnQuYXBwbHkodCxhcmd1bWVudHMpfWZ1bmN0aW9uIGwoZSl7cmV0dXJuIGUucmVwbGFjZSgvKFthLXpdKS0oW2Etel0pL2csZnVuY3Rpb24oZSx0LG4pe3JldHVybiB0K24udG9VcHBlckNhc2UoKX0pLnJlcGxhY2UoL14tLyxcIlwiKX1mdW5jdGlvbiBjKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUuYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiB1KGUsdCxuKXt2YXIgbztmb3IodmFyIGEgaW4gZSlpZihlW2FdaW4gdClyZXR1cm4gbj09PSExP2VbYV06KG89dFtlW2FdXSxyKG8sXCJmdW5jdGlvblwiKT9jKG8sbnx8dCk6byk7cmV0dXJuITF9ZnVuY3Rpb24gZihlKXtyZXR1cm4gZS5yZXBsYWNlKC8oW0EtWl0pL2csZnVuY3Rpb24oZSx0KXtyZXR1cm5cIi1cIit0LnRvTG93ZXJDYXNlKCl9KS5yZXBsYWNlKC9ebXMtLyxcIi1tcy1cIil9ZnVuY3Rpb24gZCgpe3ZhciBlPXQuYm9keTtyZXR1cm4gZXx8KGU9cyhiP1wic3ZnXCI6XCJib2R5XCIpLGUuZmFrZT0hMCksZX1mdW5jdGlvbiBwKGUsbixyLG8pe3ZhciBhLGksbCxjLHU9XCJtb2Rlcm5penJcIixmPXMoXCJkaXZcIikscD1kKCk7aWYocGFyc2VJbnQociwxMCkpZm9yKDtyLS07KWw9cyhcImRpdlwiKSxsLmlkPW8/b1tyXTp1KyhyKzEpLGYuYXBwZW5kQ2hpbGQobCk7cmV0dXJuIGE9cyhcInN0eWxlXCIpLGEudHlwZT1cInRleHQvY3NzXCIsYS5pZD1cInNcIit1LChwLmZha2U/cDpmKS5hcHBlbmRDaGlsZChhKSxwLmFwcGVuZENoaWxkKGYpLGEuc3R5bGVTaGVldD9hLnN0eWxlU2hlZXQuY3NzVGV4dD1lOmEuYXBwZW5kQ2hpbGQodC5jcmVhdGVUZXh0Tm9kZShlKSksZi5pZD11LHAuZmFrZSYmKHAuc3R5bGUuYmFja2dyb3VuZD1cIlwiLHAuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixjPVMuc3R5bGUub3ZlcmZsb3csUy5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLFMuYXBwZW5kQ2hpbGQocCkpLGk9bihmLGUpLHAuZmFrZT8ocC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHApLFMuc3R5bGUub3ZlcmZsb3c9YyxTLm9mZnNldEhlaWdodCk6Zi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGYpLCEhaX1mdW5jdGlvbiBtKHQscil7dmFyIG89dC5sZW5ndGg7aWYoXCJDU1NcImluIGUmJlwic3VwcG9ydHNcImluIGUuQ1NTKXtmb3IoO28tLTspaWYoZS5DU1Muc3VwcG9ydHMoZih0W29dKSxyKSlyZXR1cm4hMDtyZXR1cm4hMX1pZihcIkNTU1N1cHBvcnRzUnVsZVwiaW4gZSl7Zm9yKHZhciBhPVtdO28tLTspYS5wdXNoKFwiKFwiK2YodFtvXSkrXCI6XCIrcitcIilcIik7cmV0dXJuIGE9YS5qb2luKFwiIG9yIFwiKSxwKFwiQHN1cHBvcnRzIChcIithK1wiKSB7ICNtb2Rlcm5penIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfVwiLGZ1bmN0aW9uKGUpe3JldHVyblwiYWJzb2x1dGVcIj09Z2V0Q29tcHV0ZWRTdHlsZShlLG51bGwpLnBvc2l0aW9ufSl9cmV0dXJuIG59ZnVuY3Rpb24gaChlLHQsbyxhKXtmdW5jdGlvbiBjKCl7ZiYmKGRlbGV0ZSBqLnN0eWxlLGRlbGV0ZSBqLm1vZEVsZW0pfWlmKGE9cihhLFwidW5kZWZpbmVkXCIpPyExOmEsIXIobyxcInVuZGVmaW5lZFwiKSl7dmFyIHU9bShlLG8pO2lmKCFyKHUsXCJ1bmRlZmluZWRcIikpcmV0dXJuIHV9Zm9yKHZhciBmLGQscCxoLGcsdj1bXCJtb2Rlcm5penJcIixcInRzcGFuXCJdOyFqLnN0eWxlOylmPSEwLGoubW9kRWxlbT1zKHYuc2hpZnQoKSksai5zdHlsZT1qLm1vZEVsZW0uc3R5bGU7Zm9yKHA9ZS5sZW5ndGgsZD0wO3A+ZDtkKyspaWYoaD1lW2RdLGc9ai5zdHlsZVtoXSxpKGgsXCItXCIpJiYoaD1sKGgpKSxqLnN0eWxlW2hdIT09bil7aWYoYXx8cihvLFwidW5kZWZpbmVkXCIpKXJldHVybiBjKCksXCJwZnhcIj09dD9oOiEwO3RyeXtqLnN0eWxlW2hdPW99Y2F0Y2goeSl7fWlmKGouc3R5bGVbaF0hPWcpcmV0dXJuIGMoKSxcInBmeFwiPT10P2g6ITB9cmV0dXJuIGMoKSwhMX1mdW5jdGlvbiBnKGUsdCxuLG8sYSl7dmFyIGk9ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStlLnNsaWNlKDEpLHM9KGUrXCIgXCIrdy5qb2luKGkrXCIgXCIpK2kpLnNwbGl0KFwiIFwiKTtyZXR1cm4gcih0LFwic3RyaW5nXCIpfHxyKHQsXCJ1bmRlZmluZWRcIik/aChzLHQsbyxhKToocz0oZStcIiBcIitfLmpvaW4oaStcIiBcIikraSkuc3BsaXQoXCIgXCIpLHUocyx0LG4pKX1mdW5jdGlvbiB2KGUsdCxyKXtyZXR1cm4gZyhlLG4sbix0LHIpfXZhciB5PVtdLEM9W10sRT17X3ZlcnNpb246XCIzLjAuMC1hbHBoYS40XCIsX2NvbmZpZzp7Y2xhc3NQcmVmaXg6XCJcIixlbmFibGVDbGFzc2VzOiEwLGVuYWJsZUpTQ2xhc3M6ITAsdXNlUHJlZml4ZXM6ITB9LF9xOltdLG9uOmZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dChuW2VdKX0sMCl9LGFkZFRlc3Q6ZnVuY3Rpb24oZSx0LG4pe0MucHVzaCh7bmFtZTplLGZuOnQsb3B0aW9uczpufSl9LGFkZEFzeW5jVGVzdDpmdW5jdGlvbihlKXtDLnB1c2goe25hbWU6bnVsbCxmbjplfSl9fSxNb2Rlcm5penI9ZnVuY3Rpb24oKXt9O01vZGVybml6ci5wcm90b3R5cGU9RSxNb2Rlcm5penI9bmV3IE1vZGVybml6cjt2YXIgUz10LmRvY3VtZW50RWxlbWVudCxiPVwic3ZnXCI9PT1TLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7Ynx8IWZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbihlLHQpe3ZhciBuPWUuY3JlYXRlRWxlbWVudChcInBcIikscj1lLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXXx8ZS5kb2N1bWVudEVsZW1lbnQ7cmV0dXJuIG4uaW5uZXJIVE1MPVwieDxzdHlsZT5cIit0K1wiPC9zdHlsZT5cIixyLmluc2VydEJlZm9yZShuLmxhc3RDaGlsZCxyLmZpcnN0Q2hpbGQpfWZ1bmN0aW9uIHIoKXt2YXIgZT1DLmVsZW1lbnRzO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlP2Uuc3BsaXQoXCIgXCIpOmV9ZnVuY3Rpb24gbyhlLHQpe3ZhciBuPUMuZWxlbWVudHM7XCJzdHJpbmdcIiE9dHlwZW9mIG4mJihuPW4uam9pbihcIiBcIikpLFwic3RyaW5nXCIhPXR5cGVvZiBlJiYoZT1lLmpvaW4oXCIgXCIpKSxDLmVsZW1lbnRzPW4rXCIgXCIrZSxjKHQpfWZ1bmN0aW9uIGEoZSl7dmFyIHQ9eVtlW2ddXTtyZXR1cm4gdHx8KHQ9e30sdisrLGVbZ109dix5W3ZdPXQpLHR9ZnVuY3Rpb24gaShlLG4scil7aWYobnx8KG49dCksZilyZXR1cm4gbi5jcmVhdGVFbGVtZW50KGUpO3J8fChyPWEobikpO3ZhciBvO3JldHVybiBvPXIuY2FjaGVbZV0/ci5jYWNoZVtlXS5jbG9uZU5vZGUoKTpoLnRlc3QoZSk/KHIuY2FjaGVbZV09ci5jcmVhdGVFbGVtKGUpKS5jbG9uZU5vZGUoKTpyLmNyZWF0ZUVsZW0oZSksIW8uY2FuSGF2ZUNoaWxkcmVufHxtLnRlc3QoZSl8fG8udGFnVXJuP286ci5mcmFnLmFwcGVuZENoaWxkKG8pfWZ1bmN0aW9uIHMoZSxuKXtpZihlfHwoZT10KSxmKXJldHVybiBlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtuPW58fGEoZSk7Zm9yKHZhciBvPW4uZnJhZy5jbG9uZU5vZGUoKSxpPTAscz1yKCksbD1zLmxlbmd0aDtsPmk7aSsrKW8uY3JlYXRlRWxlbWVudChzW2ldKTtyZXR1cm4gb31mdW5jdGlvbiBsKGUsdCl7dC5jYWNoZXx8KHQuY2FjaGU9e30sdC5jcmVhdGVFbGVtPWUuY3JlYXRlRWxlbWVudCx0LmNyZWF0ZUZyYWc9ZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50LHQuZnJhZz10LmNyZWF0ZUZyYWcoKSksZS5jcmVhdGVFbGVtZW50PWZ1bmN0aW9uKG4pe3JldHVybiBDLnNoaXZNZXRob2RzP2kobixlLHQpOnQuY3JlYXRlRWxlbShuKX0sZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50PUZ1bmN0aW9uKFwiaCxmXCIsXCJyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1mLmNsb25lTm9kZSgpLGM9bi5jcmVhdGVFbGVtZW50O2guc2hpdk1ldGhvZHMmJihcIityKCkuam9pbigpLnJlcGxhY2UoL1tcXHdcXC06XSsvZyxmdW5jdGlvbihlKXtyZXR1cm4gdC5jcmVhdGVFbGVtKGUpLHQuZnJhZy5jcmVhdGVFbGVtZW50KGUpLCdjKFwiJytlKydcIiknfSkrXCIpO3JldHVybiBufVwiKShDLHQuZnJhZyl9ZnVuY3Rpb24gYyhlKXtlfHwoZT10KTt2YXIgcj1hKGUpO3JldHVybiFDLnNoaXZDU1N8fHV8fHIuaGFzQ1NTfHwoci5oYXNDU1M9ISFuKGUsXCJhcnRpY2xlLGFzaWRlLGRpYWxvZyxmaWdjYXB0aW9uLGZpZ3VyZSxmb290ZXIsaGVhZGVyLGhncm91cCxtYWluLG5hdixzZWN0aW9ue2Rpc3BsYXk6YmxvY2t9bWFya3tiYWNrZ3JvdW5kOiNGRjA7Y29sb3I6IzAwMH10ZW1wbGF0ZXtkaXNwbGF5Om5vbmV9XCIpKSxmfHxsKGUsciksZX12YXIgdSxmLGQ9XCIzLjcuMlwiLHA9ZS5odG1sNXx8e30sbT0vXjx8Xig/OmJ1dHRvbnxtYXB8c2VsZWN0fHRleHRhcmVhfG9iamVjdHxpZnJhbWV8b3B0aW9ufG9wdGdyb3VwKSQvaSxoPS9eKD86YXxifGNvZGV8ZGl2fGZpZWxkc2V0fGgxfGgyfGgzfGg0fGg1fGg2fGl8bGFiZWx8bGl8b2x8cHxxfHNwYW58c3Ryb25nfHN0eWxlfHRhYmxlfHRib2R5fHRkfHRofHRyfHVsKSQvaSxnPVwiX2h0bWw1c2hpdlwiLHY9MCx5PXt9OyFmdW5jdGlvbigpe3RyeXt2YXIgZT10LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2UuaW5uZXJIVE1MPVwiPHh5ej48L3h5ej5cIix1PVwiaGlkZGVuXCJpbiBlLGY9MT09ZS5jaGlsZE5vZGVzLmxlbmd0aHx8ZnVuY3Rpb24oKXt0LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO3ZhciBlPXQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmNsb25lTm9kZXx8XCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudHx8XCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY3JlYXRlRWxlbWVudH0oKX1jYXRjaChuKXt1PSEwLGY9ITB9fSgpO3ZhciBDPXtlbGVtZW50czpwLmVsZW1lbnRzfHxcImFiYnIgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiZGkgY2FudmFzIGRhdGEgZGF0YWxpc3QgZGV0YWlscyBkaWFsb2cgZmlnY2FwdGlvbiBmaWd1cmUgZm9vdGVyIGhlYWRlciBoZ3JvdXAgbWFpbiBtYXJrIG1ldGVyIG5hdiBvdXRwdXQgcGljdHVyZSBwcm9ncmVzcyBzZWN0aW9uIHN1bW1hcnkgdGVtcGxhdGUgdGltZSB2aWRlb1wiLHZlcnNpb246ZCxzaGl2Q1NTOnAuc2hpdkNTUyE9PSExLHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzOmYsc2hpdk1ldGhvZHM6cC5zaGl2TWV0aG9kcyE9PSExLHR5cGU6XCJkZWZhdWx0XCIsc2hpdkRvY3VtZW50OmMsY3JlYXRlRWxlbWVudDppLGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6cyxhZGRFbGVtZW50czpvfTtlLmh0bWw1PUMsYyh0KX0odGhpcyx0KTt2YXIgeD1cIk1veiBPIG1zIFdlYmtpdFwiLHc9RS5fY29uZmlnLnVzZVByZWZpeGVzP3guc3BsaXQoXCIgXCIpOltdO0UuX2Nzc29tUHJlZml4ZXM9dzt2YXIgXz1FLl9jb25maWcudXNlUHJlZml4ZXM/eC50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKTpbXTtFLl9kb21QcmVmaXhlcz1fO3ZhciBOPXtlbGVtOnMoXCJtb2Rlcm5penJcIil9O01vZGVybml6ci5fcS5wdXNoKGZ1bmN0aW9uKCl7ZGVsZXRlIE4uZWxlbX0pO3ZhciBqPXtzdHlsZTpOLmVsZW0uc3R5bGV9O01vZGVybml6ci5fcS51bnNoaWZ0KGZ1bmN0aW9uKCl7ZGVsZXRlIGouc3R5bGV9KSxFLnRlc3RBbGxQcm9wcz1nLEUudGVzdEFsbFByb3BzPXYsTW9kZXJuaXpyLmFkZFRlc3QoXCJmbGV4Ym94XCIsdihcImZsZXhCYXNpc1wiLFwiMXB4XCIsITApKSxvKCksYSh5KSxkZWxldGUgRS5hZGRUZXN0LGRlbGV0ZSBFLmFkZEFzeW5jVGVzdDtmb3IodmFyIGs9MDtrPE1vZGVybml6ci5fcS5sZW5ndGg7aysrKU1vZGVybml6ci5fcVtrXSgpO2UuTW9kZXJuaXpyPU1vZGVybml6cn0od2luZG93LGRvY3VtZW50KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5FTEVNRU5UIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KTtcblxuXG5cdC8vIEVsZW1lbnQgQW5pbWF0aW9uc1xuXHRmdW5jdGlvbiBtaXh0QW5pbWF0aW9ucygpIHtcblx0XHR2YXIgYW5pbUVsZW1zID0gJCgnLm1peHQtYW5pbWF0ZScpO1xuXG5cdFx0aWYgKCBhbmltRWxlbXMubGVuZ3RoID09PSAwICkgeyByZXR1cm47IH1cblxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi53YXlwb2ludCA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGFuaW1FbGVtcy53YXlwb2ludCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltLXByZScpLmFkZENsYXNzKCdhbmltLXN0YXJ0Jyk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICc4NSUnLFxuXHRcdFx0XHRcdFx0dHJpZ2dlck9uY2U6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgMTAwMCApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdG1peHRBbmltYXRpb25zKCk7XG5cblxuXHQvLyBTdGF0IC8gQ291bnRlciBFbGVtZW50XG5cdGZ1bmN0aW9uIG1peHRTdGF0cygpIHtcblx0XHR2YXIgc3RhdEVsZW1zID0gJCgnLm1peHQtc3RhdCcpO1xuXG5cdFx0aWYgKCBzdGF0RWxlbXMubGVuZ3RoID09PSAwICkgeyByZXR1cm47IH1cblxuXHRcdC8vIFNldCBzdGF0IHRleHQgdG8gc3RhcnRpbmcgKGZyb20pIHZhbHVlXG5cdFx0c3RhdEVsZW1zLmZpbmQoJy5zdGF0LXZhbHVlJykuZWFjaCggZnVuY3Rpb24oKSB7ICQodGhpcykudGV4dCgkKHRoaXMpLmRhdGEoJ2Zyb20nKSk7IH0pO1xuXG5cdFx0Ly8gQW5pbWF0ZSB2YWx1ZVxuXHRcdGZ1bmN0aW9uIHN0YXRWYWx1ZShlbCkge1xuXHRcdFx0dmFyIGZyb20gID0gZWwuZGF0YSgnZnJvbScpLFxuXHRcdFx0XHR0byAgICA9IGVsLmRhdGEoJ3RvJyksXG5cdFx0XHRcdHNwZWVkID0gZWwuZGF0YSgnc3BlZWQnKTtcblx0XHRcdCQoe3ZhbHVlOiBmcm9tfSkuYW5pbWF0ZSh7dmFsdWU6IHRvfSwge1xuXHRcdFx0XHRkdXJhdGlvbjogc3BlZWQsXG5cdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KE1hdGgucm91bmQodGhpcy52YWx1ZSkpOyB9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkgeyBlbC50ZXh0KHRvKTsgfVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVuZGVyIENpcmNsZVxuXHRcdGZ1bmN0aW9uIHN0YXRDaXJjbGUoc3RhdCkge1xuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5jaXJjbGVQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0c3RhdC5jaGlsZHJlbignLnN0YXQtY2lyY2xlJykuY2lyY2xlUHJvZ3Jlc3MoeyBzaXplOiA1MDAsIGxpbmVDYXA6ICdyb3VuZCcgfSkuY2hpbGRyZW4oJy5jaXJjbGUtaW5uZXInKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmNzcygnbWFyZ2luLXRvcCcsICQodGhpcykuaGVpZ2h0KCkgLyAtMik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZpZXdwb3J0LmxvYWQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0c3RhdEVsZW1zLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc3RhdCA9ICQodGhpcyk7XG5cdFx0XHRcdGlmICggdHlwZW9mICQuZm4ud2F5cG9pbnQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0c3RhdC53YXlwb2ludCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzdGF0VmFsdWUoc3RhdC5maW5kKCcuc3RhdC12YWx1ZScpKTtcblx0XHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicgKSB0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRvZmZzZXQ6ICdib3R0b20taW4tdmlldycsXG5cdFx0XHRcdFx0XHR0cmlnZ2VyT25jZTogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRWYWx1ZShzdGF0LmZpbmQoJy5zdGF0LXZhbHVlJykpO1xuXHRcdFx0XHRcdHN0YXRDaXJjbGUoc3RhdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdG1peHRTdGF0cygpO1xuXG5cblx0Ly8gRmxpcCBDYXJkIEVxdWFsaXplIEhlaWdodFxuXHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdHZhciBmbGlwY2FyZFNpZGVzID0gJCgnLmZsaXAtY2FyZCAuZnJvbnQsIC5mbGlwLWNhcmQgLmJhY2snKTtcblx0XHRmbGlwY2FyZFNpZGVzLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRmbGlwY2FyZFNpZGVzLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblx0XHR9KTtcblx0fVxuXHQvLyBGbGlwIENhcmQgVG91Y2ggU2NyZWVuIFwiSG92ZXJcIlxuXHQkKCcubWl4dC1mbGlwY2FyZCcpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXInKTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVBREVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xuXG5cdHZhciB2aWV3cG9ydCAgPSAkKHdpbmRvdyksXG5cdFx0bWFpbk5hdkJhciA9ICQoJyNtYWluLW5hdicpLFxuXHRcdG1lZGlhV3JhcCA9ICQoJy5oZWFkLW1lZGlhJyk7XG5cblx0Ly8gSGVhZCBNZWRpYSBGdW5jdGlvbnNcblx0ZnVuY3Rpb24gaGVhZGVyRm4oKSB7XG5cdFx0dmFyIGNvbnRhaW5lciAgICA9IG1lZGlhV3JhcC5jaGlsZHJlbignLmNvbnRhaW5lcicpLFxuXHRcdFx0bWVkaWFDb250ICAgID0gbWVkaWFXcmFwLmNoaWxkcmVuKCcubWVkaWEtY29udGFpbmVyJyksXG5cdFx0XHR0b3BOYXZIZWlnaHQgPSBtYWluTmF2QmFyLm91dGVySGVpZ2h0KCksXG5cdFx0XHR3cmFwSGVpZ2h0ICAgPSBtZWRpYVdyYXAuaGVpZ2h0KCksXG5cdFx0XHRobUhlaWdodCAgICAgPSAwO1xuXG5cdFx0aWYgKCBtaXh0X29wdC5oZWFkZXIuZnVsbHNjcmVlbiApIHtcblx0XHRcdG1lZGlhV3JhcC5jc3MoJ2hlaWdodCcsIHdyYXBIZWlnaHQpO1xuXHRcdFx0XG5cdFx0XHRobUhlaWdodCA9IHZpZXdwb3J0LmhlaWdodCgpIC0gbWVkaWFXcmFwLm9mZnNldCgpLnRvcDtcblxuXHRcdFx0aWYgKCBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyAmJiAhIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCApIHsgaG1IZWlnaHQgLT0gdG9wTmF2SGVpZ2h0OyB9XG5cblx0XHRcdG1lZGlhV3JhcC5jc3MoJ2hlaWdodCcsIGhtSGVpZ2h0KTtcblx0XHRcdG1lZGlhQ29udC5jc3MoJ2hlaWdodCcsIGhtSGVpZ2h0KTtcblx0XHR9XG5cblx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtZWRpYUNvbnQubGVuZ3RoID09IDEgKSB7XG5cdFx0XHR2YXIgY29udGFpbmVyUGFkID0gdG9wTmF2SGVpZ2h0O1xuXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xuXHRcdFx0XHRjb250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScsIGNvbnRhaW5lclBhZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb250YWluZXIuY3NzKCdwYWRkaW5nLXRvcCcsIGNvbnRhaW5lclBhZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gSGVhZGVyIFNjcm9sbCBUbyBDb250ZW50XG5cdGZ1bmN0aW9uIGhlYWRlclNjcm9sbCgpIHtcblx0XHR2YXIgcGFnZSAgID0gJCgnaHRtbCwgYm9keScpLFxuXHRcdFx0b2Zmc2V0ID0gJCgnI2NvbnRlbnQtd3JhcCcpLm9mZnNldCgpLnRvcDtcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7IG9mZnNldCAtPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJykuaGVpZ2h0KCk7IH1cblx0XHQkKCcuaGVhZGVyLXNjcm9sbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cGFnZS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSwgODAwKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggbWl4dF9vcHQuaGVhZGVyLmVuYWJsZWQgKSB7XG5cdFx0aGVhZGVyRm4oKTtcblxuXHRcdGlmICggbWl4dF9vcHQuaGVhZGVyLnNjcm9sbCApIHsgaGVhZGVyU2Nyb2xsKCk7IH1cblx0XHRcblx0XHQkKHdpbmRvdykucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGhlYWRlckZuICkpO1xuXHR9XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuSEVMUEVSIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIFNraXAgTGluayBGb2N1cyBGaXhcblx0XG5cdHZhciBpc193ZWJraXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ3dlYmtpdCcgKSA+IC0xLFxuXHRcdGlzX29wZXJhICA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICkgID4gLTEsXG5cdFx0aXNfaWUgICAgID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApICAgPiAtMTtcblxuXHRpZiAoICggaXNfd2Via2l0IHx8IGlzX29wZXJhIHx8IGlzX2llICkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKSApIHtcblx0XHR2YXIgZXZlbnRNZXRob2QgPSAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnO1xuXHRcdHdpbmRvd1sgZXZlbnRNZXRob2QgXSggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICkgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWF8ZGl2KSQvaS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEFwcGx5IEJvb3RzdHJhcCBDbGFzc2VzXG5cdFxuXHR2YXIgd29vQ29tbVdyYXAgPSAkKCcud29vY29tbWVyY2UnKTtcblx0XG5cdHZhciB3aWRnZXROYXZNZW51cyA9ICcud2lkZ2V0X21ldGEsIC53aWRnZXRfcmVjZW50X2VudHJpZXMsIC53aWRnZXRfYXJjaGl2ZSwgLndpZGdldF9jYXRlZ29yaWVzLCAud2lkZ2V0X25hdl9tZW51LCAud2lkZ2V0X3BhZ2VzLCAud2lkZ2V0X3Jzcyc7XG5cblx0Ly8gV29vQ29tbWVyY2UgV2lkZ2V0cyAmIEVsZW1lbnRzXG5cdGlmICggd29vQ29tbVdyYXAubGVuZ3RoICkge1xuXHRcdHdpZGdldE5hdk1lbnVzICs9ICcsIC53aWRnZXRfcHJvZHVjdF9jYXRlZ29yaWVzLCAud2lkZ2V0X3Byb2R1Y3RzLCAud2lkZ2V0X3RvcF9yYXRlZF9wcm9kdWN0cywgLndpZGdldF9yZWNlbnRfcmV2aWV3cywgLndpZGdldF9yZWNlbnRseV92aWV3ZWRfcHJvZHVjdHMsIC53aWRnZXRfbGF5ZXJlZF9uYXYnO1xuXG5cdFx0d29vQ29tbVdyYXAuZmluZCgnLnNob3BfdGFibGUnKS5hZGRDbGFzcygndGFibGUgdGFibGUtYm9yZGVyZWQnKTtcblxuXHRcdCQoZG9jdW1lbnQuYm9keSkub24oJ3VwZGF0ZWRfY2hlY2tvdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5zaG9wX3RhYmxlJykuYWRkQ2xhc3MoJ3RhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLXN0cmlwZWQnKTtcblx0XHR9KTtcblx0fVxuXG5cdCQod2lkZ2V0TmF2TWVudXMpLmNoaWxkcmVuKCd1bCcpLmFkZENsYXNzKCduYXYnKTtcblx0JCgnLndpZGdldF9uYXZfbWVudSB1bC5tZW51JykuYWRkQ2xhc3MoJ25hdicpO1xuXG5cdCQoJyN3cC1jYWxlbmRhcicpLmFkZENsYXNzKCd0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkJyk7XG5cblx0Ly8gSGFuZGxlIFBvc3QgQ291bnQgVGFnc1xuXG5cdCQoJy53aWRnZXRfYXJjaGl2ZSBsaSwgLndpZGdldF9jYXRlZ29yaWVzIGxpJykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzICAgICA9ICQodGhpcyksXG5cdFx0XHRjaGlsZHJlbiAgPSAkdGhpcy5jaGlsZHJlbigpLFxuXHRcdFx0YW5jaG9yICAgID0gY2hpbGRyZW4uZmlsdGVyKCdhJyksXG5cdFx0XHRjb250ZW50cyAgPSAkdGhpcy5jb250ZW50cygpLFxuXHRcdFx0Y291bnRUZXh0ID0gY29udGVudHMubm90KGNoaWxkcmVuKS50ZXh0KCk7XG5cblx0XHRpZiAoIGNvdW50VGV4dCAhPT0gJycgKSB7XG5cdFx0XHRhbmNob3IuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInBvc3QtY291bnRcIj4nICsgY291bnRUZXh0ICsgJzwvc3Bhbj4nKTtcblx0XHRcdGNvbnRlbnRzLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVUeXBlID09PSAzOyBcblx0XHRcdH0pLnJlbW92ZSgpO1xuXHRcdH1cblx0fSk7XG5cblx0JCgnLndpZGdldF9sYXllcmVkX25hdiBsaScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRjb3VudCA9ICR0aGlzLmNoaWxkcmVuKCcuY291bnQnKSxcblx0XHRcdGxpbmsgID0gJHRoaXMuY2hpbGRyZW4oJ2EnKTtcblx0XHRjb3VudC5hcHBlbmRUbyhsaW5rKTtcblx0fSk7XG5cblx0Ly8gR2FsbGVyeSBBcnJvdyBOYXZpZ2F0aW9uXG5cblx0JChkb2N1bWVudCkua2V5ZG93biggZnVuY3Rpb24oZSkge1xuXHRcdHZhciB1cmwgPSBmYWxzZTtcblx0XHRpZiAoIGUud2hpY2ggPT09IDM3ICkgeyAgLy8gTGVmdCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLnByZXZpb3VzLWltYWdlIGEnKS5hdHRyKCdocmVmJyk7XG5cdFx0fSBlbHNlIGlmICggZS53aGljaCA9PT0gMzkgKSB7ICAvLyBSaWdodCBhcnJvdyBrZXkgY29kZVxuXHRcdFx0dXJsID0gJCgnLmVudHJ5LWF0dGFjaG1lbnQgYScpLmF0dHIoJ2hyZWYnKTtcblx0XHR9XG5cdFx0aWYgKCB1cmwgJiYgKCAhJCgndGV4dGFyZWEsIGlucHV0JykuaXMoJzpmb2N1cycpICkgKSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmw7XG5cdFx0fVxuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5OQVZCQVIgRlVOQ1RJT05TXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIG1peHRfb3B0LCBjb2xvckxvRCwgY29sb3JUb1JnYmEgKi9cblxuXHR2YXIgdmlld3BvcnQgICAgID0gJCh3aW5kb3cpLFxuXHRcdGJvZHlFbCAgICAgICA9ICQoJ2JvZHknKSxcblx0XHRtYWluV3JhcCAgICAgPSAkKCcjbWFpbi13cmFwJyksXG5cdFx0bWFpbk5hdldyYXAgID0gJCgnI21haW4tbmF2LXdyYXAnKSxcblx0XHRtYWluTmF2QmFyICAgPSAkKCcjbWFpbi1uYXYnKSxcblx0XHRtYWluTmF2Q29udCAgPSBtYWluTmF2QmFyLmNoaWxkcmVuKCcuY29udGFpbmVyJyksXG5cdFx0bWFpbk5hdkhlYWQgID0gJCgnLm5hdmJhci1oZWFkZXInLCBtYWluTmF2QmFyKSxcblx0XHRtYWluTmF2SW5uZXIgPSAkKCcubmF2YmFyLWlubmVyJywgbWFpbk5hdkJhciksXG5cdFx0c2VjTmF2QmFyICAgID0gJCgnI3NlY29uZC1uYXYnKSxcblx0XHRzZWNOYXZDb250ICAgPSBzZWNOYXZCYXIuY2hpbGRyZW4oJy5jb250YWluZXInKSxcblx0XHRuYXZiYXJzICAgICAgPSAkKCcubmF2YmFyJyksXG5cdFx0bWVkaWFXcmFwICAgID0gJCgnLmhlYWQtbWVkaWEnKTtcblxuXHRpZiAoIG1haW5OYXZCYXIubGVuZ3RoID09PSAwICkgcmV0dXJuO1xuXG5cdHZhciBuYXZiYXJPYmogPSB7XG5cblx0XHRuYXZCZzogJycsXG5cdFx0bmF2QmdUb3A6ICcnLFxuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBOYXZiYXJcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKG5hdmJhcikge1xuXG5cdFx0XHR2YXIgYmdDb2xvciAgPSBuYXZiYXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyksXG5cdFx0XHRcdGRhdGFDb250ID0gbmF2YmFyLmZpbmQoJy5uYXZiYXItZGF0YScpLFxuXHRcdFx0XHRjb2xvckx1bSA9IGRhdGFDb250Lmxlbmd0aCA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGFDb250WzBdLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKS5yZXBsYWNlKC9cIi9nLCAnJykgOiAnJztcblxuXHRcdFx0aWYgKCBjb2xvckx1bSAhPSAnZGFyaycgJiYgY29sb3JMdW0gIT0gJ2xpZ2h0JyApIGNvbG9yTHVtID0gY29sb3JMb0QoYmdDb2xvcik7XG5cblx0XHRcdGlmICggbmF2YmFyLmlzKG1haW5OYXZCYXIpICkge1xuXG5cdFx0XHRcdG5hdmJhck9iai5uYXZCZyA9ICggY29sb3JMdW0gPT0gJ2RhcmsnICkgPyAnYmctZGFyaycgOiAnYmctbGlnaHQnO1xuXHRcdFx0XHRuYXZiYXIuYWRkQ2xhc3MobmF2YmFyT2JqLm5hdkJnKTtcblxuXHRcdFx0XHRtYWluTmF2QmFyLmF0dHIoJ2RhdGEtYmcnLCBjb2xvckx1bSk7XG5cblx0XHRcdFx0dmFyIGhlYWRDc3NTaGVldCA9ICQoJzxzdHlsZSBkYXRhLWlkPVwibWl4dC1uYXYtY3NzXCI+JykuYXBwZW5kVG8oJCgnaGVhZCcpKTtcblxuXHRcdFx0XHRoZWFkQ3NzU2hlZXQuYXBwZW5kKCcubmF2YmFyLm5hdmJhci1taXh0Om5vdCgucG9zaXRpb24tdG9wKTpub3QoLnZlcnRpY2FsKSB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JUb1JnYmEoYmdDb2xvciwgbWl4dF9vcHQubmF2Lm9wYWNpdHkpKyc7IH0nKTtcblxuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5oZWFkZXIuZW5hYmxlZCApIHtcblx0XHRcdFx0XHRoZWFkQ3NzU2hlZXQuYXBwZW5kKCcubmF2LXRyYW5zcGFyZW50IC5uYXZiYXIubmF2YmFyLW1peHQucG9zaXRpb24tdG9wIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvclRvUmdiYShiZ0NvbG9yLCBtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10pKyc7IH0nKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lZGlhV3JhcC5oYXNDbGFzcygnYmctZGFyaycpICkgeyBuYXZiYXJPYmoubmF2QmdUb3AgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBtZWRpYVdyYXAuaGFzQ2xhc3MoJ2JnLWxpZ2h0JykgKSB7IG5hdmJhck9iai5uYXZCZ1RvcCA9ICdiZy1saWdodCc7IH1cblx0XHRcdFx0XHRcdGVsc2UgeyBuYXZiYXJPYmoubmF2QmdUb3AgPSBuYXZiYXJPYmoubmF2Qmc7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmF2YmFyT2JqLm5hdkJnVG9wID0gbmF2YmFyT2JqLm5hdkJnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggbWl4dF9vcHQubmF2Lm1vZGUgPT0gJ3N0YXRpYycgKSB7XG5cdFx0XHRcdFx0bWFpbk5hdkJhci5yZW1vdmVDbGFzcyhuYXZiYXJPYmoubmF2QmcpLmFkZENsYXNzKG5hdmJhck9iai5uYXZCZ1RvcCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggY29sb3JMdW0gPT0gJ2RhcmsnICkge1xuXHRcdFx0XHRcdG5hdmJhci5hZGRDbGFzcygnYmctZGFyaycpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5hdmJhci5hZGRDbGFzcygnYmctbGlnaHQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bmF2YmFyLnJlbW92ZUNsYXNzKCdpbml0Jyk7XG5cdFx0fSxcblxuXHRcdC8vIFN0aWNreSAoZml4ZWQpIE5hdmJhciBGdW5jdGlvblxuXG5cdFx0c3RpY2t5TmF2OiBmdW5jdGlvbihpc01vYmlsZSkge1xuXG5cdFx0XHR2YXIgbmF2U2Nyb2xsSGFuZGxlciA9ICQudGhyb3R0bGUoIDUwLCBzdGlja3lOYXZUb2dnbGUgKSxcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiA9IDAsXG5cdFx0XHRcdG1haW5OYXZIZWlnaHQgICAgID0gMCxcblx0XHRcdFx0bWFpbk5hdlBvcyAgICAgICAgPSAwLFxuXHRcdFx0XHRtYWluTmF2TWcgICAgICAgICA9IDA7XG5cblx0XHRcdGlmICggaXNNb2JpbGUgPT09IGZhbHNlICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgbmF2U2Nyb2xsSGFuZGxlcik7IH1cblx0XHRcdGVsc2UgeyB2aWV3cG9ydC5vZmYoJ3Njcm9sbCcsIG5hdlNjcm9sbEhhbmRsZXIpOyB9XG5cblx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0c2Nyb2xsQ29ycmVjdGlvbiArPSBwYXJzZUZsb2F0KG1haW5XcmFwLmNzcygncGFkZGluZy10b3AnKSwgMTApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCAmJiBtaXh0X29wdC5uYXYucG9zaXRpb24gPT0gJ2JlbG93JyApIHtcblx0XHRcdFx0bWFpbk5hdkhlaWdodCA9IG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCAnJykub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0bWFpbk5hdlBvcyAgICA9IHBhcnNlSW50KG1haW5OYXZCYXIuY3NzKCd0b3AnKSwgMTApO1xuXHRcdFx0XHRtYWluTmF2TWcgICAgID0gbWFpbk5hdkhlaWdodDtcblxuXHRcdFx0XHRpZiAoIG1haW5OYXZQb3MgPT09IDAgfHwgaXNOYU4obWFpbk5hdlBvcykgKSB7XG5cdFx0XHRcdFx0bWFpbk5hdkJhci5jc3MoJ21hcmdpbi10b3AnLCAobWFpbk5hdkhlaWdodCAqIC0xKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc3RpY2t5TmF2VG9nZ2xlKCkge1xuXHRcdFx0XHR2YXIgbmF2UG9zICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wIC0gbWFpbk5hdk1nLFxuXHRcdFx0XHRcdHNjcm9sbFZhbCA9IHZpZXdwb3J0LnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdGJnVG9wQ2xzICA9IG5hdmJhck9iai5uYXZCZ1RvcDtcblxuXHRcdFx0XHRzY3JvbGxWYWwgPSBpc01vYmlsZSA9PT0gdHJ1ZSA/IDAgOiBzY3JvbGxWYWwgKz0gc2Nyb2xsQ29ycmVjdGlvbjtcblxuXHRcdFx0XHRpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWRhcmsnKSApIHsgYmdUb3BDbHMgPSAnYmctZGFyayc7IH1cblx0XHRcdFx0ZWxzZSBpZiAoIG1haW5OYXZCYXIuaGFzQ2xhc3MoJ3NsaWRlLWJnLWxpZ2h0JykgJiYgKCBuYXZiYXJPYmoubmF2QmcgIT0gJ2JnLWRhcmsnIHx8IG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA8PSAwLjQgKSApIHsgYmdUb3BDbHMgPSAnYmctbGlnaHQnOyB9XG5cblx0XHRcdFx0aWYgKCBzY3JvbGxWYWwgPiBuYXZQb3MgKSB7ICBcblx0XHRcdFx0XHRib2R5RWwuYWRkQ2xhc3MoJ2ZpeGVkLW5hdicpO1xuXHRcdFx0XHRcdG1haW5OYXZCYXIucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpLmFkZENsYXNzKG5hdmJhck9iai5uYXZCZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ym9keUVsLnJlbW92ZUNsYXNzKCdmaXhlZC1uYXYnKTtcblx0XHRcdFx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKG5hdmJhck9iai5uYXZCZykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCAnICsgYmdUb3BDbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHN0aWNreU5hdlRvZ2dsZSgpO1xuXHRcdH0sXG5cblx0XHQvLyBQcmV2ZW50IE5hdmJhciBTdWJtZW51IE92ZXJmbG93IE91dCBPZiBWaWV3cG9ydFxuXG5cdFx0bWVudU92ZXJmbG93OiBmdW5jdGlvbihuYXZiYXIpIHtcblxuXHRcdFx0dmFyIG5hdmJhck9mZiA9IDAsXG5cdFx0XHRcdG1haW5TdWIgPSBuYXZiYXIuZmluZCgnLmRyb3AtbWVudSAuZHJvcGRvd24tbWVudSwgLm1lZ2EtbWVudS1jb2x1bW4gPiAuc3ViLW1lbnUsIC5tZWdhLW1lbnUtY29sdW1uID4gYScpO1xuXG5cdFx0XHRpZiAoIG5hdmJhci5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRuYXZiYXJPZmYgPSBuYXZiYXIub3V0ZXJXaWR0aCgpICsgcGFyc2VJbnQobmF2YmFyLm9mZnNldCgpLmxlZnQsIDEwKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IE1lbnUgRHJvcCBMZWZ0XG5cblx0XHRcdGZ1bmN0aW9uIHNldERyb3BMZWZ0KHRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykuYWRkQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5yZW1vdmVDbGFzcygnYXJyb3ctcmlnaHQnKTtcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1sZWZ0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIFJlc2V0IE1lbnUgRHJvcFxuXG5cdFx0XHRmdW5jdGlvbiByZXNldEFycm93KHRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXQuZmluZCgnLnN1Yi1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXHRcdFx0XHRpZiAoIHRhcmdldC5oYXNDbGFzcygnYXJyb3ctbGVmdCcpIHx8IHRhcmdldC5oYXNDbGFzcygnYXJyb3ctcmlnaHQnKSApIHtcblx0XHRcdFx0XHR0YXJnZXQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcblx0XHRcdFx0XHR0YXJnZXQuZmluZCgnLmRyb3Atc3VibWVudScpLmFkZENsYXNzKCdhcnJvdy1yaWdodCcpLnJlbW92ZUNsYXNzKCdhcnJvdy1sZWZ0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVzZXQgTW9iaWxlIEFkanVzdG1lbnRzXG5cblx0XHRcdG1haW5OYXZCYXIuY3NzKHsgJ3Bvc2l0aW9uJzogJycsICd0b3AnOiAnJyB9KS5yZW1vdmVDbGFzcygnc3RvcHBlZCcpO1xuXG5cdFx0XHQvLyBQZXJmb3JtIG1lbnUgb3ZlcmZsb3cgY2hlY2tzXG5cblx0XHRcdG1haW5TdWIuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBzdWIgICAgICA9ICQodGhpcyksXG5cdFx0XHRcdFx0dG9wU3ViICAgPSBzdWIsXG5cdFx0XHRcdFx0c3ViUGFyICAgPSBzdWIucGFyZW50KCksXG5cdFx0XHRcdFx0c3ViUG9zICAgPSBwYXJzZUludChzdWIub2Zmc2V0KCkubGVmdCwgMTApLFxuXHRcdFx0XHRcdHN1YlcgICAgID0gc3ViLm91dGVyV2lkdGgoKSArIDEsXG5cdFx0XHRcdFx0bmVzdE9mZiAgPSBzdWJQb3MgKyBzdWJXLFxuXHRcdFx0XHRcdG5lc3RTdWJzID0gc3ViLmNoaWxkcmVuKCcuZHJvcC1zdWJtZW51JyksXG5cdFx0XHRcdFx0b3ZlcmZsb3dpbmdTdWJzID0gbmVzdFN1YnMsXG5cdFx0XHRcdFx0Y29ycmVjdGlvbjtcblxuXHRcdFx0XHRpZiAoIHN1YlBhci5pcygnLm1lZ2EtbWVudS1jb2x1bW4nKSApIHtcblx0XHRcdFx0XHR0b3BTdWIgPSBzdWJQYXIucGFyZW50cygnLmRyb3Bkb3duLW1lbnUnKTtcblx0XHRcdFx0XHRvdmVyZmxvd2luZ1N1YnMgPSB0b3BTdWIuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW46bnRoLWNoaWxkKDRuKSAuZHJvcC1zdWJtZW51LCAubWVnYS1tZW51LWNvbHVtbjpudGgtY2hpbGQobi00KTpsYXN0LWNoaWxkIC5kcm9wLXN1Ym1lbnUnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRvcCBMZXZlbCBTdWJtZW51c1xuXG5cdFx0XHRcdGlmICggbmVzdE9mZiA+IG5hdmJhck9mZiApIHtcblx0XHRcdFx0XHR2YXIgbWdOb3cgPSBwYXJzZUludCh0b3BTdWIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0XHRcdFx0Y29ycmVjdGlvbiA9IChuZXN0T2ZmIC0gbmF2YmFyT2ZmIC0gMikgKiAtMTtcblxuXHRcdFx0XHRcdGlmICggdG9wU3ViLmNzcygnYm9yZGVyLXJpZ2h0LXdpZHRoJykgPT0gJzFweCcgKSB7IGNvcnJlY3Rpb24gLT0gMTsgfVxuXG5cdFx0XHRcdFx0aWYgKCBuYXZiYXIuaGFzQ2xhc3MoJ2JvcmRlcmVkJykgfHwgbmF2YmFyLnBhcmVudHMoJy5uYXZiYXInKS5oYXNDbGFzcygnYm9yZGVyZWQnKSApIHsgY29ycmVjdGlvbiAtPSAxOyB9XG5cblx0XHRcdFx0XHRpZiAoIGNvcnJlY3Rpb24gPCBtZ05vdyApIHtcblx0XHRcdFx0XHRcdHRvcFN1Yi5jc3MoJ21hcmdpbi1sZWZ0JywgY29ycmVjdGlvbiArICdweCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzZXREcm9wTGVmdChvdmVyZmxvd2luZ1N1YnMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTmVzdGVkIFN1Ym1lbnVzXG5cblx0XHRcdFx0bmVzdFN1YnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHN1Yk5vdyAgICA9ICQodGhpcyksXG5cdFx0XHRcdFx0XHRuZXN0U3Vic1cgPSBbXTtcblx0XHRcdFx0XHRzdWJOb3cuZmluZCgnLnN1Yi1tZW51Om5vdCg6aGFzKC5kcm9wLXN1Ym1lbnUpKScpLm1hcCggZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRcdFx0dmFyICR0aGlzICAgID0gJCh0aGlzKSxcblx0XHRcdFx0XHRcdFx0cGFyZW50cyAgPSAkdGhpcy5wYXJlbnRzKCcuc3ViLW1lbnUnKSxcblx0XHRcdFx0XHRcdFx0cGFyZW50c1cgPSAwO1xuXG5cdFx0XHRcdFx0XHRwYXJlbnRzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0XHRcdFx0XHRpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKSAmJiAhICR0aGlzLmhhc0NsYXNzKCdtZWdhLW1lbnUtY29sdW1uJykpIHtcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRzVyArPSAkKHRoaXMpLm91dGVyV2lkdGgoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdG5lc3RTdWJzV1tpXSA9ICR0aGlzLm91dGVyV2lkdGgoKSArIHBhcmVudHNXO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0dmFyIG1heE5lc3RXID0gJC5pc0VtcHR5T2JqZWN0KG5lc3RTdWJzVykgPyAwIDogTWF0aC5tYXguYXBwbHkobnVsbCwgbmVzdFN1YnNXKTtcblxuXHRcdFx0XHRcdGlmICggKG5lc3RPZmYgKyBtYXhOZXN0VykgPj0gYm9keUVsLndpZHRoKCkgKSB7XG5cdFx0XHRcdFx0XHRzZXREcm9wTGVmdChzdWJOb3cpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXNldEFycm93KHN1Yk5vdyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Ly8gTWVnYSBNZW51IEVuYWJsZSAvIERpc2FibGVcblxuXHRcdG1lZ2FNZW51VG9nZ2xlOiBmdW5jdGlvbih0b2dnbGUsIG5hdmJhcikge1xuXHRcdFx0dmFyIG1lZ2FNZW51cztcblxuXHRcdFx0aWYgKCB0b2dnbGUgPT0gJ2VuYWJsZScgKSB7XG5cdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcuZHJvcC1tZW51W2RhdGEtbWVnYS1tZW51PVwidHJ1ZVwiXScpO1xuXHRcdFx0XHRtZWdhTWVudXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIG1lZ2FNZW51ID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdG1lZ2FNZW51LmFkZENsYXNzKCdtZWdhLW1lbnUnKS5yZW1vdmVDbGFzcygnZHJvcC1tZW51JykucmVtb3ZlQXR0cignZGF0YS1tZWdhLW1lbnUnKTtcblx0XHRcdFx0XHQkKCc+IC5zdWItbWVudSA+IC5kcm9wLXN1Ym1lbnUnLCBtZWdhTWVudSkucmVtb3ZlQ2xhc3MoJ2Ryb3Atc3VibWVudScpLmFkZENsYXNzKCdtZWdhLW1lbnUtY29sdW1uJyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRtZWdhTWVudXMuY2hpbGRyZW4oJ3VsJykuY3NzKCdtYXJnaW4tbGVmdCcsICcnKTtcblx0XHRcdH0gZWxzZSBpZiAoIHRvZ2dsZSA9PSAnZGlzYWJsZScgKSB7XG5cdFx0XHRcdG1lZ2FNZW51cyA9IG5hdmJhci5maW5kKCcubWVnYS1tZW51Jyk7XG5cdFx0XHRcdG1lZ2FNZW51cy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgbWVnYU1lbnUgPSAkKHRoaXMpO1xuXG5cdFx0XHRcdFx0bWVnYU1lbnUucmVtb3ZlQ2xhc3MoJ21lZ2EtbWVudScpLmFkZENsYXNzKCdkcm9wLW1lbnUnKS5hdHRyKCdkYXRhLW1lZ2EtbWVudScsICd0cnVlJyk7XG5cdFx0XHRcdFx0bWVnYU1lbnUuZmluZCgnLm1lZ2EtbWVudS1jb2x1bW4nKS5yZW1vdmVDbGFzcygnbWVnYS1tZW51LWNvbHVtbicpLmFkZENsYXNzKCdkcm9wLXN1Ym1lbnUnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdG1lZ2FNZW51cy5jaGlsZHJlbigndWwnKS5jc3MoJ21hcmdpbi1sZWZ0JywgJycpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBDcmVhdGUgTWVnYSBNZW51IFJvd3MgSWYgVGhlcmUgQXJlIE1vcmUgVGhhbiA0IENvbHVtbnNcblxuXHRcdG1lZ2FNZW51Um93czogZnVuY3Rpb24oKSB7XG5cdFx0XHRtYWluV3JhcC5maW5kKCcubWVnYS1tZW51JykuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBtYWluTWVudSA9ICQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLFxuXHRcdFx0XHRcdGNvbHVtbnMgID0gbWFpbk1lbnUuY2hpbGRyZW4oJy5tZWdhLW1lbnUtY29sdW1uJyk7XG5cblx0XHRcdFx0aWYgKCBjb2x1bW5zLmxlbmd0aCA+IDQgKSBtYWluTWVudS5hZGRDbGFzcygnbXVsdGktcm93Jyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Ly8gTW9iaWxlIEZ1bmN0aW9uc1xuXG5cdFx0bmF2TW9iaWxlOiBmdW5jdGlvbihtcU5hdikge1xuXG5cdFx0XHQvLyBFbmFibGUgTmF2IFNjcm9sbGluZyBJZiBOYXZiYXIgSGVpZ2h0ID4gVmlld3BvcnRcblxuXHRcdFx0ZnVuY3Rpb24gbmF2U2Nyb2xsKCkge1xuXHRcdFx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgJiYgbXFOYXYgPT0gJ3RhYmxldCcgKSB7XG5cdFx0XHRcdFx0dmFyIHZpZXdwb3J0SCAgICAgPSB2aWV3cG9ydC5oZWlnaHQoKSxcblx0XHRcdFx0XHRcdHZpZXdwb3J0UyAgICAgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKSxcblx0XHRcdFx0XHRcdG5hdmJhckhlYWRlckggPSBtYWluTmF2SGVhZC5oZWlnaHQoKSArIDEsXG5cdFx0XHRcdFx0XHRuYXZiYXJJbm5lckggID0gbWFpbk5hdklubmVyLmhhc0NsYXNzKCdpbicpID8gbWFpbk5hdklubmVyLmhlaWdodCgpIDogMCxcblx0XHRcdFx0XHRcdG5hdmJhckggICAgICAgPSBuYXZiYXJIZWFkZXJIICsgbmF2YmFySW5uZXJILFxuXHRcdFx0XHRcdFx0bmF2YmFyTWcgICAgICA9IDAsXG5cdFx0XHRcdFx0XHRuYXZiYXJUb3AgICAgID0gbWFpbk5hdkJhci5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wICAgID0gbWFpbk5hdldyYXAub2Zmc2V0KCkudG9wLFxuXG5cdFx0XHRcdFx0XHRzY3JvbGxIYW5kbGVyID0gJC50aHJvdHRsZSggNTAsIG5hdlN0b3BTY3JvbGwgKTtcblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQucGFnZVsnc2hvdy1hZG1pbi1iYXInXSApIHtcblx0XHRcdFx0XHRcdHZhciBhZG1pbkJhckggPSAkKCcjd3BhZG1pbmJhcicpLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmlld3BvcnRIICAtPSBhZG1pbkJhckg7XG5cdFx0XHRcdFx0XHRuYXZ3cmFwVG9wIC09IGFkbWluQmFySDtcblx0XHRcdFx0XHRcdG5hdmJhclRvcCAgLT0gYWRtaW5CYXJIO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ICYmIG1peHRfb3B0Lm5hdi5wb3NpdGlvbiA9PSAnYmVsb3cnICkge1xuXHRcdFx0XHRcdFx0bmF2YmFyTWcgPSBuYXZiYXJIZWFkZXJIICogLTE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBuYXZiYXJIID4gdmlld3BvcnRIICkge1xuXHRcdFx0XHRcdFx0dmlld3BvcnQub24oJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xuXHRcdFx0XHRcdFx0aWYgKCBtYWluTmF2QmFyLm5vdCgnc3RvcHBlZCcpICkge1xuXHRcdFx0XHRcdFx0XHRtYWluTmF2QmFyLmFkZENsYXNzKCdzdG9wcGVkJykuY3NzKHsgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6IChuYXZiYXJUb3AgLSBuYXZ3cmFwVG9wKSwgJ21hcmdpbi10b3AnOiAnMCcgfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcik7XG5cdFx0XHRcdFx0XHRtYWluTmF2QmFyLmNzcyh7ICdwb3NpdGlvbic6ICcnLCAndG9wJzogJycsICdtYXJnaW4tdG9wJzogbmF2YmFyTWcgfSkucmVtb3ZlQ2xhc3MoJ3N0b3BwZWQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBuYXZTdG9wU2Nyb2xsKCkge1xuXHRcdFx0XHRcdHZhciB2aWV3U2Nyb2xsID0gdmlld3BvcnQuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0XHRzdG9wU2Nyb2xsID0gbWFpbk5hdkJhci5oYXNDbGFzcygnc3RvcHBlZCcpID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHRcdGlmICggdmlld3BvcnRTID4gbWFpbk5hdkhlYWQub2Zmc2V0KCkudG9wICkgeyBzdG9wU2Nyb2xsID0gZmFsc2U7IH1cblx0XHRcdFx0XHRpZiAoIHZpZXdwb3J0UyA+IHZpZXdTY3JvbGwgJiYgc3RvcFNjcm9sbCApIHsgdmlld3BvcnQuc2Nyb2xsVG9wKHZpZXdwb3J0Uyk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTaG93L2hpZGUgU3VibWVudXMgT24gSGFuZGxlIENsaWNrXG5cblx0XHRcdCQoJy5kcm9wZG93bi10b2dnbGUnLCBtYWluTmF2QmFyKS5vbignY2xpY2sgdG91Y2hzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggJChldmVudC50YXJnZXQpLmlzKCcuZHJvcC1hcnJvdycpICkge1xuXHRcdFx0XHRcdGlmKCBldmVudC5oYW5kbGVkICE9PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0dmFyIGhhbmRsZSA9ICQodGhpcyksXG5cdFx0XHRcdFx0XHRcdG1lbnUgICA9IGhhbmRsZS5jbG9zZXN0KCcubWVudS1pdGVtJyk7XG5cblx0XHRcdFx0XHRcdGlmICggbWVudS5oYXNDbGFzcygnZXhwYW5kJykgKSB7XG5cdFx0XHRcdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0XHQkKCcubWVudS1pdGVtJywgbWVudSkucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWVudS5hZGRDbGFzcygnZXhwYW5kJykuc2libGluZ3MoJ2xpJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpLmZpbmQoJy5leHBhbmQnKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdG5hdlNjcm9sbCgpO1xuXG5cdFx0XHRcdFx0XHRldmVudC5oYW5kbGVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1haW5OYXZJbm5lci5vbignc2hvd24uYnMuY29sbGFwc2UgaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5tZW51LWl0ZW0nLCBtYWluTmF2QmFyKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XG5cdFx0XHRcdG5hdlNjcm9sbCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG5hdlNjcm9sbCgpO1xuXHRcdH1cblx0fTtcblx0bmF2YmFycy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRuYXZiYXJPYmouaW5pdCgkKHRoaXMpKTtcblx0fSk7XG5cdFxuXHRuYXZiYXJPYmoubWVnYU1lbnVSb3dzKCk7XG5cblx0bWFpbk5hdkJhci5vbigncmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuXHRcdCQoJ3N0eWxlW2RhdGEtaWQ9XCJtaXh0LW5hdi1jc3NcIl0nKS5yZW1vdmUoKTtcblx0XHRtYWluTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJykuYWRkQ2xhc3MoJ2luaXQnKTtcblx0XHRuYXZiYXJPYmouaW5pdChtYWluTmF2QmFyKTtcblx0fSk7XG5cblx0c2VjTmF2QmFyLm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XG5cdFx0c2VjTmF2QmFyLnJlbW92ZUNsYXNzKCdiZy1saWdodCBiZy1kYXJrJyk7XG5cdFx0bmF2YmFyT2JqLmluaXQoc2VjTmF2QmFyKTtcblx0fSk7XG5cblxuXHQvLyBDaGVjayB3aGljaCBtZWRpYSBxdWVyaWVzIGFyZSBhY3RpdmVcblx0dmFyIG1xQ2hlY2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhci1kYXRhJyksICc6YWZ0ZXInKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50JykucmVwbGFjZSgvXCIvZywgJycpO1xuXHR9O1xuXG5cblx0Ly8gRW5hYmxlIE1lbnUgSG92ZXIgT24gVG91Y2ggU2NyZWVuc1xuXHR2YXIgbWVudVBhcmVudHMgPSBuYXZiYXJzLmZpbmQoJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuLCBsaS5kcm9wZG93bicpO1xuXHRmdW5jdGlvbiBtZW51VG91Y2hIb3ZlcihldmVudCkge1xuXHRcdHZhciBsaW5rID0gJChldmVudC5kZWxlZ2F0ZVRhcmdldCksXG5cdFx0XHRhbmNlc3RvcnMgPSBsaW5rLnBhcmVudHMoJy5ob3ZlcicpO1xuXHRcdGlmIChsaW5rLmhhc0NsYXNzKCdob3ZlcicpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGluay5hZGRDbGFzcygnaG92ZXInKTtcblx0XHRcdG1lbnVQYXJlbnRzLm5vdChsaW5rKS5ub3QoYW5jZXN0b3JzKS5yZW1vdmVDbGFzcygnaG92ZXInKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIG1lbnVUb3VjaFJlbW92ZUhvdmVyKGV2ZW50KSB7XG5cdFx0aWYgKCAhICQoZXZlbnQuZGVsZWdhdGVUYXJnZXQpLmlzKG1lbnVQYXJlbnRzKSApIHsgbWVudVBhcmVudHMucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7IH1cblx0fVxuXG5cblx0Ly8gRW5zdXJlIHZlcnRpY2FsIG5hdmJhciBpdGVtcyBmaXQgaW4gdmlld3BvcnRcblx0ZnVuY3Rpb24gdmVydGljYWxOYXZGaXRWaWV3KCkge1xuXHRcdGlmICggdmlld3BvcnQuaGVpZ2h0KCkgPCBtYWluTmF2Q29udC5pbm5lckhlaWdodCgpICkge1xuXHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MoJ3ZlcnRpY2FsLWZpeGVkJykuYWRkQ2xhc3MoJ3ZlcnRpY2FsLXN0YXRpYycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTmF2V3JhcC5yZW1vdmVDbGFzcygndmVydGljYWwtc3RhdGljJykuYWRkQ2xhc3MoJ3ZlcnRpY2FsLWZpeGVkJyk7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBIYW5kbGUgTmF2YmFyIEl0ZW1zIE92ZXJsYXBcblx0ZnVuY3Rpb24gbmF2YmFyT3ZlcmxhcCgpIHtcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCksXG5cdFx0XHRtYWluTmF2TG9nb0NscyA9ICdsb2dvLScgKyBtYWluTmF2V3JhcC5hdHRyKCdkYXRhLWxvZ28tYWxpZ24nKTtcblxuXHRcdC8vIFByaW1hcnkgTmF2YmFyXG5cdFx0aWYgKCBtYWluTmF2TG9nb0NscyAhPSAnbG9nby1jZW50ZXInICYmIG1peHRfb3B0Lm5hdi5sYXlvdXQgPT0gJ2hvcml6b250YWwnICkge1xuXHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyJykuYWRkQ2xhc3MobWFpbk5hdkxvZ29DbHMpO1xuXHRcdFx0aWYgKCBtcU5hdiA9PSAnZGVza3RvcCcgKSB7XG5cdFx0XHRcdHZhciBtYWluTmF2Q29udFdpZHRoID0gbWFpbk5hdkNvbnQud2lkdGgoKSxcblx0XHRcdFx0XHRtYWluTmF2SXRlbXNXaWR0aCA9IG1haW5OYXZIZWFkLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcjbWFpbi1tZW51Jykub3V0ZXJXaWR0aCh0cnVlKTtcblx0XHRcdFx0aWYgKCBtYWluTmF2SXRlbXNXaWR0aCA+IG1haW5OYXZDb250V2lkdGggKSB7XG5cdFx0XHRcdFx0bWFpbk5hdldyYXAucmVtb3ZlQ2xhc3MobWFpbk5hdkxvZ29DbHMpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2Vjb25kYXJ5IE5hdmJhclxuXHRcdGlmICggc2VjTmF2QmFyLmxlbmd0aCApIHtcblx0XHRcdHNlY05hdkJhci5yZW1vdmVDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xuXHRcdFx0dmFyIHNlY05hdkNvbnRXaWR0aCA9IHNlY05hdkNvbnQuaW5uZXJXaWR0aCgpLFxuXHRcdFx0XHRzZWNOYXZJdGVtc1dpZHRoID0gJCgnLmxlZnQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSkgKyAkKCcucmlnaHQnLCBzZWNOYXZCYXIpLm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0XHRpZiAoIHNlY05hdkl0ZW1zV2lkdGggPiBzZWNOYXZDb250V2lkdGggKSB7XG5cdFx0XHRcdHNlY05hdkJhci5hZGRDbGFzcygnaXRlbXMtb3ZlcmxhcCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cblx0Ly8gRnVuY3Rpb25zIFJ1biBPbiBMb2FkICYgV2luZG93IFJlc2l6ZVxuXHRmdW5jdGlvbiBuYXZiYXJGbigpIHtcblx0XHR2YXIgbXFOYXYgPSBtcUNoZWNrKCk7XG5cblx0XHQvLyBSdW4gZnVuY3Rpb24gdG8gcHJldmVudCBzdWJtZW51cyBnb2luZyBvdXRzaWRlIHZpZXdwb3J0XG5cdFx0bmF2YmFycy5ub3QobWFpbk5hdkJhcikuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZiYXJPYmoubWVudU92ZXJmbG93KCQoJy5uYXZiYXItaW5uZXInLCB0aGlzKSk7XG5cdFx0fSk7XG5cblx0XHQvLyBSdW4gZnVuY3Rpb25zIGJhc2VkIG9uIGN1cnJlbnRseSBhY3RpdmUgbWVkaWEgcXVlcnlcblx0XHRpZiAoIG1xTmF2ID09ICdkZXNrdG9wJyApIHtcblx0XHRcdG5hdmJhck9iai5tZW51T3ZlcmZsb3cobWFpbk5hdklubmVyKTtcblx0XHRcdG1haW5OYXZCYXIuY3NzKCdoZWlnaHQnLCAnJyk7XG5cblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5hdmJhck9iai5tZWdhTWVudVRvZ2dsZSgnZW5hYmxlJywgJCh0aGlzKSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bWVudVBhcmVudHMub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hIb3Zlcik7XG5cdFx0XHRib2R5RWwub24oJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fSBlbHNlIGlmICggbXFOYXYgPT0gJ21vYmlsZScgfHwgbXFOYXYgPT0gJ3RhYmxldCcgKSB7XG5cdFx0XHRuYXZiYXJPYmoubmF2TW9iaWxlKG1xTmF2KTtcblxuXHRcdFx0dmFyIG5hdkhlaWdodCA9IG1haW5OYXZIZWFkLm91dGVySGVpZ2h0KCkgKyAxO1xuXHRcdFx0bWFpbk5hdkJhci5jc3MoJ2hlaWdodCcsIG5hdkhlaWdodCk7XG5cblx0XHRcdG5hdmJhcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5hdmJhck9iai5tZWdhTWVudVRvZ2dsZSgnZGlzYWJsZScsICQodGhpcykpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1lbnVQYXJlbnRzLm9mZigndG91Y2hzdGFydCcsIG1lbnVUb3VjaEhvdmVyKTtcblx0XHRcdGJvZHlFbC5vZmYoJ3RvdWNoc3RhcnQnLCBtZW51VG91Y2hSZW1vdmVIb3Zlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBwcmltYXJ5IG5hdmJhciBzdGlja3kgaWYgb3B0aW9uIGVuYWJsZWRcblx0XHRpZiAoIG1peHRfb3B0Lm5hdi5tb2RlID09ICdmaXhlZCcgKSB7XG5cdFx0XHRpZiAoIG1xTmF2ID09ICdtb2JpbGUnICkge1xuXHRcdFx0XHRuYXZiYXJPYmouc3RpY2t5TmF2KHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmF2YmFyT2JqLnN0aWNreU5hdihmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1haW5OYXZCYXIuYWRkQ2xhc3MoJ3Bvc2l0aW9uLXRvcCcpO1xuXHRcdH1cblxuXHRcdC8vIFZlcnRpY2FsIG5hdmJhciBoYW5kbGluZ1xuXHRcdGlmICggbWl4dF9vcHQubmF2LmxheW91dCA9PSAndmVydGljYWwnICYmIG1peHRfb3B0Lm5hdlsndmVydGljYWwtbW9kZSddID09ICdmaXhlZCcgJiYgbXFOYXYgPT0gJ2Rlc2t0b3AnICkge1xuXHRcdFx0Ly8gTWFrZSBuYXZiYXIgc3RhdGljIGlmIGl0ZW1zIGRvbid0IGZpdCBpbiB2aWV3cG9ydFxuXHRcdFx0dmVydGljYWxOYXZGaXRWaWV3KCk7XG5cdFx0fVxuXG5cdFx0bmF2YmFyT3ZlcmxhcCgpO1xuXHR9XG5cdHZpZXdwb3J0LnJlc2l6ZSggJC5kZWJvdW5jZSggNTAwLCBuYXZiYXJGbiApKS5yZXNpemUoKTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5QT1NUIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCwgaWZyYW1lQXNwZWN0LCBNb2Rlcm5penIgKi9cblxuXHR2YXIgdmlld3BvcnQgPSAkKHdpbmRvdyksXG5cdFx0Y29udGVudCAgPSAkKCcjY29udGVudCcpO1xuXG5cdC8vIFJlc2l6ZSBFbWJlZGRlZCBWaWRlb3MgUHJvcG9ydGlvbmFsbHlcblx0aWZyYW1lQXNwZWN0KCAkKCcucG9zdCBpZnJhbWUnKSApO1xuXG5cdC8vIFBvc3QgTGF5b3V0XG5cdGZ1bmN0aW9uIHBvc3RzUGFnZSgpIHtcblxuXHRcdGNvbnRlbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gRmVhdHVyZWQgR2FsbGVyeSBTbGlkZXJcblx0XHRcdGlmICggdHlwZW9mICQuZm4ubGlnaHRTbGlkZXIgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdHZhciBnYWxsZXJ5U2xpZGVyID0gJCgnLmdhbGxlcnktc2xpZGVyJykubm90KCcubGlnaHRTbGlkZXInKTtcblx0XHRcdFx0Z2FsbGVyeVNsaWRlci5saWdodFNsaWRlcih7XG5cdFx0XHRcdFx0aXRlbTogMSxcblx0XHRcdFx0XHRhdXRvOiB0cnVlLFxuXHRcdFx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHRcdFx0cGFnZXI6IGZhbHNlLFxuXHRcdFx0XHRcdHBhdXNlOiA1MDAwLFxuXHRcdFx0XHRcdGtleVByZXNzOiB0cnVlLFxuXHRcdFx0XHRcdHNsaWRlTWFyZ2luOiAwLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgJC5mbi5saWdodEdhbGxlcnkgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdCQoJy5saWdodGJveC1nYWxsZXJ5JykubGlnaHRHYWxsZXJ5KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVxdWFsaXplIGZlYXR1cmVkIG1lZGlhIGhlaWdodCBmb3IgcmVsYXRlZCBwb3N0cyBhbmQgZ3JpZCBibG9nXG5cdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHQkLmZuLm1hdGNoSGVpZ2h0Ll9tYWludGFpblNjcm9sbCA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuYmxvZy1ncmlkIC5wb3N0cy1jb250YWluZXIgLnBvc3QtZmVhdCcpLmFkZENsYXNzKCdmaXgtaGVpZ2h0JykubWF0Y2hIZWlnaHQoKTtcblxuXHRcdFx0XHRpZiAoICEgTW9kZXJuaXpyLmZsZXhib3ggKSB7XG5cdFx0XHRcdFx0JCgnLmJsb2ctZ3JpZCAucG9zdHMtY29udGFpbmVyIGFydGljbGUnKS5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KCk7XG5cblx0XHRcdFx0XHR2YXIgbWF0Y2hIZWlnaHRFbCA9ICQoJy5wb3N0LXJlbGF0ZWQgLnBvc3QtZmVhdCcpLFxuXHRcdFx0XHRcdFx0bWF0Y2hIZWlnaHRUYXJnZXQgPSBtYXRjaEhlaWdodEVsLmZpbmQoJy53cC1wb3N0LWltYWdlJyk7XG5cdFx0XHRcdFx0aWYgKCBtYXRjaEhlaWdodFRhcmdldC5sZW5ndGggPT09IDAgKSBtYXRjaEhlaWdodFRhcmdldCA9IG51bGw7XG5cdFx0XHRcdFx0bWF0Y2hIZWlnaHRFbC5hZGRDbGFzcygnZml4LWhlaWdodCcpLm1hdGNoSGVpZ2h0KHtcblx0XHRcdFx0XHRcdHRhcmdldDogbWF0Y2hIZWlnaHRUYXJnZXQsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdH0pO1xuXHR9XG5cblxuXHQvLyBMb2FkIFBvc3RzICYgQ29tbWVudHMgdmlhIEFqYXhcblx0ZnVuY3Rpb24gbWl4dEFqYXhMb2FkKHR5cGUpIHtcblx0XHR0eXBlID0gdHlwZSB8fCAncG9zdHMnO1xuXHRcdHZhciBwYWdDb250ID0gJCgnLnBhZ2luZy1uYXZpZ2F0aW9uJyksXG5cdFx0XHRhamF4QnRuID0gJCgnLmFqYXgtbW9yZScsIHBhZ0NvbnQpO1xuXG5cdFx0aWYgKCAhIHBhZ0NvbnQubGVuZ3RoIHx8ICEgYWpheEJ0bi5sZW5ndGggKSByZXR1cm47XG5cdFx0XG5cdFx0dmFyIHBhZ2VOb3cgPSBwYWdDb250LmRhdGEoJ3BhZ2Utbm93JyksXG5cdFx0XHRwYWdlTWF4ID0gcGFnQ29udC5kYXRhKCdwYWdlLW1heCcpLFxuXHRcdFx0bmV4dFVybCA9IGFqYXhCdG4uYXR0cignaHJlZicpLFxuXHRcdFx0cGFnZU51bSxcblx0XHRcdHBhZ2VUeXBlLFxuXHRcdFx0Y29udGFpbmVyLFxuXHRcdFx0ZWxlbWVudCxcblx0XHRcdGxvYWRTZWw7XG5cblx0XHRpZiAoIHR5cGUgPT0gJ3Bvc3RzJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XG5cdFx0XHRjb250YWluZXIgPSAkKCcucG9zdHMtY29udGFpbmVyJyk7XG5cdFx0XHRlbGVtZW50ICAgPSAnLmFydGljbGUnO1xuXHRcdFx0bG9hZFNlbCAgID0gJyAucG9zdHMtY29udGFpbmVyIC5hcnRpY2xlJztcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdzaG9wJyApIHtcblx0XHRcdHBhZ2VUeXBlICA9IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ107XG5cdFx0XHRjb250YWluZXIgPSAkKCd1bC5wcm9kdWN0cycpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5wcm9kdWN0Jztcblx0XHRcdGxvYWRTZWwgICA9ICcgdWwucHJvZHVjdHMgPiBsaSc7XG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PSAnY29tbWVudHMnICkge1xuXHRcdFx0cGFnZVR5cGUgID0gbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddO1xuXHRcdFx0Y29udGFpbmVyID0gJCgnLmNvbW1lbnQtbGlzdCcpO1xuXHRcdFx0ZWxlbWVudCAgID0gJy5jb21tZW50Jztcblx0XHRcdGxvYWRTZWwgICA9ICcgLmNvbW1lbnQtbGlzdCA+IGxpJztcblx0XHR9XG5cblx0XHRpZiAoIHR5cGUgPT0gJ2NvbW1lbnRzJyAmJiBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtZGVmYXVsdC1wYWdlJ10gPT0gJ25ld2VzdCcgKSB7XG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyAtIDE7XG5cdFx0XHRuZXh0VXJsID0gbmV4dFVybC5yZXBsYWNlKC9cXC9jb21tZW50LXBhZ2UtWzAtOV0/LywgJy9jb21tZW50LXBhZ2UtJyArIHBhZ2VOdW0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYWdlTnVtID0gcGFnZU5vdyArIDE7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHBhZ2VOb3cgPj0gcGFnZU1heCApICYmIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSAhPSAnbmV3ZXN0JyB8fCBwYWdlTnVtIDw9IDAgKSB7XG5cdFx0XHRhamF4QnRuLmJ1dHRvbignY29tcGxldGUnKTtcblx0XHR9XG5cdFx0XG5cdFx0YWpheEJ0bi5vbignY2xpY2sgY29udDpib3R0b20nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIFByZXZlbnQgbG9hZGluZyB0d2ljZSBvbiBzY3JvbGxcblx0XHRcdHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7XG5cdFx0XG5cdFx0XHQvLyBBcmUgdGhlcmUgbW9yZSBwYWdlcyB0byBsb2FkP1xuXHRcdFx0aWYgKCBwYWdlTnVtID4gMCAmJiBwYWdlTnVtIDw9IHBhZ2VNYXggKSB7XG5cdFx0XHRcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2xvYWRpbmcnKTtcblxuXHRcdFx0XHQvLyBMb2FkIHBvc3RzXG5cdFx0XHRcdC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG5cdFx0XHRcdCQoJzxkaXY+JykubG9hZChuZXh0VXJsICsgbG9hZFNlbCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XG5cdFx0XHRcdFx0dmFyIG5ld1Bvc3RzID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdGFqYXhCdG4uYmx1cigpO1xuXG5cdFx0XHRcdFx0bmV3UG9zdHMuY2hpbGRyZW4oZWxlbWVudCkuYWRkQ2xhc3MoJ2FqYXgtbmV3Jyk7XG5cdFx0XHRcdFx0aWYgKCAoIHR5cGUgPT0gJ3Bvc3RzJyB8fCB0eXBlID09ICdzaG9wJyApICYmIG1peHRfb3B0LmxheW91dC50eXBlICE9ICdtYXNvbnJ5JyAmJiBtaXh0X29wdC5sYXlvdXRbJ3Nob3ctcGFnZS1uciddICkge1xuXHRcdFx0XHRcdFx0bmV3UG9zdHMucHJlcGVuZCgnPGRpdiBjbGFzcz1cImFqYXgtcGFnZSBwYWdlLScrIHBhZ2VOdW0gKydcIj48YSBocmVmPVwiJysgbmV4dFVybCArJ1wiPlBhZ2UgJysgcGFnZU51bSArJzwvYT48L2Rpdj4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChuZXdQb3N0cy5odG1sKCkpO1xuXG5cdFx0XHRcdFx0bmV3UG9zdHMgPSBjb250YWluZXIuY2hpbGRyZW4oJy5hamF4LW5ldycpO1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHBhZ2UgbnVtYmVyIGFuZCBuZXh0VXJsXG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdjb21tZW50cycgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1peHRfb3B0LmxheW91dFsnY29tbWVudC1kZWZhdWx0LXBhZ2UnXSA9PSAnbmV3ZXN0JyApIHtcblx0XHRcdFx0XHRcdFx0cGFnZU51bS0tO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cGFnZU51bSsrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvY29tbWVudC1wYWdlLVswLTldPy8sICcvY29tbWVudC1wYWdlLScgKyBwYWdlTnVtKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZU51bSsrO1xuXHRcdFx0XHRcdFx0bmV4dFVybCA9IG5leHRVcmwucmVwbGFjZSgvXFwvcGFnZVxcL1swLTldPy8sICcvcGFnZS8nICsgcGFnZU51bSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYnV0dG9uIHN0YXRlXG5cdFx0XHRcdFx0aWYgKCBwYWdlTnVtIDw9IHBhZ2VNYXggJiYgcGFnZU51bSA+IDAgKSB7IGFqYXhCdG4uYnV0dG9uKCdyZXNldCcpOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGFqYXhCdG4uYnV0dG9uKCdjb21wbGV0ZScpOyB9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgbGF5b3V0IG9uY2UgcG9zdHMgaGF2ZSBsb2FkZWRcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG5ld1Bvc3RzLnJlbW92ZUNsYXNzKCdhamF4LW5ldycpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlID09ICdwb3N0cycgKSB7XG5cdFx0XHRcdFx0XHRcdGlmcmFtZUFzcGVjdCgpO1xuXHRcdFx0XHRcdFx0XHRwb3N0c1BhZ2UoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkKCcuYmxvZy1tYXNvbnJ5IC5wb3N0cy1jb250YWluZXInKTtcblx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGFpbmVyLmlzb3RvcGUoJ2FwcGVuZGVkJywgbmV3UG9zdHMpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZpZXdwb3J0LnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAxMDApO1xuXG5cdFx0XHRcdFx0aWYgKCBwYWdlVHlwZSA9PSAnYWpheC1zY3JvbGwnICkgeyB2aWV3cG9ydC5vbignc2Nyb2xsJywgYWpheFNjcm9sbEhhbmRsZSk7IH1cblxuXHRcdFx0XHRcdC8vIEhhbmRsZSBFcnJvcnNcblx0XHRcdFx0XHRpZiAoIHN0YXR1cyA9PSAnZXJyb3InICkge1xuXHRcdFx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2Vycm9yJyk7XG5cdFx0XHRcdFx0XHQvLyBEZWJ1Z2dpbmcgaW5mb1xuXHRcdFx0XHRcdFx0Ly8gYWxlcnQoJ0FKQVggRXJyb3I6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWpheEJ0bi5idXR0b24oJ2NvbXBsZXRlJyk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblxuXHRcdC8vIFRyaWdnZXIgQUpBWCBsb2FkIHdoZW4gcmVhY2hpbmcgYm90dG9tIG9mIHBhZ2Vcblx0XHR2YXIgYWpheFNjcm9sbEhhbmRsZSA9ICQuZGVib3VuY2UoIDUwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8qIGdsb2JhbCBlbGVtVmlzaWJsZSAqL1xuXHRcdFx0XHRpZiAoIGVsZW1WaXNpYmxlKGFqYXhCdG4sIHZpZXdwb3J0KSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRhamF4QnRuLnRyaWdnZXIoJ2NvbnQ6Ym90dG9tJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGlmICggcGFnZVR5cGUgPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBhamF4U2Nyb2xsSGFuZGxlKTtcblx0XHR9XG5cdH1cblx0Ly8gRXhlY3V0ZSBGdW5jdGlvbiBXaGVyZSBBcHBsaWNhYmxlXG5cdGlmICggbWl4dF9vcHQucGFnZVsncG9zdHMtcGFnZSddICYmIG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtY2xpY2snIHx8IG1peHRfb3B0LmxheW91dFsncGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRpZiAoIG1peHRfb3B0LnBhZ2VbJ3BhZ2UtdHlwZSddID09ICdzaG9wJyApIHtcblx0XHRcdG1peHRBamF4TG9hZCgnc2hvcCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtaXh0QWpheExvYWQoJ3Bvc3RzJyk7XG5cdFx0fVxuXHR9XG5cdGlmICggbWl4dF9vcHQucGFnZVsncGFnZS10eXBlJ10gPT0gJ3NpbmdsZScgJiYgbWl4dF9vcHQubGF5b3V0Wydjb21tZW50LXBhZ2luYXRpb24tdHlwZSddID09ICdhamF4LWNsaWNrJyB8fCBtaXh0X29wdC5sYXlvdXRbJ2NvbW1lbnQtcGFnaW5hdGlvbi10eXBlJ10gPT0gJ2FqYXgtc2Nyb2xsJyApIHtcblx0XHRtaXh0QWpheExvYWQoJ2NvbW1lbnRzJyk7XG5cdH1cblxuXG5cdC8vIEZ1bmN0aW9ucyBUbyBSdW4gT24gV2luZG93IFJlc2l6ZVxuXHRmdW5jdGlvbiByZXNpemVGbigpIHtcblx0XHRpZnJhbWVBc3BlY3QoKTtcblx0fVxuXHR2aWV3cG9ydC5yZXNpemUoICQuZGVib3VuY2UoIDUwMCwgcmVzaXplRm4gKSk7XG5cblxuXHQvLyBGdW5jdGlvbnMgVG8gUnVuIE9uIExvYWRcblx0dmlld3BvcnQubG9hZCggZnVuY3Rpb24oKSB7XG5cblx0XHRwb3N0c1BhZ2UoKTtcblxuXHRcdC8vIElzb3RvcGUgTWFzb25yeSBJbml0XG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdHZhciBibG9nQ29udCA9ICQoJy5ibG9nLW1hc29ucnkgLnBvc3RzLWNvbnRhaW5lcicpO1xuXG5cdFx0XHRibG9nQ29udC5pc290b3BlKHtcblx0XHRcdFx0aXRlbVNlbGVjdG9yOiAnLmFydGljbGUnLFxuXHRcdFx0XHRsYXlvdXQ6ICdtYXNvbnJ5Jyxcblx0XHRcdFx0Z3V0dGVyOiAwXG5cdFx0XHR9KTtcblxuXHRcdFx0YmxvZ0NvbnQuaW1hZ2VzTG9hZGVkKCBmdW5jdGlvbigpIHsgYmxvZ0NvbnQuaXNvdG9wZSgnbGF5b3V0Jyk7IH0pO1xuXHRcdFx0dmlld3BvcnQucmVzaXplKCAkLmRlYm91bmNlKCA1MDAsIGZ1bmN0aW9uKCkgeyBibG9nQ29udC5pc290b3BlKCdsYXlvdXQnKTsgfSApKTtcblx0XHR9XG5cblxuXHRcdC8vIFRyaWdnZXIgTGlnaHRib3ggT24gRmVhdHVyZWQgSW1hZ2UgQ2xpY2tcblx0XHQkKCcubGlnaHRib3gtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnLmdhbGxlcnknKS5maW5kKCdsaScpLmZpcnN0KCkuY2xpY2soKTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gUmVsYXRlZCBQb3N0cyBTbGlkZXJcblx0XHRpZiAoIHR5cGVvZiAkLmZuLmxpZ2h0U2xpZGVyID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0dmFyIHJlbFBvc3RzU2xpZGVyID0gJCgnLnBvc3QtcmVsYXRlZCAuc2xpZGVyLWNvbnQnKTtcblx0XHRcdHJlbFBvc3RzU2xpZGVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmxpZ2h0U2xpZGVyKHtcblx0XHRcdFx0XHRpdGVtOiAzLFxuXHRcdFx0XHRcdHBhZ2VyOiBmYWxzZSxcblx0XHRcdFx0XHRrZXlQcmVzczogdHJ1ZSxcblx0XHRcdFx0XHRzbGlkZU1hcmdpbjogMjAsXG5cdFx0XHRcdFx0cmVzcG9uc2l2ZTogW3tcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDk2MCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IDMgfVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDU0MCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB7IGl0ZW06IDIgfVxuXHRcdFx0XHRcdH1dLFxuXHRcdFx0XHRcdG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiAkLmZuLm1hdGNoSGVpZ2h0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0XHQkKCcucG9zdC1mZWF0JywgcmVsUG9zdHNTbGlkZXIpLm1hdGNoSGVpZ2h0KCk7XG5cdFx0XHRcdFx0XHRcdHJlbFBvc3RzU2xpZGVyLmNzcygnaGVpZ2h0JywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cblVJIEZVTkNUSU9OU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBtaXh0X29wdCAqL1xuXG5cdHZhciB2aWV3cG9ydCA9ICQod2luZG93KSxcblx0XHRodG1sRWwgICA9ICQoJ2h0bWwnKSxcblx0XHRib2R5RWwgICA9ICQoJ2JvZHknKTtcblxuXG5cdC8vIFNwaW5uZXIgSW5wdXRcblx0JCgnLm1peHQtc3Bpbm5lcicpLm9uKCdjbGljaycsICcuYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRlbCAgICAgPSAkKHRoaXMpLFxuXHRcdFx0c3Bpbm5lciA9ICRlbC5wYXJlbnRzKCcubWl4dC1zcGlubmVyJyksXG5cdFx0XHRpbnB1dCAgID0gc3Bpbm5lci5jaGlsZHJlbignLnNwaW5uZXItdmFsJyksXG5cdFx0XHRzdGVwICAgID0gaW5wdXQuYXR0cignc3RlcCcpIHx8IDEsXG5cdFx0XHRtaW5WYWwgID0gaW5wdXQuYXR0cignbWluJykgfHwgMCxcblx0XHRcdG1heFZhbCAgPSBpbnB1dC5hdHRyKCdtYXgnKSB8fCBudWxsLFxuXHRcdFx0dmFsICAgICA9IGlucHV0LnZhbCgpLFxuXHRcdFx0bmV3VmFsO1xuXHRcdGlmICggaXNOYU4odmFsKSApIHZhbCA9IG1pblZhbDtcblx0XHRcblx0XHRpZiAoICRlbC5oYXNDbGFzcygnbWludXMnKSApIHtcblx0XHRcdC8vIERlY3JlYXNlXG5cdFx0XHRuZXdWYWwgPSBwYXJzZUZsb2F0KHZhbCkgLSBwYXJzZUZsb2F0KHN0ZXApO1xuXHRcdFx0aWYgKCBuZXdWYWwgPCBtaW5WYWwgKSBuZXdWYWwgPSBtaW5WYWw7XG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSW5jcmVhc2Vcblx0XHRcdG5ld1ZhbCA9IHBhcnNlRmxvYXQodmFsKSArIHBhcnNlRmxvYXQoc3RlcCk7XG5cdFx0XHRpZiAoIG1heFZhbCAhPT0gbnVsbCAmJiBuZXdWYWwgPiBtYXhWYWwgKSBuZXdWYWwgPSBtYXhWYWw7XG5cdFx0XHRpbnB1dC52YWwobmV3VmFsKTtcblx0XHR9XG5cdH0pO1xuXG5cblx0Ly8gQ29udGVudCBGaWx0ZXJpbmdcblx0JCgnLmNvbnRlbnQtZmlsdGVyLWxpbmtzJykuY2hpbGRyZW4oKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGxpbmsgPSAkKHRoaXMpLFxuXHRcdFx0ZmlsdGVyID0gbGluay5kYXRhKCdmaWx0ZXInKSxcblx0XHRcdGNvbnRlbnQgPSAkKCcuJyArIGxpbmsucGFyZW50cygnLmNvbnRlbnQtZmlsdGVyLWxpbmtzJykuZGF0YSgnY29udGVudCcpKSxcblx0XHRcdGZpbHRlckNsYXNzID0gJ2ZpbHRlci1oaWRkZW4nO1xuXHRcdGxpbmsuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGlmICggZmlsdGVyID09ICdhbGwnICkgeyBjb250ZW50LmZpbmQoJy4nK2ZpbHRlckNsYXNzKS5yZW1vdmVDbGFzcyhmaWx0ZXJDbGFzcykuc2xpZGVEb3duKDYwMCk7IH1cblx0XHRlbHNlIHsgY29udGVudC5maW5kKCcuJyArIGZpbHRlcikucmVtb3ZlQ2xhc3MoZmlsdGVyQ2xhc3MpLnNsaWRlRG93big2MDApLnNpYmxpbmdzKCc6bm90KC4nK2ZpbHRlcisnKScpLmFkZENsYXNzKGZpbHRlckNsYXNzKS5zbGlkZVVwKDYwMCk7IH1cblx0fSk7XG5cblxuXHQvLyBTb3J0IHBvcnRmb2xpbyBpdGVtc1xuXHQkKCcucG9ydGZvbGlvLXNvcnRlciBhJykuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgZWxlbSA9ICQodGhpcyksXG5cdFx0XHR0YXJnZXRUYWcgPSBlbGVtLmRhdGEoJ3NvcnQnKSxcblx0XHRcdHRhcmdldENvbnRhaW5lciA9ICQoJy5wb3N0cy1jb250YWluZXInKTtcblxuXHRcdGVsZW0ucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0aWYgKCBtaXh0X29wdC5sYXlvdXQudHlwZSA9PSAnbWFzb25yeScgJiYgdHlwZW9mICQuZm4uaXNvdG9wZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdGlmICh0YXJnZXRUYWcgPT0gJ2FsbCcpIHtcblx0XHRcdFx0dGFyZ2V0Q29udGFpbmVyLmlzb3RvcGUoeyBmaWx0ZXI6ICcqJyB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRhcmdldENvbnRhaW5lci5pc290b3BlKHsgZmlsdGVyOiAnLicgKyB0YXJnZXRUYWcgfSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwcm9qZWN0cyA9IHRhcmdldENvbnRhaW5lci5jaGlsZHJlbignLnBvcnRmb2xpbycpO1xuXHRcdFx0aWYgKCB0YXJnZXRUYWcgPT0gJ2FsbCcgKSB7XG5cdFx0XHRcdHByb2plY3RzLmZhZGVJbigzMDApLmFkZENsYXNzKCdmaWx0ZXJlZCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJvamVjdHMuZmFkZU91dCgwKS5yZW1vdmVDbGFzcygnZmlsdGVyZWQnKS5maWx0ZXIoJy4nICsgdGFyZ2V0VGFnKS5mYWRlSW4oMzAwKS5hZGRDbGFzcygnZmlsdGVyZWQnKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cblx0Ly8gT2Zmc2V0IHNjcm9sbGluZyB0byBsaW5rIGFuY2hvciAoaGFzaClcblx0JCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIGxpbmsgPSAkKHRoaXMpLFxuXHRcdFx0aGFzaCA9IGxpbmsuYXR0cignaHJlZicpO1xuXG5cdFx0aWYgKCBsaW5rLmRhdGEoJ25vLWhhc2gtc2Nyb2xsJykgKSByZXR1cm47XG5cblx0XHRpZiAoIGhhc2gubGVuZ3RoICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIHRhcmdldCA9ICQoaGFzaCk7XG5cdFx0XHRpZiAoIHRhcmdldC5sZW5ndGgpIHtcblx0XHRcdFx0LyogZ2xvYmFsIGJyZWFrcG9pbnQgKi9cblx0XHRcdFx0dmFyIGhhc2hPZmZzZXQgPSAkKGhhc2gpLm9mZnNldCgpLnRvcDtcblx0XHRcdFx0aWYgKCBtaXh0X29wdC5uYXYubW9kZSA9PSAnZml4ZWQnICYmIGJyZWFrcG9pbnQubmFtZSAhPSAncGx1dG8nICYmIGJyZWFrcG9pbnQubmFtZSAhPSAnbWVyY3VyeScgKSB7IGhhc2hPZmZzZXQgLT0gJCgnI21haW4tbmF2Jykub3V0ZXJIZWlnaHQoKTsgfVxuXHRcdFx0XHRodG1sRWwuYWRkKGJvZHlFbCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogaGFzaE9mZnNldCB9LCA2MDApO1xuXHRcdFx0fVxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBoYXNoO1xuXHRcdH1cblx0fSk7XG5cdC8vIElnbm9yZSBzcGVjaWZpYyBhbmNob3JzXG5cdCQoJy50YWJzIGEsIC52Y190dGEgYScpLmF0dHIoJ2RhdGEtbm8taGFzaC1zY3JvbGwnLCB0cnVlKTtcblxuXG5cdC8vIFNvY2lhbCBJY29uc1xuXHQkKCcuc29jaWFsLWxpbmtzJykubm90KCcuaG92ZXItbm9uZScpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ID0gJCh0aGlzKTtcblxuXHRcdGNvbnQuY2hpbGRyZW4oKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpY29uID0gJCh0aGlzKSxcblx0XHRcdFx0bGluayA9IGljb24uY2hpbGRyZW4oJ2EnKSxcblx0XHRcdFx0ZGF0YUNvbG9yID0gbGluay5hdHRyKCdkYXRhLWNvbG9yJyk7XG5cblx0XHRcdGlmICggY29udC5oYXNDbGFzcygnaG92ZXItYmcnKSB8fCBjb250LnBhcmVudHMoJy5uby1ob3Zlci1iZycpLmxlbmd0aCApIHtcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bGluay5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6IGRhdGFDb2xvciwgYm9yZGVyQ29sb3I6IGRhdGFDb2xvciwgekluZGV4OiAxIH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHsgbGluay5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcnLCBib3JkZXJDb2xvcjogJycsIHpJbmRleDogJycgfSk7IH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGluay5ob3ZlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bGluay5jc3MoeyBjb2xvcjogZGF0YUNvbG9yLCB6SW5kZXg6IDEgfSk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCkgeyBsaW5rLmNzcyh7IGNvbG9yOiAnJywgekluZGV4OiAnJyB9KTsgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cblx0Ly8gRnVuY3Rpb25zIHJ1biBvbiBwYWdlIGxvYWQgYW5kIFwicmVmcmVzaFwiIGV2ZW50XG5cdGZ1bmN0aW9uIHJ1bk9uUmVmcmVzaCgpIHtcblx0XHQvLyBUb29sdGlwcyBJbml0XG5cdFx0JCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXSwgLnJlbGF0ZWQtdGl0bGUtdGlwJykudG9vbHRpcCh7XG5cdFx0XHRwbGFjZW1lbnQ6ICdhdXRvJyxcblx0XHRcdGNvbnRhaW5lcjogJ2JvZHknXG5cdFx0fSk7XG5cblxuXHRcdC8vIE9uIEhvdmVyIEFuaW1hdGlvbnMgSW5pdFxuXHRcdHZhciBhbmltSG92ZXJFbCA9ICQoJy5hbmltLW9uLWhvdmVyJyk7XG5cdFx0YW5pbUhvdmVyRWwuaG92ZXJJbnRlbnQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaG92ZXJlZCcpO1xuXHRcdFx0dmFyIGlubmVyICAgPSAkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKSxcblx0XHRcdFx0YW5pbUluICA9IGlubmVyLmRhdGEoJ2FuaW0taW4nKSB8fCAnZmFkZUluJyxcblx0XHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xuXHRcdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbU91dCkuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltSW4pO1xuXHRcdH0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaG92ZXJlZCcpO1xuXHRcdFx0dmFyIGlubmVyICAgPSAkKHRoaXMpLmNoaWxkcmVuKCcub24taG92ZXInKSxcblx0XHRcdFx0YW5pbUluICA9IGlubmVyLmRhdGEoJ2FuaW0taW4nKSB8fCAnZmFkZUluJyxcblx0XHRcdFx0YW5pbU91dCA9IGlubmVyLmRhdGEoJ2FuaW0tb3V0JykgfHwgJ2ZhZGVPdXQnO1xuXHRcdFx0aW5uZXIucmVtb3ZlQ2xhc3MoYW5pbUluKS5hZGRDbGFzcyhhbmltT3V0KTtcblx0XHR9LCAzMDApO1xuXHRcdGFuaW1Ib3ZlckVsLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgTVNBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISAkKHRoaXMpLmhhc0NsYXNzKCdob3ZlcmVkJykgKSB7XG5cdFx0XHRcdCQodGhpcykuY2hpbGRyZW4oJy5vbi1ob3ZlcicpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHZpZXdwb3J0Lm9uKCdyZWZyZXNoJywgZnVuY3Rpb24oKSB7XG5cdFx0cnVuT25SZWZyZXNoKCk7XG5cdH0pLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblxuXG5cdC8vIEJhY2sgVG8gVG9wIEJ1dHRvblxuXHRmdW5jdGlvbiBiYWNrVG9Ub3BEaXNwbGF5KCkge1xuXHRcdHZhciBzY3JvbGxUb3AgPSB2aWV3cG9ydC5zY3JvbGxUb3AoKTtcblx0XHRpZiAoIHNjcm9sbFRvcCA+IDIwMCApIHtcblx0XHRcdGJhY2tUb1RvcC5mYWRlSW4oMzAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YmFja1RvVG9wLmZhZGVPdXQoMzAwKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgYmFja1RvVG9wID0gJCgnI2JhY2stdG8tdG9wJyk7XG5cblx0aWYgKCBiYWNrVG9Ub3AubGVuZ3RoICkge1xuXHRcdHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCAkLnRocm90dGxlKCAxMDAwLCBiYWNrVG9Ub3BEaXNwbGF5ICkpLnNjcm9sbCgpO1xuXG5cdFx0YmFja1RvVG9wLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdGh0bWxFbC5hZGQoYm9keUVsKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDYwMCk7XG5cdFx0fSk7XG5cdH1cblxufSkoalF1ZXJ5KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
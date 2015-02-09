
/* ------------------------------------------------ /
MIXT INTEGRATION FUNCTIONS
/ ------------------------------------------------ */

'use strict';

// Lighten / Darken Color
function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return '#'+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

// Blend Colors
function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return '#'+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

// Light Or Dark Image Detect
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

// RUN ON PAGE LOAD

jQuery( document ).ready( function( $ ) {

    // Add Bootstrap Classes

    $('input.search-field').addClass('form-control');

    $('.comment-reply-link').addClass('btn btn-primary');

    $('#commentsubmit').addClass('btn btn-primary');

    $('input.search-field').addClass('form-control');
    $('input.search-submit').addClass('btn btn-default');

    $('.widget_rss ul').addClass('media-list');

    $('.widget_meta ul, .widget_recent_entries ul, .widget_archive ul, .widget_categories ul, .widget_nav_menu ul, .widget_pages ul').addClass('nav');

    $('.widget_recent_comments ul#recentcomments').css('list-style', 'none').css('padding-left', '0');
    $('.widget_recent_comments ul#recentcomments li').css('padding', '5px 15px');

    $('table#wp-calendar').addClass('table table-striped');

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
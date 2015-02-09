
// MIXT Live Customizer Integration

( function( $ ) {

    'use strict';

    // Site title and description.
    wp.customize('blogname', function( value ) {
        value.bind( function( to ) {
            $('.site-title a').text( to );
        });
    });
    wp.customize('blogdescription', function( value ) {
        value.bind( function( to ) {
            $('.site-description').text( to );
        });
    });

    // Header text color.
    wp.customize('header_textcolor', function( value ) {
        value.bind( function( to ) {
            if ( 'blank' === to ) {
                $( '.site-title, .site-description' ).css({
                    'clip': 'rect(1px, 1px, 1px, 1px)',
                    'position': 'absolute'
                });
            } else {
                $( '.site-title, .site-description' ).css({
                    'clip': 'auto',
                    'color': to,
                    'position': 'relative'
                });
            }
        });
    });

    // REDUX OPTIONS

    wp.customize('mixt_opt[background-type]', function( value ) {
        console.log(value);
        value.bind( function(newVal) {
            console.log(newVal);
        });
    });

    wp.customize('mixt_opt[background-color]', function( value ) {
        console.log(value);
        value.bind( function(newVal) {
            $('body, #content-wrap').css('background-color', newVal);
            console.log(newVal);
        });
    });

})(jQuery);
<?php

// Google Maps Shortcode

add_shortcode( 'mixt_map', 'mixt_map_shortcode' );
function mixt_map_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'height' => '300px',
		'class' => '',
	), $atts ) );

	$classes = 'mixt-map shortcode-map';
	if ( ! empty($class) ) $classes .= ' ' . $class;

	$content = html_entity_decode( $content );

	$output = "<div class='$classes' style='height: $height'>";
		$output .= $content;
	$output .= '</div>';
	
	return $output;
}

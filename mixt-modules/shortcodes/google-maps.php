<?php

// Google Maps Shortcode

add_shortcode( 'mixt_map', 'mixt_map_shortcode' );
function mixt_map_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'height' => '300px',
		'class' => '',
	), $atts ) );

	$classes = 'mixt-map map-sc';
	if ( ! empty($class) ) $classes .= ' ' . $class;

	$content = html_entity_decode( $content );

	$html = "<div class='$classes' style='height: $height'>";
		$html .= $content;
	$html .= '</div>';
	
	return $html;
}

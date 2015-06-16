<?php

// Flipcard Shortcode

add_shortcode( 'mixt_flipcard', 'mixt_flipcard_shortcode' );
function mixt_flipcard_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'back'  => '',
		'dir'   => 'vertical',
		'class' => '',
	), $atts ) );

	$content = wpb_js_remove_wpautop($content, true);

	$classes = 'flip-card';
	if ( ! empty($class) ) $classes .= ' ' . $class;
	if ( $dir == 'horizontal' ) $classes .= ' flipY';

	$output = "<div class='$classes'><div class='inner'>";
		$output .= "<div class='front'>$content</div><div class='back'>$back</div>";
	$output .= '</div></div>';
	return $output;
}

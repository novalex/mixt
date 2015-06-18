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

	$classes = 'flip-card flipcard-sc';
	if ( ! empty($class) ) $classes .= ' ' . $class;
	if ( $dir == 'horizontal' ) $classes .= ' flipY';

	$html = "<div class='$classes'><div class='inner'>";
		$html .= "<div class='front'>$content</div><div class='back'>$back</div>";
	$html .= '</div></div>';

	return $html;
}

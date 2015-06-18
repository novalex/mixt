<?php

// Headline Shortcode

add_shortcode( 'mixt_headline', 'mixt_headline_shortcode' );
function mixt_headline_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'text'         => '',
		'align'        => 'left',
		'tag'          => 'h3',
		'color'        => '',
		'style'        => '',
		'color'        => '',
		'color_custom' => '',
		'class'        => '',
	), $atts ) );

	$classes = 'title headline headline-sc';
	if ( $align == 'center' ) $classes .= ' center';
	if ( ! empty($class) ) $classes .= ' ' . $class;

	if ( empty($text) ) $text = $content;

	$line_class = '';
	if ( $color == '' ) $line_class .= 'theme-bd';
	else if ( $color == 'accent' ) $line_class .= 'theme-accent-bd';
	else { $line_class .= ' ' . $color; }
	if ( ! empty($style) ) $line_class .= ' ' . $style;

	$html = "<div class='$classes'>";
		if ( $align == 'center' || $align == 'right' ) { $html .= '<span class="line-left ' . $line_class . '"></span>'; }
		$html .= "<$tag class='title-text'>$text</$tag>";
		if ( $align == 'center' || $align == 'left' ) { $html .= '<span class="line-right ' . $line_class . '"></span>'; }
	$html .= '</div>';

	return $html;
}
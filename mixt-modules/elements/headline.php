<?php

/**
 * Headline Element
 */
class MixtHeadline {

	public $colors;
	
	public function __construct() {
		$this->colors = array_merge( mixt_get_colors('elements'), array( 'custom' => __( 'Custom color', 'mixt' ) ) );
		
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_headline', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_headline',
			'title'    => __( 'Headline', 'mixt' ),
			'template' => '[mixt_headline {{attributes}}]{{content}}[/mixt_headline]',
			'params'   => array(
				'content' => array(
					'type'  => 'text',
					'label' => __( 'Text', 'mixt' ),
					'desc'  => __( 'Heading text', 'mixt' ),
				),
				'align' => array(
					'type'    => 'select',
					'label'   => __( 'Align', 'mixt' ),
					'desc'    => __( 'Heading alignment', 'mixt' ),
					'options' => array(
						'left'   => __( 'Left', 'mixt' ),
						'center' => __( 'Center', 'mixt' ),
						'right'  => __( 'Right', 'mixt' ),
					),
				),
				'tag' => array(
					'type'    => 'select',
					'label'   => __( 'Tag', 'mixt' ),
					'desc'    => __( 'Heading tag', 'mixt' ),
					'options' => array(
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
					),
					'std' => 'h3',
				),
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Line Style', 'mixt' ),
					'options' => array(
						'solid'  => __( 'Solid', 'mixt' ),
						'dashed' => __( 'Dashed', 'mixt' ),
						'dotted' => __( 'Dotted', 'mixt' ),
						'double' => __( 'Double', 'mixt' ),
					),
				),
				'color' => array(
					'type'    => 'select',
					'label'   => __( 'Color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select all-colors',
				),
				'color_custom' => array(
					'type'     => 'colorpicker',
					'label'    => __( 'Custom Color', 'mixt' ),
					'required' => array( 'color', '=', 'custom' ),
				),
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		vc_map( array(
			'name'        => __( 'Headline', 'mixt' ),
			'description' => __( 'Heading with lines on the side', 'mixt' ),
			'base'        => 'mixt_headline',
			'icon'        => 'mixt_headline',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Text', 'mixt' ),
					'description' => __( 'Heading text', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Align', 'mixt' ),
					'description' => __( 'Heading alignment', 'mixt' ),
					'param_name'  => 'align',
					'value'       => array(
						__( 'Left', 'mixt' )   => 'left',
						__( 'Center', 'mixt' ) => 'center',
						__( 'Right', 'mixt' )  => 'right',
					),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Tag', 'mixt' ),
					'description' => __( 'Heading tag', 'mixt' ),
					'param_name'  => 'tag',
					'value'       => array(
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
					),
					'std' => 'h3',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Line Style', 'mixt' ),
					'param_name'  => 'style',
					'value'       => array(
						__( 'Solid', 'mixt' )  => 'solid',
						__( 'Dashed', 'mixt' ) => 'dashed',
						__( 'Dotted', 'mixt' ) => 'dotted',
						__( 'Double', 'mixt' ) => 'double',
					),
				),
				array(
					'type'               => 'dropdown',
					'heading'            => __( 'Color', 'js_composer' ),
					'param_name'         => 'color',
					'value'              => array_flip($this->colors),
					'param_holder_class' => 'vc_colored-dropdown',
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Custom Color', 'js_composer' ),
					'param_name' => 'color_custom',
					'dependency' => array(
						'element' => 'color',
						'value'   => array( 'custom' ),
					),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),
			),
		));
	}

	/**
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
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

		$classes = 'title headline mixt-headline mixt-element';
		if ( $align == 'center' ) $classes .= ' center';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		if ( empty($text) ) $text = do_shortcode($content);

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
}
new MixtHeadline;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Headline extends WPBakeryShortCode {}
}

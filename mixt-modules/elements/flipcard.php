<?php

/**
 * Flipcard Element
 */
class MixtFlipcard {
	
	public function __construct() {
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_flipcard', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_flipcard',
			'title'    => __( 'Flip Card', 'mixt' ),
			'template' => '[mixt_flipcard {{attributes}}]{{content}}[/mixt_flipcard]',
			'params'   => array(
				'content' => array(
					'type'   => 'textarea',
					'label'  => __( 'Front Side', 'mixt' ),
				),
				'back' => array(
					'type'   => 'textarea',
					'label'  => __( 'Back Side', 'mixt' ),
				),
				'dir' => array(
					'type'    => 'select',
					'label'   => __( 'Direction', 'mixt' ),
					'desc'    => __( 'Direction of the card flip', 'mixt' ),
					'options' => array(
						'vertical'   => __( 'Vertical', 'mixt' ),
						'horizontal' => __( 'Horizontal', 'mixt' ),
					),
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
			'name'        => __( 'Flip Card', 'mixt' ),
			'description' => __( 'Two sided card that flips', 'mixt' ),
			'base'        => 'mixt_flipcard',
			'icon'        => 'mixt_flipcard',
			'category'    => 'MIXT',
			'as_parent'   => array('except' => 'flipcard'),
			'js_view'     => 'VcColumnView',
			'params'      => array(
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Back Side', 'mixt' ),
					'description' => __( 'Content for the back of the card', 'mixt' ),
					'param_name'  => 'back',
					'value'       => __( 'Flip Card Back Side', 'mixt' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Direction', 'mixt' ),
					'description' => __( 'Direction of the card flip', 'mixt' ),
					'param_name'  => 'dir',
					'admin_label' => true,
					'value'       => array(
						__( 'Vertical', 'mixt' )   => 'vertical',
						__( 'Horizontal', 'mixt' ) => 'horizontal',
					),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),
				array(
					'type'       => 'css_editor',
					'heading'    => __( 'CSS', 'mixt' ),
					'group'      => __( 'Design Options', 'mixt' ),
					'param_name' => 'css',
				),
			),
		) );
	}

	/**
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'back'  => '',
			'dir'   => 'vertical',
			'css'   => '',
			'class' => '',
		), $atts ) );

		$classes = 'flip-card mixt-flipcard mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;
		if ( $dir == 'horizontal' ) $classes .= ' flipY';

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_flipcard', $atts );
		}

		if ( ! empty($content) ) $content = do_shortcode($content);

		return "<div class='$classes'><div class='inner'>" .
					"<div class='front'>$content</div><div class='back'>$back</div>" .
				"</div></div>";
	}
}
new MixtFlipcard;

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Flipcard extends WPBakeryShortCodesContainer {}
}

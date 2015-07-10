<?php

/**
 * Flipcard Element
 */
class MixtFlipcard {

	public $colors;
	
	public function __construct() {
		$this->colors = array_merge(mixt_get_assets('colors', 'basic'), array('transparent' => __( 'Transparent', 'mixt' )));

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
					'label'  => __( 'Content', 'mixt' ),
					'desc'   => __( 'The card\'s content. Separate the front and back side content with 3 underscores (___)', 'mixt' ),
					'std'    => "Front Side\n___\nBack Side",
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
				'front_color' => array(
					'type'    => 'select',
					'label'   => __( 'Front Color', 'mixt' ),
					'desc'    => __( 'Front side color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select basic-colors',
					'std'     => 'white',
				),
				'back_color' => array(
					'type'    => 'select',
					'label'   => __( 'Back Color', 'mixt' ),
					'desc'    => __( 'Back side color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select basic-colors',
					'std'     => 'black',
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
			'params'      => array(
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Content', 'mixt' ),
					'description' => __( 'The card\'s content. Separate the front and back side content with 3 underscores (___)', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
					'value'       => "Front Side\n___\nBack Side",
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
					'type'        => 'dropdown',
					'heading'     => __( 'Front Color', 'mixt' ),
					'description' => __( 'Front side color', 'mixt' ),
					'param_name'  => 'front_color',
					'value'       => array_flip($this->colors),
					'std'         => 'white',
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Back Color', 'mixt' ),
					'description' => __( 'Back side color', 'mixt' ),
					'param_name'  => 'back_color',
					'value'       => array_flip($this->colors),
					'std'         => 'black',
					'param_holder_class' => 'color-select basic-colors',
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
			'dir'         => 'vertical',
			'front_color' => 'white',
			'back_color'  => 'black',
			'css'         => '',
			'class'       => '',
		), $atts ) );

		$classes = 'flip-card mixt-flipcard mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;
		if ( $dir == 'horizontal' ) $classes .= ' flipY';

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_flipcard', $atts );
		}

		$content_front = $content_back = '';
		$content = explode('___', $content);
		if ( ! empty($content[0]) ) $content_front = do_shortcode($content[0]);
		if ( ! empty($content[1]) ) $content_back = do_shortcode($content[1]);
		$classes_front = 'front ' . $front_color;
		$classes_back  = 'back ' . $back_color;

		return "<div class='$classes'><div class='inner'>" .
				   "<div class='$classes_front'>$content_front</div>" .
				   "<div class='$classes_back'>$content_back</div>" .
			   "</div></div>";
	}
}
new MixtFlipcard;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Flipcard extends WPBakeryShortCode {}
}

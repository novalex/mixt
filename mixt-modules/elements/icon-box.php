<?php

/**
 * Icon Box Element
 */
class MixtIconBox {

	public $colors;
	public $styles;
	
	public function __construct() {
		$this->colors = mixt_get_assets('colors', 'basic');
		$this->styles = mixt_element_assets('icon-styles');

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_iconbox', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_iconbox',
			'title'    => __( 'Icon Box', 'mixt' ),
			'template' => '[mixt_iconbox {{attributes}}]{{content}}[/mixt_iconbox]',
			'params'   => array(
				'icon' => array(
					'type'  => 'text',
					'label' => __( 'Icon', 'mixt' ),
					'std'   => 'fa fa-play',
				),
				'icon_pos' => array(
					'type'    => 'select',
					'label'   => __( 'Icon Position', 'mixt' ),
					'options' => array(
						'top'    => __( 'Top', 'mixt' ),
						'left'   => __( 'Left', 'mixt' ),
						'right'  => __( 'Right', 'mixt' ),
						'bottom' => __( 'Bottom', 'mixt' ),
					),
				),
				'icon_out' => array(
					'type'  => 'checkbox',
					'label' => __( 'Icon Outside', 'mixt' ),
					'desc'  => __( 'Position icon outside of the box', 'mixt' ),
				),
				'content' => array(
					'type'   => 'textarea',
					'label'  => __( 'Content', 'mixt' ),
					'desc'   => __( 'The box\'s content', 'mixt' ),
				),
				'color' => array(
					'type'    => 'select',
					'label'   => __( 'Color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select basic-colors',
					'std'     => 'white',
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
			'name'        => __( 'Icon Box', 'mixt' ),
			'description' => __( 'A box... with an icon!', 'mixt' ),
			'base'        => 'mixt_iconbox',
			'icon'        => 'mixt_iconbox',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'icon',
					'admin_label' => true,
					'std'         => 'fa fa-check',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Position', 'mixt' ),
					'param_name' => 'icon_pos',
					'value'      => array(
						__( 'Top', 'mixt' )    => 'top',
						__( 'Left', 'mixt' )   => 'left',
						__( 'Right', 'mixt' )  => 'right',
						__( 'Bottom', 'mixt' ) => 'bottom',
					),
				),
				array(
					'type'        => 'checkbox',
					'heading'     => __( 'Icon Outside', 'mixt' ),
					'description' => __( 'Position icon outside of the box', 'mixt' ),
					'param_name'  => 'icon_out',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Style', 'mixt' ),
					'param_name' => 'icon_style',
					'value'      => array_flip($this->styles),
					'std'        => 'default',
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Content', 'mixt' ),
					'description' => __( 'The box\'s content', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Color', 'mixt' ),
					'param_name'  => 'color',
					'value'       => array_flip($this->colors),
					'std'         => 'white',
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
			'icon'       => 'fa fa-check',
			'icon_pos'   => 'top',
			'icon_out'   => false,
			'icon_style' => 'default',
			'color'      => 'white',
			'css'        => '',
			'class'      => '',
		), $atts ) );

		$classes = 'mixt-iconbox mixt-element';
		if ( $icon_out ) $classes .= ' icon-outside';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_iconbox', $atts );
		}

		$icon .= $icon_pos . ' ' . $color;
		if ( $icon_style != 'default' ) $icon .= ' ' . $icon_style;

		ob_start();
		?>

		<div class="<?php echo $classes; ?>">
			<i class="<?php echo $icon; ?>"></i>
			<div class="content">
				<?php echo do_shortcode(html_entity_decode($content)); ?>
			</div>
		</div>
		<?php

		return ob_get_clean();
	}
}
new MixtIconBox;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_IconBox extends WPBakeryShortCode {}
}

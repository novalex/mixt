<?php

/**
 * Icon List Element
 */
class Mixt_Iconlist extends Mixt_Element {

	/**
	 * @var array $colors
	 * @var array $icon_sizes
	 * @var array $icon_styles
	 * @var array $icon_colors
	 * @var array $image_styles
	 */
	public $colors, $icon_sizes, $icon_styles, $icon_colors, $image_styles;
	
	public function __construct() {
		parent::__construct();

		$this->colors = mixt_get_assets('colors', 'basic');
		$this->icon_styles = mixt_element_assets('icon-styles');
		$this->icon_sizes = mixt_element_assets('icon-sizes');
		$this->icon_colors = array_merge(
			array( 'auto' => __( 'Auto', 'mixt' ) ),
			$this->colors
		);
		$this->image_styles = mixt_element_assets('image-styles');

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_iconlist', array($this, 'list_shortcode'));
		add_shortcode('mixt_iconlist_item', array($this, 'item_shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_iconlist',
			'title'    => __( 'Icon List', 'mixt' ),
			'template' => '[mixt_iconlist {{attributes}}]{{nested}}[/mixt_iconlist]',
			'params'   => array(
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
			'nested'  => array(
				'template' => '[mixt_iconlist_item {{attributes}}]{{content}}[/mixt_iconlist_item]',
				'params' => array(
					'content' => array(
						'type'   => 'encoded_textarea',
						'label'  => __( 'Content', 'mixt' ),
					),
					'align' => array(
						'type'    => 'select',
						'label'   => __( 'Icon Position', 'mixt' ),
						'options' => array(
							'left'  => __( 'Left', 'mixt' ),
							'right' => __( 'Right', 'mixt' ),
						),
						'std'     => 'left',
					),
					'animation' => array(
						'type'    => 'select',
						'label'   => __( 'Animation', 'mixt' ),
						'options' => $this->animations,
					),
					'icon_type' => array(
						'type'    => 'select',
						'label'   => __( 'Icon Type', 'mixt' ),
						'options' => array(
							'icon'  => __( 'Font Icon', 'mixt' ),
							'image' => __( 'Image', 'mixt' ),
						),
						'std'     => 'icon',
					),
					'icon' => array(
						'type'     => 'text',
						'label'    => __( 'Icon', 'mixt' ),
						'std'      => 'fa fa-check',
						'required' => array('icon_type', '=', 'icon'),
					),
					'icon_style' => array(
						'type'     => 'select',
						'label'    => __( 'Icon Style', 'mixt' ),
						'options'  => $this->icon_styles,
						'required' => array('icon_type', '=', 'icon'),
					),
					'icon_color' => array(
						'type'     => 'select',
						'label'    => __( 'Icon Color', 'mixt' ),
						'options'  => $this->icon_colors,
						'class'    => 'color-select basic-colors',
						'std'      => 'auto',
						'required' => array('icon_type', '=', 'icon'),
					),
					'image' => array(
						'type'     => 'media',
						'label'    => __( 'Icon', 'mixt' ),
						'required' => array('icon_type', '=', 'image'),
					),
					'image_style' => array(
						'type'     => 'select',
						'label'    => __( 'Icon Style', 'mixt' ),
						'options'  => $this->image_styles,
						'required' => array('icon_type', '=', 'image'),
					),
					'icon_bg' => array(
						'type'    => 'select',
						'label'   => __( 'Icon Background / Border Color', 'mixt' ),
						'options' => $this->colors,
						'class'   => 'color-select basic-colors',
						'std'     => '',
					),
					'icon_size' => array(
						'type'    => 'select',
						'label'   => __( 'Icon Size', 'mixt' ),
						'options' => $this->icon_sizes,
						'std'     => '',
					),
					'icon_anim' => array(
						'type'    => 'select',
						'label'   => __( 'Icon Animation', 'mixt' ),
						'options' => $this->icon_anims,
					),
					'class' => array(
						'type'  => 'text',
						'label' => __( 'Extra Classes', 'mixt' ),
					),
				),
				'presets' => array(
					array(
						'icon' => 'fa fa-check',
					),
				),
				'child_title'  => __( 'List Item', 'mixt' ),
				'clone_button' => __( 'Add Item', 'mixt' ),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		// List
		vc_map( array(
			'name'        => __( 'Icon List', 'mixt' ),
			'description' => __( 'List with icons', 'mixt' ),
			'base'        => 'mixt_iconlist',
			'icon'        => 'mixt_element',
			'category'    => 'MIXT',
			'as_parent'   => array('only' => 'mixt_iconlist_item'),
			'js_view'     => 'VcColumnView',
			'params'      => array(
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

		// List Item
		vc_map( array(
			'name'        => __( 'Icon List Item', 'mixt' ),
			'base'        => 'mixt_iconlist_item',
			'icon'        => 'mixt_element',
			'category'    => 'MIXT',
			'as_child'    => array('only' => 'mixt_iconlist'),
			'params'      => array(
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Position', 'mixt' ),
					'param_name' => 'align',
					'value'      => array(
						__( 'Left', 'mixt' )  => 'left',
						__( 'Right', 'mixt' ) => 'right',
					),
					'std'        => 'left',
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Content', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Animation', 'mixt' ),
					'param_name' => 'animation',
					'value'      => array_flip($this->animations),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),

				// Icon Tab
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Icon Type', 'mixt' ),
					'value'       => array(
						__( 'Image', 'mixt' ) => 'image',
						__( 'Font Awesome', 'js_composer' ) => 'fontawesome',
						// __( 'Open Iconic', 'js_composer' ) => 'openiconic',
						// __( 'Typicons', 'js_composer' ) => 'typicons',
						// __( 'Entypo', 'js_composer' ) => 'entypo',
						__( 'Linecons', 'js_composer' ) => 'linecons',
						// __( 'Pixel', 'js_composer' ) => 'pixelicons',
					),
					'param_name'  => 'icon_type',
					'std'         => 'fontawesome',
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'icon_fontawesome',
					'value'       => 'fa fa-check',
					'settings'    => array( 'emptyIcon' => false ),
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'fontawesome' ),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'icon_linecons',
					'settings'    => array(
						'emptyIcon' => false,
						'type'      => 'linecons',
					),
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'linecons' ),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Style', 'mixt' ),
					'param_name' => 'icon_style',
					'value'      => array_flip($this->icon_styles),
					'std'        => 'default',
					'dependency' => array(
						'element' => 'icon_type',
						'value'   => array('fontawesome', 'linecons'),
					),
					'group'      => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Icon Color', 'mixt' ),
					'param_name'  => 'icon_color',
					'value'       => array_flip($this->icon_colors),
					'std'         => 'auto',
					'param_holder_class' => 'color-select basic-colors',
					'dependency'  => array(
						'element' => 'icon_type',
						'value'   => array('fontawesome', 'linecons'),
					),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'attach_image',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'image',
					'dependency'  => array(
						'element' => 'icon_type',
						'value'   => 'image',
					),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Icon Style', 'mixt' ),
					'param_name'  => 'image_style',
					'value'       => array_flip($this->image_styles),
					'dependency'  => array(
						'element' => 'icon_type',
						'value'   => 'image',
					),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Icon Background / Border Color', 'mixt' ),
					'param_name'  => 'icon_bg',
					'value'       => array_flip($this->colors),
					'std'         => '',
					'param_holder_class' => 'color-select basic-colors',
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Icon Size', 'mixt' ),
					'param_name'  => 'icon_size',
					'value'       => array_flip($this->icon_sizes),
					'std'         => '',
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Animation', 'mixt' ),
					'param_name' => 'icon_anim',
					'value'      => array_flip($this->icon_anims),
					'group'       => __( 'Icon', 'mixt' ),
				),

				// Design Tab
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
	 * Render list shortcode
	 */
	public function list_shortcode( $atts, $content = null ) {
		$args = shortcode_atts( array(
			'class' => '',
			'css'   => '',
		), $atts );

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_iconlist', $atts );
		}

		extract($args);

		$classes = 'mixt-iconlist mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		return "<ul class='$classes'>" . do_shortcode($content) . '</ul>';
	}

	/**
	 * Render list item shortcode
	 */
	public function item_shortcode( $atts, $content = null ) {
		$args = shortcode_atts( array(
			'align'            => 'left',
			'animation'        => '',
			'class'            => '',
			'css'              => '',
			
			'icon'             => '',
			'icon_style'       => 'default',
			'image'            => '',
			'image_style'      => '',
			'icon_color'       => 'auto',
			'icon_bg'          => '',
			'icon_size'        => '',
			'icon_anim'        => '',
			'icon_type'        => 'fontawesome',
			'icon_fontawesome' => 'fa fa-check',
			'icon_linecons'    => '',
		), $atts );

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_iconlist_item', $atts );
		}

		if ( ! empty($args['animation']) ) $args['class'] .= ' ' . $this->element_animate($args['animation']);

		$args['icon'] = mixt_element_icon_class($args);

		extract($args);

		// Icon
		if ( $icon_type == 'image' ) {
			$img_classes = 'icon mixt-image';
			if ( $icon_size != '' ) $img_classes .= ' ' . $icon_size;
			$img_wrap_classes = 'image-wrap ' . $image_style;
			if ( $icon_bg != '' ) { $img_wrap_classes .= ' ' . $icon_bg; }
			$icon_html = "<div class='$img_classes'><div class='$img_wrap_classes'>" . wp_get_attachment_image($image, 'full') . "</div></div>";
		} else {
			$icon_classes = 'icon mixt-icon ' . $icon_style;
			if ( $icon_size != '' ) $icon_classes .= ' ' . $icon_size;
			if ( $icon_style != 'default' ) {
				if ( $icon_bg != '' ) { $icon_classes .= ' ' . $icon_bg; }
				if ( $icon_anim != '' ) { $icon_classes .= " anim $icon_anim"; }
			}
			$icon_html = "<span class='$icon_classes'><i class='$icon $icon_color'></i></span>";
		}

		$icon_html = '<div class="icon-wrap">' . $icon_html . '</div>';

		ob_start();
		?>

		<li class="mixt-iconlist-item <?php echo $class; ?>">
			<?php if ( $align == 'left' ) { echo $icon_html; } ?>
			<span class="content-wrap"><?php echo $content; ?></span>
			<?php if ( $align == 'right' ) { echo $icon_html; } ?>
		</li>

		<?php

		return ob_get_clean();
	}
}
new Mixt_Iconlist;

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Iconlist extends WPBakeryShortCodesContainer {}
}

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Iconlist_Item extends WPBakeryShortCode {}
}

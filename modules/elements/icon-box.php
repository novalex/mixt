<?php

/**
 * Icon Box Element
 */
class Mixt_Iconbox extends Mixt_Element {

	/**
	 * @var array $colors
	 * @var array $icon_sizes
	 * @var array $icon_styles
	 * @var array $icon_colors
	 * @var array $icon_positions
	 * @var array $image_styles
	 */
	public $colors, $icon_sizes, $icon_styles, $icon_colors, $icon_positions, $image_styles;
	
	public function __construct() {
		parent::__construct();

		$this->colors = mixt_get_assets('colors', 'basic');
		$this->icon_styles = array_merge(
			mixt_element_assets('icon-styles'),
			array( 'background' => __( 'Background', 'mixt' ) )
		);
		$this->icon_sizes = mixt_element_assets('icon-sizes');
		$this->icon_colors = array_merge(
			array( 'auto' => __( 'Auto', 'mixt' ) ),
			$this->colors
		);
		$this->icon_positions = array(
			'top'         => __( 'Top', 'mixt' ),
			'left'        => __( 'Left', 'mixt' ),
			'title-left'  => __( 'Left of title', 'mixt' ),
			'right'       => __( 'Right', 'mixt' ),
			'title-right' => __( 'Right of title', 'mixt' ),
			'bottom'      => __( 'Bottom', 'mixt' ),
		);
		$this->image_styles = mixt_element_assets('image-styles');

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
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Box Style', 'mixt' ),
					'options' => array(
						'plain'    => __( 'Plain', 'mixt' ),
						'bordered' => __( 'Bordered', 'mixt' ),
						'solid'    => __( 'Solid', 'mixt' ),
					),
					'std' => 'plain',
				),
				'box_color' => array(
					'type'     => 'select',
					'label'    => __( 'Box Color', 'mixt' ),
					'options'  => $this->colors,
					'required' => array('style', '=', 'solid'),
					'class'    => 'color-select basic-colors',
					'std'      => 'white',
				),
				'border_color' => array(
					'type'     => 'select',
					'label'    => __( 'Border Color', 'mixt' ),
					'options'  => array_merge(
						array( 'auto' => __( 'Auto', 'mixt' ) ),
						$this->colors
					),
					'required' => array('style', '=', 'bordered'),
					'class'    => 'color-select basic-colors',
					'std'      => 'auto',
				),
				'title' => array(
					'type'  => 'text',
					'label' => __( 'Title', 'mixt' ),
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
				'icon_pos' => array(
					'type'    => 'select',
					'label'   => __( 'Icon Position', 'mixt' ),
					'options' => $this->icon_positions,
					'std'     => 'top',
				),
				'icon_valign' => array(
					'type'     => 'select',
					'label'    => __( 'Icon Alignment', 'mixt' ),
					'options'  => array(
						'top'    => __( 'Top', 'mixt' ),
						'middle' => __( 'Middle', 'mixt' ),
						'bottom' => __( 'Bottom', 'mixt' ),
					),
					'required' => array('icon_pos', '=', 'left|right'),
					'std'      => 'middle',
				),
				'icon_halign' => array(
					'type'     => 'select',
					'label'    => __( 'Icon Alignment', 'mixt' ),
					'options'  => array(
						'left'   => __( 'Left', 'mixt' ),
						'center' => __( 'Center', 'mixt' ),
						'right'  => __( 'Right', 'mixt' ),
					),
					'required' => array('icon_pos', '=', 'top|bottom'),
					'std'      => 'center',
				),
				'icon_anim' => array(
					'type'    => 'select',
					'label'   => __( 'Icon Animation', 'mixt' ),
					'options' => $this->icon_anims,
				),
				'icon_out' => array(
					'type'     => 'checkbox',
					'label'    => __( 'Icon Outside', 'mixt' ),
					'desc'     => __( 'Position icon outside of the box', 'mixt' ),
					'required' => array('icon_pos', '=', 'top|left|right|bottom'),
				),
				'content' => array(
					'type'   => 'encoded_textarea',
					'label'  => __( 'Content', 'mixt' ),
					'desc'   => __( 'The box\'s content', 'mixt' ),
					'std'    => 'Icon box content',
				),
				'animation' => array(
					'type'    => 'select',
					'label'   => __( 'Animation', 'mixt' ),
					'options' => $this->animations,
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
			'description' => __( 'A box with an icon!', 'mixt' ),
			'base'        => 'mixt_iconbox',
			'icon'        => 'mixt_iconbox',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Box Style', 'mixt' ),
					'param_name'  => 'style',
					'value'       => array(
						__( 'Plain', 'mixt' ) => 'plain',
						__( 'Bordered', 'mixt' ) => 'bordered',
						__( 'Solid', 'mixt' ) => 'solid',
					),
					'std' => 'plain',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Box Color', 'mixt' ),
					'param_name'  => 'box_color',
					'value'       => array_flip($this->colors),
					'std'         => 'white',
					'dependency'  => array( 'element' => 'style', 'value' => 'solid' ),
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Border Color', 'mixt' ),
					'param_name'  => 'border_color',
					'value'       => array_flip( array_merge(
						array( 'auto' => __( 'Auto', 'mixt' ) ),
						$this->colors
					) ),
					'std'         => 'auto',
					'dependency'  => array( 'element' => 'style', 'value' => 'bordered' ),
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Title', 'mixt' ),
					'param_name'  => 'title',
					'admin_label' => true,
					'std'         => '',
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Content', 'mixt' ),
					'description' => __( 'The box\'s content', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
					'std'         => 'Icon box content',
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
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'image' ),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Icon Style', 'mixt' ),
					'param_name'  => 'image_style',
					'value'       => array_flip($this->image_styles),
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'image' ),
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
					'heading'    => __( 'Icon Position', 'mixt' ),
					'param_name' => 'icon_pos',
					'value'      => array_flip($this->icon_positions),
					'std'        => 'top',
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Alignment', 'mixt' ),
					'param_name' => 'icon_valign',
					'value'      => array(
						__( 'Top', 'mixt' )    => 'top',
						__( 'Middle', 'mixt' ) => 'middle',
						__( 'Bottom', 'mixt' ) => 'bottom',
					),
					'dependency'  => array(
						'element' => 'icon_pos',
						'value'   => array('left', 'right'),
					),
					'std' => 'middle',
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Alignment', 'mixt' ),
					'param_name' => 'icon_halign',
					'value'      => array(
						__( 'Left', 'mixt' )   => 'left',
						__( 'Center', 'mixt' ) => 'center',
						__( 'Right', 'mixt' )  => 'right',
					),
					'dependency'  => array(
						'element' => 'icon_pos',
						'value'   => array('top', 'bottom'),
					),
					'std' => 'center',
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Animation', 'mixt' ),
					'param_name' => 'icon_anim',
					'value'      => array_flip($this->icon_anims),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'checkbox',
					'heading'     => __( 'Icon Outside', 'mixt' ),
					'description' => __( 'Position icon outside of the box', 'mixt' ),
					'param_name'  => 'icon_out',
					'dependency'  => array(
						'element' => 'icon_pos',
						'value'   => array('top', 'left', 'right', 'bottom'),
					),
					'group'       => __( 'Icon', 'mixt' ),
				),

				// Styler
				array(
					'type'       => 'styler',
					'param_name' => 'styler',
					'fields'     => array(
						'bg' => array(
							'selector' => '.inner',
							'label'    => __( 'Background Color', 'mixt' ),
							'pattern'  => 'background-color: {{val}}',
							'group'    => __( 'Box', 'mixt' ),
						),
						'color' => array(
							'selector' => '.inner',
							'label'    => __( 'Text Color', 'mixt' ),
							'pattern'  => 'color: {{val}}',
							'group'    => __( 'Box', 'mixt' ),
						),
						'border' => array(
							'selector' => '.inner',
							'label'    => __( 'Border Color', 'mixt' ),
							'pattern'  => 'border-color: {{val}}',
							'group'    => __( 'Box', 'mixt' ),
						),
						'custom' => array(
							'type'     => 'custom',
							'selector' => '.inner',
							'label'    => __( 'Custom CSS', 'mixt' ),
						),
					),
					'group'      => 'Styler',
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
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		$args = shortcode_atts( array(
			'style'        => 'plain',
			'border_color' => 'auto',
			'box_color'    => 'white',
			'title'        => '',
			'animation'    => '',
			'class'        => '',

			'styler'       => '',

			'css'          => '',

			'icon'         => '',
			'icon_style'   => 'default',
			'image'        => '',
			'image_style'  => '',
			'icon_color'   => 'auto',
			'icon_bg'      => '',
			'icon_size'    => '',
			'icon_pos'     => 'top',
			'icon_valign'  => 'middle',
			'icon_halign'  => 'center',
			'icon_anim'    => '',
			'icon_out'     => false,
			'icon_type'        => 'fontawesome',
			'icon_fontawesome' => 'fa fa-check',
			'icon_linecons'    => '',
		), $atts );

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_iconbox', $atts );
		}

		// Styler custom design
		if ( $args['styler'] != '' ) {
			$args['class'] .= mixt_element_styler($args['styler']);
		}

		$args['icon'] = mixt_element_icon_class($args);

		extract($args);

		// Box Classes
		$classes = 'mixt-iconbox mixt-element icon-cont';
		if ( $icon_style != 'background' ) {
			$classes .=  ' icon-' . $icon_pos;
			if ( $icon_size != '' ) $classes .= ' ' . $icon_size;
			if ( $icon_out ) $classes .= ' icon-outside';
		}
		if ( ! empty($class) ) $classes .= ' ' . $class;
		if ( ! empty($animation) ) $classes .= ' ' . $this->element_animate($animation);

		// Inner Classes
		$inner_classes = 'inner ' . $style;
		if ( $style == 'bordered' ) {
			if ( $border_color == 'auto' ) $border_color = 'theme-bd';
			$inner_classes .= ' ' . $border_color;
		}
		else if ( $style == 'solid' ) $inner_classes .= ' ' . $box_color;
		if ( $icon_pos == 'left' || $icon_pos == 'right' ) { $inner_classes .= ' valign-' . $icon_valign; }
		else if ( $icon_pos == 'top' || $icon_pos == 'bottom' ) { $inner_classes .= ' halign-' . $icon_halign; }

		// Icon
		if ( $icon_type == 'image' ) {
			$img_classes = 'icon mixt-image';
			$img_wrap_classes = 'image-wrap ' . $image_style;
			if ( $icon_bg != '' ) { $img_wrap_classes .= ' ' . $icon_bg; }
			$icon_html = "<div class='$img_classes'><div class='$img_wrap_classes'>" . wp_get_attachment_image($image, 'full') . "</div></div>";
		} else {
			$icon_classes = 'icon mixt-icon';
			if ( $icon_style == 'background' ) {
				$classes .= ' icon-background';
			} else {
				$icon_classes .= ' ' . $icon_style;
				if ( $icon_size != '' ) $icon_classes .= ' ' . $icon_size;
				if ( $icon_style != 'default' ) {
					if ( $icon_bg != '' ) { $icon_classes .= ' ' . $icon_bg; }
					if ( $icon_anim != '' ) { $icon_classes .= " anim $icon_anim"; }
				}
			}
			$icon_html = "<span class='$icon_classes'><i class='$icon $icon_color'></i></span>";
		}

		$icon_html = '<div class="icon-wrap">' . $icon_html . '</div>';

		ob_start();
		?>

		<div class="<?php echo $classes; ?>">
			<div class="<?php echo $inner_classes; ?>">
				<?php if ( $icon_pos == 'top' || $icon_pos == 'left' ) { echo $icon_html; } ?>
				<div class="content"><?php
					if ( $title != '' ) { ?>
						<div class="title-wrap">
							<?php if ( $icon_pos == 'title-left' ) { echo $icon_html; } ?>
							<strong class="title"><?php echo $title; ?></strong>
							<?php if ( $icon_pos == 'title-right' ) { echo $icon_html; } ?>
						</div>
					<?php }
					echo mixt_unautop(html_entity_decode($content)); ?>
				</div>
				<?php if ( $icon_pos == 'right' || $icon_pos == 'bottom' ) { echo $icon_html; } ?>
			</div>
		</div>
		<?php

		return ob_get_clean();
	}
}
new Mixt_Iconbox;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_IconBox extends WPBakeryShortCode {}
}

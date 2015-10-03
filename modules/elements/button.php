<?php

/**
 * Button Element
 */
class Mixt_Button {

	/**
	 * @var array $types
	 * @var array $sizes
	 * @var array $colors
	 * @var array animations
	 * @var array icon_animations
	 */
	public $types, $colors, $animations, $icon_animations;
	
	public function __construct() {
		$this->types = mixt_get_assets('button', 'types');
		$this->sizes = mixt_get_assets('button', 'sizes');
		$this->colors = mixt_get_assets('button', 'colors');
		$this->animations = mixt_get_assets('button', 'animations');
		$this->icon_animations = mixt_get_assets('button', 'icon-animations');

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_button', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_button',
			'title'    => __( 'Button', 'mixt' ),
			'template' => '[mixt_button {{attributes}}][/mixt_button]',
			'params'   => array(
				'type' => array(
					'type'    => 'select',
					'label'   => __( 'Type', 'mixt' ),
					'options' => $this->types,
					'std' => '',
				),
				'size' => array(
					'type'    => 'select',
					'label'   => __( 'Size', 'mixt' ),
					'options' => $this->sizes,
					'std' => '',
				),
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Style', 'mixt' ),
					'options' => array(
						'solid'   => __( 'Solid', 'mixt' ),
						'outline' => __( 'Outlined', 'mixt' ),
					),
					'std' => 'solid',
				),
				'color' => array(
					'type'     => 'select',
					'label'    => __( 'Color', 'mixt' ),
					'options'  => $this->colors,
					'class'    => 'color-select button-colors',
					'std'      => 'default',
				),
				'hover_style' => array(
					'type'    => 'select',
					'label'   => __( 'Hover Style', 'mixt' ),
					'options' => array(
						'solid'   => __( 'Solid', 'mixt' ),
						'outline' => __( 'Outlined', 'mixt' ),
					),
					'std' => 'solid',
				),
				'hover_color' => array(
					'type'     => 'select',
					'label'    => __( 'Hover Color', 'mixt' ),
					'options'  => $this->colors,
					'class'    => 'color-select button-colors',
					'std'      => 'default',
				),
				'text' => array(
					'type'  => 'text',
					'label' => __( 'Text', 'mixt' ),
					'std'   => 'Button Text',
				),
				'link' => array(
					'type'  => 'text',
					'label' => __( 'Link', 'mixt' ),
				),
				'animation' => array(
					'type'    => 'select',
					'label'   => __( 'Animation', 'mixt' ),
					'options' => $this->animations,
				),
				'icon' => array(
					'type'     => 'text',
					'label'    => __( 'Icon', 'mixt' ),
				),
				'icon_align' => array(
					'type'    => 'select',
					'label'   => __( 'Icon Alignment', 'mixt' ),
					'options' => array(
						'left'  => __( 'Left', 'mixt' ),
						'right' => __( 'Right', 'mixt' ),
					),
					'std' => 'left',
				),
				'icon_anim' => array(
					'type'    => 'select',
					'label'   => __( 'Icon Animation', 'mixt' ),
					'options' => $this->icon_animations,
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
			'name'        => __( 'Button', 'mixt' ),
			'description' => __( 'You know you want to press it', 'mixt' ),
			'base'        => 'mixt_button',
			'icon'        => 'mixt_button',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Type', 'mixt' ),
					'param_name' => 'type',
					'value'      => array_flip($this->types),
					'std'        => '',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Size', 'mixt' ),
					'param_name' => 'size',
					'value'      => array_flip($this->sizes),
					'std'        => '',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Style', 'mixt' ),
					'param_name' => 'style',
					'value'      => array(
						__( 'Solid', 'mixt' )    => 'solid',
						__( 'Outlined', 'mixt' ) => 'outline',
					),
					'std'        => 'solid',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Color', 'mixt' ),
					'param_name' => 'color',
					'value'      => array_flip($this->colors),
					'std'        => 'default',
					'param_holder_class' => 'color-select button-colors',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Hover Style', 'mixt' ),
					'param_name' => 'hover_style',
					'value'      => array(
						__( 'Solid', 'mixt' )    => 'solid',
						__( 'Outlined', 'mixt' ) => 'outline',
					),
					'std'        => 'solid',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Hover Color', 'mixt' ),
					'param_name' => 'hover_color',
					'value'      => array_flip($this->colors),
					'std'        => 'default',
					'param_holder_class' => 'color-select button-colors',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Text', 'mixt' ),
					'param_name'  => 'text',
					'admin_label' => true,
					'std'         => 'Button Text',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Link', 'mixt' ),
					'param_name'  => 'link',
					'std'         => '',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Animation', 'mixt' ),
					'param_name' => 'animation',
					'value'      => array_flip($this->animations),
					'std'        => '',
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
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'fontawesome' ),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'icon_linecons',
					'settings'    => array( 'type' => 'linecons' ),
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'linecons' ),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Alignment', 'mixt' ),
					'param_name' => 'icon_align',
					'value'      => array(
						__( 'Left', 'mixt' )  => 'left',
						__( 'Right', 'mixt' ) => 'right',
					),
					'std'        => 'left',
					'group'      => __( 'Icon', 'mixt' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Animation', 'mixt' ),
					'param_name' => 'icon_anim',
					'value'      => array_flip($this->icon_animations),
					'group'      => __( 'Icon', 'mixt' ),
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
			'type'        => '',
			'size'        => '',
			'style'       => 'solid',
			'color'       => 'default',
			'hover_style' => 'solid',
			'hover_color' => 'default',
			'animation'   => '',
			'class'       => '',

			'text'        => 'Button Text',
			'link'        => '',
			
			'css'         => '',
			
			'icon'        => '',
			'icon_align'  => 'left',
			'icon_anim'   => '',
			'icon_type'   => 'fontawesome',
			'icon_fontawesome' => '',
			'icon_linecons'    => '',
		), $atts );

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_button', $atts );
		}

		$args['icon'] = mixt_element_icon_class($args);

		extract($args);

		$classes = 'btn mixt-button';
		$style = ( $style == 'solid' ) ? '' : 'outline-';
		$hover_style = ( $hover_style == 'solid' ) ? '' : 'outline-';
		$classes .= " btn-{$style}{$color}";
		if ( $animation == '' ) {
			$classes .= " btn-hover-{$hover_style}{$hover_color}";
		} else {
			$classes .= " btn-hover-$hover_color btn-$animation btn-$animation-$hover_color";
		}
		if ( $type != '' ) $classes .= " btn-$type";
		if ( $size != '' ) $classes .= " $size";
		if ( $class != '' ) $classes .= " $class";

		$icon_l = $icon_r = '';
		if ( $icon != '' ) {
			$icon = "<i class='$icon'></i>";
			if ( $icon_anim != '' ) {
				if ( $icon_anim == 'icon-goDown' || $icon_anim == 'hover-icon-goDown' ) {
					$classes .= " btn-$icon_anim";
				} else {
					$classes .= ' icon-cont';
					$icon = "<span class='mixt-icon anim $icon_anim'>$icon</span>";
				}
			}
			if ( $icon_align == 'left' ) {
				$classes .= ' icon-l';
				$icon_l = $icon;
			} else {
				$classes .= ' icon-r';
				$icon_r = $icon;
			}
		}

		$link = ( $link == '' ) ? '#' : $link;

		return "<a href='$link' class='$classes'>{$icon_l}{$text}{$icon_r}</a>";
	}
}
new Mixt_Button;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Button extends WPBakeryShortCode {}
}

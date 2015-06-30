<?php

/**
 * Social Icons Element
 */
class MixtSocialIcons {

	public $profiles = array();
	public $btn_colors = array();
	public $btn_sizes = array();

	public function __construct() {
		$this->profiles = $this->profiles_array();
		$this->btn_colors = mixt_get_assets('button', 'colors');
		$this->btn_sizes = mixt_get_assets('button', 'sizes');

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_social', array($this, 'shortcode'));
	}

	/**
	 * Get array of configured social profiles or, if none are found, return preset ones
	 */
	public function profiles_array() {
		global $mixt_opt;
		$array = array();
		$profiles = ( ! empty($mixt_opt['social-profiles']) ) ? $mixt_opt['social-profiles'] : mixt_preset_social_profiles();
		foreach ( $profiles as $key => $profile ) { $array[$key] = $profile['name']; }
		return $array;
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_social',
			'title'    => __( 'Social', 'mixt' ),
			'template' => '[mixt_social {{attributes}}]',
			'params'   => array(
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Icon Style', 'mixt' ),
					'options' => array(
						'plain'   => __( 'Plain', 'mixt' ),
						'buttons' => __( 'Buttons', 'mixt' ),
						'group'   => __( 'Button Group', 'mixt' ),
						'nav'     => __( 'Nav Menu', 'mixt' ),
					),
				),
				'color' => array(
					'type'     => 'select',
					'label'    => __( 'Button Color', 'mixt' ),
					'options'  => $this->btn_colors,
					'required' => array( 'style', '=', 'buttons|group' ),
				),
				'btn_size' => array(
					'type'     => 'select',
					'label'    => __( 'Button Size', 'mixt' ),
					'options'  => $this->btn_sizes,
					'required' => array( 'style', '=', 'buttons|group' ),
				),
				'hover' => array(
					'type' => 'select',
					'label' => __( 'Hover Type', 'mixt' ),
					'options' => array(
						'icon' => __( 'Icon', 'mixt' ),
						'bg'   => __( 'Background', 'mixt' ),
						'none' => __( 'None', 'mixt' ),
					),
				),
				'profiles' => array(
					'type'    => 'checkbox',
					'label'   => _x( 'Profiles', 'social', 'mixt' ),
					'options' => $this->profiles,
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
			'name'        => __( 'Social Icons', 'mixt' ),
			'description' => __( 'Social network profile icons', 'mixt' ),
			'base'        => 'mixt_social',
			'icon'        => 'mixt_social',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Style', 'mixt' ),
					'param_name' => 'style',
					'value'      => array(
						__( 'Plain', 'mixt' ) => 'plain',
						__( 'Buttons', 'mixt' ) => 'buttons',
						__( 'Button Group', 'mixt' ) => 'group',
						__( 'Nav Menu', 'mixt' ) => 'nav',
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Button Color', 'mixt' ),
					'param_name' => 'color',
					'value'      => array_flip($this->btn_colors),
					'dependency' => array( 'element' => 'style', 'value' => array('buttons', 'group') ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Button Size', 'mixt' ),
					'param_name' => 'btn_size',
					'value'      => array_flip($this->btn_sizes),
					'dependency' => array( 'element' => 'style', 'value' => array('buttons', 'group') ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Hover Type', 'mixt' ),
					'param_name'  => 'hover',
					'value'       => array(
						__( 'Icon', 'mixt' )       => 'icon',
						__( 'Background', 'mixt' ) => 'bg',
						__( 'None', 'mixt' )       => 'none',
					),
				),
				array(
					'type'        => 'checkbox',
					'heading'     => _x( 'Profiles', 'social', 'mixt' ),
					'param_name'  => 'profiles',
					'admin_label' => true,
					'value'       => array_flip($this->profiles),
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
	public function shortcode( $atts ) {
		$args = shortcode_atts( array(
			'hover'    => 'icon',
			'profiles' => '',
			'color'    => 'default',
			'btn_size' => 'default',
			'type'     => 'networks',
			'style'    => 'buttons',
			'class'    => '',
			'css'      => '',
		), $atts );

		$args['class'] = 'mixt-social mixt-element ' . $args['class'];

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_social', $atts );
		}

		if ( ! empty($args['profiles']) ) {
			global $mixt_opt;
			$profiles = array();
			$sel_profiles = explode(',', $args['profiles']);
			$set_profiles = ( ! empty($mixt_opt['social-profiles']) ) ? $mixt_opt['social-profiles'] : mixt_preset_social_profiles();
			foreach ( $set_profiles as $key => $profile ) {
				if ( in_array($key, $sel_profiles) ) $profiles[$key] = $profile;
			}
			$args['profiles'] = $profiles;
		}

		return mixt_social_profiles(false, $args);
	}
}
new MixtSocialIcons;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Social extends WPBakeryShortCode {}
}

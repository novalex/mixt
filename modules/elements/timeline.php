<?php

/**
 * Timeline Element
 */
class Mixt_Timeline extends Mixt_Element {

	/**
	 * @var array $colors
	 * @var array $icon_styles
	 * @var array $icon_colors
	 */
	public $colors, $icon_styles, $icon_colors;
	
	function __construct() {
		parent::__construct();

		$this->colors = mixt_get_assets('colors', 'basic');
		$this->icon_styles = mixt_element_assets('icon-styles');
		$this->icon_colors = array_merge(
			array( 'auto' => __( 'Auto', 'mixt' ) ),
			$this->colors
		);

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_timeline', array($this, 'timeline_shortcode'));
		add_shortcode('mixt_timeline_block', array($this, 'timeline_block_shortcode'));

		add_action('wp_ajax_mixt_timeline_styler_parse', array($this, 'parse_styler_ajax'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_timeline',
			'title'    => __( 'Timeline', 'mixt' ),
			'template' => '[mixt_timeline {{attributes}}]{{nested}}[/mixt_timeline]',
			'params'   => array(
				'type' => array(
					'type'    => 'select',
					'label'   => __( 'Type', 'mixt' ),
					'desc'    => __( 'Double sided or single sided timeline', 'mixt' ),
					'options' => array(
						'double' => __( 'Double sided', 'mixt' ),
						'left'   => __( 'Left sided', 'mixt' ),
						'right'  => __( 'Right sided', 'mixt' ),
					),
				),
				'small_align' => array(
					'type'    => 'select',
					'label'   => __( 'Small Screen Align', 'mixt' ),
					'desc'    => __( 'Alignment for small screens, when collapsed into a single column', 'mixt' ),
					'options' => array(
						'left'  => __( 'Left', 'mixt' ),
						'right' => __( 'Right', 'mixt' ),
					),
					'required' => array('type', '=', 'double'),
				),
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
			'nested' => array(
				'template' => '[mixt_timeline_block {{attributes}}]{{content}}[/mixt_timeline_block]',
				'params' => array(
					'style' => array(
						'type'    => 'select',
						'label'   => __( 'Style', 'mixt' ),
						'options' => array(
							'plain'  => __( 'Plain', 'mixt' ),
							'boxed'  => __( 'Boxed', 'mixt' ),
							'bubble' => __( 'Bubble', 'mixt' ),
						),
					),
					'color' => array(
						'type'     => 'select',
						'label'    => __( 'Color', 'mixt' ),
						'options'  => $this->colors,
						'class'    => 'color-select basic-colors',
						'std'      => 'grey',
						'required' => array('style', '=', 'boxed|bubble'),
					),
					'align' => array(
						'type'    => 'select',
						'label'   => __( 'Alignment', 'mixt' ),
						'desc'    => __( 'Display this block to the left or right of the timeline. "Auto" to alternate.', 'mixt' ),
						'options' => array(
							'auto'  => __( 'Auto', 'mixt' ),
							'left'  => __( 'Left', 'mixt' ),
							'right' => __( 'Right', 'mixt' ),
						),
					),
					'icon' => array(
						'type'  => 'text',
						'label' => __( 'Anchor Icon', 'mixt' ),
						'std'   => 'fa fa-circle-o',
					),
					'icon_style' => array(
						'type'    => 'select',
						'label'   => __( 'Anchor Style', 'mixt' ),
						'options' => $this->icon_styles,
						'std'     => 'icon-solid icon-rounded',
					),
					'icon_color' => array(
						'type'    => 'select',
						'label'   => __( 'Anchor Icon Color', 'mixt' ),
						'options' => $this->icon_colors,
						'class'   => 'color-select basic-colors',
						'std'     => 'auto',
					),
					'icon_bg' => array(
						'type'    => 'select',
						'label'   => __( 'Anchor Background / Border Color', 'mixt' ),
						'options' => $this->colors,
						'class'   => 'color-select basic-colors',
						'std'     => 'accent',
					),
					'icon_anim' => array(
						'type'    => 'select',
						'label'   => __( 'Icon Animation', 'mixt' ),
						'options' => $this->icon_anims,
					),
					'content' => array(
						'type'  => 'encoded_textarea',
						'label' => __( 'Content', 'mixt' ),
						'desc'  => __( 'The block\'s content (HTML and shortcodes allowed)', 'mixt' ),
					),
					'animation' => array(
						'type'    => 'select',
						'label'   => __( 'Animation', 'mixt' ),
						'desc'    => __( 'Apply an animation to the element when it becomes visible', 'mixt' ),
						'options' => $this->animations,
					),
					'class' => array(
						'type'  => 'text',
						'label' => __( 'Extra Classes', 'mixt' ),
					),
				),
				'child_title'  => __( 'Timeline Block', 'mixt' ),
				'clone_button' => __( 'Add Block', 'mixt' ),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		// Timeline
		vc_map( array(
			'name'        => __( 'Timeline', 'mixt' ),
			'description' => __( 'A timeline-type layout', 'mixt' ),
			'base'        => 'mixt_timeline',
			'icon'        => 'mixt_timeline',
			'category'    => 'MIXT',
			'as_parent'   => array('only' => 'mixt_timeline_block'),
			'js_view'     => 'VcColumnView',
			'params'      => array(
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Type', 'mixt' ),
					'description' => __( 'Double sided or single sided timeline', 'mixt' ),
					'param_name'  => 'type',
					'value'       => array(
						__( 'Double sided', 'mixt' ) => 'double',
						__( 'Left sided', 'mixt' )   => 'left',
						__( 'Right sided', 'mixt' )  => 'right',
					),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Small Screen Align', 'mixt' ),
					'description' => __( 'Alignment for small screens, when collapsed into a single column', 'mixt' ),
					'param_name'  => 'small_align',
					'value'       => array(
						__( 'Left', 'mixt' )   => 'left',
						__( 'Right', 'mixt' )  => 'right',
					),
					'dependency' => array( 'element' => 'type', 'value' => 'double' ),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),
			),
		) );

		// Timeline Block
		vc_map( array(
			'name'        => __( 'Timeline Block', 'mixt' ),
			'base'        => 'mixt_timeline_block',
			'icon'        => 'mixt_timeline',
			'category'    => 'MIXT',
			'as_child'    => array('only' => 'mixt_timeline'),
			'as_parent'   => array('except' => 'mixt_timeline, mixt_timeline_block'),
			'js_view'     => 'VcColumnView',
			'params'      => array(
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Style', 'mixt' ),
					'param_name' => 'style',
					'value'      => array(
						__( 'Plain', 'mixt' )  => 'plain',
						__( 'Boxed', 'mixt' )  => 'boxed',
						__( 'Bubble', 'mixt' ) => 'bubble',
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Color', 'mixt' ),
					'param_name' => 'color',
					'value'      => array_flip($this->colors),
					'std'        => 'grey',
					'dependency' => array(
						'element' => 'style',
						'value'   => array( 'boxed', 'bubble' ),
					),
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Alignment', 'mixt' ),
					'description' => __( 'Display this block to the left or right of the timeline. "Auto" to alternate.', 'mixt' ),
					'param_name'  => 'align',
					'value'       => array(
						__( 'Auto', 'mixt' )   => 'auto',
						__( 'Left', 'mixt' )   => 'left',
						__( 'Right', 'mixt' )  => 'right',
					),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Anchor Icon Type', 'mixt' ),
					'value'       => array(
						__( 'Font Awesome', 'js_composer' ) => 'fontawesome',
						// __( 'Open Iconic', 'js_composer' ) => 'openiconic',
						// __( 'Typicons', 'js_composer' ) => 'typicons',
						// __( 'Entypo', 'js_composer' ) => 'entypo',
						__( 'Linecons', 'js_composer' ) => 'linecons',
						// __( 'Pixel', 'js_composer' ) => 'pixelicons',
					),
					'param_name'  => 'icon_type',
					'std'         => 'fontawesome',
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Anchor Icon', 'mixt' ),
					'param_name'  => 'icon_fontawesome',
					'value'       => 'fa fa-circle-o',
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'fontawesome' ),
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Anchor Icon', 'mixt' ),
					'param_name'  => 'icon_linecons',
					'settings'    => array(
						'type'      => 'linecons',
					),
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'linecons' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Anchor Style', 'mixt' ),
					'param_name' => 'icon_style',
					'value'      => array_flip($this->icon_styles),
					'std'        => 'icon-solid icon-rounded',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Anchor Icon Color', 'mixt' ),
					'param_name'  => 'icon_color',
					'value'       => array_flip($this->icon_colors),
					'std'         => 'auto',
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Anchor Background / Border Color', 'mixt' ),
					'param_name'  => 'icon_bg',
					'value'       => array_flip($this->colors),
					'std'         => 'accent',
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Animation', 'mixt' ),
					'param_name' => 'icon_anim',
					'value'      => array_flip($this->icon_anims),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Animation', 'mixt' ),
					'description' => __( 'Apply an animation to the element when it becomes visible', 'mixt' ),
					'param_name'  => 'animation',
					'value'       => array_flip($this->animations),
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Extra Classes', 'mixt' ),
					'param_name' => 'class',
				),

				// Styler
				array(
					'type'       => 'styler',
					'param_name' => 'styler',
					'fields'     => array(
						'bg' => array(
							'selector' => '.content',
							'label'    => __( 'Background Color', 'mixt' ),
							'pattern'  => 'background-color: {{val}}',
						),
						'color' => array(
							'selector' => '.content',
							'label'    => __( 'Text Color', 'mixt' ),
							'pattern'  => 'color: {{val}}',
						),
						'border' => array(
							'selector' => '.content',
							'label'    => __( 'Border Color', 'mixt' ),
							'pattern'  => 'border-color: {{val}}',
						),

						'anchor-bg' => array(
							'selector' => '.anchor',
							'label'    => __( 'Background Color', 'mixt' ),
							'pattern'  => 'background-color: {{val}}',
							'group'    => __( 'Anchor', 'mixt' ),
						),
						'anchor-color' => array(
							'selector' => '.anchor',
							'label'    => __( 'Icon Color', 'mixt' ),
							'pattern'  => 'color: {{val}}',
							'group'    => __( 'Anchor', 'mixt' ),
						),
						'anchor-border' => array(
							'selector' => '.anchor',
							'label'    => __( 'Border Color', 'mixt' ),
							'pattern'  => 'border-color: {{val}}',
							'group'    => __( 'Anchor', 'mixt' ),
						),

						'custom' => array(
							'type'  => 'custom',
							'label' => __( 'Custom CSS', 'mixt' ),
						),
					),
					'group'      => 'Styler',
					'parser'     => 'mixt_timeline_styler_parse',
				),
			),
		) );
	}

	/**
	 * Parse Styler CSS
	 * 
	 * @param  array  $css CSS split by selector and property
	 * @return string Parsed CSS string
	 */
	public function parse_styler_css($css = '') {
		if ( empty($css) ) return '';
		$css = mixt_styler_parse($css);
		$parsed_css = $content_props = $anchor_props = '';

		$selector = $css['selector'];

		if ( ! empty($css['rules']['.content']['background-color']) ) {
			$parsed_css .= ".$selector .content, .$selector .content.bubble:before { background-color: {$css['rules']['.content']['background-color']} !important; }";
		}
		if ( ! empty($css['rules']['.content']['border-color']) ) {
			$content_props .= "border-color: {$css['rules']['.content']['border-color']} !important;";
		}
		if ( ! empty($css['rules']['.content']['color']) ) {
			$content_props .= "color: {$css['rules']['.content']['color']} !important;";
		}
		if ( $content_props != '' ) {
			$parsed_css .= ".$selector .content { $content_props }";
		}

		if ( ! empty($css['rules']['.anchor']['background-color']) ) {
			$anchor_props .= "background-color: {$css['rules']['.anchor']['background-color']} !important;";
		}
		if ( ! empty($css['rules']['.anchor']['border-color']) ) {
			$anchor_props .= "border-color: {$css['rules']['.anchor']['border-color']} !important;";
		}
		if ( ! empty($css['rules']['.anchor']['color']) ) {
			$anchor_props .= "color: {$css['rules']['.anchor']['color']} !important;";
		}
		if ( $anchor_props != '' ) {
			$parsed_css .= ".$selector .anchor { $anchor_props }";
		}

		return $parsed_css;
	}

	/**
	 * Parse Styler CSS and return JSON data (used for injecting CSS when editing elements)
	 */
	public function parse_styler_ajax() {
		$css = $_POST['data'];
		echo json_encode($this->parse_styler_css($css));
		die();
	}

	/**
	 * Render timeline shortcode
	 */
	public function timeline_shortcode($atts, $content = null) {
		extract( shortcode_atts( array(
			'type'        => 'double',
			'small_align' => 'left',
			'class'       => '',
		), $atts ) );

		$classes = 'mixt-timeline mixt-element timeline-' . $type;
		if ( $type == 'double' ) $classes .= ' single-' . $small_align;
		if ( ! empty($class) ) $classes .= ' ' . $class;

		return "<div class='$classes'>" . do_shortcode($content) . '</div>';
	}

	/**
	 * Render timeline block shortcode
	 */
	public function timeline_block_shortcode($atts, $content = null) {
		$args = shortcode_atts( array(
			'style'            => 'plain',
			'color'            => 'grey',
			'align'            => 'auto',

			'icon'             => '',
			'icon_type'        => 'fontawesome',
			'icon_fontawesome' => 'fa fa-circle-o',
			'icon_linecons'    => '',
			'icon_style'       => 'icon-solid icon-rounded',
			'icon_color'       => 'auto',
			'icon_bg'          => 'accent',
			'icon_anim'        => '',

			'animation'        => '',
			'class'            => '',
			'styler'           => '',
		), $atts );

		$args['icon'] = mixt_element_icon_class($args);

		// Styler custom design
		if ( ! empty($args['styler']) ) {
			$args['class'] .= mixt_element_styler($args['styler'], array($this, 'parse_styler_css'));
		}

		extract($args);

		$classes = "timeline-block align-$align icon-cont";
		if ( ! empty($class) ) $classes .= ' ' . $class;

		$icon_classes = "anchor mixt-icon $icon_bg $icon_style";
		if ( $icon_anim != '' && $icon_style != 'default' ) { $icon_classes .= " anim $icon_anim"; }

		$content = html_entity_decode($content);
		$content_classes = "content $style";
		if ( $style != 'plain' ) $content_classes .= ' ' . $color;
		if ( ! empty($animation) ) $content_classes .= ' ' . $this->element_animate($animation);

		return "<div class='$classes'>" .
				   "<span class='$icon_classes'><i class='$icon $icon_color'></i></span>" .
				   "<div class='$content_classes'>" .
					   do_shortcode($content) .
				   '</div>' .
			   '</div>';
	}
}
new Mixt_Timeline;

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Timeline extends WPBakeryShortCodesContainer {}
}

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Timeline_Block extends WPBakeryShortCodesContainer {}
}

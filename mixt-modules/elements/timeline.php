<?php

/**
 * Timeline Element
 */
class MixtTimeline {

	public $colors;
	
	function __construct() {
		$this->colors = mixt_get_assets('colors', 'basic');

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_timeline', array($this, 'timeline_shortcode'));
		add_shortcode('mixt_timeline_block', array($this, 'timeline_block_shortcode'));
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
					'color' => array(
						'type'    => 'select',
						'label'   => __( 'Anchor Color', 'mixt' ),
						'options' => $this->colors,
						'class'   => 'color-select basic-colors',
						'std'     => 'accent',
					),
					'icon' => array(
						'type'  => 'text',
						'label' => __( 'Anchor Icon', 'mixt' ),
						'std'   => 'fa fa-circle-o',
					),
					'content' => array(
						'type'  => 'encoded_textarea',
						'label' => __( 'Content', 'mixt' ),
						'desc'  => __( 'The block\'s content (HTML and shortcodes allowed)', 'mixt' ),
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
					'dependency' => array( 'element' => 'type', 'value' => array( 'double' ) ),
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
					'heading'     => __( 'Anchor Color', 'mixt' ),
					'param_name'  => 'color',
					'value'       => array_flip($this->colors),
					'std'         => 'accent',
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Anchor Icon', 'mixt' ),
					'param_name'  => 'icon',
					'admin_label' => true,
					'std' => 'fa fa-circle-o',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),
			),
		) );
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
		extract( shortcode_atts( array(
			'align' => 'auto',
			'color' => 'accent',
			'icon'  => 'fa fa-circle-o',
			'class' => '',
		), $atts ) );

		$classes = 'timeline-block align-' . $align;
		if ( ! empty($class) ) $classes .= ' ' . $class;

		$content = html_entity_decode($content);

		return "<div class='$classes'>" .
				   "<span class='anchor $color $icon'></span>" .
				   '<div class="content">' .
					   do_shortcode($content) .
				   '</div>' .
			   '</div>';
	}
}
new MixtTimeline;

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Timeline extends WPBakeryShortCodesContainer {}
}

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Timeline_Block extends WPBakeryShortCodesContainer {}
}

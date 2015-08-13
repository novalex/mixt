<?php

/**
 * Stats Element
 */
class Mixt_Stat {

	/** @var array */
	public $colors;
	
	public function __construct() {
		$this->colors = array_merge(
			mixt_get_assets('colors', 'basic'),
			array( 'transparent' => __( 'Transparent', 'mixt' ) )
		);

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_stat', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_stat',
			'title'    => __( 'Stats', 'mixt' ),
			'template' => '[mixt_stat {{attributes}}]{{content}}[/mixt_stat]',
			'params'   => array(
				'type' => array(
					'type'    => 'select',
					'label'   => __( 'Type', 'mixt' ),
					'options' => array(
						'box'    => __( 'Box', 'mixt' ),
						'circle' => __( 'Circle', 'mixt' ),
					),
					'std' => 'box',
				),
				'content' => array(
					'type'        => 'encoded_textarea',
					'label'     => __( 'Stat Text', 'mixt' ),
					'desc' => __( 'The stat\'s content. Use {value} to show the counter value.', 'mixt' ),
					'admin_label' => true,
					'std' => 'Value: {value}%',
				),
				'desc' => array(
					'type'        => 'text',
					'label'     => __( 'Description', 'mixt' ),
					'description' => __( 'Additional description under the value', 'mixt' ),
					'admin_label' => true,
				),
				'from' => array(
					'type'  => 'text',
					'label' => __( 'From', 'mixt' ),
					'desc'  => __( 'The value the count will start from', 'mixt' ),
					'std'   => 0,
				),
				'circle_from' => array(
					'type'  => 'text',
					'label' => __( 'Starting Fill', 'mixt' ),
					'desc'  => __( 'How much should the circle be filled for the "from" value? Number between 0.0 and 1.0', 'mixt' ),
					'std'   => 0.0,
					'required' => array('type', '=', 'circle'),
				),
				'value' => array(
					'type'  => 'text',
					'label' => __( 'Value', 'mixt' ),
					'desc'  => __( 'The value the count will stop at', 'mixt' ),
					'std'   => 100,
				),
				'circle_to' => array(
					'type'  => 'text',
					'label' => __( 'Value Fill', 'mixt' ),
					'desc'  => __( 'How much should the circle be filled for the value? Number between 0.0 and 1.0', 'mixt' ),
					'std'   => 1.0,
					'required' => array('type', '=', 'circle'),
				),
				'speed' => array(
					'type'  => 'text',
					'label' => __( 'Speed', 'mixt' ),
					'desc'  => __( 'Time from start to finish, in ms', 'mixt' ),
					'std'   => 2000,
				),
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Style', 'mixt' ),
					'options' => array(
						'color-bg'      => __( 'Color Background', 'mixt' ),
						'color-outline' => __( 'Outline', 'mixt' ),
					),
					'required' => array('type', '=', 'box'),
				),
				'color' => array(
					'type'     => 'select',
					'label'    => __( 'Color', 'mixt' ),
					'options'  => $this->colors,
					'std'      => 'white',
					'class'    => 'color-select basic-colors',
					'required' => array('type', '=', 'box'),
				),
				'circle_fill' => array(
					'type'  => 'colorpicker',
					'label' => __( 'Circle Fill Color', 'mixt' ),
					'std'   => '#333',
					'required' => array('type', '=', 'circle'),
				),
				'circle_bg' => array(
					'type'  => 'colorpicker',
					'label' => __( 'Circle Empty Color', 'mixt' ),
					'std'   => 'rgba(0,0,0,0.1)',
					'required' => array('type', '=', 'circle'),
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
			'name'        => __( 'Stat', 'mixt' ),
			'description' => __( 'Stat/counter element', 'mixt' ),
			'base'        => 'mixt_stat',
			'icon'        => 'mixt_stat',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Type', 'mixt' ),
					'param_name'  => 'type',
					'value'       => array(
						__( 'Box', 'mixt' ) => 'box',
						__( 'Circle', 'mixt' ) => 'circle',
					),
					'std' => 'box',
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Stat Text', 'mixt' ),
					'description' => __( 'The stat\'s content. Use {value} to show the counter value.', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
					'std' => 'Value: {value}%',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Description', 'mixt' ),
					'description' => __( 'Additional description under the value', 'mixt' ),
					'param_name'  => 'desc',
					'admin_label' => true,
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'From', 'mixt' ),
					'description' => __( 'The value the count will start from', 'mixt' ),
					'param_name'  => 'from',
					'std'         => 0,
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Starting Fill', 'mixt' ),
					'description' => __( 'How much should the circle be filled for the "from" value? Number between 0.0 and 1.0', 'mixt' ),
					'param_name'  => 'circle_from',
					'std'         => 0.0,
					'dependency'  => array( 'element' => 'type', 'value' => 'circle' ),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Value', 'mixt' ),
					'description' => __( 'The value the count will stop at', 'mixt' ),
					'param_name'  => 'value',
					'admin_label' => true,
					'std'         => 100,
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Value Fill', 'mixt' ),
					'description' => __( 'How much should the circle be filled for the value? Number between 0.0 and 1.0', 'mixt' ),
					'param_name'  => 'circle_to',
					'std'         => 1.0,
					'dependency'  => array( 'element' => 'type', 'value' => 'circle' ),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Speed', 'mixt' ),
					'description' => __( 'Time from start to finish, in ms', 'mixt' ),
					'param_name'  => 'speed',
					'std'         => 2000,
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Style', 'mixt' ),
					'param_name'  => 'style',
					'value'       => array(
						__( 'Color Background', 'mixt' ) => 'color-bg',
						__( 'Outline', 'mixt' ) => 'color-outline',
					),
					'dependency'  => array( 'element' => 'type', 'value' => 'box' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Color', 'mixt' ),
					'param_name'  => 'color',
					'value'       => array_flip($this->colors),
					'std'         => 'white',
					'param_holder_class' => 'color-select basic-colors',
					'dependency'  => array( 'element' => 'type', 'value' => 'box' ),
				),
				array(
					'type'        => 'colorpicker',
					'heading'     => __( 'Circle Fill Color', 'mixt' ),
					'param_name'  => 'circle_fill',
					'std'         => '#333',
					'dependency'  => array( 'element' => 'type', 'value' => 'circle' ),
				),
				array(
					'type'        => 'colorpicker',
					'heading'     => __( 'Circle Empty Color', 'mixt' ),
					'param_name'  => 'circle_bg',
					'std'         => 'rgba(0,0,0,0.1)',
					'dependency'  => array( 'element' => 'type', 'value' => 'circle' ),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),

				// Styler
				array(
					'type'       => 'styler',
					'param_name' => 'styler',
					'fields'     => array(
						'bg' => array(
							'label'   => __( 'Background Color', 'mixt' ),
							'pattern' => 'background-color: {{val}}',
						),
						'color' => array(
							'label'   => __( 'Text Color', 'mixt' ),
							'pattern' => 'color: {{val}}',
						),
						'border' => array(
							'label'   => __( 'Border Color', 'mixt' ),
							'pattern' => 'border-color: {{val}}',
						),
					),
					'group'      => 'Styler',
				),
			),
		) );
	}

	/**
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		$args = shortcode_atts( array(
			'type'        => 'box',
			'desc'        => '',
			'from'        => 0,
			'value'       => 100,
			'speed'       => 2000,
			'style'       => 'color-bg',
			'color'       => 'white',
			'circle_from' => 0.0,
			'circle_to'   => 1.0,
			'circle_fill' => '#444',
			'circle_bg'   => 'rgba(0,0,0,0.1)',
			'class'       => '',
			
			'styler'      => '',
		), $atts);

		// Styler custom design
		if ( $args['styler'] ) {
			$args['class'] .= mixt_element_styler($args['styler']);
		}

		extract($args);

		if ( $type == 'circle' ) {
			$style = 'type-circle';
			wp_enqueue_script('mixt-circle-progress');
		} else {
			$style = 'type-box ' . $style;
		}

		$classes = "mixt-stat mixt-element $style $color";
		if ( ! empty($class) ) $classes .= ' ' . $class;

		if ( wp_script_is('waypoints', 'registered') ) { wp_enqueue_script('waypoints'); }
		else { wp_enqueue_script('mixt-waypoints'); }

		$content = html_entity_decode($content);
		$counter = "<strong class='stat-value' data-from='$from' data-to='$value' data-speed='$speed'>$value</strong>";
		$content = str_replace('{value}', $counter, $content);

		ob_start();
		?>
			<div class="<?php echo $classes; ?>">
				<?php
				if ( $type == 'circle' ) {
					if ( strpos($circle_fill, '#') === 0 ) $circle_fill = '&quot;' . $circle_fill . '&quot;';
					if ( strpos($circle_bg, '#') === 0 ) $circle_bg = '&quot;' . $circle_bg . '&quot;';
					?>
					<div class="stat-circle"
						 data-value="<?php echo $circle_to; ?>"
						 data-animation-start-value="<?php echo $circle_from; ?>"
						 data-animation="{&quot;duration&quot;:<?php echo $speed; ?>}"
						 data-fill="{&quot;color&quot;:<?php echo $circle_fill; ?>}"
						 data-empty-fill="<?php echo $circle_bg; ?>">
						<div class="circle-inner">
				<?php } ?>
					<p class="stat-header"><?php echo $content; ?></p>
					<p class="stat-desc color-fade"><?php echo $desc; ?></p>
				<?php if ( $type == 'circle' ) echo '</div></div>' ?>
			</div>
		<?php
		return ob_get_clean();
	}
}
new Mixt_Stat;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Stat extends WPBakeryShortCode {}
}

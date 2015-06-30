<?php

/**
 * Pricing Tables
 */
class MixtPricing {

	public $colors;
	public $btn_colors;

	public function __construct() {
		$this->colors = array_merge( array(
			'default' => __( 'Default', 'mixt' ) ),
			mixt_get_colors('basic')
		);
		$this->btn_colors = mixt_get_assets('button', 'colors');
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_pricing', array($this, 'table_shortcode'));
		add_shortcode('mixt_pricing_row', array($this, 'row_shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_pricing',
			'title'    => __( 'Pricing Table', 'mixt' ),
			'template' => '[mixt_pricing {{attributes}}]{{nested}}[/mixt_pricing]',
			'params'   => array(
				'plan_name' => array(
					'type'  => 'text',
					'label' => __( 'Plan Name', 'mixt' ),
					'std'   => 'Standard Plan',
				),
				'plan_desc' => array(
					'type'  => 'text',
					'label' => __( 'Plan Description', 'mixt' ),
				),
				'price' => array(
					'type'  => 'text',
					'label' => __( 'Price', 'mixt' ),
					'desc'  => __( 'Enter the price and currency for this plan. The currency symbol position will be kept.', 'mixt' ),
					'std'   => '$25.99',
				),
				'plan_time' => array(
					'type'  => 'text',
					'label' => __( 'Plan Duration', 'mixt' ),
				),
				'highlight' => array(
					'type'  => 'checkbox',
					'label' => __( 'Highlighted', 'mixt' ),
					'desc'  => __( 'Check to make this plan stand out from the rest', 'mixt' ),
				),
				'scheme' => array(
					'type'    => 'select',
					'label'   => __( 'Color Scheme', 'mixt' ),
					'desc'    => __( 'Light or dark color scheme', 'mixt' ),
					'options' => array(
						'light' => __( 'Light', 'mixt' ),
						'dark'  => __( 'Dark', 'mixt' ),
					),
				),
				'color' => array(
					'type'    => 'select',
					'label'   => __( 'Header Color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select basic-colors',
				),
				'btn_text' => array(
					'type'    => 'text',
					'label'   => __( 'Button Text', 'mixt' ),
					'desc'    => __( 'Text for the CTA button', 'mixt' ),
					'std'     => 'Buy Now',
				),
				'btn_color' => array(
					'type'    => 'select',
					'label'   => __( 'Button Color', 'mixt' ),
					'options' => $this->btn_colors,
					'class'   => 'color-select button-colors',
				),
				'btn_link' => array(
					'type'    => 'text',
					'label'   => __( 'Button Link', 'mixt' ),
					'desc'    => __( 'CTA button link (href)', 'mixt' ),
					'std'     => 'http://example.com',
				),
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
			'nested' => array(
				'template' => '[mixt_pricing_row]{{content}}[/mixt_pricing_row]',
				'params' => array(
					'content' => array(
						'type'  => 'encoded_textarea',
						'label' => __( 'Text', 'mixt' ),
						'desc'  => __( 'Table row text, can contain HTML'),
					),
					'class' => array(
						'type'  => 'text',
						'label' => __( 'Extra Classes', 'mixt' ),
					),
				),
				'child_title'  => __( 'Table Row', 'mixt' ),
				'clone_button' => __( 'Add Row', 'mixt' ),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		// Table
		vc_map( array(
			'name'        => __( 'Pricing Table', 'mixt' ),
			'description' => __( 'Feature & pricing table', 'mixt' ),
			'base'        => 'mixt_pricing',
			'icon'        => 'mixt_pricing',
			'category'    => 'MIXT',
			'as_parent'   => array('only' => 'mixt_pricing_row'),
			'js_view'     => 'VcColumnView',
			'params'      => array(
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Plan Name', 'mixt' ),
					'param_name'  => 'plan_name',
					'admin_label' => true,
					'std'         => 'Standard Plan',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Plan Description', 'mixt' ),
					'param_name' => 'plan_desc',
					'std'        => 'Our standard plan, for individual needs',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Price', 'mixt' ),
					'description' => __( 'Enter the price and currency for this plan. The currency symbol position will be kept.', 'mixt' ),
					'param_name'  => 'price',
					'admin_label' => true,
					'std'         => '$25.99',
				),
				array(
					'type'        => 'checkbox',
					'heading'     => __( 'Highlighted', 'mixt' ),
					'description' => __( 'Check to make this plan stand out from the rest', 'mixt' ),
					'param_name'  => 'highlight',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Color Scheme', 'mixt' ),
					'description' => __( 'Light or dark color scheme', 'mixt' ),
					'value'       => array(
						__( 'Light', 'mixt' ) => 'light',
						__( 'Dark', 'mixt' )  => 'dark',
					),
					'param_name'  => 'scheme',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Header Color', 'mixt' ),
					'value'      => array_flip($this->colors),
					'param_name' => 'color',
					'param_holder_class' => 'color-select basic-colors',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Button Text', 'mixt' ),
					'description' => __( 'Text for the CTA button', 'mixt' ),
					'param_name'  => 'btn_text',
					'std'         => 'Buy Now',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Button Color', 'mixt' ),
					'value'      => array_flip($this->btn_colors),
					'param_name' => 'btn_color',
					'param_holder_class' => 'color-select button-colors',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Button Link', 'mixt' ),
					'description' => __( 'CTA button link (href)', 'mixt' ),
					'param_name'  => 'btn_link',
					'std'         => 'http://example.com',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Extra Classes', 'mixt' ),
					'param_name' => 'class',
				),
			),
		) );

		// Feature / row
		vc_map( array(
			'name'        => __( 'Row', 'mixt' ),
			'base'        => 'mixt_pricing_row',
			'icon'        => 'mixt_pricing',
			'category'    => 'MIXT',
			'as_child'    => array('only' => 'mixt_pricing'),
			'params'      => array(
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Text', 'mixt' ),
					'description' => __( 'Table row text, can contain HTML'),
					'param_name'  => 'content',
					'admin_label' => true,
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Extra Classes', 'mixt' ),
					'param_name' => 'class',
				),
			),
		) );
	}

	/**
	 * Render table shortcode
	 */
	public function table_shortcode( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'plan_name' => 'Plan',
			'plan_desc' => '',
			'price'     => '$9,99',
			'plan_time' => '',
			'highlight' => false,
			'scheme'    => '',
			'color'     => '',
			'btn_text'  => 'Buy Now',
			'btn_link'  => 'http://example.com',
			'btn_color' => 'default',
			'class'     => '',
		), $atts ) );

		$classes = 'pricing-table mixt-pricing mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;
		if ( $highlight ) $classes .= ' highlight';
		if ( $scheme == 'dark' ) $classes .= ' dark';
		if ( ! empty($color) && $color != 'default' ) $classes .= ' ' . $color;

		preg_match('/^(\D*)\s*([\d,\.]+)\s*(\D*)$/', $price, $price_arr);
		if ( empty($price_arr[1]) ) {
			$currency = $price_arr[3];
			$currency_position = 'after';
		} else {
			$currency = $price_arr[1];
			$currency_position = 'before';
		}
		$price_amount = explode('.', $price_arr[2]);

		ob_start();
		?>
		<div class="<?php echo $classes; ?>">
			<ul class="pricing-table-inner mixt-pricing-inner">
				<li class="header">
					<h3 class="plan-name"><?php echo $plan_name; ?></h3>
					<?php if ( ! empty($plan_desc) ) echo "<p class='plan-desc'>$plan_desc</p>"; ?>
					<strong class="price"><?php
						if ( $currency_position == 'before' ) echo "<small class='symbol'>$currency</small>";
						echo $price_amount[0];
						if ( ! empty($price_amount[1]) ) echo "<small class='price-decimal'>{$price_amount[1]}</small>";
						if ( $currency_position == 'after' ) echo "<small class='symbol'>$currency</small>";
						if ( ! empty($plan_time) ) echo "<small class='plan-time'>$plan_time</small>";
					?></strong>
				</li>
				<?php

				// Table Rows
				echo do_shortcode($content);
				?>
				<li class="footer">
					<a href="<?php echo esc_url($btn_link); ?>" class="btn btn-<?php echo $btn_color; ?>"><?php echo $btn_text; ?></a>
				</li>
			</ul>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render table row shortcode
	 */
	public function row_shortcode( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'class' => '',
		), $atts ) );
		$classes = '';
		if ( empty($content) ) return;
		if ( ! empty($class) ) $classes .= ' ' . $class;
		$content = html_entity_decode($content);

		return "<li class='$classes'>$content</li>";
	}
}
new MixtPricing;

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Pricing extends WPBakeryShortCodesContainer {}
}

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Pricing_Row extends WPBakeryShortCode {}
}

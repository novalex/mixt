<?php

/**
 * Review Element
 */
class Mixt_Review extends Mixt_Element{

	/**
	 * @var array $colors
	 * @var array $border_colors
	 * @var array $image_styles
	 */
	public $colors, $border_colors, $image_styles;

	public function __construct() {
		parent::__construct();
		
		$this->colors = mixt_get_assets('colors', 'basic');
		$this->border_colors = array_merge(
			array( 'auto' => __( 'Auto', 'mixt' ) ),
			$this->colors
		);
		$this->image_styles = mixt_element_assets('image-styles');

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_review', array($this, 'shortcode'));

		add_action('wp_ajax_mixt_review_styler_parse', array($this, 'parse_styler_ajax'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_review',
			'title'    => __( 'Review', 'mixt' ),
			'template' => '[mixt_review {{attributes}}]{{content}}[/mixt_review]',
			'params'   => array(
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Style', 'mixt' ),
					'options' => array(
						'plain'  => __( 'Plain', 'mixt' ),
						'boxed'  => __( 'Boxed', 'mixt' ),
						'bubble' => __( 'Speech Bubble', 'mixt' ),
						'quote'  => __( 'Quote', 'mixt' ),
					),
				),
				'boxed_color' => array(
					'type'     => 'select',
					'label'    => __( 'Box Color', 'mixt' ),
					'options'  => $this->colors,
					'class'    => 'color-select basic-colors',
					'required' => array('style', '=', 'boxed'),
				),
				'bubble_color' => array(
					'type'     => 'select',
					'label'    => __( 'Bubble Color', 'mixt' ),
					'options'  => $this->colors,
					'class'    => 'color-select basic-colors',
					'required' => array('style', '=', 'bubble'),
				),
				'layout' => array(
					'type'    => 'select',
					'label'   => __( 'Layout', 'mixt' ),
					'options' => array(
						'top'    => __( 'Author on top, content below', 'mixt' ),
						'left'   => __( 'Author on left, content on right', 'mixt' ),
						'right'  => __( 'Author on right, content on left', 'mixt' ),
						'bottom' => __( 'Author on bottom, content on top', 'mixt' ),
					),
				),
				'name' => array(
					'type'  => 'text',
					'label' => __( 'Name', 'mixt' ),
				),
				'title' => array(
					'type'  => 'text',
					'label' => __( 'Title / Position', 'mixt' ),
					'desc'  => __( 'The reviewer\'s title or position and company', 'mixt' ),
				),
				'web' => array(
					'type'  => 'text',
					'label' => __( 'Web', 'mixt' ),
				),
				'image' => array(
					'type'  => 'media',
					'label' => __( 'Image', 'mixt' ),
				),
				'image_halign' => array(
					'type'     => 'select',
					'label'    => __( 'Image Align', 'mixt' ),
					'options'  => array(
						'left'  => __( 'Left', 'mixt' ),
						'right' => __( 'Right', 'mixt' ),
					),
					'required' => array('layout', '=', 'top|bottom'),
				),
				'image_valign' => array(
					'type'     => 'select',
					'label'    => __( 'Image Align', 'mixt' ),
					'options'  => array(
						'top'    => __( 'Top', 'mixt' ),
						'bottom' => __( 'Bottom', 'mixt' ),
					),
					'required' => array('layout', '=', 'left|right'),
				),
				'image_style' => array(
					'type'    => 'select',
					'label'   => __( 'Image Style', 'mixt' ),
					'options' => $this->image_styles,
				),
				'image_border_color' => array(
					'type'    => 'select',
					'label'   => __( 'Border Color', 'mixt' ),
					'options' => $this->border_colors,
					'class' => 'color-select basic-colors',
					'required' => array('image_style', '=',
						'image-border|image-outline|image-rounded image-border|image-rounded image-outline|image-circle image-border|image-circle image-outline'
					),
				),
				'content' => array(
					'type'  => 'encoded_textarea',
					'label' => __( 'Description', 'mixt' ),
					'desc'  => __( 'The review\'s content', 'mixt' ),
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
			'name'        => __( 'Review', 'mixt' ),
			'description' => __( 'A review or testimonial', 'mixt' ),
			'base'        => 'mixt_review',
			'icon'        => 'mixt_review',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Style', 'mixt' ),
					'param_name' => 'style',
					'value'      => array(
						__( 'Plain', 'mixt' )         => 'plain',
						__( 'Boxed', 'mixt' )         => 'boxed',
						__( 'Speech Bubble', 'mixt' ) => 'bubble',
						__( 'Quote', 'mixt' )         => 'quote',
					),
					'std'        => 'plain',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Box Color', 'mixt' ),
					'param_name' => 'boxed_color',
					'value'      => array_flip($this->colors),
					'param_holder_class' => 'color-select basic-colors',
					'dependency' => array( 'element' => 'style', 'value' => 'boxed' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Bubble Color', 'mixt' ),
					'param_name' => 'bubble_color',
					'value'      => array_flip($this->colors),
					'param_holder_class' => 'color-select basic-colors',
					'dependency' => array( 'element' => 'style', 'value' => 'bubble' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Layout', 'mixt' ),
					'param_name' => 'layout',
					'value'      => array(
						__( 'Author on top, content below', 'mixt' )     => 'top',
						__( 'Author on left, content on right', 'mixt' ) => 'left',
						__( 'Author on right, content on left', 'mixt' ) => 'right',
						__( 'Author on bottom, content on top', 'mixt' ) => 'bottom',
					),
					'std'        => 'top',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Name', 'mixt' ),
					'param_name'  => 'name',
					'admin_label' => true,
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Title, Company', 'mixt' ),
					'description' => __( 'The reviewer\'s title or position and company', 'mixt' ),
					'param_name'  => 'title',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Website', 'mixt' ),
					'param_name' => 'web',
				),
				array(
					'type'       => 'attach_image',
					'heading'    => __( 'Image', 'mixt' ),
					'param_name' => 'image',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Align', 'mixt' ),
					'param_name' => 'image_halign',
					'value'      => array(
						__( 'Left', 'mixt' )  => 'left',
						__( 'Right', 'mixt' ) => 'right',
					),
					'std'        => 'left',
					'dependency' => array(
						'element' => 'layout',
						'value'   => array('top', 'bottom'),
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Align', 'mixt' ),
					'param_name' => 'image_valign',
					'value'      => array(
						__( 'Top', 'mixt' )    => 'top',
						__( 'Bottom', 'mixt' ) => 'bottom',
					),
					'std'        => 'top',
					'dependency' => array(
						'element' => 'layout',
						'value'   => array('left', 'right'),
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Style', 'mixt' ),
					'param_name' => 'image_style',
					'value'      => array_flip($this->image_styles),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Border Color', 'mixt' ),
					'param_name' => 'image_border_color',
					'value'      => array_flip($this->border_colors),
					'param_holder_class' => 'color-select basic-colors',
					'dependency' => array(
						'element' => 'image_style',
						'value'   => array(
							'image-border', 'image-outline',
							'image-rounded image-border', 'image-rounded image-outline',
							'image-circle image-border', 'image-circle image-outline'
						),
					),
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Content', 'mixt' ),
					'description' => __( 'The review\'s content', 'mixt' ),
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
					'parser'     => 'mixt_review_styler_parse',
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
	 * Parse Styler CSS
	 * 
	 * @param  array  $css CSS split by selector and property
	 * @return string Parsed CSS string
	 */
	public function parse_styler_css($css = '') {
		if ( empty($css) ) return '';
		$css = mixt_styler_parse($css);
		$parsed_css = $rules = '';

		$selector = $css['selector'];
		if ( ! empty($css['rules']['.'.$selector]) ) {
			$rules = $css['rules']['.'.$selector];
			unset($css);
		}

		if ( ! empty($rules['background-color']) ) {
			$parsed_css .= ".$selector.boxed, .$selector.bubble .review-content, .$selector.bubble .review-content:before { background-color: {$rules['background-color']} !important; }";
		}
		if ( ! empty($rules['border-color']) ) {
			$parsed_css .= ".$selector.boxed, .$selector.bubble .review-content { border-color: {$rules['border-color']} !important; }";
		}
		if ( ! empty($rules['color']) ) {
			$parsed_css .= ".$selector .review-content { color: {$rules['color']} !important; }";
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
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		$args = shortcode_atts( array(
			'style'              => 'plain',
			'boxed_color'        => key($this->colors),
			'bubble_color'       => key($this->colors),
			'layout'             => 'top',
			'name'               => '',
			'title'              => '',
			'web'                => '',
			'image'              => '',
			'image_halign'       => 'left',
			'image_valign'       => 'top',
			'image_style'        => 'rounded',
			'image_border_color' => 'auto',
			'animation'          => '',
			'class'              => '',

			'styler'             => '',

			'css'                => '',
		), $atts );

		// VC custom design options
		if ( ! empty($args['css']) && defined( 'WPB_VC_VERSION' ) ) {
			$args['class'] .= apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $args['css'], ' ' ), 'mixt_review', $atts );
		}

		// Styler custom design
		if ( $args['styler'] ) {
			$args['class'] .= mixt_element_styler($args['styler'], array($this, 'parse_styler_css'));
		}

		extract($args);

		$classes = 'mixt-review mixt-element ' . $style;
		if ( $style == 'boxed' ) $classes .= ' ' . $boxed_color;
		if ( $layout == 'top' || $layout == 'bottom' ) {
			$horizontal = true;
			$classes .= ' layout-h';
		} else {
			$horizontal = false;
			$classes .= ' layout-v';
		}
		if ( ! empty($class) ) $classes .= ' ' . $class;
		if ( ! empty($animation) ) $classes .= ' ' . $this->element_animate($animation);

		$content_classes = 'review-content';
		if ( $style == 'bubble' ) $content_classes .= ' ' . $bubble_color;

		$content_html = "<div class='$content_classes'>";
		if ( $style == 'quote' ) {
			$content_html .= '<blockquote>' . html_entity_decode($content) . '</blockquote>';
		} else {
			$content_html .= '<p>' . html_entity_decode($content) . '</p>';
		}
		$content_html .= '</div>';

		$author_image_html = '';
		if ( ! empty($image) && $image > 0 ) {
			$author_image_html =
			'<div class="mixt-image author-image">' .
				"<div class='image-wrap $image_style $image_border_color'>" .
					wp_get_attachment_image($image, 'full') .
				'</div>' .
			'</div>';
		}
		$image_before_info = ( ( $horizontal && $image_halign == 'left' ) || ( ! $horizontal && $image_valign == 'top' ) ) ? true : false;

		$author_html = '<div class="review-author">';
			if ( $image_before_info ) { $author_html .= $author_image_html; }
			$author_html .= '<div class="author-info">';
				if ( $name != '' ) { $author_html .= '<strong class="name">' . $name . '</strong>'; }
				if ( $title != '' ) { $author_html .= '<small class="title color-fade">' . $title . '</small>'; }
				if ( filter_var($web, FILTER_VALIDATE_URL) !== false ) {
					$author_html .= '<a href="' . $web . '" target="_blank" class="website">' . str_replace(array('http://', 'https://', 'www.'), '', $web) . '</a>';
				}
			$author_html .= '</div>';
			if ( ! $image_before_info ) { $author_html .= $author_image_html; }
		$author_html .= '</div>';

		ob_start();
		?>
		
		<div class="<?php echo $classes; ?>">
			<?php
			if ( $layout == 'top' || $layout == 'left' ) { echo $author_html; }
			echo mixt_unautop($content_html);
			if ( $layout == 'right' || $layout == 'bottom' ) { echo $author_html; }
			?>
		</div>

		<?php
		return ob_get_clean();
	}
}
new Mixt_Review;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Review extends WPBakeryShortCode {}
}

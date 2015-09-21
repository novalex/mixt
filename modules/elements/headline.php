<?php

/**
 * Headline Element
 */
class Mixt_Headline {

	/**
	 * @var array $colors
	 * @var array $styles
	 */
	public $colors, $styles;
	
	public function __construct() {
		$this->colors = mixt_get_assets('colors', 'elements');
		$this->styles = array(
			'sideline'  => __( 'Lines on the side', 'mixt' ),
			'line'      => __( 'Line separator', 'mixt' ),
			'icon'      => __( 'Icon separator', 'mixt' ),
			'icon-line' => __( 'Icon separator with lines', 'mixt' ),
		);
		
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_headline', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_headline',
			'title'    => __( 'Headline', 'mixt' ),
			'template' => '[mixt_headline {{attributes}}]{{content}}[/mixt_headline]',
			'params'   => array(
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Style', 'mixt' ),
					'options' => $this->styles,
					'std'     => 'sideline',
				),
				'content' => array(
					'type'  => 'text',
					'label' => __( 'Text', 'mixt' ),
					'desc'  => __( 'Heading text', 'mixt' ),
					'std'   => 'Text',
				),
				'align' => array(
					'type'    => 'select',
					'label'   => __( 'Align', 'mixt' ),
					'desc'    => __( 'Heading alignment', 'mixt' ),
					'options' => array(
						'left'   => __( 'Left', 'mixt' ),
						'center' => __( 'Center', 'mixt' ),
						'right'  => __( 'Right', 'mixt' ),
					),
					'std'     => 'left',
				),
				'tag' => array(
					'type'    => 'select',
					'label'   => __( 'Tag', 'mixt' ),
					'desc'    => __( 'Heading tag', 'mixt' ),
					'options' => array(
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
					),
					'std' => 'h3',
				),
				'line_style' => array(
					'type'    => 'select',
					'label'   => __( 'Line Style', 'mixt' ),
					'options' => array(
						'solid'  => __( 'Solid', 'mixt' ),
						'dashed' => __( 'Dashed', 'mixt' ),
						'dotted' => __( 'Dotted', 'mixt' ),
						'double' => __( 'Double', 'mixt' ),
					),
					'std'     => 'solid',
				),
				'sep_position' => array(
					'type'     => 'select',
					'label'    => __( 'Separator Position', 'mixt' ),
					'options'  => array(
						'top'    => __( 'Top', 'mixt' ),
						'middle' => __( 'Middle', 'mixt' ),
						'bottom' => __( 'Bottom', 'mixt' ),
					),
					'std'      => 'middle',
					'required' => array('style', '=', 'line|icon|icon-line'),
				),
				'color' => array(
					'type'    => 'select',
					'label'   => __( 'Color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select all-colors',
				),
				'icon_type' => array(
					'type'     => 'select',
					'label'    => __( 'Icon Type', 'mixt' ),
					'options'  => array(
						''      => __( 'Select an icon type', 'mixt' ),
						'icon'  => __( 'Font Icon', 'mixt' ),
						'image' => __( 'Image', 'mixt' ),
					),
					'std'      => '',
					'required' => array('style', '=', 'icon|icon-line'),
				),
				'icon' => array(
					'type'     => 'text',
					'label'    => __( 'Icon', 'mixt' ),
					'std'      => 'fa fa-check',
					'required' => array('icon_type', '=', 'icon'),
				),
				'image' => array(
					'type'     => 'media',
					'label'    => __( 'Icon', 'mixt' ),
					'required' => array('icon_type', '=', 'image'),
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
			'name'        => __( 'Headline', 'mixt' ),
			'description' => __( 'Heading with separator', 'mixt' ),
			'base'        => 'mixt_headline',
			'icon'        => 'mixt_headline',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Style', 'mixt' ),
					'param_name'  => 'style',
					'std'         => 'sideline',
					'value'       => array_flip($this->styles),
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Content', 'mixt' ),
					'description' => __( 'Heading text and, optionally, subheading, separated by 3 underscores (___)', 'mixt' ),
					'param_name'  => 'content',
					'admin_label' => true,
					'std'         => 'Text',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Align', 'mixt' ),
					'description' => __( 'Heading alignment', 'mixt' ),
					'param_name'  => 'align',
					'value'       => array(
						__( 'Left', 'mixt' )   => 'left',
						__( 'Center', 'mixt' ) => 'center',
						__( 'Right', 'mixt' )  => 'right',
					),
					'std'         => 'left',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Tag', 'mixt' ),
					'description' => __( 'Heading tag', 'mixt' ),
					'param_name'  => 'tag',
					'value'       => array(
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
					),
					'std'         => 'h3',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Line Style', 'mixt' ),
					'param_name'  => 'line_style',
					'value'       => array(
						__( 'Solid', 'mixt' )  => 'solid',
						__( 'Dashed', 'mixt' ) => 'dashed',
						__( 'Dotted', 'mixt' ) => 'dotted',
						__( 'Double', 'mixt' ) => 'double',
					),
					'std'         => 'solid',
					'dependency'  => array(
						'element' => 'style',
						'value'   => array('sideline', 'line', 'icon-line'),
					),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Separator Position', 'mixt' ),
					'param_name'  => 'sep_position',
					'value'       => array(
						__( 'Top', 'mixt' )    => 'top',
						__( 'Middle', 'mixt' ) => 'middle',
						__( 'Bottom', 'mixt' ) => 'bottom',
					),
					'std'         => 'middle',
					'dependency'  => array(
						'element' => 'style',
						'value'   => array('line', 'icon', 'icon-line'),
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Color', 'mixt' ),
					'param_name' => 'color',
					'value'      => array_flip($this->colors),
					'param_holder_class' => 'vc_colored-dropdown',
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
					'dependency'  => array(
						'element' => 'style',
						'value'   => array('icon', 'icon-line'),
					),
					'group'       => __( 'Icon', 'mixt' ),
				),
				array(
					'type'        => 'iconpicker',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'icon_fontawesome',
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
					'type'        => 'attach_image',
					'heading'     => __( 'Icon', 'mixt' ),
					'param_name'  => 'image',
					'dependency'  => array( 'element' => 'icon_type', 'value' => 'image' ),
					'group'       => __( 'Icon', 'mixt' ),
				),

				// Styler
				array(
					'type'       => 'styler',
					'param_name' => 'styler',
					'fields'     => array(
						'color' => array(
							'selector' => '.headline-content',
							'label'    => __( 'Text Color', 'mixt' ),
							'pattern'  => 'color: {{val}}',
						),
						'line-color' => array(
							'selector' => '.sideline:after',
							'label'    => __( 'Line Color', 'mixt' ),
							'pattern'  => 'border-color: {{val}}',
							'cols'     => '3',
							'group'    => __( 'Separator', 'mixt' ),
						),
						'thickness' => array(
							'type'     => 'unit',
							'selector' => '.sideline:after',
							'label'    => __( 'Thickness', 'mixt' ),
							'pattern'  => 'border-top-width: {{val}}',
							'cols'     => '3',
							'group'    => __( 'Separator', 'mixt' ),
						),
						'icon-color' => array(
							'selector' => '.sep-icon',
							'label'    => __( 'Icon Color', 'mixt' ),
							'pattern'  => 'color: {{val}}',
							'cols'     => '3',
							'group'    => __( 'Separator', 'mixt' ),
						),
						'sep-width' => array(
							'type'     => 'unit',
							'selector' => '.separator',
							'label'    => __( 'Separator Width', 'mixt' ),
							'pattern'  => 'width: {{val}}',
							'cols'     => '3',
							'group'    => __( 'Separator', 'mixt' ),
						),
					),
					'group'      => 'Styler',
				),
			),
		));
	}

	/**
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		$args = shortcode_atts( array(
			'style'            => 'sideline',
			'text'             => '',
			'desc'             => '',
			'align'            => 'left',
			'tag'              => 'h3',
			'line_style'       => '',
			'color'            => '',
			'sep_position'     => 'middle',
			'class'            => '',
			
			'icon'             => '',
			'image'            => '',
			'icon_type'        => 'fontawesome',
			'icon_fontawesome' => '',
			'icon_linecons'    => '',

			'styler'           => '',
		), $atts );

		extract($args);

		// Styler custom design
		if ( $styler != '' ) {
			$class .= mixt_element_styler($styler);
		}

		$classes = "title headline mixt-headline mixt-element align-$align style-$style";
		if ( ! empty($class) ) $classes .= ' ' . $class;

		$content = explode('___', $content);

		if ( $text == '' ) $text = trim($content[0]);

		if ( $desc == '' && array_key_exists(1, $content) ) $desc = trim($content[1]);
		if ( $desc != '' ) $classes .= ' has-desc';

		$line_class = '';

		if ( $color == '' ) { $line_class .= 'theme-bd'; }
		else if ( $color == 'accent' ) { $line_class .= 'theme-accent-bd'; }
		else { $line_class .= ' ' . $color; }

		if ( $line_style != '' ) $line_class .= ' ' . $line_style;
		
		$line = '<span class="sideline ' . $line_class . '"></span>';

		$left_content = $right_content = $separator = '';

		if ( $style == 'sideline' ) {
			$left_content = '<div class="headline-left">' . $line . '</div>';
			$right_content = '<div class="headline-right">' . $line . '</div>';
		} else {
			$left_content = '<div class="headline-left"></div>';
			$right_content = '<div class="headline-right"></div>';
			
			if ( $style == 'line' ) {
				$separator = $line;
			} else {
				$icon = '<span class="sep-icon">';
				if ( $icon_type == 'image' ) {
					$icon .= wp_get_attachment_image($image, 'full');
				} else {
					$icon .= '<i class="' . mixt_element_icon_class($args) . '"></i>';
				}
				$icon .= '</span>';

				if ( $style == 'icon' || $style == 'icon-line' ) {
					$separator = $icon;

					if ( $style == 'icon-line' ) {
						if ( $align == 'center' || $align == 'right' ) { $separator = $line . $separator; }
						if ( $align == 'center' || $align == 'left' ) { $separator .= $line; }
					}
				}
			}
			$separator = '<div class="separator">' . $separator . '</div>';
		}

		ob_start();

		?>

		<div class="<?php echo $classes; ?>">
			<?php if ( $align == 'center' || $align == 'right' ) { echo $left_content; } ?>
			<div class="headline-content">
				<?php if ( $sep_position == 'top' ) { echo $separator; } ?>
				<?php echo "<$tag class='heading'>" . mixt_unautop($text) . "</$tag>"; ?>
				<?php if ( $sep_position == 'middle' ) { echo $separator; } ?>
				<?php if ( $desc != '' ) echo '<p class="subheading color-fade">' . mixt_unautop($desc) . '</p>'; ?>
				<?php if ( $sep_position == 'bottom' ) { echo $separator; } ?>
			</div>
			<?php if ( $align == 'center' || $align == 'left' ) { echo $right_content; } ?>
		</div>

		<?php

		return ob_get_clean();
	}
}
new Mixt_Headline;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Headline extends WPBakeryShortCode {}
}

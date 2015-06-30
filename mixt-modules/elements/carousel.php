<?php

// Carousel Element

class MixtCarousel {
	function __construct() {
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_carousel', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_carousel',
			'title'    => __( 'Image Carousel', 'mixt' ),
			'template' => '[mixt_carousel {{attributes}}]',
			'params'   => array(
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Item Style', 'mixt' ),
					'desc'    => __( 'Select the item style', 'mixt' ),
					'options' => array(
						'plain' => __( 'Plain', 'mixt' ),
						'boxed' => __( 'Boxed', 'mixt' ),
					),
				),
				'images' => array(
					'type'  => 'media_multi',
					'label' => __( 'Images', 'mixt' ),
					'desc'  => __( 'Select images from library', 'mixt' ),
				),
				'img_size' => array(
					'type'  => 'text',
					'label' => __( 'Image Size', 'mixt' ),
					'desc'  => __( 'Example: thumbnail, medium, large, full or custom image size in pixels (width x height). Default: thumbnail', 'mixt' ),
				),
				'mode' => array(
					'type'    => 'select',
					'label'   => __( 'Orientation', 'mixt' ),
					'options' => array(
						'horizontal' => __( 'Horizontal', 'mixt' ),
						'vertical'   => __( 'Vertical', 'mixt' ),
					),
				),
				'settings' => array(
					'type'    => 'checkbox',
					'label'   => __( 'General Settings', 'mixt' ),
					'options' => array(
						'auto' => __( 'Autoplay', 'mixt' ),
						'loop' => _x( 'Loop', 'slider', 'mixt' ),
					),
					'std' => 'auto,loop',
				),
				'speed' => array(
					'type'  => 'text',
					'label' => __( 'Slide Interval', 'mixt' ),
					'desc'  => __( 'Pause between slides for autoplay (in ms)', 'mixt' ),
					'std'   => '5000',
				),
				'items' => array(
					'type'  => 'text',
					'label' => _x( 'Items', 'slider', 'mixt' ),
					'desc'  => __( 'Number of items visible', 'mixt' ),
					'std'   => '1',
				),
				'items_tablet' => array(
					'type'  => 'text',
					'label' => _x( 'Items on Tablet', 'slider', 'mixt' ),
					'std'   => '1',
				),
				'items_mobile' => array(
					'type'  => 'text',
					'label' => _x( 'Items on Mobile', 'slider', 'mixt' ),
					'std'   => '1',
				),
				'ui_settings' => array(
					'type'    => 'checkbox',
					'label'   => __( 'UI Settings', 'mixt' ),
					'options' => array(
						'pag'      => __( 'Pagination', 'mixt' ),
						'nav'      => __( 'Nav Buttons', 'mixt' ),
						'dark-nav' => __( 'Dark Nav Buttons', 'mixt' ),
					),
					'std' => 'nav,dark-nav',
				),
				'action' => array(
					'type'    => 'select',
					'label'   => __( 'Click Action', 'mixt' ),
					'options' => array(
						'none'     => __( 'None', 'mixt' ),
						'lightbox' => __( 'Lightbox', 'mixt' ),
						'custom'   => __( 'Custom link', 'mixt' ),
					),
				),
				'links' => array(
					'type'     => 'exploded_textarea',
					'label'    => __( 'Custom Links', 'mixt' ),
					'desc'     => __( 'Enter links for each slide, divided with linebreaks (Enter)', 'mixt' ),
					'required' => array('action', '=', 'custom'),
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
			'name'        => __( 'Carousel', 'mixt' ),
			'description' => __( 'Image carousel', 'mixt' ),
			'base'        => 'mixt_carousel',
			'icon'        => 'mixt_carousel',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Item Style', 'mixt' ),
					'description' => __( 'Select the item style', 'mixt' ),
					'param_name'  => 'style',
					'value'       => array(
						__( 'Plain', 'mixt' ) => 'plain',
						__( 'Boxed', 'mixt' ) => 'boxed',
					),
				),
				array(
					'type'        => 'attach_images',
					'heading'     => __( 'Images', 'mixt' ),
					'description' => __( 'Select images from library', 'mixt' ),
					'param_name'  => 'images',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Carousel size', 'js_composer' ),
					'description' => __( 'Enter image size. Example: thumbnail, medium, large, full or other sizes defined by current theme. Alternatively enter image size in pixels: 200x100 (Width x Height). Leave empty to use "thumbnail" size. If used slides per view, this will be used to define carousel wrapper size.', 'js_composer' ),
					'param_name'  => 'img_size',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Slider orientation', 'js_composer' ),
					'param_name'  => 'mode',
					'value'       => array(
						__( 'Horizontal', 'js_composer' ) => 'horizontal',
						__( 'Vertical', 'js_composer' ) => 'vertical'
					),
				),
				array(
					'type'        => 'checkbox',
					'heading'     => __( 'General Settings', 'mixt' ),
					'param_name'  => 'settings',
					'value'       => array(
						__( 'Autoplay', 'mixt' ) => 'auto',
						_x( 'Loop', 'slider', 'mixt' ) => 'loop',
					),
					'std' => 'auto,loop',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Slider speed', 'js_composer' ),
					'description' => __( 'Duration of animation between slides (in ms).', 'js_composer' ),
					'param_name'  => 'speed',
					'value'       => '5000',
				),
				array(
					'type'        => 'textfield',
					'heading'     => _x( 'Items', 'slider', 'mixt' ),
					'description' => __( 'Number of items visible', 'mixt' ),
					'param_name'  => 'items',
					'value'       => '1',
				),
				array(
					'type'        => 'textfield',
					'heading'     => _x( 'Items on Tablet', 'slider', 'mixt' ),
					'param_name'  => 'items_tablet',
					'value'       => '1',
				),
				array(
					'type'        => 'textfield',
					'heading'     => _x( 'Items on Mobile', 'slider', 'mixt' ),
					'param_name'  => 'items_mobile',
					'value'       => '1',
				),
				array(
					'type'        => 'checkbox',
					'heading'     => __( 'UI Settings', 'mixt' ),
					'param_name'  => 'ui_settings',
					'value'       => array(
						__( 'Pagination', 'mixt' ) => 'pag',
						__( 'Nav Buttons', 'mixt' ) => 'nav',
						__( 'Dark Nav Buttons', 'mixt' ) => 'dark-nav',
					),
					'std' => 'nav,dark-nav',
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Click Action', 'mixt' ),
					'param_name'  => 'action',
					'value'       => array(
						__( 'None', 'mixt' ) => 'none',
						__( 'Lightbox', 'mixt' ) => 'lightbox',
						__( 'Custom link', 'mixt' ) => 'custom',
					),
				),
				array(
					'type'        => 'exploded_textarea',
					'heading'     => __( 'Custom links', 'js_composer' ),
					'description' => __( 'Enter links for each slide (Note: divide links with linebreaks (Enter)).', 'js_composer' ),
					'param_name'  => 'links',
					'dependency'  => array(
						'element' => 'action',
						'value' => array( 'custom' )
					),
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
	 * Render shortcode
	 */
	public function shortcode( $atts ) {
		extract( shortcode_atts( array(
			'images'       => '',
			'img_size'     => 'thumbnail',
			'mode'         => 'horizontal',
			'items'        => '1',
			'items_tablet' => '1',
			'items_mobile' => '1',
			'settings'     => 'auto,loop',
			'ui_settings'  => 'nav,dark-nav',
			'speed'        => '5000',
			'style'        => 'plain',
			'action'       => 'none',
			'links'        => '',
			'class'        => '',
		), $atts ) );

		$images = explode(',', $images);
		$settings = explode(',', $settings);
		$ui_settings = explode(',', $ui_settings);

		$classes = 'mixt-carousel mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		$slider_classes = 'image-slider carousel-slider';
		if ( $mode == 'vertical' ) $slider_classes .= ' vertical';
		if ( $style == 'boxed' ) $slider_classes .= ' boxed theme-bd';
		if ( in_array('dark-nav', $ui_settings) ) $slider_classes .= ' controls-alt';

		$links = explode(',', $links);

		ob_start();
		?>

		<div class="<?php echo $classes; ?>">
			<ul class="<?php echo $slider_classes; ?>"
				 data-auto="<?php echo in_array('auto', $settings) ? 'true' : 'false' ?>"
				 data-loop="<?php echo in_array('loop', $settings) ? 'true' : 'false'; ?>"
				 data-interval="<?php echo $speed; ?>"
				 data-items="<?php echo $items; ?>"
				 data-items-tablet="<?php echo $items_tablet; ?>"
				 data-items-mobile="<?php echo $items_mobile; ?>"
				 data-direction="<?php echo $mode; ?>"
				 data-lightbox="<?php echo $action == 'lightbox' ? 'true' : 'false'; ?>"
				 data-pagination="<?php echo in_array('pag', $ui_settings) ? 'true' : 'false'; ?>"
				 data-navigation="<?php echo in_array('nav', $ui_settings) ? 'true' : 'false'; ?>">

				<?php
				$i = 0;
				$slide_atts = $slide_link = '';
				foreach ( $images as $attach_id ) {
					if ( $attach_id > 0 ) {
						if ( function_exists('wpb_getImageBySize') ) {
							$post_thumbnail = wpb_getImageBySize( array('attach_id' => $attach_id, 'thumb_size' => $img_size) );
							$thumbnail = $post_thumbnail['thumbnail'];
						} else {
							$thumbnail = wp_get_attachment_image($attach_id, $img_size);
						}
					} else {
						$post_thumbnail = array();
						$post_thumbnail['thumbnail'] = '<img src="' . MIXT_URI . '/assets/img/patterns/placeholder.jpg' . '" />';
						$post_thumbnail['p_img_large'][0] = MIXT_URI . '/assets/img/patterns/placeholder.jpg';
						$thumbnail = $post_thumbnail['thumbnail'];
					}

					if ( $action == 'custom' && ! empty($links[$i]) ) {
						$slide_link = esc_url($links[$i]);
					} else if ( $action == 'lightbox' ) {
						$image_src = wp_get_attachment_image_src($attach_id, 'full');
						$slide_atts = ( ! empty($image_src[0]) ) ? "data-src='{$image_src[0]}'" : '';
					} else {
						$slide_link = '#';
					}
					$i++;
					?>
					<li class="slider-item" <?php echo $slide_atts; ?>>
						<?php echo "<a href='$slide_link'>$thumbnail</a>"; ?>
					</li>
				<?php } ?>
			</ul>
		</div>
		
		<?php
		return ob_get_clean();
	}
}
new MixtCarousel;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Carousel extends WPBakeryShortCode {}
}

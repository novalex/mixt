<?php

// Grid Builder Custom Hover Content

/**
 * Add hover content shortcode to element list
 */
function mixt_gitem_hover($shortcodes) {
	$colors = mixt_get_assets('colors', 'basic');
	$anims  = array('in' => mixt_css_anims('trans-in'), 'out' => mixt_css_anims('trans-out'));
	$btn_colors = mixt_get_assets('button', 'colors');

	$shortcodes['mixt_gitem_hover'] = array(
		'name'        => __( 'Hover Content', 'mixt' ),
		'description' => __( 'Custom Hover Content', 'mixt' ),
		'base'        => 'mixt_gitem_hover',
		'category'    => 'MIXT',
		'post_type'   => Vc_Grid_Item_Editor::postType(),
		'params'      => array(
			array(
				'type'       => 'dropdown',
				'heading'    => __( 'Hover Color', 'mixt' ),
				'param_name' => 'hover_color',
				'value'      => array_flip($colors),
				'param_holder_class' => 'color-select basic-colors',
				'std' => 'black',
			),
			array(
				'type'       => 'dropdown',
				'heading'    => __( 'Hover Animation In', 'mixt' ),
				'param_name' => 'hover_in',
				'value'      => array_flip($anims['in']),
			),
			array(
				'type'       => 'dropdown',
				'heading'    => __( 'Hover Animation Out', 'mixt' ),
				'param_name' => 'hover_out',
				'value'      => array_flip($anims['out']),
			),
			array(
				'type'       => 'checkbox',
				'heading'    => __( 'Items to Display', 'mixt' ),
				'param_name' => 'items',
				'value'      => array(
					__( 'Full Image', 'mixt' ) => 'image',
					__( 'Go to Post', 'mixt' ) => 'post',
					__( 'Comment Count', 'mixt' ) => 'comments',
				),
				'std' => 'image,post',
			),
			array(
				'type'       => 'checkbox',
				'heading'    => __( 'Item Style', 'mixt' ),
				'param_name' => 'item_style',
				'value'      => array(
					__( 'Plain', 'mixt' ) => 'plain',
					__( 'Button', 'mixt' ) => 'btn',
					__( 'Round Button', 'mixt' ) => 'btn btn-round',
				),
				'std' => 'btn btn-round',
			),
			array(
				'type'       => 'dropdown',
				'heading'    => __( 'Button Color', 'mixt' ),
				'param_name' => 'btn_color',
				'value'      => array_flip($btn_colors),
				'param_holder_class' => 'color-select button-colors',
				'std' => 'accent',
			),
			array(
				'type'       => 'textfield',
				'heading'    => __( 'Image Icon', 'mixt' ),
				'param_name' => 'image_icon',
				'std'        => 'fa fa-search',
			),
			array(
				'type'       => 'textfield',
				'heading'    => __( 'Post Icon', 'mixt' ),
				'param_name' => 'post_icon',
				'std'        => 'fa fa-share',
			),
			array(
				'type'       => 'textfield',
				'heading'    => __( 'Comments Icon', 'mixt' ),
				'param_name' => 'comm_icon',
				'std'        => 'fa fa-comment',
			),
		),
	);
	return $shortcodes;
}
add_filter('vc_grid_item_shortcodes', 'mixt_gitem_hover');


/**
 * Render the hover content shortcode
 */
function mixt_gitem_hover_shortcode($atts) {
	extract( shortcode_atts( array(
		'color' => 'black',
		'items' => 'image,post',
		'item_style' => 'btn btn-outset no-border',
		'btn_color'  => 'accent',
		'image_icon' => 'fa fa-search',
		'post_icon'  => 'fa fa-share',
		'comm_icon'  => 'fa fa-comment',
	), $atts ) );

	$items = explode(',', $items);
	$item_classes = 'gitem-icon ' . $item_style;
	if ( $item_style != 'plain' ) $item_classes .= ' btn-' . $btn_color;

	ob_start();
	?>
		<div class="mixt-gitem-hover hover-content hovered">
			<div class="on-hover <?php echo $color; ?>">
				<?php if ( in_array('image', $items) ) { ?>
				<a href="{{ post_image_url }}" class="<?php echo $item_classes; ?>"><i class="<?php echo $image_icon; ?>"></i></a>
				<?php } if ( in_array('post', $items) ) { ?>
				<a href="{{ post_link_url }}" class="<?php echo $item_classes; ?>"><i class="<?php echo $post_icon; ?>"></i></a>
				<?php } if ( in_array('comments', $items) ) { ?>
				<a href="{{ post_link_url }}#comments" class="<?php echo $item_classes; ?> comments"><i class="<?php echo $comm_icon; ?>"></i>&nbsp;<small>{{ post_data:comment_count }}</small></a>
				<?php } ?>
			</div>
		</div>
	<?php
	return ob_get_clean();
}
add_shortcode('mixt_gitem_hover', 'mixt_gitem_hover_shortcode');
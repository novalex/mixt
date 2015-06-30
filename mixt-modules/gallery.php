<?php

/**
 * Custom Gallery
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Custom Gallery Shortcode
 *
 * @param array $attr Attributes of the shortcode.
 *
 * @return string HTML content to display gallery.
 */
function mixt_gallery_shortcode($attr) {
	$post = get_post();

	static $instance = 0;
	$instance++;

	if ( ! empty( $attr['ids'] ) ) {
		// 'ids' is explicitly ordered, unless you specify otherwise.
		if ( empty( $attr['orderby'] ) )
				$attr['orderby'] = 'post__in';
		$attr['include'] = $attr['ids'];
	}

	// Allow plugins/themes to override the default gallery template.
	$output = apply_filters('post_gallery', '', $attr);
	if ( $output != '' ) {
		return $output;
	}

	// We're trusting author input, so let's at least make sure it looks like a valid orderby statement
	if ( isset( $attr['orderby'] ) ) {
		$attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
		if ( !$attr['orderby'] ) {
			unset( $attr['orderby'] );
		}
	}

	extract(shortcode_atts(array(
		'order'      => 'ASC',
		'orderby'    => 'menu_order ID',
		'id'         => $post->ID,
		'type'       => 'standard',
		'feat'       => false,
		'itemtag'    => 'dl',
		'icontag'    => 'dt',
		'captiontag' => 'dd',
		'columns'    => 3,
		'size'       => 'thumbnail',
		'include'    => '',
		'exclude'    => ''
	), $attr));

	$id = intval($id);
	if ( 'RAND' == $order ) {
		$orderby = 'none';
	}

	if ( !empty($include) ) {
		$_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

		$attachments = array();
		foreach ( $_attachments as $key => $val ) {
			$attachments[$val->ID] = $_attachments[$key];
		}
	} elseif ( !empty($exclude) ) {
		$attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
	} else {
		$attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
	}

	if ( empty($attachments) ) {
		return '';
	}

	if ( is_feed() ) {
		$output = "\n";
		foreach ( $attachments as $att_id => $attachment ) {
			$output .= wp_get_attachment_link($att_id, $size, true) . "\n";
		}
		return $output;
	}

	$itemtag = tag_escape($itemtag);
	$captiontag = tag_escape($captiontag);
	$icontag = tag_escape($icontag);
	$valid_tags = wp_kses_allowed_html( 'post' );
	if ( ! isset( $valid_tags[ $itemtag ] ) )
		$itemtag = 'dl';
	if ( ! isset( $valid_tags[ $captiontag ] ) )
		$captiontag = 'dd';
	if ( ! isset( $valid_tags[ $icontag ] ) )
		$icontag = 'dt';

	$columns = intval($columns);
	$itemwidth = $columns > 0 ? floor(100/$columns) : 100;
	$float = is_rtl() ? 'right' : 'left';

	$selector = "gallery-{$instance}";

	$gallery_style = $gallery_div = '';
	if ( apply_filters( 'use_default_gallery_style', true ) )
		$gallery_style = "
		<style type='text/css'>
				#{$selector} { margin: auto; }
				#{$selector} .gallery-item {
					float: {$float};
					margin: 10px 0;
					text-align: center;
					width: {$itemwidth}%;
				}
				#{$selector} .gallery-caption { margin-left: 0; }
		</style>";

	$size_class = sanitize_html_class( $size );

	$cont_tag = 'div';
	$br_tag = '<br style="clear: both;" />';
	$gallery_classes = '';

	if ( $type != 'standard') {
		$output = $br_tag = '';
		$cont_tag = 'ul';
		$itemtag = 'li';
	}
	if ( $type == 'slider' ) {
		$gallery_style   = '';
		$gallery_classes = 'gallery-slider';
	} else if ( $type == 'lightbox' ) {
		$gallery_classes = 'lightbox-gallery';
	}
	if ( $feat ) { $gallery_classes .= ' featured'; }

	$output = $gallery_style;

	$i = 0;

	if ( $type == 'lightbox' ) {
		global $mixt_opt;
		$gallery_icon = '<span class="icon ' . $mixt_opt['format-gallery-icon'] . '"></span>';
		$image_count  = '<p class="count">' . count($attachments) . __(' pictures', 'mixt' ) . '</p>';

		$output .= '<div class="lightbox-trigger">' .
						wp_get_attachment_image(key($attachments), $size) .
						"<div class='inner'>{$gallery_icon}{$image_count}</div>" .
					'</div>';
		$output .= "<$cont_tag id='$selector' class='gallery galleryid-{$id} gallery-columns-{$columns} gallery-size-{$size_class} $gallery_classes'>";

		foreach ( $attachments as $id => $attachment ) {
			$itemclass = 'gallery-item';
			$image = wp_get_attachment_image_src($id, 'full')[0];
			$thumb = wp_get_attachment_image($id, 'blog-small');
			$itemattr = "data-src='{$image}'";
			$output .= "<{$itemtag} class='{$itemclass}' {$itemattr}>{$thumb}";
			if ( $captiontag && trim($attachment->post_excerpt) ) {
				$output .= "<{$captiontag} class='wp-caption-text gallery-caption'>" . wptexturize($attachment->post_excerpt) . "</{$captiontag}>";
			}
			$output .= "</{$itemtag}>";
		}
	} else {
		$output .= "<$cont_tag id='$selector' class='gallery galleryid-{$id} gallery-columns-{$columns} gallery-size-{$size_class} $gallery_classes'>";
		foreach ( $attachments as $id => $attachment ) {
			if ( $attr['link'] == 'none' ) {
				$link = wp_get_attachment_image($id, $size);
			} else {
				$link = isset($attr['link']) && 'file' == $attr['link'] ? wp_get_attachment_link($id, $size, false, false) : wp_get_attachment_link($id, $size, true, false);
			}

			$output .= "<{$itemtag} class='gallery-item'>";
			$output .= "<{$icontag} class='gallery-icon'>$link</{$icontag}>";
			if ( $captiontag && trim($attachment->post_excerpt) ) {
				$output .= "<{$captiontag} class='wp-caption-text gallery-caption'>" . wptexturize($attachment->post_excerpt) . "</{$captiontag}>";
			}
			$output .= "</{$itemtag}>";
			if ( $columns > 0 && ++$i % $columns == 0 ) {
				$output .= $br_tag;
			}
		}
	}

	$output .= "$br_tag</$cont_tag>\n";

	return $output;
}


/**
 * Remove default WP gallery shortcode and register custom one, add gallery type setting
 */
function mixt_init_gallery() {
	add_action('print_media_templates', function() {
		?>

		<script type="text/html" id="tmpl-mixt-gallery-type">
			<label class="setting">
				<span><?php _e('Gallery Type', 'mixt'); ?></span>
				<select data-setting="type">
					<option value="standard"><?php _e('Standard', 'mixt'); ?></option>
					<option value="slider"><?php _e('Slider', 'mixt'); ?></option>
					<option value="lightbox"><?php _e('Lightbox', 'mixt'); ?></option>
				</select>
			</label>
		</script>

		<script>
			jQuery(document).ready( function() {
				_.extend(wp.media.gallery.defaults, {
					type: 'std'
				});

				wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
					template: function(view){
						return wp.media.template('gallery-settings')(view)
						+ wp.media.template('mixt-gallery-type')(view);
					}
				});

			});
		</script>

		<?php
	});

	remove_shortcode('gallery');
	add_shortcode('gallery', 'mixt_gallery_shortcode');
}
add_action('init', 'mixt_init_gallery');

<?php
/**
 * Single Product Thumbnails
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/product-thumbnails.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.6.3
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $post, $product, $woocommerce;

$attachment_ids = $product->get_gallery_attachment_ids();

if ( $attachment_ids ) {
	$loop 		= 0;
	$columns 	= apply_filters( 'woocommerce_product_thumbnails_columns', 3 );
	?>
	<ul class="thumbnails <?php echo 'columns-' . $columns; ?>"><?php

		$style = mixt_wc_option('single-thumb-style', '');
		if ( preg_match('/image-border|image-outline/', $style) ) $style .= ' ' . mixt_wc_option('single-thumb-border', 'accent');

		foreach ( $attachment_ids as $attachment_id ) {

			$classes = array( 'zoom' );

			$order_class = '';

			if ( $loop === 0 || $loop % $columns === 0 ) {
				$order_class = 'first';
			}

			if ( ( $loop + 1 ) % $columns === 0 ) {
				$order_class = 'last';
			}

			$image_class = implode( ' ', $classes );
			$props       = wc_get_product_attachment_props( $attachment_id, $post );

			if ( ! $props['url'] ) {
				continue;
			}

			echo "<li class='mixt-image $order_class'><div class='image-wrap $style'>";
				echo apply_filters(
					'woocommerce_single_product_image_thumbnail_html',
					sprintf(
						'<a href="%1$s" data-src="%1$s" class="product-gallery-thumb %2$s" title="%3$s">%4$s</a>',
						esc_url( $props['url'] ),
						esc_attr( $image_class ),
						esc_attr( $props['caption'] ),
						wp_get_attachment_image( $attachment_id, apply_filters( 'single_product_small_thumbnail_size', 'shop_thumbnail' ), 0, $props )
					),
					$attachment_id,
					$post->ID,
					esc_attr( $image_class )
				);
			echo '</div></li>';

			$loop++;
		}

	?></ul>
	<?php
}

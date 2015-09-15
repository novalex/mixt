<?php
/**
 * Single Product Image
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.0.14
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $post, $woocommerce, $product;

?>

<div class="images product-gallery">
	<?php

		// Main Product Image

		$style = mixt_wc_option('single-thumb-style', '');
		if ( preg_match('/image-border|image-outline/', $style) ) $style .= ' ' . mixt_wc_option('single-thumb-border', 'accent');

		echo "<div class='mixt-image'><div class='image-wrap $style'>";
			if ( has_post_thumbnail() ) {
				$image_title 	= esc_attr( get_the_title( get_post_thumbnail_id() ) );
				$image_caption 	= get_post( get_post_thumbnail_id() )->post_excerpt;
				$image_link  	= wp_get_attachment_url( get_post_thumbnail_id() );
				$image       	= get_the_post_thumbnail( $post->ID, apply_filters( 'single_product_large_thumbnail_size', 'shop_single' ), array(
					'title'	=> $image_title,
					'alt'	=> $image_title
					) );

				echo apply_filters(
						'woocommerce_single_product_image_html',
						sprintf( '<a href="%1$s" itemprop="image" data-src="%1$s" class="woocommerce-main-image product-gallery-thumb zoom" title="%2$s">%3$s</a>', $image_link, $image_caption, $image ),
						$post->ID
					);

			} else {
				echo apply_filters( 'woocommerce_single_product_image_html', sprintf( '<img src="%s" alt="%s" />', wc_placeholder_img_src(), __( 'Placeholder', 'woocommerce' ) ), $post->ID );
			}
		echo '</div></div>';

		mixt_wc_badges();

		do_action( 'woocommerce_product_thumbnails' );

	?>

</div>

<?php
/**
 * Related Products
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $product, $woocommerce_loop;

if ( empty( $product ) || ! mixt_wc_option('single-related') || ! $product->exists() ) {
	return;
}

$related_nr = mixt_wc_option('single-related-nr', $posts_per_page);
$related_cols = mixt_wc_option('single-related-cols', $columns);

$related = $product->get_related( $related_nr );

if ( sizeof( $related ) == 0 ) return;

$args = apply_filters( 'woocommerce_related_products_args', array(
	'post_type'            => 'product',
	'ignore_sticky_posts'  => 1,
	'no_found_rows'        => 1,
	'posts_per_page'       => $related_nr,
	'orderby'              => $orderby,
	'post__in'             => $related,
	'post__not_in'         => array( $product->id )
) );

$products = new WP_Query( $args );

$woocommerce_loop['columns'] = $related_cols;

if ( $products->have_posts() ) : ?>

	<div class="related products columns-<?php echo $related_cols; ?>">

		<?php echo mixt_heading( __( 'Related Products', 'woocommerce' ), 'tag="h2"'); ?>

		<?php woocommerce_product_loop_start(); ?>

			<?php while ( $products->have_posts() ) : $products->the_post(); ?>

				<?php wc_get_template_part( 'content', 'product' ); ?>

			<?php endwhile; // end of the loop. ?>

		<?php woocommerce_product_loop_end(); ?>

	</div>

<?php endif;

wp_reset_postdata();

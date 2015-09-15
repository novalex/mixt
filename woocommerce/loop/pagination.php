<?php
/**
 * Pagination - Show numbered pagination for catalog pages.
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.2.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_query;

if ( $wp_query->max_num_pages <= 1 ) {
	return;
}

$page_links = paginate_links( apply_filters( 'woocommerce_pagination_args', array(
	'base'      => esc_url_raw( str_replace( 999999999, '%#%', remove_query_arg( 'add-to-cart', get_pagenum_link( 999999999, false ) ) ) ),
	'format'    => '',
	'add_args'  => '',
	'current'   => max( 1, get_query_var( 'paged' ) ),
	'total'     => $wp_query->max_num_pages,
	'type'      => 'array',
	'prev_text' => '<i class="fa fa-chevron-left"></i>' . __('Previous'),
	'next_text' => __('Next') . '<i class="fa fa-chevron-right"></i>',
	'end_size'  => 3,
	'mid_size'  => 3,
) ) );

if ( ! empty($page_links) ) {
	$nav_class = 'page-nav paging-navigation numbered-paging';
	?>
	<nav role="navigation" id="shop-nav" class="<?php echo $nav_class; ?>">
		<h1 class="screen-reader-text"><?php _e( 'Shop navigation', 'mixt' ); ?></h1>
		<ul class="pager">
			<?php foreach ( $page_links as $link ) { echo '<li>' . $link . '</li>'; } ?>
		</ul>
	</nav>
	<?php
}

?>

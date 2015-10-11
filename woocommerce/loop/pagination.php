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

$pag_type = Mixt_Options::get('layout', 'pagination-type');
$page_max = $wp_query->max_num_pages;

if ( $pag_type == 'classic' ) {
	$nav_class = 'page-nav paging-navigation classic-paging';

	?>
	<nav id="shop-nav" class="<?php echo $nav_class; ?>">
		<h3 class="screen-reader-text"><?php _e( 'Shop navigation', 'mixt' ); ?></h3>
		<ul class="pager">
		<?php if ( get_previous_posts_link() ) : ?>
			<li class="nav-previous prev"><?php previous_posts_link( __( '<i class="fa fa-chevron-left"></i> Previous products', 'mixt' ) ); ?></li>
		<?php endif; ?>

		<?php if ( get_next_posts_link(null, $page_max) ) : ?>
			<li class="nav-next next"><?php next_posts_link( __( 'Next products <i class="fa fa-chevron-right"></i>', 'mixt' ), $page_max ); ?></li>
		<?php endif; ?>
		</ul>
	</nav>
	<?php

} else if ( $pag_type == 'numbered' ) {
	$page_links = paginate_links( apply_filters( 'woocommerce_pagination_args', array(
		'base'      => esc_url_raw( str_replace( 999999999, '%#%', remove_query_arg( 'add-to-cart', get_pagenum_link( 999999999, false ) ) ) ),
		'format'    => '',
		'add_args'  => '',
		'current'   => max( 1, get_query_var( 'paged' ) ),
		'total'     => $page_max,
		'type'      => 'array',
		'prev_text' => '<i class="fa fa-chevron-left"></i>' . __( 'Previous', 'mixt' ),
		'next_text' => __( 'Next', 'mixt' ) . '<i class="fa fa-chevron-right"></i>',
		'end_size'  => 3,
		'mid_size'  => 3,
	) ) );

	if ( ! empty($page_links) ) {
		$nav_class = 'page-nav paging-navigation numbered-paging';
		?>
		<nav id="shop-nav" class="<?php echo $nav_class; ?>">
			<h3 class="screen-reader-text"><?php _e( 'Shop navigation', 'mixt' ); ?></h3>
			<ul class="pager">
				<?php foreach ( $page_links as $link ) { echo '<li>' . $link . '</li>'; } ?>
			</ul>
		</nav>
		<?php
	}
} else if ( $pag_type == 'ajax-click' || $pag_type == 'ajax-scroll' ) {
	$nav_class = 'page-nav paging-navigation ajax-paging';
	$page_now = max(1, get_query_var('paged'));

	?>
	<nav id="shop-nav" class="<?php echo $nav_class; ?>"
		 data-page-now="<?php echo $page_now; ?>" data-page-max="<?php echo $page_max; ?>">
		<h3 class="screen-reader-text"><?php _e( 'Shop navigation', 'mixt' ); ?></h3>
		<ul class="pager">
			<li><a href="<?php echo next_posts($page_max, false); ?>" class="ajax-more" 
				data-loading-text="<?php _e( 'Loading...', 'mixt' ); ?>" 
				data-complete-text="<?php _e( 'No more posts to load', 'mixt' ); ?>" 
				data-error-text="<?php _e( 'An error occured while trying to load the posts!', 'mixt' ); ?>"
			><i class="fa fa-chevron-down"></i><?php _e( 'Load more posts', 'mixt' ); ?></a></li>
		</ul>
	</nav>
	<?php
}

?>

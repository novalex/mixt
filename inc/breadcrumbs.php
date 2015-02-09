<?php

/* ------------------------------------------------ /
MIXT BREADCRUMBS
/ ------------------------------------------------ */

/**
 * Output breadcrumbs
 */
function mixt_breadcrumbs($page_title) {

	global $post;

	echo '<ol id="breadcrumbs" class="breadcrumb" itemprop="breadcrumb">';

	if ( ! is_front_page() ) {
		echo '<li><a href="' . home_url() . '">' . _x( 'Home', 'breadcrumb', 'mixt' ) . '</a></li>';

		if ( is_category() || is_single() ) {
			echo '<li>';
			the_category(' </li><li> ');

			if ( is_single() ) {
				echo '</li><li>';
				the_title();
				echo '</li>';
			}
		} else if ( is_page() ) {

			if ( $post->post_parent ) {
				$title = get_the_title();
				$ancestors = get_post_ancestors( $post->ID );

				foreach ( $ancestors as $ancestor ) {
					$output = '<li><a href="' . get_permalink($ancestor) . '" title="' . get_the_title($ancestor) . '">' . get_the_title($ancestor) . '</a></li>';
				}
				echo $output;
				echo '<li>' . $title . '</li>';
			} else {
				echo '<li>' . get_the_title() . '</li>';
			}
		} else if ( is_home() && $page_title == 'Blog' ) {
			echo '<li>' . $page_title . '</li>';
		}
	} else if ( is_tag() ) {
		single_tag_title();
	} else if ( is_day() ) {
		echo '<li>Archive for ' . the_time('F jS, Y') . '</li>';
	} else if ( is_month() ) {
		echo '<li>Archive for ' . the_time('F, Y') . '</li>';
	} else if ( is_year() ) {
		echo '<li>Archive for ' . the_time('Y') . '</li>';
	} else if ( is_author() ) {
		echo '<li>Author Archive</li>';
	} else if ( isset($_GET['paged']) && ! empty($_GET['paged']) ) {
		echo '<li>Blog Archives</li>';
	} else if ( is_search() ) {
		echo '<li>Search Results</li>';
	}

	echo '</ol>';
}

/* CUSTOM WOOCOMMERCE BREADCRUMBS */

add_filter( 'woocommerce_breadcrumb_defaults', 'mixt_woocommerce_breadcrumbs' );

/**
 * Customize WooCommerce breadcrumbs
 */
function mixt_woocommerce_breadcrumbs() {

    remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0);

	return array(
		'delimiter'   => '</li>',
		'wrap_before' => '<ol id="breadcrumbs" class="breadcrumb" itemprop="breadcrumb">',
		'wrap_after'  => '</ol>',
		'before'      => '<li>',
		'after'       => '</li>',
		'home'        => _x( 'Home', 'breadcrumb', 'mixt' ),
	);
}

?>
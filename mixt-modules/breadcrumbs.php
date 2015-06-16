<?php

/**
 * Breadcrumbs
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Output breadcrumbs
 *
 * @param string $page_title
 * @param string $extra_classes
 */
function mixt_breadcrumbs($page_title = '', $extra_classes = '') {

	if ( is_front_page() ) { return; }

	global $post, $mixt_opt;

	$prefix = ( ! empty($mixt_opt['breadcrumbs-prefix']) ) ? $mixt_opt['breadcrumbs-prefix'] : '';

	if ( empty($page_title) ) { $page_title = get_the_title(); }

	$classes = 'breadcrumb ' . $extra_classes;

	echo '<ol id="breadcrumbs" class="' . $classes . '" itemprop="breadcrumb">';

		if ( ! empty($prefix) ) {
			echo '<li class="bc-prefix">' . $prefix . '</li>';
		}

		echo '<li><a href="' . home_url() . '">' . _x( 'Home', 'breadcrumb', 'mixt' ) . '</a></li>';

		// Category Or Single Page
		if ( is_category() || is_single() ) {

			if ( is_attachment() ) {
				$parent_id        = $post->post_parent;
				$parent_title     = get_the_title( $parent_id );
				if ( $parent_title != $page_title ) {
					$parent_permalink = get_permalink( $parent_id );
					echo '<li><a href="' . $parent_permalink . '" title="' . $parent_title . '">' . $parent_title . '</a></li>';
				}
			} else if ( is_category() ) {
				$category = get_category(get_query_var('cat'), false);
				if ( $category->parent != 0 ) {
					$cat_parents = get_category_parents($category->parent, true, '</li><li>');
				} else {
					$cat_parents = '';
				}
				echo '<li>' . $cat_parents . $category->name . '</li>';
			}

			if ( is_single() ) {
				echo '<li>' . $page_title . '</li>';
			}

		// Date Page
		} else if ( is_day() || is_month() || is_year() ) {
			$day   = get_the_date('d');
			$month = get_the_date('m');
			$year  = get_the_date('Y');

			$archive_crumbs = '';

			if ( is_year() ) {
				$archive_crumbs .= '<li>' . $year . '</li>';
			} else {
				$archive_crumbs .= '<li><a href="' . esc_url( get_year_link( $year ) ) . '">' . $year . '</a></li>';

				if ( is_day() ) {
					$archive_crumbs .= '<li><a href="' . esc_url( get_month_link( $year, $month ) ) . '">' . get_the_date('F') . '</a></li>';
					$archive_crumbs .= '<li>' . get_the_date('jS') . '</li>';
				} else if ( is_month() ) {
					$archive_crumbs .= '<li>' . get_the_date('F') . '</li>';
				}
			}

			echo $archive_crumbs;

		// Tag Page
		} else if ( is_tag() ) {
			echo '<li>' . single_tag_title('', false) . '</li>';

		// Author Archive Page
		} else if ( is_author() ) {
			$author = get_queried_object();
			echo '<li>' . $author->display_name . '</li>';

		// Search Page
		} else if ( is_search() ) {
			echo '<li>' . _x( 'Search', 'breadcrumb', 'mixt' ) . '</li>';

		// "Page" Type Page
		} else if ( is_page() ) {

			$page_title = get_the_title($post->ID);

			if ( $post->post_parent ) {
				$ancestors = get_post_ancestors( $post->ID );

				foreach ( $ancestors as $ancestor ) {
					$output    = '';
					$title     = get_the_title($ancestor);
					$permalink = get_permalink($ancestor);
					if ( ! empty($title) ) {
						$output = '<li><a href="' . $permalink . '" title="' . $title . '">' . $title . '</a></li>';
					}
				}
				echo $output;
				echo '<li>' . $page_title . '</li>';
			} else {
				echo '<li>' . $page_title . '</li>';
			}

		// Home Page
		} else if ( is_home() ) {
			echo '<li>' . $page_title . '</li>';
		}

	echo '</ol>';
}

// CUSTOM WOOCOMMERCE BREADCRUMBS

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

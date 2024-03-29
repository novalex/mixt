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
 */
function mixt_breadcrumbs( $page_title = '' ) {

	if ( is_front_page() ) { return; }

	if ( function_exists('yoast_breadcrumb') ) {
		yoast_breadcrumb('<div id="breadcrumbs" class="breadcrumb">', '</div>');
	} else if ( class_exists('WooCommerce') && ( is_woocommerce() || is_cart() || is_checkout() ) ) {
		woocommerce_breadcrumb();
	} else {
		global $post, $mixt_opt;

		$prefix = ( ! empty($mixt_opt['breadcrumbs-prefix']) ) ? $mixt_opt['breadcrumbs-prefix'] : '';

		if ( empty($page_title) ) { $page_title = get_the_title(); }

		echo '<ol id="breadcrumbs" class="breadcrumb">';

			if ( $prefix != '' ) {
				echo '<li class="bc-prefix">' . esc_html($prefix) . '</li>';
			}

			echo '<li><a href="' . esc_url( home_url() ) . '">' . esc_html_x( 'Home', 'breadcrumb', 'mixt' ) . '</a></li>';

			// Category Or Single Page
			if ( is_category() || is_single() ) {

				if ( is_attachment() ) {
					$parent_id    = $post->post_parent;
					$parent_title = get_the_title($parent_id);
					if ( $parent_title != $page_title ) {
						$parent_permalink = get_permalink($parent_id);
						echo '<li><a href="' . esc_url($parent_permalink) . '" title="' . esc_attr($parent_title) . '">' . esc_html($parent_title) . '</a></li>';
					}
				} else if ( is_category() ) {
					$category = get_category(get_query_var('cat'), false);
					if ( $category->parent != 0 ) {
						$cat_parents = get_category_parents($category->parent, true, '</li><li>');
					} else {
						$cat_parents = '';
					}
					echo '<li>' . $cat_parents . esc_html($category->name) . '</li>';
				}

				// Post type with archive page
				if ( $post_type = get_post_type($post) ) {
					if ( ! in_array($post_type, array('post', 'page', 'attachment', 'revision', 'nav_menu_item')) && $post_type_link = get_post_type_archive_link($post_type) ) {
						$post_type_ob = get_post_type_object($post_type);
						$post_type_name = $post_type_ob->labels->name;
						echo '<li><a href="' . esc_url($post_type_link) . '" title="' . esc_attr($post_type_name) . '">' . esc_html($post_type_name) . '</a></li>';
					}
				}

				// Show blog breadcrumb for single blog post
				if ( is_singular('post') && get_option('page_for_posts') !== 0 ) {
					$blog_id = get_option('page_for_posts');
					$blog_page = get_post($blog_id);
					$blog_title = $blog_page->post_title;
					echo '<li><a href="' . esc_url( get_permalink($blog_id) ) . '" title="' . esc_attr($blog_title) . '">' . esc_html($blog_title) . '</a></li>';
				}

				// Single page / post title
				if ( is_single() ) {
					echo '<li>' . esc_html($page_title) . '</li>';
				}

			// Date Page
			} else if ( is_day() || is_month() || is_year() ) {
				$day   = get_the_date('d');
				$month = get_the_date('m');
				$year  = get_the_date('Y');

				$archive_crumbs = '';

				if ( is_year() ) {
					$archive_crumbs .= '<li>' . esc_html($year) . '</li>';
				} else {
					$archive_crumbs .= '<li><a href="' . esc_url( get_year_link( $year ) ) . '">' . esc_html($year) . '</a></li>';

					if ( is_day() ) {
						$archive_crumbs .= '<li><a href="' . esc_url( get_month_link( $year, $month ) ) . '">' . esc_html( get_the_date('F') ) . '</a></li>';
						$archive_crumbs .= '<li>' . esc_html( get_the_date('jS') ) . '</li>';
					} else if ( is_month() ) {
						$archive_crumbs .= '<li>' . esc_html( get_the_date('F') ) . '</li>';
					}
				}

				echo mixt_clean($archive_crumbs);

			// Tag Page
			} else if ( is_tag() ) {
				echo '<li>' . esc_html_x( 'Tag: ', 'breadcrumb', 'mixt' ) . esc_html( single_tag_title('', false) ) . '</li>';

			// Taxonomy Page
			} else if ( is_tax() ) {
				$tax_slug = get_query_var('taxonomy');
				$tax = get_taxonomy($tax_slug);
				$term = get_term_by('slug', get_query_var('term'), $tax_slug);
				echo '<li>';
					echo esc_html($tax->labels->singular_name . ': ' . $term->name);
				echo '</li>';

			// Author Archive Page
			} else if ( is_author() ) {
				$author = get_queried_object();
				echo '<li>' . esc_html_x( 'Author: ', 'breadcrumb', 'mixt' ) . esc_html($author->display_name) . '</li>';

			// Search Page
			} else if ( is_search() ) {
				echo '<li>' . esc_html_x( 'Search', 'breadcrumb', 'mixt' ) . '</li>';

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
							$output = '<li><a href="' . esc_url($permalink) . '" title="' . esc_attr($title) . '">' . esc_html($title) . '</a></li>';
						}
					}
					echo mixt_clean($output);
				}
				echo '<li>' . esc_html($page_title) . '</li>';

			// Home & Archive Page
			} else if ( is_home() || is_archive() ) {
				echo '<li>' . esc_html($page_title) . '</li>';

			// 404 Page
			} else if ( is_404() ) {
				echo '<li>404</li>';
			}

		echo '</ol>';
	}
}


/**
 * Customize WooCommerce breadcrumbs
 */
function mixt_woocommerce_breadcrumbs() {
	$wrap_before = '<ol id="breadcrumbs" class="breadcrumb">';

	global $mixt_opt;
	$prefix = ( ! empty($mixt_opt['breadcrumbs-prefix']) ) ? $mixt_opt['breadcrumbs-prefix'] : '';
	if ( $prefix != '' ) { $wrap_before .= '<li class="bc-prefix">' . esc_html($prefix) . '</li>'; }

    return array(
		'delimiter'   => '',
		'wrap_before' => $wrap_before,
		'wrap_after'  => '</ol>',
		'before'      => '<li>',
		'after'       => '</li>',
		'home'        => esc_html_x( 'Home', 'breadcrumb', 'mixt' ),
	);
}
add_filter('woocommerce_breadcrumb_defaults', 'mixt_woocommerce_breadcrumbs');

?>

<?php

/**
 * Blog Template
 *
 * Template Name: Blog (Posts Page)
 *
 * @package MIXT
 */

get_header();

	// Page Content Loop

	while ( have_posts() ) :

		the_post();

		get_template_part( 'templates/content', 'page' );

	endwhile; // End The Loop

	// Attached Posts Loop

	$post_ids = explode(', ', mixt_meta('_mixt-attached-posts'));
	$post_nr  = intval(mixt_meta('_mixt-posts-page'));

	if ( ! empty($post_ids) && is_array($post_ids) ) {

		echo '<div class="posts-container">';

		$args = array(
			'post__in'       => $post_ids,
			'posts_per_page' => $post_nr,
			'paged'          => ( get_query_var('paged') ) ? get_query_var('paged') : 1,
		);
		$posts = new WP_Query( $args );

		if ( $posts->have_posts() ) {
			while ( $posts->have_posts() ) {
				$posts->the_post();
				get_template_part( 'templates/content' );
			}
			wp_reset_postdata();
		}

		echo '</div>'; // Close .posts-container

		mixt_content_nav( 'nav-below', true, $posts->max_num_pages );
	}

get_sidebar();

get_footer();

?>

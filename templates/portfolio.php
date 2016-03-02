<?php

/**
 * Portfolio Template
 *
 * Template Name: Portfolio (Projects Page)
 *
 * @package MIXT
 */

get_header();

	// Page Content Loop

	while ( have_posts() ) :

		the_post();

		get_template_part( 'templates/content', 'blog' );

	endwhile; // End The Loop

	$cont_classes = 'portfolio-wrap';

	$is_sortable = ( mixt_get_option( array( 'key' => 'portfolio-page-filters' ) ) && function_exists('mixt_portfolio_filters') );
	
	if ( $is_sortable ) { $cont_classes .= ' portfolio-sortable'; }

	// Attached Posts Loop

	echo "<div class='$cont_classes'>";

		// Set portfolio item display options
		$options = mixt_get_options( array(
			'feat-ph' => array(
				'key'    => 'portfolio-page-feat-ph',
				'return' => 'value',
			),
			'title' => array(
				'key'     => 'portfolio-page-title',
				'default' => true,
			),
			'content' => array(
				'key'     => 'portfolio-page-content',
				'default' => false,
			),
			'meta-comments' => array(
				'key'     => 'project-comments',
				'default' => true,
			),
		) );
		Mixt_Options::set('post-display', null, $options);

		// Filter links
		if ( $is_sortable ) {
			mixt_portfolio_filters();
		}

		// Attached Posts Loop
		
		$post_ids = mixt_meta('_mixt-attached-posts');
		$post_ids = empty($post_ids) ? array() : explode(', ', $post_ids);
		$post_nr  = mixt_meta('_mixt-posts-page');
		if ( $post_nr == 'auto' ) {
			$post_nr = get_option('posts_per_page', 10);
		} else {
			$post_nr = intval($post_nr);
		}

		// Output Posts Container And Run Query

		echo '<div class="posts-container">';

			$args = array(
				'post_type'      => 'portfolio',
				'post__in'       => $post_ids,
				'posts_per_page' => $post_nr,
				'paged'          => ( get_query_var('paged') ) ? get_query_var('paged') : 1,
			);
			$posts = new WP_Query( $args );

			if ( $posts->have_posts() ) {
				while ( $posts->have_posts() ) {
					$posts->the_post();
					get_template_part( 'templates/content', get_post_format() );
				}
				wp_reset_postdata();
			}

		echo '</div>'; // Close .posts-container

		mixt_content_nav( 'nav-below', true, $posts->max_num_pages );

	echo '</div>'; // Close .portfolio

get_sidebar();

get_footer();

?>

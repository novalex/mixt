<?php

/**
 * Template For Displaying Search Results Pages
 *
 * @package MIXT
 */

get_header();

	if ( have_posts() && strlen(trim(get_search_query())) != 0 ) :

		echo '<div class="posts-container">';

		while ( have_posts() ) : // Start The Loop

			the_post();

			get_template_part( 'templates/content', 'search' );

		endwhile; // End The Loop

		echo '</div>'; // Close .posts-container

		mixt_content_nav( 'nav-below', true );

	else :

		get_template_part( 'templates/no-results', 'search' );

	endif;

get_sidebar();

get_footer();

?>

<?php

/**
 * Template For Displaying Search Results Pages
 *
 * @package MIXT
 */

get_header();

	if ( have_posts() ) : ?>

		<?php

		while ( have_posts() ) : // Start The Loop

			the_post();

			get_template_part( 'templates/content', 'search' );

		endwhile; // End The Loop

		mixt_content_nav( 'nav-below' );

	else :

		get_template_part( 'templates/no-results', 'search' );

	endif;

get_sidebar();

get_footer();

?>
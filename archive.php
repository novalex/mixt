<?php

/**
 * Template For Displaying Archive Pages
 *
 * @package MIXT
 */

get_header();

if ( have_posts() ) {

	echo '<div class="posts-container">';

	while ( have_posts() ) : // Start The Loop

		the_post();

		/* Include the Post-Format-specific template for the content.
		 * If you want to overload this in a child theme then include a file
		 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
		 */
		get_template_part( 'templates/content', get_post_format() );

	endwhile; // End The Loop

	echo '</div>'; // Close .posts-container

	mixt_content_nav( 'nav-below', true );

} else {

	get_template_part( 'templates/no-results', 'archive' ); // Load "Nothing Found / No Results" template

}

get_sidebar();

get_footer();

?>
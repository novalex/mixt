<?php

/**
 * Author Template File
 *
 * @package MIXT
 */

get_header();

mixt_about_the_author(false);

if ( have_posts() ) {

	echo '<div class="posts-container">';

	while ( have_posts() ) : // Start The Loop

		the_post();

		get_template_part( 'templates/content', get_post_format() );

	endwhile; // End The Loop

	echo '</div>'; // Close .posts-container

	mixt_content_nav( 'nav-below', true );

} else {
	
	get_template_part( 'templates/no-results', 'index' ); // Load "Nothing Found / No Results" template

}

get_sidebar();

get_footer();

?>
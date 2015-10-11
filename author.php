<?php

/**
 * Author Template File
 *
 * @package MIXT
 */

get_header();

echo '<div class="author-wrap page-padding">';
	mixt_about_the_author(false);
echo '</div>';

echo '<div class="posts-container page-padding">';

if ( have_posts() ) {

	// Set display options
	Mixt_Options::set('post-display', null, array('meta-author' => false));

	echo mixt_heading( __( 'Entries by this author', 'mixt' ) );

	while ( have_posts() ) : // Start The Loop

		the_post();

		get_template_part( 'templates/content', get_post_format() );

	endwhile; // End The Loop

	mixt_content_nav( 'nav-below', true );

} else {

	echo mixt_heading( __( 'No entries by this author', 'mixt' ) );

}

echo '</div>'; // Close .posts-container

get_sidebar();

get_footer();

?>
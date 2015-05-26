<?php

/**
 * Main Template File
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package MIXT
 */

get_header();

if ( have_posts() ) {

	// Determine if a posts page is displayed
	$is_posts_page = mixt_is_posts_page();

	if ( $is_posts_page ) { echo '<div class="posts-container">'; }

	while ( have_posts() ) : // Start The Loop

		the_post();

		/* Include the Post-Format-specific template for the content.
		 * If you want to overload this in a child theme then include a file
		 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
		 */
		get_template_part( 'templates/content', get_post_format() );

	endwhile; // End The Loop

	if ( $is_posts_page ) { echo '</div>'; } // Close .posts-container

	mixt_content_nav( 'nav-below', true );

} else {
	
	get_template_part( 'templates/no-results', 'index' ); // Load "Nothing Found / No Results" template

}

get_sidebar();

get_footer();

?>
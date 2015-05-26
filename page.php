<?php

/**
 * Template For Displaying All Pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package MIXT
 */

get_header();

	while ( have_posts() ) : // Start The Loop

		the_post();

		get_template_part( 'templates/content', 'page' );

		// If comments are open or we have at least one comment, load up the comment template
		if ( comments_open() || '0' != get_comments_number() ) {
			comments_template('/templates/comments.php');
		}

	endwhile; // End The Loop

get_sidebar();

get_footer();

?>

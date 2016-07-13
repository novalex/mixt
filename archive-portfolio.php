<?php

/**
 * Template For Displaying Portfolio Pages
 *
 * @package MIXT
 */

get_header();

if ( have_posts() ) {

	$cont_classes = 'portfolio-wrap page-padding';

	$is_sortable = ( mixt_get_option(array('key' => 'portfolio-page-filters')) && function_exists('mixt_portfolio_filters') );
	if ( $is_sortable ) $cont_classes .= ' portfolio-sortable';

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

	echo '</div>'; // Close .portfolio

} else {

	get_template_part( 'templates/no-results', 'archive' ); // Load "Nothing Found / No Results" template

}

get_sidebar();

get_footer();

?>
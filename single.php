<?php

/**
 * Template For Displaying Single Posts
 *
 * @package MIXT
 */

get_header();

	while ( have_posts() ) : // Start The Loop

		the_post();

		get_template_part( 'templates/content', 'single' );

		$options = array(
			'post-about-author'    => array(),
			'post-navigation'      => array(),
			'post-related'         => array(),
			'post-related-feat'    => array(),
			'post-related-feat-ph' => array(
				'return' => 'value',
			),
			'post-related-excerpt' => array(),
			'post-related-number'  => array(
				'type'   => 'str',
				'return' => 'value',
			),
		);
		$options = mixt_get_options($options);

		// Post Navigation
		if ( $options['post-navigation'] == 'true' ) {
			mixt_content_nav( 'nav-below' );
		}

		// About The Author
		if ( $options['post-about-author'] == 'true' ) {
			mixt_about_the_author();
		}

		// Related Posts
		if ( $options['post-related'] == 'true' ) {
			$args = array(
				'featured' => $options['post-related-feat'],
				'excerpt'  => $options['post-related-excerpt'],
				'number'   => $options['post-related-number'],
				'related'  => 'cats',
			);
			if ( ! empty($options['post-related-feat-ph']['id']) ) {
				$args['feat-ph'] = $options['post-related-feat-ph']['id'];
			}
			mixt_related_posts($args);
		}

		// If comments are open or we have at least one comment, load up the comment template
		if ( comments_open() || '0' != get_comments_number() ) {
			comments_template('/templates/comments.php');
		}

	endwhile; // End The Loop

get_sidebar();

get_footer();

?>
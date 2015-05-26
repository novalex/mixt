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
			'post-sharing'      => array(),
			'post-about-author' => array(),
			'post-navigation'   => array(),
			'post-related'      => array(),
		);
		$options = mixt_get_options($options);

		// Post Social Sharing Buttons
		if ( $options['post-sharing'] == 'true' ) {
			echo '<div class="post-extra post-share-cont">';
				// echo '<h3 class="title">' . __( 'Share this', 'mixt' ) . '</h3>';
				mixt_social_profiles(true, 'sharing');
			echo '</div>';
		}

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
			$related_options = array(
				'slider'  => array( 'key' => 'post-related-slider' ),
				'feat-ph' => array( 'key' => 'post-related-feat-ph', 'return' => 'value' ),
				'number'  => array( 'key' => 'post-related-number', 'type'   => 'str', 'return' => 'value' ),
			);
			$related_options = mixt_get_options($related_options);
			$args = array(
				'number'   => $related_options['number'],
				'slider'   => $related_options['slider'],
				'related'  => 'cats',
			);
			if ( ! empty($related_options['feat-ph']['id']) ) { $args['feat-ph'] = $related_options['feat-ph']['id']; }
			mixt_related_posts($args);
		}

		// Comments
		if ( comments_open() || '0' != get_comments_number() ) {
			comments_template('/templates/comments.php');
		}

	endwhile; // End The Loop

get_sidebar();

get_footer();

?>

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

		$options = mixt_get_options( array(
			'post-tags'         => array(),
			'post-sharing'      => array(),
			'post-about-author' => array(),
			'post-navigation'   => array(),
			'post-related'      => array(),
		) );

		// Post Tags
		if ( $options['post-tags'] ) {
			$tags = get_the_tag_list( '<p class="tag-list"><strong>' . esc_html__( 'Tags:', 'mixt' ) . '</strong>', '', '</p>' );
			if ( $tags != '' ) {
				echo '<footer class="entry-footer post-tags post-extra">' . $tags . '</footer>';
			}
		}

		// Post Social Sharing Buttons
		if ( $options['post-sharing'] ) {
			$icons = mixt_social_profiles(false, array(
				'type'  => 'sharing',
				'style' => 'group',
				'class' => 'post-share btn-group-justified',
			));
			if ( $icons != '' ) {
				echo '<div class="post-extra post-share-cont">';
					echo mixt_heading( esc_html__( 'Share this', 'mixt' ) );
					echo mixt_clean($icons);
				echo '</div>';
			}
		}

		// Post Navigation
		if ( $options['post-navigation'] ) {
			mixt_content_nav('post-nav');
		}

		// About The Author
		if ( $options['post-about-author'] ) {
			mixt_about_the_author();
		}

		// Related Posts
		if ( $options['post-related'] ) {
			mixt_related_posts('post', esc_html__( 'Related Posts', 'mixt' ));
		}

		// Comments
		if ( comments_open() || '0' != get_comments_number() ) {
			comments_template('/templates/comments.php');
		}

	endwhile; // End The Loop

get_sidebar();

get_footer();

?>

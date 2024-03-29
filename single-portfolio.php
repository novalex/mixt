<?php

/**
 * Template for displaying single portfolio items
 *
 * @package MIXT
 */

get_header();

	while ( have_posts() ) : // Start The Loop

		the_post();

		get_template_part( 'templates/content', 'portfolio' );

		// Get project page options
		$options = mixt_get_options( array(
			'project-tags'         => array(),
			'project-sharing'      => array(),
			'project-navigation'   => array(),
			'project-about-author' => array(),
			'project-related'      => array(),
			'project-comments'     => array(),
		) );

		// Project Taxonomies
		if ( $options['project-tags'] ) {
			$types = get_the_term_list($post->ID, 'project-type', '<p class="tag-list"><strong>' . esc_html__( 'Type:', 'mixt' ) . '</strong>', '', '</p>');
			$attrs = get_the_term_list($post->ID, 'project-attribute', '<p class="tag-list"><strong>' . esc_html__( 'Attributes:', 'mixt' ) . '</strong>', '', '</p>');
			if ( $types != '' || $attrs != '' ) {
				echo '<footer class="entry-footer post-tags post-extra">' . $types . $attrs . '</footer>';
			}
		}

		// Post Social Sharing Buttons
		if ( $options['project-sharing'] ) {
			$profiles = array();

			$sel_profiles = mixt_get_option( array( 'key' => 'project-sharing-profiles', 'return' => 'value' ) );
			$set_profiles = mixt_get_option( array( 'key' => 'social-sharing-profiles', 'return' => 'value' ) );

			// Build array of selected sharing profiles
			if ( ! empty($sel_profiles) ) {
				if ( empty($set_profiles) ) {
					$set_profiles = mixt_preset_social_profiles('sharing');
				}
				foreach ( $set_profiles as $key => $profile ) {
					if ( ! empty($sel_profiles[$key]) ) $profiles[$key] = $profile;
				}
			}

			$icons = mixt_social_profiles(false, array(
				'type'     => 'sharing',
				'style'    => 'group',
				'profiles' => $profiles,
				'class'    => 'post-share btn-group-justified',
			));
			if ( $icons != '' ) {
				echo '<div class="post-extra post-share-cont">';
					echo mixt_heading( esc_html__( 'Share this', 'mixt' ) );
					echo mixt_clean($icons);
				echo '</div>';
			}
		}

		// Post Navigation
		if ( $options['project-navigation'] ) {
			mixt_content_nav('post-nav');
		}

		// About The Author
		if ( $options['project-about-author'] ) {
			mixt_about_the_author();
		}

		// Related Posts
		if ( $options['project-related'] ) {
			mixt_related_posts('project', esc_html__( 'Other Projects', 'mixt' ));
		}

		// Comments
		if ( $options['project-comments'] && ( comments_open() || '0' != get_comments_number() ) ) {
			comments_template('/templates/comments.php');
		}

	endwhile; // End The Loop

get_sidebar();

get_footer();

?>

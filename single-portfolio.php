<?php

/**
 * Template for displaying single portfolio items
 *
 * @package MIXT
 */

get_header();

	while ( have_posts() ) : // Start The Loop

		the_post();

		// Set portfolio item display options
		$options = array(
			'meta' => false,
		);
		Mixt_Options::set('post-display', null, $options);

		get_template_part( 'templates/content', 'portfolio' );

		// Get project page options
		$options = mixt_get_options( array(
			'project-taxonomies' => array(),
			'project-sharing'    => array(),
			'project-navigation' => array(),
			'project-related'    => array(),
			'project-comments'   => array(),
		) );

		// Project Taxonomies
		if ( $options['project-taxonomies'] ) {
			//global $post;
			
			$types = get_the_term_list($post->ID, 'project-type', '<p class="tag-list"><strong>' . __( 'Type:', 'mixt' ) . '</strong>', '', '</p>');
			$attrs = get_the_term_list($post->ID, 'project-attributes', '<p class="tag-list"><strong>' . __( 'Attributes:', 'mixt' ) . '</strong>', '', '</p>');
			if ( $types != '' || $attrs != '' ) {
				echo '<footer class="entry-footer post-tags post-extra">' . $types . $attrs . '</footer>';
			}
		}

		// Post Social Sharing Buttons
		if ( $options['project-sharing'] ) {
			global $mixt_opt;

			$profiles = array();

			// Build array of selected sharing profiles
			if ( $sel_profiles = $mixt_opt['project-sharing-profiles'] ) {
				$set_profiles = ( ! empty($mixt_opt['social-sharing-profiles']) ) ? $mixt_opt['social-sharing-profiles'] : mixt_preset_social_profiles('sharing');
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
					echo mixt_heading( __( 'Share this', 'mixt' ) );
					echo $icons;
				echo '</div>';
			}
		}

		// Post Navigation
		if ( $options['project-navigation'] ) {
			mixt_content_nav('post-nav');
		}

		// Related Posts
		if ( $options['project-related'] ) {
			mixt_related_posts('project', __( 'Other Projects', 'mixt' ));
		}

		// Comments
		if ( $options['project-comments'] && ( comments_open() || '0' != get_comments_number() ) ) {
			comments_template('/templates/comments.php');
		}

	endwhile; // End The Loop

get_sidebar();

get_footer();

?>

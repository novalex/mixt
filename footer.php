<?php

/**
 * The template for displaying the footer
 *
 * @package MIXT
 */

$options = mixt_get_options( array(
	'back-to-top'      => array(),
	'back-to-top-icon' => array( 'return' => 'value' ),

	'widgets-hide'     => array( 'key' => 'footer-widgets-hide' ),
	'left-content'     => array( 'key' => 'footer-left-content', 'type' => 'str', 'return' => 'value' ),
	'left-code'        => array( 'key' => 'footer-left-code', 'return' => 'value' ),
	'left-hide'        => array( 'key' => 'footer-left-hide' ),
	'right-content'    => array( 'key' => 'footer-right-content', 'type' => 'str', 'return' => 'value' ),
	'right-code'       => array( 'key' => 'footer-right-code', 'return' => 'value' ),
	'right-hide'       => array( 'key' => 'footer-right-hide' ),
	'social-profiles'  => array( 'key' => 'footer-social-profiles', 'return' => 'value' ),

	'info-bar'         => array(),
	'info-bar-content' => array( 'type' => 'str', 'return' => 'value' ),
	'info-bar-fixed'   => array(),
	'info-bar-hide'    => array(),
) );

?>
				</div><?php // close #content or .sidebar, if sidebar is active ?>

			</div><?php // close .row ?>

		</div><?php // close #content-wrap ?>

		<?php

		// Back To Top Button
		if ( $options['back-to-top'] ) {
			echo '<a href="#" id="back-to-top" class="btn btn-accent btn-lg" data-no-hash-scroll="true">';
				echo '<i class="' . $options['back-to-top-icon'] . '"></i>';
			echo '</a>';
		}

		?>

	</div><?php // close #main-wrap-inner ?>

	<footer id="colophon" class="theme-<?php echo Mixt_Options::get('themes', 'footer'); ?>">
		<?php

		// Footer Widget Row
		$sidebars = 0;
		$active_sidebars = array();
		foreach ( array( 'footer-1', 'footer-2', 'footer-3', 'footer-4' ) as $sidebar_id ) {
			if ( is_active_sidebar($sidebar_id) ) {
				$sidebars++;
				$active_sidebars[] = $sidebar_id;
			}
		}
		if ( $sidebars > 0 ) {
			$widgets_class = 'footer-row widget-row theme-section-alt';
			if ( $options['widgets-hide'] ) { $widgets_class .= ' hidden-xs'; }
			
			?>
			<div class="<?php echo $widgets_class; ?>">
				<div class="container">
					<div id="footer-widgets" class="row">
						<?php foreach ( $active_sidebars as $sidebar ) { ?>
							<div class="widget-area <?php echo 'col-sm-' . ( 12 / intval($sidebars) ); ?>" role="complementary">
								<?php dynamic_sidebar($sidebar); ?>
							</div>
						<?php } ?>
					</div>
				</div>
			</div>
			<?php
		}

		// Footer Copyright Row

		$left_content = $left_content_class = $right_content = $right_content_class = '';

		if ( $options['left-content'] == '1' || $options['right-content'] == '1' ) {
			$profiles = array();
			global $mixt_opt;
			$set_profiles = get_option('mixt-social-profiles', mixt_preset_social_profiles('networks'));
			foreach ( $set_profiles as $key => $profile ) {
				if ( ! empty($options['social-profiles'][$key]) ) $profiles[$key] = $profile;
			}
		}

		if ( $options['left-content'] == '1' ) {
			$left_content = mixt_social_profiles(false, array( 'style' => 'group', 'profiles' => $profiles, 'color' => 'minimal' ));
		} else if ( $options['left-content'] == '2' ) {
			$left_content = '<div class="content-code">' . str_replace('{{year}}', date('Y'), $options['left-code']) . '</div>';
		}
		if ( $options['left-hide'] ) { $left_content_class = 'hidden-xs'; }

		if ( $options['right-content'] == '1' ) {
			$right_content = mixt_social_profiles(false, array( 'style' => 'group', 'profiles' => $profiles, 'color' => 'minimal' ));
		} else if ( $options['right-content'] == '2' ) {
			$right_content = '<div class="content-code">' . str_replace('{{year}}', date('Y'), $options['right-code']) . '</div>';
		}
		if ( $options['right-hide'] ) { $right_content_class = 'hidden-xs'; }

		if ( ! empty($left_content) || ! empty($right_content) ) {
			?>
			<div class="footer-row copyright-row site-copyright theme-section-main">
				<div class="container">
					<div class="inner">
						<?php if ( ! empty($left_content) ) { ?>
						<div class="left-content <?php echo $left_content_class; ?>">
							<?php echo $left_content; ?>
						</div>
						<?php } if ( ! empty($right_content) ) { ?>
						<div class="right-content <?php echo $right_content_class; ?>">
							<?php echo $right_content; ?>
						</div>
						<?php } ?>
					</div>
					<?php do_action('mixt_credits'); ?>
				</div>
			</div>
			<?php
		} else {
			do_action('mixt_credits');
		}

		// Info Bar

		if ( $options['info-bar'] && ! empty($options['info-bar-content']) ) {
			$info_class = 'info-bar theme-section-alt';
			if ( $options['info-bar-fixed'] ) { $info_class .= ' sticky'; }
			if ( $options['info-bar-hide'] ) { $info_class .= ' hidden-xs'; }

			?>
			<div id="info-bar-wrap">
				<div class="<?php echo $info_class; ?>">
					<div class="container"><?php echo $options['info-bar-content']; ?></div>
				</div>
			</div>
			<?php
		}

		?>
	</footer><?php // close #colophon ?>

</div><?php // close #main-wrap

do_action('mixt_body_code');

wp_footer();

?>
</body>
</html>
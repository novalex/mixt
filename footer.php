<?php

/**
 * The template for displaying the footer
 *
 * @package MIXT
 */

$options = mixt_get_options( array(
	'back-to-top'      => array(),
	'back-to-top-icon' => array( 'return' => 'value' ),
	'left-content'     => array( 'type' => 'str', 'key' => 'footer-left-content', 'return' => 'value' ),
	'left-code'        => array( 'key' => 'footer-left-code', 'return' => 'value' ),
	'left-hide'        => array( 'key' => 'footer-left-hide' ),
	'right-content'    => array( 'type' => 'str', 'key' => 'footer-right-content', 'return' => 'value' ),
	'right-code'       => array( 'key' => 'footer-right-code', 'return' => 'value' ),
	'right-hide'       => array( 'key' => 'footer-right-hide' ),
	'social-profiles'  => array( 'key' => 'footer-social-profiles', 'return' => 'value' ),
) );

?>
				</div><?php // close #content or .sidebar, if sidebar is active ?>

			</div><?php // close .row ?>

		</div><?php // close #content-wrap ?>

		<?php

		// Back To Top Button
		if ( $options['back-to-top'] ) {
			echo '<a href="#" id="back-to-top" class="btn btn-accent btn-lg">';
				echo '<i class="' . $options['back-to-top-icon'] . '"></i>';
			echo '</a>';
		}

		?>

	</div><?php // close #main-wrap-inner ?>

	<?php

		$theme = Mixt_Options::get('themes', 'footer');

		$class = "theme-$theme";

	?>

	<footer id="colophon" class="<?php echo $class; ?>">
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
			$column_class = 'col-sm-' . 12 / $sidebars;
			?>
			<div class="footer-row widget-row theme-section-alt">
				<div class="container">
					<div id="footer-widgets" class="row">
						<?php foreach ( $active_sidebars as $sidebar ) { ?>
							<div class="widget-area <?php echo $column_class; ?>" role="complementary">
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

		if ( ! empty($left_content) || ! empty($right_content) ) { ?>
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
		<?php } else { do_action('mixt_credits'); } ?>
		
	</footer><?php // close #colophon ?>

</div><?php // close #main-wrap

do_action('mixt_body_css');

wp_footer();

?>
</body>
</html>
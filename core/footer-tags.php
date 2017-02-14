<?php

/**
 * Footer Elements
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Display the footer widget area
 */
function mixt_footer_widget_area() {
	$options = mixt_get_options( array(
		'widgets-show'     => array( 'key' => 'footer-widgets-show' ),
		'widgets-hide'     => array( 'key' => 'footer-widgets-hide' ),
	) );

	if ( (bool) $options['widgets-show'] ) {
		$sidebars = 0;
		$active_sidebars = array();
		foreach ( array( 'footer-1', 'footer-2', 'footer-3', 'footer-4', 'footer-5', 'footer-6' ) as $sidebar_id ) {
			if ( is_active_sidebar($sidebar_id) ) {
				$sidebars++;
				$active_sidebars[] = $sidebar_id;
			}
		}
		if ( $sidebars > 0 ) {
			$widgets_class = 'footer-row widget-row theme-section-main';
			if ( $options['widgets-hide'] ) { $widgets_class .= ' hidden-xs'; }

			$current_col = 1;

			switch ( $sidebars ) {
				case 1:
					$widget_col_class = 'widget-area col-sm-12';
					break;
				case 2:
					$widget_col_class = 'widget-area col-sm-6';
					break;
				case 3:
					$widget_col_class = 'widget-area col-sm-4';
					break;
				case 4:
					$widget_col_class = 'widget-area col-lg-3 col-md-6 col-sm-6';
					break;
				case 5:
					$widget_col_class = 'widget-area col-lg-2 col-md-4 col-sm-6';
					break;
				case 6:
					$widget_col_class = 'widget-area col-lg-2 col-md-4 col-sm-6';
					break;
			}
			
			?>
			<div class="<?php echo mixt_sanitize_html_classes($widgets_class); ?>">
				<div class="container">
					<div id="footer-widgets" class="row">
						<?php
							foreach ( $active_sidebars as $sidebar ) {
								if ( $sidebars == 5 && $current_col == 5 ) $widget_col_class = 'widget-area col-lg-4 col-md-8 col-sm-12';
								echo '<div class="' . mixt_sanitize_html_classes($widget_col_class) . '" role="complementary">';
									dynamic_sidebar($sidebar);
								echo '</div>';
								$current_col++;
							}
						?>
					</div>
				</div>
			</div>
			<?php
		}
	}
}


/**
 * Display the footer copyright area
 */
function mixt_footer_copyright_area() {
	$options = mixt_get_options( array(
		'copy-show'        => array( 'key' => 'footer-copy-show', 'default' => true ),
		'left-content'     => array( 'key' => 'footer-left-content', 'type' => 'str', 'return' => 'value', 'default' => '2' ),
		'left-code'        => array( 'key' => 'footer-left-code', 'return' => 'value', 'default' => 'MIXT Theme by <a href="http://themeforest.net/user/novalex/">novalex</a>' ),
		'left-hide'        => array( 'key' => 'footer-left-hide' ),
		'right-content'    => array( 'key' => 'footer-right-content', 'type' => 'str', 'return' => 'value' ),
		'right-code'       => array( 'key' => 'footer-right-code', 'return' => 'value' ),
		'right-hide'       => array( 'key' => 'footer-right-hide' ),
		'social-profiles'  => array( 'key' => 'footer-social-profiles', 'return' => 'value' ),
	) );

	if ( (bool) $options['copy-show'] ) {
		$left_content = $left_content_class = $right_content = $right_content_class = '';

		if ( $options['left-content'] == '1' || $options['right-content'] == '1' ) {
			$profiles = array();
			$set_profiles = get_option('mixt-social-profiles', mixt_preset_social_profiles('networks'));
			foreach ( $set_profiles as $key => $profile ) {
				if ( ! empty($options['social-profiles'][$key]) ) $profiles[$key] = $profile;
			}
		}

		if ( $options['left-content'] == '1' ) {
			$left_content = mixt_social_profiles(false, array( 'hover' => 'icon', 'profiles' => $profiles ));
		} else if ( $options['left-content'] == '2' ) {
			$left_content = '<div class="content-code">' . str_replace( '{{year}}', date('Y'), $options['left-code'] ) . '</div>';
		}
		if ( $options['left-hide'] ) { $left_content_class = 'hidden-xs'; }

		if ( $options['right-content'] == '1' ) {
			$right_content = mixt_social_profiles(false, array( 'hover' => 'icon', 'profiles' => $profiles ));
		} else if ( $options['right-content'] == '2' ) {
			$right_content = '<div class="content-code">' . str_replace( '{{year}}', date('Y'), $options['right-code'] ) . '</div>';
		}
		if ( $options['right-hide'] ) { $right_content_class = 'hidden-xs'; }

		if ( ! empty($left_content) || ! empty($right_content) ) {
			?>
			<div class="footer-row copyright-row site-copyright theme-section-alt">
				<div class="container">
					<div class="inner">
						<?php if ( ! empty($left_content) ) { ?>
						<div class="left-content <?php echo mixt_sanitize_html_classes($left_content_class); ?>">
							<?php echo mixt_clean($left_content, 'strip'); ?>
						</div>
						<?php } if ( ! empty($right_content) ) { ?>
						<div class="right-content <?php echo mixt_sanitize_html_classes($right_content_class); ?>">
							<?php echo mixt_clean($right_content, 'strip'); ?>
						</div>
						<?php } ?>
					</div>
					<?php do_action('mixt_credits'); ?>
				</div>
			</div>
			<?php
		}
	} else {
		do_action('mixt_credits');
	}
}


/**
 * Display the footer info bar
 */
function mixt_footer_infobar() {
	$options = mixt_get_options( array(
		'info-bar'         => array(),
		'info-bar-content' => array( 'type' => 'str', 'return' => 'value' ),
		'info-bar-fixed'   => array(),
		'info-bar-hide'    => array(),
	) );

	if ( (bool) $options['info-bar'] && ! empty($options['info-bar-content']) && ! isset($_COOKIE['mixt_info_bar_close']) ) {
		$info_class = 'info-bar theme-section-alt';
		if ( $options['info-bar-fixed'] ) { $info_class .= ' sticky'; }
		if ( $options['info-bar-hide'] ) { $info_class .= ' hidden-xs'; }

		?>
		<div id="info-bar-wrap">
			<div class="<?php echo mixt_sanitize_html_classes($info_class); ?>">
				<div class="container"><?php echo mixt_clean($options['info-bar-content'], 'strip'); ?></div>
			</div>
		</div>
		<?php
	}
}

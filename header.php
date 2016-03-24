<?php

/**
 * Header Template
 *
 * @package MIXT
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="mixt">
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
	<?php

	wp_head();
	
	?>
</head>

<body <?php body_class(); ?>>
	<?php

	do_action('mixt_before_wrap');

	// Main Wrap Classes
	$wrap_classes = apply_filters('mixt_wrap_class', array());

	?>

	<div id="main-wrap" class="<?php echo mixt_sanitize_html_classes($wrap_classes); ?>">

		<?php

		do_action('mixt_before_wrap_inner');

		// Wrap Inner Classes
		$wrap_inner_classes = apply_filters('mixt_wrap_inner_class', array());

		?>

		<div id="main-wrap-inner" class="<?php echo mixt_sanitize_html_classes($wrap_inner_classes); ?>">

			<?php

			// Do not output header if a blank page is being shown
			if ( Mixt_Options::get('page', 'type') == 'blank' ) return;

			do_action('mixt_before_nav_wrap');

			// Nav Wrap Classes
			$nav_wrap_classes = apply_filters('mixt_nav_wrap_class', array());

			// Navbar Classes
			$nav_classes = apply_filters('mixt_nav_class', array());

			?>

			<div id="main-nav-wrap" role="banner" class="<?php echo mixt_sanitize_html_classes($nav_wrap_classes); ?>" data-logo-align="<?php echo esc_attr(Mixt_Options::get('nav', 'logo-align')); ?>">

				<nav id="main-nav" class="navbar navbar-mixt site-navigation position-top <?php echo mixt_sanitize_html_classes($nav_classes); ?>">
					<div class="container">

						<?php // Main Navbar Header ?>
						<div class="navbar-header">
							<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-menu-wrap" aria-expanded="false">
								<span class="sr-only"><?php esc_html_e('Toggle navigation', 'mixt'); ?></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							</button>
							<?php
								$logo_url = apply_filters('mixt_logo_url', home_url('/'));
								$logo_title = apply_filters('mixt_logo_title', get_bloginfo('name', 'display'));
							?>
							<a id="nav-logo" class="navbar-brand text-cont" href="<?php echo esc_url($logo_url); ?>" title="<?php echo esc_attr($logo_title); ?>" rel="home">
								<?php mixt_display_logo(); ?>
							</a>
						</div>

						<?php // Main Navbar Menu

						// Nav Menu Classes
						$nav_menu_classes = apply_filters('mixt_nav_menu_class', array());

						$main_nav_args = array(
							'container_id'    => 'main-menu-wrap',
							'container_class' => 'navbar-inner collapse navbar-collapse navbar-responsive-collapse',
							'menu_class'      => mixt_sanitize_html_classes($nav_menu_classes),
							'fallback_cb'     => '__return_false',
							'echo'            => false,
							'menu_id'         => 'main-menu',
							'walker'          => new Mixt_Navwalker(),
						);

						$nav_menu_id = Mixt_Options::get('nav', 'menu');
						if ( $nav_menu_id == 'auto' ) {
							$main_nav_args['theme_location'] = 'primary';
						} else {
							$main_nav_args['menu'] = intval($nav_menu_id);
						}

						$main_nav_menu = wp_nav_menu($main_nav_args);

						// Check if a menu is assigned and display a message if not
						if ( ! empty($main_nav_menu) ) {
							echo mixt_clean($main_nav_menu, 'strip');
						} else {
							mixt_no_menu_msg(true, true);
						}

						?>
					</div>
					<?php // Store data like the background luminosity and active media query for use in JS ?>
					<div class="navbar-data"></div>

				</nav><?php // Close #main-nav ?>

			</div><?php // Close #main-nav-wrap

			do_action('mixt_before_content_wrap');

			// Content Wrap Classes
			$content_wrap_classes = apply_filters('mixt_content_wrap_class', array());

			?>

			<div id="content-wrap" class="<?php echo mixt_sanitize_html_classes($content_wrap_classes); ?>">
				<div class="row">
					<?php

					// Content Classes
					$content_classes = apply_filters('mixt_content_class', array());

					?>
					<div id="content" class="<?php echo mixt_sanitize_html_classes($content_classes); ?>">

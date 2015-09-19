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
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

	<?php

	// Display Favicons
	if ( function_exists('mixt_favicons') ) {
		mixt_favicons();
	}

	wp_head();

	// Print Header CSS
	do_action('mixt_head_css');

	?>
</head>

<?php

// Get Options
$nav_options    = Mixt_Options::get('nav');
$page_options   = Mixt_Options::get('page');
$header_options = Mixt_Options::get('header');
$theme_options  = Mixt_Options::get('themes');
$layout_options = Mixt_Options::get('layout');

$body_classes = "theme-{$theme_options['site']}";
if ( $page_options['layout'] == 'boxed' ) $body_classes .= ' boxed';
if ( $page_options['page-type'] == 'onepage' ) $body_classes .= ' one-page';

?>

<body <?php body_class($body_classes); ?>>
	<?php

	do_action( 'before' );

	// Show Page Loader
	if ( $page_options['page-loader'] ) { mixt_page_loader(); }

	// Main Wrapper Classes
	$wrapper_classes = '';
	if ( $page_options['fullwidth'] ) $wrapper_classes .= 'fullwidth ';
	if ( $nav_options['layout'] == 'vertical' ) $wrapper_classes .= 'nav-vertical nav-left ';

	// Header Media Wrapper Classes
	if ( $header_options['enabled'] ) {
		$wrapper_classes .= ' has-head-media';
		if ( $header_options['fullscreen'] ) $wrapper_classes .= ' fullscreen';
		if ( $nav_options['transparent'] ) $wrapper_classes .= ' nav-transparent';
		if ( $nav_options['position'] == 'below' ) $wrapper_classes .= ' nav-below';
	}
	?>

<div id="main-wrap" class="<?php echo $wrapper_classes; ?>">

	<?php

	// Do not output header if a blank page is being shown
	if ( $page_options['page-type'] == 'blank' ) return;

	// Show Secondary Navbar
	if ( $nav_options['second-nav'] ) {
		mixt_second_nav();
	}

	// Show Header Media (Above Navbar)
	if ( $header_options['enabled'] && $nav_options['position'] == 'below' ) {
		mixt_head_media();
	}

	$nav_wrap_classes = $nav_options['logo-align'];

	$nav_classes = ( $theme_options['nav'] != 'auto' ) ? " theme-{$theme_options['nav']}" : " theme-{$theme_options['site']}";

	if ( $nav_options['layout'] == 'vertical' ) {
		$nav_wrap_classes .= ' nav-vertical';
		$nav_classes .= ' vertical';
	} else {
		if ( $nav_options['mode'] == 'fixed' ) $nav_classes .= ' sticky';
	}
	if ( $nav_options['bordered'] ) $nav_classes .= ' bordered';
	if ( ! $nav_options['hover-bg'] ) $nav_classes .= ' no-hover-bg';
	?>

	<div id="main-nav-wrap" class="<?php echo $nav_wrap_classes; ?>" data-logo-align="<?php echo $nav_options['logo-align'] ?>">

		<nav id="main-nav" class="navbar navbar-mixt site-navigation <?php echo $nav_classes; ?>" role="banner">
			<div class="container">

				<?php // Main Navbar Header ?>
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>

					<a id="nav-logo" class="navbar-brand text-cont" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
						<?php mixt_display_logo(); ?>
					</a>
				</div>

				<?php // Main Navbar Menu

				$nav_menu_classes = 'nav navbar-nav';
				if ( $nav_options['active-bar'] ) { $nav_menu_classes .= ' active-' . $nav_options['active-bar-pos']; }
				else { $nav_menu_classes .= ' no-active'; }

				$main_nav_loc = 'primary';
				if ( $page_options['page-type'] == 'onepage' ) $main_nav_loc = 'onepage';

				$main_nav_menu = wp_nav_menu(
					array(
						'theme_location'  => $main_nav_loc,
						'container_class' => 'navbar-inner collapse navbar-collapse navbar-responsive-collapse',
						'menu_class'      => $nav_menu_classes,
						'fallback_cb'     => '__return_false',
						'echo'            => false,
						'menu_id'         => 'main-menu',
						'walker'          => new Mixt_Navwalker()
					)
				);

				// Check if a menu is assigned and display a message if not
				if ( ! empty($main_nav_menu) ) { echo $main_nav_menu; }
				else { mixt_no_menu_msg(true, true); } ?>

			</div>
		</nav><?php // Close #main-nav ?>

		<div id="navbar-check"></div>
	</div><?php // Close #main-nav-wrap

	// Show Header Media (Below Navbar)
	if ( $header_options['enabled'] && $nav_options['position'] == 'above' ) {
		mixt_head_media();
	}

	// Show Location Bar
	if ( ( ! $header_options['enabled'] || ! $header_options['content-info'] ) && $page_options['location-bar'] ) {
		mixt_location_bar();
	}

	// Start Content Wrapper
	$content_classes = 'main-content container';
	if ( $page_options['sidebar'] && $page_options['page-type'] != 'onepage' ) {
		$content_classes .= ' has-sidebar';
		if ( $page_options['sidebar-position'] == 'left' ) { $content_classes .= ' sidebar-left'; }
	}

	?>

	<div id="content-wrap" class="<?php echo $content_classes; ?>">
		<div class="row">
			<?php
			$cont_classes = 'main-content-inner';
			
			if ( $page_options['posts-page'] ) {
				$cont_classes .= ' blog-' . $layout_options['type'];
				if ( $layout_options['type'] != 'standard' ) { $cont_classes .= ' blog-' . $layout_options['columns'] . '-col'; }
			}
			?>
			<div id="content" class="<?php echo $cont_classes; ?>">

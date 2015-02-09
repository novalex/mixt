<?php

/**
 * MIXT Header
 *
 * @package mixt
 */

?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php

	// Display favicons
	mixt_favicon_display();

	wp_head();

	// Print custom CSS
	mixt_print_css();

	?>
</head>

<body <?php body_class('no-js'); ?>>

	<script type="text/javascript" id="mixt-test-js">
		document.body.className = document.body.className.replace('no-js','js');
	</script>

	<?php

	global $mixt_opt;

	do_action( 'before' );

	$page_options   = mixt_get_options('page');
	$navbar_options = mixt_get_options('navbar');
	$header_options = mixt_get_options('header');


	// print_r($page_options  );
	// print_r($navbar_options);
	// print_r($header_options);

	// Page Loader
	if ( $page_options['page-loader'] ) { mixt_page_loader(); }

	$wrapper_classes = $page_options['fullwidth'] . $header_options['head-full-height'];

	if ( $header_options['head-media'] ) {
		$wrapper_classes .= 'has-head-media ' . $navbar_options['nav-transparent'] . $navbar_options['nav-position']['class'];
	}

	$navbar_wrap_classes = $navbar_options['logo-align'];

	$navbar_classes = 'position-top navbar-default ' . $navbar_options['nav-mode'] . $navbar_options['nav-theme'] . $navbar_options['sub-scheme'];

	get_template_part( 'inc/mixt', 'header' );

	?>

<div id="main-wrap" class="<?php echo $wrapper_classes; ?>">

	<?php

	// TOP NAVIGATION AREA 

	if ( $mixt_opt['second-nav'] ) {
		mixt_nav_second();
	}

	if ( $header_options['head-media'] && $navbar_options['nav-position']['value'] == 'below' ) {
		mixt_head_media();
	}

	?>

	<div id="top-nav-wrap" class="<?php echo $navbar_wrap_classes; ?>">

		<nav id="top-nav" class="site-navigation navbar-mixt <?php echo $navbar_classes; ?>" role="banner">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
						<span class="sr-only">Toggle navigation</span>
					  <span class="icon-bar"></span>
					  <span class="icon-bar"></span>
					  <span class="icon-bar"></span>
					</button>

					<a id="nav-logo" class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
						<?php mixt_display_logo(); ?>
					</a>
				</div>

				<?php

					// Top Nav Location

					$top_nav_menu = wp_nav_menu(
						array(
							'theme_location'  => 'primary',
							'container_class' => 'navbar-inner collapse navbar-collapse navbar-responsive-collapse',
							'menu_class'      => 'nav navbar-nav',
							'fallback_cb'     => '__return_false',
							'echo'            => false,
							'menu_id'         => 'main-menu',
							'walker'          => new mixt_navwalker()
						)
					);

					// Check if a menu is assigned and display a message if not

					if ( !empty($top_nav_menu) ) {
						echo $top_nav_menu;
					} else {
						mixt_no_menu_msg(true, true);
					}
				?>

			</div>
		</nav>

		<div id="navbar-check"></div>

	</div>

	<?php // END TOP NAVIGATION AREA ?>


	<?php // HEADER MEDIA

	if ( $header_options['head-media'] && $navbar_options['nav-position']['value'] != 'below' ) {
		mixt_head_media();
	}

	// LOCATION BAR

	if ( ! is_front_page() ) : ?>

	<div id="loc-head">
		<div class="container">
			<div class="inner">
				<?php
					$wp_title = wp_title('_', false, 'right');
					$display_title = explode(' _ ', $wp_title);
					$page_title = $display_title[0];
				?>
				<h1 class="page-title">
					<?php
						if ( is_search() ) {
							printf( __('Search Results for: ', 'mixt') );
						}
						echo $page_title;
					?>
				</h1>
				<?php
				    if ( class_exists('Woocommerce') && ( is_woocommerce() || is_cart() || is_checkout() ) ) {
				        woocommerce_breadcrumb();
				    } else {
				        mixt_breadcrumbs($page_title);
				    }
				?>
			</div>
		</div>
	</div>

	<?php endif; ?>

	<div id="content-wrap" class="main-content">
		<div class="container">
			<div class="row">
				<?php
					$cont_width = ( $page_options['sidebar'] ? 'col-md-9' : 'col-md-12');
				?>
				<div id="content" class="main-content-inner col-sm-12 <?php echo $cont_width; ?>">
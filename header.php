<?php

/**
 * Header Template
 *
 * @package MIXT
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
	if ( function_exists('mixt_favicons') ) {
		mixt_favicons();
	}

	wp_head();

	// Print custom CSS
	if ( function_exists('mixt_print_css') ) {
		mixt_print_css();
	}

	?>
</head>

<body <?php body_class('no-js'); ?>>

	<script type="text/javascript" id="mixt-test-js">
		document.body.className = document.body.className.replace('no-js','js');
	</script>

	<?php

	do_action( 'before' );

	// Get Options Object
	global $mixt_opt;

	// Get Page Options
	$page_options = array(
		'page-loader' => array(),
		'sidebar' => array(
			'key' => 'page-sidebar',
		),
		'sidebar-position' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => 'right',
		),
		'fullwidth' => array(
			'key'    => 'page-fullwidth',
			'return' => array(
				'true'  => 'fullwidth ',
			),
		),
		'site-theme' => array(
			'type'    => 'str',
			'return'  => 'value',
			'prefix'  => 'theme-',
			'suffix'  => ' ',
			'default' => 'aqua',
		),
		'location-bar' => array(),

		// Blog
		'blog-type' => array(
			'return'  => 'value',
			'default' => 'standard',
		),
		'blog-columns' => array(
			'return'  => 'value',
			'default' => '2-col',
		),
	);
	$page_options = mixt_get_options($page_options);

	// Get Header Options
	$header_options = array(
		'head-media' => array(),
		'head-fullscreen' => array(
			'return' => array(
				'true' => 'fullscreen ',
			),
		),
		'head-content-info' => array(),
	);
	$header_options = mixt_get_options($header_options);

	// Get Navbar Options
	$navbar_options = array(
		'nav-mode' => array(
			'return' => array(
				'fixed'  => 'sticky ',
			),
		),
		'nav-theme' => array(
			'type'    => 'str',
			'return'  => 'value',
			'prefix'  => 'theme-',
			'suffix'  => ' ',
			'default' => 'aqua',
		),
		'logo-align' => array(
			'return' => array(
				'1' => 'logo-left',
				'2' => 'logo-center',
				'3' => 'logo-right',
				'default' => 'logo-left',
			),
		),
		'nav-transparent' => array(
			'return' => array(
				'true' => 'nav-transparent ',
			),
		),
		'nav-hover-bg' => array(
			'return' => array(
				'false' => 'no-hover-bg ',
			),
		),
		'nav-active-bar' => array(
			'return' => array(
				'false' => 'no-active ',
			),
		),
		'nav-active-bar-pos' => array(
			'return' => 'value',
			'prefix' => 'active-',
			'suffix' => ' ',
		),
		'nav-bordered' => array(
			'return' => array(
				'true' => 'bordered ',
			),
		),
		'nav-position' => array(
			'return' => array(
				'below' => array(
					'value' => 'below',
					'class' => 'nav-below-header ',
				),
				'default' => array(
					'value' => 'above',
					'class' => '',
				),
			),
		),
	);
	$navbar_options = mixt_get_options($navbar_options);

	// Show Page Loader
	if ( $page_options['page-loader'] == 'true' ) { mixt_page_loader(); }

	// Main Wrapper Classes
	$wrapper_classes = $page_options['site-theme'] . $page_options['fullwidth'];

	// Header Media Wrapper Classes
	if ( $header_options['head-media'] == 'true' ) {
		$wrapper_classes .= 'has-head-media ' . $header_options['head-fullscreen'] . $navbar_options['nav-transparent'] . $navbar_options['nav-position']['class'];
	}

	?>

<div id="main-wrap" class="<?php echo $wrapper_classes; ?>">

	<?php

	// Show Secondary Navbar
	if ( $mixt_opt['second-nav'] ) {
		mixt_second_nav();
	}

	// Show Header Media (Above Navbar)
	if ( $header_options['head-media'] == 'true' && $navbar_options['nav-position']['value'] == 'below' ) {
		mixt_head_media();
	}

	$navbar_wrap_classes = $navbar_options['logo-align'] . ' ';

	$navbar_classes = $navbar_options['nav-mode'] . $navbar_options['nav-bordered'] . $navbar_options['nav-theme'] . $navbar_options['nav-hover-bg'];

	?>

	<div id="top-nav-wrap" class="<?php echo $navbar_wrap_classes; ?>" data-logo-align="<?php echo $navbar_options['logo-align'] ?>">

		<nav id="top-nav" class="navbar navbar-mixt site-navigation <?php echo $navbar_classes; ?>" role="banner">
			<div class="container">

				<?php // Top Navbar Header ?>
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

				<?php // Top Navbar Menu

				$nav_menu_classes = 'nav navbar-nav ' . $navbar_options['nav-active-bar'] . $navbar_options['nav-active-bar-pos'];
				$top_nav_menu = wp_nav_menu(
					array(
						'theme_location'  => 'primary',
						'container_class' => 'navbar-inner collapse navbar-collapse navbar-responsive-collapse',
						'menu_class'      => $nav_menu_classes,
						'fallback_cb'     => '__return_false',
						'echo'            => false,
						'menu_id'         => 'main-menu',
						'walker'          => new mixt_navwalker()
					)
				);

				// Check if a menu is assigned and display a message if not
				if ( ! empty($top_nav_menu) ) { echo $top_nav_menu; }
				else { mixt_no_menu_msg(true, true); } ?>

			</div>
		</nav><?php // Close #top-nav ?>

		<div id="navbar-check"></div>
	</div><?php // Close #top-nav-wrap

	// Show Header Media (Below Navbar)
	if ( $header_options['head-media'] == 'true' && $navbar_options['nav-position']['value'] != 'below' ) {
		mixt_head_media();
	}

	// Show Location Bar
	if ( ( $header_options['head-media'] != 'true' || $header_options['head-content-info'] != 'true' ) && $page_options['location-bar'] == 'true' ) {
		mixt_location_bar();
	}

	// Start Content Wrapper

	$content_classes = 'main-content container ';

	if ( $page_options['sidebar'] != 'false' ) {
		$content_classes .= 'has-sidebar ';

		if ( $page_options['sidebar-position'] == 'left' ) { $content_classes .= 'sidebar-left '; }
	}

	?>

	<div id="content-wrap" class="<?php echo $content_classes; ?>">
		<div class="row">

			<?php

			/**
			 * TODO: Check for type of page displayed and fetch specific settings if page is archive, tag, category...
			 */

			$cont_classes = 'main-content-inner ';
			
			if ( ! is_front_page() && is_home() ) {
				$cont_classes .= 'blog-' . $page_options['blog-type'] . ' ';
				if ( $page_options['blog-type'] != 'standard' ) { $cont_classes .= 'blog-' . $page_options['blog-columns'] . '-col '; }
			}

			?>
			
			<div id="content" class="<?php echo $cont_classes; ?>">
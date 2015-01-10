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
	<title><?php wp_title( '-', true, 'right'); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<link rel="shortcut icon" href="<?php echo get_site_url(); ?>/wp-content/themes/mixt/favicon.ico?v=2" />

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php
		do_action( 'before' );

		global $mixt_opt;

		$page_ID = get_queried_object_id();

		if ($mixt_opt['page-loader'] != 0) {
			echo '<div id="load-ov"><div class="signal"></div></div>';
			?>
			<script type="text/javascript" id="mixt_load_class">document.getElementsByTagName('html')[0].className += ' loading';</script>
			<?php
		}

		$has_sidebar = mixt_meta('mixt_page_sidebar');

		// Header & global page settings
		$navbar_theme = '';
		$fullwidth_class = (mixt_meta('mixt_page_fullwidth') == 'true' ? 'fullwidth' : '');
		$navbar_tsp = (mixt_meta('mixt_nav_tsp') == 'true' ? 'nav-transparent' : '');
		$head_media = mixt_meta('mixt_head_media');

		// Main wrapper classes
		$wrap_classes = '';
		if (strlen($fullwidth_class) > 3) $wrap_classes .= $fullwidth_class . ' ';
		if ($head_media == 'true') $wrap_classes .= 'has-head-media ';
		if (strlen($navbar_theme) > 3) $wrap_classes .= $navbar_theme . ' ';
		if (strlen($navbar_tsp) > 3) $wrap_classes .= $navbar_tsp . ' ';

		// Logo alignment
		$logo_align_opt = $mixt_opt['logo-align'];
		if ($logo_align_opt == 2) { $logo_align = 'logo-center'; }
		elseif ($logo_align_opt == 3) { $logo_align = 'logo-right'; }
		else { $logo_align = 'logo-left'; }

		// Navbar wrap classes
		$navbar_wrap_classes = $logo_align . ' ' . $navbar_theme;

		// Navbar settings
		$navbar_sticky = false;
		$navbar_sticky_global = $mixt_opt['nav-sticky'];
		$navbar_sticky_page = mixt_meta('mixt_nav_sticky');
		if ($navbar_sticky_page == 'true' || $navbar_sticky_page != 'false' && $navbar_sticky_global != 0) {
			$navbar_sticky = true;
		}
		$navbar_scheme_global = $mixt_opt['nav-scheme'];
		$navbar_scheme_page = mixt_meta('mixt_nav_scheme');
		$navbar_scheme = 'navbar-default';
		if ($navbar_scheme_page == 'dark' || $navbar_scheme_page != 'light' && $navbar_scheme_global == 0) {
			$navbar_scheme = 'navbar-inverse';
		}
		$navbar_sub_scheme = false;
		$navbar_sub_scheme_global = $mixt_opt['nav-sub-scheme'];
		$navbar_sub_scheme_page = mixt_meta('mixt_nav_sub_scheme');
		if ($navbar_sub_scheme_page == 'dark' || $navbar_sub_scheme_page != 'light' && $navbar_sub_scheme_global == 0) {
			$navbar_sub_scheme = true;
		}

		// Navbar classes
		$navbar_classes = '';
		$navbar_classes .= $navbar_scheme;
		if ($navbar_sub_scheme) $navbar_classes .= ' submenu-inverse';
		if ($navbar_sticky) $navbar_classes .= ' sticky';

		get_template_part( 'inc/mixt', 'header' );
	?>

<div id="main-wrap" class="<?php echo $wrap_classes; ?>">

	<?php if (1 > 2) : ?>
	<header id="masthead" class="site-header" role="banner">
		<div class="container">
			<div class="row">
				<div class="site-header-inner col-sm-12">

					<?php $header_image = get_header_image();
					if ( ! empty( $header_image ) ) { ?>
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
							<img src="<?php header_image(); ?>" width="<?php echo get_custom_header()->width; ?>" height="<?php echo get_custom_header()->height; ?>" alt="">
						</a>
					<?php } // end if ( ! empty( $header_image ) ) ?>


					<div class="site-branding">
						<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
						<h4 class="site-description"><?php bloginfo( 'description' ); ?></h4>
					</div>

				</div>
			</div>
		</div>
	</header>
	<?php endif; ?>

	<?php // TOP NAVIGATION AREA ?>

	<?php if ($mixt_opt['second-nav']) { mixt_nav_second(); } ?>

	<div id="top-nav-wrap" class="<?php echo $navbar_wrap_classes; ?>">

		<nav id="top-nav" class="site-navigation navbar navbar-mixt <?php echo $navbar_classes; ?>" role="banner">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
						<span class="sr-only">Toggle navigation</span>
					  <span class="icon-bar"></span>
					  <span class="icon-bar"></span>
					  <span class="icon-bar"></span>
					</button>

					<a id="nav-logo" class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"></a>
				</div>

				<?php
					wp_nav_menu(
						array(
							'theme_location' => 'primary',
							'container_class' => 'navbar-inner collapse navbar-collapse navbar-responsive-collapse',
							'menu_class' => 'nav navbar-nav',
							'fallback_cb' => '',
							'menu_id' => 'main-menu',
							'walker' => new mixt_navwalker()
						)
					);
				?>

			</div>
		</nav>

		<div id="navbar-check"></div>

	</div>

	<?php // END TOP NAVIGATION AREA ?>


	<?php // HEADER MEDIA

	if ($head_media == 'true') :

		mixt_head_media($page_ID);

	/*

		$head_media_type = mixt_meta('mixt_head_media_type');
		$head_image      = mixt_meta('mixt_head_image');
		$head_slider     = mixt_meta('mixt_head_slider');
		$head_code       = mixt_meta('mixt_head_code');

		$hm_classes      = 'head-media media-image';

		$media_img = $media_slider = $media_html = '';

		if ($head_media_type == 'feat') {
			$img_url = wp_get_attachment_url( get_post_thumbnail_id($page_ID) );

			$page_head_classes = '';
			if (mixt_meta('mixt_head_img_repeat') == 'true') $page_head_classes .= 'pattern ';

			$media_img = sprintf('<div class="media-container %1$s" style="background-image: url(%2$s);" data-imgsrc="%2$s"></div>',
				$page_head_classes,
				$img_url
			);
		}

		?>
		<div class="<?php echo $hm_classes; ?>">

			<?php
			echo $media_img;
			if ($head_media_type == 'slider') {
				$head_slider_id = mixt_meta('mixt_head_slider');
				echo do_shortcode("[layerslider id=$head_slider_id]");
			} else if ($head_code) {
				printf('<div class="media-inner"><div class="container">%s</div></div>', $head_code);
			}
			?>

		</div>
		<?php

	*/

	endif;

	// END HEADER MEDIA


	// LOCATION BAR

	if (!is_front_page()) : ?>

	<div id="loc-head">
		<div class="container">
			<div class="inner">
			<?php
				$wp_title = wp_title('_', false, 'right');
				$display_title = explode(' _ ', $wp_title);
				$page_title = $display_title[0];
			?>
			<h1 class="page-title"><?php echo $page_title; ?></h1>
			<?php
			    if (class_exists('Woocommerce') && ( is_woocommerce() || is_cart() || is_checkout() ) ) {
			        woocommerce_breadcrumb();
			    } else {
			        the_breadcrumb($page_title);
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
					$cont_width = ($has_sidebar != 'false' ? 'col-md-9' : 'col-md-12');
				?>
				<div id="content" class="main-content-inner col-sm-12 <?php echo $cont_width; ?>">
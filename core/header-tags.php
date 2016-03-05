<?php

/**
 * Header Elements
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Display the Page Loader
 */
function mixt_page_loader() {
	$options = mixt_get_options( array(
		'type' => array(
			'key'    => 'page-loader-type',
			'type'   => 'str',
			'return' => 'value',
		),
		'anim' => array(
			'key'     => 'page-loader-anim',
			'return'  => 'value',
			'default' => 'pulsate',
		),
		'shape' => array(
			'key'     => 'page-loader-shape',
			'return'  => 'value',
			'default' => 'ring',
		),
		'img' => array(
			'key'     => 'page-loader-img',
			'return'  => 'value',
		),
	) );

	$load_classes  = 'loader ';

	// Loader Animation
	if ( $options['anim'] != 'none' ) $load_classes .= 'animated infinite ' . sanitize_html_class($options['anim']) . ' ';

	// Loader Shape
	if ( $options['type'] == '1' ) {
		$load_elem = '<div class="' . $load_classes . sanitize_html_class($options['shape']) . '"></div>';
	// Loader Image
	} else if ( is_array($options['img']) && ! empty($options['img']['url']) ) {
		$load_elem = '<img src="' . esc_attr($options['img']['url']) . '" alt="' . esc_attr__( 'Loading...', 'mixt' ) . '" class="' . $load_classes . '">';
	// Default Loader
	} else {
		$load_elem = '<div class="ring ' . $load_classes . '"></div>';
	}

	// Output
	?>
	<div id="load-overlay">
		<div class="load-inner">
			<?php echo $load_elem; ?>
		</div>
	</div>
	<?php
}


/**
 * Display the site logo
 */
function mixt_display_logo() {
	$options = mixt_get_options( array(
		// Image or Text Logo
		'type' => array(
			'key'     => 'logo-type',
			'return'  => 'value',
			'default' => 'text',
		),
		// Logo Image
		'img' => array(
			'key'    => 'logo-img',
			'return' => 'value',
		),
		// Logo Inverse Image
		'img-inv' => array(
			'key'    => 'logo-img-inv',
			'return' => 'value',
		),
		// Logo Text
		'text' => array(
			'key'     => 'logo-text',
			'return'  => 'value',
			'default' => get_bloginfo( 'name', 'display' ),
		),
		// Logo Text Inverse Color
		'text-inv' => array(
			'key'    => 'logo-text-inv',
			'return' => 'value',
		),
		// Show Tagline
		'show-tagline' => array(
			'key' => 'logo-show-tagline',
		),
		// Tagline Text
		'tagline' => array(
			'key'     => 'logo-tagline',
			'return'  => 'value',
			'default' => get_bloginfo( 'description', 'display' ),
		),
	) );

	$output = '';

	// Logo Markup
	if ( $options['type'] == 'img' && ! empty($options['img']['url']) ) {
		if ( ! empty($options['img-inv']['url']) ) {
			$output .= '<img class="logo-img logo-light" src="' . $options['img']['url'] . '" alt="' . $options['text'] . '">';
			$output .= '<img class="logo-img logo-dark" src="' . $options['img-inv']['url'] . '" alt="' . $options['text'] . '">';
		} else {
			$output .= '<img class="logo-img" src="' . $options['img']['url'] . '" alt="' . $options['text'] . '">';
		}
	} else {
		$output .= '<strong>' . $options['text'] . '</strong>';
	}

	// Tagline Markup
	if ( $options['show-tagline'] && ! empty($options['tagline']) ) {
		$output .= '<small>' . $options['tagline'] . '</small>';
	}

	// Output Logo
	echo apply_filters('mixt_logo_html', $output);
}


/**
 * Display the secondary navbar
 */
function mixt_second_nav() {
	$options = mixt_get_options( array(
		'hover-bg'       => array( 'key' => 'sec-nav-hover-bg' ),
		'active-bar'     => array( 'key' => 'sec-nav-active-bar' ),
		'active-bar-pos' => array( 'key' => 'sec-nav-active-bar-pos', 'return' => 'value' ),
		'bordered'       => array( 'key' => 'sec-nav-bordered' ),
		'left-content'   => array( 'type' => 'str', 'key' => 'sec-nav-left-content', 'return' => 'value' ),
		'left-code'      => array( 'key' => 'sec-nav-left-code', 'return' => 'value' ),
		'left-hide'      => array( 'key' => 'sec-nav-left-hide' ),
		'right-content'  => array( 'type' => 'str', 'key' => 'sec-nav-right-content', 'return' => 'value' ),
		'right-code'     => array( 'key' => 'sec-nav-right-code', 'return' => 'value' ),
		'right-hide'     => array( 'key' => 'sec-nav-right-hide' ),
	) );

	$left_content = $left_content_class = $right_content = $right_content_class = '';

	$nav_classes = 'theme-' . Mixt_Options::get('themes', 'sec-nav');
	if ( $options['bordered'] ) $nav_classes .= ' bordered';
	if ( ! $options['hover-bg'] ) $nav_classes .= ' no-hover-bg';
	if ( $options['left-hide'] && $options['right-hide'] ) $nav_classes .= ' hidden-xs';

	$nav_menu_classes = 'nav navbar-nav';
	if ( $options['active-bar'] ) {
		$nav_menu_classes .= ' active-' . $options['active-bar-pos'];
	} else {
		$nav_menu_classes .= ' no-active';
	}


	// LEFT SIDE CONTENT
	
	// Content: Navigation
	if ( $options['left-content'] == '1' ) {
		$left_content_nav = wp_nav_menu(
			array(
				'theme_location'  => 'sec_navbar_left',
				'container_class' => 'navbar-inner',
				'menu_class'      => $nav_menu_classes,
				'fallback_cb'     => '__return_false',
				'echo'            => false,
				'menu_id'         => 'sec-navbar-menu-left',
				'walker'          => new Mixt_Navwalker()
			)
		);
		if ( ! empty($left_content_nav) ) {
			$left_content = $left_content_nav;
		} else {
			$left_content = mixt_no_menu_msg(false);
		}

	// Content: Social Icons
	} else if ( $options['left-content'] == '2' ) {
		$left_content = mixt_social_profiles(false, array('style' => 'nav'));

	// Content: Text / Code
	} else if ( $options['left-content'] == '3' ) {
		$left_content_class = 'content-code';
		$left_content = '<div class="code-inner text-cont">' . $options['left-code'] . '</div>';
	}
	if ( $options['left-hide'] ) { $left_content_class .= ' hidden-xs'; }


	// RIGHT SIDE CONTENT

	// Content: Navigation
	if ( $options['right-content'] == '1' ) {
		$right_content_nav = wp_nav_menu(
			array(
				'theme_location'  => 'sec_navbar_right',
				'container_class' => 'navbar-inner',
				'menu_class'      => $nav_menu_classes,
				'fallback_cb'     => '__return_false',
				'echo'            => false,
				'menu_id'         => 'sec-navbar-menu-right',
				'walker'          => new Mixt_Navwalker()
			)
		);
		if ( ! empty($right_content_nav) ) {
			$right_content = $right_content_nav;
		} else {
			$right_content = mixt_no_menu_msg(false);
		}

	// Content: Social Icons
	} else if ( $options['right-content'] == '2' ) {
		$right_content = mixt_social_profiles(false, array('style' => 'nav'));

	// Content: Text / Code
	} else if ( $options['right-content'] == '3' ) {
		$right_content_class = 'content-code';
		$right_content = '<div class="code-inner text-cont">' . $options['right-code'] . '</div>';
	}
	if ( $options['right-hide'] ) { $right_content_class .= ' hidden-xs'; }


	// OUTPUT

	if ( ! empty($left_content) || ! empty($right_content) ) {
		?>
		<nav id="second-nav" class="second-nav navbar <?php echo $nav_classes; ?>">
			<div class="container">
				<div class="left-content <?php echo $left_content_class; ?>">
					<?php echo $left_content; ?>
				</div>
				<div class="right-content <?php echo $right_content_class; ?>">
					<?php echo $right_content; ?>
				</div>
			</div>
			<div class="navbar-data"></div>
		</nav>
		<?php
	}
}


/**
 * Display the Location Bar
 */
function mixt_location_bar() {
	if ( is_front_page() ) { return false; }

	$options = mixt_get_options( array(
		'left-content'  => array(
			'key'    => 'loc-bar-left-content',
			'type'   => 'str',
			'return' => 'value',
		),
		'right-content' => array(
			'key'    => 'loc-bar-right-content',
			'type'   => 'str',
			'return' => 'value',
		),
	) );

	$page_title  = mixt_get_title();
	$description = term_description();

	$title_string = '<h1>' . $page_title . '</h1>';
	if ( ! empty( $description ) ) {
		$title_string .= $description;
	}

	// Output

	if ( $options['left-content'] != '0' || $options['right-content'] != '0' ) {
		?>
		<div id="location-bar" class="theme-section-alt">
			<div class="container">
				<div class="inner">

					<div class="left-content">
					<?php
						// Left Side Title
						if ( $options['left-content'] == '1' ) {
							echo "<div class='page-title'>$title_string</div>";

						// Left Side Breadcrumbs
						} else if ( $options['left-content'] == '2' && function_exists('mixt_breadcrumbs') ) {
							mixt_breadcrumbs($page_title);
						}
					?>
					</div>

					<div class="right-content">
					<?php
						// Right Side Title
						if ( $options['right-content'] == '1' ) {
							echo "<div class='page-title'>$title_string</div>";

						// Right Side Breadcrumbs
						} else if ( $options['right-content'] == '2' && function_exists('mixt_breadcrumbs') ) {
							mixt_breadcrumbs($page_title);
						}
					?>
					</div>

				</div>
			</div>
		</div>
		<?php
	}
}

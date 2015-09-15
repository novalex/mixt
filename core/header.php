<?php

/**
 * Header Elements
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Display Page Loader
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
	if ( $options['anim'] != 'none' ) {
		$load_classes .= 'animated infinite ' . $options['anim'] . ' ';
	}

	// Default Loader
	$load_elem = '<div class="ring ' . $load_classes . '"></div>';

	// Loader Shape
	if ( $options['type'] == '1' ) {
		$load_elem = '<div class="' . $load_classes . $options['shape'] . '"></div>';

	// Loader Image
	} else if ( is_array($options['img']) && ! empty($options['img']['url']) ) {
		$load_elem = '<img src="' . $options['img']['url'] . '" alt="Loading..." class="' . $load_classes . '">';
	}

	// Output ?>
	<div id="load-overlay">
		<div class="load-inner">
			<?php echo $load_elem; ?>
		</div>
	</div>
	<script type="text/javascript" id="mixt-loading-class">document.body.className += " loading";</script><?php
}


/**
 * Display Logo
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
			'key'    => 'logo-show-tagline',
		),
		// Tagline Text
		'tagline' => array(
			'key'     => 'logo-tagline',
			'return'  => 'value',
			'default' => get_bloginfo( 'description', 'display' ),
		),
	) );

	// Output Logo

	if ( $options['type'] == 'img' && ! empty($options['img']['url']) ) {
		if ( ! empty($options['img-inv']['url']) ) {
			echo '<img class="logo-img logo-light" src="' . $options['img']['url'] . '" alt="' . $options['text'] . '">';
			echo '<img class="logo-img logo-dark" src="' . $options['img-inv']['url'] . '" alt="' . $options['text'] . '">';
		} else {
			echo '<img class="logo-img" src="' . $options['img']['url'] . '" alt="' . $options['text'] . '">';
		}
	} else {
		if ( ! empty($options['text-inv']) ) {
			echo '<strong class="logo-light">' . $options['text'] . '</strong>';
			echo '<strong class="logo-dark">' . $options['text'] . '</strong>';
		} else {
			echo '<strong>' . $options['text'] . '</strong>';
		}
	}

	// Output Tagline

	if ( $options['show-tagline'] ) {
		echo '<small>' . $options['tagline'] . '</small>';
	}
}


/**
 * Display Secondary Navbar
 */
function mixt_second_nav() {
	$options = mixt_get_options( array(
		'theme' => array(
			'type'    => 'str',
			'key'     => 'sec-nav-theme',
			'return'  => 'value',
			'prefix'  => 'theme-',
			'suffix'  => ' ',
			'default' => 'aqua',
		),
		'hover-bg' => array(
			'key'    => 'sec-nav-hover-bg',
			'return' => array(
				'false' => 'no-hover-bg ',
			),
		),
		'active-bar' => array(
			'key'    => 'sec-nav-active-bar',
			'return' => array(
				'false' => 'no-active ',
			),
		),
		'active-bar-pos' => array(
			'key'    => 'sec-nav-active-bar-pos',
			'return' => 'value',
			'prefix' => 'active-',
			'suffix' => ' ',
		),
		'bordered' => array(
			'key'    => 'sec-nav-bordered',
			'return' => array(
				'true' => 'bordered ',
			),
		),
		'left-content' => array(
			'type'   => 'str',
			'key'    => 'sec-nav-left-content',
			'return' => 'value',
		),
		'left-hide' => array( 'key' => 'sec-nav-left-hide' ),
		'left-code' => array(
			'key'    => 'sec-nav-left-code',
			'return' => 'value',
		),
		'right-content' => array(
			'type'   => 'str',
			'key'    => 'sec-nav-right-content',
			'return' => 'value',
		),
		'right-hide' => array( 'key' => 'sec-nav-right-hide' ),
		'right-code' => array(
			'key'    => 'sec-nav-right-code',
			'return' => 'value',
		),
	) );

	$left_el = $left_el_classes = $right_el = $right_el_classes = '';

	// Navbar Theme
	$nav_classes = $options['theme'] . $options['bordered'] . $options['hover-bg'];
	$nav_menu_classes = 'nav navbar-nav ' . $options['active-bar'] . $options['active-bar-pos'];
	if ( $options['left-hide'] && $options['right-hide'] ) { $nav_classes .= ' hidden-xs'; }


	function wrap_code($code) {
		return '<div class="code-inner text-cont">' . $code . '</div>';
	}


	// LEFT SIDE CONTENT
	
	// Content: Navigation
	if ( $options['left-content'] == '1' ) {
		$left_el_nav = wp_nav_menu(
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
		if ( ! empty($left_el_nav) ) {
			$left_el = $left_el_nav;
		} else {
			$left_el = mixt_no_menu_msg(false);
		}

	// Content: Social Icons
	} else if ( $options['left-content'] == '2' ) {
		$left_el = mixt_social_profiles(false, array('style' => 'nav'));

	// Content: Text / Code
	} else if ( $options['left-content'] == '3' ) {
		$left_el_classes = 'content-code';
		$left_el = wrap_code($options['left-code']);
	}
	if ( $options['left-hide'] ) { $left_el_classes .= ' hidden-xs'; }


	// RIGHT SIDE CONTENT

	// Content: Navigation
	if ( $options['right-content'] == '1' ) {
		$right_el_nav = wp_nav_menu(
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
		if ( ! empty($right_el_nav) ) {
			$right_el = $right_el_nav;
		} else {
			$right_el = mixt_no_menu_msg(false);
		}

	// Content: Social Icons
	} else if ( $options['right-content'] == '2' ) {
		$right_el = mixt_social_profiles(false, array('style' => 'nav'));

	// Content: Text / Code
	} else if ( $options['right-content'] == '3' ) {
		$right_el_classes = 'content-code';
		$right_el = wrap_code($options['right-code']);
	}
	if ( $options['right-hide'] ) { $right_el_classes .= ' hidden-xs'; }

// Output

if ( ! empty($left_el) || ! empty($right_el) ) :

echo <<<EOT
<nav id="second-nav" class="second-nav navbar $nav_classes">
	<div class="container">
		<div class="left $left_el_classes">
			$left_el
		</div>
		<div class="right $right_el_classes">
			$right_el
		</div>
	</div>
</nav>
EOT;

endif;

}


/**
 * Display Location Bar
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
		<div id="location-bar">
			<div class="container">
				<div class="inner">

					<div class="left-content"><?php
						// Left Side Title
						if ( $options['left-content'] == '1' ) { ?>
							<div class="page-title"><?php
								echo $title_string; ?>
							</div><?php

						// Left Side Breadcrumbs
						} else if ( $options['left-content'] == '2' ) {
							if ( class_exists('WooCommerce') && ( is_woocommerce() || is_cart() || is_checkout() ) ) {
								woocommerce_breadcrumb();
							} else if ( function_exists('mixt_breadcrumbs') ) {
								mixt_breadcrumbs($page_title);
							}
						}
					?></div>

					<div class="right-content"><?php
						// Right Side Title
						if ( $options['right-content'] == '1' ) { ?>
							<div class="page-title"><?php
								echo $title_string; ?>
							</div><?php

						// Right Side Breadcrumbs
						} else if ( $options['right-content'] == '2' ) {
							if ( class_exists('WooCommerce') && ( is_woocommerce() || is_cart() || is_checkout() ) ) {
								woocommerce_breadcrumb();
							} else if ( function_exists('mixt_breadcrumbs') ) {
								mixt_breadcrumbs($page_title);
							}
						}
					?></div>

				</div>
			</div>
		</div>
		<?php
	}
}

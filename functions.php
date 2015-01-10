<?php

/**
 * MIXT Functions and Definitions
 *
 * @package mixt
 */

// DEFINE CONSTANTS

define( 'MIXT_FRAME_DIR', get_template_directory_uri() . '/framework/'); // Framework Directory

// REQUIRE INCLUDES

$mixt_includes = array(
  'inc/breadcrumbs.php', // Breadcrumbs
);

foreach ( $mixt_includes as $file ) {
	if ( !$filepath = locate_template($file) ) {
	  	trigger_error(sprintf(__('Error locating %s for inclusion', 'mixt'), $file), E_USER_ERROR);
	}
	require_once $filepath;
}
unset( $file, $filepath );


// GENERAL VARS

$fns_path = dirname( __FILE__ );


// LOAD FRAMEWORK PLUGINS

$tgmpa_plugins = array(); // Array of required plugins.

// Redux Framework and extensions

	// Redux Extension Loader
	if ( file_exists( $fns_path . '/framework/redux-mixt-extension-loader/loader.php' ) ) {
		require_once( $fns_path . '/framework/redux-mixt-extension-loader/loader.php' );
	}
	// Redux Framework
	if ( file_exists( $fns_path . '/framework/redux-mixt/ReduxCore/framework.php' ) ) {
	    if ( !class_exists( 'ReduxFramework' ) ) {
	    	require_once( $fns_path . '/framework/redux-mixt/ReduxCore/framework.php' );
	    }
	} else {
		$tgmpa_plugins[] = array(
			'name'     => 'Redux Framework',
			'slug'     => 'redux-framework',
			'required' => true
		);
	}
	// MIXT Redux Custom CSS
	function redux_mixt_css() {
	    wp_register_style( 'redux-mixt-css', get_template_directory_uri() . '/framework/admin/css/redux-options.css', array( 'redux-css' ), time(), 'all' );  
	    wp_enqueue_style( 'redux-mixt-css' );
	}
	add_action( 'redux/page/mixt_opt/enqueue', 'redux_mixt_css' );
	// MIXT Redux Config
	if ( !isset( $mixt_opt ) && file_exists( $fns_path . '/framework/redux-config.php' ) ) {
		require_once( $fns_path . '/framework/redux-config.php' );
	}

// CMB2 Framework

	if ( file_exists( $fns_path . '/framework/cmb2-config.php' ) ) {
	    require_once( $fns_path . '/framework/cmb2-config.php' );

	    if ( !file_exists( $fns_path . '/framework/cmb2-mixt/init.php') ) {
			$tgmpa_plugins[] = array(
				'name'     => 'CMB2',
				'slug'     => 'cmb2',
				'required' => true
			);
		}
	}

// MICF library & Config

	if ( file_exists( $fns_path . '/framework/micf-mixt/menu-item-custom-fields.php' ) ) {
	    require_once( $fns_path . '/framework/micf-mixt/menu-item-custom-fields.php' );
	} else {
		$tgmpa_plugins[] = array(
			'name'     => 'Menu Item Custom Fields',
			'slug'     => 'menu-item-custom-fields',
			'required' => true
	    );
	}
	if ( file_exists( $fns_path . '/framework/micf-config.php' ) ) {
		require_once( $fns_path . '/framework/micf-config.php' );
	}

// WPBakery Visual Composer

	$tgmpa_plugins[] = array(
		'name'     => 'WPBakery Visual Composer',
		'slug'     => 'js_composer',
		'source'   => $fns_path . '/framework/plugins/js_composer.zip',
		'required' => false
	);

// LayerSlider

	$tgmpa_plugins[] = array(
	    'name' => 'LayerSlider WP',
	    'slug' => 'LayerSlider',
	    'source' => $fns_path . '/framework/plugins/layerslider.zip',
	    'required' => false,
	    'version' => '5.0.2',
	    'force_deactivation' => true
	);

// Run TGMPA Function

require_once( $fns_path . '/framework/class-tgm-plugin-activation.php' );

add_action( 'tgmpa_register', 'mixt_register_required_plugins' );

function mixt_register_required_plugins() {

	global $tgmpa_plugins;

    $config = array(
        'default_path' => '',                      // Default absolute path to pre-packaged plugins.
        'menu'         => 'tgmpa-install-plugins', // Menu slug.
        'has_notices'  => true,                    // Show admin notices or not.
        'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
        'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
        'is_automatic' => false,                   // Automatically activate plugins after installation or not.
        'message'      => '',                      // Message to output right before the plugins table.
        'strings'      => array(
            'page_title'                      => __( 'Install Required Plugins', 'tgmpa' ),
            'menu_title'                      => __( 'Install Plugins', 'tgmpa' ),
            'installing'                      => __( 'Installing Plugin: %s', 'tgmpa' ), // %s = plugin name.
            'oops'                            => __( 'Something went wrong with the plugin API.', 'tgmpa' ),
            'notice_can_install_required'     => _n_noop( 'This theme requires the following plugin: %1$s.', 'This theme requires the following plugins: %1$s.' ), // %1$s = plugin name(s).
            'notice_can_install_recommended'  => _n_noop( 'This theme recommends the following plugin: %1$s.', 'This theme recommends the following plugins: %1$s.' ), // %1$s = plugin name(s).
            'notice_cannot_install'           => _n_noop( 'Sorry, but you do not have the correct permissions to install the %s plugin. Contact the administrator of this site for help on getting the plugin installed.', 'Sorry, but you do not have the correct permissions to install the %s plugins. Contact the administrator of this site for help on getting the plugins installed.' ), // %1$s = plugin name(s).
            'notice_can_activate_required'    => _n_noop( 'The following required plugin is currently inactive: %1$s.', 'The following required plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
            'notice_can_activate_recommended' => _n_noop( 'The following recommended plugin is currently inactive: %1$s.', 'The following recommended plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
            'notice_cannot_activate'          => _n_noop( 'Sorry, but you do not have the correct permissions to activate the %s plugin. Contact the administrator of this site for help on getting the plugin activated.', 'Sorry, but you do not have the correct permissions to activate the %s plugins. Contact the administrator of this site for help on getting the plugins activated.' ), // %1$s = plugin name(s).
            'notice_ask_to_update'            => _n_noop( 'The following plugin needs to be updated to its latest version to ensure maximum compatibility with this theme: %1$s.', 'The following plugins need to be updated to their latest version to ensure maximum compatibility with this theme: %1$s.' ), // %1$s = plugin name(s).
            'notice_cannot_update'            => _n_noop( 'Sorry, but you do not have the correct permissions to update the %s plugin. Contact the administrator of this site for help on getting the plugin updated.', 'Sorry, but you do not have the correct permissions to update the %s plugins. Contact the administrator of this site for help on getting the plugins updated.' ), // %1$s = plugin name(s).
            'install_link'                    => _n_noop( 'Begin installing plugin', 'Begin installing plugins' ),
            'activate_link'                   => _n_noop( 'Begin activating plugin', 'Begin activating plugins' ),
            'return'                          => __( 'Return to Required Plugins Installer', 'tgmpa' ),
            'plugin_activated'                => __( 'Plugin activated successfully.', 'tgmpa' ),
            'complete'                        => __( 'All plugins installed and activated successfully. %s', 'tgmpa' ), // %s = dashboard link.
            'nag_type'                        => 'updated' // Determines admin notice type - can only be 'updated', 'update-nag' or 'error'.
        )
    );

    tgmpa( $tgmpa_plugins, $config );
}


// SET UP THEME AND REGISTER FEATURES

if ( ! isset( $content_width ) ) {
	// Set The Content Width
	$content_width = 750;
}

if ( ! function_exists( 'mixt_setup' ) ) :
	function mixt_setup() {

		global $cap, $content_width;

		// This theme styles the visual editor with editor-style.css to match the theme style.
		add_editor_style();

		if ( function_exists( 'add_theme_support' ) ) {

			// Add default posts and comments RSS feed links to head
			add_theme_support( 'automatic-feed-links' );

			// Enable support for Post Thumbnails on posts and pages
			add_theme_support( 'post-thumbnails' );

			// Enable support for Post Formats
			add_theme_support( 'post-formats', array( 'aside', 'image', 'video', 'quote', 'link' ) );

			// Setup the WordPress core custom background feature
			add_theme_support( 'custom-background', apply_filters( 'mixt_custom_background_args', array(
				'default-color' => 'ffffff',
				'default-image' => '',
			) ) );

			// Declare WooCommerce Support
			add_theme_support( 'woocommerce' );

		}

		// Add Translation Support
		load_theme_textdomain( 'mixt', get_template_directory() . '/languages' );

		// Register Navigation Menus
		register_nav_menus( array(
			'primary'  => __( 'Top Navigation', 'mixt' ),
		) );
	}
endif;
add_action( 'after_setup_theme', 'mixt_setup' );


// Initialize Visual Composer As Included With Theme
add_action( 'vc_before_init', 'mixt_vcSetAsTheme' );
function mixt_vcSetAsTheme() {
    vc_set_as_theme();
}

// Initialize LayerSlider As Included With Theme
add_action('layerslider_ready', 'mixt_layerslider_overrides');
function mixt_layerslider_overrides() {
    // Disable auto-updates
    $GLOBALS['lsAutoUpdateBox'] = false;
}


// Add search button in top nav menu
add_filter( 'wp_nav_menu_items', 'top_nav_search', 10, 2 );
function top_nav_search( $items, $args ) {
	if ( $args->theme_location !== 'primary' ) {
	    return $items;
	} else {
		$search_form = '<li class="nav-search menu-item dropdown">' .
					   '<a href="#" data-toggle="dropdown" data-target="#" class="dropdown-toggle disabled">' .
		               '<i class="menu-icon icon-search"></i></a>' .
		               '<ul class="submenu dropdown-menu"><li class="menu-item">' .
					   get_search_form(false) .
					   '</li></ul></li>';
	    $items .= $search_form;
	    return $items;
	}
}

// Function To Retreive Post Meta
function mixt_meta( $key, $post_id = '', $single = true ) {
	if ( !$post_id || $post_id == '' ) $post_id = get_queried_object_id();
	return get_post_meta( $post_id, $key, $single );
}

// Remove auto <br> tags added in content
remove_filter( 'the_content', 'wpautop' );
function wpautopnobr($content) {
	return wpautop($content, false);
}
add_filter( 'the_content', 'wpautopnobr' );

// Remove admin bar inline styles
add_action( 'get_header', 'remove_adminbar_styles' );
function remove_adminbar_styles() {
	remove_action('wp_head', '_admin_bar_bump_cb');
}


// DEFINE GLOBAL VARS

// Background patterns array
$bg_patterns_path = get_stylesheet_directory() . '/assets/img/bg-pat/';
$bg_patterns_url  = get_stylesheet_directory_uri() . '/assets/img/bg-pat/';
$bg_patterns      = array();

if ( is_dir( $bg_patterns_path ) ) :

    if ( $bg_patterns_dir = opendir( $bg_patterns_path ) ) :
        $bg_patterns = array();

        while ( ( $bg_patterns_file = readdir( $bg_patterns_dir ) ) !== false ) {

            if ( stristr( $bg_patterns_file, '.png' ) !== false || stristr( $bg_patterns_file, '.jpg' ) !== false ) {
                $name              = explode( '.', $bg_patterns_file );
                $name              = str_replace( '.' . end( $name ), '', $bg_patterns_file );
                $bg_patterns[] = array(
                    'alt' => $name,
                    'img' => $bg_patterns_url . $bg_patterns_file
                );
            }
        }

    endif;

endif;


// Register widgetized area and update sidebar with default widgets
function mixt_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'mixt' ),
		'id'            => 'sidebar-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name' => 'Footer Widgets',
		'id' => 'footer-1',
		'before_widget' => '<div>',
		'after_widget' => '</div>',
		'before_title' => '<h2 class="rounded">',
		'after_title' => '</h2>',
	) );
}
add_action( 'widgets_init', 'mixt_widgets_init' );


// ENQUEUE SCRIPTS AND STYLES

function mixt_scripts() {

	// load main stylesheet
	wp_enqueue_style( 'mixt-style', get_stylesheet_uri() );

	// Load JS plugins
	wp_enqueue_script( 'mixt-plugins-js', get_stylesheet_directory_uri() . '/assets/js/plugins.js', array( 'jquery' ), '1.0', true );

	// Load global functions
	wp_enqueue_script( 'mixt-global-js', get_stylesheet_directory_uri() . '/assets/js/global.js', array( 'jquery' ), '1.0', true );

	// load bootstrap CSS
	wp_enqueue_style( 'mixt-bootstrap', get_template_directory_uri() . '/dist/bootstrap-mixt.css' );

	// load Main CSS
	wp_enqueue_style( 'mixt-master-css', get_template_directory_uri() . '/dist/main.css' );

	// load Custom CSS
	wp_enqueue_style( 'mixt-custom-css', get_template_directory_uri() . '/css/custom.css' );

	// load Font Awesome CSS
	wp_enqueue_style( 'mixt-font-awesome', get_template_directory_uri() . '/inc/css/whhg.css', false, '4.1.0' );

	// load bootstrap js
	wp_enqueue_script( 'mixt-bootstrapjs', get_template_directory_uri().'/dist/bootstrap-mixt.js', array('jquery') );

	// load mixt js
	wp_enqueue_script( 'mixt-js-inc', get_template_directory_uri() . '/dist/js-inc.js', array('jquery'), '1.0', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

}
add_action( 'wp_enqueue_scripts', 'mixt_scripts' );


// ENQUEUE ADMIN SCRIPTS AND STYLES

function mixt_admin_scripts($hook) {
	// Menu Page Scripts
    if ( $hook == 'nav-menus.php' ) {
        wp_enqueue_script( 'mixt-admin-menu-js', get_template_directory_uri() . '/framework/admin/js/menu-scripts.js', array('jquery'), '1.0' );
    // Page Admin Scripts
    } elseif ( $hook == 'post.php' || $hook == 'post-new.php' ) {
    	wp_enqueue_script( 'mixt-admin-page-js', get_template_directory_uri() . '/framework/admin/js/page-scripts.js', array('jquery'), '1.0', true );
    	wp_enqueue_style( 'mixt-admin-page-css', get_template_directory_uri() . '/framework/admin/css/page-styles.css', false, '1.0' );
    } else {
    	return;
    }
}
add_action( 'admin_enqueue_scripts', 'mixt_admin_scripts' );


// VARIOUS THEME OPTIONS AND FUNCTIONS

// Get Global Options Var
global $mixt_opt;

// Implement the Custom Header feature
require get_template_directory() . '/inc/custom-header.php';

// Custom template tags for this theme
require get_template_directory() . '/inc/template-tags.php';

// Custom functions that act independently of the theme templates
require get_template_directory() . '/inc/extras.php';

// Customizer additions
require get_template_directory() . '/inc/customizer.php';

// Load Jetpack compatibility file
require get_template_directory() . '/inc/jetpack.php';

// Load custom nav walker
require get_template_directory() . '/inc/mixt-navwalker.php';

// Load modules
require get_template_directory() . '/inc/modules.php';

// WP Admin bar
if ( array_key_exists('show-admin-bar', $mixt_opt) && $mixt_opt['show-admin-bar'] == false ) {
	show_admin_bar( false );
}

// Global option vars

function mixt_meta_options() {
	// $has_sidebar = mixt_meta('mixt_page_sidebar');
}
// add_action( 'wp_head', 'mixt_meta_options' );

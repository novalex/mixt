<?php

/**
 * MIXT Custom Meta Boxes Config
 *
 * @package  MIXT\Plugins\CMB2
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/webdevstudios/Custom-Metaboxes-and-Fields-for-WordPress
 */

// Load CMB2
if ( file_exists(  __DIR__ . '/plugins/cmb2/init.php' ) ) {
	require_once( __DIR__ . '/plugins/cmb2/init.php' );
}


/**
 * Check if a tab should display on the current page
 * @param  string $tab The tab to check
 * @return bool
 */
function mixt_cmb_show_tab($tab) {
	// Get the current ID
	if ( isset( $_GET['post'] ) ) {
		$post_id = $_GET['post'];
	} else if ( isset( $_POST['post_ID'] ) ) {
		$post_id = $_POST['post_ID'];
	}
	if ( ! isset( $post_id ) ) {
		return in_array( $tab, array('navigation', 'header', 'sidebar', 'footer') );
	}

	$page_template = get_page_template_slug($post_id);

	switch ( $tab ) {
		case 'post':
			return ( get_post_type($post_id) == 'post' );
			break;
		case 'project':
			return ( get_post_type($post_id) == 'portfolio' );
			break;
		case 'posts-page':
			return ( $page_template == 'templates/blog.php' || $page_template == 'templates/portfolio.php' );
			break;
		case 'blog':
			$posts_page = get_option('page_for_posts');
			return ( $post_id == $posts_page || $page_template == 'templates/blog.php' );
			break;
		case 'portfolio':
			return ( $page_template == 'templates/portfolio.php' );
			break;
		case 'navigation':
		case 'header':
		case 'sidebar':
		case 'footer':
			return ( $page_template != 'templates/blank.php' );
			break;
		default:
			return false;
	}
}


/**
 * Wrap a group of options in a tab and add it to the metabox fields array
 */
function mixt_cmb_make_tab(&$fields, $name, $icon = '', $options) {
	$id = sanitize_title($name);

	$fields[] = array(
		'id'   => $id . '_tab',
		'name' => $name,
		'type' => 'tab',
		'icon' => $icon,
		'render_row_cb' => 'mixt_cmb_render_tab_row',
	);

	foreach ( $options as $option ) {
		$fields[] = $option;
	}

	$fields[] = array(
		'id'   => $id . '_tab_end',
		'type' => 'tab-close',
		'render_row_cb' => 'mixt_cmb_render_tab_close_row',
	);
}


/**
 * Custom label callback with 'auto' checkbox
 */
function mixt_cmb_auto_label_cb($args, $field) {
	if ( ! $field->args( 'name' ) ) {
		return '';
	}
	$field_id = $field->id();
	$auto_id  = $field_id . '_auto';
	$auto_text = __( 'Auto', 'mixt' );
	$auto_atts = ( $field->escaped_value() == 'auto' ) ? ' checked="checked"' : '';
	$style = ! $field->args( 'show_names' ) ? ' style="display:none;"' : '';

	return sprintf( "\n" . '<label%1$s for="%2$s">%3$s</label>' . "\n", $style, $field_id, $field->args( 'name' ) ) .
		   "<span class='mixt-field-auto'><input id='$auto_id' type='checkbox'$auto_atts><label for='$auto_id'>$auto_text</label></span>";
}


/**
 * Sanitize WYSIWYG editor
 */
function mixt_cmb_sanitize_editor($override, $value, $object_id) {
	return htmlspecialchars_decode( stripslashes( $value ) );
}
add_filter('cmb2_sanitize_wysiwyg', 'mixt_cmb_sanitize_editor', 10, 3);


/**
 * Define the metabox and field configurations.
 *
 * @param  array $meta_boxes
 * @return array
 */
function cmb2_mixt_metaboxes( array $meta_boxes ) {

	$prefix = '_mixt-'; // Start with underscore to hide custom meta from 'Custom Fields' section

	$site_themes = ( (bool) get_option('mixt-themes-enabled') ) ? mixt_get_themes('site', 'all') : mixt_get_themes('site', 'default');
	$site_themes = array_merge( array('auto' => __( 'Auto', 'mixt')), $site_themes );
	$nav_themes = ( (bool) get_option('mixt-themes-enabled') ) ? mixt_get_themes('nav', 'all') : mixt_get_themes('nav', 'default');
	$nav_themes = array_merge( array('auto' => __( 'Auto', 'mixt')), $nav_themes );

	$fields = array();


	// GENERAl TAB
	include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/general.php' );

	// POSTS PAGE TAB
	if ( mixt_cmb_show_tab('posts-page') && function_exists('cmb2_post_search_render_field') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/posts-page.php' );	
	}

	// POST TAB
	if ( mixt_cmb_show_tab('post') || mixt_cmb_show_tab('project') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/post.php' );	
	}

	// BLOG TAB
	if ( mixt_cmb_show_tab('blog') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/blog.php' );
	}

	// PORTFOLIO OPTIONS
	if ( class_exists('Mixt_Portfolio') && mixt_cmb_show_tab('portfolio') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/portfolio.php' );
	}

	// NAVIGATION TAB
	if ( mixt_cmb_show_tab('navigation') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/navigation.php' );
	}

	// HEADER TAB
	if ( mixt_cmb_show_tab('header') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/header.php' );
	}

	// SIDEBAR TAB
	if ( mixt_cmb_show_tab('sidebar') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/sidebar.php' );
	}

	// FOOTER TAB
	if ( mixt_cmb_show_tab('footer') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/fields/footer.php' );	
	}


	// BUILD PAGE OPTIONS METABOX

	$meta_boxes['mixt_page_meta'] = array(
		'id'           => 'mixt_page_options',
		'title'        => __( 'Page Options', 'mixt' ),
		'object_types' => array( 'page', 'post', 'portfolio', 'product' ),
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => $fields,
	);

	return $meta_boxes;
}
add_filter( 'cmb2_meta_boxes', 'cmb2_mixt_metaboxes' );

<?php

/**
 * Filter for changing demo title in options panel
 */
function mixt_wbc_filter_title($title) {
	return trim(ucwords(str_replace('-', ' ', $title)));
}
add_filter('wbc_importer_directory_title', 'mixt_wbc_filter_title', 10);


/**
 * Perform operations after importing a demo
 */
function mixt_wbc_after_import($demo_import, $demo_dir) {
	reset($demo_import);
	$current_key = key($demo_import);

	if ( ! empty($demo_import[$current_key]['directory']) ) {
		$demo_id = $demo_import[$current_key]['directory'];

		// Set Menus

		$main_menu = get_term_by('name', 'Main', 'nav_menu');
		$menu_locations = get_theme_mod('nav_menu_locations');

		if ( isset( $main_menu->term_id ) ) {
			$menu_locations['primary'] = $main_menu->term_id;
		}

		if ( $demo_id == 'classic' ) {
			$menu_404 = get_term_by('name', '404 Menu', 'nav_menu');
			if ( isset( $menu_404->term_id ) ) {
				$menu_locations['404_page'] = $menu_404->term_id;
			}
		}

		set_theme_mod('nav_menu_locations', $menu_locations);

		// Set Homepage

		$homepage = get_page_by_title('Home');
		if ( isset( $homepage->ID ) ) {
			update_option('page_on_front', $homepage->ID);
			update_option('show_on_front', 'page');
		}

		// Set Blog Page

		$blog_page = get_page_by_title('Blog');
		if ( isset( $blog_page->ID ) ) {
			update_option('page_for_posts', $blog_page->ID);
		}

		// Set Custom Sidebar Widgets

		if ( $demo_id == 'classic' ) {
			$sidebar_widgets = get_option('sidebars_widgets');
			$custom_widgets = array(
				'contact-sidebar' => array( 'mixt_shortcode-2', 'text-2' ),
				'help-sidebar' => array( 'nav_menu-2' ),
				'shop-sidebar' => array(
					'woocommerce_product_search-2', 'woocommerce_widget_cart-2',
					'woocommerce_layered_nav_filters-2', 'woocommerce_price_filter-2',
					'woocommerce_layered_nav-2', 'woocommerce_layered_nav-3',
					'woocommerce_product_tag_cloud-2', 'woocommerce_top_rated_products-2',
				),
			);
			if ( ! empty($sidebar_widgets) && is_array($sidebar_widgets) ) {
				foreach ( $custom_widgets as $sidebar => $widgets ) {
					foreach ( $widgets as $widget ) {
						unset($sidebar_widgets['wp_inactive_widgets'][$widget]);
					}
				}
				update_option('sidebars_widgets', array_merge($sidebar_widgets, $custom_widgets));
			}
		}

		// Import LayerSliders

		if ( class_exists('LS_Sliders') ) {
			$sliders_dir = $demo_dir . 'sliders';

			if ( is_dir($sliders_dir) ) {
				$sliders = array_diff(scandir($sliders_dir), array('.', '..'));
				LS_Sources::addDemoSlider($sliders_dir);
				include( LS_ROOT_PATH . '/classes/class.ls.importutil.php' );

				foreach ( $sliders as $slider ) {
					$slider_demo = LS_Sources::getDemoSlider($slider);
					
					// Import slider
					if ( ! empty($slider_demo) && file_exists($slider_demo['file']) ) {
						$slider_id = new LS_ImportUtil($slider_demo['file']);
					}
				}
			}
		}
	}
}
add_action('wbc_importer_after_content_import', 'mixt_wbc_after_import', 10, 2);


/**
 * Modify relevant postmeta on import
 */
function mixt_import_post_meta($meta, $post_id, $post) {
	// Remap attachment URL for file fields
	$file_fields = array(
		'_mixt-head-img_id' => '_mixt-head-img',
		'_mixt-head-video_id' => '_mixt-head-video',
		'_mixt-head-video-2_id' => '_mixt-head-video-2',
		'_mixt-head-video-poster_id' => '_mixt-head-video-poster',
	);
	// Get attachment ID
	foreach ( $meta as $meta_field ) {
		if ( array_key_exists($meta_field['key'], $file_fields) ) {
			$att_id = $meta_field['value'];
			$field_key = $meta_field['key'];
			// Update attachment URL
			foreach ( $meta as $meta_key => $meta_field ) {
				if ( $meta_field['key'] == $file_fields[$field_key] ) {
					$att_url = wp_get_attachment_url(intval($att_id));
					if ( ! empty($att_url) ) {
						$meta[$meta_key]['value'] = $att_url;
					}
				}
			}
		}
	}

	return $meta;
}
add_filter('wp_import_post_meta', 'mixt_import_post_meta', 10, 3);


/**
 * Update nav menu item meta with custom values
 */
function mixt_nav_menu_update_meta($menu_id, $menu_item_id, $args) {
	$meta_keys = array( 'type', 'icon', 'no-label', 'disabled', 'megamenu' );
	foreach ( $meta_keys as $_key ) {
		$key = 'mixt-menu-item-' . $_key;
		if ( array_key_exists($key, $args) ) {
			$u_key = '_' . str_replace('-', '_', $key);
			if ( $_key == 'icon' ) {
				$classes = explode(' ', $args[$key]);
				$value = array_map('sanitize_html_class', $classes);
			} else {
				$value = sanitize_key($args[$key]);
			}
			update_post_meta($menu_item_id, $u_key, $value);

			// Update URLs for archive pages
			if ( $_key == 'type' ) {
				$type = explode('-', $args[$key]);
				if ( $type[0] == 'archive' && ! empty($type[1]) ) {
					$url = esc_url_raw(get_post_type_archive_link($type[1]));
					update_post_meta($menu_item_id, '_menu_item_url', $url);
				}
			}
		}
	}
}
add_action('wp_update_nav_menu_item', 'mixt_nav_menu_update_meta', 5, 3);

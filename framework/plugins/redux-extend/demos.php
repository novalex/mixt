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

	$debug = array();

	if ( ! empty($demo_import[$current_key]['directory']) ) {
		$demo_id = $demo_import[$current_key]['directory'];

		// Set Menus

		$main_menu = get_term_by('name', 'Main', 'nav_menu');
		$menu_locations = get_theme_mod('nav_menu_locations');

		if ( isset( $main_menu->term_id ) ) {
			if ( $demo_id == 'one-page' ) {
				$menu_locations['onepage'] = $main_menu->term_id;
			} else {
				$menu_locations['primary'] = $main_menu->term_id;
			}
			set_theme_mod('nav_menu_locations', $menu_locations);
		}

		// Set Homepage

		$homepage = get_page_by_title('Home');
		if ( isset( $homepage->ID ) ) {
			update_option('page_on_front', $homepage->ID);
			update_option('show_on_front', 'page');
		}

		// Import LayerSliders

		if ( class_exists('LS_Sliders') ) {
			LS_Sources::addDemoSlider($demo_dir . 'sliders');
			include LS_ROOT_PATH.'/classes/class.ls.importutil.php';

			$slider_demo = LS_Sources::getDemoSlider('home-slider');
			
			if ( ! empty($slider_demo) && file_exists($slider_demo['file']) ) {
				$import = new LS_ImportUtil($slider_demo['file']);
			}
		}
	}
}
add_action('wbc_importer_after_content_import', 'mixt_wbc_after_import', 10, 2);

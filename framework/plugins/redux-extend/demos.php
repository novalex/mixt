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
function mixt_wbc_after_import($demo_import , $demo_dir) {
	reset($demo_import);
	$current_key = key($demo_import);

	// Import Layer Sliders
	if ( class_exists('LS_Sliders') ) {
		LS_Sources::addDemoSlider($demo_dir);
	}
}
add_action('wbc_importer_after_content_import', 'mixt_wbc_after_import', 10, 2);

<?php

/**
 * Favicon Generator
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Generate Favicons From Source Image And Output Links For Each
 */
function mixt_favicons() {

	$favicons_list = array(
		// Define favicon sizes
		'favicon' => array(
			'16',  // Default
			'32',  // Bigger
			'64',  // Hi-DPI
			'192', // Android Chrome M36+
		),
		'apple-touch-icon' => array(
			'60',  // iPhone
			'76',  // iPad
			'120', // iPhone Retina
			'152', // iPad Retina
		),
	);

	global $mixtConfig, $mixt_opt;

	$favicon_source_url = '';
	$rebuild = false;

	$mixt_img_edit = mixt_img_edit_support();

	if ( is_array( $mixt_opt ) ) {

		// Get selected favicon url
		if ( array_key_exists('favicon-img', $mixt_opt) && is_array($mixt_opt['favicon-img']) ) {
			$favicon_source_url = $mixt_opt['favicon-img']['url'];
		}

		// Check for rebuild flag
		if ( $mixt_opt['favicon-rebuild'] ) {
			$rebuild = true;
		}
	}

	$favicons_path = MIXT_UPLOAD_PATH . '/favicons';
	$favicons_url  = MIXT_UPLOAD_URL . '/favicons';

	// Create favicon directory if not found
	if ( ! is_dir( $favicons_path ) ) {
		wp_mkdir_p( $favicons_path );
	}

	if ( $rebuild ) {
		$rebuild = true;

		// Delete existing favicons
		$old_icons = glob( $favicons_path . '/*.png' );
		foreach( $old_icons as $icon ) {
			if ( is_file($icon) ) {
				unlink($icon);
			}
		}

		// Empty favicon HTML
		$favicon_html = '';
		$mixtConfig->ReduxFramework->set('favicon-html', $favicon_html);

		// Unset rebuild flag
		$mixtConfig->ReduxFramework->set('favicon-rebuild', false);
	}

	// If a favicon image is selected
	if ( ! empty($favicon_source_url) ) {

		if ( $mixt_img_edit ) {
		// Server has image editing capabilities

			// Check for rebuild flag
			if ( $rebuild ) {

				// BUILD NEW FAVICONS

				// Check if original favicon was copied to favicons directory
				$favicon_dest_path = $favicons_path . '/favicon-original.png';
				if ( ! file_exists($favicon_dest_path) ) {
					copy($favicon_source_url, $favicon_dest_path);
				}

				// Iterate through sizes
				foreach ( $favicons_list as $type => $sizes ) {

					// Get favicon type and use appropriate link rel
					if ( $type == 'apple-touch-icon' ) {
						$attrs    = '';
						$link_rel = 'apple-touch-icon-precomposed';
					} else {
						$attrs    = ' type="image/png"';
						$link_rel = 'icon';
					}

					foreach ( $sizes as $size ) {
						$size_ind  = $size . 'x' . $size;
						$filename  = $type . '-' . $size_ind . '.png';
						$file_path = $favicons_path . '/' . $filename;
						$file_url  = $favicons_url . '/' . $filename;

						$favicon = wp_get_image_editor( $favicon_dest_path );

						if ( ! is_wp_error( $favicon ) ) {
						    $favicon->resize( $size, $size, false );
						    $favicon->save( $file_path );

						    $favicon_html .= '<link rel="' . $link_rel . '"' . $attrs . ' sizes="' . $size_ind .'" href="' . $file_url . '" />' . "\n";
						}
					}
				}

				// Save new HTML and output it
				$mixtConfig->ReduxFramework->set('favicon-html', $favicon_html);

				echo $favicon_html;

			} else {

				// Get saved HTML and output it

				if ( array_key_exists('favicon-html', $mixt_opt) ) {
					$favicon_html = $mixt_opt['favicon-html'];

					if ( ! empty($favicon_html) ) {
						echo $favicon_html;
					}
				}
			}

		} else {
		// Server does NOT have image editing capabilities

			echo '<link rel="shortcut icon" href="' . $favicon_source_url . '" />';
		}
	}
}

// Add Favicons To Admin Area
add_action( 'admin_head', 'mixt_favicons' );
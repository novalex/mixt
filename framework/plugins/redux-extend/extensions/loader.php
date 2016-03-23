<?php

if ( ! function_exists('mixt_redux_extension_loader') ) {

	function mixt_redux_extension_loader( $ReduxFramework ) {
		$path    = dirname( __FILE__ ) . '/';
		$folders = scandir( $path, 1 );

		foreach ( $folders as $folder ) {
			if ( $folder === '.' or $folder === '..' or ! is_dir( $path . $folder ) ) { continue; }
			$extension_class = 'ReduxFramework_Extension_' . $folder;
			if ( ! class_exists( $extension_class ) ) {
				// In case you wanted override your override, hah.
				$class_file = $path . $folder . '/extension_' . $folder . '.php';
				$class_file = apply_filters( 'redux/extension/' . $ReduxFramework->args['opt_name'] . '/' . $folder, $class_file );
				if ( $class_file ) { require_once( $class_file ); }
			}
			if ( ! isset( $ReduxFramework->extensions[ $folder ] ) ) {
				$ReduxFramework->extensions[ $folder ] = new $extension_class( $ReduxFramework );
			}
		}

		// Load Demo Importer if the MIXT Core plugin is active
		if ( defined('MIXT_CORE_PLUGINS_DIR') ) {
			$extension_class = 'ReduxFramework_Extension_wbc_importer';
			include_once( MIXT_CORE_PLUGINS_DIR . '/mixt-demos/demos.php' );
			if ( ! isset( $ReduxFramework->extensions['wbc_importer'] ) ) {
				$ReduxFramework->extensions['wbc_importer'] = new $extension_class( $ReduxFramework );
			}
		}
	}
	add_action('redux/extensions/mixt_opt/before', 'mixt_redux_extension_loader', 0);
}

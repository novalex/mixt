<?php

/**
 * MIXT Power Up
 * 
 * Initialize and load framework plugins
 */
class Mixt_Powerup {

	/**
	 * Plugins to be activated
	 * @var array
	 */
	public $plugins = array();

	public function __construct() {
		$this->load_plugins();
	}

	/**
	 * Load plugins
	 */
	public function load_plugins() {
		global $mixt_opt;

		// MIXT Core
			$this->plugins[] = array(
				'name'     => 'MIXT Core',
				'slug'     => 'mixt-core',
				'source'   => 'mixt-core.zip',
				'required' => true,
				'force_deactivation' => true,
			);

		// Redux Framework and Extensions
			// Extension Loader
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/extensions/loader.php' );
			// Framework
			if ( ! class_exists( 'ReduxFramework' ) ) {
				$this->plugins[] = array(
					'name'     => 'Redux Framework',
					'slug'     => 'redux-framework',
					'required' => true,
				);
			}
			add_action( 'redux/page/mixt_opt/enqueue', array($this, 'redux_scripts'), 2 );
			// Config
			if ( ! isset( $mixt_opt ) ) {
				include_once( MIXT_FRAME_DIR . '/redux-config.php' );
			}

		// CMB2 Framework
			if ( empty($mixt_opt['page-metaboxes']) || $mixt_opt['page-metaboxes'] == 1 ) {
				$this->plugins[] = array(
					'name'     => 'CMB2',
					'slug'     => 'cmb2',
				);

				if ( defined('CMB2_LOADED') ) {
					include_once( MIXT_FRAME_DIR . '/cmb2-config.php' );

					// CMB2 Extensions
					include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/tab-field.php' );
					include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/slider-field.php' );
					include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/dimensions-field.php' );
					include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/post-search-field.php' );
				}
			}

		// MICF library & Config
			if ( file_exists( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' ) ) {
				require_once( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' );
			} else {
				$this->plugins[] = array(
					'name'     => 'Menu Item Custom Fields',
					'slug'     => 'menu-item-custom-fields',
					'required' => true,
				);
			}
			include_once( MIXT_FRAME_DIR . '/micf-config.php' );

		// TGM Plugin Activation
			require_once( MIXT_PLUGINS_DIR . '/tgmpa/class-tgm-plugin-activation.php' );
			add_filter('tgmpa_admin_menu_args', array($this, 'admin_menu_args'));
			add_action( 'tgmpa_register', array($this, 'init_tgmpa') );
	}

	/**
	 * Enqueue custom Redux Panel JS
	 */
	public function redux_scripts() {
		wp_enqueue_script( 'redux-mixt-js', MIXT_FRAME_URI . '/admin/js/redux-mixt.js', array( 'jquery' ), time(), 'all' );
	}

	/**
	 * TGM Plugin Activation
	 */
	public function init_tgmpa() {
		$tgmpa_msg = esc_html__( 'Install and activate the plugins to enable all the features that make MIXT awesome!', 'mixt' );
		$config = array(
			'id'           => 'mixt_tgmpa',         // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => MIXT_PLUGINS_DIR.'/', // Default absolute path to bundled plugins.
			'menu'         => 'mixt-powerup',       // Menu slug.
			'has_notices'  => true,                 // Show admin notices or not.
			'dismissable'  => true,                 // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                   // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => true,                 // Automatically activate plugins after installation or not.
			'message'      => $tgmpa_msg,           // Message to output right before the plugins table.
			'strings'      => array(
				'page_title'   => esc_html__( 'MIXT Power Up', 'mixt' ),
				'menu_title'   => esc_html__( 'MIXT - Power Up', 'mixt' ),
			),
			'function'     => array($this, 'plugins_page'),
		);
		tgmpa($this->plugins, $config);
	}

	/**
	 * Set custom page output callback
	 */
	public function admin_menu_args( $args ) {
		$args['function'] = array($this, 'plugins_page');

		return $args;
	}

	/**
	 * Output Plugins Page
	 */
	public function plugins_page() {
		$tgmpa = TGM_Plugin_Activation::get_instance();

		echo mixt_clean($tgmpa->install_plugins_page(), 'strip');

		?>

		<script type="text/javascript">
			// Install All Button
			( function($) {
				$(document).ready( function() {
					$('#pu-install-plugins').click( function(e) {
						e.preventDefault();
						$('#the-list .check-column input').click();
						$('#bulk-action-selector-top').val('tgmpa-bulk-install');
						$('#tgmpa-plugins').submit();
					});
					$('#pu-install-required').click( function(e) {
						e.preventDefault();
						$('input[value="mixt-core"], input[value="redux-framework"]').click();
						$('#bulk-action-selector-top').val('tgmpa-bulk-install');
						$('#tgmpa-plugins').submit();
					});
				});
			})(jQuery);
		</script>
		<?php
	}
}
new Mixt_Powerup;

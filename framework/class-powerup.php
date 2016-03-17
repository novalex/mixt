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
			);

		// MIXT CodeBuilder
			include_once( MIXT_PLUGINS_DIR . '/mixt-codebuilder/mixt-codebuilder.php' );

		// Redux Framework and Extensions
			// Extension Loader
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/extensions/loader.php' );
			// Framework
			if ( ! class_exists( 'ReduxFramework' ) ) {
				$this->plugins[] = array(
					'name'     => 'Redux Framework',
					'slug'     => 'redux-framework',
					'source'   => 'redux-framework.zip',
					'required' => true,
				);
			}
			add_action( 'redux/page/mixt_opt/enqueue', array($this, 'redux_scripts'), 2 );
			// Config
			if ( ! isset( $mixt_opt ) ) {
				include_once( MIXT_FRAME_DIR . '/redux-config.php' );
			}

		// CMB2 Framework
			if ( ( ! empty($mixt_opt['page-metaboxes']) && $mixt_opt['page-metaboxes'] == 1 ) ) {
				include_once( MIXT_FRAME_DIR . '/cmb2-config.php' );

				if ( ! file_exists( MIXT_PLUGINS_DIR . '/cmb2/init.php' ) ) {
					$this->plugins[] = array(
						'name'     => 'CMB2',
						'slug'     => 'cmb2',
						'required' => true,
					);
				} else {
					require_once( MIXT_PLUGINS_DIR . '/cmb2/init.php' );
				}

				// CMB2 Extensions
				include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/tab-field.php' );
				include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/slider-field.php' );
				include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/dimensions-field.php' );
				include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/post-search-field.php' );
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

		// WPBakery Visual Composer
			$this->plugins[] = array(
				'name'     => 'WPBakery Visual Composer',
				'slug'     => 'js_composer',
				'source'   => 'js_composer.zip',
				'version'  => '4.8.1',
				'force_deactivation' => true,
			);

		// LayerSlider
			$this->plugins[] = array(
				'name'     => 'LayerSlider WP',
				'slug'     => 'LayerSlider',
				'source'   => 'layerslider.zip',
				'version'  => '5.6.2',
				'force_deactivation' => true,
			);

		// Envato WordPress Toolkit
			$this->plugins[] = array(
				'name'     => 'Envato WordPress Toolkit',
				'slug'     => 'envato-wordpress-toolkit',
				'source'   => 'envato-wordpress-toolkit.zip',
				'version'  => '1.7.3',
			);

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
		$tgmpa_msg = esc_html__( 'Activate the plugins to enable all the features that make MIXT awesome!', 'mixt' );
		$config = array(
			'id'           => 'mixt_tgmpa',         // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => MIXT_PLUGINS_DIR.'/', // Default absolute path to bundled plugins.
			'menu'         => 'mixt-powerup',       // Menu slug.
			'has_notices'  => true,                 // Show admin notices or not.
			'dismissable'  => true,                 // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                   // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => false,                // Automatically activate plugins after installation or not.
			'message'      => $tgmpa_msg,           // Message to output right before the plugins table.
			'strings'      => array(
				'page_title'   => esc_html__( 'MIXT Power Up', 'mixt' ),
				'menu_title'   => esc_html__( 'MIXT Power Up', 'mixt' ),
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

		ob_start();

		$tgmpa->install_plugins_page();

		$markup = ob_get_clean();

		if ( empty($markup) ) return;

		$title = esc_html( get_admin_page_title() );
		$message = wp_kses_post($tgmpa->message);

		// Remove original header markup

		$markup = str_replace(
			array(
				'<div class="tgmpa wrap">',
				'<h3>' . $title . '</h3>',
				$message,

			),
			'', $markup);
		
		?>
		<div class="tgmpa wrap powerup-wrap about-wrap mixt-admin-wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<div class="about-text">
				<?php
				if ( ! empty( $tgmpa->message ) && is_string( $tgmpa->message ) ) {
					echo wp_kses_post( $tgmpa->message );
				}
				?>
				<p>
					<button id="pu-install-plugins" class="button-primary"><?php esc_html_e( 'Install All Plugins Now', 'mixt' ); ?></button>
				</p>
			</div>

			<div class="wp-badge powerup-badge"></div>

		<?php

		echo $markup;

		?>

		<script type="text/javascript">
			( function($) {
				$(document).ready( function() {

					// Power Up Install All
					$('#pu-install-plugins').click( function(e) {
						e.preventDefault();

						$('#the-list .check-column input').click();

						$('#bulk-action-selector-top').val('tgmpa-bulk-activate');

						$('#tgmpa-plugins').submit();
					});
				});
			})(jQuery);
		</script>
		<?php
	}
}
new Mixt_Powerup;

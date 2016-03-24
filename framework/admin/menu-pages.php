<?php

/**
 * Admin Menu Pages
 *
 * @package MIXT\Admin
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

class Mixt_Admin_Menu {

	/**
	 * Capability required to view the admin menus
	 * @var string
	 */
	public $capability = 'manage_options';

	/**
	 * Flag to display various elements for first-time activation or after update
	 * @var boolean
	 */
	public $welcome_mode = false;

	/** @var boolean */
	public $tgmpa_active = false;

	/**
	 * URLs for support, documentation, etc.
	 * @var array
	 */
	public $links = array(
		'main'    => 'mixt-admin',
		'plugins' => 'mixt-powerup',
		'status'  => 'mixt-status',
		'options' => 'mixt-options',

		'docs' => 'http://docs.mixt.novalx.com',
		'support' => 'https://novalex.ticksy.com',
		'forums' => 'https://novalex.ticksy.com/public-tickets/',
	);

	public function __construct() {
		if ( get_transient('_mixt_show_welcome') || ( ! empty($_GET['page']) && $_GET['page'] == 'mixt-welcome' ) ) {
			$this->welcome_mode = true;
			delete_transient('_mixt_show_welcome');

			// Add Welcome Page
			add_action('admin_menu', array($this, 'welcome_page'));
		}

		// Check if there are any plugins to install/activate
		add_action('tgmpa_register', array($this, 'check_tgmpa'), 999);
	}

	public function welcome_page() {
		// Welcome Page
		add_theme_page( esc_html__( 'Welcome!', 'mixt' ), esc_html__( 'MIXT - Welcome', 'mixt' ), $this->capability, 'mixt-welcome', array($this, 'welcome_screen'));
	}

	public function screen_header( $title, $description ) {
		?>
		<div class="wrap about-wrap mixt-admin-wrap">

			<h1><?php echo esc_html($title); ?></h1>
			<div class="about-text"><?php echo mixt_clean($description); ?></div>

			<div class="wp-badge mixt-badge">
				<span class="version"><?php printf( esc_html__( 'Version %s', 'mixt' ), MIXT_VERSION ); ?></span>
			</div>
		<?php
	}

	public function screen_footer() {
		?>
		</div>
		<?php
	}

	public function welcome_screen() {
		require_once( MIXT_FRAME_DIR . '/admin/views/welcome.php' );
	}

	public function about_screen() {
		require_once( MIXT_FRAME_DIR . '/admin/views/about.php' );
	}

	public function status_screen() {
		require_once( MIXT_FRAME_DIR . '/admin/views/status.php' );
	}

	public function tabs() {
		$selected = isset ( $_GET['page'] ) ? $_GET['page'] : 'mixt-admin';
		?>
		<h2 class="nav-tab-wrapper">
			<a class="nav-tab <?php echo ( $selected == 'mixt-admin' ) ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url( menu_page_url( $this->links['main'], false ) ); ?>">
				<?php esc_html_e( 'About', 'mixt' ); ?>
			</a>
			<a class="nav-tab <?php echo ( $selected == 'mixt-status' ) ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url( menu_page_url( $this->links['status'], false ) ); ?>">
				<?php esc_html_e( 'Status', 'mixt' ); ?>
			</a>
			<?php if ( $this->tgmpa_active ) { ?>
			<a class="nav-tab" href="<?php echo esc_url( menu_page_url( $this->links['plugins'], false ) ); ?>">
				<?php esc_html_e( 'Install Plugins', 'mixt' ); ?>
			</a>
			<?php } if ( class_exists('ReduxFramework') ) { ?>
			<a class="nav-tab" href="<?php echo esc_url( menu_page_url( $this->links['options'], false ) ); ?>">
				<?php esc_html_e( 'Options', 'mixt' ); ?>
			</a>
			<?php } ?>
		</h2>
		<?php
	}

	public function support_links() {
		$output = '';

		$output .= '<a href="' . esc_url( $this->links['docs'] ) . '" class="button button-white" target="_blank">' . esc_html__( 'Documentation', 'mixt' ) . '</a>&nbsp;';
		$output .= '<a href="' . esc_url( $this->links['support'] ) . '" class="button button-white" target="_blank">' . esc_html__( 'Support', 'mixt' ) . '</a>&nbsp;';
		$output .= '<a href="' . esc_url( $this->links['forums'] ) . '" class="button button-white" target="_blank">' . esc_html__( 'Forums', 'mixt' ) . '</a>&nbsp;';

		return $output;
	}

	public function check_tgmpa() {
		$tgmpa = TGM_Plugin_Activation::get_instance();
		$this->tgmpa_active = ( ! empty($tgmpa->plugins) );
	}
}

new Mixt_Admin_Menu;

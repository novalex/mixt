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
	public $help_links = array(
		'docs' => 'http://docs.mixt.novalx.com',
		'support' => 'https://novalex.ticksy.com',
		'forums' => 'https://novalex.ticksy.com/public-tickets/',
	);

	public function __construct() {
		if ( get_transient('_mixt_show_welcome') ) {
			$this->welcome_mode = true;
			delete_transient('_mixt_show_welcome');
		}

		// Add admin pages
		add_action('admin_menu', array($this, 'admin_menus'));

		// Check if there are any plugins to install/activate
		add_action('tgmpa_register', array($this, 'check_tgmpa'), 999);
	}

	public function admin_menus() {
		// Main Menu
		add_menu_page('MIXT', 'MIXT', $this->capability, 'mixt-admin', '', MIXT_URI . '/assets/img/admin-menu-icon.png', '59.6498');

		if ( $this->welcome_mode ) {
			// Welcome Page
			add_submenu_page('mixt-admin', esc_html__( 'Welcome!', 'mixt' ), esc_html__( 'Welcome', 'mixt' ), $this->capability, 'mixt-admin', array($this, 'welcome_screen'));
		} else {
			// About Page
			add_submenu_page('mixt-admin', esc_html__( 'About MIXT', 'mixt' ), esc_html__( 'About', 'mixt' ), $this->capability, 'mixt-admin', array($this, 'about_screen'));
		}

		// Status Page
		add_submenu_page('mixt-admin', esc_html__( 'Status', 'mixt' ), esc_html__( 'Status', 'mixt' ), $this->capability, 'mixt-status', array($this, 'status_screen'));
	}

	public function screen_header($title, $description) {
		?>
		<div class="wrap about-wrap mixt-admin-wrap">

			<h1><?php echo $title; ?></h1>
			<div class="about-text"><?php echo $description; ?></div>

			<div class="wp-badge mixt-badge">
				<span class="version"><?php printf( __( 'Version %s', 'mixt' ), MIXT_VERSION ); ?></span>
			</div>
		<?php
	}

	public function screen_footer() {
		?>
		</div>
		<?php
	}

	public function welcome_screen() {
		require_once('views/welcome.php');
	}

	public function about_screen() {
		require_once('views/about.php');
	}

	public function status_screen() {
		require_once('views/status.php');
	}

	public function tabs() {
		$selected = isset ( $_GET['page'] ) ? $_GET['page'] : 'mixt-admin';
		?>
		<h2 class="nav-tab-wrapper">
			<a class="nav-tab <?php echo $selected == 'mixt-admin' ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url( admin_url( add_query_arg(array('page' => 'mixt-admin'), 'admin.php') ) ); ?>">
				<?php echo ( $this->welcome_mode ) ? esc_attr__( 'Getting Started', 'mixt' ) : esc_attr__( 'About', 'mixt' ); ?>
			</a>
			<a class="nav-tab <?php echo $selected == 'mixt-status' ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url( admin_url( add_query_arg(array('page' => 'mixt-status'), 'admin.php') ) ); ?>">
				<?php esc_attr_e( 'Status', 'mixt' ); ?>
			</a>
			<?php if ( $this->tgmpa_active ) { ?>
			<a class="nav-tab" href="<?php echo esc_url( admin_url( add_query_arg(array('page' => 'mixt-plugins'), 'admin.php') ) ); ?>">
				<?php esc_attr_e( 'Install Plugins', 'mixt' ); ?>
			</a>
			<?php } ?>
			<a class="nav-tab" href="<?php echo esc_url( admin_url( add_query_arg(array('page' => 'mixt-options'), 'admin.php') ) ); ?>">
				<?php esc_attr_e( 'Options', 'mixt' ); ?>
			</a>
		</h2>
		<?php
	}

	public function support_links() {
		$output = '';

		$output .= "<a href='{$this->help_links['docs']}' class='button button-white' target='_blank'>" . esc_attr__( 'Documentation', 'mixt' ) . "</a>&nbsp;";
		$output .= "<a href='{$this->help_links['support']}' class='button button-white' target='_blank'>" . esc_attr__( 'Support', 'mixt' ) . "</a>&nbsp;";
		$output .= "<a href='{$this->help_links['forums']}' class='button button-white' target='_blank'>" . esc_attr__( 'Forums', 'mixt' ) . "</a>&nbsp;";

		return $output;
	}

	public function check_tgmpa() {
		$tgmpa = TGM_Plugin_Activation::get_instance();
		$this->tgmpa_active = ( ! empty($tgmpa->plugins) );
	}
}

new Mixt_Admin_Menu;

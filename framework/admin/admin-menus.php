<?php

/**
 * Custom Nav Menu Elements
 *
 * @package MIXT\Admin
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

if ( ! class_exists('Mixt_Nav_Meta') ) {

	/**
	 * Add custom metaboxes and post types for nav menus
	 */
	class Mixt_Nav_Meta {

		public function __construct() {
			add_action('admin_init', array($this, 'add_meta_boxes'));
			add_action('wp_update_nav_menu_item', array($this, 'update_nav_menu_items'), 99, 3);
		}

		public function add_meta_boxes() {
			add_meta_box('mixt_nav_meta', __( 'MIXT Elements', 'mixt' ), array( $this, 'nav_menu_items'), 'nav-menus', 'side', 'high');
		}

		public function update_nav_menu_items($menu_id, $menu_item_id, $args) {
			if ( ! empty($_POST['mixt-menu-item-type'][$menu_item_id]) ) {
				$type = explode('-', $_POST['mixt-menu-item-type'][$menu_item_id]);
				// Update Archive Page URL
				if ( $type[0] == 'archive' && ! empty($type[1]) ) {
					$url = esc_url_raw(get_post_type_archive_link($type[1]));
					update_post_meta($menu_item_id, '_menu_item_url', $url);
				}
			}
		}
		
		public function nav_menu_items() {

			global $mixt_opt;

			// Define Custom Menu Item Icons
			$cart_icon   = 'fa fa-shopping-cart';
			$search_icon = 'fa fa-search';
			?>

			<div id="posttype-mixt-elem" class="posttypediv">
				<ul id="posttype-page-tabs" class="posttype-tabs add-menu-item-tabs">
					<li class="tabs">
						<a class="nav-tab-link" data-type="tabs-panel-mixt-elems" href="#tabs-panel-mixt-elems">
							<?php _e('Elements', 'mixt'); ?>
						</a>
					</li>
					<li>
						<a class="nav-tab-link" data-type="tabs-panel-mixt-pages" href="#tabs-panel-mixt-pages">
							<?php _e('Pages', 'mixt'); ?>
						</a>
					</li>
					<li>
						<a class="nav-tab-link" data-type="tabs-panel-mixt-social" href="#tabs-panel-mixt-social">
							<?php _e('Social Icons', 'mixt'); ?>
						</a>
					</li>
				</ul>

				<div id="tabs-panel-mixt-elems" class="tabs-panel tabs-panel-active">
					<ul id="mixt-elems-checklist" class="categorychecklist form-no-clear">
						<?php // Divider ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php _e( 'Divider', 'mixt' ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Divider">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="divider">
							<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="divider">
						</li>
						<?php // Search Form Element ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php _e( 'Search Form', 'mixt' ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Search">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="nav-search">
							<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="search">
							<input type="hidden" class="mixt-menu-item-icon" name="menu-item[-1][mixt-menu-item-icon]" value="<?php echo $search_icon ?>">
						</li>
						<?php // Button ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php _e( 'Button', 'mixt' ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Button">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="btn btn-minimal">
							<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="button">
						</li>
						<?php // Widget Area ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php _e( 'Widget Area', 'mixt' ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Widget Area">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="widget-area">
							<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="widget">
						</li>
						<?php // WooCommerce Cart
							if ( class_exists( 'WooCommerce' ) ) { ?>
							<li>
								<label class="menu-item-title">
									<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php _e( 'Cart', 'mixt' ); ?>
								</label>
								<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
								<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Cart">
								<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
								<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="cart woo-cart">
								<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="cart">
								<input type="hidden" class="mixt-menu-item-icon" name="menu-item[-1][mixt-menu-item-icon]" value="<?php echo $cart_icon ?>">
							</li>
						<?php } ?>
					</ul>
				</div>

				<div id="tabs-panel-mixt-pages" class="tabs-panel tabs-panel-inactive">
					<ul id="mixt-pages-checklist" class="categorychecklist form-no-clear">
						<?php
							$post_types = array();
							$portfolio_type = get_post_type_object('portfolio');
							if ( ! is_null($portfolio_type) ) { $post_types[] = $portfolio_type; }

							if ( ! empty($post_types) ) {
								foreach ( $post_types as $post_type ) {
									if ( is_null($post_type) ) continue;
									?>
									<li>
										<label class="menu-item-title">
											<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1">
											<?php echo $post_type->labels->name . ' ' . __('Archive', 'mixt'); ?>
										</label>
										<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
										<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="<?php echo $post_type->labels->name; ?>">
										<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="<?php echo get_post_type_archive_link($post_type->name); ?>">
										<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="archive-<?php echo $post_type->name; ?>">
									</li>
									<?php
								}
							} else {
								echo '<li><label>' . __( 'No pages avaialble!', 'mixt' ) . '</label></li>';
							}
						?>
					</ul>
				</div>

				<div id="tabs-panel-mixt-social" class="tabs-panel tabs-panel-inactive">
					<ul id="mixt-social-checklist" class="categorychecklist form-no-clear">
						<?php
							$social_profiles = $mixt_opt['social-profiles'];

							if ( ! empty($social_profiles) ) {

								// Item For All Social Profiles
								if ( count($social_profiles) > 1 ) {
									?>
									<li>
										<label class="menu-item-title">
											<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php _e('All Icons', 'mixt'); ?>
										</label>
										<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
										<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="<?php _e('Social Icons', 'mixt'); ?>">
										<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="mixt-social-icons">
										<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="social-icons">
										<br><br>
									</li>
									<?php
								}

								// Item For Each Social Profile Set Up
								foreach( $social_profiles as $profile ) {
									$name  = ( ! empty($profile['name']) ) ? $profile['name'] : __( 'Unnamed Profile', 'mixt' );
									$url   = $profile['url'];
									$icon  = $profile['icon'];
									$title = $profile['title'];

									if ( $url == 'rss' ) {
										$url = get_bloginfo('rss2_url');
									}

									?>
									<li>
										<label class="menu-item-title">
											<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"> <?php echo $name; ?>
										</label>
										<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
										<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="<?php echo $name; ?>">
										<input type="hidden" class="menu-item-attr-title" name="menu-item[-1][menu-item-attr-title]" value="<?php echo $title; ?>">
										<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="<?php echo $url; ?>">
										<input type="hidden" class="mixt-menu-item-type" name="menu-item[-1][mixt-menu-item-type]" value="social-icon">
										<input type="hidden" class="mixt-menu-item-icon" name="menu-item[-1][mixt-menu-item-icon]" value="<?php echo $icon; ?>">
									</li>
									<?php
								}
							} else {
								echo '<li><label>' . __( 'No social profiles set up!', 'mixt' ) . '</label></li>';
							}
						?>
					</ul>
				</div>

				<p class="button-controls">
					<span class="add-to-menu">
						<input type="submit" class="button-secondary submit-add-to-menu right" value="Add to Menu" name="add-post-type-menu-item" id="submit-posttype-mixt-elem">
						<span class="spinner"></span>
					</span>
				</p>
			</div>
		<?php }
	}
}

new Mixt_Nav_Meta;

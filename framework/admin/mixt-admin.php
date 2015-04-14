<?php

/**
 * MIXT Admin Integration
 *
 * @package MIXT
 */


// CUSTOM MENU PAGE ELEMENTS

if ( ! class_exists('MIXT_Nav_Meta') ) {

	class MIXT_Nav_Meta {

		public function add_nav_menu_meta_boxes() {
			add_meta_box( 'mixt_nav_meta', __('MIXT Elements', 'mixt'), array( $this, 'nav_menu_link'), 'nav-menus', 'side', 'high' );
		}
		
		public function nav_menu_link() {

			global $mixt_opt; // todo: change to asset global ($mixt_assets?)

			// Define Custom Menu Item Icons
			$cart_icon   = 'icon-shopping';
			$search_icon = 'icon-search';
			?>

			<div id="posttype-mixt-elem" class="posttypediv">
				<ul id="posttype-page-tabs" class="posttype-tabs add-menu-item-tabs">
					<li class="tabs">
						<a class="nav-tab-link" data-type="tabs-panel-mixt-elems" href="#tabs-panel-mixt-elems">
							<?php printf( __('Elements', 'mixt') ); ?>
						</a>
					</li>
					<li>
						<a class="nav-tab-link" data-type="tabs-panel-mixt-social" href="#tabs-panel-mixt-social">
							<?php printf( __('Social Icons', 'mixt') ); ?>
						</a>
					</li>
				</ul>

				<div id="tabs-panel-mixt-elems" class="tabs-panel tabs-panel-active">
					<ul id="mixt-elems-checklist" class="categorychecklist form-no-clear">
						<?php // AJAX WooCommerce Cart
							if ( class_exists( 'WooCommerce' ) ) { ?>
							<li>
								<label class="menu-item-title">
									<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php printf( __('Cart', 'mixt') ); ?>
								</label>
								<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
								<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Cart">
								<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
								<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="cart woo-cart">
								<input type="hidden" class="menu-item-mixt-type" name="menu-item[-1][menu-item-mixt-type]" value="cart">
								<input type="hidden" class="menu-item-mixt-icon" name="menu-item[-1][menu-item-mixt-icon]" value="<?php echo $cart_icon ?>">
							</li>
						<?php } ?>
						<?php // Divider ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php printf( __('Divider', 'mixt') ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Divider">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="divider">
							<input type="hidden" class="menu-item-mixt-type" name="menu-item[-1][menu-item-mixt-type]" value="divider">
						</li>
						<?php // Search Form Element ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php printf( __('Search Form', 'mixt') ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Search">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="nav-search">
							<input type="hidden" class="menu-item-mixt-type" name="menu-item[-1][menu-item-mixt-type]" value="search">
							<input type="hidden" class="menu-item-mixt-icon" name="menu-item[-1][menu-item-mixt-icon]" value="<?php echo $search_icon ?>">
						</li>
						<?php // Button ?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php printf( __('Button', 'mixt') ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
							<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="Button">
							<input type="hidden" class="menu-item-url" name="menu-item[-1][menu-item-url]" value="#">
							<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="btn">
							<input type="hidden" class="menu-item-mixt-type" name="menu-item[-1][menu-item-mixt-type]" value="button">
						</li>
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
											<input type="checkbox" class="menu-item-checkbox" name="menu-item[-1][menu-item-object-id]" value="-1"><?php printf( __('All Icons', 'mixt') ); ?>
										</label>
										<input type="hidden" class="menu-item-type" name="menu-item[-1][menu-item-type]" value="custom">
										<input type="hidden" class="menu-item-title" name="menu-item[-1][menu-item-title]" value="<?php printf( __('Social Icons', 'mixt') ); ?>">
										<input type="hidden" class="menu-item-classes" name="menu-item[-1][menu-item-classes]" value="mixt-social-icons">
										<input type="hidden" class="menu-item-mixt-type" name="menu-item[-1][menu-item-mixt-type]" value="social-icons">
										<br><br>
									</li>
									<?php
								}

								// Item For Each Social Profile Set Up
								foreach( $social_profiles as $profile ) {
									$name  = ( ! empty($profile['name']) ) ? $profile['name'] : 'No Name';
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
										<input type="hidden" class="menu-item-mixt-type" name="menu-item[-1][menu-item-mixt-type]" value="social-icon">
										<input type="hidden" class="menu-item-mixt-icon" name="menu-item[-1][menu-item-mixt-icon]" value="<?php echo $icon; ?>">
									</li>
									<?php
								}
							} else {
								echo '<li><label>' . __( 'No social profiles set up!', 'mixt' ) . '</lable></li>';
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

$mixt_nav_meta = new MIXT_Nav_Meta;

add_action('admin_init', array($mixt_nav_meta, 'add_nav_menu_meta_boxes'));


// CUSTOM MEDIA META FIELDS

if ( ! class_exists('MIXT_Media_Meta')) {

	class MIXT_Media_Meta {
	
		private $media_fields = array();
	
		function __construct( $fields ) {
			$this->media_fields = $fields;
		
			add_filter( 'attachment_fields_to_edit', array( $this, 'applyFilter' ), 11, 2 );
			add_filter( 'attachment_fields_to_save', array( $this, 'saveFields' ), 11, 2 );
		}
	
		public function applyFilter( $form_fields, $post = null ) {
			if ( ! empty( $this->media_fields ) ) {
				foreach ( $this->media_fields as $field => $values ) {
					if ( preg_match( '/' . $values['application'] . '/', $post->post_mime_type) && ! in_array( $post->post_mime_type, $values['exclusions'] ) ) {
						$meta = get_post_meta( $post->ID, '_' . $field, true );
		
						switch ( $values['input'] ) {
							default:
							case 'text':
								$values['input'] = 'text';
								break;
							case 'textarea':
								$values['input'] = 'textarea';
								break;
							case 'select':
								$values['input'] = 'html';
								$html = '<select class="widefat" name="attachments['. $post->ID .']['. $field .']">';
								if ( isset( $values['options'] ) ) {
									foreach ( $values['options'] as $k => $v ) {
										$selected = ( $meta == $k ) ? ' selected="selected"' : '';
										$html .= '<option' . $selected . ' value="' . $k . '">' . $v . '</option>';
									}
								}
								$html .= '</select>';
								$values['html'] = $html;
								break;
						}
						$values['value'] = $meta;
						$form_fields[$field] = $values;
					}
				}
			}
			return $form_fields;
		}
	
		function saveFields( $post, $attachment ) {
			if ( ! empty( $this->media_fields ) ) {
				foreach ( $this->media_fields as $field => $values ) {
					if ( isset( $attachment[$field] ) ) {
						if ( strlen( trim( $attachment[$field] ) ) == 0 ) {
							$post['errors'][$field]['errors'][] = __( $values['error_text'] );
						} else {
							update_post_meta( $post['ID'], '_' . $field, $attachment[$field] );
						}
					}
					else {
						delete_post_meta( $post['ID'], $field );
					}
				}
			}
		
			return $post;
		}
	
	}

	$media_meta_options = array(
		'image_color' => array(
			'label'   => __('Image Color', 'mixt'),
			'input'   => 'select',
			'options' => array(
				'none'  => '-',
				'light' => __('Light', 'mixt'),
				'dark'  => __('Dark', 'mixt'),
			),
			'application' => 'image',
			'exclusions'  => array('audio', 'video'),
		)
	);
}

$mixt_media_meta = new MIXT_Media_Meta( $media_meta_options );


// Calculate Image Predominant Color After Upload And Set Meta

add_action( 'add_attachment', 'mixt_media_upload' );
function mixt_media_upload($id) {
	if ( wp_attachment_is_image($id) && file_exists( MIXT_FRAME_DIR . '/libs/color-manipulation.php') ) {
		require_once( MIXT_FRAME_DIR . '/libs/color-manipulation.php' );

		$src = wp_get_attachment_image_src( $id, 'full' );

		$img_lum = get_avg_luminance( $src[0] );
		$img_lum_val = 'none';

		if ( $img_lum < 170 ) {
			$img_lum_val = 'dark';
		} else if ( $img_lum > 170 ) {
			$img_lum_val = 'light';
		}

		update_post_meta( $id, '_' . 'image_color', $img_lum_val );
	}
}
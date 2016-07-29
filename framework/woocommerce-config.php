<?php

/**
 * WooCommerce config and extend
 *
 * @package MIXT
 */

// Declare WooCommerce Support
add_theme_support('woocommerce');


/**
 * Add "woocommerce" class to content
 */
function mixt_wc_wrap_class($classes) {
	if ( is_woocommerce() || is_cart() || is_checkout() || is_account_page() ) {
		$classes[] = 'woocommerce';
	}
	return $classes;
}
add_filter('mixt_content_wrap_class', 'mixt_wc_wrap_class');


/**
 * Display custom WC title on shop page
 */
function mixt_wc_title($title) {
	if ( is_shop() ) {
		return woocommerce_page_title(false);
	} else {
		return $title;
	}
}
add_filter('mixt_title', 'mixt_wc_title');


// Add default options
$options = array(
	// Catalog
	'cols'          => 3,
	'product-count' => false,
	'per-page'      => 15,
	'page-select'   => true,
	'orderby'       => true,
	'thumb'         => true,
	'price'         => true,
	'rating'        => true,
	'cats'          => false,
	'stock'         => false,
	'add-to-cart'   => true,
	'sale-badge'    => true,
	'new-badge'     => false,
	'new-days'      => 30,

	// Single Product
	'single-thumb'        => true,
	'single-thumb-cols'   => 4,
	'sharing'             => false,
	'upsells'             => true,
	'upsell-cols'         => 3,
	'single-related'      => true,
	'single-related-nr'   => 4,
	'single-related-cols' => 4,
);
add_option('mixt-wc-options', $options);


/**
 * Return shop option
 * @param string $option
 * @param mixed  $default
 */
function mixt_wc_option($option, $default = false) {
	global $mixt_opt;

	if ( empty($mixt_opt) ) return;

	if ( array_key_exists("wc-$option", $mixt_opt) ) {
		return $mixt_opt["wc-$option"];
	} else {
		$options = get_option('mixt-wc-options');
		return isset($options[$option]) ? $options[$option] : $default;
	}
}


// APPLY OPTIONS

// Columns / Products per row
function mixt_wc_cols() {
	return mixt_wc_option('cols');
}
add_filter('loop_shop_columns', 'mixt_wc_cols', 999);

// Product Count
if ( ! mixt_wc_option('product-count') ) remove_action('woocommerce_before_shop_loop', 'woocommerce_result_count', 20);

// Products Per Page
function mixt_wc_per_page() {
	if ( isset($_GET['per_page']) ) {
		return wc_clean($_GET['per_page']);
	} else {
		return mixt_wc_option('per-page');
	}
}
add_filter('loop_shop_per_page', 'mixt_wc_per_page', 20);

// Price
if ( ! mixt_wc_option('price') ) remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);

// Add to cart
if ( ! mixt_wc_option('add-to-cart') ) remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);

// Categories
if ( mixt_wc_option('cats') ) add_action('woocommerce_after_shop_loop_item', 'mixt_wc_product_cats', 11);

// Thumbnail Columns
function mixt_wc_thumb_cols() {
	return mixt_wc_option('single-thumb-cols', 4);
}
add_filter ('woocommerce_product_thumbnails_columns', 'mixt_wc_thumb_cols');

// Replace Lightbox
if ( get_option('woocommerce_enable_lightbox', 'yes') == 'yes' ) {
	function mixt_wc_lightbox() {
		// Remove WC's PrettyPhoto
		wp_dequeue_style('woocommerce_prettyPhoto_css');
		wp_dequeue_script('prettyPhoto');
		wp_dequeue_script('prettyPhoto-init');
		// Enqueue LightGallery
		if ( is_product() ) {
			mixt_enqueue_plugin('lightgallery');
		}
	}
	add_action('wp_enqueue_scripts', 'mixt_wc_lightbox', 100);
}


/**
 * Append hidden input for each GET param
 * @param string $current_param the current param, do not append an input for it
 */
function mixt_wc_query_params($current_param) {
	foreach ( $_GET as $param => $val ) {
		if ( $param == $current_param || $param == 'submit' ) continue;
		if ( is_array($val) ) {
			foreach( $val as $inner_val ) {
				echo '<input type="hidden" name="' . esc_attr($param) . '[]" value="' . esc_attr($inner_val) . '" />';
			}
		} else {
			echo '<input type="hidden" name="' . esc_attr($param) . '" value="' . esc_attr($val) . '" />';
		}
	}
}


/**
 * Return product badge HTML
 * @return string
 */
function mixt_wc_badges() {
	$badges = '';
	// Sale Badge
	if ( mixt_wc_option('sale-badge') ) {
		global $post, $product;
		if ( $product->is_on_sale() ) {
			$badges .= apply_filters( 'woocommerce_sale_flash', '<span class="badge sale-badge">' . mixt_wc_option('sale-badge-text') . '</span>', $post, $product );
		}
	}
	// New Badge
	if ( mixt_wc_option('new-badge') ) {
		$date = get_the_time( 'Y-m-d' );
		$datestamp = strtotime($date);
		$new_days = mixt_wc_option('new-days', 30);
		if ( ( time() - ( 86400 * $new_days ) ) < $datestamp ) {
			$badges .= '<span class="badge new-badge">' . mixt_wc_option('new-badge-text') . '</span>';
		}
	}

	if ( $badges != '' ) {
		echo '<div class="badge-cont">' . $badges . '</div>';
	}
}


/**
 * Display product thumbnail and badges
 */
function mixt_wc_product_thumb() {
	echo '<div class="thumb-cont">';

		// Thumnail Image
		if ( mixt_wc_option('thumb') ) {
			$style = mixt_wc_option('thumb-style', '');
			if ( preg_match('/image-border|image-outline/', $style) ) $style .= ' ' . mixt_wc_option('thumb-border', 'accent');

			echo "<div class='mixt-image'><div class='image-wrap $style'>";
				echo woocommerce_get_product_thumbnail();
			echo '</div></div>';
		}

		// Badges
		mixt_wc_badges();

	echo "</div>";
}


/**
 * Display product title and rating (in the loop)
 */
function mixt_wc_loop_item_title() {
	?>
	<div class="title">
		<h3><?php the_title(); ?></h3>

		<?php
		if ( mixt_wc_option('rating') && get_option( 'woocommerce_enable_review_rating' ) !== 'no' ) {
			global $product;
			if ( $rating_html = $product->get_rating_html() ) {
				echo "<div class='rating-cont'>$rating_html</div>";
			}
		}
		?>
	</div>
	<?php
}


/**
 * Display product categories
 */
function mixt_wc_product_cats() {
	if ( is_shop() ) {
		global $post;
		$cat_list = get_the_term_list($post->ID, 'product_cat', '<small class="hover-accent-color">', '</small>, <small class="hover-accent-color">', '</small>');
		echo "<div class='product-cats'>$cat_list</div>";
	}
}


/**
 * Display the product's stock
 */
function mixt_wc_product_stock() {
	if ( is_shop() ) {
		global $product;
		$stock = $product->get_total_stock();
		if ( ! $product->is_in_stock() ) {
			echo '<span class="stock out-of-stock">' . esc_html__( 'Out of stock', 'woocommerce' ) . '</span>';
		} else if ( $stock > 1 ) {
			echo '<span class="stock in-stock">' . $stock . esc_html__( ' In stock', 'woocommerce' ) . '</span>';
		}
	}
}


// Remove default actions that get customized
remove_action('woocommerce_before_main_content','woocommerce_breadcrumb', 20, 0);

remove_action('woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10);
add_action('woocommerce_shop_loop_item_title', 'mixt_wc_loop_item_title', 10);

remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);
remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10);
remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5);

remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10);
if ( ! mixt_wc_option('single-thumb') ) remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20 );

// Hook custom actions
add_action('woocommerce_before_shop_loop_item_title', 'mixt_wc_product_thumb', 10);


// Hide single product title if location bar is enabled
function mixt_single_title_display() {
	$head_opt = Mixt_Options::get('header');
	if ( $head_opt['location-bar'] && ( $head_opt['loc-bar-left-content'] == 1 || $head_opt['loc-bar-right-content'] == 1 ) ) {
		remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_title', 5);
	}
}
add_action('mixt_options_set', 'mixt_single_title_display');


// Show sharing buttons
if ( mixt_wc_option('sharing') ) {
	function mixt_wc_sharing() {
		$profiles = array();
		$sel_profiles = mixt_wc_option('sharing-profiles');
		if ( ! empty($sel_profiles) ) {
			global $mixt_opt;
			$set_profiles = get_option('mixt-sharing-profiles', mixt_preset_social_profiles('sharing'));
			foreach ( $set_profiles as $key => $profile ) {
				if ( ! empty($sel_profiles[$key]) ) $profiles[$key] = $profile;
			}
		}

		$icons = mixt_social_profiles(false, array(
			'type'     => 'sharing',
			'style'    => 'group',
			'profiles' => $profiles,
			'class'    => 'product-share btn-group-justified',
		));
		if ( $icons != '' ) {
			echo '<div class="product-share-cont">' .$icons . '</div>';
		}
	}
	add_action('woocommerce_share', 'mixt_wc_sharing');
}


// Override default stylesheets
function mixt_wc_styles($styles) {
	// unset($styles['woocommerce-general']);
	unset($styles['woocommerce-layout']);
	unset($styles['woocommerce-smallscreen']);
	return $styles;
}
add_filter('woocommerce_enqueue_styles', 'mixt_wc_styles');

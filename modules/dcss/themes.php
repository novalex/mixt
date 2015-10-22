<?php

// Color manipulation class
use Mexitek\PHPColors\Color;


/**
 * Main theme class. Generates CSS for user created themes.
 */
class Mixt_Themes extends Mixt_DCSS {

	/**
	 * @var bool  $themes_enabled
	 * @var array $active_themes
	 * @var array $default_themes
	 * @var array $site_themes
	 * @var array $themes
	 */
	public $themes_enabled, $active_themes, $default_themes, $site_themes, $themes;

	public function __construct() {
		$this->themes_enabled = (bool) get_option('mixt-themes-enabled');
		if ( $this->themes_enabled ) {
			$this->active_themes = mixt_get_options( array(
				'site'    => array( 'key' => 'site-theme', 'type' => 'str', 'return' => 'value', 'default' => MIXT_THEME ),
				'nav'     => array( 'key' => 'nav-theme', 'type' => 'str', 'return' => 'value', 'default' => 'auto' ),
				'sec-nav' => array( 'key' => 'sec-nav-theme', 'type' => 'str', 'return' => 'value', 'default' => 'auto' ),
				'footer'  => array( 'key' => 'footer-theme', 'type' => 'str', 'return' => 'value', 'default' => 'auto' ),
			) );
			$this->default_themes = mixt_get_themes('default');
			$this->site_themes = array_merge( $this->default_themes, get_option('mixt-site-themes', array()) );
			$this->nav_themes = array_merge( $this->default_themes, get_option('mixt-nav-themes', array()) );
		}
	}

	/**
	 * Output site-wide theme
	 */
	public function output_site() {
		// Do nothing if themes are disabled
		if ( ! $this->themes_enabled ) return;

		$themes = array( $this->active_themes['site']);
		if ( $this->active_themes['footer'] != $this->active_themes['site'] ) $themes[] = $this->active_themes['footer'];

		foreach ( $themes as $theme_id ) {
			// Do not output theme if it's one of the defaults or undefined
			if ( ! array_key_exists($theme_id, $this->site_themes) || array_key_exists($theme_id, $this->default_themes) ) continue;

			$theme = $this->site_themes[$theme_id];

			if ( ! is_array($theme) ) continue;

			$theme_name = ( ! empty($theme['name']) ) ? $theme['name'] : $theme_id;

			$th = ".theme-$theme_id";
			$body_th = ".body-theme-$theme_id";

			$defaults = array(
				'accent'    => '#dd3e3e',
				'bg'        => '#fff',
				'color'     => '#333',
				'color-inv' => '#fff',
				'border'    => '#ddd',
			);

			$accent    = ! empty($theme['accent']) ? $theme['accent'] : $defaults['accent'];
			$accent_ob = new Color($accent);

			$bg         = ! empty($theme['bg']) ? $theme['bg'] : $defaults['bg'];
			$bg_ob      = new Color($bg);
			$bg_darker  = '#'.$bg_ob->darken(3);
			$bg_lighter = '#'.$bg_ob->lighten(3);

			$color      = ! empty($theme['color']) ? $theme['color'] : $defaults['color'];
			$color_ob   = new Color($color);
			$color_fade = ! empty($theme['color-fade']) ? $theme['color-fade'] : '#'.$color_ob->lighten(20);

			$color_inv      = ! empty($theme['color-inv']) ? $theme['color-inv'] : $defaults['color-inv'];
			$color_inv_ob   = new Color($color_inv);
			$color_inv_fade = ! empty($theme['color-inv-fade']) ? $theme['color-inv-fade'] : '#'.$color_inv_ob->darken(40);

			$border    = ! empty($theme['border']) ? $theme['border'] : $defaults['border'];
			$border_ob = new Color($border);

			$bg_dark = ! empty($theme['bg-dark']) ? true : false;

			if ( $bg_dark ) {
				$bg_light_color = $color_inv;
				$bg_light_color_fade = $color_inv_fade;

				$bg_dark_color = $color;
				$bg_dark_color_fade = $color_fade;
			} else {
				$bg_light_color = $color;
				$bg_light_color_fade = $color_fade;

				$bg_dark_color = $color_inv;
				$bg_dark_color_fade = $color_inv_fade;
			}

			$bg_alt     = ! empty($theme['bg-alt']) ? $theme['bg-alt'] : $bg_darker;
			$color_alt  = ! empty($theme['color-alt']) ? $theme['color-alt'] : $this->set_color_for_bg($bg_alt, array($bg_light_color, $bg_dark_color));
			$border_alt = ! empty($theme['border-alt']) ? $theme['border-alt'] : $border;

			$bg_inv     = ! empty($theme['bg-inv']) ? $theme['bg-inv'] : $this->invert($bg);
			$bg_inv_ob  = new Color($bg_inv);
			$border_inv = ! empty($theme['border-inv']) ? $theme['border-inv'] : '#'.$bg_inv_ob->darken(10);

			$accent_darker = '#'.$accent_ob->darken(10);
			$color_for_accent = $this->set_color_for_bg($accent);
			$textsh_for_accent = $this->set_textsh_for_bg($accent);

			// START CSS RULES
			
			echo "/* $theme_name Site Theme */\n";
				
			// Main Background Color
			
			echo "$th { background-color: $bg; }\n";

			// Helper Classes
			
			echo "$th .theme-bg { background-color: $bg; }\n";

			echo "$th .theme-color { color: $color; }\n";
			echo "$th .theme-color-fade { color: $color_fade; }\n";
			echo "$th .theme-color-inv { color: $color_inv; }\n";
			echo "$th .theme-color-inv-fade { color: $color_inv_fade; }\n";

			echo "$th .theme-bg-light-color { color: $bg_light_color; }\n";
			echo "$th .theme-bg-light-color-fade { color: $bg_light_color_fade; }\n";
			echo "$th .theme-bg-dark-color { color: $bg_dark_color; }\n";
			echo "$th .theme-bg-dark-color-fade { color: $bg_dark_color_fade; }\n";

			echo "$th .accent-color { color: $accent; }\n";
			echo "$th .accent-bg, $th .theme-section-accent { color: $color_for_accent; background-color: $accent; }\n";

			echo "$th .theme-bd { border-color: $border; }\n";
			echo "$th .theme-accent-bd { border-color: $accent; }\n";

			// Theme Section Colors
			
			echo "$th .theme-section-main { color: $color; background-color: $bg; border-color: $border; }\n";
			echo "$th .theme-section-alt { color: $color_alt; border-color: $border_alt; background-color: $bg_alt; }\n";
			echo "$th .theme-section-accent { border-color: $accent_darker; }\n";
			echo "$th .theme-section-inv { color: $color_inv; border-color: $border_inv; background-color: $bg_inv; }\n";

			// Text Colors
			
			echo "$th, $th #content-wrap { color: $color; }\n";
			echo "$th a, $th .post-meta a:hover, $th #breadcrumbs a:hover, $th .pager a:hover, $th .pager li > span, $th .hover-accent-color:hover { color: $accent; }\n";
			echo "$th .post-meta a, $th .post-meta > span { color: $color_fade; }\n";
			echo "$th .head-media.bg-light .container, $th .head-media.bg-light .media-inner > a, $th .head-media.bg-light .header-scroll, $th .head-media.bg-light #breadcrumbs > li + li:before { color: $bg_light_color; }\n";
			echo "$th .head-media.bg-dark .container, $th .head-media.bg-dark .media-inner > a, $th .head-media.bg-dark .header-scroll, $th .head-media.bg-dark #breadcrumbs > li + li:before { color: $bg_dark_color; }\n";
			echo "$th .post-related.related-media .related-content { color: $bg_dark_color; }\n";
			echo "$th .link-list li a { color: $color_fade; }\n";
			echo "$th .link-list li a:hover, $th .link-list li a:active, $th .link-list li.active > a { color: $accent; }\n";

			// Border Colors
			
			echo "$th, $th #content-wrap, $th .sidebar ul, $th .post-feat.feat-format, $th .wp-caption, $th hr { border-color: $border; }\n";
			echo "$th .comment-list .bypostauthor > .comment-cont { border-left-color: $accent; }\n";


			// Background Colors
			
			echo "$th .accent-bg:hover, $th .hover-accent-bg:hover, $th .tag-list a:hover, $th .tagcloud a:hover { color: $color_for_accent !important; background-color: $accent; }\n";
			echo "$th .article .post-info .post-date { background-color: $bg_darker; }\n";

			// Other Colors
			
			echo "$th ::selection { opacity: 0.8; background: $accent; color: $color_for_accent; }\n";

			echo "$th blockquote { border-color: $border; border-left-color: $accent; background-color: $bg_darker; }\n";
			echo "$th blockquote cite { color: $color_fade; }\n";

			echo "$th .sidebar .child-page-nav li a:hover, $th .widget-area .nav li a:hover { color: $accent; }\n";
			echo "$th .sidebar .child-page-nav .current_page_item, $th .sidebar .child-page-nav .current_page_item:before { background-color: $bg_darker; }\n";

			// Bootstrap Elements

			echo "$th .alert-default { color: $color; border-color: $border; background-color: $bg_darker; }\n";
			echo "$th .alert-default a { color: $accent; }\n";
			echo "$th .panel { border-color: $border; background-color: $bg_lighter; }\n";
			echo "$th .well { border-color: $border; background-color: $bg_darker; }\n";

			// Background Variants
			
			echo "$th .bg-light { color: $bg_light_color; } $th .bg-light .text-fade { color: $bg_light_color_fade; }\n";
			echo "$th .bg-dark { color: $bg_dark_color; } $th .bg-dark .text-fade { color: $bg_dark_color_fade; }\n";

			// Inputs
			
			echo "$th input:not([type=submit]):not([type=button]):not(.btn), $th select, $th textarea, $th .form-control, " .
				 "$th .post-password-form input[type='password'], $th .woocommerce .input-text { color: $color; border-color: $border; background-color: $bg_darker; }\n";
			echo "$th input:not([type=submit]):not([type=button]):not(.btn):focus, $th select:focus, $th textarea:focus, $th .form-control:focus, " .
				 "$th .post-password-form input[type='password']:focus, $th .woocommerce .input-text:focus { border-color: #".$border_ob->lighten(2)."; background-color: #".$bg_ob->lighten(2)."; }\n";
			echo "$th input::-webkit-input-placeholder,$th .form-control::-webkit-input-placeholder { color: $color_fade; }\n";
			echo "$th input::-moz-placeholder, $th .form-control::-moz-placeholder { color: $color_fade; }\n";
			echo "$th input:-ms-input-placeholder, $th .form-control:-ms-input-placeholder { color: $color_fade; }\n";
			if ( $bg_dark ) {
				echo "$th select, .mixt $th .select2-container .select2-arrow b:after { background-image: url(" . MIXT_URI . "/assets/img/icons/select-arrow-light.png); }\n";
			}

			// Buttons
			
			echo $this->button_color(array('primary', 'accent'), $accent, $th);
			echo $this->button_color('minimal', $bg_darker, $th);

			// Element Colors
			
			echo "$th .mixt-stat.type-box, $th .mixt-headline span.color-auto:after, $th .mixt-timeline .timeline-block:before { border-color: $border; }\n";
			echo "$th .mixt-row-separator.no-fill svg { fill: $bg; }\n";
			echo "$th .mixt-map { color: $bg_light_color; }\n";
			echo "$th .mixt-flipcard > .inner > .accent { color: $color_for_accent; background-color: $accent; border-color: $accent_darker; }\n";
			echo "$th .mixt-pricing.accent .mixt-pricing-inner .header { color: $color_for_accent; background-color: $accent; box-shadow: 0 0 0 1px $accent_darker; text-shadow: 0 1px 1px $textsh_for_accent; }\n";
			// Accent Color Variants
			echo "$th .mixt-icon i.accent, " .
				 "$th .mixt-stat.color-outline.accent { color: $accent; }\n";
			// Accent Border Variants
			echo "$th .mixt-icon.icon-outline.accent, " .
				 "$th .mixt-stat.color-outline.accent, " .
				 "$th .mixt-iconbox .inner.bordered.accent, " .
				 "$th .mixt-image .image-wrap.accent { border-color: $accent; }\n";
			// Accent Bg Variants
			echo "$th .mixt-stat.color-bg.accent, " .
				 "$th .mixt-icon.icon-solid.accent, " .
				 "$th .mixt-iconbox .inner.solid.accent, " .
				 "$th .mixt-review.boxed.accent, " .
				 "$th .mixt-review.bubble .review-content.accent, " .
				 "$th .mixt-review.bubble .review-content.accent:before, " .
				 "$th .mixt-timeline .timeline-block .content.boxed.accent, " .
				 "$th .mixt-timeline .timeline-block .content.bubble.accent, " .
				 "$th .mixt-timeline .timeline-block .content.bubble.accent:before, " .
				 "$th .hover-content .on-hover.accent { color: $color_for_accent; border-color: $accent_darker; background-color: $accent; text-shadow: 0 1px 1px $textsh_for_accent; }\n";
			echo "$th .mixt-icon.icon-solid.accent.anim-invert:hover, $th .icon-cont:hover .mixt-icon.icon-solid.accent.anim-invert { color: $accent; border-color: $accent_darker; background-color: $color_for_accent; text-shadow: 0 1px 1px ".$this->set_textsh_for_bg($color_for_accent)."; }\n";
			echo "$th .hover-content .on-hover.accent { background-color: ".$this->hex2rgba($accent, 0.75)."; }\n";

			// Plugin Colors

			// LightSlider
			echo "$th .lSSlideOuter .lSPager.lSpg > li a { background-color: $color_fade; }\n";
			echo "$th .lSSlideOuter .lSPager.lSpg > li:hover a, $th .lSSlideOuter .lSPager.lSpg > li.active a { background-color: $accent; }\n";

			// LightGallery
			echo "$body_th .lg-outer .lg-thumb-item.active, $body_th .lg-outer .lg-thumb-item:hover { border-color: $accent; }\n";
			echo "$body_th .lg-progress-bar .lg-progress { background-color: $accent; }\n";

			// Select2
			echo "$body_th .select2-container a.select2-choice, $body_th .select2-drop, $body_th .select2-drop.select2-drop-active { color: $color; border-color: $border; background-color: $bg_darker; }\n";
			echo "$body_th .select2-results { background-color: $bg_darker; }\n";
			echo "$body_th .select2-results .select2-highlighted { color: $color; background-color: $bg_lighter; }\n";

			// Visual Composer
			if ( defined( 'WPB_VC_VERSION') ) {
				echo "$th .wpb_content_element .wpb_tour_tabs_wrapper .wpb_tabs_nav a:hover, $th .wpb_content_element .wpb_accordion_header a:hover { color: $accent; }\n";
				echo "$th .vc_separator.theme-bd .vc_sep_holder .vc_sep_line { border-color: $border; }\n";
				echo "$th .mixt-grid-item .gitem-title-cont { color: $color; background-color: $bg_lighter; }\n";
				echo "$th .vc_tta.vc_tta-style-classic:not(.vc_tta-o-no-fill) .vc_tta-panel-body, $th .vc_tta.vc_tta-style-modern:not(.vc_tta-o-no-fill) .vc_tta-panel-body { color: $bg_light_color; }\n";
			}

			// WooCommerce
			if ( class_exists('WooCommerce') ) {
				echo "$th .woocommerce .price .amount, $th .woocommerce .total .amount, $th .woocommerce .woo-cart .amount, $th .woocommerce .nav li .amount { color: $accent; }\n";
				echo "$th .woocommerce .nav li del .amount, $th .woocommerce #reviews #comments ol.commentlist li .meta { color: $color_fade; }\n";
				echo "$th .woocommerce .widget_price_filter .ui-slider .ui-slider-range { background-color: $accent; }\n";
				echo "$th .woocommerce .badge-cont .badge.sale-badge { color: $color_for_accent; background-color: $accent; }\n";
				echo "$th .woocommerce .woocommerce-tabs ul.tabs li a { color: $color_fade !important; }\n";
				echo "$th .woocommerce .woocommerce-tabs ul.tabs li.active { border-bottom-color: $bg !important; }\n";
				echo "$th .woocommerce .woocommerce-tabs ul.tabs li.active a { color: $color !important; }\n";
				echo "$th .woocommerce .woocommerce-tabs ul.tabs li.active, $th .woocommerce .woocommerce-tabs .wc-tab { color: $color !important; background-color: $bg !important; }\n";
				echo "$th .woocommerce table.shop_table, $th .woocommerce table.shop_table th, $th .woocommerce table.shop_table td, " .
					 "$th .woocommerce .cart-collaterals .cart_totals tr td, $th .woocommerce .cart-collaterals .cart_totals tr th { border-color: $border !important; }\n";
				echo "$th .woocommerce-checkout #payment, ".
					 "$th .woocommerce form .form-row.woocommerce-validated .select2-choice, $th .woocommerce form .form-row.woocommerce-validated input.input-text, $th .woocommerce form .form-row.woocommerce-validated select, ".
					 "$th .woocommerce form .form-row.woocommerce-invalid .select2-choice, $th .woocommerce form .form-row.woocommerce-invalid input.input-text, $th .woocommerce form .form-row.woocommerce-invalid select { border-color: $border; }\n";
			}
		}
	}

	/**
	 * Output navbar theme
	 */
	public function output_navbar() {
		// Do nothing if themes are disabled
		if ( ! $this->themes_enabled ) return;

		$options = mixt_get_options( array(
			'nav-opacity' => array( 'type' => 'str', 'return' => 'value', 'default' => '0.95' ),
			'second-nav' => array(),
		) );

		$themes = array($this->active_themes['nav']);
		// Add second nav theme to list of themes to output if it is different than the main nav theme
		if ( $this->active_themes['sec-nav'] != $this->active_themes['nav'] && $options['second-nav'] ) {
			$themes[] = $this->active_themes['sec-nav'];
		}

		$defaults = array(
			'accent' => '#dd3e3e',
			'bg' => '#fff',
			'color' => '#333', 'color-inv' => '#fff',
			'border' => '#ddd', 'border-inv' => '#333',
		);

		foreach ( $themes as $theme_id ) {
			// Do not output theme if it's one of the defaults or undefined
			if ( ! array_key_exists($theme_id, $this->nav_themes) || array_key_exists($theme_id, $this->default_themes) ) continue;

			$theme = $this->nav_themes[$theme_id];

			$theme_name = ( ! empty($theme['name']) ) ? $theme['name'] : $theme_id;

			$navbar       = ".navbar.theme-$theme_id";
			$main_navbar  = ".navbar-mixt.theme-$theme_id";

			// Get Theme Colors

			$accent     = ! empty($theme['accent']) ? $theme['accent'] : $defaults['accent'];
			$accent_inv = ! empty($theme['accent-inv']) ? $theme['accent-inv'] : $accent;
			
			$bg      = ! empty($theme['bg']) ? $theme['bg'] : $defaults['bg'];
			$bg_ob   = new Color($bg);
			$bg_dark = ! empty($theme['bg-dark']) ? true : false;

			$border     = ! empty($theme['border']) ? $theme['border'] : '#'.$bg_ob->darken(10);
			$border_ob  = new Color($border);
			$border_inv = ! empty($theme['border-inv']) ? $theme['border-inv'] : $border;

			$color     = ! empty($theme['color']) ? $theme['color'] : $defaults['color'];
			$color_inv = ! empty($theme['color-inv']) ? $theme['color-inv'] : $defaults['color-inv'];

			$menu_bg       = ! empty($theme['menu-bg']) ? $theme['menu-bg'] : $bg;
			$menu_bg_ob    = new Color($menu_bg);
			$menu_bg_dark  = $menu_bg_ob->isDark();

			$menu_border    = ! empty($theme['menu-border']) ? $theme['menu-border'] : $border;
			$menu_border_ob = new Color($menu_border);

			$menu_bg_hover = ! empty($theme['menu-bg-hover']) ? $theme['menu-bg-hover'] : '#'.$menu_bg_ob->darken(2);
			$menu_hover_color = ! empty($theme['menu-hover-color']) ? $theme['menu-hover-color'] : $accent;

			// Set Accent And Text Colors According To The Background Color

			if ( $bg_dark ) {
				$navbar_dark  = $navbar;
				$navbar_light = $navbar . '.bg-light';

				$bg_light_color  = $color_inv;
				$bg_light_accent = $accent_inv;

				$bg_dark_color  = $color;
				$bg_dark_accent = $accent;

				$bg_dark_border  = $border;
				$bg_light_border = $border_inv;
			} else {
				$navbar_dark  = $navbar . '.bg-dark';
				$navbar_light = $navbar;

				$bg_light_color  = $color;
				$bg_light_accent = $accent;

				$bg_dark_color  = $color_inv;
				$bg_dark_accent = $accent_inv;

				$bg_dark_border  = $border_inv;
				$bg_light_border = $border;
			}

			$has_inv_accent = ( $bg_light_accent != $bg_dark_accent );

			// Set Menu Accent And Text Colors According To The Background Color
			
			if ( $menu_bg_dark ) {
				$menu_color      = ! empty($theme['menu-color']) ? $theme['menu-color'] : $bg_dark_color;
				$menu_color_fade = ! empty($theme['menu-color-fade']) ? $theme['menu-color-fade'] : $menu_color;
				$menu_accent     = $bg_dark_accent;
			} else {
				$menu_color      = ! empty($theme['menu-color']) ? $theme['menu-color'] : $bg_light_color;
				$menu_color_fade = ! empty($theme['menu-color-fade']) ? $theme['menu-color-fade'] : $menu_color;
				$menu_accent     = $bg_light_accent;
			}

			// Make RGBA Colors If Enabled

			$border_rgba = $menu_bg_rgba = $menu_border_rgba = '';

			$theme_rgba = isset($theme['rgba']) ? $theme['rgba'] : 0;

			if ( $theme_rgba ) {
				$border_rgb  = implode(',', $border_ob->getRgb());
				$border_rgba = "border-color: rgba($border_rgb, 0.8);";

				$menu_bg_rgb  = implode(',', $menu_bg_ob->getRgb());
				$menu_bg_rgba = "background-color: rgba($menu_bg_rgb, 0.95);";

				$menu_border_rgb  = implode(',', $menu_border_ob->getRgb());
				$menu_border_rgba = "border-color: rgba($menu_border_rgb, 0.8);";
			}

			// START CSS RULES
			
			echo "/* $theme_name Navbar Theme */\n";

			echo "$navbar { border-color: $border; background-color: $bg; }\n";
			
			if ( $options['nav-opacity'] < 1 ) {
				$bg_rgb = implode(',', $bg_ob->getRgb());
				echo "$main_navbar:not(.position-top):not(.vertical) { background-color: rgba($bg_rgb, {$options['nav-opacity']}); }\n";
			}

			echo "$navbar.init { background-color: $bg !important; }\n";

			if ( $bg_dark ) {
				echo "$navbar .navbar-data:before { content: 'dark'; }\n";
				echo "$navbar #nav-logo .logo-dark { position: static; opacity: 1; visibility: visible; }\n";
				echo "$navbar #nav-logo .logo-light { position: absolute; opacity: 0; visibility: hidden; }\n";
				echo "$navbar_light #nav-logo .logo-dark { position: absolute; opacity: 0; visibility: hidden; }\n";
				echo "$navbar_light #nav-logo .logo-light { position: static; opacity: 1; visibility: visible; }\n";
			} else {
				echo "$navbar .navbar-data:before { content: 'light'; }\n";
			}

			// Submenus

			echo "$navbar .sub-menu { background-color: $menu_bg; $menu_bg_rgba }\n";
			echo "$navbar .sub-menu li > a:hover, $navbar .sub-menu li > a:hover:focus, " .
				 "$navbar .sub-menu li:hover > a:hover, $navbar .sub-menu li.hover > a:hover { color: $menu_hover_color; background-color: $menu_bg_hover; }\n";
			echo "$navbar .sub-menu li > a, $navbar .sub-menu input { color: $menu_color; }\n";
			echo "$navbar .sub-menu input::-webkit-input-placeholder { color: $menu_color_fade; }\n";
			echo "$navbar .sub-menu input::-moz-placeholder { color: $menu_color_fade; }\n";
			echo "$navbar .sub-menu input:-ms-input-placeholder { color: $menu_color_fade; }\n";
			echo "$navbar .sub-menu, $navbar .sub-menu > li, $navbar .sub-menu > li > a { border-color: $menu_border; $menu_border_rgba }\n";
			echo "$navbar .sub-menu li > a:hover, $navbar .sub-menu .active > a, $navbar .sub-menu .active > a:hover { color: $menu_accent; }\n";

			// Other Elements
			
			echo "$navbar .nav-search .search-form button { border-color: $menu_border; $menu_border_rgba background-color: #".$menu_bg_ob->darken(3)."; }\n";
			echo "$navbar .nav-search .search-form button, $navbar .nav-search .search-form input { color: $menu_color; }\n";
			echo "$navbar .accent-bg { color: ".$this->set_color_for_bg($accent)."; background-color: $accent; }\n";

			// Light Background
			
			echo "$navbar_light .nav > li > a, $navbar_light .text-cont, $navbar_light .text-cont a:hover, $navbar_light .text-cont a.no-color { color: $bg_light_color; }\n";
			if ( $has_inv_accent ) {
				echo "$navbar_light .nav > li:hover > a, $navbar_light .nav > li.hover > a, $navbar_light .nav > li > a:hover, $navbar_light .nav > .active > a, $navbar_light .text-cont a { color: $bg_light_accent; }\n";
				echo "$navbar_light .nav > .active > a:before { background-color: $bg_light_accent; }\n";
			}
			echo "$navbar_light .navbar-toggle .icon-bar { background-color: $bg_light_color; }\n";
			echo "$navbar_light .nav > li, $navbar_light .nav > li > a, $navbar_light .navbar-toggle { border-color: $bg_light_border; }\n";
			echo "$navbar_light .divider { background-color: $bg_light_border; }\n";

			// Dark Background
			
			echo "$navbar_dark .nav > li > a, $navbar_dark .text-cont, $navbar_dark .text-cont a:hover, $navbar_dark .text-cont a.no-color { color: $bg_dark_color; }\n";
			if ( $has_inv_accent ) {
				echo "$navbar_dark .nav > li:hover > a, $navbar_dark .nav > li.hover > a, $navbar_dark .nav > li > a:hover, $navbar_dark .nav > .active > a, $navbar_dark .text-cont a { color: $bg_dark_accent; }\n";
				echo "$navbar_dark .nav > .active > a:before { background-color: $bg_dark_accent; }\n";
			}
			echo "$navbar_dark .navbar-toggle .icon-bar { background-color: $bg_dark_color; }\n";
			echo "$navbar_dark .nav > li, $navbar_dark .nav > li > a, $navbar_dark .navbar-toggle { border-color: $bg_dark_border; }\n";
			echo "$navbar_dark .divider { background-color: $bg_dark_border; }\n";

			if ( ! $has_inv_accent ) {
				echo "$navbar .nav > li:hover > a, $navbar .nav > li.hover > a, $navbar .nav > li > a:hover, $navbar .nav > li.active > a, $navbar .text-cont a { color: $accent; }\n";
				echo "$navbar .nav > .active > a:before { background-color: $accent; }\n";
			}

			// Main Navbar Mobile (mini) Styling

			$mini_navbar = ".nav-mini $main_navbar.navbar";
			
			echo "$mini_navbar .navbar-inner { background-color: $menu_bg; $menu_bg_rgba }\n";
			echo "$mini_navbar .navbar-inner .text-cont, $mini_navbar .navbar-inner .text-cont a:hover, $mini_navbar .navbar-inner .text-cont a.no-color, $mini_navbar .nav > li > a { color: $menu_color; }\n";
			echo "$mini_navbar .nav > li > a:hover, $mini_navbar .nav > li > a:hover:focus, $mini_navbar .nav > li:hover > a:hover, " .
				 "$mini_navbar .nav > li.hover > a:hover, $mini_navbar .nav > li.active > a:hover { color: $menu_hover_color; background-color: $menu_bg_hover; }\n";
			echo "$mini_navbar .nav > li:hover > a, $mini_navbar .nav > li.hover > a { color: $menu_color; }\n";
			echo "$mini_navbar .nav li.nav-search:hover > a, $mini_navbar .nav li.nav-search.hover > a { color: $menu_color !important; background-color: transparent !important; }\n";
			echo "$mini_navbar .nav > li.active > a, $mini_navbar .navbar-inner .text-cont a { color: $menu_accent; }\n";
			if ( $has_inv_accent ) {
				echo "$mini_navbar .nav > .active > a:before { background-color: $menu_accent; }\n";
			}
			echo "$mini_navbar .navbar-inner, $mini_navbar .nav > li, $mini_navbar .nav > li > a { border-color: $menu_border; $menu_border_rgba }\n";
		}
	}
}

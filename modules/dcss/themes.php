<?php

// Color manipulation class
use Mexitek\PHPColors\Color;


/**
 * Return default theme IDs and names
 */
function mixt_default_themes() {
	return array(
		'lava' => 'Lava',
		'dark-lava' => 'Dark Lava',
		'eco' => 'Eco',
		'dark-eco' => 'Dark Eco',
		'aqua' => 'Aqua',
		'nightly' => 'Nightly',
	);
}


class Mixt_Themes extends Mixt_DCSS {

	/**
	 * @var bool  $themes_enabled
	 * @var array $active_themes
	 * @var array $default_themes
	 * @var array $site_themes
	 * @var array $nav_themes
	 * @var array $site_theme
	 */
	public $themes_enabled, $active_themes, $default_themes, $site_themes, $nav_themes, $site_theme;

	public function __construct() {
		$this->themes_enabled = get_option('mixt-themes-enabled', true);
		$this->active_themes = Mixt_Options::get('themes');
		$this->default_themes = mixt_default_themes();
		$this->site_themes = array_merge( $this->default_themes, get_option('mixt-site-themes', array()) );
		$this->nav_themes = array_merge( $this->default_themes, get_option('mixt-nav-themes', array()) );
	}

	/**
	 * Output site-wide theme
	 */
	public function output_site() {
		$theme_id = $this->active_themes['site'];
		$theme = $this->site_themes[$theme_id];

		// Do not output theme if it's one of the defaults or if themes are disabled
		if ( ! $this->themes_enabled || array_key_exists($theme_id, $this->default_themes) || ! is_array($theme) ) return;

		$defaults = array(
			'accent' => '#dd3e3e', 'bg' => '#fff',
			'color' => '#333', 'color-fade' => '#777',
			'color-inv' => '#fff', 'color-inv-fade' => '#ddd',
			'border' => '#ddd', 'border-inv' => '#333',
		);

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

		$accent    = ! empty($theme['accent']) ? $theme['accent'] : $defaults['accent'];
		$accent_ob = new Color($accent);

		if ( $bg_ob->isLight() ) {
			$bg_light_color = $color;
			$bg_light_color_fade = $color_fade;

			$bg_dark_color = $color_inv;
			$bg_dark_color_fade = $color_inv_fade;
		} else {
			$bg_light_color = $color_inv;
			$bg_light_color_fade = $color_inv_fade;

			$bg_dark_color = $color;
			$bg_dark_color_fade = $color_fade;
		}

		$bg_alt     = ! empty($theme['bg-alt']) ? $theme['bg-alt'] : '#'.$bg_ob->darken(3);
		$color_alt  = ! empty($theme['color-alt']) ? $theme['color-alt'] : $this->set_color_for_bg($bg_alt, array($bg_light_color, $bg_dark_color));
		$border_alt = ! empty($theme['border-alt']) ? $theme['border-alt'] : $border;

		$bg_inv     = ! empty($theme['bg-inv']) ? $theme['bg-inv'] : '#'.$bg_ob->complementary();
		$bg_inv_ob  = new Color($bg_inv);
		$border_inv = ! empty($theme['border-inv']) ? $theme['border-inv'] : '#'.$bg_inv_ob->darken(10);

		// RULES START
			
		// Main Background Color
		
		echo "body, #main-wrap { background-color: $bg; }\n";

		// Helper Classes
		
		echo ".theme-bg { background-color: $bg; }\n";

		echo ".theme-color { color: $color; }\n";
		echo ".theme-color-fade { color: $color_fade; }\n";
		echo ".theme-color-inv { color: $color_inv; }\n";
		echo ".theme-color-inv-fade { color: $color_inv_fade; }\n";

		echo ".theme-bg-light-color { color: $bg_light_color; }\n";
		echo ".theme-bg-light-color-fade { color: $bg_light_color_fade; }\n";
		echo ".theme-bg-dark-color { color: $bg_dark_color; }\n";
		echo ".theme-bg-dark-color-fade { color: $bg_dark_color_fade; }\n";

		echo ".accent-color { color: $accent; }\n";
		echo ".accent-bg, .theme-section-accent { color: ".$this->set_color_for_bg($accent, array($color, $color_inv))."; background-color: $accent; }\n";

		echo ".theme-bd { border-color: $border; }\n";
		echo ".theme-accent-bd { border-color: $accent; }\n";

		// Theme Section Colors
		
		echo ".theme-section-main { color: $color; background-color: $bg; border-color: $border; }\n";
		echo ".theme-section-alt { color: $color_alt; border-color: $border_alt; background-color: $bg_alt; }\n";
		echo ".theme-section-accent { border-color: #".$accent_ob->darken(10)."; }\n";
		echo ".theme-section-inv { color: $color_inv; border-color: $border_inv; background-color: $bg_inv; }\n";

		// Text Colors
		
		echo "body, #content-wrap { color: $color; }\n";
		echo "a, .post-meta a:hover, #breadcrumbs a:hover, .pager a:hover, .pager li > span, .hover-accent-color:hover { color: $accent; }\n";
		echo ".head-media.bg-light .container, .head-media.bg-light .media-inner > a, .head-media.bg-light .header-scroll, .head-media.bg-light #breadcrumbs > li + li:before { color: $bg_light_color; }\n";
		echo ".head-media.bg-dark .container, .head-media.bg-dark .media-inner > a, .head-media.bg-dark .header-scroll, .head-media.bg-dark #breadcrumbs > li + li:before { color: $bg_dark_color; }\n";
		echo ".post-related .related-title { color: $bg_dark_color; }\n";
		echo ".post-meta a, .post-meta > span { color: $color_fade; }\n";
		echo ".link-list li a { color: $color_fade; }\n";
		echo ".link-list li a:hover, .link-list li a:active, .link-list li.active > a { color: $accent; }\n";

		// Border Colors
		
		echo "body, #content-wrap, .mixt .sidebar ul { border-color: $border; }\n";
		echo ".comment-list li.bypostauthor { border-left-color: $accent; }\n";


		// Background Colors
		
		echo ".accent-bg:hover, .hover-accent-bg:hover, .tag-list a:hover, .tagcloud a:hover { background-color: $accent; }\n";
		echo ".article .post-info .post-date { background-color: $bg_darker; }\n";

		// Other Colors
		
		echo "::selection { background: $accent; background: rgba($accent, 0.8); color: ".$this->set_color_for_bg($accent, array('#fff', '#000'))."; }\n";

		echo ".sidebar .child-page-nav li a:hover, .sidebar .nav li a:hover { color: $accent; }\n";
		echo ".sidebar .child-page-nav .current_page_item, .sidebar .child-page-nav .current_page_item:before { background-color: $bg_darker; }\n";

		echo "blockquote { border-color: $border; border-left-color: $accent; background-color: $bg_darker; }\n";
		echo "blockquote cite { color: $color_fade; }\n";

		// Bootstrap Elements

		echo ".alert-default { color: $color; border-color: $border; background-color: $bg_darker; }\n";
		echo ".alert-default a { color: $accent; }\n";
		echo ".panel { border-color: $border; background-color: $bg_lighter; }\n";
		echo ".well { border-color: $border; background-color: $bg_darker; }\n";
		echo ".table caption { color: $color_fade; }\n";
		echo ".table.table-bordered, .table.table-bordered th, .table.table-bordered td { border-color: $border !important; }\n";
		echo ".table.table-striped > tbody > tr:nth-of-type(odd) { background-color: $bg_darker; }\n";

		// Background Variants
		
		echo ".bg-light { color: $bg_light_color; } .bg-light .text-fade { color: $bg_dark_color_fade; }";
		echo ".bg-dark { color: $bg_dark_color; } .bg-dark .text-fade { color: $bg_dark_color_fade; }";

		// Inputs
		
		echo "input:not([type=submit]):not([type=button]):not(.btn), select, textarea, .form-control, ".
			 ".post-password-form input[type='password'], .woocommerce .input-text { color: $color; border-color: $border; background-color: $bg_darker; }\n";
		echo "input:not([type=submit]):not([type=button]):not(.btn):focus, select:focus, textarea:focus, .form-control:focus, ".
			 ".post-password-form input[type='password']:focus, .woocommerce .input-text:focus { border-color: #".$border_ob->lighten(3)."; background-color: $bg_lighter; }\n";
		echo "::-webkit-input-placeholder, ::-moz-placeholder, :-ms-input-placeholder { color: $color_fade !important; }\n";

		// Buttons
		
		echo $this->button_color(array('primary', 'accent'), $accent);
		echo $this->button_color('minimal', $bg_darker);

		// Element Colors
		
		echo ".mixt-stat.type-box, .mixt-headline span.color-auto:after, .mixt-timeline .timeline-block:before { border-color: $border; }\n";
		echo ".mixt-row-separator.no-fill svg { fill: $bg; }\n";
		echo ".mixt-map { color: $bg_light_color; }\n";
		echo ".mixt-flipcard > .inner > .accent { color: ".$this->set_color_for_bg($accent, array($bg_light_color, $bg_dark_color))."; background-color: $accent; border-color: #".$accent_ob->lighten(10)."; }\n";

		// Plugin Colors

		// LightSlider
		echo ".lSSlideOuter .lSPager.lSpg > li:hover a, .lSSlideOuter .lSPager.lSpg > li.active a { background-color: $accent; }\n";

		// LightGallery
		echo ".lg-outer .lg-thumb-item.active, .lg-outer .lg-thumb-item:hover { border-color: $accent; }\n";
		echo ".lg-progress-bar .lg-progress { background-color: $accent; }\n";

		// Visual Composer
		if ( defined( 'WPB_VC_VERSION') ) {
			echo ".wpb_content_element .wpb_tour_tabs_wrapper .wpb_tabs_nav a:hover, .wpb_content_element .wpb_accordion_header a:hover { color: $accent; }\n";
			echo ".vc_separator.theme-bd .vc_sep_holder .vc_sep_line { border-color: $border; }\n";
			echo ".mixt-grid-item .gitem-title-cont { color: $color; background-color: $bg_lighter; }\n";
			echo ".vc_tta.vc_tta-style-classic:not(.vc_tta-o-no-fill) .vc_tta-panel-body, .vc_tta.vc_tta-style-modern:not(.vc_tta-o-no-fill) .vc_tta-panel-body { color: $bg_light_color; }\n";
		}

		// WooCommerce
		if ( class_exists('WooCommerce') ) {
			echo ".woocommerce .price .amount, .woocommerce .total .amount, .woocommerce .woo-cart .amount, .woocommerce .nav li .amount { color: $accent; }\n";
			echo ".woocommerce .nav li del .amount, .woocommerce #reviews #comments ol.commentlist li .meta { color: $color_fade; }\n";
			echo ".woocommerce .widget_price_filter .ui-slider .ui-slider-range, .woocommerce p.demo_store { background-color: $accent; }\n";
			echo ".woocommerce .badge-cont .badge.sale-badge { background-color: $accent; }\n";
			echo ".woocommerce .woocommerce-tabs ul.tabs li a { color: $color_fade !important; }\n";
			echo ".woocommerce .woocommerce-tabs ul.tabs li.active { border-bottom-color: $bg !important; }\n";
			echo ".woocommerce .woocommerce-tabs ul.tabs li.active a { color: $color !important; }\n";
			echo ".woocommerce .woocommerce-tabs ul.tabs li.active, .woocommerce .woocommerce-tabs .wc-tab { color: $color !important; background-color: $bg !important; }\n";
			echo ".woocommerce .woocommerce-tabs .cart-collaterals .cart_totals tr td, .woocommerce .woocommerce-tabs .cart-collaterals .cart_totals tr th { border-color: $border; }\n";
			echo ".woocommerce p.demo_store { color: ".$this->set_color_for_bg($accent, array($bg_light_color, $bg_dark_color))."; }\n";

			echo ".woocommerce form .form-row.woocommerce-validated .select2-choice, .woocommerce form .form-row.woocommerce-validated input.input-text, .woocommerce form .form-row.woocommerce-validated select, ".
				 ".woocommerce form .form-row.woocommerce-validated .select2-choice, .woocommerce form .form-row.woocommerce-validated input.input-text, .woocommerce form .form-row.woocommerce-validated select ".
				 "{ border-color: $border; }\n";
		}
	}

	/**
	 * Output navbar theme
	 */
	public function output_navbar() {
		$nav_themes = array();
		if ( $this->active_themes['nav'] != 'auto' ) {
			$nav_themes[] = $this->active_themes['nav'];
		} else {
			$nav_themes[] = $this->active_themes['site'];
		}
		if ( $this->active_themes['sec-nav'] != $this->active_themes['nav'] && $this->active_themes['sec-nav'] != 'auto' && Mixt_Options::get('nav', 'second-nav') ) {
			$nav_themes[] = $this->active_themes['sec-nav'];
		}

		$defaults = array(
			'accent' => '#dd3e3e', 'bg' => '#fff',
			'color' => '#333', 'color-fade' => '#777',
			'color-inv' => '#fff', 'color-inv-fade' => '#ddd',
			'border' => '#ddd', 'border-inv' => '#333',
			'menu-bg' => '#fbfbfb', 'menu-expand' => 'rgba(0,0,0,0.05)',
			'menu-border' => '#e2e2e2', 'menu-border-alpha' => 'rgba(0,0,0,0.15)',
			'menu-color' => '#333', 'menu-color-fade' => '#777',
		);

		foreach ( $nav_themes as $theme_id ) {
			if ( isset($this->nav_themes[$theme_id]) ) {
				$theme = $this->nav_themes[$theme_id];
			} else {
				$theme = $this->nav_themes[key($this->nav_themes)];
			}

			// Do not output theme if it's one of the defaults or if themes are disabled
			if ( ! $this->themes_enabled || array_key_exists($theme_id, $this->default_themes) || ! is_array($theme) ) return;

			$navbar       = '.navbar.theme-' . $theme_id;
			$navbar_dark  = $navbar . '.bg-dark';
			$main_navbar  = $navbar . '.navbar-mixt';

			// Get Theme Colors
			
			$nav_bg     = ! empty($theme['bg']) ? $theme['bg'] : $defaults['bg'];
			$nav_bg_ob  = new Color($nav_bg);

			$nav_border    = ! empty($theme['border']) ? $theme['border'] : '#'.$nav_bg_ob->darken(10);
			$nav_border_ob = new Color($nav_border);

			$nav_color     = ! empty($theme['color']) ? $theme['color'] : $defaults['color'];
			$nav_color_inv = ! empty($theme['color-inv']) ? $theme['color-inv'] : $defaults['color-inv'];

			$nav_accent     = ! empty($theme['accent']) ? $theme['accent'] : $defaults['accent'];
			$nav_inv_accent = ! empty($theme['inv-accent']) ? $theme['inv-accent'] : $defaults['inv-accent'];

			$nav_menu_bg    = ! empty($theme['menu-bg']) ? $theme['menu-bg'] : $defaults['menu-bg'];
			$nav_menu_bg_ob = new Color($nav_menu_bg);

			$nav_menu_border    = ! empty($theme['menu-border']) ? $theme['menu-border'] : '#'.$nav_menu_bg_ob->darken(20);
			$nav_menu_border_ob = new Color($nav_menu_border);

			// Set Effects & Text Colors According To The Background Color

			if ( $nav_bg_ob->isLight() ) {
				$nav_bg_light_text = $nav_color;
				$nav_bg_dark_text  = $nav_color_inv;

				$nav_bg_light_accent = $nav_accent;
				$nav_bg_dark_accent  = $nav_inv_accent;
			} else {
				$nav_bg_light_text = $nav_color_inv;
				$nav_bg_dark_text  = $nav_color;

				$nav_bg_light_accent = $nav_inv_accent;
				$nav_bg_dark_accent  = $nav_accent;
			}

			// Make RGBA Colors If Enabled

			$nav_border_rgba = $nav_menu_bg_rgba = $nav_menu_border_rgba = '';

			$theme_rgba = isset($theme['rgba']) ? $theme['rgba'] : 0;

			if ( $theme_rgba ) {
				$nav_border_rgb  = implode(',', $nav_border_ob->getRgb());
				$nav_border_rgba = "border-color: rgba($nav_border_rgb, 0.8)";

				$nav_menu_bg_rgb  = implode(',', $nav_menu_bg_ob->getRgb());
				$nav_menu_bg_rgba = "background-color: rgba($nav_menu_bg_rgb, 0.95);";

				$nav_menu_border_rgb  = implode(',', $nav_menu_border_ob->getRgb());
				$nav_menu_border_rgba = "border-color: rgba($nav_menu_border_rgb, 0.8)";
			}


			// BG Color

			echo "$navbar { background-color: $nav_bg; }\n";

			// Text Color

			echo "$navbar .text-cont," .
				 "$navbar .text-cont a:hover," .
				 "$navbar .text-cont a.no-color," .
				 "$navbar .nav > li > a { color: $nav_bg_light_text; }\n";

			echo "$navbar_dark .text-cont," .
				 "$navbar_dark .text-cont a:hover," .
				 "$navbar_dark .text-cont a.no-color," .
				 "$navbar_dark .nav > li > a { color: $nav_bg_dark_text; }\n";

			// Hover & Active Text Color

			echo "$navbar .text-cont a," .
				 "$navbar .nav > li:hover > a," .
				 "$navbar .nav > li.hover > a," .
				 "$navbar .nav > li > a:hover," .
				 "$navbar .nav > li.active > a { color: $nav_bg_light_accent; } \n";

			echo "$navbar .nav > .active > a:before { background-color: $nav_bg_light_accent; }\n";

			if ( $nav_bg_dark_accent !== $nav_bg_light_accent ) {
				echo "$navbar_dark .text-cont a," .
					 "$navbar_dark .nav > li:hover > a," .
					 "$navbar_dark .nav > li.hover > a," .
					 "$navbar_dark .nav > li > a:hover," .
					 "$navbar_dark .nav > li.active > a { color: $nav_bg_dark_accent; } \n";

				echo "$navbar_dark .nav > .active > a:before { background-color: $nav_bg_dark_accent; }\n";
			}

			// Border Color

			echo "$navbar," .
				 "$navbar .nav > li," .
				 "$navbar .nav > li > a," .
				 "$navbar .navbar-toggle { border-color: $nav_border; $nav_border_rgba }\n";

			// Menus

			if ( $nav_menu_bg_ob->isLight() ) {
				$nav_menu_text   = $nav_bg_light_text;
				$nav_menu_accent = $nav_bg_light_accent;
				$nav_menu_hover  = '#'.$nav_menu_bg_ob->darken(3);
				$nav_menu_expand = 'rgba(0,0,0,0.03)';
			} else {
				$nav_menu_text   = $nav_bg_dark_text;
				$nav_menu_accent = $nav_bg_dark_accent;
				$nav_menu_hover  = '#'.$nav_menu_bg_ob->lighten(5);
				$nav_menu_expand = 'rgba(255,255,255,0.05)';
			}

			echo "$navbar .sub-menu { background-color: $nav_menu_bg; $nav_menu_bg_rgba }\n";

			echo "$navbar .sub-menu li > a," .
				 "$navbar .sub-menu input," .
				 "$navbar .search-form button { color: $nav_menu_text; }\n";

			echo "$navbar .sub-menu ::-webkit-input-placeholder { color: $nav_menu_text; }\n";
			echo "$navbar .sub-menu ::-moz-placeholder { color: $nav_menu_text; }\n";

			echo "$navbar .sub-menu li.hover > a," .
				 "$navbar .sub-menu li > a:hover," .
				 "$navbar .nav-search .btn { background-color: $nav_menu_hover; }\n";

			echo "$navbar .sub-menu li.hover > a," .
				 "$navbar .sub-menu li > a:hover," .
				 "$navbar .sub-menu .active > a," .
				 "$navbar .sub-menu .active > a:hover { color: $nav_menu_accent; }\n";

			echo "$navbar .sub-menu," .
				 "$navbar .sub-menu > li," .
				 "$navbar .sub-menu > li > a," .
				 "$navbar .nav-search button { border-color: $nav_menu_border; $nav_menu_border_rgba }\n";

			echo "$navbar .mega-menu-column > a { background-color: $nav_menu_hover; }\n";

			// Divider

			echo "$navbar li.divider { background-color: $nav_bg_light_text; }\n";
			echo "$navbar_dark li.divider { background-color: $nav_bg_dark_text; }\n";

			// Navbar Toggle

			echo "$navbar .navbar-toggle .icon-bar { background-color: $nav_bg_light_text; }\n";
			echo "$navbar_dark .navbar-toggle .icon-bar { background-color: $nav_bg_dark_text; }\n";

			// Mobile Styling

			echo "@media ( max-width: {$this->media_bp('mars')} ) {\n";

				echo "$main_navbar .navbar-inner { background-color: $nav_menu_bg; $nav_menu_bg_rgba }\n";

				echo "$main_navbar .navbar-inner .text-cont," .
					 "$main_navbar .navbar-inner .text-cont a:hover," .
					 "$main_navbar .navbar-inner .text-cont a.no-color," .
					 "$main_navbar .nav > li > a { color: $nav_menu_text; }\n";

				echo "$main_navbar .nav > li:hover > a," .
					 "$main_navbar .nav > li.hover > a," .
					 "$main_navbar .nav > li > a:hover { background-color: $nav_menu_hover; }\n";

				echo "$main_navbar .navbar-inner .text-cont a," .
					 "$main_navbar .nav > li:hover > a," .
					 "$main_navbar .nav > li.hover > a," .
					 "$main_navbar .nav > li > a:hover," .
					 "$main_navbar .nav > li.active > a { color: $nav_menu_accent; } \n";

				echo "$main_navbar .navbar-inner," .
					 "$main_navbar .nav > li," .
					 "$main_navbar .nav > li > a { border-color: $nav_menu_border; $nav_menu_border_rgba }\n";

				echo "$main_navbar .nav li.expand," .
					 "$main_navbar .nav li.expand .sub-menu a:hover { background-color: $nav_menu_expand; }\n";

			echo "}\n";
		}
	}
}

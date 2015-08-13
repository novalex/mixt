<?php

// Color manipulation class
use Mexitek\PHPColors\Color;


/**
 * Return default themes by set
 */
function mixt_default_themes($set = 'all') {
	$themes = array(
		'names' => array(
			'lava' => 'Lava', 'dark-lava' => 'Dark Lava',
			'eco' => 'Eco', 'dark-eco' => 'Dark Eco',
			'aqua' => 'Aqua', 'nightly' => 'Nightly',
		),

		'site' => array(
			'lava' => array(
				'name' => 'Lava', 'id' => 'lava',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'text-fade' => '#777',
				'inv-text' => '#fff', 'inv-text-fade' => '#ddd',
				'accent' => '#dd3e3e', 'link' => '#dd3e3e',
			),
			'dark-lava' => array(
				'name' => 'Dark Lava', 'id' => 'dark-lava',
				'bg' => '#444', 'border' => '#333',
				'text' => '#eee', 'text-fade' => '#ddd',
				'inv-text' => '#333', 'inv-text-fade' => '#777',
				'accent' => '#dd3e3e', 'link' => '#dd3e3e',
			),
			'eco' => array(
				'name' => 'Eco', 'id' => 'eco',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'text-fade' => '#777',
				'inv-text' => '#fff', 'inv-text-fade' => '#ddd',
				'accent' => '#7cad24', 'link' => '#7cad24',
			),
			'aqua' => array(
				'name' => 'Aqua', 'id' => 'aqua',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'text-fade' => '#777',
				'inv-text' => '#fff', 'inv-text-fade' => '#ddd',
				'accent' => '#539ddd', 'link' => '#539ddd',
			),
		),

		'nav' => array(
			'lava' => array(
				'name' => 'Lava', 'id' => 'lava',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'inv-text' => '#fff',
				'accent' => '#dd3e3e', 'inv-accent' => '#dd3e3e',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
			'dark-lava' => array(
				'name' => 'Dark Lava', 'id' => 'dark-lava',
				'bg' => '#444', 'border' => '#333',
				'text' => '#fff', 'inv-text' => '#333',
				'accent' => '#dd3e3e', 'inv-accent' => '#dd3e3e',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
			'eco' => array(
				'name' => 'Eco', 'id' => 'eco',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'inv-text' => '#fff',
				'accent' => '#7cad24', 'inv-accent' => '#7cad24',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
			'dark-eco' => array(
				'name' => 'Dark Eco', 'id' => 'dark-eco',
				'bg' => '#222', 'border' => '#111',
				'text' => '#fff', 'inv-text' => '#333',
				'accent' => '#7cad24', 'inv-accent' => '#7cad24',
				'menu-bg' => '#333', 'menu-border' => '#222',
				'rgba' => '1',
			),
			'aqua' => array(
				'name' => 'Aqua', 'id' => 'aqua',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'inv-text' => '#fff',
				'accent' => '#539ddd', 'inv-accent' => '#539ddd',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
			'nightly' => array(
				'name' => 'Nightly', 'id' => 'nightly',
				'bg' => '#444', 'border' => '#333',
				'text' => '#fff', 'inv-text' => '#333',
				'accent' => '#539ddd', 'inv-accent' => '#539ddd',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
		),
	);
	if ( $set == 'all' ) { return $themes; }
	else { return $themes[$set]; }
}


class Mixt_Themes extends Mixt_DCSS {

	/** @var bool */
	public $themes_enabled;

	/** @var array */
	public $active_themes;

	/** @var array */
	public $default_themes;

	/** @var array */
	public $site_themes;

	/** @var array */
	public $nav_themes;

	/** @var array */
	public $site_theme;

	public function __construct() {
		$this->themes_enabled = get_option('mixt-themes-enabled', true);
		$this->active_themes = Mixt_Options::get('themes');
		$this->default_themes = mixt_default_themes();
		$this->site_themes = array_merge( $this->default_themes['site'], get_option('mixt-site-themes', array()) );
		$this->nav_themes = array_merge( $this->default_themes['nav'], get_option('mixt-nav-themes', array()) );
		$this->site_theme = $this->site_themes[MIXT_THEME];
	}

	/**
	 * Output site-wide theme
	 */
	public function output_site() {
		$options = mixt_get_options( array(
			'site-theme' => array( 'type' => 'str', 'return' => 'value', 'default' => MIXT_THEME ),
		) );

		$theme_id = $this->active_themes['site'];
		$theme = $this->site_themes[$theme_id];
		$this->site_theme = $theme;
		$defaults = $this->default_themes['site'][MIXT_THEME];

		$site_text      = ! empty($theme['text']) ? $theme['text'] : $defaults['text'];
		$site_text_ob   = new Color($site_text);
		$site_text_fade = ! empty($theme['text-fade']) ? $theme['text-fade'] : '#'.$site_text_ob->lighten(20);

		$site_inv_text      = ! empty($theme['inv-text']) ? $theme['inv-text'] : $defaults['inv-text'];
		$site_inv_text_ob   = new Color($site_inv_text);
		$site_inv_text_fade = ! empty($theme['inv-text-fade']) ? $theme['inv-text-fade'] : $site_inv_text_ob->darken(40);

		$site_border = ! empty($theme['border']) ? $theme['border'] : $defaults['border'];

		$site_accent    = ! empty($theme['accent']) ? $theme['accent'] : $defaults['accent'];
		$site_accent_ob = new Color($site_accent);

		$site_link_color = ! empty($theme['link']) ? $theme['link'] : $site_accent;

		if ( $this->themes_enabled && $theme_id != MIXT_THEME ) {

			// Text Color
			echo "body, #content-wrap { color: $site_text; }\n";

			// Text Color Fade
			echo '.post-meta a,' .
				 ".post-meta > span { color: $site_text_fade; }\n";

			// Border Color
			echo "#content-wrap { border-color: $site_border; }\n";

			// Accent Text Color
			echo ".accent-color," .
				 "#breadcrumbs a:hover { color: $site_accent; }\n";

			// Accent Background Color
			echo '.accent-bg,' .
				 '.accent-bg:hover,' .
				 '.tag-list a:hover,' .
				 '.tagcloud a:hover,' .
				 ".hover-accent-bg:hover { background-color: $site_accent; color: " . $this->set_color_for_bg($site_accent, array($site_text, $site_inv_text)) . "; }\n";

			// Accent Border Color
			echo "blockquote { border-left-color: $site_accent !important; }\n";

			// Link Color
			echo "a," .
				 ".post-meta a:hover { color: $site_link_color; }\n";

			// Buttons
			echo $this->button_color(array('primary', 'accent'), $site_accent);
		}
	}

	/**
	 * Output navbar theme
	 */
	public function output_navbar() {
		$options = mixt_get_options( array(
			'nav-opacity' => array( 'type' => 'str', 'return' => 'value', 'default' => '0.95' ),
			'nav-top-opacity' => array( 'type' => 'str', 'return' => 'value', 'default' => '0.25' ),
		) );

		$nav_themes = array( $this->active_themes['nav'] );
		if ( $this->active_themes['sec-nav'] != $this->active_themes['nav'] && Mixt_Options::get('nav', 'second-nav') ) {
			$nav_themes[] = $this->active_themes['sec-nav'];
		}
		$defaults = $this->default_themes['nav'][MIXT_THEME];

		foreach ( $nav_themes as $theme_id ) {

			if ( isset($this->nav_themes[$theme_id]) ) {
				$theme = $this->nav_themes[$theme_id];
			} else {
				$theme = $this->nav_themes[key($this->nav_themes)];
			}

			$nav_bg      = ! empty($theme['bg']) ? $theme['bg'] : $defaults['bg'];
			$nav_bg_ob   = new Color($nav_bg);
			$nav_bg_rgb  = implode(',', $nav_bg_ob->getRgb());
			echo ".nav-transparent .navbar-mixt.theme-$theme_id.position-top { background-color: rgba($nav_bg_rgb, {$options['nav-top-opacity']}); }\n";
			echo ".fixed-nav .navbar-mixt.theme-$theme_id { background-color: rgba($nav_bg_rgb,{$options['nav-opacity']}); }\n";

			if ( $this->themes_enabled && $theme_id != MIXT_THEME ) { // && ! in_array($theme_id, $this->default_themes['names']) ) {
				$navbar       = '.navbar.theme-' . $theme_id;
				$navbar_dark  = $navbar . '.bg-dark';
				$main_navbar  = $navbar . '.navbar-mixt';

				// Get Theme Colors

				$nav_border    = ! empty($theme['border']) ? $theme['border'] : '#'.$nav_bg_ob->darken(10);
				$nav_border_ob = new Color($nav_border);

				$nav_text     = ! empty($theme['text']) ? $theme['text'] : $site_text;
				$nav_inv_text = ! empty($theme['inv-text']) ? $theme['inv-text'] : $site_inv_text;

				$nav_accent     = ! empty($theme['accent']) ? $theme['accent'] : $site_accent;
				$nav_inv_accent = ! empty($theme['inv-accent']) ? $theme['inv-accent'] : $nav_accent;

				$nav_menu_bg    = ! empty($theme['menu-bg']) ? $theme['menu-bg'] : $nav_bg;
				$nav_menu_bg_ob = new Color($nav_menu_bg);

				$nav_menu_border    = ! empty($theme['menu-border']) ? $theme['menu-border'] : '#'.$nav_menu_bg_ob->darken(20);
				$nav_menu_border_ob = new Color($nav_menu_border);

				// Set Effects & Text Colors According To The Background Color

				if ( $nav_bg_ob->isLight() ) {
					$nav_bg_light_text = $nav_text;
					$nav_bg_dark_text  = $nav_inv_text;

					$nav_bg_light_accent = $nav_accent;
					$nav_bg_dark_accent  = $nav_inv_accent;
				} else {
					$nav_bg_light_text = $nav_inv_text;
					$nav_bg_dark_text  = $nav_text;

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
}

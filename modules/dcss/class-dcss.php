<?php

// Color manipulation class
require_once( MIXT_FRAME_DIR . '/libs/Color.php' );
use Mexitek\PHPColors\Color;


/**
 * Dynamic CSS functions and helpers
 */
class Mixt_DCSS {

	/**
	 * CSS code that will be output in the header
	 * @var string
	 */
	public static $head_css = '';

	/**
	 * CSS code that will be output in the body
	 * @var string
	 */
	public static $body_css = '';

	/**
	 * CSS code that will be written to the custom stylesheet
	 * @var string
	 */
	public static $stylesheet_css = '';
	
	/**
	 * Flag for stylesheet support
	 * @var bool
	 */
	protected $stylesheet = false;
	protected $stylesheet_opt = false;

	/**
	 * Media breakpoints defined in the CSS
	 * @var array
	 */
	public static $media_bps = array();

	public function __construct() {

		// Output CSS in the header
		add_action('wp_head', array($this, 'print_head_css'), 999);
		// Output CSS in the body
		add_action('wp_footer', array($this, 'print_body_css'), 999);

		// Test if files can be written to the uploads directory and if the write to file option is enabled, and if yes set the stylesheet flag
		$this->stylesheet_opt = mixt_get_option( array('key' => 'write-dynamic-css') );
		if ( ( function_exists('get_filesystem_method') && get_filesystem_method('', MIXT_UPLOAD_PATH) == 'direct' ) || file_exists(MIXT_UPLOAD_PATH . '/dynamic.css') ) {
			$this->stylesheet = true;
		}

		// Load theme generator file
		require_once( MIXT_MODULES_DIR . '/dcss/themes.php' );
	}

	/**
	 * Output dynamic CSS in the header
	 * Used to output page specific styles and custom CSS if stylesheets are unsupported
	 */
	public function print_head_css() {
		// Generate custom CSS for the header
		self::$head_css .= mixt_custom_css();
		if ( ! $this->stylesheet ) { self::$head_css .= mixt_custom_theme_css(); }

		if ( self::$head_css == '' ) return;
		echo "\n<style type='text/css' data-id='mixt-head-css'>\n" . self::$head_css . "</style>\n";
	}

	/**
	 * Output dynamic CSS in the body
	 * Used to output CSS from the element Styler and any other styles that cannot be loaded in the header
	 */
	public function print_body_css() {
		if ( self::$body_css == '' ) return;
		echo "\n<style type='text/css' data-id='mixt-body-css' scoped>\n" . self::$body_css . "</style>\n";
	}

	/**
	 * Update custom CSS stylesheet
	 */
	public function print_stylesheet() {
		$stylesheet = MIXT_UPLOAD_PATH . '/dynamic.css';
		if ( $this->stylesheet && $this->stylesheet_opt ) {
			WP_Filesystem();
			global $wp_filesystem;

			$css = self::$stylesheet_css . mixt_custom_theme_css();

			if ( ! empty($css) ) {
				$css = "/* DYNAMIC STYLESHEET, DO NOT EDIT! */\n\n" . $css;
				$wp_filesystem->put_contents($stylesheet, $css, FS_CHMOD_FILE);
			} else if ( file_exists($stylesheet) ) {
				unlink($stylesheet);
			}
		} else if ( file_exists($stylesheet) ) {
			unlink($stylesheet);
		}
	}

	/**
	 * Return pixel value for the site's media breakpoints
	 * 
	 * @param  string $bp    Breakpoint name
	 * @param  string $range Breakpoint range (min for use with min-width or max)
	 * @return string
	 */
	public static function media_bp($bp, $range = 'max') {
		if ( empty(self::$media_bps) ) self::$media_bps = mixt_media_breakpoints();

		if ( ! isset($bp, self::$media_bps) ) return '0px';

		if ( $range == 'max' ) {
			return self::$media_bps[$bp] - 1 . 'px';
		} else {
			return self::$media_bps[$bp] . 'px';
		}
	}

	/**
	 * Parse one or more CSS selector based on the given pattern
	 * 
	 * @param  string $pattern the selector pattern to parse
	 * @param  mixed  $sel     the selector name(s) to replace in the pattern
	 * @return string          selector string
	 */
	public function parse_selector($pattern, $sel, $props) {
		$selector = '';
		if ( is_array($sel) ) {
			foreach ($sel as $single_sel) {
				$selector .= str_replace('{{sel}}', $single_sel, $pattern) . ',';
			}
			$selector = rtrim($selector, ',');
		} else {
			$selector = str_replace('{{sel}}', $sel, $pattern);
		}
		echo mixt_clean($selector . $props, 'strip');
	}

	/**
	 * Test a color's luminance
	 * 
	 * @param  string $color color code to test
	 * @return string        'light' or 'dark'
	 */
	public function lumin($color) {
		$color = strtoupper($color);
		$color_ov = array(
			'#7CAD24' => 'dark',
		);
		if ( array_key_exists($color, $color_ov) ) {
			$lumin = $color_ov[$color];
		} else {
			$color_ob = new Color($color);
			$lumin = $color_ob->isLight() ? 'light' : 'dark';
		}
		return $lumin;
	}

	/**
	 * Return the appropriate color for the given background
	 * 
	 * @param  string $bg     background color
	 * @param  array  $colors colors to return from, first key for light backgrounds and second for dark ones
	 * @return string
	 */
	public function set_color_for_bg($bg, $colors = array('#333', '#fff')) {
		if ( $this->lumin($bg) == 'light' ) {
			return $colors[0];
		} else {
			return $colors[1];
		}
	}

	/**
	 * Return the appropriate text shadow color for the given background
	 * 
	 * @param  string $bg     background color
	 * @param  array  $colors colors to return from, first key for light backgrounds and second for dark ones
	 * @return string
	 */
	public function set_textsh_for_bg($bg, $colors = array('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)')) {
		if ( $this->lumin($bg) == 'light' ) {
			return $colors[1];
		} else {
			return $colors[0];
		}
	}

	/**
	 * Convert a HEX color to RGB or RGBa.
	 * Credit: http://mekshq.com/how-to-convert-hexadecimal-color-code-to-rgb-or-rgba-using-php/
	 * @param  string $color   HEX color to convert
	 * @param  string $opacity Opacity (alpha channel)
	 * @return string The converted color
	 */
	public function hex2rgba($color, $opacity = false) {
		$default = 'rgba(0,0,0,0)';
		if ( empty($color) ) return $default;
		$color = str_replace('#', '', $color);

		// Check if color has 6 or 3 characters and get values
		if ( strlen($color) == 6 ) {
			$hex = array($color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5]);
		} else if ( strlen($color) == 3 ) {
			$hex = array($color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2]);
		} else {
			return $default;
		}
		$rgb = array_map('hexdec', $hex);
		return ( $opacity ) ? 'rgba('.implode(",",$rgb).','.$opacity.')' : $output = 'rgb('.implode(",",$rgb).')';
	}

	/**
	 * Invert a HEX color (return its opposite)
	 * Credit: http://www.jonasjohn.de/snippets/php/color-inverse.htm
	 * @param  string $color
	 * @return string
	 */
	public function invert($color) {
		$color = str_replace('#', '', $color);
		if ( strlen($color) != 6 ) { return '000000'; }
		$rgb = '';
		for ( $x=0;$x<3;$x++ ) {
			$c = 255 - hexdec(substr($color, (2*$x), 2));
			$c = ($c < 0) ? 0 : dechex($c);
			$rgb .= (strlen($c) < 2) ? '0'.$c : $c;
		}
		return '#'.$rgb;
	}

	/**
	 * Return styles for a button color variant
	 * 
	 * @param  string $sel   selector for the variant
	 * @param  string $color the variant's color
	 * @return string        CSS code for the variant
	 */
	public function button_color($sel, $color, $pre = '.mixt') {
		$color_ob = new Color($color);

		$color_for_bg = $this->set_color_for_bg($color);
		$border_color = '#'.$color_ob->darken(7);
		$text_shadow  = $this->set_textsh_for_bg($color);
		$color_darker = '#'.$color_ob->darken(10);

		if ( $this->lumin($color) == 'light' ) {
			$btn_solid_hover_bg = '#' . $color_ob->darken(5);
			$btn_outline_hover_bg = 'rgba(0,0,0,0.03)';
		} else {
			$btn_solid_hover_bg = '#' . $color_ob->lighten(5);
			$btn_outline_hover_bg = 'rgba(255,255,255,0.03)';
		}

		ob_start();

		// Solid Background
		
		$this->parse_selector("$pre .btn-{{sel}}", $sel, "{ border-color: $border_color; text-shadow: 0 1px 1px $text_shadow; background-color: $color; }\n");
		$this->parse_selector("$pre .btn-{{sel}}:hover, $pre .btn-{{sel}}:focus", $sel, "{ background-color: $btn_solid_hover_bg; }\n");
		$this->parse_selector("$pre .btn-hover-{{sel}}:hover, $pre .btn-hover-{{sel}}:focus", $sel,
			 "{ border-color: $border_color; text-shadow: 0 1px 1px $text_shadow; background-color: $color !important; }\n");
		$this->parse_selector("$pre .btn-{{sel}}:active, $pre .btn-{{sel}}.active, $pre .btn-hover-{{sel}}:hover:active, $pre .btn-hover-{{sel}}:hover.active", $sel,
			 "{ border-color: $color_darker; box-shadow: inset 0 1px 12px $color_darker; }\n");
		$this->parse_selector("$pre .btn-{{sel}}, $pre a.btn-{{sel}}, $pre .btn-{{sel}}:hover, $pre .btn-{{sel}}:focus, $pre .btn-hover-{{sel}}:hover, $pre a.btn-hover-{{sel}}:hover, $pre .btn-hover-{{sel}}:focus", $sel, "{ color: $color_for_bg; }\n");

		// Outline
		
		$this->parse_selector("$pre .btn-outline-{{sel}}:hover", $sel, "{ background-color: $btn_outline_hover_bg; }\n");
		$this->parse_selector("$pre .btn-outline-{{sel}}, $pre .btn-hover-outline-{{sel}}:hover", $sel,
			 "{ border: 1px solid $color; text-shadow: none !important; background-color: transparent; }\n");
		$this->parse_selector("$pre .btn-outline-{{sel}}:active, $pre .btn-outline-{{sel}}.active, $pre .btn-hover-outline-{{sel}}:hover:active, $pre .btn-hover-outline-{{sel}}:hover.active", $sel,
			 "{ box-shadow: inset 0 1px 16px rgba(0,0,0,0.05); }\n");
		$this->parse_selector("$pre .btn-hover-outline-{{sel}}:hover", $sel, "{ background-color: transparent !important; }\n");
		$this->parse_selector("$pre .btn-outline-{{sel}}, $pre a.btn-outline-{{sel}}, $pre .btn-outline-{{sel}}:hover, $pre .btn-outline-{{sel}}:focus, $pre .btn-hover-outline-{{sel}}:hover, $pre a.btn-hover-outline-{{sel}}:hover, $pre .btn-hover-outline-{{sel}}:focus", $sel, 
			 "{ color: $color; }\n");

		// Animations

		$this->parse_selector("$pre .btn-fill-in-{{sel}}", $sel, "{ background-color: $color !important; }\n");
		$this->parse_selector("$pre .btn-fill-in-{{sel}}:hover, $pre .btn-fill-in-{{sel}}:focus, $pre .btn-fill-in-{{sel}}:active", $sel, 
			 "{ color: $color_for_bg; border-color: $color; text-shadow: 0 1px 1px $text_shadow; }\n");
		$this->parse_selector("$pre .btn-{{sel}}.btn-fill-in:before", $sel, "{ background-color: $color; }\n");
		$this->parse_selector("$pre .btn-fill-{{sel}}:hover, $pre .btn-fill-{{sel}}:focus, $pre .btn-fill-{{sel}}:active", $sel, 
			 "{ color: $color_for_bg; border-color: $color; text-shadow: 0 1px 1px $text_shadow; }\n");
		$this->parse_selector("$pre .btn-fill-{{sel}}:before", $sel, "{ background-color: $color; }\n");

		// WooCommerce Accent Button
		
		if ( class_exists('WooCommerce') && is_array($sel) && in_array('accent', $sel) ) {
			echo "$pre .woocommerce .button.alt, $pre .woocommerce input[type=submit].button, $pre .woocommerce #respond input#submit { color: $color_for_bg !important; border-color: $border_color !important; text-shadow: 0 1px 1px $text_shadow !important; background-color: $color !important; }\n";
			echo "$pre .woocommerce .button.alt:hover, $pre .woocommerce input[type=submit].button:hover, $pre .woocommerce #respond input#submit:hover, " .
				 "$pre .woocommerce .button.alt:focus, $pre .woocommerce input[type=submit].button:focus, $pre .woocommerce #respond input#submit:focus { background-color: $btn_solid_hover_bg !important; }\n";
			echo "$pre .woocommerce .button.alt:active, $pre .woocommerce input[type=submit].button:active, $pre .woocommerce #respond input#submit:active, " .
				 "$pre .woocommerce .button.alt.active, $pre .woocommerce input[type=submit].button:focus, $pre .woocommerce #respond input#submit.active { border-color: $color_darker !important; box-shadow: inset 0 1px 12px $color_darker !important; }\n";
		}

		return ob_get_clean();
	}


	/**
	 * Parse typography field and return CSS string of all applicable rules
	 *
	 * @param string $id         The ID of the typography field
	 * @param array  $defaults   Default values
	 * @param array  $importants Properties that will be made "important"
	 */
	public static function parse_typo_field($id, $defaults = array(), $importants = array() ) {
		$field = mixt_get_option( array( 'key' => $id, 'return' => 'value' ) );
		if ( empty($field) && empty($defaults) ) {
			return '';
		} else {
			$field = (array) $field + (array) $defaults;
		}

		$string = '';

		// Font family and backup font
		if ( ! empty($field['font-family']) ) {
			if ( preg_match('/\s/', $field['font-family']) ) {
				$font_family = '"' . $field['font-family'] . '"';
			} else {
				$font_family = $field['font-family'];
			}
			if ( ! empty($field['font-backup']) ) {
				$font_family .= ', ' . $field['font-backup'];
			}
			if ( array_key_exists('font-family', $importants) ) $font_family .= ' !important';
			$string .= "font-family: {$font_family}; ";
		}

		// Other properties
		foreach ( $field as $prop => $val ) {
			if ( in_array($prop, array('font-family', 'font-backup', 'google', 'subsets') ) || empty($val) ) continue;

			if ( array_key_exists($prop, $importants) ) $val .= ' !important';

			$string .= "$prop: $val; ";
		}

		return rtrim($string);
	}
}
new Mixt_DCSS();

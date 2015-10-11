<?php

// Color manipulation class
require_once( MIXT_FRAME_DIR . '/libs/Color.php' );
use Mexitek\PHPColors\Color;


/**
 * Dynamic CSS helpers and functions
 */
class Mixt_DCSS {

	/** @var string CSS code that will be output */
	public static $css = '';

	public function __construct() {
		// Output CSS in header
		add_action('mixt_head_css', 'mixt_print_head_css');
		// Output Styler CSS
		add_action('mixt_body_css', 'mixt_print_body_css');
	}

	/**
	 * Add CSS code to output
	 * 
	 * @param string $css
	 */
	public static function add($css) {
		self::$css .= $css;
	}

	/**
	 * Check the CSS code for duplicates of the given string
	 * 
	 * @param  string $string
	 * @return boolean
	 */
	public static function is_duplicate($string) {
		return ( strpos(self::$css, $string) !== false );
	}

	/**
	 * Return pixel value for the site's media breakpoints
	 * 
	 * @param  string $bp    breakpoint name
	 * @param  string $range breakpoint range (min for use with min-width or max)
	 * @return string
	 */
	public function media_bp($bp, $range = 'max') {
		$bps = array(
			'mercury' => 480,
			'mars'    => 767,
			'venus'   => 992,
			'earth'   => 1200,
		);

		if ( $range == 'max' ) {
			return $bps[$bp] . 'px';
		} else {
			return $bps[$bp] + 1 . 'px';
		}
	}

	/**
	 * Parse one or more CSS selector based on the given pattern
	 * 
	 * @param  string $pattern the selector pattern to parse
	 * @param  mixed  $sel     the selector name(s) to replace in the pattern
	 * @return string          selector string
	 */
	public function parse_selector($pattern, $sel) {
		$selector = '';
		if ( is_array($sel) ) {
			foreach ($sel as $single_sel) {
				$selector .= str_replace('{{sel}}', $single_sel, $pattern) . ',';
			}
			$selector = rtrim($selector, ',');
		} else {
			$selector = str_replace('{{sel}}', $sel, $pattern);
		}
		return $selector;
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
		$border_color = '#'.$color_ob->darken(5);
		$text_shadow  = $this->set_textsh_for_bg($color);
		$color_darker = '#'.$color_ob->darken(10);

		if ( $this->lumin($color) == 'light' ) {
			$btn_solid_hover_bg = '#' . $color_ob->darken(3);
			$btn_outline_hover_bg = 'rgba(0,0,0,0.03)';
		} else {
			$btn_solid_hover_bg = '#' . $color_ob->lighten(5);
			$btn_outline_hover_bg = 'rgba(255,255,255,0.03)';
		}

		ob_start();

		// Solid Background
		
		echo $this->parse_selector("$pre .btn-{{sel}}", $sel) . "{ border-color: $border_color; text-shadow: 0 1px 1px $text_shadow; background-color: $color; }\n";
		echo $this->parse_selector("$pre .btn-{{sel}}:hover, $pre .btn-{{sel}}:focus", $sel) . "{ background-color: $btn_solid_hover_bg; }\n";
		echo $this->parse_selector("$pre .btn-hover-{{sel}}:hover, $pre .btn-hover-{{sel}}:focus", $sel) .
			 "{ border-color: $border_color; text-shadow: 0 1px 1px $text_shadow; background-color: $color !important; }\n";
		echo $this->parse_selector("$pre .btn-{{sel}}:active, $pre .btn-{{sel}}.active, $pre .btn-hover-{{sel}}:hover:active, $pre .btn-hover-{{sel}}:hover.active", $sel) .
			 "{ border-color: $color_darker; box-shadow: inset 0 1px 12px $color_darker; }\n";
		echo $this->parse_selector("$pre .btn-{{sel}}, $pre a.btn-{{sel}}, $pre .btn-{{sel}}:hover, $pre .btn-{{sel}}:focus, $pre .btn-hover-{{sel}}:hover, $pre a.btn-hover-{{sel}}:hover, $pre .btn-hover-{{sel}}:focus", $sel) .
			 "{ color: $color_for_bg; }\n";

		// Outline
		
		echo $this->parse_selector("$pre .btn-outline-{{sel}}:hover", $sel) . "{ background-color: $btn_outline_hover_bg; }\n";
		echo $this->parse_selector("$pre .btn-outline-{{sel}}, $pre .btn-hover-outline-{{sel}}:hover", $sel) .
			 "{ border: 1px solid $border_color; text-shadow: none !important; background-color: transparent; }\n";
		echo $this->parse_selector("$pre .btn-outline-{{sel}}:active, $pre .btn-outline-{{sel}}.active, $pre .btn-hover-outline-{{sel}}:hover:active, $pre .btn-hover-outline-{{sel}}:hover.active", $sel) .
			 "{ box-shadow: inset 0 1px 16px rgba(0,0,0,0.05); }\n";
		echo $this->parse_selector("$pre .btn-hover-outline-{{sel}}:hover", $sel) . "{ background-color: transparent !important; }\n";
		echo $this->parse_selector("$pre .btn-outline-{{sel}}, $pre a.btn-outline-{{sel}}, $pre .btn-outline-{{sel}}:hover, $pre .btn-outline-{{sel}}:focus, $pre .btn-hover-outline-{{sel}}:hover, $pre a.btn-hover-outline-{{sel}}:hover, $pre .btn-hover-outline-{{sel}}:focus", $sel) .
			 "{ color: $color; }\n";

		// Animations

		echo $this->parse_selector("$pre .btn-fill-in-{{sel}}", $sel) . "{ background-color: $color !important; }\n";
		echo $this->parse_selector("$pre .btn-fill-in-{{sel}}:hover, $pre .btn-fill-in-{{sel}}:focus, $pre .btn-fill-in-{{sel}}:active", $sel) .
			 "{ color: $color_for_bg; border-color: $color; text-shadow: 0 1px 1px $text_shadow; }\n";
		echo $this->parse_selector("$pre .btn-{{sel}}.btn-fill-in:before", $sel) . "{ background-color: $color; }\n";
		echo $this->parse_selector("$pre .btn-fill-{{sel}}:hover, $pre .btn-fill-{{sel}}:focus, $pre .btn-fill-{{sel}}:active", $sel) .
			 "{ color: $color_for_bg; border-color: $color; text-shadow: 0 1px 1px $text_shadow; }\n";
		echo $this->parse_selector("$pre .btn-fill-{{sel}}:before", $sel) . "{ background-color: $color; }\n";

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
	 * @return string CSS code
	 */
	public static function output_css() {
		echo esc_html(self::$css);
	}
}
new Mixt_DCSS;

// Load theme generator file
require_once( MIXT_MODULES_DIR . '/dcss/themes.php' );

// Load dynamic CSS generator
require_once( MIXT_MODULES_DIR . '/dcss/dynamic.css.php' );
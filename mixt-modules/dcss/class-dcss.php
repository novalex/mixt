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
			$i = 0;
			foreach ($sel as $single_sel) {
				$selector .= str_replace('{{sel}}', $single_sel, $pattern) . ',';
			}
			$selector = rtrim($selector, ',');
		} else {
			$selector = str_replace('{{sel}}', $single_sel, $pattern);
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
	 * Return styles for a button color variant
	 * 
	 * @param  string $sel   selector for the variant
	 * @param  string $color the variant's color
	 * @return string        CSS code for the variant
	 */
	public function button_color($sel, $color) {
		$color_ob = new Color($color);
		ob_start();

		$border_color = $color_ob->darken(5);
		$text_shadow  = $this->set_textsh_for_bg($color);
		?>

		<?php echo $this->parse_selector('.btn-{{sel}}', $sel); ?> {
			border-color: #<?php echo $border_color; ?>;
			text-shadow: 0 1px 1px <?php echo $text_shadow; ?>;
			background-color: <?php echo $color; ?>;
		}
		<?php echo $this->parse_selector('.btn-{{sel}}:hover, .btn-{{sel}}:focus', $sel); ?> {
			<?php
			if ( $this->lumin($color) == 'light' ) {
				echo 'background-color: #' . $color_ob->darken(5) . ';';
			} else {
				echo 'background-color: #' . $color_ob->lighten(5) . ';';
			}
			?>
		}

		<?php echo $this->parse_selector('.btn-hover-{{sel}}:hover, .btn-hover-{{sel}}:focus', $sel); ?> {
			border-color: #<?php echo $border_color; ?>;
			text-shadow: 0 1px 1px <?php echo $text_shadow; ?>;
			background-color: <?php echo $color; ?> !important;
		}

		<?php echo $this->parse_selector('.btn-{{sel}}:active, .btn-{{sel}}.active, .btn-hover-{{sel}}:hover:active, .btn-hover-{{sel}}:hover.active', $sel); ?> {
			border-color: #<?php echo $color_ob->darken(10); ?>;
			box-shadow: inset 0 1px 12px #<?php echo $color_ob->darken(10); ?>;
		}

		<?php echo $this->parse_selector('.btn-{{sel}}, .btn-{{sel}}:hover, .btn-{{sel}}:focus, .btn-hover-{{sel}}:hover, .btn-hover-{{sel}}:focus', $sel); ?> {
			color: <?php echo $this->set_color_for_bg($color); ?>;
		}

		<?php
		return ob_get_clean();
	}

	/**
	 * @return string CSS code
	 */
	public static function output_css() {
		echo self::$css;
	}
}
new Mixt_DCSS;

require_once( MIXT_MODULES_DIR . '/dcss/themes.php' );

// Color Helper Functions
require_once MIXT_FRAME_DIR . '/libs/color-helpers.php';

// Load the dynamic CSS file or Sass parser
if ( get_option('mixt-dynamic-sass', 0) ) {
	require_once( MIXT_PLUGINS_DIR . '/wp-sass/wp-sass.php' );
} else {
	require_once( MIXT_MODULES_DIR . '/dcss/dynamic.css.php' );
}
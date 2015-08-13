<?php

/**
 * Determine if hex color is light
 * @param  string $hex HEX code of color to analyze
 * @return bool
 */
function hex_is_light($hex) {
	$hex = str_replace('#', '', $hex);

	if ( strlen($hex) == 3 ) { $hex .= $hex; }

	$r = hexdec(substr($hex, 0, 2));
	$g = hexdec(substr($hex, 2, 2));
	$b = hexdec(substr($hex, 4, 2));

	$avg_lum = (($r * 299) + ($g * 587) + ($b * 114)) / 1000;

	if ( $avg_lum > 170 ) {
		return true;
	} else {
		return false;
	}
}

/**
 * Determine an image's average luminance
 * @param  string  $file Path or URL to image
 * @param  integer $num_samples
 * @return integer luminance value
 */
function get_img_luminance($file, $num_samples = 10) {
	$extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
	if ( $extension == 'jpg' || $extension == 'jpeg' ) {
		$img = imagecreatefromjpeg($file);
	} else if ( $extension == 'png' ) {
		$img = imagecreatefrompng($file);
	} else {
		return 170;
	}

	$width = imagesx($img);
	$height = imagesy($img);
	$x_step = intval($width/$num_samples);
	$y_step = intval($height/$num_samples);
	$total_lum = 0;
	$sample_no = 1;

	for ($x=0; $x<$width; $x+=$x_step) {
		for ($y=0; $y<$height; $y+=$y_step) {
			$rgb = imagecolorat($img, $x, $y);
			$r = ($rgb >> 16) & 0xFF;
			$g = ($rgb >> 8) & 0xFF;
			$b = $rgb & 0xFF;

			$lum = ($r+$r+$b+$g+$g+$g)/6;
			$total_lum += $lum;
			$sample_no++;
		}
	}
	$avg_lum  = $total_lum / $sample_no;

	return floor($avg_lum);
}

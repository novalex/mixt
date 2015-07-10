<?php

// Elements Common Assets

/**
 * Retreive assets by group
 */
function mixt_element_assets($group) {
	$assets = array(
		'image-styles' => array(
			'default' => __( 'Default', 'mixt' ),

			'image-border'  => __( 'Bordered', 'mixt' ),
			'image-outline' => __( 'Outlined', 'mixt' ),
			'image-eclipse' => __( 'Eclipse', 'mixt' ),
			'image-shadow'  => __( 'Shadow', 'mixt' ),

			'image-rounded' => __( 'Rounded', 'mixt' ),
			'image-rounded image-border'  => __( 'Rounded with border', 'mixt' ),
			'image-rounded image-outline' => __( 'Rounded with outline', 'mixt' ),
			'image-rounded image-eclipse' => __( 'Rounded with eclipse', 'mixt' ),
			'image-rounded image-shadow'  => __( 'Rounded with shadow', 'mixt' ),

			'image-circle' => __( 'Circle', 'mixt' ),
			'image-circle image-border'  => __( 'Circle with border', 'mixt' ),
			'image-circle image-outline' => __( 'Circle with outline', 'mixt' ),
			'image-circle image-eclipse' => __( 'Circle with eclipse', 'mixt' ),
			'image-circle image-shadow'  => __( 'Circle with shadow', 'mixt' ),

			'image-shadow-3d' => __( '3D Shadow', 'mixt' ),
		),

		'icon-styles' => array(
			'default' => __( 'Default', 'mixt' ),

			'icon-solid' => __( 'Solid', 'mixt' ),
			'icon-outline' => __( 'Outlined', 'mixt' ),

			'icon-rounded' => __( 'Rounded', 'mixt' ),
			'icon-rounded icon-outline' => __( 'Rounded with outline', 'mixt' ),

			'icon-circle' => __( 'Circle', 'mixt' ),
			'icon-circle icon-outline' => __( 'Circle with outline', 'mixt' ),
		),

		'row-separators' => array(
			''                 => __( 'None', 'mixt' ),
			'curve'            => __( 'Curve', 'mixt' ),
			'curve-inv'        => __( 'Curve (inverted)', 'mixt' ),
			'circle'           => __( 'Circle', 'mixt' ),
			'cricle-inv'       => __( 'Circle (inverted)', 'mixt' ),
			'triangle'         => __( 'Triangle', 'mixt' ),
			'triangle-inv'     => __( 'Triangle (inverted)', 'mixt' ),
			'big-triangle'     => __( 'Big Triangle', 'mixt' ),
			'big-triangle-inv' => __( 'Big Triangle (inverted)', 'mixt' ),
		),
	);

	return $assets[$group];
}

/**
 * Output row separator
 */
function mixt_row_separator($type = 'triangle', $color = '', $icon = '') {
	$cont_class = $svg_fill = '';
	if ( $color != '' ) {
		$svg_fill = "fill='$color'";
	} else {
		$cont_class .= 'no-fill';
	}
	$svg_atts = 'xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" preserveAspectRatio="none"';

	echo "<div class='mixt-row-separator $type $cont_class'>";
		// Multi-Part Separators
		if ( $type == 'circle-inv' || $type == 'triangle-inv' ) {
			echo "<svg class='sep-left' $svg_fill $svg_atts><rect width='100' height='100' /></svg>";
			echo "<svg class='sep-center' $svg_fill $svg_atts>";
				if ( $type == 'circle-inv' ) {
					echo '<path d="M 0 0 a 50.01 100 0 0 0 99.9 0 L 100 100 0 100 z" /></svg>';
				} else {
					echo '<polygon points="0 0, 50 99, 100 0, 100 100, 0 100" /></svg>';
				}
			echo "<svg class='sep-right' $svg_fill $svg_atts><rect width='100' height='100' /></svg>";
		// Single-Part Separators
		} else {
			echo "<svg $svg_fill $svg_atts>";
			switch($type) {
				case 'curve':
					echo '<path d="M 0 0 q 50 200 100 0 L 100 0 z" />';
					break;
				case 'curve-inv':
					echo '<path d="M 0 0 q 50 200 100 0 L 100 100 0 100 z" />';
					break;
				case 'circle':
					echo '<circle cx="50" cy="50" r="50" />';
					break;
				case 'triangle':
					echo '<polygon points="0 0, 100 0, 50 100" />';
					break;
				case 'big-triangle':
					echo '<polygon points="0 0, 50 100, 100 0, 0 0" />';
					break;
				case 'big-triangle-inv':
					echo '<polygon points="0 0, 50 90, 100 0, 100 100, 0 100" />';
					break;
			}
			echo '</svg>';
		}
		if ( $icon != '' ) {
			echo "<i class='$icon'></i>";
		}
	echo '</div>';
}
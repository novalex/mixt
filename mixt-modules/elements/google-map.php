<?php

/**
 * Google Maps Element
 */
class Mixt_Map {

	/**
	 * @var array $styles
	 * @var array $colors
	 */
	public $styles, $colors;
	
	public function __construct() {
		$this->styles = array(
			'' => __( 'Default', 'mixt' ),

			'map-border'  => __( 'Bordered', 'mixt' ),
			'map-outline' => __( 'Outlined', 'mixt' ),
			'map-eclipse' => __( 'Eclipse', 'mixt' ),
			'map-shadow'  => __( 'Shadow', 'mixt' ),

			'map-rounded' => __( 'Rounded', 'mixt' ),
			'map-rounded map-border'  => __( 'Rounded with border', 'mixt' ),
			'map-rounded map-outline' => __( 'Rounded with outline', 'mixt' ),
			'map-rounded map-eclipse' => __( 'Rounded with eclipse', 'mixt' ),
			'map-rounded map-shadow'  => __( 'Rounded with shadow', 'mixt' ),

			'map-shadow-3d' => __( '3D Shadow', 'mixt' ),
		);
		$this->colors = array_merge(
			array( 'auto' => __( 'Auto', 'mixt' ) ),
			mixt_get_assets('colors', 'basic')
		);

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_map', array($this, 'shortcode'));
	}

	/**
	 * Print Google Maps API Script
	 */
	public function print_api_script() {
		echo '<script id="google-maps-api" type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>';
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_map',
			'title'    => __( 'Map', 'mixt' ),
			'template' => '[mixt_map {{attributes}}]{{content}}[/mixt_map]',
			'params'   => array(
				'style' => array(
					'type'    => 'select',
					'label'   => __( 'Style', 'mixt' ),
					'options' => $this->styles,
				),
				'color' => array(
					'type'     => 'select',
					'label'    => __( 'Border Color', 'mixt' ),
					'options'  => $this->colors,
					'class'    => 'color-select basic-colors',
					'required' => array('style', '=', 'map-border|map-outline|map-rounded map-border|map-rounded map-outline'),
				),
				'height' => array(
					'type'  => 'text',
					'label' => __( 'Height', 'mixt' ),
					'std'   => '300px',
				),
				'locations' => array(
					'type'     => 'exploded_textarea',
					'label'    => __( 'Locations', 'mixt' ),
					'desc'     => __( 'Enter the location(s) as latitude longitude, e.g. "34.05 -118.24". Separate multiple locations with a line break.
									   You can find out the coordinates of an address <a href="http://www.latlong.net/" target="_blank">here</a>', 'mixt' ),
				),
				'zoom' => array(
					'type'  => 'text',
					'label' => __( 'Map Zoom', 'mixt' ),
				),
				'marker_icon' => array(
					'type'  => 'media',
					'label' => __( 'Marker Image', 'mixt' ),
				),
				'style_hue' => array(
					'type'  => 'colorpicker',
					'label' => __( 'Map Hue', 'mixt' ),
				),
				'content' => array(
					'type'  => 'encoded_textarea',
					'label' => __( 'Info Content', 'mixt' ),
					'desc'  => __( 'Enter any content you wish to display inside an info window when clicking on a marker.
									If you have multiple locations, separate content for each with 3 underscores (___). HTML is allowed.', 'mixt' ),
				),
				'ui_controls' => array(
					'type'    => 'checkbox',
					'label'   => __( 'UI Controls', 'mixt' ),
					'options' => array(
						'zoom'     => __( 'Zoom', 'mixt' ),
						'pan'      => __( 'Panning', 'mixt' ),
						'stview'   => __( 'Street View', 'mixt' ),
						'map_type' => __( 'Map Type', 'mixt' ),
					),
					'std'     => '',
				),
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		vc_map( array(
			'name'        => __( 'Advanced Map', 'mixt' ),
			'description' => __( 'Google Map with advanced options', 'mixt' ),
			'base'        => 'mixt_map',
			'icon'        => 'mixt_map',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Style', 'mixt' ),
					'param_name' => 'style',
					'value'      => array_flip($this->styles),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Border Color', 'mixt' ),
					'param_name' => 'color',
					'value'      => array_flip($this->colors),
					'param_holder_class' => 'color-select basic-colors',
					'dependency' => array(
						'element' => 'style',
						'value'   => array(
							'map-border', 'map-outline', 'map-rounded map-border', 'map-rounded map-outline'
						),
					),
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Height', 'mixt' ),
					'param_name' => 'height',
					'std'        => '300px',
				),
				array(
					'type'        => 'exploded_textarea',
					'heading'     => __( 'Locations', 'mixt' ),
					'description' => __( 'Enter the location(s) as latitude longitude, e.g. "34.05 -118.24". Separate multiple locations with a line break.
										  You can find out the coordinates of an address <a href="http://www.latlong.net/" target="_blank">here</a>', 'mixt' ),
					'param_name'  => 'locations',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Map Zoom', 'mixt' ),
					'param_name' => 'zoom',
				),
				array(
					'type'       => 'attach_image',
					'heading'    => __( 'Marker Image', 'mixt' ),
					'param_name' => 'marker_icon',
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Map Hue', 'mixt' ),
					'param_name' => 'style_hue',
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Info Content', 'mixt' ),
					'description' => __( 'Enter any content you wish to display inside an info window when clicking on a marker.
										  If you have multiple locations, separate content for each with 3 underscores (___). HTML is allowed.', 'mixt' ),
					'param_name'  => 'content',
				),
				array(
					'type'       => 'checkbox',
					'heading'    => __( 'UI Controls', 'mixt' ),
					'param_name' => 'ui_controls',
					'value'      => array(
						__( 'Zoom', 'mixt' )        => 'zoom',
						__( 'Panning', 'mixt' )     => 'pan',
						__( 'Street View', 'mixt' ) => 'stview',
						__( 'Map Type', 'mixt' )    => 'map_type',
					),
					'std'        => '',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),
			),
		) );
	}

	/**
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		$options = shortcode_atts( array(
			'style'       => '',
			'color'       => '',
			'height'      => '300px',
			'locations'   => '34.058475 -118.246587',
			'zoom'        => '',
			'marker_text' => '',
			'marker_icon' => '',
			'style_hue'   => '',
			'ui_controls' => '',
			'class'       => '',
		), $atts );
		extract($options);

		$map_id = 'mixt_map_' . uniqid();

		$classes = 'mixt-map mixt-element';
		if ( $style != '' ) $classes .= " $style $color";
		if ( ! empty($class) ) $classes .= ' ' . $class;

		add_action('wp_print_footer_scripts', array($this, 'print_api_script'));

		$content = preg_replace('/<br(?:\s\/)?>/', '', html_entity_decode($content));
		$content = preg_replace('/\r|\n/', '<br>', $content);
		$options['content'] = str_replace("'", '"', $content);
		$html = "<div class='$classes'><div id='$map_id' class='map-wrapper' style='height: $height'>" .
					$this->print_map_script($map_id, $options) .
				'</div></div>';
		
		return $html;
	}

	/**
	 * Print customized script to initialize map
	 */
	public function print_map_script($map_id, $options) {
		extract($options);

		// UI Controls
		$ui_controls = explode(',', $ui_controls);
		$ui_pan = (in_array('pan', $ui_controls)) ? 'true' : 'false';
		$ui_zoom = (in_array('zoom', $ui_controls)) ? 'true' : 'false';
		$ui_map_type = (in_array('map_type', $ui_controls)) ? 'true' : 'false';
		$ui_stview = (in_array('stview', $ui_controls)) ? 'true' : 'false';
		$options = "var mapOptions = { " .
					   "panControl: $ui_pan, " .
					   "zoomControl: $ui_zoom, " .
					   "mapTypeControl: $ui_map_type, " .
					   "streetViewControl: $ui_stview, " .
				   "}";

		// Locations
		$markers = '';
		$marker_atts = 'animation: google.maps.Animation.DROP';
		if ( $marker_text != '' ) $marker_atts .= ", title: '$marker_text' ";
		if ( $marker_icon != '' ) {
			$marker_icon = wp_get_attachment_image_src($marker_icon, 'full');
			$marker_atts .= ", icon: '{$marker_icon[0]}' ";
		}

		// Styles
		$styles = '';
		if ( ! empty($style_hue) ) {
			$styles = "var styles = [ { featureType: 'all', stylers: [ { hue: '$style_hue' } ] } ]; map.setOptions({ styles: styles });";
		}

		return "<script type='text/javascript'>
			function init_$map_id() {
				var bounds = new google.maps.LatLngBounds();
				$options

				var map = new google.maps.Map(document.getElementById('$map_id'), mapOptions);
				$styles

				var i,
					locations = '$locations'.split(','),
					infoContent = '$content'.split('___'),
					infoWindow = new google.maps.InfoWindow();
				for ( i = 0; i < locations.length; i++ ) {
					var coords = locations[i].split(' ');
					var marker = new google.maps.Marker({ position: new google.maps.LatLng(coords[0], coords[1]), map: map, $marker_atts});
					bounds.extend(marker.position);

					if ( infoContent[i].length ) {
						google.maps.event.addListener(marker, 'click', ( function(marker, i) {
							return function() {
								infoWindow.setContent(infoContent[i].replace(/^(<br>)|(<br>)$/, ''));
								infoWindow.open(map, marker);
							}
						})(marker, i));
					}
				}
				map.fitBounds(bounds);

				google.maps.event.addDomListener(window, 'resize', function() {
					var center = map.getCenter();
					google.maps.event.trigger(map, 'resize');
					map.setCenter(center); 
				});

				if ( '$zoom' != '' ) {
					var zoomLevel = google.maps.event.addListener(map, 'idle', function () {
						map.setZoom($zoom);
						google.maps.event.removeListener(zoomLevel);
					});
				}
			}

			if ( typeof google === 'object' ) {
				init_$map_id();
			} else {
				jQuery(window).load( function() { if ( typeof google === 'object' ) { init_$map_id(); } });
			}
		</script>";
	}
}
new Mixt_Map;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Map extends WPBakeryShortCode {}
}

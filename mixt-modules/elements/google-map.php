<?php

/**
 * Google Maps Element
 */
class MixtGoogleMaps {
	
	public function __construct() {
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_map', array($this, 'shortcode'));
		add_action('wp_enqueue_scripts', array($this, 'reg_api_script'));
	}

	/**
	 * Register Google Maps API Script
	 */
	public function reg_api_script() {
		wp_register_script('google-maps-api', 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false', array(), MIXTCB_VERSION, false);
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
				'height' => array(
					'type'  => 'text',
					'label' => __( 'Height', 'mixt' ),
					'std'   => '300px',
				),
				'lat' => array(
					'type'     => 'text',
					'label'    => __( 'Latitude', 'mixt' ),
					'desc'     => __( 'You can find out the coordinates of an address <a href="http://www.latlong.net/" target="_blank">here</a>', 'mixt' ),
					'required'  => array( 'data_type', '=', 'adv' ),
				),
				'lng' => array(
					'type'     => 'text',
					'label'    => __( 'Longitude', 'mixt' ),
					'required' => array( 'data_type', '=', 'adv' ),
				),
				'zoom' => array(
					'type'     => 'text',
					'label'    => __( 'Map Zoom', 'mixt' ),
					'std'      => '16',
					'required' => array( 'data_type', '=', 'adv' ),
				),
				'marker_icon' => array(
					'type'     => 'media',
					'label'    => __( 'Marker Image', 'mixt' ),
					'required' => array( 'data_type', '=', 'adv' ),
				),
				'style_hue' => array(
					'type'     => 'colorpicker',
					'label'    => __( 'Map Hue', 'mixt' ),
					'required' => array( 'data_type', '=', 'adv' ),
				),
				'content' => array(
					'type'     => 'encoded_textarea',
					'label'    => __( 'Info Window HTML', 'mixt' ),
					'required' => array( 'data_type', '=', 'adv' ),
				),
				'ui_controls' => array(
					'type'     => 'checkbox',
					'label'    => __( 'UI Controls', 'mixt' ),
					'options'  => array(
						'zoom'     => __( 'Zoom', 'mixt' ),
						'pan'      => __( 'Panning', 'mixt' ),
						'stview'   => __( 'Street View', 'mixt' ),
						'map_type' => __( 'Map Type', 'mixt' ),
					),
					'std'      => 'zoom',
					'required' => array( 'data_type', '=', 'adv' ),
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
					'type'       => 'textfield',
					'heading'    => __( 'Height', 'mixt' ),
					'param_name' => 'height',
					'std'        => '300px',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Latitude', 'mixt' ),
					'description' => __( 'You can find out the coordinates of an address <a href="http://www.latlong.net/" target="_blank">here</a>', 'mixt' ),
					'param_name'  => 'lat',
					'dependency'  => array( 'element' => 'data_type', 'value' => array('adv') ),
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Longitude', 'mixt' ),
					'param_name' => 'lng',
					'dependency' => array( 'element' => 'data_type', 'value' => array('adv') ),
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Map Zoom', 'mixt' ),
					'param_name' => 'zoom',
					'std'        => '16',
					'dependency' => array( 'element' => 'data_type', 'value' => array('adv') ),
				),
				array(
					'type'       => 'attach_image',
					'heading'    => __( 'Marker Image', 'mixt' ),
					'param_name' => 'marker_icon',
					'dependency' => array( 'element' => 'data_type', 'value' => array('adv') ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Map Hue', 'mixt' ),
					'param_name' => 'style_hue',
					'dependency' => array( 'element' => 'data_type', 'value' => array('adv') ),
				),
				array(
					'type'       => 'textarea_html',
					'heading'    => __( 'Info Window HTML', 'mixt' ),
					'param_name' => 'content',
					'dependency' => array( 'element' => 'data_type', 'value' => array('adv') ),
				),
				array(
					'type'       => 'checkbox',
					'heading'    => __( 'UI Controls', 'mixt' ),
					'param_name' => 'ui_controls',
					'value'      => array(
						__( 'Zoom', 'mixt' ) => 'zoom',
						__( 'Panning', 'mixt' ) => 'pan',
						__( 'Street View', 'mixt' ) => 'stview',
						__( 'Map Type', 'mixt' ) => 'map_type',
					),
					'std'        => 'zoom',
					'dependency' => array( 'element' => 'data_type', 'value' => array('adv') ),
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
			'height'      => '300px',
			'lat'         => '34.058475',
			'lng'         => '-118.246587',
			'zoom'        => '16',
			'marker_text' => '',
			'marker_icon' => '',
			'style_hue'   => '',
			'ui_controls' => 'zoom',
			'class'       => '',
		), $atts );
		extract($options);

		$map_id = 'mixt_map_' . uniqid();

		$classes = 'mixt-map mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		wp_print_scripts('google-maps-api');
		$options['content'] = preg_replace('/\r|\n/', '', html_entity_decode($content));
		$html = "<div id='$map_id' class='$classes' style='height: $height'></div>\n" .
				$this->print_map_script($map_id, $options);
		
		return $html;
	}

	/**
	 * Print customized script to initialize map
	 */
	public function print_map_script($map_id, $options) {
		extract($options);
		$ui_controls = explode(',', $ui_controls);
		$ui_pan = (in_array('pan', $ui_controls)) ? 'true' : 'false';
		$ui_zoom = (in_array('zoom', $ui_controls)) ? 'true' : 'false';
		$ui_map_type = (in_array('map_type', $ui_controls)) ? 'true' : 'false';
		$ui_stview = (in_array('stview', $ui_controls)) ? 'true' : 'false';
		$options = "var mapOptions = { " .
					   "zoom: $zoom," .
					   "center: setPosition, " .
					   "panControl: $ui_pan, " .
					   "zoomControl: $ui_zoom, " .
					   "mapTypeControl: $ui_map_type, " .
					   "streetViewControl: $ui_stview, " .
				   "}";
		$marker  = "var marker = new google.maps.Marker({ position: setPosition, map: map, animation: google.maps.Animation.DROP ";
			if ( $marker_text != '' ) $marker .= ", title: '$marker_text' ";
			if ( $marker_icon != '' ) {
				$marker_icon = wp_get_attachment_image_src($marker_icon, 'full');
				$marker .= ", icon: '{$marker_icon[0]}' ";
			}
		$marker .= "});";
		$info = '';
		if ( ! empty($content) ) {
			$info = "var infowindow = new google.maps.InfoWindow({ content: \"$content\" });" .
					"google.maps.event.addListener(marker, 'click', function() { infowindow.open(map, marker); });";
		}
		$styles = '';
		if ( ! empty($style_hue) ) {
			$styles = "var styles = [ { featureType: \"all\", stylers: [ { hue: \"$style_hue\" } ] } ]; map.setOptions({styles: styles});";
		}

		return "<script type='text/javascript'>
			function initialize() {
				var setPosition = new google.maps.LatLng($lat,$lng);
				$options
				var map = new google.maps.Map(document.getElementById('$map_id'), mapOptions);
				$styles
				$marker
				$info
				google.maps.event.addDomListener(window, 'resize', function() {
					var center = map.getCenter();
					google.maps.event.trigger(map, 'resize');
					map.setCenter(center); 
				});
			}
			google.maps.event.addDomListener(window, 'load', initialize);
		</script>";
	}
}
new MixtGoogleMaps;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Map extends WPBakeryShortCode {}
}

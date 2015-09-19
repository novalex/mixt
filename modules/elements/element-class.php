<?php

/**
 * Element Base Class
 *
 * Provides helper functions and commonly used properties for elements
 */
class Mixt_Element {

	/**
	 * @var array $animations
	 * @var array $icon_anims
	 */
	public $animations, $icon_anims;

	public function __construct() {
		$this->animations = array_merge(
			array( '' => __( 'None', 'mixt' ) ),
			mixt_css_anims('trans-in')
		);
		$this->icon_anims = array_merge(
			array( '' => __( 'None', 'mixt' ) ),
			mixt_icon_anims()
		);
	}

	/**
	 * Add animation classes to element and enqueue waypoints script
	 */
	public function element_animate($anim) {
		if ( wp_script_is('waypoints', 'registered') ) { wp_enqueue_script('waypoints'); }
		else { mixt_enqueue_plugin('waypoints'); }

		return 'mixt-animate anim-pre ' . $anim;
	}
}
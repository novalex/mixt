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
		$this->make_icon_anims();
	}

	/**
	 * Combine icon main and secondary animations to form combinations
	 */
	public function make_icon_anims() {
		$anims = array(
			'main' => array(
				'anim-pop'    => 'Pop',
				'anim-focus'  => 'Focus',
				'anim-invert' => 'Invert',
			),
			'sec' => array(
				'anim-rise'     => 'Rise',
				'anim-fall'     => 'Fall',
				'anim-go-right' => 'Go Right',
				'anim-go-left'  => 'Go Left',
				'anim-spin'     => 'Spin',
				'anim-rotate'   => 'Rotate',
				'anim-grow'     => 'Grow',
				'anim-shrink'   => 'Shrink',
			),
		);
		$this->icon_anims = array(
			'' => __( 'None', 'mixt' ),
		);
		$this->icon_anims = array_merge($this->icon_anims, $anims['main'], $anims['sec']);
		foreach ( $anims['main'] as $main_key => $main_name ) {
			foreach ( $anims['sec'] as $sec_key => $sec_name ) {
				$this->icon_anims["$main_key $sec_key"] = $main_name . ' ' . __( 'and', 'mixt' ) . ' ' . $sec_name;
			}
		}
	}

	/**
	 * Add animation classes to element and enqueue waypoints script
	 */
	public function element_animate($anim) {
		if ( wp_script_is('waypoints', 'registered') ) { wp_enqueue_script('waypoints'); }
		else { wp_enqueue_script('mixt-waypoints'); }

		return 'mixt-animate anim-pre ' . $anim;
	}
}
<?php

/*
 *You can change these to whatever you want, but be sure you still include them
 */

$shortcodes = array(
	'title' => 'CurShortcodes',
	'slug' => 'cur_shortcodes_button'
);

/*
Here's the template you should follow:

$shortcodes['name'] = array(
	'shortcode'	=> '',
	'function' => '',
	'tag'	=> '',
	'selectable' => 0
	'atts' => array(
		'name', 'name2'
	),
	'children'=> array(
		'child' => array(
			'shortcode'	=> '',
			'function' => '',
			'tag'	=> '',
			'selectable' => 0
			'atts' => array(
				'name', 'name2'
			),
		),
	)
);
*/

$shortcodes['color'] = array(
	'shortcode'	=> 'color',
	'selectable' => 1,
	'tag' => 'span',
	'children'=> array(
		'teal',
		'darkblue',
		'green',
		'grey',
	   	'lightest-grey' 
	)
);
$shortcodes['grid'] = array(
	'shortcode'	=> 'grid',
	'selectable' => 1,
	'children'=> array(
		'row',
		'quarter',
		'third',
		'half',
	   	'two-thirds' 
	)
);

$shortcodes['color-block'] = array(
	'shortcode'	=> 'color-block',
	'function' => 'cur_color_block',
	'children' => array(
		'color-block' => array(
			'shortcode'	=> 'color-block',
			'function' => 'cur_color_block',
			'selectable' => 1,
			'atts' => array(
				'class' => '',
				'size' => '',
				'shortcode' => '',
				'color' => '',
				'headline_size' => '',
				'headline_class' => ''
			)
		),

		'headline' => array(
			'shortcode'	=> 'headline',
			'function' => 'cur_color_block_headline',
			'selectable' => 1,
			'atts' => array(
				'color' => '',
				'size' => '',
				'class' => '',
			)
		),

		'content' => array(
			'shortcode'	=> 'content',
			'selectable' => 1
		),

		'footer' => array(
			'shortcode'	=> 'footer',
			'selectable' => 1
		)
	)
);



$shortcodes['button'] = array(
	'shortcode'	=> 'button',
	'function' => 'cur_button',
	'selectable' => 1,
	'atts' => array(
		'link' => '',
		'color' => '',
		'size' => '',
		'class' => '',
	)
);

$shortcodes['small'] = array(
	'shortcode'	=> 'small',
	'selectable' => 1,
	'function' => 'cur_small',
);
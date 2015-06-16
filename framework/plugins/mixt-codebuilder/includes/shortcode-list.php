<?php

/**
 * Shortcode List
 *
 * @package MIXT CodeBuilder
 */


// Shared data groups

$field_types = array(
	'text'     => __( 'Text', 'mixt' ),
	'textarea' => __( 'Textarea', 'mixt' ),
	'select'   => _x( 'Select', 'input', 'mixt' ),
	'checkbox' => __( 'Checkbox', 'mixt' ),
);

function mixt_cols_array($size = 'sm') {
	$cols = array();
	for ( $i = 1; $i <= 12; ++$i ) {
		$cols["col-$size-$i"] = $i;
	}
	return $cols;
}


// Contact Form
$mcb_elements['contact-form'] = array(
	'id'       => 'mixt-form',
	'title'    => __('Contact Form', 'mixt'),
	'template' => '[mixt_form {{attributes}}]{{child_shortcode}}[/mixt_form]',
	'params'   => array(
		'address' => array(
			'type'  => 'text',
			'label' => __( 'Email Address', 'mixt' ),
			'desc'  => __( 'Address to send the message to', 'mixt' ),
			'std'   => get_option('admin_email'),
		),
		'labels' => array(
			'type'    => 'select',
			'label'   => __( 'Label Position', 'mixt' ),
			'options' => array(
				'top'  => __( 'Top', 'mixt' ),
				'left' => __( 'Left', 'mixt' ),
			),
		),
		'btn_text' => array(
			'type'  => 'text',
			'label' => __( 'Button Text', 'mixt' ),
			'desc'  => __( 'Text on the submit button', 'mixt' ),
		),
		'action' => array(
			'type'  => 'text',
			'label' => __( 'Form Action', 'mixt' ),
			'desc'  => __( 'Set a custom action for the form', 'mixt' ),
		),
	),
	'child_shortcode' => array(
		'template' => '[mixt_field {{attributes}}]',
		'params' => array(
			'id' => array(
				'type'  => 'text',
				'label' => __( 'Field ID', 'mixt' ),
			),
			'type' => array(
				'type'    => 'select',
				'label'   => __( 'Field Type', 'mixt' ),
				'options' => $field_types,
			),
			'label' => array(
				'type'  => 'text',
				'label' => __( 'Field Label', 'mixt' ),
			),
			'required' => array(
				'type' => 'checkbox',
				'label' => __( 'Required', 'mixt' ),
			),
			'cols' => array(
				'type'    => 'select',
				'label'   => __( 'Columns', 'mixt' ),
				'options' => mixt_cols_array('sm'),
			),
		),
		'presets' => array(
			'name' => array(
				'id'       => 'name',
				'type'     => 'text',
				'label'    => __( 'Name', 'mixt' ),
				'required' => true,
				'cols'     => 6,
			),
			'email' => array(
				'id'       => 'email',
				'type'     => 'text',
				'label'    => __( 'Email Address', 'mixt' ),
				'required' => true,
				'cols'     => 6,
			),
			'subject' => array(
				'id'       => 'subject',
				'type'     => 'text',
				'label'    => __( 'Subject', 'mixt' ),
				'required' => true,
				'cols'     => 12,
			),
			'message' => array(
				'id'       => 'message',
				'type'     => 'textarea',
				'label'    => __( 'Message', 'mixt' ),
				'required' => true,
				'cols'     => 12,
			),
		),
		'clone_title'  => __( 'Form Field', 'mixt' ),
		'clone_button' => __( 'Add Field', 'mixt' ),
	),
);


// Flip Card
$mcb_elements['flipcard'] = array(
	'id'       => 'mixt-flipcard',
	'title'    => __('Flip Card', 'mixt'),
	'template' => '[mixt_flipcard {{attributes}}]{{content}}[/mixt_flipcard]',
	'params'   => array(
		'content' => array(
			'type'   => 'textarea',
			'label'  => __( 'Front Side', 'mixt' ),
		),
		'back' => array(
			'type'   => 'textarea',
			'label'  => __( 'Back Side', 'mixt' ),
		),
		'dir' => array(
			'type'    => 'select',
			'label'   => __( 'Direction', 'mixt' ),
			'desc'    => __( 'Direction of the card flip', 'mixt' ),
			'options' => array(
				'vertical'   => __( 'Vertical', 'mixt' ),
				'horizontal' => __( 'Horizontal', 'mixt' ),
			),
		),
	),
);


// Google Map
$mcb_elements['map'] = array(
	'title'    => __('Map', 'mixt'),
	'id'       => 'mixt-map',
	'template' => '[mixt_map {{attributes}}]{{content}}[/mixt_map]',
	'params'   => array(
		'height' => array(
			'type'  => 'text',
			'label' => __( 'Height', 'mixt' ),
			'std'   => '300px',
		),
		'content' => array(
			'type'   => 'textarea',
			'label'  => __( 'iFrame Code', 'mixt' ),
			'encode' => true,
		),
	),
);

?><!--
$mcb_elements['button'] = array(
	'title' => __('Button', 'mixt'),
	'id' => 'mcb-button-shortcode',
	'template' => '[zilla_button {{attributes}}] {{content}} [/zilla_button]',
	'params' => array(
		'url' => array(
			'std' => 'http://example.com',
			'type' => 'text',
			'label' => __('Button URL', 'mixt'),
			'desc' => __('Add the button\'s url eg http://example.com', 'mixt')
		),
		'style' => array(
			'type' => 'select',
			'label' => __('Button Style', 'mixt'),
			'desc' => __('Select the button\'s style, ie the button\'s colour', 'mixt'),
			'options' => array(
				'grey' => 'Grey',
				'black' => 'Black',
				'green' => 'Green',
				'light-blue' => 'Light Blue',
				'blue' => 'Blue',
				'red' => 'Red',
				'orange' => 'Orange',
				'purple' => 'Purple'
			)
		),
		'size' => array(
			'type' => 'select',
			'label' => __('Button Size', 'mixt'),
			'desc' => __('Select the button\'s size', 'mixt'),
			'options' => array(
				'small' => 'Small',
				'medium' => 'Medium',
				'large' => 'Large'
			)
		),
		'type' => array(
			'type' => 'select',
			'label' => __('Button Type', 'mixt'),
			'desc' => __('Select the button\'s type', 'mixt'),
			'options' => array(
				'round' => 'Round',
				'square' => 'Square'
			)
		),
		'target' => array(
			'type' => 'select',
			'label' => __('Button Target', 'mixt'),
			'desc' => __('Set the browser behavior for the click action.', 'mixt'),
			'options' => array(
				'_self' => 'Same window',
				'_blank' => 'New window'
			)
		),
		'content' => array(
			'std' => 'Button Text',
			'type' => 'text',
			'label' => __('Button\'s Text', 'mixt'),
			'desc' => __('Add the button\'s text', 'mixt'),
		)
	)
);

/* Alert Config */

$mcb_elements['alert'] = array(
	'title' => __('Alert', 'mixt'),
	'id' => 'mcb-alert-shortcode',
	'template' => '[zilla_alert {{attributes}}] {{content}} [/zilla_alert]',
	'params' => array(
		'style' => array(
			'type' => 'select',
			'label' => __('Alert Style', 'mixt'),
			'desc' => __('Select the alert\'s style, ie the alert colour', 'mixt'),
			'options' => array(
				'white' => 'White',
				'grey' => 'Grey',
				'red' => 'Red',
				'yellow' => 'Yellow',
				'green' => 'Green'
			)
		),
		'content' => array(
			'std' => 'Your Alert!',
			'type' => 'textarea',
			'label' => __('Alert Text', 'mixt'),
			'desc' => __('Add the alert\'s text', 'mixt'),
		)

	)
);

/* Toggle Config */

$mcb_elements['toggle'] = array(
	'title' => __('Toggle', 'mixt'),
	'id' => 'mcb-toggle-shortcode',
	'template' => ' {{child_shortcode}} ', // There is no wrapper shortcode
	'notes' => __('Click \'Add Toggle\' to add a new toggle. Drag and drop to reorder toggles.', 'mixt'),
	'params' => array(),
	'child_shortcode' => array(
		'params' => array(
			'title' => array(
				'type' => 'text',
				'label' => __('Toggle Content Title', 'mixt'),
				'desc' => __('Add the title that will go above the toggle content', 'mixt'),
				'std' => 'Title'
			),
			'content' => array(
				'std' => 'Content',
				'type' => 'textarea',
				'label' => __('Toggle Content', 'mixt'),
				'desc' => __('Add the toggle content. Will accept HTML', 'mixt'),
			),
			'state' => array(
				'type' => 'select',
				'label' => __('Toggle State', 'mixt'),
				'desc' => __('Select the state of the toggle on page load', 'mixt'),
				'options' => array(
					'open' => 'Open',
					'closed' => 'Closed'
				)
			)
		),
		'template' => '[zilla_toggle {{attributes}}] {{content}} [/zilla_toggle]',
		'clone_button' => __('Add Toggle', 'mixt')
	)
);

/* Tabs Config */

$mcb_elements['tabs'] = array(
	'title' => __('Tab', 'mixt'),
	'id' => 'mcb-tabs-shortcode',
	'template' => '[zilla_tabs] {{child_shortcode}} [/zilla_tabs]',
	'notes' => __('Click \'Add Tag\' to add a new tag. Drag and drop to reorder tabs.', 'mixt'),
	'params' => array(),
	'child_shortcode' => array(
		'params' => array(
			'title' => array(
				'std' => 'Title',
				'type' => 'text',
				'label' => __('Tab Title', 'mixt'),
				'desc' => __('Title of the tab.', 'mixt'),
			),
			'content' => array(
				'std' => 'Tab Content',
				'type' => 'textarea',
				'label' => __('Tab Content', 'mixt'),
				'desc' => __('Add the tabs content.', 'mixt')
			)
		),
		'template' => '[zilla_tab {{attributes}}] {{content}} [/zilla_tab]',
		'clone_button' => __('Add Tab', 'mixt')
	)
);

/* Columns Config */

$mcb_elements['columns'] = array(
	'title' => __('Columns', 'mixt'),
	'id' => 'mcb-columns-shortcode',
	'template' => ' {{child_shortcode}} ', // There is no wrapper shortcode
	'notes' => __('Click \'Add Column\' to add a new column. Drag and drop to reorder columns.', 'mixt'),
	'params' => array(),
	'child_shortcode' => array(
		'params' => array(
			'column' => array(
				'type' => 'select',
				'label' => __('Column Type', 'mixt'),
				'desc' => __('Select the width of the column.', 'mixt'),
				'options' => array(
					'one-third' => __('One Third', 'mixt'),
					'two-third' => __('Two Thirds', 'mixt'),
					'one-half' => __('One Half', 'mixt'),
					'one-fourth' => __('One Fourth', 'mixt'),
					'three-fourth' => __('Three Fourth', 'mixt'),
					'one-fifth' => __('One Fifth', 'mixt'),
					'two-fifth' => __('Two Fifth', 'mixt'),
					'three-fifth' => __('Three Fifth', 'mixt'),
					'four-fifth' => __('Four Fifth', 'mixt'),
					'one-sixth' => __('One Sixth', 'mixt'),
					'five-sixth' => __('Five Sixth', 'mixt')
				)
			),
			'last' => array(
				'type' => 'checkbox',
				'label' => __('Last column', 'mixt'),
				'desc' => __('Set whether this is the last column.', 'mixt'),
				'default' => false
			),
			'content' => array(
				'std' => __('Column content', 'mixt'),
				'type' => 'textarea',
				'label' => __('Column Content', 'mixt'),
				'desc' => __('Add the column content.', 'mixt')
			)
		),
		'template' => '[zilla_column {{attributes}}] {{content}} [/zilla_column]',
		'clone_button' => __('Add Column', 'mixt')
	)
);

-->
<?php

// Contact Form Shortcode

add_shortcode('mixt_form', 'mixt_form_shortcode');
function mixt_form_shortcode($atts, $content = null) {
	extract( shortcode_atts( array(
		'action'   => esc_url($_SERVER['REQUEST_URI']),
		'address'  => get_option('admin_email'),
		'class'    => '',
		'labels'   => 'top',
		'btn_text' => __( 'Submit', 'mixt' ),
	), $atts ) );

	$classes = 'mixt-form form-sc row';
	if ( ! empty($class) ) $classes .= ' ' . $class;
	if ( $labels != 'top' ) $classes .= ' form-labels-' . $labels;

	$submit_button = '<button type="submit" name="mixt-form-submit" class="btn btn-primary">' . $btn_text . '</button>';
	$form_message = '';

	// Send the email
	if ( isset($_POST['mixt-form-submit']) ) {
		$name    = sanitize_text_field( $_POST['mixt-field-name'] );
		$from    = sanitize_email( $_POST['mixt-field-email'] );
		$subject = sanitize_text_field( $_POST['mixt-field-subject'] );
		$message = esc_textarea( $_POST['mixt-field-message'] );
	
		$headers = "From: $name <$from>\r\n";
	
		if ( wp_mail( $address, $subject, $message, $headers ) ) {
			$submit_button = '';
			$form_message = '<div class="alert alert-success" role="alert">' .
								__( '<strong>Message sent successfully!</strong> We will contact you shortly.', 'mixt' ) .
							'</div>';
		} else {
			$form_message = '<div class="alert alert-danger" role="alert">' .
								__( '<strong>An error occurred!</strong> Please try again later.', 'mixt' ) .
							'</div>';
		}
	}

	$html = "<form action='$action' method='post' class='$classes'>";
		$html .= do_shortcode($content);
		$html .= '<div class="submit-box col-sm-12">' . $form_message . $submit_button . '</div>';
	$html .= '</form>';

	return $html;
}


// Form Field Shortcode

add_shortcode('mixt_field', 'mixt_field_shortcode');
function mixt_field_shortcode($atts) {
	extract( shortcode_atts( array(
		'id'       => '',
		'type'     => 'text',
		'label'    => '',
		'std'      => '',
		'required' => false,
		'cols'     => 'col-s-6',
	), $atts ) );

	if ( ! empty($id) ) {
		$id = 'mixt-field-' . $id;
		if ( isset($_POST[$id]) ) $std = $_POST[$id];
	}

	$classes = 'mixt-field field-sc form-group ' . $cols;
	$input_atts = empty($id) ? '' : "id='$id' name='$id'";
	if ( $required ) $input_atts .= ' required';
	$input_classes = 'form-control';

	switch ( $type ) {
		case 'text':
			$input = "<input type='text' $input_atts class='$input_classes' value='$std' />";
			break;
		case 'textarea':
			$input = "<textarea $input_atts rows='4' class='$input_classes'>$std</textarea>";
			break;
		case 'checkbox':
			$input = "<input type='checkbox' $input_atts class='$input_classes' value='true' " . ( $std == true ? 'checked' : '' ) . ">";
			break;
		default:
			$input = '<p>Invalid input type!</p>';
			break;
	}

	$html = "<fieldset class='$classes'>";
	if ( ! empty($label) ) {
		if ( $required ) $label .= ' <small class="req">*</small>';
		$html .= "<label for='$id'>$label</label>";
	}
	$html .= $input . "</fieldset>";

	return $html;
}

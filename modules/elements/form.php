<?php

/**
 * Form Element
 */
class Mixt_Form {

	/**
	 * @var array $field_types
	 * @var array $columns
	 */
	public $field_types, $columns;
	
	function __construct() {
		$this->field_types = array(
			'text'     => __( 'Text', 'mixt' ),
			'password' => __( 'Password', 'mixt' ),
			'textarea' => __( 'Textarea', 'mixt' ),
			'checkbox' => __( 'Checkbox', 'mixt' ),
		);
		$this->columns = array(
			'col-sm-2'  => __( '2 Columns', 'mixt' ),
			'col-sm-4'  => __( '4 Columns', 'mixt' ),
			'col-sm-6'  => __( '6 Columns', 'mixt' ),
			'col-sm-8'  => __( '8 Columns', 'mixt' ),
			'col-sm-10' => __( '10 Columns', 'mixt' ),
			'col-sm-12' => __( '12 Columns', 'mixt' ),
		);
		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_form', array($this, 'form_shortcode'));
		add_shortcode('mixt_field', array($this, 'field_shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_form',
			'title'    => __( 'Form', 'mixt' ),
			'template' => '[mixt_form {{attributes}}]{{nested}}[/mixt_form]',
			'params'   => array(
				'form_type' => array(
					'type'    => 'select',
					'label'   => __( 'Form Type', 'mixt' ),
					'std'     => 'contact',
					'options' => array(
						'contact' => __( 'Contact', 'mixt' ),
						'custom'  => __( 'Custom', 'mixt' ),
					),
				),
				'address' => array(
					'type'     => 'text',
					'label'    => __( 'Email Address', 'mixt' ),
					'desc'     => __( 'Address to send the message to', 'mixt' ),
					'std'      => get_option('admin_email'),
					'required' => array('form_type', '=', 'contact'),
				),
				'action' => array(
					'type'     => 'text',
					'label'    => __( 'Form Action', 'mixt' ),
					'desc'     => __( 'Set a custom action for the form', 'mixt' ),
					'required' => array('form_type', '=', 'custom'),
				),
				'labels' => array(
					'type'    => 'select',
					'label'   => __( 'Label Display', 'mixt' ),
					'std'     => 'top',
					'options' => array(
						'top'  => __( 'Top', 'mixt' ),
						'left' => __( 'Left', 'mixt' ),
						'none' => __( 'Hidden', 'mixt' ),
					),
				),
				'btn_text' => array(
					'type'  => 'text',
					'label' => __( 'Button Text', 'mixt' ),
					'desc'  => __( 'Text on the submit button', 'mixt' ),
					'std'   => __( 'Submit', 'mixt' ),
				),
				'button' => array(
					'type'  => 'button',
					'label' => __( 'Button Style', 'mixt' ),
					'std'   => 'color:primary',
				),
				'btn_cols' => array(
					'type'    => 'select',
					'label'   => __( 'Button Columns', 'mixt' ),
					'options' => $this->columns,
					'std'     => 'col-sm-4',
				),
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
			'nested' => array(
				'template' => '[mixt_field {{attributes}}]',
				'params' => array(
					'id' => array(
						'type'  => 'text',
						'label' => __( 'Field ID', 'mixt' ),
					),
					'type' => array(
						'type'    => 'select',
						'label'   => __( 'Field Type', 'mixt' ),
						'options' => $this->field_types,
						'std'     => 'text',
					),
					'label' => array(
						'type'  => 'text',
						'label' => __( 'Field Label', 'mixt' ),
					),
					'placeholder' => array(
						'type'  => 'text',
						'label' => __( 'Placeholder', 'mixt' ),
					),
					'required' => array(
						'type' => 'checkbox',
						'label' => __( 'Required', 'mixt' ),
					),
					'cols' => array(
						'type'    => 'select',
						'label'   => __( 'Columns', 'mixt' ),
						'options' => $this->columns,
						'std'     => 'col-sm-12',
					),
				),
				'presets' => array(
					array(
						'id'          => 'name',
						'type'        => 'text',
						'label'       => __( 'Name', 'mixt' ),
						'placeholder' => __( 'Name', 'mixt' ),
						'required'    => true,
						'cols'        => 'col-sm-4',
					),
					array(
						'id'          => 'email',
						'type'        => 'text',
						'label'       => __( 'Email Address', 'mixt' ),
						'placeholder' => __( 'Email Address', 'mixt' ),
						'required'    => true,
						'cols'        => 'col-sm-4',
					),
					array(
						'id'          => 'subject',
						'type'        => 'text',
						'label'       => __( 'Subject', 'mixt' ),
						'placeholder' => __( 'Subject', 'mixt' ),
						'required'    => true,
						'cols'        => 'col-sm-4',
					),
					array(
						'id'          => 'message',
						'type'        => 'textarea',
						'label'       => __( 'Message', 'mixt' ),
						'placeholder' => __( 'Message', 'mixt' ),
						'required'    => true,
						'cols'        => 'col-sm-12',
					),
				),
				'child_title'  => __( 'Form Field', 'mixt' ),
				'clone_button' => __( 'Add Field', 'mixt' ),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		// Form
		vc_map( array(
			'name'        => __( 'Form', 'mixt' ),
			'description' => __( 'A form with custom fields', 'mixt' ),
			'base'        => 'mixt_form',
			'icon'        => 'mixt_form',
			'category'    => 'MIXT',
			'as_parent'   => array('only' => 'mixt_field'),
			'js_view'     => 'VcColumnView',
			'params'      => array(
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Form Type', 'mixt' ),
					'param_name'  => 'form_type',
					'value'       => array(
						__( 'Contact', 'mixt' ) => 'contact',
						__( 'Custom', 'mixt' )  => 'custom',
					),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Email Address', 'mixt' ),
					'description' => __( 'Address to send the message to', 'mixt' ),
					'param_name'  => 'address',
					'value'       => get_option('admin_email'),
					'dependency'  => array( 'element' => 'form_type', 'value' => 'contact' ),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Form Action', 'mixt' ),
					'description' => __( 'Set a custom action for the form', 'mixt' ),
					'param_name'  => 'action',
					'dependency'  => array( 'element' => 'form_type', 'value' => 'custom' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Label Position', 'mixt' ),
					'param_name'  => 'labels',
					'value'       => array(
						__( 'Top', 'mixt' )  => 'top',
						__( 'Left', 'mixt' ) => 'left',
						__( 'Hidden', 'mixt' ) => 'none',
					),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Button Text', 'mixt' ),
					'description' => __( 'Text on the submit button', 'mixt' ),
					'param_name'  => 'btn_text',
				),
				array(
					'type'       => 'button',
					'heading'    => __( 'Button Style', 'mixt' ),
					'param_name' => 'button',
					'std'        => 'color:primary',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Button Columns', 'mixt' ),
					'param_name' => 'btn_cols',
					'value'      => array_flip($this->columns),
					'std'        => 'col-sm-4',
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Extra Classes', 'mixt' ),
					'param_name'  => 'class',
				),
			),
		) );

		// Field
		vc_map( array(
			'name'        => __( 'Form Field', 'mixt' ),
			'base'        => 'mixt_field',
			'icon'        => 'mixt_form',
			'category'    => 'MIXT',
			'as_child'    => array('only' => 'mixt_form'),
			'params'      => array(
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Field ID', 'mixt' ),
					'param_name'  => 'id',
					'admin_label' => true,
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Field Type', 'mixt' ),
					'param_name' => 'type',
					'value'      => array_flip($this->field_types),
					'std'        => 'text',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Field Label', 'mixt' ),
					'param_name' => 'label',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Placeholder', 'mixt' ),
					'param_name' => 'placeholder',
				),
				array(
					'type'       => 'checkbox',
					'heading'    => __( 'Required', 'mixt' ),
					'param_name' => 'required',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Columns', 'mixt' ),
					'param_name' => 'cols',
					'value'      => array_flip($this->columns),
					'std'        => 'col-sm-12',
				),
			),
		) );
	}

	/**
	 * Render form shortcode
	 */
	public function form_shortcode($atts, $content = null) {
		extract( shortcode_atts( array(
			'form_type' => 'contact',
			'address'   => '',
			'action'    => esc_url($_SERVER['REQUEST_URI']),
			'labels'    => 'top',
			'btn_text'  => __( 'Submit', 'mixt' ),
			'button'    => 'color:primary',
			'btn_cols'  => 'col-sm-4',
			'class'     => '',
		), $atts ) );

		$classes = 'mixt-form mixt-element form-cols row';
		if ( ! empty($class) ) $classes .= ' ' . $class;
		if ( $labels == 'none' ) { $classes .= ' form-no-labels'; }
		else if ( $labels != 'top' ) $classes .= ' form-labels-' . $labels;

		$submit_button = '<button type="submit" name="mixt-form-submit" class="' . mixt_element_button($button) . '">' . $btn_text . '</button>';
		$form_message = '';

		// Send the email
		if ( $form_type == 'contact' && $address != '' && isset($_POST['mixt-form-submit']) ) {
			$name    = sanitize_text_field($_POST['mixt-field-name']);
			$from    = sanitize_email($_POST['mixt-field-email']);
			$subject = sanitize_text_field($_POST['mixt-field-subject']);
			$message = esc_textarea($_POST['mixt-field-message']);
		
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
			$html .= '<div class="submit-box form-group ' . $btn_cols . '">' . $submit_button . '</div>';
			if ( $form_message != '' ) $html .= '<div class="alert-box col-sm-12">' . $form_message . '</div>';
		$html .= '</form>';

		return $html;
	}

	/**
	 * Render field shortcode
	 */
	public function field_shortcode($atts) {
		extract( shortcode_atts( array(
			'id'          => '',
			'type'        => 'text',
			'label'       => '',
			'placeholder' => '',
			'std'         => '',
			'required'    => false,
			'cols'        => 'col-sm-12',
		), $atts ) );

		if ( ! empty($id) ) {
			$id = 'mixt-field-' . $id;
			if ( isset($_POST[$id]) ) $std = $_POST[$id];
		}

		$classes = 'mixt-field form-group ' . $cols;
		$input_classes = 'form-control';
		$input_atts = empty($id) ? '' : "id='$id' name='$id'";
		if ( $required ) $input_atts .= ' required';
		if ( ! empty($placeholder) ) {
			if ( $required ) $placeholder .= ' *';
			$input_atts .= " placeholder='$placeholder'";
		}

		$label_html = '';
		if ( $label != '' ) {
			if ( $required ) $label .= ' <small class="req">*</small>';
			$label_html = "<label for='$id'>$label</label>";
		}

		switch ( $type ) {
			case 'text':
			case 'password':
				$input = "$label_html <input type='$type' $input_atts class='$input_classes' value='$std' />";
				break;
			case 'textarea':
				$input = "$label_html <textarea $input_atts rows='4' class='$input_classes'>$std</textarea>";
				break;
			case 'checkbox':
				$input_classes = trim(str_replace('form-control', '', $input_classes));
				$input = "<input type='checkbox' $input_atts class='$input_classes' value='true' " . ( $std == true ? 'checked' : '' ) . "> $label_html";
				break;
			default:
				$input = '<p>Invalid input type!</p>';
				break;
		}

		return "<fieldset class='$classes'>$input</fieldset>";
	}
}
new Mixt_Form;

if ( class_exists('WPBakeryShortCodesContainer') ) {
	class WPBakeryShortCode_Mixt_Form extends WPBakeryShortCodesContainer {}
}

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Field extends WPBakeryShortCode {}
}

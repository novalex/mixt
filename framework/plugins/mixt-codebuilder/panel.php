<?php

/**
 * Add CodeBuilder button to editor and render the panel
 *
 * @package MIXT\Plugins\CodeBuilder
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


class Mixt_CB_Admin {

	/** @var bool */
	protected $editor_page = false;

	/** @var array mapped elements */
	public static $elements = array();
	/** @var array available field types */
	public static $fields = array();

	public function __construct() {
		global $pagenow;
		$this->editor_page = in_array( $pagenow, array( 'post.php', 'page.php', 'post-new.php', 'post-edit.php' ) );

		do_action('mixtcb_init');

		// Add editor button and render panel HTML only if user can edit posts and pages, is on an editor page, and has rich editing enabled
		if ( ! $this->editor_page || ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) || get_user_option('rich_editing') == 'false' ) { return; }

		add_action( 'admin_head',  array($this, 'mixt_cb_add_button') );
		add_action( 'admin_footer', array($this, 'mixt_cb_panel') );
	}

	/**
	 * Add the MIXT Codebuilder button to the editor Toolbar
	 */
	public function mixt_cb_add_button() {
		add_filter( 'mce_external_plugins', array($this, 'mixt_cb_add_plugin') );
		add_filter( 'mce_buttons', array($this, 'mixt_cb_reg_button') );
	}
	public function mixt_cb_add_plugin( $plugin_array ) {
		$plugin_array['mixt_cb'] = MIXTCB_URL . '/js/mixt-cb-admin.js';
		return $plugin_array;
	}
	public function mixt_cb_reg_button( $buttons ) {
		array_push( $buttons, 'mixt_cb_button' );
		return $buttons;
	}

	/**
	 * Output the panel HTML
	 */
	public function mixt_cb_panel() {
		// Only run in add/edit screens
		if ( $this->editor_page ) { ?>
			<a href="#TB_inline?width=600&amp;height=800&amp;inlineId=mixt-cb-panel" id="mixt-cb-trigger" class="thickbox" title="<?php _e('Build Shortcode', 'mixt'); ?>"></a>

			<div id="mixt-cb-panel" style="display: none;">
				<div id="mixt-cb-wrap">
					<div id="mcb-main-select">
						<?php foreach ( self::$elements as $key => $element ) {
							echo "<div class='el-button $key'><a href='#$key'><span class='el-icon'></span><strong>{$element['title']}</strong></a></div>";
						} ?>
					</div>

					<div class="panel-load"><img src="<?php echo includes_url('js/thickbox/loadingAnimation.gif'); ?>" alt="Loading Icon"></div>

					<div class="panel-body"><?php // Elements go here ?></div>

					<div class="submit">
						<input type="button" id="mcb-add-shortcode" class="button add-sc" value="<?php _e('Add Shortcode', 'mixt'); ?>" />
						<a href="#mixt-cb-wrap" id="mcb-cancel" class="button cancel-sc" onclick="tb_remove();"><?php _e('Cancel', 'mixt'); ?></a>
					</div>
				</div>
			</div>
		<?php
		}
	}

	/**
	 * Map additional elements
	 */
	public static function map($element) {
		$key = $element['id'];
		self::$elements[$key] = $element;
	}

	/**
	 * Add a field type
	 */
	public static function add_field($name, $callback) {
		if ( is_callable($callback) ) {
			self::$fields[$name] = $callback;
		}
	}

	/**
	 * Render element HTML
	 */
	public static function render_element($key) {
		$element = self::$elements[$key];

		$clone_button = array( 'show' => false );
		$remove_button = '<a href="#" class="mcb-remove">' . __('Remove', 'mixt') . '</a>';

		$template = ' data-shortcode-template="' . $element['template'] . '"';
		if ( array_key_exists('nested', $element ) ) {
			$template .= ' data-shortcode-child-template="' . $element['nested']['template'] . '"';
		}

		$html = "<div id='$key' class='mcb-element-cont field mcb-element-field' $template>";

			$html .= '<div class="field parent-field">';
			foreach( $element['params'] as $key => $param ) {
				$html .= self::render_field($key, $param);
			}
			$html .= '</div>'; // Close .parent-field

			// Nested Elements

			if ( array_key_exists('nested', $element ) ) {
				$child = $element['nested'];
				if ( isset($child['shortcode']) ) { $html .= $child['shortcode']; }
				if ( empty($child['child_title']) ) $child['child_title'] = __( 'Child Element', 'mixt' );
				$clone_button['show'] = true;
				$clone_button['text'] = ( empty($child['clone_button']) ) ? __( 'Add Element', 'mixt' ) : $child['clone_button'];

				$html .= '<div class="mcb-sortable row">';

					// Render template (model) child
					$html .= '<div id="clone-' . $key . '" class="field child-field hidden mcb-clone-template">';
						$html .= '<div class="field-title toggle">' . $child['child_title'];
							if ( $clone_button['show'] ) { $html .= $remove_button; }
						$html .= '</div><div class="field-content">';
							foreach( $child['params'] as $key => $param ) {
								$html .= self::render_field($key, $param);
							}
						$html .= '</div>'; // Close .field-content
					$html .= '</div>'; // Close .field

					// Render Preset Fields
					if ( ! empty($child['presets']) ) {
						foreach ( $child['presets'] as $preset_param ) {
							$html .= '<div class="field child-field preset">';
								$html .= '<div class="field-title toggle">' . $child['child_title'];
									if ( $clone_button['show'] ) { $html .= $remove_button; }
								$html .= '</div><div class="field-content">';
									foreach( $child['params'] as $key => $param ) {
										$html .= self::render_field($key, $param, $preset_param);
									}
								$html .= '</div>'; // Close .field-content
							$html .= '</div>'; // Close .field
						}
					}
					
					// Clone Field Button
					if ( $clone_button['show'] ) {
						$html .= '<a id="add-' . $key . '" href="#" class="button-secondary field-repeat">' . $clone_button['text'] . '</a>';
						$clone_button['show'] = false;
					}
				$html .= '</div>'; // Close .mcb-sortable
			}

			// Display notes if provided
			if ( ! empty($element['notes']) ) { $html .= "<p class='mcb-notes'>{$element['notes']}</p>"; }

		$html .= '</div>'; // Close .mcb-element-field

		return $html;
	}


	/**
	 * Render element field HTML
	 *
	 * @param string $key
	 * @param array  $param
	 * @param array  $preset
	 */
	public static function render_field($key, $param, $preset = '') {
		$defaults = array(
			'std'  => '',
			'desc' => '',
		);
		$param = wp_parse_args($param, $defaults);

		// Set preset values
		if ( $preset != '' && is_array($preset) ) {
			foreach ( $preset as $preset_key => $preset_val ) {
				if ( $preset_key == $key ) { $param['std'] = $preset_val; }
			}
		}

		$row_atts = '';
		$row_class = 'row';
		if ( ! empty($param['required']) ) {
			$row_class .= ' requires';
			$req_data = implode($param['required'], ',');
			$row_atts .= " data-required='$req_data'";
		}

		$html = "<div class='$row_class' $row_atts>";
			$html .= "<label class='label'>{$param['label']}</label>";

			$field_atts  = "data-attr='$key'";
			if ( $param['std'] != '' ) $field_atts .= " data-std='{$param['std']}'";

			$field_class = 'mcb-input';
			if ( ! empty($param['class']) ) $field_class .= ' ' . $param['class'];

			switch ( $param['type'] ) {
				case 'text':
					$html .= "<input type='text' $field_atts class='$field_class' value='{$param['std']}'>\n";
					break;
				case 'textarea':
					$html .= "<textarea rows='5' cols='30' $field_atts class='$field_class'>{$param['std']}</textarea>\n";
					break;
				case 'encoded_textarea':
					$html .= "<textarea rows='5' cols='30' $field_atts class='$field_class' data-encode='true'>{$param['std']}</textarea>\n";
					break;
				case 'exploded_textarea':
					$exploded_value = str_replace(',', PHP_EOL, $param['std']);
					$html .= "<textarea rows='5' cols='30' $field_atts class='$field_class' data-explode='true'>$exploded_value</textarea>\n";
					break;
				case 'checkbox':
					if ( ! empty($param['options']) ) {
						$checked_std = array();
						if ( ! empty($param['std']) ) { $checked_std = explode(',', $param['std']); }
						$html .= '<div class="mcb-multi-input">';
						foreach ( $param['options'] as $value => $label ) {
							$is_checked = in_array($value, $checked_std);
							$html .= "<label class='mcb-input-cont'>$label" .
										 "<input type='checkbox' class='mcb-child-input mcb-checkbox' value='$value' " . ( $is_checked ? 'checked' : '' ) . ">" .
									 "</label>\n";
						}
						$html .= "<input type='hidden' $field_atts class='$field_class mcb-checkbox' value='{$param['std']}'></div>";
					} else {
						$is_checked = $param['std'] != false;
						$html .= "<input type='checkbox' $field_atts class='$field_class mcb-checkbox' value='true' " . ( $is_checked ? 'checked' : '' ) . ">\n";
					}
					break;
				case 'colorpicker':
					$html .= "<input type='text' $field_atts class='$field_class mcb-color' value='{$param['std']}'>\n";
					break;
				case 'media':
				case 'media_multi':
					if ( $param['type'] == 'media_multi' ) $field_atts .= ' data-multiple="true"';
					$html .= "<input type='text' $field_atts class='$field_class mcb-media-select' value='{$param['std']}'>\n";
					break;
				case 'select':
				case 'select_multi':
					if ( $param['type'] == 'select_multi' ) { $field_atts .= ' multiple'; }
					if ( $param['std'] == '' ) { $param['std'] = array(); }
					else { $param['std'] = explode(',', $param['std']); }
					$html .= "<select $field_atts class='$field_class'>\n";
					foreach( $param['options'] as $value => $option ) {
						if ( is_int($value) ) $value = $option;
						if ( in_array($value, $param['std']) ) {
							$html .= "<option value='$value' selected>$option</option>\n";
						} else {
							$html .= "<option value='$value'>$option</option>\n";
						}
					}
					$html .= "</select>\n";
					break;
				default:
					if ( array_key_exists($param['type'], self::$fields) ) {
						$param['key'] = $key;
						$html .= call_user_func(self::$fields[$param['type']], $param);
					} else {
						$html .= '<span class="no-field-type-msg">' . __( 'No field of type', 'mixt' ) . ' ' . $param['type'] . '!</span>';
					}
					break;
			}
			if ( ! empty($param['desc']) ) { $html .= "<span class='mcb-subtitle'>{$param['desc']}</span>\n"; }
		$html .= '</div>';

		return $html;
	}
}
new Mixt_CB_Admin;

/**
 * Map additional elements to CodeBuilder
 *
 * @param array $element
 */
function mixtcb_map($element) {
	if ( is_array($element) ) Mixt_CB_Admin::map($element);
}

/**
 * Add a field type to CodeBuilder
 * 
 * @param  string   $name     the name of the field
 * @param  callback $callback function that returns the field's markup
 */
function mixtcb_field($name, $callback) {
	Mixt_CB_Admin::add_field($name, $callback);
}

/**
 * AJAX Action to render element fields by key
 */
function mixtcb_render_element() {
	$key = $_POST['mixtcb-key'];
	$data = array(
	   'what'   => 'mixtcb_element',
	   'action' => 'render_'.$key,
	   'data'   => Mixt_CB_Admin::render_element($key)
	);
	$response = new WP_Ajax_Response($data);
	$response->send();
}
add_action( 'wp_ajax_mixtcb_element', 'mixtcb_render_element' );

<?php
/**
 * Creates the admin interface to add shortcodes to the editor
 *
 * @package  ZillaShortcodes
 * @since 2.0
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class MIXTCBAdmin {
	public $editor_page;

	public function __construct() {
		global $pagenow;
		$this->editor_page = in_array( $pagenow, array( 'post.php', 'page.php', 'post-new.php', 'post-edit.php' ) );

		add_action('admin_head',  array($this, 'mixt_cb_add_button') );
		add_action( 'admin_footer', array($this, 'mixt_cb_panel') );
	}

	/**
	 * Add the MIXT Codebuilder button to the editor Toolbar
	 */
	function mixt_cb_add_button() {
		if ( $this->editor_page == false || ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) || get_user_option('rich_editing') == 'false' ) { return; }
		add_filter( 'mce_external_plugins', array($this, 'mixt_cb_add_plugin') );
		add_filter( 'mce_buttons', array($this, 'mixt_cb_reg_button') );
	}
	function mixt_cb_add_plugin( $plugin_array ) {
		$plugin_array['mixt_cb'] = MIXTCB_URL . '/js/mixt-cb-admin.js';
		return $plugin_array;
	}
	function mixt_cb_reg_button( $buttons ) {
		array_push( $buttons, 'mixt_cb_button' );
		return $buttons;
	}

	/**
	 * Render shortcode fields
	 *
	 * @param string $key
	 * @param array $param the parameters of the input
	 */
	public function mixt_cb_render($key, $param, $preset = '') {
		$defaults = array(
			'std'    => '',
			'desc'   => '',
			'encode' => false,
		);
		$param = wp_parse_args($param, $defaults);

		// Set preset values
		if ( $preset != '' && is_array($preset) ) {
			foreach ( $preset as $preset_key => $preset_val ) {
				if ( $preset_key == $key ) { $param['std'] = $preset_val; }
			}
		}

		$field_atts = "name='$key' id='$key'";

		$html = '<div class="row">';
			$html .= "<label class='label' for='$key'>{$param['label']}</label>";
			switch ( $param['type'] ) {
				case 'text':
					$html .= "<input type='text' class='mcb-input' $field_atts value='{$param['std']}' />\n";
					break;
				case 'textarea':
					$html .= "<textarea rows='5' cols='30' $field_atts data-encode='{$param['encode']}' class='mcb-input'>{$param['std']}</textarea>\n";
					break;
				case 'select':
					$html .= "<select $field_atts class='mcb-input'>\n";

					foreach( $param['options'] as $value => $option ) {
						if ( $param['std'] == $value || $param['std'] == $option ) {
							$html .= "<option value='$value' selected>$option</option>\n";
						} else {
							$html .= "<option value='$value'>$option</option>\n";
						}
					}
					$html .= '</select>' . "\n";
					break;
				case 'checkbox':
					$is_checked = ( ! empty($param['default']) && $param['default'] && $param['std'] != false ) || $param['std'];
					$html .= "<input type='checkbox' $field_atts class='mcb-input mcb-checkbox' value='true' " . ( $is_checked ? 'checked' : '' ) . ">\n";
					break;
				default:
					break;
			}
			if ( ! empty($param['desc']) ) { $html .= "<span class='mcb-subtitle'>{$param['desc']}</span>\n"; }
		$html .= '</div>';

		return $html;
	}

	/**
	 * Output the panel HTML and JS script
	 */
	function mixt_cb_panel() {
		include(MIXTCB_DIR . '/includes/shortcode-list.php');

		// Only run in add/edit screens
		if ( $this->editor_page ) { ?>

			<a href="#TB_inline?width=600&amp;height=800&amp;inlineId=mixt-cb-panel" id="mixt-cb-trigger" class="thickbox" title="<?php _e('Build Shortcode', 'mixt'); ?>"></a>

			<div id="mixt-cb-panel" style="display: none;">
				<div id="mixt-cb-wrap">
					<div class="main-select">
						<label for="mcb-shortcode"><?php _e('Shortcode: ', 'mixt'); ?></label>
						<select name="mcb-shortcode" id="mcb-main-select">
							<option><?php _e('Select a shortcode', 'mixt'); ?></option>
							<?php
								foreach( $mcb_elements as $element ) {
									echo "<option data-title='{$element['title']}' value='{$element['id']}'>{$element['title']}</option>";
								}
							?>
						</select>
					</div>

					<?php

					$html = '';
					$clone_button = array( 'show' => false );
					$remove_button = '<a href="#" class="mcb-remove">' . __('Remove', 'mixt') . '</a>';

					foreach ( $mcb_elements as $key => $element ) {

						// Add Extra Class Field
						$element['params']['class'] = array( 'type'  => 'text', 'label' => __( 'Extra Classes', 'mixt' ) );

						$element_template = ' data-shortcode-template="' . $element['template'] . '"';
						if( array_key_exists('child_shortcode', $element ) ) {
							$element_template .= ' data-shortcode-child-template="' . $element['child_shortcode']['template'] . '"';
						}

						$html .= "<div id='{$element['id']}' class='field mcb-element-field' $element_template>";

							$html .= '<div class="field parent-field">';
							foreach( $element['params'] as $key => $param ) {
								$html .= $this->mixt_cb_render($key, $param);
							}
							$html .= '</div>'; // Close .parent-field

							if ( array_key_exists('child_shortcode', $element ) ) {
								$child = $element['child_shortcode'];
								if ( isset($child['shortcode']) ) { $html .= $child['shortcode']; }
								$clone_button['show'] = true;
								$clone_button['text'] = $child['clone_button'];

								$html .= '<div class="mcb-sortable row">';
									$html .= '<div id="clone-' . $element['id'] . '" class="field child-field hidden mcb-clone-template">';
										$html .= '<div class="field-title toggle">';
											if ( ! empty($child['clone_title']) ) { $html .= $child['clone_title']; }
											if ( $clone_button['show'] ) { $html .= $remove_button; }
										$html .= '</div><div class="field-content">';
											foreach( $child['params'] as $key => $param ) {
												$html .= $this->mixt_cb_render($key, $param);
											}
										$html .= '</div>'; // Close .field-content
									$html .= '</div>'; // Close .field

									// Render Preset Fields
									if ( ! empty($child['presets']) ) {
										foreach ( $child['presets'] as $preset => $preset_param ) {
											$html .= '<div class="field child-field preset">';
												$html .= '<div class="field-title toggle">';
													if ( ! empty($child['clone_title']) ) { $html .= $child['clone_title']; }
													if ( $clone_button['show'] ) { $html .= $remove_button; }
												$html .= '</div><div class="field-content">';
													foreach( $child['params'] as $key => $param ) {
														$html .= $this->mixt_cb_render($key, $param, $preset_param);
													}
												$html .= '</div>'; // Close .field-content
											$html .= '</div>'; // Close .field
										}
									}
								// Clone Field Button
								if ( $clone_button['show'] ) {
									$html .= '<a id="add-' . $element['id'] . '" href="#" class="button-secondary field-repeat">' . $clone_button['text'] . '</a>';
									$clone_button['show'] = false;
								}
								$html .= '</div>'; // Close .mcb-sortable
							}

							// Display notes if provided
							if ( ! empty($element['notes']) ) { $html .= "<p class='mcb-notes'>{$element['notes']}</p>"; }

						$html .= '</div>'; // Close .mcb-element-field
					}

					echo $html;
					?>

					<div class="submit">
						<input type="button" id="mcb-add-shortcode" class="button-primary" value="<?php _e('Add Shortcode', 'mixt'); ?>" />
						&nbsp;&nbsp;
						<a href="#" id="mcb-cancel" class="button-secondary" onclick="tb_remove();"><?php _e('Cancel', 'mixt'); ?></a>
					</div>
				</div>
			</div>

		<?php
		}
	}
}

new MIXTCBAdmin;
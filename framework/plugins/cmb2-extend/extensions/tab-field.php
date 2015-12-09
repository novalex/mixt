<?php

/**
 * Tab field type
 * 
 * Author: novalex
 * Author URI: http://novalx.com
 */

function mixt_cmb_tab_render_field( $field, $escaped_value, $object_id, $object_type, $field_type ) {
	static $i = 0;
	$class = ( $i === 0 ) ? ' show' : '';
	echo "<div id='mixt-tab-{$field->args['id']}' class='mixt-tab-field$class'>";
	$i++;
}
add_action( 'cmb2_render_tab', 'mixt_cmb_tab_render_field', 10, 5 );

function mixt_cmb_render_tab_row($args, $field) {
	$field_type = new CMB2_Types($field);
	$field_type->render();
}

function mixt_cmb_render_tab_close_row($args, $field) {
	echo '</div><!-- Close Tab -->';
}


/**
 * Output tab handles
 */
function mixt_cmb_tab_field_handles( $object_id, $cmb ) {
	$tab_fields = array();
	foreach ( $cmb->prop('fields') as $field ) {
		if ( $field['type'] == 'tab' ) {
			$icon = ( empty($field['icon']) ) ? '' : $field['icon'];
			$tab_fields[$field['id']] = array(
				'name' => $field['name'],
				'icon' => $icon
			);
		}
	}
	
	if ( ! empty($tab_fields) ) {
		echo '<ul class="mixt-tab-handles">';
			$i = 0;
			foreach ( $tab_fields as $handle_id => $handle_att ) {
				$class = ( $i === 0 ) ? ' active' : '';
				$handle_name = $handle_att['name'];
				if ( $handle_att['icon'] != '' ) { $handle_name = "<span class='{$handle_att['icon']}'></span> $handle_name"; }
				echo "<li class='mixt-tab-handle$class'><a href='#mixt-tab-$handle_id'>$handle_name</a></li>";
				$i++;
			}
		echo '</ul>';
	}
}
add_action( 'cmb2_before_post_form_mixt_page_options', 'mixt_cmb_tab_field_handles', 10, 2 );


/**
 * Remove tab fields from the metabox fields array so they are not saved
 */
function mixt_cmb_nosave_tab( $cmb, $id ) {
	foreach ( $cmb->prop('fields') as $field ) {
		if ( $field['type'] == 'tab' || $field['type'] == 'tab-close' ) {
			$cmb->remove_field($field['id']);
		}
	}
}
add_action( 'cmb2_post_process_fields_mixt_page_options', 'mixt_cmb_nosave_tab', 10, 2 );

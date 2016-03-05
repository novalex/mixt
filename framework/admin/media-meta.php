<?php

/**
 * Custom Media Meta Fields
 *
 * @package MIXT\Admin
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


if ( ! class_exists('Mixt_Media_Meta') ) {
	/**
	 * Add custom meta fields to media / attachments
	 */
	class Mixt_Media_Meta {
		private $media_fields = array();
	
		public function __construct( $fields ) {
			$this->media_fields = $fields;
		
			add_filter( 'attachment_fields_to_edit', array($this, 'apply_filter'), 11, 2 );
			add_filter( 'attachment_fields_to_save', array($this, 'save_fields'), 11, 2 );
		}
	
		public function apply_filter( $form_fields, $post = null ) {
			if ( ! empty( $this->media_fields ) ) {
				foreach ( $this->media_fields as $field => $values ) {
					if ( ( empty($values['application']) || preg_match( '/' . $values['application'] . '/', $post->post_mime_type) ) && ! in_array( $post->post_mime_type, $values['exclusions'] ) ) {
						$meta = get_post_meta( $post->ID, "_mixt_$field", true );
		
						switch ( $values['input'] ) {
							default:
							case 'text':
								$values['input'] = 'text';
								break;
							case 'textarea':
								$values['input'] = 'textarea';
								break;
							case 'select':
								$values['input'] = 'html';
								$html = '<select class="widefat" name="attachments['. $post->ID .']['. $field .']">';
								if ( isset( $values['options'] ) ) {
									foreach ( $values['options'] as $k => $v ) {
										$selected = ( $meta == $k ) ? ' selected="selected"' : '';
										$html .= '<option' . $selected . ' value="' . $k . '">' . $v . '</option>';
									}
								}
								$html .= '</select>';
								$values['html'] = $html;
								break;
						}
						$values['value'] = $meta;
						$form_fields[$field] = $values;
					}
				}
			}
			return $form_fields;
		}
	
		public function save_fields( $post, $attachment ) {
			if ( ! empty( $this->media_fields ) ) {
				foreach ( $this->media_fields as $field => $values ) {
					if ( isset( $attachment[$field] ) ) {
						if ( strlen( trim( $attachment[$field] ) ) == 0 ) {
							$post['errors'][$field]['errors'][] = $values['error_text'];
						} else {
							update_post_meta( $post['ID'], "_mixt_$field", $attachment[$field] );
						}
					}
					else {
						delete_post_meta( $post['ID'], "_mixt_$field" );
					}
				}
			}
		
			return $post;
		}
	
	}
}
$media_meta_fields = array(
	'luminosity' => array(
		'label'   => esc_html__( 'Luminosity', 'mixt' ),
		'input'   => 'select',
		'options' => array(
			'none'  => '-',
			'light' => esc_html__( 'Light', 'mixt' ),
			'dark'  => esc_html__( 'Dark', 'mixt' ),
		),
		'application' => 'image',
		'exclusions'  => array('audio', 'video'),
	)
);
new Mixt_Media_Meta( $media_meta_fields );

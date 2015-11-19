<?php

/**
 * MIXT Menu Item Custom Fields Config
 *
 * @package  MIXT\Plugins\Menu_Item_Custom_Fields
 * @version  0.3.0
 * @author   Dzikri Aziz <kvcrvt@gmail.com>
 */

class Mixt_Menu_Item_Custom_Fields {

	/**
	 * @var    array
	 * @access protected
	 * @since  0.2.0
	 */
	protected static $fields = array();


	/**
	 * Initialize plugin
	 */
	public static function init() {
		add_action( 'wp_nav_menu_item_custom_fields', array( __CLASS__, '_fields' ), 2, 4 );
		add_action( 'wp_update_nav_menu_item', array( __CLASS__, '_save' ), 10, 3 );
		add_filter( 'manage_nav-menus_columns', array( __CLASS__, '_columns' ), 99 );

		self::$fields = array(
			'icon' => array(
				'label' => __('Menu Icon', 'mixt'),
				'thin'  => true,
			),
			'no_label' => array(
				'label' => __('No Label', 'mixt'),
				'type'  => 'checkbox',
				'thin'  => true,
			),
			'disabled' => array(
				'label' => __('Disabled', 'mixt'),
				'type'  => 'checkbox',
				'thin'  => true,
			),
			'megamenu' => array(
				'label' => __('Mega Menu', 'mixt'),
				'type'  => 'checkbox',
				'thin'  => true,
				'depth' => 0,
			),
			'type' => array(
				'label' => 'Type',
				'type'  => 'hidden',
				'thin'  => true,
			),
		);
	}


	/**
	 * Save custom field value
	 *
	 * @wp_hook action wp_update_nav_menu_item
	 *
	 * @param int   $menu_id         Nav menu ID
	 * @param int   $menu_item_db_id Menu item ID
	 * @param array $menu_item_args  Menu item data
	 */
	public static function _save( $menu_id, $menu_item_db_id, $menu_item_args ) {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		check_admin_referer( 'update-nav_menu', 'update-nav-menu-nonce' );

		foreach ( self::$fields as $_key => $label ) {
			$key = 'mixt-menu-item-' . str_replace('_', '-', $_key);
			$u_key = '_mixt_menu_item_' . $_key;

			// Sanitize
			if ( ! empty( $_POST[$key][$menu_item_db_id] ) ) {
				if ( $_key == 'icon' ) {
					$value = array_map('sanitize_html_class', explode(' ', $_POST[$key][$menu_item_db_id]));
				} else {
					$value = sanitize_key($_POST[$key][$menu_item_db_id]);
				}
			} else {
				$value = null;
			}

			// Update
			if ( ! is_null( $value ) ) {
				update_post_meta( $menu_item_db_id, $u_key, $value );
			} else {
				delete_post_meta( $menu_item_db_id, $u_key );
			}
		}
	}


	/**
	 * Print field
	 *
	 * @param object $item  Menu item data object.
	 * @param int    $depth  Depth of menu item. Used for padding.
	 * @param array  $args  Menu item args.
	 * @param int    $id    Nav menu ID.
	 *
	 * @return string Form fields
	 */

	public static function _fields( $id, $item, $item_depth, $args ) {
		foreach ( self::$fields as $_key => $arrval ) :

			if ( is_array($arrval) ) {
				$label  = ( array_key_exists('label', $arrval) ) ? $arrval['label'] : '';
				$ftype  = ( array_key_exists('type', $arrval)  ) ? $arrval['type'] : 'text';
				$depth  = ( array_key_exists('depth', $arrval) ) ? $arrval['depth'] : false;
				$fwidth = ( array_key_exists('thin', $arrval) && $arrval['thin'] === true ) ? 'description-thin' : 'description-wide';
			} else {
				$label = $arrval;
				$ftype = 'text';
				$depth = false;
				$fwidth = 'description-wide';
			}

			$key   = sprintf( 'mixt-menu-item-%s', str_replace('_', '-', $_key) );
			$type  = sprintf( 'edit-%s', $key );
			$id    = sprintf( '%s-%s', $type, $item->ID );
			$name  = sprintf( '%s[%s]', $key, $item->ID );
			$class = sprintf( 'field-mixt-%s', $_key ) . ' ' . $fwidth;

			$fval  = ( $ftype == 'checkbox' ) ? 'true' : '';                       // Set checkbox input value
			$dbval = get_post_meta( $item->ID, '_mixt_menu_item_' . $_key, true ); // Get value stored in database
			if ( $_key == 'icon' && is_array($dbval) ) {
				$dbval = implode(' ', (array) $dbval);
			}
			$value = ( $fval != '' ) ? $fval : $dbval; // The input value
			$fattr = '';                               // Additional input attribute(s)

			if ( $ftype == 'checkbox' ) {
				$field_string = '<label for="%1$s"><input type="%6$s" id="%1$s" class="widefat code %2$s %1$s" name="%4$s" value="%5$s" %7$s/> %3$s</label>';
				if ( $dbval == 'true' ) { $fattr .= 'checked '; }
			} else {
				$field_string = '<label for="%1$s">%3$s<br /><input type="%6$s" id="%1$s" class="widefat code %2$s %1$s" name="%4$s" value="%5$s" %7$s/></label>';
			}

			$cont_attr = $ftype == 'hidden' ? 'style="display: none;"' : '';

			// Output Field

			if ($depth === false || $item_depth == $depth) :
				echo '<p class="' . esc_attr( $class ) . ' description"' . $cont_attr . '>';
					printf(
						$field_string,
						esc_attr( $id ),
						esc_attr( $type ),
						esc_html( $label ),
						esc_attr( $name ),
						esc_attr( $value ),
						esc_attr( $ftype ),
						esc_attr( $fattr )
					);
				echo '</p>';
			endif;

		endforeach;
	}


	/**
	 * Add our fields to the screen options toggle
	 *
	 * @param array $columns Menu item columns
	 * @return array
	 */
	public static function _columns( $columns ) {
		$_fields = array();

		foreach ( self::$fields as $_key => $arrval ) :
			if ( is_array($arrval) ) {
				if ( empty($arrval['type']) || $arrval['type'] != 'hidden' ) {
					$_fields[$_key] = $arrval['label'];
				}
			} else {
				$_fields[$_key] = $arrval;
			}
		endforeach;

		$columns = array_merge( $columns, $_fields );

		return $columns;
	}
}

Mixt_Menu_Item_Custom_Fields::init();

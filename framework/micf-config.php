<?php

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
			'no-label' => array(
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
			$key = sprintf( 'menu-item-mixt-%s', $_key );

			// Sanitize
			if ( ! empty( $_POST[ $key ][ $menu_item_db_id ] ) ) {
				// Do some checks here...
				$value = $_POST[ $key ][ $menu_item_db_id ];
			}
			else {
				$value = null;
			}

			// Update
			if ( ! is_null( $value ) ) {
				update_post_meta( $menu_item_db_id, $key, $value );
			}
			else {
				delete_post_meta( $menu_item_db_id, $key );
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

			$key   = sprintf( 'menu-item-mixt-%s', $_key );
			$type  = sprintf( 'edit-%s', $key );
			$id    = sprintf( 'edit-%s-%s', $key, $item->ID );
			$name  = sprintf( '%s[%s]', $key, $item->ID );
			$class = sprintf( 'field-mixt-%s', $_key ) . ' ' . $fwidth;

			$fval  = $ftype == 'checkbox' ? 'true' : '';     // Set checkbox input value
			$dbval = get_post_meta( $item->ID, $key, true ); // Get value stored in database
			$value = $fval != '' ? $fval : $dbval;           // The input value
			$fattr = '';                                     // Additional input attribute(s)

			if ($ftype == 'checkbox' && $dbval == 'true') {
				$fattr .= 'checked ';
			}

			$cont_attr = $ftype == 'hidden' ? 'style="display: none;"' : '';

			// Output Field

			if ($depth === false || $item_depth == $depth) :
				echo '<p class="' . esc_attr( $class ) . ' description"' . $cont_attr . '>';
					printf(
						'<label for="%1$s">%3$s<br /><input type="%6$s" id="%1$s" class="widefat %2$s %1$s" name="%4$s" value="%5$s" %7$s/></label>',
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
				$_fields[$_key] = $arrval['label'];
			} else {
				$_fields[$_key] = $arrval;
			}
		endforeach;

		$columns = array_merge( $columns, $_fields );

		return $columns;
	}
}

Mixt_Menu_Item_Custom_Fields::init();

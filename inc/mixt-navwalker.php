<?php

/**
 * Custom MIXT Nav Walker
 *
 * Class Name: mixt_navwalker
 * Description: Custom WordPress Nav Walker Class For The MIXT Theme
 * Version: 1.0
 *
 * Based on:
 * https://github.com/twittem/wp-bootstrap-navwalker by Edward McIntyre - @twittem
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

class mixt_navwalker extends Walker_Nav_Menu {

	/**
	 * @see Walker::start_lvl()
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param int $depth Depth of page. Used for padding.
	 */

	function start_lvl( &$output, $depth = 0, $args = array() ) {

		$indent = str_repeat( "\t", $depth );

		// Check If Item Is Top Level Menu

		if ( $depth == 0 ) {
			$output .= "\n$indent<ul class=\"submenu dropdown-menu\">\n";
		} else {
			$output .= "\n$indent<ul class=\"submenu\">\n";
		}

	}

	/**
	 * @see Walker::start_el()
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param object $item Menu item data object.
	 * @param int $depth Depth of menu item. Used for padding.
	 * @param int $current_page Menu item ID.
	 * @param object $args
	 */

	function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

		global $wp_query;
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		// Determine Whether The Item Is A Divider Or Regular Menu Item

		if ( strcasecmp($item->title, 'divider' ) == 0) {
			$output .= $indent . '<li class="divider">';
		} else {

			$class_names = $value = '';
			$classes     = empty( $item->classes ) ? array() : (array) $item->classes;
			$classes[]   = ($item->current) ? 'active' : '';
			$classes[]   = 'menu-item-' . $item->ID;
			$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );

			// Check If Item Is Disabled

			$is_disabled = ( get_post_meta($item->ID, 'menu-item-disabled', true) !== '' ) ? true : false;
			if ( $is_disabled == true ) {
				$class_names .= ' disabled';
			}

			// Check If Item Is Mega Menu

			if ( !function_exists('is_megamenu_check') ) {
				function is_megamenu_check($itemID) {
					return get_post_meta($itemID, 'menu-item-megamenu', true);
				}
			}
			$is_megamenu = 'is_megamenu_check';

			if ( $args->has_children ) {
				if ( $depth === 0 ) {
					$class_names .= ' dropdown';

					if ( $is_megamenu($item->ID) == 'true' ) {
						$class_names .= ' mega-menu';
					} else {
						$class_names .= ' drop-menu';
					}
				} else if ( $depth > 0 ) {
					$class_names .= ' drop-submenu arrow-right';
				}
			}

			// Create Mega Menu Columns

			if ( $depth == 1 && $is_megamenu($item->menu_item_parent) == 'true' ) {
				$class_names = str_replace( array(' drop-submenu', ' arrow-right'), array(' mega-menu-column', ''), $class_names );
			}

			// Start Constructing Item

			$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

			$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
			$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

			$output .= $indent . '<li' . $id . $value . $class_names .'>';

			$attr_href = ( $is_disabled == true ) ? '#' : $item->url;

			$attributes  = !empty( $item->target )  ? ' target="' . esc_attr( $item->target ) . '"' : '';
			$attributes .= !empty( $item->xfn )     ? ' rel="'    . esc_attr( $item->xfn    ) . '"' : '';
			$attributes .= !empty( $attr_href )     ? ' href="'   . esc_attr( $item->url    ) . '"' : '';
			$attributes .= ( $args->has_children )  ? ' data-toggle="dropdown" data-target="#" class="dropdown-toggle disabled"' : '';

			$item_output = $args->before;

			// Add Menu Icons

			$menu_icon = get_post_meta($item->ID, 'menu-item-menuicon', true);

			if ( !empty($menu_icon) ) {
				$item_output .= '<a'. $attributes .'><i class="menu-icon ' . esc_attr( $menu_icon ) . '"></i>&nbsp;';
			} else {
				$item_output .= '<a'. $attributes .'>';
			}

			$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;

			// Add Drop Arrows

			if ( $args->has_children ) {
				if ( $depth === 0 ) {
					$item_output .= ' <span class="drop-arrow icon-chevron-down"></span>';
				}
				if ( $depth > 0 ) {
					if ( $is_megamenu($item->menu_item_parent) == 'true' ) {
						$item_output .= ' <span class="drop-arrow icon-chevron-down visible-xs-inline-block"></span>';
					} else {
						$item_output .= ' <span class="drop-arrow icon-chevron-right"></span>';
					}
				}
			}

			$item_output .= '</a>' . $args->after;

			$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
		}
	}

	/**
	 * Traverse elements to create list from elements.
	 *
	 * Display one element if the element doesn't have any children otherwise,
	 * display the element and its children. Will only traverse up to the max
	 * depth and no ignore elements under that depth.
	 *
	 * This method shouldn't be called directly, use the walk() method instead.
	 *
	 * @see Walker::start_el()
	 * @since 2.5.0
	 *
	 * @param object $element Data object
	 * @param array $children_elements List of elements to continue traversing.
	 * @param int $max_depth Max depth to traverse.
	 * @param int $depth Depth of current element.
	 * @param array $args
	 * @param string $output Passed by reference. Used to append additional content.
	 * @return null Null on failure with no changes to parameters.
	 */

	function display_element( $element, &$children_elements, $max_depth, $depth, $args, &$output ) {

		if ( !$element ) { return; }

		$id_field = $this->db_fields['id'];

		// Display This Element
		if ( is_object( $args[0] ) ) {
			$args[0]->has_children = ! empty( $children_elements[$element->$id_field] );
		}

		parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
	}
}
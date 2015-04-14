<?php

/**
 * MIXT Nav Walker
 *
 * Class Name: mixt_navwalker
 * Description: Custom WordPress Nav Walker Class For The MIXT Theme
 * Version: 1.0
 *
 * @package MIXT
 *
 * Based on:
 * https://github.com/twittem/wp-bootstrap-navwalker by Edward McIntyre - @twittem
 * License: GPL-2.0+
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
			$output .= "\n$indent<ul class=\"sub-menu dropdown-menu\">\n";
		} else {
			$output .= "\n$indent<ul class=\"sub-menu\">\n";
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

		global $wp_query, $mixt_opt;

		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';
		$item_type = mixt_meta('menu-item-mixt-type', $item->ID);

		if ( $item_type == 'divider' ) {
		// DIVIDER

			if ( $depth === 0 ) {
				$output .= $indent . '<li class="divider">';
			}

		} else if ( $item_type == 'social-icons' ) {
		// SOCIAL ICON LIST

			$output .= $indent . '<li class="menu-social-icons">' . mixt_social_profiles(false);

		} else {
		// REGULAR MENU ITEM

			$class_names = $value = '';
			$classes     = empty( $item->classes ) ? array() : (array) $item->classes;
			$classes[]   = ($item->current) ? 'active' : '';
			$classes[]   = 'menu-item-' . $item->ID;
			$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );

			// Remove unused classes
			$unused_classes = array(
				' menu-item-type-custom',
				' menu-item-object-custom',
				' menu-item-type-post_type',
				' menu-item-object-page',
				' current-page-ancestor',
				' current-page-parent',
				' current_page_parent',
				' current_page_ancestor',
			);
			$class_names = str_replace( $unused_classes, '', $class_names );

			// Add Active Class To Menu Parents & Ancestors
			if ( strpos($class_names, 'current-menu-parent') !== false || strpos($class_names, 'current-menu-ancestor') !== false ) {
				$class_names .= ' active';
			}


			// CHECK FOR CUSTOM ITEMS
			$is_search = $is_button = $is_disabled = $no_label = false;

			// Item Type Search Form
			if ( $item_type == 'search' ) { $is_search = true; }

			// Item Type Button
			else if ( $item_type == 'button' ) { $is_button = true; }

			// Check If Item Label Is Disabled
			$no_label = mixt_meta('menu-item-mixt-no-label', $item->ID);
			if ( $no_label == 'true' ) {
				$class_names .= ' no-label';
			}

			// Check If Item Is Disabled
			$is_disabled = mixt_meta('menu-item-mixt-disabled', $item->ID);
			if ( $is_disabled == 'true' ) {
				$class_names .= ' disabled';
			}

			// Check If Item Is Mega Menu
			if ( ! function_exists('is_megamenu_check') ) {
				function is_megamenu_check( $item_ID ) {
					return mixt_meta('menu-item-mixt-megamenu', $item_ID);
				}
			}
			$is_megamenu = 'is_megamenu_check';

			// GET SETTINGS
			$has_menu_icons = isset($mixt_opt['nav-menu-icons']) ? $mixt_opt['nav-menu-icons'] : 1;
			$has_menu_arrows = isset($mixt_opt['nav-menu-arrows']) ? $mixt_opt['nav-menu-arrows'] : 1;

			
			// APPLY CUSTOM CLASSES
			if ( $args->has_children ) {
				if ( $depth === 0 ) {
					$class_names .= ' dropdown'; // Top-level menu item

					if ( $is_megamenu($item->ID) == 'true' ) {
						$class_names .= ' mega-menu';
					} else {
						$class_names .= ' drop-menu';
					}
				} else if ( $depth > 0 ) {
					$class_names .= ' drop-submenu'; // Dropdown menu item

					if ( $has_menu_arrows != 0 ) {
						$class_names .= ' arrow-right';
					}
				}
			} else if ( $is_search ) {
				$class_names .= ' dropdown drop-menu';
			}

			// CREATE MEGA MENU COLUMNS
			if ( $depth == 1 && $is_megamenu($item->menu_item_parent) == 'true' ) {
				$class_names = str_replace( array(' drop-submenu', ' arrow-right'), '', $class_names );
				$class_names .= ' mega-menu-column';
			}

			// START CONSTRUCTING ITEM
			$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

			$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
			$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

			if ( $is_button ) {
				$output .= $indent . '<li' . $id . $value . ' class="menu-item menu-btn">';
			} else {
				$output .= $indent . '<li' . $id . $value . $class_names .'>';
			}

			// Set URL to # if item is disabled
			$attr_href = $is_disabled ? '#' : $item->url;

			$attributes  = ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) . '"' : '';
			$attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) . '"' : '';
			$attributes .= ! empty( $attr_href )        ? ' href="'   . esc_attr( $attr_href        ) . '"' : '';
			$attributes .= ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) . '"' : '';

			$attributes .= $args->has_children  ? ' data-toggle="dropdown" data-target="#" class="dropdown-toggle disabled"' : '';

			$item_output = $args->before;

			if ( $is_button ) { $item_output .= '<span class="btn-cont"><a' . $attributes . $class_names . '>'; }
			else { $item_output .= '<a' . $attributes . '>'; }

			$item_output .= $args->link_before;

			// ADD MENU ICONS
			$menu_icon = mixt_meta('menu-item-mixt-icon', $item->ID);

			if ( $has_menu_icons != 0 && ! empty($menu_icon) ) {
				$item_output .= '<i class="menu-icon ' . esc_attr( $menu_icon ) . '"></i>';
			}

			// MENU ITEM TITLE
			if ( ! $is_search ) {
				$item_output .= '<span class="menu-label">' . apply_filters( 'the_title', $item->title, $item->ID ) . '</span>';
			}

			$item_output .= $args->link_after;

			// ADD DROP ARROWS
			if ( $args->has_children ) {

				$arrow_classes = ' drop-arrow';

				if ( $has_menu_arrows == 0 ) {
					$arrow_classes .= ' visible-xs-inline-block';
				}

				if ( $depth === 0 ) {
					$item_output .= '<i class="icon-chevron-down' . $arrow_classes . '"></i>';
				} else if ( $depth > 0 ) {
					if ( $is_megamenu($item->menu_item_parent) == 'true' ) {
						if ( ! strpos($arrow_classes, 'visible-xs-inline-block') ) {
							$arrow_classes .= ' visible-xs-inline-block';
						}
						$item_output .= '<i class="icon-chevron-down' . $arrow_classes . '"></i>';
					} else {
						$item_output .= '<i class="icon-chevron-right' . $arrow_classes . '"></i>';
					}
				}
			}

			if ( $is_button ) { $item_output .= '</a></span>'; }
			else { $item_output .= '</a>'; }

			$item_output .= $args->after;

			// OUTPUT SEARCH FORM
			if ( $is_search ) {
				$item_output .= '<ul class="sub-menu dropdown-menu">' .
									'<li class="menu-item">' .
									    get_search_form(false) .
								    '</li>' .
							    '</ul>';
			}

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

		if ( ! $element ) { return; }

		$id_field = $this->db_fields['id'];

		// Display This Element
		if ( is_object( $args[0] ) ) {
			$args[0]->has_children = ! empty( $children_elements[$element->$id_field] );
		}

		parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
	}
}
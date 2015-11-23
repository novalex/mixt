<?php

/**
 * Nav Walker class and navbar functions
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Class Name: Mixt_Navwalker
 * Description: MIXT Custom Nav Walker Class
 * Version: 1.0
 *
 * Based on:
 * https://github.com/twittem/wp-bootstrap-navwalker by Edward McIntyre - @twittem
 * License: GPL-2.0+
 */
class Mixt_Navwalker extends Walker_Nav_Menu {

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
		$item_type = get_post_meta($item->ID, '_mixt_menu_item_type', true);

		// DIVIDER
		if ( $item_type == 'divider' ) {
			if ( $depth === 0 ) {
				$output .= $indent . '<li class="divider">';
			}

		// SOCIAL ICON LIST
		} else if ( $item_type == 'social-icons' ) {
			if ( $depth === 0 ) {
				$output .= $indent . '<li class="menu-social-icons">' . mixt_social_profiles(false, array('style' => 'nav'));
			}

		// WIDGET AREA
		} else if ( $item_type == 'widget' ) {
			$area_name = empty($item->title) ? 'Nav Widget Area' : $item->title;
			$area_id   = empty($item->attr_title) ? 'nav-widgets-' . $item->ID : $item->attr_title;

			if ( is_active_sidebar($area_id) ) {
				ob_start();
				dynamic_sidebar($area_id);
				$widgets_html = ob_get_clean();
				$classes     = empty( $item->classes ) ? array() : (array) $item->classes;
				$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter($classes), $item, $args ) );
				$output .= $indent . "<li class='menu-item $class_names'>$widgets_html";
			}

		// REGULAR MENU ITEM
		} else {
			$class_names = $value = '';
			$classes     = empty( $item->classes ) ? array() : (array) $item->classes;
			$classes[]   = ($item->current) ? 'active' : '';
			$classes[]   = 'menu-item-' . $item->ID;
			$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter($classes), $item, $args ) );

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


			// CHECK FOR CUSTOM ITEMS
			$is_search = $is_cart = $is_button = $is_disabled = $no_label = false;

			// Search Form item type
			if ( $item_type == 'search' ) { $is_search = true; }

			// Cart item type
			else if ( $item_type == 'cart' && class_exists('WooCommerce') ) { $is_cart = true; }

			// Button item type
			else if ( $item_type == 'button' ) { $is_button = true; }

			// Return if elements aren't supposed to be nested
			if ( ( $is_search || $is_button ) && $depth !== 0 ) {
				$output .= '';
				return;
			}

			// Check If Item Label Is Disabled
			$no_label = get_post_meta($item->ID, '_mixt_menu_item_no_label', true);
			if ( $no_label == 'true' ) {
				$class_names .= ' no-label';
			}

			// Check If Item Is Disabled
			$is_disabled = get_post_meta($item->ID, '_mixt_menu_item_disabled', true);
			if ( $is_disabled == 'true' ) {
				$class_names .= ' disabled';
			}

			// Check If Item Is Mega Menu
			if ( ! function_exists('is_megamenu_check') ) {
				function is_megamenu_check( $item_ID ) {
					return get_post_meta($item_ID, '_mixt_menu_item_megamenu', true);
				}
			}
			$is_megamenu = 'is_megamenu_check';

			// Menu Icon
			$menu_icon = ( isset($mixt_opt['nav-menu-icons']) && (bool) $mixt_opt['nav-menu-icons'] ) ? get_post_meta($item->ID, '_mixt_menu_item_icon', true) : '';
			if ( is_array($menu_icon) ) { $menu_icon = implode(' ', (array) $menu_icon); }

			// GET SETTINGS
			$has_menu_icons = ( ! empty($menu_icon) );
			$has_menu_arrows = isset($mixt_opt['nav-menu-arrows']) ? (bool) $mixt_opt['nav-menu-arrows'] : 0;

			
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
			} else if ( $is_search || $is_cart ) {
				$class_names .= ' dropdown drop-menu';
			}

			if ( $has_menu_icons ) {
				$class_names .= ' has-icon';
			}

			// Add Active Class To Menu Parents & Ancestors
			if ( ( strpos($class_names, 'current-menu-parent') !== false || strpos($class_names, 'current-menu-ancestor') !== false ) && $is_megamenu($item->menu_item_parent) != 'true' ) {
				$class_names .= ' active';
			}

			// Add active class to cart item on cart page
			if ( $is_cart ) {
				if ( is_cart() ) $class_names .= ' active';
				$item->url = esc_url( WC()->cart->get_cart_url() );
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

			$attributes .= $args->has_children  ? ' class="dropdown-toggle disabled" data-toggle="dropdown"' : '';

			$item_output = $args->before;

			if ( $is_button ) { $item_output .= '<span class="btn-cont"><a' . $attributes . $class_names . '>'; }
			else { $item_output .= '<a' . $attributes . '>'; }

			$item_output .= $args->link_before;

			// ADD MENU ICONS
			if ( $has_menu_icons ) {
				$item_output .= '<i class="menu-icon ' . esc_attr( $menu_icon ) . '"></i>';
			}

			// MENU ITEM TITLE
			$item_output .= '<span class="menu-label">' . apply_filters( 'the_title', $item->title, $item->ID ) . '</span>';

			$item_output .= $args->link_after;

			// ADD DROP ARROWS
			if ( $args->has_children ) {

				$arrow_classes = ' drop-arrow';
				if ( $has_menu_arrows == 0 ) { $arrow_classes .= ' visible-mobile'; }

				// Hardcode arrow icons for now
				$arrow_left = 'fa fa-chevron-left';
				$arrow_right = 'fa fa-chevron-right';
				$arrow_down = 'fa fa-chevron-down';

				if ( $depth === 0 ) {
					if ( Mixt_Options::get('nav', 'layout') == 'vertical' ) {
						$arrow = ( Mixt_Options::get('nav', 'vertical-pos') == 'left' ) ? $arrow_right : $arrow_left;
					} else {
						$arrow = $arrow_down;
					}
				} else if ( $depth > 0 ) {
					if ( $is_megamenu($item->menu_item_parent) == 'true' ) {
						if ( $has_menu_arrows != 0 ) {
							$arrow_classes .= ' visible-mobile';
						}
						$arrow = $arrow_down;
					} else {
						$arrow = $arrow_right;
					}
				}
				$item_output .= "<i class='$arrow $arrow_classes'></i>";
			}

			// CART ITEMS BADGE
			if ( $is_cart ) {
				$item_output .= mixt_wc_menu_badge();
			}

			if ( $is_button ) {
				$item_output .= '</a></span>';
			} else {
				$item_output .= '</a>';
			}

			$item_output .= $args->after;

			// OUTPUT SEARCH FORM / CART
			if ( $is_search || $is_cart ) {
				$item_output .= '<ul class="sub-menu dropdown-menu"><li class="menu-item">';
					if ( $is_search ) {
						$item_output .= get_search_form(false);
					} else {
						$item_output .= mixt_wc_menu_cart();
					}
				$item_output .= '</li></ul>';
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


/**
 * Register Menu Widget Areas
 */
function mixt_nav_menu_widgets() {
	$locations = get_nav_menu_locations();
	if ( array_key_exists('primary', $locations) ) {
		$menu_id = $locations['primary'];
	} else if ( array_key_exists('onepage', $locations) ) {
		$menu_id = $locations['onepage'];
	} else {
		return null;
	}
	$menu = wp_get_nav_menu_object($menu_id);
	if ( $menu ) {
		$items = wp_get_nav_menu_items($menu->term_id);
		foreach ( $items as $item ) {
			if ( $item->type != 'custom' ) continue;
			if ( get_post_meta($item->ID, '_mixt_menu_item_type', true) == 'widget' ) {
				$area_name = empty($item->title) ? 'Nav Widget Area' : $item->title;
				$area_id = empty($item->attr_title) ? 'nav-widgets-' . $item->ID : $item->attr_title;
				register_sidebar( array(
					'name' => $area_name,
					'id'   => $area_id,
					'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
					'before_title' => '<h4 class="widget-title">', 'after_title' => '</h4>',
				) );
			}
		}
	}
}
add_action('init', 'mixt_nav_menu_widgets');


if ( class_exists('WooCommerce') ) {
	/**
	 * Return the markup for the menu badge
	 */
	function mixt_wc_menu_badge() {
		$count = WC()->cart->get_cart_contents_count();
		return ( $count > 0 ) ? "<span class='badge cart-items accent-bg'>$count</span>" : '<span class="cart-items"></span>';
	}

	/**
	 * Return the markup for the menu cart item
	 */
	function mixt_wc_menu_cart() {
		$cart_items = WC()->cart->get_cart_contents_count();
		$output = '<a class="cart-contents" href="' . esc_url( WC()->cart->get_cart_url() ) . '">';
			$output .= '<span class="count">';
			if ( $cart_items > 0 ) {
				$output .= wp_kses_data( sprintf( _n( '%d item', '%d items', $cart_items, 'mixt' ), $cart_items ) ) . ' - <span class="amount">' . wp_kses_data( WC()->cart->get_cart_total() ) . '</span>';
			} else {
				$output .= __( 'No items in the cart', 'mixt' );
			}
		$output .= '</span></a>';
		return $output;
	}

	/**
	 * Update the menu cart item when products are added or removed via AJAX
	 */
	function mixt_wc_cart_fragments($fragments) {
		$fragments['li.woo-cart .cart-items'] = mixt_wc_menu_badge();
		$fragments['li.woo-cart .cart-contents'] = mixt_wc_menu_cart();
		return $fragments;
	}
	add_filter('woocommerce_add_to_cart_fragments', 'mixt_wc_cart_fragments');
}

<?php

/**
 * Redux Framework is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Redux Framework is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Redux Framework. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     ReduxFramework
 * @author      Dovy Paukstys (dovy)
 * @version     1.0.0
 *
 * This extension was modified for use with the MIXT theme
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

// Don't duplicate me!
if( ! class_exists( 'ReduxFramework_Extension_mixt_multi_input' ) ) {

	/**
	 * Main ReduxFramework custom_field extension class
	 *
	 * @since       3.1.6
	 */
	class ReduxFramework_Extension_mixt_multi_input extends ReduxFramework {

		// Protected vars
		protected $parent;
		public $extension_url;
		public $extension_dir;
		public static $theInstance;

		/**
		* Class Constructor. Defines the args for the extions class
		*
		* @since       1.0.0
		* @access      public
		* @param       array $sections Panel sections.
		* @param       array $args Class constructor arguments.
		* @param       array $extra_tabs Extra panel tabs.
		* @return      void
		*/
		public function __construct( $parent ) {
			
			$this->parent = $parent;
			if ( empty( $this->extension_dir ) ) {
				$this->extension_dir = trailingslashit( str_replace( '\\', '/', dirname( __FILE__ ) ) );
			}
			$this->field_name = 'mixt_multi_input';

			self::$theInstance = $this;

			add_filter('redux/mixt_opt/field/class/'.$this->field_name, array( &$this, 'overload_field_path' )); // Adds the local field
		}

		public function getInstance() {
			return self::$theInstance;
		}

		// Forces the use of the embeded field path vs what the core typically would use    
		public function overload_field_path($field) {
			return dirname(__FILE__).'/field_'.$this->field_name.'.php';
		}

	}
}

// Register field as customizer control
function mixt_multi_input_customizer_control() {
	class Redux_Customizer_Control_mixt_multi_input extends Redux_Customizer_Control {
		public $type = 'redux-mixt_multi_input';
	}
}
add_action('redux/extension/customizer/control/includes', 'mixt_multi_input_customizer_control');

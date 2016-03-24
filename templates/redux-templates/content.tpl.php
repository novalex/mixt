<?php
	/**
	 * The template for the main content of the panel..
	 *
	 * Override this template by specifying the path where it is stored (templates_path) in your Redux config.
	 *
	 * @author 		Redux Framework
	 * @package 	ReduxFramework/Templates
	 * @version     3.5.4.18
	 */
?>
<!-- Header Block -->
<?php $this->get_template( 'header.tpl.php' ); ?>

<div id="redux_ajax_overlay">&nbsp;</div>

<!-- Stickybar -->
<?php $this->get_template( 'header_stickybar.tpl.php' ); ?>

<!-- Intro Text -->
<?php if ( isset( $this->parent->args['intro_text'] ) ) : ?>
	<div id="redux-intro-text"><?php echo mixt_clean($this->parent->args['intro_text'], 'strip'); ?></div>
<?php endif; ?>

<?php $this->get_template( 'menu_container.tpl.php' ); ?>

<div class="redux-main">
	<?php
		foreach ( $this->parent->sections as $k => $section ) {
			if ( isset( $section['customizer_only'] ) && $section['customizer_only'] == true ) {
				continue;
			}

			$section['class'] = isset( $section['class'] ) ? ' ' . $section['class'] : '';
			echo '<div id="' . $k . '_section_group' . '" class="redux-group-tab' . $section['class'] . '" data-rel="' . $k . '">';

			// Don't display in the
			$display = true;
			if ( isset( $_GET['page'] ) && $_GET['page'] == $this->parent->args['page_slug'] ) {
				if ( isset( $section['panel'] ) && $section['panel'] == "false" ) {
					$display = false;
				}
			}

			if ( $display ) {
				$this->output_section( $k );
			}
			//}
			echo "</div>";
			//echo '</div>';
		}

		/**
		 * action 'redux/page-after-sections-{opt_name}'
		 *
		 * @deprecated
		 *
		 * @param object $this ReduxFramework
		 */
		do_action( "redux/page-after-sections-{$this->parent->args['opt_name']}", $this ); // REMOVE LATER

		/**
		 * action 'redux/page/{opt_name}/sections/after'
		 *
		 * @param object $this ReduxFramework
		 */
		do_action( "redux/page/{$this->parent->args['opt_name']}/sections/after", $this );
	?>
	<div class="clear"></div>
	<!-- Footer Block -->
	<?php $this->get_template( 'footer.tpl.php' ); ?>
	<div id="redux-sticky-padder" style="display: none;">&nbsp;</div>
</div>
<div class="clear"></div>
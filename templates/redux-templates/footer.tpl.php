<?php
	/**
	 * The template for the panel footer area.
	 * Override this template by specifying the path where it is stored (templates_path) in your Redux config.
	 *
	 * @author 		Redux Framework
	 * @package 	ReduxFramework/Templates
	 * @version     3.5.8.3
	 */
?>
<div id="redux-sticky-padder" style="display: none;">&nbsp;</div>
<div id="redux-footer-sticky">
	<div id="redux-footer">

		<div class="redux-action_bar">
			<span class="spinner"></span>
			<?php if ( false === $this->parent->args['hide_save'] ) : ?>
				<?php submit_button( esc_html__( 'Save', 'mixt' ), 'primary', 'redux_save', false  ); ?>
			<?php endif; ?>
			
			<?php if ( false === $this->parent->args['hide_reset'] ) : ?>
				<?php submit_button( esc_html__( 'Reset Section', 'redux-framework' ), 'secondary', $this->parent->args['opt_name'] . '[defaults-section]', false, array( 'id' => 'redux-defaults-section' ) ); ?>
				<?php submit_button( esc_html__( 'Reset All', 'redux-framework' ), 'secondary', $this->parent->args['opt_name'] . '[defaults]', false, array( 'id' => 'redux-defaults' ) ); ?>
			<?php endif; ?>

		</div>

		<div class="redux-ajax-loading" alt="<?php esc_attr_e( 'Working...', 'redux-framework' ) ?>">&nbsp;</div>
		<div class="clear"></div>

	</div>
</div>

<?php
	/**
	 * The template for the panel header area.
	 * Override this template by specifying the path where it is stored (templates_path) in your Redux config.
	 *
	 * @author 		Redux Framework
	 * @package 	ReduxFramework/Templates
	 * @version     3.5.4.18
	 */

    $tip_title = __( 'Developer Mode Enabled', 'redux-framework' );

    if ( $this->parent->dev_mode_forced ) {
        $is_debug     = false;
        $is_localhost = false;

        $debug_bit = '';
        if ( Redux_Helpers::isWpDebug() ) {
            $is_debug  = true;
            $debug_bit = __( 'WP_DEBUG is enabled', 'redux-framework' );
        }

        $localhost_bit = '';
        if ( Redux_Helpers::isLocalHost() ) {
            $is_localhost  = true;
            $localhost_bit = __( 'you are working in a localhost environment', 'redux-framework' );
        }

        $conjunction_bit = '';
        if ( $is_localhost && $is_debug ) {
            $conjunction_bit = ' ' . __( 'and', 'redux-framework' ) . ' ';
        }

        $tip_msg = __( 'This has been automatically enabled because', 'redux-framework' ) . ' ' . $debug_bit . $conjunction_bit . $localhost_bit . '.';
    } else {
        $tip_msg = __( 'If you are not a developer, your theme/plugin author shipped with developer mode enabled. Contact them directly to fix it.', 'redux-framework' );
    }

?>
<div id="redux-header">
	<?php if ( ! empty( $this->parent->args['display_name'] ) ) : ?>
		<div class="display_header">

			<?php if ( isset( $this->parent->args['dev_mode'] ) && $this->parent->args['dev_mode'] ) { ?>
				<div class="redux-dev-mode-notice-container redux-dev-qtip" qtip-title="<?php echo $tip_title; ?>" qtip-content="<?php echo $tip_msg; ?>">
					<span class="redux-dev-mode-notice"><?php _e( 'Developer Mode Enabled', 'redux-framework' ); ?></span>
				</div>
			<?php } ?>

			<h2 class="logo">
				<?php
				// echo $this->parent->args['display_name'];
				echo '<img src="' . MIXT_URI . '/assets/img/logo.png" alt="MIXT" />';
				?>
			</h2>

			<?php if ( ! empty( $this->parent->args['display_version'] ) ) : ?>
				<span><?php echo $this->parent->args['display_version']; ?></span>
			<?php endif; ?>

		</div>
	<?php endif; ?>

	<div class="redux-action_bar">
		<span class="spinner"></span>
		<?php if ( false === $this->parent->args['hide_save'] ) : ?>
			<?php submit_button( __( 'Save', 'mixt' ), 'primary', 'redux_save', false  ); ?>
		<?php endif; ?>
		
		<?php if ( false === $this->parent->args['hide_reset'] ) : ?>
			<?php submit_button( __( 'Reset Section', 'redux-framework' ), 'secondary', $this->parent->args['opt_name'] . '[defaults-section]', false, array( 'id' => 'redux-defaults-section' ) ); ?>
			<?php // submit_button( __( 'Reset All', 'redux-framework' ), 'secondary', $this->parent->args['opt_name'] . '[defaults]', false, array( 'id' => 'redux-defaults' ) ); ?>
		<?php endif; ?>
	</div>
	<div class="redux-ajax-loading" alt="<?php _e( 'Working...', 'redux-framework' ) ?>">&nbsp;</div>

	<div class="clear"></div>
</div>
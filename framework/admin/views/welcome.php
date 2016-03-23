<?php

$this->screen_header(
	esc_html__( 'Welcome!', 'mixt' ),
	esc_html__( 'MIXT has been successfully installed and activated! You are almost ready to start using one of the greatest themes in the world! Just a couple more steps...', 'mixt' )
);
	
	?>

	<br>

	<div class="info-box has-icon icon-l stuffbox margin-top">
		<h3>1. <?php esc_html_e( 'Read The Documentation', 'mixt' ); ?></h3>
		<p><?php esc_html_e( 'Be sure to go over the online documentation at least once, it contains a lot of useful information on how to make full use of the theme and leverage the various features it offers.', 'mixt' ); ?></p>
		<p class="action"><a href="<?php echo esc_url( $this->links['docs'] ); ?>" class="button button-primary" target="_blank"><?php esc_html_e( 'Documentation', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-book-alt"></span>
	</div>

	<div class="info-box has-icon icon-r stuffbox">
		<h3>2. <?php esc_html_e( 'Install The Plugins', 'mixt' ); ?></h3>
		<p><?php esc_html_e( 'Install and activate all the required plugins, and the ones you will be using on your website.', 'mixt' ); ?></p>
		<h4 class="green-text">Required</h4>
		<p>
			<strong>MIXT Core</strong> - <?php esc_html_e( 'will provide additional functionality as well as custom element shortcodes and portfolio', 'mixt' ); ?>
		</p>
		<p>
			<strong>Redux Framework</strong> - <?php esc_html_e( 'will enable the options panel so you can customize your website', 'mixt' ); ?>
		</p>
		<h4 class="green-text">Recommended</h4>
		<p>
			<strong>Envato WordPress Toolkit</strong> - <?php esc_html_e( 'will notify you when an update is released for the theme and you can easily download the latest version through it', 'mixt' ); ?>
		</p>
		<p>
			<strong>WPBakery Visual Composer</strong> - <?php esc_html_e( 'will enable the visual drag-and-drop page editor', 'mixt' ); ?>
		</p>
		<p class="action"><a href="<?php echo esc_url( menu_page_url( $this->links['plugins'], false ) ); ?>" class="button button-primary" target="_blank"><?php esc_html_e( 'Install Plugins', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-admin-plugins"></span>
	</div>

	<div class="info-box has-icon icon-l stuffbox">
		<h3>3. <?php esc_html_e( 'Get Help On Speed Dial', 'mixt' ); ?></h3>
		<p><?php esc_html_e( 'Sign up to have support at the ready if you ever need it! We will do our best to answer any questions as fast as possible, usually within a few hours. But first, check out the articles and do a quick search - with a bit of luck, your question might have been answered already!', 'mixt' ); ?></p>
		<p class="action"><a href="<?php echo esc_url( $this->links['support'] ); ?>" class="button button-primary" target="_blank"><?php esc_html_e( 'Get Support', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-sos"></span>
	</div>

	<div class="info-box has-icon icon-r stuffbox">
		<h3>4. <?php esc_html_e( 'Customize Everything', 'mixt' ); ?></h3>
		<p><?php esc_html_e( 'Adjust, tweak and customize every imaginable aspect of your new website with the powerful, comprehensive options panel at your disposal!', 'mixt' ); ?>
		<p><?php esc_html_e( 'With the extensive Live Customizer integration, you can SEE the perfect website take shape before your eyes!', 'mixt' ); ?></p>
		<p><?php esc_html_e( 'One-Click Demos are also available to quickly get you started with a website just like the live demos.', 'mixt' ); ?></p>
		<?php if ( class_exists( 'ReduxFramework' ) ) { ?>
			<p class="action"><a href="<?php echo esc_url( menu_page_url( $this->links['options'], false ) ); ?>" class="button button-primary" target="_blank"><?php esc_html_e( 'Customize MIXT', 'mixt' ); ?></a></p>
		<?php } else { ?>
			<p class="red-text">Redux Framework must be activated for the options panel to be enabled!</p>
		<?php } ?>
		<span class="dashicons dashicons-admin-settings"></span>
	</div>

	<br>

	<h3 class="margin-top"><?php esc_html_e( 'That&#39;s All Folks! Go Forth And Create!', 'mixt' ); ?></h3>

	<?php

$this->screen_footer();

?>
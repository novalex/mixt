<?php

$this->screen_header(
	__( 'Welcome!', 'mixt' ),
	__( 'MIXT has been successfully installed and activated! You are almost ready to start using one of the greatest themes in the world! Just a couple more steps...', 'mixt' )
);
	
	// Tabs
	$this->tabs();

	// Getting Started
	?>

	<div class="info-box has-icon icon-l stuffbox margin-top">
		<h4>1. <?php _e( 'Read The Documentation', 'mixt' ); ?></h4>
		<p><?php _e( 'Be sure to go over the online documentation at least once, it contains a lot of useful information on how to make full use of the theme and leverage the various features it offers.', 'mixt' ); ?></p>
		<p class="action"><a href="<?php echo $this->help_links['docs']; ?>" class="button button-primary" target="_blank"><?php esc_attr_e( 'Documentation', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-book-alt"></span>
	</div>

	<div class="info-box has-icon icon-r stuffbox">
		<h4>2. <?php _e( 'Install The Plugins', 'mixt' ); ?></h4>
		<p><?php _e( 'Go to the &quot;Install Plugins&quot; page and install and activate the plugins you will be using on your website.', 'mixt' ); ?></p>
		<p><?php _e( 'The "Envato WordPress Toolkit" plugin is strongly recommended, it will notify you when an update is released for the theme and you can easily download the latest version through it.', 'mixt' ); ?></p>
		<p class="action"><a href="<?php echo esc_url( admin_url( add_query_arg( array( 'page' => 'mixt-plugins' ), 'admin.php' ) ) ); ?>" class="button button-primary" target="_blank"><?php esc_attr_e( 'Install Plugins', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-admin-plugins"></span>
	</div>

	<div class="info-box has-icon icon-l stuffbox">
		<h4>3. <?php _e( 'Get Help On Speed Dial', 'mixt' ); ?></h4>
		<p><?php _e( 'Sign up to have support at the ready if you ever need it! We will do our best to answer any questions as fast as possible, usually within a few hours. But first, check out the articles and do a quick search - with a bit of luck, your question might have been answered already!', 'mixt' ); ?></p>
		<p class="action"><a href="<?php echo $this->help_links['support']; ?>" class="button button-primary" target="_blank"><?php esc_attr_e( 'Get Support', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-admin-users"></span>
	</div>

	<div class="info-box has-icon icon-r stuffbox">
		<h4>4. <?php _e( 'Customize Everything', 'mixt' ); ?></h4>
		<p><?php _e( 'Adjust, tweak and customize every imaginable aspect of your new website with the powerful, comprehensive options panel at your disposal! But you don&#39;t have to settle for blindly changing options, with the extensive Live Customizer integration, you can SEE the perfect website take shape before your eyes!', 'mixt' ); ?></p>
		<p><?php _e( 'One-Click Demos are also available to quickly get you started with a website just like the live demos.', 'mixt' ); ?></p>
		<p class="action"><a href="<?php echo esc_url( admin_url( add_query_arg( array( 'page' => 'mixt-options' ), 'admin.php' ) ) ); ?>" class="button button-primary" target="_blank"><?php esc_attr_e( 'Customize It!', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-admin-settings"></span>
	</div>

	<br>

	<h3 class="margin-top"><?php _e( 'That&#39;s All Folks! Go Forth And Create!', 'mixt' ); ?></h3>

	<?php

$this->screen_footer();

?>
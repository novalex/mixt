<?php

$this->screen_header(
	__( 'About MIXT', 'mixt'),
	__( 'Need any help? Check out the links below!', 'mixt' ) . '<p>' . $this->support_links() . '</p>'
);
	
	// Tabs
	$this->tabs();

	// Feedback
	?>

	<div class="info-box has-icon icon-r stuffbox margin-top">
		<h4><?php _e( 'Say What&#39;s On Your Mind', 'mixt' ); ?></h4>
		<p><?php _e( 'Love it or hate it, we want to know! If you&#39;ve used MIXT for a while, please rate or review it on ThemeForest. You can do that by going to your Downloads page and clicking on the number of stars you want to rate it. Easy peasy!', 'mixt' ); ?></p>
		<p class="action"><a href="http://themeforest.net/downloads" class="button button-primary" target="_blank"><?php esc_attr_e( 'Review MIXT', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-star-filled"></span>
	</div>

	<div class="info-box has-icon icon-l stuffbox">
		<h4><?php _e( 'What Would You Like To See In The Next Version?', 'mixt' ); ?></h4>
		<p><?php _e( 'Have an idea about a new feature or element you&#39;d like to see added in future versions? Let us know and we&#39;ll take it under careful consideration.', 'mixt' ); ?></p>
		<p class="action"><a href="mailto:improve@novalx.com?subject=MIXT Improvement" class="button button-primary" target="_blank"><?php esc_attr_e( 'Submit Idea', 'mixt' ); ?></a></p>
		<span class="dashicons dashicons-smiley"></span>
	</div>

	<?php

$this->screen_footer();

?>
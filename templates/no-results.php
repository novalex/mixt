<?php

/**
 * Template for displaying a message that posts cannot be found
 *
 * @package MIXT
 */

?>

<section class="article no-results not-found text-center">
	<header class="page-header">
		<h1 class="page-title"><?php _e( 'Nothing Found', 'mixt' ); ?></h1>
	</header>

	<div class="page-content row">
		<div class="col-sm-8 col-sm-offset-2">
			<?php

			if ( is_home() && current_user_can( 'publish_posts' ) ) {
				echo '<p class="margin-top-m margin-bottom-m">' .
					sprintf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'mixt' ), esc_url( admin_url( 'post-new.php' ) ) ) .
				'</p>';
			} else if ( is_search() ) {
				echo '<p class="margin-top-m margin-bottom-m">' .
					__( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'mixt' ) .
				'</p>';
				get_search_form();
			} else {
				echo '<p class="margin-top-m margin-bottom-m">' .
					__( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'mixt' ) .
				'</p>';
				get_search_form();
			}

			?>
		</div>
	</div>
</section>

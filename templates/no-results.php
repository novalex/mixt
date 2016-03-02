<?php

/**
 * Template for displaying a message that posts cannot be found
 *
 * @package MIXT
 */

?>

<section class="article no-results not-found">
	<header class="page-header">
		<h1 class="page-title accent-color"><?php _e( 'Nothing Found', 'mixt' ); ?></h1>
	</header>

	<div class="page-content">
		<?php

		if ( is_home() && current_user_can( 'publish_posts' ) ) {
			echo '<p>' . sprintf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'mixt' ), esc_url( admin_url( 'post-new.php' ) ) ) . '</p>';
		} else if ( is_search() ) {
			echo '<p>' . __( 'Sorry, but nothing matched your search terms. Please try another search.', 'mixt' ) . '</p>';
			echo '<ul class="search-suggestions color-fade">';
				echo '<li>' . __( 'Make sure there are no spelling errors', 'mixt' ) . '</li>';
				echo '<li>' . __( 'Use similar keywords, for example "image" instead of "picture"', 'mixt' ) . '</li>';
				echo '<li>' . __( 'Try to reduce the specificity of your query or use less keywords', 'mixt' ) . '</li>';
			echo '</ul>';
			get_search_form();
		} else {
			echo '<p>' . __( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'mixt' ) . '</p>';
			get_search_form();
		}

		?>
	</div>
</section>

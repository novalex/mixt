<?php

/**
 * Template for displaying a message that posts cannot be found
 *
 * @package MIXT
 */

?>

<section class="article no-results not-found">
	<header class="page-header">
		<h1 class="page-title accent-color"><?php esc_html_e( 'Nothing Found', 'mixt' ); ?></h1>
	</header>

	<div class="page-content">
		<?php

		if ( is_home() && current_user_can( 'publish_posts' ) ) {
			echo '<p>' . sprintf(
				wp_kses( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'mixt' ), array( 'a' => array( 'href' => array() ) ) ),
				esc_url( admin_url( 'post-new.php' ) )
			) . '</p>';
		} else if ( is_search() ) {
			echo '<p>' . esc_html__( 'Sorry, but nothing matched your search terms. Please try another search.', 'mixt' ) . '</p>';
			echo '<ul class="search-suggestions color-fade">';
				echo '<li>' . esc_html__( 'Make sure there are no spelling errors', 'mixt' ) . '</li>';
				echo '<li>' . esc_html__( 'Use similar keywords, for example "image" instead of "picture"', 'mixt' ) . '</li>';
				echo '<li>' . esc_html__( 'Try to reduce the specificity of your query or use less keywords', 'mixt' ) . '</li>';
			echo '</ul>';
			get_search_form();
		} else {
			echo '<p>' . esc_html__( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'mixt' ) . '</p>';
			get_search_form();
		}

		?>
	</div>
</section>

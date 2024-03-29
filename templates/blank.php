<?php

/**
 * Blank Page Template
 *
 * Template Name: Blank Page
 *
 * @package MIXT
 */

// Hide Sidebar
Mixt_Options::set('sidebar', 'enabled', false);

get_header();

?>

		<div class="container">

			<div class="row">

				<?php

				// Page Content Loop

				while ( have_posts() ) :

					the_post();

					$post_ob = new Mixt_Post('page');

					?>

					<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

						<div class="entry-body entry-content page-content"><?php

							$post_ob->content();

						?></div>
						
					</article>

					<?php

				endwhile; // End The Loop

				?>

			</div><?php // close .row ?>

		</div><?php // close .container ?>

	</div><?php // close #main-wrap-inner ?>

</div><?php // close #main-wrap ?>

<?php

wp_footer();

?>

</body>
</html>

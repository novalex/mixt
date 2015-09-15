<?php

/**
 * Blank Page Template
 *
 * Template Name: Blank Page
 *
 * @package MIXT
 */

// Hide Sidebar
Mixt_Options::set('page', 'sidebar', false);

get_header();

?>

	<div class="main-content container">
		<div class="row">

			<?php

			// Page Content Loop

			while ( have_posts() ) :

				the_post();

				$post_ob = new Mixt_Post('page');

				?>

				<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

					<div class="entry-body entry-content"><?php

						$post_ob->content();

					?></div>
					
				</article>

				<?php

			endwhile; // End The Loop

			?>

		</div><?php // close .row ?>
	</div><?php // close .main-content ?>

</div><?php // close #main-wrap ?>

<?php wp_footer(); ?>

<?php mixt_browsersync(); ?>

</body>
</html>

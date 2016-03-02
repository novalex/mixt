<?php

/**
 * One-Page Template
 *
 * Template Name: One-Page Layout
 *
 * @package MIXT
 */

get_header();

	while ( have_posts() ) : // Start The Loop

		the_post();

		$post_ob = new Mixt_Post('page');

		?>

		<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( array($post_ob->classes(), 'one-page') ); ?>>
			<div class="entry-body entry-content page-content"><?php

				$post_ob->content();

			?></div>
		</article>

		<?php

	endwhile; // End The Loop

get_footer();

?>

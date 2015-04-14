<?php

/**
 * Template For Displaying Archive Pages
 *
 * @package mixt
 */

get_header(); ?>

	<div class="content-padder">

		<?php if ( have_posts() ) : ?>

			<?php /* Start the Loop */ ?>
			<?php while ( have_posts() ) : the_post(); ?>

				<?php
					/* Include the Post-Format-specific template for the content.
					 * If you want to overload this in a child theme then include a file
					 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
					 */
					get_template_part( 'templates/content', get_post_format() );
				?>

			<?php endwhile; ?>

			<?php mixt_content_nav( 'nav-below' ); ?>

		<?php else : ?>

			<?php get_template_part( 'templates/no-results', 'archive' ); ?>

		<?php endif; ?>

	</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>

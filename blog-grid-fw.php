<?php
/*
* Masonry Blog Template - Full Width
*
* Template Name: Blog Grid FW
*
* @package mixt
*/

get_header();

	$cat_id = get_cat_ID('portfolio');
	$args = array(
	  'cat' => $cat_id,
	  'post_type' => 'post',
	  'post_status' => 'publish',
	  'posts_per_page' => -1,
	  'ignore_sticky_posts' => 0
	);
	$blog_query = null;
	$blog_query = new WP_Query($args);

	if ( have_posts() ) : while ( have_posts() ) : the_post();

	the_content();

	if( $blog_query->have_posts() ) {

		echo '<div class="grid-container">';

		while ($blog_query->have_posts()) : $blog_query->the_post();

			get_template_part( 'inc/content', 'grid' );

		endwhile;

		echo '</div>';
	
	}

	wp_reset_query(); ?>

	<?php endwhile; else : ?>
	<p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
	<?php endif; ?>

<?php get_footer(); ?>
<?php

/**
 * Template for displaying single posts
 *
 * @package MIXT
 */

$post_ob = new mixtPost('single');

?>

<article id="post-<?php the_ID() ?>" <?php post_class( $post_ob->classes() ); ?>>

	<header class="page-header">

		<?php $post_ob->header(); ?>

	</header>

	<div class="entry-body entry-content">

		<?php $post_ob->content(); ?>

		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'mixt' ),
				'after'  => '</div>',
			) );
		?>
	</div>

</article>
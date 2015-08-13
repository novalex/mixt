<?php

/**
 * Template used for displaying page content
 *
 * @package MIXT
 */

$post_ob = new Mixt_Post('page');

?>

<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

	<div class="entry-body entry-content">
		<?php
			$post_ob->content();
			
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'mixt' ),
				'after'  => '</div>',
			) );
		?>
	</div>
</article>

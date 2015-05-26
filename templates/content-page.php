<?php

/**
 * The template used for displaying page content in page.php
 *
 * @package MIXT
 */

$post_ob = new mixtPost('page-single');

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
	<?php // edit_post_link( __( 'Edit', 'mixt' ), '<footer class="entry-meta"><span class="edit-link">', '</span></footer>' ); ?>
</article>

<?php

/**
 * Template used for displaying content for blog / posts type pages
 *
 * @package MIXT
 */

$post_ob = new Mixt_Post('page');

ob_start();
$post_ob->content();
$post_content = ob_get_clean();

if ( empty($post_content) ) return;

?>

<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

	<div class="entry-body entry-content">
		<?php
			echo $post_content;
			
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'mixt' ),
				'after'  => '</div>',
			) );
		?>
	</div>
	<?php // edit_post_link( __( 'Edit', 'mixt' ), '<footer class="entry-meta"><span class="edit-link">', '</span></footer>' ); ?>
</article>

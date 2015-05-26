<?php

/**
 * Template for displaying single posts
 *
 * @package MIXT
 */

$post_ob = new mixtPost('single');

$options = array(
	'post-footer'  => array(),
);
$options = mixt_get_options($options);

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

	<?php if ( $options['post-footer'] == 'true' ) { ?>
		<footer class="entry-meta">
			<?php
				/* translators: used between list items, there is a space after the comma */
				$category_list = get_the_category_list( __( ', ', 'mixt' ) );

				$tag_list = get_the_tag_list( '<p class="tag-list">', '', '</p>' );

				if ( $tag_list != '' ) {
					echo $tag_list;
				}

				if ( ! mixt_categorized_blog() ) {
					// This blog only has 1 category so we just need to worry about tags in the meta text
					if ( '' != $tag_list ) {
						$meta_text = __( 'This entry was tagged %2$s. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'mixt' );
					} else {
						$meta_text = __( 'Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'mixt' );
					}

				} else {
					// But this blog has loads of categories so we should probably display them here
					if ( '' != $tag_list ) {
						$meta_text = __( 'This entry was posted in %1$s and tagged %2$s. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'mixt' );
					} else {
						$meta_text = __( 'This entry was posted in %1$s. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'mixt' );
					}

				} // end check for categories on this blog

				// printf(
				// 	$meta_text,
				// 	$category_list,
				// 	get_permalink(),
				// 	the_title_attribute( 'echo=0' )
				// );
			?>

			<?php // edit_post_link( __( 'Edit', 'mixt' ), '<span class="edit-link">', '</span>' ); ?>
		</footer>
	<?php } ?>

</article>

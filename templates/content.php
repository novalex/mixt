<?php

/**
 * General Content Template
 *
 * @package MIXT
 */

$post_ob = new mixtPost('blog');
$post_id = get_the_ID();

$post_classes = '';

$blog_options = array(
	'blog-type' => array(
		'return' => 'value',
	),
	'blog-columns' => array(
		'type'    => 'str',
		'return'  => 'value',
		'default' => 'col-md-4',
	),
);
$blog_options = mixt_get_options($blog_options);

$blog_grid = ( $blog_options['blog-type'] != 'standard' ) ? true : false;

?>

<article id="post-<?php echo $post_id; ?>" <?php post_class( $post_classes . $post_ob->classes() ); ?>>

	<?php if ( $blog_grid ) { echo '<div class="post-wrapper">'; } ?>

	<header class="page-header">
		<?php $post_ob->header(); ?>
	</header>

	<?php if ( is_search() || is_archive() ) : // Only display Excerpts for Search and Archive Pages ?>
		<div class="entry-body entry-summary">

			<?php the_excerpt(); ?>
			
		</div>
	<?php else : ?>
		<div class="entry-body entry-content"><?php

			$post_ob->content();

			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'mixt' ),
				'after'  => '</div>',
			) ); ?>
		</div>
	<?php endif; ?>

	<?php if ( $blog_grid ) { echo '</div>'; } // Close .post-wrapper ?>

</article>

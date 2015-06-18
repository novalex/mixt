<?php

/**
 * General Content Template
 *
 * @package MIXT
 */

$post_ob      = new mixtPost('blog');
$is_masonry   = MIXT::get('layout', 'type') == 'masonry';

?>

<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

	<?php if ( $is_masonry ) { echo '<div class="post-wrapper">'; } ?>

	<header class="page-header">
		<?php $post_ob->header(); ?>
	</header>

	<?php if ( is_archive() ) : // Display Excerpts for Archive Pages ?>
		<div class="entry-body entry-summary">

			<?php $post_ob->content('excerpt'); ?>
			
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

	<?php if ( $is_masonry ) { echo '</div>'; } // Close .post-wrapper ?>

</article>
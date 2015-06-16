<?php

/**
 * Search Results Template
 *
 * @package MIXT
 */

$post_ob    = new mixtPost('search');
$is_masonry = MIXT::get('layout', 'type') == 'masonry';

?>

<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

	<?php if ( $is_masonry ) { echo '<div class="post-wrapper">'; } ?>

	<header class="page-header">
		<?php $post_ob->header(); ?>
	</header>

	<div class="entry-body entry-summary">
		<?php $post_ob->content('excerpt'); ?>
	</div>

	<?php if ( $is_masonry ) { echo '</div>'; } // Close .post-wrapper ?>

</article>

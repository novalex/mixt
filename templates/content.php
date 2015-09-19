<?php

/**
 * General template for displaying content
 *
 * @package MIXT
 */

$post_ob    = new Mixt_Post('blog');
$is_masonry = Mixt_Options::get('layout', 'type') == 'masonry';

?>

<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

	<?php if ( $is_masonry ) { echo '<div class="post-wrapper">'; } ?>

	<header class="page-header"><?php

		$post_ob->header();

	?></header>

	<?php if ( is_archive() || ( Mixt_Options::get('page', 'page-type') != 'blog' && Mixt_Options::get('page', 'posts-page') ) ) : // Display Excerpts for Archive Pages ?>
		<div class="entry-body entry-summary"><?php

			$post_ob->content('excerpt');

		?></div>
	<?php else : ?>
		<div class="entry-body entry-content"><?php

			$post_ob->content();

		?></div>
	<?php endif; ?>

	<?php if ( $is_masonry ) { echo '</div>'; } // Close .post-wrapper ?>

</article>

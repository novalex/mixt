<?php

/**
 * Template for displaying search results
 *
 * @package MIXT
 */

$post_ob    = new Mixt_Post('search');
$is_masonry = Mixt_Options::get('layout', 'type') == 'masonry';

?>

<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes() ); ?>>

	<?php if ( $is_masonry ) { echo '<div class="post-wrapper">'; } ?>

	<header class="page-header"><?php

		$post_ob->header();

	?></header>

	<div class="entry-body entry-summary post-content"><?php

		$post_ob->content();

	?></div>

	<?php if ( $is_masonry ) { echo '</div>'; } // Close .post-wrapper ?>

</article>

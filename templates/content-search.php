<?php

/**
 * Search Results Template
 *
 * @package MIXT
 */

$post_id   = get_the_ID();
$post_type = get_post_type($post_id);
$post_ob   = new mixtPost($post_type);

?>

<article id="post-<?php echo $post_id; ?>" <?php post_class( $post_ob->classes() ); ?>>

	<header class="page-header">
		<?php $post_ob->header(); ?>
	</header>

	<div class="entry-body entry-content"><?php

		//$post_ob->content();
		the_excerpt(); ?>

	</div>

</article>

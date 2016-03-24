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

<article id="post-<?php echo esc_attr( get_the_ID() ); ?>" <?php post_class( array($post_ob->classes(), 'posts-page-content' ) ); ?>>

	<div class="entry-body entry-content page-content"><?php

		echo mixt_clean($post_content, 'strip');

	?></div>

</article>

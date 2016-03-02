<?php

/**
 * Template for displaying single posts
 *
 * @package MIXT
 */

$post_ob = new Mixt_Post('single');

$post_classes = array(
	$post_ob->classes(),
);
$header_classes = 'page-header';
$content_classes = 'entry-body entry-content post-content';

$has_columns = false;

if ( is_single() ) {
	$layout = mixt_get_option( array( 'key' => 'post-layout', 'return'  => 'value', 'default' => 'full' ) );

	if ( $layout != 'full' && $post_ob->display_component('featured') ) {
		$has_columns = true;

		$post_classes[] = 'has-columns';

		switch ( $layout ) {
			case 'two-thirds':
				$header_classes .= ' col-sm-8';
				$content_classes .= ' col-sm-4';
				break;
			case 'half':
				$header_classes .= ' col-sm-6';
				$content_classes .= ' col-sm-6';
				break;
			case 'one-third':
				$header_classes .= ' col-sm-4';
				$content_classes .= ' col-sm-8';
				break;
		}
	}
}

?>

<article id="post-<?php the_ID() ?>" <?php post_class($post_classes); ?>>

	<?php if ( $has_columns ) echo '<div class="row">'; ?>

	<header class="<?php echo $header_classes; ?>"><?php

		$post_ob->header();

	?></header>

	<div class="<?php echo $content_classes; ?>"><?php

		$post_ob->content();

	?></div>

	<?php if ( $has_columns ) echo '</div>'; // Close .row ?>

</article>

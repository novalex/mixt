<?php
/**
 * The template used for displaying page content in page.php
 *
 * @package mixt
 */

$post_id = get_the_ID();
$post_title = get_the_title($post_id);
$post_url = get_permalink($post_id);
$post_thumb = get_the_post_thumbnail($post_id);
$post_date = get_the_date();
$post_tags = wp_get_post_tags($post_id);

?>

<article id="post-<?php echo $post_id; ?>" <?php post_class(); ?>>

	<?php if (!is_front_page() && !is_home()) : ?>
		<header class="page-header">
			<h1 class="page-title"><?php the_title(); ?></h1>
		</header><!-- .entry-header -->
	<?php endif; ?>

	<div class="entry-content">
		<?php the_content(); ?>
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'mixt' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->
	<?php edit_post_link( __( 'Edit', 'mixt' ), '<footer class="entry-meta"><span class="edit-link">', '</span></footer>' ); ?>
</article><!-- #post-## -->

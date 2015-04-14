<?php

/**
 * @package mixt
 */

?>

	<?php

		$post_id = get_the_ID();
		$post_title = get_the_title($post_id);
		$post_url = get_permalink($post_id);
		$post_thumb = get_the_post_thumbnail($post_id);
		$post_date = get_the_date();
		$post_tags = wp_get_post_tags($post_id);

		$post_classes = '';

		if (is_sticky($post_id)) $post_classes = 'sticky';

		if ($post_tags) {
			foreach ($post_tags as $tag) {
				$post_classes .= ' tag-' . $tag->name;
			}
		}
	?>

	<article id="post-<?php the_ID(); ?>" <?php post_class($post_classes); ?>>

		<div class="entry-content-wrapper clearfix">

		<?php

			if ($post_thumb) echo '<div class="post-image pf-image cover">' . $post_thumb . '</div>';

			echo '<a href="' . $post_url . '" class="main-anchor"></a>';
            
            echo '<div class="post-content pf-content">';

            echo '<h2 class="post-title"><a href="' . $post_url . '">' . $post_title . '</a></h2>';

            echo '<p class="post-date">' . $post_date . '</p>';

			echo '<div class="entry-content">';
			    the_content(__('Read more','mixt').'<span class="more-link-arrow">  &rarr;</span>');
			echo '</div>';

            echo '<footer class="entry-footer">';

			if(has_tag() && is_single())
			{
				echo '<span class="blog-tags minor-meta">';
				the_tags('<strong>'.__('Tags:','mixt').'</strong><span> ');
				echo '</span></span>';
			}
            echo '</footer>';

            echo '</div>';

		?>

		</div>
		
	</article><!--end post-entry-->

<?php

/**
 * MIXT Header Elements
 *
 * @package mixt
 */


// SECONDARY HEADER NAVIGATION

function mixt_nav_second() {

	$left_el = $right_el = '';

	$social_links = mixt_social_links();

	$left_el = $social_links;

echo <<<EOT
<nav class="navbar second-nav">
	<div class="container">
		<div class="left">
			$left_el
		</div>
		<div class="right">
			$right_el
		</div>
	</div>
</nav>
EOT;

}

// HEAD MEDIA

function mixt_head_media($page_ID) {

	$head_media_type = mixt_meta('mixt_head_media_type');

	$media_img = $media_slider = $media_html = '';

	if ($head_media_type == 'slider') {
		$head_slider_id = '"' . mixt_meta('mixt_head_slider') . '"';
		if (1 > 0) {
			$media_slider = do_shortcode("[layerslider id=$head_slider_id]");
		}
	} else {
		$head_code = mixt_meta('mixt_head_code');

		if ($head_code) {
			$media_html = sprintf('<div class="media-inner"><div class="container">%s</div></div>', $head_code);
		}

		if ($head_media_type == 'feat') {
			$img_url = wp_get_attachment_url( get_post_thumbnail_id($page_ID) );

			$page_head_classes = '';
			if (mixt_meta('mixt_head_img_repeat') == 'true') $page_head_classes .= 'pattern ';

			$media_img = sprintf('<div class="media-container %1$s" style="background-image: url(%2$s);" data-imgsrc="%2$s"></div>',
				$page_head_classes,
				$img_url
			);
		}
	}

echo <<<EOT
<div class="head-media media-image">
	$media_img
	$media_slider
	$media_html
</div>
EOT;

}
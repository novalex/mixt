<?php

/**
 * The template for displaying the footer
 *
 * @package MIXT
 */

?>
				</div><?php // close #content or .sidebar, if sidebar is active ?>

			</div><?php // close .row ?>

		</div><?php // close #content-wrap

		do_action('mixt_after_content_wrap');

		?>
	</div><?php // close #main-wrap-inner

	do_action('mixt_before_footer');

	$footer_classes = apply_filters('mixt_footer_class', array());

	?>
	<footer id="colophon" class="<?php echo mixt_sanitize_html_classes($footer_classes); ?>">
		<?php

		// Footer Widget Row
		mixt_footer_widget_area();

		// Footer Copyright Row
		mixt_footer_copyright_area();

		// Info Bar
		mixt_footer_infobar();

		?>
	</footer><?php // close #colophon

	do_action('mixt_after_footer');

	?>
</div><?php // close #main-wrap

wp_footer();

?>
</body>
</html>
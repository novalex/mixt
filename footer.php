<?php

/**
 * The template for displaying the footer
 *
 * @package MIXT
 */

$options = mixt_get_options( array(
	'back-to-top'      => array(),
	'back-to-top-icon' => array( 'return' => 'value' ),
	'footer-code'      => array( 'return' => 'value' ),
) );

?>
				</div><?php // close #content or .sidebar, if sidebar is active ?>

			</div><?php // close .row ?>

			<?php do_action('mixt_body_css'); ?>

		</div><?php // close #content-wrap ?>

		<?php

		// Back To Top Button
		if ( $options['back-to-top'] ) {
			echo '<a href="#" id="back-to-top" class="btn btn-accent btn-lg">';
				echo '<i class="' . $options['back-to-top-icon'] . '"></i>';
			echo '</a>';
		}

		?>

	</div><?php // close #main-wrap-inner ?>

	<?php

		$theme = Mixt_Options::get('themes', 'footer');

		$class = "theme-$theme";

	?>

	<footer id="colophon" class="<?php echo $class; ?>" role="contentinfo">

		<?php

		// Footer Widget Row
		$sidebars = 0;
		$active_sidebars = array();
		foreach ( array( 'footer-1', 'footer-2', 'footer-3', 'footer-4' ) as $sidebar_id ) {
			if ( is_active_sidebar($sidebar_id) ) {
				$sidebars++;
				$active_sidebars[] = $sidebar_id;
			}
		}
		if ( $sidebars > 0 ) {
			$column_class = 'col-sm-' . 12 / $sidebars;
			?>
			<div class="footer-row widget-row theme-section-alt">
				<div class="container">
					<div id="footer-widgets" class="row">
						<?php foreach ( $active_sidebars as $sidebar ) { ?>
							<div class="widget-area <?php echo $column_class; ?>" role="complementary">
								<?php dynamic_sidebar($sidebar); ?>
							</div>
						<?php } ?>
					</div>
				</div>
			</div>
			<?php
		}

		// Footer Copyright Row ?>
		<div class="footer-row copyright-row theme-section-main">
			<div class="container">
				<div class="row">
					<div class="site-copyright col-sm-12">
						<?php

						do_action( 'mixt_credits' );

						$footer_code = str_replace('{{year}}', date('Y'), $options['footer-code']);

						echo "<div class='site-info'>$footer_code</div>";

						?>
					</div>
				</div>
			</div>
		</div>
		
	</footer><?php // close #colophon ?>

</div><?php // close #main-wrap ?>

<?php

wp_footer();

mixt_browsersync();

?>

</body>
</html>
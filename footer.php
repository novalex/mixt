<?php

/**
 * The template for displaying the footer
 *
 * @package MIXT
 */

$options = mixt_get_options( array(
	'footer-theme'     => array( 'return' => 'value' ),
	'back-to-top'      => array(),
	'back-to-top-icon' => array( 'return' => 'value' ),
) );

?>
			</div><?php // close main-content-inner or sidebar, if sidebar is used ?>
		</div><?php // close .row ?>

		<?php do_action('mixt_body_css'); ?>

	</div><?php // close .main-content ?>

	<?php
		$footer_classes = 'site-footer';
		if ( $options['footer-theme'] != 'auto' ) $footer_classes .= " theme-{$options['footer-theme']}";
	?>

	<footer id="colophon" class="<?php echo $footer_classes; ?>" role="contentinfo">
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
		<?php } ?>

		<?php // Footer Copyright Row ?>
		<div class="footer-row copyright-row theme-section-main">
			<div class="container">
				<div class="row">
					<div class="site-footer-inner col-sm-12">

						<div class="site-info">
							<?php do_action( 'mixt_credits' ); ?>
							<?php printf( __( 'Theme: %1$s by %2$s.', 'mixt' ), 'MIXT', '<a href="http://novalx.com/" rel="designer">novalex</a>' ); ?>
						</div>

					</div>
				</div>
			</div>
		</div>
		
	</footer>

	<?php
		// Back To Top Button
		if ( $options['back-to-top'] ) {
			echo '<a href="#" id="back-to-top" class="btn btn-accent btn-lg">';
				echo '<i class="' . $options['back-to-top-icon'] . '"></i>';
			echo '</a>';
		}
	?>

</div><?php // close #main-wrap ?>

<?php wp_footer(); ?>

<?php mixt_browsersync(); ?>

</body>
</html>
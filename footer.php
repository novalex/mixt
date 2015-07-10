<?php

/**
 * The template for displaying the footer
 *
 * @package MIXT
 */

?>
			</div><?php // close main-content-inner or sidebar, if sidebar is used ?>
		</div><?php // close .row ?>
	</div><?php // close .main-content ?>

	<footer id="colophon" class="site-footer" role="contentinfo">
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
			<div class="footer-row widget-row">
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
		<div class="footer-row copyright-row">
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

</div><?php // close #main-wrap ?>

<?php wp_footer(); ?>

<?php mixt_browsersync(); ?>

</body>
</html>
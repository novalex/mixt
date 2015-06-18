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
</div><?php // close #main-wrap ?>

<footer id="colophon" class="site-footer" role="contentinfo">
	<div class="container">
		<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
			<div class="row">
				<div id="footer-widgets" class="widget-area col-sm-12" role="complementary">
					<?php dynamic_sidebar( 'footer-1' ); ?>
				</div>
			</div>
		<?php endif; ?>
		<div class="row">
			<div class="site-footer-inner col-sm-12">

				<div class="site-info">
					<?php do_action( 'mixt_credits' ); ?>
					<?php printf( __( 'Theme: %1$s by %2$s.', 'mixt' ), 'MIXT', '<a href="http://novalx.com/" rel="designer">novalex</a>' ); ?>
				</div>

			</div>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>

<?php mixt_browsersync(); ?>

</body>
</html>
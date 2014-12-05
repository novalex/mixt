<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content after
 *
 * @package mixt
 */
?>
				</div><!-- close .*-inner (main-content or sidebar, depending if sidebar is used) -->
			</div><!-- close .row -->
		</div><!-- close .container -->
	</div><!-- close .main-content -->
</div><!-- close #main-wrap -->

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
				</div><!-- close .site-info -->

			</div>
		</div>
	</div><!-- close .container -->
</footer><!-- close #colophon -->

<?php wp_footer(); ?>

</body>
</html>
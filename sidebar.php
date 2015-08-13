<?php

/**
 * The Sidebar Template
 *
 * @package MIXT
 */

if ( Mixt_Options::get('page', 'sidebar') ) {

	$active_sidebar = Mixt_Options::get('page', 'sidebar-id');

	?>

	</div><?php // Close .main-content-inner ?>

	<div class="sidebar">

		<div class="sidebar-padder">
			<?php

			// Child Page Navigation
			if ( Mixt_Options::get('page', 'child-page-nav') ) { mixt_child_page_nav(); }

			do_action( 'before_sidebar' );
			
			if ( ! dynamic_sidebar($active_sidebar) ) : ?>
				<aside id="search" class="widget widget_search">
					<?php get_search_form(); ?>
				</aside>

				<aside id="archives" class="widget widget_archive">
					<h3 class="widget-title"><?php _e( 'Archives', 'mixt' ); ?></h3>
					<ul>
						<?php wp_get_archives( array( 'type' => 'monthly' ) ); ?>
					</ul>
				</aside>

				<aside id="meta" class="widget widget_meta">
					<h3 class="widget-title"><?php _e( 'Meta', 'mixt' ); ?></h3>
					<ul>
						<?php wp_register(); ?>
						<li><?php wp_loginout(); ?></li>
						<?php wp_meta(); ?>
					</ul>
				</aside>
			<?php endif; ?>

		</div><?php
}

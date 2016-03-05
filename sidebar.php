<?php

/**
 * The Sidebar Template
 *
 * @package MIXT
 */

if ( Mixt_Options::get('sidebar', 'enabled') ) {

	$classes = 'sidebar widget-area';
	if ( Mixt_Options::get('sidebar', 'hide') ) {
		$classes .= ' hidden-xs';
	}

	?>

	</div><?php // close #content ?>

	<div class="<?php echo $classes; ?>">

		<div class="sidebar-padder">
			<?php

			// Child Page Navigation
			if ( Mixt_Options::get('sidebar', 'page-nav') ) { mixt_child_page_nav(); }

			do_action( 'before_sidebar' );
			
			if ( ! dynamic_sidebar(Mixt_Options::get('sidebar', 'id')) ) : ?>
				<aside id="search" class="widget widget_search">
					<?php get_search_form(); ?>
				</aside>

				<aside id="archives" class="widget widget_archive">
					<h3 class="widget-title"><?php esc_html_e( 'Archives', 'mixt' ); ?></h3>
					<ul>
						<?php wp_get_archives( array( 'type' => 'monthly' ) ); ?>
					</ul>
				</aside>

				<aside id="meta" class="widget widget_meta">
					<h3 class="widget-title"><?php esc_html_e( 'Meta', 'mixt' ); ?></h3>
					<ul>
						<?php wp_register(); ?>
						<li><?php wp_loginout(); ?></li>
						<?php wp_meta(); ?>
					</ul>
				</aside>
			<?php endif; ?>

		</div><?php
}

<?php

/**
 * The sidebar containing the main widget area
 *
 * @package MIXT
 */

$sidebar_options_arr = array(
	'enabled' => array(
		'key'  => 'page-sidebar',
	),
);
$sidebar_options = mixt_get_options($sidebar_options_arr);

if ( $sidebar_options['enabled'] != 'false' ) : ?>

	</div><?php // Close .main-content-inner ?>

	<div class="sidebar col-sm-12 col-md-3">

		<div class="sidebar-padder">

			<?php do_action( 'before_sidebar' ); ?>
			
			<?php if ( ! dynamic_sidebar( 'sidebar-1' ) ) : ?>

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
endif;

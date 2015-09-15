<?php

/**
 * Template For Displaying 404 Pages (not Found)
 *
 * @package MIXT
 */

// Hide Sidebar
Mixt_Options::set('page', 'sidebar', false);

get_header(); ?>

	<section class="error-404 not-found">

		<header class="page-header">
			<h2 class="page-title accent-color">404</h2>
			<h3 class="color-fade"><?php _e( 'The page could not be found!', 'mixt' ); ?></h3>
		</header>

		<div class="page-content row">
			<?php // Search Form ?>
			<div class="col-sm-6">
				<?php echo do_shortcode('[mixt_headline]' . __( 'Do a search', 'mixt' ) . '[/mixt_headline]'); ?>
				<p><?php _e( 'Try searching our website for what you are looking for!', 'mixt' ); ?></p><br>
				<?php get_search_form(); ?>
			</div>

			<?php // Useful Links
				$nav = wp_nav_menu(
					array(
						'theme_location'  => '404_page',
						'container_class' => 'menu-404-cont',
						'menu_class'      => 'nav',
						'fallback_cb'     => '__return_false',
						'echo'            => false,
						'menu_id'         => 'menu-404',
					)
				);
				if ( ! empty($nav) ) {
					echo '<div class="col-sm-6">';
						echo do_shortcode('[mixt_headline]' . __( 'Useful links', 'mixt' ) . '[/mixt_headline]');
						echo $nav;
					echo '</div>';
				}
			?>
		</div>

	</section>

<?php

get_footer();

?>
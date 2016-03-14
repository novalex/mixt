<?php

/**
 * Template For Displaying 404 Pages (not Found)
 *
 * @package MIXT
 */

// Hide Sidebar
Mixt_Options::set('sidebar', 'enabled', false);

get_header(); ?>

	<section class="error-404 not-found">

		<header class="page-header text-center">
			<h2 class="page-title accent-color">404</h2>
			<h3 class="color-fade"><?php esc_html_e( 'The page could not be found!', 'mixt' ); ?></h3>
		</header>

		<div class="page-content row">
			<?php
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
					$search_classes = 'col-sm-6';
					$search_heading_args = '';

					$nav_html = '<div class="col-sm-6">';
						$nav_html .= mixt_heading( esc_html__( 'Useful links', 'mixt' ) );
						$nav_html .= $nav;
					$nav_html .= '</div>';
				} else {
					$search_classes = 'col-sm-6 col-sm-offset-3 text-center';
					$search_heading_args = 'align="center"';

					$nav_html = '';
				}
			?>

			<?php // Search Form ?>
			<div class="<?php echo mixt_sanitize_html_classes($search_classes); ?>">
				<?php echo mixt_heading( esc_html__( 'Do a search', 'mixt' ), $search_heading_args ); ?>
				<p><?php esc_html_e( 'Try searching our website for what you are looking for!', 'mixt' ); ?></p><br>
				<?php get_search_form(); ?>
			</div>

			<?php // Useful Links
				echo $nav_html;
			?>
		</div>

	</section>

<?php

get_footer();

?>
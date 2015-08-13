<?php

/**
 * One-Page Template
 *
 * Template Name: One-Page Layout
 *
 * @package MIXT
 */

get_header();

	while ( have_posts() ) : // Start The Loop

		the_post();

		$post_ob = new Mixt_Post('page');

		// Scrolling Script
		if ( wp_script_is('waypoints', 'registered') ) { wp_enqueue_script('waypoints'); }
		else { wp_enqueue_script('mixt-waypoints'); }

		?>
		<script type="text/javascript">
		// 	var menu = jQuery('#main-menu');
		// 	jQuery(document).ready( function($) {
		// 		$('.entry-body > .row').waypoint( function(direction) {
		// 			var activeSection = $(this);
		// 			if ( direction == 'down' ) {
		// 				activeSection = $(this).next();
		// 			}
		// 			var sectionId = activeSection.attr('id');
		// 			if ( typeof sectionId !== 'undefined' ) {
		// 				$('li', menu).removeClass('active');
		// 				menu.find('a[href="' + sectionId + '"]').parent('li').addClass('active');
		// 			}
		// 		});

		// 		menu.find('.menu-item > a').click( function() {
		// 			$('li', menu).removeClass('active');
		// 			$(this).parent('li').addClass('active');
		// 		});
		// 	});
		</script>

		<article id="post-<?php echo get_the_ID(); ?>" <?php post_class( $post_ob->classes('one-page') ); ?>>
			<div class="entry-body entry-content">
				<?php $post_ob->content(); ?>
			</div>
		</article>

		<?php

	endwhile; // End The Loop

get_footer();

?>

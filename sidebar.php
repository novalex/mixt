<?php

/**
 * The Sidebar Template
 *
 * @package MIXT
 */

if ( Mixt_Options::get('sidebar', 'enabled') ) {

	$sidebar_classes = apply_filters('mixt_sidebar_class', array());

	?>

	</div><?php // close #content ?>

	<div class="<?php echo mixt_sanitize_html_classes($sidebar_classes); ?>">

		<div class="sidebar-padder">
			<?php

			do_action('mixt_before_sidebar');
			
			dynamic_sidebar( Mixt_Options::get('sidebar', 'id') );

			do_action('mixt_after_sidebar');

			?>
		</div>

		<?php
}

<?php

/**
 * Search 
 *
 * @package bbPress
 * @subpackage MIXT
 */

?>

<form role="search" method="get" id="bbp-search-form" class="search-form input-group" action="<?php bbp_search_url(); ?>">
	<input id="bbp_search" name="bbp_search" tabindex="<?php bbp_tab_index(); ?>" type="search" class="search-field form-control" placeholder="<?php echo esc_attr_x( 'Search...', 'placeholder', 'mixt' ); ?>" value="<?php echo esc_attr( bbp_get_search_terms() ); ?>" title="<?php _ex( 'Search for:', 'label', 'mixt' ); ?>">
	<span class="input-group-btn">
		<input type="hidden" name="action" value="bbp-search-request" />
		<button type="submit" class="search-submit btn btn-accent"><i class="mixt-icon <?php echo mixt_get_icon('search', false); ?>"></i></button>
	</span>
</form>

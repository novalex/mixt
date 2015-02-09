<?php
/**
 * The template for displaying search forms in MIXT
 *
 * @package mixt
 */
?>

<form role="search" method="get" class="search-form input-group" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<input type="search" class="search-field form-control" placeholder="<?php echo esc_attr_x( 'Search &hellip;', 'placeholder', 'mixt' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" title="<?php _ex( 'Search for:', 'label', 'mixt' ); ?>">
	<span class="input-group-btn">
		<button type="submit" class="search-submit btn btn-default"><?php echo esc_attr_x( 'Search', 'submit button', 'mixt' ); ?></button>
	</span>
</form>

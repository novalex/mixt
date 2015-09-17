<form role="search" method="get" class="woocommerce-product-search search-form input-group" action="<?php echo esc_url( home_url( '/'  ) ); ?>">
	<input type="search" class="search-field form-control" placeholder="<?php echo esc_attr_x( 'Search Products&hellip;', 'placeholder', 'woocommerce' ); ?>" value="<?php echo get_search_query(); ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label', 'woocommerce' ); ?>" />
	<span class="input-group-btn">
		<input type="submit" class="search-submit btn btn-minimal" value="<?php echo esc_attr_x( 'Search', 'submit button', 'woocommerce' ); ?>" />
	</span>
	<input type="hidden" name="post_type" value="product" />
</form>

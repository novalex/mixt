<?php
/**
 * Show options for ordering
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>

<div class="shop-filters">
	<?php

	if ( mixt_wc_option('per-page-select') ) {
		$per_page = mixt_wc_option('per-page');
		$per_page_now = ( isset($_GET['per_page']) ) ? wc_clean($_GET['per_page']) : $per_page;
		$per_page_options = array(
			$per_page,
			$per_page*2,
			$per_page*3,
			$per_page*4,
			$per_page*5,
		);

		?>
		<form class="products-per-page" method="get">
			<select class="per-page-select" name="per_page" onchange="this.form.submit()">
				<?php foreach ( $per_page_options as $option ) { ?>
					<option value="<?php echo esc_attr($option); ?>" <?php selected($option, $per_page_now); ?>><?php echo $option . ' ' . __( 'Products per page', 'mixt' ); ?></option>
				<?php } ?>
			</select>
			<?php mixt_wc_query_params('per_page'); ?>
		</form>
	<?php }

	if ( mixt_wc_option('orderby') ) { ?>
		<form class="woocommerce-ordering" method="get">
			<select name="orderby" class="orderby">
				<?php foreach ( $catalog_orderby_options as $id => $name ) { ?>
					<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $orderby, $id ); ?>><?php echo esc_html( $name ); ?></option>
				<?php } ?>
			</select>
			<?php mixt_wc_query_params('orderby'); ?>
		</form>
	<?php } ?>
</div>

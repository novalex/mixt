<?php
/**
 * Loop Price
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $product;
?>


<div class="price-cont"><?php
	if ( $price_html = $product->get_price_html() ) { ?>
		<span class="price"><?php echo mixt_clean($price_html); ?></span>
	<?php }

	// Stock
	if ( mixt_wc_option('stock') ) mixt_wc_product_stock();
	?>
</div>

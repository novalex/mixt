<?php
/**
 * Checkout coupon form
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! WC()->cart->coupons_enabled() ) {
	return;
}

$info_message = apply_filters( 'woocommerce_checkout_coupon_message', esc_html__( 'Have a coupon?', 'woocommerce' ) );

?>

<div class="coupon-cont panel panel-default">
	<div class="panel-body">
		<h4 class="coupon-title"><?php echo esc_html($info_message); ?></h4>

		<form class="checkout-coupon input-group" method="post">
			<input type="text" name="coupon_code" class="form-control input-text" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" id="coupon_code" value="" />
			<span class="input-group-btn">
				<input type="submit" class="btn btn-black" name="apply_coupon" value="<?php esc_attr_e( 'Apply Coupon', 'woocommerce' ); ?>" />
			</span>
		</form>
	</div>
</div>

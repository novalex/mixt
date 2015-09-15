<?php
/**
 * Product quantity inputs
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<div class="quantity input-group mixt-spinner">
	<span class="input-group-btn">
		<button class="btn btn-default minus" type="button" title="<?php echo esc_attr__( 'Decrease Quantity', 'mixt' ); ?>">-</button>
	</span>
	<input 
		type="text" step="<?php echo esc_attr( $step ); ?>"
		<?php if ( is_numeric( $min_value ) ) : ?>min="<?php echo esc_attr( $min_value ); ?>"<?php endif; ?> 
		<?php if ( is_numeric( $max_value ) ) : ?>max="<?php echo esc_attr( $max_value ); ?>"<?php endif; ?> 
		name="<?php echo esc_attr( $input_name ); ?>" value="<?php echo esc_attr( $input_value ); ?>" 
		title="<?php echo esc_attr_x( 'Qty', 'Product quantity input tooltip', 'woocommerce' ) ?>" 
		class="form-control spinner-val qty" 
	/>
	<span class="input-group-btn">
		<button class="btn btn-default plus" type="button" title="<?php echo esc_attr__( 'Increase Quantity', 'mixt' ); ?>">+</button>
	</span>
</div>

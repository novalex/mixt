<?php
/**
 * Product quantity inputs
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/global/quantity-input.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you (the theme developer).
 * will need to copy the new files to your theme to maintain compatibility. We try to do this.
 * as little as possible, but it does happen. When this occurs the version of the template file will.
 * be bumped and the readme will list any important changes.
 *
 * @see 	    http://docs.woothemes.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<div class="quantity input-group mixt-spinner">
	<span class="input-group-btn">
		<button class="btn btn-minimal minus" type="button" title="<?php echo esc_attr__( 'Decrease Quantity', 'mixt' ); ?>">-</button>
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
		<button class="btn btn-minimal plus" type="button" title="<?php echo esc_attr__( 'Increase Quantity', 'mixt' ); ?>">+</button>
	</span>
</div>

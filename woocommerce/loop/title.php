<?php
/**
 * Product loop title
 *
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 2.4.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>

<div class="title">
	<h3><?php the_title(); ?></h3>

	<?php if ( mixt_wc_option('rating') ) {
		global $product;
		if ( $rating_html = $product->get_rating_html() ) {
			echo "<div class='rating-cont'>$rating_html</div>";
		}
	} ?>
</div>

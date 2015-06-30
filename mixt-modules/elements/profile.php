<?php

/**
 * Profile Element
 */
class MixtProfile {

	public $colors;
	public $anims;

	public function __construct() {
		$this->colors = mixt_get_colors('basic');
		$this->anims  = array('in' => mixt_css_anims('trans-in'), 'out' => mixt_css_anims('trans-out'));

		add_action('mixtcb_init', array($this, 'mixtcb_extend'));
		add_action('vc_before_init', array($this, 'vc_extend'));
		add_shortcode('mixt_profile', array($this, 'shortcode'));
	}

	/**
	 * Add Element to CodeBuilder
	 */
	public function mixtcb_extend() {
		mixtcb_map( array(
			'id'       => 'mixt_profile',
			'title'    => __( 'Profile', 'mixt' ),
			'template' => '[mixt_profile {{attributes}}]{{content}}[/mixt_profile]',
			'params'   => array(
				'name' => array(
					'type'  => 'text',
					'label' => __( 'Name', 'mixt' ),
				),
				'title' => array(
					'type'  => 'text',
					'label' => __( 'Title / Position', 'mixt' ),
				),
				'image' => array(
					'type'  => 'media',
					'label' => __( 'Image', 'mixt' ),
				),
				'image_hover_color' => array(
					'type'    => 'select',
					'label'   => __( 'Image Hover Color', 'mixt' ),
					'options' => $this->colors,
					'class'   => 'color-select basic-colors',
				),
				'image_hover_in' => array(
					'type'    => 'select',
					'label'   => __( 'Hover Animation In', 'mixt' ),
					'options' => $this->anims['in'],
				),
				'image_hover_out' => array(
					'type'    => 'select',
					'label'   => __( 'Hover Animation Out', 'mixt' ),
					'options' => $this->anims['out'],
				),
				'content' => array(
					'type'  => 'encoded_textarea',
					'label' => __( 'Description', 'mixt' ),
					'desc'  => __( 'Enter a description about this person (HTML allowed)', 'mixt' ),
				),
				'social' => array(
					'type'  => 'exploded_textarea',
					'label' => __( 'Social Networks', 'mixt' ),
					'desc'  => __( 'Type in this person\'s social network profiles as url|icon|tooltip, each network separated by a line break (Enter)', 'mixt' ),
					'std'   => 'https://facebook.com|icon-facebook,https://twitter.com|icon-twitter',
				),
				'class' => array(
					'type'  => 'text',
					'label' => __( 'Extra Classes', 'mixt' ),
				),
			),
		) );
	}

	/**
	 * Add Element to Visual Composer
	 */
	public function vc_extend() {
		vc_map( array(
			'name'        => __( 'Profile', 'mixt' ),
			'description' => __( 'A person\'s profile', 'mixt' ),
			'base'        => 'mixt_profile',
			'icon'        => 'mixt_profile',
			'category'    => 'MIXT',
			'params'      => array(
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Name', 'mixt' ),
					'param_name'  => 'name',
					'admin_label' => true,
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Title / Position', 'mixt' ),
					'param_name' => 'title',
				),
				array(
					'type'       => 'attach_image',
					'heading'    => __( 'Image', 'mixt' ),
					'param_name' => 'image',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Hover Color', 'mixt' ),
					'param_name' => 'image_hover_color',
					'value'      => array_flip($this->colors),
					'param_holder_class' => 'vc_colored-dropdown',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Hover Animation In', 'mixt' ),
					'param_name' => 'image_hover_in',
					'value'      => array_flip($this->anims['in']),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Hover Animation Out', 'mixt' ),
					'param_name' => 'image_hover_out',
					'value'      => array_flip($this->anims['out']),
				),
				array(
					'type'        => 'textarea_html',
					'heading'     => __( 'Description', 'mixt' ),
					'description' => __( 'Enter a description about this person (HTML allowed)', 'mixt' ),
					'param_name'  => 'content',
				),
				array(
					'type'        => 'exploded_textarea',
					'heading'     => __( 'Social Networks', 'mixt' ),
					'description' => __( 'Type in this person\'s social network profiles as url|icon|tooltip, each network separated by a line break (Enter)', 'mixt' ),
					'param_name'  => 'social',
					'std' => 'https://facebook.com|facebook,https://twitter.com|twitter',
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Extra Classes', 'mixt' ),
					'param_name' => 'class',
				),
			),
		) );
	}

	/**
	 * Render shortcode
	 */
	public function shortcode( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'name'   => '',
			'title'  => '',
			'image'  => '',
			'social' => '',
			'class'  => '',
			'image_hover_color' => '',
			'image_hover_in'    => '',
			'image_hover_out'   => '',
		), $atts ) );

		$classes = 'mixt-profile mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		$has_image = ( ! empty($image) && $image > 0 );
		$content = html_entity_decode($content);

		$social = ( $social == '' ) ? '' : explode(',', $social);
		$social_links = function($networks) {
			if ( empty($networks) ) return;
			$links = '<div class="profile-social btn-group">';
			foreach ( $networks as $network ) {
				$network = explode('|', $network);
				if ( empty($network[0]) ) return;
				$icon = ( empty($network[1]) ) ? 'link' : $network[1];
				$atts = ( empty($network[2]) ) ? '' : "title='{$network[2]}' data-toggle='tooltip'";
				$links .= "<a href='{$network[0]}' $atts class='btn btn-default'><i class='fa fa-$icon'></i></a>";
			}
			return $links . '</div>';
		};

		ob_start();
		?>
		
		<div class="<?php echo $classes; ?>">
			<?php if ( $has_image ) { ?>
				<div class="profile-image hover-content anim-on-hover border-rad">
					<?php echo wp_get_attachment_image($image, 'full');
					if ( ! empty($social) ) { ?>
						<div class="<?php echo 'on-hover ' . $image_hover_color; ?>" data-anim-in="<?php echo $image_hover_in; ?>" data-anim-out="<?php echo $image_hover_out; ?>">
							<div class="inner">
								<?php echo $social_links($social); ?>
							</div>
						</div>
					<?php } ?>
				</div>
			<?php } ?>
			<div class="header clearfix">
				<strong class="name">
					<?php echo $name; ?><br>
					<small class="theme-color-fade"><?php echo $title; ?></small>
				</strong>
				<?php if ( ! $has_image ) echo $social_links($social); ?>
			</div>
			<p class="desc"><?php echo $content; ?></p>
		</div>

		<?php
		return ob_get_clean();
	}
}
new MixtProfile;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Profile extends WPBakeryShortCode {}
}

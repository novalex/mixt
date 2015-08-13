<?php

/**
 * Profile Element
 */
class Mixt_Profile {

	/**
	 * @var array $anims
	 * @var array $colors
	 * @var array $image_styles
	 */
	public $anims, $colors, $image_styles;

	public function __construct() {
		$this->colors = mixt_get_assets('colors', 'basic');
		$this->anims  = array(
			'in' => mixt_css_anims('trans-in'),
			'out' => mixt_css_anims('trans-out')
		);
		$this->image_styles = mixt_element_assets('image-styles');

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
				'content' => array(
					'type'  => 'encoded_textarea',
					'label' => __( 'Description', 'mixt' ),
					'desc'  => __( 'Enter a description about this person (HTML allowed)', 'mixt' ),
				),
				'image' => array(
					'type'  => 'media',
					'label' => __( 'Image', 'mixt' ),
				),
				'image_align' => array(
					'type'    => 'select',
					'label'   => __( 'Image Align', 'mixt' ),
					'options' => array(
						'align-left'   => __( 'Left', 'mixt' ),
						'align-center' => __( 'Center', 'mixt' ),
						'align-right'  => __( 'Right', 'mixt' ),
					),
					'std' => 'align-center',
				),
				'image_style' => array(
					'type'    => 'select',
					'label'   => __( 'Image Style', 'mixt' ),
					'options' => $this->image_styles,
				),
				'image_border_color' => array(
					'type'    => 'select',
					'label'   => __( 'Border Color', 'mixt' ),
					'options' => array_merge(
						array( 'auto' => __( 'Auto', 'mixt' ) ),
						$this->colors
					),
					'class' => 'color-select basic-colors',
					'required' => array('image_style', '=',
						'image-border|image-outline|image-rounded image-border|image-rounded image-outline|image-circle image-border|image-circle image-outline'
					),
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
				'button' => array(
					'type'  => 'button',
					'label' => __( 'Button Style', 'mixt' ),
				),
				'social' => array(
					'type'  => 'exploded_textarea',
					'label' => __( 'Social Networks', 'mixt' ),
					'desc'  => __( 'Type in this person\'s social network profiles as url|icon|tooltip, each network separated by a line break (Enter)', 'mixt' ),
					'std'   => 'https://facebook.com|fa fa-facebook,https://twitter.com|fa fa-twitter',
				),
				'social_pos' => array(
					'type'    => 'select',
					'label'   => __( 'Social Networks Position', 'mixt' ),
					'options' => array(
						'overlay' => __( 'Image overlay', 'mixt' ),
						'header'  => __( 'Next to name', 'mixt' ),
						'bottom'  => __( 'Bottom', 'mixt' ),
					),
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
					'type'        => 'textarea_html',
					'heading'     => __( 'Description', 'mixt' ),
					'description' => __( 'Enter a description about this person (HTML allowed)', 'mixt' ),
					'param_name'  => 'content',
				),
				array(
					'type'       => 'attach_image',
					'heading'    => __( 'Image', 'mixt' ),
					'param_name' => 'image',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Align', 'mixt' ),
					'param_name' => 'image_align',
					'value'      => array(
						__( 'Left', 'mixt' )   => 'align-left',
						__( 'Center', 'mixt' ) => 'align-center',
						__( 'Right', 'mixt' )  => 'align-right',
					),
					'std' => 'align-center',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Style', 'mixt' ),
					'param_name' => 'image_style',
					'value'      => array_flip($this->image_styles),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Border Color', 'mixt' ),
					'param_name' => 'image_border_color',
					'value'      => array_merge(
						array( __( 'Auto', 'mixt' ) => 'auto' ),
						array_flip( $this->colors )
					),
					'param_holder_class' => 'color-select basic-colors',
					'dependency' => array(
						'element' => 'image_style',
						'value'   => array(
							'image-border', 'image-outline', 'image-rounded image-border', 'image-rounded image-outline', 'image-circle image-border', 'image-circle image-outline'
						),
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Image Hover Color', 'mixt' ),
					'param_name' => 'image_hover_color',
					'value'      => array_flip($this->colors),
					'param_holder_class' => 'color-select basic-colors',
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
					'type'       => 'button',
					'heading'    => __( 'Button Style', 'mixt' ),
					'param_name' => 'button',
				),
				array(
					'type'        => 'exploded_textarea',
					'heading'     => __( 'Social Networks', 'mixt' ),
					'description' => __( 'Type in this person\'s social network profiles as url|icon|tooltip, each network separated by a line break (Enter)', 'mixt' ),
					'param_name'  => 'social',
					'std'         => 'https://facebook.com|fa fa-facebook,https://twitter.com|fa fa-twitter',
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Social Networks Position', 'mixt' ),
					'param_name' => 'social_pos',
					'value'      => array(
						__( 'Image overlay', 'mixt' ) => 'overlay',
						__( 'Next to name', 'mixt' )  => 'header',
						__( 'Bottom', 'mixt' )        => 'bottom',
					),
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
			'name'               => '',
			'title'              => '',
			'image'              => '',
			'social'             => 'https://facebook.com|fa fa-facebook,https://twitter.com|fa fa-twitter',
			'social_pos'         => 'overlay',
			'class'              => '',
			'button'             => '',
			'image_align'        => 'align-center',
			'image_style'        => 'rounded',
			'image_border_color' => 'auto',
			'image_hover_color'  => key($this->colors),
			'image_hover_in'     => key($this->anims['in']),
			'image_hover_out'    => key($this->anims['out']),
		), $atts ) );

		$classes = 'mixt-profile mixt-element';
		if ( ! empty($class) ) $classes .= ' ' . $class;

		$btn_classes = mixt_element_button($button);

		$has_image = ( ! empty($image) && $image > 0 );
		$content = html_entity_decode($content);

		if ( ! $has_image && $social_pos == 'overlay' ) { $social_pos == 'header'; }

		$social = explode(',', $social);
		$social_links = function($networks, $btn_classes = 'btn btn-default') {
			if ( empty($networks) ) return;
			$links = '<div class="profile-social btn-group">';
			foreach ( $networks as $network ) {
				$network = explode('|', $network);
				if ( empty($network[0]) ) return;
				$icon = ( empty($network[1]) ) ? 'fa fa-link' : $network[1];
				$atts = ( empty($network[2]) ) ? '' : "title='{$network[2]}' data-toggle='tooltip'";
				$links .= "<a href='{$network[0]}' $atts class='$btn_classes' target='_blank'><i class='$icon'></i></a>";
			}
			return $links . '</div>';
		};

		ob_start();
		?>
		
		<div class="<?php echo $classes; ?>">
			<?php if ( $has_image ) { ?>
				<div class="mixt-image profile-image <?php echo $image_align; ?>">
					<div class="image-wrap hover-content anim-on-hover <?php echo $image_style . ' ' . $image_border_color; ?>">
					<?php echo wp_get_attachment_image($image, 'full');
					if ( ! empty($social) && $social_pos == 'overlay' ) { ?>
						<div class="<?php echo 'on-hover ' . $image_hover_color; ?>" data-anim-in="<?php echo $image_hover_in; ?>" data-anim-out="<?php echo $image_hover_out; ?>">
							<div class="inner">
								<?php echo $social_links($social, $btn_classes); ?>
							</div>
						</div>
					<?php } ?>
					</div>
				</div>
			<?php } ?>
			<div class="header clearfix">
				<strong class="name">
					<?php if ( $name != '' ) echo $name . '<br>'; ?>
					<small class="color-fade"><?php echo $title; ?></small>
				</strong>
				<?php if ( $social_pos == 'header' ) echo $social_links($social, $btn_classes); ?>
			</div>

			<?php if ( ! empty($content) || ( $social_pos == 'bottom' && ! empty($social) ) ) { ?>
				<div class="content"><?php
					if ( ! empty($content) ) echo '<p class="desc">' . $content . '</p>';

					if ( $social_pos == 'bottom' ) echo $social_links($social, $btn_classes);
				?></div>
			<?php } ?>
		</div>

		<?php
		return ob_get_clean();
	}
}
new Mixt_Profile;

if ( class_exists('WPBakeryShortCode') ) {
	class WPBakeryShortCode_Mixt_Profile extends WPBakeryShortCode {}
}

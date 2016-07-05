<?php

// SITE-WIDE THEMES
$this->sections[] = array(
	'title'      => esc_html__( 'Themes', 'mixt' ),
	'desc'       => esc_html__( 'Create and manage site-wide themes.', 'mixt' ) . ' ' .
					esc_html__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
	'icon'       => 'el-icon-leaf',
	'customizer' => false,
	'fields'     => array(

		array(
			'id'       => 'site-themes',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'sortable' => true,
			'no_ajax'  => true,
			'add_text' => esc_html__( 'New Theme', 'mixt' ),
			'inputs'   => array(

				// Theme Name
				'name' => array(
					'type'       => 'text',
					'icon'       => 'el-icon-brush',
					'label'      => esc_html__( 'Theme Name', 'mixt' ),
					'wrap_class' => 'theme-name',
				),

				// Theme ID
				'id' => array(
					'type'       => 'group-id',
					'icon'       => 'el-icon-tags',
					'label'      => esc_html__( 'Theme ID', 'mixt' ),
					'wrap_class' => 'theme-id',
				),

				// Accent
				'accent' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Accent', 'mixt' ),
				),

				// Background Color
				'bg' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Background Color', 'mixt' ),
				),

				// Text Color
				'color' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Text Color', 'mixt' ),
				),

				// Text Color Fade
				'color-fade' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Text Color Fade', 'mixt' ) . ' *',
				),

				// Border Color
				'border' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Border Color', 'mixt' ),
				),

				// Inverse Background Color
				'bg-inv' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Background', 'mixt' ) . ' *',
				),

				// Inverse Text Color
				'color-inv' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Text Color', 'mixt' ),
				),

				// Inverse Text Color Fade
				'color-inv-fade' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Text Fade', 'mixt' ) . ' *',
				),

				// Inverse Border Color
				'border-inv' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Border', 'mixt' ) . ' *',
				),

				// Alt Background Color
				'bg-alt' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Alt Background', 'mixt' ) . ' *',
				),

				// Alt Text Color
				'color-alt' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Alt Text Color', 'mixt' ) . ' *',
				),

				// Alt Border Color
				'border-alt' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Alt Border', 'mixt' ) . ' *',
				),

				// Dark Background Check
				'bg-dark' => array(
					'type'       => 'checkbox',
					'label'      => esc_html__( 'Dark Background', 'mixt' ),
				),
			),
		),
	),
);

// NAVBAR THEMES
$this->sections[] = array(
	'title'      => esc_html__( 'Navbar Themes', 'mixt' ),
	'desc'       => esc_html__( 'Create and manage themes for the navbar.', 'mixt' ) . ' ' .
					esc_html__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
	'icon'       => 'el-icon-minus',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		array(
			'id'       => 'nav-themes',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'sortable' => true,
			'no_ajax'  => true,
			'add_text' => esc_html__( 'New Theme', 'mixt' ),
			'inputs'   => array(

				// Theme Name
				'name' => array(
					'type'       => 'text',
					'icon'       => 'el-icon-brush',
					'label'      => esc_html__( 'Theme Name', 'mixt' ),
					'wrap_class' => 'theme-name',
				),

				// Theme ID
				'id' => array(
					'type'       => 'group-id',
					'icon'       => 'el-icon-tags',
					'label'      => esc_html__( 'Theme ID', 'mixt' ),
					'wrap_class' => 'theme-id',
				),

				// Accent
				'accent' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Accent', 'mixt' ),
				),

				// Inverse Accent
				'accent-inv' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Accent', 'mixt' ) . ' *',
				),

				// Background Color
				'bg' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Background Color', 'mixt' ),
				),

				// Text Color
				'color' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Text Color', 'mixt' ),
				),

				// Inverse Text Color
				'color-inv' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Text Color', 'mixt' ),
				),

				// Border Color
				'border' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Border Color', 'mixt' ),
				),

				// Inverse Border Color
				'border-inv' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Inverse Border', 'mixt' ),
				),

				// Menu Background Color
				'menu-bg' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Menu Background', 'mixt' ) . ' *',
				),

				// Menu Text Color
				'menu-color' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Menu Text Color', 'mixt' ) . ' *',
				),

				// Menu Text Fade Color
				'menu-color-fade' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Menu Text Fade', 'mixt' ) . ' *',
				),

				// Menu Hover Background Color
				'menu-bg-hover' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Menu Hover Bg', 'mixt' ) . ' *',
				),

				// Menu Hover Text Color
				'menu-hover-color' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Menu Hover Text', 'mixt' ) . ' *',
				),

				// Menu Border Color
				'menu-border' => array(
					'type'  => 'color',
					'label' => esc_html__( 'Menu Border', 'mixt' ) . ' *',
				),

				// Dark Background Check
				'bg-dark' => array(
					'type'       => 'checkbox',
					'label'      => esc_html__( 'Dark Background', 'mixt' ),
				),

				// RGBA Check
				'rgba' => array(
					'type'       => 'checkbox',
					'label'      => esc_html__( 'Enable Opacity', 'mixt' ),
					'wrap_class' => 'rgba-field',
				),
			),
		),
	),
);
<?php

// SITE-WIDE THEMES
$this->sections[] = array(
	'title'      => __( 'Themes', 'mixt' ),
	'desc'       => __( 'Create and manage site-wide themes.', 'mixt' ) . ' ' .
					__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
	'icon'       => 'el-icon-leaf',
	'customizer' => false,
	'fields'     => array(

		array(
			'id'       => 'site-themes',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'sortable' => true,
			'no_ajax'  => true,
			'add_text' => __( 'New Theme', 'mixt' ),
			'inputs'   => array(

				// Theme Name
				'name' => array(
					'type'       => 'text',
					'icon'       => 'el-icon-brush',
					'label'      => __( 'Theme Name', 'mixt' ),
					'wrap_class' => 'theme-name',
				),

				// Theme ID
				'id' => array(
					'type'       => 'group-id',
					'icon'       => 'el-icon-tags',
					'label'      => __( 'Theme ID', 'mixt' ),
					'wrap_class' => 'theme-id',
				),

				// Accent
				'accent' => array(
					'type'  => 'color',
					'label' => __( 'Accent', 'mixt' ),
				),

				// Background Color
				'bg' => array(
					'type'  => 'color',
					'label' => __( 'Background Color', 'mixt' ),
				),

				// Text Color
				'color' => array(
					'type'  => 'color',
					'label' => __( 'Text Color', 'mixt' ),
				),

				// Text Color Fade
				'color-fade' => array(
					'type'  => 'color',
					'label' => __( 'Text Color Fade', 'mixt' ) . ' *',
				),

				// Border Color
				'border' => array(
					'type'  => 'color',
					'label' => __( 'Border Color', 'mixt' ),
				),

				// Inverse Background Color
				'bg-inv' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Background', 'mixt' ) . ' *',
				),

				// Inverse Text Color
				'color-inv' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Text Color', 'mixt' ),
				),

				// Inverse Text Color Fade
				'color-inv-fade' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Text Fade', 'mixt' ) . ' *',
				),

				// Inverse Border Color
				'border-inv' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Border', 'mixt' ) . ' *',
				),

				// Alt Background Color
				'bg-alt' => array(
					'type'  => 'color',
					'label' => __( 'Alt Background', 'mixt' ) . ' *',
				),

				// Alt Text Color
				'color-alt' => array(
					'type'  => 'color',
					'label' => __( 'Alt Text Color', 'mixt' ) . ' *',
				),

				// Alt Border Color
				'border-alt' => array(
					'type'  => 'color',
					'label' => __( 'Alt Border', 'mixt' ) . ' *',
				),

				// Dark Background Check
				'bg-dark' => array(
					'type'       => 'checkbox',
					'label'      => __( 'Dark Background', 'mixt' ),
				),
			),
			'default' => get_option('mixt-site-themes', array()),
		),
	),
);

// NAVBAR THEMES
$this->sections[] = array(
	'title'      => __( 'Navbar Themes', 'mixt' ),
	'desc'       => __( 'Create and manage themes for the navbar.', 'mixt' ) . ' ' .
					__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
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
			'add_text' => __( 'New Theme', 'mixt' ),
			'inputs'   => array(

				// Theme Name
				'name' => array(
					'type'       => 'text',
					'icon'       => 'el-icon-brush',
					'label'      => __( 'Theme Name', 'mixt' ),
					'wrap_class' => 'theme-name',
				),

				// Theme ID
				'id' => array(
					'type'       => 'group-id',
					'icon'       => 'el-icon-tags',
					'label'      => __( 'Theme ID', 'mixt' ),
					'wrap_class' => 'theme-id',
				),

				// Accent
				'accent' => array(
					'type'  => 'color',
					'label' => __( 'Accent', 'mixt' ),
				),

				// Inverse Accent
				'accent-inv' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Accent', 'mixt' ) . ' *',
				),

				// Background Color
				'bg' => array(
					'type'  => 'color',
					'label' => __( 'Background Color', 'mixt' ),
				),

				// Text Color
				'color' => array(
					'type'  => 'color',
					'label' => __( 'Text Color', 'mixt' ),
				),

				// Inverse Text Color
				'color-inv' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Text Color', 'mixt' ),
				),

				// Border Color
				'border' => array(
					'type'  => 'color',
					'label' => __( 'Border Color', 'mixt' ),
				),

				// Inverse Border Color
				'border-inv' => array(
					'type'  => 'color',
					'label' => __( 'Inverse Border', 'mixt' ),
				),

				// Menu Background Color
				'menu-bg' => array(
					'type'  => 'color',
					'label' => __( 'Menu Background', 'mixt' ) . ' *',
				),

				// Menu Text Color
				'menu-color' => array(
					'type'  => 'color',
					'label' => __( 'Menu Text Color', 'mixt' ) . ' *',
				),

				// Menu Text Fade Color
				'menu-color-fade' => array(
					'type'  => 'color',
					'label' => __( 'Menu Text Fade', 'mixt' ) . ' *',
				),

				// Menu Hover Background Color
				'menu-bg-hover' => array(
					'type'  => 'color',
					'label' => __( 'Menu Hover Bg', 'mixt' ) . ' *',
				),

				// Menu Hover Text Color
				'menu-hover-color' => array(
					'type'  => 'color',
					'label' => __( 'Menu Hover Text', 'mixt' ) . ' *',
				),

				// Menu Border Color
				'menu-border' => array(
					'type'  => 'color',
					'label' => __( 'Menu Border', 'mixt' ) . ' *',
				),

				// Dark Background Check
				'bg-dark' => array(
					'type'       => 'checkbox',
					'label'      => __( 'Dark Background', 'mixt' ),
				),

				// RGBA Check
				'rgba' => array(
					'type'       => 'checkbox',
					'label'      => __( 'Enable Opacity', 'mixt' ),
					'wrap_class' => 'rgba-field',
				),
			),
			'default' => get_option('mixt-nav-themes', array())
		),
	),
);
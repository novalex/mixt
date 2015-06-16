<?php

/**
 * Plugin Name: MIXT Custom Posts
 * Description: Adds portfolio & project post types.
 * Version: 1.0
 * Author: novalex
 * Author URI: http://novalx.com
 * Text Domain: mixt-posts
 */

defined( 'ABSPATH' ) or die;

add_action('init', 'mixt_posts_register');

/**
 * Register custom post types
 */
function mixt_posts_register() {

	// Portfolio & Project Posts
	$portfolio_labels = array(
		'name'          => __( 'Portfolio', 'mixt-posts'),
		'singular_name' => __( 'Portfolio Item', 'mixt-posts'),
		'search_items'  => __( 'Search Portfolio Items', 'mixt-posts'),
		'all_items'     => __( 'Portfolio', 'mixt-posts'),
		'parent_item'   => __( 'Parent Portfolio Item', 'mixt-posts'),
		'edit_item'     => __( 'Edit Portfolio Item', 'mixt-posts'),
		'update_item'   => __( 'Update Portfolio Item', 'mixt-posts'),
		'add_new_item'  => __( 'Add New Portfolio Item', 'mixt-posts'),
	);
	$portfolio_args = array(
		'labels'         => $portfolio_labels,
		'singular_label' => __('Project', 'mixt-posts'),
		'public'         => true,
		'show_ui'        => true,
		'show_in_menu'   => true,
		'menu_position'  => 9,
		'hierarchical'   => false,
		'rewrite'        => true,
		'menu_icon'      => 'dashicons-portfolio',
		'supports'       => array('title', 'editor', 'thumbnail', 'comments', 'revisions')
	);
	register_post_type( 'portfolio' , $portfolio_args );
}

/**
 * Register custom taxonomies
 */
function mixt_custom_taxonomies() {

	$category_labels = array(
		'name'          => __( 'Project Categories', 'mixt-posts'),
		'singular_name' => __( 'Project Category', 'mixt-posts'),
		'search_items'  => __( 'Search Project Categories', 'mixt-posts'),
		'all_items'     => __( 'All Project Categories', 'mixt-posts'),
		'parent_item'   => __( 'Parent Project Category', 'mixt-posts'),
		'edit_item'     => __( 'Edit Project Category', 'mixt-posts'),
		'update_item'   => __( 'Update Project Category', 'mixt-posts'),
		'add_new_item'  => __( 'Add New Project Category', 'mixt-posts'),
		'menu_name'     => __( 'Project Categories', 'mixt-posts'),
	);

	register_taxonomy(
		'project-type',
		array('portfolio'),
		array(
			'labels'         => $category_labels,
			'singular_label' => 'Project Type',
			'show_ui'        => true,
			'hierarchical'   => true,
			'rewrite'        => true,
		)
	);

	$attributes_labels = array(
		'name'          => __( 'Project Attributes', 'mixt-posts'),
		'singular_name' => __( 'Project Attribute', 'mixt-posts'),
		'search_items'  => __( 'Search Project Attributes', 'mixt-posts'),
		'all_items'     => __( 'All Project Attributes', 'mixt-posts'),
		'parent_item'   => __( 'Parent Project Attribute', 'mixt-posts'),
		'edit_item'     => __( 'Edit Project Attribute', 'mixt-posts'),
		'update_item'   => __( 'Update Project Attribute', 'mixt-posts'),
		'add_new_item'  => __( 'Add New Project Attribute', 'mixt-posts'),
		'new_item_name' => __( 'New Project Attribute', 'mixt-posts'),
		'menu_name'     => __( 'Project Attributes', 'mixt-posts'),
	);

	register_taxonomy(
		'project-attributes',
		array('portfolio'),
		array(
			'hierarchical' => true,
			'labels'       => $attributes_labels,
			'show_ui'      => true,
			'query_var'    => true,
			'rewrite'      => array( 'slug' => 'project-attributes' )
		)
	);

}

mixt_custom_taxonomies();
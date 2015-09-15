<?php

/**
 * Plugin Name: MIXT Portfolio
 * Description: Add portfolio post types and functions
 * Version: 1.0
 * Author: novalex
 * Author URI: http://novalx.com
 * Text Domain: mixt
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


class Mixt_Portfolio {

	public function __construct() {
		add_action('init', array($this, 'register_taxonomies'), 5);
		add_action('init', array($this, 'register_post_types'), 5);

		// add_action('after_setup_theme', array($this, 'add_image_sizes'));

		add_action('generate_rewrite_rules', array($this, 'rewrite_rules'));
	}

	/**
	 * Register custom post types
	 */
	public function register_post_types() {
		$portfolio_args = array(
			'labels'         => array(
				'name'          => __( 'Portfolio', 'mixt'),
				'singular_name' => __( 'Project', 'mixt'),
				'search_items'  => __( 'Search Projects', 'mixt'),
				'all_items'     => __( 'Portfolio', 'mixt'),
				'parent_item'   => __( 'Parent Project', 'mixt'),
				'edit_item'     => __( 'Edit Project', 'mixt'),
				'update_item'   => __( 'Update Project', 'mixt'),
				'add_new_item'  => __( 'Add New Project', 'mixt'),
			),
			'public'         => true,
			'show_ui'        => true,
			'show_in_menu'   => true,
			'menu_position'  => 9,
			'hierarchical'   => false,
			'rewrite'        => true,
			'has_archive'    => true,
			'menu_icon'      => 'dashicons-portfolio',
			'supports'       => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', 'post-formats' ),
		);
		register_post_type('portfolio' , $portfolio_args);
	}

	/**
	 * Register custom taxonomies
	 */
	public function register_taxonomies() {
		// Project Types
		register_taxonomy(
			'project-type',
			array('portfolio'),
			array(
				'labels'         => array(
					'name'          => __( 'Project Types', 'mixt'),
					'singular_name' => __( 'Project Type', 'mixt'),
					'search_items'  => __( 'Search Project Types', 'mixt'),
					'all_items'     => __( 'All Project Types', 'mixt'),
					'parent_item'   => __( 'Parent Project Type', 'mixt'),
					'edit_item'     => __( 'Edit Project Type', 'mixt'),
					'update_item'   => __( 'Update Project Type', 'mixt'),
					'add_new_item'  => __( 'Add New Project Type', 'mixt'),
					'new_item_name' => __( 'New Project Type', 'mixt'),
					'menu_name'     => __( 'Project Types', 'mixt'),
				),
				'show_ui'        => true,
				'hierarchical'   => true,
				'rewrite'        => true,
			)
		);

		// Project Attributes
		register_taxonomy(
			'project-attributes',
			array('portfolio'),
			array(
				'labels'       => array(
					'name'          => __( 'Project Attributes', 'mixt'),
					'singular_name' => __( 'Project Attribute', 'mixt'),
					'search_items'  => __( 'Search Project Attributes', 'mixt'),
					'all_items'     => __( 'All Project Attributes', 'mixt'),
					'parent_item'   => __( 'Parent Project Attribute', 'mixt'),
					'edit_item'     => __( 'Edit Project Attribute', 'mixt'),
					'update_item'   => __( 'Update Project Attribute', 'mixt'),
					'add_new_item'  => __( 'Add New Project Attribute', 'mixt'),
					'new_item_name' => __( 'New Project Attribute', 'mixt'),
					'menu_name'     => __( 'Project Attributes', 'mixt'),
				),
				'show_ui'      => true,
				'hierarchical' => true,
				'query_var'    => true,
				'rewrite'      => array( 'slug' => 'project-attributes' )
			)
		);
	}

	/**
	 * Add image sizes for portfolio projects
	 */
	public function add_image_sizes() {
		add_image_size( 'portfolio-landscape', 9999, 600, true );
		add_image_size( 'portfolio-portrait', 600, 9999, true );
	}

	/**
	 * Add custom post type rewrite rules to main object
	 * @param  object $wp_rewrite
	 * @return object
	 */
	public function rewrite_rules($wp_rewrite) {
		$wp_rewrite->rules = $this->date_archive_rules('portfolio', $wp_rewrite) + $wp_rewrite->rules;
		return $wp_rewrite;
	}

	/**
	 * Generate custom post type rewrite rules for date archives
	 * @param  string $cpt the custom post type for which to generate rules
	 * @param  object $wp_rewrite
	 * @return array
	 */
	public function date_archive_rules($cpt, $wp_rewrite) {
		$rules = array();

		$post_type = get_post_type_object($cpt);
		$slug_archive = $post_type->has_archive;
		if ( $slug_archive === true ) {
			$slug_archive = $post_type->rewrite['slug'];
		} else if ($slug_archive === false) {
			return $rules;
		}

		$dates = array(
			array(
				'rule' => "([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})",
				'vars' => array('year', 'monthnum', 'day'),
			),
			array(
				'rule' => "([0-9]{4})/([0-9]{1,2})",
				'vars' => array('year', 'monthnum'),
			),
			array(
				'rule' => "([0-9]{4})",
				'vars' => array('year'),
			),
		);

		foreach ( $dates as $data ) {
			$query = 'index.php?post_type='.$cpt;
			$rule = $slug_archive.'/'.$data['rule'];

			$i = 1;
			foreach ( $data['vars'] as $var ) {
				$query .= '&amp;'.$var.'='.$wp_rewrite->preg_index($i);
				$i++;
			}

			$rules[$rule."/?$"] = $query;
			$rules[$rule."/feed/(feed|rdf|rss|rss2|atom)/?$"] = $query."&amp;feed=".$wp_rewrite->preg_index($i);
			$rules[$rule."/(feed|rdf|rss|rss2|atom)/?$"] = $query."&amp;feed=".$wp_rewrite->preg_index($i);
			$rules[$rule."/page/([0-9]{1,})/?$"] = $query."&amp;paged=".$wp_rewrite->preg_index($i);
		}

		return $rules;
	}
}
new Mixt_Portfolio;

/**
 * Output portfolio filtering links
 */
function mixt_portfolio_filters() {
	$terms = get_terms('project-type');

	if ( empty($terms) ) { return; }

	$output = '<ul class="portfolio-sorter link-list">';
		$output .= '<li class="active"><a href="#" data-sort="all">' . _x( 'All', 'portfolio filter', 'mixt' ) . '</a></li>';
		foreach ( $terms as $term ) {
			$name = $term->name;
			$sort = $term->taxonomy . '-' . $term->slug;

			$output .= '<li><a href="#" data-sort="' . $sort . '">' . $name . '</a></li>';
		}
	$output .= '</ul>';

	echo $output;
}
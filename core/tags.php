<?php

/**
 * Template Tags
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


if ( ! function_exists('mixt_get_title') ) {
	/**
	 * Get the current page or post's title
	 *
	 * @param bool $echo Whether to echo or return title
	 */
	function mixt_get_title( $echo = false ) {
		if ( is_home() ) {
			if ( get_option('page_for_posts', true) ) {
				$title = get_the_title(get_option('page_for_posts', true));
			} else {
				$title = __( 'Latest Posts', 'mixt' );
			}
		} else if ( is_archive() ) {
			$term = get_term_by('slug', get_query_var('term'), get_query_var('taxonomy'));
			if ( $term ) {
				$title = $term->name;
			} else if ( is_post_type_archive() ) {
				$title = get_queried_object()->labels->name;
			} else if ( is_day() ) {
				$title = __( 'Daily Archives: ', 'mixt' ) . get_the_date();
			} else if ( is_month() ) {
				$title = __( 'Monthly Archives: ', 'mixt' ) . get_the_date('F Y');
			} else if ( is_year() ) {
				$title = __( 'Yearly Archives: ', 'mixt' ) . get_the_date('Y');
			} else if ( is_author() ) {
				$author = get_queried_object();
				$title = $author->display_name;
			} else {
				$title = single_cat_title('', false);
			}
		} else if ( is_search() ) {
			$title = __( 'Results for ', 'mixt' ) . '"' . get_search_query() . '"';
		} else if ( is_404() ) {
			$title = '404 - ' . __( 'Not Found', 'mixt' );
		} else {
			$title = get_the_title();
		}

		$title = apply_filters('mixt_title', $title);

		if ( $echo ) { echo $title; }
		else { return $title; }
	}
}


if ( ! function_exists('mixt_heading') ) {
	/**
	 * Return HTML for a heading. Will use the headline element shortcode if it is available.
	 * 
	 * @param  string $text
	 * @param  string $atts
	 * @return string
	 */
	function mixt_heading($text, $atts = '') {
		if ( shortcode_exists('mixt_headline') ) {
			return do_shortcode("[mixt_headline $atts]$text".'[/mixt_headline]');
		} else {
			extract(shortcode_atts( array(
				'desc'             => '',
				'align'            => 'left',
				'tag'              => 'h3',
				'class'            => '',
			), $atts ));
			$h_class = 'title headline mixt-heading mixt-element';
			if ( $class != '' ) { $h_class .= " $class"; }
			$h_atts = '';
			if ( $align != 'left' ) { $h_atts .= "style='text-align='$align' "; }
			return "<$tag class='$h_class' $h_atts>$text</$tag>";
		}
	}
}


if ( ! function_exists('mixt_content_nav') ) {
	/**
	 * Display page navigation links
	 *
	 * @param string  $nav_id  ID to give the nav element
	 * @param bool    $archive Whether the queried page is a posts page (blog, tag, category, etc.)
	 * @param integer $page_max
	 */
	function mixt_content_nav( $nav_id, $archive = false, $page_max = null ) {
		global $wp_query, $post;

		$options = mixt_get_options( array( 'type' => array( 'key' => 'pagination-type', 'return' => 'value' ) ) );

		$nav_class = 'page-nav ';
		if ( empty($page_max) ) $page_max = $wp_query->max_num_pages;
		$page_now = ( get_query_var('paged') > 1 ) ? get_query_var('paged') : 1;

		if ( $page_max < 2 && $nav_id != 'post-nav' ) return; // Don't output markup if there's only 1 page

		// Numbered Navigation

		if ( $archive === true && $options['type'] == 'numbered' ) {
			$nav_class .= 'paging-navigation numbered-paging';

			$page_links = paginate_links( array(
				'current'   => $page_now,
				'total'     => $page_max,
				'type'      => 'array',
				'prev_text' => '<i class="fa fa-chevron-left"></i>' . __( 'Previous', 'mixt' ),
				'next_text' => __( 'Next', 'mixt' ) . '<i class="fa fa-chevron-right"></i>',
			) );

			if ( ! empty($page_links) ) {
				?>
				<nav id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>">
					<h3 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h3>
					<ul class="pager">
						<?php foreach ( $page_links as $link ) { echo '<li>' . $link . '</li>'; } ?>
					</ul>
				</nav>
				<?php
			}

		// AJAX Navigation

		} else if ( $archive === true && ( $options['type'] == 'ajax-click' || $options['type'] == 'ajax-scroll' ) ) {
			$nav_class .= 'paging-navigation ajax-paging';

			?>
			<nav id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>"
				 data-page-now="<?php echo $page_now; ?>" data-page-max="<?php echo $page_max; ?>">
				<h3 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h3>
				<ul class="pager">
					<li><a href="<?php echo next_posts($page_max, false); ?>" class="ajax-more" 
						data-loading-text="<?php _e( 'Loading...', 'mixt' ); ?>" 
						data-complete-text="<?php _e( 'No more posts to load', 'mixt' ); ?>" 
						data-error-text="<?php _e( 'An error occured while trying to load the posts!', 'mixt' ); ?>"
					><i class="fa fa-chevron-down"></i><?php _e( 'Load more posts', 'mixt' ); ?></a></li>
				</ul>
			</nav>
			<?php

		// Classic Navigation

		} else {
			$nav_class .= 'classic-paging ';

			$is_single = ( is_single() && ! Mixt_Options::get('page', 'posts-page') );

			// Don't print empty markup
			if ( $is_single ) {
				$nav_class .= 'post-extra post-navigation';
				$previous = ( is_attachment() ) ? get_post( $post->post_parent ) : get_adjacent_post( false, '', true );
				$next = get_adjacent_post( false, '', false );
				if ( ! $next && ! $previous ) { return; }
			} else {
				$nav_class .= 'paging-navigation';
				$previous = get_previous_posts_link();
				$next = get_next_posts_link(null, $page_max);
				if ( ! $next && ! $previous ) { return; }
			}

			?>
			<nav id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>">
				<h3 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h3>
				<ul class="pager">
				<?php
					if ( $is_single ) { // Navigation links for single posts
						previous_post_link( '<li class="nav-previous previous prev">%link</li>', '<i class="fa fa-chevron-left"></i> %title' );
						next_post_link( '<li class="nav-next next">%link</li>', '%title <i class="fa fa-chevron-right"></i>' );
					} else {
						if ( $previous ) {
							echo '<li class="nav-previous prev">';
								previous_posts_link( __( '<i class="fa fa-chevron-left"></i> Previous posts', 'mixt' ) );
							echo '</li>';
						}
						if ( $next ) {
							echo '<li class="nav-next next">';
								next_posts_link( __( 'Next posts <i class="fa fa-chevron-right"></i>', 'mixt' ), $page_max );
							echo '</li>';
						}
					}
				?>
				</ul>
			</nav>
			<?php
		}
	}
}


if ( ! function_exists('mixt_comment') ) {
	/**
	 * Template for comments and pingbacks.
	 *
	 * Used as a callback by wp_list_comments() for displaying the comments.
	 */
	function mixt_comment( $comment, $args, $depth ) {

		$GLOBALS['comment'] = $comment;

		// Pingbacks & Trackbacks

		if ( 'pingback' == $comment->comment_type || 'trackback' == $comment->comment_type ) {
			?>
			<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
				<div class="comment-body">
					<?php _e( 'Pingback:', 'mixt' ); ?> 
					<?php comment_author_link(); ?> 
					<?php edit_comment_link( __( 'Edit', 'mixt' ), '<span class="edit-link">', '</span>' ); ?>
				</div>
			<?php

		// Standard Comments
			
		} else {
			?>
			<li id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
				<article id="div-comment-<?php comment_ID(); ?>" class="comment-cont">

					<?php // Comment Header ?>
					<header class="comment-header clearfix">
						<?php
							$author_url = get_comment_author_url();
							if ( empty($author_url) ) { $author_url = '#div-comment-' . get_comment_ID(); }
						
							if ( 0 != $args['avatar_size'] ) { ?>
								<a class="comment-avatar" href="<?php echo $author_url; ?>">
									<?php echo get_avatar( $comment, $args['avatar_size'] ); ?>
								</a>
							<?php } ?>

						<cite class="comment-author" itemprop="creator" itemscope="itemscope" itemtype="https://schema.org/Person">
							<?php echo get_comment_author_link(); ?>
						</cite>

						<?php edit_comment_link( __( 'Edit', 'mixt' ), '<span class="edit-link">', '</span>' ); ?>

						<div class="comment-meta">
							<a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>" class="no-color">
								<time datetime="<?php comment_time( 'c' ); ?>">
									<?php printf( _x( '%1$s at %2$s', '1: date, 2: time', 'mixt' ), get_comment_date(), get_comment_time() ); ?>
								</time>
							</a>
						</div>

					</header>

					<?php // Comment Body ?>
					<div class="comment-body">
						<div class="comment-content">
							<?php
								if ( '0' == $comment->comment_approved ) { ?>
									<p class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'mixt' ); ?></p>
								<?php }

								comment_text();
							?>
						</div>
						<?php comment_reply_link(
							array_merge(
								$args, array(
									'add_below'  => 'div-comment',
									'depth' 	 => $depth,
									'max_depth'  => $args['max_depth'],
									'before' 	 => '<footer class="reply comment-reply">',
									'after' 	 => '</footer>',
									'login_text' => ''
								)
							)
						); ?>
					</div>

				</article>
			<?php
		}
	}
}


if ( ! function_exists('mixt_comment_nav') ) {
	/**
	 * Display comment navigation links
	 *
	 * @param string $id ID to give the nav element
	 */
	function mixt_comment_nav($id) {
		$options = array(
			'type'    => array( 'key' => 'comment-pagination-type', 'return' => 'value' ),
			'display' => array( 'key' => 'comment-pagination-display', 'return' => 'value' ),
		);
		$options = mixt_get_options($options);

		if ( $options['display'] != $id && $options['display'] != 'both' ) { return; }

		// Set type to classic for the top nav
		if ( $id == 'top' && ( $options['type'] == 'ajax-click' || $options['type'] == 'ajax-scroll' ) ) { $options['type'] = 'classic'; }

		$nav_id    = 'comment-nav-' . $id;
		$nav_class = 'page-nav comment-nav ';
		$page_max  = get_comment_pages_count();

		// If comments are paginated
		if ( $page_max > 1 && get_option('page_comments') ) {

			// Numbered Navigation

			if ( $options['type'] == 'numbered' ) {
				$nav_class .= 'paging-navigation numbered-paging';

				$page_links = paginate_comments_links( array(
					'type'         => 'array',
					'total'        => $page_max,
					'echo'         => false,
					'prev_text'    => '<i class="fa fa-chevron-left"></i>' . __( 'Previous', 'mixt' ),
					'next_text'    => __( 'Next', 'mixt' ) . '<i class="fa fa-chevron-right"></i>',
				) );

				if ( ! empty($page_links) ) {
					?>
					<nav id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>">
						<h3 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h3>
						<ul class="pager">
							<?php foreach ( $page_links as $link ) { echo '<li>' . $link . '</li>'; } ?>
						</ul>
					</nav>
					<?php
				}

			// AJAX Navigation

			} else if ( $ajax === true && ( $options['type'] == 'ajax-click' || $options['type'] == 'ajax-scroll' ) ) {
				if ( $page_max < 2 || $id == 'top' ) { return; }
				$nav_class .= 'paging-navigation ajax-paging';
				$page_now   = ( get_query_var('cpage') > 1 ) ? get_query_var('cpage') : 1;

				?>
				<nav id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>"
					 data-page-now="<?php echo $page_now; ?>" data-page-max="<?php echo $page_max; ?>">
					<h3 class="screen-reader-text"><?php _e( 'Comment navigation', 'mixt' ); ?></h3>
					<ul class="pager">
						<li><a href="<?php echo get_comments_pagenum_link($page_now + 1); ?>" class="ajax-more" 
							data-loading-text="<?php _e( 'Loading...', 'mixt' ); ?>" 
							data-complete-text="<?php _e( 'No more comments to load', 'mixt' ); ?>" 
							data-error-text="<?php _e( 'An error occured while trying to load the comments!', 'mixt' ); ?>"
						><i class="fa fa-chevron-down"></i><?php _e( 'Load more', 'mixt' ); ?></a></li>
					</ul>
				</nav>
				<?php

			// Classic Navigation

			} else if ( $options['type'] == 'classic' ) {
				$nav_class .= 'classic-paging';
				?>

				<nav id="<?php echo $nav_id; ?>" class="<?php echo $nav_class; ?>">
					<h5 class="screen-reader-text"><?php _e( 'Comment navigation', 'mixt' ); ?></h5>
					<ul class="pager">
						<li class="nav-previous prev"><?php previous_comments_link( __( '<i class="fa fa-chevron-left"></i> Older comments', 'mixt' ) ); ?></li>
						<li class="nav-next next"><?php next_comments_link( __( 'Newer comments <i class="fa fa-chevron-right"></i>', 'mixt' ) ); ?></li>
					</ul>
				</nav>

				<?php
			}
		}
	}
}


if ( ! function_exists('mixt_child_page_nav') ) {
	/**
	 * Output navigation menu for child pages
	 */
	function mixt_child_page_nav() {
		if ( ! is_page() ) return;

		global $post;

		$parent_id = $post->post_parent ? $post->post_parent : $post->ID;

		$args = array(
			'echo'     => false,
			'title_li' => '',
			'child_of' => $parent_id
		);
		$children = wp_list_pages($args);
		if ( $children ) echo "<div class='child-page-nav widget'><ul class='nav'>$children</ul></div>";
	}
}

<?php

/**
 * MIXT Template Tags
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Get the current page or post's title
 *
 * @param bool $echo whether to echo or return title
 */
function mixt_get_title( $echo = false ) {
	if ( is_home() ) {
		if ( get_option('page_for_posts', true) ) {
			$title = get_the_title(get_option('page_for_posts', true));
		} else {
			$title = __('Latest Posts', 'mixt');
		}
	} else if ( is_archive() ) {
		$term = get_term_by('slug', get_query_var('term'), get_query_var('taxonomy'));
		if ( $term ) {
			$title = $term->name;
		} else if ( is_post_type_archive() ) {
			$title = get_queried_object()->labels->name;
		} else if ( is_day() ) {
			$title = __('Daily Archives: ', 'mixt') . get_the_date();
		} else if ( is_month() ) {
			$title = __('Monthly Archives: ', 'mixt') . get_the_date('F Y');
		} else if ( is_year() ) {
			$title = __('Yearly Archives: ', 'mixt') . get_the_date('Y');
		} else if ( is_author() ) {
			$author = get_queried_object();
			$title = __('Articles by ', 'mixt') . $author->display_name;
		} else {
			$title = single_cat_title('', false);
		}
	} else if ( is_search() ) {
		$title = __('Results for ', 'mixt') . '"' . get_search_query() . '"';
	} else if ( is_404() ) {
		$title = __('Not Found', 'mixt');
	} else {
		$title = get_the_title();
	}

	if ( $echo ) { echo $title; }
	else { return $title; }
}


/**
 * Display navigation to next/previous pages when applicable
 *
 * @param string $nav_id ID to give the nav element
 * @param bool $archive whether the queried page is a posts page (blog, tag, category, etc.)
 */
function mixt_content_nav( $nav_id, $archive = false ) {
	global $wp_query, $post;

	$options = array(
		'pagination-type' => array( 'return' => 'value' ),
	);
	$options = mixt_get_options($options);

	$nav_class = 'page-nav ';
	$page_max  = $wp_query->max_num_pages;
	$page_now  = ( get_query_var('paged') > 1 ) ? get_query_var('paged') : 1;

	// Numbered Navigation

	if ( $archive === true && $options['pagination-type'] == 'numbered' ) {
		if ( $page_max < 2 ) return; // Don't output pagination if there's only 1 page
		$nav_class .= 'paging-navigation numbered-paging ';

		$page_links = paginate_links( array(
			'current'   => $page_now,
			'total'     => $page_max,
			'type'      => 'array',
			'prev_text' => '<i class="icon icon-chevron-left"></i>' . __('Previous'),
			'next_text' => __('Next') . '<i class="icon icon-chevron-right"></i>',
		));

		if ( ! empty($page_links) ) {
			?>
			<nav role="navigation" id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>">
				<h1 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h1>
				<ul class="pager">
					<?php foreach ( $page_links as $link ) { echo '<li>' . $link . '</li>'; } ?>
				</ul>
			</nav>
			<?php
		}

	// AJAX Navigation

	} else if ( $archive === true && $options['pagination-type'] != 'classic' ) {
		if ( $page_max < 2 ) return; // Don't output pagination if there's only 1 page
		$nav_class .= 'paging-navigation ajax-paging ';

		?>
		<nav role="navigation" id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>">
			<h1 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h1>
			<ul class="pager">
				<li><a href="#" class="ajax-more" 
					data-loading-text="<?php _e( 'Loading...', 'mixt' ); ?>" 
					data-complete-text="<?php _e( 'No more posts to load', 'mixt' ); ?>" 
					data-error-text="<?php _e( 'An error occured while trying to load the posts!', 'mixt' ); ?>"
				><i class="icon icon-chevron-down"></i><?php _e( 'Load more posts', 'mixt' ); ?></a></li>
			</ul>
		</nav>
		<?php

	// Classic Navigation

	} else {

		// Don't print empty markup
		if ( is_single() ) {
			$previous = ( is_attachment() ) ? get_post( $post->post_parent ) : get_adjacent_post( false, '', true );
			$next = get_adjacent_post( false, '', false );

			if ( ! $next && ! $previous ) { return; }
		}
		if ( $page_max < 2 && ( is_home() || is_archive() || is_search() ) ) { return; }

		$nav_class .= ( is_single() ) ? 'post-extra post-navigation ' : 'paging-navigation ';

		?>
		<nav role="navigation" id="<?php echo esc_attr( $nav_id ); ?>" class="<?php echo $nav_class; ?>">
			<h1 class="screen-reader-text"><?php _e( 'Post navigation', 'mixt' ); ?></h1>
			<ul class="pager">

			<?php if ( is_single() ) : // Navigation links for single posts ?>

				<?php previous_post_link( '<li class="nav-previous previous prev">%link</li>', '<i class="icon icon-chevron-left"></i> %title' ); ?>
				<?php next_post_link( '<li class="nav-next next">%link</li>', '%title <i class="icon icon-chevron-right"></i>' ); ?>

			<?php elseif ( $page_max > 1 && ( is_home() || is_archive() || is_search() ) ) : ?>

				<?php if ( get_next_posts_link() ) : ?>
				<li class="nav-previous prev"><?php next_posts_link( __( '<i class="icon icon-chevron-left"></i> Older posts', 'mixt' ) ); ?></li>
				<?php endif; ?>

				<?php if ( get_previous_posts_link() ) : ?>
				<li class="nav-next next"><?php previous_posts_link( __( 'Newer posts <i class="icon icon-chevron-right"></i>', 'mixt' ) ); ?></li>
				<?php endif; ?>

			<?php endif; ?>

			</ul>
		</nav>
		<?php
	}
}


/**
 * Template for comments and pingbacks.
 *
 * Used as a callback by wp_list_comments() for displaying the comments.
 */
function mixt_comment( $comment, $args, $depth ) {

	$GLOBALS['comment'] = $comment;

	// Pingbacks & Trackbacks
	if ( 'pingback' == $comment->comment_type || 'trackback' == $comment->comment_type ) { ?>

	<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
		<div class="comment-body">
			<?php _e( 'Pingback:', 'mixt' ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( __( 'Edit', 'mixt' ), '<span class="edit-link">', '</span>' ); ?>
		</div>

	<?php

	// Standard Comments
	} else { ?>

	<li id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
		<article id="div-comment-<?php comment_ID(); ?>" class="comment-cont">

			<?php // Comment Header ?>
			<header class="comment-header clearfix">
				<?php
					$author_url = get_comment_author_url();
					if ( empty($author_url) ) { $author_url = '#'; }
				?>
				<a class="comment-avatar" href="<?php echo $author_url; ?>">
					<?php if ( 0 != $args['avatar_size'] ) echo get_avatar( $comment, $args['avatar_size'] ); ?>
				</a>

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
				<?php if ( '0' == $comment->comment_approved ) : ?>
					<p class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'mixt' ); ?></p>
				<?php endif; ?>

				<div class="comment-content">
					<?php comment_text(); ?>
				</div>

				<?php comment_reply_link(
					array_merge(
						$args, array(
							'add_below' => 'div-comment',
							'depth' 	=> $depth,
							'max_depth' => $args['max_depth'],
							'before' 	=> '<footer class="reply comment-reply">',
							'after' 	=> '</footer>'
						)
					)
				); ?>
			</div>

		</article>
	<?php
	}
}


/**
 * Prints the attached image with a link to the next attached image.
 */
function mixt_the_attached_image() {
	$post                = get_post();
	$attachment_size     = apply_filters( 'mixt_attachment_size', array( 1200, 1200 ) );
	$next_attachment_url = wp_get_attachment_url();

	/**
	 * Grab the IDs of all the image attachments in a gallery so we can get the
	 * URL of the next adjacent image in a gallery, or the first image (if
	 * we're looking at the last image in a gallery), or, in a gallery of one,
	 * just the link to that image file.
	 */
	$attachment_ids = get_posts( array(
		'post_parent'    => $post->post_parent,
		'fields'         => 'ids',
		'numberposts'    => -1,
		'post_status'    => 'inherit',
		'post_type'      => 'attachment',
		'post_mime_type' => 'image',
		'order'          => 'ASC',
		'orderby'        => 'menu_order ID'
	) );

	// If there is more than 1 attachment in a gallery...
	if ( count( $attachment_ids ) > 1 ) {
		foreach ( $attachment_ids as $attachment_id ) {
			if ( $attachment_id == $post->ID ) {
				$next_id = current( $attachment_ids );
				break;
			}
		}

		// get the URL of the next image attachment...
		if ( $next_id )
			$next_attachment_url = get_attachment_link( $next_id );

		// or get the URL of the first image attachment.
		else
			$next_attachment_url = get_attachment_link( array_shift( $attachment_ids ) );
	}

	printf( '<a href="%1$s" title="%2$s" rel="attachment">%3$s</a>',
		esc_url( $next_attachment_url ),
		the_title_attribute( array( 'echo' => false ) ),
		wp_get_attachment_image( $post->ID, $attachment_size )
	);
}


/**
 * Returns true if a blog has more than 1 category
 */
function mixt_categorized_blog() {
	if ( false === ( $all_the_cool_cats = get_transient( 'all_the_cool_cats' ) ) ) {
		// Create an array of all the categories that are attached to posts
		$all_the_cool_cats = get_categories( array(
			'hide_empty' => 1,
		) );

		// Count the number of categories that are attached to the posts
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( 'all_the_cool_cats', $all_the_cool_cats );
	}

	if ( '1' != $all_the_cool_cats ) {
		// This blog has more than 1 category so mixt_categorized_blog should return true
		return true;
	} else {
		// This blog has only 1 category so mixt_categorized_blog should return false
		return false;
	}
}

/**
 * Flush out the transients used in mixt_categorized_blog
 */
function mixt_category_transient_flusher() {
	delete_transient( 'all_the_cool_cats' );
}
add_action( 'edit_category', 'mixt_category_transient_flusher' );
add_action( 'save_post',     'mixt_category_transient_flusher' );

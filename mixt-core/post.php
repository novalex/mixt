<?php

/**
 * Post Functions
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Class for setting up and displaying the post and its components
 */
class mixtPost {

	public $ID;
	public $type;
	public $context;
	public $format;
	public $permalink;
	public $show_content = true;
	protected $content;
	protected $layout  = array();
	protected $options = array();

	/**
	 * @param string $context the post's context (single, blog, search, etc.)
	 * @param int $id ID of the post to load
	 * @param array $layout the page's layout settings
	 */
	public function __construct( $context = 'single', $id = null, $layout = null ) {

		$this->context = $context;

		if ( empty($id) ) {
			if ( $context == 'single' ) { $id = get_queried_object_id(); }
			else { $id = get_the_ID(); }
		}
		$this->ID = $id;

		if ( $context == 'single' ) {
			$this->content   = get_the_content($this->ID);
		} else {
			$this->permalink = get_permalink($this->ID);
			$this->content   = get_the_content('<button class="btn btn-black hover-accent-bg read-more">' . __('Read More', 'mixt') . '</span>');
		}

		$this->type = get_post_type($id);

		if ( empty($layout) ) {
			$layout = MIXT::get('layout');
			$layout['posts-page'] = MIXT::get('page', 'posts-page');
		}
		$this->layout = $layout;

		$this->format = get_post_format($this->ID);

		// Page type post
		if ( $context == 'page' || $this->type == 'page' ) {
			$this->format = 'page';
			$this->layout['meta-show'] = 'false'; // Do not display meta for page type posts
			// $this->layout['post-info'] = 'false'; // Do not display post info for page type posts
		}
		// Product type post
		if ( $this->type == 'product' ) { $this->format = 'product'; }

		if ( $this->format == false ) { $this->format = 'standard'; }

		$options = array(
			'format-icon' => array(
				'key'    => 'format-' . $this->format . '-icon',
				'return' => 'value',
			),
		);
		$this->options = mixt_get_options($options);
	}

	/**
	 * Return a string of classes for the post
	 */
	public function classes() {
		$classes = 'article';

		switch ( $this->context ) {
			case 'blog':
			case 'search':
				$classes .= ' blog-post';
				break;
			case 'page':
				$classes .= ' page-content';
				break;
			case 'single':
				$classes .= ' single-content';
				break;
		}
		if ( $this->layout['posts-page'] ) {
			if ( $this->layout['post-info'] ) $classes .= ' has-info';
			if ( $this->layout['feat-show'] == false ) {
				$classes .= ' no-feat';
			} else if ( $this->layout['feat-size'] != 'blog-large' && $this->layout['type'] == 'standard' ) {
				$classes .= ' feat-side';
			}
		}

		return $classes;
	}

	/**
	 * Display the post's featured media
	 *
	 * @param array $args
	 */
	public function featured( $args = array() ) {
		if ( $this->context == 'single' ) {
			$this->layout['feat-size'] = 'full';
		} else if ( $this->layout['posts-page'] && $this->layout['type'] != 'standard' ) {
			$this->layout['feat-size'] = 'blog-medium';
		} else if ( ! empty($args['size']) ) {
			$this->layout['feat-size'] = $args['size'];
		}
		$feat_size = $this->layout['feat-size'];

		$feat_classes = 'post-feat feat-' . $feat_size;

		$permalink_start = $permalink_end = $placeholder_img = '';
		if ( $this->context != 'single' ) {
			$permalink_start = '<a href="' . $this->permalink . '">';
			$permalink_end   = '</a>';
		}

		$feat_img  = get_the_post_thumbnail($this->ID, $feat_size);
		if ( ! empty($args['placeholder']) ) {
			$placeholder_img = '<div class="' . $feat_classes . '">' . $permalink_start . wp_get_attachment_image($args['placeholder'], $feat_size) . $permalink_end . '</div>';
		}
		$small_feat = ( $this->context == 'related' || ( $this->layout['posts-page'] && $this->layout['type'] == 'standard' && $this->layout['feat-size'] == 'blog-small' ) ) ? true : false;

		$format_icon = '<a href="' . $this->permalink . '" class="' . $feat_classes . ' feat-format"><i class="format-icon ' . $this->options['format-icon'] . '"></i></a>';

		$output = '';

		switch ($this->format) {
			case 'link':	
			case 'aside':
			case 'quote':
				$feat_classes .= ' post-' . $this->format;

				if ( $this->format == 'link' ) {
					$link_query = '<a ';

					if ( substr($this->content, 0, strlen($link_query)) === $link_query && preg_match('/<a href="(.*)".*?<\/a>/i', $this->content, $matches) ) {
						$post_link = $matches[1];
						$this->content = str_replace($matches[0], '', $this->content);
					} else {
						$post_link = $this->content;
						$this->show_content = false;
					}

					if ( $small_feat ) {
						if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else {
							$output = str_replace($this->permalink, $post_link, $format_icon);
						}
					} else {
						$output = '<div class="' . $feat_classes . '"><a href="' . $post_link . '" class="accent-bg" target="_blank">' .
									  '<h2 class="title">' . get_the_title() . '</h2><small>' . $post_link . '</small>' .
								  '</a></div>';
					}
				} else {
					if ( $small_feat ) {
						if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else {
							$output = $format_icon;
						}
					} else {
						$this->show_content = false;
						$output = '<div class="' . $feat_classes . '">' . $this->content . '</div>';
					}
				}
				break;

			// Gallery & Video Format
			case 'video':
			case 'gallery':
				$regex_pattern = get_shortcode_regex();

				// Video & Gallery Shortcode
				if ( preg_match_all( '/'.$regex_pattern.'/s', $this->content, $matches ) ) {
					$shortcode      = $matches[0][0];
					$shortcode_name = $matches[2][0];

					// Video Format
					if ( $this->format == 'video' && $shortcode_name == 'video' ) {
						$feat_classes .= ' post-video video-hosted';

						$this->content = str_replace($shortcode, '', $this->content);

						if ( $small_feat ) {
							if ( ! empty($placeholder_img) ) {
								$output = $placeholder_img;
							} else {
								$output = $format_icon;
							}
						} else {
							$output = '<div class="' . $feat_classes . '">' . do_shortcode($shortcode) . '</div>';
						}

					// Gallery Format
					} else if ( $this->format == 'gallery' && $shortcode_name == 'gallery' ) {
						$feat_classes .= ' post-gallery';
						$this->content = str_replace($shortcode, '', $this->content);

						// Override size and add featured attribute
						preg_match('/size=.([\w]*)./i', $shortcode, $matches);
						$new_attr = 'size="' . $feat_size . '" feat="true"';
						if ( empty($matches[0]) ) {
							$shortcode = str_replace(']', $new_attr . ']', $shortcode);
						} else {
							$shortcode = str_replace($matches[0], $new_attr, $shortcode);
						}

						if ( ! empty($args['minimal']) ) {
							if ( ! empty($placeholder_img) ) {
								$output = $placeholder_img;
							} else {
								$output = $format_icon;
							}
						} else {
							$output = '<div class="' . $feat_classes . '">' . do_shortcode($shortcode) . '</div>';
						}
					}

				// Video Embed
				} else if ( $this->format == 'video' ) {
					$feat_classes .= ' post-video video-embed';
					preg_match('/<iframe.*?<\/iframe>/i', $this->content, $matches);
					if ( ! empty($matches[0]) ) {
						$video_iframe = $matches[0];
						$this->content = str_replace($video_iframe, '', $this->content);

						if ( $small_feat ) {
							if ( ! empty($placeholder_img) ) {
								$output = $placeholder_img;
							} else {
								$output = $format_icon;
							}
						} else {
							$output = '<div class="' . $feat_classes . '">' . $video_iframe . '</div>';
						}
					}
				}
				break;

			// Image Format
			case 'image':
				$feat_classes .= ' post-image';
				$feat_id = mixt_get_post_image($this->content, 'id');
				if ( ! empty($feat_id) ) {
					$output = '<div class="' . $feat_classes . '">' .
							 $permalink_start . wp_get_attachment_image($feat_id, $feat_size) . $permalink_end .
						 '</div>';
					$this->content = str_replace(mixt_get_post_image($this->content), '', $this->content);
				} else if ( ! empty($placeholder_img) ) {
					$output = $placeholder_img;
				} else {
					$output = $format_icon;
				}
				break;

			// Audio Format
			case 'audio':
				$feat_classes .= ' post-audio';
				preg_match('/<iframe.*?<\/iframe>/i', $this->content, $matches);
				if ( ! empty($matches[0]) ) {
					$feat_classes .= ' audio-embed';
					$audio_iframe = $matches[0];
					$this->content = str_replace($audio_iframe, '', $this->content);

					if ( $small_feat ) {
						if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else {
							$output = $format_icon;
						}
					} else {
						$output = '<div class="' . $feat_classes . '">' . $audio_iframe . '</div>';
					}
				}
				break;

			// Standard Format
			default:
				if ( ! empty($feat_img) ) {
					$feat_classes .= ' post-image';
					$output = '<div class="' . $feat_classes . '">' . $permalink_start . $feat_img . $permalink_end . '</div>';
				} else if ( $this->context != 'single' && ( $this->layout['type'] != 'standard' || $this->layout['feat-size'] != 'blog-large' ) ) {
					if ( ! empty($placeholder_img) ) {
						$output = $placeholder_img;
					} else if ( $this->type != 'page' ) {
						$output = $format_icon;
					}
				}
				break;
		} // End Switch

		// Output Featured if Enabled
		if ( $this->layout['feat-show'] || in_array($this->context, array('single', 'related')) ) {
			echo $output;
		}
	}

	/**
	 * Display the post's header
	 */
	public function header() {
		$head_opt = MIXT::get('header');

		$permalink_start = $permalink_end = '';
		if ( $this->context != 'single' ) {
			$permalink_start = '<a href="' . $this->permalink . '">';
			$permalink_end   = '</a>';
		}

		// Post Info

		if ( $this->layout['posts-page'] && $this->layout['post-info'] ) {

			echo '<div class="post-info">';

			// Post Format Icon
			if ( ! empty($this->options['format-icon']) ) {
				if ( $this->format == 'standard' ) {
					$format_link = '#';
				} else {
					$format_link = get_post_format_link($this->format);
				}
				echo '<a href="' . $format_link . '" class="post-format"><i class="icon ' . $this->options['format-icon'] . '"></i></a>';
			}

			// Post Date
			$date_iso    = esc_attr( get_the_date('c') );
			$date_year   = get_the_date('Y');
			$date_month  = get_the_date('m');
			$date_day    = get_the_date('d');
			$date_format = '<strong>' . esc_html( $date_day ) . '</strong>' . get_the_date('M') . ', ' . esc_html( $date_year );
			$date_url    = get_day_link( $date_year, $date_month, $date_day );

			$date = '<time class="entry-date published" datetime="' . $date_iso . '">' . $date_format . '</time>';
			echo '<a href="' . esc_url( $date_url ) . '" title="' . esc_attr( get_the_time() ) . '" rel="bookmark" class="post-date no-color">' . $date . '</a>';

			echo '</div>';
		}

		// Display Featured Post Media

		$display_feat = ( $head_opt['enabled'] && $head_opt['media-type'] == 'image' && $head_opt['img-src'] == 'feat' ) ? false : true;

		if ( $display_feat || $this->context == 'single' ) {
			$this->featured();
		}

		// Display Post Title & Meta

		if ( ( ! $head_opt['enabled'] || ! $head_opt['content-info'] ) || $this->context == 'blog' ) {

			$show_title = ( $this->context != 'single' || ! $head_opt['location-bar'] || ( $head_opt['loc-bar-left-content'] != 1 && $head_opt['loc-bar-right-content'] != 1 ) ) ? true : false;

			if ( ( $this->format != 'link' || $this->layout['feat-show'] == false ) && $show_title ) { ?>
				<h1 class="page-title"><?php echo $permalink_start . get_the_title() . $permalink_end; ?></h1><?php
			}

			// Header Post Meta
			if ( $this->layout['meta-show'] == 'header' ) {
				mixt_post_meta(null);
			}
		}

	}

	/**
	 * Display the post's content
	 *
	 * @param string $type display full content or excerpt
	 */
	public function content($type = 'full') {

		if ( is_attachment() ) {
			echo wp_get_attachment_image($this->ID, 'full');
		} else if ( $this->show_content != false ) {
			if ( $this->layout['post-content'] == 'full' && $type == 'full' ) {
				$content = apply_filters( 'the_content', $this->content );
				$content = str_replace( ']]>', ']]&gt;', $content );
			} else {
				$content = get_the_excerpt();
			}

			echo $content;
		}

		// Footer Post Meta
		if ( $this->layout['meta-show'] == 'footer' ) {
			mixt_post_meta(null);
		}
	}
}


/**
 * Get image from the post content
 *
 * @param string $content content to search in for image
 * @param string $type return full image markup, ID, or URL
 */
function mixt_get_post_image($content = null, $type = 'full') {
	if ( is_null($content) ) {
		global $post;
		$content = $post->post_content;
	}
	$img = '';
	$pattern = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $content, $matches);

	if ( $type == 'full' ) {
		$img = $matches[0][0];
	} else if ( $type == 'id' ) {
		$full_img = $matches[0][0];
		$img = preg_match_all('/wp-image-(.\S{0,4})/i', $full_img, $img_id);
		$img = $img_id[1][0];
	} else if ( $type == 'url' ) {
		$img = $matches[1][0];
	}

	if ( ! empty($img) ) { return $img; }
}


/**
 * Display the "about the author" box
 *
 * @param bool $title display title
 */
function mixt_about_the_author($title = true) {
	$bio = get_the_author_meta('description');

	if ( ! empty($bio) ) {
		$id     = get_the_author_meta('ID');
		$name   = '<a href="' . get_author_posts_url($id) . '" class="author-url" rel="author">' .
					  get_the_author_meta('display_name') .
				  '</a>';
		$avatar = get_avatar($id, 64);
		?>
		<aside class="post-extra about-the-author"><?php
			if ( $title ) echo do_shortcode('[mixt_headline]' . _x('About ', 'author', 'mixt' ) . $name . '[/mixt_headline]');

			if ( ! empty($avatar) ) {
				echo '<div class="author-avatar">' . $avatar . '</div>';
			} ?>
			<div class="author-bio"><?php echo wpautop($bio); ?></div>
		</aside>
	<?php }
}


/**
 * Display related posts
 *
 * @param array $args
 */
function mixt_related_posts( $args = array() ) {
	$defaults = array(
		'number'  => '3',
		'slider'  => false,
		'feat-ph' => '',
		'related' => 'tags',
	);
	$args = wp_parse_args($args, $defaults);

	global $post;
	$orig_post = $post;

	if ( $args['related'] == 'tags' ) {
		$post_related = wp_get_post_tags($post->ID);
	} else {
		$post_related = wp_get_post_categories($post->ID);
	}

	if ( $post_related ) {
		$related_ids = array();
		if ( $args['related'] == 'tags' ) {
			$related_in = 'tag__in';
			foreach ( $post_related as $tag ) { $related_ids[] = $tag->term_id; }
		} else {
			$related_in = 'category__in';
			foreach ( $post_related as $cat ) { $related_ids[] = $cat; }
		}
		$query_args = array(
			$related_in           => $related_ids,
			'orderby'             => 'rand',
			'post__not_in'        => array($post->ID),
			'posts_per_page'      => $args['number'],
			'ignore_sticky_posts' => 1,
		);

		$rel_query = new WP_Query( $query_args );

		if ( $rel_query->have_posts() ) {
			?>
			<div class="post-extra post-related post-list">
				<?php

				echo do_shortcode('[mixt_headline text="' . __( 'Related Posts', 'mixt' ) . '"]');

				if ( $args['slider'] ) { echo '<div class="slider-cont controls-alt">'; }

				while ( $rel_query->have_posts() ) :
					$rel_query->the_post();
					$title   = get_the_title();
					$link    = get_the_permalink();
					$post_ob = new mixtPost('related');

					?>
					<article class="post related-post">
						<?php
						$feat_args = array(
							'size'        => 'blog-medium',
							'placeholder' => $args['feat-ph'],
						);
						if ( $args['slider'] ) { $feat_args['minimal'] = true; }
						$post_ob->featured($feat_args);
						?>
						<a rel="external" href="<?php echo $link; ?>" class="related-title"><?php echo $title; ?></a>
						<a rel="external" href="<?php echo $link; ?>" class="related-title-tip" title="<?php echo $title; ?>"></a>
					</article>
					<?php
				endwhile;

				if ( $args['slider'] ) { echo '</div>'; } // Close .slider-cont
			?>
			</div>
			<?php
		}
	}

	$post = $orig_post;
	wp_reset_query();
}


/**
 * Prints or returns HTML with meta information for the current post-date/time and author.
 *
 * @param mixed $args array of arguments or null to use global settings
 */
function mixt_post_meta( $args = array() ) {

	global $mixt_opt;

	if ( is_null($args) ) {
		$args = array();

		if ( $mixt_opt['meta-author']   == false ) { $args['author'] = false; }
		if ( $mixt_opt['meta-date']     == false ) { $args['date'] = false; }
		if ( $mixt_opt['meta-category'] == false ) { $args['category'] = false; }
		if ( $mixt_opt['meta-comments'] == false ) { $args['comments'] = false; }
		if ( ! empty($mixt_opt['meta-separator']) ) { $args['separator'] = $mixt_opt['meta-separator']; }
	}

	// Default Args
	$defaults = array(
		'echo'      => true,
		'author'    => true,
		'date'      => true,
		'category'  => true,
		'comments'  => true,
		'separator' => '',
	);

	$args = wp_parse_args($args, $defaults);

	$author = $date = $category = $comments = '';

	$separator = empty($args['separator']) ? '' : '<span class="meta-sep">' . $args['separator'] . '</span>';

	// Author
	if ( $args['author'] ) {
		$author_name   = get_the_author();
		$author_icon   = empty($mixt_opt['meta-author-icon']) ? '' : '<i class="icon ' . $mixt_opt['meta-author-icon'] . '"></i>';
		if ( empty($author_name) ) {
			$author_id   = get_queried_object()->post_author;
			$author_name = get_the_author_meta( 'display_name', $author_id );
		} else {
			$author_id = get_the_author_meta( 'ID' );
		}

		if ( ! empty($author_name) ) {
			$author_url = esc_url( get_author_posts_url( $author_id ) );
			$author_all = __( 'View all posts by ', 'mixt' ) . esc_attr( $author_name );
			$author = '<span class="author vcard"><a class="url fn n" href="' . $author_url . '" title="' . $author_all . '">' . esc_html( $author_name ) . '</a></span>';
			$author = '<span class="byline">' . $author_icon . __( 'By ', 'mixt' ) . $author . '</span>' . $separator;
		}
	}

	// Post Date
	if ( $args['date'] ) {
		$date_iso    = esc_attr( get_the_date('c') );
		$date_format = esc_html( get_the_date('F jS, Y') );
		$date_url    = get_day_link( get_the_date('Y'), get_the_date('m'), get_the_date('d') );
		$date_icon   = empty($mixt_opt['meta-date-icon']) ? '' : '<i class="icon ' . $mixt_opt['meta-date-icon'] . '"></i>';

		$date = '<time class="entry-date published" datetime="' . $date_iso . '">' . $date_format . '</time>';
		$date = '<a href="' . esc_url( $date_url ) . '" title="' . esc_attr( get_the_time() ) . '" rel="bookmark">' . $date . '</a>';

		if ( get_the_time('U') !== get_the_modified_time( 'U' ) ) {
			// Post was updated
			$updated_iso  = esc_attr( get_the_modified_date('c') );
			$updated_date = esc_html( get_the_modified_date() );
			$updated_text = __( 'Updated', 'mixt' );

			$date .= '<time class="updated" datetime="' . $updated_iso . '" title="' . $updated_text . '&nbsp;' . $updated_date . '">*</time>';
		}

		$date = '<span class="posted-on">' . $date_icon . $date . '</span>' . $separator;
	}

	// Category
	if ( $args['category'] ) {
		$cats     = get_the_category();
		$cat_icon = empty($mixt_opt['meta-category-icon']) ? '' : '<i class="icon ' . $mixt_opt['meta-category-icon'] . '"></i>';
		if ( ! empty($cats) && is_array($cats) ) {
			$category = '<span class="cat">' . $cat_icon;
			foreach ( $cats as $cat ) {
				$category .= '<a href="' . get_category_link($cat->term_id ) . '">' . $cat->cat_name . '</a>';
			}
			$category .= '</span>' . $separator;
		}
	}

	// Comments
	if ( $args['comments'] && ( comments_open() || '0' != get_comments_number() ) ) {
		$comments_num  = get_comments_number();
		$comments_icon = empty($mixt_opt['meta-comments-icon']) ? '' : '<i class="icon ' . $mixt_opt['meta-comments-icon'] . '"></i>';

		
		if ( $comments_num == 0 ) { $comments_text = __( 'No comments', 'mixt' ); }
		else if ( $comments_num > 1 ) { $comments_text = $comments_num . __( ' comments', 'mixt' ); }
		else { $comments_text = __( '1 comment', 'mixt' ); }

		$comments = '<span class="comments">' . $comments_icon . '<a href="' . get_comments_link() . '">' . $comments_text . '</a></span>' . $separator;
	}

	// Full HTML string
	$meta = '<div class="entry-meta post-meta">' . $author . $date . $category . $comments . '</div>';

	if ( $args['echo'] ) { echo $meta; }
	else { return $meta; }
}
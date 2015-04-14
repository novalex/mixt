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
	public $format;
	public $permalink;
	public $excerpt;
	protected $content;
	protected $options = array();

	public function __construct( $type = 'single' ) {
		// Set post type (single or archive page)
		$this->type = $type;

		$options = array(
			// General
			'blog-type'      => array(
				'return' => 'value',
			),
			'post-info' => array(),
			// Post Header
			'feat-size' => array(
				'key'     => 'post-feat-size',
				'return'  => 'value',
				'default' => 'blog-large',
			),
			// Post Meta
			'meta-show' => array(
				'return' => 'value',
			),
		);
		$this->options = mixt_get_options($options);

		if ( $type == 'page' || $type == 'page-single' ) { $this->options['meta-show'] = 'false'; }

		if ( $type == 'single' ) {
			$this->ID        = get_queried_object_id();
			$this->content   = get_the_content($this->ID);
		} else {
			$this->ID        = get_the_id();
			$this->permalink = get_permalink($this->ID);
			$this->excerpt   = get_the_excerpt();
			$this->content   = get_the_content('<button class="btn read-more">' . __('Read More', 'mixt') . '</span>');
		}

		$this->format = get_post_format($this->ID);
		if ( $this->format == false ) { $this->format = 'standard'; }
	}

	// Post Functions
	public function classes() {
		$classes = '';

		if ( $this->type == 'blog' ) {
			if ( $this->options['post-info'] == 'true' ) { $classes .= 'has-info '; }
			if ( $this->options['feat-size'] != 'blog-large' ) { $classes .= 'feat-side '; }
		}

		return $classes;
	}

	// Post Featured Media
	public function featured( $args = array() ) {
		if ( $this->type == 'single' ) {
			$this->options['feat-size'] = 'full';
		} else if ( ! empty($args['size']) ) {
			$this->options['feat-size'] = $args['size'];
		}
		$feat_size = $this->options['feat-size'];

		$feat_classes = 'post-feat feat-' . $feat_size;

		$permalink_start = $permalink_end = '';
		if ( $this->type != 'single' ) {
			$permalink_start = '<a href="' . $this->permalink . '">';
			$permalink_end   = '</a>';
		}

		$feat_img  = get_the_post_thumbnail($this->ID, $feat_size);

		// Show the featured image if one exists
		if ( ! empty($feat_img) ) {
			$feat_classes .= ' post-image';
			echo '<div class="' . $feat_classes . '">' . $permalink_start . $feat_img . $permalink_end . '</div>';

		} else {

			// Gallery & Video Format
			if ( $this->format == 'gallery' || $this->format == 'video' ) {
				$regex_pattern = get_shortcode_regex();

				if ( preg_match_all( '/'.$regex_pattern.'/s', $this->content, $matches ) ) {

					$shortcode      = $matches[0][0];
					$shortcode_name = $matches[2][0];

					// Video Format
					if ( $this->format == 'video' && $shortcode_name == 'video' ) {
						$feat_classes .= ' post-video video-hosted';

						$this->content = str_replace($shortcode, '', $this->content);
						echo '<div class="' . $feat_classes . '">' . do_shortcode($shortcode) . '</div>';

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
						echo '<div class="' . $feat_classes . '">' . do_shortcode($shortcode) . '</div>';
					}

				} else if ( $this->format == 'video' ) {
					$feat_classes .= ' post-video video-embed';
					preg_match('/<iframe.*?<\/iframe>/i', $this->content, $matches);
					if ( ! empty($matches[0]) ) {
						$video_iframe = $matches[0];
						$this->content = str_replace($video_iframe, '', $this->content);
						echo '<div class="' . $feat_classes . '">' . $video_iframe . '</div>';
					}
				}

			// Image Format
			} else if ( $this->format == 'image' ) {
				$feat_classes .= ' post-image';
				$feat_id = mixt_get_post_image($this->content, 'id');
				if ( ! empty($feat_id) ) {
					echo '<div class="' . $feat_classes . '">' .
							 $permalink_start . wp_get_attachment_image($feat_id, $feat_size) . $permalink_end .
						 '</div>';
					$this->content = str_replace(mixt_get_post_image($this->content), '', $this->content);
				}
			} else {
				if ( ! empty($args['placeholder']) ) {
					echo '<div class="' . $feat_classes . '">' .
							 $permalink_start . wp_get_attachment_image($args['placeholder'], $feat_size) . $permalink_end .
						 '</div>';
				}
			}
		}
	}

	// Post Header
	public function header() {

		$options = array(
			'location-bar' => array(),
			'loc-bar-left-content' => array(
				'type'   => 'str',
				'return' => 'value',
			),
			'loc-bar-right-content' => array(
				'type'   => 'str',
				'return' => 'value',
			),
			// Media Header Options
			'head-media' => array(),
			'head-media-type' => array(
				'type'    => 'str',
				'return'  => 'value',
				'default' => 'color',
			),
			'head-img-src' => array(
				'type'   => 'str',
				'return' => 'value',
			),
			'head-content-info' => array(),
			// Post Options
			'format-icon' => array(
				'key'    => 'format-' . $this->format . '-icon',
				'return' => 'value',
			),
		);
		$options = mixt_get_options($options);

		$permalink_start = $permalink_end = '';
		if ( $this->type != 'single' ) {
			$permalink_start = '<a href="' . $this->permalink . '">';
			$permalink_end   = '</a>';
		}

		// Post Info

		if ( $this->options['post-info'] == 'true' && $this->type == 'blog' ) {

			echo '<div class="post-info">';

			// Post Format Icon
			if ( ! empty($options['format-icon']) ) {
				$format_text = ucfirst($this->format);
				$format_link = get_post_format_link($this->format);
				echo '<a href="' . $format_link . '" class="post-format" title="' . $format_text . '"><i class="icon ' . $options['format-icon'] . '"></i></a>';
			}

			// Post Date
			$date_iso    = esc_attr( get_the_date('c') );
			$date_year   = get_the_date('Y');
			$date_month  = get_the_date('m');
			$date_day    = get_the_date('d');
			$date_format = '<strong>' . esc_html( $date_day ) . '</strong>' . esc_html( $date_month ) . ', ' . esc_html( $date_year );
			$date_url    = get_day_link( $date_year, $date_month, $date_day );

			$date = '<time class="entry-date published" datetime="' . $date_iso . '">' . $date_format . '</time>';
			echo '<a href="' . esc_url( $date_url ) . '" title="' . esc_attr( get_the_time() ) . '" rel="bookmark" class="post-date no-color">' . $date . '</a>';

			echo '</div>';
		}

		// Display Featured Post Media

		$display_feat = ( $options['head-media'] == 'true' && $options['head-media-type'] == 'image' && $options['head-img-src'] == 'feat' ) ? 'false' : 'true';

		if ( $display_feat == 'true' || $this->type == 'single' ) {
			$this->featured();
		}

		// Display Post Title & Meta

		if ( ( $options['head-media'] != 'true' || $options['head-content-info'] != 'true' ) || $this->type == 'blog' ) {

			if ( $this->format != 'aside' && ( $this->type != 'single' || $options['location-bar'] == 'false' || ( $options['loc-bar-left-content'] != 1 && $options['loc-bar-right-content'] != 1 ) ) ) { ?>
				<h1 class="page-title"><?php echo $permalink_start . get_the_title() . $permalink_end; ?></h1><?php
			}

			// Header Post Meta
			if ( $this->options['meta-show'] == 'header' ) {
				mixt_post_meta(null);
			}
		}

	}

	// Post Content
	public function content() {

		$options = array(
			'post-content' => array(
				'return' => 'value',
			),
		);
		$options = mixt_get_options($options);

		if ( $options['post-content'] == 'full' ) {
			$content = apply_filters( 'the_content', $this->content );
			$content = str_replace( ']]>', ']]&gt;', $content );
		} else {
			$content = $this->excerpt;
		}

		echo $content;

		// Footer Post Meta
		if ( $this->options['meta-show'] == 'footer' ) :
			mixt_post_meta(null);
		endif;
	}
}


/**
 * Get the first image from the post
 *
 * @param str $content content to search in for image
 * @param str $type return full image markup, ID, or URL
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
	} else {
		$img = $matches[1][0];
	}

	if ( ! empty($img) ) { return $img; }
}


/**
 * Display the "about the author" box
 */
function mixt_about_the_author() {
	$author_name = get_the_author_meta( "display_name" );
	$author_bio  = get_the_author_meta('description');

	if ( ! empty($author_bio) ) { ?>
		<aside class="post-extra about-the-author">
			<h3 class="title">
				<?php echo _x('About ', 'author', 'mixt' ) . $author_name; ?>
			</h3>
			<div class="author-avatar"><?php echo get_avatar( get_the_author_meta('ID'), 64 ); ?></div>
			<div class="author-bio">
				<?php echo wpautop($author_bio); ?>
			</div>
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
		'featured' => 'true',
		'feat-ph'  => '',
		'excerpt'  => 'true',
		'number'   => '3',
		'related'  => 'tags',
	);
	$args = wp_parse_args($args, $defaults);

	global $post;
	$orig_post = $post;

	if ( $args['related'] == 'tags' ) {
		$post_related = wp_get_post_tags($post->ID);
	} else {
		$post_related = wp_get_post_categories($post->ID);
	}

	if ( $post_related ) { ?>
		<div class="post-extra post-related post-list">
			<h3 class="title"><?php echo __( 'Related Posts', 'mixt' ); ?></h3>

			<?php
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
				//'post__not_in'        => array($post->ID),
				'posts_per_page'      => $args['number'],
				'ignore_sticky_posts' => 1
			);

			$rel_query = new wp_query( $query_args );

			while( $rel_query->have_posts() ) {
				$rel_query->the_post();

				$post_ob = new mixtPost('related');

				?>
				<article class="post related-post">
					<?php if ( $args['featured'] == 'true' ) {
						$feat_args = array(
							'size'        => 'blog-medium',
							'placeholder' => $args['feat-ph'],
						);
						$post_ob->featured($feat_args);
					} ?>
					<a rel="external" href="<?php the_permalink(); ?>" class="related-title"><?php the_title(); ?></a>
					<?php if ( $args['excerpt'] == 'true' ) { ?>
						<div class="related-content">
							<?php the_excerpt(); ?>
						</div>
					<?php } ?>
				</article>
			<?php } ?>
		</div>
	<?php }

	$post = $orig_post;
	wp_reset_query();
}
    

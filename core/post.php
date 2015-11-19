<?php

/**
 * Post Functions
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


if ( ! class_exists('Mixt_Post') ) {
	/**
	 * Class for setting up and displaying the post and its components
	 */
	class Mixt_Post {

		/**
		 * @var integer
		 */
		public $ID;

		/**
		 * Post type
		 * @var string
		 */
		public $type;

		/**
		 * Context in which the post is displayed
		 * @var string
		 */
		public $context;

		/**
		 * Post Format
		 * @var string
		 */
		public $format;

		/**
		 * Post Permalink
		 * @var string
		 */
		public $permalink;

		/**
		 * @var bool
		 */
		public $show_content = true;

		/**
		 * Post display options
		 * @var array
		 */
		public $post_display = array();

		/**
		 * The post's content
		 * @var string
		 */
		protected $content;

		/**
		 * Page's layout options
		 * @var array
		 */
		protected $layout  = array();

		/**
		 * Various post options
		 * @var array
		 */
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

			// Set post display options
			$this->post_display = Mixt_Options::get('post-display');

			// Set content and permalink based on context
			if ( $context == 'single' ) {
				$this->content   = get_the_content($this->ID);
			} else {
				$this->permalink = get_permalink($this->ID);
				$this->content   = get_the_content();
			}

			$this->type = get_post_type($id);

			if ( empty($layout) ) {
				$layout = Mixt_Options::get('layout');
				$layout['page-type'] = Mixt_Options::get('page', 'page-type');
				$layout['posts-page'] = Mixt_Options::get('page', 'posts-page');
			}
			$this->layout = $layout;
			
			// Set the post format
			if ( $context == 'page' || $this->type == 'page' ) {
				$this->format = 'page';
			} else if ( $this->type == 'product' ) {
				$this->format = 'product';
			} else if ( $context == 'related' && is_preview() ) {
				// Fix bug where get_post_format returns value set as query arg in preview mode
				$this->format = false;
			} else {
				$this->format = get_post_format($this->ID);
				if ( $this->format == false ) { $this->format = 'standard'; }
			}

			$this->options = mixt_get_options( array(
				'format-icon' => array(
					'key'    => 'format-' . $this->format . '-icon',
					'return' => 'value',
				),
			) );
			$this->options['header'] = Mixt_Options::get('header');

			// Do not display meta under special circumstances
			if ( $this->display_component('meta') == false ) { $this->layout['meta-show'] = 'false'; }
		}

		/**
		 * Return string of classes for the post
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
			if ( $this->layout['post-info'] ) $classes .= ' has-info';
			if ( $this->layout['posts-page'] ) {
				if ( ! $this->display_component('featured') ) {
					$classes .= ' no-feat';
				} else if ( $this->layout['feat-size'] != 'blog-large' && $this->layout['type'] == 'standard' ) {
					$classes .= ' feat-side';
				}
			}
			if ( ! $this->display_component('title') ) { $classes .= ' no-title'; }
			if ( ! $this->display_component('content') ) { $classes .= ' no-content'; }

			return $classes;
		}

		/**
		 * Return whether to display a post component or not
		 * 
		 * @param  string $comp
		 * @return bool
		 */
		public function display_component($comp) {
			if ( array_key_exists($comp, $this->post_display) ) {
				return $this->post_display[$comp];
			} else {
				switch ($comp) {

					// Featured media
					case 'featured':
						if ( $this->layout['feat-show'] ) {
							if ( in_array($this->context, array('blog', 'related')) ) {
								return true;
							} else if ( $this->context == 'single' ) {
								if ( in_array($this->format, array('image', false)) ) {
									return ( ! ( $this->options['header']['enabled'] && $this->options['header']['media-type'] == 'image' && $this->options['header']['img-src'] == 'feat' ) );
								} else {
									return true;
								}
							} else {
								return false;
							}
						} else {
							return false;
						}
						break;

					// Small Featured Media
					case 'small-feat':
						return (
							$this->context == 'related' ||
							( $this->layout['posts-page'] && $this->layout['type'] == 'standard' && $this->layout['feat-size'] == 'blog-small' ) ||
							$this->display_component('rollover')
						);
						break;

					// Featured Media Rollover
					case 'rollover':
						global $mixt_opt;
						return ( $this->layout['page-type'] == 'portfolio' && ( ! empty($mixt_opt['portfolio-rollover']) && $mixt_opt['portfolio-rollover'] ) );
						break;

					// Title
					case 'title':
						return (
							$this->context != 'single' || ! $this->options['header']['location-bar'] ||
							( $this->options['header']['loc-bar-left-content'] != 1 && $this->options['header']['loc-bar-right-content'] != 1 )
						);
						break;

					// Meta
					case 'meta':
						return ( $this->context != 'page' && $this->type != 'page' );
						break;

					// Content
					case 'content':
						return $this->show_content;
						break;

					default:
						return null;
				}
			}
		}

		/**
		 * Display the post's featured media
		 *
		 * @param array $args
		 */
		public function featured( $args = array() ) {

			// Featured size for portfolio pages
			if ( $this->layout['page-type'] == 'portfolio' ) {
				if ( $this->layout['type'] == 'masonry' ) {
					$this->layout['feat-size'] = 'full';
				} else if ( $this->layout['type'] == 'grid' ) {
					$this->layout['feat-size'] = 'blog-grid';
				} else if ( ! empty($args['size']) ) {
					$this->layout['feat-size'] = $args['size'];
				}

			// Featured size
			} else {
				if ( $this->context == 'single' ) {
					$this->layout['feat-size'] = 'full';
				} else if ( $this->layout['posts-page'] && $this->layout['type'] != 'standard' ) {
					if ( $this->layout['type'] == 'grid' ) {
						$this->layout['feat-size'] = 'blog-grid';
					} else {
						$this->layout['feat-size'] = 'large';
					}
				} else if ( ! empty($args['size']) ) {
					$this->layout['feat-size'] = $args['size'];
				}
			}
			$feat_size = $this->layout['feat-size'];

			$feat_classes = 'post-feat feat-' . $feat_size;

			$permalink_start = $permalink_end = $placeholder_img = '';
			if ( $this->context != 'single' ) {
				$permalink_start = '<a href="' . $this->permalink . '">';
				$permalink_end   = '</a>';
			}

			$feat_img  = get_the_post_thumbnail($this->ID, $feat_size);

			$small_feat = $this->display_component('small-feat');

			if ( ! empty($args['placeholder']) || ! empty($this->post_display['feat-ph']['id']) ) {
				$placeholder = ! empty($args['placeholder']) ? $args['placeholder'] : $this->post_display['feat-ph']['id'];
				$placeholder_img = '<div class="' . $feat_classes . ' post-image image-placeholder">' . $permalink_start . wp_get_attachment_image($placeholder, $feat_size) . $permalink_end . '</div>';
			}

			if ( empty($this->options['format-icon']) ) { $this->options['format-icon'] = 'fa fa-ellipsis-h'; }
			$format_icon = "<a href='{$this->permalink}' class='$feat_classes feat-format'><i class='format-icon {$this->options['format-icon']}'></i></a>";

			$output = '';

			switch ($this->format) {

				// Link, Aside, Quote and Status Format
				case 'link':	
				case 'aside':
				case 'quote':
				case 'status':
					$feat_classes .= ' post-' . $this->format;

					// Link Format
					if ( $this->format == 'link' ) {
						// Anchor tag among other content
						if ( preg_match('/^<a href="(.*?)".*?>(.*?)<\/a>/i', $this->content, $matches) ) {
							$post_link = $matches[1];
							$link_title = ( empty($matches[2]) ) ? get_the_title() : $matches[2];
							$this->content = str_replace($matches[0], '', $this->content);

						// Simple URL link
						} else {
							$post_link = $this->content;
							$link_title = get_the_title();
							$this->show_content = false;
						}

						if ( $small_feat ) {
							if ( ! empty($placeholder_img) ) {
								$output = $placeholder_img;
							} else {
								$output = str_replace($this->permalink, $post_link, $format_icon);
							}
						} else {
							$output = "<div class='$feat_classes'>" .
										  "<a href='$post_link' class='accent-bg' target='_blank'><h2 class='title'>$link_title</h2><small>$post_link</small></a>" .
									  '</div>';
						}

					// Aside, Quote & Status Format
					} else {
						if ( $small_feat ) {
							if ( ! empty($placeholder_img) ) {
								$output = $placeholder_img;
							} else {
								$output = $format_icon;
							}
						} else if ( $this->format == 'quote' ) {
							// Blockquote tag among other content
							if ( preg_match('/^<blockquote[^\<]*>(.*)<\/blockquote>/si', $this->content, $matches) ) {
								$quote = $matches[0];
								$this->content = str_replace($matches[0], '', $this->content);

							// Plain text quote
							} else {
								$quote = '<blockquote>' . $this->content . '</blockquote>';
								$this->show_content = false;
							}

							$output = "<div class='$feat_classes'>$quote</div>";
						} else {
							$this->show_content = false;
							$output = "<div class='$feat_classes'>$this->content</div>";
						}
					}

					break;

				// Gallery & Video Format
				case 'video':
				case 'gallery':
					$regex_pattern = get_shortcode_regex();

					// Video Embed
					if ( $this->format == 'video' && preg_match('/^<iframe.*?<\/iframe>/i', $this->content, $matches) ) {
						$feat_classes .= ' post-video video-embed';
						
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
								$output = "<div class='$feat_classes'>$video_iframe</div>";
							}
						}

					// Video & Gallery Shortcode
					} else if ( preg_match_all( '/'.$regex_pattern.'/s', $this->content, $matches ) ) {
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
								$output = "<div class='$feat_classes'>" . do_shortcode($shortcode) . '</div>';
							}

						// Gallery Format
						} else if ( $this->format == 'gallery' && $shortcode_name == 'gallery' ) {
							$feat_classes .= ' post-gallery';
							$this->content = str_replace($shortcode, '', $this->content);

							// Override size and add featured attribute
							preg_match('/size=.([\w]*)./i', $shortcode, $matches);
							$new_attr = 'size="' . $feat_size . '" feat="true"';
							if ( empty($matches[0]) ) {
								$shortcode = str_replace(']', " $new_attr]", $shortcode);
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
								$output = "<div class='$feat_classes'>" . do_shortcode($shortcode) . '</div>';
							}
						}
					} else if ( $this->context == 'related' ) {
						if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else {
							$output = $format_icon;
						}
					}

					break;

				// Image Format
				case 'image':
					$feat_classes .= ' post-image';
					if ( ! empty($feat_img) ) {
						$output = "<div class='$feat_classes'>{$permalink_start}{$feat_img}{$permalink_end}</div>";
					} else {
						$feat_id = mixt_get_post_image($this->content, 'id');
						if ( ! empty($feat_id) ) {
							$output = "<div class='$feat_classes'>" . $permalink_start . wp_get_attachment_image($feat_id, $feat_size) . $permalink_end . '</div>';
							$this->content = str_replace(mixt_get_post_image($this->content), '', $this->content);
						} else if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else {
							$output = $format_icon;
						}
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
							$output = "<div class='$feat_classes'>$audio_iframe</div>";
						}
					} else if ( $this->context == 'related' ) {
						if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else {
							$output = $format_icon;
						}
					}

					break;

				// Standard Format
				default:
					if ( ! empty($feat_img) ) {
						$feat_classes .= ' post-image';
						$output = "<div class='$feat_classes'>{$permalink_start}{$feat_img}{$permalink_end}</div>";
					} else if (
						$this->context == 'related' ||
						( $this->context != 'single' && ( $this->layout['type'] != 'standard' || $this->layout['feat-size'] != 'blog-large' ) && ! $this->layout['post-info'] )
					) {
						if ( ! empty($placeholder_img) ) {
							$output = $placeholder_img;
						} else if ( $this->type != 'page' ) {
							$output = $format_icon;
						}
					}

					break;
			} // End Switch

			if ( ( $output == $placeholder_img || $output == $format_icon ) && ! empty($feat_img) ) {
				$feat_classes .= ' post-image';
				$output = "<div class='$feat_classes'>{$permalink_start}{$feat_img}{$permalink_end}</div>";
			}

			if ( $this->display_component('rollover') ) {
				$output = $this->rollover($output, $feat_classes);
			}

			echo $output;
		}

		/**
		 * Display useful links and info when hovering the featured media
		 */
		public function rollover($content, $classes) {
			$options = mixt_get_options( array(
				'rollover' => array( 'key' => 'portfolio-rollover' ),
				'elem' => array( 'key' => 'portfolio-rollover-elem', 'return' => 'value' ),
				'color' => array( 'key' => 'portfolio-rollover-color', 'return' => 'value' ),
				'anim-in' => array( 'key' => 'portfolio-rollover-anim-in', 'return' => 'value' ),
				'anim-out' => array( 'key' => 'portfolio-rollover-anim-out', 'return' => 'value' ),
				'view-icon' => array( 'key' => 'portfolio-rollover-view-icon', 'return' => 'value' ),
				'full-icon' => array( 'key' => 'portfolio-rollover-full-icon', 'return' => 'value' ),
				'btn-color' => array( 'key' => 'portfolio-rollover-btn-color', 'return' => 'value' ),
			));

			if ( ! $options['rollover'] ) return $content;

			ob_start();

			?>

			<div class="post-rollover <?php echo $classes; ?>">
				<div class="hover-content anim-on-hover">
					<?php echo str_replace($classes, 'post-feat-rollover', $content); ?>
					<div class="on-hover <?php echo $options['color']; ?>" data-anim-in="<?php echo $options['anim-in']; ?>" data-anim-out="<?php echo $options['anim-out']; ?>">
						<div class="inner">
							<?php
								if ( $options['elem']['view'] ) {
									$icon = '<i class="' . $options['view-icon'] . '"></i>';
									echo "<a href='$this->permalink' class='btn btn-{$options['btn-color']} view-post' title='" . __('View Post', 'mixt') . "' data-toggle='tooltip'>$icon</a>";
								}
								if ( $options['elem']['full'] ) {
									$link = wp_get_attachment_url(get_post_thumbnail_id($this->ID));
									if ( $link ) {
										$icon = '<i class="' . $options['full-icon'] . '"></i>';
										echo "<a href='$link' class='btn btn-{$options['btn-color']} full-image' title='" . __('Full Image', 'mixt') . "' data-toggle='tooltip'>$icon</a>";
									}
								}
								if ( $options['elem']['title'] ) echo '<h3 class="title">' . get_the_title() . '</h3>';
								if ( $options['elem']['excerpt'] ) echo '<p class="excerpt">' . get_the_excerpt() . '</p>';
							?>
						</div>
					</div>
				</div>
			</div>

			<?php

			return ob_get_clean();
		}

		/**
		 * Display the post's header
		 */
		public function header() {
			$permalink_start = $permalink_end = '';
			if ( $this->context != 'single' ) {
				$permalink_start = '<a href="' . $this->permalink . '">';
				$permalink_end   = '</a>';
			}

			// Post Info

			if ( $this->layout['post-info'] ) {

				echo '<div class="post-info">';

				// Post Format Icon
				if ( ! empty($this->options['format-icon']) ) {
					if ( $this->format == 'standard' ) {
						$format_link = '#';
					} else {
						$format_link = get_post_format_link($this->format);
					}
					echo '<a href="' . $format_link . '" class="post-format"><i class="' . $this->options['format-icon'] . '"></i></a>';
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

			if ( $this->display_component('featured') ) {
				$this->featured();
			}

			// Display Post Title & Meta

			if ( $this->context == 'blog' || ( ! $this->options['header']['enabled'] || ! $this->options['header']['content-info'] ) ) {

				// Title
				if ( $this->display_component('title') ) {
					$tag = ( $this->context == 'single' ) ? 'h1' : 'h2';
					echo "<$tag class='page-title'>$permalink_start" . get_the_title() . "$permalink_end</$tag>";
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
		public function content($type = null) {
			if ( is_null($type) ) $type = $this->layout['post-content'];

			// Display attachment image
			if ( is_attachment() ) {
				echo wp_get_attachment_image($this->ID, 'full');

			// Display content
			} else if ( $this->display_component('content') ) {
				if ( $type == 'full' ) {
					$content = apply_filters( 'the_content', $this->content );
					$content = str_replace( ']]>', ']]&gt;', $content );
				} else {
					$content = get_the_excerpt();
				}

				echo $content;

				// Split post navigation
				if ( $this->context == 'single' ) {
					wp_link_pages( array(
						'before'    => '<nav id="post-split-nav" class="page-nav paging-navigation numbered-paging">' .
										   '<h3 class="screen-reader-text">' . __( 'Post pages', 'mixt' ) . '</h3>' .
										   '<ul class="pager"><li>',
						'after'     => '</li></ul></nav>',
						'separator' => '</li><li>',
						'pagelink'  => '<span>%</span>',
					) );
				}
			}

			// Footer Post Meta
			if ( $this->layout['meta-show'] == 'footer' && ( $this->context == 'blog' || ( ! $this->options['header']['enabled'] || ! $this->options['header']['content-info'] ) ) ) {
				mixt_post_meta(null);
			}
		}
	}
}


if ( ! function_exists('mixt_get_post_image') ) {
	/**
	 * Get image from the post content
	 *
	 * @param mixed  $content Content string to search in for image, or null to get the current post's content
	 * @param string $type    Data to return. 'full' for image markup, 'id' for image ID or 'url' for image URL
	 */
	function mixt_get_post_image($content = null, $type = 'full') {
		if ( is_null($content) ) {
			global $post;
			$content = $post->post_content;
		}
		$img = '';
		$pattern = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $content, $matches);

		if ( empty($matches[0]) ) return;

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
}


if ( ! function_exists('mixt_about_the_author') ) {
	/**
	 * Display the "about the author" box
	 *
	 * @param bool $title Display title
	 */
	function mixt_about_the_author($title = true) {
		$bio = get_the_author_meta('description');

		if ( empty($bio) ) {
			$bio = __( 'This author has not yet written their bio.', 'mixt' );
		}

		$id     = get_the_author_meta('ID');
		$name   = '<a href="' . get_author_posts_url($id) . '" class="author-url" rel="author">' .
					  get_the_author_meta('display_name') .
				  '</a>';
		$avatar = get_avatar($id, 64);

		?>
		<aside class="post-extra about-the-author"><?php
			if ( $title ) echo mixt_heading( _x('About ', 'author', 'mixt' ) . $name );

			if ( ! empty($avatar) ) {
				echo '<div class="author-avatar">' . $avatar . '</div>';
			} ?>
			<div class="author-bio"><?php echo wpautop($bio); ?></div>
		</aside>
		<?php
	}
}


if ( ! function_exists('mixt_related_posts') ) {
	/**
	 * Display related posts
	 *
	 * @param string $type    Type of posts to display
	 * @param string $heading Text for the heading
	 */
	function mixt_related_posts($type, $heading = '') {
		$args = mixt_get_options( array(
			'number'   => array( 'key' => $type . '-related-number', 'type' => 'str', 'return' => 'value' ),
			'cols-l'   => array( 'key' => $type . '-related-cols', 'type' => 'str', 'return' => 'value' ),
			'cols-m'   => array( 'key' => $type . '-related-tablet-cols', 'type' => 'str', 'return' => 'value' ),
			'cols-s'   => array( 'key' => $type . '-related-mobile-cols', 'type' => 'str', 'return' => 'value' ),
			'related'  => array( 'key' => $type . '-related-by', 'return' => 'value' ),
			'slider'   => array( 'key' => $type . '-related-slider' ),
			'type'     => array( 'key' => $type . '-related-type', 'return' => 'value' ),
			'elements' => array( 'key' => $type . '-related-elements', 'return' => 'value' ),
			'minimal'  => array( 'key' => $type . '-related-mini' ),
			'feat-ph'  => array( 'key' => $type . '-related-feat-ph', 'return' => 'value' ),
		) );

		if ( $type == 'project' ) { $args['related'] = 'type'; }

		global $post;

		$related_args = array();
		if ( $args['related'] == 'tags' ) {
			$related_in = 'tag__in';
			$post_related = wp_get_post_tags($post->ID);
			if ( ! $post_related ) return;
			foreach ( $post_related as $tag ) { $related_args[] = $tag->term_id; }
		} else if ( $args['related'] == 'cats' ) {
			$related_in = 'category__in';
			$post_related = wp_get_post_categories($post->ID);
			if ( ! $post_related ) return;
			foreach ( $post_related as $cat ) { $related_args[] = $cat; }
		} else if ( $args['related'] == 'type' ) {
			$related_in = 'post_type';
			$related_args = get_post_type($post);
		}

		$query_args = array(
			$related_in           => $related_args,
			'orderby'             => 'rand',
			'post__not_in'        => array($post->ID),
			'posts_per_page'      => $args['number'],
			'ignore_sticky_posts' => 1,
		);

		$rel_query = new WP_Query($query_args);

		if ( $rel_query->have_posts() ) {
			$classes = "post-extra post-related post-list related-{$args['type']}";
			if ( $args['minimal'] ) { $classes .= ' mobile-mini'; }

			?>
			<div class="<?php echo $classes; ?>">
				<?php

				if ( $heading != '' ) {
					echo mixt_heading($heading);
				}

				if ( $args['slider'] && $args['number'] > 3 ) {
					// Enqueue lightslider JS
					mixt_enqueue_plugin('lightslider');
					
					echo "<div class='slider-cont controls-alt init' data-type='{$args['type']}' data-cols='{$args['cols-l']}' data-tablet-cols='{$args['cols-m']}' data-mobile-cols='{$args['cols-s']}'>";
				} else {
					echo "<div class='related-inner post-list related-{$args['cols-l']}-col related-tablet-{$args['cols-m']}-col related-mobile-{$args['cols-s']}-col'>";
				}

				while ( $rel_query->have_posts() ) :
					$rel_query->the_post();
					$post_ob = new Mixt_Post('related');
					$title   = get_the_title();
					$link    = $post_ob->permalink;

					?>
					<article class="post related-post">
						<div class="related-content">
							<a rel="external" href="<?php echo $link; ?>" class="related-title"><?php echo $title; ?></a>
							<?php
								if ( $args['type'] == 'text' ) {
									if ( $args['elements']['date'] || $args['elements']['comments'] ) {
										$meta_args = array(
											'author'   => false,
											'category' => false,
											'date'     => (bool) $args['elements']['date'],
											'comments' => (bool) $args['elements']['comments'],
										);
										mixt_post_meta($meta_args);
									}
									if ( $args['elements']['excerpt'] ) {
										echo '<div class="post-excerpt">';
											$post_ob->content('excerpt');
										echo '</div>';
									}
								}
							?>
						</div>
						<?php
							if ( $args['type'] == 'media' ) {
								$feat_args = array(
									'size'        => 'blog-medium',
									'minimal'     => $args['slider'],
									'placeholder' => ( ! empty($args['feat-ph']['id']) ) ? $args['feat-ph']['id'] : '',
								);
								$post_ob->featured($feat_args);
								if ( $args['minimal'] ) {
									echo "<a rel='external' href='$link' class='related-title-tip' title='$title'></a>";
								}
							}
						?>
					</article>
					<?php
				endwhile;
				?>

				</div><?php // Close .related-inner or .slider-cont ?>
			</div>
			<?php
		}

		wp_reset_query();
	}
}


if ( ! function_exists('mixt_post_meta') ) {
	/**
	 * Output or return HTML with meta information for the current post
	 *
	 * @param mixed $args Array of arguments or null to use global settings
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

		$post_display_args = Mixt_Options::get('post-display');
		if ( array_key_exists('meta-author', $post_display_args) ) { $args['author'] = $post_display_args['meta-author']; }
		if ( array_key_exists('meta-date', $post_display_args) ) { $args['date'] = $post_display_args['meta-date']; }
		if ( array_key_exists('meta-category', $post_display_args) ) { $args['category'] = $post_display_args['meta-category']; }
		if ( array_key_exists('meta-comments', $post_display_args) ) { $args['comments'] = $post_display_args['meta-comments']; }

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
			$author_icon   = empty($mixt_opt['meta-author-icon']) ? '' : '<i class="' . $mixt_opt['meta-author-icon'] . '"></i>';
			if ( empty($author_name) ) {
				$queried_ob  = get_queried_object();
				$author_id   = $queried_ob->post_author;
				$author_name = ( empty($queried_ob->post_author) ) ? '' : get_the_author_meta( 'display_name', $author_id );
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
			$date_icon   = empty($mixt_opt['meta-date-icon']) ? '' : '<i class="' . $mixt_opt['meta-date-icon'] . '"></i>';
			$date_title  = get_the_time();

			if ( get_the_time('U') !== get_the_modified_time( 'U' ) ) {
				// Post was updated
				$date_title .= '. ' . __( 'Updated', 'mixt' ) . ' ' . esc_html( get_the_modified_date() );
			}

			$date = '<time class="entry-date published" datetime="' . $date_iso . '">' . $date_format . '</time>';
			$date = '<a href="' . esc_url( $date_url ) . '" title="' . esc_attr( $date_title ) . '" rel="bookmark">' . $date . '</a>';
			$date = '<span class="posted-on">' . $date_icon . $date . '</span>' . $separator;
		}

		// Category
		if ( $args['category'] ) {
			$cats     = get_the_category();
			$cat_icon = empty($mixt_opt['meta-category-icon']) ? '' : '<i class="' . $mixt_opt['meta-category-icon'] . '"></i>';
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
			$comments_icon = empty($mixt_opt['meta-comments-icon']) ? '' : '<i class="' . $mixt_opt['meta-comments-icon'] . '"></i>';

			
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
}

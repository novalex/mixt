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

		/* @var integer */
		public $ID;

		/* @var string */
		public $type;

		/* @var bool */
		public $sticky;

		/**
		 * Context in which the post is displayed
		 * @var string
		 */
		public $context;

		/* @var string */
		public $format;

		/* @var string */
		public $permalink;

		/* @var bool */
		public $show_content = true;

		/**
		 * Post display options
		 * @var array
		 */
		public $post_display = array();

		/* @var string */
		protected $content;

		/* @var string */
		protected $excerpt;

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
				$id = ( $context == 'single' ) ? get_queried_object_id() : get_the_ID();
			}
			$this->ID = $id;

			$this->content = get_the_content();
			$this->excerpt = get_the_excerpt();

			if ( $context != 'single' ) {
				$this->permalink = get_permalink($this->ID);
			}

			$this->type = get_post_type($id);

			// Set layout options
			if ( empty($layout) ) {
				$layout = Mixt_Options::get('layout');
				$layout['page-type'] = Mixt_Options::get('page', 'page-type');
				$layout['posts-page'] = Mixt_Options::get('page', 'posts-page');
			}
			$this->layout = $layout;

			$this->sticky = ( is_sticky($id) && ( $layout['posts-page'] || is_home() ) && ! is_paged() );

			// Set post display options
			$post_display = Mixt_Options::get('post-display');
			if ( empty($post_display) ) $post_display = array();
			if ( $layout['posts-page'] ) {
				$post_display_options = mixt_get_options( array(
					'title'    => array( 'key' => $layout['page-type'] . '-page-title', 'default' => true ),
					'content'  => array( 'key' => $layout['page-type'] . '-page-content', 'default' => true ),
					'rollover' => array( 'key' => $layout['page-type'] . '-rollover', 'default' => false ),
				));
				$post_display = (array) $post_display + (array) $post_display_options;
			}
			if ( get_the_title() == '' ) $post_display['title'] = false;
			if ( $this->content == '' ) $post_display['content'] = false;
			if ( empty($post_display['sticky-label']) ) {
				$post_display['sticky-label'] = mixt_get_option( array( 'key' => 'sticky-label', 'return' => 'value' ) );
			}
			$this->post_display = $post_display;
			
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
				'animate-posts' => array(),
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

			if ( $this->sticky ) { $classes .= ' sticky-post'; }

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
				} else if ( $this->layout['feat-size'] != 'mixt-large' && $this->layout['type'] == 'standard' ) {
					$classes .= ' feat-side';
				}
			}
			if ( ! $this->display_component('title') ) { $classes .= ' no-title'; }
			if ( ! $this->display_component('content') ) { $classes .= ' no-content'; }

			// Animate post on load
			if ( $this->options['animate-posts'] && $this->layout['posts-page'] && $this->context != 'page' ) {
				$classes .= ' animated init';
			}

			return $classes;
		}

		/**
		 * Return whether to display a post component or not
		 * 
		 * @param  string $comp
		 * @return bool
		 */
		public function display_component( $comp ) {
			if ( array_key_exists($comp, $this->post_display) ) {
				return $this->post_display[$comp];
			} else {
				switch ($comp) {

					// Featured media
					case 'featured':
						if ( $this->layout['feat-show'] ) {
							if ( in_array($this->context, array('blog', 'related')) || $this->layout['posts-page'] ) {
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
							( $this->layout['posts-page'] && $this->layout['type'] == 'standard' && $this->layout['feat-size'] == 'mixt-small' )
						);
						break;

					// Featured Media Rollover
					case 'rollover':
						return ( mixt_get_option( array( 'key' => $this->layout['page-type'] . '-rollover' ) ) );
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
					$this->layout['feat-size'] = 'mixt-grid';
				} else if ( ! empty($args['size']) ) {
					$this->layout['feat-size'] = $args['size'];
				}

			// Featured size
			} else {
				if ( $this->context == 'single' ) {
					$this->layout['feat-size'] = 'full';
				} else if ( $this->layout['posts-page'] && $this->layout['type'] != 'standard' ) {
					if ( $this->layout['type'] == 'grid' ) {
						$this->layout['feat-size'] = 'mixt-grid';
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
				$permalink_start = '<a href="' . esc_url($this->permalink) . '">';
				$permalink_end   = '</a>';
			}

			$feat_img  = get_the_post_thumbnail($this->ID, $feat_size);

			$small_feat = $this->display_component('small-feat');

			if ( ! empty($args['placeholder']) || ! empty($this->post_display['feat-ph']['id']) ) {
				$placeholder = ( ! empty($args['placeholder']) ) ? $args['placeholder'] : $this->post_display['feat-ph']['id'];
				$placeholder_img = '<div class="' . $feat_classes . ' post-image image-placeholder">' . $permalink_start . wp_get_attachment_image($placeholder, $feat_size) . $permalink_end . '</div>';
			}

			$format_icon_class = ( empty($this->options['format-icon']) ) ? 'fa fa-ellipsis-h' : $this->options['format-icon'];
			$format_icon = '<div class="' . mixt_sanitize_html_classes($feat_classes) . ' feat-format">';
				$format_icon .= '<i class="format-icon ' . mixt_sanitize_html_classes($format_icon_class) . '"></i>';
				$format_icon .= '<a href="' . esc_url($this->permalink) . '" class="main-link"></a>';
			$format_icon .= '</div>';
			$format_bg_icon = '<i class="format-bg-icon ' . mixt_sanitize_html_classes($format_icon_class) . '"></i>';

			$fallback_feat = ( ! empty($placeholder_img) ) ? $placeholder_img : $format_icon;

			$output = '';

			switch ($this->format) {

				// Link, Aside, Quote and Status Format
				case 'link':	
				case 'aside':
				case 'quote':
				case 'status':
					$feat_classes .= ' post-' . sanitize_html_class($this->format);

					// Link Format
					if ( $this->format == 'link' ) {
						// Anchor tag among other content
						if ( preg_match('/'.mixt_regex_pattern('anchor').'/i', $this->content, $matches) ) {
							$post_link = $matches[1];
							$link_title = ( empty($matches[2]) ) ? get_the_title() : $matches[2];
							$this->content = str_replace($matches[0], '', $this->content);
							$this->excerpt = str_replace(wptexturize($link_title), '', $this->excerpt);

						// Simple URL link
						} else {
							$post_link = $this->content;
							$link_title = get_the_title();
							$this->show_content = $this->post_display['content'] = false;
						}

						if ( $small_feat ) {
							$output = "<div class='$feat_classes feat-format'>" .
										  "<i class='format-icon $format_icon_class'></i>" .
										  "<a href='" . esc_url($post_link) . "' target='_blank' class='main-link'></a>" .
									  '</div>';
						} else {
							$output = "<div class='$feat_classes'><div class='text-wrap'>" .
										  "<h2 class='title'>" . esc_html($link_title) . "</h2><small>" . esc_html($post_link) . "</small>$format_bg_icon" .
										  "<a href='" . esc_url($post_link) . "' target='_blank' class='main-link'></a>" .
									  '</div></div>';
						}

					// Aside, Quote & Status Format
					} else {
						if ( $small_feat ) {
							$output = $fallback_feat;
						} else {

							// Quote
							if ( $this->format == 'quote' ) {
								// Blockquote tag among other content
								if ( preg_match('/'.mixt_regex_pattern('blockquote').'/si', $this->content, $matches) ) {
									$content = $matches[1];
									$this->content = str_replace($matches[0], '', $this->content);
									$this->excerpt = str_replace(wptexturize(wp_trim_words($content, 100, '')), '', $this->excerpt);

									// Cite
									if ( $this->context != 'single' && preg_match('/'.mixt_regex_pattern('cite').'/si', $content, $quote_cite_str ) ) {
										$quote_cite = $quote_cite_str[0];
										$content = str_replace($quote_cite, '', $content);
									}

								// Plain text quote
								} else {
									$content = $this->content;
									$this->show_content = $this->post_display['content'] = false;
								}

							// Aside or Status
							} else {
								$content = $this->content;
								$this->show_content = $this->post_display['content'] = false;
							}

							// Limit the number of words when viewed on a posts page
							if ( $this->context != 'single' ) {
								$content = wp_trim_words($content, 55);

								if ( $this->format == 'quote' && ! empty($quote_cite) ) { $content .= $quote_cite; }
							}

							$content .= $format_bg_icon;
							if ( $this->context != 'single' ) {
								$content .= '<a href="' . esc_url($this->permalink) . '" class="main-link"></a>';
							}
							$output = '<div class="' . $feat_classes . '"><div class="text-wrap">' . mixt_clean($content) . '</div></div>';
						}
					}

					break;


				// Audio & Video Format
				case 'audio':
				case 'video':

					// Shortcode
					if (
						preg_match('/'.mixt_regex_pattern('audio-shortcode').'/', $this->content, $matches ) ||
						preg_match('/'.mixt_regex_pattern('video-shortcode').'/', $this->content, $matches )
					) {
						$av_type = 'shortcode';
						$feat_av = $matches[0];

					// iframe
					} else if ( preg_match('/^'.mixt_regex_pattern('iframe').'/i', $this->content, $matches) ) {
						$av_type = 'iframe';
						$feat_av = $matches[0];

					// Embed
					} else if ( preg_match('/^'.mixt_regex_pattern('url').'/i', $this->content, $matches) ) {
						$av_type = 'oembed';
						$feat_av = wp_oembed_get($matches[0]);
					}

					if ( ! empty($matches[0]) ) $this->content = str_replace($matches[0], '', $this->content);

					$display_media = ( $this->context == 'single' || ( $this->display_component('title') && in_array($feat_size, array('full', 'mixt-large', 'large')) ) );

					if ( $small_feat || empty($feat_av) || $this->context == 'related' || ! $display_media ) {
						$output = $fallback_feat;
					} else {
						if ( $av_type == 'oembed' || $av_type == 'iframe' ) {
							$feat_classes .= ( $this->format == 'audio' ) ? ' post-audio audio-embed' : ' post-video video-embed';
							$output = "<div class='$feat_classes'>$feat_av</div>";
						} else {
							$feat_classes .= ( $this->format == 'audio' ) ? ' post-audio audio-hosted' : ' post-video video-hosted';
							$output = "<div class='$feat_classes'>" . do_shortcode($feat_av) . '</div>';
						}
					}

					break;


				// Gallery Format
				case 'gallery':

					if ( preg_match('/'.mixt_regex_pattern('gallery-shortcode').'/', $this->content, $matches) ) {
						$shortcode = $matches[0];
						$gallery_atts = $matches[3];

						$feat_classes .= ' post-gallery';
						$this->content = str_replace($shortcode, '', $this->content);

						// Add featured attribute
						$gallery_atts .= ' feat="true"';

						// Override size attribute
						preg_match('/size=.([\w]*)./i', $gallery_atts, $att_size);
						$size_att = 'size="' . $feat_size . '"';
						if ( empty($att_size[0]) ) {
							$gallery_atts .= $size_att;
						} else {
							$gallery_atts = str_replace($att_size[0], $size_att, $gallery_atts);
						}

						// Check the gallery type
						preg_match('/type=.([\w]*)./i', $gallery_atts, $type_att);
						$gallery_type = ( empty($type_att[1]) ) ? 'lightbox' : $type_att[1];

						if (
							! empty($args['minimal']) ||
							( $gallery_type != 'slider' && ( $this->context != 'single' || $this->layout['posts-page'] ) )
						) {
							$output = $fallback_feat;
						} else {
							// Replace attributes with new ones and execute shortcode
							$shortcode = str_replace($matches[3], $gallery_atts, $shortcode);
							$post_link = ( $this->context != 'single' ) ? '<a href="' . esc_url($this->permalink) . '" class="main-link"></a>' : '';
							$output = "<div class='$feat_classes'>" . do_shortcode($shortcode) . $post_link . '</div>';
						}

					} else {
						$output = $fallback_feat;
					}

					break;


				// Image Format
				case 'image':
					$feat_classes .= ' post-image';
					if ( ! empty($feat_img) ) {
						$output = "<div class='$feat_classes'>{$permalink_start}{$feat_img}{$permalink_end}</div>";
					} else {
						$img_data = mixt_get_post_image($this->content, 'array');
						if ( ! empty($img_data) ) {
							$img_html = $img_data[0];
							$feat_img = wp_get_attachment_image($img_data[1]['id'], $feat_size);
							if ( empty($feat_img) ) { $feat_img = $img_html; }
							$output = "<div class='$feat_classes'>" . $permalink_start . $feat_img . $permalink_end . '</div>';
							$this->content = str_replace($img_html, '', $this->content);
						} else {
							$output = $fallback_feat;
						}
					}

					break;


				// Standard Format
				default:
					if ( ! empty($feat_img) ) {
						$feat_classes .= ' post-image';
						$output = "<div class='$feat_classes'>{$permalink_start}{$feat_img}{$permalink_end}</div>";
					} else if ( $this->context == 'related' ) {
						$output = $fallback_feat;
					}

					break;
			} // End Switch

			if ( ( $output == $placeholder_img || $output == $format_icon ) && ! empty($feat_img) ) {
				$feat_classes .= ' post-image';
				$output = "<div class='$feat_classes'>{$permalink_start}{$feat_img}{$permalink_end}</div>";
			}

			if ( $this->display_component('rollover') ) {
				$output = $this->rollover($output);
			}

			echo mixt_clean($output, 'strip');

			return ( ! empty($output) );
		}

		/**
		 * Display useful links and info when hovering the featured media
		 */
		public function rollover( $content ) {
			$opt_pre = $this->layout['page-type'];
			$options = mixt_get_options( array(
				'items'      => array( 'key' => $opt_pre . '-rollover-items', 'return' => 'value' ),
				'color'      => array( 'key' => $opt_pre . '-rollover-color', 'return' => 'value' ),
				'anim-in'    => array( 'key' => $opt_pre . '-rollover-anim-in', 'return' => 'value' ),
				'anim-out'   => array( 'key' => $opt_pre . '-rollover-anim-out', 'return' => 'value' ),
				'item-style' => array( 'key' => $opt_pre . '-rollover-item-style', 'return' => 'value' ),
				'btn-color'  => array( 'key' => $opt_pre . '-rollover-btn-color', 'return' => 'value' ),
			));

			$exceptions = array('aside', 'link', 'quote', 'status', 'audio');
			if ( in_array($this->format, $exceptions) ) return $content;

			$items = mixt_option_checkbox_val($options['items']);
			$item_style = $options['item-style'];
			$item_classes = 'rollover-item ' . $item_style;
			if ( $item_style != 'plain' ) { $item_classes .= " btn-{$options['btn-color']} no-border"; }

			$on_hover_classes = 'on-hover ' . $options['color'];

			ob_start();

			?>

			<div class="post-rollover hover-content anim-on-hover anim-content">
				<div class="<?php echo mixt_sanitize_html_classes($on_hover_classes); ?>" data-anim-in="<?php echo esc_attr($options['anim-in']); ?>" data-anim-out="<?php echo esc_attr($options['anim-out']); ?>">
					<div class="inner">
						<?php
							if ( in_array('title', $items) ) {
								echo '<a href="' . esc_url($this->permalink) . '" class="post-title no-color">' . esc_html( get_the_title() ) . '</a>';
							}
							if ( in_array('excerpt', $items) ) {
								$excerpt = wp_trim_words($this->excerpt, 20);
								if ( ! empty($excerpt) ) { echo '<a href="' . esc_url($this->permalink) . '" class="post-excerpt no-color">' . mixt_clean($excerpt, 'strip') . '</a>'; }
							}
							if ( in_array('view', $items) ) {
								$icon = mixt_get_icon('view-post');
								echo '<a href="' . esc_url($this->permalink) . '" class="' . mixt_sanitize_html_classes($item_classes) . ' view-post" title="' . esc_attr__('View Post', 'mixt') . '" data-toggle="tooltip">' . $icon . '</a>';
							}
							if ( in_array('full', $items) ) {
								$link = wp_get_attachment_url( get_post_thumbnail_id($this->ID) );
								if ( $link ) {
									$icon = mixt_get_icon('view-image');
									echo '<a href="' . esc_url($link) . '" class="' . mixt_sanitize_html_classes($item_classes) . ' view-image" title="' . esc_attr__('Full Image', 'mixt') . '" data-toggle="tooltip">' . $icon . '</a>';
								}
							}
						?>
					</div>
					<a href='<?php echo esc_url($this->permalink); ?>' class='main-link'></a>
				</div>
			</div>

			<?php

			$html = ob_get_clean();

			// Return markup with rollover inserted at the end
			return preg_replace('/<\/div>$/i', $html . '</div>', $content);
		}

		/**
		 * Display the post's header
		 */
		public function header() {
			$permalink_start = $permalink_end = '';
			if ( $this->context != 'single' ) {
				$permalink_start = '<a href="' . esc_url($this->permalink) . '">';
				$permalink_end   = '</a>';
			}

			// Post Info

			if ( $this->layout['post-info'] ) {

				echo '<div class="post-info">';

				// Post Format Icon
				if ( ! empty($this->options['format-icon']) ) {
					$format_link = get_post_format_link($this->format);
					if ( empty($format_link) ) { $format_link = '#'; }
					echo '<a href="' . esc_url($format_link) . '" class="post-format"><i class="' . mixt_sanitize_html_classes($this->options['format-icon']) . '"></i></a>';
				}

				// Post Date
				$date_iso    = get_the_date('c');
				$date_year   = get_the_date('Y');
				$date_month  = get_the_date('m');
				$date_day    = get_the_date('d');
				$date_format = '<strong>' . esc_html( $date_day ) . '</strong>' . get_the_date('M') . ', ' . esc_html( $date_year );
				$date_url    = get_day_link( $date_year, $date_month, $date_day );

				$date = '<time class="entry-date published" datetime="' . esc_attr($date_iso) . '">' . $date_format . '</time>';
				echo '<a href="' . esc_url($date_url) . '" title="' . esc_attr( get_the_time() ) . '" rel="bookmark" class="post-date no-color">' . $date . '</a>';

				echo '</div>';
			}

			// Display Featured Post Media

			$feat = ( $this->display_component('featured') ) ? $this->featured() : null;

			// Sticky / Featured Label

			$sticky_label = '';
			if ( ! empty($this->post_display['sticky-label']) ) {
				$sticky_label = '<span class="post-label sticky-label accent-color theme-accent-bd">' . esc_html($this->post_display['sticky-label']) . '</span>';
			}

			if ( ! $this->display_component('title') && $this->sticky ) echo '<div class="post-item-cont">' . $sticky_label . '</div>';

			// Display Post Title & Meta

			if ( $this->context == 'blog' || ( ! $this->options['header']['enabled'] || ! $this->options['header']['content-info'] ) ) {

				$force_title = ( ! $feat && $this->context != 'single' );

				// Title
				if ( $this->display_component('title') || $force_title ) {
					$tag = ( $this->context == 'single' ) ? 'h1' : 'h2';
					$class = 'page-title';
					if ( $force_title ) { $class .= ' force-display'; }

					$title = "<$tag class='$class'>$permalink_start"; 
					if ( $this->sticky ) { $title .= $sticky_label; }
					$title .= get_the_title() . "$permalink_end</$tag>";
					echo mixt_clean($title);
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
		public function content( $type = null ) {

			// Display attachment image
			if ( is_attachment() ) {
				echo wp_get_attachment_image($this->ID, 'full');

			// Display content
			} else if ( $this->display_component('content') ) {
				if ( $type == 'full' || ( is_null($type) && ( ( $this->context == 'single' || ( is_singular() && ! $this->layout['posts-page'] ) ) || $this->layout['post-content-type'] == 'full' ) ) ) {
					$content = $this->content;

					// Strip shortcode tags when the post is displayed in a posts page
					if ( $this->context != 'single' && $this->layout['posts-page'] ) {
						$content = preg_replace("~(?:\[/?)(?=(?:vc_row|vc_column))[^/\]]+/?\]~s", '', $content);
					}

					$content = apply_filters('the_content', $content);
					$content = str_replace(']]>', ']]&gt;', $content);
				} else {
					$content = strip_shortcodes($this->excerpt);
				}

				echo mixt_clean($content, 'strip');

				// Split post navigation
				if ( $this->context == 'single' ) {
					wp_link_pages( array(
						'before'    => '<nav id="post-split-nav" class="page-nav paging-navigation numbered-paging">' .
										   '<h3 class="screen-reader-text">' . esc_html__( 'Post pages', 'mixt' ) . '</h3>' .
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
	 * @param string $type    Data to return. 'full' for image markup, 'id' for image attachment ID, 'url' for image URL, 'array' for an array of the image and attributes
	 */
	function mixt_get_post_image( $content = null, $type = 'full' ) {
		if ( is_null($content) ) {
			global $post;
			$content = $post->post_content;
		}
		preg_match('/'.mixt_regex_pattern('image').'/i', $content, $images);
		if ( empty($images[0]) ) return;

		preg_match_all("/".mixt_regex_pattern('image-attributes')."/", $images[0], $attributes);
		if ( empty($attributes[1]) || empty($attributes[2]) ) return;

		$attributes = array_combine($attributes[1], $attributes[2]);
		if ( ! empty($attributes['class']) ) {
			preg_match('/wp-image-([\d\S]*)/i', $attributes['class'], $img_id);
			if ( ! empty($img_id[1]) ) $attributes['id'] = $img_id[1];
		}

		if ( $type == 'full' ) {
			return $images[0];
		} else if ( $type == 'id' && ! empty($attributes['id']) ) {
			return $attributes['id'];
		} else if ( $type == 'url' ) {
			return $attributes['src'];
		} else {
			return array( $images[0], $attributes );
		}
	}
}


if ( ! function_exists('mixt_about_the_author') ) {
	/**
	 * Display the "about the author" box
	 *
	 * @param bool $title Display title
	 */
	function mixt_about_the_author( $title = true ) {
		$bio = get_the_author_meta('description');

		if ( empty($bio) ) {
			$bio = esc_html__( 'This author has not yet written their bio.', 'mixt' );
		}

		$id     = get_the_author_meta('ID');
		$name   = '<a href="' . esc_url( get_author_posts_url($id) ) . '" class="author-url" rel="author">' .
					  esc_html( get_the_author_meta('display_name') ) .
				  '</a>';
		$avatar = get_avatar($id, 64);

		?>
		<aside class="post-extra about-the-author"><?php
			if ( $title ) echo mixt_heading( sprintf( esc_html_x('About %s', 'author', 'mixt' ), $name ) );

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
	function mixt_related_posts( $type, $heading = '' ) {
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
			$classes = 'post-extra post-related post-list related-' . $args['type'];
			if ( $args['minimal'] ) { $classes .= ' mobile-mini'; }

			?>
			<div class="<?php echo mixt_sanitize_html_classes($classes); ?>">
				<?php

				if ( $heading != '' ) {
					echo mixt_heading($heading);
				}

				if ( $args['slider'] && $args['number'] > 3 ) {
					// Enqueue lightslider JS
					mixt_enqueue_plugin('lightslider');

					$col_attrs = 'data-cols="' . esc_attr($args['cols-l']) . '" data-tablet-cols="' . esc_attr($args['cols-m']) . '" data-mobile-cols="' . esc_attr($args['cols-s']) . '"';
					echo '<div class="slider-cont init" data-type="' . esc_attr($args['type']) . '" ' . $col_attrs . '>';
				} else {
					$classes = mixt_sanitize_html_classes("related-{$args['cols-l']}-col related-tablet-{$args['cols-m']}-col related-mobile-{$args['cols-s']}-col");
					echo "<div class='related-inner post-list $classes'>";
				}

				while ( $rel_query->have_posts() ) :
					$rel_query->the_post();
					$post_ob  = new Mixt_Post('related');
					$title    = get_the_title();
					$link     = esc_url($post_ob->permalink);
					$link_cls = 'related-title';

					if ( $args['type'] == 'text' ) { $link_cls .= ' hover-accent-color'; }

					?>
					<article class="post related-post">
						<div class="related-content">
							<?php
								echo "<a rel='external' href='$link' class='$link_cls'>" . esc_html($title) . '</a>';
								
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
									'size'        => 'mixt-grid',
									'minimal'     => $args['slider'],
									'placeholder' => ( ! empty($args['feat-ph']['id']) ) ? $args['feat-ph']['id'] : '',
								);
								$post_ob->featured($feat_args);
								if ( $args['minimal'] ) {
									echo "<a rel='external' href='$link' class='related-title-tip' title='" . esc_attr($title) . "'></a>";
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

		wp_reset_postdata();
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

			if ( $mixt_opt['meta-author'] == false ) { $args['author'] = false; }
			if ( $mixt_opt['meta-date'] == false || Mixt_Options::get('layout', 'post-info') ) { $args['date'] = false; }
			if ( $mixt_opt['meta-category'] == false ) { $args['category'] = false; }
			if ( $mixt_opt['meta-comments'] == false ) { $args['comments'] = false; }
			if ( $mixt_opt['meta-icons'] == false ) { $args['icons'] = false; }
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
			'icons'     => true,
			'separator' => '',
		);
		$args = wp_parse_args($args, $defaults);

		$post = get_post();

		$meta = $view_post = $author = $date = $category = $comments = '';

		$separator = empty($args['separator']) ? '' : '<span class="meta-sep">' . esc_html($args['separator']) . '</span>';

		// View Post
		if ( get_the_title() == '' && ! is_single() ) {
			$view_icon = ( $args['icons'] ) ? mixt_get_icon('view-post') : '';
			$view_post = '<span class="view-post"><a href="' . esc_url( get_permalink() ) . '">' . $view_icon . esc_html__( 'View Post', 'mixt' ) . '</a></span>' . $separator;
		}

		// Author
		if ( $args['author'] ) {
			$author_icon   = ( $args['icons'] ) ? mixt_get_icon('author') : '';
			$author_id   = $post->post_author;
			$author_name = ( empty($author_id) ) ? '' : get_the_author_meta('display_name', $author_id);

			if ( ! empty($author_name) ) {
				$author_url = esc_url( get_author_posts_url( $author_id ) );
				$author_all = esc_attr( sprintf( _x( 'View all posts by %s', 'author', 'mixt' ), $author_name ) );
				$author = '<span class="author vcard"><a class="url fn n" href="' . $author_url . '" title="' . $author_all . '">' . esc_html( $author_name ) . '</a></span>';
				$author = '<span class="byline">' . $author_icon . sprintf( esc_html__( 'By %s', 'mixt' ), $author ) . '</span>' . $separator;
			}
		}

		// Post Date
		if ( $args['date'] ) {
			$date_iso    = get_the_date('c');
			$date_format = get_the_date('F jS, Y');
			$date_url    = get_day_link( get_the_date('Y'), get_the_date('m'), get_the_date('d') );
			$date_icon   = ( $args['icons'] ) ? mixt_get_icon('date') : '';
			$date_title  = get_the_time();

			if ( get_the_time('U') !== get_the_modified_time( 'U' ) ) {
				// Post was updated
				$date_title .= '. ' . sprintf( esc_html__( 'Updated %s', 'mixt' ), get_the_modified_date() );
			}

			$date = '<time class="entry-date published" datetime="' . esc_attr( $date_iso ) . '">' . esc_html( $date_format ) . '</time>';
			$date = '<a href="' . esc_url( $date_url ) . '" title="' . esc_attr( $date_title ) . '" rel="bookmark">' . $date . '</a>';
			$date = '<span class="posted-on">' . $date_icon . $date . '</span>' . $separator;
		}

		// Category / Type
		if ( $args['category'] ) {
			$cat_icon = ( $args['icons'] ) ? mixt_get_icon('category') : '';

			$is_project = ( $post->post_type == 'portfolio' );

			if ( ! $is_project || ( ! is_single() || ! mixt_get_option(array('key' => 'project-tags')) ) ) {
				$term = ( $is_project ) ? 'project-type' : 'category';

				$cats = get_the_terms($post, $term);

				if ( ! empty($cats) && is_array($cats) ) {
					$category = '<span class="cat">' . $cat_icon;
					foreach ( $cats as $cat ) {
						$cat_link = get_term_link($cat->term_id);
						$category .= '<a href="' . esc_url($cat_link) . '">' . esc_html($cat->name) . '</a>';
					}
					$category .= '</span>' . $separator;
				}
			}
		}

		// Comments
		if ( $args['comments'] && comments_open() && '0' != get_comments_number() ) {
			$comments_num  = get_comments_number();
			$comments_icon = ( $args['icons'] ) ? mixt_get_icon('comments') : '';

			
			if ( $comments_num > 1 ) {
				$comments_text = sprintf( esc_html__( '%d comments', 'mixt' ), $comments_num );
			} else {
				$comments_text = esc_html__( '1 comment', 'mixt' );
			}

			$comments = '<span class="comments">' . $comments_icon . '<a href="' . esc_url( get_comments_link() ) . '">' . $comments_text . '</a></span>' . $separator;
		}

		$meta_string = $view_post . $author . $date . $category . $comments;

		// Full HTML string
		if ( ! empty($meta_string) ) { $meta = '<div class="entry-meta post-meta">' . $meta_string . '</div>'; }

		if ( $args['echo'] ) {
			echo mixt_clean($meta);
		} else {
			return $meta;
		}
	}
}

<?php

/**
 * The template for displaying Comments.
 *
 * @package MIXT
 */

// If the current post is protected by a password and the visitor has not yet entered the password return early without loading the comments.
if ( post_password_required() ) { return; }

$options = array(
	'notes-before' => array( 'key' => 'comment-notes-before' ),
	'logged-in-as' => array( 'key' => 'comment-logged-in' ),
	'notes-after' => array( 'key' => 'comment-notes-after' ),
);
$options = mixt_get_options($options);

?>

<div id="comments" class="comments-area">

<?php

// Comments Title
$comments_num = get_comments_number();
if ( $comments_num == 0 ) { $comments_text = __( 'No comments', 'mixt' ); }
else if ( $comments_num > 1 ) { $comments_text = $comments_num . __( ' comments', 'mixt' ); }
else { $comments_text = __( '1 comment', 'mixt' ); } ?>

<h2 class="comments-title"><?php echo $comments_text; ?></h2>

<?php if ( have_comments() ) :

	if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
	<nav id="comment-nav-above" class="comment-navigation" role="navigation">
		<h5 class="screen-reader-text"><?php _e( 'Comment navigation', 'mixt' ); ?></h5>
		<ul class="pager">
			<li class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'mixt' ) ); ?></li>
			<li class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'mixt' ) ); ?></li>
		</ul>
	</nav>
	<?php endif; ?>

	<ol class="comment-list">
		<?php
			/* Loop through and list the comments. Tell wp_list_comments()
			 * to use mixt_comment() to format the comments.
			 * If you want to overload this in a child theme then you can
			 * define mixt_comment() and that will be used instead.
			 * See mixt_comment() in mixt-core/tags.php
			 */
			wp_list_comments( array( 'callback' => 'mixt_comment', 'avatar_size' => 50 ) );
		?>
	</ol>

	<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
	<nav id="comment-nav-below" class="comment-navigation" role="navigation">
		<h1 class="screen-reader-text"><?php _e( 'Comment navigation', 'mixt' ); ?></h1>
		<div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'mixt' ) ); ?></div>
		<div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'mixt' ) ); ?></div>
	</nav>
	<?php endif;

endif;

if ( comments_open() ) {

	// Comment Form

	$commenter = wp_get_current_commenter();
	$req       = get_option( 'require_name_email' );
	$aria_req  = ( $req ? " aria-required='true'" : '' );
	$required  = ' <span class="required">*</span>';

	$logged_in_as = $comment_notes_before = $comment_notes_after = '';

	if ( $options['logged-in-as'] == 'true' ) {
		$logged_in_as = '<p class="logged-in-as">' .
			sprintf( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>' ),
				admin_url( 'profile.php' ), $user_identity, wp_logout_url( apply_filters( 'the_permalink', get_permalink( ) ) )
			) .
		'</p>';
	}

	if ( $options['notes-before'] == 'true' ) {
		$comment_notes_before = '<p class="comment-notes">' .
			__( 'Your email address will not be published.', 'mixt' ) . ( $req ? __( ' Required fields are marked', 'mixt' ) . $required : '' ) .
		'</p>';
	}

	// Author Name, Email and Website Fields
	$author_fields = array(
		'author' =>
			'<p class="author-field comment-form-author">' .
				'<label for="author">' . __( 'Name', 'mixt' ) . ( $req ? $required : '' ) . '</label>' .
				'<input id="author" name="author" type="text" class="form-control" value="' . esc_attr( $commenter['comment_author'] ) .
				'" size="30"' . $aria_req . ' />' .
			'</p>',
		'email' =>
			'<p class="author-field comment-form-email">' .
				'<label for="email">' . __( 'Email', 'mixt' ) . ( $req ? $required : '' ) . '</label>' .
				'<input id="email" name="email" type="text" class="form-control" value="' . esc_attr(  $commenter['comment_author_email'] ) .
				'" size="30"' . $aria_req . ' />' .
			'</p>',
		'url' =>
			'<p class="author-field comment-form-url last"><label for="url">' . __( 'Website', 'mixt' ) . '</label>' .
				'<input id="url" name="url" type="text" class="form-control" value="' . esc_attr( $commenter['comment_author_url'] ) .
				'" size="30" />' .
			'</p>',
	);

	// Comment Textarea
	$comment_field = '<p class="comment-field clearfix">' .
		'<textarea placeholder="' . __( 'Type in your reply...', 'mixt' ) . '" id="comment" class="form-control" name="comment" cols="45" rows="4" aria-required="true"></textarea>' .
	'</p>';

	if ( $options['notes-after'] == 'true' ) {
		$comment_notes_after  = '<p class="form-allowed-tags">' .
			__( 'You may use these <abbr title="HyperText Markup Language">HTML</abbr> tags and attributes:', 'mixt' ) . '</p>' .
		'<pre class="allowed-tags">' . allowed_tags() . '</pre>';
	}

	$args = array(
		'id_form'           => 'commentform',
		'id_submit'         => 'commentsubmit',
		'title_reply'       => __( 'Reply', 'mixt' ),
		'title_reply_to'    => __( 'Reply to %s', 'mixt' ),
		'cancel_reply_link' => __( 'Cancel Reply', 'mixt' ),
		'label_submit'      => __( 'Post Reply', 'mixt' ),

		'logged_in_as'         => $logged_in_as,
		'comment_notes_before' => $comment_notes_before,
		'fields'               => apply_filters( 'comment_form_default_fields', $author_fields ),
		'comment_field'        => $comment_field,
		'comment_notes_after'  => $comment_notes_after,

		// Submit Button Classes
		'class_submit' => 'submit btn btn-black hover-accent-bg',
	);

	comment_form($args);

// If comments are closed and there are comments, let's leave a little note, shall we?
} else if ( $comments_num != '0' && post_type_supports( get_post_type(), 'comments' ) ) : ?>
	<p class="no-comments">
		<?php _e( 'Comments are closed.', 'mixt' ); ?>
	</p>
<?php endif; ?>

</div>

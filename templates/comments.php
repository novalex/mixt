<?php

/**
 * The template for displaying Comments.
 *
 * @package MIXT
 */

// If the current post is protected by a password and the visitor has not yet entered the password return early without loading the comments.
if ( post_password_required() ) { return; }

$options = mixt_get_options( array(
	'notes-before' => array( 'key' => 'comment-notes-before' ),
	'logged-in-as' => array( 'key' => 'comment-logged-in' ),
	'notes-after' => array( 'key' => 'comment-notes-after' ),
) );

?>

<div id="comments" class="comments-area post-extra">

<?php

// Comments Title
$comments_num = get_comments_number();
if ( $comments_num == 0 ) {
	$comments_text = esc_html__( 'No comments', 'mixt' );
} else if ( $comments_num > 1 ) {
	$comments_text = sprintf( esc_html__( '%d comments', 'mixt' ), $comments_num );
} else {
	$comments_text = esc_html__( '1 comment', 'mixt' );
}

echo mixt_heading( $comments_text, 'class="comments-title"' );

if ( have_comments() ) {

	mixt_comment_nav('top');

	?>
	<ol class="comment-list">
		<?php
			/* Loop through and list the comments. Tell wp_list_comments()
			 * to use mixt_comment() to format the comments.
			 * If you want to overload this in a child theme then you can
			 * define mixt_comment() and that will be used instead.
			 * See mixt_comment() in core/tags.php
			 */
			wp_list_comments( array( 'callback' => 'mixt_comment', 'avatar_size' => 50 ) );
		?>
	</ol>
	<?php

	mixt_comment_nav('bottom');
}

if ( comments_open() ) {

	// Comment Form

	$form_classes = 'comment-form row form-cols form-no-labels';

	$commenter = wp_get_current_commenter();
	$req       = get_option( 'require_name_email' );
	$aria_req  = $req ? ' required aria-required="true"' : '';

	$logged_in_as = $comment_notes_before = $comment_notes_after = '';

	if ( $options['logged-in-as'] ) {
		$logged_in_as = '<p class="logged-in-as form-group col-sm-12">' . sprintf(
			wp_kses( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>', 'mixt' ), array( 'a' => array( 'href' => array(), 'title' => array() ) ) ),
			admin_url( 'profile.php' ), $user_identity, wp_logout_url( apply_filters( 'the_permalink', get_permalink( ) ) )
		) . '</p>';
	}

	if ( $options['notes-before'] ) {
		$comment_notes_before = '<p class="comment-notes form-group col-sm-12">' .
			esc_html__( 'Your email address will not be published.', 'mixt' ) . ( $req ? esc_html__( ' Required fields are marked *', 'mixt' ) : '' ) .
		'</p>';
	}

	// Author Name, Email and Website Fields
	$name_label = esc_html__( 'Name', 'mixt' ) . ( $req ? ' *' : '' );
	$mail_label = esc_html__( 'Email', 'mixt' ) . ( $req ? ' *' : '' );
	$site_label = esc_html__( 'Website', 'mixt' );
	$author_fields = array(
		'author' =>
			'<p class="author-field comment-form-author form-group col-sm-4">' .
				'<label for="author">' . $name_label . '</label>' .
				'<input id="author" name="author" type="text" class="form-control" value="' . esc_attr( $commenter['comment_author'] ) . '" ' .
				'placeholder="' . esc_attr($name_label) . '" size="30"' . $aria_req . ' />' .
			'</p>',
		'email' =>
			'<p class="author-field comment-form-email form-group col-sm-4">' .
				'<label for="email">' . $mail_label . '</label>' .
				'<input id="email" name="email" type="text" class="form-control" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" ' .
				'placeholder="' . esc_attr($mail_label) . '" size="30"' . $aria_req . ' />' .
			'</p>',
		'url' =>
			'<p class="author-field comment-form-url form-group col-sm-4">' .
				'<label for="url">' . $site_label . '</label>' .
				'<input id="url" name="url" type="text" class="form-control" value="' . esc_attr( $commenter['comment_author_url'] ) . '" ' .
				'placeholder="' . esc_attr($site_label) . '" size="30" />' .
			'</p>',
	);

	// Comment Textarea
	$comment_field = '<p class="comment-field form-group col-sm-12 clearfix">' .
		'<textarea placeholder="' . esc_attr__( 'Type in your reply...', 'mixt' ) . '" id="comment" class="form-control" name="comment" cols="45" rows="4" required aria-required="true"></textarea>' .
	'</p>';

	if ( $options['notes-after'] ) {
		$comment_notes_after  = '<div class="form-allowed-tags form-group col-sm-12">' .
			'<p>' . wp_kses(
				__( 'You may use these <abbr title="HyperText Markup Language">HTML</abbr> tags and attributes:', 'mixt' ),
				array( 'abbr' => array( 'title' => array() ) )
			) . '</p>' .
			'<samp class="allowed-tags color-fade">' . allowed_tags() . '</samp>' .
		'</div>';
	}

	$args = array(
		'id_form'           => 'commentform',
		'id_submit'         => 'commentsubmit',
		'title_reply'       => '', // esc_html__( 'Reply', 'mixt' ),
		'title_reply_to'    => esc_html__( 'Reply to %s', 'mixt' ),
		'cancel_reply_link' => esc_html__( 'Cancel Reply', 'mixt' ),
		'label_submit'      => esc_html__( 'Post Reply', 'mixt' ),

		'logged_in_as'         => $logged_in_as,
		'comment_notes_before' => $comment_notes_before,
		'fields'               => apply_filters( 'comment_form_default_fields', $author_fields ),
		'comment_field'        => $comment_field,
		'comment_notes_after'  => $comment_notes_after,

		'class_submit' => 'submit btn btn-black btn-hover-accent',
	);

	// Add bootstrap classes to comment form
	ob_start();
	comment_form($args);
	echo str_replace(
		array(
			'class="comment-form"',
			'class="form-submit"',
		),
		array(
			"class='$form_classes'",
			"class='form-submit col-sm-4'",
		),
		ob_get_clean()
	);

// If comments are closed and there are comments
} else if ( $comments_num != '0' && post_type_supports( get_post_type(), 'comments' ) ) : ?>
	<p class="no-comments">
		<?php esc_html_e( 'Comments are closed.', 'mixt' ); ?>
	</p>
<?php endif; ?>

</div>

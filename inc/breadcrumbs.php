<?php

/* MIXT BREADCRUMBS */

function the_breadcrumb($page_title) {
    global $post;
    echo '<ol id="breadcrumbs" class="breadcrumb" itemprop="breadcrumb">';
    if (!is_front_page()) {
        echo '<li><a href="';
        echo home_url();
        echo '">';
        echo 'Home';
        echo '</a></li>';
        if (is_category() || is_single()) {
            echo '<li>';
            the_category(' </li><li> ');
            if (is_single()) {
                echo '</li><li>';
                the_title();
                echo '</li>';
            }
        } elseif (is_page()) {
            if($post->post_parent){
                $anc = get_post_ancestors( $post->ID );
                $title = get_the_title();
                foreach ( $anc as $ancestor ) {
                    $output = '<li><a href="'.get_permalink($ancestor).'" title="'.get_the_title($ancestor).'">'.get_the_title($ancestor).'</a></li>';
                }
                echo $output;
                echo '<li>'.$title.'</li>';
            } else {
                echo '<li>'.get_the_title().'</li>';
            }
        } elseif (is_home() && $page_title == 'Blog') {
            echo '<li>' . $page_title . '</li>';
        }
    }
    elseif (is_tag()) { single_tag_title(); }
    elseif (is_day()) { echo"<li>Archive for "; the_time('F jS, Y'); echo'</li>'; }
    elseif (is_month()) { echo"<li>Archive for "; the_time('F, Y'); echo'</li>'; }
    elseif (is_year()) { echo"<li>Archive for "; the_time('Y'); echo'</li>'; }
    elseif (is_author()) { echo"<li>Author Archive"; echo'</li>'; }
    elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { echo "<li>Blog Archives"; echo'</li>'; }
    elseif (is_search()) { echo"<li>Search Results"; echo'</li>'; }
    echo '</ol>';
}

/* CUSTOM WOOCOMMERCE BREADCRUMBS */

add_filter( 'woocommerce_breadcrumb_defaults', 'jk_woocommerce_breadcrumbs' );
function jk_woocommerce_breadcrumbs() {
    return array(
        'delimiter'   => '</li>',
        'wrap_before' => '<ol id="breadcrumbs" class="breadcrumb" itemprop="breadcrumb">',
        'wrap_after'  => '</ol>',
        'before'      => '<li>',
        'after'       => '</li>',
        'home'        => _x( 'Home', 'breadcrumb', 'woocommerce' ),
    );
}

?>
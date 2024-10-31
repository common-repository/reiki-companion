<?php

function reiki_get_post_thumbnail()
{
    // $thumbnail = get_the_post_thumbnail();
    ob_start();
    the_post_thumbnail('post-thumbnail',array('class'=>'blog-postimg'));
    $thumbnail = trim(ob_get_clean());

    if (empty($thumbnail)) {
        if (is_customize_preview() || 1) {
            return "<img src='https://placeholdit.imgix.net/~text?txtsize=38&bg=FF7F66&txtclr=FFFFFFe&w=400&h=250' class='blog-postimg'/>";
        } else {
            return $thumbnail;
        }
    }

    return $thumbnail;
}

function reiki_latest_news_excerpt_length(){
    return 30;
}


function reiki_latest_excerpt_more(){
    return "[&hellip;]";
}

function reiki_latest_news()
{

    ob_start();
    ?>
        <?php
            $recentPosts = new WP_Query();
            $cols = intval(get_theme_mod('reiki_latest_news_columns',4));

            $post_numbers = 12 / $cols;

            add_filter( 'excerpt_length','reiki_latest_news_excerpt_length');
            add_filter( 'excerpt_more','reiki_latest_excerpt_more');
            $recentPosts->query('showposts='. $post_numbers.';post_status=publish;post_status=publish;post_type=post');
            while ($recentPosts->have_posts()):
                $recentPosts->the_post();
                ?>
                <div class="blog-postcol cp<?php echo $cols ?>cols">
                    <?php echo reiki_get_post_thumbnail() ?>
                    <div class="blog-postbg">
                        <h3><?php the_title()?></h3>
                        <p><?php the_excerpt()?></p>
                        <a href="<?php echo get_permalink() ?>">
                            <span data-theme="reiki_latest_news_read_more">
                                <?php reiki_Companion::kses_theme_mod_e('reiki_latest_news_read_more', 'Read more')?>
                            </span>
                        </a>
                    </div>
                </div>
                <?php
            endwhile;
                wp_reset_postdata();
    
             remove_filter( 'excerpt_length','reiki_latest_news_excerpt_length');
            remove_filter( 'excerpt_more','reiki_latest_excerpt_more');
            $content = ob_get_contents();
                ob_end_clean();
                return $content;
            }

function reiki_news_static()
{
    
    return reiki_latest_news();
}
add_shortcode('reiki_latest_news', 'reiki_latest_news');




function reiki_blog_link() {
    if ( 'page' == get_option( 'show_on_front' ) ) {
        if ( get_option( 'page_for_posts' ) ) {
            return esc_url( get_permalink( get_option( 'page_for_posts' ) ) );
        } else {
            return esc_url( home_url( '/?post_type=post' ) );
        }
    } else {
        return esc_url( home_url( '/' ) );
    }
}

add_shortcode('reiki_blog_link','reiki_blog_link');

function reiki_contact_form()
{
    ob_start();
    $contact_shortcode = get_theme_mod('reiki_contact_form_shortcode', '');
    if ($contact_shortcode !== "") {
        echo do_shortcode($contact_shortcode);
    } else {
        echo '<p style="text-align:center;">' . __('Contact form will be displayed here. To activate it you have to set the "contact form shortcode" parameter in Customizer.',
            'reiki-companion') . '</p>';
    }

    $content = ob_get_contents();
    ob_end_clean();
    return $content;
}
add_shortcode('reiki_contact_form', 'reiki_contact_form');

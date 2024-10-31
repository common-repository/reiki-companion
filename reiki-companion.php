<?php
/*
Plugin Name: Reiki Companion
Plugin URI: 
Description: The Reiki Companion plugin adds drag and drop page builder functionality to the Reiki theme.

The Reiki Companion plugin features include:

- Beautiful ready-made homepage
- Drag and drop page customization
- 25 predefined content sections
- Live content editing
- 5 header types
- 3 footer types
- and many other features

Author: CloudPress
Author URI: http://cloud-press.net
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.en.html
Version: 1.0.78
 */


if (!class_exists("reiki_Companion")) {
    class reiki_Companion
    {
        public static $slug = "reiki";

        public static function in_customizer()
        {
            global $wp_customize;

            $checkInCustomizer = null;

            if (isset($_SERVER['REQUEST_URI'])) {
                if (strpos($_SERVER['REQUEST_URI'], 'customize.php') !== false) {
                    $checkInCustomizer = true;
                } else {
                    $checkInCustomizer = false;
                }
            }

            if (isset($_SERVER['HTTP_REFERER']) && !$checkInCustomizer) {
                if (strpos($_SERVER['HTTP_REFERER'], 'customize.php') !== false) {
                    $checkInCustomizer = true;
                } else {
                    $checkInCustomizer = false;
                }
            }

            if (false === $checkInCustomizer) {
                return false;
            }

            $response = false;
            if (isset($wp_customize)) {
                $response = true;
            }

            return $response || is_customize_preview();
        }

        public static function is_reiki_theme_active()
        {
            global $is_customize_admin_page;
            $theme = wp_get_theme();

            if ((isset($_REQUEST['theme']) && $_REQUEST['theme'] !=='reiki') || (isset($_REQUEST['customize_theme']) && $_REQUEST['customize_theme'] !== 'reiki')) {
                return false;
            }

            return (strtolower($theme->get('Name')) === 'reiki');
        }

        public static function load()
        {
            // add assets only if needed

            add_theme_support('custom-background', array(
                'default-color'      => "#ffffff",
                'default-image'      => reiki_Companion::plugin_url() . "/sections/images/Travel_through_New_York_wallpaper-1920x1200.jpg",
                'default-repeat'     => 'no-repeat',
                'default-position-x' => 'center',
                'default-attachment' => 'fixed',
            ));
            add_filter('template_include',
                function ($template) {
                    global $post;

                    if ($post && reiki_Companion::is_reiki_theme_active()) {
                        if (reiki_Companion::is_front_page($post->ID)) {
                            reiki_Companion::add_assets();
                            $template = reiki_Companion::plugin_path() . "/templates/home-page.php";
                        }
                    }

                    return $template;
                });

            add_action('admin_init', function () {
                if (reiki_Companion::is_reiki_theme_active()) {
                    global $submenu;
                    unset($submenu['themes.php'][15]);
                }
            });

            add_action('admin_bar_menu', function ($wp_admin_bar) {

                $wp_admin_bar->remove_menu('header');
            }, 40);


            add_filter('reiki_tgmpa_plugins', function($plugins) {
                array_unshift($plugins, array(
                    'name'      => 'Contact Form 7',
                    'slug'      => 'contact-form-7',
                    'required'  => false,
                ));
                return $plugins;
            });

            // add the footer callback
            add_filter('reiki_get_footer_callback',array('reiki_Companion','get_footer_filter'));
        
            add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), array('reiki_Companion', 'action_links') );

            register_activation_hook( __FILE__, array('reiki_Companion', 'plugin_activate'));
            register_deactivation_hook( __FILE__, array('reiki_Companion', 'plugin_deactivate'));

        }

        public static function plugin_activate() 
        {
            if (class_exists('reiki_Customizer')) {
                reiki_Customizer::getInstance()->_create_home_page();
            }
        }

        public static function plugin_deactivate() 
        {
            if (class_exists('reiki_Customizer')) {
                reiki_Customizer::getInstance()->restore_home_page();
            }
        }

        public static function action_links($links)
        {

            $link = add_query_arg(
              array(
                'url' =>  get_home_url()
              ),
              network_admin_url( 'customize.php' )
            );

            array_unshift($links, '<a href="'. esc_url( $link ) .'">'.__('Customize theme', 'reiki-companion').'</a>');
            return $links;
        }

        public static function the_content()
        {
            ob_start();
            remove_filter('the_content', 'wpautop');
            the_content();
            $content = ob_get_clean();
            if (static::in_customizer() && isset($_REQUEST['customized'])) {
                $content = get_theme_mod('reiki_content_text_edit', $content);
            }

            $content = str_replace('[reiki_latest_news]', reiki_latest_news(), $content);
            $content = str_replace('[reiki_contact_form]', reiki_contact_form(), $content);
            $content = str_replace('[reiki_blog_link]', reiki_blog_link(), $content);

            return $content;
        }

        public static function plugin_url()
        {
            return plugin_dir_url(__FILE__);
        }

        public static function plugin_path()
        {
            return plugin_dir_path(__FILE__);
        }

        //  add assets
        public static function add_assets()
        {
            wp_enqueue_style('companion-responsive-css', reiki_Companion::get_css_url('common.css'), array('reiki_style'));
            wp_enqueue_style('companion-page-css', reiki_Companion::get_css_url('page.css'));

            wp_enqueue_style(reiki_Companion::$slug . '_hoverfx', reiki_Companion::get_css_url('HoverFX.css'));

            wp_register_script(reiki_Companion::$slug . '_hammer', reiki_Companion::get_js_url('libs/hammer.js'), array('jquery'));
            wp_register_script(reiki_Companion::$slug . '_modernizr', reiki_Companion::get_js_url('libs/modernizr.js'), array('jquery'));
            wp_register_script(reiki_Companion::$slug . '_libs', false,
                array(reiki_Companion::$slug . '_hammer', 
                    reiki_Companion::$slug . '_modernizr', 'jquery-effects-slide'));

            wp_enqueue_script(reiki_Companion::$slug . '_scripts', reiki_Companion::get_js_url('scripts.js'), array(reiki_Companion::$slug . '_libs'));

            if (!reiki_Companion::in_customizer()) {
                wp_enqueue_script(reiki_Companion::$slug . '_hover_fx', reiki_Companion::get_js_url('HoverFX.js'), array(reiki_Companion::$slug . '_libs'));
                wp_enqueue_script(reiki_Companion::$slug . '_smoothscroll', reiki_Companion::get_js_url('smoothscroll.js'), array(reiki_Companion::$slug . '_libs'));
            }
        }

        public static function get_css_url($rel)
        {
            return reiki_Companion::plugin_url() . "/templates/css/$rel";
        }

        public static function get_js_url($rel)
        {
            return reiki_Companion::plugin_url() . "/templates/js/$rel";
        }

        public static function connect_fs($url, $method = '', $context = '', $fields = null)
        {
            global $wp_filesystem;
            if (false === ($credentials = request_filesystem_credentials($url, $method, false, $context, $fields))) {
                return false;
            }

            //check if credentials are correct or not.
            if (!WP_Filesystem($credentials)) {
                request_filesystem_credentials($url, $method, true, $context);
                return false;
            }

            return true;
        }

        public static function copy_dir($from, $to)
        {
            global $wp_filesystem;
            $from   = $wp_filesystem->find_folder($from);
            $to     = $wp_filesystem->find_folder($to);
            $result = copy_dir($from, $to);
            return $result;
        }

        public static function is_front_page($post_id)
        {
            return '1' === get_post_meta($post_id, 'is_' . reiki_Companion::$slug . '_front_page', true);
        }

        public static function get_header()
        {
            $header_template = get_theme_mod(reiki_Companion::$slug . '_header_template', 'homepage');

            if ($header_template !== 'homepage') {
                wp_enqueue_style('companion-' . $header_template . '-css', reiki_Companion::get_css_url("header-$header_template.css"), array('reiki_style'));
            }
            reiki_Companion::render_header_overlay();
            load_template(reiki_Companion::plugin_path() . "templates/header-$header_template.php");
        }

        public static function get_footer()
        {
            $footer_template = get_theme_mod(reiki_Companion::$slug . '_footer_template', 'default');
            if ($footer_template === 'default') {
                get_footer();
            } else {
                wp_enqueue_style('companion-' . $footer_template . '-css', reiki_Companion::get_css_url("footer-$footer_template.css"), array('reiki_style'));
                load_template(reiki_Companion::plugin_path() . "templates/footer-$footer_template.php");
            }
        }

        public static function get_footer_filter(){
            return array('reiki_Companion','get_footer');
        }

        public static function pre_set_widget($sidebar, $name, $args = array())
        {
            if (!$sidebars = get_option('sidebars_widgets')) {
                $sidebars = array();
            }

            // Create the sidebar if it doesn't exist.
            if (!isset($sidebars[$sidebar])) {
                $sidebars[$sidebar] = array();
            }

            // Check for existing saved widgets.
            if ($widget_opts = get_option("widget_$name")) {
                // Get next insert id.
                ksort($widget_opts);
                end($widget_opts);
                $insert_id = key($widget_opts);
            } else {
                // None existing, start fresh.
                $widget_opts = array('_multiwidget' => 1);
                $insert_id   = 0;
            }
            // Add our settings to the stack.
            $widget_opts[++$insert_id] = $args;
            // Add our widget!
            $sidebars[$sidebar][] = "$name-$insert_id";

            update_option('sidebars_widgets', $sidebars);
            update_option("widget_$name", $widget_opts);
        }

        public static function add_widgets_area($data)
        {
            add_action('widgets_init', function () use ($data) {
                register_sidebar(array(
                    'name'          => $data['name'],
                    'id'            => $data['id'],
                    'before_widget' => '<div id="%1$s" class="widget %2$s">',
                    'after_widget'  => '</div>',
                    'before_title'  => '<h4>',
                    'after_title'   => '</h4>',
                ));

                $active_widgets = get_option('sidebars_widgets');
                $index          = count($active_widgets) + 1;
                if (empty($active_widgets[$data['id']]) && get_theme_mod('first_time_widget_' . $data['id'], true)) {
                    set_theme_mod('first_time_widget_' . $data['id'], false);

                    $widget_content = array(
                        'title'  => __($data['title'], 'reiki-companion'),
                        'text'   => '<ul><li><a href="http://#">Documentation</a></li><li><a href="http://#">Forum</a></li><li><a href="http://#">FAQ</a></li><li><a href="http://#">Contact</a></li></ul>',
                        'filter' => false,
                    );

                    reiki_Companion::pre_set_widget($data['id'], 'text', $widget_content);
                }

            });

        }

        public static function get_widgets_area($id)
        {
            ob_start();
            ?>
               <div data-widgets-area="<?php echo $id ?>" >
                    <?php dynamic_sidebar($id);?>
                </div>
            <?php
$content = ob_get_clean();

            return trim($content);
        }

        public static function render_header_overlay()
        {
            ?>
            <style data-name="overlay-opacity">
                .header-homepage:before {
                    background-color: <?php echo get_theme_mod('reiki_header_overlay_color', ' #7d3778') ?>;
                    opacity:  0.<?php echo get_theme_mod('reiki_header_overlay_opacity', '32') ?>;
                }
            </style>
            <?php

        }

        public static function get_menu()
        {
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_id'        => 'drop_mainmenu',
                'menu_class'     => 'fm2_drop_mainmenu',
                'container_id'   => 'drop_mainmenu_container',
                'fallback_cb'    => reiki_Companion::plugin_path() . '_nomenu_cb',
            ));
        }

        public static function kses_theme_mod_e($key, $default = false)
        {
            $data = get_theme_mod($key, $default);
            // echo wp_kses($data, 'post');
            echo $data;
        }

        public static function slug_e()
        {
            echo reiki_Companion::$slug;
        }

        public static function header_title()
        {
            ?>
                <h1 class="heading8" data-theme="reiki_header_homepage_paragraph">
                    <?php reiki_Companion::kses_theme_mod_e(reiki_Companion::$slug . '_header_homepage_paragraph', __('Building websites is<br/>easy-peasy', 'reiki'))?>
                </h1>
            <?php
}

        public static function header_buttons()
        {
            $show_buttons = intval(get_theme_mod('reiki_header_buttons', 11));

            if ($show_buttons !== 0):
            ?>
                <div class="header-buttons-wrapper">

                    <?php if ($show_buttons >= 10): ?>
                        <a class="primary_button"
                           data-theme="<?php reiki_Companion::slug_e()?>_header_homepage_button_1_label"
                           data-theme-href="<?php reiki_Companion::slug_e()?>_header_homepage_button_1_link"
                           data-theme-target="<?php reiki_Companion::slug_e()?>_header_homepage_button_1_target"
                           
                           href="<?php echo esc_url(get_theme_mod(reiki_Companion::$slug . '_header_homepage_button_1_link', '#')) ?>"
                           target="<?php echo get_theme_mod(reiki_Companion::$slug . '_header_homepage_button_1_target', '_self') ?>">

                               <?php reiki_Companion::kses_theme_mod_e(reiki_Companion::$slug . '_header_homepage_button_1_label', __('Start Now', 'reiki'))?>
                        </a>
                    <?php endif;?>

                    <?php if ($show_buttons % 10): ?>
                        <a class="secondary_button"
                           data-theme="<?php reiki_Companion::slug_e()?>_header_homepage_button_2_label"
                           data-theme-href="<?php reiki_Companion::slug_e()?>_header_homepage_button_2_link"
                           data-theme-target="<?php reiki_Companion::slug_e()?>_header_homepage_button_2_target"
                          
                           href="<?php echo esc_url(get_theme_mod(reiki_Companion::$slug . '_header_homepage_button_2_link', '#')) ?>"
                           target="<?php echo get_theme_mod(reiki_Companion::$slug . '_header_homepage_button_2_target', '_self') ?>">
                           
                               <?php reiki_Companion::kses_theme_mod_e(reiki_Companion::$slug . '_header_homepage_button_2_label', __('Learn More', 'reiki'))?>
                        </a>
                    <?php endif?>
                </div>
                <?php
endif;
        }

        public static function log($data)
        {
            register_shutdown_function(function () use ($data) {
                ob_start();
                print_r($data);
                $result = ob_get_clean();
                echo "<div data-name=\"log\" style='background:black;position:fixed;width:80%;z-index:10000000;top:0;right:0px;color:#FFFFFF;'><pre>$result</div>";
            });
        }
    }
}

function reiki_companion_update_theme_supports(){
    remove_theme_support('custom-logo');
    add_theme_support('custom-logo',array(
            'height'=>70,
            'flex-width'=> true
        )
    );
}
reiki_Companion::load();

if (reiki_Companion::is_reiki_theme_active()) {
    reiki_Companion::add_widgets_area(array('name' => 'First Box Widgets', 'id' => 'reiki_first_box_widgets', 'title' => 'Widget Area'));
    reiki_Companion::add_widgets_area(array('name' => 'Second Box Widgets', 'id' => 'reiki_second_box_widgets', 'title' => 'Widget Area'));
    reiki_Companion::add_widgets_area(array('name' => 'Third Box Widgets', 'id' => 'reiki_third_box_widgets', 'title' => 'Widget Area'));
    require_once __DIR__ . "/reiki-shortcodes.php";
    require_once __DIR__ . "/customizer/customizer.php";
    add_action('after_setup_theme', 'reiki_companion_update_theme_supports',11);
}

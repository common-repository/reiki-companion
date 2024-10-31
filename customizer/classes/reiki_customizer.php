<?php

class reiki_Customizer
{
    // singleton
    private static $instance = false;
    // static vars
    public static $version             = "1.0.0";
    public static $customizer_root_url = "/";
    // vars
    public $wp_customize   = false;
    public $customizerPage = array();
    // texts

    private $editorTexts = array(
        "click_to_edit"       => "click element to edit",
        'change_texts_images' => "change texts and images",
        'background_color'    => 'Background Color',
        'background_image'    => 'Background Image',
        'choose'              => 'Choose',
        'remove'              => 'Remove',
        'cover'               => 'Cover',
        'section'             => "section",
        'make_centered'       => "make centered",
        'make_full_width'     => "make full width",
        'change_background'   => "change background",
        'show_title'          => "show section title",
        'hide_title'          => "hide section title",
        'list'                => 'list',
        'add_item'            => "add item",
        'cols_per_row'        => "columns per row",
        'column'              => "column",
        'columns'             => "columns",
        'list_item'           => "list item",
        'remove_item'         => "remove item",
        'link'                => 'link',
        'link_text'           => 'link text',
        'image'               => 'image',
        'browse_image'        => 'browse_for_image',
        'ok'                  => 'ok',
        'cancel'              => 'cancel',
    );

    // setter
    public function __set($name, $value)
    {
        switch ($name) {
            case 'wp_customize':
                $this->$name = $value;
                break;

            default:
                trigger_error("$name property can not be set in reiki_Customizer");
                break;
        }
    }
    public static $reiki_front_page_title = "Front Page";

    public function get_reiki_page()
    {
        return reiki_get_page();
    }

    public function has_home_page()
    {
        $page = $this->get_reiki_page();
        if ($page) {
            if (is_object($page) && property_exists($page, 'post_status') && $page->post_status === "publish") {
                return true;
            }
            return false;
        }
        return false;
    }

    public function is_reiki_page_set()
    {
        $page = $this->get_reiki_page();
        if ($this->has_home_page() && get_option('show_on_front', 'posts') === 'page' && get_option('page_on_front', -1) == $page->ID) {
            return true;
        } else {
            return false;
        }
    }

    public function restore_home_page()
    {
        if ($this->is_reiki_page_set()) {
            update_option('show_on_front', get_option('reiki_companion_old_show_on_front'));
            update_option('page_on_front', get_option('reiki_companion_old_page_on_front'));
        }
    }

    public function _create_home_page()
    {
        $slug = "reiki";
        $page = $this->get_reiki_page();


        update_option('reiki_companion_old_show_on_front', get_option('show_on_front'));
        update_option('reiki_companion_old_page_on_front', get_option('page_on_front'));

        if (!$page) {
            $content = reiki_default_content();
            
            $post_id = wp_insert_post(
                array(
                    'comment_status' => 'closed',
                    'ping_status'    => 'closed',
                    'post_name'      => reiki_Companion::$slug,
                    'post_title'     => self::$reiki_front_page_title,
                    'post_status'    => 'publish',
                    'post_type'      => 'page',
                    'page_template'  => 'page.php',
                    'post_content'   => $content,
                )
            );

            set_theme_mod('reiki_content_text_edit', $content);
            update_option('show_on_front', 'page');
            update_option('page_on_front', $post_id);
            update_post_meta($post_id, 'is_' . reiki_Companion::$slug . '_front_page', "1");

            if (null == get_page_by_title('Blog')) {
                $post_id = wp_insert_post(
                    array(
                        'comment_status' => 'closed',
                        'ping_status'    => 'closed',
                        'post_name'      => 'blog',
                        'post_title'     => 'Blog',
                        'post_status'    => 'publish',
                        'post_type'      => 'page',
                    )
                );
            }

            $blog = get_page_by_title('Blog');
            update_option('page_for_posts', $blog->ID);
        } else {
            update_option('show_on_front', 'page');
            update_option('page_on_front', $page->ID);
            update_post_meta($page->ID, 'is_' . reiki_Companion::$slug . '_front_page', "1");
        }
    }

    public function create_home_page()
    {
        $nonce = $_POST['create_home_page_nounce'];
        if (!wp_verify_nonce($nonce, 'create_home_page_nounce')) {
            die();
        }

        $this->_create_home_page();
    }

    public function ask_for_homepage()
    {
        ?>

        <script type="text/javascript">


            jQuery(document).ready(function ($) {
                parent.tb_show('Reiki front page', '#TB_inline?width=570&height=340&inlineId=reiki_homepage');

                parent.jQuery('#TB_window').css({
                    'z-index': '5000001'
                })
                parent.jQuery('#TB_overlay').css({
                    'z-index': '5000000'
                })

                parent.jQuery('#TB_window').find("#cp-item-cancel").off().on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    parent.tb_remove();
                });


                parent.jQuery('#TB_window').find("#cp-item-ok").off().on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    parent.tb_remove();
                    parent.reikiCreateFrontendPage();
                });


            });

            parent.reikiCreateFrontendPage = function () {
                jQuery.post(
                        parent.ajaxurl,
                        {
                            action: 'create_home_page',
                            create_home_page_nounce: '<?php echo wp_create_nonce('create_home_page_nounce'); ?>'
                        },
                        function (response) {
                            parent.window.location = (parent.window.location + "").split("?")[0];
                        }
                );
            };

        </script>
        <?php
;
    }

    public function current_page_check()
    {
        global $post;
        $is_reiki_home_page = ($this->has_home_page()) && (strpos($post->post_name, "reiki") !== false);

        $this->customizerPage['has_home_page']      = $this->has_home_page();
        $this->customizerPage['is_reiki_home_page'] = $is_reiki_home_page;
        ?>
        <script  type="text/javascript" data-reiki="true">
            parent.reikiCustomizerPage = {
                "has_home_page": <?php echo ($this->customizerPage['has_home_page'] ? "true" : "false") ?>,
                "is_reiki_home_page": <?php echo ($is_reiki_home_page ? "true" : "false"); ?>,
                "is_home_page_active": <?php echo ($this->is_reiki_page_set() ? "true" : "false"); ?>
            }

            jQuery(document).ready(function($) {
                 parent.postMessage('reiki_update_customizer', "*");
            });

            parent.reikiCreateFrontendPage = function () {
                jQuery.post(
                        parent.ajaxurl,
                        {
                            action: 'create_home_page',
                            create_home_page_nounce: '<?php echo wp_create_nonce('create_home_page_nounce'); ?>'
                        },
                        function (response) {
                            parent.window.location = (parent.window.location + "").split("?")[0];
                        }
                );
            };
        </script>
        <?php
;
    }

    public function get_headers_urls()
    {
        return array(
            'homepage'   => get_stylesheet_directory_uri() . "/images/woman_bkg_darker.jpg",
            'homepage-1' => get_stylesheet_directory_uri() . "/images/woman_bkg_darker.jpg",
            'homepage-2' => get_stylesheet_directory_uri() . "/images/woman_bkg_darker.jpg",
            'homepage-3' => get_stylesheet_directory_uri() . "/images/header_2.jpg",
            'homepage-4' => get_stylesheet_directory_uri() . "/images/header_2.jpg",
        );
    }

    public function add_change_header_image()
    {
        ?>
        <script  type="text/javascript">
            parent.reikiHeaderImages = <?php echo json_encode($this->get_headers_urls()); ?>;
        </script>
        <?php
;
    }

    public function __construct()
    {
        self::$customizer_root_url = plugin_dir_url(dirname(__FILE__) . "/../../");
        self::$instance            = $this;
        // this will be added inside wrapper only

        add_action('wp_ajax_cp_list_fa', array($this, 'list_fa'));

        if (self::is_in_wrapper()) {
            //$this->load_assets();

            add_action('admin_footer', array($this, 'admin_footer_action'));
            add_action('admin_enqueue_scripts', array($this, 'hrw_enqueue'));
            add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts_action'));
        } else {

        }

        // added inside frame too
        // register sections
        add_action('customize_dynamic_setting_args', array($this, 'customize_dynamic_setting_args'), 10, 2);
        add_action('customize_register', array($this, 'customize_register_action'), 100, 1);

        // enque javascript files
        add_action('customize_register', array($this, 'customize_preview_init_action'));
        add_action('customize_preview_init', array($this, 'preview_init'));

        add_action('customize_controls_enqueue_scripts', array($this, 'customize_enqueue_scripts'));

        add_action('wp_ajax_create_home_page', array($this, 'create_home_page'));
        add_action('customize_save_reiki_content_text_edit', array($this, 'save_post'), 99);
        add_action('customize_save_reiki_header_template', array($this, 'change_header'), 99);
    }

    public function customize_dynamic_setting_args($args, $id)
    {
        switch ($id) {
            case 'blogname':
            case 'blogdescription':
            case 'custom_logo':
            case 'header_textcolor':
                $args['transport'] = 'postMessage';
                break;
            case 'background_image':
                $args['priority'] = 22;
                break;
            case 'header_image':
                $args['priority'] = 21;
                break;
                switch ($id) {
                    case 'title_tagline':
                    case 'static_front_page':
                        $args['panel'] = 'reiki-general-settings';
                        break;
                }
        }

        return $args;
    }

    public function save_post($setting)
    {
        $content = $setting->post_value();
        $post    = $this->get_reiki_page();

        if ($post) {
            wp_update_post(array(
                'ID'           => $post->ID,
                'post_content' => $content,
            ));
        }
    }

    public function hrw_enqueue()
    {
        wp_enqueue_style('thickbox');
        wp_enqueue_script('thickbox');
    }

    public function customize_register_action($wp_customize)
    {

        $this->wp_customize = $wp_customize;

        // load cloudpress extended customizer api
        $this->load_libraries();

        // if ($this->has_home_page()) {
        // add Panels

        $this->wp_customize->add_panel(new reiki_Headers_Insert_Panel($this->wp_customize));
        $this->wp_customize->register_panel_type('reiki_Customizer_Frontpage_Content_Panel');
        $this->wp_customize->add_panel(new reiki_Customizer_Frontpage_Content_Panel($this->wp_customize));
        $this->wp_customize->add_panel(new reiki_General_Settings($this->wp_customize));
        $this->wp_customize->add_panel(new reiki_All_Simple_Panel($this->wp_customize));

        if (!$this->has_home_page()) {
            add_action('wp_footer', array($this, 'ask_for_homepage'));
        }

        add_action('wp_footer', array($this, 'current_page_check'));
        add_action('wp_footer', array($this, 'add_change_header_image'));
        add_action('wp_head',function(){
            ?>
                <script type="text/javascript">
                    // stop mutation observer ( takes to much to load content)

                        // if(window.wp.customize.mutationObserver){
                        //     window.wp.customize.mutationObserver.disconnect();
                        // }

                        // if(window.wp.customize){
                        //     window.wp.customize.addLinkPreviewing = window.wp.customize.prepareLinkPreview = function(){};
                        // }

                </script>
            <?php
        },9);
        add_action('customize_controls_print_footer_scripts', array($this, 'show_reiki_pro_info'));

        $this->wp_customize->get_setting('blogname')->transport         = 'postMessage';
        $this->wp_customize->get_setting('blogdescription')->transport  = 'postMessage';
        $this->wp_customize->get_setting('header_textcolor')->transport = 'postMessage';
        $this->wp_customize->get_setting('custom_logo')->transport      = 'refresh';
        $this->wp_customize->remove_section('colors');

        $this->wp_customize->remove_control('display_header_text');
        $this->wp_customize->remove_control('background_repeat');
        $this->wp_customize->remove_control('background_position_x');

        $backgroundPanel           = $this->wp_customize->get_section('background_image');
        $backgroundPanel->priority = 22;

        $backgroundPanel           = $this->wp_customize->get_section('header_image');
        $backgroundPanel->priority = 21;
     
        $this->wp_customize->register_panel_type('reiki_Customizer_Header_Panel');
        $this->wp_customize->add_panel(new reiki_Customizer_Header_Panel($this->wp_customize));
    }

    public function preview_init()
    {
        $assets_root = reiki_Customizer::$customizer_root_url . '/assets';
        wp_enqueue_script('reiki_customizer_settings_handler', $assets_root . '/settings-handlers.js', array('jquery', 'customize-preview'));
    }

    public function customize_preview_init_action()
    {
       

       
        if(!reiki_Companion::in_customizer()){
            return;
        }

        $assets_root = reiki_Customizer::$customizer_root_url . '/assets';

        foreach ($this->editorTexts as $key => $value) {
            $this->editorTexts[$key] = translate($value, 'reiki-dragdrop');
        }

        wp_enqueue_script('reiki_customizer_lib_spectrum', $assets_root . '/spectrum/spectrum.js', array('jquery'));
        wp_enqueue_style('reiki_customizer_lib_spectrum', $assets_root . '/spectrum/spectrum.css');
        wp_register_script('reiki_customizer_frame', $assets_root . '/reiki_customizer_frame.js', array(), false, true);
        wp_localize_script('reiki_customizer_frame', 'cpReikiTexts', $this->editorTexts);
        wp_enqueue_script('reiki_customizer_frame');


        wp_enqueue_style('reiki_font-awesome', get_template_directory_uri() . '/assets/font-awesome/font-awesome.min.css');
        wp_enqueue_style('reiki_fa_media_tab', $assets_root . '/fa-tab.css', array('reiki_font-awesome'));
        wp_enqueue_script('reiki_customizer_sections_settings', $assets_root . '/reiki_customizer_sections_settings.js', array( 'reiki_customizer_frame'), false, true);
        wp_enqueue_script('reiki_customizer_sections_overlays', $assets_root . '/reiki_customizer_sections_overlays.js', array( 'reiki_customizer_sections_settings'), false, true);
        wp_enqueue_script('reiki_customizer_sections_handlers', $assets_root . '/reiki_customizer_sections_handlers.js', array( 'reiki_customizer_sections_settings'), false, true);
        wp_enqueue_script('reiki_customizer_footer', $assets_root . '/reiki_customizer_footer.js', array( 'reiki_customizer_sections_settings'), false, true);
        wp_enqueue_script('reiki_customizer_add_content', $assets_root . '/reiki_customizer_add_content.js', array('jquery-ui-sortable',  'reiki_customizer_sections_settings'), false, true);
        wp_enqueue_script('reiki_editor_texts');
        wp_localize_script('reiki_customizer_frame', 'reiki', array('ajaxurl' => admin_url('admin-ajax.php')));
        wp_enqueue_script('reiki_customizer_page', $assets_root . '/reiki_customizer_page.js', array( 'reiki_customizer_frame'), false, true);
        add_action('wp_footer', array($this, 'wp_footer_action'));

        
    }

    public function customize_enqueue_scripts()
    {
        // wp_enqueue_script('media-views');
        $assets_root = reiki_Customizer::$customizer_root_url . '/assets';

        wp_enqueue_script('reiki_fa_media_tab', $assets_root . '/fa-tab.js', array('media-views'));
        wp_enqueue_script('reiki_menu_handler', $assets_root . '/menu_handler.js', array('reiki_customizer_frame'));
        wp_enqueue_script('reiki_speakingurl', $assets_root . '/speakingurl.js', array('reiki_customizer_frame'));
    }

    public function wp_footer_action()
    {
        echo '<script type="text/javascript">parent.reikiOriginal = ' . json_encode(reiki_static_sections()) . '; </script>';
        echo '<link rel="stylesheet" type="text/css" media="all"  href="' . reiki_Customizer::$customizer_root_url . '/assets/reiki_customizer_frame.css' . '"/>';
    }

    public function list_fa()
    {
        $result = array();
        $icons  = (require __DIR__ . "/fa-icons.php");

        foreach ($icons as $icon) {
            $title    = str_replace('-', ' ', str_replace('fa-', '', $icon));
            $result[] = array(
                'id'    => $icon,
                'fa'    => $icon,
                "title" => $title,
                'mime'  => "fa-icon/font",
                'sizes' => null,
            );
        }

        echo json_encode($result);
        exit;

    }

    public function show_reiki_pro_info()
    {
        ?>


        <div id="reiki_homepage" style="display:none">
            <div class="reiki_cp_row">
                <div class="reiki_cp_column">
                    <div class="scrn_wrapper">
                        <img src="<?php echo reiki_Customizer::$customizer_root_url ?>/assets/screenshot.jpg" />
                    </div>
                </div>
                <div class="reiki_cp_column">
                    <h3><?php _e('Please Enable the Reiki Front Page to Get All the Theme Features', 'reiki-dragdrop')
        ?></h3>
                    <span><?php _e('The Reiki theme comes with a beautiful predefined front page that can be very easily customized. It is recommended that you enable it in order to benefit from the full features of Reiki. Would you like to enable it now ?',
            'reiki-dragdrop')
        ?> </span>
                </div>
            </div>
            <div id="cp-items-footer">
                <button type="button" class="button button-large" id="cp-item-cancel"><?php _e('Maybe later', 'reiki-dragdrop')
        ?></button>
                <button type="button" class="button button-large button-primary" id="cp-item-ok"><?php _e('Enable now', 'reiki-dragdrop')
            ?></button>
            </div>
        </div>
        <?php
;
    }

    public function admin_footer_action()
    {
        $this->load_assets();
    }

    public function admin_enqueue_scripts_action()
    {
        $this->load_assets();
    }

    public function load_libraries()
    {
        require_once dirname(__FILE__) . "/reiki_customizer_api.php";
        require_once dirname(__FILE__) . "/reiki_general_settings.php";
        require_once dirname(__FILE__) . "/reiki_customizer_header_panel.php";
        require_once dirname(__FILE__) . "/reiki_customizer_frontpage_content_panel.php";
        require_once dirname(__FILE__) . "/reiki_headers_panel.php";
        require_once dirname(__FILE__) . "/reiki_simple_panel.php";
    }

    public function prepare_post_content($content)
    {
        global $post;
        $unique     = uniqid('post_');
        $newContent = '<style data-post-id="' . $post->ID . '" data-unique-start="' . $unique . '" ></style>';
        $newContent .= $content;
        $newContent .= '<style data-post-id="' . $post->ID . '" data-unique-end="' . $unique . '" ></style>';
        return $newContent;
    }

    public function enqueue_assets()
    {

    }

    // static functions
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new reiki_Customizer();
        }

        return self::$instance;
    }

    public static function init()
    {
        reiki_Customizer::getInstance();
    }

    public function load_assets()
    {
        //wp_enqueue_script('reiki_customizer_wrapper', reiki_Customizer::$customizer_root_url . '/assets/reiki_customizer.js', array('jquery'));
        wp_enqueue_style('reiki_customizer_css', reiki_Customizer::$customizer_root_url . '/assets/reiki_customizer.css');
    }

    public static function is_in_wrapper()
    {
        $file     = isset($_SERVER['SCRIPT_FILENAME']) ? $_SERVER['SCRIPT_FILENAME'] : false;
        $parts    = explode("/", str_replace("\\", "/", $file));
        $fileName = array_pop($parts);
        if (!$file) {
            return false;
        }

        return $fileName === 'customize.php';
    }
}
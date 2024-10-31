<?php

function reiki_get_page()
{
    $query = new WP_Query(
        array(
            "post_status" => "publish",
            "post_type"   => 'page',
            "meta_key"    => 'is_reiki_front_page',
        )
    );

    if (count($query->posts)) {
        return $query->posts[0];
    }

    return null;
}

function reiki_get_sections()
{
    $sectionsfile = __DIR__ . "/../sections/sections.json";
    $headersfile  = __DIR__ . "/../sections/headers.json";
    $footersfile  = __DIR__ . "/../sections/footers.json";

    ob_start();
    include $sectionsfile;
    $sections = ob_get_contents();
    ob_end_clean();

    $reiki_available_sections = json_decode($sections, true);

    ob_start();
    include $headersfile;
    $sections = ob_get_contents();
    ob_end_clean();

    $reiki_available_sections = array_merge($reiki_available_sections, json_decode($sections, true));

    ob_start();
    include $footersfile;
    $sections = ob_get_contents();
    ob_end_clean();

    $reiki_available_sections = array_merge($reiki_available_sections, json_decode($sections, true));

    foreach ($reiki_available_sections as $key => $full_row) {
        $content             = str_replace('[tag_companion_uri]', esc_attr(reiki_Companion::plugin_url()), $full_row['content']);
        $content             = str_replace('[tag_link_site_url]', esc_attr(site_url()), $content);
        $full_row['content'] = $content;

        $t_content                      = str_replace('[reiki_latest_news]', reiki_news_static(), $content);
        $t_content                      = str_replace('[reiki_contact_form]', reiki_contact_form(), $t_content);
        $full_row['translated_content'] = $t_content;
        $full_row['description']        = translate($full_row['description'], 'reiki-companion');
        $reiki_available_sections[$key] = $full_row;
    }

    return $reiki_available_sections;
}

function reiki_uids_replace_callback($matches)
{
    global $reiki_uuid;
    $space = " ";
    if (isset($matches[2]) && $matches[2] !== "") {
        $space = $matches[2];
    }
    return $matches[1] . ' data-cpid="' . $reiki_uuid++ . '"' . $space;
}

function reiki_add_uids($content)
{
    global $reiki_uuid;
    $reiki_uuid = 0;
    $content    = preg_replace_callback(
        '/(<[\w]+)([\s]+)?/s', 'reiki_uids_replace_callback', $content
    );
    return $content;
}

function reiki_default_content()
{
    $defaultSections = array("clients-strip-section", "features-small-image", "about-overlap-section",
        "content-full-left-image-section", "content-full-right-image-section", "portfolio-full-width-section",
        "testimonials-blue-section", "cta-blue-section", "blog-section", "numbers-section", "team-large-square-section", "contact-section");

    $alreadyColoredSections = array("blog-section", "numbers-section", "contact-section", "cta-blue-section");

    $availableSections = reiki_get_sections();

    $content = "";

    $colors     = array('#ffffff', '#f6f6f6');
    $colorIndex = 0;

    foreach ($defaultSections as $ds) {
        foreach ($availableSections as $as) {
            if ($as['id'] == $ds) {
                $_content = $as['content'];

                if (strpos($_content, 'data-bg="transparent"') === false && !in_array($ds, $alreadyColoredSections)) {
                    $_content   = preg_replace('/\<div/', '<div style="background-color:' . $colors[$colorIndex] . '" ', $_content, 1);
                    $colorIndex = $colorIndex ? 0 : 1;
                } else {
                    $colorIndex = 0;
                }

                $_content = preg_replace('/\<div/', '<div id="' . $as['elementId'] . '" ', $_content, 1);

                $content .= $_content;
                break;
            }
        }
    }

    return $content;
}

function reiki_static_sections($skipShortcode = false)
{
    global $reiki_static_section_t;

    if ($reiki_static_section_t) {
        return $reiki_static_section_t;
    }

    $home_page_content = reiki_get_home_page_content();

    if ($skipShortcode && $home_page_content) {
        set_theme_mod('reiki_text_edit', $home_page_content);
    }

    if (!$home_page_content) {
        set_theme_mod('reiki_text_edit', '');
    }

    $content = get_theme_mod('reiki_text_edit');
    if ($content) {
        if (is_customize_preview()) {
            $reiki_static_section_t = reiki_add_uids(do_shortcode(get_theme_mod('reiki_text_edit')));
            return $reiki_static_section_t;
        }
        $reiki_static_section_t = do_shortcode(get_theme_mod('reiki_text_edit'));
        return $reiki_static_section_t;
    }

    $static_full_rows = reiki_get_sections();
    $sections         = array();
    foreach ($static_full_rows as $key => $full_row) {
        if ($full_row['type'] == "section-default") {
            array_push($sections, $full_row['content']);
        }
    }

    $content = implode("\r\n", $sections);

    if (is_customize_preview()) {
        $reiki_static_section_t = reiki_add_uids(do_shortcode($content, $skipShortcode));
        return $reiki_static_section_t;
    }

    $reiki_static_section_t = do_shortcode($content, $skipShortcode);
    return $reiki_static_section_t;
}

function reiki_get_home_page_content()
{
    $page = reiki_get_page();
    if ($page) {
        return $page->post_content;
    }
    return false;
}

function reiki_customizer_plugin_url()
{
    return reiki_Companion::plugin_url() . "customizer/";
}

require_once dirname(__FILE__) . "/classes/reiki_customizer.php";
reiki_Customizer::init();

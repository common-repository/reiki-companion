<?php

class reiki_All_Simple_Panel extends WP_Customize_Panel
{

    public $id           = "reiki_edit_content_panel";
    public $priority     = 10;
    public $capability   = 'edit_theme_options';
    public $title        = 'Customize Content';
    public $wp_customize = 'Customize Content';
    public $sections;

    public function __construct($manager)
    {
        ob_start();
        require dirname(__FILE__) . '/sections.json';
        $content = ob_get_contents();
        ob_end_clean();

        $this->sections = json_decode($content, true);

        $this->sections['sections'] = $this->translate_section($this->sections['sections']);

        $this->wp_customize = $manager;
        $this->add_sections();
        parent::__construct($manager, $this->id);
    }

    private function translate_section($parents)
    {

        if (!is_array($parents)) {
            return $parents;
        }

        foreach ($parents as $key => $child) {
            if (is_array($child)) {
                $parents[$key] = $this->translate_section($child);
            } else {
                if (in_array($key, array('title', 'description', 'label'))) {
                    $parents[$key] = translate($child, 'reiki-companion');
                }
            }
        }

        return $parents;
    }

    private function add_sections()
    {
        foreach ($this->sections['sections'] as $section_id => $section) {

            if (!$this->wp_customize->get_section($section_id)) {
                $this->wp_customize->add_section($section_id, $section['params']);
            }

            foreach ($section['controls'] as $control_id => $control) {

                if (isset($control['type']) && $control['type'] === "template") {
                    $params = isset($control['params']) ? $control['params'] : array();
                    $params = array_merge($params, array(
                        'section' => $section_id,
                    ));

                    $this->wp_customize->add_setting($control_id, array());
                    $this->wp_customize->add_control(
                        new reiki_Customize_Control(
                        $this->wp_customize, $control_id, $params
                        )
                    );
                    continue;
                }

                $setting_id = "";
                if (!is_string($control['settings'])) {
                    foreach ($control['settings'] as $sett_id => $setting) {
                        $setting_id = $sett_id;
                        if (isset($setting['default'])) {
                            $setting['default'] = str_replace('%themeuri%', get_stylesheet_directory_uri(), $setting['default']);
                            $setting['default'] = str_replace('%pluginuri%', reiki_Companion::plugin_url(), $setting['default']);
                        }
                        $this->wp_customize->add_setting($setting_id, $setting);
                    }
                } else {
                    $setting_id = $control->settings;
                }

                $params = wp_parse_args($control['params'], array('section' => $section_id));

                if (isset($params['type']) && $params['type'] === "hidden") {
                    $params['label'] = "";
                }

                $klass = (isset($control['type']) && $control['type'] == "image") ? 'WP_Customize_Image_Control' : 'WP_Customize_Control';
                $this->wp_customize->add_control(
                    new $klass(
                    $this->wp_customize, $setting_id, $params
                    )
                );
            }
        }
    }
}

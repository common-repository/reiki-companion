<?php

class reiki_Customizer_Frontpage extends WP_Customize_Panel
{

    public $id           = "reiki-customize-frontpage-panel";
    public $capability   = 'edit_theme_options';
    public $priority     = 20;
    public $wp_customize = null;

    public function __construct($manager)
    {
        $this->wp_customize = $manager;
        parent::__construct($manager, 'reiki-customize-frontpage-panel', array(
            'title'    => __('Front Page Content', 'reiki-companion'),
            'priority' => 2,
        ));
        $this->add_sections();
    }

    private function add_sections()
    {
        $edit_section_id = 'reiki_webpage_layout_reorder';

        $this->wp_customize->add_section($edit_section_id, array(
            'priority' => 30,
            'title'    => translate('Reorder and remove sections', 'reiki-companion'),
            'panel'    => $this->id,
        ));

        $setting = 'reiki_text_edit';

        $settingObj = new reiki_Customize_Setting($this->wp_customize, $setting, array(
            'capability' => 'edit_theme_options',
            'transport'  => 'postMessage',
        ));

        $this->wp_customize->add_setting($settingObj);

        $editControl = new reiki_Customize_Control($this->wp_customize, $setting, array(
            'capability' => 'edit_theme_options',
            'section'    => $edit_section_id,
            'settings'   => $setting,
            'type'       => 'text',
        ));
        $this->wp_customize->add_control($editControl);

        $edit_section_id = 'reiki_webpage_layout_insert';

        $this->wp_customize->add_section($edit_section_id, array(
            'priority' => 30,
            'title'    => __('Insert content sections', 'reiki-companion'),
            'panel'    => $this->id,
        ));

        $setting = 'reiki_sections_insert';

        $settingObj = new reiki_Customize_Setting($this->wp_customize, $setting, array(
            'capability' => 'edit_theme_options',
            'transport'  => 'postMessage',
        ));

        $this->wp_customize->add_setting($settingObj);

        $editControl = new reiki_Customize_Control($this->wp_customize, $setting, array(
            'capability' => 'edit_theme_options',
            'section'    => $edit_section_id,
            'settings'   => $setting,
            'type'       => 'text',
        ));

        $this->wp_customize->add_control($editControl);
    }

}

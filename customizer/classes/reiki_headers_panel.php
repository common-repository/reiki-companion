<?php

class reiki_Headers_Insert_Panel extends WP_Customize_Panel
{

    public $id           = "reiki_headers_insert_panel";
    public $priority     = 20;
    public $capability   = 'edit_theme_options';
    public $title        = 'Customize Content';
    public $wp_customize = 'Customize Content';

    public function __construct($manager)
    {

        $this->title        = translate($this->title, 'reiki-companion');
        $this->wp_customize = translate($this->wp_customize, 'reiki-companion');

        $this->wp_customize = $manager;
        $this->add_sections();
        parent::__construct($manager, $this->id);
    }

   

    private function add_sections()
    {
        $edit_section_id = 'reiki_webpage_headers';

        $this->wp_customize->add_section($edit_section_id, array(
            'priority' => $this->priority,
            'title'    => translate('Change Header', 'reiki-companion'),
        ));

        $setting = 'reiki_headers_insert';

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

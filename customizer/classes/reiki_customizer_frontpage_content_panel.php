<?php

class reiki_Customizer_Frontpage_Content_Panel extends WP_Customize_Panel
{
    public $id           = "reiki_customize_frontpage_panel";
    public $capability   = 'edit_theme_options';
    public $type         = 'reiki_Customizer_Frontpage_Content_Panel';
    public $priority     = 20;
    public $wp_customize = null;

    public function __construct($manager)
    {
        $this->wp_customize = $manager;
        parent::__construct($manager, $this->id,
            array(
            'title' => __('Front Page Content', 'reiki-companion'),
            'priority' => 2,
        ));
        $this->insert_content_section();
        $this->edit_content_section();
        $this->general_settings_section();
    }

    private function insert_content_section()
    {
        $insert_section_id = 'reiki_webpage_layout_insert';
        $setting           = 'reiki_sections_insert';


        $this->wp_customize->add_section($insert_section_id,
            array(
            'priority' => 30,
            'title' => __('Insert content sections', 'reiki-companion'),
            'panel' => $this->id,
        ));

        $settingObj = new reiki_Customize_Setting($this->wp_customize, $setting,
            array(
            'capability' => 'edit_theme_options',
            'transport' => 'postMessage',
        ));

        $this->wp_customize->add_setting($settingObj);

        $insertControl = new reiki_Customize_Control($this->wp_customize, $setting,
            array(
            'capability' => 'edit_theme_options',
            'section' => $insert_section_id,
            'settings' => $setting,
            'type' => 'text',
        ));

        $this->wp_customize->add_control($insertControl);
    }

    private function edit_content_section()
    {
        $edit_section_id = 'reiki_webpage_layout_reorder';
        $setting         = 'reiki_content_text_edit';

        $this->wp_customize->add_section($edit_section_id,
            array(
            'priority' => 30,
            'title' => __('Reorder and remove sections', 'reiki-companion'),
            'panel' => $this->id,
        ));


        $settingObj = new reiki_Customize_Setting($this->wp_customize, $setting,
            array(
            'capability' => 'edit_theme_options',
            'transport' => 'postMessage',
        ));

        $this->wp_customize->add_setting($settingObj);
        $editControl = new reiki_Customize_Control($this->wp_customize, $setting,
            array(
            'capability' => 'edit_theme_options',
            'section' => $edit_section_id,
            'settings' => $setting,
            'type' => 'text',
        ));
        $this->wp_customize->add_control($editControl);
    }

    private function general_settings_section()
    {
        $edit_section_id = 'reiki_frontpage_general_settings';
      

        $this->wp_customize->add_section($edit_section_id,
            array(
            'priority' => 30,
            'title' => __('General settings', 'reiki-companion'),
            'panel' => $this->id,
        ));

    }

    public function render_template()
    {
        ?>
        <li id="accordion-panel-{{ data.id }}" data-name="<?php echo $this->id ?>" class="accordion-section control-section control-panel control-panel-{{ data.type }}">
            <h3 class="accordion-section-title reiki-customizer-content-title" tabindex="0">
                {{ data.title }} 
             
            </h3>
            <ul class="accordion-sub-container control-panel-content"></ul>
        </li>
        <?php
    }
}
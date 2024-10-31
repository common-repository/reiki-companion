<?php

class reiki_Customizer_Header_Panel extends WP_Customize_Panel
{
    public $priority   = 10;
    public $type       = "reiki_Customizer_Header";
    public $capability = 'edit_theme_options';
    public $id         = 'reiki-customize-header-panel';

    public function __construct($manager)
    {

        $this->manager  = $manager;
        $this->title    = __('Header', 'reiki-companion');
        $this->priority = 1;

        self::$instance_count += 1;
        $this->instance_number = self::$instance_count;

        $this->sections = array(); // Users cannot customize the $sections array.
        //customize_save

        add_action('customize_register', array($this, 'customize_register'), 200);

        $this->active_callback = array($this, 'active_callback');

        $assets_root = reiki_Customizer::$customizer_root_url . '/assets';
        wp_enqueue_script('reiki_customizer_header', $assets_root . '/reiki_customizer_header.js', array('reiki_customizer_frame'), false, true);
    }

    public function customize_register()
    {
        $this->manager->get_section('reiki_webpage_headers')->panel = $this->id;

        $this->manager->get_section('header_image')->panel = $this->id;

        $this->addOverlayControls();
        $this->addButtonsControl();
        $this->titleControl();

        $this->manager->get_control('reiki_homepage_header')->priority  = 0;
        $this->manager->get_setting('reiki_homepage_header')->transport = 'postMessage';
    }

    public function addButtonsControl()
    {

        $this->manager->add_setting('reiki_header_buttons', array(
            'default' => '11',
        ));

        $optionsButtons = array(
            'label'    => __('Select visible buttons', 'reiki-companion'),
            'section'  => 'header_image',
            'settings' => 'reiki_header_buttons',
            'type'     => 'radio',
            'choices'  => array(
                '11' => __('Both buttons', 'reiki-companion'),
                '10' => __('Primary button', 'reiki-companion'),
                '01' => __('Secondary button', 'reiki-companion'),
                '00' => __('No button', 'reiki-companion'),
            ),
            'priority' => 3,
        );

        $this->manager->add_control(new WP_Customize_Control($this->manager, 'reiki_header_buttons', $optionsButtons));
    }

    public function addOverlayControls()
    {
        $this->manager->add_setting('reiki_header_overlay_color', array(
            'default'   => '#7d3778',
            'transport' => 'postMessage',
        ));

        $options = array(
            'label'    => __('Header Overlay Color', 'reiki-companion'),
            'section'  => 'header_image',
            'settings' => 'reiki_header_overlay_color',
            'priority' => 1,
            'type'     => 'radio',
            'choices'  => array(
                '#7d3778' => __('', 'reiki-companion'),
                '#000000' => __('', 'reiki-companion'),
                '#ff0000' => __('', 'reiki-companion'),
            ),

        );

        $this->manager->add_control(new WP_Customize_Control($this->manager, 'reiki_header_overlay_color', $options));

        $this->manager->add_setting('reiki_header_overlay_opacity', array(
            'default'   => '32',
            'transport' => 'postMessage',
        ));

        $options = array(
            'label'       => __('Header Overlay Opacity', 'reiki-companion'),
            'section'     => 'header_image',
            'settings'    => 'reiki_header_overlay_opacity',
            'type'        => 'number',
            'input_attrs' => array(
                'min'  => '0',
                'max'  => '100',
                'step' => '5',
            ),
            'priority'    => 2,

        );

        $this->manager->add_control(new WP_Customize_Control($this->manager, 'reiki_header_overlay_opacity', $options));
    }

    public function titleControl(){
          $options = array(
            'label'       => __('Subpages header settings', 'reiki-companion'),
            'section'     => 'header_image',
            'settings'    => 'reiki_dummy_title_control_header',
            'type'        => 'hidden',
            'priority'    => 3,

        );

           $this->manager->add_setting('reiki_dummy_title_control_header', array(
            'default'   => '',
            'transport' => 'postMessage',
        ));


        $this->manager->add_control(new WP_Customize_Control($this->manager, 'reiki_dummy_title_control_header', $options));
    }

    public function render_template()
    {
        ?>
        <li id="accordion-panel-{{ data.id }}" data-name="<?php echo $this->id ?>" class="accordion-section control-section control-panel control-panel-{{ data.type }}">
            <h3 class="accordion-section-title" tabindex="0">
                {{ data.title }}
                <span title="<?php _e('Change Header', 'reiki-dragrop')?>" data-name="change" class="open-right section-icon"></span>
                <span title="<?php _e('Header Settings', 'reiki-dragrop')?>" data-name="edit" class="setting section-icon"></span>
            </h3>
            <ul class="accordion-sub-container control-panel-content"></ul>
        </li>
        <?php
}

    public function content_template()
    {
        ?>
        <li class="panel-meta customize-info accordion-section <# if ( ! data.description ) { #> cannot-expand<# } #>">

        </li>
        <?php
}

    public function enqueue()
    {

    }
}
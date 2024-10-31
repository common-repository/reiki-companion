<?php

class reiki_General_Settings extends WP_Customize_Panel
{
    public $priority = 40;
    public function __construct($manager)
    {

        parent::__construct($manager, 'reiki-general-settings', array(
            "title" => __('General Settings', 'reiki-companion'),
        ));

        $manager->get_section('title_tagline')->panel     = $this->id;
        $manager->get_section('static_front_page')->panel = $this->id;
        $manager->get_section('background_image')->panel  = $this->id;
    }
}

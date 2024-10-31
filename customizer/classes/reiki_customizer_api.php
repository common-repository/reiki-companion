<?php

if (class_exists('WP_Customize_Control')) {

    class reiki_Customize_Control extends WP_Customize_Control {

        public $args;
        public $id;
        public $manager;
        private $fragments_root;

        function __construct($manager, $id, $args = array()) {
            parent::__construct($manager, $id, $args);
            $this->fragments_root = dirname(__FILE__) . "/../fragments/";
            $this->input_attrs['id'] = $id;
        }

        public function render_content() {
            if (file_exists($this->fragments_root . $this->id . ".php")) {
                require_once $this->fragments_root . $this->id . ".php";
            } else {
                ?>
                <span>Fragment for control <?php echo $this->id ?> not found</span>
                <?php
            }
        }

    }

}


if (class_exists('WP_Customize_Setting')) {

    class reiki_Customize_Setting extends WP_Customize_Setting {

        public $sanitized = false;

        function __construct($manager, $id, $args = array()) {
            parent::__construct($manager, $id, $args);
            $this->add_action();
        }

        private function add_action() {
            add_action('customize_update_' . $this->type, array($this, 'updateValue'), 10, 2);
        }

        public function sanitize($value) {
            if ($this->sanitized) {
                return parent::sanitize($value);
            }
            return $value;
        }

    }

}

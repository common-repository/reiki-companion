<div class="header-homepage" style="background-image:url('<?php echo reiki_homepage_header(); ?>');">
    <div class="gridContainer">
        <div class="row border_bottom">
            <div class="logo_col">
                <?php echo reiki_logo(); ?>
            </div>
            <div class="main_menu_col">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_id' => 'drop_mainmenu',
                    'menu_class' => 'fm2_drop_mainmenu',
                    'container_id' => 'drop_mainmenu_container',
                    'fallback_cb' => 'reiki_nomenu_cb'
                ));
                ?>
            </div>
        </div>
        <div class="row header_description">
            <div class="header-left-column">
                <?php reiki_Companion::header_title(); ?>
                <?php reiki_Companion::header_buttons(); ?>
            </div>

             <div class="header-right-column">
                <img class="header-image" data-theme-src="reiki_header_image"  
                    src="<?php echo esc_url(get_theme_mod('reiki_header_image', reiki_Companion::plugin_url() . "templates/images/site-screenshot-medium.png"))?>"  />
            </div>
           
        </div>
    </div>
</div>
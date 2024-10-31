<?php
/*
* Template Name: Front Page Template
*/
?>
<!DOCTYPE html>
<html <?php language_attributes();?>>
  <head>
    <meta charset="<?php bloginfo('charset');?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <?php wp_head();?>
  </head>
  <body <?php body_class();?> >
    <?php reiki_Companion::get_header();?>
    <div class="content">
      <?php the_post();?>
      <div class="page-content">
          <?php echo reiki_Companion::the_content() ?>
      </div>
    </div>
    <?php reiki_Companion::get_footer(); ?>
    
  </body>
</html>
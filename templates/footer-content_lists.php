<div class="footer">
   <div class="row_201">
    <div class="column_209 gridContainer">
     <div class="row_202">
      <div class="column_210" style="">
        <?php echo reiki_Companion::get_widgets_area('reiki_first_box_widgets') ?>
      </div>
      <div class="column_210" style="">
        <?php echo reiki_Companion::get_widgets_area('reiki_second_box_widgets') ?>
      </div>
      <div class="column_210" style="">
         <?php echo reiki_Companion::get_widgets_area('reiki_third_box_widgets') ?>
      </div>
      <div  class="column_213">
        <?php reiki_logo(true); ?>
        <p><?php echo reiki_copyright(); ?></p>
        <div data-theme="reiki_footer_lists_b4_html">
           <?php $reiki_footer_boxes_b4_html =  get_theme_mod("reiki_footer_lists_b4_html",""); 
            if(!empty($reiki_footer_boxes_b4_html)) {
                echo $reiki_footer_boxes_b4_html;
            } else {
            ?>
             <div data-type="group" class="row_205"> 
              <a href="#"><i data-cp-fa="true" class="font-icon-19 fa fa-facebook-f"></i></a>
              <a href="#"><i data-cp-fa="true" class="font-icon-19 fa fa-twitter"></i></a>
              <a href="#"><i data-cp-fa="true" class="font-icon-19 fa fa-google-plus"></i></a>
              <a href="#"><i data-cp-fa="true" class="font-icon-19 fa fa-behance"></i></a>
              <a href="#"><i data-cp-fa="true" class="font-icon-19 fa fa-dribbble"></i></a>
            </div>
           <?php  } ?>
      </div>
      </div>
     </div>
    </div>
   </div>
   </div>
<?php wp_footer();?>
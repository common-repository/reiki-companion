<div class="footer">
   <div class="row_201">
    <div class="column_209 gridContainer">
     <div class="row_202">
      <div class="column_210">
        <i data-cp-fa="true"
          data-theme-fa="reiki_footer_boxes_b1_icon"
          class="font-icon-18 fa <?php reiki_Companion::kses_theme_mod_e('reiki_footer_boxes_b1_icon', 'fa-map-marker')?>">
        </i>

      <p  data-theme="reiki_footer_boxes_b1_text">
        <?php reiki_Companion::kses_theme_mod_e('reiki_footer_boxes_b1_text', 'San Francisco - Adress - 18 California Street 1100.')?>
      </p>
      </div>
      <div class="column_210" style="">
        <i
          data-cp-fa="true"
           data-theme-fa="reiki_footer_boxes_b2_icon"
          class="font-icon-18 fa <?php reiki_Companion::kses_theme_mod_e('reiki_footer_boxes_b2_icon', 'fa-envelope-o')?> ">
        </i>


        <p data-theme="reiki_footer_boxes_b2_text">
        <?php reiki_Companion::kses_theme_mod_e('reiki_footer_boxes_b2_text', 'hello@mycoolsite.com')?>
        </p>
      </div>
      <div class="column_210" style="">
        <i data-cp-fa="true"
           data-theme-fa="reiki_footer_boxes_b3_icon"
           class="font-icon-18 fa  <?php reiki_Companion::kses_theme_mod_e('reiki_footer_boxes_b3_icon', 'fa-phone')?> ">

        </i>
         <p data-theme="reiki_footer_boxes_b3_text">
        <?php reiki_Companion::kses_theme_mod_e('reiki_footer_boxes_b3_text', '+1 (555) 345 234343')?>
        </p>
      </div>
      <div class="column_213">
          <div data-theme="reiki_footer_boxes_b4_html">
             <?php $reiki_footer_boxes_b4_html =  get_theme_mod("reiki_footer_boxes_b4_html",""); 
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
          <p class="paragraph10"><?php echo reiki_copyright();?></p>
      </div>
     </div>
    </div>
   </div>
</div>
<?php wp_footer();?>
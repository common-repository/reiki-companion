<span class="customize-control-title"><?php _e('Insert sections', 'reiki-companion')?></span>

<div class='reiki-needed-container' data-type="activate">
    <div class="description customize-section-description">
        <span><?php _e('This section only works when the Reiki custom front page is activated.','reiki-companion') ?></span>
        <a class="reiki-needed activate available-item-hover-button"><?php _e('Activate Reiki Front Page','reiki-companion') ?></a>
    </div>
</div>

<div class='reiki-needed-container' data-type="select">
    <div class="description customize-section-description">
        <span><?php _e('This section only works when the Reiki custom front page is open in Customizer.','reiki-companion') ?></span>
        <a class="reiki-needed select available-item-hover-button" ><?php _e('Open Reiki Front Page','reiki-companion') ?></a>
    </div>
</div>

<ul id="available_full_rows" class="list sections">
</ul>


<div id="new-section-layout-popup" style="display:none">
    <ul class="layout-type-list">
        <li class="layout-type selected"  title="<?php _e('Full width section', 'reiki-companion');?>" data-type="full"><?php _e('Full Width', 'reiki-companion');?></li>
        <li class="layout-type" data-type="centered" title="Section with content centered"><?php _e('Centered', 'reiki-companion');?></li>
    </ul>
    <ul class="layout-strucuture-list">
        <li class="layout-structure selected" data-type="1" title="<?php _e('Section with one column', 'reiki-companion');?>"></li>
        <li class="layout-structure" data-type="2"  title="<?php _e('Section with two columns', 'reiki-companion');?>"></li>
        <li class="layout-structure" data-type="3"  title="<?php _e('Section with three columns', 'reiki-companion');?>"></li>
        <li class="layout-structure" data-type="4"  title="<?php _e('Section with four columns', 'reiki-companion');?>"></li>
    </ul>
    <div id="cp-items-footer">
        <button type="button" class="button insert-section" id="cp-item-section-ok"><?php _e('Insert Section', 'reiki-companion');?></button>
    </div>
</div>
<div id="new-content-popup" style="display:none">
    <ul class="content-list">
        <li class="content-type" data-type="h1" title="<?php _e('Heading', 'reiki-companion');?>"><p class="title"><?php _e('Heading', 'reiki-companion');?></p></li>
        <li class="content-type selected" data-type="h4" title="<?php _e('Subheading', 'reiki-companion');?>"><p class="title"><?php _e('Subheading', 'reiki-companion');?></p></li>
        <li class="content-type" data-type="p"  title="<?php _e('Paragraph', 'reiki-companion');?>"><p class="title"><?php _e('Paragraph', 'reiki-companion');?></p></li>
        <li class="content-type" data-type="link"  title="<?php _e('Link', 'reiki-companion');?>"><p class="title"><?php _e('Link', 'reiki-companion');?></p></li>
        <li class="content-type" data-type="button"  title="<?php _e('Button', 'reiki-companion');?>"><p class="title"><?php _e('Button', 'reiki-companion');?></p></li>
        <li class="content-type" data-type="img"  title="<?php _e('Image', 'reiki-companion');?>"><p class="title"><?php _e('Image', 'reiki-companion');?></p></li>
    </ul>
    <div id="cp-items-footer">
        <button type="button" class="button insert-content" id="cp-item-content-ok"><?php _e('Insert', 'reiki-companion');?></button>
    </div>
</div>
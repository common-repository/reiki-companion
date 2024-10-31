<div class='reiki-needed-container' data-type="activate">
    <div class="description customize-section-description">
        <span><?php _e('This section only works when the Reiki custom front page is activated', 'reiki-companion');?>.</span>
        <a class="reiki-needed activate available-item-hover-button"><?php _e('Activate Reiki Front Page', 'reiki-companion');?></a>
    </div>
</div>

<div class='reiki-needed-container' data-type="select">
    <div class="description customize-section-description">
        <span><?php _e('This section only works when the Reiki custom front page is open in Customizer', 'reiki-companion');?>.</span>
        <a class="reiki-needed select available-item-hover-button" ><?php _e('Open Reiki Front Page', 'reiki-companion');?></a>
    </div>
</div>

    <!--HIDDEN INTO TO ENABLE THE PANEL SAVE ACTION-->
    <input class="reiki_hidden" <?php
$this->input_attrs();?> value="<?php echo esc_attr(reiki_static_sections( true)); ?>" <?php $this->link();?> />
    <span class="customize-control-title"><?php
echo esc_html($this->label); ?></span>
    <span class="description customize-control-description"><?php
echo $this->description; ?></span>

    <div class="sections-list-reorder" >
        <span class="customize-control-title"><?php _e('Change order', 'reiki-companion');?></span>
        <ul id="page_full_rows" class="list list-order">
        </ul>
        <div class="add-section-container">
            <a class="reiki-add-section available-item-hover-button" ><?php _e('Add Section','reiki-companion') ?></a>
        </div>
    </div>


    <script>
    window.controlID = "<?php echo $this->input_attrs['id'] ?>";
    window.FULL_ROWS = <?php echo json_encode(reiki_get_sections()); ?>;
    </script>

    <script id="toolbar-template" type="script/template">
        <div class="overlay-tooltip-panel fixed-overlay" style="top: -30px; left: 0px; width: 438px; visibility: visible; display: block;">
            <div class="overlay-toolbar" style="width: auto; background-color: rgb(77, 165, 255);">
                <div class="name-group overlay-tooltip-group fixed-overlay" style="background-color: rgb(77, 165, 255);">
                    <div class="parent-node-group options-group overlay-tooltip-group fixed-overlay" style="display: block; background-color: rgb(77, 165, 255);">
                    </div>
                        <a class="tab_showMore text"></a>
                <div class="tab_text"><i class="overlay-toolbar-element-type"></i>  <!--<span class="overlay-toolbar-element-selector">.hero5-content-p2</span>--></div>
            </div>
            <div class="edit-group overlay-tooltip-group fixed-overlay" data-placement="bottom" title="" style="display: block; background-color: rgb(77, 165, 255);" data-original-title="Edit Text">
                <a class="edit-group-img"></a>
            </div>

            <div class="image-group overlay-tooltip-group fixed-overlay" data-placement="bottom" title="" style="display: none; background-color: rgb(77, 165, 255);" data-original-title="Change Image">
                <a class="image-group-img"></a>
            </div>
            <div class="options-group cog overlay-tooltip-group fixed-overlay" style="display: block; background-color: rgb(77, 165, 255);">
                <a class="tab_settings" data-original-title="" title=""></a>
                <div class="overlay-contextual-menu" style="top: 30px; left: 0px; right: auto;">
                      <!-- <span class="cog-item title">List Options</span><span class="cog-item" data-name="reiki_app_more_options">Add item (pro)</span><span class="cog-item" data-name="reiki_app_more_options">Remove item (pro)</span></div></span> -->
                </div>
            </div>
            <div style="clear:both;width:0px"></div>
        </div>
    </div>
    </script>

    <div id="hover-fx-item-editor-templates" style="display:none">
        <ul>
            <li class="customize-control customize-control-text" style="display: list-item;" data-type="text">
                <label>
                    <span class="customize-control-title">{{label}}</span>
                    <input type="text" value="{{value}}" id="{{id}}">
                </label>
            </li>

             <li class="customize-control customize-control-text" style="display: list-item;" data-type="image">
                <label>
                    <span class="customize-control-title">{{label}}</span>

                    <div class="image-wrapper">
                        <img id="{{id}}-preview" src="{{value}}">
                    </div>
                    <div class="image-controls">
                        <input type="text" value="{{value}}" id="{{id}}">
                        <button type="button" class="button upload-button cp-image-select" data-cp-src="{{id}}" ><?php _e('Browse for image', 'reiki-companion');?></button>
                    </div>
                </label>
            </li>
        </ul>
    </div>

    <div id="hover-fx-item-editor" style="display:none">
        <ul id="cp-items">
        </ul>
        <div id="cp-items-footer">
            <button type="button" class="button button-large" id="cp-item-cancel"><?php _e('Cancel', 'reiki-companion');?></button>
            <button type="button" class="button button-large button-primary" id="cp-item-ok"><?php _e('Apply Changes', 'reiki-companion');?></button>
        </div>
    </div>


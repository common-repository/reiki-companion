<div id="loader">
    <div class="cssload-loader">
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
        <div class="cssload-side"></div>
    </div>
</div>
<div class='reiki-needed-container' data-type="activate">
    <div class="description customize-section-description">
        <span><?php _e('This section only works when the Reiki custom front page is activated', 'reiki-companion'); ?>.</span>
        <a class="reiki-needed activate available-item-hover-button"><?php _e('Activate Reiki Front Page', 'reiki-companion'); ?></a>
    </div>
</div>

<div class='reiki-needed-container' data-type="select">
    <div class="description customize-section-description">
        <span><?php _e('This section only works when the Reiki custom front page is open in Customizer', 'reiki-companion'); ?>.</span>
        <a class="reiki-needed select available-item-hover-button" ><?php _e('Open Reiki Front Page', 'reiki-companion'); ?></a>
    </div>
</div>

<!--HIDDEN INTO TO ENABLE THE PANEL SAVE ACTION-->
<input class="reiki_hidden" <?php $this->input_attrs(); ?> value="<?php echo esc_attr(reiki_static_sections(true)); ?>" <?php $this->link(); ?> />
<span class="customize-control-title"><?php echo esc_html($this->label); ?></span>
<span class="description customize-control-description"><?php echo $this->description; ?></span>

<div class="sections-list-reorder" >
    <span class="customize-control-title"><?php _e('Manage page sections', 'reiki-companion'); ?></span>
    <ul id="page_full_rows" class="list list-order">
    </ul>
    <div class="add-section-container">
        <a class="reiki-add-section available-item-hover-button button-primary" ><?php _e('Add Section', 'reiki-companion') ?></a>
    </div>
</div>


<script>
    window.controlID = "<?php echo $this->input_attrs['id'] ?>";
    window.FULL_ROWS = <?php echo json_encode(reiki_get_sections()); ?>;
    window.SITE_URL = "<?php echo site_url(); ?>";
</script>

<script id="toolbar-template" type="script/template">
<div class="overlay-tooltip-panel fixed-overlay">
    <div class="overlay-toolbar">
        <div class="name-group overlay-tooltip-group fixed-overlay">
            <div class="tab_text">
                <i class="overlay-toolbar-element-type">
                </i>
            </div>
        </div>
        <div class="options-group cog overlay-tooltip-group fixed-overlay" >
            <div class="overlay-contextual-menu">
            </div>
        </div>
        <div style="clear:both;width:0px">
        </div>
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
                    <button type="button" attrs="{{attrs}}" class="button upload-button cp-image-select" data-cp-src="{{id}}" ><?php _e('Browse for image', 'reiki-companion'); ?></button>
                </div>
            </label>
        </li>


        <li class="customize-control customize-control-text" style="display: list-item;" data-type="fa">
            <label>
                <span class="customize-control-title">{{label}}</span>

                <div class="image-wrapper">
                    <i id="{{id}}-preview" class="fa {{value}}"></i>
                </div>
                <div class="image-controls">
                    <input type="text" value="{{value}}" id="{{id}}">
                    <button type="button" class="button upload-button cp-fa-select" data-cp-src="{{id}}" ><?php _e('Browse font icon', 'reiki-companion'); ?></button>
                </div>
            </label>
        </li>



        <li class="customize-control customize-control-text" style="display: list-item;" data-type="fa-link">
            <label>
                <span class="customize-control-title">{{label}}</span>

                <div class="image-wrapper">
                    <i id="{{id}}__icon-preview" class="fa {{value.icon}}"></i>
                    <label for="{{id}}__visible">
                        <input id="{{id}}__visible" type="checkbox" {{cb:value.visible}}>
                        <?php _e('Visible', 'reiki-companion'); ?>
                    </label>
                </div>
                <div class="image-controls"> 
                    <div style="float: left;width: calc( 100% - 96px);box-sizing: border-box;" >
                        <span class="customize-control-title">Link</span>
                        <input type="text" value="{{value.link}}" id="{{id}}__link">
                    </div>

                    <div style="float: left;width: 96px;padding-left: 4px;box-sizing: border-box;">    
                        <span class="customize-control-title">Target</span>
                        <select type="text" id="{{id}}__target">
                            <option value="_self">Same tab</option>
                            <option value="_blank">New tab</option>
                        </select>
                        <inside-script style="display:none"> jQuery("#{{id}}__target").val("{{value.target}}") </inside-script>
                    </div>

                    <input type="hidden" value="{{value.icon}}" id="{{id}}__icon">
                    <button type="button" class="button upload-button cp-fa-select" data-cp-src="{{id}}__icon" ><?php _e('Browse font icon', 'reiki-companion'); ?></button>
                </div>
            </label>
        </li>


        <li class="customize-control customize-control-text" style="display: list-item;" data-type="fa-link-group">
            <label>
                <span class="customize-control-title">{{label}}</span>
                <div class="image-wrapper">
                    <i id="{{id}}__icon-preview" class="fa {{value.icon}}"></i>
                </div>
                <div class="image-controls"> 
                     <div style="float: left;width: calc( 100% - 96px);box-sizing: border-box;" >
                        <span class="customize-control-title">Link</span>
                        <input type="text" value="{{value.link}}" id="{{id}}__link">
                    </div>
                   <div style="float: left;width: 96px;padding-left: 4px;box-sizing: border-box;">  
                        <span class="customize-control-title">Target</span>
                        <select type="text" id="{{id}}__target">
                            <option value="_self">Same tab</option>
                            <option value="_blank">New tab</option>
                        </select>
                        <inside-script style="display:none"> jQuery("#{{id}}__target").val("{{value.target}}") </inside-script>
                    </div>
                    
                    <input type="hidden" value="{{value.icon}}" id="{{id}}__icon">
                    <button type="button" class="button upload-button cp-fa-select" data-cp-src="{{id}}__icon" ><?php _e('Browse font icon', 'reiki-companion'); ?></button>
                </div>
            </label>
        </li>


         <li class="customize-control customize-control-text" style="display: list-item;" data-type="link_href">
            <label>
                <div>
                    <span class="customize-control-title">{{label}}</span>
                    <input type="text" value="{{value.link}}" id="{{id}}__link">
                </div>

                <div>  
                    <span class="customize-control-title">Target</span>
                    <select type="text" id="{{id}}__target">
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                    </select>
                    <inside-script style="display:none"> jQuery("#{{id}}__target").val("{{value.target}}") </inside-script>
                </div>
            </label>
        </li>


    </ul>
</div>

<div id="hover-fx-item-editor" style="display:none">
    <ul id="cp-items">
    </ul>
    <div id="cp-items-footer">
        <button type="button" class="button button-large" id="cp-item-cancel"><?php _e('Cancel', 'reiki-companion'); ?></button>
        <button type="button" class="button button-large button-primary" id="cp-item-ok"><?php _e('Apply changes', 'reiki-companion'); ?></button>
    </div>
</div>


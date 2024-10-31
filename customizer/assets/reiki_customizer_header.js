/* global top */

(function(CP_CUSTOMIZER, $, $customizerPanel) {
    var $panel = $customizerPanel.find('[data-name="reiki-customize-header-panel"]');
    var $title = $panel.children('h3');
    $panel.find('.screen-reader-text').remove();
    $panel.add($title).unbind('click');
    $panel.add($title).click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (!CP_CUSTOMIZER.isRightSectionVisible('reiki_webpage_headers')) {
            CP_CUSTOMIZER.showSectionToRight('reiki_webpage_headers');
        }
    });

    var $changeHeader = $panel.find('[data-name="change"]');
    var $settingIcon = $panel.find('[data-name="edit"]');

    $changeHeader.unbind('click').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (CP_CUSTOMIZER.isRightSectionVisible('reiki_webpage_headers')) {
            CP_CUSTOMIZER.hideRightSection();
        } else {
            CP_CUSTOMIZER.showSectionToRight('reiki_webpage_headers');
        }

        $(this).toggleClass('active');

    });

    $settingIcon.unbind('click').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (CP_CUSTOMIZER.isRightSectionVisible('header_image')) {
            CP_CUSTOMIZER.hideRightSection()
        } else {
            CP_CUSTOMIZER.showSectionToRight('header_image');
        }

        $(this).toggleClass('active');
    });


})( top.customizerFrame.CP_CUSTOMIZER,  top.customizerFrame.jQuery,  top.customizerFrame.CP_CUSTOMIZER.getCustomizerRootEl());
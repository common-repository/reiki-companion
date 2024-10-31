/* global top */

(function(CP_CUSTOMIZER, $, $customizerPanel) {
    var $panel = $customizerPanel.find('[data-name="reiki_customize_frontpage_panel"]');
    var $title = $panel.children('h3');


    $panel.find('.screen-reader-text').remove();
    $panel.add($title).unbind('click');
    $panel.add($title).click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    });

    $title.find('.section-icon').remove();



    if (!$panel.find('.reiki-reorder-list').length) {
        var $reorderList = $panel.find('#accordion-section-reiki_webpage_layout_reorder > ul');

        if (!$reorderList.length) {
            $reorderList = $customizerPanel.find('#sub-accordion-section-reiki_webpage_layout_reorder');
        }

        $reorderList.addClass('reiki-reorder-list');
        $panel.append($reorderList);
    }


    var $addHandler = $panel.find('.reiki-add-section');

    $addHandler.unbind('click').click(function(event) {

        event.preventDefault();
        event.stopPropagation();

        if (CP_CUSTOMIZER.isRightSectionVisible('reiki_webpage_layout_insert')) {
            $(this).removeClass('active');
            CP_CUSTOMIZER.hideRightSection();
        } else {
            $(this).addClass('active');
            CP_CUSTOMIZER.showSectionToRight('reiki_webpage_layout_insert');
        }


    });


    var $addPlusSign = $('<span title="Add Section" class="add-section-plus section-icon"></span>');

    $addPlusSign.click(function(event) {
        CP_CUSTOMIZER.showSectionToRight('reiki_webpage_layout_insert');
        $addHandler.addClass('active');
    });

    $title.append($addPlusSign);

})(top.customizerFrame.CP_CUSTOMIZER, top.customizerFrame.jQuery, top.customizerFrame.CP_CUSTOMIZER.getCustomizerRootEl());
/* global top */

(function(CP_CUSTOMIZER, $, $customizerPanel) {
    var $panel = top.customizerFrame.wp.customize.section('reiki_footer').container.eq(0);
    var $title = $panel.children('h3');
    $panel.find('.screen-reader-text').remove();
    $panel.add($title).unbind('click');
    $panel.add($title).click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (!CP_CUSTOMIZER.isRightSectionVisible('reiki_footer_insert')) {
            CP_CUSTOMIZER.showSectionToRight('reiki_footer_insert');
        }
    });

    if ($title.find('[data-name="change"]').length) {
        return;
    }
    $title.append('<span title="Change Footer" data-name="change" class="open-right section-icon"></span>');

    var $changeFooter = $panel.find('[data-name="change"]');
    // var $settingIcon = $panel.find('[data-name="edit"]');

    $changeFooter.unbind('click').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (CP_CUSTOMIZER.isRightSectionVisible('reiki_footer_insert')) {
            CP_CUSTOMIZER.hideRightSection();
        } else {
            CP_CUSTOMIZER.showSectionToRight('reiki_footer_insert');
        }

        $(this).toggleClass('active');

    });

    // $settingIcon.unbind('click').click(function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     event.stopImmediatePropagation();
    //     if (CP_CUSTOMIZER.isRightSectionVisible('reiki_footer_insert')) {
    //         CP_CUSTOMIZER.hideRightSection();
    //     } else {
    //         CP_CUSTOMIZER.showSectionToRight('reiki_footer_insert');
    //     }

    //     $(this).toggleClass('active');
    // });


})(top.customizerFrame.CP_CUSTOMIZER, top.customizerFrame.jQuery, top.customizerFrame.CP_CUSTOMIZER.getCustomizerRootEl());
/* global top */
(function (CP_CUSTOMIZER, $) {
    CP_CUSTOMIZER.bind(CP_CUSTOMIZER.Events.SECTION_ADDED_IN_PANEL, function (event, sectionData, $panelItem) {

        function getSection(columns, isCentered) {
            var nextIndex = $('body .page-content [id^="section-"]').length + 1;
            var $section = $('<div data-index="' + (100 + nextIndex) + '" data-cpid="new" class="custom-section" data-label="Section ' + nextIndex + '" id="section-' + nextIndex + '" />');

            $section.append('<div data-cpid="new"  class="main_column ' + (isCentered ? "gridContainer" : "") + '"><div data-type="row" class="custom-section-row" ></div></div>');

            var colsWidth = 12 / columns;

            for (var i = 0; i < columns; i++) {
                $section.find('[data-type="row"]').append("<div data-cpid='new' class='cp" + colsWidth + "cols custom-section-column' >" +
                        '   <h4 data-cpid="new" data-content-editable="true" contenteditable="true">ON CANVAS TEXT EDITING</h4>' +
                        '   <p data-cpid="new" data-content-editable="true" contenteditable="true">Editing the text and images in your page has never been easier. Just click any text or image and change it. Its that easy!</p>' +
                        "</div>");
            }

            return $section;
        }

        $panelItem.find('.available-item-hover-button').on('click', function () {
            event.stopPropagation();
            event.preventDefault();

            var $popup = CP_CUSTOMIZER.tb_show('Select Section Layout', 'new-section-layout-popup', {
                "width": "500",
                "height": "250"
            });

            $popup.find("li").unbind('click').bind('click.popup',function (event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');
            });

            $popup.find("button").unbind('click').click(function () {
                var layoutType = $popup.find(".layout-type.selected").data("type");
                var layoutColumns = parseInt($popup.find(".layout-structure.selected").data("type"));
                var contentToAdd = getSection(layoutColumns, layoutType === "centered");
                CP_CUSTOMIZER.insertContent(contentToAdd, sectionData, 'body .page-content');
                parent.tb_remove();
                CP_CUSTOMIZER.focusElement(contentToAdd, 800);
            });
        });
    });
})( top.customizerFrame.CP_CUSTOMIZER, jQuery);
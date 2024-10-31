/* global top */

(function(root, CP_CUSTOMIZER, $) {

    CP_CUSTOMIZER.registerCogOptions('section', {
        'title': function(node) {
            var label = $(node).attr('data-label') ? $(node).attr('data-label') + " [" + root.REIKI_TEXTS.section + "]" : root.REIKI_TEXTS.section.toUpperCase();
            return label;
        },
        'toolbarTitle': function(node) {
            var label = $(node).attr('data-label') ? $(node).attr('data-label') + " [" + root.REIKI_TEXTS.section + "]" : root.REIKI_TEXTS.section.toUpperCase();
            return label;
        },
        toolbar_binds: {
            hover: [
                function(event, overlay) {

                    // layout toggle
                    var $changerItem = overlay.find('[data-name="section_layout_width_changer"]');
                    if ($(this).children().is('.gridContainer')) {
                        $changerItem.text(root.REIKI_TEXTS.make_full_width);
                        $changerItem.data('toMake', 'full');
                    } else {
                        $changerItem.text(root.REIKI_TEXTS.make_centered);
                        $changerItem.data('toMake', 'centered');
                    }
                },
                function() {}
            ]
        },
        'items': [{
            'name': 'section_layout_width_changer',
            'title': root.REIKI_TEXTS.make_full_width,
            'on_click': function(node) {
                var toMake = $(this).data().toMake;
                switch (toMake) {
                    case 'centered':
                        $(node).children().addClass('gridContainer');
                        break;
                    case 'full':
                        $(node).children().removeClass('gridContainer');
                        break;
                }
                $(this).trigger('reiki.update_overlays');
               $(this).closest('.overlay-toolbar').trigger('mouseover');
                
                root.customizerFrame.CP_CUSTOMIZER.markSave();
            }
        }, {
            'name': 'section_color_changer',
            'title': root.REIKI_TEXTS.change_background,
            'classes': 'subitems-arrow',
            'on_hover': [function() {
                var $subitemsContainer = $(this).children('.cog-subitems').length ? $(this).children('.cog-subitems') : $("<div class='cog-subitems' />");
                $brush = getColorComponent();

                $subitemsContainer.empty();
                $subitemsContainer.appendTo($(this));

                $subitemsContainer.append($brush);
                $brush.data('update')();
            }, function() {
                console.log('hover out');
            }]

        }]
    });


    function getColorComponent() {
        if ($('#cp-spectrum-keeper').length) {
            return $('#cp-spectrum-keeper');
        }

        var $template = $(
            '   <div id="cp-spectrum-picker" class="picker">' +
            '       <div class="bg-picker">' +
            '            <h5 class="legend">' + root.REIKI_TEXTS.background_color + '</h5>' +
            '           <input name="color" type="text" />' +
            '       </div>');
        /*+
                    '       <div class="bg-picker">' +
                    '           <h5 class="legend">' + root.REIKI_TEXTS.background_image + '</h5>' +
                    '           <button type="button" name="addImage" class="reiki-bg-button reiki-button" tabindex="0">' + root.REIKI_TEXTS.choose + '</button>' +
                    '           <button type="button" name="coverImage" class="reiki-bg-button reiki-button" tabindex="0">' + root.REIKI_TEXTS.cover + '</button>' +
                    '           <button type="button" name="removeImage" class="reiki-bg-button reiki-button red" tabindex="0">' + root.REIKI_TEXTS.remove + '</button>' +
                    '       </div>' +
                    '   </div>');*/


        var colorPallete = [ /*'transparent',*/ '#ffffff', '#f6f6f6' /*, '#ff7f66', '#3F464C'*/ ];
        $template.find('[name=color]').spectrum({
            flat: true,
            preferredFormat: "hex",
            showPaletteOnly: true,
            // showPalette: true,
            // hideAfterPaletteSelect: false,
            // clickoutFiresChange: true,
            color: '#ffffff',
            palette: [colorPallete],
            move: function(color) {
                if (!color) {
                    return;
                }
                var node = jQuery(this).closest('.node-overlay').data().node;
                $(this).find('[name=color]').spectrum("set", color.toString());
                jQuery(node).css('background-color', color.toString());
                $(this).closest('.cog.active').removeClass('active');
                CP_CUSTOMIZER.markSave();
            },
            change: function(color) {
                if (!color || !jQuery(this).closest('.node-overlay').data()) {
                    return;
                }
                $(this).find('[name=color]').spectrum("set", color.toString());
                var node = jQuery(this).closest('.node-overlay').data().node;
                jQuery(node).css('background-color', color.toString());
                $(this).closest('.cog.active').removeClass('active'); 
                CP_CUSTOMIZER.markSave();
            }
        });

        $template.find('[name="addImage"]').click(function(event) {
            var node = jQuery(this).closest('.node-overlay').data().node;
            CP_CUSTOMIZER.openImageManager(function(image) {
                jQuery(node).css('background-image', "url(" + image + ")");
                CP_CUSTOMIZER.markSave();
            });
        });


        $template.find('[name="removeImage"]').click(function(event) {
            var node = jQuery(this).closest('.node-overlay').data().node;
            jQuery(node).css('background-image', "none");
            CP_CUSTOMIZER.markSave();
        });


        $template.find('[name="coverImage"]').click(function(event) {
            var node = jQuery(this).closest('.node-overlay').data().node;

            if (jQuery(this).hasClass('active')) {
                jQuery(node).css('background-size', "auto");
                jQuery(node).css('background-repeat', "repeat");
            } else {
                jQuery(node).css('background-size', "cover");
                jQuery(node).css('background-repeat', "no-repeat");
            }
            CP_CUSTOMIZER.markSave();
            jQuery(this).toggleClass('active');
        });

        function update() {

            var node = jQuery(this).closest('.node-overlay').data().node;

            var backgroundColor = "#" + tinycolor(jQuery(node).css('background-color')).toHex();

            if (colorPallete.indexOf(backgroundColor) !== -1) {
                $(this).closest('.cog-subitems').removeClass('disabled');
                $(this).find('[name=color]').spectrum("set", jQuery(node).css('background-color'));

            } else {
                $(this).closest('.cog-subitems').addClass('disabled');
                var $reason = $(this).closest('.cog-subitems').children('p.disable-reason');

                if ($reason.length === 0) {
                    $reason = $("<p class='disable-reason'>This section has a custom background color</p>");
                    $(this).closest('.cog-subitems').prepend($reason);
                }

            }

            // if (jQuery(node).css('background-size') && jQuery(node).css('background-size') === "cover") {
            //     $template.find('[name="coverImage"]').addClass('active');
            // } else {
            //     $template.find('[name="coverImage"]').removeClass('active');
            // }


        }

        $template.data('update', update.bind($template));
        return $template;
    }


    function addSectionOverlay($nodes) {

        $nodes.addFixedOverlay({
            types: ["section", "list"],
            "classes": ['section-overlay']
        });

        // $nodes.each(function(index, el) {
        //     var $node = $(el);
        //     var $overlay = $node.data().overlay;
        //     var $optionsGroup = $overlay.find('.overlay-toolbar');
        //     var $brush = getColorComponent();
        //     $brush.insertBefore($optionsGroup.find('.cog'));
        // });
    }

    CP_CUSTOMIZER.bind(CP_CUSTOMIZER.Events.ADD_FIXED_OVERLAYS, function(event, $startNode) {


        addSectionOverlay($startNode.find('[data-label]'));

        if ($startNode.is('[data-label]')) {
            addSectionOverlay($startNode);
        }

    });

})(top.customizerFrame, top.customizerFrame.CP_CUSTOMIZER, jQuery);
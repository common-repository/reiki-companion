/* global top */
(function(CP_CUSTOMIZER, $) {

    var NEW_CONTENT = {
        'link': {
            icon: 'fa-link',
            data: '<a data-cpid="new" data-container-editable="true" data-content-code-editable href="#">new link</a>'
        },
        'button': {
            icon: 'fa-external-link-square',
            data: '<a data-cpid="new" data-container-editable="true" data-content-code-editable class="button" href="#">new button</a>'
        },
        'heading': {
            icon: 'fa-header',
            items: function() {
                var result = {};
                for (var i = 1; i <= 6; i++) {
                    result['h' + i] = {
                        label: "H" + i,
                        data: '<h' + i + '>Heading ' + i + '</h' + i + '>',
                        toolip: "Heading " + i
                    };
                }

                return result;
            }
        },

        'paragraph': {
            icon: 'fa-align-left',
            data: '<p data-cpid="new" data-content-editable="true" contenteditable="true">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
        },

        'image': {
            icon: 'fa-picture-o',
            data: '<img data-cpid="new" class="custom-image" data-content-code-editable="true" data-content-editable="true" contenteditable="true" src="#"/>'
        }
    };

    function getData(type) {
        types = type.split('.');
        var start = NEW_CONTENT,
            content;

        for (var i = 0; i < types.length; i++) {
            var _type = types[i];

            if (i + 1 < types.length) {
                var _items = start[_type].items;
                if (_(_items).isFunction()) {
                    _items = _items.call();

                }
                start = _items;
            } else {
                return start[_type].data;
            }
        }

    }

    function insert_new_content(type, $container, index,after) {
        $new = $(getData(type));
        top.customizerFrame.CP_CUSTOMIZER.insertNode($new, $container, index);
        setTimeout(function() {
            $new.trigger('click');
            if(_(after).isFunction()){
                after($new);
            }
        }, 100);
    }


    function get_content_items(data, subitems, parentId) {
        subitems = subitems || false;
        var $result = $("<div />");

        $.each(data, function(id, option) {
            var title = option.toolip || id;
            var idAttr = parentId ? parentId + "." + id : id;
            var _item = $('<i class="fa ' + (option.icon || "") + '" title="' + title + '" data-' + (option.items ? "parent" : "content") + '-id="' + idAttr + '"></i>');

            if (option.label) {
                _item.append('<span class="item-label">' + option.label + '</span>');
            }

            if (option.items) {

                var _items = option.items;

                if (_(_items).isFunction()) {
                    _items = option.items.call();
                }

                var subitemsContainer = $('<div class="subitems-container" />');
                subitemsContainer.append(get_content_items(_items, true, idAttr));
                _item.append(subitemsContainer);
            }

            $result.append(_item);
        });

        return $result.html();

    }


    function add_content_items_to($container) {
        $container.append(get_content_items(NEW_CONTENT));

        $container.off('click.cp-new-content').on('click.cp-new-content', 'i.fa[data-content-id]', function(event) {
            event.preventDefault();
            event.stopPropagation();

            var node_type = $(this).data('content-id');
            $container.trigger('cp-insert-content-item', [node_type, insert_new_content]);
        });

        $container.off('click.cp-new-parent').on('click.cp-new-parent', 'i.fa[data-parent-id]', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).toggleClass('expanded');
        });
    }

    CP_CUSTOMIZER.add_content_items_to = add_content_items_to;

})(top.customizerFrame.CP_CUSTOMIZER, jQuery);
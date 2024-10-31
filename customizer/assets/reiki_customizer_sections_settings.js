/* global parent _ */

(function(root, $, reikiCustomizer) {

    function getTitleElement(name, node, category) {
        var label = "";
        if (typeof name === "function") {
            label = name(node);
        } else {
            label = name;
        }

        return "<span data-category=\"" + category + "\" class=\"cog-item title\">" + label + "</span>";
    }

    function getButtonElement(itemData, node, category) {
        var template = '<span data-category="' + category + '" class="cog-item ' + (itemData.classes || "") + '"></span>';

        var $button = $(template).attr({
            'data-name': (itemData.name || 'button')
        });
        $button.text(itemData.title || 'Button');


        // key is event handler
        $.each(itemData, function(key, data) {
            if (key === 'on_hover') {
                var callbackIn = function() {
                    data[0].call($button, node);
                };
                var callbackOut = function() {

                    data[1].call($button, node);
                };
                $button.hover(callbackIn, callbackOut);

            } else if (key.indexOf('on_') === 0) {
                var ev = key.replace('on_', '');
                var callback = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    data.call($button, node);
                };
                $button.bind(ev, callback);
            }
        });

        return $button;
    }

    function getItemsElements(itemsArray, node, category) {
        result = [];
        for (var i = 0; i < itemsArray.length; i++) {
            var itemData = itemsArray[i];
            var $item = getButtonElement(itemData, node, category);
            result.push($item);
        }
        return result;
    }

    var unwrapComment = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;

    function getFunctionCommentTemplate(fn) {
        return typeof fn === 'function' ? unwrapComment.exec(fn.toString())[1] : fn;
    }

    function getWPLocation() {
        return parent.location.toString().split('wp-admin').shift();
    }


    reikiCustomizer.cogOptions = {
        'list': {
            'nodeOverrider': function(node) {
                return jQuery(node).is('[data-type="row"]') ? jQuery(node).is('[data-type="row"]') : jQuery(node).find('[data-type="row"]').eq(0);
            },
            'title': function(node) {
                var label = jQuery(node).closest('[data-label]').length ? jQuery(node).closest('[data-label]').attr('data-label') + " [" + root.REIKI_TEXTS.list + "]" : "List";
                return label;
            },
            'toolbarTitle': function(node) {
                var label = jQuery(node).closest('[data-label]').length ? jQuery(node).closest('[data-label]').attr('data-label') + " [" + root.REIKI_TEXTS.list + "]" : "List";
                return label;
            },
            toolbar_binds: {
                hover: [
                    function(event, overlay) {
                        if ($(this).find('[data-type="row"]').length || $(this).is('[data-type="row"]')) {
                            overlay.find('[data-category="list"]').show();
                           
                            if($(overlay.data('node')).find('[data-type="row"]').is('[data-content-shortcode]')){
                                overlay.find('[data-name="row_add_item"]').hide();
                            } else {
                                overlay.find('[data-name="row_add_item"]').show();

                            }
                        } else {
                            overlay.find('[data-category="list"]').hide();
                        }


                    },
                    function(event, overlay) {}
                ]
            },
            'items': [{
                'name': 'row_add_item',
                'title': root.REIKI_TEXTS.add_item,
                'on_click': function(node) {
                    var content = getFunctionCommentTemplate(newColumnContent);
                    var $content;
                    if (!$(node).children().length) {
                        content = content.split("@@ROOT@@").join(getWPLocation());
                        $content = $(content);
                    } else {
                        $content = $(node).children('div').first().clone(false, false);
                        $content.find('[data-cpid]').each(function(index, el) {
                            $(this).removeAttr('data-cpid');
                        });

                        $content.attr('data-cpid', 'new');
                    }


                    root.CP_CUSTOMIZER.cleanNode($content);
                    root.CP_CUSTOMIZER.appendToNode($(node), $content);
                }
            }, {
                'name': 'cloumns_per_row',
                'title': root.REIKI_TEXTS.cols_per_row,
                'classes': 'subitems-arrow',
                'on_hover': [function(node) {
                    var $subitemsContainer = $(this).children('.cog-subitems').length ? $(this).children('.cog-subitems') : $("<div class='cog-subitems' />");
                    $subitemsContainer.empty();
                    var cols = [1, 2, 3, 4, 6, 12];
                    for (var i = 0; i < cols.length; i++) {
                        var colNr = cols[i];
                        var itemData = {
                            'title': colNr + (colNr > 1 ? " " + root.REIKI_TEXTS.columns : " " + root.REIKI_TEXTS.column),
                            'name': colNr + "_columns",
                            'on_click': function(node) {

                                var columns = this.data('name').replace('_columns', '');
                                columns = parseInt(columns);
                                columns = parseInt(12 / columns);

                                
                                if(node.is('[data-dynamic-columns]')){
                                    var setting = node.attr('data-dynamic-columns');
                                    root.wp.customize(setting).set(columns);
                                    return;
                                }

                                root.CP_CUSTOMIZER.markSave();
                                var _class = "cp" + columns + 'cols';
                                $(node).children().each(function(index, el) {
                                    var $col = $(el);
                                    var _classAttr = $col.attr('class');
                                    // remove existing cols:
                                    _classAttr = _classAttr.replace(/cp[0-9]+cols/, "").trim();

                                    // add new class
                                    _classAttr += " " + _class;
                                    $col.attr('class', _classAttr);


                                });


                                // wait for animations
                                _.delay(root.CP_CUSTOMIZER.updateAllOverlays, 600);
                            }
                        };

                        var $button = getButtonElement(itemData, node);
                        $subitemsContainer.append($button);
                    }

                    $subitemsContainer.appendTo($(this));
                }, function() {}]
            }]
        },
        'column': {
            'title': root.REIKI_TEXTS.list_item,
            'toolbarTitle': root.REIKI_TEXTS.list_item,
            'node_binds': {
                'hover': [function() {
                    jQuery(this).data().overlay.removeClass('hide');
                }, function() {
                    jQuery(this).data().overlay.addClass('hide');
                }]
            },
            'items': [{
                'name': 'row_remove_item',
                'title': root.REIKI_TEXTS.remove_item,
                'on_click': function(node) {
                    var $overlay = $($(node).data('overlay'));
                    if ($overlay.data('node-observer')) {
                        $overlay.data('node-observer').disconnect();
                    }

                    $overlay.remove();
                    $(node).remove();
                    $(this).trigger('reiki.update_overlays');
                    root.CP_CUSTOMIZER.markSave();
                }
            }]

        }
    };




    reikiCustomizer.cogOptions.addCogItems = function($container, type, node, callback) {
        var typeOptions = reikiCustomizer.cogOptions[type],$toAppend;

        var _node = (typeOptions.nodeOverrider || _.identity)(node);
        for (var key in typeOptions) {
            if (typeOptions.hasOwnProperty(key)) {
                switch (key) {
                    case 'title':
                         $toAppend = getTitleElement(typeOptions[key], _node, type);
                        $container.append($toAppend);
                        break;
                    case 'items':
                         $toAppend = getItemsElements(typeOptions[key], _node, type);
                        $container.append($toAppend);
                        break;
                    case 'node_binds':
                        var nodeBinds = typeOptions[key];
                        jQuery.each(nodeBinds, function(bind, callbacks) {
                            if (bind === "hover") {
                                _node.hover(
                                    function(event) {
                                        callbacks[0].bind(this)(event, jQuery(this).data().overlay);
                                    },
                                    function(event) {
                                        var isNodeRelated = jQuery(this).data().overlay.find("*").andSelf().is(event.relatedTarget);
                                        if (isNodeRelated) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            return false;
                                        }

                                        callbacks[1].bind(this)(event, jQuery(this).data().overlay);
                                    }
                                );
                            } else {
                                _node.bind(bind, callbacks);
                            }
                        });
                        break;
                    case 'toolbar_binds':
                        var toolbarBinds = typeOptions[key];
                        var overlay = jQuery(node).data().overlay;
                        jQuery.each(toolbarBinds, function(bind, callbacks) {
                            if (bind === "hover") {
                                overlay.find('.overlay-toolbar').hover(
                                    function(event) {
                                        callbacks[0].bind(node)(event, overlay);
                                    },
                                    function(event) {
                                        callbacks[1].bind(node)(event, overlay);
                                    }
                                );
                            } else {
                                overlay.bind(bind, callbacks);
                            }
                        });
                        break;
                }
            }
        }

        if (callback) {
            callback(typeOptions);
        }

    };




    // templates
    function newColumnContent() {
        /*
         <div data-cpid="new" class="column_28" reveal-fx="RevealFX115" data-scrollreveal="RevealFX115">
         <img width="184" height="174" src="@@ROOT@@/wp-content/themes/reiki-dragdrop/images/icon1.png" data-content-code-editable="true" data-content-editable="true" contenteditable="true">
         <h4 data-content-code-editable="true" data-content-editable="true" contenteditable="true">ON CANVAS TEXT EDITING</h4>
         <p class="small_text1" data-content-code-editable="true" data-content-editable="true" contenteditable="true">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
         </div>
         */
    }

})(top.customizerFrame, jQuery, (top.customizerFrame.reikiCustomizer || (top.customizerFrame.reikiCustomizer = {})));
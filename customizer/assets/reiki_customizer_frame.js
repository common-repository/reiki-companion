/* global top, _, rows */

if (window.location.toString().match(/\/customize\.php/)) {
    if (!top.customizerFrame || !top.customizerFrame.parent) {
        top.customizerFrame = window;

        // stop mutation observer ( takes to much to load content)
        // if (window.wp.customize.mutationObserver) {
        //     window.wp.customize.mutationObserver.disconnect();
        // }

        // if (window.wp.customize) {
        //     window.wp.customize.addLinkPreviewing = window.wp.customize.prepareLinkPreview = function() {};
        // }
    }


    if (!Element.prototype.scrollIntoViewIfNeeded) {
        Element.prototype.scrollIntoViewIfNeeded = function(centerIfNeeded) {
            centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

            var parent = this.parentNode,
                parentComputedStyle = window.getComputedStyle(parent, null),
                parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
                parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
                overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
                overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
                overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
                overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
                alignWithTop = overTop && !overBottom;

            if ((overTop || overBottom) && centerIfNeeded) {
                parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
            }

            if ((overLeft || overRight) && centerIfNeeded) {
                parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
            }

            if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
                this.scrollIntoView(alignWithTop);
            }
        };
    }
}

if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
    HTMLCollection.prototype.forEach = Array.prototype.forEach; // Because of https://bugzilla.mozilla.org/show_bug.cgi?id=14869
}
(function($, reikiCustomizer, root) {
    root.CP_CUSTOMIZER = root.CP_CUSTOMIZER || {};
    root.CP_CUSTOMIZER.FULL_ROWS = root.FULL_ROWS;
    root.CP_CUSTOMIZER.SITE_URL = root.SITE_URL;
    root.CP_CUSTOMIZER.getSlug = top.customizerFrame.getSlug;
    root.REIKI_TEXTS = window.cpReikiTexts;
    root.CP_CUSTOMIZER.Events = {
        "ADD_FIXED_OVERLAYS": "ADD_FIXED_OVERLAYS",
        "SECTION_ADDED_IN_PANEL": "SECTION_ADDED_IN_PANEL"
    };

    root.customizerWindow = false;

    $.fn.tagName = function() {
        if (!this[0])
            return null;
        if (this[0] && this[0].nodeName) {
            return this[0].nodeName.toLowerCase();
        }
        return null;
    };

    root.CP_CUSTOMIZER.bind = function(event, callback) {
        $(window).bind('cp_customizer.' + event, callback);
    };

    root.CP_CUSTOMIZER.trigger = function(event, data) {
        $(window).trigger('cp_customizer.' + event, data);
    };


    var _modules = {};

    root.CP_CUSTOMIZER.addModule = function(name, callback) {
        if (!_modules.hasOwnProperty(name)) {
            _modules[name] = callback;
            callback.call(this, jQuery);
        }
    };

    root.CP_CUSTOMIZER.tb_show = function(title, elementID, data) {
        var selector = "#TB_inline?inlineId=" + elementID;
        var query = [];
        $.each(data || {}, function(key, value) {
            query.push(key + "=" + value);
        });

        selector = query.length ? selector + "&" : selector + "";
        selector += query.join("&");

        root.tb_show(title, selector);

        root.jQuery('#TB_window').css({
            'z-index': '5000001',
            'transform': 'opacity .4s',
            'opacity': 0
        });

        root.jQuery('#TB_overlay').css({
            'z-index': '5000000'
        });


        setTimeout(function() {
            root.jQuery('#TB_window').css({
                'margin-top': -1 * ((root.jQuery('#TB_window').outerHeight() + 50) / 2),
                'opacity': 1
            });
            root.jQuery('#TB_window').find('#cp-item-ok').focus();
        }, 0);

        return root.jQuery('#TB_window');
    };

    root.CP_CUSTOMIZER.registerCogOptions = function(name, cogOptions) {
        if (!reikiCustomizer.cogOptions.hasOwnProperty(name)) {
            reikiCustomizer.cogOptions[name] = cogOptions;
        } else {
            console.error("Cog options name '" + name + "' already exists");
        }
    };

    root.CP_CUSTOMIZER.alert = function(message, title, footer) {
        if (!root.jQuery.find('#reiki-alert').length) {
            root.jQuery(root.jQuery.find('body')).append('<div id="reiki-alert"><h3></h3><p></p> <div id="cp-items-footer"><button type="button" class="button full-width" id="cp-item-ok">OK</button></div></div>');
        }

        message = message || "Alert Message";
        title = title || "";

        root.jQuery.find('#reiki-alert h3')[0].innerText = title;
        root.jQuery.find('#reiki-alert p')[0].innerHTML = message;

        if (footer === true) {
            jQuery(root.jQuery.find('#reiki-alert [id="cp-items-footer"]')).css('display', 'block');
        } else {
            jQuery(root.jQuery.find('#reiki-alert [id="cp-items-footer"]')).css('display', 'none');
        }


        root.jQuery(root.jQuery.find('#reiki-alert [id="cp-item-ok"]')).unbind('click.cp_alert').bind('click.cp_alert', function(event) {
            root.tb_remove();

            root.jQuery('#TB_overlay').css({
                'z-index': '-1'
            });
        });

        root.CP_CUSTOMIZER.tb_show(title, '#TB_inline?width=400&height=150&inlineId=reiki-alert');

        root.jQuery('#TB_window').css({
            'z-index': '5000001'
        });

        root.jQuery('#TB_overlay').css({
            'z-index': '5000000'
        });
    };

    root.CP_CUSTOMIZER.getRootNode = function() {
        return $('.page-content');
    };

    root.CP_CUSTOMIZER.getThemeMods = function() {
        return $('[data-theme], [data-theme-src], [data-theme-fa]');
    };

    root.CP_CUSTOMIZER.getContentNodes = function(filter) {
        var nodes = root.CP_CUSTOMIZER.getRootNode().children().toArray();

        nodes.html = function() {
            return this.map(function(node) {
                return node.outerHTML;
            }).join('');
        };

        return nodes;
    };

    root.CP_CUSTOMIZER.getContent = function() {

        var nodesHML = root.CP_CUSTOMIZER.getContentNodes().html();
        var $currentNodes = $('<div/>').append(nodesHML);

        $currentNodes.find('.reiki-customizer-ordering-overlay').remove();

        // cleanup inline styling, leaveing only background properties
        $currentNodes[0].querySelectorAll('[style]').forEach(function(el) {
            var style = el.getAttribute('style');
            var backgroundRegex = /(background([^:]*))/ig;
            var backgroundProps = style.match(backgroundRegex) || [];
            var inlineCss = "";

            for (var i = 0; i < backgroundProps.length; i++) {
                inlineCss += backgroundProps[i] + ":" + el.style[backgroundProps[i]];
            }

            if (inlineCss.length) {
                el.setAttribute('style', inlineCss);
            } else {
                el.removeAttribute('style');
            }
        });


        $currentNodes[0].querySelectorAll('[data-content-shortcode]').forEach(function(el) {
            el.innerHTML = '[' + el.getAttribute('data-content-shortcode') + ']';
        });


        $currentNodes[0].querySelectorAll('[data-attr-shortcode]').forEach(function(el) {
            var attr = el.getAttribute('data-attr-shortcode');
            var parts = attr.split(',');

            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                part = part.split(':');
                el.setAttribute(part[0].trim(), '[' + part[1].trim() + ']');
            }
        });


        root.CP_CUSTOMIZER.cleanNode($currentNodes);

        $currentNodes[0].querySelectorAll('*').forEach(function(el) {
            var attributes = el.attributes;
            for (var i = 0; i < attributes.length; i++) {
                var attrName = attributes.item(i).name;
                if (attrName.match(/scrollreveal/)) {
                    el.removeAttribute(attrName);
                }
            }
        });

        return $currentNodes.html().replace(/data-cpid="[^"]+"/gi, '');


    };

    root.CP_CUSTOMIZER.cleanNode = function($node) {

        $node[0].querySelectorAll('[data-content-editable], [data-content-code-editable], [data-container-editable]').forEach(function(el) {
            el.removeAttribute('data-content-editable');
            el.removeAttribute('data-content-code-editable');
            el.removeAttribute('data-container-editable');
            el.removeAttribute('contenteditable');
        });

        $node[0].querySelectorAll('.ui-sortable,.ui-sortable-disabled,.ui-sortable-handle').forEach(function(el) {
            el.classList.remove('ui-sortable');
            el.classList.remove('ui-sortable-disabled');
            el.classList.remove('ui-sortable-handle');
        });


        $node[0].classList.remove('ui-sortable');
        $node[0].classList.remove('ui-sortable-disabled');
        $node[0].classList.remove('ui-sortable-handle');

        return $node;
    };

    root.CP_CUSTOMIZER.bindLiveUpdate = function(controlID, callback) {
        wp.customize(controlID, function(value) {
            value.bind(function(to) {
                callback(to);
            });
        });
    };

    function openImageManager(callback, multi) {
        openMultiImageManager('Image Manager', function(obj) {
            if ($('iframe').length) {
                $('iframe').get(0).focus();
            }
            if (!obj) {
                return;
            }
            for (var i = 0; i < obj.length; i++) {
                var link = obj[i].url;
                callback(link);
            }
        }, !multi);
    }
    root.CP_CUSTOMIZER.openImageManager = openImageManager;


    root.CP_CUSTOMIZER.openCropableImageManager = function(width, height, callback) {
        var control = new root.wp.customize.CroppedImageControl('custom_image_cropper[' + Date.now() + ']');

        control.params = {
            button_labels: {
                frame_title: "Select Image"
            },
            height: height,
            width: width
        };

        // control.openFrame = function() {
        control.initFrame();

        control.frame.setState('library').open();

        control.frame.content.mode('browse');
        // };

        function fixCropKeyPressBug() {
            setTimeout(function() {
                root.jQuery(top.document).unbind(root.jQuery.imgAreaSelect.keyPress);
            }, 100)
        }

        control.setImageFromAttachment = function(attachment) {
            callback([attachment]);
            fixCropKeyPressBug();            
        };

        control.frame.on('close', function() {
            fixCropKeyPressBug();
        });


        root.jQuery(control.frame.views.selector).parent().css({
            'z-index': '16000000'
        });

        root.jQuery(control.frame.views.selector).find('.instructions').remove();

        
    };

    function openMultiImageManager(title, callback, single) {
        var node = false;
        var interestWindow = window.parent;
        custom_uploader = interestWindow.wp.media.frames.file_frame = interestWindow.wp.media({
            title: title,
            button: {
                text: 'Choose Images'
            },
            multiple: !single
        });
        //When a file is selected, grab the URL and set it as the text field's value
        custom_uploader.on('select', function() {
            attachment = custom_uploader.state().get('selection').toJSON();
            callback(attachment);
        });
        custom_uploader.off('close.cp').on('close.cp', function() {
            callback(false);
        });
        //Open the uploader dialog
        custom_uploader.open();

        custom_uploader.content.mode('browse');
        // Show Dialog over layouts frame
        interestWindow.jQuery(interestWindow.wp.media.frame.views.selector).parent().css({
            'z-index': '16000000'
        });
    }

    function openFAManager(title, callback, single) {
        var node = false;
        var interestWindow = root;

        // if (!interestWindow.wp.media.cp.FAFrame) {
        var frame = interestWindow.wp.media.cp.extendFrameWithFA(interestWindow.wp.media.view.MediaFrame.Select);
        custom_uploader = new frame({
            title: title,
            button: {
                text: 'Choose Icon'
            },
            multiple: !single
        });
        interestWindow.wp.media.cp.FAFrame = custom_uploader;

        // }


        //When a file is selected, grab the URL and set it as the text field's value
        interestWindow.wp.media.cp.FAFrame.on('select', function() {
            attachment = custom_uploader.state().get('selection').toJSON();
            interestWindow.wp.media.cp.FAFrame.content.mode('browse');
            callback(attachment);
        });
        interestWindow.wp.media.cp.FAFrame.on('close', function() {
            interestWindow.wp.media.cp.FAFrame.content.mode('browse');
            callback(false);
        });

        //Open the uploader dialog
        interestWindow.wp.media.cp.FAFrame.open();
        interestWindow.wp.media.cp.FAFrame.content.mode('cp_font_awesome');
        // Show Dialog over layouts frame
        interestWindow.jQuery(custom_uploader.views.selector).parent().css({
            'z-index': '16000000'
        });


    }
    root.CP_CUSTOMIZER.openMultiImageManager = openMultiImageManager;

    function showPreview($item) {
        $preview = root.jQuery('#reiki_section_preview');
        if (!$preview.length) {
            root.jQuery('body').append('<div id="reiki_section_preview"></div>');
            $preview = root.jQuery('#reiki_section_preview');
        }
        var bounds = $item[0].getBoundingClientRect();
        var scrollTop = 0; //window.pageYOffset;
        var scrollLeft = 0; //window.pageXOffset;
        $preview.css({
            left: (parseInt(bounds.right) + 10 + scrollLeft) + "px",
            top: (parseInt(bounds.top) + scrollTop) + "px",
            'background-image': 'url("' + $item.data('item').preview + '?reiki-companion=v1")'
        });
        $preview.show();
    }

    function hidePreview() {
        $preview = root.jQuery('#reiki_section_preview');
        $preview.hide();
    }


    var rowListItemTemplate = _.template(
        `<li class="full_row item" data-id="<%= sectionID %>">
                <div class="reorder-handler"></div>
               
                <div class="label-wrapper">
                    <input class="item-label" value="<%= label %>" />
                    <div class="anchor-info">
                        #<%= id.replace(/#/,'') %>
                    </div>
                </div>

                <div class="item-hover">
                    <span title="Delete section from page" class="item-remove"></span>

                    <% if(setting) { %>
                        <span title="Edit section settings" data-setting="<%= setting %>" class="item-settings"></span>
                    <%  } %>
                    <span title="Toggle visibility in primary menu" class="item-menu-visible <%= (inMenu?'active':'') %>"></span>
                </div>
          </li>
        `
    );

    root.CP_CUSTOMIZER.getRowListItem = function($node) {
        var label = $node.attr('data-label') || $node.attr('id'),
            id = $node.attr('id'),
            sectionID = $node.attr('data-id'),
            inMenu = root.CP_CUSTOMIZER.menu.anchorExistsInPrimaryMenu(id),
            setting = $node.attr('data-setting') ? $node.attr('data-setting') : false;

        var itemHTML = rowListItemTemplate({
            label: label,
            id: id,
            setting: setting,
            sectionID: sectionID,
            inMenu: inMenu
        });

        var $item = root.jQuery(itemHTML);


        $item.find('.item-settings').off('click.cp').on('click.cp', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var section = $(this).attr('data-setting');

            if (root.CP_CUSTOMIZER.isRightSectionVisible(section)) {
                root.CP_CUSTOMIZER.hideRightSection();
            } else {
                root.CP_CUSTOMIZER.showSectionToRight(section, {
                    floating: true,

                    y: $(this).offset().top
                });
            }
        });

        $item.data('node', $node);

        return $item;
    };

    root.CP_CUSTOMIZER.populateFullRowsList = function(nodes, append) {
        var $ = root.jQuery;
        if (nodes && append === true) {
            // var _nodes = [];
            var alreadyInPage = $('#page_full_rows').children('li').map(function() {
                return $(this).data('node');
            });

            nodes = nodes.not(alreadyInPage);
        } else {
            $('#page_full_rows').empty();
        }
        $(nodes || root.CP_CUSTOMIZER.getContentNodes('div')).each(function(index) {
            var item = root.CP_CUSTOMIZER.getRowListItem($(this));
            $('#page_full_rows').append(item);
        });

        $('.full_row .item-menu-visible').off('click.cp').on('click.cp', function(event) {
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation();

            var $item = $(this).closest('.full_row'),
                $node = $item.data('node');

            if (false === root.CP_CUSTOMIZER.menu.getPrimaryMenuID()) {
                root.CP_CUSTOMIZER.menu.createPrimaryMenu();
            }

            var anchor = $node.attr('id');
            var label = $node.attr('data-label');

            if (root.CP_CUSTOMIZER.menu.anchorExistsInPrimaryMenu(anchor)) {
                root.CP_CUSTOMIZER.menu.removeAnchorFromPrimaryMenu(anchor);
                $(this).removeClass('active');
            } else {
                root.CP_CUSTOMIZER.menu.addAnchorToPrimaryMenu(anchor, label);
                $(this).addClass('active');
            }
        });

        $('.full_row .item-menu-visible').on('mousedown', function(event) {
            event.preventDefault();
            event.stopPropagation();
        });

        var labelChange = _.debounce(function() {
            var $item = $(this).closest('.full_row');
            var node = $item.data('node');
            var oldValue = node.attr('data-label');
            var value = this.value.trim();

            if (value === oldValue) {
                return;
            }

            if (value.length === 0) {
                value = oldValue;
                this.value = oldValue;
            }

            node.attr('data-label', value);
            node.data('label', value);

            var slug = root.CP_CUSTOMIZER.getSlug(value);

            if (root.CP_CUSTOMIZER.getRootNode().find('[id="' + slug + '"]').length) {
                var found = false,
                    index = 1;
                while (!found) {
                    if (root.CP_CUSTOMIZER.getRootNode().find('[id="' + slug + '-' + index + '"]').length === 0) {
                        slug += '-' + index;
                        found = true;
                    } else {
                        index++;
                    }
                }
            }
            var oldId = node.attr('id');
            node.attr('id', slug);
            $(this).siblings('.anchor-info').text('#' + slug);

            if (root.CP_CUSTOMIZER.menu.anchorExistsInPrimaryMenu(oldId)) {
                root.CP_CUSTOMIZER.menu.updatePrimaryMenuAnchor(oldId, {
                    anchor: slug,
                    title: value
                });
            }

            root.CP_CUSTOMIZER.saveContent();
        }, 500);

        $('.full_row input').keyup(labelChange);


        var skipableKeyCodes = [8, 46, 16, 17, 18];
        var labelValidaton = function(event) {

            if (skipableKeyCodes.indexOf(event.keyCode) === -1 && event.key.length === 1) {
                if (!event.key.match(/[A-Za-z0-9\s]/)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };

        $('.full_row input').keydown(labelValidaton);

        $('.full_row .item-remove').off('click.cp').on('click.cp', function() {
            var node = $(this).parents('.item').data('node');
            $(this).parents('.item').fadeOut(200);
            $(node).remove();
            root.CP_CUSTOMIZER.saveContent();
            root.CP_CUSTOMIZER.populateAvailableFullRows();
            root.CP_CUSTOMIZER.updateAllOverlays();
        });

        var timeoutDuration = 500;
        $('#page_full_rows li').mousedown(function() {
                var $element = $(this);
                $element.addClass('focused');
                $element.siblings().removeClass('focused');
                var node = $(this).data('node');

                var timeoutID = setTimeout(function() {
                    var nodes = root.CP_CUSTOMIZER.getContentNodes('div');
                    root.CP_CUSTOMIZER.focusElement(node);


                }, timeoutDuration);

                $element.data('hover-timeout', timeoutID);

            }
            /*, function() {
             clearTimeout($(this).data('hover-timeout'));
             }*/
        );
    };

    root.CP_CUSTOMIZER.focusElement = function(node, scrollSpeed) {
        if (!node.length) {
            return;
        }
        var $toScroll = node.parents('html, body');
        // node.append('<div class="reiki-customizer-ordering-overlay" />');
        node.css({
            position: 'relative'
        });

        $toScroll.animate({
            scrollTop: node.offset().top
        }, scrollSpeed || 500, function() {
            // setTimeout(function() {
            //     var node = this;
            //     node.find('.reiki-customizer-ordering-overlay').fadeOut('400', function() {
            //         node.find('.reiki-customizer-ordering-overlay').remove();
            //     });
            // }.bind(node), 1000);
        });
    };


    root.CP_CUSTOMIZER.focusListItem = function(id) {
        var li = root.jQuery('#page_full_rows li[data-id="' + id + '"]');
        li.addClass('focused');
        li.siblings().removeClass('focused');
        li[0].scrollIntoViewIfNeeded();
    };

    root.CP_CUSTOMIZER.populateAvailableFullRows = function() {
        var $ = root.jQuery;
        $('#available_full_rows').empty();
        $('#available_headers').empty();
        $('#available_footers').empty();
        var headears = [];
        var headearsPro = [];


        var footers = [];
        var footersPro = [];

        var sectionProRows = [];
        var sectionInsertedRows = [];
        var availableRows = [];
        var sectionRows = [];
        var used = $(root.CP_CUSTOMIZER.getContentNodes('div'));
        $(root.CP_CUSTOMIZER.FULL_ROWS).each(function(index, item) {
            var available, $item;
            if (item.type.match(/section/)) {
                available = (!used.filter('[data-id=' + item.id + ']').length);
                $item = $('<li class="item available-item"><div class="image-holder" style="background-position:center center;background-image:url(' + item.thumb + '?reiki-companion=v1)"></div>' + '<span class="available-item-hover-button">Click to insert</span><span class="item-preview"><i class="icon"></i></span></li>');
                if (!available) {
                    $item.addClass('already-in-page');
                    $item.find('.available-item-hover-button').replaceWith('<div title="Section is already in page" class="checked-icon"></div>');
                    sectionInsertedRows.push($item);
                } else {
                    if (item.type === "section-pro") {
                        sectionProRows.push($item);
                        $item.addClass('pro-only');
                        $item.find('.available-item-hover-button').replaceWith('<div class="pro-icon"></div>');
                    } else {
                        if (item.type === "section-available" || item.type === "section-default") {

                            availableRows.push($item);
                        } else {
                            if (item.type === "custom-section") {
                                $item.removeClass('available-item');
                                root.CP_CUSTOMIZER.trigger(root.CP_CUSTOMIZER.Events.SECTION_ADDED_IN_PANEL, [item, $item]);
                                availableRows.push($item);
                            }
                        }
                    }
                }
                sectionRows.push($item);
            } else {

                if (item.type.match(/header/)) {
                    available = wp.customize('reiki_header_template').get() !== item.id;
                    $item = $('<li class="item available-item"><div class="image-holder" style="background-position:center top;background-image:url(' + item.thumb + '?reiki-companion=v1)"></div>' + '<span class="available-item-hover-button">Use this header</span><span class="item-preview"><i class="icon"></i></span></li>');
                    if (!available && item.type === "header") {
                        $item.addClass('already-in-page');
                        $item.find('.available-item-hover-button').replaceWith('<div title="Section is already in page" class="checked-icon"></div>');
                    }
                    if (item.type === "header-pro") {
                        $item.addClass('pro-only');
                        $item.find('.available-item-hover-button').replaceWith('<div class="pro-icon"></div>');
                        headearsPro.push($item);
                    } else {
                        headears.push($item);
                    }
                } else {
                    if (item.type.match(/footer/)) {
                        available = wp.customize('reiki_footer_template').get() !== item.id;
                        $item = $('<li class="item available-item"><div class="image-holder" style="background-position:center top;background-image:url(' + item.thumb + '?reiki-companion=v1)"></div>' + '<span class="available-item-hover-button">Use this footer</span><span class="item-preview"><i class="icon"></i></span></li>');
                        if (!available && item.type === "footer") {
                            $item.addClass('already-in-page');
                            $item.find('.available-item-hover-button').replaceWith('<div title="Section is already in page" class="checked-icon"></div>');
                        }
                        if (item.type === "footer-pro") {
                            $item.addClass('pro-only');
                            $item.find('.available-item-hover-button').replaceWith('<div class="pro-icon"></div>');
                            footersPro.push($item);
                        } else {
                            footers.push($item);
                        }
                    }
                }
            }
            $item.data('item', item);

            if (item.description) {
                $item.append('<span class="description">' + item.description + '</span>');
            }
        });
        $('#available_headers').append(headears);
        $('#available_headers').append(headearsPro);

        $('#available_footers').append(footers);
        $('#available_footers').append(footersPro);
        //$('#available_full_rows').append(availableRows);
        //$('#available_full_rows').append(sectionInsertedRows);
        //$('#available_full_rows').append(sectionProRows);
        $('#available_full_rows').append(sectionRows);
        $('.sections .item-preview').off('mouseover.cp').on('mouseover.cp', function() {
            showPreview($(this).parents('.item').first());
        });

        $('.sections .item-preview').off('mouseout.cp').on('mouseout.cp', function() {
            hidePreview();
        });

        $('.sections .available-item').unbind('click').bind('click', function() {
            var message;
            if ($(this).data('item').type.match('pro')) {
                message = '' +
                    '<span class="reiki-about-cp">This section and much more are available on CloudPress.</span>' +
                    '<a class="reiki-cp-button" target="_blank" href="http://cloud-press.net/reiki-landing" data-type="reiki-pro">TRY CLOUDPRESS FOR FREE</a>';
                root.CP_CUSTOMIZER.alert(message, 'This section is available only in pro');
                return;
            }

            if ($(this).hasClass('already-in-page')) {
                message = 'This section has already been added in page';
                root.CP_CUSTOMIZER.alert(message, 'Already in page');
                return;
            }

            root.CP_CUSTOMIZER.insertFullRow($(this).data('item').id, function(newRow) {
                var hasColor = (tinycolor(newRow.css('background-color')).getAlpha() !== 0);
                if (!hasColor && !newRow.is('[data-bg="transparent"]')) {
                    var prevSection = newRow.prev();

                    if (!prevSection.length) {
                        newRow.css('background-color', '#ffffff');
                        return;
                    }

                    var isPrevTransparent = (tinycolor(prevSection.css('background-color')).getAlpha() === 0);
                    var isPrevWhite = (tinycolor(prevSection.css('background-color')).toHex().toUpperCase() === "FFFFFF" || tinycolor(prevSection.css('background-color')).toHex().toUpperCase() === "FFF");

                    if (isPrevTransparent || isPrevWhite) {
                        newRow.css('background-color', '#f6f6f6');
                    } else {
                        newRow.css('background-color', '#ffffff');
                    }
                }
            });
        });
    };

    root.CP_CUSTOMIZER.getFullRowById = function(id) {
        for (var i = 0; i < root.CP_CUSTOMIZER.FULL_ROWS.length; i++) {
            if (root.CP_CUSTOMIZER.FULL_ROWS[i].id === id) {
                return root.CP_CUSTOMIZER.FULL_ROWS[i];
            }
        }
    };


    root.CP_CUSTOMIZER.insertFullRow = function(id, callback) {
        var item = root.CP_CUSTOMIZER.getFullRowById(id);
        var rows, newRow;

        if (item.type.match('section')) {
            rows = $(root.CP_CUSTOMIZER.getContentNodes('div'));
            newRow = $(item.translated_content);
            newRow.attr('id', item.elementId.replace("#", ""));
            if (rows.length) {
                rows.last().after(newRow);
            } else {
                root.CP_CUSTOMIZER.getRootNode().append(newRow);
            }
            rows = rows.add(newRow);

            if (callback) {
                callback(newRow);
            }

            $('html, body').animate({
                scrollTop: newRow.offset().top
            }, 1000);

        } else {
            if (item.type.match('header')) {
                root.CP_CUSTOMIZER.changeHeader(id);
            } else {
                if (item.type.match('footer')) {
                    root.CP_CUSTOMIZER.changeFooter(id);
                }
            }
        }

        root.CP_CUSTOMIZER.populateFullRowsList(newRow, true);
        root.CP_CUSTOMIZER.populateAvailableFullRows();
        root.CP_CUSTOMIZER.saveContent();
        root.CP_CUSTOMIZER.addFixedOverlays(newRow);
        handleElements();
    };
    root.CP_CUSTOMIZER.handleElements = handleElements;

    root.CP_CUSTOMIZER.insertContent = function(content, itemData, parent) {
        $parent = $(parent);
        $content = $(content);

        if (itemData.type.match('section') && !itemData.type.match('custom-section')) {
            root.CP_CUSTOMIZER.insertFullRow(itemData.id);
            return;
        }

        $parent.append($content);
        root.CP_CUSTOMIZER.markSave();

        if (itemData.type.match('custom-section')) {
            var rows = $(root.CP_CUSTOMIZER.getContentNodes('div'));
            root.CP_CUSTOMIZER.populateFullRowsList(rows);
            root.CP_CUSTOMIZER.addFixedOverlays($content);
            return;
        }

        handleElements();
    };

    root.CP_CUSTOMIZER.changeHeader = function(name) {
        var $controlElem = root.jQuery("[data-customize-setting-link=reiki_header_template]");
        $controlElem.val(name);
        $controlElem.trigger('change');
    };

    root.CP_CUSTOMIZER.changeFooter = function(name) {
        var $controlElem = root.jQuery("[data-customize-setting-link=reiki_footer_template]");
        $controlElem.val(name);
        $controlElem.trigger('change');
    };


    root.CP_CUSTOMIZER.getCustomizerRootEl = function() {
        return root.jQuery(root.document.body).find('form');
    };


    root.CP_CUSTOMIZER.showSectionToRight = function(sectionID, options) {
        options = options || {};
        root.CP_CUSTOMIZER.hideRightSection();
        var $form = root.CP_CUSTOMIZER.getCustomizerRootEl();
        if ($form.find('#' + sectionID + '-popup').length) {
            $form.find('#' + sectionID + '-popup').addClass('active');

            if (options.floating && !_(options.y).isUndefined()) {
                $form.find('#' + sectionID + '-popup').css({
                    top: options.y
                });
            }
        } else {
            var $container = $('<li id="' + sectionID + '-popup" class="reiki-right-section active"> <span data-reiki-close-right="true" title="Close Panel" class="close-panel"></span> </li>');

            if (options.floating) {
                $container.addClass('floating');
            }

            $toAppend = $form.find('li#accordion-section-' + sectionID + ' > ul');

            if ($toAppend.length === 0) {
                $toAppend = $form.find('#sub-accordion-section-' + sectionID);
            }


            if ($toAppend.length === 0) {
                $toAppend = $('<div class="control-wrapper" />');
                $toAppend.append($form.find('#customize-control-' + sectionID).children());


            }

            $form.append($container);
            $container.append($toAppend);

            if (options.floating && !_(options.y).isUndefined()) {
                $container.css({
                    top: options.y
                });
            }

            $container.find('span.close-panel').click(root.CP_CUSTOMIZER.hideRightSection);

        }

        $form.find('span[data-reiki-close-right="true"]').click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            root.CP_CUSTOMIZER.hideRightSection();
        });

        $form.find('li.accordion-section').unbind('click.right-section').bind('click.right-section', function(event) {
            if ($(event.target).is('li') || $(event.target).is('.accordion-section-title')) {
                root.CP_CUSTOMIZER.hideRightSection();
            }
        });

    };



    root.CP_CUSTOMIZER.cleanClose = function() {};

    root.CP_CUSTOMIZER.hideRightSection = function() {
        var $form = root.jQuery(root.document.body).find('#customize-controls');
        var $visibleSection = $form.find('.reiki-right-section.active');
        if ($visibleSection.length) {
            if ($visibleSection.attr('id').match(/reiki_webpage_layout_insert/)) {
                root.jQuery('.reiki-add-section').removeClass('active');
            }

            $visibleSection.removeClass('active');

        }

    };

    root.CP_CUSTOMIZER.isRightSectionVisible = function(sectionID) {
        var $form = root.jQuery(root.document.body).find('#customize-controls');
        return $form.find('#' + sectionID + '-popup').hasClass('active');
    };


    root.CP_CUSTOMIZER.saveContent = function() {

        if (root.reikiCustomizerPage.is_reiki_home_page) {
            var $controlElem = root.jQuery("#" + root.controlID);
            $controlElem.val(root.CP_CUSTOMIZER.getContent());
            $controlElem.trigger('change');

        }

        jQuery("[data-theme-href]").each(function() {
            var prop = jQuery(this).attr('data-theme-href');
            var val = jQuery(this).attr('href');
            root.wp.customize(prop).set(val);
        });

        jQuery("[data-theme-target]").each(function() {
            var prop = jQuery(this).attr('data-theme-target');
            var val = jQuery(this).attr('target') || "_self";
            root.wp.customize(prop).set(val);
        });

        jQuery("[data-theme-src]").each(function() {
            var prop = jQuery(this).attr('data-theme-src');
            var val = jQuery(this).attr('src');
            root.wp.customize(prop).set(val);
        });

        jQuery("[data-theme-fa]").each(function() {
            var prop = jQuery(this).attr('data-theme-fa');
            var val = jQuery(this).attr('class').match(/fa\-[a-z\-]+/ig).pop();
            root.wp.customize(prop).set(val);
        });

        jQuery("[data-theme]").each(function() {

            if (!$(this).data('was-changed')) {
                return;
            }

            var prop = jQuery(this).attr('data-theme');
            var toSave = jQuery(this).clone();
            root.CP_CUSTOMIZER.cleanNode(toSave);
            var val = toSave.html();
            root.wp.customize(prop).set(val);
            $(this).data('was-changed', false);
        });

        root.CP_CUSTOMIZER.cleanClose();
    };

    root.CP_CUSTOMIZER.originalContent = function() {
        return root.reikiOriginal;
    };

    root.CP_CUSTOMIZER.textElements = 'p, h1, h2, h3, h4, h5, h6, a, span, i';

    function handleElements() {

        if (!root.reikiCustomizerPage.is_reiki_home_page) {
            return;
        }

        $('body a').unbind('click').click(function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();

            if ($(this).is('[data-container-editable]') || $(this).is('[data-type=group]')) {
                containerEditableHandler.apply(this);
            }

            return false;
        });
        var elements = root.CP_CUSTOMIZER.getRootNode().find('p, h1, h2, h3, h4, h5, h6, img, a, span, i.fa').filter(function() {
            return root.reikiCustomizerPage.is_reiki_home_page;
        });
        var editableContainersSelector = '[hover-fx], .team-box';
        var editableContainers = $(editableContainersSelector);
        editableContainers.attr('data-container-editable', true);
        elements = elements.filter(function(item) {
            if ($(this).closest('[data-content-shortcode]').length) {
                return false;
            }
            return true;
        });
        elements = elements.add(root.CP_CUSTOMIZER.getThemeMods().filter('p, h1, h2, h3, h4, h5, h6, img, a, span, i.fa'));
        elements.filter('a').attr('data-container-editable', true);
        elements = elements.filter(function(item) {
            // shortcode link that manages href
            // var shortcodeAttr = $(this).attr('data-attr-shortcode') || "";
            // if (shortcodeAttr.indexOf('href:') !== -1) {
            //     return false;
            // }

            if (this.tagName === "SPAN" && $(this).parents('p, h1, h2, h3, h4, h5, h6').length) {
                return false;
            }
            if ($(this).parents('[data-container-editable]').length) {
                elements.attr('data-content-code-editable', true);
                return false;
            }

            if ($(this).is('[data-container-editable]')) {
                $(this).attr('data-content-code-editable', true);
                return false;
            }


            return true;
        });

        root.CP_CUSTOMIZER.getRootNode().find('.ContentSwap103_content  .carousel-image').attr('data-style-editable', true);


        elements.not('i.fa').attr('data-content-editable', true);
        elements.not('i.fa').attr('contenteditable', true);
        $('[contenteditable="true"]').add('i.fa').off("keypress.cp").on("keypress.cp", function(event) {
            root.CP_CUSTOMIZER.markSave();

            if (event.which !== 13)
                return true;
            var docFragment = document.createDocumentFragment();
            //add a new line
            var newEle = document.createTextNode('\n');
            docFragment.appendChild(newEle);
            //add the br, or p, or something else
            newEle = document.createElement('br');
            docFragment.appendChild(newEle);
            //make the br replace selection
            var range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(docFragment);
            //create a new range
            range = document.createRange();
            range.setStartAfter(newEle);
            range.collapse(true);
            //make the cursor there
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return false;
        });



        $('[contenteditable="true"]').off("paste.cp").on('paste.cp', function(e) {
            var content;
            e.preventDefault();
            if (e.originalEvent.clipboardData) {
                content = (e.originalEvent || e).clipboardData.getData('text/plain');
                content = content.replace(/\r\n/g, '<br/>').replace(/\r/g, '<br/>').replace(/\n/g, '<br/>');
                // console.log(content);
                document.execCommand('insertHTML', false, content);
            } else {
                if (window.clipboardData) {
                    content = window.clipboardData.getData('Text');
                    if (window.getSelection)
                        window.getSelection().getRangeAt(0).insertNode(document.createTextNode(content));
                }
            }
            root.CP_CUSTOMIZER.markSave();
        });

        $('[data-type="row"] > div, [data-type=column]').each(function() {
            var $this = $(this);

            if ($this.find('[data-type=column]').length) {
                return;
            }

            if ($this.parent().is('[data-content-shortcode]')) {
                return;
            }

            $this.sortable({
                axis: "y",
                start: function(event, ui) {
                    ui.helper.css('left', ui.helper.offset().left);
                    ui.helper.css('position', 'fixed');
                },
                sort: function(event, ui) {
                    ui.helper.css('top', event.clientY);
                },
                stop: function(evt, ui) {
                    $this.sortable('disable');
                    $('.node-hover-overlay[is-dragging=true]').removeAttr('is-dragging');
                    $(ui.item).data('reikidragging', false);

                    function refreshOverlay() {
                        root.CP_CUSTOMIZER.assignNodeToOverlay(root.CP_CUSTOMIZER.hoverOverlay, $(ui.item));
                        root.CP_CUSTOMIZER.updateOverlayPosition(root.CP_CUSTOMIZER.hoverOverlay, $(ui.item));
                    }
                    setTimeout(refreshOverlay, 10);
                    $('[contenteditable]').attr('contenteditable', true);
                    root.CP_CUSTOMIZER.isSorting = false;
                }

            });
            $this.sortable('disable');
        });
    }

    function containerEditableHandler() {
        root.jQuery('#cp-item-ok').off('click.cp').on('click.cp', function() {
            for (var i = 0; i < root.CP_CUSTOMIZER.fields.length; i++) {
                var item = root.CP_CUSTOMIZER.fields[i];
                var node = item.node;
                var _values = root.jQuery('[id^=' + item.id + ']').map(function(index, elem) {
                    return {
                        key: $(this).attr('id').replace(item.id + "__", ''),
                        value: $(this).is('[type=checkbox]') ? this.checked : $(this).val()
                    };
                }).toArray();

                var values = {};

                _(_values).each(function(v) {
                    values[v.key] = v.value;
                });

                var value = values[item.id];

                if (item.value_type === "background-image") {
                    node.css({
                        "background-image": "url('" + value + "?reiki-companion=v1')"
                    });

                    continue;
                }
                if (node.is('img')) {
                    node.attr('src', value);
                } else {
                    if (node.is('i.fa')) {
                        var classAttr = node.attr('class');
                        var newClassAttr = classAttr.replace(/fa\-[a-z\-]+/ig, "").replace(/\s[\s]+/ig, " ").trim() + " " + (value || values.icon);
                        node.attr('class', newClassAttr);

                        if (node.parent().is('a')) {
                            node.parent()[0].setAttribute('href', values.link || "#");
                            node.parent()[0].setAttribute('target', values.target || "_self");
                        }

                        if (node.parent().is('a')) {
                            if (values.visible) {
                                node.parent().removeAttr('data-reiki-hidden');
                            } else {
                                node.parent().attr('data-reiki-hidden', true);
                            }
                        }

                    } else {
                        if (node.is('a') && item.value_type == "link_href") {
                            node.attr('href', values.link);
                            node.attr('target', values.target);
                        } else {
                            node.html(value);
                        }
                    }
                }


                if (node.is('[data-theme]') || node.closest('[data-theme]').length) {
                    if (node.is('[data-theme]')) {
                        node.data('was-changed', true);
                    } else {
                        node.closest('[data-theme]').data('was-changed', true);
                    }
                }
            }
            root.CP_CUSTOMIZER.saveContent();
            root.tb_remove();
            root.jQuery('#TB_overlay').css({
                'z-index': '-1'
            });
        });
        root.jQuery('#cp-item-cancel').off('click.cp').on('click.cp', function() {
            root.tb_remove();
            root.jQuery('#TB_overlay').css({
                'z-index': '-1'
            });
        });
        root.CP_CUSTOMIZER.tb_show(root.REIKI_TEXTS.change_texts_images.toUpperCase(), '#TB_inline?width=570&inlineId=hover-fx-item-editor');
        activeItem = $(this);


        if (activeItem.closest('.contentswap-effect').length) {
            activeItem = activeItem.closest('.contentswap-effect');
        }

        root.CP_CUSTOMIZER.fields = [];
        var templates = root.jQuery('#hover-fx-item-editor-templates');
        var textinc = 1;
        var imginc = 1;
        var fainc = 1;
        var faLinkInc = 1;
        var linkinc = 1;
        var elms = activeItem.find('[data-content-code-editable],[data-theme-href],[data-theme],[data-theme-fa]');
        if (activeItem.is('[data-content-code-editable]')) {
            elms = elms.add(activeItem);
        }

        elms.each(function(index, item) {
            var $this = $(this);
            var type = "text";
            var label;
            var value = $this.html();
            var value_type = "text";


            if ($this.is('img')) {



                value = $this.attr('src');
                type = 'image';

                if ($this.attr('data-size')) {
                    type = 'image?data-size="' + $this.attr('data-size') + '"';
                }

                label = 'Image';
                imginc++;
            } else {
                if ($this.is('i.fa') && $this.parent().is('a')) {
                    value = {
                        icon: $this.attr('class').match(/fa\-[a-z\-]+/ig).pop(),
                        link: $this.parent()[0].getAttribute('href'),
                        target: $this.parent().attr('target') || "_self",
                        visible: $this.parent().is(':visible')
                    };
                    type = 'fa-link';
                    label = 'Font Awesome icon';
                    faLinkInc++;
                } else {
                    if ($this.is('i.fa')) {
                        type = 'fa';
                        label = root.REIKI_TEXTS.image;
                        value = $this.attr('class').match(/fa\-[a-z\-]+/ig).pop();
                        fainc++;
                    } else {
                        if ($this.is('a') && !$this.children().is('i.fa')) {

                            if ($this.is('[data-attr-shortcode]')) {
                                var attr = $(this).attr('data-attr-shortcode');
                                if (attr.indexOf('href:') === -1) {
                                    value = {
                                        'link': $this.attr('href'),
                                        'target': ($this.attr('target') || "_self"),
                                    };

                                    label = root.REIKI_TEXTS.link;
                                    type = "link_href";
                                    value_type = "link_href";
                                    linkinc++;
                                }
                            } else {
                                value = {
                                    'link': $this.attr('href'),
                                    'target': ($this.attr('target') || "_self"),
                                };
                                label = root.REIKI_TEXTS.link;
                                type = "link_href";
                                value_type = "link_href";
                                linkinc++;
                            }
                        } else {

                            if ($this.is('a') && $this.children().is('i.fa')) {
                                return;
                            } else {
                                label = 'Item field';
                                var itemName = "Item";
                                var parents = $this.parents('[data-item-name]');
                                if (parents.length) {
                                    itemName = parents.attr('data-item-name');
                                }

                                if ($this.is('h1,h2,h3,h4')) {
                                    label = itemName + ' title';
                                }

                                if ($this.is('p')) {
                                    label = itemName + ' description';
                                }

                                textinc++;
                            }


                        }
                    }
                }
            }


            if (label) {
                root.CP_CUSTOMIZER.fields.push({
                    label: label,
                    value: value,
                    value_type: value_type,
                    type: type,
                    id: 'item_no_' + index,
                    node: $this
                });
            }

            if ($this.is('a') && !$this.find('img').length) {
                root.CP_CUSTOMIZER.fields.push({
                    value_type: "link_text",
                    label: root.REIKI_TEXTS.link_text,
                    value: $this.html(),
                    type: "text",
                    id: 'item_no_' + index + "_text",
                    node: $this
                });
            }
        });

        var styleEls = activeItem.find('[data-style-editable]');
        styleEls.each(function() {
            var $this = $(this);
            var imageMatch = $this.css('background-image').match(/url\(['"](.*?)['"]\)/i);
            var image = "";
            if (imageMatch) {
                image = imageMatch[1];
            }

            root.CP_CUSTOMIZER.fields.push({
                value_type: "background-image",
                label: root.REIKI_TEXTS.image,
                value: image,
                type: "image",
                id: "item_background_image_style",
                node: $this
            });
        });

        var items = root.jQuery('#cp-items');
        items.empty();
        for (var i = 0; i < root.CP_CUSTOMIZER.fields.length; i++) {
            var item = root.CP_CUSTOMIZER.fields[i];
            var type = item.type.split('?')[0];

            var attrs = item.type.replace(type, '').trim();

            var template = templates.find('[data-type=' + type + ']')[0].outerHTML;

            template = template.replace(/inside\-script/gi, "script");

            if (attrs.length > 1) {
                attrs = attrs.replace('?', '');
                attrs = attrs.split('&').join(' ');
                template = template.replace(/attrs=\"\{\{attrs\}\}\"/gi, attrs);
            }

            template = template.replace(/\{\{label\}\}/gi, item.label);
            template = template.replace(/\{\{id\}\}/gi, item.id);

            if (!_.isObject(item.value)) {

                if (item.value.trim() === "#") {
                    item.value = 'http://#';
                }

                template = template.replace(/\{\{value\}\}/gi, item.value.trim());
            } else {
                _(item.value).each(function(value, key) {
                    var valueRegexCB = new RegExp('\\{\\{cb\:value\\.' + key + '\\}\\}', 'gi');
                    template = template.replace(valueRegexCB, function() {
                        if (_(value).isBoolean() && value) {
                            return "checked";
                        } else {
                            if (_(value).isString() && value.trim().length) {
                                return "checked";
                            } else {
                                return "";
                            }
                        }
                    });

                    var valueRegex = new RegExp('\\{\\{value\\.' + key + '\\}\\}', 'gi');

                    if (!_(value).isBoolean()) {
                        if (value.trim() === "#") {
                            value = 'http://#';
                        }
                        template = template.replace(valueRegex, value.trim());
                    }
                });
            }

            items.append(template);
        }
        root.jQuery('#TB_window').css({
            'z-index': '5000001'
        });
        root.jQuery('#TB_overlay').css({
            'z-index': '5000000'
        });
        root.jQuery('.cp-image-select').off('click.cp').on('click.cp', function() {
            var self = this;

            var imgCB = function(src) {
                if (src) {
                    root.jQuery('#' + root.jQuery(self).attr('data-cp-src')).val(src[0].url);
                    root.jQuery('#' + root.jQuery(self).attr('data-cp-src') + "-preview").attr('src', src[0].url);
                }
            };


            if ($(this).attr('data-size')) {
                var size = $(this).attr('data-size').split('x');
                root.CP_CUSTOMIZER.openCropableImageManager(size[0], size[1], imgCB)
                return;
            }

            root.CP_CUSTOMIZER.openMultiImageManager('Change image', imgCB, true);
        });


        root.jQuery('.cp-fa-select').off('click.cp').on('click.cp', function() {
            var self = this;
            openFAManager('Change Font Awesome Icon', function(data) {
                if (data) {
                    var icon = data[0].fa;
                    root.jQuery('#' + root.jQuery(self).attr('data-cp-src')).val(icon);
                    var $preview = root.jQuery('#' + root.jQuery(self).attr('data-cp-src') + "-preview"); //.attr('src', src[0].url);
                    var classAttr = $preview.attr('class');
                    var newClassAttr = classAttr.replace(/fa\-[a-z\-]+/ig, "") + " " + icon;
                    $preview.attr('class', newClassAttr);
                }
            }, true);
        });

        root.jQuery('#item_background_image_style').change(function() {
            root.jQuery('#item_background_image_style-preview').attr('src', this.value);
        });
    }




    $(document).ready(function($) {

        if (document.defaultView === root) {

            root.jQuery(document).off('mousewheel.cp-overlay-opacity');
            root.jQuery(document).off('keyup.cp-overlay-opacity');

            root.jQuery(document).on('mousewheel.cp-overlay-opacity keyup.cp-overlay-opacity', '[data-customize-setting-link="reiki_header_overlay_opacity"]', _.debounce(function(event) {
                $(this).trigger('change');
            }, 500));
            return;
        }

        console.log('is reiki homepage:', root.reikiCustomizerPage.is_reiki_home_page);

        if (root.reikiCustomizerPage.is_reiki_home_page) {

            if (root.CP_CUSTOMIZER.mutationObserver) {
                root.CP_CUSTOMIZER.mutationObserver.disconnect();
            }

            var observer = new MutationObserver(function(mutations) {
                _(mutations).each(function(mutation, key, mutations) {
                    var node = _(mutation.target.closest).isFunction() ? mutation.target : mutation.target.parentNode;

                    if (!node) {
                        return;
                    }

                    var isInPage = node.closest('.page-content') !== null,
                        isHtmlThemeMod = node.getAttribute('data-theme') !== null,
                        isInsideShortcode = node.closest('[data-content-shortcode]') !== null,
                        isOrderOverlay = $(mutation.addedNodes).is('.reiki-customizer-ordering-overlay'),
                        canMutate = ((isInPage || isHtmlThemeMod) && !isInsideShortcode && !isOrderOverlay && !root.CP_CUSTOMIZER.isSorting),
                        positionOnly = node.isContentEditable;

                    if (canMutate) {
                        if (mutation.type === "attributes") {
                            if (mutation.attributeName === "style" || mutation.attributeName === "class") {
                                root.CP_CUSTOMIZER.updateOverlayPosition(root.CP_CUSTOMIZER.hoverOverlay, $(root.CP_CUSTOMIZER.hoverOverlay.data('node')), false, positionOnly);
                            }
                        } else {
                            root.CP_CUSTOMIZER.updateOverlayPosition(root.CP_CUSTOMIZER.hoverOverlay, $(root.CP_CUSTOMIZER.hoverOverlay.data('node')), false, positionOnly);
                        }

                        if (mutation.type === "childList") {
                            if (mutation.addedNodes && mutation.addedNodes.length) {
                                if ((mutation.addedNodes[0].tagName || "").toLowerCase() === 'span') {
                                    mutation.addedNodes[0].removeAttribute('style');
                                }
                            }
                        }
                    }
                });
            });

            root.CP_CUSTOMIZER.mutationObserver = observer;

            handleElements();



            // $('[hover-fx]').delay(500).off('mouseover mouseout mousenter mouseleave').addClass('hover');
            $('[hover-fx]').delay(500).find('.overlay, .swap-inner').css({
                display: 'block',
                opacity: 1
            });

            $(document).find('[data-theme]').find(root.CP_CUSTOMIZER.textElements).each(function(index, el) {
                $(this).attr('data-content-editable', true);
                $(this).attr('data-content-code-editable', true);
                $(this).attr('contenteditable', true);
            });

            $(document).on('click', 'img[data-content-editable], [data-bg="image"]', function() {
                var self = this;
                root.CP_CUSTOMIZER.openMultiImageManager('Change image', function(src) {
                    if (src) {
                        if ($(self).is('img')) {
                            $(self).attr('src', src[0].url);
                        } else {
                            $(self).css('background-image', 'url(' + src[0].url + ')');
                        }
                        root.CP_CUSTOMIZER.saveContent();
                    }
                }, true);
            });


            $(document).on('click', 'i.fa', function() {
                var self = this;
                openFAManager('Change Font Awesome Icon', function(data) {
                    if (data) {
                        var icon = data[0].fa;
                        var classAttr = $(self).attr('class');
                        var newClassAttr = classAttr.replace(/fa\-[a-z\-]+/ig, "") + " " + icon;
                        $(self).attr('class', newClassAttr);
                        root.CP_CUSTOMIZER.saveContent();
                    }
                }, true);
            });




            var overlaysContainer = $('<div id="cp-overlays"></div>');
            $('html').append(overlaysContainer);

            var hoverOverlay = $('<div class="node-hover-overlay"><div class="pen-overlay"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.89 3.39l2.71 2.72c.46.46.42 1.24.03 1.64l-8.01 8.02-5.56 1.16 1.16-5.58s7.6-7.63 7.99-8.03c.39-.39 1.22-.39 1.68.07zm-2.73 2.79l-5.59 5.61 1.11 1.11 5.54-5.65zm-2.97 8.23l5.58-5.6-1.07-1.08-5.59 5.6z"></path></svg></div><span title="Move element" class="move"></span><span title="Delete element" class="remove"></span><div class="overlay-top overlay-border"></div><div class="overlay-left overlay-border"></div><div class="overlay-right overlay-border"></div><div class="overlay-bottom overlay-border"></div></div>');
            overlaysContainer.append(hoverOverlay);
            hoverOverlay.hide();
            hoverOverlay.find('.remove').click(function() {
                root.CP_CUSTOMIZER.removeNode($(hoverOverlay.data('node')));
                hoverOverlay.hide();
            });



            hoverOverlay.find('.pen-overlay').unbind('click').click(function(event) {
                var $node = $(hoverOverlay.data('node'));

                if ($node.is('[data-widgets-area]')) {
                    top.customizerFrame.wp.customize.section('sidebar-widgets-' + $node.attr('data-widgets-area')).focus();
                    return;
                }


                if (!$node.data('container-editable')) {
                    $node.off();
                    $(this).hide();
                }

                $node.focus();
                $node.click();
            });

            var moveHandlerCallback = function($handle, event) {

                if (event.which !== 1) {
                    return;
                }

                var overlay = $handle.closest('.node-hover-overlay');

                var $node = $(hoverOverlay.data('node'));

                if ($node.siblings().length === 0) {
                    return;
                }

                $node.blur();

                if ($node.data('reikidragging')) {
                    overlay.attr('is-dragging', false);
                    $node.data('reikidragging', false);
                    return;
                }

                var $first = $node.parents('.ui-sortable').first();
                if ($first.data("ui-sortable")) {
                    $first.sortable('enable');
                }

                $node.data('reikidragging', true);
                overlay.attr('is-dragging', true);

                $('[contenteditable="true"]').attr('contenteditable', false);
                $('[contenteditable="true"]').blur();
                triggerDrag($node[0], event);
                root.CP_CUSTOMIZER.isSorting = true;
            };


            hoverOverlay.find('.move').off('mousedown.cp').on('mousedown.cp', function(event) {
                _(moveHandlerCallback).delay(200, $(this), event);
            });


            hoverOverlay.find('.move').off('mouseup.cp').on('mouseup.cp', function(event) {
                var overlay = $(this).closest('.node-hover-overlay');
                overlay.attr('is-dragging', false);
            });


            $(document).off('mouseup.cp').on('mouseup.cp', '*', function(event) {
                _.delay(function() {
                    hoverOverlay.attr('is-dragging', false);
                }, 100);
            });

            var addOverlay = $('<div class="add-content-overlay"><div class="buttons" align-bottom h-align-center><div class="add" title="Add element">Add element</div></div><div h-align-right title="Delete item" class="remove"></div></div>');
            overlaysContainer.append(addOverlay);
            addOverlay.hide();

            addOverlay.find('.add').prepend('<div class="add-element-bubble"><div class="elements-container"></div></div>');

            addOverlay.find('.add').click(function(event) {
                addOverlay.find('.add').find('.add-element-bubble').toggleClass('visible');
            });

            root.CP_CUSTOMIZER.add_content_items_to(addOverlay.find('.elements-container'));

            addOverlay.find('.elements-container').on('cp-insert-content-item', function(event, type, insertHandler) {
                event.preventDefault();
                var $node = $(addOverlay.data('node'));
                var index = $node.children().length - 1;

                function after($node) {
                    root.CP_CUSTOMIZER.updateOverlayPosition(addOverlay, $(addOverlay.data('node')));
                }

                insertHandler(type, $node, index, after);
            });


            addOverlay.find('.remove').click(function() {
                var node = $(addOverlay.data('node'));
                if (node.is('[data-type=column]')) {
                    if (node.closest('[data-type=row]').length) {
                        node = node.parentsUntil('[data-type=row]').last();
                    }
                }
                root.CP_CUSTOMIZER.removeNode(node);
                addOverlay.hide();
            });

            function triggerDrag(el, ev) {
                var target = el;

                function findCenter(el) {
                    el = $(el);
                    var o = el.offset();
                    return {
                        x: o.left + el.outerWidth() / 2,
                        y: o.top + el.outerHeight() / 2
                    };
                }

                var self = this,
                    center = findCenter(target),
                    options = {},
                    x = Math.floor(center.x),
                    y = Math.floor(center.y),
                    dx = options.dx || 0,
                    dy = options.dy || 0;
                var coord = {
                    clientX: x,
                    clientY: y
                };

                var type = "mousedown";

                var e = $.extend({
                    bubbles: true,
                    cancelable: (type != "mousemove"),
                    view: window,
                    detail: 0,
                    screenX: 0,
                    screenY: 0,
                    clientX: 0,
                    clientY: 0,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: undefined
                }, coord);

                var relatedTarget = $(this).parent().data('node');

                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
                    e.screenX, e.screenY, ev.clientX, ev.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    e.button, null);

                el.dispatchEvent(evt);
            }

            function updateOverlayPosition(overlay, node, cover, positionOnly) {
                updateControls = !positionOnly;

                if (!node || !node.length) {
                    return;
                }


                if (updateControls) {
                    overlay.find('.pen-overlay').css({
                        width: node.outerWidth(),
                        height: node.outerHeight(),
                        'pointer-events': 'all',
                        'display': 'block'
                    });

                    overlay.find('.add-element-bubble.visible').removeClass('visible');
                    overlay.find('.add-element-bubble .expanded').removeClass('expanded');

                    if (node.outerHeight() < 30) {
                        overlay.find('.pen-overlay').addClass('small');
                    } else {
                        overlay.find('.pen-overlay').removeClass('small');
                    }



                    if (node.parent().is('.ui-sortable') && node.siblings('[contenteditable]').length && node.closest(".page-content").length) {
                        overlay.find('.move').show();
                    } else {
                        overlay.find('.move').hide();
                    }


                    if (!node.is(':visible')) {
                        overlay.hide();
                    } else {
                        overlay.show();
                    }

                    overlay.find('.add').show();
                    if (node.closest('[data-add-content]').length) {
                        value = node.closest('[data-add-content]').attr('data-add-content');

                        if (value === "false") {
                            overlay.find('.add').hide();
                        }
                    }


                    if (node.closest('[data-type="row"]').length && node.closest('[data-type="row"]').is('[data-custom-items]')) {
                        overlay.find('.top-container').hide();
                        overlay.find('[h-align-center]').hide();
                    } else {
                        overlay.find('.top-container').show();
                        overlay.find('[h-align-center]').show();
                    }


                    if (overlay.is('.add-content-overlay')) {
                        if (node.is('[data-type="column"]') && node.closest('[data-type=row]').length === 0) {
                            overlay.find('.remove').hide();
                        } else {
                            if (node.closest('[data-type=row]').children().length > 1) {
                                overlay.find('.remove').show();
                            } else {
                                overlay.find('.remove').hide();
                            }
                        }
                    }

                    if (overlay.is('.node-hover-overlay')) {
                        if (node.siblings().length === 0) {
                            overlay.find('.remove').hide();
                        } else {
                            overlay.find('.remove').show();
                        }
                    }


                }

                var bounds = node[0].getBoundingClientRect();
                var scrollTop = window.pageYOffset;
                var scrollLeft = window.pageXOffset;
                overlay.css({
                    left: (parseInt(bounds.left) + scrollLeft) + "px",
                    top: (parseInt(bounds.top) + scrollTop) + "px"
                });

                overlay.css({
                    width: node.outerWidth(),
                    'position': 'absolute'
                });

                if (!cover) {
                    overlay.css({
                        height: 'auto',
                        'background-color': ''
                    });
                }

                overlay.children('.overlay-left, .overlay-right').css({
                    height: node.outerHeight(),
                    width: '0px'
                });
                overlay.children('.overlay-right').css({
                    left: node.outerWidth()
                });
                overlay.children('.overlay-top, .overlay-bottom').css({
                    height: '0px',
                    width: node.outerWidth()
                });
                overlay.children('.overlay-bottom').css({
                    top: node.outerHeight()
                });

                overlay.children('[align-bottom]').each(function() {
                    $(this).css({
                        top: node.outerHeight() - 5
                    });
                });

                overlay.children('[align-top]').css({
                    top: 0
                });

                overlay.children('[h-align-center]').each(function() {
                    $(this).css({
                        left: (node.outerWidth() - $(this).outerWidth()) / 2
                    });
                });

            }

            root.CP_CUSTOMIZER.updateOverlayPosition = updateOverlayPosition;

            function assignNode(overlay, node, cover) {
                if (overlay.attr('is-dragging') && overlay.attr('is-dragging') === "true") {
                    return;
                }
                if (jQuery(overlay.data('node')).is(node)) {
                    return;
                } else {
                    jQuery(overlay.data('node')).blur();
                }

                overlay.data('node', $(node)[0]);

                function updateOverlay() {
                    updateOverlayPosition(overlay, $(node), cover);
                }
                overlay.on('reiki.update_overlays', '*', function(event) {
                    setTimeout(updateOverlay, 0);
                });

                updateOverlay();
            }

            function updateOnScroll() {
                var updateOnlySections = Array.from(arguments).length === 0;
                var update = function() {
                    this.overlaysContainer.children().each(function() {
                        var isSection = $(this).is('.section-overlay');

                        if (updateOnlySections && !isSection) {
                            return;
                        }

                        var node = $(this).data('node');
                        if (node) {
                            updateOverlayPosition($(this), $(node), false, true);
                        }
                    });
                }.bind({
                    overlaysContainer: overlaysContainer
                });

                setTimeout(update, 0);
                return true;
            }

            var updateOnResize = _.debounce(updateOnScroll, 500);
            root.CP_CUSTOMIZER.updateAllOverlays = updateOnScroll;

            $.fn.insertAt = function(index, $parent) {
                return this.each(function() {
                    if (index === 0 || !$parent.children().length) {
                        $parent.prepend(this);
                    } else {
                        $parent.children().eq(index - 1).after(this);
                    }
                });
            };

            root.CP_CUSTOMIZER.update = function() {
                root.CP_CUSTOMIZER.markSave();
                root.CP_CUSTOMIZER.handleElements();
                root.CP_CUSTOMIZER.updateAllOverlays();
            };

            root.CP_CUSTOMIZER.insertNode = function($node, $parent, index) {
                index = (index !== undefined) ? index : -1;
                $node.insertAt(index + 1, $parent);
                root.CP_CUSTOMIZER.update();
            };

            root.CP_CUSTOMIZER.appendToNode = function($parent, $node) {
                $parent.append($node);
                root.CP_CUSTOMIZER.update();
            };

            root.CP_CUSTOMIZER.removeNode = function($node, skipUpdate) {
                var $parent = $node.parent();
                $node.remove();

                if (!skipUpdate) {
                    root.CP_CUSTOMIZER.update();
                }
            };

            $.fn.addFixedOverlay = function(options) {
                options = $.extend(true, {
                    'types': [],
                    'classes': [],
                    'callback': function() {}
                }, options);

                this.each(function(index, el) {
                    var $node = $(el);
                    var ovItems = ($node.data('type') || "").trim().replace(/\s\s+/g, ' ').split(' ');
                    var ov = $('<div class="node-overlay"><div class="overlay-top overlay-border"></div><div class="overlay-left overlay-border"></div><div class="overlay-right overlay-border"></div><div class="overlay-bottom overlay-border"></div></div>');
                    var overlay = root.jQuery('#toolbar-template').html();
                    var toolbar = $(overlay);
                    var optionsGroupOnHoverIN = function(event) {
                        $(this).find('.options-group.cog').addClass('active');

                        if (this.ownerDocument.defaultView.innerHeight - this.getClientRects()[0].top < 400) {
                            $(this).find('.options-group.cog').addClass('reverse');
                        } else {
                            $(this).find('.options-group.cog').removeClass('reverse');
                        }


                    };
                    var optionsGroupOnHoverOUT = function(event) {
                        $(this).find('.options-group.cog').removeClass('active');
                    };

                    $.each(options.classes, function(index, val) {
                        ov.addClass(val);
                    });

                    ovItems = ovItems.concat(options.types);
                    ovItems = ovItems.filter(function(type) {
                        return type.length;
                    });

                    if (ovItems.length === 0) {
                        return;
                    }
                    assignNode(ov, $node);
                    toolbar.find('.overlay-toolbar-element-type').html('Settings');
                    toolbar.find('.edit-group').hide();
                    ov.append(toolbar);
                    $node.data('overlay', ov);
                    $(ov).data('node', this);
                    overlaysContainer.append(ov);
                    $('.overlay-toolbar').hover(optionsGroupOnHoverIN, optionsGroupOnHoverOUT);

                    // look for overlay cog items 

                    function addCogCallback(itemData) {
                        if (itemData.toolbarTitle) {
                            var title = itemData.toolbarTitle;
                            if (typeof itemData.toolbarTitle === "function") {
                                title = itemData.toolbarTitle($node);
                            }

                            toolbar.find('.overlay-toolbar-element-type').html(title);
                        }
                        options.callback.apply($node, itemData);
                    }

                    for (var i = 0; i < ovItems.length; i++) {
                        var itemType = ovItems[i];
                        reikiCustomizer.cogOptions.addCogItems(toolbar.find('.overlay-contextual-menu'), itemType, $node, addCogCallback);
                    }
                });
                return this;
            };

            root.CP_CUSTOMIZER.addFixedOverlays = function($startNode) {

                $startNode = $startNode || $('body');
                root.CP_CUSTOMIZER.trigger(root.CP_CUSTOMIZER.Events.ADD_FIXED_OVERLAYS, [$startNode]);

            };

            root.CP_CUSTOMIZER.addFixedOverlays();

            $(window).on('scroll', updateOnScroll);
            $(window).on('resize', updateOnResize);

            root.CP_CUSTOMIZER.hoverOverlay = hoverOverlay;
            root.CP_CUSTOMIZER.assignNodeToOverlay = assignNode;


            $(document).on('mouseover', '[data-container-editable],[data-widgets-area],[data-bg="image"]', _.debounce(function() {

                var node = $(this);
                if (node.closest('[data-type=group]').length) {
                    node = $(this).closest('[data-type=group]');
                }


                assignNode(hoverOverlay, node, true);
                hoverOverlay.show();

                if ((node.parents('[data-type=row]').length || node.parents('[data-type=column]').length) && node.siblings().length) {
                    hoverOverlay.find('.remove').show();
                } else {
                    hoverOverlay.find('.remove').hide();
                }
            }, 100));

            $(document).on('mouseover', '[data-content-editable], i.fa', _.debounce(function() {

                var node = $(this);
                if (node.closest('[data-type=group]').length) {
                    node = $(this).closest('[data-type=group]');
                }

                assignNode(hoverOverlay, node);
                hoverOverlay.show();

                if (node.parents('[data-type=row]').length || node.parents('[data-type=column]').length && node.siblings().length) {
                    hoverOverlay.find('.remove').show();
                } else {
                    hoverOverlay.find('.remove').hide();
                }
            }, 100));

            var activeItem;
            $(document).on('click', '[data-container-editable], [data-type=group]', containerEditableHandler);
            $(document).on('click', '[data-container-editable],[data-content-editable], [data-type=group]', updateOverlayPen);


            function updateOverlayPen() {
                root.CP_CUSTOMIZER.hoverOverlay.hide();
            }

            $(document).on('mouseover', '.page-content [data-type="row"] > div, .page-content [data-type="column"]', function() {

                if ($(this).find('[data-type=column]').length) {
                    return;
                }

                if ($(this).parent().is('[data-content-shortcode]')) {
                    return;
                }

                assignNode(addOverlay, $(this));
                addOverlay.show();
            });


            $(document).on('click', 'body [data-content-editable]', function() {
                $(this).focus();
            });

            var cachedValue = "";
            $(document).on('mousedown', '.page-content [data-content-editable]', function(event) {
                cachedValue = $(this).text();
            });

            $(document).on('mouseup', '.page-content [data-content-editable]', function() {
                if ($(this).text() !== cachedValue) {
                    markSave();
                    cachedValue = $(this).text();
                } else {
                    cachedValue = "";
                }
            });

            $(document).on('input', 'body [data-content-editable]', function() {
                if ($(this).is('[data-theme]')) {
                    $(this).data('was-changed', true);
                    return;
                }
                markSave();
            });



            $(document).on('blur', 'body [data-theme]', function() {
                if ($(this).data('was-changed')) {
                    markSave();
                }
            });

            var saveTimeout;

            function markSave() {
                updateOnScroll();
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(function() {
                    root.CP_CUSTOMIZER.saveContent();
                }, 500);
            }


            root.CP_CUSTOMIZER.markSave = markSave;

            root.CP_CUSTOMIZER.mutationObserver.observe(document.querySelector('html'), {
                childList: true,
                attributes: true,
                attributeFilter: ['class', 'style'],
                characterData: true,
                subtree: true
            });


            $(document).on('mouseover', '.page-content > *', function(event) {
                var section = $(this);

                _.delay(function() {
                    if (!section.parent().is('.page-content')) {
                        section = section.parentsUntil('.page-content').last();
                    }

                    root.CP_CUSTOMIZER.focusListItem(section.data('id'));
                }, 0);
            });

        }

        function updateCustomizer($) {
            root.CP_CUSTOMIZER.populateFullRowsList();
            root.CP_CUSTOMIZER.populateAvailableFullRows();
            var startPosition = -1;
            $('#page_full_rows').sortable({
                appendTo: "body",
                axis: 'y',
                handle: '.reorder-handler',
                start: function(event, ui) {
                    ui.placeholder.width(ui.item[0].offsetWidth);
                    ui.placeholder.height(ui.item[0].offsetHeight);
                    startPosition = ui.item.index();
                },
                sort: function(event, ui) {
                    ui.helper.css('top', '-=140px');
                    ui.helper.css('left', '12px');
                },
                stop: function(event, ui) {
                    var node = ui.item.data('node');
                    var nodes = root.CP_CUSTOMIZER.getRootNode().children().not(node);
                    var newPos = ui.item.index();

                    if (newPos < nodes.length) {
                        nodes.eq(newPos).before(node);
                    } else {
                        nodes.last().after(node);
                    }

                    root.CP_CUSTOMIZER.saveContent();
                    updateOnScroll();
                }
            });

            // sections managment
            if (!root.reikiCustomizerPage.has_home_page) {
                $('.reiki-needed-container[data-type="activate"]').show();
                $('.sections-list-reorder').hide();
            } else

                // if has homepage 
                if (root.reikiCustomizerPage.is_home_page_active) {
                    if (!root.reikiCustomizerPage.is_reiki_home_page) {
                        $('.reiki-needed-container[data-type="select"]').show();
                        $('.sections-list-reorder').hide();
                    }
                } else {
                    if (!root.reikiCustomizerPage.is_reiki_home_page) {
                        $('.reiki-needed-container[data-type="activate"]').show();
                        $('.sections-list-reorder').hide();
                    } else {
                        $('.reiki-needed-container[data-type="select"]').show();
                        $('.sections-list-reorder').hide();
                    }
                }

            if (!root.reikiCustomizerPage.has_home_page || !root.reikiCustomizerPage.is_reiki_home_page) {
                $(".reiki-needed-container").siblings('ul').addClass('disabled');
                $(".reiki-needed-container").siblings('ul').find("*").andSelf().off();
            }

            $("a.reiki-needed.select").click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (!root.reikiCustomizerPage.is_home_page_active) {
                    root.reikiCreateFrontendPage();
                    return;
                }
                root.window.location = (root.window.location + "").split("?")[0];
            });

            $("a.reiki-needed.activate").click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                root.reikiCreateFrontendPage();
            });

        }

        root.addEventListener('message', function(event) {
            if (event.data === 'reiki_update_customizer') {
                updateCustomizer(root.jQuery);
                root.jQuery('#loader').fadeOut('fast', function() {
                    root.jQuery('#loader').remove();
                });
            }
        });

        root.CP_CUSTOMIZER.cleanClose();


    });
})(jQuery, (top.customizerFrame.reikiCustomizer || (top.customizerFrame.reikiCustomizer = {})), top.customizerFrame);
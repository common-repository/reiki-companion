(function(root, CP_CUSTOMIZER, $) {
    

    CP_CUSTOMIZER.menu = {
        createPrimaryMenu: function() {
            var api = root.wp.customize;
            var customizeId,
                name = name || "Main Menu",
                placeholderId = api.Menus.generatePlaceholderAutoIncrementId();

            customizeId = 'nav_menu[' + String(placeholderId) + ']';

            api.create(customizeId, customizeId, {}, {
                type: 'nav_menu',
                transport: api.Menus.data.settingTransport,
                previewer: api.previewer
            });

            api(customizeId).set($.extend({},
                api.Menus.data.defaultSettingValues.nav_menu, {
                    name: name
                }
            ));


            menuSection = new api.Menus.MenuSection(customizeId, {
                params: {
                    id: customizeId,
                    panel: 'nav_menus',
                    title: name,
                    customizeAction: api.Menus.data.l10n.customizingMenus,
                    type: 'nav_menu',
                    priority: 10,
                    menu_id: placeholderId
                }
            });
            api.section.add(customizeId, menuSection);


            // set location
            api('nav_menu_locations[primary]').set(placeholderId);


            // create home page menu item;

            this.addAnchorToPrimaryMenu('','Home');
        },


        getPrimaryMenuID: function() {
            var menuId = wp.customize('nav_menu_locations[primary]').get();
            if (wp.customize('nav_menu[' + menuId + ']')) {
                return menuId;
            } else {
                return false;
            }
        },

        getPrimaryMenu: function() {
            var menuId = CP_CUSTOMIZER.menu.getPrimaryMenuID();
            if (menuId !== false) {
                return wp.customize('nav_menu[' + menuId + ']').get();
            } else {
                return false;
            }
        },

        focusPrimaryMenuCustomize: function() {
            var menuId = CP_CUSTOMIZER.menu.getPrimaryMenuID();
            if (menuId !== false) {
                wp.customize.section('nav_menu[' + menuId + ']').focus();
                return true;
            }

            return false;
        },

        getPrimaryMenuControl: function() {
            var api = root.wp.customize;
            var menuId = CP_CUSTOMIZER.menu.getPrimaryMenuID();

            if (menuId) {
                return api.Menus.getMenuControl(menuId);
            } else {
                return false;
            }
        },

        addAnchorToPrimaryMenu: function(anchor, title) {
            var api = root.wp.customize;
            var customizeId, placeholderId, settingArgs, setting, menuItemControl, menuId, menuControl, position = 0,
                priority = 10;

            menuId = CP_CUSTOMIZER.menu.getPrimaryMenuID();
            menuControl = CP_CUSTOMIZER.menu.getPrimaryMenuControl();

            if (!menuId || !menuControl) {
                return;
            }

            _.each(menuControl.getMenuItemControls(), function(control) {
                if (false === control.setting()) {
                    return;
                }
                priority = Math.max(priority, control.priority());
                if (0 === control.setting().menu_item_parent) {
                    position = Math.max(position, control.setting().position);
                }
            });
            position += 1;
            priority += 1;

            var item = $.extend({},
                api.Menus.data.defaultSettingValues.nav_menu_item, {
                    'title': title,
                    'url': CP_CUSTOMIZER.SITE_URL + "#" + anchor.replace(/#/, ''),
                    'type': 'custom',
                    'type_label': api.Menus.data.l10n.custom_label,
                    'object': 'custom'
                }, {
                    nav_menu_term_id: menuId,
                    original_title: title,
                    position: position
                });


            placeholderId = api.Menus.generatePlaceholderAutoIncrementId();
            customizeId = 'nav_menu_item[' + String(placeholderId) + ']';
            settingArgs = {
                type: 'nav_menu_item',
                transport: api.Menus.data.settingTransport,
                previewer: api.previewer
            };

            setting = api.create(customizeId, customizeId, {}, settingArgs);
            setting.set(item);

            menuItemControl = new api.controlConstructor.nav_menu_item(customizeId, {
                params: {
                    type: 'nav_menu_item',
                    content: '<li id="customize-control-nav_menu_item-' + String(placeholderId) + '" class="customize-control customize-control-nav_menu_item"></li>',
                    section: menuControl.id,
                    priority: priority,
                    active: true,
                    settings: {
                        'default': customizeId
                    },
                    menu_item_id: placeholderId
                },
                previewer: api.previewer
            });

            api.control.add(customizeId, menuItemControl);
            menuControl.debouncedReflowMenuItems();



        },

        anchorExistsInPrimaryMenu: function(anchor) {
            var menuControl = CP_CUSTOMIZER.menu.getPrimaryMenuControl();

            if (!menuControl) {
                return false;
            }

            anchor = anchor.replace(/#/, '');

            var itemsControl = menuControl.getMenuItemControls();
            for (var i = 0; i < itemsControl.length; i++) {
                var itemControl = itemsControl[i];
                var url = (itemControl.setting.get().url || "").split("#").pop().trim();
                if (url === anchor) {
                    return true;
                }
            }

            return false;
        },


        updatePrimaryMenuAnchor: function(oldAnchor, options) {
            var menuControl = CP_CUSTOMIZER.menu.getPrimaryMenuControl();

            if (!menuControl) {
                return false;
            }

            oldAnchor = oldAnchor.replace(/#/, '');
            var newAnchor = options.anchor.replace(/#/, '');
            var title = options.title;

            var itemsControl = menuControl.getMenuItemControls();
            for (var i = 0; i < itemsControl.length; i++) {
                var itemControl = itemsControl[i];
                var url = (itemControl.setting.get().url || "").split("#").pop().trim();
                if (url === oldAnchor) {
                    var itemData = itemControl.setting();
                    if (itemData) {
                        itemData = _.clone(itemData);
                        itemData.title = title;
                        itemData.url = CP_CUSTOMIZER.SITE_URL + "#" + newAnchor;
                        itemControl.setting.set(itemData);
                         return true;
                    }
                }
            }

            return false;
        },

        removeAnchorFromPrimaryMenu: function(anchor) {
            var api = root.wp.customize;
            var menuControl = CP_CUSTOMIZER.menu.getPrimaryMenuControl();

            if (!menuControl) {
                return false;
            }

            anchor = anchor.replace(/#/, '');

            var itemsControl = menuControl.getMenuItemControls();
            for (var i = 0; i < itemsControl.length; i++) {
                var itemControl = itemsControl[i];
                var url = (itemControl.setting.get().url || "").split("#").pop();
                if (url === anchor) {
                    itemControl.setting.set(false);
                    api.control.remove(itemControl.id);
                    return true;
                }
            }

            return false;
        }
    };

})(top.customizerFrame, top.customizerFrame.CP_CUSTOMIZER, jQuery);
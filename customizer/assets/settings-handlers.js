(function($, wp) {
    var stylesheet = false;

    jQuery(document).ready(function($) {
        var style = jQuery('style[data-name="overlay-opacity"]')[0];
        stylesheet = Array.from(document.styleSheets).filter(function(ss) {
            return ss.ownerNode === style;
        }).pop();
    });

    function setOverlayProperty(prop, value) {
        var rule = (stylesheet.cssRules || stylesheet.rules)[0];
        rule.style.setProperty(prop, value);
    }


    wp.customize('reiki_header_overlay_color', function(value) {
        value.bind(function(to) {
            setOverlayProperty('background-color', to);
        });
    });

    wp.customize('reiki_header_overlay_opacity', function(value) {
        value.bind(function(to) {
            setOverlayProperty('opacity', to / 100);
        });
    });

    wp.customize('reiki_homepage_header', function(value) {
        value.bind(function(to) {
            to = to.length ? to : "none";
            jQuery('.header-homepage').css({
                'transition': 'all .2s linear'
            });

            _.delay(function() {
                jQuery('.header-homepage').css({
                    'background-image': 'url(' + to + ')'
                });
            }, 500);
        });
    });


    wp.customize('reiki_latest_news_read_more', function(value) {
        value.bind(function(to) {
            jQuery('[data-theme=reiki_latest_news_read_more]').html(to);
        });
    });

})(jQuery, wp);
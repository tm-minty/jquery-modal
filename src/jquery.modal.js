/*global jQuery, window, document*/
(function ($) {
    $.fn.modal = function () {
        var args = Array.prototype.slice.call(arguments),
            defaults = {
                closeText: 'Закрыть',
                closeButtonSelector: false,
                iframe: false,
                html: false,
                height: 'auto',
                show: 'auto',
                showOn: 'click',
                width: 'auto',
                onComplete: function () {
                }
            },
            options,
            isMobile = (function (a) {
                var re = new RegExp('android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-', 'i');
                return re.test(a.substr(0, 4));
            }(window.navigator.userAgent || window.navigator.vendor || window.window.opera)),
            methods = {
                alignCenter: function () {
                    var popupCSS = {},
                        windowHeight = $(window).height(),
                        windowWidth = $(window).width(),
                        documentHeight = $(document).height(),
                        documentWidth = $(document).width(),
                        popup = $('#jquery-modal-overlay-popup'),
                        h = parseInt(options.height, 10),
                        w = parseInt(options.width, 10),
                        height = options.height !== 'auto' ? (h > popup.height() ? h : popup.height()) : popup.height(),
                        width = options.width !== 'auto' ? parseInt(options.width, 10) : popup.width();

                    popupCSS.position = 'absolute';
                    popupCSS.top = windowHeight <= height ? 0 : (windowHeight - height) / 2;
                    popupCSS.left = windowWidth <= width ? 0 : (windowWidth - width) / 2;
                    popupCSS.height = height;
                    popupCSS.width = width;

                    if (!isMobile) {
                        if (windowHeight >= height && windowWidth >= width) {
                            popupCSS.position = "fixed";
                        } else {
                            if (documentHeight >= height) {
                                popupCSS.top += $(window).scrollTop();
                            }
                            if (documentWidth >= width) {
                                popupCSS.left += $(window).scrollLeft();
                            }
                        }
                    }
                    popup.css(popupCSS);
                },
                decorator: function () {
                    var begin = '<div id="jquery-modal-overlay" ' + (isMobile ? 'class="mobile"' : '') + '><div id="jquery-modal-overlay-popup">',
                        end = (!!options.closeText ? '<a id="jquery-modal-overlay-popup-close">' + options.closeText + '</a>' : '') + '</div></div>';
                    return [begin, end];
                },
                hide: function () {
                    // Используя detach() вместо remove(), cохраняем данные в html
                    // на случай повтороного открытия модального окна.
                    $('#jquery-modal-overlay').detach();
                    $(window).unbind('resize', methods.resize).unbind('scroll', methods.alignCenter);
                },
                iframe: function (src) {
                    var decorator = methods.decorator(),
                        iframe = '<iframe src="' + src + '" frameborder="0" id="jquery-modal-iframe" name="jquery-modal-iframe" class="jquery-modal-iframe" allowTransparency></iframe>',
                        html = decorator[0] + iframe + decorator[1];
                    $(document.body).append(html);
                    $('#jquery-modal-iframe').ready(options.onComplete);
                    methods.show();

                    return false;
                },
                resize: function () {
//                    console.log("resize");
                    methods.alignCenter();
                    if (!isMobile && $(window).height() - 100 >= options.height) {
                        $(window).bind('scroll', methods.alignCenter);
                    } else {
                        $(window).unbind('scroll', methods.alignCenter);
                    }
                },
                show: function () {
                    var overlay = $('#jquery-modal-overlay'),
                        iframe = $('#jquery-modal-iframe'),
                        popup = $('#jquery-modal-overlay-popup');
                    if (overlay.length > 0) {
                        if ($(document).width() > overlay.width()) {
                            overlay.width($(document).width());
                        }

                        if ($(document).height() > overlay.height()) {
                            overlay.height($(document).height());
                        }

                        $('#jquery-modal-overlay-popup-close' + (options.closeButtonSelector ? ', ' + options.closeButtonSelector : '')).bind('click', methods.hide);
                        overlay.bind('click', methods.hide).children().bind('click', function (e) {
                            e.stopPropagation();
                        });
                        if ($.browser.msie) {
                            overlay.show();
                        } else {
                            overlay.fadeIn('fast');
                        }

                        if (iframe.length > 0) {
                            if (options.width !== 'auto') {
                                iframe.attr('width', options.width);
                            }
                            if (options.height !== 'auto') {
                                iframe.attr('height', options.height);
                            }
                        }

                        methods.alignCenter();
                        $(window).bind('resize', methods.resize).trigger('resize');
                    }

                    return this;
                }
            };

        if (typeof args[0] === 'object') {
            options = args[0];
        } else {
            return methods[args[0]].call(this);
        }

        options = $.extend(defaults, options);

        $.fn.modalClose = methods.hide;

        return $(this).each(function () {
            var decorator, modal,
                nodeName = $(this)[0].nodeName;
            if (nodeName === 'A' && !options.html) {
                $(this).bind('click', function () {
                    methods.iframe($(this).attr('href'));
                    return false;
                });
            } else if (nodeName === 'A' && !!options.html) {
                $(this)
                    .bind(options.showOn, function () {
                        var decorator = methods.decorator(),
                            modal;
                        if (typeof options.html === 'object') {
                            modal = $(decorator[0] + decorator[1]);
                            modal.find('#jquery-modal-overlay-popup').prepend(options.html);
                        } else {
                            modal = $(decorator[0] + options.html + decorator[1]);
                        }
                        $(document.body).append(modal);
                        methods.show();
                        options.onComplete.apply(this);
                        return false;
                    });
            } else if (!!options.html) {
                decorator = methods.decorator();
                if (typeof options.html === 'object') {
                    modal = $(decorator[0] + decorator[1]);
                    modal.find('#jquery-modal-overlay-popup').prepend(options.html);
                } else {
                    modal = $(decorator[0] + options.html + decorator[1]);
                }
                $(document.body).append(modal);
                if (options.show !== 'auto') {
                    modal.hide();
                    $(options.show).bind(options.showOn, function () {
                        methods.show();
                        options.onComplete.apply(this);
                    });
                } else {
                    methods.show();
                    options.onComplete.apply(this);
                }
            }
        });
    };
}(jQuery));
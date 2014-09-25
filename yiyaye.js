var keyCommands = {
    106: function (el) { /* j */
        while ((el = el.nextSibling) && el.nodeType !== 9) {
            if (el.nodeType === 1 && el.nodeName == 'A' &&
                el.getAttribute('title') == 'Select') {
                el.focus();
                break;
            }
        }
    },
    107: function (el) { /* k */
        while ((el = el.previousSibling) && el.nodeType !== 9) {
            if (el.nodeType === 1 && el.nodeName == 'A' &&
                el.getAttribute('title') == 'Select') {
                el.focus();
                break;
            }
        }
    },
    110: 'New', /* n */
    101: 'Edit', /* e */
    99: 'Copy', /* c */
    120: 'Cut', /* x */
    114: 'Replace', /* r */
    119: 'Paste Within', /* w */
    118: 'Paste After', /* v */
    45: 'Contract', /* - */
    61: 'Expand', /* = */
    48: 'Find', /* 0 */
    50: 'Contents', /* 2 */
    51: 'Variables', /* 3 */
    52: 'Files', /* 4 */
    53: 'Templates', /* 5 */
    54: 'Types', /* 6 */
    55: 'Database Upload', /* 7 */
    56: 'Config', /* 8 */
    57: 'Controls', /* 9 */
    49: 'Last Edit' /* 1 */
};

var isTemplatePage = function () {
    return !! document.querySelectorAll('img[alt="Delete Template"]').length;
};

var setupKeyCommands = function () {
    document.addEventListener('keypress', function (evt) {
        var command = keyCommands[evt.keyCode];

        if (! command || evt.ctrlKey) return;

        var elem;
        var titleElem;

        if (typeof command === 'function') {
            elem = document.activeElement;
            if (elem.toString() === '[object HTMLBodyElement]') {
                elem = document.querySelectorAll('b')[1];
                if (! elem)
                    elem = document.querySelectorAll('a[href^="javascript:document"]')[1];
            }
            command(elem);
        } else if (typeof command === 'string') {
            titleElem = document.querySelector('a[title="' + command + '"]');
            if (titleElem)
                window.location.href = titleElem.href;
        }
    });
};

(function () {
    if (! isTemplatePage()) return;

    setupKeyCommands();
})();

var $ = function (selector, elem) {
    return (elem || document).querySelector(selector);
};
var $$ = function (selector, elem) {
    return (elem || document).querySelectorAll(selector);
};

var rtmlOperators = [
    "<", "<=", "<=>", ">", ">=", "ACCUMULATE", "ACTION", "AND", "APPEND",
    "AS-LIST", "AS-NUMBER", "AS-STRING", "AUCTIONURL", "BASKET",
    "BASKET-MODULE", "BLUE", "BODY", "CALL", "CAPS", "CENTER", "CMP", "COLOGO",
    "COLOR", "COMMENT", "CSS-WITH-LINK", "DIV", "ELEMENT", "ELEMENTS", "EQUALS",
    "EVEN", "FC-BAR", "FC-LOADER", "FIND-ALL", "FIND-ONE", "FONT", "FONT-WIDTH",
    "FOR", "FOR-EACH", "FOR-EACH-BUT", "FOR-EACH-OBJECT", "FORM", "FROM-HEX",
    "FUSE", "GET-ALL-PATHS-TO", "GET-PATH-TO", "GRAB", "GRAYSCALE", "GREEN",
    "HEAD", "HEIGHT", "HEX-ENCODE", "HRULE", "IF", "IMAGE", "IMAGE-REF", "IMG",
    "INDEXED-SORT", "INPUT", "INVENTORY-INFO", "ITEM", "ITEM-INVENTORY",
    "LABEL", "LENGTH", "LINEBREAK", "LINES", "LINK", "LOG", "LOWERCASE",
    "MAKE-LIST", "MAXIMUM", "MAXNUM", "META", "MINIMUM", "MINNUM", "MODULE",
    "MULTI", "NAMED-PROP", "NOBREAK", "NONEMPTY", "NOSCRIPT", "NOT", "NUMBER",
    "OBJID-FROM-STRING", "ONCE", "OR", "ORDER", "ORDER-FORM", "PARAGRAPH",
    "PARAGRAPHS", "PAT-GREP", "PAT-MATCH", "PAT-SUBST", "POSITION", "PRICE",
    "PROMO-CATEGORY", "PROMO-HOME", "PROMO-ITEM", "PROMO-ITEMPAGE", "RED",
    "RENDER", "RETURN-WITH", "REVERSE", "SCRIPT", "SEARCH-FORM", "SEGMENTS",
    "SELECT", "SHIM", "SHOPPING-BANNER", "SOCIAL-SHARE", "SORT", "SPAN",
    "STRCASECMP", "STRCMP", "STRING-APPEND", "STRING-TRIM", "STYLE",
    "SUPER-BAR", "SUPER-LOADER", "SWITCH", "TABLE", "TABLE-CELL", "TABLE-ROW",
    "TAG", "TAG-WHEN", "TEXT", "TEXT-STYLE", "TEXTAREA", "TITLE", "TO",
    "TO-HEX", "TOKENS", "TOPSEARCH", "VALUE", "WHEN", "WHOLE-CONTENTS", "WIDTH",
    "WITH-LINK", "WITH-OBJECT", "WITH=", "WORDBREAK", "YANK", "YFUNCTION"
];

var rtmlKeywords = [
    "nil", ":big", ":bottom", ":center", ":contents", ":download", ":email",
    ":empty", ":empty.", ":fixed", ":help", ":home", ":horizontal", ":icon",
    ":image", ":incised", ":index", ":info", ":info.", ":item.", ":left",
    ":link.", ":main.", ":mall", ":multi-line", ":next", ":no", ":norder.",
    ":normal", ":privacypolicy", ":privacypolicy.", ":quiet", ":raw-html.",
    ":register", ":request", ":right", ":section.", ":show-order", ":solid",
    ":search", ":search.", ":side-buttons", ":solid", ":t", ":text", ":top",
    ":top-buttons", ":two-line", ":up", ":yes", ":variable", ":vertical"
];

var pageActions = [
    {
        name: 'Previous Link',
        keyCode: 106, /* j */
        keyCommand: function (el) {
            while ((el = el.nextSibling) && el.nodeType !== 9) {
                if (el.nodeType === 1 && el.nodeName == 'A' &&
                    el.getAttribute('title') == 'Select') {
                    el.focus();
                    break;
                }
            }
        }
    },
    {
        name: 'Next Link',
        keyCode: 107, /* k */
        keyCommand: function (el) {
            while ((el = el.previousSibling) && el.nodeType !== 9) {
                if (el.nodeType === 1 && el.nodeName == 'A' &&
                    el.getAttribute('title') == 'Select') {
                    el.focus();
                    break;
                }
            }
        }
    },
    {
        name: 'New',
        keyCode: 110 /* n */
    },
    {
        name: 'Edit',
        keyCode: 101 /* e */
    },
    {
        name: 'Copy',
        keyCode: 99 /* c */
    },
    {
        name: 'Cut',
        keyCode: 120 /* x */
    },
    {
        name: 'Replace',
        keyCode: 114 /* r */
    },
    {
        name: 'Paste Within',
        keyCode: 119 /* w */
    },
    {
        name: 'Paste After',
        keyCode: 118 /* v */
    },
    {
        name: 'Contract',
        keyCode: 45 /* - */
    },
    {
        name: 'Expand',
        keyCode: 61 /* = */
    },
    {
        name: 'Find',
        keyCode: 48 /* 0 */
    },
    {
        name: 'Contents',
        keyCode: 50 /* 2 */
    },
    {
        name: 'Variables',
        keyCode: 51 /* 3 */
    },
    {
        name: 'Files',
        keyCode: 52 /* 4 */
    },
    {
        name: 'Templates',
        keyCode: 53 /* 5 */
    },
    {
        name: 'Types',
        keyCode: 54 /* 6 */
    },
    {
        name: 'Database Upload',
        keyCode: 55 /* 7 */
    },
    {
        name: 'Config',
        keyCode: 56 /* 8 */
    },
    {
        name: 'Controls',
        keyCode: 57 /* 9 */
    },
    {
        name: 'Last Edit',
        keyCode: 49 /* 1 */
    },
];

var keyCommands = pageActions.reduce(function (obj, action) {
    obj[action.keyCode] = action.keyCommand ? action.keyCommand : action.name;
    return obj;
}, {});

var isTemplatePage = function () {
    return !! $('img[alt="Delete Template"]');
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
                elem = $$('b')[1];
                if (! elem)
                    elem = $$('a[href^="javascript:document"]')[1];
            }
            command(elem);
        } else if (typeof command === 'string') {
            titleElem = $('a[title="' + command + '"]');
            if (titleElem)
                window.location.href = titleElem.href;
        }
    });
};

var setupStyle = function () {
    var elems = $$('a');

    var i = elems.length;
    var elem, text, j, action, tLink;

    while (i--) {
        elem = elems[i];
        text = elem.textContent;

        if (rtmlOperators.indexOf(text) > -1)
            elem.classList.add('yiyaye-operator');
        else if (rtmlKeywords.indexOf(text) > -1)
            elem.classList.add('yiyaye-keyword');

        if (text.search('@') > -1)
            elem.classList.add('yiyaye-prefix-a');
        else if (text.search(':') > -1)
            elem.classList.add('yiyaye-prefix-b');

        if (elem.href.search(/\?e=/) > -1) {
            elem.previousElementSibling.classList.add('yiyaye-template-link');
        }

        j = pageActions.length;
        while (j--) {
            action = pageActions[j];
            if (action.name === elem.title)
                elem.appendChild(document.createTextNode('(' + String.fromCharCode(action.keyCode) + ')'))
        }
    }

    document.body.classList.add('yiyaye-template');
};

var setupFileUpload = function () {
    [].filter.call($$('form'), function (form) {
        return $('input[type="file"]', form);
    }).forEach(function (form) {
        var file = $('input[type="file"]');
        var text = $('input[type="text"]');
        file.addEventListener('change', function () {
            text.value = file.value.split('\\')[2];
        });
    });
};

(function () {
    if (isTemplatePage()) {
        setupKeyCommands();
        setupStyle();
    }
    setupFileUpload();
})();

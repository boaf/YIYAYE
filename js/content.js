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

var lastButtonSelector = 'body > table:nth-child(1) > tbody > tr:nth-child(2) > td > center > table > tbody > tr > td:last-child';

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
    }
];

var keyCommands = pageActions.reduce(function (obj, action) {
    if (action.keyCommand) {
        obj[action.keyCode] = action.keyCommand;
    } else {
        var targetEl = $('a[title="' + action.name + '"]');
        if (! targetEl) {
            targetEl = $(lastButtonSelector + ' > a');
            pageActions[pageActions.length - 1].name = targetEl.title;
        }
        obj[action.keyCode] = targetEl;
    }
    return obj;
}, {});

var findElementsWithText = function (els, text) {
    return [].filter.call(els, function (el) {
        return el.textContent.match(new RegExp(text));
    });
};

var isTemplatePage = function () {
    return !! $('img[alt="Delete Template"]');
};

var isTemplateListPage = function () {
    return !! findElementsWithText($$('b'), 'Built-In Templates').length;
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
        } else if (command.href) {
            window.location.href = command.href;
        }
    });
};

var setupTemplateStyle = function () {
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
    }

    document.body.classList.add('yiyaye-template');
};

var setupOtherStyle = function () {
    var elems = $$('a');

    var i = elems.length;
    var elem, text, j, action, tLink;

    while (i--) {
        elem = elems[i];
        j = pageActions.length;
        while (j--) {
            action = pageActions[j];
            if (action.name === elem.title)
                elem.innerHTML = elem.title + ' (' +
                                 String.fromCharCode(action.keyCode) + ')';
        }
    }
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

var findWordPages = function () {
    var jobsToDo;

    var finish = function () {
        postMessage({finished: true});
        close();
    };

    var async = function (url, fn) {
        var request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = function () {
            if (request.status == 200)
                fn({success: true, response: request.responseText,
                    templateName: url.match(/\?e=(.+)/)[1]});
            else
                fn({success: false});

            if (--jobsToDo === 0)
                finish();
        };

        request.send();
    };

    var postBack = function (resp) {
        postMessage(resp);
    };

    onmessage = function(data) {
        var urls = JSON.parse(data.data);
        jobsToDo = urls.length;

        console.log(urls);

        for (var i = 0, l = urls.length; i < l; i++) {
            async(urls[i], postBack);
        }
    };
};

var templateRegExSearch = function (regexString, urls, oneFn, finalFn) {
    var workerBlob = new Blob(['(' + findWordPages + ')()'], {type: 'text/javascript'});

    var worker = new Worker(window.URL.createObjectURL(workerBlob));

    worker.onmessage = function (data) {
        data = data.data;
        if (data.success && data.response.match(new RegExp(regexString)))
            oneFn(data.templateName);
        if (data.finished)
            finalFn();
    };

    worker.postMessage(JSON.stringify(urls));
};

var setupTemplateRegExSearch = function () {
    var target = findElementsWithText($$('b'), 'Built-In Templates')[0];
    while ((target = target.parentNode).nodeName != 'TABLE') {
        // safety in case we don't find a table
        if (target.nodeName == 'BODY') return;
    }

    var anchors = $$('a', target.childNodes[0].childNodes[1].childNodes[1]);
    var templateURLs = [].map.call(anchors, function (a) { return a.href; });

    var input = document.createElement('input');
    var label = document.createElement('label');
    label.appendChild(document.createTextNode('Search Templates (regex): '));
    label.appendChild(input);

    var button = document.createElement('button');
    button.textContent = 'Search';

    var spinner = document.createElement('img');
    spinner.src = 'http://www.ajaxload.info/cache/FF/FF/FF/00/00/00/38-0.gif';
    spinner.style.display = 'none';

    button.addEventListener('click', function () {
        if (input.value === '') return;

        spinner.style.display = 'inline';
        templateRegExSearch(input.value, templateURLs, function (templateName) {
            console.log('regex found in template ' + templateName);
            var el = [].filter.call(anchors, function (a) {
                return a.textContent == templateName;
            })[0];
            el.style.background = 'red';
            el.style.fontWeight = 'bold';
            el.style.color = 'white';
            el.style.padding = '1px';
        }, function () {
            spinner.style.display = 'none';
        });
    });

    var search = document.createElement('div');
    search.appendChild(label);
    search.appendChild(button);
    search.appendChild(spinner);

    target.parentNode.insertBefore(search, target);
};

(function () {
    if (isTemplatePage()) {
        setupKeyCommands();
        setupTemplateStyle();
    } else if (isTemplateListPage()) {
        setupTemplateRegExSearch();
    }

    if ($('body').className.match(/sbs_body/))
        setupOtherStyle();
    setupFileUpload();
})();

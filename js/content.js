var DEBUG = false;

var arrProto = Array.prototype;

function log () {
    if (!DEBUG) return;

    var args = [
        '%c YIYAYE Debug %c',
        'background-color:#eee;color:#c23300;display:inline-block;' +
            'padding:2px;',
        ''
    ];
    console.log.apply(console, args.concat(arrProto.slice.call(arguments)));
}

function $ (selector, elem) {
    return (elem || document).querySelector(selector);
}

function $$ (selector, elem) {
    return (elem || document).querySelectorAll(selector);
}


var keyRepeatTimeout = 1000;

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

var lastButtonSelector = 'body > table:nth-child(1) > tbody > tr:nth-child(2)' +
                         ' > td > center > table > tbody > tr > td:last-child';

var pageActions = [
    {
        name: 'Previous Link',
        keyCode: 106, /* j */
        keyCommand: function (el) {
            while ((el = el.nextSibling) && el.nodeType !== 9) {
                if (el.nodeType === 1 && el.nodeName == 'A' &&
                    el.getAttribute('title') == 'Select') {
                    log('Previous link', el);
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
                    log('Next link', el);
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
    {
        name: 'First Link',
        keyCode: 103, /* g */
        repeat: true,
        keyCommand: function () {
            var el = $('.yiyaye-template form pre a');
            if (el) {
                log('Going to first link', el);
                el.focus();
            }
        }
    },
    {
        name: 'Last Link',
        keyCode: 71, /* G */
        keyCommand: function () {
            var el = [].pop.call($$('.yiyaye-template form pre a'));
            if (el) {
                log('Going to last link', el);
                el.focus();
            }
        }
    }
];

var keyCommands = pageActions.reduce(function (obj, action, i) {
    var cmd = {};

    if (action.keyCommand) {
         cmd.cmd = action.keyCommand;
    } else {
        var targetEl;
        if (action.name == 'Last Edit' && (targetEl = $(lastButtonSelector + ' > a'))) {
        } else if (! (targetEl = $('a[title="' + action.name + '"]'))) {
            return obj;
        }
        if (! targetEl) {
            if ((targetEl = $(lastButtonSelector + ' > a'))) {
                pageActions[i].name = targetEl.title;
            } else {
                /* something is wrong, don't do anything... */
                return obj;
            }
        }
        cmd.cmd = targetEl;
    }

    if (action.repeat)
        cmd.repeat = true;

    obj[action.keyCode] = cmd;
    return obj;
}, {});

['forEach', 'reduce', 'map', 'filter'].forEach(function (method) {
    this['_' + method] = function () {
        return arrProto[method].apply(arguments[0], arrProto.slice.call(arguments, 1));
    };
});

var
    isTemplateEditPage = !! $('img[alt="Delete Template"]'),

    isTemplateListPage = !! $('img[alt="Delete Uncalled Templates"]'),

    isTemplateOperatorCreateOrEdit = !! (
        _filter($$('td'), function (el) {
            return el.textContent.match(/Complex: /);
        }).length ||
        ($('input[value="Update"]') && $('a[title="Database Upload"]'))
    ),

    isVariablesOrPageEdit = !! ($('input[value="New Property"]') || $('input[value="Define New Variable"]'));

function setupKeyCommands () {
    var keyStart = null;
    document.addEventListener('keypress', function (evt) {
        var command = keyCommands[evt.keyCode];

        if (! command || evt.ctrlKey) return;

        if (command.repeat) {
            if (keyStart == null) { /* Haven't started repeating yet */
                keyStart = +new Date();
                return;
            } else if ((+new Date()) - keyStart > keyRepeatTimeout) { /* Key repeat timed out */
                keyStart = null;
                return;
            }
        } else if (keyStart != null) {
            keyStart = null;
        }

        var elem;
        var titleElem;

        if (typeof command.cmd === 'function') {
            elem = document.activeElement;
            if (elem.toString() === '[object HTMLBodyElement]') {
                elem = $$('b')[1];
                if (! elem)
                    elem = $$('a[href^="javascript:document"]')[1];
            }
            command.cmd(elem);
        } else if (command.cmd.href) {
            window.location.href = command.cmd.href;
        }
    });
}

function setupTemplateStyle () {
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
}

function setupOtherStyle () {
    var elems = $$('a');

    var i = elems.length;
    var elem, text, j, action, tLink;

    while (i--) {
        elem = elems[i];
        j = pageActions.length;
        while (j--) {
            action = pageActions[j];
            if (action.name === elem.title) {
                log('Adding ' + String.fromCharCode(action.keyCode) + '(' + action.keyCode + ') to ' + elem.title);
                elem.innerHTML = elem.title + ' (' +
                                 String.fromCharCode(action.keyCode) + ')';
            }
        }
    }
}

function setupFileUpload () {
    [].filter.call($$('form'), function (form) {
        return $('input[type="file"]', form);
    }).forEach(function (form) {
        var file = $('input[type="file"]');
        var text = $('input[type="text"]');
        file.addEventListener('change', function () {
            text.value = file.value.split('\\')[2];
        });
    });
}

function findWordPages () {
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
}

function templateRegExSearch (regexString, urls, oneFn, finalFn) {
    var workerBlob = new Blob(['(' + findWordPages + ')()'], {type: 'text/javascript'});

    var worker = new Worker(window.URL.createObjectURL(workerBlob));

    worker.onmessage = function (data) {
        data = data.data;
        if (data.success)
            oneFn(data.templateName, data.response.match(new RegExp(regexString)));
        if (data.finished)
            finalFn();
    };

    worker.postMessage(JSON.stringify(urls));
}

function setupTemplateRegExSearch () {
    var target = _filter($$('td'), function (el) {
        return el.textContent.match(/Built-In Templates/);
    })[0];
    while ((target = target.parentNode).nodeName != 'TABLE') {
        // safety in case we don't find a table
        if (target.nodeName == 'BODY') return;
    }

    var anchors = $$('a', target.childNodes[0].childNodes[1].childNodes[1]);
    var templateURLs = [].map.call(anchors, function (a) { return a.href; });

    var search = document.createElement('div');
    search.style.position = 'relative';
    var resultsDiv = document.createElement('div');
    var styles = {
        position: 'absolute',
        background: 'white',
        boxShadow: '1px 1px 7px 0px hsl(0, 0%, 44%)',
        width: '400px',
        top: '0',
        right: '0',
        padding: '10px'
    };
    var style;
    for (style in styles) resultsDiv.style[style] = styles[style];

    var input = document.createElement('input');
    var label = document.createElement('label');
    label.appendChild(document.createTextNode('Search Templates (regex): '));
    label.appendChild(input);

    var button = document.createElement('button');
    button.textContent = 'Search';

    var spinner = document.createElement('img');
    spinner.src = 'data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAALAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQACwABACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQACwACACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQACwADACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAALAAQALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkEAAsABQAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAALAAYALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkEAAsABwAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA';
    spinner.style.display = 'none';

    var tempNode;

    button.addEventListener('click', function () {
        if (input.value === '') return;

        spinner.style.display = 'inline';
        resultsDiv.innerHTML = '';

        [].forEach.call(anchors, function (a) {
            a.style.background = 'white';
            a.style.padding = '1px';
        });

        templateRegExSearch(input.value, templateURLs, function (templateName, match) {
            var el = [].filter.call(anchors, function (a) {
                return a.textContent == templateName;
            })[0];
            if (match) {
                console.log('regex found in template ' + templateName);

                var tempNode = document.createElement('div');
                tempNode.appendChild(el.cloneNode(true));
                resultsDiv.appendChild(tempNode);

                el.style.background = 'red';
                el.style.fontWeight = 'bold';
                el.style.color = 'white';
            } else {
                el.style.background = '';
            }
        }, function () {
            spinner.style.display = 'none';
            // [].forEach.call(anchors, function (a) {
            //     if (a.style.background == 'white')
            //         a.style.background = '';
            // });
        });
    });

    search.appendChild(label);
    search.appendChild(button);
    search.appendChild(spinner);
    search.appendChild(resultsDiv);

    target.parentNode.insertBefore(search, target);
}

(function () {
    if (isTemplateEditPage || isTemplateOperatorCreateOrEdit)
        setupTemplateStyle();

    if (isTemplateEditPage)
        setupKeyCommands();
    else if (isTemplateListPage)
        setupTemplateRegExSearch();

    if ($('body').className.match(/sbs_body/)) {
        setupOtherStyle();
    }

    var el;
    if (! isVariablesOrPageEdit &&
        (el = ($('select') || $('input[type=text]'))))
            el.focus() && el.select();

    if (el = $('.yiyaye-template form pre b')) {
        window.scrollBy(0, el.getBoundingClientRect().top -
                           (window.outerHeight / 2));
    }

    setupFileUpload();
})();

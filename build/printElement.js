"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printElement = void 0;
// クラスネームの衝突が起こらないように注意が必要
var printOnlyClassName = 'print-element-on-print-only-display';
var noPrintClassName = 'print-element-on-print-display-none';
var pageStyleId = 'print-element-page-style';
var initialization = function () {
    // eslint-disable-next-line max-len
    var pageStyleElement = document.getElementById(pageStyleId);
    if (!pageStyleElement) {
        var styleText = "\n      ." + printOnlyClassName + " { display: none; }\n      @media print {\n        ." + noPrintClassName + " { display: none; }\n        ." + printOnlyClassName + " { display: block; }\n      }\n    ";
        var styleElement = document.createElement('style');
        styleElement.id = pageStyleId;
        styleElement.appendChild(document.createTextNode(styleText));
        document.head.appendChild(styleElement);
    }
};
var setHiddenBody = function (hidden) {
    Array.prototype.forEach.call(document.body.children, function (childElement) {
        if (hidden) {
            childElement.classList.add(noPrintClassName);
        }
        else {
            childElement.classList.remove(noPrintClassName);
        }
    });
};
var createId = function () { return "print-element-" + new Date().getTime(); };
var camelCaseToKebabCase = function (str) {
    return str.replace(/[A-Z]/g, function (matches) { return "-" + matches[0].toLowerCase(); });
};
var createPageStyle = function (attributes) {
    var entries = Object.entries(attributes);
    var propertyList = entries.map(function (entry) { return camelCaseToKebabCase(entry[0]) + ": " + entry[1] + ";"; });
    var pageStyleContent = propertyList.join(' ');
    var pageStyleText = pageStyleContent ? "@page { " + pageStyleContent + " }" : '';
    var pageStyleElement = document.createElement('style');
    pageStyleElement.appendChild(document.createTextNode(pageStyleText));
    return pageStyleElement;
};
/**
 * 指定された要素を印刷する関数
 * セレクタの文字列とDOMエレメントの指定に対応
 * @param { string | function } target 印刷するターゲット<br>セレクタの文字列かDOMエレメントを返す関数を指定可能
 * @param { object } options `pageStyle`と`debug`をオプションで指定可能
 *      `pageStyleOptions` : `@page`セレクタに当てるスタイルをオブジェクトの形式で指定可能
 *      `debug`            : デバッグモードを指定する<br>DOMの用意までして印刷は行わない
 *      `onBeforePrint`    : 印刷の前に実行される<br>第一引数に印刷用に構築したエレメントを渡される
 *      `onAfterPrint`     : 印刷の後に実行される
 * @returns {void}
 */
exports.printElement = function (target, options) {
    if (target === void 0) { target = null; }
    if (options === void 0) { options = {}; }
    var _a = options.pageStyle, pageStyle = _a === void 0 ? {} : _a, _b = options.debug, debug = _b === void 0 ? false : _b, onBeforePrint = options.onBeforePrint, onAfterPrint = options.onAfterPrint;
    var printTarget;
    var pageStyleElement;
    var handleBeforePrint = function (event) {
        initialization();
        if (onBeforePrint) {
            onBeforePrint(event, printTarget, function () {
                if (printTarget) {
                    printTarget.classList.toggle(printOnlyClassName);
                }
            });
        }
        pageStyleElement = createPageStyle(pageStyle);
        var id = createId();
        printTarget = document.createElement('div');
        printTarget.classList.add(printOnlyClassName);
        printTarget.id = id;
        if (typeof target === 'string') {
            var targetElements = document.querySelectorAll(target);
            Array.from(targetElements).forEach(function (targetElement) {
                printTarget.appendChild(targetElement.cloneNode(true));
            });
        }
        else if (typeof target === 'function') {
            var targetElement = target();
            printTarget.appendChild(targetElement && targetElement.cloneNode(true));
        }
        setHiddenBody(true);
        document.head.appendChild(pageStyleElement);
        document.body.appendChild(printTarget);
    };
    var handleAfterPrint = function (event) {
        if (onAfterPrint) {
            onAfterPrint(event);
        }
        if (!debug) {
            if (printTarget) {
                printTarget.remove();
            }
            if (pageStyleElement) {
                pageStyleElement.remove();
            }
            setHiddenBody(false);
        }
    };
    if (target === null && !debug) {
        window.print();
        return;
    }
    window.addEventListener('beforeprint', handleBeforePrint, { once: true });
    window.addEventListener('afterprint', handleAfterPrint, { once: true });
    if (!debug) {
        window.print();
    }
    else {
        console.warn("Use browser's print emulation mode!");
        var beforeprintEvent = new Event('beforeprint');
        var afterprintEvent = new Event('afterprint');
        window.dispatchEvent(beforeprintEvent);
        window.dispatchEvent(afterprintEvent);
    }
};

// クラスネームの衝突が起こらないように注意が必要
const printOnlyClassName = 'print-element-on-print-only-display';
const noPrintClassName = 'print-element-on-print-display-none';
const pageStyleId = 'print-element-page-style';

const initialization = () => {
  // eslint-disable-next-line max-len
  const pageStyleElement = document.getElementById(pageStyleId);
  if (!pageStyleElement) {
    const styleText = `
      .${printOnlyClassName} { display: none; }
      @media print {
        .${noPrintClassName} { display: none; }
        .${printOnlyClassName} { display: block; }
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.id = pageStyleId;
    styleElement.appendChild(document.createTextNode(styleText));
    document.head.appendChild(styleElement);
  }
};

const setHiddenBody = (hidden: boolean) => {
  Array.prototype.forEach.call(document.body.children, (childElement) => {
    if (hidden) {
      childElement.classList.add(noPrintClassName);
    } else {
      childElement.classList.remove(noPrintClassName);
    }
  });
};

const createId = () => `print-element-${new Date().getTime()}`;

const camelCaseToKebabCase = (str: string) =>
  str.replace(/[A-Z]/g, (matches) => `-${matches[0].toLowerCase()}`);

const createPageStyle = (attributes: CssAttributes) => {
  const entries = Object.entries(attributes);
  const propertyList = entries.map(
    (entry) => `${camelCaseToKebabCase(entry[0])}: ${entry[1]};`,
  );
  const pageStyleContent = propertyList.join(' ');
  const pageStyleText = pageStyleContent ? `@page { ${pageStyleContent} }` : '';
  const pageStyleElement = document.createElement('style');
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
export const printElement: PrintFunction = (
  target: PrintTarget = null,
  options: PrintOptions = {},
) => {
  const {
    pageStyle = {},
    debug = false,
    onBeforePrint,
    onAfterPrint,
  } = options;
  let printTarget: Element;
  let pageStyleElement: Element;
  const handleBeforePrint = (event: Event) => {
    initialization();
    if (onBeforePrint) {
      onBeforePrint(event, printTarget, () => {
        if (printTarget) {
          printTarget.classList.toggle(printOnlyClassName);
        }
      });
    }
    pageStyleElement = createPageStyle(pageStyle);
    const id = createId();
    printTarget = document.createElement('div');
    printTarget.classList.add(printOnlyClassName);
    printTarget.id = id;

    if (typeof target === 'string') {
      const targetElements = document.querySelectorAll(target);
      Array.from(targetElements).forEach((targetElement) => {
        printTarget.appendChild(targetElement.cloneNode(true));
      });
    } else if (typeof target === 'function') {
      const targetElement = target();
      printTarget.appendChild(targetElement && targetElement.cloneNode(true));
    }

    setHiddenBody(true);

    document.head.appendChild(pageStyleElement);
    document.body.appendChild(printTarget);
  };

  const handleAfterPrint = (event: Event) => {
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
  } else {
    console.warn("Use browser's print emulation mode!");
    const beforeprintEvent = new Event('beforeprint');
    const afterprintEvent = new Event('afterprint');
    window.dispatchEvent(beforeprintEvent);
    window.dispatchEvent(afterprintEvent);
  }
};

export type CssAttributes = Record<string, unknown>;

export type PrintOptions = {
  pageStyle?: CssAttributes;
  debug?: boolean;
  onBeforePrint?: (
    event: Event,
    element: Element,
    toggleClass: () => void,
  ) => void;
  onAfterPrint?: (event: Event) => void;
};

export type PrintFunction = (
  target: PrintTarget,
  options?: PrintOptions,
) => void;

export type ElementSelector = () => Element;

export type PrintTarget = string | ElementSelector | null;

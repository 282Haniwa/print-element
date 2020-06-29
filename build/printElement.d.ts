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
export declare const printElement: PrintFunction;
export declare type CssAttributes = Record<string, unknown>;
export declare type PrintOptions = {
    pageStyle?: CssAttributes;
    debug?: boolean;
    onBeforePrint?: (event: Event, element: Element, toggleClass: () => void) => void;
    onAfterPrint?: (event: Event) => void;
};
export declare type PrintFunction = (target: PrintTarget, options?: PrintOptions) => void;
export declare type ElementSelector = () => Element;
export declare type PrintTarget = string | ElementSelector | null;

export interface IJSONParseConfig {
    strict?: boolean;
    protoAction?: 'error' | 'ignore' | 'preserve';
    constructorAction?: 'error' | 'ignore' | 'preserve';
    updatePeriod?: number;
    /** 解析到特定地址，必须是数组，当解析完成数组中的某一项时，才会上报，必须 '[]' 结尾。
     * 当路径完全匹配，或者完全解析完成时才会上报，否则都不会上报。
     * ['data', '[]']
      ['data', '[]', 'children', '[]', 'children', '[]']
  
      ['[]']
      ['[]', '[]']
     */
    completeItemPath?: string[];
    jsonCallback: (error: null | Error, data?: {
        done: boolean;
        value: any;
    }) => void;
    /** 当解析完成后，使用原生 parse 解析，如果一样，则不返回。不一样的话返回解析结果。作为兜底策略 */
    diffCallBack?: (data: any, error?: any) => void;
}
export declare function json_parse(options?: IJSONParseConfig): {
    parseGenerate: () => Generator<any, void, any>;
    updateText(newText: string, isEnd: boolean): void;
};

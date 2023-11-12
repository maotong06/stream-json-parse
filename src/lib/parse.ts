// var BigNumber = null;
// import BigNumber from 'bignumber.js'
import { structuralClone, arrayEqual } from './utils'
import isEqual from 'lodash.isequal'
// regexpxs extracted from
// (c) BSD-3-Clause
// https://github.com/fastify/secure-json-parse/graphs/contributors and https://github.com/hapijs/bourne/graphs/contributors

const suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
const suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;

export interface IJSONParseConfig {
  strict?: boolean;
  // storeAsString?: boolean;
  // alwaysParseAsBig?: boolean;
  // useNativeBigInt?: boolean;
  protoAction?: 'error' | 'ignore' | 'preserve';
  constructorAction?: 'error' | 'ignore' | 'preserve';
  updatePeriod?: number;
  /** 解析到特定地址，必须是数组，当解析完成数组中的某一项时，才会上报，必须 arrayItemSymbol 结尾。
   * 当路径完全匹配，或者完全解析完成时才会上报，否则都不会上报。
   * ['data', arrayItemSymbol]
    ['data', arrayItemSymbol, 'children', arrayItemSymbol, 'children', arrayItemSymbol]

    [arrayItemSymbol]
    [arrayItemSymbol, arrayItemSymbol]
   */
  completeItemPath?: (string | Symbol)[];
  jsonCallback: (error: null | Error, done?: boolean, value?: any) => void;
  /** 当解析完成后，使用原生 parse 解析，如果一样，则不返回。不一样的话返回解析结果。作为兜底策略 */
  diffCallBack?: (data: any, isEq: boolean) => void;
}

export const arrayItemSymbol = Symbol('[]')

export function json_parse(options?: IJSONParseConfig) {
  'use strict';

  var _options: IJSONParseConfig = {
    strict: false, // not being strict means do not generate syntax errors for "duplicate key"
    // storeAsString: false, // toggles whether the values should be stored as BigNumber (default) or a string
    // alwaysParseAsBig: false, // toggles whether all numbers should be Big
    // useNativeBigInt: false, // toggles whether to use native BigInt instead of bignumber.js
    protoAction: 'error',
    constructorAction: 'error',
    completeItemPath: undefined as string[] | undefined,
    updatePeriod: 300, // ms
    jsonCallback: () => {},
    diffCallBack: undefined,
  };

  // If there are options, then use them to override the default _options
  if (options !== undefined && options !== null) {
    if (options.strict === true) {
      _options.strict = true;
    }
    // if (options.storeAsString === true) {
    //   _options.storeAsString = true;
    // }
    // _options.alwaysParseAsBig =
    //   options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
    // _options.useNativeBigInt =
    //   options.useNativeBigInt === true ? options.useNativeBigInt : false;
    if (typeof options.completeItemPath !== 'undefined') {
      if (
        Array.isArray(options.completeItemPath) &&
        options.completeItemPath.every((item) => (typeof item === 'string' || item === arrayItemSymbol))
      ) {
        _options.completeItemPath = options.completeItemPath;
      } else {
        throw new Error(
          `Incorrect value for completeItemPath option, must be an array of strings or arrayItemSymbol but passed ${options.completeItemPath}`
        );
      }
    }

    if (typeof options.constructorAction !== 'undefined') {
      if (
        options.constructorAction === 'error' ||
        options.constructorAction === 'ignore' ||
        options.constructorAction === 'preserve'
      ) {
        _options.constructorAction = options.constructorAction;
      } else {
        throw new Error(
          `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`
        );
      }
    }

    if (typeof options.protoAction !== 'undefined') {
      if (
        options.protoAction === 'error' ||
        options.protoAction === 'ignore' ||
        options.protoAction === 'preserve'
      ) {
        _options.protoAction = options.protoAction;
      } else {
        throw new Error(
          `Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`
        );
      }
    }
    if (typeof options?.updatePeriod !== 'undefined') {
      if (
        typeof options?.updatePeriod === 'number' &&
        options?.updatePeriod > 0
      ) {
        _options.updatePeriod = options?.updatePeriod;
      } else {
        throw new Error(
          `Incorrect value for updatePeriod option, must be a number > 0 but passed ${options.updatePeriod}`
        );
      }
    }
    if (typeof options?.jsonCallback === 'function') {
      _options.jsonCallback = options?.jsonCallback;
    } else {
      throw new Error(
        `Incorrect value for jsonCallback option, must be a function but passed ${options.jsonCallback}`
      );
    }
    if (options?.diffCallBack === undefined || typeof options?.diffCallBack === 'function') {
      _options.diffCallBack = options?.diffCallBack;
    } else {
      throw new Error(
        `Incorrect value for diffCallBack option, must be a function but passed ${options.diffCallBack}`
      );
    }
  }

  let at: number, // The index of the current character
    ch: string | number | any, // The current character
    escapee: { [key: string]: string } = {
      '"': '"',
      '\\': '\\',
      '/': '/',
      b: '\b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t',
    },
    text = '',
    // 文本长度
    textLenth = 0,
    // 文本是否结束
    isTextEnd = false,
    // 最终结果
    res: any,
    // 结果发射回调
    seedResCb = async (data: any) => {
      if (isDone || lastCount !== count) {
        lastCount = count
        let sendRes = await structuralClone(data)
        _options.jsonCallback(null, isDone, sendRes)
      }
    },
    // 上次更新时间
    lastUpdateTime = Number(new Date()),
    // 计数器，防止重复上报
    count = 0,
    // 上次更新的结果
    lastCount = -1,
    // 是否完成
    isDone = false,
    // key 栈
    keyStack: (string | Symbol)[] = [],
    // 是否完成单个节点
    isCompleteItem = false,
    // 检查栈是否匹配，并推出
    checkAndPop = () => {
      if (_options.completeItemPath && arrayEqual(keyStack, _options.completeItemPath)) {
        isCompleteItem = true
      } else {
        isCompleteItem = false
      }
      return isCompleteItem
    },
    // 包装updateRes,
    updateResWrap = (updateResFn: Function) => {
      return (val: any) => {
        checkTimeAndCountSendRes()
        updateResFn(val)
      }
    },
    // 检查时间和次数。发送res
    checkTimeAndCountSendRes = () => {
      ++count;
      // 发送一次结果
      let data = Number(new Date())
      if (res !== undefined && data - lastUpdateTime >= _options.updatePeriod!) {
        if (_options.completeItemPath) {
          if (isCompleteItem) {
            lastUpdateTime = data
            seedResCb?.(res)
          }
        } else {
          lastUpdateTime = data
          seedResCb?.(res)
        }
      }
    },
    // 更新函数
    updateRes = updateResWrap((val: any) => {
      res = val
    }),
    error = function (m: string) {
      // Call error when something is wrong.
      const e =  {
        name: 'SyntaxError',
        message: m,
        at: at,
        text: text,
      };
      _options.jsonCallback(e)
      throw e;
    },
    next = function (c?: string) {
      // If a c parameter is provided, verify that it matches the current character.

      if (c && c !== ch) {
        error("Expected '" + c + "' instead of '" + ch + "'");
      }

      // Get the next character. When there are no more characters,
      // return the empty string.

      ch = text.charAt(at);
      at += 1;
      return ch;
    },
    number = function* () {
      // Parse a number value.

      var number,
        string = '';

      if (ch === '-') {
        string = '-';
        (yield* nextValue('-'));
      }
      while (ch >= '0' && ch <= '9') {
        string += ch;
        (yield* nextValue());
      }
      if (ch === '.') {
        string += '.';
        while ((yield* nextValue()) && ch >= '0' && ch <= '9') {
          string += ch;
        }
      }
      if (ch === 'e' || ch === 'E') {
        string += ch;
        (yield* nextValue());
        if (ch === '-' || ch === '+') {
          string += ch;
          (yield* nextValue());
        }
        while (ch >= '0' && ch <= '9') {
          string += ch;
          (yield* nextValue());
        }
      }
      number = +string;
      if (!isFinite(number)) {
        error('Bad number');
      } else {
        // if (BigNumber == null) BigNumber = require('bignumber.js');
        // if (Number.isSafeInteger(number)) {
        //   let _res =  !_options.alwaysParseAsBig
        //     ? number
        //     : _options.useNativeBigInt
        //     ? BigInt(number)
        //     : new BigNumber(number);
        //   updateRes(_res)
        //   return _res
        // } else {
        //     // Number with fractional part should be treated as number(double) including big integers in scientific notation, i.e 1.79e+308
        //     let _res = _options.storeAsString
        //     ? string
        //     : /[\.eE]/.test(string)
        //     ? number
        //     : _options.useNativeBigInt
        //     ? BigInt(string)
        //     : new BigNumber(string);
        //     updateRes(_res)
        //     return _res
        //   }

        updateRes(number)
        return number
      }
    },
    string = function* () {
      // Parse a string value.

      var hex,
        i,
        string = '',
        uffff;

      // When parsing for string values, we must look for " and \ characters.

      if (ch === '"') {
        var startAt = at;
        while ((yield* nextValue())) {
          if (ch === '"') {
            if (at - 1 > startAt) string += text.substring(startAt, at - 1);
            (yield* nextValue());
            updateRes(string)
            return string;
          }
          if (ch === '\\') {
            if (at - 1 > startAt) string += text.substring(startAt, at - 1);
            (yield* nextValue());
            if (ch === 'u') {
              uffff = 0;
              for (i = 0; i < 4; i += 1) {
                hex = parseInt((yield* nextValue()), 16);
                if (!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }
              string += String.fromCharCode(uffff);
            } else if (typeof escapee[ch] === 'string') {
              string += escapee[ch];
            } else {
              break;
            }
            startAt = at;
          }
        }
      }
      error('Bad string');
    },
    white = function* () {
      // Skip whitespace.

      while (ch && ch <= ' ') {
        (yield* nextValue());
      }
    },
    word = function* () {
      // true, false, or null.

      switch (ch) {
        case 't':
          (yield* nextValue('t'));
          (yield* nextValue('r'));
          (yield* nextValue('u'));
          (yield* nextValue('e'));
          updateRes(true);
          return true;
        case 'f':
          (yield* nextValue('f'));
          (yield* nextValue('a'));
          (yield* nextValue('l'));
          (yield* nextValue('s'));
          (yield* nextValue('e'));
          updateRes(false);
          return false;
        case 'n':
          (yield* nextValue('n'));
          (yield* nextValue('u'));
          (yield* nextValue('l'));
          (yield* nextValue('l'));
          updateRes(null);
          return null;
      }
      error("Unexpected '" + ch + "'");
    },
    value: () => any, // Place holder for the value function.
    array = function* () {
      // Parse an array value.
      const currentArray: any[] = [];
      function arrUpdateRes(val: any) {
        currentArray.push(val)
      }
      function checkAndSend() {
        checkAndPop();
        if (isCompleteItem) {
          checkTimeAndCountSendRes()
        }
      }
      if (ch === '[') {
        (yield* nextValue('['));
        yield* white();
        updateRes(currentArray)
        keyStack.push(arrayItemSymbol)
        if (ch === ']') {
          (yield* nextValue(']'));
          checkAndSend()
          keyStack.pop();
          return currentArray; // empty array
        }
        while (ch) {
          // currentArray.push(value());
          updateRes = updateResWrap(arrUpdateRes)
          yield* value();
          yield* white();
          if (ch === ']') {
            (yield* nextValue(']'));
            checkAndSend()
            keyStack.pop()
            return currentArray;
          }
          (yield* nextValue(','));
          checkAndSend()
          yield* white();
        }
      }
      error('Bad array');
    },
    object = function* () {
      // Parse an object value.
  
      let currentObject = Object.create(null);
      function objUpdateRes(key: string) {
        return (val: any) => {
          currentObject[key] = val
        }
      }
  
      if (ch === '{') {
        isCompleteItem = false
        updateRes(currentObject);
        (yield* nextValue('{'));
        yield* white();
        if (ch === '}') {
          (yield* nextValue('}'));
          checkAndPop()
          return currentObject; // empty object
        }
        while (ch) {
          let key = ''
          updateRes = updateResWrap((newKey: string) => {
            currentObject[newKey] = null
            key = newKey
          })
          yield* string();
          keyStack.push(key)
          isCompleteItem = false
          updateRes = updateResWrap(objUpdateRes(key))
          yield* white();
          (yield* nextValue(':'));
          if (
            _options.strict === true &&
            Object.hasOwnProperty.call(currentObject, key)
          ) {
            error('Duplicate key "' + key + '"');
          }
  
          if (suspectProtoRx.test(key) === true) {
            if (_options.protoAction === 'error') {
              error('Object contains forbidden prototype property');
            }
            else if (_options.protoAction === 'ignore') {
              const _updateRes = updateRes;
              updateRes = () => {}
              delete currentObject[key]
              yield* value();
              updateRes = _updateRes
            }
            else {
              yield* value();
            }
          } else if (suspectConstructorRx.test(key) === true) {
            if (_options.constructorAction === 'error') {
              error('Object contains forbidden constructor property');
            }
            else if (_options.constructorAction === 'ignore') {
              const _updateRes = updateRes;
              updateRes = () => {}
              delete currentObject[key]
              yield* value();
              updateRes = _updateRes
            }
            else {
              yield* value();
            }
          } else {
            yield* value();
          }
  
          yield* white();
          if (ch === '}') {
            (yield* nextValue('}'));
            keyStack.pop()
            checkAndPop()
            return currentObject;
          }
          (yield* nextValue(','));
          keyStack.pop()
          yield* white();
        }
      }
      error('Bad object');
    };

  value = function* () {
    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.

    yield* white();
    switch (ch) {
      case '{':
        yield* object();
        break;
      case '[':
        yield* array();
        break;
      case '"':
        yield* string();
        break;
      case '-':
        yield* number();
        break;
      default:
        ch >= '0' && ch <= '9' ? (yield* number()) : (yield* word());
    }
  };
  function* nextValue (c?: string): Generator<any, any, any> {
    if (isTextEnd) {
      return next(c)
    } else {
      if (at === textLenth) {
        yield
      }
      return next(c)
    }
  }

  // Return the json_parse function. It will have access to all of the above
  // functions and variables.

  return {
    parseGenerate: function* parseGenerate() {
      at = 0;
      ch = ' ';
      yield* value();
      yield* white();
      isDone = true
      if (ch) {
        error('Syntax error');
      } else {
        seedResCb(res)
        if (_options.diffCallBack) {
          setTimeout(() =>  {
            let parseRes = JSON.parse(text)
            _options.diffCallBack?.(parseRes, isEqual(res, parseRes))
          })
        }
      }
    },
    updateText(newText: string, isEnd: boolean) {
      text += newText
      textLenth += newText.length
      isTextEnd = isEnd
    }
  }
};


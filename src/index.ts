import { jsonParse, IJSONParseConfig } from './lib/parse'

export { arrayItemSymbol } from './lib/parse'

export function createJsonParseWritableStream(JSONParseOption: IJSONParseConfig) {
  let parseGenerate: ReturnType<typeof jsonParse>['parseGenerate']
  let updateText: ReturnType<typeof jsonParse>['updateText']
  let parseCtrl: Generator<any, void, any>

  const jsonParseStream = new WritableStream({
    start() {
      const parseReturn = jsonParse(JSONParseOption)
      parseGenerate = parseReturn.parseGenerate
      updateText = parseReturn.updateText
      parseCtrl = parseGenerate()
      parseCtrl.next()
    },
    write(chunk) {
      try {
        updateText(chunk, false);
        parseCtrl.next()
        return Promise.resolve()
      } catch (error: any) {
        console.error(error)
        // 这里不做打断，等待fetch请求完成
      }
    },
    close() {
      updateText('', true);
      parseCtrl.next();
    },
    abort(reason) {
      parseCtrl.throw(reason);
    }
  });

  return jsonParseStream
}
import { jsonParse, IJSONParseConfig } from './lib/parse'

export { arrayItemSymbol } from './lib/parse'

export async function fetchStreamJson({ url, fetchOptions, JSONParseOption }: {
  url: string,
  JSONParseOption: IJSONParseConfig,
  fetchOptions?: RequestInit
}): Promise<void> {
  const {
    parseGenerate,
    updateText,
  } = jsonParse(JSONParseOption)
  const parseCtrl = parseGenerate()
  parseCtrl.next()


  const utf8Decoder = new TextDecoder('utf-8');
  const response = await fetch(url, fetchOptions);
  if (!response.body) {
    throw new Error('response.body is undefined');
  }
  const reader = response.body.getReader();
  let readerDone = false;
  let chunk;

  while(!readerDone) {
    ({ value: chunk, done: readerDone } = await reader.read());
      const chunkText = utf8Decoder.decode(chunk);
      updateText(chunkText, readerDone);
      parseCtrl.next();
  }
}

export function createJsonParseWritableStream(JSONParseOption: IJSONParseConfig) {
  let parseGenerate: ReturnType<typeof jsonParse>['parseGenerate']
  let updateText: ReturnType<typeof jsonParse>['updateText']
  let parseCtrl: Generator<any, void, any>

  const jsonParseStream = new WritableStream({
    start(controller) {
      const parseReturn = jsonParse(JSONParseOption)
      parseGenerate = parseReturn.parseGenerate
      updateText = parseReturn.updateText
      parseCtrl = parseGenerate()
      parseCtrl.next()
    },
    write(chunk, controller) {
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
      updateText(' ', true);
      parseCtrl.next();
    },
    abort(reason) {
      parseCtrl.throw(reason);
    }
  });

  return jsonParseStream
}
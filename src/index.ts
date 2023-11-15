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
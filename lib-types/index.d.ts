import { IJSONParseConfig } from './lib/parse';
export declare function fetchStreamJson({ url, fetchOptions, JSONParseOption }: {
    url: string;
    JSONParseOption: IJSONParseConfig;
    fetchOptions?: RequestInit;
}): Promise<void>;

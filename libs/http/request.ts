import { ContentType, HttpHeader } from './header';

interface RequestOption {
   params?: Record<string, any>;
   headers?: Record<string, string>;
   cookie?: string | Record<string, string>;
   form?: Record<string, any>;
   json?: Record<string, any>;
   body?: string | object;
}

export const doGet = (url: string, option?: RequestOption) => doRequest(url, 'GET', option);

export const doPost = (url: string, option?: RequestOption) => doRequest(url, 'POST', option);

export const doPut = (url: string, option?: RequestOption) => doRequest(url, 'PUT', option);

export const doDelete = (url: string, option?: RequestOption) => doRequest(url, 'DELETE', option);

export const doPatch = (url: string, option?: RequestOption) => doRequest(url, 'PATCH', option);

export function doRequest(
   url: string,
   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
   option?: RequestOption,
) {
   const init = { method: method } as RequestInit;
   // search params
   if (option?.params) {
      url = `${url}?${encodeRecord(option.params)}`;
   }
   // headers
   init.headers = option?.headers || {};
   // cookie
   if (typeof option?.cookie == 'string') {
      init.headers[HttpHeader.COOKIE] = option.cookie;
   } else if (typeof option?.cookie == 'object') {
      init.headers[HttpHeader.COOKIE] = encodeRecord(option.cookie, '; ');
   }
   // body
   if (option?.form) {
      init.headers[HttpHeader.CONTENT_TYPE] = ContentType.FORM;
      init.body = encodeRecord(option.form);
   } else if (option?.json) {
      init.headers[HttpHeader.CONTENT_TYPE] = ContentType.JSON;
      init.body = JSON.stringify(option.json);
   } else if (option?.body) {
      if (typeof option.body == 'string') {
         init.body = option.body;
      } else if (typeof option.body == 'object') {
         init.body = JSON.stringify(option.body);
      }
   }
   // do fetch
   return fetch(url, init);
}

const encodeRecord = (data: Record<string, any>, join: string = '&') =>
   Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join(join);

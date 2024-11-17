import { describe, expect, it } from 'vitest';
import { doDelete, doGet, doPatch, doPost, doPut } from './request';

const getBody = async (response: Promise<Response>) => (await response).json<Record<string, any>>();

describe('request', () => {
   it('get', async () => {
      const body = await getBody(doGet('https://httpbin.org/get', { params: { key: 'value' } }));
      expect(body.args.key).toBe('value');
   });

   it('post', async () => {
      let body;
      // form
      body = await getBody(doPost('https://httpbin.org/post', { form: { key: 'value' } }));
      expect(body.form.key).toBe('value');
      // json
      body = await getBody(doPost('https://httpbin.org/post', { json: { key: 'value' } }));
      expect(body.json.key).toBe('value');
      // raw
      body = await getBody(doPost('https://httpbin.org/post', { body: { key: 'value' } }));
      expect(JSON.parse(body.data).key).toBe('value');
   });

   it('put', async () => {
      const body = await getBody(doPut('https://httpbin.org/put', { json: { key: 'value' } }));
      expect(body.json.key).toBe('value');
   });

   it('delete', async () => {
      const body = await getBody(
         doDelete('https://httpbin.org/delete', { json: { key: 'value' } }),
      );
      expect(body.json.key).toBe('value');
   });

   it('patch', async () => {
      const body = await getBody(doPatch('https://httpbin.org/patch', { json: { key: 'value' } }));
      expect(body.json.key).toBe('value');
   });
});

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import bunnet from '..';
import { notFoundPage } from '../src/utils/utils';
import { Server } from 'bun';
import { RequestMethodType } from '../src/utils/types';

const app = bunnet();

app.get('/GET', (req, res) => {
	res.json(req.query);
});

app.head('/HEAD', (_, res) => {
	const headers = { method: 'HEAD' };

	res.headers(headers).send(null);
});

app.post('/POST', (req, res) => {
	res.json(req.query);
});

app.put('/PUT', (req, res) => {
	res.json(req.query);
});

app.delete('/DELETE', (req, res) => {
	res.json(req.query);
});

app.connect('/CONNECT', (req, res) => {
	res.json(req.query);
});

app.options('/OPTIONS', (_, res) => {
	const headers = { method: 'OPTIONS' };

	res.headers(headers).send(null);
});

app.trace('/TRACE', (_, res) => {
	const headers = { method: 'TRACE' };

	res.headers(headers).send(null);
});

app.patch('/PATCH', (req, res) => {
	res.json(req.query);
});

const BASE_URL = 'http://localhost:';
const PORT = 3000;

describe('bunNET http server', () => {
	let server: Server | undefined;

	const methodsWithResponseBody: RequestMethodType[] = ['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'PATCH'];
	const methodsWithoutResponseBody: RequestMethodType[] = ['HEAD', 'OPTIONS', 'TRACE'];
	const pathname = '/test';

	const urlParamsString = '?server=http&server=bunNET&protocol=TCP&method=';
	const urlParamsDict = { server: ['http', 'bunNET'], protocol: 'TCP', method: '' };

	beforeAll(() => {
		server = app.listen(PORT);
	});

	afterAll(() => {
		if (server !== undefined) server.stop();
	});

	methodsWithResponseBody.forEach((method) => {
		test(method, async () => {
			const url = BASE_URL + PORT + `/${method}` + urlParamsString + method;
			urlParamsDict.method = method;

			const res = await fetch(url, { method });

			expect(res.status).toBe(200);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.json()).toEqual(urlParamsDict);
		});

		test(method + ' NOT FOUND', async () => {
			const res = await fetch(BASE_URL + PORT + pathname, { method });

			expect(res.status).toBe(404);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.text()).toBe(notFoundPage(method, pathname));
		});
	});

	methodsWithoutResponseBody.forEach((method) => {
		test(method, async () => {
			const res = await fetch(BASE_URL + PORT + `/${method}`, { method });

			expect(res.status).toBe(200);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(res.headers.get('method')).toBe(method);
			expect(await res.text()).toBe('');
		});

		test(method + ' NOT FOUND', async () => {
			const res = await fetch(BASE_URL + PORT + pathname, { method });

			expect(res.status).toBe(404);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.text()).toBe('');
		});
	});
});

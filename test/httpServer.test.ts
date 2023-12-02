import { Server } from 'bun';
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import bunnet from '..';
import type { RequestMethodType } from '../src/utils/types';
import { notFoundPage } from '../src/utils/utils';
import { router } from './router';

const app = new bunnet();

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

const ROUTER_PREFIX = 'router';

app.addRouter(ROUTER_PREFIX, router);

describe('bunNET http server', () => {
	const BASE_URL = 'http://localhost';
	const PORT = 3000;
	const NOT_FOUND = 'NOT FOUND';
	const NOT_EXISTING_ROUTE = 'test';

	let server: Server | undefined;

	const methodsWithResponseBody: RequestMethodType[] = ['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'PATCH'];
	const methodsWithoutResponseBody: RequestMethodType[] = ['HEAD', 'OPTIONS', 'TRACE'];

	const urlParamsString = 'server=http&server=bunNET&protocol=TCP';
	const urlParamsDict = { server: ['http', 'bunNET'], protocol: 'TCP', method: '' };

	beforeAll(() => {
		server = app.listen(PORT);
	});

	afterAll(() => {
		if (server !== undefined) server.stop();
	});

	methodsWithResponseBody.forEach((method) => {
		test(method, async () => {
			const url = `${BASE_URL}:${PORT}/${method}?${urlParamsString}&method=${method}`;
			const currentUrlParamsDict = { ...urlParamsDict, method };

			const res = await fetch(url, { method });

			expect(res.status).toBe(200);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.json()).toEqual(currentUrlParamsDict);
		});

		test(`${method} ${NOT_FOUND}`, async () => {
			const currentRoute = `/${NOT_EXISTING_ROUTE}`;
			const url = `${BASE_URL}:${PORT}${currentRoute}`;

			const res = await fetch(url, { method });

			expect(res.status).toBe(404);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.text()).toBe(notFoundPage(method, currentRoute));
		});
	});

	methodsWithoutResponseBody.forEach((method) => {
		test(method, async () => {
			const url = `${BASE_URL}:${PORT}/${method}`;

			const res = await fetch(url, { method });

			expect(res.status).toBe(200);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(res.headers.get('method')).toBe(method);
			expect(await res.text()).toBe('');
		});

		test(`${method} ${NOT_FOUND}`, async () => {
			const url = `${BASE_URL}:${PORT}/${NOT_EXISTING_ROUTE}`;

			const res = await fetch(url, { method });

			expect(res.status).toBe(404);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.text()).toBe('');
		});
	});

	methodsWithResponseBody.forEach((method) => {
		test(`Router ${method}`, async () => {
			const url = `${BASE_URL}:${PORT}/${ROUTER_PREFIX}/${method}?${urlParamsString}&method=${method}`;
			const currentUrlParamsDict = { ...urlParamsDict, method };

			const res = await fetch(url, { method });

			expect(res.status).toBe(200);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.json()).toEqual(currentUrlParamsDict);
		});

		test(`Router ${method} ${NOT_FOUND}`, async () => {
			const currentRoute = `/${ROUTER_PREFIX}/${NOT_EXISTING_ROUTE}`;
			const url = `${BASE_URL}:${PORT}${currentRoute}`;

			const res = await fetch(url, { method });

			expect(res.status).toBe(404);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.text()).toBe(notFoundPage(method, currentRoute));
		});
	});

	methodsWithoutResponseBody.forEach((method) => {
		test(`Router ${method}`, async () => {
			const url = `${BASE_URL}:${PORT}/${ROUTER_PREFIX}/${method}`;

			const res = await fetch(url, { method });

			expect(res.status).toBe(200);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(res.headers.get('method')).toBe(method);
			expect(await res.text()).toBe('');
		});

		test(`Router ${method} ${NOT_FOUND}`, async () => {
			const url = `${BASE_URL}:${PORT}/${ROUTER_PREFIX}/${NOT_EXISTING_ROUTE}`;

			const res = await fetch(url, { method });

			expect(res.status).toBe(404);
			expect(res.headers.get('X-Powered-By')).toBe('bunNET');
			expect(await res.text()).toBe('');
		});
	});
});

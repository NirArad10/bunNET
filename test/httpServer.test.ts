import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import BunNET from '..';
import { fillStringTemplate, notFoundPage } from '../src/utils/utils';
import { Server } from 'bun';

const app = new BunNET();

app.get('/', (req, res) => {
	res.json(req.query);
});

app.head('/', (req, res) => {
	const headers = { method: 'HEAD' };

	res.headers(headers).send(null);
});

app.post('/', (req, res) => {
	res.json(req.query);
});

app.put('/', (req, res) => {
	res.json(req.query);
});

app.delete('/', (req, res) => {
	res.json(req.query);
});

app.connect('/', (req, res) => {
	res.json(req.query);
});

app.options('/', (req, res) => {
	const headers = { method: 'OPTIONS' };

	res.headers(headers).send(null);
});

app.trace('/', (req, res) => {
	const headers = { method: 'TRACE' };

	res.headers(headers).send(null);
});

app.patch('/', (req, res) => {
	res.json(req.query);
});

const BASE_URL = 'http://localhost:';
const PORT = 3000;

describe('bunNET http server', () => {
	let server: Server | undefined;

	const methodsWithResponseBody = ['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'PATCH'];
	const methodsWithoutResponseBody = ['HEAD', 'OPTIONS', 'TRACE'];
	const pathname = '/test';

	const urlParamsString = '?server=bunNET&protocol=TCP&method=';
	const urlParamsDict = { server: 'bunNET', protocol: 'TCP', method: '' };

	beforeAll(() => {
		server = app.listen(PORT);
	});

	afterAll(() => {
		if (server !== undefined) server.stop();
	});

	methodsWithResponseBody.forEach((method) => {
		test(method, async () => {
			const url = BASE_URL + PORT + urlParamsString + method;
			urlParamsDict.method = method;

			try {
				const res = await fetch(url, { method });

				expect(res.status).toBe(200);
				expect(res.headers.get('X-Powered-By')).toBe('bunNET');
				expect(await res.json()).toEqual(urlParamsDict);
			} catch (e) {
				throw e;
			}
		});

		test(method + ' NOT FOUND', async () => {
			try {
				const res = await fetch(BASE_URL + PORT + pathname, { method });

				expect(res.status).toBe(404);
				expect(res.headers.get('X-Powered-By')).toBe('bunNET');
				expect(await res.text()).toBe(fillStringTemplate(notFoundPage, { method, pathname }));
			} catch (e) {
				throw e;
			}
		});
	});

	methodsWithoutResponseBody.forEach((method) => {
		test(method, async () => {
			try {
				const res = await fetch(BASE_URL + PORT, { method });

				expect(res.status).toBe(200);
				expect(res.headers.get('X-Powered-By')).toBe('bunNET');
				expect(res.headers.get('method')).toBe(method);
				expect(await res.text()).toBe('');
			} catch (e) {
				throw e;
			}
		});

		test(method + ' NOT FOUND', async () => {
			try {
				const res = await fetch(BASE_URL + PORT + pathname, { method });

				expect(res.status).toBe(404);
				expect(res.headers.get('X-Powered-By')).toBe('bunNET');
				expect(await res.text()).toBe('');
			} catch (e) {
				throw e;
			}
		});
	});
});

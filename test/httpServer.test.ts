import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import BunNET from '..';
import { fillStringTemplate, notFoundPage } from '../src/utils/utils';
import { Server } from 'bun';

const app = new BunNET();

app.get('/', (req, res) => {
	res.send('GET');
});

app.head('/', (req, res) => {
	const headers = { method: 'HEAD' };

	res.headers(headers).send('');
});

app.post('/', (req, res) => {
	res.send('POST');
});

app.put('/', (req, res) => {
	res.send('PUT');
});

app.delete('/', (req, res) => {
	res.send('DELETE');
});

app.connect('/', (req, res) => {
	res.send('CONNECT');
});

app.options('/', (req, res) => {
	const headers = { method: 'OPTIONS' };

	res.headers(headers).send('');
});

app.trace('/', (req, res) => {
	const headers = { method: 'TRACE' };

	res.headers(headers).send('');
});

app.patch('/', (req, res) => {
	res.send('PATCH');
});

const BASE_URL = 'http://localhost:';
const PORT = 3000;

describe('BunNET http server', () => {
	let server: Server | undefined;

	const methodsWithResponseBody = ['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'PATCH'];
	const methodsWithoutResponseBody = ['HEAD', 'OPTIONS', 'TRACE'];
	const pathname = '/test';

	beforeAll(() => {
		server = app.listen(PORT);
	});

	afterAll(() => {
		if (server !== undefined) server.stop();
	});

	methodsWithResponseBody.forEach((method) => {
		test(method, async () => {
			try {
				const res = await fetch(BASE_URL + PORT, { method });

				expect(res.status).toBe(200);
				expect(res.headers.get('X-Powered-By')).toBe('bunNET');
				expect(await res.text()).toBe(method);
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

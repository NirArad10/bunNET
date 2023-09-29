import { readableStreamToFormData, readableStreamToJSON, readableStreamToText, serve } from 'bun';
import { Router } from '../router/router';
import { Handler } from '../utils/types';
import { BunNETResponse } from './response';
import { BunNETRequest } from './request';

export class BunNET {
	#router = new Router();

	get(urlPostfix: string, handler: Handler) {
		this.#router.get(urlPostfix, handler);
	}

	head(urlPostfix: string, handler: Handler) {
		this.#router.head(urlPostfix, handler);
	}

	post(urlPostfix: string, handler: Handler) {
		this.#router.post(urlPostfix, handler);
	}

	put(urlPostfix: string, handler: Handler) {
		this.#router.put(urlPostfix, handler);
	}

	delete(urlPostfix: string, handler: Handler) {
		this.#router.delete(urlPostfix, handler);
	}

	connect(urlPostfix: string, handler: Handler) {
		this.#router.connect(urlPostfix, handler);
	}

	options(urlPostfix: string, handler: Handler) {
		this.#router.options(urlPostfix, handler);
	}

	trace(urlPostfix: string, handler: Handler) {
		this.#router.trace(urlPostfix, handler);
	}

	patch(urlPostfix: string, handler: Handler) {
		this.#router.patch(urlPostfix, handler);
	}

	listen(port: number, callback?: () => void) {
		return this.#startServer(port, callback);
	}

	#startServer(port: number, callback?: () => void) {
		const router = this.#router;
		const parseRequestBody = this.#parseRequestBody;

		const server = serve({
			port,
			async fetch(request, server) {
				const { pathname, search, searchParams } = new URL(request.url);
				const handler = router.routeToHandler(pathname, request.method);

				if (handler === undefined) return BunNETResponse.pageNotFound(request.method, pathname);

				const body = request.body ? await parseRequestBody(request.body, request.headers) : null;

				const req = new BunNETRequest(body, request.headers, pathname + search, searchParams);
				const res = new BunNETResponse();

				handler(req, res);

				return res.getResponse();
			}
		});

		callback?.();

		return server;
	}

	async #parseRequestBody(requestBody: ReadableStream<any>, headers: Headers) {
		const contentType = headers.get('Content-type');

		if (contentType === 'application/json') return readableStreamToJSON(requestBody);

		if (contentType === 'application/x-www-form-urlencoded') return Bun.readableStreamToFormData(requestBody);

		if (contentType?.startsWith('multipart/form-data')) {
			const boundaryMatch = /boundary=(.*)/.exec(contentType);

			if (boundaryMatch) return readableStreamToFormData(requestBody, boundaryMatch[1]);
			else throw new Error('Boundary not found in multipart/form-data Content-type');
		}

		return readableStreamToText(requestBody);
	}
}

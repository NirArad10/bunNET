import { serve } from 'bun';
import { Router } from '../router/router';
import { BunNETResponse } from './response';
import { fillStringTemplate, notFoundPage } from '../utils/utils';
import { Handler } from '../utils/types';
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

		const server = serve({
			port,
			async fetch(request, server) {
				const { pathname, search, searchParams } = new URL(request.url);

				const handler = router.routeToHandler(pathname, request.method);

				if (handler === undefined) {
					const notFoundHTML = fillStringTemplate(notFoundPage, { method: request.method, pathname: pathname });
					return BunNETResponse.pageNotFound(notFoundHTML);
				} else {
					let body;
					const contentType = request.headers.get('Content-type');

					if (contentType === 'application/x-www-form-urlencoded' || contentType?.startsWith('multipart/form-data')) {
						body = await request.formData();
					} else {
						body = await request.text();

						try {
							body = JSON.parse(body);
						} catch {}
					}

					const req = new BunNETRequest(body, request.headers, pathname + search, searchParams);
					const res = new BunNETResponse();

					handler(req, res);

					return res.getResponse();
				}
			}
		});
		callback?.call(null);
		return server;
	}
}

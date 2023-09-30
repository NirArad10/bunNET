import { Router } from '../router/router';
import { Handler } from '../utils/types';
import { BunNETResponse } from './response';
import { BunNETRequest } from './request';
import { serve } from 'bun';
import { RouteNotFoundError } from '../utils/errors';

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
			async fetch(request, _) {
				const { pathname, search, searchParams } = new URL(request.url);
				const { method, body, headers } = request;

				try {
					const handler = router.routeToHandler(pathname, method);

					const req = new BunNETRequest(body, headers, pathname + search, searchParams);
					const res = new BunNETResponse();

					await handler(req, res);

					return res.getResponse();
				} catch (err) {
					if (err instanceof RouteNotFoundError) return BunNETResponse.pageNotFound(method, pathname);

					throw err;
				}
			}
		});

		callback?.();

		return server;
	}
}

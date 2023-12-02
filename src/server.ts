import { serve } from 'bun';
import { BunNETRequest } from './request';
import { BunNETResponse } from './response';
import { Router } from './router';
import { RouteNotFoundError } from './utils/errors';
import type { Handler, RequestMethodType } from './utils/types';
import { normalizeUrlPath } from './utils/utils';

class BunNET {
	#router = new Router();

	static Router() {
		return new Router();
	}

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

	addRouter(prefixRoute: string, router: Router) {
		this.#router.addRouter(prefixRoute, router);
	}

	listen(port: number, callback?: () => void) {
		return this.#startServer(port, callback);
	}

	#startServer(port: number, callback?: () => void) {
		const router = this.#router;

		const server = serve({
			port,
			async fetch(request) {
				const { pathname, search, searchParams } = new URL(request.url);
				const { method, body, headers } = request;
				const normalizedRoute = normalizeUrlPath(pathname);

				let currentRoute = normalizedRoute;

				try {
					const { route, params, handler } = router.routeToHandler(normalizedRoute, method as RequestMethodType);
					currentRoute = route;

					const req = new BunNETRequest(body, headers, normalizedRoute + search, searchParams, params, route);
					const res = new BunNETResponse();

					await handler(req, res);

					return res.getResponse();
				} catch (err) {
					if (err instanceof RouteNotFoundError)
						return BunNETResponse.pageNotFound(method as RequestMethodType, pathname);

					if (err instanceof Error) console.error(err, '\x1b[31m%s\x1b[0m - /%s failed', method, currentRoute);

					return BunNETResponse.serverError();
				}
			}
		});

		callback?.();

		return server;
	}
}

export default BunNET;

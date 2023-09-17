import { serve } from 'bun';
import { Router } from '../router/router';
import { BungateResponse } from './response';
import { fillStringTemplate, notFoundPage } from '../utils/utils';
import { Handler } from '../utils/types';
import { BungateRequest } from './request';

export class Bungate {
	#router = new Router();

	get(url: string, handler: Handler) {
		this.#router.get(url, handler);
	}

	head(url: string, handler: Handler) {
		this.#router.head(url, handler);
	}

	post(url: string, handler: Handler) {
		this.#router.post(url, handler);
	}

	put(url: string, handler: Handler) {
		this.#router.put(url, handler);
	}

	delete(url: string, handler: Handler) {
		this.#router.delete(url, handler);
	}

	connect(url: string, handler: Handler) {
		this.#router.connect(url, handler);
	}

	options(url: string, handler: Handler) {
		this.#router.options(url, handler);
	}

	trace(url: string, handler: Handler) {
		this.#router.trace(url, handler);
	}

	patch(url: string, handler: Handler) {
		this.#router.patch(url, handler);
	}

	listen(port: number, callback?: () => void) {
		callback?.call(null);
		return this.#startServer(port);
	}

	#startServer(port: number) {
		const router = this.#router;

		return serve({
			port,
			fetch(request, server) {
				const { pathname, searchParams } = new URL(request.url);

				const handler = router.routeToHandler(pathname, request.method);

				if (handler === undefined) {
					const notFoundHTML = fillStringTemplate(notFoundPage, { method: request.method, pathname: pathname });
					return BungateResponse.pageNotFound(notFoundHTML);
				} else {
					const req = new BungateRequest(request, pathname, searchParams);
					const res = new BungateResponse();

					handler(req, res);

					return res.getResponse();
				}
			}
		});
	}
}

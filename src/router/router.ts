import { Handler, requestMethodType } from '../utils/types';

export class Router {
	#requestsMap: Map<string, Map<string, Handler>> = new Map();

	get(url: string, handler: Handler) {
		this.#addRoute('GET', url, handler);
	}

	head(url: string, handler: Handler) {
		this.#addRoute('HEAD', url, handler);
	}

	post(url: string, handler: Handler) {
		this.#addRoute('POST', url, handler);
	}

	put(url: string, handler: Handler) {
		this.#addRoute('PUT', url, handler);
	}

	delete(url: string, handler: Handler) {
		this.#addRoute('DELETE', url, handler);
	}

	connect(url: string, handler: Handler) {
		this.#addRoute('CONNECT', url, handler);
	}

	options(url: string, handler: Handler) {
		this.#addRoute('OPTIONS', url, handler);
	}

	trace(url: string, handler: Handler) {
		this.#addRoute('TRACE', url, handler);
	}

	patch(url: string, handler: Handler) {
		this.#addRoute('PATCH', url, handler);
	}

	#addRoute(method: requestMethodType, url: string, handlerFunction: Handler) {
		if (!this.#requestsMap.has(method)) {
			this.#requestsMap.set(method, new Map());
		}

		const methodMap = this.#requestsMap.get(method);
		methodMap?.set(url, handlerFunction);
	}

	routeToHandler(urlPostfix: string, method: string): Handler | undefined {
		urlPostfix = urlPostfix !== '/' && urlPostfix !== '//' ? urlPostfix.replace(/\/$/, '') : urlPostfix;
		const methodMap = this.#requestsMap.get(method);

		if (methodMap?.has(urlPostfix)) {
			const handler = methodMap.get(urlPostfix);

			if (handler?.call) {
				return handler;
			}
		}
		return undefined;
	}
}

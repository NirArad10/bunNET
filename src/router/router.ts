import { Handler, requestMethodType } from '../utils/types';

export class Router {
	#requestsMap: Map<string, Map<string, Handler>> = new Map();

	get(urlPostfix: string, handler: Handler) {
		this.#addRoute('GET', urlPostfix, handler);
	}

	head(urlPostfix: string, handler: Handler) {
		this.#addRoute('HEAD', urlPostfix, handler);
	}

	post(urlPostfix: string, handler: Handler) {
		this.#addRoute('POST', urlPostfix, handler);
	}

	put(urlPostfix: string, handler: Handler) {
		this.#addRoute('PUT', urlPostfix, handler);
	}

	delete(urlPostfix: string, handler: Handler) {
		this.#addRoute('DELETE', urlPostfix, handler);
	}

	connect(urlPostfix: string, handler: Handler) {
		this.#addRoute('CONNECT', urlPostfix, handler);
	}

	options(urlPostfix: string, handler: Handler) {
		this.#addRoute('OPTIONS', urlPostfix, handler);
	}

	trace(urlPostfix: string, handler: Handler) {
		this.#addRoute('TRACE', urlPostfix, handler);
	}

	patch(urlPostfix: string, handler: Handler) {
		this.#addRoute('PATCH', urlPostfix, handler);
	}

	#addRoute(method: requestMethodType, urlPostfix: string, handlerFunction: Handler) {
		if (!this.#requestsMap.has(method)) {
			this.#requestsMap.set(method, new Map());
		}

		if (!urlPostfix.startsWith('/')) urlPostfix = '/' + urlPostfix;
		if (!urlPostfix.endsWith('/')) urlPostfix += '/';

		const methodMap = this.#requestsMap.get(method);
		methodMap?.set(urlPostfix, handlerFunction);
	}

	routeToHandler(urlPostfix: string, method: string): Handler | undefined {
		if (!urlPostfix.endsWith('/')) urlPostfix += '/';
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

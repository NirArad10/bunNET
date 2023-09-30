import { RouteNotFoundError } from '../utils/errors';
import { Handler, RequestMethodType } from '../utils/types';
import { normalizeUrlPath } from '../utils/utils';

type RequestsMap = Map<string, Map<string, Handler>>;

export class Router {
	#requestsMap: RequestsMap = new Map();

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

	#addRoute(method: RequestMethodType, urlPostfix: string, handlerFunction: Handler) {
		if (!this.#requestsMap.has(method)) this.#requestsMap.set(method, new Map());

		const methodMap = this.#requestsMap.get(method);
		urlPostfix = normalizeUrlPath(urlPostfix);

		methodMap?.set(urlPostfix, handlerFunction);
	}

	routeToHandler(urlPostfix: string, method: string): Handler {
		const methodMap = this.#requestsMap.get(method);

		if (!methodMap) throw new RouteNotFoundError();

		urlPostfix = normalizeUrlPath(urlPostfix);
		const handler = methodMap.get(urlPostfix);

		if (handler) return handler;

		throw new RouteNotFoundError();
	}
}

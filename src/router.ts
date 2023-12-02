import { join } from 'path';
import {
	DuplicatedDynamicParamsError,
	DynamicParamNameError,
	OverlappingRoutesError,
	RouteExistsError,
	RouteNotFoundError
} from './utils/errors';
import type { Handler, RequestMethodType, UrlDynamicParams } from './utils/types';
import { normalizeUrlPath } from './utils/utils';

type MethodMap = Map<string, Handler>;
type RequestsMap = Map<RequestMethodType, MethodMap>;

type RouteHandlerInfo = { route: string; params: UrlDynamicParams; handler: Handler };

const dynamicRouteUrlPattern = /:(?![/])[^/]+/g;
const dynamicParamNamePattern = /^:[a-zA-Z0-9_]+$/;

export class Router {
	#requestsMap: RequestsMap = new Map();

	get(urlPostfix: string, handler: Handler): void {
		this.#addRoute('GET', urlPostfix, handler);
	}

	head(urlPostfix: string, handler: Handler): void {
		this.#addRoute('HEAD', urlPostfix, handler);
	}

	post(urlPostfix: string, handler: Handler): void {
		this.#addRoute('POST', urlPostfix, handler);
	}

	put(urlPostfix: string, handler: Handler): void {
		this.#addRoute('PUT', urlPostfix, handler);
	}

	delete(urlPostfix: string, handler: Handler): void {
		this.#addRoute('DELETE', urlPostfix, handler);
	}

	connect(urlPostfix: string, handler: Handler): void {
		this.#addRoute('CONNECT', urlPostfix, handler);
	}

	options(urlPostfix: string, handler: Handler): void {
		this.#addRoute('OPTIONS', urlPostfix, handler);
	}

	trace(urlPostfix: string, handler: Handler): void {
		this.#addRoute('TRACE', urlPostfix, handler);
	}

	patch(urlPostfix: string, handler: Handler): void {
		this.#addRoute('PATCH', urlPostfix, handler);
	}

	#addRoute(method: RequestMethodType, routeToAdd: string, handlerFunction: Handler): void {
		if (!this.#requestsMap.has(method)) this.#requestsMap.set(method, new Map());

		const methodMap = this.#requestsMap.get(method);
		const normalizedRouteToAdd = normalizeUrlPath(routeToAdd);

		if (methodMap?.has(normalizedRouteToAdd)) throw new RouteExistsError(routeToAdd, method);

		if (dynamicRouteUrlPattern.test(normalizedRouteToAdd)) validateParamsNames(normalizedRouteToAdd);
		if (normalizedRouteToAdd !== '') validateRoute(methodMap, method, normalizedRouteToAdd);

		methodMap?.set(normalizedRouteToAdd, handlerFunction);
	}

	addRouter(prefixRoute: string, router: Router) {
		router.#requestsMap.forEach((methodMap, method) => {
			methodMap.forEach((routeHandler, route) => {
				this.#addRoute(method, join(prefixRoute, route), routeHandler);
			});
		});
	}

	routeToHandler(route: string, method: RequestMethodType): RouteHandlerInfo {
		const methodMap = this.#requestsMap.get(method);
		if (!methodMap) throw new RouteNotFoundError();

		if (!dynamicRouteUrlPattern.test(route)) {
			const handler = methodMap.get(route);
			if (handler) return { route, params: {}, handler };
		}

		if (route !== '') {
			const matchedHandler = matchDynamicRoutes(methodMap, route);
			if (matchedHandler) return matchedHandler;
		}

		throw new RouteNotFoundError();
	}
}

const validateParamsNames = (route: string): void => {
	const dynamicParams = route.match(dynamicRouteUrlPattern);
	const uniqueParams = new Set(dynamicParams);

	if (dynamicParams?.length !== uniqueParams.size) throw new DuplicatedDynamicParamsError(route);

	dynamicParams.forEach((dynamicParam) => {
		if (!dynamicParamNamePattern.test(dynamicParam)) throw new DynamicParamNameError(dynamicParam, route);
	});
};

const validateRoute = (methodMap: MethodMap | undefined, method: RequestMethodType, route: string): void => {
	const normalizedRoute = route.replace(dynamicRouteUrlPattern, ':param');
	const routeSegments = normalizedRoute.split('/');

	for (const currentRoute of methodMap?.keys() ?? []) {
		const normalizedCurrentRoute = currentRoute.replace(dynamicRouteUrlPattern, ':param');

		if (normalizedCurrentRoute === normalizedRoute) throw new RouteExistsError(route, method, currentRoute);

		const currentRouteSegments = normalizedCurrentRoute.split('/');
		if (routeSegments.length !== currentRouteSegments.length) continue;

		if (doRoutesOverlap(routeSegments, currentRouteSegments))
			throw new OverlappingRoutesError(route, currentRoute, method);
	}
};

const doRoutesOverlap = (firstRouteSegments: string[], secondRouteSegments: string[]): boolean => {
	for (let i = 0; i < firstRouteSegments.length; i++) {
		const firstRouteSegment = firstRouteSegments[i];
		const secondRouteSegment = secondRouteSegments[i];

		if (firstRouteSegment === secondRouteSegment) continue;

		const isFirstRouteSegmentDynamic = firstRouteSegment[0] === ':';
		const isSecondRouteSegmentDynamic = secondRouteSegment[0] === ':';

		if (!isFirstRouteSegmentDynamic && !isSecondRouteSegmentDynamic) return false;
	}

	return true;
};

const matchDynamicRoutes = (methodMap: MethodMap, route: string): RouteHandlerInfo | undefined => {
	const routeSegments = route.split('/');

	for (const [potentialMatch, handler] of methodMap.entries()) {
		const potentialMatchSegments = potentialMatch.split('/');

		if (potentialMatchSegments.length !== routeSegments.length) continue;

		let isRouteMatch = true;
		const params: UrlDynamicParams = {};

		for (let i = 0; i < potentialMatchSegments.length; i++) {
			const routeSegment = routeSegments[i];
			const potentialMatchSegment = potentialMatchSegments[i];

			if (potentialMatchSegment[0] === ':') params[potentialMatchSegment.slice(1)] = routeSegment;
			else if (potentialMatchSegment !== routeSegment) {
				isRouteMatch = false;
				break;
			}
		}

		if (isRouteMatch) return { route: potentialMatch, params, handler };
	}
};

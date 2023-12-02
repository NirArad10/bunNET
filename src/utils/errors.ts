import type { RequestMethodType } from './types';

export class RouteNotFoundError extends Error {
	constructor() {
		super('Route not found.');
		this.name = 'RouteNotFoundError';
	}
}

export class RouteExistsError extends Error {
	constructor(route: string, method: RequestMethodType, existingRoute?: string) {
		const message = existingRoute
			? `Route ${route} for method ${method} already exists as ${existingRoute}.`
			: `Route ${route} for method ${method} already exists.`;

		super(message);
		this.name = 'RouteExistsError';
	}
}

export class DynamicParamNameError extends Error {
	constructor(dynamicParam: string, route: string) {
		super(
			`Invalid dynamic route parameter name: '${dynamicParam}' in route ${route}. Parameter names must contain only letters, numbers, and underscores.`
		);
		this.name = 'DynamicParamNameError';
	}
}

export class DuplicatedDynamicParamsError extends Error {
	constructor(route: string) {
		super(`Duplicate dynamic route parameters are not allowed in route ${route}.`);
		this.name = 'DuplicatedDynamicParamsError';
	}
}

export class OverlappingRoutesError extends Error {
	constructor(route: string, currentRoute: string, method: RequestMethodType) {
		super(`Route ${route} overlaps with ${currentRoute} for method ${method}.`);
		this.name = 'OverlappingRoutesError';
	}
}

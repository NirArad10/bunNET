import type { RequestMethodType, UrlParamsObject } from './types';

const consecutiveSlashesPattern = /\/+/g;
const leadingOrTrailingSlashPattern = /^\/|\/$/g;

const htmlNotFoundPagePrefix =
	'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Error</title></head><body><pre>Cannot';
const htmlNotFoundPagePostfix = '</pre></body></html>';

export const notFoundPage = (method: RequestMethodType, pathname: string) =>
	`${htmlNotFoundPagePrefix} ${method} ${pathname}${htmlNotFoundPagePostfix}`;

export const normalizeUrlPath = (path: string): string => {
	return path.replace(consecutiveSlashesPattern, '/').replace(leadingOrTrailingSlashPattern, '');
};

export const parseUrlParameters = (searchParams: URLSearchParams) => {
	const urlParams: UrlParamsObject = {};

	searchParams.forEach((value, key) => {
		if (urlParams[key] === undefined) {
			urlParams[key] = value;
			return;
		}

		if (!Array.isArray(urlParams[key])) urlParams[key] = [urlParams[key] as string];

		(urlParams[key] as string[]).push(value);
	});

	return urlParams;
};

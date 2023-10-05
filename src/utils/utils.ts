import { RequestMethodType, UrlParamsObject } from './types';

const consecutiveSlashesPattern = /\/+/g;
const leadingOrTrailingSlashPattern = /^\/|\/$/g;

export const notFoundPage = (method: RequestMethodType, pathname: string) =>
	`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Error</title></head><body><pre>Cannot ${method} ${pathname}</pre></body></html>`;

export const normalizeUrlPath = (path: string): string => {
	return path.replace(consecutiveSlashesPattern, '/').replace(leadingOrTrailingSlashPattern, '');
};

export const parseUrlParameters = (searchParams: URLSearchParams) => {
	const urlParams: UrlParamsObject = {};

	for (const [key, value] of searchParams.entries()) {
		if (urlParams[key] === undefined) urlParams[key] = value;
		else {
			if (!Array.isArray(urlParams[key])) urlParams[key] = [urlParams[key]] as string[];

			(urlParams[key] as string[]).push(value);
		}
	}

	return urlParams;
};

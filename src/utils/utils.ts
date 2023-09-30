import { urlParamsObject } from './types';

export const notFoundPage =
	'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Error</title></head><body><pre>Cannot ${method} ${pathname}</pre></body></html>';

export const fillStringTemplate = (template: string, data: { [key: string]: string }) => {
	return template.replace(/\${(.*?)}/g, (match, key) => data[key.trim()]);
};

export const normalizeUrlPath = (path: string): string => {
	if (path[0] !== '/') path = '/' + path;
	if (path[path.length - 1] === '/') path = path.slice(0, -1);

	return path;
};

export const parseUrlParameters = (searchParams: URLSearchParams) => {
	const urlParams: urlParamsObject = {};

	for (const [key, value] of searchParams.entries()) {
		if (urlParams[key] === undefined) urlParams[key] = value;
		else {
			if (!Array.isArray(urlParams[key])) urlParams[key] = [urlParams[key]] as string[];

			(urlParams[key] as string[]).push(value);
		}
	}

	return urlParams;
};

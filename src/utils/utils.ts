export const notFoundPage =
	'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Error</title></head><body><pre>Cannot ${method} ${pathname}</pre></body></html>';

export const fillStringTemplate = (template: string, data: { [key: string]: string }) => {
	return template.replace(/\${(.*?)}/g, (match, key) => data[key.trim()]);
};

export const parseUrlParameters = (searchParams: URLSearchParams) => {
	const urlParams: { [key: string]: any } = {};

	for (const [key, value] of searchParams.entries()) {
		if (urlParams[key] === undefined) urlParams[key] = value;
		else {
			if (!Array.isArray(urlParams[key])) urlParams[key] = [urlParams[key]];

			urlParams[key].push(value);
		}
	}

	return urlParams;
};

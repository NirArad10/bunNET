import { parseUrlParameters } from '../utils/utils';

export class BunNETRequest {
	#body: any;
	#headers: Headers;
	#urlPostfix: string;
	#query: { [key: string]: string | string[] };

	constructor(body: any, headers: Headers, urlPostfix: string, searchParams: URLSearchParams) {
		this.#body = body;
		this.#headers = headers;
		this.#urlPostfix = urlPostfix;
		this.#query = parseUrlParameters(searchParams);
	}

	get body() {
		return this.#body;
	}

	get urlPostfix() {
		return this.#urlPostfix;
	}

	get query() {
		return this.#query;
	}

	get headers() {
		return this.#headers;
	}
}

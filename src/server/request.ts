import { toFormDataFromString } from '../utils/multiPartParser';
import { parseUrlParameters } from '../utils/utils';

export class BunNETRequest {
	#text: string;
	#headers: Headers;
	#urlPostfix: string;
	#query: { [key: string]: any } = {};

	constructor(text: string, headers: Headers, urlPostfix: string, searchParams: URLSearchParams) {
		this.#text = text;
		this.#headers = headers;
		this.#urlPostfix = urlPostfix;
		this.#query = parseUrlParameters(searchParams);
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

	text() {
		return this.#text;
	}

	json() {
		try {
			return JSON.parse(this.#text);
		} catch {
			throw new Error('Was not able to parse string to JSON object');
		}
	}

	formData() {
		const contentType = this.#headers.get('content-type');

		if (contentType?.startsWith('application/x-www-form-urlencoded')) {
			const formData = new FormData();
			const parameters = new URLSearchParams(this.#text);

			for (const [name, value] of parameters) {
				formData.append(name, value);
			}

			return formData;
		}

		return toFormDataFromString(this.#text, contentType);
	}
}

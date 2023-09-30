import {
	readableStreamToArray,
	readableStreamToArrayBuffer,
	readableStreamToBlob,
	readableStreamToFormData,
	readableStreamToJSON,
	readableStreamToText
} from 'bun';
import { parseUrlParameters } from '../utils/utils';
import { urlParamsObject } from '../utils/types';

const requestBodyEmpty = 'Request body is empty';

type RequestBody = ReadableStream<Uint8Array> | null;

export class BunNETRequest {
	#body: RequestBody;
	#headers: Headers;
	#urlPostfix: string;
	#query: urlParamsObject;

	constructor(body: RequestBody, headers: Headers, urlPostfix: string, searchParams: URLSearchParams) {
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

	async text() {
		if (!this.#body) throw new Error(requestBodyEmpty);

		return readableStreamToText(this.#body);
	}

	async json() {
		if (!this.#body) throw new Error(requestBodyEmpty);

		return readableStreamToJSON(this.#body);
	}

	async formData() {
		if (!this.#body) throw new Error(requestBodyEmpty);

		const contentType = this.#headers.get('Content-Type');
		if (!contentType) throw new Error('Content-Type header is missing');

		const boundary = /boundary=(.*)/.exec(contentType)?.[1];

		return readableStreamToFormData(this.#body, boundary);
	}

	async blob() {
		if (!this.#body) throw new Error(requestBodyEmpty);

		return readableStreamToBlob(this.#body);
	}

	async array() {
		if (!this.#body) throw new Error(requestBodyEmpty);

		return readableStreamToArray(this.#body);
	}

	async arrayBuffer() {
		if (!this.#body) throw new Error(requestBodyEmpty);

		return readableStreamToArrayBuffer(this.#body);
	}
}

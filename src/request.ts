import {
	readableStreamToText,
	readableStreamToJSON,
	readableStreamToFormData,
	readableStreamToBlob,
	readableStreamToArray,
	readableStreamToArrayBuffer
} from 'bun';
import type { UrlParamsObject, UrlDynamicParams } from './utils/types';
import { parseUrlParameters } from './utils/utils';

const REQUEST_BODY_EMPTY_ERROR = 'Request body is empty';
const boundaryPattern = /boundary=(.*)/;

type RequestBody = ReadableStream | null;

export class BunNETRequest {
	#body: RequestBody;
	#headers: Headers;
	#originalUrl: string;
	#query: UrlParamsObject;
	#params: UrlDynamicParams;
	#route: string;

	constructor(
		body: RequestBody,
		headers: Headers,
		originalUrl: string,
		searchParams: URLSearchParams,
		params: UrlDynamicParams,
		route: string
	) {
		this.#body = body;
		this.#headers = headers;
		this.#originalUrl = originalUrl;
		this.#query = parseUrlParameters(searchParams);
		this.#params = params;
		this.#route = route;
	}

	get body(): RequestBody {
		return this.#body;
	}

	get headers(): Headers {
		return this.#headers;
	}

	get originalUrl(): string {
		return this.#originalUrl;
	}

	get query(): UrlParamsObject {
		return this.#query;
	}

	get params(): UrlDynamicParams {
		return this.#params;
	}

	get route(): string {
		return this.#route;
	}

	#consumeBody(): void {
		this.#body = null;
	}

	#checkBodyNull(): void {
		if (!this.#body) throw new Error(REQUEST_BODY_EMPTY_ERROR);
	}

	#validateContentType(): string {
		const contentType = this.#headers.get('Content-Type');
		if (!contentType) throw new Error('Content-Type header is missing');

		return contentType;
	}

	async text(): Promise<string> {
		this.#checkBodyNull();

		const text = readableStreamToText(this.#body as ReadableStream);
		this.#consumeBody();

		return text;
	}

	async json(): Promise<any> {
		this.#checkBodyNull();

		const contentType = this.#validateContentType();
		if (contentType !== 'application/json') throw new Error('Content-Type header is not valid for JSON data.');

		const json = readableStreamToJSON(this.#body as ReadableStream);
		this.#consumeBody();

		return json;
	}

	async formData(): Promise<FormData> {
		this.#checkBodyNull();

		const contentType = this.#validateContentType();

		if (contentType !== 'application/x-www-form-urlencoded' && !contentType.startsWith('multipart/form-data'))
			throw new Error('Content-Type header is not valid for form data.');

		const boundary = boundaryPattern.exec(contentType)?.[1];

		const formData = readableStreamToFormData(this.#body as ReadableStream, boundary);
		this.#consumeBody();

		return formData;
	}

	async blob(): Promise<Blob> {
		this.#checkBodyNull();

		const blob = readableStreamToBlob(this.#body as ReadableStream);
		this.#consumeBody();

		return blob;
	}

	async array(): Promise<Uint8Array[]> {
		this.#checkBodyNull();

		const array = readableStreamToArray(this.#body as ReadableStream);
		this.#consumeBody();

		return array;
	}

	async arrayBuffer(): Promise<ArrayBuffer> {
		this.#checkBodyNull();

		const arrayBuffer = readableStreamToArrayBuffer(this.#body as ReadableStream);
		this.#consumeBody();

		return arrayBuffer;
	}
}

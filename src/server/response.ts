import { file } from 'bun';
import { fillStringTemplate, notFoundPage } from '../utils/utils';

type ResponseBody = ReadableStream | BlobPart | BlobPart[] | FormData | URLSearchParams | null;

export class BunNETResponse {
	#response?: Response;
	#options: ResponseInit = { headers: { 'X-Powered-By': 'bunNET' } };

	static pageNotFound(method: string, pathname: string) {
		const headers = { 'X-Powered-By': 'bunNET', 'Content-Type': 'text/html' };
		const notFoundHTML = fillStringTemplate(notFoundPage, { method, pathname });

		return new Response(notFoundHTML, { status: 404, headers });
	}

	headers(headers: HeadersInit) {
		this.#options.headers = { ...this.#options.headers, ...headers };
		return this;
	}

	getHeaders() {
		return this.#options.headers;
	}

	status(status: number | bigint) {
		this.#options.status = status;
		return this;
	}

	getStatus() {
		return this.#options.status;
	}

	statusText(statusText: string) {
		this.#options.statusText = statusText;
		return this;
	}

	getStatusText() {
		return this.#options.statusText;
	}

	getOptions() {
		return this.#options;
	}

	send(body: ResponseBody) {
		this.#response = new Response(body, this.#options);
	}

	json(body: object) {
		this.#response = Response.json(body, this.#options);
	}

	sendFile(filePath: string, options?: BlobPropertyBag) {
		this.#response = new Response(file(filePath, options), this.#options);
	}

	getResponse() {
		return this.#response || new Response();
	}
}

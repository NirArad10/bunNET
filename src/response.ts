import { file } from 'bun';
import { notFoundPage } from './utils/utils';
import { RequestMethodType } from './utils/types';

type ResponseBody = ReadableStream | BlobPart | BlobPart[] | FormData | URLSearchParams | null;

export class BunNETResponse {
	#response?: Response;
	#options: ResponseInit = { headers: { 'X-Powered-By': 'bunNET' } };

	static pageNotFound(method: RequestMethodType, pathname: string) {
		const headers = { 'X-Powered-By': 'bunNET', 'Content-Type': 'text/html' };

		return new Response(notFoundPage(method, pathname), { status: 404, headers });
	}

	static serverError() {
		const headers = { 'X-Powered-By': 'bunNET' };

		return new Response('Internal Server Error', { status: 500, headers });
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

	#checkResponseNotSet() {
		if (this.#response) throw new Error('Response cannot be modified after it has been set.');
	}

	send(body: ResponseBody) {
		this.#checkResponseNotSet();
		this.#response = new Response(body, this.#options);
	}

	json(body: object) {
		this.#checkResponseNotSet();
		this.#response = Response.json(body, this.#options);
	}

	async sendFile(filePath: string, options?: BlobPropertyBag) {
		this.#checkResponseNotSet();

		const bunFile = file(filePath, options);
		if (await bunFile.exists()) this.#response = new Response(bunFile, this.#options);
		else {
			this.#response = BunNETResponse.serverError();
			throw new Error(`No such file or directory '${filePath}'`);
		}
	}

	getResponse() {
		return this.#response || new Response();
	}
}

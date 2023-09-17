export class BungateResponse {
	#response?: Response;
	#options: ResponseInit = { headers: { 'X-Powered-By': 'Bungate' } };

	static pageNotFound(notFoundHTML: string) {
		const headers = { 'X-Powered-By': 'Bungate', 'Content-Type': 'text/html' };

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

	send(body: ReadableStream | BlobPart | BlobPart[] | FormData | URLSearchParams | null) {
		this.#response = new Response(body, this.#options);
	}

	json(body: any) {
		this.#response = Response.json(body, this.#options);
	}

	getResponse() {
		return this.#response ? this.#response : new Response();
	}
}

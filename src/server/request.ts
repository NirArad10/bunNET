import { parseUrlParameters } from '../utils/utils';

export class BungateRequest extends Request {
	pathname: string = '';
	query: { [key: string]: any } = {};

	constructor(request: Request, pathname: string, searchParams: URLSearchParams) {
		super(request);

		this.pathname = pathname;
		this.query = parseUrlParameters(searchParams);
	}
}

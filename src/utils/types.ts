import { BunNETRequest } from '../request';
import { BunNETResponse } from '../response';

export type RequestMethodType = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export type Handler = (req: BunNETRequest, res: BunNETResponse) => void | Promise<void>;

export type UrlParamsObject = { [key: string]: string | string[] };

export type UrlDynamicParams = { [key: string]: string };

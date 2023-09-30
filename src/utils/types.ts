import { BunNETRequest } from '../server/request';
import { BunNETResponse } from '../server/response';

export type RequestMethodType = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export type Handler = (req: BunNETRequest, res: BunNETResponse) => void | Promise<void>;

export type urlParamsObject = { [key: string]: string | string[] };

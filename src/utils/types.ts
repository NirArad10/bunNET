import { BunNETRequest } from '../server/request';
import { BunNETResponse } from '../server/response';

export type requestMethodType = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export type Handler = (req: BunNETRequest, res: BunNETResponse) => void | Promise<any>;

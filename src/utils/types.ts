import { BungateRequest } from '../server/request';
import { BungateResponse } from '../server/response';

export type requestMethodType = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export type Handler = (req: BungateRequest, res: BungateResponse) => void | Promise<any>;

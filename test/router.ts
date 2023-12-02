import bunnet from '..';

export const router = bunnet.Router();

router.get('/GET', (req, res) => {
	res.json(req.query);
});

router.head('/HEAD', (_, res) => {
	const headers = { method: 'HEAD' };

	res.headers(headers).send(null);
});

router.post('/POST', (req, res) => {
	res.json(req.query);
});

router.put('/PUT', (req, res) => {
	res.json(req.query);
});

router.delete('/DELETE', (req, res) => {
	res.json(req.query);
});

router.connect('/CONNECT', (req, res) => {
	res.json(req.query);
});

router.options('/OPTIONS', (_, res) => {
	const headers = { method: 'OPTIONS' };

	res.headers(headers).send(null);
});

router.trace('/TRACE', (_, res) => {
	const headers = { method: 'TRACE' };

	res.headers(headers).send(null);
});

router.patch('/PATCH', (req, res) => {
	res.json(req.query);
});

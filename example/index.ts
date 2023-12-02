import bunnet from '..';

const app = bunnet();

app.get('/:server', (req, res) => {
	console.log(req.params.server);

	res.sendFile('index.ts');
});

app.head('/', (req, res) => {
	const headers = { 'Content-type': 'video/mp4' };

	res.headers(headers).send(null);
});

app.post('/', async (req, res) => {
	const jsonBody = await req.json();

	res.json(jsonBody);
});

app.put('/', async (req, res) => {
	console.log(await req.formData());

	res.send('Put');
});

app.delete('/', (req, res) => {
	console.log(req.query);

	res.send('Delete');
});

app.connect('/', (req, res) => {
	res.send('Connect');
});

app.options('/', (req, res) => {
	res.send('Options');
});

app.trace('/', (req, res) => {
	res.send('Trace');
});

app.patch('/', (req, res) => {
	res.send('Patch');
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});

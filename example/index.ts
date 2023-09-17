import Bungate from '..';

const app = new Bungate();

app.get('/', (req, res) => {
	res.send('Get');
});

app.head('/', (req, res) => {
	const headers = { 'Content-type': 'video/mp4' };

	res.headers(headers).send(null);
});

app.post('/', (req, res) => {
	res.send('Post');
});

app.put('/', (req, res) => {
	res.send('Put');
});

app.delete('/', (req, res) => {
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

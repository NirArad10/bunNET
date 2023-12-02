import bunnet from '..';

export const router = bunnet.Router();

router.get('/new', (req, res) => {
	res.send('new');
});

router.post('/old', (req, res) => {
	res.send('old');
});

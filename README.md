# bunNET
![npm](https://img.shields.io/npm/v/bunnet)
![npm](https://img.shields.io/npm/dt/bunnet)
![npm](https://img.shields.io/npm/l/bunnet)
[![CodeFactor](https://www.codefactor.io/repository/github/NirArad10/bunNET/badge)](https://www.codefactor.io/repository/github/NirArad10/bunNET)\
Developer-friendly library for building and managing powerful APIs with ease and efficiency

## Installation

You can install `bunNET` via bun by running the following command:

```bash
bun install bunnet
```

## Usage

To use `bunNET` in your project, follow these steps:

1. Import the `bunnet` singleton into your project and create a class to set up your HTTP server:

```js
import bunnet from 'bunnet';

const app = bunnet();
```

2. Define routes and associated handler functions for different HTTP methods:

```js
app.get('/api/resource', (req, res) => {
	// Your GET request handler logic here
});

app.post('/api/resource', (req, res) => {
	// Your POST request handler logic here
});

// Add more routes as needed...
```

### Dynamic Routes

You can define dynamic routes using `:` in your route paths. For example:

```js
app.get('/api/user/:id', (req, res) => {
	const userId = req.params.id;
	// Your logic to handle requests with a dynamic user ID
});
```

3. **Request Functions**

   The `BunNETRequest` class provides several utility functions for working with the request body:

   - `text()`: Reads the request body as text.
   - `json()`: Parses the request body as JSON.
   - `formData()`: Parses the request body as form data.
   - `blob()`: Reads the request body as a binary blob.
   - `array()`: Reads the request body as an array of bytes.
   - `arrayBuffer()`: Reads the request body as an ArrayBuffer.

   Here's an example of how to use the `text()` and `json()` functions:

   ```js
   app.post('/api/submit', async (req, res) => {
   	try {
   		const requestBodyText = await req.text();
   		const requestBodyJSON = await req.json();

   		// Process the request body data
   		// ...

   		res.send('Request received and processed.');
   	} catch (error) {
   		console.error('Error processing request:', error);
   		res.status(500).send('Internal server error');
   	}
   });
   ```

4. Start the server by specifying a port number:

```js
const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
```

5. Run your application:

```bash
bun your-app.js/ts
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

import { BunNET } from './server/server';

class BunNETSingleton {
	static #instance: BunNET;

	static getInstance(): BunNET {
		if (!BunNETSingleton.#instance) {
			BunNETSingleton.#instance = new BunNET();
		}

		return BunNETSingleton.#instance;
	}
}

export default BunNETSingleton.getInstance;

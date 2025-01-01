import { Results } from './results';

export type CouchRequestPayload = {
	results: Results;
	selectedGestures: string[];
};

import { generateCouchRequest } from '../generate-couch-request';
import { CouchRequestPayload } from '../types/couch-request-payload';
import { Env } from '../types/env';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		if (request.method === 'POST') {
			try {
				const { results, selectedGestures }: CouchRequestPayload = await request.json();

				if (!results || !selectedGestures) {
					return new Response('Missing required fields.', {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

				const generatedRequest = await generateCouchRequest(results, selectedGestures, env.GEMINI_API_KEY);

				return new Response(JSON.stringify({ result: generatedRequest }), {
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error) {
				console.error('Error:', error);
				return new Response(JSON.stringify({ error: 'An error occurred while processing your request.' }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			}
		}

		return new Response('Method not allowed.', {
			status: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	},
};

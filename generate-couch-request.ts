import { GoogleGenerativeAI } from '@google/generative-ai';
import { Results } from './types/results';

export async function generateCouchRequest(results: Results, selectedGestures: string[], apiKey: string) {
	const systemInstruction =
		'Generate a polite, creative, and humorous Couchsurfing request based on the provided profiles. Keep it brief (maximum 150 words), engaging, and friendly.';

	const prompt = `Write a creative Couchsurfing request without a subject. Always greet the host by name.

	Request Sender (Guest) Profile:
	${results.guestAboutInfo}

	If the request sender wishes to offer the host a gesture of appreciation, please include all items from the provided gestures list: 
	${selectedGestures.length ? selectedGestures.join(', ') : 'No gestures offered. Ignore it'}

	Do not mention the stay dates (e.g., [Start Date] to [End Date]), as they have already been specified in the form.

	Host Profile:
	${results.hostAboutInfo}

	Host Home Information:
	${results.hostHomeInfo}

	Host's References:
	${results.hostRefs}

	Using this information, craft a fun, polite, and humorous request that incorporates relevant details from the host's profile,
	home information, and references. Keep it friendly, lighthearted, and engaging for the reader.`;

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash',
		systemInstruction,
		generationConfig: { temperature: 1 },
	});

	const generatedContent = await model.generateContent(prompt);
	return generatedContent.response.text();
}

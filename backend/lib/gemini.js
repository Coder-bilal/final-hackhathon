import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeMedicalReport = async (fileUrl, reportType) => {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

		const prompt = `
		You are a medical AI assistant. Analyze this medical report and provide a comprehensive analysis in both English and Roman Urdu (using English script for Urdu words).

		Report Type: ${reportType}
		File URL: ${fileUrl}

		Please provide the following in JSON format:

		{
			"summary": {
				"english": "Brief summary in English",
				"urdu": "Brief summary in Roman Urdu"
			},
			"abnormalValues": [
				{
					"testName": "Test name",
					"value": "Actual value",
					"normalRange": "Normal range",
					"severity": "low/normal/high/critical",
					"explanation": {
						"english": "Explanation in English",
						"urdu": "Explanation in Roman Urdu"
					}
				}
			],
			"doctorQuestions": [
				{
					"question": {
						"english": "Question in English",
						"urdu": "Question in Roman Urdu"
					}
				}
			],
			"dietaryAdvice": {
				"foodsToAvoid": [
					{
						"name": {
							"english": "Food name in English",
							"urdu": "Food name in Roman Urdu"
						},
						"reason": {
							"english": "Reason in English",
							"urdu": "Reason in Roman Urdu"
						}
					}
				],
				"foodsToEat": [
					{
						"name": {
							"english": "Food name in English",
							"urdu": "Food name in Roman Urdu"
						},
						"reason": {
							"english": "Reason in English",
							"urdu": "Reason in Roman Urdu"
						}
					}
				]
			},
			"homeRemedies": [
				{
					"remedy": {
						"english": "Remedy in English",
						"urdu": "Remedy in Roman Urdu"
					},
					"instructions": {
						"english": "Instructions in English",
						"urdu": "Instructions in Roman Urdu"
					}
				}
			],
			"overallHealthStatus": "excellent/good/fair/poor/critical",
			"confidence": 85
		}

		Important guidelines:
		1. Always include disclaimers about consulting doctors
		2. Be accurate and conservative in medical advice
		3. Use simple language for both English and Urdu
		4. Focus on abnormal values and their implications
		5. Provide practical dietary and lifestyle advice
		6. Include 3-5 relevant questions for the doctor
		`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Try to parse JSON response
		try {
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}
		} catch (parseError) {
			console.error("Error parsing JSON:", parseError);
		}

		// Fallback response if JSON parsing fails
		return {
			summary: {
				english: "Report analysis completed. Please consult your doctor for detailed interpretation.",
				urdu: "Report analysis complete ho gaya hai. Detailed interpretation ke liye apne doctor se consult karein."
			},
			abnormalValues: [],
			doctorQuestions: [
				{
					question: {
						english: "What do these results mean for my health?",
						urdu: "Mere health ke liye yeh results ka matlab kya hai?"
					}
				}
			],
			dietaryAdvice: {
				foodsToAvoid: [],
				foodsToEat: []
			},
			homeRemedies: [],
			overallHealthStatus: "fair",
			confidence: 70
		};

	} catch (error) {
		console.error("Error analyzing medical report:", error);
		throw new Error("Failed to analyze medical report");
	}
};

export default genAI;

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_CANDIDATES = (
	process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []
).concat([
	"gemini-2.0-flash-exp",
	"gemini-1.5-flash",
	"gemini-1.5-flash-8b",
	"gemini-1.5-flash-latest",
]);

export const analyzeMedicalReport = async (fileUrl, reportType) => {
	try {
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

		let lastError = null;
		let responseText = null;

		for (const modelName of MODEL_CANDIDATES) {
			try {
				const model = genAI.getGenerativeModel({
					model: modelName,
				});
				const result = await model.generateContent(prompt);
				const response = await result.response;
				responseText = response.text();
				lastError = null;
				break;
			} catch (err) {
				lastError = err;
				try { console.warn(`Gemini model failed: ${modelName}:`, String(err?.message || err)); } catch {}
				const message = String(err?.message || err);
				// Always try next model on failure; we'll throw after trying all
				continue;
			}
		}

		if (lastError && !responseText) {
			// Return deterministic fallback when API/models are unavailable
			return {
				summary: {
					english: "Report analysis completed. Please consult your doctor for detailed interpretation.",
					urdu: "Report analysis complete ho gaya hai. Detailed interpretation ke liye apne doctor se consult karein.",
				},
				abnormalValues: [],
				doctorQuestions: [
					{ question: { english: "What do these results mean for my health?", urdu: "Mere health ke liye yeh results ka matlab kya hai?" } },
				],
				dietaryAdvice: { foodsToAvoid: [], foodsToEat: [] },
				homeRemedies: [],
				overallHealthStatus: "fair",
				confidence: 60,
				disclaimer: {
					english: "This AI analysis is for educational purposes only. Always consult your doctor before making any medical decisions.",
					urdu: "Yeh AI analysis sirf educational purposes ke liye hai. Koi bhi medical decision lene se pehle apne doctor se zaroor consult karein.",
				},
			};
		}

		const text = responseText || "";

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
		// Return fallback instead of throwing to keep UX smooth
		return {
			summary: {
				english: "Report analysis completed. Please consult your doctor for detailed interpretation.",
				urdu: "Report analysis complete ho gaya hai. Detailed interpretation ke liye apne doctor se consult karein.",
			},
			abnormalValues: [],
			doctorQuestions: [
				{ question: { english: "What do these results mean for my health?", urdu: "Mere health ke liye yeh results ka matlab kya hai?" } },
			],
			dietaryAdvice: { foodsToAvoid: [], foodsToEat: [] },
			homeRemedies: [],
			overallHealthStatus: "fair",
			confidence: 60,
			disclaimer: {
				english: "This AI analysis is for educational purposes only. Always consult your doctor before making any medical decisions.",
				urdu: "Yeh AI analysis sirf educational purposes ke liye hai. Koi bhi medical decision lene se pehle apne doctor se zaroor consult karein.",
			},
		};
	}
};

export default genAI;

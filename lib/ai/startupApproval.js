import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function reviewStartup(startupData) {
  try {
    const prompt = `
You are an AI content moderator. Review the following startup submission and determine if it should be approved.

STARTUP DETAILS:
- Name: ${startupData.name}
- Tagline: ${startupData.tagline}

REJECTION CRITERIA:
- Any indication of gambling content
- Any indication of adult content

APPROVAL CRITERIA:
- Does not contain gambling or adult content indicators

Please respond with a JSON object in this exact format:
{
  "approved": true/false,
  "reason": "Brief explanation of your decision",
  "category": "gambling, adult, or null if approved"
}

Only reject if there are clear signs of gambling or adult content in the name or tagline.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a content moderator. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Validate the response structure
    if (typeof result.approved !== "boolean" || !result.reason) {
      throw new Error("Invalid AI response format");
    }

    return result;
  } catch (error) {
    console.error("Error in AI startup review:", error);

    // Fallback to approval if AI fails
    return {
      approved: true,
      reason: "Approved due to technical issues with review system",
      category: null,
    };
  }
}

// Controllers for Resume AI Enhancements

import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent?.trim()) {
      return res
        .status(400)
        .json({ message: "Missing required field: userContent" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the professional summary of a resume in 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only text.",
        },
        { role: "user", content: userContent },
      ],
    });

    // ✅ Extract correctly for OpenAI-compatible Gemini endpoint
    const enhancedContent =
      response.choices?.[0]?.message?.content || "No text generated";

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Error in enhanceProfessionalSummary:", error);
    return res.status(500).json({ message: error.message });
  }
};

// POST: /api/ai/enhanced-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent?.trim()) {
      return res
        .status(400)
        .json({ message: "Missing required field: userContent" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the job description in 1-2 sentences highlighting key responsibilities and achievements. Use action verbs, quantifiable results where possible. Make it ATS-friendly. Return only text.",
        },
        { role: "user", content: userContent },
      ],
    });

    // ✅ Correct OpenAI-style extraction
    const enhancedContent =
      response.choices?.[0]?.message?.content || "No text generated";

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Error in enhanceJobDescription:", error);
    return res.status(500).json({ message: error.message });
  }
};

// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    

    const userId = req.userId;

    if (!resumeText?.trim()) {
      return res
        .status(400)
        .json({ message: "Missing required field: resumeText" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract structured data from resumes.";
    const userPrompt = `
      Extract data from this resume: ${resumeText}
      Provide the data strictly in this JSON format with no extra text:
      {
        professional_summary: "",
        skills: [],
        personal_info: {
          image: "",
          full_name: "",
          profession: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          website: ""
        },
        experience: [
          {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
          }
        ],
        projects: [
          {
            name: "",
            type: "",
            description: ""
          }
        ],
        education: [
          {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: ""
          }
        ]
      }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    // ✅ Extract OpenAI-compatible Gemini response
    const extractedText = response.choices?.[0]?.message?.content || "{}";

    const parsedData = JSON.parse(extractedText);

    const newResume = await Resume.create({ userId, title, ...parsedData });
    return res.status(201).json({ resumeId: newResume._id });
  } catch (error) {
    console.error("Error in uploadResume:", error);
    return res.status(500).json({ message: error.message });
  }
};

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

//Load environment variables
const genAI = new GoogleGenerativeAI(process.env.GIMINI_API_KEY);



export async function POST(req) {
  try {
    const KeywordResult = await req.json();
    const prompt = `Analysez les mots-clés suivants avec les métriques : ${JSON.stringify(KeywordResult.body)}. Fournissez des insights sur les tendances de recherche, le niveau de concurrence, et proposez des actions potentielles pour chaque mot-clé, proposez aussi que des mots Clés à Longue Traîne. 

Format de sortie pour chaque mot-clé :
- Chaque mot-clé doit être inclus dans une balise avec css text-bold text-2xl <h2 className="text-bold text-2xl"> .
- Les recommandations doivent être dans une balise <p>.
- Les mots-clés similaires doivent être listés dans une <ul>, avec chaque mot-clé dans un <li>.
Résultat attendu en HTML.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Return a plain JavaScript object instead of a React component or DOM element
    return NextResponse.json({
      analysis: result.response.candidates[0].content.parts[0].text
    });
  } catch (error) {
    console.error("Error during keyword analysis:", error);
    return NextResponse.json({ error: "Failed to analyze keywords" }, { status: 500 });
  }
}
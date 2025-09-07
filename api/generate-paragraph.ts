// import type { VercelRequest, VercelResponse } from "@vercel/node";
// import Replicate from "replicate";

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN as string,
//   userAgent: "https://www.npmjs.com/package/create-replicate"
// });

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   try {
//     const { words } = req.body;
//     if (!words || words.length === 0) {
//       return res.status(400).json({ error: "Words array is required" });
//     }

//     const prompt = `Make 1 simple paragraph (3-4 sentences) that uses the words "${words.join(
//       ", "
//     )}" in a context that is easy for English learners to understand.`;

//     const output = await replicate.run(
//       "ibm-granite/granite-3.3-8b-instruct:8afd11cc386bd05622227e71b208b9ecc000b946d84d373be96090f38ec91bdf",
//       {
//         input: {
//           top_k: 50,
//           top_p: 0.9,
//           prompt,
//           max_tokens: 512,
//           temperature: 0.6,
//         },
//       }
//     );

//     res.status(200).json({ paragraph: output[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to generate paragraph" });
//   }
// }

import type { VercelRequest, VercelResponse } from "@vercel/node";
import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // ✅ penting untuk preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { words } = req.body;
    if (!words || words.length === 0) {
      return res.status(400).json({ error: "Words array is required" });
    }

    const prompt = `Make 1 simple paragraph (3-4 sentences) that uses the words "${words.join(", ")}" in a context that is easy for English learners to understand.`;

    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct:8afd11cc386bd05622227e71b208b9ecc000b946d84d373be96090f38ec91bdf",
      {
        input: { top_k: 50, top_p: 0.9, prompt, max_tokens: 512, temperature: 0.6 },
      }
    );

    res.status(200).json({
      paragraph: Array.isArray(output) ? output[0] : output,
    });
    console.log("TOKEN:", process.env.REPLICATE_API_TOKEN);

  } catch (err: any) {
    console.error("Replicate error:", err);
    res.status(500).json({ error: "Failed to generate paragraph" });
  }
}

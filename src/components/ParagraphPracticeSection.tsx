// "use client";

// import { useState } from "react";
// // import { generateParagraphFromVocabulary } from "../services/generateParagraph";

// interface Vocabulary {
//   word: string;
// }

// export default function ParagraphPracticeSection({
//   vocabulary,
// }: {
//   vocabulary: Vocabulary[];
// }) {
//   const [paragraph, setParagraph] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//     //   const result = await generateParagraphFromVocabulary(vocabulary);
//       setParagraph(result);
//     } catch (err) {
//       console.error("Error generating paragraph:", err);
//       setParagraph("⚠️ Failed to generate paragraph.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="p-6 bg-white rounded-xl shadow">
//       <h2 className="text-xl font-semibold text-indigo-900 mb-3">
//         Latihan Menyimpulkan Paragraf
//       </h2>
//       <p className="mb-2 text-sm text-gray-700">
//         Kata kunci yang harus ada di paragraf:
//         <span className="font-semibold text-indigo-600 ml-1">
//           {vocabulary.map((v) => v.word).join(", ")}
//         </span>
//       </p>
//       <button
//         onClick={handleGenerate}
//         disabled={loading}
//         className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
//       >
//         {loading ? "Generating..." : "Generate Paragraf"}
//       </button>
//       {paragraph && (
//         <div className="mt-4 p-3 border rounded bg-gray-50">
//           <p>{paragraph}</p>
//           <p className="mt-2 text-gray-600 text-sm italic">
//             ✍️ Tugas: tulis ulang kesimpulan dari paragraf di atas.
//           </p>
//         </div>
//       )}
//     </section>
//   );
// }

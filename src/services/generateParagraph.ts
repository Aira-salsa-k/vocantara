// import Replicate from 'replicate'
// import dotenv from 'dotenv'
// dotenv.config()

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
//   userAgent: 'https://www.npmjs.com/package/create-replicate'
// })          
// const model = 'ibm-granite/granite-3.3-8b-instruct:8afd11cc386bd05622227e71b208b9ecc000b946d84d373be96090f38ec91bdf'
// const input = {
//   top_k: 50,
//   top_p: 0.9,
//   prompt: 'Make 1 simple paragraph (3-4 sentences) that uses the words "star, culture, eat" in a context that is easy for English learners to understand.',
//   max_tokens: 512,
//   min_tokens: 0,
//   temperature: 0.6,
//   presence_penalty: 0,
//   frequency_penalty: 0,
// }

// console.log('Using model: %s', model)
// console.log('With input: %O', input)

// console.log('Running...')
// const output = await replicate.run(model, { input })
// console.log('Done!', output)


// // const replicate = new Replicate({
// //   auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN as string,
// // });

// // const model =
// //   "ibm-granite/granite-3.3-8b-instruct:8afd11cc386bd05622227e71b208b9ecc000b946d84d373be96090f38ec91bdf";

// // export async function generateParagraphFromVocabulary(
// //   vocabulary: { word: string }[]
// // ): Promise<string> {
// //   const words = vocabulary.map((v) => v.word).join(", ");
// //   const prompt = `Make 1 simple paragraph (3-4 sentences) that uses the words "${words}" in a context that is easy for English learners to understand.`;

// //   const input = {
// //     top_k: 50,
// //     top_p: 0.9,
// //     prompt,
// //     max_tokens: 512,
// //     min_tokens: 0,
// //     temperature: 0.6,
// //     presence_penalty: 0,
// //     frequency_penalty: 0,
// //   };

// //   const output = (await replicate.run(model, { input })) as string[];
// //   return output.filter(Boolean).join(" ").trim();
// // }


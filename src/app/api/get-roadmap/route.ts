"use server";
import { client } from "@/Openai";
import { NextResponse } from "next/server";




// export async function POST(req: Request) {
//   try {
//     const prompt  = "hii there";

    // const chatCompletion = await client.chat.completions.create({
//       messages: [
//         { role: "system", content: "Answer the question in a couple sentences." },
//         { role: "user", content: prompt },
//       ],
//       model: "Meta-Llama-3.1-8B-Instruct",
//       max_tokens: 300,
//       temperature: 0.7,
//     });



//     const answer = chatCompletion && chatCompletion.choices[0].message.content;
//     return NextResponse.json({ response: answer ,chatCompletion});

//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: Request) {
  try {
    const {title,duration,timeInDay,why} = await req.json()
    return NextResponse.json({ response: "It's nice to meet you. Is there something I can help you with or would you like to chat?"});

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

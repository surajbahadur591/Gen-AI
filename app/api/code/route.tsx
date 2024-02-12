import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instructionMessage: ChatCompletionSystemMessageParam = {
    role: "system",
    content: "you are a code generator. you will answer only in markdown code snippet. you need to use with latest trends and best practices. You have to provide alternative better approach and optimization tips for each question asked. generate result in 5 seconds"


}
export async function POST(req: Request) {

    try {

        const { userId } = auth()
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("unauthorized", { status: 401 })
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("Open API keys error", { status: 500 })

        }
        if (!messages) {
            return new NextResponse("message is required", { status: 401 })

        }

        const completion = await openai.chat.completions.create({
            messages: [instructionMessage, ...messages],
            model: "gpt-3.5-turbo",
        });

        return NextResponse.json(completion.choices[0].message);

    } catch (error) {
        console.log("[CODE ERROR]", error)
        return new NextResponse(`Internal Error - ${error}`, { status: 500 })
    }
}

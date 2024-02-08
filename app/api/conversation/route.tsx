import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
            messages: [{ role: "system", content: messages.content }],
            model: "gpt-3.5-turbo",
        });

        return NextResponse.json(completion.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATION ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
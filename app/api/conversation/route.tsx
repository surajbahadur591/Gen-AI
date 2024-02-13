import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseAPILimit, checkAPILimit } from "@/lib/api-limit";

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

        const free_trail = await checkAPILimit();
        if (!free_trail) {
            return new NextResponse("Free trail Expired", { status: 403 })
        }

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });

        await increaseAPILimit()

        return NextResponse.json(completion.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATION ERROR]", error)
        return new NextResponse(`Internal Error - ${error}`, { status: 500 })
    }
}
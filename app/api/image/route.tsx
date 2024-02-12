import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseAPILimit, checkAPILimit } from "@/lib/api-limit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {

    try {

        const { userId } = auth()
        const body = await req.json();
        const { start_conversation, amount = 1, resolution = "512x512" } = body;

        if (!userId) {
            return new NextResponse("unauthorized", { status: 401 })
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("Open API keys error", { status: 500 })

        }
        if (!start_conversation) {
            return new NextResponse("image prompt is required", { status: 401 })
        }
        if (!amount) {
            return new NextResponse("image amount is required", { status: 401 })
        }
        if (!resolution) {
            return new NextResponse("image resolution is required", { status: 401 })
        }
        // const imageResponse = await openai.images.generate({
        //     model: "dall-e-3",
        //     prompt: start_conversation,
        //     size: resolution,
        //     quality: "hd",
        //     n: parseInt(amount, 10),
        // });

        const free_trail = await checkAPILimit();
        if (!free_trail) {
            return new NextResponse("Free trail Expired", { status: 403 })
        }

        const imageResponse = await openai.images.generate({
            prompt: start_conversation + 'image should be clear. generate image with as much as details possible. show full image. full head if head is present',
            size: resolution,
            quality: "standard",
            n: parseInt(amount, 10),
        });

        await increaseAPILimit()

        return NextResponse.json(imageResponse.data);

    } catch (error) {
        console.log("[IMAGE ERROR]", error)
        return new NextResponse(`Internal Error - ${error}`, { status: 500 })
    }
}
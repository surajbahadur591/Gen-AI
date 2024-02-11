"use client"
import * as z from "zod";
import axios from "axios"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import Header from "@/components/Header";
import { Code } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import { BotAvatar } from "@/components/BotAvatar";
import { UserAvatar } from "@/components/UserAvatar";
import { Loader } from "@/components/Loader";
import { Empty } from "@/components/Empty";

import ReactMarkdown from 'react-markdown'
const formSchema = z.object({
    start_conversation: z.string().min(1, {
        message: "Prompt is required."
    }),
});


const CodePage = () => {
    const router = useRouter()
    const [messages, setMessages] = useState<ChatCompletionUserMessageParam[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start_conversation: ""
        }
    });

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionUserMessageParam = {
                role: "user",
                content: values.start_conversation,
            }
            const updatedMessages = [...messages, userMessage]

            const response = await axios.post("/api/code", {
                messages: updatedMessages
            })

            setMessages((prevMessages) => [...prevMessages, userMessage, response.data])
            form.reset()

        } catch (error) {
            console.log(error)
        } finally {
            router.refresh()
        }
    }

    return (
        <div>
            <Header
                title="Code generation"
                description="Generate code for all languages"
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-violet-500/10"
            />

            {messages.length === 0 && !isLoading && (
                <Empty label="No conversation started." />
            )}

            {messages.map((conversation, conversationIndex) => (
                <div
                    key={conversationIndex}
                    className={cn(
                        "p-8 w-full flex items-start gap-x-8 rounded-lg",
                        conversation.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                    )}
                >
                    {conversation.role === "user" ? <UserAvatar /> : <BotAvatar />}
                    <p className="text-sm">
                        {Array.isArray(conversation.content) ? (
                            conversation.content.map((content: any, contentIndex) => (
                                <ReactMarkdown key={contentIndex}>{content.text ? content.text : ""}</ReactMarkdown>
                            ))
                        ) : (
                            <ReactMarkdown
                                components={{
                                    pre: ({ node, ...props }) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                            <pre {...props} />
                                        </div>
                                    ),
                                    code: ({ node, ...props }) => (
                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                    )
                                }}
                                className="text-sm overflow-hidden leading-7"
                            >{conversation.content || ""}</ReactMarkdown>
                        )}
                    </p>
                </div>))
            }

            {
                isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                        <Loader />
                    </div>
                )
            }

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
                >
                    <FormField
                        name="start_conversation"
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                                <FormControl className="m-0 p-0">
                                    <Input
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="How to create landing page using React and material UI?"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                        Generate Code
                    </Button>
                </form>
            </Form>
        </div >
    );
}

export default CodePage;
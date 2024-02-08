"use client"
import * as z from "zod";
import axios from "axios"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Header from "@/components/Header";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionUserMessageParam } from "openai/resources/index.mjs";

const formSchema = z.object({
    start_conversation: z.string().min(1, {
        message: "Prompt is required."
    }),
});


const ConversationPage = () => {
    const router = useRouter()
    const [messages, setMessages] = useState("")
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

            const response = await axios.post("/api/conversation", {
                messages: userMessage
            })

            setMessages(response.data.content)
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
                title="Conversation"
                description="Our most advanced conversation model."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />

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
                                        placeholder="Tell me what is 2+2?"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                        Generate
                    </Button>
                </form>
            </Form>

            <div>{messages}</div>


        </div>
    );
}

export default ConversationPage;
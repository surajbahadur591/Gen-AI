"use client"
import * as z from "zod";
import axios from "axios"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Header from "@/components/Header";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Empty } from "@/components/Empty";

const formSchema = z.object({
    start_conversation: z.string().min(1, {
        message: "Prompt is required."
    }),
});


const VideoPage = () => {
    const router = useRouter()
    const [video, setVideo] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start_conversation: ""
        }
    });

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined);

            const response = await axios.post('/api/video', values);


            setVideo(response.data[0]);
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
                title="Shorts Generator"
                description="Create reels or shorts for social media."
                icon={VideoIcon}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />

            {!video && !isLoading && (
                <Empty label="No video files generated." />
            )}


            {video && (
                <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                    <source src={video} />
                </video>
            )}

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
                                        placeholder="Clown fish swimming in a coral ree"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                        Submit
                    </Button>
                </form>
            </Form>
        </div >
    );
}

export default VideoPage;
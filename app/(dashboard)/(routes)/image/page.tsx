"use client"
import * as z from "zod";
import axios from "axios"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Header from "@/components/Header";
import { Download, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Empty } from "@/components/Empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Card, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
    start_conversation: z.string().min(1, {
        message: "Image  is required."
    }),
    amount: z.string().min(1),
    resolution: z.string().min(1),
});

const amountOptions = [
    {
        value: "1",
        label: "1 Photo"
    },
    {
        value: "2",
        label: "2 Photo"
    },
    {
        value: "3",
        label: "3 Photo"
    }
]


const resolutionOptions = [
    {
        value: "256x256",
        label: "256x256"
    },
    {
        value: "512x512",
        label: "512x512"
    },
    {
        value: "1024x1024",
        label: "1024x1024"
    },
    // {
    //     value: "1024x1792",
    //     label: "1024x1792"
    // },
    // {
    //     value: "1792x1024",
    //     label: "1792x1024"
    // }
]

const ImagePage = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start_conversation: "",
            amount: "1",
            resolution: "1024x1024"
        }
    });

    const [images, setImages] = useState<string[]>([])
    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([])
            const response = await axios.post("/api/image", values)

            const urls = response.data.map((image: { url: string }) => image.url)
            setImages(urls)

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
                title="Image generation"
                description="Create an image from your imagination."
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-violet-500/10"
            />

            {images.length === 0 && !isLoading && (
                <Empty label="No Images to show." />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {images.map((src) => (
                    <Card key={src} className="rounded-lg overflow-hidden">
                        <div className="relative aspect-square">
                            <Image
                                fill
                                alt="Generated"
                                src={src}
                            />
                        </div>
                        <CardFooter className="p-2">
                            <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

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
                            <FormItem className="col-span-12 lg:col-span-6">
                                <FormControl className="m-0 p-0">
                                    <Input
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="Generate a logo for brandname 'care for health'"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="amount"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {amountOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}

                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="resolution"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {resolutionOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}

                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                        Generate Image
                    </Button>
                </form>
            </Form>
        </div >
    );
}

export default ImagePage;

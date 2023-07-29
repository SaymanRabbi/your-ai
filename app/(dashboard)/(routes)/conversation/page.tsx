"use client"
import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./constants"
const ConversationPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
          defaultValues: {
            prompt: "",
          }
    })
    const isLoading = form.formState.isSubmitting
    // -----onSubmit Data-----
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }
    // -----onSubmit Data-----
    return (
        <div>
            <Heading
             title="Conversation"
            description="Our Most Advanced Conversational AI"
            icon={MessageSquare}
            iconColor="text-violet-500"
            bgColor="bg-violet-500/10"
            />
            {/* -----form----- */}
            <div className=" px-4 lg:px-8">
                <div>
                    {/* --------react hook form */}
                    <Form {...form}>
                        {/* --------html form----- */}
                      <form onSubmit={form.handleSubmit(onSubmit)}
                      className=" rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                      >
                        <FormField
                        name="prompt"
                        render={({field})=>(
                            <FormItem className=" col-span-12 lg:col-span-10">
                                <FormControl className=" m-0 p-0">
                                     <Input
                                     className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                      disabled={isLoading}
                                      placeholder="How do i calculate the radius of a circle?"
                                      {...field}
                                     />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                        <Button
                        className=" col-span-12 lg:col-span-2 w-full"
                        disabled={isLoading}
                        >
                            Generate
                        </Button>
                      </form>
                        {/* --------html form----- */}
                    </Form>
                        {/* --------react hook form */}
                </div>
                {/* ------showing result----- */}
                  <div className=" space-y-4 mt-4">
                    Messages Content
                  </div>
                {/* ------showing result----- */}
            </div>
            {/* -----form----- */}
        </div>
    )
}

export default ConversationPage
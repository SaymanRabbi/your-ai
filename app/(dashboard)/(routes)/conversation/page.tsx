"use client"
import Heading from "@/components/heading"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
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
                                     
                                </FormControl>
                            </FormItem>
                        )}
                        />
                      </form>
                        {/* --------html form----- */}
                    </Form>
                        {/* --------react hook form */}
                </div>
            </div>
            {/* -----form----- */}
        </div>
    )
}

export default ConversationPage
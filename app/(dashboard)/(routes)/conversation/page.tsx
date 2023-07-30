"use client"
import { BotAvatar } from "@/components/bot-avatar"
import { Empty } from "@/components/empty"
import Heading from "@/components/heading"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { useProModal } from "@/hooks/use-pro-modal"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatCompletionRequestMessage } from "openai"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import { formSchema } from "./constants"
const ConversationPage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
          defaultValues: {
            prompt: "",
          }
    })
    const isLoading = form.formState.isSubmitting
    // -----onSubmit Data-----
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
          const userMessage :ChatCompletionRequestMessage={
            role:"user",
            content:data.prompt
          }
          const newMessages = [...messages,userMessage]
          const response = await axios.post('/api/conversation',{
            messages:newMessages
          })
          setMessages((current)=>[...current,userMessage,response.data])
           form.reset()
        } catch (error:any) {
          // ---todo open pro modal
          if(error?.response?.status === 403){
            proModal.onOpen()
          }
          else {
            toast.error('Something went wrong')  
          }
          
        }finally{
          // form.reset()
          router.refresh()  
        }
    }
    // -----onSubmit Data-----
    return (
        <div>
            <Heading
             title="Conversation"
            description="Your Most Advanced Conversational AI"
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
                    {
                      isLoading && (
                        <div className=" p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                          <Loader/>
                        </div>
                      )
                    }
                    {
                      messages.length === 0 && !isLoading && <div>
                        <Empty label="No conversatin started"/>
                      </div>
                    }
                    <div className=" flex flex-col-reverse gap-y-4">
                       {messages.map((message,index)=>(
                        <div key={message.content}
                        className={
                          cn('p-8 w-full flex items-start gap-x-8 rounded-lg',
                          message.role === "user" ? 'bg-white border border-black/10' : 'bg-muted'
                          )
                        }
                        > {
                           message.role === "user" ? <UserAvatar/> : <BotAvatar/>
                        }
                          <p className=" text-sm">
                          {message.content}
                          </p>
                        </div>
                       ))}
                    </div>
                  </div>
                {/* ------showing result----- */}
            </div>
            {/* -----form----- */}
        </div>
    )
}

export default ConversationPage
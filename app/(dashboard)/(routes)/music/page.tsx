"use client"
import { Empty } from "@/components/empty"
import Heading from "@/components/heading"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useProModal } from "@/hooks/use-pro-modal"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Music } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./constants"
const MusicPage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [music, setMusic] = useState<string>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
          defaultValues: {
            prompt: "",
          }
    })
    const isLoading = form.formState.isSubmitting
    // -------onSubmit Data-------
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
          setMusic(undefined)
          const response = await axios.post('/api/music',data)
          setMusic(response.data.audio)
           form.reset()
        } catch (error:any) {
          // ---todo open pro modal
          if(error?.response?.status === 403){
            proModal.onOpen()
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
             title="Music Generation"
            description="Turn your prompts into music."
            icon={Music}
            iconColor="text-emerald-500"
            bgColor="bg-emerald-500/10"
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
                                      placeholder="Piano Solo"
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
                      !music && !isLoading && <div>
                        <Empty label="No music generated"/>
                      </div>
                    }
                    {
                      music && !isLoading && <audio controls className=" w-full mt-8">
                        <source src={music}/>
                      </audio>
                    }
                  </div>
                {/* ------showing result----- */}
            </div>
            {/* -----form----- */}
        </div>
    )
}

export default MusicPage
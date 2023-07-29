"use client"
import { Empty } from "@/components/empty"
import Heading from "@/components/heading"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { VideoIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./constants"
const VideoPage = () => {
  const router = useRouter()
  const [video, setVideo] = useState<string>()
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
          setVideo(undefined)
          const response = await axios.post('/api/video',data)
          setVideo(response.data[0])
           form.reset()
        } catch (error:any) {
          // ---todo open pro modal
          console.log(error)
        }finally{
          // form.reset()
          router.refresh()  
        }
    }
    // -----onSubmit Data-----
    return (
        <div>
            <Heading
             title="Video Generation"
            description="Turn your prompts into Video."
            icon={VideoIcon}
            iconColor="text-orange-700"
            bgColor="bg-orange-500/10"
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
                                      placeholder="Clown fish swimming around a coral reef"
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
                      !video && !isLoading && <div>
                        <Empty label="No video generated"/>
                      </div>
                    }
                    {
                      video && !isLoading && <video controls className=" w-ful aspect-video mt-8 rounded-lg border bg-black">
                        <source src={video}/>
                      </video>
                    }
                  </div>
                {/* ------showing result----- */}
            </div>
            {/* -----form----- */}
        </div>
    )
}

export default VideoPage
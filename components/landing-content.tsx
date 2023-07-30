"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const testimonials =[
    {
        name: "Sayman Rabbi",
        avatar:'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
        title:"Software Engineer",
        description:"This is a best tool for AI."
    },
    {
        name: "Arafat Rahman",
        avatar:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80',
        title:"Software Engineer",
        description:"This made my life easy."
    },
    {
        name: "Tahmid Nishat",
        avatar:'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
        title:"Web Developer",
        description:"Best tool for AI."
    },
    {
        name: "Limon Rahman",
        avatar:'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
        title:"Machine learning engineer",
        description:"All in one tool for AI."
    },
]
export const LandingContent =()=>{
    return (
<div className=" px-10 pb-20">
 <h2 className=" text-center text-4xl text-white font-extrabold mb-10">
    Testimonial
 </h2>
 <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {
        testimonials.map((testimonial,i)=>(
            <Card key={i} className=" bg-[#192339] border-none text-white">
              <CardHeader>
                <CardTitle className=" flex items-center gap-x-2 justify-between">
                    <div>
                        <p className=" text-lg">
                            {testimonial.name}
                        </p>
                        <p className=" text-zinc-400 text-sm">
                        {testimonial.title}
                        </p>
                    </div>
                     <div className=" px-2  w-12 h-12 relative rounded-full">
                        <Image className=" rounded-full" src={testimonial.avatar} alt={testimonial.name} fill/>
                     </div>
                </CardTitle>
                <CardContent className=" pt-4 px-0">
                    {
                        testimonial.description
                    }
                </CardContent>
              </CardHeader>
            </Card>
        ))
    }
 </div>
</div>
    )
}
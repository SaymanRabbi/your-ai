import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

const  configuration = new Configuration({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})


const openai = new OpenAIApi(configuration);
const instructionsMessages:ChatCompletionRequestMessage = {
    role:'system',
    content:"Your are a code Generator.You must answer only in markdown code snippets. use code comments for explanations"
}

export async function POST(
    req:Request
) {
 try {
    const {userId} = auth();
    const body = await req.json();
    const {messages} = body;
    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }
    if(!configuration.apiKey) {
        return new NextResponse("OpenAI key not Configured", { status: 500})
    }
    if(!messages) {
        return new NextResponse("Message not found", { status: 400 })
    }
    const response = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[instructionsMessages,...messages],
    });
    return NextResponse.json(response.data.choices[0].message)
 } catch (error) {
     console.log("code error",error)
     return  new NextResponse("Internal Server Error", { status: 500 })
 }
}
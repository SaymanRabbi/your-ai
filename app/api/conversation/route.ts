import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const  configuration = new Configuration({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})


const openai = new OpenAIApi(configuration);

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
    // ----------------- API Limit -----------------
    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();
    if(!freeTrail && !isPro) {
        return new NextResponse("Free Trail Limit Exceeded", { status: 403 })
    }
    // ----------------- API Limit -----------------
    const response = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages
    });
    if(!isPro){
        await incrementApiLimit();
    }
    return NextResponse.json(response.data.choices[0].message)
 } catch (error) {
     return  new NextResponse("Internal Server Error", { status: 500 })
 }
}
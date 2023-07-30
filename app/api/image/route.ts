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
    const {prompt,amount=1,resolution ='512 x 512'} = body;
    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }
    if(!configuration.apiKey) {
        return new NextResponse("OpenAI key not Configured", { status: 500})
    }
    if(!prompt) {
        return new NextResponse("promt is required", { status: 400 })
    }
    if(!amount) {
        return new NextResponse("amount is required", { status: 400 })
    }
    if(!resolution ) {
        return new NextResponse("resulation is required", { status: 400 })
    }
    // ----------------- API Limit -----------------
    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();
    if(!freeTrail && !isPro) {
        return new NextResponse("Free Trail Limit Exceeded", { status: 403 })
    }
    // ----------------- API Limit -----------------
    const response = await openai.createImage({
        prompt,
        n:parseInt(amount,10),
        size:resolution ,
    });
    if(!isPro){
        await incrementApiLimit();
    }
    return NextResponse.json(response.data.data)
 } catch (error) {
     
     return  new NextResponse("Internal Server Error", { status: 500 })
 }
}
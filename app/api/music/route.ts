import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const  replicate = new Replicate({
    auth:process.env.NEXT_PUBLIC_REPLICATE_API_KEY!
})

export async function POST(
    req:Request
) {
 try {
    const {userId} = auth();
    const body = await req.json();
    const {prompt} = body;
    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }
    if(!prompt) {
        return new NextResponse("prompt not found", { status: 400 })
    }
    // ----------------- API Limit -----------------
    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();
    if(!freeTrail && !isPro) {
        return new NextResponse("Free Trail Limit Exceeded", { status: 403 })
    }
    // ----------------- API Limit -----------------
    const response = await replicate.run(
        "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
        {
          input: {
            prompt_a: prompt,
          }
        }
      );
      if(!isPro){
      await incrementApiLimit();
      }
    return NextResponse.json(response)
 } catch (error) {
     return  new NextResponse("Internal Server Error", { status: 500 })
 }
}
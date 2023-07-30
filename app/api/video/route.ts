import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
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
    if(!freeTrail) {
        return new NextResponse("Free Trail Limit Exceeded", { status: 403 })
    }
    // ----------------- API Limit -----------------
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
        }
      }
    );
    await incrementApiLimit();
    return NextResponse.json(response)
 } catch (error) {
    
     return  new NextResponse("Internal Server Error", { status: 500 })
 }
}
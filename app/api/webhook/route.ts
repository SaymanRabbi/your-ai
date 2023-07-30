import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

import prismaDB from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

export async function POST(req:Request){
    const body = await req.text() 
    const siganture = headers().get("Stripe-Signature") as string

    let event:Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body,siganture,process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!)
    } catch (error:any) {
        return new NextResponse("webhooksError",{status:400})
        
    }

    const session = event.data.object as Stripe.Checkout.Session

    if(event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        if(!session?.metadata?.userId){
            return new NextResponse("UserId is Required",{status:400})
        }

        await prismaDB.userSubscription.create({
            data:{
                userId:session.metadata.userId,
                stripeSubscriptionId:subscription.id,
                stripeCustomerId:subscription.customer as string,
                stripePriceId:subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), 
            }
        })
    }
   if(event.type=== 'invoice.payment_succeeded'){
       const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
       if(!session?.metadata?.userId){
           return new NextResponse("UserId is Required",{status:400})
       }
       await prismaDB.userSubscription.update({
           where:{
               stripeSubscriptionId:subscription.id
           },
           data:{
               stripePriceId:subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), 
           }
       })
   }
    return new NextResponse("ok",{status:200})
}
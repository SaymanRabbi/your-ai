import prismaDB from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
const settingUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const {userId} = auth()
        const user = await currentUser();
        if(!user || !userId){
            return new NextResponse("Unauthorized",{status:401})
        }
       const userSubscription = await prismaDB.userSubscription.findUnique({
         where:{
              userId
         }
       })
       if(userSubscription && userSubscription.stripeCustomerId){
         const stripeSession = await stripe.billingPortal.sessions.create({
              customer:userSubscription.stripeCustomerId,
              return_url:settingUrl
         })
            return new NextResponse(JSON.stringify({url:stripeSession.url}),{status:200})
       }
       const stripeSession = await stripe.checkout.sessions.create({
          success_url: settingUrl,
          cancel_url: settingUrl,
          payment_method_types: ["card"],
          mode: "subscription",
          billing_address_collection:"auto",
          customer_email:user.emailAddresses[0].emailAddress,
          line_items: [{
            price_data: {
                currency: "USD",
                product_data: {
                    name: "Genius Premium Subscription",
                    description:"Unlimied AI generated"
                },
                unit_amount:2000,
                recurring:{
                    interval:"month"
                }
            },
            quantity: 1,
          }],
          metadata:{
                userId,
          }
       })
         return new NextResponse(JSON.stringify({url:stripeSession.url}),{status:200})
    } catch (error) {
        console.log("stripe",error);
        return new NextResponse("Internal Server Error",{status:500})
    }
}
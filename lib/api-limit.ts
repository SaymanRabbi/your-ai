import { MAX_FREE_COUNT } from "@/constants";
import { auth } from "@clerk/nextjs";
import prismaDB from "./prismadb";

export const incrementApiLimit = async () => {
    const {userId} = auth()
    if(!userId) return

    const userApiLimit = await prismaDB.userApiLimit.findUnique({
        where :{
            userId
        }
    })


    if(!userApiLimit){
        await prismaDB.userApiLimit.create({
            data:{
                userId,
                count: 1
            }
        })
    }else{
        await prismaDB.userApiLimit.update({
            where:{
                userId
            },
            data:{
                count: userApiLimit.count + 1
            }
        })
    }
}

export const checkApiLimit = async () => {
    const {userId} = auth()
    if(!userId) return false
    const userApiLimit = await prismaDB.userApiLimit.findUnique({
        where :{
            userId
        }
    })
    if(!userApiLimit || userApiLimit.count<MAX_FREE_COUNT) return true
    else return false
}
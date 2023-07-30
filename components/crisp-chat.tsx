"use client"
import { Crisp } from "crisp-sdk-web"
import { useEffect } from "react"


export const CrispChat = () => {
     useEffect(() => {
        Crisp.configure("20cc2dcd-d5d5-4ca6-8c96-0a46dad0ff4d")
     }, [])

    return null
}
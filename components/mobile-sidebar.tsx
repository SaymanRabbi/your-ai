"use client";

import SideBar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
const  MobileSideBar = () => {
    // ------hydration error-------
    const  [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    },[])
    if (!isMounted) return null
    // ------hydration error-------
    return (
        <Sheet>
        <SheetTrigger>
        <Button variant="ghost" size="icon" className=" md:hidden">
        <Menu/>
        </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
            <SideBar/>
        </SheetContent>
        </Sheet>
    )
}

export default MobileSideBar
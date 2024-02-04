"use client"

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const MobileSidebar = () => {

    // removing hydration error  
    // ************************************ - starts here
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) {
        return null
    }
    // ************************************ - end here

    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <Button className="md:hidden" variant="ghost">
                        <Menu />
                    </Button>
                </SheetTrigger>

                <SheetContent className="p-0" side="left">
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileSidebar;

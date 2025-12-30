"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "./util";
import { Canvas } from "./Canvas";

export function RoomCanvas ({roomId}:{roomId: string}) {

    const [socket , setSocket] = useState<WebSocket | null>(null)

    useEffect (() => {
        const ws = new WebSocket(WS_URL)

        ws.onopen = () => {
            setSocket(ws)
        }
    },[])



    if(!socket){
        return <div className="flex justify-center items-center h-screen">
            Connecting to server ...
        </div>
    }


    return (
        <div className="">
            <Canvas roomId={roomId}/>
            <div className="absolute top-20 left-50">
                <button className="rounded bg-gray text-black " >Rectangle</button>
                <button className="rounded bg-gray text-black " >Circle</button>
            </div>
        </div>
    )
}
"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "./util";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";

export function RoomCanvas ({roomId}:{roomId: string}) {

    const [socket , setSocket] = useState<WebSocket | null>(null)
    const [token , setToken] = useState<string | null>(null)
    const router = useRouter();
    
    useEffect( () => {
                
        const storedToken = localStorage.getItem("token");
        console.log(storedToken);
        
        if(!storedToken) {
            router.push("/signin");
            return;
        }

        setToken(storedToken)
    },[router])

    useEffect (() => {
        if(!token) return;
        
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        console.log(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
            type: "join_room",
            roomId
            }))
        }
        
    },[token, roomId])



    if(!socket || !token){
        return <div className="flex justify-center items-center h-screen">
            Connecting to server ...
        </div>
    }


    return (
        <div className="">
            <Canvas roomId={roomId} socket={socket} token={token}/>
        </div>
    )
}
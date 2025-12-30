import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas (
    {   
        roomId, 
        socket,
        token
    }:{
        roomId: string, 
        socket:WebSocket,
        token: string
    }) {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect (()=> {

        if(canvasRef.current) {

            const canvas = canvasRef.current;

            if(canvas){
                
                const resizeCanvas = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };

                resizeCanvas();

                window.addEventListener("resize", resizeCanvas);


                initDraw(canvas, roomId, socket, token);

            }
        }
    }, []);

    return (
        <canvas width={1080} height={820} ref={canvasRef} ></canvas>
    )
}
"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas ({roomId}:{roomId: string}) {
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


                initDraw(canvas, roomId);

            }
        }
    }, [canvasRef]);


    return (
        <div className="">
            <canvas width={1080} height={820} ref={canvasRef} ></canvas>
            <div className="absolute top-20 left-50">
                <button className="rounded bg-gray text-black " >Rectangle</button>
                <button className="rounded bg-gray text-black " >Circle</button>
            </div>
        </div>
    )
}
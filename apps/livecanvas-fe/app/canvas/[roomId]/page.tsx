"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function canvas () {

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


                initDraw(canvas);

            }
        }
    }, [canvasRef]);


    return (
        <div className="">
            <canvas width={1080} height={820} ref={canvasRef} ></canvas>
        </div>
    )
}
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

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

    const canvasRef = useRef<HTMLCanvasElement>(null);
    type SelectedElem = "rect" | "circle" | "line" | "pointer";
 
    const [seletedElement, setSelectedElement] = useState<SelectedElem | null>(null);

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


                initDraw(canvas, roomId, socket, token, seletedElement);

            }
        }
    }, []);

    return (<>
        <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} ></canvas>
        <div className="absolute top-20 left-50">
            <button className="rounded bg-gray text-white border-2 border-gray-400 m-2 p-2" onClick={() => {setSelectedElement("rect")}} >Rectangle</button>
            <button className="rounded bg-gray text-white border-2 border-gray-400 m-2 p-2" onClick={() => {setSelectedElement("circle")}} >Circle</button>
            <button className="rounded bg-gray text-white border-2 border-gray-400 m-2 p-2" onClick={() => {setSelectedElement("line")}} >Line</button>
            <button className="rounded bg-gray text-white border-2 border-gray-400 m-2 p-2" onClick={() => {setSelectedElement("pointer")}} >Pointer</button>
        </div>
    </>
    )
}
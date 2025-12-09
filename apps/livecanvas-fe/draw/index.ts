import { backendURL } from "@/components/util";
import axios from "axios";

type Shape = {
    type: "rect";
    x:number;
    y:number;
    height:number;
    width:number;   
} | {
    type: "circle";
    centerX: number; 
    centerY: number; 
    radius: number; 
}
export async function initDraw (canvas:HTMLCanvasElement, roomId: string) {

    const ctx = canvas.getContext("2d");

    let exisitingShape: Shape[] = await getExistingShape(roomId);

    if(!ctx) return;

    // ctx.strokeStyle = "yellow";  
    // ctx.fillStyle = "rgba(255, 255, )"

    clearCanvas(exisitingShape,canvas, ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked=true;
        startX = (e.clientX)
        startY = (e.clientY)
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked=false;
        const  width = (e.clientX -startX)
        const  height = (e.clientY - startY)

        exisitingShape.push({
            type: "rect",
            x:startX,
            y:startY,
            width:width,
            height:height
        })
    })

    canvas.addEventListener("mousemove", (e) => {
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY -startY;
            
            clearCanvas(exisitingShape, canvas,ctx);

            ctx.strokeStyle = "white"
            ctx.strokeRect(startX,startY, width,height)
        }
    })
}

function clearCanvas(exisitingShape:Shape[], canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle= "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    exisitingShape.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle ==="white"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })

}

async function getExistingShape (roomId: string) {
    const res = await axios.get(`${backendURL}/chats/${roomId}`);

    const messages = res.data.messages;

    const shapes = messages.map((x: {messages:string})=>{
        const messageData = JSON.parse(x.messages)
        return messageData
    })

    return shapes

} 
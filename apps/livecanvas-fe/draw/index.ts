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
}| {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;

}|{
    type: "pointer";
    locX: number;
    locY: number;
};

type SelectedElem = "rectangle" | "circle" | "line" | "pointer";

export async function initDraw (canvas:HTMLCanvasElement, roomId: string, socket:WebSocket, token:string , selectedElement: SelectedElem | null) {
    console.log(selectedElement)
    const ctx = canvas.getContext("2d");

    let exisitingShape: Shape[] = await getExistingShape(roomId, token);

    if(!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if(message.type=="chat"){
            const parsedShape = JSON.parse(message.message)
            exisitingShape.push(parsedShape)
            clearCanvas(exisitingShape, canvas, ctx)
        }
    }

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
        const shape:Shape = {
            type: "rect",
            x:startX,
            y:startY,
            width:width,
            height:height
        }

        exisitingShape.push(shape)

        socket.send(JSON.stringify({
        type: "chat",
        roomId,
        message:JSON.stringify(shape)
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY -startY;
            
            clearCanvas(exisitingShape, canvas,ctx);

            ctx.strokeStyle = "yellow"
            ctx.strokeRect(startX,startY, width,height)
        }
    })
//     canvas.addEventListener("mousedown", (e) => {
//     clicked = true;
//     const rect = canvas.getBoundingClientRect();
//     startX = e.clientX - rect.left;
//     startY = e.clientY - rect.top;
// });

// canvas.addEventListener("mouseup", (e) => {
//     clicked = false;
//     const rect = canvas.getBoundingClientRect();
//     const width = (e.clientX - rect.left) - startX;
//     const height = (e.clientY - rect.top) - startY;

//     exisitingShape.push({
//         type: "rect",
//         x: startX,
//         y: startY,
//         width,
//         height
//     });

//     clearCanvas(exisitingShape, canvas, ctx);
// });

// canvas.addEventListener("mousemove", (e) => {
//     if (!clicked) return;

//     const rect = canvas.getBoundingClientRect();
//     const width = (e.clientX - rect.left) - startX;
//     const height = (e.clientY - rect.top) - startY;

//     clearCanvas(exisitingShape, canvas, ctx);
//     ctx.strokeStyle = "yellow";
//     ctx.strokeRect(startX, startY, width, height);
// });

}

function clearCanvas(exisitingShape:Shape[], canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle= "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    exisitingShape.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "yellow"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })

}
// function clearCanvas(
//     exisitingShape: Shape[],
//     canvas: HTMLCanvasElement,
//     ctx: CanvasRenderingContext2D
// ) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     exisitingShape.forEach((shape) => {
//         if (shape.type === "rect") {
//             ctx.strokeStyle = "yellow";
//             ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         }
//     });
// }

async function getExistingShape (roomId: string, token:string) {
    console.log("Fetching shapes from:", `${backendURL}/chat/room/${roomId}`, 
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    const res = await axios.post(`${backendURL}/chat/room/${roomId}`,
        {}, 
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
    );

    const messages = res.data.messages;

    const shapes = messages.map((x: {message:string})=>{
        const messageData = JSON.parse(x.message)
        return messageData
    })

    return shapes

} 
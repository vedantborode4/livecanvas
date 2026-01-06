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

type SelectedElem = "rect" | "circle" | "line" | "pointer";

export async function initDraw (canvas:HTMLCanvasElement, roomId: string, socket:WebSocket, token:string , selectedElement: SelectedElem | null) {
    
    const selectedTool = selectedElement;
    
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
        let shape:Shape | null = null;


        if(selectedTool==="rect"){
            shape = {
                type: "rect",
                x:startX,
                y:startY,
                width:width,
                height:height
        }
        }else if(selectedTool === "circle") {
            shape = {
                type: "circle",
                centerX :startX + width/2,
                centerY : startY+ height/2,
                radius : Math.min(width, height)/2,
            }
        };
        if(!shape){return}
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

            if(selectedTool=== "rect"){
                
                ctx.strokeRect(startX,startY, width,height)

            } else if (selectedTool==="circle") {
                const centerX = startX + width/2
                const centerY = startY+ height/2
                const radius = Math.min(width, height)/2
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI*2)

                ctx.stroke();
                ctx.closePath();
            }
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
        }else if (shape.type==="circle"){
            ctx.strokeStyle = "red",
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI*2)
            ctx.stroke();
            ctx.closePath();
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
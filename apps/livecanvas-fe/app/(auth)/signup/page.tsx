"use client"
import InputBox from "@repo/ui/inputBox"
import { Button } from "@repo/ui/button"
import { ChangeEvent, useState } from "react"
import axios from "axios"
import { backendURL } from "@/components/util"
import { SignupSchema } from "@repo/zod-schema/type"

export default function Signup () {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function onSubmit () {
        console.log(backendURL)

        const parsed = SignupSchema.safeParse({email, password, name})

        
        try {
            if(!parsed.success){
                console.log(parsed.error.format());
                return;
            }
            const response = await axios.post(`${backendURL}/signup`, parsed.data )
    
            console.log(response.data.message)
        } catch (error:any) {
            console.log(error.response.data.error)
        }
    }
    return (
        <div className="h-84 w-96 border-2 roudered-lg flex flex-col justify-center items-center gap-2 rounded-lg shadow-lg ">
            <h3 className="mb-4">Sign Up </h3>
            <InputBox placeholder="Your Name" title="Name" type="text" onchange={(e:ChangeEvent<HTMLInputElement>)=> {setName(e.target.value)}}/>
            <InputBox placeholder="Your Email" title="Email" type="text" onchange={(e:ChangeEvent<HTMLInputElement>)=> {setEmail(e.target.value)}}/>
            <InputBox placeholder="Your Password" title="Password" type="text" onchange={(e:ChangeEvent<HTMLInputElement>)=> {setPassword(e.target.value)}}/>
            <Button appName="livecanvas" onClick={onSubmit} >signup</Button>
            
        </div>
    )
}
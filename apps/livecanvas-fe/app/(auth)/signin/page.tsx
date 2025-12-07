"use client"
import InputBox from "@repo/ui/inputBox"
import { Button } from "@repo/ui/button"
import React, { useState } from "react"
import axios from "axios"
import { backendURL } from "@/components/util"


export default function Signin () {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    async function onSubmit () {
        try {
            const response = await axios.post(`${backendURL}/signin`, {email, password})

            localStorage.setItem("token", response.data.token)

            console.log(response.data.Message)
            
        } catch (error:any){
            console.log(error.response.data.message)
            
        }
    }

    return (<>
        <div className="h-72 w-96 border-2 roudered-lg flex flex-col justify-center items-center gap-2 rounded-lg shadow-lg ">
            <h3 className="mb-4">Sign In </h3>
            <InputBox placeholder="your email" title="Email" type="text" onchange={(e:React.ChangeEvent<HTMLInputElement>)=> {setEmail(e.target.value)}}/>
            <InputBox placeholder="your password" title="Password" type="text" onchange={(e:React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
            <Button  appName="LiveCanvas" onClick={onSubmit}>Sign In</Button>   
        </div>
    </>
    )
}
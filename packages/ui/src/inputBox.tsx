
interface InputBoxProps {
    placeholder: string,
    title: string,
    type: string,
    onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputBox ({placeholder, title, type, onchange}: InputBoxProps) {
    return (
        <div className="input-box flex flex-col gap-2">
            <label className=" ">{title}</label>
            <input 
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={type} 
                placeholder={placeholder} 
                onChange={onchange}
            />
        </div>
    )
}
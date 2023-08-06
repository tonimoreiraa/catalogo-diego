import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchInput()
{
    const navigate = useNavigate()
    const ref = useRef<any>()

    function handleKeyDown(event: any)
    {
        if (event.key == 'Enter') {
            const query = event.target.value
            navigate('/search?query=' + encodeURIComponent(query))
        }
    }

    return <div className="relative">
        <IoSearch className="absolute left-3 top-2 text-neutral-500" size={24} />
        <Input
            type="search"
            placeholder="Buscar por produto..."
            className="bg-neutral-100 pl-10 pr-2 placeholder-neutral-500 rounded-xl"
            onKeyDown={handleKeyDown}
            ref={ref}
        />
    </div>
}
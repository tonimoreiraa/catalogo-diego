import { twMerge } from "tailwind-merge"

interface CategoryType extends React.ComponentProps<'div'> {
    name: string
    image: string
}

export default function Category({ name, image, className, ...props }: CategoryType)
{
    return <div
        className={twMerge(
            "p-1 items-center rounded-xl bg-zinc-100 flex flex-row gap-x-2 cursor-pointer hover:bg-zinc-200",
            className
        )}
        {...props}
    >
        <img
            className="w-12 h-12 rounded-lg p-2 object-contain"
            src={image}
            alt={name}
        />
        <h1 className="font-semibold text-base">{name}</h1>
    </div>
}
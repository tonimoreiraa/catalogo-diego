import { Link, LinkProps } from 'react-router-dom';
import { MdDashboard, MdCategory, MdExitToApp } from 'react-icons/md';
import { HTMLAttributes } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconType } from 'react-icons';

interface LinkType extends LinkProps {
    label: string,
    icon: IconType
}

function LayoutLink({label, icon: Icon, ...props} : LinkType)
{
    return <li>
        <Link {...props} className="flex justify-center md:justify-start items-center text-gray-300 hover:text-white gap-x-2 bg-white bg-opacity-5 p-2 rounded-lg hover:bg-opacity-10">
            <Icon size={28} />
            <h1 className="hidden md:block">{label}</h1>
        </Link>
    </li>
}

export function Layout(props: HTMLAttributes<HTMLDivElement>)
{
    const auth = useAuth()

    return <div className="flex h-screen">
        <div className="bg-gray-800 text-white w-16 md:w-48 h-screen flex flex-col">
            <div className="p-4 border-b border-gray-700">
            <h2 className="text-xs sm:text-lg md:text-2xl font-bold">Catálogo</h2>
        </div>
        <nav className="flex-1">
            <ul className="space-y-2 p-4">
                <LayoutLink to="/products" label="Produtos" icon={MdDashboard} />
                <LayoutLink to="/categories" label="Categorias" icon={MdCategory} />
            </ul>
        </nav>
            <div className="p-4">
                <button onClick={() => auth.signOut()} className="flex items-center text-gray-300 hover:text-white">
                    <MdExitToApp className="mr-2" />
                    Sair
                </button>
            </div>
        </div>
        <div className="flex-1 p-8 bg-neutral-100 h-screen overflow-y-auto">
            <div className="flex gap-y-4 flex-col" {...props} />
        </div>
    </div>
}
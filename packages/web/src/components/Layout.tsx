import { Link } from 'react-router-dom';
import { MdDashboard, MdCategory, MdExitToApp } from 'react-icons/md';
import { HTMLAttributes } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Layout(props: HTMLAttributes<HTMLDivElement>)
{
    const auth = useAuth()

    return <div className="flex h-screen">
        <div className="bg-gray-800 text-white w-64 h-screen flex flex-col">
            <div className="p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Catalogo online</h2>
            </div>
            <nav className="flex-1">
            <ul className="space-y-2 p-4">
                <li>
                <Link
                    to="/products"
                    className="flex items-center text-gray-300 hover:text-white"
                >
                    <MdDashboard className="mr-2" />
                    Listagem de Produtos
                </Link>
                </li>
                <li>
                <Link
                    to="/categories"
                    className="flex items-center text-gray-300 hover:text-white"
                >
                    <MdCategory className="mr-2" />
                    Gerência de Categorias
                </Link>
                </li>
            </ul>
            </nav>
            <div className="p-4">
            <button
                onClick={() => auth.signOut()}
                className="flex items-center text-gray-300 hover:text-white"
            >
                <MdExitToApp className="mr-2" />
                Desconectar
            </button>
            </div>
        </div>
        <div className="flex-1 p-8 bg-neutral-100 h-screen overflow-y-auto">
            <div className="flex gap-y-4 flex-col" {...props} />
        </div>
    </div>
}
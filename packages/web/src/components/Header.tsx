import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { IoPersonOutline, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import api from "@/services/api";
import SearchInput from "./SearchInput";

export default function Header()
{
    const categories = useQuery('@categories', async () => (await api.get('/categories')).data)
    const brands = useQuery('@brands', async () => (await api.get('/brands')).data)

    return <div className="px-8 md:px-24">
        <div className="w-full py-3 border-b border-neutral-200 flex items-center gap-x-4 justify-between">
            <div className="flex flex-row gap-x-4">
                <Link to="/">
                    <img src="/logo.jpeg" alt="KB Tech" className="h-12" />
                </Link>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Marcas</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[300px] lg:grid-cols-[.50fr_1fr]">
                                    {brands.data?.map((brand: any) => (
                                        <li key={brand.id}>
                                            <Link to={"/search?brandId=" + brand.id} className="hover:bg-black hover:bg-opacity-5 rounded-lg p-3 font-normal">
                                                {brand.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Categorias</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 xl:w-[650px] lg:w-[450px] md:w-[300px] lg:grid-cols-[.75fr_1fr]">
                                    {categories.data?.map((category: any) => (
                                        <li key={category.id}>
                                            <Link to={"/search?categoryId=12" + category.id} className="hover:bg-black hover:bg-opacity-5 rounded-lg p-3 font-normal">
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="https://kbtech.com.br" target="_blank">
                                <NavigationMenuTrigger>
                                    KB Tech
                                </NavigationMenuTrigger>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex gap-x-4">
                <SearchInput />
                <div className="flex items-center gap-x-1">
                    <IoPersonOutline />
                    <h1 className="text-xs">Entrar</h1>
                </div>
            </div>
        </div>
    </div>
}
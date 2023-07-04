import { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import Product from "../components/Product"
import api from "../services/api"
import { IoChevronBack, IoChevronForward, IoRefresh, IoSearch } from "react-icons/io5"

function View()
{
    const ref = useRef<any>()
    const [params, setParams] = useState<any>()
    const [page, setPage] = useState('/products')
    const {data, refetch, isLoading, isFetching} = useQuery('@products', () => api.get(page, {params}), {refetchOnWindowFocus: false,})

    useEffect(() => {refetch()}, [page, params])

    function handleSearch()
    {
        const query = ref.current?.value
        setParams({query})
        setPage('/products')
    }

    return <>
        {isLoading || isFetching && <div className="w-screen h-screen fixed z-10">
            <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-10">
                <IoRefresh />
            </div> 
        </div>}
        <div className="flex justify-center px-24 py-12">
        <div className="max-w-[1600px]">
            <h1 className="font-bold text-2xl">Produtos</h1>
            <div className="flex gap-x-2">
                <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                    placeholder="Buscar por título, categoria..."
                    ref={ref}
                />
                <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 items-center justify-center flex rounded-lg">
                    <IoSearch />
                </button>
            </div>
            <div className="pt-8 grid xl:grid-cols-5 2xl:grid-cols-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-3">
                {data?.data?.data?.map((product: any) => <Product key={product.id} product={product} />)}
            </div>
            <div className="w-full flex justify-end">
                <div className="flex items-center justify-start gap-x-2 mt-4">
                    <h1>Total de itens encontrados: {data?.data?.meta?.total}</h1>
                    {!!data?.data?.meta?.previous_page_url && <button className="bg-neutral-200 rounded-lg h-8 w-8 flex items-center justify-center" onClick={() => setPage('/products' + data?.data?.meta?.previous_page_url)}>
                        <IoChevronBack />
                    </button>}
                    <h1>Página {data?.data?.meta?.current_page} de {data?.data?.meta?.last_page}</h1>
                    {!!data?.data?.meta?.next_page_url && <button className="bg-neutral-200 rounded-lg h-8 w-8 flex items-center justify-center" onClick={() => setPage('/products' + data?.data?.meta?.next_page_url)}>
                        <IoChevronForward />
                    </button>}
                </div>
            </div>
        </div>
    </div>
    </>
}

export default View;
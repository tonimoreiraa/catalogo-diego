import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import Product from "../components/Product"
import api from "../services/api"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import { ImSpinner2 } from 'react-icons/im'
import Layout from "@/components/Layout"
import { useSearchParams } from "react-router-dom"

function View()
{
    const [searchParams] = useSearchParams()

    const [page, setPage] = useState('/products')
    const {data, refetch, isLoading, isFetching} = useQuery({
        queryKey: '@products',
        queryFn: async () => {
            return api.get(page, { params: Object.fromEntries(Array.from(searchParams)) })
        },
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        refetch()
    }, [page, searchParams])

    return <Layout>
        {isLoading || isFetching && <div className="w-screen h-screen fixed z-10 top-0 left-0">
            <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-10 space-x-3">
                <ImSpinner2 className="animate-spin" size={32} />
                <h1>Carregando produtos...</h1>
            </div> 
        </div>}
        <div className="flex justify-center">
        <div className="max-w-[1600px]">
            <h1 className="font-bold text-2xl">Produtos</h1>
            <div className="pt-8 grid xl:grid-cols-5 2xl:grid-cols-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-3">
                {data?.data?.data?.map((product: any) => <Product key={product.id} product={product} />)}
            </div>
            {data?.data?.meta?.total ? <div className="w-full flex justify-end">
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
            </div> : <div>
                <h1>
                    Nenhum resultado encontrado
                </h1>
            </div>}
        </div>
    </div>
    </Layout>
}

export default View;
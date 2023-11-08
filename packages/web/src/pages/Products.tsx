import { useQuery } from "react-query"
import api, { catchApiErrorMessage } from "../services/api"
import { Layout } from "../components/AdminLayout"
import { IoChevronBack, IoChevronForward, IoCloudUploadOutline, IoDownloadOutline } from 'react-icons/io5';
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

function Products()
{
    const [page, setPage] = useState('/products')
    const {data, isLoading, refetch} = useQuery('@products', () => api.get(page))
    const {data: lastUpdate} = useQuery('@last-update', async () => (await api.get('/last-update')).data)

    useEffect(() => {refetch()}, [page])

    async function exportData()
    {
        const response = await api.get('/products/export', { responseType: 'blob'})

        // Download
        const link = document.createElement('a')
        link.href = URL.createObjectURL(new Blob([response.data]))
        link.setAttribute('download', 'produtos.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    async function handleImportData(event: any)
    {
        const file = event.target.files[0]
        if (file && window.confirm(`Você deseja importar o arquivo ${file.name}?`)) {
            const data = new FormData()
            data.append('data', file)
            
            const response = api.post('/products/import', data)
            toast.promise(response, {
                error: catchApiErrorMessage,
                loading: 'Importando produtos...',
                success: () => {
                    refetch()
                    return 'Produtos importados com sucesso!'
                }
            })
        }
    }

    return <Layout>
        {isLoading ? <>Carregando...</> : <div className="flex justify-center px-8 py-12 bg-white rounded-lg shadow-lg">
            <div className="max-w-[1600px] w-full">
                <div className="w-full flex items-center justify-between mb-2">
                    <div>
                        <h1 className="font-bold text-2xl">Produtos</h1>
                        {!!lastUpdate && <h2 className="text-sm text-neutral-600">
                            Última atualização: {new Date(lastUpdate.created_at).toLocaleString()}
                        </h2>}
                    </div>
                    <div className="grid grid-flow-col gap-x-2">
                        <button onClick={exportData} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center gap-x-2">
                            <IoDownloadOutline size={20} />
                            Exportar dados
                        </button>
                        <input
                            type="file"
                            onChange={handleImportData}
                            name="import-csv"
                            id="import-csv"
                            className="hidden"
                            accept="text/csv"
                        />
                        <label htmlFor="import-csv" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center gap-x-2">
                            <IoCloudUploadOutline size={20} />
                            Importar dados
                        </label>
                    </div>
                </div>
                <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                    placeholder="Buscar por título, categoria..."
                />
                <div className="container mx-auto w-full mt-4 overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 text-xs md:text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="px-6 py-3 bg-gray-200 border-b">Imagem</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Título</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Categoria</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Custo</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Taxa</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Preço de venda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.data.map((product: any) => {
                                const image = product.images[0]?.image
                                return <tr key={product.id}>
                                    <td className="px-6 border-b">
                                        <img className="h-full w-full object-contain rounded-lg max-h-10" src={image && !image.includes('default') ? 'https://www.megaeletronicos.com:4420/img/'+ image.replace('/uploads/Product/', '').replaceAll('/', '-') : '/logo.jpeg'} />
                                    </td>
                                    <td className="px-6 py-4 border-b">{product.title}</td>
                                    <td className="px-6 py-4 border-b">{product.category?.name}</td>
                                    <td className="px-6 py-4 border-b">{Number(product.cost).toLocaleString('pt-br', {style: 'currency', currency: product.cost_currency})}</td>
                                    <td className="px-6 py-4 border-b">{Number(product.tax)}%</td>
                                    <td className="px-6 py-4 border-b">{Number(product.price).toLocaleString('pt-br', {style: 'currency', currency: product.price_currency})}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
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
        </div>}
    </Layout>
}

export default Products;
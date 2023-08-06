import { useQuery } from "react-query";
import api, { catchApiErrorMessage } from "../services/api";
import { useForm } from "react-hook-form";
import { Layout } from "../components/AdminLayout";
import { toast } from "react-hot-toast";

function parseForm(obj: any) {
    return Object.fromEntries(
        Object.entries(obj)
        .filter((item: any) => !!Object.values(item[1]).filter((i: any) => i.value !='').length)
        .map((item: any) => {
            return [item[0], Object.fromEntries(Object.entries(item[1]).filter((i: any) => i[1].value != ''))]
        })
    )
  }

function Categories()
{
    const { register, handleSubmit } = useForm()

    const {data: categories} = useQuery('@categories', () => api.get('/categories'))
    const {data: taxes} = useQuery('@taxes', () => api.get('/taxes'))

    const onSubmit = (data: any) => {
        data = parseForm(data.categories)
        const response = api.put('/taxes/many-values', {categories: data})
        toast.promise(response, {
            error: catchApiErrorMessage,
            loading: 'Salvando taxas...',
            success: 'Taxas salvas com sucesso.'
        })
    }

    return <Layout>
        <form className="bg-white rounded-lg shadow-lg" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-8 flex flex-col items-center justify-center">
                <div className="flex flex-row justify-between items-center w-full mb-4">
                    <h1 className="font-semibold text-2xl">Categorias</h1>
                    <button className="bg-blue-500 mt-4 text-white px-4 py-2 rounded shadow text-sm">Salvar Alterações</button>
                </div>
                {!categories && 'Carregando categorias...'}
                <div className="container mx-auto w-full mt-4 overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 text-xs md:text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="border py-2 px-4">Categoria</th>
                                {taxes?.data?.map((tax: any) => (
                                    <th key={tax.id} className="border py-2 px-4">
                                    {tax.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.data?.map((category: any) => (
                            <tr key={category.id}>
                                <td className="border py-2 px-4">{category.name}</td>
                                {taxes?.data?.map((tax: any) => (
                                <td key={tax.id} className="border">
                                    <div className="flex items-center px-2">
                                        <input
                                            type="number"
                                            defaultValue={category.taxes.find((t: any) => t.tax_id == tax.id)?.value}
                                            className="w-full text-right py-1 pl-2 pr-0 border-none text-sm"
                                            {...register(`categories.${category.id}.${tax.id}.value`)}
                                        />
                                        <span className="ml-1">%</span>
                                    </div>
                                </td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="bg-blue-500 mt-4 text-white px-4 py-2 rounded shadow text-sm">Salvar Alterações</button>
            </div>
        </form>
    </Layout>
}

export default Categories;
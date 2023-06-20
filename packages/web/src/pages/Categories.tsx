import { useQuery } from "react-query";
import api from "../services/api";
import { useForm } from "react-hook-form";

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
        api.put('/taxes/many-values', {categories: data})
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-8 flex flex-col items-center justify-center">
        <h1 className="font-semibold text-2xl mb-4">Categorias</h1>
        {!categories && 'Carregando categorias...'}
        <table className="max-w-[1000px]">
            <thead>
                <tr className="text-left">
                <th className="py-2">Categoria</th>
                {taxes?.data?.map((tax: any) => (
                    <th key={tax.id} className="py-2">
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
        <button className="bg-blue-500 mt-4 text-white px-4 py-2 rounded shadow mt-04">Salvar Alterações</button>
    </div>
    </form>
    
}

export default Categories;
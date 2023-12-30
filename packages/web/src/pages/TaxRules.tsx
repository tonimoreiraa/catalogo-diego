import { Layout } from "@/components/AdminLayout";
import RuleCreateDialog from "@/components/dialogs/rule-create";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api, { catchApiErrorMessage } from "@/services/api";
import toast from "react-hot-toast";
import { IoTrash } from "react-icons/io5";
import { useQuery } from "react-query";

export default function TaxRules()
{
    const { data, refetch } = useQuery('@rules', async () => (await api.get('/tax-rules')).data)

    function handleDelete(taxId: number)
    {
        const promise = api.delete('/tax-rules/' + taxId)

        toast.promise(promise, {
            error: catchApiErrorMessage,
            loading: 'Deletando regra...',
            success: () => {
                refetch()
                return 'Regra deletada.'
            }
        })
    }
        
    return <Layout>
        <Card className="bg-white">
            <CardHeader>
                
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>
                            Regras de atribuição de taxa
                        </CardTitle>
                        <CardDescription>
                            Crie regras para atribuir taxas automaticamente
                        </CardDescription>
                    </div>
                    <RuleCreateDialog onSubmit={refetch}>
                        <button className="bg-blue-500 mt-4 text-white px-4 py-2 rounded shadow text-sm">
                            Adicionar regra
                        </button>
                    </RuleCreateDialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Regra
                            </TableHead>
                            <TableHead>
                                Atribuição
                            </TableHead>
                            <TableHead>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.map((row: any) => <TableRow>
                            <TableCell>
                                US$ {row.min_cost}{row.max_cost ? ` - US$ ${row.max_cost}` : '+'}
                            </TableCell>
                            <TableCell>
                                {row.default_tax}%
                            </TableCell>
                            <TableCell>
                                <IoTrash
                                    onClick={() => handleDelete(row.id)}
                                    className="hover:text-neutral-600 cursor-pointer"
                                />
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </Layout>
}
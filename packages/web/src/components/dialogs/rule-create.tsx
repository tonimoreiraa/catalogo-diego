import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { PropsWithChildren, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import api, { catchApiErrorMessage } from "@/services/api";
import toast from "react-hot-toast";

export default function RuleCreateDialog({ children, onSubmit }: PropsWithChildren & { onSubmit: any })
{
    const [open, setOpen] = useState(false)
    const form = useForm()

    function handleSubmit(data: any)
    {
        const promise = api.post('/tax-rules', data)

        toast.promise(promise, {
            error: catchApiErrorMessage,
            loading: 'Salvando regra...',
            success: () => {
                setOpen(false)
                if (onSubmit) onSubmit()
                return 'Regra salva.'
            }
        })
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <h1 className="text-lg font-semibold">
                    Criar regra
                </h1>
                <h2 className="text-sm text-muted-foreground">
                    Crie uma regra de automação
                </h2>
            </DialogHeader>
            <FormProvider {...form}>
                <div className="grid grid-flow-row gap-1">
                    <div className="space-y-0.5">
                        <label className="text-xs">
                            Custo mínimo
                        </label>
                        <Input
                            placeholder="100"
                            {...form.register('minCost')}
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-xs">
                            Custo máximo
                        </label>
                        <Input
                            {...form.register('maxCost')}
                            placeholder="200"
                        />
                        <p className="text-xs pt-2">- Deixe em branco para valer para todos os números acima de...</p>
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-xs">
                            Valor da taxa (em %)
                        </label>
                        <Input
                            {...form.register('defaultTax')}
                            placeholder="45"
                        />
                    </div>
                    <button onClick={form.handleSubmit(handleSubmit)} className="bg-blue-500 mt-4 text-white px-4 py-2 rounded shadow text-sm">
                        Salvar regra
                    </button>
                </div>
            </FormProvider>
        </DialogContent>
    </Dialog>
}
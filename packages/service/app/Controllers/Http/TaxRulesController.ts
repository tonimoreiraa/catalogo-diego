import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TaxRule from 'App/Models/TaxRule'
import TaxRuleStoreValidator from 'App/Validators/TaxRuleStoreValidator'
import TaxRuleUpdateValidator from 'App/Validators/TaxRuleUpdateValidator'

export default class TaxRulesController {

    async index({}: HttpContextContract)
    {
        const rules = await TaxRule.all()

        return rules.map(rule => rule.serialize())
    }

    async store({ request }: HttpContextContract)
    {
        const payload = await request.validate(TaxRuleStoreValidator)

        const rule = await TaxRule.create(payload)

        return rule.serialize()
    }
    
    @bind()
    async update({ request }: HttpContextContract, rule: TaxRule)
    {
        const payload = await request.validate(TaxRuleUpdateValidator)

        rule.merge(payload)

        await rule.save()

        return rule.serialize()
    }

    @bind()
    async destroy({ response }: HttpContextContract, rule: TaxRule)
    {
        await rule.delete()

        return response.ok({})
    }
}

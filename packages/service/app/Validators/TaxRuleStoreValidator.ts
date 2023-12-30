import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TaxRuleStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    minCost: schema.number([
      rules.positiveNumber()
    ]),
    maxCost: schema.number.optional([
      rules.positiveNumber()
    ]),
    defaultTax: schema.number([
      rules.range(0, 100)
    ])
  })

  public messages: CustomMessages = {}
}

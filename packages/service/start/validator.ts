import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('positiveNumber', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (Number(value) < 0) {
    options.errorReporter.report(
      options.pointer,
      'positiveNumber',
      'Deve ser um número positivo',
      options.arrayExpressionPointer
    )
  }
})

import Route from '@ioc:Adonis/Core/Route'

Route.resource('/products', 'ProductsController')
Route.resource('/categories', 'CategoriesController')
Route.put('/taxes/many-values', 'TaxesController.setMany')
Route.resource('/taxes', 'TaxesController')
Route.put('/taxes/:tax/set/:category', 'TaxesController.set')
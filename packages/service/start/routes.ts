import Route from '@ioc:Adonis/Core/Route'

Route.resource('/categories', 'CategoriesController')

Route.get('/dolar', 'TaxesController.getCurrentDolar')

Route.post('/auth/login', 'AuthController.signIn')

Route.group(() => {
    Route.put('/taxes/many-values', 'TaxesController.setMany')
    Route.put('/taxes/:tax/set/:category', 'TaxesController.set') 
    Route.get('/products/export', 'ProductsController.export')   
    Route.post('/products/import', 'ProductsController.import')   
}).middleware('auth')

Route.resource('/products', 'ProductsController')
Route.resource('/taxes', 'TaxesController')
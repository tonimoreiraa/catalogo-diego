import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    
    async signIn({auth, request}: HttpContextContract)
    {
        const email = await request.input('email')
        const password = await request.input('password')

        const token = await auth.attempt(email, password)

        return { token, user: auth.user }
    }

}

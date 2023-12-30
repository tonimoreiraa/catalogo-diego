import Application from "@ioc:Adonis/Core/Application"
import Env from '@ioc:Adonis/Core/Env'

const ambient = Env.get('NODE_ENV')

if (ambient == 'production') {
    const scheduler = Application.container.use('Adonis/Addons/Scheduler')
    scheduler.run()
}
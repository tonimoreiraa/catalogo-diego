import Application from "@ioc:Adonis/Core/Application"

const scheduler = Application.container.use('Adonis/Addons/Scheduler')
scheduler.run()
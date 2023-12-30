import CatalogUpdate from 'App/Models/CatalogUpdate'
import { FetchME } from 'App/Services/FetchME'
import { FetchVV } from 'App/Services/FetchVV'
import SetTaxByRules from 'App/Services/SetTax'
import { BaseTask } from 'adonis5-scheduler/build'

export default class FetchValue extends BaseTask {
	public static get schedule() {
		return '* * * * * *'
	}

	public static get useLock() {
		return true
	}

	public async handle() {
		await SetTaxByRules()
		await CatalogUpdate.create({})
    	await FetchVV()
    	await FetchME()
  	}
}

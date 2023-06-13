import { FetchME } from 'App/Services/FetchME'
import { BaseTask } from 'adonis5-scheduler/build'

export default class FetchValue extends BaseTask {
	public static get schedule() {
		return '1 * * * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return true
	}

	public async handle() {
    	await FetchME()
  	}
}

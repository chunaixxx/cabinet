import type { Key } from '@models/Key'
import type { ILesson } from '@models/lessons/ILesson'

import { isAxiosError } from 'axios'
import axios from './axios'
import { HttpStatusCode } from 'axios'

// @ts-ignore
import app from '@/main.ts'

abstract class Api {
	static async ping() {
		return await axios('ping')
	}

	static async fetchLessons(aup: Key, id: Key) {
		try {
			/* await new Promise(r => setTimeout(r, 3000)) */

			const { data } = await axios.get(`lessons`, {
				params: {
					aup,
					id,
				},
			})

			if (data.error) throw new Error(data.error)

			console.log(data)

			return data
		} catch (error) {
			if (isAxiosError(error) && !error) {
				app.config.globalProperties.$toast.add({
					severity: 'error',
					summary: 'Неизвестная ошибка.',
					detail: 'Произошла ошибка при подгрузке таблицы.',
					life: 2000,
				})
			} else {
				app.config.globalProperties.$toast.add({
					severity: 'error',
					summary: error as string,
					life: 2000,
				})
			}

			console.error(error)
			return null
		}
	}

	/**
	 * Метод для сохранения строки
	 * @param {Key} id - Айди строки
	 * @param {ILesson} lesson - Обновленная строкоа
	 */
	static async editLesson(lesson: ILesson) {
		const { data, status } = await axios.post(`edit-lesson`, { lesson })

		if (status !== HttpStatusCode.Ok) return null

		return data
	}

	/**
	 * Метод для создания строки
	 * @param {Key} id - Айди строки
	 * @param {ILesson} lesson - Обновленная строкоа
	 */
	static async createLesson(lesson: ILesson) {
		const { data, status } = await axios.post(`create-lesson`, lesson)

		if (status !== HttpStatusCode.Ok) return null

		app.config.globalProperties.$toast.add({
			severity: 'success',
			summary: 'Новая запись успешно сохранена.',
			life: 2000,
		})

		return data
	}

	/**
	 * Метод для удаления строки
	 * @param {Key} id - Айди строки
	 */
	static async deleteLesson(id: Key) {
		const { data, status } = await axios.post(`delete-lesson`, { id })

		if (status !== HttpStatusCode.Ok) return null

		app.config.globalProperties.$toast.add({
			severity: 'success',
			summary: 'Запись успешно удалена.',
			life: 2000,
		})

		return data
	}

	/**
	 * Метод для получения доступных нагрузок РПД
	 * @param {Key} id - Айди РПД
	 */
	static async fetchLessonControlTypes(rpdId: Key) {
		const { data, status } = await axios.get(`control_types?rpd=${rpdId}`)

		if (status !== HttpStatusCode.Ok) return null

		return data
	}
}

Object.defineProperty(window, '_Api', { value: Api })

export default Api

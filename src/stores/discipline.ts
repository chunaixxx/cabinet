import type { Ref } from 'vue'
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import debounce from '@services/helpers/debounce'
import Api from '@services/Api'
import type { IStudyGroup } from '@models/lessons/IStudyGroup'
import type { Key } from '@models/Key'
import { useUser } from '@stores/user'
import { useAuth } from '@stores/auth'

export const useDisciplineStore = defineStore('discipline', () => {
	const userStore = useUser()

	const aups: Ref<Array<any>> = ref([])
	const isLoadingAups: Ref<boolean> = ref(false)

	/* Выбранный АУП */
	const selectedAup = ref(null)
	const selectedAupId: Ref<string | null> = ref()

	const aupTitle = computed(() => {
		return selectedAup.value?.title
	})

	const setSelectedAup = async (value: string) => {
		selectedAupId.value = value
		sessionStorage.setItem('selectedAupId', value)

		const aup = await Api.fetchAup({ aup: value })
		selectedAup.value = aup

		await fetchDisciplines()
		await fetchGroups(value)

		setSelectedSemester(semesters.value[0])
	}

	const selectDataByStudent = async studentPermissions => {
		const aup: string = studentPermissions.aup

		selectedAupId.value = aup
		sessionStorage.setItem('selectedAupId', aup)

		const aupData = await Api.fetchAup({ aup })
		selectedAup.value = aupData

		await fetchDisciplines()
		setStudyGroups([studentPermissions.group])
		setSelectedGroup(studentPermissions.group)

		setSelectedSemester(semesters.value[0])
	}

	const selectedAupIdByStorage = sessionStorage.getItem('selectedAupId')
	watch(
		() => userStore.isAuth,
		() => {
			if (selectedAupIdByStorage && userStore.isAuth)
				setSelectedAup(selectedAupIdByStorage)
		}
	)

	/* Выбранная дисциплина */
	const selectedDiscipline = ref(null)
	const setSelectedDiscipline = discipline => {
		selectedDiscipline.value = discipline
	}

	const selectedDisciplineId: Ref<string | null> = ref(
		null // sessionStorage.getItem('selectedDisciplineId') bug
	)
	const setSelectedDisciplineId = (value: string) => {
		if (selectedDisciplineId.value == value) return

		selectedDisciplineId.value = value
		sessionStorage.setItem('selectedDisciplineId', value)

		fetchDisciplineInfo(value)
	}

	const disciplineTitle: Ref<string | null> = ref('')
	const fetchDisciplineInfo = async (id: Key) => {
		if (selectedDisciplineId.value) id = selectedDisciplineId.value

		const data = await Api.fetchDisciplineInfo(id)
		disciplineTitle.value = data?.title || 'Error'
	}

	const hasSelectedDiscipline = computed(() => !!selectedDisciplineId.value)

	/*  */

	/* Выбор группы */
	const selectedGroup: Ref<IStudyGroup | null> = ref(null)
	const setSelectedGroup = (group: IStudyGroup) => {
		selectedGroup.value = group
	}

	const groups: Ref<IStudyGroup[]> = ref([])
	const setStudyGroups = (data: IStudyGroup[]) => {
		groups.value = data
	}

	const fetchGroups = async aup => {
		if (selectedAupId.value) aup = selectedAupId.value

		const data = await Api.fetchGroups(aup)
		setStudyGroups(data)
		setSelectedGroup(data[0])
	}
	/*  */

	/* Семестры */
	const semesters: Ref<string[]> = ref([])
	const setSemesters = (value: string[]) => (semesters.value = value)

	const selectedSemester: Ref<number | null> = ref(null)
	const setSelectedSemester = (semestr: string) => {
		selectedSemester.value = +semestr
	}
	/*  */

	/* Поиск */
	const search: Ref<string> = ref('')
	const setSearch = async (value: string) => {
		search.value = value

		if (value.length < 3) {
			isLoadingAups.value = false
			aups.value = []
			return
		}

		fetchAup(value)
	}

	const fetchAup = debounce(async value => {
		isLoadingAups.value = true
		const data = await Api.fetchAup({ search: value })
		aups.value = data
		isLoadingAups.value = false
	}, 500)
	/*  */

	/* Модалки */
	const directionDialogModel = ref(false)
	const setDirectionDialogModel = value => (directionDialogModel.value = value)

	/*  */

	/* Режим просмотра/редактирования */
	const editMode = ref(false)
	const switchMode = () => (editMode.value = !editMode.value)

	/* new */
	const isLoadingDisciplineLeftMenu = ref(false)

	const isOpenDisciplineColumn = ref(false)
	const setIsOpenDisciplineColumn = async value => {
		isOpenDisciplineColumn.value = value
	}

	const disciplinesByAup = ref({})
	const disciplinesBySemester = computed(() => {
		if (!selectedSemester.value) return []

		return disciplinesByAup.value[selectedSemester.value]
	})

	const fetchDisciplines = async () => {
		if (!selectedAupId.value) return

		isLoadingDisciplineLeftMenu.value = true
		const data = await Api.fetchDisciplines(selectedAupId.value)
		disciplinesByAup.value = data
		isLoadingDisciplineLeftMenu.value = false
		setSemesters(Object.keys(data))
	}

	return {
		search,
		setSearch,

		disciplineTitle,
		fetchDisciplineInfo,
		fetchGroups,

		selectedDiscipline,
		setSelectedDiscipline,
		selectedDisciplineId,
		setSelectedDisciplineId,
		hasSelectedDiscipline,

		aups,
		selectedAup,
		selectedAupId,
		aupTitle,
		setSelectedAup,
		selectDataByStudent,
		isLoadingAups,

		directionDialogModel,
		setDirectionDialogModel,

		editMode,
		switchMode,

		semesters,
		selectedSemester,
		setSelectedSemester,

		selectedGroup,
		setSelectedGroup,

		groups,
		setStudyGroups,

		/* new */
		isOpenDisciplineColumn,
		setIsOpenDisciplineColumn,

		disciplinesByAup,
		disciplinesBySemester,

		fetchDisciplines,

		isLoadingDisciplineLeftMenu,
	}
})

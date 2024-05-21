<template>
	<div class="TutorsForm">
		<div class="TutorsForm__title">Утверждение тьюторов</div>

		<div class="TutorsForm__header-block">
			<Dropdown
				class="TutorsForm__faculty-select"
				v-model="selectedFaculty"
				:options="faculties"
				:optionDisabled="isDisabledDepartmentOption"
				placeholder="Выберите факультет"
				optionLabel="name_faculty"
			/>

			<Button label="Скачать" icon="mdi mdi-download" />
			<Button
				label="Редактирование"
				icon="mdi mdi-pencil"
				@click="onChangeMode"
			/>
		</div>

		<div v-if="editMode" class="TutorsForm__header-block">
			<Dropdown
				class="TutorsForm__dep-select"
				v-model="selectedDepartment"
				:options="departments"
				:optionDisabled="isDisabledDepartmentOption"
				placeholder="Выберите кафедру"
				optionLabel="name_department"
			/>

			<Button
				label="Добавить кафедру"
				icon="mdi mdi-plus"
				:disabled="!selectedDepartment"
				@click="onAddDepartment"
			/>
		</div>

		<div class="TutorsForm__body">
			<div
				v-if="departmentsItems.length || editMode"
				class="TutorsForm__table-wrapper"
			>
				<div
					class="TutorsForm__table"
					v-for="(department, i) in departmentsItems"
				>
					<TutorsDepartmentTable
						:order="i + 1"
						:department="department"
						:editMode="editMode"
						:tutorsOptions="tutors"
						:studyGroupsOptions="studyGroups"
						@addRow="onAddRow"
						@deleteRow="onDeleteRow"
						@editStudyGroups="onEditStudyGroups"
						@editTutor="onEditTutor"
					/>
				</div>
			</div>

			<div v-else class="TutorsForm__table-empty">Данные отстутствуют</div>

			<TutorsMetaForm />
		</div>

		<div class="TutorsForm__footer">
			<Button v-if="editMode" icon="mdi mdi-plus" label="Сохранить" />
		</div>
	</div>
</template>

<script setup>
import TutorsDepartmentTable from '@components/admin/tutors/TutorsDepartmentTable.vue'
import TutorsMetaForm from '@components/admin/tutors/TutorsMetaForm.vue'

import { ref, computed } from 'vue'

const selectedFaculty = ref(null)
const faculties = ref([
	{
		id_faculty: 1,
		name_faculty: 'Факультет информационных технологий',
	},
	{
		id_faculty: 2,
		name_faculty: 'Транспортный факультет',
	},
	{
		id_faculty: 3,
		name_faculty: 'Факультет машиностроения',
	},
])

const selectedDepartment = ref(null)
const departments = ref([
	{
		id_department: 1,
		name_department: 'Кафедра "Информатика и вычислительная техника"',
	},
	{
		id_department: 2,
		name_department: 'Кафедра "Инфокогнитивные технологии"',
	},
	{
		id_department: 3,
		name_department: 'Кафедра "Информационная безопасность"',
	},
])

const meta = ref({
	date: '',
})

const editMode = ref(false)
const onChangeMode = () => (editMode.value = !editMode.value)

const departmentsItemsMap = ref({})
const departmentsItems = computed(() =>
	Object.values(departmentsItemsMap.value)
)

const isDisabledDepartmentOption = department => {
	return department.id_department in departmentsItemsMap.value
}

const tutors = ref([
	{
		id: 1337,
		name: 'Кириллов Даниил Павлович',
		jobtitle: 'Старший преподаватель',
	},
	{
		id: 1338,
		name: 'Марьюшкин Матвей Дмитриевич',
		jobtitle: 'Директор завода',
	},
	{
		id: 1339,
		name: 'Селиванов-Селиванов ЛеонтийЛеонтий Дмитриевич',
		jobtitle: 'Директор унитаза',
	},
])

const studyGroups = ref([
	{
		id: 1,
		title: '201-321',
	},
	{
		id: 2,
		title: '201-322',
	},
	{
		id: 3,
		title: '201-323',
	},
	{
		id: 4,
		title: '201-324',
	},
	{
		id: 5,
		title: '201-325',
	},
	{
		id: 6,
		title: '201-326',
	},
	{
		id: 7,
		title: '201-327',
	},
	{
		id: 8,
		title: '201-328',
	},
	{
		id: 9,
		title: '201-329',
	},
	{
		id: 10,
		title: '201-3210',
	},
])

const onAddDepartment = () => {
	const departmentId = selectedDepartment.value.id_department

	if (departmentId in departmentsItemsMap.value) return

	departmentsItemsMap.value[departmentId] = {
		...selectedDepartment.value,
		body: [
			{
				id: Date.now(),
				study_groups: [],
				tutor: '',
				tutor_jobtitle: '',
			},
		],
	}

	selectedDepartment.value = null
}

const onAddRow = ({ departmentId }) => {
	departmentsItemsMap.value[departmentId].body.push({
		id: Date.now(),
		study_groups: [],
		tutor: '',
		tutor_jobtitle: '',
	})
}

const onDeleteRow = ({ departmentId, rowId }) => {
	const neededDepartment = departmentsItemsMap.value[departmentId]

	const neededRowIndex = neededDepartment.body.findIndex(
		row => rowId === row.id
	)

	if (neededDepartment.body.length === 1) {
		delete departmentsItemsMap.value[departmentId]
	} else {
		neededDepartment.body.splice(neededRowIndex, 1)
	}
}

const onEditStudyGroups = ({ departmentId, rowId, newGroups }) => {
	const neededDepartment = departmentsItemsMap.value[departmentId]

	const neededRowIndex = neededDepartment.body.findIndex(
		row => rowId === row.id
	)

	neededDepartment.body[neededRowIndex].study_groups = newGroups
}

const onEditTutor = ({ departmentId, rowId, newTutor }) => {
	const neededDepartment = departmentsItemsMap.value[departmentId]

	const neededRowIndex = neededDepartment.body.findIndex(
		row => rowId === row.id
	)

	neededDepartment.body[neededRowIndex].tutor = newTutor
}
</script>

<style lang="scss">
@import '@styles/_variables.scss';

.TutorsForm {
	background-color: $view-bg;
	border-radius: 8px;
	padding: 16px;
	min-width: 1000px;

	&__title {
		font-weight: 600;
		font-size: 1.2rem;
		margin-bottom: 12px;
	}

	&__header-block {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-columns: auto;
		grid-template-rows: 37px;
		grid-auto-flow: column;
		gap: 8px;
		margin-bottom: 12px;
	}

	&__body {
		margin-top: 12px;
		max-height: 60vh;
		overflow: auto;
		padding: 16px 16px 16px;
	}

	&__table-wrapper {
		margin-bottom: 12px;
		min-height: calc(300px - 37px - 12px);
	}

	&__table {
		margin-bottom: 24px;
	}

	&__table-empty {
		margin-bottom: 12px;
		min-height: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
	}

	&__footer {
		margin-top: 12px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
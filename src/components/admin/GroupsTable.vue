<template>
	<DataTable
		v-model:filters="filters"
		class="GroupsTable"
		ref="table"
		:value="groups"
		:loading="isLoadingGroups"
		showGridlines
		scrollable
		scrollHeight="flex"
		stripedRows
		:rowClass="() => 'GroupsTable__row'"
		dataKey="id"
	>
		<ColumnGroup type="header">
			<Row>
				<Column
					header="#"
					class="column-header--center"
					headerStyle="width: 45px"
					:colspan="1"
					frozen
				/>

				<Column
					class="column-header--center"
					header="Группа"
					style="width: 100px"
					frozen
					:colspan="1"
				/>
				<Column header="Номер АУП" frozen :colspan="1" />
			</Row>
		</ColumnGroup>

		<!-- # -->
		<Column
			header="#"
			headerClass="column-header-index"
			bodyClass="column-cell-index"
			headerStyle="width: 45px"
			:colspan="1"
		>
			<template #body="{ data, index }">
				<span class="LessonsTable__index">
					{{ data.id }}
				</span>
			</template>
		</Column>

		<Column
			header="Группа"
			field="title"
			headerClass="column-header-center"
			bodyClass="column-cell-center"
		>
			<template #body="{ data, field }">
				<span>
					{{ data[field] }}
				</span>
			</template>
		</Column>

		<Column header="Номер АУП" field="num_aup" frozen>
			<template #body="{ data, field }">
				<span>
					{{ data[field] }}
				</span>
			</template>
		</Column>
	</DataTable>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Api from '@services/Api'
import { FilterMatchMode } from 'primevue/api'

const isLoadingGroups = ref(true)
const groups = ref([])

const props = defineProps({
	search: {
		type: String,
		default: '',
	},
})

const filters = computed(() => ({
	global: { value: props.search, matchMode: FilterMatchMode.CONTAINS },
}))

onMounted(async () => {
	const groupsRes = await Api.getGroups()
	groups.value = groupsRes
	isLoadingGroups.value = false
})
</script>

<style lang="scss">
@import '@styles/_variables.scss';

.GroupsTable {
	background-color: $view-bg;
	border-radius: 8px;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
</style>

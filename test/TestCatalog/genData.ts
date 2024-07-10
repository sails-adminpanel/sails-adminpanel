import {Item} from "../../lib/catalog/AbstractCatalog";
import {StorageService} from "./TestCatalog";

interface GroupTestItem extends Item {
	childGroups?: GroupTestItem[];
}

export async function createTestData() {
	const group1: GroupTestItem = {
		id: '1',
		name: 'Group 1',
		parentId: null,
		childs: [],
		sortOrder: 1,
		icon: 'audio-description',
		type: 'group',
	};

	const group2: GroupTestItem = {
		id: '2',
		name: 'Group 2',
		parentId: null,
		childs: [],
		sortOrder: 2,
		icon: 'audio-description',
		type: 'group',
	};

	const group3: GroupTestItem = {
		id: '3',
		name: 'Group 3',
		parentId: null,
		childs: [],
		sortOrder: 3,
		icon: 'audio-description',
		type: 'group',
	};

	const groups = [group1, group2, group3];

	for (let i = 0; i < groups.length; i++) {
		for (let j = 1; j <= 2; j++) {
			const subGroup: GroupTestItem = {
				id: `${groups[i].id}.${j}`,
				name: `Group ${groups[i].id}.${j}`,
				parentId: groups[i].id,
				childs: [],
				sortOrder: j,
				icon: 'audio-description',
				type: 'group',
			};

			for (let k = 1; k <= 3; k++) {
				const item: Item = {
					id: `${groups[i].id}.${j}.${k}`,
					name: `Item ${groups[i].id}.${j}.${k}`,
					parentId: subGroup.id,
					sortOrder: k,
					icon: 'radiation-alt',
					type: 'item2'
				};

				subGroup.childs?.push(item);
				await StorageService.setElement(item.id, item);
			}

			groups[i].childs?.push(subGroup);
			await StorageService.setElement(subGroup.id, subGroup);
		}

		await StorageService.setElement(groups[i].id, groups[i]);
	}
}

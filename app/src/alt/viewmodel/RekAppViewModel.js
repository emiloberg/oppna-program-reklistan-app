
import RekDataList from './RekDataList';
import DataLoader from '../util/DataLoader';

let MAIN_DATA_LIST;

export const appViewModel = {

	setMainDataList(mainDataList) {
		MAIN_DATA_LIST = mainDataList;
	},

	getMainDataList() {
		return MAIN_DATA_LIST;
	}

};

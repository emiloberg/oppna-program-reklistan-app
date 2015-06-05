
import fs from 'file-system';
import {ImageFormat} from 'ui/enums';

const DOCUMENTS_FOLDER = fs.knownFolders.documents().path;

const save = (path, image) => {
	return new Promise((resolve, reject) => {
		if (image.saveToFile(DOCUMENTS_FOLDER + path, 'png')) {
			resolve();
		} else {
			reject();
		}
	});
};

const exists = () => false;

const RemoteImages = {
	save,
	exists
};

export default RemoteImages;


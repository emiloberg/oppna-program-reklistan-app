import Mainmenu from './../shared/viewmodel/Mainmenu';
import navigation from './../shared/utils/navigation';
import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';

module.exports.menuTap = Mainmenu.show;
module.exports.searchTap = navigation.toSearch;
module.exports.backTap = navigation.back;

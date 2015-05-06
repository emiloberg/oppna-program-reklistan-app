function itemInspector(name, item) {
	console.log("inspecting " + name + " started");
	if (item == null) {
		console.log(name + " is null");
		return;
	}
	arrKeys=[];
	for (var p in item) {
		arrKeys.push(p);
	}


	console.log(arrKeys.join("\n"));
	console.log("inspecting " + name + " finished");
}

module.exports.itemInspector = itemInspector;
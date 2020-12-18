CKEDITOR.dialog.add("tablesortDialog", function (editor) {
	return {
		title: "Tablesort Properties",
		minWidth: 300,
		minHeight: 100,
		contents: [
			{
				id: "basic",
				label: "Direction Settings",
				elements: [
					{
						type: "select",
						id: "direction",
						label: "Select sort direction",
						items: [["Ascending"], ["Descending"]],
						default: "Ascending",
					},
				],
			},
		],

		onOk: function () {
			const dialog = this;
			const direction = dialog.getValueOf("basic", "direction");
			const table = editor
				.getSelection()
				.getStartElement()
				.getAscendant("table");

			let td = editor.getSelection().getStartElement().$;
			let columnIndex = 0;
			while ((td = td.previousSibling)) {
				columnIndex++;
			}

			if (table) {
				let i, doSwitching = false, switched = true, iterateStart = 0;
				const thead = table.$.querySelector("thead");
				//Will start sorting from row 1 if thead exists
				if (thead) {
					iterateStart = 1;
				}

				//When switched has occured, repeat the loop
				while (switched) {
					switched = false;
					const rows = table.$.rows;

					for (i = iterateStart; i < rows.length - 1; i++) {
						doSwitching = false;
						const x = rows[i].querySelectorAll("td")[
							columnIndex
						];
						const y = rows[i + 1].querySelectorAll("td")[
							columnIndex
						];
						//Check if cells need to be switched
						if (
							direction === "Ascending"
								? compareString(
									x.innerHTML,
									y.innerHTML,
									direction
								)
								: !compareString(
									x.innerHTML,
									y.innerHTML,
									direction
								)
						) {
							doSwitching = true;
							break;
						}
					}
					//Switching
					if (doSwitching) {
						rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
						switched = true;
					}
				}
			}
		},
	};
});

function divideStrings(string) {
	return string
		.split(/(\d*\.?\d*)/)
		.filter((el) => el !== "")
		.map((el) => (isNaN(el) ? el : Number(el)));
}

function compareString(stringA, stringB, direction) {
	let divA = divideStrings(stringA);
	let divB = divideStrings(stringB);
	const minLength = Math.min(divA.length, divB.length);

	let i = 0;
	while (i < minLength) {
		if (!divA[i]) {
			return false;
		}
		if (!divB[i]) {
			return true;
		}
		if (typeof divA[i] === "number" && typeof divB[i] === "string") {
			return false;
		} else if (typeof divA[i] === "string" && typeof divB[i] === "number") {
			return true;
		} else if (typeof divA[i] === "number" && typeof divB[i] === "number") {
			if (divA[i] > divB[i]) {
				return true;
			}
			//On equal go on
			else if (divA[i] < divB[i]) {
				return false;
			}
		} else if (typeof divA[i] === "string" && typeof divB[i] === "string") {
			//Check if its same character
			if (
				divA[i] === divB[i].toLowerCase() ||
				divA[i].toLowerCase() === divB[i]
			) {
				if (divA[i] > divB[i]) {
					return true;
				}
				if (divA[i] < divB[i]) {
					return false;
				}
			}
			//If not change both to lower
			else {
				divA[i] = divA[i].toLowerCase();
				divB[i] = divB[i].toLowerCase();
				if (divA[i] > divB[i]) {
					return true;
				}
				if (divA[i] < divB[i]) {
					return false;
				}
			}
		}
		i++;
	}
	if (direction === "Ascending") {
		return false;
	} else {
		return true;
	}
}

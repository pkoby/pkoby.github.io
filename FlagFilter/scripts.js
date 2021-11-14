// not exactly vanilla as there is one lodash function

function openNav() {
	document.getElementById("filterMenu").style.visibility = "visible";
	document.getElementById("main").style.marginLeft = "210px";
}

function closeNav() {
	document.getElementById("filterMenu").style.visibility = "hidden";
	document.getElementById("main").style.marginLeft = "0";
}

var allCheckboxes = document.querySelectorAll('input[type=checkbox]');
var allRadio = document.querySelectorAll('input[type=radio]');
var allFlags = Array.from(document.querySelectorAll('.flag'));
var checked = {};

getChecked('Red');
getChecked('Orange');
getChecked('Yellow');
getChecked('Green');
getChecked('Turquoise');
getChecked('Blue');
getChecked('Purple');
getChecked('Pink');
getChecked('Brown');
getChecked('Black');
getChecked('Gray');
getChecked('White');
getChecked('Stripes');
getChecked('Chevrons');
getChecked('Symbols');
getChecked('Count');

Array.prototype.forEach.call(allCheckboxes, function (el) {
	el.addEventListener('change', toggleCheckbox);
});

function toggleCheckbox(e) {
	console.countReset(checked);
	getChecked(e.target.name);
	setVisibility();
}

function getChecked(name) {
	checked[name] = Array.from(document.querySelectorAll('input[name=' + name + ']:checked')).map(function (el) {
		return el.value;
	});
}

function setVisibility() {
	allFlags.map(function (el) {
		var Red = checked.Red.length ? _.intersection(Array.from(el.classList), checked.Red).length : true;
		var Orange = checked.Orange.length ? _.intersection(Array.from(el.classList), checked.Orange).length : true;
		var Yellow = checked.Yellow.length ? _.intersection(Array.from(el.classList), checked.Yellow).length : true;
		var Green = checked.Green.length ? _.intersection(Array.from(el.classList), checked.Green).length : true;
		var Turquoise = checked.Turquoise.length ? _.intersection(Array.from(el.classList), checked.Turquoise).length : true;
		var Blue = checked.Blue.length ? _.intersection(Array.from(el.classList), checked.Blue).length : true;
		var Purple = checked.Purple.length ? _.intersection(Array.from(el.classList), checked.Purple).length : true;
		var Pink = checked.Pink.length ? _.intersection(Array.from(el.classList), checked.Pink).length : true;
		var Brown = checked.Brown.length ? _.intersection(Array.from(el.classList), checked.Brown).length : true;
		var Black = checked.Black.length ? _.intersection(Array.from(el.classList), checked.Black).length : true;
		var Gray = checked.Gray.length ? _.intersection(Array.from(el.classList), checked.Gray).length : true;
		var White = checked.White.length ? _.intersection(Array.from(el.classList), checked.White).length : true;
		var Stripes = checked.Stripes.length ? _.intersection(Array.from(el.classList), checked.Stripes).length : true;
		var Chevrons = checked.Chevrons.length ? _.intersection(Array.from(el.classList), checked.Chevrons).length : true;
		var Symbols = checked.Symbols.length ? _.intersection(Array.from(el.classList), checked.Symbols).length : true;
		var Count = checked.Count.length ? _.intersection(Array.from(el.classList), checked.Count).length : true;
		if (Red && Orange && Yellow && Green && Turquoise && Blue && Purple && Pink && Brown && Black && Gray && White && Stripes && Chevrons && Symbols && Count) {
			el.style.display = 'inline-block';
			console.count(checked);
		} else {
			el.style.display = 'none';
		}
	});
}

function uncheckAll() {
	console.countReset(checked);
	document.querySelectorAll('input[type="checkbox"]')
		.forEach(el => el.checked = false);
		getChecked('Red');
		getChecked('Orange');
		getChecked('Yellow');
		getChecked('Green');
		getChecked('Turquoise');
		getChecked('Blue');
		getChecked('Purple');
		getChecked('Pink');
		getChecked('Brown');
		getChecked('Black');
		getChecked('Gray');
		getChecked('White');
		getChecked('Stripes');
		getChecked('Chevrons');
		getChecked('Symbols');
		getChecked('Count');
		setVisibility();
}

document.querySelector('button').addEventListener('click', uncheckAll)
// not exactly vanilla as there is one lodash function

function openNav() {
	document.getElementById("filterMenu").style.visibility = "visible";
	document.getElementById("main").style.marginRight = "190px";
}

function closeNav() {
	document.getElementById("filterMenu").style.visibility = "hidden";
	document.getElementById("main").style.marginRight = "20px";
}

var allCheckboxes = document.querySelectorAll('input[type=checkbox]');
var allRadio = document.querySelectorAll('input[type=radio]');
var allFlags = Array.from(document.querySelectorAll('.flag'));
var checked = {};

function countFlags() {
	const div = document.querySelector('#main');
	const children = div.children;
	let count = 0;
	for (let child of children) {
		if (child.classList.contains('flag') && child.style.display != 'none') count++;
	}
	if (count == 1) {
		return count + " match";
	} else {
		return count + " matches";
	}
}

document.getElementById("countbox").innerHTML = countFlags();

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
getChecked('Chevron');
getChecked('Cross');
getChecked('Symbols');
getChecked('Stars');
getChecked('Count');
getChecked('Attraction');
getChecked('Country');
getChecked('Identity');
getChecked('Other');

Array.prototype.forEach.call(allCheckboxes, function (el) {
	el.addEventListener('change', toggleCheckbox);
});

function toggleCheckbox(e) {
	// console.countReset(checked);
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
		var Chevron = checked.Chevron.length ? _.intersection(Array.from(el.classList), checked.Chevron).length : true;
		var Cross = checked.Cross.length ? _.intersection(Array.from(el.classList), checked.Cross).length : true;
		var Symbols = checked.Symbols.length ? _.intersection(Array.from(el.classList), checked.Symbols).length : true;
		var Stars = checked.Stars.length ? _.intersection(Array.from(el.classList), checked.Stars).length : true;
		var Count = checked.Count.length ? _.intersection(Array.from(el.classList), checked.Count).length : true;
		var Attraction = checked.Attraction.length ? _.intersection(Array.from(el.classList), checked.Attraction).length : true;
		var Country = checked.Country.length ? _.intersection(Array.from(el.classList), checked.Country).length : true;
		var Identity = checked.Identity.length ? _.intersection(Array.from(el.classList), checked.Identity).length : true;
		var Other = checked.Other.length ? _.intersection(Array.from(el.classList), checked.Other).length : true;
		if (Red && Orange && Yellow && Green && Turquoise && Blue && Purple && Pink && Brown && Black && Gray && White && Stripes && Chevron && Cross && Symbols && Stars && Count && Attraction && Country && Identity && Other) {
			el.style.display = 'inline-block';
			// console.count(checked);
		} else {
			el.style.display = 'none';
		}
		document.getElementById("countbox").innerHTML = countFlags();
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
		getChecked('Chevron');
		getChecked('Cross');
		getChecked('Symbols');
		getChecked('Stars');
		getChecked('Count');
		getChecked('Attraction');
		getChecked('Country');
		getChecked('Identity');
		getChecked('Other');
		setVisibility();
}

document.querySelector('button').addEventListener('click', uncheckAll)
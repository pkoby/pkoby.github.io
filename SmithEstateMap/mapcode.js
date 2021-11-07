window.onload = function () { 

	var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

	var osmAttrib ='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

	var osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });

	var map = L.map("map", {
		layers: [osm],
		center: [38.7040,-77.7961],
		zoom: 16,
	});

	var data = L.geoJson(polygons, {});

	var timeline;
	var timelineControl;

	function getColorFor(str) {
		// java String#hashCode
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		var red = (hash >> 24) & 0xff;
		var grn = (hash >> 16) & 0xff;
		var blu = (hash >> 8) & 0xff;
		return "rgb(" + red + "," + grn + "," + blu + ")";
	}
	function updateList(timeline) {
		var displayed = timeline.getLayers();
		var list = document.getElementById("displayed-list");
		list.innerHTML = "";
		displayed.forEach(function (info) {
			var li = document.createElement("li");
			li.innerHTML = info.feature.properties.notes;
			list.appendChild(li);
		});
	}

	function (data) {
		timeline = L.timeline(data, {
			style: function (data) {
				return {
					stroke: true,
					weight: 1,
					color: getColorFor(data.properties.name),
					fillOpacity: 0.5,
				};
			},
			waitToUpdateMap: true,
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.name+' '+feature.properties.start);
			},
		});

		timelineControl = L.timelineSliderControl({
			formatOutput: function (date) {
				return new Date(date).toDateString();
			},
			enableKeyboardControls: true,
			showTicks: true,
		});

		timeline.addTo(map);
		timelineControl.addTo(map);
		timelineControl.addTimelines(timeline);
		timeline.on("change", function (e) {
			updateList(e.target);
		});
		updateList(timeline);
	}
};
'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
// var poi_clusters = new L.markerClusterGroup({
// 	disableClusteringAtZoom: 15,
// 	spiderfyOnMaxZoom: false,
// 	showCoverageOnHover: true,
// 	maxClusterRadius: 20,
// 	minClusterRadius: 1,
// });

var primary_icon,welcome_icon,no_icon,bar_icon,cafe_icon,library_icon,lodging_icon,memorial_icon,museum_icon,office_icon,pharmacy_icon,placeofworship_icon,pub_icon,restaurant_icon,shop_icon,theater_icon,vet_icon,other_icon;
	
	// init map
	var Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		minZoom: 6,
		maxZoom: 19,
		detectRetina: true,
		// opacity: 0.3,
	});
	var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		minZoom: 6,
		maxZoom: 19,
		detectRetina: true,
	});

	var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
		minZoom: 6,
		maxZoom: 19,
		detectRetina: true,
		opacity: 0.3,
	});

	var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 6,
		maxZoom: 18,
		detectRetina: true,
		ext: 'png',
		opacity: 0.8,
	});

	var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 18,
	});

	var overlay = L.polygon([
		[90, -180],
		[90, 180],
		[-90, 180],
		[-90, -180]
	], {color: 'black', opacity: 1, weight: 0, fillColor: 'white', fillOpacity: 0});

	var loadingOverlay = L.polygon([
		[90, -180],
		[90, 180],
		[-90, 180],
		[-90, -180]
	], {color: 'black', opacity: 1, weight: 0, fillColor: 'black', fillOpacity: 0});


	var map = new L.map('bigmap', {
		layers: [Stamen_TonerLite],
		maxBounds: [[90,-180],[-90,180]],
		zoomControl: false,
	})
	
	
	var lc = L.control.locate({keepCurrentZoomLevel: true, inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'inView', locateOptions: {enableHighAccuracy: true}}).addTo(map);


	document.getElementById('zoomin').addEventListener('click', function () {
		map.zoomIn();
	});
	document.getElementById('zoomout').addEventListener('click', function () {
		map.zoomOut();
	});

	var currentLoc = null;
	var state = null;

	function onLocationFound(e) {
		currentLoc=e.latlng;
		state="On";
	}

	document.getElementById('locater').addEventListener('click', function () {
		if (currentLoc==null && state==null) {
			state="Started";
			lc.start();
			map.on('locationfound', onLocationFound);
	  		locater.style.opacity = "0.9";
		} else if (currentLoc==null && state=="Started") {
			lc.stop();
			state=null;
	  		locater.style.opacity = "0.5";
			// map.on('locationfound', onLocationFound);ike
		} else if (currentLoc!==null && map.getBounds().contains(currentLoc)) {
			lc.stop();
			currentLoc=null;
			state=null;
	  		locater.style.opacity = "0.5";
		} else {
			map.setView(currentLoc);
			state="On";
	  		locater.style.opacity = "0.9";
		}
	});

	document.getElementById('loaddata').addEventListener('click', downloadData);

	// var toggleLegend  = document.getElementById("openlegend");
	// var legendContent = document.getElementById("legendbox");

	// openlegend.addEventListener("click", function() {
	//   legendbox.style.display = (legendbox.dataset.toggled ^= 1) ? "block" : "none";
	//   openlegend.style.opacity = (openlegend.dataset.toggled ^= 1) ? "0.9" : "0.6";
	// });

	// new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

	// var legend = L.control({ position: 'bottomleft' });
	// legend.onAdd = function (map) {
	// 	var div = L.DomUtil.create('div', 'legend'), icons = ['unknown','Bar','Restaurant','Pub','Cafe','Museum','Community Centre','Shop','Place of Worship'], labels = ['Unknown Type','Bar','Restaurant','Pub','Cafe','Museum','Community Centre','Shop','Place of Worship'];
	// 	// div.innerHTML =	'<span>Port of Passage</span><br><i class="points" style="color:">&#8226;</i>Bristol<br><i class="points" style="color:">&#8226;</i>Middlesex<br><i class="points" style="color:">&#8226;</i>London<br><br><span>Date of Indenture</span><br>';
	// 	for (var i = 0; i < icons.length; i++) {
	// 		div.innerHTML += '<img src="' + icons[i]+'.svg" class="legendicon"">'+labels[i]+'<br>';
	// 	}
	// 	return div;
	// };

	var zoomText = L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		onAdd: function (map) {
			return L.DomUtil.create('div', 'overlayText');
		},
		setContent: function (content) {
			this.getContainer().innerHTML = content;
		}
	});
	var zoomText =  new zoomText().addTo(map);

	document.getElementsByClassName('overlayText')[0].addEventListener('click', function () {
		map.zoomIn(1);
	});

	var loadingText = L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		onAdd: function (map) {
			return L.DomUtil.create('div', 'overlayText');
		},
		setContent: function (content) {
			this.getContainer().innerHTML = content;
		}
	});
	var loadingText =  new loadingText().addTo(map);

	var josmText = L.Control.extend({
		options: {
			position: 'bottomright'
		},
		onAdd: function (map) {
			return L.DomUtil.create('div', 'josmtext');
		},
		setContent: function (content) {
			this.getContainer().innerHTML = content;
		}
	});
	var josmText =  new josmText().addTo(map);

	map.on('load', function () {
		if (map.getZoom() < 12) {
			map.addLayer(overlay);
			zoomText.setContent('Please Zoom In');
		}
	});

	// map = L.map('bigmap');

	saved_lat = localStorage.getItem("pos_lat")
	saved_lon = localStorage.getItem("pos_lon")

	if (saved_lat != undefined) {
		map.setView([saved_lat, saved_lon], 12)
	} else {
		map.setView([51.5,-0.1], 12);
	}

	var mapHash = new L.Hash(map);

	if (L.Browser.retina) var tp = "lr";
	else var tp = "ls";

	// L.control.scale().addTo(map);

function setPoiMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {icon: icon});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var osmedit = "https://www.openstreetmap.org/edit\?"+osmtype+"="+osmid;

	if (tags.name == undefined) {
		var popup_content = "<span class='type'>"+poi_type+"</span><hr/>";
	} else {
		var popup_content = "<span class='title'>"+tags.name+"</span><br/>";
		if (poi_type == "Shop") {
			if (tags.shop == 'books') {
				popup_content += "<span class='type'>Bookstore</span><hr/>";
			} else if (tags.shop == 'hairdresser') {
				popup_content += "<span class='type'>Hairdresser</span><hr/>";
			} else if (tags.shop != 'yes') {
				popup_content += "<span class='type'>"+tags.shop+" "+poi_type+"</span><hr/>";
			}
		} else {
			popup_content += "<span class='type'>"+poi_type+"</span><hr/>";
		}
	}

	if (tags.lgbtq == 'only' || tags.gay == 'only') {
		popup_content += "🌈 <span class='only'>This location only allows members of the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'primary') {
		popup_content += "🌈 <span class='primary'>This location caters primarily to the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'welcome' || tags.lgbtq == 'friendly' || tags.gay == 'welcome' ) {
		popup_content += "<span class='welcome'>👍 This location explicitly welcomes members of the LGBTQ+ community</span><br/>";
		if (tags["source:lgbtq"]) {
			if (tags["source:lgbtq"].includes('https')) {
				popup_content += "<span class='source'>Source: <span class='sourcelink'><a href=\"" + tags["source:lgbtq"] + "\" target=\"_blank\">website</a></span></span>";
			} else {
				popup_content += "<span class='source'>Source: " + tags["source:lgbtq"] + "</span>";
			}
		}
		if (tags["source:gay"]) {
			if (tags["source:gay"].includes('https')) {
				popup_content += "<span class='source'>Source: <span class='sourcelink'><a href=\"" + tags["source:gay"] + "\" target=\"_blank\">website</a></span></span>";
			} else {
				popup_content += "<span class='source'>Source: " + tags["source:gay"] + "</span>";
			}
		}
	} else if (tags.lgbtq == 'yes' || tags.gay == 'yes') {
		popup_content += "<span class='welcome'>👍 This location allows members of the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'no' || tags.gay == 'no') {
		popup_content += "<span class='no'>⛔ This location does not welcome or prohibits members of the LGBTQ+ community</span><br/>";
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' target='_blank'>show feature on OSM</a> | <a href='"+osmedit+"' target='_blank'>edit feature on OSM</a></div>";

	mrk.bindTooltip(tags.name+"<br/><span class='tiny'>LGBTQ+ "+tags.lgbtq+"</span>",{duration: 0,direction: 'right',offset: [20,6]}).openTooltip();
	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	
	poi_markers.push(mrk);
	mrk.addTo(map);
	// poi_clusters.addTo(map);
}

function element_to_map(data) {	
	// poi_clusters.clearLayers();
	$.each(poi_markers, function(_, mrk) {
		map.removeLayer(mrk);
	});

	$.each(data.elements, function(_, el) {
		if (el.lat == undefined) {
			if (el.center == undefined) {
				return;
			} else {
				el.lat = el.center.lat;
				el.lon = el.center.lon;
			}
		}

		if (el.tags != undefined) {
			var mrk;
			// console.log('disused:amenity' in el.tags || 'construction:amenity' in el.tags);
			if ('construction:amenity' in el.tags || 'disused:amenity' in el.tags || 'abandoned:amenity' in el.tags || 'construction:tourism' in el.tags || 'disused:tourism' in el.tags || 'abandoned:tourism' in el.tags || 'construction:shop' in el.tags || 'disused:shop' in el.tags || 'abandoned:shop' in el.tags || 'construction:leisure' in el.tags || 'disused:leisure' in el.tags || 'abandoned:leisure' in el.tags) {
				//Nothing
			} else if (el.tags.amenity == "place_of_worship") {
				setPoiMarker("Place of Worship", placeofworship_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == "community_centre" || el.tags.amenity == "social_facility" || el.tags.office) {
				setPoiMarker("Center/Association", office_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.shop) {
				setPoiMarker("Shop", shop_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'bar' || el.tags.amenity == 'nightclub' || el.tags.amenity == 'swingerclub') {
				setPoiMarker("Bar/Club", bar_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'pub') {
				setPoiMarker("Pub", pub_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'restaurant') {
				setPoiMarker("Restaurant", restaurant_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'cafe') {
				setPoiMarker("Cafe", cafe_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'theatre') {
				setPoiMarker("Theater", theater_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'library') {
				setPoiMarker("Library", library_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'pharmacy') {
				setPoiMarker("Pharmacy", pharmacy_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.amenity == 'veterinary') {
				setPoiMarker("Veterinarian", vet_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.tourism == 'museum') {
				setPoiMarker("Museum", museum_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.tourism == 'hotel' || el.tags.tourism == 'guest_house' || el.tags.tourism == 'hostel' || el.tags.tourism == 'motel') {
				setPoiMarker("Lodging", lodging_icon, el.lat, el.lon, el.tags, el.id, el.type);
			// } else if (el.tags.leisure == 'sauna') {
			// 	setPoiMarker("Sauna/Steam Baths", sauna_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.historic == 'memorial') {
				setPoiMarker("Memorial", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if(el.tags.amenity) {
				setPoiMarker(el.tags.amenity, other_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if(el.tags.shop) {
				setPoiMarker(el.tags.shop+" Shop", other_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else {
				setPoiMarker("Unknown Type", other_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}

			if ('construction:amenity' in el.tags || 'disused:amenity' in el.tags || 'abandoned:amenity' in el.tags || 'construction:tourism' in el.tags || 'disused:tourism' in el.tags || 'abandoned:tourism' in el.tags || 'construction:shop' in el.tags || 'disused:shop' in el.tags || 'abandoned:shop' in el.tags || 'construction:leisure' in el.tags || 'disused:leisure' in el.tags || 'abandoned:leisure' in el.tags) {
				//Nothing
			} else if (el.tags.lgbtq == 'primary' || el.tags.lgbtq == 'only' || el.tags.gay == 'only') {
				setPoiMarker("", primary_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.lgbtq == 'welcome' || el.tags.lgbtq == 'friendly' || el.tags.lgbtq == 'yes' || el.tags.gay == 'welcome' || el.tags.gay == 'yes') {
				setPoiMarker("", welcome_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.lgbtq == 'no' || el.tags.gay == 'no') {
				setPoiMarker("", no_icon, el.lat, el.lon, el.tags, el.id, el.type);
			// } else {
			// 	setPoiMarker("", error_icon, el.lat, el.lon, el.tags, el.id, el.type);
			// 		error_counter++;
			// 	}
			}
		}
	});
	// legend.addTo(map);
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');
}

function downloadData() {
	if (map.getZoom() < 12) {
		var new_span = document.createElement('span');
		new_span.innerText = "Please Zoom In";
		return null;
	}

	document.getElementById('tipRight').style.display = 'none';
	document.getElementById('arrowRight').style.display = 'none';
	document.getElementById('tipLeft').style.display = 'none';
	document.getElementById('arrowLeft').style.display = 'none';
	
	map.addLayer(loadingOverlay);
	loadingText.setContent('Loading<img src="icons/loading.gif">');

	// var new_span = document.createElement('span');
	// new_span.innerText = "Loading...";

	bbox = map.getBounds().getSouth() + "," + map.getBounds().getWest() + "," + map.getBounds().getNorth() +  "," + map.getBounds().getEast();

	localStorage.setItem("pos_lat", map.getCenter().lat)
	localStorage.setItem("pos_lon", map.getCenter().lng)
	$.ajax({
		url: "https://z.overpass-api.de/api/interpreter",
		data: {
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr[lgbtq];nwr[gay];);out body center; >; out skel qt;'/*nwr[historic=memorial];*/
		},
		success: element_to_map,
		error: error_function,
	});

	if (map.hasLayer(bboxOutline)) {
		map.removeLayer(bboxOutline);	
	}

	var bounds = map.getBounds();
	// console.log(whatarebounds);
	var northWest = bounds.getNorthWest(),northEast = bounds.getNorthEast(),southWest = bounds.getSouthWest(),southEast = bounds.getSouthEast();

	bboxOutline = L.polygon([[[90, -180],[90, 180],[-90, 180],[-90, -180]],[[northWest.lat,northWest.lng],[northEast.lat,northEast.lng],[southEast.lat,southEast.lng],[southWest.lat,southWest.lng]]],{color: '#aaaaaa', fillColor: '#aaaaaa', fillOpacity: 0.3, weight: 1, dashArray: '1,3',}).addTo(map);

	
}

function error_function() {
	loadingText.setContent('Error, try again')
}


$(function() {
	primary_icon = L.divIcon({
		html: '🌈',
		iconSize: [26,26],
		className: 'welcomeIcon',
		iconAnchor: [25,25],
		popupAnchor: [0,-24],
	});
	welcome_icon = L.divIcon({
		html: '👍',
		iconSize: [26,26],
		className: 'welcomeIcon',
		iconAnchor: [25,25],
		popupAnchor: [0,-24],
	});
	no_icon = L.divIcon({
		html: '⛔',
		iconSize: [26,26],
		className: 'welcomeIcon',
		iconAnchor: [25,25],
		popupAnchor: [0,-24],
	});
	// bar_icon = L.divIcon({
	// 	html: '🍸',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// cafe_icon = L.divIcon({
	// 	html: '☕',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// placeofworship_icon = L.divIcon({
	// 	html: '🛐',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// lodging_icon = L.divIcon({
	// 	html: '🛏️',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// library_icon = L.divIcon({
	// 	html: '📚',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// memorial_icon = L.divIcon({
	// 	html: '📜',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// museum_icon = L.divIcon({
	// 	html: '🏺',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// office_icon = L.divIcon({
	// 	html: '🏢',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// pharmacy_icon = L.divIcon({
	// 	html: '⚕️',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// pub_icon = L.divIcon({
	// 	html: '🍺',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// restaurant_icon = L.divIcon({
	// 	html: '🍝',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// sauna_icon = L.divIcon({
	// 	html: '🧖',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// shop_icon = L.divIcon({
	// 	html: '🏪',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// theater_icon = L.divIcon({
	// 	html: '🎭',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	// vet_icon = L.divIcon({
	// 	html: '🐕',
	// 	iconSize: [30,30],
	// 	className: 'pointIcon',
	// 	iconAnchor: [15,18],
	// 	popupAnchor: [0,-24],
	// });
	bar_icon = L.icon({
		iconUrl: 'icons/bar.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	cafe_icon = L.icon({
		iconUrl: 'icons/cafe.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	library_icon = L.icon({
		iconUrl: 'icons/library.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	lodging_icon = L.icon({
		iconUrl: 'icons/lodging.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	memorial_icon = L.icon({
		iconUrl: 'icons/memorial.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	museum_icon = L.icon({
		iconUrl: 'icons/museum.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	office_icon = L.icon({
		iconUrl: 'icons/office.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	pharmacy_icon = L.icon({
		iconUrl: 'icons/pharmacy.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	placeofworship_icon = L.icon({
		iconUrl: 'icons/placeofworship.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	pub_icon = L.icon({
		iconUrl: 'icons/pub.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	restaurant_icon = L.icon({
		iconUrl: 'icons/restaurant.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	shop_icon = L.icon({
		iconUrl: 'icons/shop.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	theater_icon = L.icon({
		iconUrl: 'icons/theater.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	vet_icon = L.icon({
		iconUrl: 'icons/vet.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	other_icon = L.divIcon({
		html: '🏳️‍🌈',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});



// function go_to_current_pos() {
// 	navigator.geolocation.getCurrentPosition(function(pos) {
// 		map.setView([pos.coords.latitude, pos.coords.longitude], 12);
// 	});
// }

	// map.on('moveend', function () {
	// 	if (map.getZoom() >= 18) {
	// 		josmText.setContent('<a href="http://localhost:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit loaded area in JOSM</a> |');
	// 	}
	// 	if (map.getZoom() < 18) {
	// 		josmText.setContent('');
	// 	}
	// });

	map.on('zoomend', function () {
		// if (map.getZoom() >= 18) {
		// 	josmText.setContent('<a href="http://localhost:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit loaded area in JOSM</a> |');
		// }
		// if (map.getZoom() < 18) {
		// 	josmText.setContent('');
		// }
		if (map.getZoom() >= 12) {
			map.removeLayer(overlay);
			zoomText.setContent('');
		}
		if (map.getZoom() < 12) {
			map.addLayer(overlay);
			zoomText.setContent('Please Zoom In');
		}
	});


	document.querySelector(".leaflet-popup-pane").addEventListener("load", function (event) {
		var tagName = event.target.tagName,
		popup = map._popup; // Last open Popup.

		if (tagName === "IMG" && popup && !popup._updated) {
			popup._updated = true; // Assumes only 1 image per Popup.
			popup.update();
		}
	}, true);

	// document.getElementById('infoButton').addEventListener('click', function () {
	// 	document.getElementById("info").style.visibility = "visible";
	// });

});

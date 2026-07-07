'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
var poiDots = new L.LayerGroup();
var poiMinis = new L.LayerGroup();
var poiMain = new L.LayerGroup();
var poiClusters = new L.markerClusterGroup({
	disableClusteringAtZoom: 14,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: true,
	maxClusterRadius: 50,
	minClusterRadius: 20,
	// iconCreateFunction: function(cluster) {
	// 	return L.icon({
	// 		iconUrl: 'icons/group_icon.svg',
	// 		iconSize: [32,32],
	// 		className: 'pointIcon',
	// 		iconAnchor: [16,16],
	// 	});
	// }
});

let acer_icon;
	

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
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
	layers: [CartoDB_Positron],
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
  		locater.style.opacity = "0.7";
		// map.on('locationfound', onLocationFound);ike
	} else if (currentLoc!==null && map.getBounds().contains(currentLoc)) {
		lc.stop();
		currentLoc=null;
		state=null;
  		locater.style.opacity = "0.7";
	} else {
		map.setView(currentLoc);
		state="On";
  		locater.style.opacity = "0.9";
	}
});

document.getElementById('loaddata').addEventListener('click', downloadData);

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
	map.setZoom(15);
});

var loadingText = L.Control.extend({
	options: {
		position: 'bottomleft'
	},
	onAdd: function (map) {
		return L.DomUtil.create('div', 'overlayText loadingOverlay');
	},
	setContent: function (content) {
		this.getContainer().innerHTML = content;
	}
});
var loadingText =  new loadingText().addTo(map);

var josmText = L.Control.extend({
	options: {
		position: 'bottomleft'
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
	if (map.getZoom() < 15) {
		map.addLayer(overlay);
		zoomText.setContent('Please Zoom In');
	}
});

saved_lat = localStorage.getItem("pos_lat")
saved_lon = localStorage.getItem("pos_lon")

if (saved_lat != undefined) {
	map.setView([saved_lat, saved_lon], 15)
} else {
	map.setView([51.5,-0.1], 15);
}

var mapHash = new L.Hash(map);

if (L.Browser.retina) var tp = "lr";
else var tp = "ls";

function setMiniMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon, interactive:false,
		// rotationAngle: tags.direction-180,
	});
	
	poi_markers.push(mrk);
	mrk.addTo(poiMinis);
	if (map.getZoom() > 12) {
		poiMinis.addTo(map);
	}
}

function setPoiMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon,
		// rotationAngle: tags.direction-180,
	});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var osmedit = "https://www.openstreetmap.org/edit\?"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	// if (tags["species:en"] == undefined) {
	// }

	var popup_content = '';
	// popup_content = "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️</a> | <a href='"+osmedit+"' title=\"edit feature on OSM\" target='_blank'>✏️</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️</a></div>";

	// mrk.bindTooltip(tags.name+"<br/><span class='tiny'>LGBTQ+ "+tags.lgbtq+"</span>",{duration: 0,direction: 'right',offset: [20,6]}).openTooltip();
	// mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	
	poi_markers.push(mrk);
	// mrk.addTo(poiClusters);
	mrk.addTo(poiMain);
	if (map.getZoom() > 14) {
		poiMain.addTo(map);
	}
}

function element_to_map(data) {	
	poiClusters.clearLayers();
	poiMain.clearLayers();
	poiDots.clearLayers();
	poiMinis.clearLayers();
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
			if ((el.tags["mtb:feature"]) != undefined) {
				setPoiMarker("Broad Leaved", acer_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else {
				setPoiMarker("Unknown Type", acer_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}

			if (el.tags["species:en"] == undefined) {
				setMiniMarker("", acer_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}
			if (el.tags.species == undefined) {
				if (el.tags.genus == undefined) {
					setMiniMarker("", acer_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else {
					setMiniMarker("", acer_icon, el.lat, el.lon, el.tags, el.id, el.type);
				}
			} 
		}
	});
	// legend.addTo(map);
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');
}

function downloadData() {
	if (map.getZoom() < 15) {
		var new_span = document.createElement('span');
		new_span.innerText = "Please Zoom In";
		return null;
	}
	
	map.addLayer(loadingOverlay);
	loadingText.setContent('Loading<img src="icons/loading.gif">');

	bbox = map.getBounds().getSouth() + "," + map.getBounds().getWest() + "," + map.getBounds().getNorth() +  "," + map.getBounds().getEast();

	localStorage.setItem("pos_lat", map.getCenter().lat)
	localStorage.setItem("pos_lon", map.getCenter().lng)
	$.ajax({
		url: "https://overpass-api.de/api/interpreter",
		data: {
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr[~"^mtb:feature"~"^"];);out body center; >; out skel qt;'/*nwr[historic=memorial];*/
		},
		success: element_to_map,
		error: function(xhr, status, errorThrown){
			loadingText.setContent('<span id="error">'+errorThrown+'; <span class="tryagain">Try&nbsp;Again</span></span>');
			document.getElementById('error').addEventListener('click', downloadData);
		},
	});

	if (map.hasLayer(bboxOutline)) {
		map.removeLayer(bboxOutline);	
	}

	var bounds = map.getBounds();
	// console.log(whatarebounds);
	var northWest = bounds.getNorthWest(),northEast = bounds.getNorthEast(),southWest = bounds.getSouthWest(),southEast = bounds.getSouthEast();

	bboxOutline = L.polygon([[[90, -180],[90, 180],[-90, 180],[-90, -180]],[[northWest.lat,northWest.lng],[northEast.lat,northEast.lng],[southEast.lat,southEast.lng],[southWest.lat,southWest.lng]]],{color: '#aaaaaa', fillColor: '#aaaaaa', fillOpacity: 0.3, weight: 1, dashArray: '1,3',}).addTo(map);
}

$(function() {
	acer_icon = L.icon({
		iconUrl: 'icons/aframe.svg',
		iconSize: [30,30],
		className: 'pointIcon',
		iconAnchor: [15,30],
		popupAnchor: [0,-34],
	});

// function go_to_current_pos() {
// 	navigator.geolocation.getCurrentPosition(function(pos) {
// 		map.setView([pos.coords.latitude, pos.coords.longitude], 12);
// 	});
// }

	// map.on('moveend', function () {
	// 	if (map.getZoom() >= 18) {
	// 		josmText.setContent('<a href="http://127.0.0.1:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit area in JOSM</a>');
	// 	}
	// 	if (map.getZoom() < 18) {
	// 		josmText.setContent('');
	// 	}
	// });

	map.on('zoomend', function () {
		if (map.getZoom() > 17) {
			map.removeLayer(poiClusters);
			map.addLayer(poiMain);
			map.addLayer(poiMinis);
		}
		if (map.getZoom() <= 17) {
			map.addLayer(poiClusters);
			map.removeLayer(poiMain);
			map.removeLayer(poiMinis);
		}
		if (map.getZoom() >= 14) {
			map.removeLayer(overlay);
			zoomText.setContent('');
		}
		if (map.getZoom() < 14) {
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

});

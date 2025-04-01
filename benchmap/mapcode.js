'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
var poiMinis = new L.LayerGroup();
var poiClusters = new L.markerClusterGroup({
	disableClusteringAtZoom: 18,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: true,
	maxClusterRadius: 20,
	minClusterRadius: 1,
});

var yab_icon,yb_na_icon,ya_nb_icon,nab_icon,yb_ua_icon,nb_ua_icon,ya_ub_icon,na_ub_icon,uab_icon,inscription_icon,no_inscription_icon,colour_icon;

	let OSMCarto=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:0.3,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 20,
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
	layers: [CartoDB_Voyager],
	maxBounds: [[90,-180],[-90,180]],
	zoomControl: false,
})

map.createPane('onePane').style.zIndex = -1;
map.createPane('twoPane').style.zIndex = 20000;

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
		return L.DomUtil.create('div', 'overlayText zoomOverlay');
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
	var mrk = L.marker([lat, lon], {icon: icon});
	
	poi_markers.push(mrk);
	mrk.addTo(poiMinis);
	if (map.getZoom() > 16) {
		poiMinis.addTo(poiClusters);
	}
}

function setColourMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var colour;
	if (tags.colour != undefined) {
		colour = tags.colour;
	} else {
		colour = "#000000";
	}

	var mrk = L.marker([lat, lon], {
		icon: L.divIcon ({
			className:'colourIcon',
			html:`<svg width="24" height="24" viewBox="0 0 6.3499999 6.3499999">
  				<g transform="translate(-17.507495,-99.150042)">
    				<path style="opacity:1;vector-effect:none;fill:`+colour+`;fill-opacity:0.8;stroke:`+colour+`;stroke-width:0.05767668;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers stroke fill"
       d="m 23.828657,102.32504 a 3.1461616,3.1461613 0 0 1 -3.141755,3.14616 3.1461616,3.1461613 0 0 1 -3.150556,-3.13734 3.1461616,3.1461613 0 0 1 3.132929,-3.154951 3.1461616,3.1461613 0 0 1 3.159332,3.128511 l -3.146112,0.0176 z"/>
  				</g>
			</svg>`
		})
	});
	
	poi_markers.push(mrk);
	mrk.addTo(poiMinis);
	if (map.getZoom() > 17) {
		poiMinis.addTo(poiClusters);
	}
}

function getPanoramaxThumb(tagPanoramax) {
	var px_tag = tagPanoramax;
	var a = px_tag.substr(0,2);
	var b = px_tag.substr(2,2);
	var c = px_tag.substr(4,2);
	var d = px_tag.substr(6,2);
	var e = px_tag.substr(9);
	var px_link = "https://panoramax.openstreetmap.fr/derivates/"+a+"/"+b+"/"+c+"/"+d+"/"+e+"/thumb.jpg";
	return px_link;
}

function getPanoramaxLink(tagPanoramax) {
	var px_tag = tagPanoramax;
	var a = px_tag.substr(0,2);
	var b = px_tag.substr(2,2);
	var c = px_tag.substr(4,2);
	var d = px_tag.substr(6,2);
	var e = px_tag.substr(9);
	var px_link = "https://panoramax.openstreetmap.fr/images/"+a+"/"+b+"/"+c+"/"+d+"/"+e+".jpg";
	return px_link;
}

function inscriptionParser(inscription) {
	var slashN = inscription.replace(/ \\n /g, "<br/>");
	var doubleSlash = slashN.replace(/ \/\/ /g, "<br/><br/>");
	return doubleSlash.replace(/ \/ /g,"<br/>");
}

function setPoiMarker(poi_type, icon_name, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon_name,
	});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var osmedit = "https://www.openstreetmap.org/edit\?"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	
	if (tags.colour != undefined) {
		var popup_content = "Color: <span class=\"colorbox\" title=\""+tags.colour+"\" style=\"background-color:"+tags.colour+"\">"+tags.colour+"</span><br>";
	} else {
		var popup_content = "";
	}
	if (tags.material != undefined) {
		popup_content += "Material: <span class=\"material "+tags.material+"\">"+tags.material+"</span>";
	} else {
		popup_content += "Material: <span class=\"unknown\">unknown</span>";
	}
	if (tags.backrest != undefined) {
		popup_content += "<br/>Backrest: "+tags.backrest;
	} else {
		popup_content += "<br/>Backrest: <span class=\"unknown\">unknown</span>";
	}
	if (tags.armrest != undefined) {
		popup_content += "<br/>Armrests: "+tags.armrest;
	} else {
		popup_content += "<br/>Armrests: <span class=\"unknown\">unknown</span>";
	}

	if (tags.inscription != undefined && tags.inscription != 'no') {
		popup_content += "<br/><br/><div class='inscription'>"+inscriptionParser(tags.inscription);
		if (tags["inscription:2"] != undefined && tags["inscription:2"] != 'no') {
			popup_content += " "+inscriptionParser(tags["inscription:2"]);
			if (tags["inscription:3"] != undefined && tags["inscription:3"] != 'no') {
				popup_content += " "+inscriptionParser(tags["inscription:3"]);
			}
		}
		popup_content += "</div>"
	} else if (tags["inscription:1"] != undefined && tags["inscription:1"] != 'no') {
		popup_content += "<br/><br/><div class='inscription'>"+inscriptionParser(tags["inscription:1"]);
		if (tags["inscription:2"] != undefined && tags["inscription:2"] != 'no') {
			popup_content += " "+inscriptionParser(tags["inscription:2"]);
			if (tags["inscription:3"] != undefined && tags["inscription:3"] != 'no') {
				popup_content += " "+inscriptionParser(tags["inscription:3"]);
			}
		}
		popup_content += "</div>"
	} else if (tags.inscription == 'no') {
		popup_content += "<br/>No inscription"
	}

	if (tags.inscription_1 != undefined && tags.inscription_1 != 'no') {
		popup_content += "<br/><br/><div class='inscription'>"+inscriptionParser(tags.inscription_1);
		if (tags["inscription_1:2"] != undefined && tags["inscription_1:2"] != 'no') {
			popup_content += " "+inscriptionParser(tags["inscription_1:2"]);
			if (tags["inscription_1:3"] != undefined && tags["inscription_1:3"] != 'no') {
				popup_content += " "+inscriptionParser(tags["inscription_1:3"]);
			}
		}
		popup_content += "</div>"
	} else if (tags["inscription_1:1"] != undefined && tags["inscription_1:1"] != 'no') {
		popup_content += "<br/><br/><div class='inscription'>"+inscriptionParser(tags["inscription_1:1"]);
		if (tags["inscription_1:2"] != undefined && tags["inscription_1:2"] != 'no') {
			popup_content += " "+inscriptionParser(tags["inscription_1:2"]);
			if (tags["inscription_1:3"] != undefined && tags["inscription_1:3"] != 'no') {
				popup_content += " "+inscriptionParser(tags["inscription_1:3"]);
			}
		}
		popup_content += "</div>"
	}
	if (tags.panoramax != undefined) {
		var thumb = getPanoramaxThumb(tags.panoramax);
		var link = getPanoramaxLink(tags.panoramax);
		popup_content += "<p/><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a>";
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️</a> | <a href='"+osmedit+"' title=\"edit feature on OSM\" target='_blank'>✏️</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️</a></div>";

	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	
	poi_markers.push(mrk);
	mrk.addTo(poiClusters);
	poiClusters.addTo(map);
}

function element_to_map(data) {	
	poiClusters.clearLayers();
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

			// if (el.tags.colour != undefined) {
			// 	setColourMarker("", colour_icon, el.lat, el.lon, el.tags, el.id, el.type);
			// }

			if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
				setPoiMarker("", yab_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
				setPoiMarker("", yb_na_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
				setPoiMarker("", ya_nb_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
				setPoiMarker("", nab_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
				setPoiMarker("", yb_ua_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
				setPoiMarker("", nb_ua_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
				setPoiMarker("", ya_ub_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
				setPoiMarker("", na_ub_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
				setPoiMarker("", uab_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else {
				setPoiMarker("Unknown Type", other_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}

			if ((el.tags.inscription != undefined && el.tags.inscription != 'no') || (el.tags["inscription:1"] != undefined && el.tags["inscription:1"] != 'no')) {
				setMiniMarker("", inscription_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.inscription == 'no') {
				setMiniMarker("", no_inscription_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}
		}
	});
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');
}

function downloadData() {
	var mapHash = new L.Hash(map);
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
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr[amenity=bench];);out body center; >; out skel qt;'
		},
		success: element_to_map,
		error: error_function,
	});

	if (map.hasLayer(bboxOutline)) {
		map.removeLayer(bboxOutline);	
	}

	var bounds = map.getBounds();
	var northWest = bounds.getNorthWest(),northEast = bounds.getNorthEast(),southWest = bounds.getSouthWest(),southEast = bounds.getSouthEast();

	bboxOutline = L.polygon([[[90, -180],[90, 180],[-90, 180],[-90, -180]],[[northWest.lat,northWest.lng],[northEast.lat,northEast.lng],[southEast.lat,southEast.lng],[southWest.lat,southWest.lng]]],{color: '#aaaaaa', fillColor: '#aaaaaa', fillOpacity: 0.3, weight: 1, dashArray: '1,3',}).addTo(map);
}

function error_function() {
	loadingText.setContent('Error, try again')
}

$(function() {
	yab_icon = L.icon({
		iconUrl: 'icons/yab_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	ya_nb_icon = L.icon({
		iconUrl: 'icons/ya_nb_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	ya_ub_icon = L.icon({
		iconUrl: 'icons/ya_ub_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	yb_na_icon = L.icon({
		iconUrl: 'icons/yb_na_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	yb_ua_icon = L.icon({
		iconUrl: 'icons/yb_ua_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	nab_icon = L.icon({
		iconUrl: 'icons/nab_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	na_ub_icon = L.icon({
		iconUrl: 'icons/na_ub_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	nb_ua_icon = L.icon({
		iconUrl: 'icons/nb_ua_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	uab_icon = L.icon({
		iconUrl: 'icons/uab_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-24],
	});
	inscription_icon = L.icon({
		iconUrl: 'icons/inscription.svg',
		iconSize: [8,5],
		className: 'sourceIcon',
		iconAnchor: [4,-5],
	});
	no_inscription_icon = L.icon({
		iconUrl: 'icons/no_inscription.svg',
		iconSize: [8,5],
		className: 'sourceIcon',
		iconAnchor: [4,-5],
	});

	map.on('moveend', function () {
		if (map.getZoom() >= 18) {
			josmText.setContent('<a href="http://127.0.0.1:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit area in JOSM</a>');
		}
		if (map.getZoom() < 18) {
			josmText.setContent('');
		}
	});

	map.on('zoomend', function () {
		// if (map.getZoom() > 16) {
		// 	map.addLayer(poiMinis);
		// }
		// if (map.getZoom() <= 16) {
		// 	map.removeLayer(poiMinis);
		// }
		if (map.getZoom() >= 15) {
			map.removeLayer(overlay);
			zoomText.setContent('');
		}
		if (map.getZoom() < 15) {
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

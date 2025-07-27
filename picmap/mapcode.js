'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
// var poiDots = new L.LayerGroup();
// var poiMinis = new L.LayerGroup();
var picLayer = new L.LayerGroup();
var poiClusters = new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: true,
	maxClusterRadius: 20,
	minClusterRadius: 1,
	// clusterPane: 'clustersPane',
});
var poiClustersPic= new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: true,
	maxClusterRadius: 20,
	minClusterRadius: 1,
	// clusterPane: 'clustersPicPane',
	iconCreateFunction: function(cluster) {
		return L.divIcon({ className: 'pic-cluster', html: '<div><span>' + cluster.getChildCount() + '</span></div>' });
	}
});

var counter = 0;
var counter_div = document.getElementById("counter_display");

var artwork_icon,attraction_icon,building_icon,castle_icon,cemetery_icon,globe_icon,information_icon,landmark_icon,library_icon,memorial_icon,monument_icon,museum_icon,temple_icon,church_icon,synagogue_icon,mosque_icon,school_icon,viewpoint_icon,village_icon,
	artwork_icon_pic,attraction_icon_pic,building_icon_pic,castle_icon_pic,cemetery_icon_pic,globe_icon_pic,information_icon_pic,landmark_icon_pic,library_icon_pic,memorial_icon_pic,monument_icon_pic,museum_icon_pic,temple_icon_pic,church_icon_pic,synagogue_icon_pic,mosque_icon_pic,school_icon_pic,viewpoint_icon_pic,village_icon_pic;

	// var OSMCarto=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:0.3,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
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

map.createPane('clustersPane').style.zIndex = 4000;
map.createPane('clustersPicPane').style.zIndex = 6000;

var lc = L.control.locate({keepCurrentZoomLevel: true, inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'inView', locateOptions: {enableHighAccuracy: true}}).addTo(map);

document.getElementById('zoomin').addEventListener('click', function () {
	map.zoomIn();
});
document.getElementById('zoomout').addEventListener('click', function () {
	map.zoomOut();
});

document.getElementById('pictures').addEventListener('click', togglePictures);

function togglePictures() {
	if (map.hasLayer(picLayer)) {
		map.removeLayer(picLayer);
	} else {
		map.addLayer(picLayer);	
	}
}

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
	map.setZoom(14);
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
console.log(mapHash);

if (L.Browser.retina) var tp = "lr";
else var tp = "ls";


function getPxThumb(tagPanoramax) {
	var px_link = "https://api.panoramax.xyz/api/pictures/"+tagPanoramax+"/thumb.jpg";
	return px_link
}

function getPxLink(tagPanoramax) {
	var px_link = "https://api.panoramax.xyz/#s=fp;s2;p"+tagPanoramax;
	return px_link;
}

function setPoiMarker(poi_type, icon_name, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon_name,
	});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var iDedit = "https://www.openstreetmap.org/edit\?editor=id&"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	if (tags.name != null) {
		if (tags.tourism == 'artwork' || tags.information == 'board') {
			var popup_content = "<span class=\"title\">"+tags.name+"</span><br/>";
		} else {
			var popup_content = "<span class=\"name\">"+tags.name+"</span><br/>";
		}
	} else {
		var popup_content = "";
	}

	if (tags.tourism == 'artwork' && tags.start_date != null) {
		if (tags.artwork_type != null) {
			popup_content += "<span class=\"type\">"+tags.artwork_type+"</span><br/>";
		} else {
			popup_content += "<span class=\"type\">Artwork</span><br/>";
		}
		if (tags.start_date != null) {
			popup_content += "<span>Date: "+tags.start_date+"</span><br/>";
		}
	} else if (tags.tourism == 'attraction') {
		popup_content += "<span class=\"type\">Attraction</span><br/>";
	} else if (tags.historic == 'castle' || tags.building == 'castle' || tags.ruins == 'castle') {
		popup_content += "<span class=\"type\">Castle</span><br/>";
	} else if (tags.historic == 'tomb') {
		popup_content += "<span class=\"type\">Tomb</span><br/>";
	} else if (tags.tourism == 'information' && tags.information == 'map') {
		popup_content += "<span class=\"type\">Map</span><br/>";
	} else if (tags.tourism == 'information' && tags.information == 'board') {
		popup_content += "<span class=\"type\">Information Board</span><br/>";
	} else if (tags.historic == 'memorial') {
		popup_content += "<span class=\"type\">Memorial</span><br/>";
	} else if (tags.historic == 'monument') {
		popup_content += "<span class=\"type\">Monument</span><br/>";
	} else if (tags.tourism == 'museum' || tags.building == 'museum') {
		popup_content += "<span class=\"type\">Museum</span><br/>";
	} else if (tags.building == 'temple') {
		popup_content += "<span class=\"type\">Temple Building</span><br/>";
	} else if (tags.building == 'church') {
		popup_content += "<span class=\"type\">Church Building</span><br/>";
	} else if (tags.building == 'synagogue') {
		popup_content += "<span class=\"type\">Synagogue Building</span><br/>";
	} else if (tags.building == 'mosque') {
		popup_content += "<span class=\"type\">Mosque Building</span><br/>";
	} else if (tags.building == 'school') {
		popup_content += "<span class=\"type\">School Building</span><br/>";
	} else if (tags.historic == 'building') {
		popup_content += "<span class=\"type\">Historic Building</span><br/>";
	} else if (tags.tourism == 'viewpoint') {
		popup_content += "<span class=\"type\">Viewpoint</span><br/>";
	} else if (tags.historic == 'wayside_shrine') {
		popup_content += "<span class=\"type\">Wayside Shrine</span><br/>";
	} else if (tags.historic && tags.historic != 'yes') {
		popup_content += "<span class=\"type\">"+tags.historic+"</span><br/>";
	} else if (tags.amenity) {
		popup_content += "<span class=\"type\">"+tags.amenity+"</span><br/>";
	}

	if (tags.panoramax != undefined) {
		if (tags.panoramax.includes(";")) {
			var array = tags.panoramax.split(';');
			var j = tags.panoramax.split(';').length;
			console.log(j);
			var thumb = getPxThumb(array[0]);
			var link = getPxLink(array[0]);
			popup_content += "<a href='"+link+"' target='_blank'><img src='"+thumb+"'></a><br/>";
			for (let i = 1; i < j; i++) {
				var thumb = getPxThumb(array[i]);
				var link = getPxLink(array[i]);
				popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
			}
		} else {
			var thumb = getPxThumb(tags.panoramax);
			var link = getPxLink(tags.panoramax);
			popup_content += "<a href='"+link+"' target='_blank'><img src='"+thumb+"'></a><br/>";
		}
	}
	if (tags["panoramax:1"] != undefined) {
		var thumb = getPxThumb(tags["panoramax:1"]);
		var link = getPxLink(tags["panoramax:1"]);
		popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
	}
	if (tags["panoramax:2"] != undefined) {
		var thumb = getPxThumb(tags["panoramax:2"]);
		var link = getPxLink(tags["panoramax:2"]);
		popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
	}
	if (tags["panoramax:3"] != undefined) {
		var thumb = getPxThumb(tags["panoramax:3"]);
		var link = getPxLink(tags["panoramax:3"]);
		popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
	}
	if (tags["panoramax:4"] != undefined) {
		var thumb = getPxThumb(tags["panoramax:4"]);
		var link = getPxLink(tags["panoramax:4"]);
		popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️ OSM</a> | <a href='"+iDedit+"' title=\"edit feature on OSM\" target='_blank'>✏️ iD</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️ JOSM</a></div>";

	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	// mrk.bindTooltip(L.tooltip({permanent:true,direction:'top'}).setContent(tooltip_content)).openTooltip;

	poi_markers.push(mrk);
	if (tags.panoramax != undefined) {
		mrk.addTo(poiClustersPic);
	} else {
		mrk.addTo(poiClusters);
	}
	poiClustersPic.addTo(picLayer);
	// picLayer.addTo(map);
	poiClusters.addTo(map);

}

function element_to_map(data) {
	counter = 0;
	poiClusters.clearLayers();
	poiClustersPic.clearLayers();
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
			if (el.tags.panoramax == null) {
				if (el.tags.tourism == 'artwork' && el.tags.start_date != null && el.tags.start_date.substring(0,4) < 1978) {
					setPoiMarker("", artwork_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.historic == 'memorial') {
					setPoiMarker("", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else {
					setPoiMarker("", landmark_icon, el.lat, el.lon, el.tags, el.id, el.type);
				}
			} else if (el.tags.panoramax != null) {
				if (el.tags.tourism == 'artwork') {
					setPoiMarker("", artwork_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.historic == 'memorial') {
					setPoiMarker("", memorial_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				} else {
					setPoiMarker("", landmark_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counter++;
				}
			}
		}
	});
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');

	while (counter_div.hasChildNodes()) {
		counter_div.removeChild(counter_div.lastChild);
	}
	var new_span = document.createElement('span');
	new_span.innerHTML = counter;
	counter_div.appendChild(new_span);
}

function downloadData() {
	var mapHash = new L.Hash(map);
	if (map.getZoom() < 14) {
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
				"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr["tourism"="information"]["information"="board"];nwr["tourism"~"attraction|viewpoint|museum"];nwr["tourism"="artwork"]["start_date"];nwr["historic"]["historic"!~"district|milestone|cemetery|place"][!"demolished:building"];nwr["building"~"temple|church|synagogue|mosque"];nwr["amenity"="library"];);out body center; >; out skel qt;'
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
	artwork_icon = L.icon({
		iconUrl: 'icons/art-gallery-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	artwork_icon_pic = L.icon({
		iconUrl: 'icons/art-gallery-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	attraction_icon = L.icon({
		iconUrl: 'icons/attraction-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	attraction_icon_pic = L.icon({
		iconUrl: 'icons/attraction-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	building_icon = L.icon({
		iconUrl: 'icons/building-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	building_icon_pic = L.icon({
		iconUrl: 'icons/building-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	castle_icon = L.icon({
		iconUrl: 'icons/castle-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	castle_icon_pic = L.icon({
		iconUrl: 'icons/castle-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	cemetery_icon = L.icon({
		iconUrl: 'icons/cemetery-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	cemetery_icon_pic = L.icon({
		iconUrl: 'icons/cemetery-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	globe_icon = L.icon({
		iconUrl: 'icons/globe-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	globe_icon_pic = L.icon({
		iconUrl: 'icons/globe-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	information_icon = L.icon({
		iconUrl: 'icons/information-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	information_icon_pic = L.icon({
		iconUrl: 'icons/information-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	landmark_icon = L.icon({
		iconUrl: 'icons/landmark-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	landmark_icon_pic = L.icon({
		iconUrl: 'icons/landmark-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	library_icon = L.icon({
		iconUrl: 'icons/library-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	library_icon_pic = L.icon({
		iconUrl: 'icons/library-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	memorial_icon = L.icon({
		iconUrl: 'icons/bank-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	memorial_icon_pic = L.icon({
		iconUrl: 'icons/bank-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	monument_icon = L.icon({
		iconUrl: 'icons/monument-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	monument_icon_pic = L.icon({
		iconUrl: 'icons/monument-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	museum_icon = L.icon({
		iconUrl: 'icons/museum-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	museum_icon_pic = L.icon({
		iconUrl: 'icons/museum-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	temple_icon = L.icon({
		iconUrl: 'icons/religious-buddhist-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	temple_icon_pic = L.icon({
		iconUrl: 'icons/religious-buddhist-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	church_icon = L.icon({
		iconUrl: 'icons/religious-christian-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	church_icon_pic = L.icon({
		iconUrl: 'icons/religious-christian-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	synagogue_icon = L.icon({
		iconUrl: 'icons/religious-jewish-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	synagogue_icon_pic = L.icon({
		iconUrl: 'icons/religious-jewish-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	mosque_icon = L.icon({
		iconUrl: 'icons/religious-muslim-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	mosque_icon_pic = L.icon({
		iconUrl: 'icons/religious-muslim-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	school_icon = L.icon({
		iconUrl: 'icons/school-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	school_icon_pic = L.icon({
		iconUrl: 'icons/school-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	viewpoint_icon = L.icon({
		iconUrl: 'icons/viewpoint-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	viewpoint_icon_pic = L.icon({
		iconUrl: 'icons/viewpoint-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	village_icon = L.icon({
		iconUrl: 'icons/village-15.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	village_icon_pic = L.icon({
		iconUrl: 'icons/village-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});

	// map.on('moveend', function () {
	// 	if (map.getZoom() >= 19) {
	// 		josmText.setContent('<a href="http://127.0.0.1:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit area in JOSM</a>');
	// 	}
	// 	if (map.getZoom() < 19) {
	// 		josmText.setContent('');
	// 	}
	// });
	map.on('zoomend', function () {
		// if (map.getZoom() > 16) {
		// 	// map.removeLayer(poiClusters);
		// 	// map.addLayer(poiMain);
		// 	// map.addLayer(picLayer);
		// }
		// if (map.getZoom() <= 16) {
		// 	// map.addLayer(poiClusters);
		// 	// map.removeLayer(poiMain);
		// 	// map.removeLayer(picLayer);
		// }
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

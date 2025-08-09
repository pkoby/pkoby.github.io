'use strict';
let saved_lat, saved_lon, bbox, bboxOutline;
const poi_markers = new Array();
// var poiDots = new L.LayerGroup();
// var poiMinis = new L.LayerGroup();
const picLayer = new L.LayerGroup();
// const cLayer = new L.LayerGroup();
// const pLayer = new L.LayerGroup();
// const mLayer = new L.LayerGroup();
// const iLayer = new L.LayerGroup();
const noPicLayer = new L.LayerGroup();
const poiClustersNoPic = new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	maxClusterRadius: 30,
	minClusterRadius: 1,
});
// const poiClustersPic= new L.markerClusterGroup({
// 	disableClusteringAtZoom: 17,
// 	spiderfyOnMaxZoom: true,
// 	showCoverageOnHover: true,
// 	maxClusterRadius: 30,
// 	minClusterRadius: 1,
// 	iconCreateFunction: function(cluster) {
// 		return L.divIcon({ className: 'pic-cluster', html: '<div><span>' + cluster.getChildCount() + '</span></div>' });
// 	}
// });
const poiClustersC= new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	maxClusterRadius: 30,
	minClusterRadius: 1,
	iconCreateFunction: function(cluster) {
		return L.divIcon({ className: 'c-cluster', html: '<div><span>' + cluster.getChildCount() + '</span></div>' });
	}
});
const poiClustersP= new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	maxClusterRadius: 30,
	minClusterRadius: 1,
	iconCreateFunction: function(cluster) {
		return L.divIcon({ className: 'p-cluster', html: '<div><span>' + cluster.getChildCount() + '</span></div>' });
	}
});
const poiClustersM= new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	maxClusterRadius: 30,
	minClusterRadius: 1,
	iconCreateFunction: function(cluster) {
		return L.divIcon({ className: 'm-cluster', html: '<div><span>' + cluster.getChildCount() + '</span></div>' });
	}
});
const poiClustersI= new L.markerClusterGroup({
	disableClusteringAtZoom: 17,
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	maxClusterRadius: 30,
	minClusterRadius: 1,
	iconCreateFunction: function(cluster) {
		return L.divIcon({ className: 'i-cluster', html: '<div><span>' + cluster.getChildCount() + '</span></div>' });
	}
});

let counterPics = 0;
let counterNoPics = 0;
let counter_1_div = document.getElementById("count1");
let counter_2_div = document.getElementById("count2");

let artwork_icon_n,attraction_icon_n,bench_icon_n,bookcase_icon_n,bridge_icon_n,bike_rental_icon_n,castle_icon_n,cemetery_icon_n,church_icon_n,defibrillator_icon_n,globe_icon_n,information_icon_n,landmark_icon_n,library_icon_n,memorial_icon_n,monument_icon_n,mosque_icon_n,museum_icon_n,obelisk_icon_n,plaque_icon_n,ruins_icon_n,school_icon_n,shrine_icon_n,statue_icon_n,synagogue_icon_n,temple_icon_n,viewpoint_icon_n,village_icon_n,
	artwork_icon_w,attraction_icon_w,bench_icon_w,bookcase_icon_w,bridge_icon_w,bike_rental_icon_w,castle_icon_w,cemetery_icon_w,church_icon_w,defibrillator_icon_w,globe_icon_w,information_icon_w,landmark_icon_w,library_icon_w,memorial_icon_w,monument_icon_w,mosque_icon_w,museum_icon_w,obelisk_icon_w,plaque_icon_w,ruins_icon_w,school_icon_w,shrine_icon_w,statue_icon_w,synagogue_icon_w,temple_icon_w,viewpoint_icon_w,village_icon_w,
	artwork_icon_c,attraction_icon_c,bench_icon_c,bookcase_icon_c,bridge_icon_c,bike_rental_icon_c,castle_icon_c,cemetery_icon_c,church_icon_c,defibrillator_icon_c,globe_icon_c,information_icon_c,landmark_icon_c,library_icon_c,memorial_icon_c,monument_icon_c,mosque_icon_c,museum_icon_c,obelisk_icon_c,plaque_icon_c,ruins_icon_c,school_icon_c,shrine_icon_c,statue_icon_c,synagogue_icon_c,temple_icon_c,viewpoint_icon_c,village_icon_c,
	artwork_icon_p,attraction_icon_p,bench_icon_p,bookcase_icon_p,bridge_icon_p,bike_rental_icon_p,castle_icon_p,cemetery_icon_p,church_icon_p,defibrillator_icon_p,globe_icon_p,information_icon_p,landmark_icon_p,library_icon_p,memorial_icon_p,monument_icon_p,mosque_icon_p,museum_icon_p,obelisk_icon_p,plaque_icon_p,ruins_icon_p,school_icon_p,shrine_icon_p,statue_icon_p,synagogue_icon_p,temple_icon_p,viewpoint_icon_p,village_icon_p,
	artwork_icon_m,attraction_icon_m,bench_icon_m,bookcase_icon_m,bridge_icon_m,bike_rental_icon_m,castle_icon_m,cemetery_icon_m,church_icon_m,defibrillator_icon_m,globe_icon_m,information_icon_m,landmark_icon_m,library_icon_m,memorial_icon_m,monument_icon_m,mosque_icon_m,museum_icon_m,obelisk_icon_m,plaque_icon_m,ruins_icon_m,school_icon_m,shrine_icon_m,statue_icon_m,synagogue_icon_m,temple_icon_m,viewpoint_icon_m,village_icon_m,
	artwork_icon_i,attraction_icon_i,bench_icon_i,bookcase_icon_i,bridge_icon_i,bike_rental_icon_i,castle_icon_i,cemetery_icon_i,church_icon_i,defibrillator_icon_i,globe_icon_i,information_icon_i,landmark_icon_i,library_icon_i,memorial_icon_i,monument_icon_i,mosque_icon_i,museum_icon_i,obelisk_icon_i,plaque_icon_i,ruins_icon_i,school_icon_i,shrine_icon_i,statue_icon_i,synagogue_icon_i,temple_icon_i,viewpoint_icon_i,village_icon_i;

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
	while (counter_1_div.hasChildNodes()) {
		counter_1_div.removeChild(counter_1_div.lastChild);
	}
	while (counter_2_div.hasChildNodes()) {
		counter_2_div.removeChild(counter_2_div.lastChild);
	}
	var new_span_pics = document.createElement('span');
	var new_span_no_pics = document.createElement('span');
	if (map.hasLayer(noPicLayer)) {
		map.removeLayer(noPicLayer);
		map.addLayer(picLayer);
		// map.addLayer(cLayer);
		// map.addLayer(pLayer);
		// map.addLayer(mLayer);
		// map.addLayer(iLayer);
	} else {
		// map.removeLayer(cLayer);
		// map.removeLayer(pLayer);
		// map.removeLayer(mLayer);
		// map.removeLayer(iLayer);
		map.removeLayer(picLayer);
		map.addLayer(noPicLayer);
	}
	if (map.hasLayer(noPicLayer)) {
		new_span_pics.innerHTML = counterPics;
		new_span_no_pics.innerHTML = counterNoPics;
		counter_1_div.appendChild(new_span_no_pics);
		counter_2_div.appendChild(new_span_pics);
	} else {
		new_span_pics.innerHTML = counterPics;
		new_span_no_pics.innerHTML = counterNoPics;
		counter_1_div.appendChild(new_span_pics);
		counter_2_div.appendChild(new_span_no_pics);
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
	map.setZoom(13);
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

if (saved_lat != null) {
	map.setView([saved_lat, saved_lon], 15)
} else {
	map.setView([51.5,-0.1], 15);
}

var mapHash = new L.Hash(map);

if (L.Browser.retina) var tp = "lr";
else var tp = "ls";


function parseWikiFile(tagWiki) {
	var wiki_tag = tagWiki;
	var wiki_file_no_special = decodeURI(wiki_tag);
	var wiki_file_no_spaces = wiki_file_no_special.replace(new RegExp(' ', 'g'), '\_').replace(new RegExp('\%2C', 'g'), '\,');
	var wiki_file_no_apos = wiki_file_no_special.replace(new RegExp('\'', 'g'), '\&apos\;');
	return wiki_file_no_apos;
}

function getWikiImg(tagWiki) {
	var wiki_tag = tagWiki;
	if (wiki_tag.includes("File:")) {
		var wiki_file = wiki_tag.split("File:")[1];
	} else if (wiki_tag.includes("File%3A")) {
		var wiki_file = wiki_tag.split("File%3A")[1];
	} else if (wiki_tag.includes("media/Datei:")) {
		var wiki_file = wiki_tag.split("media/Datei:")[1];
	}
	var wiki_file_no_special = decodeURI(wiki_file);
	var wiki_file_no_spaces = wiki_file_no_special.replace(new RegExp(' ', 'g'), '\_').replace(new RegExp('\%2C', 'g'), '\,');
	var wiki_file_no_apos = wiki_file_no_spaces.replace(new RegExp('\'', 'g'), '\&apos\;');
	var hash = calcMD5(unescape(encodeURIComponent(wiki_file_no_spaces)));
	var wiki_link = "https://upload.wikimedia.org/wikipedia/commons/"+hash.substring(0,1)+"/"+hash.substring(0,2)+"/"+wiki_file_no_apos;
	return wiki_link;
}

function getWikiThumb(tagWiki) {
	var wiki_tag = tagWiki;
	if (wiki_tag.includes("File:")) {
		var wiki_file = wiki_tag.split("File:")[1];
	} else if (wiki_tag.includes("File%3A")) {
		var wiki_file = wiki_tag.split("File%3A")[1];
	} else if (wiki_tag.includes("media/Datei:")) {
		var wiki_file = wiki_tag.split("media/Datei:")[1];
	}
	var wiki_file_no_special = decodeURI(wiki_file);
	var wiki_file_no_spaces = wiki_file_no_special.replace(new RegExp(' ', 'g'), '\_');
	var wiki_file_no_apos = wiki_file_no_spaces.replace(new RegExp('\'', 'g'), '\&apos\;');
	var hash = calcMD5(unescape(encodeURIComponent(wiki_file_no_spaces)));
	var wiki_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/"+hash.substring(0,1)+"/"+hash.substring(0,2)+"/"+wiki_file_no_apos+"/250px-"+wiki_file_no_apos;
	return wiki_link;
}

function splitLast(str, substring) {
  const lastIndex = str.lastIndexOf(substring);

  const before = str.slice(0, lastIndex);

  const after = str.slice(lastIndex + 1);

  return [before, after];
}

function getPxThumb(tagPanoramax) {
	var px_link = "https://api.panoramax.xyz/api/pictures/"+tagPanoramax+"/thumb.jpg";
	return px_link
}

function getPxLink(tagPanoramax) {
	var px_link = "https://api.panoramax.xyz/#s=fp;s2;p"+tagPanoramax;
	return px_link;
}

function getMLLink(tagMapillary) {
	var ml_link = "https://www.mapillary.com/app/?focus=photo&pKey="+tagMapillary;
	return ml_link;
}

function setPoiMarker(poi_type, icon_name, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon_name,
	});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var iDedit = "https://www.openstreetmap.org/edit\?editor=id&"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	if (tags["board:title"] != null && tags.tourism == 'information' && tags.information == 'board') {
		var popup_content = "<span class=\"title\">"+tags["board:title"]+"</span><br/>";
	} else if (tags.name != null) {
		if (tags.tourism == 'artwork') {
			var popup_content = "<span class=\"title\">"+tags.name+"</span><br/>";
		} else {
			var popup_content = "<span class=\"name\">"+tags.name+"</span><br/>";
		}
	} else {
		var popup_content = "";
	}
	if (tags.tourism == 'artwork') {
		if (tags.start_date != null) {
			if (tags.start_date.substring(0,4) < 1978) {
				if (tags.artwork_type != null) {
					popup_content += "<span class=\"type\">Artwork ("+tags.artwork_type+")</span><br/><span>"+tags.start_date+"</span><br/>";
				} else {
					popup_content += "<span class=\"type\">Artwork</span><br/><span>"+tags.start_date+"</span><br/>";
				}
			} else if (tags.start_date.substring(0,4) >= 1978) {
				if (tags.artwork_type != null) {
					popup_content += "<span class=\"type\">Artwork ("+tags.artwork_type+")</span><br/><span>"+tags.start_date+", </span><span class='invalid'>Check <a href='https://commons.wikimedia.org/wiki/Commons:Public_art_and_copyrights_in_the_US' title='Public art and copyrights in the US'>copyright</a>!</span><br/>";
				} else {
					popup_content += "<span class=\"type\">Artwork</span><br/><span>"+tags.start_date+", </span><span class='invalid'>Check <a href='https://commons.wikimedia.org/wiki/Commons:Public_art_and_copyrights_in_the_US' title='Public art and copyrights in the US'>copyright</a>!</span><br/>";
				}
			}
		} else {
			if (tags.artwork_type != null) {
				popup_content += "<span class=\"type\">Artwork ("+tags.artwork_type+")</span><br/>";
			} else {
				popup_content += "<span class=\"type\">Artwork</span><br/>";
			}
			popup_content += "<span class='invalid'>Check creation date & <a href='https://commons.wikimedia.org/wiki/Commons:Public_art_and_copyrights_in_the_US' title='Public art and copyrights in the US'>copyright</a>!</span><br/>";
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
		if (tags.memorial != null) {
			if (tags.memorial == 'war_memorial') {
				popup_content += "<span class=\"type\">War Memorial</span><br/>";
			} else if (tags.memorial == 'blue_plaque') {
				popup_content += "<span class=\"type\">Blue Plaque Memorial</span><br/>";
			} else if (tags.memorial == 'ghost_bike') {
				popup_content += "<span class=\"type\">Ghost Bike Memorial</span><br/>";
			} else {
				popup_content += "<span class=\"type\">Memorial "+tags.memorial+"</span><br/>";
			}
		} else {
			popup_content += "<span class=\"type\">Memorial</span><br/>";
		}
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
	} else if (tags.emergency == 'defibrillator') {
		popup_content += "<span class=\"type\"> Defibrillator</span><br/>";
	} else if (tags.man_made == 'bridge') {
		popup_content += "<span class=\"type\">Bridge</span><br/>";
	} else if (tags.amenity == 'bicycle_rental') {
		popup_content += "<span class=\"type\">Bicycle Rental</span><br/>";
	} else if (tags.amenity == 'public_bookcase') {
		popup_content += "<span class=\"type\">Public Bookcase</span><br/>";
	} else if (tags.amenity) {
		popup_content += "<span class=\"type\">"+tags.amenity+"</span><br/>";
	} 

	if (tags.wikimedia_commons != null && !tags.wikimedia_commons.includes("Category")) {
		var file = parseWikiFile(tags.wikimedia_commons);
		var link = getWikiImg(tags.wikimedia_commons);
		var thumb = getWikiThumb(tags.wikimedia_commons);
		if (tags.wikimedia_commons.startsWith("File")) {
			popup_content += "<div class='image'><a href='https://commons.wikimedia.org/wiki/"+file+"' target='_blank'><img src='"+thumb+"' class='mainImage' alt='"+file+"' title='"+file+"'><img class='badge' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'></a></div>";
		} else if (tags.wikimedia_commons.includes("//commons.wikimedia.org/wiki/File")) {
			popup_content += "<div class='image'><span class='invalid' alt='"+tags.wikimedia_commons+"'>(Invalid image tag)</span><br><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='mainImage' alt='"+file+"' title='"+file+"'><img class='badge' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'></a></div>";
		} else {
			popup_content += "<span class='invalid' alt='"+tags.wikimedia_commons+"'>Invalid image tag: <a href='https://commons.wikimedia.org/wiki/"+file+"' target='_blank'>"+tags.wikimedia_commons+"</span>";
		}
		if (tags.panoramax != null) {
			if (tags.panoramax.includes(";")) {
				var array = tags.panoramax.split(';');
				var j = tags.panoramax.split(';').length;
				var link = getPxLink(array[0]);
				popup_content += "<br/><a href='"+link+"' class='panoramax' target='_blank'><img class='logo' src='icons/PanoramaxLogo.jpg' title='Panoramax'> Panoramax</a><br/>";
			} else {
				var link = getPxLink(tags.panoramax);
				popup_content += "<br/><a href='"+link+"' class='panoramax' target='_blank'><img class='logo' src='icons/PanoramaxLogo.jpg' title='Panoramax'> Panoramax</a><br/>";
			}
			if (tags.mapillary != null) {
				popup_content += " | <a href='"+getMLLink(tags.mapillary)+"' class='mapillary' target='_blank'><img class='logo' src='icons/MapillaryLogo.svg' title='Mapillary'> Mapillary</a><br/>";
			}
		} else if (tags.mapillary != null) {
			popup_content += "<br/><a href='"+getMLLink(tags.mapillary)+"' class='mapillary' target='_blank'><img class='logo' src='icons/MapillaryLogo.svg' title='Mapillary'> Mapillary</a><br/>";
		}
	} else if (tags.panoramax != null) {
		if (tags.panoramax.includes(";")) {
			var array = tags.panoramax.split(';');
			var j = tags.panoramax.split(';').length;
			var thumb = getPxThumb(array[0]);
			var link = getPxLink(array[0]);
			popup_content += "<div class='image'><a href='"+link+"' target='_blank'><img class='mainImage' src='"+thumb+"'><img class='badge' src='icons/PanoramaxLogo.jpg' title='Panoramax'></a><br/></div>";
			for (let i = 1; i < j; i++) {
				var thumb = getPxThumb(array[i]);
				var link = getPxLink(array[i]);
				popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
			}
		} else {
			var thumb = getPxThumb(tags.panoramax);
			var link = getPxLink(tags.panoramax);
			popup_content += "<div class='image'><a href='"+link+"' target='_blank'><img class='mainImage' src='"+thumb+"'><img class='badge' src='icons/PanoramaxLogo.jpg' title='Panoramax'></a><br/></div>";
		}
		if (tags["panoramax:1"] != null) {
			var thumb = getPxThumb(tags["panoramax:1"]);
			var link = getPxLink(tags["panoramax:1"]);
			popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
		}
		if (tags["panoramax:2"] != null) {
			var thumb = getPxThumb(tags["panoramax:2"]);
			var link = getPxLink(tags["panoramax:2"]);
			popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
		}
		if (tags["panoramax:3"] != null) {
			var thumb = getPxThumb(tags["panoramax:3"]);
			var link = getPxLink(tags["panoramax:3"]);
			popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
		}
		if (tags["panoramax:4"] != null) {
			var thumb = getPxThumb(tags["panoramax:4"]);
			var link = getPxLink(tags["panoramax:4"]);
			popup_content += "<a href='"+link+"' target='_blank'><img class='tiny-pic' src='"+thumb+"'></a>";
		}
		if (tags.wikimedia_commons != null && tags.wikimedia_commons.includes("Category")) {
			var array = tags.wikimedia_commons.split(':');
			var category = array[1];
			var category_no_apos = tags.wikimedia_commons.replace(new RegExp('\'', 'g'), '\&apos\;');
			console.log(category_no_apos);
			popup_content += "<span class='category' alt='"+tags.wikimedia_commons+"'><a href='https://commons.wikimedia.org/wiki/"+category_no_apos+"' target='_blank'>Wikimedia Category: "+category+"</a></span>";//<img class='categoryLogo' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'> 
		}
	} else if (tags.mapillary != null) {
		popup_content += "<a href='"+getMLLink(tags.mapillary)+"' class='mapillary' target='_blank'><img class='logo' src='icons/MapillaryLogo.svg' title='Mapillary'> Mapillary Image Link</a><br/>";
	} else if (tags.image != null) {
		if (tags.image.includes("//static.panoramio.com")) {
			popup_content += "<span class='invalid' title='"+tags.image+"'>Image tag may be invalid</span><br/>";
		} else if (tags.image.includes("//commons.wikimedia.org") || tags.image.startsWith("File:") || tags.image.includes("wikipedia.org")) {
			var link = getWikiImg(tags.image);
			var thumb = getWikiThumb(tags.image);
			popup_content += "<a href='"+link+"' target='_blank'><img src='"+thumb+"' class='mainImage'></a><br/><span class='note' title='"+tags.image+"'>Move <span class='code'>image=</span> tag to <a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'><span class='code'>wikimedia_commons=</span></a></span><br/>";
		} else if (tags.image.includes("//upload.wikimedia.org")) {
			var [pre, post] = splitLast(tags.image, '/');
			popup_content += "<a href='"+tags.image+"' target='_blank'><img src='"+tags.image+"' class='mainImage'></a><br/><span class='note' title='"+tags.image+"'>Use <a href='https://commons.wikimedia.org/wiki/File:"+post+"' target='_blank'><span class='code'>File:…</span></a> in <a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'><span class='code'>wikimedia_commons=</span></a> tag instead of current <span class='code'>image</span> tag</span>";
		} else if (tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpeg") || tags.image.toLowerCase().endsWith(".png") || tags.image.toLowerCase().endsWith(".gif") || tags.image.toLowerCase().endsWith(".bmp") || tags.image.toLowerCase().endsWith(".webp")) {
			popup_content += "<a href='"+tags.image+"' target='_blank'><img src='"+tags.image+"' class='mainImage'></a><br/>";
		} else {
			popup_content += "<span class='invalid' title='"+tags.image+"'>Image tag may be invalid:<br/><a href='"+tags.image+"'><span class='code'>"+tags.image+"</span></a><a href='"+osmlink+"' title=\"edit feature on OSM\" target='_blank'>Edit feature on OSM</a></span><br/>";
		}
	}
	if (tags.wikidata != null && tags.wikimedia_commons == null && tags.panoramax == null && tags.mapillary == null && tags.image == null) {
		popup_content += "<span class='invalid'>Check <a href='https://www.wikidata.org/wiki/"+tags.wikidata+"' target='_blank'>Wikidata</a> for image</span>";
	} else if (tags.wikidata == null && tags.name != null && tags.amenity != 'bicycle_rental') {
		var no_apos = tags.name.replace(new RegExp('\'', 'g'), '\&apos\;');
		popup_content += "<span><a href='https://www.wikidata.org/w/index.php?search="+no_apos+"' target='_blank'>Search name on Wikidata</a></span>";
	}

	popup_content += "<div class='linktext'>";
	if (tags.wikidata != null) {
		popup_content += "<a href='https://www.wikidata.org/wiki/"+tags.wikidata+"' target='_blank'><img src='icons/wikidata.svg'/>&nbsp;Wikidata</a><br/>";
	}
	popup_content += "<a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'><img src='icons/OSM.svg'/>&nbsp;OSM</a>&nbsp;|&nbsp;<a href='"+iDedit+"' title=\"edit feature on OSM\" target='_blank'><img src='icons/ID.svg'/>&nbsp;iD</a>&nbsp;|&nbsp;<a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'><img src='icons/JOSM.svg'/>&nbsp;JOSM</a></div>";
	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	// mrk.bindTooltip(L.tooltip({permanent:true,direction:'top'}).setContent(tooltip_content)).openTooltip;

	poi_markers.push(mrk);
	if (tags.wikimedia_commons != null && !tags.wikimedia_commons.includes("Category")) {
		mrk.addTo(poiClustersC);
	} else if (tags.panoramax != null ) {
		mrk.addTo(poiClustersP);
	} else if (tags.mapillary != null) {
		mrk.addTo(poiClustersM);
	} else if (tags.image != null) {
		mrk.addTo(poiClustersI);
	} else {
		mrk.addTo(poiClustersNoPic);
	}
	// poiClustersPic.addTo(picLayer);
	poiClustersC.addTo(picLayer);
	poiClustersP.addTo(picLayer);
	poiClustersM.addTo(picLayer);
	poiClustersI.addTo(picLayer);
	poiClustersNoPic.addTo(noPicLayer);
	if (map.hasLayer(noPicLayer)) {
		noPicLayer.addTo(map);
	} else {
		picLayer.addTo(map);
		// cLayer.addTo(map);
		// pLayer.addTo(map);
		// mLayer.addTo(map);
		// iLayer.addTo(map);
	}
}

function element_to_map(data) {
	counterPics = 0;
	counterNoPics = 0;
	poiClustersNoPic.clearLayers();
	// poiClustersPic.clearLayers();
	poiClustersC.clearLayers();
	poiClustersP.clearLayers();
	poiClustersM.clearLayers();
	poiClustersI.clearLayers();
	$.each(poi_markers, function(_, mrk) {
		map.removeLayer(mrk);
	});

	$.each(data.elements, function(_, el) {
		if (el.lat == null) {
			if (el.center == null) {
				return;
			} else {
				el.lat = el.center.lat;
				el.lon = el.center.lon;
			}
		}

		if (el.tags != null) {
			var mrk;
			if ((el.tags.wikimedia_commons == null || el.tags.wikimedia_commons.includes("Category")) && el.tags.wikidata == null && el.tags.panoramax == null && el.tags.mapillary == null && el.tags.image == null) {
				if (el.tags.tourism == 'artwork' && el.tags.start_date != null && el.tags.start_date.substring(0,4) < 1978) {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterNoPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'ruins') {
					setPoiMarker("", ruins_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterNoPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'building' || el.tags.historic == 'manor' || el.tags.historic == 'house') {
					setPoiMarker("", village_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'public_bookcase') {
					setPoiMarker("", bookcase_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'bicycle_rental') {
					setPoiMarker("", bike_rental_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.man_made == 'bridge') {
					setPoiMarker("", bridge_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism != 'artwork') {
					setPoiMarker("", landmark_icon_n, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				}
		//WIKIMEDIA COMMMONS
			} else if (el.tags.wikimedia_commons != null && !el.tags.wikimedia_commons.includes("Category")) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'ruins') {
					setPoiMarker("", ruins_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building' || el.tags.historic == 'manor' || el.tags.historic == 'house') {
					setPoiMarker("", village_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'public_bookcase') {
					setPoiMarker("", bookcase_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'bicycle_rental') {
					setPoiMarker("", bike_rental_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.man_made == 'bridge') {
					setPoiMarker("", bridge_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_c, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
		//PANORAMAX
			} else if (el.tags.panoramax != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'ruins') {
					setPoiMarker("", ruins_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building' || el.tags.historic == 'manor' || el.tags.historic == 'house') {
					setPoiMarker("", village_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'public_bookcase') {
					setPoiMarker("", bookcase_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'bicycle_rental') {
					setPoiMarker("", bike_rental_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.man_made == 'bridge') {
					setPoiMarker("", bridge_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_p, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
		// MAPILLARY
			} else if (el.tags.mapillary != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'ruins') {
					setPoiMarker("", ruins_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building' || el.tags.historic == 'manor' || el.tags.historic == 'house') {
					setPoiMarker("", village_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'public_bookcase') {
					setPoiMarker("", bookcase_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'bicycle_rental') {
					setPoiMarker("", bike_rental_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.man_made == 'bridge') {
					setPoiMarker("", bridge_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_m, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
		//IMAGE
			} else if (el.tags.image != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'ruins') {
					setPoiMarker("", ruins_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building' || el.tags.historic == 'manor' || el.tags.historic == 'house') {
					setPoiMarker("", village_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'public_bookcase') {
					setPoiMarker("", bookcase_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'bicycle_rental') {
					setPoiMarker("", bike_rental_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.man_made == 'bridge') {
					setPoiMarker("", bridge_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_i, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
		//WIKIDATA
			} else if (el.tags.wikidata != null) {
				if (el.tags.tourism == 'artwork' && el.tags.start_date != null && el.tags.start_date.substring(0,4) < 1978) {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterNoPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'ruins') {
					setPoiMarker("", ruins_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterNoPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'building' || el.tags.historic == 'manor' || el.tags.historic == 'house') {
					setPoiMarker("", village_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'public_bookcase') {
					setPoiMarker("", bookcase_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'bicycle_rental') {
					setPoiMarker("", bike_rental_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.man_made == 'bridge') {
					setPoiMarker("", bridge_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism != 'artwork') {
					setPoiMarker("", landmark_icon_w, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				}
			}
		}
	});
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');

	while (counter_1_div.hasChildNodes()) {
		counter_1_div.removeChild(counter_1_div.lastChild);
	}
	while (counter_2_div.hasChildNodes()) {
		counter_2_div.removeChild(counter_2_div.lastChild);
	}
	var new_span_pics = document.createElement('span');
	var new_span_no_pics = document.createElement('span');
	if (map.hasLayer(picLayer)) {
		if (counterPics>999 || counterNoPics>999) {
			new_span_pics.innerHTML = "<span style='font-size: 5pt;'>"+counterPics+"</span>";
			new_span_no_pics.innerHTML = "<span style='font-size: 5pt;'>"+counterNoPics+"</span>";
		} else if (counterPics>99 || counterNoPics>99) {
			new_span_pics.innerHTML = "<span style='font-size: 7pt;'>"+counterPics+"</span>";
			new_span_no_pics.innerHTML = "<span style='font-size: 7pt;'>"+counterNoPics+"</span>";
		} else {
			new_span_pics.innerHTML = counterPics;
			new_span_no_pics.innerHTML = counterNoPics;
		}
		counter_1_div.appendChild(new_span_pics);
		counter_2_div.appendChild(new_span_no_pics);
	} else {
		if (counterPics>999 || counterNoPics>999) {
			new_span_pics.innerHTML = "<span style='font-size: 5pt;'>"+counterPics+"</span>";
			new_span_no_pics.innerHTML = "<span style='font-size: 5pt;'>"+counterNoPics+"</span>";
		} else if (counterPics>99 || counterNoPics>99) {
			new_span_pics.innerHTML = "<span style='font-size: 7pt;'>"+counterPics+"</span>";
			new_span_no_pics.innerHTML = "<span style='font-size: 7pt;'>"+counterNoPics+"</span>";
		} else {
			new_span_pics.innerHTML = counterPics;
			new_span_no_pics.innerHTML = counterNoPics;
		}
		counter_1_div.appendChild(new_span_no_pics);
		counter_2_div.appendChild(new_span_pics);
	}
}

function downloadData() {
	if (map.getZoom() < 13) {
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
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr["tourism"="information"]["information"="board"];nwr["tourism"~"attraction|viewpoint|museum"];nwr["tourism"="artwork"];nwr["historic"]["historic"!~"district|cemetery|place|milestone"][!"demolished:building"];nwr["building"~"temple|church|synagogue|mosque"];nwr["amenity"~"^library$|bicycle_rental"];nwr["emergency"="defibrillator"];nwr["man_made"="bridge"]["name"];);out body center; >; out skel qt;'
		},
		success: element_to_map,
		// error: error_function,
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
// Artwork
	artwork_icon_n = L.icon({iconUrl:'icons/artwork.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_w = L.icon({iconUrl:'icons/artwork_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_c = L.icon({iconUrl:'icons/artwork_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_p = L.icon({iconUrl:'icons/artwork_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_m = L.icon({iconUrl:'icons/artwork_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	artwork_icon_i = L.icon({iconUrl:'icons/artwork_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
//Attraction
	attraction_icon_n = L.icon({iconUrl:'icons/camera.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_w = L.icon({iconUrl:'icons/camera_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_c = L.icon({iconUrl:'icons/camera_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_p = L.icon({iconUrl:'icons/camera_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_m = L.icon({iconUrl:'icons/camera_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_i = L.icon({iconUrl:'icons/camera_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	bench_icon_n = L.icon({iconUrl:'icons/memorial_bench.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_w = L.icon({iconUrl:'icons/memorial_bench_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_c = L.icon({iconUrl:'icons/memorial_bench_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_p = L.icon({iconUrl:'icons/memorial_bench_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_m = L.icon({iconUrl:'icons/memorial_bench_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_i = L.icon({iconUrl:'icons/memorial_bench_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	bike_rental_icon_n = L.icon({iconUrl:'icons/bicycle_rental.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bike_rental_icon_w = L.icon({iconUrl:'icons/bicycle_rental_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bike_rental_icon_c = L.icon({iconUrl:'icons/bicycle_rental_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bike_rental_icon_p = L.icon({iconUrl:'icons/bicycle_rental_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bike_rental_icon_m = L.icon({iconUrl:'icons/bicycle_rental_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bike_rental_icon_i = L.icon({iconUrl:'icons/bicycle_rental_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	bookcase_icon_n = L.icon({iconUrl:'icons/bookcase.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bookcase_icon_w = L.icon({iconUrl:'icons/bookcase_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bookcase_icon_c = L.icon({iconUrl:'icons/bookcase_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bookcase_icon_p = L.icon({iconUrl:'icons/bookcase_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bookcase_icon_m = L.icon({iconUrl:'icons/bookcase_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bookcase_icon_i = L.icon({iconUrl:'icons/bookcase_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	bridge_icon_n = L.icon({iconUrl:'icons/bridge.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bridge_icon_w = L.icon({iconUrl:'icons/bridge_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bridge_icon_c = L.icon({iconUrl:'icons/bridge_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bridge_icon_p = L.icon({iconUrl:'icons/bridge_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bridge_icon_m = L.icon({iconUrl:'icons/bridge_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bridge_icon_i = L.icon({iconUrl:'icons/bridge_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
//Castle
	castle_icon_n = L.icon({iconUrl:'icons/castle.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_w = L.icon({iconUrl:'icons/castle_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_c = L.icon({iconUrl:'icons/castle_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_p = L.icon({iconUrl:'icons/castle_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_m = L.icon({iconUrl:'icons/castle_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_i = L.icon({iconUrl:'icons/castle_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	cemetery_icon_n = L.icon({iconUrl:'icons/cemetery.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_w = L.icon({iconUrl:'icons/cemetery_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_c = L.icon({iconUrl:'icons/cemetery_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_p = L.icon({iconUrl:'icons/cemetery_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_m = L.icon({iconUrl:'icons/cemetery_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_i = L.icon({iconUrl:'icons/cemetery_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	church_icon_n = L.icon({iconUrl:'icons/cross.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_w = L.icon({iconUrl:'icons/cross_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_c = L.icon({iconUrl:'icons/cross_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_p = L.icon({iconUrl:'icons/cross_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_m = L.icon({iconUrl:'icons/cross_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_i = L.icon({iconUrl:'icons/cross_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	defibrillator_icon_n = L.icon({iconUrl:'icons/defibrillator.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_w = L.icon({iconUrl:'icons/defibrillator_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_c = L.icon({iconUrl:'icons/defibrillator_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_p = L.icon({iconUrl:'icons/defibrillator_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_m = L.icon({iconUrl:'icons/defibrillator_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_i = L.icon({iconUrl:'icons/defibrillator_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	// globe_icon_n = L.icon({iconUrl:'icons/globe.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	// globe_icon_w = L.icon({iconUrl:'icons/globe_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	// globe_icon_c = L.icon({iconUrl:'icons/globe_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	// globe_icon_m = L.icon({iconUrl:'icons/globe_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	// globe_icon_i = L.icon({iconUrl:'icons/globe_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	information_icon_n = L.icon({iconUrl:'icons/info_board.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_w = L.icon({iconUrl:'icons/info_board_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_c = L.icon({iconUrl:'icons/info_board_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_p = L.icon({iconUrl:'icons/info_board_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_m = L.icon({iconUrl:'icons/info_board_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_i = L.icon({iconUrl:'icons/info_board_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	landmark_icon_n = L.icon({iconUrl:'icons/landmark.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_w = L.icon({iconUrl:'icons/landmark_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_c = L.icon({iconUrl:'icons/landmark_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_p = L.icon({iconUrl:'icons/landmark_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_m = L.icon({iconUrl:'icons/landmark_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_i = L.icon({iconUrl:'icons/landmark_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	library_icon_n = L.icon({iconUrl:'icons/books.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_w = L.icon({iconUrl:'icons/books_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_c = L.icon({iconUrl:'icons/books_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_p = L.icon({iconUrl:'icons/books_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_m = L.icon({iconUrl:'icons/books_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_i = L.icon({iconUrl:'icons/books_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	memorial_icon_n = L.icon({iconUrl:'icons/memorial.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_w = L.icon({iconUrl:'icons/memorial_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_c = L.icon({iconUrl:'icons/memorial_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_p = L.icon({iconUrl:'icons/memorial_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_m = L.icon({iconUrl:'icons/memorial_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_i = L.icon({iconUrl:'icons/memorial_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	monument_icon_n = L.icon({iconUrl:'icons/monument.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_w = L.icon({iconUrl:'icons/monument_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_c = L.icon({iconUrl:'icons/monument_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_p = L.icon({iconUrl:'icons/monument_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_m = L.icon({iconUrl:'icons/monument_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_i = L.icon({iconUrl:'icons/monument_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	mosque_icon_n = L.icon({iconUrl:'icons/muslim.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_w = L.icon({iconUrl:'icons/muslim_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_c = L.icon({iconUrl:'icons/muslim_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_p = L.icon({iconUrl:'icons/muslim_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_m = L.icon({iconUrl:'icons/muslim_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_i = L.icon({iconUrl:'icons/muslim_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	museum_icon_n = L.icon({iconUrl:'icons/museum.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_w = L.icon({iconUrl:'icons/museum_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_c = L.icon({iconUrl:'icons/museum_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_p = L.icon({iconUrl:'icons/museum_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_m = L.icon({iconUrl:'icons/museum_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_i = L.icon({iconUrl:'icons/museum_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	obelisk_icon_n = L.icon({iconUrl:'icons/obelisk.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_w = L.icon({iconUrl:'icons/obelisk_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_c = L.icon({iconUrl:'icons/obelisk_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_p = L.icon({iconUrl:'icons/obelisk_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_m = L.icon({iconUrl:'icons/obelisk_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_i = L.icon({iconUrl:'icons/obelisk_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	plaque_icon_n = L.icon({iconUrl:'icons/plaque.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_w = L.icon({iconUrl:'icons/plaque_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_c = L.icon({iconUrl:'icons/plaque_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_p = L.icon({iconUrl:'icons/plaque_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_m = L.icon({iconUrl:'icons/plaque_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_i = L.icon({iconUrl:'icons/plaque_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	ruins_icon_n = L.icon({iconUrl:'icons/ruins.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	ruins_icon_w = L.icon({iconUrl:'icons/ruins_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	ruins_icon_c = L.icon({iconUrl:'icons/ruins_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	ruins_icon_p = L.icon({iconUrl:'icons/ruins_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	ruins_icon_m = L.icon({iconUrl:'icons/ruins_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	ruins_icon_i = L.icon({iconUrl:'icons/ruins_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	school_icon_n = L.icon({iconUrl:'icons/apple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_w = L.icon({iconUrl:'icons/apple_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_c = L.icon({iconUrl:'icons/apple_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_p = L.icon({iconUrl:'icons/apple_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_m = L.icon({iconUrl:'icons/apple_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_i = L.icon({iconUrl:'icons/apple_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	shrine_icon_n = L.icon({iconUrl:'icons/shrine.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_w = L.icon({iconUrl:'icons/shrine_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_c = L.icon({iconUrl:'icons/shrine_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_p = L.icon({iconUrl:'icons/shrine_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_m = L.icon({iconUrl:'icons/shrine_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_i = L.icon({iconUrl:'icons/shrine_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	statue_icon_n = L.icon({iconUrl:'icons/statue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_w = L.icon({iconUrl:'icons/statue_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_c = L.icon({iconUrl:'icons/statue_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_p = L.icon({iconUrl:'icons/statue_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_m = L.icon({iconUrl:'icons/statue_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_i = L.icon({iconUrl:'icons/statue_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	synagogue_icon_n = L.icon({iconUrl:'icons/jewish.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_w = L.icon({iconUrl:'icons/jewish_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_c = L.icon({iconUrl:'icons/jewish_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_p = L.icon({iconUrl:'icons/jewish_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_m = L.icon({iconUrl:'icons/jewish_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_i = L.icon({iconUrl:'icons/jewish_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	temple_icon_n = L.icon({iconUrl:'icons/buddhist.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_w = L.icon({iconUrl:'icons/buddhist_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_c = L.icon({iconUrl:'icons/buddhist_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_p = L.icon({iconUrl:'icons/buddhist_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_m = L.icon({iconUrl:'icons/buddhist_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_i = L.icon({iconUrl:'icons/buddhist_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	viewpoint_icon_n = L.icon({iconUrl:'icons/viewpoint.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_w = L.icon({iconUrl:'icons/viewpoint_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_c = L.icon({iconUrl:'icons/viewpoint_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_p = L.icon({iconUrl:'icons/viewpoint_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_m = L.icon({iconUrl:'icons/viewpoint_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_i = L.icon({iconUrl:'icons/viewpoint_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	village_icon_n = L.icon({iconUrl:'icons/village.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_w = L.icon({iconUrl:'icons/village_rust.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_c = L.icon({iconUrl:'icons/village_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_p = L.icon({iconUrl:'icons/village_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_m = L.icon({iconUrl:'icons/village_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_i = L.icon({iconUrl:'icons/village_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

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
		if (map.getZoom() >= 13) {
			map.removeLayer(overlay);
			zoomText.setContent('');
		}
		if (map.getZoom() < 13) {
			map.addLayer(overlay);
			zoomText.setContent('Please Zoom In');
		}
	});

	document.querySelector(".leaflet-popup-pane").addEventListener("load", function (event) {
		var tagName = $(event.target).attr("class"),
		popup = map._popup;
		if (tagName === "mainImage" && popup && !popup._updated) {
			popup._updated = true;
			popup.update();
		}
	}, true);
});

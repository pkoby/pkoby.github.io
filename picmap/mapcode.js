'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
// var poiDots = new L.LayerGroup();
// var poiMinis = new L.LayerGroup();
var picLayer = new L.LayerGroup();
var noPicLayer = new L.LayerGroup();
var poiClustersNoPic = new L.markerClusterGroup({
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

var counterPics = 0;
var counterNoPics = 0;
var counter_div = document.getElementById("counter_display");

var artwork_icon,attraction_icon,building_icon,castle_icon,cemetery_icon,globe_icon,information_icon,landmark_icon,library_icon,memorial_icon,monument_icon,museum_icon,temple_icon,church_icon,synagogue_icon,mosque_icon,school_icon,shrine_icon,viewpoint_icon,village_icon,
	artwork_icon_pic,attraction_icon_pic,building_icon_pic,castle_icon_pic,cemetery_icon_pic,globe_icon_pic,information_icon_pic,landmark_icon_pic,library_icon_pic,memorial_icon_pic,monument_icon_pic,museum_icon_pic,temple_icon_pic,church_icon_pic,synagogue_icon_pic,mosque_icon_pic,school_icon_pic,shrine_icon_pic,viewpoint_icon_pic,village_icon_pic;

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
	while (counter_div.hasChildNodes()) {
		counter_div.removeChild(counter_div.lastChild);
	}
	var new_span = document.createElement('span');
	if (map.hasLayer(picLayer)) {
		map.removeLayer(picLayer);
		map.addLayer(noPicLayer);
	} else {
		map.removeLayer(noPicLayer);
		map.addLayer(picLayer);
	}
	if (map.hasLayer(picLayer)) {
		new_span.innerHTML = counterPics;
		counter_div.appendChild(new_span);
	} else {
		new_span.innerHTML = counterNoPics;
		counter_div.appendChild(new_span);
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

if (L.Browser.retina) var tp = "lr";
else var tp = "ls";

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
	var wiki_file_no_apos = wiki_file_no_spaces.replace(new RegExp('\'', 'g'), '\%27');
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
	var wiki_file_no_apos = wiki_file_no_spaces.replace(new RegExp('\'', 'g'), '\%27');
	var hash = calcMD5(unescape(encodeURIComponent(wiki_file_no_spaces)));
	var wiki_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/"+hash.substring(0,1)+"/"+hash.substring(0,2)+"/"+wiki_file_no_apos+"/250px-"+wiki_file_no_apos;
	return wiki_link;
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

	if (tags.name != null) {
		if (tags.tourism == 'artwork' || tags.information == 'board') {
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
					popup_content += "<span class=\"type\">"+tags.artwork_type+"</span><br/><span>Date: "+tags.start_date+"</span><br/>";
				} else {
					popup_content += "<span class=\"type\">Artwork</span><br/><span>Date: "+tags.start_date+"</span><br/>";
				}
			} else if (tags.start_date.substring(0,4) >= 1978) {
				if (tags.artwork_type != null) {
					popup_content += "<span class=\"type\">"+tags.artwork_type+"</span><br/><span>Date: "+tags.start_date+", </span><span class='invalid'>Check <a href='https://commons.wikimedia.org/wiki/Commons:Public_art_and_copyrights_in_the_US' title='Public art and copyrights in the US'>copyright</a>!</span><br/>";
				} else {
					popup_content += "<span class=\"type\">Artwork</span><br/><span>Date: "+tags.start_date+", </span><span class='invalid'>Check <a href='https://commons.wikimedia.org/wiki/Commons:Public_art_and_copyrights_in_the_US' title='Public art and copyrights in the US'>copyright</a>!</span><br/>";
				}
			}
		} else {
			if (tags.artwork_type != null) {
				popup_content += "<span class=\"type\">"+tags.artwork_type+"</span><br/>";
			} else {
				popup_content += "<span class=\"type\">Artwork</span><br/>";
			}
			popup_content += "<span class='invalid'>Check installation date & <a href='https://commons.wikimedia.org/wiki/Commons:Public_art_and_copyrights_in_the_US' title='Public art and copyrights in the US'>copyright</a>!</span><br/>";
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

	if (tags.wikimedia_commons != undefined) {
		var link = getWikiImg(tags.wikimedia_commons);
		var thumb = getWikiThumb(tags.wikimedia_commons);
		if (tags.wikimedia_commons.startsWith("File")) {
			popup_content += "<div class='image'><a href='https://commons.wikimedia.org/wiki/"+tags.wikimedia_commons+"' target='_blank'><img src='"+thumb+"' class='mainImage'><img class='badge' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'></a></div>";
		} else if (tags.wikimedia_commons.includes("//commons.wikimedia.org/wiki/File")) {
			popup_content += "<div class='image'><span class='invalid' title='"+tags.wikimedia_commons+"'>(Invalid image tag)</span><br><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='mainImage'><img class='badge' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'></a></div>";
		} else if (tags.wikimedia_commons.includes("Category")) {
			popup_content += "<span class='category' title='"+tags.wikimedia_commons+"'><img class='logo' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'> <a href='https://commons.wikimedia.org/wiki/"+tags.wikimedia_commons+"' target='_blank'>Wikimeda Image Category</a></span>";
		} else {
			popup_content += "<span class='invalid' title='"+tags.wikimedia_commons+"'>Invalid image tag: <a href='https://commons.wikimedia.org/wiki/"+tags.wikimedia_commons+"' target='_blank'>"+tags.wikimedia_commons+"</span>";
		}
		if (tags.panoramax != undefined) {
			if (tags.panoramax.includes(";")) {
				var array = tags.panoramax.split(';');
				var j = tags.panoramax.split(';').length;
				var link = getPxLink(array[0]);
				popup_content += "</br><a href='"+link+"' class='panoramax' target='_blank'><img class='logo' src='icons/PanoramaxLogo.jpg' title='Panoramax'> Panoramax</a>";
			} else {
				var link = getPxLink(tags.panoramax);
				popup_content += "</br><a href='"+link+"' class='panoramax' target='_blank'><img class='logo' src='icons/PanoramaxLogo.jpg' title='Panoramax'> Panoramax</a>";
			}
			if (tags.mapillary != undefined) {
				popup_content += " | <a href='"+getMLLink(tags.mapillary)+"' class='mapillary' target='_blank'><img class='logo' src='icons/MapillaryLogo.svg' title='Mapillary'> Mapillary</a><br/>";
			}
		} else if (tags.mapillary != undefined) {
			popup_content += "</br><a href='"+getMLLink(tags.mapillary)+"' class='mapillary' target='_blank'><img class='logo' src='icons/MapillaryLogo.svg' title='Mapillary'> Mapillary</a><br/>";
		}
	} else if (tags.panoramax != undefined) {
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
	} else if (tags.mapillary != undefined) {
		popup_content += "<a href='"+getMLLink(tags.mapillary)+"' class='mapillary' target='_blank'><img class='logo' src='icons/MapillaryLogo.svg' title='Mapillary'> Mapillary Image Link</a>";
	} else if (tags.image != undefined) {
		if (tags.image.includes("//static.panoramio.com")) {
			popup_content += "<span class='invalid' title='"+tags.image+"'>Image tag may be invalid</span>";
		} else if (tags.image.includes("//commons.wikimedia.org") || tags.image.startsWith("File:") || tags.image.includes("wikipedia.org")) {
			var link = getWikiImg(tags.image);
			var thumb = getWikiThumb(tags.image);
			popup_content += "<a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a><br/><span class='note' title='"+tags.image+"'>Move <span class='code'>image=</span> tag to <a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'><span class='code'>wikimedia_commons=</span></a></span>";
		} else if (tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpeg") || tags.image.toLowerCase().endsWith(".png") || tags.image.toLowerCase().endsWith(".gif") || tags.image.toLowerCase().endsWith(".bmp")) {
			popup_content += "<a href='"+tags.image+"' target='_blank'><img src='"+tags.image+"' class='popup_image'></a>";
		} else {
			popup_content += "<span class='invalid' title='"+tags.image+"'>Image tag may be invalid:<br/><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>"+tags.image+"</a></span>";
		}
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️ OSM</a> | <a href='"+iDedit+"' title=\"edit feature on OSM\" target='_blank'>✏️ iD</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️ JOSM</a></div>";

	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	// mrk.bindTooltip(L.tooltip({permanent:true,direction:'top'}).setContent(tooltip_content)).openTooltip;

	poi_markers.push(mrk);
	if (tags.wikimedia_commons != null || tags.panoramax != null || tags.mapillary != null || tags.image != null) {
		mrk.addTo(poiClustersPic);
	} else {
		mrk.addTo(poiClustersNoPic);
	}
	poiClustersPic.addTo(picLayer);
	// picLayer.addTo(map);
	poiClustersNoPic.addTo(noPicLayer);
	if (map.hasLayer(picLayer)) {
		picLayer.addTo(map);
	} else {
		noPicLayer.addTo(map);
	}
}

function element_to_map(data) {
	counterPics = 0;
	counterNoPics = 0;
	poiClustersNoPic.clearLayers();
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
			if (el.tags.wikimedia_commons == null && el.tags.panoramax == null && el.tags.mapillary == null && el.tags.image == null) {
				if (el.tags.tourism == 'artwork' && el.tags.start_date != null && el.tags.start_date.substring(0,4) < 1978) {
					setPoiMarker("", artwork_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'memorial') {
					setPoiMarker("", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else {
					setPoiMarker("", landmark_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				}
			} else if (el.tags.wikimedia_commons != null || el.tags.panoramax != null || el.tags.mapillary != null || el.tags.image != null) {
				if (el.tags.tourism == 'artwork') {
					setPoiMarker("", artwork_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					setPoiMarker("", memorial_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_pic, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
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
	if (map.hasLayer(picLayer)) {
		new_span.innerHTML = counterPics;
		counter_div.appendChild(new_span);
	} else {
		new_span.innerHTML = counterNoPics;
		counter_div.appendChild(new_span);
	}
}

function downloadData() {
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
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr["tourism"="information"]["information"="board"];nwr["tourism"~"attraction|viewpoint|museum"];nwr["tourism"="artwork"];nwr["historic"]["historic"!~"district|cemetery|place"][!"demolished:building"];nwr["building"~"temple|church|synagogue|mosque"];nwr["amenity"="library"];);out body center; >; out skel qt;'
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
	artwork_icon = L.icon({
		iconUrl: 'icons/artwork.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	artwork_icon_pic = L.icon({
		iconUrl: 'icons/artwork_purple.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	attraction_icon = L.icon({
		iconUrl: 'icons/camera.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	attraction_icon_pic = L.icon({
		iconUrl: 'icons/camera_purple.svg',
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
		iconUrl: 'icons/books.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	library_icon_pic = L.icon({
		iconUrl: 'icons/books_purple.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	memorial_icon = L.icon({
		iconUrl: 'icons/memorial.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	memorial_icon_pic = L.icon({
		iconUrl: 'icons/memorial-blue.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	monument_icon = L.icon({
		iconUrl: 'icons/monument.svg',
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
	shrine_icon = L.icon({
		iconUrl: 'icons/wayside-shrine.svg',
		iconSize: [18,18],
		className: 'pointIcon',
		iconAnchor: [9,9],
		popupAnchor: [0,-16],
	});
	shrine_icon_pic = L.icon({
		iconUrl: 'icons/wayside-shrine-blue.svg',
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
		var tagName = $(event.target).attr("class"),
		popup = map._popup; // Last open Popup.
		if (tagName === "mainImage" && popup && !popup._updated) {
			popup._updated = true; // Assumes only 1 image per Popup.
			popup.update();
		}
		console.log(tagName);
	}, true);
});

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

var artwork_icon,attraction_icon,bench_icon,castle_icon,cemetery_icon,defibrillator_icon,globe_icon,information_icon,landmark_icon,library_icon,memorial_icon,monument_icon,museum_icon,obelisk_icon,plaque_icon,temple_icon,church_icon,synagogue_icon,mosque_icon,school_icon,shrine_icon,statue_icon,viewpoint_icon,village_icon,
	artwork_icon_wc,attraction_icon_wc,bench_icon_wc,castle_icon_wc,cemetery_icon_wc,defibrillator_icon_wc,globe_icon_wc,information_icon_wc,landmark_icon_wc,library_icon_wc,memorial_icon_wc,monument_icon_wc,museum_icon_wc,obelisk_icon_wc,plaque_icon_wc,temple_icon_wc,church_icon_wc,synagogue_icon_wc,mosque_icon_wc,school_icon_wc,shrine_icon_wc,statue_icon_wc,viewpoint_icon_wc,village_icon_wc,
	artwork_icon_pr,attraction_icon_pr,bench_icon_pr,castle_icon_pr,cemetery_icon_pr,defibrillator_icon_pr,globe_icon_pr,information_icon_pr,landmark_icon_pr,library_icon_pr,memorial_icon_pr,monument_icon_pr,museum_icon_pr,obelisk_icon_pr,plaque_icon_pr,temple_icon_pr,church_icon_pr,synagogue_icon_pr,mosque_icon_pr,school_icon_pr,shrine_icon_pr,statue_icon_pr,viewpoint_icon_pr,village_icon_pr,
	artwork_icon_ml,attraction_icon_ml,bench_icon_ml,castle_icon_ml,cemetery_icon_ml,defibrillator_icon_ml,globe_icon_ml,information_icon_ml,landmark_icon_ml,library_icon_ml,memorial_icon_ml,monument_icon_ml,museum_icon_ml,obelisk_icon_ml,plaque_icon_ml,temple_icon_ml,church_icon_ml,synagogue_icon_ml,mosque_icon_ml,school_icon_ml,shrine_icon_ml,statue_icon_ml,viewpoint_icon_ml,village_icon_ml,
	artwork_icon_im,attraction_icon_im,bench_icon_im,castle_icon_im,cemetery_icon_im,defibrillator_icon_im,globe_icon_im,information_icon_im,landmark_icon_im,library_icon_im,memorial_icon_im,monument_icon_im,museum_icon_im,obelisk_icon_im,plaque_icon_im,temple_icon_im,church_icon_im,synagogue_icon_im,mosque_icon_im,school_icon_im,shrine_icon_im,statue_icon_im,viewpoint_icon_im,village_icon_im;

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
	if (map.hasLayer(noPicLayer)) {
		map.removeLayer(noPicLayer);
		map.addLayer(picLayer);
	} else {
		map.removeLayer(picLayer);
		map.addLayer(noPicLayer);
	}
	if (map.hasLayer(noPicLayer)) {
		new_span.innerHTML = counterNoPics;
		counter_div.appendChild(new_span);
	} else {
		new_span.innerHTML = counterPics;
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
				popup_content += "<span class=\"type\">"+tags.artwork_type+"</span><br/>";
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
			popup_content += "<span class=\"type\">Memorial ("+tags.memorial+")</span><br/>";
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
			var array = tags.wikimedia_commons.split(':');
			var category = array[1];
			popup_content += "<span class='category' title='"+tags.wikimedia_commons+"'><a href='https://commons.wikimedia.org/wiki/"+tags.wikimedia_commons+"' target='_blank'>Wikimedia Category:<br/>"+category+"</a></span>";//<img class='categoryLogo' src='icons/WikimediaCommonsLogo.svg' title='Wikimedia Commons'> 
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
			popup_content += "<a href='"+link+"' target='_blank'><img src='"+thumb+"' class='mainImage'></a><br/><span class='note' title='"+tags.image+"'>Move <span class='code'>image=</span> tag to <a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'><span class='code'>wikimedia_commons=</span></a></span>";
		} else if (tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpeg") || tags.image.toLowerCase().endsWith(".png") || tags.image.toLowerCase().endsWith(".gif") || tags.image.toLowerCase().endsWith(".bmp")) {
			popup_content += "<a href='"+tags.image+"' target='_blank'><img src='"+tags.image+"' class='mainImage'></a>";
		} else {
			popup_content += "<span class='invalid' title='"+tags.image+"'>Image tag value may be invalid:<br/><span class='code'>"+tags.image+"</span><a href='"+osmlink+"' title=\"edit feature on OSM\" target='_blank'>Edit feature on OSM</a></span>";
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
	if (map.hasLayer(noPicLayer)) {
		noPicLayer.addTo(map);
	} else {
		picLayer.addTo(map);
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
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon, el.lat, el.lon, el.tags, el.id, el.type);
					}
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
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
					}
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
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				} else if (el.tags.tourism != "artwork") {
					setPoiMarker("", landmark_icon, el.lat, el.lon, el.tags, el.id, el.type);
					counterNoPics++;
				}
			} else if (el.tags.wikimedia_commons != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_wc, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
			} else if (el.tags.panoramax != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_pr, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
			} else if (el.tags.mapillary != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_ml, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				}
			} else if (el.tags.image != null) {
				if (el.tags.tourism == 'artwork') {
					if (el.tags.artwork_type == 'statue') {
						setPoiMarker("", statue_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", artwork_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.tourism == 'attraction') {
					setPoiMarker("", attraction_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'castle' || el.tags.building == 'castle' || el.tags.ruins == 'castle') {
					setPoiMarker("", castle_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'tomb') {
					setPoiMarker("", cemetery_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'map') {
					setPoiMarker("", globe_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'information' && el.tags.information == 'board') {
					setPoiMarker("", information_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'memorial') {
					if (el.tags.memorial == 'statue') {
						setPoiMarker("", statue_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'obelisk') {
						setPoiMarker("", obelisk_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'plaque') {
						setPoiMarker("", plaque_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == 'bench') {
						setPoiMarker("", bench_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("", memorial_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					}
					counterPics++;
				} else if (el.tags.historic == 'monument') {
					setPoiMarker("", monument_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'museum' || el.tags.building == 'museum') {
					setPoiMarker("", museum_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'temple') {
					setPoiMarker("", temple_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'church') {
					setPoiMarker("", church_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'synagogue') {
					setPoiMarker("", synagogue_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'mosque') {
					setPoiMarker("", mosque_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.building == 'school') {
					setPoiMarker("", school_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'building') {
					setPoiMarker("", village_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.historic == 'wayside_shrine') {
					setPoiMarker("", shrine_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.tourism == 'viewpoint') {
					setPoiMarker("", viewpoint_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.amenity == 'library') {
					setPoiMarker("", library_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else if (el.tags.emergency == 'defibrillator') {
					setPoiMarker("", defibrillator_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
					counterPics++;
				} else {
					setPoiMarker("", landmark_icon_im, el.lat, el.lon, el.tags, el.id, el.type);
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
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr["tourism"="information"]["information"="board"];nwr["tourism"~"attraction|viewpoint|museum"];nwr["tourism"="artwork"];nwr["historic"]["historic"!~"district|cemetery|place"][!"demolished:building"];nwr["building"~"temple|church|synagogue|mosque"];nwr["amenity"="library"];nwr["emergency"="defibrillator"];);out body center; >; out skel qt;'
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
	artwork_icon = L.icon({iconUrl:'icons/artwork.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_wc = L.icon({iconUrl:'icons/artwork_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_pr = L.icon({iconUrl:'icons/artwork_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor: [0,-16]});
	artwork_icon_ml = L.icon({iconUrl:'icons/artwork_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	artwork_icon_im = L.icon({iconUrl:'icons/artwork_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
//Attraction
	attraction_icon = L.icon({iconUrl:'icons/camera.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_wc = L.icon({iconUrl:'icons/camera_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_pr = L.icon({iconUrl:'icons/camera_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_ml = L.icon({iconUrl:'icons/camera_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	attraction_icon_im = L.icon({iconUrl:'icons/camera_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	bench_icon = L.icon({iconUrl:'icons/memorial_bench.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_wc = L.icon({iconUrl:'icons/memorial_bench_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_pr = L.icon({iconUrl:'icons/memorial_bench_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_ml = L.icon({iconUrl:'icons/memorial_bench_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	bench_icon_im = L.icon({iconUrl:'icons/memorial_bench_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
//Castle
	castle_icon = L.icon({iconUrl:'icons/castle.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_wc = L.icon({iconUrl:'icons/castle_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_pr = L.icon({iconUrl:'icons/castle_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_ml = L.icon({iconUrl:'icons/castle_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	castle_icon_im = L.icon({iconUrl:'icons/castle_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	cemetery_icon = L.icon({iconUrl:'icons/cemetery.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_wc = L.icon({iconUrl:'icons/cemetery_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_pr = L.icon({iconUrl:'icons/cemetery_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_ml = L.icon({iconUrl:'icons/cemetery_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	cemetery_icon_im = L.icon({iconUrl:'icons/cemetery_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	defibrillator_icon = L.icon({iconUrl:'icons/defibrillator.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_wc = L.icon({iconUrl:'icons/defibrillator_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_pr = L.icon({iconUrl:'icons/defibrillator_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_ml = L.icon({iconUrl:'icons/defibrillator_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	defibrillator_icon_im = L.icon({iconUrl:'icons/defibrillator_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	globe_icon = L.icon({iconUrl:'icons/globe.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	globe_icon_wc = L.icon({iconUrl:'icons/globe_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	globe_icon_pr = L.icon({iconUrl:'icons/globe_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	globe_icon_ml = L.icon({iconUrl:'icons/globe_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	globe_icon_im = L.icon({iconUrl:'icons/globe_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	information_icon = L.icon({iconUrl:'icons/information.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_wc = L.icon({iconUrl:'icons/information_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_pr = L.icon({iconUrl:'icons/information_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_ml = L.icon({iconUrl:'icons/information_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	information_icon_im = L.icon({iconUrl:'icons/information_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	landmark_icon = L.icon({iconUrl:'icons/landmark.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_wc = L.icon({iconUrl:'icons/landmark_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_pr = L.icon({iconUrl:'icons/landmark_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_ml = L.icon({iconUrl:'icons/landmark_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	landmark_icon_im = L.icon({iconUrl:'icons/landmark_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	library_icon = L.icon({iconUrl:'icons/books.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_wc = L.icon({iconUrl:'icons/books_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_pr = L.icon({iconUrl:'icons/books_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_ml = L.icon({iconUrl:'icons/books_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	library_icon_im = L.icon({iconUrl:'icons/books_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	memorial_icon = L.icon({iconUrl:'icons/memorial.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_wc = L.icon({iconUrl:'icons/memorial_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_pr = L.icon({iconUrl:'icons/memorial_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_ml = L.icon({iconUrl:'icons/memorial_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	memorial_icon_im = L.icon({iconUrl:'icons/memorial_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	monument_icon = L.icon({iconUrl:'icons/monument.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_wc = L.icon({iconUrl:'icons/monument_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_pr = L.icon({iconUrl:'icons/monument_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_ml = L.icon({iconUrl:'icons/monument_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	monument_icon_im = L.icon({iconUrl:'icons/monument_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	museum_icon = L.icon({iconUrl:'icons/museum.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_wc = L.icon({iconUrl:'icons/museum_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_pr = L.icon({iconUrl:'icons/museum_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_ml = L.icon({iconUrl:'icons/museum_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	museum_icon_im = L.icon({iconUrl:'icons/museum_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	obelisk_icon = L.icon({iconUrl:'icons/obelisk.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_wc = L.icon({iconUrl:'icons/obelisk_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_pr = L.icon({iconUrl:'icons/obelisk_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_ml = L.icon({iconUrl:'icons/obelisk_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	obelisk_icon_im = L.icon({iconUrl:'icons/obelisk_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	plaque_icon = L.icon({iconUrl:'icons/plaque.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_wc = L.icon({iconUrl:'icons/plaque_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_pr = L.icon({iconUrl:'icons/plaque_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_ml = L.icon({iconUrl:'icons/plaque_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	plaque_icon_im = L.icon({iconUrl:'icons/plaque_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	temple_icon = L.icon({iconUrl:'icons/buddhist.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_wc = L.icon({iconUrl:'icons/buddhist_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_pr = L.icon({iconUrl:'icons/buddhist_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_ml = L.icon({iconUrl:'icons/buddhist_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	temple_icon_im = L.icon({iconUrl:'icons/buddhist_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	church_icon = L.icon({iconUrl:'icons/cross.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_wc = L.icon({iconUrl:'icons/cross_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_pr = L.icon({iconUrl:'icons/cross_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_ml = L.icon({iconUrl:'icons/cross_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	church_icon_im = L.icon({iconUrl:'icons/cross_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	synagogue_icon = L.icon({iconUrl:'icons/jewish.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_wc = L.icon({iconUrl:'icons/jewish_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_pr = L.icon({iconUrl:'icons/jewish_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_ml = L.icon({iconUrl:'icons/jewish_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	synagogue_icon_im = L.icon({iconUrl:'icons/jewish_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	mosque_icon = L.icon({iconUrl:'icons/muslim.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_wc = L.icon({iconUrl:'icons/muslim_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_pr = L.icon({iconUrl:'icons/muslim_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_ml = L.icon({iconUrl:'icons/muslim_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	mosque_icon_im = L.icon({iconUrl:'icons/muslim_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	school_icon = L.icon({iconUrl:'icons/school.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_wc = L.icon({iconUrl:'icons/school_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_pr = L.icon({iconUrl:'icons/school_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_ml = L.icon({iconUrl:'icons/school_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	school_icon_im = L.icon({iconUrl:'icons/school_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	shrine_icon = L.icon({iconUrl:'icons/shrine.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_wc = L.icon({iconUrl:'icons/shrine_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_pr = L.icon({iconUrl:'icons/shrine_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_ml = L.icon({iconUrl:'icons/shrine_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	shrine_icon_im = L.icon({iconUrl:'icons/shrine_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	statue_icon = L.icon({iconUrl:'icons/statue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_wc = L.icon({iconUrl:'icons/statue_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_pr = L.icon({iconUrl:'icons/statue_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_ml = L.icon({iconUrl:'icons/statue_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	statue_icon_im = L.icon({iconUrl:'icons/statue_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	viewpoint_icon = L.icon({iconUrl:'icons/viewpoint.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_wc = L.icon({iconUrl:'icons/viewpoint_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_pr = L.icon({iconUrl:'icons/viewpoint_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_ml = L.icon({iconUrl:'icons/viewpoint_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	viewpoint_icon_im = L.icon({iconUrl:'icons/viewpoint_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

	village_icon = L.icon({iconUrl:'icons/village.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_wc = L.icon({iconUrl:'icons/village_red.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_pr = L.icon({iconUrl:'icons/village_blue.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_ml = L.icon({iconUrl:'icons/village_green.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});
	village_icon_im = L.icon({iconUrl:'icons/village_purple.svg',iconSize:[18,18],className:'pointIcon',iconAnchor:[9,9],popupAnchor:[0,-16]});

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
		popup = map._popup; // Last open Popup.
		if (tagName === "mainImage" && popup && !popup._updated) {
			popup._updated = true; // Assumes only 1 image per Popup.
			popup.update();
		}
		console.log(tagName);
	}, true);
});

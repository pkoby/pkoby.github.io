'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
var poiDots = new L.LayerGroup();
var poiMinis = new L.LayerGroup();
var poiMain = new L.LayerGroup();
var poiClusters = new L.markerClusterGroup({
	disableClusteringAtZoom: 18,
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

var bench_dot,
	picnic_table_dot,
	yab_icon,yb_na_icon,ya_nb_icon,nab_icon,yb_ua_icon,nb_ua_icon,ya_ub_icon,na_ub_icon,uab_icon,
	yab_icon_red,yb_na_icon_red,ya_nb_icon_red,nab_icon_red,yb_ua_icon_red,nb_ua_icon_red,ya_ub_icon_red,na_ub_icon_red,uab_icon_red,
	yab_icon_orange,yb_na_icon_orange,ya_nb_icon_orange,nab_icon_orange,yb_ua_icon_orange,nb_ua_icon_orange,ya_ub_icon_orange,na_ub_icon_orange,uab_icon_orange,
	yab_icon_yellow,yb_na_icon_yellow,ya_nb_icon_yellow,nab_icon_yellow,yb_ua_icon_yellow,nb_ua_icon_yellow,ya_ub_icon_yellow,na_ub_icon_yellow,uab_icon_yellow,
	yab_icon_green,yb_na_icon_green,ya_nb_icon_green,nab_icon_green,yb_ua_icon_green,nb_ua_icon_green,ya_ub_icon_green,na_ub_icon_green,uab_icon_green,
	yab_icon_blue,yb_na_icon_blue,ya_nb_icon_blue,nab_icon_blue,yb_ua_icon_blue,nb_ua_icon_blue,ya_ub_icon_blue,na_ub_icon_blue,uab_icon_blue,
	yab_icon_purple,yb_na_icon_purple,ya_nb_icon_purple,nab_icon_purple,yb_ua_icon_purple,nb_ua_icon_purple,ya_ub_icon_purple,na_ub_icon_purple,uab_icon_purple,
	yab_icon_brown,yb_na_icon_brown,ya_nb_icon_brown,nab_icon_brown,yb_ua_icon_brown,nb_ua_icon_brown,ya_ub_icon_brown,na_ub_icon_brown,uab_icon_brown,
	yab_icon_black,yb_na_icon_black,ya_nb_icon_black,nab_icon_black,yb_ua_icon_black,nb_ua_icon_black,ya_ub_icon_black,na_ub_icon_black,uab_icon_black,
	yab_icon_gray,yb_na_icon_gray,ya_nb_icon_gray,nab_icon_gray,yb_ua_icon_gray,nb_ua_icon_gray,ya_ub_icon_gray,na_ub_icon_gray,uab_icon_gray,
	yab_icon_white,yb_na_icon_white,ya_nb_icon_white,nab_icon_white,yb_ua_icon_white,nb_ua_icon_white,ya_ub_icon_white,na_ub_icon_white,uab_icon_white,
	picnic_table_icon,picnic_table_icon_red,picnic_table_icon_orange,picnic_table_icon_yellow,picnic_table_icon_green,picnic_table_icon_blue,picnic_table_icon_purple,picnic_table_icon_brown,picnic_table_icon_black,picnic_table_icon_gray,picnic_table_icon_white,
	inscription_icon,no_inscription_icon,unk_inscription_icon;

	// var OSMCarto=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:0.3,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
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

// map.createPane('onePane').style.zIndex = -1;
// map.createPane('miniPane').style.zIndex = 99999;
// map.createPane('twoPane').style.zIndex = 20000;

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

function setDotMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon],{
		icon: icon,
	});
	
	if (tags.amenity == 'bench') {
		var popup_content = "<span class=\"title\">Bench</span><br/>";
	} else if (tags.leisure == 'picnic_table') {
		var popup_content = "<span class=\"title\">Picnic Table</span><br/>";
	}
	
	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));

	poi_markers.push(mrk);
	mrk.addTo(poiDots);
	poiDots.addTo(poiClusters);
	if (map.getZoom() <= 17) {
		poiClusters.addTo(map);
	}
}

function setMiniMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon, interactive:false,
		rotationAngle: tags.direction-180,
	});

	poi_markers.push(mrk);
	mrk.addTo(poiMinis);
	if (map.getZoom() > 18) {
		poiMinis.addTo(poiMain);
	}
}

// function setColourMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
// 	var colour;
// 	if (tags.colour != undefined) {
// 		colour = tags.colour;
// 	} else {
// 		colour = "#000000";
// 	}

// 	var mrk = L.marker([lat, lon], {
// 		icon: L.divIcon ({
// 			className:'colourIcon',
// 			html:`<svg width="24" height="24" viewBox="0 0 6.3499999 6.3499999">
//   				<g transform="translate(-17.507495,-99.150042)">
//     				<path style="opacity:1;vector-effect:none;fill:`+colour+`;fill-opacity:0.8;stroke:`+colour+`;stroke-width:0.05767668;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers stroke fill"
//        d="m 23.828657,102.32504 a 3.1461616,3.1461613 0 0 1 -3.141755,3.14616 3.1461616,3.1461613 0 0 1 -3.150556,-3.13734 3.1461616,3.1461613 0 0 1 3.132929,-3.154951 3.1461616,3.1461613 0 0 1 3.159332,3.128511 l -3.146112,0.0176 z"/>
//   				</g>
// 			</svg>`
// 		})
// 	});
	
// 	poi_markers.push(mrk);
// 	mrk.addTo(poiMinis);
// 	// if (map.getZoom() > 17) {
// 		poiMinis.addTo(poiClusters);
// 	// }
// }

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
	var slashN = inscription.replace(/\\n/g, "<br/>");
	var slashNspaces = slashN.replace(/ \\n /g, "<br/>");
	var doubleSlash = slashNspaces.replace(/ \/\/ /g, "<br/><br/>");
	var semiColon = doubleSlash.replace(/ \; /g, "</div><br/><div class='inscription'>");
	return semiColon.replace(/ \/ /g,"<br/>");
}

function directionParser(direction) {
	if (direction >= 337.5 || direction < 22.5) {
			return "North";
	} else if (direction >= 22.5 && direction < 67.5) {
			return "Northeast";
	} else if (direction >= 67.5 && direction < 112.5) {
			return "East";
	} else if (direction >= 112.5 && direction < 157.5) {
			return "Southeast";
	} else if (direction >= 157.5 && direction < 202.5) {
			return "South";
	} else if (direction >= 202.5 && direction < 247.5) {
			return "Southwest";
	} else if (direction >= 247.5 && direction < 292.5) {
			return "West";
	} else if (direction >= 292.5 && direction < 337.5) {
			return "Northwest";
	}
}

function setPoiMarker(poi_type, icon_name, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {
		icon: icon_name,
		rotationAngle: tags.direction-180,
	});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var iDedit = "https://www.openstreetmap.org/edit\?editor=id&"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	if (tags.amenity == 'bench') {
		var popup_content = "<span class=\"title\">Bench</span><br/>";
	} else if (tags.leisure == 'picnic_table') {
		var popup_content = "<span class=\"title\">Picnic Table</span><br/>";
	}
	if (tags.inscription != undefined && tags.inscription != 'no') {
		popup_content += "<div class='inscription'>"+inscriptionParser(tags.inscription);
		if (tags["inscription:1"] != undefined) {
			popup_content += " "+inscriptionParser(tags["inscription:1"]);
		}
		if (tags["inscription:2"] != undefined) {
			popup_content += " "+inscriptionParser(tags["inscription:2"]);
			if (tags["inscription:3"] != undefined) {
				popup_content += " "+inscriptionParser(tags["inscription:3"]);
				if (tags["inscription:4"] != undefined) {
					popup_content += " "+inscriptionParser(tags["inscription:4"]);
					if (tags["inscription:5"] != undefined) {
						popup_content += " "+inscriptionParser(tags["inscription:5"]);
					}
				}
			}
		}
		popup_content += "</div><br/>"
	} else if (tags.inscription == undefined && tags["inscription:1"] != undefined && tags["inscription:1"] != 'no') {
		popup_content += "<div class='inscription'>"+inscriptionParser(tags["inscription:1"]);
		if (tags["inscription:2"] != undefined) {
			popup_content += " "+inscriptionParser(tags["inscription:2"]);
			if (tags["inscription:3"] != undefined) {
				popup_content += " "+inscriptionParser(tags["inscription:3"]);
				if (tags["inscription:4"] != undefined) {
					popup_content += " "+inscriptionParser(tags["inscription:4"]);
					if (tags["inscription:5"] != undefined) {
						popup_content += " "+inscriptionParser(tags["inscription:5"]);
					}
				}
			}
		}
		popup_content += "</div><br/>"
	} else if (tags.inscription == 'no') {
		popup_content += "<span>No inscription</span><br/>"
	} else if (tags.amenity == 'bench' && tags.inscription == undefined) {
		popup_content += "<span class=\"unknown\">Inscription unknown</span><br/>";
	} else {
		popup_content += "";
	}

	if (tags.panoramax != undefined) {
		var thumb = getPanoramaxThumb(tags.panoramax);
		var link = getPanoramaxLink(tags.panoramax);
		popup_content += "<a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a><br/>";
	}

	// if (tags.seats != undefined) {
	// 	var tooltip_content = tags.seats;
	// }

	if (tags.colour != undefined) {
		if (tags.colour.includes('white') || tags.colour.includes('silver') || tags.colour.includes('gray') || tags.colour.includes('yellow') || tags.colour.includes('pink') || tags.colour.includes('light')) {
			popup_content += "Color: <span class=\"colorbox\" title=\""+tags.colour+"\" style=\"color: #333; background-color:"+tags.colour+"\">"+tags.colour+"</span> | ";
		} else {
			popup_content += "Color: <span class=\"colorbox\" title=\""+tags.colour+"\" style=\"background-color:"+tags.colour+"\">"+tags.colour+"</span> | ";
		}
		// var tooltip_content = "C";
	} else {
		popup_content += "";
		// var tooltip_content = "";
	}
	if (tags.material != undefined) {
		popup_content += "Material: <span class=\"material "+tags.material+"\">"+tags.material+"</span>";
		// tooltip_content += "M";
	} else {
		popup_content += "Material: 🤷";
	}

	if (tags.backrest == undefined && tags.amenity == 'bench') {
		popup_content += "<br/>Backrest: 🤷";
	} else if (tags.backrest == 'yes' && tags.amenity == 'bench') {
		popup_content += "<br/>Backrest: ☑️";
	} else if (tags.backrest == 'no' && tags.amenity == 'bench') {
		popup_content += "<br/>Backrest: ❌";
	}

	if (tags.armrest == undefined && tags.amenity == 'bench') {
		popup_content += " | Armrests: 🤷";
	} else if (tags.armrest == 'yes' && tags.amenity == 'bench') {
		popup_content += " | Armrests: ☑️";
	} else if (tags.armrest == 'no' && tags.amenity == 'bench') {
		popup_content += " | Armrests: ❌";
	}

	if (tags.backrest == 'no' && tags.direction != undefined && tags.amenity == 'bench') {
		if (tags.direction >= 180) {
			popup_content += "<br/>Facing: "+directionParser(tags.direction)+"/"+directionParser(Number(tags.direction)-180);
		} else if (tags.direction < 180) {
			popup_content += "<br/>Facing: "+directionParser(tags.direction)+"/"+directionParser(Number(tags.direction)+180);
		}
	} else 
	if (tags.direction != undefined && tags.amenity == 'bench') {
		popup_content += "<br/>Facing: "+directionParser(tags.direction);
	}

	if (tags.seats != undefined && tags.amenity == 'bench') {
		popup_content += "<br/>Seats: "+tags.seats;
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️</a> | <a href='"+iDedit+"' title=\"edit feature on OSM\" target='_blank'>✏️</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️</a></div>";

	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	// mrk.bindTooltip(L.tooltip({permanent:true,direction:'top'}).setContent(tooltip_content)).openTooltip;

	poi_markers.push(mrk);
	// mrk.addTo(poiClusters);
	mrk.addTo(poiMain);
	if (map.getZoom() > 18) {
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
			if (el.tags.leisure == 'picnic_table') {
				setDotMarker("", picnic_table_dot, el.lat, el.lon, el.tags, el.id, el.type);
				if (el.tags.colour != undefined && el.tags.colour.includes('red')) {
					setPoiMarker("", picnic_table_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('orange')) {
					setPoiMarker("", picnic_table_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('yellow')) {
					setPoiMarker("", picnic_table_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('green')) {
					setPoiMarker("", picnic_table_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('blue')) {
					setPoiMarker("", picnic_table_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('purple')) {
					setPoiMarker("", picnic_table_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('brown')) {
					setPoiMarker("", picnic_table_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('black')) {
					setPoiMarker("", picnic_table_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && (el.tags.colour.includes('gray') || el.tags.colour.includes('grey') || el.tags.colour.includes('silver'))) {
					setPoiMarker("", picnic_table_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
				} else if (el.tags.colour != undefined && el.tags.colour.includes('white')) {
					setPoiMarker("", picnic_table_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
				} else {
					setPoiMarker("", picnic_table_icon, el.lat, el.lon, el.tags, el.id, el.type);
				}
			} else if (el.tags.amenity == 'bench') {
				setDotMarker("", bench_dot, el.lat, el.lon, el.tags, el.id, el.type);
				if (el.tags.colour != undefined && el.tags.colour.includes('red')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_red, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('orange')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_orange, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('yellow')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_yellow, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('green')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_green, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('blue')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_blue, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('purple')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_purple, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('brown')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_brown, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('black')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_black, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && (el.tags.colour.includes('gray') || el.tags.colour.includes('grey') || el.tags.colour.includes('silver'))) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_gray, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else if (el.tags.colour != undefined && el.tags.colour.includes('white')) {
					if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", yab_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", yb_na_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_nb_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", nab_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'yes') && (el.tags.armrest == undefined)) {
						setPoiMarker("", yb_ua_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest != undefined && el.tags.backrest == 'no') && (el.tags.armrest == undefined)) {
						setPoiMarker("", nb_ua_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'yes')) {
						setPoiMarker("", ya_ub_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest != undefined && el.tags.armrest == 'no')) {
						setPoiMarker("", na_ub_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					} else if ((el.tags.backrest == undefined) && (el.tags.armrest == undefined)) {
						setPoiMarker("", uab_icon_white, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else {
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
					}
				}
			}
			
			if ((el.tags.inscription != undefined && el.tags.inscription != 'no') || (el.tags["inscription:1"] != undefined && el.tags["inscription:1"] != 'no')) {
				setMiniMarker("", inscription_icon, el.lat, el.lon, el.tags, el.id, el.type);
			// } else if (el.tags.inscription == 'no') {
			// 	setMiniMarker("", no_inscription_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.inscription == undefined && el.tags.amenity == 'bench') {
				setMiniMarker("", unk_inscription_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}
		}
	});
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');
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
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr[amenity=bench];nwr[leisure=picnic_table];);out body center; >; out skel qt;'
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
	bench_dot = L.icon({
		iconUrl: 'icons/bench_dot.svg',
		iconSize: [8,8],
		className: 'pointIcon',
		iconAnchor: [4,4],
		popupAnchor: [0,-14],
	});
	picnic_table_dot = L.icon({
		iconUrl: 'icons/picnic_table_dot.svg',
		iconSize: [10,10],
		className: 'pointIcon',
		iconAnchor: [5,5],
		popupAnchor: [0,-14],
	});
	yab_icon = L.icon({
		iconUrl: 'icons/yab_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_red = L.icon({
		iconUrl: 'icons/yab_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_orange = L.icon({
		iconUrl: 'icons/yab_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_yellow = L.icon({
		iconUrl: 'icons/yab_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_green = L.icon({
		iconUrl: 'icons/yab_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_blue = L.icon({
		iconUrl: 'icons/yab_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_purple = L.icon({
		iconUrl: 'icons/yab_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_brown = L.icon({
		iconUrl: 'icons/yab_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_black = L.icon({
		iconUrl: 'icons/yab_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_gray = L.icon({
		iconUrl: 'icons/yab_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yab_icon_white = L.icon({
		iconUrl: 'icons/yab_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	ya_nb_icon = L.icon({
		iconUrl: 'icons/ya_nb_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_red = L.icon({
		iconUrl: 'icons/ya_nb_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_orange = L.icon({
		iconUrl: 'icons/ya_nb_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_yellow = L.icon({
		iconUrl: 'icons/ya_nb_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_green = L.icon({
		iconUrl: 'icons/ya_nb_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_blue = L.icon({
		iconUrl: 'icons/ya_nb_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_purple = L.icon({
		iconUrl: 'icons/ya_nb_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_brown = L.icon({
		iconUrl: 'icons/ya_nb_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_black = L.icon({
		iconUrl: 'icons/ya_nb_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_gray = L.icon({
		iconUrl: 'icons/ya_nb_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_nb_icon_white = L.icon({
		iconUrl: 'icons/ya_nb_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	ya_ub_icon = L.icon({
		iconUrl: 'icons/ya_ub_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_red = L.icon({
		iconUrl: 'icons/ya_ub_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_orange = L.icon({
		iconUrl: 'icons/ya_ub_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_yellow = L.icon({
		iconUrl: 'icons/ya_ub_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_green = L.icon({
		iconUrl: 'icons/ya_ub_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_blue = L.icon({
		iconUrl: 'icons/ya_ub_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_purple = L.icon({
		iconUrl: 'icons/ya_ub_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_brown = L.icon({
		iconUrl: 'icons/ya_ub_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_black = L.icon({
		iconUrl: 'icons/ya_ub_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_gray = L.icon({
		iconUrl: 'icons/ya_ub_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});ya_ub_icon_white = L.icon({
		iconUrl: 'icons/ya_ub_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	yb_na_icon = L.icon({
		iconUrl: 'icons/yb_na_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_red = L.icon({
		iconUrl: 'icons/yb_na_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_orange = L.icon({
		iconUrl: 'icons/yb_na_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_yellow = L.icon({
		iconUrl: 'icons/yb_na_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_green = L.icon({
		iconUrl: 'icons/yb_na_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_blue = L.icon({
		iconUrl: 'icons/yb_na_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_purple = L.icon({
		iconUrl: 'icons/yb_na_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_brown = L.icon({
		iconUrl: 'icons/yb_na_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_black = L.icon({
		iconUrl: 'icons/yb_na_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_gray = L.icon({
		iconUrl: 'icons/yb_na_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_na_icon_white = L.icon({
		iconUrl: 'icons/yb_na_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	yb_ua_icon_red = L.icon({
		iconUrl: 'icons/yb_ua_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_orange = L.icon({
		iconUrl: 'icons/yb_ua_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_yellow = L.icon({
		iconUrl: 'icons/yb_ua_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_green = L.icon({
		iconUrl: 'icons/yb_ua_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_blue = L.icon({
		iconUrl: 'icons/yb_ua_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_purple = L.icon({
		iconUrl: 'icons/yb_ua_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_brown = L.icon({
		iconUrl: 'icons/yb_ua_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_black = L.icon({
		iconUrl: 'icons/yb_ua_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_gray = L.icon({
		iconUrl: 'icons/yb_ua_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon_white = L.icon({
		iconUrl: 'icons/yb_ua_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});yb_ua_icon = L.icon({
		iconUrl: 'icons/yb_ua_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	nab_icon = L.icon({
		iconUrl: 'icons/nab_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_red = L.icon({
		iconUrl: 'icons/nab_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_orange = L.icon({
		iconUrl: 'icons/nab_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_yellow = L.icon({
		iconUrl: 'icons/nab_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_green = L.icon({
		iconUrl: 'icons/nab_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_blue = L.icon({
		iconUrl: 'icons/nab_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_purple = L.icon({
		iconUrl: 'icons/nab_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_brown = L.icon({
		iconUrl: 'icons/nab_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_black = L.icon({
		iconUrl: 'icons/nab_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_gray = L.icon({
		iconUrl: 'icons/nab_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nab_icon_white = L.icon({
		iconUrl: 'icons/nab_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	na_ub_icon = L.icon({
		iconUrl: 'icons/na_ub_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_red = L.icon({
		iconUrl: 'icons/na_ub_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_orange = L.icon({
		iconUrl: 'icons/na_ub_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_yellow = L.icon({
		iconUrl: 'icons/na_ub_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_green = L.icon({
		iconUrl: 'icons/na_ub_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_blue = L.icon({
		iconUrl: 'icons/na_ub_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_purple = L.icon({
		iconUrl: 'icons/na_ub_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_brown = L.icon({
		iconUrl: 'icons/na_ub_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_black = L.icon({
		iconUrl: 'icons/na_ub_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_gray = L.icon({
		iconUrl: 'icons/na_ub_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});na_ub_icon_white = L.icon({
		iconUrl: 'icons/na_ub_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	nb_ua_icon = L.icon({
		iconUrl: 'icons/nb_ua_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_red = L.icon({
		iconUrl: 'icons/nb_ua_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_orange = L.icon({
		iconUrl: 'icons/nb_ua_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_yellow = L.icon({
		iconUrl: 'icons/nb_ua_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_green = L.icon({
		iconUrl: 'icons/nb_ua_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_blue = L.icon({
		iconUrl: 'icons/nb_ua_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_purple = L.icon({
		iconUrl: 'icons/nb_ua_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_brown = L.icon({
		iconUrl: 'icons/nb_ua_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_black = L.icon({
		iconUrl: 'icons/nb_ua_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_gray = L.icon({
		iconUrl: 'icons/nb_ua_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});nb_ua_icon_white = L.icon({
		iconUrl: 'icons/nb_ua_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	uab_icon = L.icon({
		iconUrl: 'icons/uab_icon.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_red = L.icon({
		iconUrl: 'icons/uab_icon_red.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_orange = L.icon({
		iconUrl: 'icons/uab_icon_orange.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_yellow = L.icon({
		iconUrl: 'icons/uab_icon_yellow.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_green = L.icon({
		iconUrl: 'icons/uab_icon_green.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_blue = L.icon({
		iconUrl: 'icons/uab_icon_blue.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_purple = L.icon({
		iconUrl: 'icons/uab_icon_purple.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_brown = L.icon({
		iconUrl: 'icons/uab_icon_brown.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_black = L.icon({
		iconUrl: 'icons/uab_icon_black.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_gray = L.icon({
		iconUrl: 'icons/uab_icon_gray.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});uab_icon_white = L.icon({
		iconUrl: 'icons/uab_icon_white.svg',
		iconSize: [24,24],
		className: 'pointIcon',
		iconAnchor: [12,12],
		popupAnchor: [0,-20],
	});
	picnic_table_icon = L.icon({
		iconUrl: 'icons/picnic_table.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_red = L.icon({
		iconUrl: 'icons/picnic_table_red.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_orange = L.icon({
		iconUrl: 'icons/picnic_table_orange.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_yellow = L.icon({
		iconUrl: 'icons/picnic_table_yellow.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_green = L.icon({
		iconUrl: 'icons/picnic_table_green.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_blue = L.icon({
		iconUrl: 'icons/picnic_table_blue.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_purple = L.icon({
		iconUrl: 'icons/picnic_table_purple.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_brown = L.icon({
		iconUrl: 'icons/picnic_table_brown.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_black = L.icon({
		iconUrl: 'icons/picnic_table_black.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_gray = L.icon({
		iconUrl: 'icons/picnic_table_gray.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	picnic_table_icon_white = L.icon({
		iconUrl: 'icons/picnic_table_white.svg',
		iconSize: [28,28],
		className: 'pointIcon',
		iconAnchor: [14,14],
		popupAnchor: [0,-20],
	});
	inscription_icon = L.icon({
		iconUrl: 'icons/inscription.svg',
		iconSize: [8,5],
		className: 'sourceIcon',
		iconAnchor: [4,-4],
	});
	no_inscription_icon = L.icon({
		iconUrl: 'icons/no_inscription.svg',
		iconSize: [8,5],
		className: 'sourceIcon',
		iconAnchor: [4,-4],
	});
	unk_inscription_icon = L.icon({
		iconUrl: 'icons/unk_inscription.svg',
		iconSize: [8,8],
		className: 'sourceIcon',
		iconAnchor: [4,-4],
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

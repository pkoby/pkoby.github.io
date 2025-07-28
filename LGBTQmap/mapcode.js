'use strict';
var bbox, bboxOutline;
var poi_markers = new Array();
var poi_clusters = new L.markerClusterGroup({
	// disableClusteringAtZoom: 16,
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	maxClusterRadius: 15,
	minClusterRadius: 1,
	// iconCreateFunction: function(cluster) {
	// 	return L.icon({
	// 		iconUrl: 'icons/group_icon.svg',
	// 		iconSize: [32,32],
	// 		className: 'pointIcon',
	// 		iconAnchor: [16,16],
	// 	});
	// }
});

var primary_icon,welcome_icon,no_icon,has_source_icon,has_website_icon,no_source_icon,bar_icon,cafe_icon,fitness_icon,gallery_icon,healthcare_icon,heart_icon,library_icon,lodging_icon,memorial_icon,museum_icon,office_icon,pharmacy_icon,placeofworship_icon,pub_icon,restaurant_icon,sauna_icon,shop_icon,theater_icon,vet_icon,other_icon;
	
// init map
let Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	minZoom: 6,
	maxZoom: 20,
	opacity:0.8,
	detectRetina: true,
});

let CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	minZoom: 6,
	maxZoom: 19,
	detectRetina: true,
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
	layers: [CartoDB_DarkMatter],
	maxBounds: [[90,-180],[-90,180]],
	zoomControl: false,
	center: [51.5,-0.1],
	zoom: 12,
	attributionControl: false
})

let hash=new L.Hash(map);

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

document.getElementById('background').addEventListener('click', toggleBackground);

document.getElementById('loaddata').addEventListener('click', downloadData);

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
	map.setZoom(12);
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

	// leafl.addContent('<a href="https://github.com/pkoby/pkoby.github.io/issues" target=\"\_blank\">Report issue on Github</a>');
L.control.attribution({prefix: '<a href="https://github.com/pkoby/pkoby.github.io/issues" target=\"\_blank\">Report issue on Github</a> | <a href="https://leafletjs.com/">Leaflet</a>'}).addTo(map);



map.on('load', function () {
	if (map.getZoom() < 12) {
		map.addLayer(overlay);
		zoomText.setContent('Please Zoom In');
	}
});

if (L.Browser.retina) var tp = "lr";
else var tp = "ls";

// L.control.scale().addTo(map);

function millToDays(ms) {
	const millisecondsInYear = 1000 * 60 * 60 * 24 * 365;
	const millisecondsInMonth = 1000 * 60 * 60 * 24 * 30;
	const millisecondsInDay = 1000 * 60 * 60 * 24;

	let years = Math.floor(ms / millisecondsInYear);
	ms = ms % millisecondsInYear;
	let months = Math.floor(ms / millisecondsInMonth);
	ms = ms % millisecondsInMonth;
	let days = Math.floor(ms / millisecondsInDay);

	if (years > 1) {
		if (months > 1) {
			if (days > 1) {
				return "<span class='years'>"+years+" years, "+months+" months, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='years'>"+years+" years, "+months+" months, "+days+" day ago</span>";
			} else {
				return "<span class='years'>"+years+" years, "+months+" months ago</span>";
			}
		} else if (months == 1) {
			if (days > 1) {
				return "<span class='years'>"+years+" years, "+months+" month, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='years'>"+years+" years, "+months+" month, "+days+" day ago</span>";
			} else {
				return "<span class='years'>"+years+" years, "+months+" month ago</span>";
			}
		} else {
			if (days > 1) {
				return "<span class='years'>"+years+" years, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='years'>"+years+" years, "+days+" day ago</span>";
			} else {
				return "<span class='years'>"+years+" years ago</span>";
			}
		}
	} else if (years == 1) {
		if (months > 1) {
			if (days > 1) {
				return "<span class='oneyear'>"+years+" year, "+months+" months, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='oneyear'>"+years+" year, "+months+" months, "+days+" day ago</span>";
			} else {
				return "<span class='oneyear'>"+years+" year, "+months+" months ago</span>";
			}
		} else if (months == 1) {
			if (days > 1) {
				return "<span class='oneyear'>"+years+" year, "+months+" month, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='oneyear'>"+years+" year, "+months+" month, "+days+" day ago</span>";
			} else {
				return "<span class='oneyear'>"+years+" year, "+months+" month ago</span>";
			}
		} else {
			if (days > 1) {
				return "<span class='oneyear'>"+years+" year, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='oneyear'>"+years+" year, "+days+" day ago</span>";
			} else {
				return "<span class='oneyear'>"+years+" year ago</span>";
			}
		}
	} else {
		if (months > 1) {
			if (days > 1) {
				return "<span class='months'>"+months+" months, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='months'>"+months+" months, "+days+" day ago</span>";
			} else {
				return "<span class='months'>"+months+" months ago</span>";
			}
		} else if (months == 1) {
			if (days > 1) {
				return "<span class='onemonth'>"+months+" month, "+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='onemonth'>"+months+" month, "+days+" day ago</span>";
			} else {
				return "<span class='onemonth'>"+months+" month ago</span>";
			}
		} else {
			if (days > 1) {
				return "<span class='days'>"+days+" days ago</span>";
			} else if (days == 1) {
				return "<span class='days'>"+days+" day ago</span>";
			} else {
				return "<span class='days'>less than a day ago</span>";
			}
		}
	}
}

function setPoiMarker(poi_type, icon, lat, lon, tags, osmid, osmtype, timestamp) {
	var editDate = new Date(timestamp);
	var today = new Date();
	var daysSince = today-editDate;
	var dateStr = millToDays(daysSince);
	const month = daysSince.toLocaleString('default',{ month:'long' });
	var mrk = L.marker([lat, lon], {icon: icon});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var iDedit = "https://www.openstreetmap.org/edit\?editor=id&"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	if (tags.name == undefined) {
		var popup_content = "<span class='type'>"+poi_type+"</span><hr/>";
	} else {
		var popup_content = "<span class='title'>"+tags.name+"</span><br/>";
		if (poi_type == 'books') {
			popup_content += "<span class='type'>Bookstore</span><hr/>";
		} else if (poi_type == 'hairdresser') {
			popup_content += "<span class='type'>Hairdresser</span><hr/>";
		} else if (tags.shop != undefined) {
			popup_content += "<span class='type'>"+poi_type+" Shop</span><hr/>";
		} else {
			popup_content += "<span class='type'>"+poi_type+"</span><hr/>";
		}
	}

	if (tags.lgbtq == 'only') {
		popup_content += "🌈 <span class='primary'>This location only allows members of the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'primary' && tags.historic == 'memorial') {
		popup_content += "🌈 <span class='primary'>This location commemorates LGBTQ+ people</span><br/>";
	}  else if (tags.lgbtq == 'primary') {
		popup_content += "🌈 <span class='primary'>This location caters primarily to the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'welcome' || tags.lgbtq == 'friendly') {
		popup_content += "💗 <span class='welcome'>This location explicitly welcomes members of the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'yes') {
		popup_content += "💗 <span class='welcome'>This location allows members of the LGBTQ+ community</span><br/>";
	} else if (tags.lgbtq == 'no') {
		popup_content += "⛔ <span class='no'>This location does not welcome or prohibits members of the LGBTQ+ community</span><br/>";
	}
	if (tags["lgbtq:lesbian"] || tags["lgbtq:gay"] || tags["lgbtq:bi"] || tags["lgbtq:trans"] || tags["lgbtq:non_binary"] || tags["lgbtq:queer"] || tags["lgbtq:inter"] || tags["lgbtq:bears"] || tags["lgbtq:cruising"] || tags["lgbtq:men"] || tags["lgbtq:women"]) {
		popup_content += "<hr/>";
	}
	if (tags["lgbtq:lesbian"] == 'primary' || tags["lgbtq:lesbian"] == 'welcome') {
		popup_content += "<span class='lesbian'>Lesbian specifically welcome</span><br/>";
	} else if (tags["lgbtq:lesbian"] == 'only') {
		popup_content += "<span class='lesbian'>Lesbian only</span><br/>";
	}
	if (tags["lgbtq:gay"] == 'primary' || tags["lgbtq:gay"] == 'welcome') {
		popup_content += "<span class='gay'>Gay specifically welcome</span><br/>";
	} else if (tags["lgbtq:gay"] == 'only') {
		popup_content += "<span class='gay'>Gay only</span><br/>";
	}
	if (tags["lgbtq:bi"] == 'primary' || tags["lgbtq:bi"] == 'welcome') {
		popup_content += "<span class='bi'>Bi specifically welcome</span><br/>";
	} else if (tags["lgbtq:bi"] == 'only') {
		popup_content += "<span class='bi'>Bi only</span><br/>";
	}
	if (tags["lgbtq:trans"] == 'primary' || tags["lgbtq:trans"] == 'welcome') {
		popup_content += "<span class='trans'>Transgender specifically welcome</span><br/>";
	} else if (tags["lgbtq:trans"] == 'only') {
		popup_content += "<span class='trans'>Transgender only</span><br/>";
	}
	if (tags["lgbtq:non_binary"] == 'primary' || tags["lgbtq:non_binary"] == 'welcome') {
		popup_content += "<span class='nonbinary'>Non-binary specifically welcome</span><br/>";
	} else if (tags["lgbtq:non_binary"] == 'only') {
		popup_content += "<span class='nonbinary'>Non-binary only</span><br/>";
	}
	if (tags["lgbtq:queer"] == 'primary' || tags["lgbtq:queer"] == 'welcome') {
		popup_content += "<span class='queer'>Queer specifically welcome</span><br/>";
	} else if (tags["lgbtq:queer"] == 'only') {
		popup_content += "<span class='queer'>Queer only</span><br/>";
	}
	if (tags["lgbtq:inter"] == 'primary' || tags["lgbtq:inter"] == 'welcome') {
		popup_content += "<span class='inter'>Intersex specifically welcome</span><br/>";
	} else if (tags["lgbtq:inter"] == 'only') {
		popup_content += "<span class='inter'>Intersex only</span><br/>";
	}
	if (tags["lgbtq:bears"] == 'primary' || tags["lgbtq:bears"] == 'welcome') {
		popup_content += "<span class='bears'>Bears specifically welcome</span><br/>";
	} else if (tags["lgbtq:bears"] == 'only') {
		popup_content += "<span class='bears'>Bears only</span><br/>";
	}
	if (tags["lgbtq:cruising"] == 'primary' || tags["lgbtq:cruising"] == 'welcome') {
		popup_content += "<span class='cruising'>Cruising specifically welcome</span><br/>";
	} else if (tags["lgbtq:cruising"] == 'only') {
		popup_content += "<span class='cruising'>Cruising only</span><br/>";
	}
	if (tags["lgbtq:men"] == 'primary' || tags["lgbtq:men"] == 'welcome') {
		popup_content += "<span class='men'>Men specifically welcome</span><br/>";
	} else if (tags["lgbtq:men"] == 'only') {
		popup_content += "<span class='men'>Men only</span><br/>";
	}
	if (tags["lgbtq:women"] == 'primary' || tags["lgbtq:women"] == 'welcome') {
		popup_content += "<span class='women'>Women specifically welcome</span><br/>";
	} else if (tags["lgbtq:women"] == 'only') {
		popup_content += "<span class='women'>Women only</span><br/>";
	}
	popup_content += "<hr/>";
	if (tags["source:lgbtq"]) {
		if (tags["source:lgbtq"].includes('https')) {
			popup_content += "<span class='source'>Source: <span class='sourcelink'><a href=\"" + tags["source:lgbtq"] + "\" target=\"_blank\">website</a></span></span>";
		} else {
			popup_content += "<span class='source'>Source: " + tags["source:lgbtq"] + "</span>";
		}
	} else if (tags.website != undefined) {
		popup_content += "<span class='source'>Source not tagged&mdash;check <span class='sourcelink'><a href=\"" + tags.website + "\" target=\"_blank\">website</a></span></span>";
	} else {
		popup_content += "<span class='source'>Source not tagged</span>";
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️ OSM</a> | <a href='"+iDedit+"' title=\"edit feature on OSM\" target='_blank'>✏️ iD</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️ JOSM</a></div>";
	if (timestamp) {
		popup_content += "<span class='editdate'>Last updated: "+dateStr+"</span>";
	}

	// mrk.bindTooltip(tags.name+"<br/><span class='tiny'>LGBTQ+ "+tags.lgbtq+"</span>",{duration: 0,direction: 'right',offset: [20,6]}).openTooltip();
	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	
	poi_markers.push(mrk);
	mrk.addTo(map);
	// poi_clusters.addTo(map);
}

function element_to_map(data) {	
	poi_clusters.clearLayers();
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
			if ('construction:amenity' in el.tags || 'disused:amenity' in el.tags || 'abandoned:amenity' in el.tags || 'construction:tourism' in el.tags || 'disused:tourism' in el.tags || 'abandoned:tourism' in el.tags || 'construction:shop' in el.tags || 'disused:shop' in el.tags || 'abandoned:shop' in el.tags || 'construction:leisure' in el.tags || 'disused:leisure' in el.tags || 'abandoned:leisure' in el.tags) {
				//Nothing
			} else if (el.tags.amenity == "place_of_worship") {
				setPoiMarker("Place of Worship", placeofworship_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == "community_centre" || el.tags.amenity == "social_facility" || el.tags.office) {
				setPoiMarker("Center/Association", office_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if(el.tags.shop) {
				setPoiMarker(el.tags.shop, shop_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'bar' || el.tags.amenity == 'nightclub' || el.tags.amenity == 'swingerclub') {
				setPoiMarker("Bar/Club", bar_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'pub') {
				setPoiMarker("Pub", pub_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'restaurant' || el.tags.amenity == 'fast_food') {
				setPoiMarker("Restaurant/Fast Food", restaurant_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'cafe') {
				setPoiMarker("Cafe", cafe_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.leisure == 'fitness_centre') {
				setPoiMarker("Fitness Centre", fitness_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'theatre' || el.tags.amenity == 'cinema') {
				setPoiMarker("Theater/Cinema", theater_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'library') {
				setPoiMarker("Library", library_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			// } else if (el.tags.amenity == 'pharmacy') {
			// 	setPoiMarker("Pharmacy", pharmacy_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'veterinary') {
				setPoiMarker("Veterinarian", vet_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.tourism == 'museum') {
				setPoiMarker("Museum", museum_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.tourism == 'hotel' || el.tags.tourism == 'guest_house' || el.tags.tourism == 'hostel' || el.tags.tourism == 'motel') {
				setPoiMarker("Lodging", lodging_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'love_hotel') {
				setPoiMarker("Love Hotel", heart_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.leisure == 'sauna') {
				setPoiMarker("Sauna/Steam Baths", sauna_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.historic == 'memorial') {
				setPoiMarker("Memorial", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.tourism == 'gallery') {
				setPoiMarker("Gallery", gallery_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'arts_centre') {
				setPoiMarker("Arts Centre", gallery_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.amenity == 'clinic' || el.tags.amenity == 'doctors' || el.tags.amenity == 'hospital' || el.tags.healthcare == 'clinic' || el.tags.healthcare == 'doctor' || el.tags.healthcare == 'hospital') {
				setPoiMarker("Healthcare", healthcare_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if(el.tags.amenity) {
				setPoiMarker(el.tags.amenity, other_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else {
				setPoiMarker("Other/Unknown", other_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			}

			if ('construction:amenity' in el.tags || 'disused:amenity' in el.tags || 'abandoned:amenity' in el.tags || 'construction:tourism' in el.tags || 'disused:tourism' in el.tags || 'abandoned:tourism' in el.tags || 'construction:shop' in el.tags || 'disused:shop' in el.tags || 'abandoned:shop' in el.tags || 'construction:leisure' in el.tags || 'disused:leisure' in el.tags || 'abandoned:leisure' in el.tags) {
				//Nothing
			} else if (el.tags.lgbtq == 'primary' || el.tags.lgbtq == 'only') {
				setPoiMarker("", primary_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.lgbtq == 'welcome' || el.tags.lgbtq == 'friendly' || el.tags.lgbtq == 'yes') {
				setPoiMarker("", welcome_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			} else if (el.tags.lgbtq == 'no') {
				setPoiMarker("", no_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			}

			// if ('construction:amenity' in el.tags || 'disused:amenity' in el.tags || 'abandoned:amenity' in el.tags || 'construction:tourism' in el.tags || 'disused:tourism' in el.tags || 'abandoned:tourism' in el.tags || 'construction:shop' in el.tags || 'disused:shop' in el.tags || 'abandoned:shop' in el.tags || 'construction:leisure' in el.tags || 'disused:leisure' in el.tags || 'abandoned:leisure' in el.tags) {
			// 	//Nothing
			// } else if (el.tags["source:lgbtq"]) {
			// 	setPoiMarker("", has_source_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			// } else if (el.tags.website) {
			// 	setPoiMarker("", has_website_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			// } else {
			// 	setPoiMarker("", no_source_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			// }
			// } else {
			// 	setPoiMarker("", error_icon, el.lat, el.lon, el.tags, el.id, el.type, el.timestamp);
			// 		error_counter++;
			// 	}
		}
	});
	// legend.addTo(map);
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');
}

function downloadData() {
	// var mapHash = new L.Hash(map);
	if (map.getZoom() < 12) {
		var new_span = document.createElement('span');
		new_span.innerText = "Please Zoom In";
		return null;
	}

	document.getElementById('tipRight').style.display = 'none';
	document.getElementById('arrowRight').style.display = 'none';
	document.getElementById('tipRightBottom').style.display = 'none';
	document.getElementById('arrowRightBottom').style.display = 'none';
	
	map.addLayer(loadingOverlay);
	loadingText.setContent('Loading<img src="icons/loading.gif">');

	// var new_span = document.createElement('span');
	// new_span.innerText = "Loading...";

	bbox = map.getBounds().getSouth() + "," + map.getBounds().getWest() + "," + map.getBounds().getNorth() +  "," + map.getBounds().getEast();

	localStorage.setItem("pos_lat", map.getCenter().lat)
	localStorage.setItem("pos_lon", map.getCenter().lng)
	$.ajax({
		url: "https://overpass-api.de/api/interpreter",
		data: {
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr[lgbtq];);out meta center; >; out skel qt;'/*nwr[historic=memorial];*/
		},
		success: element_to_map,
		error: error_function,
	});

	if (map.hasLayer(bboxOutline)) {
		map.removeLayer(bboxOutline);	
	}

	var bounds = map.getBounds();
	var northWest = bounds.getNorthWest(),northEast = bounds.getNorthEast(),southWest = bounds.getSouthWest(),southEast = bounds.getSouthEast();

	bboxOutline = L.polygon([[[90, -180],[90, 180],[-90, 180],[-90, -180]],[[northWest.lat,northWest.lng],[northEast.lat,northEast.lng],[southEast.lat,southEast.lng],[southWest.lat,southWest.lng]]],{color: '#333', fillColor: '#333', fillOpacity: 0.5, weight: 1, dashArray: '1,3',}).addTo(map);
}

function toggleBackground() {
	if (map.hasLayer(CartoDB_DarkMatter)) {
		map.removeLayer(CartoDB_DarkMatter);
		map.addLayer(Positron);	
	} else if (map.hasLayer(Positron)) {
		map.removeLayer(Positron);
		map.addLayer(CartoDB_DarkMatter);	
	}
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
		html: '💗',
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
	has_source_icon = L.icon({
		iconUrl: 'icons/circle_blue.svg',
		iconSize: [6,6],
		className: 'sourceIcon',
		iconAnchor: [-12,-9],
	});
	has_website_icon = L.icon({
		iconUrl: 'icons/circle_orange.svg',
		iconSize: [6,6],
		className: 'sourceIcon',
		iconAnchor: [-12,-9],
	});
	no_source_icon = L.icon({
		iconUrl: 'icons/circle_red.svg',
		iconSize: [6,6],
		className: 'sourceIcon',
		iconAnchor: [-12,-9],
	});
	bar_icon = L.icon({
		iconUrl: 'icons/bar.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	cafe_icon = L.icon({
		iconUrl: 'icons/cafe.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	fitness_icon = L.icon({
		iconUrl: 'icons/fitness-centre.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	gallery_icon = L.icon({
		iconUrl: 'icons/gallery.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	healthcare_icon = L.icon({
		iconUrl: 'icons/clinic.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	heart_icon = L.icon({
		iconUrl: 'icons/heart.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	library_icon = L.icon({
		iconUrl: 'icons/library.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	lodging_icon = L.icon({
		iconUrl: 'icons/lodging.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	memorial_icon = L.icon({
		iconUrl: 'icons/memorial.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	museum_icon = L.icon({
		iconUrl: 'icons/museum.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	office_icon = L.icon({
		iconUrl: 'icons/office.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	pharmacy_icon = L.icon({
		iconUrl: 'icons/pharmacy.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	placeofworship_icon = L.icon({
		iconUrl: 'icons/placeofworship.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	pub_icon = L.icon({
		iconUrl: 'icons/pub.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	restaurant_icon = L.icon({
		iconUrl: 'icons/restaurant.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	sauna_icon = L.icon({
		iconUrl: 'icons/sauna.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	shop_icon = L.icon({
		iconUrl: 'icons/shop.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	theater_icon = L.icon({
		iconUrl: 'icons/theater.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	vet_icon = L.icon({
		iconUrl: 'icons/vet.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});
	other_icon = L.icon({
		iconUrl: 'icons/flag.svg',
		iconSize: [26,26],
		className: 'pointIcon',
		iconAnchor: [15,18],
		popupAnchor: [0,-24],
	});



// function go_to_current_pos() {
// 	navigator.geolocation.getCurrentPosition(function(pos) {
// 		map.setView([pos.coords.latitude, pos.coords.longitude], 12);
// 	});
// }
	map.on('zoomend', function () {
		// if (map.getZoom() > 18) {
		// 	map.addLayer(Positron);
		// 	map.removeLayer(Stamen_TonerBackground);
		// 	map.removeLayer(CartoDB_PositronOnlyLabels);
		// }
		// if (map.getZoom() <= 18) {
		// 	map.removeLayer(Positron);
		// 	map.addLayer(Stamen_TonerBackground);
		// 	map.addLayer(CartoDB_PositronOnlyLabels);
		// }
		if (map.getZoom() >= 12) {
			map.removeLayer(overlay);
			zoomText.setContent('');
			document.getElementById('loaddata').style.visibility = "visible";
			document.getElementById('arrowRight').style.visibility = "visible";
			document.getElementById('tipRight').style.visibility = "visible";
		}
		if (map.getZoom() < 12) {
			map.addLayer(overlay);
			zoomText.setContent('Please Zoom In');
			document.getElementById('loaddata').style.visibility = "hidden";
			document.getElementById('arrowRight').style.visibility = "hidden";
			document.getElementById('tipRight').style.visibility = "hidden";
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

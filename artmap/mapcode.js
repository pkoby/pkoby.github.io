'use strict';
var saved_lat, saved_lon, bbox, bboxOutline;
var poi_markers = new Array();
// var poi_clusters = new L.markerClusterGroup({
// 	disableClusteringAtZoom: 16,
// 	spiderfyOnMaxZoom: false,
// 	// showCoverageOnHover: false,
// 	// maxClusterRadius: 10,
// });
// var outline_clusters = new L.markerClusterGroup({
// 	disableClusteringAtZoom: 16,
// 	spiderfyOnMaxZoom: false,
// 	// showCoverageOnHover: false,
// 	// maxClusterRadius: 10,
// });

var counter = 0;
var image_counter = 0;
var error_counter = 0;
var counter_div = document.getElementById("counter_display");

var outline_icon,error_icon,wiki_icon,image_icon,mapillary_icon,panoramax_icon,artwork_icon,architecture_icon,bust_icon,graffiti_icon,installation_icon,memorial_icon,mosaic_icon,mural_icon,painting_icon,relief_icon,sculpture_icon,statue_icon,stone_icon,totem_icon;
	
	// init map
	var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 19,
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
	
	
	var lc = L.control.locate({inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'inView', locateOptions: {enableHighAccuracy: true}}).addTo(map);


	document.getElementById('zoomin').addEventListener('click', function () {
		map.zoomIn();
	});
	document.getElementById('zoomout').addEventListener('click', function () {
		map.zoomOut();
	});

	function hideTips() {
		document.getElementById('tip').style.display = 'none';
		document.getElementById('arrow').style.display = 'none';
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

	document.getElementById('loadart').addEventListener('click', dlObjects);

	// var toggleLegend  = document.getElementById("openlegend");
	// var legendContent = document.getElementById("legendbox");

	openlegend.addEventListener("click", function() {
	  legendbox.style.display = (legendbox.dataset.toggled ^= 1) ? "block" : "none";
	  openlegend.style.opacity = (openlegend.dataset.toggled ^= 1) ? "0.9" : "0.6";
	});

	// new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

	var legend = L.control({ position: 'bottomleft' });
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'legend'), icons = ['unknown','architecture','bust','graffiti','installation','memorial','mosaic','mural','painting1','relief','sculpture','statue','stone','totem'], labels = ['Unknown Type','Architecture','Bust','Graffiti','Installation','Memorial','Mosaic','Mural','Painting','Relief','Sculpture','Statue','Stone','Totem Pole'];
		// div.innerHTML =	'<span>Port of Passage</span><br><i class="points" style="color:">&#8226;</i>Bristol<br><i class="points" style="color:">&#8226;</i>Middlesex<br><i class="points" style="color:">&#8226;</i>London<br><br><span>Date of Indenture</span><br>';
		for (var i = 0; i < icons.length; i++) {
			div.innerHTML += '<img src="' + icons[i]+'.svg" class="legendicon"">'+labels[i]+'<br>';
		}
		return div;
	};

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
		map.setZoom(14);
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
		if (map.getZoom() < 14) {
			map.addLayer(overlay);
			zoomText.setContent('Please Zoom In');
		}
	});

	// map = L.map('bigmap');

	saved_lat = localStorage.getItem("pos_lat")
	saved_lon = localStorage.getItem("pos_lon")

	if (saved_lat != undefined) {
	map.setView([saved_lat, saved_lon], 15)
	} else {
		map.setView([51.5,-0.1], 15);
	}

	var hash = new L.Hash(map);

	if (L.Browser.retina) var tp = "lr";
	else var tp = "ls";

	// L.control.scale().addTo(map);



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

function getWiki(tagWikip) {
	var wiki_tag = tagWikip;
	var lang = wiki_tag.substr(0,2);
	var page = wiki_tag.substr(3);
	var page_no_special = decodeURI(page);
	var page_no_spaces = page_no_special.replace(new RegExp(' ', 'g'), '\_');
	var page_no_apos = page_no_spaces.replace(new RegExp('\'', 'g'), '\%27');
	var wiki_link = "https://"+lang+".wikipedia.org/wiki/"+page_no_apos;
	return wiki_link;
}

// function getWikidataImage(tagWD) {
// 	const wdLink = fetch("https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity="+tagWD+"&format=json")
// 		.then(response => response.json())
//   		.then(data => console.log(data))
//   		.catch(error => console.error("Error fetching JSON:", error));
// 	var jsonData = wdLink;
// 	// var parsed = JSON.parse(wdLink);
// 	var hash = calcMD5(unescape(encodeURIComponent(wdLink)));
// 	// var wiki_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/"+hash.substring(0,1)+"/"+hash.substring(0,2)+"/"+wiki_file_no_apos+"/250px-"+wiki_file_no_apos;
// 	console.log(jsonData);
// 	// return wiki_link;
// }

function getMLLink(tagMapillary) {
	var ml_link = "https://www.mapillary.com/app/?focus=photo&pKey="+tagMapillary;
	return ml_link;
}

function getPxThumb(tagPanoramax) {
	var px_link = "https://api.panoramax.xyz/api/pictures/"+tagPanoramax+"/thumb.jpg";
	return px_link
}

function getPxLink(tagPanoramax) {
	var px_link = "https://api.panoramax.xyz/#s=fp;s2;p"+tagPanoramax;
	return px_link;
}

function setPoiMarker(poi_type, icon, lat, lon, tags, osmid, osmtype) {
	var mrk = L.marker([lat, lon], {icon: icon});
	var osmlink = "https://www.openstreetmap.org/"+osmtype+"/"+osmid;
	var iDedit = "https://www.openstreetmap.org/edit\?editor=id&"+osmtype+"="+osmid;
	var josmedit = "http://127.0.0.1:8111/load_object?new_layer=true&objects=n"+osmid;

	if (tags.name == null) {
		var popup_content = "<span class='type'>"+poi_type+"</span>";
	} else {
		var popup_content = "<span class='title'>"+tags.name+"</span><br/><span class='type'>"+poi_type+"</span>";//<br><span class='type'>"+poi_type+"</span>
	}

	if (tags.artist_name != undefined) {
		if (tags["artist:wikipedia"] != undefined) {
			popup_content += "<br>Artist: <a href='"+getWiki(tags["artist:wikipedia"])+"' target='_blank'>"+tags.artist_name+"</a>";
		} else {
			popup_content += "<br>Artist: "+tags.artist_name;
		}
	}

	// if (tags.artwork_subject != undefined) {
	// 	popup_content += "<br>Subject: "+tags.artwork_subject;
	// }

	if (tags.material != undefined) {
		popup_content += "<br>Material: <span class='material "+tags.material+"'>"+tags.material+"</span>";
	}
	
	if (tags.start_date != undefined) {
		popup_content += "<br>Installed: "+tags.start_date;
	}

	if (tags.wikipedia != undefined) {
		var link = getWiki(tags.wikipedia);
		popup_content += "<br><a href="+link+" target=\"_blank\">Wikipedia Link</a>";
	}

	// if (tags.wikidata != undefined) {
	// 	var image = getWikidataImage(tags.wikidata);
	// 	console.log(image);
	// 	popup_content += "<br><a href='"+link+"' target='_blank'><img src='"+image+"' class='popup_image'></a>";
	// } else 
	if (tags.wikimedia_commons != undefined) {
		var link = getWikiImg(tags.wikimedia_commons);
		var thumb = getWikiThumb(tags.wikimedia_commons);
		if (tags.wikimedia_commons.startsWith("File")) {
			popup_content += "<br><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a>";
		} else if (tags.wikimedia_commons.includes("//commons.wikimedia.org/wiki/File")) {
			popup_content += "<br><span class='invalid' title='"+tags.wikimedia_commons+"'>(Invalid image tag)</span><br><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a>";
		} else if (tags.wikimedia_commons.includes("Category")) {
			popup_content += "<br><span class='category' title='"+tags.wikimedia_commons+"'>📷 <a href='https://commons.wikimedia.org/wiki/"+tags.wikimedia_commons+"' target='_blank'>Wikimeda Image Category</a></span>";
		} else {
			popup_content += "<br><span class='invalid' title='"+tags.wikimedia_commons+"'>Invalid image tag: <a href='https://commons.wikimedia.org/wiki/"+tags.wikimedia_commons+"' target='_blank'>"+tags.wikimedia_commons+"</span>";
		}
	} else if (tags.panoramax != undefined) {
		var thumb = getPxThumb(tags.panoramax);
		var link = getPxLink(tags.panoramax);
		popup_content += "<br><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a>";
		// var link = getPxLink(tags.panoramax);
		// popup_content += "<br><a href='"+link+"' target='_blank'>Panoramax Image Link</a>";
	} else if (tags.mapillary != undefined) {
		popup_content += "<br><a href='"+getMLLink(tags.mapillary)+"' target='_blank'>Mapillary Image Link</a>";
	} else if (tags.image != undefined) {
		if (tags.image.includes("//static.panoramio.com")) {
			popup_content += "<br><span class='invalid' title='"+tags.image+"'>Image tag may be invalid</span>";
		} else if (tags.image.includes("//commons.wikimedia.org") || tags.image.startsWith("File:") || tags.image.includes("wikipedia.org")) {
			var link = getWikiImg(tags.image);
			var thumb = getWikiThumb(tags.image);
			popup_content += "<br><a href='"+link+"' target='_blank'><img src='"+thumb+"' class='popup_image'></a><br/><span class='invalid' title='"+tags.image+"'>(Image tag may be invalid)</span>";
		} else if (tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpg") || tags.image.toLowerCase().endsWith(".jpeg") || tags.image.toLowerCase().endsWith(".png") || tags.image.toLowerCase().endsWith(".gif") || tags.image.toLowerCase().endsWith(".bmp")) {
			popup_content += "<br><a href='"+tags.image+"' target='_blank'><img src='"+tags.image+"' class='popup_image'></a>";
		} else {
			popup_content += "<br><span class='invalid' title='"+tags.image+"'>Image tag may be invalid: "+tags.image+"</span>";
		}
	}

	popup_content += "<div class='linktext'><a href='"+osmlink+"' title=\"show feature on OSM\" target='_blank'>🗺️ OSM</a> | <a href='"+iDedit+"' title=\"edit feature on OSM\" target='_blank'>✏️ iD</a> | <a href='"+josmedit+"' title=\"edit feature in JOSM\" target='_blank'>🖊️ JOSM</a></div>";

	// popup_content += "<div class='link_text'><a href='"+osmlink+"' target='_blank'>show feature on OSM</a> | <a href='"+mllink+"' target='_blank'>show area on Mapillary</a></div>";
	// popup_content += "<div class='link_text'><a href='http://localhost:8111/import?url="+osmlink+"' target='_blank'>edit feature in JOSM</a> | <a href='"+osmedit+"' target='_blank'>edit feature in iD</a></div>";

	mrk.bindPopup(L.popup({autoPanPaddingTopLeft: [0,50]}).setContent(popup_content));
	poi_markers.push(mrk);
	mrk.addTo(map);
	counter++;
	// outline_clusters.addTo(map);
	// poi_clusters.addTo(map);
}

// function setOutline(poi_type, icon, lat, lon) {
// 	var mrk = L.marker([lat, lon], {icon: icon});

// 	poi_markers.push(mrk);
// 	mrk.addTo(map);
// }

function element_to_map(data) {	
	var bounds = map.getBounds();
	// console.log(whatarebounds);
	var northWest = bounds.getNorthWest(),northEast = bounds.getNorthEast(),southWest = bounds.getSouthWest(),southEast = bounds.getSouthEast();

	bboxOutline = L.polygon([[[90, -180],[90, 180],[-90, 180],[-90, -180]],[[northWest.lat,northWest.lng],[northEast.lat,northEast.lng],[southEast.lat,southEast.lng],[southWest.lat,southWest.lng]]],{color: '#aaaaaa', fillColor: '#aaaaaa', fillOpacity: 0.3, weight: 1, dashArray: '1,3',}).addTo(map);
	counter = 0;
	image_counter = 0;
	error_counter = 0;
	$.each(poi_markers, function(_, mrk) {
		map.removeLayer(mrk);
	});

	$.each(data.elements, function(_, el) {
		if (el.lat == undefined) {
			el.lat = el.center.lat;
			el.lon = el.center.lon;
		}

		if (el.tags != undefined) {
			var mrk;

			if (el.tags.artwork_type == undefined) {
				if (el.tags.historic != undefined) {
					if (el.tags.memorial == "war_memorial") {
						setPoiMarker("War Memorial", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == "plaque") {
						setPoiMarker("Memorial Plaque", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == "statue") {
						setPoiMarker("Memorial Statue", statue_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == "sculpture") {
						setPoiMarker("Memorial Sculpture", sculpture_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == "stele") {
						setPoiMarker("Memorial Stele", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == "stone") {
						setPoiMarker("Memorial Stone", stone_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else if (el.tags.memorial == "bust") {
						setPoiMarker("Memorial Bust", bust_icon, el.lat, el.lon, el.tags, el.id, el.type);
					} else {
						setPoiMarker("Memorial", memorial_icon, el.lat, el.lon, el.tags, el.id, el.type);
					}
				} else {
					setPoiMarker("Unknown Type", artwork_icon, el.lat, el.lon, el.tags, el.id, el.type);
				}
			} else if (el.tags.artwork_type == "architecture") {
				setPoiMarker("Architecture", architecture_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "bust") {
				setPoiMarker("Bust", bust_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "graffiti") {
				setPoiMarker("Graffiti", graffiti_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "installation") {
				setPoiMarker("Installation", installation_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "mosaic") {
				setPoiMarker("Mosaic", mosaic_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "mural") {
				setPoiMarker("Mural", mural_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "painting") {
				setPoiMarker("Painting", painting_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "relief") {
				setPoiMarker("Relief", relief_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "sculpture") {
				setPoiMarker("Sculpture", sculpture_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "statue") {
				setPoiMarker("Statue", statue_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "stone") {
				setPoiMarker("Stone", stone_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else if (el.tags.artwork_type == "totem_pole") {
				setPoiMarker("Totem", totem_icon, el.lat, el.lon, el.tags, el.id, el.type);
			} else {
				setPoiMarker("Unknown Type", artwork_icon, el.lat, el.lon, el.tags, el.id, el.type);
			}
			
			
			if (el.tags.wikimedia_commons != undefined) {
				if (el.tags.wikimedia_commons.includes("File")) {
					setPoiMarker("", image_icon, el.lat, el.lon, el.tags, el.id, el.type);
					image_counter++;
				} else if (el.tags.wikimedia_commons.includes("Category")) {
					setPoiMarker("", image_icon, el.lat, el.lon, el.tags, el.id, el.type);
				} else {
					setPoiMarker("", error_icon, el.lat, el.lon, el.tags, el.id, el.type);
					error_counter++;
				}
			} else if (el.tags.panoramax != undefined) {
				setPoiMarker("", panoramax_icon, el.lat, el.lon, el.tags, el.id, el.type);
				image_counter++;
			} else if (el.tags.mapillary != undefined) {
				if (el.tags.mapillary.includes("http")) {
					if (el.tags.mapillary.includes("//www.mapillary.com/map/im/")) {
						setPoiMarker("", mapillary_icon, el.lat, el.lon, el.tags, el.id, el.type);
						image_counter++;
					} else if (el.tags.mapillary.includes("//images.mapillary.com/")) {
						setPoiMarker("", mapillary_icon, el.lat, el.lon, el.tags, el.id, el.type);
						image_counter++;
					} else {
						setPoiMarker("", error_icon, el.lat, el.lon, el.tags, el.id, el.type);
						error_counter++;
					}
				} else {
					setPoiMarker("", mapillary_icon, el.lat, el.lon, el.tags, el.id, el.type);
					image_counter++;
				}
			} else if (el.tags.image != undefined) {
				if (el.tags.image.includes("//static.panoramio.com")) {
					setPoiMarker("", error_icon, el.lat, el.lon, el.tags, el.id, el.type);
					error_counter++;
				} else if (el.tags.image.toLowerCase().endsWith(".jpg") || el.tags.image.toLowerCase().endsWith(".jpeg") || el.tags.image.toLowerCase().endsWith(".png") || el.tags.image.toLowerCase().endsWith(".gif") || el.tags.image.toLowerCase().endsWith(".bmp")) {
					setPoiMarker("", image_icon, el.lat, el.lon, el.tags, el.id, el.type);
					image_counter++;
				} else {
					setPoiMarker("", error_icon, el.lat, el.lon, el.tags, el.id, el.type);
					error_counter++;
				}
			// } else {
				// setOutline("", outline_icon, el.lat, el.lon);
			}
		}
	});
	while (counter_div.hasChildNodes()) {
		counter_div.removeChild(counter_div.lastChild);
	}
	var new_span = document.createElement('span');
	new_span.innerHTML = "Loaded "+counter+" features";
	if (counter != 0) {
		// if (image_counter != 0) {
		// 	var image_percent = ' ('+(image_counter/counter*100).toFixed(1)+'%)';
		// } else {
		// 	var image_percent = '';
		// }
		// if (error_counter != 0) {
		// 	var error_percent = ' ('+(error_counter/counter*100).toFixed(1)+'%)';
		// } else {
		// 	var error_percent = '';
		// }
		// new_span.innerHTML += ", "+image_counter+" with images"+image_percent+", "+error_counter+" with tagging errors"+error_percent;
	} else {
		new_span.innerHTML += "; if there should be art here, consider <a href='https://www.openstreetmap.org' target='_blank'>adding it</a>.";
	}
	counter_div.appendChild(new_span);
	
	// legend.addTo(map);
	map.removeLayer(loadingOverlay);
	loadingText.setContent('');
}

function dlObjects() {
	if (map.getZoom() < 14) {
		var i;
		var blink = document.getElementsByClassName('overlayText');
		for(i = 0; i < blink.length; i++) {
			blink[i].style.animation = 'blinker 2s linear';
		}
		// while (counter_div.hasChildNodes()) {
		// 	counter_div.removeChild(counter_div.lastChild);
		// }
		// var new_span = document.createElement('span');
		// new_span.innerText = "Please Zoom In";
		// counter_div.appendChild(new_span);
		return null;
	}

	document.getElementById('tipRight').style.display = 'none';
	document.getElementById('arrow').style.display = 'none';

	// while (counter_div.hasChildNodes()) {
	// 	counter_div.removeChild(counter_div.lastChild);
	// }

	map.addLayer(loadingOverlay);
	loadingText.setContent('Loading<img src="loading.gif">');

	// var new_span = document.createElement('span');
	// new_span.innerText = "Loading...";
	// counter_div.appendChild(new_span);

	bbox = map.getBounds().getSouth() + "," + map.getBounds().getWest() + "," + map.getBounds().getNorth() +  "," + map.getBounds().getEast();

	localStorage.setItem("pos_lat", map.getCenter().lat)
	localStorage.setItem("pos_lon", map.getCenter().lng)
	$.ajax({
		url: "https://z.overpass-api.de/api/interpreter",
		data: {
			"data": '[bbox:'+bbox+'][out:json][timeout:25];(nwr[tourism=artwork];nwr[memorial=sculpture];nwr[memorial=statue];nwr[memorial=bust];);out body center;'/*nwr[historic=memorial];*/
		},
		success: element_to_map
	});

	if (map.hasLayer(bboxOutline)) {
		map.removeLayer(bboxOutline);	
	}
}


function go_to_current_pos() {
	navigator.geolocation.getCurrentPosition(function(pos) {
		map.setView([pos.coords.latitude, pos.coords.longitude], 14);
	});
}


$(function() {
	// outline_icon = L.icon({
	// 	iconUrl: 'outline.svg',
	// 	iconSize: [26,26],
	// 	iconAnchor: [13,13],
	// });
	error_icon = L.icon({
		iconUrl: 'icons/error.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
		className: 'imageIcon',
	});
	// wiki_icon = L.icon({
	// 	iconUrl: 'wiki.svg',
	// 	iconSize: [26,26],
	// 	iconAnchor: [13,13],
	// });
	image_icon = L.icon({
		iconUrl: 'icons/image.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
		className: 'imageIcon',
	});
	mapillary_icon = L.icon({
		iconUrl: 'icons/mapillary.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
		className: 'imageIcon',
	});
	panoramax_icon = L.icon({
		iconUrl: 'icons/panoramax.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
		className: 'imageIcon',
	});
	artwork_icon = L.icon({
		iconUrl: 'icons/unknown2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	architecture_icon = L.icon({
		iconUrl: 'icons/architecture2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	bust_icon = L.icon({
		iconUrl: 'icons/bust2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	graffiti_icon = L.icon({
		iconUrl: 'icons/graffiti2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	installation_icon = L.icon({
		iconUrl: 'icons/installation2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	memorial_icon = L.icon({
		iconUrl: 'icons/memorial2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	mosaic_icon = L.icon({
		iconUrl: 'icons/mosaic2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	mural_icon = L.icon({
		iconUrl: 'icons/mural2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	painting_icon = L.icon({
		iconUrl: 'icons/painting2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	relief_icon = L.icon({
		iconUrl: 'icons/relief2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	sculpture_icon = L.icon({
		iconUrl: 'icons/sculpture2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	statue_icon = L.icon({
		iconUrl: 'icons/statue2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	stone_icon = L.icon({
		iconUrl: 'icons/stone2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});
	totem_icon = L.icon({
		iconUrl: 'icons/totem2.svg',
		iconSize: [26,26],
		iconAnchor: [13,13],
		popupAnchor: [0,-24],
	});

	map.on('moveend', function () {
		if (map.getZoom() >= 18) {
			josmText.setContent('<a href="http://localhost:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit loaded area in JOSM</a> |');
		}
		if (map.getZoom() < 18) {
			josmText.setContent('');
		}
	});

	map.on('zoomend', function () {
		if (map.getZoom() >= 18) {
			josmText.setContent('<a href="http://localhost:8111/load_and_zoom?left='+map.getBounds().getWest()+'&right='+map.getBounds().getEast()+'&top='+map.getBounds().getNorth()+'&bottom='+map.getBounds().getSouth()+'" target=\"\_blank\">Edit loaded area in JOSM</a> |');
		}
		if (map.getZoom() < 18) {
			josmText.setContent('');
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

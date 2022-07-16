window.onload = function () { 
	// var overlay = new L.LayerGroup();

//Map Setup
	var bounds = [[38.312, -82.61719], [38.5046, -82.25945]];
	var map = new L.map('mapid', {
		maxZoom: 17,
		minZoom: 5,
		maxBounds: bounds,
		zoomControl: false,
		// crs: L.CRS.Simple
	});

	map.fitBounds(bounds);

	var Mapnik=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		maxZoom:19,
		attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	});

	var tiles = L.tileLayer('tilesjpg/{z}/{x}/{y}.jpg', {
		attribution: 'Data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors<br>Map &copy; 2018 Peter Koby | Updated 2020-03-03 | <a href="info.html" target="_blank">Map info</a>',
		detectRetina: true,
	}).addTo(map);

	var tilesKent = L.tileLayer('tilesKent/{z}/{x}/{y}.jpg', {
		// attribution: 'Map &copy; 2018 Peter Koby | Data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors| <a href="info.html" target="_blank">Map info</a>'
		detectRetina: true,
	});

	var tilesBmore = L.tileLayer('tilesBmore/{z}/{x}/{y}.jpg', {
		// attribution: 'Map &copy; 2018 Peter Koby | Data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors| <a href="info.html" target="_blank">Map info</a>'
		detectRetina: true,
	});

	// var cyclingRoutes=new L.LayerGroup();
	var overlay=new L.LayerGroup();
	var infoBoxes=new L.LayerGroup();
	// var highlight=new L.LayerGroup();
	var POIs =new L.LayerGroup().addTo(map);

	var lc = L.control.locate({inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'inView'}).addTo(map);

	L.control.scale().addTo(map);

	var hash = new L.Hash(map);

//POI Layer

	// var divicon = L.divIcon({className: 'iconsdiv', iconSize: null });
	// var divLayer = L.geoJson(pointsJson,{icon:divicon}).addTo(map);

	function getClassName(x) {
		switch(x) {
			case "bicycle_parking":
				return 'bicycle_parking';
				break;
			case "bicycle_shop":
				return 'bicycle_shop';
				break;
			case "cafe":
				return 'cafe';
				break;
			case "convenience":
				return 'convenience';
				break;
			case "drinking_water":
				return 'drinking_water';
				break;
			case "greengrocer":
				return 'convenience';
				break;
			case "supermarket":
				return 'supermarket';
				break;
			// case "bar":
			// 	return 'bar';
			// 	break;
			// case "pub":
			// 	return 'bar';
			// 	break;
	}};

	function getTag(feature) {
		if (feature === undefined) {
			return "unknown";
		} else {
			return feature;
		}
	};

	var setDivIcon = function(feature) {
		return {
			className: getClassName(feature.properties.category),
			iconSize: null,
			tooltipAnchor: [10,0],
			// iconAnchor: [8,8],
		};
	}

	var shops = L.geoJSON(pointsJson, {
		pointToLayer: function(feature, latlng) {
			switch(feature.properties.category) {
				// case "bicycle_parking":
				// 	return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>Bike Rack</strong><br>Capacity: '+getTag(feature.properties.capacity));
				// 	break;
				case "bicycle_shop":
					return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>'+getTag(feature.properties.name)/*+'</strong><br>Hours: '+getTag(feature.properties.opening_hours)*/);
					break;
				case "cafe":
					return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>'+getTag(feature.properties.name)/*+'</strong><br>Hours: '+getTag(feature.properties.opening_hours)*/);
					break;
				case "convenience":
					return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>'+getTag(feature.properties.name)/*+'</strong><br>Hours: '+getTag(feature.properties.opening_hours)*/);
					break;
				case "drinking_water":
					return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>'+feature.properties.title+'</strong>');
					break;
				case "greengrocer":
					return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>'+getTag(feature.properties.name)/*+'</strong><br>Hours: '+getTag(feature.properties.opening_hours)*/);
					break;
				case "supermarket":
					return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))}).bindTooltip('<strong>'+getTag(feature.properties.name)/*+'</strong><br>Hours: '+getTag(feature.properties.opening_hours)*/);
					break;
			}
		}
	}).addTo(POIs);

	// var damIcon = L.divIcon(setDivIcon(feature));

	

	// var points=L.geoJson(pointsJson,{className: 'iconsdiv', iconSize: null}).addTo(map);
	//END TEST
//Info Layer
	var infoIcon = L.icon({
		iconUrl: 'icons/info.png',
		shadowUrl: 'icons/infoshadow.png',

		iconSize:	 [20,20], // size of the icon
		shadowSize:	[40,40], // size of the shadow
		iconAnchor:	[10,10], // point of the icon which will correspond to marker's location
		shadowAnchor: [17,17],  // the same for the shadow
		popupAnchor:  [0,-8] // point from which the popup should open relative to the iconAnchor
	});

	function clickZoom(e) {
		map.setView(e.target.getLatLng(),16);
	}

	L.marker([38.3917,-82.302], {icon: infoIcon}).addTo(overlay).on('click', clickZoom);
	L.marker([38.416476, -82.486489], {icon: infoIcon}).addTo(overlay).on('click', clickZoom);

	L.popup({autoClose: false, closeOnClick: false, autoPan: false}).setLatLng([38.416476, -82.486489]).setContent("This bridge is legally open to bicycles, but is not recommended! Try the 6th St. Bridge to the east.").addTo(infoBoxes);
	L.popup({autoClose: false, closeOnClick: false, autoPan: false}).setLatLng([38.3917,-82.302]).setContent("Barboursville City Park trails are suitable for mountain bikes only.").addTo(infoBoxes);
	

	// map.fitBounds(bounds);

	// var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	// 	subdomains: 'abcd',
	// 	maxZoom: 19
	// });

	// var DarkMatter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	// 	subdomains: 'abcd',
	// 	maxZoom: 19
	// });

	// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);


	// function getColor(d){
	// 	return d=='relaxed'?'#2c7bb6'://63.03 980043
	// 	d=='moderate'?'#fdae61'://29.19 dd1c77
	// 	d=='cautious'?'#d7191c'://15.11 df65b0
	// 	d=='avoid'?'#f00':
	// 	d=='good'?'#a0a':
	// 	'#888';//f1eef6
	// }

	// function getRouteType(d){
	// 	return d=='main'?[0,0]://63.03 980043
	// 	d=='alt'?[4,4]://29.19 dd1c77
	// 	d=='connector'?[4,8]://15.11 df65b0
	// 	[0,0];//f1eef6
	// }

	// function styleRoutes(feature){
	// 	return{
	// 		color:'#0f7',
	// 		weight:10,
	// 		opacity:0.5,
	// 		// dashArray:getRouteType(feature.properties.routetype),
	// 		lineCap:'round',
	// 	};
	// }

	// function styleHighlight(feature){
	// 	return{
	// 		stroke:true,
	// 		color:getColor(feature.properties.param),
	// 		weight:3,
	// 		opacity:.7,
	// 		lineCap:'round',
	// 	};
	// }

	// function highlightFeature(layer){
	// 	layer.setStyle({
	// 		color:'#07f',
	// 		opacity:0.4,
	// 	});
	// }

	// function highlightSelection(layer){
	// 	layer.setStyle({
	// 		// color:"#05f",
	// 		opacity:0.6,
	// 	});
	// 	// info.update(layer.feature.properties);
	// 	if(!L.Browser.ie && !L.Browser.opera){
	// 		layer.bringToFront();
	// 	}
	// }
	
	// var highlightRoads=L.geoJson(bikeRoutes,{style:styleRoutes,smoothFactor:1.2}).addTo(map);

	// var route=L.geoJson(routes,{style:styleRoutes,onEachFeature:onEachFeature,smoothFactor:1.2})
	// .bindPopup(function (layer) {return layer.feature.properties.name+'<br/><a href="'+layer.feature.properties.dl+'.gpx">Download GPX</a>';})
		// .bindPopup(feature.properties.name+'<br/><a href="'+feature.properties.dl+'.gpx">Download GPX</a>',{sticky:true,className:'popupClass'})
		// .addTo(cyclingRoutes);

	// var selected = null;

	// function resetHighlight(layer){
	// 	if(selected==null||selected._leaflet_id!==layer._leaflet_id){
	// 		route.resetStyle(layer);
	// 	}
	// }

	// function selectLayer(layer){
	// 	if(selected!==null){
	// 		var previous=selected;
	// 	}
	// 	map.fitBounds(layer.getBounds());
	// 	highlightSelection(layer);
	// 	selected=layer;
	// 	if(previous){
	// 		resetHighlight(previous);
	// 	}
	// }

	// function onEachFeature(feature,layer){
	// 	layer.on({
	// 		'mouseover':function(e){
	// 			highlightFeature(e.target);
	// 			// layer.bindTooltip(feature.properties.name,{sticky:true,className:'popupClass'}).openTooltip();
	// 		},
	// 		'mouseout':function(e){
	// 			resetHighlight(e.target);
	// 		},
	// 		'click':function(e){
	// 			selectLayer(e.target);
	// 			layer.bindPopup('<strong>'+feature.properties.name+'</strong><br/>Distance: '+feature.properties.distance+' miles<br/>Direction: '+feature.properties.direction+'<br/>Download: <a href="'+feature.properties.dl+'.fit">FIT</a>, <a href="'+feature.properties.dl+'.tcx">TCX</a>, <a href="'+feature.properties.dl+'.gpx">GPX</a>',{sticky:true,className:'popupClass'}).openPopup();
	// 		}
	// 	});
	// }

	// function onEachHighlight(feature,layer){
	// 	layer.on({
	// 		'mouseover':function(e){
	// 			layer.bindTooltip(feature.properties.param,{sticky:true,className:'popupClass'}).openTooltip();
	// 		},
	// 	});
	// }
//Map Events
	document.getElementById('zoomin1').addEventListener('click', function () {
		map.zoomIn();
	});
	document.getElementById('zoomout1').addEventListener('click', function () {
		map.zoomOut();
	});
	// document.getElementById('zoomin2').addEventListener('click', function () {
	// 	map.zoomIn();
	// });
	// document.getElementById('zoomout2').addEventListener('click', function () {
	// 	map.zoomOut();
	// });
	document.getElementById('zoomin3').addEventListener('click', function () {
		map.zoomIn();
	});
	document.getElementById('zoomout3').addEventListener('click', function () {
		map.zoomOut();
	});


	// document.getElementById('highlight1').addEventListener('click', function () {
	// 	if (map.hasLayer(highlight)) {
	// 		map.removeLayer(highlight);
	// 	} else {
	// 		map.addLayer(highlight);
	// 	}
	// });
	// document.getElementById('highlight2').addEventListener('click', function () {
	// 	if (map.hasLayer(highlight)) {
	// 		map.removeLayer(highlight);
	// 	} else {
	// 		map.addLayer(highlight);
	// 	}
	// });
	
	var location = null;
	var state = null;

	function onLocationFound(e) {
		location=e.latlng;
		state="On";
	}

	document.getElementById('locate1').addEventListener('click', function () {
		if (location==null && state==null) {
			state="Started";
			lc.start();
			map.on('locationfound', onLocationFound);ike
		} else if (location==null && state=="Started") {
			lc.stop();
			state=null;
			// map.on('locationfound', onLocationFound);ike
		} else if (location!==null && map.getBounds().contains(location)) {
			lc.stop();
			location=null;
			state=null;
		} else {
			map.setView(location);
			state="On";
		}
	});
	// document.getElementById('locate2').addEventListener('click', function () {
	// 	if (location==null && state==null) {
	// 		state="Started";
	// 		lc.start();
	// 		map.on('locationfound', onLocationFound);ike
	// 	} else if (location==null && state=="Started") {
	// 		lc.stop();
	// 		state=null;
	// 		// map.on('locationfound', onLocationFound);ike
	// 	} else if (location!==null && map.getBounds().contains(location)) {
	// 		lc.stop();
	// 		location=null;
	// 		state=null;
	// 	} else {
	// 		map.setView(location);
	// 		state="On";
	// 	}
	// });
	document.getElementById('locate3').addEventListener('click', function () {
		if (location==null && state==null) {
			state="Started";
			lc.start();
			map.on('locationfound', onLocationFound);ike
		} else if (location==null && state=="Started") {
			lc.stop();
			state=null;
			// map.on('locationfound', onLocationFound);ike
		} else if (location!==null && map.getBounds().contains(location)) {
			lc.stop();
			location=null;
			state=null;
		} else {
			map.setView(location);
			state="On";
		}
	});


	// document.getElementById('cyclingRoutes').addEventListener('click', function () {
	// 	if (map.hasLayer(cyclingRoutes)) {
	// 		map.removeLayer(cyclingRoutes);
	// 	} else {
	// 		map.addLayer(cyclingRoutes);
	// 	}
	// });

	// document.getElementById('pois').addEventListener('click', function () {
	// 	if (map.hasLayer(POIs)) {
	// 		map.removeLayer(POIs);
	// 	} else {
	// 		map.addLayer(POIs);
	// 	}
	// });

	map.on('zoomend', function () {
		if (map.getZoom() >= 13) {
			map.addLayer(overlay);
		// }if (map.getZoom() >= 13) {
		// 	map.addLayer(POIs);
		}if (map.getZoom() < 13) {
			map.removeLayer(overlay);
		}if (map.getZoom() < 16) {
			map.removeLayer(infoBoxes);
		// }if (map.getZoom() == 12) {
			// map.removeLayer(POIs);
		}if (map.getZoom() >= 16) {
			map.addLayer(infoBoxes);
			// map.addLayer(POIs);
	 		$('#mapid .supermarket').css({'background-image':'url("icons/grocery.svg")','width':'16px','height':'16px','background-size':'16px 16px','margin-left':'-16px','margin-top':'-16px','padding':'8px'});
	 		$('#mapid .convenience').css({'background-image':'url("icons/convenience.svg")','width':'16px','height':'16px','background-size':'16px 16px','margin-left':'-16px','margin-top':'-16px','padding':'8px'});
	 		$('#mapid .cafe').css({'background-image':'url("icons/cafe.svg")','width':'16px','height':'16px','background-size':'16px 16px','margin-left':'-16px','margin-top':'-16px','padding':'8px'});
	 		$('#mapid .drinking_water').css({'background-image':'url("icons/water.svg")','width':'12px','height':'12px','background-size':'12px 12px','margin-left':'-12px','margin-top':'-12px','padding':'5px'});
	 		// $('#mapid .bar').css({'background-image':'url("icons/beer.svg")','width':'16px','height':'16px','background-size':'16px 16px','margin-left':'-16px','margin-top':'-16px','padding':'8px'});
	 		$('#mapid .bicycle_shop').css({'background-image':'url("icons/gear.svg")','width':'20px','height':'20px','background-size':'20px 20px','margin-left':'-20px','margin-top':'-20px','padding':'8px'});
		}if (map.getZoom() == 15) {
			// map.addLayer(POIs);
	 		$('#mapid .supermarket').css({'background-image':'url("icons/grocery.svg")','width':'14px','height':'14px','background-size':'14px 14px','margin-left':'-14px','margin-top':'-14px','padding':'7px'});
	 		$('#mapid .convenience').css({'background-image':'url("icons/convenience.svg")','width':'14px','height':'14px','background-size':'14px 14px','margin-left':'-14px','margin-top':'-14px','padding':'7px'});
	 		$('#mapid .cafe').css({'background-image':'url("icons/cafe.svg")','width':'14px','height':'14px','background-size':'14px 14px','margin-left':'-14px','margin-top':'-14px','padding':'7px'});
	 		$('#mapid .drinking_water').css({'background-image':'url("icons/water.svg")','width':'10px','height':'10px','background-size':'10px 10px','margin-left':'-10px','margin-top':'-10px','padding':'4px'});
	 		// $('#mapid .bar').css({'background-image':'url("icons/beer.svg")','width':'14px','height':'14px','background-size':'14px 14px','margin-left':'-14px','margin-top':'-14px','padding':'7px'});
	 		$('#mapid .bicycle_shop').css({'background-image':'url("icons/gear.svg")','width':'16px','height':'16px','background-size':'16px 16px','margin-left':'-16px','margin-top':'-16px','padding':'7px'});
		}if (map.getZoom() == 14) {
			// map.addLayer(POIs);
	 		$('#mapid .supermarket').css({'background-image':'url("icons/circle_purple.svg")','width':'7px','height':'7px','background-size':'7px 7px','margin-left':'-7px','margin-top':'-7px','padding':'3px'});
	 		$('#mapid .convenience').css({'background-image':'url("icons/circle_purple.svg")','width':'7px','height':'7px','background-size':'7px 7px','margin-left':'-7px','margin-top':'-7px','padding':'3px'});
	 		$('#mapid .cafe').css({'background-image':'url("icons/circle_orange.svg")','width':'7px','height':'7px','background-size':'7px 7px','margin-left':'-7px','margin-top':'-7px','padding':'3px'});
	 		$('#mapid .drinking_water').css({'background-image':'url("icons/circle_blue.svg")','width':'6px','height':'6px','background-size':'6px 6px','margin-left':'-6px','margin-top':'-6px','padding':'3px'});
	 		// $('#mapid .bar').css({'background-image':'url("icons/circle_orange.svg")','width':'7px','height':'7px','background-size':'7px 7px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
	 		$('#mapid .bicycle_shop').css({'background-image':'url("icons/diamond_green.svg")','width':'8px','height':'8px','background-size':'8px 8px','margin-left':'-8px','margin-top':'-8px','padding':'3px'});
		}if (map.getZoom() <= 13) {
			// map.addLayer(POIs);
	 		$('#mapid .supermarket').css({'background-image':'url("icons/circle_purple.svg")','width':'5px','height':'5px','background-size':'5px 5px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
	 		$('#mapid .convenience').css({'background-image':'url("icons/circle_purple.svg")','width':'5px','height':'5px','background-size':'5px 5px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
	 		$('#mapid .cafe').css({'background-image':'url("icons/circle_orange.svg")','width':'5px','height':'5px','background-size':'5px 5px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
	 		$('#mapid .drinking_water').css({'background-image':'url("icons/circle_blue.svg")','width':'5px','height':'5px','background-size':'5px 5px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
	 		// $('#mapid .bar').css({'background-image':'url("icons/circle_orange.svg")','width':'5px','height':'5px','background-size':'5px 5px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
	 		$('#mapid .bicycle_shop').css({'background-image':'url("icons/circle_green.svg")','width':'5px','height':'5px','background-size':'5px 5px','margin-left':'-7px','margin-top':'-7px','padding':'4px'});
		}
	});

	

	// // map.locate({setView: true, maxZoom: 16});
	// var popup=L.popup();

	// function onMapClick(e){
	// 	popup
	// 		.setLatLng(e.latlng)
	// 		.setContent(e.latlng.toString())
	// 		.openOn(map);
	// 	}
	// map.on('click',onMapClick);
};
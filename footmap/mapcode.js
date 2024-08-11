window.onload=function(){

/*-----------------------------------------Layers-----------------------------------------*/
//Base Layers
	var Mapnik=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:1,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	var DarkMatter=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;<a href="http://cartodb.com/attributions">CartoDB</a>',subdomains:'abcd',maxZoom:19});
	var NoMap=L.tileLayer('https://{s}.tile.no.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	
//Overlays
	var footLayer=new L.LayerGroup();
	var runsLayer=new L.LayerGroup();

//Initialize Map
	var map=new L.map('map',{
		center:[40.0390,-75.2122],
		zoom:16,
		zoomControl:false,
		maxBounds:[[90,-180],[90,180],[-90,180],[-90,-180]],
		layers:[DarkMatter,footLayer]
	});

	var hash=new L.Hash(map);
	var baseLayers={
		"Mapnik":Mapnik,
		"Dark":DarkMatter,
		"Blank":NoMap,
	};
	var groupedOverlays={
		"Overlays":{
			"Trodden Ways":footLayer,
			"Runs by Distance":runsLayer,
		}
	};
	var options={exclusiveGroups:["Overlays"]};

	map.createPane('fillPane');
	map.createPane('linePane');
	map.getPane('fillPane').style.zIndex = 400;
	map.getPane('linePane').style.zIndex = 500;

	new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
	var lc = L.control.locate({strings:{title:''}, position: 'topright', keepCurrentZoomLevel: true, clickBehavior: {inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'setView'}, locateOptions: {enableHighAccuracy: true}}).addTo(map);

/*-----------------------------------------Layer Content-----------------------------------------*/

	var timeFrame='2419200000';//Time in milliseconds, 15778800000 is 6 months, 777600000 is 9 days, 2419200000 is 28 days
	
	function getColorFeet(d) {
		var today = new Date();
		var date = new Date(d);
		var age = today-date;
		const scale = chroma.scale(['#605','#f30','#ff0']).mode('hsl').domain([timeFrame, 0]);
		if (d != null) {
			return scale(age).hex();
		}
	}

	function getColorCategory(d){
		return d=="Trail"?'#ca0':
		d=="Road"?'#ccc':
		'#0f0';
	}

	var distRange='6';
	function getColorDistance(d){
		// return d>=4?'#e66101'://63.03 980043
		// d>=3?'#fdb863'://29.19 dd1c77
		// d>=2?'#fee090'://15.11 df65b0
		// d>=1?'#b2abd2'://7.82 d7b5d8
		// '#5e3c99';//f1eef6
		const scale = chroma.scale('RdYlGn').domain([0,distRange]);
		if (d != null) {
			return scale(d).hex();
		}
	}


	function styleFeatureFeet(feature){
		if (feature.properties.trodden == 'older') {
			return {
				color:'#4d0046',
				weight:5,
				opacity:1,
				dashArray: '2,8',
				pane:'linePane',
			}
		} else if (feature.properties.trodden == 'filled') {
			return {
				weight:0,
				fillColor:'teal',
				fillOpacity:0.5,
				interactive:false,
				pane:'fillPane',
			}
		} else {
			return {
				color:getColorFeet(feature.properties.trodden),
				weight:5,
				opacity:1,
				pane:'linePane',
			}
		};
	}

	function styleFeatureRuns(feature){
		if (feature.properties.notes == 'race') {
			return {
				color:'#ff0',
				weight:3,
				opacity:1,
				pane:'linePane',
			}
		} else {
			return {
				color:getColorDistance(feature.properties.distance),
				weight:1.5,
				opacity:1,
				pane:'linePane',
			};
		}
	}

	function highlightFeature(layer){
		if (layer.feature.geometry.type != "Point") {
			layer.setStyle({
				weight:7,
				color: "#fff",
			});
		}
	}

	function highlightSelection(layer){
		if(!L.Browser.ie && !L.Browser.opera){
			layer.bringToFront();
		}
	}

	var homeIcon = L.icon({
	    iconSize: [15, 15],
		iconAnchor: [8, 8],
		iconUrl: 'home_icon.svg',
	});

	var feet=L.geoJson(foot,{
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: homeIcon,
				minZoom: 16,
			});
		},
	    style:styleFeatureFeet,onEachFeature:onEachFeatureFeet,smoothFactor:2
	}).addTo(footLayer);

	var runs=L.geoJson(runsAll,{
	    style:styleFeatureRuns,onEachFeature:onEachFeatureRuns,smoothFactor:1.5
	}).addTo(runsLayer);

	var selectedFeet=null
	var selectedRuns=null;

	function resetHighlightFeet(layer){
		if(selectedFeet==null||selectedFeet._leaflet_id!==layer._leaflet_id){
			feet.resetStyle(layer);
		}
	}

	function resetHighlightRuns(layer){
		if(selectedRuns==null||selectedRuns._leaflet_id!==layer._leaflet_id){
			runs.resetStyle(layer);
		}
	}

	function onEachFeatureFeet(feature,layer){
		if (layer.feature.geometry.type != "Point") {
			layer.on({
				'mouseover':function(e){
					highlightFeature(e.target);
					if (feature.properties.trodden != 'filled') {
						layer.bindTooltip('Type: '+feature.properties.highway+'</br>Visited: '+feature.properties.trodden,{sticky:true,className:'popupClass'}).openTooltip();
					}
				},
				'mouseout':function(e){
					resetHighlightFeet(e.target);
				},
				'click':function(e){
					map.fitBounds(layer.getBounds());
				}
			});
		}
	}

	function onEachFeatureRuns(feature,layer){
		layer.on({
			'mouseover':function(e){
				highlightFeature(e.target);
				layer.bindTooltip('Date: '+feature.properties.date+'</br>Distance: '+feature.properties.distance,{sticky:true,className:'popupClass'}).openTooltip();
			},
			'mouseout':function(e){
				resetHighlightRuns(e.target);
			},
			'click':function(e){
				map.fitBounds(layer.getBounds());
			}
		});
	}

/*-----------------------------------------Controls-----------------------------------------*/
	// var layerControl=new L.control.layers(baseLayers,groupedOverlays).addTo(map);
	var layerControl=new L.control.groupedLayers(baseLayers,groupedOverlays,options).addTo(map);

	// L.control.scale().addTo(map);
	var feetLegend=L.control({position:'bottomleft'});
	var runLegend=L.control({position:'bottomleft'});

	feetLegend.onAdd=function(map){
		var today = new Date();
		var ninth = (timeFrame/9);
		var oldest = new Date(today-timeFrame);
		var oldstr = ("00" + (oldest.getMonth() + 1)).slice(-2) + "/" + ("00" + oldest.getDate()).slice(-2);
		var earlyseg = new Date(today-(ninth));
		var div=L.DomUtil.create('div','info legend'),
			grades=[today,today-(ninth+1),today-(ninth*2+1),today-(ninth*3+1),today-(ninth*4+1),today-(ninth*5+1),today-(ninth*6+1),today-(ninth*7+1),today-(ninth*8+1),today-(ninth*9+1)],
			labels=["Now"," "," "," "," "," "," "," "," ","<"+oldstr,""];
		for (var i=0; i<grades.length; i++){
			div.innerHTML+='<i style="background:'+getColorFeet(grades[i])+'"></i>'+(labels[i]?labels[i]+'<br>':'');
		}	
		return div;
	};

	runLegend.onAdd=function(map){
		var div=L.DomUtil.create('div','info legend'),
			grades=[0,(distRange/9),(distRange/9)*2,(distRange/9)*3,(distRange/9)*4,(distRange/9)*5,(distRange/9)*6,(distRange/9)*7,(distRange/9)*8,distRange],
			labels=["0mi"," "," "," "," "," "," "," "," ",distRange+"mi"];
		for (var i=0; i<grades.length; i++){
			div.innerHTML+='<i style="background:'+getColorDistance(grades[i])+'"></i>'+(labels[i]?labels[i]+'<br>':'');
		}	
		return div;
	};

	feetLegend.addTo(map);

	map.on('overlayadd',function(eventLayer){
		if(eventLayer.name=="Runs by Distance"){
			runLegend.addTo(this);
		} else if(eventLayer.name=="Trodden Ways"){
			feetLegend.addTo(this);
		}
	});
	map.on('overlayremove',function(eventLayer){
		if(eventLayer.name=="Runs by Distance"){
			this.removeControl(runLegend);
		} else if(eventLayer.name=="Trodden Ways"){
			this.removeControl(feetLegend);
		}
	});
	// runLegend.addTo(map);
};
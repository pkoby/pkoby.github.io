window.onload=function(){

/*-----------------------------------------Layers-----------------------------------------*/
//Base Layers
	var Mapnik=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:1,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	var DarkMatter=L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;<a href="http://cartodb.com/attributions">CartoDB</a>',subdomains:'abcd',maxZoom:19});
	var NoMap=L.tileLayer('https://{s}.tile.no.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	
//Overlays
	var feetAll=new L.LayerGroup();

//Initialize Map
	var map=new L.map('map',{
		center:[40.0390,-75.2122],
		zoom:14,
		zoomControl:false,
		maxBounds:[[90,-180],[90,180],[-90,180],[-90,-180]],
		layers:[Mapnik,feetAll]
	});

	var hash=new L.Hash(map);
	var baseMaps={
		"Mapnik":Mapnik,
		"Dark":DarkMatter,
		"Blank":NoMap,
	};

	map.createPane('fillPane');
	map.createPane('linePane');
	map.getPane('fillPane').style.zIndex = 400;
	map.getPane('linePane').style.zIndex = 500;

	new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
	var lc = L.control.locate({position: 'topright', keepCurrentZoomLevel: true, initialZoomLevel: 17, clickBehavior: {inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'setView'}, locateOptions: {enableHighAccuracy: true}}).addTo(map);

/*-----------------------------------------Layer Content-----------------------------------------*/

	var timeFrame='2419200000';//Time in milliseconds, 15778800000 is 6 months, 777600000 is 9 days, 2419200000 is 28 days
	function getColorFeet(d) {
		var today = new Date();
		var date = new Date(d);
		var age = today-date;
		const scale = chroma.scale(['#404','#f30','#ff0']).mode('hsl').domain([timeFrame, 0]);
		if (d != null) {
			return scale(age).hex();
		}
	}

	function styleFeatureFeet(feature){
		if (feature.properties.trodden == 'older') {
			return{
				color:'#4d0046',
				weight:5,
				opacity:1,
				dashArray: '2,8',
				pane:'linePane',
			}
		} else if (feature.properties.trodden == 'filled') {
			return{
				weight:0,
				fillColor:'teal',
				fillOpacity:0.5,
				interactive:false,
				pane:'fillPane',
			}
		// } else if (feature.properties.informal == 'yes') {
		// 	return{
		// 		color:getColorFeet(feature.properties.trodden),
		// 		weight:5,
		// 		opacity:1,
		// 		dashArray: '2,7',
		// 		pane:'linePane',
		// 	}
		} else {
			return{
				color:getColorFeet(feature.properties.trodden),
				weight:5,
				opacity:1,
				pane:'linePane',
			}
		};
	}

	function highlightFeature(layer){
		layer.setStyle({
			weight:7,
			// opacity:1,
			color: "#cff",
		});
	}

	function highlightSelection(layer){
		if(!L.Browser.ie && !L.Browser.opera){
			layer.bringToFront();
		}
	}

	var feet=L.geoJson(foot,{style:styleFeatureFeet,onEachFeature:onEachFeatureFeet,smoothFactor:2}).addTo(feetAll);

	var selected=null;

	function resetHighlightFeet(layer){
		if(selected==null||selected._leaflet_id!==layer._leaflet_id){
			feet.resetStyle(layer);
		}
	}

	function selectLayerFeet(layer){
		if(selected!==null){
			var previous=selected;
		}
		map.fitBounds(layer.getBounds());
		highlightSelection(layer);
		selected=layer;
		if(previous){
			resetHighlightFeet(previous);
		}
	}

	function onEachFeatureFeet(feature,layer){
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
				selectLayerFeet(e.target);
			}
		});
	}

/*-----------------------------------------Controls-----------------------------------------*/
	var layerControl=new L.control.layers(baseMaps);

	// L.control.scale().addTo(map);
	var feetLegend=L.control({position:'bottomleft'});

	feetLegend.onAdd=function(map){
		var today = new Date();
		var ninth = (timeFrame/9)
		var earliestsegment = today-(ninth);
		var oldest = today-timeFrame;
		oldest = new Date(oldest)
		var oldstr = '';
		oldstr += 
			// oldest.getFullYear() + "-" + 
		    ("00" + (oldest.getMonth() + 1)).slice(-2) + "/" + 
		    ("00" + oldest.getDate()).slice(-2)
		earliestsegment = new Date(earliestsegment)
		var sixstr = '';
		sixstr += 
			// earliestsegment.getFullYear() + "-" + 
		    ("00" + (earliestsegment.getMonth() + 1)).slice(-2) + "/" + 
		    ("00" + earliestsegment.getDate()).slice(-2)

		var div=L.DomUtil.create('div','info legend'),
			grades=[today,today-(ninth+1),today-(ninth*2+1),today-(ninth*3+1),today-(ninth*4+1),today-(ninth*5+1),today-(ninth*6+1),today-(ninth*7+1),today-(ninth*8+1),today-(ninth*9+1)],
			labels=[sixstr+"&ndash;Now"," "," "," "," "," "," "," "," ","Pre "+oldstr,""];
		for(var i=0;i<grades.length;i++){
			div.innerHTML+='<i style="background:'+getColorFeet(grades[i])+'"></i>'+(labels[i]?labels[i]+'<br>':'Other\/No Data');
		}	
		return div;
	};

	feetLegend.addTo(map);
	map.addControl(layerControl);

};
window.onload=function(){

/*-----------------------------------------Layers-----------------------------------------*/
//Base Layers
	var DarkMatterNoLabels=L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;<a href="http://cartodb.com/attributions">CartoDB</a>',subdomains:'abcd',maxZoom:19});
	var DarkMatterOnlyLabels=L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',{attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;<a href="http://cartodb.com/attributions">CartoDB</a>',subdomains:'abcd',maxZoom:19});
	var Mapnik=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:0.4,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	var NoMap=L.tileLayer('https://{s}.tile.no.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
	
//Overlays
	var feetAll=new L.LayerGroup();

//Initialize Map
	var map=new L.map('map',{
		center:[40.0331,-75.2122],
		zoom:14,
		zoomControl:false,
		maxBounds:[[90,-180],[90,180],[-90,180],[-90,-180]],
		layers:[DarkMatterNoLabels,feetAll]
	});

	var hash=new L.Hash(map);
	var baseLayers={
		"Dark Matter":DarkMatterNoLabels,
		"Mapnik":Mapnik,
		"Blank":NoMap,
		};
	var groupedOverlays={
		"":{
			// "Map Labels":DarkMatterOnlyLabels,
		},
		// "Categories":{
			// "Foot Activities":feetAll,
		// }
	};
	var options={exclusiveGroups:["Categories"]};

/*-----------------------------------------Layer Content-----------------------------------------*/

	var timeFrame='777600000';//Time in milliseconds, 15778800000 is 6 months, 777600000 is 9 days, 2419200000 is 28 days
	function getColorFeet(d) {
		var today = new Date();
		var date = new Date(d);
		var age = today-date;
		const scale = chroma.scale(['#4d0046','#b01a00','#fdf600']).domain([timeFrame, 0]);
		if (d != null) {
			return scale(age).hex();
		}
	}

	function styleFeatureFeet(feature){
		if (feature.properties.walkeddate != 'older') {
			return{
				color:getColorFeet(feature.properties.walkeddate),
				weight:5,
				opacity:1,
			}
		} else {
			return{
				color:'#4d0046',
				weight:5,
				opacity:1,
				dashArray: '2,8',
			}
		};
	}

	function highlightFeature(layer){
		layer.setStyle({
			// weight:5,
			// opacity:1,
			color: "#fff",
		});
	}

	function highlightSelection(layer){
		// layer.setStyle({
			// color:"#05f",
			// weight:10,
			// opacity:1,
		// });
		// info.update(layer.feature.properties);
		if(!L.Browser.ie && !L.Browser.opera){
			layer.bringToFront();
		}
	}

	var feet=L.geoJson(walks,{style:styleFeatureFeet,onEachFeature:onEachFeatureFeet,smoothFactor:2}).addTo(feetAll);

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
				layer.bindTooltip(feature.properties.name+':</br>'+feature.properties.highway+'</br>'+feature.properties.walkeddate,{sticky:true,className:'popupClass'}).openTooltip();
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
	var layerControl=new L.control.groupedLayers(baseLayers,groupedOverlays,options);

	L.control.scale().addTo(map);
	var feetLegend=L.control({position:'bottomright'});

	feetLegend.onAdd=function(map){
		var today = new Date();
		var ninth = (timeFrame/9)
		var earliestsegment = today-(ninth);
		var oldest = today-timeFrame;
		oldest = new Date(oldest)
		var oldstr = '';
		oldstr += 
			oldest.getFullYear() + "-" + 
		    ("00" + (oldest.getMonth() + 1)).slice(-2) + "-" + 
		    ("00" + oldest.getDate()).slice(-2)
		earliestsegment = new Date(earliestsegment)
		var sixstr = '';
		sixstr += 
			earliestsegment.getFullYear() + "-" + 
		    ("00" + (earliestsegment.getMonth() + 1)).slice(-2) + "-" + 
		    ("00" + earliestsegment.getDate()).slice(-2)


		var div=L.DomUtil.create('div','info legend'),
			grades=[today,today-(ninth+1),today-(ninth*2+1),today-(ninth*3+1),today-(ninth*4+1),today-(ninth*5+1),today-(ninth*6+1),today-(ninth*7+1),today-(ninth*8+1),today-(ninth*9+1)],
			labels=[sixstr+"&ndash;Today"," "," "," ",/*"<font color=\"#666\" size=\"1\">2 Month</font>"*/" ",/*"<font color=\"#666\" size=\"1\">increments</font>"*/" "," "," "," ","Before "+oldstr,""];
		for(var i=0;i<grades.length;i++){
			div.innerHTML+='<i style="background:'+getColorFeet(grades[i])+'"></i>'+(labels[i]?labels[i]+'<br>':'Other\/No Data');
		}	
		return div;
	};

	feetLegend.addTo(map);
	map.addControl(layerControl);

};
$JSKK.Class.create
(
	{
		$namespace:	'gopher',
		$name:		'Map'
	}
)
(
	{
		
	},
	{
		map: null,
		operatorsCoordinates: 
		[
			[101.675948,3.118514],
			[101.688136,3.133855],
			[101.672000,3.136769],
			[101.661235,3.151472],
			[101.710931,3.144016],
			[101.705567,3.156057],
			[101.717883,3.156271],
			[101.751915,3.160042],
			[101.751915,3.160042],
			[101.635701,3.048455]
		],
		
		init: function(userCoordinates)
		{
			$(window).on('resize',this.updateMapSize.bind(this));
			if(Object.isUndefined(userCoordinates))
			{
				userCoordinates= [101.674954, 3.124158];	
			}
			var tileLayer = new ol.layer.Tile
			(
				{
					source: new ol.source.XYZ
					(
						{
							url:			'http://maptile.maps.svc.ovi.com/maptiler/maptile/newest/normal.day/{z}/{x}/{y}/256/png8',
							crossOrigin:	'anonymous'
						}
					)
				}
			);
			var userStyle = new ol.style.Style
			(
				{
					image: new ol.style.Icon
					(
						{
							src: 'theme/images/marker-user.png',
							anchor: [0.5, 1],
							anchorXUnits: 'fraction',
							anchorYUnits: 'fraction',
						}
					),
					zIndex: 10000
				}
			);
			var operatorStyle = new ol.style.Style
			(
				{
					image: new ol.style.Icon
					(
						{
							src: 'theme/images/marker-operator.png',
							anchor: [0.5, 1],
							anchorXUnits: 'fraction',
							anchorYUnits: 'fraction',
						}
					),
					zIndex: 1000
				}
			);
			var markersSource = new ol.source.Vector();
			var markersLayer = new ol.layer.Vector
			(
				{
					source: markersSource
				}
			);
			var userMarker =new ol.Feature
			(
				{
					geometry: new ol.geom.Point
					(
						ol.proj.transform(userCoordinates, 'EPSG:4326', 'EPSG:3857')
					),
				}
			);
			var operators = [];
			for(var i= 0, j=this.operatorsCoordinates.length; i<j; i++)
			{
				operators[i] = new ol.Feature
				(
					{
						geometry: new ol.geom.Point
						(
							ol.proj.transform(this.operatorsCoordinates[i], 'EPSG:4326', 'EPSG:3857')
						)
					}
				);
				operators[i].setStyle(operatorStyle);
			}
			userMarker.setStyle(userStyle);
			markersSource.addFeature(userMarker);
			markersSource.addFeatures(operators);
			this.map = new ol.Map
			(
				{
					layers: 
					[
						tileLayer,
						markersLayer
					],
//					renderer: 	'webgl',
					target: document.getElementById('map'),
					view: new ol.View2D
					(
						{
							center: ol.proj.transform(userCoordinates, 'EPSG:4326', 'EPSG:3857'),
							zoom: 16,
							minZoom: 3,
							maxZoom: 18	
						}
					),
					controls: []
				}
			);
		},
		updateMapSize: function ()
		{
			var container	=document.getElementById('#map'),
				height		=$(window).height()-$('#header').height()-1;
			container.height(height);
			(function()
			{
				var width=$(window).width();
				container.width(width);
				this.map.setSize([width,height]);
			}.bind(this)).defer(100);
			return this;
		},
		bindEvents: function()
		{
			
		}
	}
);



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
		init: function(userCoordinates)
		{
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
			var userMarker =new ol.Feature
			(
				{
					geometry: new ol.geom.Point
					(
						ol.proj.transform(userCoordinates, 'EPSG:4326', 'EPSG:3857')
					),
				}
			);
			var userStyle = new ol.style.Style
			(
				{
					image: new ol.style.Icon
					(
						{
							src: 'theme/images/marker-user.png'
						}
					),
					zIndex: 10000
				}
			);
			userMarker.setStyle(userStyle);
			var markersSource = new ol.source.Vector
			(
				{
					features:[userMarker]		
				}
			);
			var markersLayer = new ol.layer.Vector
			(
				{
					source: markersSource
				}
			);
			var map = new ol.Map
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
		bindEvents: function()
		{
			
		}
	}
);



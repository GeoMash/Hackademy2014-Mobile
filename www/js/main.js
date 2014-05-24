console.debug('foo');
requirejs.config
(
	{
		waitSeconds:	10,
		baseUrl:		'',
		paths:
		{
			//RequireJS Plugins
			async:				'js/vendor/requirejs/plugins/async',
			
			//All other libs
			i18next:			'js/vendor/i18next',
			jquery:				'js/vendor/jquery',
			openlayers:			'js/vendor/openlayers',
			JSKK:				'js/vendor/jskk/jskk.1.1.0.min',
			fastclick:			'js/vendor/fastclick',
			momentjs:			'js/vendor/momentjs',
			here:				'http://js.api.here.com/se/2.5.3/jsl',
			
			gopher:				'gopher'
		},
		shim:
		{
			openLayers:
			{
				exports: 'OpenLayers'
			}
		}
	}
);

requirejs
(
	[
		'i18next/i18next',
		'jquery/jquery',
		'openlayers/ol',
		'JSKK',
		'fastclick/fastclick',
		'momentjs/moment'
	],
	function(i18n)
	{
		window.i18n=i18n;
		requirejs
		(
			[
				'jquery/mobile'
			],
			function()
			{
				$JSKK.require
				(
					'gopher.Application',
					function()
					{
						console.debug('ALL LOADED :D');
						window.$application=new gopher.Application();
					}
				);
			}
		);
	}
);
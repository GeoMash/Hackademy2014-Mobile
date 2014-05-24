$JSKK.Class.create
(
	{
		$namespace:	'gopher',
		$name:		'Application'
	}
)
(
	{
		
	},
	{
		init: function()
		{
			$(this.onReady.bind(this));
		},
		onReady: function()
		{
			this.bindEvents();
			$('[data-role="header"], [data-role="footer"]').toolbar({theme:'b'});
			$('[data-role="panel"]').panel().enhanceWithin();
			
			
			
		},
		bindEvents: function()
		{
			$(document).on
			(
				'swipeleft swiperight',
				function(event)
				{
					if ($('.ui-page-active').jqmData('panel')!=='open')
					{
						if (event.type==='swipeleft')
						{
							$('#navPanel').panel('open');
						}
//						else if (event.type==='swiperight')
//						{
//							$('#left-panel').panel('open');
//						}
					}
				}
			);
		}
	}
);
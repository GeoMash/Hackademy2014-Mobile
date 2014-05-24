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
			$('[data-role="header"], [data-role="footer"]').toolbar({theme:'b'});
			$('[data-role="panel"]').panel();
			
			
			$( document ).on
			(
				'swipeleft swiperight',
				'#demo-page',
				function(event)
				{
					if ($('.ui-page-active').jqmData('panel')!=='open')
					{
						if (e.type==='swipeleft')
						{
							$('#right-panel').panel('open');
						}
						else if (e.type==='swiperight')
						{
							$('#left-panel').panel('open');
						}
					}
				}
			);
		}
	}
);
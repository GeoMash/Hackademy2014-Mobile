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
			$("[data-role='header'], [data-role='footer']").toolbar({theme:'b'});
		}
	}
);
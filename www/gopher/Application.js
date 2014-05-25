$JSKK.Class.create
(
	{
		$namespace:	'gopher',
		$name:		'Application',
		$requires:
		[
			'gopher.Map'
		]
	}
)
(
	{
		USER_TYPE_STANDARD:	1,
		USER_TYPE_OPERATOR:	2
	},
	{
//		serverURL:	'http://hack.dev.lan/',
		serverURL:	'http://oklah.geomash.com/',
		stepCounter: 0,
		steps: [],
		map:		null,
		userType:	null,
		userId:		null,
		init: function()
		{
			$(this.onReady.bind(this));
		},
		onReady: function()
		{
			FastClick.attach(document.body);
			this.bindEvents();
			$('[data-role="header"], [data-role="footer"]').toolbar({theme:'b'});
			$('[data-role="panel"]').panel().enhanceWithin();
			
			
			$('[data-role="header"] [data-icon="plus"]').css('right','45px').hide();
			$('[data-role="header"] [data-icon]').css('top','12px').hide();
			
			if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition
				(
					function(position)	
					{
						this.map=new gopher.Map
						(
							[
								position.coords.longitude,
								position.coords.latitude
							]
						);
					},
					function()
					{
						this.map=new gopher.Map();
					}
				);
			}
			else
			{
				this.map=new gopher.Map();
			}
			if (navigator.splashscreen)
			{
				navigator.splashscreen.hide();
			}
			this.selectUserType();
//			this.initFacebook();
		},
		bindEvents: function()
		{
			$(document).on
			(
				'swipeleft swiperight',
				'[data-role="header"]',
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
			$('#andThen').on
			(
				'click',
				this.onAndThen.bind(this)
			);
			$.mobile.document.on('pagechange',this.onPageChange.bind(this));
			$('#finish').on
			(
				'click',
				this.createRequest.bind(this)
			);
			$('body').on
			(
				'click',
				'#remove',
				this.onRemove.bind(this)
			);
		},
		onRemove: function(event)
		{
			event.preventDefault();
			console.debug('#collapsible'+event.target.name);
			// $('#requestForm').removeChild(document.getElementById('collapsible'+event.target.name));
  			$('#task-wrapper'+event.target.name).remove();
			$( "#newRequest" ).popup( "reposition", "center" );	
		},
		onAndThen: function(event, close)
		{
			if(Object.isUndefined(close))
			{
				event.preventDefault();
			}
			var address = $(event.target.form[0]).val();
			var description = $(event.target.form[1]).val();
			var coordinates = [];

			$.get
			(
				"http://maps.google.com/maps/api/geocode/json?address="+address.replace(' ', '+')+"&sensor=false&region=my", 
				function(response)
				{
					console.debug(response);
					var results = 
					{
						address: response.results[0].formatted_address,
						coordinates: [response.results[0].geometry.location.lng, response.results[0].geometry.location.lat] 
					}
					if(Object.isString(results.address))
					{
						address=results.address;
					}
					coordinates = results.coordinates;
					this.steps[this.stepCounter] = 
					{	
						GeoJSON:
						{	
							geometry: 
							{
								type:'Point',
								coordinates: coordinates
							},
							properties:
							{
								address: address,
								instruction: description,
								status: 0
							}
						}
					}	
					$('#requestForm').append
					(
						[
							"<div id=\"task-wrapper",this.stepCounter,"\" class=\"ui-grid-a\">",
							"<div class=\"ui-block-a\"><div data-role=\"collapsible\" id=\"collapsible",this.stepCounter,"\" data-collapsed-icon=\"carat-d\" data-expanded-icon=\"carat-u\" data-inline=true>",
								"<h4>",address,"</h4>",
								"<p>",description,"</p>",
							"</div></div>",
							"<div class=\"ui-block-b\"><button id=\"remove\" name=",this.stepCounter," class=\"ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline\">remove</button></div>",
							"</div>"
						].join("")
					);
					$('#collapsible'+this.stepCounter ).collapsible({ collapsed: true });
					$('#description').val('');
					$('#location').val('');
					$( "#newRequest" ).popup( "reposition", "center" );
					this.stepCounter++;
				}.bind(this)
			);
			console.debug(this.steps);
		},
		getServerURL: function()
		{
			return this.serverURL;
		},
		createRequest: function(event)
		{
			this.onAndThen(event ,true);
			var task = 
			{
				user_id: this.getUserId(),
				steps: this.steps
			};
			$.post
			(
				this.getServerURL()+'task/add',
				task,
				function(response)
				{
					console.debug(response);
				}
			);
			$('#page').append
			(
				[
					"<div data-role=\"popup\" id=\"thankYou\" data-theme=\"a\" class=\"ui-corner-all\">",
						"<form>",
							"<div id=\"requestForm\" style=\"padding:10px 20px;\">",
								"<p>",
									"Your request has been assigned to:	Mohd Khairul.<br>",
									"He's driving a car with licence plate HWB54816.<br>",
									"His contacts are:<br>",
									"&nbrs;	phone number: +60 011 45897224<br>",
									"&nbrs;	e-mail		: mohdh.khairul@gmail.com<br>",
									"He will contact you shortly.",
								"</p>",
							"</div>",
						"</form>",
					"</div>"
				].join("")
			);
		},
		getUserId: function()
		{
			return this.userId;
		},
		selectUserType: function()
		{
			$('body').simpledialog2
			(
				{
					mode:		'button',
					headerText:	'Select User Type',
					buttons:
					{
						'Standard User':
						{
							icon: 'user',
							click: function()
							{
								this.setUserType(this.$reflect('self').USER_TYPE_STANDARD);
								this.userId='testUser1';
								$('#nav-payments').show();
							}.bind(this)
						},
						'Operator':
						{
							icon: 'navigation',
							click: function()
							{
								this.setUserType(this.$reflect('self').USER_TYPE_OPERATOR);
								this.userId='testUser2';
								$('#nav-payments').hide();
							}.bind(this)
						}
					}
				}
			);
		},
		setUserType: function(type)
		{
			this.userType=type;
			switch (type)
			{
				case this.$reflect('self').USER_TYPE_OPERATOR:
				{
					$('[data-role="header"] [data-icon="plus"]').hide();
					$('[data-role="header"] [data-icon="bars"]').show();
					
					break;
				}
				case this.$reflect('self').USER_TYPE_STANDARD:
				{
					$('[data-role="header"] [data-icon="plus"]').show();
					$('[data-role="header"] [data-icon="bars"]').show();
					break;
				}
			}
			return this;
		},
		
		onPageChange: function(event,info)
		{
			switch (info.toPage.attr('id'))
			{
				case 'page-notifications':
				{
					this.loadNotificaitons();
					break;
				}
				case 'page-tasks':
				{
					this.loadTasks();
					break;
				}
				case 'page-task-steps':
				{
					this.loadTaskSteps();
					break;
				}
			}
		},
		loadNotificaitons: function()
		{
			$.getJSON
			(
				this.getServerURL()+'notification/getByUserId/'+this.getUserId(),
				function(response)
				{
					if (response.success && Object.isArray(response.data))
					{
						var	container	=$('#page-notifications ul'),
							newRow		=null,
							record		=null;
						
						container.find('li:first .ui-li-count').html('Total: '+response.data.length);
						for (var i= 0,j=response.data.length; i<j; i++)
						{
							record=response.data[i];
							newRow=$
							(
								[
									'<li>',
										'<a href="#">',
											'<h3>',record.title,'</h3>',
											'<p><b>Description:</b> ',record.message,'</p>',
											'<p class="ui-li-aside">',(record.read?'Read':'Unread'),'</p>',
										'</a>',
									'</li>'
								].join('')
							);
							newRow.click
							(
								function(record,event)
								{
									event.preventDefault();
									$('body').simpledialog2
									(
										{
											mode:		'blank',
											headerText:	'Details',
											blankContent:
											[
												'<div role="main" class="ui-content">',
													'<p><b>Step:</b> ',record.type.record.steps[record.step].properties.instruction,'</p>',
													'<a rel="close" data-role="button" href="#">Close</a>',
												'</div>'
											].join('')
										}
									);
								}.bind(this,record)
							);
							container.append(newRow);
						}
						container.listview();
					}
				}
			);
		},
		loadTasks: function()
		{
			var userId=this.getUserId();
			$.getJSON
			(
				this.getServerURL()+'task/getByUserId/'+userId+'/'+(userId=='testUser1'?'requested':'assigned'),
				function(response)
				{
					if (response.success && Object.isArray(response.data))
					{
						var	container	=$('#page-tasks ul'),
							newRow		=null,
							record		=null;
						
						container.html('');
						for (var i= 0,j=response.data.length; i<j; i++)
						{
							record=response.data[i];
							newRow=$
							(
								[
									'<li>',
										'<a href="task-steps.html#',record._id.$id,'">',moment(record.timestamp_created.sec*1000).format('MMMM Do YYYY, h:mm:ss a'),'</a>',
									'</li>'
								].join('')
							);
							newRow.click
							(
								function(record,event)
								{
									this.activeTask=record._id.$id;
									$.mobile.navigate('task-steps.html');
								}.bind(this,record)
							);
							container.append(newRow);
						}
						container.listview();
					}
				}.bind(this)
			);
		},
		loadTaskSteps: function()
		{
			$.getJSON
			(
				this.getServerURL()+'task/getTaskSteps/'+this.activeTask,
				function(response)
				{
					if (response.success)
					{
						var	container	=$('#page-task-steps fieldset'),
							newRow		=null,
							record		=null,
							checked		='';
						
						container.html('');
						for (var i= 0,j=response.data.steps.length; i<j; i++)
						{
							record=response.data.steps[i];
							checked=(Number(record.properties.status)===0)?'':'checked';
							container.append('<input type="checkbox" value="'+i+'" id="task-step-'+i+'" '+checked+'>');
							container.append('<label for="task-step-'+i+'">'+record.properties.instruction+' ('+record.properties.address+')</label>');
							
//							newRow.click
//							(
//								function(record,event)
//								{
////									this.activeTask=record.id;
//								}.bind(this,record)
//							);
						}
						container.controlgroup();
						
						$('#page-task-steps fieldset input').change
						(
							function(event)
							{
								var target	=$(event.target),
									checked	=Number(target.is(':checked')),
									val		=target.val();
								$.getJSON
								(
									this.getServerURL()+'task/setStepStatus/'+this.activeTask+'/'+val+'/'+checked,
									function()
									{
										
									}.bind(this)
								);
							}.bind(this)
						)
					}
				}.bind(this)
			);
		},
		
		
		
		
		
		
		
		
		initFacebook: function()
		{
			FB.init
			(
				{
					appId: '586039824828057',
					nativeInterface: CDV.FB,
					useCachedDialogs: false
          		}
			);
			FB.getLoginStatus(this.handleStatusChange.bind(this));
		},
		handleStatusChange: function(session)
		{
			console.log('Got the user\'s session: ' + JSON.stringify(session));
    
			if (session.authResponse) {
				//document.body.className = 'connected';
				
				//Fetch user's id, name, and picture
				FB.api('/me', {
				  fields: 'name, picture'
				},
				function(response) {
				  if (!response.error) {
					document.body.className = 'connected';
		
					user = response;
					
					console.log('Got the user\'s name and picture: ' + JSON.stringify(response));
					
					//Update display of user name and picture
					if (document.getElementById('user-name')) {
					  document.getElementById('user-name').innerHTML = user.name;
					}
					if (document.getElementById('user-picture')) {
					  document.getElementById('user-picture').src = user.picture.data.url;
					}
				  } else {
					document.body.className = 'not_connected';
					console.log('Error getting user info: ' + JSON.stringify(response.error));
					// Check for errors due to app being unininstalled
					if (response.error.error_subcode && response.error.error_subcode == "458") {
					  setTimeout(function() {
						alert("The app was removed. Please log in again.");
					  }, 0);              
					}
					this.logout();         
				  }
				  
				});
			}
			else
			{
			  document.body.className = 'not_connected';
			
			}
		},
		authUser: function()
		{
			FB.Event.subscribe('auth.statusChange',this.handleStatusChange.bind(this));
		},
		logout: function()
		{
			FB.logout
			(
				function(response)
				{
					window.location.reload();
				}
			);
		}
		
	}
);
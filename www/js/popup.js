$(document).delegate('#simplestring', 'click', function() {
  $(this).simpledialog({
    'mode' : 'string',
    'prompt' : 'What do you say?',
      'User': {
        click: function () {
          $('#dialogoutput').text($('#dialoglink').attr('data-string'));
        }
      },
      'Operator': {
        click: function () { },
        icon: "delete",
        theme: "c"
      }
    }
  })
})
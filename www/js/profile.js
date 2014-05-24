$('#p2').on('pageshow', function () {
    setTimeout(function () {
        $('#about').popup('open', {
            transition: 'pop'
        });
    }, 1000);
});

setTimeout(function () {
    $(':mobile-pagecontainer').pagecontainer('change', '#p2', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
}, 1000);
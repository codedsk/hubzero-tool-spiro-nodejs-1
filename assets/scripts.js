/*
 * https://api.jquery.com/jquery.post/
 */

$(document).ready( function() {
    // attach a submit handler to the form
    $("#myForm").submit( function(event) {

        // stop form from submitting normally
        event.preventDefault();

        // get some values from elements on the page:
        var $form = $( this ),
            n1 = $form.find( "#n1" ).val(),
            n2 = $form.find( "#n2" ).val(),
            n3 = $form.find( "#n3" ).val(),
            url = $form.attr( "action" );

        // send the data using post
        var posting = $.post(url, { n1 : n1, n2 : n2, n3 : n3 });

        // put the results in a div
        posting.done(function(data,status) {
            console.log("status : " + status);
            console.log("data : " + data);
            console.log("data : " + JSON.stringify(data));
            $( "#spirograph_js" ).empty().innerHTML = data

            //var content = $( data ).find( "#content" );
            //console.log("content : " + content);
            // $( "#spirograph_js" ).empty().append(content)
        });
    });
});

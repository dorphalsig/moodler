"use strict";
if (window.jQuery) {
    $(function(){
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/gojs/1.7.8/go-debug.js", function () {
            $.getScript("src/templates/templates.js");
            $.getScript("src/moodler/moodler.js", function () {
                moodler.init();
                $.getScript("src/test.js");
            });
        });
    })
}
else
    console.log("No jquery present!");
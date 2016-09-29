/**
 * Created by rajendr on 02/09/16.
 */
require.config({
        paths: {
            "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min",
               "underscore": "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min",
            },
});

    //require(["app"]); .// this is unnecessary dupllicate require app call

    require(["jquery", "app"], function($, App) {
           $(document).ready(function () {
                    window.app = new App();
                  app.init();
               });
        });
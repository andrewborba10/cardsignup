/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        //window.location="login.html";
        //$.mobile.changePage('#card_details');
    }
};

/* Attach FastClick to the buttons on the page when it's initialized. */
$(function() {
    FastClick.attach(document.body);
});

/* Load content for gallery page (categories) */
$('#gallery').on('pageinit', function() {
    // Append the categories to the DOM in the collapsible set and tell jquery to apply the correct behavior
    $.getJSON("categories.json", function(data) {
        $.each(data, function(key, val) {
            var collapsibleContent = "<div data-role=\"collapsible\" data-collapsed=\"true\" id=\"category" + val.id + "\" class=\"dynamicCategory\"><h3>" + val.name + "</h3><div id=\"gallery-wrapper" + val.id + "\" class=\"gallery-wrapper\"><div class=\"gallery-scroller\"><ul>";
            for (var i = 0; i < 1; i++) {
                collapsibleContent += "<li><a href=\"#card_details\" data-role=\"button\" data-transition=\"slide\"><img src=\"img/card_template.png\"></a></li>";
            }
            collapsibleContent += "</ul></div></div></div>";
            $("#categories").append(collapsibleContent);

            new IScroll("#gallery-wrapper" + val.id, { scrollX: true, scrollY: false });
        });
        $(".dynamicCategory").trigger("create"); // Apply themes and probably various other jquery stuff
        $(".dynamicCategory").collapsible();
    });
    $("#categories").collapsibleset("refresh");
});

/* Instantiate static scroller */
/* This has to be instantiated on pageshow while the dynamic content can be instantiated earlier right after it's appended to the DOM (why?) */
$('#gallery').on('pageshow', function() {
    new IScroll("#rec-gallery-wrapper", { scrollX: true, scrollY: false });
});

/* Initialize flex slider */
$('#card_details').on('pageshow', function() {
    // The slider being synced must be initialized first
    $('#carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 100,
        itemMargin: 5,
        minItems: 3,
        asNavFor: '#slider'
    });

    $('#slider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#carousel"
    });
});

$("#order_form").on("pageinit", function() {
    $.getJSON("signup.json", function(data) {
        console.log
        $("#theform").append(data['html']);
    });
});



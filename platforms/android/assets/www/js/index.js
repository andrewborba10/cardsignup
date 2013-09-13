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

/* Templates ready to be given context */
var campaign_template, story_template, order_template;

/* Category, selected campaign, and selected image global variables */
var selectedCategory, selectedCampaign, selectedImage;

/* Attach FastClick to the buttons on the page when it's initialized. */
$(function() {
    FastClick.attach(document.body);

    /* Compile templates */

    /* Campaign template */
    var campaign_source   = $("#campaign-template").html();
    campaign_template = Handlebars.compile(campaign_source);

    /* Story template */
    var story_source   = $("#story-template").html();
    story_template = Handlebars.compile(story_source);

    /* Order form template */
    var order_source   = $("#order-template").html();
    order_template = Handlebars.compile(order_source);
});

var categoriesJson;
var galleryJson = {};

$("#intro").on("pageinit", function() {
    console.log("loading all json...");
    $.getJSON("http://www.card.com/api/gallery/categories?callback=?", {format: "json" })
    .done(function(categoriesData) {
        console.log("done loading categories");
        categoriesJson = categoriesData;
        $.each(categoriesData, function(key, val) {
            $.getJSON("https://www.card.com/api/gallery?category=" + key + "&callback=?", {format: "json" })
            .done(function(galleryCategoryData) {
                console.log("loaded category gallery for cid " + key);
                galleryJson[key] = galleryCategoryData;
            });
        });
    });
});

/* Load content for gallery page (categories) */
$('#gallery').on('pageinit', function() {
    // Append the categories to the DOM in the collapsible set and tell jquery to apply the correct behavior
    $.each(categoriesJson, function(key, val) {
        var collapsibleContent = "<div data-role=\"collapsible\" data-collapsed=\"true\" id=\"category" + key + "\" class=\"dynamicCategory\"><h3>" + val.name + "</h3><div id=\"gallery-wrapper" + key + "\" class=\"gallery-wrapper\"><div class=\"gallery-scroller\"><ul>";

        $.each(galleryJson[key], function(key2, val2) {
            collapsibleContent += "<li><a href=\"#card_details\" data-role=\"button\" data-transition=\"slide\" class=\"cardButton\"><img src=\"" + val2.images[0].uri + "\" class=\"gallery-card\"><p class=\"card-title\">" + val2.title + "</p></a></li>";
        });

        collapsibleContent += "</ul></div></div></div>";
        $("#categories").append(collapsibleContent);

        new IScroll("#gallery-wrapper" + key, { scrollX: true, scrollY: false });
    });

    /* Listen for when a card is tapped so the card and category can be stored. */
    $(".cardButton").tap(function() {
        // TODO: Figure this out
        //console.log($(this).children()[0]);
    });

    $(".dynamicCategory").trigger("create"); // Apply themes and probably various other jquery stuff
    $(".dynamicCategory").collapsible(); // Turn the new content into collapsibles
    $("#categories").collapsibleset("refresh");
});

/* Instantiate static scroller */
/* This has to be instantiated on pageshow while the dt can be instantiated earlier right after it's appended to the DOM (why?) */
$('#gallery').on('pageshow', function() {
    new IScroll("#rec-gallery-wrapper", { scrollX: true, scrollY: false });
});

/* Give context to the templates and initialize flex slider */
$('#card_details').on('pageinit', function() {
    // Give context to the campaign and story templates (clear the old content if there is any first)
    $("#details-campaign").empty();
    $("#details-campaign").append(campaign_template({campaign: galleryJson[9][523].title}));

    $("#story").empty();
    $("#story").append(story_template({story: galleryJson[9][523].description}));

    /* Get the number of images that exist for this campaign */
    var numCards = galleryJson[9][523].images.length;

    /* Append all card images to the DOM */
    $.each(galleryJson[9][523].images, function(key, val) {
        $(".slides").append("<li><img src=\"" + val.uri + "\"></li>");
    });

    /* Create a multi-image card carousel */
    if (numCards > 1) {
        $("#option-carousel").show();

        // The slider being synced must be initialized first
        $('#option-carousel').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            itemWidth: 100,
            itemMargin: 5,
            minItems: 2,
            maxItems: 3,
            allowOneSlide: true,
            asNavFor: '#option-slider'
        });

        $('#option-slider').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            allowOneSlide: true,
            sync: "#option-carousel"
        });
    } else {
        $("#option-carousel").hide();
        $('#option-slider').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            allowOneSlide: true
        });
    }

    /*
            start: function(slider) {
                $.each(galleryJson[0].delta, function(key, val) {
                    $("#option-slider .slides").append("<li><img src=\"" + val.url + "\"></li>");
                    slider.addSlide("<li><img src=\"" + val.url + "\"></li>", slider.count);
                });
                $(".hack-remove-me").remove();
            }
            */
});

$("#order_form").on("pageinit", function() {
    // Give context to the campaign template (clear the old content if there is any first)
    $("#order-campaign").empty();
    $("#order-campaign").append(order_template({campaign: galleryJson[9][523].title}));

    $('#edit-dob').mobiscroll().date({
        theme: 'android-ics',
        display: 'bottom',
        mode: 'scroller',
        dateOrder: 'mmddyy'
    });
});

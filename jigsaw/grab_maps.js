const tile_width = 100;
const tile_height = 100;
const tile_scale = 1; 
const gmaps_map_zoom = 14;
const gmaps_map_types = new Array("terrain"); //("streetmap", "satellite", "hybrid", "terrain");
const gmaps_vertical_crop = 22;
const gmaps_road_weight = 4;
const gmaps_road_color = "0x000000";
const gmaps_road_style = {'weight': gmaps_road_weight, 'color': gmaps_road_color};
const gmaps_water_stroke_weight = 1;
const gmaps_water_stroke_color = "0xEEEEEE";
const gmaps_water_style = {'weight': gmaps_water_stroke_weight, 'color': gmaps_water_stroke_color};
// const gmaps_land_
const gmaps_api_type = "staticmap";            
const gmaps_base_url = "https://maps.googleapis.com/maps/api/"+gmaps_api_type+"?key="+gmaps_static_api_key;
const gmaps_api_types = {"streetview": {"latlng_param_name": "location"},
                         "staticmap": {"latlng_param_name": "center"}
                        };
   

// 47.7165502,-122.3240542 (north Seattle)
// 37.783333, -122.416667	(San Fran.)
// 34.05, -118.25 (L.A.)
// 41.836944, -87.684722 (Chicago)
// 32.715, -117.1625 (San Diego)
// 39.76185, -104.881105 (Denver)
// 40.7127, -74.0059 (NYC)
// 28.415833, -81.298889 (Orlando)
// 45.5331105,-73.6121502 (Montreal)
// 64.8385258,-147.6863164 (Fairbanks)

const start_max_lat = 64.9;// mntqc45.6;// orlando28.6;// nyc40.951;// denver39.8;// sandiego32.55;// chi41.85;// la34.3; //sf37.81;//sea47.72;
const start_min_lat = 64.78;// mntqc45.5;// orlando28.5;// nyc40.71;// denver39.7;// sandiego32.70;// chi41.825;// la34.2; //sf37.79; //sea47.71;
const start_max_lng = -147.6;// mntqc-73.4;// orlando-81.2;// nyc-73.8;// denver-104.82;// sandiego-117.0;// chi-87.60;// la-118.1; //sf-122.4; //sea-122.32;
const start_min_lng = -147.9;// mntqc-73.7;// orlando-81.45;// nyc-74.1;// denver-105.2;// sandiego-117.2;// chi-87.72;// la-118.8; //sf-122.42; //sea-122.31;
const offsetDivisor = 5000;


var gmaps_api_obj = eval("gmaps_api_types."+gmaps_api_type);
var styles = (Boolean(gmaps_road_style)) ? "style=feature:road|element:geometry|color:"+gmaps_road_style.color+"|weight:"+gmaps_road_style.weight : "";
// styles += (Boolean(gmaps_water_style)) ? "&style=feature:water|element:geometry.fill|color:"+gmaps_water_style.color+"|weight:"+gmaps_water_style.weight: "";
styles += "&style=feature:poi.park|element:all|color:0xFF0000";
styles += "&style=feature:landscape.manmade|element:all|color:0xFF0000&";
styles += "&";
var gmaps_url = gmaps_base_url + "&"+ styles;
var latlng_param_name = gmaps_api_obj.latlng_param_name;
var destination_latlng = {'lat':start_max_lat-25,'lng':start_max_lng};

(function($) {

	var seed = 1;
	var max_lat = start_max_lat;
	var min_lat = start_min_lat;
	var max_lng = start_max_lng;
	var min_lng = start_min_lng;
	var tile_div = $('#map-tiles');
	var horiz = Math.ceil($('body').width() / tile_width);
	var vert = Math.ceil($('body').height() / (tile_height-gmaps_vertical_crop));
	var lastScrollTop, label_num=0, latlng_last_marker, latlng_next_marker, all_lat_lngs=new Array;

	$(document).ready(function(){ 
		// load_overlay_outline(); 
		load_tiles();
	});

	var LA_offsetX = 0;

	$(window).scroll(function() {
		if ($(window).scrollTop() <= lastScrollTop) return; // only load new on scroll down
		offsetX = $(window).scrollLeft();
		// for LA so we don't immediately hit the ocean
		//offsetX -= 20;
		load_tiles($(window).scrollTop(), offsetX);
		//load_overlay_paths($(window).scrollTop(), $(window).scrollLeft());
	});

	function load_overlay_outline() {
		// load a shape outline transparent png
		var body_w = window.outerWidth;
		var body_h = window.outerHeight;
		var url = gmaps_base_url + "&format=png32&size="+Math.ceil(body_w/2)+"x"+Math.ceil(body_h/2);
		url += "&scale=2&center=Seattle,WA&visible=Seattle,WA";
		url += "&style=feature:all|element:labels|visibility:off";
		url += "&style=feature:water|element:all|visibility:on";
		url += "&style=feature:road|element:all|visibility:off";
		url += "&style=feature:poi|element:all|visibility:off";
		url += "&style=feature:transit|element:all|visibility:off";
		url += "&style=feature:landscape|element:geometry.fill|color:0xFFFFFF";
		// url += "&style=feature:landscape|element:geometry.stroke|visibility:on|width:4|color:0x000000";
		// url += "&style=feature:administrative|element:geometry.stroke|color:0x000000|weight:8|visibility:on";
		var img_str = "<img src='"+url+"'/>";
		img = $(img_str);
		img.css("position","fixed")
		   .css("z-index","1")
		   .css("left",0)
		   .css("top",0)
		   .css("width",body_w)
		   .css("height",body_h);
		$("body").append(img);
	}

	function load_overlay(offsetY=0, offsetX=0) {
		console.log('loading overlay image.  offsetY:'+offsetY+', offsetX:'+offsetX);
		var body_w = window.outerWidth;
		var body_h = window.outerHeight;
		var path_str = "&path=color:0xFF0000|weight:2";
		var styles = "&style=feature:all|visibility:off";
		for (i=0;i<all_lat_lngs.length;i++) {
			latlng = all_lat_lngs.shift();
			path_str += "|"+latlng.lat+","+latlng.lng;
		}
		var url = gmaps_url + "format=png32&size="+body_w+"x"+body_h + path_str + styles;
		var img_str = "<img src='"+url+"'/>";
		img = $(img_str);
		img.css("position","absolute")
		   .css("z-index","1")
		   .css("left",offsetX)
		   .css("top",offsetY)
		   .css("width",body_w)
		   .css("height",body_h);
		$("body").append(img);
	}

	function load_tiles(offsetY=0, offsetX=0) {
		// debugger;
		//console.log('loading new tiles.  offsetY:'+offsetY+', offsetX:'+offsetX);
		var row, markers, latlng, img_str, img, img_container, paths, path_weight, has_marker=false;

		for (var v=1; v<=vert; v++) {
			// place tiles
			row = $("<div class='tile-row'/>").appendTo(tile_div);
			for (var h=1; h<=horiz; h++) {
				has_marker = false;
				path_weight=4;
				maptype = Math.floor(random()*gmaps_map_types.length);
				maptype = gmaps_map_types[maptype];
				//console.log(maptype);
				geo = {max_lat: max_lat-(offsetY/offsetDivisor), min_lat: min_lat-(offsetY/offsetDivisor), max_lng: max_lng+(offsetX/offsetDivisor), min_lng: min_lng+(offsetX/offsetDivisor)};
				latlng = randLatLng(geo);
				if (random() <= 0.02) {
					has_marker = true;
					label = get_label(label_num);
					markers = "markers=color:red|label:"+label+"|"+latlng.lat+","+latlng.lng+"&";
					path_weight = 11;
					label_num++;
				}
				else markers = "";
				paths = (latlng_last_marker && has_marker) ? "path=color:0xFF0000|weight:"+path_weight+"|"+destination_latlng.lat+","+destination_latlng.lng+"|"+latlng.lat+","+latlng.lng+"|"+latlng_last_marker.lat+","+latlng_last_marker.lng+"&" : "";
				url = gmaps_url + markers + paths + latlng_param_name + "="+latlng.lat+","+latlng.lng+"&size="+tile_width+"x"+tile_height+"&maptype="+maptype+"&zoom="+gmaps_map_zoom;
				img_str = "<img src='"+url+"'/>";
				img = $(img_str);
				img_container = $("<div class='img-container'/>");
				img_container.css("max-height",tile_height - gmaps_vertical_crop).css("max-width",tile_width);
				if (h % 2 == 0) img_container.addClass('odd');
				img_container.append(img);
				row.append(img_container);	
				if (has_marker) latlng_last_marker = latlng;
				all_lat_lngs.push(latlng);	
			}
		}
		tile_div.css('height', tile_div.height()*2);
		lastScrollTop = $(window).scrollTop();
	}

	function random() {
	    var x = Math.sin(seed++) * 10000;
	    return x - Math.floor(x);
	}

	function randLatLng(geo) {
		return {'lat': (random()*Math.abs(geo.max_lat-geo.min_lat))+geo.min_lat, 'lng': (random()*Math.abs(geo.max_lng-geo.min_lng))+geo.min_lng};
	}

	function get_label(label_num) {
		// return uppercase letter between A-Z
		// var charCodeRange= {
		// 	start: 65,
		// 	end: 90
		// }		
		//return String.fromCharCode(65+label_num);
		return label_num % 10;
	}

})(jQuery);

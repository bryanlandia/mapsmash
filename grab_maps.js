const tile_width = 100;
const tile_height = 100;
const tile_scale = 1; 
const gmaps_map_zoom = 14;
const gmaps_map_types = new Array("terrain", "terrain", "terrain", "terrain", "terrain"); //("streetmap", "satellite", "hybrid", "terrain");
const gmaps_vertical_crop = 22;
const gmaps_road_weight = 4;
const gmaps_road_color = "0x000000";
const gmaps_road_style = {'weight': gmaps_road_weight, 'color': gmaps_road_color};
// const gmaps_water_stroke_weight = 1;
// const gmaps_water_stroke_color = "0xFFFFFF";
// const gmaps_water_style = {'weight': gmaps_water_stroke_weight, 'color': gmaps_water_stroke_color};
// const gmaps_land_
const gmaps_base_url = "https://maps.googleapis.com/maps/api/";
const gmaps_api_types = {"streetview": {"latlng_param_name": "location"},
                         "staticmap": {"latlng_param_name": "center"}
                        };
const gmaps_api_type = "staticmap";               

// 47.7165502,-122.3240542 (north Seattle)
const start_max_lat = 47.72;
const start_min_lat = 47.71;
const start_max_lng = -122.38;
const start_min_lng = -122.27;
const offsetDivisor = 5000;



var gmaps_api_obj = eval("gmaps_api_types."+gmaps_api_type);
var styles = (Boolean(gmaps_road_style)) ? "style=feature:road|element:geometry|color:"+gmaps_road_style.color+"|weight:"+gmaps_road_style.weight : "";
// styles += (Boolean(gmaps_water_style)) ? "&style=feature:landscape.naturl|element:geometry.stroke|color:"+gmaps_water_style.color+"|weight:"+gmaps_water_style.weight: "";
styles += "&";
var gmaps_url = gmaps_base_url + gmaps_api_type + "?"+ styles;
var latlng_param_name = gmaps_api_obj.latlng_param_name;

(function($) {

	var seed = 1;
	var max_lat = start_max_lat;
	var min_lat = start_min_lat;
	var max_lng = start_max_lng;
	var min_lng = start_min_lng;
	var tile_div = $('#map-tiles');
	var horiz = Math.ceil($('body').width() / tile_width);
	var vert = Math.ceil($('body').height() / (tile_height-gmaps_vertical_crop));
	var lastScrollTop, label_num=0, latlng_last_marker, latlng_next_marker;

	$(document).ready(function(){ load_tiles()});
	$(window).scroll(function() {
		if ($(window).scrollTop() <= lastScrollTop) return; // only load new on scroll down
		load_tiles($(window).scrollTop(), $(window).scrollLeft())
	});

	function load_tiles(offsetY=0, offsetX=0) {
		// debugger;
		console.log('loading new tiles.  offsetY:'+offsetY+', offsetX:'+offsetX);
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
				geo = {max_lat: max_lat-(offsetY/offsetDivisor), min_lat: min_lat-(offsetY/offsetDivisor), max_lng: max_lng+offsetX, min_lng: min_lng+offsetX};
				latlng = randLatLng(geo);
				if (random() <= 0.02) {
					has_marker = true;
					label = get_label(label_num);
					markers = "markers=color:red|label:"+label+"|"+latlng.lat+","+latlng.lng+"&";
					path_weight = 11;
					label_num++;
				}
				else markers = "";
				paths = (latlng_last_marker && has_marker) ? "path=color:0xFF0000|weight:"+path_weight+"|"+latlng.lat+","+latlng.lng+"|"+latlng_last_marker.lat+","+latlng_last_marker.lng+"&" : "";
				url = gmaps_url + markers + paths + latlng_param_name + "="+latlng.lat+","+latlng.lng+"&size="+tile_width+"x"+tile_height+"&maptype="+maptype+"&zoom="+gmaps_map_zoom+"&key="+gmaps_static_api_key;
				img_str = "<img src='"+url+"'/>";
				img = $(img_str);
				img_container = $("<div class='img-container'/>");
				img_container.css("max-height",tile_height - gmaps_vertical_crop).css("max-width",tile_width);
				if (h % 2 == 0) img_container.addClass('odd');
				img_container.append(img);
				row.append(img_container);	
				if (has_marker) latlng_last_marker = latlng;	
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
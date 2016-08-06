const tile_width = 100;
const tile_height = 100;
const tile_scale = 1; 
const gmaps_map_zoom = 14;
const gmaps_map_types = new Array("terrain"); //("streetmap", "satellite", "hybrid", "terrain");
const gmaps_base_url = "https://maps.googleapis.com/maps/api/staticmap?";
const gmaps_static_api_key = "AIzaSyCTwebk8_x6tkFkTvdcSvh96ZkWLcdQDYk";
const gmaps_vertical_crop = 22;
// 47.7165502,-122.3240542 (north Seattle)
const start_max_lat = 47.72;
const start_min_lat = 47.71;
const start_max_lng = -122.32;
const start_min_lng = -122.35;
const offsetDivisor = 10000;

(function($) {

	var seed = 1;
	var max_lat = start_max_lat;
	var min_lat = start_min_lat;
	var max_lng = start_max_lng;
	var min_lng = start_min_lng;
	var tile_div = $('#map-tiles');
	var horiz = Math.ceil($('body').width() / tile_width);
	var vert = Math.ceil($('body').height() / (tile_height-gmaps_vertical_crop));

	$(document).ready(function(){ load_tiles()});
	$(window).scroll(function() {load_tiles($(window).scrollTop(), $(window).scrollLeft())});

	function load_tiles(offsetY=0, offsetX=0) {
		// debugger;
		//console.log('loading new tiles.  offsetY:'+offsetY+', offsetX:'+offsetX);

		for (var v=1; v<=vert; v++) {
			// place tiles
			var row = $("<div class='tile-row'/>").appendTo(tile_div);
			for (var h=1; h<=horiz; h++) {
				maptype = Math.floor(random()*gmaps_map_types.length);
				maptype = gmaps_map_types[maptype];
				console.log(maptype);
				geo = {max_lat: max_lat-(offsetY/offsetDivisor), min_lat: min_lat-(offsetY/offsetDivisor), max_lng: max_lng+offsetX, min_lng: min_lng+offsetX};
				latlng = randLatLng(geo);
				url = gmaps_base_url + "center="+latlng.lat+","+latlng.lng+"&size="+tile_width+"x"+tile_height+"&maptype="+maptype+"&zoom="+gmaps_map_zoom+"&key="+gmaps_static_api_key;
				var img_str = "<img src='"+url+"'/>";
				var img = $(img_str);
				var img_container = $("<div class='img-container'/>");
				img_container.css("max-height",tile_height - gmaps_vertical_crop).css("max-width",tile_width);
				img_container.append(img);
				row.append(img_container);
			}
		}
		tile_div.css('height', tile_div.height()*2);
	}

	function random() {
	    var x = Math.sin(seed++) * 10000;
	    return x - Math.floor(x);
	}

	function randLatLng(geo) {
		return {'lat': (random()*Math.abs(geo.max_lat-geo.min_lat))+geo.min_lat, 'lng': (random()*Math.abs(geo.max_lng-geo.min_lng))+geo.min_lng};
	}

})(jQuery);
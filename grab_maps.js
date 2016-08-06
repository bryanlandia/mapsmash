const tile_width = 100;
const tile_height = 100;
const tile_scale = 1; 
const gmaps_map_zoom = 8;
const gmaps_map_type = "satellite";
const gmaps_base_url = "https://maps.googleapis.com/maps/api/staticmap?path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&";
const gmaps_static_api_key = "AIzaSyCTwebk8_x6tkFkTvdcSvh96ZkWLcdQDYk";
const gmaps_vertical_crop = 22;
const max_lat = 49;
const min_lat = 47;
const max_lng = -121;
const min_lng = -123;

// center=".$lat.",".$lng."&size=40x40&maptype=roadmap&sensor=false&zoom=12&key=YOURAPIKEY";

(function($) {

	var seed = 1;

	$(document).ready( function() {
		horiz = Math.ceil($('body').width() / tile_width);
		vert = Math.ceil($('body').height() / (tile_height-gmaps_vertical_crop));
		tile_div = $('#map-tiles');
		for (var v=1; v<=vert; v++) {
			// place tiles
			var row = $("<div class='tile-row'/>").appendTo(tile_div);
			for (var h=1; h<=horiz; h++) {
				latlng = randLatLng();
				url = gmaps_base_url + "center="+latlng.lat+","+latlng.lng+"&size="+tile_width+"x"+tile_height+"&maptype="+gmaps_map_type+"&zoom="+gmaps_map_zoom+"&key="+gmaps_static_api_key;
				var img_str = "<img src='"+url+"'/>";
				var img = $(img_str);
				var img_container = $("<div class='img-container'/>");
				img_container.css("max-height",tile_height - gmaps_vertical_crop).css("max-width",tile_width);
				img_container.append(img);
				row.append(img_container);
			}
		}
	});

	function random() {
	    var x = Math.sin(seed++) * 10000;
	    return x - Math.floor(x);
	}

	function randLatLng() {
		return {'lat': (random()*Math.abs(max_lat-min_lat))+min_lat, 'lng': (random()*Math.abs(max_lng-min_lng))+min_lng};
	}

})(jQuery);
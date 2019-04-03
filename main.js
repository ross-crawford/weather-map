let map;
let gcu = { lat: 55.8673607, lng: -4.2505802 };

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: gcu,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  });

  google.maps.event.trigger(map, "resize");

  // save the input element for access
  let input = document.getElementById("place-search");
  // set a google maps searchbox linked to the input variable
  let searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  searchBox.addListener("places_changed", () => {
    let places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    let bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry!");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 15,
//     center: gcu
//   });
//   // resize the map if the browser changes size
//   google.maps.event.trigger(map, "resize");

//   // save the input element for access
//   let input = document.getElementById("place-search");
//   // set a google maps searchbox linked to the input variable
//   let searchBox = new google.maps.places.SearchBox(input);
//   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//   map.addListener("bounds_changed", () => {
//     searchBox.setBounds(map.getBounds());
//   });

//   let markers = [];

//   searchBox.addListener("places_changed", () => {
//     let places = searchBox.getPlaces();
//     if (places.length == 0) {
//       return;
//     }
//     markers.forEach(marker => {
//       marker.setMap(null);
//     });
//     markers = [];

//     // For each place, get the icon, name and location.
//     var bounds = new google.maps.LatLngBounds();
//     places.forEach(place => {
//       if (!place.geometry) {
//         console.log("Returned place contains no geometry");
//         return;
//       }
//       var icon = {
//         url: place.icon,
//         size: new google.maps.Size(71, 71),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(17, 34),
//         scaledSize: new google.maps.Size(25, 25)
//       };

//       // Create a marker for each place.
//       markers.push(
//         new google.maps.Marker({
//           map: map,
//           icon: icon,
//           title: place.name,
//           position: place.geometry.location
//         })
//       );

//       if (place.geometry.viewport) {
//         // Only geocodes have viewport.
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }
//     });
//     map.fitBounds(bounds);
//   });

//   // Listener for clicks to also perform ajax request for weather info
//   map.addListener("click", e => {
//     map.panTo(e.latLng);
//     let lat = e.latLng.lat();
//     let long = e.latLng.lng();
//     $.ajax({
//       url: `http://api.apixu.com/v1/current.json?key=cd2446b6d84947d9a71154545192502&q=${lat},${long}`,
//       success: data => {
//         let infoWindow = new google.maps.InfoWindow({
//           content: `<p><b>Name</b>: ${data.location.name}<br/>
//           <b>Region</b>: ${data.location.region}<br/>
//           <b>Condition</b>: ${data.current.condition.text}<br/>
//           <b>Temperature</b>: ${data.current.temp_c}&deg;C`
//         });
//         placeMarker(e.latLng, map, data.current.condition.icon, infoWindow);
//       },
//       error: xhr => {
//         console.log("an error occurred" + xhr);
//       }
//     });
//   });
// }

// // Place marker on the map at clicked location and pass weather data in for icon and infoWindow
// function placeMarker(latLng, map, icon, info) {
//   let marker = new google.maps.Marker({
//     position: latLng,
//     map: map,
//     icon: icon,
//     animation: google.maps.Animation.BOUNCE
//   });
//   let infoWindow = info;
//   marker.addListener("click", e => {
//     infoWindow.open(map, marker);
//   });
// }

// // click map  -> place a marker at clicked location -> pan to location -> open an info window at marker
// // APIXU KEY
// //http://api.apixu.com/v1/current.json?key=cd2446b6d84947d9a71154545192502&q=lat,lng

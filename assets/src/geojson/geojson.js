// DONOR: https://github.com/NYCPlanning/db-simple-geom-editor

export class GeoJsonEditor {
	constructor(config) {
		this.map = L.map(config.id).setView([0, 0], 2);

		// let MyCustomMarker = L.Icon.extend({
		//     options: {
		//         iconAnchor: new L.Point(12, 41),
		//         iconSize: new L.Point(25, 41),
		//         iconUrl: 'images/marker-icon.png'
		//     }
		// });


		let editableLayers = new L.FeatureGroup();
		this.map.addLayer(editableLayers);

		this.options = {
			position: 'topright',
			draw: {
				polyline: false,
				polygon: !config.polygonEditor ? false : {
					allowIntersection: false, // Restricts shapes to simple polygons
					drawError: {
						color: '#e1e100', // Color the shape will turn when intersects
						message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
					},
					shapeOptions: {
						color: '#bada55'
					}
				},
				circle: false, // Turns off this drawing tool
				circlemarker: false, // Turns off this drawing tool
				rectangle: !config.polygonEditor ? false : {
					shapeOptions: {
						clickable: false
					}
				},
				marker: !!config.marker
			},
			edit: {
				featureGroup: editableLayers, //REQUIRED!!
				remove: true,
			}
		};

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;',
		}).addTo(this.map);


		let drawControl = new L.Control.Draw(this.options);
		this.map.addControl(drawControl);
		this.map.on(L.Draw.Event.CREATED, function (e) {
			let geoJson = e.layer.toGeoJSON()
			if (config.polygonEditor) {
				editableLayers.clearLayers()
				$(config.data).val(JSON.stringify(geoJson.geometry.coordinates[0]));
			} else if (config.marker) {
				$(config.data).val(JSON.stringify(geoJson.geometry.coordinates));
			} else {
				$(config.data).val(JSON.stringify(geoJson));
			}
			editableLayers.clearLayers()
			editableLayers.addLayer(e.layer);
		});
		this.map.on(L.Draw.Event.DELETED, function (e) {
			$(config.data).val('')
		})
		this.map.on(L.Draw.Event.EDITED, function (e) {
			$(config.data).val('')
			e.layers.eachLayer(function (layer) {
				let geoJson = layer.toGeoJSON()
				if(config.marker){
					$(config.data).val(JSON.stringify(geoJson.geometry.coordinates));
					return
				}
				if (config.polygonEditor) {
					editableLayers.clearLayers()
					$(config.data).val(JSON.stringify(geoJson.geometry.coordinates[0]));
				} else {
					$(config.data).val(JSON.stringify(geoJson));
				}
				editableLayers.clearLayers()
				editableLayers.addLayer(layer);
			});

		})

		// Create a GeoJson layer without adding it to the map

		let geoJSONdata;
		try {
			geoJSONdata = JSON.parse($(config.data).val())
			if (config.polygonEditor) {
				geoJSONdata = {
					"type": "Feature",
					"properties": {},
					"geometry": {"type": "Polygon", "coordinates": [geoJSONdata]}
				}
			}
			if(config.marker){
				geoJSONdata = {
					"type": "Feature",
					"properties": {},
					"geometry": {"type": "Point", "coordinates": [geoJSONdata[0], geoJSONdata[1]]}
				}
			}
			let geoJsonObj = L.geoJson(geoJSONdata, {
				onEachFeature: (feature, layer) => {
					//console.log(layer)
					editableLayers.addLayer(layer);
				}
			});

			this.map.fitBounds(geoJsonObj.getBounds());
		} catch (e){
			console.log('geoJSONdata is empty', e);
		}
	}
}

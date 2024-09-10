export class GeoJsonEditor {
    constructor(config: any);
    map: any;
    options: {
        position: string;
        draw: {
            polyline: boolean;
            polygon: boolean | {
                allowIntersection: boolean;
                drawError: {
                    color: string;
                    message: string;
                };
                shapeOptions: {
                    color: string;
                };
            };
            circle: boolean;
            circlemarker: boolean;
            rectangle: boolean | {
                shapeOptions: {
                    clickable: boolean;
                };
            };
            marker: boolean;
        };
        edit: {
            featureGroup: any;
            remove: boolean;
        };
    };
}

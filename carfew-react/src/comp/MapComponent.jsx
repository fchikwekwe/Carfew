/* global google */
import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "react-google-maps";

const mapStyle = [
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  }
];

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  makeRoute() {
    const props = this.props;
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: new google.maps.LatLng(props.origin.lat, props.origin.lng),
        destination: new google.maps.LatLng(props.dest.lat, props.dest.lng),
        travelMode: google.maps.TravelMode.DRIVING
      },
      async (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          await this.props.changeRoute(result.routes[0].legs[0]);
          this.setState({
            directions: result
          });
        } else {
          // console.error(`error fetching directions ${result}`);
        }
      }
    );

    //Zoom fix, show all markers
    //DirectionService.MoveMarker({lat: route.lat, lng: route.lng})
  }

  render() {
    const props = this.props;
    if (props.dest.lat && props.origin.lat) {
      this.makeRoute();
    }
    if (this.props.directions) {
      return (
        <GoogleMap
          defaultZoom={10}
          center={{ lat: 37.7891998, lng: -122.41 }}
          defaultOptions={{
            styles: mapStyle,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false
          }}
        >
          <DirectionsRenderer directions={this.props.directions} />
        </GoogleMap>
      );
    } else {
      return (
        <GoogleMap
          defaultZoom={10}
          center={{ lat: 37.7891998, lng: -122.41 }}
          defaultOptions={{
            styles: mapStyle,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false
          }}
        >
          {this.state.directions && this.props.newRide ? (
            <DirectionsRenderer directions={this.state.directions} />
          ) : null}
          {props.rides && !this.props.newRide
            ? props.rides.map(ride => {
                return (
                  <Marker
                    key={ride._id}
                    position={{ lat: ride.origin.lat, lng: ride.origin.lng }}
                  />
                );
              })
            : null}
          {props.origin && !this.state.directions && this.props.newRide && (
            <Marker
              position={{ lat: props.origin.lat, lng: props.origin.lng }}
            />
          )}
          {props.dest && !this.state.directions && this.props.newRide && (
            <Marker position={{ lat: props.dest.lat, lng: props.dest.lng }} />
          )}
        </GoogleMap>
      );
    }
  }
}

export default withScriptjs(withGoogleMap(MapComponent));

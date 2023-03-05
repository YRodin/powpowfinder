import React from "react";
import GoogleMapReact from "google-map-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import keys from "/server/config/keys";
import { useSelector } from "react-redux";

const Marker = ({ name, url }) => (
  <div className="marker">
    <h2>{name}</h2>
    <a href={url} target="_blank" rel="noopener noreferrer">
      Visit website
    </a>
  </div>
);

export default function GoogleMap() {
  const resorts2Display = useSelector((state)=> state.resorts2Display.matchingResorts);
  const markers = resorts2Display.map((resort)=> {
    return(
      <Marker
        key={resort.place_id}
        lat={resort.coordinates.lat}
        lng={resort.coordinates.lon}
        name={resort.name}
        url={resort.url}
      />
    )
  })
  const defaultProps = {
    center: {
      lat: 39.7392,
      lng: -104.9903,
    },
    zoom: 10,
  };
  return (
    <Container style={{ height: "50%", width: "50%" }}>
      <Row>
        <GoogleMapReact
          bootstrapURLKeys={{ key: keys.GOOGLE_API_KEY }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {markers}
        </GoogleMapReact>
      </Row>
    </Container>
  );
}

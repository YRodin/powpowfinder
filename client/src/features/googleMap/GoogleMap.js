import React from "react";
import GoogleMapReact from "google-map-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import keys from "/server/config/keys";

const Marker = ({ name, url }) => (
  <div className="marker">
    <h2>{name}</h2>
    <a href={url} target="_blank" rel="noopener noreferrer">
      Visit website
    </a>
  </div>
);

export default function GoogleMap() {
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
          <Marker lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </Row>
    </Container>
  );
}

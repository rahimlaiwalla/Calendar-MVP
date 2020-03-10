import React from 'react';
import Axios from 'axios';
const config = require('../../../config.js')

function MapObject(props) {

    function initMap() {
        // The location of Uluru
        var uluru = props.coordinates;
        // The map, centered at Uluru
        var map = new google.maps.Map(
            document.getElementsByClassName('map'), {zoom: 15, center: uluru});
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: uluru, map: map});
      }         
    return(
        <script src={`https://maps.googleapis.com/maps/api/js?key=${config.geocodeAPI_Key}&callback=${initMap}`}
    async defer ></script>
    )

}

export default MapObject;
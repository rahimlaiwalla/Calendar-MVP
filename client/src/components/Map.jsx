import React from 'react';
import Axios from 'axios';
let config = require('../../../config.js')

/*this takes the coordinates recieved from initial api call, in the server file
and then recieves the embedded map, using a call to the google embed api */
function Map(props) {
    // console.log('latitude in Map.jsx from props: ', props.latitude)
    // const source= `https://www.google.com/maps/embed/v1/view?zoom=15&center=${props.latitude},${props.longitude}&key=${config.geocodeAPI_Key}`
    const source= `https://www.google.com/maps/embed/v1/place?key=${config.geocodeAPI_Key}&q=${props.number},${props.address},${props.zipCode}&center=${props.latitude},${props.longitude}&zoom=15`

    return(
        <iframe
          width="400"
          height="100"
          src={source}>
        </iframe>
    )
}

export default Map;
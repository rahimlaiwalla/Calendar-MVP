import React from 'react';
import Axios from 'axios';

function Map(props) {
    console.log(props.coordinates.lat)
    const source= `https://www.google.com/maps/embed/v1/view?key=AIzaSyCYHsqqwzRnCe4U5shMrr-dxikyOsbRqEs&center=${props.coordinates.lat},${props.coordinates.lng}&zoom=15`
    return(
        <iframe
            width="400"
            height="50"
            src={source}>
            </iframe>
    )
}

export default Map;
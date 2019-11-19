import React from 'react';
import Axios from 'axios';

class DetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            singleEvent: this.props.singleEvent,
            location: this.props.location
        }
    }

    render() {
        return(
            <div>
                <div>
                    <h1>{this.state.singleEvent.title}</h1>
                    <div>{`Location: ${this.state.location}`}</div>
                    <div>{'Address:'}</div>
                    <div>{`Start Time: ${new Date(this.state.singleEvent.start).toLocaleTimeString()}`}</div>
                </div>
                <button onClick={this.props.rideShareOnClick}>{'Ride Share?'}</button>
            </div>
        )
    }
};


export default DetailsPage;
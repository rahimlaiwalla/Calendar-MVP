import React from 'react';
import Axios from 'axios';
// import Map from './Map.jsx';
import MapObject from './Map.jsx';

class RideShareForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            day_id: this.props.day_id,
            name: '',
            driver: 'driver',
            passengers: 0,
            add_number: '',
            address: '',
            zip_code: '',
            coordinates: {},
        }
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handlePassengerChange = this.handlePassengerChange.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeAddNum = this.onChangeAddNum.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeZip = this.onChangeZip.bind(this);
        this.onDriverSubmit = this.onDriverSubmit.bind(this);
        this.onPassengerSubmit = this.onPassengerSubmit.bind(this);
    }

    handleSelectChange(event) {
        // event.preventDefault();
        this.setState({driver: event.target.value});
      }

    handlePassengerChange(event){
        this.setState({passengers: event.target.value});
    }

    onChangeName() {
        this.setState({
            name: event.target.value,
          });
    }

    onChangeAddNum() {
        this.setState({
            add_number: event.target.value,
          });
    }

    onChangeAddress() {
        this.setState({
            address: event.target.value,
          });
    }

    onChangeZip() {
        this.setState({
            zip_code: event.target.value,
          });
    }

    onDriverSubmit(event) {
        event.preventDefault();
        Axios.post('/registerDriver', this.state)
            .then((response) => {
                console.log(response.data)
                // this.setState({coordinates: response.data})
                this.props.eventOnClick()
            })
    }

    onPassengerSubmit(event) {
        event.preventDefault();
        Axios.post('/registerPassenger', this.state)
            .then((response) => {
                this.props.eventOnClick()
            })
    }


    render() {

        return(
            <div>
                <h1>Ride Share Form</h1>
                <form>
                    <label>
                        {'Name: '} 
                        <input type="text" value={this.state.name} onChange={this.onChangeName}/>
                    </label>
                    <select value={this.state.driver} onChange={this.handleSelectChange}>
                        {/* {console.log(this.state.driver)} */}
                        <option value='driver'>Driver</option>
                        <option value='passenger'>Passenger</option>
                    </select> 
                    {this.state.driver === 'driver' ? (
                        <div>
                            <label>
                                {'How Many Passengers Can You Take? '}
                                <select value={this.state.passengers} onChange={this.handlePassengerChange}>
                                    {console.log(this.state.passengers)}
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                </select> 
                            </label>
                            <label>
                                {'Pick up Address: '}
                                <input type="number" placeholder="address number" value={this.state.add_number} onChange={this.onChangeAddNum}/>
                                <input type="text" placeholder="address" value={this.state.address} onChange={this.onChangeAddress}/>
                                <input type="number"  placeholder="zip code" value={this.state.zip_code} onChange={this.onChangeZip}/>
                            </label>
                            <input type="submit" value="Submit" onClick={this.onDriverSubmit}/>
                        </div>
                    ) : (
                        <div>
                            <label>
                                {'Ideal Pick-Up Location: '}
                                <input type="number" placeholder="address number" value={this.state.add_number} onChange={this.onChangeAddNum}/>
                                <input type="text" placeholder="address" value={this.state.address} onChange={this.onChangeAddress}/>
                                <input type="number"  placeholder="zip code" value={this.state.zip_code} onChange={this.onChangeZip}/>
                            </label>
                            <input type="submit" value="Submit" onClick={this.onPassengerSubmit}/>
                        </div>
                    )}
                </form>
                <div>{'Drivers: '}
                    {/* {console.log('Drivers: ', this.props.usersArray[0])} */}
                    {this.props.usersArray[0].map((driver) => {
                        console.log('driver from form.jsx: ', driver);
                        // console.log('RIDE SHARE DAY ID: ', this.state.day_id);
                        return (
                            <div>
                                <div>{driver.name}</div>
                                {/* <Map coordinates={this.state.coordinates}/> */}
                                <div className='map'></div>
                                <MapObject latitude={driver.latitude} longitude={driver.longitude} number={driver.add_number} address={driver.address} zipCode={driver.zip_code}/>
                            </div>
                        )
                    })}
                </div>
                <div>{'Passengers: '}
                    {this.props.usersArray[1].map((passenger) => {
                        // console.log(passenger.name);
                        return (<div>{passenger.name}</div>)
                    })}

                </div>
            </div>
        )
    }
}

export default RideShareForm;
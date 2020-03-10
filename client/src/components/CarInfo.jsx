import React, {Component} from 'react';
import Axios from 'axios';
import MapObject from './Map.jsx';

class CarInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOverMessages: false,
      message: '',
      messagesArray: [],
    }

    this.mouseOverMessages = this.mouseOverMessages.bind(this);
    this.mouseLeaveMessages = this.mouseLeaveMessages.bind(this);
    this.writeMessage = this.writeMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  mouseOverMessages(){
    if(this.props.username === this.props.group.driver.name){
      this.setState({mouseOverMessages: true});
    }
  }

  mouseLeaveMessages(){
    if(this.props.username === this.props.group.driver.name){
      this.setState({mouseOverMessages: false});
    };
  }

  writeMessage(event) {
    this.setState({message: event.target.value});
  }

  getMessages() {
    Axios.get(`/messages/${this.props.day_id}/${this.props.group.driver.name}`)
      .then( response => {
        // console.log('getMessages function in CarInfo.jsx: ', response.data);
        this.setState({messagesArray: response.data});
      })
  }

  postMessage() {
    let message = this.state.message;
    Axios.post(`/messages/${this.props.day_id}/${this.props.group.driver.name}`, {message})
      .then( response => {
        this.setState({messagesArray: response.data});
      })
      event.preventDefault();
  }

  componentDidMount() {
    this.getMessages()
  }

  render() {
    return(
      <div style={{border: '1px solid black', width: 600, marginBottom: 10, flex: 1, flexDirection: 'row'}}>
        <div style={{width: 400, flexDirection: 'column'}}>
          <b>{'Driver: '}</b>
          <div>{this.props.group.driver.name}</div>
          <MapObject latitude={this.props.group.driver.latitude} longitude={this.props.group.driver.longitude} number={this.props.group.driver.add_number} address={this.props.group.driver.address} zipCode={this.props.group.driver.zip_code}/>

          <div>
            <b>Passengers:</b>
            {this.props.group.passenger.map( pass => {
              return(
                <div>{pass.name}</div>
              )
            })}
          </div>
        </div>
        <div style={{width: 600}} onMouseEnter={this.mouseOverMessages} onMouseLeave={this.mouseLeaveMessages}><b>Messages:</b>
            {this.state.mouseOverMessages
            ? (
              <form onSubmit={this.postMessage}>
                <input type="text" value={this.state.message} onChange={this.writeMessage}></input>
                <input type="submit" value="Submit" />
              </form>
            )
          : (
            null
          )}
          {
            this.state.messagesArray.map( message => {
              return <div>{message.message}</div>
            })
          }
        </div>
      </div>
    )
  }
}

export default CarInfo;
import React, {Component} from 'react';
import Axios from 'axios';
import MapObject from './Map.jsx';
import TwiloChat from './TwilioApp.jsx'


class CarInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOverMessages: false,
      message: '',
      messagesArray: [],
      carGroup: [],
      chatClicked: false,
      channelName: `${this.props.day_id}_${this.props.eventInfo.title}_${this.props.group.driver.name}`
    }

    this.mouseOverMessages = this.mouseOverMessages.bind(this);
    this.mouseLeaveMessages = this.mouseLeaveMessages.bind(this);
    this.writeMessage = this.writeMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.onChatClick = this.onChatClick.bind(this);
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
    if(this.state.messagesArray.length > 0){
      Axios.post(`/messages/${this.props.day_id}/${this.props.group.driver.name}`, {message})
        .then( response => {
          this.setState({messagesArray: response.data});
        })
    } else {
      Axios.post(`/insertMessage/${this.props.day_id}/${this.props.group.driver.name}`, {message})
      .then( response => {
        this.setState({messagesArray: response.data});
      })
    }
    
      event.preventDefault();
  }

  onChatClick() {
    !this.state.chatClicked ? 
      this.setState({chatClicked: true})
    : this.setState({chatClicked: false})
  }

  componentDidMount() {
    let carGroup = [this.props.group.driver.name];
    this.props.group.passenger.forEach(passenger => {
      carGroup.push(passenger.name)
    })
    this.setState({carGroup}, () => {
      console.log('state car Group: ', this.state.carGroup)
    })

    // this.getMessages()

  }

  render() {
    // console.log('props: ', this.props)
    console.log('channelName: ', this.state.channelName)
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
        <div>
          {
            this.state.carGroup.includes(this.props.username) 
            ? (
              <button onClick={this.onChatClick}>Chat</button>
            )
            :(null)
          }
        </div>
        {/* <div style={{width: 600}} onMouseEnter={this.mouseOverMessages} onMouseLeave={this.mouseLeaveMessages}><b>Messages:</b>
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
        </div> */}
        <span className="mainChat">
          {
            this.state.chatClicked
            ? (
              <TwiloChat username={this.props.username} channelName={this.state.channelName} />
            )
            : (
              null
            )
          }
        </span>
      </div>
    )
  }
}

export default CarInfo;
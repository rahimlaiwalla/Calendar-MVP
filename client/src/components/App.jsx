import React from 'react';
import Axios from 'axios';
import {
    Calendar,
    momentLocalizer,
  } from 'react-big-calendar';
import moment from "moment";
import DetailsPage from './DetailsPage.jsx'
import RideShareForm from './RideShareForm.jsx'


// import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [{
                id: 1,
                location: 'Alameda',
                title: 'Test',
                start: new Date(2019, 10, 18, 7, 30, 0),
                end: new Date(2019, 10, 18, 9, 30, 0),
                allDay: false
            }, {
                id: 2,
                title: 'Test2',
                start: new Date(2019, 10, 15, 7, 30, 0),
                end: new Date(2019, 10, 15, 9, 30, 0),
                allDay: false
            }],
            location: 'Alameda',
            view: 'login',
            singleEvent: {},
            singleEventUsersArray: [],
            singleEventGroupArray: [],
            username: '',
            password: '',
            userId: 0,
        }
        this.eventOnClick = this.eventOnClick.bind(this);
        this.rideShareOnClick = this.rideShareOnClick.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.login = this.login.bind(this);
        this.usernameOnChange = this.usernameOnChange.bind(this);
        this.passwordOnChange = this.passwordOnChange.bind(this);
    }

    componentDidMount() {
        // this.getEvents();
    }

    // getEvents() {
    //     Axios.get('/events')
    //         .then((response) => {
    //             this.setState({events: response.data});
    //         })
    // }

    //getEvents using id in api
    getEvents() {
      Axios.get(`/events/${this.state.userId}`)
          .then((response) => {
              this.setState({events: response.data});
          })
  }

    eventOnClick(event) {
        if(this.state.view === 'calendar'){
            this.setState({view: 'details', singleEvent: event}, () => {
                console.log(this.state.singleEvent)
                Axios.post('/riders', {day_id: this.state.singleEvent.id})
                    .then((response) => {
                        this.setState({singleEventUsersArray: response.data.array, singleEventGroupArray: response.data.groups}, () => {
                            console.log('STATE GROUP ARRAY', this.state.singleEventGroupArray)
                        })
                    })
            });
        } else {
            Axios.post('/riders', {day_id: this.state.singleEvent.id})
            .then((response) => {
                this.setState({singleEventUsersArray: response.data.array, singleEventGroupArray: response.data.groups}, () => {
                    // console.log('STATE Group ARRAY', this.state.singleEventGroupArray)
                })
            })
        }

    }

    login(event) {
      let username = this.state.username;
      let password = this.state.password;
      Axios.post('/login', {username, password})
        .then( response => {
          if(response.data.login_id){
            this.setState({view: 'calendar', userId: response.data.login_id})
            // console.log('RESPONSE.DATA FROM LOGIN: ', response.data.login_id)
          } else if(!response.data.login_id){
            alert('WRONG USERNAME OR PASSWORD')
          }
          // console.log('RESPONSE.DATA FROM LOGIN: ', response.data)
          this.getEvents();
        })
        event.preventDefault();
    }

    usernameOnChange(event) {
      this.setState({username: event.target.value});
    }

    passwordOnChange(event) {
      this.setState({password: event.target.value});
    }

    rideShareOnClick() {
      this.setState({view: 'rideShare'})
    }

    render () {
        if(this.state.view === 'login'){
          return(
            <div>
              <h1>Login Page</h1>
              <form onSubmit={this.login}>
                <label>
                  {'Username   '}
                  <input type="text" value={this.state.username} onChange={this.usernameOnChange}></input>
                </label>
                <label>
                  {'     Password   '}
                  <input type="text" value={this.state.password} onChange={this.passwordOnChange}></input>
                </label>
                <label>
                  <input type="submit" value="Submit"></input>
                </label>
              </form>
            </div>
          )
        } else if(this.state.view === 'calendar') {
            return(
            <div className="App">
                <div>
                <h5 align="left">{this.state.username}</h5>
                <h1>{'MVP Event Calendar and Ride Share App'}</h1>
                </div>
                <Calendar
                localizer={localizer}
                defaultDate={moment().toDate()}
                defaultView="month"
                startAccessor="start"
                endAccessor="end"
                events={this.state.events}
                onSelectEvent={this.eventOnClick}
                style={{ height: "100vh" }}
                />
            </div>
            )
        } else if(this.state.view === 'details') {
            return(
                <DetailsPage singleEvent={this.state.singleEvent} location={this.state.location} rideShareOnClick={this.rideShareOnClick}/>
            )
        } else if(this.state.view === 'rideShare'){
            return <RideShareForm usersArray={this.state.singleEventUsersArray} groupsArray={this.state.singleEventGroupArray} day_id={this.state.singleEvent.id} eventOnClick={this.eventOnClick} username={this.state.username} userId={this.state.userId}/>
        }
    }
}

export default App;
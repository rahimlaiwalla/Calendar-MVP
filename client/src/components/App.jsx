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
            view: 'calendar',
            singleEvent: {},
            singleEventUsersArray: [],
        }
        this.eventOnClick = this.eventOnClick.bind(this);
        this.rideShareOnClick = this.rideShareOnClick.bind(this);
        this.getEvents = this.getEvents.bind(this);
    }

    componentDidMount() {
        this.getEvents();
    }

    getEvents() {
        Axios.get('/events')
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
                        this.setState({singleEventUsersArray: response.data}, () => {
                            // console.log('STATE USER ARRAY', this.state.singleEventUsersArray)
                        })
                    })
            });
        } else {
            Axios.post('/riders', {day_id: this.state.singleEvent.id})
            .then((response) => {
                this.setState({singleEventUsersArray: response.data}, () => {
                    // console.log('STATE USER ARRAY', this.state.singleEventUsersArray)
                })
            })
        }

    }

    rideShareOnClick() {
        this.setState({view: 'rideShare'})
    }

    render () {
        if(this.state.view === 'calendar') {
            return(
            <div className="App">
                <div>
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
            return <RideShareForm usersArray={this.state.singleEventUsersArray} day_id={this.state.singleEvent.id} eventOnClick={this.eventOnClick}/>
        }
    }
}

export default App;
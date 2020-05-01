import React, { Component } from 'react'
import $ from 'jquery'
import TwilioChat from 'twilio-chat'
import MessageForm from './MessageForm'
import MessageList from './MessageList'

// import Twilio from 'twilio'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      username: null,
      channel: null,
    }
  }

  componentDidMount = () => {
    this.chatFunction(this.props)
    
  }

  handleNewMessage = (text) => {
    // this.setState({
    //   messages: [...this.state.messages, { me: true, author: "Me", body: text }],
    // })

    //messages need to be sent to our programmable chat service at Twilio
    if (this.state.channel) {
      this.state.channel.sendMessage(text)
    }
  }


  ///////////////////////////////////////////////////////////////////////

  chatFunction(props){
    // Our interface to the Chat service
    var chatClient;
  
    // A handle to the "general" chat channel - the one and only channel we
    // will have in this sample app
    var generalChannel;
  
    // The server will assign the client a random username - store that value
    // here
    var username;
    let setUserNameState = (username) => {
      this.setState({username: username}, () => {
        console.log('state username: ', this.state.username);
      })
    }

    let setChannelState = (channel) => {
      this.setState({channel: channel}, () => {
        console.log('state channel: ', this.state.channel);
      })
    }
  
    // Helper function to print INFO MESSAGES to the chat window

    let addMessage = (message) => {
      const messageData = { ...message, me: message.author === this.state.username }
      this.setState({
        messages: [...this.state.messages, messageData],
      })
    }
    
  
    // Alert the user they have been assigned a random username
    this.setState({
      messages: [...this.state.messages, { body: `Connecting...` }],
    })
  
    // // Get an access token for the current user, passing a username (identity)
    // // and a device ID - for browser-based apps, we'll always just use the
    // // value "browser"
    $.getJSON(`/token/${this.props.username}`, {
      device: 'browser'
    }, function(data) {
  
  
      // Initialize the Chat client
      TwilioChat.create(data.token).then(client => {
        console.log('Created chat client');
        chatClient = client;
        chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);
  
      // Alert the user they have been assigned a random username
      username = data.identity;
      console.log(username)
      setUserNameState(username)
      // this.setState({
      //   messages: [...this.state.messages, { body: `You have been assigned a random username of: ${username}` }],
      // })
      addMessage({ body: `You have been assigned the username: ${username}` })
  
      }).catch(error => {
        console.error(error);
        addMessage({ body: `There was an error creating the chat client: ${error}` });
        addMessage({ body: 'Please check your .env file.' });
      });
    });
  
    function createOrJoinGeneralChannel() {
    //   // Get the general chat channel, which is where all the messages are
    //   // sent in this simple application
      addMessage({ body: `Attempting to join ${props.channelName} chat channel...` });

    //   print('Attempting to join "general" chat channel...');
      chatClient.getChannelByUniqueName(props.channelName)
      .then(function(channel) {
        generalChannel = channel;
        console.log(`Found ${props.channelName} channel:`);
        console.log(generalChannel);
        setChannelState(generalChannel)
        
        if(generalChannel.state.status === 'joined'){
          console.log(generalChannel.state.status);

          generalChannel.getMessages().then(function(messages) {
            const totalMessages = messages.items.length;
            for (let i = 0; i < totalMessages; i++) {
              const message = messages.items[i];
              // console.log('Author:' + message.author);
              addMessage({author: message.author, body: message.body});
            }
            // console.log('Total Messages:' + totalMessages);
          });

          generalChannel.on('messageAdded', function({author, body}) {
            addMessage({author, body});
          });
        } else {

          generalChannel.join().then(function(channel) {
            addMessage({ body: `Joined channel as: ${username}` })
          }).then(() => {
            generalChannel.getMessages().then(function(messages) {
              const totalMessages = messages.items.length;
              for (let i = 0; i < totalMessages; i++) {
                const message = messages.items[i];
                // console.log('Author:' + message.author);
                addMessage({author: message.author, body: message.body});
              }
              // console.log('Total Messages:' + totalMessages);
            });
          });

          generalChannel.on('messageAdded', function({author, body}) {
            addMessage({author, body});
          });    
    
        }
      }).catch(function() {
    //     // If it doesn't exist, let's create it
        console.log(`Creating ${props.channelName} channel`);
        chatClient.createChannel({
          uniqueName: props.channelName,
          friendlyName: `${props.channelName} Chat Channel`
        }).then(function(channel) {
          console.log(`Created ${props.channelName} channel:`);
          console.log(channel);
          generalChannel = channel;
          setChannelState(generalChannel)
          setupChannel();
        }).catch(function(channel) {
          console.log('Channel could not be created:');
          console.log(channel);
        });
      });
    }
  
    // // Set up channel after it has been found
    function setupChannel() {
    //   // Join the general channel
      generalChannel.join().then(function(channel) {
        addMessage({ body: `Joined channel as: ${username}` })
      });
  
    //   // Listen for new messages sent to the channel
      generalChannel.on('messageAdded', function({author, body}) {
        addMessage({author, body});
      });
    }
  
  };
  
  ///////////////////////////////////////////////////////////////////////

  render() {

    return (
      <div className="App">
        <MessageList messages={this.state.messages} />
        <MessageForm onMessageSend={this.handleNewMessage} />
      </div>
    )

    // return(
    //   <h3 className="TwilioApp">Twilio Files</h3>
    // )
  }
}

export default App

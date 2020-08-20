import React, { Component } from 'react';

import axios from 'axios';

import Swal from 'sweetalert2'

import io from 'socket.io-client'

import ChatForm from './ChatForm';

import ChatList from './ChatList';

var socket = io.connect('http://localhost:3001');

const request = axios.create({
   baseURL: 'http://localhost:3001/api',
   timeout: 1000,
   headers: {}
});

export default class ChatBox extends Component {
   constructor(props) {
      super(props);
      this.state = { data: [], typer: '', typing: false }
      this.addChat = this.addChat.bind(this);
      this.loadChat = this.loadChat.bind(this);
      this.updateTyping = this.updateTyping.bind(this);
   }

   componentDidMount() {
      this.loadChat()

      socket.on('chat', function (data) {
         this.setState((state, props) => ({
            data: [...state.data, { ...data, sent: true }]
         }))
      }.bind(this))

      socket.on('delete-chat-frontend', function (id) {
         this.setState((state, props) => ({
            data: state.data.filter(item => {
               return item.id !== id.id
            })
         }))
      }.bind(this))

      socket.on('typing from back', function (typer) {
         this.setState({
            typing: true,
            typer: typer.name
         })
      }.bind(this))

      socket.on('stop typing from back', function () {
         this.setState({
            typing: false,
         })
      }.bind(this))

   }

   componentDidUpdate() {

   }

   loadChat() {
      request.get('/chat')
         .then(function (response) {
            let messages = response.data.data.map(item => ({ ...item, sent: true }))
            this.setState({ data: messages });
         }.bind(this))
         .catch(function (error) {
            alert(error)
         })
   }

   addChat(data) {
      const id = Date.now();
      // add chat in Front-end
      this.setState((state, props) => ({
         data: [...state.data, { id: id, name: data.name, message: data.message, sent: true }]
      }))

      socket.emit('chats', {
         id: id,
         name: data.name,
         message: data.message
      })

      // add data chat in Back-end
      request.post('/chat', {
         id: id,
         name: data.name,
         message: data.message
      }).then(function (response) {

      })
         .catch(function (error) {
            this.setState((state, props) => ({
               data: state.data.map(item => {
                  if (item.id === id) {
                     item.sent = false;
                  }
                  return item;
               })
            }))
         }.bind(this))
   }

   resendChat = (data) => {
      // repost to back-end
      request.post('/chat', {
         id: data.id,
         name: data.name,
         message: data.message
      })
         .then(function (response) {
            this.setState((state, props) => ({
               data: state.data.map(item => {
                  if (item.id === data.id) {
                     item.sent = true;
                  }
                  return item;
               })
            }))
         }.bind(this))
         .catch(function (error) {

         })
   }

   deleteChat = (id) => {
      Swal.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this Chat",
         type: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!'
      }).then(result => {
         if (result.value) {
            // Delete in front-end
            this.setState((state, props) => ({
               data: state.data.filter(item => item.id !== id)
            }));

            socket.emit('delete chat backend', {
               id
            })

            // delete in backend
            request.delete('/chat/' + id)
               .then(response => {
                  Swal.fire({
                     type: 'success',
                     title: 'Chat has been deleted',
                     showConfirmationButton: false,
                     timer: 1200
                  })
               })
               .catch(error => {
                  Swal.fire({
                     type: 'warning',
                     text: 'connection problem try again later',
                     showConfirmationButton: false,
                     timer: 1200
                  })
               })
         }
      })
   }

   updateTyping(name) {
      socket.emit('typing from front', {
         name
      });

      setTimeout(() => {
         socket.emit('stop typing from front');
      }, 3000)
   }

   render() {
      return (
         // header 
         <div className="container d-flex mx-auto mt-5 col-md-8 col-xl-6 chat">
            
            <div className="card">

               <div className="card-header text-center">
                  <div>
                     <h4> TriCh@t </h4>
                     <div className="online_icon"></div>
                     <div className="active_user">
                        <p>Active Users : 8 </p>
                     </div>
                  </div>
               </div>

               <div className="card-body msg_card_body">
                  <ChatList messages={this.state.data} resend={this.resendChat} delete={this.deleteChat} feedback={this.state.typing} typer={this.state.typer} />
               </div>
               <ChatForm add={this.addChat} typing={this.updateTyping} />
            </div>
         </div>
      )
   }
}
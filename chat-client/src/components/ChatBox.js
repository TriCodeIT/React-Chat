import React, { Component } from 'react';

import axios from 'axios';

import Swal from 'sweetalert2'

import io from 'socket.io-client';

import ChatForm from './ChatForm';

import ChatList from './ChatList';

const socket = io.connect('http://localhost:3001');

const request = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 1000,
    headers: {}
})

const typingTimerLength = 400;

export default class ChatBox extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], typer: '', typing: false }
        this.addChat = this.addChat.bind(this);
    }

    // componentDidMount() {
    //     this.LoadChat()

    //     socket.on('chat', function (data) {
    //         this.setState((state, props) => ({
    //             data: [...state.data, { ...data, sent: true }]
    //         }))
    //     }.bind(this))

    //     socket.on('delete-chat-frontend', function (id) {
    //         this.setState((state, props) => ({
    //             data: state.data.filter(item => {
    //                 return item.id !== id.id
    //             })
    //         }))
    //     }.bind(this))

    //     socket.on('typing from back', function (typer) {
    //         this.setState({
    //             typing: true,
    //             typer: typer.name
    //         })
    //     }.bind(this))

    //     socket.on('stop typing from back', function () {
    //         this.setState({
    //             typing: false,
    //         })
    //     }.bind(this))

    // }

    // componentDidUpdate() {

    // }

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

        // Add Message Chat in Front End React
        this.setState((state, props) => ({
            data: [...state.data, { id: id, name: data.name, message: data.message, sent: true }]
        }));

        socket.emit('chats', {
            id: id,
            name: data.name,
            message: data.message
        })

        // Add Message Chat in Back End
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
                            item.sent = false
                        }
                        return item;
                    })
                }))
            }.bind(this))
    }

    // resendChat = (data) => {

    //     //Repost Message Chat to Back-End
    //     request.post('/chat', {
    //         id: data.id,
    //         name: data.name,
    //         message: data.message
    //     })
    //         .then(function (response) {
    //             this.setState((state, props) => ({
    //                 data: state.data.map(item => {
    //                     if (item.id === data.id) {
    //                         item.sent = false
    //                     }
    //                     return item;
    //                 })
    //             }))
    //         }.bind(this))
    //         .catch(function (error) {

    //         })
    // }

    deleteChat = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this Chat!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.value) {

                // Delete in Front End
                this.setState((state, props) => ({
                    data: state.data.filter(item => item.id !== id)
                }));

                socket.emit('delete chat backend', {
                    id
                })

                // Delete in Backend
                request.delete('/chat/' + id)
                    .then(response => {
                        Swal.fire({
                            type: 'succes',
                            title: 'chat has been deleted',
                            showConfirmationButton: false,
                            timer: 1200
                        })
                    })
                    .catch(response => {
                        Swal.fire({
                            type: 'warning',
                            title: 'connection problem try again later',
                            showConfirmationButton: false,
                            timer: 1200
                        })
                    })
            }
        })
    }

    render() {
        return (
           // header 
           <div className="container d-flex mx-auto mt-5 col-md-8 col-xl-6 chat">

              <div className="card">

                 <div className="card-header text-center">

                    <div>
                       <h4> Welcome to TriChat </h4>
                       <div className="online_icon"></div>
                       <div className="active_user">
                          <p>Active users : 5 </p>
                       </div>
                    </div>
                 </div>
  
                 <div className="card-body msg_card_body">
                    <ListChat messages={this.state.data} delete={this.deleteChat} feedback={this.state.typing} typer={this.state.typer} />
                 </div>
                 <ChatForm add={this.addChat} />
              </div>
           </div>
        )
     }
  }
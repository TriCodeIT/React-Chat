import React from 'react';

import ChatItem from './ChatItem'

function ChatList(props) {

    const ChatList = props.messages.map((message, index) => <ChatItem key={index} delete={props.delete} message={message} index={index} resend={props.resend} />)

    return (
        <div>
            <div id="chat-list">
                {ChatList}
            </div>
            <div id="feedback">
                {props.feedback && <p> {props.typer} is typing ...</p>}
            </div>
        </div>
    )
}

export default ChatList;
import React, { Component } from 'react'

export default class FormItem extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: null, 
            name: '', 
            message: '' 
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.add(this.state.value);
        this.setState({ message: '' })
    }

    handleTyping(event) {
        let { name } = this.state
        this.props.typing(name);
    }

    handleEnter(event) {
        if (event.which == 13 && !event.shiftKey) {
            let btn = document.getElementById('submit-button');
            btn.click();
        }
    }

    render() {
        return (
           <div className="card-footer">

              <form onSubmit={this.handleSubmit}>
                  
                 <div className="input-group">
  
                    <div className="container">
                       <div className="form-group row">
  
                          <div className="input-group-append left-form">
                             <span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
                          </div>
  
                          <div className="col-sm">
                             <input className="form-control type_msg" name="name" type="text" value={this.state.name} onChange={this.handleChange} placeholder="Type your Name..." />
                             <textarea className="form-control type_msg" type="text" value={this.state.message} name="message" placeholder="Type your message..." onChange={this.handleChange} onKeyUp={this.handleTyping} onKeyDown={this.handleEnter}></textarea>
                          </div>
  
                          <div className="input-group-append right-form">
                             <button type="submit" value="Submit" id="submit-button" className="input-group-text send_btn"><i className="fas fa-location-arrow"></i></button>
                          </div>
  
                       </div>
                    </div>
                 </div>
              </form>
           </div >
        )
     }
}
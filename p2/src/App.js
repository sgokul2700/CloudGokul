import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Button,  Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Home from './home';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
   }

   handleChange = e => {
     e.preventDefault();
     const { name, value } = e.target;
     this.setState({[name]: value});
   }

  handleSubmit = e => {
    e.preventDefault();
    const data = {
      'username': this.state.username,
      'password': this.state.password
    };
    axios.post('https://us-central1-vedha-254717.cloudfunctions.net/function-1',data)
      .then(res => {
        console.log(res.data)
        if(res.data){
          ReactDOM.render(<Home />, document.getElementById('root'));
        }
        else{
          alert('Invalid credentials');
        }
  })
}

  render() {

    return (
      <div className="parent">
      <Form className="form">
      <p>Log In</p>
  <Form.Group controlId="username">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Enter username" name="username" onChange={this.handleChange}/>
    <Form.Text className="text-muted">
      We'll never share your username and password with anyone else.
    </Form.Text>
  </Form.Group>

  <Form.Group controlId="password">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
  </Form.Group>
  <Button variant="outline-secondary" type="submit" onClick={this.handleSubmit}>
    Submit
  </Button>
  <br/>
  <br/>
  <br/>
</Form>
</div>
);
  }
}

export default App;

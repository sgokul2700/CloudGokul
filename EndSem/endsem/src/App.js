import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,  Form} from 'react-bootstrap';
import './App.css';


class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      age: '',
      work: 'Manager',
      salary: '',
      email: '',
      file: '',
      validated: false,
    };
   }


   handleSubmit = event => {
     event.preventDefault();
     const form = event.currentTarget;
     if (form.checkValidity() === false) {
       alert("Form Not Valid!!!");
       event.preventDefault();
       event.stopPropagation();
       this.setState({validated: true});
     }
     else {
       const user = {
         name: this.state.name,
         age: this.state.age,
         work: this.state.work,
         salary: this.state.salary,
         email: this.state.email
       };
       console.log(user);
       axios.post('https://us-central1-vedha-254717.cloudfunctions.net/endsem',user)
         .then(res => {
           if(res.data){
             const data = new FormData();
             data.append('file',this.state.file);
             console.log(this.state.file);
             axios.post('http://localhost:3001/fileupload',data)
               .then(res => {
                 if(res.data){
                   alert("File Uploaded");
                 }
                 else{
                   alert("File Not Uploaded!!!");
                 }
               });
             }
        else{
       alert("Data Not Sent!!!")
      }
   });
   }
 }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        console.log(value);
        this.setState({[name]: value});
        break;
      case 'age':
        console.log(value);
        this.setState({[name]: value});
        break;
      case 'work':
        console.log(value);
        this.setState({[name]: value});
        break;
      case 'salary':
        console.log(value);
        this.setState({[name]: value});
        break;
      case 'email':
        console.log(value);
        this.setState({[name]: value});
        break;
      case 'file':
      console.log(name);
      console.log(e.target.files[0]);
      this.setState({[name]:e.target.files[0]});
        break;
      default:
        break;
    }

  }


  render(){
    return (
      <div className="App">
      <br/>
      <br/>
      <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
      <Form.Group controlId="validationCustom01">
        <Form.Label>Name</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="name"
          name="name"
          onChange={this.handleChange}
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationCustom02">
        <Form.Label>Age</Form.Label>
        <Form.Control
          required
          type="number"
          placeholder="age"
          name="age"
          onChange={this.handleChange}
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      </Form.Group>
      <Form.Group  controlId="validationCustom03">
        <Form.Label>Job</Form.Label>
        <Form.Control as="select" name="work" onChange={this.handleChange}>
        <option>Manager</option>
        <option>Programmer</option>
        <option>CEO</option>
    </Form.Control>
        <Form.Control.Feedback type="invalid">
          Please provide a valid Job.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group  controlId="validationCustom04">
        <Form.Label>Salary</Form.Label>
        <Form.Control type="number" placeholder="salary" name="salary" onChange={this.handleChange} required />
        <Form.Control.Feedback type="invalid">
          Please provide salary.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group  controlId="validationCustom05">
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="email@mail.com" name="email" onChange={this.handleChange}  required />
        <Form.Control.Feedback type="invalid">
          Please provide a valid mail id.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group  controlId="validationCustom06">
        <Form.Label>File</Form.Label>
        <Form.Control type="file" name="file" onChange={this.handleChange}  required />
        <Form.Control.Feedback type="invalid">
          Please provide a valid file.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group  controlId="validationCustom06">
        <Button className='but' variant="outline-primary" type="submit">Submit form</Button>
      </Form.Group>
    </Form>
    <br/>
    <br/>
      </div>
    );
  }
}

export default App;

import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,  Form, Table, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import App from './App';

class Home extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      menu: '',
      price: 0,
      menuitems: [],
      bill: '',
      total: 0,
      currentitem: '',
      quantity: 0,
      name: ''
    };
   }

   handleClicks = e => {
     e.preventDefault();
     this.setState({id: 3});
   }

   handleChange = e => {
     e.preventDefault();
     const { name, value } = e.target;
     this.setState({[name]: value});
   }
  handleclick = e => {
    e.preventDefault();
    this.setState({id: 1});

  }
  handleclick1 = e => {
    e.preventDefault();
    this.setState({id: 2});
  }
  handleclick6 = e => {
    e.preventDefault();
    this.setState({id: 5});
  }
  handleclick2 = e => {
    e.preventDefault();
    this.setState({id: 4});
    axios.get('https://us-central1-vedha-254717.cloudfunctions.net/function-5')
      .then(res => {
        if(res.data===false){
          alert('Menu could not be fetched');
        }
        else{
          this.setState({menuitems: res.data});
          console.log(this.state.menuitems);
        }
  })
  }
  handleclick3 = e => {
    e.preventDefault();
    let obj = this.state.menuitems.filter(c => {
      return c.foodname === this.state.currentitem
    })
    let eachprice=this.state.quantity*obj[0].rate;
    this.state.bill = this.state.bill+this.state.currentitem+":"+this.state.quantity.toString()+"\n";
    this.state.total=this.state.total+eachprice;
    console.log(eachprice);
  }

  handleclick4 = e => {
    e.preventDefault();
    const data = {
      'name': this.state.name,
      'bill': this.state.bill,
      'total': this.state.total
    };
    axios.post('https://us-central1-vedha-254717.cloudfunctions.net/function-4',data)
      .then(res => {
        if(res.data){
          alert('Bill Sent');
        }
        else{
          alert('Bill Not Sent');
        }
  })
    }
  handleSubmit = e => {
    e.preventDefault();
    const data = {
      'menu': this.state.menu,
      'price': this.state.price
    };
    axios.post('https://us-central1-vedha-254717.cloudfunctions.net/function-2',data)
      .then(res => {
        if(res.data){
          alert('Menu Added');
        }
        else{
          alert('Menu Not Added');
        }
  })
}
handleSubmit1 = e => {
  e.preventDefault();
  const data = {
    'menu': this.state.menu
  };
  axios.post('https://us-central1-vedha-254717.cloudfunctions.net/function-3',data)
    .then(res => {
      if(res.data){
        alert('Menu deleted');
      }
      else{
        alert('Menu Not deleted');
      }
})
}
handleSubmit2 = e => {
  e.preventDefault();
  const data = {
    'menu': this.state.menu,
    'price': this.state.price
  };
  axios.post('https://us-central1-vedha-254717.cloudfunctions.net/function-6',data)
    .then(res => {
      if(res.data){
        alert('Menu updated');
      }
      else{
        alert('Menu Not updated');
      }
})
}
render(){
  if(this.state.id===0){
    return (
      <div>
      <div className='bar'>
      <li><a href="" onClick={this.handleClicks}>Home</a></li>
      <li><a href="http://localhost:3000">Signout</a></li>
      </div>
      <div className="form">
      <p className="admin">Welcome Administrator</p>
      <br/>
      <br/>
      <Button variant="outline-success" size="lg" onClick={this.handleclick} block>
      Add Menu Items
      </Button>
      <br/>
      <br/>
      <Button variant="outline-secondary" size="lg" onClick={this.handleclick1} block>
      Delete Menu Items
      </Button>
      <br/>
      <br/>
      <Button variant="outline-secondary" size="lg" onClick={this.handleclick6} block>
      Update Menu Items
      </Button>
      <br/>
      <br/>
      <Button variant="outline-dark" size="lg" onClick={this.handleclick2} block>
      Take Order
      </Button>
      </div>
      </div>
    );
  }
  else if(this.state.id===1){
    return(
      <div>
      <div className='bar'>
      <li><a href="" onClick={this.handleClicks}>Home</a></li>
      <li><a href="http://localhost:3000">Signout</a></li>
      </div>
      <Form className="form">
      <Form.Group controlId="formBasicEmail">
      <Form.Label>FoodName</Form.Label>
      <Form.Control type="text" placeholder="Enter Menu Name" name="menu" onChange={this.handleChange}/>
      <Form.Text className="text-muted">
      </Form.Text>
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
      <Form.Label>Amount</Form.Label>
      <Form.Control type="number" placeholder="Enter Price" name="price" onChange={this.handleChange}/>
      </Form.Group>
      <Form.Group controlId="formBasicCheckbox">
      </Form.Group>
      <Button variant="primary" type="submit" onClick={this.handleSubmit}>
      Add
      </Button>
      </Form>
      </div>
    );
  }
  else if(this.state.id===2){
    return(
      <div>
      <div className='bar'>
      <li><a href="" onClick={this.handleClicks}>Home</a></li>
      <li><a href="http://localhost:3000">Signout</a></li>
      </div>
      <div>
      <Form className="form">
      <Form.Group controlId="formBasicEmail">
      <Form.Label>FoodName</Form.Label>
      <Form.Control type="text" placeholder="Enter Menu Name" name="menu" onChange={this.handleChange}/>
      <Form.Text className="text-muted">
      </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={this.handleSubmit1}>
      DELETE
      </Button>
      </Form>
      </div>
      </div>
    );
  }
  else if(this.state.id===3){
    return(<Home />)
  }
  else if(this.state.id===5){
    return(
      <div>
      <div className='bar'>
      <li><a href="" onClick={this.handleClicks}>Home</a></li>
      <li><a href="http://localhost:3000">Signout</a></li>
      </div>
      <Form className="form">
      <Form.Group controlId="formBasicEmail">
      <Form.Label>FoodName</Form.Label>
      <Form.Control type="text" placeholder="Enter Menu Name" name="menu" onChange={this.handleChange}/>
      <Form.Text className="text-muted">
      </Form.Text>
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
      <Form.Label>Amount</Form.Label>
      <Form.Control type="number" placeholder="Enter Price" name="price" onChange={this.handleChange}/>
      </Form.Group>
      <Form.Group controlId="formBasicCheckbox">
      </Form.Group>
      <Button variant="primary" type="submit" onClick={this.handleSubmit2}>
      UPDATE
      </Button>
      </Form>
      </div>
    );
  }
  else{
    return(
      <div>
      <div className='bar'>
      <li><a href="" onClick={this.handleClicks}>Home</a></li>
      <li><a href="http://localhost:3000">Signout</a></li>
      </div>
      <Table striped bordered hover>
      <thead>
      <tr>
      <th>Food Name</th>
      <th>Price</th>
        </tr>
        </thead>
        <tbody>
        {
          this.state.menuitems.map((c,i) => {
            return <tr><td>{c.foodname}</td><td>{c.rate}</td></tr>
          })
        }
        </tbody>
        </Table>
        <Form.Group as={Row} controlId="formPlaintextPassword">
        <Form.Label column sm="2">
        Items To Bill:
        </Form.Label>
        <Col sm="4">
        <Form.Control type="text" placeholder="name of the food" name="currentitem" onChange={this.handleChange}/>
        </Col>
        <Col sm="4">
        <Form.Control type="number" placeholder="quantity of item" name="quantity" onChange={this.handleChange}/>
        </Col>
        <Col sm="1">
        <Button variant="primary" type="submit" onClick={this.handleclick3}>
        add
        </Button>
        </Col>
        </Form.Group>
        <Form.Control type="text" placeholder="Name of Person" name="name" onChange={this.handleChange}/>
        <Button variant="primary" type="submit" onClick={this.handleclick4}>
        Send Bill
        </Button>
        </div>
      );
    }
    }
}

export default Home;
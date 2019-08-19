import React from 'react';
import './App.css';
import axios from 'axios';


const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      days: '',
      phone:'',
      zip:'',
      pname:'',
      country: [
        {key:'select', name: 'Select a Country' , states: ['Select a State']},
        {key:'India', name: 'India' , states: ['Select a State','Tamilnadu','Karnataka','Kerala','Telengana','Andhrapradesh']},
        {key:'America' ,name: 'America' , states: ['Select a State','California','Florida','Texas','Newjersey']},
        {key:'Australia' ,name: 'Australia', states: ['Select a State','Wales','Queensland','WesternAustralia','Victoria','Tasmania']},
        {key:'England' ,name: 'England', states: ['Select a State','Berkshire','London','Cornwall','Derby','Medway']},
        {key:'Germany' ,name: 'Germany', states: ['Select a State','Bavaria','Berlin','Bremen','Hamburg','Saarland']}
      ],
      fileupload: '',
      currentcountry: 'Select a Country',
      currentstate: 'Select a State',
      errors: {
        date: '',
        days: '',
        phone:'',
        zip:'',
        pname:'',
        country: '',
        state: '',
        fileupload: ''
      }
    };
   }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let errors = this.state.errors;
    var validationdata = {
      val: value
    };
    switch (name) {
      case 'pname':
      axios.post('http://localhost:3001/checkpname',validationdata)
        .then(res => {
          if(res.data){
            errors.pname = '';
          }
          else{
            errors.pname = 'Name is mandatory and should contain only letters';
          }
        })
        break;
      case 'zip':
      axios.post(`http://localhost:3001/checkzip`,validationdata)
        .then(res => {
          if(res.data){
            errors.zip = '';
          }
          else{
            errors.zip = 'Zipcode is mandatory and should only be in numbers and 5 digits';
          }
        })
        break;
      case 'phone':

      axios.post(`http://localhost:3001/checkphone`,validationdata)
        .then(res => {
          if(res.data){
            errors.phone = '';
          }
          else{
            errors.phone = 'Phone number is mandatory and should only be in numbers and 10 digits';
          }
        })
        break;
      case 'fileupload':
      const data = new FormData();
      data.append('file',e.target.files[0]);
      axios.post('http://localhost:3001/checkfile',data)
        .then(res => {
          if(res.data){
            console.log("true");
            errors.fileupload = '';
          }
          else{
            console.log("false");
            errors.fileupload = 'Product Image is Mandatory';
          }
        })
      break;
      default:
        break;
    }
    if(name==='fileupload'){
      this.setState({errors,[name]:e.target.files[0]});
    }
    else{
      this.setState({errors, [name]: value});
    }


  }

  handleSubmit = e => {
    e.preventDefault();
    const user = {
      pname: this.state.pname,
      phone: this.state.phone,
      zip: this.state.zip,
      file: this.state.fileupload
    };
    console.log(user.date);
    if(validateForm(this.state.errors)) {
      axios.post(`http://localhost:3001/`,user)
        .then(res => {
          if(res.data){
            const data = new FormData();
            data.append('file',this.state.fileupload);
            axios.post('http://localhost:3001/fileupload',data)
              .then(res => {
                if(res.data){
                  alert('Data sent');
                }
                else{
                  alert('Data not sent');
                }
              });
          }
          else{
            alert('Data not sent');
          }
        })
    }else{
      alert('Invalid Form');
    }
  }


  render(){
    const {errors} = this.state;
    let country = this.state.country.filter(c => {
              return c.name === this.state.currentcountry
            })
    return (
      <div className="wrapper">
      <form className='form-wrapper' onSubmit={this.handleSubmit}>
      <p><b>Shipping Info</b></p>
      <p>* Required</p>
      <br/>
      <div className='pname'>
        <label htmlFor="pname">Product Name:*</label>
        <br/>
        <input type='text' name='pname' onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.pname.length > 0 &&
          <span className='error'>{errors.pname}</span>}
      </div>
      <br/>
      <div className='zip'>
        <label htmlFor="zip">Shipping City Zipcode:*</label>
        <br/>
        <input type='numeric' name='zip' onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.zip.length > 0 &&
          <span className='error'>{errors.zip}</span>}
      </div>
      <br/>
      <div className='phone'>
        <label htmlFor="phone">Phone number*</label>
        <br/>
        <input type='int' name='phone' onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.phone.length > 0 &&
          <span className='error'>{errors.phone}</span>}
      </div>
      <br/>
      <div className='fileupload'>
        <label htmlFor="fileupload">Product Image:*</label>
        <br/>
        <input type='file' id='fileupload' name='fileupload' accept="image/png, image/jpeg" onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.fileupload.length > 0 &&
          <span className='error'>{errors.fileupload}</span>}
      </div>
      <br/>
      <br/>
      <div>
        <button className='submit'>Submit</button>
      </div>
      </form>
      </div>
    );
  }
}

export default App;

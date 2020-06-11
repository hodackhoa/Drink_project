import React from 'react';
import axios from '../node_modules/axios'
import './css/overlayPopup.css'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {connect} from 'react-redux'
import {PopUp} from './action'
import {UserLogin} from './action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartPlus} from '@fortawesome/free-solid-svg-icons'

class OverlayPopup extends React.Component {
  constructor(props){
    super(props);
    this.state={
      popUpStyle: 'none',
      linkCart: '',
      userInput: {email: '', password:''},
      inforAlert: '',
      styInp: {}
    }
  }
	handlePopUp=(e)=>{
    if(e.target.getAttribute('class')==="overlayPopup"
      || e.target.getAttribute('id')==="btn-reisterPopup"
      ){
      window.scrollTo(0,0)
      this.setState({
        userInput: {email: '', password:''},
        inforAlert: ''
      })
      this.props.dispatch(PopUp('none'))
    }
	}
  handleCart=(e)=>{
    window.scrollTo(0,0)
    this.setState({
      linkCart: '/cart'
    })
  }
  delayAlert=()=>{
    setTimeout(()=>{
      this.setState({
        styInp: {}
      })
    }
      ,300) 
  }
  handleOnChange=(e)=>{
    let copyState = {...this.state.userInput}
    copyState[e.target.name]= e.target.value
    this.setState({
      userInput: copyState
    })
  }
  handleSubmit=(e, inforInp)=>{
    if(inforInp.email===""||inforInp.password===""){
      this.setState({
        styInp: {animationName: 'userNotInp'}
      })
      this.delayAlert()
    }
    else{
      axios.get('https://my-server-189.herokuapp.com/users?email='+inforInp.email+'&password='+inforInp.password+'&_embed=user_details')
      .then(response=>{
        //console.log(response.data)
        if(response.data.length==0){
          this.setState({
            inforAlert: 'Email hoặc password không đúng, vui lòng thử lại'
          })
        }
        else{
          this.props.dispatch(UserLogin(response.data[0]))
          localStorage.setItem('inforLogin', response.data[0].email+"|"+response.data[0].password)
          this.setState({
            userInput: {email: '', password:''}
          })
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
  }
  render(){
    let amount = 0
    for(let i=0; i<this.props.cart.length;i++){
      amount += parseInt(this.props.cart[i].amount);
    }
  	let stylePopup ={
  		display : this.props.popUpStyle
  	}
    if(this.props.userLogin=='')
      return (
          <div className="overlayPopup" style={stylePopup} onClick={(e)=>this.handlePopUp(e)}>
          	<div id='popUp_login'>
              <h4>Bạn cần đăng nhập để thực hiện mua hàng!</h4>
              <span style={{color:'red', fontSize:'.8em'}}>{this.state.inforAlert}</span>
              <input style={this.state.styInp} type='text' name='email' placeholder='Email' value={this.state.userInput.email} onChange={this.handleOnChange}/>
              <input style={this.state.styInp} type='password' name='password' placeholder='Mật khẩu' value={this.state.userInput.password} onChange={this.handleOnChange}/>
          		<button id='btn-loginPopup' onClick={(e)=>this.handleSubmit(e,this.state.userInput)}>ĐĂNG NHẬP</button>
            	<Link to='/register'><button id='btn-reisterPopup' onClick={this.handlePopUp}>ĐĂNG KÝ</button></Link>
          	</div>
          </div>

      )
    else{
      return (
          <Link to='/cart'>
            <button className="messageCart" style={stylePopup} onClick={(e)=>{this.handleCart(e)}}>
              <div id='cart_info'>
                <FontAwesomeIcon icon={faCartPlus}/>
                <div id='popUpNum'><p>{amount}</p></div>
              </div>
            </button>
          </Link>
        )
    }
  }
}
const mapDispatchToProps=(dispatch)=>{
	return{
		dispatch
	}
}
const mapStateToProps=(state)=>{
	return{
		popUpStyle: state.popUp,
    userLogin: state.userLogin,
    cart: state.cart,
    rePopup: state.rePopup
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(OverlayPopup);
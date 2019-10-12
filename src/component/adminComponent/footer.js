import React from 'react';
import {connect} from 'react-redux'
import {MesageAction} from '../../action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

class AdminFooter extends React.Component {
	constructor(props){
    super(props);
    this.state={
      message: '',
      showMessage: {display: 'none'},
      styleMessage: {},
      hasShow: true,
      delayShow: ()=>{this.delayShow()}
    }
  }
  delayShow=()=>{
    setTimeout(()=>{
      this.props.dispatch(MesageAction(''))
      this.setState({
        showMessage: {display: 'none'}
      })
    },3000)
  }
  static getDerivedStateFromProps(props, state){
    if(props.messageAction!==''){
      state.delayShow();
      return {
        message: props.messageAction,
        styleMessage: {animationName: 'messageAction'},
        showMessage: {display: 'block'}
      }
    }
    else{
      return null
    }
  }
  render(){
    return (
	    <div className="adminFooter">
        <h3>&copy; Copyright Winhouse.com</h3>
        <div id='messageAction' style={this.state.showMessage}>
          <h3 style={this.state.styleMessage}>
            <FontAwesomeIcon icon={faBell} style={{color:'#dea300',fontSize:'1.5em'}}/>
            &emsp;{this.state.message}
          </h3>
        </div>
	    </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return{
    messageAction: state.messageAction
  }
}
const mapDispatchToProps=(dispatch)=>{
  return{
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminFooter);
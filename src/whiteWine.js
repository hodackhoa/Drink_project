import React from 'react';
import axios from '../node_modules/axios'
import NavRegister from './component/navRegister.js'
import NavMenu from './component/navMenu.js';

class WhiteWine extends React.Component {
  render(){
  	let styNavRegis = {
  		position: 'static'
  	}
  	let colorul={
  		color: 'black'
  	}
    return (
      <div className="whiteWine">
      	<NavRegister style={{divRegis:styNavRegis, ulstyle: colorul}}/>
      	<NavMenu index={2}/>
      	<h3>White Wine</h3>
      </div>
    );
  }
}

export default WhiteWine;
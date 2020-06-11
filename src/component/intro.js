import React from 'react';
import '../css/intro.css'
import {connect} from 'react-redux'
import AddToCart from './btnAddToCart.js'
import FormatNum from './formatMoney.js'

class Intro extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			inforIntro:{name:"",link:"",infor:"", price:''},
			dateObj: { date : "", hour:"", minute:"", second: "00"},
			hasIntro: false
		}
	}
	static getDerivedStateFromProps(props, state) {
		if(props.inforIntro.length > 0 && !state.hasIntro){
			let index = Math.floor(Math.random()*props.inforIntro.length)
			return {
				inforIntro: (props.inforIntro[index]!==undefined)?props.inforIntro[index]:state.inforIntro,
				hasIntro: true
			}
		}
		return null;
	}
	componentDidMount(){
		this.loopTimes();
	}
	showDate=()=>{
		let newDate = new Date();
		let copyState = {...this.state.dateObj};
		copyState.date=newDate.getDate();
		copyState.hour = newDate.getHours();
		copyState.minute = newDate.getMinutes();
		copyState.second =newDate.getSeconds();
		this.setState({
			dateObj: copyState
		})
	}
	loopTimes=()=>{
		setInterval((e)=>{
			this.showDate();
		}, 1000)
	}
	render() {
		return (
				<div className="intro">
					<div className='container'>
						<div className='intro_text'>
							<img src={require('../images/null.png')}/>
							<h4>GIỚI THIỆU<br/><img src={require('../images/logo_intro.png')}/></h4>
							<p> 
								Rượu vang là một loại thức uống có cồn được lên men từ nho. 
								Sự cân bằng hóa học tự nhiên nho cho phép nho lên men không cần thêm các loại đường, axit, enzym, nước hoặc chất dinh dưỡng khác. 
								Men tiêu thụ đường trong nho và chuyển đổi chúng thành rượu và carbon dioxit. 
							</p>
							<button>XEM THÊM</button>
						</div>
						<div className='bg_intro'>
							<img src={require('../images/bg_intro.jpg')}/>
							<div className='card'>
								<div className='card_img'>
									<div className='triangle_left'>
										<p>MỚI</p>
									</div>
									<img src={this.state.inforIntro.link}/>
								</div>
								<div className='card_intro'>
									<h5>{(this.state.inforIntro.name).toUpperCase()}</h5>
									<img src={require('../images/logo_Rnho.png')}/><br/>
									<span>{FormatNum(this.state.inforIntro.price)}<sup>đ</sup></span>
									<AddToCart id= {this.state.inforIntro.id}/>
									<p>
										{this.state.inforIntro.infor}
									</p>
									<table className='table' border='1' bordercolor='#e6ae48'>
										<tbody>
											<tr>
												<td>{(this.state.dateObj.date<10)? ("0" + this.state.dateObj.date) : this.state.dateObj.date}<br/><span>NGÀY</span></td>
												<td>{(this.state.dateObj.hour<10)? ("0" + this.state.dateObj.hour) : this.state.dateObj.hour}<br/><span>GIỜ</span></td>
											</tr>
											<tr>
												<td>{(this.state.dateObj.minute<10)? ("0" + this.state.dateObj.minute) : this.state.dateObj.minute}<br/><span>PHÚT</span></td>
												<td>{(this.state.dateObj.second<10)? ("0" + this.state.dateObj.second) : this.state.dateObj.second}<br/><span>GIÂY</span></td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>	
						</div>
					</div>
				</div>
		);
	}
}
 const mapStateToProps = (state)=>{
 	return {
 		inforIntro: state.products
 	}
 }


export default connect(mapStateToProps,null)(Intro);
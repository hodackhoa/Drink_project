import React from 'react';
import {connect} from 'react-redux'
import '../../css/css-adminPage/orderManage.css'
import axios from '../../../node_modules/axios'
import OrderDetails from '../orderDetails.js'
import TabNavAdmin from './tabNavAdmin.js'
import AdminFooter from './footer.js'
import AdminHeader from './header.js'
import FormatNum from '../formatMoney.js'
import FormatDate from '../formatDate.js';
import PageNumber from '../pageNumber.js'
import {AdminPopup} from '../../action'
import {getOrderData} from '../../action'
import {MesageAction} from '../../action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class OrderManage extends React.Component {
	constructor(props){
    super(props);
    this.state={
      orderData: [],
      totalItems: 0,
      orderDetails: [],
      arrshowDetails: [],
      keySearch: '',
      styleInpSearch: {},
      delayFunct: this.delayFunct,
      defaultSelect: 2,
      notifierSearch: '',
      numberPage: 0,
      hasShowList: true
    }
  }
  componentDidMount(){
    axios.get('https://my-server-189.herokuapp.com/orders?_page=1&_limit=10&_expand=user')
    .then(response=>{
      //this.props.dispatch(getOrderData(response.data))
      this.setState({
        totalItems: parseInt(response.headers['x-total-count']),
        orderData: response.data
      })
    })
  }
  componentDidUpdate(){
    if(this.props.adminPopup.display==true){
      this.handleChangeStatusOrder(this.props.adminPopup)
      this.props.dispatch(AdminPopup({display:'none'}))
    }
  }
  static getDerivedStateFromProps(props, state){
    if(props.orderData.length>0 && state.hasShowList){
      return{
        orderData: props.orderData,
        hasShowList: false
      }
    }
    else{
      return null
    }
  }
  handleListNum =(numberPage)=>{
    let copyState = [...this.state.arrshowDetails]
    for(let i=0;i<copyState.length;i++){
      copyState[i] = {display: 'none'}
    }
    let strCheckout=(this.state.defaultSelect===2)? '': '&statusCheckout='+this.state.defaultSelect
    axios.get('https://my-server-189.herokuapp.com/orders?_page='+numberPage+strCheckout+'&_limit=10&_expand=user')
    .then(response=>{
      //console.log(response.data)
      this.setState({
        orderData: response.data,
        arrshowDetails: copyState,
        numberPage: numberPage
      })
    })
  }
  handleOrderStatus=(e)=>{
    let selectCode = parseInt(e.target.value)
    if(e.target.value==2){
      axios.get('https://my-server-189.herokuapp.com/orders?_page=1&_limit=10&_expand=user')
      .then(response=>{
        this.setState({
          orderData: response.data,
          totalItems: parseInt(response.headers['x-total-count']),
          defaultSelect:  selectCode
        })
      })
    }
    else{
      axios.get('https://my-server-189.herokuapp.com/orders?_page=1&_limit=10&statusCheckout='+ e.target.value+'&_expand=user')
      .then(response=>{
        this.setState({
          orderData: response.data,
          totalItems: parseInt(response.headers['x-total-count']),
          defaultSelect: selectCode
        })
      })
    }
  }
  handleChangeStatusOrder=(e,index,obj,code)=>{
    if(e.display){
      let objTemp = {...obj}
      objTemp.statusCheckout = e.code
      axios.patch('https://my-server-189.herokuapp.com/orders/'+ e.idDel, objTemp)
      .then(response=>{
        //console.log(response.data)
        let strCheckout=(this.state.defaultSelect===2)? '': '&statusCheckout='+this.state.defaultSelect
        axios.get('https://my-server-189.herokuapp.com/orders?_page='+this.state.numberPage+'&_limit=10'+strCheckout+'&_expand=user')
        .then(response=>{
          this.state.orderData[e.indexDel].statusCheckout = e.code
          this.props.dispatch(getOrderData(this.state.orderData))
          let alertText=(e.code===3)?'Đã hủy đơn hàng!': 'Đơn hàng được chuyển sang "Đã thanh toán"'
          this.props.dispatch(MesageAction(alertText))
          //---------------------------------
          this.setState({
            orderData: response.data,
            totalItems: parseInt(response.headers['x-total-count'])
          })
        })
      }).catch((err)=>{
        console.log(err)
      })
    }
    else{
      let alertText = (code===3)?'HỦY ĐƠN HÀNG ?': 'ĐƠN HÀNG ĐÃ ĐƯỢC THANH TOÁN?'
      this.props.dispatch(AdminPopup({display:'block',idDel: obj.id, indexDel: index,code: code,alertText:alertText}))
    }
  }
  handleShowDetail=(e,id,index)=>{
    axios.get('https://my-server-189.herokuapp.com/orders/'+id+'?_embed=order_details&_expand=user')
    .then(response=>{
      let copyState = [...this.state.arrshowDetails]
      for(let i=0;i<copyState.length;i++){
        if(i!==index){
          copyState[i] = {display: 'none'}
        }
      }
      copyState[index] = (copyState[index].display==="block")? {display: 'none'} : {display: "block"}
      this.setState({
        orderDetails: response.data.order_details,
        arrshowDetails: copyState
      })
      //
    }).catch((err)=>{
      console.log(err)
    })
  }
  //---------------------
  delayFunct=()=>{
    setTimeout(()=>{
      this.setState({
        styleInpSearch: {}
      })
    }, 500)
  }
  handleInputSearch=(e)=>{
    this.setState({
      keySearch: e.target.value
    })
  }
  handleSearch=(e)=>{
    if(this.state.keySearch===''){
      this.setState({
        styleInpSearch: {animationName: 'alertSearch'}
      })
      this.delayFunct()
    }
    else{
      axios.get('https://my-server-189.herokuapp.com/orders?numObj='+this.state.keySearch+'&_embed=order_details&_expand=user')
      .then(response=>{
        if(response.data.length>0){
          this.setState({
            orderData: response.data,
            totalItems: parseInt(response.data.length),
            keySearch: '',
            defaultSelect: 'search',
            notifierSearch: ''
          })
        }
        else{
          this.setState({
            orderData: response.data,
            totalItems: parseInt(response.data.length),
            keySearch: '',
            defaultSelect: 'search',
            notifierSearch: 'Không tìm thấy đơn hàng có mã '+this.state.keySearch+' trong hệ thống!',

          })
        }
      })
    }
  }
  render(){
    const listOrders = this.state.orderData.map((item,index)=>{
      this.state.arrshowDetails.push({display:'none'})
      return (
        <div  key={index} className='orders-admin'>
          <div className='ordersAdmin-child' id ='infor-orderChild'>
            <h3>Mã đơn hàng: <span className='proNameSty'>{item.numObj}</span></h3>
            <h4>{FormatDate(item.dateCreate)}</h4>
          </div>
          <div className='ordersAdmin-child'>
            <h3>Khách hàng:&ensp;<span className='proNameSty'>{item.user.email}</span></h3>
            <h3>Trạng thái:
              <span className='proNameSty'>
                &nbsp;{(item.statusCheckout===1)?'Đã thanh toán'
                :(item.statusCheckout===0)?'Chưa thanh toán': 'Đã hủy'}
              </span>
            </h3>
          </div>
          <div className= 'ordersAdmin-child' id ='orderChild-details'>
            <h3>Tổng tiền: <span className='priceStyle'>{FormatNum(item.totalBill)}<sup>đ</sup></span></h3>
            <h4 onClick={(e)=>this.handleShowDetail(e,item.id,index)}>Chi tiết</h4>
          </div>
          <div className= 'ordersAdmin-child' id= 'btn-ordersAdmin'>
            {(item.statusCheckout===0)?
              <button className='btn-Default' id='btn-confirmCheckout' onClick={(e)=>this.handleChangeStatusOrder(e,index,item,1)}>ĐÃ THANH TOÁN</button>
              : null}
            {(item.statusCheckout!==3)?
              <button className='btn-Default' id='btn-cancelOrder' onClick={(e)=>this.handleChangeStatusOrder(e,index,item,3)}>HỦY</button>
              : null}
          </div>
          <div className='ordersAdmin-details' style={this.state.arrshowDetails[index]}>
            <OrderDetails orderDetails= {this.state.orderDetails}/>
          </div>
        </div>
      )
    })
    return (
	    <div className="orderManage">
        <AdminHeader/>
        <div className='admin-Layout'>
          <TabNavAdmin/>
          <div className='orderManage-main'>
            <div id='infor-orderManage'>
              <h2>QUẢN LÝ ĐƠN HÀNG</h2>
              <h3>SỐ LƯỢNG: {this.state.totalItems}</h3>
              <div id= 'filter-Order'>
                <select onChange={this.handleOrderStatus} value={this.state.defaultSelect}>
                  <option value={2}>Tất cả</option>
                  <option value={1}>Đã thanh toán</option>
                  <option value={0}>Chưa thanh toán</option>
                  <option value={3}>Đã hủy</option>
                  {(this.state.defaultSelect==='search')?
                    <option value= 'search'></option>: null}
                </select>
                <div id='searchOrder'>
                  <input 
                    style={this.state.styleInpSearch} 
                    type='number' placeholder='Nhập mã đơn hàng' 
                    value={this.state.keySearch} 
                    onChange={this.handleInputSearch}
                  />
                  &ensp;<FontAwesomeIcon icon={faSearch} onClick={this.handleSearch}/>
                </div>
              </div>
            </div>
            <div id = 'list-orderManage'>
              {listOrders}
            </div>
            <PageNumber
              amountItem = {10}
              totalItems={this.state.totalItems}
              handleListNum={this.handleListNum}
              notifierSearch={this.state.notifierSearch}
            />
          </div>
          <AdminFooter/>
        </div>
	    </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return{
    adminLogin: state.adminLogin,
    orderData: state.orderData,
    adminPopup: state.adminPopup
  }
}
const mapDispatchToProps=(dispatch)=>{
  return{
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderManage);
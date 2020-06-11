import React from 'react';
import axios from '../../node_modules/axios'
import '../css/listProduct.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Switch} from 'react-router'
import {connect} from 'react-redux'
import ProductInf from './productInf.js'
import {showProDetail} from '../action'
import PageNumber from './pageNumber.js'

class ListProduct extends React.Component {
  constructor(props){
    super(props);
    this.state={
      numberList: [],
      products: [],
      totalItems: 0,
      pagePresent: 0,
      hasShowList: false
    }
  }
  componentDidMount(){
    axios.get('https://my-server-189.herokuapp.com/products?_page=1&_limit=9&categoryId='+this.props.categoryId+'&_embed=product_details')
    .then(response=>{
      this.setState({
        totalItems: parseInt(response.headers['x-total-count']),
        products: response.data
      })
    })
  }
  handleLink=(objProduct)=>{
    this.props.dispatch(showProDetail(objProduct))
  }
  handleListNum=(numberPage)=>{
    axios.get('https://my-server-189.herokuapp.com/products?_page='+numberPage+'&_limit=9&categoryId='+this.props.categoryId+'&_embed=product_details')
    .then(response=>{
      this.setState({
        totalItems: parseInt(response.headers['x-total-count']),
        products: response.data,
        pagePresent: numberPage
      })
    })
  }
  static getDerivedStateFromProps(props,state){
    if(state.hasShowList){
      let arrTemp = []
      for(let i=0;i<props.products.length;i++){
        if(props.categoryId===props.products[i].categoryId){
          arrTemp.push(props.products[i])
        }
      }
      return {products: arrTemp, productsOrg: arrTemp, hasShowList: false}
    }
    else {return null}
  }

  render(){
    var listCate  = this.props.categories.map((item,index)=>{
      var listProduct = this.props.products.map((item2,index2)=>{
        if(item2.categoryId===item.id){
          return (
              <li key={index2}>
                <Link to='/productDetail' onClick={(e)=>this.handleLink(item2)}>{item2.name}</Link>
              </li>
            )
        }
      })
      return(
          <ul key={index}>
            <li><h4>{(item.name).toUpperCase()}</h4>
              <ul>
                {listProduct}
              </ul>
            </li>
          </ul>
        )
    })
    var listImg = this.state.products.map((item,index)=>{
      return(
          <ProductInf key={index} item={item} bgLabel={'white'}/>
        )
    })
    return (
	      <div className="listProduct">
          <img id='bgImg1' src={require('../images/bannerRuouVang.jpg')} />
          <div className='listText' style={{marginTop:'2em'}}>
            <h4 style={{marginTop:'0'}}>DANH MỤC SẢN PHẨM</h4>
            <img src={require('../images/logo_Rnho.png')} />
            {listCate}
            <div className='newSP'>
                <h4 style={{marginTop:'0'}}>SO SÁNH SẢN PHẨM</h4>
                <img src={require('../images/logo_Rnho.png')} />
                <p>Bạn chưa có sản phẩn nào để so sánh</p>
            </div>
            <div className='tag'>
                <h4 style={{marginTop:'0'}}>TAG SẢN PHẨM</h4>
                <img src={require('../images/logo_Rnho.png')} />
                <div className='item_tag'>
                    <button>Đồng hồ</button>
                    <button>Túi</button>
                    <button>Phụ kiện </button>
                    <button>Giày</button>
                    <button>Sandal</button>
                    <button>Đồ trẻ em</button>
                    <button>Áo sơ mi</button>
                    <button>Nước hoa </button>
                </div>
            </div>
            <div className='img_R'>
                <img src={require('../images/RNgoai.png')} />
            </div>
          </div>
          <div className='products' style={{marginTop:'2em'}}>
            <PageNumber 
              amountItem = {9}
              totalItems={this.state.totalItems}
              handleListNum={this.handleListNum}/>
            <div className='listMesh'>
              {listImg}
            </div>
          </div>
	      </div>

    );
  }
}
const mapStateToProps=(state)=>{
  return{
    products: state.products,
    categories: state.categories
  }
}

export default connect(mapStateToProps, null)(ListProduct);
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关的数据
let imageDatas = require('../data/imagedata.json');
//利用自执行函数，将图片名信息转成图片URL路径信息
/*
* param： 就是图片的信息对象集合的数组 属性有fileName desc title等
  return： 是url路径 实际路径
*/
imageDatas = (function genImageURL(imageDataArr){
	for (var i = 0, j = imageDataArr.length; i<j; i++) {
		var singleImageDate = imageDataArr[i];

		singleImageDate.imageURL= require('../images/'+ singleImageDate.fileName);
		imageDataArr[i] = singleImageDate; // 将原来的对象替换为 添加了imageurl属性的新对象
	}
	return imageDataArr;
})(imageDatas);
//获得一个随机数 在 low 和high 范围之间
function getRangeRandom(low,high) {
	return Math.ceil(Math.random()* (high - low) + low);
}

// 获得一个角度 
function get30DegRandom() {
	return ((Math.random()<0.5 ? '':'-' )+ Math.ceil(Math.random() * 30))
}

// 一个部分 图片标签组件 <Imgfigure >
var ImgFigure = React.createClass({
	render: function () {
		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
			// console.log(styleObj);	
		}

		if (this.props.arrange.rotate) {
			(['-moz-','-ms-', 'webkit', '']).forEach(function (argument) {
				styleObj['transform'] = 'rotate('+ this.props.arrange.rotate +'deg)';
			}.bind(this));
			
		}

		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL}
				 alt={this.props.data.title}/>
				<figcaption>
					<h2>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});

class AppComponent extends React.Component {
	constructor() {
	    super();
		this.Constant = {
			centerPos:{
				left: 0,
				right: 0
			},
			hPosRange:{
				leftSecX:[0,0],
				rightSecX:[0,0],
				y:[0,0]
			},
			vPosRange:{
				x: [0,0],
				topY:[0,0]
			}
		};
		this.state = {
	      imgsArrangeArr: [
	        // {
	         // pos:{
	         //   left:'0',
	         //   top:'50'
	         // }
	        //  rotate:0, //旋转角度
	        //  isInverse:false //正反面,false表示正面
	        //  isCenter:false 图片是否居中
	        //}
	      ]
	    };
	}
	// 重新布局所有的图片 指定居中哪个图片
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY =vPosRange.topY,
			vPosRangeX = vPosRange.x,


			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2), //取得一个或者不取得
			topImgSpliceIndex = 0, // 上边有几个
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);// imgsArrangeArr 删除指定的元素 并返回给 imgsArrangeCenterArr
			
			imgsArrangeCenterArr[0].pos = centerPos; //居中选中的元素
			imgsArrangeCenterArr[0].rotate = 0; //布局中心的值 不需要

			topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
			// console.log("imgsArrangeArr.length"+imgsArrangeArr.length);
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			// 布局上面的
			imgsArrangeTopArr.forEach(function (value, index) {
				imgsArrangeTopArr[index]= {
					pos:{
						top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate:get30DegRandom()
				}
			});

			// 布局左右
			for (var i = 0,j = imgsArrangeArr.length,k = j / 2; i<j ; i++) {
				var hPosRangeLORX =null;
				// 遍历前半部分 和后半部分 设置不同的范围
				if(i<k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}
				imgsArrangeArr[i] = {
					pos:{
						top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate:get30DegRandom()
				}
			}

			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}
			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
	          	imgsArrangeArr: imgsArrangeArr
	        });

	}
	// getInitialState(){
	// 	console.log(123132132);
	// 	return {
	// 		imgsArrangeArr:[

	// 		]
	// 	}
	// }

	componentDidMount(){
		// 首先拿到舞台的相关信息
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
			
		// 拿到imgfigure 大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW =Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		// 计算中中心位置点
		this.Constant.centerPos = {
			left: halfStageW -halfImgW,
			top: halfStageH - halfImgH
		}

		// 计算左侧范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW *3;
		// 计算右侧范围
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		// 左右的高度一样
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH -halfImgH;

		// 计算上面的高度 以及左右范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH *3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}
  render() {
  	var controllerUnits = [],
  		imgFigures = [];
  	//遍历图片对象数组 将每个对象传给ImgFigure标签 一起添加到 imgFigures数组中
  	imageDatas.forEach(function (value, index) {
  		// console.log(this.state.imgsArrangeArr[index]);
  		if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left: 20,
            top: 0
          },
          rotate:0
        }
      }
  		imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>);
  		// console.log(this.state.imgsArrangeArr[index]);
  	}.bind(this));
    return (
    	<section className="stage" ref="stage">
    		<section className="img-sec">
    			{imgFigures}
    		</section>
    		<nav className="controller-nav">
    			{controllerUnits}
    		</nav>
    	</section>
      
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

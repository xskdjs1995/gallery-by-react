require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');
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

		singleImageDate.imageURL= require('../images'+singleImageDate.fileName);
		imageDataArr[i] = singleImageDate; // 将原来的对象替换为 添加了imageurl属性的新对象
	}
	return imageDataArr;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
        <span> 我是谁啊 </span>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

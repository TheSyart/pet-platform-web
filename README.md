# 宠物护理平台 - web 网页端 

## 1.简介
Web网页端为店家提供全方面的管理服务，主要以为用户配送商品订单，门店提供宠物服务，配备客服为用户及时解决问题，以及可视化的Echart统计表格。

## 2.技术栈
采用了当下流行的Vue框架+Element组件，并对Element组件进行二次封装(如多种不同功能表单，分页表格，照片上传等组件)便利开发；也对每个页面不同功能代码进行封装：首先是进行网络请求的api文件，其次是包含该页面所需的子组件及表单校验规则的配置文件，以提高代码的维护性和扩展性；也添加了不同的角色管理，灵活的通过其相应身份展示页面；还以Echart表格为商家直观展示出店铺情况；最后为了方便订单的配送，集成高德 JavaScript API技术， 根据订单地址经纬度坐标，实现从店家地址到用户地址的驾车，步行，骑行三种导航路线总览的任意切换。

## 3.照片展示

### 登录  
<img src="https://github.com/user-attachments/assets/6484005e-6230-4414-a4fc-bae8adcf6d8b" width="500px">

### 统计类页面  
<img src="https://github.com/user-attachments/assets/3b11ccff-237e-485a-8501-2f8b9a449d78" width="500px">
<img src="https://github.com/user-attachments/assets/a5060bbb-05e4-4929-a736-46fee70a4bec" width="500px">
<img src="https://github.com/user-attachments/assets/a5210cea-a165-457a-a89a-7d6b4b31f0ba" width="500px">

### 订单管理页面  
<img src="https://github.com/user-attachments/assets/91fdb874-17fc-4b64-8118-394e7b326e7c" width="500px">
<img src="https://github.com/user-attachments/assets/76bbcfa6-8e1f-4365-a0c4-22b461d0d7bd" width="500px">
<img src="https://github.com/user-attachments/assets/f67cb34e-2d66-4530-b312-d6f270068a38" width="500px">

### 常规信息界面  
<img src="https://github.com/user-attachments/assets/6232757e-f8ee-47d4-8ec3-e0c6929553ec" width="500px">

### 会话界面  
<img src="https://github.com/user-attachments/assets/651979b8-662d-4414-a8da-4cbbe4a5528c" width="500px">

### 个人中心  
<img src="https://github.com/user-attachments/assets/fff59fa9-c727-4566-899f-ee8b60f503ab" width="500px">

## 4.工程的配置文件  
在src\views\resource\private\key.js下新建配置文件即可  
填上你的高德秘钥

<img src="https://github.com/user-attachments/assets/d8f1d596-052d-4e6d-a770-bef9d2054cc4" width="500px" alt="高德地图秘钥">  


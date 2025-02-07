# 宠物护理平台 - springboot 后端 

## 1.简介
Spring Boot是一款轻量级、高效的Java开发框架，极大地简化了Spring应用的开发流程。它基于Spring框架，提供自动配置功能，可根据项目依赖自动设置好常见的配置，减少了开发者手动配置的工作量。

通过内置服务器，如Tomcat、Jetty等，能让应用快速运行起来。同时，它支持多种打包方式，方便部署到不同环境。Spring Boot还具备丰富的插件和工具，便于进行监控、管理。凭借这些特性，开发者能更专注于业务逻辑，提高开发效率，广泛应用于Web开发、微服务等领域。 

## 2.技术栈
1.在开发效率上：使用Maven包管理工具、Mybatis高效编写数据库语句、PageHelper实现高效分页查询和Lombok便捷了实体类的封装。  
2.在安全性方面：首先使用JWT令牌保障用户信息安全，其次使用了阿里云短信服务为用户提供高效安全的登录校验服务，并且添加@Valid注解进行数据校验；其次我还使用了定时器，为订单进行状态的自动更新。最后使用WebSocket，接受客户和客服的不同种类型消息，实现两端实时通讯，将文字、图片、语音和视频(同时获取第一帧封面照片，优化消息展示，提高流畅度)进行存储。

## 3.照片展示  
登录  
<img src="https://github.com/user-attachments/assets/6484005e-6230-4414-a4fc-bae8adcf6d8b" width="210px">
<img src="https://github.com/user-attachments/assets/3b11ccff-237e-485a-8501-2f8b9a449d78" width="210px">
<img src="https://github.com/user-attachments/assets/a5060bbb-05e4-4929-a736-46fee70a4bec" width="210px">
<img src="https://github.com/user-attachments/assets/a5210cea-a165-457a-a89a-7d6b4b31f0ba" width="210px">
<img src="https://github.com/user-attachments/assets/6232757e-f8ee-47d4-8ec3-e0c6929553ec" width="210px">
<img src="https://github.com/user-attachments/assets/651979b8-662d-4414-a8da-4cbbe4a5528c" width="210px">
<img src="https://github.com/user-attachments/assets/fff59fa9-c727-4566-899f-ee8b60f503ab" width="210px">
<img src="https://github.com/user-attachments/assets/91fdb874-17fc-4b64-8118-394e7b326e7c" width="210px">
<img src="https://github.com/user-attachments/assets/76bbcfa6-8e1f-4365-a0c4-22b461d0d7bd" width="210px">
<img src="https://github.com/user-attachments/assets/51a844e6-f4e8-4106-97c9-9de544f5031d" width="210px">

## 4.工程的配置文件  
在Spring\pet\src\main\resources\下新建配置文件即可

### 1.application.yml文件
<img src="https://github.com/user-attachments/assets/b8420a42-905d-4f9c-9eb5-cd3186fea8d3" width="210px" alt="高德地图秘钥">  

```java
spring:
  profiles:
    active: dev
  servlet:
    # 上传文件大小限制
    multipart:
      max-file-size: 100MB
      max-request-size: 200MB
  web:
    resources:
      cache:
        period: 0
      # 文件存储路径
      static-locations: ${STORAGE_PATH}

# 阿里云短信模版 注册，登录，修改个人信息模版
phone:
  message:
    register: xxxx
    login: xxxx
    change: xxxxx

# 阿里云秘钥
aliyun:
  accessKeyId: xxxxx
  accessKeySecret: xxxxxx
```


### 2.application-dev.yml开发环境下文件 
<img src="https://github.com/user-attachments/assets/1229803e-6138-40f6-86b2-9159298d4342" width="210px" alt="网络配置1"> 

```java
spring:
  # 数据库配置
  datasource:
    url: jdbc:mysql://xxx.xxx.xxx.xxx:xxxx/pet_platform
    username: xxxx
    password: xxxxxx
    driver-class-name: com.mysql.cj.jdbc.Driver
    jpa:
      hibernate:
        ddl-auto: update
      database-platform: org.hibernate.dialect.MySQL8Dialect

mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  mapper-locations: classpath:mapper/**/*.xml

# 订单编号秘钥
order:
  key: xxxxxxxxxxxxxxxxxxx

logging:
  level:
    org.springframework.web: DEBUG

server:
  port: 8080
  address: 0.0.0.0

# ip地址
server-ip: xxx.xxx.xxx.xxx

# 定时器
scheduler:
  cron:
    expression: 0 0 * * * *
```

### 3.application-prod.ymls生产环境下文件 
根据application-dev.yml更改即可


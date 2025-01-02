import store from '@/store';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.username = '';
        this.listeners = [];
    }

    // 初始化 WebSocket 连接
    connect(username) {
        if (this.socket) {
            console.log("WebSocket 已连接");
            return;
        }

        this.username = username;
        this.socket = new WebSocket(`ws://localhost:8080/ws?username=${username}`);
        console.log(store.getters.getGlobalVar.jwt);

        this.socket.onopen = () => {
            console.log("WebSocket 连接成功！");
        };

        this.socket.onmessage = (event) => {
            this._notifyListeners(event.data);
        };

        this.socket.onclose = () => {
            console.log("WebSocket 连接关闭！");
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket 连接出错: ", error);
        };
    }

    // 发送消息
    sendMessage(message,receiver) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const sendMessage = `${receiver}:${message}`;
            this.socket.send(sendMessage);
        } else {
            console.error("WebSocket 未连接");
        }
    }

    // 监听接收到的消息
    onMessage(callback) {
        this.listeners.push(callback);
    }

    // 通知所有监听器
    _notifyListeners(message) {
        this.listeners.forEach((callback) => {
            callback(message);
        });
    }

    // 断开连接
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default new WebSocketService();

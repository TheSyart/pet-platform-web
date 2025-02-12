import store from '@/store';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.username = '';
        this.listeners = [];
    }

    // 初始化 WebSocket 连接
    connect() {
        if (this.socket) {
            console.log("WebSocket 已连接");
            return;
        }
        const host = window.location.host;
        if (host.includes('localhost')) {
            this.socket = new WebSocket(`ws://localhost:8080/ws?token=${store.getters.getGlobalVar.jwt}`);
        } else {
            this.socket = new WebSocket(`ws://118.178.254.196:8080/ws?token=${store.getters.getGlobalVar.jwt}`);
        }


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
    sendMessage(msg) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const jsonMessage = JSON.stringify(msg);
            this.socket.send(jsonMessage);
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
            callback(JSON.parse(message));
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

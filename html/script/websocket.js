var uId = '';
var button = document.getElementsByClassName('console-send')[0];
var messageInput = document.getElementsByName('console-command')[0];
var contentMessage = document.getElementsByClassName('console-content')[0];

var WebsocketClass = function(host, protocol){	
	this.socket = new WebSocket(host, protocol);
	this.console = document.getElementsByClassName('console-log')[0];
};
WebsocketClass.prototype = {
	initWebsocket : function(){
		var $this = this;
		this.socket.onopen = function(){
			$this.onOpenEvent(this);
		};
		this.socket.onmessage = function(e){
			$this._onMessageEvent(e);
		};
		this.socket.onclose = function(){
			$this._onCloseEvent();
		};
		this.socket.onerror = function(error){
			$this._onErrorEvent(error);
		};
		this.console.innerHTML = this.console.innerHTML + 'websocket init <br />';
	},
	_onErrorEvent :function(err){
		console.log(err);
		this.console.innerHTML = this.console.innerHTML + 'websocket error <br />';
	},
	onOpenEvent : function(socket){
		console.log('socket opened');
		this.console.innerHTML = this.console.innerHTML + 'socket opened, status: ' + socket.readyState + '<br />';
	},
	_onMessageEvent : function(e){
		e = JSON.parse(e.data);
		
		if(e.msg.length > 0) e.msg = JSON.parse(e.msg);
		
		contentMessage.innerHTML = contentMessage.innerHTML 
			+ '<strong>&gt;</strong> : ' + e.msg.message + '<br />';
		contentMessage.scrollTop = contentMessage.scrollHeight;
		this.console.innerHTML = this.console.innerHTML + 'message received<br />';
		this.console.scrollTop = this.console.scrollHeight;
	},
	_onCloseEvent : function(){
		console.log('connection closed');
		this.console.innerHTML = this.console.innerHTML + 'websocket closed - server not running<br />';
		uId = '';
	},
	sendMessage : function(){
		var message = '{"message":"' + messageInput.value + '"}';
		this.socket.send('{"action":"ctrl/cmd/out", "msg":' + JSON.stringify(message) + '}');
		messageInput.value = '';
		this.console.innerHTML = this.console.innerHTML + 'message sent <br />';
		
	}
};
var socket = new WebsocketClass('ws://piernov.org:8181', 'echo');
socket.initWebsocket();
if(button.addEventListener){
	button.addEventListener('click',function(e){
		e.preventDefault();
		socket.sendMessage();
		return false;
	}, true);
} else{
	console.log('addEventListener unavailable');
}

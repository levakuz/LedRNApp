
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import uuid from 'react-native-uuid';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync : {
    }
  });
const defaultConnectOptions={
    reconnect: false,
    cleanSession: true,
    mqttversion:3,
    keepAliveInterval: 60,
    timeout: 60
}
export default class MQTTConnection{
    constructor(){
        this.mqtt=null;
        this.QOS=0;
        this.RETAIN=true;

    }
    connect(host, port, options = null){
        if(options){
            this.QOS = options.qos;
            this.RETAIN = options.retain;
        }
        let currentTime = +new Date();
        let clientID = currentTime + uuid.v1();
        clientID = clientID.slice(0,23);
        console.log('ClientID: ', clientID)
        
        this.mqtt = new Paho.MQTT.Client(host, port, clientID);
        this.mqtt.onConnectionLost = (res) =>{
            this.onMQTTLost;
        };
        this.mqtt.onMessageArrived = (message) =>{
            this.onMessageArrived(message);
        };
        this.mqtt.onMessageDelivered = (message) => {
            this.onMQTTMessageDelivered(message);
        };
        const connectOptions = options ? options: defaultConnectOptions;

        this.mqtt.connect({
            onSuccess: this.onMQTTConnect,
            onFailure: this.onMQTTLost,
            ...connectOptions
        });
    }
    onMQTTSUccess = () =>{
        this.onMQTTConnect()
    }
    onMQTTFailure = () => {
        this.onMQTTLost()
    }
    subscribeChannel(channel){
        console.log('Mqttconnection subscribeChannel: ', channel)
        if (!this.mqtt || !this.mqtt.isConnected()){
            return;
        }
        this.mqtt.subscribe(channel.this.QOS);
    }
    unsubscribeChannel(channel){
        console.log('Mqttconnection subscribeChannel: ', channel)
        if (!this.mqtt || !this.mqtt.isConnected()){
            return;
        }
        this.mqtt.unsubscribe(channel.this.QOS);
    }
    send(channel = null, payload){
        console.log('MQTTConnection send: ')
        if (!this.mqtt || !this.mqtt.isConnected()) {
            return;
            
        }
        if (!channel || !payload) {
            return false;
            
        }
        console.log('MQTTConnection send publish channel: ${channel), payload: ${payload}, qos')
        this.mqttpublish(channel,payload, this.QOS, this.RETAIN);

    }

    close(){
        this.mqtt && this.mqtt.disconnect();
        this.mqtt = null;
    }
}

MQTTConnection.prototype.onMQTTConnect =null
MQTTConnection.prototype.onMQTTLost =null
MQTTConnection.prototype.onMQTTMessageArrived =null
MQTTConnection.prototype.onMQTTMessageDelivered =null



  
  function onConnect() {
    console.log("onConnect");
  }
  
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }
  
  function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
  }
  
  const client = new Paho.MQTT.Client('192.168.1.98', 1883, 'uname');
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({ onSuccess:onConnect, useSSL: true });
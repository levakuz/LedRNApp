import * as React from 'react';
import {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput,  Button, Alert,TouchableHighlight, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorPicker, TriangleColorPicker } from 'react-native-color-picker'
import { Client, Message } from 'react-native-paho-mqtt';
import tinycolor from 'tinycolor2'



function MQTTConnectUSerIp(){
  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };
  var newip = 'ws://' + '192.168.1.1' + ':' + '9001' + '/ws'
  console.log(newip)
  // Create a client instance
  window.client = new Client({ uri: newip, clientId: 'clientId', storage: myStorage });
  
  // set event handlers
  client.on('connectionLost', (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log(responseObject.errorMessage);
    }
  });
  client.on('messageReceived', (message) => {
    console.log(message.payloadString);
  });
  client.connect()
  .then(() => {
  client.subscribe('room1/zone1')
  client.subscribe('room1/zone2')
  client.subscribe('room1/zone3')
  client.subscribe('room1/zone4')
  client.subscribe('room1/allroom')
  client.subscribe('room1/zone1/color')
  client.subscribe('room1/zone2/color')
  client.subscribe('room1/zone3/color')
  client.subscribe('room1/zone4/color')
  client.subscribe('room1/allroom/color')
  })
}
  
function MQTTConnectScreen({navigation}) {
  const [ip, onChangeTextIp] = React.useState('Введи IP MQTT брокера');
  const [port, onChangeTextPort] = React.useState('Введи PORT MQTT брокера');
  MQTTConnectUSerIp();
  return (  
    <View style={styles.vievcontainer}>
      {/* <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white' }}
        onChangeText={ip => onChangeTextIp(ip)}
        ip={ip}
        
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white' }}
        onChangeText={port => onChangeTextPort(port)}
        port={port}
        
      />
      
      <TouchableHighlight onPress={ () => MQTTConnectUSerIp(ip,port)} style={styles.modeButtonBorder}>
        <Text style={styles.modeButtonsText}>Подтвердить</Text>
      </TouchableHighlight> */}
      <TouchableHighlight onPress={() => navigation.navigate('ColorScreen')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Выбор цветов</Text>
        </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('ColorRealTimeChoose')} style={styles.ModePageButton}>
        <Text style={styles.modeButtonsText}>Выбор цветов в режиме реального времени</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('ModeScreen')} style={styles.ModePageButton}>
        <Text style={styles.modeButtonsText}>Выбор режимов</Text>
      </TouchableHighlight>        
    </View>
        
        
      
  );
}


function SendColorToMQTTAR(color){
  color = tinycolor(color).toHexString();
  var newcolor;
  newcolor = color.replace("#","");
  newcolor=newcolor.toUpperCase();
  console.log(newcolor);
  const message = new Message(newcolor);
  message.destinationName = 'room1/allroom/color';
  client.send(message);
}
function SendColorToMQTTZone1(color){
  color = tinycolor(color).toHexString();
  var newcolor;
  newcolor = color.replace("#","");
  newcolor=newcolor.toUpperCase();
  console.log(newcolor);
  const message = new Message(newcolor);
  message.destinationName = 'room1/zone1/color';
  client.send(message);
}
function SendColorToMQTTZone2(color){
  color = tinycolor(color).toHexString();
  var newcolor;
  newcolor = color.replace("#","");
  newcolor=newcolor.toUpperCase();
  console.log(newcolor);
  const message = new Message(newcolor);
  message.destinationName = 'room1/zone2/color';
  client.send(message);
}
function SendColorToMQTTZone3(color){
  color = tinycolor(color).toHexString();
  var newcolor;
  newcolor = color.replace("#","");
  newcolor=newcolor.toUpperCase();
  console.log(newcolor);
  const message = new Message(newcolor);
  message.destinationName = 'room1/zone3/color';
  client.send(message);
}
function SendColorToMQTTZone4(color){
  color = tinycolor(color).toHexString();
  var newcolor;
  newcolor = color.replace("#","");
  newcolor=newcolor.toUpperCase();
  console.log(newcolor);
  const message = new Message(newcolor);
  message.destinationName = 'room1/zone4/color';
  client.send(message);
}

function ColorScreen({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
            
      
        <TouchableHighlight onPress={() => navigation.navigate('ModeScreen')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Выбор режима</Text>
        </TouchableHighlight>
        
        <TriangleColorPicker
          onColorChange={color =>  SendColorToMQTTAR(color)}   
          onColorSelectedAR={color =>  oldColor=color}
          onColorSelectedAR={(color, room) =>  SendColorToZoneMQTT(color, room)}
          onColorSelected1={color =>  oldColor=color}
          onColorSelected1={(color, room) =>  SendColorToZoneMQTT(color, room)}
          onColorSelected2={color =>  oldColor=color}
          onColorSelected2={(color, room) =>  SendColorToZoneMQTT(color, room)}
          onColorSelected3={color =>  oldColor=color}
          onColorSelected3={(color, room) =>  SendColorToZoneMQTT(color, room)}
          onColorSelected4={color =>  oldColor=color}
          onColorSelected4={(color, room) =>  SendColorToZoneMQTT(color, room)}
          
          style={styles.colorpicker}
        />    
            
    </View>
        
        
      
  );
}
function ColorRealTimeChoose({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
            
        <View style={styles.modeButtonsRealTimeAR}>
        <TouchableHighlight onPress={() => navigation.navigate('ColorRealTimeChooseAR')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Вся комната</Text>
        </TouchableHighlight>
        </View>
        <View style={styles.modeButtonsView}>
        <TouchableHighlight onPress={() => navigation.navigate('ColorRealTimeChooseZone1')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Зона 1</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate('ColorRealTimeChooseZone2')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Зона 2</Text>
        </TouchableHighlight>
        </View>
        <View style={styles.modeButtonsView}>
        <TouchableHighlight onPress={() => navigation.navigate('ColorRealTimeChooseZone3')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Зона 3</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate('ColorRealTimeChooseZone4')} style={styles.ModePageButton}>
          <Text style={styles.modeButtonsText}>Зона 4</Text>
        </TouchableHighlight>
        </View>
            
    </View>
        
        
      
  );
}

function ColorRealTimeChooseAR({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
      <Text style={{fontSize: 24, textAlign: 'center', color: 'white'}}>All Room Real Time</Text>
            
       <ColorPicker
       onColorChange={color =>  SendColorToMQTTAR(color)}
       style={styles.colorpicker}
       />
            
    </View>
        
        
      
  );
}

function ColorRealTimeChooseZone1({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
      <Text style={{fontSize: 24, textAlign: 'center', color: 'white'}}>Zone 1 Real Time</Text>     
      <ColorPicker
        onColorChange={color =>  SendColorToMQTTZone1(color)}
        style={styles.colorpicker}
      />
            
    </View>
        
        
      
  );
}

function ColorRealTimeChooseZone2({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
      <Text style={{fontSize: 24, textAlign: 'center', color: 'white'}}>Zone 2 Real Time</Text>      
       <ColorPicker
       onColorChange={color =>  SendColorToMQTTZone2(color)}
       style={styles.colorpicker}
       />
            
    </View>
        
        
      
  );
}

function ColorRealTimeChooseZone3({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
    <Text style={{fontSize: 24, textAlign: 'center', color: 'white'}}>Zone 3 Real Time</Text>             
       <ColorPicker
       onColorChange={color =>  SendColorToMQTTZone3(color)}
       style={styles.colorpicker}
       />
            
    </View>
        
        
      
  );
}
function ColorRealTimeChooseZone4({navigation}) {
  
  return (
    
    <View style={styles.vievcontainer}>
    <Text style={{fontSize: 24, textAlign: 'center', color: 'white'}}>Zone 4 Real Time</Text>             
       <ColorPicker
       onColorChange={color =>  SendColorToMQTTZone4(color)}
       style={styles.colorpicker}
       />
            
    </View>
        
        
      
  );
}


function pushMode1Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled){
  if (allRoomEnabled ) {
    
    const message = new Message('1');
    message.destinationName = 'room1/allroom';
    client.send(message);
  } 
  if (zone1Enabled) {
    
    const message = new Message('1');
    message.destinationName = 'room1/zone1';
    client.send(message); 
  }
  if (zone2Enabled) {
    
    const message = new Message('1');
    message.destinationName = 'room1/zone2';
    client.send(message); 
  }
  if (zone3Enabled) {
    
    const message = new Message('1');
    message.destinationName = 'room1/zone3';
    client.send(message); 
  }
  if (zone4Enabled) {
    
    const message = new Message('1');
    message.destinationName = 'room1/zone4';
    client.send(message); 
  }
}
function pushMode2Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled){
  if (allRoomEnabled ) {
    
    const message = new Message('2');
    message.destinationName = 'room1/allroom';
    client.send(message);
  } 
  if (zone1Enabled) {
    
    const message = new Message('2');
    message.destinationName = 'room1/zone1';
    client.send(message); 
  }
  if (zone2Enabled) {
    
    const message = new Message('2');
    message.destinationName = 'room1/zone2';
    client.send(message); 
  }
  if (zone3Enabled) {
   
    const message = new Message('2');
    message.destinationName = 'room1/zone3';
    client.send(message); 
  }
  if (zone4Enabled) {
    
    const message = new Message('2');
    message.destinationName = 'room1/zone4';
    client.send(message); 
  }
}
function pushMode3Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled){
  if (allRoomEnabled ) {
    
    const message = new Message('3');
    message.destinationName = 'room1/allroom';
    client.send(message);
  } 
  if (zone1Enabled) {
    
    const message = new Message('3');
    message.destinationName = 'room1/zone1';
    client.send(message); 
  }
  if (zone2Enabled) {
    
    const message = new Message('3');
    message.destinationName = 'room1/zone2';
    client.send(message); 
  }
  if (zone3Enabled) {
    
    const message = new Message('3');
    message.destinationName = 'room1/zone3';
    client.send(message); 
  }
  if (zone4Enabled) {
    
    const message = new Message('3');
    message.destinationName = 'room1/zone4';
    client.send(message); 
  }
}
function pushMode4Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled){
  if (allRoomEnabled ) {
    
    const message = new Message('4');
    message.destinationName = 'room1/allroom';
    client.send(message);
  } 
  if (zone1Enabled) {
    
    const message = new Message('4');
    message.destinationName = 'room1/zone1';
    client.send(message); 
  }
  if (zone2Enabled) {
    
    const message = new Message('4');
    message.destinationName = 'room1/zone2';
    client.send(message); 
  }
  if (zone3Enabled) {
    
    const message = new Message('4');
    message.destinationName = 'room1/zone3';
    client.send(message); 
  }
  if (zone4Enabled) {
    
    const message = new Message('4');
    message.destinationName = 'room1/zone4';
    client.send(message); 
  }
}
function pushMode5Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled){
  if (allRoomEnabled ) {
    
    const message = new Message('5');
    message.destinationName = 'room1/allroom';
    client.send(message);
  } 
  if (zone1Enabled) {
    
    const message = new Message('5');
    message.destinationName = 'room1/zone1';
    client.send(message); 
  }
  if (zone2Enabled) {
    
    const message = new Message('5');
    message.destinationName = 'room1/zone2';
    client.send(message); 
  }
  if (zone3Enabled) {
    
    const message = new Message('5');
    message.destinationName = 'room1/zone3';
    client.send(message); 
  }
  if (zone4Enabled) {
    
    const message = new Message('5');
    message.destinationName = 'room1/zone4';
    client.send(message); 
  }
}
function pushMode6Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled){
  if (allRoomEnabled == true ) {
    
    const message = new Message('6');
    message.destinationName = 'room1/allroom';
    client.send(message);
  } 
  if (zone1Enabled) {
    
    const message = new Message('6');
    message.destinationName = 'room1/zone1';
    client.send(message); 
  }
  if (zone2Enabled) {
    
    const message = new Message('6');
    message.destinationName = 'room1/zone2';
    client.send(message); 
  }
  if (zone3Enabled) {
    
    const message = new Message('6');
    message.destinationName = 'room1/zone3';
    client.send(message); 
  }
  if (zone4Enabled) {
    
    const message = new Message('6');
    message.destinationName = 'room1/zone4';
    client.send(message); 
  }
}

function ModeScreen({navigation}) {
  const [zone1Enabled, zone1IsEnabled] = useState(false);
  const [zone2Enabled, zone2IsEnabled] = useState(false);
  const [zone3Enabled, zone3IsEnabled] = useState(false);
  const [zone4Enabled, zone4IsEnabled] = useState(false);
  const [allRoomEnabled, allRoomIsEnabled] = useState(false);
  const toggleSwitch1 = () => zone1IsEnabled(previousState => !previousState);
  const toggleSwitch2 = () => zone2IsEnabled(previousState => !previousState);
  const toggleSwitch3 = () => zone3IsEnabled(previousState => !previousState);
  const toggleSwitch4 = () => zone4IsEnabled(previousState => !previousState);
  const toggleSwitchAR = () => allRoomIsEnabled(previousState => !previousState);
  return (
        
      
      <View style={styles.vievcontainer}>
        <View style={styles.modeButtonsView}>
        <TouchableHighlight onPress={() => pushMode1Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled)} style={styles.modeButtonBorder}>
          <Text style={styles.modeButtonsText}>Режим 1</Text>
        </TouchableHighlight>   
        <TouchableHighlight onPress={() => pushMode2Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled)} style={styles.modeButtonBorder}>
          <Text style={styles.modeButtonsText}>Режим 2</Text>
        </TouchableHighlight>   
        </View>  
        <View style={styles.modeButtonsView}>
        <TouchableHighlight onPress={() => pushMode3Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled)} style={styles.modeButtonBorder}> 
          <Text style={styles.modeButtonsText}>Режим 3</Text>
        </TouchableHighlight>   
        <TouchableHighlight onPress={() => pushMode4Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled)} style={styles.modeButtonBorder}>
          <Text style={styles.modeButtonsText}>Режим 4</Text>
        </TouchableHighlight>   
      </View>
      <View style={styles.modeButtonsView}>
        <TouchableHighlight onPress={() => pushMode5Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled)} style={styles.modeButtonBorder}>
          <Text style={styles.modeButtonsText}>Режим 5</Text>
        </TouchableHighlight>   
        <TouchableHighlight onPress={() => pushMode6Button(zone1Enabled,zone2Enabled,zone3Enabled,zone4Enabled,allRoomEnabled)} style={styles.modeButtonBorder}>
          <Text style={styles.modeButtonsText}>Режим 6</Text>
        </TouchableHighlight>   
      </View>
      <View style={styles.modeSwitchers1}>
        <Text style={styles.modeSwitchersText1}>Zone1</Text>
        <Text style={styles.modeSwitchersText1}>Zone2</Text>
      </View>
      <View style={styles.modeSwitchers1}>
        <Switch
          trackColor={{ false: "#767577", true: "#0fbf18" }}
          thumbColor={zone1Enabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch1}
          value={zone1Enabled}
        />
        <Switch
          trackColor={{ false: "#767577", true: "#0fbf18" }}
          thumbColor={zone2Enabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch2}
          value={zone2Enabled}
        />
      
      </View>
      <View style={styles.modeSwitchers1}>
        <Text style={styles.modeSwitchersText1}>Zone3</Text>
        <Text style={styles.modeSwitchersText1}>Zone4</Text>
      </View>
      <View style={styles.modeSwitchers2}>
        <Switch
          trackColor={{ false: "#767577", true: "#0fbf18" }}
          thumbColor={zone3Enabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch3}
          value={zone3Enabled}
        />
        <Switch
          trackColor={{ false: "#767577", true: "#0fbf18" }}
          thumbColor={zone4Enabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch4}
          value={zone4Enabled}
        />
      
      </View>
      <View style={styles.modeSwitchersAR}>
        <Text style={styles.modeSwitchersText1}>Вся комната</Text>
      </View>
      <View style={styles.modeSwitchersAR}> 
        <Switch
          trackColor={{ false: "#767577", true: "#0fbf18" }}
          thumbColor={allRoomEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitchAR}
          value={allRoomEnabled}
        />
        

      </View>         
    </View>   
        
  );
}

const Stack = createStackNavigator();

function App() {
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MQTTConnectScreen" component={MQTTConnectScreen}
          options={{
          title: 'MQTT Connect',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorRealTimeChoose" component={ColorRealTimeChoose}
          options={{
          title: 'Real Time Color Menu',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorScreen" component={ColorScreen} 
          options={{
          title: 'Выбор цвета',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ModeScreen" component={ModeScreen}
          options={{
          title: 'Выбор режима',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorRealTimeChooseAR" component={ColorRealTimeChooseAR}
          options={{
          title: '',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorRealTimeChooseZone1" component={ColorRealTimeChooseZone1}
          options={{
          title: 'Выбор цвета в режиме реального времени  (зона 1)',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorRealTimeChooseZone2" component={ColorRealTimeChooseZone2}
          options={{
          title: 'Выбор цвета в режиме реального времени  (зона 2)',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorRealTimeChooseZone3" component={ColorRealTimeChooseZone3}
          options={{
          title: 'Выбор цвета в режиме реального времени  (зона 3)',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        <Stack.Screen name="ColorRealTimeChooseZone4" component={ColorRealTimeChooseZone4}
          options={{
          title: 'Выбор цвета в режиме реального времени  (зона 4)',
          headerStyle:{
            backgroundColor:'#212021'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
   vievcontainer: {
     flex:2,
     paddingHorizontal: 30,
     paddingVertical: 20,
     flex: 1, 
     padding: 45,
     backgroundColor: '#212021'
   },
   modeButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  modeButtonsText: {
    color:'white',
    textAlign: 'center',
    fontSize:25
    
  },
  modeButtonBorder: {
    borderColor: '#5c5a5a',
    borderWidth: 2,
    //backgroundColor:'green',

    
  },
  ModePageButton: {
    borderColor: '#5c5a5a',
    borderWidth: 2,
    //backgroundColor:'green',

    
  },
  modeSwitchers1: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    marginTop: 10,

    
  },
  modeSwitchers2: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    justifyContent: 'space-between',

    
  },
  modeSwitchersAR: {    
    alignItems:'center',
  },

  modeSwitchersText1: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    fontSize: 24,
    color:'white',
 
  },
  colorpicker:{
     flex:1,

   },
   textfirstpage:{
     color: 'white', 
     alignItems: 'center',
     borderBottomColor: 'white',
     borderBottomWidth: 10,
     justifyContent: 'flex-end',//     textAlignVertical: 'center',
     textAlign:'center',
     paddingTop: 10,
     fontSize: 24
   },

   buttons: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   modeButtonsRealTimeAR: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 50
  },
});
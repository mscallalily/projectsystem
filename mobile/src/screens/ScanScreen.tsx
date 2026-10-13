import React,{useState} from 'react';
import {View,Text,Alert,TouchableOpacity} from 'react-native';
import {CameraView,useCameraPermissions} from 'expo-camera';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme';import {Button,Heading,Page,Field,Card} from '../components/UI';import {logVisit} from '../services/database';
export default function ScanScreen(){
 const [permission,requestPermission]=useCameraPermissions();const [scanned,setScanned]=useState(false);const [manual,setManual]=useState('');
 async function handle(data:string){if(scanned)return;setScanned(true);try{await logVisit(data,'QR scanned');Alert.alert('QR scanned','A local gate event was saved.',[{text:'Scan again',onPress:()=>setScanned(false)}]);}catch{Alert.alert('Scan failed','Could not record this event.');setScanned(false)}}
 if(!permission?.granted)return <Page><View style={{padding:20,flex:1,justifyContent:'center'}}><Heading title="QR scanner" subtitle="Camera access is needed to scan a parking pass."/><Button title="Allow camera access" onPress={requestPermission}/></View></Page>;
 return <Page><View style={{padding:20,flex:1}}><Heading title="Scan parking QR" subtitle="Scan a pass at the gate to record a local event."/>
 <View style={{height:310,borderRadius:18,overflow:'hidden',marginBottom:18}}><CameraView style={{flex:1}} facing="back" barcodeScannerSettings={{barcodeTypes:['qr']}} onBarcodeScanned={scanned?undefined:({data})=>handle(data)}/><View pointerEvents="none" style={{position:'absolute',left:'18%',top:'20%',width:'64%',height:'60%',borderWidth:3,borderColor:'#fff',borderRadius:18}}/></View>
 <Card><Text style={{fontWeight:'800',fontSize:16,color:colors.navy,marginBottom:7}}>Manual pass entry</Text><Text style={{color:colors.muted,fontSize:13,marginBottom:14}}>Use if the pass QR cannot be scanned.</Text><Field label="Plate or pass code" value={manual} onChangeText={setManual} autoCapitalize="characters" placeholder="ABC 1234"/><Button title="Record gate event" onPress={async()=>{if(!manual.trim()){Alert.alert('Enter a pass code');return;}await logVisit(manual,'Manual entry');setManual('');Alert.alert('Saved','Gate event added to local history.')}}/></Card>
 <TouchableOpacity onPress={()=>setScanned(false)} style={{alignItems:'center',padding:10}}><Text style={{color:colors.blue,fontWeight:'800'}}>Reset scanner</Text></TouchableOpacity>
 </View></Page>
}

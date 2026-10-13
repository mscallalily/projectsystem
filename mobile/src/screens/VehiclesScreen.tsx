import React,{useCallback,useState} from 'react';
import {Alert,ScrollView,Text,View,TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme'; import type {Vehicle} from '../types';
import {Button,Card,Empty,Field,Heading,Page} from '../components/UI';
import {deleteVehicle,getVehicles,saveVehicle} from '../services/database';
export default function VehiclesScreen(){
 const [items,setItems]=useState<Vehicle[]>([]);const [adding,setAdding]=useState(false);const [plate,setPlate]=useState('');const [type,setType]=useState('Car');const [make,setMake]=useState('');const [color,setColor]=useState('');const [busy,setBusy]=useState(false);
 const load=useCallback(async()=>setItems(await getVehicles()),[]);
 useFocusEffect(useCallback(()=>{load()},[load]));
 async function add(){if(!plate.trim()){Alert.alert('Plate required','Enter your vehicle plate number.');return;}setBusy(true);try{await saveVehicle({plate,type,make,color});setPlate('');setMake('');setColor('');setAdding(false);await load();Alert.alert('Saved','Vehicle registered on this device. Its approval status is Pending.');}catch(e:any){Alert.alert('Could not save',String(e?.message||'Check that this plate is not already registered.'));}finally{setBusy(false)}}
 function remove(v:Vehicle){Alert.alert('Delete vehicle',`Remove ${v.plate} from this device?`,[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await deleteVehicle(v.id);load()}}])}
 return <Page><ScrollView contentContainerStyle={{padding:20}}><Heading title="My vehicles" subtitle="Register and maintain the vehicles associated with your parking access."/>
 <Button title={adding?'Cancel registration':'+ Register vehicle'} onPress={()=>setAdding(!adding)} secondary={adding}/>
 {adding&&<Card style={{marginTop:14}}><Text style={{fontSize:17,fontWeight:'800',color:colors.navy,marginBottom:16}}>Vehicle details</Text>
 <Field label="Plate number *" value={plate} onChangeText={setPlate} autoCapitalize="characters" placeholder="ABC 1234"/>
 <Text style={{fontSize:13,fontWeight:'700',color:colors.text,marginBottom:8}}>Vehicle type</Text><View style={{flexDirection:'row',gap:8,marginBottom:15}}>{['Car','Motorcycle','Van','Other'].map(t=><TouchableOpacity key={t} onPress={()=>setType(t)} style={{paddingHorizontal:12,paddingVertical:9,borderRadius:9,backgroundColor:type===t?colors.blue:colors.bg,borderWidth:1,borderColor:type===t?colors.blue:colors.line}}><Text style={{color:type===t?'#fff':colors.text,fontWeight:'700'}}>{t}</Text></TouchableOpacity>)}</View>
 <Field label="Make / model" value={make} onChangeText={setMake} placeholder="e.g. Toyota Vios"/>
 <Field label="Color" value={color} onChangeText={setColor} placeholder="e.g. Silver"/>
 <Button title="Save vehicle" onPress={add} loading={busy}/></Card>}
 <Text style={{fontSize:17,fontWeight:'800',color:colors.navy,marginTop:23,marginBottom:12}}>Registered vehicles ({items.length})</Text>
 {items.length===0?<Card><Empty title="Nothing registered yet" detail="Your saved vehicles will appear here."/></Card>:items.map(v=><Card key={v.id}><View style={{flexDirection:'row',alignItems:'center',gap:12}}><View style={{backgroundColor:colors.blueLight,padding:12,borderRadius:12}}><Ionicons name="car-sport-outline" size={25} color={colors.blue}/></View><View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'800',color:colors.navy}}>{v.plate}</Text><Text style={{color:colors.muted,marginTop:3}}>{v.type} {v.make?`· ${v.make}`:''} {v.color?`· ${v.color}`:''}</Text><Text style={{color:colors.amber,fontWeight:'700',fontSize:12,marginTop:5}}>Status: {v.status}</Text></View><TouchableOpacity onPress={()=>remove(v)}><Ionicons name="trash-outline" size={21} color={colors.red}/></TouchableOpacity></View></Card>)}
 </ScrollView></Page>
}

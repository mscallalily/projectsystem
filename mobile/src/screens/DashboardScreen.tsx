import React,{useCallback,useState} from 'react';
import {ScrollView,Text,View,RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme'; import type {AppUser,Vehicle,ParkingSlot} from '../types';
import {Card,Heading,Page,Stat,Button,Empty} from '../components/UI';
import {getVehicles,getSlots,getVisits} from '../services/database';
export default function DashboardScreen({user,navigation}:{user:AppUser;navigation:any}) {
 const [vehicles,setVehicles]=useState<Vehicle[]>([]);const [slots,setSlots]=useState<ParkingSlot[]>([]);const [visits,setVisits]=useState(0);const [refresh,setRefresh]=useState(false);
 const load=useCallback(async()=>{setRefresh(true);try{const [v,s,h]=await Promise.all([getVehicles(),getSlots(),getVisits()]);setVehicles(v);setSlots(s);setVisits(h.length);}finally{setRefresh(false)}},[]);
 useFocusEffect(useCallback(()=>{load()},[load]));
 const available=slots.filter(s=>s.status==='Available').length;
 return <Page><ScrollView contentContainerStyle={{padding:20,paddingTop:18}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={load}/>}>
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:23}}><View><Text style={{color:colors.muted,fontSize:13}}>PASS / OVERVIEW</Text><Text style={{fontSize:25,fontWeight:'900',color:colors.navy,marginTop:5}}>Hello, {user.name.split(' ')[0]}</Text></View><View style={{backgroundColor:colors.blueLight,padding:12,borderRadius:14}}><Ionicons name="car-sport" size={27} color={colors.blue}/></View></View>
  <Heading title="Parking at a glance" subtitle="Your parking activity and registered vehicles."/>
  <View style={{flexDirection:'row',gap:10,marginBottom:14,flexWrap:'wrap'}}><Stat label="My vehicles" value={vehicles.length}/><Stat label="Open slots" value={available} accent={colors.green}/><Stat label="Recent events" value={visits} accent={colors.amber}/></View>
  <Card style={{backgroundColor:colors.navy,borderColor:colors.navy,padding:20}}><Text style={{fontSize:18,fontWeight:'800',color:'#fff'}}>Find a parking space</Text><Text style={{color:'#D5E3F2',marginTop:6,marginBottom:16,lineHeight:20}}>Check availability by zone before entering campus.</Text><Button title="View parking availability" onPress={()=>navigation.navigate('Parking')} secondary/></Card>
  <View style={{marginBottom:18}}><Button title="Open QR scanner" onPress={()=>navigation.navigate('Scan')} /></View>
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:5,marginBottom:10}}><Text style={{fontSize:18,fontWeight:'800',color:colors.navy}}>My vehicles</Text><Text onPress={()=>navigation.navigate('Vehicles')} style={{color:colors.blue,fontWeight:'700'}}>Manage</Text></View>
  {vehicles.length===0?<Card><Empty title="No vehicles registered" detail="Add your vehicle to start managing parking access."/><Button title="Register a vehicle" onPress={()=>navigation.navigate('Vehicles')}/></Card>:vehicles.slice(0,3).map(v=><Card key={v.id}><View style={{flexDirection:'row',alignItems:'center',gap:12}}><Ionicons name="car-outline" size={28} color={colors.blue}/><View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'800',color:colors.text}}>{v.plate}</Text><Text style={{color:colors.muted,marginTop:3}}>{v.make||v.type} · {v.color||'Color not specified'}</Text></View><Text style={{fontSize:11,fontWeight:'800',color:colors.amber,backgroundColor:colors.amberLight,padding:7,borderRadius:8}}>{v.status}</Text></View></Card>)}
 </ScrollView></Page>
}

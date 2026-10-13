import React,{useCallback,useState} from 'react';
import {ScrollView,Text,View,RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {colors} from '../theme';import type {ParkingSlot} from '../types';
import {Card,Heading,Page,Stat} from '../components/UI';import {getSlots} from '../services/database';
export default function ParkingScreen(){
 const [slots,setSlots]=useState<ParkingSlot[]>([]);const [refresh,setRefresh]=useState(false);
 const load=useCallback(async()=>{setRefresh(true);try{setSlots(await getSlots())}finally{setRefresh(false)}},[]);
 useFocusEffect(useCallback(()=>{load()},[load]));
 const open=slots.filter(s=>s.status==='Available').length;
 const zones=[...new Set(slots.map(s=>s.zone))];
 return <Page><ScrollView contentContainerStyle={{padding:20}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={load}/>}><Heading title="Parking availability" subtitle="Sample campus layout stored locally on your device. Pull down to refresh."/>
 <View style={{flexDirection:'row',gap:10,marginBottom:17}}><Stat label="Total spaces" value={slots.length}/><Stat label="Available" value={open} accent={colors.green}/><Stat label="Occupied" value={slots.length-open} accent={colors.red}/></View>
 <Card><View style={{flexDirection:'row',gap:16,marginBottom:16}}><View style={{flexDirection:'row',alignItems:'center',gap:6}}><View style={{width:10,height:10,borderRadius:3,backgroundColor:colors.green}}/><Text style={{fontSize:12,color:colors.muted}}>Available</Text></View><View style={{flexDirection:'row',alignItems:'center',gap:6}}><View style={{width:10,height:10,borderRadius:3,backgroundColor:colors.red}}/><Text style={{fontSize:12,color:colors.muted}}>Occupied</Text></View></View>
 {zones.map(zone=><View key={zone} style={{marginBottom:17}}><Text style={{fontSize:15,fontWeight:'800',color:colors.navy,marginBottom:10}}>Zone {zone}</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{slots.filter(s=>s.zone===zone).map(s=><View key={s.id} style={{width:'30%',minHeight:84,alignItems:'center',justifyContent:'center',borderRadius:12,backgroundColor:s.status==='Available'?colors.greenLight:colors.redLight,borderWidth:1,borderColor:s.status==='Available'?'#B7E7CE':'#F5C7C7'}}><Text style={{fontWeight:'900',fontSize:15,color:s.status==='Available'?colors.green:colors.red}}>{s.label}</Text><Text style={{fontSize:11,color:s.status==='Available'?colors.green:colors.red,marginTop:5}}>{s.status}</Text></View>)}</View></View>)}
 </Card>
 <Text style={{fontSize:12,color:colors.muted,lineHeight:18}}>Note: this is an initial local demo dataset. Live occupancy requires the existing backend to expose parking-slot and transaction API endpoints.</Text>
 </ScrollView></Page>
}

import React,{useCallback,useState} from 'react';
import {ScrollView,Text,View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme';import type {Visit} from '../types';
import {Card,Empty,Heading,Page} from '../components/UI';import {getVisits} from '../services/database';
export default function HistoryScreen(){
 const [items,setItems]=useState<Visit[]>([]);
 const load=useCallback(async()=>setItems(await getVisits()),[]);
 useFocusEffect(useCallback(()=>{load()},[load]));
 return <Page><ScrollView contentContainerStyle={{padding:20}}><Heading title="Parking history" subtitle="Recent gate events logged from this device."/>
 {items.length===0?<Card><Empty title="No activity yet" detail="Gate events will appear here when recorded."/></Card>:items.map(v=><Card key={v.id}><View style={{flexDirection:'row',gap:12,alignItems:'center'}}><View style={{backgroundColor:colors.blueLight,padding:11,borderRadius:12}}><Ionicons name="time-outline" size={22} color={colors.blue}/></View><View style={{flex:1}}><Text style={{fontWeight:'800',color:colors.navy}}>{v.action} · {v.plate}</Text><Text style={{color:colors.muted,fontSize:12,marginTop:4}}>{v.location}</Text><Text style={{color:colors.muted,fontSize:12,marginTop:3}}>{new Date(v.time).toLocaleString()}</Text></View></View></Card>)}
 </ScrollView></Page>
}

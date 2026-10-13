import React, {useState} from 'react';
import {ScrollView, Text, View, Alert} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {colors} from '../theme';
import {Button, Card, Field} from '../components/UI';
import {signIn} from '../services/auth';
import {hasRemoteApi} from '../services/api';
import type {AppUser} from '../types';

export default function AuthScreen({onLogin}:{onLogin:(u:AppUser)=>void}) {
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false);
 async function submit(){ if(!email.trim()||!password){Alert.alert('Missing information','Enter your email and password.');return;}
 setLoading(true); try{const u=await signIn(email.trim(),password);onLogin(u);}catch(e:any){Alert.alert('Sign in failed',e?.response?.data?.message??'Could not connect to the PASS API. Check the API URL and credentials.');}finally{setLoading(false);} }
 return <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',padding:24,backgroundColor:colors.navyDeep}}><StatusBar style="light"/>
  <View style={{marginBottom:30}}><View style={{width:58,height:58,borderRadius:17,backgroundColor:colors.blue,alignItems:'center',justifyContent:'center',marginBottom:20}}><Text style={{fontSize:28,color:'#fff',fontWeight:'900'}}>P</Text></View>
   <Text style={{fontSize:31,fontWeight:'900',color:'#fff'}}>PASS Mobile</Text><Text style={{color:'#C7D5E6',fontSize:15,marginTop:8}}>Parking Access & Security System</Text></View>
  <Card><Text style={{fontSize:21,fontWeight:'800',color:colors.navy,marginBottom:5}}>Welcome back</Text><Text style={{color:colors.muted,marginBottom:22}}>Sign in to manage your parking access.</Text>
   <Field label="Email address or ID number" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com or ID number"/>
   <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password"/>
   <Button title="Sign in" onPress={submit} loading={loading}/>
   <Text style={{fontSize:12,color:colors.muted,lineHeight:18,marginTop:14}}>{hasRemoteApi?'Connected mode: credentials are verified by your configured Laravel API.':'Local preview mode: use any email and password to explore the mobile UI. Configure EXPO_PUBLIC_API_URL to use the Laravel API.'}</Text>
  </Card>
  <Text style={{textAlign:'center',color:'#A9BCD1',fontSize:12,marginTop:15}}>Secure parking management, wherever you are.</Text>
 </ScrollView>
}

import React,{useEffect,useState} from 'react';
import {ActivityIndicator,View,Text} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';
import {colors} from './src/theme';
import type {AppUser} from './src/types';
import {initDatabase} from './src/services/database';
import {restoreSession,signOut} from './src/services/auth';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import VehiclesScreen from './src/screens/VehiclesScreen';
import ParkingScreen from './src/screens/ParkingScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ScanScreen from './src/screens/ScanScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tabs=createBottomTabNavigator();const Stack=createNativeStackNavigator();
function MainTabs({user,onLogout}:{user:AppUser;onLogout:()=>void}){
 return <Tabs.Navigator screenOptions={({route})=>({headerStyle:{backgroundColor:colors.navyDeep},headerTintColor:'#fff',headerTitleStyle:{fontWeight:'800'},tabBarActiveTintColor:colors.blue,tabBarInactiveTintColor:colors.muted,tabBarStyle:{height:64,paddingTop:7,paddingBottom:7,borderTopColor:colors.line},tabBarLabelStyle:{fontSize:11,fontWeight:'700'},tabBarIcon:({color,size})=>{const icons:any={Dashboard:'grid-outline',Vehicles:'car-sport-outline',Parking:'navigate-outline',History:'time-outline',Profile:'person-circle-outline'};return <Ionicons name={icons[route.name]||'ellipse-outline'} size={size} color={color}/>;}})}>
  <Tabs.Screen name="Dashboard" options={{title:'PASS Mobile'}}>{p=><DashboardScreen {...p} user={user}/>}</Tabs.Screen>
  <Tabs.Screen name="Vehicles" options={{title:'My Vehicles'}} component={VehiclesScreen}/>
  <Tabs.Screen name="Parking" options={{title:'Availability'}} component={ParkingScreen}/>
  <Tabs.Screen name="History" options={{title:'Parking History'}} component={HistoryScreen}/>
  <Tabs.Screen name="Profile" options={{title:'My Profile'}}>{()=> <ProfileScreen user={user} onLogout={onLogout}/>}</Tabs.Screen>
 </Tabs.Navigator>
}
export default function App(){
 const [user,setUser]=useState<AppUser|null>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{(async()=>{try{await initDatabase();setUser(await restoreSession())}catch(e){console.warn('Startup initialization failed',e)}finally{setReady(true)}})()},[]);
 async function logout(){await signOut();setUser(null)}
 if(!ready)return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:colors.navyDeep}}><ActivityIndicator size="large" color="#fff"/><Text style={{color:'#fff',marginTop:14}}>Starting PASS Mobile…</Text></View>;
 return <NavigationContainer><StatusBar style="light"/>{user?<Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Main">{()=> <MainTabs user={user} onLogout={logout}/>}</Stack.Screen><Stack.Screen name="Scan" options={{headerShown:true,title:'QR Scanner',headerStyle:{backgroundColor:colors.navyDeep},headerTintColor:'#fff'}} component={ScanScreen}/></Stack.Navigator>:<AuthScreen onLogin={setUser}/>}</NavigationContainer>
}

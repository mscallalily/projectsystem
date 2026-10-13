import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { colors } from '../theme';
export function Page({children}:React.PropsWithChildren) { return <View style={{flex:1,backgroundColor:colors.bg}}>{children}</View>; }
export function Heading({title,subtitle}:{title:string;subtitle?:string}) { return <View style={{marginBottom:20}}><Text style={s.heading}>{title}</Text>{subtitle?<Text style={s.subtitle}>{subtitle}</Text>:null}</View>; }
export function Card({children,style}:{children:React.ReactNode;style?:ViewStyle}) { return <View style={[s.card,style]}>{children}</View>; }
export function Label({children}:{children:React.ReactNode}) { return <Text style={s.label}>{children}</Text>; }
export function Field(props:TextInputProps & {label:string}) { const {label,...rest}=props; return <View style={{marginBottom:14}}><Label>{label}</Label><TextInput placeholderTextColor="#9AA8B8" style={s.input} {...rest}/></View>; }
export function Button({title,onPress,secondary,loading,disabled}:{title:string;onPress:()=>void;secondary?:boolean;loading?:boolean;disabled?:boolean}) { return <TouchableOpacity disabled={disabled||loading} onPress={onPress} style={[s.button,secondary&&s.secondary,(disabled||loading)&&{opacity:.6}]}>{loading?<ActivityIndicator color={secondary?colors.navy:'#fff'}/>:<Text style={[s.buttonText,secondary&&{color:colors.navy}]}>{title}</Text>}</TouchableOpacity>; }
export function Stat({label,value,accent=colors.blue}:{label:string;value:string|number;accent?:string}) { return <View style={s.stat}><Text style={{fontSize:25,fontWeight:'800',color:accent}}>{value}</Text><Text style={s.statLabel}>{label}</Text></View>; }
export function Empty({title,detail}:{title:string;detail:string}) { return <View style={{padding:22,alignItems:'center'}}><Text style={{fontWeight:'700',color:colors.text,fontSize:16}}>{title}</Text><Text style={{color:colors.muted,textAlign:'center',marginTop:6}}>{detail}</Text></View>; }
export const styles=s;
const s=StyleSheet.create({
 heading:{fontSize:27,fontWeight:'800',color:colors.navy,letterSpacing:-.5}, subtitle:{fontSize:14,color:colors.muted,marginTop:5,lineHeight:20},
 card:{backgroundColor:colors.card,borderRadius:16,padding:16,marginBottom:13,borderWidth:1,borderColor:colors.line},
 label:{fontSize:13,fontWeight:'700',color:colors.text,marginBottom:7}, input:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:11,paddingHorizontal:13,paddingVertical:12,color:colors.text,fontSize:15},
 button:{backgroundColor:colors.blue,borderRadius:12,paddingVertical:14,paddingHorizontal:16,alignItems:'center',justifyContent:'center',minHeight:48},
 secondary:{backgroundColor:colors.blueLight},buttonText:{fontWeight:'800',fontSize:15,color:'#fff'},stat:{flex:1,backgroundColor:'#fff',borderRadius:15,padding:15,borderWidth:1,borderColor:colors.line,minWidth:95},statLabel:{fontSize:12,color:colors.muted,marginTop:5,fontWeight:'600'}
});

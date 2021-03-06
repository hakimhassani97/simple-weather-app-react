/**
 * @author hakimhassani97
 * a simple page that uses openwathermap and leafletjs to show weather data
 */

import React, { Component } from 'react';
import './App.css';
import Card from './Components/Card';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import WeatherAPI from './Data/WeatherAPI';
import GpsAPI from './Data/GpsAPI';
import Loader from './Components/Loader';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

class App extends Component{
  constructor(props){
    super(props)
    this.state={city:'', dates:[], isLoading:false,
      err:'',lat:'36.7525',lon:'3.042',zoom:11.5,
      popupInfo:{img:'',date:'',temp:''}
    }
  }
  componentDidMount=()=>{}
  onChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
    this.setState({err:''})
  }
  getWeather=(city)=>{
    this.setState({isLoading:true})
    WeatherAPI.getWeatherForCity(city)
    .then((data)=>{
      data=data.data
      var dates=data.list
      this.setState({dates, isLoading:false, city:data.city.name,lat:data.city.coord.lat,lon:data.city.coord.lon})
      if(dates.length>0){
        var popupInfo={img : dates[0].weather[0].icon,
          date : new Date(dates[0].dt_txt).toLocaleDateString(),temp : dates[0].main.temp+' C°'}
        this.setState({popupInfo})
      }
      // $('#cityTitle').html(data.city.name)
      // initMap(data.city.coord.lat,data.city.coord.lon)
    })
    .catch((err)=>{
        this.setState({err:err.response.data.message, isLoading:false})
    })
  }
  searchByCity=()=>{
    var city=this.state.city
    if(city.trim()!==''){
      this.getWeather(city)
    }else{
      this.setState({err:'please enter a city'})
    }
  }
  searchByGps=()=>{
    GpsAPI.getLocation((position)=>{
      // console.log(position.coords)
      this.getWeather('&lat='+position.coords.latitude+'&lon='+position.coords.longitude)
    })
  }
  mapClick=(e)=>{
    this.getWeather('&lat='+e.latlng.lat+'&lon='+e.latlng.lng)
  }
  DaysCardsComponent=()=>{
    var dates=this.state.dates
    var cards=[]
    for(var i=0;i<dates.length;i++){
      var date=dates[i]
      // console.log(date)
      var diffInHours=Math.abs(new Date()-new Date(date.dt_txt))/(3600000)
      var diffInHoursToday=diffInHours%24
      if(diffInHoursToday<3){
        cards.push(
          <Card
            key={i}
            backgroundColor={diffInHours<24 ? '#555' : ''}
            img={date.weather[0].icon}
            date={new Date(date.dt_txt).toLocaleDateString()}
            temp={date.main.temp}></Card>
        )
      }
    }
    return cards
  }
  render(){
    const position = [this.state.lat, this.state.lon]
    return (
      <>
      <input type="text" id="city" name="city" value={this.state.city} onChange={this.onChange} placeholder="Enter your city here..." />
      <button className="search" id="search" onClick={()=>{this.searchByCity()}}>Get weather</button>
      <button className="search" id="searchGps" onClick={()=>{this.searchByGps()}}><img alt="gps" src={require('./Resources/gps.png')} style={{width: '1rem'}}/></button>
      <Tabs>
        <TabList>
          <Tab style={tabStyle}>5 Days forecast</Tab>
          <Tab style={tabStyle}><img alt="map" src={require('./Resources/map.png')} style={{width: '2rem'}}/></Tab>
        </TabList>
        {(this.state.err!=='') && 
        <div style={errorStyle}>
          {this.state.err}
        </div>}
        {this.state.isLoading &&
        <div style={loadingStyle}>
          <div style={{margin:'0 auto'}}>
            <Loader></Loader>
          </div>
        </div>}
        <TabPanel>
          <div id="infoTab" className="tabcontent">
            <div id="list" className="basic-grid">
              {(!this.state.isLoading) && <this.DaysCardsComponent></this.DaysCardsComponent>}
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <Map center={position} zoom={this.state.zoom} style={{height:'60vh'}} onclick={this.mapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <img alt="weatherImg" src={"http://openweathermap.org/img/wn/"+this.state.popupInfo.img+"@2x.png"}/>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', alignContent: 'space-around'}}>
                    <div style={{flex: 1}}>{this.state.popupInfo.date+' / '+this.state.popupInfo.temp}</div>
                </div>
              </Popup>
            </Marker>
          </Map>
        </TabPanel>
      </Tabs>
      </>
    );
  }
}
var errorStyle={width:'90%', backgroundColor:'#ffafaf', color:'red', border:'2px solid red', borderRadius:'6px', margin:'0 auto', padding:'10px'}
var tabStyle={color:'black', height:'6vh'}
var loadingStyle={height:'100vh',width:'100%',position:"absolute",top:0,left:0,display:'flex',flexDirection:'row',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)', zIndex:1000}
export default App;

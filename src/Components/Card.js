import React from 'react'
import { Component } from "react";

export default class Card extends Component{
    render=()=>{
        return (
            <div className="card" style={{backgroundColor:this.props.backgroundColor}}>
                <img alt={this.props.img} src={"http://openweathermap.org/img/wn/"+this.props.img+"@2x.png"}/>
                <div style={{display:'flex', flexDirection: "row", width:'100%', alignContent: "space-around"}}>
                {/* display: flex;flex-direction: row;width: 100%;align-content: space-around; */}
                    <div style={{flex: 1}}>{this.props.date}</div>
                    <div style={{flex: 1}}>{this.props.temp} C°</div>
                </div>
            </div>
        )
    }
}
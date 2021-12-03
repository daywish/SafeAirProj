import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import authService from './api-authorization/AuthorizeService'
import {withRouter} from "react-router-dom"

export class RoomList extends Component{
    constructor(props) {
        super(props)

        this.state = {
            rooms: [],
            floor: {FloorNumber: " "},
            building: {BuildingName: " ",
                        BuildingAddress: " "},
            pathname: this.props.location.pathname
        }
    }

    goBack = () =>{
        this.props.history.goBack();
    }

    onRemoveRoom = async(room) => {
        let roomId = room.RoomId;
        if(room) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.pathname}/${roomId}`, {
                method: "DELETE",
                headers: !token ? {
                    'Content-Type': 'application/json'
                } : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }).then(async ()=>{
                await this.loadData();
            });
            console.log(response);
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let rooms = this.state.rooms;
        let buildingName = this.state.building.BuildingName;
        let buildingAddress = this.state.building.BuildingAddress;
        let floorNumber = this.state.floor.FloorNumber;
        return(
            <>
            <h2 className="text-center">Кімнати будівлі "{buildingName}" за адресою "{buildingAddress}" на поверсі "{floorNumber}"</h2>
            <hr />

            <Link
                className="btn btn-primary mx-3"
                role="button"
                to=
                {{
                pathname: `${this.state.pathname}/add`,
                state: {
                    conditioners: this.state.conditioners
                }
                }}
                >Додати кімнату</Link>
            <button className="btn btn-secondary ml-3" onClick={this.goBack}>Повернутися</button>

            <table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Номер кімнати</th>
                        <th>Температура</th>
                        <th>Вологість</th>
                        <th>Кондиціонер</th>
                        <th colSpan="2">Дії</th>
                    </tr>
                </thead>
                <tbody> 
                    {rooms.map(room => <tr key={room.RoomId}>
                        <td>{room.RoomNumber}</td>
                        <td>{room.RoomTemperature}</td>
                        <td>{room.RoomWetness}</td>
                        <td>{room.Conditioner.ConditionerName}</td>
                        <td>
                            <button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveRoom(room); } }>
                            Видалити
                            </button>
                       </td>
                    </tr>
                    )}
                </tbody>
            </table>
            </>
        )
    }

    async loadData() {
        const token = await authService.getAccessToken();
        console.log(token);
        const response = await fetch(`api${this.state.pathname}`, {
            method: "GET",
            headers: !token ? { 
                'Content-Type': 'application/json'
             } : {
                  'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}` 
                },
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ rooms: data.Rooms, floor: data.Floor, building: data.Building, loading: false });
    }
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import authService from './api-authorization/AuthorizeService'
import {withRouter} from "react-router-dom"

export class FloorList extends Component{

    constructor(props){
        super(props)

        this.state={
            floors: [],
            building: {BuildingName: " ",
                        BuildingAddress: " "},
            pathname: this.props.location.pathname
        }
    }

    goBack = ()=>{
        this.props.history.goBack();
    }

    onRemoveFloor = async(floor)=>{
        let floorId = floor.FloorId;
        if(floor) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.pathname}/${floorId}`, {
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
        let floors = this.state.floors;
        let buildingName = this.state.building.BuildingName;
        let buildingAddress = this.state.building.BuildingAddress;
        return(
            <>
        <h2 className="text-center">Поверхи будівлі "{buildingName}" за адресою "{buildingAddress}"</h2>
            <hr />

            <Link
                className="btn btn-primary mx-3"
                role="button"
                to=
                {{
                pathname: `${this.state.pathname}/add`,
                }}
                >Додати поверх</Link>
            <button className="btn btn-secondary ml-3" onClick={this.goBack}>Повернутися</button>

            <table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Номер поверху</th>
                        <th colSpan="2">Дії</th>
                    </tr>
                </thead>
                <tbody> 
                    {floors.map(floor => <tr key={floor.FloorId}>
                        <td>{floor.FloorNumber}</td>

                        <td>
                        <Link
                            className="btn btn-outline-primary my-auto"
                            role="button"
                            to=
                                {{
                                pathname: `${this.state.pathname}/${floor.FloorId}/rooms`,
                               
                                }}

                            >Переглянути кімнати</Link>
                        </td>
                        <td>
                            <button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveFloor(floor); } }>
                            Видалити
                            </button>
                       </td>
                    </tr>


                    )}
                </tbody>
            </table>
        </>
        );  
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
        this.setState({ floors: data.Floors, building: data.Building, loading: false });
    }
}
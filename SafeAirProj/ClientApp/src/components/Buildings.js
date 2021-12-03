import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'
import { withRouter } from 'react-router-dom';

export class BuildingsList extends Component {
    static displayName = BuildingsList.name;

    constructor(props) {
        super(props);
        this.state = {
            buildings: [],
            loading: true,
            message: '',
            path: this.props.location.pathname
        }
    }

    onClick(building){
        this.onRemoveBuilding(building);
    }

    onRemoveBuilding = async(building) => {

        console.log("Check on delete Building");

        let buildingId = building.BuildingId;
        if(building) {
            console.log("Deleting");
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.path}/${buildingId}`, {
                method: "DELETE",
                headers: !token? {
                    'Content-Type': 'application/json'
             } : {
                  'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}` 
                },
            }).then(async () => {
                await this.loadData();
            })
            console.log(response);
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let buildings = this.state.buildings;
        return (
            <><h2 className="text-center">Будівлі</h2><hr /><Link to="/buildings/add" className="btn btn-primary mx-3" role="button">Додати будівлю</Link><table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Адреса</th>
                        <th colSpan="2">Дії</th>
                    </tr>
                </thead>
                <tbody>

                    {buildings.map(building => <tr key={building.BuildingId}>
                        <td>{building.BuildingName}</td>
                        <td>{building.BuildingAddress}</td>
                        <td><button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveBuilding(building); } }>Видалити</button></td>
                        <td><Link
                            className="btn btn-outline-primary"
                            role="button"
                            to={{
                                pathname: `${this.state.path}/${building.BuildingId}/floors`
                            }}

                        >
                            Переглянути поверхи
                        </Link>
                        </td>
                    </tr>


                    )}
                </tbody>
            </table></>
            );
    }

    async loadData() {
        const token = await authService.getAccessToken();
     
        
        console.log(token);
        const response = await fetch(`api/buildings`, {
            method: "Get",
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
        this.setState({ buildings: data, loading: false });
    }
}


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'
import { withRouter } from 'react-router-dom';

export class RequestList extends Component {
    static displayName = RequestList.name;

    constructor(props) {
        super(props);

        this.state = {
            requests: [],
            loading: true,
            path: this.props.location.pathname
        }
    }

    onRemoveRequest = async(request) => {
        let requestId = request.RequestId;
        if(request) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.path}/${requestId}`, {
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
        let requests = this.state.requests;

        return (
            <>
            <h2 className="text-center">Наявні заявки</h2><hr /><table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Назва будівлі</th>
                        <th>Поверх</th>
                        <th>Кімната</th>
                        <th>Ім'я робітника</th>
                        <th>Прізвище робітника</th>
                        <th colSpan="1">Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => <tr key={request.RequestId}>
                        <td>{request.Room.Floor.Building.BuildingName}</td>
                        <td>{request.Room.Floor.FloorNumber}</td>
                        <td>{request.Room.RoomNumber}</td>
                        <td>{request.Emploee.EmploeeFirstName}</td>
                        <td>{request.Emploee.EmploeeLastName}</td>
                        <td><button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveRequest(request); } }>Видалити</button></td>
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
        const response = await fetch(`api/requests`, {
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
        this.setState({ requests: data, loading: false });
    }
}
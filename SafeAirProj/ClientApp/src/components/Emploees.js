import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'
import { withRouter } from 'react-router-dom';

export class EmploeeList extends Component {
    static displayName = EmploeeList.name;

    constructor(props) {
        super(props);

        this.state = {
            emploees: [],
            loading: true,
            path: this.props.location.pathname
        }
    }

    onRemoveEmploee = async(emploee) => {
        let emploeeId = emploee.EmploeeId;
        if(emploee) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.path}/${emploeeId}`, {
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
        let emploees = this.state.emploees;

        return (
            <>
            <h2 className="text-center">Доступні робітники</h2><hr /><Link to="/emploees/add" className="btn btn-primary mx-3" role="button">Додати нового робітника</Link><table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Ім'я</th>
                        <th>Прізвище</th>
                        <th>Початок зміни</th>
                        <th>Кінець зміни</th>
                        <th colSpan="2">Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {emploees.map(emploee => <tr key={emploee.EmploeeId}>
                        <td>{emploee.EmploeeFirstName}</td>
                        <td>{emploee.EmploeeLastName}</td>
                        <td>{emploee.StartTime}</td>
                        <td>{emploee.FinishTime}</td>
                        <td><button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveEmploee(emploee); } }>Видалити</button></td>
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
        const response = await fetch(`api/emploees`, {
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
        this.setState({ emploees: data, loading: false });
    }
}
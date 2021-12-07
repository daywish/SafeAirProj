import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'
import { withRouter } from 'react-router-dom';

export class ConditionersList extends Component {
    static displayName = ConditionersList.name;

    constructor(props) {
        super(props);

        this.state = {
            conditioners: [],
            loading: true,
            path: this.props.location.pathname,
            admin: false
        }
    }

    onRemoveConditioner = async(conditioner) => {
        let conditionerId = conditioner.ConditionerId;
        if(conditioner) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.path}/${conditionerId}`, {
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
        this.loadUser();
    }

    render() {
        let conditioners = this.state.conditioners;
        if(this.state.admin==true){
            return (
                <>
                <h2 className="text-center">Наявні кондиціонери</h2><hr /><Link to="/conditioners/add" className="btn btn-primary mx-3" role="button">Додати кондиціонер</Link><table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Ціна</th>
                            <th>Час обслуговування</th>
                            <th colSpan="2">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conditioners.map(conditioner => <tr key={conditioner.ConditionerId}>
                            <td>{conditioner.ConditionerName}</td>
                            <td>{conditioner.ConditionerCost}</td>
                            <td>{conditioner.ServiceTime}</td>
                            <td><button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveConditioner(conditioner); } }>Видалити</button></td>
                        </tr>
                        )}
                    </tbody>
                </table>
                </>
            );
        } else {
            return (
                <>
                <h2 className="text-center">Наявні кондиціонери</h2><hr /><table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Ціна</th>
                            <th>Час обслуговування</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conditioners.map(conditioner => <tr key={conditioner.ConditionerId}>
                            <td>{conditioner.ConditionerName}</td>
                            <td>{conditioner.ConditionerCost}</td>
                            <td>{conditioner.ServiceTime}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
                </>
            );
        }
    }

    async loadData() {
        const token = await authService.getAccessToken();
        console.log(token);
        const response = await fetch(`api/conditioners`, {
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
        this.setState({ conditioners: data, loading: false });
    }
    async loadUser() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/admin`, {
            method: "GET",
            headers: !token ? { 
                'Content-Type': 'application/json'
             } : {
                  'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}` 
                },
        });
        const data = await response.json();
        this.setState({ admin: data});
    }
}
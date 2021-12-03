import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import authService from './api-authorization/AuthorizeService'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Input } from 'react-input-component';


export class RoomAdding extends React.Component {
    constructor(props) {
        super(props);

        const pathname=this.props.location.pathname;
        this.state = {
            redirect: null,
            fields: {},
            errors: {},
            resourcepath: pathname.substring(0,pathname.lastIndexOf('/')),
            conditioners: []
        };
    }

    goBack = () => {
        this.props.history.goBack();
    }

    componentDidMount() {
        this.loadConditioners();
    }

    handleValidation = async () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["roomNumber"])
        {
            formIsValid = false;
            errors["roomNumber"] = "Вкажіть номер кімнати";
        } else if(!Number.isInteger(parseInt(fields["roomNumber"])))
        {
            formIsValid = false;
            errors["roomNumber"] = "Номер кімнати повинен бути числом";
        }
        if(!fields["conditionerId"])
        {
            formIsValid = false;
            errors["conditionerId"] = "Оберіть кондиціонер";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    roomSubmit = async (e) => {
        e.preventDefault()
        if(await this.handleValidation()) {
            await this.onCreateRoom();
        }
    }
    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields: fields});
    }

    onCreateRoom = async () => {
        let id;
        let conditioners = this.state.conditioners;
        conditioners.forEach(conditioner => {
            if(conditioner.ConditionerName==this.state.fields["conditionerId"]) {
                id = conditioner.ConditionerId;
            }
        });
        let roomModel = {
            RoomNumber: this.state.fields["roomNumber"],
            ConditionerId: id
        }
        console.log(roomModel);
        let token = await authService.getAccessToken();
        console.log(token);
        await fetch(`api${this.state.resourcepath}`, {
            method: "POST",
            headers: !token ? {
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roomModel)
        }).then(() => { this.setState({ redirect: this.state.resourcepath }) });
    }

    async loadConditioners() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/conditioners`, {
            method: "GET",
            headers: !token ? { 
                'Content-Type': 'application/json'
             } : {
                  'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}` 
                },
        });
        const data = await response.json();
        this.setState({ conditioners: data});
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to = {{
                                    pathname: this.state.redirect,
                                    state: {floorId: this.state.floorId}
                                    }}/>
        } 
        let conditioners = this.state.conditioners;
        console.log(this.state.conditioners);
        return(
            <>
            <form
                name="roomForm"
                className="roomForm mt-3"
                onSubmit={async(event)=> {
                    await this.roomSubmit(event);
                }}
                >      
                    <div className="col-md-6">
                    <h2>Введіть дані кімнати</h2>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.RoomNumber">Номер кімнати*</label>
                                    <input className="form-control valid"
                                        id="Input.RoomNumber"
                                        ref="roomNumber"
                                        type="text"
                                        size="30"
                                        placeholder="Номер"
                                        onChange={this.handleChange.bind(this, "roomNumber")}
                                        value={this.state.fields["roomNumber"]}
                                    />   
                                    <span className="error-message">{this.state.errors["roomNumber"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.ConditionerId">Кондиціонер</label>
                                    <select className="form-control valid" onSelect={this.handleChange.bind(this, "conditionerId")} 
                                    onChange={this.handleChange.bind(this, "conditionerId")}>
                                        <option value="" selected="selected" hidden="hidden">Оберіть кондеціонер</option>
                                        {conditioners.map(conditioner => <option 
                                        key={conditioner.ConditionerId}
                                        id="Input.ConditionerId" 
                                        ref="conditionerId"
                                        type="text"
                                        size="30"
                                        value={this.state.fields["conditionerId"]}>
                                            {conditioner.ConditionerName}
                                            </option>
                                            )}
                                    </select>  
                                    <span className="error-message">{this.state.errors["conditionerId"]}</span>
                                </fieldset>
                            </div> 
                            <div className="form-group ">
                                <input type="submit" value="Додати кімнату" class="btn btn-primary"></input>
                            </div>
                    </div>
            </form>
            <div className="col-md-6">
            <button className="btn btn-secondary" onClick={this.goBack}>Повернутися</button>
            </div>
            </>
        );
    }
}
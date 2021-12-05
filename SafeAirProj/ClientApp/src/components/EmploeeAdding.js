import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import authService from './api-authorization/AuthorizeService'

export class EmploeeAdding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            fields: {},
            errors: {}
        }
    }

    goBack = () => {
        this.props.history.goBack();
    }

    handleValidation = async () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        
        if (!fields["emploeeFirstName"]) {
            formIsValid = false;
            errors["emploeeFirstName"] = "Вкажіть ім'я робітника!";
        }
        if (!fields["emloeeLastName"]) {
            formIsValid = false;
            errors["emloeeLastName"] = "Вкажіть прізвище робітника!";
        }
        if (!fields["startTime"]) {
            formIsValid = false;
            errors["startTime"] = "Вкажіть початок зміни!";
        }
        if (!fields["finishTime"]) {
            formIsValid = false;
            errors["finishTime"] = "Вкажіть кінець зміни!";
        } else if(fields["startTime"] && fields["finishTime"]) {
            let startHour = parseInt(fields["startTime"].split(":")[0]);
            let startMinute = parseInt(fields["startTime"].split(":")[1]);
            let finishHour = parseInt(fields["finishTime"].split(":")[0]);
            let finishMinute = parseInt(fields["finishTime"].split(":")[1]);
            if(finishHour<=startHour) {
                if(finishMinute<=startMinute){
                    formIsValid = false;
                    errors["finishTime"] = "Час кінця зміни повинен буди більше часу початку!";
                }
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    emploeeSubmit = async (e) => {
        e.preventDefault()
        if (await this.handleValidation()) {
            await this.onCreateEmploee();
        }
    }
    
    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields: fields });
        }

    onCreateEmploee = async()=> {
        let emploeeModel = {
            EmploeeFirstName: this.state.fields["emploeeFirstName"],
            EmploeeLastName: this.state.fields["emloeeLastName"],
            StartTime: this.state.fields["startTime"],
            FinishTime: this.state.fields["finishTime"]
        };
        console.log(emploeeModel);
        let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch('api/emploees', {
                method: "POST",
                headers: !token ? {
                    'Content-Type': 'application/json'
                } : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(emploeeModel)
            }).then(()=>{this.setState({redirect:"/emploees"})});
    }

    render() {
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        return(
            <>
             <form
                name="emploeeForm"
                className="emploeeForm mt-3"
                onSubmit={async(event)=> {
                    await this.emploeeSubmit(event);
                }}
                >      
                    <div className="col-md-6">
                    <h2>Введіть дані нового робітника</h2>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.EmploeeFirstName">Ім'я робітника*</label>
                                    <input className="form-control valid"
                                        id="Input.EmploeeFirstName"
                                        ref="emploeeFirstName"
                                        type="text"
                                        size="30"
                                        placeholder="Ім'я"
                                        onChange={this.handleChange.bind(this, "emploeeFirstName")}
                                        value={this.state.fields["emploeeFirstName"]}
                                    />   
                                    <span className="error-message">{this.state.errors["emploeeFirstName"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.EmloeeLastName">Прізвище робітника*</label>
                                    <input className="form-control valid"
                                        id="Input.EmloeeLastName"
                                        ref="emloeeLastName"
                                        type="text"
                                        size="100"
                                        placeholder="Прізвище"
                                        onChange={this.handleChange.bind(this, "emloeeLastName")}
                                        value={this.state.fields["emloeeLastName"]}
                                    />   
                                    <span className="error-message">{this.state.errors["emloeeLastName"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.StartTime">Початок зміни*</label>
                                    <input className="form-control valid"
                                        id="Input.StartTime"
                                        ref="startTime"
                                        type="time"
                                        size="100"
                                        min="08:00"
                                        max="16:00"
                                        onChange={this.handleChange.bind(this, "startTime")}
                                        value={this.state.fields["startTime"]}
                                    />   
                                    <span className="error-message">{this.state.errors["startTime"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.FinishTime">Кінець зміни*</label>
                                    <input className="form-control valid"
                                        id="Input.FinishTime"
                                        ref="finishTime"
                                        type="time"
                                        size="100"
                                        min="08:01"
                                        max="16:00"
                                        onChange={this.handleChange.bind(this, "finishTime")}
                                        value={this.state.fields["finishTime"]}
                                    />   
                                    <span className="error-message">{this.state.errors["finishTime"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group ">
                                <input type="submit" value="Додати робітника" class="btn btn-primary"></input>
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
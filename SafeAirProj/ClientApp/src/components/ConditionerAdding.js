import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import authService from './api-authorization/AuthorizeService'

export class ConditionerAdding extends React.Component {
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
    
        
        if (!fields["conditionerName"]) {
            formIsValid = false;
            errors["conditionerName"] = "Вкажіть назву кондиціонеру!";
        }
        if (!fields["conditionerCost"]) {
            formIsValid = false;
            errors["conditionerCost"] = "Вкажіть ціну кондиціонеру!";
        } else if(!Number.isFinite(parseFloat(fields["conditionerCost"]))) {
            formIsValid = false;
            errors["conditionerCost"] = "Невірно вказана ціна!";
        }
        if (!fields["serviceTime"]) {
            formIsValid = false;
            errors["serviceTime"] = "Вкажіть час обслуговування!";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    conditionerSubmit = async (e) => {
        e.preventDefault()
        if (await this.handleValidation()) {
            await this.onCreateConditioner();
        }
    }
    
    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields: fields });
        }

    onCreateConditioner = async()=> {
        let conditionerModel = {
            ConditionerName: this.state.fields["conditionerName"],
            ConditionerCost: this.state.fields["conditionerCost"],
            ServiceTime: this.state.fields["serviceTime"]
        };
        console.log(conditionerModel);
        let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch('api/conditioners', {
                method: "POST",
                headers: !token ? {
                    'Content-Type': 'application/json'
                } : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(conditionerModel)
            }).then(()=>{this.setState({redirect:"/conditioners"})});
    }

    render() {
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        return(
            <>
             <form
                name="conditionerForm"
                className="conditionerForm mt-3"
                onSubmit={async(event)=> {
                    await this.conditionerSubmit(event);
                }}
                >      
                    <div className="col-md-6">
                    <h2>Введіть дані кондиціонеру</h2>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.ConditionerName">Назва кондиціонеру*</label>
                                    <input className="form-control valid"
                                        id="Input.ConditionerName"
                                        ref="conditionerName"
                                        type="text"
                                        size="30"
                                        placeholder="Назва"
                                        onChange={this.handleChange.bind(this, "conditionerName")}
                                        value={this.state.fields["conditionerName"]}
                                    />   
                                    <span className="error-message">{this.state.errors["conditionerName"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.ConditionerCost">Ціна кондиціонеру*</label>
                                    <input className="form-control valid"
                                        id="Input.ConditionerCost"
                                        ref="conditionerCost"
                                        type="text"
                                        size="100"
                                        placeholder="Ціна"
                                        onChange={this.handleChange.bind(this, "conditionerCost")}
                                        value={this.state.fields["conditionerCost"]}
                                    />   
                                    <span className="error-message">{this.state.errors["conditionerCost"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.ServiceTime">Час обслуговування*</label>
                                    <input className="form-control valid"
                                        id="Input.ServiceTime"
                                        ref="serviceTime"
                                        type="text"
                                        size="100"
                                        placeholder="обслуговування"
                                        onChange={this.handleChange.bind(this, "serviceTime")}
                                        value={this.state.fields["serviceTime"]}
                                    />   
                                    <span className="error-message">{this.state.errors["serviceTime"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group ">
                                <input type="submit" value="Додати кондиціонер" class="btn btn-primary"></input>
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
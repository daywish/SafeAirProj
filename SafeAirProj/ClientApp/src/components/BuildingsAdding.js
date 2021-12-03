import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import authService from './api-authorization/AuthorizeService'

export class BuildingAdding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            fields: {},
            errors: {}
        };
    }

    goBack =()=>{
        this.props.history.goBack();
    }

    handleValidation = async () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        
        if (!fields["buildingName"]) {
          formIsValid = false;
          errors["buildingName"] = "Вкажіть назву будівлі!";
        }

      
    
        this.setState({ errors: errors });
        return formIsValid;
      }

    buldingSubmit= async (e) => {
        
        e.preventDefault()
        if  (await this.handleValidation()) {
            await this.onCreateBuilding();
        } 
    }

    handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields: fields });
    }

    onCreateBuilding=async()=>{
      
        console.log("кнока нажата");
        let buildingModel={
              BuildingName:this.state.fields["buildingName"],
              BuildingAddress:this.state.fields["buildingAddress"],
            };
        console.log(buildingModel);
            console.log("Добавление");
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch('api/buildings', {
                method: "POST",
                headers: !token ? {
                    'Content-Type': 'application/json'
                } : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(buildingModel)
            }).then(()=>{this.setState({redirect:"/buildings"})});
            
        
        }

    render(){
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        return(
            <>
                 <form
                name="buildingForm"
                className="buildingForm mt-3"
                onSubmit={async(event)=> {
                    await this.buldingSubmit(event);
                }}
                >      
                    <div className="col-md-6">
                    <h2>Введіть дані Будівлі</h2>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.BuildingName">Назва будівлі*</label>
                                    <input className="form-control valid"
                                        id="Input.BuildingName"
                                        ref="buildingName"
                                        type="text"
                                        size="30"
                                        placeholder="Назва"
                                        onChange={this.handleChange.bind(this, "buildingName")}
                                        value={this.state.fields["buildingName"]}
                                    />   
                                    <span className="error-message">{this.state.errors["buildingName"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.BuildingAddress">Адреса будівлі</label>
                                    <input className="form-control valid"
                                        id="Input.BuildingAddress"
                                        ref="buildingAddress"
                                        type="text"
                                        size="100"
                                        placeholder="Адреса"
                                        onChange={this.handleChange.bind(this, "buildingAddress")}
                                        value={this.state.fields["buildingAddress"]}
                                    />   
                                    <span className="error-message">{this.state.errors["buildingAddress"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group ">
                                <input type="submit" value="Додати будівлю" class="btn btn-primary"></input>
                            </div>
                    </div>
                </form>
                <div className="col-md-6">
                <button className="btn btn-secondary" onClick={this.goBack}>Повернутися</button>
                </div>
            </>
        )
      }
}
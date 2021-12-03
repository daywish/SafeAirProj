import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import authService from './api-authorization/AuthorizeService'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

export class FloorAdding extends React.Component {
    constructor(props) {
        super(props);

        const pathname=this.props.location.pathname;
        this.state = {
            redrect: null,
            fields: {},
            errors: {},
            resourcepath: pathname.substring(0,pathname.lastIndexOf('/'))
        };
    }

    goBack =()=>{
        this.props.history.goBack();
    }

    handleValidation = async () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsVaslid = true;

        if(!fields["floorNumber"]) {
            formIsVaslid = false;
            errors["floorNumber"] = "Вкажіть номер поверху";
        } else if(!Number.isInteger(parseInt(fields["floorNumber"])))
        {
            formIsVaslid = false;
            errors["floorNumber"] = "Номер поверху повинен бути числом";
        }
        console.log(formIsVaslid);    
        console.log(Number.isInteger(parseInt(fields["floorNumber"])));
        console.log(!isNaN(parseInt(fields["floorNumber"])));
        //if(!isNaN(parseInt(fields["floorNumber"]))) {
        //    formIsVaslid = false;
        //    errors["floorNumber"] = "Номер поверху повинен бути числом";
        //}
        
        this.setState({errors: errors});
        return formIsVaslid;
    }

    floorSubmit = async (e) => {
        e.preventDefault()
        if(await this.handleValidation()) {
            await this.onCreateFloor();
        }
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields: fields});
    }

    onCreateFloor = async () => {
        let floorModel = {
            FloorNumber: this.state.fields["floorNumber"]
        }
        console.log(floorModel);
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
            body: JSON.stringify(floorModel)
        }).then(() => { this.setState({ redrect: this.state.resourcepath }) });
    }

    render() {
        if(this.state.redrect) {
            return <Redirect to = {{
                                    pathname: this.state.redrect,
                                    state: {buildingId: this.state.buildingId}
                                    }}/>
        }
        return(
            <>
            <form
                name="regionForm"
                className="regionForm mt-3"
                onSubmit={async(event)=> {
                    await this.floorSubmit(event);
                }}
                >      
                    <div className="col-md-6">
                    <h2>Введіть номер поверху</h2>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.FloorNumber">Номер поверху*</label>
                                    <input className="form-control valid"
                                        id="Input.FloorNumber"
                                        ref="floorNumber"
                                        type="text"
                                        size="30"
                                        placeholder="Номер"
                                        onChange={this.handleChange.bind(this, "floorNumber")}
                                        value={this.state.fields["floorNumber"]}
                                    />   
                                    <span className="error-message">{this.state.errors["floorNumber"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group ">
                                <input type="submit" value="Додати поверх" class="btn btn-primary"></input>
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
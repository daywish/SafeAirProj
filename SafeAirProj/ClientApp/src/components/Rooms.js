import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import authService from './api-authorization/AuthorizeService'
import {withRouter} from "react-router-dom"

export class RoomList extends Component{
    constructor(props) {
        super(props)

        this.state = {
            rooms: [],
            floor: {FloorNumber: " "},
            building: {BuildingName: " ",
                        BuildingAddress: " "},
            fields: {},
            errors: {},
            pathname: this.props.location.pathname
        }
    }

    goBack = () =>{
        this.props.history.goBack();
    }

    handleValidation = async () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        let rooms = this.state.rooms;

        if(!fields["oneOrAll"]){
            formIsValid = false;
            errors["oneOrAll"] = "Оберіть режим налашутвання!";
        }
        if(fields["oneOrAll"]==1){
            if(!fields["roomNumber"]){
                formIsValid = false;
                errors["roomNumber"] = "Вкажіть номер кімнати!";
            } else if(!Number.isInteger(parseInt(fields["roomNumber"]))){
                formIsValid = false;
                errors["roomNumber"] = "Номер кімнати повинен бути числом!";
            } else {
                let check = false;
                for(var i = 0; i<rooms.length; i++){
                    if(rooms[i].RoomNumber==fields["roomNumber"]) {
                        check = true;
                        break;
                    }
                }
                if(!check){
                    formIsValid = false;
                    errors["roomNumber"] = "Такої кімнати не існує!";
                }
            }
        }
        if(!fields["roomTemperature"])
        {
            formIsValid = false;
            errors["roomTemperature"] = "Вкажіть температуру!";
        } else if(!Number.isInteger(parseFloat(fields["roomTemperature"])))
        {
            formIsValid = false;
            errors["roomTemperature"] = "Температура повинна бути числом!";
        }
        if(!fields["roomWetness"])
        {
            formIsValid = false;
            errors["roomWetness"] = "Вкажіть вологість!";
        } else if(!Number.isInteger(parseFloat(fields["roomWetness"])))
        {
            formIsValid = false;
            errors["roomWetness"] = "Вологість повинна бути числом!";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    roomChange = async (e) => {
        e.preventDefault()
        if(await this.handleValidation()) {
            await this.onCreateChange();
        }
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields: fields});
        console.log(this.state.fields["oneOrAll"]);
    }

    onCreateChange = async () => {
        let changeModel;
        if(this.state.fields["oneOrAll"]==0){
            changeModel = {
                RoomNumber: 0,
                RoomTemperature: this.state.fields["roomTemperature"],
                RoomWetness: this.state.fields["roomWetness"]
            }
        } else {
            changeModel = {
                RoomNumber: this.state.fields["roomNumber"],
                RoomTemperature: this.state.fields["roomTemperature"],
                RoomWetness: this.state.fields["roomWetness"]
            }
        }
        console.log(changeModel);
        let token = await authService.getAccessToken();
        console.log(token);
        await fetch(`api${this.state.pathname}`, {
            method: "PATCH",
            headers: !token ? {
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(changeModel)
        }).then(async ()=>{
            await this.loadData();
        }); 
    }

    onCreateRequests = async(room) => {
        let roomId = room.RoomId;
        let requestModel = {
            RoomId: roomId
        }
        if(room) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api/requests`, {
                method: "POST",
                headers: !token ? {
                    'Content-Type': 'application/json'
                } : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestModel)
            }).then(async ()=>{
                await this.loadData();
            }); 
        }
    }

    onRemoveRoom = async(room) => {
        let roomId = room.RoomId;
        if(room) {
            let token = await authService.getAccessToken();
            console.log(token);
            let response = await fetch(`api${this.state.pathname}/${roomId}`, {
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
        let rooms = this.state.rooms;
        let buildingName = this.state.building.BuildingName;
        let buildingAddress = this.state.building.BuildingAddress;
        let floorNumber = this.state.floor.FloorNumber;
        if(rooms.length==0)
        {
            return(
                <>
            <h2 className="text-center">Кімнати будівлі "{buildingName}" за адресою "{buildingAddress}" на поверсі "{floorNumber}"</h2>
            <hr />

            <Link
                className="btn btn-primary mx-3"
                role="button"
                to=
                {{
                pathname: `${this.state.pathname}/add`,
                state: {
                    conditioners: this.state.conditioners
                }
                }}
                >Додати кімнату</Link>
            <button className="btn btn-secondary ml-3" onClick={this.goBack}>Повернутися</button>
            <table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Номер кімнати</th>
                        <th>Температура</th>
                        <th>Вологість</th>
                        <th>Кондиціонер</th>
                        <th colSpan="2">Дії</th>
                    </tr>
                </thead>
                <tbody> 
                    {rooms.map(room => <tr key={room.RoomId}>
                        <td>{room.RoomNumber}</td>
                        <td>{room.RoomTemperature}</td>
                        <td>{room.RoomWetness}</td>
                        <td>{room.Conditioner.ConditionerName}</td>
                        <td>
                            <button className="btn btn-outline-dark" onClick={async () => { await this.onCreateRequests(room); } }>
                            Залишити заявку на перевірку
                            </button>
                       </td>
                        <td>
                            <button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveRoom(room); } }>
                            Видалити
                            </button>
                       </td>
                    </tr>
                    )}
                </tbody>
            </table>
            </>
            )
        }

        let modes = [];
        modes[0] = {
            Mode: 0,
            Name: "Всі кімнати"
        }
        modes[1] = {
            Mode: 1,
            Name: "Одна кімната"
        }
        return(
            <>
            <h2 className="text-center">Кімнати будівлі "{buildingName}" за адресою "{buildingAddress}" на поверсі "{floorNumber}"</h2>
            <hr />

            <Link
                className="btn btn-primary mx-3"
                role="button"
                to=
                {{
                pathname: `${this.state.pathname}/add`,
                state: {
                    conditioners: this.state.conditioners
                }
                }}
                >Додати кімнату</Link>
            <button className="btn btn-secondary ml-3" onClick={this.goBack}>Повернутися</button>

            <form
                name="roomForm"
                className="roomForm mt-3"
                onSubmit={async(event)=> {
                    await this.roomChange(event);
                }}
                >      
                    <div className="col-md-6">
                    <h2>Дані середовища</h2>
                        <div className="form-group">
                        <h5>Оберіть режим зміни параметрів середовища</h5>
                            {modes.map(mode =>
                                <div className="form-check">
                                    <input className="form-check-input"
                                    id={mode.Mode}
                                    name="mode"
                                    ref="mode"
                                    type="radio"
                                    onChange={this.handleChange.bind(this, "oneOrAll")}
                                    value={mode.Mode}
                            />   
                            <label for={mode.Mode}>{mode.Name}</label>

                            </div>
                                )}
                        <span className="error-message">{this.state.errors["oneOrAll"]}</span>
                        </div>
                            <div className="form-group">
                                <label for="Input.RoomNumber">Номер кімнати</label>
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
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.RoomTemperature">Температура кімнати*</label>
                                    <input className="form-control valid"
                                        id="Input.RoomTemperature"
                                        ref="roomTemperature"
                                        type="text"
                                        size="30"
                                        placeholder="Номер"
                                        onChange={this.handleChange.bind(this, "roomTemperature")}
                                        value={this.state.fields["roomTemperature"]}
                                    />   
                                    <span className="error-message">{this.state.errors["roomTemperature"]}</span>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label for="Input.RoomWetness">Вологість кімнати*</label>
                                    <input className="form-control valid"
                                        id="Input.RoomWetness"
                                        ref="roomWetness"
                                        type="text"
                                        size="30"
                                        placeholder="Номер"
                                        onChange={this.handleChange.bind(this, "roomWetness")}
                                        value={this.state.fields["roomWetness"]}
                                    />   
                                    <span className="error-message">{this.state.errors["roomWetness"]}</span>
                                </fieldset>
                            </div> 
                            <div className="form-group ">
                                <input type="submit" value="Оновити дані" class="btn btn-primary"></input>
                            </div>
                    </div>
            </form>

            <table className='table table-striped text-center mt-3' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Номер кімнати</th>
                        <th>Температура</th>
                        <th>Вологість</th>
                        <th>Кондиціонер</th>
                        <th colSpan="2">Дії</th>
                    </tr>
                </thead>
                <tbody> 
                    {rooms.map(room => <tr key={room.RoomId}>
                        <td>{room.RoomNumber}</td>
                        <td>{room.RoomTemperature}</td>
                        <td>{room.RoomWetness}</td>
                        <td>{room.Conditioner.ConditionerName}</td>
                        <td>
                            <button className="btn btn-outline-dark" onClick={async () => { await this.onCreateRequests(room); } }>
                            Залишити заявку на перевірку
                            </button>
                       </td>
                        <td>
                            <button className="btn btn-outline-dark" onClick={async () => { await this.onRemoveRoom(room); } }>
                            Видалити
                            </button>
                       </td>
                    </tr>
                    )}
                </tbody>
            </table>
            </>
        )
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
        this.setState({ rooms: data.Rooms, floor: data.Floor, building: data.Building, loading: false });
    }
}
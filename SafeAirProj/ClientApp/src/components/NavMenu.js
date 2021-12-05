import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import authService from './api-authorization/AuthorizeService'
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      admin: false,
      nameCounter: "Counter",
      linkCounter: "/counter",
      nameFetch: "Fetch data",
      linkFetch: "/fetch-data"
    };
  }

  componentDidMount(){
    this.loadUser();
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

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    if(this.state.admin==true){
      this.state.nameCounter="Emploees";
      this.state.linkCounter="/emploees";
      this.state.nameFetch="Requests";
      this.state.linkFetch="/requests";
    }
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">SafeAirProj</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to={this.state.linkCounter}>{this.state.nameCounter}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to={this.state.linkFetch}>{this.state.nameFetch}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/buildings">Buildings</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/conditioners">Conditioners</NavLink>
                </NavItem>
                <LoginMenu>
                </LoginMenu>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

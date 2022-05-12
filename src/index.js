import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


import Homepage from "./pages/home"
import Header from "./pages/components/Header"


ReactDOM.render(
    <BrowserRouter basename="/">
        <ToastContainer/>
        <Header/>
        <Switch>
            <Route path="/home" component={Homepage}/>


            <Route exact path="/*" component={Homepage}>
                <Redirect to="/home"/>
            </Route>
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);



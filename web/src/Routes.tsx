import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';
import { Header } from './pages/Header';

function Routes() {

  return (
    <BrowserRouter>
      <div>
        <Header />
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/bye" component={Bye} />
          </Switch>
        </div>

      </div>

    </BrowserRouter>
  );
}

export default Routes;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Moviedetails from './pages/Moviedetails';
import Individualperson from './pages/Individualperson';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/movies" component={Movies} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/moviedetails/:imdbID" component={Moviedetails} />
              <Route path="/individualperson/:id" component={Individualperson} />
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

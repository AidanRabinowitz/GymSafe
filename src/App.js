import './App.css';
import Home from './pages/Home';
import OnBoarding from './pages/OnBoarding';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Routes and Route

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/dashboard" element = {<Dashboard/>}/>
        <Route path = "/onBoarding" element = {<OnBoarding/>}/>
      </Routes>
    </Router>
  );
}

export default App;

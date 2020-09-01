import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./style.css";
var isLoaded = false;
var eror = null;
const key = ""; //Paste your WeatherAPI's API Key here
var flag = "";
function datebuilder() {
  var d = new Date().toDateString();
  return d;
}
function Card(props) {
  const [showmenu, setShowmenu] = useState(false);
  function menu() {
    if (showmenu === false) {
      setShowmenu(true);
    } else {
      setShowmenu(false);
    }
  }
  return (
    <div>
      <div className="dropdown-menu">
        <div className="menu-btn" onClick={menu}>
          Click here to know more details <i className="fa fa-caret-down"></i>
        </div>
        {showmenu ? (
          <div className="menu-content w3-animate-zoom w3-card-4">
            <ul>
              <li>Humidity:{props.obj.current.humidity}%</li>
              <li>Wind Speed:{props.obj.current.wind_kph}km/h</li>
              <li>Cloud Cover:{props.obj.current.cloud}%</li>
              <li>Visibility:{props.obj.current.vis_km}km</li>
            </ul>
            <h4>
              Thanks for using this site, dont forget to bookmark it. Keep visit
              here frequently for more updates and features.
            </h4>
          </div>
        ) : null}
      </div>
    </div>
  );
}

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      object: {},
    };
  }
  getinfo() {
    flag = this.props.query;
    axios
      .get(
        `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${this.props.query}&days=5`
      )
      .then((response) => {
        console.log(response.data);
        isLoaded = true;
        eror = null;
        this.setState({
          object: response.data,
          error: null,
        });
      })
      .catch((err) => {
        console.log("error caught");
        isLoaded = true;
        eror = err;
        this.setState({
          error: err,
        });
      });
  }
  allStart() {
    if (this.props.query !== flag) {
      this.getinfo();
    }

    if (eror) {
      return (
        <div className="error">
          <i class="fa fa-frown-o" aria-hidden="true"></i>
          <br />
          Ooopsy..
          <br />
          It seeems that you haven't spelled the city correctly.
          <br />
          Please Enter a valid city.
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div>
          <div className="loading">Loading...</div>
          <div className="lds-hourglass"></div>
        </div>
      );
    } else {
      return (
        <div>
          {this.state.object ? (
            <div className="w3-card-4 main">
              <header className="heading">
                <h1>
                  <strong>
                    {this.state.object.location.name},
                    {this.state.object.location.country}
                  </strong>
                </h1>
                <h2>{datebuilder()}</h2>
              </header>
              <div className="daata">
                <div className="data">
                  <img
                    src={this.state.object.current.condition.icon}
                    alt="Weather pic"
                  />
                </div>
                <div className="data2">
                  <h1>{this.state.object.current.temp_c}&deg;C</h1>
                  <h2>{this.state.object.current.condition.text}</h2>
                </div>
              </div>

              <footer>
                <Card obj={this.state.object} />
              </footer>
            </div>
          ) : null}
        </div>
      );
    }
  }

  render() {
    return <div>{this.allStart()}</div>;
  }
}

function Search(props) {
  const [city, setCity] = useState("");
  function handleChange(e) {
    setCity(e.target.value);
  }
  function handleSubmit(e) {
    if (city !== "") {
      props.handleSubmit(city);
      setCity("");
    }
    e.preventDefault();
  }
  return (
    <form className="search" onSubmit={handleSubmit}>
      <h1>WEATHER APP</h1>
      <input
        type="text"
        placeholder="Search City...."
        onChange={handleChange}
        value={city}
      />
      <button type="submit">
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}

function Weather(props) {
  const [city, setCity] = useState(props.data);
  function addCity(cit) {
    isLoaded = false;
    eror = null;
    setCity(cit);
  }
  return (
    <div>
      <Search handleSubmit={addCity} />
      <Display query={city} />
    </div>
  );
}

const el = <Weather data="ghaziabad" />;

ReactDOM.render(el, document.getElementById("root"));

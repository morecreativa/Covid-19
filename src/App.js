import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent, } from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from "./util";
import LineGraph from './LineGraph';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

function App() {
  // What are we used?, What we use to modify?
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType]= useState("cases");

  // USEEFFECT = Run a piece of code
  // based on a given condition
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    // The code inside here will run once
    // when the component loads and not again

    // async -> send a request, wait for it, do something with info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom 
            value: country.countryInfo.iso2 // UK, USA, FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    // maybe something is changed??
    //
    // maybe something is changed??
    // maybe something is changed??
    // maybe something is changed??
    // maybe something is changed??
    
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide'
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);

        // All of the data
        // From the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(6);
      });
  };
  // console.log('COUNTRY INFO >>>', countryInfo);

  return (
    <div className="App">
      <div className="App__left">
        <div className="App__header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="App__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Loop through all the countries and  show a drop down list of the options*/}
              <MenuItem value="worldwide">WORLDWIDE</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/* 
            
            <MenuItem value="worldwide">Option One</MenuItem>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">WOOOOO</MenuItem>
             */}
            </Select>
          </FormControl>
        </div>

        <div className="App__stats">
          <InfoBox
          isRed
          active={casesType==="cases"}
          onClick={e=> setCasesType('cases')}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0,0")} />
          {/* numeral(countryInfo.cases).format("0,0") */}
          <InfoBox
          active={casesType==="recovered"}
          onClick={e=> setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0,0")}
          />
          <InfoBox
          isRed
          active={casesType==="deaths"}
          onClick={e=> setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0,0")}
          />
        </div>

        <Map casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountries}/>
      </div>

      <Card className="App__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="App__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="App__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

import React from 'react';
import './App.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      countries:[],
      lightmode: false,
      selected: false,
      detail:false,
      detailData:"",
      panels:[],
      input:"",
      selector:"Filter by Region"
    }
    this.handleMode = this.handleMode.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.clickedCountry = this.clickedCountry.bind(this);
    this.backfromDetail = this.backfromDetail.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.selectInput = this.selectInput.bind(this);
  }
  componentDidMount(){
    fetch("https://restcountries.com/v2/all").then(response=>{return response.json()}).then(data=>{
      this.setState({panels:data.map(country => <CountryPanel key ={country.name} countryData = {country} detailBox = {this.clickedCountry}/>),
      countries: data
      });
    })
  }
  componentDidUpdate(prevProps, prevStates){
    if(this.state.lightmode!==prevStates.lightmode){
      let bodyTag =document.getElementsByTagName("body")[0];
      let rootCSS = document.documentElement;
      if(!this.state.lightmode){
        bodyTag.style.background ="#202c37";
        bodyTag.style.color ="#f2f3f8";
        rootCSS.style.setProperty("--elementBgColor","#283644");
        rootCSS.style.setProperty("--panelBg","#2f3f50");
        rootCSS.style.setProperty("--infoColor","#bbbbbb");
        rootCSS.style.setProperty("--inputColor","#f2f3f8");
      }
      else{
        bodyTag.style.background ="#dddddd";
        bodyTag.style.color ="#080808";
        rootCSS.style.setProperty("--elementBgColor","#f7f7f7");
        rootCSS.style.setProperty("--panelBg","#ffffff");
        rootCSS.style.setProperty("--infoColor","#696969");
        rootCSS.style.setProperty("--inputColor","#080808");
      }
    };
    if(this.state.input !== prevStates.input){
      fetch("https://restcountries.com/v2/all").then(response=>{return response.json()}).then(data=>{
        this.setState({panels:data.filter(d=> d.name.toLowerCase().includes(this.state.input.toLowerCase())).map(country => <CountryPanel key ={country.name} countryData = {country} detailBox = {this.clickedCountry}/>),
        countries: data
        });
    })
    }
    if(this.state.selector !== prevStates.selector){
      if(this.state.selector === "All"){
        fetch("https://restcountries.com/v2/all").then(response=>{return response.json()}).then(data=>{
          this.setState({panels:data.map(country => <CountryPanel key ={country.name} countryData = {country} detailBox = {this.clickedCountry}/>),
          countries: data
          });
        })
      }
      else{
        fetch("https://restcountries.com/v2/all").then(response=>{return response.json()}).then(data=>{
          this.setState({panels:data.filter(d=> d.region === this.state.selector).map(country => <CountryPanel key ={country.name} countryData = {country} detailBox = {this.clickedCountry}/>),
          countries: data
          });
        })
      }
    }
  }
  handleMode(){
    this.setState({
      lightmode:!this.state.lightmode
    })
  }
  handleSelect(){
    this.setState({
      selected:!this.state.selected
    })
  }
  handleInput(e){
    this.setState({
      input:e.target.value
    })
  }
  selectInput(e){
    let region = e.target.getAttribute("value");
    this.setState({
      selector:region,
      selected:false
    })
  }

  clickedCountry(e){
    let data = e.target.getAttribute("data")
    let selectedCountry = this.state.countries.filter(country => country.name === data).pop();
    this.setState({
      detailData:selectedCountry,
      detail:true
    })
  }
  backfromDetail(){
    this.setState({
      detailData:"",
      detail:false
    })
  }



  render(){
    return (
      <div>
        <nav id ="navBar" className = "navBar">
            <h1>Where in the world?</h1>
            {this.state.lightmode?
            <div className ="modeIcon">
              <i className="fa-solid fa-moon" onClick ={this.handleMode}></i>
              <p>Dark Mode</p>
            </div>:   
            <div className ="modeIcon">
              <i className="fa-solid fa-sun" onClick ={this.handleMode}></i>
              <p>Light Mode</p>
            </div>}
        </nav>
        {this.state.detail? 
          <CountryDetail backBtn = {this.backfromDetail} countries = {this.state.countries} countryData ={this.state.detailData} handleNewCountry = {this.clickedCountry}/>
        :""}
        {this.state.detail?
        "":
          <div className = "inputBox">
            <div className = "searchBox">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input className="searchbar" type="text" placeholder ="Search for a country..." value = {this.state.input} onChange ={this.handleInput}/>
            </div>
            <div className="selectBox">
                <div className = "sPlaceholder" onClick={this.handleSelect}>
                  <p id ="selectHeader">{this.state.selector}</p>
                  {this.state.selected?
                  <i className="fa-solid fa-angle-up"></i>
                  :<i className="fa-solid fa-angle-down"></i>}
                </div>
                {this.state.selected? 
                <div className="optionBox">
                  <div onClick = {this.selectInput} value = "All">All</div>
                  <div onClick = {this.selectInput} value = "Africa">Africa</div>
                  <div onClick = {this.selectInput} value = "Americas">Americas</div>
                  <div onClick = {this.selectInput} value = "Asia">Asia</div>
                  <div onClick = {this.selectInput} value = "Europe">Europe</div>
                  <div onClick = {this.selectInput} value = "Oceania">Oceania</div>
                </div>
                :""}
            </div>
          </div>
        }
        {this.state.detail? "":
          <div className="panelBox">
            {this.state.panels}
          </div>
        }
      </div>
    );
  }
}


const CountryPanel = (props) =>{
  let country = props.countryData
  return(
    <div className="panel">
      <div className="panelContainer">
        <div className = "panelImg">
          <img className = "frontside" src={`${country.flag}`} alt={`${country.name} flag`}/>
          <div className="backside">
            <p className="backsideTag">Native Name</p>
            <p className="nativeName">{country.nativeName}</p>
          </div>
        </div>
        <div className ="panelDescription">
          <h2 data ={country.name} onClick={props.detailBox}>{country.name}</h2>
          <p>Population: <span>{country.population.toLocaleString("en-US")}</span></p>
          <p>Region: <span>{country.region}</span></p>
          <p>Capital: <span>{country.capital}</span></p>
        </div>
      </div>
    </div>
  )
}

const CountryDetail =(props)=>{
  let country = props.countryData;
  let currencies = country.currencies.map(c => c.name).reduce((a,b)=> a + ", "+b);
  let languages = country.languages.map(l => l.name).reduce((a,b)=> a + ", "+b);
  let borders;
  if(country.borders !== undefined){
    let borderName = country.borders.map(border => {return props.countries.filter(c => c.alpha3Code=== border).pop().name});
    borders = borderName.map(b => <Borders key ={b} border = {b} handleClick = {props.handleNewCountry}/>)
  }
  return(
    <div className ="detailBox">
      <div className="backBox" onClick = {props.backBtn}>
        <i className="fa-solid fa-arrow-left-long"></i>
        <p>Back</p>
      </div>
      <div className="detailInfoBox">
        <div className = "imgBox">
          <img src={`${country.flag}`} alt={`${country.name} flag`}/>
        </div>
        
        <div className = "infoContainer">
          <h1>{country.name}</h1>
          <div className = "detailInfos">
            <div className ="left">
              <p>Native Name: <span>{country.nativeName}</span></p>
              <p>population: <span>{country.population.toLocaleString("en-US")}</span></p>
              <p>Region: <span>{country.region}</span></p>
              <p>Sub Region: <span>{country.subregion}</span></p>
              <p>Capital: <span>{country.capital}</span></p>
            </div>
            <div className ="right">
              <p>Top Level Domain: <span>{country.topLevelDomain[0]}</span></p>
              <p>Currencies: <span>{currencies}</span></p>
              <p>Languages: <span>{languages}</span></p>
            </div>
          </div>
          <div className ="borderCBox">
            <p>Border Counties:</p>
            {borders}
          </div>
        </div>
      </div>
    </div>
  )
}
const Borders = (props) =>{
  return(
    <div className ="borderTag" data = {props.border} onClick = {props.handleClick}>
      {props.border}
    </div>
  )
}

export default App;

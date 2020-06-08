# COVID-19 Casemap Server
Open source Node.js app which provides COVID-19 cumulative case data via RESTful API. [COVID-19 Casemap Web](https://github.com/tmsoftwareinc/covid-19-casemap-web) retrieve data from this server.
COVID-19 case data available at https://covid19api.tmsoftwareinc.com are
* City data in Los Angels County, Oraneg County, Ventura County and San Diego County in the US
* City data in state of Illinois in the US
* County data in every state in the US
* Country data all over the world

## Prerequisites
**MySQL**
Download [gzipped sql dump demo file](https://drive.google.com/file/d/1LNlGLs6RcCWaBW_8PCtBvVfp16BmHvd5/view?usp=sharing) and import it


## Getting Started

Install node modules

```npm install```

Setup MySQL credential in config/db.config.js

Get Google Maps API Key

In the project directory, you can run:

```KEY=XXXXXXXXXXXXXXXXXXXX node server.js```

XXXXXXXXXXXXXXXXXXXX is your Google Maps API Key

## APIs implemented
Return case data in JSON array except /v1/geos
* **Request**: /v1/cases/
  * **Response**: All case data in the database
* **Request**: /v1/cases/caseID
  * **Response**: Case data of caseID specified (for testing)
* **Request**: /v1/addresses?country=country_name&state=state_name&county=county_name&city=city_name
  * **Response**: Case data for the address
* **Request**: /v1/latlngs?lat=latitude&long=longitide
  * **Response**: Case data for latitude and longitude
* **Request**: /v1/geos?location=address or landmark
  * **Response**: Latitude and longitude in JSON format

## Live App
[https://covid19api.tmsoftwareinc.com/v1/addresses?country=us&state=california&county=orange&city=irvine](https://covid19api.tmsoftwareinc.com/v1/addresses?country=us&state=california&county=orange&city=irvine)

## Built With
* [Express](https://expressjs.com/)

* [mysql](https://www.npmjs.com/package/mysql)

* [geocoder](https://www.npmjs.com/package/geocoder)

## License
This project is licensed under [the MIT License](https://opensource.org/licenses/MIT)

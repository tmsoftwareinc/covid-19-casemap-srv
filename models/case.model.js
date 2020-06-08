const sql = require("./db.js");

var geocoder = require('geocoder');

const la_areas = ['Adams-Normandie','Alsace','Angeles National Forest','Angelino Heights','Arleta','Atwater Village','Baldwin Hills','Bel Air','Beverly Crest','Beverlywood','Boyle Heights','Brentwood','Brookside','Cadillac-Corning','Canoga Park','Carthay','Central','Century City','Century Palms/Cove','Chatsworth','Cheviot Hills','Chinatown','Cloverdale/Cochran','Country Club Park','Crenshaw District','Crestview','Del Rey','Downtown','Eagle Rock','East Hollywood','Echo Park','El Sereno','Elysian Park','Elysian Valley','Encino','Exposition','Exposition Park','Faircrest Heights','Figueroa Park Square','Florence-Firestone','Glassell Park','Gramercy Place','Granada Hills','Green Meadows','Hancock Park','Harbor City','Harbor Gateway','Harbor Pines','Harvard Heights','Harvard Park','Highland Park','Historic Filipinotown','Hollywood','Hollywood Hills','Hyde Park','Jefferson Park','Koreatown','Lafayette Square','Lake Balboa','Lakeview Terrace','Leimert Park','Lincoln Heights','Little Armenia','Little Bangladesh','Little Tokyo','Longwood','Los Feliz','Manchester Square','Mandeville Canyon','Mar Vista','Marina Peninsula','Melrose','Mid-city','Miracle Mile','Mission Hills','Mt. Washington','North Hills','North Hollywood','Northridge','Pacific Palisades','Pacoima','Palisades Highlands','Palms','Panorama City','Park La Brea','Pico-Union','Playa Del Rey','Playa Vista','Porter Ranch','Rancho Park','Regent Square','Reseda','Reseda Ranch','Reynier Village','San Pedro','Shadow Hills','Sherman Oaks','Silverlake','South Carthay','South Park','St Elmo Village','Studio City','Sun Valley','Sunland','Sycamore Square','Sylmar','Tarzana','Temple-Beaudry','Thai Town','Toluca Lake','Toluca Terrace','Toluca Woods','Tujunga','University Hills','University Park','Valley Glen','Valley Village','Van Nuys','Venice','Vermont Knolls','Vermont Square','Vermont Vista','Vernon Central','Victoria Park','View Heights','Watts','Wellington Square','West Adams','West Hills','West Los Angeles','West Vernon','Westchester','Westlake','Westwood','Wholesale District','Wilmington','Wilshire Center','Winnetka','Woodland Hills'];


// constructor
const Case = function(thiscase) {
  this.cases = thiscase.cases;
  this.deaaths = thiscase.deaths;
  this.date = thiscase.date;
  this.country = thiscase.country;
  this.state = thiscase.state;
  this.county = thiscase.county;
  this.city = thiscase.city;
  this.source = thiscase.source;
};

function extractGeocoder(target,jsonstr) {
	var ret = '';
	for (i in jsonstr) {
		if(jsonstr[i]["types"][0] == target) {
			if(target == 'country') {
				ret = jsonstr[i]["short_name"];
				if(ret != 'US') {
					ret = jsonstr[i]["long_name"];
				}
			}
			else {
				ret = jsonstr[i]["long_name"];
				if(target == 'administrative_area_level_2') {   // County
				if("New York County, Kings County, Queens County, Bronx County, Richmond County".indexOf(ret) >= 0) {
                                        ret = 'New York City';
                                }
				}
			}
		}	
	}

	return ret;
}

Case.findById = (caseId, result) => {
  sql.query(`SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases WHERE id = ${caseId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Case.getAll = result => {
  sql.query("SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases order by date desc", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Case.getAddressAll = (country,state,county,city,result) => {
if(typeof city == 'undefined') {
	city = '';
}
if(typeof county == 'undefined') {
        county = '';
}
if(typeof state == 'undefined') {
        state = '';
}
  sql.query(`SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases where country='${country}' and state='${state}' and county='${county}' and city='${city}' order by date desc`, (err, res) => {
	if(err) {
        	console.log("error: ", err);
        	result(err, null);
        }
        else{
        	result(null, res);
        }
   }); 
};

Case.getLatlngAll = (lat,long,result) => {
// Whitehouse: 38.897663, -77.036574
// 34.126494, -118.048889
if(typeof lat == 'undefined') {
        lat = '34.126494';
}
if(typeof long == 'undefined') {
        long = '-118.048889';
}
// Get country, state, county, city from latlong using Google Map API
geocoder.reverseGeocode(lat,long, function ( err, data ) {
	if (err) {
      		console.log("error: ", err);
      		result(err, null);
      		return;
    	}
country=extractGeocoder('country',data["results"][0]["address_components"]);
state=extractGeocoder('administrative_area_level_1',data["results"][0]["address_components"]);
county=extractGeocoder('administrative_area_level_2',data["results"][0]["address_components"]);
county=county.replace(' County','');
city=extractGeocoder('locality',data["results"][0]["address_components"]);
if(county == 'New York City') {
	city = '';
}
if(city == 'Los Angeles') {
	if(la_areas.some(item => item === extractGeocoder('neighborhood',data["results"][0]["address_components"])) ) {
		city += ' - '+extractGeocoder('neighborhood',data["results"][0]["address_components"]);
	}
}
  sql.query(`SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases where country='${country}' and state='${state}' and county='${county}' and city='${city}' order by date desc`, (err, res) => {
	if(err) {
                console.log("error: ", err);
                result(err, null);
        }
	else{
		if(res.length == 0) {
      sql.query(`SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases where country='${country}' and state='${state}' and county='${county}' and city='' order by date desc`, (err2, res2) => {
        if(res2.length == 0) {
            sql.query(`SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases where country='${country}' and state='${state}' and county='' and city='' order by date desc`, (err3, res3) => {
              if(res3.length == 0) {
                sql.query(`SELECT country,state,county,city,cases,deaths,date_format(date,'%Y-%m-%d') as date FROM cases where country='${country}' and state='' and county='' and city='' order by date desc`, (err4, res4) => {
                  result(null, res4);
                });
              }
              else {
                result(null, res3);
              }
            });
        }
        else {
          result(null, res2);
        }
			});
		}
		else {
      result(null, res);
		}
        }
   });
}, { key: process.env.KEY }); 
};

module.exports = Case;


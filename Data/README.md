# This Folder Contains our Cleansed Airbnb Data from 2015-2018 

---
# Data Source : [Inside Airbnb](http://insideairbnb.com/get-the-data.html)

# Files used:
* Summary information and metrics for listings in New York City (lisitngs.csv) 
  - Limitation : Missing zip code

* Detailed Listings data for New York City contains zipcodes (listings.csv.gz)

# Steps:
1. Pulled monthly data for each year
2. Used vlookup to asbtract the zip code from (listings.csv.gz) and append it to (lisitngs.csv)
3. Cleansed rows with missing data and updated incorrect values
4. Created final output files containing all merged months per year

# Note:
* Year 2015 is missing original data for the following months : January, February, March, April and July

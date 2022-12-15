# React Coding Exercise

Upload your solution on github and share the link. Add a screenshot of the final rendered application.

## API

https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo

Documentation
https://www.alphavantage.co/documentation/#intraday

## Requirements

 - Fetch time series data using the above api
 - Display tabular data
 - Visualise the data
 Nice to have
 - Ability to filter data and chart based on date/time range 
 - Ability to switch stock symbol

You can use any third-party library as suited to achieve the above requirements

## Getting Started
The application is a Stand-alone Front-end Application created using the following technologies:

- Front-end - React
- State Management - Redux
- 3rd Party Libraries
  - "react-bootstrap": "^2.7.0",
  - "react-bootstrap-table-next": "^4.0.3",
  - "react-bootstrap-table2-filter": "^1.3.3",
  - "react-bootstrap-table2-paginator": "^2.1.2",
  - "react-bootstrap-table2-toolkit": "^2.1.3",
  - "react-redux": "^8.0.5",
  - "react-router-dom": "^6.4.5",
  - "redux": "^4.2.0",

To run the application, run the following command:

        `npm run start`

The UI application will run on:
[http://localhost:3000/](http://localhost:3000/)

## Directory Structure
    File Structure:
        - project_dir/
            - docker-compose.yml (entry point to run the application end-to-end with one command)
            - /node_backend ( NODE BACK END ) - PORT - 3001
                - node_modules
                - utils/
                    - genes.sql (sql statements to set up the USER, DATABASE and TABLE)
                    - routes.js (contains all endpoints)
                - Dockerfile
                - index.js
                
            - postgres ( DATABASE ) - PORT 5432
                - /db_data (tables, configurations and schema files)
                
            - /react_frontend (REACT FRONT END) - PORT 3000
                - Dockerfile
                - public
                    - index.html
                    - manifest.json
                    - Institute_of_Cancer_Research.png
                - src
                    - components
                        - Gene (index.js and styles.css)
                        - Header (index.js and styles.css)
                        - Error (index.js)
                    - page
                        - Genes (index.js and styles.css)
                        - App.js
                        - App.test.js
                    - utils
                        - routes.js
                        - genes.json

## Unexplored
- Testing - Jest

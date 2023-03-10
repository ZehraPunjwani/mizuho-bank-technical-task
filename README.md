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

## Screenshots
![](./src/data/Screenshot2.png)
![](./src/data/Screenshot1.png)
![](./src/data/Screenshot11.png)
![](./src/data/Screenshot10.png)
![](./src/data/Screenshot9.png)
![](./src/data/Screenshot8.png)
![](./src/data/Screenshot7.png)
![](./src/data/Screenshot6.png)
![](./src/data/Screenshot5.png)
![](./src/data/Screenshot4.png)
![](./src/data/Screenshot3.png)

## Unexplored
- Testing - Jest

## Short Falls / Blockers
- Free API 
  - Number of API hits allowed in a minute / day on the free version prevented End-to-End development and testing
    - Temporary Solution - Mock API response files
  - Multiple stock symbols - Free version of API only has "IBM" using the above API 
- Given more time, the key focus for the future would be:
  - Full Software Development Life Cycle best practices
  - UI Design creation before implementation
  - Development and Testing Strategy
  - Agile / Scrum Practice - Creation of Jira with broken down epics, features and user stories
  - Further Data end-points and Analytics, different chart types

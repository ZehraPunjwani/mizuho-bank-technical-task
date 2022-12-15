import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Button, Spinner, Nav, DropdownButton, Dropdown, ButtonGroup, Row, Col } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {setIntradayData, setIntradayError} from "../../redux/intradaySlice";

import TIME_SERIES_INTRADAY_IBM_1MIN from '../../data/TIME_SERIES_INTRADAY_IBM_1MIN.json';
import TIME_SERIES_INTRADAY_IBM_5MIN from '../../data/TIME_SERIES_INTRADAY_IBM_5MIN.json';
import TIME_SERIES_INTRADAY_IBM_15MIN from '../../data/TIME_SERIES_INTRADAY_IBM_15MIN.json';
import TIME_SERIES_INTRADAY_IBM_30MIN from '../../data/TIME_SERIES_INTRADAY_IBM_30MIN.json';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

const TimeSeriesIntraday = () => {
    const intradayData = useSelector((state) => state.intraday.intradayData);
    const metaData = {
        "Series Type": ["TIME_SERIES_INTRADAY"],
        "Symbol": ["IBM"],
        "Last Refreshed": "2022-12-13 17:50:00",
        "Interval": ["1MIN", "5MIN", "15MIN", "30MIN"],
        "Output Size": "Full size",
        "Time Zone": "US/Eastern"
    };

    const [tabularData, setTabularData] = useState({
        SeriesType: metaData["Series Type"][0],
        Symbol: metaData["Symbol"][0],
        LastRefreshed: "2022-12-13 17:50:00",
        Interval: metaData["Interval"][0],
        Information: `Time Series (${metaData["Interval"][0].toLowerCase()})`,
        OutputSize: "Full size",
        TimeZone: "US/Eastern",
        data: [],
        error: null,
    });

    const [refresh, setRefresh] = useState(false);

    const dispatch = useDispatch();

    // const API_KEY = "GEIXYV4P44EIMBG6";
    // const GET_API = `https://www.alphavantage.co/query`;

    const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
        return (
            <div style={ { display: 'flex', flexDirection: 'column', fontSize: '14px' } }>
                {/*{ column.text }*/}
                { sortElement }
                { filterElement }
            </div>
        );
    }

    const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => (
        <div className="btn-group" role="group">
            {
                options.map((option) => {
                    const isSelect = currSizePerPage === `${option.page}`;

                    return (
                        <button key={ option.text } type="button" onClick={ () => onSizePerPageChange(option.page) } className={ `btn ${isSelect ? 'btn-secondary' : 'btn-primary'}` }>
                            { option.text }
                        </button>
                    );
                })
            }
        </div>
    );

    const customFilter = ({filterVal, data, col}) => {
        if (filterVal && data) {
            return data.filter(entry => entry[col].contains(filterVal));
        }
        return data;
    }

    const MyExportCSV = (props) => <Button className="btn btn-info" onClick={() => props.onExport()}>Export to CSV</Button>

    const fetchTimeSeriesIntradayData = async (props) => {
        await setRefresh(true);

        await dispatch(setIntradayData({ response: [] }));
        await dispatch(setIntradayError({ error: null }));
        await setTabularData({ ...tabularData, ...props });

        let response;
        switch(props['Interval']) {
            case "1MIN":
                response = TIME_SERIES_INTRADAY_IBM_1MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            case "5MIN":
                response = TIME_SERIES_INTRADAY_IBM_5MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            case "15MIN":
                response = TIME_SERIES_INTRADAY_IBM_15MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            case "30MIN":
                response = TIME_SERIES_INTRADAY_IBM_30MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            default:
                break;
        }

        if(response.hasOwnProperty("Meta Data")) {
            let intradayDataKeys;
            let intradayDataValues
            let filteredOptions;

            if (refresh || Object.keys(response).length === 0) {
                intradayDataKeys = Object.keys(Object.values(response)[1]);
                intradayDataValues = Object.values(Object.values(response)[1]);
            } else {
                intradayDataKeys = Object.keys(Object.values(response)[1]);
                intradayDataValues = Object.values(Object.values(response)[1]);
            }

            intradayDataValues.map((value, i) => {
                filteredOptions = intradayDataKeys
                    .map(dateTime => dateTime.split(' ')[0])
                    .filter((value, index, a) => a.indexOf(value) === index);

                intradayDataValues[i] = {
                    ...intradayDataValues[i],
                    "0. timestamp": intradayDataKeys[i]
                }
            });

            await setTabularData({
                ...props,
                data: intradayDataValues,
            });
        } else {
            if(response.hasOwnProperty("Error Message")) {
                dispatch(setIntradayError({ error: response["Error Message"] }))
                setTabularData({ ...props, error: response["Error Message"] });
            } else if(response.hasOwnProperty("Note")) {
                dispatch(setIntradayError({ error: response["Note"]}))
                setTabularData({ ...props, error: response["Note"] });
            } else {
                dispatch(setIntradayError({ error: response["Information"]}))
                setTabularData({ ...props, error: response["Information"] });
            }
        }

        await setRefresh(false);

    }

    useEffect(() => {
        fetchTimeSeriesIntradayData(tabularData)
    }, []);

    const columns = [
        {
            dataField: '0. timestamp',
            text: 'Timestamp',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return {
                    color: 'black',
                    fontSize: '14px',
                };
            }

        },
        {
            dataField: '1. open',
            text: 'Open',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return {
                    color: 'black',
                    fontSize: '14px',
                };
            }
        },
        {
            dataField: '2. high',
            text: 'High',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return {
                    color: 'black',
                    fontSize: '14px',
                };
            }
        },
        {
            dataField: '3. low',
            text: 'Low',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return {
                    color: 'black',
                    fontSize: '14px',
                };
            }
        },
        {
            dataField: '4. close',
            text: 'Close',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return {
                    color: 'black',
                    fontSize: '14px',
                };
            }
        },
        {
            dataField: '5. volume',
            text: 'Volume',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return {
                    color: 'black',
                    fontSize: '14px',
                };
            }
        }
    ];

    const loadContent = (props) => {
        if(refresh) {
            return (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )
        } else {
            if (intradayData.error) {
                return (
                    <Card bg="danger" text='light' style={{width: '100%'}} className="mb-2">
                        <Card.Body>
                            <Card.Title>Error</Card.Title>
                            <Card.Text>{intradayData.error}</Card.Text>
                        </Card.Body>
                    </Card>
                )
            } else {
                return (
                    <div style={{ marginTop: '10px', padding: '0px' }}>
                        <BootstrapTable
                            {...props.baseProps}
                            defaultSorted={[{ dataField: '0. timestamp', order: 'desc' }]}
                            filter={filterFactory()}
                            pagination={paginationFactory({sizePerPageRenderer})}
                            noDataIndication={ 'no results found' }
                        />
                    </div>
                )
            }
        }
    }

    return (
        <div style={{ textAlign: 'left' }}>
            <div>Requirements</div>
            <ul>
                <li>Fetch time series data using the above api</li>
                <li>Display tabular data</li>
                <li>Visualise the data Nice to have</li>
                <li>Ability to filter data and chart based on date/time range</li>
                <li>Ability to switch stock symbol</li>
            </ul>

            <Card>
                <Card.Header>
                    <Row>
                        <Col>
                            TIME_SERIES_INTRADAY
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            Last Refreshed: {tabularData.LastRefreshed} {tabularData.TimeZone}
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <ToolkitProvider keyField='0. timestamp' data={tabularData.data} columns={columns} exportCSV={ { onlyExportFiltered: true, exportAll: false } }>
                        {props => (
                            <Container>
                                <Nav className="justify-content-end">
                                    <ButtonGroup className="mb-2">
                                        <Nav.Item>
                                            <MyExportCSV {...props.csvProps} />
                                        </Nav.Item>
                                    </ButtonGroup>
                                    <ButtonGroup className="mb-2">
                                        <Nav.Item style={{marginLeft: '10px'}}>
                                            <DropdownButton id="dropdown-basic-button" title={tabularData["SeriesType"]}>
                                                {
                                                    metaData["Series Type"].map((seriesType) => (
                                                        <Dropdown.Item key={seriesType}>{seriesType}</Dropdown.Item>
                                                    ))
                                                }
                                            </DropdownButton>
                                        </Nav.Item>
                                        <Nav.Item style={{marginLeft: '10px'}}>
                                            <DropdownButton id="dropdown-basic-button" title={tabularData["Symbol"]}>
                                                {
                                                    metaData["Symbol"].map((symbol) => (
                                                        <Dropdown.Item key={symbol}>{symbol}</Dropdown.Item>
                                                    ))
                                                }
                                            </DropdownButton>
                                        </Nav.Item>
                                        <Nav.Item style={{marginLeft: '10px'}}>
                                            <DropdownButton id="dropdown-basic-button" title={tabularData["Interval"]}>
                                                {
                                                    metaData["Interval"].map((inter) => (
                                                        <Dropdown.Item
                                                            key={inter}
                                                            onClick={() => {
                                                                fetchTimeSeriesIntradayData({
                                                                    ...tabularData,
                                                                    "Interval": inter,
                                                                    "Information": `Time Series (${inter.toLowerCase()})`,
                                                                    "data": [],
                                                                    "error": null,
                                                                })
                                                            }}
                                                        >{inter}</Dropdown.Item>
                                                    ))
                                                }
                                            </DropdownButton>
                                        </Nav.Item>
                                    </ButtonGroup>
                                </Nav>
                                {loadContent(props)}
                            </Container>
                        )}
                    </ToolkitProvider>
                </Card.Body>
            </Card>
        </div>
    )
}

export default TimeSeriesIntraday;

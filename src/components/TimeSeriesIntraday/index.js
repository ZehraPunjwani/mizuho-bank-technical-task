import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Button, Spinner, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'
import filterFactory, { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
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
    const [tabularData, setTabularData] = useState([]);

    const [selectedEndpoint, setSelectedEndpoint] = useState(TIME_SERIES_INTRADAY_IBM_30MIN);

    const dispatch = useDispatch();

    const API_KEY = "GEIXYV4P44EIMBG6";
    const GET_API = `https://www.alphavantage.co/query`;

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

    const MyExportCSV = (props) => (
        <div>
            <Button style={{ marginRight: '10px' }} className="btn btn-primary" onClick={() => props.onExport()}>Export to CSV</Button>
        </div>
    )

    useEffect(() => {
        dispatch(setIntradayData([]));
        const response = selectedEndpoint;
        dispatch(setIntradayData({ response: response }));

        if(!response.hasOwnProperty("Meta Data")) {
            if(intradayData.data.hasOwnProperty("Error Message")) {
                dispatch(setIntradayError({ error: intradayData.data["Error Message"] }))
            } else if(intradayData.data.hasOwnProperty("Note")) {
                dispatch(setIntradayError({ error: intradayData.data["Note"]}))
            } else {
                dispatch(setIntradayError({ error: intradayData.data["Information"]}))
            }
        } else {
            const intradayDataKeys = Object.keys(Object.values(response)[1]);
            let intradayDataValues = Object.values(response["Time Series (30min)"]);

            let filteredOptions;

            intradayDataValues.map((value, i) => {
                filteredOptions = intradayDataKeys
                    .map(dateTime => dateTime.split(' ')[0])
                    .filter((value, index, a) => a.indexOf(value) === index);

                intradayDataValues[i] = {
                    ...intradayDataValues[i],
                    "0. timestamp": intradayDataKeys[i]
                }
            });

            setTabularData(intradayDataValues);
        }
    }, [selectedEndpoint]);

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
                <Card.Header>TIME_SERIES_INTRADAY</Card.Header>
                <Card.Body>
                    {
                        !intradayData.data.hasOwnProperty("Meta Data") ? (
                            <Card bg="danger" text='light' style={{ width: '100%' }} className="mb-2">
                                <Card.Body>
                                    <Card.Title>Error</Card.Title>
                                    <Card.Text>{intradayData.error}</Card.Text>
                                </Card.Body>
                            </Card>
                        ) : (
                            <ToolkitProvider keyField='0. timestamp' data={tabularData} columns={columns} exportCSV={ { onlyExportFiltered: true, exportAll: false } }>
                                {
                                    props => (
                                        <Container>
                                            <Row>
                                                <Col xl={6} lg={6} md={3} sm={12} style={{ textAlign: 'left' }}>
                                                    <MyExportCSV { ...props.csvProps } />
                                                </Col>
                                                <Col xl={2} lg={2} md={3} sm={12} style={{ textAlign: 'right' }}>
                                                    <DropdownButton id="dropdown-basic-button" title="Series">
                                                        <Dropdown.Item>TIME_SERIES_INTRADAY</Dropdown.Item>
                                                        <Dropdown.Item>TIME_SERIES_DAILY_ADJUSTED</Dropdown.Item>
                                                    </DropdownButton>
                                                </Col>
                                                <Col xl={2} lg={2} md={3} sm={12} style={{ textAlign: 'right' }}>
                                                    <DropdownButton id="dropdown-basic-button" title="Stock Symbol">
                                                        <Dropdown.Item>IBM</Dropdown.Item>
                                                        <Dropdown.Item>TSCO_LON</Dropdown.Item>
                                                    </DropdownButton>
                                                </Col>
                                                <Col lg={2} md={3} sm={12} style={{ textAlign: 'right' }}>
                                                    <DropdownButton id="dropdown-basic-button" title="Interval">
                                                        <Dropdown.Item>1min</Dropdown.Item>
                                                        <Dropdown.Item>5min</Dropdown.Item>
                                                        <Dropdown.Item>15min</Dropdown.Item>
                                                        <Dropdown.Item>30min</Dropdown.Item>
                                                    </DropdownButton>
                                                </Col>
                                            </Row>
                                            <div style={{ marginTop: '10px', padding: '0px' }}>
                                                <BootstrapTable
                                                    {...props.baseProps}
                                                    defaultSorted={[{dataField: '0. timestamp', order: 'desc'}]}
                                                    filter={filterFactory()}
                                                    pagination={paginationFactory({sizePerPageRenderer})}
                                                    noDataIndication={() => (
                                                        <Spinner animation="border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    )}
                                                />
                                            </div>
                                        </Container>
                                    )
                                }
                            </ToolkitProvider>
                        )
                    }
                </Card.Body>
            </Card>

        </div>
    )
}

export default TimeSeriesIntraday;

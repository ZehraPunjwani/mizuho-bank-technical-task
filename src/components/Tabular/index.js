import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Button, Spinner, DropdownButton, Dropdown, ButtonGroup, Row, Col } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { setIntradayData, setIntradayError } from "../../redux/intradaySlice";

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

// const API_KEY = "GEIXYV4P44EIMBG6";
// const GET_API = `https://www.alphavantage.co/query`;
const TimeSeriesIntraday = () => {
    const timeSeriesIntraDayData = useSelector((state) => state.intraday.timeSeriesIntraDayData);
    const intradayData = useSelector((state) => state.intraday.intradayData);

    const metaData = {
        "Series Type": ["TIME_SERIES_INTRADAY"],
        "Symbol": ["IBM"],
        "Last Refreshed": null,
        "Interval": ["1MIN", "5MIN", "15MIN", "30MIN"],
        "Output Size": null,
        "Time Zone": null
    };
    const [tabularData, setTabularData] = useState({
        SeriesType: metaData["Series Type"][0],
        Symbol: metaData["Symbol"][0],
        LastRefreshed: null,
        Interval: metaData["Interval"][0],
        Information: `Time Series (${metaData["Interval"][0].toLowerCase()})`,
        OutputSize: null,
        TimeZone: null,
        data: [],
        error: null,
    });
    const [refresh, setRefresh] = useState(false);

    const dispatch = useDispatch();

    const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
        return (
            <div style={ { display: 'flex', flexDirection: 'column', fontSize: '14px' } }>
                {/*{ column.text }*/}
                { sortElement }
                { filterElement }
            </div>
        );
    }

    const Formatter = (cell, row) => (
        <span>
            <strong>${cell}</strong>
        </span>
    )

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
        <Button
            className={tabularData.data.length === 0 ? "btn btn-secondary" : "btn btn-info"}
            onClick={() => props.onExport()}
            disabled={tabularData.data.length === 0}
        >Export to CSV</Button>
    )

    const fetchTimeSeriesIntradayData = async (props) => {
        await setRefresh(true);

        await dispatch(setIntradayData({ response: [] }));
        await dispatch(setIntradayError({ error: null }));
        await setTabularData({ ...tabularData, ...props });

        let response;
        switch(props['Interval']) {
            case "1MIN":
                response = timeSeriesIntraDayData.TIME_SERIES_INTRADAY_IBM_1MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            case "5MIN":
                response = timeSeriesIntraDayData.TIME_SERIES_INTRADAY_IBM_5MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            case "15MIN":
                response = timeSeriesIntraDayData.TIME_SERIES_INTRADAY_IBM_15MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            case "30MIN":
                response = timeSeriesIntraDayData.TIME_SERIES_INTRADAY_IBM_30MIN;
                dispatch(setIntradayData({ response: response }));
                break;
            default:
                break;
        }

        if(response.hasOwnProperty("Meta Data")) {
            let intradayDataKeys;
            let intradayDataValues

            if (refresh || Object.keys(response).length === 0) {
                intradayDataKeys = Object.keys(Object.values(response)[1]);
                intradayDataValues = Object.values(Object.values(response)[1]);
            } else {
                intradayDataKeys = Object.keys(Object.values(response)[1]);
                intradayDataValues = Object.values(Object.values(response)[1]);
            }

            intradayDataValues.map((value, i) => {
                return intradayDataValues[i] = {
                    ...intradayDataValues[i],
                    "0. timestamp": intradayDataKeys[i]
                }
            });

            await setTabularData({
                ...props,
                LastRefreshed: response["Meta Data"]["3. Last Refreshed"],
                OutputSize: response["Meta Data"]["5. Output Size"],
                TimeZone: response["Meta Data"]["6. Time Zone"],
                data: intradayDataValues,
            });
        } else {
            if(response.hasOwnProperty("Error Message")) {
                dispatch(setIntradayError({ error: response["Error Message"] }))
                setTabularData({
                    ...props,
                    LastRefreshed: "N/A",
                    OutputSize: "",
                    TimeZone: "",
                    error: response["Error Message"]
                });
            } else if(response.hasOwnProperty("Note")) {
                dispatch(setIntradayError({ error: response["Note"]}))
                setTabularData({
                    ...props,
                    LastRefreshed: "N/A",
                    OutputSize: "",
                    TimeZone: "",
                    error: response["Note"]
                });
            } else {
                dispatch(setIntradayError({ error: response["Information"]}))
                setTabularData({
                    ...props,
                    LastRefreshed: "N/A",
                    OutputSize: "",
                    TimeZone: "",
                    error: response["Information"]
                });
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
                return { color: 'black', fontSize: '14px' };
            }

        },
        {
            dataField: '1. open',
            text: 'Open',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: Formatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: '2. high',
            text: 'High',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: Formatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: '3. low',
            text: 'Low',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: Formatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: '4. close',
            text: 'Close',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: Formatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: '5. volume',
            text: 'Volume',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        }
    ];

    const loadContent = (props) => {
        if(refresh) {
            return (
                <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '25vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            )
        } else {
            if (intradayData.error) {
                return (
                    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '25vh' }}>
                        <Card bg="danger" text='light' style={{width: '100%'}} className="mb-2">
                            <Card.Body>
                                <Card.Title>Error</Card.Title>
                                <Card.Text>{intradayData.error}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Container>
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
        <Card>
            <Card.Header>
                <Row>
                    <Col>
                        TIME_SERIES_INTRADAY Tabular
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        Last Refreshed: {tabularData.LastRefreshed} {tabularData.TimeZone}
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <ToolkitProvider keyField='0. timestamp' data={tabularData.data} columns={columns} exportCSV={ { onlyExportFiltered: true, exportAll: false } }>
                    {props => (
                        <div>
                            <Row>
                                <Col>
                                    <ButtonGroup className="mb-2">
                                        <MyExportCSV {...props.csvProps} />
                                    </ButtonGroup>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <ButtonGroup className="mb-2">
                                        <DropdownButton id="dropdown-basic-button" title={tabularData["SeriesType"]} style={{marginLeft: '10px'}}>
                                            {
                                                metaData["Series Type"].map((seriesType) => (
                                                    <Dropdown.Item key={seriesType}>{seriesType}</Dropdown.Item>
                                                ))
                                            }
                                        </DropdownButton>
                                        <DropdownButton id="dropdown-basic-button" title={tabularData["Symbol"]} style={{marginLeft: '10px'}}>
                                            {
                                                metaData["Symbol"].map((symbol) => (
                                                    <Dropdown.Item key={symbol}>{symbol}</Dropdown.Item>
                                                ))
                                            }
                                        </DropdownButton>
                                        <DropdownButton id="dropdown-basic-button" title={tabularData["Interval"]} style={{marginLeft: '10px'}}>
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
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            {loadContent(props)}
                        </div>
                    )}
                </ToolkitProvider>
            </Card.Body>
        </Card>
    )
}

export default TimeSeriesIntraday;

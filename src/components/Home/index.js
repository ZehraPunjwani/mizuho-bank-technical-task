import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DropdownButton, Dropdown, ButtonGroup, Row, Col } from "react-bootstrap";
import { setIntradayData, setIntradayError } from "../../redux/intradaySlice";
import AreaResponsiveContainer from "../AreaResponsiveContainer";
import Tabular from "../Tabular";

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

// const API_KEY = "GEIXYV4P44EIMBG6";
// const GET_API = `https://www.alphavantage.co/query`;
const Home = () => {
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
        Symbol: metaData["Symbol"][2],
        LastRefreshed: null,
        Interval: metaData["Interval"][2],
        Information: `Time Series (${metaData["Interval"][2].toLowerCase()})`,
        OutputSize: null,
        TimeZone: null,
        data: [],
        error: null,
    });
    const [refresh, setRefresh] = useState(false);

    const [date, setDate] = useState("2022-11-15");

    const dispatch = useDispatch();

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const sort = (data) => {
        console.log(data);
        data.map((entry) => {
            Object.keys(entry).map((key) => {
                if (key !== capitalizeFirstLetter(key.split(' ')[0])) {
                    const newKey = capitalizeFirstLetter(key.split(' ')[1]);
                    delete Object.assign(entry, {[newKey]: entry[key]})[key]
                }
            })
        });

        return data.sort((a,b) => (a["Timestamp"] > b["Timestamp"])
            ? 1
            : ((b["Timestamp"] > a["Timestamp"]) ? -1 : 0))
    }

    const groupData = (data) => {
        const groupedData = data.reduce((entry, a) => {
            const date = a["Timestamp"].split(' ')[0];
            entry[date] = entry[date] || [];
            entry[date].push(a);

            return entry;
        }, Object.create(null));

        // console.log("groupedData", groupedData)
        // console.log("groupedData", groupedData[date])

        return groupedData;
    }

    // console.log("groupedData test", Object.values(groupData(tabularData.data)))

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

            console.log("intradayDataValues", intradayDataValues);

            // this gives an object with dates as keys
            const groups = sort(intradayDataValues).reduce((groups, entry) => {
                const date = entry["Timestamp"].split(' ')[0];
                if (!groups[date]) {
                    groups[date] = [];
                }

                const updatedEntry = { ...entry, "Timestamp": entry["Timestamp"] }
                groups[date].push(updatedEntry);

                return groups;
            }, {});

            console.log("groups", groups);
            console.log("groups values", Object.values(groups).flat());

            await setTabularData({
                ...props,
                LastRefreshed: response["Meta Data"]["3. Last Refreshed"],
                OutputSize: response["Meta Data"]["5. Output Size"],
                TimeZone: response["Meta Data"]["6. Time Zone"],
                data: Object.values(groups).flat(),
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

    return (
        <div>
            <Row>
                <Col style={{ textAlign: 'right' }}>
                    <ButtonGroup className="mb-2">
                        <DropdownButton id="dropdown-basic-button" title={tabularData["SeriesType"]} style={{ marginLeft: '10px' }}>
                            {
                                metaData["Series Type"].map((seriesType) => (
                                    <Dropdown.Item key={seriesType}>{seriesType}</Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button" title={tabularData["Symbol"]} style={{ marginLeft: '10px' }}>
                            {
                                metaData["Symbol"].map((symbol) => (
                                    <Dropdown.Item key={symbol}>{symbol}</Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button" title={tabularData["Interval"]} style={{ marginLeft: '10px' }}>
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
                        <DropdownButton id="dropdown-basic-button" title={date} style={{ marginLeft: '10px', textAlign: 'right' }}>
                            {
                                Object.keys(groupData(tabularData.data)).map((entry) => (
                                    <Dropdown.Item key={entry}
                                        onClick={async () => {
                                            await setDate(entry)
                                            console.log(entry)
                                        }}>
                                        {entry}
                                    </Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                    </ButtonGroup>
                </Col>
            </Row>

            <div>
                <Tabular tabularData={tabularData} groupData={groupData(tabularData.data)[date]} refresh={refresh} intradayData={intradayData} />
            </div>

            <div style={{ marginTop: "20px"}}>
                <AreaResponsiveContainer data={groupData(tabularData.data)[date]} refresh={refresh} intradayData={intradayData} />
            </div>
        </div>
    )
}

export default Home;


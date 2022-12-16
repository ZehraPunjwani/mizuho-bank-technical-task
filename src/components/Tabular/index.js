import {Button, ButtonGroup, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const Tabular = ({ tabularData, date, refresh, intradayData }) => {

    const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {

        return (
            <div style={ { display: 'flex', flexDirection: 'column', fontSize: '14px' } }>
                {/*{ column.text }*/}
                { sortElement }
                { filterElement }
            </div>
        );
    }

    const cellFormatter = (cell, row) => (
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

    const columns = [
        {
            dataField: 'Timestamp',
            text: 'Timestamp',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }

        },
        {
            dataField: 'Open',
            text: 'Open',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: cellFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: 'High',
            text: 'High',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: cellFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: 'Low',
            text: 'Low',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: cellFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: 'Close',
            text: 'Close',
            sort: true,
            filter: textFilter({ onFilter: customFilter }),
            headerFormatter: headerFormatter,
            formatter: cellFormatter,
            style: (cell, row, rowIndex, colIndex) => {
                return { color: 'black', fontSize: '14px' };
            }
        },
        {
            dataField: 'Volume',
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
                <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '25vh', minWidth: '100%' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            )
        } else {
            if (intradayData.error) {
                return (
                    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '25vh', minWidth: '100%' }}>
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
                            defaultSorted={[{ dataField: 'Timestamp', order: 'desc' }]}
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
                    <Col style={{ textAlign: 'left' }}>
                        TIME_SERIES_INTRADAY Tabular
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        Last Refreshed: {tabularData.LastRefreshed} {tabularData.TimeZone}
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <ToolkitProvider keyField='Timestamp' data={tabularData.data.filter((entry) => entry["Timestamp"].includes(date))} columns={columns} exportCSV={ { onlyExportFiltered: true, exportAll: false } }>
                    {props => (
                        <Row>
                            <Col style={{ textAlign: 'left' }}>
                                <ButtonGroup className="mb-2">
                                    <MyExportCSV {...props.csvProps} />
                                </ButtonGroup>
                                {loadContent(props)}
                            </Col>
                        </Row>
                    )}
                </ToolkitProvider>
            </Card.Body>
        </Card>
    )
}

export default Tabular

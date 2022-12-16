import { ComposedChart, Line, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';

const AreaResponsiveContainer = ({ data, refresh, intradayData }) => {
    const loadContent = () => {
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
                    <div style={{width: '100%', height: 800}}>
                        <ResponsiveContainer>
                            <ComposedChart width={500} height={400} data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="Timestamp" />
                                <YAxis domain={['dataMin', 'dataMax']} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Open" stroke="#ff7300" fill="#ff7300" />
                                <Line type="monotone" dataKey="High" stroke="green" fill="#413ea0" />
                                <Line type="monotone" dataKey="Low" stroke="red" fill="#8884d8" />
                                <Line type="monotone" dataKey="Close" stroke="blue" fill="#ff7300" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
        }
    }

    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col style={{ textAlign: 'left' }}>TIME_SERIES_INTRADAY Area Responsive Chart</Col>
                </Row>
            </Card.Header>
            <Card.Body>
                {loadContent()}
            </Card.Body>
        </Card>
    )
}

export default AreaResponsiveContainer

import { Card } from "react-bootstrap";

const About = () => {
    return (
        <Card>
            <Card.Header>About this API</Card.Header>
            <Card.Body>
                <Card.Title>TIME_SERIES_INTRADAY Trending</Card.Title>
                <Card.Text>
                    <div>This API returns intraday time series of the equity specified, covering extended trading hours where applicable (e.g., 4:00am to 8:00pm Eastern Time for the US market). The intraday data is derived from the Securities Information Processor (SIP) market-aggregated data. You can query both raw (as-traded) and split/dividend-adjusted intraday data from this endpoint.</div>

                    <div>This API returns the most recent 1-2 months of intraday data and is best suited for short-term/medium-term charting and trading strategy development. If you are targeting a deeper intraday history, please use the Extended Intraday API.</div>

                    <hr />
                    <div>API: https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo</div>
                    <div>Documentation - https://www.alphavantage.co/documentation/#intraday</div>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default About;

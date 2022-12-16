import Tabular from "../Tabular";
import AreaResponsiveContainer from "../AreaResponsiveContainer";

const Home = () => {
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

            <div style={{ marginBottom: '20px' }}>
                <Tabular />
            </div>

            <div>
                <AreaResponsiveContainer />
            </div>
        </div>
    )
}

export default Home;

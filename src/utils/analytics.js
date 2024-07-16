import ReactGA from 'react-ga4';

const TRACKING_ID = "G-MHRCWZN6Q0"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(TRACKING_ID);

export const logPageView = () => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

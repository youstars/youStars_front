import ReactDOM from 'react-dom/client';
import App from './app/App';
import 'shared/i18n/i18n';
import {Provider} from "react-redux";
import store from 'shared/store';
import ThemeProvider from 'shared/providers/theme/ThemeProvider';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </Provider>
);



import ReactDOM from 'react-dom/client';
import App from './app/App';
import ThemeProvider from "./app/provider/ThemeProvider/ui/ThemeProvider";
import 'shared/i18n/i18n';
import { Provider } from "react-redux";
import store from 'shared/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		 <ThemeProvider>
			 <App/>
		 </ThemeProvider>
		 </Provider>
);



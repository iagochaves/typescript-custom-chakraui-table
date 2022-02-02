import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import {Component} from "react";

class MyApp extends Component<{ Component: any, pageProps: any }> {
    render() {
        let {Component, pageProps} = this.props;
        return (
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        );
    }
}

export default MyApp;

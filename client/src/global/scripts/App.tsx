import * as React from "react";
import {Header} from "../../components/library/Header/Header";
import {Tape} from "../../components/library/Tape/Tape";
import {Footer} from "../../components/library/Footer/Footer";

export const App: React.FunctionComponent = () => {
    return <>
                <Header menuExpanded={false}/>
                <Tape/>
                <Footer/>
            </>
};





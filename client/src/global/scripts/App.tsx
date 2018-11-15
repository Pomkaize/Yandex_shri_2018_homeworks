import * as React from "react";
import {Tape} from "../../components/library/Tape/Tape";
import {Footer} from "../../components/library/Footer/Footer";
import {RegistryConsumer} from "@bem-react/di";
import {cn} from "@bem-react/classname";
import {iHeaderProps} from "../../components/library/Header/Header@desktop";

export const cnApp = cn('App');
export const cnHeader = cn('Header');

export const App: React.FunctionComponent = () => (
        <RegistryConsumer>
            {registries => {
                    const registry = registries[cnApp()];
                    const Header = registry.get<iHeaderProps>(cnHeader());
                    return <div>
                        <Header menuExpanded={false}/>
                         <Tape/>
                         <Footer/>
                    </div>
                    }
                }
        </RegistryConsumer>);

import * as React from "react";
import {Header} from "../../components/library/Header/Header@desktop";
import {cn} from "@bem-react/classname";
import {Registry, withRegistry} from "@bem-react/di";
import {App, cnApp, cnHeader} from "./App";



const registry = new Registry({ id: cnApp()});

registry.set(cnHeader(), Header);

export const AppDesktop = withRegistry(registry)(App);

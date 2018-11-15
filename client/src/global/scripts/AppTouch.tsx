import * as React from "react";
import {Header} from "../../components/library/Header/Header@touch";
import {cn} from "@bem-react/classname";
import {Registry, withRegistry} from "@bem-react/di";
import {App, cnApp, cnHeader} from "./App";

const registry = new Registry({ id: cnApp()});

registry.set(cnHeader(), Header);

export const AppTouch = withRegistry(registry)(App);
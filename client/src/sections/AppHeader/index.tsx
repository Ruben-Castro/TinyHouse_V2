import React, { useState, useEffect } from "react";
import { Layout, Input } from "antd";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";

import logo from "./assets/tinyhouse-logo.png";
import { displayErrorMessage } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Search } = Input;

const { Header } = Layout;

export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
      //location
      const { pathname } = location;
      const pathnameSubStrings = pathname.split("/");

      if(!pathname.includes("/listings")){
        setSearch("");
        return;
      }

      if(pathname.includes('/listings')&& pathnameSubStrings.length === 3){
        setSearch(pathnameSubStrings[2])
        return;
      }

    }, [location]);
    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("please enter a valid search!");
      }
    };

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App Logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              placeholder="Search San Fransisco"
              enterButton
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);

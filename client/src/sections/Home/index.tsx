import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { HomeHero } from "./components";
import { Col, Row, Layout, Typography } from "antd";
import { displayErrorMessage } from "../../lib/utils";
import mapBackground from "./assets/map-background.jpg";
import { Link } from "react-router-dom";

import cancunImage from "./assets/cancun.jpg";
import sanFransiscoImage from "./assets/san-fransisco.jpg";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
export const Home = ({ history }: RouteComponentProps) => {
  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a vaild search!");
    }
  };

  return (
    <Content style={{ backgroundImage: `url(${mapBackground})` }}>
      <HomeHero onSearch={onSearch} />
      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your Guide to all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations.
        </Paragraph>
        <Link
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
          to="/listings/united%20states"
        >
          Popular listings in the United States
        </Link>
      </div>
      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-conver">
                <img
                  src={sanFransiscoImage}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>

          <Col xs={24} sm={12}>
            <Link to="/listings/cancún">
              <div className="home__listings-img-conver">
                <img
                  src={cancunImage}
                  alt="Cancún"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>

        </Row>
      </div>
    </Content>
  );
};
import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Affix, Layout, List, Typography } from "antd";
import { ListingCard } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton,
} from "./components";
import { ErrorBanner } from "../../lib/components";

interface MatchParams {
  location: string;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const locationRef = useRef(match.params.location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, error, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationRef.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page: page,
      },
    }
  );

  useEffect(() => {
    setPage(1);
    locationRef.current = match.params.location;
  }, [match.params.location]);

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common key words" />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsRegionElement = listingsRegion ? (
    <Title className="listings__title" level={3}>
      Results for the listing region {listingsRegion}
    </Title>
  ) : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            lg: 4,
          }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
          No listings have been created for{" "}
          <Text mark> "{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to creat a{" "}
          <Link to="/host">listing in this area</Link>!
        </Paragraph>
      </div>
    );

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
